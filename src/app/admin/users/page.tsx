"use client";

import React, { useState, useEffect } from "react";
import { PortalUser } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Users, Shield, Check, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"doctor" | "staff" | "admin">("staff");
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok && data.users) {
        setUsers(data.users);
      } else {
        setErrorMsg(data.error || "Failed to load users");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: password,
          role: role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create user");
      }

      setUsers((prev) => [data.user, ...prev]);
      setName("");
      setEmail("");
      setPassword("");
      setRole("staff");
      setShowAddForm(false);
      setStatusMsg(`User ${data.user.email} created successfully! They can now log in.`);
      setTimeout(() => setStatusMsg(""), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-slate-600">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Staff & Portal Users</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Admin privilege: Create and manage portal login credentials for doctors and clinic staff.
          </p>
        </div>

        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          size="sm"
          className="gap-1.5 text-xs bg-emerald-700 hover:bg-emerald-800 text-white self-start sm:self-auto"
        >
          <UserPlus className="h-3.5 w-3.5" />
          {showAddForm ? "Close Form" : "Add New User / Staff"}
        </Button>
      </div>

      {statusMsg && (
        <div className="mb-6 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
          <Check className="h-4 w-4" />
          {statusMsg}
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {errorMsg}
        </div>
      )}

      {/* Add User Modal / Form */}
      {showAddForm && (
        <Card className="border-slate-200 shadow-md mb-8 bg-white p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-emerald-600" />
            Register New Portal Login
          </h3>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  placeholder="e.g. Dr. Rajesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Login Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  required
                  placeholder="doctor@rajhealthcare.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assign Password <span className="text-red-500">*</span>
                </label>
                <Input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Portal Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                >
                  <option value="doctor">Doctor (Consultation & Appointments)</option>
                  <option value="staff">Staff (Front-desk & Appointments)</option>
                  <option value="admin">Admin (Full Control + Add Users)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                size="sm"
                className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                    Saving User to Supabase...
                  </>
                ) : (
                  "Create & Save User"
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Users List */}
      <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-slate-300" />
            Loading portal users...
          </div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No users registered.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Login Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {u.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {u.email}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          u.role === "admin"
                            ? "default"
                            : u.role === "doctor"
                            ? "info"
                            : "secondary"
                        }
                        className="capitalize"
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : "Active"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                        <Check className="h-3 w-3" /> Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

