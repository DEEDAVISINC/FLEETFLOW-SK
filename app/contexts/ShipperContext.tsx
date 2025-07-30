'use client';

import React, { ReactNode, createContext, useContext, useState } from 'react';
import { BrokerAgent, LoadRequest, Shipper } from '../types/shipper';

interface ShipperContextType {
  shippers: Shipper[];
  setShippers: React.Dispatch<React.SetStateAction<Shipper[]>>;
  selectedShipper: Shipper | null;
  setSelectedShipper: React.Dispatch<React.SetStateAction<Shipper | null>>;
  loadRequests: LoadRequest[];
  setLoadRequests: React.Dispatch<React.SetStateAction<LoadRequest[]>>;
  brokerAgents: BrokerAgent[];
  setBrokerAgents: React.Dispatch<React.SetStateAction<BrokerAgent[]>>;
}

const ShipperContext = createContext<ShipperContextType | undefined>(undefined);

// Mock data
const mockBrokerAgents: BrokerAgent[] = [
  {
    id: 'broker-001',
    name: 'Sarah Johnson',
    email: 'sarah.j@fleetflow.com',
    phone: '(555) 123-4567',
    hireDate: '2023-01-15',
    status: 'active',
    shippers: ['GMC-204-070', 'FPD-204-040'],
    totalRevenue: 2500000,
    activeLoads: 12,
  },
  {
    id: 'broker-002',
    name: 'Mike Chen',
    email: 'mike.c@fleetflow.com',
    phone: '(555) 234-5678',
    hireDate: '2023-03-20',
    status: 'active',
    shippers: ['TES-204-085'],
    totalRevenue: 1800000,
    activeLoads: 8,
  },
];

const mockShippers: Shipper[] = [
  {
    id: 'GMC-204-070',
    companyName: 'Global Manufacturing Corp',
    taxId: '12-3456789',
    contacts: [
      {
        id: 'contact-001',
        name: 'John Smith',
        email: 'john.smith@globalmanuf.com',
        phone: '(555) 987-6543',
        title: 'Logistics Manager',
        isPrimary: true,
      },
    ],
    locations: [
      {
        id: 'loc-001',
        name: 'Main Warehouse',
        address: '123 Industrial Blvd',
        city: 'Chicago',
        state: 'IL',
        zip: '60601',
        contactName: 'John Smith',
        contactPhone: '(555) 987-6543',
        operatingHours: 'Mon-Fri 8AM-5PM',
        specialInstructions: 'Dock 5 for LTL, Dock 10 for FTL',
      },
    ],
    commodities: [
      {
        name: 'Steel Components',
        freightClass: '125',
        description: 'Fabricated steel parts and components',
        hazmat: false,
        temperature: 'ambient',
      },
      {
        name: 'Machinery Parts',
        freightClass: '85',
        description: 'Heavy machinery components',
        hazmat: false,
        temperature: 'ambient',
      },
    ],
    paymentTerms: 'Net 30',
    creditLimit: 500000,
    creditRating: 'A',
    preferredLanes: [
      'Chicago-Atlanta',
      'Chicago-Dallas',
      'Chicago-Los Angeles',
    ],
    loadRequests: [],
    assignedBrokerId: 'broker-001',
    assignedBrokerName: 'Sarah Johnson',
    status: 'active',
    joinDate: '2023-06-15',
    lastActivity: '2024-12-25',
    totalLoads: 145,
    totalRevenue: 2100000,
    averageRate: 14482,
    notes: 'Preferred customer - always pays on time',
  },
  {
    id: 'FPD-204-040',
    companyName: 'FreshProduce Distributors',
    taxId: '98-7654321',
    contacts: [
      {
        id: 'contact-002',
        name: 'Maria Rodriguez',
        email: 'maria.r@freshproduce.com',
        phone: '(555) 456-7890',
        title: 'Supply Chain Director',
        isPrimary: true,
      },
    ],
    locations: [
      {
        id: 'loc-002',
        name: 'Cold Storage Facility',
        address: '456 Refrigeration Way',
        city: 'Fresno',
        state: 'CA',
        zip: '93701',
        contactName: 'Maria Rodriguez',
        contactPhone: '(555) 456-7890',
        operatingHours: '24/7',
        specialInstructions:
          'Temperature monitoring required - maintain 34-38°F',
      },
    ],
    commodities: [
      {
        name: 'Fresh Vegetables',
        freightClass: '55',
        description: 'Fresh produce - vegetables',
        hazmat: false,
        temperature: 'refrigerated',
        specialHandling: ['temperature_controlled', 'time_sensitive'],
      },
    ],
    paymentTerms: 'Net 15',
    creditLimit: 300000,
    creditRating: 'A',
    preferredLanes: ['Fresno-Phoenix', 'Fresno-Denver', 'Fresno-Seattle'],
    loadRequests: [],
    assignedBrokerId: 'broker-001',
    assignedBrokerName: 'Sarah Johnson',
    status: 'active',
    joinDate: '2023-08-20',
    lastActivity: '2024-12-24',
    totalLoads: 89,
    totalRevenue: 890000,
    averageRate: 10000,
    notes: 'Requires reefer equipment only',
  },
  {
    id: 'TES-204-085',
    companyName: 'TechEquipment Solutions',
    taxId: '55-9876543',
    contacts: [
      {
        id: 'contact-003',
        name: 'David Kim',
        email: 'david.kim@techequip.com',
        phone: '(555) 321-0987',
        title: 'Operations Manager',
        isPrimary: true,
      },
    ],
    locations: [
      {
        id: 'loc-003',
        name: 'Distribution Center',
        address: '789 Technology Drive',
        city: 'Austin',
        state: 'TX',
        zip: '73301',
        contactName: 'David Kim',
        contactPhone: '(555) 321-0987',
        operatingHours: 'Mon-Fri 7AM-6PM',
        specialInstructions: 'White glove service required for electronics',
      },
    ],
    commodities: [
      {
        name: 'Electronic Equipment',
        freightClass: '92.5',
        description: 'Computer and electronic equipment',
        hazmat: false,
        temperature: 'ambient',
        specialHandling: ['fragile', 'high_value'],
      },
    ],
    paymentTerms: 'Net 30',
    creditLimit: 750000,
    creditRating: 'B',
    preferredLanes: ['Austin-Miami', 'Austin-New York', 'Austin-Los Angeles'],
    loadRequests: [],
    assignedBrokerId: 'broker-002',
    assignedBrokerName: 'Mike Chen',
    status: 'active',
    joinDate: '2023-11-10',
    lastActivity: '2024-12-23',
    totalLoads: 67,
    totalRevenue: 1340000,
    averageRate: 20000,
    notes: 'High-value loads require additional insurance',
  },
  {
    id: 'APE-204-065',
    companyName: 'Automotive Parts Express',
    taxId: '33-4567890',
    contacts: [
      {
        id: 'contact-004',
        name: 'Lisa Thompson',
        email: 'lisa.t@autopartsexpress.com',
        phone: '(555) 654-3210',
        title: 'Logistics Coordinator',
        isPrimary: true,
      },
    ],
    locations: [
      {
        id: 'loc-004',
        name: 'Main Warehouse',
        address: '321 Auto Parts Blvd',
        city: 'Detroit',
        state: 'MI',
        zip: '48201',
        contactName: 'Lisa Thompson',
        contactPhone: '(555) 654-3210',
        operatingHours: 'Mon-Fri 6AM-8PM, Sat 8AM-4PM',
        specialInstructions: 'Heavy equipment available for loading, dock 3-7',
      },
    ],
    commodities: [
      {
        name: 'Automotive Parts',
        freightClass: '70',
        description: 'Engine parts, transmissions, and automotive components',
        hazmat: false,
        temperature: 'ambient',
      },
      {
        name: 'Heavy Machinery',
        freightClass: '150',
        description: 'Large automotive assembly equipment',
        hazmat: false,
        temperature: 'ambient',
        specialHandling: ['oversized', 'heavy_lift'],
      },
    ],
    paymentTerms: 'Net 30',
    creditLimit: 400000,
    creditRating: 'A',
    preferredLanes: ['Detroit-Chicago', 'Detroit-Atlanta', 'Detroit-Dallas'],
    loadRequests: [],
    assignedBrokerId: 'broker-js001',
    assignedBrokerName: 'John Smith',
    status: 'active',
    joinDate: '2023-09-15',
    lastActivity: '2024-12-26',
    totalLoads: 112,
    totalRevenue: 1680000,
    averageRate: 15000,
    notes: 'Regular weekly shipments, prefers flatbed equipment',
  },
  {
    id: 'PSC-204-090',
    companyName: 'Pharmaceutical Supply Co',
    taxId: '77-1234567',
    contacts: [
      {
        id: 'contact-005',
        name: 'Dr. Robert Chen',
        email: 'robert.chen@pharmasupply.com',
        phone: '(555) 789-0123',
        title: 'Supply Chain Director',
        isPrimary: true,
      },
    ],
    locations: [
      {
        id: 'loc-005',
        name: 'Pharmaceutical Distribution Center',
        address: '555 Medical Center Drive',
        city: 'Boston',
        state: 'MA',
        zip: '02101',
        contactName: 'Dr. Robert Chen',
        contactPhone: '(555) 789-0123',
        operatingHours: 'Mon-Fri 8AM-6PM',
        specialInstructions:
          'Temperature-controlled environment required, security clearance needed',
      },
    ],
    commodities: [
      {
        name: 'Pharmaceutical Products',
        freightClass: '60',
        description: 'Prescription medications and medical supplies',
        hazmat: false,
        temperature: 'refrigerated',
        specialHandling: [
          'temperature_controlled',
          'time_sensitive',
          'high_security',
        ],
      },
    ],
    paymentTerms: 'Net 15',
    creditLimit: 1000000,
    creditRating: 'A',
    preferredLanes: ['Boston-New York', 'Boston-Washington DC', 'Boston-Miami'],
    loadRequests: [],
    assignedBrokerId: 'broker-js001',
    assignedBrokerName: 'John Smith',
    status: 'active',
    joinDate: '2023-07-22',
    lastActivity: '2024-12-27',
    totalLoads: 78,
    totalRevenue: 2340000,
    averageRate: 30000,
    notes: 'Critical medical supplies - highest priority shipping required',
  },
];

export function ShipperProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [shippers, setShippers] = useState<Shipper[]>(mockShippers);
  const [selectedShipper, setSelectedShipper] = useState<Shipper | null>(null);
  const [loadRequests, setLoadRequests] = useState<LoadRequest[]>([]);
  const [brokerAgents, setBrokerAgents] =
    useState<BrokerAgent[]>(mockBrokerAgents);

  // Ensure client-side hydration
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>{children}</div>; // Return children without context during hydration
  }

  return (
    <ShipperContext.Provider
      value={{
        shippers,
        setShippers,
        selectedShipper,
        setSelectedShipper,
        loadRequests,
        setLoadRequests,
        brokerAgents,
        setBrokerAgents,
      }}
    >
      {children}
    </ShipperContext.Provider>
  );
}

export function useShipper() {
  const context = useContext(ShipperContext);
  if (context === undefined) {
    // Check if we're in a server environment or during hydration
    if (typeof window === 'undefined') {
      // Return default values for server-side rendering
      return {
        shippers: [],
        setShippers: () => {},
        selectedShipper: null,
        setSelectedShipper: () => {},
        loadRequests: [],
        setLoadRequests: () => {},
        brokerAgents: [],
        setBrokerAgents: () => {},
      };
    }
    throw new Error('useShipper must be used within a ShipperProvider');
  }
  return context;
}
