import Room from "@/models/Room";
import Bed from "@/models/Bed";
import Property from "@/models/Property";
import { Property as PropertyEnum } from "@/enums";
import { Occupant } from "@/types";

export interface AvailabilityRoom {
    roomUuid: string;
    occupants: Occupant[];
}

export interface AvailabilityData {
    mixed_rooms?: AvailabilityRoom[];
    male_rooms?: AvailabilityRoom[];
    female_rooms?: AvailabilityRoom[];
}

export async function getAvailabilityData(
    propertyId: number
): Promise<AvailabilityData | null> {
    const property = await Property.findOne({ id: propertyId });
    if (!property?.rooms?.length) return null;

    const rooms = await Room.find({ uuid: { $in: property.rooms } });
    const allBedUuids = rooms.flatMap((room) => room.beds);
    const beds = await Bed.find({ uuid: { $in: allBedUuids } });
    const bedMap = new Map(beds.map((bed) => [bed.uuid, bed]));

    const toAvailabilityRooms = (roomList: typeof rooms): AvailabilityRoom[] =>
        roomList.flatMap((room) =>
            room.beds
                .map((bedUuid: string) => {
                    const bed = bedMap.get(bedUuid);
                    if (!bed) return null;
                    return {
                        roomUuid: bed.uuid,
                        occupants: bed.occupants,
                    };
                })
                .filter(Boolean) as AvailabilityRoom[]
        );

    if (propertyId === PropertyEnum.LA_VILLA_PERLATA) {
        const mixedRooms = rooms.filter((room) => room.gender === "mixed");
        return { mixed_rooms: toAvailabilityRooms(mixedRooms) };
    }

    if (propertyId === PropertyEnum.AL_CENTESIMO_CHILOMETRO) {
        const maleRooms = rooms.filter((room) => room.gender === "male");
        const femaleRooms = rooms.filter((room) => room.gender === "female");
        return {
            male_rooms: toAvailabilityRooms(maleRooms),
            female_rooms: toAvailabilityRooms(femaleRooms),
        };
    }

    return null;
}
