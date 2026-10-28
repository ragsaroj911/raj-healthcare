"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Appointment, AppointmentStatus } from "@/lib/types";
import { formatCurrency, formatDuration, formatTime12h } from "@/lib/utils";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Search,
  CheckCircle,
  XCircle,
  Check,
  RefreshCw,
  Users,
  AlertCircle,
  Filter,
} from "lucide-react";
import { format, parseISO } from "date-fns";

export default function AdminDashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/appointments");
      const data = await res.json();
      if (data.appointments) {
        setAppointments(data.appointments);
      }
    } catch (err) {
      console.error("Failed to load appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: AppointmentStatus) => {
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setAppointments((prev) =>
          prev.map((apt) =>
            apt.id === id || apt.booking_reference === id
              ? { ...apt, status: newStatus }
              : apt
          )
        );
      }
    } catch (err) {
      console.error("Error updating appointment status:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Metrics calculation
  const metrics = useMemo(() => {
    const total = appointments.length;
    const pending = appointments.filter((a) => a.status === "pending").length;
    const confirmed = appointments.filter((a) => a.status === "confirmed").length;
    const completed = appointments.filter((a) => a.status === "completed").length;
    const totalRevenue = appointments
      .filter((a) => a.status !== "cancelled")
      .reduce((acc, curr) => acc + (curr.service?.price || 0), 0);

    return { total, pending, confirmed, completed, totalRevenue };
  }, [appointments]);

  // Filtered appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const matchesStatus =
        statusFilter === "all" || apt.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        apt.customer_name.toLowerCase().includes(q) ||
        apt.customer_email.toLowerCase().includes(q) ||
        apt.booking_reference.toLowerCase().includes(q) ||
        (apt.service?.name && apt.service.name.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [appointments, statusFilter, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Appointments Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your schedule, confirm customer bookings, and track appointment statuses.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchAppointments}
          disabled={loading}
          className="gap-2 text-xs self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 bg-white border-slate-200">
          <span className="text-xs text-slate-500 font-medium">Total Bookings</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{metrics.total}</div>
        </Card>

        <Card className="p-4 bg-white border-slate-200">
          <span className="text-xs text-amber-600 font-medium">Pending Review</span>
          <div className="text-2xl font-bold text-amber-700 mt-1">{metrics.pending}</div>
        </Card>

        <Card className="p-4 bg-white border-slate-200">
          <span className="text-xs text-emerald-600 font-medium">Confirmed</span>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{metrics.confirmed}</div>
        </Card>

        <Card className="p-4 bg-white border-slate-200">
          <span className="text-xs text-slate-500 font-medium">Projected Revenue</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {formatCurrency(metrics.totalRevenue)}
          </div>
        </Card>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6">
        {/* Status filter tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
          {["all", "pending", "confirmed", "completed", "cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors shrink-0 ${
                statusFilter === st
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by name, ref, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
      </div>

      {/* Appointments List / Table */}
      <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-slate-300" />
            Loading appointments...
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            <AlertCircle className="h-6 w-6 mx-auto mb-2 text-slate-400" />
            No appointments found matching current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Schedule</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.map((apt) => {
                  const isActioning = actionLoadingId === apt.id;
                  return (
                    <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {apt.booking_reference}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{apt.customer_name}</div>
                        <div className="text-[11px] text-slate-500">{apt.customer_email}</div>
                        <div className="text-[11px] text-slate-400">{apt.customer_phone}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">
                          {apt.service?.name || "Standard Session"}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {apt.service?.duration_minutes
                            ? formatDuration(apt.service.duration_minutes)
                            : ""}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">
                          {apt.appointment_date}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {formatTime12h(apt.start_time)} - {formatTime12h(apt.end_time)}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={apt.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {apt.status === "pending" && (
                            <Button
                              size="sm"
                              variant="default"
                              disabled={isActioning}
                              onClick={() => handleUpdateStatus(apt.id, "confirmed")}
                              className="h-7 px-2.5 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Confirm
                            </Button>
                          )}

                          {apt.status === "confirmed" && (
                            <Button
                              size="sm"
                              variant="secondary"
                              disabled={isActioning}
                              onClick={() => handleUpdateStatus(apt.id, "completed")}
                              className="h-7 px-2.5 text-[11px]"
                            >
                              <CheckCircle className="h-3 w-3 mr-1 text-slate-600" />
                              Complete
                            </Button>
                          )}

                          {apt.status !== "cancelled" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={isActioning}
                              onClick={() => handleUpdateStatus(apt.id, "cancelled")}
                              className="h-7 px-2 text-[11px] text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

