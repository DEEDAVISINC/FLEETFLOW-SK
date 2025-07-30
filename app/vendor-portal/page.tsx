'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  getShipperDashboardSummary,
  getShipperLoads,
} from '../services/loadService';
import { vendorDocumentService } from '../services/vendorDocumentService';

interface VendorSession {
  shipperId: string;
  companyName: string;
  loginTime: string;
}

export default function VendorPortalPage() {
  const [session, setSession] = useState<VendorSession | null>(null);
  const [loads, setLoads] = useState<any[]>([]);
  const [dashboardSummary, setDashboardSummary] = useState<any>(null);
  const [selectedLoad, setSelectedLoad] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'loads' | 'documents' | 'profile'
  >('dashboard');

  // Debug: Log activeTab changes
  useEffect(() => {
    console.log('Active tab changed to:', activeTab);
  }, [activeTab]);

  // Force CSS reset for scrolling on component mount
  useEffect(() => {
    console.log('🎯 INITIALIZING SCROLL CSS RESET');

    // Reset any CSS that might prevent scrolling
    document.documentElement.style.overflow = 'auto';
    document.documentElement.style.height = 'auto';
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.body.style.scrollBehavior = 'auto';

    console.log('🎯 CSS RESET COMPLETE');
  }, []);

  const router = useRouter();

  // SIMPLE PAGE REFRESH: Most reliable way to get to top
  const scrollToTop = () => {
    console.log('🔄 FORCING PAGE REFRESH - Direct approach');
    window.location.reload();
  };

  useEffect(() => {
    // Check if user is logged in
    const sessionData = localStorage.getItem('vendorSession');
    if (!sessionData) {
      router.push('/vendor-login');
      return;
    }

    const parsedSession = JSON.parse(sessionData);
    setSession(parsedSession);
    loadDashboardData(parsedSession.shipperId);
  }, [router]);

  // Removed useEffect for tab changes - now handled directly in onClick

  // No need for floating scroll button since we use page refresh

  const loadDashboardData = async (shipperId: string) => {
    try {
      setIsLoading(true);
      const [loadsData, summaryData] = await Promise.all([
        getShipperLoads(shipperId),
        getShipperDashboardSummary(shipperId),
      ]);

      setLoads(loadsData);
      setDashboardSummary(summaryData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vendorSession');
    router.push('/vendor-login');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'dispatched':
        return '🚛';
      case 'pickup_complete':
        return '📋';
      case 'in_transit':
        return '🛣️';
      case 'delivered':
        return '✅';
      default:
        return '📍';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'dispatched':
        return '#3b82f6';
      case 'pickup_complete':
        return '#f59e0b';
      case 'in_transit':
        return '#8b5cf6';
      case 'delivered':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  if (!session) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background:
            'linear-gradient(135deg, #022c22 0%, #044e46 50%, #0a1612 100%)',
        }}
      >
        <div style={{ color: 'white', fontSize: '1.2rem' }}>🔄 Loading...</div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: `
          linear-gradient(135deg, #022c22 0%, #032e2a 25%, #044e46 50%, #042f2e 75%, #0a1612 100%),
          radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.06) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.04) 0%, transparent 50%)
        `,
        minHeight: '100vh',
        fontFamily: 'system-ui, sans-serif',
        padding: '100px 20px 20px 20px',
        position: 'relative',
        boxSizing: 'border-box',
        overflow: 'visible',
        width: '100%',
        scrollBehavior: 'auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '20px 32px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1
            style={{
              color: 'white',
              fontSize: '1.8rem',
              fontWeight: '600',
              margin: 0,
              marginBottom: '4px',
            }}
          >
            🚚 FleetFlow Shipper Portal
          </h1>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1rem' }}>
            Welcome back, {session.companyName}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={scrollToTop}
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              color: '#60a5fa',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
            }}
          >
            ⬆️ Top
          </button>

          <button
            onClick={handleLogout}
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
          // { id: 'notifications', label: '🔔 Notifications', icon: '🔔' },
          { id: 'profile', label: '👤 Profile', icon: '👤' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              console.log('Tab clicked:', tab.id);
              setActiveTab(tab.id as any);
              scrollToTop();
            }}
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
            onMouseOver={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }
            }}
            onMouseOut={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div>
          {/* KPI Cards */}
          {dashboardSummary && (
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
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📈</div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    marginBottom: '4px',
                  }}
                >
                  {dashboardSummary.deliveryPerformance.onTimeRate}%
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem',
                  }}
                >
                  On-Time Rate
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity */}
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
              📋 Recent Load Activity
            </h2>
            {isLoading ? (
              <div
                style={{
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.7)',
                  padding: '40px',
                }}
              >
                🔄 Loading recent activity...
              </div>
            ) : loads.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.7)',
                  padding: '40px',
                }}
              >
                📭 No loads found
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {loads.slice(0, 5).map((load, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <div style={{ fontSize: '1.5rem' }}>
                        {getStatusIcon(load.currentStatus)}
                      </div>
                      <div>
                        <div
                          style={{
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '1rem',
                          }}
                        >
                          Load {load.loadId}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.9rem',
                          }}
                        >
                          {load.route.origin} → {load.route.destination}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          background: `${getStatusColor(load.currentStatus)}20`,
                          color: getStatusColor(load.currentStatus),
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
                ))}
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
            {isLoading ? (
              <div
                style={{
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.7)',
                  padding: '40px',
                }}
              >
                🔄 Loading your loads...
              </div>
            ) : loads.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.7)',
                  padding: '40px',
                }}
              >
                📭 No loads found
              </div>
            ) : (
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
                    onClick={() => setSelectedLoad(load)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 25px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
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
                          {getStatusIcon(load.currentStatus)} Load {load.loadId}
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
                          background: `${getStatusColor(load.currentStatus)}20`,
                          color: getStatusColor(load.currentStatus),
                          padding: '6px 16px',
                          borderRadius: '20px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                        }}
                      >
                        {load.statusDisplay}
                      </div>
                    </div>

                    {/* Milestone Progress */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '12px',
                        marginBottom: '16px',
                      }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: '1.2rem',
                            marginBottom: '4px',
                            opacity: load.milestones.bolCreated?.completed
                              ? 1
                              : 0.4,
                          }}
                        >
                          📋
                        </div>
                        <div
                          style={{
                            color: load.milestones.bolCreated?.completed
                              ? 'white'
                              : 'rgba(255, 255, 255, 0.5)',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                          }}
                        >
                          BOL Created
                        </div>
                        {load.milestones.bolCreated?.completed && (
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.6)',
                              fontSize: '0.7rem',
                            }}
                          >
                            {load.milestones.bolCreated.timestamp
                              ? new Date(
                                  load.milestones.bolCreated.timestamp
                                ).toLocaleDateString()
                              : ''}
                          </div>
                        )}
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: '1.2rem',
                            marginBottom: '4px',
                            opacity: load.milestones.transitUpdate?.completed
                              ? 1
                              : 0.4,
                          }}
                        >
                          🛣️
                        </div>
                        <div
                          style={{
                            color: load.milestones.transitUpdate?.completed
                              ? 'white'
                              : 'rgba(255, 255, 255, 0.5)',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                          }}
                        >
                          In Transit
                        </div>
                        {load.milestones.transitUpdate?.completed && (
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.6)',
                              fontSize: '0.7rem',
                            }}
                          >
                            ETA:{' '}
                            {load.estimatedDelivery
                              ? new Date(
                                  load.estimatedDelivery
                                ).toLocaleDateString()
                              : 'TBD'}
                          </div>
                        )}
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: '1.2rem',
                            marginBottom: '4px',
                            opacity: load.milestones.deliveryComplete?.completed
                              ? 1
                              : 0.4,
                          }}
                        >
                          ✅
                        </div>
                        <div
                          style={{
                            color: load.milestones.deliveryComplete?.completed
                              ? 'white'
                              : 'rgba(255, 255, 255, 0.5)',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                          }}
                        >
                          Delivered
                        </div>
                        {load.milestones.deliveryComplete?.completed && (
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.6)',
                              fontSize: '0.7rem',
                            }}
                          >
                            {load.milestones.deliveryComplete.timestamp
                              ? new Date(
                                  load.milestones.deliveryComplete.timestamp
                                ).toLocaleDateString()
                              : ''}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        padding: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                          }}
                        >
                          📞 Broker: {load.contact.brokerName}
                        </div>
                        {load.contact.dispatcherName && (
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '0.8rem',
                            }}
                          >
                            Dispatcher: {load.contact.dispatcherName}
                          </div>
                        )}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '0.8rem',
                        }}
                      >
                        Last Updated:{' '}
                        {new Date(load.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
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
              marginBottom: '24px',
            }}
          >
            <h2
              style={{
                color: 'white',
                fontSize: '1.8rem',
                fontWeight: '600',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              📄 Document Center
            </h2>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '1rem',
                marginBottom: '24px',
              }}
            >
              Upload and manage your essential documents. All uploads are
              automatically sent to your assigned broker for review.
            </p>

            {/* Broker Information */}
            {(() => {
              const broker = session?.shipperId
                ? vendorDocumentService.getShipperBroker(session.shipperId)
                : null;

              if (broker) {
                return (
                  <div
                    style={{
                      background: 'rgba(59, 130, 246, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      marginBottom: '24px',
                    }}
                  >
                    <h3
                      style={{
                        color: 'white',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      👤 Your Assigned Broker
                    </h3>
                    <div
                      style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}
                    >
                      <div>
                        <span
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.9rem',
                          }}
                        >
                          Name:
                        </span>
                        <div style={{ color: 'white', fontWeight: '500' }}>
                          {broker.brokerName}
                        </div>
                      </div>
                      <div>
                        <span
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.9rem',
                          }}
                        >
                          Email:
                        </span>
                        <div style={{ color: 'white', fontWeight: '500' }}>
                          {broker.brokerEmail}
                        </div>
                      </div>
                      <div>
                        <span
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.9rem',
                          }}
                        >
                          Phone:
                        </span>
                        <div style={{ color: 'white', fontWeight: '500' }}>
                          {broker.brokerPhone}
                        </div>
                      </div>
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '0.8rem',
                        marginTop: '8px',
                        marginBottom: 0,
                      }}
                    >
                      All document uploads will automatically notify{' '}
                      {broker.brokerName}
                    </p>
                  </div>
                );
              }
              return null;
            })()}

            {/* Document Statistics */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '32px',
              }}
            >
              {(() => {
                const stats = session?.shipperId
                  ? vendorDocumentService.getDocumentStats(session.shipperId)
                  : {
                      total: 0,
                      pending: 0,
                      approved: 0,
                      rejected: 0,
                      byType: {},
                    };

                return (
                  <>
                    <div
                      style={{
                        background: 'rgba(59, 130, 246, 0.2)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '2rem',
                          color: '#60a5fa',
                          marginBottom: '8px',
                        }}
                      >
                        📊
                      </div>
                      <div
                        style={{
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                          color: 'white',
                          marginBottom: '4px',
                        }}
                      >
                        {stats.total}
                      </div>
                      <div
                        style={{
                          fontSize: '0.9rem',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        Total Documents
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(234, 179, 8, 0.2)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid rgba(234, 179, 8, 0.3)',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '2rem',
                          color: '#fbbf24',
                          marginBottom: '8px',
                        }}
                      >
                        ⏳
                      </div>
                      <div
                        style={{
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                          color: 'white',
                          marginBottom: '4px',
                        }}
                      >
                        {stats.pending}
                      </div>
                      <div
                        style={{
                          fontSize: '0.9rem',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        Pending Review
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '2rem',
                          color: '#10b981',
                          marginBottom: '8px',
                        }}
                      >
                        ✅
                      </div>
                      <div
                        style={{
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                          color: 'white',
                          marginBottom: '4px',
                        }}
                      >
                        {stats.approved}
                      </div>
                      <div
                        style={{
                          fontSize: '0.9rem',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        Approved
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(248, 113, 113, 0.2)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid rgba(248, 113, 113, 0.3)',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '2rem',
                          color: '#f87171',
                          marginBottom: '8px',
                        }}
                      >
                        ❌
                      </div>
                      <div
                        style={{
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                          color: 'white',
                          marginBottom: '4px',
                        }}
                      >
                        {stats.rejected}
                      </div>
                      <div
                        style={{
                          fontSize: '0.9rem',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        Needs Changes
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Document Upload Section */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                marginBottom: '24px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                📤 Upload New Document
              </h3>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();

                  try {
                    const formData = new FormData(e.currentTarget);
                    const file = formData.get('file') as File;
                    const docType = formData.get('documentType') as string;
                    const description = formData.get('description') as string;
                    const priority = formData.get('priority') as string;

                    if (!file || !session?.shipperId) return;

                    await vendorDocumentService.uploadDocument(
                      session.shipperId,
                      file,
                      docType as any,
                      description,
                      [],
                      { priority: priority as any }
                    );

                    // Reset form
                    e.currentTarget.reset();
                    alert(
                      'Document uploaded successfully! Your broker has been notified.'
                    );
                  } catch (error) {
                    console.error('Upload error:', error);
                    alert('Error uploading document. Please try again.');
                  }
                }}
                style={{
                  display: 'grid',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                  }}
                >
                  <div>
                    <label
                      style={{
                        color: 'white',
                        fontSize: '0.9rem',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    >
                      Document Type *
                    </label>
                    <select
                      name='documentType'
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '0.9rem',
                      }}
                    >
                      <option value=''>Select document type...</option>
                      <option value='quote_request'>📋 Quote Request</option>
                      <option value='insurance_certificate'>
                        🛡️ Insurance Certificate
                      </option>
                      <option value='contract'>📋 Contract</option>
                      <option value='bol'>📄 Bill of Lading</option>
                      <option value='invoice'>💰 Invoice</option>
                      <option value='compliance_doc'>
                        ✅ Compliance Document
                      </option>
                      <option value='other'>📎 Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        color: 'white',
                        fontSize: '0.9rem',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    >
                      Priority
                    </label>
                    <select
                      name='priority'
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '0.9rem',
                      }}
                    >
                      <option value='medium'>📋 Medium</option>
                      <option value='low'>📝 Low</option>
                      <option value='high'>⚡ High</option>
                      <option value='urgent'>🚨 Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      color: 'white',
                      fontSize: '0.9rem',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    File *
                  </label>
                  <input
                    type='file'
                    name='file'
                    required
                    accept='.pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls'
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      color: 'white',
                      fontSize: '0.9rem',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Description
                  </label>
                  <textarea
                    name='description'
                    rows={3}
                    placeholder='Brief description of the document...'
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '0.9rem',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <button
                  type='submit'
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '14px 24px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  📤 Upload Document
                </button>
              </form>
            </div>

            {/* Document List */}
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
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                📂 Your Documents
              </h3>

              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {(() => {
                  const documents = session?.shipperId
                    ? vendorDocumentService.getShipperDocuments(
                        session.shipperId
                      )
                    : [];

                  if (documents.length === 0) {
                    return (
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '40px 20px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '1rem',
                        }}
                      >
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>
                          📭
                        </div>
                        <p>No documents uploaded yet</p>
                        <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>
                          Upload your first document using the form above
                        </p>
                      </div>
                    );
                  }

                  return documents.map((doc) => (
                    <div
                      key={doc.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '12px',
                        border: `1px solid ${
                          doc.status === 'approved'
                            ? 'rgba(16, 185, 129, 0.3)'
                            : doc.status === 'rejected' ||
                                doc.status === 'requires_changes'
                              ? 'rgba(248, 113, 113, 0.3)'
                              : 'rgba(234, 179, 8, 0.3)'
                        }`,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '12px',
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <h4
                            style={{
                              color: 'white',
                              fontSize: '1rem',
                              fontWeight: '600',
                              margin: 0,
                              marginBottom: '4px',
                            }}
                          >
                            {doc.documentType === 'quote_request'
                              ? '📋'
                              : doc.documentType === 'insurance_certificate'
                                ? '🛡️'
                                : doc.documentType === 'contract'
                                  ? '📋'
                                  : doc.documentType === 'bol'
                                    ? '📄'
                                    : doc.documentType === 'invoice'
                                      ? '💰'
                                      : doc.documentType === 'compliance_doc'
                                        ? '✅'
                                        : '📎'}{' '}
                            {doc.fileName}
                          </h4>
                          {doc.description && (
                            <p
                              style={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontSize: '0.9rem',
                                margin: '0 0 8px 0',
                              }}
                            >
                              {doc.description}
                            </p>
                          )}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              fontSize: '0.8rem',
                              color: 'rgba(255, 255, 255, 0.5)',
                            }}
                          >
                            <span>
                              📅 {new Date(doc.uploadedAt).toLocaleDateString()}
                            </span>
                            <span>
                              📏 {(doc.fileSize / 1024 / 1024).toFixed(1)} MB
                            </span>
                            {doc.expirationDate && (
                              <span>
                                ⏰ Expires:{' '}
                                {new Date(
                                  doc.expirationDate
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '0.8rem',
                              background:
                                doc.status === 'approved'
                                  ? 'rgba(16, 185, 129, 0.2)'
                                  : doc.status === 'rejected' ||
                                      doc.status === 'requires_changes'
                                    ? 'rgba(248, 113, 113, 0.2)'
                                    : 'rgba(234, 179, 8, 0.2)',
                              color:
                                doc.status === 'approved'
                                  ? '#10b981'
                                  : doc.status === 'rejected' ||
                                      doc.status === 'requires_changes'
                                    ? '#f87171'
                                    : '#fbbf24',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontWeight: '600',
                              textTransform: 'uppercase',
                            }}
                          >
                            {doc.status === 'pending_review'
                              ? '⏳ PENDING'
                              : doc.status === 'approved'
                                ? '✅ APPROVED'
                                : doc.status === 'rejected'
                                  ? '❌ REJECTED'
                                  : '🔄 NEEDS CHANGES'}
                          </span>
                        </div>
                      </div>

                      {doc.brokerNotes && (
                        <div
                          style={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            borderRadius: '6px',
                            padding: '12px',
                            marginTop: '12px',
                            borderLeft: '3px solid #3b82f6',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '0.8rem',
                              color: '#60a5fa',
                              fontWeight: '600',
                              marginBottom: '4px',
                            }}
                          >
                            💬 Broker Notes:
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '0.9rem',
                            }}
                          >
                            {doc.brokerNotes}
                          </div>
                        </div>
                      )}
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications section temporarily removed for scrolling test */}

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
                  Last Login:
                </div>
                <div style={{ color: 'white', fontWeight: '600' }}>
                  {new Date(session.loginTime).toLocaleString()}
                </div>
              </div>

              {dashboardSummary && (
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
                    Performance:
                  </div>
                  <div style={{ color: 'white', fontWeight: '600' }}>
                    {dashboardSummary.deliveryPerformance.onTimeRate}% On-Time •{' '}
                    {dashboardSummary.deliveryPerformance.avgTransitTime} Avg
                    Transit
                  </div>
                </div>
              )}
            </div>

            {/* Support Section */}
            <div style={{ marginTop: '32px', textAlign: 'center' }}>
              <h3
                style={{
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  marginBottom: '16px',
                }}
              >
                📞 Need Help?
              </h3>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '16px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.9rem',
                }}
              >
                Contact your dedicated FleetFlow team for any questions about
                your loads or portal access.
                <br />
                <strong>Support: (555) 123-4567</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Load Detail Modal */}
      {selectedLoad && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(8px)',
          }}
          onClick={() => setSelectedLoad(null)}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              maxWidth: '600px',
              maxHeight: '80vh',
              overflow: 'auto',
              padding: '32px',
              margin: '20px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                color: '#1f2937',
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '20px',
                margin: 0,
              }}
            >
              {getStatusIcon(selectedLoad.currentStatus)} Load{' '}
              {selectedLoad.loadId} Details
            </h2>

            <div style={{ color: '#374151', lineHeight: '1.6' }}>
              <div style={{ marginBottom: '20px' }}>
                <strong>Status:</strong> {selectedLoad.statusDisplay}
              </div>
              <div style={{ marginBottom: '20px' }}>
                <strong>Route:</strong> {selectedLoad.route.origin} →{' '}
                {selectedLoad.route.destination}
              </div>
              <div style={{ marginBottom: '20px' }}>
                <strong>Distance:</strong> {selectedLoad.route.distance}
              </div>
              <div style={{ marginBottom: '20px' }}>
                <strong>Estimated Delivery:</strong>{' '}
                {selectedLoad.estimatedDelivery
                  ? new Date(
                      selectedLoad.estimatedDelivery
                    ).toLocaleDateString()
                  : 'TBD'}
              </div>
              <div style={{ marginBottom: '20px' }}>
                <strong>Broker Contact:</strong>{' '}
                {selectedLoad.contact.brokerName}
              </div>
              {selectedLoad.contact.dispatcherName && (
                <div style={{ marginBottom: '20px' }}>
                  <strong>Dispatcher:</strong>{' '}
                  {selectedLoad.contact.dispatcherName}
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedLoad(null)}
              style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                marginTop: '20px',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Force scrollable content - ensures page has enough height to scroll */}
      <div style={{ height: '150vh', opacity: 0, pointerEvents: 'none' }}>
        {/* Invisible content to make page scrollable */}
      </div>
    </div>
  );
}
