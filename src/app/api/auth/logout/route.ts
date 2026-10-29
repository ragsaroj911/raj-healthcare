import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.delete("raj_auth_token");
  response.cookies.delete("raj_user_email");
  response.cookies.delete("raj_user_role");
  return response;
}

