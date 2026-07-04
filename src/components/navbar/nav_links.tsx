"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

const contactButtonClassName =
  "inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-md bg-brand-terracotta px-5 text-sm font-semibold text-brand-linen transition hover:bg-brand-terracotta-dark";

export function NavLinks({
  className,
  contactClassName = contactButtonClassName,
}: {
  className?: string;
  contactClassName?: string;
}) {
    const t = useTranslations("nav");

    const links = [
        { href: "/property/villa-perlata", label: t("villa_perlata") },
        { href: "/property/centesimo-chilometro", label: t("centesimo") },
        { href: "/experiences", label: t("experiences") },
        { href: "/shop", label: t("shop") },
        { href: "/about", label: t("about") },
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
            <Link
                href="/#contact"
                className={contactClassName}
                prefetch={false}
            >
                {t("contact")}
            </Link>
        </>
    );
}
