import { vi } from "vitest";
import type Stripe from "stripe";

export function createMockStripe(
    overrides: Partial<{
        paymentIntentsCreate: Stripe.PaymentIntent;
        constructEvent: Stripe.Event;
    }> = {}
) {
    const defaultPaymentIntent = {
        id: "pi_test_123",
        client_secret: "pi_test_123_secret",
        amount: 4000,
        currency: "eur",
        status: "succeeded",
        metadata: {},
    } as Stripe.PaymentIntent;

    return {
        paymentIntents: {
            create: vi.fn().mockResolvedValue(
                overrides.paymentIntentsCreate ?? defaultPaymentIntent
            ),
        },
        webhooks: {
            constructEvent: vi.fn(
                () =>
                    overrides.constructEvent ??
                    ({
                        type: "payment_intent.succeeded",
                        data: { object: defaultPaymentIntent },
                    } as Stripe.Event)
            ),
        },
    } as unknown as Stripe;
}

export function createPaymentIntentEvent(
    paymentIntent: Partial<Stripe.PaymentIntent>
): Stripe.Event {
    return {
        id: "evt_test",
        type: "payment_intent.succeeded",
        data: {
            object: {
                id: "pi_test",
                amount: 4000,
                status: "succeeded",
                metadata: {},
                ...paymentIntent,
            },
        },
    } as Stripe.Event;
}
