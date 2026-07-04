import React from "react";
import { PriceDetails } from "@/types";

export function PriceBreakdown({
  priceDetails,
  pricePerNight,
  pricePerGuest,
}: {
  priceDetails: PriceDetails | null;
  pricePerNight: number;
  pricePerGuest: number;
}) {
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-brand-stone border border-brand-sand shadow-soft">
      <h2 className="text-xl font-bold text-brand-ink mb-4">Price Breakdown</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="font-medium text-brand-ink">Nights:</span>
          <span className="text-brand-ink">{priceDetails?.nights || "0"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-brand-ink">Price per Night:</span>
          <span className="text-brand-ink">${pricePerNight.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-brand-ink">
            Price per additional guest:
          </span>
          <span className="text-brand-ink">${pricePerGuest?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-brand-ink">Total Guests:</span>
          <span className="text-brand-muted">{priceDetails?.totalGuests}</span>
        </div>
        <div className="flex justify-between border-t border-brand-sand pt-2">
          <span className="font-bold text-brand-ink">Total Price:</span>
          <span className="text-brand-terracotta font-bold">
            $
            {priceDetails?.totalPrice
              ? priceDetails?.totalPrice.toFixed(2)
              : pricePerNight}
          </span>
        </div>
      </div>
    </div>
  );
}
