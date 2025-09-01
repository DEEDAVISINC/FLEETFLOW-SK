'use client';

import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { checkPermission, getCurrentUser } from '../config/access';
import { LoadProvider } from '../contexts/LoadContext';
import { ShipperProvider } from '../contexts/ShipperContext';
import EnhancedFlowterModal from './EnhancedFlowterModal';
import FleetFlowFooter from './FleetFlowFooter';
import FlowterButton from './FlowterButton';
import MaintenanceMode from './MaintenanceMode';
import ProfessionalNavigation from './Navigation';
import NotificationBell from './NotificationBell';
import PhoneSystemWidget from './PhoneSystemWidget';
import Providers from './Providers';
import { SimpleErrorBoundary } from './SimpleErrorBoundary';
// ✅ ADD: Platform AI initialization
import { initializeFleetFlowAI } from '../config/ai-config';
// ✅ ADD: Test notification generator for development

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [flowterOpen, setFlowterOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [phoneDialerEnabled, setPhoneDialerEnabled] = useState(false); // Default to false for SSR
  const pathname = usePathname();

  // Get user data for permissions and functionality - but don't use until hydrated
  const { user } = getCurrentUser();

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

  const handleFlowterOpen = () => {
    setFlowterOpen(true);
  };

  const handleFlowterClose = () => {
    setFlowterOpen(false);
  };

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
      willShowNotificationBell: user?.id && pathname !== '/',
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
              <ProfessionalNavigation />
              <main
                style={{
                  paddingTop: '70px',
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

              {/* Flowter AI Button - appears on all pages except university */}
              {isHydrated && shouldShowFlowter && (
                <>
                  {console.info('🎯 Rendering Flowter AI Button')}
                  <FlowterButton onOpen={handleFlowterOpen} />
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

              {/* Notification Bell - Only for logged-in users, not on landing/marketing pages */}
              {isHydrated &&
                user?.id &&
                pathname !== '/' &&
                pathname !== '/carrier-landing' && (
                  <NotificationBell userId={user.id} position='bottom-right' />
                )}

              {/* Enhanced Flowter AI Modal - Available on landing page for subscription questions */}
              <EnhancedFlowterModal
                isOpen={flowterOpen}
                onClose={handleFlowterClose}
              />
            </LoadProvider>
          </ShipperProvider>
        </SimpleErrorBoundary>
      </MaintenanceMode>
    </Providers>
  );
}
