import Link from "next/link";
import { notFound } from "next/navigation";
import { getAppointmentsData, getServicesData } from "@/lib/data/store";
import { formatCurrency, formatDuration, formatTime12h } from "@/lib/utils";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  Calendar,
  Clock,
  HeartPulse,
  Mail,
  Phone,
  ArrowLeft,
  ExternalLink,
  Building2,
  FileText,
  ShieldCheck,
  MapPin
} from "lucide-react";
import { format, parseISO } from "date-fns";

export const revalidate = 0;

interface ConfirmationPageProps {
  params: {
    id: string; // booking_reference or id
  };
}

export default async function ConfirmationPage({ params }: ConfirmationPageProps) {
  const { id } = params;
  const [appointments, services] = await Promise.all([
    getAppointmentsData(),
    getServicesData(),
  ]);

  const appointment = appointments.find(
    (a) => a.booking_reference === id || a.id === id
  );

  if (!appointment) {
    notFound();
  }

  const service = appointment.service || services.find((s) => s.id === appointment.service_id);

  // Helper to build Google Calendar link
  const makeGoogleCalendarUrl = () => {
    if (!appointment || !service) return "#";
    const dateFormatted = appointment.appointment_date.replace(/-/g, "");
    const startHour = appointment.start_time.replace(":", "") + "00";
    const endHour = appointment.end_time.replace(":", "") + "00";

    const title = encodeURIComponent(`Raj Healthcare Doctor Consultation: ${service.name}`);
    const details = encodeURIComponent(
      `Appointment at Raj Healthcare\nReference ID: ${appointment.booking_reference}\nPatient: ${appointment.customer_name}\nService: ${service.name}\nTime: ${appointment.start_time} - ${appointment.end_time}\n\nPlease arrive 5 minutes before your scheduled slot.`
    );
    const dates = `${dateFormatted}T${startHour}/${dateFormatted}T${endHour}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}`;
  };

  const formattedDate = appointment.appointment_date
    ? format(parseISO(appointment.appointment_date), "EEEE, MMMM d, yyyy")
    : appointment.appointment_date;

  return (
    <div className="min-h-[80vh] py-12 px-4 sm:px-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-slate-600">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Raj Healthcare Home
          </Button>
        </Link>
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 ring-8 ring-emerald-50">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-full mb-2">
          Appointment Confirmed &bull; Raj Healthcare
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Your Consultation is Reserved!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
          We have generated your appointment pass and sent the confirmation to{" "}
          <strong className="text-slate-800">{appointment.customer_email}</strong>.
        </p>
      </div>

      <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-3">
        <Mail className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
        <div className="leading-relaxed">
          <span className="font-bold text-emerald-900 block text-sm">
            Confirmation Notice Dispatched to: {appointment.customer_email}
          </span>
          <span>
            Your appointment voucher and calendar invite have been registered for your email. Once you configure your Resend API credentials, live emails land directly in your inbox.
          </span>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden bg-white mb-6">
        <div className="p-6 bg-emerald-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-emerald-200 font-medium uppercase tracking-wider">
              Patient Reference ID
            </span>
            <div className="text-2xl font-mono font-bold tracking-wider mt-0.5">
              {appointment.booking_reference}
            </div>
          </div>
          <div>
            <StatusBadge status={appointment.status} />
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Medical Service & Timing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Consultation Type
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                <HeartPulse className="h-4 w-4 text-emerald-600" />
                {service ? service.name : "Medical Consultation"}
              </h2>
              {service && (
                <p className="text-xs text-slate-500 mt-1">
                  Duration: {formatDuration(service.duration_minutes)} &bull; Fee: {formatCurrency(service.price)}
                </p>
              )}
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Scheduled Time Slot
              </span>
              <p className="text-sm font-semibold text-slate-900 mt-1 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-emerald-600" />
                {formattedDate}
              </p>
              <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-emerald-600" />
                {formatTime12h(appointment.start_time)} - {formatTime12h(appointment.end_time)}
              </p>
            </div>
          </div>

          {/* Patient Details */}
          <div className="space-y-3 pb-6 border-b border-slate-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Patient Information
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Patient Name</span>
                <span className="font-semibold text-slate-800">{appointment.customer_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Notification Email</span>
                <span className="font-semibold text-slate-800">{appointment.customer_email}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Phone Number</span>
                <span className="font-semibold text-slate-800">{appointment.customer_phone || "Not provided (Optional)"}</span>
              </div>
            </div>

            {appointment.notes && (
              <div className="mt-3 p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg text-xs text-slate-700">
                <strong className="text-emerald-900">Patient Health Notes / Symptoms: </strong>
                {appointment.notes}
              </div>
            )}
          </div>

          {/* What to bring / Patient Guidance */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
            <span className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-emerald-600" />
              Patient Visit Checklist
            </span>
            <ul className="space-y-1 text-slate-600 pl-1">
              <li>&bull; Arrive 5 minutes prior to your scheduled time slot for effortless vitals recording.</li>
              <li>&bull; Bring any previous prescription slips or recent lab reports if relevant.</li>
              <li>&bull; Consultation fee of <strong>{service ? formatCurrency(service.price) : "₹0"}</strong> can be paid at the clinic desk after your visit.</li>
            </ul>
          </div>

          {/* Actions: Add to Calendar */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={makeGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button variant="outline" className="w-full gap-2 text-xs border-emerald-200 hover:bg-emerald-50">
                <Calendar className="h-4 w-4 text-emerald-600" />
                Add to Google Calendar
                <ExternalLink className="h-3.5 w-3.5 text-slate-400 ml-auto" />
              </Button>
            </a>

            <Link href="/" className="flex-1">
              <Button className="w-full text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
                Book Another Appointment
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
