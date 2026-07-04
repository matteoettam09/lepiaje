import { ResponseHandler } from "@/helpers/response_handler";
import { HttpStatusCode } from "@/enums";
import { connection } from "@/config/db";
import Stripe from "stripe";
import Payment from "@/models/Payment";
import Log from "@/models/Log";
import { confirmBookingByUuid } from "@/lib/booking/bookingService";
import { sendBookingEmails } from "@/lib/email/sendBookingEmails";
import { sendPurchaseNotification } from "@/lib/email/sendPurchaseEmails";
import Purchase from "@/models/Purchase";

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

        const event = Stripe.webhooks.constructEvent(
            payload,
            stripeHeader,
            webhookSecret
        );

        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;

                if (paymentIntent.metadata.type === "purchase") {
                    const clientEmail = paymentIntent.metadata.clientEmail;
                    const items = JSON.parse(paymentIntent.metadata.items || "[]") as {
                        productId: string;
                        name: string;
                        quantity: number;
                        unitPrice: number;
                    }[];

                    const savedPurchases = [];
                    for (const item of items) {
                        const purchase = await new Purchase({
                            productName: item.name,
                            productId: item.productId,
                            amountOfProduct: item.quantity,
                            amountPaid: item.unitPrice * item.quantity,
                            clientEmail,
                            clientNumber: paymentIntent.metadata.clientNumber || undefined,
                            stripeId: paymentIntent.id,
                        }).save();
                        savedPurchases.push(purchase.toObject());
                    }

                    await sendPurchaseNotification(savedPurchases, clientEmail);

                    await new Payment({
                        amount: paymentIntent.amount / 100,
                        status: paymentIntent.status,
                        bookerEmail: clientEmail,
                        transactionId: paymentIntent.id,
                        additionalDetails: "farm shop purchase",
                    }).save();
                    break;
                }

                const bookingUuid = paymentIntent.metadata.bookingUuid;
                const amountPaid = paymentIntent.amount / 100;

                if (!bookingUuid) {
                    console.error("Webhook missing bookingUuid in metadata");
                    break;
                }

                const { booking, error } = await confirmBookingByUuid(
                    bookingUuid,
                    paymentIntent.id,
                    amountPaid
                );

                if (error || !booking) {
                    console.error("Failed to confirm booking:", error);
                    break;
                }

                const paymentObject = {
                    amount: amountPaid,
                    status: paymentIntent.status,
                    bookerEmail: paymentIntent.metadata.bookerEmail,
                    bookingUuid,
                    transactionId: paymentIntent.id,
                };
                await new Payment(paymentObject).save();

                await sendBookingEmails(booking);
                break;
            }
            case "payment_intent.payment_failed": {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                const bookingUuid = paymentIntent.metadata.bookingUuid;
                if (bookingUuid) {
                    const Booking = (await import("@/models/Booking")).default;
                    await Booking.findOneAndUpdate(
                        { uuid: bookingUuid, status: "pending" },
                        { status: "cancelled" }
                    );
                }
                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

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
