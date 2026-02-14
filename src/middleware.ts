import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define protected routes
const protectedRoutes = ['/dashboard', '/author'];
const protectedApiRoutes = ['/api/stock', '/api/author'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
     * - api/auth (login, logout, check)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (public page)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|login).*)',
  ],
};
