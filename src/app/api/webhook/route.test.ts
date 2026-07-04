import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/webhook/route";
import { HttpStatusCode } from "@/enums";

vi.mock("@/config/db", () => ({
    connection: vi.fn().mockResolvedValue(true),
}));

const mockConstructStripeEvent = vi.fn();
const mockHandleStripeWebhookEvent = vi.fn().mockResolvedValue(undefined);

vi.mock("@/lib/payments/handleStripeWebhook", () => ({
    constructStripeEvent: (...args: unknown[]) => mockConstructStripeEvent(...args),
    handleStripeWebhookEvent: (...args: unknown[]) =>
        mockHandleStripeWebhookEvent(...args),
}));

const logSave = vi.fn().mockResolvedValue({});

vi.mock("@/models/Log", () => {
    class MockLog {
        save = logSave;
    }
    return { default: MockLog };
});

describe("POST /api/webhook", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
        mockConstructStripeEvent.mockReturnValue({
            type: "payment_intent.succeeded",
            data: { object: { id: "pi_test" } },
        });
    });

    it("processes a valid signature and returns 200", async () => {
        const response = await POST(
            new Request("http://localhost/api/webhook", {
                method: "POST",
                headers: {
                    "stripe-signature": "valid_sig",
                    "content-type": "application/json",
                },
                body: "{}",
            })
        );

        expect(response.status).toBe(HttpStatusCode.OK);
        expect(mockConstructStripeEvent).toHaveBeenCalled();
        expect(mockHandleStripeWebhookEvent).toHaveBeenCalled();
    });

    it("returns 400 when stripe-signature header is missing", async () => {
        const response = await POST(
            new Request("http://localhost/api/webhook", {
                method: "POST",
                body: "{}",
            })
        );

        expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
        expect(mockConstructStripeEvent).not.toHaveBeenCalled();
        expect(mockHandleStripeWebhookEvent).not.toHaveBeenCalled();
    });

    it("returns 400 on invalid signature", async () => {
        const signatureError = Object.assign(new Error("Invalid signature"), {
            type: "StripeSignatureVerificationError",
        });
        mockConstructStripeEvent.mockImplementation(() => {
            throw signatureError;
        });

        const response = await POST(
            new Request("http://localhost/api/webhook", {
                method: "POST",
                headers: {
                    "stripe-signature": "invalid_sig",
                },
                body: "{}",
            })
        );

        expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
        expect(mockHandleStripeWebhookEvent).not.toHaveBeenCalled();
        expect(logSave).not.toHaveBeenCalled();
    });
});
