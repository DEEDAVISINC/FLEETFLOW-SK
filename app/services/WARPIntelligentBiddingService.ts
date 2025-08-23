// 🎯 WARP INTELLIGENT BIDDING SERVICE
//
// This service automatically bids on WARP loads based on:
// - Real driver/carrier availability in Go With The Flow network
// - Equipment matching and capacity optimization
// - Geographic coverage analysis
// - AI-powered bid pricing optimization
// - HOS compliance and scheduling integration

import { EventEmitter } from 'events';
import { goWithTheFlowService } from './GoWithTheFlowService';

// WARP Load Structure (from web scraping)
export interface WARPLoad {
  id: string;
  origin: {
    city: string;
    state: string;
    zipCode: string;
    coordinates?: { lat: number; lng: number };
  };
  destination: {
    city: string;
    state: string;
    zipCode: string;
    coordinates?: { lat: number; lng: number };
  };
  pickupDate: string;
  deliveryDate?: string;
  equipmentType: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  commodity: string;
  rateRange?: {
    min: number;
    max: number;
  };
  suggestedRate?: number;
  distance: number;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  specialRequirements?: string[];
  carrierRequirements?: {
    minimumRating?: number;
    insuranceMinimum?: number;
    mcNumber?: boolean;
  };
  postedAt: Date;
  expiresAt: Date;
  contactInfo?: {
    companyName: string;
    contactName?: string;
    phone?: string;
    email?: string;
  };
}

// Bid Evaluation Result
export interface BidEvaluation {
  loadId: string;
  shouldBid: boolean;
  confidence: number; // 0-100%
  recommendedBid: number;
  matchedDrivers: {
    driverId: string;
    driverName: string;
    equipmentType: string;
    distance: number;
    availability: 'available' | 'available-soon' | 'on-schedule';
    hoursRemaining: number;
  }[];
  reasoning: string;
  riskFactors: string[];
  profitMargin: number;
  competitiveAdvantage?: string;
}

// Bidding Strategy Configuration
export interface BiddingStrategy {
  aggressiveness: 'conservative' | 'moderate' | 'aggressive';
  profitMarginTarget: number; // percentage
  maxBidAmount: number;
  equipmentPreferences: string[];
  geographicFocus: {
    preferredStates: string[];
    maxDistance: number; // miles from driver location
  };
  driverUtilizationTarget: number; // percentage
  autoSubmitThreshold: number; // confidence level to auto-submit bids
}

class WARPIntelligentBiddingService extends EventEmitter {
  private scrapedLoads: WARPLoad[] = [];
  private activeBids: Map<string, BidEvaluation> = new Map();
  private biddingStrategy: BiddingStrategy;
  private isScrapingActive: boolean = false;

  constructor() {
    super();
    this.biddingStrategy = this.getDefaultBiddingStrategy();
    this.initializeMockWARPLoads();

    // Simulate real-time load scraping every 2 minutes
    setInterval(() => this.scrapeWARPLoads(), 120000);

    // Evaluate loads every 30 seconds
    setInterval(() => this.evaluateAllLoads(), 30000);
  }

  private getDefaultBiddingStrategy(): BiddingStrategy {
    return {
      aggressiveness: 'moderate',
      profitMarginTarget: 15, // 15% profit margin
      maxBidAmount: 5000,
      equipmentPreferences: [
        'Dry Van',
        'Cargo Van',
        'Sprinter Van',
        'Box Truck (24ft)',
      ],
      geographicFocus: {
        preferredStates: ['TX', 'OK', 'LA', 'AR', 'NM'],
        maxDistance: 250,
      },
      driverUtilizationTarget: 80,
      autoSubmitThreshold: 85, // 85% confidence to auto-submit
    };
  }

  private initializeMockWARPLoads() {
    // Mock WARP loads for demonstration
    this.scrapedLoads = [
      {
        id: 'WARP-LOAD-001',
        origin: {
          city: 'Dallas',
          state: 'TX',
          zipCode: '75201',
          coordinates: { lat: 32.7767, lng: -96.797 },
        },
        destination: {
          city: 'Austin',
          state: 'TX',
          zipCode: '78701',
          coordinates: { lat: 30.2672, lng: -97.7431 },
        },
        pickupDate: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
        equipmentType: 'Sprinter Van',
        weight: 800,
        commodity: 'Medical Equipment',
        distance: 195,
        urgency: 'high',
        rateRange: { min: 380, max: 420 },
        postedAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 3600 * 1000),
        contactInfo: {
          companyName: 'MedTech Solutions',
          phone: '(555) 123-4567',
        },
      },
      {
        id: 'WARP-LOAD-002',
        origin: {
          city: 'Houston',
          state: 'TX',
          zipCode: '77001',
          coordinates: { lat: 29.7604, lng: -95.3698 },
        },
        destination: {
          city: 'San Antonio',
          state: 'TX',
          zipCode: '78201',
          coordinates: { lat: 29.4241, lng: -98.4936 },
        },
        pickupDate: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
        equipmentType: 'Box Truck (24ft)',
        weight: 4500,
        commodity: 'Electronics',
        distance: 197,
        urgency: 'medium',
        suggestedRate: 485,
        postedAt: new Date(),
        expiresAt: new Date(Date.now() + 18 * 3600 * 1000),
        contactInfo: {
          companyName: 'Tech Logistics Corp',
          email: 'dispatch@techlogistics.com',
        },
      },
      {
        id: 'WARP-LOAD-003',
        origin: {
          city: 'Fort Worth',
          state: 'TX',
          zipCode: '76102',
          coordinates: { lat: 32.7555, lng: -97.3308 },
        },
        destination: {
          city: 'Oklahoma City',
          state: 'OK',
          zipCode: '73102',
          coordinates: { lat: 35.4676, lng: -97.5164 },
        },
        pickupDate: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
        equipmentType: 'Cargo Van',
        weight: 650,
        commodity: 'Documents & Samples',
        distance: 204,
        urgency: 'urgent',
        rateRange: { min: 280, max: 320 },
        postedAt: new Date(),
        expiresAt: new Date(Date.now() + 12 * 3600 * 1000),
        specialRequirements: ['Temperature Controlled'],
        contactInfo: {
          companyName: 'Legal Express Services',
          phone: '(555) 987-6543',
        },
      },
    ];
  }

  // Simulate web scraping WARP loads
  private async scrapeWARPLoads() {
    if (this.isScrapingActive) return;

    this.isScrapingActive = true;
    console.log('🕷️ Scraping WARP loads...');

    try {
      // In production, this would scrape carrier.wearewarp.com
      // For now, simulate new loads being added
      const newLoad: WARPLoad = {
        id: `WARP-LOAD-${Date.now()}`,
        origin: {
          city: 'Dallas',
          state: 'TX',
          zipCode: '75201',
          coordinates: { lat: 32.7767, lng: -96.797 },
        },
        destination: {
          city: 'Tulsa',
          state: 'OK',
          zipCode: '74103',
          coordinates: { lat: 36.154, lng: -95.9928 },
        },
        pickupDate: new Date(
          Date.now() + Math.random() * 24 * 3600 * 1000
        ).toISOString(),
        equipmentType: ['Cargo Van', 'Sprinter Van', 'Box Truck (24ft)'][
          Math.floor(Math.random() * 3)
        ],
        weight: Math.floor(Math.random() * 3000) + 500,
        commodity: ['Electronics', 'Medical Equipment', 'Documents', 'Parts'][
          Math.floor(Math.random() * 4)
        ],
        distance: 235,
        urgency: ['medium', 'high', 'urgent'][
          Math.floor(Math.random() * 3)
        ] as any,
        rateRange: { min: 350, max: 450 },
        postedAt: new Date(),
        expiresAt: new Date(Date.now() + 18 * 3600 * 1000),
        contactInfo: {
          companyName: 'Dynamic Logistics',
        },
      };

      this.scrapedLoads.push(newLoad);
      this.emit('newLoadScraped', newLoad);
      console.log(`✅ New WARP load scraped: ${newLoad.id}`);
    } catch (error) {
      console.error('❌ WARP scraping failed:', error);
    } finally {
      this.isScrapingActive = false;
    }
  }

  // Evaluate all loads against current network capacity
  private async evaluateAllLoads() {
    const currentLoads = this.getActiveLoads();
    const networkMetrics = goWithTheFlowService.getSystemMetrics();
    const equipmentBreakdown = goWithTheFlowService.getEquipmentBreakdown();

    console.log(
      `🤖 Evaluating ${currentLoads.length} WARP loads against network capacity...`
    );

    for (const load of currentLoads) {
      const evaluation = await this.evaluateLoad(
        load,
        networkMetrics,
        equipmentBreakdown
      );

      if (evaluation.shouldBid) {
        this.activeBids.set(load.id, evaluation);
        this.emit('bidRecommendation', evaluation);

        // Auto-submit if confidence is high enough
        if (evaluation.confidence >= this.biddingStrategy.autoSubmitThreshold) {
          await this.submitBid(evaluation);
        }
      }
    }
  }

  // Core load evaluation logic
  private async evaluateLoad(
    load: WARPLoad,
    networkMetrics: any,
    equipmentBreakdown: any
  ): Promise<BidEvaluation> {
    const availableDrivers = goWithTheFlowService.getAvailableDrivers();
    const matchedDrivers = this.findMatchingDrivers(load, availableDrivers);

    let shouldBid = false;
    let confidence = 0;
    let recommendedBid = 0;
    const riskFactors: string[] = [];
    let reasoning = '';

    // 1. Equipment Availability Check
    const hasEquipment = matchedDrivers.length > 0;
    if (!hasEquipment) {
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
      {
        lat: bestDriver.driverId === 'driver-4' ? 32.7767 : 29.7604,
        lng: bestDriver.driverId === 'driver-4' ? -96.797 : -95.3698,
      },
      load.origin.coordinates || { lat: 32.7767, lng: -96.797 }
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

    const maxAcceptableRate = load.rateRange?.max || load.suggestedRate || 0;

    if (maxAcceptableRate >= targetRate) {
      confidence += 25;
      shouldBid = true;
      recommendedBid = Math.min(targetRate * 1.05, maxAcceptableRate); // Bid slightly above target but within range
      reasoning += `Profitable opportunity (${(((maxAcceptableRate - estimatedCosts) / estimatedCosts) * 100).toFixed(1)}% margin). `;
    } else {
      confidence -= 15;
      riskFactors.push('Insufficient rate for profitable operation');
    }

    // 4. Urgency & Priority Scoring
    if (load.urgency === 'urgent') {
      confidence += 15;
      reasoning += 'Urgent load - premium pricing opportunity. ';
    } else if (load.urgency === 'high') {
      confidence += 10;
    }

    // 5. Driver Utilization Optimization
    if (bestDriver.availability === 'available') {
      confidence += 10;
      reasoning += 'Driver immediately available. ';
    }

    // 6. Special Requirements Risk Assessment
    if (load.specialRequirements?.length) {
      const canHandle = load.specialRequirements.every(
        (req) =>
          bestDriver.equipmentType.toLowerCase().includes('reefer') ||
          req.toLowerCase().includes('temperature')
      );

      if (canHandle) {
        confidence += 5;
        reasoning += 'Can handle special requirements. ';
      } else {
        confidence -= 20;
        riskFactors.push('Cannot meet special requirements');
      }
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
      matchedDrivers,
      reasoning: reasoning.trim(),
      riskFactors,
      profitMargin,
      competitiveAdvantage: shouldBid
        ? 'Real-time capacity matching with AI optimization'
        : undefined,
    };
  }

  private findMatchingDrivers(load: WARPLoad, availableDrivers: any[]) {
    return availableDrivers
      .filter((driver) => {
        // Equipment type matching
        if (driver.equipmentType !== load.equipmentType) return false;

        // Basic availability check
        return driver.status === 'online' && driver.hoursRemaining > 4;
      })
      .map((driver) => ({
        driverId: driver.id,
        driverName: driver.name,
        equipmentType: driver.equipmentType,
        distance: this.calculateDistance(
          driver.location,
          load.origin.coordinates || { lat: 32.7767, lng: -96.797 }
        ),
        availability: 'available' as const,
        hoursRemaining: driver.hoursRemaining,
      }))
      .sort((a, b) => a.distance - b.distance);
  }

  private calculateOperatingCosts(
    load: WARPLoad,
    deadheadMiles: number
  ): number {
    const totalMiles = load.distance + deadheadMiles;
    const fuelCost = (totalMiles / 25) * 4.2; // 25 mpg, $4.20/gallon diesel
    const driverPay = (totalMiles / 50) * 25; // $25/hour at 50mph average
    const vehicleCosts = totalMiles * 0.35; // $0.35/mile for wear, insurance, etc.
    const overhead = (fuelCost + driverPay + vehicleCosts) * 0.15; // 15% overhead

    return fuelCost + driverPay + vehicleCosts + overhead;
  }

  private calculateDistance(
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number }
  ): number {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (point2.lat - point1.lat) * (Math.PI / 180);
    const dLon = (point2.lng - point1.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(point1.lat * (Math.PI / 180)) *
        Math.cos(point2.lat * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 0.621371; // Convert km to miles
  }

  // Simulate bid submission
  private async submitBid(evaluation: BidEvaluation): Promise<boolean> {
    try {
      console.log(
        `📤 Auto-submitting bid for ${evaluation.loadId} at $${evaluation.recommendedBid}`
      );

      // In production, this would submit to WARP's platform
      // For now, simulate successful bid submission

      this.emit('bidSubmitted', {
        loadId: evaluation.loadId,
        bidAmount: evaluation.recommendedBid,
        confidence: evaluation.confidence,
        submittedAt: new Date(),
        status: 'submitted',
      });

      // Simulate bid acceptance/rejection after a delay
      setTimeout(
        () => {
          const isAccepted = Math.random() > 0.3; // 70% acceptance rate
          this.emit('bidResult', {
            loadId: evaluation.loadId,
            result: isAccepted ? 'accepted' : 'rejected',
            finalRate: isAccepted ? evaluation.recommendedBid : null,
          });
        },
        Math.random() * 60000 + 30000
      ); // 30-90 seconds

      return true;
    } catch (error) {
      console.error(`❌ Failed to submit bid for ${evaluation.loadId}:`, error);
      return false;
    }
  }

  // Public API methods
  getActiveLoads(): WARPLoad[] {
    const now = new Date();
    return this.scrapedLoads.filter((load) => load.expiresAt > now);
  }

  getActiveBids(): BidEvaluation[] {
    return Array.from(this.activeBids.values());
  }

  getBiddingStrategy(): BiddingStrategy {
    return { ...this.biddingStrategy };
  }

  updateBiddingStrategy(strategy: Partial<BiddingStrategy>) {
    this.biddingStrategy = { ...this.biddingStrategy, ...strategy };
    this.emit('strategyUpdated', this.biddingStrategy);
  }

  // Analytics and performance metrics
  getBiddingMetrics(): {
    totalLoadsEvaluated: number;
    bidsSubmitted: number;
    bidAcceptanceRate: number;
    averageProfitMargin: number;
    networkUtilization: number;
  } {
    return {
      totalLoadsEvaluated: this.scrapedLoads.length,
      bidsSubmitted: this.activeBids.size,
      bidAcceptanceRate: 0.68, // 68% acceptance rate (mock)
      averageProfitMargin: 18.5, // 18.5% average margin
      networkUtilization: 0.72, // 72% driver utilization
    };
  }

  // Manual bid submission for loads that don't meet auto-submit criteria
  async manualBidSubmission(
    loadId: string,
    bidAmount: number
  ): Promise<boolean> {
    const evaluation = this.activeBids.get(loadId);
    if (!evaluation) {
      console.error(`❌ No evaluation found for load ${loadId}`);
      return false;
    }

    evaluation.recommendedBid = bidAmount;
    return await this.submitBid(evaluation);
  }
}

export const warpIntelligentBiddingService =
  new WARPIntelligentBiddingService();
