import fs from "fs";
import path from "path";

export async function getImages(folderName: string) {
    const imageDirectory = path.join(process.cwd(), 'public', `assets/${folderName}`);
    try {
        const imageFilenames = await fs.promises.readdir(imageDirectory);
        return imageFilenames.map(filename => `/assets/${folderName}/${filename}`)

    } catch (err) {
        //TODO perhaps add a logger
        console.log("error in getImages server action", JSON.stringify(err));
        return []
    }

}