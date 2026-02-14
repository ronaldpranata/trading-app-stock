import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(request: NextRequest) {
  try {
    // Check for authentication cookie
    const authCookie = request.cookies.get("auth-token");

    if (!authCookie) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Verify the JWT verification
    const secret = new TextEncoder().encode(
      process.env.AUTH_SECRET || "default-secret-change-me"
    );

    await jwtVerify(authCookie.value, secret);

    return NextResponse.json({ authenticated: true }, { status: 200 });
  } catch (error) {
    // console.error("Auth check error:", error); // Reduce noise
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
