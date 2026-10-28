"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Shield, KeyRound, Loader2, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw new Error(error.message);
        }
      } else {
        // Fallback demo authentication: accept any valid-looking credentials or demo login
        if (password.length < 3) {
          throw new Error("Password must be at least 3 characters.");
        }
        localStorage.setItem("aurabook_admin_session", "demo_logged_in");
      }

      router.push("/admin");
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid credentials");
      setLoading(false);
    }
  };

  const handleDemoAccess = () => {
    localStorage.setItem("aurabook_admin_session", "demo_logged_in");
    router.push("/admin");
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-slate-200/80 shadow-md">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white mb-2">
            <Shield className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl font-bold">Admin Portal</CardTitle>
          <CardDescription className="text-xs">
            Sign in to manage appointments, services, and business hours.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Admin Email
              </label>
              <Input
                type="email"
                required
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Password
              </label>
              <Input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full text-xs font-medium mt-2">
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                "Sign In to Dashboard"
              )}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-white px-2 text-slate-400">or</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleDemoAccess}
            className="w-full gap-2 text-xs border-dashed border-slate-300"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Quick Demo Access (1-Click)
          </Button>

          <p className="text-[11px] text-slate-400 text-center leading-normal">
            {isSupabaseConfigured
              ? "Connected to Supabase Auth."
              : "Demo mode active. Once you provide NEXT_PUBLIC_SUPABASE_URL, real Supabase credentials will be verified."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

