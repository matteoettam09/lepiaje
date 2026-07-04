import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import { v4 as uuidv4 } from "uuid";
import {
    connectMemoryDb,
    clearMemoryDb,
    disconnectMemoryDb,
} from "@/__tests__/helpers/mongoMemoryServer";
import { seedTestDatabase } from "@/__tests__/helpers/seedTestDb";
import { createPendingBooking } from "@/lib/booking/bookingService";
import { handleStripeWebhookEvent } from "@/lib/payments/handleStripeWebhook";
import { createPaymentIntentEvent } from "@/__tests__/mocks/stripe";
import Booking from "@/models/Booking";
import Bed from "@/models/Bed";
import Payment from "@/models/Payment";
import { BookingType } from "@/types";
import { Property as PropertyEnum, BookingStatus } from "@/enums";

vi.mock("@/lib/email/sendBookingEmails", () => ({
    sendBookingEmails: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/email/sendPurchaseEmails", () => ({
    sendPurchaseNotification: vi.fn().mockResolvedValue(undefined),
}));

function buildVillaBooking(overrides: Partial<BookingType> = {}): BookingType {
    return {
        uuid: uuidv4(),
        bookerName: "Webhook Guest",
        bookerEmail: "webhook@example.com",
        bookerGender: "male",
        propertyName: "La Villa Perlata",
        propertyId: PropertyEnum.LA_VILLA_PERLATA,
        checkIn: new Date("2026-10-01"),
        checkOut: new Date("2026-10-03"),
        checkInTime: "15:00",
        checkOutTime: "11:00",
        numberOfGuests: 1,
        guests: [],
        ...overrides,
    };
}

describe("payment webhook integration", () => {
    beforeAll(async () => {
        await connectMemoryDb();
    });

    afterAll(async () => {
        await disconnectMemoryDb();
    });

    beforeEach(async () => {
        await clearMemoryDb();
        await seedTestDatabase();
    });

    it("confirms pending booking and assigns beds via webhook", async () => {
        const bookingData = buildVillaBooking();
        const { booking } = await createPendingBooking(bookingData, 350);
        expect(booking.uuid).toBeDefined();

        const event = createPaymentIntentEvent({
            id: "pi_webhook_integration",
            amount: 35000,
            status: "succeeded",
            metadata: {
                bookingUuid: booking.uuid!,
                bookingReference: booking.bookingReference ?? "",
                bookerEmail: booking.bookerEmail!,
            },
        });

        await handleStripeWebhookEvent(event);

        const confirmed = await Booking.findOne({ uuid: booking.uuid });
        expect(confirmed?.status).toBe(BookingStatus.CONFIRMED);
        expect(confirmed?.stripePaymentIntentId).toBe("pi_webhook_integration");
        expect(confirmed?.totalPaid).toBe(350);

        const payment = await Payment.findOne({
            transactionId: "pi_webhook_integration",
        });
        expect(payment).not.toBeNull();
        expect(payment?.amount).toBe(350);

        const beds = await Bed.find({ room_gender: "mixed" });
        const hasHold = beds.some((bed) =>
            bed.occupants.some((o) => o.name === "Webhook Guest")
        );
        expect(hasHold).toBe(true);
    });

    it("is idempotent when webhook is delivered twice", async () => {
        const bookingData = buildVillaBooking({
            checkIn: new Date("2026-11-01"),
            checkOut: new Date("2026-11-03"),
        });
        const { booking } = await createPendingBooking(bookingData, 350);

        const event = createPaymentIntentEvent({
            id: "pi_webhook_idempotent",
            amount: 35000,
            status: "succeeded",
            metadata: {
                bookingUuid: booking.uuid!,
                bookerEmail: booking.bookerEmail!,
            },
        });

        await handleStripeWebhookEvent(event);
        await handleStripeWebhookEvent(event);

        const payments = await Payment.find({
            transactionId: "pi_webhook_idempotent",
        });
        expect(payments).toHaveLength(1);
    });
});
