import Link from "next/link";
import { FaWaze } from "react-icons/fa6";
import { SiGooglemaps } from "react-icons/si";
import { PropertyHeader } from "@/components/property/property_header";
import { PropertyBooking } from "@/components/property/property_booking";
import { open_directions_on_waze } from "@/utils/open_directions_on_waze";
import { PropertyGallery } from "@/components/property/property_gallery";
import { PropertyFeatures } from "@/components/property/property_features";
import { PropertyRooms } from "@/components/property/property_rooms";
import { open_directions_on_google_maps } from "@/utils/open_directions_on_google_maps";
import ReusableMap from "@/components/map/map";
import { fetch_property } from "@/services/fetch_property";
import { Property as PropertyEnum } from "@/enums";

export default async function PropertyPage({
  isLaVillaPerlata,
  images,
  propertyId = 1,
}: {
  isLaVillaPerlata: boolean;
  images: string[];
  propertyId?: number;
}) {
  const property = await fetch_property(
    propertyId === PropertyEnum.LA_VILLA_PERLATA
      ? PropertyEnum.LA_VILLA_PERLATA
      : PropertyEnum.AL_CENTESIMO_CHILOMETRO
  );

  if (!property) {
    return (
      <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center px-4 pt-28 pb-16">
        <div className="max-w-lg text-center">
          <p className="text-2xl font-bold text-red-500">No property found</p>
          <p className="mt-3 text-sm text-brand-muted">
            Check that MongoDB is running and{" "}
            <code className="text-brand-terracotta">DB_CONNECTION_STRING</code> is set,
            then run <code className="text-brand-terracotta">pnpm run seed</code>.
          </p>
        </div>
      </div>
    );
  }
  const waze = open_directions_on_waze(property.location);
  const google = open_directions_on_google_maps(property.location);

  return (
    <div className="container mx-auto px-4 pt-28 pb-16">
      <PropertyHeader
        name={property.name}
        location_name={property.location_name}
      />
      <div className="mt-6">
        <PropertyGallery images={images} />
      </div>
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 md:max-2xl:order-1 order-2">
          <PropertyRooms
            title="Property Rooms"
            features={property?.room_features}
          />
          <PropertyFeatures
            title="Property Features"
            features={property.features}
          />

          <div className="mt-8">
            <h2 className="text-2xl text-brand-ink font-bold mb-4">
              Description
            </h2>
            <p className="text-brand-muted">{property.description}</p>
          </div>
          {/* TODO<> add reviews here</> */}
        </div>

        <div className="md:max-2xl:order-2 order-1">
          <PropertyBooking
            price={property.price_per_night}
            airbnb={property.airbnb_url_address}
            booking={property.booking_dot_com_url_address}
            propertyId={property.id}
            propertyName={property.name}
            isLaVillaPerlata={isLaVillaPerlata}
            pricePerAdditionalGuest={property.price_per_additional_guest}
          />
        </div>
      </div>
      <div className="mt-12">
        <p className="font-bold mb-4 text-2xl text-brand-ink">Get Directions</p>
        <div>
          <div>
            <div className="inline-block">
              <Link
                className="flex items-center justify-start gap-x-2"
                href={google}
                target="_blank"
              >
                <SiGooglemaps
                  color="	#bbdaa4"
                  className="hover:scale-105 transition-all ease-linear"
                  size={25}
                />
                <p className="hover:cursor-pointer text-lg hover:text-brand-terracotta transition-colors text-brand-ink">
                  On Google Maps
                </p>
              </Link>
            </div>
          </div>
          <div className="inline-block">
            <Link
              className="flex items-center justify-start gap-x-2"
              href={waze}
              target="_blank"
            >
              <FaWaze
                color="#05c8f7"
                className="hover:scale-105 transition-all ease-linear"
                size={25}
              />
              <p className="hover:cursor-pointer text-lg hover:text-[#05c8f7] transition-colors text-brand-ink">
                On Waze
              </p>
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <Link
          className="flex items-center justify-center"
          href={property.google_maps_url_address}
          target={"_blank"}
        >
          <div className="inline-block">
            <div className="py-8">
              <p className="hover:text-brand-terracotta text-lg text-center text-brand-ink font-semibold transition-colors">
                See on Google Maps
              </p>
            </div>
          </div>
        </Link>
        <ReusableMap
          latitude={property.location.latitude}
          longitude={property.location.longitude}
        />
      </div>
    </div>
  );
}
