'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface BrokerLoginData {
  brokerCode: string;
  password: string;
  companyName: string;
}

export default function BrokerLoginPage() {
  const [loginData, setLoginData] = useState<BrokerLoginData>({
    brokerCode: '',
    password: '',
    companyName: ''
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();

  // Auto-login with demo credentials
  React.useEffect(() => {
    const demoSession = {
      id: 'broker-js001',
      brokerCode: 'JS001',
      brokerName: 'John Smith',
      companyName: 'Global Freight Solutions',
      email: 'john.smith@globalfreight.com',
      role: 'broker',
      loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('brokerSession', JSON.stringify(demoSession));
    router.push('/broker/dashboard');
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (loginError) setLoginError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      // Validate required fields
      if (!loginData.brokerCode || !loginData.password) {
        throw new Error('Please enter both broker code and password');
      }

      // Mock authentication - replace with real auth
      const validBrokers = [
        { code: 'JS001', password: 'broker123', brokerName: 'John Smith', companyName: 'Global Freight Solutions', email: 'john.smith@globalfreight.com' },
        { code: 'MG002', password: 'swift456', brokerName: 'Maria Garcia', companyName: 'Swift Freight', email: 'maria.garcia@swift.com' },
        { code: 'DW003', password: 'reliable789', brokerName: 'David Wilson', companyName: 'Express Cargo', email: 'david.wilson@express.com' }
      ];

      const broker = validBrokers.find(b => 
        b.code.toLowerCase() === loginData.brokerCode.toLowerCase() && 
        b.password === loginData.password
      );

      if (!broker) {
        throw new Error('Invalid broker code or password');
      }

      // Store broker session (in production, use proper auth)
      localStorage.setItem('brokerSession', JSON.stringify({
        id: `broker-${broker.code.toLowerCase()}`,
        brokerCode: broker.code,
        brokerName: broker.brokerName,
        companyName: broker.companyName,
        email: broker.email,
        role: 'broker',
        loginTime: new Date().toISOString()
      }));

      // Redirect to broker dashboard
      router.push('/broker/dashboard');
      
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      if (!loginData.brokerCode || !loginData.password || !loginData.companyName) {
        throw new Error('Please fill in all fields to register');
      }

      // Mock registration - in production, this would create a new broker account
      const newBrokerCode = `BR${Math.random().toString(36).substr(2, 3).toUpperCase()}`;
      
      localStorage.setItem('brokerSession', JSON.stringify({
        id: `broker-${newBrokerCode.toLowerCase()}`,
        brokerCode: newBrokerCode,
        companyName: loginData.companyName,
        email: `contact@${loginData.companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        role: 'broker',
        loginTime: new Date().toISOString(),
        isNewRegistration: true
      }));

      router.push('/broker/dashboard');
      
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '500px',
        margin: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Logo and Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '32px'
          }}>
            📦
          </div>
          <h1 style={{
            color: '#FF9800',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            margin: '0 0 10px 0'
          }}>Broker Box</h1>
          <p style={{
            color: '#666',
            fontSize: '1.1rem',
            margin: 0
          }}>FleetFlow Broker Portal Access</p>
        </div>

        {/* Toggle between Login and Register */}
        <div style={{
          display: 'flex',
          marginBottom: '30px',
          background: '#f5f5f5',
          borderRadius: '10px',
          padding: '4px'
        }}>
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
              background: !isRegistering ? '#FF9800' : 'transparent',
              color: !isRegistering ? 'white' : '#666',
              transition: 'all 0.3s ease'
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
              background: isRegistering ? '#FF9800' : 'transparent',
              color: isRegistering ? 'white' : '#666',
              transition: 'all 0.3s ease'
            }}
          >
            Register
          </button>
        </div>

        {/* Error Message */}
        {loginError && (
          <div style={{
            background: '#ffebee',
            color: '#c62828',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            border: '1px solid #ffcdd2'
          }}>
            {loginError}
          </div>
        )}

        {/* Login/Register Form */}
        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          {isRegistering && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={loginData.companyName}
                onChange={handleInputChange}
                placeholder="Enter your company name"
                style={{
                  width: '100%',
                  padding: '15px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '10px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#FF9800'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Broker Code
            </label>
            <input
              type="text"
              name="brokerCode"
              value={loginData.brokerCode}
              onChange={handleInputChange}
              placeholder={isRegistering ? "Will be assigned after registration" : "Enter your broker code"}
              disabled={isRegistering}
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                boxSizing: 'border-box',
                background: isRegistering ? '#f5f5f5' : 'white'
              }}
              onFocus={(e) => e.target.style.borderColor = '#FF9800'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#FF9800'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            style={{
              width: '100%',
              padding: '15px',
              background: isLoggingIn ? '#ccc' : 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: isLoggingIn ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
            onMouseOver={(e) => {
              if (!isLoggingIn) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(255,152,0,0.3)';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {isLoggingIn ? 'Please wait...' : (isRegistering ? 'Register Company' : 'Access Broker Box')}
          </button>
        </form>

        {/* Demo Credentials */}
        {!isRegistering && (
          <div style={{
            marginTop: '30px',
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '10px',
            border: '1px solid #e9ecef'
          }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px', textTransform: 'uppercase' }}>
              Demo Credentials
            </h4>
            <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.5' }}>
              <div><strong>Broker Code:</strong> PL001 | <strong>Password:</strong> broker123</div>
              <div><strong>Broker Code:</strong> SF002 | <strong>Password:</strong> swift456</div>
              <div><strong>Broker Code:</strong> RL003 | <strong>Password:</strong> reliable789</div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          color: '#999',
          fontSize: '12px'
        }}>
          <p>Powered by FleetFlow | Secure Broker Portal</p>
          <p>Need help? Contact: support@fleetflowapp.com</p>
        </div>
      </div>
    </div>
  );
}
