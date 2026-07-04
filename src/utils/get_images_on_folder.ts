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

export async function getImages(folderName: string) {
  const imageDirectory = path.join(
    process.cwd(),
    "public",
    "assets",
    folderName
  );
  try {
    return await collectImages(imageDirectory, folderName);
  } catch (err) {
    console.log("error in getImages server action", JSON.stringify(err));
    return [];
  }
}
