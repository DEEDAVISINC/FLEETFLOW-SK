'use client'

import Link from 'next/link'

export default function HomePage() {
  const quickLinks = [
    { href: '/dispatch', bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', emoji: '🚛', title: 'Dispatch Central', color: 'white' },
    { href: '/drivers', bg: 'linear-gradient(135deg, #f7c52d, #f4a832)', emoji: '🚛', title: 'Driver Management', color: '#2d3748' },
    { href: '/vehicles', bg: 'linear-gradient(135deg, #14b8a6, #0d9488)', emoji: '🚚', title: 'Fleet Management', color: 'white' },
    { href: '/broker', bg: 'linear-gradient(135deg, #f97316, #ea580c)', emoji: '🏢', title: 'Broker Box', color: 'white' },
    { href: '/routes', bg: 'linear-gradient(135deg, #14b8a6, #0d9488)', emoji: '🗺️', title: 'Route Optimization', color: 'white' },
    { href: '/analytics', bg: 'linear-gradient(135deg, #6366f1, #4f46e5)', emoji: '📊', title: 'Analytics', color: 'white' },
    { href: '/accounting', bg: 'linear-gradient(135deg, #059669, #047857)', emoji: '💰', title: 'Accounting', color: 'white' },
    { href: '/notes', bg: 'linear-gradient(135deg, #fef3c7, #fbbf24)', emoji: '🔔', title: 'Notification Hub', color: '#2d3748' },
    { href: '/quoting', bg: 'linear-gradient(135deg, #10b981, #059669)', emoji: '💰', title: 'Freight Quoting', color: 'white' },
    { href: '/compliance', bg: 'linear-gradient(135deg, #dc2626, #b91c1c)', emoji: '✅', title: 'Compliance', color: 'white' },
    { href: '/shippers', bg: 'linear-gradient(135deg, #667eea, #764ba2)', emoji: '🏢', title: 'Shipper Portfolio', color: 'white' },
    { href: '/scheduling', bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', emoji: '📅', title: 'Scheduling', color: 'white' },
    { href: '/ai-flow', bg: 'linear-gradient(135deg, #ec4899, #db2777)', emoji: '🤖', title: 'AI Flow', color: 'white', size: 'small' }
  ]

  const loads = [
    { 
      id: 'LD001', 
      origin: 'Los Angeles, CA', 
      destination: 'Phoenix, AZ', 
      weight: '42,000 lbs', 
      rate: '$2,850', 
      status: 'Available',
      driver: 'Unassigned',
      pickup: '2025-07-15',
      delivery: '2025-07-16',
      customer: 'Walmart Distribution',
      miles: '372',
      profit: '$1,420'
    },
    { 
      id: 'LD002', 
      origin: 'Dallas, TX', 
      destination: 'Atlanta, GA', 
      weight: '38,500 lbs', 
      rate: '$3,200', 
      status: 'In Transit',
      driver: 'Mike Johnson',
      pickup: '2025-07-13',
      delivery: '2025-07-15',
      customer: 'Home Depot Supply',
      miles: '781',
      profit: '$1,850'
    },
    { 
      id: 'LD003', 
      origin: 'Chicago, IL', 
      destination: 'Denver, CO', 
      weight: '45,000 lbs', 
      rate: '$2,950', 
      status: 'Delivered',
      driver: 'Sarah Williams',
      pickup: '2025-07-10',
      delivery: '2025-07-12',
      customer: 'Amazon Logistics',
      miles: '920',
      profit: '$1,680'
    }
  ]

  return (
    <div style={{ 
      padding: '40px', 
      background: 'linear-gradient(135deg, #1a1b2e, #16213e)', 
      minHeight: '100vh',
      color: 'white' 
    }}>
      <h1 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '40px' }}>
        🚛 FleetFlow Executive Dashboard
      </h1>

      {/* Executive KPIs */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '30px',
        marginBottom: '40px'
      }}>
        <h2 style={{ 
          fontSize: '1.8rem', 
          marginBottom: '30px',
          textAlign: 'center',
          color: 'white',
          fontWeight: '700'
        }}>
          📊 Executive Operations Dashboard
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {[
            { label: 'Active Loads', value: '247', trend: '+12%', emoji: '📦', color: '#3b82f6', detail: '32 urgent, 89 in-transit' },
            { label: 'Fleet Utilization', value: '87%', trend: '+5%', emoji: '🚛', color: '#10b981', detail: '156/180 vehicles active' },
            { label: 'Revenue (MTD)', value: '$2.4M', trend: '+18%', emoji: '💵', color: '#22c55e', detail: 'Target: $2.8M' },
            { label: 'Driver Satisfaction', value: '94%', trend: '+2%', emoji: '⭐', color: '#f59e0b', detail: 'Based on 180 surveys' },
            { label: 'On-Time Delivery', value: '96.2%', trend: '+1.8%', emoji: '⏰', color: '#8b5cf6', detail: 'Industry avg: 91%' },
            { label: 'Customer Rating', value: '4.8/5', trend: '+0.1', emoji: '🌟', color: '#f97316', detail: '1,247 reviews' }
          ].map((stat, index) => (
            <div key={index} style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(20px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '25px',
              textAlign: 'left',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)'
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div style={{ fontSize: '2.5rem' }}>{stat.emoji}</div>
                <div style={{ 
                  fontSize: '0.8rem', 
                  color: stat.trend.includes('+') ? '#22c55e' : '#ef4444',
                  background: stat.trend.includes('+') ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontWeight: '600'
                }}>
                  {stat.trend}
                </div>
              </div>
              <div style={{ 
                fontSize: '2.2rem', 
                fontWeight: '800', 
                color: stat.color,
                marginBottom: '8px'
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '8px', fontWeight: '600' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '0.85rem', opacity: 0.7, lineHeight: '1.4' }}>
                {stat.detail}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Flow Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '20px',
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          marginBottom: '20px',
          color: 'white'
        }}>
          🎯 AI Flow Quick Access
        </h2>
        
        <div style={{
          background: 'linear-gradient(135deg, #ec4899, #db2777)',
          borderRadius: '12px',
          padding: '25px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          maxWidth: '600px',
          margin: '0 auto'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(236, 72, 153, 0.4)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}
        onClick={() => window.location.href = '/ai-flow'}
        >
          <div style={{ fontSize: '3rem' }}>🤖</div>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ 
              fontSize: '1.4rem', 
              fontWeight: '600', 
              marginBottom: '8px',
              color: 'white'
            }}>
              AI Flow - Intelligent Automation Hub
            </h3>
            <p style={{ 
              fontSize: '1rem', 
              opacity: 0.9, 
              margin: 0,
              color: 'rgba(255, 255, 255, 0.9)'
            }}>
              Advanced AI workflows, load matching, and intelligent dispatch automation
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links Grid */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '20px',
        marginBottom: '40px'
      }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          marginBottom: '20px',
          textAlign: 'center',
          color: 'white'
        }}>
          ⚡ Quick Navigation
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '15px'
        }}>
          {quickLinks.map((link, index) => (
            <Link key={index} href={link.href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: link.bg,
                borderRadius: '10px',
                padding: link.size === 'small' ? '12px' : '18px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                minWidth: link.size === 'small' ? '110px' : '140px',
                height: link.size === 'small' ? '45px' : '55px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
              >
                <div style={{ 
                  fontSize: link.size === 'small' ? '1rem' : '1.3rem', 
                  marginBottom: '5px' 
                }}>
                  {link.emoji}
                </div>
                <div style={{ 
                  fontSize: link.size === 'small' ? '0.7rem' : '0.8rem', 
                  fontWeight: '600', 
                  color: link.color,
                  lineHeight: '1.2'
                }}>
                  {link.title}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Enhanced Load Board */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '32px',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: 'white',
            margin: 0
          }}>
            🚛 Executive Load Management
          </h2>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
            >
              + Add Load
            </button>
            <button style={{
              background: 'linear-gradient(135deg, #ec4899, #db2777)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(236, 72, 153, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
            >
              🤖 AI Match
            </button>
          </div>
        </div>

        {/* Live Status Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '30px',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', color: '#3b82f6', fontWeight: '800', marginBottom: '8px' }}>
              {loads.filter(load => load.status === 'Available').length}
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600' }}>Available</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', color: '#10b981', fontWeight: '800', marginBottom: '8px' }}>
              {loads.filter(load => load.status === 'In Transit').length}
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600' }}>In Transit</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', color: '#22c55e', fontWeight: '800', marginBottom: '8px' }}>
              {loads.filter(load => load.status === 'Delivered').length}
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600' }}>Delivered</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', color: '#f59e0b', fontWeight: '800', marginBottom: '8px' }}>
              ${loads.reduce((sum, load) => sum + parseInt(load.profit.replace('$', '').replace(',', '')), 0).toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600' }}>Total Profit</div>
          </div>
        </div>

        {/* Load Board Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '100px 2fr 2fr 120px 120px 100px 120px',
          gap: '15px',
          padding: '16px 20px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          marginBottom: '16px',
          fontWeight: '700',
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '13px',
          textTransform: 'uppercase',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div>Load ID</div>
          <div>Origin → Destination</div>
          <div>Customer</div>
          <div>Rate</div>
          <div>Profit</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {/* Load Rows */}
        {loads.map((load, index) => (
          <div key={index} style={{
            display: 'grid',
            gridTemplateColumns: '100px 2fr 2fr 120px 120px 100px 120px',
            gap: '15px',
            padding: '18px 20px',
            background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            marginBottom: '8px',
            color: 'white',
            fontSize: '14px',
            transition: 'all 0.3s ease',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = index % 2 === 0 ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.05)'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
          >
            <div style={{ 
              fontWeight: '700', 
              color: '#3b82f6',
              background: 'rgba(59, 130, 246, 0.2)',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              textAlign: 'center'
            }}>
              {load.id}
            </div>
            <div style={{ lineHeight: '1.4' }}>
              <div style={{ fontWeight: '600', marginBottom: '4px', color: 'white' }}>{load.origin}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>→ {load.destination}</div>
            </div>
            <div style={{ 
              fontWeight: '500', 
              fontSize: '13px',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              {load.customer}
            </div>
            <div style={{ 
              fontWeight: '700', 
              color: '#10b981',
              fontSize: '15px',
              background: 'rgba(16, 185, 129, 0.2)',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              textAlign: 'center'
            }}>
              {load.rate}
            </div>
            <div style={{ 
              fontWeight: '700', 
              color: '#f59e0b',
              background: 'rgba(245, 158, 11, 0.2)',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              textAlign: 'center'
            }}>
              {load.profit}
            </div>
            <div>
              <span style={{
                padding: '6px 10px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '700',
                background: 
                  load.status === 'Available' ? 'rgba(16, 185, 129, 0.2)' :
                  load.status === 'In Transit' ? 'rgba(59, 130, 246, 0.2)' :
                  load.status === 'Delivered' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                color: 
                  load.status === 'Available' ? '#10b981' :
                  load.status === 'In Transit' ? '#3b82f6' :
                  load.status === 'Delivered' ? '#10b981' : 'rgba(255, 255, 255, 0.8)',
                textTransform: 'uppercase',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                {load.status}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {load.status === 'Available' && (
                <button style={{
                  padding: '6px 12px',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                >
                  Assign
                </button>
              )}
              {load.status === 'In Transit' && (
                <button style={{
                  padding: '6px 12px',
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                >
                  Track
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Summary Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '20px',
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#10b981', fontWeight: '800' }}>
              ${loads.reduce((sum, load) => sum + parseInt(load.profit.replace('$', '').replace(',', '')), 0).toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600' }}>Total Profit</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#3b82f6', fontWeight: '800' }}>
              {loads.filter(load => load.status === 'Available').length}
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600' }}>Available</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#8b5cf6', fontWeight: '800' }}>
              {loads.reduce((sum, load) => sum + parseInt(load.miles), 0).toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600' }}>Total Miles</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        marginTop: '20px',
        padding: '16px',
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '0.9rem'
      }}>
        <p style={{ margin: 0 }}>
          🌟 FleetFlow TMS - Executive Transportation Management System
        </p>
      </div>
    </div>
  )
}
