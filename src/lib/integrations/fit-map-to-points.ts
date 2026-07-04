import { Directions } from "@/types/directions.types";
import { getTusciaMapBounds } from "@/constants/tuscia_map_points";

const WORLD_TILE_SIZE = 256;
const MAX_ZOOM = 22;

function latitudeToRadians(latitude: number) {
  const sin = Math.sin((latitude * Math.PI) / 180);
  const radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
  return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
}

function zoomForAxis(mapPixels: number, worldPixels: number, fraction: number) {
  return Math.log(mapPixels / worldPixels / fraction) / Math.LN2;
}

export function computeMapViewForPoints(
  points: Directions[],
  {
    width,
    height,
    padding = 56,
  }: {
    width: number;
    height: number;
    padding?: number;
  }
) {
  const bounds = getTusciaMapBounds(points);
  const usableWidth = Math.max(width - padding * 2, 1);
  const usableHeight = Math.max(height - padding * 2, 1);

  const latFraction =
    (latitudeToRadians(bounds.maxLatitude) -
      latitudeToRadians(bounds.minLatitude)) /
    Math.PI;
  const lngFraction =
    (bounds.maxLongitude - bounds.minLongitude) / 360;

  const zoom = Math.min(
    zoomForAxis(usableHeight, WORLD_TILE_SIZE, latFraction),
    zoomForAxis(usableWidth, WORLD_TILE_SIZE, lngFraction),
    MAX_ZOOM
  );

  return {
    latitude: (bounds.minLatitude + bounds.maxLatitude) / 2,
    longitude: (bounds.minLongitude + bounds.maxLongitude) / 2,
    zoom,
    pitch: 0,
    bearing: 0,
  };
}
