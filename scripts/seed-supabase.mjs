import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key";

const supabase = createClient(supabaseUrl, supabaseKey);

const SERVICES = [
  {
    name: "General Physician Consultation",
    description: "Personal consultation with our doctor for acute illnesses, fevers, coughs, health guidance, and preliminary diagnoses.",
    duration_minutes: 30,
    price: 499,
    category: "Primary Care",
    is_active: true,
  },
  {
    name: "Comprehensive Health Assessment",
    description: "Complete physical examination, blood pressure & vitals monitoring, diabetes risk analysis, and lifestyle roadmap.",
    duration_minutes: 60,
    price: 1499,
    category: "Preventative",
    is_active: true,
  },
  {
    name: "Specialist Consultation",
    description: "Focused in-depth clinical consultation for cardiology, chronic metabolic conditions, and internal medicine concerns.",
    duration_minutes: 45,
    price: 999,
    category: "Specialist Care",
    is_active: true,
  },
  {
    name: "Follow-up & Prescription Review",
    description: "Review test results, evaluate treatment progress, and adjust ongoing medical prescriptions with your doctor.",
    duration_minutes: 20,
    price: 299,
    category: "Follow-up",
    is_active: true,
  },
];

const BUSINESS_HOURS = [
  { day_of_week: 0, open_time: "10:00", close_time: "14:00", is_closed: true },
  { day_of_week: 1, open_time: "09:00", close_time: "18:00", is_closed: false },
  { day_of_week: 2, open_time: "09:00", close_time: "18:00", is_closed: false },
  { day_of_week: 3, open_time: "09:00", close_time: "18:00", is_closed: false },
  { day_of_week: 4, open_time: "09:00", close_time: "18:00", is_closed: false },
  { day_of_week: 5, open_time: "09:00", close_time: "17:00", is_closed: false },
  { day_of_week: 6, open_time: "09:30", close_time: "15:00", is_closed: false },
];

async function seed() {
  console.log("Checking if Supabase tables exist...");

  const { error: sCheck } = await supabase.from("services").select("id").limit(1);
  if (sCheck) {
    console.error("Tables not created yet in Supabase:", sCheck.message);
    console.log("Please run the SQL schema in your Supabase SQL Editor:");
    console.log("https://supabase.com/dashboard/project/bmqxgkjjjyzqjusdndht/sql/new");
    return;
  }

  console.log("Inserting services...");
  const { data: sData, error: sErr } = await supabase.from("services").upsert(SERVICES, { onConflict: "name" }).select();
  if (sErr) console.error("Error inserting services:", sErr.message);
  else console.log(`✓ Inserted ${sData?.length || 0} services successfully!`);

  console.log("Inserting business hours...");
  const { data: hData, error: hErr } = await supabase.from("business_hours").upsert(BUSINESS_HOURS, { onConflict: "day_of_week" }).select();
  if (hErr) console.error("Error inserting hours:", hErr.message);
  else console.log(`✓ Inserted ${hData?.length || 0} business hours successfully!`);

  console.log("Supabase database is seeded and ready!");
}

seed();

