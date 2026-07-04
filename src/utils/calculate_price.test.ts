import { describe, it, expect } from "vitest";
import { calculate_price } from "@/utils/calculate_price";
import { Property as PropertyEnum } from "@/enums";

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

    it("adds surcharge for additional guests from the second guest (hostel default)", () => {
        const result = calculate_price(
            { from: "2026-06-01", to: "2026-06-03" },
            20,
            15,
            3
        );
        expect(result.nights).toBe(2);
        expect(result.totalPrice).toBe(2 * (20 + 2 * 15));
    });

    it("charges villa base rate for booker only or with one extra guest", () => {
        const oneGuest = calculate_price(
            { from: "2026-06-01", to: "2026-06-02" },
            175,
            50,
            1,
            PropertyEnum.LA_VILLA_PERLATA
        );
        const twoGuests = calculate_price(
            { from: "2026-06-01", to: "2026-06-02" },
            175,
            50,
            2,
            PropertyEnum.LA_VILLA_PERLATA
        );

        expect(oneGuest.totalPrice).toBe(175);
        expect(twoGuests.totalPrice).toBe(175);
    });

    it("adds villa surcharge from the third guest at €50/night", () => {
        const threeGuests = calculate_price(
            { from: "2026-06-01", to: "2026-06-02" },
            175,
            50,
            3,
            PropertyEnum.LA_VILLA_PERLATA
        );
        const fiveGuests = calculate_price(
            { from: "2026-06-01", to: "2026-06-02" },
            175,
            50,
            5,
            PropertyEnum.LA_VILLA_PERLATA
        );

        expect(threeGuests.totalPrice).toBe(175 + 50);
        expect(fiveGuests.totalPrice).toBe(175 + 3 * 50);
    });
});
