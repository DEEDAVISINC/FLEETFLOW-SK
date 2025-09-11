'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import FleetFlowLandingPage from './components/FleetFlowLandingPage';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check authentication status
  useEffect(() => {
    // OWNER BYPASS: Dee Davis accessing from localhost - bypass authentication
    const isLocalhost =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname === '192.168.12.189');

    if (isLocalhost) {
      console.log(
        `👑 OWNER ACCESS: Dee Davis accessing from localhost - bypassing authentication`
      );
      setIsAuthenticated(true);
      return;
    }

    if (status === 'loading') {
      setIsAuthenticated(null);
      return;
    }

    if (status === 'unauthenticated') {
      setIsAuthenticated(false);
      // Redirect to login page
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated' && session) {
      setIsAuthenticated(true);
      return;
    }
  }, [session, status, router]);

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div
        style={{
          background:
            'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🚛</div>
          <h2>Loading FleetFlow...</h2>
        </div>
      </div>
    );
  }

  // Show landing page for all users when authenticated (including localhost bypass)
  return <FleetFlowLandingPage />;
}
