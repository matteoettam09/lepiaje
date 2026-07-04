import { Directions } from "@/types";

export function open_location_on_google_maps(to: Directions): string {
  return `https://www.google.com/maps/search/?api=1&query=${to.latitude},${to.longitude}`;
}
