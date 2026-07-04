import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import {
    connectMemoryDb,
    clearMemoryDb,
    disconnectMemoryDb,
} from "@/__tests__/helpers/mongoMemoryServer";
import { seedTestDatabase } from "@/__tests__/helpers/seedTestDb";
import Bed from "@/models/Bed";
import { applyExternalBlocks } from "@/lib/calendar/applyExternalBlocks";
import { buildPropertyIcs } from "@/lib/calendar/exportIcs";
import { getPropertyBeds } from "@/lib/calendar/propertyBeds";
import { Property as PropertyEnum } from "@/enums";

describe("calendar sync integration", () => {
    beforeAll(async () => {
        await connectMemoryDb();
    });

    afterAll(async () => {
        await disconnectMemoryDb();
    });

    beforeEach(async () => {
        await clearMemoryDb();
        await seedTestDatabase();
    });

    it("imports external Airbnb blocks onto all villa beds", async () => {
        await applyExternalBlocks(PropertyEnum.LA_VILLA_PERLATA, "airbnb", [
            {
                uid: "airbnb-1",
                checkIn: new Date("2026-08-01"),
                checkOut: new Date("2026-08-05"),
            },
        ]);

        const beds = await getPropertyBeds(PropertyEnum.LA_VILLA_PERLATA);
        expect(beds.length).toBeGreaterThan(0);
        for (const bed of beds) {
            expect(
                bed.occupants.some(
                    (occupant) =>
                        occupant.source === "airbnb" &&
                        occupant.externalUid === "airbnb-1"
                )
            ).toBe(true);
        }
    });

    it("removes stale external blocks but keeps internal occupants", async () => {
        const bed = await Bed.findOne({});
        expect(bed).toBeTruthy();
        bed!.occupants.push({
            name: "Guest",
            gender: bed!.room_gender,
            check_in: new Date("2026-09-01"),
            check_out: new Date("2026-09-03"),
            source: "internal",
        });
        await bed!.save();

        await applyExternalBlocks(PropertyEnum.LA_VILLA_PERLATA, "airbnb", [
            {
                uid: "airbnb-1",
                checkIn: new Date("2026-08-01"),
                checkOut: new Date("2026-08-05"),
            },
        ]);

        await applyExternalBlocks(PropertyEnum.LA_VILLA_PERLATA, "airbnb", []);

        const updatedBed = await Bed.findOne({ uuid: bed!.uuid });
        expect(updatedBed!.occupants.some((occupant) => occupant.source === "airbnb")).toBe(
            false
        );
        expect(updatedBed!.occupants.some((occupant) => occupant.source === "internal")).toBe(
            true
        );
    });

    it("exports blocked dates as an ics feed", async () => {
        await applyExternalBlocks(PropertyEnum.LA_VILLA_PERLATA, "booking", [
            {
                uid: "booking-1",
                checkIn: new Date("2026-10-01"),
                checkOut: new Date("2026-10-03"),
            },
        ]);

        const ics = await buildPropertyIcs(PropertyEnum.LA_VILLA_PERLATA);
        expect(ics).toContain("BEGIN:VCALENDAR");
        expect(ics).toContain("Blocked - Le Piaje");
    });
});
