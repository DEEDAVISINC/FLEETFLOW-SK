'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { freightNetworkService, NetworkLoad, NetworkCapacity, NetworkPartner, NetworkMetrics } from '../services/FreightNetworkService'

export default function FreightNetworkPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'loads' | 'capacity' | 'partners' | 'analytics'>('overview')
  const [networkData, setNetworkData] = useState<{
    loads: NetworkLoad[]
    capacity: NetworkCapacity[]
    partners: NetworkPartner[]
    metrics: NetworkMetrics | null
  }>({
    loads: [],
    capacity: [],
    partners: [],
    metrics: null
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadNetworkData()
  }, [])

  const loadNetworkData = async () => {
    setIsLoading(true)
    try {
      // For development, use mock data
      const mockData = freightNetworkService.generateMockNetworkData()
      
      // Simulate network metrics
      const mockMetrics: NetworkMetrics = {
        totalLoads: 1247,
        activeCarriers: 89,
        totalRevenue: 485000,
        averageRate: 2850,
        onTimePercentage: 96.5,
        networkUtilization: 78.3,
        revenueGrowth: 23.7,
        carrierSatisfaction: 4.6
      }

      setNetworkData({
        loads: mockData.loads,
        capacity: mockData.capacity,
        partners: mockData.partners,
        metrics: mockMetrics
      })
    } catch (error) {
      console.error('Failed to load network data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      paddingTop: '80px'
    }}>
      {/* Back Button */}
      <div style={{ padding: '24px' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <button style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '16px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <span style={{ marginRight: '8px' }}>←</span>
            Back to Dashboard
          </button>
        </Link>
      </div>

      {/* Main Container */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px 32px'
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px'
              }}>
                <span style={{ fontSize: '32px' }}>🌐</span>
              </div>
              <div>
                <h1 style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 8px 0',
                  textShadow: '0 4px 8px rgba(0,0,0,0.3)'
                }}>
                  FleetFlow Freight Network
                </h1>
                <p style={{
                  fontSize: '18px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: '0'
                }}>
                  Collaborative marketplace connecting carriers, sharing capacity, and optimizing the entire network
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <button style={{
                background: 'rgba(34, 197, 94, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '16px'
              }}>
                📦 Post Load
              </button>
              <button style={{
                background: 'rgba(59, 130, 246, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '16px'
              }}>
                🚛 Share Capacity
              </button>
            </div>
          </div>
        </div>

        {/* Network Metrics Overview */}
        {networkData.metrics && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}>
            <NetworkMetricCard
              icon="📦"
              title="Total Loads"
              value={networkData.metrics.totalLoads.toLocaleString()}
              change="+12.3%"
              positive={true}
            />
            <NetworkMetricCard
              icon="🚛"
              title="Active Carriers"
              value={networkData.metrics.activeCarriers.toString()}
              change="+8.7%"
              positive={true}
            />
            <NetworkMetricCard
              icon="💰"
              title="Network Revenue"
              value={`$${(networkData.metrics.totalRevenue / 1000).toFixed(0)}K`}
              change="+23.7%"
              positive={true}
            />
            <NetworkMetricCard
              icon="⚡"
              title="Utilization"
              value={`${networkData.metrics.networkUtilization}%`}
              change="+5.2%"
              positive={true}
            />
            <NetworkMetricCard
              icon="⭐"
              title="Carrier Rating"
              value={networkData.metrics.carrierSatisfaction.toString()}
              change="+0.3"
              positive={true}
            />
            <NetworkMetricCard
              icon="📈"
              title="On-Time %"
              value={`${networkData.metrics.onTimePercentage}%`}
              change="+1.8%"
              positive={true}
            />
          </div>
        )}

        {/* Navigation Tabs */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '8px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          gap: '8px'
        }}>
          {[
            { id: 'overview', label: 'Network Overview', icon: '🌐' },
            { id: 'loads', label: 'Available Loads', icon: '📦' },
            { id: 'capacity', label: 'Shared Capacity', icon: '🚛' },
            { id: 'partners', label: 'Network Partners', icon: '👥' },
            { id: 'analytics', label: 'Analytics', icon: '📊' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: activeTab === tab.id 
                  ? 'rgba(255, 255, 255, 0.25)' 
                  : 'transparent',
                border: 'none',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: '32px',
          minHeight: '600px'
        }}>
          {activeTab === 'overview' && <NetworkOverviewTab />}
          {activeTab === 'loads' && <AvailableLoadsTab loads={networkData.loads} />}
          {activeTab === 'capacity' && <SharedCapacityTab capacity={networkData.capacity} />}
          {activeTab === 'partners' && <NetworkPartnersTab partners={networkData.partners} />}
          {activeTab === 'analytics' && <NetworkAnalyticsTab />}
        </div>
      </div>
    </div>
  )
}

// Helper Components

function NetworkMetricCard({ icon, title, value, change, positive }: {
  icon: string
  title: string
  value: string
  change: string
  positive: boolean
}) {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
      <div style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'white',
        marginBottom: '4px'
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: '4px'
      }}>
        {title}
      </div>
      <div style={{
        fontSize: '12px',
        color: positive ? '#10b981' : '#ef4444',
        fontWeight: '600'
      }}>
        {change}
      </div>
    </div>
  )
}

function NetworkOverviewTab() {
  return (
    <div>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#374151', marginBottom: '24px' }}>
        🌐 Network Overview
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Network Growth Chart */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid rgba(99, 102, 241, 0.2)'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#6366f1', marginBottom: '16px' }}>
            📈 Network Growth
          </h3>
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#6366f1' }}>+157%</div>
              <div style={{ fontSize: '16px', color: '#6b7280' }}>Growth this quarter</div>
            </div>
          </div>
        </div>

        {/* Network Benefits */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid rgba(16, 185, 129, 0.2)'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981', marginBottom: '16px' }}>
            💡 Network Benefits
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>⚡</span>
              <span style={{ fontSize: '16px', color: '#374151' }}>25% higher truck utilization</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>💰</span>
              <span style={{ fontSize: '16px', color: '#374151' }}>18% average rate increase</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>🌱</span>
              <span style={{ fontSize: '16px', color: '#374151' }}>30% reduction in empty miles</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>🤝</span>
              <span style={{ fontSize: '16px', color: '#374151' }}>Trusted partner network</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: '32px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#374151', marginBottom: '16px' }}>
          🚀 Quick Actions
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <QuickActionCard
            icon="📦"
            title="Post a Load"
            description="Share freight opportunities with the network"
            action="Post Load"
            color="#6366f1"
          />
          <QuickActionCard
            icon="🚛"
            title="Share Capacity"
            description="Offer available truck capacity to partners"
            action="Share Capacity"
            color="#10b981"
          />
          <QuickActionCard
            icon="👥"
            title="Invite Partners"
            description="Grow the network by inviting trusted carriers"
            action="Send Invites"
            color="#f59e0b"
          />
          <QuickActionCard
            icon="📊"
            title="View Analytics"
            description="Track your network performance and earnings"
            action="View Reports"
            color="#8b5cf6"
          />
        </div>
      </div>
    </div>
  )
}

function AvailableLoadsTab({ loads }: { loads: NetworkLoad[] }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#374151' }}>
          📦 Available Network Loads
        </h2>
        <button style={{
          background: '#6366f1',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Filter & Search
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loads.map(load => (
          <LoadCard key={load.id} load={load} />
        ))}
      </div>
    </div>
  )
}

function SharedCapacityTab({ capacity }: { capacity: NetworkCapacity[] }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#374151' }}>
          🚛 Shared Network Capacity
        </h2>
        <button style={{
          background: '#10b981',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Post My Capacity
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {capacity.map(cap => (
          <CapacityCard key={cap.id} capacity={cap} />
        ))}
      </div>
    </div>
  )
}

function NetworkPartnersTab({ partners }: { partners: NetworkPartner[] }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#374151' }}>
          👥 Network Partners
        </h2>
        <button style={{
          background: '#f59e0b',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Invite Partners
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '16px' }}>
        {partners.map(partner => (
          <PartnerCard key={partner.id} partner={partner} />
        ))}
      </div>
    </div>
  )
}

function NetworkAnalyticsTab() {
  return (
    <div>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#374151', marginBottom: '24px' }}>
        📊 Network Analytics
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(99, 102, 241, 0.1))',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid rgba(139, 92, 246, 0.2)'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '16px' }}>
            💰 Revenue Analytics
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#8b5cf6' }}>$127,450</div>
            <div style={{ fontSize: '16px', color: '#6b7280' }}>This Month</div>
            <div style={{ fontSize: '14px', color: '#10b981', marginTop: '8px' }}>+31.2% vs last month</div>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid rgba(16, 185, 129, 0.2)'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981', marginBottom: '16px' }}>
            ⚡ Efficiency Gains
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#10b981' }}>87.3%</div>
            <div style={{ fontSize: '16px', color: '#6b7280' }}>Network Utilization</div>
            <div style={{ fontSize: '14px', color: '#10b981', marginTop: '8px' }}>+12.7% improvement</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Additional Helper Components
function QuickActionCard({ icon, title, description, action, color }: {
  icon: string
  title: string
  description: string
  action: string
  color: string
}) {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.8)',
      borderRadius: '12px',
      padding: '20px',
      border: `1px solid ${color}30`,
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)'
      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)'
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = 'none'
    }}>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>
      <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}>{title}</h4>
      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>{description}</p>
      <button style={{
        background: color,
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer'
      }}>
        {action}
      </button>
    </div>
  )
}

function LoadCard({ load }: { load: NetworkLoad }) {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{ fontSize: '20px' }}>📦</span>
          <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#374151' }}>{load.title}</h4>
          {load.isUrgent && (
            <span style={{
              background: '#ef4444',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              URGENT
            </span>
          )}
        </div>
        <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
          📍 {load.origin} → {load.destination} • {load.distance} miles
        </div>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          📅 Pickup: {new Date(load.pickupDate).toLocaleDateString()} • 
          Weight: {load.weight.toLocaleString()} lbs • Type: {load.loadType}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>${load.rate.toLocaleString()}</div>
        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
          ${(load.rate / load.distance).toFixed(2)}/mile
        </div>
        <button style={{
          background: '#6366f1',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Place Bid
        </button>
      </div>
    </div>
  )
}

function CapacityCard({ capacity }: { capacity: NetworkCapacity }) {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <span style={{ fontSize: '20px' }}>🚛</span>
        <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#374151' }}>{capacity.carrierCompany}</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '14px' }}>⭐</span>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#f59e0b' }}>{capacity.carrierRating}</span>
        </div>
      </div>
      <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
        📍 Current: {capacity.currentLocation}
        {capacity.destination && ` → ${capacity.destination}`}
      </div>
      <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
        📅 Available: {new Date(capacity.availableDate).toLocaleDateString()} • 
        Capacity: {capacity.capacity.toLocaleString()} lbs
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>
          ${capacity.ratePerMile.toFixed(2)}/mile
        </div>
        <button style={{
          background: '#10b981',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Book Capacity
        </button>
      </div>
    </div>
  )
}

function PartnerCard({ partner }: { partner: NetworkPartner }) {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
        <div>
          <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}>
            {partner.companyName}
          </h4>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>{partner.contactPerson}</div>
        </div>
        <div style={{
          background: partner.verificationStatus === 'premium' ? '#8b5cf6' : 
                      partner.verificationStatus === 'verified' ? '#10b981' : '#f59e0b',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          {partner.verificationStatus.toUpperCase()}
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>{partner.rating}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Rating</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#6366f1' }}>{partner.totalLoads}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Loads</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>{partner.onTimePercentage}%</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>On Time</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#8b5cf6' }}>{partner.fleetSize}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Fleet Size</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button style={{
          flex: 1,
          background: '#6366f1',
          color: 'white',
          border: 'none',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          View Profile
        </button>
        <button style={{
          flex: 1,
          background: '#10b981',
          color: 'white',
          border: 'none',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Send Load
        </button>
      </div>
    </div>
  )
}
