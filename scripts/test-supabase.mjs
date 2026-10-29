import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bmqxgkjjjyzqjusdndht.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtcXhna2pqanl6cWp1c2RuZGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyMjgxNjcsImV4cCI6MjEwODgwNDE2N30.9hBKVhLxDekK5JPK4qcN-EFCiEegq1oFVcA7bTM8byI";

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

