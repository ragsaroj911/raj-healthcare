# AuraBook — Modern Appointment Booking System

A modern, minimalist, and responsive Appointment Booking System crafted with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, **Supabase**, and **Resend**. Ready for instantaneous deployment on **Vercel** with GitHub integration and custom domains.

---

## ✨ Features

### 👤 Customer Experience
- **Interactive Service Catalog**: Browse service offerings with clear pricing, duration indicators, and category tags.
- **Dynamic Slot Availability**: 14-day interactive calendar with real-time slot generation that prevents double bookings.
- **Frictionless Booking Form**: Clean form with instant field validation for name, email, phone, and optional notes.
- **Booking Overview & Confirmation**: Real-time sticky summary card on desktop, collapsible on mobile.
- **Confirmation Page**:
  - Unique booking reference code (e.g. `BK-8F3K9A`).
  - One-click **Add to Google Calendar**.
  - Service, timing, and customer details.

### 🛡️ Admin Dashboard (`/admin`)
- **Key Metrics Overview**: Real-time counters for Total Bookings, Pending Review, Confirmed, and Projected Revenue.
- **Appointment Management**:
  - Table and mobile-friendly card views.
  - Search by customer name, email, or booking reference.
  - Status filters (`All`, `Pending`, `Confirmed`, `Completed`, `Cancelled`).
  - 1-click status actions (**Confirm**, **Complete**, **Cancel**).
- **Service Management (`/admin/services`)**:
  - Add new services (name, description, duration in minutes, price, category).
  - View active and archived services.
- **Operating Hours & Availability (`/admin/settings`)**:
  - Configure open/close times for each day of the week.
  - Mark specific days as closed.
- **Flexible Authentication**:
  - Integrated Supabase Auth (`signInWithPassword`).
  - Seamless 1-click Demo mode for local testing before connecting database keys.

### ✉️ Resend Email Notifications
- **Customer Confirmation Email**: Sends beautiful, mobile-optimized HTML confirmation emails upon booking.
- **Admin Notification Email**: Alerts the business owner whenever a new customer books an appointment.
- **Fail-safe Mode**: Automatically logs simulated emails in development if `RESEND_API_KEY` is not yet configured.

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

## 🚀 Quick Start (Local Development)

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd Raj_saroj
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
- **Customer Booking**: [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Admin Login**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login) *(Click "Quick Demo Access" to test immediately!)*

---

## 🗄️ Supabase Setup & Database Schema

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free project.
2. In your Supabase Dashboard, navigate to **Project Settings** > **API**.
3. Copy:
   - `Project URL` &rarr; `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` &rarr; `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` &rarr; `SUPABASE_SERVICE_ROLE_KEY`

### 2. Run Database Migration & RLS Policies
Navigate to the **SQL Editor** in your Supabase Dashboard and run the contents of [`supabase/schema.sql`](supabase/schema.sql).

This automatically creates:
- `public.services`
- `public.business_hours`
- `public.appointments`
- Performance indexes on dates and booking references
- **Row Level Security (RLS)** policies ensuring:
  - The public can only read active services and business hours.
  - The public can insert new appointments.
  - Authenticated admins have full CRUD access.
- Seed data for default services and standard business hours (Mon-Sat).

---

## 📧 Resend Email Integration

1. Create a free account at [resend.com](https://resend.com).
2. Generate an API Key under **API Keys** and set `RESEND_API_KEY="re_..."`.
3. Set your sender email:
   - For testing: `RESEND_FROM_EMAIL="onboarding@resend.dev"`
   - For production: Verify your custom domain in Resend and set `RESEND_FROM_EMAIL="Bookings <appointments@yourdomain.com>"`.
4. (Optional) Set `ADMIN_NOTIFICATION_EMAIL="owner@yourdomain.com"` to receive email alerts on each new booking.

---

## 🌐 Deploy to Vercel & Connect GitHub

### Deploy with Vercel CLI or Web Interface
1. Push your repository to **GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: modern appointment booking system"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new) and import your GitHub repository.
3. Add the Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `ADMIN_NOTIFICATION_EMAIL`
   - `NEXT_PUBLIC_APP_URL` (set to `https://your-project.vercel.app`)
4. Click **Deploy**. Vercel will build and deploy your site in ~45 seconds.

---

## 🏷️ Custom Domain Setup on Vercel

1. In your **Vercel Project Dashboard**, navigate to **Settings** > **Domains**.
2. Enter your custom domain (e.g., `booking.yourdomain.com` or `yourdomain.com`) and click **Add**.
3. Update your DNS records with your registrar (e.g., Cloudflare, GoDaddy, Namecheap):
   - **For apex domain (`yourdomain.com`)**:
     - Type: `A`
     - Name: `@`
     - Value: `76.76.21.21`
   - **For subdomains (`booking.yourdomain.com`)**:
     - Type: `CNAME`
     - Name: `booking`
     - Value: `cname.vercel-dns.com`
4. Vercel will automatically verify DNS propagation and issue a free SSL/TLS certificate.

---

## 🔒 Security Best Practices

- **Row Level Security (RLS)**: PostgreSQL-level policies enforce data boundaries.
- **Server-Side API Validation**: Required fields, appointment collision checks, and sanitization occur on server routes before committing.
- **Environment Isolation**: Private API keys (`RESEND_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) are kept on the server side and never exposed to client bundles.

---

## 📄 License
MIT License. Free to use and customize for commercial or personal projects.
