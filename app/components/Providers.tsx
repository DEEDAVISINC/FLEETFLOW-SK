'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { OrganizationProvider } from '../contexts/OrganizationContext';
import LanguageProvider from '../providers/LanguageProvider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <OrganizationProvider>
        <LanguageProvider>{children}</LanguageProvider>
      </OrganizationProvider>
    </SessionProvider>
  );
}

export default Providers;
