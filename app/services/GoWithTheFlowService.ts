// 🚛⚡ GO WITH THE FLOW - INTELLIGENT FREIGHT MATCHING SERVICE
//
// This service implements intelligent freight matching for logistics:
// - Real-time driver availability tracking
// - Intelligent load matching with rapid response system
// - Market-based pricing with demand adjustments
// - Push notifications for load opportunities
// - GPS tracking and live location updates
// - "Go Online/Offline" driver availability toggle
// - Shipper "Request a Truck" interface
// - In-app messaging and communication
// - Earnings dashboard and trip history
// - Rating system for all parties

import { EventEmitter } from 'events';

// Equipment Types - WARP-Style Multi-Modal Support
export const EQUIPMENT_TYPES = {
  // Traditional Trucking (Large)
  DRY_VAN: 'Dry Van',
  REEFER: 'Reefer',
  FLATBED: 'Flatbed',

  // PHASE 1: Multi-Equipment Support (Small to Medium)
  CARGO_VAN: 'Cargo Van',
  SPRINTER_VAN: 'Sprinter Van',
  BOX_TRUCK_16: 'Box Truck (16ft)',
  BOX_TRUCK_20: 'Box Truck (20ft)',
  BOX_TRUCK_24: 'Box Truck (24ft)',
  BOX_TRUCK_26: 'Box Truck (26ft)',
  STRAIGHT_TRUCK: 'Straight Truck',
  HOT_SHOT: 'Hot Shot',
  STEP_VAN: 'Step Van',
} as const;

export type EquipmentType =
  (typeof EQUIPMENT_TYPES)[keyof typeof EQUIPMENT_TYPES];

// Equipment Categories for better matching
export const EQUIPMENT_CATEGORIES = {
  SMALL_VEHICLES: [EQUIPMENT_TYPES.CARGO_VAN, EQUIPMENT_TYPES.SPRINTER_VAN],
  MEDIUM_VEHICLES: [
    EQUIPMENT_TYPES.BOX_TRUCK_16,
    EQUIPMENT_TYPES.BOX_TRUCK_20,
    EQUIPMENT_TYPES.BOX_TRUCK_24,
    EQUIPMENT_TYPES.BOX_TRUCK_26,
    EQUIPMENT_TYPES.STEP_VAN,
  ],
  SPECIALIZED: [EQUIPMENT_TYPES.HOT_SHOT, EQUIPMENT_TYPES.STRAIGHT_TRUCK],
  LARGE_VEHICLES: [
    EQUIPMENT_TYPES.DRY_VAN,
    EQUIPMENT_TYPES.REEFER,
    EQUIPMENT_TYPES.FLATBED,
  ],
} as const;

// Types for intelligent freight matching system
interface Driver {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  status: 'online' | 'offline' | 'on-load';
  equipmentType: string;
  preferences: {
    maxDistance: number; // miles
    minRatePerMile: number; // $
    autoAccept: boolean;
  };
  currentLoadId?: string;
  hoursRemaining: number;
}

interface Load {
  id: string;
  origin: { lat: number; lng: number; address: string };
  destination: { lat: number; lng: number; address: string };
  pickupTime: Date;
  deliveryTime: Date;
  weight: number; // lbs
  dimensions: { length: number; width: number; height: number }; // inches
  equipmentType: string;
  rate: number; // total $
  status:
    | 'pending'
    | 'offered'
    | 'accepted'
    | 'in-transit'
    | 'delivered'
    | 'declined';
  assignedDriverId?: string;
  offerExpiresAt?: Date;
  urgency: 'low' | 'medium' | 'high';
}

interface LoadRequest {
  origin: string;
  destination: string;
  equipmentType: string;
  weight: number;
  urgency: 'low' | 'medium' | 'high';
  pickupDate: string;
  deliveryDate: string;
  shipperId: string;
}

interface MatchResult {
  loadId: string;
  driverId: string;
  confidence: number; // 0-100%
  estimatedTime: number; // minutes to pickup
  dynamicPriceMultiplier: number;
}

class GoWithTheFlowService extends EventEmitter {
  private drivers: Driver[] = [];
  private loads: Load[] = [];
  private matchingQueue: { load: Load; potentialDrivers: Driver[] }[] = [];
  private activityFeed: string[] = [];

  constructor() {
    super();
    this.initializeMockData();
    // Simulate real-time matching every 10 seconds
    setInterval(() => this.processMatchingQueue(), 10000);
    // Simulate driver location updates
    setInterval(() => this.simulateDriverMovement(), 5000);
  }

  private initializeMockData() {
    this.drivers = [
      {
        id: 'driver-1',
        name: 'Alice Smith',
        location: { lat: 32.7767, lng: -96.797 }, // Dallas, TX
        status: 'online',
        equipmentType: 'Dry Van',
        preferences: {
          maxDistance: 300,
          minRatePerMile: 2.0,
          autoAccept: true,
        },
        hoursRemaining: 8.5,
      },
      {
        id: 'driver-2',
        name: 'Bob Johnson',
        location: { lat: 29.7604, lng: -95.3698 }, // Houston, TX
        status: 'online',
        equipmentType: 'Reefer',
        preferences: {
          maxDistance: 400,
          minRatePerMile: 2.5,
          autoAccept: false,
        },
        hoursRemaining: 6.0,
      },
      {
        id: 'driver-3',
        name: 'Charlie Brown',
        location: { lat: 30.2672, lng: -97.7431 }, // Austin, TX
        status: 'offline',
        equipmentType: 'Flatbed',
        preferences: {
          maxDistance: 200,
          minRatePerMile: 1.8,
          autoAccept: true,
        },
        hoursRemaining: 10.0,
      },
      // PHASE 1: Multi-Equipment Support - WARP-Style Vehicles
      {
        id: 'driver-4',
        name: 'Diana Martinez',
        location: { lat: 32.7767, lng: -96.797 }, // Dallas, TX
        status: 'online',
        equipmentType: 'Cargo Van',
        preferences: {
          maxDistance: 150,
          minRatePerMile: 1.5,
          autoAccept: true,
        },
        hoursRemaining: 10.0,
      },
      {
        id: 'driver-5',
        name: 'Erik Thompson',
        location: { lat: 29.7604, lng: -95.3698 }, // Houston, TX
        status: 'online',
        equipmentType: 'Sprinter Van',
        preferences: {
          maxDistance: 200,
          minRatePerMile: 1.8,
          autoAccept: false,
        },
        hoursRemaining: 9.0,
      },
      {
        id: 'driver-6',
        name: 'Frank Wilson',
        location: { lat: 30.2672, lng: -97.7431 }, // Austin, TX
        status: 'online',
        equipmentType: 'Box Truck (24ft)',
        preferences: {
          maxDistance: 250,
          minRatePerMile: 1.9,
          autoAccept: true,
        },
        hoursRemaining: 8.0,
      },
      {
        id: 'driver-7',
        name: 'Grace Chen',
        location: { lat: 32.7767, lng: -96.797 }, // Dallas, TX
        status: 'online',
        equipmentType: 'Straight Truck',
        preferences: {
          maxDistance: 300,
          minRatePerMile: 2.1,
          autoAccept: false,
        },
        hoursRemaining: 7.5,
      },
      {
        id: 'driver-8',
        name: 'Henry Rodriguez',
        location: { lat: 29.7604, lng: -95.3698 }, // Houston, TX
        status: 'online',
        equipmentType: 'Hot Shot',
        preferences: {
          maxDistance: 500,
          minRatePerMile: 2.8,
          autoAccept: true,
        },
        hoursRemaining: 11.0,
      },
      {
        id: 'driver-9',
        name: 'Isabel Garcia',
        location: { lat: 30.2672, lng: -97.7431 }, // Austin, TX
        status: 'online',
        equipmentType: 'Step Van',
        preferences: {
          maxDistance: 100,
          minRatePerMile: 1.6,
          autoAccept: true,
        },
        hoursRemaining: 9.5,
      },
    ];

    this.loads = [
      // Traditional Trucking Loads
      {
        id: 'GWF-LOAD-001',
        origin: { lat: 32.7767, lng: -96.797, address: 'Dallas, TX' },
        destination: { lat: 29.7604, lng: -95.3698, address: 'Houston, TX' },
        pickupTime: new Date(Date.now() + 2 * 3600 * 1000),
        deliveryTime: new Date(Date.now() + 8 * 3600 * 1000),
        weight: 20000,
        dimensions: { length: 40, width: 8, height: 8 },
        equipmentType: 'Dry Van',
        rate: 850,
        status: 'pending',
        urgency: 'medium',
      },
      {
        id: 'GWF-LOAD-002',
        origin: { lat: 30.2672, lng: -97.7431, address: 'Austin, TX' },
        destination: {
          lat: 29.4241,
          lng: -98.4936,
          address: 'San Antonio, TX',
        },
        pickupTime: new Date(Date.now() + 1.5 * 3600 * 1000),
        deliveryTime: new Date(Date.now() + 3 * 3600 * 1000),
        weight: 10000,
        dimensions: { length: 20, width: 8, height: 8 },
        equipmentType: 'Reefer',
        rate: 520,
        status: 'pending',
        urgency: 'high',
      },
      {
        id: 'GWF-LOAD-003',
        origin: { lat: 32.7767, lng: -96.797, address: 'Fort Worth, TX' },
        destination: { lat: 31.7619, lng: -106.485, address: 'El Paso, TX' },
        pickupTime: new Date(Date.now() + 3 * 3600 * 1000),
        deliveryTime: new Date(Date.now() + 8 * 3600 * 1000),
        weight: 25000,
        dimensions: { length: 48, width: 8.5, height: 9 },
        equipmentType: 'Flatbed',
        rate: 1200,
        status: 'pending',
        urgency: 'medium',
      },

      // PHASE 1: Multi-Equipment Loads (WARP-Style)
      {
        id: 'GWF-VAN-001',
        origin: {
          lat: 32.7767,
          lng: -96.797,
          address: 'Dallas, TX - Amazon Warehouse',
        },
        destination: {
          lat: 32.8998,
          lng: -97.0403,
          address: 'Denton, TX - Office Building',
        },
        pickupTime: new Date(Date.now() + 1 * 3600 * 1000),
        deliveryTime: new Date(Date.now() + 4 * 3600 * 1000),
        weight: 500,
        dimensions: { length: 8, width: 5, height: 5 },
        equipmentType: 'Cargo Van',
        rate: 120,
        status: 'pending',
        urgency: 'high',
      },
      {
        id: 'GWF-SPRINTER-001',
        origin: {
          lat: 29.7604,
          lng: -95.3698,
          address: 'Houston, TX - Medical Facility',
        },
        destination: {
          lat: 29.5844,
          lng: -95.7654,
          address: 'Sugar Land, TX - Hospital',
        },
        pickupTime: new Date(Date.now() + 0.5 * 3600 * 1000),
        deliveryTime: new Date(Date.now() + 2 * 3600 * 1000),
        weight: 800,
        dimensions: { length: 12, width: 6, height: 6 },
        equipmentType: 'Sprinter Van',
        rate: 180,
        status: 'pending',
        urgency: 'high',
      },
      {
        id: 'GWF-BOX-001',
        origin: {
          lat: 30.2672,
          lng: -97.7431,
          address: 'Austin, TX - Home Depot',
        },
        destination: {
          lat: 30.5085,
          lng: -97.8265,
          address: 'Round Rock, TX - Construction Site',
        },
        pickupTime: new Date(Date.now() + 2 * 3600 * 1000),
        deliveryTime: new Date(Date.now() + 5 * 3600 * 1000),
        weight: 5000,
        dimensions: { length: 20, width: 8, height: 8 },
        equipmentType: 'Box Truck (24ft)',
        rate: 320,
        status: 'pending',
        urgency: 'medium',
      },
      {
        id: 'GWF-HOTSHOT-001',
        origin: {
          lat: 32.7767,
          lng: -96.797,
          address: 'Dallas, TX - Manufacturing Plant',
        },
        destination: {
          lat: 35.2271,
          lng: -101.8313,
          address: 'Amarillo, TX - Oil Field',
        },
        pickupTime: new Date(Date.now() + 4 * 3600 * 1000),
        deliveryTime: new Date(Date.now() + 12 * 3600 * 1000),
        weight: 8000,
        dimensions: { length: 16, width: 6, height: 4 },
        equipmentType: 'Hot Shot',
        rate: 950,
        status: 'pending',
        urgency: 'medium',
      },
      {
        id: 'GWF-STEP-001',
        origin: {
          lat: 29.7604,
          lng: -95.3698,
          address: 'Houston, TX - Distribution Center',
        },
        destination: {
          lat: 29.6516,
          lng: -95.4543,
          address: 'Bellaire, TX - Retail Stores',
        },
        pickupTime: new Date(Date.now() + 1 * 3600 * 1000),
        deliveryTime: new Date(Date.now() + 6 * 3600 * 1000),
        weight: 2500,
        dimensions: { length: 14, width: 7, height: 7 },
        equipmentType: 'Step Van',
        rate: 280,
        status: 'pending',
        urgency: 'medium',
      },
    ];
    this.activityFeed.push(
      'Go With the Flow system initialized with multi-equipment support: Traditional trucking + cargo vans, sprinters, box trucks, and specialized vehicles.'
    );
  }

  // Utility to calculate distance (Haversine formula - simplified for demo)
  private calculateDistance(
    loc1: { lat: number; lng: number },
    loc2: { lat: number; lng: number }
  ): number {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (loc2.lat - loc1.lat) * (Math.PI / 180);
    const dLon = (loc2.lng - loc1.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(loc1.lat * (Math.PI / 180)) *
        Math.cos(loc2.lat * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 0.621371; // Convert km to miles
  }

  // --- Driver Actions ---
  goOnline(driverId: string): boolean {
    const driver = this.drivers.find((d) => d.id === driverId);
    if (driver) {
      driver.status = 'online';
      this.activityFeed.push(`${driver.name} went online.`);
      this.emit('driverStatusChange', driver);
      console.log(`${driver.name} is now online.`);
      return true;
    }
    return false;
  }

  goOffline(driverId: string): boolean {
    const driver = this.drivers.find((d) => d.id === driverId);
    if (driver) {
      driver.status = 'offline';
      this.activityFeed.push(`${driver.name} went offline.`);
      this.emit('driverStatusChange', driver);
      console.log(`${driver.name} is now offline.`);
      return true;
    }
    return false;
  }

  acceptLoad(driverId: string, loadId: string): boolean {
    const driver = this.drivers.find((d) => d.id === driverId);
    const load = this.loads.find((l) => l.id === loadId);

    if (
      driver &&
      load &&
      load.status === 'offered' &&
      load.assignedDriverId === driverId
    ) {
      load.status = 'accepted';
      load.assignedDriverId = driverId;
      driver.status = 'on-load';
      driver.currentLoadId = loadId;
      this.activityFeed.push(`${driver.name} accepted load ${load.id}.`);
      this.emit('loadAccepted', { driver, load });
      console.log(`${driver.name} accepted load ${load.id}`);

      // Remove load from matching queue
      this.matchingQueue = this.matchingQueue.filter(
        (q) => q.load.id !== loadId
      );
      return true;
    }
    return false;
  }

  declineLoad(driverId: string, loadId: string): boolean {
    const driver = this.drivers.find((d) => d.id === driverId);
    const load = this.loads.find((l) => l.id === loadId);

    if (
      driver &&
      load &&
      load.status === 'offered' &&
      load.assignedDriverId === driverId
    ) {
      load.status = 'pending'; // Make it available for other drivers
      load.assignedDriverId = undefined;
      load.offerExpiresAt = undefined;
      this.activityFeed.push(`${driver.name} declined load ${load.id}.`);
      this.emit('loadDeclined', { driver, load });
      console.log(`${driver.name} declined load ${load.id}`);

      // Re-queue the load for matching
      this.queueLoadForMatching(load);
      return true;
    }
    return false;
  }

  // --- Data Retrieval for UI ---
  getAvailableLoadsForDriver(driverId: string): Load[] {
    // Return loads that are offered to this specific driver
    return this.loads.filter(
      (load) =>
        load.status === 'offered' &&
        load.assignedDriverId === driverId &&
        load.offerExpiresAt &&
        load.offerExpiresAt > new Date()
    );
  }

  getAvailableDrivers(): Driver[] {
    return this.drivers.filter((d) => d.status === 'online');
  }

  getLiveLoads(): Load[] {
    return this.loads.filter(
      (l) => l.status === 'pending' || l.status === 'offered'
    );
  }

  getMatchingQueue(): { load: Load; potentialDrivers: Driver[] }[] {
    return this.matchingQueue;
  }

  getSystemMetrics(): {
    totalDrivers: number;
    onlineDrivers: number;
    activeLoads: number;
    matchesToday: number;
    avgResponseTime: string;
    matchingSuccessRate: string;
  } {
    return {
      totalDrivers: this.drivers.length,
      onlineDrivers: this.drivers.filter((d) => d.status === 'online').length,
      activeLoads: this.loads.filter(
        (l) =>
          l.status === 'pending' ||
          l.status === 'offered' ||
          l.status === 'in-transit'
      ).length,
      matchesToday: 25, // Example
      avgResponseTime: '45 sec', // Example
      matchingSuccessRate: '92%', // Example
    };
  }

  // PHASE 1: Equipment Type Analytics
  getEquipmentBreakdown(): {
    equipmentCounts: Record<string, number>;
    totalEquipmentTypes: number;
    onlineByEquipment: Record<string, number>;
    availableCapacity: {
      small: number; // Cargo vans, sprinters
      medium: number; // Box trucks, step vans
      large: number; // Traditional trucking
      specialized: number; // Hot shots, straight trucks
    };
  } {
    const equipmentCounts: Record<string, number> = {};
    const onlineByEquipment: Record<string, number> = {};

    this.drivers.forEach((driver) => {
      equipmentCounts[driver.equipmentType] =
        (equipmentCounts[driver.equipmentType] || 0) + 1;
      if (driver.status === 'online') {
        onlineByEquipment[driver.equipmentType] =
          (onlineByEquipment[driver.equipmentType] || 0) + 1;
      }
    });

    const onlineDrivers = this.drivers.filter((d) => d.status === 'online');
    const availableCapacity = {
      small: onlineDrivers.filter((d) =>
        EQUIPMENT_CATEGORIES.SMALL_VEHICLES.includes(d.equipmentType as any)
      ).length,
      medium: onlineDrivers.filter((d) =>
        EQUIPMENT_CATEGORIES.MEDIUM_VEHICLES.includes(d.equipmentType as any)
      ).length,
      large: onlineDrivers.filter((d) =>
        EQUIPMENT_CATEGORIES.LARGE_VEHICLES.includes(d.equipmentType as any)
      ).length,
      specialized: onlineDrivers.filter((d) =>
        EQUIPMENT_CATEGORIES.SPECIALIZED.includes(d.equipmentType as any)
      ).length,
    };

    return {
      equipmentCounts,
      totalEquipmentTypes: Object.keys(equipmentCounts).length,
      onlineByEquipment,
      availableCapacity,
    };
  }

  getRecentActivity(): string[] {
    return [...this.activityFeed].reverse().slice(0, 10); // Last 10 activities
  }

  // --- Shipper Actions ---
  requestTruck(loadRequest: LoadRequest): Load {
    const newLoad: Load = {
      id: `GWF-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      origin: { lat: 34.0522, lng: -118.2437, address: loadRequest.origin }, // Mock coords
      destination: {
        lat: 36.1699,
        lng: -115.1398,
        address: loadRequest.destination,
      }, // Mock coords
      pickupTime: new Date(loadRequest.pickupDate),
      deliveryTime: new Date(loadRequest.deliveryDate),
      weight: loadRequest.weight,
      dimensions: { length: 48, width: 8.5, height: 9 }, // Default dimensions
      equipmentType: loadRequest.equipmentType,
      rate: 0, // Will be dynamically priced
      status: 'pending',
      urgency: loadRequest.urgency,
    };
    newLoad.rate = this.calculateDynamicPrice(
      500,
      this.calculateDistance(newLoad.origin, newLoad.destination),
      newLoad.urgency
    );
    this.loads.push(newLoad);
    this.activityFeed.push(
      `New load request received: ${newLoad.id} from ${loadRequest.shipperId}.`
    );
    this.emit('newLoadRequest', newLoad);
    console.log(`New load request: ${newLoad.id}`);

    this.queueLoadForMatching(newLoad);
    return newLoad;
  }

  // --- Matching Logic ---
  private queueLoadForMatching(load: Load) {
    if (!this.matchingQueue.some((q) => q.load.id === load.id)) {
      this.matchingQueue.push({ load, potentialDrivers: [] });
      this.activityFeed.push(`Load ${load.id} queued for matching.`);
      this.emit('loadQueued', load);
    }
  }

  private processMatchingQueue() {
    if (this.matchingQueue.length === 0) return;

    const loadToMatch = this.matchingQueue.shift(); // Take the first load
    if (!loadToMatch) return;

    const { load } = loadToMatch;
    console.log(`Attempting to match load: ${load.id}`);

    const availableDrivers = this.drivers.filter(
      (d) => d.status === 'online' && d.equipmentType === load.equipmentType
    );

    if (availableDrivers.length === 0) {
      console.log(`No available drivers for load ${load.id}. Re-queueing.`);
      this.queueLoadForMatching(load); // Re-queue if no drivers
      return;
    }

    // Simple matching: find the closest driver that meets preferences
    let bestMatch: {
      driver: Driver;
      distance: number;
      confidence: number;
    } | null = null;

    for (const driver of availableDrivers) {
      const distance = this.calculateDistance(driver.location, load.origin);
      const ratePerMile =
        load.rate / this.calculateDistance(load.origin, load.destination);

      // Check driver preferences
      if (
        distance <= driver.preferences.maxDistance &&
        ratePerMile >= driver.preferences.minRatePerMile
      ) {
        const confidence = Math.min(
          100,
          100 - (distance / driver.preferences.maxDistance) * 50
        ); // Simple confidence
        if (!bestMatch || confidence > bestMatch.confidence) {
          bestMatch = { driver, distance, confidence };
        }
      }
    }

    if (bestMatch) {
      const { driver, confidence } = bestMatch;
      load.status = 'offered';
      load.assignedDriverId = driver.id;
      load.offerExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes to accept
      driver.status = 'on-load'; // Temporarily mark as on-load to prevent other offers
      driver.currentLoadId = load.id;

      this.activityFeed.push(`Load ${load.id} offered to ${driver.name}.`);
      this.emit('loadOffered', { load, driver, confidence });
      this.sendPushNotification(
        driver.id,
        `New load offer: ${load.origin.address} to ${load.destination.address} for $${load.rate}!`,
        load.id
      );
      console.log(`Load ${load.id} offered to ${driver.name}. Expires in 30s.`);

      // Set a timeout for offer expiration
      setTimeout(
        () => {
          if (
            load.status === 'offered' &&
            load.assignedDriverId === driver.id
          ) {
            console.log(`Load ${load.id} offer to ${driver.name} expired.`);
            load.status = 'pending';
            load.assignedDriverId = undefined;
            load.offerExpiresAt = undefined;
            driver.status = 'online'; // Driver is available again
            driver.currentLoadId = undefined;
            this.activityFeed.push(
              `Load ${load.id} offer to ${driver.name} expired.`
            );
            this.emit('loadOfferExpired', load);
            this.queueLoadForMatching(load); // Re-queue for other drivers
          }
        },
        5 * 60 * 1000
      ); // 5 minutes
    } else {
      console.log(`No suitable driver found for load ${load.id}. Re-queueing.`);
      this.queueLoadForMatching(load); // Re-queue if no suitable drivers
    }
  }

  // --- Market-Based Pricing ---
  calculateDynamicPrice(
    basePrice: number,
    distance: number,
    urgency: 'low' | 'medium' | 'high'
  ): number {
    let multiplier = 1.0;
    const supplyDemandFactor =
      (this.drivers.filter((d) => d.status === 'online').length + 1) /
      (this.loads.filter((l) => l.status === 'pending').length + 1);

    if (supplyDemandFactor < 0.5) {
      // High demand, low supply
      multiplier *= 1.5; // 50% demand adjustment
    } else if (supplyDemandFactor < 0.2) {
      multiplier *= 2.0; // 100% demand adjustment
    } else if (supplyDemandFactor < 0.1) {
      multiplier *= 3.0; // 200% demand adjustment
    }

    if (urgency === 'medium') {
      multiplier *= 1.1;
    } else if (urgency === 'high') {
      multiplier *= 1.25;
    }

    // Ensure minimum rate per mile
    const minRatePerMile = 1.5; // Example minimum
    const calculatedRatePerMile = (basePrice / distance) * multiplier;
    if (calculatedRatePerMile < minRatePerMile) {
      return minRatePerMile * distance;
    }

    return parseFloat((basePrice * multiplier).toFixed(2));
  }

  // --- Notifications ---
  sendPushNotification(driverId: string, message: string, loadId?: string) {
    console.log(`PUSH NOTIFICATION to ${driverId}: ${message}`);
    // In a real app, this would integrate with a push notification service (e.g., Firebase Cloud Messaging)
  }

  // --- Mock Simulation ---
  private simulateDriverMovement() {
    this.drivers.forEach((driver) => {
      if (driver.status === 'online' || driver.status === 'on-load') {
        // Simulate slight random movement
        driver.location.lat += (Math.random() - 0.5) * 0.01;
        driver.location.lng += (Math.random() - 0.5) * 0.01;
        this.emit('driverLocationUpdate', driver);
      }
    });
  }

  updateDriverLocation(
    driverId: string,
    location: { lat: number; lng: number }
  ): boolean {
    const driver = this.drivers.find((d) => d.id === driverId);
    if (driver) {
      driver.location = location;
      this.emit('driverLocationUpdate', driver);
      return true;
    }
    return false;
  }

  getDriverEarnings(driverId: string): {
    totalEarnings: number;
    tripHistory: any[];
  } {
    // Mock implementation
    return {
      totalEarnings: 15000,
      tripHistory: [
        {
          id: 'trip-1',
          loadId: 'load-x',
          date: '2024-07-20',
          amount: 500,
          status: 'completed',
        },
        {
          id: 'trip-2',
          loadId: 'load-y',
          date: '2024-07-18',
          amount: 350,
          status: 'completed',
        },
      ],
    };
  }

  rateParty(
    raterId: string,
    ratedId: string,
    rating: number,
    comment: string
  ): boolean {
    console.log(
      `Rating from ${raterId} to ${ratedId}: ${rating} stars - "${comment}"`
    );
    this.activityFeed.push(`${raterId} rated ${ratedId} ${rating} stars.`);
    return true;
  }
}

export const goWithTheFlowService = new GoWithTheFlowService();
