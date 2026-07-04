import CalendarConnection from "@/models/CalendarConnection";
import { CalendarConnectionType, CalendarPlatform } from "@/types/calendar.types";
import { fetchAndParseIcs } from "@/lib/calendar/parseIcs";
import { applyExternalBlocks } from "@/lib/calendar/applyExternalBlocks";

export async function syncCalendarConnection(
    connection: CalendarConnectionType
): Promise<{ status: "ok" | "skipped" | "error"; error?: string }> {
    if (!connection.enabled) {
        await CalendarConnection.updateOne(
            { propertyId: connection.propertyId, platform: connection.platform },
            {
                $set: {
                    lastImportAt: new Date(),
                    lastImportStatus: "skipped",
                    lastImportError: undefined,
                },
            }
        );
        return { status: "skipped" };
    }

    if (!connection.importUrl) {
        await CalendarConnection.updateOne(
            { propertyId: connection.propertyId, platform: connection.platform },
            {
                $set: {
                    lastImportAt: new Date(),
                    lastImportStatus: "skipped",
                    lastImportError: "Import URL not configured",
                },
            }
        );
        return { status: "skipped", error: "Import URL not configured" };
    }

    try {
        const events = await fetchAndParseIcs(connection.importUrl);
        await applyExternalBlocks(
            connection.propertyId,
            connection.platform,
            events
        );

        await CalendarConnection.updateOne(
            { propertyId: connection.propertyId, platform: connection.platform },
            {
                $set: {
                    lastImportAt: new Date(),
                    lastImportStatus: "ok",
                    lastImportError: undefined,
                },
            }
        );

        return { status: "ok" };
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        await CalendarConnection.updateOne(
            { propertyId: connection.propertyId, platform: connection.platform },
            {
                $set: {
                    lastImportAt: new Date(),
                    lastImportStatus: "error",
                    lastImportError: message,
                },
            }
        );
        return { status: "error", error: message };
    }
}

export async function syncExternalCalendars(options?: {
    propertyId?: number;
}): Promise<
    Array<{
        propertyId: number;
        platform: CalendarPlatform;
        status: "ok" | "skipped" | "error";
        error?: string;
    }>
> {
    const query = options?.propertyId
        ? { propertyId: options.propertyId, enabled: true }
        : { enabled: true };

    const connections = (await CalendarConnection.find(query).lean()) as unknown as CalendarConnectionType[];
    const results = [];

    for (const connection of connections) {
        const result = await syncCalendarConnection(connection);
        results.push({
            propertyId: connection.propertyId,
            platform: connection.platform as CalendarPlatform,
            status: result.status,
            error: result.error,
        });
    }

    return results;
}
