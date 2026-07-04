import { BookingType, HttpResponseType } from "@/types";
import { notifyAdmin } from "./notify_admin";
import { Email } from "@/enums";

export const submit_new_booking = async (
    bookingData: BookingType,
    mode: "block" | "pending" = "block"
): Promise<{ error: boolean; message: string; errorDetails: string }> => {
    try {
        const response = await fetch("/api/booking", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...bookingData, mode }),
        });

        const { message, error, errorDetails }: HttpResponseType = await response.json();

        if (response.status !== 201 || error) {
            return {
                error: true,
                message: `something went wrong while booking the property ${JSON.stringify(errorDetails)} ${JSON.stringify(message)}`,
                errorDetails: errorDetails || "N/A",
            };
        }

        if (mode === "block") {
            const savedBooking = message as unknown as BookingType;
            const emailSent = await notifyAdmin(savedBooking, Email.BOOKING);
            if (emailSent.error) {
                console.log("something went wrong sending the email", emailSent);
            }
        }

        return {
            error: false,
            message: "booking was saved!",
            errorDetails: "N/A",
        };
    } catch (err) {
        return {
            error: true,
            message: `Something went wrong saving the new booking ${JSON.stringify(err)}`,
            errorDetails: JSON.stringify(err),
        };
    }
};
