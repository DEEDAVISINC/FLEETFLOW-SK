'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

// Professional Navigation Component with Working Dropdowns
export default function ProfessionalNavigation() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const navRef = useRef<HTMLDivElement>(null)

  const handleDropdownToggle = (dropdownName: string) => {
    console.log('Navigation render - activeDropdown:', activeDropdown)
    console.log('Dropdown toggle clicked:', dropdownName)
    setActiveDropdown(prev => {
      const newValue = prev === dropdownName ? null : dropdownName
      console.log('Setting activeDropdown from', prev, 'to', newValue)
      return newValue
    })
  }

  const handleDropdownClose = () => {
    console.log('Closing dropdown')
    setActiveDropdown(null)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <nav ref={navRef} style={{
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
          background: 'linear-gradient(45deg, #f59e0b, #d97706)',
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
          {/* OPERATIONS Dropdown */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button 
              onClick={() => handleDropdownToggle('operations')}
              onMouseDown={() => console.log('Operations button mousedown')}
              onMouseUp={() => console.log('Operations button mouseup')}
              style={{
                background: activeDropdown === 'operations' 
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
                  : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
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
                gap: '4px',
                transform: activeDropdown === 'operations' ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              🚛 OPERATIONS {activeDropdown === 'operations' ? '🔽' : '▼'}
            </button>
            {activeDropdown === 'operations' && (
              <div style={{
                position: 'absolute',
                background: 'white',
                minWidth: '200px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                borderRadius: '12px',
                padding: '12px 0',
                top: '100%',
                left: 0,
                border: '2px solid #3b82f6',
                zIndex: 1001
              }}>
                <div style={{ padding: '8px 20px', background: '#f0f9ff', fontWeight: 'bold', color: '#1e40af', fontSize: '0.8rem' }}>
                  🚛 OPERATIONS MENU
                </div>
                <Link href="/dispatch" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#3b82f6', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500', transition: 'background 0.2s' }}>
                  🚛 Dispatch Central
                </Link>
                <Link href="/broker" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#3b82f6', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500', transition: 'background 0.2s' }}>
                  🏢 Broker Box
                </Link>
              </div>
            )}
          </div>

          {/* DRIVER MANAGEMENT Dropdown */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button 
              onClick={() => handleDropdownToggle('drivers')}
              style={{
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
              }}
            >
              🚛 DRIVER MANAGEMENT ▼
            </button>
            {activeDropdown === 'drivers' && (
              <div style={{
                position: 'absolute',
                background: 'white',
                minWidth: '220px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                borderRadius: '12px',
                padding: '12px 0',
                top: '100%',
                left: 0,
                border: '1px solid rgba(0,0,0,0.1)',
                zIndex: 1001
              }}>
                <Link href="/drivers" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#f4a832', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                  🚛 Driver Management
                </Link>
                <Link href="/drivers/enhanced-portal" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#f4a832', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                  👥 Enhanced Driver Portal
                </Link>
                <Link href="/onboarding/carrier-onboarding" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#f4a832', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                  🚛 Carrier Onboarding
                </Link>
                <Link href="/carriers/enhanced-portal" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#f4a832', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                  🏢 Enhanced Carrier Portal
                </Link>
                <Link href="/drivers#live-tracking" onClick={handleDropdownClose} style={{ display: 'block', padding: '8px 20px', color: '#f4a832', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '500', fontStyle: 'italic' }}>
                  �️ Live Load Tracking
                </Link>
              </div>
            )}
          </div>

          {/* FLEETFLOW Dropdown */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button 
              onClick={() => handleDropdownToggle('fleet')}
              style={{
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
              }}
            >
              🚛 FLEETFLOW ▼
            </button>
            {activeDropdown === 'fleet' && (
              <div style={{
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
                <Link href="/routes" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#14b8a6', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                  🗺️ Route Optimization
                </Link>
                <Link href="/quoting" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#14b8a6', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                  💰 Freight Quoting
                </Link>
                <Link href="/vehicles" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#14b8a6', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                  🚚 Fleet Management
                </Link>
              </div>
            )}
          </div>

          {/* ANALYTICS - Single Button */}
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

          {/* COMPLIANCE - Single Button */}
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

          {/* RESOURCES Dropdown */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button 
              onClick={() => handleDropdownToggle('resources')}
              style={{
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
              }}
            >
              📚 RESOURCES ▼
            </button>
            {activeDropdown === 'resources' && (
              <div style={{
                position: 'absolute',
                background: 'white',
                minWidth: '220px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                borderRadius: '12px',
                padding: '12px 0',
                top: '100%',
                left: 0,
                border: '1px solid rgba(0,0,0,0.1)',
                zIndex: 1001
              }}>
                <Link href="/documents" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#f97316', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                  📄 Document Generation
                </Link>
                <Link href="/resources" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#f97316', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                  📚 Resource Library
                </Link>
                <Link href="/safety" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#f97316', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                  🦺 Safety Resources
                </Link>
                <Link href="/documentation" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#f97316', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                  📚 Documentation Hub
                </Link>
                <Link href="/training" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#f97316', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                  🎓 Training
                </Link>
              </div>
            )}
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
