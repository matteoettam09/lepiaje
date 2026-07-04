const VILLA_MOSAIC_PREVIEW_FILENAMES = [
    "notte.jpeg",
    "melograni.jpeg",
    "salotto2.jpeg",
    "letto2.jpeg",
    "camera.jpeg",
] as const;

function basename(imagePath: string): string {
    return imagePath.split("/").pop()?.toLowerCase() ?? "";
}

export function orderVillaGalleryImages(images: string[]): string[] {
    if (images.length === 0) return images;

    const byBasename = new Map<string, string>();
    for (const image of images) {
        byBasename.set(basename(image), image);
    }

    const hero =
        byBasename.get("main.jpeg") ??
        byBasename.get("main.jpg") ??
        images[0];

    const previewImages = VILLA_MOSAIC_PREVIEW_FILENAMES.map((filename) =>
        byBasename.get(filename.toLowerCase())
    ).filter((image): image is string => Boolean(image));

    const prioritized = new Set<string>([hero, ...previewImages]);
    const rest = images.filter((image) => !prioritized.has(image));

    return [hero, ...previewImages.filter((image) => image !== hero), ...rest];
}
