import ical, { ICalCalendarMethod } from "ical-generator";
import { getPropertyBeds } from "@/lib/calendar/propertyBeds";
import { Occupant } from "@/types";

function occupantKey(occupant: Occupant): string {
    const checkIn = new Date(occupant.check_in).toISOString().split("T")[0];
    const checkOut = new Date(occupant.check_out).toISOString().split("T")[0];
    return `${checkIn}|${checkOut}`;
}

export async function buildPropertyIcs(propertyId: number): Promise<string> {
    const beds = await getPropertyBeds(propertyId);
    const seen = new Set<string>();
    const calendar = ical({
        name: `Le Piaje property ${propertyId}`,
        method: ICalCalendarMethod.PUBLISH,
        prodId: { company: "Le Piaje", product: "Calendar Sync" },
    });

    for (const bed of beds) {
        for (const occupant of bed.occupants) {
            const key = occupantKey(occupant);
            if (seen.has(key)) continue;
            seen.add(key);

            calendar.createEvent({
                start: new Date(occupant.check_in),
                end: new Date(occupant.check_out),
                allDay: true,
                summary: "Blocked - Le Piaje",
                description: "Unavailable on Le Piaje",
            });
        }
    }

    return calendar.toString();
}
