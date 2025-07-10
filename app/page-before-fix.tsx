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
    { href: '/scheduling', bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', emoji: '📅', title: 'Scheduling', color: 'white' }
  ]

  const loads = [
    { id: 'FL-001', origin: 'Miami, FL', destination: 'Atlanta, GA', weight: '45,000 lbs', rate: '$1,250', status: 'Available' },
    { id: 'TX-002', origin: 'Houston, TX', destination: 'Dallas, TX', weight: '38,500 lbs', rate: '$950', status: 'Available' },
    { id: 'CA-003', origin: 'Los Angeles, CA', destination: 'Phoenix, AZ', weight: '42,000 lbs', rate: '$1,180', status: 'Available' },
    { id: 'NY-004', origin: 'New York, NY', destination: 'Boston, MA', weight: '35,750 lbs', rate: '$875', status: 'Available' },
    { id: 'IL-005', origin: 'Chicago, IL', destination: 'Detroit, MI', weight: '41,250 lbs', rate: '$1,050', status: 'Available' }
  ]

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '80px 20px 20px 20px'
    }}>
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        
        {/* Welcome Header */}
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
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: 'white',
            margin: '0 0 16px 0',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}>
            🚛 FleetFlow TMS
          </h1>
          <p style={{
            fontSize: '22px',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: '0 0 8px 0',
            fontWeight: '500'
          }}>
            Your comprehensive transportation management solution
          </p>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.7)',
            margin: 0
          }}>
            Streamline operations • Optimize routes • Maximize efficiency
          </p>
        </div>

        {/* Quick Access Navigation */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            🚀 Quick Access
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px'
          }}>
            {quickLinks.map((link, index) => (
              <Link key={index} href={link.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: link.bg,
                  color: link.color,
                  padding: '16px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>{link.emoji}</div>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>{link.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Load Board */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            📋 Available Loads - General Load Board
          </h2>
          
          {/* Load Board Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr 2fr 1fr 1fr 1fr 120px',
            gap: '12px',
            padding: '16px 20px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            marginBottom: '16px',
            fontWeight: '600',
            color: 'white',
            fontSize: '14px'
          }}>
            <div>Load ID</div>
            <div>Origin</div>
            <div>Destination</div>
            <div>Weight</div>
            <div>Rate</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {/* Load Board Rows */}
          {loads.map((load, index) => (
            <div key={index} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr 2fr 1fr 1fr 1fr 120px',
              gap: '12px',
              padding: '16px 20px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              marginBottom: '8px',
              color: 'white',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ fontWeight: '600' }}>{load.id}</div>
              <div>{load.origin}</div>
              <div>{load.destination}</div>
              <div>{load.weight}</div>
              <div style={{ fontWeight: '600', color: '#10b981' }}>{load.rate}</div>
              <div>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: '#10b981',
                  color: 'white'
                }}>
                  {load.status}
                </span>
              </div>
              <div>
                <button style={{
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}>
                  Book Load
                </button>
              </div>
            </div>
          ))}

          {/* Load Board Footer */}
          <div style={{
            textAlign: 'center',
            marginTop: '24px',
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px'
          }}>
            <Link href="/loads" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}>
                View All Available Loads
              </button>
            </Link>
          </div>
        </div>

      </main>
    </div>
  )
}
