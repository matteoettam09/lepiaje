"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { PurchaseType } from "@/types";

export default function AdminOrdersPage() {
    const [purchases, setPurchases] = useState<PurchaseType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/purchases")
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    setError(data.message);
                    return;
                }
                setPurchases(data.message || []);
            })
            .catch(() => setError("Failed to load orders"))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-gray-200 p-8 mt-24">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Product Orders</h1>
                    <Link href="/admin/auth" className="text-green-400 hover:text-green-300">
                        Back to admin
                    </Link>
                </div>

                {loading && <p>Loading orders...</p>}
                {error && <p className="text-red-400">{error}</p>}

                <div className="space-y-4">
                    {purchases.map((purchase) => (
                        <div
                            key={purchase.uuid}
                            className="border border-gray-700 rounded-lg p-4 bg-slate-900"
                        >
                            <p className="font-bold text-green-400">{purchase.productName}</p>
                            <p className="text-gray-400">
                                {purchase.clientEmail} — {purchase.amountOfProduct} unit(s)
                            </p>
                            <p className="text-gray-400">
                                €{purchase.amountPaid?.toFixed(2)} —{" "}
                                {purchase.purchasedOn &&
                                    format(new Date(purchase.purchasedOn), "dd MMM yyyy HH:mm")}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
