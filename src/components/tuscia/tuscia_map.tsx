"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Map, { MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTranslations } from "next-intl";
import CustomMarker from "./_marker";
import PlaceInfo from "./_place_info";
import { la_villa_perlata_location } from "@/constants/la_villa_perlata_location";
import { al_centesimo_chilometro_location } from "@/constants/centesimo_chilometro_location";
import { isola_bisentina_location } from "@/constants/isola_bisentina_location";
import { civita_di_bagnoregio_location } from "@/constants/civita_di_bagnoregio_location";
import { villa_lante_location } from "@/constants/villa_lante_location";
import { sacro_bosco_location } from "@/constants/sacro_bosco_location";
import { rocca_monaldeschi_location } from "@/constants/rocca_monaldeschi_location";
import { duomo_orvieto_location } from "@/constants/duomo_orvieto_location";
import { getTusciaMapBounds } from "@/constants/tuscia_map_points";
import { DEFAULT_MAP_VIEW, MAP_STYLE_URL } from "@/lib/integrations/maps";

type PlaceKey =
  | "villa_perlata"
  | "centesimo"
  | "rocca_papi"
  | "isola_bisentina"
  | "civita_di_bagnoregio"
  | "villa_lante"
  | "sacro_bosco"
  | "rocca_monaldeschi"
  | "duomo_orvieto";

export type PlaceImages = Record<PlaceKey, string>;

interface Place {
  id: number;
  key: PlaceKey;
  name: string;
  about: string;
  image: string;
  link: string;
  latitude: number;
  longitude: number;
  isProminent?: boolean;
}

const PLACE_DEFS: Omit<Place, "name" | "about" | "image">[] = [
  {
    id: 1,
    key: "villa_perlata",
    link: "/property/villa-perlata",
    latitude: la_villa_perlata_location.latitude,
    longitude: la_villa_perlata_location.longitude,
    isProminent: true,
  },
  {
    id: 2,
    key: "centesimo",
    link: "/property/centesimo-chilometro",
    latitude: al_centesimo_chilometro_location.latitude,
    longitude: al_centesimo_chilometro_location.longitude,
    isProminent: true,
  },
  {
    id: 3,
    key: "rocca_papi",
    link: "https://www.archeoares.it/musei/montefiascone/rocca-dei-papi/",
    latitude: 42.53706895299506,
    longitude: 12.02825188089799,
  },
  {
    id: 4,
    key: "isola_bisentina",
    link: "https://www.isolabisentina.org/",
    latitude: isola_bisentina_location.latitude,
    longitude: isola_bisentina_location.longitude,
  },
  {
    id: 5,
    key: "civita_di_bagnoregio",
    link: "https://civitadibagnoregio.cloud/",
    latitude: civita_di_bagnoregio_location.latitude,
    longitude: civita_di_bagnoregio_location.longitude,
  },
  {
    id: 6,
    key: "villa_lante",
    link: "https://cultura.gov.it/luogo/villa-lante",
    latitude: villa_lante_location.latitude,
    longitude: villa_lante_location.longitude,
  },
  {
    id: 7,
    key: "sacro_bosco",
    link: "https://www.sacrobosco.eu/",
    latitude: sacro_bosco_location.latitude,
    longitude: sacro_bosco_location.longitude,
  },
  {
    id: 8,
    key: "rocca_monaldeschi",
    link: "https://visitbolsena.it/cosa-fare/castello-e-rocca-monaldeschi-della-cervara/",
    latitude: rocca_monaldeschi_location.latitude,
    longitude: rocca_monaldeschi_location.longitude,
  },
  {
    id: 9,
    key: "duomo_orvieto",
    link: "https://www.duomodiorvieto.it/",
    latitude: duomo_orvieto_location.latitude,
    longitude: duomo_orvieto_location.longitude,
  },
];

const DEFAULT_PLACE_ID = 1;
const MAP_PADDING = {
  top: 48,
  bottom: 40,
  left: 40,
  right: 40,
};

export default function TusciaMap({
  placeImages,
}: {
  placeImages: PlaceImages;
}) {
  const t = useTranslations("tuscia_page");
  const [selectedId, setSelectedId] = useState(DEFAULT_PLACE_ID);
  const [lockedZoom, setLockedZoom] = useState<number | null>(null);
  const mapRef = useRef<MapRef | null>(null);

  const fitMapToPlaces = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const bounds = getTusciaMapBounds();

    map.fitBounds(
      [
        [bounds.minLongitude, bounds.minLatitude],
        [bounds.maxLongitude, bounds.maxLatitude],
      ],
      {
        padding: MAP_PADDING,
        duration: 0,
        maxZoom: 12,
        pitch: 0,
        bearing: 0,
      }
    );

    setLockedZoom(map.getZoom());
  }, []);

  const places = useMemo<Place[]>(
    () =>
      PLACE_DEFS.map((def) => ({
        ...def,
        name: t(`places.${def.key}.name`),
        about: t(`places.${def.key}.about`),
        image: placeImages[def.key],
      })),
    [t, placeImages]
  );

  const selectedPlace =
    places.find((place) => place.id === selectedId) ?? places[0];

  const handleMarkerClick = (place: Place) => {
    setSelectedId(place.id);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
      <div className="h-[38vh] min-h-[240px] w-full shrink-0 lg:h-auto lg:min-h-0 lg:w-[55%]">
        <Map
          ref={mapRef}
          mapStyle={MAP_STYLE_URL}
          initialViewState={DEFAULT_MAP_VIEW}
          onLoad={fitMapToPlaces}
          onResize={fitMapToPlaces}
          style={{ width: "100%", height: "100%", borderRadius: "8px" }}
          minZoom={lockedZoom ?? 0}
          maxZoom={lockedZoom ?? 22}
          minPitch={0}
          maxPitch={0}
          dragPan={false}
          dragRotate={false}
          touchPitch={false}
          scrollZoom={false}
          boxZoom={false}
          doubleClickZoom={false}
          touchZoomRotate={false}
          keyboard={false}
        >
          {places.map((place) => (
            <CustomMarker
              key={place.id}
              longitude={place.longitude}
              latitude={place.latitude}
              isProminent={place.isProminent}
              onClick={() => handleMarkerClick(place)}
            />
          ))}
        </Map>
      </div>
      <div className="min-h-0 flex-1 w-full lg:w-[45%]">
        {selectedPlace && (
          <PlaceInfo
            name={selectedPlace.name}
            about={selectedPlace.about}
            image={selectedPlace.image}
            link={selectedPlace.link}
            linkLabel={t("link")}
          />
        )}
      </div>
    </div>
  );
}
