"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Shield, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

export function Navbar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm transition-transform group-hover:scale-105">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <span className="font-semibold tracking-tight text-slate-900 text-base">
              Aura<span className="text-slate-400">Book</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs text-slate-500 font-normal">
              Appointment System
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          {!isAdmin ? (
            <>
              <Link href="/#services" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 transition-colors">
                Services
              </Link>
              <Link href="/#booking" className="hidden sm:inline-flex text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 transition-colors">
                Book Online
              </Link>
              <Link href="/admin">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Shield className="h-3.5 w-3.5" />
                  Admin
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/admin">
                <Button variant={pathname === "/admin" ? "secondary" : "ghost"} size="sm" className="text-xs">
                  Appointments
                </Button>
              </Link>
              <Link href="/admin/services">
                <Button variant={pathname === "/admin/services" ? "secondary" : "ghost"} size="sm" className="text-xs">
                  Services
                </Button>
              </Link>
              <Link href="/admin/settings">
                <Button variant={pathname === "/admin/settings" ? "secondary" : "ghost"} size="sm" className="text-xs">
                  Availability
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm" className="text-xs">
                  Customer View
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

