'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { OrganizationProvider } from '../contexts/OrganizationContext';
import LanguageProvider from '../providers/LanguageProvider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  console.log('🔧 PROVIDERS LOADING - CACHE CLEAR ACTIVE');
  return (
    <SessionProvider>
      <OrganizationProvider>
        <LanguageProvider>
          {/* CACHE BUSTER: Force fresh render */}
          <div key={Date.now()}>
            {children}
          </div>
        </LanguageProvider>
      </OrganizationProvider>
    </SessionProvider>
  );
}

export default Providers;
