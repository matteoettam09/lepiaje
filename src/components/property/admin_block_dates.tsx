"use client";

import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format, addDays } from "date-fns";
import { it, enUS } from "react-day-picker/locale";
import { DateRange } from "react-day-picker";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useAvailability } from "@/hooks/useAvailability";
import { submit_new_booking } from "@/services/submit_new_booking";
import {
    DateRange as AvailDateRange,
    getBlockedDateRanges,
    isOverlapping,
    processAvailabilityForDates,
} from "./availabilityUtils";

export function AdminBlockDates({ propertyId }: { propertyId: number }) {
    const [dates, setDates] = useState<AvailDateRange | null>({
        from: new Date(),
        to: null,
    });
    const [hasOverlap, setHasOverlap] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoadingBlocking, setIsLoadingBlocking] = useState(false);
    const [guestGender, setGuestGender] = useState<string>("male");
    const [unAvailableDates, setUnAvailableDates] = useState<AvailDateRange[]>([]);
    const [availableMaleBeds, setAvailableMaleBeds] = useState(0);
    const [availableFemaleBeds, setAvailableFemaleBeds] = useState(0);
    const [availableMixedBeds, setAvailableMixedBeds] = useState(0);
    const locale = useLocale();
    const { beds, loading, refetch } = useAvailability(propertyId);

    useEffect(() => {
        if (!beds || !dates?.from || !dates?.to) return;

        const result = processAvailabilityForDates(beds, propertyId, dates);
        setAvailableMaleBeds(result.availableMaleBeds);
        setAvailableFemaleBeds(result.availableFemaleBeds);
        setAvailableMixedBeds(result.availableMixedBeds);

        const blocked = getBlockedDateRanges(beds, propertyId);
        setUnAvailableDates(blocked);

        const overlap = isOverlapping(blocked, dates);
        setHasOverlap(overlap);
        setError(overlap ? "The selected dates are not available" : null);
    }, [beds, dates, propertyId]);

    useEffect(() => {
        if (dates?.from && (!dates.to || dates.to <= dates.from)) {
            setDates((prev) => {
                const from = prev?.from ?? new Date();
                return { from, to: addDays(from, 1) };
            });
        }
    }, [dates?.from, dates?.to]);

    const handleBlockDates = async () => {
        if (!dates?.from || !dates?.to) {
            setError("Please select a valid date range.");
            return;
        }
        setIsLoadingBlocking(true);

        const bookingData = {
            propertyId,
            propertyName:
                propertyId === 1 ? "La Villa Perlata" : "Al Centesimo Chilometro",
            checkIn: dates.from,
            checkOut: dates.to,
            checkInTime: "15:00",
            checkOutTime: "11:00",
            guests: [],
            numberOfGuests: 1,
            totalPaid: 0,
            bookerEmail: "blocked@lepiaje.com",
            bookerPhone: "blocked@lepiaje.com",
            bookerName: "blocked@lepiaje.com",
            bookerGender: propertyId === 1 ? "mixed" : guestGender,
        };

        try {
            const isSubmitted = await submit_new_booking(bookingData, "block");
            if (isSubmitted.error) {
                alert("Something went wrong blocking the dates.");
                setIsLoadingBlocking(false);
                return;
            }
            setError(null);
            alert("Dates blocked successfully!");
            await refetch();
        } catch (e) {
            console.error("Failed to block dates:", e);
            setError("Failed to block dates. Please try again.");
        } finally {
            setIsLoadingBlocking(false);
        }
    };

    return (
        <div className="border rounded-lg p-6">
            <h2 className="text-2xl text-gray-200 font-bold mb-4">Block Dates</h2>

            {loading ? (
                <p className="text-gray-500 mt-2">Loading room data...</p>
            ) : (
                <div className="mb-4">
                    {propertyId === 2 ? (
                        <>
                            <p className="text-blue-500 text-md">
                                Male beds available {availableMaleBeds}
                            </p>
                            <p className="text-pink-400 text-md">
                                Female beds available {availableFemaleBeds}
                            </p>
                        </>
                    ) : (
                        <p className="text-gray-300 text-md">
                            Property available: {availableMixedBeds > 0 ? "Yes" : "No"}
                        </p>
                    )}
                </div>
            )}

            <div className="space-y-4">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !dates && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dates?.from ? (
                                dates.to ? (
                                    `${format(dates.from, "LLL dd, y")} - ${format(dates.to, "LLL dd, y")}`
                                ) : (
                                    format(dates.from, "LLL dd, y")
                                )
                            ) : (
                                <span>Select dates</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto flex items-center justify-center p-0" align="start">
                        <Calendar
                            locale={locale === "it" ? it : enUS}
                            autoFocus
                            mode="range"
                            defaultMonth={(dates?.from as Date) || undefined}
                            selected={{
                                from: (dates?.from as Date) || undefined,
                                to: (dates?.to as Date) || undefined,
                            }}
                            onSelect={setDates as React.Dispatch<React.SetStateAction<DateRange | undefined>>}
                            numberOfMonths={2}
                            loading={loading}
                            datesBlocked={unAvailableDates}
                        />
                    </PopoverContent>
                </Popover>

                {propertyId === 2 && (
                    <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">
                            Select Gender to Block:
                        </label>
                        <select
                            value={guestGender}
                            onChange={(e) => setGuestGender(e.target.value)}
                            className="border rounded w-full p-2 text-gray-700"
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                )}

                <Button
                    onClick={handleBlockDates}
                    disabled={hasOverlap || isLoadingBlocking}
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                >
                    {isLoadingBlocking ? "Blocking the date..." : "Block Dates"}
                </Button>

                {error && <p className="text-red-600 mt-2">{error}</p>}
            </div>
        </div>
    );
}
