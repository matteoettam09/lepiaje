import Stripe from "stripe";
import Booking from "@/models/Booking";
import { BookingType } from "@/types";

export interface BookingPaymentIntentResult {
    clientSecret: string;
    paymentIntentId: string;
    bookingReference?: string;
    amount: number;
}

export async function createBookingPaymentIntent(
    stripe: Stripe,
    booking: BookingType,
    totalPrice: number
): Promise<BookingPaymentIntentResult> {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalPrice * 100),
        currency: "eur",
        description: `Booking ${booking.bookingReference} - ${booking.propertyName}`,
        metadata: {
            bookingUuid: booking.uuid!,
            bookingReference: booking.bookingReference ?? "",
            bookerEmail: booking.bookerEmail!,
        },
        receipt_email: booking.bookerEmail,
    });

    await Booking.findOneAndUpdate(
        { uuid: booking.uuid },
        { stripePaymentIntentId: paymentIntent.id }
    );

    if (!paymentIntent.client_secret) {
        throw new Error("Stripe did not return a client secret");
    }

    return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        bookingReference: booking.bookingReference,
        amount: totalPrice,
    };
}
