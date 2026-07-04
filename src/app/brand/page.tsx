import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/logo/logo";
import { ColorSwatch } from "@/components/brand/color_swatch";
import {
    brandColorEntries,
    brandColors,
    brandFonts,
    brandGradients,
} from "@/lib/brand/tokens";

export const metadata: Metadata = {
    title: "Brand Guidelines | Le Piaje",
    description: "Le Piaje brand colors, typography, and logo assets.",
};

export default function BrandPage() {
    return (
        <main className="min-h-screen bg-brand-linen px-6 py-16 md:px-12 lg:px-24">
            <div className="mx-auto max-w-4xl">
                <header className="mb-16 border-b border-brand-sand pb-12">
                    <p className="mb-2 font-sans text-sm uppercase tracking-widest text-brand-terracotta">
                        Le Piaje
                    </p>
                    <h1 className="font-display text-5xl text-brand-ink md:text-6xl">
                        Brand Guidelines
                    </h1>
                    <p className="mt-4 max-w-2xl font-sans text-brand-muted">
                        Central reference for colors, typography, and logo usage
                        across the Le Piaje website and marketing materials.
                    </p>
                </header>

                <section className="mb-20">
                    <h2 className="mb-8 font-display text-3xl text-brand-ink">
                        Logo
                    </h2>
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="flex flex-col items-center gap-4 border border-brand-sand bg-brand-stone p-8 shadow-soft">
                            <Logo blur="blur-xl" width="w-32" height="h-32" />
                            <p className="font-sans text-sm text-brand-muted">
                                Primary logo
                            </p>
                            <Link
                                href="/assets/logos/logo.png"
                                download
                                className="font-sans text-sm text-brand-terracotta underline-offset-4 hover:underline"
                            >
                                Download logo
                            </Link>
                        </div>
                        <div className="flex flex-col justify-center gap-3 border border-dashed border-brand-sand p-8">
                            <p className="font-sans text-sm text-brand-muted">
                                Coming soon
                            </p>
                            <p className="font-display text-xl text-brand-ink">
                                Horizontal &amp; symbol variants
                            </p>
                            <p className="font-sans text-sm text-brand-muted">
                                Additional logo formats will be added here as
                                they are finalized.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mb-20">
                    <h2 className="mb-8 font-display text-3xl text-brand-ink">
                        Colors
                    </h2>
                    <div className="mb-8 grid grid-cols-2 gap-6 md:grid-cols-3">
                        {brandColorEntries.map((color) => (
                            <ColorSwatch
                                key={color.key}
                                name={color.name}
                                hex={color.hex}
                            />
                        ))}
                    </div>
                    <div className="border border-brand-sand p-6 shadow-soft">
                        <p className="mb-3 font-sans text-sm text-brand-muted">
                            Gradient
                        </p>
                        <div
                            className="h-16 w-full rounded-md"
                            style={{
                                background: brandGradients.contactForm,
                            }}
                        />
                        <p className="mt-3 font-sans text-sm text-brand-muted">
                            {brandColors.stone} to {brandColors.sand}
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="mb-8 font-display text-3xl text-brand-ink">
                        Font
                    </h2>
                    <div className="space-y-10">
                        <div className="border border-brand-sand bg-brand-stone p-8 shadow-soft">
                            <p className="mb-4 font-sans text-sm uppercase tracking-widest text-brand-terracotta">
                                {brandFonts.display}
                            </p>
                            <p className="font-sans mb-6 text-sm text-brand-muted">
                                Headers and titles
                            </p>
                            <h3 className="font-display text-5xl text-brand-ink">
                                La Villa Perlata
                            </h3>
                            <h4 className="mt-4 font-display text-3xl text-brand-terracotta">
                                Agriturismo in Tuscia
                            </h4>
                        </div>
                        <div className="border border-brand-sand bg-brand-stone p-8 shadow-soft">
                            <p className="mb-4 font-sans text-sm uppercase tracking-widest text-brand-terracotta">
                                {brandFonts.body}
                            </p>
                            <p className="mb-6 font-sans text-sm text-brand-muted">
                                Body
                            </p>
                            <p className="font-sans text-lg leading-relaxed text-brand-ink">
                                Le Piaje is an agriturismo nestled between Lake
                                Bolsena and the rolling hills of Montefiascone.
                                Guests enjoy farm-fresh produce, vineyard views,
                                and warm hospitality in the heart of Tuscia.
                            </p>
                            <p className="mt-4 font-sans text-sm text-brand-muted">
                                Labels, navigation, forms, and UI copy.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
