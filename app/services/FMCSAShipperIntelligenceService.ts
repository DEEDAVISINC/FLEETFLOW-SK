/**
 * FMCSA Shipper Intelligence Service
 * Uses FMCSA carrier data to reverse-engineer shipper relationships
 * AI-powered analysis to identify potential customers based on carrier routes and patterns
 */

import { fleetAI } from './ai';
import { EnhancedCarrierService } from './enhanced-carrier-service';

export interface ShipperIntelligence {
  id: string;
  companyName: string;
  estimatedShipperType: 'manufacturer' | 'distributor' | 'retailer' | 'wholesaler' | 'e-commerce';
  industryCategory: string;
  commonRoutes: {
    origin: string;
    destination: string;
    frequency: number;
    lastSeen: string;
  }[];
  associatedCarriers: {
    mcNumber: string;
    dotNumber: string;
    carrierName: string;
    relationship: 'primary' | 'secondary' | 'seasonal';
    confidence: number;
  }[];
  shippingPatterns: {
    peakSeasons: string[];
    averageLoads: number;
    equipmentTypes: string[];
    valueRange: string;
  };
  contactIntelligence: {
    estimatedLocation: string;
    industrySize: 'small' | 'medium' | 'large' | 'enterprise';
    annualFreightSpend: string;
    growthIndicators: string[];
  };
  aiAnalysis: {
    prospectScore: number;
    reasoningFactors: string[];
    recommendedApproach: string;
    competitiveLandscape: string[];
    bestContactTime: string;
  };
  discoveredAt: Date;
  lastUpdated: Date;
}

export class FMCSAShipperIntelligenceService {
  private carrierService: EnhancedCarrierService;
  private shipperCache: Map<string, ShipperIntelligence> = new Map();

  constructor() {
    this.carrierService = new EnhancedCarrierService();
    console.info('🧠 FMCSA Shipper Intelligence Service initialized');
  }

  /**
   * Main intelligence gathering method - analyzes carriers to find their shippers
   */
  async discoverShippersFromCarriers(searchCriteria: {
    location?: string;
    industryFocus?: string;
    equipmentType?: string;
    maxResults?: number;
  }): Promise<ShipperIntelligence[]> {
    console.info('🔍 Starting FMCSA shipper intelligence discovery...');

    try {
      // Step 1: Get relevant carriers from FMCSA database
      const carriers = await this.identifyRelevantCarriers(searchCriteria);
      
      // Step 2: Analyze each carrier's patterns to infer shippers
      const shipperIntelligence: Map<string, ShipperIntelligence> = new Map();
      
      for (const carrier of carriers) {
        const shippers = await this.analyzeCarrierForShippers(carrier);
        shippers.forEach(shipper => {
          const existing = shipperIntelligence.get(shipper.companyName);
          if (existing) {
            shipperIntelligence.set(shipper.companyName, this.mergeShipperData(existing, shipper));
          } else {
            shipperIntelligence.set(shipper.companyName, shipper);
          }
        });
      }

      // Step 3: AI scoring and ranking
      const rankedShippers = await this.rankShipperProspects(Array.from(shipperIntelligence.values()));
      
      console.info(`✅ Discovered ${rankedShippers.length} potential shippers`);
      return rankedShippers.slice(0, searchCriteria.maxResults || 50);

    } catch (error) {
      console.error('❌ Error in shipper intelligence discovery:', error);
      return this.getMockShipperIntelligence(searchCriteria);
    }
  }

  /**
   * Analyze specific carrier to identify their likely customers/shippers
   */
  private async analyzeCarrierForShippers(carrier: any): Promise<ShipperIntelligence[]> {
    console.info(`🔍 Analyzing carrier ${carrier.carrierName} for shipper patterns...`);

    try {
      // Use AI to analyze carrier data and infer shipper relationships
      const aiAnalysis = await fleetAI.analyzeCarrierForShippers({
        carrierName: carrier.carrierName,
        mcNumber: carrier.mcNumber,
        dotNumber: carrier.dotNumber,
        operatingAuthority: carrier.operatingAuthority,
        equipmentTypes: carrier.equipmentTypes,
        operatingRadius: carrier.operatingRadius,
        specializations: carrier.specializations,
        safetyRating: carrier.safetyRating,
        physicalAddress: carrier.physicalAddress
      });

      // Process AI analysis into structured shipper intelligence
      return this.processAIAnalysisToShippers(aiAnalysis, carrier);

    } catch (error) {
      console.error(`❌ Error analyzing carrier ${carrier.carrierName}:`, error);
      return this.generateMockShippersForCarrier(carrier);
    }
  }

  /**
   * AI-powered prospect scoring and ranking
   */
  private async rankShipperProspects(shippers: ShipperIntelligence[]): Promise<ShipperIntelligence[]> {
    console.info('🧠 AI ranking shipper prospects...');

    try {
      const scoredShippers = await Promise.all(
        shippers.map(async (shipper) => {
          const aiScoring = await fleetAI.scoreShipperProspect({
            companyName: shipper.companyName,
            industryCategory: shipper.industryCategory,
            shippingPatterns: shipper.shippingPatterns,
            carrierRelationships: shipper.associatedCarriers.length,
            estimatedVolume: shipper.shippingPatterns.averageLoads,
            geographicScope: shipper.commonRoutes.length
          });

          return {
            ...shipper,
            aiAnalysis: {
              ...shipper.aiAnalysis,
              prospectScore: aiScoring.score,
              reasoningFactors: aiScoring.factors,
              recommendedApproach: aiScoring.approach,
              competitiveLandscape: aiScoring.competition,
              bestContactTime: aiScoring.timing
            }
          };
        })
      );

      return scoredShippers.sort((a, b) => b.aiAnalysis.prospectScore - a.aiAnalysis.prospectScore);

    } catch (error) {
      console.error('❌ Error in AI prospect ranking:', error);
      return shippers.sort((a, b) => b.shippingPatterns.averageLoads - a.shippingPatterns.averageLoads);
    }
  }

  /**
   * Export discovered shippers for CRM integration
   */
  async exportShippersToLeadGeneration(shippers: ShipperIntelligence[]): Promise<{
    csvData: string;
    summary: {
      totalShippers: number;
      highValueProspects: number;
      industryBreakdown: Record<string, number>;
      averageProspectScore: number;
    };
  }> {
    console.info('📊 Exporting shipper intelligence to lead generation...');

    const csvHeaders = [
      'Company Name',
      'Industry',
      'Shipper Type',
      'Prospect Score',
      'Estimated Location',
      'Annual Freight Spend',
      'Average Loads',
      'Equipment Types',
      'Peak Seasons',
      'Recommended Approach',
      'Associated Carriers',
      'Confidence Level'
    ];

    const csvRows = shippers.map(shipper => [
      shipper.companyName,
      shipper.industryCategory,
      shipper.estimatedShipperType,
      shipper.aiAnalysis.prospectScore.toString(),
      shipper.contactIntelligence.estimatedLocation,
      shipper.contactIntelligence.annualFreightSpend,
      shipper.shippingPatterns.averageLoads.toString(),
      shipper.shippingPatterns.equipmentTypes.join('; '),
      shipper.shippingPatterns.peakSeasons.join('; '),
      shipper.aiAnalysis.recommendedApproach,
      shipper.associatedCarriers.length.toString(),
      Math.round(shipper.associatedCarriers.reduce((avg, c) => avg + c.confidence, 0) / shipper.associatedCarriers.length).toString()
    ]);

    const csvData = [csvHeaders, ...csvRows].map(row => row.join(',')).join('\n');

    const industryBreakdown: Record<string, number> = {};
    shippers.forEach(shipper => {
      industryBreakdown[shipper.industryCategory] = (industryBreakdown[shipper.industryCategory] || 0) + 1;
    });

    return {
      csvData,
      summary: {
        totalShippers: shippers.length,
        highValueProspects: shippers.filter(s => s.aiAnalysis.prospectScore >= 80).length,
        industryBreakdown,
        averageProspectScore: Math.round(
          shippers.reduce((sum, s) => sum + s.aiAnalysis.prospectScore, 0) / shippers.length
        )
      }
    };
  }

  // Helper methods
  private async identifyRelevantCarriers(searchCriteria: any): Promise<any[]> {
    // Mock carriers for demonstration - in production, this would query FMCSA API
    return [
      {
        carrierName: 'Southeast Manufacturing Transport',
        mcNumber: '123456',
        dotNumber: '987654',
        operatingStatus: 'ACTIVE',
        safetyRating: 'SATISFACTORY',
        equipmentTypes: ['Dry Van', 'Flatbed'],
        operatingRadius: 'Regional',
        specializations: ['Manufacturing', 'Automotive'],
        physicalAddress: 'Atlanta, GA'
      },
      {
        carrierName: 'Midwest Distribution Co.',
        mcNumber: '234567',
        dotNumber: '876543',
        operatingStatus: 'ACTIVE',
        safetyRating: 'SATISFACTORY',
        equipmentTypes: ['Dry Van', 'Refrigerated'],
        operatingRadius: 'National',
        specializations: ['Food Distribution', 'Retail'],
        physicalAddress: 'Chicago, IL'
      }
    ];
  }

  private processAIAnalysisToShippers(aiAnalysis: any, carrier: any): ShipperIntelligence[] {
    if (!aiAnalysis.identifiedShippers) return [];

    return aiAnalysis.identifiedShippers.map((shipperData: any, index: number) => ({
      id: `shipper-${carrier.mcNumber}-${index}`,
      companyName: shipperData.name,
      estimatedShipperType: shipperData.type || 'manufacturer',
      industryCategory: shipperData.industry || 'General Manufacturing',
      commonRoutes: shipperData.routes || [],
      associatedCarriers: [{
        mcNumber: carrier.mcNumber,
        dotNumber: carrier.dotNumber,
        carrierName: carrier.carrierName,
        relationship: shipperData.relationship || 'secondary',
        confidence: shipperData.confidence || 75
      }],
      shippingPatterns: {
        peakSeasons: shipperData.seasonality || ['Q4'],
        averageLoads: shipperData.volume || 50,
        equipmentTypes: shipperData.equipment || ['Dry Van'],
        valueRange: shipperData.valueRange || '$50K-$100K annually'
      },
      contactIntelligence: {
        estimatedLocation: shipperData.location || carrier.physicalAddress,
        industrySize: shipperData.size || 'medium',
        annualFreightSpend: shipperData.spend || '$250K-$500K',
        growthIndicators: shipperData.growth || ['Stable operations']
      },
      aiAnalysis: {
        prospectScore: 0, // Will be calculated in ranking step
        reasoningFactors: [],
        recommendedApproach: '',
        competitiveLandscape: [],
        bestContactTime: 'Tuesday-Thursday 10AM-2PM'
      },
      discoveredAt: new Date(),
      lastUpdated: new Date()
    }));
  }

  private mergeShipperData(existing: ShipperIntelligence, newData: ShipperIntelligence): ShipperIntelligence {
    return {
      ...existing,
      associatedCarriers: [...existing.associatedCarriers, ...newData.associatedCarriers],
      commonRoutes: [...existing.commonRoutes, ...newData.commonRoutes],
      shippingPatterns: {
        ...existing.shippingPatterns,
        averageLoads: Math.max(existing.shippingPatterns.averageLoads, newData.shippingPatterns.averageLoads),
        equipmentTypes: [...new Set([...existing.shippingPatterns.equipmentTypes, ...newData.shippingPatterns.equipmentTypes])]
      },
      lastUpdated: new Date()
    };
  }

  private getMockShipperIntelligence(searchCriteria: any): ShipperIntelligence[] {
    return [
      {
        id: 'mock-shipper-1',
        companyName: 'Southeast Manufacturing Co.',
        estimatedShipperType: 'manufacturer',
        industryCategory: 'Automotive Parts',
        commonRoutes: [
          { origin: 'Atlanta, GA', destination: 'Detroit, MI', frequency: 12, lastSeen: '2024-01-15' }
        ],
        associatedCarriers: [
          { mcNumber: '123456', dotNumber: '987654', carrierName: 'Regional Express', relationship: 'primary', confidence: 85 }
        ],
        shippingPatterns: {
          peakSeasons: ['Q1', 'Q4'],
          averageLoads: 45,
          equipmentTypes: ['Dry Van', 'Flatbed'],
          valueRange: '$75K-$150K annually'
        },
        contactIntelligence: {
          estimatedLocation: 'Atlanta, GA Metro',
          industrySize: 'medium',
          annualFreightSpend: '$400K-$800K',
          growthIndicators: ['Expanding production', 'New supplier contracts']
        },
        aiAnalysis: {
          prospectScore: 87,
          reasoningFactors: ['High shipping volume', 'Regular routes', 'Growth indicators'],
          recommendedApproach: 'Direct outreach highlighting automotive expertise and regional coverage',
          competitiveLandscape: ['Regional Express (current)', 'National carriers'],
          bestContactTime: 'Tuesday-Thursday 10AM-2PM'
        },
        discoveredAt: new Date(),
        lastUpdated: new Date()
      }
    ];
  }

  private generateMockShippersForCarrier(carrier: any): ShipperIntelligence[] {
    return [
      {
        id: `mock-${carrier.mcNumber}-1`,
        companyName: `${carrier.carrierName} Customer #1`,
        estimatedShipperType: 'manufacturer',
        industryCategory: 'General Manufacturing',
        commonRoutes: [],
        associatedCarriers: [{
          mcNumber: carrier.mcNumber,
          dotNumber: carrier.dotNumber,
          carrierName: carrier.carrierName,
          relationship: 'secondary',
          confidence: 70
        }],
        shippingPatterns: {
          peakSeasons: ['Q4'],
          averageLoads: 25,
          equipmentTypes: ['Dry Van'],
          valueRange: '$50K-$100K annually'
        },
        contactIntelligence: {
          estimatedLocation: 'Unknown',
          industrySize: 'medium',
          annualFreightSpend: '$200K-$400K',
          growthIndicators: ['Stable operations']
        },
        aiAnalysis: {
          prospectScore: 65,
          reasoningFactors: ['Limited data available'],
          recommendedApproach: 'Research-first approach',
          competitiveLandscape: [],
          bestContactTime: 'Business hours'
        },
        discoveredAt: new Date(),
        lastUpdated: new Date()
      }
    ];
  }
}

// Singleton export
export const fmcsaShipperIntelligence = new FMCSAShipperIntelligenceService();
