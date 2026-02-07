import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 },
      );
    }

    // Get the password from environment variable
    const correctPassword = process.env.APP_PASSWORD;

    if (!correctPassword) {
      console.error("APP_PASSWORD environment variable is not set");
      return NextResponse.json(
        {
          error:
            "Authentication not configured. Please set APP_PASSWORD in .env.local",
        },
        { status: 500 },
      );
    }

    // Verify password
    if (password !== correctPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Create response with authentication cookie
    const response = NextResponse.json(
      { success: true, message: "Authentication successful" },
      { status: 200 },
    );

    // Generate a simple auth token (in production, use JWT)
    const authSecret = process.env.AUTH_SECRET || "default-secret-change-me";

    // Set secure HTTP-only cookie
    response.cookies.set("auth-token", authSecret, {
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
