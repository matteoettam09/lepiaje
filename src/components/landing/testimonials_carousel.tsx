"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface Review {
    name: string;
    country: string;
    headline: string;
    quote: string;
}

export function TestimonialsCarousel() {
    const t = useTranslations("landing_page.testimonials");
    const reviews = t.raw("reviews") as Review[];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const nextSlide = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrentIndex(
            (prev) => (prev - 1 + reviews.length) % reviews.length
        );
    };

    const goToSlide = (index: number) => {
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
    };

    const variants = {
        enter: (slideDirection: number) => ({
            x: slideDirection > 0 ? 400 : -400,
            opacity: 0,
        }),
        center: { x: 0, opacity: 1 },
        exit: (slideDirection: number) => ({
            x: slideDirection < 0 ? 400 : -400,
            opacity: 0,
        }),
    };

    const review = reviews[currentIndex];

    return (
        <div className="pb-8 pt-8 md:pb-10 md:pt-10">
            <div className="mx-auto max-w-5xl px-6 md:max-w-6xl">
                <h2 className="mb-5 text-center font-display text-3xl text-brand-ink md:mb-6 md:text-4xl">
                    {t("title")}
                </h2>

                <div className="flex items-center gap-2 md:gap-4">
                    <button
                        type="button"
                        onClick={prevSlide}
                        aria-label="Previous review"
                        className="shrink-0 rounded-full border border-brand-sand bg-brand-linen p-2 text-brand-ink transition hover:bg-brand-stone"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <div className="min-h-0 min-w-0 flex-1 overflow-hidden rounded-md border border-brand-sand bg-brand-linen px-6 py-4 shadow-soft md:px-10 md:py-5">
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                key={currentIndex}
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
                                className="flex flex-col gap-3 md:flex-row md:items-center md:gap-8"
                            >
                                <p className="font-display text-lg text-brand-terracotta md:w-1/3 md:shrink-0 md:text-xl">
                                    {review.headline}
                                </p>
                                <div className="md:w-2/3">
                                    <p className="font-sans text-sm leading-snug text-brand-ink md:text-base">
                                        &ldquo;{review.quote}&rdquo;
                                    </p>
                                    <p className="mt-1 font-sans text-sm text-brand-muted">
                                        — {review.name}, {review.country}
                                    </p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <button
                        type="button"
                        onClick={nextSlide}
                        aria-label="Next review"
                        className="shrink-0 rounded-full border border-brand-sand bg-brand-linen p-2 text-brand-ink transition hover:bg-brand-stone"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                <div className="mt-4 flex justify-center gap-2">
                    {reviews.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            aria-label={`Go to review ${index + 1}`}
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
        </div>
    );
}
