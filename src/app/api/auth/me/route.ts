import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("raj_auth_token")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  try {
    const jsonStr = Buffer.from(token, "base64").toString("utf-8");
    const user = JSON.parse(jsonStr);
    return NextResponse.json({ authenticated: true, user });
  } catch (err) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }
}

