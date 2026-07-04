import fs from "fs";
import path from "path";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

async function collectImages(
  directory: string,
  assetPath: string
): Promise<string[]> {
  const entries = await fs.promises.readdir(directory, { withFileTypes: true });
  const images: string[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;

    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      images.push(
        ...(await collectImages(fullPath, `${assetPath}/${entry.name}`))
      );
      continue;
    }

    if (IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
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
    const images = await collectImages(imageDirectory, folderName);
    return prioritizeMainImage(images);
  } catch (err) {
    console.log("error in getImages server action", JSON.stringify(err));
    return [];
  }
}
