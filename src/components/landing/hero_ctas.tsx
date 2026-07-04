"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

export function HeroCTAs() {
    const t = useTranslations("landing_page.hero");

    const scrollToDiscover = () => {
        const section = document.getElementById("discover");
        section?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <button
            type="button"
            onClick={scrollToDiscover}
            className="group flex flex-col items-center gap-1 text-brand-linen/75 transition-colors hover:text-brand-linen focus:outline-none focus-visible:text-brand-linen"
            aria-label={t("cta_discover")}
        >
            <span className="text-xs font-medium uppercase tracking-[0.2em]">
                {t("cta_discover")}
            </span>
            <ChevronDown
                strokeWidth={1.5}
                className="h-6 w-6 opacity-70 transition-transform duration-300 group-hover:translate-y-0.5 group-hover:opacity-100 discover-hint"
            />
        </button>
    );
}
