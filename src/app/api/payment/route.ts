import { ResponseHandler } from "@/helpers/response_handler";
import { HttpStatusCode } from "@/enums";
import { connection } from "@/config/db";
import Log from "@/models/Log";
import { BookingType } from "@/types";
import { createPendingBooking } from "@/lib/booking/bookingService";
import { sendBookingRequestEmails } from "@/lib/email/sendBookingRequestEmails";
import { computeBookingPrice } from "@/lib/payments/pricing";
import { getStripeClient } from "@/lib/payments/stripeClient";
import { createBookingPaymentIntent } from "@/lib/payments/createBookingPaymentIntent";
import { withGuestCount, countBookingGuests } from "@/lib/booking/guestCount";
import { VILLA_MAX_GUESTS } from "@/constants/villa_pricing";
import { Property as PropertyEnum } from "@/enums";

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
        const { bookingData: rawBookingData }: { bookingData: BookingType } =
            await req.json();
        const bookingData = withGuestCount(rawBookingData);

        if (!bookingData.bookerEmail || !bookingData.checkIn || !bookingData.checkOut) {
            return responseHandler.respond({
                status: HttpStatusCode.BAD_REQUEST,
                error: true,
                errorDetails: "Missing booking data",
                message: "Invalid booking request",
            });
        }

        if (
            bookingData.propertyId === PropertyEnum.LA_VILLA_PERLATA &&
            countBookingGuests(bookingData) > VILLA_MAX_GUESTS
        ) {
            return responseHandler.respond({
                status: HttpStatusCode.BAD_REQUEST,
                error: true,
                errorDetails: `Maximum ${VILLA_MAX_GUESTS} guests for La Villa Perlata`,
                message: "Too many guests",
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

        try {
            await sendBookingRequestEmails(booking, totalPrice);
        } catch (emailError) {
            console.error("Failed to send booking request emails", emailError);
            await new Log({
                endpoint: "api/payment",
                message: "failed to send booking request emails",
                requestData: JSON.stringify(emailError),
                occurredAt: new Date(),
                method: "POST",
            }).save();
        }

        const paymentResult = await createBookingPaymentIntent(
            stripe,
            booking,
            totalPrice
        );

        return responseHandler.respond({
            status: HttpStatusCode.OK,
            error: false,
            errorDetails: "n/a",
            message: {
                clientSecret: paymentResult.clientSecret,
                bookingReference: paymentResult.bookingReference,
                amount: paymentResult.amount,
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
