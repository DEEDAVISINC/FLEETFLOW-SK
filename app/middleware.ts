import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionAccessService } from './services/SubscriptionAccessService';

/**
 * Next.js Middleware for Subscription-Based Access Control
 * Restricts Go With The Flow users to only allowed pages
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes, and auth pages
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/auth/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Skip middleware for public pages
  const publicPages = [
    '/',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
  ];

  if (publicPages.includes(pathname)) {
    return NextResponse.next();
  }

  try {
    const subscriptionAccessService = new SubscriptionAccessService();
    const accessResult =
      await subscriptionAccessService.checkPageAccess(pathname);

    if (!accessResult.hasAccess) {
      // Redirect to subscription plans page with message
      const plansUrl = new URL('/plans', request.url);
      plansUrl.searchParams.set(
        'message',
        accessResult.reason || 'Access restricted'
      );
      plansUrl.searchParams.set('upgrade', 'true');

      return NextResponse.redirect(plansUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // Allow access on error to prevent blocking legitimate users
    return NextResponse.next();
  }
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
