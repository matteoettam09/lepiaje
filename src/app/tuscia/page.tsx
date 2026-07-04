import TusciaMap from "@/components/tuscia/tuscia_map";
import { TUSCIA_ATTRACTION_IMAGES } from "@/constants/tuscia_place_images";
import { getImages } from "@/utils/get_images_on_folder";

export default async function TusciaPage() {
  const [villaImages, centesimoImages] = await Promise.all([
    getImages("villa_perlata"),
    getImages("100esimo"),
  ]);

  const placeImages = {
    villa_perlata: villaImages[0] ?? "",
    centesimo: centesimoImages[0] ?? "",
    ...TUSCIA_ATTRACTION_IMAGES,
  };

  return (
    <div className="container mx-auto min-h-[calc(100dvh-6rem)] overflow-y-auto px-4 pb-8 pt-28 lg:flex lg:h-[calc(100dvh-6rem)] lg:flex-col lg:overflow-hidden lg:pb-4">
      <TusciaMap placeImages={placeImages} />
    </div>
  );
}
