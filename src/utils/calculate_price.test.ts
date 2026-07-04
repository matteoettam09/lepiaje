import { describe, it, expect } from "vitest";
import { calculate_price } from "@/utils/calculate_price";
import { Property as PropertyEnum } from "@/enums";
import { CENTESIMO_PRICE_PER_PERSON_PER_NIGHT } from "@/constants/centesimo_pricing";

describe("calculate_price", () => {
    it("charges Centesimo at €25 per person per night", () => {
        const oneGuest = calculate_price(
            { from: "2026-06-01", to: "2026-06-02" },
            CENTESIMO_PRICE_PER_PERSON_PER_NIGHT,
            CENTESIMO_PRICE_PER_PERSON_PER_NIGHT,
            1,
            PropertyEnum.AL_CENTESIMO_CHILOMETRO
        );

        expect(oneGuest.nights).toBe(1);
        expect(oneGuest.totalPrice).toBe(25);
        expect(oneGuest.pricePerNight).toBe(25);
        expect(oneGuest.pricePerGuest).toBe(0);
    });

    it("scales Centesimo price by guest count and nights", () => {
        const result = calculate_price(
            { from: "2026-06-01", to: "2026-06-03" },
            CENTESIMO_PRICE_PER_PERSON_PER_NIGHT,
            CENTESIMO_PRICE_PER_PERSON_PER_NIGHT,
            3,
            PropertyEnum.AL_CENTESIMO_CHILOMETRO
        );

        expect(result.nights).toBe(2);
        expect(result.totalPrice).toBe(2 * 3 * 25);
    });

    it("calculates base price for one guest one night (legacy default)", () => {
        const result = calculate_price(
            { from: "2026-06-01", to: "2026-06-02" },
            20,
            15,
            1
        );
        expect(result.nights).toBe(1);
        expect(result.totalPrice).toBe(20);
    });

    it("adds surcharge for additional guests from the second guest (legacy default)", () => {
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
