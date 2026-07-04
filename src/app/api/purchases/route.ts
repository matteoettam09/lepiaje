import Purchase from "@/models/Purchase";
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
                message: "Not authenticated",
                errorDetails: "Unauthorized",
                status: HttpStatusCode.UN_AUTH,
            });
        }

        const { valid } = await verifySessionToken(token);
        if (!valid) {
            return responseHandler.respond({
                error: true,
                message: "Not authenticated",
                errorDetails: "Invalid session",
                status: HttpStatusCode.UN_AUTH,
            });
        }

        await connection();
        const purchases = await Purchase.find().sort({ purchasedOn: -1 }).limit(100).lean();

        return responseHandler.respond({
            error: false,
            errorDetails: "N/A",
            message: purchases,
            status: HttpStatusCode.OK,
        });
    } catch (err) {
        return responseHandler.respond({
            error: true,
            errorDetails: String(err),
            message: "Failed to fetch purchases",
            status: HttpStatusCode.INTERNAL_SERVER,
        });
    }
}
