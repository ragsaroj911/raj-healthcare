import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { inMemoryStore, getServicesData } from "@/lib/data/store";

export async function GET() {
  try {
    const services = await getServicesData();
    return NextResponse.json({ services });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, duration_minutes, price, category, is_active } = body;

    if (!name || !duration_minutes || price === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    if (supabase) {
      const { data, error } = await supabase
        .from("services")
        .insert({
          name,
          description: description || "",
          duration_minutes: Number(duration_minutes),
          price: Number(price),
          category: category || "General",
          is_active: is_active ?? true,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return NextResponse.json({ success: true, service: data }, { status: 201 });
    } else {
      const newService = inMemoryStore.addService({
        name,
        description: description || "",
        duration_minutes: Number(duration_minutes),
        price: Number(price),
        category: category || "General",
        is_active: is_active ?? true,
      });
      return NextResponse.json({ success: true, service: newService }, { status: 201 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

