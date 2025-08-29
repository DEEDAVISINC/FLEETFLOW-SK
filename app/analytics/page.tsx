'use client';

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Suspense, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Load only essential components with lazy loading
const CompetitorIntelligenceWidget = dynamic(
  () => import('../components/CompetitorIntelligenceWidget'),
  {
    loading: () => (
      <div style={{ color: 'white', textAlign: 'center', padding: '20px' }}>
        Loading Competitor Intelligence...
      </div>
    ),
    ssr: false,
  }
);

const CustomerRetentionWidget = dynamic(
  () => import('../components/CustomerRetentionWidget'),
  {
    loading: () => (
      <div style={{ color: 'white', textAlign: 'center', padding: '20px' }}>
        Loading Customer Retention...
      </div>
    ),
    ssr: false,
  }
);

interface AnalyticsData {
  revenue: number[];
  loads: number[];
  fuelCosts: number[];
  driverPerformance: {
    name: string;
    score: number;
    loads: number;
    onTime: number;
  }[];
  vehicleUtilization: {
    vehicle: string;
    utilization: number;
    revenue: number;
  }[];
  routeEfficiency: { route: string; profit: number; frequency: number }[];
}

export default function OptimizedAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<
    'week' | 'month' | 'quarter' | 'year'
  >('month');

  // Lightweight analytics data (no heavy calculations)
  const analyticsData: AnalyticsData = {
    revenue: [65000, 72000, 68000, 81000, 75000, 89000],
    loads: [156, 178, 162, 201, 189, 223],
    fuelCosts: [12000, 13500, 12800, 15200, 14100, 16800],
    driverPerformance: [
      { name: 'John Smith', score: 95, loads: 28, onTime: 96 },
      { name: 'Sarah Johnson', score: 92, loads: 25, onTime: 94 },
      { name: 'Mike Wilson', score: 88, loads: 22, onTime: 89 },
    ],
    vehicleUtilization: [
      { vehicle: 'Truck-001', utilization: 87, revenue: 15200 },
      { vehicle: 'Truck-002', utilization: 82, revenue: 14800 },
      { vehicle: 'Truck-003', utilization: 91, revenue: 16100 },
    ],
    routeEfficiency: [
      { route: 'Atlanta → Miami', profit: 2450, frequency: 12 },
      { route: 'Chicago → Houston', profit: 2180, frequency: 8 },
      { route: 'Dallas → Phoenix', profit: 1950, frequency: 6 },
    ],
  };

  // Chart configurations (simplified)
  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: analyticsData.revenue,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
      {
        label: 'Fuel Costs ($)',
        data: analyticsData.fuelCosts,
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2,
      },
    ],
  };

  const utilizationChartData = {
    labels: analyticsData.vehicleUtilization.map((v) => v.vehicle),
    datasets: [
      {
        data: analyticsData.vehicleUtilization.map((v) => v.utilization),
        backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'white',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'white',
        },
      },
    },
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%)',
        padding: '20px',
        color: 'white',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <h1
            style={{
              color: 'white',
              fontSize: '28px',
              fontWeight: 'bold',
              margin: 0,
            }}
          >
            📊 Analytics Dashboard
          </h1>
        </div>

        {/* Time Period Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['week', 'month', 'quarter', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              style={{
                background:
                  selectedPeriod === period
                    ? 'rgba(255, 255, 255, 0.3)'
                    : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px',
                textTransform: 'capitalize',
              }}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        {[
          {
            label: 'Total Revenue',
            value: `$${analyticsData.revenue.reduce((a, b) => a + b, 0).toLocaleString()}`,
            icon: '💰',
            color: '#10b981',
          },
          {
            label: 'Total Loads',
            value: analyticsData.loads
              .reduce((a, b) => a + b, 0)
              .toLocaleString(),
            icon: '🚛',
            color: '#3b82f6',
          },
          {
            label: 'Avg Revenue/Load',
            value: `$${Math.round(
              analyticsData.revenue.reduce((a, b) => a + b, 0) /
                analyticsData.loads.reduce((a, b) => a + b, 0)
            )}`,
            icon: '📈',
            color: '#8b5cf6',
          },
          {
            label: 'Profit Margin',
            value: '28.3%',
            icon: '🎯',
            color: '#f59e0b',
          },
        ].map((metric, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>
              {metric.icon}
            </div>
            <div
              style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '4px',
              }}
            >
              {metric.value}
            </div>
            <div
              style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}
            >
              {metric.label}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        {/* Revenue vs Fuel Costs */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <h3
            style={{
              margin: '0 0 20px 0',
              fontSize: '18px',
              fontWeight: '600',
            }}
          >
            📊 Revenue vs Fuel Costs
          </h3>
          <div style={{ height: '300px' }}>
            <Bar data={revenueChartData} options={chartOptions} />
          </div>
        </div>

        {/* Vehicle Utilization */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <h3
            style={{
              margin: '0 0 20px 0',
              fontSize: '18px',
              fontWeight: '600',
            }}
          >
            🚛 Vehicle Utilization
          </h3>
          <div style={{ height: '300px' }}>
            <Doughnut data={utilizationChartData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Data Tables */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        {/* Driver Performance */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <h3
            style={{
              margin: '0 0 20px 0',
              fontSize: '18px',
              fontWeight: '600',
            }}
          >
            👥 Driver Performance
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '8px',
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    Driver
                  </th>
                  <th
                    style={{
                      textAlign: 'center',
                      padding: '8px',
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    Score
                  </th>
                  <th
                    style={{
                      textAlign: 'center',
                      padding: '8px',
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    Loads
                  </th>
                  <th
                    style={{
                      textAlign: 'center',
                      padding: '8px',
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    On Time %
                  </th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.driverPerformance.map((driver, index) => (
                  <tr key={index}>
                    <td style={{ padding: '8px', fontSize: '14px' }}>
                      {driver.name}
                    </td>
                    <td
                      style={{
                        padding: '8px',
                        textAlign: 'center',
                        fontSize: '14px',
                      }}
                    >
                      {driver.score}
                    </td>
                    <td
                      style={{
                        padding: '8px',
                        textAlign: 'center',
                        fontSize: '14px',
                      }}
                    >
                      {driver.loads}
                    </td>
                    <td
                      style={{
                        padding: '8px',
                        textAlign: 'center',
                        fontSize: '14px',
                      }}
                    >
                      {driver.onTime}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Route Efficiency */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <h3
            style={{
              margin: '0 0 20px 0',
              fontSize: '18px',
              fontWeight: '600',
            }}
          >
            🗺️ Top Routes by Profit
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '8px',
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    Route
                  </th>
                  <th
                    style={{
                      textAlign: 'center',
                      padding: '8px',
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    Profit
                  </th>
                  <th
                    style={{
                      textAlign: 'center',
                      padding: '8px',
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    Frequency
                  </th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.routeEfficiency.map((route, index) => (
                  <tr key={index}>
                    <td style={{ padding: '8px', fontSize: '14px' }}>
                      {route.route}
                    </td>
                    <td
                      style={{
                        padding: '8px',
                        textAlign: 'center',
                        fontSize: '14px',
                      }}
                    >
                      ${route.profit}
                    </td>
                    <td
                      style={{
                        padding: '8px',
                        textAlign: 'center',
                        fontSize: '14px',
                      }}
                    >
                      {route.frequency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Essential Widgets - Only 2 to prevent crashes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              padding: '12px 20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h3
              style={{
                color: 'white',
                margin: 0,
                fontSize: '18px',
                fontWeight: '600',
              }}
            >
              🔍 Competitor Intelligence
            </h3>
          </div>
          <div style={{ padding: '20px' }}>
            <Suspense
              fallback={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '200px',
                    color: 'white',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>
                      🔄
                    </div>
                    <div>Loading Competitor Intelligence...</div>
                  </div>
                </div>
              }
            >
              <CompetitorIntelligenceWidget />
            </Suspense>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.2)',
              padding: '12px 20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h3
              style={{
                color: 'white',
                margin: 0,
                fontSize: '18px',
                fontWeight: '600',
              }}
            >
              🎯 Customer Retention Analysis
            </h3>
          </div>
          <div style={{ padding: '20px' }}>
            <Suspense
              fallback={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '200px',
                    color: 'white',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>
                      🔄
                    </div>
                    <div>Loading Customer Retention Analysis...</div>
                  </div>
                </div>
              }
            >
              <CustomerRetentionWidget />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Performance Note */}
      <div
        style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          marginTop: '30px',
          textAlign: 'center',
        }}
      >
        <div
          style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}
        >
          ⚡ High-Performance Analytics
        </div>
        <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
          Enterprise-grade analytics dashboard optimized for stability and performance.
          Features comprehensive reporting with intelligent component loading.
        </div>
      </div>
    </div>
  );
}
