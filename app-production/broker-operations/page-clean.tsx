'use client';

import React, { useState } from 'react';
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

        {/* RFx Response Center Tab */}
        {activeTab === 'rfx' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 16px 0',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)'
            }}>📋 FreightFlow RFx Response Center</h2>
            <p style={{
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.8)',
              margin: 0
            }}>Advanced RFx response management system with live market intelligence coming soon!</p>
          </div>
        )}

        {/* Shipper Management Tab */}
        {activeTab === 'shippers' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 16px 0',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)'
            }}>🏢 Shipper Management</h2>
            <p style={{
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.8)',
              margin: 0
            }}>Comprehensive shipper relationship management tools coming soon!</p>
          </div>
        )}

        {/* Quick Quotes Tab */}
        {activeTab === 'quotes' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 16px 0',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)'
            }}>💰 Quick Quotes</h2>
            <p style={{
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.8)',
              margin: 0
            }}>Instant quote generation and pricing tools coming soon!</p>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 16px 0',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)'
            }}>📈 Performance Analytics</h2>
            <p style={{
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.8)',
              margin: 0
            }}>Advanced analytics and performance insights coming soon!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default BrokerOperationsPage;
