import { vi } from "vitest";
import type Stripe from "stripe";

export function createMockStripe(
    overrides: Partial<{
        paymentIntentsCreate: Stripe.PaymentIntent;
        constructEvent: Stripe.Event;
        constructEventError: Error;
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
            constructEvent: vi.fn(() => {
                if (overrides.constructEventError) {
                    throw overrides.constructEventError;
                }
                return (
                    overrides.constructEvent ??
                    ({
                        type: "payment_intent.succeeded",
                        data: { object: defaultPaymentIntent },
                    } as Stripe.Event)
                );
            }),
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

export function createPaymentFailedEvent(
    metadata: Record<string, string> = {}
): Stripe.Event {
    return {
        id: "evt_test_failed",
        type: "payment_intent.payment_failed",
        data: {
            object: {
                id: "pi_test_failed",
                amount: 4000,
                status: "requires_payment_method",
                metadata,
            },
        },
    } as Stripe.Event;
}

export function createUnhandledStripeEvent(type: string): Stripe.Event {
    return {
        id: "evt_test_unhandled",
        type,
        data: { object: {} },
    } as Stripe.Event;
}
