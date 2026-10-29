import { Service, BusinessHours, Appointment, PortalUser } from "../types";
import { INITIAL_SERVICES, INITIAL_BUSINESS_HOURS, INITIAL_APPOINTMENTS } from "./initial-data";
import { createServerSupabaseClient } from "../supabase/server";

export const INITIAL_USERS: PortalUser[] = [
  {
    id: "usr-admin-1",
    email: "ragsaroj911@gmail.com",
    name: "Admin Vikram",
    role: "admin",
    password_hash: "ee5c69eb5e891b67dfe8e3e18715966bf58673a89320929c801137e59c6373d7", // Vikram@3000
    created_at: new Date().toISOString(),
  },
];

// Fallback in-memory singleton for development or when Supabase keys aren't set
class InMemoryStore {
  services: Service[] = [...INITIAL_SERVICES];
  businessHours: BusinessHours[] = [...INITIAL_BUSINESS_HOURS];
  appointments: Appointment[] = [...INITIAL_APPOINTMENTS];
  users: PortalUser[] = [...INITIAL_USERS];

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

  getUsers(): PortalUser[] {
    return this.users;
  }

  findUserByEmail(email: string): PortalUser | null {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  addUser(user: Omit<PortalUser, "id">): PortalUser {
    const newUser: PortalUser = {
      ...user,
      id: `usr-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.users.unshift(newUser);
    return newUser;
  }
}

// Global singleton across hot reloads in development
const globalStore = global as unknown as { __app_store?: InMemoryStore };
if (!globalStore.__app_store || typeof globalStore.__app_store.findUserByEmail !== "function") {
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

export async function getPortalUsersData(): Promise<PortalUser[]> {
  const supabase = createServerSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("portal_users")
      .select("id, email, name, role, created_at")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return data as PortalUser[];
    }
  }
  return inMemoryStore.getUsers().map(({ password_hash, ...u }) => u as PortalUser);
}

export async function findPortalUserByEmail(email: string): Promise<PortalUser | null> {
  const supabase = createServerSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("portal_users")
      .select("*")
      .eq("email", email.toLowerCase())
      .single();

    if (!error && data) {
      return data as PortalUser;
    }
  }
  return inMemoryStore.findUserByEmail(email);
}
