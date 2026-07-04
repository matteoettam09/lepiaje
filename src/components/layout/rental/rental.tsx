import { PropertyHeader } from "@/components/property/property_header";
import { PropertyBooking } from "@/components/property/property_booking";
import { open_location_on_waze } from "@/utils/open_directions_on_waze";
import { PropertyGallery } from "@/components/property/property_gallery";
import { fetch_property } from "@/services/fetch_property";
import { Property as PropertyEnum } from "@/enums";
import { getTranslations } from "next-intl/server";

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
  const waze = open_location_on_waze(property.location);
  const propertyPlaces = await getTranslations("property_page.places");
  const isCentesimo = property.id === PropertyEnum.AL_CENTESIMO_CHILOMETRO;
  const villaDescription =
    property.id === PropertyEnum.LA_VILLA_PERLATA
      ? propertyPlaces("villa_perlata.description")
      : property.description;

  return (
    <div className="container mx-auto px-4 pt-28 pb-16">
      <PropertyHeader
        name={property.name}
        googleDirectionsUrl={property.google_maps_url_address}
        wazeDirectionsUrl={waze}
      />
      <div className="mt-6">
        <PropertyGallery images={images} />
      </div>
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 md:max-2xl:order-1 order-2">
          <div>
            <h2 className="text-2xl text-brand-ink font-bold mb-4">
              Description
            </h2>
            {isCentesimo ? (
              <>
                <p className="whitespace-pre-line text-brand-muted">
                  {propertyPlaces("centesimo.description")}
                </p>
                <a
                  href={propertyPlaces("centesimo.francigena_url")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm font-semibold text-brand-terracotta transition-colors hover:text-brand-terracotta-dark hover:underline"
                >
                  {propertyPlaces("centesimo.francigena_link_label")}
                </a>
              </>
            ) : (
              <p className="whitespace-pre-line text-brand-muted">
                {villaDescription}
              </p>
            )}
          </div>
        </div>

        <div className="md:max-2xl:order-2 order-1">
          <PropertyBooking
            price={property.price_per_night}
            airbnb={property.airbnb_url_address}
            booking={property.booking_dot_com_url_address}
            propertyId={property.id}
            propertyName={property.name}
            isLaVillaPerlata={isLaVillaPerlata}
            {...(!isCentesimo && {
              pricePerAdditionalGuest: property.price_per_additional_guest,
            })}
          />
        </div>
      </div>
    </div>
  );
}
