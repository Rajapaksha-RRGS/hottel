import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow all API auth requests unfiltered
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Allow public routes
  if (pathname.startsWith('/login') || pathname.startsWith('/register') || pathname === '/') {
    return NextResponse.next();
  }

  // Allow static files and next internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/_health') ||
    pathname.startsWith('/api/admin/seed-beverages') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.svg')
  ) {
    return NextResponse.next();
  }

  // Read NextAuth session from cookie
  const sessionCookie = request.cookies.get('next-auth.session-token')?.value;

  // For protected routes, require session
  if (!sessionCookie) {
    if (!pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // For API routes without session, return unauthorized
    return NextResponse.json(
      { error: 'Unauthorized: No session found' },
      { status: 401 }
    );
  }

  // Allow the request through - session validation happens in NextAuth
  return NextResponse.next();
}

// Apply proxy to all routes except static files
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};