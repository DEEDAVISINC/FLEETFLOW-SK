'use client';

import Link from 'next/link';
import { useState } from 'react';
import AdvancedWeatherIntegration from '../components/AdvancedWeatherIntegration';
import HazmatRouteComplianceWidget from '../components/HazmatRouteComplianceWidget';
import PermitRoutePlanningWidget from '../components/PermitRoutePlanningWidget';
import RouteOptimizerDashboard from '../components/RouteOptimizerDashboard';
import RouteSharing from '../components/RouteSharing';
import SeasonalLoadPlanningWidget from '../components/SeasonalLoadPlanningWidget';
import PortAuthorityAccessWidget from '../components/PortAuthorityAccessWidget';
import { OptimizedRoute } from '../services/route-optimization';

export default function RoutesPage() {
  const [activeView, setActiveView] = useState<
    'dashboard' | 'optimizer' | 'analytics' | 'specialized'
  >('dashboard');
  const [specializedSubTab, setSpecializedSubTab] = useState<
    'permits' | 'hazmat' | 'seasonal' | 'weather' | 'ports'
  >('permits');
  const [routeStats, setRouteStats] = useState({
    activeRoutes: 12,
    totalMiles: 2847,
    avgEfficiency: 89,
    costSavings: 1250,
  });
  const [recentOptimizations, setRecentOptimizations] = useState([
    {
      id: 'R001',
      driver: 'John Smith',
      efficiency: 94,
      savings: '$187',
      status: 'Completed',
    },
    {
      id: 'R002',
      driver: 'Sarah Wilson',
      efficiency: 91,
      savings: '$145',
      status: 'In Progress',
    },
    {
      id: 'R003',
      driver: 'Mike Johnson',
      efficiency: 87,
      savings: '$98',
      status: 'Optimizing',
    },
  ]);
  const [showRouteSharing, setShowRouteSharing] = useState(false);
  const [selectedRouteForSharing, setSelectedRouteForSharing] =
    useState<OptimizedRoute | null>(null);

  // Sample route data for sharing functionality
  const sampleRoutes: OptimizedRoute[] = [
    {
      id: 'R001',
      vehicleId: 'V001',
      stops: [
        {
          id: 'S001',
          address: '1600 Amphitheatre Pkwy, Mountain View, CA',
          type: 'pickup',
          timeWindow: { start: '09:00', end: '11:00' },
          serviceTime: 30,
          weight: 5000,
          priority: 'high',
        },
        {
          id: 'S002',
          address: '410 Terry Ave N, Seattle, WA',
          type: 'delivery',
          timeWindow: { start: '14:00', end: '16:00' },
          serviceTime: 20,
          weight: 3000,
          priority: 'urgent',
        },
      ],
      totalDistance: 850.5,
      totalTime: 12.5,
      efficiency: 94,
      fuelCost: 145.5,
      estimatedArrival: '2024-01-15T16:30:00Z',
    },
    {
      id: 'R002',
      vehicleId: 'V002',
      stops: [
        {
          id: 'S003',
          address: '1 Microsoft Way, Redmond, WA',
          type: 'pickup',
          serviceTime: 25,
          weight: 8000,
          priority: 'medium',
        },
        {
          id: 'S004',
          address: '350 Fifth Avenue, New York, NY',
          type: 'delivery',
          timeWindow: { start: '10:00', end: '12:00' },
          serviceTime: 30,
          weight: 8000,
          priority: 'high',
        },
      ],
      totalDistance: 2847.0,
      totalTime: 38.5,
      efficiency: 91,
      fuelCost: 285.75,
      estimatedArrival: '2024-01-16T12:30:00Z',
    },
  ];

  const handleRouteShare = (routeId: string) => {
    const route = sampleRoutes.find((r) => r.id === routeId);
    if (route) {
      setSelectedRouteForSharing(route);
      setShowRouteSharing(true);
    }
  };

  const handleShareComplete = (shareData: any) => {
    console.log('Route shared:', shareData);
    // Here you would typically send the sharing data to your backend
    // For now, we'll just show a success message
    alert(
      `Route ${shareData.route.id} shared successfully with ${shareData.recipients.length} recipients!`
    );
    setShowRouteSharing(false);
    setSelectedRouteForSharing(null);
  };

  const handleShareCancel = () => {
    setShowRouteSharing(false);
    setSelectedRouteForSharing(null);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `
        linear-gradient(135deg, #022c22 0%, #032e2a 25%, #044e46 50%, #042f2e 75%, #0a1612 100%),
        radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.04) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(6, 182, 212, 0.03) 0%, transparent 50%)
      `,
        backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
        backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
        backgroundAttachment: 'fixed',
        paddingTop: '80px',
        position: 'relative',
      }}
    >
      {/* Back Button */}
      <div style={{ padding: '24px' }}>
        <Link href='/' style={{ textDecoration: 'none' }}>
          <button
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '16px',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{ marginRight: '8px' }}>←</span>
            Back to Dashboard
          </button>
        </Link>
      </div>

      {/* Main Container */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px 32px',
        }}
      >
        {/* Header */}
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
                <span style={{ fontSize: '32px' }}>🗺️</span>
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
                  Route Optimization Center
                </h1>
                <p
                  style={{
                    fontSize: '18px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    margin: '0 0 8px 0',
                  }}
                >
                  AI-powered intelligent route planning & real-time optimization
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
                        background: '#4ade80',
                        borderRadius: '50%',
                        animation: 'pulse 2s infinite',
                      }}
                    ></div>
                    <span
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      Live Optimization Active
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    Last updated: {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
            <button
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'all 0.3s ease',
              }}
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
              + New Route
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '4px',
            }}
          >
            {[
              { id: 'dashboard', label: 'Overview', icon: '📊' },
              { id: 'optimizer', label: 'AI Optimizer', icon: '⚡' },
              { id: 'analytics', label: 'Analytics', icon: '📈' },
              { id: 'specialized', label: 'Specialized Routing', icon: '🛣️' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  whiteSpace: 'nowrap',
                  minWidth: 'fit-content',
                  background:
                    activeView === tab.id
                      ? 'rgba(255, 255, 255, 0.9)'
                      : 'rgba(255, 255, 255, 0.2)',
                  color: activeView === tab.id ? '#4c1d95' : 'white',
                  transform:
                    activeView === tab.id
                      ? 'translateY(-2px)'
                      : 'translateY(0)',
                  boxShadow:
                    activeView === tab.id
                      ? '0 8px 25px rgba(0, 0, 0, 0.15)'
                      : 'none',
                }}
                onMouseOver={(e) => {
                  if (activeView !== tab.id) {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.3)';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeView !== tab.id) {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.2)';
                  }
                }}
              >
                <span style={{ marginRight: '8px' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
          >
            {/* Stats Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow =
                    '0 12px 40px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 32px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        margin: '0 0 8px 0',
                        fontWeight: '500',
                      }}
                    >
                      Active Routes
                    </p>
                    <p
                      style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        color: 'white',
                        margin: '0 0 4px 0',
                      }}
                    >
                      {routeStats.activeRoutes}
                    </p>
                    <p
                      style={{ fontSize: '12px', color: '#4ade80', margin: 0 }}
                    >
                      +3 from yesterday
                    </p>
                  </div>
                  <div
                    style={{
                      padding: '12px',
                      background: 'rgba(59, 130, 246, 0.2)',
                      borderRadius: '12px',
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>🚛</span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow =
                    '0 12px 40px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 32px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        margin: '0 0 8px 0',
                        fontWeight: '500',
                      }}
                    >
                      Total Miles
                    </p>
                    <p
                      style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        color: 'white',
                        margin: '0 0 4px 0',
                      }}
                    >
                      {routeStats.totalMiles.toLocaleString()}
                    </p>
                    <p
                      style={{ fontSize: '12px', color: '#4ade80', margin: 0 }}
                    >
                      This week
                    </p>
                  </div>
                  <div
                    style={{
                      padding: '12px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      borderRadius: '12px',
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>📍</span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow =
                    '0 12px 40px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 32px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        margin: '0 0 8px 0',
                        fontWeight: '500',
                      }}
                    >
                      Avg Efficiency
                    </p>
                    <p
                      style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        color: 'white',
                        margin: '0 0 4px 0',
                      }}
                    >
                      {routeStats.avgEfficiency}%
                    </p>
                    <p
                      style={{ fontSize: '12px', color: '#4ade80', margin: 0 }}
                    >
                      +2.3% improvement
                    </p>
                  </div>
                  <div
                    style={{
                      padding: '12px',
                      background: 'rgba(139, 92, 246, 0.2)',
                      borderRadius: '12px',
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>⚡</span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow =
                    '0 12px 40px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 32px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        margin: '0 0 8px 0',
                        fontWeight: '500',
                      }}
                    >
                      Cost Savings
                    </p>
                    <p
                      style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        color: 'white',
                        margin: '0 0 4px 0',
                      }}
                    >
                      ${routeStats.costSavings}
                    </p>
                    <p
                      style={{ fontSize: '12px', color: '#4ade80', margin: 0 }}
                    >
                      This month
                    </p>
                  </div>
                  <div
                    style={{
                      padding: '12px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      borderRadius: '12px',
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>💰</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Optimizations */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '24px',
                }}
              >
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: 0,
                  }}
                >
                  Recent Route Optimizations
                </h2>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
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
                  View All
                </button>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {recentOptimizations.map((route) => (
                  <div
                    key={route.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
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
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          background:
                            'linear-gradient(135deg, #3b82f6, #2563eb)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '18px',
                        }}
                      >
                        {route.id.slice(-1)}
                      </div>
                      <div>
                        <h3
                          style={{
                            fontWeight: '600',
                            color: 'white',
                            margin: '0 0 4px 0',
                            fontSize: '16px',
                          }}
                        >
                          {route.driver}
                        </h3>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            margin: 0,
                            fontSize: '14px',
                          }}
                        >
                          Route {route.id}
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '24px',
                      }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <p
                          style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#4ade80',
                            margin: '0 0 4px 0',
                          }}
                        >
                          {route.efficiency}%
                        </p>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            margin: 0,
                            fontSize: '12px',
                          }}
                        >
                          Efficiency
                        </p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p
                          style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: 'white',
                            margin: '0 0 4px 0',
                          }}
                        >
                          {route.savings}
                        </p>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            margin: 0,
                            fontSize: '12px',
                          }}
                        >
                          Savings
                        </p>
                      </div>
                      <div
                        style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background:
                            route.status === 'Completed'
                              ? 'rgba(74, 222, 128, 0.2)'
                              : route.status === 'In Progress'
                                ? 'rgba(59, 130, 246, 0.2)'
                                : 'rgba(251, 191, 36, 0.2)',
                          color:
                            route.status === 'Completed'
                              ? '#4ade80'
                              : route.status === 'In Progress'
                                ? '#3b82f6'
                                : '#fbbf24',
                          border: `1px solid ${
                            route.status === 'Completed'
                              ? '#4ade80'
                              : route.status === 'In Progress'
                                ? '#3b82f6'
                                : '#fbbf24'
                          }`,
                        }}
                      >
                        {route.status}
                      </div>
                      {/* Share Button */}
                      <button
                        onClick={() => handleRouteShare(route.id)}
                        style={{
                          background:
                            'linear-gradient(135deg, #10b981, #059669)',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
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
                        <span>🔗</span>
                        Share
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 24px 0',
                }}
              >
                Quick Actions
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '24px',
                }}
              >
                <button
                  onClick={() => setActiveView('optimizer')}
                  style={{
                    padding: '16px',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'left',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>
                    ⚡
                  </div>
                  <h3
                    style={{
                      fontWeight: 'bold',
                      fontSize: '18px',
                      margin: '0 0 8px 0',
                    }}
                  >
                    AI Route Optimizer
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: 0,
                      fontSize: '14px',
                    }}
                  >
                    Optimize routes with advanced AI algorithms
                  </p>
                </button>

                <button
                  style={{
                    padding: '16px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'left',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>
                    📍
                  </div>
                  <h3
                    style={{
                      fontWeight: 'bold',
                      fontSize: '18px',
                      margin: '0 0 8px 0',
                    }}
                  >
                    Live Tracking
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: 0,
                      fontSize: '14px',
                    }}
                  >
                    Monitor all routes in real-time
                  </p>
                </button>

                <button
                  onClick={() => setActiveView('analytics')}
                  style={{
                    padding: '16px',
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    color: 'white',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'left',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>
                    📈
                  </div>
                  <h3
                    style={{
                      fontWeight: 'bold',
                      fontSize: '18px',
                      margin: '0 0 8px 0',
                    }}
                  >
                    Analytics
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: 0,
                      fontSize: '14px',
                    }}
                  >
                    Deep insights and performance metrics
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Optimizer View */}
        {activeView === 'optimizer' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              style={{
                padding: '16px',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
              }}
            >
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  margin: '0 0 8px 0',
                }}
              >
                🤖 AI Route Optimizer
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                Advanced machine learning algorithms for optimal route planning
              </p>
            </div>
            <div style={{ padding: '24px' }}>
              <RouteOptimizerDashboard />
            </div>
          </div>
        )}

        {/* Analytics View */}
        {activeView === 'analytics' && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '32px',
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: 'white',
                      margin: '0 0 8px 0',
                    }}
                  >
                    📊 Route Performance Analytics
                  </h2>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                    Deep insights into your fleet's optimization performance
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease',
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = '#2563eb')
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = '#3b82f6')
                    }
                  >
                    Export Report
                  </button>
                  <button
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease',
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.3)')
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.2)')
                    }
                  >
                    Date Range
                  </button>
                </div>
              </div>

              {/* Performance Charts */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                  gap: '32px',
                  marginBottom: '32px',
                }}
              >
                <div
                  style={{
                    padding: '16px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                  }}
                >
                  <h3
                    style={{
                      fontWeight: 'bold',
                      fontSize: '18px',
                      color: 'white',
                      marginBottom: '16px',
                    }}
                  >
                    📈 Efficiency Trends
                  </h3>
                  <div
                    style={{
                      height: '200px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                        📈
                      </div>
                      <p style={{ color: 'white', margin: '0 0 8px 0' }}>
                        Efficiency trending upward
                      </p>
                      <p
                        style={{
                          fontSize: '32px',
                          fontWeight: 'bold',
                          color: '#4ade80',
                          margin: '0 0 4px 0',
                        }}
                      >
                        +12.5%
                      </p>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        vs last month
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: '16px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                  }}
                >
                  <h3
                    style={{
                      fontWeight: 'bold',
                      fontSize: '18px',
                      color: 'white',
                      marginBottom: '16px',
                    }}
                  >
                    💰 Cost Optimization
                  </h3>
                  <div
                    style={{
                      height: '200px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                        💰
                      </div>
                      <p style={{ color: 'white', margin: '0 0 8px 0' }}>
                        Monthly savings
                      </p>
                      <p
                        style={{
                          fontSize: '32px',
                          fontWeight: 'bold',
                          color: '#10b981',
                          margin: '0 0 4px 0',
                        }}
                      >
                        $4,250
                      </p>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        Total saved
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '24px',
                  marginBottom: '32px',
                }}
              >
                <div
                  style={{
                    textAlign: 'center',
                    padding: '32px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                  }}
                >
                  <div style={{ fontSize: '40px', marginBottom: '16px' }}>
                    🚛
                  </div>
                  <h3
                    style={{
                      fontWeight: 'bold',
                      fontSize: '20px',
                      color: 'white',
                      margin: '0 0 8px 0',
                    }}
                  >
                    Routes Optimized
                  </h3>
                  <p
                    style={{
                      fontSize: '40px',
                      fontWeight: 'bold',
                      color: '#3b82f6',
                      margin: '0 0 4px 0',
                    }}
                  >
                    247
                  </p>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                    This month
                  </p>
                </div>

                <div
                  style={{
                    textAlign: 'center',
                    padding: '32px',
                    background: 'rgba(34, 197, 94, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                  }}
                >
                  <div style={{ fontSize: '40px', marginBottom: '16px' }}>
                    ⏱️
                  </div>
                  <h3
                    style={{
                      fontWeight: 'bold',
                      fontSize: '20px',
                      color: 'white',
                      margin: '0 0 8px 0',
                    }}
                  >
                    Time Saved
                  </h3>
                  <p
                    style={{
                      fontSize: '40px',
                      fontWeight: 'bold',
                      color: '#22c55e',
                      margin: '0 0 4px 0',
                    }}
                  >
                    156h
                  </p>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                    Driver hours
                  </p>
                </div>

                <div
                  style={{
                    textAlign: 'center',
                    padding: '32px',
                    background: 'rgba(139, 92, 246, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                  }}
                >
                  <div style={{ fontSize: '40px', marginBottom: '16px' }}>
                    ⛽
                  </div>
                  <h3
                    style={{
                      fontWeight: 'bold',
                      fontSize: '20px',
                      color: 'white',
                      margin: '0 0 8px 0',
                    }}
                  >
                    Fuel Saved
                  </h3>
                  <p
                    style={{
                      fontSize: '40px',
                      fontWeight: 'bold',
                      color: '#8b5cf6',
                      margin: '0 0 4px 0',
                    }}
                  >
                    892
                  </p>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                    Gallons
                  </p>
                </div>
              </div>

              {/* Performance Insights */}
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(99, 102, 241, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                }}
              >
                <h3
                  style={{
                    fontWeight: 'bold',
                    fontSize: '18px',
                    color: 'white',
                    marginBottom: '16px',
                  }}
                >
                  🎯 AI Insights & Recommendations
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#4ade80',
                        borderRadius: '50%',
                        marginTop: '8px',
                        flexShrink: 0,
                      }}
                    ></div>
                    <p style={{ color: 'white', margin: 0, lineHeight: '1.5' }}>
                      <strong>High Performance:</strong> Route efficiency has
                      improved by 12.5% this month due to AI optimization.
                    </p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#fbbf24',
                        borderRadius: '50%',
                        marginTop: '8px',
                        flexShrink: 0,
                      }}
                    ></div>
                    <p style={{ color: 'white', margin: 0, lineHeight: '1.5' }}>
                      <strong>Opportunity:</strong> Consider optimizing morning
                      departure times to avoid peak traffic.
                    </p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#3b82f6',
                        borderRadius: '50%',
                        marginTop: '8px',
                        flexShrink: 0,
                      }}
                    ></div>
                    <p style={{ color: 'white', margin: 0, lineHeight: '1.5' }}>
                      <strong>Trend:</strong> Fuel costs decreased by 8% through
                      better route planning and traffic avoidance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Specialized Routing Tab */}
        {activeView === 'specialized' && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
          >
            {/* Sub-Tab Navigation */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { id: 'permits', label: 'Permit Planning', icon: '📋' },
                  { id: 'hazmat', label: 'Hazmat Compliance', icon: '☢️' },
                  { id: 'seasonal', label: 'Seasonal Planning', icon: '🌦️' },
                  { id: 'weather', label: 'Weather Integration', icon: '🌤️' },
                  { id: 'ports', label: 'Port Authority Access', icon: '🏗️' },
                ].map((subTab) => (
                  <button
                    key={subTab.id}
                    onClick={() => setSpecializedSubTab(subTab.id as any)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      whiteSpace: 'nowrap',
                      background:
                        specializedSubTab === subTab.id
                          ? 'rgba(255, 255, 255, 0.9)'
                          : 'rgba(255, 255, 255, 0.2)',
                      color:
                        specializedSubTab === subTab.id ? '#4c1d95' : 'white',
                      transform:
                        specializedSubTab === subTab.id
                          ? 'translateY(-2px)'
                          : 'translateY(0)',
                      boxShadow:
                        specializedSubTab === subTab.id
                          ? '0 8px 25px rgba(0, 0, 0, 0.15)'
                          : 'none',
                    }}
                  >
                    <span style={{ marginRight: '8px' }}>{subTab.icon}</span>
                    {subTab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-Tab Content */}
            {specializedSubTab === 'permits' && <PermitRoutePlanningWidget />}
            {specializedSubTab === 'hazmat' && <HazmatRouteComplianceWidget />}
            {specializedSubTab === 'seasonal' && <SeasonalLoadPlanningWidget />}
            {specializedSubTab === 'weather' && <AdvancedWeatherIntegration />}
            {specializedSubTab === 'ports' && <PortAuthorityAccessWidget />}
          </div>
        )}
      </div>

      {/* Route Sharing Modal */}
      {showRouteSharing && selectedRouteForSharing && (
        <RouteSharing
          route={selectedRouteForSharing}
          onShare={handleShareComplete}
          onClose={handleShareCancel}
        />
      )}
    </div>
  );
}
