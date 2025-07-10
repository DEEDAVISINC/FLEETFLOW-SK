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

  const stats = [
    { label: 'Active Loads', value: '24', color: '#3b82f6', emoji: '📦' },
    { label: 'Available Drivers', value: '8', color: '#10b981', emoji: '👨‍💼' },
    { label: 'Fleet Vehicles', value: '32', color: '#8b5cf6', emoji: '🚛' },
    { label: 'Revenue (MTD)', value: '$145K', color: '#22c55e', emoji: '💵' }
  ]

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '80px 20px 20px 20px'
    }}>
      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
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
                  borderRadius: '10px',
                  padding: '16px 14px',
                  color: link.color,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  height: '80px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backdropFilter: 'blur(5px)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '28px' }}>{link.emoji}</div>
                  <h3 style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    margin: 0,
                    textShadow: link.color === 'white' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                  }}>
                    {link.title}
                  </h3>
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
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr 2fr 1fr 1fr 1fr 120px',
            gap: '12px',
            padding: '12px 16px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            marginBottom: '16px',
            fontWeight: '600',
            fontSize: '14px',
            color: 'white'
          }}>
            <div>Load ID</div>
            <div>Origin</div>
            <div>Destination</div>
            <div>Rate</div>
            <div>Miles</div>
            <div>Pickup</div>
            <div>Status</div>
          </div>

          {[
            { id: 'LD-2024-001', origin: 'Los Angeles, CA', dest: 'Chicago, IL', rate: '$3,450', miles: '2,015', pickup: 'Jan 15', status: 'Available', statusColor: '#22c55e' },
            { id: 'LD-2024-002', origin: 'Houston, TX', dest: 'Atlanta, GA', rate: '$2,180', miles: '789', pickup: 'Jan 16', status: 'Assigned', statusColor: '#3b82f6' },
            { id: 'LD-2024-003', origin: 'Phoenix, AZ', dest: 'Denver, CO', rate: '$1,950', miles: '602', pickup: 'Jan 17', status: 'Available', statusColor: '#22c55e' }
          ].map((load, index) => (
            <div key={index} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr 2fr 1fr 1fr 1fr 120px',
              gap: '12px',
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '8px',
              marginBottom: '8px',
              fontSize: '14px',
              color: '#1f2937',
              cursor: 'pointer'
            }}>
              <div style={{ fontWeight: '600', color: '#3b82f6' }}>{load.id}</div>
              <div>📍 {load.origin}</div>
              <div>🎯 {load.dest}</div>
              <div style={{ fontWeight: '600', color: '#059669' }}>{load.rate}</div>
              <div>{load.miles} mi</div>
              <div>{load.pickup}</div>
              <div>
                <span style={{
                  background: load.statusColor,
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {load.status}
                </span>
              </div>
            </div>
          ))}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '20px',
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px'
          }}>
            <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
              📊 Showing 3 of 24 available loads
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link href="/dispatch" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  📋 View All Loads
                </button>
              </Link>
              <Link href="/drivers" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'linear-gradient(135deg, #f7c52d, #f4a832)',
                  color: '#2d3748',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  🚛 Find Drivers
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Brief Section - Fleet Resources */}
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
            ⚡ Quick Brief - Fleet Resources
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {/* Available Vehicles */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#14b8a6',
                margin: '0 0 16px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                🚚 Available Vehicles (8)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { id: 'TRK-001', type: 'Freightliner Cascadia', location: 'Atlanta, GA' },
                  { id: 'TRK-005', type: 'Kenworth T680', location: 'Houston, TX' },
                  { id: 'TRK-012', type: 'Volvo VNL', location: 'Phoenix, AZ' }
                ].map((vehicle, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    background: 'rgba(20, 184, 166, 0.1)',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}>
                    <span style={{ fontWeight: '600', color: '#0f766e' }}>{vehicle.id}</span>
                    <span style={{ color: '#374151', fontSize: '12px' }}>{vehicle.location}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Drivers */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#f59e0b',
                margin: '0 0 16px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                👨‍💼 Available Drivers (5)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { name: 'John Martinez', cdl: 'Class A', hours: '8h available' },
                  { name: 'Sarah Johnson', cdl: 'Class A', hours: '10h available' },
                  { name: 'Mike Thompson', cdl: 'Class A', hours: '7h available' }
                ].map((driver, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}>
                    <span style={{ fontWeight: '600', color: '#d97706' }}>{driver.name}</span>
                    <span style={{ color: '#374151', fontSize: '12px' }}>{driver.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Equipment Status */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#8b5cf6',
                margin: '0 0 16px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                🔧 Equipment Status
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { type: 'Dry Van Trailers', available: '12', total: '15' },
                  { type: 'Refrigerated Units', available: '4', total: '6' },
                  { type: 'Flatbed Trailers', available: '3', total: '4' }
                ].map((equipment, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    background: 'rgba(139, 92, 246, 0.1)',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}>
                    <span style={{ fontWeight: '600', color: '#7c3aed' }}>{equipment.type}</span>
                    <span style={{ color: '#374151', fontSize: '12px' }}>{equipment.available}/{equipment.total}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Dashboard Stats */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '32px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            📊 Live Dashboard
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {stats.map((stat, index) => (
              <div key={index} style={{
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
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#6b7280', 
                      margin: '0 0 8px 0',
                      fontWeight: '500'
                    }}>
                      {stat.label}
                    </p>
                    <p style={{ 
                      fontSize: '36px', 
                      fontWeight: 'bold', 
                      color: stat.color, 
                      margin: 0,
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}>
                      {stat.value}
                    </p>
                  </div>
                  <div style={{ 
                    fontSize: '48px',
                    opacity: 0.8,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }}>
                    {stat.emoji}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '32px',
          padding: '24px',
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '14px'
        }}>
          <p style={{ margin: 0 }}>
            🌟 FleetFlow TMS - Streamlining logistics operations with cutting-edge technology
          </p>
        </div>
      </main>
    </div>
  )
}
