'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Demo dispatcher users
const MOCK_DISPATCHERS: User[] = [
  {
    id: 'disp_001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@fleetflow.com',
    role: 'dispatcher'
  },
  {
    id: 'disp_002', 
    name: 'Mike Chen',
    email: 'mike.chen@fleetflow.com',
    role: 'dispatcher'
  },
  {
    id: 'disp_003',
    name: 'Jessica Martinez',
    email: 'jessica.martinez@fleetflow.com',
    role: 'dispatcher'
  }
];

interface DispatcherLoginProps {}

export default function DispatcherLogin() {
  const [selectedDispatcher, setSelectedDispatcher] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Get all dispatchers for login selection
  const dispatchers = MOCK_DISPATCHERS;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!selectedDispatcher) {
        setError('Please select a dispatcher');
        setLoading(false);
        return;
      }

      if (!password) {
        setError('Please enter your password');
        setLoading(false);
        return;
      }

      // In production, this would validate against a real auth system
      // For demo purposes, we'll accept "dispatch123" as the password
      if (password !== 'dispatch123') {
        setError('Invalid password. Use "dispatch123" for demo.');
        setLoading(false);
        return;
      }

      // Set the current dispatcher in session/localStorage
      const dispatcher = dispatchers.find(d => d.id === selectedDispatcher);
      if (dispatcher) {
        // Store dispatcher session
        localStorage.setItem('currentDispatcherId', dispatcher.id);
        localStorage.setItem('dispatcherSession', JSON.stringify({
          id: dispatcher.id,
          name: dispatcher.name,
          email: dispatcher.email,
          loginTime: new Date().toISOString()
        }));

        // Redirect to individual dispatcher portal
        router.push('/dispatch/portal');
      } else {
        setError('Dispatcher not found. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentDispatcherId');
    localStorage.removeItem('dispatcherSession');
    router.push('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* Back Button */}
      <div style={{ 
        position: 'absolute', 
        top: '24px', 
        left: '24px' 
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <button style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '16px'
          }}>
            ← Back to Dashboard
          </button>
        </Link>
      </div>

      {/* Login Form */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '48px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: '500px',
        width: '100%'
      }}>
        {/* Header */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '32px' 
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '12px'
          }}>
            🚛
          </div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: '0 0 8px 0'
          }}>
            Dispatch Central
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            margin: 0
          }}>
            Secure Dispatcher Login Portal
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Select Dispatcher Account
            </label>
            <select
              value={selectedDispatcher}
              onChange={(e) => setSelectedDispatcher(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '2px solid #e5e7eb',
                fontSize: '16px',
                background: 'white',
                color: '#1f2937',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
              }}
            >
              <option value="">Choose your dispatcher account...</option>
              {dispatchers.map((dispatcher) => (
                <option key={dispatcher.id} value={dispatcher.id}>
                  {dispatcher.name} ({dispatcher.email})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '2px solid #e5e7eb',
                fontSize: '16px',
                background: 'white',
                color: '#1f2937',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
              }}
            />
          </div>

          {error && (
            <div style={{
              background: '#fee2e2',
              border: '1px solid #ef4444',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '20px',
              color: '#dc2626',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              border: 'none',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
            }}
          >
            {loading ? '🔄 Signing In...' : '🚛 Sign In to Dispatch Central'}
          </button>
        </form>

        {/* Demo Info */}
        <div style={{
          marginTop: '32px',
          padding: '16px',
          background: '#f0f9ff',
          borderRadius: '12px',
          border: '1px solid #3b82f6'
        }}>
          <h4 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#1e40af',
            margin: '0 0 8px 0'
          }}>
            🎯 Demo Login Instructions
          </h4>
          <p style={{
            fontSize: '13px',
            color: '#1e40af',
            margin: '0 0 12px 0',
            lineHeight: '1.4'
          }}>
            <strong>Step 1:</strong> Select any dispatcher from the dropdown<br />
            <strong>Step 2:</strong> Enter password: <strong>dispatch123</strong><br />
            <strong>Step 3:</strong> Click "Sign In to Dispatch Central"
          </p>
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#1e40af'
          }}>
            <strong>Available Dispatchers:</strong><br />
            • Sarah Johnson (Operations)<br />
            • Mike Chen (Regional)<br />
            • Jessica Martinez (Emergency)
          </div>
        </div>

        {/* Available Dispatchers Info */}
        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: '#f9fafb',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <h4 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            margin: '0 0 8px 0'
          }}>
            Available Dispatchers
          </h4>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            {dispatchers.map((dispatcher, index) => (
              <div key={dispatcher.id} style={{ marginBottom: '4px' }}>
                <strong>{dispatcher.name}</strong> - {dispatcher.email}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
