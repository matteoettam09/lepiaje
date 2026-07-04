import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { disconnectDb } from "@/config/db";

let mongoServer: MongoMemoryServer | null = null;

export async function connectMemoryDb(): Promise<void> {
    if (mongoServer) {
        await clearMemoryDb();
        return;
    }

    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.DB_CONNECTION_STRING = uri;

    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }

    await mongoose.connect(uri);
}

export async function clearMemoryDb(): Promise<void> {
    const collections = mongoose.connection.collections;
    for (const collection of Object.values(collections)) {
        await collection.deleteMany({});
    }
}

export async function disconnectMemoryDb(): Promise<void> {
    await disconnectDb();
    if (mongoServer) {
        await mongoServer.stop();
        mongoServer = null;
    }
}
