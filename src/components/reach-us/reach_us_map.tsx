"use client";

import { useState, useRef } from "react";
import Map, { MapRef } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import CustomMarker from "./_marker";
import PlaceInfo from "./_place_info";
import { la_villa_perlata_location } from "@/constants/la_villa_perlata_location";
import { al_centesimo_chilometro_location } from "@/constants/centesimo_chilometro_location";
import PlaceInfoSkeleton from "./_skeleton";
import { getMapboxAccessToken } from "@/lib/integrations/mapbox";

interface Place {
  id: number;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  isProminent?: boolean;
  phone?: string;
  email?: string;
  website?: string;
}

const places: Place[] = [
  {
    id: 1,
    name: "La Villa Perlata",
    description: `The accommodation is located 2km from the shores of Lake Bolsena and close to many country trails. You will love it for its views, vast outdoor spaces, atmosphere and privacy. It is suitable for couples and families (with children). The space Located in the so-called "Pearl Valley", you will have the opportunity to immerse yourself in nature, crossing numerous paths and reach the lake on foot without being disturbed by the noise of traffic.`,
    address: "Via del Lago, 65, 01027 Montefiascone VT, Italy",
    latitude: la_villa_perlata_location.latitude,
    longitude: la_villa_perlata_location.longitude,
    isProminent: true,
    phone: "+3 933 8123 4567",
    email: "lepiaje@gmail.com",
    website: "https://www.lepiaje.com",
  },
  {
    id: 2,
    name: "Al Centesimo Chilometro",
    description: "Our secondary location",
    address: `Located in Montefiascone, 18 miles from Duomo Orvieto, Al Centesimo Chilometro - Ristoro del Pellegrino has accommodations with a garden, free private parking and a shared lounge. The property is around 12 miles from Cività di Bagnoregio, 12 miles from Villa Lante and 20 miles from Bomarzo - The Monster Park.`,
    latitude: al_centesimo_chilometro_location.latitude,
    longitude: al_centesimo_chilometro_location.longitude,
    isProminent: true,
    phone: "+3 933 8123 4567",
    email: "lepiaje@gmail.com",
    website: "https://www.lepiaje.com",
  },

  {
    id: 3,
    name: "Rocca dei Papi",
    description: `La Rocca dei Papi, the ancient fortress built by Innocent III at the end of the twelfth century, stands 633 meters above sea level in defense of the village of Montefiscone. It is located on the top of the hill, in a position that has always been considered strategic for the possibility of dominating a large surrounding area.`,
    address: "Piazza Urbano V, 01027 Montefiascone VT, Italy",
    latitude: 42.53706895299506,
    longitude: 12.02825188089799,
  },
];

export default function ReachUsMap() {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // Ref for the Map component
  const mapRef = useRef<MapRef | null>(null);

  const mapboxToken = getMapboxAccessToken() ?? "";

  const handleMarkerClick = (place: Place) => {
    setSelectedPlace(place);

    // Trigger flyTo animation
    mapRef.current?.flyTo({
      center: [place.longitude, place.latitude],
      zoom: 15,
      duration: 2000,
      essential: true,
    });
  };

  return (
    <div className="mt-6">
      <div className="w-full h-[calc(100vh-4rem)] flex flex-col lg:flex-row">
        <div className="w-full lg:w-2/3 h-1/2 lg:h-full">
          <Map
            ref={mapRef}
            mapboxAccessToken={mapboxToken}
            mapStyle="mapbox://styles/jdaniel96/cm0zjgcjt00g301nq6bxx1ffk"
            initialViewState={{
              latitude: 42.54536257675014,
              longitude: 12.020030529169912,
              zoom: 13,
            }}
            pitch={70}
            style={{ borderRadius: "8px" }}
            maxZoom={20}
            minZoom={3}
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
        <div className="w-full lg:w-1/3 h-1/2 lg:h-full p-4">
          {selectedPlace ? (
            <PlaceInfo {...selectedPlace} />
          ) : (
            <PlaceInfoSkeleton />
          )}
        </div>
      </div>
    </div>
  );
}
