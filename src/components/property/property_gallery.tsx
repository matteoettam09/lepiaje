"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const MOSAIC_SLOTS = [
  { index: 0, className: "col-span-2 row-span-2" },
  { index: 1, className: "col-start-3 row-start-1" },
  { index: 2, className: "col-start-4 row-start-1" },
  { index: 3, className: "col-start-3 row-start-2" },
  { index: 4, className: "col-start-4 row-start-2" },
] as const;

function GalleryTile({
  src,
  alt,
  sizes,
  onClick,
  className,
  overlay,
}: {
  src: string;
  alt: string;
  sizes: string;
  onClick: () => void;
  className?: string;
  overlay?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative h-full w-full overflow-hidden bg-brand-stone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta focus-visible:ring-offset-2",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover transition duration-200 group-hover:brightness-95"
      />
      {overlay}
    </button>
  );
}

export function PropertyGallery({ images }: { images: string[] | undefined }) {
  const t = useTranslations("property_page");
  const galleryImages = images?.filter(Boolean) ?? [];
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const goToPrevious = useCallback(() => {
    setLightboxIndex(
      (current) => (current - 1 + galleryImages.length) % galleryImages.length
    );
  }, [galleryImages.length]);

  const goToNext = useCallback(() => {
    setLightboxIndex((current) => (current + 1) % galleryImages.length);
  }, [galleryImages.length]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPrevious();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, goToPrevious, goToNext]);

  if (galleryImages.length === 0) {
    return (
      <div className="flex aspect-[4/3] max-h-[280px] items-center justify-center rounded-xl border border-dashed border-brand-sand bg-brand-stone text-brand-muted md:max-h-none md:h-[400px]">
        {t("no_photos")}
      </div>
    );
  }

  const visibleSlots = MOSAIC_SLOTS.filter(
    (slot) => slot.index < galleryImages.length
  );
  const remainingPhotos = Math.max(0, galleryImages.length - 5);
  const activeLightboxIndex = Math.min(
    lightboxIndex,
    galleryImages.length - 1
  );

  return (
    <>
      <div className="md:hidden">
        <div className="relative aspect-[4/3] max-h-[280px] overflow-hidden rounded-xl">
          <GalleryTile
            src={galleryImages[0]}
            alt={`Property image 1`}
            sizes="100vw"
            onClick={() => openLightbox(0)}
          />
          {galleryImages.length > 1 && (
            <button
              type="button"
              onClick={() => openLightbox(0)}
              className="absolute bottom-3 right-3 rounded-lg border border-brand-sand bg-brand-linen/95 px-3 py-1.5 text-sm font-semibold text-brand-ink shadow-soft transition hover:bg-brand-linen"
            >
              {t("show_all_photos")}
            </button>
          )}
        </div>
      </div>

      {galleryImages.length === 1 ? (
        <div className="hidden md:block md:h-[400px] md:overflow-hidden md:rounded-xl">
          <GalleryTile
            src={galleryImages[0]}
            alt="Property image 1"
            sizes="100vw"
            onClick={() => openLightbox(0)}
          />
        </div>
      ) : (
        <div className="hidden md:grid md:h-[400px] md:grid-cols-4 md:grid-rows-2 md:gap-2 md:overflow-hidden md:rounded-xl">
          {visibleSlots.map((slot) => {
            const isMorePhotosTile = slot.index === 4 && remainingPhotos > 0;

            return (
              <GalleryTile
                key={galleryImages[slot.index]}
                src={galleryImages[slot.index]}
                alt={`Property image ${slot.index + 1}`}
                sizes={slot.index === 0 ? "50vw" : "25vw"}
                className={slot.className}
                onClick={() => openLightbox(slot.index)}
                overlay={
                  isMorePhotosTile ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-brand-ink/50 text-lg font-semibold text-brand-linen">
                      {t("more_photos", { count: remainingPhotos })}
                    </div>
                  ) : undefined
                }
              />
            );
          })}
        </div>
      )}

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          className="fixed inset-0 left-0 top-0 z-50 flex h-screen w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 bg-brand-ink/95 p-0 shadow-none data-[state=open]:zoom-in-100 data-[state=closed]:zoom-out-100 [&>button]:text-brand-linen [&>button]:hover:text-brand-linen"
          aria-describedby={undefined}
        >
          <DialogTitle className="sr-only">{t("show_all_photos")}</DialogTitle>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 py-16 md:px-16">
            <Image
              src={galleryImages[activeLightboxIndex]}
              alt={`Property image ${activeLightboxIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />

            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goToPrevious}
                  className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-brand-linen/90 text-brand-ink shadow-soft transition hover:bg-brand-linen md:left-6"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-brand-linen/90 text-brand-ink shadow-soft transition hover:bg-brand-linen md:right-6"
                  aria-label="Next photo"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-brand-ink/70 px-4 py-1.5 text-sm font-medium text-brand-linen">
            {t("photo_count", {
              current: activeLightboxIndex + 1,
              total: galleryImages.length,
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
