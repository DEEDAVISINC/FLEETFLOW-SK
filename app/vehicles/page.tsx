'use client'

import { useState } from 'react'
import StickyNote from '../components/StickyNote-Enhanced'
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
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          input::placeholder {
            color: rgba(255, 255, 255, 0.8) !important;
            opacity: 1 !important;
          }
          input::-webkit-input-placeholder {
            color: rgba(255, 255, 255, 0.8) !important;
          }
          input::-moz-placeholder {
            color: rgba(255, 255, 255, 0.8) !important;
          }
          input:-ms-input-placeholder {
            color: rgba(255, 255, 255, 0.8) !important;
          }
        `
      }} />
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%)',
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
                      Live Load Tracking
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
            transition: 'all 0.3s ease',
            cursor: 'pointer'
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
            transition: 'all 0.3s ease',
            cursor: 'pointer'
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
            transition: 'all 0.3s ease',
            cursor: 'pointer'
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
                  border: '2px solid rgba(255, 255, 255, 0.6)',
                  borderRadius: '12px',
                  outline: 'none',
                  background: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  fontSize: '16px',
                  width: '100%',
                  maxWidth: '400px'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.8)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.6)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                }}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: '12px 16px',
                  border: '2px solid rgba(255, 255, 255, 0.6)',
                  borderRadius: '12px',
                  outline: 'none',
                  background: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  fontSize: '16px',
                  width: '100%',
                  maxWidth: '200px'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.8)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.6)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                }}
              >
                <option value="all" style={{ background: '#1e3a8a', color: 'white' }}>All Status</option>
                <option value="active" style={{ background: '#1e3a8a', color: 'white' }}>Active</option>
                <option value="inactive" style={{ background: '#1e3a8a', color: 'white' }}>Inactive</option>
                <option value="maintenance" style={{ background: '#1e3a8a', color: 'white' }}>Maintenance</option>
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
              transition: 'all 0.3s ease',
              cursor: 'pointer'
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

                {/* Vehicle Notes */}
                <div style={{ marginTop: '16px' }}>
                  <h4 style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                    📝 Vehicle Notes
                  </h4>
                  <StickyNote 
                    section="vehicles" 
                    entityId={vehicle.id} 
                    entityName={vehicle.name} 
                    entityType="vehicle"
                    showUnreadCount={true}
                  />
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
              🗺️ Live Load Tracking
            </h3>
            
            {/* Load Address Input Section */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h4 style={{ color: 'white', fontSize: '14px', fontWeight: '600', margin: '0 0 12px 0' }}>
                Add New Load for Tracking
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: '12px', alignItems: 'end' }}>
                <div>
                  <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                    Pickup Address
                  </label>
                  <input
                    type="text"
                    placeholder="Enter pickup address..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.6)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.4)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    }}
                  />
                </div>
                <div>
                  <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    placeholder="Enter delivery address..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.6)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.4)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    }}
                  />
                </div>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #059669, #047857)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    height: '36px'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onClick={() => {
                    alert('🚛 New load added to tracking system!\n\nIn a real implementation, this would:\n• Create a new load entry\n• Assign to available driver\n• Initialize GPS tracking\n• Send notifications to dispatch');
                  }}
                >
                  Add Load
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 120px 120px 1fr', gap: '12px', marginTop: '12px' }}>
                <div>
                  <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                    Driver
                  </label>
                  <select
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  >
                    <option value="" style={{ background: '#1e3a8a', color: 'white' }}>Select Driver</option>
                    <option value="D001" style={{ background: '#1e3a8a', color: 'white' }}>John Smith</option>
                    <option value="D002" style={{ background: '#1e3a8a', color: 'white' }}>Sarah Wilson</option>
                    <option value="D003" style={{ background: '#1e3a8a', color: 'white' }}>Mike Johnson</option>
                  </select>
                </div>
                <div>
                  <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                    Vehicle
                  </label>
                  <select
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  >
                    <option value="" style={{ background: '#1e3a8a', color: 'white' }}>Select Vehicle</option>
                    <option value="V001" style={{ background: '#1e3a8a', color: 'white' }}>Truck-045</option>
                    <option value="V002" style={{ background: '#1e3a8a', color: 'white' }}>Van-023</option>
                    <option value="V003" style={{ background: '#1e3a8a', color: 'white' }}>Truck-067</option>
                  </select>
                </div>
                <div>
                  <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                    Weight (lbs)
                  </label>
                  <input
                    type="text"
                    placeholder="45,000"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                    Cargo Type
                  </label>
                  <input
                    type="text"
                    placeholder="Electronics, Food, etc."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Live Tracking Map */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '12px',
              minHeight: '400px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              position: 'relative'
            }}>
              {/* Tracking Status Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
                padding: '12px',
                background: 'linear-gradient(135deg, #1e3a8a, #1e1b4b)',
                borderRadius: '8px',
                color: 'white'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: '#10b981',
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite'
                  }}></div>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>
                    Live Tracking Active - {filteredVehicles.filter(v => v.status === 'active').length} Vehicles
                  </span>
                </div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  Last Updated: {new Date().toLocaleTimeString()}
                </div>
              </div>

              {/* Map Placeholder with Vehicle Markers */}
              <div style={{
                background: 'linear-gradient(135deg, #e5f3ff 0%, #f0f9ff 100%)',
                borderRadius: '8px',
                height: '300px',
                position: 'relative',
                border: '2px dashed #93c5fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {/* Simulated Map Background */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `
                    linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%),
                    linear-gradient(0deg, transparent 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%)
                  `,
                  backgroundSize: '50px 50px'
                }}></div>

                {/* Vehicle Markers */}
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  {filteredVehicles.filter(v => v.status === 'active').map((vehicle, index) => (
                    <div
                      key={vehicle.id}
                      style={{
                        position: 'absolute',
                        left: `${20 + index * 25}%`,
                        top: `${30 + index * 15}%`,
                        background: 'white',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        border: '3px solid #10b981',
                        animation: `pulse 2s infinite ${index * 0.5}s`,
                        cursor: 'pointer'
                      }}
                      title={`${vehicle.name} - ${vehicle.driver} - ${vehicle.location}`}
                      onClick={() => {
                        alert(`🚛 Vehicle: ${vehicle.name}\n👨‍💼 Driver: ${vehicle.driver}\n📍 Location: ${vehicle.location}\n⛽ Fuel: ${vehicle.fuelLevel}%\n📊 Status: ${vehicle.status}`);
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>🚛</span>
                    </div>
                  ))}
                  
                  {/* Central Map Label */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    color: '#6b7280',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>🗺️</div>
                    <div>Interactive Fleet Tracking Map</div>
                    <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.7 }}>
                      Click vehicle markers for details
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Loads Summary */}
              <div style={{
                marginTop: '16px',
                padding: '12px',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h5 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1e40af' }}>
                    Active Load Summary
                  </h5>
                  <button
                    style={{
                      background: 'none',
                      border: '1px solid #3b82f6',
                      color: '#3b82f6',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                    onClick={() => {
                      alert('📊 Full Tracking Dashboard\n\nThis would open a comprehensive tracking interface with:\n• Real-time GPS tracking\n• Route optimization\n• ETA calculations\n• Delivery notifications\n• Performance analytics');
                    }}
                  >
                    View Full Dashboard
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '12px', color: '#374151' }}>
                  <div>📦 <strong>{filteredVehicles.filter(v => v.status === 'active').length}</strong> Active Loads</div>
                  <div>🚛 <strong>{vehicles.length}</strong> Total Vehicles</div>
                  <div>⏱️ <strong>94%</strong> On-Time Delivery</div>
                  <div>📍 <strong>Real-time</strong> GPS Tracking</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <StickyNote 
              section="vehicles" 
              entityId="fleet" 
              entityName="Fleet Management" 
              entityType="vehicle"
              isNotificationHub={true}
            />
          </div>
        </div>        </div>
      </div>
    </>
  )
}
