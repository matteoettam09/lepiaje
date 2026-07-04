import { ResponseHandler } from "@/helpers/response_handler";
import { HttpStatusCode } from "@/enums";
import { connection } from "@/config/db";
import Log from "@/models/Log";
import { BookingType } from "@/types";
import {
    confirmBookingImmediately,
    createPendingBooking,
} from "@/lib/booking/bookingService";
import { withGuestCount } from "@/lib/booking/guestCount";

export async function POST(request: Request) {
    const responseHandler = new ResponseHandler();
    try {
        const db = await connection();
        if (!db) {
            return responseHandler.respond({
                error: true,
                errorDetails: "Database connection failed",
                message: "The db connection could not be established",
                status: HttpStatusCode.INTERNAL_SERVER,
            });
        }

        const body = await request.json();
        const booking: BookingType = withGuestCount(body);
        const mode: "block" | "pending" = body.mode === "block" ? "block" : "pending";

        if (!booking.checkIn || !booking.checkOut || !booking.bookerEmail || !booking.numberOfGuests || !booking.propertyName) {
            return responseHandler.respond({
                error: true,
                errorDetails: `Missing required fields in booking ${JSON.stringify(booking)}`,
                message: "Missing required booking details",
                status: HttpStatusCode.BAD_REQUEST,
            });
        }

        if (mode === "block") {
            const result = await confirmBookingImmediately({
                ...booking,
                totalPaid: booking.totalPaid ?? 0,
            });

            if (result.error || !result.booking) {
                return responseHandler.respond({
                    error: true,
                    errorDetails: result.error ?? "Failed to block dates",
                    message: result.error ?? "Room availability error",
                    status: HttpStatusCode.BAD_REQUEST,
                });
            }

            return responseHandler.respond({
                error: false,
                errorDetails: "N/A",
                message: result.booking,
                status: HttpStatusCode.CREATED,
            });
        }

        const totalPaid = booking.totalPaid ?? 0;
        if (totalPaid < 0) {
            return responseHandler.respond({
                error: true,
                errorDetails: "total paid is less than 0",
                message: "total paid is less than 0",
                status: HttpStatusCode.BAD_REQUEST,
            });
        }

        const result = await createPendingBooking(booking, totalPaid);
        if (result.error || !result.booking.uuid) {
            return responseHandler.respond({
                error: true,
                errorDetails: result.error ?? "Failed to create booking",
                message: result.error ?? "Room availability error",
                status: HttpStatusCode.BAD_REQUEST,
            });
        }

        return responseHandler.respond({
            error: false,
            errorDetails: "N/A",
            message: result.booking,
            status: HttpStatusCode.CREATED,
        });
    } catch (err) {
        console.log("General error in booking route api", err);
        const logErrorToDb = new Log({
            endpoint: "api/booking",
            message: "something failed creating a booking",
            requestData: JSON.stringify(err),
            occurredAt: new Date(),
            method: "POST",
        });
        await logErrorToDb.save();
        return responseHandler.respond({
            error: true,
            errorDetails: `Error details: ${JSON.stringify(err)}`,
            status: HttpStatusCode.INTERNAL_SERVER,
            message: "Something went wrong, please check logs.",
        });
    }
}
