import Link from "next/link";
import { notFound } from "next/navigation";
import { getAppointmentsData, getServicesData } from "@/lib/data/store";
import { formatCurrency, formatDuration, formatTime12h } from "@/lib/utils";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Calendar, Clock, MapPin, Mail, Phone, ArrowLeft, ExternalLink } from "lucide-react";
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

    const title = encodeURIComponent(`Appointment: ${service.name}`);
    const details = encodeURIComponent(
      `Booking Reference: ${appointment.booking_reference}\nCustomer: ${appointment.customer_name}\nService: ${service.name}`
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
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 ring-8 ring-emerald-50">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Booking Confirmed!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
          We have sent a confirmation email with all details to{" "}
          <strong className="text-slate-700">{appointment.customer_email}</strong>.
        </p>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden bg-white mb-6">
        <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              Booking Reference
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
          {/* Service & Time breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Service
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                {service ? service.name : "Consultation"}
              </h2>
              {service && (
                <p className="text-xs text-slate-500 mt-0.5">
                  {formatDuration(service.duration_minutes)} &bull; {formatCurrency(service.price)}
                </p>
              )}
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Schedule
              </span>
              <p className="text-sm font-semibold text-slate-900 mt-1 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-slate-400" />
                {formattedDate}
              </p>
              <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-slate-400" />
                {formatTime12h(appointment.start_time)} - {formatTime12h(appointment.end_time)}
              </p>
            </div>
          </div>

          {/* Customer details */}
          <div className="space-y-3 pb-6 border-b border-slate-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Customer Details
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Name</span>
                <span className="font-medium text-slate-800">{appointment.customer_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Email</span>
                <span className="font-medium text-slate-800">{appointment.customer_email}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Phone</span>
                <span className="font-medium text-slate-800">{appointment.customer_phone}</span>
              </div>
            </div>

            {appointment.notes && (
              <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs text-slate-600">
                <strong className="text-slate-700">Special Notes: </strong>
                {appointment.notes}
              </div>
            )}
          </div>

          {/* Actions: Add to Calendar */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={makeGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button variant="outline" className="w-full gap-2 text-xs">
                <Calendar className="h-4 w-4 text-blue-600" />
                Add to Google Calendar
                <ExternalLink className="h-3.5 w-3.5 text-slate-400 ml-auto" />
              </Button>
            </a>

            <Link href="/" className="flex-1">
              <Button className="w-full text-xs">
                Book Another Appointment
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

