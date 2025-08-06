'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { onboardingIntegration } from '../../services/onboarding-integration';

export default function DriversPortalPage() {
  const router = useRouter();
  const [loginData, setLoginData] = useState({
    driverIdOrEmail: '',
    password: '',
  });
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-redirect to enhanced portal (bypass login for now)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/admin/driver-otr-flow');
    }, 3000); // 3 second delay to show the page briefly

    return () => clearTimeout(timer);
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
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
      const driver = allDrivers.find(
        (d) =>
          d.driverId === loginData.driverIdOrEmail ||
          d.personalInfo.email.toLowerCase() ===
            loginData.driverIdOrEmail.toLowerCase()
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
      sessionStorage.setItem(
        'loggedInDriver',
        JSON.stringify({
          driverId: driver.driverId,
          name: driver.personalInfo.name,
          email: driver.personalInfo.email,
          loginTime: new Date().toISOString(),
        })
      );

      // Redirect to the admin driver portal
      router.push(`/admin/driver-otr-flow?driverId=${driver.driverId}`);
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#000000',
        paddingTop: '80px',
        position: 'relative',
      }}
    >
      {/* Yellow Road Lines */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '0',
          right: '0',
          height: '6px',
          background:
            'repeating-linear-gradient(90deg, #f7c52d 0px, #f7c52d 60px, transparent 60px, transparent 120px)',
          opacity: 0.8,
          zIndex: 1,
        }}
       />
      <div
        style={{
          position: 'absolute',
          top: 'calc(40% + 40px)',
          left: '0',
          right: '0',
          height: '6px',
          background:
            'repeating-linear-gradient(90deg, #f7c52d 0px, #f7c52d 60px, transparent 60px, transparent 120px)',
          opacity: 0.8,
          zIndex: 1,
        }}
       />
      <div
        style={{
          position: 'absolute',
          top: '60%',
          left: '0',
          right: '0',
          height: '6px',
          background:
            'repeating-linear-gradient(90deg, #f7c52d 0px, #f7c52d 60px, transparent 60px, transparent 120px)',
          opacity: 0.8,
          zIndex: 1,
        }}
       />
      <div
        style={{
          position: 'absolute',
          top: 'calc(60% + 40px)',
          left: '0',
          right: '0',
          height: '6px',
          background:
            'repeating-linear-gradient(90deg, #f7c52d 0px, #f7c52d 60px, transparent 60px, transparent 120px)',
          opacity: 0.8,
          zIndex: 1,
        }}
       />

      <main
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px 32px',
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '48px',
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '2px solid #f7c52d',
            padding: '32px',
            position: 'relative',
            zIndex: 2,
            boxShadow: '0 8px 32px rgba(247, 197, 45, 0.3)',
          }}
        >
          <h1
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#f7c52d',
              margin: '0 0 12px 0',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            }}
          >
            🚛 Driver Portal
          </h1>
          <p
            style={{
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '0 0 16px 0',
              fontWeight: '500',
            }}
          >
            Driver login and access center
          </p>

          {/* Auto-redirect message */}
          <div
            style={{
              background: 'rgba(247, 197, 45, 0.2)',
              border: '1px solid #f7c52d',
              borderRadius: '12px',
              padding: '12px 16px',
              margin: '0 auto',
              maxWidth: '400px',
            }}
          >
            <p
              style={{
                fontSize: '14px',
                color: '#f7c52d',
                margin: 0,
                fontWeight: '600',
                textAlign: 'center',
              }}
            >
              🔄 Auto-redirecting to Driver Dashboard in 3 seconds...
            </p>
          </div>
        </div>

        {/* Login Content */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '2px solid #f7c52d',
            padding: '32px',
            position: 'relative',
            zIndex: 2,
            boxShadow: '0 8px 32px rgba(247, 197, 45, 0.3)',
          }}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#f7c52d',
                margin: '0 0 24px 0',
                textAlign: 'center',
              }}
            >
              Driver Login
            </h2>

            {/* Login Form */}
            <form onSubmit={handleLogin}>
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.15)',
                  border: '1px solid #f7c52d',
                  borderRadius: '16px',
                  padding: '32px',
                  maxWidth: '500px',
                  margin: '0 auto',
                  width: '100%',
                  boxShadow: '0 8px 32px rgba(247, 197, 45, 0.2)',
                }}
              >
                {loginError && (
                  <div
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid #ef4444',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '20px',
                      color: '#dc2626',
                      fontSize: '14px',
                      textAlign: 'center',
                    }}
                  >
                    {loginError}
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#f7c52d',
                        marginBottom: '8px',
                      }}
                    >
                      Driver ID / Email
                    </label>
                    <input
                      type='text'
                      name='driverIdOrEmail'
                      value={loginData.driverIdOrEmail}
                      onChange={handleInputChange}
                      placeholder='Enter your driver ID or email'
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: '12px',
                        border: '1px solid #f7c52d',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        background: 'rgba(255, 255, 255, 0.95)',
                        color: '#2d3748',
                      }}
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#f7c52d',
                        marginBottom: '8px',
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
                        padding: '14px 16px',
                        borderRadius: '12px',
                        border: '1px solid #f7c52d',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        background: 'rgba(255, 255, 255, 0.95)',
                        color: '#2d3748',
                      }}
                      disabled={isLoading}
                    />
                  </div>

                  <button
                    type='submit'
                    disabled={isLoading}
                    style={{
                      background: isLoading
                        ? 'rgba(107, 114, 128, 0.5)'
                        : 'linear-gradient(135deg, #f7c52d, #f4a832)',
                      color: '#000000',
                      padding: '16px 24px',
                      borderRadius: '12px',
                      border: '2px solid #f7c52d',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(247, 197, 45, 0.3)',
                    }}
                    onMouseOver={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow =
                          '0 8px 24px rgba(247, 197, 45, 0.5)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow =
                          '0 4px 12px rgba(247, 197, 45, 0.3)';
                      }
                    }}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <a
                      href='#'
                      style={{
                        color: '#f7c52d',
                        fontSize: '14px',
                        textDecoration: 'none',
                      }}
                    >
                      Forgot your password?
                    </a>
                  </div>

                  {/* Demo Driver Information */}
                  <div
                    style={{
                      background: 'rgba(247, 197, 45, 0.1)',
                      border: '1px solid #f7c52d',
                      borderRadius: '8px',
                      padding: '16px',
                      marginTop: '20px',
                    }}
                  >
                    <h4
                      style={{
                        margin: '0 0 12px 0',
                        color: '#f7c52d',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      Demo Login Credentials:
                    </h4>
                    <div
                      style={{
                        fontSize: '13px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        lineHeight: '1.5',
                      }}
                    >
                      <div>
                        <strong>John Rodriguez:</strong> driver_001 or
                        john.rodriguez@fleetflow.com
                      </div>
                      <div>
                        <strong>Maria Santos:</strong> driver_002 or
                        maria.santos@fleetflow.com
                      </div>
                      <div>
                        <strong>David Johnson:</strong> driver_003 or
                        david.johnson@fleetflow.com
                      </div>
                      <div style={{ marginTop: '8px', fontStyle: 'italic' }}>
                        Password: Any password will work for demo
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Help Section */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid #f7c52d',
                borderRadius: '16px',
                padding: '32px',
                maxWidth: '500px',
                margin: '32px auto 0',
                width: '100%',
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(247, 197, 45, 0.2)',
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#f7c52d',
                  margin: '0 0 12px 0',
                }}
              >
                Need Help?
              </h3>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '14px',
                  margin: '0 0 16px 0',
                }}
              >
                Contact your dispatcher or fleet manager for login assistance.
              </p>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '24px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      margin: '0 0 4px 0',
                    }}
                  >
                    Emergency Dispatch
                  </p>
                  <p
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#f7c52d',
                      margin: 0,
                    }}
                  >
                    (555) 123-4567
                  </p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      margin: '0 0 4px 0',
                    }}
                  >
                    IT Support
                  </p>
                  <p
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#f7c52d',
                      margin: 0,
                    }}
                  >
                    (555) 123-4568
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
