'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import LanguageProvider from '../providers/LanguageProvider';

interface MinimalProvidersProps {
  children: ReactNode;
}

export function MinimalProviders({ children }: MinimalProvidersProps) {
  console.log('🔧 MINIMAL PROVIDERS LOADING - NO ORGANIZATION CONTEXT');
  return (
    <SessionProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </SessionProvider>
  );
}

export default MinimalProviders;
