import TusciaMap from "@/components/tuscia/tuscia_map";
import { getImages } from "@/utils/get_images_on_folder";
import { isola_bisentina_image_url } from "@/constants/isola_bisentina_location";
import { civita_di_bagnoregio_image_url } from "@/constants/civita_di_bagnoregio_location";
import { villa_lante_image_url } from "@/constants/villa_lante_location";
import { sacro_bosco_image_url } from "@/constants/sacro_bosco_location";
import { rocca_monaldeschi_image_url } from "@/constants/rocca_monaldeschi_location";
import { duomo_orvieto_image_url } from "@/constants/duomo_orvieto_location";

const ROCCA_PAPI_IMAGE =
  "https://www.archeoares.it/wp-content/uploads/2018/02/Rocca_dei_Papi-scaled.jpg";

export default async function TusciaPage() {
  const [villaImages, centesimoImages] = await Promise.all([
    getImages("villa_perlata"),
    getImages("100esimo"),
  ]);

  const placeImages = {
    villa_perlata: villaImages[0] ?? "",
    centesimo: centesimoImages[0] ?? "",
    rocca_papi: ROCCA_PAPI_IMAGE,
    isola_bisentina: isola_bisentina_image_url,
    civita_di_bagnoregio: civita_di_bagnoregio_image_url,
    villa_lante: villa_lante_image_url,
    sacro_bosco: sacro_bosco_image_url,
    rocca_monaldeschi: rocca_monaldeschi_image_url,
    duomo_orvieto: duomo_orvieto_image_url,
  };

  return (
    <div className="container mx-auto flex h-[calc(100dvh-6rem)] flex-col px-4 pb-4 pt-28">
      <TusciaMap placeImages={placeImages} />
    </div>
  );
}
