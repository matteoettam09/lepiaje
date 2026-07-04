"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import friends from "../../../public/assets/friends.png";
import ristoro from "../../../public/assets/ristoro.jpeg";
import boat from "../../../public/assets/boat.png";
import orto2 from "../../../public/assets/farm/orto2.jpeg";

type CaptionKey = "friends" | "ristoro" | "boat" | "farm";
type NavKey = "villa_perlata" | "centesimo" | "experiences" | "shop";

const highlights: {
    href: string;
    image: typeof friends;
    captionKey: CaptionKey;
    navKey: NavKey;
}[] = [
    {
        href: "/property/villa-perlata",
        image: friends,
        captionKey: "friends",
        navKey: "villa_perlata",
    },
    {
        href: "/property/centesimo-chilometro",
        image: ristoro,
        captionKey: "ristoro",
        navKey: "centesimo",
    },
    {
        href: "/experiences",
        image: boat,
        captionKey: "boat",
        navKey: "experiences",
    },
    {
        href: "/shop",
        image: orto2,
        captionKey: "farm",
        navKey: "shop",
    },
];

export function LandingHighlights() {
    const t = useTranslations("landing_page.highlights");
    const tNav = useTranslations("nav");

    return (
        <div className="mx-auto max-w-5xl border-b border-brand-sand px-6 pb-10 pt-8 md:max-w-6xl md:pb-12">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6 lg:items-start">
                {highlights.map(({ href, image, captionKey, navKey }) => (
                    <Link
                        key={href}
                        href={href}
                        prefetch={false}
                        className="group grid grid-rows-[3.25rem_3rem_auto] gap-y-2 overflow-hidden rounded-md border border-brand-sand bg-brand-linen transition hover:border-brand-terracotta hover:shadow-soft lg:grid-rows-[3.5rem_3rem_auto]"
                    >
                        <p className="flex items-start justify-center self-stretch px-3 pt-3 text-center font-sans text-sm leading-snug text-brand-muted line-clamp-3">
                            {t(captionKey)}
                        </p>
                        <p className="flex items-start justify-center self-stretch px-3 text-center text-xs font-semibold uppercase leading-snug tracking-wide text-brand-terracotta line-clamp-2">
                            {tNav(navKey)}
                        </p>
                        <div className="relative aspect-[4/3] overflow-hidden">
                            <Image
                                src={image}
                                alt={t(captionKey)}
                                fill
                                sizes="(max-width: 640px) 100vw, 25vw"
                                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
