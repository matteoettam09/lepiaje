import { describe, it, expect, vi, beforeEach } from "vitest";
import { BookingType } from "@/types";
import { Property as PropertyEnum } from "@/enums";

const { mockResend } = vi.hoisted(() => ({
    mockResend: {
        emails: {
            send: vi.fn().mockResolvedValue({ id: "email_test_123" }),
        },
    },
}));

describe("sendBookingRequestEmails", () => {
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
        status: "pending",
    };

    beforeEach(() => {
        vi.resetModules();
        vi.clearAllMocks();
        process.env.NEXT_PUBLIC_SENDER_EMAIL = "onboarding@resend.dev";
        process.env.ADMIN_EMAIL_ONE_RECEIVER = "admin@example.com";
    });

    it("sends admin and guest booking request emails", async () => {
        vi.doMock("@/lib/email/resendClient", () => ({
            getResendClient: () => mockResend,
        }));
        vi.doMock("@/components/email_templates/booking_request_admin", () => ({
            default: () => null,
        }));
        vi.doMock("@/components/email_templates/booking_request_guest", () => ({
            default: () => null,
        }));

        const { sendBookingRequestEmails } = await import(
            "@/lib/email/sendBookingRequestEmails"
        );
        await sendBookingRequestEmails(booking, 350);

        expect(mockResend.emails.send).toHaveBeenCalledTimes(2);
        expect(mockResend.emails.send).toHaveBeenCalledWith(
            expect.objectContaining({
                to: ["admin@example.com"],
                subject: "Booking request (pending): LP-TEST123",
            })
        );
        expect(mockResend.emails.send).toHaveBeenCalledWith(
            expect.objectContaining({
                to: ["guest@example.com"],
                subject: "We received your booking request - LP-TEST123",
            })
        );
    });

    it("skips sending when admin email is not configured", async () => {
        process.env.ADMIN_EMAIL_ONE_RECEIVER = "";

        vi.doMock("@/lib/email/resendClient", () => ({
            getResendClient: () => mockResend,
        }));

        const { sendBookingRequestEmails } = await import(
            "@/lib/email/sendBookingRequestEmails"
        );
        await sendBookingRequestEmails(booking, 350);

        expect(mockResend.emails.send).not.toHaveBeenCalled();
    });
});
