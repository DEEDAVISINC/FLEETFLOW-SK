'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { TwoFactorVerification } from '../../components/TwoFactorVerification';
import { twoFactorAuthService } from '../../services/TwoFactorAuthService';
import UserIdentifierService from '../../services/user-identifier-service';

type AuthStep = 'credentials' | 'two-factor';

export default function SignIn() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [authStep, setAuthStep] = useState<AuthStep>('credentials');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingUser, setPendingUser] = useState<{
    email: string;
    name: string;
    role: string;
  } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials');
        setIsLoading(false);
        return;
      }

      const availableMethods = twoFactorAuthService.getAvailableMethods(
        credentials.email
      );

      if (availableMethods.length === 0) {
        router.push('/');
        return;
      }

      const userInfo = getUserInfo(credentials.email);
      setPendingUser(userInfo);
      setAuthStep('two-factor');
    } catch (error) {
      setError('Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorVerified = async () => {
    if (!pendingUser) return;

    try {
      const userId = getUserId(pendingUser.email);
      const subscriptionResponse = await fetch(
        '/api/auth/verify-subscription',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userId,
            email: pendingUser.email,
          }),
        }
      );

      const subscriptionResult = await subscriptionResponse.json();

      if (!subscriptionResponse.ok) {
        if (subscriptionResult.requiresPayment) {
          router.push(
            '/plans?message=' + encodeURIComponent(subscriptionResult.message)
          );
          return;
        }
        setError(
          subscriptionResult.error || 'Subscription verification failed'
        );
        setAuthStep('credentials');
        return;
      }

      router.push('/');
    } catch (error) {
      setError('Failed to complete authentication');
      setAuthStep('credentials');
    }
  };

  const handleTwoFactorCancel = () => {
    setAuthStep('credentials');
    setPendingUser(null);
    setError('');
  };

  const getUserInfo = (email: string) => {
    const userMap = {
      'admin@fleetflowapp.com': {
        email,
        name: 'FleetFlow Admin',
        role: 'admin',
      },
      'dispatch@fleetflowapp.com': {
        email,
        name: 'Dispatch Manager',
        role: 'dispatcher',
      },
      'driver@fleetflowapp.com': { email, name: 'John Smith', role: 'driver' },
      'broker@fleetflowapp.com': {
        email,
        name: 'Sarah Wilson',
        role: 'broker',
      },
      'vendor@abcmanufacturing.com': {
        email,
        name: 'ABC Manufacturing Corp',
        role: 'vendor',
      },
      'vendor@retaildist.com': {
        email,
        name: 'Retail Distribution Inc',
        role: 'vendor',
      },
      'vendor@techsolutions.com': {
        email,
        name: 'Tech Solutions LLC',
        role: 'vendor',
      },
    };

    return (
      userMap[email as keyof typeof userMap] || {
        email,
        name: 'User',
        role: 'user',
      }
    );
  };

  const getUserId = (email: string): string => {
    const userIdentifierService = UserIdentifierService.getInstance();
    return userIdentifierService.getUserId(email);
  };

  if (authStep === 'two-factor' && pendingUser) {
    return (
      <TwoFactorVerification
        email={pendingUser.email}
        onVerified={handleTwoFactorVerified}
        onCancel={handleTwoFactorCancel}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
        padding: '60px 16px 16px 16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Elements */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
          radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)
        `,
          animation: 'pulse 4s ease-in-out infinite alternate',
        }}
      />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background:
                'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6, #ef4444, #f59e0b)',
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
            }}
          >
            <div
              style={{
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
              }}
            >
              <span style={{ fontSize: '32px' }}>🔐</span>
            </div>
            <div>
              <h1
                style={{
                  fontSize: '32px',
                  fontWeight: '800',
                  color: 'white',
                  margin: '0 0 8px 0',
                  textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                  background: 'linear-gradient(135deg, #ffffff, #e2e8f0)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textAlign: 'center',
                }}
              >
                🔐 FLEETFLOW™ AUTHENTICATION PORTAL
              </h1>
              <p
                style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: '0',
                  fontWeight: '500',
                  textAlign: 'center',
                }}
              >
                Secure Access to Your Transportation Management Command Center
              </p>
            </div>
          </div>
        </div>

        {/* Main Authentication Form */}
        <div
          style={{
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          {/* Sign-in Form */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderLeft: '4px solid #3b82f6',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              marginBottom: '32px',
            }}
          >
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: 'white',
                margin: '0 0 24px 0',
                textAlign: 'center',
              }}
            >
              Sign In to Your Account
            </h2>

            <form className='space-y-6' onSubmit={handleSubmit}>
              <input type='hidden' name='remember' defaultValue='true' />

              {/* Email Input */}
              <div>
                <label
                  htmlFor='email-address'
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '8px',
                  }}
                >
                  Email Address
                </label>
                <input
                  id='email-address'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                  placeholder='Enter your email'
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value })
                  }
                />
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor='password'
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '8px',
                  }}
                >
                  Password
                </label>
                <input
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='current-password'
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                  placeholder='Enter your password'
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                />
              </div>

              {/* Remember me & Forgot Password */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    id='remember-me'
                    name='remember-me'
                    type='checkbox'
                    style={{
                      marginRight: '8px',
                      width: '16px',
                      height: '16px',
                      accentColor: '#3b82f6',
                    }}
                  />
                  <label
                    htmlFor='remember-me'
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      cursor: 'pointer',
                    }}
                  >
                    Remember me
                  </label>
                </div>

                <Link
                  href='/auth/forgot-password'
                  style={{
                    fontSize: '14px',
                    color: '#3b82f6',
                    textDecoration: 'none',
                    fontWeight: '500',
                  }}
                >
                  Forgot password?
                </Link>
              </div>

              {/* Error Message */}
              {error && (
                <div
                  style={{
                    padding: '12px 16px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    color: '#fca5a5',
                    fontSize: '14px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>⚠️</span>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Sign In Button */}
              <button
                type='submit'
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  background: isLoading
                    ? 'rgba(59, 130, 246, 0.5)'
                    : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow =
                      '0 6px 20px rgba(59, 130, 246, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow =
                      '0 4px 16px rgba(59, 130, 246, 0.3)';
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                      }}
                    />
                    Signing in...
                  </>
                ) : (
                  '🔐 Sign In'
                )}
              </button>

              {/* Sign Up Link */}
              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                  }}
                >
                  Don't have an account?{' '}
                  <Link
                    href='/auth/signup'
                    style={{
                      color: '#10b981',
                      textDecoration: 'none',
                      fontWeight: '600',
                    }}
                  >
                    Create one here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }
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
