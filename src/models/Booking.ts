import mongoose, { Schema, model } from "mongoose";
import { BookingType } from "@/types";
import { v4 as uuidv4 } from "uuid";
const bookingSchema = new Schema<BookingType>(
    {
        uuid: {
            type: String,
            required: false,
            trim: true,
            default: String(uuidv4)
        },
        bookerName: {
            type: String,
            required: true, // The booker's name is required
            trim: true,
        },
        bookerGender: {
            type: String,
            required: true,
            trim: true
        },
        propertyName: {
            type: String,
            required: true,
            trim: true,
        },
        propertyId: {
            type: Number,
            required: true,
        },
        roomId: {
            type: String, // Track specific room (optional if needed for room-level assignment)
            required: false,
            ref: "rooms",
        },
        checkIn: {
            type: Date,
            required: true,
        },
        checkInTime: {
            type: String,
            required: true,
            default: "15:00", // Default check-in time
        },
        checkOut: {
            type: Date,
            required: true,
        },
        checkOutTime: {
            type: String,
            required: true,
            default: "11:00", // Default check-out time
        },
        totalPaid: {
            type: Number,
            required: true,
        },
        numberOfGuests: {
            type: Number,
            required: true,
        },
        guests: [{
            name: { type: String, required: true, trim: true },
            gender: { type: String, required: true, trim: true }
        }],
        bookerEmail: {
            type: String,
            required: true, // Always required for the main booker
            trim: true,
        },
        bookerPhone: {
            type: String,
            required: false, // Optional phone number for the main booker
            trim: true,
        },
        dateOfBooking: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled"],
            default: "pending",
        },
        stripePaymentIntentId: {
            type: String,
            required: false,
            trim: true,
        },
        bookingReference: {
            type: String,
            required: false,
            trim: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.bookings || model("bookings", bookingSchema);
