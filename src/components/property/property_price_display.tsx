"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PriceDisplayProps {
  pricePerNight: number;
  initialNights?: number;
  serviceFee?: number;
  cleaningFee?: number;
}

export default function PriceDisplay({
  pricePerNight,
  initialNights = 1,
  serviceFee = 0,
  cleaningFee = 0,
}: PriceDisplayProps) {
  const [nights, setNights] = useState(initialNights);
  const [total, setTotal] = useState(0);
  setNights(1);

  useEffect(() => {
    const subtotal = pricePerNight * nights;
    const newTotal = subtotal + serviceFee + cleaningFee;
    setTotal(newTotal);
  }, [nights, pricePerNight, serviceFee, cleaningFee]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between ">
          <span className="text-2xl font-bold text-brand-ink">
            ${pricePerNight}
          </span>
          <span className="text-base font-normal text-brand-muted">
            price per night
          </span>
        </CardTitle>
        <CardTitle className="flex justify-between ">
          <span className="text-2xl font-bold text-brand-ink">{nights}</span>
          <span className="text-base font-normal text-brand-muted">nights</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cleaningFee > 0 && (
          <div className="flex justify-between">
            <span>Cleaning fee</span>
            <span>${cleaningFee}</span>
          </div>
        )}
        {serviceFee > 0 && (
          <div className="flex justify-between">
            <span className="text-brand-ink">Service fee</span>
            <span className="text-brand-ink">${serviceFee}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-4">
        <span className="text-brand-ink text-lg font-semibold">Total</span>
        <span className="text-brand-terracotta text-2xl font-bold">${total}</span>
      </CardFooter>
    </Card>
  );
}
