import React from "react";
import { getImages } from "@/utils/get_images_on_folder";
import PropertyPage from "@/components/layout/rental/rental";

export const dynamic = "force-dynamic";

export default async function VillaPerlata() {
  const folderName: string = "villa_perlata";
  const images = await getImages(folderName);

  return <PropertyPage isLaVillaPerlata={true} images={images} />;
}
