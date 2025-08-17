'use client';

import {
  ArcElement,
  Bar,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Doughnut,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useEffect, useState } from 'react';
import {
  CostSavingsAnalysis,
  DriverEfficiencyMetrics,
  FleetPerformanceAnalytics,
  openELDAnalyticsService,
} from '../services/OpenELDAnalyticsService';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function OpenELDAnalyticsWidget() {
  const [fleetPerformance, setFleetPerformance] =
    useState<FleetPerformanceAnalytics | null>(null);
  const [costSavings, setCostSavings] = useState<CostSavingsAnalysis | null>(
    null
  );
  const [driverMetrics, setDriverMetrics] = useState<DriverEfficiencyMetrics[]>(
    []
  );
  const [realtimeStatus, setRealtimeStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<
    'overview' | 'drivers' | 'costs' | 'realtime'
  >('overview');

  useEffect(() => {
    loadAnalyticsData();

    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      loadRealtimeData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const [fleetData, costData, realtimeData] = await Promise.all([
        openELDAnalyticsService.calculateFleetPerformance(),
        openELDAnalyticsService.analyzeCostSavings(),
        openELDAnalyticsService.getRealtimeFleetStatus(),
      ]);

      setFleetPerformance(fleetData);
      setCostSavings(costData);
      setRealtimeStatus(realtimeData);

      // Load individual driver metrics for top performers
      if (fleetData.topPerformers.length > 0) {
        setDriverMetrics(fleetData.topPerformers);
      }
    } catch (error) {
      console.error('Error loading OpenELD analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRealtimeData = async () => {
    try {
      const realtimeData =
        await openELDAnalyticsService.getRealtimeFleetStatus();
      setRealtimeStatus(realtimeData);
    } catch (error) {
      console.error('Error loading real-time data:', error);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '32px',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚛</div>
        <div style={{ fontSize: '18px', fontWeight: '600' }}>
          Loading OpenELD Analytics...
        </div>
        <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '8px' }}>
          Analyzing driver performance and fleet efficiency
        </div>
      </div>
    );
  }

  // Chart configurations
  const utilizationChartData = {
    labels: driverMetrics.map((d) => d.driverName),
    datasets: [
      {
        label: 'Utilization Rate (%)',
        data: driverMetrics.map((d) => d.utilizationRate),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
      {
        label: 'Compliance Score',
        data: driverMetrics.map((d) => d.complianceScore),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
      },
    ],
  };

  const fuelEfficiencyData = {
    labels: driverMetrics.map((d) => d.driverName),
    datasets: [
      {
        label: 'Fuel Efficiency (MPG)',
        data: driverMetrics.map((d) => d.estimatedFuelEfficiency),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const costSavingsData = costSavings
    ? {
        labels: [
          'Fuel Optimization',
          'Time Optimization',
          'Compliance',
          'Route Optimization',
        ],
        datasets: [
          {
            label: 'Potential Monthly Savings ($)',
            data: [
              costSavings.potentialSavings.fuelOptimization,
              costSavings.potentialSavings.timeOptimization,
              costSavings.potentialSavings.complianceImprovement,
              costSavings.potentialSavings.routeOptimization,
            ],
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(139, 92, 246, 0.8)',
            ],
            borderWidth: 2,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: 'white' },
      },
    },
    scales: {
      x: { ticks: { color: 'white' } },
      y: { ticks: { color: 'white' } },
    },
  };

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '32px',
        marginBottom: '32px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              padding: '12px',
              background: 'rgba(59, 130, 246, 0.2)',
              borderRadius: '12px',
              fontSize: '24px',
            }}
          >
            🚛
          </div>
          <div>
            <h2
              style={{
                color: 'white',
                margin: 0,
                fontSize: '24px',
                fontWeight: '700',
              }}
            >
              OpenELD Analytics
            </h2>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
                fontSize: '14px',
              }}
            >
              Real-time driver performance & fleet efficiency insights
            </p>
          </div>
        </div>

        {/* Real-time Status */}
        {realtimeStatus && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '12px 16px',
              borderRadius: '8px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor:
                  realtimeStatus.systemHealth === 'healthy'
                    ? '#10b981'
                    : realtimeStatus.systemHealth === 'warning'
                      ? '#f59e0b'
                      : '#ef4444',
                animation: 'pulse 2s infinite',
              }}
            ></div>
            <span
              style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}
            >
              {realtimeStatus.onlineDrivers} Online •{' '}
              {realtimeStatus.activeDevices} Active
            </span>
            {realtimeStatus.complianceAlerts > 0 && (
              <span
                style={{
                  background: '#ef4444',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              >
                {realtimeStatus.complianceAlerts} Alerts
              </span>
            )}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          paddingBottom: '16px',
        }}
      >
        {[
          { id: 'overview', label: '📊 Fleet Overview', icon: '📊' },
          { id: 'drivers', label: '👨‍💼 Driver Performance', icon: '👨‍💼' },
          { id: 'costs', label: '💰 Cost Savings', icon: '💰' },
          { id: 'realtime', label: '🔴 Real-time Status', icon: '🔴' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id as any)}
            style={{
              background:
                activeView === tab.id
                  ? 'rgba(59, 130, 246, 0.3)'
                  : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: 'none',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Fleet Overview */}
      {activeView === 'overview' && fleetPerformance && (
        <div>
          {/* KPI Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <div
                style={{ fontSize: '28px', fontWeight: '700', color: 'white' }}
              >
                {fleetPerformance.averageUtilization}%
              </div>
              <div
                style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}
              >
                Fleet Utilization
              </div>
              <div
                style={{
                  color:
                    fleetPerformance.utilizationTrend > 0
                      ? '#10b981'
                      : '#ef4444',
                  fontSize: '12px',
                  marginTop: '4px',
                }}
              >
                {fleetPerformance.utilizationTrend > 0 ? '↗️' : '↘️'}
                {Math.abs(fleetPerformance.utilizationTrend)}% this week
              </div>
            </div>

            <div
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <div
                style={{ fontSize: '28px', fontWeight: '700', color: 'white' }}
              >
                {fleetPerformance.totalComplianceScore}
              </div>
              <div
                style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}
              >
                Compliance Score
              </div>
              <div
                style={{
                  color:
                    fleetPerformance.complianceTrend > 0
                      ? '#10b981'
                      : '#ef4444',
                  fontSize: '12px',
                  marginTop: '4px',
                }}
              >
                {fleetPerformance.complianceTrend > 0 ? '↗️' : '↘️'}
                {Math.abs(fleetPerformance.complianceTrend)} pts this week
              </div>
            </div>

            <div
              style={{
                background: 'rgba(245, 158, 11, 0.2)',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <div
                style={{ fontSize: '28px', fontWeight: '700', color: 'white' }}
              >
                ${fleetPerformance.totalFuelSavingsOpportunity.toLocaleString()}
              </div>
              <div
                style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}
              >
                Monthly Savings Opportunity
              </div>
              <div
                style={{ color: '#10b981', fontSize: '12px', marginTop: '4px' }}
              >
                💡 Fuel efficiency improvements
              </div>
            </div>

            <div
              style={{
                background: 'rgba(139, 92, 246, 0.2)',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <div
                style={{ fontSize: '28px', fontWeight: '700', color: 'white' }}
              >
                {fleetPerformance.totalDrivingHours.toLocaleString()}
              </div>
              <div
                style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}
              >
                Total Driving Hours
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '12px',
                  marginTop: '4px',
                }}
              >
                {fleetPerformance.activeDrivers} active drivers
              </div>
            </div>
          </div>

          {/* Driver Performance Chart */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '24px',
              borderRadius: '12px',
              marginBottom: '24px',
            }}
          >
            <h3 style={{ color: 'white', margin: '0 0 16px 0' }}>
              Driver Performance Comparison
            </h3>
            <Bar data={utilizationChartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Driver Performance View */}
      {activeView === 'drivers' && (
        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {/* Driver Performance Table */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '24px',
                borderRadius: '12px',
              }}
            >
              <h3 style={{ color: 'white', margin: '0 0 16px 0' }}>
                Top Performers
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th
                        style={{
                          color: 'white',
                          padding: '12px',
                          textAlign: 'left',
                          borderBottom: '1px solid rgba(255,255,255,0.2)',
                        }}
                      >
                        Driver
                      </th>
                      <th
                        style={{
                          color: 'white',
                          padding: '12px',
                          textAlign: 'center',
                          borderBottom: '1px solid rgba(255,255,255,0.2)',
                        }}
                      >
                        Utilization
                      </th>
                      <th
                        style={{
                          color: 'white',
                          padding: '12px',
                          textAlign: 'center',
                          borderBottom: '1px solid rgba(255,255,255,0.2)',
                        }}
                      >
                        Compliance
                      </th>
                      <th
                        style={{
                          color: 'white',
                          padding: '12px',
                          textAlign: 'center',
                          borderBottom: '1px solid rgba(255,255,255,0.2)',
                        }}
                      >
                        Fuel MPG
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {driverMetrics.map((driver, index) => (
                      <tr key={driver.driverId}>
                        <td
                          style={{
                            color: 'white',
                            padding: '12px',
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                          }}
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
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: `linear-gradient(135deg, ${['#3b82f6', '#10b981', '#f59e0b'][index % 3]}, ${['#1d4ed8', '#059669', '#d97706'][index % 3]})`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: '600',
                              }}
                            >
                              {driver.driverName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </div>
                            <span style={{ fontSize: '14px' }}>
                              {driver.driverName}
                            </span>
                          </div>
                        </td>
                        <td
                          style={{
                            color: 'white',
                            padding: '12px',
                            textAlign: 'center',
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                          }}
                        >
                          <span
                            style={{
                              background:
                                driver.utilizationRate > 80
                                  ? 'rgba(16, 185, 129, 0.2)'
                                  : 'rgba(245, 158, 11, 0.2)',
                              color:
                                driver.utilizationRate > 80
                                  ? '#10b981'
                                  : '#f59e0b',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '600',
                            }}
                          >
                            {driver.utilizationRate}%
                          </span>
                        </td>
                        <td
                          style={{
                            color: 'white',
                            padding: '12px',
                            textAlign: 'center',
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                          }}
                        >
                          <span
                            style={{
                              background:
                                driver.complianceScore > 90
                                  ? 'rgba(16, 185, 129, 0.2)'
                                  : 'rgba(239, 68, 68, 0.2)',
                              color:
                                driver.complianceScore > 90
                                  ? '#10b981'
                                  : '#ef4444',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '600',
                            }}
                          >
                            {driver.complianceScore}
                          </span>
                        </td>
                        <td
                          style={{
                            color: 'white',
                            padding: '12px',
                            textAlign: 'center',
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                          }}
                        >
                          {driver.estimatedFuelEfficiency} MPG
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Fuel Efficiency Chart */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '24px',
                borderRadius: '12px',
              }}
            >
              <h3 style={{ color: 'white', margin: '0 0 16px 0' }}>
                Fuel Efficiency Distribution
              </h3>
              <Doughnut
                data={fuelEfficiencyData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      position: 'bottom',
                      labels: { color: 'white', padding: 20 },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Cost Savings View */}
      {activeView === 'costs' && costSavings && (
        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '24px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '24px',
                borderRadius: '12px',
              }}
            >
              <h3 style={{ color: 'white', margin: '0 0 16px 0' }}>
                Potential Monthly Savings
              </h3>
              <Bar data={costSavingsData} options={chartOptions} />
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '24px',
                borderRadius: '12px',
              }}
            >
              <h3 style={{ color: 'white', margin: '0 0 16px 0' }}>
                Recommendations
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {costSavings.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: '16px',
                      borderRadius: '8px',
                      borderLeft: `4px solid ${rec.priority === 'high' ? '#ef4444' : rec.priority === 'medium' ? '#f59e0b' : '#10b981'}`,
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
                      <span
                        style={{
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '14px',
                        }}
                      >
                        {rec.category}
                      </span>
                      <span
                        style={{
                          background:
                            rec.priority === 'high'
                              ? 'rgba(239, 68, 68, 0.2)'
                              : rec.priority === 'medium'
                                ? 'rgba(245, 158, 11, 0.2)'
                                : 'rgba(16, 185, 129, 0.2)',
                          color:
                            rec.priority === 'high'
                              ? '#ef4444'
                              : rec.priority === 'medium'
                                ? '#f59e0b'
                                : '#10b981',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                        }}
                      >
                        {rec.priority}
                      </span>
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '12px',
                        margin: '0 0 8px 0',
                      }}
                    >
                      {rec.description}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                      }}
                    >
                      <span style={{ color: '#10b981' }}>
                        💰 ${rec.estimatedSavings.toLocaleString()} savings
                      </span>
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        ROI: {(rec.roi * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Status View */}
      {activeView === 'realtime' && realtimeStatus && (
        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>👨‍💼</div>
              <div
                style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}
              >
                {realtimeStatus.onlineDrivers}
              </div>
              <div
                style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}
              >
                Drivers Online
              </div>
            </div>

            <div
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>📱</div>
              <div
                style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}
              >
                {realtimeStatus.activeDevices}
              </div>
              <div
                style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}
              >
                Active Devices
              </div>
            </div>

            <div
              style={{
                background:
                  realtimeStatus.complianceAlerts > 0
                    ? 'rgba(239, 68, 68, 0.2)'
                    : 'rgba(16, 185, 129, 0.2)',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>
                {realtimeStatus.complianceAlerts > 0 ? '⚠️' : '✅'}
              </div>
              <div
                style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}
              >
                {realtimeStatus.complianceAlerts}
              </div>
              <div
                style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}
              >
                Compliance Alerts
              </div>
            </div>

            <div
              style={{
                background:
                  realtimeStatus.systemHealth === 'healthy'
                    ? 'rgba(16, 185, 129, 0.2)'
                    : realtimeStatus.systemHealth === 'warning'
                      ? 'rgba(245, 158, 11, 0.2)'
                      : 'rgba(239, 68, 68, 0.2)',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>
                {realtimeStatus.systemHealth === 'healthy'
                  ? '💚'
                  : realtimeStatus.systemHealth === 'warning'
                    ? '💛'
                    : '❤️'}
              </div>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: 'white',
                  textTransform: 'capitalize',
                }}
              >
                {realtimeStatus.systemHealth}
              </div>
              <div
                style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}
              >
                System Health
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '24px',
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            <h3 style={{ color: 'white', margin: '0 0 16px 0' }}>
              OpenELD System Status
            </h3>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                margin: '0',
              }}
            >
              All OpenELD devices are connected and transmitting data in
              real-time. Driver hours and compliance monitoring is active across
              your fleet.
            </p>
            <div
              style={{
                marginTop: '16px',
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              <span>📊 Real-time Analytics</span>
              <span>🔒 FMCSA Compliant</span>
              <span>☁️ Cloud Synced</span>
              <span>📱 Mobile Ready</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
