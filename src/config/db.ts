import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let isConnected = false;

export async function connection() {
    const uri = process.env.DB_CONNECTION_STRING;
    if (!uri) {
        return null;
    }

    try {
        if (isConnected) {
            return mongoose.connection;
        }

        const dbconnection = await mongoose.connect(uri);
        if (dbconnection) {
            isConnected = true;
        }

        return dbconnection;
    } catch (err) {
        throw new Error(
            `something has failed getting the connection to the database ${err}`
        );
    }
}
