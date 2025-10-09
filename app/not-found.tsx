'use client';

import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1f2937, #374151, #4b5563)',
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(15px)',
          borderRadius: '20px',
          padding: '48px',
          textAlign: 'center',
          maxWidth: '600px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            fontSize: '64px',
            marginBottom: '24px',
          }}
        >
          🔍
        </div>

        <h1
          style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: '0 0 16px 0',
          }}
        >
          Page Not Found
        </h1>

        <p
          style={{
            fontSize: '18px',
            color: '#6b7280',
            margin: '0 0 32px 0',
            lineHeight: '1.6',
          }}
        >
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link href='/' style={{ textDecoration: 'none' }}>
          <button
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            Go to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}











