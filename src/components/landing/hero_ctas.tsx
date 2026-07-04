"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export function HeroCTAs() {
    const t = useTranslations("landing_page.hero");

    return (
        <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
            <Link
                href="/property/villa-perlata"
                className="rounded-md bg-brand-terracotta px-6 py-3 text-sm font-semibold text-brand-linen transition hover:bg-brand-terracotta-dark"
            >
                {t("cta_villa")}
            </Link>
            <Link
                href="/property/centesimo-chilometro"
                className="rounded-md border border-brand-linen/60 px-6 py-3 text-sm font-semibold text-brand-linen transition hover:border-brand-linen hover:bg-brand-linen/10"
            >
                {t("cta_hostel")}
            </Link>
            <Link
                href="#contact"
                className="text-sm font-medium text-brand-linen/80 underline-offset-4 hover:text-brand-linen hover:underline"
            >
                {t("cta_contact")}
            </Link>
        </div>
    );
}
