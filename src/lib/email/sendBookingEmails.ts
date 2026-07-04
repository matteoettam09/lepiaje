import { getResendClient } from "@/lib/email/resendClient";
import BookingNotificationTemplate from "@/components/email_templates/new_booking";
import GuestBookingConfirmationTemplate from "@/components/email_templates/guest_booking_confirmation";
import { BookingType } from "@/types";

const emailFrom = process.env.NEXT_PUBLIC_SENDER_EMAIL || "delivered@resend.dev";
const adminEmail = process.env.ADMIN_EMAIL_ONE_RECEIVER || "";

export async function sendBookingEmails(booking: BookingType): Promise<void> {
    const resend = getResendClient();
    if (!resend || !adminEmail) return;

    await resend.emails.send({
        from: emailFrom,
        to: [adminEmail],
        subject: `New booking: ${booking.bookingReference}`,
        react: BookingNotificationTemplate({ bookingData: booking }),
    });

    if (booking.bookerEmail) {
        await resend.emails.send({
            from: emailFrom,
            to: [booking.bookerEmail],
            subject: `Booking confirmed - ${booking.bookingReference}`,
            react: GuestBookingConfirmationTemplate({ bookingData: booking }),
        });
    }
}
