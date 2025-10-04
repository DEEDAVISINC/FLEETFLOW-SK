import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

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
    console.log(`✅ Admin access granted to ${pathname} for ${userEmail}`);
    return NextResponse.next();
  }

  // 🔒 ALL OTHER USERS - Basic trial access for now
  // TODO: Integrate with subscription service (requires database connection)
  console.log(`⚠️ Non-admin user ${userEmail} accessing ${pathname} - defaulting to trial tier`);
  
  // For now, allow authenticated users to access basic pages
  // You'll need to implement full subscription checking when you have a database
  const trialPages = [
    '/fleetflowdash',
    '/tracking',
    '/documents',
    '/messages',
    '/notifications',
    '/user-profile',
    '/account',
  ];

  const hasAccess = trialPages.some(
    (allowedPath) =>
      pathname === allowedPath || pathname.startsWith(allowedPath + '/')
  );

  if (!hasAccess) {
    console.log(`🚫 Access denied to ${pathname} - redirecting to upgrade`);
    const upgradeUrl = new URL('/fleetflowdash', request.url);
    upgradeUrl.searchParams.set('message', 'This feature requires a subscription upgrade');
    return NextResponse.redirect(upgradeUrl);
  }

  console.log(`✅ Access granted to ${pathname}`);
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
