import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { inMemoryStore, getAppointmentsData } from "@/lib/data/store";
import { AppointmentStatus } from "@/lib/types";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, notes } = body;

    const supabase = createServerSupabaseClient();

    if (supabase) {
      const updatePayload: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };
      if (status) updatePayload.status = status;
      if (notes !== undefined) updatePayload.notes = notes;

      const { data, error } = await supabase
        .from("appointments")
        .update(updatePayload)
        .eq("id", id)
        .select("*, service:services(*)")
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return NextResponse.json({ success: true, appointment: data });
    } else {
      // In-memory fallback
      const updated = inMemoryStore.updateAppointmentStatus(id, status as AppointmentStatus);
      if (!updated) {
        return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, appointment: updated });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

