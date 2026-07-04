import { HttpStatusCode } from "@/enums";
import { ResponseHandler } from "@/helpers/response_handler";
import { PurchaseType } from "@/types";
import { sendPurchaseNotification } from "@/lib/email/sendPurchaseEmails";

const responseHandler = new ResponseHandler();

export async function POST(request: Request) {
    try {
        const purchases: PurchaseType[] = await request.json();

        if (!Array.isArray(purchases) || purchases.length === 0) {
            return responseHandler.respond({
                error: true,
                message: "No purchase data provided",
                errorDetails: "N/A",
                status: HttpStatusCode.BAD_REQUEST,
            });
        }

        await sendPurchaseNotification(purchases, purchases[0].clientEmail);

        return responseHandler.respond({
            error: false,
            message: "Purchase notification sent",
            errorDetails: "N/A",
            status: HttpStatusCode.OK,
        });
    } catch (err) {
        return responseHandler.respond({
            error: true,
            message: "Failed to send purchase email",
            errorDetails: String(err),
            status: HttpStatusCode.INTERNAL_SERVER,
        });
    }
}
