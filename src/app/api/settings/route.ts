import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { inMemoryStore, getBusinessHoursData } from "@/lib/data/store";
import { BusinessHours } from "@/lib/types";

export async function GET() {
  try {
    const hours = await getBusinessHoursData();
    return NextResponse.json({ businessHours: hours });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessHours } = body as { businessHours: BusinessHours[] };

    if (!Array.isArray(businessHours)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    if (supabase) {
      for (const item of businessHours) {
        const { error } = await supabase
          .from("business_hours")
          .upsert(
            {
              day_of_week: item.day_of_week,
              open_time: item.open_time,
              close_time: item.close_time,
              is_closed: item.is_closed,
            },
            { onConflict: "day_of_week" }
          );

        if (error) throw new Error(error.message);
      }
      return NextResponse.json({ success: true, businessHours });
    } else {
      const updated = inMemoryStore.updateBusinessHours(businessHours);
      return NextResponse.json({ success: true, businessHours: updated });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

