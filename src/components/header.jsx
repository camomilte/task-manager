"use client"

import { addDays, format, isValid, parse } from "date-fns";
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Button } from "./ui/button";
import { DatePicker } from "./datepicker";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export const Header = () => {

  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const router = useRouter();
  const pathName = usePathname();

  const parsed = date ? parse(date, "yyyy-MM-dd", new Date()) : new Date();

  const selectedDate = isValid(parsed) ? parsed : new Date;

  const navigateToDate = (newDate) => {
    const formatted = format(newDate, "yyyy-MM-dd");
    const params = new URLSearchParams(searchParams.toString())
    params.set("date", formatted)
    router.push(`${pathName}?${params.toString()}`)
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <Button className="rounded-full size-10 bg-transparent border-primary border-2 text-primary hover:bg-secondary-100" onClick={() => navigateToDate(addDays(selectedDate, -1))}>
        <FaChevronLeft />
      </Button>
      <DatePicker 
        date={selectedDate}
        onDateChange={navigateToDate}
      />
      <Button className="rounded-full size-10 bg-transparent border-primary border-2 text-primary hover:bg-secondary-100" onClick={() => navigateToDate(addDays(selectedDate, 1))}>
        <FaChevronRight />
      </Button>
    </div>
  )
}