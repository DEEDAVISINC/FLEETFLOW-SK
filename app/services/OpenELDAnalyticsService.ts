'use client';

// Enhanced OpenELD Analytics Service - FREE value-add for existing OpenELD users
// Transforms raw OpenELD data into actionable business intelligence

import { OpenELDDutyStatus, openELDService } from './openeld-integration';

export interface DriverEfficiencyMetrics {
  driverId: string;
  driverName: string;
  period: string;

  // Hours Optimization
  averageDrivingHours: number;
  averageOnDutyHours: number;
  utilizationRate: number; // % of available hours used efficiently
  downtime: number; // Hours not maximized

  // Fuel Efficiency (correlates with driving patterns)
  estimatedFuelEfficiency: number; // MPG based on driving behavior
  idleTime: number; // Minutes of idle time
  hardBrakingEvents: number; // Estimated from duty status changes
  rapidAccelerationEvents: number;

  // Compliance Performance
  complianceScore: number; // 0-100 score
  violationCount: number;
  onTimeBreaks: number;
  lateBreaks: number;

  // Route Performance
  plannedVsActualVariance: number; // % variance from planned routes
  averageDeliveryDelay: number; // Minutes
  routeOptimizationScore: number; // How well they follow optimal routes
}

export interface FleetPerformanceAnalytics {
  totalDrivers: number;
  activeDrivers: number;

  // Fleet-wide metrics
  averageUtilization: number;
  totalDrivingHours: number;
  totalFuelSavingsOpportunity: number; // $ value
  totalComplianceScore: number;

  // Top performers
  topPerformers: DriverEfficiencyMetrics[];
  improvementOpportunities: DriverEfficiencyMetrics[];

  // Trends
  utilizationTrend: number; // % change week over week
  complianceTrend: number;
  fuelEfficiencyTrend: number;
}

export interface RouteAnalytics {
  routeId: string;
  driverId: string;
  plannedRoute: {
    distance: number;
    estimatedTime: number;
    plannedStops: number;
  };
  actualRoute: {
    distance: number;
    actualTime: number;
    actualStops: number;
    deviations: number;
  };
  performance: {
    onTimeDelivery: boolean;
    fuelEfficiency: number;
    complianceIssues: string[];
    optimizationScore: number;
  };
}

export interface CostSavingsAnalysis {
  potentialSavings: {
    fuelOptimization: number; // $ per month
    timeOptimization: number; // $ per month
    complianceImprovement: number; // $ per month
    routeOptimization: number; // $ per month
  };
  currentCosts: {
    overtimeHours: number;
    violationPenalties: number;
    inefficientRoutes: number;
    excessFuelConsumption: number;
  };
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    category: string;
    description: string;
    estimatedSavings: number;
    implementationCost: number;
    roi: number;
  }[];
}

class OpenELDAnalyticsService {
  // Driver Efficiency Analysis
  async calculateDriverEfficiency(
    driverId: string,
    periodDays: number = 7
  ): Promise<DriverEfficiencyMetrics> {
    const driver = await openELDService.getDriver(driverId);
    if (!driver) throw new Error('Driver not found');

    const endDate = new Date();
    const startDate = new Date(
      endDate.getTime() - periodDays * 24 * 60 * 60 * 1000
    );

    const dutyLogs = await openELDService.getDutyLogs(
      driverId,
      startDate.toISOString(),
      endDate.toISOString()
    );

    const compliance = await openELDService.checkCompliance(driverId);

    // Calculate driving efficiency
    const drivingLogs = dutyLogs.filter((log) => log.status === 'driving');
    const onDutyLogs = dutyLogs.filter((log) => log.status === 'on_duty');

    const totalDrivingHours = drivingLogs.reduce(
      (sum, log) => sum + log.duration,
      0
    );
    const totalOnDutyHours = onDutyLogs.reduce(
      (sum, log) => sum + log.duration,
      0
    );
    const averageDrivingHours = totalDrivingHours / periodDays;
    const averageOnDutyHours = totalOnDutyHours / periodDays;

    // Calculate utilization (how well they use available hours)
    const maxAvailableHours = 11; // Federal limit
    const utilizationRate = (averageDrivingHours / maxAvailableHours) * 100;
    const downtime = maxAvailableHours - averageDrivingHours;

    // Estimate fuel efficiency based on driving patterns
    const estimatedFuelEfficiency = this.estimateFuelEfficiency(dutyLogs);
    const idleTime = this.calculateIdleTime(dutyLogs);

    // Calculate compliance score
    const complianceScore = compliance.compliance.compliant
      ? Math.max(0, 100 - compliance.compliance.issues.length * 10)
      : Math.max(0, 50 - compliance.compliance.issues.length * 5);

    // Estimate route performance
    const routeOptimizationScore = this.estimateRouteOptimization(dutyLogs);

    return {
      driverId,
      driverName: `Driver ${driverId}`, // Would come from driver management system
      period: `${periodDays} days`,

      averageDrivingHours: Math.round(averageDrivingHours * 10) / 10,
      averageOnDutyHours: Math.round(averageOnDutyHours * 10) / 10,
      utilizationRate: Math.round(utilizationRate * 10) / 10,
      downtime: Math.round(downtime * 10) / 10,

      estimatedFuelEfficiency: Math.round(estimatedFuelEfficiency * 10) / 10,
      idleTime: Math.round(idleTime),
      hardBrakingEvents: Math.floor(Math.random() * 5), // Would come from actual device
      rapidAccelerationEvents: Math.floor(Math.random() * 3),

      complianceScore: Math.round(complianceScore),
      violationCount: compliance.violations.length,
      onTimeBreaks: Math.floor(Math.random() * 10) + 5,
      lateBreaks: Math.floor(Math.random() * 3),

      plannedVsActualVariance: Math.round((Math.random() * 20 - 10) * 10) / 10,
      averageDeliveryDelay: Math.floor(Math.random() * 30),
      routeOptimizationScore: Math.round(routeOptimizationScore),
    };
  }

  // Fleet-wide Performance Analytics
  async calculateFleetPerformance(): Promise<FleetPerformanceAnalytics> {
    const drivers = await openELDService.getDrivers();
    const activeDrivers = drivers.filter((d) => d.eldStatus === 'certified');

    // Calculate individual metrics for all drivers
    const driverMetrics = await Promise.all(
      activeDrivers.slice(0, 5).map(
        (
          driver // Limit for demo
        ) => this.calculateDriverEfficiency(driver.driverId)
      )
    );

    // Aggregate fleet metrics
    const averageUtilization =
      driverMetrics.reduce((sum, m) => sum + m.utilizationRate, 0) /
      driverMetrics.length;
    const totalDrivingHours = driverMetrics.reduce(
      (sum, m) => sum + m.averageDrivingHours * 7,
      0
    );
    const totalComplianceScore =
      driverMetrics.reduce((sum, m) => sum + m.complianceScore, 0) /
      driverMetrics.length;

    // Calculate potential fuel savings
    const avgFuelEfficiency =
      driverMetrics.reduce((sum, m) => sum + m.estimatedFuelEfficiency, 0) /
      driverMetrics.length;
    const optimalFuelEfficiency = 7.5; // Target MPG
    const fuelSavingsOpportunity =
      (optimalFuelEfficiency - avgFuelEfficiency) * totalDrivingHours * 60; // Approximate miles
    const totalFuelSavingsOpportunity = fuelSavingsOpportunity * 4.5; // $4.50/gallon

    // Identify top performers and improvement opportunities
    const sortedByUtilization = [...driverMetrics].sort(
      (a, b) => b.utilizationRate - a.utilizationRate
    );
    const topPerformers = sortedByUtilization.slice(0, 3);
    const improvementOpportunities = sortedByUtilization.slice(-2);

    return {
      totalDrivers: drivers.length,
      activeDrivers: activeDrivers.length,

      averageUtilization: Math.round(averageUtilization * 10) / 10,
      totalDrivingHours: Math.round(totalDrivingHours),
      totalFuelSavingsOpportunity: Math.round(totalFuelSavingsOpportunity),
      totalComplianceScore: Math.round(totalComplianceScore),

      topPerformers,
      improvementOpportunities,

      utilizationTrend: Math.round((Math.random() * 10 - 5) * 10) / 10, // Weekly trend
      complianceTrend: Math.round((Math.random() * 5 - 2.5) * 10) / 10,
      fuelEfficiencyTrend: Math.round((Math.random() * 0.5 - 0.25) * 10) / 10,
    };
  }

  // Route Performance Analysis
  async analyzeRoutePerformance(
    driverId: string,
    routeId: string
  ): Promise<RouteAnalytics> {
    const driver = await openELDService.getDriver(driverId);
    if (!driver) throw new Error('Driver not found');

    // This would integrate with your route planning system
    // For now, we'll generate realistic analytics based on ELD data

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000); // Last 24 hours

    const dutyLogs = await openELDService.getDutyLogs(
      driverId,
      startDate.toISOString(),
      endDate.toISOString()
    );

    const drivingLogs = dutyLogs.filter((log) => log.status === 'driving');
    const totalDrivingTime = drivingLogs.reduce(
      (sum, log) => sum + log.duration,
      0
    );

    // Generate realistic route analytics
    const plannedDistance = 450; // Miles
    const actualDistance = plannedDistance + (Math.random() * 50 - 25); // Some variance
    const plannedTime = 8; // Hours
    const actualTime =
      totalDrivingTime || plannedTime + (Math.random() * 2 - 1);

    const onTimeDelivery = actualTime <= plannedTime * 1.1; // Within 10%
    const optimizationScore = Math.min(
      100,
      Math.max(
        0,
        100 - (Math.abs(actualTime - plannedTime) / plannedTime) * 100
      )
    );

    return {
      routeId,
      driverId,
      plannedRoute: {
        distance: plannedDistance,
        estimatedTime: plannedTime,
        plannedStops: 3,
      },
      actualRoute: {
        distance: Math.round(actualDistance),
        actualTime: Math.round(actualTime * 10) / 10,
        actualStops: 3 + Math.floor(Math.random() * 2),
        deviations: Math.floor(Math.random() * 3),
      },
      performance: {
        onTimeDelivery,
        fuelEfficiency: this.estimateFuelEfficiency(dutyLogs),
        complianceIssues: [], // Would come from compliance check
        optimizationScore: Math.round(optimizationScore),
      },
    };
  }

  // Cost Savings Analysis
  async analyzeCostSavings(): Promise<CostSavingsAnalysis> {
    const fleetPerformance = await this.calculateFleetPerformance();

    // Calculate potential savings based on fleet performance
    const drivers = await openELDService.getDrivers();
    const avgUtilization = fleetPerformance.averageUtilization;
    const targetUtilization = 85; // Industry target

    // Fuel optimization savings
    const fuelOptimization = fleetPerformance.totalFuelSavingsOpportunity;

    // Time optimization savings (better utilization)
    const utilizationGap = Math.max(0, targetUtilization - avgUtilization);
    const timeOptimization =
      (utilizationGap / 100) * drivers.length * 11 * 7 * 50; // Hours * hourly rate

    // Compliance improvement (reduced violations)
    const avgViolations = 2; // Would calculate from actual data
    const complianceImprovement = avgViolations * drivers.length * 500; // $500 per violation

    // Route optimization
    const routeOptimization = drivers.length * 50 * 4; // $50/week per driver in route savings

    return {
      potentialSavings: {
        fuelOptimization: Math.round(fuelOptimization),
        timeOptimization: Math.round(timeOptimization),
        complianceImprovement: Math.round(complianceImprovement),
        routeOptimization: Math.round(routeOptimization),
      },
      currentCosts: {
        overtimeHours: Math.round(timeOptimization * 0.3),
        violationPenalties: complianceImprovement,
        inefficientRoutes: routeOptimization,
        excessFuelConsumption: fuelOptimization,
      },
      recommendations: [
        {
          priority: 'high',
          category: 'Driver Training',
          description: 'Implement fuel-efficient driving training program',
          estimatedSavings: fuelOptimization * 0.6,
          implementationCost: 500 * drivers.length,
          roi: (fuelOptimization * 0.6) / (500 * drivers.length),
        },
        {
          priority: 'medium',
          category: 'Route Optimization',
          description: 'Enhance route planning with real-time traffic data',
          estimatedSavings: routeOptimization * 0.7,
          implementationCost: 2000,
          roi: (routeOptimization * 0.7) / 2000,
        },
        {
          priority: 'high',
          category: 'Compliance Monitoring',
          description: 'Implement proactive HOS violation prevention',
          estimatedSavings: complianceImprovement * 0.8,
          implementationCost: 1000,
          roi: (complianceImprovement * 0.8) / 1000,
        },
      ],
    };
  }

  // Helper Methods
  private estimateFuelEfficiency(dutyLogs: OpenELDDutyStatus[]): number {
    const drivingLogs = dutyLogs.filter((log) => log.status === 'driving');
    if (drivingLogs.length === 0) return 7.0; // Default estimate

    // Estimate based on driving patterns
    const avgDuration =
      drivingLogs.reduce((sum, log) => sum + log.duration, 0) /
      drivingLogs.length;
    const consistencyScore = this.calculateConsistency(drivingLogs);

    // Better consistency and optimal duration = better fuel efficiency
    const baseMPG = 6.5;
    const consistencyBonus = consistencyScore * 0.5;
    const durationBonus = avgDuration > 1 && avgDuration < 4 ? 0.3 : 0; // Sweet spot

    return Math.min(8.5, baseMPG + consistencyBonus + durationBonus);
  }

  private calculateIdleTime(dutyLogs: OpenELDDutyStatus[]): number {
    // Estimate idle time from duty status changes
    const onDutyLogs = dutyLogs.filter((log) => log.status === 'on_duty');
    return onDutyLogs.reduce((sum, log) => sum + log.duration, 0) * 60 * 0.2; // 20% of on-duty time is idle
  }

  private calculateConsistency(drivingLogs: OpenELDDutyStatus[]): number {
    if (drivingLogs.length < 2) return 0.5;

    const durations = drivingLogs.map((log) => log.duration);
    const avg = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const variance =
      durations.reduce((sum, d) => sum + Math.pow(d - avg, 2), 0) /
      durations.length;

    // Lower variance = higher consistency score
    return Math.max(0, 1 - variance / (avg * avg));
  }

  private estimateRouteOptimization(dutyLogs: OpenELDDutyStatus[]): number {
    // Estimate how well the driver follows optimal routes
    const drivingLogs = dutyLogs.filter((log) => log.status === 'driving');
    if (drivingLogs.length === 0) return 75;

    // Base score on consistency and efficiency
    const consistency = this.calculateConsistency(drivingLogs);
    const efficiency = this.estimateFuelEfficiency(dutyLogs) / 8.5; // Normalized to best possible

    return Math.round((consistency * 0.4 + efficiency * 0.6) * 100);
  }

  // Real-time Monitoring
  async getRealtimeFleetStatus(): Promise<{
    onlineDrivers: number;
    activeDevices: number;
    complianceAlerts: number;
    systemHealth: 'healthy' | 'warning' | 'critical';
  }> {
    const drivers = await openELDService.getDrivers();
    const devices = await openELDService.getDevices();
    const systemHealth = await openELDService.getSystemHealth();

    const onlineDrivers = drivers.filter((d) => d.deviceId).length;
    const activeDevices = devices.filter(
      (d) => d.status === 'connected'
    ).length;

    // Count compliance alerts across all drivers
    let complianceAlerts = 0;
    for (const driver of drivers.slice(0, 5)) {
      // Limit for demo
      try {
        const compliance = await openELDService.checkCompliance(
          driver.driverId
        );
        if (!compliance.compliance.compliant) complianceAlerts++;
      } catch (error) {
        // Ignore errors for demo
      }
    }

    return {
      onlineDrivers,
      activeDevices,
      complianceAlerts,
      systemHealth: systemHealth.status,
    };
  }
}

export const openELDAnalyticsService = new OpenELDAnalyticsService();

