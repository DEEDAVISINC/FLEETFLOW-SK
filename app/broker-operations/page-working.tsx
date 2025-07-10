'use client';

import React, { useState, useEffect } from 'react';
import { rfxResponseService } from '../services/RFxResponseService';
import RFxResponseDashboard from '../components/RFxResponseDashboard';
import LiveMarketIntelligence from '../components/LiveMarketIntelligence';

const BrokerOperationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'rfx' | 'shippers' | 'quotes' | 'analytics'>('overview');
  const [user] = useState({ 
    name: 'Alex Rodriguez', 
    role: 'Senior Broker',
    email: 'alex.rodriguez@fleetflow.com'
  });

  // Mock data for broker overview
  const [dashboardData] = useState({
    activeRFx: 12,
    pendingResponses: 4,
    monthlyWinRate: 34.6,
    monthlyRevenue: 285450,
    topShippers: [
      { name: 'Walmart Distribution', loads: 23, revenue: 125000 },
      { name: 'Home Depot Logistics', loads: 18, revenue: 98500 },
      { name: 'Amazon Fulfillment', loads: 15, revenue: 156000 },
    ],
    recentActivity: [
      { type: 'RFQ', shipper: 'Walmart Distribution', status: 'Won', amount: 12500, time: '2 hours ago' },
      { type: 'RFB', shipper: 'Home Depot', status: 'Submitted', amount: 18000, time: '4 hours ago' },
      { type: 'RFP', shipper: 'Amazon', status: 'In Progress', amount: 25000, time: '6 hours ago' },
    ],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Won': 'text-green-600 bg-green-50',
      'Submitted': 'text-blue-600 bg-blue-50',
      'In Progress': 'text-yellow-600 bg-yellow-50',
      'Lost': 'text-red-600 bg-red-50',
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-50';
  };

  const getRFxIcon = (type: string) => {
    const icons = {
      'RFQ': '💰',
      'RFB': '🎯',
      'RFP': '📋',
      'RFI': '❓',
    };
    return icons[type as keyof typeof icons] || '📄';
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '80px 20px 20px 20px'
    }}>
      <main style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '40px 32px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textAlign: 'left'
          }}>
            <div>
              <h1 style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: 'white',
                margin: '0 0 16px 0',
                textShadow: '0 4px 8px rgba(0,0,0,0.3)'
              }}>
                🏢 Broker Operations Center
              </h1>
              <p style={{
                fontSize: '22px',
                color: 'rgba(255, 255, 255, 0.9)',
                margin: '0 0 8px 0',
                fontWeight: '500'
              }}>
                Comprehensive broker tools with intelligent RFx response capabilities
              </p>
              <p style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.7)',
                margin: 0
              }}>
                FreightFlow RFx System • Live Market Intelligence • Competitive Bidding
              </p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              textAlign: 'right'
            }}>
              <p style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'white',
                margin: '0 0 4px 0'
              }}>{user.name}</p>
              <p style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0
              }}>{user.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '32px',
          justifyContent: 'center'
        }}>
          {[
            { key: 'overview', label: 'Overview', icon: '📊' },
            { key: 'rfx', label: 'FreightFlow RFx Center', icon: '📋' },
            { key: 'shippers', label: 'Shipper Management', icon: '🏢' },
            { key: 'quotes', label: 'Quick Quotes', icon: '💰' },
            { key: 'analytics', label: 'Performance', icon: '📈' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                background: activeTab === tab.key
                  ? 'rgba(255, 255, 255, 0.25)'
                  : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: activeTab === tab.key
                  ? '2px solid rgba(255, 255, 255, 0.4)'
                  : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                transform: activeTab === tab.key ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Key Metrics */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '24px',
                textAlign: 'center'
              }}>📊 Broker Performance Metrics</h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px'
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0', fontWeight: '500' }}>Active RFx Requests</p>
                      <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#3b82f6', margin: '0', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>{dashboardData.activeRFx}</p>
                    </div>
                    <div style={{ fontSize: '48px', opacity: '0.8', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>📥</div>
                  </div>
                  <p style={{ fontSize: '12px', color: '#3b82f6', margin: '8px 0 0 0', fontWeight: '600' }}>🔥 {dashboardData.pendingResponses} pending responses</p>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0', fontWeight: '500' }}>Win Rate (30 days)</p>
                      <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#10b981', margin: '0', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>{dashboardData.monthlyWinRate}%</p>
                    </div>
                    <div style={{ fontSize: '48px', opacity: '0.8', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>🏆</div>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0', fontWeight: '500' }}>Monthly Revenue</p>
                      <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#8b5cf6', margin: '0', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>{formatCurrency(dashboardData.monthlyRevenue)}</p>
                    </div>
                    <div style={{ fontSize: '48px', opacity: '0.8', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>💰</div>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0', fontWeight: '500' }}>Avg. Response Time</p>
                      <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#f59e0b', margin: '0', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>2.4h</p>
                    </div>
                    <div style={{ fontSize: '48px', opacity: '0.8', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>⚡</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '24px',
                textAlign: 'center'
              }}>🚀 Quick Actions</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}>
                <button 
                  onClick={() => setActiveTab('rfx')}
                  style={{
                    background: 'linear-gradient(135deg, #e11d48, #be185d)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'center'
                  }}
                >
                  📋 FreightFlow RFx Center
                </button>
                <button 
                  onClick={() => setActiveTab('shippers')}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'center'
                  }}
                >
                  🏢 Manage Shippers
                </button>
                <button 
                  onClick={() => setActiveTab('analytics')}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'center'
                  }}
                >
                  📈 View Analytics
                </button>
              </div>
            </div>
          </div>
        )}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl hover:shadow-lg transition-all text-left"
                >
                  <div className="text-3xl mb-2">📋</div>
                  <h4 className="text-lg font-semibold mb-1">RFx Response Center</h4>
                  <p className="text-blue-100 text-sm">Generate intelligent responses to RFB, RFQ, RFP, and RFI requests</p>
                </button>

                <button 
                  onClick={() => setActiveTab('quotes')}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl hover:shadow-lg transition-all text-left"
                >
                  <div className="text-3xl mb-2">💰</div>
                  <h4 className="text-lg font-semibold mb-1">Quick Quote Generator</h4>
                  <p className="text-green-100 text-sm">Fast competitive quotes with live market rates</p>
                </button>

                <button 
                  onClick={() => setActiveTab('shippers')}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl hover:shadow-lg transition-all text-left"
                >
                  <div className="text-3xl mb-2">🏢</div>
                  <h4 className="text-lg font-semibold mb-1">Shipper Relationship Hub</h4>
                  <p className="text-purple-100 text-sm">Manage shipper relationships and opportunities</p>
                </button>
              </div>
            </div>

            {/* Recent Activity & Top Shippers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Recent Activity</h3>
                <div className="space-y-4">
                  {dashboardData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getRFxIcon(activity.type)}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {activity.type} - {activity.shipper}
                          </p>
                          <p className="text-xs text-gray-600">{activity.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {formatCurrency(activity.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Shippers */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Top Shippers (30 days)</h3>
                <div className="space-y-4">
                  {dashboardData.topShippers.map((shipper, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{shipper.name}</p>
                          <p className="text-xs text-gray-600">{shipper.loads} loads</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(shipper.revenue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Market Intelligence Preview */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">🔥 Market Intelligence Preview</h3>
                <button 
                  onClick={() => setActiveTab('rfx')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Full Intelligence →
                </button>
              </div>
              <LiveMarketIntelligence />
            </div>
          </div>
        )}

        {/* RFx Response Center Tab */}
        {activeTab === 'rfx' && (
          <RFxResponseDashboard />
        )}

        {/* Shipper Management Tab */}
        {activeTab === 'shippers' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🏢 Shipper Management</h3>
            <p className="text-gray-600 mb-6">
              Comprehensive shipper relationship management with RFx opportunity tracking.
            </p>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏢</div>
              <p className="text-lg text-gray-600 mb-4">Shipper management integration coming soon</p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Setup Shipper Integration
              </button>
            </div>
          </div>
        )}

        {/* Quick Quotes Tab */}
        {activeTab === 'quotes' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Quick Quote Generator</h3>
            <p className="text-gray-600 mb-6">
              Generate competitive quotes instantly with live market intelligence and automated pricing.
            </p>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💰</div>
              <p className="text-lg text-gray-600 mb-4">Quick quote system integration coming soon</p>
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                Setup Quote Generator
              </button>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Performance Analytics</h3>
            <p className="text-gray-600 mb-6">
              Comprehensive analytics on RFx performance, win rates, and revenue optimization.
            </p>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📈</div>
              <p className="text-lg text-gray-600 mb-4">Advanced analytics dashboard coming soon</p>
              <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                Setup Analytics
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrokerOperationsPage;
