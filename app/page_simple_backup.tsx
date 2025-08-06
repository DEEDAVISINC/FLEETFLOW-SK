'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import FleetMap from './components/FleetMap';
import FleetFlowLogo from './components/Logo';
import MetricsGrid from './components/MetricsGrid';
import RecentActivity from './components/RecentActivity';
import StickyNote from './components/StickyNote';
import VehicleStatusChart from './components/VehicleStatusChart';

export default function Dashboard() {
  const router = useRouter();
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

  // Clock and animations
  useEffect(() => {
    // TEMPORARILY DISABLED TO FIX INFINITE RENDER
    // const timer = setInterval(() => {
    //   setCurrentTime(new Date());
    // }, 1000);

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
  }, []);

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

  const getAlertGradient = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'from-red-500 via-red-600 to-red-700';
      case 'warning':
        return 'from-yellow-500 via-orange-500 to-red-500';
      case 'info':
        return 'from-blue-500 via-cyan-500 to-teal-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className='relative min-h-screen overflow-hidden bg-black'>
      {/* Dynamic Animated Background */}
      <div className='absolute inset-0'>
        <div className='absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black' />
        <div className='absolute top-0 left-0 h-full w-full'>
          <div className='absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/10 blur-3xl' />
          <div
            className='absolute top-3/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500/10 blur-3xl'
            style={{ animationDelay: '1s' }}
           />
          <div
            className='absolute top-1/2 left-1/2 h-96 w-96 animate-pulse rounded-full bg-cyan-500/5 blur-3xl'
            style={{ animationDelay: '2s' }}
           />
        </div>
        {/* Animated Moving Elements */}
        <div className='absolute inset-0'>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className='absolute h-1 w-1 animate-pulse rounded-full bg-white/20'
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
             />
          ))}
        </div>
      </div>

      <main className='relative z-10 space-y-8 p-8'>
        {/* Command Center Header */}
        <div className='relative'>
          <div className='absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 blur-xl' />
          <div className='relative rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-8'>
                <div className='relative'>
                  <div className='absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-r from-blue-400 to-cyan-400 opacity-75 blur-lg' />
                  <div className='relative rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-4'>
                    <FleetFlowLogo size='large' variant='light' />
                  </div>
                </div>
                <div className='text-white'>
                  <h1 className='mb-3 bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-5xl font-bold text-transparent'>
                    FleetFlow Command Center℠
                  </h1>
                  <p className='text-xl text-gray-300'>
                    Real-time fleet operations dashboard
                  </p>
                  <div className='mt-2 flex items-center space-x-4 text-sm text-gray-400'>
                    <span>🕒 {currentTime.toLocaleTimeString()}</span>
                    <span>📅 {currentTime.toLocaleDateString()}</span>
                    <span className='flex items-center space-x-1'>
                      <div className='h-2 w-2 animate-pulse rounded-full bg-green-500' />
                      <span>System Operational</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className='text-right'>
                <div className='mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-6xl font-bold text-transparent'>
                  ${animatedMetrics.revenue.toLocaleString()}
                </div>
                <div className='text-lg text-gray-300'>Today's Revenue</div>
                <div className='mt-1 flex items-center justify-end text-sm text-green-400'>
                  <span className='mr-1'>↗</span> +12.5% from yesterday
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Metrics Dashboard */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-4'>
          {[
            {
              title: 'Active Loads',
              value: animatedMetrics.loads,
              change: '+3',
              gradient: 'from-blue-500 to-cyan-500',
              icon: '🎯',
              subtitle: 'loads in transit',
            },
            {
              title: 'Available Drivers',
              value: animatedMetrics.drivers,
              change: '-2',
              gradient: 'from-green-500 to-emerald-500',
              icon: '👥',
              subtitle: 'ready for dispatch',
            },
            {
              title: 'Fuel Efficiency',
              value: animatedMetrics.efficiency,
              change: '+0.3',
              gradient: 'from-yellow-500 to-orange-500',
              icon: '⛽',
              subtitle: 'MPG average',
            },
            {
              title: 'Fleet Utilization',
              value: `${animatedMetrics.utilization}%`,
              change: '+5%',
              gradient: 'from-purple-500 to-pink-500',
              icon: '📊',
              subtitle: 'capacity used',
            },
          ].map((metric, index) => (
            <div key={index} className='group relative'>
              <div
                className={`absolute inset-0 bg-gradient-to-r ${metric.gradient} rounded-2xl opacity-25 blur-lg transition-opacity duration-300 group-hover:opacity-40`}
               />
              <div className='relative transform rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white/10'>
                <div className='mb-4 flex items-center justify-between'>
                  <div
                    className={`h-12 w-12 bg-gradient-to-r ${metric.gradient} flex items-center justify-center rounded-xl text-2xl shadow-lg`}
                  >
                    {metric.icon}
                  </div>
                  <div
                    className={`rounded-full bg-gradient-to-r px-2 py-1 text-xs ${metric.gradient}/20 border border-white/20 text-white`}
                  >
                    {metric.change}
                  </div>
                </div>
                <div className='mb-1 text-3xl font-bold text-white'>
                  {metric.value}
                </div>
                <div className='text-sm text-gray-400'>{metric.title}</div>
                <div className='mt-1 text-xs text-gray-500'>
                  {metric.subtitle}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Critical Alerts Command Panel */}
        {activeAlerts.length > 0 && (
          <div className='relative'>
            <div className='absolute inset-0 rounded-3xl bg-gradient-to-r from-red-600/20 via-orange-600/20 to-yellow-600/20 blur-xl' />
            <div className='relative rounded-3xl border border-red-500/20 bg-white/5 p-6 shadow-2xl backdrop-blur-xl'>
              <div className='mb-6 flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  <div className='relative'>
                    <div className='absolute inset-0 animate-pulse rounded-xl bg-red-500 opacity-50 blur-lg' />
                    <div className='relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-2xl'>
                      🚨
                    </div>
                  </div>
                  <div>
                    <h2 className='text-2xl font-bold text-white'>
                      Critical Alerts
                    </h2>
                    <p className='text-gray-300'>
                      Immediate attention required
                    </p>
                  </div>
                </div>
                <div className='flex items-center space-x-2'>
                  <span className='rounded-full border border-red-500/30 bg-red-500/20 px-3 py-1 text-xs font-medium text-red-300'>
                    {activeAlerts.filter((a) => a.priority === 'high').length}{' '}
                    High Priority
                  </span>
                  <span className='rounded-full border border-yellow-500/30 bg-yellow-500/20 px-3 py-1 text-xs font-medium text-yellow-300'>
                    {activeAlerts.filter((a) => a.priority === 'medium').length}{' '}
                    Medium
                  </span>
                </div>
              </div>
              <div className='space-y-4'>
                {activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`relative overflow-hidden bg-gradient-to-r ${getAlertGradient(alert.type)}/10 rounded-2xl border border-white/10 p-4 transition-all duration-300 hover:bg-white/5`}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-4'>
                        <div
                          className={`h-10 w-10 bg-gradient-to-r ${getAlertGradient(alert.type)} flex items-center justify-center rounded-xl text-xl shadow-lg`}
                        >
                          {getAlertIcon(alert.type, alert.category)}
                        </div>
                        <div>
                          <p className='font-medium text-white'>
                            {alert.message}
                          </p>
                          <div className='mt-1 flex items-center space-x-3 text-sm text-gray-400'>
                            <span>
                              🕒{' '}
                              {new Date(alert.timestamp).toLocaleTimeString()}
                            </span>
                            <span
                              className={`rounded-full px-2 py-1 text-xs ${
                                alert.priority === 'high'
                                  ? 'bg-red-500/20 text-red-300'
                                  : alert.priority === 'medium'
                                    ? 'bg-yellow-500/20 text-yellow-300'
                                    : 'bg-blue-500/20 text-blue-300'
                              }`}
                            >
                              {alert.priority} priority
                            </span>
                            <span className='text-gray-500'>
                              • {alert.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className='rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white'
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Advanced Action Command Center */}
        <div className='relative'>
          <div className='absolute inset-0 rounded-3xl bg-gradient-to-r from-green-600/20 via-blue-600/20 to-purple-600/20 blur-xl' />
          <div className='relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl'>
            <div className='mb-6 flex items-center space-x-4'>
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-2xl'>
                ⚡
              </div>
              <div>
                <h2 className='text-2xl font-bold text-white'>Quick Actions</h2>
                <p className='text-gray-300'>Fleet command operations</p>
              </div>
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
              {[
                {
                  title: 'Dispatch Load',
                  subtitle: 'Assign new delivery',
                  icon: '🎯',
                  gradient: 'from-blue-500 to-cyan-500',
                  action: handleDispatchNewLoad,
                },
                {
                  title: 'Add Driver',
                  subtitle: 'Register new driver',
                  icon: '👥',
                  gradient: 'from-green-500 to-emerald-500',
                  action: handleAddDriver,
                },
                {
                  title: 'Schedule Service',
                  subtitle: 'Book maintenance',
                  icon: '🔧',
                  gradient: 'from-orange-500 to-red-500',
                  action: handleScheduleMaintenance,
                },
                {
                  title: 'Generate Report',
                  subtitle: 'Analytics dashboard',
                  icon: '📈',
                  gradient: 'from-purple-500 to-pink-500',
                  action: handleGenerateReport,
                },
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className='group relative transform overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white/10'
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${action.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-20`}
                   />
                  <div className='relative'>
                    <div
                      className={`h-12 w-12 bg-gradient-to-r ${action.gradient} mb-4 flex items-center justify-center rounded-xl text-2xl shadow-lg transition-transform duration-300 group-hover:scale-110`}
                    >
                      {action.icon}
                    </div>
                    <div className='text-lg font-semibold text-white'>
                      {action.title}
                    </div>
                    <div className='mt-1 text-sm text-gray-400'>
                      {action.subtitle}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Fleet Overview Grid */}
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Today's Metrics */}
          <div className='relative'>
            <div className='absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 blur-xl' />
            <div className='relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl'>
              <div className='mb-6 flex items-center space-x-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-xl'>
                  📊
                </div>
                <h3 className='text-xl font-semibold text-white'>
                  Today's Performance
                </h3>
              </div>
              <MetricsGrid metrics={fleetMetrics} />
            </div>
          </div>

          {/* Fleet Status */}
          <div className='relative'>
            <div className='absolute inset-0 rounded-3xl bg-gradient-to-r from-green-600/20 to-teal-600/20 blur-xl' />
            <div className='relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl'>
              <div className='mb-6 flex items-center space-x-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-xl'>
                  🚛
                </div>
                <h3 className='text-xl font-semibold text-white'>
                  Fleet Status
                </h3>
              </div>
              <VehicleStatusChart />
            </div>
          </div>

          {/* Recent Activity */}
          <div className='relative'>
            <div className='absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 blur-xl' />
            <div className='relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl'>
              <div className='mb-6 flex items-center space-x-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-xl'>
                  🕐
                </div>
                <h3 className='text-xl font-semibold text-white'>
                  Live Activity
                </h3>
              </div>
              <RecentActivity />
            </div>
          </div>
        </div>

        {/* Fleet Map and Notes */}
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Fleet Map */}
          <div className='relative lg:col-span-2'>
            <div className='absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-600/20 to-green-600/20 blur-xl' />
            <div className='relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl'>
              <div className='mb-6 flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-xl'>
                    🗺️
                  </div>
                  <h3 className='text-xl font-semibold text-white'>
                    Real-time Fleet Tracking
                  </h3>
                </div>
                <span className='rounded-full border border-green-500/30 bg-green-500/20 px-3 py-1 text-sm font-medium text-green-300'>
                  {fleetMetrics.activeVehicles} Active Vehicles
                </span>
              </div>
              <FleetMap />
            </div>
          </div>

          {/* Sticky Notes */}
          <div className='relative'>
            <div className='absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-600/20 to-orange-600/20 blur-xl' />
            <div className='relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl'>
              <div className='mb-6 flex items-center space-x-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-xl'>
                  📝
                </div>
                <h3 className='text-xl font-semibold text-white'>
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
        </div>

        {/* Performance Analytics */}
        <div className='relative'>
          <div className='absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-600/20 to-purple-600/20 blur-xl' />
          <div className='relative rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl'>
            <div className='mb-8 flex items-center space-x-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-2xl'>
                🏆
              </div>
              <div>
                <h2 className='text-2xl font-semibold text-white'>
                  Performance Analytics
                </h2>
                <p className='text-gray-300'>Key operational metrics</p>
              </div>
            </div>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
              {[
                {
                  title: 'On-Time Delivery',
                  value: `${todaysMetrics.onTimeDelivery}%`,
                  change: '+2.1%',
                  gradient: 'from-blue-500 to-blue-600',
                  icon: '🎯',
                },
                {
                  title: 'Customer Satisfaction',
                  value: `${todaysMetrics.customerSatisfaction}%`,
                  change: '+1.2%',
                  gradient: 'from-green-500 to-green-600',
                  icon: '😊',
                },
                {
                  title: 'Profit Margin',
                  value: `${todaysMetrics.profitMargin}%`,
                  change: '+3.4%',
                  gradient: 'from-purple-500 to-purple-600',
                  icon: '💰',
                },
              ].map((metric, index) => (
                <div key={index} className='group text-center'>
                  <div
                    className={`bg-gradient-to-r ${metric.gradient} mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full shadow-2xl transition-all duration-300 group-hover:scale-110`}
                  >
                    <div className='text-center'>
                      <div className='mb-1 text-2xl'>{metric.icon}</div>
                      <div className='text-2xl font-bold text-white'>
                        {metric.value}
                      </div>
                    </div>
                  </div>
                  <div className='text-lg font-semibold text-white'>
                    {metric.title}
                  </div>
                  <div className='mt-2 text-sm font-medium text-green-400'>
                    {metric.change} from last week
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
