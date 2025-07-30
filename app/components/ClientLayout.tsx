'use client';

import { LoadProvider } from '../contexts/LoadContext';
import { ShipperProvider } from '../contexts/ShipperContext';
import Navigation from './Navigation';
import { SimpleErrorBoundary } from './SimpleErrorBoundary';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <SimpleErrorBoundary>
      <ShipperProvider>
        <LoadProvider>
          <Navigation />
          <main
            style={{
              paddingTop: '70px',
              minHeight: '100vh',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            {children}
          </main>
        </LoadProvider>
      </ShipperProvider>
    </SimpleErrorBoundary>
  );
}
