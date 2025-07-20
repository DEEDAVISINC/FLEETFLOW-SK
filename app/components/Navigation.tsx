'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import GlobalNotificationBell from './GlobalNotificationBell'
import { FeatureTooltip } from './InfoTooltip'

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
          {/* OPERATIONS Dropdown */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <FeatureTooltip 
              feature="Operations Management" 
              description="Access dispatch central, broker box, and FreightFlow RFx platform for comprehensive operations management"
              position="bottom"
            >
              <button 
                onClick={() => handleDropdownToggle('operations')}
                onMouseDown={() => console.log('Operations button mousedown')}
                onMouseUp={() => console.log('Operations button mouseup')}
                style={{
                  background: activeDropdown === 'operations' 
                    ? 'linear-gradient(135deg, #1d4ed8, #1e40af)' 
                    : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  padding: '8px 14px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                🚛 OPERATIONS {activeDropdown === 'operations' ? '🔽' : '▼'}
              </button>
            </FeatureTooltip>
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
                <Link href="/dispatch" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#3b82f6', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                  🚛 Dispatch Central
                </Link>
                <Link href="/broker" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#3b82f6', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                  🏢 Broker Box
                </Link>
                <Link href="/freightflow-rfx" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#3b82f6', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                  📋 FreightFlow RFx
                </Link>
              </div>
            )}
          </div>

          {/* DRIVER MANAGEMENT Dropdown */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <FeatureTooltip 
              feature="Driver Management" 
              description="Comprehensive driver management, carrier onboarding, and contractor portal access"
              position="bottom"
            >
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                🚛 DRIVER MANAGEMENT ▼
              </button>
            </FeatureTooltip>
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
                  👥 Enhanced Driver Management Portal
                </Link>
                <Link href="/onboarding/carrier-onboarding" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#f4a832', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                  🚛 Carrier Onboarding
                </Link>
                <Link href="/carriers/enhanced-portal" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#f4a832', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                  🏢 Enhanced Carrier Portal
                </Link>
              </div>
            )}
          </div>

          {/* FLEETFLOW Dropdown */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <FeatureTooltip 
              feature="FleetFlow Platform" 
              description="Route optimization, freight quoting, fleet management, live tracking, and maintenance management"
              position="bottom"
            >
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                🚛 FLEETFLOW ▼
              </button>
            </FeatureTooltip>
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
                <Link href="/tracking" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#14b8a6', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                  🗺️ Live Load Tracking
                </Link>
                <Link href="/maintenance" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#14b8a6', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                  🔧 Maintenance Management Center
                </Link>
              </div>
            )}
          </div>

          {/* ANALYTICS - Single Button */}
          <FeatureTooltip 
            feature="Analytics Dashboard" 
            description="Comprehensive analytics, performance metrics, and business intelligence for data-driven decisions"
            position="bottom"
          >
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
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                📊 ANALYTICS
              </button>
            </Link>
          </FeatureTooltip>

          {/* COMPLIANCE - Single Button */}
          <FeatureTooltip 
            feature="Compliance Management" 
            description="DOT compliance, safety regulations, document management, and regulatory compliance tracking"
            position="bottom"
          >
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
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                ✅ COMPLIANCE
              </button>
            </Link>
          </FeatureTooltip>

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

          {/* Management Dropdown */}
          <div className="dropdown" style={{ position: 'relative', display: 'inline-block' }}>
            <button
              onClick={() => handleDropdownToggle('management')}
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                color: 'white',
                padding: '10px 18px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              ⚙️ {activeDropdown === 'management' ? '▲' : '▼'}
            </button>
            {activeDropdown === 'management' && (
              <div style={{
                position: 'absolute',
                background: 'white',
                minWidth: '200px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                borderRadius: '12px',
                padding: '12px 0',
                top: '100%',
                right: 0,
                border: '1px solid rgba(0,0,0,0.1)',
                zIndex: 1001
              }}>
                <Link href="/settings" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#8B5CF6', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                  ⚙️ System Settings
                </Link>
                <Link href="/analytics" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#8B5CF6', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                  📊 Analytics
                </Link>
                <Link href="/training/admin" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#8B5CF6', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                  🎓 Training Admin
                </Link>
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <GlobalNotificationBell 
            department="admin" 
            position="navigation"
            className="nav-notification-bell"
          />

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
