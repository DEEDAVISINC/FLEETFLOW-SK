'use client';

import { useEffect, useState } from 'react';

export default function TestVendorPortalContent() {
  const [session, setSession] = useState<any>(null);
  const [loads, setLoads] = useState<any[]>([]);
  const [dashboardSummary, setDashboardSummary] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'loads' | 'documents' | 'profile'
  >('dashboard');

  useEffect(() => {
    // Set up test session
    const testSession = {
      shipperId: 'ABC-204-070',
      companyName: 'ABC Manufacturing Corp',
      loginTime: new Date().toISOString(),
    };
    setSession(testSession);

    // Mock data for testing
    const mockLoads = [
      {
        loadId: 'LF-25001-ATLMIA-WMT-DVFL-001',
        shipperName: 'ABC Manufacturing Corp',
        currentStatus: 'in_transit',
        statusDisplay: 'In Transit',
        lastUpdated: new Date().toISOString(),
        estimatedDelivery: new Date(
          Date.now() + 2 * 24 * 60 * 60 * 1000
        ).toISOString(),
        milestones: {
          bolCreated: { completed: true, timestamp: new Date().toISOString() },
          transitUpdate: {
            completed: true,
            timestamp: new Date().toISOString(),
          },
          deliveryComplete: { completed: false },
        },
        route: {
          origin: 'Atlanta, GA',
          destination: 'Miami, FL',
          distance: '665 miles',
        },
        contact: {
          brokerName: 'FleetFlow Brokerage',
          dispatcherName: 'Mike Johnson',
        },
      },
    ];

    const mockSummary = {
      totalLoads: 1,
      dispatched: 0,
      pickupComplete: 0,
      inTransit: 1,
      delivered: 0,
      deliveryPerformance: {
        onTimeRate: 96.2,
        avgTransitTime: '2.3 days',
      },
    };

    setLoads(mockLoads);
    setDashboardSummary(mockSummary);
  }, []);

  if (!session) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div
      style={{
        background:
          'linear-gradient(135deg, #022c22 0%, #044e46 50%, #0a1612 100%)',
        minHeight: '100vh',
        padding: '20px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1 style={{ color: 'white', margin: 0, fontSize: '1.5rem' }}>
            🚚 {session.companyName}
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: '4px 0 0 0' }}>
            Shipper Portal • Secure Load Tracking
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '8px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          gap: '8px',
        }}
      >
        {[
          { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
          { id: 'loads', label: '📦 My Loads', icon: '📦' },
          { id: 'documents', label: '📄 Documents', icon: '📄' },
          { id: 'profile', label: '👤 Profile', icon: '👤' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              background:
                activeTab === tab.id
                  ? 'rgba(255, 255, 255, 0.25)'
                  : 'transparent',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              flex: 1,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && dashboardSummary && (
        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📦</div>
              <div
                style={{
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '4px',
                }}
              >
                {dashboardSummary.totalLoads}
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.9rem',
                }}
              >
                Total Loads
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🛣️</div>
              <div
                style={{
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '4px',
                }}
              >
                {dashboardSummary.inTransit}
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.9rem',
                }}
              >
                In Transit
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✅</div>
              <div
                style={{
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '4px',
                }}
              >
                {dashboardSummary.delivered}
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.9rem',
                }}
              >
                Delivered
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <h2
              style={{
                color: 'white',
                fontSize: '1.3rem',
                fontWeight: '600',
                marginBottom: '20px',
                margin: 0,
              }}
            >
              📊 Recent Activity
            </h2>
            {loads.length > 0 ? (
              <div style={{ display: 'grid', gap: '16px' }}>
                {loads.map((load, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            color: 'white',
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            margin: 0,
                            marginBottom: '4px',
                          }}
                        >
                          🚛 Load {load.loadId}
                        </h3>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '1rem',
                            marginBottom: '8px',
                          }}
                        >
                          {load.route.origin} → {load.route.destination}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.9rem',
                          }}
                        >
                          Distance: {load.route.distance}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            background: '#10b981',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            marginBottom: '4px',
                          }}
                        >
                          {load.statusDisplay}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.8rem',
                          }}
                        >
                          Updated{' '}
                          {new Date(load.lastUpdated).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.7)',
                  padding: '40px',
                }}
              >
                📭 No loads found
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loads Tab */}
      {activeTab === 'loads' && (
        <div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <h2
              style={{
                color: 'white',
                fontSize: '1.3rem',
                fontWeight: '600',
                marginBottom: '20px',
                margin: 0,
              }}
            >
              📦 All My Loads
            </h2>
            {loads.length > 0 ? (
              <div style={{ display: 'grid', gap: '16px' }}>
                {loads.map((load, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '16px',
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            color: 'white',
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            margin: 0,
                            marginBottom: '4px',
                          }}
                        >
                          🚛 Load {load.loadId}
                        </h3>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '1rem',
                            marginBottom: '8px',
                          }}
                        >
                          {load.route.origin} → {load.route.destination}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.9rem',
                          }}
                        >
                          Distance: {load.route.distance}
                        </div>
                      </div>
                      <div
                        style={{
                          background: '#10b981',
                          color: 'white',
                          padding: '6px 16px',
                          borderRadius: '20px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                        }}
                      >
                        {load.statusDisplay}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.7)',
                  padding: '40px',
                }}
              >
                📭 No loads found
              </div>
            )}
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <h2
              style={{
                color: 'white',
                fontSize: '1.3rem',
                fontWeight: '600',
                marginBottom: '20px',
                margin: 0,
              }}
            >
              📄 Documents
            </h2>
            <div
              style={{
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.7)',
                padding: '40px',
              }}
            >
              📭 No documents found
            </div>
          </div>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <h2
              style={{
                color: 'white',
                fontSize: '1.3rem',
                fontWeight: '600',
                marginBottom: '20px',
                margin: 0,
              }}
            >
              👤 Company Profile
            </h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem',
                  }}
                >
                  Company Name:
                </div>
                <div style={{ color: 'white', fontWeight: '600' }}>
                  {session.companyName}
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem',
                  }}
                >
                  Shipper ID:
                </div>
                <div style={{ color: 'white', fontWeight: '600' }}>
                  {session.shipperId}
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem',
                  }}
                >
                  Portal Access:
                </div>
                <div style={{ color: '#10b981', fontWeight: '600' }}>
                  ✅ Active
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
