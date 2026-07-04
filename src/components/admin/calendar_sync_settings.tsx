"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarPlatform } from "@/types/calendar.types";

type ConnectionRecord = {
    propertyId: number;
    platform: CalendarPlatform;
    importUrl: string;
    exportToken: string;
    exportUrl: string;
    enabled: boolean;
    lastImportAt?: string;
    lastImportStatus?: "ok" | "error" | "skipped";
    lastImportError?: string;
};

const PLATFORM_LABELS: Record<CalendarPlatform, string> = {
    airbnb: "Airbnb",
    booking: "Booking.com",
};

export function CalendarSyncSettings({ propertyId }: { propertyId: number }) {
    const [connections, setConnections] = useState<ConnectionRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingPlatform, setSavingPlatform] = useState<CalendarPlatform | null>(null);
    const [syncing, setSyncing] = useState(false);
    const [message, setMessage] = useState("");

    const loadConnections = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `/api/admin/calendar-connections?propertyId=${propertyId}`
            );
            const data = await response.json();
            if (data.error) throw new Error(data.message || "Failed to load calendar settings");
            setConnections(data.message || []);
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Failed to load settings");
        } finally {
            setLoading(false);
        }
    }, [propertyId]);

    useEffect(() => {
        loadConnections();
    }, [loadConnections]);

    const saveConnection = async (connection: ConnectionRecord) => {
        setSavingPlatform(connection.platform);
        setMessage("");
        try {
            const response = await fetch("/api/admin/calendar-connections", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    propertyId,
                    platform: connection.platform,
                    importUrl: connection.importUrl,
                    enabled: connection.enabled,
                }),
            });
            const data = await response.json();
            if (data.error) throw new Error(data.message || "Failed to save");
            await loadConnections();
            setMessage(`${PLATFORM_LABELS[connection.platform]} settings saved.`);
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Failed to save settings");
        } finally {
            setSavingPlatform(null);
        }
    };

    const syncNow = async () => {
        setSyncing(true);
        setMessage("");
        try {
            const response = await fetch("/api/admin/calendar-connections/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ propertyId }),
            });
            const data = await response.json();
            if (data.error) throw new Error(data.message || "Sync failed");
            await loadConnections();
            setMessage("Calendar sync completed.");
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Sync failed");
        } finally {
            setSyncing(false);
        }
    };

    const updateConnection = (
        platform: CalendarPlatform,
        updates: Partial<ConnectionRecord>
    ) => {
        setConnections((prev) =>
            prev.map((connection) =>
                connection.platform === platform
                    ? { ...connection, ...updates }
                    : connection
            )
        );
    };

    if (loading) {
        return (
            <div className="mt-8 w-full max-w-3xl rounded-xl border border-brand-sand bg-brand-stone p-6 text-brand-muted">
                Loading calendar sync settings...
            </div>
        );
    }

    return (
        <div className="mt-8 w-full max-w-3xl rounded-xl border border-brand-sand bg-brand-stone p-6 shadow-soft">
            <h2 className="text-2xl font-semibold text-brand-ink mb-2">
                Calendar sync (Airbnb + Booking.com)
            </h2>
            <p className="text-sm text-brand-muted mb-6">
                Le Piaje polls OTA calendars once per day (Vercel cron). Use Sync now
                for an immediate pull. Airbnb and Booking.com refresh imported
                calendars on their own schedule (typically 2–4 hours). Pending webapp
                checkouts do not block OTAs until payment is confirmed.
            </p>

            <div className="space-y-6">
                {connections.map((connection) => (
                    <div
                        key={connection.platform}
                        className="rounded-lg border border-brand-sand bg-brand-linen p-4 space-y-4"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <h3 className="text-lg font-semibold text-brand-ink">
                                {PLATFORM_LABELS[connection.platform]}
                            </h3>
                            <label className="flex items-center gap-2 text-sm text-brand-muted">
                                <input
                                    type="checkbox"
                                    checked={connection.enabled}
                                    onChange={(event) =>
                                        updateConnection(connection.platform, {
                                            enabled: event.target.checked,
                                        })
                                    }
                                />
                                Enabled
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-brand-ink mb-1">
                                Import URL (.ics from {PLATFORM_LABELS[connection.platform]})
                            </label>
                            <input
                                type="url"
                                value={connection.importUrl}
                                onChange={(event) =>
                                    updateConnection(connection.platform, {
                                        importUrl: event.target.value,
                                    })
                                }
                                placeholder="https://..."
                                className="w-full rounded-md border border-brand-sand bg-white px-3 py-2 text-sm text-brand-ink"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-brand-ink mb-1">
                                Export URL (paste into {PLATFORM_LABELS[connection.platform]})
                            </label>
                            <div className="flex gap-2">
                                <input
                                    readOnly
                                    value={connection.exportUrl}
                                    className="w-full rounded-md border border-brand-sand bg-white px-3 py-2 text-sm text-brand-ink"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        navigator.clipboard.writeText(connection.exportUrl)
                                    }
                                >
                                    Copy
                                </Button>
                            </div>
                        </div>

                        <div className="text-xs text-brand-muted">
                            Last sync:{" "}
                            {connection.lastImportAt
                                ? new Date(connection.lastImportAt).toLocaleString()
                                : "Never"}{" "}
                            · Status: {connection.lastImportStatus || "skipped"}
                            {connection.lastImportError
                                ? ` · ${connection.lastImportError}`
                                : ""}
                        </div>

                        <Button
                            type="button"
                            disabled={savingPlatform === connection.platform}
                            onClick={() => saveConnection(connection)}
                        >
                            {savingPlatform === connection.platform
                                ? "Saving..."
                                : "Save settings"}
                        </Button>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
                <Button type="button" onClick={syncNow} disabled={syncing}>
                    {syncing ? "Syncing..." : "Sync now"}
                </Button>
                <Button type="button" variant="outline" asChild>
                    <a
                        href="https://www.airbnb.com/help/article/99"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Airbnb calendar help
                    </a>
                </Button>
                <Button type="button" variant="outline" asChild>
                    <a
                        href="https://partner.booking.com/en-gb/help/rates-availability/extranet-calendar/how-synchronise-your-calendars-across-channels"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Booking.com sync help
                    </a>
                </Button>
            </div>

            {message ? <p className="mt-4 text-sm text-brand-muted">{message}</p> : null}
        </div>
    );
}
