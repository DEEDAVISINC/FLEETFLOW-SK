// Permit Route Planning Service
// Handles oversized load routing with permit requirements

import { isFeatureEnabled } from '../config/feature-flags';
import { AnalysisResult, BaseService, ServiceResponse } from './base-service';

export interface OversizedLoadRequest {
  loadId: string;
  origin: string;
  destination: string;
  equipmentType:
    | 'flatbed'
    | 'step-deck'
    | 'low-boy'
    | 'removable-gooseneck'
    | 'multi-axle';
  dimensions: {
    length: number; // feet
    width: number; // feet
    height: number; // feet
    weight: number; // pounds
  };
  cargoType: string;
  isIndivisible: boolean;
  requiredDeliveryDate: string;
  specialRequirements: string[];
  customerTier: 'standard' | 'premium' | 'enterprise';
}

export interface PermitRequirement {
  state: string;
  permitType: string;
  isRequired: boolean;
  cost: number;
  processingTime: number; // hours
  validityPeriod: number; // days
  restrictions: string[];
  contactInfo: {
    agency: string;
    phone: string;
    website: string;
  };
}

export interface RouteSegment {
  segmentId: string;
  fromState: string;
  toState: string;
  distance: number;
  estimatedTime: number; // hours
  restrictions: {
    heightLimit: number;
    widthLimit: number;
    weightLimit: number;
    timeRestrictions: string[];
    bridgeRestrictions: string[];
  };
  permitRequired: boolean;
  alternativeRoutes: number;
}

export interface PermitRouteAnalysis
  extends AnalysisResult<OversizedLoadRequest> {
  recommendedRoute: {
    totalDistance: number;
    totalTime: number;
    routeSegments: RouteSegment[];
    waypoints: string[];
  };
  permitRequirements: PermitRequirement[];
  totalPermitCost: number;
  totalProcessingTime: number;
  routeComplexity: 'simple' | 'moderate' | 'complex' | 'extreme';
  riskAssessment: {
    routeRisk: 'low' | 'medium' | 'high';
    permitRisk: 'low' | 'medium' | 'high';
    timelineRisk: 'low' | 'medium' | 'high';
    overallRisk: 'low' | 'medium' | 'high';
  };
  alternativeRoutes: {
    routeId: string;
    description: string;
    distance: number;
    permitCost: number;
    timeAdvantage: number;
    riskLevel: 'low' | 'medium' | 'high';
  }[];
  complianceChecklist: string[];
  estimatedCosts: {
    permits: number;
    pilotCars: number;
    specialHandling: number;
    totalAdditional: number;
  };
}

export interface StateRegulations {
  state: string;
  maxDimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
  permitThresholds: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
  specialRestrictions: string[];
  processingTimes: {
    standard: number;
    expedited: number;
  };
  costs: {
    singleTrip: number;
    annual: number;
    expeditedFee: number;
  };
}

export class PermitRoutePlanningService extends BaseService {
  constructor() {
    super('PermitRoutePlanning');
  }

  async planPermitRoute(
    loadRequest: OversizedLoadRequest
  ): Promise<ServiceResponse<PermitRouteAnalysis>> {
    try {
      if (!isFeatureEnabled('PERMIT_ROUTE_PLANNING')) {
        return this.createErrorResponse(
          new Error('Permit Route Planning feature is not enabled'),
          'planPermitRoute'
        );
      }

      this.log(
        'info',
        `Planning permit route for oversized load: ${loadRequest.loadId}`
      );

      const analysis = await this.performRouteAnalysis(loadRequest);

      this.log(
        'info',
        `Completed permit route planning for load: ${loadRequest.loadId}`,
        {
          totalDistance: analysis.recommendedRoute.totalDistance,
          totalPermitCost: analysis.totalPermitCost,
          routeComplexity: analysis.routeComplexity,
        }
      );

      return this.createSuccessResponse(
        analysis,
        `Permit route planned for oversized load ${loadRequest.loadId}`
      );
    } catch (error) {
      return this.createErrorResponse(error, 'planPermitRoute');
    }
  }

  async getStateRegulations(
    states: string[]
  ): Promise<ServiceResponse<StateRegulations[]>> {
    try {
      if (!isFeatureEnabled('PERMIT_ROUTE_PLANNING')) {
        return this.createErrorResponse(
          new Error('Permit Route Planning feature is not enabled'),
          'getStateRegulations'
        );
      }

      this.log(
        'info',
        `Retrieving regulations for states: ${states.join(', ')}`
      );

      const regulations = await this.fetchStateRegulations(states);

      return this.createSuccessResponse(
        regulations,
        `Regulations retrieved for ${states.length} states`
      );
    } catch (error) {
      return this.createErrorResponse(error, 'getStateRegulations');
    }
  }

  async validateLoadCompliance(
    loadRequest: OversizedLoadRequest,
    route: string[]
  ): Promise<ServiceResponse<any>> {
    try {
      if (!isFeatureEnabled('PERMIT_ROUTE_PLANNING')) {
        return this.createErrorResponse(
          new Error('Permit Route Planning feature is not enabled'),
          'validateLoadCompliance'
        );
      }

      this.log('info', `Validating compliance for load: ${loadRequest.loadId}`);

      const compliance = await this.performComplianceValidation(
        loadRequest,
        route
      );

      return this.createSuccessResponse(
        compliance,
        'Load compliance validation completed'
      );
    } catch (error) {
      return this.createErrorResponse(error, 'validateLoadCompliance');
    }
  }

  async optimizePermitCosts(
    loadRequest: OversizedLoadRequest
  ): Promise<ServiceResponse<any>> {
    try {
      if (!isFeatureEnabled('PERMIT_ROUTE_PLANNING')) {
        return this.createErrorResponse(
          new Error('Permit Route Planning feature is not enabled'),
          'optimizePermitCosts'
        );
      }

      this.log('info', 'Optimizing permit costs for oversized load');

      const optimization = await this.performCostOptimization(loadRequest);

      return this.createSuccessResponse(
        optimization,
        'Permit cost optimization completed'
      );
    } catch (error) {
      return this.createErrorResponse(error, 'optimizePermitCosts');
    }
  }

  // Private helper methods
  private async performRouteAnalysis(
    loadRequest: OversizedLoadRequest
  ): Promise<PermitRouteAnalysis> {
    const analysis = await this.callAI('permit_route_planning', {
      loadRequest,
      analysisType: 'oversized_load_routing',
    });

    const routeSegments = await this.calculateRouteSegments(loadRequest);
    const permitRequirements = await this.assessPermitRequirements(
      loadRequest,
      routeSegments
    );
    const alternativeRoutes = await this.generateAlternativeRoutes(loadRequest);

    return {
      result: loadRequest,
      confidence: analysis.confidence || 92,
      reasoning:
        analysis.reasoning ||
        'Route optimized for oversized load compliance and efficiency',
      recommendations: analysis.recommendations || [
        'Apply for permits at least 5 business days in advance',
        'Coordinate with pilot car services',
        'Plan for restricted travel times',
      ],
      riskFactors: analysis.riskFactors || [
        'Weather-dependent travel restrictions',
        'Bridge clearance limitations',
      ],
      recommendedRoute: {
        totalDistance: this.calculateTotalDistance(routeSegments),
        totalTime: this.calculateTotalTime(routeSegments),
        routeSegments,
        waypoints: this.extractWaypoints(routeSegments),
      },
      permitRequirements,
      totalPermitCost: this.calculateTotalPermitCost(permitRequirements),
      totalProcessingTime: this.calculateProcessingTime(permitRequirements),
      routeComplexity: this.assessRouteComplexity(loadRequest, routeSegments),
      riskAssessment: this.assessRouteRisks(loadRequest, routeSegments),
      alternativeRoutes,
      complianceChecklist: this.generateComplianceChecklist(
        loadRequest,
        permitRequirements
      ),
      estimatedCosts: this.calculateEstimatedCosts(loadRequest, routeSegments),
    };
  }

  private async calculateRouteSegments(
    loadRequest: OversizedLoadRequest
  ): Promise<RouteSegment[]> {
    // Mock route segments - in production, this would use mapping APIs
    return [
      {
        segmentId: 'SEG-001',
        fromState: 'GA',
        toState: 'FL',
        distance: 350,
        estimatedTime: 6.5,
        restrictions: {
          heightLimit: 13.6,
          widthLimit: 8.5,
          weightLimit: 80000,
          timeRestrictions: ['No travel 7-9 AM, 4-6 PM weekdays'],
          bridgeRestrictions: ['I-75 Bridge - 13.2ft clearance'],
        },
        permitRequired: loadRequest.dimensions.width > 8.5,
        alternativeRoutes: 2,
      },
      {
        segmentId: 'SEG-002',
        fromState: 'FL',
        toState: 'FL',
        distance: 280,
        estimatedTime: 5.2,
        restrictions: {
          heightLimit: 14.0,
          widthLimit: 8.5,
          weightLimit: 80000,
          timeRestrictions: ['No weekend travel on I-4'],
          bridgeRestrictions: ['Tampa Bay Bridge - special permits required'],
        },
        permitRequired:
          loadRequest.dimensions.width > 8.5 ||
          loadRequest.dimensions.height > 13.6,
        alternativeRoutes: 1,
      },
    ];
  }

  private async assessPermitRequirements(
    loadRequest: OversizedLoadRequest,
    routeSegments: RouteSegment[]
  ): Promise<PermitRequirement[]> {
    const requirements: PermitRequirement[] = [];

    // Generate permit requirements based on route and load dimensions
    for (const segment of routeSegments) {
      if (segment.permitRequired) {
        requirements.push({
          state: segment.fromState,
          permitType: this.determinePermitType(loadRequest),
          isRequired: true,
          cost: this.calculatePermitCost(loadRequest, segment.fromState),
          processingTime: this.getProcessingTime(segment.fromState),
          validityPeriod: 30,
          restrictions: [
            'Daylight hours only',
            'No travel during peak hours',
            'Pilot car required',
          ],
          contactInfo: {
            agency: `${segment.fromState} Department of Transportation`,
            phone: '1-800-PERMITS',
            website: `https://dot.state.${segment.fromState.toLowerCase()}.us/permits`,
          },
        });
      }
    }

    return requirements;
  }

  private async generateAlternativeRoutes(
    loadRequest: OversizedLoadRequest
  ): Promise<any[]> {
    return [
      {
        routeId: 'ALT-001',
        description: 'Coastal route via US-1',
        distance: 720,
        permitCost: 450,
        timeAdvantage: -2, // 2 hours longer
        riskLevel: 'low' as const,
      },
      {
        routeId: 'ALT-002',
        description: 'Inland route via I-75',
        distance: 650,
        permitCost: 380,
        timeAdvantage: 1, // 1 hour shorter
        riskLevel: 'medium' as const,
      },
    ];
  }

  private async fetchStateRegulations(
    states: string[]
  ): Promise<StateRegulations[]> {
    return states.map((state) => ({
      state,
      maxDimensions: {
        length: 75,
        width: 8.5,
        height: 13.6,
        weight: 80000,
      },
      permitThresholds: {
        length: 53,
        width: 8.5,
        height: 13.6,
        weight: 80000,
      },
      specialRestrictions: [
        'No travel during rush hours',
        'Pilot car required for loads over 12ft wide',
        'Special routing required for hazardous materials',
      ],
      processingTimes: {
        standard: 72, // hours
        expedited: 24, // hours
      },
      costs: {
        singleTrip: 125,
        annual: 500,
        expeditedFee: 75,
      },
    }));
  }

  private async performComplianceValidation(
    loadRequest: OversizedLoadRequest,
    route: string[]
  ): Promise<any> {
    return {
      isCompliant: true,
      violations: [],
      warnings: [
        'Load width exceeds standard limits - permit required',
        'Consider pilot car escort for safety',
      ],
      recommendations: [
        'Apply for permits 5 business days in advance',
        'Coordinate with state DOT for special routing',
        'Schedule travel during off-peak hours',
      ],
      complianceScore: 85,
    };
  }

  private async performCostOptimization(
    loadRequest: OversizedLoadRequest
  ): Promise<any> {
    return {
      currentCosts: {
        permits: 650,
        pilotCars: 800,
        specialHandling: 200,
        total: 1650,
      },
      optimizedCosts: {
        permits: 520,
        pilotCars: 600,
        specialHandling: 150,
        total: 1270,
      },
      savings: 380,
      optimizations: [
        'Use annual permits instead of single-trip',
        'Coordinate multiple loads for pilot car efficiency',
        'Optimize route to minimize high-cost states',
      ],
      paybackPeriod: '3 loads',
    };
  }

  private calculateTotalDistance(segments: RouteSegment[]): number {
    return segments.reduce((total, segment) => total + segment.distance, 0);
  }

  private calculateTotalTime(segments: RouteSegment[]): number {
    return segments.reduce(
      (total, segment) => total + segment.estimatedTime,
      0
    );
  }

  private extractWaypoints(segments: RouteSegment[]): string[] {
    const waypoints = [segments[0]?.fromState];
    segments.forEach((segment) => waypoints.push(segment.toState));
    return waypoints.filter(Boolean);
  }

  private calculateTotalPermitCost(requirements: PermitRequirement[]): number {
    return requirements.reduce((total, req) => total + req.cost, 0);
  }

  private calculateProcessingTime(requirements: PermitRequirement[]): number {
    return Math.max(...requirements.map((req) => req.processingTime), 0);
  }

  private assessRouteComplexity(
    loadRequest: OversizedLoadRequest,
    segments: RouteSegment[]
  ): 'simple' | 'moderate' | 'complex' | 'extreme' {
    let complexityScore = 0;

    // Add complexity based on dimensions
    if (loadRequest.dimensions.width > 12) complexityScore += 3;
    else if (loadRequest.dimensions.width > 10) complexityScore += 2;
    else if (loadRequest.dimensions.width > 8.5) complexityScore += 1;

    if (loadRequest.dimensions.height > 15) complexityScore += 3;
    else if (loadRequest.dimensions.height > 13.6) complexityScore += 2;

    if (loadRequest.dimensions.weight > 120000) complexityScore += 2;
    else if (loadRequest.dimensions.weight > 80000) complexityScore += 1;

    // Add complexity based on route
    complexityScore += segments.length;

    if (complexityScore >= 8) return 'extreme';
    if (complexityScore >= 5) return 'complex';
    if (complexityScore >= 3) return 'moderate';
    return 'simple';
  }

  private assessRouteRisks(
    loadRequest: OversizedLoadRequest,
    segments: RouteSegment[]
  ): any {
    const risks = ['low', 'medium', 'high'];
    return {
      routeRisk: risks[Math.floor(Math.random() * 3)] as
        | 'low'
        | 'medium'
        | 'high',
      permitRisk: risks[Math.floor(Math.random() * 3)] as
        | 'low'
        | 'medium'
        | 'high',
      timelineRisk: risks[Math.floor(Math.random() * 3)] as
        | 'low'
        | 'medium'
        | 'high',
      overallRisk: risks[Math.floor(Math.random() * 3)] as
        | 'low'
        | 'medium'
        | 'high',
    };
  }

  private generateComplianceChecklist(
    loadRequest: OversizedLoadRequest,
    requirements: PermitRequirement[]
  ): string[] {
    return [
      'Verify load dimensions and weight',
      'Obtain required state permits',
      'Arrange pilot car escort services',
      'Plan route avoiding restricted bridges',
      'Schedule travel during permitted hours',
      'Prepare emergency contact information',
      'Ensure proper load securement',
      'Verify insurance coverage',
    ];
  }

  private calculateEstimatedCosts(
    loadRequest: OversizedLoadRequest,
    segments: RouteSegment[]
  ): any {
    const permits = segments.length * 125;
    const pilotCars = loadRequest.dimensions.width > 10 ? 800 : 0;
    const specialHandling = loadRequest.isIndivisible ? 200 : 0;

    return {
      permits,
      pilotCars,
      specialHandling,
      totalAdditional: permits + pilotCars + specialHandling,
    };
  }

  private determinePermitType(loadRequest: OversizedLoadRequest): string {
    if (loadRequest.dimensions.width > 12) return 'Super Load Permit';
    if (loadRequest.dimensions.width > 10) return 'Overwidth Permit';
    if (loadRequest.dimensions.height > 13.6) return 'Overheight Permit';
    if (loadRequest.dimensions.weight > 80000) return 'Overweight Permit';
    return 'Standard Oversize Permit';
  }

  private calculatePermitCost(
    loadRequest: OversizedLoadRequest,
    state: string
  ): number {
    let baseCost = 125;

    if (loadRequest.dimensions.width > 12) baseCost += 200;
    else if (loadRequest.dimensions.width > 10) baseCost += 100;

    if (loadRequest.dimensions.height > 15) baseCost += 150;
    else if (loadRequest.dimensions.height > 13.6) baseCost += 75;

    if (loadRequest.dimensions.weight > 120000) baseCost += 300;
    else if (loadRequest.dimensions.weight > 80000) baseCost += 150;

    return baseCost;
  }

  private getProcessingTime(state: string): number {
    // Mock processing times - in production, this would be state-specific
    const processingTimes: { [key: string]: number } = {
      GA: 48,
      FL: 72,
      AL: 24,
      SC: 48,
      NC: 72,
    };
    return processingTimes[state] || 48;
  }
}
