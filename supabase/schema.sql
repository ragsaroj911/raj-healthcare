-- ============================================================
-- Supabase Schema & Row-Level Security (RLS)
-- Modern Minimalist Appointment Booking System
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
  customer_phone VARCHAR(50) NOT NULL,
  appointment_date DATE NOT NULL,
  start_time VARCHAR(5) NOT NULL,
  end_time VARCHAR(5) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create helpful indexes for performance
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_ref ON public.appointments(booking_reference);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_services_active ON public.services(is_active);

-- ============================================================
-- Row Level Security (RLS) Policies
-- ============================================================

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Services Policies:
-- Anyone (anonymous & authenticated) can view active services
CREATE POLICY "Public can view active services"
  ON public.services
  FOR SELECT
  USING (is_active = true);

-- Authenticated admins can view all, insert, update, delete services
CREATE POLICY "Admins full access to services"
  ON public.services
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Business Hours Policies:
-- Anyone can view business hours to calculate slots
CREATE POLICY "Public can view business hours"
  ON public.business_hours
  FOR SELECT
  USING (true);

-- Authenticated admins can manage business hours
CREATE POLICY "Admins full access to business hours"
  ON public.business_hours
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Appointments Policies:
-- Anyone can create a new booking
CREATE POLICY "Public can insert appointments"
  ON public.appointments
  FOR INSERT
  WITH CHECK (true);

-- Anyone can check booked times for slot availability or view by booking reference
CREATE POLICY "Public can read appointment times and references"
  ON public.appointments
  FOR SELECT
  USING (true);

-- Authenticated admins can manage all appointments (update status, delete, etc.)
CREATE POLICY "Admins full access to appointments"
  ON public.appointments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- Seed Initial Data
-- ============================================================

-- Seed Business Hours
INSERT INTO public.business_hours (day_of_week, open_time, close_time, is_closed)
VALUES
  (0, '10:00', '14:00', true),  -- Sunday (Closed)
  (1, '09:00', '17:00', false), -- Monday
  (2, '09:00', '17:00', false), -- Tuesday
  (3, '09:00', '17:00', false), -- Wednesday
  (4, '09:00', '17:00', false), -- Thursday
  (5, '09:00', '16:00', false), -- Friday
  (6, '10:00', '15:00', false)  -- Saturday
ON CONFLICT (day_of_week) DO NOTHING;

-- Seed Sample Services
INSERT INTO public.services (name, description, duration_minutes, price, category, is_active)
VALUES
  ('Strategy & Consultation', 'One-on-one discovery session to outline requirements, architecture, and roadmaps.', 45, 120.00, 'Consulting', true),
  ('Full Health & Wellness Check', 'Comprehensive appointment assessment and personalized lifestyle guidance.', 60, 150.00, 'Wellness', true),
  ('Standard Check-in', 'Quick follow-up review on progress, adjustments, and questions.', 30, 65.00, 'Follow-up', true),
  ('Deep Dive Session', 'Extended working session focusing on implementation details and review.', 90, 220.00, 'Consulting', true)
ON CONFLICT DO NOTHING;

