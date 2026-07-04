import { describe, it, expect, vi, beforeEach } from "vitest";
import { handleStripeWebhookEvent } from "@/lib/payments/handleStripeWebhook";
import { createPaymentIntentEvent } from "@/__tests__/mocks/stripe";
import { confirmBookingByUuid } from "@/lib/booking/bookingService";
import { sendBookingEmails } from "@/lib/email/sendBookingEmails";
import { sendPurchaseNotification } from "@/lib/email/sendPurchaseEmails";
import Booking from "@/models/Booking";
import { BookingType } from "@/types";
import { Property as PropertyEnum } from "@/enums";

vi.mock("@/lib/booking/bookingService", () => ({
    confirmBookingByUuid: vi.fn(),
}));

vi.mock("@/lib/email/sendBookingEmails", () => ({
    sendBookingEmails: vi.fn(),
}));

vi.mock("@/lib/email/sendPurchaseEmails", () => ({
    sendPurchaseNotification: vi.fn(),
}));

const paymentSave = vi.fn().mockResolvedValue({});
vi.mock("@/models/Payment", () => {
    class MockPayment {
        save = paymentSave;
    }
    return { default: MockPayment };
});

const purchaseSave = vi.fn().mockResolvedValue({
    toObject: () => ({
        productName: "Olive oil",
        amountOfProduct: 1,
        amountPaid: 12,
    }),
});
vi.mock("@/models/Purchase", () => {
    class MockPurchase {
        save = purchaseSave;
    }
    return { default: MockPurchase };
});

vi.mock("@/models/Booking", () => ({
    default: {
        findOneAndUpdate: vi.fn().mockResolvedValue(null),
    },
}));

describe("handleStripeWebhookEvent", () => {
    const confirmedBooking: BookingType = {
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
        status: "confirmed",
        bookingReference: "LP-TEST123",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("confirms booking and sends emails on booking payment success", async () => {
        vi.mocked(confirmBookingByUuid).mockResolvedValue({
            booking: confirmedBooking,
        });

        const event = createPaymentIntentEvent({
            id: "pi_booking_1",
            amount: 4000,
            status: "succeeded",
            metadata: {
                bookingUuid: "booking-uuid-1",
                bookerEmail: "guest@example.com",
            },
        });

        await handleStripeWebhookEvent(event);

        expect(confirmBookingByUuid).toHaveBeenCalledWith(
            "booking-uuid-1",
            "pi_booking_1",
            40
        );
        expect(paymentSave).toHaveBeenCalled();
        expect(sendBookingEmails).toHaveBeenCalledWith(confirmedBooking);
    });

    it("handles farm shop purchase payment success", async () => {
        const event = createPaymentIntentEvent({
            id: "pi_purchase_1",
            amount: 2400,
            status: "succeeded",
            metadata: {
                type: "purchase",
                clientEmail: "shopper@example.com",
                clientNumber: "123",
                items: JSON.stringify([
                    {
                        productId: "prod-1",
                        name: "Olive oil",
                        quantity: 2,
                        unitPrice: 12,
                    },
                ]),
            },
        });

        await handleStripeWebhookEvent(event);

        expect(purchaseSave).toHaveBeenCalled();
        expect(sendPurchaseNotification).toHaveBeenCalled();
        expect(confirmBookingByUuid).not.toHaveBeenCalled();
    });

    it("cancels pending booking on payment failure", async () => {
        const event = {
            type: "payment_intent.payment_failed",
            data: {
                object: {
                    metadata: { bookingUuid: "booking-uuid-1" },
                },
            },
        } as Parameters<typeof handleStripeWebhookEvent>[0];

        await handleStripeWebhookEvent(event);

        expect(Booking.findOneAndUpdate).toHaveBeenCalledWith(
            { uuid: "booking-uuid-1", status: "pending" },
            { status: "cancelled" }
        );
    });
});
