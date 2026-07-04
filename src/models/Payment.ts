import mongoose, { Schema, model } from "mongoose";
import { Payment } from "@/types";

const paymentSchema = new Schema<Payment>(
    {
        bookerEmail: {
            type: String,
            ref: "bookings",
            required: true,
        },
        bookingUuid: {
            type: String,
            required: false,
            trim: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            required: false,
        },
        paymentDate: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            required: true,
        },
        transactionId: {
            type: String,
            required: false,
            trim: true,
        },
        additionalDetails: {
            type: String,
            required: false,
        },
    },
    { timestamps: true }
);

export default mongoose.models?.payments || model("payments", paymentSchema);
