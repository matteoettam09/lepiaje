import { AdminBlockDates } from "@/components/property/admin_block_dates";
import { fetch_property } from "@/services/fetch_property";
import { Property as PropertyEnum } from "@/enums";

export default async function PropertyPage({
  propertyId = 1,
}: {
  isLaVillaPerlata: boolean;
  propertyId?: number;
}) {
  const property = await fetch_property(
    propertyId === PropertyEnum.LA_VILLA_PERLATA
      ? PropertyEnum.LA_VILLA_PERLATA
      : PropertyEnum.AL_CENTESIMO_CHILOMETRO
  );

  if (!property) {
    return (
      <div className="w-full h-full bg-brand-charcoal flex items-center justify-center">
        <div className="text-2xl text-red-500 font-bold">No property found</div>
        );
      </div>
    );
  }

  return (
    <div className="mt-32 w-screen flex items-center justify-center bg-slate-950">
      <AdminBlockDates propertyId={property.id} />
    </div>
  );
}
