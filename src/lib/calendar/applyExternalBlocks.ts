import Bed from "@/models/Bed";
import { getPropertyBeds } from "@/lib/calendar/propertyBeds";
import { CalendarPlatform, ExternalCalendarEvent } from "@/types/calendar.types";
import { OccupantSource } from "@/types/bed.types";

function blockLabel(platform: CalendarPlatform): string {
    return platform === "airbnb" ? "Airbnb block" : "Booking.com block";
}

export async function applyExternalBlocks(
    propertyId: number,
    platform: CalendarPlatform,
    events: ExternalCalendarEvent[]
): Promise<void> {
    const beds = await getPropertyBeds(propertyId);
    if (beds.length === 0) return;

    const source = platform as OccupantSource;
    const activeUids = new Set(events.map((event) => event.uid));
    const eventsByUid = new Map(events.map((event) => [event.uid, event]));

    for (const bed of beds) {
        bed.occupants = bed.occupants.filter((occupant) => {
            if (occupant.source !== source) return true;
            return activeUids.has(occupant.externalUid || "");
        });

        for (const event of events) {
            const existing = bed.occupants.find(
                (occupant) => occupant.externalUid === event.uid
            );

            if (existing) {
                existing.check_in = event.checkIn;
                existing.check_out = event.checkOut;
                existing.name = blockLabel(platform);
                existing.source = source;
                continue;
            }

            bed.occupants.push({
                name: blockLabel(platform),
                gender: bed.room_gender,
                check_in: event.checkIn,
                check_out: event.checkOut,
                source,
                externalUid: event.uid,
            });
        }

        await bed.save();
    }
}

export async function clearExternalBlocksForPlatform(
    propertyId: number,
    platform: CalendarPlatform
): Promise<void> {
    const beds = await getPropertyBeds(propertyId);
    const source = platform as OccupantSource;

    for (const bed of beds) {
        const nextOccupants = bed.occupants.filter(
            (occupant) => occupant.source !== source
        );
        if (nextOccupants.length !== bed.occupants.length) {
            await Bed.updateOne(
                { uuid: bed.uuid },
                { $set: { occupants: nextOccupants } }
            );
        }
    }
}
