'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import AdvancedWeatherIntegration from '../components/AdvancedWeatherIntegration';
import HazmatRouteComplianceWidget from '../components/HazmatRouteComplianceWidget';
import PermitRoutePlanningWidget from '../components/PermitRoutePlanningWidget';
import PortAuthorityAccessWidget from '../components/PortAuthorityAccessWidget';
import RouteOptimizerDashboard from '../components/RouteOptimizerDashboard';
import RouteSharing from '../components/RouteSharing';
import SeasonalLoadPlanningWidget from '../components/SeasonalLoadPlanningWidget';
import { HeavyHaulPermitService } from '../services/heavy-haul-permit-service';
import { OptimizedRoute } from '../services/route-optimization';
import {
  UniversalQuote,
  universalQuoteService,
} from '../services/universal-quote-service';

export default function RoutesPage() {
  const [activeView, setActiveView] = useState<
    'dashboard' | 'optimizer' | 'analytics' | 'specialized' | 'saved-quotes'
  >('dashboard');
  const [specializedSubTab, setSpecializedSubTab] = useState<
    | 'permits'
    | 'hazmat'
    | 'seasonal'
    | 'weather'
    | 'ports'
    | 'pharmaceutical'
    | 'medical-courier'
  >('permits');
  // Route statistics (cleared for production)
  const [routeStats, setRouteStats] = useState({
    activeRoutes: 0,
    totalMiles: 0,
    avgEfficiency: 0,
    costSavings: 0,
  });
  // Recent optimizations data (cleared for production)
  const [recentOptimizations, setRecentOptimizations] = useState<{
    id: string;
    driver: string;
    efficiency: number;
    savings: string;
    status: string;
  }[]>([]);
  const [showRouteSharing, setShowRouteSharing] = useState(false);
  const [selectedRouteForSharing, setSelectedRouteForSharing] =
    useState<OptimizedRoute | null>(null);

  // Quote integration state
  const [savedQuotes, setSavedQuotes] = useState<UniversalQuote[]>([]);
  const [selectedQuoteForRouting, setSelectedQuoteForRouting] =
    useState<UniversalQuote | null>(null);
  const [heavyHaulService] = useState(() => new HeavyHaulPermitService());
  const [routePlanningInProgress, setRoutePlanningInProgress] = useState<
    string[]
  >([]);

  // Sample route data (cleared for production)
  const sampleRoutes: OptimizedRoute[] = [];

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

  // Load saved quotes on component mount
  useEffect(() => {
    const loadSavedQuotes = () => {
      const quotes = universalQuoteService.getRoutePlanningCandidates();
      setSavedQuotes(quotes);
    };
    loadSavedQuotes();
  }, []);

  // Quote route planning functions
  const handleStartRoutePlanning = async (quote: UniversalQuote) => {
    setRoutePlanningInProgress((prev) => [...prev, quote.id]);
    setSelectedQuoteForRouting(quote);

    // Request route optimization
    const routeRequest = universalQuoteService.requestRouteOptimization(
      quote.id,
      {
        priority:
          quote.timeline.urgency === 'emergency'
            ? 'urgent'
            : quote.timeline.urgency === 'expedited'
              ? 'high'
              : 'medium',
        optimizationGoals: ['time', 'cost', 'fuel'],
        constraints: {
          avoidTolls: false,
          avoidHighways: false,
          maxDrivingHours: 11,
        },
        requestedBy: 'route-planner@fleetflow.com',
        requestedAt: new Date().toISOString(),
      }
    );

    // Simulate route optimization process
    setTimeout(() => {
      const optimizedDistance =
        quote.routeData?.distance || Math.floor(Math.random() * 1000) + 200;
      const optimizedDuration = optimizedDistance / 55; // Assume 55 mph average

      universalQuoteService.updateRouteOptimization(quote.id, {
        distance: optimizedDistance,
        estimatedDuration: optimizedDuration,
        routePlanningStatus: 'optimized',
        optimizedRoute: {
          waypoints: [quote.origin, quote.destination],
          totalDistance: optimizedDistance,
          totalDuration: optimizedDuration,
          fuelEfficiency: 6.8,
          estimatedFuelCost: (optimizedDistance / 6.8) * 3.45,
        },
      });

      setRoutePlanningInProgress((prev) =>
        prev.filter((id) => id !== quote.id)
      );

      // Refresh quotes list
      const updatedQuotes = universalQuoteService.getRoutePlanningCandidates();
      setSavedQuotes(updatedQuotes);
    }, 3000);
  };

  const handleViewOptimizedRoute = (quote: UniversalQuote) => {
    setSelectedQuoteForRouting(quote);
    // Could open a detailed route view modal here
    console.log('Viewing optimized route for:', quote.quoteNumber);
  };

  const refreshSavedQuotes = () => {
    const quotes = universalQuoteService.getRoutePlanningCandidates();
    setSavedQuotes(quotes);
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
                    />
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
              { id: 'saved-quotes', label: 'Saved Quotes', icon: '💾' },
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
                {recentOptimizations.length > 0 ? (
                  recentOptimizations.map((route) => (
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
                  ))
                ) : (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '40px 20px',
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '48px',
                        marginBottom: '16px',
                      }}
                    >
                      🗺️
                    </div>
                    <p style={{ fontSize: '16px', margin: 0 }}>
                      No recent optimizations yet
                    </p>
                    <p style={{ fontSize: '14px', margin: '8px 0 0 0' }}>
                      Route optimizations will appear here once created
                    </p>
                  </div>
                )}
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
                    />
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
                    />
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
                    />
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
                  {
                    id: 'pharmaceutical',
                    label: 'Pharmaceutical Routes',
                    icon: '💊',
                  },
                  {
                    id: 'medical-courier',
                    label: 'Medical Courier Services',
                    icon: '🏥',
                  },
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
            {specializedSubTab === 'pharmaceutical' && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginTop: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '20px',
                  }}
                >
                  <span style={{ fontSize: '32px' }}>💊</span>
                  <div>
                    <h3
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#1f2937',
                        margin: 0,
                      }}
                    >
                      Pharmaceutical Route Planning
                    </h3>
                    <p
                      style={{
                        color: '#6b7280',
                        margin: 0,
                        fontSize: '14px',
                      }}
                    >
                      Cold chain & temperature-controlled delivery optimization
                    </p>
                  </div>
                </div>

                {/* Pharmaceutical Route Features */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px',
                    marginBottom: '24px',
                  }}
                >
                  {/* Temperature Control Planning */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      borderRadius: '12px',
                      padding: '20px',
                      color: 'white',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '12px',
                      }}
                    >
                      <span style={{ fontSize: '20px' }}>🌡️</span>
                      <h4 style={{ margin: 0, fontSize: '16px' }}>
                        Temperature Control Planning
                      </h4>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>
                      Optimize routes for cold chain requirements: 2-8°C, -20°C,
                      -70°C
                    </p>
                    <div style={{ marginTop: '12px', fontSize: '12px' }}>
                      <div>✓ Real-time temperature monitoring</div>
                      <div>✓ Backup refrigeration planning</div>
                      <div>✓ Temperature excursion alerts</div>
                    </div>
                  </div>

                  {/* FDA Compliance Routing */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      borderRadius: '12px',
                      padding: '20px',
                      color: 'white',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '12px',
                      }}
                    >
                      <span style={{ fontSize: '20px' }}>📋</span>
                      <h4 style={{ margin: 0, fontSize: '16px' }}>
                        FDA Compliance Routing
                      </h4>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>
                      Ensure all routes meet FDA, GMP, and pharmaceutical
                      regulations
                    </p>
                    <div style={{ marginTop: '12px', fontSize: '12px' }}>
                      <div>✓ Chain of custody documentation</div>
                      <div>✓ Audit trail maintenance</div>
                      <div>✓ Regulatory checkpoint validation</div>
                    </div>
                  </div>

                  {/* Emergency Pharmaceutical Delivery */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      borderRadius: '12px',
                      padding: '20px',
                      color: 'white',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '12px',
                      }}
                    >
                      <span style={{ fontSize: '20px' }}>⚡</span>
                      <h4 style={{ margin: 0, fontSize: '16px' }}>
                        Emergency Delivery Routes
                      </h4>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>
                      Expedited routing for critical pharmaceutical deliveries
                    </p>
                    <div style={{ marginTop: '12px', fontSize: '12px' }}>
                      <div>✓ Priority lane optimization</div>
                      <div>✓ Hospital direct access routes</div>
                      <div>✓ 24/7 emergency dispatch</div>
                    </div>
                  </div>
                </div>

                {/* Active Pharmaceutical Routes */}
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.05)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(59, 130, 246, 0.1)',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#1f2937',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    🚛 Active Pharmaceutical Routes
                  </h4>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        '120px 1fr 1fr 100px 120px 100px 80px',
                      gap: '12px',
                      padding: '12px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#374151',
                      textTransform: 'uppercase',
                    }}
                  >
                    <div>Route ID</div>
                    <div>Origin → Destination</div>
                    <div>Pharmaceutical Product</div>
                    <div>Temperature</div>
                    <div>Compliance</div>
                    <div>ETA</div>
                    <div>Status</div>
                  </div>

                  {[
                    {
                      id: 'PH-R001',
                      route: 'Pfizer NJ → Mount Sinai Hospital NYC',
                      product: 'COVID-19 Vaccines',
                      temperature: '-70°C',
                      compliance: 'FDA, CDC',
                      eta: '2:45 PM',
                      status: 'In Transit',
                      urgency: 'critical',
                    },
                    {
                      id: 'PH-R002',
                      route: 'J&J Facility → Boston Medical Center',
                      product: 'Clinical Trial Samples',
                      temperature: '-20°C',
                      compliance: 'FDA, GCP',
                      eta: '4:15 PM',
                      status: 'Loading',
                      urgency: 'high',
                    },
                    {
                      id: 'PH-R003',
                      route: 'Merck PA → CVS Distribution Center',
                      product: 'Prescription Medications',
                      temperature: '2-8°C',
                      compliance: 'FDA, USP',
                      eta: '11:30 AM',
                      status: 'Delivered',
                      urgency: 'medium',
                    },
                    {
                      id: 'PH-R004',
                      route: 'AbbVie IL → Mayo Clinic MN',
                      product: 'Specialty Biologics',
                      temperature: '2-8°C',
                      compliance: 'FDA, GMP',
                      eta: '6:20 PM',
                      status: 'Optimizing',
                      urgency: 'medium',
                    },
                  ].map((route, index) => (
                    <div
                      key={route.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          '120px 1fr 1fr 100px 120px 100px 80px',
                        gap: '12px',
                        padding: '12px',
                        background:
                          index % 2 === 0
                            ? 'rgba(255, 255, 255, 0.5)'
                            : 'transparent',
                        borderRadius: '6px',
                        alignItems: 'center',
                        fontSize: '13px',
                        color: '#374151',
                      }}
                    >
                      <div style={{ fontWeight: 'bold', color: '#3b82f6' }}>
                        {route.id}
                      </div>
                      <div>{route.route}</div>
                      <div>{route.product}</div>
                      <div
                        style={{
                          background: 'rgba(59, 130, 246, 0.1)',
                          color: '#1d4ed8',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          textAlign: 'center',
                          fontWeight: 'bold',
                        }}
                      >
                        {route.temperature}
                      </div>
                      <div
                        style={{
                          background: 'rgba(16, 185, 129, 0.1)',
                          color: '#059669',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          textAlign: 'center',
                          fontWeight: 'bold',
                        }}
                      >
                        {route.compliance}
                      </div>
                      <div>{route.eta}</div>
                      <div
                        style={{
                          background:
                            route.status === 'Delivered'
                              ? 'rgba(16, 185, 129, 0.1)'
                              : route.status === 'In Transit'
                                ? 'rgba(59, 130, 246, 0.1)'
                                : route.status === 'Loading'
                                  ? 'rgba(245, 158, 11, 0.1)'
                                  : 'rgba(107, 114, 128, 0.1)',
                          color:
                            route.status === 'Delivered'
                              ? '#059669'
                              : route.status === 'In Transit'
                                ? '#1d4ed8'
                                : route.status === 'Loading'
                                  ? '#d97706'
                                  : '#374151',
                          padding: '4px 6px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          textAlign: 'center',
                          fontWeight: 'bold',
                        }}
                      >
                        {route.status}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pharmaceutical Route Actions */}
                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    marginTop: '20px',
                    flexWrap: 'wrap',
                  }}
                >
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    ➕ Plan New Pharmaceutical Route
                  </button>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    🌡️ Temperature Monitoring Dashboard
                  </button>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    📋 Compliance Report
                  </button>
                </div>
              </div>
            )}
            {specializedSubTab === 'medical-courier' && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginTop: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '20px',
                  }}
                >
                  <span style={{ fontSize: '32px' }}>🏥</span>
                  <div>
                    <h3
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#1f2937',
                        margin: 0,
                      }}
                    >
                      Medical Courier & Expediting Services
                    </h3>
                    <p
                      style={{
                        color: '#6b7280',
                        margin: 0,
                        fontSize: '14px',
                      }}
                    >
                      STAT deliveries, medical equipment transport, and
                      emergency medical logistics
                    </p>
                  </div>
                </div>

                {/* Medical Courier Service Features */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px',
                    marginBottom: '24px',
                  }}
                >
                  {/* STAT Delivery Services */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                      borderRadius: '12px',
                      padding: '20px',
                      color: 'white',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '12px',
                      }}
                    >
                      <span style={{ fontSize: '20px' }}>🚨</span>
                      <h4 style={{ margin: 0, fontSize: '16px' }}>
                        STAT Delivery Services
                      </h4>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>
                      Emergency medical deliveries with guaranteed response
                      times
                    </p>
                    <div style={{ marginTop: '12px', fontSize: '12px' }}>
                      <div>✓ 30-minute emergency response</div>
                      <div>✓ 24/7 availability</div>
                      <div>✓ Real-time tracking</div>
                    </div>
                  </div>

                  {/* Medical Equipment Transport */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                      borderRadius: '12px',
                      padding: '20px',
                      color: 'white',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '12px',
                      }}
                    >
                      <span style={{ fontSize: '20px' }}>🏥</span>
                      <h4 style={{ margin: 0, fontSize: '16px' }}>
                        Medical Equipment Transport
                      </h4>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>
                      Specialized transport for sensitive medical equipment
                    </p>
                    <div style={{ marginTop: '12px', fontSize: '12px' }}>
                      <div>✓ Temperature-controlled vehicles</div>
                      <div>✓ Specialized handling protocols</div>
                      <div>✓ Insurance coverage</div>
                    </div>
                  </div>

                  {/* Clinical Trial Logistics */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
                      borderRadius: '12px',
                      padding: '20px',
                      color: 'white',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '12px',
                      }}
                    >
                      <span style={{ fontSize: '20px' }}>🧪</span>
                      <h4 style={{ margin: 0, fontSize: '16px' }}>
                        Clinical Trial Logistics
                      </h4>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>
                      Secure transport for clinical trial materials and samples
                    </p>
                    <div style={{ marginTop: '12px', fontSize: '12px' }}>
                      <div>✓ Chain of custody protocols</div>
                      <div>✓ FDA compliance</div>
                      <div>✓ Sample integrity monitoring</div>
                    </div>
                  </div>
                </div>

                {/* Active Medical Courier Routes */}
                <div
                  style={{
                    background: 'rgba(220, 38, 38, 0.05)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(220, 38, 38, 0.1)',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#1f2937',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    🚑 Active Medical Courier Routes
                  </h4>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        '120px 1fr 1fr 100px 120px 100px 80px',
                      gap: '12px',
                      padding: '12px',
                      background: 'rgba(220, 38, 38, 0.1)',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#374151',
                      textTransform: 'uppercase',
                    }}
                  >
                    <div>Route ID</div>
                    <div>Origin → Destination</div>
                    <div>Medical Service</div>
                    <div>Urgency</div>
                    <div>Compliance</div>
                    <div>ETA</div>
                    <div>Status</div>
                  </div>

                  {[
                    {
                      id: 'MC-R001',
                      route: 'Mayo Clinic → Emergency Room',
                      service: 'STAT Lab Results',
                      urgency: 'Critical',
                      compliance: 'HIPAA',
                      eta: '12 min',
                      status: 'In Transit',
                      urgencyLevel: 'critical',
                    },
                    {
                      id: 'MC-R002',
                      route: 'Medical Center → Specialty Clinic',
                      service: 'Medical Equipment',
                      urgency: 'High',
                      compliance: 'DOT, OSHA',
                      eta: '45 min',
                      status: 'Loading',
                      urgencyLevel: 'high',
                    },
                    {
                      id: 'MC-R003',
                      route: 'Research Lab → Hospital Network',
                      service: 'Clinical Trial Samples',
                      urgency: 'Medium',
                      compliance: 'FDA, GCP',
                      eta: '1:20 PM',
                      status: 'Delivered',
                      urgencyLevel: 'medium',
                    },
                    {
                      id: 'MC-R004',
                      route: 'Organ Bank → Transplant Center',
                      service: 'Organ Transport',
                      urgency: 'Critical',
                      compliance: 'UNOS',
                      eta: '18 min',
                      status: 'Emergency',
                      urgencyLevel: 'critical',
                    },
                  ].map((route, index) => (
                    <div
                      key={route.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          '120px 1fr 1fr 100px 120px 100px 80px',
                        gap: '12px',
                        padding: '12px',
                        background:
                          index % 2 === 0
                            ? 'rgba(255, 255, 255, 0.5)'
                            : 'transparent',
                        borderRadius: '6px',
                        alignItems: 'center',
                        fontSize: '13px',
                        color: '#374151',
                      }}
                    >
                      <div style={{ fontWeight: 'bold', color: '#dc2626' }}>
                        {route.id}
                      </div>
                      <div>{route.route}</div>
                      <div>{route.service}</div>
                      <div
                        style={{
                          background:
                            route.urgencyLevel === 'critical'
                              ? 'rgba(220, 38, 38, 0.1)'
                              : route.urgencyLevel === 'high'
                                ? 'rgba(245, 158, 11, 0.1)'
                                : 'rgba(34, 197, 94, 0.1)',
                          color:
                            route.urgencyLevel === 'critical'
                              ? '#dc2626'
                              : route.urgencyLevel === 'high'
                                ? '#f59e0b'
                                : '#22c55e',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          textAlign: 'center',
                          fontWeight: 'bold',
                        }}
                      >
                        {route.urgency}
                      </div>
                      <div
                        style={{
                          background: 'rgba(59, 130, 246, 0.1)',
                          color: '#3b82f6',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          textAlign: 'center',
                          fontWeight: 'bold',
                        }}
                      >
                        {route.compliance}
                      </div>
                      <div>{route.eta}</div>
                      <div
                        style={{
                          background:
                            route.status === 'Emergency'
                              ? 'rgba(220, 38, 38, 0.1)'
                              : route.status === 'In Transit'
                                ? 'rgba(59, 130, 246, 0.1)'
                                : route.status === 'Loading'
                                  ? 'rgba(245, 158, 11, 0.1)'
                                  : 'rgba(34, 197, 94, 0.1)',
                          color:
                            route.status === 'Emergency'
                              ? '#dc2626'
                              : route.status === 'In Transit'
                                ? '#3b82f6'
                                : route.status === 'Loading'
                                  ? '#f59e0b'
                                  : '#22c55e',
                          padding: '4px 6px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          textAlign: 'center',
                          fontWeight: 'bold',
                        }}
                      >
                        {route.status}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Medical Courier Service Actions */}
                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    marginTop: '20px',
                    flexWrap: 'wrap',
                  }}
                >
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    🚨 Request STAT Delivery
                  </button>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    🏥 Schedule Equipment Transport
                  </button>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    📊 View Service Analytics
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Saved Quotes Tab */}
        {activeView === 'saved-quotes' && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
          >
            {/* Header */}
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
                <div>
                  <h2
                    style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: 'white',
                      margin: '0 0 8px 0',
                    }}
                  >
                    💾 Saved Quotes for Route Planning
                  </h2>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                    Convert approved quotes into optimized routes
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={refreshSavedQuotes}
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
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
                    🔄 Refresh
                  </button>
                  <Link
                    href='/quoting'
                    style={{
                      background: 'linear-gradient(135deg, #14b8a6, #0f766e)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'transform 0.2s ease',
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = 'translateY(-1px)')
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = 'translateY(0)')
                    }
                  >
                    💰 Create New Quote
                  </Link>
                </div>
              </div>

              {/* Quick Stats */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '20px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                  }}
                >
                  <div
                    style={{
                      color: '#3b82f6',
                      fontSize: '24px',
                      fontWeight: '700',
                    }}
                  >
                    {savedQuotes.length}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                    }}
                  >
                    Ready for Planning
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(34, 197, 94, 0.2)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                  }}
                >
                  <div
                    style={{
                      color: '#22c55e',
                      fontSize: '24px',
                      fontWeight: '700',
                    }}
                  >
                    $
                    {savedQuotes
                      .reduce((sum, q) => sum + q.pricing.total, 0)
                      .toLocaleString()}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                    }}
                  >
                    Total Quote Value
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.2)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                  }}
                >
                  <div
                    style={{
                      color: '#f59e0b',
                      fontSize: '24px',
                      fontWeight: '700',
                    }}
                  >
                    {routePlanningInProgress.length}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                    }}
                  >
                    Planning in Progress
                  </div>
                </div>
              </div>
            </div>

            {/* Quotes List */}
            {savedQuotes.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                  gap: '24px',
                }}
              >
                {savedQuotes.map((quote) => (
                  <div
                    key={quote.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow =
                        '0 12px 40px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 32px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    {/* Quote Header */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '16px',
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            color: 'white',
                            fontSize: '18px',
                            fontWeight: '600',
                            margin: '0 0 4px 0',
                          }}
                        >
                          {quote.quoteNumber}
                        </h3>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                          }}
                        >
                          <span
                            style={{
                              background:
                                quote.type === 'FTL'
                                  ? '#3b82f6'
                                  : quote.type === 'LTL'
                                    ? '#10b981'
                                    : quote.type === 'Specialized'
                                      ? '#dc2626'
                                      : quote.type === 'Multi-State'
                                        ? '#7c3aed'
                                        : '#f59e0b',
                              color: 'white',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '10px',
                              fontWeight: '600',
                              textTransform: 'uppercase',
                            }}
                          >
                            {quote.type}
                          </span>
                          <span
                            style={{
                              background:
                                quote.timeline.urgency === 'emergency'
                                  ? '#dc2626'
                                  : quote.timeline.urgency === 'expedited'
                                    ? '#f59e0b'
                                    : '#22c55e',
                              color: 'white',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '10px',
                              fontWeight: '600',
                              textTransform: 'uppercase',
                            }}
                          >
                            {quote.timeline.urgency}
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            color: '#22c55e',
                            fontSize: '20px',
                            fontWeight: '700',
                          }}
                        >
                          ${quote.pricing.total.toLocaleString()}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '12px',
                          }}
                        >
                          Total Value
                        </div>
                      </div>
                    </div>

                    {/* Customer & Route Info */}
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '16px',
                      }}
                    >
                      <div
                        style={{
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '600',
                          marginBottom: '8px',
                        }}
                      >
                        👤 {quote.customer.name}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '13px',
                          marginBottom: '8px',
                        }}
                      >
                        📍 {quote.origin.city}, {quote.origin.state} →{' '}
                        {quote.destination.city}, {quote.destination.state}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '13px',
                          marginBottom: '8px',
                        }}
                      >
                        📦 {quote.cargo.weight.toLocaleString()} lbs •{' '}
                        {quote.cargo.pieces} pieces
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '13px',
                        }}
                      >
                        🚛 {quote.equipment.type}
                      </div>
                    </div>

                    {/* Route Status */}
                    {quote.routeData && (
                      <div
                        style={{
                          background: 'rgba(59, 130, 246, 0.1)',
                          borderRadius: '8px',
                          padding: '12px',
                          marginBottom: '16px',
                          border: '1px solid rgba(59, 130, 246, 0.2)',
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
                            <div
                              style={{
                                color: 'white',
                                fontSize: '13px',
                                fontWeight: '600',
                              }}
                            >
                              Route Status
                            </div>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '12px',
                              }}
                            >
                              {quote.routeData.distance} miles •{' '}
                              {quote.routeData.estimatedDuration.toFixed(1)}h
                            </div>
                          </div>
                          <span
                            style={{
                              background:
                                quote.routeData.routePlanningStatus ===
                                'optimized'
                                  ? '#22c55e'
                                  : quote.routeData.routePlanningStatus ===
                                      'planning'
                                    ? '#f59e0b'
                                    : '#6b7280',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '8px',
                              fontSize: '10px',
                              fontWeight: '600',
                              textTransform: 'capitalize',
                            }}
                          >
                            {quote.routeData.routePlanningStatus.replace(
                              '_',
                              ' '
                            )}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div
                      style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}
                    >
                      {!quote.routeData ||
                      quote.routeData.routePlanningStatus === 'not_planned' ? (
                        <button
                          onClick={() => handleStartRoutePlanning(quote)}
                          disabled={routePlanningInProgress.includes(quote.id)}
                          style={{
                            background: routePlanningInProgress.includes(
                              quote.id
                            )
                              ? '#6b7280'
                              : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                            color: 'white',
                            border: 'none',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: routePlanningInProgress.includes(quote.id)
                              ? 'not-allowed'
                              : 'pointer',
                            flex: 1,
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {routePlanningInProgress.includes(quote.id)
                            ? '⏳ Planning Route...'
                            : '🗺️ Start Route Planning'}
                        </button>
                      ) : quote.routeData.routePlanningStatus ===
                        'optimized' ? (
                        <button
                          onClick={() => handleViewOptimizedRoute(quote)}
                          style={{
                            background:
                              'linear-gradient(135deg, #22c55e, #16a34a)',
                            color: 'white',
                            border: 'none',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            flex: 1,
                            transition: 'all 0.2s ease',
                          }}
                        >
                          ✅ View Optimized Route
                        </button>
                      ) : (
                        <button
                          disabled
                          style={{
                            background: '#f59e0b',
                            color: 'white',
                            border: 'none',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'not-allowed',
                            flex: 1,
                          }}
                        >
                          ⏳ Planning in Progress...
                        </button>
                      )}
                      <Link
                        href={`/quoting?quote=${quote.id}`}
                        style={{
                          background: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          padding: '10px 16px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '600',
                          textDecoration: 'none',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          textAlign: 'center',
                          transition: 'all 0.2s ease',
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
                        📝 Edit Quote
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '48px',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <div
                  style={{
                    fontSize: '48px',
                    marginBottom: '16px',
                  }}
                >
                  📭
                </div>
                <h3
                  style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: '600',
                    marginBottom: '8px',
                  }}
                >
                  No Saved Quotes for Route Planning
                </h3>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginBottom: '24px',
                  }}
                >
                  Create and approve quotes in the Freight Quoting system to see
                  them here for route optimization.
                </p>
                <Link
                  href='/quoting'
                  style={{
                    background: 'linear-gradient(135deg, #14b8a6, #0f766e)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    display: 'inline-block',
                    transition: 'transform 0.2s ease',
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = 'translateY(-2px)')
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = 'translateY(0)')
                  }
                >
                  💰 Create Your First Quote
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Specialized Routing View */}
        {activeView === 'specialized' && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
          >
            {/* Specialized Routing Header */}
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
                    🚛 Specialized Equipment Routing
                  </h2>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                    Heavy haul, oversized loads, and specialized equipment route
                    planning
                  </p>
                </div>
              </div>

              {/* Specialized Sub-Tabs */}
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '24px',
                  flexWrap: 'wrap',
                }}
              >
                {[
                  { id: 'permits', label: 'Heavy Haul Permits', icon: '📋' },
                  { id: 'hazmat', label: 'Hazmat Routing', icon: '☢️' },
                  { id: 'seasonal', label: 'Seasonal Planning', icon: '🌤️' },
                  { id: 'weather', label: 'Weather Integration', icon: '🌦️' },
                  { id: 'ports', label: 'Port Authority', icon: '🚢' },
                ].map((subTab) => (
                  <button
                    key={subTab.id}
                    onClick={() => setSpecializedSubTab(subTab.id as any)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '13px',
                      background:
                        specializedSubTab === subTab.id
                          ? 'rgba(255, 255, 255, 0.9)'
                          : 'rgba(255, 255, 255, 0.2)',
                      color:
                        specializedSubTab === subTab.id ? '#4c1d95' : 'white',
                    }}
                  >
                    <span style={{ marginRight: '6px' }}>{subTab.icon}</span>
                    {subTab.label}
                  </button>
                ))}
              </div>

              {/* Specialized Content */}
              {specializedSubTab === 'permits' && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginBottom: '24px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '48px',
                        background: 'rgba(220, 38, 38, 0.2)',
                        padding: '16px',
                        borderRadius: '12px',
                      }}
                    >
                      🚛
                    </div>
                    <div>
                      <h3
                        style={{
                          color: 'white',
                          fontSize: '24px',
                          fontWeight: '600',
                          margin: '0 0 8px 0',
                        }}
                      >
                        Heavy Haul & Oversized Load Routing
                      </h3>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        Specialized routing for loads requiring permits, escort
                        vehicles, and custom route planning
                      </p>
                    </div>
                  </div>

                  {/* Heavy Haul Features */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '16px',
                      marginBottom: '24px',
                    }}
                  >
                    {[
                      {
                        title: 'Oversize Load Analysis',
                        description:
                          'Width > 8.5ft, Height > 13.5ft, Length > 75ft',
                        icon: '📏',
                        color: '#dc2626',
                      },
                      {
                        title: 'Overweight Load Analysis',
                        description: 'Weight > 80,000 lbs gross vehicle weight',
                        icon: '⚖️',
                        color: '#ea580c',
                      },
                      {
                        title: 'Multi-State Permits',
                        description:
                          'Automated permit applications for all 50 states',
                        icon: '🗺️',
                        color: '#7c3aed',
                      },
                      {
                        title: 'Route Restrictions',
                        description:
                          'Bridge clearances, weight limits, time restrictions',
                        icon: '🚧',
                        color: '#0891b2',
                      },
                    ].map((feature, index) => (
                      <div
                        key={index}
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          padding: '16px',
                          border: `1px solid ${feature.color}40`,
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '8px',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '20px',
                              background: `${feature.color}20`,
                              padding: '8px',
                              borderRadius: '6px',
                            }}
                          >
                            {feature.icon}
                          </span>
                          <h4
                            style={{
                              color: 'white',
                              fontSize: '16px',
                              fontWeight: '600',
                              margin: 0,
                            }}
                          >
                            {feature.title}
                          </h4>
                        </div>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '13px',
                            margin: 0,
                          }}
                        >
                          {feature.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Heavy Haul Planning Tool */}
                  <div
                    style={{
                      background: 'rgba(220, 38, 38, 0.1)',
                      borderRadius: '12px',
                      padding: '24px',
                      border: '1px solid rgba(220, 38, 38, 0.3)',
                    }}
                  >
                    <h4
                      style={{
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: '600',
                        marginBottom: '16px',
                      }}
                    >
                      🚚 Heavy Haul Route Planner
                    </h4>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px',
                        marginBottom: '16px',
                      }}
                    >
                      <div>
                        <label
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '13px',
                            fontWeight: '500',
                            display: 'block',
                            marginBottom: '4px',
                          }}
                        >
                          Load Dimensions
                        </label>
                        <input
                          type='text'
                          placeholder='Length x Width x Height (ft)'
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '13px',
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '13px',
                            fontWeight: '500',
                            display: 'block',
                            marginBottom: '4px',
                          }}
                        >
                          Total Weight (lbs)
                        </label>
                        <input
                          type='number'
                          placeholder='80,000+'
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '13px',
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '13px',
                            fontWeight: '500',
                            display: 'block',
                            marginBottom: '4px',
                          }}
                        >
                          Equipment Type
                        </label>
                        <select
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '13px',
                          }}
                        >
                          <option value=''>Select Equipment</option>
                          <option value='lowboy'>Lowboy Trailer</option>
                          <option value='rgn'>RGN (Removable Gooseneck)</option>
                          <option value='step-deck'>Step Deck</option>
                          <option value='multi-axle'>Multi-Axle Trailer</option>
                          <option value='modular'>Modular Trailer</option>
                        </select>
                      </div>
                    </div>
                    <div
                      style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
                    >
                      <button
                        style={{
                          background:
                            'linear-gradient(135deg, #dc2626, #b91c1c)',
                          color: 'white',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.transform = 'translateY(-2px)')
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.transform = 'translateY(0)')
                        }
                      >
                        🔍 Analyze Heavy Haul Requirements
                      </button>
                      <button
                        style={{
                          background:
                            'linear-gradient(135deg, #14b8a6, #0891b2)',
                          color: 'white',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.transform = 'translateY(-2px)')
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.transform = 'translateY(0)')
                        }
                        onClick={() => {
                          // Redirect to AI Flow Pilot Car Network
                          window.open('/ai#pilot-car-network', '_blank');
                        }}
                      >
                        🚗 FleetFlow Pilot Car Network
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {specializedSubTab === 'hazmat' && (
                <HazmatRouteComplianceWidget />
              )}
              {specializedSubTab === 'seasonal' && (
                <SeasonalLoadPlanningWidget />
              )}
              {specializedSubTab === 'weather' && (
                <AdvancedWeatherIntegration />
              )}
            </div>
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
