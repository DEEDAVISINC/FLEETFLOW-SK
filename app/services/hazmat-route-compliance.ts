// Hazmat Route Compliance Service
// Handles dangerous goods routing with regulatory compliance

import { isFeatureEnabled } from '../config/feature-flags';
import { AnalysisResult, BaseService, ServiceResponse } from './base-service';

export interface HazmatLoadRequest {
  loadId: string;
  origin: string;
  destination: string;
  hazmatClass: string; // UN Class (1-9)
  unNumber: string; // UN identification number
  properShippingName: string;
  packingGroup: 'I' | 'II' | 'III'; // Danger level
  quantity: number;
  unitOfMeasure: 'kg' | 'lbs' | 'liters' | 'gallons';
  equipmentType: 'dry-van' | 'tank' | 'flatbed' | 'specialized';
  requiredDeliveryDate: string;
  emergencyContact: {
    name: string;
    phone: string;
    company: string;
  };
  customerTier: 'standard' | 'premium' | 'enterprise';
  specialInstructions?: string;
}

export interface HazmatRegulation {
  jurisdiction: string; // Federal, State, Local
  authority: string; // DOT, EPA, OSHA, etc.
  regulationType:
    | 'routing'
    | 'documentation'
    | 'equipment'
    | 'training'
    | 'emergency';
  requirement: string;
  isRequired: boolean;
  penalty: string;
  referenceCode: string;
  lastUpdated: string;
}

export interface RouteRestriction {
  restrictionId: string;
  type: 'tunnel' | 'bridge' | 'populated_area' | 'time_based' | 'seasonal';
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  affectedClasses: string[]; // Which hazmat classes are restricted
  timeRestrictions?: {
    startTime: string;
    endTime: string;
    daysOfWeek: string[];
  };
  alternativeRoute: string;
  description: string;
}

export interface HazmatRouteAnalysis extends AnalysisResult<HazmatLoadRequest> {
  complianceStatus:
    | 'compliant'
    | 'violations'
    | 'requires_permits'
    | 'prohibited';
  recommendedRoute: {
    totalDistance: number;
    totalTime: number;
    routeSegments: string[];
    avoidedRestrictions: RouteRestriction[];
    requiredStops: string[]; // Rest stops, inspection points
  };
  regulatoryRequirements: HazmatRegulation[];
  requiredDocuments: string[];
  equipmentRequirements: string[];
  driverRequirements: {
    hazmatEndorsement: boolean;
    specialTraining: string[];
    medicalCertification: boolean;
  };
  routeRestrictions: RouteRestriction[];
  emergencyProcedures: string[];
  estimatedCosts: {
    permits: number;
    specialEquipment: number;
    driverTraining: number;
    insurance: number;
    totalAdditional: number;
  };
  riskAssessment: {
    environmentalRisk: 'low' | 'medium' | 'high';
    publicSafetyRisk: 'low' | 'medium' | 'high';
    transportationRisk: 'low' | 'medium' | 'high';
    overallRisk: 'low' | 'medium' | 'high';
  };
  complianceChecklist: string[];
}

export interface HazmatClassification {
  class: string;
  division?: string;
  description: string;
  examples: string[];
  specialRequirements: string[];
  routingRestrictions: string[];
  packingGroupRequired: boolean;
}

export class HazmatRouteComplianceService extends BaseService {
  constructor() {
    super('HazmatRouteCompliance');
  }

  async analyzeHazmatRoute(
    loadRequest: HazmatLoadRequest
  ): Promise<ServiceResponse<HazmatRouteAnalysis>> {
    try {
      if (!isFeatureEnabled('HAZMAT_ROUTE_COMPLIANCE')) {
        return this.createErrorResponse(
          new Error('Hazmat Route Compliance feature is not enabled'),
          'analyzeHazmatRoute'
        );
      }

      this.log(
        'info',
        `Analyzing hazmat route for load: ${loadRequest.loadId} (UN${loadRequest.unNumber})`
      );

      const analysis = await this.performHazmatAnalysis(loadRequest);

      this.log(
        'info',
        `Completed hazmat route analysis for load: ${loadRequest.loadId}`,
        {
          complianceStatus: analysis.complianceStatus,
          hazmatClass: loadRequest.hazmatClass,
          overallRisk: analysis.riskAssessment.overallRisk,
        }
      );

      return this.createSuccessResponse(
        analysis,
        `Hazmat route compliance analyzed for load ${loadRequest.loadId}`
      );
    } catch (error) {
      return this.createErrorResponse(error, 'analyzeHazmatRoute');
    }
  }

  async getHazmatRegulations(
    hazmatClass: string,
    states: string[]
  ): Promise<ServiceResponse<HazmatRegulation[]>> {
    try {
      if (!isFeatureEnabled('HAZMAT_ROUTE_COMPLIANCE')) {
        return this.createErrorResponse(
          new Error('Hazmat Route Compliance feature is not enabled'),
          'getHazmatRegulations'
        );
      }

      this.log(
        'info',
        `Retrieving hazmat regulations for class ${hazmatClass} in states: ${states.join(', ')}`
      );

      const regulations = await this.fetchHazmatRegulations(
        hazmatClass,
        states
      );

      return this.createSuccessResponse(
        regulations,
        `Regulations retrieved for hazmat class ${hazmatClass}`
      );
    } catch (error) {
      return this.createErrorResponse(error, 'getHazmatRegulations');
    }
  }

  async validateHazmatCompliance(
    loadRequest: HazmatLoadRequest
  ): Promise<ServiceResponse<any>> {
    try {
      if (!isFeatureEnabled('HAZMAT_ROUTE_COMPLIANCE')) {
        return this.createErrorResponse(
          new Error('Hazmat Route Compliance feature is not enabled'),
          'validateHazmatCompliance'
        );
      }

      this.log(
        'info',
        `Validating hazmat compliance for load: ${loadRequest.loadId}`
      );

      const validation = await this.performComplianceValidation(loadRequest);

      return this.createSuccessResponse(
        validation,
        'Hazmat compliance validation completed'
      );
    } catch (error) {
      return this.createErrorResponse(error, 'validateHazmatCompliance');
    }
  }

  async getHazmatClassifications(): Promise<
    ServiceResponse<HazmatClassification[]>
  > {
    try {
      if (!isFeatureEnabled('HAZMAT_ROUTE_COMPLIANCE')) {
        return this.createErrorResponse(
          new Error('Hazmat Route Compliance feature is not enabled'),
          'getHazmatClassifications'
        );
      }

      this.log('info', 'Retrieving hazmat classifications');

      const classifications = await this.getHazmatClasses();

      return this.createSuccessResponse(
        classifications,
        `${classifications.length} hazmat classifications retrieved`
      );
    } catch (error) {
      return this.createErrorResponse(error, 'getHazmatClassifications');
    }
  }

  // Private helper methods
  private async performHazmatAnalysis(
    loadRequest: HazmatLoadRequest
  ): Promise<HazmatRouteAnalysis> {
    const analysis = await this.callAI('hazmat_route_compliance', {
      loadRequest,
      analysisType: 'hazmat_routing_compliance',
    });

    const regulations = await this.fetchHazmatRegulations(
      loadRequest.hazmatClass,
      ['federal'] // Start with federal, expand to states
    );

    const routeRestrictions = await this.identifyRouteRestrictions(loadRequest);
    const complianceStatus = this.determineComplianceStatus(
      loadRequest,
      regulations
    );

    return {
      result: loadRequest,
      confidence: analysis.confidence || 95,
      reasoning:
        analysis.reasoning ||
        'Route analyzed for hazmat compliance and safety requirements',
      recommendations: analysis.recommendations || [
        'Verify driver has current hazmat endorsement',
        'Ensure all required documentation is complete',
        'Plan for required rest stops and inspections',
      ],
      riskFactors: analysis.riskFactors || [
        'Hazardous material transportation',
        'Regulatory compliance requirements',
      ],
      complianceStatus,
      recommendedRoute: {
        totalDistance: this.calculateRouteDistance(loadRequest),
        totalTime: this.calculateRouteTime(loadRequest),
        routeSegments: this.generateRouteSegments(loadRequest),
        avoidedRestrictions: routeRestrictions.filter((r) =>
          r.affectedClasses.includes(loadRequest.hazmatClass)
        ),
        requiredStops: this.identifyRequiredStops(loadRequest),
      },
      regulatoryRequirements: regulations,
      requiredDocuments: this.getRequiredDocuments(loadRequest),
      equipmentRequirements: this.getEquipmentRequirements(loadRequest),
      driverRequirements: {
        hazmatEndorsement: true,
        specialTraining: this.getRequiredTraining(loadRequest),
        medicalCertification: loadRequest.hazmatClass === '1', // Explosives require medical cert
      },
      routeRestrictions,
      emergencyProcedures: this.getEmergencyProcedures(loadRequest),
      estimatedCosts: this.calculateHazmatCosts(loadRequest),
      riskAssessment: this.assessHazmatRisks(loadRequest),
      complianceChecklist: this.generateComplianceChecklist(loadRequest),
    };
  }

  private async fetchHazmatRegulations(
    hazmatClass: string,
    states: string[]
  ): Promise<HazmatRegulation[]> {
    // Mock regulations - in production, this would fetch from regulatory databases
    return [
      {
        jurisdiction: 'Federal',
        authority: 'DOT/PHMSA',
        regulationType: 'routing',
        requirement: 'Use designated hazmat routes where available',
        isRequired: true,
        penalty: 'Up to $79,976 per violation',
        referenceCode: '49 CFR 397.101',
        lastUpdated: '2024-01-01',
      },
      {
        jurisdiction: 'Federal',
        authority: 'DOT/FMCSA',
        regulationType: 'documentation',
        requirement: 'Shipping papers must accompany hazmat shipments',
        isRequired: true,
        penalty: 'Up to $1,916 per violation',
        referenceCode: '49 CFR 172.200',
        lastUpdated: '2024-01-01',
      },
      {
        jurisdiction: 'Federal',
        authority: 'DOT/PHMSA',
        regulationType: 'equipment',
        requirement: 'Proper placarding required for hazmat vehicles',
        isRequired: true,
        penalty: 'Up to $79,976 per violation',
        referenceCode: '49 CFR 172.500',
        lastUpdated: '2024-01-01',
      },
    ];
  }

  private async identifyRouteRestrictions(
    loadRequest: HazmatLoadRequest
  ): Promise<RouteRestriction[]> {
    return [
      {
        restrictionId: 'TUNNEL-001',
        type: 'tunnel',
        location: 'Holland Tunnel, NY-NJ',
        coordinates: { lat: 40.7281, lng: -74.0176 },
        affectedClasses: ['1', '2', '3'],
        alternativeRoute: 'George Washington Bridge',
        description: 'No hazmat classes 1, 2, or 3 permitted through tunnel',
      },
      {
        restrictionId: 'TIME-001',
        type: 'time_based',
        location: 'I-95 through Washington DC',
        coordinates: { lat: 38.9072, lng: -77.0369 },
        affectedClasses: ['1', '7', '8'],
        timeRestrictions: {
          startTime: '06:00',
          endTime: '10:00',
          daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        },
        alternativeRoute: 'I-495 Beltway',
        description: 'No hazmat during rush hours on weekdays',
      },
    ];
  }

  private async performComplianceValidation(
    loadRequest: HazmatLoadRequest
  ): Promise<any> {
    return {
      isCompliant:
        this.determineComplianceStatus(loadRequest, []) === 'compliant',
      violations: this.identifyViolations(loadRequest),
      warnings: [
        'Ensure driver has current hazmat endorsement',
        'Verify emergency response information is current',
      ],
      recommendations: [
        'Complete pre-trip inspection checklist',
        'Review emergency procedures with driver',
        'Confirm route restrictions have been checked',
      ],
      complianceScore: this.calculateComplianceScore(loadRequest),
    };
  }

  private async getHazmatClasses(): Promise<HazmatClassification[]> {
    return [
      {
        class: '1',
        description: 'Explosives',
        examples: ['Ammunition', 'Fireworks', 'Flares'],
        specialRequirements: [
          'Special driver training required',
          'Route restrictions apply',
          'Tunnel restrictions',
        ],
        routingRestrictions: [
          'Avoid populated areas',
          'No tunnels',
          'Designated routes only',
        ],
        packingGroupRequired: false,
      },
      {
        class: '2',
        description: 'Gases',
        examples: ['Propane', 'Oxygen', 'Helium'],
        specialRequirements: [
          'Proper ventilation required',
          'Temperature monitoring',
        ],
        routingRestrictions: ['Tunnel restrictions may apply'],
        packingGroupRequired: false,
      },
      {
        class: '3',
        description: 'Flammable Liquids',
        examples: ['Gasoline', 'Alcohol', 'Paint'],
        specialRequirements: ['Fire extinguisher required', 'No smoking areas'],
        routingRestrictions: ['Some tunnel restrictions'],
        packingGroupRequired: true,
      },
      {
        class: '4',
        description: 'Flammable Solids',
        examples: ['Matches', 'Sulfur', 'Metal powders'],
        specialRequirements: ['Keep dry', 'Avoid friction'],
        routingRestrictions: ['Limited restrictions'],
        packingGroupRequired: true,
      },
      {
        class: '5',
        description: 'Oxidizers and Organic Peroxides',
        examples: ['Hydrogen peroxide', 'Ammonium nitrate'],
        specialRequirements: [
          'Segregation from other materials',
          'Temperature control',
        ],
        routingRestrictions: ['Some restrictions apply'],
        packingGroupRequired: true,
      },
      {
        class: '6',
        description: 'Toxic and Infectious Substances',
        examples: ['Pesticides', 'Medical waste'],
        specialRequirements: [
          'Special handling procedures',
          'Emergency response plan',
        ],
        routingRestrictions: ['Avoid populated areas'],
        packingGroupRequired: true,
      },
      {
        class: '7',
        description: 'Radioactive Materials',
        examples: ['Medical isotopes', 'Uranium'],
        specialRequirements: [
          'Radiation safety training',
          'Special documentation',
          'Security requirements',
        ],
        routingRestrictions: [
          'Designated routes only',
          'Security escorts may be required',
        ],
        packingGroupRequired: false,
      },
      {
        class: '8',
        description: 'Corrosive Materials',
        examples: ['Battery acid', 'Bleach'],
        specialRequirements: [
          'Spill containment',
          'Personal protective equipment',
        ],
        routingRestrictions: ['Limited restrictions'],
        packingGroupRequired: true,
      },
      {
        class: '9',
        description: 'Miscellaneous Dangerous Goods',
        examples: ['Dry ice', 'Lithium batteries'],
        specialRequirements: ['Varies by specific material'],
        routingRestrictions: ['Varies by specific material'],
        packingGroupRequired: false,
      },
    ];
  }

  private determineComplianceStatus(
    loadRequest: HazmatLoadRequest,
    regulations: HazmatRegulation[]
  ): 'compliant' | 'violations' | 'requires_permits' | 'prohibited' {
    // Mock compliance determination
    if (loadRequest.hazmatClass === '1' && loadRequest.packingGroup === 'I') {
      return 'requires_permits';
    }
    if (loadRequest.hazmatClass === '7') {
      return 'requires_permits';
    }
    return 'compliant';
  }

  private calculateRouteDistance(loadRequest: HazmatLoadRequest): number {
    // Mock distance calculation
    return Math.floor(Math.random() * 1000) + 200;
  }

  private calculateRouteTime(loadRequest: HazmatLoadRequest): number {
    // Mock time calculation (hours)
    return Math.floor(Math.random() * 20) + 5;
  }

  private generateRouteSegments(loadRequest: HazmatLoadRequest): string[] {
    return [
      `${loadRequest.origin} → Interstate Highway`,
      'Interstate Highway → Designated Hazmat Route',
      `Designated Hazmat Route → ${loadRequest.destination}`,
    ];
  }

  private identifyRequiredStops(loadRequest: HazmatLoadRequest): string[] {
    const stops = ['DOT Inspection Point'];
    if (loadRequest.hazmatClass === '7') {
      stops.push('Security Checkpoint');
    }
    return stops;
  }

  private getRequiredDocuments(loadRequest: HazmatLoadRequest): string[] {
    return [
      'Shipping Papers',
      'Emergency Response Information',
      'Driver Training Certificate',
      'Hazmat Endorsement',
      'Vehicle Inspection Report',
    ];
  }

  private getEquipmentRequirements(loadRequest: HazmatLoadRequest): string[] {
    const requirements = [
      'Proper placarding',
      'Fire extinguisher',
      'Spill kit',
      'Emergency equipment',
    ];

    if (loadRequest.equipmentType === 'tank') {
      requirements.push('Tank inspection certificate');
    }

    return requirements;
  }

  private getRequiredTraining(loadRequest: HazmatLoadRequest): string[] {
    const training = ['General hazmat training', 'Security awareness'];

    if (loadRequest.hazmatClass === '1') {
      training.push('Explosives handling certification');
    }
    if (loadRequest.hazmatClass === '7') {
      training.push('Radiation safety training');
    }

    return training;
  }

  private getEmergencyProcedures(loadRequest: HazmatLoadRequest): string[] {
    return [
      'Contact emergency services immediately',
      'Notify CHEMTREC: 1-800-424-9300',
      'Evacuate area if necessary',
      'Follow material-specific response procedures',
      'Notify shipper and consignee',
    ];
  }

  private calculateHazmatCosts(loadRequest: HazmatLoadRequest): any {
    const permits = loadRequest.hazmatClass === '7' ? 500 : 0;
    const specialEquipment = 200;
    const driverTraining = 300;
    const insurance = 150;

    return {
      permits,
      specialEquipment,
      driverTraining,
      insurance,
      totalAdditional: permits + specialEquipment + driverTraining + insurance,
    };
  }

  private assessHazmatRisks(loadRequest: HazmatLoadRequest): any {
    const riskLevels = ['low', 'medium', 'high'];

    // Higher risk for more dangerous classes
    const riskIndex = ['1', '7'].includes(loadRequest.hazmatClass)
      ? 2
      : ['2', '3', '6'].includes(loadRequest.hazmatClass)
        ? 1
        : 0;

    return {
      environmentalRisk: riskLevels[riskIndex] as 'low' | 'medium' | 'high',
      publicSafetyRisk: riskLevels[riskIndex] as 'low' | 'medium' | 'high',
      transportationRisk: riskLevels[Math.min(riskIndex + 1, 2)] as
        | 'low'
        | 'medium'
        | 'high',
      overallRisk: riskLevels[riskIndex] as 'low' | 'medium' | 'high',
    };
  }

  private generateComplianceChecklist(
    loadRequest: HazmatLoadRequest
  ): string[] {
    return [
      'Verify driver has current hazmat endorsement',
      'Complete shipping papers with all required information',
      'Install proper placards on vehicle',
      'Load emergency response equipment',
      'Brief driver on emergency procedures',
      'Check route for restrictions and closures',
      'Verify insurance coverage for hazmat transport',
      'Complete pre-trip vehicle inspection',
    ];
  }

  private identifyViolations(loadRequest: HazmatLoadRequest): string[] {
    // Mock violation identification
    return [];
  }

  private calculateComplianceScore(loadRequest: HazmatLoadRequest): number {
    // Mock compliance scoring
    return Math.floor(Math.random() * 20) + 80; // 80-100
  }
}
