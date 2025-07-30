'use client'

import Link from 'next/link'

export default function HomePage() {
  // Safe data arrays - no complex objects
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
    { label: 'Active Loads', value: '24', emoji: '📦' },
    { label: 'Available Drivers', value: '8', emoji: '👨‍💼' },
    { label: 'Fleet Vehicles', value: '32', emoji: '🚛' },
    { label: 'Revenue (MTD)', value: '$145K', emoji: '💵' }
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

        {/* Quick Access Navigation - Simplified */}
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
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center',
                  color: link.color,
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  height: '80px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '180px'
                }}>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>
                    {link.emoji}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    lineHeight: '1.2',
                    textAlign: 'center'
                  }}>
                    {link.title}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Overview - Simplified */}
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
            📊 Real-time Statistics
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {stats.map((stat, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center',
                transition: 'transform 0.2s ease',
                cursor: 'pointer'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}>
                  <div>
                    <h3 style={{
                      color: '#6b7280',
                      fontSize: '16px',
                      fontWeight: '500',
                      margin: '0 0 8px 0'
                    }}>
                      {stat.label}
                    </h3>
                    <p style={{
                      color: '#3b82f6',
                      fontSize: '32px',
                      fontWeight: 'bold',
                      margin: 0
                    }}>
                      {stat.value}
                    </p>
                  </div>
                  <div style={{ 
                    fontSize: '48px',
                    opacity: 0.8
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
