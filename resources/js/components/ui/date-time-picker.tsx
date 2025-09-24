"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { format, parseISO, isValid, parse } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateTimePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function DateTimePicker({ 
  value, 
  onChange, 
  placeholder = "Select date and time",
  className,
  disabled = false
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)
  
  // Parse the value using date-fns
  const parsedValue = React.useMemo(() => {
    if (!value) return null
    try {
      // Handle datetime-local format (YYYY-MM-DDTHH:mm)
      if (value.includes('T') && !value.includes('Z') && !value.includes('+')) {
        const pattern = value.length > 16 ? "yyyy-MM-dd'T'HH:mm:ss" : "yyyy-MM-dd'T'HH:mm"
        const parsed = parse(value, pattern, new Date())
        return isValid(parsed) ? parsed : null
      }
      // Handle ISO format
      const parsed = parseISO(value)
      return isValid(parsed) ? parsed : null
    } catch {
      return null
    }
  }, [value])

  const [date, setDate] = React.useState<Date | undefined>(parsedValue || undefined)
  const [time, setTime] = React.useState<string>(
    parsedValue ? format(parsedValue, 'HH:mm:ss') : ""
  )

  React.useEffect(() => {
    if (parsedValue) {
      setDate(parsedValue)
      setTime(format(parsedValue, 'HH:mm:ss'))
    } else {
      setDate(undefined)
      setTime("")
    }
  }, [parsedValue])

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate)
      if (time) {
        const [hours, minutes, seconds = '00'] = time.split(":")
        const newDateTime = new Date(selectedDate)
        newDateTime.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds))
        onChange?.(format(newDateTime, "yyyy-MM-dd'T'HH:mm:ss"))
      } else {
        onChange?.(format(selectedDate, "yyyy-MM-dd'T'HH:mm:ss"))
      }
    }
  }

  const handleTimeChange = (timeValue: string) => {
    setTime(timeValue)
    if (date && timeValue) {
      const [hours, minutes, seconds = '00'] = timeValue.split(":")
      const newDateTime = new Date(date)
      newDateTime.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds))
      onChange?.(format(newDateTime, "yyyy-MM-dd'T'HH:mm:ss"))
    }
  }

  return (
    <div className={className}>
      <div className="flex gap-4">
        <div className="flex flex-col gap-3">
          <Label htmlFor="date-picker" className="px-1">
            Date
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date-picker"
                className="w-32 justify-between font-normal"
                disabled={disabled}
              >
                {date ? format(date, 'MMM dd, yyyy') : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                onSelect={(date) => {
                  handleDateSelect(date)
                  setOpen(false)
                }}
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="time-picker" className="px-1">
            Time
          </Label>
          <Input
            type="time"
            id="time-picker"
            step="1"
            value={time}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  )
}
