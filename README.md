# Raj Healthcare — Modern Clinic & Doctor Appointment Booking System

A modern, minimalist, and responsive Doctor Appointment Booking & Management System for **Raj Healthcare**, crafted with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, **Supabase**, and **Resend**. Ready for deployment on **Vercel** with GitHub integration and custom domains.

---

## 🔒 Mandatory Portal Authentication & Access Gate

The entire application is protected behind a secure session gate (`src/middleware.ts`). **Without logging in, users cannot access the website or administrative functions.**

- Any unauthenticated request to `/` or `/admin` is automatically redirected to the secure login portal: [`/login`](http://localhost:3000/login).
- **Privacy & Security**: To maintain maximum confidentiality, the login screen and home screen do **not** display or prefill any credentials or emails.

### 🔑 Primary Admin Credentials
| Field | Value |
|---|---|
| **Portal URL** | [http://localhost:3000/login](http://localhost:3000/login) |
| **Admin Email** | `ragsaroj911@gmail.com` |
| **Admin Password** | `Vikram@3000` |
| **Role** | `admin` (Full permissions) |

---

## 👥 Admin-Exclusive Feature: Add More Users & Staff

Once logged in with the primary Admin account (`ragsaroj911@gmail.com`), the Admin receives an exclusive **"Add Staff"** button in the top navigation bar linking to:
👉 **`/admin/users`** (Staff & Portal User Management)

### Capabilities:
- **Create New Portal Accounts**: Add doctors, receptionists, or clinic staff with their Name, Login Email, and Password.
- **Assign Roles**:
  - `admin`: Full privileges, system settings, and user management.
  - `doctor`: Consultation views, appointment schedule, patient notes.
  - `staff`: Front-desk appointments, check-ins, and schedule coordination.
- **Database Storage**: User credentials and SHA-256 hashed passwords are saved securely to Supabase in `public.portal_users`.
- **Access Restriction**: Non-admin users who log in can view appointments and manage bookings, but are strictly blocked (`403 Forbidden`) from creating or managing user logins.
- **One-Click Logout**: Available in the top-right header for immediate session termination.

---

## ✨ System Features

### 👤 Patient Experience (Authenticated)
- **Medical Consultation Catalog**: General Physician (₹499), Specialist Care (₹999), Comprehensive Health Check (₹1,499), Follow-up (₹299).
- **Dynamic Slot Availability**: 14-day interactive calendar with conflict prevention against booked appointments.
- **Frictionless Booking Form**: Clean form requiring only Name and Email (Phone number is optional).
- **Immediate Confirmation Pass**:
  - Unique booking reference code (e.g. `RH-8F3K9A`).
  - One-click **Add to Google Calendar** with pre-filled clinic visit notes.
  - Transparent checklist for clinic visit.

### 🛡️ Clinic Management Dashboard (`/admin`)
- **Key Metrics Overview**: Real-time counters for Total Bookings, Pending Review, Confirmed, and Projected Revenue (₹ INR).
- **Appointment Management**:
  - Live search by patient name, email, or reference code.
  - Status filters (`All`, `Pending`, `Confirmed`, `Completed`, `Cancelled`).
  - 1-click status actions (**Confirm**, **Complete**, **Cancel**).
- **Service Management (`/admin/services`)**:
  - Add new medical services, session durations, and consultation fees in ₹ INR.
- **Operating Hours & Availability (`/admin/settings`)**:
  - Configure open/close times and days off per week.
- **Top-Right Navigation**: Dedicated **"Back"** button and **"Logout"** button on every page.

### ✉️ Resend Email Integration
- **Patient Confirmation Email**: Sends mobile-optimized HTML passes with appointment details and calendar invites.
- **Admin Notification Email**: Alerts the clinic administrator upon each new appointment booking.
- **Verified Resend SDK**: Integrated with your production Resend API key.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS & Lucide Icons |
| **Components** | shadcn/ui architectural primitives |
| **Database & Auth** | Supabase (PostgreSQL with Row Level Security) |
| **Transactional Email** | Resend SDK (`resend`) |
| **Deployment** | Vercel (Edge-ready) & GitHub |

---

## 🗄️ Supabase Setup & Database Migration

Your Supabase project URL is connected:
`https://bmqxgkjjjyzqjusdndht.supabase.co`

### Running the Database Migration:
1. Open the Supabase SQL Editor:  
   👉 **[https://supabase.com/dashboard/project/bmqxgkjjjyzqjusdndht/sql/new](https://supabase.com/dashboard/project/bmqxgkjjjyzqjusdndht/sql/new)**
2. Copy and paste the contents of [`supabase/schema.sql`](supabase/schema.sql).
3. Click **"Run"**.

This automatically creates:
- `public.portal_users` (with seeded Admin `ragsaroj911@gmail.com`)
- `public.services` (with Indian Rupee consultation services)
- `public.business_hours` (Monday - Saturday clinic timings)
- `public.appointments` (Patient bookings with reference codes)
- Row Level Security (RLS) policies protecting clinic data.

---

## 🌐 Deploy to Vercel & Connect Custom Domain

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add portal authentication and staff user management"
   git remote add origin https://github.com/<your-username>/raj-healthcare.git
   git branch -M main
   git push -u origin main
   ```
2. **Deploy on Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new) and import your repository.
   - Under **Environment Variables**, paste:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=https://bmqxgkjjjyzqjusdndht.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtcXhna2pqanl6cWp1c2RuZGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyMjgxNjcsImV4cCI6MjEwODgwNDE2N30.9hBKVhLxDekK5JPK4qcN-EFCiEegq1oFVcA7bTM8byI
     SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtcXhna2pqanl6cWp1c2RuZGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyMjgxNjcsImV4cCI6MjEwODgwNDE2N30.9hBKVhLxDekK5JPK4qcN-EFCiEegq1oFVcA7bTM8byI
     RESEND_API_KEY=your_resend_api_key_here
     RESEND_FROM_EMAIL=Raj Healthcare <onboarding@resend.dev>
     NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
     ```
   - Click **Deploy**.
3. **Custom Domain on Vercel**:
   - In Vercel Project Settings &rarr; **Domains**, enter your domain (e.g. `rajhealthcare.com` or `clinic.yourdomain.com`).
   - Add the `CNAME` or `A` record provided by Vercel in your domain registrar. Vercel automatically activates free SSL.

---

## 📄 License
MIT License. Raj Healthcare.
