'use client';

import Link from 'next/link';
import { useState } from 'react';
import RouteOptimizerDashboard from '../components/RouteOptimizerDashboard';

export default function RoutesPageRedesigned() {
  const [activeView, setActiveView] = useState<
    'dashboard' | 'optimizer' | 'analytics'
  >('dashboard');
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

  return (
    <div
      style={{
        background:
          'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #5b21b6 100%)',
        minHeight: '100vh',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div className='container mx-auto px-6 py-8'>
        {/* Header */}
        <div
          className='mb-8 rounded-2xl p-8 text-white shadow-2xl'
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-6'>
              <div className='rounded-xl bg-white/20 p-4'>
                <span className='text-4xl'>🗺️</span>
              </div>
              <div>
                <h1 className='mb-2 text-4xl font-bold drop-shadow-lg'>
                  Route Optimization Center
                </h1>
                <p className='text-lg text-blue-100 drop-shadow-md'>
                  AI-powered intelligent route planning & real-time optimization
                </p>
                <div className='mt-3 flex items-center space-x-6'>
                  <div className='flex items-center space-x-2'>
                    <div className='h-3 w-3 animate-pulse rounded-full bg-green-400' />
                    <span className='text-sm'>Live Optimization Active</span>
                  </div>
                  <div className='text-sm opacity-90'>
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
            <div className='flex space-x-3'>
              <Link href='/fleetflowdash'>
                <button className='rounded-xl border border-white/20 bg-white/20 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/40 hover:bg-white/30 hover:shadow-lg'>
                  🏠 Dashboard
                </button>
              </Link>
              <button className='rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:from-emerald-600 hover:to-teal-700 hover:shadow-lg'>
                + New Route
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className='mb-8 flex space-x-2'>
          {[
            { id: 'dashboard', label: 'Overview', icon: '📊' },
            { id: 'optimizer', label: 'AI Optimizer', icon: '⚡' },
            { id: 'analytics', label: 'Analytics', icon: '📈' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`rounded-xl px-6 py-3 font-semibold transition-all duration-300 ${
                activeView === tab.id
                  ? '-translate-y-1 transform bg-white text-purple-600 shadow-lg'
                  : 'bg-white/20 text-white backdrop-blur-sm hover:bg-white/30'
              }`}
            >
              <span className='mr-2'>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <div className='space-y-8'>
            {/* Stats Grid */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
              <div
                className='rounded-2xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl'
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Active Routes
                    </p>
                    <p className='text-3xl font-bold text-gray-900'>
                      {routeStats.activeRoutes}
                    </p>
                    <p className='text-sm text-green-600'>+3 from yesterday</p>
                  </div>
                  <div className='rounded-xl bg-blue-100 p-3'>
                    <span className='text-2xl'>🚛</span>
                  </div>
                </div>
              </div>

              <div
                className='rounded-2xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl'
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Total Miles
                    </p>
                    <p className='text-3xl font-bold text-gray-900'>
                      {routeStats.totalMiles.toLocaleString()}
                    </p>
                    <p className='text-sm text-green-600'>This week</p>
                  </div>
                  <div className='rounded-xl bg-green-100 p-3'>
                    <span className='text-2xl'>📍</span>
                  </div>
                </div>
              </div>

              <div
                className='rounded-2xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl'
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Avg Efficiency
                    </p>
                    <p className='text-3xl font-bold text-gray-900'>
                      {routeStats.avgEfficiency}%
                    </p>
                    <p className='text-sm text-green-600'>+2.3% improvement</p>
                  </div>
                  <div className='rounded-xl bg-purple-100 p-3'>
                    <span className='text-2xl'>⚡</span>
                  </div>
                </div>
              </div>

              <div
                className='rounded-2xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl'
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Cost Savings
                    </p>
                    <p className='text-3xl font-bold text-gray-900'>
                      ${routeStats.costSavings}
                    </p>
                    <p className='text-sm text-green-600'>This month</p>
                  </div>
                  <div className='rounded-xl bg-emerald-100 p-3'>
                    <span className='text-2xl'>💰</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Optimizations */}
            <div
              className='rounded-2xl p-8 shadow-xl'
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className='mb-6 flex items-center justify-between'>
                <h2 className='text-2xl font-bold text-gray-900'>
                  Recent Route Optimizations
                </h2>
                <button className='rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg'>
                  View All
                </button>
              </div>
              <div className='space-y-4'>
                {recentOptimizations.map((route) => (
                  <div
                    key={route.id}
                    className='flex items-center justify-between rounded-xl bg-gray-50 p-4 transition-all duration-300 hover:bg-gray-100'
                  >
                    <div className='flex items-center space-x-4'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 font-bold text-white'>
                        {route.id.slice(-1)}
                      </div>
                      <div>
                        <h3 className='font-semibold text-gray-900'>
                          {route.driver}
                        </h3>
                        <p className='text-sm text-gray-600'>
                          Route {route.id}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center space-x-6'>
                      <div className='text-center'>
                        <p className='text-2xl font-bold text-green-600'>
                          {route.efficiency}%
                        </p>
                        <p className='text-xs text-gray-600'>Efficiency</p>
                      </div>
                      <div className='text-center'>
                        <p className='text-lg font-bold text-gray-900'>
                          {route.savings}
                        </p>
                        <p className='text-xs text-gray-600'>Savings</p>
                      </div>
                      <div
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          route.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : route.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {route.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div
              className='rounded-2xl p-8 shadow-xl'
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <h2 className='mb-6 text-2xl font-bold text-gray-900'>
                Quick Actions
              </h2>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                <button
                  onClick={() => setActiveView('optimizer')}
                  className='rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
                >
                  <div className='mb-3 text-3xl'>⚡</div>
                  <h3 className='mb-2 text-lg font-bold'>AI Route Optimizer</h3>
                  <p className='text-sm text-blue-100'>
                    Optimize routes with advanced AI algorithms
                  </p>
                </button>

                <Link
                  href='/tracking'
                  className='block rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
                >
                  <div className='mb-3 text-3xl'>📍</div>
                  <h3 className='mb-2 text-lg font-bold'>Live Tracking</h3>
                  <p className='text-sm text-emerald-100'>
                    Monitor all routes in real-time
                  </p>
                </Link>

                <button
                  onClick={() => setActiveView('analytics')}
                  className='rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 p-6 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
                >
                  <div className='mb-3 text-3xl'>📈</div>
                  <h3 className='mb-2 text-lg font-bold'>Analytics</h3>
                  <p className='text-sm text-purple-100'>
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
            className='overflow-hidden rounded-2xl shadow-2xl'
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className='bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white'>
              <h2 className='mb-2 text-2xl font-bold'>🤖 AI Route Optimizer</h2>
              <p className='text-blue-100'>
                Advanced machine learning algorithms for optimal route planning
              </p>
            </div>
            <div className='p-6'>
              <RouteOptimizerDashboard />
            </div>
          </div>
        )}

        {/* Analytics View */}
        {activeView === 'analytics' && (
          <div className='space-y-8'>
            <div
              className='rounded-2xl p-8 shadow-xl'
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className='mb-8 flex items-center justify-between'>
                <div>
                  <h2 className='mb-2 text-3xl font-bold text-gray-900'>
                    📊 Route Performance Analytics
                  </h2>
                  <p className='text-gray-600'>
                    Deep insights into your fleet's optimization performance
                  </p>
                </div>
                <div className='flex space-x-3'>
                  <button className='rounded-lg bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-600'>
                    Export Report
                  </button>
                  <button className='rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-300'>
                    Date Range
                  </button>
                </div>
              </div>

              {/* Performance Charts */}
              <div className='mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2'>
                <div className='rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 p-6'>
                  <h3 className='mb-4 text-lg font-bold text-gray-900'>
                    📈 Efficiency Trends
                  </h3>
                  <div className='flex h-64 items-center justify-center rounded-lg border border-blue-200 bg-white/50'>
                    <div className='text-center'>
                      <div className='mb-4 text-5xl'>📈</div>
                      <p className='mb-2 text-gray-700'>
                        Efficiency trending upward
                      </p>
                      <p className='text-3xl font-bold text-green-600'>
                        +12.5%
                      </p>
                      <p className='text-sm text-gray-600'>vs last month</p>
                    </div>
                  </div>
                </div>

                <div className='rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100 p-6'>
                  <h3 className='mb-4 text-lg font-bold text-gray-900'>
                    💰 Cost Optimization
                  </h3>
                  <div className='flex h-64 items-center justify-center rounded-lg border border-emerald-200 bg-white/50'>
                    <div className='text-center'>
                      <div className='mb-4 text-5xl'>💰</div>
                      <p className='mb-2 text-gray-700'>Monthly savings</p>
                      <p className='text-3xl font-bold text-emerald-600'>
                        $4,250
                      </p>
                      <p className='text-sm text-gray-600'>Total saved</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-3'>
                <div className='rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-8 text-center'>
                  <div className='mb-4 text-4xl'>🚛</div>
                  <h3 className='mb-2 text-xl font-bold text-gray-900'>
                    Routes Optimized
                  </h3>
                  <p className='mb-1 text-4xl font-bold text-blue-600'>247</p>
                  <p className='text-gray-600'>This month</p>
                </div>

                <div className='rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-8 text-center'>
                  <div className='mb-4 text-4xl'>⏱️</div>
                  <h3 className='mb-2 text-xl font-bold text-gray-900'>
                    Time Saved
                  </h3>
                  <p className='mb-1 text-4xl font-bold text-green-600'>156h</p>
                  <p className='text-gray-600'>Driver hours</p>
                </div>

                <div className='rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-8 text-center'>
                  <div className='mb-4 text-4xl'>⛽</div>
                  <h3 className='mb-2 text-xl font-bold text-gray-900'>
                    Fuel Saved
                  </h3>
                  <p className='mb-1 text-4xl font-bold text-purple-600'>892</p>
                  <p className='text-gray-600'>Gallons</p>
                </div>
              </div>

              {/* Performance Insights */}
              <div className='rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-6'>
                <h3 className='mb-4 text-lg font-bold text-gray-900'>
                  🎯 AI Insights & Recommendations
                </h3>
                <div className='space-y-3'>
                  <div className='flex items-start space-x-3'>
                    <div className='mt-2 h-2 w-2 rounded-full bg-green-500' />
                    <p className='text-gray-700'>
                      <strong>High Performance:</strong> Route efficiency has
                      improved by 12.5% this month due to AI optimization.
                    </p>
                  </div>
                  <div className='flex items-start space-x-3'>
                    <div className='mt-2 h-2 w-2 rounded-full bg-yellow-500' />
                    <p className='text-gray-700'>
                      <strong>Opportunity:</strong> Consider optimizing morning
                      departure times to avoid peak traffic.
                    </p>
                  </div>
                  <div className='flex items-start space-x-3'>
                    <div className='mt-2 h-2 w-2 rounded-full bg-blue-500' />
                    <p className='text-gray-700'>
                      <strong>Trend:</strong> Fuel costs decreased by 8% through
                      better route planning and traffic avoidance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
