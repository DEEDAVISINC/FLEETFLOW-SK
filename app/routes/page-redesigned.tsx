'use client'

import { useState, useEffect } from 'react'
import RouteOptimizerDashboard from '../components/RouteOptimizerDashboard'
import GoogleMapsEmbed from '../components/GoogleMaps'
import Link from 'next/link'

export default function RoutesPageRedesigned() {
  const [activeView, setActiveView] = useState<'dashboard' | 'optimizer' | 'analytics'>('dashboard')
  const [routeStats, setRouteStats] = useState({
    activeRoutes: 12,
    totalMiles: 2847,
    avgEfficiency: 89,
    costSavings: 1250
  })
  const [recentOptimizations, setRecentOptimizations] = useState([
    { id: 'R001', driver: 'John Smith', efficiency: 94, savings: '$187', status: 'Completed' },
    { id: 'R002', driver: 'Sarah Wilson', efficiency: 91, savings: '$145', status: 'In Progress' },
    { id: 'R003', driver: 'Mike Johnson', efficiency: 87, savings: '$98', status: 'Optimizing' }
  ])

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #5b21b6 100%)',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div 
          className="p-8 rounded-2xl shadow-2xl text-white mb-8"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="p-4 bg-white/20 rounded-xl">
                <span className="text-4xl">🗺️</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold drop-shadow-lg mb-2">Route Optimization Center</h1>
                <p className="text-blue-100 text-lg drop-shadow-md">AI-powered intelligent route planning & real-time optimization</p>
                <div className="flex items-center space-x-6 mt-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Live Optimization Active</span>
                  </div>
                  <div className="text-sm opacity-90">Last updated: {new Date().toLocaleTimeString()}</div>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link href="/">
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 border border-white/20 hover:border-white/40 hover:-translate-y-1 hover:shadow-lg">
                  🏠 Dashboard
                </button>
              </Link>
              <button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                + New Route
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-8">
          {[
            { id: 'dashboard', label: '📊 Overview', icon: '📊' },
            { id: 'optimizer', label: '⚡ AI Optimizer', icon: '⚡' },
            { id: 'analytics', label: '📈 Analytics', icon: '📈' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeView === tab.id
                  ? 'bg-white text-purple-600 shadow-lg transform -translate-y-1'
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div 
                className="rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Active Routes</p>
                    <p className="text-3xl font-bold text-gray-900">{routeStats.activeRoutes}</p>
                    <p className="text-green-600 text-sm">+3 from yesterday</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <span className="text-2xl">🚛</span>
                  </div>
                </div>
              </div>

              <div 
                className="rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Miles</p>
                    <p className="text-3xl font-bold text-gray-900">{routeStats.totalMiles.toLocaleString()}</p>
                    <p className="text-green-600 text-sm">This week</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-xl">
                    <span className="text-2xl">📍</span>
                  </div>
                </div>
              </div>

              <div 
                className="rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Avg Efficiency</p>
                    <p className="text-3xl font-bold text-gray-900">{routeStats.avgEfficiency}%</p>
                    <p className="text-green-600 text-sm">+2.3% improvement</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <span className="text-2xl">⚡</span>
                  </div>
                </div>
              </div>

              <div 
                className="rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Cost Savings</p>
                    <p className="text-3xl font-bold text-gray-900">${routeStats.costSavings}</p>
                    <p className="text-green-600 text-sm">This month</p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-xl">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Optimizations */}
            <div 
              className="rounded-2xl shadow-xl p-8"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Route Optimizations</h2>
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-300">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentOptimizations.map((route) => (
                  <div key={route.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {route.id.slice(-1)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{route.driver}</h3>
                        <p className="text-gray-600 text-sm">Route {route.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{route.efficiency}%</p>
                        <p className="text-gray-600 text-xs">Efficiency</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">{route.savings}</p>
                        <p className="text-gray-600 text-xs">Savings</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        route.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        route.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {route.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div 
              className="rounded-2xl shadow-xl p-8"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button 
                  onClick={() => setActiveView('optimizer')}
                  className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="text-3xl mb-3">⚡</div>
                  <h3 className="font-bold text-lg mb-2">AI Route Optimizer</h3>
                  <p className="text-blue-100 text-sm">Optimize routes with advanced AI algorithms</p>
                </button>
                
                <button className="p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="text-3xl mb-3">📍</div>
                  <h3 className="font-bold text-lg mb-2">Live Tracking</h3>
                  <p className="text-emerald-100 text-sm">Monitor all routes in real-time</p>
                </button>
                
                <button 
                  onClick={() => setActiveView('analytics')}
                  className="p-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="text-3xl mb-3">📈</div>
                  <h3 className="font-bold text-lg mb-2">Analytics</h3>
                  <p className="text-purple-100 text-sm">Deep insights and performance metrics</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Optimizer View */}
        {activeView === 'optimizer' && (
          <div 
            className="rounded-2xl shadow-2xl overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <h2 className="text-2xl font-bold mb-2">🤖 AI Route Optimizer</h2>
              <p className="text-blue-100">Advanced machine learning algorithms for optimal route planning</p>
            </div>
            <div className="p-6">
              <RouteOptimizerDashboard />
            </div>
          </div>
        )}

        {/* Analytics View */}
        {activeView === 'analytics' && (
          <div className="space-y-8">
            <div 
              className="rounded-2xl shadow-xl p-8"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">📊 Route Performance Analytics</h2>
                  <p className="text-gray-600">Deep insights into your fleet's optimization performance</p>
                </div>
                <div className="flex space-x-3">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors">
                    Export Report
                  </button>
                  <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors">
                    Date Range
                  </button>
                </div>
              </div>
              
              {/* Performance Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">📈 Efficiency Trends</h3>
                  <div className="h-64 bg-white/50 rounded-lg flex items-center justify-center border border-blue-200">
                    <div className="text-center">
                      <div className="text-5xl mb-4">📈</div>
                      <p className="text-gray-700 mb-2">Efficiency trending upward</p>
                      <p className="text-3xl font-bold text-green-600">+12.5%</p>
                      <p className="text-gray-600 text-sm">vs last month</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-xl">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">💰 Cost Optimization</h3>
                  <div className="h-64 bg-white/50 rounded-lg flex items-center justify-center border border-emerald-200">
                    <div className="text-center">
                      <div className="text-5xl mb-4">💰</div>
                      <p className="text-gray-700 mb-2">Monthly savings</p>
                      <p className="text-3xl font-bold text-emerald-600">$4,250</p>
                      <p className="text-gray-600 text-sm">Total saved</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="text-4xl mb-4">🚛</div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">Routes Optimized</h3>
                  <p className="text-4xl font-bold text-blue-600 mb-1">247</p>
                  <p className="text-gray-600">This month</p>
                </div>
                
                <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                  <div className="text-4xl mb-4">⏱️</div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">Time Saved</h3>
                  <p className="text-4xl font-bold text-green-600 mb-1">156h</p>
                  <p className="text-gray-600">Driver hours</p>
                </div>
                
                <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <div className="text-4xl mb-4">⛽</div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">Fuel Saved</h3>
                  <p className="text-4xl font-bold text-purple-600 mb-1">892</p>
                  <p className="text-gray-600">Gallons</p>
                </div>
              </div>

              {/* Performance Insights */}
              <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                <h3 className="font-bold text-lg text-gray-900 mb-4">🎯 AI Insights & Recommendations</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p className="text-gray-700"><strong>High Performance:</strong> Route efficiency has improved by 12.5% this month due to AI optimization.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <p className="text-gray-700"><strong>Opportunity:</strong> Consider optimizing morning departure times to avoid peak traffic.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p className="text-gray-700"><strong>Trend:</strong> Fuel costs decreased by 8% through better route planning and traffic avoidance.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
