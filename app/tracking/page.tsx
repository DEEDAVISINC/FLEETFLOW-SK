'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Dynamically import map component to avoid SSR issues
const MapComponent = dynamic(() => import('./components/LiveTrackingMap'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-96">Loading map...</div>
})

interface Shipment {
  id: string
  status: 'in-transit' | 'delivered' | 'delayed'
  origin: string
  destination: string
  carrier: string
  progress: number
  currentLocation: [number, number]
  originCoords: [number, number]
  destCoords: [number, number]
  speed: number
  eta: string
  driverName?: string
  driverPhone?: string
  vehicleInfo?: string
}

export default function LiveTrackingPage() {
  const router = useRouter()
  const [shipments, setShipments] = useState<Shipment[]>([
    {
      id: 'SHP-001',
      status: 'in-transit',
      origin: 'Los Angeles, CA',
      destination: 'Chicago, IL',
      carrier: 'Swift Transport',
      progress: 65,
      currentLocation: [36.7783, -110.4179],
      originCoords: [34.0522, -118.2437],
      destCoords: [41.8781, -87.6298],
      speed: 65,
      eta: '2024-01-15 14:30',
      driverName: 'John Smith',
      driverPhone: '+1 (555) 123-4567',
      vehicleInfo: 'Freightliner Cascadia - #FL001'
    },
    {
      id: 'SHP-002',
      status: 'delivered',
      origin: 'New York, NY',
      destination: 'Miami, FL',
      carrier: 'Express Logistics',
      progress: 100,
      currentLocation: [25.7617, -80.1918],
      originCoords: [40.7128, -74.0060],
      destCoords: [25.7617, -80.1918],
      speed: 0,
      eta: 'Delivered',
      driverName: 'Sarah Wilson',
      driverPhone: '+1 (555) 234-5678',
      vehicleInfo: 'Volvo VNL - #VL002'
    },
    {
      id: 'SHP-003',
      status: 'in-transit',
      origin: 'Seattle, WA',
      destination: 'Denver, CO',
      carrier: 'Mountain Freight',
      progress: 30,
      currentLocation: [44.5, -116.2],
      originCoords: [47.6062, -122.3321],
      destCoords: [39.7392, -104.9903],
      speed: 55,
      eta: '2024-01-18 09:15',
      driverName: 'Mike Johnson',
      driverPhone: '+1 (555) 345-6789',
      vehicleInfo: 'Peterbilt 579 - #PB003'
    },
    {
      id: 'SHP-004',
      status: 'delayed',
      origin: 'Houston, TX',
      destination: 'Atlanta, GA',
      carrier: 'Southern Express',
      progress: 45,
      currentLocation: [31.9686, -94.5301],
      originCoords: [29.7604, -95.3698],
      destCoords: [33.7490, -84.3880],
      speed: 0,
      eta: 'Delayed - Est. 2024-01-16',
      driverName: 'Emily Davis',
      driverPhone: '+1 (555) 456-7890',
      vehicleInfo: 'Kenworth T680 - #KW004'
    },
    {
      id: 'SHP-005',
      status: 'in-transit',
      origin: 'Phoenix, AZ',
      destination: 'Las Vegas, NV',
      carrier: 'Desert Lines',
      progress: 80,
      currentLocation: [35.5, -114.1],
      originCoords: [33.4484, -112.0740],
      destCoords: [36.1699, -115.1398],
      speed: 70,
      eta: '2024-01-13 18:45',
      driverName: 'Robert Brown',
      driverPhone: '+1 (555) 567-8901',
      vehicleInfo: 'Mack Anthem - #MA005'
    }
  ])

  const [selectedShipment, setSelectedShipment] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [autoTracking, setAutoTracking] = useState(false)
  const [showRoutes, setShowRoutes] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  // Memoize filter function
  const filteredShipments = useMemo(() => {
    return shipments.filter(shipment =>
      shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.carrier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shipment.driverName && shipment.driverName.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [shipments, searchTerm])

  // Memoize stats calculations
  const stats = useMemo(() => ({
    totalShipments: shipments.length,
    inTransit: shipments.filter(s => s.status === 'in-transit').length,
    delivered: shipments.filter(s => s.status === 'delivered').length
  }), [shipments])

  // Memoize status color function
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'in-transit': return '#2563eb'
      case 'delivered': return '#10b981'
      case 'delayed': return '#ef4444'
      default: return '#6b7280'
    }
  }, [])

  // Memoize format status function
  const formatStatus = useCallback((status: string) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }, [])

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setShipments(prev => prev.map(shipment => {
        if (shipment.status === 'in-transit' && shipment.speed > 0) {
          const latDiff = (shipment.destCoords[0] - shipment.currentLocation[0]) * 0.01
          const lngDiff = (shipment.destCoords[1] - shipment.currentLocation[1]) * 0.01
          
          return {
            ...shipment,
            currentLocation: [
              shipment.currentLocation[0] + latDiff,
              shipment.currentLocation[1] + lngDiff
            ] as [number, number],
            progress: Math.min(shipment.progress + 1, 99)
          }
        }
        return shipment
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const refreshData = useCallback(() => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  return (
    <div style={{
      background: '#f3f4f6',
      minHeight: '100vh',
      padding: '80px 20px 20px 20px'
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        marginBottom: '24px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: 0,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              🗺️ Live Load Tracking
            </h1>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                onClick={() => router.back()}
                style={{
                  background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                ← Back
              </button>
              
              <Link href="/dispatch" style={{ textDecoration: 'none' }}>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  🚛 Dispatch Central
                </button>
              </Link>
              
              <button
                onClick={refreshData}
                disabled={isLoading}
                style={{
                  background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                  transition: 'all 0.3s ease'
                }}
              >
                {isLoading ? '🔄 Refreshing...' : '🔄 Refresh'}
              </button>
              
              <button
                onClick={() => setAutoTracking(!autoTracking)}
                style={{
                  background: autoTracking 
                    ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' 
                    : 'rgba(255, 255, 255, 0.9)',
                  color: autoTracking ? 'white' : '#374151',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {autoTracking ? '📍 Auto-Track ON' : '📍 Auto-Track OFF'}
              </button>
              
              <button
                onClick={() => setShowRoutes(!showRoutes)}
                style={{
                  background: showRoutes 
                    ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' 
                    : 'rgba(255, 255, 255, 0.9)',
                  color: showRoutes ? 'white' : '#374151',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {showRoutes ? '🛣️ Routes ON' : '🛣️ Routes OFF'}
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ color: '#2563eb', fontSize: '24px', fontWeight: 'bold' }}>{stats.totalShipments}</div>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>Total Shipments</div>
            </div>
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ color: '#059669', fontSize: '24px', fontWeight: 'bold' }}>{stats.inTransit}</div>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>In Transit</div>
            </div>
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ color: '#16a34a', fontSize: '24px', fontWeight: 'bold' }}>{stats.delivered}</div>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>Delivered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: '24px',
        height: 'calc(100vh - 200px)'
      }}>
        {/* Map Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            background: 'rgba(248, 250, 252, 0.9)',
            padding: '16px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              margin: 0
            }}>
              🗺️ Interactive Map
            </h2>
          </div>
          
          <div style={{ height: 'calc(100% - 70px)', position: 'relative' }}>
            <MapComponent
              shipments={filteredShipments}
              selectedShipment={selectedShipment}
              onSelectShipment={setSelectedShipment}
              autoTracking={autoTracking}
              showRoutes={showRoutes}
            />
          </div>
        </div>

        {/* Shipments Panel */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Search Header */}
          <div style={{
            background: 'rgba(248, 250, 252, 0.9)',
            padding: '16px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0 0 12px 0'
            }}>
              📦 Active Shipments
            </h2>
            <input
              type="text"
              placeholder="Search shipments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.9)',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* Shipments List */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '8px'
          }}>
            {filteredShipments.map((shipment) => (
              <div
                key={shipment.id}
                onClick={() => setSelectedShipment(shipment.id)}
                style={{
                  background: selectedShipment === shipment.id 
                    ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' 
                    : 'rgba(255, 255, 255, 0.9)',
                  margin: '8px',
                  padding: '16px',
                  borderRadius: '12px',
                  border: `2px solid ${selectedShipment === shipment.id 
                    ? 'rgba(79, 70, 229, 0.5)' 
                    : 'rgba(0, 0, 0, 0.1)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  if (selectedShipment !== shipment.id) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedShipment !== shipment.id) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {/* Shipment Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: selectedShipment === shipment.id ? 'white' : '#1f2937'
                  }}>
                    {shipment.id}
                  </span>
                  <span style={{
                    background: getStatusColor(shipment.status),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {formatStatus(shipment.status)}
                  </span>
                </div>

                {/* Route */}
                <div style={{ 
                  color: selectedShipment === shipment.id ? 'rgba(255, 255, 255, 0.9)' : '#4b5563', 
                  fontSize: '14px', 
                  marginBottom: '8px',
                  fontWeight: '500'
                }}>
                  📍 {shipment.origin} → {shipment.destination}
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '8px' }}>
                  <div style={{
                    background: selectedShipment === shipment.id ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                    borderRadius: '4px',
                    height: '6px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      background: selectedShipment === shipment.id ? 'white' : getStatusColor(shipment.status),
                      height: '100%',
                      width: `${shipment.progress}%`,
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <div style={{
                    color: selectedShipment === shipment.id ? 'rgba(255, 255, 255, 0.8)' : '#6b7280',
                    fontSize: '12px',
                    marginTop: '4px'
                  }}>
                    {shipment.progress}% Complete
                  </div>
                </div>

                {/* Details */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  fontSize: '12px',
                  color: selectedShipment === shipment.id ? 'rgba(255, 255, 255, 0.8)' : '#6b7280'
                }}>
                  <div>🚚 {shipment.carrier}</div>
                  <div>⚡ {shipment.speed} mph</div>
                  <div>👨‍💼 {shipment.driverName}</div>
                  <div>📞 {shipment.driverPhone}</div>
                </div>

                {/* ETA */}
                <div style={{
                  marginTop: '8px',
                  color: selectedShipment === shipment.id ? 'white' : '#1f2937',
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  🕒 ETA: {shipment.eta}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
