"use client";
import Map, { Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAP_STYLE_URL } from "@/lib/integrations/maps";

interface MapProps {
  latitude: number;
  longitude: number;
}

export default function ReusableMap({ latitude, longitude }: MapProps) {
  return (
    <div className="h-[30em] w-full">
      <Map
        mapStyle={MAP_STYLE_URL}
        initialViewState={{
          latitude,
          longitude,
          zoom: 8,
        }}
        style={{ width: "100%", height: "100%", borderRadius: "8px" }}
        maxZoom={20}
        minZoom={3}
      >
        <Marker longitude={longitude} latitude={latitude} />
      </Map>
    </div>
  );
}
