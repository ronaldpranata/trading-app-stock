import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define protected routes
const protectedRoutes = ['/dashboard', '/author'];
const protectedApiRoutes = ['/api/stock', '/api/author'];

// Rate Limiter configuration
const ipLimiter = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = 100; // max requests
const WINDOW_MS = 60 * 1000; // 1 minute window

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate Limiting Logic for API routes
  if (pathname.startsWith('/api')) {
    const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown';
    const now = Date.now();
    const windowStart = now - WINDOW_MS;

    const rateLimitInfo = ipLimiter.get(ip) || { count: 0, lastReset: now };

    if (rateLimitInfo.lastReset < windowStart) {
      rateLimitInfo.count = 0;
      rateLimitInfo.lastReset = now;
    }

    rateLimitInfo.count++;
    ipLimiter.set(ip, rateLimitInfo);

    if (rateLimitInfo.count > RATE_LIMIT) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((rateLimitInfo.lastReset + WINDOW_MS - now) / 1000).toString(),
        },
      });
    }
  }

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => 
    pathname.startsWith(route)
  );
  
  const isProtectedApiRoute = protectedApiRoutes.some((route) => 
    pathname.startsWith(route)
  );

  if (!isProtectedRoute && !isProtectedApiRoute) {
    return NextResponse.next();
  }

  // Get the auth cookie
  const authCookie = request.cookies.get('auth-token');
  const secret = new TextEncoder().encode(
    process.env.AUTH_SECRET || 'default-secret-change-me'
  );

  if (!authCookie) {
    if (isProtectedApiRoute) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify the JWT signature
    await jwtVerify(authCookie.value, secret);
    return NextResponse.next();
  } catch (error) {
    console.error('JWT Verification failed:', error);
    // Token is invalid/expired
    if (isProtectedApiRoute) {
       return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (public page)
     * Note: api/auth is NOT excluded because we want rate limiting to apply to it.
     */
    '/((?!_next/static|_next/image|favicon.ico|login).*)',
  ],
};
