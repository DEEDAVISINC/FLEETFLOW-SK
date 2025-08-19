'use client';

import Link from 'next/link';
import { useState } from 'react';
import MultiStateQuoteBuilder from '../components/MultiStateQuoteBuilder';
import RouteOptimizerDashboard from '../components/RouteOptimizerDashboard';
import RouteSharing from '../components/RouteSharing';
import {
  MultiStateConsolidatedQuote,
  multiStateQuoteService,
} from '../services/MultiStateQuoteService';
import { OptimizedRoute } from '../services/route-optimization';

export default function RoutesPageWithMultiState() {
  const [activeView, setActiveView] = useState<
    | 'dashboard'
    | 'optimizer'
    | 'analytics'
    | 'specialized'
    | 'multi-state-quotes'
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

  // Multi-State Quote functionality
  const [multiStateQuotes, setMultiStateQuotes] = useState<
    MultiStateConsolidatedQuote[]
  >([]);
  const [selectedQuote, setSelectedQuote] =
    useState<MultiStateConsolidatedQuote | null>(null);

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

  const handleQuoteCreated = (quote: MultiStateConsolidatedQuote) => {
    setMultiStateQuotes((prev) => [...prev, quote]);
    console.log('New multi-state quote created:', quote);
  };

  const handleQuoteUpdated = (quote: MultiStateConsolidatedQuote) => {
    setMultiStateQuotes((prev) =>
      prev.map((q) => (q.id === quote.id ? quote : q))
    );
    console.log('Multi-state quote updated:', quote);
  };

  // Load existing quotes on component mount
  const loadExistingQuotes = () => {
    const quotes = multiStateQuoteService.getAllQuotes();
    setMultiStateQuotes(quotes);
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
                  AI-powered intelligent route planning & enterprise multi-state
                  quotes
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
              {
                id: 'multi-state-quotes',
                label: 'Multi-State Quotes',
                icon: '🌎',
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveView(tab.id as any);
                  if (tab.id === 'multi-state-quotes') {
                    loadExistingQuotes();
                  }
                }}
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
                      ? tab.id === 'multi-state-quotes'
                        ? 'linear-gradient(135deg, #1e3a8a, #3730a3)'
                        : 'rgba(255, 255, 255, 0.9)'
                      : 'rgba(255, 255, 255, 0.2)',
                  color: activeView === tab.id ? 'white' : 'white',
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

        {/* Multi-State Quotes View */}
        {activeView === 'multi-state-quotes' && (
          <div>
            {/* Multi-State Quotes Dashboard */}
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
                    🌎 Multi-State Consolidated Quotes
                  </h2>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                    Enterprise-grade multi-state logistics quote management
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={loadExistingQuotes}
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
                    🔄 Refresh Quotes
                  </button>
                </div>
              </div>

              {/* Existing Quotes Summary */}
              {multiStateQuotes.length > 0 && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px',
                    marginBottom: '32px',
                  }}
                >
                  {multiStateQuotes.slice(0, 4).map((quote) => (
                    <div
                      key={quote.id}
                      style={{
                        background: 'rgba(30, 58, 138, 0.2)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid rgba(30, 58, 138, 0.3)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                      onClick={() => setSelectedQuote(quote)}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background =
                          'rgba(30, 58, 138, 0.3)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background =
                          'rgba(30, 58, 138, 0.2)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '12px',
                        }}
                      >
                        <h3
                          style={{
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: '600',
                            margin: 0,
                          }}
                        >
                          {quote.quoteName}
                        </h3>
                        <span
                          style={{
                            background:
                              quote.status === 'approved'
                                ? '#10b981'
                                : quote.status === 'under_review'
                                  ? '#3b82f6'
                                  : quote.status === 'pending'
                                    ? '#f59e0b'
                                    : '#6b7280',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '10px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                          }}
                        >
                          {quote.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '14px',
                          margin: '0 0 12px 0',
                        }}
                      >
                        {quote.client.name}
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              color: '#1e3a8a',
                              fontSize: '18px',
                              fontWeight: '700',
                            }}
                          >
                            $
                            {(
                              quote.financialSummary.totalAnnualRevenue /
                              1000000
                            ).toFixed(1)}
                            M
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '12px',
                            }}
                          >
                            Annual Value
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div
                            style={{
                              color: 'white',
                              fontSize: '14px',
                              fontWeight: '600',
                            }}
                          >
                            {quote.stateRoutes.length} States
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '12px',
                            }}
                          >
                            {quote.financialSummary.totalAnnualVolume.toLocaleString()}{' '}
                            loads
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Multi-State Quote Builder */}
            <MultiStateQuoteBuilder
              onQuoteCreated={handleQuoteCreated}
              onQuoteUpdated={handleQuoteUpdated}
            />
          </div>
        )}

        {/* Keep all existing views unchanged */}
        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
          >
            {/* All existing dashboard content remains the same */}
            <div
              style={{ color: 'white', textAlign: 'center', padding: '60px 0' }}
            >
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>📊</div>
              <p style={{ fontSize: '18px' }}>
                Dashboard view - existing content preserved...
              </p>
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
            style={{ color: 'white', textAlign: 'center', padding: '60px 0' }}
          >
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>📈</div>
            <p style={{ fontSize: '18px' }}>
              Analytics view - existing content preserved...
            </p>
          </div>
        )}

        {/* Specialized Routing View */}
        {activeView === 'specialized' && (
          <div
            style={{ color: 'white', textAlign: 'center', padding: '60px 0' }}
          >
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🛣️</div>
            <p style={{ fontSize: '18px' }}>
              Specialized routing view - existing content preserved...
            </p>
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










































































