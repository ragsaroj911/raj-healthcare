import Link from "next/link";
import { HeartPulse, ShieldCheck, Mail, Phone, Clock, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 text-slate-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-100">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <HeartPulse className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-slate-900">
                Raj <span className="text-emerald-600">Healthcare</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Committed to providing compassionate, accessible, and high-standard primary and specialized outpatient healthcare consultations with zero waiting times.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" /> Patient-First Care
              </span>
              <span>&bull;</span>
              <span>Confidential Health Records</span>
            </div>
          </div>

          {/* Clinic Facilities */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-slate-900 text-sm">Our Facilities</h4>
            <ul className="space-y-1.5 text-slate-500">
              <li>&bull; General Physician & Family Care</li>
              <li>&bull; Diagnostic & Health Screening</li>
              <li>&bull; Chronic Care & Follow-ups</li>
              <li>&bull; Digital Prescriptions</li>
            </ul>
          </div>

          {/* Working Hours */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-slate-900 text-sm">Clinic Timings</h4>
            <p className="text-slate-500 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-slate-400" /> Mon - Sat: 9:00 AM - 6:00 PM
            </p>
            <p className="text-slate-500">Sunday: Closed / Emergency Care</p>
            <div className="pt-2">
              <Link href="/admin/login" className="text-[11px] text-slate-400 hover:text-slate-700 underline">
                Staff & Doctor Portal
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} Raj Healthcare. All medical rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/#privacy" className="hover:text-slate-600 transition-colors">
              Data Storage & Privacy Policy
            </Link>
            <span>&bull;</span>
            <Link href="/#facilities" className="hover:text-slate-600 transition-colors">
              Facilities
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
