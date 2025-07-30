/**
 * Integrated Scheduling System Types
 * Comprehensive scheduling with driver/vehicle management integration
 */

export interface Schedule {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'Delayed';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  scheduleType: 'Delivery' | 'Pickup' | 'Maintenance' | 'Training' | 'Inspection' | 'Break' | 'Other';
  
  // Driver Assignment
  assignedDriverId?: string;
  driverName?: string;
  driverAvailabilityStatus?: 'Available' | 'Conflict' | 'HOS_Violation' | 'License_Issue';
  estimatedHours?: number;
  
  // Vehicle Assignment
  assignedVehicleId?: string;
  vehicleName?: string;
  vehicleAvailabilityStatus?: 'Available' | 'In_Use' | 'Maintenance_Required' | 'Out_Of_Service';
  
  // Route Information
  origin?: string;
  destination?: string;
  waypoints?: string[];
  estimatedDistance?: number;
  estimatedDuration?: number;
  routeOptimized?: boolean;
  
  // Compliance & Safety
  hosCompliance?: boolean;
  licenseVerified?: boolean;
  vehicleInspectionCurrent?: boolean;
  maintenanceRequired?: boolean;
  
  // Notifications & Updates
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastStatusUpdate?: string;
  notifications?: ScheduleNotification[];
  
  // Integration Fields
  loadId?: string;
  customerId?: string;
  shipmentDetails?: ShipmentInfo;
}

export interface ScheduleNotification {
  id: string;
  type: 'reminder' | 'status_change' | 'compliance_alert' | 'maintenance_alert';
  message: string;
  timestamp: string;
  read: boolean;
  severity: 'info' | 'warning' | 'error';
}

export interface ShipmentInfo {
  weight?: number;
  dimensions?: string;
  specialRequirements?: string[];
  pickupTime?: string;
  deliveryTime?: string;
  customerInstructions?: string;
}

export interface DriverAvailability {
  driverId: string;
  name: string;
  status: 'Available' | 'On Duty' | 'Off Duty' | 'Driving' | 'Inactive';
  currentHours: number;
  maxHours: number;
  hoursRemaining: number;
  nextAvailableTime?: string;
  licenseStatus: 'Valid' | 'Expired' | 'Suspended' | 'Restricted';
  licenseExpiry: string;
  currentLocation?: string;
  assignedVehicle?: string;
  eldStatus: 'Connected' | 'Disconnected' | 'Error';
  hasConflict: boolean;
  conflictReason?: string;
}

export interface VehicleAvailability {
  vehicleId: string;
  name: string;
  type: 'truck' | 'van' | 'trailer' | 'equipment';
  status: 'Available' | 'In Use' | 'Maintenance' | 'Out of Service';
  currentMileage: number;
  nextMaintenanceDue: string;
  lastInspection: string;
  inspectionStatus: 'Current' | 'Due Soon' | 'Overdue';
  assignedDriver?: string;
  currentLocation?: string;
  fuelLevel?: number;
  hasIssues: boolean;
  issueDescription?: string;
}

export interface ScheduleFilter {
  startDate?: string;
  endDate?: string;
  status?: Schedule['status'][];
  priority?: Schedule['priority'][];
  scheduleType?: Schedule['scheduleType'][];
  assignedDriverId?: string;
  assignedVehicleId?: string;
  searchTerm?: string;
}

export interface ScheduleStatistics {
  totalSchedules: number;
  scheduledCount: number;
  inProgressCount: number;
  completedCount: number;
  cancelledCount: number;
  delayedCount: number;
  utilizationRate: number;
  complianceRate: number;
  onTimePerformance: number;
}

export interface WeeklyScheduleView {
  weekStartDate: string;
  drivers: DriverWeeklySchedule[];
  vehicles: VehicleWeeklySchedule[];
  unassignedSchedules: Schedule[];
}

export interface DriverWeeklySchedule {
  driverId: string;
  driverName: string;
  schedules: DailySchedule[];
  totalHours: number;
  hosCompliance: boolean;
  utilization: number;
}

export interface VehicleWeeklySchedule {
  vehicleId: string;
  vehicleName: string;
  schedules: DailySchedule[];
  totalMiles: number;
  utilization: number;
  maintenanceAlerts: string[];
}

export interface DailySchedule {
  date: string;
  schedules: Schedule[];
  totalHours: number;
  hasConflicts: boolean;
  conflicts: string[];
}

export interface ScheduleConflict {
  type: 'time_overlap' | 'double_booking' | 'hos_violation' | 'maintenance_required' | 'license_expired';
  severity: 'warning' | 'error';
  message: string;
  affectedSchedules: string[];
  suggestions: string[];
}

export interface ScheduleValidation {
  isValid: boolean;
  conflicts: ScheduleConflict[];
  warnings: string[];
  recommendations: string[];
}
