export interface Guests {
    name: string,
    gender: string
    check_in?: Date | string,
    check_out?: Date | string,
}

export type BookingStatusType = "pending" | "confirmed" | "cancelled";

export interface BookingType {
    uuid?: string;
    bookerName?: string;
    bookerEmail?: string;
    bookerPhone?: string;
    bookerGender: string;
    propertyName: string;
    checkIn: Date | undefined | string;
    checkOut: Date | undefined | string;
    numberOfGuests: number;
    totalPaid?: number;
    guests: Guests[];
    dateOfBooking?: Date;
    propertyId: number;
    checkInTime: string;
    checkOutTime: string;
    roomId?: string;
    status?: BookingStatusType;
    stripePaymentIntentId?: string;
    bookingReference?: string;
}


export interface PriceDetails {
    nights: number,
    pricePerNight: number,
    pricePerGuest: number,
    totalGuests: number,
    totalPrice: number
}


