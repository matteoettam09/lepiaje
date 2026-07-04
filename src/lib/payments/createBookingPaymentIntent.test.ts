import { describe, it, expect, vi, beforeEach } from "vitest";
import { createBookingPaymentIntent } from "@/lib/payments/createBookingPaymentIntent";
import { createMockStripe } from "@/__tests__/mocks/stripe";
import { BookingType } from "@/types";
import { Property as PropertyEnum } from "@/enums";

const { findOneAndUpdate } = vi.hoisted(() => ({
    findOneAndUpdate: vi.fn().mockResolvedValue(null),
}));

vi.mock("@/models/Booking", () => ({
    default: {
        findOneAndUpdate,
    },
}));

describe("createBookingPaymentIntent", () => {
    const booking: BookingType = {
        uuid: "booking-uuid-1",
        bookerName: "Guest",
        bookerEmail: "guest@example.com",
        bookerGender: "male",
        propertyName: "La Villa Perlata",
        propertyId: PropertyEnum.LA_VILLA_PERLATA,
        checkIn: new Date("2026-07-01"),
        checkOut: new Date("2026-07-03"),
        checkInTime: "15:00",
        checkOutTime: "11:00",
        numberOfGuests: 1,
        guests: [],
        bookingReference: "LP-TEST123",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("creates PaymentIntent with correct amount and metadata", async () => {
        const stripe = createMockStripe();

        const result = await createBookingPaymentIntent(stripe, booking, 175);

        expect(stripe.paymentIntents.create).toHaveBeenCalledWith({
            amount: 17500,
            currency: "eur",
            description: "Booking LP-TEST123 - La Villa Perlata",
            metadata: {
                bookingUuid: "booking-uuid-1",
                bookingReference: "LP-TEST123",
                bookerEmail: "guest@example.com",
            },
            receipt_email: "guest@example.com",
        });
        expect(result.clientSecret).toBe("pi_test_123_secret");
        expect(result.paymentIntentId).toBe("pi_test_123");
        expect(result.bookingReference).toBe("LP-TEST123");
        expect(result.amount).toBe(175);
    });

    it("stores stripePaymentIntentId on the booking", async () => {
        const stripe = createMockStripe();

        await createBookingPaymentIntent(stripe, booking, 175);

        expect(findOneAndUpdate).toHaveBeenCalledWith(
            { uuid: "booking-uuid-1" },
            { stripePaymentIntentId: "pi_test_123" }
        );
    });

    it("throws when Stripe does not return a client secret", async () => {
        const stripe = createMockStripe({
            paymentIntentsCreate: {
                id: "pi_no_secret",
                client_secret: null,
                amount: 17500,
                currency: "eur",
                status: "requires_payment_method",
                metadata: {},
            } as never,
        });

        await expect(
            createBookingPaymentIntent(stripe, booking, 175)
        ).rejects.toThrow("Stripe did not return a client secret");
    });
});
