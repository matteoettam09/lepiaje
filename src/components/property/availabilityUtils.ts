import { AvailabilityData } from "@/lib/booking/availabilityData";
import { Occupant } from "@/types";

export interface DateRange {
    from: string | null | Date;
    to: string | null | Date;
}

export function isOverlapping(
    dateRanges: DateRange[],
    targetRange: DateRange | null
): boolean {
    if (!dateRanges?.length || !targetRange?.from || !targetRange.to) {
        return false;
    }

    const targetFrom = new Date(targetRange.from).getTime();
    const targetTo = new Date(targetRange.to).getTime();

    for (const range of dateRanges) {
        const rangeFrom = new Date(range.from!).getTime();
        const rangeTo = new Date(range.to!).getTime();

        if (
            (rangeFrom <= targetTo && rangeFrom >= targetFrom) ||
            (rangeTo <= targetTo && rangeTo >= targetFrom) ||
            (rangeFrom <= targetFrom && rangeTo >= targetTo)
        ) {
            return true;
        }
    }

    return false;
}

export function countAvailableBeds(
    rooms: { occupants: Occupant[] }[],
    fromDate: Date,
    toDate: Date
): { isFull: boolean; availableBedsToBook: number } {
    const totalBeds = rooms.length;
    let occupied = 0;

    rooms.forEach((room) => {
        const occupiedBeds = room.occupants.filter((occupant) => {
            const checkIn = new Date(occupant.check_in);
            const checkOut = new Date(occupant.check_out);
            return fromDate < checkOut && toDate > checkIn;
        }).length;
        occupied += occupiedBeds;
    });

    return {
        isFull: occupied === totalBeds,
        availableBedsToBook: totalBeds - occupied,
    };
}

function normalizeDate(date: string | Date): string {
    return new Date(date).toISOString().split("T")[0];
}

export function getBlockedDateRanges(
    beds: AvailabilityData,
    propertyId: number
): DateRange[] {
    if (propertyId === 1) {
        const ranges: DateRange[] = [];
        const seen = new Set<string>();

        for (const room of beds.mixed_rooms || []) {
            for (const occupant of room.occupants) {
                const key = `${normalizeDate(occupant.check_in)}|${normalizeDate(occupant.check_out)}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    ranges.push({
                        from: occupant.check_in,
                        to: occupant.check_out,
                    });
                }
            }
        }
        return ranges;
    }

    const allRooms = [
        ...(beds.male_rooms || []),
        ...(beds.female_rooms || []),
    ];

    const uniqueDateRanges = new Set<string>();
    allRooms.forEach((room) =>
        room.occupants.forEach((occupant) => {
            uniqueDateRanges.add(
                `${normalizeDate(occupant.check_in)}|${normalizeDate(occupant.check_out)}`
            );
        })
    );

    const dateRanges = Array.from(uniqueDateRanges).map((range) => {
        const [from, to] = range.split("|");
        return { from, to };
    });

    return dateRanges.filter(({ from, to }) =>
        allRooms.every((room) =>
            room.occupants.some(
                (occupant) =>
                    normalizeDate(occupant.check_in) === from &&
                    normalizeDate(occupant.check_out) === to
            )
        )
    );
}

export function processAvailabilityForDates(
    beds: AvailabilityData,
    propertyId: number,
    dates: DateRange
): {
    unavailableDates: DateRange[];
    availableMaleBeds: number;
    availableFemaleBeds: number;
    availableMixedBeds: number;
} {
    const unavailableDates: DateRange[] = [];
    let availableMaleBeds = 0;
    let availableFemaleBeds = 0;
    let availableMixedBeds = 0;

    if (!dates.from || !dates.to) {
        return {
            unavailableDates,
            availableMaleBeds,
            availableFemaleBeds,
            availableMixedBeds,
        };
    }

    const from = dates.from as Date;
    const to = dates.to as Date;

    if (propertyId === 1) {
        const mixedRooms = beds.mixed_rooms || [];
        const { isFull, availableBedsToBook } = countAvailableBeds(mixedRooms, from, to);
        availableMixedBeds = availableBedsToBook;
        if (isFull || availableBedsToBook === 0) {
            unavailableDates.push({ from: dates.from, to: dates.to });
        }
    }

    if (propertyId === 2) {
        const maleRooms = beds.male_rooms || [];
        const femaleRooms = beds.female_rooms || [];
        const { isFull: isMaleFull, availableBedsToBook: maleAvail } =
            countAvailableBeds(maleRooms, from, to);
        const { isFull: isFemaleFull, availableBedsToBook: femaleAvail } =
            countAvailableBeds(femaleRooms, from, to);

        availableMaleBeds = maleAvail;
        availableFemaleBeds = femaleAvail;

        if (isMaleFull && isFemaleFull) {
            unavailableDates.push({ from: dates.from, to: dates.to });
        }
    }

    return {
        unavailableDates,
        availableMaleBeds,
        availableFemaleBeds,
        availableMixedBeds,
    };
}
