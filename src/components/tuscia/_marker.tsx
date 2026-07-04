import { Marker } from "react-map-gl/maplibre";
import { FaLocationDot } from "react-icons/fa6";

const MARKER_COLORS = {
  property: "sienna",
  place: "#c39c41",
} as const;

interface CustomMarkerProps {
  longitude: number;
  latitude: number;
  onClick: () => void;
  isProminent?: boolean;
}

export default function CustomMarker({
  longitude,
  latitude,
  onClick,
  isProminent = false,
}: CustomMarkerProps) {
  return (
    <Marker
      longitude={longitude}
      latitude={latitude}
      anchor="bottom"
      onClick={onClick}
    >
      <FaLocationDot
        color={isProminent ? MARKER_COLORS.property : MARKER_COLORS.place}
        className="h-8 w-8 cursor-pointer transition-all duration-300 ease-in-out hover:scale-110"
      />
    </Marker>
  );
}
