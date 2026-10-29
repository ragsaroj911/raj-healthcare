import { getServicesData, getBusinessHoursData, getAppointmentsData } from "@/lib/data/store";
import { BookingFlow } from "@/components/BookingFlow";
import {
  HeartPulse,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Stethoscope,
  Building2,
  Lock,
  CalendarCheck,
  Award,
  FileCheck2,
  UserCheck
} from "lucide-react";
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
      <section className="relative overflow-hidden border-b border-slate-200/60 bg-gradient-to-b from-emerald-50/40 via-white to-slate-50/50 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-200 bg-emerald-50/70 shadow-xs text-xs font-semibold text-emerald-800 mb-6">
            <HeartPulse className="h-4 w-4 text-emerald-600" />
            <span>Raj Healthcare &bull; Patient-First Clinic</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Compassionate medical care, <br className="hidden sm:inline" />
            booked in <span className="text-emerald-700 underline decoration-emerald-300 underline-offset-8">under 60 seconds</span>.
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Reserve your consultation slot with certified physicians at Raj Healthcare. Enjoy zero waiting lines, transparent consultation fees, and instant calendar confirmations.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Instant Email Confirmation
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="h-4 w-4 text-emerald-600" /> Zero Waiting Times
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> Confidential Health Records
            </span>
          </div>
        </div>
      </section>

      {/* Main Booking Flow Component */}
      <BookingFlow
        initialServices={services}
        initialBusinessHours={businessHours}
        initialAppointments={appointments}
      />

      {/* Section 1: Services & Treatments */}
      <section id="services" className="border-t border-slate-200/80 bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Medical Specialties
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Available Consultations & Care Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Transparent consultation fees, comprehensive doctor attention, and personalized treatment plans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md hover:border-emerald-200 transition-all bg-slate-50/40"
              >
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-100/70 text-emerald-800 text-[11px] font-medium mb-3">
                    {service.category || "Consultation"}
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

      {/* Section 2: Facilities We Provide */}
      <section id="facilities" className="border-t border-slate-200/80 bg-slate-50/60 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Clinic Amenities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Facilities Provided at Raj Healthcare
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Every appointment is supported by clean, modern infrastructure designed for your safety and comfort.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Stethoscope className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm text-slate-900 mb-1.5">Experienced Medical Physicians</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Consultations conducted by certified doctors with expertise in primary diagnosis, preventive wellness, and chronic illness management.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm text-slate-900 mb-1.5">Sanitised Private Suites</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Comfortable, sterilized examination rooms equipped with digital vitals monitoring (Blood pressure, Pulse oximeter, Glucose testing).
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm text-slate-900 mb-1.5">Digital Prescriptions & In-House Pharmacy</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Receive electronic prescriptions directly on your email and phone, with direct access to genuine prescribed medications on-site.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm text-slate-900 mb-1.5">Guaranteed Zero-Wait Slot</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your booked appointment time is reserved exclusively for you. Walk in and see the doctor at your exact scheduled slot.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm text-slate-900 mb-1.5">Automated Reminders & Rescheduling</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Receive convenient email reminders before your visit. Easily reschedule with one click if your plans change.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm text-slate-900 mb-1.5">Free Post-Visit Follow-Up Advice</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Have questions about your prescription dosage? Reply directly to your confirmation email for quick doctor assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Data Storage & Privacy Policy */}
      <section id="privacy" className="border-t border-slate-200/80 bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="p-8 rounded-2xl bg-slate-900 text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-emerald-400 text-xs font-semibold mb-4">
              <Lock className="h-3.5 w-3.5" />
              <span>Transparent Patient Data Policy</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              What Data We Store & How We Protect You
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              At Raj Healthcare, patient trust is our highest priority. We believe in total data transparency:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="font-bold text-white block mb-1">What Information We Collect</span>
                <ul className="space-y-1 text-slate-300">
                  <li>&bull; Patient Name</li>
                  <li>&bull; Email address (for confirmations & reminders)</li>
                  <li>&bull; Phone number (optional)</li>
                  <li>&bull; Chosen consultation type & time</li>
                  <li>&bull; Optional health notes you submit</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="font-bold text-emerald-400 block mb-1">Our Privacy Commitments</span>
                <ul className="space-y-1 text-slate-300">
                  <li>&bull; No third-party data sharing or marketing spam.</li>
                  <li>&bull; Row-Level Security (RLS) encrypted database.</li>
                  <li>&bull; Only your consulting physician has access.</li>
                  <li>&bull; You can request record deletion at any time.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
