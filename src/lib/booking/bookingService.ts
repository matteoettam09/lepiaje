import { v4 as uuidv4 } from "uuid";
import Booking from "@/models/Booking";
import { BookingStatus } from "@/enums";
import { BookingType } from "@/types";
import { checkPropertyAvailability } from "./checkAvailability";
import { assignBedsForBooking } from "./assignBeds";

function generateBookingReference(): string {
    return `LP-${uuidv4().slice(0, 8).toUpperCase()}`;
}

export async function createPendingBooking(
    bookingData: BookingType,
    totalPaid: number
): Promise<{ booking: BookingType; error?: string }> {
    const availability = await checkPropertyAvailability(bookingData);
    if (!availability.available) {
        return { booking: bookingData, error: availability.reason };
    }

    const bookingReference = generateBookingReference();
    const newBooking = new Booking({
        ...bookingData,
        totalPaid,
        status: BookingStatus.PENDING,
        bookingReference,
    });
    const saved = await newBooking.save();
    return { booking: saved.toObject() as BookingType };
}

export async function confirmBookingImmediately(
    bookingData: BookingType
): Promise<{ booking?: BookingType; error?: string }> {
    const availability = await checkPropertyAvailability(bookingData);
    if (!availability.available) {
        return { error: availability.reason };
    }

    const assignment = await assignBedsForBooking(bookingData);
    if (!assignment.success) {
        return { error: assignment.reason };
    }

    const bookingReference = generateBookingReference();
    const newBooking = new Booking({
        ...bookingData,
        status: BookingStatus.CONFIRMED,
        bookingReference,
    });
    const saved = await newBooking.save();
    return { booking: saved.toObject() as BookingType };
}

export async function confirmBookingByUuid(
    bookingUuid: string,
    stripePaymentIntentId: string,
    amountPaid: number
): Promise<{ booking?: BookingType; error?: string }> {
    const booking = await Booking.findOne({ uuid: bookingUuid });
    if (!booking) {
        return { error: "Booking not found" };
    }

    if (booking.status === BookingStatus.CONFIRMED) {
        return { booking: booking.toObject() as BookingType };
    }

    const bookingData = booking.toObject() as BookingType;
    const availability = await checkPropertyAvailability(bookingData);
    if (!availability.available) {
        booking.status = BookingStatus.CANCELLED;
        await booking.save();
        return { error: "Dates no longer available" };
    }

    const assignment = await assignBedsForBooking(bookingData);
    if (!assignment.success) {
        booking.status = BookingStatus.CANCELLED;
        await booking.save();
        return { error: assignment.reason };
    }

    booking.status = BookingStatus.CONFIRMED;
    booking.stripePaymentIntentId = stripePaymentIntentId;
    booking.totalPaid = amountPaid;
    await booking.save();

    return { booking: booking.toObject() as BookingType };
}

export async function getBookingByReference(
    reference: string
): Promise<BookingType | null> {
    const booking = await Booking.findOne({ bookingReference: reference });
    return booking ? (booking.toObject() as BookingType) : null;
}
