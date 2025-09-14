'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import ClientLayout from './ClientLayout';
import FleetFlowFooter from './FleetFlowFooter';
import MaintenanceMode from './MaintenanceMode';
import ProfessionalNavigation from './Navigation';
import { SimpleErrorBoundary } from './SimpleErrorBoundary';

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

export default function ClientLayoutWrapper({
  children,
}: ClientLayoutWrapperProps) {
  const pathname = usePathname();

  // Homepage gets navigation but NO auth requirements
  if (pathname === '/') {
    console.log(
      '🏠 HOMEPAGE: Using navigation layout WITHOUT auth requirements'
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
            <ProfessionalNavigation />
            {children}
            <FleetFlowFooter variant='transparent' />
          </div>
        </SimpleErrorBoundary>
      </MaintenanceMode>
    );
  }

  // All other pages use normal ClientLayout with full functionality
  console.log(
    `📄 PAGE ${pathname}: Using ClientLayout with authentication and navigation`
  );
  return <ClientLayout>{children}</ClientLayout>;
}
