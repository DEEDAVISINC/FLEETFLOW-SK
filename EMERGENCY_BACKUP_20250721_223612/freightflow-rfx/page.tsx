'use client'

import { useState } from 'react'

export default function FreightFlowRFx() {
  const [activeTab, setActiveTab] = useState('active')

  const rfxRequests = [
    {
      id: 'RFX001',
      customer: 'Walmart Distribution',
      origin: 'Los Angeles, CA',
      destination: 'Phoenix, AZ',
      weight: '42,000 lbs',
      equipment: 'Dry Van',
      bidDeadline: '2025-01-20 14:00',
      status: 'Active',
      currentBids: 8,
      estimatedRate: '$2,800 - $3,200',
      urgency: 'High',
      specialRequirements: 'Temperature controlled, Liftgate required'
    },
    {
      id: 'RFX002',
      customer: 'Home Depot Supply',
      origin: 'Dallas, TX',
      destination: 'Atlanta, GA',
      weight: '38,500 lbs',
      equipment: 'Flatbed',
      bidDeadline: '2025-01-21 16:00',
      status: 'Active',
      currentBids: 12,
      estimatedRate: '$3,000 - $3,500',
      urgency: 'Medium',
      specialRequirements: 'Oversized load, Escort required'
    },
    {
      id: 'RFX003',
      customer: 'Amazon Logistics',
      origin: 'Chicago, IL',
      destination: 'Denver, CO',
      weight: '45,000 lbs',
      equipment: 'Reefer',
      bidDeadline: '2025-01-19 12:00',
      status: 'Closed',
      currentBids: 15,
      estimatedRate: '$2,900 - $3,300',
      urgency: 'Low',
      specialRequirements: 'Frozen goods, -10°F required'
    }
  ]

  const myBids = [
    {
      rfxId: 'RFX001',
      customer: 'Walmart Distribution',
      myBid: '$2,950',
      rank: 3,
      totalBids: 8,
      status: 'Submitted',
      submittedAt: '2025-01-18 10:30'
    },
    {
      rfxId: 'RFX002',
      customer: 'Home Depot Supply',
      myBid: '$3,150',
      rank: 1,
      totalBids: 12,
      status: 'Leading',
      submittedAt: '2025-01-18 14:15'
    }
  ]

  return (
    <div style={{ 
      padding: '40px', 
      paddingTop: '100px',
      background: 'linear-gradient(135deg, #1a1b2e, #16213e)', 
      minHeight: '100vh',
      color: 'white' 
    }}>
      <h1 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '30px' }}>
        📋 FreightFlow RFx Management
      </h1>

      {/* Header Stats */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          {[
            { label: 'Active RFx', value: '24', color: '#10b981', icon: '📋' },
            { label: 'My Bids', value: '8', color: '#3b82f6', icon: '💰' },
            { label: 'Win Rate', value: '67%', color: '#22c55e', icon: '🏆' },
            { label: 'Avg Response', value: '2.3h', color: '#f59e0b', icon: '⏰' }
          ].map((stat, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '10px',
              padding: '15px',
              textAlign: 'center',
              border: `1px solid ${stat.color}40`
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '700', color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {[
            { id: 'active', label: 'Active RFx', icon: '📋', color: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
            { id: 'my-bids', label: 'My Bids', icon: '💰', color: 'linear-gradient(135deg, #10b981, #059669)' },
            { id: 'closed', label: 'Closed', icon: '✅', color: 'linear-gradient(135deg, #6366f1, #4f46e5)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id 
                  ? tab.color
                  : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: activeTab === tab.id 
                  ? '0 8px 25px rgba(0, 0, 0, 0.3)' 
                  : '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Active RFx Content */}
        {activeTab === 'active' && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '70px 1.2fr 1fr 100px 80px 90px 80px 90px',
              gap: '8px',
              padding: '10px 12px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              marginBottom: '10px',
              fontWeight: '700',
              fontSize: '10px',
              textTransform: 'uppercase'
            }}>
              <div>ID</div>
              <div>Route</div>
              <div>Customer</div>
              <div>Deadline</div>
              <div>Bids</div>
              <div>Rate Range</div>
              <div>Urgency</div>
              <div>Actions</div>
            </div>

            {rfxRequests.filter(rfx => rfx.status === 'Active').map((rfx, index) => (
              <div key={index} style={{
                display: 'grid',
                gridTemplateColumns: '70px 1.2fr 1fr 100px 80px 90px 80px 90px',
                gap: '8px',
                padding: '10px 12px',
                background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                borderRadius: '8px',
                marginBottom: '8px',
                fontSize: '11px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = index % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)'
              }}
              >
                <div style={{ fontWeight: '700', color: '#60a5fa' }}>{rfx.id}</div>
                <div>
                  <div style={{ fontWeight: '600' }}>{rfx.origin}</div>
                  <div style={{ fontSize: '10px', opacity: 0.7 }}>→ {rfx.destination}</div>
                </div>
                <div style={{ fontSize: '11px' }}>{rfx.customer}</div>
                <div style={{ fontSize: '10px', color: '#f59e0b' }}>{rfx.bidDeadline}</div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    color: '#3b82f6',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px'
                  }}>
                    {rfx.currentBids} bids
                  </span>
                </div>
                <div style={{ fontSize: '10px', color: '#22c55e' }}>{rfx.estimatedRate}</div>
                <div>
                  <span style={{
                    background: rfx.urgency === 'High' ? 'rgba(239, 68, 68, 0.2)' : 
                              rfx.urgency === 'Medium' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                    color: rfx.urgency === 'High' ? '#ef4444' : 
                           rfx.urgency === 'Medium' ? '#f59e0b' : '#22c55e',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: '600'
                  }}>
                    {rfx.urgency}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button style={{
                    padding: '3px 6px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '8px',
                    fontWeight: '600'
                  }}>
                    Bid
                  </button>
                  <button style={{
                    padding: '3px 6px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '8px'
                  }}>
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* My Bids Content */}
        {activeTab === 'my-bids' && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '80px 1.2fr 90px 70px 90px 100px 90px',
              gap: '8px',
              padding: '10px 12px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              marginBottom: '10px',
              fontWeight: '700',
              fontSize: '10px',
              textTransform: 'uppercase'
            }}>
              <div>RFx ID</div>
              <div>Customer</div>
              <div>My Bid</div>
              <div>Rank</div>
              <div>Total Bids</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {myBids.map((bid, index) => (
              <div key={index} style={{
                display: 'grid',
                gridTemplateColumns: '80px 1.2fr 90px 70px 90px 100px 90px',
                gap: '8px',
                padding: '10px 12px',
                background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                borderRadius: '8px',
                marginBottom: '8px',
                fontSize: '11px'
              }}>
                <div style={{ fontWeight: '700', color: '#60a5fa' }}>{bid.rfxId}</div>
                <div style={{ fontSize: '11px' }}>{bid.customer}</div>
                <div style={{ fontWeight: '700', color: '#22c55e' }}>{bid.myBid}</div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{
                    background: bid.rank === 1 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: bid.rank === 1 ? '#22c55e' : '#f59e0b',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: '600'
                  }}>
                    #{bid.rank}
                  </span>
                </div>
                <div style={{ textAlign: 'center', fontSize: '10px' }}>{bid.totalBids} bids</div>
                <div>
                  <span style={{
                    background: bid.status === 'Leading' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                    color: bid.status === 'Leading' ? '#22c55e' : '#3b82f6',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: '600'
                  }}>
                    {bid.status}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '3px' }}>
                  <button style={{
                    padding: '3px 6px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '8px'
                  }}>
                    Edit
                  </button>
                  <button style={{
                    padding: '3px 6px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '8px'
                  }}>
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Closed RFx Content */}
        {activeTab === 'closed' && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '70px 1.2fr 1fr 100px 90px 90px 100px',
              gap: '8px',
              padding: '10px 12px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              marginBottom: '10px',
              fontWeight: '700',
              fontSize: '10px',
              textTransform: 'uppercase'
            }}>
              <div>ID</div>
              <div>Route</div>
              <div>Customer</div>
              <div>Closed</div>
              <div>Winner</div>
              <div>Final Rate</div>
              <div>Result</div>
            </div>

            {rfxRequests.filter(rfx => rfx.status === 'Closed').map((rfx, index) => (
              <div key={index} style={{
                display: 'grid',
                gridTemplateColumns: '70px 1.2fr 1fr 100px 90px 90px 100px',
                gap: '8px',
                padding: '10px 12px',
                background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                borderRadius: '8px',
                marginBottom: '8px',
                fontSize: '11px'
              }}>
                <div style={{ fontWeight: '700', color: '#60a5fa' }}>{rfx.id}</div>
                <div>
                  <div style={{ fontWeight: '600' }}>{rfx.origin}</div>
                  <div style={{ fontSize: '10px', opacity: 0.7 }}>→ {rfx.destination}</div>
                </div>
                <div style={{ fontSize: '11px' }}>{rfx.customer}</div>
                <div style={{ fontSize: '10px', color: '#f59e0b' }}>{rfx.bidDeadline}</div>
                <div style={{ fontSize: '10px', color: '#8b5cf6' }}>ABC Trucking</div>
                <div style={{ fontSize: '10px', color: '#22c55e' }}>$2,950</div>
                <div>
                  <span style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: '600'
                  }}>
                    Lost
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '15px', color: 'white' }}>
          ⚡ Quick Actions
        </h3>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            🔍 Search RFx
          </button>
          <button style={{
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            📊 Analytics
          </button>
          <button style={{
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            🤖 AI Bid Assistant
          </button>
        </div>
      </div>
    </div>
  )
} 