/**
 * Load Schedule Integration Service
 * Automatically creates schedule entries when loads are assigned to drivers
 * Ensures seamless data flow from load boards to schedule management
 */

import { SchedulingService } from '../scheduling/service';
import { Schedule } from '../scheduling/types';
import WeightEvaluationService, {
  LoadWeightAssessment,
  TruckAxleConfiguration,
} from './WeightEvaluationService';
import { openELDService } from './openeld-integration';

export interface LoadAssignmentData {
  loadId: string;
  loadBoardNumber?: string;
  driverId: string;
  driverName: string;
  origin: string;
  destination: string;
  pickupDate: string;
  deliveryDate: string;
  pickupTime?: string;
  deliveryTime?: string;
  rate: number;
  distance?: string;
  equipment: string;
  weight?: string;
  cargoWeight?: number; // in pounds
  truckConfiguration?: TruckAxleConfiguration;
  routeStates?: string[];
  specialInstructions?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
  assignedBy: string;
  estimatedHours?: number;
  customerId?: string;
  brokerName?: string;
}

export class LoadScheduleIntegrationService {
  private static schedulingService = new SchedulingService();
  private static weightEvaluationService = new WeightEvaluationService();

  /**
   * Main integration function - creates schedule entry when load is assigned
   */
  static async integrateLoadAssignment(loadData: LoadAssignmentData): Promise<{
    success: boolean;
    scheduleId?: string;
    conflicts?: any[];
    error?: string;
    weightCompliance?: LoadWeightAssessment;
    warnings?: string[];
  }> {
    try {
      console.log('🔄 Integrating load assignment with schedule management:', {
        loadId: loadData.loadId,
        driverId: loadData.driverId,
        route: `${loadData.origin} → ${loadData.destination}`,
        cargoWeight: loadData.cargoWeight,
      });

      const warnings: string[] = [];
      let weightCompliance: LoadWeightAssessment | undefined;

      // Step 1: Weight Compliance Validation
      if (loadData.cargoWeight && loadData.cargoWeight > 0) {
        const routeStates = loadData.routeStates || ['FEDERAL'];

        console.log(
          `⚖️ Evaluating weight compliance for ${loadData.cargoWeight} lbs cargo`
        );

        weightCompliance = this.weightEvaluationService.assessLoadWeight(
          loadData.loadId,
          loadData.cargoWeight,
          routeStates
        );

        // Check for critical weight violations
        if (!weightCompliance.weightCompliance.isCompliant) {
          const criticalViolations =
            weightCompliance.weightCompliance.violations.filter(
              (v) => v.severity === 'CRITICAL' || v.severity === 'HIGH'
            );

          if (criticalViolations.length > 0) {
            console.log(
              '🚫 CRITICAL WEIGHT VIOLATIONS DETECTED - Load assignment blocked'
            );
            criticalViolations.forEach((violation) => {
              console.log(
                `   • ${violation.type}: ${violation.description} (${violation.excessWeight} lbs over)`
              );
            });

            return {
              success: false,
              error: `Critical weight violations prevent safe transport. Reduce cargo weight or obtain permits.`,
              weightCompliance,
              warnings: weightCompliance.weightCompliance.violations.map(
                (v) =>
                  `${v.type}: ${v.description} - ${v.excessWeight} lbs over limit`
              ),
            };
          }

          // Add non-critical violations as warnings
          weightCompliance.weightCompliance.violations.forEach((violation) => {
            warnings.push(
              `⚠️ ${violation.description} - ${violation.currentWeight} lbs (limit: ${violation.maxAllowed} lbs)`
            );
          });
        }

        // Add permit requirements as warnings
        if (weightCompliance.weightCompliance.requiredPermits.length > 0) {
          warnings.push(
            `📋 Required Permits: ${weightCompliance.weightCompliance.requiredPermits.join(', ')}`
          );
        }

        // Check if truck configuration is suitable
        if (loadData.truckConfiguration) {
          const validationResult =
            this.weightEvaluationService.validateLoadAssignment(
              loadData.cargoWeight,
              loadData.truckConfiguration,
              routeStates
            );

          if (!validationResult.canAccept) {
            return {
              success: false,
              error: `Truck configuration incompatible with load weight. Required actions: ${validationResult.requiredActions.join(', ')}`,
              weightCompliance,
              warnings: validationResult.warnings,
            };
          }

          warnings.push(...validationResult.warnings);
        }

        console.log(
          `✅ Weight compliance check passed: ${weightCompliance.weightCompliance.safetyRating}`
        );
      }

      // Step 2: Create OpenELD Weight Compliance Log
      if (loadData.driverId && weightCompliance) {
        try {
          // Get driver's device ID (for demo, use a default device)
          const deviceId =
            `OPENELD-${loadData.driverId.slice(-3)}` || 'OPENELD-001';

          await openELDService.createWeightComplianceLog(
            loadData.driverId,
            deviceId,
            loadData,
            weightCompliance
          );

          console.log(
            `📋 OpenELD weight compliance log created for driver ${loadData.driverName}`
          );
        } catch (error) {
          console.error(
            '❌ Failed to create OpenELD weight compliance log:',
            error
          );
          // Don't fail the entire integration if OpenELD logging fails
          warnings.push(
            '⚠️ Weight compliance log creation failed - manual entry may be required'
          );
        }
      }

      // Calculate estimated hours if not provided
      const estimatedHours =
        loadData.estimatedHours ||
        this.calculateEstimatedHours(
          loadData.distance,
          loadData.pickupDate,
          loadData.deliveryDate
        );

      // Create schedule entry for pickup
      const pickupSchedule: Partial<Schedule> = {
        title: `Load Pickup - ${loadData.loadBoardNumber || loadData.loadId}`,
        description: `Pickup load from ${loadData.origin} to ${loadData.destination}`,
        startDate: loadData.pickupDate,
        endDate: loadData.pickupDate,
        startTime: loadData.pickupTime || '09:00',
        endTime: this.calculateEndTime(loadData.pickupTime || '09:00', 2), // 2 hours for pickup
        status: 'Scheduled',
        priority: loadData.priority || 'Medium',
        scheduleType: 'Pickup',
        assignedDriverId: loadData.driverId,
        driverName: loadData.driverName,
        origin: loadData.origin,
        destination: loadData.destination,
        estimatedHours: 2, // Pickup time
        loadId: loadData.loadId,
        customerId: loadData.customerId,
        shipmentDetails: {
          weight: loadData.weight,
          equipment: loadData.equipment,
          specialInstructions: loadData.specialInstructions,
          rate: loadData.rate,
          customerInstructions: `Broker: ${loadData.brokerName || 'Unknown'}`,
        },
        createdBy: loadData.assignedBy,
      };

      // Create pickup schedule
      const pickupResult =
        await this.schedulingService.createSchedule(pickupSchedule);

      if (!pickupResult.success) {
        return {
          success: false,
          conflicts: pickupResult.conflicts,
          error: 'Failed to create pickup schedule',
        };
      }

      // Create schedule entry for delivery
      const deliverySchedule: Partial<Schedule> = {
        title: `Load Delivery - ${loadData.loadBoardNumber || loadData.loadId}`,
        description: `Deliver load from ${loadData.origin} to ${loadData.destination}`,
        startDate: loadData.deliveryDate,
        endDate: loadData.deliveryDate,
        startTime: loadData.deliveryTime || '10:00',
        endTime: this.calculateEndTime(loadData.deliveryTime || '10:00', 2), // 2 hours for delivery
        status: 'Scheduled',
        priority: loadData.priority || 'Medium',
        scheduleType: 'Delivery',
        assignedDriverId: loadData.driverId,
        driverName: loadData.driverName,
        origin: loadData.origin,
        destination: loadData.destination,
        estimatedHours: 2, // Delivery time
        loadId: loadData.loadId,
        customerId: loadData.customerId,
        shipmentDetails: {
          weight: loadData.weight,
          equipment: loadData.equipment,
          specialInstructions: loadData.specialInstructions,
          rate: loadData.rate,
          customerInstructions: `Broker: ${loadData.brokerName || 'Unknown'}`,
        },
        createdBy: loadData.assignedBy,
      };

      // Create delivery schedule
      const deliveryResult =
        await this.schedulingService.createSchedule(deliverySchedule);

      if (!deliveryResult.success) {
        // If delivery schedule fails, we should note it but still consider pickup successful
        console.warn(
          '⚠️ Pickup schedule created but delivery schedule failed:',
          deliveryResult.conflicts
        );
      }

      // Create transit schedule entry if it's a multi-day trip
      const transitSchedule = this.createTransitSchedule(
        loadData,
        estimatedHours
      );
      let transitResult = null;

      if (transitSchedule) {
        transitResult =
          await this.schedulingService.createSchedule(transitSchedule);
      }

      console.log(
        '✅ Load assignment integrated with schedule management successfully'
      );

      return {
        success: true,
        scheduleId: pickupResult.schedule?.id,
        conflicts: [
          ...(pickupResult.conflicts || []),
          ...(deliveryResult.conflicts || []),
          ...(transitResult?.conflicts || []),
        ],
        weightCompliance,
        warnings: warnings.length > 0 ? warnings : undefined,
      };
    } catch (error) {
      console.error(
        '❌ Failed to integrate load assignment with schedule management:',
        error
      );

      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown integration error',
      };
    }
  }

  /**
   * Update schedule when load status changes
   */
  static async updateScheduleFromLoadStatus(
    loadId: string,
    newStatus: string,
    driverId?: string
  ): Promise<boolean> {
    try {
      const schedules =
        await this.schedulingService.getSchedulesByLoadId(loadId);

      for (const schedule of schedules) {
        let updateStatus: Schedule['status'] = schedule.status;

        switch (newStatus.toLowerCase()) {
          case 'in-transit':
          case 'dispatched':
            updateStatus = 'In Progress';
            break;
          case 'delivered':
          case 'completed':
            updateStatus = 'Completed';
            break;
          case 'cancelled':
          case 'canceled':
            updateStatus = 'Cancelled';
            break;
          case 'delayed':
            updateStatus = 'Delayed';
            break;
        }

        if (updateStatus !== schedule.status) {
          await this.schedulingService.updateSchedule(schedule.id, {
            status: updateStatus,
            lastStatusUpdate: new Date().toISOString(),
          });
        }
      }

      return true;
    } catch (error) {
      console.error('Failed to update schedule from load status:', error);
      return false;
    }
  }

  /**
   * Remove schedule entries when load assignment is cancelled
   */
  static async removeScheduleFromLoadCancellation(
    loadId: string
  ): Promise<boolean> {
    try {
      const schedules =
        await this.schedulingService.getSchedulesByLoadId(loadId);

      for (const schedule of schedules) {
        await this.schedulingService.deleteSchedule(schedule.id);
      }

      console.log(
        `✅ Removed ${schedules.length} schedule entries for cancelled load ${loadId}`
      );
      return true;
    } catch (error) {
      console.error('Failed to remove schedules for cancelled load:', error);
      return false;
    }
  }

  /**
   * Get driver schedule conflicts for load assignment
   */
  static async checkDriverAvailability(
    driverId: string,
    pickupDate: string,
    deliveryDate: string
  ): Promise<{
    available: boolean;
    conflicts: any[];
  }> {
    try {
      const validation =
        await this.schedulingService.validateDriverAvailability(
          driverId,
          pickupDate,
          deliveryDate
        );

      return {
        available: validation.conflicts.length === 0,
        conflicts: validation.conflicts,
      };
    } catch (error) {
      console.error('Failed to check driver availability:', error);
      return {
        available: false,
        conflicts: [
          {
            message: 'Could not verify driver availability',
            severity: 'error',
          },
        ],
      };
    }
  }

  /**
   * Helper: Calculate estimated hours for the load
   */
  private static calculateEstimatedHours(
    distance?: string,
    pickupDate?: string,
    deliveryDate?: string
  ): number {
    // If we have distance, estimate based on average speed
    if (distance) {
      const miles = parseInt(distance.replace(/[^\d]/g, '')) || 0;
      const averageSpeed = 55; // Average highway speed with stops
      return Math.ceil(miles / averageSpeed);
    }

    // If we have pickup and delivery dates, calculate time difference
    if (pickupDate && deliveryDate) {
      const pickup = new Date(pickupDate);
      const delivery = new Date(deliveryDate);
      const diffHours =
        Math.abs(delivery.getTime() - pickup.getTime()) / (1000 * 60 * 60);
      return Math.ceil(diffHours);
    }

    // Default estimate
    return 8;
  }

  /**
   * Helper: Calculate end time from start time and duration
   */
  private static calculateEndTime(
    startTime: string,
    durationHours: number
  ): string {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0);

    const endDate = new Date(
      startDate.getTime() + durationHours * 60 * 60 * 1000
    );

    return `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
  }

  /**
   * Helper: Create transit schedule for multi-day trips
   */
  private static createTransitSchedule(
    loadData: LoadAssignmentData,
    estimatedHours: number
  ): Partial<Schedule> | null {
    // Only create transit schedule for trips longer than 8 hours
    if (estimatedHours <= 8) return null;

    const transitHours = Math.max(0, estimatedHours - 4); // Subtract pickup/delivery time

    return {
      title: `In Transit - ${loadData.loadBoardNumber || loadData.loadId}`,
      description: `Transit from ${loadData.origin} to ${loadData.destination}`,
      startDate: loadData.pickupDate,
      endDate: loadData.deliveryDate,
      startTime: this.calculateEndTime(loadData.pickupTime || '09:00', 2), // After pickup
      endTime: loadData.deliveryTime || '10:00', // Before delivery
      status: 'Scheduled',
      priority: loadData.priority || 'Medium',
      scheduleType: 'Delivery', // Transit is part of delivery process
      assignedDriverId: loadData.driverId,
      driverName: loadData.driverName,
      origin: loadData.origin,
      destination: loadData.destination,
      estimatedHours: transitHours,
      loadId: loadData.loadId,
      customerId: loadData.customerId,
      shipmentDetails: {
        weight: loadData.weight,
        equipment: loadData.equipment,
        specialInstructions: loadData.specialInstructions,
        rate: loadData.rate,
        customerInstructions: `Transit time for load - Broker: ${loadData.brokerName || 'Unknown'}`,
      },
      createdBy: loadData.assignedBy,
    };
  }

  /**
   * Get all schedules for a specific load
   */
  static async getSchedulesForLoad(loadId: string): Promise<Schedule[]> {
    try {
      return await this.schedulingService.getSchedulesByLoadId(loadId);
    } catch (error) {
      console.error('Failed to get schedules for load:', error);
      return [];
    }
  }

  /**
   * Integration status check
   */
  static async getIntegrationStatus(): Promise<{
    enabled: boolean;
    schedulingServiceConnected: boolean;
    lastIntegration?: string;
  }> {
    try {
      const testSchedule = await this.schedulingService.getSchedules({});

      return {
        enabled: true,
        schedulingServiceConnected: true,
        lastIntegration: new Date().toISOString(),
      };
    } catch (error) {
      return {
        enabled: false,
        schedulingServiceConnected: false,
      };
    }
  }
}

export default LoadScheduleIntegrationService;
