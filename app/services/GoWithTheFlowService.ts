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
import { SchedulingService } from '../scheduling/service';

// Equipment Types - Multi-Modal Support
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
  loadType?: 'standard' | 'marketplace'; // For dispatch fee calculation
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
  private schedulingService: SchedulingService;

  // MARKETPLACE INTEGRATION: Intelligent Bidding System
  private externalLoads: Load[] = []; // Loads from external sources (DAT, Truckstop, etc.)
  private activeBids: Map<string, any> = new Map();
  private biddingStrategy = {
    aggressiveness: 'moderate' as 'conservative' | 'moderate' | 'aggressive',
    profitMarginTarget: 15, // 15% profit margin
    maxBidAmount: 5000,
    autoSubmitThreshold: 85, // 85% confidence to auto-submit
    equipmentPreferences: [
      'Cargo Van',
      'Sprinter Van',
      'Box Truck (24ft)',
      'Hot Shot',
    ],
    geographicFocus: {
      preferredStates: ['TX', 'OK', 'LA', 'AR', 'NM'],
      maxDistance: 250,
    },
  };

  constructor() {
    super();
    this.schedulingService = new SchedulingService();
    this.initializeMockData();
    this.initializeMarketplaceLoads(); // Marketplace integration

    // Simulate real-time matching every 10 seconds
    setInterval(() => this.processMatchingQueue(), 10000);
    // Simulate driver location updates
    setInterval(() => this.simulateDriverMovement(), 5000);

    // MARKETPLACE: Process external load opportunities every 30 seconds
    setInterval(() => this.processExternalLoadOpportunities(), 30000);
    // MARKETPLACE: Scrape new external loads every 2 minutes
    setInterval(() => this.scrapeExternalLoads(), 120000);
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
      // PHASE 1: Multi-Equipment Support - Right-Sized Vehicles
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

      // PHASE 1: Multi-Equipment Loads (Right-Sized)
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

  // MARKETPLACE INTEGRATION: Initialize External Load Sources
  private initializeMarketplaceLoads() {
    // Initialize empty external loads array - will be populated by real marketplace integrations
    this.externalLoads = [];
    // TODO: Implement real marketplace integrations (DAT, Truckstop, etc.)
  }

  // MARKETPLACE: Process External Load Opportunities with Intelligent Bidding
  private async processExternalLoadOpportunities() {
    const availableDrivers = this.getAvailableDrivers();
    const activeExternalLoads = this.externalLoads.filter(
      (load) => load.status === 'pending'
    );

    console.info(
      `🤖 Marketplace Integration: Evaluating ${activeExternalLoads.length} external load opportunities...`
    );

    for (const load of activeExternalLoads) {
      const evaluation = await this.evaluateExternalLoad(
        load,
        availableDrivers
      );

      if (evaluation.shouldBid) {
        this.activeBids.set(load.id, evaluation);
        this.emit('externalBidRecommendation', evaluation);

        // Auto-submit if confidence is high enough
        if (evaluation.confidence >= this.biddingStrategy.autoSubmitThreshold) {
          await this.submitExternalBid(evaluation);
        }

        this.activityFeed.push(
          `Marketplace Opportunity: ${load.id} evaluated - ${evaluation.shouldBid ? 'BID RECOMMENDED' : 'PASSED'} (${evaluation.confidence}% confidence)`
        );
      }
    }
  }

  // MARKETPLACE: Evaluate External Load for Bidding
  private async evaluateExternalLoad(
    load: Load,
    availableDrivers: Driver[]
  ): Promise<any> {
    const matchedDrivers = availableDrivers.filter(
      (driver) =>
        driver.equipmentType === load.equipmentType &&
        driver.status === 'online'
    );

    let shouldBid = false;
    let confidence = 0;
    let recommendedBid = 0;
    const riskFactors: string[] = [];
    let reasoning = '';

    // 1. Equipment Availability Check
    if (matchedDrivers.length === 0) {
      return {
        loadId: load.id,
        shouldBid: false,
        confidence: 0,
        recommendedBid: 0,
        matchedDrivers: [],
        reasoning: 'No available drivers with required equipment',
        riskFactors: ['No equipment match'],
        profitMargin: 0,
      };
    }

    confidence += 25; // Base confidence for having equipment

    // 2. Geographic Analysis
    const bestDriver = matchedDrivers[0];
    const distanceToPickup = this.calculateDistance(
      bestDriver.location,
      load.origin
    );

    if (distanceToPickup <= this.biddingStrategy.geographicFocus.maxDistance) {
      confidence += 20;
      reasoning += `Excellent geographic match (${distanceToPickup.toFixed(0)} miles). `;
    } else {
      confidence -= 10;
      riskFactors.push(`Long deadhead (${distanceToPickup.toFixed(0)} miles)`);
    }

    // 3. Rate Analysis & Profit Calculation
    const estimatedCosts = this.calculateOperatingCosts(load, distanceToPickup);
    const targetRate =
      estimatedCosts * (1 + this.biddingStrategy.profitMarginTarget / 100);

    if (load.rate >= targetRate) {
      confidence += 25;
      shouldBid = true;
      recommendedBid = Math.min(targetRate * 1.05, load.rate);
      reasoning += `Profitable opportunity (${(((load.rate - estimatedCosts) / estimatedCosts) * 100).toFixed(1)}% margin). `;
    } else {
      confidence -= 15;
      riskFactors.push('Insufficient rate for profitable operation');
    }

    // 4. Urgency & Priority Scoring
    if (load.urgency === 'high') {
      confidence += 15;
      reasoning += 'High priority load - premium opportunity. ';
    }

    // 5. Cross-Docking & Consolidation Opportunities
    if (
      load.origin.address.includes('Cross-Dock') ||
      load.origin.address.includes('Distribution')
    ) {
      confidence += 10;
      reasoning += 'Cross-docking consolidation opportunity. ';
    }

    // Final decision logic
    shouldBid = confidence >= 60 && recommendedBid > 0;

    const profitMargin =
      recommendedBid > 0
        ? ((recommendedBid - estimatedCosts) / estimatedCosts) * 100
        : 0;

    return {
      loadId: load.id,
      shouldBid,
      confidence: Math.max(0, Math.min(100, confidence)),
      recommendedBid,
      matchedDrivers: matchedDrivers.map((driver) => ({
        driverId: driver.id,
        driverName: driver.name,
        equipmentType: driver.equipmentType,
        distance: this.calculateDistance(driver.location, load.origin),
        availability: 'available',
        hoursRemaining: driver.hoursRemaining,
      })),
      reasoning: reasoning.trim(),
      riskFactors,
      profitMargin,
      competitiveAdvantage: shouldBid
        ? 'Intelligent cross-docking with AI optimization'
        : undefined,
    };
  }

  // MARKETPLACE: Calculate Operating Costs
  private calculateOperatingCosts(load: Load, deadheadMiles: number): number {
    const totalMiles =
      this.calculateDistance(load.origin, load.destination) + deadheadMiles;
    const fuelCost = (totalMiles / 25) * 4.2; // 25 mpg, $4.20/gallon diesel
    const driverPay = (totalMiles / 50) * 25; // $25/hour at 50mph average
    const vehicleCosts = totalMiles * 0.35; // $0.35/mile for wear, insurance, etc.
    const overhead = (fuelCost + driverPay + vehicleCosts) * 0.15; // 15% overhead

    return fuelCost + driverPay + vehicleCosts + overhead;
  }

  // MARKETPLACE: Submit External Bid
  private async submitExternalBid(evaluation: any): Promise<boolean> {
    try {
      console.info(
        `📤 Marketplace Integration: Auto-submitting bid for ${evaluation.loadId} at $${evaluation.recommendedBid}`
      );

      this.emit('externalBidSubmitted', {
        loadId: evaluation.loadId,
        bidAmount: evaluation.recommendedBid,
        confidence: evaluation.confidence,
        submittedAt: new Date(),
        status: 'submitted',
        source: 'marketplace-network',
        loadType: 'marketplace', // Use 5% dispatch fee
      });

      // Simulate bid acceptance/rejection after a delay
      setTimeout(
        () => {
          const isAccepted = Math.random() > 0.25; // 75% acceptance rate for marketplace loads
          this.emit('externalBidResult', {
            loadId: evaluation.loadId,
            result: isAccepted ? 'accepted' : 'rejected',
            finalRate: isAccepted ? evaluation.recommendedBid : null,
            source: 'marketplace-network',
          });

          if (isAccepted) {
            // Move external load to our internal system
            const externalLoad = this.externalLoads.find(
              (load) => load.id === evaluation.loadId
            );
            if (externalLoad) {
              externalLoad.status = 'accepted';
              externalLoad.loadType = 'marketplace'; // Set for 5% dispatch fee
              this.loads.push(externalLoad); // Add to our system
              this.activityFeed.push(
                `✅ Marketplace load ${evaluation.loadId} WON and integrated into Go With the Flow system!`
              );
            }
          }
        },
        Math.random() * 60000 + 30000
      ); // 30-90 seconds

      return true;
    } catch (error) {
      console.error(
        `❌ Failed to submit marketplace bid for ${evaluation.loadId}:`,
        error
      );
      return false;
    }
  }

  // MARKETPLACE: Scrape New External Loads (simulates web scraping)
  private async scrapeExternalLoads() {
    try {
      console.info(
        '🕷️ Marketplace Integration: Scraping new external load opportunities...'
      );

      // Simulate new load from external sources
      const newLoad: Load = {
        id: `MKT-${Date.now()}`,
        origin: {
          lat: 32.7767 + (Math.random() - 0.5) * 0.5,
          lng: -96.797 + (Math.random() - 0.5) * 0.5,
          address: 'Dynamic Cross-Dock Location, TX',
        },
        destination: {
          lat: 29.7604 + (Math.random() - 0.5) * 0.5,
          lng: -95.3698 + (Math.random() - 0.5) * 0.5,
          address: 'Dynamic Distribution Hub, TX',
        },
        pickupTime: new Date(Date.now() + Math.random() * 24 * 3600 * 1000),
        deliveryTime: new Date(
          Date.now() + (Math.random() * 24 + 24) * 3600 * 1000
        ),
        weight: Math.floor(Math.random() * 3000) + 500,
        dimensions: { length: 12, width: 6, height: 6 },
        equipmentType:
          this.biddingStrategy.equipmentPreferences[
            Math.floor(
              Math.random() * this.biddingStrategy.equipmentPreferences.length
            )
          ],
        rate: Math.floor(Math.random() * 400) + 200,
        status: 'pending',
        urgency: ['medium', 'high'][Math.floor(Math.random() * 2)] as any,
      };

      this.externalLoads.push(newLoad);
      this.emit('newExternalLoadScraped', newLoad);

      this.activityFeed.push(
        `🆕 New marketplace opportunity scraped: ${newLoad.id} (${newLoad.equipmentType})`
      );
    } catch (error) {
      console.error('❌ Marketplace load scraping failed:', error);
    }
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
      console.info(`${driver.name} is now online.`);
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
      console.info(`${driver.name} is now offline.`);
      return true;
    }
    return false;
  }

  async acceptLoad(driverId: string, loadId: string): Promise<boolean> {
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
      console.info(`${driver.name} accepted load ${load.id}`);

      // 🗓️ SCHEDULE INTEGRATION: Create schedule entry for accepted load
      try {
        const scheduleResult = await this.schedulingService.createSchedule({
          title: `Load ${load.id} - ${load.origin.address} → ${load.destination.address}`,
          scheduleType: 'Delivery',
          assignedDriverId: driverId,
          driverName: driver.name,
          assignedVehicleId: `vehicle-${driverId}`, // Assuming driver has associated vehicle
          origin: load.origin.address,
          destination: load.destination.address,
          startDate: load.pickupTime.toISOString().split('T')[0],
          endDate: load.deliveryTime.toISOString().split('T')[0],
          startTime: load.pickupTime.toTimeString().slice(0, 5),
          endTime: load.deliveryTime.toTimeString().slice(0, 5),
          priority:
            load.urgency === 'high'
              ? 'High'
              : load.urgency === 'medium'
                ? 'Medium'
                : 'Low',
          status: 'Scheduled',
          description: `Equipment: ${load.equipmentType} | Weight: ${load.weight} lbs | Rate: $${load.rate}\nAccepted via Go With the Flow - Real-time matching system\nPickup: ${load.origin.address}\nDelivery: ${load.destination.address}\nRate: $${load.rate}`,
        });

        if (scheduleResult.success) {
          console.info(
            `✅ Load ${load.id} added to driver ${driver.name}'s schedule`
          );
          this.activityFeed.push(
            `📅 Load ${load.id} added to ${driver.name}'s schedule`
          );
          this.emit('scheduleCreated', {
            driver,
            load,
            schedule: scheduleResult.schedule,
          });
        } else {
          console.warn(
            `⚠️ Failed to add load ${load.id} to schedule:`,
            scheduleResult.conflicts
          );
          this.activityFeed.push(
            `⚠️ Load ${load.id} accepted but schedule conflict detected`
          );
        }
      } catch (error) {
        console.error(`❌ Error creating schedule for load ${load.id}:`, error);
        this.activityFeed.push(
          `❌ Load ${load.id} accepted but failed to create schedule entry`
        );
      }

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
      console.info(`${driver.name} declined load ${load.id}`);

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
    console.info(`New load request: ${newLoad.id}`);

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
    console.info(`Attempting to match load: ${load.id}`);

    const availableDrivers = this.drivers.filter(
      (d) => d.status === 'online' && d.equipmentType === load.equipmentType
    );

    if (availableDrivers.length === 0) {
      console.info(`No available drivers for load ${load.id}. Re-queueing.`);
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
      console.info(
        `Load ${load.id} offered to ${driver.name}. Expires in 30s.`
      );

      // Set a timeout for offer expiration
      setTimeout(
        () => {
          if (
            load.status === 'offered' &&
            load.assignedDriverId === driver.id
          ) {
            console.info(`Load ${load.id} offer to ${driver.name} expired.`);
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
      console.info(
        `No suitable driver found for load ${load.id}. Re-queueing.`
      );
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
    console.info(`PUSH NOTIFICATION to ${driverId}: ${message}`);
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
    console.info(
      `Rating from ${raterId} to ${ratedId}: ${rating} stars - "${comment}"`
    );
    this.activityFeed.push(`${raterId} rated ${ratedId} ${rating} stars.`);
    return true;
  }

  // === MARKETPLACE PUBLIC API METHODS ===

  // Get all external load opportunities
  getExternalLoadOpportunities(): Load[] {
    return this.externalLoads.filter((load) => load.status === 'pending');
  }

  // Get active external bids
  getActiveExternalBids(): any[] {
    return Array.from(this.activeBids.values());
  }

  // Get marketplace bidding strategy
  getBiddingStrategy() {
    return { ...this.biddingStrategy };
  }

  // Update bidding strategy
  updateBiddingStrategy(newStrategy: Partial<typeof this.biddingStrategy>) {
    this.biddingStrategy = { ...this.biddingStrategy, ...newStrategy };
    this.emit('biddingStrategyUpdated', this.biddingStrategy);
    this.activityFeed.push('Marketplace bidding strategy updated.');
  }

  // Manual bid submission for external loads
  async submitManualBid(loadId: string, bidAmount: number): Promise<boolean> {
    const externalLoad = this.externalLoads.find((load) => load.id === loadId);
    if (!externalLoad) {
      console.error(`❌ External load ${loadId} not found`);
      return false;
    }

    const availableDrivers = this.getAvailableDrivers();
    const evaluation = await this.evaluateExternalLoad(
      externalLoad,
      availableDrivers
    );
    evaluation.recommendedBid = bidAmount;

    return await this.submitExternalBid(evaluation);
  }

  // Get marketplace performance metrics
  getMarketplaceMetrics(): {
    totalExternalLoadsEvaluated: number;
    externalBidsSubmitted: number;
    bidAcceptanceRate: number;
    averageProfitMargin: number;
    crossDockingOpportunities: number;
    rightSizedAssetUtilization: number;
  } {
    const crossDockLoads = this.externalLoads.filter(
      (load) =>
        load.origin.address.includes('Cross-Dock') ||
        load.destination.address.includes('Cross-Dock')
    ).length;

    const rightSizedAssets = this.drivers.filter(
      (driver) =>
        ['Cargo Van', 'Sprinter Van', 'Box Truck (24ft)', 'Hot Shot'].includes(
          driver.equipmentType
        ) && driver.status === 'online'
    ).length;

    return {
      totalExternalLoadsEvaluated: this.externalLoads.length,
      externalBidsSubmitted: this.activeBids.size,
      bidAcceptanceRate: 0, // TODO: Calculate real acceptance rate from historical data
      averageProfitMargin: 0, // TODO: Calculate real profit margin from completed loads
      crossDockingOpportunities: crossDockLoads,
      rightSizedAssetUtilization: rightSizedAssets,
    };
  }

  // Get consolidated activity feed with marketplace integration
  getMarketplaceIntegratedActivity(): string[] {
    return [...this.activityFeed]
      .reverse()
      .slice(0, 20) // Last 20 activities including marketplace events
      .map((activity) => {
        if (
          activity.includes('Marketplace') ||
          activity.includes('marketplace')
        ) {
          return `🎯 ${activity}`;
        }
        return activity;
      });
  }

  // Force evaluation of all external loads (for testing/demo)
  async forceExternalLoadEvaluation(): Promise<void> {
    console.info('🔄 Force evaluating all marketplace external loads...');
    await this.processExternalLoadOpportunities();
  }

  // Get equipment utilization breakdown (marketplace analytics)
  getEquipmentUtilizationBreakdown(): {
    traditional: { online: number; total: number; utilization: string };
    rightSized: { online: number; total: number; utilization: string };
    specialized: { online: number; total: number; utilization: string };
    crossDocking: { activeOpportunities: number; totalProcessed: number };
  } {
    const traditional = this.drivers.filter((d) =>
      ['Dry Van', 'Reefer', 'Flatbed'].includes(d.equipmentType)
    );
    const rightSized = this.drivers.filter((d) =>
      [
        'Cargo Van',
        'Sprinter Van',
        'Box Truck (16ft)',
        'Box Truck (20ft)',
        'Box Truck (24ft)',
        'Box Truck (26ft)',
        'Step Van',
      ].includes(d.equipmentType)
    );
    const specialized = this.drivers.filter((d) =>
      ['Hot Shot', 'Straight Truck'].includes(d.equipmentType)
    );

    const crossDockLoads = this.externalLoads.filter(
      (load) =>
        load.origin.address.includes('Cross-Dock') ||
        load.destination.address.includes('Cross-Dock') ||
        load.origin.address.includes('Distribution') ||
        load.destination.address.includes('Distribution')
    );

    return {
      traditional: {
        online: traditional.filter((d) => d.status === 'online').length,
        total: traditional.length,
        utilization: `${Math.round((traditional.filter((d) => d.status !== 'offline').length / traditional.length) * 100)}%`,
      },
      rightSized: {
        online: rightSized.filter((d) => d.status === 'online').length,
        total: rightSized.length,
        utilization: `${Math.round((rightSized.filter((d) => d.status !== 'offline').length / rightSized.length) * 100)}%`,
      },
      specialized: {
        online: specialized.filter((d) => d.status === 'online').length,
        total: specialized.length,
        utilization: `${Math.round((specialized.filter((d) => d.status !== 'offline').length / specialized.length) * 100)}%`,
      },
      crossDocking: {
        activeOpportunities: crossDockLoads.filter(
          (load) => load.status === 'pending'
        ).length,
        totalProcessed: crossDockLoads.length,
      },
    };
  }

  // === CORE DATA ACCESS METHODS FOR DISPATCH CENTRAL ===

  // Get all loads (including won marketplace loads)
  getAllLoads(): Load[] {
    return [...this.loads];
  }

  // Get all drivers
  getAllDrivers(): Driver[] {
    return [...this.drivers];
  }

  // Get activity feed
  getActivityFeed(): string[] {
    return [...this.activityFeed].reverse().slice(0, 30);
  }

  // Get won marketplace loads (for dispatch tracking)
  getWonMarketplaceLoads(): Load[] {
    return this.loads.filter(
      (load) =>
        load.loadType === 'marketplace' &&
        (load.status === 'accepted' ||
          load.status === 'in-transit' ||
          load.status === 'offered')
    );
  }

  // Get marketplace revenue
  getMarketplaceRevenue(): number {
    const wonMarketplaceLoads = this.getWonMarketplaceLoads();
    return wonMarketplaceLoads.reduce((total, load) => total + load.rate, 0);
  }

  // Get active drivers (for dispatcher operations)
  getActiveDrivers(): Driver[] {
    return this.drivers.filter((driver) => driver.status !== 'offline');
  }

  // Get load statistics for dispatch dashboard
  getLoadStats(): {
    totalLoads: number;
    activeLoads: number;
    completedLoads: number;
    marketplaceLoads: number;
    standardLoads: number;
    pendingLoads: number;
  } {
    const marketplaceLoads = this.loads.filter(
      (load) => load.loadType === 'marketplace'
    );
    const standardLoads = this.loads.filter(
      (load) => load.loadType !== 'marketplace'
    );

    return {
      totalLoads: this.loads.length,
      activeLoads: this.loads.filter((load) =>
        ['accepted', 'in-transit', 'offered'].includes(load.status)
      ).length,
      completedLoads: this.loads.filter((load) => load.status === 'delivered')
        .length,
      marketplaceLoads: marketplaceLoads.length,
      standardLoads: standardLoads.length,
      pendingLoads: this.loads.filter((load) => load.status === 'pending')
        .length,
    };
  }

  // Get driver response rate for marketplace
  getDriverResponseRate(): number {
    const activeBids = this.getActiveExternalBids();
    if (activeBids.length === 0) return 0;

    const respondedBids = activeBids.filter(
      (bid) => bid.status !== 'pending'
    ).length;
    return Math.round((respondedBids / activeBids.length) * 100);
  }
}

export const goWithTheFlowService = new GoWithTheFlowService();
