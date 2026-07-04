import { la_villa_perlata_location } from "@/constants/la_villa_perlata_location";
import { al_centesimo_chilometro_location } from "@/constants/centesimo_chilometro_location";
import { isola_bisentina_location } from "@/constants/isola_bisentina_location";
import { civita_di_bagnoregio_location } from "@/constants/civita_di_bagnoregio_location";
import { villa_lante_location } from "@/constants/villa_lante_location";
import { sacro_bosco_location } from "@/constants/sacro_bosco_location";
import { rocca_monaldeschi_location } from "@/constants/rocca_monaldeschi_location";
import { duomo_orvieto_location } from "@/constants/duomo_orvieto_location";
import { Directions } from "@/types/directions.types";

const rocca_papi_location: Directions = {
  latitude: 42.53706895299506,
  longitude: 12.02825188089799,
};

export const TUSCIA_MAP_POINTS: Directions[] = [
  la_villa_perlata_location,
  al_centesimo_chilometro_location,
  rocca_papi_location,
  isola_bisentina_location,
  civita_di_bagnoregio_location,
  villa_lante_location,
  sacro_bosco_location,
  rocca_monaldeschi_location,
  duomo_orvieto_location,
];

export function getTusciaMapBounds(points: Directions[] = TUSCIA_MAP_POINTS) {
  const latitudes = points.map((point) => point.latitude);
  const longitudes = points.map((point) => point.longitude);

  return {
    minLatitude: Math.min(...latitudes),
    maxLatitude: Math.max(...latitudes),
    minLongitude: Math.min(...longitudes),
    maxLongitude: Math.max(...longitudes),
  };
}
