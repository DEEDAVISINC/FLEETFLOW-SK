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
import Link from 'next/link';
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';

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

interface FleetAnalyticsData {
  vehicleUtilization: {
    vehicle: string;
    utilization: number;
    revenue: number;
    miles: number;
  }[];
  maintenanceCosts: {
    month: string;
    preventive: number;
    reactive: number;
    total: number;
  }[];
  fuelEfficiency: {
    vehicle: string;
    mpg: number;
    fuelCost: number;
    trend: string;
  }[];
  driverPerformance: {
    name: string;
    score: number;
    loads: number;
    onTime: number;
    safety: number;
  }[];
  routeOptimization: {
    route: string;
    efficiency: number;
    profit: number;
    frequency: number;
  }[];
}

export default function FleetAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [lastUpdated] = useState(new Date());
  const [fleetData] = useState<FleetAnalyticsData>({
    vehicleUtilization: [
      { vehicle: 'Truck-045', utilization: 87, revenue: 48500, miles: 12500 },
      { vehicle: 'Van-023', utilization: 72, revenue: 28900, miles: 8900 },
      { vehicle: 'Truck-067', utilization: 91, revenue: 52100, miles: 13800 },
      { vehicle: 'Truck-089', utilization: 69, revenue: 35600, miles: 9200 },
      { vehicle: 'Van-156', utilization: 84, revenue: 42300, miles: 11100 },
    ],
    maintenanceCosts: [
      { month: 'Jan', preventive: 8500, reactive: 3200, total: 11700 },
      { month: 'Feb', preventive: 7800, reactive: 4100, total: 11900 },
      { month: 'Mar', preventive: 9200, reactive: 2800, total: 12000 },
      { month: 'Apr', preventive: 8900, reactive: 3600, total: 12500 },
      { month: 'May', preventive: 9500, reactive: 2100, total: 11600 },
      { month: 'Jun', preventive: 8700, reactive: 3900, total: 12600 },
    ],
    fuelEfficiency: [
      { vehicle: 'Truck-045', mpg: 6.8, fuelCost: 2850, trend: 'improving' },
      { vehicle: 'Van-023', mpg: 12.4, fuelCost: 1650, trend: 'stable' },
      { vehicle: 'Truck-067', mpg: 7.1, fuelCost: 2920, trend: 'improving' },
      { vehicle: 'Truck-089', mpg: 6.2, fuelCost: 3100, trend: 'declining' },
      { vehicle: 'Van-156', mpg: 11.8, fuelCost: 1780, trend: 'stable' },
    ],
    driverPerformance: [
      { name: 'John Smith', score: 94, loads: 28, onTime: 96, safety: 98 },
      { name: 'Sarah Johnson', score: 91, loads: 24, onTime: 94, safety: 95 },
      { name: 'Mike Davis', score: 87, loads: 31, onTime: 89, safety: 92 },
      { name: 'Lisa Chen', score: 96, loads: 26, onTime: 98, safety: 99 },
      { name: 'Tom Wilson', score: 83, loads: 29, onTime: 85, safety: 88 },
    ],
    routeOptimization: [
      { route: 'Atlanta-Miami', efficiency: 92, profit: 2840, frequency: 12 },
      { route: 'Chicago-Detroit', efficiency: 88, profit: 1950, frequency: 18 },
      { route: 'Dallas-Houston', efficiency: 95, profit: 1680, frequency: 24 },
      { route: 'Phoenix-LA', efficiency: 85, profit: 2200, frequency: 15 },
      { route: 'NYC-Boston', efficiency: 78, profit: 1420, frequency: 20 },
    ],
  });

  // Chart data for Vehicle Utilization
  const utilizationChartData = {
    labels: fleetData.vehicleUtilization.map((v) => v.vehicle),
    datasets: [
      {
        label: 'Utilization %',
        data: fleetData.vehicleUtilization.map((v) => v.utilization),
        backgroundColor: 'rgba(74, 222, 128, 0.8)',
        borderColor: 'rgba(74, 222, 128, 1)',
        borderWidth: 2,
      },
    ],
  };

  // Chart data for Maintenance Costs
  const maintenanceChartData = {
    labels: fleetData.maintenanceCosts.map((m) => m.month),
    datasets: [
      {
        label: 'Preventive Maintenance',
        data: fleetData.maintenanceCosts.map((m) => m.preventive),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
      {
        label: 'Reactive Maintenance',
        data: fleetData.maintenanceCosts.map((m) => m.reactive),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2,
      },
    ],
  };

  // Chart data for Driver Performance
  const driverChartData = {
    labels: fleetData.driverPerformance.map((d) => d.name.split(' ')[0]),
    datasets: [
      {
        label: 'Overall Score',
        data: fleetData.driverPerformance.map((d) => d.score),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'white',
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.8;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `,
        }}
      />

      <div
        style={{
          minHeight: '100vh',
          background:
            'linear-gradient(135deg, #022c22 0%, #032e2a 25%, #044e46 50%, #042f2e 75%, #0a1612 100%)',
          backgroundAttachment: 'fixed',
          paddingTop: '80px',
          position: 'relative',
        }}
      >
        {/* Back Button */}
        <div style={{ padding: '24px' }}>
          <Link href='/vehicles' style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              ← Back to Fleet Management
            </button>
          </Link>
        </div>

        <div
          style={{
            padding: '0 24px 40px 24px',
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '40px',
              marginBottom: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '24px' }}
              >
                <div
                  style={{
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                  }}
                >
                  <span style={{ fontSize: '32px' }}>📊</span>
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
                    Fleet Analytics Dashboard
                  </h1>
                  <p
                    style={{
                      fontSize: '18px',
                      color: 'rgba(255, 255, 255, 0.9)',
                      margin: '0 0 8px 0',
                    }}
                  >
                    Comprehensive fleet performance metrics and operational
                    insights
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '24px',
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
                        Real-time Analytics
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      84.6% Avg Utilization
                    </span>
                    <span
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.6)',
                      }}
                    >
                      Last Updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
              <button
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '14px',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                🔄 Refresh Data
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '8px',
              marginBottom: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            {[
              { id: 'overview', label: '📈 Overview', color: '#14b8a6' }, // Teal - FLEETFLOW color
              {
                id: 'vehicles',
                label: '🚛 Vehicle Utilization',
                color: '#14b8a6',
              }, // Teal - FLEETFLOW color
              {
                id: 'maintenance',
                label: '🔧 Maintenance Analytics',
                color: '#f97316',
              }, // Orange - RESOURCES color
              {
                id: 'drivers',
                label: '👥 Driver Performance',
                color: '#f4a832',
              }, // Yellow - DRIVER MANAGEMENT color
              {
                id: 'routes',
                label: '🗺️ Route Optimization',
                color: '#3b82f6',
              }, // Blue - OPERATIONS color
              { id: 'fuel', label: '⛽ Fuel Efficiency', color: '#22c55e' }, // Green - Performance/Efficiency
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background:
                    activeTab === tab.id
                      ? `linear-gradient(135deg, ${tab.color}, ${tab.color}dd)`
                      : 'transparent',
                  color: 'white',
                  border:
                    activeTab === tab.id ? 'none' : `1px solid ${tab.color}`,
                  padding: '16px 24px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  flex: '1',
                  textAlign: 'center',
                  minWidth: '140px',
                  boxShadow:
                    activeTab === tab.id ? `0 4px 20px ${tab.color}40` : 'none',
                }}
                onMouseOver={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background = `${tab.color}30`;
                    e.currentTarget.style.boxShadow = `0 4px 15px ${tab.color}20`;
                  }
                }}
                onMouseOut={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
                marginBottom: '32px',
              }}
            >
              {/* Fleet Summary Cards */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '32px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 24px 0',
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: '700',
                  }}
                >
                  🚛 Fleet Overview
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: '#4ade80',
                      }}
                    >
                      24
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      Total Vehicles
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: '#22c55e',
                      }}
                    >
                      21
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      Active Fleet
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: '#fbbf24',
                      }}
                    >
                      2
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      In Maintenance
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: '#ef4444',
                      }}
                    >
                      1
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      Out of Service
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '32px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 24px 0',
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: '700',
                  }}
                >
                  📊 Performance Metrics
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '16px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      Average Utilization
                    </span>
                    <span style={{ fontWeight: 'bold', color: '#4ade80' }}>
                      84.6%
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      Fleet Revenue (MTD)
                    </span>
                    <span style={{ fontWeight: 'bold', color: '#22c55e' }}>
                      $207,400
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      Maintenance Costs
                    </span>
                    <span style={{ fontWeight: 'bold', color: '#fbbf24' }}>
                      $12,600
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 0',
                    }}
                  >
                    <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      Average MPG
                    </span>
                    <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>
                      8.9 MPG
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vehicle Utilization Tab */}
          {activeTab === 'vehicles' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '32px',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '32px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 24px 0',
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: '700',
                  }}
                >
                  🚛 Vehicle Utilization
                </h3>
                <Bar data={utilizationChartData} options={chartOptions} />
              </div>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '32px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 24px 0',
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: '700',
                  }}
                >
                  📊 Utilization Details
                </h3>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {fleetData.vehicleUtilization.map((vehicle, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px 0',
                        borderBottom:
                          index < fleetData.vehicleUtilization.length - 1
                            ? '1px solid rgba(255, 255, 255, 0.1)'
                            : 'none',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: '600',
                            color: 'white',
                            fontSize: '16px',
                          }}
                        >
                          {vehicle.vehicle}
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            color: 'rgba(255, 255, 255, 0.7)',
                            marginTop: '4px',
                          }}
                        >
                          {vehicle.miles.toLocaleString()} miles
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            fontWeight: '600',
                            color: '#4ade80',
                            fontSize: '16px',
                          }}
                        >
                          {vehicle.utilization}%
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            color: 'rgba(255, 255, 255, 0.7)',
                            marginTop: '4px',
                          }}
                        >
                          ${vehicle.revenue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Maintenance Analytics Tab */}
          {activeTab === 'maintenance' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '32px',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '32px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 24px 0',
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: '700',
                  }}
                >
                  🔧 Maintenance Cost Analysis
                </h3>
                <Bar data={maintenanceChartData} options={chartOptions} />
              </div>
            </div>
          )}

          {/* Driver Performance Tab */}
          {activeTab === 'drivers' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '32px',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '32px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 24px 0',
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: '700',
                  }}
                >
                  👥 Driver Performance Scores
                </h3>
                <Bar data={driverChartData} options={chartOptions} />
              </div>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '32px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 24px 0',
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: '700',
                  }}
                >
                  📊 Performance Details
                </h3>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {fleetData.driverPerformance.map((driver, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '20px 0',
                        borderBottom:
                          index < fleetData.driverPerformance.length - 1
                            ? '1px solid rgba(255, 255, 255, 0.1)'
                            : 'none',
                      }}
                    >
                      <div
                        style={{
                          fontWeight: '600',
                          color: 'white',
                          marginBottom: '12px',
                          fontSize: '16px',
                        }}
                      >
                        {driver.name}
                      </div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(4, 1fr)',
                          gap: '12px',
                          fontSize: '14px',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              marginBottom: '4px',
                            }}
                          >
                            Score
                          </div>
                          <div style={{ fontWeight: '600', color: '#22c55e' }}>
                            {driver.score}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              marginBottom: '4px',
                            }}
                          >
                            Loads
                          </div>
                          <div style={{ fontWeight: '600', color: '#3b82f6' }}>
                            {driver.loads}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              marginBottom: '4px',
                            }}
                          >
                            On-Time %
                          </div>
                          <div style={{ fontWeight: '600', color: '#fbbf24' }}>
                            {driver.onTime}%
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              marginBottom: '4px',
                            }}
                          >
                            Safety
                          </div>
                          <div style={{ fontWeight: '600', color: '#4ade80' }}>
                            {driver.safety}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Routes Tab */}
          {activeTab === 'routes' && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              }}
            >
              <h3
                style={{
                  margin: '0 0 24px 0',
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: '700',
                }}
              >
                🗺️ Route Optimization Analysis
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '24px',
                }}
              >
                {fleetData.routeOptimization.map((route, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '16px',
                      padding: '24px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontWeight: '600',
                        color: 'white',
                        marginBottom: '16px',
                        fontSize: '16px',
                      }}
                    >
                      {route.route}
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        gap: '12px',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '14px',
                            marginBottom: '4px',
                          }}
                        >
                          Efficiency
                        </div>
                        <div style={{ fontWeight: '600', color: '#22c55e' }}>
                          {route.efficiency}%
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '14px',
                            marginBottom: '4px',
                          }}
                        >
                          Avg Profit
                        </div>
                        <div style={{ fontWeight: '600', color: '#4ade80' }}>
                          ${route.profit}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '14px',
                            marginBottom: '4px',
                          }}
                        >
                          Frequency
                        </div>
                        <div style={{ fontWeight: '600', color: '#3b82f6' }}>
                          {route.frequency}/month
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fuel Efficiency Tab */}
          {activeTab === 'fuel' && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              }}
            >
              <h3
                style={{
                  margin: '0 0 24px 0',
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: '700',
                }}
              >
                ⛽ Fuel Efficiency Analysis
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '24px',
                }}
              >
                {fleetData.fuelEfficiency.map((vehicle, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '16px',
                      padding: '24px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontWeight: '600',
                        color: 'white',
                        marginBottom: '16px',
                        fontSize: '16px',
                      }}
                    >
                      {vehicle.vehicle}
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        gap: '12px',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '14px',
                            marginBottom: '4px',
                          }}
                        >
                          Miles per Gallon
                        </div>
                        <div style={{ fontWeight: '600', color: '#3b82f6' }}>
                          {vehicle.mpg} MPG
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '14px',
                            marginBottom: '4px',
                          }}
                        >
                          Monthly Fuel Cost
                        </div>
                        <div style={{ fontWeight: '600', color: '#fbbf24' }}>
                          ${vehicle.fuelCost}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '14px',
                            marginBottom: '4px',
                          }}
                        >
                          Trend
                        </div>
                        <div
                          style={{
                            fontWeight: '600',
                            color:
                              vehicle.trend === 'improving'
                                ? '#22c55e'
                                : vehicle.trend === 'declining'
                                  ? '#ef4444'
                                  : 'rgba(255, 255, 255, 0.8)',
                          }}
                        >
                          {vehicle.trend === 'improving'
                            ? '📈 Improving'
                            : vehicle.trend === 'declining'
                              ? '📉 Declining'
                              : '➡️ Stable'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
