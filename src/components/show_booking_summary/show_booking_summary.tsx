"use client";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Badge } from "lucide-react";
import dynamic from "next/dynamic";
import Logo from "@/components/logo/logo";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useSuccessAlert } from "@/hooks/use_alert";
import { Alert } from "../alerts/alerts";
import { BookingType } from "@/types";

const PaymentWrapper = dynamic(
  () =>
    import("../stripe/checkout_form").then((mod) => ({
      default: mod.PaymentWrapper,
    })),
  { ssr: false }
);

interface BookingSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: BookingType;
}

export default function BookingSummaryModal({
  isOpen,
  onClose,
  bookingData,
}: BookingSummaryProps) {
  const { isVisible, message, showAlert, hideAlert } = useSuccessAlert();
  const [errorDetails, setErrorDetails] = useState("");
  useEffect(() => {
    return () => {
      setErrorDetails("");
    };
  }, []);
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          hideAlert();
          onClose();
        }
      }}
    >
      {isOpen && (
        <>
          <DialogDescription hidden>
            Booking summary and payment form
          </DialogDescription>
          <DialogContent className="my-4 max-h-[90vh] w-[90%] overflow-y-auto bg-slate-950 py-8">
        <DialogHeader>
          <DialogTitle className="text-gray-400 text-center">
            Booking Confirmation
          </DialogTitle>
        </DialogHeader>

        <Card className="w-full bg-slate-950">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-4">
              <Logo width="w-[8em]" height="h-[8em]" blur="blur-lg" />

              <div>
                <h3 className="text-gray-200 text-center font-semibold text-lg mb-2">
                  {bookingData.propertyName}
                </h3>
                <div>
                  <label className="text-gray-200 font-bold text-xl">
                    Booker:
                  </label>
                  <h3 className="text-gray-200 font-semibold text-lg mb-2">
                    {bookingData.bookerName}
                  </h3>
                </div>
                <div>
                  <h3 className="text-gray-200 font-semibold text-lg mb-2">
                    Dates
                  </h3>
                  <p className="text-gray-200">
                    Check-in:{" "}
                    {bookingData.checkIn &&
                      format(new Date(bookingData.checkIn), "MMMM d, yyyy")}
                  </p>
                  <p className="text-gray-200">
                    Check-out:{" "}
                    {bookingData.checkOut &&
                      format(new Date(bookingData.checkOut), "MMMM d, yyyy")}
                  </p>
                </div>
                <div>
                  <h3 className="text-gray-200 font-semibold text-lg mb-2">
                    Guests
                  </h3>
                  <p className="text-gray-200 font-thin text-md">
                    {bookingData.guests.length} Guests
                  </p>
                  {bookingData.guests.map((guest, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-start"
                    >
                      <Badge className="mr-2 text-green-600"></Badge>
                      <p className="text-gray-200">{guest.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {isOpen && (
                <div>
                  <h3 className="text-gray-200 text-center font-semibold text-lg mb-4">
                    Complete Your Payment
                  </h3>
                  <PaymentWrapper
                    setErrorDetails={setErrorDetails}
                    showAlert={showAlert}
                    bookingData={bookingData}
                  />
                </div>
              )}

              {isVisible && (
                <Alert
                  message={message}
                  isVisible={isVisible}
                  onClose={hideAlert}
                  success={message.includes("successful")}
                />
              )}
              {errorDetails && (
                <p className="text-red-500 mt-2">{errorDetails}</p>
              )}
            </div>
          </CardContent>
        </Card>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
}
