import { isBefore, isSameDay, startOfDay } from "date-fns";
import { DateRange } from "react-day-picker";

export type BookingDateRange = {
    from: Date;
    to: Date | null;
};

type StoredDateRange = {
    from: Date | string | null;
    to?: Date | string | null;
} | null;

function toDate(value: Date | string | null | undefined): Date | null {
    if (!value) return null;
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : startOfDay(date);
}

function resolveClickedDay(
    checkIn: Date,
    range: DateRange
): Date {
    const rangeFrom = startOfDay(range.from!);
    const rangeTo = range.to ? startOfDay(range.to) : undefined;

    if (rangeTo) {
        if (isSameDay(rangeFrom, checkIn)) {
            return rangeTo;
        }
        return rangeFrom;
    }

    return rangeFrom;
}

function resolveClickedDayAfterCompleteRange(
    prevFrom: Date,
    prevTo: Date,
    range: DateRange
): Date {
    const rangeFrom = startOfDay(range.from!);
    const rangeTo = range.to ? startOfDay(range.to) : undefined;

    if (!rangeTo) {
        return rangeFrom;
    }

    const fromChanged = !isSameDay(rangeFrom, prevFrom);
    const toChanged = !isSameDay(rangeTo, prevTo);

    if (fromChanged && !toChanged) {
        return rangeFrom;
    }

    if (toChanged && !fromChanged) {
        return rangeTo;
    }

    if (fromChanged && toChanged) {
        if (
            !isSameDay(rangeFrom, prevFrom) &&
            !isSameDay(rangeFrom, prevTo)
        ) {
            return rangeFrom;
        }
        return rangeTo;
    }

    return rangeFrom;
}

export function advanceBookingDateSelection(
    prev: StoredDateRange,
    range: DateRange | undefined
): BookingDateRange | null {
    if (!range?.from) {
        return null;
    }

    const clickedFrom = startOfDay(range.from);
    const prevFrom = prev ? toDate(prev.from) : null;
    const prevTo = prev ? toDate(prev.to) : null;

    if (prevFrom && prevTo) {
        const clicked = resolveClickedDayAfterCompleteRange(
            prevFrom,
            prevTo,
            range
        );
        return { from: clicked, to: null };
    }

    if (prevFrom && !prevTo) {
        const clicked = resolveClickedDay(prevFrom, range);

        if (isBefore(clicked, prevFrom) || isSameDay(clicked, prevFrom)) {
            return { from: clicked, to: null };
        }

        return { from: prevFrom, to: clicked };
    }

    return { from: clickedFrom, to: null };
}
