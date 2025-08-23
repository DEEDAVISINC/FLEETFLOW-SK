/**
 * Weight Evaluation Service for FleetFlow
 * Comprehensive axle-based weight calculations and DOT compliance validation
 * Ensures proper load assignment based on truck configurations and weight limits
 */

export interface TruckAxleConfiguration {
  id: string;
  name: string;
  description: string;
  totalAxles: number;
  steerAxles: number;
  driveAxles: number;
  trailerAxles: number;
  maxGrossWeight: number; // pounds
  maxSteerAxleWeight: number;
  maxDriveAxleWeight: number;
  maxTrailerAxleWeight: number;
  bridgeFormulaRequired: boolean;
  commonTrailerTypes: string[];
}

export interface WeightDistribution {
  steerAxleWeight: number;
  driveAxleWeight: number;
  trailerAxleWeight: number;
  totalWeight: number;
  cargoWeight: number;
  tractorWeight: number;
  trailerWeight: number;
}

export interface WeightEvaluationResult {
  isCompliant: boolean;
  violations: WeightViolation[];
  recommendations: string[];
  maxAllowableWeight: number;
  bridgeFormulaCompliant: boolean;
  stateSpecificLimits: StateWeightLimits[];
  requiredPermits: string[];
  safetyRating: 'SAFE' | 'CAUTION' | 'OVERWEIGHT';
}

export interface WeightViolation {
  type: 'GROSS_WEIGHT' | 'AXLE_WEIGHT' | 'BRIDGE_FORMULA' | 'STATE_LIMIT';
  description: string;
  currentWeight: number;
  maxAllowed: number;
  excessWeight: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  fineRange?: string;
}

export interface StateWeightLimits {
  state: string;
  maxGrossWeight: number;
  maxSteerAxle: number;
  maxDriveAxle: number;
  maxTrailerAxle: number;
  specialRestrictions?: string[];
}

export interface LoadWeightAssessment {
  loadId: string;
  cargoWeight: number;
  recommendedTruckConfigs: TruckAxleConfiguration[];
  unsuitableConfigs: TruckAxleConfiguration[];
  weightCompliance: WeightEvaluationResult;
  route: string[];
}

export class WeightEvaluationService {
  // Standard DOT truck configurations with axle weight limits
  private readonly standardConfigurations: TruckAxleConfiguration[] = [
    {
      id: 'single-unit-2axle',
      name: '2-Axle Single Unit',
      description: 'Single unit truck with 2 axles (straight truck)',
      totalAxles: 2,
      steerAxles: 1,
      driveAxles: 1,
      trailerAxles: 0,
      maxGrossWeight: 33000, // lbs
      maxSteerAxleWeight: 12000,
      maxDriveAxleWeight: 21000,
      maxTrailerAxleWeight: 0,
      bridgeFormulaRequired: false,
      commonTrailerTypes: ['Box Truck', 'Delivery Truck'],
    },
    {
      id: 'single-unit-3axle',
      name: '3-Axle Single Unit',
      description: 'Single unit truck with 3 axles',
      totalAxles: 3,
      steerAxles: 1,
      driveAxles: 2,
      trailerAxles: 0,
      maxGrossWeight: 54000,
      maxSteerAxleWeight: 12000,
      maxDriveAxleWeight: 21000, // per axle
      maxTrailerAxleWeight: 0,
      bridgeFormulaRequired: true,
      commonTrailerTypes: ['Dump Truck', 'Concrete Mixer'],
    },
    {
      id: 'tractor-semitrailer-3axle',
      name: '3-Axle Tractor-Semitrailer',
      description: 'Tractor (2 axles) + Semitrailer (1 axle)',
      totalAxles: 3,
      steerAxles: 1,
      driveAxles: 1,
      trailerAxles: 1,
      maxGrossWeight: 54000,
      maxSteerAxleWeight: 12000,
      maxDriveAxleWeight: 21000,
      maxTrailerAxleWeight: 21000,
      bridgeFormulaRequired: true,
      commonTrailerTypes: ['Dry Van', 'Reefer', 'Flatbed'],
    },
    {
      id: 'tractor-semitrailer-4axle',
      name: '4-Axle Tractor-Semitrailer',
      description: 'Tractor (2 axles) + Semitrailer (2 axles)',
      totalAxles: 4,
      steerAxles: 1,
      driveAxles: 1,
      trailerAxles: 2,
      maxGrossWeight: 69000,
      maxSteerAxleWeight: 12000,
      maxDriveAxleWeight: 21000,
      maxTrailerAxleWeight: 18000, // per axle
      bridgeFormulaRequired: true,
      commonTrailerTypes: ['Dry Van', 'Reefer', 'Flatbed', 'Tanker'],
    },
    {
      id: 'tractor-semitrailer-5axle',
      name: '5-Axle Tractor-Semitrailer',
      description:
        'Tractor (3 axles) + Semitrailer (2 axles) - Standard Interstate',
      totalAxles: 5,
      steerAxles: 1,
      driveAxles: 2,
      trailerAxles: 2,
      maxGrossWeight: 80000, // Federal Interstate limit
      maxSteerAxleWeight: 12000,
      maxDriveAxleWeight: 17000, // per axle
      maxTrailerAxleWeight: 17000, // per axle
      bridgeFormulaRequired: true,
      commonTrailerTypes: [
        'Dry Van',
        'Reefer',
        'Flatbed',
        'Tanker',
        'Container',
      ],
    },
    {
      id: 'tractor-semitrailer-6axle',
      name: '6-Axle Tractor-Semitrailer',
      description: 'Tractor (3 axles) + Semitrailer (3 axles)',
      totalAxles: 6,
      steerAxles: 1,
      driveAxles: 2,
      trailerAxles: 3,
      maxGrossWeight: 88000,
      maxSteerAxleWeight: 12000,
      maxDriveAxleWeight: 17000,
      maxTrailerAxleWeight: 16000, // per axle
      bridgeFormulaRequired: true,
      commonTrailerTypes: ['Heavy Haul', 'Multi-axle Trailer'],
    },
  ];

  // State-specific weight variations (some states allow higher weights)
  private readonly stateWeightLimits: Record<string, StateWeightLimits> = {
    TX: {
      state: 'Texas',
      maxGrossWeight: 125000, // Texas allows higher weights on designated routes
      maxSteerAxle: 12000,
      maxDriveAxle: 25000,
      maxTrailerAxle: 25000,
      specialRestrictions: ['Designated truck routes only for >80k lbs'],
    },
    CA: {
      state: 'California',
      maxGrossWeight: 80000,
      maxSteerAxle: 12000,
      maxDriveAxle: 20000,
      maxTrailerAxle: 20000,
      specialRestrictions: [
        'Stricter bridge formula enforcement',
        'Port access restrictions',
      ],
    },
    FL: {
      state: 'Florida',
      maxGrossWeight: 80000,
      maxSteerAxle: 12000,
      maxDriveAxle: 22400,
      maxTrailerAxle: 22400,
      specialRestrictions: ['Hurricane evacuation route restrictions'],
    },
    NY: {
      state: 'New York',
      maxGrossWeight: 80000,
      maxSteerAxle: 12000,
      maxDriveAxle: 22400,
      maxTrailerAxle: 22400,
      specialRestrictions: [
        'NYC commercial vehicle restrictions',
        'Thruway weight enforcement',
      ],
    },
    MI: {
      state: 'Michigan',
      maxGrossWeight: 164000, // Michigan allows very high weights
      maxSteerAxle: 13000,
      maxDriveAxle: 18000,
      maxTrailerAxle: 18000,
      specialRestrictions: [
        '11-axle combinations allowed',
        'Seasonal weight restrictions',
      ],
    },
  };

  /**
   * Calculate bridge formula weight limit
   * Federal Bridge Formula: W = 500((LN/(N-1)) + 12N + 36)
   * Where: W = Maximum weight in pounds, L = Distance in feet, N = Number of axles
   */
  private calculateBridgeFormula(
    axleCount: number,
    axleSpacing: number
  ): number {
    if (axleCount < 2) return 0;

    const L = axleSpacing;
    const N = axleCount;

    // Bridge formula calculation
    const weight = 500 * ((L * N) / (N - 1) + 12 * N + 36);

    return Math.floor(weight);
  }

  /**
   * Evaluate weight distribution for a specific truck configuration
   */
  evaluateWeightDistribution(
    config: TruckAxleConfiguration,
    weightDistribution: WeightDistribution,
    states: string[] = ['FEDERAL']
  ): WeightEvaluationResult {
    const violations: WeightViolation[] = [];
    const recommendations: string[] = [];
    const requiredPermits: string[] = [];

    // Check gross weight limit
    if (weightDistribution.totalWeight > config.maxGrossWeight) {
      violations.push({
        type: 'GROSS_WEIGHT',
        description: `Gross weight exceeds ${config.name} limit`,
        currentWeight: weightDistribution.totalWeight,
        maxAllowed: config.maxGrossWeight,
        excessWeight: weightDistribution.totalWeight - config.maxGrossWeight,
        severity: this.determineSeverity(
          weightDistribution.totalWeight,
          config.maxGrossWeight
        ),
        fineRange: '$150-$500 per 1000 lbs over',
      });
    }

    // Check steer axle weight
    if (weightDistribution.steerAxleWeight > config.maxSteerAxleWeight) {
      violations.push({
        type: 'AXLE_WEIGHT',
        description: 'Steer axle weight exceeded',
        currentWeight: weightDistribution.steerAxleWeight,
        maxAllowed: config.maxSteerAxleWeight,
        excessWeight:
          weightDistribution.steerAxleWeight - config.maxSteerAxleWeight,
        severity: 'HIGH',
        fineRange: '$200-$300 per 1000 lbs over',
      });
      recommendations.push('Redistribute cargo weight towards rear axles');
    }

    // Check drive axle weight
    if (weightDistribution.driveAxleWeight > config.maxDriveAxleWeight) {
      violations.push({
        type: 'AXLE_WEIGHT',
        description: 'Drive axle weight exceeded',
        currentWeight: weightDistribution.driveAxleWeight,
        maxAllowed: config.maxDriveAxleWeight,
        excessWeight:
          weightDistribution.driveAxleWeight - config.maxDriveAxleWeight,
        severity: this.determineSeverity(
          weightDistribution.driveAxleWeight,
          config.maxDriveAxleWeight
        ),
        fineRange: '$150-$400 per 1000 lbs over',
      });
    }

    // Check trailer axle weight
    if (
      config.trailerAxles > 0 &&
      weightDistribution.trailerAxleWeight > config.maxTrailerAxleWeight
    ) {
      violations.push({
        type: 'AXLE_WEIGHT',
        description: 'Trailer axle weight exceeded',
        currentWeight: weightDistribution.trailerAxleWeight,
        maxAllowed: config.maxTrailerAxleWeight,
        excessWeight:
          weightDistribution.trailerAxleWeight - config.maxTrailerAxleWeight,
        severity: this.determineSeverity(
          weightDistribution.trailerAxleWeight,
          config.maxTrailerAxleWeight
        ),
        fineRange: '$150-$400 per 1000 lbs over',
      });
    }

    // Bridge formula check (if required)
    let bridgeFormulaCompliant = true;
    if (config.bridgeFormulaRequired) {
      // Typical axle spacing:
      // Tractor axles: 4-6 feet apart
      // Tractor to trailer: 35-40 feet
      // Trailer axles: 4-5 feet apart
      const typicalAxleSpacing = this.calculateTypicalAxleSpacing(config);
      const bridgeFormulaLimit = this.calculateBridgeFormula(
        config.totalAxles,
        typicalAxleSpacing
      );

      if (weightDistribution.totalWeight > bridgeFormulaLimit) {
        bridgeFormulaCompliant = false;
        violations.push({
          type: 'BRIDGE_FORMULA',
          description: 'Federal Bridge Formula violation',
          currentWeight: weightDistribution.totalWeight,
          maxAllowed: bridgeFormulaLimit,
          excessWeight: weightDistribution.totalWeight - bridgeFormulaLimit,
          severity: 'HIGH',
          fineRange: '$300-$1000',
        });
        recommendations.push(
          `Reduce weight to ${bridgeFormulaLimit} lbs or increase axle spacing`
        );
      }
    }

    // State-specific checks
    const stateSpecificLimits: StateWeightLimits[] = [];
    for (const state of states) {
      if (this.stateWeightLimits[state]) {
        const stateLimit = this.stateWeightLimits[state];
        stateSpecificLimits.push(stateLimit);

        // Check state-specific gross weight
        if (weightDistribution.totalWeight > stateLimit.maxGrossWeight) {
          violations.push({
            type: 'STATE_LIMIT',
            description: `${stateLimit.state} gross weight limit exceeded`,
            currentWeight: weightDistribution.totalWeight,
            maxAllowed: stateLimit.maxGrossWeight,
            excessWeight:
              weightDistribution.totalWeight - stateLimit.maxGrossWeight,
            severity: 'HIGH',
          });

          if (stateLimit.maxGrossWeight > 80000) {
            requiredPermits.push(`${stateLimit.state} Overweight Permit`);
          }
        }
      }
    }

    // Determine safety rating
    const safetyRating = this.determineSafetyRating(violations);

    // Generate recommendations
    if (violations.length === 0) {
      recommendations.push(
        'Weight distribution is compliant with all regulations'
      );
    } else {
      recommendations.push(
        'Review weight distribution and consider load adjustments'
      );
      if (
        violations.some(
          (v) => v.severity === 'CRITICAL' || v.severity === 'HIGH'
        )
      ) {
        recommendations.push(
          'IMMEDIATE ACTION REQUIRED: Reduce weight before transport'
        );
      }
    }

    return {
      isCompliant: violations.length === 0,
      violations,
      recommendations,
      maxAllowableWeight: config.maxGrossWeight,
      bridgeFormulaCompliant,
      stateSpecificLimits,
      requiredPermits,
      safetyRating,
    };
  }

  /**
   * Find suitable truck configurations for a given cargo weight
   */
  findSuitableTruckConfigurations(
    cargoWeight: number,
    tractorWeight: number = 15000,
    trailerWeight: number = 14000,
    states: string[] = ['FEDERAL']
  ): {
    suitable: TruckAxleConfiguration[];
    marginal: TruckAxleConfiguration[];
    unsuitable: TruckAxleConfiguration[];
  } {
    const totalWeight = cargoWeight + tractorWeight + trailerWeight;

    const suitable: TruckAxleConfiguration[] = [];
    const marginal: TruckAxleConfiguration[] = [];
    const unsuitable: TruckAxleConfiguration[] = [];

    for (const config of this.standardConfigurations) {
      const weightCapacity =
        config.maxGrossWeight - tractorWeight - trailerWeight;
      const utilizationPercentage = (cargoWeight / weightCapacity) * 100;

      if (totalWeight <= config.maxGrossWeight * 0.85) {
        // Under 85% utilization - suitable
        suitable.push(config);
      } else if (totalWeight <= config.maxGrossWeight) {
        // 85-100% utilization - marginal but possible
        marginal.push(config);
      } else {
        // Over 100% - unsuitable
        unsuitable.push(config);
      }
    }

    return { suitable, marginal, unsuitable };
  }

  /**
   * Perform comprehensive load weight assessment
   */
  assessLoadWeight(
    loadId: string,
    cargoWeight: number,
    routeStates: string[],
    tractorWeight: number = 15000,
    trailerWeight: number = 14000
  ): LoadWeightAssessment {
    const configurations = this.findSuitableTruckConfigurations(
      cargoWeight,
      tractorWeight,
      trailerWeight,
      routeStates
    );

    // Use the most common 5-axle configuration for detailed evaluation
    const standardConfig = this.standardConfigurations.find(
      (c) => c.id === 'tractor-semitrailer-5axle'
    )!;

    // Estimate typical weight distribution
    const weightDistribution: WeightDistribution = {
      steerAxleWeight: tractorWeight * 0.8, // ~12,000 lbs
      driveAxleWeight: (tractorWeight * 0.2 + cargoWeight * 0.4) / 2, // Distributed across 2 axles
      trailerAxleWeight: (trailerWeight + cargoWeight * 0.6) / 2, // Distributed across 2 axles
      totalWeight: cargoWeight + tractorWeight + trailerWeight,
      cargoWeight,
      tractorWeight,
      trailerWeight,
    };

    const weightCompliance = this.evaluateWeightDistribution(
      standardConfig,
      weightDistribution,
      routeStates
    );

    return {
      loadId,
      cargoWeight,
      recommendedTruckConfigs: configurations.suitable,
      unsuitableConfigs: configurations.unsuitable,
      weightCompliance,
      route: routeStates,
    };
  }

  /**
   * Validate load assignment weight compatibility
   */
  validateLoadAssignment(
    loadWeight: number,
    truckConfiguration: TruckAxleConfiguration,
    routeStates: string[]
  ): {
    canAccept: boolean;
    warnings: string[];
    requiredActions: string[];
  } {
    const assessment = this.assessLoadWeight(
      'validation',
      loadWeight,
      routeStates
    );

    const canAccept =
      assessment.weightCompliance.isCompliant &&
      assessment.recommendedTruckConfigs.some(
        (c) => c.id === truckConfiguration.id
      );

    const warnings: string[] = [];
    const requiredActions: string[] = [];

    if (!assessment.weightCompliance.isCompliant) {
      warnings.push('Weight compliance violations detected');
      requiredActions.push(
        'Reduce load weight or obtain permits before dispatch'
      );
    }

    if (assessment.weightCompliance.requiredPermits.length > 0) {
      warnings.push(
        `Permits required: ${assessment.weightCompliance.requiredPermits.join(', ')}`
      );
      requiredActions.push('Obtain required permits before travel');
    }

    if (!assessment.weightCompliance.bridgeFormulaCompliant) {
      warnings.push('Bridge formula violation - unsafe for interstate travel');
      requiredActions.push(
        'Redistribute weight or use different truck configuration'
      );
    }

    return {
      canAccept,
      warnings,
      requiredActions,
    };
  }

  // Helper methods
  private determineSeverity(
    currentWeight: number,
    maxWeight: number
  ): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    const overagePercent = ((currentWeight - maxWeight) / maxWeight) * 100;

    if (overagePercent <= 5) return 'LOW';
    if (overagePercent <= 10) return 'MEDIUM';
    if (overagePercent <= 20) return 'HIGH';
    return 'CRITICAL';
  }

  private calculateTypicalAxleSpacing(config: TruckAxleConfiguration): number {
    // Typical axle spacing based on truck configuration
    switch (config.id) {
      case 'single-unit-2axle':
        return 12; // 12 feet wheelbase
      case 'single-unit-3axle':
        return 16; // 16 feet wheelbase
      case 'tractor-semitrailer-3axle':
        return 38; // ~38 feet overall
      case 'tractor-semitrailer-4axle':
        return 42; // ~42 feet overall
      case 'tractor-semitrailer-5axle':
        return 51; // ~51 feet overall (standard)
      case 'tractor-semitrailer-6axle':
        return 55; // ~55 feet overall
      default:
        return 51;
    }
  }

  private determineSafetyRating(
    violations: WeightViolation[]
  ): 'SAFE' | 'CAUTION' | 'OVERWEIGHT' {
    if (violations.length === 0) return 'SAFE';

    const hasHighSeverity = violations.some(
      (v) => v.severity === 'HIGH' || v.severity === 'CRITICAL'
    );
    if (hasHighSeverity) return 'OVERWEIGHT';

    return 'CAUTION';
  }

  /**
   * Get all standard truck configurations
   */
  getStandardConfigurations(): TruckAxleConfiguration[] {
    return [...this.standardConfigurations];
  }

  /**
   * Get state weight limits for specific states
   */
  getStateWeightLimits(states: string[]): StateWeightLimits[] {
    return states
      .map((state) => this.stateWeightLimits[state])
      .filter((limit) => limit !== undefined);
  }
}

export default WeightEvaluationService;


