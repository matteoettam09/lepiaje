import { describe, it, expect } from "vitest";
import { calculate_price } from "@/utils/calculate_price";

describe("calculate_price", () => {
    it("calculates base price for one guest one night", () => {
        const result = calculate_price(
            { from: "2026-06-01", to: "2026-06-02" },
            20,
            15,
            1
        );
        expect(result.nights).toBe(1);
        expect(result.totalPrice).toBe(20);
    });

    it("adds surcharge for additional guests", () => {
        const result = calculate_price(
            { from: "2026-06-01", to: "2026-06-03" },
            20,
            15,
            3
        );
        expect(result.nights).toBe(2);
        expect(result.totalPrice).toBe(2 * (20 + 2 * 15));
    });
});
