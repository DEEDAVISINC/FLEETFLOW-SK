/**
 * Continuous Load Optimization Service
 * Keeps drivers fully loaded at all times while maintaining HOS compliance
 */

import LoadConsolidationService, { LTLLoad } from './LoadConsolidationService';

export interface DriverUtilizationTarget {
  driverId: string;
  driverName: string;
  targetWeeklyHours: number; // Target hours per week (up to 70)
  targetDailyHours: number; // Target hours per day (up to 14)
  minimumCapacityUtilization: number; // Minimum % of truck capacity to use
  preferredRevenue: number; // Target revenue per week
  currentStatus: DriverStatus;
}

export interface DriverStatus {
  currentLocation: string;
  hoursWorkedToday: number;
  hoursWorkedThisWeek: number;
  restRequiredUntil?: string;
  currentLoads: LTLLoad[];
  truckCapacityUsed: {
    weight: number; // percentage
    volume: number; // percentage
    pallets: number; // count
  };
  estimatedDeliveryTime?: string;
  availableForNewLoad: boolean;
}

export interface LoadOpportunity {
  load: LTLLoad;
  compatibilityScore: number; // 0-100
  addedRevenue: number;
  addedHours: number;
  newCapacityUtilization: number;
  routeEfficiency: number;
  timeToPickup: number; // minutes
  consolidationBenefit: number; // additional revenue from consolidation
}

export interface ContinuousOptimizationConfig {
  enabled: boolean;
  optimizationFrequency: number; // minutes between optimization runs
  maxLookaheadHours: number; // how far ahead to plan (default 72 hours)
  minCapacityThreshold: number; // minimum capacity % before seeking new loads
  maxDeadheadMiles: number; // maximum miles to travel for next load
  prioritizeRevenue: boolean; // prioritize revenue vs utilization
  aggressiveConsolidation: boolean; // more aggressive load consolidation
  hosBufferMinutes: number; // safety buffer for HOS limits (default 30 min)
}

export class ContinuousLoadOptimizationService {
  private consolidationService: LoadConsolidationService;
  private optimizationTimer: NodeJS.Timeout | null = null;
  private config: ContinuousOptimizationConfig;
  private driverTargets: Map<string, DriverUtilizationTarget> = new Map();

  constructor(config: ContinuousOptimizationConfig) {
    this.consolidationService = new LoadConsolidationService();
    this.config = config;
  }

  /**
   * Start continuous optimization for maximum driver utilization
   */
  startContinuousOptimization(): void {
    if (!this.config.enabled) {
      console.log('🚫 Continuous optimization is disabled');
      return;
    }

    console.log(
      '🔄 Starting continuous load optimization for maximum utilization...'
    );

    // Run optimization based on configured frequency
    this.optimizationTimer = setInterval(
      () => {
        this.runContinuousOptimizationCycle();
      },
      this.config.optimizationFrequency * 60 * 1000
    );

    // Run initial optimization immediately
    this.runContinuousOptimizationCycle();
  }

  /**
   * Main continuous optimization cycle
   */
  private async runContinuousOptimizationCycle(): Promise<void> {
    try {
      console.log('🎯 Running continuous optimization cycle...');

      // 1. Get all active drivers and their current status
      const activeDrivers = await this.getActiveDrivers();

      // 2. For each driver, optimize their utilization
      for (const driver of activeDrivers) {
        await this.optimizeDriverUtilization(driver);
      }

      // 3. Look for cross-driver optimization opportunities
      await this.optimizeCrossDriverOpportunities(activeDrivers);

      console.log('✅ Continuous optimization cycle completed');
    } catch (error) {
      console.error('❌ Error in continuous optimization cycle:', error);
    }
  }

  /**
   * Optimize individual driver utilization
   */
  private async optimizeDriverUtilization(
    driver: DriverUtilizationTarget
  ): Promise<void> {
    console.log(`🚛 Optimizing utilization for ${driver.driverName}...`);

    // Check if driver needs more loads
    const needsOptimization = this.driverNeedsMoreLoads(driver);

    if (!needsOptimization) {
      console.log(`✅ ${driver.driverName} is optimally loaded`);
      return;
    }

    // Find available load opportunities
    const opportunities = await this.findLoadOpportunities(driver);

    if (opportunities.length === 0) {
      console.log(
        `⚠️ No suitable load opportunities found for ${driver.driverName}`
      );
      await this.handleNoOpportunities(driver);
      return;
    }

    // Select the best optimization strategy
    const bestStrategy = this.selectOptimalStrategy(driver, opportunities);

    if (bestStrategy) {
      await this.implementOptimization(driver, bestStrategy);
    }
  }

  /**
   * Check if driver needs more loads for optimal utilization
   */
  private driverNeedsMoreLoads(driver: DriverUtilizationTarget): boolean {
    const status = driver.currentStatus;

    // Check HOS availability
    const remainingDailyHours =
      14 - status.hoursWorkedToday - this.config.hosBufferMinutes / 60;
    const remainingWeeklyHours =
      driver.targetWeeklyHours - status.hoursWorkedThisWeek;

    if (remainingDailyHours <= 1 || remainingWeeklyHours <= 4) {
      return false; // Not enough HOS time left
    }

    // Check capacity utilization
    const avgCapacityUsed =
      (status.truckCapacityUsed.weight + status.truckCapacityUsed.volume) / 2;

    if (avgCapacityUsed < this.config.minCapacityThreshold) {
      return true; // Truck is underutilized
    }

    // Check if driver will be available soon
    if (status.estimatedDeliveryTime) {
      const deliveryTime = new Date(status.estimatedDeliveryTime);
      const hoursUntilDelivery =
        (deliveryTime.getTime() - Date.now()) / (1000 * 60 * 60);

      if (hoursUntilDelivery <= 4 && avgCapacityUsed < 90) {
        return true; // Will have capacity soon
      }
    }

    return false;
  }

  /**
   * Find all available load opportunities for a driver
   */
  private async findLoadOpportunities(
    driver: DriverUtilizationTarget
  ): Promise<LoadOpportunity[]> {
    const availableLoads = await this.getAvailableLoads();
    const opportunities: LoadOpportunity[] = [];

    for (const load of availableLoads) {
      const opportunity = await this.evaluateLoadOpportunity(driver, load);
      if (opportunity && opportunity.compatibilityScore >= 60) {
        opportunities.push(opportunity);
      }
    }

    // Sort by overall value (combination of revenue, efficiency, and compatibility)
    return opportunities.sort((a, b) => {
      const scoreA =
        a.compatibilityScore * 0.3 +
        a.routeEfficiency * 0.3 +
        a.consolidationBenefit * 0.4;
      const scoreB =
        b.compatibilityScore * 0.3 +
        b.routeEfficiency * 0.3 +
        b.consolidationBenefit * 0.4;
      return scoreB - scoreA;
    });
  }

  /**
   * Evaluate a specific load opportunity for a driver
   */
  private async evaluateLoadOpportunity(
    driver: DriverUtilizationTarget,
    load: LTLLoad
  ): Promise<LoadOpportunity | null> {
    const status = driver.currentStatus;

    // Calculate compatibility score
    let compatibilityScore = 100;

    // Check weight compatibility
    const newWeight =
      status.truckCapacityUsed.weight + (load.weight / 46000) * 100;
    if (newWeight > 100) return null; // Exceeds weight capacity

    // Check volume compatibility
    const loadVolume =
      load.dimensions.length * load.dimensions.width * load.dimensions.height;
    const newVolume =
      status.truckCapacityUsed.volume + (loadVolume / (53 * 8.5 * 13.5)) * 100;
    if (newVolume > 100) return null; // Exceeds volume capacity

    // Check pallet compatibility
    const newPallets = status.truckCapacityUsed.pallets + load.palletCount;
    if (newPallets > 26) return null; // Exceeds pallet capacity

    // Calculate time to pickup
    const timeToPickup = await this.calculateTimeToPickup(
      status.currentLocation,
      load.origin
    );
    if (timeToPickup > (this.config.maxDeadheadMiles * 60) / 55) {
      compatibilityScore -= 30; // Reduce score for long deadhead
    }

    // Check HOS compatibility
    const estimatedHours = timeToPickup / 60 + this.estimateLoadHours(load);
    const remainingHours =
      14 - status.hoursWorkedToday - this.config.hosBufferMinutes / 60;

    if (estimatedHours > remainingHours) {
      compatibilityScore -= 50; // Significant penalty for HOS issues
    }

    // Calculate route efficiency
    const routeEfficiency = this.calculateRouteEfficiency(driver, load);

    // Calculate consolidation benefit
    const consolidationBenefit = await this.calculateConsolidationBenefit(
      driver,
      load
    );

    return {
      load,
      compatibilityScore,
      addedRevenue: load.revenue,
      addedHours: estimatedHours,
      newCapacityUtilization: Math.max(newWeight, newVolume),
      routeEfficiency,
      timeToPickup,
      consolidationBenefit,
    };
  }

  /**
   * Select the optimal strategy from available opportunities
   */
  private selectOptimalStrategy(
    driver: DriverUtilizationTarget,
    opportunities: LoadOpportunity[]
  ): LoadOpportunity[] | null {
    if (opportunities.length === 0) return null;

    // Strategy 1: Single high-value load
    const bestSingleLoad = opportunities[0];

    // Strategy 2: Multiple smaller loads for maximum utilization
    const multiLoadStrategy = this.findBestMultiLoadCombination(
      driver,
      opportunities
    );

    // Strategy 3: Consolidation with existing loads
    const consolidationStrategy = this.findBestConsolidationStrategy(
      driver,
      opportunities
    );

    // Compare strategies and select the best one
    const strategies = [
      {
        type: 'single',
        loads: [bestSingleLoad],
        score:
          bestSingleLoad.compatibilityScore +
          bestSingleLoad.consolidationBenefit,
      },
      {
        type: 'multi',
        loads: multiLoadStrategy,
        score: this.calculateStrategyScore(multiLoadStrategy),
      },
      {
        type: 'consolidation',
        loads: consolidationStrategy,
        score: this.calculateStrategyScore(consolidationStrategy),
      },
    ].filter((s) => s.loads.length > 0);

    const bestStrategy = strategies.reduce((best, current) =>
      current.score > best.score ? current : best
    );

    console.log(
      `📊 Selected ${bestStrategy.type} strategy for ${driver.driverName} (score: ${bestStrategy.score.toFixed(1)})`
    );

    return bestStrategy.loads;
  }

  /**
   * Find the best combination of multiple loads
   */
  private findBestMultiLoadCombination(
    driver: DriverUtilizationTarget,
    opportunities: LoadOpportunity[]
  ): LoadOpportunity[] {
    const combinations: LoadOpportunity[][] = [];
    const maxLoads = Math.min(4, opportunities.length); // Maximum 4 loads per combination

    // Generate all possible combinations
    for (let i = 2; i <= maxLoads; i++) {
      const combos = this.generateCombinations(opportunities, i);
      combinations.push(...combos);
    }

    // Filter valid combinations (capacity, HOS, etc.)
    const validCombinations = combinations.filter((combo) =>
      this.isValidLoadCombination(driver, combo)
    );

    if (validCombinations.length === 0) return [];

    // Return the combination with the highest total value
    return validCombinations.reduce((best, current) => {
      const bestScore = this.calculateStrategyScore(best);
      const currentScore = this.calculateStrategyScore(current);
      return currentScore > bestScore ? current : best;
    });
  }

  /**
   * Find the best consolidation strategy with existing loads
   */
  private findBestConsolidationStrategy(
    driver: DriverUtilizationTarget,
    opportunities: LoadOpportunity[]
  ): LoadOpportunity[] {
    // Look for loads that can be efficiently consolidated with current route
    const consolidationOpportunities = opportunities.filter(
      (opp) => opp.consolidationBenefit > opp.addedRevenue * 0.2 // At least 20% consolidation benefit
    );

    if (consolidationOpportunities.length === 0) return [];

    // Return the top consolidation opportunities
    return consolidationOpportunities.slice(0, 2);
  }

  /**
   * Implement the selected optimization strategy
   */
  private async implementOptimization(
    driver: DriverUtilizationTarget,
    strategy: LoadOpportunity[]
  ): Promise<void> {
    console.log(
      `🚀 Implementing optimization for ${driver.driverName}: ${strategy.length} loads`
    );

    const totalRevenue = strategy.reduce(
      (sum, opp) => sum + opp.addedRevenue,
      0
    );
    const totalHours = strategy.reduce((sum, opp) => sum + opp.addedHours, 0);

    // 1. Assign loads to driver
    for (const opportunity of strategy) {
      await this.assignLoadToDriver(opportunity.load.id, driver.driverId);
    }

    // 2. Update driver status
    await this.updateDriverStatus(driver, strategy);

    // 3. Generate optimized route
    const allLoads = [
      ...driver.currentStatus.currentLoads,
      ...strategy.map((s) => s.load),
    ];
    const optimizedRoute = await this.generateOptimizedRoute(driver, allLoads);

    // 4. Send route to driver
    await this.sendRouteToDriver(driver.driverId, optimizedRoute);

    // 5. Notify dispatch
    await this.notifyDispatch({
      driverId: driver.driverId,
      driverName: driver.driverName,
      loadsAdded: strategy.length,
      addedRevenue: totalRevenue,
      addedHours: totalHours,
      newUtilization: this.calculateNewUtilization(driver, strategy),
      optimizedRoute,
    });

    console.log(
      `✅ Optimization implemented: +$${totalRevenue.toFixed(2)} revenue, +${totalHours.toFixed(1)} hours`
    );
  }

  /**
   * Handle cases where no load opportunities are available
   */
  private async handleNoOpportunities(
    driver: DriverUtilizationTarget
  ): Promise<void> {
    const status = driver.currentStatus;

    // Check if driver should be repositioned for better opportunities
    if (status.truckCapacityUsed.weight < 50 && status.hoursWorkedToday < 8) {
      const repositionOpportunity =
        await this.findRepositionOpportunity(driver);

      if (repositionOpportunity) {
        console.log(
          `📍 Repositioning ${driver.driverName} to ${repositionOpportunity.location} for better opportunities`
        );
        await this.implementRepositioning(driver, repositionOpportunity);
      }
    }

    // Suggest driver take rest if close to HOS limits
    const remainingHours = 14 - status.hoursWorkedToday;
    if (remainingHours <= 2) {
      console.log(
        `😴 Suggesting rest period for ${driver.driverName} (${remainingHours.toFixed(1)} hours remaining)`
      );
      await this.suggestRestPeriod(driver);
    }
  }

  /**
   * Optimize opportunities across multiple drivers
   */
  private async optimizeCrossDriverOpportunities(
    drivers: DriverUtilizationTarget[]
  ): Promise<void> {
    console.log('🔄 Analyzing cross-driver optimization opportunities...');

    // Look for load swaps that improve overall utilization
    for (let i = 0; i < drivers.length; i++) {
      for (let j = i + 1; j < drivers.length; j++) {
        const swapOpportunity = await this.evaluateLoadSwap(
          drivers[i],
          drivers[j]
        );

        if (swapOpportunity && swapOpportunity.benefit > 1000) {
          console.log(
            `🔄 Beneficial load swap found between ${drivers[i].driverName} and ${drivers[j].driverName}`
          );
          await this.implementLoadSwap(drivers[i], drivers[j], swapOpportunity);
        }
      }
    }
  }

  // Helper methods
  private async calculateTimeToPickup(
    currentLocation: string,
    pickupLocation: string
  ): Promise<number> {
    // Calculate driving time in minutes
    // In production, use Google Maps API or similar
    return Math.random() * 180 + 30; // Mock: 30-210 minutes
  }

  private estimateLoadHours(load: LTLLoad): number {
    // Estimate total hours for pickup, transport, and delivery
    const distance = Math.random() * 500 + 100; // Mock distance
    const drivingHours = distance / 55; // 55 mph average
    const serviceHours = 1; // 1 hour for pickup/delivery combined
    return drivingHours + serviceHours;
  }

  private calculateRouteEfficiency(
    driver: DriverUtilizationTarget,
    load: LTLLoad
  ): number {
    // Calculate how efficiently this load fits with current route
    // Higher score = better route efficiency
    return Math.random() * 40 + 60; // Mock: 60-100 efficiency score
  }

  private async calculateConsolidationBenefit(
    driver: DriverUtilizationTarget,
    load: LTLLoad
  ): Promise<number> {
    // Calculate additional revenue from consolidating with existing loads
    const currentLoads = driver.currentStatus.currentLoads;
    if (currentLoads.length === 0) return 0;

    // Mock consolidation benefit calculation
    return load.revenue * 0.15; // 15% consolidation benefit
  }

  private generateCombinations<T>(arr: T[], size: number): T[][] {
    if (size === 1) return arr.map((item) => [item]);

    const combinations: T[][] = [];
    for (let i = 0; i <= arr.length - size; i++) {
      const head = arr[i];
      const tailCombinations = this.generateCombinations(
        arr.slice(i + 1),
        size - 1
      );
      tailCombinations.forEach((tail) => combinations.push([head, ...tail]));
    }
    return combinations;
  }

  private isValidLoadCombination(
    driver: DriverUtilizationTarget,
    combo: LoadOpportunity[]
  ): boolean {
    const totalWeight = combo.reduce((sum, opp) => sum + opp.load.weight, 0);
    const totalHours = combo.reduce((sum, opp) => sum + opp.addedHours, 0);
    const remainingHours = 14 - driver.currentStatus.hoursWorkedToday;

    return (
      totalWeight <= 46000 &&
      totalHours <= remainingHours - this.config.hosBufferMinutes / 60
    );
  }

  private calculateStrategyScore(opportunities: LoadOpportunity[]): number {
    if (opportunities.length === 0) return 0;

    const totalRevenue = opportunities.reduce(
      (sum, opp) => sum + opp.addedRevenue,
      0
    );
    const avgCompatibility =
      opportunities.reduce((sum, opp) => sum + opp.compatibilityScore, 0) /
      opportunities.length;
    const totalConsolidation = opportunities.reduce(
      (sum, opp) => sum + opp.consolidationBenefit,
      0
    );

    return (
      totalRevenue * 0.4 + avgCompatibility * 0.3 + totalConsolidation * 0.3
    );
  }

  private calculateNewUtilization(
    driver: DriverUtilizationTarget,
    strategy: LoadOpportunity[]
  ): number {
    const currentUtilization =
      (driver.currentStatus.truckCapacityUsed.weight +
        driver.currentStatus.truckCapacityUsed.volume) /
      2;
    const addedUtilization =
      strategy.reduce((sum, opp) => sum + opp.newCapacityUtilization, 0) /
      strategy.length;
    return Math.min(100, currentUtilization + addedUtilization);
  }

  // Integration methods (would connect to your actual systems)
  private async getActiveDrivers(): Promise<DriverUtilizationTarget[]> {
    // Get all active drivers from your driver management system
    return [];
  }

  private async getAvailableLoads(): Promise<LTLLoad[]> {
    // Get available loads from your load board
    return [];
  }

  private async assignLoadToDriver(
    loadId: string,
    driverId: string
  ): Promise<void> {
    // Assign load to driver in your system
  }

  private async updateDriverStatus(
    driver: DriverUtilizationTarget,
    strategy: LoadOpportunity[]
  ): Promise<void> {
    // Update driver status with new loads
  }

  private async generateOptimizedRoute(
    driver: DriverUtilizationTarget,
    loads: LTLLoad[]
  ): Promise<any> {
    // Generate optimized route using your routing engine
    return {};
  }

  private async sendRouteToDriver(driverId: string, route: any): Promise<void> {
    // Send route to driver mobile app
  }

  private async notifyDispatch(notification: any): Promise<void> {
    // Notify dispatch of optimization
    console.log('📢 Dispatch notification:', notification);
  }

  private async findRepositionOpportunity(
    driver: DriverUtilizationTarget
  ): Promise<any> {
    // Find better location for driver to wait for loads
    return null;
  }

  private async implementRepositioning(
    driver: DriverUtilizationTarget,
    opportunity: any
  ): Promise<void> {
    // Implement driver repositioning
  }

  private async suggestRestPeriod(
    driver: DriverUtilizationTarget
  ): Promise<void> {
    // Suggest optimal rest period for driver
  }

  private async evaluateLoadSwap(
    driver1: DriverUtilizationTarget,
    driver2: DriverUtilizationTarget
  ): Promise<any> {
    // Evaluate potential load swap between drivers
    return null;
  }

  private async implementLoadSwap(
    driver1: DriverUtilizationTarget,
    driver2: DriverUtilizationTarget,
    swap: any
  ): Promise<void> {
    // Implement load swap between drivers
  }
}

export default ContinuousLoadOptimizationService;







