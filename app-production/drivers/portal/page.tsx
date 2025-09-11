'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { onboardingIntegration } from '../../services/onboarding-integration';

export default function DriversPortalPage() {
  const router = useRouter();
  const [loginData, setLoginData] = useState({
    driverIdOrEmail: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    if (loginError) setLoginError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    try {
      if (!loginData.driverIdOrEmail || !loginData.password) {
        setLoginError('Please enter both driver ID/email and password');
        setIsLoading(false);
        return;
      }

      // Get all drivers from the onboarding service
      const allDrivers = onboardingIntegration.getAllDrivers();
      
      // Find driver by ID or email
      const driver = allDrivers.find(d => 
        d.driverId === loginData.driverIdOrEmail || 
        d.personalInfo.email.toLowerCase() === loginData.driverIdOrEmail.toLowerCase()
      );

      if (!driver) {
        setLoginError('Driver not found. Please check your credentials.');
        setIsLoading(false);
        return;
      }

      // In a real app, you'd verify the password against a hash
      // For demo purposes, we'll accept any password for existing drivers
      if (loginData.password.length < 1) {
        setLoginError('Please enter your password');
        setIsLoading(false);
        return;
      }

      // Store the logged-in driver info in sessionStorage for the portal
      sessionStorage.setItem('loggedInDriver', JSON.stringify({
        driverId: driver.driverId,
        name: driver.personalInfo.name,
        email: driver.personalInfo.email,
        loginTime: new Date().toISOString()
      }));

      // Redirect to the individual driver's portal
      router.push(`/drivers/enhanced-portal?driverId=${driver.driverId}`);

    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `
        linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.5)),
        linear-gradient(135deg, #f7c52d 0%, #f4a832 100%)
      `,
      paddingTop: '80px',
      position: 'relative'
    }}>
      {/* Black Road Lines */}
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '0',
        right: '0',
        height: '4px',
        background: 'repeating-linear-gradient(90deg, #000000 0px, #000000 60px, transparent 60px, transparent 120px)',
        opacity: 0.3,
        zIndex: 1
      }}></div>
      <div style={{
        position: 'absolute',
        top: 'calc(40% + 30px)',
        left: '0',
        right: '0',
        height: '4px',
        background: 'repeating-linear-gradient(90deg, #000000 0px, #000000 60px, transparent 60px, transparent 120px)',
        opacity: 0.3,
        zIndex: 1
      }}></div>
      <div style={{
        position: 'absolute',
        top: '60%',
        left: '0',
        right: '0',
        height: '4px',
        background: 'repeating-linear-gradient(90deg, #000000 0px, #000000 60px, transparent 60px, transparent 120px)',
        opacity: 0.3,
        zIndex: 1
      }}></div>
      <div style={{
        position: 'absolute',
        top: 'calc(60% + 30px)',
        left: '0',
        right: '0',
        height: '4px',
        background: 'repeating-linear-gradient(90deg, #000000 0px, #000000 60px, transparent 60px, transparent 120px)',
        opacity: 0.3,
        zIndex: 1
      }}></div>

      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px 32px'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '48px',
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          padding: '32px',
          position: 'relative',
          zIndex: 2
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#2d3748',
            margin: '0 0 12px 0',
            textShadow: '2px 2px 4px rgba(255,255,255,0.5)'
          }}>
            🚛 Driver Portal
          </h1>
          <p style={{
            fontSize: '20px',
            color: 'rgba(45, 55, 72, 0.8)',
            margin: 0,
            fontWeight: '500'
          }}>
            Driver login and access center
          </p>
        </div>

        {/* Login Content */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.7)',
          padding: '32px',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#2d3748', margin: '0 0 24px 0', textAlign: 'center' }}>
              Driver Login
            </h2>
            
            {/* Login Form */}
            <form onSubmit={handleLogin}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                borderRadius: '16px',
                padding: '32px',
                maxWidth: '500px',
                margin: '0 auto',
                width: '100%',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}>
                {loginError && (
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid #ef4444',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '20px',
                    color: '#dc2626',
                    fontSize: '14px',
                    textAlign: 'center'
                  }}>
                    {loginError}
                  </div>
                )}
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: '#374151', 
                      marginBottom: '8px' 
                    }}>
                      Driver ID / Email
                    </label>
                    <input
                      type="text"
                      name="driverIdOrEmail"
                      value={loginData.driverIdOrEmail}
                      onChange={handleInputChange}
                      placeholder="Enter your driver ID or email"
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        background: 'rgba(255, 255, 255, 0.9)'
                      }}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div>
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
                      name="password"
                      value={loginData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        background: 'rgba(255, 255, 255, 0.9)'
                      }}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isLoading}
                    style={{
                      background: isLoading 
                        ? 'rgba(107, 114, 128, 0.5)' 
                        : 'linear-gradient(135deg, #2d3748, #1a202c)',
                      color: 'white',
                      padding: '16px 24px',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                    onMouseOver={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                      }
                    }}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </button>
                  
                  <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <a href="#" style={{ color: '#2d3748', fontSize: '14px', textDecoration: 'none' }}>
                      Forgot your password?
                    </a>
                  </div>

                  {/* Demo Driver Information */}
                  <div style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid #3b82f6',
                    borderRadius: '8px',
                    padding: '16px',
                    marginTop: '20px'
                  }}>
                    <h4 style={{ 
                      margin: '0 0 12px 0', 
                      color: '#1e40af', 
                      fontSize: '14px', 
                      fontWeight: '600' 
                    }}>
                      Demo Login Credentials:
                    </h4>
                    <div style={{ fontSize: '13px', color: '#374151', lineHeight: '1.5' }}>
                      <div><strong>John Rodriguez:</strong> driver_001 or john.rodriguez@fleetflowapp.com</div>
                      <div><strong>Maria Santos:</strong> driver_002 or maria.santos@fleetflowapp.com</div>
                      <div><strong>David Johnson:</strong> driver_003 or david.johnson@fleetflowapp.com</div>
                      <div style={{ marginTop: '8px', fontStyle: 'italic' }}>
                        Password: Any password will work for demo
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Help Section */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '500px',
              margin: '32px auto 0',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#2d3748', margin: '0 0 12px 0' }}>
                Need Help?
              </h3>
              <p style={{ color: 'rgba(45, 55, 72, 0.8)', fontSize: '14px', margin: '0 0 16px 0' }}>
                Contact your dispatcher or fleet manager for login assistance.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '12px', color: 'rgba(45, 55, 72, 0.6)', margin: '0 0 4px 0' }}>Emergency Dispatch</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#2d3748', margin: 0 }}>(555) 123-4567</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '12px', color: 'rgba(45, 55, 72, 0.6)', margin: '0 0 4px 0' }}>IT Support</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#2d3748', margin: 0 }}>(555) 123-4568</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
