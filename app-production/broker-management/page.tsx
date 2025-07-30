'use client'

import { useState } from 'react'
import DispatcherAssignment from '../components/DispatcherAssignment'
import EnhancedLoadBoard from '../components/EnhancedLoadBoard'
import { getCurrentUser } from '../config/access'

export default function BrokerManagementPage() {
  const [selectedTab, setSelectedTab] = useState<'assignments' | 'loadboard' | 'performance'>('assignments')
  const { user, permissions } = getCurrentUser()

  if (!permissions.hasManagementAccess && user.role !== 'dispatcher') {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
        minHeight: '100vh',
        padding: '20px'
      }}>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 mt-20">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h1>
            <p className="text-gray-600 mb-4">
              This section is for managers, admins, and dispatchers only.
            </p>
            <a 
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Return to Dashboard
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
      minHeight: '100vh'
    }}>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            🏢 Broker & Dispatcher Management
          </h1>
          <p className="text-white/90">
            Manage dispatcher assignments and oversee load operations
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 mb-6">
          <nav className="flex space-x-2">
            {[
              { id: 'assignments', label: 'Dispatcher Assignments', icon: '👥', access: permissions.canAssignDispatcher },
              { id: 'loadboard', label: 'Load Board Overview', icon: '📋', access: true },
              { id: 'performance', label: 'Performance Metrics', icon: '📊', access: permissions.hasAnalyticsAccess }
            ].filter(tab => tab.access).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  selectedTab === tab.id
                    ? 'text-white shadow-lg'
                    : 'text-white hover:bg-white/20'
                }`}
                style={{
                  background: selectedTab === tab.id 
                    ? 'linear-gradient(135deg, #f97316, #ea580c)' 
                    : 'transparent'
                }}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {selectedTab === 'assignments' && permissions.canAssignDispatcher && (
            <DispatcherAssignment />
          )}
          
          {selectedTab === 'loadboard' && (
            <EnhancedLoadBoard />
          )}
          
          {selectedTab === 'performance' && permissions.hasAnalyticsAccess && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-blue-600 font-semibold mb-2">Load Completion Rate</div>
                  <div className="text-3xl font-bold text-blue-800">94.5%</div>
                  <div className="text-sm text-blue-600">↑ 2.1% vs last month</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-green-600 font-semibold mb-2">Average Response Time</div>
                  <div className="text-3xl font-bold text-green-800">18min</div>
                  <div className="text-sm text-green-600">↓ 12% vs last month</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="text-purple-600 font-semibold mb-2">Customer Satisfaction</div>
                  <div className="text-3xl font-bold text-purple-800">4.7/5</div>
                  <div className="text-sm text-purple-600">↑ 0.2 vs last month</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="text-white/90 text-sm">
            Logged in as: <span className="font-semibold text-white">{user.name}</span> 
            ({user.role}) • {user.email}
          </div>
        </div>
      </div>
    </div>
  )
}
