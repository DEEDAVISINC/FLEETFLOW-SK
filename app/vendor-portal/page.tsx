'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReceiverNotificationService from '../services/ReceiverNotificationService';

interface VendorSession {
  shipperId: string;
  companyName: string;
  loginTime: string;
}

// Warehouse Interfaces
interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  location: {
    zone: string;
    bin: string;
    aisle: string;
  };
  quantity: {
    available: number;
    reserved: number;
    damaged: number;
    total: number;
  };
  unit: string;
  unitCost: number;
  supplier: string;
  lastUpdated: string;
  minStockLevel: number;
  maxStockLevel: number;
  requiresLabeling: boolean;
  labelType: 'shipping' | 'product' | 'hazardous' | 'custom' | null;
  hazardousMaterial: boolean;
  temperatureControlled: boolean;
}

interface WarehouseLocation {
  id: string;
  name: string;
  zone: string;
  aisle: string;
  bin: string;
  capacity: {
    total: number;
    used: number;
    available: number;
  };
  temperatureZone: 'ambient' | 'refrigerated' | 'frozen';
  hazardousStorage: boolean;
  status: 'active' | 'maintenance' | 'full';
}

interface PickingAssignment {
  id: string;
  loadId: string;
  shipmentId: string;
  assignedTo: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  items: Array<{
    sku: string;
    name: string;
    quantity: number;
    location: string;
    picked: number;
    status: 'pending' | 'picked' | 'packed' | 'shipped';
  }>;
  startTime: string;
  estimatedCompletion: string;
  actualCompletion?: string;
  notes: string;
}

interface LabelingOperation {
  id: string;
  type: 'shipping' | 'product' | 'hazardous' | 'custom';
  loadId: string;
  shipmentId: string;
  items: Array<{
    sku: string;
    name: string;
    quantity: number;
    labelContent: string;
    complianceRequired: boolean;
  }>;
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo: string;
  startTime: string;
  completionTime?: string;
  complianceNotes: string;
  labelFormat: 'thermal' | 'laser' | 'inkjet';
  customFields: Record<string, string>;
}

interface WarehouseShipment {
  id: string;
  loadId: string;
  shipmentNumber: string;
  destination: string;
  carrier: string;
  status:
    | 'pending'
    | 'picking'
    | 'packing'
    | 'labeled'
    | 'shipped'
    | 'delivered';
  items: Array<{
    sku: string;
    name: string;
    quantity: number;
    status: 'pending' | 'picked' | 'packed' | 'labeled' | 'shipped';
  }>;
  totalWeight: number;
  totalVolume: number;
  specialRequirements: string[];
  createdDate: string;
  shipDate?: string;
  deliveryDate?: string;
  trackingNumber?: string;
}

interface WarehouseActivity {
  id: string;
  timestamp: string;
  type:
    | 'inbound'
    | 'outbound'
    | 'transfer'
    | 'adjustment'
    | 'picking'
    | 'packing'
    | 'labeling'
    | 'shipping';
  userId: string;
  userName: string;
  itemId?: string;
  sku?: string;
  quantity: number;
  fromLocation?: string;
  toLocation?: string;
  loadId?: string;
  shipmentId?: string;
  notes: string;
  systemGenerated: boolean;
}

// Receiver Integration Interfaces
interface ReceiverContact {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  preferredDeliveryTime: string;
  specialInstructions: string;
  communicationPreference: 'sms' | 'email' | 'both';
  isActive: boolean;
}

interface LiveShipmentTracking {
  id: string;
  shipmentId: string;
  loadId: string;
  receiverName: string;
  receiverPhone: string;
  receiverEmail: string;
  status:
    | 'loading'
    | 'in-transit'
    | 'out-for-delivery'
    | 'delivered'
    | 'delayed';
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  destination: {
    lat: number;
    lng: number;
    address: string;
  };
  estimatedArrival: string;
  driverName: string;
  driverPhone: string;
  vehicleInfo: string;
  progress: number;
  lastUpdate: string;
  deliveryInstructions: string;
  communicationHistory: ReceiverMessage[];
}

interface ReceiverMessage {
  id: string;
  timestamp: string;
  sender: 'vendor' | 'driver' | 'receiver';
  senderName: string;
  message: string;
  type: 'sms' | 'email' | 'system_notification';
  status: 'sent' | 'delivered' | 'read';
}

interface DeliveryNotification {
  id: string;
  shipmentId: string;
  receiverId: string;
  type: 'eta_update' | 'departure' | 'arrival' | 'delay' | 'delivery_complete';
  message: string;
  scheduledTime: string;
  actualTime?: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  method: 'sms' | 'email' | 'both';
}

export default function VendorPortalPage() {
  const [session, setSession] = useState<VendorSession | null>({
    shipperId: 'demo-shipper-123',
    companyName: 'Demo Shipper Corp',
    loginTime: new Date().toISOString(),
  });
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'operations'
    | 'financials'
    | 'analytics'
    | 'integrations'
    | 'settings'
    | 'warehouse'
    | 'receiver-tracking'
  >('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [newUserData, setNewUserData] = useState({});
  const [userAccess, setUserAccess] = useState([
    {
      id: 'USR-001',
      name: 'John Smith',
      email: 'john@demo-shipper.com',
      role: 'primary' as const,
      permissions: {
        viewLoads: true,
        submitRequests: true,
        viewFinancials: true,
        manageUsers: true,
        accessAnalytics: true,
        warehouseAccess: true,
      },
      lastLogin: '2024-01-15T10:30:00Z',
      isActive: true,
    },
    {
      id: 'USR-002',
      name: 'Sarah Johnson',
      email: 'sarah@demo-shipper.com',
      role: 'secondary' as const,
      permissions: {
        viewLoads: true,
        submitRequests: true,
        viewFinancials: false,
        manageUsers: false,
        accessAnalytics: false,
        warehouseAccess: false,
      },
      lastLogin: '2024-01-14T15:45:00Z',
      isActive: true,
    },
  ]);

  // Mock document data
  const [documents, setDocuments] = useState([
    {
      id: 'DOC-001',
      documentType: 'insurance_certificate',
      fileName: 'Insurance_Certificate_2024.pdf',
      uploadDate: '2024-01-10T09:00:00Z',
      status: 'approved',
      brokerReview: 'Document approved - coverage meets requirements',
      fileSize: '2.4 MB',
    },
    {
      id: 'DOC-002',
      documentType: 'contract',
      fileName: 'Carrier_Agreement_2024.pdf',
      uploadDate: '2024-01-08T14:30:00Z',
      status: 'pending',
      brokerReview: 'Under review - terms look good',
      fileSize: '1.8 MB',
    },
    {
      id: 'DOC-003',
      documentType: 'bol',
      fileName: 'BOL_Load_12345.pdf',
      uploadDate: '2024-01-12T11:15:00Z',
      status: 'approved',
      brokerReview: 'BOL completed correctly',
      fileSize: '0.9 MB',
    },
  ]);

  // Mock financial data
  const [financialData] = useState({
    outstandingInvoices: [
      {
        id: 'INV-001',
        loadId: 'LF-25001-ATLMIA-WMT-DVFL-001',
        amount: 2800,
        dueDate: '2024-02-15',
        status: 'pending',
        description: 'Freight charges for Atlanta to Miami route',
      },
      {
        id: 'INV-002',
        loadId: 'LF-25002-CHIMIA-WMT-DVFL-002',
        amount: 3200,
        dueDate: '2024-02-20',
        status: 'pending',
        description: 'Express delivery charges',
      },
    ],
    paymentHistory: [
      {
        id: 'PAY-001',
        date: '2024-01-15',
        amount: 2500,
        method: 'ACH',
        status: 'completed',
        reference: 'INV-2024-001',
      },
      {
        id: 'PAY-002',
        date: '2024-01-10',
        amount: 1800,
        method: 'Wire Transfer',
        status: 'completed',
        reference: 'INV-2024-002',
      },
    ],
    creditLimit: 50000,
    availableCredit: 42000,
    paymentTerms: 'Net 30',
    totalSpent: 125000,
    averageRate: 2850,
    onTimePaymentRate: 95,
  });

  // Warehouse State Data
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: 'INV-001',
      sku: 'WMT-ELEC-001',
      name: 'Samsung 55" Smart TV',
      description: '4K Ultra HD Smart LED TV with HDR',
      category: 'Electronics',
      location: { zone: 'A', bin: 'A1-05', aisle: 'A1' },
      quantity: { available: 45, reserved: 12, damaged: 2, total: 59 },
      unit: 'pieces',
      unitCost: 499.99,
      supplier: 'Samsung Electronics',
      lastUpdated: '2024-01-15T14:30:00Z',
      minStockLevel: 20,
      maxStockLevel: 100,
      requiresLabeling: true,
      labelType: 'product',
      hazardousMaterial: false,
      temperatureControlled: false,
    },
    {
      id: 'INV-002',
      sku: 'WMT-CLTH-002',
      name: 'Nike Air Max Running Shoes',
      description: "Men's size 10 running shoes",
      category: 'Apparel',
      location: { zone: 'B', bin: 'B2-12', aisle: 'B2' },
      quantity: { available: 78, reserved: 25, damaged: 0, total: 103 },
      unit: 'pairs',
      unitCost: 129.99,
      supplier: 'Nike Inc.',
      lastUpdated: '2024-01-15T16:45:00Z',
      minStockLevel: 30,
      maxStockLevel: 150,
      requiresLabeling: true,
      labelType: 'product',
      hazardousMaterial: false,
      temperatureControlled: false,
    },
    {
      id: 'INV-003',
      sku: 'WMT-CHEM-003',
      name: 'Industrial Cleaning Solution',
      description: '5-gallon industrial cleaning chemical',
      category: 'Chemicals',
      location: { zone: 'H', bin: 'H1-03', aisle: 'H1' },
      quantity: { available: 15, reserved: 8, damaged: 1, total: 24 },
      unit: 'gallons',
      unitCost: 89.99,
      supplier: 'ChemCorp Industries',
      lastUpdated: '2024-01-15T12:15:00Z',
      minStockLevel: 10,
      maxStockLevel: 50,
      requiresLabeling: true,
      labelType: 'hazardous',
      hazardousMaterial: true,
      temperatureControlled: false,
    },
    {
      id: 'INV-004',
      sku: 'WMT-FOOD-004',
      name: 'Organic Frozen Berries',
      description: 'Mixed organic berries, 2lb package',
      category: 'Food & Beverage',
      location: { zone: 'F', bin: 'F3-08', aisle: 'F3' },
      quantity: { available: 120, reserved: 45, damaged: 3, total: 168 },
      unit: 'packages',
      unitCost: 12.99,
      supplier: 'FreshFarms Organic',
      lastUpdated: '2024-01-15T18:20:00Z',
      minStockLevel: 50,
      maxStockLevel: 200,
      requiresLabeling: true,
      labelType: 'product',
      hazardousMaterial: false,
      temperatureControlled: true,
    },
  ]);

  const [warehouseLocations, setWarehouseLocations] = useState<
    WarehouseLocation[]
  >([
    {
      id: 'LOC-001',
      name: 'Zone A - Electronics',
      zone: 'A',
      aisle: 'A1',
      bin: 'A1-01',
      capacity: { total: 1000, used: 650, available: 350 },
      temperatureZone: 'ambient',
      hazardousStorage: false,
      status: 'active',
    },
    {
      id: 'LOC-002',
      name: 'Zone B - Apparel',
      zone: 'B',
      aisle: 'B2',
      bin: 'B2-12',
      capacity: { total: 800, used: 520, available: 280 },
      temperatureZone: 'ambient',
      hazardousStorage: false,
      status: 'active',
    },
    {
      id: 'LOC-003',
      name: 'Zone H - Hazardous Materials',
      zone: 'H',
      aisle: 'H1',
      bin: 'H1-03',
      capacity: { total: 200, used: 180, available: 20 },
      temperatureZone: 'ambient',
      hazardousStorage: true,
      status: 'active',
    },
    {
      id: 'LOC-004',
      name: 'Zone F - Frozen Storage',
      zone: 'F',
      aisle: 'F3',
      bin: 'F3-08',
      capacity: { total: 500, used: 320, available: 180 },
      temperatureZone: 'frozen',
      hazardousStorage: false,
      status: 'active',
    },
  ]);

  const [pickingAssignments, setPickingAssignments] = useState<
    PickingAssignment[]
  >([
    {
      id: 'PICK-001',
      loadId: 'LF-25001-ATLMIA-WMT-DVFL-001',
      shipmentId: 'SHP-001',
      assignedTo: 'Mike Johnson',
      status: 'in_progress',
      priority: 'high',
      items: [
        {
          sku: 'WMT-ELEC-001',
          name: 'Samsung 55" Smart TV',
          quantity: 8,
          location: 'A1-05',
          picked: 6,
          status: 'picked',
        },
        {
          sku: 'WMT-CLTH-002',
          name: 'Nike Air Max Running Shoes',
          quantity: 15,
          location: 'B2-12',
          picked: 12,
          status: 'picked',
        },
      ],
      startTime: '2024-01-15T08:00:00Z',
      estimatedCompletion: '2024-01-15T14:00:00Z',
      notes: 'Priority shipment for Miami delivery',
    },
  ]);

  const [labelingOperations, setLabelingOperations] = useState<
    LabelingOperation[]
  >([
    {
      id: 'LABEL-001',
      type: 'shipping',
      loadId: 'LF-25001-ATLMIA-WMT-DVFL-001',
      shipmentId: 'SHP-001',
      items: [
        {
          sku: 'WMT-ELEC-001',
          name: 'Samsung 55" Smart TV',
          quantity: 8,
          labelContent: 'Fragile - Handle with Care',
          complianceRequired: true,
        },
        {
          sku: 'WMT-CLTH-002',
          name: 'Nike Air Max Running Shoes',
          quantity: 15,
          labelContent: 'Standard Shipping',
          complianceRequired: false,
        },
      ],
      status: 'in_progress',
      assignedTo: 'Lisa Chen',
      startTime: '2024-01-15T10:30:00Z',
      complianceNotes: 'Electronics require special handling labels',
      labelFormat: 'thermal',
      customFields: {
        shipping_class: 'express',
        handling_instructions: 'fragile',
        destination: 'Miami, FL',
      },
    },
  ]);

  const [warehouseShipments, setWarehouseShipments] = useState<
    WarehouseShipment[]
  >([
    {
      id: 'SHP-001',
      loadId: 'LF-25001-ATLMIA-WMT-DVFL-001',
      shipmentNumber: 'SHP-2024-001',
      destination: 'Miami, FL',
      carrier: 'Demo Carrier Corp',
      status: 'packing',
      items: [
        {
          sku: 'WMT-ELEC-001',
          name: 'Samsung 55" Smart TV',
          quantity: 8,
          status: 'picked',
        },
        {
          sku: 'WMT-CLTH-002',
          name: 'Nike Air Max Running Shoes',
          quantity: 15,
          status: 'picked',
        },
      ],
      totalWeight: 450,
      totalVolume: 12.5,
      specialRequirements: ['Fragile handling', 'Temperature controlled'],
      createdDate: '2024-01-15T07:00:00Z',
      shipDate: '2024-01-16T08:00:00Z',
      deliveryDate: '2024-01-18T14:00:00Z',
      trackingNumber: 'TRK-2024-001',
    },
  ]);

  const [warehouseActivity, setWarehouseActivity] = useState<
    WarehouseActivity[]
  >([
    {
      id: 'ACT-001',
      timestamp: '2024-01-15T08:00:00Z',
      type: 'picking',
      userId: 'USR-003',
      userName: 'Mike Johnson',
      itemId: 'INV-001',
      sku: 'WMT-ELEC-001',
      quantity: 6,
      fromLocation: 'A1-05',
      toLocation: 'Picking Station 1',
      loadId: 'LF-25001-ATLMIA-WMT-DVFL-001',
      shipmentId: 'SHP-001',
      notes: 'Started picking for Miami shipment',
      systemGenerated: false,
    },
    {
      id: 'ACT-002',
      timestamp: '2024-01-15T10:30:00Z',
      type: 'labeling',
      userId: 'USR-004',
      userName: 'Lisa Chen',
      itemId: 'INV-001',
      sku: 'WMT-ELEC-001',
      quantity: 6,
      fromLocation: 'Picking Station 1',
      toLocation: 'Labeling Station 1',
      loadId: 'LF-25001-ATLMIA-WMT-DVFL-001',
      shipmentId: 'SHP-001',
      notes: 'Applied fragile handling labels',
      systemGenerated: false,
    },
    {
      id: 'ACT-003',
      timestamp: '2024-01-15T11:45:00Z',
      type: 'outbound',
      userId: 'USR-003',
      userName: 'Mike Johnson',
      itemId: 'INV-002',
      sku: 'WMT-CLTH-002',
      quantity: 12,
      fromLocation: 'B2-12',
      toLocation: 'Picking Station 1',
      loadId: 'LF-25001-ATLMIA-WMT-DVFL-001',
      shipmentId: 'SHP-001',
      notes: 'Continued picking for Miami shipment',
      systemGenerated: false,
    },
  ]);

  // Receiver tracking mock data
  const [receiverContacts, setReceiverContacts] = useState<ReceiverContact[]>([
    {
      id: 'RCV-001',
      name: 'John Martinez',
      company: 'Miami Distribution Center',
      phone: '(305) 555-0123',
      email: 'john.martinez@miamidist.com',
      address: {
        street: '1500 NW 7th Ave',
        city: 'Miami',
        state: 'FL',
        zipCode: '33136',
      },
      preferredDeliveryTime: '08:00-12:00',
      specialInstructions: 'Use dock door #3. Call 15 minutes before arrival.',
      communicationPreference: 'both',
      isActive: true,
    },
    {
      id: 'RCV-002',
      name: 'Sarah Johnson',
      company: 'Chicago Logistics Hub',
      phone: '(312) 555-0456',
      email: 'sarah.j@chicagologistics.com',
      address: {
        street: '2800 S Western Ave',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60608',
      },
      preferredDeliveryTime: '13:00-17:00',
      specialInstructions: 'Appointment required. Contact security first.',
      communicationPreference: 'sms',
      isActive: true,
    },
  ]);

  const [liveShipments, setLiveShipments] = useState<LiveShipmentTracking[]>([
    {
      id: 'LST-001',
      shipmentId: 'SHP-001',
      loadId: 'LF-25001-ATLMIA-WMT-DVFL-001',
      receiverName: 'John Martinez',
      receiverPhone: '(305) 555-0123',
      receiverEmail: 'john.martinez@miamidist.com',
      status: 'in-transit',
      currentLocation: {
        lat: 28.5383,
        lng: -81.3792,
        address: 'Orlando, FL - I-4 Rest Area',
      },
      destination: {
        lat: 25.7617,
        lng: -80.1918,
        address: '1500 NW 7th Ave, Miami, FL 33136',
      },
      estimatedArrival: '2024-01-15T14:30:00Z',
      driverName: 'Mike Rodriguez',
      driverPhone: '(555) 123-4567',
      vehicleInfo: 'Truck #T-456 - White Freightliner',
      progress: 75,
      lastUpdate: '2024-01-15T12:15:00Z',
      deliveryInstructions: 'Use dock door #3. Call 15 minutes before arrival.',
      communicationHistory: [
        {
          id: 'MSG-001',
          timestamp: '2024-01-15T10:30:00Z',
          sender: 'vendor',
          senderName: 'Demo Shipper Corp',
          message: 'Your delivery is on schedule. ETA: 2:30 PM',
          type: 'sms',
          status: 'delivered',
        },
        {
          id: 'MSG-002',
          timestamp: '2024-01-15T12:00:00Z',
          sender: 'driver',
          senderName: 'Mike Rodriguez',
          message: 'About 2 hours out. Traffic is light.',
          type: 'sms',
          status: 'delivered',
        },
      ],
    },
    {
      id: 'LST-002',
      shipmentId: 'SHP-002',
      loadId: 'LF-25002-CHIMIA-WMT-DVFL-002',
      receiverName: 'Sarah Johnson',
      receiverPhone: '(312) 555-0456',
      receiverEmail: 'sarah.j@chicagologistics.com',
      status: 'out-for-delivery',
      currentLocation: {
        lat: 41.8781,
        lng: -87.6298,
        address: 'Chicago, IL - Downtown',
      },
      destination: {
        lat: 41.85,
        lng: -87.65,
        address: '2800 S Western Ave, Chicago, IL 60608',
      },
      estimatedArrival: '2024-01-15T16:00:00Z',
      driverName: 'Lisa Chen',
      driverPhone: '(555) 987-6543',
      vehicleInfo: 'Truck #T-789 - Blue Volvo',
      progress: 95,
      lastUpdate: '2024-01-15T13:45:00Z',
      deliveryInstructions: 'Appointment required. Contact security first.',
      communicationHistory: [
        {
          id: 'MSG-003',
          timestamp: '2024-01-15T13:30:00Z',
          sender: 'driver',
          senderName: 'Lisa Chen',
          message:
            'Arrived in Chicago. Will be at your facility in 30 minutes.',
          type: 'sms',
          status: 'delivered',
        },
      ],
    },
  ]);

  const [deliveryNotifications, setDeliveryNotifications] = useState<
    DeliveryNotification[]
  >([
    {
      id: 'NOT-001',
      shipmentId: 'SHP-001',
      receiverId: 'RCV-001',
      type: 'eta_update',
      message: 'Your delivery ETA has been updated to 2:30 PM',
      scheduledTime: '2024-01-15T14:30:00Z',
      status: 'sent',
      method: 'both',
    },
    {
      id: 'NOT-002',
      shipmentId: 'SHP-002',
      receiverId: 'RCV-002',
      type: 'arrival',
      message: 'Driver has arrived at your facility',
      scheduledTime: '2024-01-15T16:00:00Z',
      actualTime: '2024-01-15T15:55:00Z',
      status: 'sent',
      method: 'sms',
    },
  ]);

  // Mock load data with enhanced tracking
  const [loads] = useState([
    {
      id: 'LF-25001-ATLMIA-WMT-DVFL-001',
      currentStatus: 'in_transit',
      origin: 'Atlanta, GA',
      destination: 'Miami, FL',
      commodity: 'Electronics',
      weight: 15000,
      equipment: 'Dry Van',
      rate: 2800,
      pickupDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      deliveryDate: new Date(
        Date.now() + 1 * 24 * 60 * 60 * 1000
      ).toISOString(),
      driver: 'John Rodriguez',
      truck: 'ABC-123',
      trailer: 'XYZ-789',
      trackingData: {
        currentLocation: {
          lat: 30.7128,
          lng: -84.006,
          city: 'Tallahassee',
          state: 'FL',
        },
        estimatedProgress: 65,
        realTimeETA: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
        currentSpeed: 68,
        lastUpdate: new Date().toISOString(),
        isOnline: true,
      },
    },
  ]);

  const router = useRouter();

  useEffect(() => {
    // Simulate loading
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background:
            'linear-gradient(135deg, #022c22 0%, #044e46 50%, #0a1612 100%)',
        }}
      >
        <div style={{ color: 'white', fontSize: '1.2rem' }}>🔄 Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div
      style={{
        background:
          'linear-gradient(135deg, #022c22 0%, #044e46 50%, #0a1612 100%)',
        minHeight: '100vh',
        padding: '20px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1
            style={{
              color: 'white',
              margin: 0,
              fontSize: '2rem',
              fontWeight: '700',
              background: 'linear-gradient(45deg, #3b82f6, #06b6d4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px',
            }}
          >
            🚚 {session.companyName}
          </h1>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              margin: '4px 0 0 0',
              fontSize: '1rem',
              fontWeight: '500',
            }}
          >
            Enterprise Shipper Portal • Phase 2 Enhanced • Real-Time Operations
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginTop: '8px',
            }}
          >
            <span
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10b981',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: '600',
              }}
            >
              ✅ Connected
            </span>
            <span
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#3b82f6',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: '600',
              }}
            >
              📡 Live Updates
            </span>
            <span
              style={{
                background: 'rgba(236, 72, 153, 0.2)',
                color: '#ec4899',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: '600',
              }}
            >
              🤖 AI Enhanced
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <button
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              color: '#60a5fa',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            📞 Support
          </button>
          <button
            style={{
              background: 'rgba(245, 158, 11, 0.2)',
              color: '#fbbf24',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              position: 'relative',
            }}
          >
            🔔 Alerts
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                fontSize: '0.7rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
              }}
            >
              3
            </span>
          </button>
          <button
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '8px 16px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={() => setActiveTab('dashboard')}
          style={{
            background:
              activeTab === 'dashboard'
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))'
                : 'rgba(255, 255, 255, 0.1)',
            color:
              activeTab === 'dashboard'
                ? '#60a5fa'
                : 'rgba(255, 255, 255, 0.8)',
            border:
              activeTab === 'dashboard'
                ? '1px solid rgba(59, 130, 246, 0.3)'
                : '1px solid rgba(255, 255, 255, 0.2)',
            padding: '12px 20px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'dashboard') {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow =
                '0 4px 12px rgba(59, 130, 246, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'dashboard') {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          📊 Dashboard & Operations
          <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '2px' }}>
            Overview & Management
          </div>
        </button>

        <button
          onClick={() => setActiveTab('financials')}
          style={{
            background:
              activeTab === 'financials'
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))'
                : 'rgba(255, 255, 255, 0.1)',
            color:
              activeTab === 'financials'
                ? '#34d399'
                : 'rgba(255, 255, 255, 0.8)',
            border:
              activeTab === 'financials'
                ? '1px solid rgba(16, 185, 129, 0.3)'
                : '1px solid rgba(255, 255, 255, 0.2)',
            padding: '12px 20px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'financials') {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow =
                '0 4px 12px rgba(16, 185, 129, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'financials') {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          💰 Financials
          <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '2px' }}>
            Billing & Payments
          </div>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          style={{
            background:
              activeTab === 'analytics'
                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))'
                : 'rgba(255, 255, 255, 0.1)',
            color:
              activeTab === 'analytics'
                ? '#a78bfa'
                : 'rgba(255, 255, 255, 0.8)',
            border:
              activeTab === 'analytics'
                ? '1px solid rgba(99, 102, 241, 0.3)'
                : '1px solid rgba(255, 255, 255, 0.2)',
            padding: '12px 20px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'analytics') {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow =
                '0 4px 12px rgba(99, 102, 241, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'analytics') {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          📈 Analytics
          <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '2px' }}>
            Performance & Insights
          </div>
        </button>

        <button
          onClick={() => setActiveTab('integrations')}
          style={{
            background:
              activeTab === 'integrations'
                ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(217, 119, 6, 0.2))'
                : 'rgba(255, 255, 255, 0.1)',
            color:
              activeTab === 'integrations'
                ? '#fb923c'
                : 'rgba(255, 255, 255, 0.8)',
            border:
              activeTab === 'integrations'
                ? '1px solid rgba(249, 115, 22, 0.3)'
                : '1px solid rgba(255, 255, 255, 0.2)',
            padding: '12px 20px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'integrations') {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow =
                '0 4px 12px rgba(249, 115, 22, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'integrations') {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          🔗 Integrations
          <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '2px' }}>
            ERP & Systems
          </div>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          style={{
            background:
              activeTab === 'settings'
                ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.2))'
                : 'rgba(255, 255, 255, 0.1)',
            color:
              activeTab === 'settings' ? '#c4b5fd' : 'rgba(255, 255, 255, 0.8)',
            border:
              activeTab === 'settings'
                ? '1px solid rgba(139, 92, 246, 0.3)'
                : '1px solid rgba(255, 255, 255, 0.2)',
            padding: '12px 20px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'settings') {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow =
                '0 4px 12px rgba(139, 92, 246, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'settings') {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          ⚙️ Settings
          <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '2px' }}>
            Configuration
          </div>
        </button>

        <button
          onClick={() => setActiveTab('warehouse')}
          style={{
            background:
              activeTab === 'warehouse'
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))'
                : 'rgba(255, 255, 255, 0.1)',
            color:
              activeTab === 'warehouse'
                ? '#34d399'
                : 'rgba(255, 255, 255, 0.8)',
            border:
              activeTab === 'warehouse'
                ? '1px solid rgba(16, 185, 129, 0.3)'
                : '1px solid rgba(255, 255, 255, 0.2)',
            padding: '12px 20px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'warehouse') {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow =
                '0 4px 12px rgba(16, 185, 129, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'warehouse') {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          🏭 Warehouse
          <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '2px' }}>
            Inventory & Operations
          </div>
        </button>

        <button
          onClick={() => setActiveTab('receiver-tracking')}
          style={{
            background:
              activeTab === 'receiver-tracking'
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))'
                : 'rgba(255, 255, 255, 0.1)',
            color:
              activeTab === 'receiver-tracking'
                ? '#60a5fa'
                : 'rgba(255, 255, 255, 0.8)',
            border:
              activeTab === 'receiver-tracking'
                ? '1px solid rgba(59, 130, 246, 0.3)'
                : '1px solid rgba(255, 255, 255, 0.2)',
            padding: '12px 20px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'receiver-tracking') {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow =
                '0 4px 12px rgba(59, 130, 246, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'receiver-tracking') {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          📞 Receiver Tracking
          <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '2px' }}>
            Live Delivery Coordination
          </div>
        </button>
      </div>

      {/* Content Sections */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {activeTab === 'dashboard' && (
          <div>
            {/* Enhanced Header with Detailed Box */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.15))',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '24px',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  height: '3px',
                  background:
                    'linear-gradient(90deg, #3b82f6, #06b6d4, #3b82f6)',
                  borderRadius: '16px 16px 0 0',
                }}
              />
              <h2
                style={{
                  color: 'white',
                  fontSize: '1.8rem',
                  fontWeight: '600',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                🚛 Operations Center
              </h2>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1rem',
                  marginBottom: '24px',
                }}
              >
                Comprehensive operations management with real-time tracking and
                enhanced load monitoring
              </p>
            </div>

            {/* Quick Actions */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
              }}
            >
              <button
                style={{
                  background: 'linear-gradient(135deg, #f97316, #ea580c)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                📞 Contact Broker
              </button>
              <button
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                📊 View Analytics
              </button>
            </div>

            {/* Operations Navigation */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
              }}
            >
              <button
                style={{
                  background:
                    'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))',
                  color: '#60a5fa',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                }}
              >
                📦 Load Management
              </button>
              <button
                style={{
                  background:
                    'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                }}
              >
                📋 Requests & Contracts
              </button>
              <button
                style={{
                  background:
                    'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2))',
                  color: '#fbbf24',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                }}
              >
                📍 Real-Time Tracking
              </button>
              <button
                style={{
                  background:
                    'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.2))',
                  color: '#c4b5fd',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                }}
              >
                📄 Documents
              </button>
            </div>

            {/* Enhanced Load Tracking */}
            <div>
              <h3
                style={{
                  color: 'white',
                  fontSize: '1.2rem',
                  marginBottom: '16px',
                }}
              >
                🚛 REAL-TIME TRACKING ACTIVE
              </h3>

              {loads.map((load) => (
                <div
                  key={load.id}
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15))',
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '20px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    position: 'relative',
                  }}
                >
                  {/* Real-time Pulse Animation */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#10b981',
                      animation: 'pulse 2s infinite',
                    }}
                  />

                  {/* Load Header */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '1.1rem',
                          margin: '0 0 4px 0',
                        }}
                      >
                        {load.id}
                      </h4>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          margin: 0,
                          fontSize: '0.9rem',
                        }}
                      >
                        {load.origin} → {load.destination}
                      </p>
                    </div>
                    <div
                      style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#10b981',
                        padding: '4px 8px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                      }}
                    >
                      🚛 In Transit
                    </div>
                  </div>

                  {/* Enhanced Tracking Data */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '16px',
                      marginBottom: '16px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.8rem',
                          marginBottom: '4px',
                        }}
                      >
                        📍 Current Location
                      </div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '1rem',
                          fontWeight: '600',
                        }}
                      >
                        {load.trackingData.currentLocation.city},{' '}
                        {load.trackingData.currentLocation.state}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '0.8rem',
                        }}
                      >
                        {load.trackingData.currentLocation.lat.toFixed(4)}° N,{' '}
                        {load.trackingData.currentLocation.lng.toFixed(4)}° W
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.8rem',
                          marginBottom: '4px',
                        }}
                      >
                        ⏰ Real-time ETA
                      </div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '1rem',
                          fontWeight: '600',
                        }}
                      >
                        {new Date(
                          load.trackingData.realTimeETA
                        ).toLocaleString()}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '0.8rem',
                        }}
                      >
                        {load.trackingData.estimatedProgress}% complete
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.8rem',
                          marginBottom: '4px',
                        }}
                      >
                        🚛 Speed
                      </div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '1rem',
                          fontWeight: '600',
                        }}
                      >
                        {(load.trackingData.currentSpeed || 65).toFixed(0)} mph
                      </div>
                      <div
                        style={{
                          color:
                            (load.trackingData.currentSpeed || 65) > 70
                              ? '#fbbf24'
                              : '#10b981',
                          fontSize: '0.8rem',
                        }}
                      >
                        {(load.trackingData.currentSpeed || 65) > 70
                          ? '⚠️ Over Speed Limit'
                          : '✅ Normal Speed'}
                      </div>
                    </div>
                  </div>

                  {/* Interactive Action Buttons */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      marginBottom: '12px',
                    }}
                  >
                    <button
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                      }}
                    >
                      🗺️ Live Map View
                    </button>
                    <button
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                      }}
                    >
                      📋 Load Details
                    </button>
                  </div>

                  {/* Real-time Status Bar */}
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '8px 12px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      color: 'rgba(255, 255, 255, 0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <div
                      style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: load.trackingData.isOnline
                          ? '#10b981'
                          : '#ef4444',
                      }}
                    />
                    <span>
                      GPS Signal:{' '}
                      {load.trackingData.isOnline ? 'Strong' : 'Weak'}
                    </span>
                    <span>•</span>
                    <span>Auto-refresh: 30s</span>
                    <span>•</span>
                    <span>
                      Last update:{' '}
                      {new Date(
                        load.trackingData.lastUpdate
                      ).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Documents Section - Now part of Operations */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                marginBottom: '24px',
              }}
            >
              <h2
                style={{
                  color: 'white',
                  fontSize: '1.8rem',
                  fontWeight: '600',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                📄 Document Center
              </h2>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1rem',
                  marginBottom: '24px',
                }}
              >
                Upload and manage your essential documents. All uploads are
                automatically sent to your assigned broker for review.
              </p>

              {/* Broker Information */}
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  marginBottom: '24px',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  👤 Your Assigned Broker
                </h3>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  <div>
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.9rem',
                      }}
                    >
                      Name:
                    </span>
                    <div style={{ color: 'white', fontWeight: '500' }}>
                      Sarah Johnson
                    </div>
                  </div>
                  <div>
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.9rem',
                      }}
                    >
                      Email:
                    </span>
                    <div style={{ color: 'white', fontWeight: '500' }}>
                      sarah.johnson@fleetflow.com
                    </div>
                  </div>
                  <div>
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.9rem',
                      }}
                    >
                      Phone:
                    </span>
                    <div style={{ color: 'white', fontWeight: '500' }}>
                      (555) 123-4567
                    </div>
                  </div>
                </div>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.8rem',
                    marginTop: '8px',
                    marginBottom: 0,
                  }}
                >
                  All document uploads will automatically notify Sarah Johnson
                  for review
                </p>
              </div>

              {/* Document Upload */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  marginBottom: '24px',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  📤 Upload Documents
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                  }}
                >
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    📄 Insurance Certificate
                  </button>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    📋 Contract Agreement
                  </button>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    📦 Bill of Lading
                  </button>
                </div>
              </div>

              {/* Recent Documents */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  📋 Recent Documents
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '4px',
                        }}
                      >
                        <span
                          style={{
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                          }}
                        >
                          {doc.fileName}
                        </span>
                        <span
                          style={{
                            color:
                              doc.status === 'approved'
                                ? '#10b981'
                                : doc.status === 'pending'
                                  ? '#f59e0b'
                                  : '#ef4444',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                          }}
                        >
                          {doc.status}
                        </span>
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '0.8rem',
                          marginBottom: '4px',
                        }}
                      >
                        Uploaded:{' '}
                        {new Date(doc.uploadDate).toLocaleDateString()}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.8rem',
                          fontStyle: 'italic',
                        }}
                      >
                        {doc.brokerReview}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Company Profile Section */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                marginBottom: '24px',
              }}
            >
              <h2
                style={{
                  color: 'white',
                  fontSize: '1.8rem',
                  fontWeight: '600',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                👤 Company Profile
              </h2>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1rem',
                  marginBottom: '24px',
                }}
              >
                Manage your company information and user access permissions
              </p>

              {/* Company Information */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  marginBottom: '24px',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  🏢 Company Details
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                  }}
                >
                  <div>
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.9rem',
                      }}
                    >
                      Company Name:
                    </span>
                    <div style={{ color: 'white', fontWeight: '500' }}>
                      {session.companyName}
                    </div>
                  </div>
                  <div>
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.9rem',
                      }}
                    >
                      Shipper ID:
                    </span>
                    <div style={{ color: 'white', fontWeight: '500' }}>
                      {session.shipperId}
                    </div>
                  </div>
                  <div>
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.9rem',
                      }}
                    >
                      Member Since:
                    </span>
                    <div style={{ color: 'white', fontWeight: '500' }}>
                      {new Date(session.loginTime).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* User Management */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  marginBottom: '24px',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  👥 User Access
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {userAccess.map((user) => (
                    <div
                      key={user.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '4px',
                        }}
                      >
                        <span
                          style={{
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                          }}
                        >
                          {user.name}
                        </span>
                        <span
                          style={{
                            color: user.isActive ? '#10b981' : '#ef4444',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                          }}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '0.8rem',
                          marginBottom: '4px',
                        }}
                      >
                        {user.email} • {user.role}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.8rem',
                        }}
                      >
                        Last login:{' '}
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New User */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  👤 Add New User
                </h3>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 20px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                  }}
                >
                  ➕ Add New User
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'operations' && (
          <div>
            {/* Enhanced Header with Detailed Box */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(217, 119, 6, 0.15))',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '24px',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  height: '3px',
                  background:
                    'linear-gradient(90deg, #f97316, #ea580c, #f97316)',
                  borderRadius: '16px 16px 0 0',
                }}
              />
              <h2
                style={{
                  color: 'white',
                  fontSize: '1.8rem',
                  fontWeight: '600',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                ⚡ Go With the Flow Operations
              </h2>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1rem',
                  marginBottom: '24px',
                }}
              >
                Professional load requests with intelligent matching and
                market-based pricing
              </p>
            </div>

            {/* Request a Truck Section */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                marginBottom: '24px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                🚛 Request a Truck
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '24px',
                }}
              >
                {/* Request Form */}
                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <label
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        display: 'block',
                        marginBottom: '8px',
                      }}
                    >
                      Pickup Location
                    </label>
                    <input
                      type='text'
                      placeholder='Enter pickup address'
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        display: 'block',
                        marginBottom: '8px',
                      }}
                    >
                      Delivery Location
                    </label>
                    <input
                      type='text'
                      placeholder='Enter delivery address'
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          display: 'block',
                          marginBottom: '8px',
                        }}
                      >
                        Weight (lbs)
                      </label>
                      <input
                        type='number'
                        placeholder='25000'
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          fontSize: '0.9rem',
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          display: 'block',
                          marginBottom: '8px',
                        }}
                      >
                        Equipment Type
                      </label>
                      <select
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          fontSize: '0.9rem',
                        }}
                      >
                        <option value='dry-van'>Dry Van</option>
                        <option value='reefer'>Reefer</option>
                        <option value='flatbed'>Flatbed</option>
                        <option value='step-deck'>Step Deck</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        display: 'block',
                        marginBottom: '8px',
                      }}
                    >
                      Pickup Date & Time
                    </label>
                    <input
                      type='datetime-local'
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>

                  <button
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #f97316, #ea580c)',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 25px rgba(249, 115, 22, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    onClick={async () => {
                      try {
                        const response = await fetch(
                          '/api/go-with-the-flow/shipper',
                          {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              action: 'request-truck',
                              shipperId: session?.shipperId,
                              // Add form data here
                            }),
                          }
                        );
                        const result = await response.json();
                        if (result.success) {
                          alert(
                            'Truck request submitted! Estimated arrival: ' +
                              result.data.estimatedArrival
                          );
                        }
                      } catch (error) {
                        console.error('Error requesting truck:', error);
                      }
                    }}
                  >
                    📋 Submit Load Request
                  </button>
                </div>

                {/* Real-Time Pricing & Availability */}
                <div>
                  <h4
                    style={{
                      color: 'white',
                      marginBottom: '16px',
                      fontSize: '1.1rem',
                    }}
                  >
                    💰 Market Pricing
                  </h4>

                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '12px',
                      padding: '16px',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        Estimated Rate:
                      </span>
                      <span
                        style={{
                          color: '#34d399',
                          fontSize: '1.2rem',
                          fontWeight: '600',
                        }}
                      >
                        $2,450
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '8px',
                      }}
                    >
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        Distance:
                      </span>
                      <span style={{ color: 'white' }}>847 miles</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '8px',
                      }}
                    >
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        Estimated Transit:
                      </span>
                      <span style={{ color: 'white' }}>2-3 days</span>
                    </div>
                  </div>

                  <h4
                    style={{
                      color: 'white',
                      marginBottom: '16px',
                      fontSize: '1.1rem',
                    }}
                  >
                    🚛 Available Drivers Nearby
                  </h4>

                  <div style={{ display: 'grid', gap: '12px' }}>
                    {[
                      {
                        name: 'Mike Rodriguez',
                        distance: '12 miles',
                        rating: 4.9,
                        eta: '15 min',
                      },
                      {
                        name: 'Sarah Johnson',
                        distance: '18 miles',
                        rating: 4.8,
                        eta: '22 min',
                      },
                      {
                        name: 'David Chen',
                        distance: '25 miles',
                        rating: 4.7,
                        eta: '28 min',
                      },
                    ].map((driver, index) => (
                      <div
                        key={index}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '10px',
                          padding: '12px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <div style={{ color: 'white', fontWeight: '500' }}>
                            {driver.name}
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '0.8rem',
                            }}
                          >
                            {driver.distance} • ⭐ {driver.rating}
                          </div>
                        </div>
                        <div
                          style={{
                            color: '#34d399',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                          }}
                        >
                          Available: {driver.eta}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Active Requests */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                📋 Active Load Requests
              </h3>

              <div style={{ display: 'grid', gap: '16px' }}>
                {[
                  {
                    id: 'REQ-001',
                    pickup: 'Atlanta, GA',
                    delivery: 'Miami, FL',
                    status: 'Driver Assigned',
                    driver: 'Mike Rodriguez',
                    eta: '15 minutes',
                    rate: '$2,450',
                  },
                  {
                    id: 'REQ-002',
                    pickup: 'Houston, TX',
                    delivery: 'Dallas, TX',
                    status: 'Searching...',
                    driver: null,
                    eta: 'Finding driver',
                    rate: '$850',
                  },
                ].map((request, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '16px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            color: 'white',
                            fontWeight: '600',
                            marginBottom: '8px',
                          }}
                        >
                          {request.id}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            marginBottom: '4px',
                          }}
                        >
                          📍 {request.pickup} → {request.delivery}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.9rem',
                          }}
                        >
                          {request.driver
                            ? `Driver: ${request.driver}`
                            : 'No driver assigned'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            color:
                              request.status === 'Driver Assigned'
                                ? '#34d399'
                                : '#fbbf24',
                            fontWeight: '500',
                            marginBottom: '4px',
                          }}
                        >
                          {request.status}
                        </div>
                        <div style={{ color: 'white', fontWeight: '600' }}>
                          {request.rate}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.8rem',
                          }}
                        >
                          Status: {request.eta}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'financials' && (
          <div>
            {/* Enhanced Header with Detailed Box */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15))',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '24px',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  height: '3px',
                  background:
                    'linear-gradient(90deg, #10b981, #059669, #10b981)',
                  borderRadius: '16px 16px 0 0',
                }}
              />
              <h2
                style={{
                  color: 'white',
                  fontSize: '1.8rem',
                  fontWeight: '600',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                💰 Financial Dashboard
              </h2>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1rem',
                  marginBottom: '24px',
                }}
              >
                View your outstanding invoices, payment history, and financial
                analytics
              </p>
            </div>
            {/* Financial KPI Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                }}
              >
                <div
                  style={{
                    color: 'white',
                    fontSize: '2rem',
                    fontWeight: '700',
                    marginBottom: '8px',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  ${financialData.creditLimit.toLocaleString()}
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginBottom: '4px',
                  }}
                >
                  Credit Limit
                </div>
                <div
                  style={{
                    color: '#10b981',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  ↗️ Available: $
                  {financialData.availableCredit.toLocaleString()}
                </div>
              </div>

              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
                }}
              >
                <div
                  style={{
                    color: 'white',
                    fontSize: '2rem',
                    fontWeight: '700',
                    marginBottom: '8px',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  ${financialData.totalSpent.toLocaleString()}
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginBottom: '4px',
                  }}
                >
                  Total Spent
                </div>
                <div
                  style={{
                    color: '#3b82f6',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  📊 Avg Rate: ${financialData.averageRate}
                </div>
              </div>

              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2))',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)',
                }}
              >
                <div
                  style={{
                    color: 'white',
                    fontSize: '2rem',
                    fontWeight: '700',
                    marginBottom: '8px',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  {financialData.onTimePaymentRate}%
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginBottom: '4px',
                  }}
                >
                  On-Time Payments
                </div>
                <div
                  style={{
                    color: '#f59e0b',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  ✅ Payment Terms: {financialData.paymentTerms}
                </div>
              </div>
            </div>

            {/* Outstanding Invoices */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                marginBottom: '24px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                📋 Outstanding Invoices
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {financialData.outstandingInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      <span
                        style={{
                          color: 'white',
                          fontSize: '1rem',
                          fontWeight: '600',
                        }}
                      >
                        {invoice.loadId}
                      </span>
                      <span
                        style={{
                          color:
                            invoice.status === 'overdue'
                              ? '#ef4444'
                              : invoice.status === 'pending'
                                ? '#f59e0b'
                                : '#10b981',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                        }}
                      >
                        {invoice.status}
                      </span>
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.9rem',
                        marginBottom: '4px',
                      }}
                    >
                      {invoice.description}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          color: 'white',
                          fontSize: '1.1rem',
                          fontWeight: '600',
                        }}
                      >
                        ${invoice.amount.toLocaleString()}
                      </span>
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '0.8rem',
                        }}
                      >
                        Due: {invoice.dueDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment History */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                💳 Payment History
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {financialData.paymentHistory.map((payment) => (
                  <div
                    key={payment.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      <span
                        style={{
                          color: 'white',
                          fontSize: '1rem',
                          fontWeight: '600',
                        }}
                      >
                        {payment.reference}
                      </span>
                      <span
                        style={{
                          color: '#10b981',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                        }}
                      >
                        ✅ Paid
                      </span>
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.9rem',
                        marginBottom: '4px',
                      }}
                    >
                      Method: {payment.method} • Ref: {payment.reference}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          color: 'white',
                          fontSize: '1.1rem',
                          fontWeight: '600',
                        }}
                      >
                        ${payment.amount.toLocaleString()}
                      </span>
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '0.8rem',
                        }}
                      >
                        {payment.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            {/* Enhanced Header with Detailed Box */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15))',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '24px',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  height: '3px',
                  background:
                    'linear-gradient(90deg, #6366f1, #8b5cf6, #6366f1)',
                  borderRadius: '16px 16px 0 0',
                }}
              />
              <h2
                style={{
                  color: 'white',
                  fontSize: '1.8rem',
                  fontWeight: '600',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                📈 Analytics Dashboard
              </h2>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1rem',
                  marginBottom: '24px',
                }}
              >
                View detailed analytics and performance metrics
              </p>
            </div>
            {/* Analytics KPI Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
                }}
              >
                <div
                  style={{
                    color: 'white',
                    fontSize: '2rem',
                    fontWeight: '700',
                    marginBottom: '8px',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  47
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginBottom: '4px',
                  }}
                >
                  Total Loads
                </div>
                <div
                  style={{
                    color: '#6366f1',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  ↗️ +12% from last month
                </div>
              </div>

              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                }}
              >
                <div
                  style={{
                    color: 'white',
                    fontSize: '2rem',
                    fontWeight: '700',
                    marginBottom: '8px',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  94%
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginBottom: '4px',
                  }}
                >
                  On-Time Delivery
                </div>
                <div
                  style={{
                    color: '#10b981',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  ✅ Above industry average
                </div>
              </div>

              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2))',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)',
                }}
              >
                <div
                  style={{
                    color: 'white',
                    fontSize: '2rem',
                    fontWeight: '700',
                    marginBottom: '8px',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  $2,847
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginBottom: '4px',
                  }}
                >
                  Avg Rate per Load
                </div>
                <div
                  style={{
                    color: '#f59e0b',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  📈 +8% from last quarter
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                marginBottom: '24px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                📊 Performance Metrics
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div
                    style={{
                      color: 'white',
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      marginBottom: '4px',
                    }}
                  >
                    1,247 miles
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                    }}
                  >
                    Average Distance
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div
                    style={{
                      color: 'white',
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      marginBottom: '4px',
                    }}
                  >
                    2.3 days
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                    }}
                  >
                    Average Transit Time
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div
                    style={{
                      color: 'white',
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      marginBottom: '4px',
                    }}
                  >
                    98.2%
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                    }}
                  >
                    Customer Satisfaction
                  </div>
                </div>
              </div>
            </div>

            {/* Route Analysis */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                🗺️ Top Routes
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <span
                      style={{
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: '600',
                      }}
                    >
                      Atlanta → Miami
                    </span>
                    <span
                      style={{
                        color: '#10b981',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                      }}
                    >
                      12 loads
                    </span>
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                      marginBottom: '4px',
                    }}
                  >
                    Average Rate: $2,850 • Distance: 662 miles
                  </div>
                  <div
                    style={{
                      color: '#6366f1',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                    }}
                  >
                    ⭐ Most profitable route
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <span
                      style={{
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: '600',
                      }}
                    >
                      Chicago → Dallas
                    </span>
                    <span
                      style={{
                        color: '#f59e0b',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                      }}
                    >
                      8 loads
                    </span>
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                      marginBottom: '4px',
                    }}
                  >
                    Average Rate: $3,200 • Distance: 925 miles
                  </div>
                  <div
                    style={{
                      color: '#f59e0b',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                    }}
                  >
                    📈 Growing demand
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div>
            {/* Enhanced Header with Detailed Box */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(217, 119, 6, 0.15))',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '24px',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  height: '3px',
                  background:
                    'linear-gradient(90deg, #f97316, #ea580c, #f97316)',
                  borderRadius: '16px 16px 0 0',
                }}
              />
              <h2
                style={{
                  color: 'white',
                  fontSize: '1.8rem',
                  fontWeight: '600',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                🔗 System Integrations
              </h2>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1rem',
                  marginBottom: '24px',
                }}
              >
                Manage ERP, WMS, and other system integrations
              </p>
            </div>
            {/* Integration Status */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: '#10b981',
                      animation: 'pulse 2s infinite',
                    }}
                  />
                  <span
                    style={{
                      color: 'white',
                      fontSize: '1.2rem',
                      fontWeight: '600',
                    }}
                  >
                    ✅ SAP ERP
                  </span>
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.9rem',
                    marginBottom: '8px',
                  }}
                >
                  Connected to SAP S/4HANA
                </div>
                <div
                  style={{
                    color: '#10b981',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                  }}
                >
                  Last sync: 2 minutes ago
                </div>
              </div>

              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: '#3b82f6',
                      animation: 'pulse 2s infinite',
                    }}
                  />
                  <span
                    style={{
                      color: 'white',
                      fontSize: '1.2rem',
                      fontWeight: '600',
                    }}
                  >
                    ✅ Oracle WMS
                  </span>
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.9rem',
                    marginBottom: '8px',
                  }}
                >
                  Warehouse Management System
                </div>
                <div
                  style={{
                    color: '#3b82f6',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                  }}
                >
                  Last sync: 5 minutes ago
                </div>
              </div>

              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2))',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: '#f59e0b',
                      animation: 'pulse 2s infinite',
                    }}
                  />
                  <span
                    style={{
                      color: 'white',
                      fontSize: '1.2rem',
                      fontWeight: '600',
                    }}
                  >
                    ✅ QuickBooks
                  </span>
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.9rem',
                    marginBottom: '8px',
                  }}
                >
                  Accounting & Invoicing
                </div>
                <div
                  style={{
                    color: '#f59e0b',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                  }}
                >
                  Last sync: 1 minute ago
                </div>
              </div>
            </div>

            {/* Available Integrations */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                marginBottom: '24px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                🔗 Available Integrations
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                }}
              >
                <button
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  🔗 Connect Salesforce
                </button>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  🔗 Connect NetSuite
                </button>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  🔗 Connect Xero
                </button>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  🔗 Connect Microsoft Dynamics
                </button>
              </div>
            </div>

            {/* API Configuration */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                ⚙️ API Configuration
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div
                    style={{
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Webhook URL
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.8rem',
                      fontFamily: 'monospace',
                      background: 'rgba(0, 0, 0, 0.3)',
                      padding: '8px',
                      borderRadius: '4px',
                      wordBreak: 'break-all',
                    }}
                  >
                    https://api.fleetflow.com/webhooks/shipper-123
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div
                    style={{
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    API Key
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.8rem',
                      fontFamily: 'monospace',
                      background: 'rgba(0, 0, 0, 0.3)',
                      padding: '8px',
                      borderRadius: '4px',
                      wordBreak: 'break-all',
                    }}
                  >
                    ff_live_sk_1234567890abcdef
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            {/* Enhanced Header with Detailed Box */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.15))',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '24px',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  height: '3px',
                  background:
                    'linear-gradient(90deg, #8b5cf6, #7c3aed, #8b5cf6)',
                  borderRadius: '16px 16px 0 0',
                }}
              />
              <h2
                style={{
                  color: 'white',
                  fontSize: '1.8rem',
                  fontWeight: '600',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                ⚙️ System Settings
              </h2>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1rem',
                  marginBottom: '24px',
                }}
              >
                Manage user access, portal settings, and system configuration
              </p>
            </div>
            {/* Portal Settings */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                marginBottom: '24px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                ⚙️ Portal Settings
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div
                    style={{
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Notifications
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <input
                      type='checkbox'
                      defaultChecked
                      style={{
                        width: '16px',
                        height: '16px',
                      }}
                    />
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.9rem',
                      }}
                    >
                      Email notifications
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <input
                      type='checkbox'
                      defaultChecked
                      style={{
                        width: '16px',
                        height: '16px',
                      }}
                    />
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.9rem',
                      }}
                    >
                      SMS alerts
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <input
                      type='checkbox'
                      style={{
                        width: '16px',
                        height: '16px',
                      }}
                    />
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.9rem',
                      }}
                    >
                      Push notifications
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div
                    style={{
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Display Preferences
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <input
                      type='checkbox'
                      defaultChecked
                      style={{
                        width: '16px',
                        height: '16px',
                      }}
                    />
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.9rem',
                      }}
                    >
                      Real-time updates
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <input
                      type='checkbox'
                      defaultChecked
                      style={{
                        width: '16px',
                        height: '16px',
                      }}
                    />
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.9rem',
                      }}
                    >
                      Auto-refresh data
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <input
                      type='checkbox'
                      style={{
                        width: '16px',
                        height: '16px',
                      }}
                    />
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.9rem',
                      }}
                    >
                      Dark mode only
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                marginBottom: '24px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                🔒 Security Settings
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div
                    style={{
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Two-Factor Authentication
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                      marginBottom: '12px',
                    }}
                  >
                    Enhanced security for your account
                  </div>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                    }}
                  >
                    Enable 2FA
                  </button>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div
                    style={{
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Session Management
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                      marginBottom: '12px',
                    }}
                  >
                    Manage active sessions
                  </div>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                    }}
                  >
                    View Sessions
                  </button>
                </div>
              </div>
            </div>

            {/* Data Export */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                📊 Data Export
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                }}
              >
                <button
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  📄 Export Load History
                </button>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  📊 Export Analytics
                </button>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  💰 Export Financial Data
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'warehouse' && (
          <div>
            {/* Enhanced Header with AI Integration */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15))',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  height: '3px',
                  background:
                    'linear-gradient(90deg, #10b981, #059669, #10b981)',
                  borderRadius: '16px 16px 0 0',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h2
                    style={{
                      color: 'white',
                      fontSize: '1.8rem',
                      fontWeight: '600',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    🏭 AI-Powered Warehouse Management
                  </h2>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '1rem',
                      marginBottom: '16px',
                    }}
                  >
                    Intelligent inventory optimization, automated picking, and
                    smart labeling workflows
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 16px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                    }}
                  >
                    🤖 AI Optimize
                  </button>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 16px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                    }}
                  >
                    📊 Analytics
                  </button>
                </div>
              </div>
            </div>

            {/* AI-Powered Quick Actions */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                marginBottom: '24px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                ⚡ AI-Powered Quick Actions
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '16px',
                }}
              >
                <button
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '20px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    textAlign: 'left',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 25px rgba(16, 185, 129, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
                    🤖
                  </div>
                  <div style={{ fontWeight: '700', marginBottom: '4px' }}>
                    AI Inventory Optimization
                  </div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                    Smart reorder suggestions & stock level optimization
                  </div>
                </button>

                <button
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '20px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    textAlign: 'left',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 25px rgba(59, 130, 246, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
                    📦
                  </div>
                  <div style={{ fontWeight: '700', marginBottom: '4px' }}>
                    Smart Picking Routes
                  </div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                    AI-optimized picking sequences & efficiency
                  </div>
                </button>

                <button
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '20px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    textAlign: 'left',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 25px rgba(245, 158, 11, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
                    🏷️
                  </div>
                  <div style={{ fontWeight: '700', marginBottom: '4px' }}>
                    Auto Labeling
                  </div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                    Intelligent label generation & compliance
                  </div>
                </button>

                <button
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '20px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    textAlign: 'left',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 25px rgba(139, 92, 246, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
                    📊
                  </div>
                  <div style={{ fontWeight: '700', marginBottom: '4px' }}>
                    Predictive Analytics
                  </div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                    Demand forecasting & capacity planning
                  </div>
                </button>
              </div>
            </div>

            {/* Real-Time Warehouse Dashboard */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                marginBottom: '24px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                📊 Real-Time Warehouse Dashboard
              </h3>

              {/* KPI Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '24px',
                }}
              >
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <div
                    style={{
                      color: '#10b981',
                      fontSize: '2rem',
                      marginBottom: '8px',
                    }}
                  >
                    📦
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      marginBottom: '4px',
                    }}
                  >
                    {inventory.reduce(
                      (sum, item) => sum + item.quantity.total,
                      0
                    )}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                    }}
                  >
                    Total Inventory Items
                  </div>
                </div>

                <div
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                  }}
                >
                  <div
                    style={{
                      color: '#3b82f6',
                      fontSize: '2rem',
                      marginBottom: '8px',
                    }}
                  >
                    🚛
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      marginBottom: '4px',
                    }}
                  >
                    {
                      pickingAssignments.filter(
                        (p) => p.status === 'in_progress'
                      ).length
                    }
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                    }}
                  >
                    Active Picking Orders
                  </div>
                </div>

                <div
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2))',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                  }}
                >
                  <div
                    style={{
                      color: '#f59e0b',
                      fontSize: '2rem',
                      marginBottom: '8px',
                    }}
                  >
                    🏷️
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      marginBottom: '4px',
                    }}
                  >
                    {
                      labelingOperations.filter(
                        (l) => l.status === 'in_progress'
                      ).length
                    }
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                    }}
                  >
                    Labeling in Progress
                  </div>
                </div>

                <div
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.2))',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                  }}
                >
                  <div
                    style={{
                      color: '#8b5cf6',
                      fontSize: '2rem',
                      marginBottom: '8px',
                    }}
                  >
                    📈
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      marginBottom: '4px',
                    }}
                  >
                    98.5%
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                    }}
                  >
                    Order Accuracy Rate
                  </div>
                </div>
              </div>

              {/* Interactive Inventory Management */}
              <div style={{ marginBottom: '24px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <h4
                    style={{
                      color: 'white',
                      fontSize: '1.2rem',
                      fontWeight: '600',
                    }}
                  >
                    📦 Smart Inventory Management
                  </h4>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                    }}
                  >
                    + Add Item
                  </button>
                </div>

                <div style={{ display: 'grid', gap: '12px' }}>
                  {inventory.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '8px',
                          }}
                        >
                          <span
                            style={{
                              color: 'white',
                              fontSize: '1rem',
                              fontWeight: '600',
                            }}
                          >
                            {item.name}
                          </span>
                          <span
                            style={{
                              background:
                                item.quantity.available < item.minStockLevel
                                  ? 'rgba(239, 68, 68, 0.2)'
                                  : 'rgba(16, 185, 129, 0.2)',
                              color:
                                item.quantity.available < item.minStockLevel
                                  ? '#ef4444'
                                  : '#10b981',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '0.7rem',
                              fontWeight: '600',
                            }}
                          >
                            {item.quantity.available < item.minStockLevel
                              ? '⚠️ Low Stock'
                              : '✅ In Stock'}
                          </span>
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.8rem',
                            marginBottom: '4px',
                          }}
                        >
                          SKU: {item.sku} | Location: {item.location.zone}-
                          {item.location.bin}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.8rem',
                          }}
                        >
                          Available: {item.quantity.available} | Reserved:{' '}
                          {item.quantity.reserved} | Total:{' '}
                          {item.quantity.total}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          style={{
                            background:
                              'linear-gradient(135deg, #3b82f6, #2563eb)',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                          }}
                        >
                          📊 Details
                        </button>
                        <button
                          style={{
                            background:
                              'linear-gradient(135deg, #f59e0b, #d97706)',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                          }}
                        >
                          🏷️ Label
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Operations */}
              <div>
                <h4
                  style={{
                    color: 'white',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    marginBottom: '16px',
                  }}
                >
                  ⚡ Active Operations
                </h4>

                <div style={{ display: 'grid', gap: '16px' }}>
                  {pickingAssignments
                    .filter((p) => p.status === 'in_progress')
                    .map((assignment) => (
                      <div
                        key={assignment.id}
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.15))',
                          borderRadius: '12px',
                          padding: '20px',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          position: 'relative',
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#3b82f6',
                            animation: 'pulse 2s infinite',
                          }}
                        />

                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '12px',
                          }}
                        >
                          <div>
                            <h5
                              style={{
                                color: 'white',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                marginBottom: '4px',
                              }}
                            >
                              Picking Assignment #{assignment.id}
                            </h5>
                            <p
                              style={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '0.9rem',
                                margin: 0,
                              }}
                            >
                              Assigned to: {assignment.assignedTo} | Priority:{' '}
                              {assignment.priority}
                            </p>
                          </div>
                          <div
                            style={{
                              background: 'rgba(59, 130, 246, 0.2)',
                              color: '#3b82f6',
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                            }}
                          >
                            🔄 In Progress
                          </div>
                        </div>

                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns:
                              'repeat(auto-fit, minmax(150px, 1fr))',
                            gap: '12px',
                            marginBottom: '16px',
                          }}
                        >
                          {assignment.items.map((item) => (
                            <div
                              key={item.sku}
                              style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                padding: '12px',
                                border:
                                  item.status === 'picked'
                                    ? '1px solid rgba(16, 185, 129, 0.3)'
                                    : '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              <div
                                style={{
                                  color: 'white',
                                  fontSize: '0.9rem',
                                  fontWeight: '600',
                                  marginBottom: '4px',
                                }}
                              >
                                {item.name}
                              </div>
                              <div
                                style={{
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  fontSize: '0.8rem',
                                  marginBottom: '4px',
                                }}
                              >
                                Qty: {item.picked}/{item.quantity}
                              </div>
                              <div
                                style={{
                                  color:
                                    item.status === 'picked'
                                      ? '#10b981'
                                      : '#f59e0b',
                                  fontSize: '0.8rem',
                                  fontWeight: '600',
                                }}
                              >
                                {item.status === 'picked'
                                  ? '✅ Picked'
                                  : '⏳ Pending'}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            style={{
                              background:
                                'linear-gradient(135deg, #10b981, #059669)',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '8px 16px',
                              color: 'white',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                            }}
                          >
                            ✅ Complete Picking
                          </button>
                          <button
                            style={{
                              background:
                                'linear-gradient(135deg, #3b82f6, #2563eb)',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '8px 16px',
                              color: 'white',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                            }}
                          >
                            📊 View Details
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* AI-Powered Analytics */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                marginBottom: '24px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                🤖 AI-Powered Analytics & Insights
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '20px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <h4
                    style={{
                      color: 'white',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      marginBottom: '12px',
                    }}
                  >
                    📈 Performance Metrics
                  </h4>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.9rem',
                      }}
                    >
                      <span>Picking Efficiency</span>
                      <span style={{ color: '#10b981', fontWeight: '600' }}>
                        94.2%
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.9rem',
                      }}
                    >
                      <span>Order Accuracy</span>
                      <span style={{ color: '#10b981', fontWeight: '600' }}>
                        98.5%
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.9rem',
                      }}
                    >
                      <span>Labeling Speed</span>
                      <span style={{ color: '#10b981', fontWeight: '600' }}>
                        127 items/hr
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.9rem',
                      }}
                    >
                      <span>Space Utilization</span>
                      <span style={{ color: '#f59e0b', fontWeight: '600' }}>
                        87.3%
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <h4
                    style={{
                      color: 'white',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      marginBottom: '12px',
                    }}
                  >
                    🤖 AI Recommendations
                  </h4>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    <div
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px',
                        padding: '8px',
                        color: '#ef4444',
                        fontSize: '0.8rem',
                      }}
                    >
                      ⚠️ Low stock alert: Samsung TVs (A1-05) - Reorder 50 units
                    </div>
                    <div
                      style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '8px',
                        padding: '8px',
                        color: '#10b981',
                        fontSize: '0.8rem',
                      }}
                    >
                      ✅ Optimize picking route: Zone A → Zone B → Zone F
                    </div>
                    <div
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '8px',
                        padding: '8px',
                        color: '#3b82f6',
                        fontSize: '0.8rem',
                      }}
                    >
                      📊 High demand forecast: Nike shoes - Increase stock by
                      25%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'receiver-tracking' && (
          <div>
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.15))',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              <h2
                style={{
                  margin: '0 0 8px 0',
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  color: '#60a5fa',
                }}
              >
                📞 Receiver Communications & Live Tracking
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: '1rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                Coordinate deliveries, track shipments in real-time, and manage
                receiver communications
              </p>
            </div>

            {/* Live Shipments Dashboard */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
                gap: '24px',
                marginBottom: '24px',
              }}
            >
              {liveShipments.map((shipment) => (
                <div
                  key={shipment.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin: '0 0 4px 0',
                          fontSize: '1.2rem',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        {shipment.loadId}
                      </h3>
                      <div
                        style={{
                          display: 'inline-block',
                          background:
                            shipment.status === 'in-transit'
                              ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                              : shipment.status === 'out-for-delivery'
                                ? 'linear-gradient(135deg, #34d399, #10b981)'
                                : 'linear-gradient(135deg, #ef4444, #dc2626)',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                        }}
                      >
                        {shipment.status.replace('-', ' ').toUpperCase()}
                      </div>
                    </div>
                    <div style={{ fontSize: '2rem', color: '#60a5fa' }}>
                      {shipment.progress}%
                    </div>
                  </div>

                  {/* Receiver Info */}
                  <div
                    style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '16px',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      <strong style={{ color: '#60a5fa' }}>📍 Receiver:</strong>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={async () => {
                            const result =
                              await ReceiverNotificationService.sendSMSNotification(
                                {
                                  receiverPhone: shipment.receiverPhone,
                                  receiverEmail: shipment.receiverEmail,
                                  receiverName: shipment.receiverName,
                                  shipmentId: shipment.shipmentId,
                                  loadId: shipment.loadId,
                                  vendorName:
                                    session?.companyName || 'FleetFlow Vendor',
                                  driverName: shipment.driverName,
                                  driverPhone: shipment.driverPhone,
                                  currentLocation:
                                    shipment.currentLocation.address,
                                  estimatedArrival: shipment.estimatedArrival,
                                  deliveryInstructions:
                                    shipment.deliveryInstructions,
                                  notificationType: 'eta_update',
                                }
                              );

                            if (result.success) {
                              alert(
                                `✅ SMS sent successfully to ${shipment.receiverName}\nMessage ID: ${result.messageId}`
                              );
                            } else {
                              alert(`❌ SMS failed: ${result.error}`);
                            }
                          }}
                          style={{
                            background:
                              'linear-gradient(135deg, #10b981, #059669)',
                            color: 'white',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.7rem',
                            cursor: 'pointer',
                          }}
                        >
                          📱 SMS Update
                        </button>
                        <button
                          onClick={() => {
                            window.open(
                              `tel:${shipment.receiverPhone}`,
                              '_self'
                            );
                          }}
                          style={{
                            background:
                              'linear-gradient(135deg, #3b82f6, #2563eb)',
                            color: 'white',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.7rem',
                            cursor: 'pointer',
                          }}
                        >
                          📞 Call
                        </button>
                      </div>
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      <strong>{shipment.receiverName}</strong>
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.9rem',
                      }}
                    >
                      📱 {shipment.receiverPhone} | 📧 {shipment.receiverEmail}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div
                    style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}
                  >
                    <button
                      onClick={() => {
                        window.open(
                          `http://localhost:3000/tracking?shipment=${shipment.shipmentId}`,
                          '_blank'
                        );
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      🗺️ View Live Map
                    </button>
                    <button
                      onClick={() => {
                        const receiverLink = `http://localhost:3000/receiver-portal?token=${shipment.shipmentId}`;
                        navigator.clipboard.writeText(receiverLink);
                        alert(
                          `🔗 Receiver tracking link copied!\n\nShare with ${shipment.receiverName}:\n${receiverLink}`
                        );
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      🔗 Share Tracking Link
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
