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
        <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white px-4">
            <div className="text-center space-y-4 max-w-lg">
                <div className="p-4 bg-green-600 rounded-full inline-block">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-white"
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
                <h1 className="text-3xl font-bold">{t("success_title")}</h1>
                <p className="text-lg">{t("success_message")}</p>
                {bookingReference && (
                    <p className="text-xl font-semibold bg-green-800/50 rounded-lg py-3 px-4">
                        {t("reference")}:{" "}
                        <span className="text-green-200">{bookingReference}</span>
                    </p>
                )}
                <p className="text-sm text-green-100">{t("email_sent")}</p>
            </div>

            <div className="mt-8 flex gap-4">
                <Link
                    href="/"
                    className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-md text-white font-medium"
                >
                    {t("go_home")}
                </Link>
                <Link
                    href="/reach-us"
                    className="px-6 py-2 border border-green-300 hover:bg-green-800 rounded-md text-white font-medium"
                >
                    {t("reach_us")}
                </Link>
            </div>
        </div>
    );
}

export default function PaymentSuccess() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-green-900" />}>
            <PaymentSuccessContent />
        </Suspense>
    );
}
