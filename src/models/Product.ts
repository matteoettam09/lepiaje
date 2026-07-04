import mongoose, { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { ProductType } from "@/types";

const productSchema = new Schema<ProductType>(
    {
        uuid: {
            type: String,
            required: true,
            default: () => uuidv4(),
        },
        productId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        name: { type: String, required: true, trim: true },
        nameIt: { type: String, required: false, trim: true },
        description: { type: String, required: true, trim: true },
        descriptionIt: { type: String, required: false, trim: true },
        price: { type: Number, required: true },
        unit: { type: String, required: true, trim: true },
        unitIt: { type: String, required: false, trim: true },
        inStock: { type: Boolean, default: true },
        seasonal: { type: Boolean, default: false },
        image: { type: String, required: false },
    },
    { timestamps: true }
);

export default mongoose.models.products || model("products", productSchema);
