import { ResponseHandler } from "@/helpers/response_handler";
import { HttpStatusCode } from "@/enums";
import { connection } from "@/config/db";
import Log from "@/models/Log";
import {
    constructStripeEvent,
    handleStripeWebhookEvent,
} from "@/lib/payments/handleStripeWebhook";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const responseHandler = new ResponseHandler();

export async function POST(req: Request) {
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

        const payload = await req.text();
        const stripeHeader = req.headers.get("stripe-signature")!;

        const event = constructStripeEvent(payload, stripeHeader, webhookSecret);
        await handleStripeWebhookEvent(event);

        return responseHandler.respond({
            status: HttpStatusCode.OK,
            message: "webhook processed",
            errorDetails: "N/A",
            error: false,
        });
    } catch (err) {
        console.log("general error in webhook end point", err);
        const logErrorToDb = new Log({
            endpoint: "api/webhook",
            message: "webhook processing failed",
            requestData: JSON.stringify(err),
            occurredAt: new Date(),
            method: "POST",
        });
        await logErrorToDb.save();
        return responseHandler.respond({
            status: HttpStatusCode.INTERNAL_SERVER,
            error: true,
            errorDetails: `${JSON.stringify(err)}`,
            message: "something has failed with the webhook",
        });
    }
}
