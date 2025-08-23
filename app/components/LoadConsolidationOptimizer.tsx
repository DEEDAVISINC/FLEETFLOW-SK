'use client';

import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  TrendingUp,
  Truck,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import LoadConsolidationService, {
  DriverAvailabilityWindow,
  LTLLoad,
  TimeOptimizedRoute,
  TruckCapacity,
} from '../services/LoadConsolidationService';

interface LoadConsolidationOptimizerProps {
  driverId: string;
  driverName: string;
  currentLoad?: LTLLoad;
  availableLoads: LTLLoad[];
  driverAvailability: DriverAvailabilityWindow;
  onRouteOptimized: (route: TimeOptimizedRoute) => void;
}

export default function LoadConsolidationOptimizer({
  driverId,
  driverName,
  currentLoad,
  availableLoads,
  driverAvailability,
  onRouteOptimized,
}: LoadConsolidationOptimizerProps) {
  const [consolidationService] = useState(new LoadConsolidationService());
  const [optimizedRoutes, setOptimizedRoutes] = useState<TimeOptimizedRoute[]>(
    []
  );
  const [selectedRoute, setSelectedRoute] = useState<TimeOptimizedRoute | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'opportunities' | 'long-term'>(
    'opportunities'
  );

  // Standard 53' dry van capacity
  const truckCapacity: TruckCapacity = {
    maxWeight: 80000,
    maxLength: 53,
    maxWidth: 8.5,
    maxHeight: 13.5,
    truckWeight: 34000,
    availableWeight: 46000,
    availableLength: 53,
    availableWidth: 8.5,
    availableHeight: 13.5,
  };

  useEffect(() => {
    if (currentLoad) {
      findConsolidationOpportunities();
    }
  }, [currentLoad, availableLoads]);

  const findConsolidationOpportunities = async () => {
    if (!currentLoad) return;

    setLoading(true);
    try {
      const opportunities: TimeOptimizedRoute[] = [];

      // Analyze each available load for consolidation potential
      for (const load of availableLoads) {
        if (load.id === currentLoad.id) continue;

        const route = consolidationService.analyzeConsolidationOpportunity(
          currentLoad,
          load,
          driverAvailability,
          truckCapacity
        );

        if (route.feasible && route.optimizationScore > 50) {
          opportunities.push(route);
        }
      }

      // Sort by optimization score
      opportunities.sort((a, b) => b.optimizationScore - a.optimizationScore);
      setOptimizedRoutes(opportunities);
    } catch (error) {
      console.error('Error finding consolidation opportunities:', error);
    }
    setLoading(false);
  };

  const generateLongTermSchedule = async () => {
    setLoading(true);
    try {
      const longTermRoutes =
        await consolidationService.generateLongTermSchedule(
          driverId,
          driverAvailability,
          availableLoads,
          truckCapacity,
          30 // 30 days ahead
        );

      setOptimizedRoutes(longTermRoutes);
    } catch (error) {
      console.error('Error generating long-term schedule:', error);
    }
    setLoading(false);
  };

  const handleRouteSelection = (route: TimeOptimizedRoute) => {
    setSelectedRoute(route);
    onRouteOptimized(route);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${Math.round(value)}%`;
  };

  const getOptimizationScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const renderCurrentLoadStatus = () => {
    if (!currentLoad) return null;

    const weightUtilization =
      (currentLoad.weight / truckCapacity.availableWeight) * 100;
    const remainingWeight = truckCapacity.availableWeight - currentLoad.weight;
    const remainingPallets = 26 - currentLoad.palletCount;

    return (
      <div
        style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
        }}
      >
        <h4
          style={{
            margin: '0 0 12px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#1f2937',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Truck size={20} style={{ color: '#3b82f6' }} />
          Current Load: {currentLoad.origin} → {currentLoad.destination}
        </h4>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{ fontSize: '18px', fontWeight: '600', color: '#3b82f6' }}
            >
              {currentLoad.weight.toLocaleString()} lbs
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Weight ({formatPercentage(weightUtilization)} used)
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div
              style={{ fontSize: '18px', fontWeight: '600', color: '#10b981' }}
            >
              {remainingWeight.toLocaleString()} lbs
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Remaining Capacity
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div
              style={{ fontSize: '18px', fontWeight: '600', color: '#f59e0b' }}
            >
              {remainingPallets}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Pallet Spaces Left
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div
              style={{ fontSize: '18px', fontWeight: '600', color: '#8b5cf6' }}
            >
              {formatCurrency(currentLoad.revenue)}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Current Revenue
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderConsolidationOpportunity = (
    route: TimeOptimizedRoute,
    index: number
  ) => {
    const additionalLoad = route.loads.find(
      (load) => load.id !== currentLoad?.id
    );
    if (!additionalLoad) return null;

    const additionalRevenue = additionalLoad.revenue;
    const netProfit =
      route.profitability.netProfit - (currentLoad?.revenue || 0);

    return (
      <div
        key={route.driverId + index}
        onClick={() => handleRouteSelection(route)}
        style={{
          background: selectedRoute?.loads.some(
            (l) => l.id === additionalLoad.id
          )
            ? 'rgba(16, 185, 129, 0.1)'
            : 'rgba(255, 255, 255, 0.95)',
          border: selectedRoute?.loads.some((l) => l.id === additionalLoad.id)
            ? '2px solid #10b981'
            : '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          padding: '16px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          marginBottom: '12px',
        }}
        onMouseEnter={(e) => {
          if (!selectedRoute?.loads.some((l) => l.id === additionalLoad.id)) {
            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (!selectedRoute?.loads.some((l) => l.id === additionalLoad.id)) {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }
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
          <div>
            <div
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '4px',
              }}
            >
              📍 {additionalLoad.origin} → {additionalLoad.destination}
            </div>
            <div
              style={{
                fontSize: '14px',
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span>📦 {additionalLoad.weight.toLocaleString()} lbs</span>
              <span>🚛 {additionalLoad.palletCount} pallets</span>
              <span>💰 {formatCurrency(additionalLoad.revenue)}</span>
            </div>
          </div>

          <div
            style={{
              background: `linear-gradient(135deg, ${getOptimizationScoreColor(route.optimizationScore)}, ${getOptimizationScoreColor(route.optimizationScore)}dd)`,
              color: 'white',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
            }}
          >
            {route.optimizationScore}/100
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            marginBottom: '12px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{ fontSize: '14px', fontWeight: '600', color: '#10b981' }}
            >
              +{formatCurrency(netProfit)}
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280' }}>
              Additional Profit
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div
              style={{ fontSize: '14px', fontWeight: '600', color: '#3b82f6' }}
            >
              {formatPercentage(route.capacityUtilization.weight)}
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280' }}>
              Total Weight Usage
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div
              style={{ fontSize: '14px', fontWeight: '600', color: '#f59e0b' }}
            >
              +{Math.round(route.totalMiles - (currentLoad ? 350 : 0))} mi
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280' }}>
              Extra Miles
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div
              style={{ fontSize: '14px', fontWeight: '600', color: '#8b5cf6' }}
            >
              ${route.revenuePerMile.toFixed(2)}
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280' }}>
              Revenue/Mile
            </div>
          </div>
        </div>

        {/* Route Sequence */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '8px',
            padding: '8px',
            fontSize: '12px',
            color: '#6b7280',
          }}
        >
          <strong>Route:</strong>{' '}
          {route.routeSequence.map((stop, i) => (
            <span key={i}>
              {i > 0 && ' → '}
              {stop.type === 'pickup' ? '📦' : '🏁'}{' '}
              {stop.location.split(',')[0]}
            </span>
          ))}
        </div>

        {/* Warnings */}
        {route.hosCompliance.warnings.length > 0 && (
          <div
            style={{
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              color: '#f59e0b',
            }}
          >
            <AlertTriangle size={14} />
            {route.hosCompliance.warnings[0]}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <TrendingUp size={24} style={{ color: '#3b82f6' }} />
          Load Consolidation Optimizer
        </h3>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setViewMode('opportunities')}
            style={{
              padding: '6px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              background: viewMode === 'opportunities' ? '#3b82f6' : 'white',
              color: viewMode === 'opportunities' ? 'white' : '#374151',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Current Opportunities
          </button>
          <button
            onClick={() => {
              setViewMode('long-term');
              generateLongTermSchedule();
            }}
            style={{
              padding: '6px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              background: viewMode === 'long-term' ? '#3b82f6' : 'white',
              color: viewMode === 'long-term' ? 'white' : '#374151',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            30-Day Schedule
          </button>
        </div>
      </div>

      {/* Current Load Status */}
      {viewMode === 'opportunities' && renderCurrentLoadStatus()}

      {/* Loading State */}
      {loading && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            color: '#6b7280',
          }}
        >
          <Clock
            size={20}
            style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }}
          />
          {viewMode === 'opportunities'
            ? 'Finding consolidation opportunities...'
            : 'Generating long-term schedule...'}
        </div>
      )}

      {/* Consolidation Opportunities */}
      {!loading && viewMode === 'opportunities' && (
        <div>
          {optimizedRoutes.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px',
                color: '#6b7280',
              }}
            >
              <Package
                size={48}
                style={{ marginBottom: '16px', opacity: 0.5 }}
              />
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  marginBottom: '8px',
                }}
              >
                No consolidation opportunities found
              </div>
              <div style={{ fontSize: '14px' }}>
                Current load utilizes available capacity efficiently, or no
                compatible loads available.
              </div>
            </div>
          ) : (
            <div>
              <h4
                style={{
                  margin: '0 0 16px 0',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#374151',
                }}
              >
                💡 Available Consolidation Opportunities (
                {optimizedRoutes.length})
              </h4>

              {optimizedRoutes.map((route, index) =>
                renderConsolidationOpportunity(route, index)
              )}
            </div>
          )}
        </div>
      )}

      {/* Long-term Schedule */}
      {!loading && viewMode === 'long-term' && (
        <div>
          <h4
            style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: '#374151',
            }}
          >
            📅 Optimized 30-Day Schedule ({optimizedRoutes.length} routes)
          </h4>

          {optimizedRoutes.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px',
                color: '#6b7280',
              }}
            >
              No optimized routes available for the selected period.
            </div>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {optimizedRoutes.map((route, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '8px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1f2937',
                      }}
                    >
                      {new Date(
                        route.scheduleWindow.start
                      ).toLocaleDateString()}{' '}
                      - {route.loads.length} loads
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#10b981',
                      }}
                    >
                      {formatCurrency(route.totalRevenue)}
                    </div>
                  </div>

                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {route.loads
                      .map((load) => `${load.origin} → ${load.destination}`)
                      .join(' | ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selected Route Summary */}
      {selectedRoute && (
        <div
          style={{
            marginTop: '20px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
            }}
          >
            <CheckCircle size={20} style={{ color: '#10b981' }} />
            <span
              style={{ fontSize: '16px', fontWeight: '600', color: '#065f46' }}
            >
              Route Selected for Optimization
            </span>
          </div>

          <div style={{ fontSize: '14px', color: '#065f46' }}>
            Total Revenue: {formatCurrency(selectedRoute.totalRevenue)} | Net
            Profit: {formatCurrency(selectedRoute.profitability.netProfit)} |
            Optimization Score: {selectedRoute.optimizationScore}/100
          </div>
        </div>
      )}
    </div>
  );
}







