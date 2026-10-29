import { Service, BusinessHours, Appointment } from "../types";

export const INITIAL_SERVICES: Service[] = [
  {
    id: "srv-1",
    name: "General Physician Consultation",
    description: "Personal consultation with our doctor for acute illnesses, fevers, coughs, health guidance, and preliminary diagnoses.",
    duration_minutes: 30,
    price: 499,
    is_active: true,
    category: "Primary Care",
  },
  {
    id: "srv-2",
    name: "Comprehensive Health Assessment",
    description: "Complete physical examination, blood pressure & vitals monitoring, diabetes risk analysis, and lifestyle roadmap.",
    duration_minutes: 60,
    price: 1499,
    is_active: true,
    category: "Preventative",
  },
  {
    id: "srv-3",
    name: "Specialist Consultation",
    description: "Focused in-depth clinical consultation for cardiology, chronic metabolic conditions, and internal medicine concerns.",
    duration_minutes: 45,
    price: 999,
    is_active: true,
    category: "Specialist Care",
  },
  {
    id: "srv-4",
    name: "Follow-up & Prescription Review",
    description: "Review test results, evaluate treatment progress, and adjust ongoing medical prescriptions with your doctor.",
    duration_minutes: 20,
    price: 299,
    is_active: true,
    category: "Follow-up",
  },
];

export const INITIAL_BUSINESS_HOURS: BusinessHours[] = [
  { day_of_week: 0, open_time: "10:00", close_time: "14:00", is_closed: true },  // Sunday: Closed (Emergency on call)
  { day_of_week: 1, open_time: "09:00", close_time: "18:00", is_closed: false }, // Monday
  { day_of_week: 2, open_time: "09:00", close_time: "18:00", is_closed: false }, // Tuesday
  { day_of_week: 3, open_time: "09:00", close_time: "18:00", is_closed: false }, // Wednesday
  { day_of_week: 4, open_time: "09:00", close_time: "18:00", is_closed: false }, // Thursday
  { day_of_week: 5, open_time: "09:00", close_time: "17:00", is_closed: false }, // Friday
  { day_of_week: 6, open_time: "09:30", close_time: "15:00", is_closed: false }, // Saturday
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-1",
    booking_reference: "RH-8F3K9A",
    service_id: "srv-1",
    service: INITIAL_SERVICES[0],
    customer_name: "Aman Verma",
    customer_email: "aman.verma@example.com",
    customer_phone: "+91 98765 43210",
    appointment_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    start_time: "10:00",
    end_time: "10:30",
    status: "confirmed",
    notes: "Mild fever and seasonal throat irritation for 2 days.",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "apt-2",
    booking_reference: "RH-2M7P4Q",
    service_id: "srv-2",
    service: INITIAL_SERVICES[1],
    customer_name: "Priya Sharma",
    customer_email: "priya.s@example.com",
    customer_phone: "",
    appointment_date: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    start_time: "14:00",
    end_time: "15:00",
    status: "pending",
    notes: "Routine annual health assessment.",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "apt-3",
    booking_reference: "RH-9X4L1V",
    service_id: "srv-3",
    service: INITIAL_SERVICES[2],
    customer_name: "Rohan Gupta",
    customer_email: "rohan.gupta@example.com",
    customer_phone: "+91 91234 56789",
    appointment_date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    start_time: "11:30",
    end_time: "12:15",
    status: "completed",
    notes: "Cardiology follow-up after blood report.",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];
