"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReviewFlag } from "./review_flag";

interface Review {
    name: string;
    country: string;
    countryCode: string;
    headline: string;
    quote: string;
}

export function TestimonialsCarousel() {
    const t = useTranslations("landing_page.testimonials");
    const reviews = t.raw("reviews") as Review[];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFading, setIsFading] = useState(false);

    const goToSlide = (index: number) => {
        if (index === currentIndex) return;

        setIsFading(true);
        window.setTimeout(() => {
            setCurrentIndex(index);
            setIsFading(false);
        }, 150);
    };

    const nextSlide = () => {
        goToSlide((currentIndex + 1) % reviews.length);
    };

    const prevSlide = () => {
        goToSlide((currentIndex - 1 + reviews.length) % reviews.length);
    };

    const review = reviews[currentIndex];

    return (
        <div className="pb-8 pt-8 md:pb-10 md:pt-10">
            <div className="mx-auto max-w-[96rem] px-6">
                <h2 className="mb-5 text-center font-display text-3xl text-brand-ink md:mb-6 md:text-4xl">
                    {t("title")}
                </h2>

                <div className="flex items-center gap-2 md:gap-3">
                    <button
                        type="button"
                        onClick={prevSlide}
                        aria-label="Previous review"
                        className="shrink-0 rounded-full border border-brand-sand bg-brand-linen p-2 text-brand-ink transition hover:bg-brand-stone"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <div className="relative h-[21rem] min-w-0 flex-1 overflow-hidden rounded-md border border-brand-sand bg-brand-linen px-6 py-4 shadow-soft sm:h-[17rem] md:h-[13rem] md:px-8 md:py-5 lg:h-[12rem]">
                        <div
                            className={`flex h-full flex-col gap-2 pb-10 transition-opacity duration-200 md:pb-11 ${
                                isFading ? "opacity-0" : "opacity-100"
                            }`}
                        >
                            <p className="line-clamp-2 font-display text-lg leading-tight text-brand-terracotta md:line-clamp-1 md:text-xl">
                                {review.headline}
                            </p>
                            <p className="min-h-0 flex-1 font-sans text-xs leading-snug text-brand-ink sm:text-sm md:text-[0.9rem] md:leading-snug lg:text-[0.95rem]">
                                &ldquo;{review.quote}&rdquo;
                            </p>
                        </div>
                        <p
                            className={`absolute bottom-2 right-6 flex items-center gap-2 font-sans text-sm text-brand-muted transition-opacity duration-200 md:bottom-3 md:right-10 ${
                                isFading ? "opacity-0" : "opacity-100"
                            }`}
                        >
                            <span>
                                — {review.name}, {review.country}
                            </span>
                            <ReviewFlag code={review.countryCode} />
                        </p>
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
