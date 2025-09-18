"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

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
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  )
  const [time, setTime] = React.useState<string>(
    value ? new Date(value).toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    }) : ""
  )

  React.useEffect(() => {
    if (value) {
      const dateValue = new Date(value)
      setDate(dateValue)
      setTime(dateValue.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }))
    }
  }, [value])

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate)
      if (time) {
        const [hours, minutes] = time.split(":")
        const newDateTime = new Date(selectedDate)
        newDateTime.setHours(parseInt(hours), parseInt(minutes))
        onChange?.(newDateTime.toISOString().slice(0, 16))
      } else {
        onChange?.(selectedDate.toISOString().slice(0, 16))
      }
    }
  }

  const handleTimeChange = (timeValue: string) => {
    setTime(timeValue)
    if (date && timeValue) {
      const [hours, minutes] = timeValue.split(":")
      const newDateTime = new Date(date)
      newDateTime.setHours(parseInt(hours), parseInt(minutes))
      onChange?.(newDateTime.toISOString().slice(0, 16))
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
                {date ? date.toLocaleDateString() : "Select date"}
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
