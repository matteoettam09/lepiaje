import { ResponseHandler } from "@/helpers/response_handler";
import { HttpStatusCode } from "@/enums";
import { connection } from "@/config/db";
import Log from "@/models/Log";
import Booking from "@/models/Booking";
import { BookingType } from "@/types";
import { createPendingBooking } from "@/lib/booking/bookingService";
import { computeBookingPrice } from "@/lib/payments/pricing";
import { getStripeClient } from "@/lib/payments/stripeClient";

const responseHandler = new ResponseHandler();

export async function POST(req: Request) {
    await connection();

    const stripe = getStripeClient();
    if (!stripe) {
        return responseHandler.respond({
            status: HttpStatusCode.BAD_REQUEST,
            error: true,
            errorDetails: "Stripe failed to load",
            message: "stripe was either null or undefined",
        });
    }

    try {
        const { bookingData }: { bookingData: BookingType } = await req.json();

        if (!bookingData?.bookerEmail || !bookingData.checkIn || !bookingData.checkOut) {
            return responseHandler.respond({
                status: HttpStatusCode.BAD_REQUEST,
                error: true,
                errorDetails: "Missing booking data",
                message: "Invalid booking request",
            });
        }

        const { totalPrice, error: priceError } = await computeBookingPrice(bookingData);
        if (priceError || totalPrice <= 0) {
            return responseHandler.respond({
                status: HttpStatusCode.BAD_REQUEST,
                error: true,
                errorDetails: priceError ?? "Invalid price",
                message: priceError ?? "Could not compute booking price",
            });
        }

        const { booking, error: bookingError } = await createPendingBooking(
            bookingData,
            totalPrice
        );

        if (bookingError || !booking.uuid) {
            return responseHandler.respond({
                status: HttpStatusCode.BAD_REQUEST,
                error: true,
                errorDetails: bookingError ?? "Booking creation failed",
                message: bookingError ?? "Dates not available",
            });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalPrice * 100),
            currency: "eur",
            description: `Booking ${booking.bookingReference} - ${booking.propertyName}`,
            metadata: {
                bookingUuid: booking.uuid,
                bookingReference: booking.bookingReference ?? "",
                bookerEmail: bookingData.bookerEmail,
            },
            receipt_email: bookingData.bookerEmail,
        });

        await Booking.findOneAndUpdate(
            { uuid: booking.uuid },
            { stripePaymentIntentId: paymentIntent.id }
        );

        return responseHandler.respond({
            status: HttpStatusCode.OK,
            error: false,
            errorDetails: "n/a",
            message: {
                clientSecret: paymentIntent.client_secret,
                bookingReference: booking.bookingReference,
                amount: totalPrice,
            },
        });
    } catch (error) {
        console.log("error in creating a payment intent", error);
        const logErrorToDb = new Log({
            endpoint: "api/payment",
            message: "something failed creating payment intent",
            requestData: JSON.stringify(error),
            occurredAt: new Date(),
            method: "POST",
        });
        await logErrorToDb.save();
        return responseHandler.respond({
            status: HttpStatusCode.INTERNAL_SERVER,
            message: "something went wrong with the payment route",
            errorDetails: `Payment error: ${error}`,
            error: true,
        });
    }
}
