'use client'

import Link from 'next/link'

// Professional Navigation Component with Dropdowns matching Dashboard Quick Links
export default function ProfessionalNavigation() {
  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      padding: '12px 20px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <Link href="/" style={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #3b82f6, #06b6d4)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textDecoration: 'none'
        }}>
          🚛 FleetFlow
        </Link>
        
        <div style={{ 
          display: 'flex', 
          gap: '3px', 
          alignItems: 'center'
        }}>
          {/* OPERATIONS Dropdown - Blue (matches dashboard) */}
          <div className="dropdown" style={{ position: 'relative', display: 'inline-block' }}>
            <button style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              padding: '8px 14px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              🚛 OPERATIONS ▼
            </button>
            <div className="dropdown-content" style={{
              display: 'none',
              position: 'absolute',
              background: 'white',
              minWidth: '200px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              borderRadius: '12px',
              padding: '12px 0',
              top: '100%',
              left: 0,
              border: '1px solid rgba(0,0,0,0.1)',
              zIndex: 1001
            }}>
              <Link href="/dispatch" style={{ display: 'block', padding: '10px 20px', color: '#3b82f6', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                🚛 Dispatch Central
              </Link>
              <Link href="/broker" style={{ display: 'block', padding: '10px 20px', color: '#3b82f6', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                🏢 Broker Box
              </Link>
            </div>
          </div>

          {/* DRIVER MANAGEMENT Dropdown - Yellow/Orange (matches dashboard) */}
          <div className="dropdown" style={{ position: 'relative', display: 'inline-block' }}>
            <button style={{
              background: 'linear-gradient(135deg, #f7c52d, #f4a832)',
              color: '#2d3748',
              padding: '8px 14px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              🚛 DRIVER MANAGEMENT ▼
            </button>
            <div className="dropdown-content" style={{
              display: 'none',
              position: 'absolute',
              background: 'white',
              minWidth: '200px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              borderRadius: '12px',
              padding: '12px 0',
              top: '100%',
              left: 0,
              border: '1px solid rgba(0,0,0,0.1)',
              zIndex: 1001
            }}>
              <Link href="/drivers" style={{ display: 'block', padding: '10px 20px', color: '#f4a832', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                🚛 Driver Management
              </Link>
              <Link href="/drivers/dashboard" style={{ display: 'block', padding: '10px 20px', color: '#f4a832', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                📱 Driver Dashboard
              </Link>
              <Link href="/drivers#live-tracking" style={{ display: 'block', padding: '8px 20px', color: '#f4a832', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '500', fontStyle: 'italic' }}>
                🗺️ Live Load Tracking
              </Link>
            </div>
          </div>

          {/* FLEETFLOW Dropdown - Teal/Green (matches dashboard) */}
          <div className="dropdown" style={{ position: 'relative', display: 'inline-block' }}>
            <button style={{
              background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
              color: 'white',
              padding: '8px 14px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              🚛 FLEETFLOW ▼
            </button>
            <div className="dropdown-content" style={{
              display: 'none',
              position: 'absolute',
              background: 'white',
              minWidth: '200px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              borderRadius: '12px',
              padding: '12px 0',
              top: '100%',
              left: 0,
              border: '1px solid rgba(0,0,0,0.1)',
              zIndex: 1001
            }}>
              <Link href="/routes" style={{ display: 'block', padding: '10px 20px', color: '#14b8a6', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                🗺️ Route Optimization
              </Link>
              <Link href="/quoting" style={{ display: 'block', padding: '10px 20px', color: '#14b8a6', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                💰 Freight Quoting
              </Link>
              <Link href="/vehicles" style={{ display: 'block', padding: '10px 20px', color: '#14b8a6', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                🚚 Fleet Management
              </Link>
            </div>
          </div>

          {/* ANALYTICS - Single Button (indigo/blue from dashboard) */}
          <Link href="/analytics" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: 'white',
              padding: '8px 14px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              📊 ANALYTICS
            </button>
          </Link>

          {/* COMPLIANCE - Single Button (red from dashboard) */}
          <Link href="/compliance" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
              color: 'white',
              padding: '8px 14px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              ✅ COMPLIANCE
            </button>
          </Link>

          {/* RESOURCES Dropdown - Orange */}
          <div className="dropdown" style={{ position: 'relative', display: 'inline-block' }}>
            <button style={{
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              color: 'white',
              padding: '8px 14px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              📚 RESOURCES ▼
            </button>
            <div className="dropdown-content" style={{
              display: 'none',
              position: 'absolute',
              background: 'white',
              minWidth: '200px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              borderRadius: '12px',
              padding: '12px 0',
              top: '100%',
              left: 0,
              border: '1px solid rgba(0,0,0,0.1)',
              zIndex: 1001
            }}>
              <Link href="/documents" style={{ display: 'block', padding: '10px 20px', color: '#f97316', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                📄 Document Generation
              </Link>
              <Link href="/resources" style={{ display: 'block', padding: '10px 20px', color: '#f97316', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                📚 Resource Library
              </Link>
              <Link href="/safety" style={{ display: 'block', padding: '10px 20px', color: '#f97316', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                🦺 Safety Resources
              </Link>
              <Link href="/documentation" style={{ display: 'block', padding: '10px 20px', color: '#f97316', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                📚 Documentation Hub
              </Link>
              <Link href="/training" style={{ display: 'block', padding: '10px 20px', color: '#f97316', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                🎓 Training
              </Link>
            </div>
          </div>

          {/* User Profile Icon */}
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #0EA5E9, #2DD4BF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginLeft: '10px',
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)'
          }}>
            A
          </div>
        </div>
      </div>
    </nav>
  )
}
