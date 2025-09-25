'use client';

import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { checkPermission, getCurrentUser } from '../config/access';
import { LoadProvider } from '../contexts/LoadContext';
import { ShipperProvider } from '../contexts/ShipperContext';
import FleetFlowFooter from './FleetFlowFooter';
import UnifiedFlowterAI from './FlowterButton';
import MaintenanceMode from './MaintenanceMode';
import MinimalProviders from './MinimalProviders';
import ProfessionalNavigation from './Navigation';
import NotificationBell from './NotificationBell';
import PhoneSystemWidget from './PhoneSystemWidget';
import { SimpleErrorBoundary } from './SimpleErrorBoundary';
// ✅ ADD: Platform AI initialization
import { initializeFleetFlowAI } from '../config/ai-config';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [phoneDialerEnabled, setPhoneDialerEnabled] = useState(true);
  const [hasNewSuggestions, setHasNewSuggestions] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Always call useSession at top level (Rules of Hooks)
  // This must be called unconditionally to follow React hooks rules
  const sessionData = useSession();
  const session = sessionData?.data || null;
  const status = sessionData?.status || 'unauthenticated';

  // Define public pages that don't require authentication - ONLY these are free
  const publicPages = [
    '/', // Landing/Homepage
    '/go-with-the-flow', // Marketing content
    '/launchpad', // Marketing content
    '/carrier-landing', // Public carrier landing page
    '/about', // Company info
    '/contact', // Contact info
    '/privacy-policy', // Legal
    '/terms-of-service', // Legal
    '/auth/signin', // Login page
    '/auth/signup', // Registration page
  ];

  const isPublicPage = pathname
    ? publicPages.includes(pathname) ||
      publicPages.some((page) => pathname.startsWith(page))
    : false;

  // Initialize client-side data after hydration to prevent SSR mismatch
  useEffect(() => {
    setIsHydrated(true);
    // Only get user data after hydration
    try {
      const { user: userData } = getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error getting user data after hydration:', error);
      setUser(null);
    }
  }, []);

  // PROPER AUTHENTICATION - Protect app pages, allow public marketing pages
  useEffect(() => {
    if (isHydrated) {
      if (isPublicPage) {
        console.log(`✅ PUBLIC PAGE: ${pathname} - No authentication required`);
      } else {
        console.log(`🔒 PROTECTED PAGE: ${pathname} - Authentication required`);
      }
    }
  }, [pathname, isPublicPage, isHydrated]);

  // AUTHENTICATION CHECK - Redirect to signin if not authenticated and on protected page
  useEffect(() => {
    if (!isPublicPage && status === 'unauthenticated' && isHydrated) {
      console.log(
        `🚨 REDIRECT: ${pathname} requires authentication - redirecting to signin`
      );
      router.push('/auth/signin');
      return;
    }
  }, [status, isPublicPage, pathname, router, isHydrated]);

  // ✅ Initialize FleetFlow AI system during layout mount (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      try {
        initializeFleetFlowAI();
        console.log('🤖 AI System initialized in ClientLayout');
      } catch (error) {
        console.error('❌ AI System initialization failed:', error);
      }
    }
  }, [isHydrated]);

  // Handle phone system integration
  useEffect(() => {
    if (isHydrated && pathname && !pathname.startsWith('/auth/')) {
      console.log('📞 Phone system integration ready');
      setPhoneDialerEnabled(true);
    }
  }, [pathname, isHydrated]);

  // AI suggestions monitoring
  useEffect(() => {
    if (isHydrated) {
      const checkForSuggestions = () => {
        // Mock suggestion checking logic
        const hasNewSuggestions = Math.random() > 0.8;
        setHasNewSuggestions(hasNewSuggestions);
      };

      const interval = setInterval(checkForSuggestions, 30000);
      return () => clearInterval(interval);
    }
  }, [isHydrated]);

  // Generate sample notifications for the current user
  useEffect(() => {
    if (!isHydrated) return; // Wait for hydration

    const generateSampleData = async () => {
      // Only generate once per session and if user is available
      const hasGeneratedSamples = sessionStorage.getItem(
        'fleetflow-sample-data-generated'
      );
      if (hasGeneratedSamples || !user?.id) return;

      try {
        // Generate sample notifications
        const { notificationService } = await import(
          '../services/NotificationService'
        );
        await notificationService.generateSampleNotifications(
          user.id,
          'default'
        );
        console.info('🎯 Sample notifications generated for user:', user.id);

        // Generate sample messages
        const { messageService } = await import('../services/MessageService');
        await messageService.generateSampleMessages(
          user.id,
          user.name || 'Current User',
          user.role || 'employee',
          'default'
        );
        console.info('📬 Sample messages generated for user:', user.id);

        sessionStorage.setItem('fleetflow-sample-data-generated', 'true');
      } catch (error) {
        console.error('❌ Failed to generate sample data:', error);
      }
    };

    generateSampleData();
  }, [user?.id, isHydrated]); // Run when user is available and hydrated

  // Check if user has phone dialer enabled (from user profile settings)
  useEffect(() => {
    if (!isHydrated || !user?.id) return; // Wait for hydration and user

    // Enable by default for eligible roles, disable only if explicitly disabled
    const isExplicitlyDisabled =
      localStorage.getItem(`fleetflow-phone-dialer-${user.id}`) === 'disabled';
    setPhoneDialerEnabled(!isExplicitlyDisabled);
  }, [user?.id, isHydrated]);

  // Show loading state during hydration to prevent SSR mismatch
  if (!isHydrated) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '40px',
            borderRadius: '20px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              border: '4px solid rgba(255, 255, 255, 0.3)',
              borderTop: '4px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px',
            }}
          ></div>
          <p
            style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: '600',
            }}
          >
            Loading FleetFlow...
          </p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // FORCE IMMEDIATE LANDING PAGE - KILL ALL LOADING STATES
  if (pathname === '/') {
    console.log('🚨 FORCE LANDING PAGE: Bypassing ALL authentication logic');
    return (
      <MinimalProviders>
        <MaintenanceMode>
          <SimpleErrorBoundary>
            <div
              style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {children}
              <FleetFlowFooter variant='transparent' />
            </div>
          </SimpleErrorBoundary>
        </MaintenanceMode>
      </MinimalProviders>
    ); // Uses MinimalProviders which includes LanguageProvider
  }

  // NO ADDITIONAL MARKETING BYPASSES - Everything else requires auth
  const isMarketingPage = false; // All marketing content now requires subscription

  if (isMarketingPage) {
    console.log(
      '🚨 MARKETING PAGE: Bypassing authentication logic for',
      pathname
    );
    return (
      <MaintenanceMode>
        <SimpleErrorBoundary>
          <div
            style={{
              minHeight: '100vh',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {children}
            <FleetFlowFooter variant='transparent' />
          </div>
        </SimpleErrorBoundary>
      </MaintenanceMode>
    );
  }

  // Show Flowter AI everywhere except university pages - LIKE IT WAS BEFORE
  const shouldShowFlowter = isHydrated
    ? !pathname?.includes('/university') // Simple: show everywhere except university
    : false;

  // Compute all conditional logic safely - only after hydration
  const isOperationsPage = isHydrated
    ? pathname &&
      !pathname.includes('/auth/') &&
      !pathname.includes('/privacy') &&
      !pathname.includes('/terms') &&
      !pathname.includes('/carrier-landing') &&
      // Allow broker pages for authenticated users
      !pathname.includes('/university') &&
      pathname !== '/plans' &&
      user?.id // Only operations pages for authenticated users
    : false;

  // Show PhoneSystemWidget for dispatch, admin, and manager roles (with phone dialer opt-in)
  const hasPhoneEligibleRole =
    isHydrated && user
      ? user.role === 'admin' ||
        user.role === 'manager' ||
        user.role === 'dispatcher' ||
        checkPermission('hasDispatchAccess')
      : false;

  const shouldShowPhoneWidget =
    isHydrated &&
    hasPhoneEligibleRole &&
    phoneDialerEnabled &&
    isOperationsPage;

  // Debug logging
  if (isHydrated) {
    console.info('🔍 ClientLayout Debug:', {
      pathname,
      shouldShowFlowter,
      shouldShowPhoneWidget,
      hasPhoneEligibleRole,
      phoneDialerEnabled,
      isOperationsPage,
      userRole: user?.role,
      userId: user?.id,
      isLandingPage: pathname === '/',
      isUniversity: pathname?.includes('/university'),
      isInstructor: pathname?.includes('/training/instructor'),
      isDispatcherPortal: pathname?.includes('dispatcher-portal'),
      isBrokerPage: pathname === '/broker',
      isBrokerSubpage: pathname?.includes('/broker/'),
      isAICompanyDashboard: pathname === '/ai-company-dashboard',
      willShowNotificationBell:
        user?.id &&
        pathname !== '/' &&
        pathname !== '/carrier-landing' &&
        !pathname?.includes('/auth/') &&
        !pathname?.includes('/launchpad'),
      notificationBellConditions: {
        hasUser: !!user?.id,
        notLanding: pathname !== '/',
        notCarrierLanding: pathname !== '/carrier-landing',
        notAuth: !pathname?.includes('/auth/'),
        notLaunchpad: !pathname?.includes('/launchpad'),
      },
    });
  }

  // Full-screen admin pages (no navigation) - DEPOINTE dashboard removed as it needs all app functions
  const isAdminDashboard = pathname === '/ai-company-dashboard';

  // Debug logging for DEPOINTE dashboard
  if (pathname === '/depointe-dashboard') {
    console.info('🔍 DEPOINTE Dashboard Debug:', {
      pathname,
      isAdminDashboard,
      isHydrated,
      user: user?.id,
    });
  }

  // Debug logging for user-mentioned pages
  if (
    pathname?.includes('dispatcher-portal') ||
    pathname === '/broker' ||
    pathname === '/ai-company-dashboard'
  ) {
    console.info('🔍 User-Mentioned Page Debug:', {
      pathname,
      isDispatcherPortal: pathname?.includes('dispatcher-portal'),
      isBrokerPage: pathname === '/broker',
      isAICompanyDashboard: pathname === '/ai-company-dashboard',
      userId: user?.id,
      isHydrated,
      willShowNotificationBell:
        user?.id &&
        pathname !== '/' &&
        pathname !== '/carrier-landing' &&
        !pathname?.includes('/auth/') &&
        !pathname?.includes('/launchpad'),
      isAdminLayout: pathname === '/ai-company-dashboard',
    });
  }

  // Check if this is localhost (owner access)
  const isLocalhostAccess =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '192.168.12.189');

  // AUTHENTICATION DISABLED: No loading screen needed
  // All pages are now public and load immediately

  if (isAdminDashboard) {
    return (
      <MinimalProviders>
        <MaintenanceMode>
          <SimpleErrorBoundary>
            <ShipperProvider>
              <LoadProvider>
                {/* Full-screen admin interface - no navigation */}
                <main
                  style={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #1e3a8a, #1e40af)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {children}
                </main>

                {/* Notification Bell for Admin Dashboard */}
                {isHydrated && user?.id && (
                  <NotificationBell userId={user.id} position='bottom-right' />
                )}

                {/* Daily Briefing Button for Admin Dashboard */}
                {isHydrated && user?.id && (
                  <div
                    style={{
                      position: 'fixed',
                      bottom: '20px',
                      right: '90px',
                      zIndex: 9999,
                    }}
                    onClick={() => {
                      console.info(
                        '🌅 Daily briefing requested from admin dashboard'
                      );
                      // TODO: Implement daily briefing modal for admin dashboard
                    }}
                  >
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        backgroundColor: '#3b82f6',
                        borderRadius: '50%',
                        border: '3px solid white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      title='Daily Briefing'
                    >
                      🌅
                    </div>
                  </div>
                )}

                {/* TODO: Add Daily Briefing Modal for Admin Dashboard */}
              </LoadProvider>
            </ShipperProvider>
          </SimpleErrorBoundary>
        </MaintenanceMode>
      </MinimalProviders>
    );
  }

  return (
    <MinimalProviders>
      <MaintenanceMode>
        <SimpleErrorBoundary>
          <ShipperProvider>
            <LoadProvider>
              {(!isPublicPage || isLocalhostAccess) &&
                pathname !== '/carrier-landing' && <ProfessionalNavigation />}
              <main
                style={{
                  paddingTop: isHydrated
                    ? (isPublicPage && !isLocalhostAccess) ||
                      pathname === '/carrier-landing'
                      ? '0px'
                      : '70px'
                    : pathname === '/carrier-landing'
                      ? '0px'
                      : '70px', // Default to 70px for server render consistency, 0px for carrier-landing
                  minHeight: '100vh',
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ flex: 1 }}>{children}</div>
                <FleetFlowFooter variant='transparent' />
              </main>

              {/* Unified Flowter AI - appears on all pages except university */}
              {isHydrated && shouldShowFlowter && (
                <>
                  {console.info('🎯 Rendering Unified Flowter AI')}
                  <UnifiedFlowterAI
                    hasNewSuggestions={hasNewSuggestions}
                    userTier={user?.subscriptionTier || 'basic'}
                    userRole={user?.role || 'visitor'}
                  />
                </>
              )}

              {/* Phone System Widget - Only for logged-in users on operations pages */}
              {isHydrated && shouldShowPhoneWidget && (
                <>
                  {console.info(
                    '📞 Rendering Phone System Widget for operations'
                  )}
                  <PhoneSystemWidget position='bottom-left' />
                </>
              )}

              {/* TODO: Add Daily Briefing Modal for authenticated users */}

              {/* Notification Bell - Only for logged-in users, not on landing/marketing/auth/launchpad pages */}
              {isHydrated &&
                user?.id &&
                pathname !== '/' &&
                pathname !== '/carrier-landing' &&
                !pathname?.includes('/auth/') &&
                !pathname?.includes('/launchpad') && (
                  // <NotificationBell userId={user.id} position='bottom-right' />
                  <div
                    style={{
                      position: 'fixed',
                      bottom: '20px',
                      right: '20px',
                      background: '#3b82f6',
                      color: 'white',
                      padding: '10px',
                      borderRadius: '50%',
                      fontSize: '12px',
                    }}
                  >
                    🔔
                  </div>
                )}
            </LoadProvider>
          </ShipperProvider>
        </SimpleErrorBoundary>
      </MaintenanceMode>
    </MinimalProviders>
  );
}
