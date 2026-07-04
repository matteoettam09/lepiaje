"use client";

import { useEffect, useState, useCallback } from "react";
import { AvailabilityData } from "@/lib/booking/availabilityData";

export function useAvailability(propertyId: number) {
    const [beds, setBeds] = useState<AvailabilityData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAvailability = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/availability?propertyId=${propertyId}`);
            const result = await response.json();

            if (!response.ok || result.error) {
                throw new Error(result.message || "Failed to load availability");
            }

            setBeds(result.message as AvailabilityData);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Availability error");
            setBeds(null);
        } finally {
            setLoading(false);
        }
    }, [propertyId]);

    useEffect(() => {
        fetchAvailability();
    }, [fetchAvailability]);

    return { beds, loading, error, refetch: fetchAvailability };
}
