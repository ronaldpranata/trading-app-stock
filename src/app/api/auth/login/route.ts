import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

// Simple in-memory rate limiter (sliding window)
// In production with Vercel/Serverless, replace this with @upstash/ratelimit
interface RateLimitData {
  count: number;
  resetTime: number;
}

const rateLimit = new Map<string, RateLimitData>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_ATTEMPTS = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const userData = rateLimit.get(ip);
  
  // Clean up expired entries every now and then
  if (rateLimit.size > 1000) {
    for (const [key, data] of rateLimit.entries()) {
      if (data.resetTime < now) rateLimit.delete(key);
    }
  }
  
  if (!userData || userData.resetTime < now) {
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (userData.count >= MAX_ATTEMPTS) {
    return true; // Blocked
  }

  userData.count++;
  return false; 
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    
    // Rate Limiting Check
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 },
      );
    }

    const correctPassword = process.env.APP_PASSWORD;

    if (!correctPassword) {
      console.error("APP_PASSWORD environment variable is not set");
      return NextResponse.json(
        { error: "Authentication configuration error" },
        { status: 500 },
      );
    }

    // Verify password (using constant-time comparison in a real app, 
    // but JS strings make this tricky without crypto.timingSafeEqual)
    if (password !== correctPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Generate Signed JWT
    const secret = new TextEncoder().encode(
      process.env.AUTH_SECRET || "default-secret-change-me"
    );

    const token = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d") // 7 days expiration
      .sign(secret);

    const response = NextResponse.json(
      { success: true, message: "Authentication successful" },
      { status: 200 },
    );

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
