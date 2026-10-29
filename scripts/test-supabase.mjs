import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log("Testing Supabase connection...");
  
  // 1. Check services table
  const { data: services, error: sError } = await supabase.from("services").select("*");
  console.log("Services query:", { error: sError?.message || null, count: services?.length });

  // 2. Check business_hours table
  const { data: hours, error: hError } = await supabase.from("business_hours").select("*");
  console.log("Business hours query:", { error: hError?.message || null, count: hours?.length });

  // 3. Check appointments table
  const { data: appointments, error: aError } = await supabase.from("appointments").select("*");
  console.log("Appointments query:", { error: aError?.message || null, count: appointments?.length });
}

testConnection();

