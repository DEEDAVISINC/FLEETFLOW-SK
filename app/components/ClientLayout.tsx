'use client';

import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { checkPermission, getCurrentUser } from '../config/access';
import { LoadProvider } from '../contexts/LoadContext';
import { ShipperProvider } from '../contexts/ShipperContext';
import FleetFlowFooter from './FleetFlowFooter';
import FlowterButton from './FlowterButton';
import MaintenanceMode from './MaintenanceMode';
import Navigation from './Navigation';
import PhoneSystemWidget from './PhoneSystemWidget';
import { SimpleErrorBoundary } from './SimpleErrorBoundary';
// ✅ ADD: Platform AI initialization
import { initializeFleetFlowAI } from '../config/ai-config';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [flowterOpen, setFlowterOpen] = useState(false);
  const pathname = usePathname();

  // ✅ Initialize Platform AI on app startup
  useEffect(() => {
    console.log('🚀 FleetFlow app starting - initializing Platform AI...');
    try {
      initializeFleetFlowAI();
      console.log('✅ Platform AI initialized successfully');
    } catch (error) {
      console.error('❌ Platform AI initialization failed:', error);
      console.warn('⚠️ FleetFlow will continue with original AI behavior');
    }
  }, []); // Run once on app startup

  const handleFlowterOpen = () => {
    setFlowterOpen(true);
  };

  const handleFlowterClose = () => {
    setFlowterOpen(false);
  };

  // Hide Flowter button on main university pages (but allow on instructors page)
  const shouldShowFlowter =
    !pathname?.includes('/university') ||
    pathname?.includes('/training/instructor');

  // Show PhoneSystemWidget for dispatch, admin, and manager roles (with phone dialer opt-in)
  const { user } = getCurrentUser();
  const hasPhoneEligibleRole =
    user &&
    (user.role === 'admin' ||
      user.role === 'manager' ||
      user.role === 'dispatcher' ||
      checkPermission('hasDispatchAccess'));

  // Check if user has phone dialer enabled (from user profile settings)
  const phoneDialerEnabled =
    typeof window !== 'undefined'
      ? localStorage.getItem(`fleetflow-phone-dialer-${user?.id}`) !==
        'disabled'
      : true; // Default to enabled on server-side

  // Only show phone widget on operations pages (exclude auth, landing, and other non-operations pages)
  const isOperationsPage =
    pathname &&
    !pathname.includes('/auth/') &&
    !pathname.includes('/privacy') &&
    !pathname.includes('/terms') &&
    !pathname.includes('/carrier-landing') &&
    !pathname.includes('/broker') &&
    !pathname.includes('/university') &&
    pathname !== '/' &&
    pathname !== '/plans';

  const shouldShowPhoneWidget =
    hasPhoneEligibleRole && phoneDialerEnabled && isOperationsPage;

  // Debug logging
  console.log('🔍 ClientLayout Debug:', {
    pathname,
    shouldShowFlowter,
    shouldShowPhoneWidget,
    hasPhoneEligibleRole,
    phoneDialerEnabled,
    isOperationsPage,
    userRole: user?.role,
    userId: user?.id,
    isUniversity: pathname?.includes('/university'),
    isInstructor: pathname?.includes('/training/instructor'),
  });

  // Full-screen admin pages (no navigation) - DEPOINTE dashboard removed as it needs all app functions
  const isAdminDashboard = pathname === '/ai-company-dashboard';

  if (isAdminDashboard) {
    return (
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
    );
  }

  return (
    <MaintenanceMode>
      <SimpleErrorBoundary>
        <ShipperProvider>
          <LoadProvider>
            <Navigation />
            <main
              style={{
                paddingTop: '70px',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ flex: 1 }}>{children}</div>
              <FleetFlowFooter variant='transparent' />
            </main>

            {/* Flowter AI Button - appears on all pages except university */}
            {shouldShowFlowter && (
              <>
                {console.log('🎯 Rendering Flowter AI Button')}
                <FlowterButton onOpen={handleFlowterOpen} />
              </>
            )}

            {/* Phone System Widget - appears for dispatch/admin/manager roles */}
            {shouldShowPhoneWidget && (
              <>
                {console.log('📞 Rendering Phone System Widget')}
                <PhoneSystemWidget position='bottom-left' />
              </>
            )}

            {/* Simple Flowter Modal */}
            {flowterOpen && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 1001,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={handleFlowterClose}
              >
                <div
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    maxWidth: '500px',
                    width: '90%',
                    maxHeight: '80vh',
                    overflow: 'auto',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '20px',
                    }}
                  >
                    <h2 style={{ margin: 0, color: '#1f2937' }}>
                      🤖 Flowter AI
                    </h2>
                    <button
                      onClick={handleFlowterClose}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#6b7280',
                      }}
                    >
                      ×
                    </button>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
                      Hi! I'm Flowter, your AI assistant. I can help you
                      navigate FleetFlow, discover features, troubleshoot
                      issues, and optimize your workflow.
                    </p>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ color: '#1f2937', marginBottom: '12px' }}>
                      What I can help with:
                    </h3>
                    <ul
                      style={{
                        color: '#4b5563',
                        lineHeight: '1.6',
                        paddingLeft: '20px',
                      }}
                    >
                      <li>📚 Learning FleetFlow features and best practices</li>
                      <li>🔍 Finding hidden features and shortcuts</li>
                      <li>🚛 Driver scheduling and load matching</li>
                      <li>📊 Route optimization and analytics</li>
                      <li>❓ Troubleshooting and support</li>
                    </ul>
                  </div>

                  <div
                    style={{
                      backgroundColor: '#f3f4f6',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    <p
                      style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}
                    >
                      💡 <strong>Tip:</strong> For advanced AI features and
                      real-time assistance, visit the AI Flow section of
                      FleetFlow where I can take direct actions and provide more
                      interactive help.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </LoadProvider>
        </ShipperProvider>
      </SimpleErrorBoundary>
    </MaintenanceMode>
  );
}
