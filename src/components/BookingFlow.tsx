"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Service, BusinessHours, Appointment } from "@/lib/types";
import { formatCurrency, formatDuration, formatTime12h, calculateEndTime } from "@/lib/utils";
import { ServiceSelector } from "./ServiceSelector";
import { DatePickerSlots } from "./DatePickerSlots";
import { CustomerForm } from "./CustomerForm";
import { Card, CardContent } from "./ui/card";
import {
  Calendar,
  Clock,
  CheckCircle2,
  ShieldCheck,
  HeartPulse,
  FileText,
  Lock,
  Stethoscope,
  Sparkles,
  Building2,
  BellRing
} from "lucide-react";
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
  const [appointments] = useState<Appointment[]>(initialAppointments);

  const [selectedService, setSelectedService] = useState<Service | null>(
    initialServices[0] || null
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    format(addDays(new Date(), 1), "yyyy-MM-dd")
  );
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Patient Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Calculate validity (Name, Email, Service, Date, Time required - Phone is optional)
  const isFormValid = Boolean(
    selectedService &&
    selectedDate &&
    selectedTime &&
    name.trim() &&
    email.includes("@")
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
        throw new Error(data.error || "Failed to book appointment");
      }

      // Route to confirmation page
      router.push(`/confirmation/${data.appointment.booking_reference}`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong while booking. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div id="booking" className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Visual Stepper Bar */}
      <div className="mb-8 p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className={`flex h-6 w-6 items-center justify-center rounded-full font-bold ${selectedService ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
            1
          </span>
          <span className={`font-semibold ${selectedService ? 'text-slate-900' : 'text-slate-400'}`}>
            Select Service: {selectedService ? selectedService.name : "Pending"}
          </span>
        </div>
        <span className="hidden sm:inline text-slate-300">&rarr;</span>
        <div className="flex items-center gap-3">
          <span className={`flex h-6 w-6 items-center justify-center rounded-full font-bold ${selectedTime ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
            2
          </span>
          <span className={`font-semibold ${selectedTime ? 'text-slate-900' : 'text-slate-400'}`}>
            Date & Time: {selectedTime ? `${formatTime12h(selectedTime)}` : "Pick slot"}
          </span>
        </div>
        <span className="hidden sm:inline text-slate-300">&rarr;</span>
        <div className="flex items-center gap-3">
          <span className={`flex h-6 w-6 items-center justify-center rounded-full font-bold ${name && email ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
            3
          </span>
          <span className={`font-semibold ${name && email ? 'text-slate-900' : 'text-slate-400'}`}>
            Patient Info & Confirmation
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Booking Steps */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-slate-200/80 shadow-sm p-6 bg-white">
            <ServiceSelector
              services={services}
              selectedService={selectedService}
              onSelect={(s) => {
                setSelectedService(s);
                setSelectedTime("");
              }}
            />
          </Card>

          <Card className="border-slate-200/80 shadow-sm p-6 bg-white">
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

          <Card className="border-slate-200/80 shadow-sm p-6 bg-white">
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

        {/* Right Column: Clear Patient Information, Facilities & Privacy Card */}
        <div className="lg:col-span-5 sticky top-20 space-y-4">
          <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
            <div className="bg-emerald-700 text-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-emerald-200 font-semibold flex items-center gap-1.5">
                  <HeartPulse className="h-4 w-4" /> Raj Healthcare
                </span>
                <span className="text-xs bg-emerald-800/80 px-2.5 py-0.5 rounded-full text-emerald-100 font-medium">
                  Instant Booking
                </span>
              </div>
              <h2 className="text-lg font-bold mt-1">Appointment Summary</h2>
            </div>

            <CardContent className="p-6 space-y-5">
              {/* Selected Service & Timing */}
              <div className="space-y-1.5 pb-4 border-b border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Selected Medical Consultation</span>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 text-sm">
                    {selectedService ? selectedService.name : "Select a service"}
                  </h3>
                  <span className="font-bold text-slate-900 text-base">
                    {selectedService ? formatCurrency(selectedService.price) : "₹0"}
                  </span>
                </div>
                {selectedService && (
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                    <Clock className="h-3.5 w-3.5 text-emerald-600" />
                    {formatDuration(selectedService.duration_minutes)} private doctor session
                  </p>
                )}
              </div>

              {/* Schedule preview */}
              <div className="space-y-2 pb-4 border-b border-slate-100 text-xs">
                <span className="text-slate-500 font-medium">Reserved Time & Schedule</span>
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="h-4 w-4 text-emerald-600" />
                  <span>
                    {selectedDate
                      ? format(new Date(selectedDate + "T00:00:00"), "EEEE, MMMM d, yyyy")
                      : "Choose a date"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  <span>
                    {selectedTime
                      ? `${formatTime12h(selectedTime)} (Confirmed Slot)`
                      : "Choose an available slot"}
                  </span>
                </div>
              </div>

              {/* 1. WHAT CUSTOMER WILL RECEIVE */}
              <div className="space-y-2 pb-4 border-b border-slate-100 text-xs">
                <span className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  What You Will Receive
                </span>
                <ul className="space-y-1.5 text-slate-600 pl-1">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>Instant Email Confirmation:</strong> Official booking voucher & Reference ID.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>1-Click Calendar Sync:</strong> Pre-filled Google & Apple Calendar invite.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>Zero Wait Priority:</strong> Walk straight into your reserved consultation slot.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span><strong>Digital Prescription:</strong> Summary & doctor notes sent after consultation.</span>
                  </li>
                </ul>
              </div>

              {/* 2. WHAT FACILITIES WE PROVIDE */}
              <div className="space-y-2 pb-4 border-b border-slate-100 text-xs">
                <span className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs">
                  <Building2 className="h-3.5 w-3.5 text-blue-600" />
                  Our Clinic Facilities
                </span>
                <ul className="space-y-1.5 text-slate-600 pl-1">
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span>Certified Physicians & Medical Specialists.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span>Hygienic, sanitised private consultation suites.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span>Basic vitals check (BP, Sugar, O2, Pulse) included.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span>Free on-site Wi-Fi & comfortable patient lounge.</span>
                  </li>
                </ul>
              </div>

              {/* 3. WHAT DATA WE STORE (Transparency & Privacy) */}
              <div className="rounded-xl bg-slate-50 p-3.5 space-y-2 text-xs border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
                  <Lock className="h-3.5 w-3.5 text-slate-700" />
                  Patient Privacy & Data We Store
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  We only store your <strong>Name</strong>, <strong>Email</strong>, and <strong>Appointment Time</strong> to hold your consultation slot.
                </p>
                <div className="text-[11px] text-slate-500 flex items-center gap-1 pt-0.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Encrypted via Supabase. Zero ads, zero selling of personal data.</span>
                </div>
              </div>

              {/* Payment note */}
              <div className="pt-2 flex justify-between items-center text-xs">
                <span className="text-slate-500">Consultation Fee</span>
                <span className="font-semibold text-slate-900">
                  {selectedService ? formatCurrency(selectedService.price) : "₹0"}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100 font-medium">
                <span>Payment Timing:</span>
                <span>Pay at Clinic or Post-Visit</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
