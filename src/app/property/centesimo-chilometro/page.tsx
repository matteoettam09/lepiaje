import { getImages } from "@/utils/get_images_on_folder";
import PropertyPage from "@/components/layout/rental/rental";
import { Property as PropertyEnum } from "@/enums";

export const dynamic = "force-dynamic";

export default async function CentesimoChilometro() {
  const folderName: string = "100esimo";
  const images = await getImages(folderName);

  return (
    <PropertyPage
      images={images}
      isLaVillaPerlata={false}
      propertyId={PropertyEnum.AL_CENTESIMO_CHILOMETRO}
    />
  );
}
