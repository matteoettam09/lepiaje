import Property from "@/models/Property";
import Room from "@/models/Room";
import Bed from "@/models/Bed";

export async function getPropertyBeds(propertyId: number) {
    const property = await Property.findOne({ id: propertyId });
    if (!property?.rooms?.length) {
        return [];
    }

    const rooms = await Room.find({ uuid: { $in: property.rooms } });
    const bedUuids = rooms.flatMap((room) => room.beds);
    return Bed.find({ uuid: { $in: bedUuids } });
}
