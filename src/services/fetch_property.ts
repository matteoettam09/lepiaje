import { Property as PropertyType } from "@/types";
import { connection } from "@/config/db";
import Property from "@/models/Property";

export async function fetch_property(
    propertyId: number
): Promise<PropertyType | null> {
    if (!process.env.DB_CONNECTION_STRING) {
        return null;
    }

    try {
        const db = await connection();
        if (!db) {
            return null;
        }

        const result: PropertyType | null = await Property.findOne({
            id: propertyId,
        });
        return result;
    } catch (err) {
        console.error(
            "error fetching property data at fetch_property function",
            err
        );
        return null;
    }
}
