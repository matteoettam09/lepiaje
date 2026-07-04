import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { loadStripe, StripeElementLocale } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { BookingType } from "@/types";
import { useLocale } from "next-intl";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface PaymentInitResponse {
  clientSecret: string;
  bookingReference: string;
  amount: number;
}

export function PaymentWrapper({
  bookingData,
  showAlert,
  setErrorDetails,
}: {
  bookingData: BookingType;
  showAlert: (arg: string) => void;
  setErrorDetails: Dispatch<SetStateAction<string>>;
}) {
  const [clientSecret, setClientSecret] = useState("");
  const [bookingReference, setBookingReference] = useState("");
  const [confirmedAmount, setConfirmedAmount] = useState(0);
  const [initError, setInitError] = useState("");
  const locale = useLocale();

  useEffect(() => {
    const initPayment = async () => {
      try {
        const response = await fetch("/api/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingData }),
        });

        const result = await response.json();
        if (!response.ok || result.error) {
          throw new Error(result.message || "Failed to initialize payment");
        }

        const paymentData = result.message as PaymentInitResponse;
        setClientSecret(paymentData.clientSecret);
        setBookingReference(paymentData.bookingReference);
        setConfirmedAmount(paymentData.amount);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Payment initialization failed";
        setInitError(message);
        setErrorDetails(message);
        showAlert(message);
      }
    };

    initPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingData.checkIn, bookingData.checkOut, bookingData.numberOfGuests]);

  if (initError) {
    return <p className="text-red-500 mt-2">{initError}</p>;
  }

  return (
    clientSecret && (
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: { theme: "night" },
          locale: locale as StripeElementLocale,
        }}
      >
        <PaymentForm
          setErrorDetails={setErrorDetails}
          bookingData={bookingData}
          showAlert={showAlert}
          bookingReference={bookingReference}
          confirmedAmount={confirmedAmount}
        />
      </Elements>
    )
  );
}

function PaymentForm({
  bookingData,
  setErrorDetails,
  showAlert,
  bookingReference,
  confirmedAmount,
}: {
  bookingData: BookingType;
  setErrorDetails: Dispatch<SetStateAction<string>>;
  showAlert: (arg: string) => void;
  bookingReference: string;
  confirmedAmount: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const returnUrl = new URL(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`
    );
    if (bookingReference) {
      returnUrl.searchParams.set("ref", bookingReference);
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        receipt_email: bookingData.bookerEmail,
        return_url: returnUrl.toString(),
      },
    });

    if (error) {
      setErrorMessage(error.message || "Payment failed");
      setErrorDetails(error.message || "Payment failed");
      showAlert("Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const displayAmount = confirmedAmount || bookingData.totalPaid || 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center text-gray-200 text-lg font-semibold">
        Amount to Pay:{" "}
        <span className="text-green-400">€{displayAmount.toFixed(2)}</span>
      </div>

      <PaymentElement />

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full font-bold bg-green-500 text-gray-200 px-4 py-2 rounded mt-4"
      >
        {isProcessing ? "Processing..." : `Pay €${displayAmount.toFixed(2)}`}
      </button>

      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
    </form>
  );
}
