import Room from "@/models/Room";
import Bed from "@/models/Bed";
import Property from "@/models/Property";
import { BookingType, Guests, Occupant } from "@/types";
import { Property as PropertyEnum } from "@/enums";
import { checkBedsAvailability } from "@/utils/check_beds_availability";

function datesOverlap(
    checkIn: Date | string,
    checkOut: Date | string,
    occupant: Occupant
): boolean {
    const newCheckIn = new Date(checkIn);
    const newCheckOut = new Date(checkOut);
    const existingCheckIn = new Date(occupant.check_in);
    const existingCheckOut = new Date(occupant.check_out);
    return newCheckIn < existingCheckOut && newCheckOut > existingCheckIn;
}

export async function checkPropertyAvailability(
    booking: BookingType
): Promise<{ available: boolean; reason?: string }> {
    const property = await Property.findOne({ id: booking.propertyId });
    if (!property) {
        return { available: false, reason: "Property not found" };
    }

    const allGuests: Guests[] = [
        {
            name: booking.bookerName || "Guest",
            gender: booking.bookerGender,
            check_in: booking.checkIn,
            check_out: booking.checkOut,
        },
        ...booking.guests,
    ];

    if (property.id === PropertyEnum.LA_VILLA_PERLATA) {
        const roomUuids = property.rooms;
        if (!roomUuids?.length) {
            return { available: false, reason: "No rooms configured" };
        }

        const mixedRooms = await Room.find({
            uuid: { $in: roomUuids },
            gender: "mixed",
        });
        const mixedRoomBeds = await Bed.find({
            uuid: { $in: mixedRooms.flatMap((room) => room.beds) },
        });

        if (!mixedRoomBeds.length) {
            return { available: false, reason: "No beds found" };
        }

        const checkInDate = new Date(booking.checkIn!);
        const checkOutDate = new Date(booking.checkOut!);

        const propertyOccupied = mixedRoomBeds.some((bed) =>
            bed.occupants.some((occupant: Occupant) =>
                datesOverlap(checkInDate, checkOutDate, occupant)
            )
        );

        if (propertyOccupied) {
            return { available: false, reason: "Property is not available for these dates" };
        }

        return { available: true };
    }

    if (property.id === PropertyEnum.AL_CENTESIMO_CHILOMETRO) {
        const propertyRooms = await Room.find({ uuid: { $in: property.rooms } });
        const femaleRoom = propertyRooms.find((room) => room.gender === "female");
        const maleRoom = propertyRooms.find((room) => room.gender === "male");

        if (!femaleRoom || !maleRoom) {
            return { available: false, reason: "Room configuration incomplete" };
        }

        const bedsForFemale = await Bed.find({ uuid: { $in: femaleRoom.beds } });
        const bedsForMale = await Bed.find({ uuid: { $in: maleRoom.beds } });

        const maleGuests = allGuests.filter((guest) => guest.gender === "male");
        const femaleGuests = allGuests.filter((guest) => guest.gender === "female");

        if (maleGuests.length > 0) {
            const { passed } = checkBedsAvailability(bedsForMale, booking, maleGuests.length);
            if (!passed) {
                return { available: false, reason: "Not enough male beds available" };
            }
        }

        if (femaleGuests.length > 0) {
            const { passed } = checkBedsAvailability(bedsForFemale, booking, femaleGuests.length);
            if (!passed) {
                return { available: false, reason: "Not enough female beds available" };
            }
        }

        return { available: true };
    }

    return { available: false, reason: "Unknown property" };
}
