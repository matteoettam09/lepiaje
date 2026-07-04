import { getResendClient } from "@/lib/email/resendClient";
import BookingRequestAdminTemplate from "@/components/email_templates/booking_request_admin";
import BookingRequestGuestTemplate from "@/components/email_templates/booking_request_guest";
import { BookingType } from "@/types";

const emailFrom = process.env.NEXT_PUBLIC_SENDER_EMAIL || "delivered@resend.dev";
const adminEmail = process.env.ADMIN_EMAIL_ONE_RECEIVER || "";

export async function sendBookingRequestEmails(
    booking: BookingType,
    quotedTotal: number
): Promise<void> {
    const resend = getResendClient();
    if (!resend || !adminEmail) return;

    const reference = booking.bookingReference ?? "N/A";

    await resend.emails.send({
        from: emailFrom,
        to: [adminEmail],
        subject: `Booking request (pending): ${reference}`,
        react: BookingRequestAdminTemplate({
            bookingData: booking,
            quotedTotal,
        }),
    });

    if (booking.bookerEmail) {
        await resend.emails.send({
            from: emailFrom,
            to: [booking.bookerEmail],
            subject: `We received your booking request - ${reference}`,
            react: BookingRequestGuestTemplate({
                bookingData: booking,
                quotedTotal,
            }),
        });
    }
}
