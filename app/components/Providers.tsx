'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import LanguageProvider from '../providers/LanguageProvider';
import { SafeOrganizationProvider } from './SafeOrganizationProvider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  console.log('🔧 PROVIDERS LOADING - CACHE CLEAR ACTIVE');
  return (
    <SessionProvider>
      <SafeOrganizationProvider>
        <LanguageProvider>
          {/* CACHE BUSTER: Force fresh render */}
          <div key={Date.now()}>{children}</div>
        </LanguageProvider>
      </SafeOrganizationProvider>
    </SessionProvider>
  );
}

export default Providers;
