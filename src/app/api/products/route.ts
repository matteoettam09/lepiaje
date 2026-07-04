import Product from "@/models/Product";
import { ResponseHandler } from "@/helpers/response_handler";
import { HttpStatusCode } from "@/enums";
import { connection } from "@/config/db";

const responseHandler = new ResponseHandler();

export async function GET() {
    try {
        const db = await connection();
        if (!db) {
            return responseHandler.respond({
                error: true,
                errorDetails: "Database connection failed",
                message: "Could not connect",
                status: HttpStatusCode.INTERNAL_SERVER,
            });
        }

        const products = await Product.find({ inStock: true }).lean();
        return responseHandler.respond({
            error: false,
            errorDetails: "N/A",
            message: products,
            status: HttpStatusCode.OK,
        });
    } catch (err) {
        return responseHandler.respond({
            error: true,
            errorDetails: String(err),
            message: "Failed to fetch products",
            status: HttpStatusCode.INTERNAL_SERVER,
        });
    }
}
