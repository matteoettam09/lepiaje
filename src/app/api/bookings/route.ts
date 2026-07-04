import Booking from "@/models/Booking";
import { ResponseHandler } from "@/helpers/response_handler";
import { HttpStatusCode } from "@/enums";
import { connection } from "@/config/db";
import { verifySessionToken } from "@/lib/auth/session";
import { cookies } from "next/headers";

const responseHandler = new ResponseHandler();

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) {
            return responseHandler.respond({
                error: true,
                errorDetails: "Unauthorized",
                message: "Not authenticated",
                status: HttpStatusCode.UN_AUTH,
            });
        }

        const { valid } = await verifySessionToken(token);
        if (!valid) {
            return responseHandler.respond({
                error: true,
                errorDetails: "Invalid session",
                message: "Not authenticated",
                status: HttpStatusCode.UN_AUTH,
            });
        }

        const db = await connection();
        if (!db) {
            return responseHandler.respond({
                error: true,
                errorDetails: "Database connection failed",
                message: "Could not connect",
                status: HttpStatusCode.INTERNAL_SERVER,
            });
        }

        const bookings = await Booking.find({ status: { $ne: "cancelled" } })
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();

        return responseHandler.respond({
            error: false,
            errorDetails: "N/A",
            message: bookings,
            status: HttpStatusCode.OK,
        });
    } catch (err) {
        return responseHandler.respond({
            error: true,
            errorDetails: String(err),
            message: "Failed to fetch bookings",
            status: HttpStatusCode.INTERNAL_SERVER,
        });
    }
}
