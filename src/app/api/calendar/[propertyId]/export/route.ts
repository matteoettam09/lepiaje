import { connection } from "@/config/db";
import { buildPropertyIcs } from "@/lib/calendar/exportIcs";
import { verifyExportToken } from "@/lib/calendar/calendarConnections";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ propertyId: string }> }
) {
    const { propertyId: propertyIdParam } = await params;
    const propertyId = Number(propertyIdParam);
    const token = new URL(req.url).searchParams.get("token");

    if (!propertyId || !token) {
        return new Response("Missing propertyId or token", { status: 400 });
    }

    await connection();

    const valid = await verifyExportToken(propertyId, token);
    if (!valid) {
        return new Response("Unauthorized", { status: 401 });
    }

    const ics = await buildPropertyIcs(propertyId);

    return new Response(ics, {
        status: 200,
        headers: {
            "Content-Type": "text/calendar; charset=utf-8",
            "Cache-Control": "no-store",
        },
    });
}
