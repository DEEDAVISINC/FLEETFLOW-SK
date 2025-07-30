'use client'

import Link from 'next/link'

export default function HomePage() {
  const quickLinks = [
    { href: '/dispatch', bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', emoji: '🚛', title: 'Dispatch Central', color: 'white' },
    { href: '/drivers', bg: 'linear-gradient(135deg, #f7c52d, #f4a832)', emoji: '🚛', title: 'Driver Management', color: '#2d3748' },
    { href: '/vehicles', bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', emoji: '🚚', title: 'Fleet Management', color: 'white' },
    { href: '/broker', bg: 'linear-gradient(135deg, #f97316, #ea580c)', emoji: '🏢', title: 'Broker Box', color: 'white' },
    { href: '/routes', bg: 'linear-gradient(135deg, #14b8a6, #0d9488)', emoji: '🗺️', title: 'Route Optimization', color: 'white' },
    { href: '/analytics', bg: 'linear-gradient(135deg, #6366f1, #4f46e5)', emoji: '📊', title: 'Analytics', color: 'white' },
    { href: '/quoting', bg: 'linear-gradient(135deg, #22c55e, #16a34a)', emoji: '💰', title: 'Freight Quoting', color: 'white' },
    { href: '/compliance', bg: 'linear-gradient(135deg, #dc2626, #b91c1c)', emoji: '✅', title: 'Compliance', color: 'white' },
    { href: '/maintenance', bg: 'linear-gradient(135deg, #06b6d4, #0891b2)', emoji: '🔧', title: 'Maintenance', color: 'white' },
    { href: '/training', bg: 'linear-gradient(135deg, #8b4513, #654321)', emoji: '🎓', title: 'Training', color: 'white' },
    { href: '/notes', bg: 'linear-gradient(135deg, #f59e0b, #d97706)', emoji: '📝', title: 'Notes', color: 'white' }
  ]

  const stats = [
    { label: 'Active Loads', value: '24', color: '#3b82f6', emoji: '📦' },
    { label: 'Available Drivers', value: '8', color: '#10b981', emoji: '👨‍💼' },
    { label: 'Fleet Vehicles', value: '32', color: '#8b5cf6', emoji: '🚛' },
    { label: 'Revenue (MTD)', value: '$145K', color: '#22c55e', emoji: '💵' }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: `
        linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05)),
        linear-gradient(135deg, #667eea 0%, #764ba2 100%)
      `,
      paddingTop: '80px'
    }}>
      
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px 32px'
      }}>
        {/* Welcome Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '48px',
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          padding: '32px'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: 'white',
            margin: '0 0 12px 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            🚛 Welcome to FleetFlow
          </h1>
          <p style={{
            fontSize: '20px',
            color: 'rgba(255, 255, 255, 0.95)',
            margin: 0
          }}>
            Your comprehensive fleet management solution
          </p>
        </div>

        {/* Quick Links Dashboard */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '48px'
        }}>
          {quickLinks.map((link, index) => (
            <Link key={index} href={link.href} style={{ textDecoration: 'none' }}>
              <div 
                style={{
                  background: link.bg,
                  borderRadius: '12px',
                  padding: '20px',
                  color: link.color,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  height: '100px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
              >
                <div style={{ fontSize: '32px' }}>{link.emoji}</div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>{link.title}</h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px'
        }}>
          {stats.map((stat, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.5)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>{stat.label}</p>
                  <p style={{ fontSize: '32px', fontWeight: 'bold', color: stat.color, margin: 0 }}>{stat.value}</p>
                </div>
                <div style={{ fontSize: '40px' }}>{stat.emoji}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
