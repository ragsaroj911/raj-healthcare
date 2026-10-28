"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Service, BusinessHours, Appointment } from "@/lib/types";
import { formatCurrency, formatDuration, formatTime12h, calculateEndTime } from "@/lib/utils";
import { ServiceSelector } from "./ServiceSelector";
import { DatePickerSlots } from "./DatePickerSlots";
import { CustomerForm } from "./CustomerForm";
import { Card, CardContent } from "./ui/card";
import { Calendar, Clock, CheckCircle2, ShieldCheck, Tag } from "lucide-react";
import { format, addDays } from "date-fns";

interface BookingFlowProps {
  initialServices: Service[];
  initialBusinessHours: BusinessHours[];
  initialAppointments: Appointment[];
}

export function BookingFlow({
  initialServices,
  initialBusinessHours,
  initialAppointments,
}: BookingFlowProps) {
  const router = useRouter();

  // State
  const [services] = useState<Service[]>(initialServices);
  const [businessHours] = useState<BusinessHours[]>(initialBusinessHours);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  const [selectedService, setSelectedService] = useState<Service | null>(
    initialServices[0] || null
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    format(addDays(new Date(), 1), "yyyy-MM-dd")
  );
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Customer Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Calculate validity
  const isFormValid = Boolean(
    selectedService &&
    selectedDate &&
    selectedTime &&
    name.trim() &&
    email.includes("@") &&
    phone.trim()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !selectedService) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const endTime = calculateEndTime(selectedTime, selectedService.duration_minutes);

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          appointmentDate: selectedDate,
          startTime: selectedTime,
          endTime: endTime,
          customerName: name.trim(),
          customerEmail: email.trim(),
          customerPhone: phone.trim(),
          notes: notes.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create appointment");
      }

      // Route to confirmation page
      router.push(`/confirmation/${data.appointment.booking_reference}`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div id="booking" className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Stepper & Forms */}
        <div className="lg:col-span-7 space-y-8">
          <Card className="border-slate-200/80 shadow-sm p-6">
            <ServiceSelector
              services={services}
              selectedService={selectedService}
              onSelect={(s) => {
                setSelectedService(s);
                setSelectedTime("");
              }}
            />
          </Card>

          <Card className="border-slate-200/80 shadow-sm p-6">
            <DatePickerSlots
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              selectedTime={selectedTime}
              onSelectTime={setSelectedTime}
              durationMinutes={selectedService?.duration_minutes || 30}
              businessHours={businessHours}
              bookedAppointments={appointments}
            />
          </Card>

          <Card className="border-slate-200/80 shadow-sm p-6">
            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600">
                {errorMsg}
              </div>
            )}
            <CustomerForm
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
              notes={notes}
              setNotes={setNotes}
              onSubmit={handleSubmit}
              loading={loading}
              isValid={isFormValid}
            />
          </Card>
        </div>

        {/* Right Column: Sticky Booking Summary Card */}
        <div className="lg:col-span-5 sticky top-20">
          <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
            <div className="bg-slate-900 text-white p-5">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Summary
              </span>
              <h2 className="text-lg font-bold mt-0.5">Your Booking</h2>
            </div>

            <CardContent className="p-6 space-y-5">
              {/* Service details */}
              <div className="space-y-1.5 pb-4 border-b border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Selected Service</span>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 text-sm">
                    {selectedService ? selectedService.name : "None selected"}
                  </h3>
                  <span className="font-bold text-slate-900">
                    {selectedService ? formatCurrency(selectedService.price) : "$0"}
                  </span>
                </div>
                {selectedService && (
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {formatDuration(selectedService.duration_minutes)} duration
                  </p>
                )}
              </div>

              {/* Date & Time details */}
              <div className="space-y-2 pb-4 border-b border-slate-100 text-xs">
                <span className="text-slate-500 font-medium">Date & Schedule</span>
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>
                    {selectedDate
                      ? format(new Date(selectedDate + "T00:00:00"), "EEEE, MMMM d, yyyy")
                      : "Choose a date"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span>
                    {selectedTime
                      ? `${formatTime12h(selectedTime)} (${formatDuration(
                          selectedService?.duration_minutes || 30
                        )})`
                      : "Choose a time slot"}
                  </span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pb-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Subtotal</span>
                  <span>{selectedService ? formatCurrency(selectedService.price) : "$0.00"}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Deposit Due Today</span>
                  <span className="font-medium text-emerald-600">Free / Pay at Visit</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                  <span className="font-semibold text-sm text-slate-900">Total Price</span>
                  <span className="font-bold text-base text-slate-900">
                    {selectedService ? formatCurrency(selectedService.price) : "$0.00"}
                  </span>
                </div>
              </div>

              {/* Trust markers */}
              <div className="rounded-lg bg-slate-50 p-3 space-y-1.5 text-[11px] text-slate-600 border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Instant Email Confirmation via Resend
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5 text-slate-600" />
                  Free cancellation up to 24 hours prior
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

