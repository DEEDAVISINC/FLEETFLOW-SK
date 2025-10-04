'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { AuthProvider } from './components/AuthProvider';
import { LoadProvider } from './contexts/LoadContext';
import { ShipperProvider } from './contexts/ShipperContext';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <AuthProvider>
        <LoadProvider>
          <ShipperProvider>{children}</ShipperProvider>
        </LoadProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
