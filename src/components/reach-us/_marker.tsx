import { Marker } from "react-map-gl/maplibre";
import Logo from "../logo/logo";
import { FaLocationDot } from "react-icons/fa6";
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
      {isProminent ? (
        <Logo width="w-[5em]" height="h-[5em]" blur="blur-sm" />
      ) : (
        <FaLocationDot
          color="#c39c41"
          className={`cursor-pointer transition-all duration-300 ease-in-out ${
            isProminent ? "text-primary w-8 h-8" : "text-secondary w-8 h-8"
          } hover:text-primary hover:scale-110`}
        />
      )}
    </Marker>
  );
}
