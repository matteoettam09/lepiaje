import { randomUUID } from "crypto";
import CalendarConnection from "@/models/CalendarConnection";
import { CalendarConnectionType, CalendarPlatform } from "@/types/calendar.types";
import { fetchAndParseIcs } from "@/lib/calendar/parseIcs";
import { applyExternalBlocks } from "@/lib/calendar/applyExternalBlocks";

const PLATFORMS: CalendarPlatform[] = ["airbnb", "booking"];

function getBaseUrl(): string {
    return (
        process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ||
        "http://localhost:3000"
    );
}

export function buildExportUrl(propertyId: number, exportToken: string): string {
    return `${getBaseUrl()}/api/calendar/${propertyId}/export?token=${exportToken}`;
}

async function getOrCreateExportToken(propertyId: number): Promise<string> {
    const existing = await CalendarConnection.findOne({ propertyId });
    if (existing?.exportToken) {
        return existing.exportToken;
    }
    return randomUUID().replace(/-/g, "");
}

export async function ensureCalendarConnections(
    propertyId: number
): Promise<CalendarConnectionType[]> {
    const exportToken = await getOrCreateExportToken(propertyId);
    const connections: CalendarConnectionType[] = [];

    for (const platform of PLATFORMS) {
        const connection = await CalendarConnection.findOneAndUpdate(
            { propertyId, platform },
            {
                $setOnInsert: {
                    propertyId,
                    platform,
                    exportToken,
                    enabled: true,
                    importUrl: "",
                    lastImportStatus: "skipped",
                },
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        if (connection.exportToken !== exportToken) {
            connection.exportToken = exportToken;
            await connection.save();
        }

        connections.push(connection.toObject() as CalendarConnectionType);
    }

    return connections;
}

export async function updateCalendarConnection(
    propertyId: number,
    platform: CalendarPlatform,
    updates: Pick<CalendarConnectionType, "importUrl" | "enabled">
): Promise<CalendarConnectionType> {
    await ensureCalendarConnections(propertyId);

    const connection = await CalendarConnection.findOneAndUpdate(
        { propertyId, platform },
        {
            $set: {
                importUrl: updates.importUrl?.trim() ?? "",
                enabled: updates.enabled,
            },
        },
        { new: true }
    );

    if (!connection) {
        throw new Error("Calendar connection not found");
    }

    return connection.toObject() as CalendarConnectionType;
}

export async function verifyExportToken(
    propertyId: number,
    token: string
): Promise<boolean> {
    const connection = await CalendarConnection.findOne({ propertyId, exportToken: token });
    return Boolean(connection);
}

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

    const connections = await CalendarConnection.find(query).lean();
    const results = [];

    for (const connection of connections) {
        const result = await syncCalendarConnection(
            connection as CalendarConnectionType
        );
        results.push({
            propertyId: connection.propertyId,
            platform: connection.platform as CalendarPlatform,
            status: result.status,
            error: result.error,
        });
    }

    return results;
}

export function serializeConnectionsForAdmin(
    connections: CalendarConnectionType[]
) {
    return connections.map((connection) => ({
        ...connection,
        exportUrl: buildExportUrl(connection.propertyId, connection.exportToken),
    }));
}
