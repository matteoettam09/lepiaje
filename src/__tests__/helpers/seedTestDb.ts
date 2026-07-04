import Bed from "@/models/Bed";
import Room from "@/models/Room";
import Property from "@/models/Property";
import {
    bedSeedDataForLaVillaPerlata,
    bedSeedDataForAlCentesimoChilometroFemale,
    bedSeedDataForAlCentesimoChilometroMale,
    roomSeedDataForLaVillaPerlata,
    roomSeedDataForAlCentesimoChilometroFemale,
    roomSeedDataForAlCentesimoChilometroMale,
    propertySeedDataForLePiaje,
} from "@/seed/seed.data";

export async function seedTestDatabase(): Promise<void> {
    await Bed.insertMany([
        ...bedSeedDataForLaVillaPerlata,
        ...bedSeedDataForAlCentesimoChilometroFemale,
        ...bedSeedDataForAlCentesimoChilometroMale,
    ]);
    await Room.insertMany([
        ...roomSeedDataForLaVillaPerlata,
        ...roomSeedDataForAlCentesimoChilometroFemale,
        ...roomSeedDataForAlCentesimoChilometroMale,
    ]);
    await Property.insertMany(propertySeedDataForLePiaje);
}
