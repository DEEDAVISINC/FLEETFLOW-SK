import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { squareSubscriptionService } from './app/services/SquareSubscriptionService';

// ADMIN ACCOUNTS - Full access to everything
const ADMIN_ACCOUNTS = ['info@deedavis.biz', 'admin@fleetflowapp.com'];

// Pages that don't require authentication (public pages)
const PUBLIC_PAGES = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/dashboard-router',
  '/go-with-the-flow',
  '/launchpad',
  '/carrier-landing',
  '/about',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
  '/sms-consent', // Required for Twilio toll-free verification
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log(`🔍 Middleware checking: ${pathname}`);

  // Allow static assets and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Allow public pages
  if (
    PUBLIC_PAGES.some(
      (page) => pathname === page || pathname.startsWith(page + '/')
    )
  ) {
    console.log(`✅ Public page allowed: ${pathname}`);
    return NextResponse.next();
  }

  // Get user session
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Not authenticated -> redirect to login
  if (!token || !token.email) {
    console.log(`🚫 Not authenticated - redirecting to login from ${pathname}`);
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  const userEmail = token.email as string;

  // ✅ ADMIN ACCESS - Full access to everything
  if (ADMIN_ACCOUNTS.includes(userEmail)) {
    console.log(`✅ ADMIN ACCESS to ${pathname} for ${userEmail}`);
    return NextResponse.next();
  }

  // 🔒 CHECK REAL SUBSCRIPTION via Square
  const subscriptionInfo =
    await squareSubscriptionService.getUserSubscriptionInfo(userEmail);

  if (!subscriptionInfo) {
    console.log(`⚠️ No subscription found for ${userEmail}`);

    // Allow basic pages without subscription
    const trialPages = [
      '/fleetflowdash',
      '/tracking',
      '/documents',
      '/messages',
      '/notifications',
      '/user-profile',
      '/account',
      '/subscription-management',
    ];

    const hasTrialAccess = trialPages.some(
      (allowedPath) =>
        pathname === allowedPath || pathname.startsWith(allowedPath + '/')
    );

    if (!hasTrialAccess) {
      console.log(`🚫 Access denied to ${pathname} - no subscription`);
      const upgradeUrl = new URL(
        '/subscription-management/subscription-dashboard',
        request.url
      );
      upgradeUrl.searchParams.set('required', 'subscription');
      upgradeUrl.searchParams.set('feature', pathname);
      return NextResponse.redirect(upgradeUrl);
    }

    return NextResponse.next();
  }

  // User has subscription - check their access
  const { accessiblePages, activePlans } = subscriptionInfo;

  // Enterprise gets everything
  const hasEnterprise = activePlans.some(
    (plan) => plan.permissionLevel === 'enterprise'
  );
  if (hasEnterprise) {
    console.log(`✅ ENTERPRISE ACCESS for ${userEmail} to ${pathname}`);
    return NextResponse.next();
  }

  // Check if page is in accessible list
  const hasAccess = accessiblePages.some(
    (allowedPath) =>
      pathname === allowedPath ||
      pathname.startsWith(allowedPath + '/') ||
      allowedPath === '*'
  );

  if (!hasAccess) {
    console.log(
      `🚫 Access denied to ${pathname} for ${userEmail} (${activePlans.map((p) => p.name).join(', ')})`
    );
    const upgradeUrl = new URL(
      '/subscription-management/subscription-dashboard',
      request.url
    );
    upgradeUrl.searchParams.set('required', 'upgrade');
    upgradeUrl.searchParams.set('feature', pathname);
    return NextResponse.redirect(upgradeUrl);
  }

  console.log(`✅ Access granted to ${pathname} for ${userEmail}`);
  return NextResponse.next();
}

// Config at bottom per Next.js convention
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, images, etc (files with extensions)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
