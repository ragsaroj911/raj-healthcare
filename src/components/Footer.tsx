import Link from "next/link";
import { Calendar, Heart, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10 text-slate-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-700" />
          <span className="text-sm font-semibold text-slate-800">AuraBook</span>
          <span className="text-xs text-slate-400">| Modern Appointment Booking</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            Supabase Protected
          </span>
          <span>•</span>
          <span>Resend Notifications</span>
          <span>•</span>
          <span>Vercel Edge Ready</span>
        </div>

        <div className="text-xs text-slate-400">
          &copy; {new Date().getFullYear()} AuraBook. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

