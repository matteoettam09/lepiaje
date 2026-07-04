import PropertyPage from "../rental";
import { Property as PropertyEnum } from "@/enums";

export const dynamic = "force-dynamic";

export default async function CentesimoChilometro() {
  return (
    <PropertyPage
      isLaVillaPerlata={false}
      propertyId={PropertyEnum.AL_CENTESIMO_CHILOMETRO}
    />
  );
}
