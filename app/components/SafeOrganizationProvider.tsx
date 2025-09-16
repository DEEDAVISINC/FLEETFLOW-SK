'use client';

import { ReactNode, useEffect, useState } from 'react';
import { OrganizationProvider } from '../contexts/OrganizationContext';

interface SafeOrganizationProviderProps {
  children: ReactNode;
}

export function SafeOrganizationProvider({ children }: SafeOrganizationProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ensure provider is ready
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        Initializing FleetFlow...
      </div>
    );
  }

  try {
    return (
      <OrganizationProvider>
        {children}
      </OrganizationProvider>
    );
  } catch (error) {
    console.warn('OrganizationProvider error caught:', error);
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div>
          <h1>FleetFlow™</h1>
          <p>Loading your workspace...</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }
}
