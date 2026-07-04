"use client";

import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";

export function GuestFavoriteBadge() {
    const t = useTranslations("landing_page.guest_favorite");

    return (
        <section className="border-y border-brand-sand bg-brand-linen py-8">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-6 text-center">
                <div className="flex items-center gap-2 border border-brand-sand bg-brand-stone px-4 py-2">
                    <Heart
                        className="h-5 w-5 fill-brand-terracotta text-brand-terracotta"
                        aria-hidden
                    />
                    <span className="font-sans text-sm font-semibold uppercase tracking-wider text-brand-terracotta">
                        {t("badge")}
                    </span>
                </div>
                <p className="font-sans text-base text-brand-muted">
                    {t("subtitle")}
                </p>
            </div>
        </section>
    );
}
