import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/cron/sync-calendars/route";

vi.mock("@/config/db", () => ({
    connection: vi.fn().mockResolvedValue(true),
}));

vi.mock("@/lib/calendar/syncExternalCalendars", () => ({
    syncExternalCalendars: vi.fn().mockResolvedValue([]),
}));

describe("GET /api/cron/sync-calendars", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.CRON_SECRET = "test-cron-secret";
    });

    it("rejects requests without cron secret", async () => {
        const response = await GET(
            new Request("http://localhost/api/cron/sync-calendars")
        );
        expect(response.status).toBe(401);
    });

    it("runs sync when cron secret matches", async () => {
        const response = await GET(
            new Request("http://localhost/api/cron/sync-calendars", {
                headers: {
                    Authorization: "Bearer test-cron-secret",
                },
            })
        );

        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body.synced).toBe(0);
    });
});
