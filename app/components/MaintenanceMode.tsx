'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface MaintenanceModeProps {
  children: React.ReactNode;
}

export default function MaintenanceMode({ children }: MaintenanceModeProps) {
  const pathname = usePathname();
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Check client-side environment after hydration
  useEffect(() => {
    setIsClient(true);
    // Check if we're in development environment (localhost, 127.0.0.1, etc.)
    const isDev =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.startsWith('192.168.') ||
      window.location.hostname.endsWith('.local') ||
      process.env.NODE_ENV === 'development';

    setIsDevelopment(isDev);
  }, []);

  // During SSR or before hydration, default to allowing content (safer for development)
  if (!isClient) {
    return <>{children}</>;
  }

  // Allow full access in development environment
  if (isDevelopment) {
    return <>{children}</>;
  }

  // In production, allow access to privacy policy and essential legal pages
  const allowedPaths = [
    '/privacy-policy',
    '/terms-of-service',
    '/privacy',
    '/terms',
    '/legal',
    '/about', // Allow About page to be accessible
    '/vendor-portal', // Allow Vendor Portal to be accessible
    '/vendor-management', // Allow Vendor Management page to be accessible
    '/admin/driver-otr-flow', // Allow Driver OTR Flow page to be accessible
    '/api', // Allow API routes to function
  ];

  // Check if current path should be allowed in production
  const isAllowedPath = allowedPaths.some((path) => pathname?.startsWith(path));

  // If on an allowed path in production, render normally
  if (isAllowedPath) {
    return <>{children}</>;
  }

  // Otherwise, show maintenance page
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      {/* Logo/Header */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '40px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          maxWidth: '600px',
          width: '100%',
          marginBottom: '30px',
        }}
      >
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚛</div>
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #fff 0%, #e2e8f0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          FleetFlow™
        </h1>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '15px',
            color: '#f7fafc',
          }}
        >
          Coming Soon
        </h2>
        <p
          style={{
            fontSize: '1.1rem',
            color: 'rgba(255, 255, 255, 0.8)',
            lineHeight: '1.6',
            marginBottom: '20px',
          }}
        >
          We're working hard to bring you the most advanced transportation
          management system. Our platform will be launching soon with
          cutting-edge features for fleet management, dispatch operations, and
          logistics optimization.
        </p>

        {/* Features Preview */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginTop: '25px',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '15px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📊</div>
            <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
              Advanced Analytics
            </div>
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '15px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🎯</div>
            <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
              Smart Dispatch
            </div>
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '15px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🤖</div>
            <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
              AI Automation
            </div>
          </div>
        </div>
      </div>

      {/* Contact & Legal */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '25px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          maxWidth: '600px',
          width: '100%',
        }}
      >
        <h3
          style={{
            fontSize: '1.2rem',
            fontWeight: '600',
            marginBottom: '15px',
            color: '#f7fafc',
          }}
        >
          Get Notified When We Launch
        </h3>
        <p
          style={{
            fontSize: '0.95rem',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '20px',
          }}
        >
          Be the first to know when FleetFlow™ goes live. Contact us for early
          access opportunities.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: '20px',
          }}
        >
          <a
            href='mailto:contact@fleetflowapp.com'
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              textDecoration: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '500',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            📧 Contact Us
          </a>
          <a
            href='/privacy-policy'
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              color: 'rgba(255, 255, 255, 0.9)',
              textDecoration: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '500',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
          >
            🔒 Privacy Policy
          </a>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            paddingTop: '15px',
            fontSize: '0.8rem',
            color: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          © 2024 FLEETFLOW TMS LLC All rights reserved.
        </div>
      </div>

      {/* Status Indicator */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'rgba(34, 197, 94, 0.2)',
          border: '1px solid rgba(34, 197, 94, 0.4)',
          borderRadius: '12px',
          padding: '8px 12px',
          fontSize: '0.8rem',
          color: '#86efac',
          backdropFilter: 'blur(10px)',
        }}
      >
        🟢 Development in Progress
      </div>
    </div>
  );
}
