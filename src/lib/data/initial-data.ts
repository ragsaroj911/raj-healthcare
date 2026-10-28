import { Service, BusinessHours, Appointment } from "../types";

export const INITIAL_SERVICES: Service[] = [
  {
    id: "srv-1",
    name: "Strategy & Consultation",
    description: "One-on-one discovery session to outline requirements, architecture, and roadmaps.",
    duration_minutes: 45,
    price: 120,
    is_active: true,
    category: "Consulting",
  },
  {
    id: "srv-2",
    name: "Full Health & Wellness Check",
    description: "Comprehensive appointment assessment and personalized lifestyle guidance.",
    duration_minutes: 60,
    price: 150,
    is_active: true,
    category: "Wellness",
  },
  {
    id: "srv-3",
    name: "Standard Check-in",
    description: "Quick follow-up review on progress, adjustments, and questions.",
    duration_minutes: 30,
    price: 65,
    is_active: true,
    category: "Follow-up",
  },
  {
    id: "srv-4",
    name: "Deep Dive Session",
    description: "Extended working session focusing on implementation details and review.",
    duration_minutes: 90,
    price: 220,
    is_active: true,
    category: "Consulting",
  },
];

export const INITIAL_BUSINESS_HOURS: BusinessHours[] = [
  { day_of_week: 0, open_time: "10:00", close_time: "14:00", is_closed: true },  // Sunday: Closed
  { day_of_week: 1, open_time: "09:00", close_time: "17:00", is_closed: false }, // Monday
  { day_of_week: 2, open_time: "09:00", close_time: "17:00", is_closed: false }, // Tuesday
  { day_of_week: 3, open_time: "09:00", close_time: "17:00", is_closed: false }, // Wednesday
  { day_of_week: 4, open_time: "09:00", close_time: "17:00", is_closed: false }, // Thursday
  { day_of_week: 5, open_time: "09:00", close_time: "16:00", is_closed: false }, // Friday
  { day_of_week: 6, open_time: "10:00", close_time: "15:00", is_closed: false }, // Saturday
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-1",
    booking_reference: "BK-8F3K9A",
    service_id: "srv-1",
    service: INITIAL_SERVICES[0],
    customer_name: "Sarah Jenkins",
    customer_email: "sarah.j@example.com",
    customer_phone: "+1 (555) 234-5678",
    appointment_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    start_time: "10:00",
    end_time: "10:45",
    status: "confirmed",
    notes: "Interested in discussing Q4 roadmap expansion.",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "apt-2",
    booking_reference: "BK-2M7P4Q",
    service_id: "srv-2",
    service: INITIAL_SERVICES[1],
    customer_name: "Michael Chen",
    customer_email: "mchen@example.com",
    customer_phone: "+1 (555) 987-6543",
    appointment_date: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    start_time: "14:00",
    end_time: "15:00",
    status: "pending",
    notes: "First time booking.",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "apt-3",
    booking_reference: "BK-9X4L1V",
    service_id: "srv-3",
    service: INITIAL_SERVICES[2],
    customer_name: "Elena Rostova",
    customer_email: "elena.rostova@example.com",
    customer_phone: "+1 (555) 432-1098",
    appointment_date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    start_time: "11:30",
    end_time: "12:00",
    status: "completed",
    notes: "Regular monthly check-in.",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

