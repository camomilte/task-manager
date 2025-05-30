"use-client"

import { format, isToday, isTomorrow, isYesterday } from "date-fns";
import { sv } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";



export const DatePicker = ({ date, onDateChange }) => {
  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button className={cn("w-[280px] justify-start text-left font-normal h-10 bg-transparent text-text border-2 border-primary hover:bg-secondary-100")}>
            <CalendarIcon className="mx-1 h-4 w-4 text-primary" />
            {
              isToday(date)
                ? "Today"
                : isTomorrow(date)
                  ? "Tomorrow"
                  : isYesterday(date)
                    ? "Yesterday"
                    : format(date, "PPP", { locale: sv })
            }
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

