import { describe, it, expect } from "vitest";
import { parseIcsContent } from "@/lib/calendar/parseIcs";

const SAMPLE_ICS = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test//EN
BEGIN:VEVENT
UID:airbnb-test-1
DTSTART;VALUE=DATE:20260701
DTEND;VALUE=DATE:20260704
SUMMARY:Reserved
END:VEVENT
END:VCALENDAR`;

describe("parseIcsContent", () => {
    it("parses VEVENT blocks into check-in and check-out dates", () => {
        const events = parseIcsContent(SAMPLE_ICS);

        expect(events).toHaveLength(1);
        expect(events[0].uid).toBe("airbnb-test-1");
        expect(events[0].checkIn.getFullYear()).toBe(2026);
        expect(events[0].checkIn.getMonth()).toBe(6);
        expect(events[0].checkIn.getDate()).toBe(1);
        expect(events[0].checkOut.getFullYear()).toBe(2026);
        expect(events[0].checkOut.getMonth()).toBe(6);
        expect(events[0].checkOut.getDate()).toBe(4);
    });
});
