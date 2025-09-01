'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { OrganizationProvider } from '../contexts/OrganizationContext';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <OrganizationProvider>{children}</OrganizationProvider>
    </SessionProvider>
  );
}

export default Providers;
