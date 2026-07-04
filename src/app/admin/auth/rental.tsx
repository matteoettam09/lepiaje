import { AdminBlockDates } from "@/components/property/admin_block_dates";
import { CalendarSyncSettings } from "@/components/admin/calendar_sync_settings";
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
      <div className="w-full h-full bg-brand-stone flex items-center justify-center">
        <div className="text-2xl text-red-500 font-bold">No property found</div>
      </div>
    );
  }

  return (
    <div className="mt-32 w-screen flex flex-col items-center justify-center bg-brand-linen px-4 pb-16">
      <AdminBlockDates propertyId={property.id} />
      <CalendarSyncSettings propertyId={property.id} />
    </div>
  );
}
