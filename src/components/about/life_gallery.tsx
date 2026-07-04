"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import {
    galleryImages,
    type GalleryTab,
} from "../../../public/assets/gallery";
import { AnimateOnScroll } from "../animate_view_on_scroll/animate_view_on_scroll";

const tabs: GalleryTab[] = ["meet_us", "farm", "guests_events"];

export function LifeGallery() {
    const t = useTranslations("about_us_page.life_gallery");
    const [activeTab, setActiveTab] = useState<GalleryTab>("meet_us");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const images = galleryImages[activeTab];

    const switchTab = (tab: GalleryTab) => {
        setActiveTab(tab);
        setCurrentIndex(0);
        setDirection(0);
    };

    const goToSlide = (index: number) => {
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
    };

    const nextSlide = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const variants = {
        enter: (slideDirection: number) => ({
            x: slideDirection > 0 ? 600 : -600,
            opacity: 0,
        }),
        center: { zIndex: 1, x: 0, opacity: 1 },
        exit: (slideDirection: number) => ({
            zIndex: 0,
            x: slideDirection < 0 ? 600 : -600,
            opacity: 0,
        }),
    };

    return (
        <AnimateOnScroll index={1.5} className="bg-brand-linen py-12 md:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="mb-6 text-center font-display text-3xl text-brand-ink md:text-4xl">
                    {t("title")}
                </h2>

                <div className="mb-6 flex flex-wrap justify-center gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => switchTab(tab)}
                            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                                activeTab === tab
                                    ? "bg-brand-ink text-brand-linen"
                                    : "border border-brand-sand text-brand-muted hover:text-brand-ink"
                            }`}
                        >
                            {t(`tabs.${tab}`)}
                        </button>
                    ))}
                </div>

                <p className="mb-4 text-center font-sans text-sm text-brand-muted md:text-base">
                    {t(`captions.${activeTab}`)}
                </p>

                <div className="mx-auto flex max-w-4xl items-center gap-2 md:gap-3">
                    <button
                        type="button"
                        onClick={prevSlide}
                        aria-label="Previous image"
                        className="shrink-0 rounded-full border border-brand-sand bg-brand-linen p-2 text-brand-ink transition hover:bg-brand-stone"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <div className="relative h-[14em] min-w-0 flex-1 overflow-hidden rounded-lg border border-brand-sand md:h-[16em]">
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.div
                                key={`${activeTab}-${currentIndex}`}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: {
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                    },
                                    opacity: { duration: 0.2 },
                                }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={images[currentIndex]}
                                    alt={`${t(`tabs.${activeTab}`)} ${currentIndex + 1}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 896px"
                                    className="object-cover"
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <button
                        type="button"
                        onClick={nextSlide}
                        aria-label="Next image"
                        className="shrink-0 rounded-full border border-brand-sand bg-brand-linen p-2 text-brand-ink transition hover:bg-brand-stone"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                <div className="mx-auto mt-4 flex max-w-4xl justify-center gap-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            aria-label={`Go to image ${index + 1}`}
                            onClick={() => goToSlide(index)}
                            className={`h-2 rounded-full transition-all ${
                                index === currentIndex
                                    ? "w-8 bg-brand-terracotta"
                                    : "w-2 bg-brand-sand hover:bg-brand-muted"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </AnimateOnScroll>
    );
}
