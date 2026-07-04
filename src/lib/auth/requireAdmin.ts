import { cookies } from "next/headers";
import { ResponseHandler } from "@/helpers/response_handler";
import { HttpStatusCode } from "@/enums";
import { verifySessionToken } from "@/lib/auth/session";

const responseHandler = new ResponseHandler();

export async function requireAdminSession(): Promise<
    { ok: true } | { ok: false; response: Response }
> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return {
            ok: false,
            response: responseHandler.respond({
                error: true,
                errorDetails: "Unauthorized",
                message: "Not authenticated",
                status: HttpStatusCode.UN_AUTH,
            }),
        };
    }

    const { valid } = await verifySessionToken(token);
    if (!valid) {
        return {
            ok: false,
            response: responseHandler.respond({
                error: true,
                errorDetails: "Invalid session",
                message: "Not authenticated",
                status: HttpStatusCode.UN_AUTH,
            }),
        };
    }

    return { ok: true };
}
