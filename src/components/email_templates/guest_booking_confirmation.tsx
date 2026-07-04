import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import { BookingType } from "@/types";
import { format } from "date-fns";

function GuestBookingConfirmationTemplate({
  bookingData,
}: {
  bookingData: BookingType;
}): React.ReactNode {
  return (
    <Html>
      <Head />
      <Preview>
        Your booking at {bookingData.propertyName} is confirmed
      </Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="bg-white border border-gray-200 rounded-lg p-8 mx-auto my-8 max-w-2xl">
            <Heading className="text-2xl font-bold text-green-700 mb-4">
              Booking Confirmed
            </Heading>
            <Text className="text-gray-700 mb-4">
              Thank you for booking with Le Piaje. Your reservation at{" "}
              <span className="font-semibold">{bookingData.propertyName}</span>{" "}
              is confirmed.
            </Text>
            {bookingData.bookingReference && (
              <Text className="text-lg font-bold text-gray-900 mb-4">
                Reference: {bookingData.bookingReference}
              </Text>
            )}
            <Section className="bg-gray-50 rounded-lg p-6 mb-4">
              <Text className="text-gray-700">
                <strong>Check-in:</strong>{" "}
                {format(new Date(bookingData.checkIn!), "MMMM dd, yyyy")} at{" "}
                {bookingData.checkInTime}
              </Text>
              <Text className="text-gray-700">
                <strong>Check-out:</strong>{" "}
                {format(new Date(bookingData.checkOut!), "MMMM dd, yyyy")} at{" "}
                {bookingData.checkOutTime}
              </Text>
              <Text className="text-gray-700">
                <strong>Guests:</strong> {bookingData.numberOfGuests}
              </Text>
              <Hr className="border-gray-300 my-4" />
              <Text className="text-2xl font-bold text-green-600">
                {new Intl.NumberFormat("de-DE", {
                  style: "currency",
                  currency: "EUR",
                }).format(Number(bookingData.totalPaid))}
              </Text>
            </Section>
            <Text className="text-sm text-gray-500 text-center">
              We look forward to welcoming you to Tuscia. For questions, reply
              to this email or contact us via WhatsApp.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default GuestBookingConfirmationTemplate;
