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

function BookingNotificationTemplate({
  bookingData,
}: {
  bookingData: BookingType;
}): React.ReactNode {
  return (
    <Html>
      <Head />
      <Preview>
        New booking received at{" "}
        {bookingData.propertyName || "N/A property name"}
      </Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="bg-white border border-gray-200 rounded-lg p-8 mx-auto my-8 max-w-2xl">
            <Heading className="text-2xl font-bold text-blue-600 mb-4">
              Hello Matteo!
            </Heading>
            <Text className="text-gray-700 mb-4">
              A new booking has been received at{" "}
              <span className="font-semibold">{bookingData.propertyName}</span>{" "}
              on{" "}
              {format(new Date(bookingData.dateOfBooking!), "MMMM dd, yyyy") ??
                "N/A date of booking"}
              . Here are the details:
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
                  <Text className="text-gray-700 font-semibold">
                    Guest/s Name/s:
                  </Text>
                  <ul className="list-disc pl-5">
                    {bookingData.guests.map(
                      (guest: { name: string | undefined }, index: number) => (
                        <li key={index} className="text-gray-900">
                          {guest?.name || ""}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div>
                  <Text className="text-gray-700 font-semibold">Check-in:</Text>
                  <Text className="text-gray-900">
                    {format(new Date(bookingData.checkIn!), "MMMM dd, yyyy") ||
                      "N/A"}
                  </Text>
                </div>
                <div>
                  <Text className="text-gray-700 font-semibold">
                    Check-out:
                  </Text>
                  <Text className="text-gray-900">
                    {format(new Date(bookingData.checkOut!), "MMMM dd, yyyy") ||
                      "N/A"}
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
                <Text className="text-gray-700 font-semibold">Total Paid:</Text>
                <Text className="text-2xl font-bold text-green-600">
                  {new Intl.NumberFormat("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  }).format(Number(bookingData.totalPaid)) || "N/A"}
                </Text>
              </div>
            </Section>
            <Text className="text-sm text-gray-500 text-center">
              This is an automated notification. Please do not reply to this
              email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default BookingNotificationTemplate;
