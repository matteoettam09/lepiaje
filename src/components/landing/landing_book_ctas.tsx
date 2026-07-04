"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export function LandingBookCTAs() {
    const t = useTranslations("landing_page.hero");
    const tBook = useTranslations("landing_page.book_ctas");

    return (
        <section className="bg-brand-linen py-8">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6">
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link
                        href="/property/villa-perlata"
                        className="rounded-md bg-brand-terracotta px-6 py-3 text-sm font-semibold text-brand-linen transition hover:bg-brand-terracotta-dark"
                    >
                        {t("cta_villa")}
                    </Link>
                    <Link
                        href="/property/centesimo-chilometro"
                        className="rounded-md bg-brand-terracotta px-6 py-3 text-sm font-semibold text-brand-linen transition hover:bg-brand-terracotta-dark"
                    >
                        {t("cta_hostel")}
                    </Link>
                </div>
                <Link
                    href="/about"
                    className="text-sm font-medium text-brand-muted transition hover:text-brand-terracotta"
                >
                    {tBook("learn_more")} →
                </Link>
            </div>
        </section>
    );
}
