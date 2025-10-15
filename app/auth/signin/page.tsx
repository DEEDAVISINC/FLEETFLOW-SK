'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignIn() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('🔐 Starting login attempt for:', credentials.email);

    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      console.log('🔑 SignIn result:', result);

      if (result?.error) {
        console.error('❌ Login error:', result.error);
        setError('Invalid credentials');
      } else if (result?.ok) {
        console.log('✅ Login successful! Redirecting...');
        // Force full page reload to ensure session is loaded
        window.location.href = '/fleetflowdash';
      } else {
        console.warn('⚠️ Unexpected result:', result);
        setError('An unexpected error occurred');
      }
    } catch (error) {
      console.error('❌ Exception during sign in:', error);
      setError('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '20px',
        paddingTop: '120px', // Increased space for navigation bar
        paddingBottom: '40px', // Added bottom padding
      }}
    >
      {/* Hero Header */}
      <div
        style={{
          textAlign: 'center',
          padding: '20px 20px 30px',
          position: 'relative',
          width: '100%',
          marginBottom: '20px',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: '900',
            background:
              'linear-gradient(135deg, #3b82f6 0%, #10b981 50%, #f59e0b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px',
            letterSpacing: '-0.02em',
          }}
        >
          FleetFlow Business Intelligence
        </h1>
        <p
          style={{
            fontSize: '1.1rem',
            color: 'rgba(255,255,255,0.8)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6',
          }}
        >
          Sign in to access your transportation management platform
        </p>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          marginTop: '20px', // Reduced from 60px to create better spacing
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Logo */}
          <div
            style={{
              marginBottom: '32px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '20px',
                background:
                  'linear-gradient(135deg, #3b82f6 0%, #10b981 50%, #f59e0b 100%)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              }}
            >
              <span
                style={{
                  fontSize: '2rem',
                  fontWeight: '900',
                  color: 'white',
                }}
              >
                FF
              </span>
            </div>
            <h2
              style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '8px',
              }}
            >
              FleetFlow
            </h2>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '16px',
              }}
            >
              Transportation Intelligence Platform
            </p>
          </div>

          {/* Sign In Form */}
          <div>
            {error && (
              <div
                style={{
                  marginBottom: '20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  background: 'rgba(239, 68, 68, 0.1)',
                  padding: '16px',
                }}
              >
                <p
                  style={{
                    fontSize: '14px',
                    color: '#ef4444',
                    margin: '0',
                  }}
                >
                  ⚠️ {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label
                  htmlFor='email'
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
                  id='email'
                  type='email'
                  required
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  style={{
                    width: '100%',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '14px 16px',
                    fontSize: '16px',
                    color: 'white',
                    transition: 'all 0.3s',
                    outline: 'none',
                  }}
                  placeholder='your@email.com'
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                    e.target.style.boxShadow =
                      '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
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
                  type='password'
                  required
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  style={{
                    width: '100%',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '14px 16px',
                    fontSize: '16px',
                    color: 'white',
                    transition: 'all 0.3s',
                    outline: 'none',
                  }}
                  placeholder='••••••••'
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                    e.target.style.boxShadow =
                      '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <button
                type='submit'
                disabled={isLoading}
                style={{
                  width: '100%',
                  borderRadius: '16px',
                  border: 'none',
                  background: isLoading
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'linear-gradient(135deg, #3b82f6 0%, #10b981 50%, #f59e0b 100%)',
                  padding: '16px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'white',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: isLoading
                    ? 'none'
                    : '0 10px 25px rgba(59, 130, 246, 0.3)',
                  opacity: isLoading ? 0.6 : 1,
                }}
                onMouseOver={(e) => {
                  if (!isLoading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow =
                      '0 15px 35px rgba(59, 130, 246, 0.4)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isLoading) {
                    e.target.style.transform = 'translateY(0px)';
                    e.target.style.boxShadow =
                      '0 10px 25px rgba(59, 130, 246, 0.3)';
                  }
                }}
              >
                {isLoading ? (
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                      }}
                    />
                    Signing in...
                  </span>
                ) : (
                  '🚀 Sign In to FleetFlow'
                )}
              </button>
            </form>
          </div>

          <div style={{ marginTop: '32px' }}>
            <div
              style={{
                position: 'relative',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: '0',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '1px',
                    background: 'rgba(255, 255, 255, 0.2)',
                  }}
                />
              </div>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  fontSize: '14px',
                }}
              >
                <span
                  style={{
                    background: 'rgba(30, 41, 59, 1)',
                    padding: '0 16px',
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type='button'
              onClick={() => signIn('google')}
              style={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '12px 16px',
                fontSize: '16px',
                fontWeight: '500',
                color: 'rgba(255, 255, 255, 0.9)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                gap: '12px',
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <svg
                style={{ width: '20px', height: '20px' }}
                viewBox='0 0 24 24'
              >
                <path
                  fill='#4285F4'
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                />
                <path
                  fill='#34A853'
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                />
                <path
                  fill='#FBBC04'
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                />
                <path
                  fill='#EA4335'
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                />
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '32px',
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '14px',
          }}
        >
          <p style={{ margin: '0' }}>
            Need help? Contact support at{' '}
            <span style={{ color: '#10b981', fontWeight: '500' }}>
              support@fleetflowapp.com
            </span>
          </p>
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
