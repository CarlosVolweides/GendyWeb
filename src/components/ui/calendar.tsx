"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react@0.487.0";
import { DayPicker } from "react-day-picker@8.10.1";

import { cn } from "./utils";
import { buttonVariants } from "./button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-3",
        caption: "flex justify-center pt-1 relative items-center w-full mb-3",
        caption_label: "text-base text-gray-700",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 bg-transparent p-0 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex mb-2",
        head_cell:
          "text-gray-400 rounded-md w-10 text-xs uppercase",
        row: "flex w-full mt-1",
        cell: cn(
          "relative p-0 text-center focus-within:relative focus-within:z-20",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "",
        ),
        day: cn(
          "size-10 p-0 text-sm text-gray-700 hover:bg-gray-100 rounded-full transition-colors aria-selected:opacity-100",
        ),
        day_range_start:
          "day-range-start",
        day_range_end:
          "day-range-end",
        day_selected:
          "!bg-gradient-to-br !from-blue-500 !to-purple-600 !text-white hover:!from-blue-600 hover:!to-purple-700 focus:!from-blue-500 focus:!to-purple-600",
        day_today: "bg-gray-100 text-gray-900 font-semibold",
        day_outside:
          "day-outside text-gray-300 opacity-50",
        day_disabled: "text-gray-300 opacity-30",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-5", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-5", className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };
