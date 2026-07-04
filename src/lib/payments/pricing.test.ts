import { describe, it, expect, vi, beforeEach } from "vitest";
import { computeBookingPrice } from "@/lib/payments/pricing";
import Property from "@/models/Property";
import { BookingType } from "@/types";
import { Property as PropertyEnum } from "@/enums";

vi.mock("@/models/Property", () => ({
    default: {
        findOne: vi.fn(),
    },
}));

describe("computeBookingPrice", () => {
    const baseBooking: BookingType = {
        bookerGender: "male",
        propertyName: "La Villa Perlata",
        propertyId: PropertyEnum.LA_VILLA_PERLATA,
        checkIn: new Date("2026-06-01"),
        checkOut: new Date("2026-06-03"),
        checkInTime: "15:00",
        checkOutTime: "11:00",
        numberOfGuests: 2,
        guests: [{ name: "Extra Guest", gender: "female" }],
    };

    beforeEach(() => {
        vi.mocked(Property.findOne).mockReset();
    });

    it("returns error when property is not found", async () => {
        vi.mocked(Property.findOne).mockResolvedValue(null);

        const result = await computeBookingPrice(baseBooking);

        expect(result.totalPrice).toBe(0);
        expect(result.error).toBe("Property not found");
    });

    it("calculates total price from property rates and guest count", async () => {
        vi.mocked(Property.findOne).mockResolvedValue({
            price_per_night: 20,
            price_per_additional_guest: 15,
        } as Awaited<ReturnType<typeof Property.findOne>>);

        const result = await computeBookingPrice(baseBooking);

        expect(result.error).toBeUndefined();
        expect(result.totalPrice).toBe(2 * (20 + 15));
    });

    it("derives guest count from guests array, ignoring client numberOfGuests", async () => {
        vi.mocked(Property.findOne).mockResolvedValue({
            price_per_night: 20,
            price_per_additional_guest: 15,
        } as Awaited<ReturnType<typeof Property.findOne>>);

        const result = await computeBookingPrice({
            ...baseBooking,
            numberOfGuests: 99,
            guests: [{ name: "Extra Guest", gender: "female" }],
        });

        expect(result.error).toBeUndefined();
        expect(result.totalPrice).toBe(2 * (20 + 15));
    });

    it("returns error when dates are missing", async () => {
        vi.mocked(Property.findOne).mockResolvedValue({
            price_per_night: 20,
            price_per_additional_guest: 15,
        } as Awaited<ReturnType<typeof Property.findOne>>);

        const result = await computeBookingPrice({
            ...baseBooking,
            checkIn: undefined,
            checkOut: undefined,
        });

        expect(result.totalPrice).toBe(0);
        expect(result.error).toBe("Missing check-in or check-out dates");
    });
});
