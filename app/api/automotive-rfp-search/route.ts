import { NextRequest, NextResponse } from 'next/server';
import AutomotiveRFPDiscoveryService from '../../services/AutomotiveRFPDiscoveryService';
import { automotiveRFPWorkflow } from '../../services/AutomotiveRFPWorkflow';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId = 'automotive-api-user',
      enableNotifications = true,
      runImmediate = false,
      searchFilters = {},
    } = body;

    console.info(
      '🚛 Automotive RFP Discovery API - Starting comprehensive search...'
    );

    const automotiveService = new AutomotiveRFPDiscoveryService();

    // If immediate run requested, use workflow for faster execution
    if (runImmediate) {
      const result = await automotiveRFPWorkflow.runImmediateDiscovery(userId);

      return NextResponse.json({
        success: true,
        source: 'immediate_discovery',
        data: {
          opportunities: result.opportunities,
          notificationsSent: enableNotifications ? result.notificationsSent : 0,
          sourcesScanned: result.sourcesScanned,
          executionTime: result.executionTime,
          discoveryMetrics: {
            totalOpportunities: result.opportunities.length,
            totalValue: result.opportunities.reduce(
              (sum, opp) => sum + opp.estimatedValue,
              0
            ),
            averageValue:
              result.opportunities.length > 0
                ? result.opportunities.reduce(
                    (sum, opp) => sum + opp.estimatedValue,
                    0
                  ) / result.opportunities.length
                : 0,
            highPriorityCount: result.opportunities.filter(
              (opp) => opp.competitiveFactors.winProbability >= 0.6
            ).length,
            oemBreakdown: getOEMBreakdown(result.opportunities),
            contractTypeBreakdown: getContractTypeBreakdown(
              result.opportunities
            ),
          },
          workflowStatus: automotiveRFPWorkflow.getWorkflowStatus(),
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Standard comprehensive automotive RFP discovery
    const result =
      await automotiveService.discoverAutomotiveOpportunities(userId);

    // Apply search filters if provided
    let filteredOpportunities = result.opportunities;
    if (searchFilters) {
      filteredOpportunities = applySearchFilters(
        result.opportunities,
        searchFilters
      );
    }

    return NextResponse.json({
      success: true,
      source: 'comprehensive_discovery',
      data: {
        opportunities: filteredOpportunities,
        notificationsSent: enableNotifications ? result.notificationsSent : 0,
        sourcesScanned: result.sourcesScanned,
        discoveryMetrics: {
          totalOpportunities: filteredOpportunities.length,
          totalValue: filteredOpportunities.reduce(
            (sum, opp) => sum + opp.estimatedValue,
            0
          ),
          averageValue:
            filteredOpportunities.length > 0
              ? filteredOpportunities.reduce(
                  (sum, opp) => sum + opp.estimatedValue,
                  0
                ) / filteredOpportunities.length
              : 0,
          highPriorityCount: filteredOpportunities.filter(
            (opp) => opp.competitiveFactors.winProbability >= 0.6
          ).length,
          mediumPriorityCount: filteredOpportunities.filter(
            (opp) =>
              opp.competitiveFactors.winProbability >= 0.4 &&
              opp.competitiveFactors.winProbability < 0.6
          ).length,
          lowPriorityCount: filteredOpportunities.filter(
            (opp) => opp.competitiveFactors.winProbability < 0.4
          ).length,
          oemBreakdown: getOEMBreakdown(filteredOpportunities),
          contractTypeBreakdown: getContractTypeBreakdown(
            filteredOpportunities
          ),
          sourceBreakdown: getSourceBreakdown(filteredOpportunities),
          avgResponseTime: calculateAverageResponseTime(filteredOpportunities),
        },
        workflowStatus: automotiveRFPWorkflow.getWorkflowStatus(),
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('🚨 Automotive RFP discovery API error:', error);

    // Return comprehensive fallback automotive opportunities
    const fallbackOpportunities = generateFallbackOpportunities();

    return NextResponse.json(
      {
        success: false,
        source: 'fallback_data',
        error: 'Discovery service temporarily unavailable',
        data: {
          opportunities: fallbackOpportunities,
          notificationsSent: 0,
          sourcesScanned: 5,
          discoveryMetrics: {
            totalOpportunities: fallbackOpportunities.length,
            totalValue: fallbackOpportunities.reduce(
              (sum, opp) => sum + opp.estimatedValue,
              0
            ),
            averageValue:
              fallbackOpportunities.reduce(
                (sum, opp) => sum + opp.estimatedValue,
                0
              ) / fallbackOpportunities.length,
            highPriorityCount: fallbackOpportunities.filter(
              (opp) => opp.competitiveFactors.winProbability >= 0.6
            ).length,
            oemBreakdown: getOEMBreakdown(fallbackOpportunities),
            contractTypeBreakdown: getContractTypeBreakdown(
              fallbackOpportunities
            ),
          },
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'automotive-get-user';
    const immediate = searchParams.get('immediate') === 'true';

    console.info(
      '🚛 Automotive RFP Discovery GET - Retrieving opportunities...'
    );

    if (immediate) {
      // Use workflow for immediate execution
      const result = await automotiveRFPWorkflow.runImmediateDiscovery(userId);

      return NextResponse.json({
        success: true,
        source: 'immediate_get_discovery',
        data: {
          opportunities: result.opportunities,
          sourcesScanned: result.sourcesScanned,
          executionTime: result.executionTime,
          workflowStatus: automotiveRFPWorkflow.getWorkflowStatus(),
        },
      });
    }

    // Standard discovery
    const automotiveService = new AutomotiveRFPDiscoveryService();
    const result =
      await automotiveService.discoverAutomotiveOpportunities(userId);

    return NextResponse.json({
      success: true,
      source: 'standard_get_discovery',
      data: result,
    });
  } catch (error) {
    console.error('🚨 Automotive RFP GET API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve automotive opportunities',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Apply search filters to opportunities
 */
function applySearchFilters(opportunities: any[], filters: any): any[] {
  let filtered = [...opportunities];

  // Filter by OEM
  if (filters.oem && filters.oem.length > 0) {
    filtered = filtered.filter((opp) => filters.oem.includes(opp.oem));
  }

  // Filter by contract type
  if (filters.contractType && filters.contractType.length > 0) {
    filtered = filtered.filter((opp) =>
      filters.contractType.includes(opp.contractType)
    );
  }

  // Filter by minimum value
  if (filters.minValue) {
    filtered = filtered.filter((opp) => opp.estimatedValue >= filters.minValue);
  }

  // Filter by maximum value
  if (filters.maxValue) {
    filtered = filtered.filter((opp) => opp.estimatedValue <= filters.maxValue);
  }

  // Filter by minimum win probability
  if (filters.minWinProbability) {
    filtered = filtered.filter(
      (opp) =>
        opp.competitiveFactors.winProbability >= filters.minWinProbability
    );
  }

  // Filter by location
  if (filters.location) {
    const locationFilter = filters.location.toLowerCase();
    filtered = filtered.filter(
      (opp) =>
        opp.locations.pickup.some((loc: string) =>
          loc.toLowerCase().includes(locationFilter)
        ) ||
        opp.locations.delivery.some((loc: string) =>
          loc.toLowerCase().includes(locationFilter)
        )
    );
  }

  // Filter by long-term contracts
  if (filters.longTermOnly) {
    filtered = filtered.filter((opp) => opp.specifications.isLongTerm);
  }

  // Filter by JIT requirements
  if (filters.jitOnly) {
    filtered = filtered.filter((opp) => opp.specifications.isJIT);
  }

  return filtered;
}

/**
 * Get OEM breakdown statistics
 */
function getOEMBreakdown(opportunities: any[]): Record<string, number> {
  const breakdown: Record<string, number> = {};
  opportunities.forEach((opp) => {
    breakdown[opp.oem] = (breakdown[opp.oem] || 0) + 1;
  });
  return breakdown;
}

/**
 * Get contract type breakdown statistics
 */
function getContractTypeBreakdown(
  opportunities: any[]
): Record<string, number> {
  const breakdown: Record<string, number> = {};
  opportunities.forEach((opp) => {
    breakdown[opp.contractType] = (breakdown[opp.contractType] || 0) + 1;
  });
  return breakdown;
}

/**
 * Get source breakdown statistics
 */
function getSourceBreakdown(opportunities: any[]): Record<string, number> {
  const breakdown: Record<string, number> = {};
  opportunities.forEach((opp) => {
    breakdown[opp.source] = (breakdown[opp.source] || 0) + 1;
  });
  return breakdown;
}

/**
 * Calculate average response time in days
 */
function calculateAverageResponseTime(opportunities: any[]): number {
  if (opportunities.length === 0) return 0;

  const totalDays = opportunities.reduce((sum, opp) => {
    const daysUntilDeadline = Math.ceil(
      (opp.responseDeadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return sum + Math.max(0, daysUntilDeadline);
  }, 0);

  return Math.round(totalDays / opportunities.length);
}

/**
 * Generate comprehensive fallback opportunities for system resilience
 */
function generateFallbackOpportunities(): any[] {
  return [
    {
      id: `FORD-FALLBACK-${Date.now()}`,
      title: 'F-150 Lightning Dealer Distribution Network',
      company: 'Ford Motor Company',
      oem: 'Ford',
      contractType: 'Car Hauling',
      estimatedValue: 3200000,
      contractDuration: '2 years renewable',
      responseDeadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      requirements: {
        equipment: ['Car hauler trailers', 'GPS tracking', 'Damage inspection'],
        certifications: [
          'DOT certified',
          'Ford approved carrier',
          'Insurance $2M+',
        ],
        insurance: 2000000,
        experience: '3+ years automotive vehicle transport',
        capacity: '100+ vehicles per month',
      },
      locations: {
        pickup: ['Dearborn, MI', 'Kansas City, MO', 'Louisville, KY'],
        delivery: ['Ford Dealerships - Nationwide'],
      },
      specifications: {
        isJIT: false,
        isLongTerm: true,
        requiresSpecializedEquipment: true,
        tier1Supplier: false,
        performanceMetrics: [
          '99% on-time delivery',
          'Zero damage tolerance',
          'Real-time tracking',
        ],
      },
      competitiveFactors: {
        expectedBidders: 12,
        winProbability: 0.45,
        keyDecisionFactors: [
          'Price',
          'Geographic coverage',
          'Reliability',
          'Ford relationship',
        ],
      },
      source: 'Ford Supplier Portal (Fallback)',
      portal: 'https://supplier.ford.com',
      contactInfo: {
        name: 'Logistics Procurement Team',
        email: 'logistics@ford.com',
        department: 'Vehicle Distribution',
      },
    },
    {
      id: `GM-FALLBACK-${Date.now()}`,
      title: 'EV Battery Components Expedited Transport',
      company: 'General Motors',
      oem: 'GM',
      contractType: 'Expedite',
      estimatedValue: 2100000,
      contractDuration: '18 months',
      responseDeadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      requirements: {
        equipment: [
          'Climate controlled',
          'White glove service',
          'Security protocols',
        ],
        certifications: [
          'Hazmat certified',
          'EV component handling',
          'GM approved',
        ],
        insurance: 3000000,
        experience: 'EV/Battery component transportation required',
        capacity: '24/7 emergency response capability',
      },
      locations: {
        pickup: ['Warren, MI', 'Spring Hill, TN'],
        delivery: ['GM Assembly Plants - Multiple States'],
      },
      specifications: {
        isJIT: true,
        isLongTerm: false,
        requiresSpecializedEquipment: true,
        tier1Supplier: true,
        performanceMetrics: [
          '4-hour emergency response',
          '100% secure delivery',
          'Temperature monitoring',
        ],
      },
      competitiveFactors: {
        expectedBidders: 6,
        winProbability: 0.65,
        keyDecisionFactors: [
          'Speed',
          'Security',
          'EV expertise',
          'Emergency capability',
        ],
      },
      source: 'GM SupplyPower (Fallback)',
      portal: 'https://supplier.gm.com',
      contactInfo: {
        name: 'EV Supply Chain Team',
        email: 'ev.logistics@gm.com',
        department: 'Ultium Battery Operations',
      },
    },
    {
      id: `TESLA-FALLBACK-${Date.now()}`,
      title: 'Gigafactory Texas Cross-Dock Operations',
      company: 'Tesla, Inc.',
      oem: 'Tesla',
      contractType: 'Cross-Dock',
      estimatedValue: 4800000,
      contractDuration: '1 year with renewal options',
      responseDeadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      requirements: {
        equipment: [
          'Automated cross-dock facility',
          'Tesla integration systems',
          'Sustainability compliance',
        ],
        certifications: [
          'Tesla supplier certified',
          'ISO 14001',
          'Lean operations',
        ],
        insurance: 5000000,
        experience: 'High-volume automotive cross-docking',
        capacity: '1000+ units daily processing',
      },
      locations: {
        pickup: ['Austin, TX Gigafactory'],
        delivery: ['Tesla Service Centers - Regional'],
      },
      specifications: {
        isJIT: true,
        isLongTerm: false,
        requiresSpecializedEquipment: true,
        tier1Supplier: false,
        performanceMetrics: [
          'Zero defects',
          'Sustainability targets',
          '100% uptime',
        ],
      },
      competitiveFactors: {
        expectedBidders: 4,
        winProbability: 0.55,
        keyDecisionFactors: [
          'Innovation',
          'Sustainability',
          'Tesla alignment',
          'Scalability',
        ],
      },
      source: 'Tesla Supplier Network (Fallback)',
      portal: 'https://supplier-portal.tesla.com',
      contactInfo: {
        name: 'Gigafactory Operations',
        email: 'giga.logistics@tesla.com',
        department: 'Texas Operations',
      },
    },
  ];
}
