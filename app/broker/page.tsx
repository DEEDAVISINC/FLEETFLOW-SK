'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface BrokerLoginData {
  brokerCode: string;
  password: string;
  companyName: string;
}

export default function BrokerLoginPage() {
  const [loginData, setLoginData] = useState<BrokerLoginData>({
    brokerCode: '',
    password: '',
    companyName: '',
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (loginError) setLoginError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      // Mock authentication - in production, this would validate against your backend
      if (!loginData.brokerCode || !loginData.password) {
        throw new Error('Please enter both broker code and password');
      }

      // Store broker session (in production, use proper auth)
      localStorage.setItem(
        'brokerSession',
        JSON.stringify({
          id: `broker-${loginData.brokerCode.toLowerCase()}`,
          brokerCode: loginData.brokerCode.toUpperCase(),
          brokerName: 'Demo Broker',
          companyName: loginData.companyName || 'Demo Company',
          email: `broker@${loginData.companyName?.toLowerCase().replace(/\s+/g, '') || 'demo'}.com`,
          role: 'broker',
          loginTime: new Date().toISOString(),
        })
      );

      // Redirect to broker dashboard
      router.push('/broker/dashboard');
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setLoginError('');
  };

  return (
    <div
      style={{
        background:
          'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #4338ca 50%, #312e81 75%, #1e1b4b 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '32px',
            }}
          >
            🚛
          </div>
          <h1
            style={{
              color: '#333',
              fontSize: '2.2rem',
              fontWeight: 'bold',
              margin: '0 0 10px 0',
            }}
          >
            Broker Portal
          </h1>
          <p
            style={{
              color: '#666',
              fontSize: '1rem',
              margin: 0,
            }}
          >
            FleetFlow Broker Access
          </p>
        </div>

        {/* Toggle between Login and Register */}
        <div
          style={{
            display: 'flex',
            marginBottom: '30px',
            background: '#f5f5f5',
            borderRadius: '10px',
            padding: '4px',
          }}
        >
          <button
            onClick={() => setIsRegistering(false)}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              background: !isRegistering ? '#8b5cf6' : 'transparent',
              color: !isRegistering ? 'white' : '#666',
              transition: 'all 0.3s ease',
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsRegistering(true)}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              background: isRegistering ? '#8b5cf6' : 'transparent',
              color: isRegistering ? 'white' : '#666',
              transition: 'all 0.3s ease',
            }}
          >
            Register
          </button>
        </div>

        {/* Error Message */}
        {loginError && (
          <div
            style={{
              background: '#ffebee',
              color: '#c62828',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              border: '1px solid #ffcdd2',
            }}
          >
            {loginError}
          </div>
        )}

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          {isRegistering && (
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#333',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Company Name
              </label>
              <input
                type='text'
                name='companyName'
                value={loginData.companyName}
                onChange={handleInputChange}
                placeholder='Enter your company name'
                style={{
                  width: '100%',
                  padding: '15px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '10px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#8b5cf6')}
                onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
              />
            </div>
          )}

          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              Broker Code
            </label>
            <input
              type='text'
              name='brokerCode'
              value={loginData.brokerCode}
              onChange={handleInputChange}
              placeholder='Enter your broker code'
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#8b5cf6')}
              onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              Password
            </label>
            <input
              type='password'
              name='password'
              value={loginData.password}
              onChange={handleInputChange}
              placeholder='Enter your password'
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#8b5cf6')}
              onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
            />
          </div>

          <button
            type='submit'
            disabled={isLoggingIn}
            style={{
              width: '100%',
              padding: '15px',
              background: isLoggingIn
                ? '#ccc'
                : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: isLoggingIn ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
            onMouseOver={(e) => {
              if (!isLoggingIn) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 10px 20px rgba(139, 92, 246, 0.3)';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoggingIn) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {isLoggingIn
              ? 'Processing...'
              : isRegistering
                ? 'Create Account'
                : 'Access Portal'}
          </button>
        </form>

        {/* Demo Credentials */}
        {!isRegistering && (
          <div
            style={{
              marginTop: '30px',
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '10px',
              border: '1px solid #e9ecef',
            }}
          >
            <h4
              style={{
                margin: '0 0 15px 0',
                color: '#666',
                fontSize: '14px',
                textTransform: 'uppercase',
              }}
            >
              Demo Credentials
            </h4>
            <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.5' }}>
              <div>
                <strong>Broker Code:</strong> DEMO001 |{' '}
                <strong>Password:</strong> demo123
              </div>
              <div>
                <strong>Broker Code:</strong> TEST002 |{' '}
                <strong>Password:</strong> test456
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '30px',
            color: '#999',
            fontSize: '12px',
          }}
        >
          <p>Powered by FleetFlow | Secure Broker Portal</p>
        </div>
      </div>
    </div>
  );
}
