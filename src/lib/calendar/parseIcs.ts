import { ExternalCalendarEvent } from "@/types/calendar.types";

function toDateOnly(value: Date): Date {
    const date = new Date(value);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function normalizeEndDate(start: Date, end: Date): Date {
    const startDay = toDateOnly(start);
    const endDay = toDateOnly(end);

    if (endDay.getTime() <= startDay.getTime()) {
        const nextDay = new Date(startDay);
        nextDay.setUTCDate(nextDay.getUTCDate() + 1);
        return nextDay;
    }

    return endDay;
}

export async function parseIcsContent(
    content: string
): Promise<ExternalCalendarEvent[]> {
    const ical = await import("node-ical");
    const parsed = ical.sync.parseICS(content);
    const events: ExternalCalendarEvent[] = [];

    for (const item of Object.values(parsed)) {
        if (!item || item.type !== "VEVENT") continue;

        const start = item.start;
        const end = item.end ?? item.start;
        if (!start || !item.uid) continue;

        const checkIn = toDateOnly(start);
        const checkOut = normalizeEndDate(checkIn, toDateOnly(end));

        events.push({
            uid: String(item.uid),
            checkIn,
            checkOut,
        });
    }

    return events;
}

export async function fetchAndParseIcs(importUrl: string): Promise<ExternalCalendarEvent[]> {
    const response = await fetch(importUrl, {
        headers: { Accept: "text/calendar" },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch calendar (${response.status})`);
    }

    const content = await response.text();
    return parseIcsContent(content);
}
