"use client";

import React, { useMemo } from "react";
import { format, addDays, isSameDay, getDay, parseISO } from "date-fns";
import { BusinessHours, TimeSlot, Appointment } from "@/lib/types";
import { formatTime12h, cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Clock, AlertCircle } from "lucide-react";

interface DatePickerSlotsProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  selectedTime: string; // HH:mm
  onSelectTime: (time: string) => void;
  durationMinutes: number;
  businessHours: BusinessHours[];
  bookedAppointments: Appointment[];
}

export function DatePickerSlots({
  selectedDate,
  onSelectDate,
  selectedTime,
  onSelectTime,
  durationMinutes,
  businessHours,
  bookedAppointments,
}: DatePickerSlotsProps) {
  // Generate next 14 days for quick selection
  const upcomingDays = useMemo(() => {
    const today = new Date();
    const days: { dateStr: string; dayName: string; dayNumber: string; month: string; isClosed: boolean }[] = [];

    for (let i = 0; i < 14; i++) {
      const dateObj = addDays(today, i);
      const dateStr = format(dateObj, "yyyy-MM-dd");
      const dayOfWeek = getDay(dateObj);
      const config = businessHours.find((b) => b.day_of_week === dayOfWeek);
      const isClosed = config ? config.is_closed : false;

      days.push({
        dateStr,
        dayName: format(dateObj, "EEE"),
        dayNumber: format(dateObj, "d"),
        month: format(dateObj, "MMM"),
        isClosed,
      });
    }
    return days;
  }, [businessHours]);

  // Calculate available time slots for the currently selected date
  const timeSlots = useMemo(() => {
    if (!selectedDate) return [];

    const dateObj = parseISO(selectedDate);
    const dayOfWeek = getDay(dateObj);
    const config = businessHours.find((b) => b.day_of_week === dayOfWeek);

    if (!config || config.is_closed) {
      return [];
    }

    const [openH, openM] = config.open_time.split(":").map(Number);
    const [closeH, closeM] = config.close_time.split(":").map(Number);

    const openTotalMins = openH * 60 + openM;
    const closeTotalMins = closeH * 60 + closeM;

    // Filter appointments for this date that are not cancelled
    const activeBookings = bookedAppointments.filter(
      (apt) => apt.appointment_date === selectedDate && apt.status !== "cancelled"
    );

    const slots: TimeSlot[] = [];
    const interval = Math.min(Math.max(durationMinutes, 30), 60);

    for (let current = openTotalMins; current + durationMinutes <= closeTotalMins; current += 30) {
      const slotH = Math.floor(current / 60);
      const slotM = current % 60;
      const timeStr = `${String(slotH).padStart(2, "0")}:${String(slotM).padStart(2, "0")}`;

      const slotStart = current;
      const slotEnd = current + durationMinutes;

      // Check collision with any existing booking
      const hasConflict = activeBookings.some((apt) => {
        const [aptStartH, aptStartM] = apt.start_time.split(":").map(Number);
        const [aptEndH, aptEndM] = apt.end_time.split(":").map(Number);
        const aptStart = aptStartH * 60 + aptStartM;
        const aptEnd = aptEndH * 60 + aptEndM;

        return Math.max(slotStart, aptStart) < Math.min(slotEnd, aptEnd);
      });

      slots.push({
        time: timeStr,
        available: !hasConflict,
        reason: hasConflict ? "Booked" : undefined,
      });
    }

    return slots;
  }, [selectedDate, businessHours, bookedAppointments, durationMinutes]);

  const isCurrentDateClosed = useMemo(() => {
    if (!selectedDate) return false;
    const dayOfWeek = getDay(parseISO(selectedDate));
    const config = businessHours.find((b) => b.day_of_week === dayOfWeek);
    return config ? config.is_closed : false;
  }, [selectedDate, businessHours]);

  return (
    <div className="space-y-6">
      {/* 2. Select Date */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">2. Select Date & Time</h3>
            <p className="text-xs text-slate-500">Pick a day and available slot.</p>
          </div>
          <input
            type="date"
            value={selectedDate}
            min={format(new Date(), "yyyy-MM-dd")}
            onChange={(e) => {
              if (e.target.value) {
                onSelectDate(e.target.value);
                onSelectTime("");
              }
            }}
            className="text-xs border border-slate-200 rounded-md px-2.5 py-1 text-slate-700 bg-white"
          />
        </div>

        {/* Horizontal scrollable date pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {upcomingDays.map((d) => {
            const isSelected = selectedDate === d.dateStr;
            return (
              <button
                key={d.dateStr}
                type="button"
                disabled={d.isClosed}
                onClick={() => {
                  onSelectDate(d.dateStr);
                  onSelectTime("");
                }}
                className={cn(
                  "flex flex-col items-center justify-center min-w-[62px] py-2.5 px-2 rounded-xl border text-xs transition-all shrink-0",
                  isSelected
                    ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                    : d.isClosed
                    ? "opacity-35 bg-slate-100/70 border-slate-200 cursor-not-allowed"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                <span className={cn("text-[10px] font-medium uppercase", isSelected ? "text-slate-300" : "text-slate-500")}>
                  {d.dayName}
                </span>
                <span className="text-base font-bold my-0.5">{d.dayNumber}</span>
                <span className={cn("text-[10px]", isSelected ? "text-slate-300" : "text-slate-400")}>
                  {d.isClosed ? "Closed" : d.month}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Available Time Slots */}
      <div>
        <div className="flex items-center gap-1.5 mb-2.5">
          <Clock className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Available Slots ({selectedDate ? format(parseISO(selectedDate), "EEEE, MMM d") : ""})
          </span>
        </div>

        {isCurrentDateClosed ? (
          <div className="p-6 text-center border border-dashed rounded-xl bg-slate-50 text-slate-500 text-xs">
            <AlertCircle className="h-5 w-5 mx-auto mb-2 text-slate-400" />
            We are closed on this day. Please select another date above.
          </div>
        ) : timeSlots.length === 0 ? (
          <div className="p-6 text-center border border-dashed rounded-xl bg-slate-50 text-slate-500 text-xs">
            No slots available on this date.
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {timeSlots.map((slot) => {
              const isSelected = selectedTime === slot.time;
              return (
                <button
                  key={slot.time}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => onSelectTime(slot.time)}
                  className={cn(
                    "py-2.5 px-2 rounded-lg text-xs font-medium border text-center transition-all",
                    isSelected
                      ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                      : !slot.available
                      ? "border-slate-100 bg-slate-100 text-slate-400 line-through cursor-not-allowed"
                      : "border-slate-200 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50"
                  )}
                >
                  {formatTime12h(slot.time)}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

