import { describe, it, expect, afterEach } from "vitest";
import {
    getMapboxAccessToken,
    requireMapboxAccessToken,
} from "@/lib/integrations/mapbox";

describe("mapbox integration", () => {
    const originalToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    afterEach(() => {
        if (originalToken === undefined) {
            delete process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
        } else {
            process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN = originalToken;
        }
    });

    it("returns null when token is missing", () => {
        delete process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
        expect(getMapboxAccessToken()).toBeNull();
    });

    it("returns trimmed token from env", () => {
        process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN = " pk.test.token ";
        expect(getMapboxAccessToken()).toBe("pk.test.token");
    });

    it("throws when token is required but missing", () => {
        delete process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
        expect(() => requireMapboxAccessToken()).toThrow(
            "NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is not configured"
        );
    });

    it("returns token when configured", () => {
        process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN = "pk.test.token";
        expect(requireMapboxAccessToken()).toBe("pk.test.token");
    });
});
