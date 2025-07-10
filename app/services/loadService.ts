// Load Management Service - Centralized load operations
import { getCurrentUser, getAvailableDispatchers, User } from '../config/access'

export interface ShipperInfo {
  id: string
  companyName: string
  contactName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  businessType?: string
  paymentTerms?: string
  creditRating?: string
  specialInstructions?: string
}

export interface Load {
  id: string
  brokerId: string
  brokerName: string
  // Shipper Information
  shipperId?: string
  shipperInfo?: ShipperInfo
  dispatcherId?: string
  dispatcherName?: string
  origin: string
  destination: string
  rate: number
  distance: string
  weight: string
  equipment: string
  status: 'Draft' | 'Available' | 'Assigned' | 'Broadcasted' | 'Driver Selected' | 'Order Sent' | 'In Transit' | 'Delivered'
  pickupDate: string
  deliveryDate: string
  pickupTime?: string
  deliveryTime?: string
  specialInstructions?: string
  createdAt: string
  updatedAt: string
  assignedAt?: string
  // Real-time tracking fields
  trackingEnabled?: boolean
  currentLocation?: {
    lat: number
    lng: number
    timestamp: string
  }
  estimatedProgress?: number
  realTimeETA?: string
}

// Mock database - in production this would be a real database
let LOADS_DB: Load[] = [
  {
    id: 'FL-2025-001',
    brokerId: 'broker-001',
    brokerName: 'Global Freight Solutions',
    shipperId: 'SHIP-001',
    shipperInfo: {
      id: 'SHIP-001',
      companyName: 'ABC Manufacturing Corp',
      contactName: 'John Smith',
      email: 'john.smith@abcmfg.com',
      phone: '+1 (555) 123-4567',
      address: '123 Industrial Blvd',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30309',
      businessType: 'Manufacturing',
      paymentTerms: 'Net 30',
      creditRating: 'A+',
      specialInstructions: 'Loading dock available 6 AM - 6 PM weekdays'
    },
    dispatcherId: 'disp-001',
    dispatcherName: 'Sarah Johnson',
    origin: 'Atlanta, GA',
    destination: 'Miami, FL',
    rate: 2450,
    distance: '647 mi',
    weight: '45,000 lbs',
    equipment: 'Dry Van',
    status: 'Available',
    pickupDate: '2025-01-02',
    deliveryDate: '2025-01-03',
    createdAt: '2024-12-30T10:00:00Z',
    updatedAt: '2024-12-30T10:00:00Z'
  },
  {
    id: 'FL-2025-002',
    brokerId: 'broker-002',
    brokerName: 'Swift Freight',
    shipperId: 'SHIP-002',
    shipperInfo: {
      id: 'SHIP-002',
      companyName: 'Texas Steel Works',
      contactName: 'Maria Rodriguez',
      email: 'maria@texassteel.com',
      phone: '+1 (713) 555-9876',
      address: '456 Steel Drive',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      businessType: 'Steel Manufacturing',
      paymentTerms: 'Net 15',
      creditRating: 'A',
      specialInstructions: 'Heavy lifting equipment required'
    },
    dispatcherId: 'disp-001',
    dispatcherName: 'Sarah Johnson',
    origin: 'Chicago, IL',
    destination: 'Houston, TX',
    rate: 3200,
    distance: '925 mi',
    weight: '38,500 lbs',
    equipment: 'Reefer',
    status: 'Assigned',
    pickupDate: '2025-01-03',
    deliveryDate: '2025-01-05',
    assignedAt: '2024-12-30T14:30:00Z',
    createdAt: '2024-12-30T09:15:00Z',
    updatedAt: '2024-12-30T14:30:00Z'
  },
  {
    id: 'FL-2025-003',
    brokerId: 'broker-001',
    brokerName: 'Global Freight Solutions',
    shipperId: 'SHIP-003',
    shipperInfo: {
      id: 'SHIP-003',
      companyName: 'California Fresh Foods',
      contactName: 'David Chen',
      email: 'david@cafreshfoods.com',
      phone: '+1 (559) 555-2468',
      address: '789 Fruit Avenue',
      city: 'Fresno',
      state: 'CA',
      zipCode: '93701',
      businessType: 'Food Distribution',
      paymentTerms: 'Net 30',
      creditRating: 'A+',
      specialInstructions: 'Temperature controlled - maintain 34-38°F'
    },
    dispatcherId: 'disp-002',
    dispatcherName: 'Mike Thompson',
    origin: 'Fresno, CA',
    destination: 'Denver, CO',
    rate: 2800,
    distance: '1,150 mi',
    weight: '42,000 lbs',
    equipment: 'Reefer',
    status: 'In Transit',
    pickupDate: '2025-01-01',
    deliveryDate: '2025-01-02',
    assignedAt: '2024-12-29T08:00:00Z',
    createdAt: '2024-12-28T16:45:00Z',
    updatedAt: '2024-12-31T12:00:00Z',
    trackingEnabled: true,
    currentLocation: {
      lat: 39.0458,
      lng: -108.5506,
      timestamp: '2025-01-01T18:30:00Z'
    },
    estimatedProgress: 65,
    realTimeETA: '2025-01-02T08:00:00Z'
  },
  {
    id: 'FL-2025-004',
    brokerId: 'broker-003',
    brokerName: 'Global Cargo Solutions',
    shipperId: 'SHIP-004',
    shipperInfo: {
      id: 'SHIP-004',
      companyName: 'Auto Parts Express',
      contactName: 'Jennifer Wilson',
      email: 'jennifer@autopartsexpress.com',
      phone: '+1 (313) 555-1357',
      address: '321 Industrial Way',
      city: 'Detroit',
      state: 'MI',
      zipCode: '48201',
      businessType: 'Automotive Parts',
      paymentTerms: 'Net 45',
      creditRating: 'B+',
      specialInstructions: 'Fragile items - handle with care'
    },
    origin: 'Detroit, MI',
    destination: 'Jacksonville, FL',
    rate: 1950,
    distance: '1,050 mi',
    weight: '28,750 lbs',
    equipment: 'Dry Van',
    status: 'Available',
    pickupDate: '2025-01-05',
    deliveryDate: '2025-01-07',
    createdAt: '2024-12-31T14:20:00Z',
    updatedAt: '2024-12-31T14:20:00Z'
  },
  {
    id: 'FL-2025-005',
    brokerId: 'broker-002',
    brokerName: 'Swift Freight',
    shipperId: 'SHIP-005',
    shipperInfo: {
      id: 'SHIP-005',
      companyName: 'Northwest Lumber Co',
      contactName: 'Robert Anderson',
      email: 'robert@nwlumber.com',
      phone: '+1 (503) 555-3691',
      address: '987 Pine Street',
      city: 'Portland',
      state: 'OR',
      zipCode: '97201',
      businessType: 'Lumber & Building Materials',
      paymentTerms: 'Net 30',
      creditRating: 'A-',
      specialInstructions: 'Flatbed required - tarps provided'
    },
    dispatcherId: 'disp-001',
    dispatcherName: 'Sarah Johnson',
    origin: 'Portland, OR',
    destination: 'Phoenix, AZ',
    rate: 2200,
    distance: '1,015 mi',
    weight: '35,200 lbs',
    equipment: 'Flatbed',
    status: 'In Transit',
    pickupDate: '2024-12-30',
    deliveryDate: '2025-01-01',
    assignedAt: '2024-12-29T10:15:00Z',
    createdAt: '2024-12-28T11:30:00Z',
    updatedAt: '2024-12-30T09:45:00Z',
    trackingEnabled: true,
    currentLocation: {
      lat: 34.0522,
      lng: -118.2437,
      timestamp: '2025-01-01T14:15:00Z'
    },
    estimatedProgress: 85,
    realTimeETA: '2025-01-01T20:00:00Z'
  },
  {
    id: 'FL-2025-006',
    brokerId: 'broker-001',
    brokerName: 'Global Freight Solutions',
    shipperId: 'SHIP-006',
    shipperInfo: {
      id: 'SHIP-006',
      companyName: 'Eastern Electronics',
      contactName: 'Lisa Chang',
      email: 'lisa@easternelectronics.com',
      phone: '+1 (212) 555-7890',
      address: '654 Tech Plaza',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      businessType: 'Electronics',
      paymentTerms: 'Net 30',
      creditRating: 'A+',
      specialInstructions: 'High-value cargo - secure transport required'
    },
    dispatcherId: 'disp-002',
    dispatcherName: 'Mike Thompson',
    origin: 'New York, NY',
    destination: 'Los Angeles, CA',
    rate: 4500,
    distance: '2,790 mi',
    weight: '25,000 lbs',
    equipment: 'Dry Van',
    status: 'Delivered',
    pickupDate: '2024-12-28',
    deliveryDate: '2024-12-31',
    assignedAt: '2024-12-27T15:00:00Z',
    createdAt: '2024-12-26T13:15:00Z',
    updatedAt: '2024-12-31T16:30:00Z'
  }
]

// Generate unique load ID
export const generateLoadId = (): string => {
  const year = new Date().getFullYear()
  const count = LOADS_DB.length + 1
  return `FL-${year}-${count.toString().padStart(3, '0')}`
}

// Create new load with enhanced tracking capabilities
export const createLoad = (loadData: Omit<Load, 'id' | 'createdAt' | 'updatedAt' | 'brokerName' | 'dispatcherName'>): Load => {
  const { user } = getCurrentUser()
  const dispatchers = getAvailableDispatchers()
  const selectedDispatcher = loadData.dispatcherId ? dispatchers.find(d => d.id === loadData.dispatcherId) : null
  
  const newLoad: Load = {
    ...loadData,
    id: generateLoadId(),
    brokerName: user.name,
    dispatcherName: selectedDispatcher?.name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // Initialize tracking if enabled
    ...(loadData.trackingEnabled && {
      currentLocation: {
        lat: 33.7490, // Default Atlanta coordinates (would be set based on origin)
        lng: -84.3880,
        timestamp: new Date().toISOString()
      },
      estimatedProgress: 0,
      realTimeETA: loadData.deliveryDate
    })
  }
  
  LOADS_DB.push(newLoad)
  
  // Trigger notifications to relevant systems
  notifyDispatchCentral(newLoad)
  notifyBrokerBox(newLoad)
  
  // If tracking enabled, initialize tracking service
  if (loadData.trackingEnabled) {
    initializeLoadTracking(newLoad)
  }
  
  return newLoad
}

// Initialize tracking for a load
const initializeLoadTracking = (load: Load) => {
  console.log(`🛰️ Initializing real-time tracking for load ${load.id}`, {
    origin: load.origin,
    destination: load.destination,
    trackingEnabled: load.trackingEnabled
  })
  
  // In production, this would:
  // 1. Register the load with your GPS tracking service
  // 2. Set up geofencing for pickup/delivery locations
  // 3. Configure automated status updates
  // 4. Initialize real-time data streaming
}

// Update load
export const updateLoad = (loadId: string, updates: Partial<Load>): Load | null => {
  const loadIndex = LOADS_DB.findIndex(load => load.id === loadId)
  if (loadIndex === -1) return null
  
  const updatedLoad = {
    ...LOADS_DB[loadIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  
  // If dispatcher is being assigned/changed
  if (updates.dispatcherId && updates.dispatcherId !== LOADS_DB[loadIndex].dispatcherId) {
    const dispatchers = getAvailableDispatchers()
    const dispatcher = dispatchers.find(d => d.id === updates.dispatcherId)
    updatedLoad.dispatcherName = dispatcher?.name
    updatedLoad.assignedAt = new Date().toISOString()
    
    // Notify dispatch central of assignment
    notifyDispatchCentral(updatedLoad, 'assignment')
  }
  
  LOADS_DB[loadIndex] = updatedLoad
  
  // Trigger notifications
  notifyDispatchCentral(updatedLoad, 'update')
  notifyBrokerBox(updatedLoad, 'update')
  
  return updatedLoad
}

// Assign dispatcher to load
export const assignDispatcherToLoad = (loadId: string, dispatcherId: string): boolean => {
  const dispatchers = getAvailableDispatchers()
  const dispatcher = dispatchers.find(d => d.id === dispatcherId)
  
  if (!dispatcher) return false
  
  const result = updateLoad(loadId, {
    dispatcherId,
    dispatcherName: dispatcher.name,
    status: 'Available'
  })
  
  return result !== null
}

// Get loads for current user
export const getLoadsForUser = (): Load[] => {
  const { user, permissions } = getCurrentUser()
  
  if (permissions.canViewAllLoads) {
    // Dispatchers, managers, admins see all loads
    return LOADS_DB
  } else if (user.role === 'broker') {
    // Brokers see only their loads
    return LOADS_DB.filter(load => load.brokerId === user.brokerId)
  }
  
  return []
}

// Get loads by dispatcher
export const getLoadsByDispatcher = (dispatcherId: string): Load[] => {
  return LOADS_DB.filter(load => load.dispatcherId === dispatcherId)
}

// Get unassigned loads
export const getUnassignedLoads = (): Load[] => {
  return LOADS_DB.filter(load => !load.dispatcherId)
}

// Notification system (in production, these would be real notifications/webhooks)
const notifyDispatchCentral = (load: Load, action: 'create' | 'update' | 'assignment' = 'create') => {
  console.log(`🚨 Dispatch Central Notification: Load ${load.id} ${action}`, {
    loadId: load.id,
    broker: load.brokerName,
    dispatcher: load.dispatcherName,
    route: `${load.origin} → ${load.destination}`,
    status: load.status,
    action
  })
  
  // In production, this would send to dispatch central dashboard
  // updateDispatchBoard(load)
}

const notifyBrokerBox = (load: Load, action: 'create' | 'update' = 'create') => {
  console.log(`📦 Broker Box Notification: Load ${load.id} ${action}`, {
    loadId: load.id,
    dispatcher: load.dispatcherName,
    status: load.status,
    action
  })
  
  // In production, this would update broker dashboard
  // updateBrokerDashboard(load)
}

// Search loads
export const searchLoads = (query: string): Load[] => {
  const userLoads = getLoadsForUser()
  return userLoads.filter(load => 
    load.id.toLowerCase().includes(query.toLowerCase()) ||
    load.origin.toLowerCase().includes(query.toLowerCase()) ||
    load.destination.toLowerCase().includes(query.toLowerCase()) ||
    load.brokerName.toLowerCase().includes(query.toLowerCase()) ||
    (load.dispatcherName && load.dispatcherName.toLowerCase().includes(query.toLowerCase()))
  )
}

// Get load statistics
export const getLoadStats = () => {
  const userLoads = getLoadsForUser()
  
  return {
    total: userLoads.length,
    available: userLoads.filter(l => l.status === 'Available').length,
    assigned: userLoads.filter(l => l.status === 'Assigned').length,
    broadcasted: userLoads.filter(l => l.status === 'Broadcasted').length,
    driverSelected: userLoads.filter(l => l.status === 'Driver Selected').length,
    orderSent: userLoads.filter(l => l.status === 'Order Sent').length,
    inTransit: userLoads.filter(l => l.status === 'In Transit').length,
    delivered: userLoads.filter(l => l.status === 'Delivered').length,
    unassigned: userLoads.filter(l => !l.dispatcherId).length
  }
}
