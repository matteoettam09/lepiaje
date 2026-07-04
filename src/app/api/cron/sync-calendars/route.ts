import { connection } from "@/config/db";
import { syncExternalCalendars } from "@/lib/calendar/syncExternalCalendars";

export async function GET(req: Request) {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return new Response("Unauthorized", { status: 401 });
    }

    await connection();
    const results = await syncExternalCalendars();

    return Response.json({
        synced: results.length,
        results,
    });
}
