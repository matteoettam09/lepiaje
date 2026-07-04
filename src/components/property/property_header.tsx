import Link from "next/link";
import { FaWaze } from "react-icons/fa6";
import { SiGooglemaps } from "react-icons/si";

export function PropertyHeader({
  name,
  googleDirectionsUrl,
  wazeDirectionsUrl,
}: {
  name: string;
  googleDirectionsUrl: string;
  wazeDirectionsUrl: string;
}) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-ink">{name}</h1>
      <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2">
        <Link
          className="inline-flex items-center gap-x-2"
          href={googleDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiGooglemaps
            color="#bbdaa4"
            className="transition-all ease-linear hover:scale-105"
            size={22}
          />
          <span className="text-base text-brand-ink transition-colors hover:text-brand-terracotta">
            Google Maps
          </span>
        </Link>
        <Link
          className="inline-flex items-center gap-x-2"
          href={wazeDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWaze
            color="#05c8f7"
            className="transition-all ease-linear hover:scale-105"
            size={22}
          />
          <span className="text-base text-brand-ink transition-colors hover:text-[#05c8f7]">
            Waze
          </span>
        </Link>
      </div>
    </div>
  );
}
