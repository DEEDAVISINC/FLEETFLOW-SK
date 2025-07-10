'use client'

import { useState } from 'react'
import StickyNote from '../components/StickyNote'
import GoogleMaps from '../components/GoogleMaps'
import FleetFlowLogo from '../components/Logo'
import Link from 'next/link'

interface Vehicle {
  id: string
  name: string
  type: string
  status: 'active' | 'inactive' | 'maintenance'
  driver: string
  location: string
  fuelLevel: number
  mileage: number
  lastMaintenance: string
  nextMaintenance: string
}

export default function VehiclesPage() {
  const [vehicles] = useState<Vehicle[]>([
    {
      id: 'V001',
      name: 'Truck-045',
      type: 'Heavy Truck',
      status: 'active',
      driver: 'John Smith',
      location: 'Highway 95',
      fuelLevel: 85,
      mileage: 125000,
      lastMaintenance: '2024-05-15',
      nextMaintenance: '2024-08-15'
    },
    {
      id: 'V002',
      name: 'Van-023',
      type: 'Light Van',
      status: 'maintenance',
      driver: 'Unassigned',
      location: 'Maintenance Bay',
      fuelLevel: 60,
      mileage: 89000,
      lastMaintenance: '2024-06-20',
      nextMaintenance: '2024-09-20'
    },
    {
      id: 'V003',
      name: 'Truck-067',
      type: 'Medium Truck',
      status: 'active',
      driver: 'Sarah Wilson',
      location: 'Highway 101',
      fuelLevel: 92,
      mileage: 78000,
      lastMaintenance: '2024-04-20',
      nextMaintenance: '2024-07-20'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getFuelLevelColor = (level: number) => {
    if (level < 25) return '#ef4444'
    if (level < 50) return '#f59e0b'
    return '#10b981'
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active':
        return { background: 'rgba(74, 222, 128, 0.2)', color: '#4ade80', border: '1px solid #4ade80' }
      case 'inactive':
        return { background: 'rgba(156, 163, 175, 0.2)', color: '#9ca3af', border: '1px solid #9ca3af' }
      case 'maintenance':
        return { background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', border: '1px solid #fbbf24' }
      default:
        return { background: 'rgba(156, 163, 175, 0.2)', color: '#9ca3af', border: '1px solid #9ca3af' }
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      paddingTop: '80px'
    }}>
      {/* Back Button */}
      <div style={{ padding: '24px' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <button style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '16px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <span style={{ marginRight: '8px' }}>←</span>
            Back to Dashboard
          </button>
        </Link>
      </div>

      {/* Main Container */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px 32px'
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px'
              }}>
                <span style={{ fontSize: '32px' }}>🚛</span>
              </div>
              <div>
                <h1 style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 8px 0',
                  textShadow: '0 4px 8px rgba(0,0,0,0.3)'
                }}>
                  Fleet Management
                </h1>
                <p style={{
                  fontSize: '18px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: '0 0 8px 0'
                }}>
                  Monitor and manage your entire fleet in real-time
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      background: '#4ade80',
                      borderRadius: '50%',
                      animation: 'pulse 2s infinite'
                    }}></div>
                    <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
                      Live Fleet Tracking
                    </span>
                  </div>
                  <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    {vehicles.length} Vehicles Active
                  </span>
                </div>
              </div>
            </div>
            <button style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              + Add Vehicle
            </button>
          </div>
        </div>

        {/* Fleet Statistics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(59, 130, 246, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '24px' }}>🚛</span>
              </div>
              <div>
                <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 4px 0' }}>
                  Total Vehicles
                </p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', margin: 0 }}>
                  {vehicles.length}
                </p>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(16, 185, 129, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '24px' }}>✅</span>
              </div>
              <div>
                <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 4px 0' }}>
                  Active Vehicles
                </p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', margin: 0 }}>
                  {vehicles.filter(v => v.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(251, 191, 36, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '24px' }}>🔧</span>
              </div>
              <div>
                <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 4px 0' }}>
                  In Maintenance
                </p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', margin: 0 }}>
                  {vehicles.filter(v => v.status === 'maintenance').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: 0 }}>
              Search & Filter Vehicles
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                type="text"
                placeholder="Search vehicles or drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '12px 16px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  outline: 'none',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  fontSize: '16px',
                  width: '100%',
                  maxWidth: '400px'
                }}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: '12px 16px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  outline: 'none',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  fontSize: '16px',
                  width: '100%',
                  maxWidth: '200px'
                }}
              >
                <option value="all" style={{ background: '#374151', color: 'white' }}>All Status</option>
                <option value="active" style={{ background: '#374151', color: 'white' }}>Active</option>
                <option value="inactive" style={{ background: '#374151', color: 'white' }}>Inactive</option>
                <option value="maintenance" style={{ background: '#374151', color: 'white' }}>Maintenance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Vehicle Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', margin: 0 }}>
                  {vehicle.name}
                </h3>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  ...getStatusStyle(vehicle.status)
                }}>
                  {vehicle.status}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Type:</span>
                  <span style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>{vehicle.type}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Driver:</span>
                  <span style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>{vehicle.driver}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Location:</span>
                  <span style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>{vehicle.location}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Mileage:</span>
                  <span style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>{vehicle.mileage.toLocaleString()} mi</span>
                </div>
                
                {/* Fuel Level */}
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Fuel Level:</span>
                    <span style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>{vehicle.fuelLevel}%</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      background: getFuelLevelColor(vehicle.fuelLevel),
                      width: `${vehicle.fuelLevel}%`,
                      transition: 'width 0.5s ease',
                      borderRadius: '4px'
                    }}></div>
                  </div>
                </div>

                {/* Maintenance Info */}
                <div style={{ 
                  marginTop: '16px', 
                  padding: '12px', 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  borderRadius: '8px' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>Last Maintenance:</span>
                    <span style={{ color: 'white', fontSize: '12px' }}>{vehicle.lastMaintenance}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>Next Due:</span>
                    <span style={{ color: '#fbbf24', fontSize: '12px' }}>{vehicle.nextMaintenance}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map and Additional Components */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '32px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0' }}>
              🗺️ Live Fleet Tracking
            </h3>
            <GoogleMaps />
          </div>
          <div>
            <StickyNote section="vehicles" entityId="fleet" entityName="Fleet Management" />
          </div>
        </div>
      </div>
    </div>
  )
}
