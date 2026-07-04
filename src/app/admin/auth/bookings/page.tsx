"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { BookingType } from "@/types";

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<BookingType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/bookings")
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    setError(data.message);
                    return;
                }
                setBookings(data.message || []);
            })
            .catch(() => setError("Failed to load bookings"))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-brand-stone text-brand-ink p-8 mt-24">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Bookings</h1>
                    <Link
                        href="/admin/auth"
                        className="text-green-400 hover:text-green-300"
                    >
                        Back to admin
                    </Link>
                </div>

                {loading && <p>Loading bookings...</p>}
                {error && <p className="text-red-400">{error}</p>}

                {!loading && !error && bookings.length === 0 && (
                    <p className="text-gray-400">No bookings yet.</p>
                )}

                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div
                            key={booking.uuid}
                            className="border border-gray-700 rounded-lg p-4 bg-slate-900"
                        >
                            <div className="flex flex-wrap justify-between gap-2 mb-2">
                                <span className="font-bold text-green-400">
                                    {booking.bookingReference || booking.uuid}
                                </span>
                                <span
                                    className={`px-2 py-1 rounded text-sm ${
                                        booking.status === "confirmed"
                                            ? "bg-green-900 text-green-300"
                                            : booking.status === "pending"
                                              ? "bg-yellow-900 text-yellow-300"
                                              : "bg-gray-700"
                                    }`}
                                >
                                    {booking.status || "unknown"}
                                </span>
                            </div>
                            <p className="text-lg">{booking.propertyName}</p>
                            <p className="text-gray-400">
                                {booking.bookerName} — {booking.bookerEmail}
                            </p>
                            <p className="text-gray-400">
                                {booking.checkIn &&
                                    format(new Date(booking.checkIn), "dd MMM yyyy")}{" "}
                                →{" "}
                                {booking.checkOut &&
                                    format(new Date(booking.checkOut), "dd MMM yyyy")}
                            </p>
                            <p className="text-gray-400">
                                {booking.numberOfGuests} guest(s) — €
                                {booking.totalPaid?.toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
