// Import the GLPK linear programming library
// Note: We'll use a JavaScript implementation for now and potentially upgrade to native GLPK later

export interface Driver {
  id: string;
  name: string;
  location: { lat: number; lng: number; city: string; state: string };
  hoursAvailable: number; // Remaining HOS hours
  equipment: string[]; // Available equipment types
  rating: number; // Performance rating 1-5
  costPerMile: number; // Driver cost per mile
  efficiency: number; // Efficiency multiplier (0.8-1.2)
  specializations: string[]; // HAZMAT, oversized, etc.
  currentLocation: string; // Current city/state
  maxDistance: number; // Maximum willing distance from home
  preferredLanes: string[]; // Preferred freight lanes
}

export interface Load {
  id: string;
  origin: { lat: number; lng: number; city: string; state: string };
  destination: { lat: number; lng: number; city: string; state: string };
  distance: number; // Miles
  revenue: number; // Total revenue
  requiredEquipment: string; // Required equipment type
  weight: number; // Load weight
  hazmat: boolean; // HAZMAT requirement
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  pickupTime: Date; // Pickup window start
  deliveryTime: Date; // Delivery deadline
  customerPriority: 'LOW' | 'MEDIUM' | 'HIGH';
  estimatedHours: number; // Total trip time estimate
}

export interface OptimizationConstraints {
  maxAssignmentsPerDriver: number; // Usually 1 for long haul
  requireEquipmentMatch: boolean;
  respectHOSLimits: boolean;
  considerDriverRating: boolean;
  maximizeProfit: boolean; // vs maximize loads assigned
  customerPriorityWeight: number; // Weight for customer importance
  minimumProfitMargin: number; // Minimum acceptable profit per load
}

export interface Assignment {
  driverId: string;
  loadId: string;
  expectedProfit: number;
  confidence: number; // Confidence in assignment success (0-100)
  riskFactors: string[];
  estimatedDeliveryTime: Date;
  utilizationScore: number; // How well this uses driver's capacity
}

export interface OptimizationResult {
  assignments: Assignment[];
  unassignedLoads: Load[];
  unassignedDrivers: Driver[];
  totalProfit: number;
  utilizationRate: number; // % of available capacity used
  solutionQuality: 'OPTIMAL' | 'GOOD' | 'FEASIBLE' | 'NO_SOLUTION';
  optimizationTime: number; // Time taken to solve (ms)
  recommendations: {
    action: 'EXECUTE_ALL' | 'REVIEW_ASSIGNMENTS' | 'REJECT_SOLUTION';
    reasoning: string[];
    alternativeOptions: Assignment[][]; // Alternative assignment combinations
  };
}

export interface DriverLoadCompatibility {
  driverId: string;
  loadId: string;
  compatibilityScore: number; // 0-100 compatibility score
  profitScore: number; // Expected profit
  distanceScore: number; // Distance efficiency score
  equipmentMatch: boolean;
  hosCompliant: boolean;
  constraints: string[]; // Any constraint violations
}

export class LinearProgrammingSolver {
  private constraints: OptimizationConstraints;

  constructor(constraints: Partial<OptimizationConstraints> = {}) {
    this.constraints = {
      maxAssignmentsPerDriver: 1,
      requireEquipmentMatch: true,
      respectHOSLimits: true,
      considerDriverRating: true,
      maximizeProfit: true,
      customerPriorityWeight: 1.2,
      minimumProfitMargin: 50,
      ...constraints,
    };
  }

  /**
   * Main optimization function - assign loads to drivers for maximum profit
   */
  async optimizeAssignments(
    loads: Load[],
    drivers: Driver[]
  ): Promise<OptimizationResult> {
    const startTime = Date.now();

    console.log(
      `🎯 Starting linear programming optimization for ${loads.length} loads and ${drivers.length} drivers...`
    );

    // Step 1: Calculate compatibility matrix
    const compatibilityMatrix = await this.calculateCompatibilityMatrix(
      loads,
      drivers
    );

    // Step 2: Build and solve optimization problem
    const solution = await this.solveOptimizationProblem(
      compatibilityMatrix,
      loads,
      drivers
    );

    // Step 3: Generate detailed assignments
    const assignments = await this.generateAssignments(
      solution,
      compatibilityMatrix,
      loads,
      drivers
    );

    // Step 4: Analyze solution quality
    const result = this.analyzeSolution(
      assignments,
      loads,
      drivers,
      Date.now() - startTime
    );

    console.log(
      `✅ Optimization complete. Quality: ${result.solutionQuality}, Total Profit: $${result.totalProfit.toLocaleString()}`
    );

    return result;
  }

  /**
   * Calculate compatibility between all driver-load pairs
   */
  private async calculateCompatibilityMatrix(
    loads: Load[],
    drivers: Driver[]
  ): Promise<DriverLoadCompatibility[][]> {
    const matrix: DriverLoadCompatibility[][] = [];

    for (let d = 0; d < drivers.length; d++) {
      matrix[d] = [];
      for (let l = 0; l < loads.length; l++) {
        matrix[d][l] = await this.calculateDriverLoadCompatibility(
          drivers[d],
          loads[l]
        );
      }
    }

    return matrix;
  }

  /**
   * Calculate compatibility score between a specific driver and load
   */
  private async calculateDriverLoadCompatibility(
    driver: Driver,
    load: Load
  ): Promise<DriverLoadCompatibility> {
    let compatibilityScore = 100;
    let profitScore = 0;
    let distanceScore = 100;
    const constraints: string[] = [];

    // Equipment compatibility
    const equipmentMatch = driver.equipment.includes(load.requiredEquipment);
    if (!equipmentMatch) {
      if (this.constraints.requireEquipmentMatch) {
        compatibilityScore = 0;
        constraints.push('Equipment mismatch');
      } else {
        compatibilityScore -= 30;
        constraints.push('Equipment suboptimal');
      }
    }

    // HOS compliance check
    const hosCompliant = driver.hoursAvailable >= load.estimatedHours;
    if (!hosCompliant) {
      if (this.constraints.respectHOSLimits) {
        compatibilityScore = 0;
        constraints.push('HOS violation');
      } else {
        compatibilityScore -= 40;
        constraints.push('HOS risk');
      }
    }

    // HAZMAT certification
    if (load.hazmat && !driver.specializations.includes('HAZMAT')) {
      compatibilityScore = 0;
      constraints.push('HAZMAT certification required');
    }

    // Distance and location scoring
    const distanceToPickup = this.calculateDistance(
      driver.location,
      load.origin
    );
    if (distanceToPickup > driver.maxDistance) {
      compatibilityScore -= 25;
      constraints.push('Outside preferred operating area');
    }

    // Distance efficiency (closer is better, but not always optimal)
    if (distanceToPickup < 50) distanceScore = 100;
    else if (distanceToPickup < 150) distanceScore = 85;
    else if (distanceToPickup < 300) distanceScore = 70;
    else distanceScore = 50;

    // Profit calculation
    const revenue = load.revenue;
    const driverCost = load.distance * driver.costPerMile;
    const deadheadCost = distanceToPickup * (driver.costPerMile * 0.8); // Deadhead costs less
    const totalCost = driverCost + deadheadCost;
    profitScore = revenue - totalCost;

    // Apply driver efficiency multiplier
    profitScore *= driver.efficiency;

    // Customer priority adjustment
    if (load.customerPriority === 'HIGH') {
      compatibilityScore *= this.constraints.customerPriorityWeight;
    }

    // Driver rating impact
    if (this.constraints.considerDriverRating) {
      const ratingMultiplier = 0.8 + (driver.rating / 5) * 0.4; // 0.8-1.2 range
      compatibilityScore *= ratingMultiplier;
    }

    // Minimum profit check
    if (profitScore < this.constraints.minimumProfitMargin) {
      if (compatibilityScore > 0) {
        compatibilityScore = Math.min(compatibilityScore, 30);
        constraints.push(`Low profit: $${profitScore.toFixed(0)}`);
      }
    }

    // Urgency factor
    if (load.urgency === 'HIGH') {
      compatibilityScore *= 1.1;
    }

    return {
      driverId: driver.id,
      loadId: load.id,
      compatibilityScore: Math.max(0, Math.min(100, compatibilityScore)),
      profitScore,
      distanceScore,
      equipmentMatch,
      hosCompliant,
      constraints,
    };
  }

  /**
   * Solve the optimization problem using a simplified algorithm
   * (In production, this would use GLPK or similar solver)
   */
  private async solveOptimizationProblem(
    compatibilityMatrix: DriverLoadCompatibility[][],
    loads: Load[],
    drivers: Driver[]
  ): Promise<{ assignments: number[][]; objective: number }> {
    // For now, use a greedy algorithm with local optimization
    // TODO: Replace with proper GLPK implementation

    const assignments: number[][] = [];
    for (let d = 0; d < drivers.length; d++) {
      assignments[d] = new Array(loads.length).fill(0);
    }

    let totalObjective = 0;
    const assignedLoads = new Set<number>();
    const assignedDrivers = new Set<number>();

    // Create list of all possible assignments with scores
    const candidates: { driver: number; load: number; score: number }[] = [];

    for (let d = 0; d < drivers.length; d++) {
      for (let l = 0; l < loads.length; l++) {
        const compat = compatibilityMatrix[d][l];
        if (compat.compatibilityScore > 0) {
          // Combined score: compatibility and profit
          let score = compat.compatibilityScore;
          if (this.constraints.maximizeProfit) {
            score += compat.profitScore / 10; // Scale profit to similar range
          }

          candidates.push({ driver: d, load: l, score });
        }
      }
    }

    // Sort by score (highest first)
    candidates.sort((a, b) => b.score - a.score);

    // Greedy assignment
    for (const candidate of candidates) {
      const { driver, load } = candidate;

      // Check if driver or load already assigned
      if (assignedDrivers.has(driver) || assignedLoads.has(load)) {
        continue;
      }

      // Check driver capacity constraint
      const currentAssignments = assignments[driver].reduce(
        (sum, val) => sum + val,
        0
      );
      if (currentAssignments >= this.constraints.maxAssignmentsPerDriver) {
        continue;
      }

      // Make assignment
      assignments[driver][load] = 1;
      assignedDrivers.add(driver);
      assignedLoads.add(load);

      const compat = compatibilityMatrix[driver][load];
      totalObjective += compat.profitScore;
    }

    return { assignments, objective: totalObjective };
  }

  /**
   * Generate detailed assignment objects from optimization solution
   */
  private async generateAssignments(
    solution: { assignments: number[][]; objective: number },
    compatibilityMatrix: DriverLoadCompatibility[][],
    loads: Load[],
    drivers: Driver[]
  ): Promise<Assignment[]> {
    const assignments: Assignment[] = [];

    for (let d = 0; d < drivers.length; d++) {
      for (let l = 0; l < loads.length; l++) {
        if (solution.assignments[d][l] === 1) {
          const compat = compatibilityMatrix[d][l];
          const driver = drivers[d];
          const load = loads[l];

          // Calculate confidence based on compatibility and constraints
          let confidence = compat.compatibilityScore;
          if (compat.constraints.length > 0) {
            confidence = Math.max(
              confidence - compat.constraints.length * 10,
              30
            );
          }

          // Estimate delivery time
          const travelTime = load.estimatedHours;
          const estimatedDeliveryTime = new Date(
            load.pickupTime.getTime() + travelTime * 60 * 60 * 1000
          );

          // Calculate utilization score
          const utilizationScore = Math.min(
            100,
            (load.estimatedHours / driver.hoursAvailable) * 100
          );

          assignments.push({
            driverId: driver.id,
            loadId: load.id,
            expectedProfit: compat.profitScore,
            confidence,
            riskFactors: compat.constraints,
            estimatedDeliveryTime,
            utilizationScore,
          });
        }
      }
    }

    return assignments;
  }

  /**
   * Analyze solution quality and generate recommendations
   */
  private analyzeSolution(
    assignments: Assignment[],
    loads: Load[],
    drivers: Driver[],
    optimizationTime: number
  ): OptimizationResult {
    const assignedLoads = new Set(assignments.map((a) => a.loadId));
    const assignedDrivers = new Set(assignments.map((a) => a.driverId));

    const unassignedLoads = loads.filter((load) => !assignedLoads.has(load.id));
    const unassignedDrivers = drivers.filter(
      (driver) => !assignedDrivers.has(driver.id)
    );

    const totalProfit = assignments.reduce(
      (sum, a) => sum + a.expectedProfit,
      0
    );
    const utilizationRate = (assignedDrivers.size / drivers.length) * 100;

    // Determine solution quality
    let solutionQuality: 'OPTIMAL' | 'GOOD' | 'FEASIBLE' | 'NO_SOLUTION' =
      'NO_SOLUTION';

    if (assignments.length === 0) {
      solutionQuality = 'NO_SOLUTION';
    } else if (utilizationRate >= 80 && totalProfit > 0) {
      solutionQuality = 'OPTIMAL';
    } else if (utilizationRate >= 60 && totalProfit > 0) {
      solutionQuality = 'GOOD';
    } else {
      solutionQuality = 'FEASIBLE';
    }

    // Generate recommendations
    const avgConfidence =
      assignments.length > 0
        ? assignments.reduce((sum, a) => sum + a.confidence, 0) /
          assignments.length
        : 0;

    let action: 'EXECUTE_ALL' | 'REVIEW_ASSIGNMENTS' | 'REJECT_SOLUTION';
    const reasoning: string[] = [];

    if (solutionQuality === 'OPTIMAL' && avgConfidence >= 80) {
      action = 'EXECUTE_ALL';
      reasoning.push('High-quality solution with strong confidence scores');
    } else if (solutionQuality === 'GOOD' && avgConfidence >= 70) {
      action = 'REVIEW_ASSIGNMENTS';
      reasoning.push(
        'Good solution but recommend reviewing lower-confidence assignments'
      );
    } else {
      action = 'REJECT_SOLUTION';
      reasoning.push('Solution quality too low or insufficient confidence');
    }

    if (unassignedLoads.length > 0) {
      reasoning.push(
        `${unassignedLoads.length} loads remain unassigned - consider expanding driver pool or adjusting constraints`
      );
    }

    if (totalProfit < 1000) {
      reasoning.push('Low total profit - review pricing or cost structure');
    }

    return {
      assignments,
      unassignedLoads,
      unassignedDrivers,
      totalProfit,
      utilizationRate,
      solutionQuality,
      optimizationTime,
      recommendations: {
        action,
        reasoning,
        alternativeOptions: [], // TODO: Implement alternative solutions
      },
    };
  }

  /**
   * Quick assignment recommendation for a single load
   */
  async recommendDriverForLoad(
    load: Load,
    availableDrivers: Driver[]
  ): Promise<{
    recommendedDriver: Driver | null;
    confidence: number;
    alternatives: Driver[];
    reasoning: string[];
  }> {
    if (availableDrivers.length === 0) {
      return {
        recommendedDriver: null,
        confidence: 0,
        alternatives: [],
        reasoning: ['No available drivers'],
      };
    }

    // Calculate compatibility for all drivers
    const compatibilities = await Promise.all(
      availableDrivers.map((driver) =>
        this.calculateDriverLoadCompatibility(driver, load)
      )
    );

    // Sort by compatibility score
    const sortedCompatibilities = compatibilities
      .map((compat, index) => ({ ...compat, driver: availableDrivers[index] }))
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    const best = sortedCompatibilities[0];
    const alternatives = sortedCompatibilities.slice(1, 4).map((c) => c.driver);

    const reasoning = [];
    if (best.compatibilityScore >= 80) {
      reasoning.push('Excellent driver match with high compatibility');
    } else if (best.compatibilityScore >= 60) {
      reasoning.push('Good driver match with acceptable compatibility');
    } else {
      reasoning.push('Limited driver options - best available match');
    }

    if (best.profitScore > 500) {
      reasoning.push(
        `Strong profit potential: $${best.profitScore.toFixed(0)}`
      );
    } else if (best.profitScore < 100) {
      reasoning.push(`Low profit margin: $${best.profitScore.toFixed(0)}`);
    }

    if (best.constraints.length > 0) {
      reasoning.push(`Constraints: ${best.constraints.join(', ')}`);
    }

    return {
      recommendedDriver: best.compatibilityScore > 0 ? best.driver : null,
      confidence: best.compatibilityScore,
      alternatives,
      reasoning,
    };
  }

  /**
   * Helper function to calculate distance between two points
   */
  private calculateDistance(
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number }
  ): number {
    // Simplified distance calculation (Haversine formula)
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRad(point2.lat - point1.lat);
    const dLng = this.toRad(point2.lng - point1.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(point1.lat)) *
        Math.cos(this.toRad(point2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Update constraints for different optimization strategies
   */
  updateConstraints(newConstraints: Partial<OptimizationConstraints>): void {
    this.constraints = { ...this.constraints, ...newConstraints };
  }
}

// Export default instance
export const linearProgrammingSolver = new LinearProgrammingSolver();


