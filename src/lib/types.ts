export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Service {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  is_active: boolean;
  category?: string;
  created_at?: string;
}

export interface BusinessHours {
  id?: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  open_time: string;   // "09:00"
  close_time: string;  // "17:00"
  is_closed: boolean;
}

export interface Appointment {
  id: string;
  booking_reference: string;
  service_id: string;
  service?: Service;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  appointment_date: string; // YYYY-MM-DD
  start_time: string;       // HH:mm
  end_time: string;         // HH:mm
  status: AppointmentStatus;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface TimeSlot {
  time: string; // HH:mm
  available: boolean;
  reason?: string;
}

export interface BookingFormData {
  serviceId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
}

