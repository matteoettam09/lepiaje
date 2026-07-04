"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export function HeroCTAs() {
    const t = useTranslations("landing_page.hero");

    return (
        <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
            <Link
                href="/property/villa-perlata"
                className="rounded-md bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-charcoal transition hover:bg-brand-gold-dark hover:text-brand-cream"
            >
                {t("cta_villa")}
            </Link>
            <Link
                href="/property/centesimo-chilometro"
                className="rounded-md border border-brand-cream/40 px-6 py-3 text-sm font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold"
            >
                {t("cta_hostel")}
            </Link>
            <Link
                href="#contact"
                className="text-sm font-medium text-brand-cream/80 underline-offset-4 hover:text-brand-gold hover:underline"
            >
                {t("cta_contact")}
            </Link>
        </div>
    );
}
