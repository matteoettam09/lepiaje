"use client";

import { useState } from "react";
import Image from "next/image";

export function PropertyGallery({ images }: { images: string[] | undefined }) {
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div>
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
        <Image
          src={images ? images[currentImage] : ""}
          alt={`Property image ${currentImage + 1}`}
          fill
          sizes="100%"
          style={{ objectFit: "cover" }}
          className="rounded-lg"
        />
      </div>
      <div className="mt-4 flex space-x-4 scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-brand-terracotta overflow-x-auto pb-2">
        {images?.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`flex-shrink-0 ${
              index === currentImage ? "ring-2 ring-blue-500" : ""
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
