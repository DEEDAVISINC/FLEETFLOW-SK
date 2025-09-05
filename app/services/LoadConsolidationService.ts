/**
 * Load Consolidation & Time Optimization Service
 * Handles multi-stop LTL consolidation with advanced time optimization
 */

export interface TruckCapacity {
  maxWeight: number; // 80,000 lbs total (truck + trailer + cargo)
  maxLength: number; // 53 feet for dry van
  maxWidth: number; // 8.5 feet
  maxHeight: number; // 13.5 feet
  truckWeight: number; // ~34,000 lbs (tractor + trailer)
  availableWeight: number; // 46,000 lbs cargo capacity
  availableLength: number; // ~53 feet usable
  availableWidth: number; // ~8.5 feet usable
  availableHeight: number; // ~13.5 feet usable
}

export interface LTLLoad {
  id: string;
  origin: string;
  destination: string;
  weight: number; // pounds
  dimensions: {
    length: number; // feet
    width: number; // feet
    height: number; // feet
  };
  palletCount: number;
  commodity: string;
  hazmat: boolean;
  stackable: boolean;
  fragile: boolean;
  revenue: number;
  pickupTimeWindow: { start: string; end: string };
  deliveryTimeWindow: { start: string; end: string };
  priority: 'low' | 'medium' | 'high' | 'urgent';
  customerType: 'regular' | 'premium' | 'new';
}

export interface DriverAvailabilityWindow {
  driverId: string;
  driverName: string;
  availableFrom: string; // ISO date string
  availableTo: string; // ISO date string
  preferredRegions: string[]; // Geographic preferences
  maxWeeklyHours: number; // Driver's preferred max hours
  homeBase: string; // Driver's home location
  currentLocation?: string; // Current location if on road
  restRequiredUntil?: string; // HOS rest requirement
  weeklyHoursUsed: number; // Current week hours
  preferences: {
    preferLongHaul: boolean;
    preferLocalDelivery: boolean;
    avoidNightDriving: boolean;
    preferWeekends: boolean;
    maxDaysOut: number; // Max consecutive days away from home
  };
}

export interface TimeOptimizedRoute {
  driverId: string;
  driverName: string;
  scheduleWindow: { start: string; end: string };
  loads: LTLLoad[];
  totalWeight: number;
  totalRevenue: number;
  totalMiles: number;
  totalHours: number;
  revenuePerMile: number;
  revenuePerHour: number;
  capacityUtilization: {
    weight: number; // percentage
    volume: number; // percentage
    pallets: number; // count
    timeUtilization: number; // percentage of available time used
  };
  routeSequence: RouteStop[];
  hosCompliance: {
    compliant: boolean;
    drivingHours: number;
    onDutyHours: number;
    restBreaks: RestBreak[];
    warnings: string[];
  };
  profitability: {
    grossRevenue: number;
    operatingCosts: number;
    netProfit: number;
    profitMargin: number;
  };
  feasible: boolean;
  optimizationScore: number; // 0-100 score
}

export interface RouteStop {
  loadId: string;
  location: string;
  type: 'pickup' | 'delivery';
  scheduledTime: string;
  serviceTime: number; // minutes
  drivingTimeToPrevious: number; // minutes
  coordinates?: { lat: number; lng: number };
  specialInstructions?: string;
}

export interface RestBreak {
  location: string;
  startTime: string;
  duration: number; // minutes
  type: '30min' | '10hour' | '34hour';
  required: boolean;
}

export class LoadConsolidationService {
  /**
   * Main optimization function that considers both load consolidation and time optimization
   */
  async optimizeDriverSchedule(
    driverAvailability: DriverAvailabilityWindow,
    availableLoads: LTLLoad[],
    truckCapacity: TruckCapacity,
    optimizationPeriod: { start: string; end: string }
  ): Promise<TimeOptimizedRoute[]> {
    // Filter loads that fit driver's availability and preferences
    const compatibleLoads = this.filterCompatibleLoads(
      availableLoads,
      driverAvailability,
      optimizationPeriod
    );

    // Generate all possible load combinations
    const loadCombinations = this.generateLoadCombinations(
      compatibleLoads,
      truckCapacity
    );

    // Optimize each combination for time and route efficiency
    const optimizedRoutes: TimeOptimizedRoute[] = [];

    for (const combination of loadCombinations) {
      const route = await this.optimizeSingleRoute(
        combination,
        driverAvailability,
        truckCapacity
      );

      if (route.feasible && route.hosCompliance.compliant) {
        optimizedRoutes.push(route);
      }
    }

    // Sort by optimization score (revenue, efficiency, driver preferences)
    return optimizedRoutes.sort(
      (a, b) => b.optimizationScore - a.optimizationScore
    );
  }

  /**
   * Analyze specific consolidation opportunity (your Baltimore→Detroit + Toledo→Lansing example)
   */
  analyzeConsolidationOpportunity(
    primaryLoad: LTLLoad,
    additionalLoad: LTLLoad,
    driverAvailability: DriverAvailabilityWindow,
    truckCapacity: TruckCapacity
  ): TimeOptimizedRoute {
    // Weight and capacity validation
    const totalWeight = primaryLoad.weight + additionalLoad.weight;
    const totalPallets = primaryLoad.palletCount + additionalLoad.palletCount;

    if (totalWeight > truckCapacity.availableWeight) {
      return this.createInfeasibleRoute('Weight limit exceeded');
    }

    if (totalPallets > 26) {
      // Standard 53' trailer capacity
      return this.createInfeasibleRoute('Pallet capacity exceeded');
    }

    // Time window validation
    const timeConflict = this.checkTimeWindowConflicts(
      primaryLoad,
      additionalLoad
    );
    if (timeConflict) {
      return this.createInfeasibleRoute(
        `Time window conflict: ${timeConflict}`
      );
    }

    // Generate optimized route sequence
    const routeSequence = this.optimizeRouteSequence([
      primaryLoad,
      additionalLoad,
    ]);

    // Calculate HOS compliance
    const hosAnalysis = this.calculateHOSCompliance(
      routeSequence,
      driverAvailability
    );

    // Calculate profitability
    const profitability = this.calculateRouteProfitability(
      [primaryLoad, additionalLoad],
      routeSequence
    );

    // Calculate optimization score
    const optimizationScore = this.calculateOptimizationScore(
      [primaryLoad, additionalLoad],
      routeSequence,
      profitability,
      driverAvailability
    );

    return {
      driverId: driverAvailability.driverId,
      driverName: driverAvailability.driverName,
      scheduleWindow: {
        start: routeSequence[0].scheduledTime,
        end: routeSequence[routeSequence.length - 1].scheduledTime,
      },
      loads: [primaryLoad, additionalLoad],
      totalWeight,
      totalRevenue: primaryLoad.revenue + additionalLoad.revenue,
      totalMiles: this.calculateTotalMiles(routeSequence),
      totalHours: this.calculateTotalHours(routeSequence),
      revenuePerMile:
        (primaryLoad.revenue + additionalLoad.revenue) /
        this.calculateTotalMiles(routeSequence),
      revenuePerHour:
        (primaryLoad.revenue + additionalLoad.revenue) /
        this.calculateTotalHours(routeSequence),
      capacityUtilization: {
        weight: (totalWeight / truckCapacity.availableWeight) * 100,
        volume: this.calculateVolumeUtilization(
          [primaryLoad, additionalLoad],
          truckCapacity
        ),
        pallets: totalPallets,
        timeUtilization: this.calculateTimeUtilization(
          routeSequence,
          driverAvailability
        ),
      },
      routeSequence,
      hosCompliance: hosAnalysis,
      profitability,
      feasible: hosAnalysis.compliant && profitability.netProfit > 0,
      optimizationScore,
    };
  }

  /**
   * Generate long-term schedule optimization (up to 30 days out)
   */
  async generateLongTermSchedule(
    driverId: string,
    driverAvailability: DriverAvailabilityWindow,
    availableLoads: LTLLoad[],
    truckCapacity: TruckCapacity,
    daysAhead: number = 30
  ): Promise<TimeOptimizedRoute[]> {
    const scheduleWindows = this.createScheduleWindows(
      driverAvailability.availableFrom,
      daysAhead,
      driverAvailability.preferences.maxDaysOut
    );

    const longTermSchedule: TimeOptimizedRoute[] = [];
    let remainingLoads = [...availableLoads];
    let currentDriverLocation =
      driverAvailability.currentLocation || driverAvailability.homeBase;
    let weeklyHoursUsed = driverAvailability.weeklyHoursUsed;

    for (const window of scheduleWindows) {
      // Filter loads available in this time window
      const windowLoads = remainingLoads.filter((load) =>
        this.isLoadAvailableInWindow(load, window)
      );

      if (windowLoads.length === 0) continue;

      // Create temporary availability for this window
      const windowAvailability: DriverAvailabilityWindow = {
        ...driverAvailability,
        availableFrom: window.start,
        availableTo: window.end,
        currentLocation: currentDriverLocation,
        weeklyHoursUsed,
      };

      // Optimize for this window
      const windowRoutes = await this.optimizeDriverSchedule(
        windowAvailability,
        windowLoads,
        truckCapacity,
        window
      );

      if (windowRoutes.length > 0) {
        const bestRoute = windowRoutes[0]; // Highest scoring route
        longTermSchedule.push(bestRoute);

        // Update for next iteration
        remainingLoads = remainingLoads.filter(
          (load) =>
            !bestRoute.loads.some((routeLoad) => routeLoad.id === load.id)
        );

        currentDriverLocation =
          bestRoute.routeSequence[bestRoute.routeSequence.length - 1].location;
        weeklyHoursUsed += bestRoute.totalHours;

        // Reset weekly hours if new week
        if (this.isNewWeek(window.start, driverAvailability.availableFrom)) {
          weeklyHoursUsed = 0;
        }
      }
    }

    return longTermSchedule;
  }

  private filterCompatibleLoads(
    loads: LTLLoad[],
    driverAvailability: DriverAvailabilityWindow,
    period: { start: string; end: string }
  ): LTLLoad[] {
    return loads.filter((load) => {
      // Time window compatibility
      const loadStart = new Date(load.pickupTimeWindow.start);
      const loadEnd = new Date(load.deliveryTimeWindow.end);
      const periodStart = new Date(period.start);
      const periodEnd = new Date(period.end);

      if (loadStart < periodStart || loadEnd > periodEnd) return false;

      // Geographic preferences
      if (driverAvailability.preferredRegions.length > 0) {
        const loadRegion = this.getRegionFromLocation(load.origin);
        if (!driverAvailability.preferredRegions.includes(loadRegion))
          return false;
      }

      // Driver preferences
      if (driverAvailability.preferences.preferLocalDelivery) {
        const distance = this.calculateDistance(load.origin, load.destination);
        if (distance > 250) return false; // Local delivery preference
      }

      if (driverAvailability.preferences.preferLongHaul) {
        const distance = this.calculateDistance(load.origin, load.destination);
        if (distance < 500) return false; // Long haul preference
      }

      return true;
    });
  }

  private generateLoadCombinations(
    loads: LTLLoad[],
    capacity: TruckCapacity
  ): LTLLoad[][] {
    const combinations: LTLLoad[][] = [];

    // Single loads
    loads.forEach((load) => combinations.push([load]));

    // Two-load combinations
    for (let i = 0; i < loads.length; i++) {
      for (let j = i + 1; j < loads.length; j++) {
        const combo = [loads[i], loads[j]];
        if (this.isValidCombination(combo, capacity)) {
          combinations.push(combo);
        }
      }
    }

    // Three-load combinations (if capacity allows)
    for (let i = 0; i < loads.length; i++) {
      for (let j = i + 1; j < loads.length; j++) {
        for (let k = j + 1; k < loads.length; k++) {
          const combo = [loads[i], loads[j], loads[k]];
          if (this.isValidCombination(combo, capacity)) {
            combinations.push(combo);
          }
        }
      }
    }

    return combinations;
  }

  private async optimizeSingleRoute(
    loads: LTLLoad[],
    driverAvailability: DriverAvailabilityWindow,
    capacity: TruckCapacity
  ): Promise<TimeOptimizedRoute> {
    const routeSequence = this.optimizeRouteSequence(loads);
    const hosAnalysis = this.calculateHOSCompliance(
      routeSequence,
      driverAvailability
    );
    const profitability = this.calculateRouteProfitability(
      loads,
      routeSequence
    );

    return {
      driverId: driverAvailability.driverId,
      driverName: driverAvailability.driverName,
      scheduleWindow: {
        start:
          routeSequence[0]?.scheduledTime || driverAvailability.availableFrom,
        end:
          routeSequence[routeSequence.length - 1]?.scheduledTime ||
          driverAvailability.availableTo,
      },
      loads,
      totalWeight: loads.reduce((sum, load) => sum + load.weight, 0),
      totalRevenue: loads.reduce((sum, load) => sum + load.revenue, 0),
      totalMiles: this.calculateTotalMiles(routeSequence),
      totalHours: this.calculateTotalHours(routeSequence),
      revenuePerMile: 0, // Calculated below
      revenuePerHour: 0, // Calculated below
      capacityUtilization: {
        weight:
          (loads.reduce((sum, load) => sum + load.weight, 0) /
            capacity.availableWeight) *
          100,
        volume: this.calculateVolumeUtilization(loads, capacity),
        pallets: loads.reduce((sum, load) => sum + load.palletCount, 0),
        timeUtilization: this.calculateTimeUtilization(
          routeSequence,
          driverAvailability
        ),
      },
      routeSequence,
      hosCompliance: hosAnalysis,
      profitability,
      feasible: hosAnalysis.compliant && profitability.netProfit > 0,
      optimizationScore: this.calculateOptimizationScore(
        loads,
        routeSequence,
        profitability,
        driverAvailability
      ),
    };
  }

  private optimizeRouteSequence(loads: LTLLoad[]): RouteStop[] {
    const stops: RouteStop[] = [];

    // Add all pickups first, then deliveries (basic optimization)
    loads.forEach((load) => {
      stops.push({
        loadId: load.id,
        location: load.origin,
        type: 'pickup',
        scheduledTime: load.pickupTimeWindow.start,
        serviceTime: 30, // 30 minutes pickup time
        drivingTimeToPrevious: 0,
      });
    });

    loads.forEach((load) => {
      stops.push({
        loadId: load.id,
        location: load.destination,
        type: 'delivery',
        scheduledTime: load.deliveryTimeWindow.start,
        serviceTime: 30, // 30 minutes delivery time
        drivingTimeToPrevious: 0,
      });
    });

    // Calculate driving times between stops
    for (let i = 1; i < stops.length; i++) {
      const prevStop = stops[i - 1];
      const currentStop = stops[i];
      currentStop.drivingTimeToPrevious = this.calculateDrivingTime(
        prevStop.location,
        currentStop.location
      );
    }

    return stops;
  }

  private calculateHOSCompliance(
    routeSequence: RouteStop[],
    driverAvailability: DriverAvailabilityWindow
  ): any {
    const totalDrivingTime = routeSequence.reduce(
      (sum, stop) => sum + stop.drivingTimeToPrevious,
      0
    );
    const totalServiceTime = routeSequence.reduce(
      (sum, stop) => sum + stop.serviceTime,
      0
    );
    const totalOnDutyTime = totalDrivingTime + totalServiceTime;

    return {
      compliant: totalDrivingTime <= 660 && totalOnDutyTime <= 840, // 11 hours driving, 14 hours on-duty
      drivingHours: totalDrivingTime / 60,
      onDutyHours: totalOnDutyTime / 60,
      restBreaks: this.calculateRequiredRestBreaks(routeSequence),
      warnings: totalDrivingTime > 600 ? ['Approaching driving limit'] : [],
    };
  }

  private calculateRouteProfitability(
    loads: LTLLoad[],
    routeSequence: RouteStop[]
  ): any {
    const grossRevenue = loads.reduce((sum, load) => sum + load.revenue, 0);
    const totalMiles = this.calculateTotalMiles(routeSequence);
    const fuelCost = totalMiles * 0.65; // $0.65 per mile fuel cost
    const driverCost = (this.calculateTotalHours(routeSequence) / 60) * 28; // $28/hour
    const maintenanceCost = totalMiles * 0.15; // $0.15 per mile maintenance
    const operatingCosts = fuelCost + driverCost + maintenanceCost;
    const netProfit = grossRevenue - operatingCosts;

    return {
      grossRevenue,
      operatingCosts,
      netProfit,
      profitMargin: (netProfit / grossRevenue) * 100,
    };
  }

  private calculateOptimizationScore(
    loads: LTLLoad[],
    routeSequence: RouteStop[],
    profitability: any,
    driverAvailability: DriverAvailabilityWindow
  ): number {
    let score = 0;

    // Revenue factor (40% of score)
    const revenueScore = Math.min((profitability.grossRevenue / 5000) * 40, 40);
    score += revenueScore;

    // Profit margin factor (30% of score)
    const marginScore = Math.min((profitability.profitMargin / 20) * 30, 30);
    score += marginScore;

    // Efficiency factor (20% of score)
    const miles = this.calculateTotalMiles(routeSequence);
    const revenuePerMile = profitability.grossRevenue / miles;
    const efficiencyScore = Math.min((revenuePerMile / 3) * 20, 20);
    score += efficiencyScore;

    // Driver preference factor (10% of score)
    let preferenceScore = 10;
    if (driverAvailability.preferences.preferLongHaul && miles < 500)
      preferenceScore -= 5;
    if (driverAvailability.preferences.preferLocalDelivery && miles > 250)
      preferenceScore -= 5;
    score += preferenceScore;

    return Math.round(score);
  }

  // Helper methods
  private isValidCombination(
    loads: LTLLoad[],
    capacity: TruckCapacity
  ): boolean {
    const totalWeight = loads.reduce((sum, load) => sum + load.weight, 0);
    const totalPallets = loads.reduce((sum, load) => sum + load.palletCount, 0);
    return totalWeight <= capacity.availableWeight && totalPallets <= 26;
  }

  private calculateDistance(origin: string, destination: string): number {
    // Mock distance calculation - in production, use Google Maps API
    return Math.random() * 1000 + 100;
  }

  private calculateDrivingTime(origin: string, destination: string): number {
    // Mock driving time calculation - in production, use Google Maps API
    const distance = this.calculateDistance(origin, destination);
    return (distance / 55) * 60; // 55 mph average, return minutes
  }

  private calculateTotalMiles(routeSequence: RouteStop[]): number {
    return routeSequence.reduce((sum, stop) => {
      return sum + (this.calculateDistance(stop.location, stop.location) || 0);
    }, 0);
  }

  private calculateTotalHours(routeSequence: RouteStop[]): number {
    return routeSequence.reduce((sum, stop) => {
      return sum + stop.drivingTimeToPrevious + stop.serviceTime;
    }, 0);
  }

  private calculateVolumeUtilization(
    loads: LTLLoad[],
    capacity: TruckCapacity
  ): number {
    const totalVolume = loads.reduce((sum, load) => {
      return (
        sum +
        load.dimensions.length * load.dimensions.width * load.dimensions.height
      );
    }, 0);
    const availableVolume =
      capacity.availableLength *
      capacity.availableWidth *
      capacity.availableHeight;
    return (totalVolume / availableVolume) * 100;
  }

  private calculateTimeUtilization(
    routeSequence: RouteStop[],
    driverAvailability: DriverAvailabilityWindow
  ): number {
    const totalTime = this.calculateTotalHours(routeSequence);
    const availableTime = driverAvailability.maxWeeklyHours * 60; // Convert to minutes
    return (totalTime / availableTime) * 100;
  }

  private checkTimeWindowConflicts(
    load1: LTLLoad,
    load2: LTLLoad
  ): string | null {
    // Check if pickup/delivery windows overlap in a way that makes consolidation impossible
    const load1PickupStart = new Date(load1.pickupTimeWindow.start);
    const load1DeliveryEnd = new Date(load1.deliveryTimeWindow.end);
    const load2PickupStart = new Date(load2.pickupTimeWindow.start);
    const load2DeliveryEnd = new Date(load2.deliveryTimeWindow.end);

    // Basic conflict detection - can be enhanced
    if (
      load1DeliveryEnd < load2PickupStart ||
      load2DeliveryEnd < load1PickupStart
    ) {
      return 'Time windows do not allow consolidation';
    }

    return null;
  }

  private createInfeasibleRoute(reason: string): TimeOptimizedRoute {
    return {
      driverId: '',
      driverName: '',
      scheduleWindow: { start: '', end: '' },
      loads: [],
      totalWeight: 0,
      totalRevenue: 0,
      totalMiles: 0,
      totalHours: 0,
      revenuePerMile: 0,
      revenuePerHour: 0,
      capacityUtilization: {
        weight: 0,
        volume: 0,
        pallets: 0,
        timeUtilization: 0,
      },
      routeSequence: [],
      hosCompliance: {
        compliant: false,
        drivingHours: 0,
        onDutyHours: 0,
        restBreaks: [],
        warnings: [reason],
      },
      profitability: {
        grossRevenue: 0,
        operatingCosts: 0,
        netProfit: 0,
        profitMargin: 0,
      },
      feasible: false,
      optimizationScore: 0,
    };
  }

  private createScheduleWindows(
    startDate: string,
    daysAhead: number,
    maxDaysOut: number
  ): Array<{ start: string; end: string }> {
    const windows = [];
    const start = new Date(startDate);

    for (let i = 0; i < daysAhead; i += maxDaysOut) {
      const windowStart = new Date(start);
      windowStart.setDate(start.getDate() + i);

      const windowEnd = new Date(windowStart);
      windowEnd.setDate(
        windowStart.getDate() + Math.min(maxDaysOut, daysAhead - i)
      );

      windows.push({
        start: windowStart.toISOString(),
        end: windowEnd.toISOString(),
      });
    }

    return windows;
  }

  private isLoadAvailableInWindow(
    load: LTLLoad,
    window: { start: string; end: string }
  ): boolean {
    const loadPickup = new Date(load.pickupTimeWindow.start);
    const loadDelivery = new Date(load.deliveryTimeWindow.end);
    const windowStart = new Date(window.start);
    const windowEnd = new Date(window.end);

    return loadPickup >= windowStart && loadDelivery <= windowEnd;
  }

  private isNewWeek(currentDate: string, referenceDate: string): boolean {
    const current = new Date(currentDate);
    const reference = new Date(referenceDate);
    const daysDiff = Math.floor(
      (current.getTime() - reference.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysDiff % 7 === 0 && daysDiff > 0;
  }

  private getRegionFromLocation(location: string): string {
    // Mock region detection - in production, use geocoding
    if (location.includes('CA') || location.includes('California'))
      return 'West Coast';
    if (location.includes('NY') || location.includes('New York'))
      return 'Northeast';
    if (location.includes('TX') || location.includes('Texas'))
      return 'Southwest';
    if (location.includes('FL') || location.includes('Florida'))
      return 'Southeast';
    return 'Midwest';
  }

  private calculateRequiredRestBreaks(routeSequence: RouteStop[]): RestBreak[] {
    const breaks: RestBreak[] = [];
    let drivingTime = 0;

    for (const stop of routeSequence) {
      drivingTime += stop.drivingTimeToPrevious;

      // 30-minute break required after 8 hours of driving
      if (drivingTime >= 480 && breaks.length === 0) {
        breaks.push({
          location: stop.location,
          startTime: stop.scheduledTime,
          duration: 30,
          type: '30min',
          required: true,
        });
      }
    }

    return breaks;
  }
}

export default LoadConsolidationService;

























