import { waze_url } from "@/constants/waze_url";
import { Directions } from "@/types";

export function open_location_on_waze(to: Directions): string {
  const params = new URLSearchParams({
    ll: `${to.latitude},${to.longitude}`,
  });
  return `${waze_url}?${params.toString()}`;
}
