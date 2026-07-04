"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export function AboutBookCTAs() {
    const t = useTranslations("about_us_page.book_ctas");

    return (
        <section className="bg-brand-linen py-12">
            <div className="container mx-auto flex flex-wrap items-center justify-center gap-4 px-4">
                <Link
                    href="/property/villa-perlata"
                    className="rounded-md bg-brand-terracotta px-6 py-3 text-sm font-semibold text-brand-linen transition hover:bg-brand-terracotta-dark"
                >
                    {t("villa")}
                </Link>
                <Link
                    href="/property/centesimo-chilometro"
                    className="rounded-md border border-brand-sand px-6 py-3 text-sm font-semibold text-brand-ink transition hover:bg-brand-stone"
                >
                    {t("hostel")}
                </Link>
            </div>
        </section>
    );
}
