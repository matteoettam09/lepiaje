import { describe, it, expect } from "vitest";
import { DEFAULT_MAP_VIEW, MAP_STYLE_URL } from "@/lib/integrations/maps";

describe("maps integration", () => {
    it("exports OpenFreeMap style URL", () => {
        expect(MAP_STYLE_URL).toBe(
            "https://tiles.openfreemap.org/styles/liberty"
        );
    });

    it("exports default map view for Tuscia region", () => {
        expect(DEFAULT_MAP_VIEW.latitude).toBeGreaterThan(42);
        expect(DEFAULT_MAP_VIEW.longitude).toBeGreaterThan(12);
        expect(DEFAULT_MAP_VIEW.zoom).toBe(13);
    });
});
