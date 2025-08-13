'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import FleetFlowLandingPage from './components/FleetFlowLandingPage';
import FleetMap from './components/FleetMap';
import MetricsGrid from './components/MetricsGrid';
import RecentActivity from './components/RecentActivity';
import StickyNote from './components/StickyNote';
import VehicleStatusChart from './components/VehicleStatusChart';
import UserDataService from './services/user-data-service';

export default function HomePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animatedMetrics, setAnimatedMetrics] = useState({
    revenue: 0,
    loads: 0,
    drivers: 0,
    efficiency: 0,
    utilization: 0,
  });

  const [activeAlerts, setActiveAlerts] = useState([
    {
      id: 1,
      type: 'urgent',
      message: 'Critical: Vehicle TRK-045 engine temperature warning',
      timestamp: new Date().toISOString(),
      priority: 'high',
      category: 'mechanical',
    },
    {
      id: 2,
      type: 'warning',
      message: 'Driver fatigue detected: John Smith approaching HOS limit',
      timestamp: new Date().toISOString(),
      priority: 'medium',
      category: 'compliance',
    },
    {
      id: 3,
      type: 'info',
      message: 'Route optimization saved 15% fuel on I-95 corridor',
      timestamp: new Date().toISOString(),
      priority: 'low',
      category: 'efficiency',
    },
    {
      id: 4,
      type: 'urgent',
      message: 'Weather alert: Severe storm affecting Route 7',
      timestamp: new Date().toISOString(),
      priority: 'high',
      category: 'weather',
    },
  ]);

  const [todaysMetrics] = useState({
    totalRevenue: 487520,
    activeLoads: 23,
    availableDrivers: 8,
    maintenanceAlerts: 3,
    fuelEfficiency: 6.8,
    onTimeDelivery: 94.2,
    profitMargin: 23.8,
    customerSatisfaction: 97.5,
    fleetUtilization: 89,
  });

  const [fleetMetrics] = useState({
    totalVehicles: 45,
    activeVehicles: 38,
    maintenanceVehicles: 7,
    totalDrivers: 52,
    activeRoutes: 23,
    fuelEfficiency: 6.8,
    monthlyMileage: 125480,
    maintenanceCosts: 28750,
  });

  // Check authentication status and handle dashboard logic
  useEffect(() => {
    const userDataService = UserDataService.getInstance();
    const currentUser = userDataService.getCurrentUser();

    // TEMPORARY: Bypass authentication for development - show dashboard immediately
    // TODO: Remove this bypass for production and restore proper authentication
    setIsAuthenticated(true);

    // Clock and animations for dashboard
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Animate metrics on load
    const animateMetrics = () => {
      const duration = 2500;
      const steps = 60;
      const stepDuration = duration / steps;

      for (let i = 0; i <= steps; i++) {
        setTimeout(() => {
          const progress = i / steps;
          const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
          setAnimatedMetrics({
            revenue: Math.floor(todaysMetrics.totalRevenue * easeProgress),
            loads: Math.floor(todaysMetrics.activeLoads * easeProgress),
            drivers: Math.floor(todaysMetrics.availableDrivers * easeProgress),
            efficiency:
              Math.floor(todaysMetrics.fuelEfficiency * easeProgress * 10) / 10,
            utilization: Math.floor(
              todaysMetrics.fleetUtilization * easeProgress
            ),
          });
        }, i * stepDuration);
      }
    };

    animateMetrics();
    return () => clearInterval(timer);

    // ORIGINAL AUTHENTICATION CODE (commented out for development):
    // if (currentUser) {
    //   setIsAuthenticated(true);
    //   // ... rest of dashboard logic
    // } else {
    //   setIsAuthenticated(false);
    // }
  }, [router, todaysMetrics]);

  // Quick Action handlers
  const handleDispatchNewLoad = () => {
    router.push('/dispatch');
  };

  const handleAddDriver = () => {
    router.push('/drivers');
  };

  const handleScheduleMaintenance = () => {
    router.push('/maintenance');
  };

  const handleGenerateReport = () => {
    router.push('/reports');
  };

  // Alert dismissal handler
  const dismissAlert = (alertId: number) => {
    setActiveAlerts((alerts) => alerts.filter((a) => a.id !== alertId));
  };

  const getAlertIcon = (type: string, category: string) => {
    if (category === 'mechanical') return '🔧';
    if (category === 'compliance') return '⚖️';
    if (category === 'weather') return '🌩️';
    if (category === 'efficiency') return '⚡';
    return type === 'urgent' ? '🚨' : type === 'warning' ? '⚠️' : 'ℹ️';
  };

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div
        style={{
          background:
            'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🚛</div>
          <h2>Loading FleetFlow...</h2>
        </div>
      </div>
    );
  }

  // Show landing page for non-authenticated users
  if (!isAuthenticated) {
    return <FleetFlowLandingPage />;
  }

  // Show original dashboard for authenticated users
  return (
    <div className='container py-6'>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1
            className='mb-2 text-gray-900'
            style={{ fontSize: '2rem', fontWeight: 'bold' }}
          >
            FleetFlow Command Center℠
          </h1>
          <p className='text-gray-600'>Real-time fleet operations dashboard</p>
          <div className='mt-2 flex items-center space-x-4 text-sm text-gray-500'>
            <span>🕒 {currentTime.toLocaleTimeString()}</span>
            <span>📅 {currentTime.toLocaleDateString()}</span>
            <span className='flex items-center space-x-1'>
              <div className='h-2 w-2 animate-pulse rounded-full bg-green-500' />
              <span>System Operational</span>
            </span>
          </div>
        </div>
        <div className='text-right'>
          <div className='text-3xl font-bold text-green-600'>
            ${animatedMetrics.revenue.toLocaleString()}
          </div>
          <div className='text-sm text-gray-600'>Today's Revenue</div>
          <div className='mt-1 text-xs text-green-600'>
            ↗ +12.5% from yesterday
          </div>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className='mb-6 grid grid-cols-1 gap-6 lg:grid-cols-4'>
        {[
          {
            title: 'Active Loads',
            value: animatedMetrics.loads,
            change: '+3',
            icon: '🎯',
            subtitle: 'loads in transit',
          },
          {
            title: 'Available Drivers',
            value: animatedMetrics.drivers,
            change: '-2',
            icon: '👥',
            subtitle: 'ready for dispatch',
          },
          {
            title: 'Fuel Efficiency',
            value: animatedMetrics.efficiency,
            change: '+0.3',
            icon: '⛽',
            subtitle: 'MPG average',
          },
          {
            title: 'Fleet Utilization',
            value: `${animatedMetrics.utilization}%`,
            change: '+5%',
            icon: '📊',
            subtitle: 'capacity used',
          },
        ].map((metric, index) => (
          <div key={index} className='metric-card'>
            <div className='mb-2 flex items-start justify-between'>
              <div className='flex items-center gap-2'>
                <span style={{ fontSize: '1.5rem' }}>{metric.icon}</span>
                <div className='metric-label'>{metric.title}</div>
              </div>
              <span className='metric-change metric-up'>{metric.change}</span>
            </div>
            <div className='metric-value'>{metric.value}</div>
            <div className='text-gray-500' style={{ fontSize: '0.875rem' }}>
              {metric.subtitle}
            </div>
          </div>
        ))}
      </div>

      {/* Critical Alerts */}
      {activeAlerts.length > 0 && (
        <div className='card mb-6'>
          <div className='mb-4 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <span style={{ fontSize: '1.5rem' }}>🚨</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                Critical Alerts
              </h3>
            </div>
            <div className='flex items-center space-x-2'>
              <span className='rounded-full border border-red-200 bg-red-100 px-3 py-1 text-xs font-medium text-red-700'>
                {activeAlerts.filter((a) => a.priority === 'high').length} High
                Priority
              </span>
              <span className='rounded-full border border-yellow-200 bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700'>
                {activeAlerts.filter((a) => a.priority === 'medium').length}{' '}
                Medium
              </span>
            </div>
          </div>
          <div className='space-y-3'>
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className='flex items-center justify-between rounded-lg bg-gray-50 p-3'
              >
                <div className='flex items-center space-x-3'>
                  <span style={{ fontSize: '1.2rem' }}>
                    {getAlertIcon(alert.type, alert.category)}
                  </span>
                  <div>
                    <p className='font-medium text-gray-800'>{alert.message}</p>
                    <div className='mt-1 flex items-center space-x-3 text-sm text-gray-600'>
                      <span>
                        🕒 {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          alert.priority === 'high'
                            ? 'bg-red-100 text-red-700'
                            : alert.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {alert.priority} priority
                      </span>
                      <span className='text-gray-500'>• {alert.category}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className='p-1 text-gray-400 hover:text-gray-600'
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className='card mb-6'>
        <div className='mb-4 flex items-center gap-3'>
          <span style={{ fontSize: '1.5rem' }}>⚡</span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
            Quick Actions
          </h3>
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {[
            {
              title: 'Dispatch Load',
              subtitle: 'Assign new delivery',
              icon: '🎯',
              action: handleDispatchNewLoad,
            },
            {
              title: 'Add Driver',
              subtitle: 'Register new driver',
              icon: '👥',
              action: handleAddDriver,
            },
            {
              title: 'Schedule Service',
              subtitle: 'Book maintenance',
              icon: '🔧',
              action: handleScheduleMaintenance,
            },
            {
              title: 'Generate Report',
              subtitle: 'Analytics dashboard',
              icon: '📈',
              action: handleGenerateReport,
            },
          ].map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className='rounded-lg border border-gray-200 p-4 text-left transition-all hover:border-blue-300 hover:bg-blue-50'
            >
              <div className='mb-2 flex items-center gap-3'>
                <span style={{ fontSize: '1.5rem' }}>{action.icon}</span>
                <div style={{ fontWeight: '600' }}>{action.title}</div>
              </div>
              <div className='text-sm text-gray-600'>{action.subtitle}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Fleet Overview Grid */}
      <div className='mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Today's Performance */}
        <div className='card'>
          <div className='mb-4 flex items-center gap-3'>
            <span style={{ fontSize: '1.2rem' }}>📊</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
              Today's Performance
            </h3>
          </div>
          <MetricsGrid metrics={fleetMetrics} />
        </div>

        {/* Fleet Status */}
        <div className='card'>
          <div className='mb-4 flex items-center gap-3'>
            <span style={{ fontSize: '1.2rem' }}>🚛</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
              Fleet Status
            </h3>
          </div>
          <VehicleStatusChart />
        </div>

        {/* Recent Activity */}
        <div className='card'>
          <div className='mb-4 flex items-center gap-3'>
            <span style={{ fontSize: '1.2rem' }}>🕐</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
              Live Activity
            </h3>
          </div>
          <RecentActivity />
        </div>
      </div>

      {/* Fleet Map and Notes */}
      <div className='mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Fleet Map */}
        <div className='card lg:col-span-2'>
          <div className='mb-4 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <span style={{ fontSize: '1.2rem' }}>🗺️</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                Real-time Fleet Tracking
              </h3>
            </div>
            <span className='rounded-full border border-green-200 bg-green-100 px-3 py-1 text-sm font-medium text-green-700'>
              {fleetMetrics.activeVehicles} Active Vehicles
            </span>
          </div>
          <FleetMap />
        </div>

        {/* Command Notes */}
        <div className='card'>
          <div className='mb-4 flex items-center gap-3'>
            <span style={{ fontSize: '1.2rem' }}>📝</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
              Command Notes
            </h3>
          </div>
          <StickyNote
            section='dashboard'
            entityId='fleet-overview'
            entityName='Fleet Dashboard'
          />
        </div>
      </div>

      {/* Performance Analytics */}
      <div className='card'>
        <div className='mb-6 flex items-center gap-3'>
          <span style={{ fontSize: '1.5rem' }}>🏆</span>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
              Performance Analytics
            </h3>
            <p className='text-sm text-gray-600'>Key operational metrics</p>
          </div>
        </div>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          {[
            {
              title: 'On-Time Delivery',
              value: `${todaysMetrics.onTimeDelivery}%`,
              change: '+2.1%',
              icon: '🎯',
            },
            {
              title: 'Customer Satisfaction',
              value: `${todaysMetrics.customerSatisfaction}%`,
              change: '+1.2%',
              icon: '😊',
            },
            {
              title: 'Profit Margin',
              value: `${todaysMetrics.profitMargin}%`,
              change: '+3.4%',
              icon: '💰',
            },
          ].map((metric, index) => (
            <div key={index} className='rounded-lg bg-gray-50 p-4 text-center'>
              <div className='mb-2 text-4xl'>{metric.icon}</div>
              <div className='mb-1 text-2xl font-bold text-gray-800'>
                {metric.value}
              </div>
              <div className='mb-2 font-semibold text-gray-700'>
                {metric.title}
              </div>
              <div className='text-sm font-medium text-green-600'>
                {metric.change} from last week
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
