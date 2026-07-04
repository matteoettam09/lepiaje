import mongoose, { Schema, model } from "mongoose";
import { CalendarConnectionType } from "@/types/calendar.types";

const calendarConnectionSchema = new Schema<CalendarConnectionType>(
    {
        propertyId: {
            type: Number,
            required: true,
        },
        platform: {
            type: String,
            required: true,
            enum: ["airbnb", "booking"],
        },
        importUrl: {
            type: String,
            default: "",
            trim: true,
        },
        exportToken: {
            type: String,
            required: true,
            trim: true,
        },
        enabled: {
            type: Boolean,
            default: true,
        },
        lastImportAt: {
            type: Date,
            required: false,
        },
        lastImportStatus: {
            type: String,
            enum: ["ok", "error", "skipped"],
            default: "skipped",
        },
        lastImportError: {
            type: String,
            required: false,
        },
    },
    { timestamps: true }
);

calendarConnectionSchema.index({ propertyId: 1, platform: 1 }, { unique: true });

export default mongoose.models.calendar_connections ||
    model("calendar_connections", calendarConnectionSchema);
