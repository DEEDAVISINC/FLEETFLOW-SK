'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DriverManagement() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Test if basic mounting works
    console.info('DriverManagement component mounted');
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
          }}
        >
          Loading Driver Management...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
        padding: '80px 20px 20px 20px',
      }}
    >
      {/* Back Button */}
      <div
        style={{ padding: '0 0 24px 0', maxWidth: '1200px', margin: '0 auto' }}
      >
        <Link
          href='/'
          style={{ display: 'inline-block', textDecoration: 'none' }}
        >
          <button
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            ← Back to Dashboard
          </button>
        </Link>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <h1
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '12px',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            }}
          >
            👥 DRIVER MANAGEMENT
          </h1>
          <p
            style={{
              fontSize: '20px',
              color: 'rgba(255,255,255,0.9)',
              margin: 0,
            }}
          >
            Driver Fleet Operations & Performance Monitoring - Testing Mode
          </p>
        </div>

        {/* Simple Test Content */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ color: '#374151', marginBottom: '20px' }}>
            Driver Management System
          </h2>
          <p style={{ color: '#6B7280', marginBottom: '20px' }}>
            This is a simplified version to test the page rendering.
          </p>
          <div
            style={{
              background: '#EFF6FF',
              border: '1px solid #DBEAFE',
              borderRadius: '8px',
              padding: '16px',
              margin: '20px 0',
            }}
          >
            <p style={{ color: '#1E40AF', margin: 0 }}>
              ✅ Component rendered successfully!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
