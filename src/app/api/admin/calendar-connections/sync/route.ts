import { connection } from "@/config/db";
import { ResponseHandler } from "@/helpers/response_handler";
import { HttpStatusCode } from "@/enums";
import { requireAdminSession } from "@/lib/auth/requireAdmin";
import { syncExternalCalendars } from "@/lib/calendar/syncExternalCalendars";

export const dynamic = "force-dynamic";

const responseHandler = new ResponseHandler();

export async function POST(req: Request) {
    const auth = await requireAdminSession();
    if (!auth.ok) return auth.response;

    await connection();

    const body = (await req.json().catch(() => ({}))) as {
        propertyId?: number;
    };

    const results = await syncExternalCalendars(
        body.propertyId ? { propertyId: body.propertyId } : undefined
    );

    return responseHandler.respond({
        error: false,
        errorDetails: "n/a",
        message: results,
        status: HttpStatusCode.OK,
    });
}
