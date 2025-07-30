// Shipper Management Service - Centralized shipper operations
import { ShipperInfo } from './loadService'

// Mock shipper database - in production this would be a real database
let SHIPPERS_DB: ShipperInfo[] = [
  {
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
  {
    id: 'SHIP-002',
    companyName: 'Retail Distribution Inc',
    contactName: 'Sarah Johnson',
    email: 'sarah.johnson@retaildist.com',
    phone: '+1 (555) 234-5678',
    address: '456 Commerce Street',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    businessType: 'Retail Distribution',
    paymentTerms: 'Net 15',
    creditRating: 'A',
    specialInstructions: 'Requires appointment for pickup'
  },
  {
    id: 'SHIP-003',
    companyName: 'Tech Solutions LLC',
    contactName: 'Mike Davis',
    email: 'mike.davis@techsolutions.com',
    phone: '+1 (555) 345-6789',
    address: '789 Technology Drive',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    businessType: 'Technology',
    paymentTerms: 'Net 30',
    creditRating: 'A-',
    specialInstructions: 'Fragile electronics - handle with care'
  },
  {
    id: 'SHIP-004',
    companyName: 'Food Processing Co',
    contactName: 'Lisa Wilson',
    email: 'lisa.wilson@foodprocessing.com',
    phone: '+1 (555) 456-7890',
    address: '321 Processing Plant Rd',
    city: 'Phoenix',
    state: 'AZ',
    zipCode: '85001',
    businessType: 'Food Processing',
    paymentTerms: 'Net 21',
    creditRating: 'B+',
    specialInstructions: 'Temperature controlled required - keep frozen'
  },
  {
    id: 'SHIP-005',
    companyName: 'Automotive Parts Direct',
    contactName: 'Robert Brown',
    email: 'robert.brown@autoparts.com',
    phone: '+1 (555) 567-8901',
    address: '654 Auto Parts Way',
    city: 'Detroit',
    state: 'MI',
    zipCode: '48201',
    businessType: 'Automotive',
    paymentTerms: 'Net 45',
    creditRating: 'A',
    specialInstructions: 'Heavy parts - ensure proper loading equipment'
  }
]

// Service functions
export const shipperService = {
  // Get all shippers
  getAllShippers: (): ShipperInfo[] => {
    return [...SHIPPERS_DB]
  },

  // Get shipper by ID
  getShipperById: (id: string): ShipperInfo | null => {
    return SHIPPERS_DB.find(shipper => shipper.id === id) || null
  },

  // Search shippers by company name
  searchShippers: (searchTerm: string): ShipperInfo[] => {
    const term = searchTerm.toLowerCase()
    return SHIPPERS_DB.filter(shipper =>
      shipper.companyName.toLowerCase().includes(term) ||
      shipper.contactName.toLowerCase().includes(term) ||
      shipper.city.toLowerCase().includes(term) ||
      shipper.state.toLowerCase().includes(term)
    )
  },

  // Add new shipper
  addShipper: (shipperData: Omit<ShipperInfo, 'id'>): ShipperInfo => {
    const newShipper: ShipperInfo = {
      id: `SHIP-${String(SHIPPERS_DB.length + 1).padStart(3, '0')}`,
      ...shipperData
    }
    SHIPPERS_DB.push(newShipper)
    return newShipper
  },

  // Update shipper
  updateShipper: (id: string, updates: Partial<ShipperInfo>): ShipperInfo | null => {
    const index = SHIPPERS_DB.findIndex(shipper => shipper.id === id)
    if (index === -1) return null

    SHIPPERS_DB[index] = { ...SHIPPERS_DB[index], ...updates }
    return SHIPPERS_DB[index]
  },

  // Delete shipper
  deleteShipper: (id: string): boolean => {
    const index = SHIPPERS_DB.findIndex(shipper => shipper.id === id)
    if (index === -1) return false

    SHIPPERS_DB.splice(index, 1)
    return true
  },

  // Get shippers by broker (if needed for broker-specific relationships)
  getShippersByBroker: (brokerId: string): ShipperInfo[] => {
    // In a real implementation, this would filter by broker relationships
    // For now, return all shippers as available to all brokers
    return [...SHIPPERS_DB]
  }
}

export default shipperService
