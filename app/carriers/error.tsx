'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Carrier portal error:', error);
  }, [error]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #059669, #047857, #0f766e)',
      padding: '80px 20px 20px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(15px)',
        borderRadius: '20px',
        padding: '48px',
        textAlign: 'center',
        maxWidth: '600px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          fontSize: '64px',
          marginBottom: '24px'
        }}>
          🚨
        </div>
        
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#1f2937',
          margin: '0 0 16px 0'
        }}>
          Something went wrong!
        </h1>
        
        <p style={{
          fontSize: '18px',
          color: '#6b7280',
          margin: '0 0 32px 0',
          lineHeight: '1.6'
        }}>
          We encountered an error while loading the carrier portal. This might be a temporary issue.
        </p>
        
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={reset}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #059669, #047857)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #10b981, #059669)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Try again
          </button>
          
          <Link href="/" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid #d1d5db',
              color: '#374151',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f3f4f6';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              Back to Dashboard
            </button>
          </Link>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details style={{
            marginTop: '32px',
            textAlign: 'left',
            background: '#f9fafb',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <summary style={{
              cursor: 'pointer',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Error Details (Development)
            </summary>
            <pre style={{
              background: '#1f2937',
              color: '#f9fafb',
              padding: '12px',
              borderRadius: '6px',
              fontSize: '12px',
              overflow: 'auto',
              whiteSpace: 'pre-wrap'
            }}>
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
} 