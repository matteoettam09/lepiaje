import { connection } from "@/config/db";
import { ResponseHandler } from "@/helpers/response_handler";
import { HttpStatusCode } from "@/enums";
import { requireAdminSession } from "@/lib/auth/requireAdmin";
import {
    ensureCalendarConnections,
    serializeConnectionsForAdmin,
    updateCalendarConnection,
} from "@/lib/calendar/calendarConnections";
import { CalendarPlatform } from "@/types/calendar.types";

const responseHandler = new ResponseHandler();

export async function GET(req: Request) {
    const auth = await requireAdminSession();
    if (!auth.ok) return auth.response;

    const propertyId = Number(new URL(req.url).searchParams.get("propertyId"));
    if (!propertyId) {
        return responseHandler.respond({
            error: true,
            errorDetails: "Missing propertyId",
            message: "propertyId is required",
            status: HttpStatusCode.BAD_REQUEST,
        });
    }

    await connection();
    const connections = await ensureCalendarConnections(propertyId);

    return responseHandler.respond({
        error: false,
        errorDetails: "n/a",
        message: serializeConnectionsForAdmin(connections),
        status: HttpStatusCode.OK,
    });
}

export async function PUT(req: Request) {
    const auth = await requireAdminSession();
    if (!auth.ok) return auth.response;

    await connection();

    const body = (await req.json()) as {
        propertyId?: number;
        platform?: CalendarPlatform;
        importUrl?: string;
        enabled?: boolean;
    };

    if (!body.propertyId || !body.platform) {
        return responseHandler.respond({
            error: true,
            errorDetails: "Missing propertyId or platform",
            message: "Invalid request",
            status: HttpStatusCode.BAD_REQUEST,
        });
    }

    const connectionRecord = await updateCalendarConnection(body.propertyId, body.platform, {
        importUrl: body.importUrl ?? "",
        enabled: body.enabled ?? true,
    });

    return responseHandler.respond({
        error: false,
        errorDetails: "n/a",
        message: serializeConnectionsForAdmin([connectionRecord])[0],
        status: HttpStatusCode.OK,
    });
}
