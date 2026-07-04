import Property from "@/models/Property";
import { calculate_price } from "@/utils/calculate_price";
import { BookingType } from "@/types";

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

    const priceDetails = calculate_price(
        { from: bookingData.checkIn, to: bookingData.checkOut },
        property.price_per_night,
        property.price_per_additional_guest,
        bookingData.numberOfGuests
    );

    return { totalPrice: priceDetails.totalPrice };
}
