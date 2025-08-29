// Load Management Service - Centralized load operations with unified flow
import { getCurrentUser } from '../config/access';
import { SchedulingService } from '../scheduling/service';
import { DispatchCommunicationIntegration } from '../utils/DispatchCommunicationIntegration';
import { logger } from '../utils/logger';
import { EDIService } from './EDIService';
import { LoadIdentificationService } from './LoadIdentificationService';
import MultiTenantDataService from './MultiTenantDataService';

// Mock dispatchers for development
const mockDispatchers = [
  { id: 'disp-001', name: 'Sarah Johnson' },
  { id: 'disp-002', name: 'Mike Chen' },
  { id: 'disp-003', name: 'Lisa Rodriguez' },
];

const getAvailableDispatchers = () => mockDispatchers;

export interface ShipperInfo {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  businessType?: string;
  paymentTerms?: string;
  creditRating?: string;
  specialInstructions?: string;
}

export interface Load {
  id: string;
  brokerId: string;
  brokerName: string;
  // Shipper Information
  shipperId?: string;
  shipperInfo?: ShipperInfo;
  shipperName?: string; // Added for Load Board Number generation
  dispatcherId?: string;
  dispatcherName?: string;
  driverId?: string;
  driverName?: string;
  origin: string;
  destination: string;
  rate: number;
  distance: string;
  weight: string;
  equipment: string;
  loadType?: string; // Added for Load Board Number generation
  commodity?: string;
  isHazmat?: boolean;
  isExpedited?: boolean;
  isOversized?: boolean;
  status:
    | 'Draft'
    | 'Available'
    | 'Assigned'
    | 'Broadcasted'
    | 'Driver Selected'
    | 'Order Sent'
    | 'In Transit'
    | 'Delivered';
  pickupDate: string;
  deliveryDate: string;
  pickupTime?: string;
  deliveryTime?: string;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
  assignedAt?: string;
  // Load Board Number for phone communication
  loadBoardNumber?: string;
  // Load Flow Tracking
  flowStage?:
    | 'broker_board'
    | 'dispatch_central'
    | 'main_dashboard'
    | 'completed';
  assignedBy?: string;
  assignedTo?: string;
  // Real-time tracking fields
  trackingEnabled?: boolean;
  currentLocation?: {
    lat: number;
    lng: number;
    timestamp: string;
  };
  estimatedProgress?: number;
  realTimeETA?: string;
  // Photo Requirements Configuration (flows from shipper → broker → driver)
  photoConfig?: {
    pickupPhotosRequired: boolean;
    deliveryPhotosRequired: boolean;
    minimumPhotos: number;
    canSkipPhotos: boolean; // Only photos can be skipped, other validations remain mandatory
    photoTypes?: string[]; // e.g., ['loaded_truck', 'bill_of_lading', 'unloaded_truck', 'delivery_receipt']
    shipperRequirement: boolean; // Set by original shipper
    brokerOverride: boolean; // Broker can enable/disable photos
    specialPhotoInstructions?: string;
  };
  // Accessorial Fees (detention, lumper, additional charges) - managed by dispatcher
  accessorials?: {
    detention: Array<{
      hours: number;
      ratePerHour: number;
      freeTimeHours: number;
      total: number;
      location: 'pickup' | 'delivery';
      approved: boolean;
      addedBy: string; // dispatcher ID
      timestamp: string;
    }>;
    lumper: Array<{
      amount: number;
      receiptNumber?: string;
      location: 'pickup' | 'delivery';
      approved: boolean;
      addedBy: string; // dispatcher ID
      timestamp: string;
    }>;
    other: Array<{
      type: string;
      description: string;
      amount: number;
      approved: boolean;
      addedBy: string; // dispatcher ID
      timestamp: string;
    }>;
    totalAmount: number;
  };
}

// Mock database - in production this would be a real database
const LOADS_DB: Load[] = [
  {
    id: 'FL-2025-001',
    brokerId: 'broker-001',
    brokerName: 'Global Freight Solutions',
    shipperId: 'ABC-204-070',
    shipperInfo: {
      id: 'ABC-204-070',
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
      specialInstructions: 'Loading dock available 6 AM - 6 PM weekdays',
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
    updatedAt: '2024-12-30T10:00:00Z',
  },
  {
    id: 'FL-2025-002',
    brokerId: 'broker-002',
    brokerName: 'Swift Freight',
    shipperId: 'RDI-204-050',
    shipperInfo: {
      id: 'RDI-204-050',
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
      specialInstructions: 'Heavy lifting equipment required',
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
    updatedAt: '2024-12-30T14:30:00Z',
  },
  {
    id: 'FL-2025-003',
    brokerId: 'broker-001',
    brokerName: 'Global Freight Solutions',
    shipperId: 'TSL-204-085',
    shipperInfo: {
      id: 'TSL-204-085',
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
      specialInstructions: 'Temperature controlled - maintain 34-38°F',
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
      timestamp: '2025-01-01T18:30:00Z',
    },
    estimatedProgress: 65,
    realTimeETA: '2025-01-02T08:00:00Z',
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
      specialInstructions: 'Fragile items - handle with care',
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
    updatedAt: '2024-12-31T14:20:00Z',
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
      specialInstructions: 'Flatbed required - tarps provided',
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
      timestamp: '2025-01-01T14:15:00Z',
    },
    estimatedProgress: 85,
    realTimeETA: '2025-01-01T20:00:00Z',
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
      specialInstructions: 'High-value cargo - secure transport required',
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
    updatedAt: '2024-12-31T16:30:00Z',
  },
];

// Generate unique load ID using comprehensive identification system
export const generateLoadId = (loadData?: Partial<Load>): string => {
  if (!loadData) {
    // Fallback to simple ID if no data provided
    const year = new Date().getFullYear();
    const count = LOADS_DB.length + 1;
    return `FL-${year}-${count.toString().padStart(3, '0')}`;
  }

  // Use comprehensive identification system
  const identificationData = {
    origin: loadData.origin || 'Unknown',
    destination: loadData.destination || 'Unknown',
    pickupDate: loadData.pickupDate || new Date().toISOString(),
    equipment: loadData.equipment || 'Dry Van',
    loadType: 'FTL' as const,
    brokerInitials: loadData.brokerName
      ? loadData.brokerName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
      : 'FF',
    brokerId: loadData.brokerId,
    brokerName: loadData.brokerName,
    shipperId: loadData.shipperId,
    commodity: loadData.commodity,
    weight: loadData.weight,
    rate: loadData.rate,
    distance: loadData.distance,
    isHazmat: loadData.isHazmat || false,
    isExpedited: loadData.isExpedited || false,
    isRefrigerated:
      loadData.equipment?.toLowerCase().includes('reefer') ||
      loadData.equipment?.toLowerCase().includes('refrigerated') ||
      false,
    isOversized: loadData.isOversized || false,
  };

  const identifiers =
    LoadIdentificationService.generateLoadIdentifiers(identificationData);

  // Store all identifiers in the load data for future reference
  if (loadData) {
    (loadData as any).identifiers = identifiers;
  }

  return identifiers.loadId;
};

// Generate Load Board Number for a load
export const generateLoadBoardNumber = (load: Load): string => {
  if (load.loadBoardNumber) return load.loadBoardNumber;

  try {
    const loadBoardId = EDIService.generateLoadBoardId({
      brokerName: load.brokerName || 'FleetFlow Management',
      shipperInfo: {
        companyName: load.shipperName || 'Unknown Shipper',
        permanentId: load.shipperId,
      },
      dispatcherName: load.dispatcherName,
      loadType: load.loadType || 'FTL',
      equipment: load.equipment,
    });

    return loadBoardId.loadBoardNumber;
  } catch (error) {
    console.error('Error generating load board number:', error);
    return '000000';
  }
};

// Create load in broker board
export const createLoadInBrokerBoard = (
  loadData: Omit<
    Load,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'brokerName'
    | 'dispatcherName'
    | 'flowStage'
  >
): Load => {
  const { user } = getCurrentUser();
  const dispatchers = getAvailableDispatchers();

  const newLoad: Load = {
    ...loadData,
    id: generateLoadId(loadData),
    brokerName: user.name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    flowStage: 'broker_board',
    loadBoardNumber: generateLoadBoardNumber(loadData as Load),
  };

  LOADS_DB.push(newLoad);
  initializeLoadTracking(newLoad);
  notifyDispatchCentral(newLoad, 'create');

  return newLoad;
};

// Assign load from broker to dispatcher
export const assignLoadToDispatcher = (
  loadId: string,
  dispatcherId: string
): Load | null => {
  const load = LOADS_DB.find((l) => l.id === loadId);
  const dispatchers = getAvailableDispatchers();
  const dispatcher = dispatchers.find((d: any) => d.id === dispatcherId);

  if (!load || !dispatcher) return null;

  load.dispatcherId = dispatcherId;
  load.dispatcherName = dispatcher.name;
  load.status = 'Assigned';
  load.flowStage = 'dispatch_central';
  load.assignedAt = new Date().toISOString();
  load.updatedAt = new Date().toISOString();

  // Ensure Load Board Number exists
  if (!load.loadBoardNumber) {
    load.loadBoardNumber = generateLoadBoardNumber(load);
  }

  notifyDispatchCentral(load, 'assignment');
  return load;
};

// Assign load directly to driver with schedule integration
export const assignLoadToDriver = async (
  loadId: string,
  driverId: string,
  driverName: string
): Promise<{
  success: boolean;
  load?: Load;
  schedule?: any;
  error?: string;
}> => {
  const load = LOADS_DB.find((l) => l.id === loadId);

  if (!load) {
    return {
      success: false,
      error: `Load ${loadId} not found`,
    };
  }

  if (load.status !== 'Available') {
    return {
      success: false,
      error: `Load ${loadId} is not available (current status: ${load.status})`,
    };
  }

  // Update load status and assignment
  load.driverId = driverId;
  load.driverName = driverName;
  load.status = 'Assigned';
  load.assignedAt = new Date().toISOString();
  load.updatedAt = new Date().toISOString();

  // Ensure Load Board Number exists
  if (!load.loadBoardNumber) {
    load.loadBoardNumber = generateLoadBoardNumber(load);
  }

  // 🗓️ SCHEDULE INTEGRATION: Create schedule entry for the assigned load
  const schedulingService = new SchedulingService();
  try {
    const scheduleResult = await schedulingService.createSchedule({
      title: `Load ${load.id} - ${load.origin} → ${load.destination}`,
      scheduleType: 'Delivery',
      assignedDriverId: driverId,
      driverName: driverName,
      assignedVehicleId: `vehicle-${driverId}`, // Assuming driver has associated vehicle
      origin: load.origin,
      destination: load.destination,
      startDate: load.pickupDate || new Date().toISOString().split('T')[0],
      endDate: load.deliveryDate || new Date().toISOString().split('T')[0],
      startTime: '08:00', // Default pickup time
      endTime: '17:00', // Default delivery time
      priority: 'Medium',
      status: 'Scheduled',
      description: `Equipment: ${load.equipment} | Weight: ${load.weight} | Rate: $${load.rate}\nAccepted via Marketplace Loadboard\nPickup: ${load.origin}\nDelivery: ${load.destination}\nRate: $${load.rate}\nDistance: ${load.distance}`,
    });

    if (scheduleResult.success) {
      console.log(
        `✅ Load ${load.id} added to driver ${driverName}'s schedule`
      );

      return {
        success: true,
        load,
        schedule: scheduleResult.schedule,
      };
    } else {
      console.warn(
        `⚠️ Load ${load.id} assigned but schedule conflict:`,
        scheduleResult.conflicts
      );

      return {
        success: true, // Load assignment succeeded
        load,
        error: `Schedule conflict detected: ${scheduleResult.conflicts?.map((c) => c.message).join(', ')}`,
      };
    }
  } catch (error) {
    console.error(`❌ Error creating schedule for load ${load.id}:`, error);

    return {
      success: true, // Load assignment succeeded
      load,
      error: `Failed to create schedule entry: ${error}`,
    };
  }
};

// Create new load with enhanced tracking capabilities
export const createLoad = (
  loadData: Omit<
    Load,
    'id' | 'createdAt' | 'updatedAt' | 'brokerName' | 'dispatcherName'
  >
): Load => {
  const { user } = getCurrentUser();
  const dispatchers = getAvailableDispatchers();
  const selectedDispatcher = loadData.dispatcherId
    ? dispatchers.find((d) => d.id === loadData.dispatcherId)
    : null;

  // Inherit photo requirements from shipper if available
  let photoConfig = undefined;
  if (loadData.shipperInfo && 'photoRequirements' in loadData.shipperInfo) {
    const shipperPhotoReqs = (loadData.shipperInfo as any).photoRequirements;
    if (shipperPhotoReqs) {
      photoConfig = {
        pickupPhotosRequired: shipperPhotoReqs.pickupPhotosRequired,
        deliveryPhotosRequired: shipperPhotoReqs.deliveryPhotosRequired,
        minimumPhotos: shipperPhotoReqs.minimumPhotos,
        canSkipPhotos: shipperPhotoReqs.canSkipPhotos,
        photoTypes: shipperPhotoReqs.photoTypes,
        shipperRequirement: true, // Set by original shipper
        brokerOverride: false, // No broker override yet
        specialPhotoInstructions: shipperPhotoReqs.specialPhotoInstructions,
      };
    }
  }

  const newLoad: Load = {
    ...loadData,
    id: generateLoadId(loadData), // Pass loadData to generate comprehensive ID
    brokerName: user.name,
    dispatcherName: selectedDispatcher?.name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // Photo Configuration inherited from shipper
    photoConfig,
    // Initialize tracking if enabled
    ...(loadData.trackingEnabled && {
      currentLocation: {
        lat: 33.749, // Default Atlanta coordinates (would be set based on origin)
        lng: -84.388,
        timestamp: new Date().toISOString(),
      },
      estimatedProgress: 0,
      realTimeETA: loadData.deliveryDate,
    }),
  };

  LOADS_DB.push(newLoad);

  // Trigger notifications to relevant systems
  notifyDispatchCentral(newLoad);
  notifyBrokerBox(newLoad);

  // If tracking enabled, initialize tracking service
  if (loadData.trackingEnabled) {
    initializeLoadTracking(newLoad);
  }

  return newLoad;
};

// Initialize tracking for a load
const initializeLoadTracking = (load: Load) => {
  logger.info('Initializing real-time tracking', {
    loadId: load.id,
    origin: load.origin,
    destination: load.destination,
    trackingEnabled: load.trackingEnabled,
  });

  // In production, this would:
  // 1. Register the load with your GPS tracking service
  // 2. Set up geofencing for pickup/delivery locations
  // 3. Configure automated status updates
  // 4. Initialize real-time data streaming
};

// Update load
export const updateLoad = (
  loadId: string,
  updates: Partial<Load>
): Load | null => {
  const loadIndex = LOADS_DB.findIndex((load) => load.id === loadId);
  if (loadIndex === -1) return null;

  const oldLoad = LOADS_DB[loadIndex];
  const updatedLoad = {
    ...oldLoad,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // If dispatcher is being assigned/changed
  if (
    updates.dispatcherId &&
    updates.dispatcherId !== LOADS_DB[loadIndex].dispatcherId
  ) {
    const dispatchers = getAvailableDispatchers();
    const dispatcher = dispatchers.find(
      (d: any) => d.id === updates.dispatcherId
    );
    updatedLoad.dispatcherName = dispatcher?.name;
    updatedLoad.assignedAt = new Date().toISOString();

    // Notify dispatch central of assignment
    notifyDispatchCentral(updatedLoad, 'assignment');
  }

  LOADS_DB[loadIndex] = updatedLoad;

  // 🤖 AUTOMATED COMMUNICATION INTEGRATION
  // Trigger automated communication if status changed
  if (updates.status && updates.status !== oldLoad.status) {
    handleLoadStatusChangeWithCommunication(
      updatedLoad.id,
      oldLoad.status,
      updates.status,
      updatedLoad
    );
  }

  // Trigger notifications
  notifyDispatchCentral(updatedLoad, 'update');
  notifyBrokerBox(updatedLoad, 'update');

  return updatedLoad;
};

// 🤖 AUTOMATED COMMUNICATION HANDLER
// Handles load status changes with smart communication automation
const handleLoadStatusChangeWithCommunication = async (
  loadId: string,
  oldStatus: string,
  newStatus: string,
  loadData: Load
) => {
  try {
    logger.info(
      'Load status updated',
      { loadId, oldStatus, newStatus },
      'LoadService'
    );

    // Prepare load data for communication
    const communicationData = {
      customerName:
        loadData.shipperInfo?.contactName ||
        loadData.shipperInfo?.companyName ||
        'Customer',
      customerCompany: loadData.shipperInfo?.companyName || 'Unknown Company',
      customerPhone: loadData.shipperInfo?.phone || '+1234567890', // Replace with actual customer phone
      driverName: 'Driver Name', // TODO: Get from driver assignment
      eta: loadData.deliveryDate,
      currentLocation: loadData.currentLocation
        ? `${loadData.currentLocation.lat}, ${loadData.currentLocation.lng}`
        : loadData.origin,
      delayHours: 0, // TODO: Calculate from expected vs actual timing
      delayReason: '', // TODO: Get from load updates
      newEta: loadData.realTimeETA || loadData.deliveryDate,
      brokerName: loadData.brokerName,
      dispatcherName: loadData.dispatcherName,
    };

    // Trigger automated communication via integration
    await DispatchCommunicationIntegration.handleLoadStatusChange(
      loadId,
      oldStatus,
      newStatus,
      communicationData
    );

    logger.info('Automated communication triggered', { loadId }, 'LoadService');
  } catch (error) {
    console.error(
      `❌ Failed to trigger automated communication for load ${loadId}:`,
      error
    );
  }
};

// 🚨 DRIVER EVENT HANDLER
// Handles driver events (breakdowns, accidents, delays) with automated communication
export const handleDriverEvent = async (
  loadId: string,
  eventType: 'breakdown' | 'accident' | 'running_late' | 'route_deviation',
  eventData: {
    driverName?: string;
    driverPhone?: string;
    currentLocation?: string;
    delayMinutes?: number;
    breakdownType?: string;
    description?: string;
  }
) => {
  try {
    console.log(`👨‍💼 Driver event for ${loadId}: ${eventType}`);

    // Update load status if needed
    if (eventType === 'breakdown' || eventType === 'accident') {
      updateLoad(loadId, {
        status: 'In Transit', // Keep in transit but mark as having issues
        updatedAt: new Date().toISOString(),
      });
    }

    // Trigger automated communication
    await DispatchCommunicationIntegration.handleDriverEvent(
      loadId,
      eventType,
      eventData
    );

    console.log(`✅ Driver event communication triggered for load ${loadId}`);
  } catch (error) {
    console.error(
      `❌ Failed to handle driver event for load ${loadId}:`,
      error
    );
  }
};

// 📞 CUSTOMER INQUIRY HANDLER
// Handles customer inquiries with automated communication routing
export const handleCustomerInquiry = async (
  customerId: string,
  inquiryType:
    | 'rate_request'
    | 'complaint'
    | 'delivery_status'
    | 'billing_dispute',
  inquiryData: {
    customerName?: string;
    customerCompany?: string;
    customerPhone?: string;
    loadId?: string;
    hasIssues?: boolean;
    description?: string;
  }
) => {
  try {
    console.log(`📞 Customer inquiry: ${inquiryType}`);

    // Trigger automated communication with smart escalation
    await DispatchCommunicationIntegration.handleCustomerInquiry(
      customerId,
      inquiryType,
      inquiryData
    );

    console.log(
      `✅ Customer inquiry communication triggered for ${customerId}`
    );
  } catch (error) {
    console.error(
      `❌ Failed to handle customer inquiry for ${customerId}:`,
      error
    );
  }
};

// Assign dispatcher to load
export const assignDispatcherToLoad = (
  loadId: string,
  dispatcherId: string
): boolean => {
  const dispatchers = getAvailableDispatchers();
  const dispatcher = dispatchers.find((d: any) => d.id === dispatcherId);

  if (!dispatcher) return false;

  const result = updateLoad(loadId, {
    dispatcherId,
    dispatcherName: dispatcher.name,
    status: 'Available',
  });

  return result !== null;
};

// Get loads for current user
export const getLoadsForUser = (): Load[] => {
  const { user, permissions } = getCurrentUser();

  if (
    user.role === 'admin' ||
    user.role === 'manager' ||
    user.role === 'dispatcher'
  ) {
    // Dispatchers, managers, admins see all loads
    return LOADS_DB;
  } else if (user.role === 'driver') {
    // Drivers see only their assigned loads
    return LOADS_DB.filter((load) => load.driverId === user.id);
  }

  // Default: return all loads for demo purposes
  return LOADS_DB;
};

// Enhanced multi-tenant load filtering
export const getLoadsForTenant = (): Load[] => {
  return MultiTenantDataService.filterLoadsForTenant(LOADS_DB);
};

// Get tenant-specific statistics
export const getTenantLoadStats = () => {
  return MultiTenantDataService.getTenantStats(LOADS_DB);
};

// Get loads for carrier portal (shows available loads to carriers)
export const getLoadsForCarrierPortal = (): Load[] => {
  // Always return demo loads for carrier portal
  return [
    {
      id: 'FL-2025-DEMO-001',
      brokerId: 'broker-001',
      brokerName: 'Global Freight Solutions',
      origin: 'Atlanta, GA',
      destination: 'Miami, FL',
      rate: 2450,
      distance: '647 mi',
      weight: '45,000 lbs',
      equipment: 'Dry Van',
      status: 'Available' as const,
      pickupDate: '2025-01-02',
      deliveryDate: '2025-01-03',
      createdAt: '2024-12-30T10:00:00Z',
      updatedAt: '2024-12-30T10:00:00Z',
    },
    {
      id: 'FL-2025-DEMO-002',
      brokerId: 'broker-002',
      brokerName: 'Swift Freight',
      origin: 'Chicago, IL',
      destination: 'Houston, TX',
      rate: 3200,
      distance: '925 mi',
      weight: '38,500 lbs',
      equipment: 'Reefer',
      status: 'Available' as const,
      pickupDate: '2025-01-03',
      deliveryDate: '2025-01-05',
      createdAt: '2024-12-30T09:15:00Z',
      updatedAt: '2024-12-30T14:30:00Z',
    },
    {
      id: 'FL-2025-DEMO-003',
      brokerId: 'broker-003',
      brokerName: 'Express Cargo',
      origin: 'Los Angeles, CA',
      destination: 'Seattle, WA',
      rate: 2800,
      distance: '1,135 mi',
      weight: '42,000 lbs',
      equipment: 'Dry Van',
      status: 'Available' as const,
      pickupDate: '2025-01-04',
      deliveryDate: '2025-01-06',
      createdAt: '2024-12-31T08:00:00Z',
      updatedAt: '2024-12-31T08:00:00Z',
    },
  ];
};

// Get loads by dispatcher
export const getLoadsByDispatcher = (dispatcherId: string): Load[] => {
  return LOADS_DB.filter((load) => load.dispatcherId === dispatcherId);
};

// Get unassigned loads
export const getUnassignedLoads = (): Load[] => {
  return LOADS_DB.filter((load) => !load.dispatcherId);
};

// Get loads by flow stage
export const getLoadsByFlowStage = (stage: Load['flowStage']): Load[] => {
  return LOADS_DB.filter((load) => load.flowStage === stage);
};

// Get broker loads (broker board)
export const getBrokerLoads = (brokerId?: string): Load[] => {
  const { user } = getCurrentUser();
  const brokerIdToUse = brokerId || user.id;

  return LOADS_DB.filter(
    (load) =>
      load.brokerId === brokerIdToUse && load.flowStage === 'broker_board'
  ).map((load) => ({
    ...load,
    loadBoardNumber: load.loadBoardNumber || generateLoadBoardNumber(load),
  }));
};

// Get dispatcher loads (dispatch central) - LEGACY METHOD
export const getDispatcherLoads = (dispatcherId?: string): Load[] => {
  const { user } = getCurrentUser();
  const dispatcherIdToUse = dispatcherId || user.id;

  return LOADS_DB.filter(
    (load) =>
      load.dispatcherId === dispatcherIdToUse &&
      load.flowStage === 'dispatch_central'
  ).map((load) => ({
    ...load,
    loadBoardNumber: load.loadBoardNumber || generateLoadBoardNumber(load),
  }));
};

// MULTI-TENANT METHODS - New architecture supporting flexible user types

/**
 * Get loads for current tenant (user-specific data isolation)
 * Supports individual dispatchers and dispatch companies
 */
export const getTenantLoads = (): Load[] => {
  return MultiTenantDataService.filterLoadsForTenant(LOADS_DB).map((load) => ({
    ...load,
    loadBoardNumber: load.loadBoardNumber || generateLoadBoardNumber(load),
  }));
};

/**
 * Get global load board (shared marketplace - not filtered by tenant)
 * All users see the same available loads
 */
export const getGlobalLoadBoard = (): Load[] => {
  return MultiTenantDataService.getGlobalLoadBoard(LOADS_DB).map((load) => ({
    ...load,
    loadBoardNumber: load.loadBoardNumber || generateLoadBoardNumber(load),
  }));
};

/**
 * Get tenant-specific statistics
 */
export const getTenantStats = () => {
  return MultiTenantDataService.getTenantStats(LOADS_DB);
};

/**
 * Check if current user has access to a specific load
 */
export const hasLoadAccess = (load: Load): boolean => {
  return MultiTenantDataService.hasAccessToLoad(load);
};

// Function to add AI-generated expedited loads to the system
export const addAIExpeditedLoad = (loadData: {
  origin: string;
  destination: string;
  rate: number;
  weight: number;
  equipment: string;
  urgency?: 'low' | 'medium' | 'high';
  pickupTime?: Date;
  deliveryTime?: Date;
}): Load => {
  const newLoad: Load = {
    id: `GWF-AI-${Date.now()}`,
    brokerId: 'gwf-ai-system',
    brokerName: 'Go With the Flow',
    origin: loadData.origin,
    destination: loadData.destination,
    rate: loadData.rate,
    distance: 'Calculating...',
    weight: loadData.weight.toString(),
    equipment: loadData.equipment,
    status: 'Available',
    pickupDate:
      loadData.pickupTime?.toISOString().split('T')[0] ||
      new Date().toISOString().split('T')[0],
    deliveryDate:
      loadData.deliveryTime?.toISOString().split('T')[0] ||
      new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    loadBoardNumber: `GWF-AI-${Date.now().toString().slice(-4)}`,
    loadType: 'Expedited',
  };

  // Add to the database
  LOADS_DB.push(newLoad);

  // Notify dispatch central
  notifyDispatchCentral(newLoad, 'create');

  console.log(`🚀 AI-generated expedited load added: ${newLoad.id}`);
  return newLoad;
};

// Get all loads for main dashboard
export const getMainDashboardLoads = (): Load[] => {
  // Get regular loads
  const regularLoads = LOADS_DB.map((load) => ({
    ...load,
    loadBoardNumber: load.loadBoardNumber || generateLoadBoardNumber(load),
  }));

  // Get expedited loads from Go With the Flow service
  try {
    const { GoWithTheFlowService } = require('./GoWithTheFlowService');
    const gwfService = new GoWithTheFlowService();
    const expeditedLoads = gwfService
      .getLiveLoads()
      .map((expeditedLoad: any) => ({
        id: expeditedLoad.id,
        brokerId: 'gwf-system',
        brokerName: 'Go With the Flow',
        origin: expeditedLoad.origin.address,
        destination: expeditedLoad.destination.address,
        rate: expeditedLoad.rate,
        distance: `${Math.round(expeditedLoad.origin.lat)} mi`, // Simplified distance
        weight: expeditedLoad.weight.toString(),
        equipment: expeditedLoad.equipmentType,
        status:
          expeditedLoad.status === 'offered'
            ? 'Available'
            : expeditedLoad.status === 'accepted'
              ? 'Assigned'
              : 'Available',
        pickupDate: expeditedLoad.pickupTime.toISOString().split('T')[0],
        deliveryDate: expeditedLoad.deliveryTime.toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        loadBoardNumber: `GWF-${expeditedLoad.id.split('-').pop()}`,
        loadType: 'Expedited',
        urgency: expeditedLoad.urgency || 'medium',
      }));

    return [...regularLoads, ...expeditedLoads];
  } catch (error) {
    console.warn(
      'Go With the Flow service not available, using regular loads only'
    );
    return regularLoads;
  }
};

// Notification system (in production, these would be real notifications/webhooks)
const notifyDispatchCentral = (
  load: Load,
  action: 'create' | 'update' | 'assignment' = 'create'
) => {
  console.log(`🚨 Dispatch Central Notification: Load ${load.id} ${action}`, {
    loadId: load.id,
    broker: load.brokerName,
    dispatcher: load.dispatcherName,
    route: `${load.origin} → ${load.destination}`,
    status: load.status,
    action,
  });

  // In production, this would send to dispatch central dashboard
  // updateDispatchBoard(load)
};

const notifyBrokerBox = (
  load: Load,
  action: 'create' | 'update' = 'create'
) => {
  console.log(`📦 Broker Box Notification: Load ${load.id} ${action}`, {
    loadId: load.id,
    dispatcher: load.dispatcherName,
    status: load.status,
    action,
  });

  // In production, this would update broker dashboard
  // updateBrokerDashboard(load)
};

// Search loads
export const searchLoads = (query: string): Load[] => {
  const userLoads = getLoadsForUser();
  return userLoads.filter(
    (load) =>
      load.id.toLowerCase().includes(query.toLowerCase()) ||
      load.origin.toLowerCase().includes(query.toLowerCase()) ||
      load.destination.toLowerCase().includes(query.toLowerCase()) ||
      load.brokerName.toLowerCase().includes(query.toLowerCase()) ||
      (load.dispatcherName &&
        load.dispatcherName.toLowerCase().includes(query.toLowerCase()))
  );
};

// Get load statistics
export const getLoadStats = () => {
  const userLoads = getLoadsForUser();

  return {
    total: userLoads.length,
    available: userLoads.filter((l) => l.status === 'Available').length,
    assigned: userLoads.filter((l) => l.status === 'Assigned').length,
    broadcasted: userLoads.filter((l) => l.status === 'Broadcasted').length,
    driverSelected: userLoads.filter((l) => l.status === 'Driver Selected')
      .length,
    orderSent: userLoads.filter((l) => l.status === 'Order Sent').length,
    inTransit: userLoads.filter((l) => l.status === 'In Transit').length,
    delivered: userLoads.filter((l) => l.status === 'Delivered').length,
    unassigned: userLoads.filter((l) => !l.dispatcherId).length,
  };
};

// Enhanced Analytics for Business Intelligence

// Get completed loads with date filtering
export const getCompletedLoads = (dateRange: string = '30d'): Load[] => {
  const userLoads = getLoadsForUser();
  const completedLoads = userLoads.filter(
    (load) => load.status === 'Delivered'
  );

  // Filter by date range
  const now = new Date();
  const filterDate = new Date();

  switch (dateRange) {
    case '7d':
      filterDate.setDate(now.getDate() - 7);
      break;
    case '30d':
      filterDate.setDate(now.getDate() - 30);
      break;
    case '90d':
      filterDate.setDate(now.getDate() - 90);
      break;
    case '1y':
      filterDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      filterDate.setDate(now.getDate() - 30);
  }

  return completedLoads.filter((load) => {
    const loadDate = new Date(load.updatedAt);
    return loadDate >= filterDate;
  });
};

// Get completed loads analytics
export const getCompletedLoadsAnalytics = (dateRange: string = '30d') => {
  const completedLoads = getCompletedLoads(dateRange);
  const totalRevenue = completedLoads.reduce((sum, load) => sum + load.rate, 0);

  // Calculate average rate per mile
  const avgRatePerMile =
    completedLoads.reduce((sum, load) => {
      const miles = parseFloat(load.distance?.replace(' mi', '') || '100');
      return sum + load.rate / miles;
    }, 0) / completedLoads.length || 0;

  return {
    totalCompleted: completedLoads.length,
    totalRevenue,
    avgRevenue: totalRevenue / completedLoads.length || 0,
    avgRatePerMile,
    avgDeliveryTime: 2.3, // Mock data - calculate from actual delivery dates
    onTimeDeliveryRate: 94.2, // Mock data - calculate from delivery date vs scheduled date
  };
};

// Get driver performance analytics
export const getDriverPerformanceAnalytics = (dateRange: string = '30d') => {
  const completedLoads = getCompletedLoads(dateRange);
  const driverPerformance = new Map();

  completedLoads.forEach((load) => {
    const driverName = load.dispatcherName || 'Unknown Driver';
    if (!driverPerformance.has(driverName)) {
      driverPerformance.set(driverName, {
        name: driverName,
        completedLoads: 0,
        totalRevenue: 0,
        totalMiles: 0,
        onTimeDeliveries: 0,
        onTimeRate: 0,
      });
    }

    const driver = driverPerformance.get(driverName);
    driver.completedLoads++;
    driver.totalRevenue += load.rate;
    driver.totalMiles += parseFloat(load.distance?.replace(' mi', '') || '100');

    // Mock on-time calculation - in real implementation, compare delivery date with scheduled
    driver.onTimeDeliveries += Math.random() > 0.1 ? 1 : 0; // 90% on-time rate mock
  });

  // Calculate on-time rates
  Array.from(driverPerformance.values()).forEach((driver) => {
    driver.onTimeRate = (driver.onTimeDeliveries / driver.completedLoads) * 100;
  });

  return Array.from(driverPerformance.values()).sort(
    (a, b) => b.totalRevenue - a.totalRevenue
  );
};

// Get customer analytics
export const getCustomerAnalytics = (dateRange: string = '30d') => {
  const completedLoads = getCompletedLoads(dateRange);
  const customerMap = new Map();

  completedLoads.forEach((load) => {
    if (!customerMap.has(load.brokerName)) {
      customerMap.set(load.brokerName, {
        brokerName: load.brokerName,
        loadsCompleted: 0,
        totalRevenue: 0,
        totalMiles: 0,
        avgRate: 0,
        avgRatePerMile: 0,
      });
    }

    const customer = customerMap.get(load.brokerName);
    customer.loadsCompleted++;
    customer.totalRevenue += load.rate;
    customer.totalMiles += parseFloat(
      load.distance?.replace(' mi', '') || '100'
    );
  });

  return Array.from(customerMap.values())
    .map((customer) => ({
      ...customer,
      avgRate: customer.totalRevenue / customer.loadsCompleted,
      avgRatePerMile: customer.totalRevenue / customer.totalMiles,
    }))
    .sort((a, b) => b.totalRevenue - a.totalRevenue);
};

// Get workflow compliance analytics
export const getWorkflowAnalytics = (dateRange: string = '30d') => {
  const completedLoads = getCompletedLoads(dateRange);

  // Mock workflow compliance data - in real implementation,
  // this would query the workflow completion database
  return {
    photoComplianceRate: 97.8,
    signatureComplianceRate: 99.2,
    documentComplianceRate: 96.5,
    avgWorkflowTime: 4.2, // hours
    totalWorkflowsCompleted: completedLoads.length,
    workflowIssues: Math.floor(completedLoads.length * 0.02), // 2% issue rate
  };
};

// Get revenue trends over time
export const getRevenueTrends = (dateRange: string = '30d') => {
  const completedLoads = getCompletedLoads(dateRange);
  const trends = [];
  const today = new Date();
  const days =
    dateRange === '7d'
      ? 7
      : dateRange === '30d'
        ? 30
        : dateRange === '90d'
          ? 90
          : 365;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // In real implementation, filter loads by actual completion date
    const dayLoads = completedLoads.filter((load) => {
      const loadDate = new Date(load.updatedAt);
      return loadDate.toISOString().split('T')[0] === dateStr;
    });

    const completed = dayLoads.length;
    const revenue = dayLoads.reduce((sum, load) => sum + load.rate, 0);

    trends.push({
      date: dateStr,
      completed,
      revenue,
    });
  }

  return trends;
};

// Get load completion rate by time period
export const getCompletionRateByPeriod = (dateRange: string = '30d') => {
  const allLoads = getLoadsForUser();
  const completedLoads = getCompletedLoads(dateRange);
  const totalLoadsInPeriod = allLoads.length; // In real implementation, filter by date range

  return {
    completionRate: (completedLoads.length / totalLoadsInPeriod) * 100,
    totalLoads: totalLoadsInPeriod,
    completedLoads: completedLoads.length,
    activeLoads: allLoads.filter((l) =>
      ['Assigned', 'In Transit'].includes(l.status)
    ).length,
    availableLoads: allLoads.filter((l) => l.status === 'Available').length,
  };
};

// ========================================
// 📦 SIMPLIFIED SHIPPER TRACKING SYSTEM
// ========================================
// Provides vendors/shippers with essential load status updates
// without overwhelming them with detailed workflow information

export interface ShipperTrackingStatus {
  loadId: string;
  shipperName: string;
  currentStatus: 'dispatched' | 'pickup_complete' | 'in_transit' | 'delivered';
  statusDisplay: string;
  lastUpdated: string;
  estimatedDelivery?: string;
  // Essential tracking points
  milestones: {
    bolCreated?: {
      completed: boolean;
      timestamp?: string;
      location?: string;
      driverName?: string;
    };
    transitUpdate?: {
      completed: boolean;
      timestamp?: string;
      currentLocation?: string;
      estimatedArrival?: string;
    };
    deliveryComplete?: {
      completed: boolean;
      timestamp?: string;
      deliveredTo?: string;
      signedBy?: string;
    };
  };
  route: {
    origin: string;
    destination: string;
    distance: string;
  };
  contact: {
    brokerName: string;
    brokerPhone?: string;
    dispatcherName?: string;
  };
}

// Map detailed workflow steps to simplified shipper statuses
const mapWorkflowToShipperStatus = (
  workflow: any
): ShipperTrackingStatus['currentStatus'] => {
  if (!workflow) return 'dispatched';

  const completedSteps =
    workflow.steps?.filter((step: any) => step.completed) || [];
  const completedStepIds = completedSteps.map((step: any) => step.id);

  // Check delivery completion
  if (
    completedStepIds.includes('delivery_completion') ||
    completedStepIds.includes('pod_submission')
  ) {
    return 'delivered';
  }

  // Check if in transit
  if (
    completedStepIds.includes('transit_start') ||
    completedStepIds.includes('transit_tracking') ||
    completedStepIds.includes('delivery_arrival')
  ) {
    return 'in_transit';
  }

  // Check if pickup is complete (BOL created)
  if (completedStepIds.includes('pickup_completion')) {
    return 'pickup_complete';
  }

  return 'dispatched';
};

// Get simplified tracking status for a specific load (shipper view)
export const getShipperTrackingStatus = async (
  loadId: string
): Promise<ShipperTrackingStatus | null> => {
  const load = LOADS_DB.find((l) => l.id === loadId);
  if (!load) return null;

  // Get workflow data from workflow manager
  const workflowManager = await import('../../lib/workflowManager');
  const workflow = workflowManager.workflowManager.getWorkflow(loadId);

  const currentStatus = mapWorkflowToShipperStatus(workflow);

  // Extract milestone information from workflow
  const completedSteps =
    workflow?.steps?.filter((step: any) => step.completed) || [];
  const stepMap = new Map(completedSteps.map((step: any) => [step.id, step]));

  const trackingStatus: ShipperTrackingStatus = {
    loadId: load.id,
    shipperName:
      load.shipperInfo?.companyName || load.shipperName || 'Unknown Shipper',
    currentStatus,
    statusDisplay: getShipperStatusDisplay(currentStatus),
    lastUpdated: load.updatedAt,
    estimatedDelivery: load.deliveryDate,
    milestones: {
      bolCreated: {
        completed: stepMap.has('pickup_completion'),
        timestamp: stepMap.get('pickup_completion')?.completedAt,
        location: load.origin,
        driverName: stepMap.get('pickup_completion')?.completedBy,
      },
      transitUpdate: {
        completed:
          stepMap.has('transit_tracking') || stepMap.has('delivery_arrival'),
        timestamp:
          stepMap.get('transit_tracking')?.completedAt ||
          stepMap.get('delivery_arrival')?.completedAt,
        currentLocation: load.currentLocation
          ? `${load.currentLocation.lat}, ${load.currentLocation.lng}`
          : undefined,
        estimatedArrival: load.realTimeETA,
      },
      deliveryComplete: {
        completed: stepMap.has('delivery_completion'),
        timestamp: stepMap.get('delivery_completion')?.completedAt,
        deliveredTo: stepMap.get('delivery_completion')?.data?.receiverName,
        signedBy: stepMap.get('delivery_completion')?.data?.receiverName,
      },
    },
    route: {
      origin: load.origin || 'TBD',
      destination: load.destination || 'TBD',
      distance: load.distance || 'Calculating...',
    },
    contact: {
      brokerName: load.brokerName,
      brokerPhone: '+1 (555) 123-4567', // In production, get from broker record
      dispatcherName: load.dispatcherName,
    },
  };

  return trackingStatus;
};

// Get user-friendly status display text
const getShipperStatusDisplay = (
  status: ShipperTrackingStatus['currentStatus']
): string => {
  switch (status) {
    case 'dispatched':
      return '🚛 Driver Assigned - Heading to Pickup';
    case 'pickup_complete':
      return '📋 BOL Created - Load Picked Up';
    case 'in_transit':
      return '🛣️ In Transit - En Route to Delivery';
    case 'delivered':
      return '✅ Delivered - Complete';
    default:
      return '📍 Processing';
  }
};

// Get all loads for a specific shipper (simplified view)
export const getShipperLoads = async (
  shipperId: string
): Promise<ShipperTrackingStatus[]> => {
  const shipperLoads = LOADS_DB.filter(
    (load) => load.shipperId === shipperId || load.shipperInfo?.id === shipperId
  );

  const trackingStatuses: ShipperTrackingStatus[] = [];

  for (const load of shipperLoads) {
    const status = await getShipperTrackingStatus(load.id);
    if (status) {
      trackingStatuses.push(status);
    }
  }

  return trackingStatuses.sort(
    (a, b) =>
      new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
  );
};

// Get shipper dashboard summary
export const getShipperDashboardSummary = async (shipperId: string) => {
  const loads = await getShipperLoads(shipperId);

  const summary = {
    totalLoads: loads.length,
    dispatched: loads.filter((l) => l.currentStatus === 'dispatched').length,
    pickupComplete: loads.filter((l) => l.currentStatus === 'pickup_complete')
      .length,
    inTransit: loads.filter((l) => l.currentStatus === 'in_transit').length,
    delivered: loads.filter((l) => l.currentStatus === 'delivered').length,
    recentActivity: loads.slice(0, 5), // Last 5 loads
    deliveryPerformance: {
      onTimeRate: 96.2, // In production, calculate from actual data
      avgTransitTime: '2.3 days',
      totalRevenue: loads.reduce((sum, load) => {
        const originalLoad = LOADS_DB.find((l) => l.id === load.loadId);
        return sum + (originalLoad?.rate || 0);
      }, 0),
    },
  };

  return summary;
};

// Send simplified status update notification to shipper
export const notifyShipperStatusUpdate = async (
  loadId: string,
  milestone: 'bolCreated' | 'transitUpdate' | 'deliveryComplete',
  additionalData?: any
) => {
  const status = await getShipperTrackingStatus(loadId);
  if (!status) return;

  const messages = {
    bolCreated: `📋 Load ${loadId}: BOL created and pickup completed at ${status.route.origin}. Your freight is now in transit.`,
    transitUpdate: `🛣️ Load ${loadId}: In transit update. ${status.milestones.transitUpdate?.currentLocation ? `Current location: ${status.milestones.transitUpdate.currentLocation}` : 'En route to destination'}. ETA: ${status.milestones.transitUpdate?.estimatedArrival || status.estimatedDelivery}`,
    deliveryComplete: `✅ Load ${loadId}: Delivered successfully to ${status.route.destination}. ${status.milestones.deliveryComplete?.signedBy ? `Signed by: ${status.milestones.deliveryComplete.signedBy}` : 'Delivery confirmed'}.`,
  };

  // In production, send via SMS, email, or push notification
  console.log(`📱 Shipper Notification: ${messages[milestone]}`);

  // Could integrate with existing notification services
  return {
    sent: true,
    message: messages[milestone],
    timestamp: new Date().toISOString(),
    shipperId: status.shipperName,
    loadId,
    milestone,
  };
};

// ========================================
// 🔗 WORKFLOW INTEGRATION HOOKS
// ========================================
// These functions can be called from the detailed workflow system
// to trigger simplified shipper notifications

// ========================================
// ACCESSORIAL FEES MANAGEMENT (Dispatcher Functions)
// ========================================

export const addDetentionFee = (
  loadId: string,
  hours: number,
  ratePerHour: number = 50,
  location: 'pickup' | 'delivery',
  dispatcherId: string
): boolean => {
  const load = LOADS_DB.find((l) => l.id === loadId);
  if (!load) return false;

  if (!load.accessorials) {
    load.accessorials = {
      detention: [],
      lumper: [],
      other: [],
      totalAmount: 0,
    };
  }

  const freeTimeHours = 2; // Standard 2 hours free time
  const billableHours = Math.max(0, hours - freeTimeHours);
  const total = billableHours * ratePerHour;

  load.accessorials.detention.push({
    hours: billableHours,
    ratePerHour,
    freeTimeHours,
    total,
    location,
    approved: false, // Requires approval before billing
    addedBy: dispatcherId,
    timestamp: new Date().toISOString(),
  });

  recalculateAccessorialTotal(load);
  return true;
};

export const addLumperFee = (
  loadId: string,
  amount: number,
  location: 'pickup' | 'delivery',
  receiptNumber: string,
  dispatcherId: string
): boolean => {
  const load = LOADS_DB.find((l) => l.id === loadId);
  if (!load) return false;

  if (!load.accessorials) {
    load.accessorials = {
      detention: [],
      lumper: [],
      other: [],
      totalAmount: 0,
    };
  }

  load.accessorials.lumper.push({
    amount,
    receiptNumber,
    location,
    approved: false, // Requires approval before billing
    addedBy: dispatcherId,
    timestamp: new Date().toISOString(),
  });

  recalculateAccessorialTotal(load);
  return true;
};

export const addOtherAccessorial = (
  loadId: string,
  type: string,
  description: string,
  amount: number,
  dispatcherId: string
): boolean => {
  const load = LOADS_DB.find((l) => l.id === loadId);
  if (!load) return false;

  if (!load.accessorials) {
    load.accessorials = {
      detention: [],
      lumper: [],
      other: [],
      totalAmount: 0,
    };
  }

  load.accessorials.other.push({
    type,
    description,
    amount,
    approved: false, // Requires approval before billing
    addedBy: dispatcherId,
    timestamp: new Date().toISOString(),
  });

  recalculateAccessorialTotal(load);
  return true;
};

export const approveAccessorialFee = (
  loadId: string,
  feeType: 'detention' | 'lumper' | 'other',
  feeIndex: number
): boolean => {
  const load = LOADS_DB.find((l) => l.id === loadId);
  if (!load?.accessorials) return false;

  if (feeType === 'detention' && load.accessorials.detention[feeIndex]) {
    load.accessorials.detention[feeIndex].approved = true;
  } else if (feeType === 'lumper' && load.accessorials.lumper[feeIndex]) {
    load.accessorials.lumper[feeIndex].approved = true;
  } else if (feeType === 'other' && load.accessorials.other[feeIndex]) {
    load.accessorials.other[feeIndex].approved = true;
  }

  recalculateAccessorialTotal(load);
  return true;
};

const recalculateAccessorialTotal = (load: Load) => {
  if (!load.accessorials) return;

  const detentionTotal = load.accessorials.detention
    .filter((d) => d.approved)
    .reduce((sum, d) => sum + d.total, 0);

  const lumperTotal = load.accessorials.lumper
    .filter((l) => l.approved)
    .reduce((sum, l) => sum + l.amount, 0);

  const otherTotal = load.accessorials.other
    .filter((o) => o.approved)
    .reduce((sum, o) => sum + o.amount, 0);

  load.accessorials.totalAmount = detentionTotal + lumperTotal + otherTotal;
};

export const getLoadAccessorials = (loadId: string) => {
  const load = LOADS_DB.find((l) => l.id === loadId);
  return (
    load?.accessorials || {
      detention: [],
      lumper: [],
      other: [],
      totalAmount: 0,
    }
  );
};

export const onWorkflowStepCompleted = async (
  loadId: string,
  stepId: string
) => {
  // Map workflow steps to shipper milestones
  const stepToMilestone: Record<
    string,
    'bolCreated' | 'transitUpdate' | 'deliveryComplete'
  > = {
    pickup_completion: 'bolCreated',
    transit_tracking: 'transitUpdate',
    delivery_arrival: 'transitUpdate',
    delivery_completion: 'deliveryComplete',
  };

  const milestone = stepToMilestone[stepId];
  if (milestone) {
    await notifyShipperStatusUpdate(loadId, milestone);
  }
};
