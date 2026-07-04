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

function BookingRequestAdminTemplate({
  bookingData,
  quotedTotal,
}: {
  bookingData: BookingType;
  quotedTotal: number;
}): React.ReactNode {
  return (
    <Html>
      <Head />
      <Preview>
        Booking request (pending payment) at {bookingData.propertyName}
      </Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="bg-white border border-gray-200 rounded-lg p-8 mx-auto my-8 max-w-2xl">
            <Heading className="text-2xl font-bold text-amber-600 mb-4">
              New booking request
            </Heading>
            <Text className="text-gray-700 mb-4">
              A guest has started checkout for{" "}
              <span className="font-semibold">{bookingData.propertyName}</span>.
              Payment is still pending.
            </Text>
            <Section className="bg-gray-50 rounded-lg p-6 mb-4">
              {bookingData.bookingReference && (
                <Text className="text-gray-900 font-bold mb-2">
                  Reference: {bookingData.bookingReference}
                </Text>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text className="text-gray-700 font-semibold">
                    Number of guests:
                  </Text>
                  <Text className="text-gray-900">
                    {bookingData.numberOfGuests || "N/A"}
                  </Text>
                </div>
                <div>
                  <Text className="text-gray-700 font-semibold">Booker:</Text>
                  <Text className="text-gray-900">
                    {bookingData.bookerName || "N/A"}
                  </Text>
                </div>
                <div>
                  <Text className="text-gray-700 font-semibold">Check-in:</Text>
                  <Text className="text-gray-900">
                    {format(new Date(bookingData.checkIn!), "MMMM dd, yyyy")}
                  </Text>
                </div>
                <div>
                  <Text className="text-gray-700 font-semibold">
                    Check-out:
                  </Text>
                  <Text className="text-gray-900">
                    {format(new Date(bookingData.checkOut!), "MMMM dd, yyyy")}
                  </Text>
                </div>
                <div>
                  <Text className="text-gray-700 font-semibold">Email:</Text>
                  <Text className="text-gray-900">
                    {bookingData.bookerEmail || "N/A"}
                  </Text>
                </div>
                {bookingData.bookerPhone && (
                  <div>
                    <Text className="text-gray-700 font-semibold">Phone:</Text>
                    <Text className="text-gray-900">
                      {bookingData.bookerPhone}
                    </Text>
                  </div>
                )}
              </div>
              <Hr className="border-gray-300 my-4" />
              <div className="text-center">
                <Text className="text-gray-700 font-semibold">
                  Quoted total (not yet paid):
                </Text>
                <Text className="text-2xl font-bold text-amber-600">
                  {new Intl.NumberFormat("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  }).format(quotedTotal)}
                </Text>
              </div>
            </Section>
            <Text className="text-sm text-gray-500 text-center">
              You will receive a confirmation email once payment succeeds.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default BookingRequestAdminTemplate;
