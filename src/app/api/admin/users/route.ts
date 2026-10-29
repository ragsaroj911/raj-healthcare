import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPortalUsersData, inMemoryStore } from "@/lib/data/store";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { hashPassword } from "@/lib/auth";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("raj_auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    if (user.role !== "admin" && user.email !== "ragsaroj911@gmail.com") {
      return NextResponse.json({ error: "Only admin can view user management" }, { status: 403 });
    }

    const users = await getPortalUsersData();
    return NextResponse.json({ users });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get("raj_auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sessionUser = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    if (sessionUser.role !== "admin" && sessionUser.email !== "ragsaroj911@gmail.com") {
      return NextResponse.json({ error: "Only Admin can create new users" }, { status: 403 });
    }

    const body = await request.json();
    const { email, password, name, role } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const passwordHash = hashPassword(password);
    const userRole = role || "staff";

    const supabase = createServerSupabaseClient();
    let createdUser: any;

    if (supabase) {
      // 1. Register in Supabase Auth
      try {
        await supabase.auth.signUp({
          email: cleanEmail,
          password: password,
          options: {
            data: {
              name: name.trim(),
              role: userRole,
            },
          },
        });
      } catch (authErr) {
        console.warn("Supabase auth signup notice:", authErr);
      }

      // 2. Also register in public.portal_users table if it exists
      const { data, error } = await supabase
        .from("portal_users")
        .insert({
          email: cleanEmail,
          password_hash: passwordHash,
          name: name.trim(),
          role: userRole,
        })
        .select("id, email, name, role, created_at")
        .single();

      if (error) {
        console.warn("Supabase table insert notice:", error.message);
        // Fallback to store
        createdUser = inMemoryStore.addUser({
          email: cleanEmail,
          password_hash: passwordHash,
          name: name.trim(),
          role: userRole,
        });
      } else {
        createdUser = data;
      }
    } else {
      createdUser = inMemoryStore.addUser({
        email: cleanEmail,
        password_hash: passwordHash,
        name: name.trim(),
        role: userRole,
      });
    }

    return NextResponse.json({ success: true, user: createdUser }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

