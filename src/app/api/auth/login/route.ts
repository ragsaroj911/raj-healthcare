import { NextResponse } from "next/server";
import { findPortalUserByEmail } from "@/lib/data/store";
import { verifyPassword, hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await findPortalUserByEmail(cleanEmail);

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Verify password hash
    const inputHash = hashPassword(password);
    const isValid = user.password_hash === inputHash;

    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Prepare user session payload
    const sessionData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const response = NextResponse.json({
      success: true,
      user: sessionData,
    });

    // Set secure cookie
    const token = Buffer.from(JSON.stringify(sessionData)).toString("base64");
    response.cookies.set("raj_auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    response.cookies.set("raj_user_email", user.email, {
      httpOnly: false, // readable by client UI
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    response.cookies.set("raj_user_role", user.role, {
      httpOnly: false, // readable by client UI
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}

