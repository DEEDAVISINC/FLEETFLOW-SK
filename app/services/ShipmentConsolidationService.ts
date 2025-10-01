/**
 * FLEETFLOW SHIPMENT CONSOLIDATION SERVICE
 *
 * Core service for consolidating multiple LCL shipments into efficient FCL containers.
 * Saves 20-30% on shipping costs by optimizing container utilization.
 *
 * Features:
 * - Automatic consolidation opportunity detection
 * - Container optimization algorithms
 * - Cost savings calculations
 * - House B/L to Master B/L management
 * - Consolidation analytics and reporting
 */

export interface ConsolidationOpportunity {
  id: string;
  shipments: Shipment[];
  totalWeight: number;
  totalVolume: number;
  containerType: string;
  containerUtilization: {
    weight: number;
    volume: number;
  };
  costSavings: number;
  consolidationRatio: number;
  originPort: string;
  destinationPort: string;
  etd: Date;
  createdAt: Date;
}

export interface ConsolidatedShipment {
  id: string;
  consolidationId: string;
  masterBLNumber: string;
  houseBLNumbers: string[];
  containerNumbers: string[];
  totalShipments: number;
  totalWeight: number;
  totalVolume: number;
  containerType: string;
  carrier: string;
  vessel: string;
  voyage: string;
  originPort: string;
  destinationPort: string;
  etd: Date;
  eta: Date;
  freightCost: number;
  savingsAmount: number;
  createdAt: Date;
}

export interface Shipment {
  id: string;
  customerId: string;
  customerName: string;
  commodity: string;
  weight: number;
  volume: number;
  originPort: string;
  destinationPort: string;
  etd: Date;
  shippingCost: number;
  contractRate?: number;
}

export interface ConsolidationCriteria {
  originPort: string;
  destinationPort: string;
  departureWindowDays: number;
  minShipments: number;
  maxShipments: number;
  minWeightUtilization: number;
  minVolumeUtilization: number;
}

export class ShipmentConsolidationService {
  private static instance: ShipmentConsolidationService;

  // Container specifications (in lbs and cbm)
  private readonly CONTAINER_SPECS = {
    '20FT': { weight: 28000, volume: 33.2 },
    '40FT': { weight: 28000, volume: 67.7 },
    '40HC': { weight: 28000, volume: 76.4 },
    '45HC': { weight: 28000, volume: 86.0 },
  };

  private constructor() {}

  public static getInstance(): ShipmentConsolidationService {
    if (!ShipmentConsolidationService.instance) {
      ShipmentConsolidationService.instance = new ShipmentConsolidationService();
    }
    return ShipmentConsolidationService.instance;
  }

  /**
   * FIND CONSOLIDATION OPPORTUNITIES
   * Scans eligible shipments and identifies consolidation opportunities
   */
  public async findConsolidationOpportunities(
    criteria: ConsolidationCriteria
  ): Promise<ConsolidationOpportunity[]> {
    try {
      // Get eligible shipments for consolidation
      const eligibleShipments = await this.getEligibleShipments(criteria);

      // Group shipments by consolidation criteria
      const shipmentGroups = this.groupShipmentsByConsolidationCriteria(
        eligibleShipments,
        criteria
      );

      // Convert groups to consolidation opportunities
      const opportunities: ConsolidationOpportunity[] = [];

      for (const group of shipmentGroups) {
        if (group.shipments.length >= criteria.minShipments) {
          const opportunity = await this.createConsolidationOpportunity(group, criteria);
          if (opportunity) {
            opportunities.push(opportunity);
          }
        }
      }

      // Sort by savings potential
      return opportunities.sort((a, b) => b.costSavings - a.costSavings);

    } catch (error) {
      console.error('Error finding consolidation opportunities:', error);
      throw new Error('Failed to find consolidation opportunities');
    }
  }

  /**
   * EXECUTE CONSOLIDATION
   * Creates consolidated shipment and updates individual shipments
   */
  public async executeConsolidation(
    opportunityId: string,
    containerType: string,
    carrier: string
  ): Promise<ConsolidatedShipment> {
    try {
      // Get the consolidation opportunity
      const opportunity = await this.getConsolidationOpportunity(opportunityId);
      if (!opportunity) {
        throw new Error('Consolidation opportunity not found');
      }

      // Generate tracking numbers
      const masterBLNumber = await this.generateMasterBLNumber();
      const houseBLNumbers = await this.generateHouseBLNumbers(opportunity.shipments.length);
      const containerNumbers = await this.generateContainerNumbers(1); // Start with 1 container

      // Calculate consolidated cost
      const consolidatedCost = await this.calculateConsolidatedCost(
        opportunity.totalWeight,
        opportunity.totalVolume,
        containerType,
        carrier
      );

      // Calculate savings
      const individualCosts = opportunity.shipments.reduce((sum, s) => sum + s.shippingCost, 0);
      const savingsAmount = individualCosts - consolidatedCost;

      // Create consolidated shipment record
      const consolidatedShipment: ConsolidatedShipment = {
        id: `CONS-${Date.now()}`,
        consolidationId: opportunityId,
        masterBLNumber,
        houseBLNumbers,
        containerNumbers,
        totalShipments: opportunity.shipments.length,
        totalWeight: opportunity.totalWeight,
        totalVolume: opportunity.totalVolume,
        containerType,
        carrier,
        vessel: '', // To be assigned
        voyage: '', // To be assigned
        originPort: opportunity.originPort,
        destinationPort: opportunity.destinationPort,
        etd: opportunity.etd,
        eta: new Date(opportunity.etd.getTime() + 21 * 24 * 60 * 60 * 1000), // ~21 days transit
        freightCost: consolidatedCost,
        savingsAmount,
        createdAt: new Date(),
      };

      // Save consolidated shipment (in production: database)
      await this.saveConsolidatedShipment(consolidatedShipment);

      // Update individual shipments with consolidation reference
      await this.linkShipmentsToConsolidation(
        opportunity.shipments.map(s => s.id),
        consolidatedShipment.id,
        houseBLNumbers
      );

      return consolidatedShipment;

    } catch (error) {
      console.error('Error executing consolidation:', error);
      throw new Error('Failed to execute consolidation');
    }
  }

  /**
   * GET CONSOLIDATION ANALYTICS
   * Provides insights into consolidation performance
   */
  public async getConsolidationAnalytics(
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalConsolidations: number;
    totalShipmentsConsolidated: number;
    totalSavings: number;
    averageSavingsPerShipment: number;
    containerUtilization: number;
    topRoutes: Array<{ route: string; consolidations: number; savings: number }>;
  }> {
    try {
      // In production: Query database for consolidation data
      // For now, return mock analytics
      return {
        totalConsolidations: 45,
        totalShipmentsConsolidated: 203,
        totalSavings: 127450,
        averageSavingsPerShipment: 627,
        containerUtilization: 87,
        topRoutes: [
          { route: 'CNSHA-USLAX', consolidations: 12, savings: 45230 },
          { route: 'CNSHA-USNYC', consolidations: 8, savings: 32100 },
          { route: 'HKHKG-USLAX', consolidations: 6, savings: 28750 },
        ],
      };
    } catch (error) {
      console.error('Error getting consolidation analytics:', error);
      throw new Error('Failed to get consolidation analytics');
    }
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private async getEligibleShipments(criteria: ConsolidationCriteria): Promise<Shipment[]> {
    // In production: Query database for shipments matching criteria
    // For now, return mock data
    return [
      {
        id: 'SHP-001',
        customerId: 'CUST-001',
        customerName: 'ABC Imports',
        commodity: 'Electronics',
        weight: 1200,
        volume: 8.5,
        originPort: 'CNSHA',
        destinationPort: 'USLAX',
        etd: new Date('2025-02-01'),
        shippingCost: 2850,
      },
      {
        id: 'SHP-002',
        customerId: 'CUST-002',
        customerName: 'XYZ Trading',
        commodity: 'Machinery Parts',
        weight: 800,
        volume: 5.2,
        originPort: 'CNSHA',
        destinationPort: 'USLAX',
        etd: new Date('2025-02-01'),
        shippingCost: 1950,
      },
      {
        id: 'SHP-003',
        customerId: 'CUST-003',
        customerName: 'Global Supplies',
        commodity: 'Textiles',
        weight: 600,
        volume: 4.8,
        originPort: 'CNSHA',
        destinationPort: 'USLAX',
        etd: new Date('2025-02-02'),
        shippingCost: 1650,
      },
    ];
  }

  private groupShipmentsByConsolidationCriteria(
    shipments: Shipment[],
    criteria: ConsolidationCriteria
  ): Array<{ shipments: Shipment[]; totalWeight: number; totalVolume: number }> {
    const groups: Map<string, Shipment[]> = new Map();

    for (const shipment of shipments) {
      const key = `${shipment.originPort}-${shipment.destinationPort}-${shipment.etd.toISOString().split('T')[0]}`;

      if (!groups.has(key)) {
        groups.set(key, []);
      }

      groups.get(key)!.push(shipment);
    }

    // Convert to groups with totals
    return Array.from(groups.entries()).map(([key, groupShipments]) => ({
      shipments: groupShipments,
      totalWeight: groupShipments.reduce((sum, s) => sum + s.weight, 0),
      totalVolume: groupShipments.reduce((sum, s) => sum + s.volume, 0),
    }));
  }

  private async createConsolidationOpportunity(
    group: { shipments: Shipment[]; totalWeight: number; totalVolume: number },
    criteria: ConsolidationCriteria
  ): Promise<ConsolidationOpportunity | null> {
    // Find optimal container
    const optimalContainer = this.findOptimalContainer(group.totalWeight, group.totalVolume);

    if (!optimalContainer) {
      return null;
    }

    // Check utilization thresholds
    const weightUtilization = (group.totalWeight / optimalContainer.capacity.weight) * 100;
    const volumeUtilization = (group.totalVolume / optimalContainer.capacity.volume) * 100;

    if (weightUtilization < criteria.minWeightUtilization ||
        volumeUtilization < criteria.minVolumeUtilization) {
      return null;
    }

    // Calculate cost savings
    const individualCosts = group.shipments.reduce((sum, s) => sum + s.shippingCost, 0);
    const consolidatedCost = await this.calculateConsolidatedCost(
      group.totalWeight,
      group.totalVolume,
      optimalContainer.type,
      'MSC' // Default carrier
    );
    const costSavings = individualCosts - consolidatedCost;

    return {
      id: `OPP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      shipments: group.shipments,
      totalWeight: group.totalWeight,
      totalVolume: group.totalVolume,
      containerType: optimalContainer.type,
      containerUtilization: {
        weight: weightUtilization,
        volume: volumeUtilization,
      },
      costSavings,
      consolidationRatio: group.shipments.length,
      originPort: group.shipments[0].originPort,
      destinationPort: group.shipments[0].destinationPort,
      etd: group.shipments[0].etd,
      createdAt: new Date(),
    };
  }

  private findOptimalContainer(weight: number, volume: number): { type: string; capacity: { weight: number; volume: number } } | null {
    // Sort containers by capacity ascending
    const containers = Object.entries(this.CONTAINER_SPECS)
      .sort(([, a], [, b]) => a.volume - b.volume);

    // Find smallest container that can fit the shipment
    for (const [type, capacity] of containers) {
      if (weight <= capacity.weight && volume <= capacity.volume) {
        // Check if utilization is reasonable (70-95%)
        const weightUtil = (weight / capacity.weight) * 100;
        const volumeUtil = (volume / capacity.volume) * 100;

        if (weightUtil >= 70 && weightUtil <= 95 && volumeUtil >= 70 && volumeUtil <= 95) {
          return { type, capacity };
        }
      }
    }

    // If no optimal fit, return null
    return null;
  }

  private async calculateConsolidatedCost(
    weight: number,
    volume: number,
    containerType: string,
    carrier: string
  ): Promise<number> {
    // Base rates per container type (simplified)
    const baseRates = {
      '20FT': 2000,
      '40FT': 3500,
      '40HC': 3800,
      '45HC': 4200,
    };

    const baseRate = baseRates[containerType as keyof typeof baseRates] || 3500;

    // Add fuel surcharge (5%)
    const fuelSurcharge = baseRate * 0.05;

    // Add documentation fee per shipment (simplified to flat fee)
    const documentationFee = 150;

    return baseRate + fuelSurcharge + documentationFee;
  }

  private async generateMasterBLNumber(): Promise<string> {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `MBL${timestamp}${random}`;
  }

  private async generateHouseBLNumbers(count: number): Promise<string[]> {
    const houseBLs: string[] = [];
    for (let i = 0; i < count; i++) {
      const timestamp = Date.now();
      const sequence = String(i + 1).padStart(3, '0');
      houseBLs.push(`HBL${timestamp}${sequence}`);
    }
    return houseBLs;
  }

  private async generateContainerNumbers(count: number): Promise<string[]> {
    const containers: string[] = [];
    // Use ISO 6346 format: Owner code (3 letters) + Serial (6 digits) + Check digit
    for (let i = 0; i < count; i++) {
      const ownerCode = 'MSC'; // Example carrier code
      const serial = String(100000 + Math.floor(Math.random() * 900000));
      const checkDigit = this.calculateCheckDigit(ownerCode + serial);
      containers.push(`${ownerCode}${serial}${checkDigit}`);
    }
    return containers;
  }

  private calculateCheckDigit(containerNumber: string): number {
    // Simplified ISO 6346 check digit calculation
    const weights = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512];
    let sum = 0;

    for (let i = 0; i < containerNumber.length; i++) {
      const char = containerNumber[i];
      const value = char >= '0' && char <= '9' ? parseInt(char) :
                   char >= 'A' && char <= 'Z' ? char.charCodeAt(0) - 55 : 0;
      sum += value * weights[i % weights.length];
    }

    return sum % 11 % 10;
  }

  private async getConsolidationOpportunity(id: string): Promise<ConsolidationOpportunity | null> {
    // In production: Query database
    // For now, return mock data
    return null;
  }

  private async saveConsolidatedShipment(shipment: ConsolidatedShipment): Promise<void> {
    // In production: Save to database
    console.log('Saving consolidated shipment:', shipment);
  }

  private async linkShipmentsToConsolidation(
    shipmentIds: string[],
    consolidationId: string,
    houseBLNumbers: string[]
  ): Promise<void> {
    // In production: Update shipment records in database
    console.log('Linking shipments to consolidation:', {
      shipmentIds,
      consolidationId,
      houseBLNumbers,
    });
  }
}

// Export singleton instance
export const shipmentConsolidationService = ShipmentConsolidationService.getInstance();
export default shipmentConsolidationService;
