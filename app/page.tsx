'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import with error boundary
const FleetFlowLandingPage = dynamic(
  () => import('./components/FleetFlowLandingPage'),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '18px',
        }}
      >
        Loading FleetFlow...
      </div>
    ),
  }
);

function FallbackComponent() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>FleetFlow™</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        Advanced Transportation Management System
      </p>
      <div
        style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '2rem',
          borderRadius: '10px',
          maxWidth: '600px',
        }}
      >
        <h2>Welcome to FleetFlow</h2>
        <p>
          Your comprehensive TMS platform for freight brokers, carriers, and
          shippers.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '1rem',
          }}
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

export default function HomePage() {
  console.log('🚀 FleetFlow Homepage Loading');

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          /* KILL ALL AUTH OVERLAYS AND MODALS */
          .modal-overlay, .auth-overlay, .signin-overlay { display: none !important; }
          .modal, .auth-modal, .signin-modal { display: none !important; }
          [class*="auth"], [class*="signin"], [class*="login"] { display: none !important; }
          body { overflow: auto !important; }
        `,
        }}
      />
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 9999,
        }}
      >
        <Suspense
          fallback={
            <div
              style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              Loading...
            </div>
          }
        >
          <FleetFlowLandingPage />
        </Suspense>
      </div>
    </>
  );
}
