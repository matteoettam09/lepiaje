import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { v4 as uuidv4 } from "uuid";
import {
    connectMemoryDb,
    clearMemoryDb,
    disconnectMemoryDb,
} from "@/__tests__/helpers/mongoMemoryServer";
import { seedTestDatabase } from "@/__tests__/helpers/seedTestDb";
import {
    confirmBookingByUuid,
    createPendingBooking,
} from "@/lib/booking/bookingService";
import Booking from "@/models/Booking";
import Bed from "@/models/Bed";
import { BookingType } from "@/types";
import { Property as PropertyEnum } from "@/enums";
import { BookingStatus } from "@/enums";

function buildVillaBooking(overrides: Partial<BookingType> = {}): BookingType {
    return {
        uuid: uuidv4(),
        bookerName: "Test Guest",
        bookerEmail: "guest@example.com",
        bookerGender: "male",
        propertyName: "La Villa Perlata",
        propertyId: PropertyEnum.LA_VILLA_PERLATA,
        checkIn: new Date("2026-08-01"),
        checkOut: new Date("2026-08-03"),
        checkInTime: "15:00",
        checkOutTime: "11:00",
        numberOfGuests: 1,
        guests: [],
        ...overrides,
    };
}

describe("bookingService integration", () => {
    beforeAll(async () => {
        await connectMemoryDb();
    });

    afterAll(async () => {
        await disconnectMemoryDb();
    });

    beforeEach(async () => {
        await clearMemoryDb();
        await seedTestDatabase();
    });

    it("creates a pending booking when dates are available", async () => {
        const bookingData = buildVillaBooking();

        const { booking, error } = await createPendingBooking(bookingData, 40);

        expect(error).toBeUndefined();
        expect(booking.status).toBe(BookingStatus.PENDING);
        expect(booking.bookingReference).toMatch(/^LP-/);

        const saved = await Booking.findOne({ uuid: booking.uuid });
        expect(saved?.status).toBe(BookingStatus.PENDING);
    });

    it("confirms a pending booking and assigns a whole-property hold", async () => {
        const bookingData = buildVillaBooking();
        const { booking } = await createPendingBooking(bookingData, 40);

        const { booking: confirmed, error } = await confirmBookingByUuid(
            booking.uuid!,
            "pi_test_confirm",
            40
        );

        expect(error).toBeUndefined();
        expect(confirmed?.status).toBe(BookingStatus.CONFIRMED);
        expect(confirmed?.stripePaymentIntentId).toBe("pi_test_confirm");

        const beds = await Bed.find({ room_gender: "mixed" });
        const hasHold = beds.some((bed) =>
            bed.occupants.some(
                (occupant) =>
                    occupant.name === "Test Guest" &&
                    new Date(occupant.check_in).toISOString() ===
                        new Date("2026-08-01").toISOString()
            )
        );
        expect(hasHold).toBe(true);
    });

    it("rejects overlapping Villa Perlata bookings", async () => {
        const firstBooking = buildVillaBooking();
        await createPendingBooking(firstBooking, 40);
        await confirmBookingByUuid(firstBooking.uuid!, "pi_first", 40);

        const overlapping = buildVillaBooking({
            uuid: uuidv4(),
            bookerName: "Second Guest",
            bookerEmail: "second@example.com",
            checkIn: new Date("2026-08-02"),
            checkOut: new Date("2026-08-04"),
        });

        const { error } = await createPendingBooking(overlapping, 40);

        expect(error).toBe("Property is not available for these dates");
    });

    it("assigns a female bed at Al Centesimo Chilometro", async () => {
        const bookingData: BookingType = {
            uuid: uuidv4(),
            bookerName: "Hostel Guest",
            bookerEmail: "hostel@example.com",
            bookerGender: "female",
            propertyName: "Al Centesimo Chilometro",
            propertyId: PropertyEnum.AL_CENTESIMO_CHILOMETRO,
            checkIn: new Date("2026-09-01"),
            checkOut: new Date("2026-09-03"),
            checkInTime: "15:00",
            checkOutTime: "11:00",
            numberOfGuests: 1,
            guests: [],
        };

        const { booking, error } = await createPendingBooking(bookingData, 40);
        expect(error).toBeUndefined();

        const { booking: confirmed, error: confirmError } =
            await confirmBookingByUuid(booking.uuid!, "pi_hostel", 40);

        expect(confirmError).toBeUndefined();
        expect(confirmed?.status).toBe(BookingStatus.CONFIRMED);

        const femaleBeds = await Bed.find({ room_gender: "female" });
        expect(
            femaleBeds.some((bed) =>
                bed.occupants.some((o) => o.name === "Hostel Guest")
            )
        ).toBe(true);
    });
});
