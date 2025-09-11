'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    'pending' | 'success' | 'error'
  >('pending');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const token = searchParams.get('token');

    if (emailParam) {
      setEmail(emailParam);
    }

    // If there's a token in the URL, automatically verify
    if (token) {
      handleVerification(token);
    }
  }, [searchParams]);

  const handleVerification = async (token: string) => {
    setIsVerifying(true);

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (response.ok) {
        setVerificationStatus('success');
        setMessage('Your email has been verified successfully!');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/signin?verified=true');
        }, 3000);
      } else {
        setVerificationStatus('error');
        setMessage(result.message || 'Verification failed');
      }
    } catch (error) {
      setVerificationStatus('error');
      setMessage('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setMessage('Please enter your email address');
      return;
    }

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Verification email sent! Please check your inbox.');
      } else {
        setMessage(result.message || 'Failed to send verification email');
      }
    } catch (error) {
      setMessage('Failed to send verification email. Please try again.');
    }
  };

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
          maxWidth: '500px',
          width: '100%',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(15px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '40px',
          textAlign: 'center',
        }}
      >
        {/* Logo */}
        <Link href='/' style={{ textDecoration: 'none' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 30px',
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            FF
          </div>
        </Link>

        {/* Status Icon */}
        <div
          style={{
            fontSize: '64px',
            marginBottom: '24px',
          }}
        >
          {isVerifying ? (
            <div
              style={{
                width: '64px',
                height: '64px',
                border: '4px solid rgba(59, 130, 246, 0.3)',
                borderTop: '4px solid #3b82f6',
                borderRadius: '50%',
                margin: '0 auto',
                animation: 'spin 1s linear infinite',
              }}
            />
          ) : verificationStatus === 'success' ? (
            '✅'
          ) : verificationStatus === 'error' ? (
            '❌'
          ) : (
            '📧'
          )}
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #3b82f6 0%, #14b8a6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px',
          }}
        >
          {isVerifying
            ? 'Verifying...'
            : verificationStatus === 'success'
              ? 'Email Verified!'
              : verificationStatus === 'error'
                ? 'Verification Failed'
                : 'Check Your Email'}
        </h1>

        {/* Message */}
        <div
          style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '32px',
          }}
        >
          {message || (
            <>
              We've sent a verification link to{' '}
              <strong style={{ color: '#3b82f6' }}>{email}</strong>
              <br />
              <br />
              Click the link in your email to complete your registration and
              start your 14-day free trial.
            </>
          )}
        </div>

        {/* Action Buttons */}
        {verificationStatus === 'success' ? (
          <Link href='/auth/signin?verified=true'>
            <button
              style={{
                padding: '16px 32px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              Continue to Sign In
            </button>
          </Link>
        ) : verificationStatus === 'pending' && !isVerifying ? (
          <div style={{ display: 'grid', gap: '16px' }}>
            {/* Email input for resending */}
            {!email && (
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter your email address'
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '16px',
                }}
              />
            )}

            <button
              onClick={handleResendVerification}
              style={{
                padding: '16px 32px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              Resend Verification Email
            </button>

            <Link href='/auth/signin'>
              <button
                style={{
                  padding: '16px 32px',
                  borderRadius: '8px',
                  border: 'none',
                  background:
                    'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                Back to Sign In
              </button>
            </Link>
          </div>
        ) : verificationStatus === 'error' ? (
          <div style={{ display: 'grid', gap: '16px' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '16px 32px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              Try Again
            </button>

            <Link href='/auth/signup'>
              <button
                style={{
                  padding: '16px 32px',
                  borderRadius: '8px',
                  border: 'none',
                  background:
                    'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                Create New Account
              </button>
            </Link>
          </div>
        ) : null}

        {/* Help Text */}
        <div
          style={{
            marginTop: '32px',
            padding: '20px',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '12px',
            fontSize: '14px',
            lineHeight: '1.5',
          }}
        >
          <strong style={{ color: '#3b82f6' }}>📍 Can't find the email?</strong>
          <br />
          <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Check your spam folder or promotions tab. The email comes from
            noreply@fleetflowapp.com
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
