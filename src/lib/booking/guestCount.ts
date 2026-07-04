export function countBookingGuests(booking: {
    guests?: unknown[] | null;
}): number {
    return 1 + (booking.guests?.length ?? 0);
}

export function withGuestCount<T extends { guests?: unknown[] | null }>(
    booking: T
): T & { numberOfGuests: number } {
    return { ...booking, numberOfGuests: countBookingGuests(booking) };
}
