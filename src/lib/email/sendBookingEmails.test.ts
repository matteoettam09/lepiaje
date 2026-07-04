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

describe("sendBookingEmails", () => {
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
        vi.resetModules();
        vi.clearAllMocks();
        process.env.NEXT_PUBLIC_SENDER_EMAIL = "onboarding@resend.dev";
        process.env.ADMIN_EMAIL_ONE_RECEIVER = "admin@example.com";
    });

    it("sends admin and guest confirmation emails", async () => {
        vi.doMock("@/lib/email/resendClient", () => ({
            getResendClient: () => mockResend,
        }));
        vi.doMock("@/components/email_templates/new_booking", () => ({
            default: () => null,
        }));
        vi.doMock("@/components/email_templates/guest_booking_confirmation", () => ({
            default: () => null,
        }));

        const { sendBookingEmails } = await import("@/lib/email/sendBookingEmails");
        await sendBookingEmails(booking);

        expect(mockResend.emails.send).toHaveBeenCalledTimes(2);
        expect(mockResend.emails.send).toHaveBeenCalledWith(
            expect.objectContaining({
                to: ["admin@example.com"],
                subject: "New booking: LP-TEST123",
            })
        );
        expect(mockResend.emails.send).toHaveBeenCalledWith(
            expect.objectContaining({
                to: ["guest@example.com"],
                subject: "Booking confirmed - LP-TEST123",
            })
        );
    });
});
