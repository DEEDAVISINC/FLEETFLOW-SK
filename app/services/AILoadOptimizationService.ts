import {
  Assignment,
  Driver,
  Load,
  OptimizationConstraints,
  OptimizationResult,
  linearProgrammingSolver,
} from './LinearProgrammingSolver';
import {
  LoadScenarioInputs,
  MonteCarloResult,
  monteCarloEngine,
} from './MonteCarloEngine';
import { FleetFlowAI } from './ai';

export interface OptimizationRequest {
  loads: Load[];
  drivers: Driver[];
  constraints?: Partial<OptimizationConstraints>;
  riskTolerance: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
  prioritizeProfit: boolean;
  prioritizeReliability: boolean;
}

export interface EnhancedAssignment extends Assignment {
  monteCarloAnalysis: {
    expectedProfit: number;
    profitRange: { min: number; max: number };
    onTimeProbability: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    confidence: number;
  };
  aiInsights: {
    recommendation: 'STRONGLY_RECOMMEND' | 'RECOMMEND' | 'CAUTION' | 'AVOID';
    reasoning: string[];
    improvementSuggestions: string[];
  };
}

export interface ComprehensiveOptimizationResult {
  // Core optimization results
  optimalAssignments: EnhancedAssignment[];
  alternativeAssignments: EnhancedAssignment[][];
  unassignedLoads: Load[];
  unassignedDrivers: Driver[];

  // Financial analysis
  totalExpectedProfit: number;
  profitRange: { min: number; max: number };
  riskAdjustedProfit: number;

  // Performance metrics
  utilizationRate: number;
  averageConfidence: number;
  overallRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH';

  // Recommendations
  overallRecommendation:
    | 'EXECUTE_ALL'
    | 'EXECUTE_SELECTIVE'
    | 'REVIEW_REQUIRED'
    | 'REJECT_SOLUTION';
  executionPlan: {
    immediateActions: string[];
    reviewRequired: string[];
    riskMitigations: string[];
  };

  // Meta information
  optimizationTime: number;
  solutionQuality: 'OPTIMAL' | 'GOOD' | 'FEASIBLE' | 'NO_SOLUTION';
  lastUpdated: Date;
}

export interface RealTimeOptimizationUpdate {
  loadId?: string;
  driverId?: string;
  updateType:
    | 'LOAD_ADDED'
    | 'LOAD_REMOVED'
    | 'DRIVER_AVAILABLE'
    | 'DRIVER_UNAVAILABLE'
    | 'CONDITIONS_CHANGED';
  impactLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendedActions: string[];
  needsReoptimization: boolean;
}

export class AILoadOptimizationService {
  private ai: FleetFlowAI;
  private lastOptimizationResult: ComprehensiveOptimizationResult | null = null;
  private optimizationInProgress = false;

  constructor() {
    this.ai = new FleetFlowAI();
    console.log('🤖 AI Load Optimization Service initialized');
  }

  /**
   * Main optimization function combining Linear Programming and Monte Carlo analysis
   */
  async optimizeLoadAssignments(
    request: OptimizationRequest
  ): Promise<ComprehensiveOptimizationResult> {
    const startTime = Date.now();
    this.optimizationInProgress = true;

    try {
      console.log(
        `🚀 Starting comprehensive load optimization for ${request.loads.length} loads and ${request.drivers.length} drivers...`
      );

      // Step 1: Configure optimization based on risk tolerance
      const constraints = this.configureConstraints(request);

      // Step 2: Run Linear Programming optimization for initial assignments
      console.log('📐 Running Linear Programming optimization...');
      const lpResult = await linearProgrammingSolver.optimizeAssignments(
        request.loads,
        request.drivers
      );

      // Step 3: Enhanced each assignment with Monte Carlo risk analysis
      console.log('🎲 Running Monte Carlo risk analysis...');
      const enhancedAssignments = await this.enhanceAssignmentsWithRiskAnalysis(
        lpResult.assignments,
        request.loads,
        request.drivers
      );

      // Step 4: Get AI insights for each assignment
      console.log('🧠 Generating AI insights...');
      const aiEnhancedAssignments = await this.addAIInsights(
        enhancedAssignments,
        request.loads,
        request.drivers
      );

      // Step 5: Generate alternative scenarios
      const alternatives = await this.generateAlternativeScenarios(
        request,
        aiEnhancedAssignments
      );

      // Step 6: Comprehensive analysis and recommendations
      const result = await this.generateComprehensiveResult(
        aiEnhancedAssignments,
        alternatives,
        lpResult,
        request,
        Date.now() - startTime
      );

      this.lastOptimizationResult = result;

      console.log(
        `✅ Comprehensive optimization complete. Quality: ${result.solutionQuality}, Expected Profit: $${result.totalExpectedProfit.toLocaleString()}`
      );

      return result;
    } finally {
      this.optimizationInProgress = false;
    }
  }

  /**
   * Quick recommendation for a single load assignment
   */
  async quickLoadRecommendation(
    load: Load,
    availableDrivers: Driver[]
  ): Promise<{
    recommendedAssignment: EnhancedAssignment | null;
    alternatives: EnhancedAssignment[];
    riskAssessment: MonteCarloResult;
    confidence: number;
  }> {
    // Get LP recommendation
    const lpRecommendation =
      await linearProgrammingSolver.recommendDriverForLoad(
        load,
        availableDrivers
      );

    if (!lpRecommendation.recommendedDriver) {
      return {
        recommendedAssignment: null,
        alternatives: [],
        riskAssessment: {} as MonteCarloResult,
        confidence: 0,
      };
    }

    // Run Monte Carlo analysis for this specific assignment
    const scenarioInputs = this.buildScenarioInputs(
      load,
      lpRecommendation.recommendedDriver
    );
    const riskAssessment =
      await monteCarloEngine.simulateLoadScenarios(scenarioInputs);

    // Build enhanced assignment
    const assignment: Assignment = {
      driverId: lpRecommendation.recommendedDriver.id,
      loadId: load.id,
      expectedProfit: riskAssessment.statistics.profit.expected,
      confidence: lpRecommendation.confidence,
      riskFactors: riskAssessment.recommendations.riskFactors,
      estimatedDeliveryTime: new Date(
        Date.now() + load.estimatedHours * 60 * 60 * 1000
      ),
      utilizationScore: Math.min(
        100,
        (load.estimatedHours /
          lpRecommendation.recommendedDriver.hoursAvailable) *
          100
      ),
    };

    const enhancedAssignment = await this.enhanceAssignmentWithRiskAnalysis(
      assignment,
      load,
      lpRecommendation.recommendedDriver
    );

    const aiEnhancedAssignment = await this.addAIInsightsToAssignment(
      enhancedAssignment,
      load,
      lpRecommendation.recommendedDriver
    );

    // Process alternatives
    const alternatives = await Promise.all(
      lpRecommendation.alternatives.slice(0, 2).map(async (driver) => {
        const altScenario = this.buildScenarioInputs(load, driver);
        const altRisk = await monteCarloEngine.quickRiskAssessment(altScenario);

        const altAssignment: Assignment = {
          driverId: driver.id,
          loadId: load.id,
          expectedProfit: altRisk.expectedProfit,
          confidence: altRisk.confidence,
          riskFactors: [],
          estimatedDeliveryTime: new Date(
            Date.now() + load.estimatedHours * 60 * 60 * 1000
          ),
          utilizationScore: Math.min(
            100,
            (load.estimatedHours / driver.hoursAvailable) * 100
          ),
        };

        return this.enhanceAssignmentWithRiskAnalysis(
          altAssignment,
          load,
          driver
        );
      })
    );

    return {
      recommendedAssignment: aiEnhancedAssignment,
      alternatives,
      riskAssessment,
      confidence: lpRecommendation.confidence,
    };
  }

  /**
   * Real-time optimization updates when conditions change
   */
  async handleRealTimeUpdate(update: RealTimeOptimizationUpdate): Promise<{
    impactAssessment: string;
    recommendations: string[];
    needsFullReoptimization: boolean;
  }> {
    if (!this.lastOptimizationResult) {
      return {
        impactAssessment: 'No existing optimization to update',
        recommendations: ['Run full optimization first'],
        needsFullReoptimization: true,
      };
    }

    const impact = this.assessUpdateImpact(update);
    const recommendations = this.generateUpdateRecommendations(update, impact);
    const needsFullReoptimization =
      impact.severity === 'HIGH' || update.needsReoptimization;

    return {
      impactAssessment: impact.description,
      recommendations,
      needsFullReoptimization,
    };
  }

  /**
   * Private helper methods
   */

  private configureConstraints(
    request: OptimizationRequest
  ): OptimizationConstraints {
    const baseConstraints: OptimizationConstraints = {
      maxAssignmentsPerDriver: 1,
      requireEquipmentMatch: true,
      respectHOSLimits: true,
      considerDriverRating: true,
      maximizeProfit: request.prioritizeProfit,
      customerPriorityWeight: 1.2,
      minimumProfitMargin: 50,
    };

    // Adjust based on risk tolerance
    switch (request.riskTolerance) {
      case 'CONSERVATIVE':
        baseConstraints.minimumProfitMargin = 100;
        baseConstraints.customerPriorityWeight = 1.5;
        break;
      case 'AGGRESSIVE':
        baseConstraints.minimumProfitMargin = 25;
        baseConstraints.requireEquipmentMatch = false;
        break;
      case 'MODERATE':
      default:
        // Use base constraints
        break;
    }

    return { ...baseConstraints, ...request.constraints };
  }

  private async enhanceAssignmentsWithRiskAnalysis(
    assignments: Assignment[],
    loads: Load[],
    drivers: Driver[]
  ): Promise<EnhancedAssignment[]> {
    const enhanced = await Promise.all(
      assignments.map(async (assignment) => {
        const load = loads.find((l) => l.id === assignment.loadId)!;
        const driver = drivers.find((d) => d.id === assignment.driverId)!;

        return this.enhanceAssignmentWithRiskAnalysis(assignment, load, driver);
      })
    );

    return enhanced;
  }

  private async enhanceAssignmentWithRiskAnalysis(
    assignment: Assignment,
    load: Load,
    driver: Driver
  ): Promise<EnhancedAssignment> {
    const scenarioInputs = this.buildScenarioInputs(load, driver);
    const monteCarloResult =
      await monteCarloEngine.simulateLoadScenarios(scenarioInputs);

    return {
      ...assignment,
      monteCarloAnalysis: {
        expectedProfit: monteCarloResult.statistics.profit.expected,
        profitRange: {
          min: monteCarloResult.statistics.profit.worstCase,
          max: monteCarloResult.statistics.profit.bestCase,
        },
        onTimeProbability:
          monteCarloResult.statistics.onTimeDelivery.probability,
        riskLevel: monteCarloResult.statistics.onTimeDelivery.riskLevel,
        confidence: monteCarloResult.recommendations.confidence,
      },
      aiInsights: {
        recommendation: 'RECOMMEND', // Will be filled by AI analysis
        reasoning: [],
        improvementSuggestions: [],
      },
    };
  }

  private async addAIInsights(
    assignments: EnhancedAssignment[],
    loads: Load[],
    drivers: Driver[]
  ): Promise<EnhancedAssignment[]> {
    return Promise.all(
      assignments.map(async (assignment) => {
        const load = loads.find((l) => l.id === assignment.loadId)!;
        const driver = drivers.find((d) => d.id === assignment.driverId)!;

        return this.addAIInsightsToAssignment(assignment, load, driver);
      })
    );
  }

  private async addAIInsightsToAssignment(
    assignment: EnhancedAssignment,
    load: Load,
    driver: Driver
  ): Promise<EnhancedAssignment> {
    // Generate AI insights based on assignment data
    let recommendation:
      | 'STRONGLY_RECOMMEND'
      | 'RECOMMEND'
      | 'CAUTION'
      | 'AVOID' = 'RECOMMEND';
    const reasoning: string[] = [];
    const improvementSuggestions: string[] = [];

    // Decision logic for AI recommendations
    const confidence = assignment.monteCarloAnalysis.confidence;
    const riskLevel = assignment.monteCarloAnalysis.riskLevel;
    const profit = assignment.monteCarloAnalysis.expectedProfit;

    if (confidence >= 85 && riskLevel === 'LOW' && profit > 300) {
      recommendation = 'STRONGLY_RECOMMEND';
      reasoning.push('High confidence, low risk, strong profit potential');
    } else if (confidence >= 70 && riskLevel !== 'HIGH' && profit > 100) {
      recommendation = 'RECOMMEND';
      reasoning.push('Good confidence and acceptable risk-profit balance');
    } else if (confidence >= 50 || profit > 50) {
      recommendation = 'CAUTION';
      reasoning.push('Marginal assignment - proceed with monitoring');
      improvementSuggestions.push('Consider alternative drivers if available');
    } else {
      recommendation = 'AVOID';
      reasoning.push('High risk or insufficient profit potential');
      improvementSuggestions.push(
        'Seek better driver match or renegotiate rate'
      );
    }

    // Add specific insights
    if (driver.rating < 3.5) {
      reasoning.push('Below-average driver performance may impact delivery');
      improvementSuggestions.push('Provide additional support or monitoring');
    }

    if (assignment.monteCarloAnalysis.onTimeProbability < 80) {
      reasoning.push('Moderate delivery risk identified');
      improvementSuggestions.push('Build buffer time or notify customer');
    }

    return {
      ...assignment,
      aiInsights: {
        recommendation,
        reasoning,
        improvementSuggestions,
      },
    };
  }

  private buildScenarioInputs(load: Load, driver: Driver): LoadScenarioInputs {
    // Convert load and driver data to Monte Carlo inputs
    return {
      baseDeliveryTime: load.estimatedHours,
      baseRate: load.revenue / load.distance,
      baseCost: driver.costPerMile,
      distance: load.distance,
      urgency: load.urgency,
      weatherForecast: 'CLEAR', // TODO: Get from weather service
      trafficCondition: 'MODERATE', // TODO: Get from traffic service
      driverRating: driver.rating,
      equipmentAge: 5, // TODO: Get from equipment data
      customerImportance: load.customerPriority,
    };
  }

  private async generateAlternativeScenarios(
    request: OptimizationRequest,
    currentAssignments: EnhancedAssignment[]
  ): Promise<EnhancedAssignment[][]> {
    // Generate alternative assignment scenarios
    // For now, return empty array - implement later if needed
    return [];
  }

  private async generateComprehensiveResult(
    assignments: EnhancedAssignment[],
    alternatives: EnhancedAssignment[][],
    lpResult: OptimizationResult,
    request: OptimizationRequest,
    optimizationTime: number
  ): Promise<ComprehensiveOptimizationResult> {
    const totalExpectedProfit = assignments.reduce(
      (sum, a) => sum + a.monteCarloAnalysis.expectedProfit,
      0
    );
    const profitMin = assignments.reduce(
      (sum, a) => sum + a.monteCarloAnalysis.profitRange.min,
      0
    );
    const profitMax = assignments.reduce(
      (sum, a) => sum + a.monteCarloAnalysis.profitRange.max,
      0
    );

    const averageConfidence =
      assignments.length > 0
        ? assignments.reduce(
            (sum, a) => sum + a.monteCarloAnalysis.confidence,
            0
          ) / assignments.length
        : 0;

    const riskLevels = assignments.map((a) => a.monteCarloAnalysis.riskLevel);
    const highRiskCount = riskLevels.filter((r) => r === 'HIGH').length;
    const mediumRiskCount = riskLevels.filter((r) => r === 'MEDIUM').length;

    let overallRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (highRiskCount > assignments.length * 0.3) overallRiskLevel = 'HIGH';
    else if (highRiskCount > 0 || mediumRiskCount > assignments.length * 0.5)
      overallRiskLevel = 'MEDIUM';

    const strongRecommendations = assignments.filter(
      (a) => a.aiInsights.recommendation === 'STRONGLY_RECOMMEND'
    ).length;
    const avoidRecommendations = assignments.filter(
      (a) => a.aiInsights.recommendation === 'AVOID'
    ).length;

    let overallRecommendation:
      | 'EXECUTE_ALL'
      | 'EXECUTE_SELECTIVE'
      | 'REVIEW_REQUIRED'
      | 'REJECT_SOLUTION';

    if (
      averageConfidence >= 80 &&
      overallRiskLevel === 'LOW' &&
      avoidRecommendations === 0
    ) {
      overallRecommendation = 'EXECUTE_ALL';
    } else if (
      averageConfidence >= 65 &&
      strongRecommendations > assignments.length * 0.5
    ) {
      overallRecommendation = 'EXECUTE_SELECTIVE';
    } else if (
      assignments.length > 0 &&
      avoidRecommendations < assignments.length * 0.5
    ) {
      overallRecommendation = 'REVIEW_REQUIRED';
    } else {
      overallRecommendation = 'REJECT_SOLUTION';
    }

    return {
      optimalAssignments: assignments,
      alternativeAssignments: alternatives,
      unassignedLoads: lpResult.unassignedLoads,
      unassignedDrivers: lpResult.unassignedDrivers,
      totalExpectedProfit,
      profitRange: { min: profitMin, max: profitMax },
      riskAdjustedProfit: totalExpectedProfit * (averageConfidence / 100),
      utilizationRate: lpResult.utilizationRate,
      averageConfidence,
      overallRiskLevel,
      overallRecommendation,
      executionPlan: {
        immediateActions: assignments
          .filter((a) => a.aiInsights.recommendation === 'STRONGLY_RECOMMEND')
          .map(
            (a) => `Execute assignment: Driver ${a.driverId} → Load ${a.loadId}`
          ),
        reviewRequired: assignments
          .filter((a) => a.aiInsights.recommendation === 'CAUTION')
          .map(
            (a) => `Review assignment: Driver ${a.driverId} → Load ${a.loadId}`
          ),
        riskMitigations: assignments.flatMap(
          (a) => a.aiInsights.improvementSuggestions
        ),
      },
      optimizationTime,
      solutionQuality: lpResult.solutionQuality,
      lastUpdated: new Date(),
    };
  }

  private assessUpdateImpact(update: RealTimeOptimizationUpdate): {
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    description: string;
  } {
    switch (update.updateType) {
      case 'LOAD_ADDED':
        return {
          severity: 'MEDIUM',
          description:
            'New load added - optimization may find better assignments',
        };
      case 'DRIVER_UNAVAILABLE':
        return {
          severity: 'HIGH',
          description:
            'Driver unavailable - existing assignments may be impacted',
        };
      case 'CONDITIONS_CHANGED':
        return {
          severity: update.impactLevel,
          description:
            'External conditions changed - risk assessments may need update',
        };
      default:
        return {
          severity: 'LOW',
          description: 'Minor update with limited impact',
        };
    }
  }

  private generateUpdateRecommendations(
    update: RealTimeOptimizationUpdate,
    impact: any
  ): string[] {
    const recommendations = [];

    if (impact.severity === 'HIGH') {
      recommendations.push('Immediate reoptimization recommended');
      recommendations.push('Review all current assignments for conflicts');
    } else if (impact.severity === 'MEDIUM') {
      recommendations.push('Consider running incremental optimization');
      recommendations.push('Monitor affected assignments closely');
    } else {
      recommendations.push(
        'Continue monitoring - no immediate action required'
      );
    }

    return [...recommendations, ...update.recommendedActions];
  }

  /**
   * Get the last optimization result
   */
  getLastOptimizationResult(): ComprehensiveOptimizationResult | null {
    return this.lastOptimizationResult;
  }

  /**
   * Check if optimization is currently in progress
   */
  isOptimizationInProgress(): boolean {
    return this.optimizationInProgress;
  }
}

// Export singleton instance
export const aiLoadOptimizationService = new AILoadOptimizationService();


