import { getServicesData, getBusinessHoursData, getAppointmentsData } from "@/lib/data/store";
import { BookingFlow } from "@/components/BookingFlow";
import { Calendar, Clock, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { formatCurrency, formatDuration } from "@/lib/utils";

export const revalidate = 0; // Dynamic server rendering

export default async function HomePage() {
  const [services, businessHours, appointments] = await Promise.all([
    getServicesData(),
    getBusinessHoursData(),
    getAppointmentsData(),
  ]);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200/60 bg-gradient-to-b from-white to-slate-50/50 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-white shadow-xs text-xs font-medium text-slate-700 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Fast, modern, and effortless scheduling</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Book your appointment <br className="hidden sm:inline" />
            in less than <span className="underline decoration-slate-300 underline-offset-8">a minute</span>.
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Select your service, choose an available date and time slot, and receive instant confirmation with calendar invites delivered straight to your inbox.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Real-time slot availability
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-slate-600" /> Resend email notifications
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-slate-600" /> Supabase secure database
            </span>
          </div>
        </div>
      </section>

      {/* Main Booking Experience */}
      <BookingFlow
        initialServices={services}
        initialBusinessHours={businessHours}
        initialAppointments={appointments}
      />

      {/* Services Showcase Section */}
      <section id="services" className="border-t border-slate-200/80 bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Our Offerings
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Available Consultation & Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Transparent pricing, clear durations, and dedicated professional care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow bg-slate-50/30"
              >
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium mb-3">
                    {service.category || "Service"}
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {formatDuration(service.duration_minutes)}
                  </span>
                  <span className="text-base font-bold text-slate-900">
                    {formatCurrency(service.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

