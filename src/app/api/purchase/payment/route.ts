import { ResponseHandler } from "@/helpers/response_handler";
import { HttpStatusCode } from "@/enums";
import { connection } from "@/config/db";
import Product from "@/models/Product";
import Log from "@/models/Log";
import { PurchaseRequest } from "@/types";
import { getStripeClient } from "@/lib/payments/stripeClient";

const responseHandler = new ResponseHandler();

export async function POST(req: Request) {
    await connection();

    const stripe = getStripeClient();
    if (!stripe) {
        return responseHandler.respond({
            status: HttpStatusCode.BAD_REQUEST,
            error: true,
            errorDetails: "Stripe not configured",
            message: "Payment service unavailable",
        });
    }

    try {
        const body: PurchaseRequest = await req.json();
        const { items, clientEmail, clientNumber } = body;

        if (!items?.length || !clientEmail) {
            return responseHandler.respond({
                status: HttpStatusCode.BAD_REQUEST,
                error: true,
                errorDetails: "Missing items or email",
                message: "Invalid purchase request",
            });
        }

        let total = 0;
        const lineItems: { productId: string; name: string; quantity: number; unitPrice: number }[] = [];

        for (const item of items) {
            const product = await Product.findOne({ productId: item.productId, inStock: true });
            if (!product) {
                return responseHandler.respond({
                    status: HttpStatusCode.BAD_REQUEST,
                    error: true,
                    errorDetails: `Product ${item.productId} not available`,
                    message: "Product not found or out of stock",
                });
            }
            const lineTotal = product.price * item.quantity;
            total += lineTotal;
            lineItems.push({
                productId: product.productId,
                name: product.name,
                quantity: item.quantity,
                unitPrice: product.price,
            });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100),
            currency: "eur",
            description: `Farm shop order - ${clientEmail}`,
            metadata: {
                type: "purchase",
                clientEmail,
                clientNumber: clientNumber || "",
                items: JSON.stringify(lineItems),
            },
            receipt_email: clientEmail,
        });

        if (!paymentIntent.client_secret) {
            throw new Error("Stripe did not return a client secret");
        }

        return responseHandler.respond({
            status: HttpStatusCode.OK,
            error: false,
            errorDetails: "n/a",
            message: {
                clientSecret: paymentIntent.client_secret,
                amount: total,
            },
        });
    } catch (error) {
        const logErrorToDb = new Log({
            endpoint: "api/purchase/payment",
            message: "purchase payment failed",
            requestData: JSON.stringify(error),
            occurredAt: new Date(),
            method: "POST",
        });
        await logErrorToDb.save();
        return responseHandler.respond({
            status: HttpStatusCode.INTERNAL_SERVER,
            error: true,
            errorDetails: String(error),
            message: "Purchase payment failed",
        });
    }
}
