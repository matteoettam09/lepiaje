import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    handleStripeWebhookEvent,
    constructStripeEvent,
} from "@/lib/payments/handleStripeWebhook";
import {
    createPaymentIntentEvent,
    createPaymentFailedEvent,
} from "@/__tests__/mocks/stripe";
import { confirmBookingByUuid } from "@/lib/booking/bookingService";
import { sendBookingEmails } from "@/lib/email/sendBookingEmails";
import { sendPurchaseNotification } from "@/lib/email/sendPurchaseEmails";
import Booking from "@/models/Booking";
import { BookingType } from "@/types";
import { Property as PropertyEnum } from "@/enums";
import Stripe from "stripe";

const {
    paymentSave,
    paymentFindOne,
    purchaseSave,
    purchaseFindOne,
    logSave,
} = vi.hoisted(() => ({
    paymentSave: vi.fn().mockResolvedValue({}),
    paymentFindOne: vi.fn().mockResolvedValue(null),
    purchaseSave: vi.fn().mockResolvedValue({
        toObject: () => ({
            productName: "Olive oil",
            amountOfProduct: 1,
            amountPaid: 12,
        }),
    }),
    purchaseFindOne: vi.fn().mockResolvedValue(null),
    logSave: vi.fn().mockResolvedValue({}),
}));

vi.mock("@/lib/booking/bookingService", () => ({
    confirmBookingByUuid: vi.fn(),
}));

vi.mock("@/lib/email/sendBookingEmails", () => ({
    sendBookingEmails: vi.fn(),
}));

vi.mock("@/lib/email/sendPurchaseEmails", () => ({
    sendPurchaseNotification: vi.fn(),
}));

vi.mock("@/models/Payment", () => {
    class MockPayment {
        save = paymentSave;
        static findOne = paymentFindOne;
    }
    return { default: MockPayment };
});

vi.mock("@/models/Purchase", () => {
    class MockPurchase {
        save = purchaseSave;
        static findOne = purchaseFindOne;
    }
    return { default: MockPurchase };
});

vi.mock("@/models/Log", () => {
    class MockLog {
        save = logSave;
    }
    return { default: MockLog };
});

vi.mock("@/models/Booking", () => ({
    default: {
        findOne: vi.fn().mockResolvedValue(null),
        findOneAndUpdate: vi.fn().mockResolvedValue(null),
    },
}));

describe("handleStripeWebhookEvent", () => {
    const villaBooking: BookingType = {
        uuid: "booking-uuid-villa",
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
        bookingReference: "LP-VILLA123",
    };

    const centesimoBooking: BookingType = {
        ...villaBooking,
        uuid: "booking-uuid-centesimo",
        propertyName: "Al Centesimo Chilometro",
        propertyId: PropertyEnum.AL_CENTESIMO_CHILOMETRO,
        bookingReference: "LP-CENT456",
    };

    beforeEach(() => {
        vi.clearAllMocks();
        paymentFindOne.mockResolvedValue(null);
        purchaseFindOne.mockResolvedValue(null);
    });

    it("confirms Villa booking and sends emails on payment success", async () => {
        vi.mocked(Booking.findOne).mockResolvedValue({
            status: "pending",
        } as never);
        vi.mocked(confirmBookingByUuid).mockResolvedValue({
            booking: villaBooking,
        });

        const event = createPaymentIntentEvent({
            id: "pi_villa_1",
            amount: 4000,
            status: "succeeded",
            metadata: {
                bookingUuid: "booking-uuid-villa",
                bookingReference: "LP-VILLA123",
                bookerEmail: "guest@example.com",
            },
        });

        await handleStripeWebhookEvent(event);

        expect(confirmBookingByUuid).toHaveBeenCalledWith(
            "booking-uuid-villa",
            "pi_villa_1",
            40
        );
        expect(paymentSave).toHaveBeenCalled();
        expect(sendBookingEmails).toHaveBeenCalledWith(villaBooking);
    });

    it("confirms Centesimo booking on payment success", async () => {
        vi.mocked(Booking.findOne).mockResolvedValue({
            status: "pending",
        } as never);
        vi.mocked(confirmBookingByUuid).mockResolvedValue({
            booking: centesimoBooking,
        });

        const event = createPaymentIntentEvent({
            id: "pi_centesimo_1",
            amount: 3000,
            status: "succeeded",
            metadata: {
                bookingUuid: "booking-uuid-centesimo",
                bookingReference: "LP-CENT456",
                bookerEmail: "guest@example.com",
            },
        });

        await handleStripeWebhookEvent(event);

        expect(confirmBookingByUuid).toHaveBeenCalledWith(
            "booking-uuid-centesimo",
            "pi_centesimo_1",
            30
        );
        expect(sendBookingEmails).toHaveBeenCalledWith(centesimoBooking);
    });

    it("does not resend confirmation emails when booking was already confirmed", async () => {
        vi.mocked(Booking.findOne).mockResolvedValue({
            status: "confirmed",
        } as never);
        vi.mocked(confirmBookingByUuid).mockResolvedValue({
            booking: villaBooking,
        });

        const event = createPaymentIntentEvent({
            id: "pi_booking_1",
            amount: 4000,
            status: "succeeded",
            metadata: {
                bookingUuid: "booking-uuid-villa",
                bookerEmail: "guest@example.com",
            },
        });

        await handleStripeWebhookEvent(event);

        expect(confirmBookingByUuid).toHaveBeenCalled();
        expect(sendBookingEmails).not.toHaveBeenCalled();
    });

    it("skips duplicate Payment record on booking webhook retry", async () => {
        vi.mocked(Booking.findOne).mockResolvedValue({
            status: "confirmed",
        } as never);
        vi.mocked(confirmBookingByUuid).mockResolvedValue({
            booking: villaBooking,
        });
        paymentFindOne.mockResolvedValue({ transactionId: "pi_booking_1" });

        const event = createPaymentIntentEvent({
            id: "pi_booking_1",
            amount: 4000,
            status: "succeeded",
            metadata: {
                bookingUuid: "booking-uuid-villa",
                bookerEmail: "guest@example.com",
            },
        });

        await handleStripeWebhookEvent(event);

        expect(paymentSave).not.toHaveBeenCalled();
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

    it("skips duplicate purchase inserts and emails on webhook retry", async () => {
        purchaseFindOne.mockResolvedValue({
            stripeId: "pi_purchase_1",
        });

        const event = createPaymentIntentEvent({
            id: "pi_purchase_1",
            amount: 2400,
            status: "succeeded",
            metadata: {
                type: "purchase",
                clientEmail: "shopper@example.com",
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

        expect(purchaseSave).not.toHaveBeenCalled();
        expect(sendPurchaseNotification).not.toHaveBeenCalled();
        expect(paymentSave).not.toHaveBeenCalled();
    });

    it("cancels pending booking and logs on payment failure", async () => {
        const event = createPaymentFailedEvent({
            bookingUuid: "booking-uuid-villa",
        });

        await handleStripeWebhookEvent(event);

        expect(Booking.findOneAndUpdate).toHaveBeenCalledWith(
            { uuid: "booking-uuid-villa", status: "pending" },
            { status: "cancelled" }
        );
        expect(logSave).toHaveBeenCalled();
    });
});

describe("constructStripeEvent", () => {
    it("throws on invalid signature", () => {
        const signatureError = Object.assign(new Error("Invalid signature"), {
            type: "StripeSignatureVerificationError",
        });

        const constructEventSpy = vi
            .spyOn(Stripe.webhooks, "constructEvent")
            .mockImplementation(() => {
                throw signatureError;
            });

        expect(() =>
            constructStripeEvent("payload", "bad_sig", "whsec_test")
        ).toThrow("Invalid signature");

        constructEventSpy.mockRestore();
    });
});
