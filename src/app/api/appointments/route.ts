import { NextResponse } from "next/server";
import { generateBookingReference } from "@/lib/utils";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { inMemoryStore, getAppointmentsData, getServicesData } from "@/lib/data/store";
import { sendBookingEmails } from "@/lib/email/resend";
import { Appointment, Service } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");
    const date = searchParams.get("date");

    const allAppointments = await getAppointmentsData();

    if (reference) {
      const match = allAppointments.find((a) => a.booking_reference === reference);
      if (!match) {
        return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
      }
      return NextResponse.json({ appointment: match });
    }

    if (date) {
      const filtered = allAppointments.filter((a) => a.appointment_date === date);
      return NextResponse.json({ appointments: filtered });
    }

    return NextResponse.json({ appointments: allAppointments });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      serviceId,
      appointmentDate,
      startTime,
      endTime,
      customerName,
      customerEmail,
      customerPhone,
      notes,
    } = body;

    if (!serviceId || !appointmentDate || !startTime || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json({ error: "Missing required booking details" }, { status: 400 });
    }

    const services = await getServicesData();
    const service = services.find((s) => s.id === serviceId);

    if (!service) {
      return NextResponse.json({ error: "Selected service is invalid or unavailable" }, { status: 400 });
    }

    const bookingReference = generateBookingReference();
    const supabase = createServerSupabaseClient();

    let createdAppointment: Appointment;

    if (supabase) {
      const { data, error } = await supabase
        .from("appointments")
        .insert({
          booking_reference: bookingReference,
          service_id: serviceId,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          appointment_date: appointmentDate,
          start_time: startTime,
          end_time: endTime,
          status: "pending",
          notes: notes || "",
        })
        .select("*, service:services(*)")
        .single();

      if (error) {
        console.error("Supabase insert error:", error);
        throw new Error(error.message);
      }
      createdAppointment = data;
    } else {
      // In-memory fallback
      createdAppointment = inMemoryStore.addAppointment({
        booking_reference: bookingReference,
        service_id: serviceId,
        service: service,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        appointment_date: appointmentDate,
        start_time: startTime,
        end_time: endTime,
        status: "pending",
        notes: notes || "",
        created_at: new Date().toISOString(),
      });
    }

    // Trigger asynchronous Resend email notifications
    try {
      await sendBookingEmails(createdAppointment, service);
    } catch (emailErr) {
      console.warn("Could not dispatch confirmation email:", emailErr);
    }

    return NextResponse.json(
      {
        success: true,
        appointment: createdAppointment,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Appointment creation error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create appointment" },
      { status: 500 }
    );
  }
}

