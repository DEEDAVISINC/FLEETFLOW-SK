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
 * Generate empty array - no mock data for production readiness
 */
function generateFallbackOpportunities(): any[] {
  return [];
}
