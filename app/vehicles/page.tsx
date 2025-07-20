'use client'

import { useState, useEffect } from 'react'
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
  const [vehicles, setVehicles] = useState<Vehicle[]>([
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
    },
    {
      id: 'V004',
      name: 'Truck-089',
      type: 'Heavy Truck',
      status: 'active',
      driver: 'Mike Johnson',
      location: 'Interstate 75',
      fuelLevel: 45,
      mileage: 156000,
      lastMaintenance: '2024-02-10',
      nextMaintenance: '2024-05-10' // Overdue maintenance
    },
    {
      id: 'V005',
      name: 'Van-034',
      type: 'Light Van',
      status: 'active',
      driver: 'Lisa Chen',
      location: 'Highway 10',
      fuelLevel: 78,
      mileage: 65000,
      lastMaintenance: '2024-06-01',
      nextMaintenance: '2024-07-15' // Approaching due date
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'name' | 'fuelLevel' | 'mileage' | 'nextMaintenance' | 'driver'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedVehicles, setSelectedVehicles] = useState<Set<string>>(new Set())
  const [showBulkActions, setShowBulkActions] = useState(false)

  // Auto-refresh functionality
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time data updates
      setVehicles(prevVehicles => 
        prevVehicles.map(vehicle => ({
          ...vehicle,
          fuelLevel: Math.max(10, Math.min(100, vehicle.fuelLevel + (Math.random() - 0.5) * 2)), // Simulate fuel changes
          location: vehicle.status === 'active' ? vehicle.location : vehicle.location // Keep location for active vehicles
        }))
      )
      setLastUpdated(new Date())
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Update bulk actions visibility when selection changes
  useEffect(() => {
    setShowBulkActions(selectedVehicles.size > 0)
  }, [selectedVehicles])

  // Close modal when clicking outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false)
        setSelectedVehicle(null)
      }
    }
    
    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen])

  // Manual refresh function
  const handleManualRefresh = () => {
    setVehicles(prevVehicles => 
      prevVehicles.map(vehicle => ({
        ...vehicle,
        fuelLevel: Math.max(10, Math.min(100, vehicle.fuelLevel + (Math.random() - 0.5) * 5))
      }))
    )
    setLastUpdated(new Date())
  }

  // Open vehicle details modal
  const handleVehicleClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setIsModalOpen(true)
  }

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedVehicle(null)
  }

  // Handle vehicle selection
  const handleVehicleSelect = (vehicleId: string, isSelected: boolean) => {
    const newSelectedVehicles = new Set(selectedVehicles)
    if (isSelected) {
      newSelectedVehicles.add(vehicleId)
    } else {
      newSelectedVehicles.delete(vehicleId)
    }
    setSelectedVehicles(newSelectedVehicles)
  }

  // Select all vehicles
  const handleSelectAll = () => {
    if (selectedVehicles.size === filteredVehicles.length) {
      setSelectedVehicles(new Set())
    } else {
      setSelectedVehicles(new Set(filteredVehicles.map(v => v.id)))
    }
  }

  // Clear selection
  const handleClearSelection = () => {
    setSelectedVehicles(new Set())
  }

  // Bulk actions handlers
  const handleBulkMaintenance = () => {
    const selectedVehiclesList = Array.from(selectedVehicles).map(id => 
      filteredVehicles.find(v => v.id === id)?.name
    ).join(', ')
    
    alert(`🔧 Bulk Maintenance Scheduled\n\nThe following vehicles have been scheduled for maintenance:\n${selectedVehiclesList}\n\nThis would normally:\n• Update vehicle status to 'maintenance'\n• Notify drivers\n• Schedule maintenance appointments\n• Update fleet availability`)
    handleClearSelection()
  }

  const handleBulkDriverReassignment = () => {
    const selectedVehiclesList = Array.from(selectedVehicles).map(id => 
      filteredVehicles.find(v => v.id === id)?.name
    ).join(', ')
    
    alert(`👥 Bulk Driver Reassignment\n\nReassigning drivers for vehicles:\n${selectedVehiclesList}\n\nThis would normally:\n• Show available drivers list\n• Allow bulk reassignment\n• Update driver schedules\n• Send notifications`)
    handleClearSelection()
  }

  const handleBulkExport = () => {
    const selectedVehiclesData = Array.from(selectedVehicles).map(id => 
      filteredVehicles.find(v => v.id === id)
    )
    
    const csvData = selectedVehiclesData.map(vehicle => 
      `${vehicle?.id},${vehicle?.name},${vehicle?.type},${vehicle?.status},${vehicle?.driver},${vehicle?.location},${vehicle?.fuelLevel},${vehicle?.mileage},${vehicle?.lastMaintenance},${vehicle?.nextMaintenance}`
    ).join('\n')
    
    const headers = 'ID,Name,Type,Status,Driver,Location,Fuel Level,Mileage,Last Maintenance,Next Maintenance\n'
    const fullCsvData = headers + csvData
    
    const blob = new Blob([fullCsvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fleet-vehicles-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    
    handleClearSelection()
  }

  // Generate mock maintenance history
  const generateMaintenanceHistory = (vehicle: Vehicle) => {
    const history = [
      {
        date: vehicle.lastMaintenance,
        type: 'Oil Change & Filter',
        cost: '$89.99',
        mileage: vehicle.mileage - 5000,
        notes: 'Routine maintenance completed'
      },
      {
        date: '2024-04-01',
        type: 'Tire Rotation',
        cost: '$45.00',
        mileage: vehicle.mileage - 8000,
        notes: 'All tires rotated and balanced'
      },
      {
        date: '2024-02-15',
        type: 'Brake Inspection',
        cost: '$125.50',
        mileage: vehicle.mileage - 12000,
        notes: 'Brake pads replaced - front axle'
      },
      {
        date: '2024-01-10',
        type: 'Annual DOT Inspection',
        cost: '$275.00',
        mileage: vehicle.mileage - 15000,
        notes: 'Passed DOT inspection with minor repairs'
      }
    ]
    return history
  }

  // Generate mock performance metrics
  const generatePerformanceMetrics = (vehicle: Vehicle) => {
    return {
      avgFuelEfficiency: (6.2 + Math.random() * 2).toFixed(1),
      totalMilesDriven: (vehicle.mileage * 0.8).toLocaleString(),
      averageSpeed: (55 + Math.random() * 10).toFixed(1),
      idleTime: (8 + Math.random() * 4).toFixed(1),
      deliveriesCompleted: Math.floor(200 + Math.random() * 100),
      onTimeDeliveries: (92 + Math.random() * 6).toFixed(1)
    }
  }

  // Check if maintenance is overdue or approaching
  const getMaintenanceStatus = (nextMaintenance: string) => {
    const today = new Date()
    const maintenanceDate = new Date(nextMaintenance)
    const diffTime = maintenanceDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'overdue'
    if (diffDays <= 7) return 'approaching'
    return 'normal'
  }

  // Enhanced sorting function
  const sortedVehicles = [...vehicles].sort((a, b) => {
    let aValue: any = a[sortBy]
    let bValue: any = b[sortBy]
    
    if (sortBy === 'nextMaintenance') {
      aValue = new Date(aValue)
      bValue = new Date(bValue)
    }
    
    if (sortBy === 'fuelLevel' || sortBy === 'mileage') {
      aValue = Number(aValue)
      bValue = Number(bValue)
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  const filteredVehicles = sortedVehicles.filter(vehicle => {
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

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
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
          
          select option {
            background: #1e3a8a !important;
            color: white !important;
            padding: 8px !important;
          }
          
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.8;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          
          .maintenance-alert {
            animation: pulse 2s infinite;
          }
          
          .sort-button {
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.8);
            cursor: pointer;
            font-size: 14px;
            padding: 4px 8px;
            border-radius: 4px;
            transition: all 0.2s ease;
          }
          
          .sort-button:hover {
            background: rgba(255, 255, 255, 0.1);
            color: white;
          }
          
                     .sort-button.active {
             background: rgba(255, 255, 255, 0.2);
             color: white;
           }
           
           @keyframes slideUp {
             from {
               transform: translateX(-50%) translateY(20px);
               opacity: 0;
             }
             to {
               transform: translateX(-50%) translateY(0);
               opacity: 1;
             }
          }
        `
      }} />
      
      <div style={{
        minHeight: '100vh',
        background: `
          linear-gradient(135deg, #022c22 0%, #032e2a 25%, #044e46 50%, #042f2e 75%, #0a1612 100%),
          radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.06) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.04) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(6, 182, 212, 0.03) 0%, transparent 50%)
        `,
        backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
        backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
        backgroundAttachment: 'fixed',
        paddingTop: '80px',
        position: 'relative'
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
                    <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
                      Last Updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                </div>
              </div>
            </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleManualRefresh}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '14px'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  🔄 Refresh
                </button>
            <button style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
                  fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
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
          </div>

          {/* Enhanced Search and Filter Controls */}
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
              {/* Search and Filter Row */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
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
                    flex: '1',
                    minWidth: '200px'
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
                    minWidth: '200px'
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              
                             {/* Sort Controls */}
               <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                 <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', fontWeight: '500' }}>
                   Sort by:
                 </span>
                 <button
                   onClick={() => handleSort('name')}
                   className={`sort-button ${sortBy === 'name' ? 'active' : ''}`}
                 >
                   Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                 </button>
                 <button
                   onClick={() => handleSort('fuelLevel')}
                   className={`sort-button ${sortBy === 'fuelLevel' ? 'active' : ''}`}
                 >
                   Fuel Level {sortBy === 'fuelLevel' && (sortOrder === 'asc' ? '↑' : '↓')}
                 </button>
                 <button
                   onClick={() => handleSort('mileage')}
                   className={`sort-button ${sortBy === 'mileage' ? 'active' : ''}`}
                 >
                   Mileage {sortBy === 'mileage' && (sortOrder === 'asc' ? '↑' : '↓')}
                 </button>
                 <button
                   onClick={() => handleSort('driver')}
                   className={`sort-button ${sortBy === 'driver' ? 'active' : ''}`}
                 >
                   Driver {sortBy === 'driver' && (sortOrder === 'asc' ? '↑' : '↓')}
                 </button>
                 <button
                   onClick={() => handleSort('nextMaintenance')}
                   className={`sort-button ${sortBy === 'nextMaintenance' ? 'active' : ''}`}
                 >
                   Maintenance Due {sortBy === 'nextMaintenance' && (sortOrder === 'asc' ? '↑' : '↓')}
                 </button>
               </div>
               
               {/* Bulk Selection Controls */}
               <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '8px' }}>
                 <button
                   onClick={handleSelectAll}
                   className="sort-button"
                 >
                   {selectedVehicles.size === filteredVehicles.length ? '☑️ Deselect All' : '☐ Select All'}
                 </button>
                 {selectedVehicles.size > 0 && (
                   <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                     {selectedVehicles.size} vehicle{selectedVehicles.size !== 1 ? 's' : ''} selected
                   </span>
                 )}
               </div>
            </div>
                     </div>

           {/* Bulk Actions Bar */}
           {showBulkActions && (
             <div style={{
               position: 'fixed',
               bottom: '32px',
               left: '50%',
               transform: 'translateX(-50%)',
               background: 'rgba(255, 255, 255, 0.15)',
               backdropFilter: 'blur(10px)',
               borderRadius: '16px',
               padding: '16px 24px',
               border: '1px solid rgba(255, 255, 255, 0.2)',
               boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
               zIndex: 100,
               display: 'flex',
               alignItems: 'center',
               gap: '16px',
               animation: 'slideUp 0.3s ease-out'
             }}>
               <span style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>
                 {selectedVehicles.size} vehicle{selectedVehicles.size !== 1 ? 's' : ''} selected
               </span>
               <div style={{ display: 'flex', gap: '8px' }}>
                 <button
                   onClick={handleBulkMaintenance}
                   style={{
                     background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                     color: 'white',
                     padding: '8px 16px',
                     borderRadius: '8px',
                     border: 'none',
                     fontSize: '14px',
                     fontWeight: '600',
                     cursor: 'pointer',
                     transition: 'all 0.2s ease'
                   }}
                   onMouseOver={(e) => {
                     e.currentTarget.style.transform = 'translateY(-2px)';
                     e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                   }}
                   onMouseOut={(e) => {
                     e.currentTarget.style.transform = 'translateY(0)';
                     e.currentTarget.style.boxShadow = 'none';
                   }}
                 >
                   🔧 Send to Maintenance
                 </button>
                 <button
                   onClick={handleBulkDriverReassignment}
                   style={{
                     background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                     color: 'white',
                     padding: '8px 16px',
                     borderRadius: '8px',
                     border: 'none',
                     fontSize: '14px',
                     fontWeight: '600',
                     cursor: 'pointer',
                     transition: 'all 0.2s ease'
                   }}
                   onMouseOver={(e) => {
                     e.currentTarget.style.transform = 'translateY(-2px)';
                     e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                   }}
                   onMouseOut={(e) => {
                     e.currentTarget.style.transform = 'translateY(0)';
                     e.currentTarget.style.boxShadow = 'none';
                   }}
                 >
                   👥 Reassign Drivers
                 </button>
                 <button
                   onClick={handleBulkExport}
                   style={{
                     background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                     color: 'white',
                     padding: '8px 16px',
                     borderRadius: '8px',
                     border: 'none',
                     fontSize: '14px',
                     fontWeight: '600',
                     cursor: 'pointer',
                     transition: 'all 0.2s ease'
                   }}
                   onMouseOver={(e) => {
                     e.currentTarget.style.transform = 'translateY(-2px)';
                     e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                   }}
                   onMouseOut={(e) => {
                     e.currentTarget.style.transform = 'translateY(0)';
                     e.currentTarget.style.boxShadow = 'none';
                   }}
                 >
                   📊 Export Fleet Data
                 </button>
                 <button
                   onClick={handleClearSelection}
                   style={{
                     background: 'rgba(255, 255, 255, 0.2)',
                     color: 'white',
                     padding: '8px 16px',
                     borderRadius: '8px',
                     border: '1px solid rgba(255, 255, 255, 0.3)',
                     fontSize: '14px',
                     fontWeight: '600',
                     cursor: 'pointer',
                     transition: 'all 0.2s ease'
                   }}
                   onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                }}
                   onMouseOut={(e) => {
                     e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                   }}
                 >
                   ✕ Clear
                 </button>
            </div>
          </div>
           )}

        {/* Vehicle Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
            {filteredVehicles.map((vehicle) => {
              const maintenanceStatus = getMaintenanceStatus(vehicle.nextMaintenance)
              
              return (
            <div key={vehicle.id} style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                }}
                onClick={() => handleVehicleClick(vehicle)}
                >
                  
                  {                   /* Selection Checkbox */}
                   <div style={{
                     position: 'absolute',
                     top: '12px',
                     left: '12px',
                     zIndex: 10
                   }}>
                     <input
                       type="checkbox"
                       checked={selectedVehicles.has(vehicle.id)}
                       onChange={(e) => {
                         e.stopPropagation()
                         handleVehicleSelect(vehicle.id, e.target.checked)
                       }}
                       style={{
                         width: '18px',
                         height: '18px',
                         cursor: 'pointer',
                         accentColor: '#10b981'
                       }}
                     />
                   </div>
                   
                   {/* Maintenance Alert Indicator */}
                   {maintenanceStatus !== 'normal' && (
                     <div style={{
                       position: 'absolute',
                       top: '12px',
                       right: '12px',
                       width: '12px',
                       height: '12px',
                       borderRadius: '50%',
                       background: maintenanceStatus === 'overdue' ? '#ef4444' : '#f59e0b',
                       animation: 'pulse 2s infinite',
                       boxShadow: `0 0 10px ${maintenanceStatus === 'overdue' ? '#ef4444' : '#f59e0b'}`
                     }}
                     title={maintenanceStatus === 'overdue' ? 'Maintenance Overdue!' : 'Maintenance Due Soon'}
                     />
                   )}
                   
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
                    
                    {/* Maintenance Status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Next Maintenance:</span>
                      <span style={{ 
                        color: maintenanceStatus === 'overdue' ? '#ef4444' : maintenanceStatus === 'approaching' ? '#f59e0b' : 'white', 
                        fontWeight: '500', 
                        fontSize: '14px' 
                      }}>
                        {new Date(vehicle.nextMaintenance).toLocaleDateString()}
                        {maintenanceStatus === 'overdue' && ' ⚠️'}
                        {maintenanceStatus === 'approaching' && ' 🔄'}
                      </span>
                    </div>
                
                {/* Fuel Level */}
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Fuel Level:</span>
                        <span style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>{Math.round(vehicle.fuelLevel)}%</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                          width: `${vehicle.fuelLevel}%`,
                      height: '100%',
                      background: getFuelLevelColor(vehicle.fuelLevel),
                          transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </div>
                  </div>
                  </div>
              )
            })}
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
                    <Link href="/tracking">
                  <button
                    style={{
                      background: 'none',
                      border: '1px solid #3b82f6',
                      color: '#3b82f6',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer',
                          fontWeight: '500',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'none';
                          e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    View Full Dashboard
                  </button>
                    </Link>
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

      {/* Vehicle Details Modal */}
      {selectedVehicle && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(10px)'
        }} onClick={handleCloseModal}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, color: 'white', fontSize: '28px', fontWeight: 'bold' }}>
                {selectedVehicle.name} Details
              </h2>
              <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <h3 style={{ color: 'white', fontSize: '20px', fontWeight: '600', margin: '0 0 16px 0' }}>
                  General Information
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>ID:</span>
                  <span style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>{selectedVehicle.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Type:</span>
                  <span style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>{selectedVehicle.type}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Status:</span>
                  <span style={{ 
                    color: selectedVehicle.status === 'active' ? '#4ade80' : selectedVehicle.status === 'maintenance' ? '#fbbf24' : '#9ca3af', 
                    fontWeight: '500', 
                    fontSize: '14px' 
                  }}>
                    {selectedVehicle.status}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Driver:</span>
                  <span style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>{selectedVehicle.driver}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Location:</span>
                  <span style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>{selectedVehicle.location}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Fuel Level:</span>
                  <span style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>{Math.round(selectedVehicle.fuelLevel)}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Mileage:</span>
                  <span style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>{selectedVehicle.mileage.toLocaleString()} mi</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Next Maintenance:</span>
                  <span style={{ 
                    color: getMaintenanceStatus(selectedVehicle.nextMaintenance) === 'overdue' ? '#ef4444' : getMaintenanceStatus(selectedVehicle.nextMaintenance) === 'approaching' ? '#f59e0b' : 'white', 
                    fontWeight: '500', 
                    fontSize: '14px' 
                  }}>
                    {new Date(selectedVehicle.nextMaintenance).toLocaleDateString()}
                    {getMaintenanceStatus(selectedVehicle.nextMaintenance) === 'overdue' && ' ⚠️'}
                    {getMaintenanceStatus(selectedVehicle.nextMaintenance) === 'approaching' && ' 🔄'}
                  </span>
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <h3 style={{ color: 'white', fontSize: '20px', fontWeight: '600', margin: '0 0 16px 0' }}>
                  Performance Metrics
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Avg Fuel Efficiency:</span>
                    <span style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>{generatePerformanceMetrics(selectedVehicle).avgFuelEfficiency} MPG</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Total Miles Driven:</span>
                    <span style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>{generatePerformanceMetrics(selectedVehicle).totalMilesDriven}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Average Speed:</span>
                    <span style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>{generatePerformanceMetrics(selectedVehicle).averageSpeed} MPH</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Idle Time:</span>
                    <span style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>{generatePerformanceMetrics(selectedVehicle).idleTime} Hours</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Deliveries Completed:</span>
                    <span style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>{generatePerformanceMetrics(selectedVehicle).deliveriesCompleted}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>On-Time Deliveries:</span>
                    <span style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>{generatePerformanceMetrics(selectedVehicle).onTimeDeliveries}%</span>
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <h3 style={{ color: 'white', fontSize: '20px', fontWeight: '600', margin: '0 0 16px 0' }}>
                  Maintenance History
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {generateMaintenanceHistory(selectedVehicle).map((item, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: 'white' }}>{item.type}</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>{item.date}</div>
                      </div>
                      <div style={{ textAlign: 'right', flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: 'white' }}>{item.cost}</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>Mileage: {item.mileage}</div>
                      </div>
                      <div style={{ flex: 1, textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>{item.notes}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
