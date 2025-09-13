import { NextRequest, NextResponse } from 'next/server';

/**
 * SIMPLIFIED MIDDLEWARE: Complete authentication bypass
 * All pages are now public with no authentication barriers
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes only
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // CRITICAL FIX: Redirect auth/signin to root page (landing page)
  if (pathname === '/auth/signin' || pathname === '/auth/signup') {
    console.log(`🔄 REDIRECT FIX: ${pathname} -> / (landing page)`);
    return NextResponse.redirect(new URL('/', request.url));
  }

  // COMPLETE BYPASS: Allow all pages without any authentication
  console.log(`✅ PUBLIC ACCESS: ${pathname} - No authentication required`);
  return NextResponse.next();
}

// Configure which paths this middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};
