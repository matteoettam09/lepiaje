import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function ExperiencesPage() {
    const t = await getTranslations("experiences_page");

    const sections = [
        { title: t("farm_tours_title"), text: t("farm_tours_text") },
        { title: t("pilgrim_title"), text: t("pilgrim_text") },
        { title: t("tasting_title"), text: t("tasting_text") },
        { title: t("tourism_title"), text: t("tourism_text") },
    ];

    return (
        <div className="min-h-screen bg-brand-linen text-brand-ink pt-28 pb-16 px-4">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-brand-ink mb-4">
                        {t("hero_title")}
                    </h1>
                    <p className="text-xl text-brand-muted">{t("hero_subtitle")}</p>
                </header>

                <div className="space-y-12">
                    {sections.map((section) => (
                        <section
                            key={section.title}
                            className="border border-brand-sand p-8 bg-brand-stone shadow-soft"
                        >
                            <h2 className="text-2xl font-semibold text-brand-terracotta mb-4">
                                {section.title}
                            </h2>
                            <p className="text-brand-muted leading-relaxed">{section.text}</p>
                        </section>
                    ))}
                </div>

                <div className="mt-16 text-center flex flex-wrap gap-4 justify-center">
                    <Link
                        href="/property/villa-perlata"
                        className="px-6 py-3 bg-brand-terracotta text-brand-linen hover:bg-brand-terracotta-dark transition-colors font-medium"
                    >
                        La Villa Perlata
                    </Link>
                    <Link
                        href="/shop"
                        className="px-6 py-3 border border-brand-sand text-brand-ink hover:bg-brand-stone transition-colors font-medium"
                    >
                        Farm Shop
                    </Link>
                </div>
            </div>
        </div>
    );
}
