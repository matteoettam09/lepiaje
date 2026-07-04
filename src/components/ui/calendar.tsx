import React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

type DisabledDate = {
  from: string | null | Date;
  to: string | null | Date;
};

type CalendarPropsCustomized = React.ComponentProps<typeof DayPicker> & {
  loading: boolean;

  datesBlocked: DisabledDate[] | [];
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  datesBlocked,
  loading,

  ...props
}: CalendarPropsCustomized) {
  //TODO stripe -> ()
  //TODO small webApp to manually block dates (domingo)

  return (
    <div>
      <DayPicker
        disabled={
          loading
            ? true
            : [
                { before: new Date(Date.now()) },
                ...datesBlocked.map((date) => {
                  return {
                    from: new Date(date.from!),
                    to: new Date(date.to!),
                  };
                }),
              ]
        }
        showOutsideDays={showOutsideDays}
        className={cn("p-3", className)}
        classNames={{
          months:
            "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          ...classNames,
          today: "font-bold text-lg text-brand-gold",
        }}
        {...props}
      />
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
