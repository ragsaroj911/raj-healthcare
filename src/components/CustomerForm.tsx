"use client";

import React from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader2, ArrowRight } from "lucide-react";

interface CustomerFormProps {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  isValid: boolean;
}

export function CustomerForm({
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  notes,
  setNotes,
  onSubmit,
  loading,
  isValid,
}: CustomerFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-slate-900">3. Your Information</h3>
        <p className="text-xs text-slate-500">
          Enter your contact details so we can send your confirmation and reminders.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            required
            placeholder="e.g. Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              required
              placeholder="e.g. yourname@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="block text-[11px] text-emerald-600 mt-1">
              ✓ Confirmation voucher & calendar invite will be sent to this email.
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Phone Number <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <Input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Special Requests or Notes <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <Textarea
            rows={3}
            placeholder="Anything you'd like us to know before the appointment..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={!isValid || loading}
        size="lg"
        className="w-full gap-2 mt-4"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Scheduling Your Appointment...
          </>
        ) : (
          <>
            Confirm Booking
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}

