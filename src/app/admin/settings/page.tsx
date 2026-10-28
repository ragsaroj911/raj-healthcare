"use client";

import React, { useState, useEffect } from "react";
import { BusinessHours } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock, Save, Loader2, CheckCircle2 } from "lucide-react";

const DAYS_MAP = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function AdminSettingsPage() {
  const [hours, setHours] = useState<BusinessHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.businessHours) {
          // Sort by day_of_week starting from Monday (1..6, 0)
          const sorted = [...data.businessHours].sort((a, b) => {
            const dayA = a.day_of_week === 0 ? 7 : a.day_of_week;
            const dayB = b.day_of_week === 0 ? 7 : b.day_of_week;
            return dayA - dayB;
          });
          setHours(sorted);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (index: number, field: keyof BusinessHours, value: any) => {
    setHours((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg("");

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessHours: hours }),
      });

      if (res.ok) {
        setSuccessMsg("Operating hours updated successfully!");
        setTimeout(() => setSuccessMsg(""), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Operating Hours & Availability</h1>
          <p className="text-xs text-slate-500 mt-1">
            Define your weekly open hours to control available slots for customer bookings.
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving || loading}
          size="sm"
          className="gap-2 text-xs self-start sm:self-auto"
        >
          {saving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          Save Changes
        </Button>
      </div>

      {successMsg && (
        <div className="mb-6 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          {successMsg}
        </div>
      )}

      <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {hours.map((item, index) => {
              const dayName = DAYS_MAP[item.day_of_week];
              return (
                <div
                  key={item.day_of_week}
                  className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="w-32">
                    <span className="font-semibold text-sm text-slate-900">{dayName}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.is_closed}
                        onChange={(e) =>
                          handleChange(index, "is_closed", e.target.checked)
                        }
                        className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                      />
                      <span>Closed</span>
                    </label>

                    {!item.is_closed ? (
                      <div className="flex items-center gap-2 text-xs text-slate-700">
                        <Input
                          type="time"
                          value={item.open_time}
                          onChange={(e) =>
                            handleChange(index, "open_time", e.target.value)
                          }
                          className="h-8 w-28 text-xs text-center"
                        />
                        <span className="text-slate-400">to</span>
                        <Input
                          type="time"
                          value={item.close_time}
                          onChange={(e) =>
                            handleChange(index, "close_time", e.target.value)
                          }
                          className="h-8 w-28 text-xs text-center"
                        />
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No appointments accepted</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

