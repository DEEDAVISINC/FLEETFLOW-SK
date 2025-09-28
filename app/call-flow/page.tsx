'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import CRMDashboard from '../components/CRMDashboard';
import CRMPhoneIntegrationWidget from '../components/CRMPhoneIntegrationWidget';
import CallFlowManager from '../components/CallFlowManager';
import { FreeSWITCHCallCenterDashboard } from '../components/FreeSWITCHCallCenterDashboard';
import PhoneConnectionSetup from '../components/PhoneConnectionSetup';
import SimplePhoneDialer from '../components/SimplePhoneDialer';
import { getCurrentUser } from '../config/access';

// Force dynamic rendering - no static generation
export const dynamic = 'force-dynamic';

export default function CallFlow() {
  const [user, setUser] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `
          linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%),
          radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.06) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(168, 85, 247, 0.04) 0%, transparent 50%)
        `,
        backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
        backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
        paddingTop: '0px',
      }}
    >
      {/* Professional Header with Call Flow Branding */}
      <div
        style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 32px' }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                }}
              >
                <span style={{ fontSize: '32px' }}>📞</span>
              </div>
              <div>
                <h1
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: '0 0 8px 0',
                    textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  📞 CALL FLOW
                </h1>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.95)',
                    fontSize: '18px',
                    margin: '0 0 16px 0',
                  }}
                >
                  Enterprise Voice Operations & CRM Integration Platform
                </p>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '24px' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        background: '#10b981',
                        borderRadius: '50%',
                        boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)',
                        animation: 'pulse 2s infinite',
                      }}
                    />
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.98)',
                        fontSize: '14px',
                      }}
                    >
                      System Online • FreeSWITCH Connected • CRM Integration
                      Active
                    </span>
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '14px',
                    }}
                  >
                    Last updated: {lastRefresh.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '12px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.98)',
                    marginBottom: '4px',
                  }}
                >
                  FleetFlow Platform
                </div>
                <div
                  style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginBottom: '2px',
                  }}
                >
                  📞 +1 (833) 206-0231
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: 'rgba(34, 197, 94, 0.9)',
                    fontWeight: '500',
                  }}
                >
                  ✅ Voice AI System Active
                </div>
                {user && (
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: 'rgba(255, 255, 255, 0.88)',
                      marginTop: '4px',
                    }}
                  >
                    {user.name} • {user.userIdentifier} • {user.departmentCode}
                  </div>
                )}
              </div>
              <Link
                href='/dispatcher-portal'
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease',
                }}
              >
                🔙 Back to Portal
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Communications Operations Container */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px 32px',
          overflow: 'hidden', // Prevent page overflow
        }}
      >
        {/* Main Content Grid - Responsive Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          {/* Call Flow Management Department */}
          <div
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              minHeight: '500px',
              maxHeight: '800px',
              overflow: 'hidden',
            }}
          >
            <div style={{ marginBottom: '20px' }}>
              <h3
                style={{
                  color: '#60a5fa',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  margin: '0 0 8px 0',
                }}
              >
                📞 Call Flow Department
              </h3>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.92)',
                  fontSize: '14px',
                  margin: 0,
                }}
              >
                Intelligent call routing and flow management system
              </p>
            </div>

            {/* Contained Call Flow Manager */}
            <div style={{ height: '420px', overflow: 'auto' }}>
              <CallFlowManager user={user} />
            </div>
          </div>

          {/* Call Center Operations Department */}
          <div
            style={{
              background: 'rgba(34, 197, 94, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              minHeight: '500px',
              maxHeight: '800px',
              overflow: 'hidden',
            }}
          >
            <div style={{ marginBottom: '20px' }}>
              <h3
                style={{
                  color: '#22c55e',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  margin: '0 0 8px 0',
                }}
              >
                🏢 Call Center Operations
              </h3>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.92)',
                  fontSize: '14px',
                  margin: 0,
                }}
              >
                FreeSWITCH-powered call center with agent management
              </p>
            </div>

            {/* Contained Call Center Dashboard */}
            <div style={{ height: '420px', overflow: 'auto' }}>
              <FreeSWITCHCallCenterDashboard />
            </div>
          </div>
        </div>

        {/* CRM Integration Department */}
        <div
          style={{
            background: 'rgba(219, 39, 119, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(219, 39, 119, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            marginBottom: '24px',
            overflow: 'hidden',
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <h3
              style={{
                color: '#ec4899',
                fontSize: '20px',
                fontWeight: 'bold',
                margin: '0 0 8px 0',
              }}
            >
              🎯 CRM Integration Department
            </h3>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.92)',
                fontSize: '14px',
                margin: 0,
              }}
            >
              AI-powered lead tracking with phone call integration
            </p>
          </div>

          {/* CRM Dashboard Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
            }}
          >
            <div style={{ maxHeight: '400px', overflow: 'auto' }}>
              <CRMPhoneIntegrationWidget />
            </div>
            <div style={{ maxHeight: '400px', overflow: 'auto' }}>
              <CRMDashboard />
            </div>
          </div>
        </div>

        {/* Phone Operations Department */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '24px',
          }}
        >
          {/* Phone Dialer Section */}
          <div
            style={{
              background: 'rgba(168, 85, 247, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            }}
          >
            <div style={{ marginBottom: '20px' }}>
              <h3
                style={{
                  color: '#a855f7',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  margin: '0 0 8px 0',
                }}
              >
                ☎️ Phone Dialer Department
              </h3>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.92)',
                  fontSize: '14px',
                  margin: 0,
                }}
              >
                Direct calling with automatic logging and CRM integration
              </p>
            </div>

            {/* Centered Dialer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '300px',
              }}
            >
              <div style={{ maxWidth: '320px', width: '100%' }}>
                <SimplePhoneDialer />
              </div>
            </div>
          </div>

          {/* Phone Setup Section - Enhanced UX */}
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.12)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '28px',
              border: '2px solid rgba(245, 158, 11, 0.4)',
              boxShadow: '0 12px 40px rgba(245, 158, 11, 0.15)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Highlight Badge */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                right: '20px',
                background: 'rgba(34, 197, 94, 0.9)',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
              }}
            >
              ✨ RECOMMENDED
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3
                style={{
                  color: '#f59e0b',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  margin: '0 0 8px 0',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                📞 Phone Setup Department
              </h3>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.95)',
                  fontSize: '16px',
                  margin: '0 0 12px 0',
                  lineHeight: '1.4',
                }}
              >
                Connect your personal phone to the FleetFlow platform
              </p>

              {/* Quick Setup Callout */}
              <div
                style={{
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginTop: '16px',
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  <span style={{ fontSize: '24px' }}>🚀</span>
                  <div>
                    <div
                      style={{
                        color: '#22c55e',
                        fontSize: '16px',
                        fontWeight: '600',
                        marginBottom: '4px',
                      }}
                    >
                      Quick Setup: Call Forwarding (Recommended)
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px',
                        lineHeight: '1.3',
                      }}
                    >
                      Simply enter your phone number below - no apps to
                      download!
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Setup Panel */}
            <div
              style={{
                maxHeight: '500px',
                overflow: 'auto',
                background: 'rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <PhoneConnectionSetup
                user={user}
                onSetupComplete={(setupData) => {
                  console.info('Phone setup completed:', setupData);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
