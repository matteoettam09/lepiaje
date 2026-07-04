"use client";

import { useState } from "react";
import Image from "next/image";

export function PropertyGallery({ images }: { images: string[] | undefined }) {
  const galleryImages = images?.filter(Boolean) ?? [];
  const [currentImage, setCurrentImage] = useState(0);

  if (galleryImages.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed border-gray-700 bg-slate-900 text-gray-400 md:h-[500px] lg:h-[600px]">
        No photos available
      </div>
    );
  }

  const activeIndex = Math.min(currentImage, galleryImages.length - 1);

  return (
    <div>
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
        <Image
          src={galleryImages[activeIndex]}
          alt={`Property image ${activeIndex + 1}`}
          fill
          sizes="100%"
          style={{ objectFit: "cover" }}
          className="rounded-lg"
        />
      </div>
      <div className="mt-4 flex space-x-4 scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-brand-gold overflow-x-auto pb-2">
        {galleryImages.map((image, index) => (
          <button
            key={image}
            onClick={() => setCurrentImage(index)}
            className={`flex-shrink-0 ${
              index === activeIndex ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <div className="relative h-[8em] w-[6em]">
              <Image
                src={image}
                alt={`Property thumbnail ${index + 1}`}
                fill
                sizes="100%"
                style={{ objectFit: "cover" }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
