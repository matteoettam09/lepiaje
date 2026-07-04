import { describe, it, expect } from "vitest";
import { TUSCIA_MAP_POINTS } from "@/constants/tuscia_map_points";
import { computeMapViewForPoints } from "./fit-map-to-points";
import { DEFAULT_MAP_VIEW, MAP_STYLE_URL } from "@/lib/integrations/maps";

describe("maps integration", () => {
    it("exports OpenFreeMap style URL", () => {
        expect(MAP_STYLE_URL).toBe(
            "https://tiles.openfreemap.org/styles/liberty"
        );
    });

    it("exports default map view fitted to all Tuscia places", () => {
        expect(DEFAULT_MAP_VIEW).toEqual(
            computeMapViewForPoints(TUSCIA_MAP_POINTS, {
                width: 720,
                height: 480,
                padding: 40,
            })
        );
        expect(DEFAULT_MAP_VIEW.latitude).toBeGreaterThan(42);
        expect(DEFAULT_MAP_VIEW.longitude).toBeGreaterThan(11);
        expect(DEFAULT_MAP_VIEW.zoom).toBeGreaterThan(8);
        expect(DEFAULT_MAP_VIEW.zoom).toBeLessThan(12);
        expect(DEFAULT_MAP_VIEW.pitch).toBe(0);
        expect(DEFAULT_MAP_VIEW.bearing).toBe(0);
    });
});
