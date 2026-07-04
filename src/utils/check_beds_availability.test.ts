import { describe, it, expect } from "vitest";
import { checkBedsAvailability } from "@/utils/check_beds_availability";
import { Bed, BookingType } from "@/types";

describe("checkBedsAvailability", () => {
    const booking: BookingType = {
        propertyId: 2,
        propertyName: "Test",
        checkIn: "2026-06-10",
        checkOut: "2026-06-12",
        numberOfGuests: 2,
        guests: [],
        bookerGender: "male",
        checkInTime: "15:00",
        checkOutTime: "11:00",
    };

    it("returns passed when enough beds are free", () => {
        const beds: Bed[] = [
            {
                uuid: "1",
                room_gender: "male",
                occupants: [],
                submittedAt: new Date(),
                is_occupied: false,
                _id: {} as Bed["_id"],
                __v: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                uuid: "2",
                room_gender: "male",
                occupants: [],
                submittedAt: new Date(),
                is_occupied: false,
                _id: {} as Bed["_id"],
                __v: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        const { passed, availableBeds } = checkBedsAvailability(beds, booking, 2);
        expect(passed).toBe(true);
        expect(availableBeds).toBe(2);
    });

    it("returns failed when beds are occupied for overlapping dates", () => {
        const beds: Bed[] = [
            {
                uuid: "1",
                room_gender: "male",
                occupants: [
                    {
                        name: "Guest",
                        gender: "male",
                        check_in: new Date("2026-06-09"),
                        check_out: new Date("2026-06-11"),
                    },
                ],
                submittedAt: new Date(),
                is_occupied: true,
                _id: {} as Bed["_id"],
                __v: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        const { passed } = checkBedsAvailability(beds, booking, 1);
        expect(passed).toBe(false);
    });
});
