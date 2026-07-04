import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import golfHero from "../../../public/assets/golf1.jpeg";
import legna from "../../../public/assets/farm/legna.jpeg";
import boat from "../../../public/assets/who_we_are/boat.png";

export default async function ExperiencesPage() {
    const t = await getTranslations("experiences_page");

    const sections = [
        {
            title: t("farm_tours_title"),
            text: t("farm_tours_text"),
            image: legna,
            imageAlt: t("farm_tours_image_alt"),
        },
        {
            title: t("boat_trips_title"),
            text: t("boat_trips_text"),
            image: boat,
            imageAlt: t("boat_trips_image_alt"),
        },
        { title: t("tourism_title"), text: t("tourism_text"), ctaHref: "/tuscia", ctaLabel: t("tourism_cta") },
    ];

    return (
        <div className="min-h-screen bg-brand-linen text-brand-ink pt-28 pb-16 px-4">
            <div className="max-w-4xl mx-auto">
                <header className="relative mb-16 h-[280px] overflow-hidden rounded-xl md:h-[360px]">
                    <Image
                        src={golfHero}
                        alt=""
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 896px"
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-brand-ink/45" />
                    <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-brand-linen mb-4">
                            {t("hero_title")}
                        </h1>
                        <p className="text-xl text-brand-linen/90">{t("hero_subtitle")}</p>
                    </div>
                </header>

                <div className="space-y-12">
                    {sections.map((section) => (
                        <section
                            key={section.title}
                            className="border border-brand-sand p-8 bg-brand-stone shadow-soft"
                        >
                            {"image" in section && section.image ? (
                                <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-md">
                                    <Image
                                        src={section.image}
                                        alt={section.imageAlt ?? ""}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 896px"
                                        className="object-cover"
                                    />
                                </div>
                            ) : null}
                            <h2 className="text-2xl font-semibold text-brand-terracotta mb-4">
                                {section.title}
                            </h2>
                            <p className="text-brand-muted leading-relaxed">{section.text}</p>
                            {"ctaHref" in section && section.ctaHref ? (
                                <Link
                                    href={section.ctaHref}
                                    prefetch={false}
                                    className="mt-6 inline-flex px-6 py-3 bg-brand-terracotta text-brand-linen hover:bg-brand-terracotta-dark transition-colors font-medium"
                                >
                                    {section.ctaLabel}
                                </Link>
                            ) : null}
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}
