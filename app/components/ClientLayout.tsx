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
import ProfessionalNavigation from './Navigation';
import NotificationBell from './NotificationBell';
import PhoneSystemWidget from './PhoneSystemWidget';
import Providers from './Providers';
import { SimpleErrorBoundary } from './SimpleErrorBoundary';
// ✅ ADD: Platform AI initialization
import { initializeFleetFlowAI } from '../config/ai-config';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [phoneDialerEnabled, setPhoneDialerEnabled] = useState(false); // Default to false for SSR
  const [hasNewSuggestions, setHasNewSuggestions] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Safely handle useSession - only use when SessionProvider is available
  let session: any = null;
  let status: string = 'unauthenticated';
  try {
    const sessionData = useSession();
    session = sessionData.data;
    status = sessionData.status;
  } catch (error) {
    // SessionProvider not available, use defaults
    session = null;
    status = 'unauthenticated';
  }

  // Get user data for permissions and functionality - but don't use until hydrated
  const { user } = getCurrentUser();

  // FORCE IMMEDIATE LANDING PAGE - KILL ALL LOADING STATES
  if (pathname === '/') {
    console.log('🚨 FORCE LANDING PAGE: Bypassing ALL authentication logic');
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
    ); // NO SessionProvider, NO OrganizationProvider, just the landing page
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
    '/shipper-portal',
    '/auth/signin',
    '/auth/signup',
    '/landingpage',
  ];

  // ADDITIONAL BYPASS: Also bypass auth for other marketing/public pages
  const isMarketingPage =
    pathname &&
    (pathname.startsWith('/carrier') ||
      pathname.startsWith('/broker') ||
      pathname.startsWith('/shipper') ||
      pathname.includes('landing'));

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

  const isPublicPage = pathname
    ? publicPages.includes(pathname) ||
      publicPages.some((page) => pathname.startsWith(page))
    : false;

  // AUTHENTICATION COMPLETELY DISABLED - All pages are now public
  useEffect(() => {
    console.log(
      `✅ ClientLayout: Public access enabled for ${pathname} - No authentication required`
    );
  }, [pathname]);

  // Track hydration to prevent mismatches
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // ✅ Initialize Platform AI on app startup
  useEffect(() => {
    console.info('🚀 FleetFlow app starting - initializing Platform AI...');
    try {
      initializeFleetFlowAI();
      console.info('✅ Platform AI initialized successfully');
    } catch (error) {
      console.error('❌ Platform AI initialization failed:', error);
      console.warn('⚠️ FleetFlow will continue with original AI behavior');
    }

    // Initialize test notification generator in development
    if (process.env.NODE_ENV === 'development') {
      console.info(
        '🧪 Test notification generator initialized. Use testNotifications.help() in console.'
      );
    }
  }, []);

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

  // Show Flowter on landing page for subscription questions, and on other pages except university
  const shouldShowFlowter = isHydrated
    ? pathname === '/' || // Always show on landing page for subscription help
      !pathname?.includes('/university') ||
      pathname?.includes('/training/instructor')
    : false;

  // Check if user has phone dialer enabled (from user profile settings)
  useEffect(() => {
    if (!isHydrated || !user?.id) return; // Wait for hydration and user

    const isEnabled =
      localStorage.getItem(`fleetflow-phone-dialer-${user.id}`) !== 'disabled';
    setPhoneDialerEnabled(isEnabled);
  }, [user?.id, isHydrated]);

  // Compute all conditional logic safely - only after hydration
  const isOperationsPage = isHydrated
    ? pathname &&
      !pathname.includes('/auth/') &&
      !pathname.includes('/privacy') &&
      !pathname.includes('/terms') &&
      !pathname.includes('/carrier-landing') &&
      pathname !== '/broker' && // Allow broker subpages, just not the main broker page
      !pathname.includes('/university') &&
      pathname !== '/' &&
      pathname !== '/plans'
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
      willShowNotificationBell:
        user?.id &&
        pathname !== '/' &&
        !pathname?.includes('/auth/') &&
        !pathname?.includes('/launchpad'),
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
      <Providers>
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
              </LoadProvider>
            </ShipperProvider>
          </SimpleErrorBoundary>
        </MaintenanceMode>
      </Providers>
    );
  }

  return (
    <Providers>
      <MaintenanceMode>
        <SimpleErrorBoundary>
          <ShipperProvider>
            <LoadProvider>
              {(!isPublicPage || isLocalhostAccess) && (
                <ProfessionalNavigation />
              )}
              <main
                style={{
                  paddingTop:
                    isPublicPage && !isLocalhostAccess ? '0px' : '70px',
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
                    userTier={user.subscriptionTier}
                    userRole={user.role}
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

              {/* Notification Bell - Only for logged-in users, not on landing/marketing/auth/launchpad pages */}
              {isHydrated &&
                user?.id &&
                pathname !== '/' &&
                pathname !== '/carrier-landing' &&
                !pathname?.includes('/auth/') &&
                !pathname?.includes('/launchpad') && (
                  <NotificationBell userId={user.id} position='bottom-right' />
                )}
            </LoadProvider>
          </ShipperProvider>
        </SimpleErrorBoundary>
      </MaintenanceMode>
    </Providers>
  );
}
