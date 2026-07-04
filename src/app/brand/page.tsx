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
        <main className="min-h-screen bg-brand-charcoal px-6 py-16 md:px-12 lg:px-24">
            <div className="mx-auto max-w-4xl">
                <header className="mb-16 border-b border-white/10 pb-12">
                    <p className="mb-2 font-sans text-sm uppercase tracking-widest text-brand-gold">
                        Le Piaje
                    </p>
                    <h1 className="font-display text-5xl text-brand-cream md:text-6xl">
                        Brand Guidelines
                    </h1>
                    <p className="mt-4 max-w-2xl font-sans text-brand-cream/70">
                        Central reference for colors, typography, and logo usage
                        across the Le Piaje website and marketing materials.
                    </p>
                </header>

                <section className="mb-20">
                    <h2 className="mb-8 font-display text-3xl text-brand-cream">
                        Logo
                    </h2>
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="flex flex-col items-center gap-4 rounded-xl border border-white/10 bg-brand-ink p-8">
                            <Logo blur="blur-xl" width="w-32" height="h-32" />
                            <p className="font-sans text-sm text-brand-cream/70">
                                Primary logo
                            </p>
                            <Link
                                href="/assets/logos/logo.png"
                                download
                                className="font-sans text-sm text-brand-gold underline-offset-4 hover:underline"
                            >
                                Download logo
                            </Link>
                        </div>
                        <div className="flex flex-col justify-center gap-3 rounded-xl border border-dashed border-white/20 p-8">
                            <p className="font-sans text-sm text-brand-cream/50">
                                Coming soon
                            </p>
                            <p className="font-display text-xl text-brand-cream/70">
                                Horizontal &amp; symbol variants
                            </p>
                            <p className="font-sans text-sm text-brand-cream/50">
                                Additional logo formats will be added here as
                                they are finalized.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mb-20">
                    <h2 className="mb-8 font-display text-3xl text-brand-cream">
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
                    <div className="rounded-xl border border-white/10 p-6">
                        <p className="mb-3 font-sans text-sm text-brand-cream/70">
                            Gradient
                        </p>
                        <div
                            className="h-16 w-full rounded-lg"
                            style={{
                                background: brandGradients.contactForm,
                            }}
                        />
                        <p className="mt-3 font-sans text-sm text-brand-cream/50">
                            {brandColors.gold.DEFAULT} to {brandColors.gold.dark}
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="mb-8 font-display text-3xl text-brand-cream">
                        Font
                    </h2>
                    <div className="space-y-10">
                        <div className="rounded-xl border border-white/10 p-8">
                            <p className="mb-4 font-sans text-sm uppercase tracking-widest text-brand-gold">
                                {brandFonts.display}
                            </p>
                            <p className="font-sans mb-6 text-sm text-brand-cream/50">
                                Headers and titles
                            </p>
                            <h3 className="font-display text-5xl text-brand-cream">
                                La Villa Perlata
                            </h3>
                            <h4 className="mt-4 font-display text-3xl text-brand-gold">
                                Agriturismo in Tuscia
                            </h4>
                        </div>
                        <div className="rounded-xl border border-white/10 p-8">
                            <p className="mb-4 font-sans text-sm uppercase tracking-widest text-brand-gold">
                                {brandFonts.body}
                            </p>
                            <p className="mb-6 font-sans text-sm text-brand-cream/50">
                                Body
                            </p>
                            <p className="font-sans text-lg leading-relaxed text-brand-cream">
                                Le Piaje is an agriturismo nestled between Lake
                                Bolsena and the rolling hills of Montefiascone.
                                Guests enjoy farm-fresh produce, vineyard views,
                                and warm hospitality in the heart of Tuscia.
                            </p>
                            <p className="mt-4 font-sans text-sm text-brand-cream/70">
                                Labels, navigation, forms, and UI copy.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
