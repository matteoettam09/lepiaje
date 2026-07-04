import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/purchase/payment/route";
import { HttpStatusCode } from "@/enums";
import { createMockStripe } from "@/__tests__/mocks/stripe";
import { getStripeClient } from "@/lib/payments/stripeClient";
import Product from "@/models/Product";

vi.mock("@/config/db", () => ({
    connection: vi.fn().mockResolvedValue(true),
}));

vi.mock("@/lib/payments/stripeClient", () => ({
    getStripeClient: vi.fn(),
}));

vi.mock("@/models/Product", () => ({
    default: {
        findOne: vi.fn(),
    },
}));

vi.mock("@/models/Log", () => {
    class MockLog {
        save = vi.fn().mockResolvedValue({});
    }
    return { default: MockLog };
});

describe("POST /api/purchase/payment", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(getStripeClient).mockReturnValue(createMockStripe());
        vi.mocked(Product.findOne).mockResolvedValue({
            productId: "extra-virgin-olive-oil",
            name: "Extra Virgin Olive Oil",
            price: 12,
            inStock: true,
        } as never);
    });

    it("returns clientSecret on happy path", async () => {
        const response = await POST(
            new Request("http://localhost/api/purchase/payment", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    items: [{ productId: "extra-virgin-olive-oil", quantity: 2 }],
                    clientEmail: "shopper@example.com",
                }),
            })
        );

        expect(response.status).toBe(HttpStatusCode.OK);
        const body = await response.json();
        expect(body.message.clientSecret).toBe("pi_test_123_secret");
        expect(body.message.amount).toBe(24);
    });

    it("returns 400 for out-of-stock product", async () => {
        vi.mocked(Product.findOne).mockResolvedValue(null);

        const response = await POST(
            new Request("http://localhost/api/purchase/payment", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    items: [{ productId: "missing-product", quantity: 1 }],
                    clientEmail: "shopper@example.com",
                }),
            })
        );

        expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
        const body = await response.json();
        expect(body.message).toBe("Product not found or out of stock");
    });

    it("returns 400 when email is missing", async () => {
        const response = await POST(
            new Request("http://localhost/api/purchase/payment", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    items: [{ productId: "extra-virgin-olive-oil", quantity: 1 }],
                    clientEmail: "",
                }),
            })
        );

        expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
    });
});
