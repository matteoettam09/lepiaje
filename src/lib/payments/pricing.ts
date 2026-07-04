import Property from "@/models/Property";
import { calculate_price } from "@/utils/calculate_price";
import { BookingType } from "@/types";
import { countBookingGuests } from "@/lib/booking/guestCount";
import {
    VILLA_BASE_PRICE_PER_NIGHT,
    VILLA_EXTRA_GUEST_PRICE,
} from "@/constants/villa_pricing";
import { Property as PropertyEnum } from "@/enums";

export async function computeBookingPrice(
    bookingData: BookingType
): Promise<{ totalPrice: number; error?: string }> {
    const property = await Property.findOne({ id: bookingData.propertyId });
    if (!property) {
        return { totalPrice: 0, error: "Property not found" };
    }

    if (!bookingData.checkIn || !bookingData.checkOut) {
        return { totalPrice: 0, error: "Missing check-in or check-out dates" };
    }

    const isVilla = bookingData.propertyId === PropertyEnum.LA_VILLA_PERLATA;
    const basePrice = isVilla
        ? VILLA_BASE_PRICE_PER_NIGHT
        : property.price_per_night;
    const extraGuestPrice = isVilla
        ? VILLA_EXTRA_GUEST_PRICE
        : property.price_per_additional_guest;

    const priceDetails = calculate_price(
        { from: bookingData.checkIn, to: bookingData.checkOut },
        basePrice,
        extraGuestPrice,
        countBookingGuests(bookingData),
        bookingData.propertyId
    );

    return { totalPrice: priceDetails.totalPrice };
}
