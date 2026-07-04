"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { useTranslations } from "next-intl";

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const bookingReference = searchParams.get("ref");
    const t = useTranslations("payment");

    return (
        <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-brand-linen text-brand-ink px-4">
            <div className="text-center space-y-4 max-w-lg border border-brand-sand bg-brand-stone p-10 shadow-soft">
                <div className="p-4 bg-brand-terracotta/10 rounded-full inline-block">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-brand-terracotta"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12l2 2l4-4M12 2a10 10 0 11-10 10 10 10 0 0110-10z"
                        />
                    </svg>
                </div>
                <h1 className="text-3xl font-display font-bold">{t("success_title")}</h1>
                <p className="text-lg text-brand-muted">{t("success_message")}</p>
                {bookingReference && (
                    <p className="text-xl font-semibold bg-brand-linen border border-brand-sand py-3 px-4">
                        {t("reference")}:{" "}
                        <span className="text-brand-terracotta">{bookingReference}</span>
                    </p>
                )}
                <p className="text-sm text-brand-muted">{t("email_sent")}</p>
            </div>

            <div className="mt-8 flex gap-4">
                <Link
                    href="/"
                    className="px-6 py-2 bg-brand-terracotta hover:bg-brand-terracotta-dark text-brand-linen font-medium transition-colors"
                >
                    {t("go_home")}
                </Link>
                <Link
                    href="/reach-us"
                    className="px-6 py-2 border border-brand-sand text-brand-ink hover:bg-brand-stone font-medium transition-colors"
                >
                    {t("reach_us")}
                </Link>
            </div>
        </div>
    );
}

export default function PaymentSuccess() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-brand-linen" />}>
            <PaymentSuccessContent />
        </Suspense>
    );
}
