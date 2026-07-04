import { describe, it, expect } from "vitest";
import { countBookingGuests, withGuestCount } from "@/lib/booking/guestCount";

describe("guestCount", () => {
    it("counts booker only when guests array is empty", () => {
        expect(countBookingGuests({ guests: [] })).toBe(1);
    });

    it("counts booker plus additional guests", () => {
        expect(
            countBookingGuests({
                guests: [
                    { name: "Guest A", gender: "male" },
                    { name: "Guest B", gender: "female" },
                ],
            })
        ).toBe(3);
    });

    it("treats missing guests as booker only", () => {
        expect(countBookingGuests({})).toBe(1);
        expect(countBookingGuests({ guests: null })).toBe(1);
    });

    it("withGuestCount overwrites numberOfGuests on the booking", () => {
        const booking = withGuestCount({
            guests: [{ name: "Guest", gender: "male" }],
            numberOfGuests: 99,
        });

        expect(booking.numberOfGuests).toBe(2);
    });
});
