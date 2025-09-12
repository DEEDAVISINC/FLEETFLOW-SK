import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionAccessService } from './services/SubscriptionAccessService';

/**
 * Next.js Middleware for Authentication and Subscription-Based Access Control
 * 1. First checks authentication
 * 2. Then checks subscription access for authenticated users
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

  // CRITICAL FIX: Always allow root page access in production
  if (pathname === '/') {
    console.log(`✅ ROOT PAGE: Allowing public access to landing page at ${request.nextUrl.hostname}`);
    return NextResponse.next();
  }

  // ================================
  // OWNER BYPASS - DEE DAVIS ONLY
  // ================================

  // Allow Dee Davis (system owner) to access without authentication
  const isLocalhost =
    request.nextUrl.hostname === 'localhost' ||
    request.nextUrl.hostname === '127.0.0.1' ||
    request.nextUrl.hostname === '192.168.12.189'; // Her local network IP

  // Complete localhost bypass for Dee Davis (system owner)
  // Since only Dee has access to localhost:3001, anyone on localhost is her
  if (isLocalhost) {
    console.log(
      `👑 OWNER ACCESS: Dee Davis accessing ${pathname} from localhost - bypassing all authentication`
    );
    return NextResponse.next();
  }

  // Define public pages that don't require authentication
  const publicPages = [
    '/',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
    '/plans',
    '/pricing',
    '/features',
    '/carrier-landing',
    '/broker',
  ];

  // Define marketing/landing pages that should remain public
  const marketingPages = ['/carrier-landing', '/broker', '/shipper-portal'];

  // Check if this is a public page
  const isPublicPage =
    publicPages.includes(pathname) ||
    marketingPages.some((page) => pathname.startsWith(page));

  // Log middleware decision for debugging
  console.log(`🔍 Middleware check: ${pathname}`, {
    hostname: request.nextUrl.hostname,
    isLocalhost,
    isPublicPage,
    publicPages: publicPages.includes(pathname),
    marketingPages: marketingPages.some((page) => pathname.startsWith(page)),
  });

  if (isPublicPage) {
    return NextResponse.next();
  }

  // ================================
  // AUTHENTICATION CHECK
  // ================================

  // Check if NextAuth secret is configured
  if (!process.env.NEXTAUTH_SECRET) {
    console.error('❌ NEXTAUTH_SECRET is not configured!');
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Get the user's authentication token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If user is not authenticated, redirect to sign in
  if (!token) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    console.log(
      `🚫 Unauthenticated access blocked: ${pathname} -> redirecting to login`
    );
    return NextResponse.redirect(signInUrl);
  }

  console.log(`✅ Authenticated user accessing: ${pathname}`, {
    email: token.email,
    role: token.role,
  });

  // ================================
  // SUBSCRIPTION ACCESS CHECK
  // ================================

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

      console.log(
        `📋 Subscription access denied for ${token.email}: ${pathname} -> redirecting to plans`
      );
      return NextResponse.redirect(plansUrl);
    }

    console.log(`✅ Full access granted for ${token.email}: ${pathname}`);
    return NextResponse.next();
  } catch (error) {
    console.error('❌ Middleware error:', error);
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
