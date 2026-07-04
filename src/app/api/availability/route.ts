import { ResponseHandler } from "@/helpers/response_handler";
import { HttpStatusCode } from "@/enums";
import { connection } from "@/config/db";
import { getAvailabilityData } from "@/lib/booking/availabilityData";

const responseHandler = new ResponseHandler();

export async function GET(request: Request) {
    try {
        const db = await connection();
        if (!db) {
            return responseHandler.respond({
                error: true,
                errorDetails: "Database connection failed",
                message: "Could not connect to database",
                status: HttpStatusCode.INTERNAL_SERVER,
            });
        }

        const { searchParams } = new URL(request.url);
        const propertyId = parseInt(searchParams.get("propertyId") || "0", 10);

        if (!propertyId) {
            return responseHandler.respond({
                error: true,
                errorDetails: "propertyId is required",
                message: "Invalid propertyId",
                status: HttpStatusCode.BAD_REQUEST,
            });
        }

        const data = await getAvailabilityData(propertyId);
        if (!data) {
            return responseHandler.respond({
                error: true,
                errorDetails: "Property not found",
                message: "Property not found",
                status: HttpStatusCode.NOT_FOUND,
            });
        }

        return responseHandler.respond({
            error: false,
            errorDetails: "N/A",
            message: data,
            status: HttpStatusCode.OK,
        });
    } catch (err) {
        return responseHandler.respond({
            error: true,
            errorDetails: String(err),
            message: "Failed to fetch availability",
            status: HttpStatusCode.INTERNAL_SERVER,
        });
    }
}
