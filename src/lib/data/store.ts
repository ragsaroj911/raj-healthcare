import { Service, BusinessHours, Appointment } from "../types";
import { INITIAL_SERVICES, INITIAL_BUSINESS_HOURS, INITIAL_APPOINTMENTS } from "./initial-data";
import { createServerSupabaseClient } from "../supabase/server";

// Fallback in-memory singleton for development or when Supabase keys aren't set
class InMemoryStore {
  services: Service[] = [...INITIAL_SERVICES];
  businessHours: BusinessHours[] = [...INITIAL_BUSINESS_HOURS];
  appointments: Appointment[] = [...INITIAL_APPOINTMENTS];

  getServices(): Service[] {
    return this.services;
  }

  addService(service: Omit<Service, "id">): Service {
    const newService: Service = {
      ...service,
      id: `srv-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.services.unshift(newService);
    return newService;
  }

  updateService(id: string, updates: Partial<Service>): Service | null {
    const idx = this.services.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.services[idx] = { ...this.services[idx], ...updates };
    return this.services[idx];
  }

  getBusinessHours(): BusinessHours[] {
    return this.businessHours;
  }

  updateBusinessHours(hours: BusinessHours[]): BusinessHours[] {
    this.businessHours = [...hours];
    return this.businessHours;
  }

  getAppointments(): Appointment[] {
    return this.appointments;
  }

  getAppointmentByReference(reference: string): Appointment | null {
    return this.appointments.find((a) => a.booking_reference === reference) || null;
  }

  addAppointment(appointment: Omit<Appointment, "id">): Appointment {
    const service = this.services.find((s) => s.id === appointment.service_id);
    const newAppointment: Appointment = {
      ...appointment,
      id: `apt-${Date.now()}`,
      service: service || appointment.service,
      created_at: new Date().toISOString(),
    };
    this.appointments.unshift(newAppointment);
    return newAppointment;
  }

  updateAppointmentStatus(id: string, status: Appointment["status"]): Appointment | null {
    const idx = this.appointments.findIndex((a) => a.id === id || a.booking_reference === id);
    if (idx === -1) return null;
    this.appointments[idx] = {
      ...this.appointments[idx],
      status,
      updated_at: new Date().toISOString(),
    };
    return this.appointments[idx];
  }
}

// Global singleton across hot reloads in development
const globalStore = global as unknown as { __app_store?: InMemoryStore };
if (!globalStore.__app_store) {
  globalStore.__app_store = new InMemoryStore();
}

export const inMemoryStore = globalStore.__app_store;

// Hybrid Data Layer: Uses Supabase when configured, falls back to in-memory store
export async function getServicesData(): Promise<Service[]> {
  const supabase = createServerSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return data;
    }
  }
  return inMemoryStore.getServices();
}

export async function getBusinessHoursData(): Promise<BusinessHours[]> {
  const supabase = createServerSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("business_hours")
      .select("*")
      .order("day_of_week", { ascending: true });

    if (!error && data && data.length > 0) {
      return data;
    }
  }
  return inMemoryStore.getBusinessHours();
}

export async function getAppointmentsData(): Promise<Appointment[]> {
  const supabase = createServerSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("appointments")
      .select("*, service:services(*)")
      .order("appointment_date", { ascending: false });

    if (!error && data) {
      return data;
    }
  }
  return inMemoryStore.getAppointments();
}

