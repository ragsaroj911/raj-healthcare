"use client";

import React from "react";
import { Service } from "@/lib/types";
import { formatCurrency, formatDuration, cn } from "@/lib/utils";
import { Clock, Check } from "lucide-react";

interface ServiceSelectorProps {
  services: Service[];
  selectedService: Service | null;
  onSelect: (service: Service) => void;
}

export function ServiceSelector({
  services,
  selectedService,
  onSelect,
}: ServiceSelectorProps) {
  const activeServices = services.filter((s) => s.is_active);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-slate-900">1. Select a Service</h3>
        <p className="text-xs text-slate-500">Choose the type of appointment you would like to book.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {activeServices.map((service) => {
          const isSelected = selectedService?.id === service.id;
          return (
            <div
              key={service.id}
              onClick={() => onSelect(service)}
              className={cn(
                "group relative p-4 rounded-xl border transition-all cursor-pointer text-left flex flex-col justify-between",
                isSelected
                  ? "border-slate-900 bg-slate-50/60 ring-2 ring-slate-900/10 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/40"
              )}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="font-semibold text-sm text-slate-900 group-hover:text-black">
                    {service.name}
                  </span>
                  <div
                    className={cn(
                      "h-5 w-5 rounded-full flex items-center justify-center shrink-0 border transition-all",
                      isSelected
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-300 group-hover:border-slate-400"
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
                <span className="flex items-center gap-1 text-slate-600">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  {formatDuration(service.duration_minutes)}
                </span>
                <span className="text-slate-900 font-semibold">
                  {formatCurrency(service.price)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

