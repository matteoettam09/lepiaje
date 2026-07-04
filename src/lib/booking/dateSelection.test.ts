import { describe, it, expect } from "vitest";
import { advanceBookingDateSelection } from "@/lib/booking/dateSelection";

function d(day: number): Date {
    return new Date(2026, 6, day);
}

describe("advanceBookingDateSelection", () => {
    it("sets check-in only on first click (no auto next-day checkout)", () => {
        const result = advanceBookingDateSelection(null, { from: d(8), to: undefined });

        expect(result).toEqual({ from: d(8), to: null });
    });

    it("clears selection when range has no from", () => {
        expect(advanceBookingDateSelection({ from: d(8), to: null }, undefined)).toBeNull();
    });

    it("sets check-out on second click after check-in only", () => {
        const result = advanceBookingDateSelection(
            { from: d(8), to: null },
            { from: d(8), to: d(20) }
        );

        expect(result).toEqual({ from: d(8), to: d(20) });
    });

    it("starts a new check-in after a complete range", () => {
        const result = advanceBookingDateSelection(
            { from: d(8), to: d(20) },
            { from: d(9), to: undefined }
        );

        expect(result).toEqual({ from: d(9), to: null });
    });

    it("starts a new check-in when RDP extends the range forward", () => {
        const result = advanceBookingDateSelection(
            { from: d(15), to: d(17) },
            { from: d(15), to: d(22) }
        );

        expect(result).toEqual({ from: d(22), to: null });
    });

    it("resets check-in when second click is before existing check-in", () => {
        const result = advanceBookingDateSelection(
            { from: d(9), to: null },
            { from: d(6), to: d(9) }
        );

        expect(result).toEqual({ from: d(6), to: null });
    });

    it("does not create a zero-night booking when second click equals check-in", () => {
        const result = advanceBookingDateSelection(
            { from: d(8), to: null },
            { from: d(8), to: d(8) }
        );

        expect(result).toEqual({ from: d(8), to: null });
    });

    it("follows 15 → 15–17 → 22 → 22–24 after forward reset click", () => {
        let state = advanceBookingDateSelection(null, { from: d(15), to: undefined });
        expect(state).toEqual({ from: d(15), to: null });

        state = advanceBookingDateSelection(state, { from: d(15), to: d(17) });
        expect(state).toEqual({ from: d(15), to: d(17) });

        state = advanceBookingDateSelection(state, { from: d(15), to: d(22) });
        expect(state).toEqual({ from: d(22), to: null });

        state = advanceBookingDateSelection(state, { from: d(22), to: d(24) });
        expect(state).toEqual({ from: d(22), to: d(24) });
    });

    it("follows the full click cycle: 8 → 8–20 → 9 → 6 → 6–9", () => {
        let state = advanceBookingDateSelection(null, { from: d(8), to: undefined });
        expect(state).toEqual({ from: d(8), to: null });

        state = advanceBookingDateSelection(state, { from: d(8), to: d(20) });
        expect(state).toEqual({ from: d(8), to: d(20) });

        state = advanceBookingDateSelection(state, { from: d(9), to: undefined });
        expect(state).toEqual({ from: d(9), to: null });

        state = advanceBookingDateSelection(state, { from: d(6), to: d(9) });
        expect(state).toEqual({ from: d(6), to: null });

        state = advanceBookingDateSelection(state, { from: d(6), to: d(9) });
        expect(state).toEqual({ from: d(6), to: d(9) });
    });
});
