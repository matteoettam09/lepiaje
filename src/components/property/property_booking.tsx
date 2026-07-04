"use client";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import GuestList from "./property_guest_list";
import { format } from "date-fns";
import { useLocale, useTranslations } from "next-intl";
import { it, enUS } from "react-day-picker/locale";
import { BookingType } from "@/types";
import { calculate_price } from "@/utils/calculate_price";
import BookingSummaryModal from "../show_booking_summary/show_booking_summary";
import { PriceDetails } from "@/types";
import { PriceBreakdown } from "./price_breakdown";
import { DateRange } from "react-day-picker";
import { useAvailability } from "@/hooks/useAvailability";
import {
  getBlockedDateRanges,
  isOverlapping,
  processAvailabilityForDates,
  DateRange as AvailDateRange,
} from "./availabilityUtils";
import { advanceBookingDateSelection } from "@/lib/booking/dateSelection";
import { countBookingGuests } from "@/lib/booking/guestCount";
import { Property as PropertyEnum } from "@/enums";
import {
    VILLA_BASE_PRICE_PER_NIGHT,
    VILLA_EXTRA_GUEST_PRICE,
    VILLA_MAX_GUESTS,
} from "@/constants/villa_pricing";
import { CENTESIMO_PRICE_PER_PERSON_PER_NIGHT } from "@/constants/centesimo_pricing";
interface PropertyBookingProps {
  price: number;
  airbnb?: string;
  propertyId: number;
  propertyName: string;
  booking?: string;
  isLaVillaPerlata?: boolean;
  pricePerAdditionalGuest?: number;
}
const validationSchema = Yup.object().shape({
  bookerName: Yup.string().required("Booker name is required"),
  bookerEmail: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  bookerPhone: Yup.string().optional(),
  bookerGender: Yup.string().required("Gender is necessary"),
});

type BookerFormValues = {
  bookerName: string;
  bookerEmail: string;
  bookerPhone: string;
  bookerGender: string;
};

function SyncBookerValues({
  values,
  isLaVillaPerlata,
  onSync,
}: {
  values: BookerFormValues;
  isLaVillaPerlata?: boolean;
  onSync: (values: BookerFormValues, isLaVillaPerlata?: boolean) => void;
}) {
  useEffect(() => {
    onSync(values, isLaVillaPerlata);
  }, [values, isLaVillaPerlata, onSync]);

  return null;
}

export function PropertyBooking({
  price,
  airbnb,
  propertyId,
  propertyName,
  pricePerAdditionalGuest,
  booking,
  isLaVillaPerlata,
}: PropertyBookingProps) {
  const isCentesimo = propertyId === PropertyEnum.AL_CENTESIMO_CHILOMETRO;
  const effectiveBasePrice = isLaVillaPerlata
    ? VILLA_BASE_PRICE_PER_NIGHT
    : isCentesimo
      ? CENTESIMO_PRICE_PER_PERSON_PER_NIGHT
      : price;
  const effectiveExtraGuestPrice = isLaVillaPerlata
    ? VILLA_EXTRA_GUEST_PRICE
    : (pricePerAdditionalGuest ?? 0);
  const [dates, setDates] = useState<AvailDateRange | null>(null);
  const [hasOverlap, setHasOverlap] = useState<boolean>(false);
  const [guestList, setGuestList] = useState<
    { name: string; gender: string }[]
  >([]);
  const locale = useLocale();
  const t = useTranslations("booking");
  const [bookerEmail, setBookerEmail] = useState<string>("");
  const [bookerPhone, setBookerPhone] = useState<string>("");
  const [bookerName, setBookerName] = useState<string>("");
  const [bookerGender, setBookerGender] = useState<string>("");
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [priceDetails, setPriceDetails] = useState<null | PriceDetails>(null);
  const [error, setError] = useState<string | null>(null);
  const [unAvailableDates, setUnAvailableDates] = useState<AvailDateRange[]>([]);
  const [availableMaleBeds, setAvailableMaleBeds] = useState(0);
  const [availableFemaleBeds, setAvailableFemaleBeds] = useState(0);
  const [availableMixedBeds, setAvailableMixedBeds] = useState(0);
  const { beds, loading } = useAvailability(propertyId);

  const totalHostelBeds =
    (beds?.male_rooms?.length ?? 0) + (beds?.female_rooms?.length ?? 0);

  const handleDateSelect = (range: DateRange | undefined) => {
    setDates((prev) => advanceBookingDateSelection(prev, range));
  };

  const maxGuests = isLaVillaPerlata
    ? VILLA_MAX_GUESTS
    : Math.max(
        1,
        availableMaleBeds + availableFemaleBeds > 0
          ? availableMaleBeds + availableFemaleBeds
          : totalHostelBeds
      );

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
    setError(overlap ? t("dates_unavailable") : null);
  }, [beds, dates, propertyId, t]);

  useEffect(() => {
    if (!dates?.from || !dates?.to) {
      setPriceDetails(null);
      return;
    }

    const pricing = calculate_price(
      dates,
      effectiveBasePrice,
      isCentesimo ? 0 : effectiveExtraGuestPrice,
      countBookingGuests({ guests: guestList }),
      propertyId
    );
    setPriceDetails(pricing);
  }, [
    dates,
    guestList,
    effectiveBasePrice,
    effectiveExtraGuestPrice,
    propertyId,
  ]);

  useEffect(() => {
    if (isLaVillaPerlata) {
      setBookerGender("mixed");
    }
  }, [isLaVillaPerlata]);

  const syncBookerValues = useCallback(
    (values: BookerFormValues, isVilla?: boolean) => {
      setBookerEmail(values.bookerEmail);
      setBookerPhone(values.bookerPhone);
      setBookerName(values.bookerName);
      if (!isVilla) {
        setBookerGender(values.bookerGender);
      }
    },
    []
  );

  const bookingData: BookingType = {
    propertyId,
    propertyName,
    checkIn: (dates?.from as Date) || undefined,
    checkOut: (dates?.to as Date) || undefined,
    checkInTime: "15:00",
    checkOutTime: "11:00",
    guests: guestList.map((guest) => {
      return {
        name: guest.name,
        gender: guest.gender,
        check_in: (dates?.from as Date) || undefined,
        check_out: (dates?.to as Date) || undefined,
      };
    }),
    numberOfGuests: countBookingGuests({ guests: guestList }),
    totalPaid: priceDetails?.totalPrice || 0,
    bookerEmail,
    bookerPhone,
    bookerName,
    bookerGender,
  };

  return (
    <div className="border rounded-lg p-6">
      <h2 className="text-2xl text-brand-ink font-bold mb-4">
        €{effectiveBasePrice}{" "}
        {isCentesimo ? t("per_person_per_night") : t("per_night")}
      </h2>
      <div className="space-y-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !dates && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dates?.from ? (
                dates.to ? (
                  <>
                    {format(dates.from, "LLL dd, y")} -{" "}
                    {format(dates.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dates.from, "LLL dd, y")
                )
              ) : (
                <span>{t("pick_dates")}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto flex items-center justify-center p-0"
            align="start"
          >
            <Calendar
              locale={locale === "it" ? it : enUS}
              mode="range"
              defaultMonth={(dates?.from as Date) || undefined}
              selected={{
                from: (dates?.from as Date) || undefined,
                to: (dates?.to as Date) || undefined,
              }}
              onSelect={handleDateSelect}
              numberOfMonths={2}
              loading={loading}
              datesBlocked={unAvailableDates}
            />
          </PopoverContent>
        </Popover>
        <div className="border rounded-lg p-6">
          <Formik
            initialValues={{
              bookerName: "",
              bookerEmail: "",
              bookerPhone: "",
              bookerGender: "",
            }}
            validationSchema={validationSchema}
            // eslint-disable-next-line
            onSubmit={(values) => {}}
          >
            {({ values, handleChange, handleBlur }) => (
              <>
                <SyncBookerValues
                  values={values}
                  isLaVillaPerlata={isLaVillaPerlata}
                  onSync={syncBookerValues}
                />
                <Form>
                  <div>
                    <div>
                      <p className="text-lg font-bold text-brand-muted">
                        {t("availability")}
                      </p>
                      {!isLaVillaPerlata ? (
                        <>
                          <p className="text-blue-500 text-md">
                            {t("male_beds")} {availableMaleBeds ?? "N/A"}
                          </p>
                          <p className="text-pink-400 text-md">
                            {t("female_beds")} {availableFemaleBeds ?? "N/A"}
                          </p>
                        </>
                      ) : (
                        <p className="text-brand-muted text-md">
                          {t("max_occupancy")}: {availableMixedBeds > 0 ? "Yes" : "No"}
                        </p>
                      )}
                    </div>
                    <p className="text-brand-muted my-2 text-2xl font-semibold">
                      {t("checking_in")}
                    </p>

                    <label className="block text-brand-muted text-sm font-medium">
                      {t("your_name")}:
                    </label>
                    <div className="flex  gap-x-2">
                      <Field
                        type="text"
                        name="bookerName"
                        onBlur={handleBlur}
                        value={values.bookerName}
                        onChange={handleChange}
                        className="w-[80%] border rounded p-2 text-gray-700"
                      />

                      {!isLaVillaPerlata && (
                        <select
                          name="bookerGender"
                          onBlur={handleBlur}
                          value={values.bookerGender || ""}
                          onChange={handleChange}
                          className={`border w-[6em] rounded border-1 p-2 text-gray-700 ${bookerGender ? "border-none" : "border-red-400"}`}
                          required
                        >
                          <option value="" disabled>
                            {t("gender")}
                          </option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      )}
                    </div>
                    <ErrorMessage
                      name="bookerName"
                      component="div"
                      className="text-red-600 text-sm"
                    />
                    <ErrorMessage
                      name="bookerGender"
                      component="div"
                      className="text-red-600 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-brand-muted text-sm font-medium my-2">
                      {t("your_email")}:
                    </label>
                    <Field
                      type="email"
                      name="bookerEmail"
                      value={values.bookerEmail}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full border rounded p-2 text-gray-700"
                    />
                    <ErrorMessage
                      name="bookerEmail"
                      component="div"
                      className="text-red-600 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-brand-muted text-sm font-medium">
                      {t("phone_optional")}:
                    </label>
                    <Field
                      type="tel"
                      name="bookerPhone"
                      value={values.bookerPhone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full border rounded p-2 text-gray-700"
                    />
                    <ErrorMessage
                      name="bookerPhone"
                      component="div"
                      className="text-red-600 text-sm"
                    />
                  </div>
                </Form>
              </>
            )}
          </Formik>
        </div>

        <GuestList
          maxGuests={maxGuests}
          isLaVillaPerlata={Boolean(isLaVillaPerlata)}
          guestList={guestList}
          setGuestList={setGuestList}
        />

        <PriceBreakdown
          priceDetails={priceDetails}
          pricePerNight={effectiveBasePrice}
          pricePerGuest={effectiveExtraGuestPrice}
          showAdditionalGuestPrice={!isCentesimo}
          pricePerNightLabel={
            isCentesimo
              ? t("price_per_person_per_night")
              : t("price_per_night_label")
          }
        />

        <Button
          onClick={async () => {
            setShowSummary(true);
          }}
          disabled={
            hasOverlap ||
            !dates?.to ||
            !bookerEmail ||
            !bookerGender ||
            (guestList.length !== 0 &&
              guestList.some((guest) => !guest.name || !guest.gender))
          }
          className={`w-full ${
            hasOverlap || error
              ? "text-white bg-red-500"
              : "bg-brand-terracotta text-brand-linen hover:bg-brand-terracotta-dark"
          }`}
        >
          {hasOverlap || error
            ? t("dates_unavailable")
            : t("book_now")}
        </Button>

        {error && <p className="text-red-600">{error}</p>}
        {hasOverlap && (
          <p className="text-red-600">
            Selected dates are not available or overlap with unavailable dates
          </p>
        )}
        <div>
          {airbnb && (
            <Link target={"_blank"} href={airbnb}>
              <p className="text-sm text-brand-muted hover:text-[#FF5A5F]">
                {t("book_airbnb")}
              </p>
            </Link>
          )}
          {booking && (
            <Link target={"_blank"} href={booking}>
              <p className="text-sm text-brand-muted hover:text-blue-500">
                {t("book_booking_com")}
              </p>
            </Link>
          )}
        </div>
      </div>
      {showSummary && (
        <BookingSummaryModal
          isOpen={showSummary}
          onClose={() => setShowSummary(false)}
          bookingData={bookingData}
        />
      )}
    </div>
  );
}
