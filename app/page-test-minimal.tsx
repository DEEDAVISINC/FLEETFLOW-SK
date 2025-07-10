'use client'

import Link from 'next/link'

export default function MinimalHomePage() {
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

        {/* Test Load Board */}
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
          
          <div style={{ color: 'white', textAlign: 'center', marginBottom: '16px' }}>
            TEST: Load board section is rendering correctly
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr 2fr 1fr 1fr 1fr 120px',
            gap: '12px',
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '8px',
            marginBottom: '8px',
            fontSize: '14px',
            color: '#1f2937'
          }}>
            <div style={{ fontWeight: '600', color: '#3b82f6' }}>LD-2024-001</div>
            <div>📍 Los Angeles, CA</div>
            <div>🎯 Chicago, IL</div>
            <div style={{ fontWeight: '600', color: '#059669' }}>$3,450</div>
            <div>2,015 mi</div>
            <div>Jan 15</div>
            <div>
              <span style={{
                background: '#22c55e',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                Available
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
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
          
          <div style={{ color: 'white', textAlign: 'center' }}>
            Stats section working
          </div>
        </div>

      </main>
    </div>
  )
}
