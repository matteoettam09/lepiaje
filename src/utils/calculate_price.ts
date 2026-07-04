import { Property as PropertyEnum } from "@/enums";
import { PriceDetails } from "@/types";

interface DateRange {
    from: string | null | Date;
    to: string | null | Date;
}

function additionalGuestSurchargePerNight(
    totalGuests: number,
    pricePerAdditionalGuest: number,
    propertyId?: number
): number {
    if (propertyId === PropertyEnum.LA_VILLA_PERLATA) {
        return Math.max(0, totalGuests - 2) * pricePerAdditionalGuest;
    }

    return Math.max(0, totalGuests - 1) * pricePerAdditionalGuest;
}

function emptyPriceDetails(
    basePricePerNight: number,
    totalGuests: number
): PriceDetails {
    return {
        nights: 0,
        pricePerNight: basePricePerNight,
        pricePerGuest: 0,
        totalGuests,
        totalPrice: 0,
    };
}

export function calculate_price(
    dates: DateRange | null,
    basePricePerNight: number,
    pricePerAdditionalGuest: number,
    totalGuests: number,
    propertyId?: number
): PriceDetails {
    if (!dates?.from || !dates?.to) {
        return emptyPriceDetails(basePricePerNight, totalGuests);
    }

    const checkInDate = new Date(dates.from);
    const checkOutDate = new Date(dates.to);

    if (
        Number.isNaN(checkInDate.getTime()) ||
        Number.isNaN(checkOutDate.getTime()) ||
        checkOutDate.getTime() <= checkInDate.getTime()
    ) {
        return emptyPriceDetails(basePricePerNight, totalGuests);
    }

    const msPerNight = 1000 * 60 * 60 * 24;
    const nights = Math.ceil(
        (checkOutDate.getTime() - checkInDate.getTime()) / msPerNight
    );

    if (nights <= 0) {
        return emptyPriceDetails(basePricePerNight, totalGuests);
    }

    const pricePerNight = basePricePerNight;
    const pricePerGuest = additionalGuestSurchargePerNight(
        totalGuests,
        pricePerAdditionalGuest,
        propertyId
    );

    const totalPrice = nights * (pricePerNight + pricePerGuest);

    return {
        nights,
        pricePerNight,
        pricePerGuest,
        totalGuests,
        totalPrice,
    };
}
