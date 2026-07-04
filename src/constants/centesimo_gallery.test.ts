import { describe, it, expect } from "vitest";
import { orderCentesimoGalleryImages } from "@/constants/centesimo_gallery";

describe("orderCentesimoGalleryImages", () => {
    it("puts main first and curated mosaic previews next", () => {
        const images = [
            "/assets/100esimo/bagno2.png",
            "/assets/100esimo/cucina.jpg",
            "/assets/100esimo/main.jpeg",
            "/assets/100esimo/fuori2.jpeg",
            "/assets/100esimo/100esimo.jpeg",
            "/assets/100esimo/bagno1.jpeg",
        ];

        expect(orderCentesimoGalleryImages(images)).toEqual([
            "/assets/100esimo/main.jpeg",
            "/assets/100esimo/fuori2.jpeg",
            "/assets/100esimo/100esimo.jpeg",
            "/assets/100esimo/cucina.jpg",
            "/assets/100esimo/bagno1.jpeg",
            "/assets/100esimo/bagno2.png",
        ]);
    });
});
