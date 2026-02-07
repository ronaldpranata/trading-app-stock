import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Check for authentication cookie
    const authCookie = request.cookies.get("auth-token");

    if (!authCookie) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Verify the token matches the secret
    const authSecret = process.env.AUTH_SECRET || "default-secret-change-me";

    if (authCookie.value !== authSecret) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true }, { status: 200 });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
