"use client";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLocale } from "next-intl";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { format, addDays } from "date-fns";
import { it, enUS } from "react-day-picker/locale";
import { submit_new_booking } from "@/services/submit_new_booking";

interface Range {
  from: Date | null | string;
  to: Date | null | string;
}
interface Occupant {
  check_in: string;
  check_out: string;
  occupants: Occupant[];
}

interface Room {
  check_in?: string | null;
  check_out?: string | null;
  occupants: Occupant[];
}

interface BedsFromWebSocket {
  // eslint-disable-next-line
  male_rooms?: { roomUuid: string; occupants: any[] }[];
  // eslint-disable-next-line
  female_rooms?: { roomUuid: string; occupants: any[] }[];
  // eslint-disable-next-line
  mixed_rooms?: { roomUuid: string; occupants: any[] }[];
}

export function AdminBlockDates({ propertyId }: { propertyId: number }) {
  const [dates, setDates] = useState<Range | null>({
    from: new Date(),
    to: null,
  });
  const [hasOverlap, setHasOverlap] = useState<boolean>(false);
  console.log("has overlap", hasOverlap);
  const locale = useLocale();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoadingBlocking, setIsLoadingBlocking] = useState<boolean>(false);
  const [unAvailableDates, setUnAvailableDates] = useState<Range[]>([]);
  const [availableMaleBeds, setAvailableMaleBeds] = useState(0);
  const [availableFemaleBeds, setAvailableFemaleBeds] = useState(0);
  const [availableMixedBeds, setAvailableMixedBeds] = useState(0);
  const [beds, setBeds] = useState<BedsFromWebSocket | null>(null);
  const [guestGender, setGuestGender] = useState("male");

  function isOverlapping(
    dateRanges: Range[],
    targetRange: Range | null
  ): boolean {
    if (
      !dateRanges ||
      !targetRange?.from ||
      !targetRange.to ||
      !dateRanges?.length
    ) {
      console.log(
        "the date ranges and target ranges are null or undefined and must be checked"
      );
      return false;
    }
    const targetFrom = new Date(targetRange.from).getTime();
    const targetTo = new Date(targetRange.to).getTime();

    for (const range of dateRanges) {
      const rangeFrom = new Date(range.from!).getTime();
      const rangeTo = new Date(range.to!).getTime();

      if (
        (rangeFrom <= targetTo && rangeFrom >= targetFrom) ||
        (rangeTo <= targetTo && rangeTo >= targetFrom) ||
        (rangeFrom <= targetFrom && rangeTo >= targetTo)
      ) {
        return true;
      }
    }

    return false;
  }

  useEffect(() => {
    let ws: WebSocket | undefined;

    const connectWebSocket = () => {
      ws = new WebSocket(
        `${process.env.NEXT_PUBLIC_WEB_SOCKET_SERVER}/?propertyId=${propertyId}`
      );

      ws.onopen = () => {
        console.log("WebSocket connected.");
        ws?.send(
          JSON.stringify({
            propertyId,
            getBothAvailabilities: propertyId === 2, // Fetch both male and female only for propertyId === 2
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          console.log("changed detected");
          const data = JSON.parse(event.data);

          if (!data || typeof data !== "object") {
            console.error(
              "Unexpected data structure received from WebSocket:",
              data
            );
            return;
          }
          if (propertyId === 1) {
            setBeds({
              mixed_rooms: data.mixed_rooms || [],
            });
          } else if (propertyId === 2) {
            setBeds({
              male_rooms: data.male_rooms || [],
              female_rooms: data.female_rooms || [],
            });
          }

          setLoading(false);
        } catch (error) {
          console.error("Error parsing WebSocket data:", error);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed.");
        setLoading(true);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [propertyId]);

  const countAvailableBeds = (
    // eslint-disable-next-line
    rooms: any[],
    fromDate: Date,
    toDate: Date
  ): { isFull: boolean; availableBedsToBook: number } => {
    const totalBeds = rooms.length;
    let occupied = 0;
    rooms.forEach((room) => {
      // eslint-disable-next-line
      const occupiedBeds = room.occupants.filter((occupant: any) => {
        const checkIn = new Date(occupant.check_in);
        const checkOut = new Date(occupant.check_out);
        return fromDate < checkOut && toDate > checkIn; // Overlapping dates
      }).length;
      occupied = occupied + occupiedBeds;
    });

    return {
      isFull: occupied === totalBeds,
      availableBedsToBook: totalBeds - occupied,
    };
  };

  function findCommonDateRanges(data: Room[]): Range[] {
    const normalizeDate = (date: string) => date.split("T")[0];

    const uniqueDateRanges = new Set<string>();
    data.forEach((room) =>
      room.occupants.forEach((occupant) => {
        const normalizedRange = `${normalizeDate(occupant.check_in)}|${normalizeDate(occupant.check_out)}`;
        uniqueDateRanges.add(normalizedRange);
      })
    );

    const dateRanges = Array.from(uniqueDateRanges).map((range) => {
      const [from, to] = range.split("|");
      return { from, to };
    });

    const commonDateRanges = dateRanges.filter(({ from, to }) =>
      data.every((room) =>
        room.occupants.some(
          (occupant: Occupant) =>
            normalizeDate(occupant.check_in) === from &&
            normalizeDate(occupant.check_out) === to
        )
      )
    );

    return commonDateRanges;
  }

  const processAvailabilityData = () => {
    if (!dates?.from || !dates?.to) {
      console.log(
        "it is necessary to send the from and to dates to the processAvailabilityData function"
      );
      return;
    }

    const mixedRooms = beds?.mixed_rooms || [];
    const unavailableDates: Range[] = [];
    let mixedAvailableBeds = 0;

    if (propertyId === 1) {
      // Process only mixed_rooms for propertyId === 1
      const { isFull, availableBedsToBook } = countAvailableBeds(
        mixedRooms,
        dates?.from as Date,
        dates?.to as Date
      );

      mixedAvailableBeds = availableBedsToBook;

      if (isFull) {
        unavailableDates.push({ from: dates?.from, to: dates?.to });
      }
    }

    setAvailableMixedBeds(mixedAvailableBeds);

    if (propertyId === 2) {
      const maleRooms = beds?.male_rooms || [];
      const femaleRooms = beds?.female_rooms || [];

      const { isFull: isMaleFull, availableBedsToBook: availabilityMale } =
        countAvailableBeds(maleRooms, dates?.from as Date, dates?.to as Date);
      const { isFull: isFemaleFull, availableBedsToBook: availabilityFemale } =
        countAvailableBeds(femaleRooms, dates?.from as Date, dates?.to as Date);

      if (isMaleFull && isFemaleFull) {
        unavailableDates.push({ from: dates?.from, to: dates?.to });
      }

      setAvailableMaleBeds(availabilityMale);
      setAvailableFemaleBeds(availabilityFemale);
    }

    setUnAvailableDates(unavailableDates);
  };

  useEffect(() => {
    if (beds) {
      processAvailabilityData();
    }
    // eslint-disable-next-line
  }, [dates, beds]);

  useEffect(() => {
    if (unAvailableDates.length !== 0 && dates?.to && dates?.from) {
      const overlap = isOverlapping(unAvailableDates, dates);

      setHasOverlap(overlap);
      if (overlap) setError("The selected dates are not available");
      if (!overlap) {
        setError(null);
      }
    }
    if (dates?.from && (!dates.to || dates.to <= dates.from)) {
      setDates((prev) => {
        const from = prev?.from ?? new Date();
        return {
          from,
          to: addDays(from, 1),
        };
      });
    }
    // eslint-disable-next-line
  }, [beds, dates, dates?.from, dates?.to, unAvailableDates.length]);

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
      checkIn: dates?.from,
      checkOut: dates?.to,
      checkInTime: "15:00",
      checkOutTime: "11:00",
      guests: [],
      numberOfGuests: 1, // Total beds being blocked
      totalPaid: 0, // Hardcoded for blocking
      bookerEmail: "blocked@lepiaje.com", // Hardcoded email
      bookerPhone: "blocked@lepiaje.com", // Hardcoded phone
      bookerName: "blocked@lepiaje.com", // Hardcoded name
      bookerGender: propertyId === 1 ? "mixed" : guestGender!, // Dynamic based on property
    };

    try {
      const isSubmitted = await submit_new_booking(bookingData, "block");
      if (isSubmitted.error) {
        console.log("error", isSubmitted.message);
        console.log("error", isSubmitted.errorDetails);
        alert("Something went wrong blocking the dates.");
        setIsLoadingBlocking(false);
        return;
      }

      setError(null);
      alert("Dates blocked successfully!");
      setIsLoadingBlocking(false);
    } catch (e) {
      setIsLoadingBlocking(false);
      console.error("Failed to block dates:", e);
      setError("Failed to block dates. Please try again.");
    }
  };

  useEffect(() => {
    if (beds) {
      processAvailabilityData();

      if (propertyId === 1) {
        const datesToBlock = findCommonDateRanges(beds?.mixed_rooms || []);
        setUnAvailableDates(datesToBlock);
      } else if (propertyId === 2) {
        const datesToBlock = findCommonDateRanges([
          ...beds.female_rooms!,
          ...beds.male_rooms!,
        ]);
        setUnAvailableDates(datesToBlock);
      }
    }
    // eslint-disable-next-line
  }, [dates, beds, propertyId]);

  return (
    <div className="border rounded-lg p-6">
      <h2 className="text-2xl text-gray-200 font-bold mb-4">Block Dates</h2>

      {loading ? (
        <p className="text-gray-500 mt-2">Loading room data...</p>
      ) : (
        <div className="mb-4">
          <h3 className="text-lg text-gray-300 font-semibold mb-2">
            Room Availability:
          </h3>
          <p className="text-gray-400 whitespace-pre-line">
            {/* {availabilityMessage} */} some sort of message here?
          </p>
        </div>
      )}

      <>
        {propertyId === 2 ? (
          <>
            <div>
              <p className="text-blue-500 text-md">
                Male beds available {availableMaleBeds ?? "N/A"}
              </p>
            </div>
            <div>
              <p className="text-pink-400 text-md">
                Female beds available {availableFemaleBeds ?? "N/A"}
              </p>
            </div>
          </>
        ) : (
          <div>
            <p className="text-gray-300 text-md">
              {" "}
              max occupancy: {Math.max(availableMixedBeds, 0)}
            </p>
          </div>
        )}
      </>
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
                  `${format(dates.from, "LLL dd, y")} - ${format(dates.to, "LLL dd, y")}`
                ) : (
                  format(dates.from, "LLL dd, y")
                )
              ) : (
                <span>Select dates</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto flex items-center justify-center p-0"
            align="start"
          >
            <Calendar
              locale={locale === "it" ? it : enUS}
              autoFocus
              mode="range"
              defaultMonth={(dates?.from as Date) || undefined}
              selected={{
                from: (dates?.from as Date) || undefined,
                to: (dates?.to as Date) || undefined,
              }}
              onSelect={
                setDates as React.Dispatch<
                  React.SetStateAction<DateRange | undefined>
                >
              }
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
          className="w-full bg-red-500 hover:bg-red-600 text-white"
        >
          {!isLoadingBlocking ? "Block Dates" : "Blocking the date..."}
        </Button>

        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>
    </div>
  );
}
