import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe | null {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) return null;
    if (!stripeClient) {
        stripeClient = new Stripe(secretKey);
    }
    return stripeClient;
}
