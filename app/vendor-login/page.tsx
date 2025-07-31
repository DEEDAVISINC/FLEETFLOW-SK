'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { extendedShipperService } from '../services/shipperService';
import React from 'react'; // Added missing import for React.useEffect

export default function VendorLoginPage() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('🔐 Attempting login with:', credentials.username);
      
      const result = extendedShipperService.authenticateShipper(
        credentials.username,
        credentials.password
      );

      console.log('🔐 Authentication result:', result);

      if (result.success && result.shipper) {
        console.log('✅ Login successful for:', result.shipper.companyName);
        
        // Store shipper info in session/localStorage for demo
        localStorage.setItem(
          'vendorSession',
          JSON.stringify({
            shipperId: result.shipper.id,
            companyName: result.shipper.companyName,
            loginTime: new Date().toISOString(),
          })
        );

        console.log('💾 Session stored, redirecting to vendor portal...');

        // Redirect to vendor portal dashboard
        router.push('/vendor-portal');
      } else {
        console.log('❌ Login failed:', result.error);
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      console.error('🚨 Login error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = extendedShipperService.resetShipperPassword(resetEmail);

    if (success) {
      setResetMessage(
        'Password reset instructions have been sent to your email.'
      );
      setShowForgotPassword(false);
      setResetEmail('');
    } else {
      setError('Email not found in our system.');
    }
  };

  const demoCredentials = [
    {
      username: 'abcmfg',
      password: 'temp123',
      company: 'ABC Manufacturing Corp',
      shipperId: 'ABC-204-070', // 9-character identifier
    },
    {
      username: 'retaildist',
      password: 'temp456',
      company: 'Retail Distribution Inc',
      shipperId: 'RDI-204-050', // 9-character identifier
    },
    {
      username: 'techsolutions',
      password: 'temp789',
      company: 'Tech Solutions LLC',
      shipperId: 'TSL-204-085', // 9-character identifier
    },
  ];

  // Debug function to test authentication
  const testAuthentication = () => {
    console.log('🧪 Testing authentication service...');
    demoCredentials.forEach(cred => {
      const result = extendedShipperService.authenticateShipper(cred.username, cred.password);
      console.log(`🧪 Test ${cred.username}:`, result);
    });
  };

  // Run test on component mount
  React.useEffect(() => {
    testAuthentication();
  }, []);

  return (
    <div
      style={{
        background: `
          linear-gradient(135deg, #022c22 0%, #032e2a 25%, #044e46 50%, #042f2e 75%, #0a1612 100%),
          radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.06) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.04) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(6, 182, 212, 0.03) 0%, transparent 50%)
        `,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          maxWidth: '480px',
          width: '100%',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🚚</div>
          <h1
            style={{
              color: 'white',
              fontSize: '2rem',
              fontWeight: '600',
              marginBottom: '8px',
              margin: 0,
            }}
          >
            FleetFlow
          </h1>
          <h2
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '1.2rem',
              fontWeight: '400',
              margin: 0,
            }}
          >
            Shipper Portal
          </h2>
        </div>

        {!showForgotPassword ? (
          /* Login Form */
          <form onSubmit={handleLogin} style={{ marginBottom: '24px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBottom: '8px',
                }}
              >
                Username
              </label>
              <input
                type='text'
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                placeholder='Enter your username'
                required
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBottom: '8px',
                }}
              >
                Password
              </label>
              <input
                type='password'
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                placeholder='Enter your password'
                required
              />
            </div>

            {error && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '20px',
                  color: '#f87171',
                  fontSize: '0.9rem',
                }}
              >
                {error}
              </div>
            )}

            {resetMessage && (
              <div
                style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '20px',
                  color: '#4ade80',
                  fontSize: '0.9rem',
                }}
              >
                {resetMessage}
              </div>
            )}

            <button
              type='submit'
              disabled={isLoading}
              style={{
                width: '100%',
                background: isLoading
                  ? 'rgba(255, 255, 255, 0.3)'
                  : 'linear-gradient(135deg, #14b8a6, #0d9488)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '14px 24px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: isLoading ? 0.7 : 1,
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 6px 20px rgba(20, 184, 166, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {isLoading ? '🔄 Signing In...' : '🚀 Sign In'}
            </button>
          </form>
        ) : (
          /* Forgot Password Form */
          <form
            onSubmit={handleForgotPassword}
            style={{ marginBottom: '24px' }}
          >
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBottom: '8px',
                }}
              >
                Email Address
              </label>
              <input
                type='email'
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                }}
                placeholder='Enter your email address'
                required
              />
            </div>

            <button
              type='submit'
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '14px 24px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '16px',
              }}
            >
              🔄 Reset Password
            </button>

            <button
              type='button'
              onClick={() => setShowForgotPassword(false)}
              style={{
                width: '100%',
                background: 'transparent',
                color: 'rgba(255, 255, 255, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              ← Back to Login
            </button>
          </form>
        )}

        {!showForgotPassword && (
          <>
            {/* Forgot Password Link */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <button
                onClick={() => setShowForgotPassword(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Forgot your password?
              </button>
            </div>

            {/* Demo Credentials */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: '12px',
                  margin: 0,
                }}
              >
                📋 Demo Credentials
              </h3>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '12px',
                }}
              >
                Click any credential to auto-fill:
              </div>
              {demoCredentials.map((cred, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setCredentials({
                      username: cred.username,
                      password: cred.password,
                    })
                  }
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    marginBottom: '6px',
                    color: 'white',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  <div style={{ fontWeight: '600' }}>{cred.company}</div>
                  <div style={{ opacity: 0.7 }}>
                    {cred.username} / {cred.password}
                  </div>
                  <div
                    style={{
                      opacity: 0.6,
                      fontSize: '0.75rem',
                      marginTop: '2px',
                    }}
                  >
                    ID: {cred.shipperId}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Demo Credentials Section */}
        <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
          <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px' }}>
            🧪 Demo Credentials
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {demoCredentials.map((cred, index) => (
              <button
                key={index}
                onClick={() => {
                  setCredentials({ username: cred.username, password: cred.password });
                  console.log('🧪 Testing credentials:', cred);
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '12px',
                  color: 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.9rem'
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>{cred.company}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                  Username: {cred.username} | Password: {cred.password}
                </div>
              </button>
            ))}
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
            Click any credential above to auto-fill the login form
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <div
            style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.8rem' }}
          >
            FleetFlow Shipper Portal • Secure Load Tracking
          </div>
        </div>
      </div>
    </div>
  );
}
