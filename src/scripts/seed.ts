import { connection } from "@/config/db";
import Bed from "@/models/Bed";
import Property from "@/models/Property";
import Room from "@/models/Room";
import { Property as PropertyType } from "@/types";
import {
    bedSeedDataForLaVillaPerlata,
    bedSeedDataForAlCentesimoChilometroFemale,
    bedSeedDataForAlCentesimoChilometroMale,
    roomSeedDataForLaVillaPerlata,
    roomSeedDataForAlCentesimoChilometroFemale,
    roomSeedDataForAlCentesimoChilometroMale,
    propertySeedDataForLePiaje
} from "../seed/seed.data";
import { BedType, RoomType } from "@/types";
import Product from "@/models/Product";
import { productSeedData } from "../seed/product.seed";

const seedData: Record<string, BedType[] | RoomType[] | PropertyType[]> = {
    Bed: [
        ...bedSeedDataForLaVillaPerlata,
        ...bedSeedDataForAlCentesimoChilometroFemale,
        ...bedSeedDataForAlCentesimoChilometroMale,
    ],
    Room: [
        ...roomSeedDataForLaVillaPerlata,
        ...roomSeedDataForAlCentesimoChilometroFemale,
        ...roomSeedDataForAlCentesimoChilometroMale,
    ],
    Property: propertySeedDataForLePiaje,
};

const seedDb = async () => {
    try {
        const db = await connection();
        console.log("Connection to seed successful", Boolean(db));

        // Seed beds first
        const bedData = seedData.Bed;
        if (bedData) {
            const existingBeds = await Bed.findOne();
            if (!existingBeds) {
                console.log("No bed data found, seeding bed data...");
                await Bed.insertMany(bedData);
            } else {
                console.log("Bed data already exists, no seeding necessary.");
            }
        }

        // Seed rooms second
        const roomData = seedData.Room;
        if (roomData) {
            const existingRooms = await Room.findOne();
            if (!existingRooms) {
                console.log("No room data found, seeding room data...");
                await Room.insertMany(roomData);
            } else {
                console.log("Room data already exists, no seeding necessary.");
            }
        }

        // Seed properties last
        const propertyData = seedData.Property;
        if (propertyData) {
            const existingProperties = await Property.findOne();
            if (!existingProperties) {
                console.log("No property data found, seeding property data...");
                await Property.insertMany(propertyData);
            } else {
                console.log("Property data already exists, no seeding necessary.");
            }
        }

        // Sync products with seed data
        const seedProductIds = productSeedData.map((product) => product.productId);

        for (const product of productSeedData) {
            await Product.findOneAndUpdate(
                { productId: product.productId },
                { $set: product },
                { upsert: true }
            );
        }

        const deleteResult = await Product.deleteMany({
            productId: { $nin: seedProductIds },
        });

        if (deleteResult.deletedCount > 0) {
            console.log(`Removed ${deleteResult.deletedCount} stale product(s).`);
        }

        console.log(`Synced ${productSeedData.length} product(s).`);

        process.exit();
    } catch (err) {
        console.error("Error seeding the database", JSON.stringify(err), err);
        process.exit(1);
    }
};

seedDb();
