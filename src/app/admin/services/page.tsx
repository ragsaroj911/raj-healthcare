"use client";

import React, { useState, useEffect } from "react";
import { Service } from "@/lib/types";
import { formatCurrency, formatDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, Tag, Loader2, Check } from "lucide-react";

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // New service form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("45");
  const [price, setPrice] = useState("100");
  const [category, setCategory] = useState("Consulting");
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      if (data.services) {
        setServices(data.services);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg("");

    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          duration_minutes: Number(duration),
          price: Number(price),
          category: category.trim(),
          is_active: true,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setServices((prev) => [data.service, ...prev]);
        setName("");
        setDescription("");
        setDuration("45");
        setPrice("100");
        setShowAddForm(false);
        setStatusMsg("Service created successfully!");
      }
    } catch (err: any) {
      console.error(err);
      setStatusMsg("Failed to create service.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Raj Healthcare — Medical Services</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure clinical offerings, session duration, and consultation fees.
          </p>
        </div>

        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          size="sm"
          className="gap-1.5 text-xs self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          {showAddForm ? "Close Form" : "Add New Service"}
        </Button>
      </div>

      {statusMsg && (
        <div className="mb-6 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700">
          {statusMsg}
        </div>
      )}

      {/* Add New Service Card */}
      {showAddForm && (
        <Card className="border-slate-200 shadow-sm mb-8 bg-white p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Create New Service</h3>
          <form onSubmit={handleCreateService} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Service Name <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  placeholder="e.g. 1-on-1 Consultation"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Category
                </label>
                <Input
                  placeholder="e.g. Strategy, Wellness, Technical"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Duration (Minutes) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  min="15"
                  step="15"
                  required
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Consultation Fee (₹ INR) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  min="0"
                  step="5"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Description
              </label>
              <Textarea
                rows={2}
                placeholder="What will the customer get during this session?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
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
              <Button type="submit" disabled={submitting} size="sm" className="text-xs">
                {submitting ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                    Saving...
                  </>
                ) : (
                  "Save Service"
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <Card key={service.id} className="border-slate-200 bg-white p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {service.category || "Service"}
                </span>
                <Badge variant={service.is_active ? "success" : "secondary"}>
                  {service.is_active ? "Active" : "Archived"}
                </Badge>
              </div>

              <h3 className="font-semibold text-sm text-slate-900 mb-1">{service.name}</h3>
              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                {formatDuration(service.duration_minutes)}
              </span>
              <span className="font-bold text-slate-900 text-sm">
                {formatCurrency(service.price)}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

