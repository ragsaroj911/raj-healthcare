# 🏥 Raj Healthcare — Modern Clinic & Doctor Appointment Booking System

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase)
![Resend](https://img.shields.io/badge/Resend-Email%20API-black?style=for-the-badge&logo=resend)
![Vercel](https://img.shields.io/badge/Vercel-Deployment%20Ready-black?style=for-the-badge&logo=vercel)

<p align="center">
  A modern, minimalist, and responsive Doctor Appointment Booking & Management System designed for clinics and healthcare providers. Features end-to-end patient scheduling, real-time doctor availability, role-based staff authentication, automated email vouchers via Resend, and secure PostgreSQL storage with Supabase.
</p>

</div>

---

## 🌟 Key Highlights

- **🔒 Protected Clinic Portal**: Complete site access is secured by Next.js Edge Middleware. Unauthenticated visits are safely redirected to the sign-in portal.
- **⚡ 3-Step Streamlined Booking**: Patients select a medical consultation, choose a 30-minute verified slot, enter contact details, and receive an instant booking pass.
- **✉️ Automated Email Confirmations**: Professional HTML appointment passes and 1-click Google/Apple Calendar links dispatched via Resend.
- **👥 Role-Based User Management**: Primary administrator dashboard with dedicated interface for creating and managing doctor and staff logins.
- **🇮🇳 Indian Rupee (₹ INR) Formatting**: Standardized medical consultation fees (Primary care, preventative screening, and specialist evaluations).
- **🛡️ Data Privacy by Design**: Only essential patient contact info is retained; protected by PostgreSQL Row-Level Security (RLS) policies.

---

## 📸 Architecture & Modules

```
raj-healthcare/
├── src/
│   ├── app/
│   │   ├── page.tsx               # Patient consultation showcase & booking flow
│   │   ├── login/page.tsx         # Unified portal sign-in gateway
│   │   ├── confirmation/[id]/     # Interactive appointment voucher & calendar sync
│   │   ├── admin/
│   │   │   ├── page.tsx           # Clinic appointments dashboard & status actions
│   │   │   ├── services/page.tsx  # Consultation fee & service editor
│   │   │   ├── settings/page.tsx  # Weekly clinic operating hours & availability
│   │   │   └── users/page.tsx     # Admin-only staff & user credential management
│   │   └── api/                   # RESTful route handlers for bookings & auth
│   ├── components/                # Modular UI primitives (shadcn/ui & Tailwind)
│   ├── lib/                       # Supabase client, Resend templates, data store
│   └── middleware.ts              # Edge protection gatekeeper
└── supabase/
    └── schema.sql                 # DDL, indexes, seed data, and RLS policies
```

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install
```bash
git clone https://github.com/ragsaroj911/raj-healthcare.git
cd raj-healthcare
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your service credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

RESEND_API_KEY="re_your_resend_api_key"
RESEND_FROM_EMAIL="Raj Healthcare <onboarding@resend.dev>"
ADMIN_NOTIFICATION_EMAIL="admin@yourdomain.com"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔐 Authentication & Role Management

The portal features a dual-layer role-based permission structure:

| Role | Access Permissions |
|---|---|
| **Admin** | Full system control: view/edit all appointments, modify consultation fees, change clinic hours, and **create/manage staff accounts**. |
| **Doctor** | View daily schedule, update patient consultation statuses (Confirm, Complete, Cancel), and review medical symptoms. |
| **Staff** | Front-desk scheduling, customer registration, and check-in confirmation. |

> [!NOTE]
> For confidentiality, the sign-in form does not expose or pre-populate credentials. All authentication sessions are signed via secure HTTP cookies.

---

## 🗄️ Database Setup & Row-Level Security

The system uses Supabase (PostgreSQL) with granular Row-Level Security (RLS) to safeguard records.

### Applying the Schema:
1. Open your Supabase project's **SQL Editor**.
2. Run the provided script: [`supabase/schema.sql`](supabase/schema.sql).
3. The migration will initialize:
   - `public.portal_users`: Hashed staff credentials and assigned clinic roles.
   - `public.services`: Active medical consultations and duration parameters.
   - `public.business_hours`: Clinic operating hours per weekday.
   - `public.appointments`: Booked time slots, patient references, and status tracking.

---

## 🌐 Deploy to Vercel

This repository is optimized for one-click deployment on **Vercel**:

1. Push your changes to GitHub:
   ```bash
   git push origin main
   ```
2. Import the repository in [vercel.com/new](https://vercel.com/new).
3. Add the environment variables specified in `.env.example`.
4. Click **Deploy**. Vercel will build and provision an SSL-secured production instance.

### Custom Domain Configuration:
In your Vercel Project Dashboard:
- Navigate to **Settings** &rarr; **Domains**.
- Add your domain (e.g. `clinic.yourdomain.com`).
- Add the corresponding `CNAME` or `A` record in your DNS provider.

---

## 📄 License
This project is licensed under the MIT License.
