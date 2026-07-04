"use client";

import { useState, useEffect, useCallback } from "react";
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

    const nextSlide = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, [reviews.length]);

    const prevSlide = useCallback(() => {
        setDirection(-1);
        setCurrentIndex(
            (prev) => (prev - 1 + reviews.length) % reviews.length
        );
    }, [reviews.length]);

    const goToSlide = (index: number) => {
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
    };

    useEffect(() => {
        const interval = setInterval(nextSlide, 6000);
        return () => clearInterval(interval);
    }, [nextSlide]);

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
        <section className="bg-brand-stone py-16 md:py-20">
            <div className="mx-auto max-w-4xl px-6">
                <h2 className="mb-10 text-center font-display text-3xl text-brand-ink md:text-4xl">
                    {t("title")}
                </h2>

                <div className="relative min-h-[280px] overflow-hidden rounded-md border border-brand-sand bg-brand-linen p-8 shadow-soft md:p-10">
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
                            className="flex flex-col gap-4"
                        >
                            <p className="font-display text-xl text-brand-terracotta md:text-2xl">
                                {review.headline}
                            </p>
                            <p className="font-sans text-base leading-relaxed text-brand-ink md:text-lg">
                                &ldquo;{review.quote}&rdquo;
                            </p>
                            <p className="mt-2 font-sans text-sm text-brand-muted">
                                — {review.name}, {review.country}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    <button
                        type="button"
                        onClick={prevSlide}
                        aria-label="Previous review"
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-brand-sand bg-brand-linen p-2 text-brand-ink transition hover:bg-brand-stone md:left-4"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        type="button"
                        onClick={nextSlide}
                        aria-label="Next review"
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-brand-sand bg-brand-linen p-2 text-brand-ink transition hover:bg-brand-stone md:right-4"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                <div className="mt-6 flex justify-center gap-2">
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
        </section>
    );
}
