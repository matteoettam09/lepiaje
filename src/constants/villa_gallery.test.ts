import { describe, it, expect } from "vitest";
import { orderVillaGalleryImages } from "@/constants/villa_gallery";

describe("orderVillaGalleryImages", () => {
    it("puts main first and curated mosaic previews next", () => {
        const images = [
            "/assets/villa_perlata/esterni/1.jpg",
            "/assets/villa_perlata/cielo/camera.jpeg",
            "/assets/villa_perlata/esterni/main.jpeg",
            "/assets/villa_perlata/portico/notte.jpeg",
            "/assets/villa_perlata/esterni/melograni.jpeg",
            "/assets/villa_perlata/terra/salotto2.jpeg",
            "/assets/villa_perlata/cielo/letto2.jpeg",
            "/assets/villa_perlata/esterni/9.jpg",
        ];

        const ordered = orderVillaGalleryImages(images);

        expect(ordered.slice(0, 6)).toEqual([
            "/assets/villa_perlata/esterni/main.jpeg",
            "/assets/villa_perlata/portico/notte.jpeg",
            "/assets/villa_perlata/esterni/melograni.jpeg",
            "/assets/villa_perlata/terra/salotto2.jpeg",
            "/assets/villa_perlata/cielo/letto2.jpeg",
            "/assets/villa_perlata/cielo/camera.jpeg",
        ]);
        expect(ordered.slice(6)).toEqual([
            "/assets/villa_perlata/esterni/1.jpg",
            "/assets/villa_perlata/esterni/9.jpg",
        ]);
    });
});
