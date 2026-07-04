import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/payment/route";
import { HttpStatusCode } from "@/enums";
import { Property as PropertyEnum } from "@/enums";
import { createMockStripe } from "@/__tests__/mocks/stripe";
import { getStripeClient } from "@/lib/payments/stripeClient";
import { computeBookingPrice } from "@/lib/payments/pricing";
import { createPendingBooking } from "@/lib/booking/bookingService";
import { createBookingPaymentIntent } from "@/lib/payments/createBookingPaymentIntent";
import { VILLA_MAX_GUESTS } from "@/constants/villa_pricing";

vi.mock("@/config/db", () => ({
    connection: vi.fn().mockResolvedValue(true),
}));

vi.mock("@/lib/payments/stripeClient", () => ({
    getStripeClient: vi.fn(),
}));

vi.mock("@/lib/payments/pricing", () => ({
    computeBookingPrice: vi.fn(),
}));

vi.mock("@/lib/booking/bookingService", () => ({
    createPendingBooking: vi.fn(),
}));

vi.mock("@/lib/email/sendBookingRequestEmails", () => ({
    sendBookingRequestEmails: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/payments/createBookingPaymentIntent", () => ({
    createBookingPaymentIntent: vi.fn(),
}));

vi.mock("@/models/Log", () => {
    class MockLog {
        save = vi.fn().mockResolvedValue({});
    }
    return { default: MockLog };
});

const baseBookingData = {
    bookerName: "Guest",
    bookerEmail: "guest@example.com",
    bookerGender: "male",
    propertyName: "La Villa Perlata",
    propertyId: PropertyEnum.LA_VILLA_PERLATA,
    checkIn: new Date("2026-08-01"),
    checkOut: new Date("2026-08-03"),
    checkInTime: "15:00",
    checkOutTime: "11:00",
    numberOfGuests: 1,
    guests: [{ name: "Guest", gender: "male" }],
};

describe("POST /api/payment", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(getStripeClient).mockReturnValue(createMockStripe());
        vi.mocked(computeBookingPrice).mockResolvedValue({ totalPrice: 350 });
        vi.mocked(createPendingBooking).mockResolvedValue({
            booking: {
                ...baseBookingData,
                uuid: "booking-uuid-1",
                bookingReference: "LP-TEST123",
                status: "pending",
            },
        });
        vi.mocked(createBookingPaymentIntent).mockResolvedValue({
            clientSecret: "pi_test_123_secret",
            paymentIntentId: "pi_test_123",
            bookingReference: "LP-TEST123",
            amount: 350,
        });
    });

    it("returns clientSecret on happy path", async () => {
        const response = await POST(
            new Request("http://localhost/api/payment", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ bookingData: baseBookingData }),
            })
        );

        expect(response.status).toBe(HttpStatusCode.OK);
        const body = await response.json();
        expect(body.message.clientSecret).toBe("pi_test_123_secret");
        expect(body.message.bookingReference).toBe("LP-TEST123");
        expect(body.message.amount).toBe(350);
    });

    it("returns 400 when email or dates are missing", async () => {
        const response = await POST(
            new Request("http://localhost/api/payment", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    bookingData: { ...baseBookingData, bookerEmail: "" },
                }),
            })
        );

        expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
    });

    it("rejects villa bookings exceeding max guests", async () => {
        const tooManyGuests = Array.from({ length: VILLA_MAX_GUESTS + 1 }, (_, i) => ({
            name: `Guest ${i + 1}`,
            gender: "male",
        }));

        const response = await POST(
            new Request("http://localhost/api/payment", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    bookingData: {
                        ...baseBookingData,
                        guests: tooManyGuests,
                        numberOfGuests: tooManyGuests.length,
                    },
                }),
            })
        );

        expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
        const body = await response.json();
        expect(body.message).toBe("Too many guests");
    });

    it("returns 400 when Stripe is not configured", async () => {
        vi.mocked(getStripeClient).mockReturnValue(null);

        const response = await POST(
            new Request("http://localhost/api/payment", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ bookingData: baseBookingData }),
            })
        );

        expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
    });
});
