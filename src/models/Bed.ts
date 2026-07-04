import { v4 as uuidv4 } from "uuid";
import mongoose, { Schema, model } from "mongoose";
import { Bed, Occupant } from "@/types";

const occupantSchema = new Schema<Occupant>({
    name: {
        type: String,
        required: true
    },
    check_in: {
        type: Date,
        required: true
    },
    check_out: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true,
        trim: true
    },
    source: {
        type: String,
        required: false,
        trim: true,
    },
    externalUid: {
        type: String,
        required: false,
        trim: true,
    }
});

// Bed schema with an array of occupants over time
const bedSchema = new Schema<Bed>({
    uuid: {
        type: String,
        required: true,
        trim: true,
        default: String(uuidv4)
    },
    room_gender: {
        type: String,
        required: true,
        trim: true
    },
    occupants: [{
        type: occupantSchema,
        required: false,
    }],
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.models.beds || model("beds", bedSchema);
