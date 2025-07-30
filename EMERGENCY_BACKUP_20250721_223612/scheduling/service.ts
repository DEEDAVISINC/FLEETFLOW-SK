/**
 * Integrated Scheduling Service
 * Business logic for schedule management with driver/vehicle integration
 */

import { 
  Schedule, 
  ScheduleFilter, 
  ScheduleStatistics, 
  DriverAvailability, 
  VehicleAvailability,
  ScheduleValidation,
  ScheduleConflict,
  WeeklyScheduleView,
  DriverWeeklySchedule,
  VehicleWeeklySchedule,
  DailySchedule
} from './types';

export class SchedulingService {
  private schedules: Schedule[] = [];
  private drivers: DriverAvailability[] = [];
  private vehicles: VehicleAvailability[] = [];

  constructor() {
    this.initializeMockData();
  }

  // Schedule CRUD Operations
  async createSchedule(scheduleData: Partial<Schedule>): Promise<{ success: boolean; schedule?: Schedule; conflicts?: ScheduleConflict[] }> {
    const newSchedule: Schedule = {
      id: `SCH-${Date.now()}`,
      title: scheduleData.title || 'Untitled Schedule',
      startDate: scheduleData.startDate || new Date().toISOString().split('T')[0],
      endDate: scheduleData.endDate || new Date().toISOString().split('T')[0],
      startTime: scheduleData.startTime || '09:00',
      endTime: scheduleData.endTime || '17:00',
      status: 'Scheduled',
      priority: scheduleData.priority || 'Medium',
      scheduleType: scheduleData.scheduleType || 'Other',
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...scheduleData
    };

    // Validate schedule
    const validation = await this.validateSchedule(newSchedule);
    
    if (validation.conflicts.some(c => c.severity === 'error')) {
      return { 
        success: false, 
        conflicts: validation.conflicts.filter(c => c.severity === 'error')
      };
    }

    // Update availability and HOS tracking
    await this.updateResourceAvailability(newSchedule);
    
    this.schedules.push(newSchedule);
    return { success: true, schedule: newSchedule, conflicts: validation.conflicts };
  }

  async updateSchedule(id: string, updates: Partial<Schedule>): Promise<{ success: boolean; schedule?: Schedule; conflicts?: ScheduleConflict[] }> {
    const index = this.schedules.findIndex(s => s.id === id);
    if (index === -1) {
      return { success: false };
    }

    const updatedSchedule = {
      ...this.schedules[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    const validation = await this.validateSchedule(updatedSchedule);
    
    if (validation.conflicts.some(c => c.severity === 'error')) {
      return { 
        success: false, 
        conflicts: validation.conflicts.filter(c => c.severity === 'error')
      };
    }

    this.schedules[index] = updatedSchedule;
    await this.updateResourceAvailability(updatedSchedule);
    
    return { success: true, schedule: updatedSchedule, conflicts: validation.conflicts };
  }

  async deleteSchedule(id: string): Promise<boolean> {
    const index = this.schedules.findIndex(s => s.id === id);
    if (index === -1) return false;

    const schedule = this.schedules[index];
    this.schedules.splice(index, 1);
    
    // Free up resources
    await this.freeResourceAvailability(schedule);
    
    return true;
  }

  // Schedule Retrieval
  getSchedules(filter?: ScheduleFilter): Schedule[] {
    let filtered = [...this.schedules];

    if (filter) {
      if (filter.startDate) {
        filtered = filtered.filter(s => s.startDate >= filter.startDate!);
      }
      if (filter.endDate) {
        filtered = filtered.filter(s => s.endDate <= filter.endDate!);
      }
      if (filter.status?.length) {
        filtered = filtered.filter(s => filter.status!.includes(s.status));
      }
      if (filter.priority?.length) {
        filtered = filtered.filter(s => filter.priority!.includes(s.priority));
      }
      if (filter.scheduleType?.length) {
        filtered = filtered.filter(s => filter.scheduleType!.includes(s.scheduleType));
      }
      if (filter.assignedDriverId) {
        filtered = filtered.filter(s => s.assignedDriverId === filter.assignedDriverId);
      }
      if (filter.assignedVehicleId) {
        filtered = filtered.filter(s => s.assignedVehicleId === filter.assignedVehicleId);
      }
      if (filter.searchTerm) {
        const term = filter.searchTerm.toLowerCase();
        filtered = filtered.filter(s => 
          s.title.toLowerCase().includes(term) ||
          s.description?.toLowerCase().includes(term) ||
          s.driverName?.toLowerCase().includes(term) ||
          s.vehicleName?.toLowerCase().includes(term)
        );
      }
    }

    return filtered.sort((a, b) => new Date(a.startDate + ' ' + a.startTime).getTime() - new Date(b.startDate + ' ' + b.startTime).getTime());
  }

  getScheduleById(id: string): Schedule | undefined {
    return this.schedules.find(s => s.id === id);
  }

  // Resource Management
  getDriverAvailability(driverId?: string): DriverAvailability[] {
    if (driverId) {
      return this.drivers.filter(d => d.driverId === driverId);
    }
    return [...this.drivers];
  }

  getVehicleAvailability(vehicleId?: string): VehicleAvailability[] {
    if (vehicleId) {
      return this.vehicles.filter(v => v.vehicleId === vehicleId);
    }
    return [...this.vehicles];
  }

  getAvailableDriversForSchedule(schedule: Partial<Schedule>): DriverAvailability[] {
    return this.drivers.filter(driver => {
      // Check basic availability
      if (driver.status === 'Inactive' || driver.status === 'Off Duty') return false;
      
      // Check HOS compliance
      const estimatedHours = schedule.estimatedHours || this.calculateEstimatedHours(schedule);
      if (driver.hoursRemaining < estimatedHours) return false;
      
      // Check license status
      if (driver.licenseStatus !== 'Valid') return false;
      
      // Check for time conflicts
      if (this.hasDriverTimeConflict(driver.driverId, schedule)) return false;
      
      return true;
    });
  }

  getAvailableVehiclesForSchedule(schedule: Partial<Schedule>): VehicleAvailability[] {
    return this.vehicles.filter(vehicle => {
      // Check basic availability
      if (vehicle.status !== 'Available') return false;
      
      // Check maintenance status
      if (vehicle.inspectionStatus === 'Overdue') return false;
      
      // Check for time conflicts
      if (this.hasVehicleTimeConflict(vehicle.vehicleId, schedule)) return false;
      
      return true;
    });
  }

  // Schedule Validation
  async validateSchedule(schedule: Schedule): Promise<ScheduleValidation> {
    const conflicts: ScheduleConflict[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Time validation
    const startDateTime = new Date(`${schedule.startDate} ${schedule.startTime}`);
    const endDateTime = new Date(`${schedule.endDate} ${schedule.endTime}`);
    
    if (endDateTime <= startDateTime) {
      conflicts.push({
        type: 'time_overlap',
        severity: 'error',
        message: 'End time must be after start time',
        affectedSchedules: [schedule.id],
        suggestions: ['Adjust the end time to be later than the start time']
      });
    }

    // Driver validation
    if (schedule.assignedDriverId) {
      const driver = this.drivers.find(d => d.driverId === schedule.assignedDriverId);
      if (driver) {
        // HOS validation
        const estimatedHours = schedule.estimatedHours || this.calculateEstimatedHours(schedule);
        if (driver.hoursRemaining < estimatedHours) {
          conflicts.push({
            type: 'hos_violation',
            severity: 'error',
            message: `Driver ${driver.name} has insufficient hours remaining (${driver.hoursRemaining}h available, ${estimatedHours}h needed)`,
            affectedSchedules: [schedule.id],
            suggestions: ['Assign a different driver', 'Reduce schedule duration', 'Split into multiple shifts']
          });
        }

        // License validation
        if (driver.licenseStatus !== 'Valid') {
          conflicts.push({
            type: 'license_expired',
            severity: 'error',
            message: `Driver ${driver.name} has invalid license status: ${driver.licenseStatus}`,
            affectedSchedules: [schedule.id],
            suggestions: ['Assign a driver with valid license', 'Update driver license status']
          });
        }

        // Time conflict validation
        if (this.hasDriverTimeConflict(schedule.assignedDriverId, schedule)) {
          conflicts.push({
            type: 'double_booking',
            severity: 'error',
            message: `Driver ${driver.name} has conflicting schedules`,
            affectedSchedules: [schedule.id],
            suggestions: ['Choose a different time slot', 'Assign a different driver']
          });
        }
      }
    }

    // Vehicle validation
    if (schedule.assignedVehicleId) {
      const vehicle = this.vehicles.find(v => v.vehicleId === schedule.assignedVehicleId);
      if (vehicle) {
        // Maintenance validation
        if (vehicle.inspectionStatus === 'Overdue') {
          conflicts.push({
            type: 'maintenance_required',
            severity: 'error',
            message: `Vehicle ${vehicle.name} has overdue inspection`,
            affectedSchedules: [schedule.id],
            suggestions: ['Complete vehicle inspection', 'Assign a different vehicle']
          });
        }

        // Time conflict validation
        if (this.hasVehicleTimeConflict(schedule.assignedVehicleId, schedule)) {
          conflicts.push({
            type: 'double_booking',
            severity: 'error',
            message: `Vehicle ${vehicle.name} has conflicting schedules`,
            affectedSchedules: [schedule.id],
            suggestions: ['Choose a different time slot', 'Assign a different vehicle']
          });
        }
      }
    }

    return {
      isValid: conflicts.filter(c => c.severity === 'error').length === 0,
      conflicts,
      warnings,
      recommendations
    };
  }

  // Weekly Schedule View
  getWeeklyScheduleView(weekStartDate: string): WeeklyScheduleView {
    const weekStart = new Date(weekStartDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const weekSchedules = this.schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.startDate);
      return scheduleDate >= weekStart && scheduleDate <= weekEnd;
    });

    const driverSchedules: DriverWeeklySchedule[] = this.drivers.map(driver => ({
      driverId: driver.driverId,
      driverName: driver.name,
      schedules: this.generateDailySchedules(driver.driverId, weekStart, weekSchedules, 'driver'),
      totalHours: this.calculateWeeklyHours(driver.driverId, weekSchedules),
      hosCompliance: driver.hoursRemaining > 0,
      utilization: this.calculateDriverUtilization(driver.driverId, weekSchedules)
    }));

    const vehicleSchedules: VehicleWeeklySchedule[] = this.vehicles.map(vehicle => ({
      vehicleId: vehicle.vehicleId,
      vehicleName: vehicle.name,
      schedules: this.generateDailySchedules(vehicle.vehicleId, weekStart, weekSchedules, 'vehicle'),
      totalMiles: this.calculateWeeklyMiles(vehicle.vehicleId, weekSchedules),
      utilization: this.calculateVehicleUtilization(vehicle.vehicleId, weekSchedules),
      maintenanceAlerts: this.getVehicleMaintenanceAlerts(vehicle)
    }));

    const unassignedSchedules = weekSchedules.filter(s => !s.assignedDriverId || !s.assignedVehicleId);

    return {
      weekStartDate,
      drivers: driverSchedules,
      vehicles: vehicleSchedules,
      unassignedSchedules
    };
  }

  // Statistics
  getScheduleStatistics(): ScheduleStatistics {
    const total = this.schedules.length;
    const scheduled = this.schedules.filter(s => s.status === 'Scheduled').length;
    const inProgress = this.schedules.filter(s => s.status === 'In Progress').length;
    const completed = this.schedules.filter(s => s.status === 'Completed').length;
    const cancelled = this.schedules.filter(s => s.status === 'Cancelled').length;
    const delayed = this.schedules.filter(s => s.status === 'Delayed').length;

    const utilizationRate = this.calculateOverallUtilization();
    const complianceRate = this.calculateComplianceRate();
    const onTimePerformance = this.calculateOnTimePerformance();

    return {
      totalSchedules: total,
      scheduledCount: scheduled,
      inProgressCount: inProgress,
      completedCount: completed,
      cancelledCount: cancelled,
      delayedCount: delayed,
      utilizationRate,
      complianceRate,
      onTimePerformance
    };
  }

  // Private helper methods
  private calculateEstimatedHours(schedule: Partial<Schedule>): number {
    if (!schedule.startTime || !schedule.endTime) return 8;
    
    const startTime = this.parseTime(schedule.startTime);
    const endTime = this.parseTime(schedule.endTime);
    
    return (endTime - startTime) / (1000 * 60 * 60);
  }

  private parseTime(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return new Date().setHours(hours, minutes, 0, 0);
  }

  private hasDriverTimeConflict(driverId: string, schedule: Partial<Schedule>): boolean {
    const conflictingSchedules = this.schedules.filter(s => 
      s.assignedDriverId === driverId &&
      s.id !== schedule.id &&
      s.status !== 'Cancelled' &&
      this.isTimeOverlap(s, schedule)
    );
    
    return conflictingSchedules.length > 0;
  }

  private hasVehicleTimeConflict(vehicleId: string, schedule: Partial<Schedule>): boolean {
    const conflictingSchedules = this.schedules.filter(s => 
      s.assignedVehicleId === vehicleId &&
      s.id !== schedule.id &&
      s.status !== 'Cancelled' &&
      this.isTimeOverlap(s, schedule)
    );
    
    return conflictingSchedules.length > 0;
  }

  private isTimeOverlap(schedule1: Partial<Schedule>, schedule2: Partial<Schedule>): boolean {
    if (!schedule1.startDate || !schedule1.endDate || !schedule2.startDate || !schedule2.endDate) {
      return false;
    }

    const start1 = new Date(`${schedule1.startDate} ${schedule1.startTime || '00:00'}`);
    const end1 = new Date(`${schedule1.endDate} ${schedule1.endTime || '23:59'}`);
    const start2 = new Date(`${schedule2.startDate} ${schedule2.startTime || '00:00'}`);
    const end2 = new Date(`${schedule2.endDate} ${schedule2.endTime || '23:59'}`);

    return start1 < end2 && end1 > start2;
  }

  private async updateResourceAvailability(schedule: Schedule): Promise<void> {
    // Update driver hours
    if (schedule.assignedDriverId) {
      const driver = this.drivers.find(d => d.driverId === schedule.assignedDriverId);
      if (driver) {
        const estimatedHours = schedule.estimatedHours || this.calculateEstimatedHours(schedule);
        driver.currentHours += estimatedHours;
        driver.hoursRemaining = Math.max(0, driver.maxHours - driver.currentHours);
      }
    }

    // Update vehicle status
    if (schedule.assignedVehicleId) {
      const vehicle = this.vehicles.find(v => v.vehicleId === schedule.assignedVehicleId);
      if (vehicle && schedule.status === 'In Progress') {
        vehicle.status = 'In Use';
      }
    }
  }

  private async freeResourceAvailability(schedule: Schedule): Promise<void> {
    // Free driver hours
    if (schedule.assignedDriverId) {
      const driver = this.drivers.find(d => d.driverId === schedule.assignedDriverId);
      if (driver) {
        const estimatedHours = schedule.estimatedHours || this.calculateEstimatedHours(schedule);
        driver.currentHours = Math.max(0, driver.currentHours - estimatedHours);
        driver.hoursRemaining = Math.min(driver.maxHours, driver.maxHours - driver.currentHours);
      }
    }

    // Free vehicle
    if (schedule.assignedVehicleId) {
      const vehicle = this.vehicles.find(v => v.vehicleId === schedule.assignedVehicleId);
      if (vehicle && vehicle.status === 'In Use') {
        vehicle.status = 'Available';
      }
    }
  }

  private generateDailySchedules(resourceId: string, weekStart: Date, weekSchedules: Schedule[], type: 'driver' | 'vehicle'): DailySchedule[] {
    const dailySchedules: DailySchedule[] = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const daySchedules = weekSchedules.filter(s => {
        if (type === 'driver') {
          return s.assignedDriverId === resourceId && s.startDate === dateStr;
        } else {
          return s.assignedVehicleId === resourceId && s.startDate === dateStr;
        }
      });

      const totalHours = daySchedules.reduce((sum, s) => sum + (s.estimatedHours || 8), 0);
      
      dailySchedules.push({
        date: dateStr,
        schedules: daySchedules,
        totalHours,
        hasConflicts: this.checkDayConflicts(daySchedules),
        conflicts: this.getDayConflicts(daySchedules)
      });
    }
    
    return dailySchedules;
  }

  private checkDayConflicts(schedules: Schedule[]): boolean {
    for (let i = 0; i < schedules.length; i++) {
      for (let j = i + 1; j < schedules.length; j++) {
        if (this.isTimeOverlap(schedules[i], schedules[j])) {
          return true;
        }
      }
    }
    return false;
  }

  private getDayConflicts(schedules: Schedule[]): string[] {
    const conflicts: string[] = [];
    for (let i = 0; i < schedules.length; i++) {
      for (let j = i + 1; j < schedules.length; j++) {
        if (this.isTimeOverlap(schedules[i], schedules[j])) {
          conflicts.push(`${schedules[i].title} overlaps with ${schedules[j].title}`);
        }
      }
    }
    return conflicts;
  }

  private calculateWeeklyHours(driverId: string, schedules: Schedule[]): number {
    return schedules
      .filter(s => s.assignedDriverId === driverId)
      .reduce((sum, s) => sum + (s.estimatedHours || 8), 0);
  }

  private calculateWeeklyMiles(vehicleId: string, schedules: Schedule[]): number {
    return schedules
      .filter(s => s.assignedVehicleId === vehicleId)
      .reduce((sum, s) => sum + (s.estimatedDistance || 0), 0);
  }

  private calculateDriverUtilization(driverId: string, schedules: Schedule[]): number {
    const driver = this.drivers.find(d => d.driverId === driverId);
    if (!driver) return 0;
    
    const weeklyHours = this.calculateWeeklyHours(driverId, schedules);
    return Math.min(100, (weeklyHours / driver.maxHours) * 100);
  }

  private calculateVehicleUtilization(vehicleId: string, schedules: Schedule[]): number {
    const weeklyHours = schedules
      .filter(s => s.assignedVehicleId === vehicleId)
      .reduce((sum, s) => sum + (s.estimatedHours || 8), 0);
    
    return Math.min(100, (weeklyHours / (7 * 24)) * 100);
  }

  private getVehicleMaintenanceAlerts(vehicle: VehicleAvailability): string[] {
    const alerts: string[] = [];
    
    if (vehicle.inspectionStatus === 'Due Soon') {
      alerts.push('Inspection due soon');
    }
    if (vehicle.inspectionStatus === 'Overdue') {
      alerts.push('Inspection overdue');
    }
    if (vehicle.hasIssues) {
      alerts.push(vehicle.issueDescription || 'Has reported issues');
    }
    
    return alerts;
  }

  private calculateOverallUtilization(): number {
    const totalCapacity = this.drivers.length * 40; // 40 hours per week per driver
    const totalScheduled = this.schedules
      .filter(s => s.status !== 'Cancelled')
      .reduce((sum, s) => sum + (s.estimatedHours || 8), 0);
    
    return totalCapacity > 0 ? Math.min(100, (totalScheduled / totalCapacity) * 100) : 0;
  }

  private calculateComplianceRate(): number {
    const compliantSchedules = this.schedules.filter(s => 
      s.hosCompliance !== false && 
      s.licenseVerified !== false && 
      s.vehicleInspectionCurrent !== false
    );
    
    return this.schedules.length > 0 ? (compliantSchedules.length / this.schedules.length) * 100 : 100;
  }

  private calculateOnTimePerformance(): number {
    const completedSchedules = this.schedules.filter(s => s.status === 'Completed');
    const onTimeSchedules = completedSchedules.filter(s => s.status === 'Completed');
    
    return completedSchedules.length > 0 ? (onTimeSchedules.length / completedSchedules.length) * 100 : 100;
  }

  private initializeMockData(): void {
    // Initialize mock drivers
    this.drivers = [
      {
        driverId: 'DRV-001',
        name: 'John Smith',
        status: 'Available',
        currentHours: 35,
        maxHours: 60,
        hoursRemaining: 25,
        licenseStatus: 'Valid',
        licenseExpiry: '2025-12-31',
        currentLocation: 'Dallas, TX',
        assignedVehicle: 'TRK-001',
        eldStatus: 'Connected',
        hasConflict: false
      },
      {
        driverId: 'DRV-002',
        name: 'Sarah Wilson',
        status: 'Available',
        currentHours: 28,
        maxHours: 60,
        hoursRemaining: 32,
        licenseStatus: 'Valid',
        licenseExpiry: '2026-03-15',
        currentLocation: 'Los Angeles, CA',
        eldStatus: 'Connected',
        hasConflict: false
      },
      {
        driverId: 'DRV-003',
        name: 'Mike Johnson',
        status: 'On Duty',
        currentHours: 45,
        maxHours: 60,
        hoursRemaining: 15,
        licenseStatus: 'Valid',
        licenseExpiry: '2025-08-20',
        currentLocation: 'Phoenix, AZ',
        assignedVehicle: 'TRK-002',
        eldStatus: 'Connected',
        hasConflict: false
      }
    ];

    // Initialize mock vehicles
    this.vehicles = [
      {
        vehicleId: 'TRK-001',
        name: 'Freightliner Cascadia #001',
        type: 'truck',
        status: 'Available',
        currentMileage: 125000,
        nextMaintenanceDue: '2025-02-15',
        lastInspection: '2024-12-01',
        inspectionStatus: 'Current',
        assignedDriver: 'DRV-001',
        currentLocation: 'Dallas, TX',
        fuelLevel: 85,
        hasIssues: false
      },
      {
        vehicleId: 'TRK-002',
        name: 'Peterbilt 579 #002',
        type: 'truck',
        status: 'In Use',
        currentMileage: 98000,
        nextMaintenanceDue: '2025-01-20',
        lastInspection: '2024-11-15',
        inspectionStatus: 'Due Soon',
        assignedDriver: 'DRV-003',
        currentLocation: 'Phoenix, AZ',
        fuelLevel: 60,
        hasIssues: false
      },
      {
        vehicleId: 'VAN-001',
        name: 'Ford Transit #001',
        type: 'van',
        status: 'Available',
        currentMileage: 45000,
        nextMaintenanceDue: '2025-03-01',
        lastInspection: '2024-12-10',
        inspectionStatus: 'Current',
        currentLocation: 'Houston, TX',
        fuelLevel: 75,
        hasIssues: false
      }
    ];

    // Initialize mock schedules
    this.schedules = [
      {
        id: 'SCH-001',
        title: 'Delivery to Austin Distribution Center',
        description: 'Regular weekly delivery run',
        startDate: '2025-01-03',
        endDate: '2025-01-03',
        startTime: '08:00',
        endTime: '16:00',
        status: 'Scheduled',
        priority: 'High',
        scheduleType: 'Delivery',
        assignedDriverId: 'DRV-001',
        driverName: 'John Smith',
        assignedVehicleId: 'TRK-001',
        vehicleName: 'Freightliner Cascadia #001',
        origin: 'Dallas, TX',
        destination: 'Austin, TX',
        estimatedDistance: 195,
        estimatedDuration: 480,
        estimatedHours: 8,
        hosCompliance: true,
        licenseVerified: true,
        vehicleInspectionCurrent: true,
        createdBy: 'Dispatcher',
        createdAt: '2025-01-02T10:00:00Z',
        updatedAt: '2025-01-02T10:00:00Z'
      },
      {
        id: 'SCH-002',
        title: 'Vehicle Maintenance - TRK-002',
        description: 'Scheduled maintenance inspection',
        startDate: '2025-01-04',
        endDate: '2025-01-04',
        startTime: '09:00',
        endTime: '12:00',
        status: 'Scheduled',
        priority: 'Medium',
        scheduleType: 'Maintenance',
        assignedVehicleId: 'TRK-002',
        vehicleName: 'Peterbilt 579 #002',
        estimatedHours: 3,
        maintenanceRequired: true,
        createdBy: 'Maintenance Manager',
        createdAt: '2025-01-01T14:00:00Z',
        updatedAt: '2025-01-01T14:00:00Z'
      }
    ];
  }
}

export const schedulingService = new SchedulingService();
