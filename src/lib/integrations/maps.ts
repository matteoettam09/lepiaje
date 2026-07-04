import { TUSCIA_MAP_POINTS } from "@/constants/tuscia_map_points";
import { computeMapViewForPoints } from "./fit-map-to-points";

export const MAP_STYLE_URL =
  "https://tiles.openfreemap.org/styles/liberty";

// Approximate Tuscia map panel size on desktop (55% of a ~1280px layout).
export const DEFAULT_MAP_VIEW = computeMapViewForPoints(TUSCIA_MAP_POINTS, {
  width: 720,
  height: 480,
  padding: 40,
});
