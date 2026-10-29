-- ============================================================
-- Supabase Schema & Row-Level Security (RLS)
-- Raj Healthcare Appointment Booking & Portal Authentication
-- ============================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Services Table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  category VARCHAR(100) DEFAULT 'General',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Business Hours Table (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
CREATE TABLE IF NOT EXISTS public.business_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INTEGER NOT NULL UNIQUE CHECK (day_of_week BETWEEN 0 AND 6),
  open_time VARCHAR(5) NOT NULL DEFAULT '09:00',
  close_time VARCHAR(5) NOT NULL DEFAULT '17:00',
  is_closed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Appointments Table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference VARCHAR(20) NOT NULL UNIQUE,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  appointment_date DATE NOT NULL,
  start_time VARCHAR(5) NOT NULL,
  end_time VARCHAR(5) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Portal Users Table (Admin & Staff Authentication)
CREATE TABLE IF NOT EXISTS public.portal_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'doctor', 'staff')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create helpful indexes for performance
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_ref ON public.appointments(booking_reference);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_services_active ON public.services(is_active);
CREATE INDEX IF NOT EXISTS idx_portal_users_email ON public.portal_users(email);

-- ============================================================
-- Row Level Security (RLS) Policies
-- ============================================================

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_users ENABLE ROW LEVEL SECURITY;

-- Services Policies:
CREATE POLICY "Public can view active services"
  ON public.services FOR SELECT USING (is_active = true);

CREATE POLICY "Admins full access to services"
  ON public.services FOR ALL USING (true) WITH CHECK (true);

-- Business Hours Policies:
CREATE POLICY "Public can view business hours"
  ON public.business_hours FOR SELECT USING (true);

CREATE POLICY "Admins full access to business hours"
  ON public.business_hours FOR ALL USING (true) WITH CHECK (true);

-- Appointments Policies:
CREATE POLICY "Public can insert appointments"
  ON public.appointments FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can read appointments"
  ON public.appointments FOR SELECT USING (true);

CREATE POLICY "Admins full access to appointments"
  ON public.appointments FOR ALL USING (true) WITH CHECK (true);

-- Portal Users Policies:
CREATE POLICY "Portal users access"
  ON public.portal_users FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- Seed Initial Data
-- ============================================================

-- Seed Business Hours
INSERT INTO public.business_hours (day_of_week, open_time, close_time, is_closed)
VALUES
  (0, '10:00', '14:00', true),  -- Sunday (Closed)
  (1, '09:00', '18:00', false), -- Monday
  (2, '09:00', '18:00', false), -- Tuesday
  (3, '09:00', '18:00', false), -- Wednesday
  (4, '09:00', '18:00', false), -- Thursday
  (5, '09:00', '17:00', false), -- Friday
  (6, '09:30', '15:00', false)  -- Saturday
ON CONFLICT (day_of_week) DO NOTHING;

-- Seed Sample Medical Services for Raj Healthcare
INSERT INTO public.services (name, description, duration_minutes, price, category, is_active)
VALUES
  ('General Physician Consultation', 'Personal consultation with our doctor for acute illnesses, fevers, coughs, health guidance, and preliminary diagnoses.', 30, 499.00, 'Primary Care', true),
  ('Comprehensive Health Assessment', 'Complete physical examination, blood pressure & vitals monitoring, diabetes risk analysis, and lifestyle roadmap.', 60, 1499.00, 'Preventative', true),
  ('Specialist Consultation', 'Focused in-depth clinical consultation for cardiology, chronic metabolic conditions, and internal medicine concerns.', 45, 999.00, 'Specialist Care', true),
  ('Follow-up & Prescription Review', 'Review test results, evaluate treatment progress, and adjust ongoing medical prescriptions with your doctor.', 20, 299.00, 'Follow-up', true)
ON CONFLICT DO NOTHING;

-- Seed Default Admin User: ragsaroj911@gmail.com (Password: Vikram@3000)
INSERT INTO public.portal_users (email, password_hash, name, role)
VALUES
  ('ragsaroj911@gmail.com', 'ee5c69eb5e891b67dfe8e3e18715966bf58673a89320929c801137e59c6373d7', 'Admin Vikram', 'admin')
ON CONFLICT (email) DO NOTHING;
