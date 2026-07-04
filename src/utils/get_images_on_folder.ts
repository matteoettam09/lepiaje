import fs from "fs";
import path from "path";
import { orderCentesimoGalleryImages } from "@/constants/centesimo_gallery";
import { orderVillaGalleryImages } from "@/constants/villa_gallery";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

const VILLA_GALLERY_EXCLUDED = new Set([
  "barbecue.jpg",
  "friends.png",
  "golf1.jpeg",
  "fuoco.jpeg",
  "ingresso.png",
  "ristoro.jpeg",
]);

async function collectImages(
  directory: string,
  assetPath: string,
  excludedBasenames: Set<string> = new Set()
): Promise<string[]> {
  const entries = await fs.promises.readdir(directory, { withFileTypes: true });
  const images: string[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;

    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      images.push(
        ...(await collectImages(
          fullPath,
          `${assetPath}/${entry.name}`,
          excludedBasenames
        ))
      );
      continue;
    }

    if (
      IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()) &&
      !excludedBasenames.has(entry.name.toLowerCase())
    ) {
      images.push(`/assets/${assetPath}/${entry.name}`);
    }
  }

  return images;
}

function prioritizeMainImage(images: string[]): string[] {
  const mainIndex = images.findIndex((image) => {
    const base = path.basename(image, path.extname(image));
    return base.toLowerCase() === "main";
  });

  if (mainIndex <= 0) return images;

  return [
    images[mainIndex],
    ...images.slice(0, mainIndex),
    ...images.slice(mainIndex + 1),
  ];
}

export async function getImages(folderName: string) {
  const imageDirectory = path.join(
    process.cwd(),
    "public",
    "assets",
    folderName
  );
  try {
    const excludedBasenames =
      folderName === "villa_perlata"
        ? new Set(
            [...VILLA_GALLERY_EXCLUDED].map((name) => name.toLowerCase())
          )
        : new Set<string>();
    const images = await collectImages(
      imageDirectory,
      folderName,
      excludedBasenames
    );
    const prioritized = prioritizeMainImage(images);
    if (folderName === "villa_perlata") {
      return orderVillaGalleryImages(prioritized);
    }
    if (folderName === "100esimo") {
      return orderCentesimoGalleryImages(prioritized);
    }
    return prioritized;
  } catch (err) {
    console.log("error in getImages server action", JSON.stringify(err));
    return [];
  }
}
