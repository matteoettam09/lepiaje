import Room from "@/models/Room";
import Bed from "@/models/Bed";
import Property from "@/models/Property";
import { BookingType, Guests, Occupant } from "@/types";
import { Property as PropertyEnum } from "@/enums";

function isBedOccupied(
    bed: { occupants: Occupant[] },
    checkIn: Date | string,
    checkOut: Date | string
): boolean {
    return bed.occupants.some((occupant) => {
        const existingCheckIn = new Date(occupant.check_in);
        const existingCheckOut = new Date(occupant.check_out);
        const newCheckIn = new Date(checkIn);
        const newCheckOut = new Date(checkOut);
        return newCheckIn < existingCheckOut && newCheckOut > existingCheckIn;
    });
}

export async function assignBedsForBooking(
    booking: BookingType
): Promise<{ success: boolean; reason?: string }> {
    const property = await Property.findOne({ id: booking.propertyId });
    if (!property) {
        return { success: false, reason: "Property not found" };
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
        const mixedRooms = await Room.find({
            uuid: { $in: property.rooms },
            gender: "mixed",
        });
        const mixedRoomBeds = await Bed.find({
            uuid: { $in: mixedRooms.flatMap((room) => room.beds) },
        });

        const firstAvailableBed = mixedRoomBeds.find(
            (bed) => !isBedOccupied(bed, booking.checkIn!, booking.checkOut!)
        );

        if (!firstAvailableBed) {
            return { success: false, reason: "No beds available" };
        }

        firstAvailableBed.occupants.push({
            name: booking.bookerName || "Property hold",
            gender: "mixed",
            check_in: booking.checkIn!,
            check_out: booking.checkOut!,
            source:
                booking.bookerEmail === "blocked@lepiaje.com" ? "admin" : "internal",
        });
        await firstAvailableBed.save();
        return { success: true };
    }

    if (property.id === PropertyEnum.AL_CENTESIMO_CHILOMETRO) {
        const propertyRooms = await Room.find({ uuid: { $in: property.rooms } });
        const femaleRoom = propertyRooms.find((room) => room.gender === "female");
        const maleRoom = propertyRooms.find((room) => room.gender === "male");

        if (!femaleRoom || !maleRoom) {
            return { success: false, reason: "Room configuration incomplete" };
        }

        const bedsForFemale = await Bed.find({ uuid: { $in: femaleRoom.beds } });
        const bedsForMale = await Bed.find({ uuid: { $in: maleRoom.beds } });

        const maleGuests = allGuests.filter((guest) => guest.gender === "male");
        const femaleGuests = allGuests.filter((guest) => guest.gender === "female");

        const assignGuestsToBeds = async (
            targetBeds: typeof bedsForMale,
            guests: Guests[]
        ) => {
            let remainingGuests = [...guests];
            for (const bed of targetBeds) {
                if (remainingGuests.length === 0) break;
                const guest = remainingGuests[0];
                if (guest && !isBedOccupied(bed, guest.check_in!, guest.check_out!)) {
                    bed.occupants.push({
                        name: guest.name,
                        gender: guest.gender,
                        check_in: guest.check_in!,
                        check_out: guest.check_out!,
                        source:
                            booking.bookerEmail === "blocked@lepiaje.com"
                                ? "admin"
                                : "internal",
                    });
                    await bed.save();
                    remainingGuests = remainingGuests.slice(1);
                }
            }
            return remainingGuests.length === 0;
        };

        const maleAssigned =
            maleGuests.length === 0 ||
            (await assignGuestsToBeds(bedsForMale, maleGuests));
        const femaleAssigned =
            femaleGuests.length === 0 ||
            (await assignGuestsToBeds(bedsForFemale, femaleGuests));

        if (!maleAssigned || !femaleAssigned) {
            return { success: false, reason: "Could not assign all guests to beds" };
        }

        return { success: true };
    }

    return { success: false, reason: "Unknown property" };
}
