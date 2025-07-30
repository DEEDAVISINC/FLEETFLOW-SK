'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '../../services/auth'

export default function DriverLogin() {
  const router = useRouter()
  const [credentials, setCredentials] = useState({
    driverId: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [deviceId, setDeviceId] = useState('')
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null)
  const [debugInfo, setDebugInfo] = useState('')

  useEffect(() => {
    console.log('Login page mounted, AuthService:', AuthService)
    
    // Generate device ID
    const generateDeviceId = () => {
      const stored = localStorage.getItem('device_id')
      if (stored) return stored
      
      const newId = `DEV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('device_id', newId)
      return newId
    }
    
    setDeviceId(generateDeviceId())
    
    // Request location permission
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.log('Location permission denied:', error)
        }
      )
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await AuthService.login(credentials.driverId, credentials.password)
      
      if (response.success) {
        router.push('/drivers/dashboard')
      } else {
        setError(response.error || 'Login failed')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (demoDriverId: string) => {
    console.log('Demo login button clicked for:', demoDriverId)
    setDebugInfo(`Attempting login for ${demoDriverId}...`)
    setIsLoading(true)
    setError('')
    
    try {
      console.log('Attempting demo login with:', demoDriverId)
      const response = await AuthService.login(demoDriverId, 'demo123')
      console.log('Login response:', response)
      
      if (response.success) {
        setDebugInfo('Login successful! Redirecting...')
        router.push('/drivers/dashboard')
      } else {
        setError(response.error || 'Demo login failed')
        setDebugInfo('Login failed: ' + (response.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Network error. Please try again.')
      setDebugInfo('Network error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 75% 25%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 25% 75%, rgba(245, 158, 11, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)
        `,
        opacity: 0.6,
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '48px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Logo/Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            margin: '0 auto 24px auto',
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
            border: '2px solid rgba(255, 255, 255, 0.1)'
          }}>
            🚛
          </div>
          <h1 style={{
            color: 'white',
            fontSize: '32px',
            fontWeight: 'bold',
            margin: '0 0 8px 0',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            Driver Management Portal
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '16px',
            margin: 0,
            fontWeight: '500'
          }}>
            Welcome to FleetFlow Driver Dashboard
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ marginBottom: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              Driver ID
            </label>
            <input
              type="text"
              value={credentials.driverId}
              onChange={(e) => setCredentials(prev => ({ ...prev, driverId: e.target.value }))}
              placeholder="Enter your driver ID"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)'
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Enter your password"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)'
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '24px',
              color: '#fca5a5',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !credentials.driverId || !credentials.password}
            style={{
              width: '100%',
              padding: '16px',
              background: isLoading || !credentials.driverId || !credentials.password
                ? 'rgba(107, 114, 128, 0.3)'
                : 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading || !credentials.driverId || !credentials.password ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: !isLoading && credentials.driverId && credentials.password
                ? '0 8px 25px rgba(59, 130, 246, 0.25)'
                : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              if (!isLoading && credentials.driverId && credentials.password) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(59, 130, 246, 0.3)'
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading && credentials.driverId && credentials.password) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.25)'
              }
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Signing In...
              </>
            ) : (
              <>
                🔑 Sign In
              </>
            )}
          </button>
        </form>

        {/* Debug Info */}
        {debugInfo && (
          <div style={{
            padding: '12px',
            background: 'rgba(59, 130, 246, 0.2)',
            borderRadius: '8px',
            marginBottom: '16px',
            color: '#93c5fd',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {debugInfo}
          </div>
        )}

        {/* Demo Accounts */}
        <div style={{
          padding: '24px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '24px'
        }}>
          <h3 style={{
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            margin: '0 0 16px 0',
            textAlign: 'center'
          }}>
            Demo Accounts
          </h3>
          
          {/* Debug State */}
          <div style={{
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.6)',
            textAlign: 'center',
            marginBottom: '12px'
          }}>
            Loading: {isLoading ? 'Yes' : 'No'} | DeviceID: {deviceId ? 'Set' : 'Not Set'} | Location: {currentLocation ? 'Available' : 'Not Available'}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Test Button */}
            <button
              onClick={() => {
                console.log('Test button clicked!')
                setDebugInfo('Test button clicked successfully!')
              }}
              style={{
                padding: '8px 16px',
                background: 'rgba(139, 92, 246, 0.2)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '6px',
                color: '#c4b5fd',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              🧪 Test Click (Debug)
            </button>
            
            <button
              onClick={() => {
                console.log('DRV-001 button clicked!')
                handleDemoLogin('DRV-001')
              }}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: isLoading ? 'rgba(107, 114, 128, 0.3)' : 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                color: isLoading ? 'rgba(255, 255, 255, 0.5)' : '#6ee7b7',
                fontSize: '14px',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = 'rgba(16, 185, 129, 0.3)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }
              }}
            >
              <span>
                <strong>John Smith</strong> (DRV-001)
              </span>
              <span style={{ fontSize: '12px', opacity: 0.8 }}>
                Dallas, TX
              </span>
            </button>
            
            <button
              onClick={() => {
                console.log('DRV-002 button clicked!')
                handleDemoLogin('DRV-002')
              }}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: isLoading ? 'rgba(107, 114, 128, 0.3)' : 'rgba(245, 158, 11, 0.2)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '8px',
                color: isLoading ? 'rgba(255, 255, 255, 0.5)' : '#fbbf24',
                fontSize: '14px',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = 'rgba(245, 158, 11, 0.3)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }
              }}
            >
              <span>
                <strong>Maria Rodriguez</strong> (DRV-002)
              </span>
              <span style={{ fontSize: '12px', opacity: 0.8 }}>
                Los Angeles, CA
              </span>
            </button>
          </div>
        </div>

        {/* System Status */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.7)'
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: currentLocation ? '#10b981' : '#ef4444'
            }} />
            GPS: {currentLocation ? 'Ready' : 'Disabled'}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.7)'
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#10b981'
            }} />
            System: Online
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        
        input:disabled {
          opacity: 0.7;
        }
      `}</style>
    </div>
  )
} 