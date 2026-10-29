"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Shield, HeartPulse, ArrowLeft, LogOut, Users, User } from "lucide-react";
import { Button } from "./ui/button";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = pathname.startsWith("/admin");

  const [currentUser, setCurrentUser] = useState<{ email: string; role: string; name: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data?.authenticated && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1 && pathname !== "/") {
      router.back();
    } else {
      router.push("/");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch (err) {
      window.location.href = "/login";
    }
  };

  const isUserAdmin = currentUser?.role === "admin" || currentUser?.email === "ragsaroj911@gmail.com";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm transition-transform group-hover:scale-105">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold tracking-tight text-slate-900 text-base sm:text-lg flex items-center gap-1">
              Raj <span className="text-emerald-600">Healthcare</span>
            </span>
            <span className="hidden sm:inline-block text-[11px] text-slate-500 font-normal">
              Clinic & Consultation Services
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-2.5">
          {!isAdmin ? (
            <>
              <Link href="/#services" className="text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1.5 transition-colors hidden md:inline-flex">
                Treatments
              </Link>
              <Link href="/#facilities" className="hidden md:inline-flex text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1.5 transition-colors">
                Facilities
              </Link>
              <Link href="/#booking">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5">
                  Book Visit
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Shield className="h-3.5 w-3.5 text-slate-600" />
                  Staff
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
                <Button variant={pathname === "/admin/services" ? "secondary" : "ghost"} size="sm" className="text-xs hidden sm:inline-flex">
                  Services
                </Button>
              </Link>
              <Link href="/admin/settings">
                <Button variant={pathname === "/admin/settings" ? "secondary" : "ghost"} size="sm" className="text-xs hidden sm:inline-flex">
                  Hours
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm" className="text-xs">
                  Patient View
                </Button>
              </Link>
            </>
          )}

          {/* Admin User Management Button */}
          {isUserAdmin && (
            <Link href="/admin/users">
              <Button
                variant={pathname === "/admin/users" ? "default" : "secondary"}
                size="sm"
                className="gap-1.5 text-xs bg-slate-900 text-white hover:bg-slate-800"
                title="Manage Staff & Login Accounts"
              >
                <Users className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Add Staff</span>
              </Button>
            </Link>
          )}

          {/* Top Right Back Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="gap-1 text-xs text-slate-700 hover:text-slate-900 border-slate-300 hover:bg-slate-100 shadow-xs"
            title="Go to previous page"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-slate-600" />
            <span className="hidden sm:inline">Back</span>
          </Button>

          {/* Logout Button */}
          {currentUser && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Sign Out of Portal"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
