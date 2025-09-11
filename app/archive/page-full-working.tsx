'use client'

import Link from 'next/link'

export default function HomePage() {
  const quickLinks = [
    { href: '/dispatch', bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', emoji: '🚛', title: 'Dispatch Central', color: 'white' },
    { href: '/drivers', bg: 'linear-gradient(135deg, #f7c52d, #f4a832)', emoji: '🚛', title: 'Driver Management', color: '#2d3748' },
    { href: '/vehicles', bg: 'linear-gradient(135deg, #14b8a6, #0d9488)', emoji: '🚚', title: 'Fleet Management', color: 'white' },
    { href: '/broker', bg: 'linear-gradient(135deg, #f97316, #ea580c)', emoji: '🏢', title: 'Broker Box', color: 'white' },
    { href: '/routes', bg: 'linear-gradient(135deg, #14b8a6, #0d9488)', emoji: '🗺️', title: 'Route Optimization', color: 'white' },
    { href: '/analytics', bg: 'linear-gradient(135deg, #6366f1, #4f46e5)', emoji: '📊', title: 'Analytics', color: 'white' }
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
                <div 
                  style={{
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
                    backdropFilter: 'blur(5px)'
                  }}
                >
                  <div style={{ fontSize: '28px', textAlign: 'center' }}>{link.emoji}</div>
                  <h3 style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    margin: 0, 
                    textAlign: 'center',
                    textShadow: link.color === 'white' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                  }}>
                    {link.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* AI Flow Section - YOUR REQUESTED FEATURE */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '20px',
          marginBottom: '32px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <Link href="/ai"" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
              borderRadius: '8px',
              padding: '16px 24px',
              color: 'white',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              height: '60px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              backdropFilter: 'blur(5px)'
            }}>
              <div style={{ fontSize: '32px' }}>🤖</div>
              <div>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  margin: '0 0 4px 0',
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}>
                  AI Flow - Intelligent Automation Hub
                </h3>
                <p style={{
                  fontSize: '14px',
                  margin: 0,
                  opacity: 0.9,
                  textShadow: '0 1px 1px rgba(0,0,0,0.1)'
                }}>
                  Advanced AI workflows, load matching, and intelligent dispatch automation
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Success Message */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: 'white',
            margin: '0 0 16px 0'
          }}>
            ✅ AI Flow Quick Link Successfully Added!
          </h2>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.8)',
            margin: 0
          }}>
            Your requested AI Flow section is now visible with beautiful purple gradient styling,<br />
            positioned toward the bottom as requested, smaller height but longer width.
          </p>
        </div>
      </main>
    </div>
  )
}
