'use client';

import Link from 'next/link';

export function MinimalLandingPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <h1
        style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: '#f59e0b',
        }}
      >
        FleetFlow
      </h1>

      <p
        style={{
          fontSize: '1.2rem',
          color: 'rgba(255,255,255,0.8)',
          marginBottom: '30px',
          maxWidth: '600px',
        }}
      >
        The complete transportation management platform
      </p>

      <div style={{ display: 'flex', gap: '15px' }}>
        <Link href='/settings'>
          <button
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Settings
          </button>
        </Link>

        <Link href='/'>
          <button
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}

