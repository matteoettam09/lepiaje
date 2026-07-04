"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export function NavLinks({ className }: { className?: string }) {
    const t = useTranslations("nav");

    const links = [
        { href: "/property/villa-perlata", label: t("villa_perlata") },
        { href: "/property/centesimo-chilometro", label: t("centesimo") },
        { href: "/about", label: t("about") },
        { href: "/experiences", label: t("experiences") },
        { href: "/shop", label: t("shop") },
        { href: "/reach-us", label: t("reach_us") },
    ];

    return (
        <>
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={className}
                    prefetch={false}
                >
                    {link.label}
                </Link>
            ))}
        </>
    );
}
