import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// ADMIN ACCOUNTS - Full access to everything
const ADMIN_ACCOUNTS = ['info@deedavis.biz', 'admin@fleetflowapp.com'];

// Map user email to userId for subscription lookup
const USER_ID_MAP: Record<string, string> = {
  'info@deedavis.biz': 'DEPOINTE-ADMIN-001',
  'admin@fleetflowapp.com': 'admin-001',
  'dispatch@fleetflowapp.com': 'disp-001',
};

// Define subscription tiers and what pages they can access
const SUBSCRIPTION_ACCESS = {
  trial: [
    '/fleetflowdash',
    '/tracking',
    '/documents',
    '/messages',
    '/notifications',
    '/user-profile',
    '/account',
  ],
  basic: [
    '/fleetflowdash',
    '/tracking',
    '/documents',
    '/messages',
    '/notifications',
    '/user-profile',
    '/account',
    '/dispatch',
    '/drivers',
    '/vehicles',
    '/routes',
    '/scheduling',
  ],
  professional: [
    '/fleetflowdash',
    '/tracking',
    '/documents',
    '/messages',
    '/notifications',
    '/user-profile',
    '/account',
    '/dispatch',
    '/drivers',
    '/vehicles',
    '/routes',
    '/scheduling',
    '/freight-forwarding',
    '/broker-operations',
    '/quoting',
    '/billing',
    '/invoicing',
    '/crm',
    '/analytics',
  ],
  enterprise: [
    '/fleetflowdash',
    '/tracking',
    '/documents',
    '/messages',
    '/notifications',
    '/user-profile',
    '/account',
    '/dispatch',
    '/drivers',
    '/vehicles',
    '/routes',
    '/scheduling',
    '/freight-forwarding',
    '/broker-operations',
    '/quoting',
    '/billing',
    '/invoicing',
    '/crm',
    '/analytics',
    '/ai-flow',
    '/customs-agent-portal',
    '/broker-management',
    '/carrier-verification',
    '/safety',
    '/maintenance',
    '/reports',
    '/performance',
  ],
  university: [
    '/university',
    '/training',
    '/compliance',
    '/fleetflowdash',
    '/user-profile',
    '/account',
  ],
};

// Pages that don't require authentication (public pages)
const PUBLIC_PAGES = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/go-with-the-flow',
  '/launchpad',
  '/carrier-landing',
  '/about',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
];

/**
 * Get user's subscription tier from the subscription service
 */
async function getUserSubscriptionTier(
  userEmail: string
): Promise<string> {
  try {
    // Get userId from email
    const userId =
      USER_ID_MAP[userEmail] ||
      userEmail.replace('@', '-').replace(/\./g, '-');

    // Dynamically import to avoid issues with edge runtime
    const { SquareSubscriptionService } = await import(
      './app/services/SquareSubscriptionService'
    );
    const subscriptionService = new SquareSubscriptionService();

    // Get user's subscription info
    const subscriptionInfo =
      await subscriptionService.getUserSubscriptionInfo(userId);

    if (!subscriptionInfo || subscriptionInfo.activePlans.length === 0) {
      return 'trial'; // Default to trial if no subscription
    }

    // Get the highest permission level from active plans
    const permissionLevels = subscriptionInfo.activePlans.map(
      (plan) => plan.permissionLevel
    );

    // Priority: enterprise > professional > basic > university
    if (permissionLevels.includes('enterprise')) return 'enterprise';
    if (permissionLevels.includes('professional')) return 'professional';
    if (permissionLevels.includes('university')) return 'university';
    if (permissionLevels.includes('basic')) return 'basic';

    return 'trial';
  } catch (error) {
    console.error('Error getting subscription tier:', error);
    return 'trial'; // Default to trial on error
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static assets and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') // files with extensions (favicon, images, etc)
  ) {
    return NextResponse.next();
  }

  // Allow public pages
  if (
    PUBLIC_PAGES.some(
      (page) => pathname === page || pathname.startsWith(page + '/')
    )
  ) {
    return NextResponse.next();
  }

  // Get user session
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Not authenticated -> redirect to login
  if (!token || !token.email) {
    console.log(`🚫 Access denied to ${pathname} - Not authenticated`);
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

  // 🔒 ALL OTHER USERS - Check subscription access
  const userTier = await getUserSubscriptionTier(userEmail);
  const allowedPaths =
    SUBSCRIPTION_ACCESS[userTier as keyof typeof SUBSCRIPTION_ACCESS] || [];

  // Check if current path is allowed for this tier
  const hasAccess = allowedPaths.some(
    (allowedPath) =>
      pathname === allowedPath || pathname.startsWith(allowedPath + '/')
  );

  if (!hasAccess) {
    console.log(
      `🚫 Access denied to ${pathname} for ${userEmail} (tier: ${userTier})`
    );

    // Redirect to subscription upgrade page
    const upgradeUrl = new URL(
      '/subscription-management/subscription-dashboard',
      request.url
    );
    upgradeUrl.searchParams.set('required', 'upgrade');
    upgradeUrl.searchParams.set('feature', pathname);
    upgradeUrl.searchParams.set(
      'message',
      `This feature requires a higher subscription tier. You are currently on the ${userTier} plan.`
    );
    return NextResponse.redirect(upgradeUrl);
  }

  console.log(
    `✅ Access granted to ${pathname} for ${userEmail} (tier: ${userTier})`
  );
  return NextResponse.next();
}

// Configure which routes the middleware runs on
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
