'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TrialActivatedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Auto-redirect to email verification
          router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, router]);

  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 14);

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          width: '100%',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(15px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '40px',
          textAlign: 'center',
        }}
      >
        {/* Success Animation */}
        <div
          style={{
            width: '120px',
            height: '120px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 30px',
            fontSize: '48px',
            animation: 'pulse 2s infinite',
          }}
        >
          🎉
        </div>

        {/* Header */}
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px',
          }}
        >
          Trial Activated!
        </h1>

        <p
          style={{
            fontSize: '1.2rem',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '32px',
            lineHeight: '1.6',
          }}
        >
          🚀 Your FleetFlow trial is ready to go! You now have{' '}
          <strong>14 days</strong> of full access to explore all features.
        </p>

        {/* Trial Details Card */}
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
          }}
        >
          <div style={{ display: 'grid', gap: '16px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Trial Start Date:
              </span>
              <span style={{ fontWeight: '600' }}>
                {new Date().toLocaleDateString()}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Trial End Date:
              </span>
              <span style={{ fontWeight: '600' }}>
                {trialEndDate.toLocaleDateString()}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Account Email:
              </span>
              <span style={{ fontWeight: '600' }}>{email}</span>
            </div>
          </div>
        </div>

        {/* What's Next Section */}
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
            textAlign: 'left',
          }}
        >
          <h3
            style={{
              fontSize: '1.3rem',
              fontWeight: '700',
              color: '#3b82f6',
              marginBottom: '16px',
              textAlign: 'center',
            }}
          >
            📧 Next Step: Verify Your Email
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div
              style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}
            >
              <div
                style={{
                  minWidth: '24px',
                  height: '24px',
                  background: '#3b82f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginTop: '2px',
                }}
              >
                1
              </div>
              <div>
                <strong style={{ color: 'white' }}>Check your email</strong>
                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  We've sent a verification link to <strong>{email}</strong>
                </p>
              </div>
            </div>
            <div
              style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}
            >
              <div
                style={{
                  minWidth: '24px',
                  height: '24px',
                  background: '#3b82f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginTop: '2px',
                }}
              >
                2
              </div>
              <div>
                <strong style={{ color: 'white' }}>
                  Click the verification link
                </strong>
                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  This will activate your account and start your trial
                </p>
              </div>
            </div>
            <div
              style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}
            >
              <div
                style={{
                  minWidth: '24px',
                  height: '24px',
                  background: '#3b82f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginTop: '2px',
                }}
              >
                3
              </div>
              <div>
                <strong style={{ color: 'white' }}>
                  Start exploring FleetFlow
                </strong>
                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  Access your dashboard and begin managing your fleet operations
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-redirect Notice */}
        <div
          style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '32px',
            fontSize: '14px',
            color: '#f59e0b',
          }}
        >
          ⏰ Redirecting to email verification in <strong>{countdown}</strong>{' '}
          seconds...
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Link href={`/auth/verify-email?email=${encodeURIComponent(email)}`}>
            <button
              style={{
                padding: '14px 28px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 12px 25px rgba(59, 130, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              📧 Verify Email Now
            </button>
          </Link>

          <Link href='/'>
            <button
              style={{
                padding: '14px 28px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              🏠 Return Home
            </button>
          </Link>
        </div>

        {/* Support Section */}
        <div
          style={{
            marginTop: '40px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.6)',
              marginBottom: '12px',
            }}
          >
            Need help getting started?
          </p>
          <div
            style={{
              display: 'flex',
              gap: '24px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              fontSize: '14px',
            }}
          >
            <Link
              href='/support'
              style={{
                color: '#3b82f6',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              💬 Contact Support
            </Link>
            <Link
              href='/docs'
              style={{
                color: '#3b82f6',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              📚 View Documentation
            </Link>
            <Link
              href='/getting-started'
              style={{
                color: '#3b82f6',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              🚀 Getting Started Guide
            </Link>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}
