import Stripe from "stripe";
import Payment from "@/models/Payment";
import Purchase from "@/models/Purchase";
import Booking from "@/models/Booking";
import { confirmBookingByUuid } from "@/lib/booking/bookingService";
import { sendBookingEmails } from "@/lib/email/sendBookingEmails";
import { sendPurchaseNotification } from "@/lib/email/sendPurchaseEmails";

interface PurchaseLineItem {
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
}

async function handlePurchasePaymentIntent(
    paymentIntent: Stripe.PaymentIntent
): Promise<void> {
    const clientEmail = paymentIntent.metadata.clientEmail;
    const items = JSON.parse(
        paymentIntent.metadata.items || "[]"
    ) as PurchaseLineItem[];

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
}

async function handleBookingPaymentIntent(
    paymentIntent: Stripe.PaymentIntent
): Promise<void> {
    const bookingUuid = paymentIntent.metadata.bookingUuid;
    const amountPaid = paymentIntent.amount / 100;

    if (!bookingUuid) {
        console.error("Webhook missing bookingUuid in metadata");
        return;
    }

    const { booking, error } = await confirmBookingByUuid(
        bookingUuid,
        paymentIntent.id,
        amountPaid
    );

    if (error || !booking) {
        console.error("Failed to confirm booking:", error);
        return;
    }

    await new Payment({
        amount: amountPaid,
        status: paymentIntent.status,
        bookerEmail: paymentIntent.metadata.bookerEmail,
        bookingUuid,
        transactionId: paymentIntent.id,
    }).save();

    await sendBookingEmails(booking);
}

export async function handleStripeWebhookEvent(
    event: Stripe.Event
): Promise<void> {
    switch (event.type) {
        case "payment_intent.succeeded": {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;

            if (paymentIntent.metadata.type === "purchase") {
                await handlePurchasePaymentIntent(paymentIntent);
                break;
            }

            await handleBookingPaymentIntent(paymentIntent);
            break;
        }
        case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            const bookingUuid = paymentIntent.metadata.bookingUuid;
            if (bookingUuid) {
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
}

export function constructStripeEvent(
    payload: string,
    signature: string,
    webhookSecret: string
): Stripe.Event {
    return Stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}
