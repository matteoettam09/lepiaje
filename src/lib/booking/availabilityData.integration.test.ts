import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import {
    connectMemoryDb,
    clearMemoryDb,
    disconnectMemoryDb,
} from "@/__tests__/helpers/mongoMemoryServer";
import { seedTestDatabase } from "@/__tests__/helpers/seedTestDb";
import { getAvailabilityData } from "@/lib/booking/availabilityData";
import Bed from "@/models/Bed";
import { Property as PropertyEnum } from "@/enums";

describe("availabilityData integration", () => {
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

    it("returns mixed rooms for La Villa Perlata", async () => {
        const data = await getAvailabilityData(PropertyEnum.LA_VILLA_PERLATA);

        expect(data).not.toBeNull();
        expect(data?.mixed_rooms).toBeDefined();
        expect(data?.male_rooms).toBeUndefined();
        expect(data?.female_rooms).toBeUndefined();
        expect(data?.mixed_rooms?.length).toBeGreaterThan(0);
        expect(data?.mixed_rooms?.[0]).toMatchObject({
            roomUuid: expect.any(String),
            occupants: expect.any(Array),
        });
    });

    it("returns gender-segregated rooms for Al Centesimo Chilometro", async () => {
        const data = await getAvailabilityData(
            PropertyEnum.AL_CENTESIMO_CHILOMETRO
        );

        expect(data).not.toBeNull();
        expect(data?.male_rooms?.length).toBeGreaterThan(0);
        expect(data?.female_rooms?.length).toBeGreaterThan(0);
        expect(data?.mixed_rooms).toBeUndefined();
    });

    it("reflects bed occupants in availability response", async () => {
        const bed = await Bed.findOne({ room_gender: "mixed" });
        expect(bed).not.toBeNull();

        bed!.occupants.push({
            name: "Existing Guest",
            gender: "mixed",
            check_in: new Date("2026-10-01"),
            check_out: new Date("2026-10-05"),
        });
        await bed!.save();

        const data = await getAvailabilityData(PropertyEnum.LA_VILLA_PERLATA);
        const occupiedBed = data?.mixed_rooms?.find(
            (room) => room.roomUuid === bed!.uuid
        );

        expect(occupiedBed?.occupants).toHaveLength(1);
        expect(occupiedBed?.occupants[0].name).toBe("Existing Guest");
    });
});
