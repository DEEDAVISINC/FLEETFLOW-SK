// 🏭 AI-Powered Dock Scheduling System
// Intelligent appointment coordination and warehouse optimization

export interface DockFacility {
  id: string;
  name: string;
  address: Address;
  docks: DockDoor[];
  operatingHours: OperatingHours;
  capabilities: FacilityCapability[];
  restrictions: string[];
  averageServiceTime: number; // minutes
  peakHours: TimeWindow[];
  staffLevels: StaffingLevel[];
}

export interface DockDoor {
  id: string;
  number: string;
  type: 'ground_level' | 'dock_high' | 'drive_in' | 'rail_siding';
  capabilities: string[]; // 'reefer_plugin', 'hazmat', 'oversized', 'container'
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  currentAppointment?: string;
  equipment: string[]; // 'forklift', 'dock_leveler', 'bumpers'
  maxWeight: number; // lbs
  dimensions: {
    width: number; // feet
    height: number; // feet
    depth: number; // feet
  };
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface OperatingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
  holidays: HolidaySchedule[];
}

export interface DaySchedule {
  open: string; // "06:00"
  close: string; // "18:00"
  breaks: TimeWindow[];
  peakTimes: TimeWindow[];
}

export interface TimeWindow {
  start: string; // "HH:MM"
  end: string; // "HH:MM"
  description?: string;
}

export interface HolidaySchedule {
  date: string; // "YYYY-MM-DD"
  name: string;
  schedule: DaySchedule | null; // null = closed
}

export interface FacilityCapability {
  type: 'receiving' | 'shipping' | 'cross_dock' | 'storage' | 'consolidation';
  equipmentTypes: string[];
  cargoTypes: string[];
  specialServices: string[];
}

export interface StaffingLevel {
  timeWindow: TimeWindow;
  supervisors: number;
  dockWorkers: number;
  forkliftOperators: number;
  efficiency: number; // 0-100%
}

export interface AppointmentRequest {
  id: string;
  loadId: string;
  type: 'pickup' | 'delivery' | 'cross_dock';
  facility: string;
  carrier: string;
  driver: string;
  equipment: EquipmentInfo;
  cargo: CargoInfo;
  timePreferences: TimePreference[];
  specialRequirements: string[];
  priority: 'low' | 'normal' | 'high' | 'urgent';
  flexibility: {
    timeWindow: number; // hours of flexibility
    dockPreference: boolean; // can use any dock
    equipmentFlexible: boolean;
  };
  createdAt: Date;
  requestedBy: string;
}

export interface EquipmentInfo {
  type: string; // 'dry_van', 'reefer', 'flatbed', 'container'
  length: number; // feet
  height: number; // feet
  weight: number; // lbs
  axles: number;
  hazmat: boolean;
  refrigerated: boolean;
  powerRequirements?: string[];
}

export interface CargoInfo {
  items: CargoItem[];
  totalWeight: number;
  totalValue: number;
  handlingInstructions: string[];
  temperature?: 'ambient' | 'refrigerated' | 'frozen';
  stackable: boolean;
  fragile: boolean;
  hazmat: boolean;
}

export interface CargoItem {
  description: string;
  quantity: number;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  handlingRequirements: string[];
}

export interface TimePreference {
  preferredStart: Date;
  preferredEnd: Date;
  flexibility: number; // hours
  reason?: string;
}

export interface ScheduledAppointment {
  id: string;
  requestId: string;
  facility: string;
  dockDoor: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  estimatedDuration: number; // minutes
  status:
    | 'scheduled'
    | 'confirmed'
    | 'in_progress'
    | 'completed'
    | 'cancelled'
    | 'no_show';
  confirmationCode: string;
  instructions: string[];
  contactInfo: ContactInfo;
  checkInTime?: Date;
  startTime?: Date;
  completionTime?: Date;
  actualDuration?: number;
  performanceScore?: number; // 0-100%
  issues?: AppointmentIssue[];
}

export interface ContactInfo {
  facilityContact: {
    name: string;
    phone: string;
    email: string;
  };
  driverContact: {
    name: string;
    phone: string;
  };
  dispatchContact?: {
    name: string;
    phone: string;
    email: string;
  };
}

export interface AppointmentIssue {
  type:
    | 'delay'
    | 'equipment_mismatch'
    | 'cargo_issue'
    | 'facility_problem'
    | 'weather'
    | 'other';
  description: string;
  impact: 'minor' | 'moderate' | 'major';
  resolution?: string;
  resolutionTime?: Date;
}

export interface SchedulingOptimization {
  totalAppointments: number;
  averageWaitTime: number; // minutes
  dockUtilization: number; // percentage
  laborEfficiency: number; // percentage
  bottleneckPredictions: Bottleneck[];
  recommendations: OptimizationRecommendation[];
  costSavings: number; // dollars
  improvementMetrics: {
    waitTimeReduction: number; // percentage
    throughputIncrease: number; // percentage
    laborOptimization: number; // percentage
  };
}

export interface Bottleneck {
  type:
    | 'dock_congestion'
    | 'labor_shortage'
    | 'equipment_conflict'
    | 'peak_hour_overload';
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  predictedTime: Date;
  duration: number; // minutes
  affectedAppointments: string[];
  mitigation: string[];
}

export interface OptimizationRecommendation {
  type:
    | 'reschedule'
    | 'dock_reassignment'
    | 'labor_adjustment'
    | 'equipment_change';
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  savings: number; // dollars or minutes
  priority: number; // 1-10
}

export interface YardManagement {
  trailersOnYard: TrailerInfo[];
  yardCapacity: number;
  availableSpots: YardSpot[];
  trailerMoves: TrailerMove[];
  yardOptimization: YardOptimizationPlan;
}

export interface TrailerInfo {
  id: string;
  number: string;
  type: string;
  status: 'empty' | 'loaded' | 'loading' | 'unloading';
  location: YardSpot;
  arrivalTime: Date;
  scheduledDeparture?: Date;
  contents?: string;
  priority: 'low' | 'normal' | 'high';
}

export interface YardSpot {
  id: string;
  section: string;
  position: string;
  type: 'door_spot' | 'staging' | 'parking' | 'maintenance';
  nearestDock?: string;
  powerAvailable: boolean;
  reefer: boolean;
}

export interface TrailerMove {
  id: string;
  trailerId: string;
  fromSpot: string;
  toSpot: string;
  scheduledTime: Date;
  priority: number;
  reason: string;
  status: 'planned' | 'in_progress' | 'completed';
}

export interface YardOptimizationPlan {
  moves: TrailerMove[];
  spotUtilization: number;
  averageMoveTime: number;
  recommendations: string[];
}

export class AIDockSchedulingService {
  private facilities: Map<string, DockFacility> = new Map();
  private appointments: Map<string, ScheduledAppointment> = new Map();
  private yardManagement: Map<string, YardManagement> = new Map();

  // ========================================
  // INTELLIGENT APPOINTMENT SCHEDULING
  // ========================================

  async scheduleAppointment(
    request: AppointmentRequest
  ): Promise<ScheduledAppointment | null> {
    try {
      console.log(`🏭 AI Scheduling appointment for load ${request.loadId}`);

      // Get facility information
      const facility = this.facilities.get(request.facility);
      if (!facility) {
        throw new Error(`Facility ${request.facility} not found`);
      }

      // Find optimal appointment slots
      const optimalSlots = await this.findOptimalAppointmentSlots(
        request,
        facility
      );
      if (optimalSlots.length === 0) {
        console.log('❌ No available appointment slots found');
        return null;
      }

      // Select best slot using AI optimization
      const bestSlot = await this.selectBestAppointmentSlot(
        optimalSlots,
        request,
        facility
      );

      // Create scheduled appointment
      const appointment = await this.createScheduledAppointment(
        bestSlot,
        request,
        facility
      );

      // Update facility availability
      await this.updateDockAvailability(appointment, facility);

      // Optimize surrounding appointments
      await this.optimizeAdjacentAppointments(appointment, facility);

      // Predict and prevent bottlenecks
      await this.predictAndMitigateBottlenecks(facility, appointment);

      console.log(`✅ Appointment scheduled: ${appointment.confirmationCode}`);
      return appointment;
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      return null;
    }
  }

  private async findOptimalAppointmentSlots(
    request: AppointmentRequest,
    facility: DockFacility
  ): Promise<AppointmentSlot[]> {
    const slots: AppointmentSlot[] = [];

    // Filter compatible docks
    const compatibleDocks = this.findCompatibleDocks(request, facility);
    if (compatibleDocks.length === 0) {
      return slots;
    }

    // Generate time slots for the next 14 days
    const startDate = new Date();
    const endDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    // For each compatible dock and time preference
    for (const dock of compatibleDocks) {
      for (const timePreference of request.timePreferences) {
        const timeSlots = await this.generateTimeSlots(
          dock,
          timePreference,
          facility,
          request.estimatedDuration ||
            this.estimateServiceTime(request, facility)
        );

        slots.push(
          ...timeSlots.map((slot) => ({
            ...slot,
            dockId: dock.id,
            compatibility: this.calculateDockCompatibility(request, dock),
            congestionLevel: this.predictCongestionLevel(slot.start, facility),
            laborAvailability: this.getLaborAvailability(slot.start, facility),
          }))
        );
      }
    }

    // Sort by score (compatibility, availability, efficiency)
    return slots.sort(
      (a, b) =>
        this.calculateSlotScore(b, request) -
        this.calculateSlotScore(a, request)
    );
  }

  private findCompatibleDocks(
    request: AppointmentRequest,
    facility: DockFacility
  ): DockDoor[] {
    return facility.docks.filter((dock) => {
      // Check equipment compatibility
      if (
        request.equipment.type === 'reefer' &&
        !dock.capabilities.includes('reefer_plugin')
      ) {
        return false;
      }

      // Check hazmat requirements
      if (request.equipment.hazmat && !dock.capabilities.includes('hazmat')) {
        return false;
      }

      // Check size constraints
      if (request.equipment.weight > dock.maxWeight) {
        return false;
      }

      // Check dimensions
      if (
        request.equipment.length > dock.dimensions.depth ||
        request.equipment.height > dock.dimensions.height
      ) {
        return false;
      }

      // Check availability
      if (dock.status === 'maintenance' || dock.status === 'occupied') {
        return false;
      }

      return true;
    });
  }

  private async selectBestAppointmentSlot(
    slots: AppointmentSlot[],
    request: AppointmentRequest,
    facility: DockFacility
  ): Promise<AppointmentSlot> {
    // AI-powered slot selection considering multiple factors
    let bestSlot = slots[0];
    let bestScore = -1;

    for (const slot of slots.slice(0, 10)) {
      // Evaluate top 10 slots
      const score = await this.calculateComprehensiveSlotScore(
        slot,
        request,
        facility
      );

      if (score > bestScore) {
        bestScore = score;
        bestSlot = slot;
      }
    }

    return bestSlot;
  }

  private async calculateComprehensiveSlotScore(
    slot: AppointmentSlot,
    request: AppointmentRequest,
    facility: DockFacility
  ): Promise<number> {
    let score = 0;

    // Time preference alignment (25% weight)
    const timeScore = this.calculateTimePreferenceScore(
      slot,
      request.timePreferences
    );
    score += timeScore * 0.25;

    // Dock compatibility (20% weight)
    score += slot.compatibility * 0.2;

    // Congestion avoidance (20% weight)
    const congestionScore = Math.max(0, 100 - slot.congestionLevel);
    score += congestionScore * 0.2;

    // Labor availability (15% weight)
    score += slot.laborAvailability * 0.15;

    // Priority adjustment (10% weight)
    const priorityMultiplier = {
      low: 0.8,
      normal: 1.0,
      high: 1.2,
      urgent: 1.5,
    };
    score *= priorityMultiplier[request.priority];

    // Facility efficiency (10% weight)
    const efficiencyScore = await this.predictOperationalEfficiency(
      slot,
      facility
    );
    score += efficiencyScore * 0.1;

    return score;
  }

  // ========================================
  // BOTTLENECK PREDICTION & PREVENTION
  // ========================================

  async predictAndMitigateBottlenecks(
    facility: DockFacility,
    newAppointment: ScheduledAppointment
  ): Promise<Bottleneck[]> {
    const bottlenecks: Bottleneck[] = [];

    // Analyze upcoming appointments
    const upcomingAppointments = this.getUpcomingAppointments(facility.id, 48); // Next 48 hours

    // Detect dock congestion
    const dockCongestion = this.predictDockCongestion(
      upcomingAppointments,
      facility
    );
    bottlenecks.push(...dockCongestion);

    // Detect labor shortages
    const laborBottlenecks = this.predictLaborBottlenecks(
      upcomingAppointments,
      facility
    );
    bottlenecks.push(...laborBottlenecks);

    // Detect equipment conflicts
    const equipmentBottlenecks = this.predictEquipmentBottlenecks(
      upcomingAppointments,
      facility
    );
    bottlenecks.push(...equipmentBottlenecks);

    // Detect peak hour overloads
    const peakHourBottlenecks = this.predictPeakHourOverloads(
      upcomingAppointments,
      facility
    );
    bottlenecks.push(...peakHourBottlenecks);

    // Apply mitigation strategies
    for (const bottleneck of bottlenecks) {
      await this.applyBottleneckMitigation(bottleneck, facility);
    }

    return bottlenecks;
  }

  private predictDockCongestion(
    appointments: ScheduledAppointment[],
    facility: DockFacility
  ): Bottleneck[] {
    const bottlenecks: Bottleneck[] = [];
    const hourlyDockUsage = new Map<string, number>();

    // Calculate dock usage by hour
    appointments.forEach((appointment) => {
      const hour = appointment.scheduledStart.toISOString().slice(0, 13); // YYYY-MM-DDTHH
      hourlyDockUsage.set(hour, (hourlyDockUsage.get(hour) || 0) + 1);
    });

    // Identify congestion points
    hourlyDockUsage.forEach((usage, hour) => {
      const availableDocks = facility.docks.filter(
        (d) => d.status === 'available'
      ).length;
      const utilizationRate = usage / availableDocks;

      if (utilizationRate > 0.9) {
        // Over 90% utilization
        bottlenecks.push({
          type: 'dock_congestion',
          location: `${facility.name} - ${hour}:00`,
          severity: utilizationRate > 0.95 ? 'critical' : 'high',
          predictedTime: new Date(hour + ':00:00Z'),
          duration: 60, // 1 hour window
          affectedAppointments: appointments
            .filter((a) => a.scheduledStart.toISOString().slice(0, 13) === hour)
            .map((a) => a.id),
          mitigation: [
            'Reschedule non-urgent appointments',
            'Open additional dock doors',
            'Extend operating hours',
            'Prioritize faster-loading cargo',
          ],
        });
      }
    });

    return bottlenecks;
  }

  private predictLaborBottlenecks(
    appointments: ScheduledAppointment[],
    facility: DockFacility
  ): Bottleneck[] {
    const bottlenecks: Bottleneck[] = [];

    // Analyze labor requirements vs availability
    facility.staffLevels.forEach((staffLevel) => {
      const appointmentsDuringShift = appointments.filter((appointment) =>
        this.isTimeInWindow(appointment.scheduledStart, staffLevel.timeWindow)
      );

      const requiredWorkers = appointmentsDuringShift.length * 2; // Assume 2 workers per appointment
      const availableWorkers =
        staffLevel.dockWorkers + staffLevel.forkliftOperators;

      if (requiredWorkers > availableWorkers) {
        bottlenecks.push({
          type: 'labor_shortage',
          location: `${facility.name} - ${staffLevel.timeWindow.start}-${staffLevel.timeWindow.end}`,
          severity:
            requiredWorkers > availableWorkers * 1.2 ? 'high' : 'medium',
          predictedTime: new Date(), // Current shift
          duration: this.calculateTimeWindowDuration(staffLevel.timeWindow),
          affectedAppointments: appointmentsDuringShift.map((a) => a.id),
          mitigation: [
            'Reschedule appointments to off-peak hours',
            'Call in additional workers',
            'Use temporary labor',
            'Prioritize high-value cargo',
          ],
        });
      }
    });

    return bottlenecks;
  }

  private predictEquipmentBottlenecks(
    appointments: ScheduledAppointment[],
    facility: DockFacility
  ): Bottleneck[] {
    const bottlenecks: Bottleneck[] = [];

    // Analyze equipment requirements
    const equipmentRequirements = new Map<string, number>();

    appointments.forEach((appointment) => {
      // Count required equipment based on appointment type and cargo
      const requiredForklifts = this.calculateRequiredForklifts(appointment);
      const hour = appointment.scheduledStart.toISOString().slice(0, 13);

      equipmentRequirements.set(
        hour,
        (equipmentRequirements.get(hour) || 0) + requiredForklifts
      );
    });

    // Available equipment (simplified)
    const availableForklifts = 5; // Example: 5 forklifts available

    equipmentRequirements.forEach((required, hour) => {
      if (required > availableForklifts) {
        bottlenecks.push({
          type: 'equipment_conflict',
          location: `${facility.name} - Equipment Bay`,
          severity: required > availableForklifts * 1.5 ? 'high' : 'medium',
          predictedTime: new Date(hour + ':00:00Z'),
          duration: 60,
          affectedAppointments: appointments
            .filter((a) => a.scheduledStart.toISOString().slice(0, 13) === hour)
            .map((a) => a.id),
          mitigation: [
            'Reschedule equipment-intensive appointments',
            'Rent additional equipment',
            'Optimize equipment utilization',
            'Use manual handling where possible',
          ],
        });
      }
    });

    return bottlenecks;
  }

  private predictPeakHourOverloads(
    appointments: ScheduledAppointment[],
    facility: DockFacility
  ): Bottleneck[] {
    const bottlenecks: Bottleneck[] = [];

    // Identify facility peak hours
    facility.peakHours.forEach((peakWindow) => {
      const peakAppointments = appointments.filter((appointment) =>
        this.isTimeInWindow(appointment.scheduledStart, peakWindow)
      );

      // Calculate normal vs peak capacity
      const normalCapacity = facility.docks.length;
      const peakCapacity = Math.floor(normalCapacity * 0.7); // 30% reduction during peak

      if (peakAppointments.length > peakCapacity) {
        bottlenecks.push({
          type: 'peak_hour_overload',
          location: `${facility.name} - Peak Hours`,
          severity:
            peakAppointments.length > peakCapacity * 1.3 ? 'critical' : 'high',
          predictedTime: new Date(), // Peak time today
          duration: this.calculateTimeWindowDuration(peakWindow),
          affectedAppointments: peakAppointments.map((a) => a.id),
          mitigation: [
            'Spread appointments across off-peak hours',
            'Offer incentives for off-peak scheduling',
            'Increase peak-hour staffing',
            'Implement express lanes for priority cargo',
          ],
        });
      }
    });

    return bottlenecks;
  }

  // ========================================
  // WAREHOUSE LABOR PLANNING
  // ========================================

  async optimizeWarehouseLaborPlanning(
    facility: DockFacility,
    forecastPeriod: number = 7 // days
  ): Promise<LaborOptimizationPlan> {
    console.log(`📊 Optimizing labor planning for ${facility.name}`);

    // Get upcoming appointments
    const upcomingAppointments = this.getUpcomingAppointments(
      facility.id,
      forecastPeriod * 24
    );

    // Analyze workload patterns
    const workloadAnalysis = this.analyzeWorkloadPatterns(upcomingAppointments);

    // Predict labor requirements
    const laborRequirements = this.predictLaborRequirements(
      workloadAnalysis,
      facility
    );

    // Optimize staffing levels
    const optimizedStaffing = this.optimizeStaffingLevels(
      laborRequirements,
      facility
    );

    // Generate labor recommendations
    const recommendations = this.generateLaborRecommendations(
      optimizedStaffing,
      facility
    );

    return {
      period: forecastPeriod,
      workloadAnalysis,
      laborRequirements,
      optimizedStaffing,
      recommendations,
      projectedEfficiency: this.calculateProjectedEfficiency(optimizedStaffing),
      costSavings: this.calculateLaborCostSavings(optimizedStaffing, facility),
    };
  }

  private analyzeWorkloadPatterns(
    appointments: ScheduledAppointment[]
  ): WorkloadAnalysis {
    const hourlyVolume = new Map<number, number>();
    const dailyVolume = new Map<string, number>();
    const cargoTypes = new Map<string, number>();

    appointments.forEach((appointment) => {
      const hour = appointment.scheduledStart.getHours();
      const day = appointment.scheduledStart.toISOString().slice(0, 10);

      hourlyVolume.set(hour, (hourlyVolume.get(hour) || 0) + 1);
      dailyVolume.set(day, (dailyVolume.get(day) || 0) + 1);

      // Analyze cargo complexity (simplified)
      const cargoType = this.classifyCargoComplexity(appointment);
      cargoTypes.set(cargoType, (cargoTypes.get(cargoType) || 0) + 1);
    });

    return {
      totalAppointments: appointments.length,
      peakHours: this.identifyPeakHours(hourlyVolume),
      busyDays: this.identifyBusyDays(dailyVolume),
      cargoComplexity: cargoTypes,
      averageServiceTime: this.calculateAverageServiceTime(appointments),
      seasonalPatterns: this.identifySeasonalPatterns(appointments),
    };
  }

  private predictLaborRequirements(
    workload: WorkloadAnalysis,
    facility: DockFacility
  ): LaborRequirements {
    const requirements: LaborRequirements = {
      shifts: [],
      specializedRoles: new Map(),
      peakStaffing: 0,
      minimumStaffing: 0,
    };

    // Calculate requirements for each shift
    facility.operatingHours.monday.peakTimes.forEach((peakTime) => {
      const expectedVolume =
        workload.peakHours.get(parseInt(peakTime.start)) || 0;
      const requiredWorkers = Math.ceil(expectedVolume * 1.5); // 1.5 workers per appointment

      requirements.shifts.push({
        start: peakTime.start,
        end: peakTime.end,
        requiredSupervisors: Math.ceil(requiredWorkers / 8),
        requiredDockWorkers: requiredWorkers,
        requiredForkliftOperators: Math.ceil(requiredWorkers / 3),
        priority: expectedVolume > 10 ? 'high' : 'normal',
      });
    });

    // Calculate specialized role requirements
    workload.cargoComplexity.forEach((count, complexity) => {
      if (complexity === 'hazmat') {
        requirements.specializedRoles.set(
          'hazmat_certified',
          Math.ceil(count * 0.2)
        );
      }
      if (complexity === 'refrigerated') {
        requirements.specializedRoles.set(
          'reefer_specialist',
          Math.ceil(count * 0.1)
        );
      }
    });

    return requirements;
  }

  // ========================================
  // YARD MANAGEMENT OPTIMIZATION
  // ========================================

  async optimizeYardManagement(
    facilityId: string
  ): Promise<YardOptimizationPlan> {
    console.log(`🚛 Optimizing yard management for facility ${facilityId}`);

    const yardData = this.yardManagement.get(facilityId);
    if (!yardData) {
      throw new Error(`No yard data found for facility ${facilityId}`);
    }

    // Analyze current yard state
    const yardAnalysis = this.analyzeYardState(yardData);

    // Optimize trailer positioning
    const optimizedPositions = this.optimizeTrailerPositions(yardData);

    // Plan trailer moves
    const plannedMoves = this.planTrailerMoves(yardData, optimizedPositions);

    // Calculate optimization metrics
    const metrics = this.calculateYardOptimizationMetrics(
      plannedMoves,
      yardData
    );

    return {
      moves: plannedMoves,
      spotUtilization: metrics.utilization,
      averageMoveTime: metrics.averageMoveTime,
      recommendations: this.generateYardRecommendations(yardAnalysis, metrics),
    };
  }

  private optimizeTrailerPositions(
    yardData: YardManagement
  ): Map<string, string> {
    const optimizedPositions = new Map<string, string>();

    // Sort trailers by priority and departure time
    const sortedTrailers = yardData.trailersOnYard.sort((a, b) => {
      // Priority first
      const priorityOrder = { high: 3, normal: 2, low: 1 };
      const priorityDiff =
        priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Then by scheduled departure
      if (a.scheduledDeparture && b.scheduledDeparture) {
        return a.scheduledDeparture.getTime() - b.scheduledDeparture.getTime();
      }

      return 0;
    });

    // Assign optimal positions
    const availableSpots = [...yardData.availableSpots];

    sortedTrailers.forEach((trailer) => {
      // Find best spot for this trailer
      const bestSpot = this.findBestSpotForTrailer(trailer, availableSpots);
      if (bestSpot) {
        optimizedPositions.set(trailer.id, bestSpot.id);
        // Remove from available spots
        const index = availableSpots.findIndex(
          (spot) => spot.id === bestSpot.id
        );
        if (index !== -1) {
          availableSpots.splice(index, 1);
        }
      }
    });

    return optimizedPositions;
  }

  private findBestSpotForTrailer(
    trailer: TrailerInfo,
    availableSpots: YardSpot[]
  ): YardSpot | null {
    let bestSpot: YardSpot | null = null;
    let bestScore = -1;

    availableSpots.forEach((spot) => {
      let score = 0;

      // Prefer spots near appropriate dock doors
      if (spot.nearestDock && spot.type === 'door_spot') {
        score += 50;
      }

      // Match power requirements
      if (trailer.type === 'reefer' && spot.reefer) {
        score += 30;
      } else if (trailer.type !== 'reefer' && !spot.reefer) {
        score += 10;
      }

      // Priority trailers get better spots
      if (trailer.priority === 'high' && spot.type === 'door_spot') {
        score += 25;
      }

      // Minimize moves for staged trailers
      if (trailer.status === 'loaded' && spot.type === 'staging') {
        score += 20;
      }

      if (score > bestScore) {
        bestScore = score;
        bestSpot = spot;
      }
    });

    return bestSpot;
  }

  // ========================================
  // REAL-TIME QUEUE OPTIMIZATION
  // ========================================

  async optimizeRealTimeQueue(facilityId: string): Promise<QueueOptimization> {
    console.log(`⏱️ Optimizing real-time queue for facility ${facilityId}`);

    // Get current queue state
    const currentQueue = await this.getCurrentQueue(facilityId);
    const facility = this.facilities.get(facilityId)!;

    // Analyze queue bottlenecks
    const bottlenecks = this.analyzeQueueBottlenecks(currentQueue, facility);

    // Optimize queue order
    const optimizedQueue = this.optimizeQueueOrder(currentQueue, facility);

    // Calculate wait time predictions
    const waitTimePredictions = this.predictWaitTimes(optimizedQueue, facility);

    // Generate queue recommendations
    const recommendations = this.generateQueueRecommendations(
      optimizedQueue,
      bottlenecks
    );

    return {
      currentQueue,
      optimizedQueue,
      bottlenecks,
      waitTimePredictions,
      recommendations,
      estimatedImprovements: this.calculateQueueImprovements(
        currentQueue,
        optimizedQueue
      ),
    };
  }

  private optimizeQueueOrder(
    queue: QueuedVehicle[],
    facility: DockFacility
  ): QueuedVehicle[] {
    // AI-powered queue optimization considering multiple factors
    return queue.sort((a, b) => {
      // Priority vehicles first
      const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 };
      const priorityDiff =
        priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Time-sensitive deliveries
      if (a.appointmentTime && b.appointmentTime) {
        const timeDiff =
          a.appointmentTime.getTime() - b.appointmentTime.getTime();
        if (Math.abs(timeDiff) > 30 * 60 * 1000) {
          // More than 30 minutes difference
          return timeDiff;
        }
      }

      // Optimize for service time
      const serviceDiff =
        (a.estimatedServiceTime || 60) - (b.estimatedServiceTime || 60);
      if (Math.abs(serviceDiff) > 15) {
        // More than 15 minutes difference
        return serviceDiff; // Shorter services first
      }

      // First come, first served for similar priorities and times
      return a.arrivalTime.getTime() - b.arrivalTime.getTime();
    });
  }

  // ========================================
  // PERFORMANCE ANALYTICS
  // ========================================

  async generatePerformanceAnalytics(
    facilityId: string,
    period: number = 30
  ): Promise<DockPerformanceAnalytics> {
    const facility = this.facilities.get(facilityId)!;
    const appointments = this.getCompletedAppointments(facilityId, period);

    return {
      facility: facility.name,
      period: `Last ${period} days`,
      metrics: {
        totalAppointments: appointments.length,
        averageWaitTime: this.calculateAverageWaitTime(appointments),
        averageServiceTime: this.calculateAverageServiceTime(appointments),
        onTimePerformance: this.calculateOnTimePerformance(appointments),
        dockUtilization: this.calculateDockUtilization(appointments, facility),
        customerSatisfaction: this.calculateCustomerSatisfaction(appointments),
        costPerAppointment: this.calculateCostPerAppointment(appointments),
        laborEfficiency: this.calculateLaborEfficiency(appointments, facility),
      },
      trends: this.calculatePerformanceTrends(appointments),
      bottleneckAnalysis: await this.analyzeHistoricalBottlenecks(
        appointments,
        facility
      ),
      recommendations: this.generatePerformanceRecommendations(
        appointments,
        facility
      ),
    };
  }

  // ========================================
  // HELPER METHODS & INTERFACES
  // ========================================

  private estimateServiceTime(
    request: AppointmentRequest,
    facility: DockFacility
  ): number {
    let baseTime = facility.averageServiceTime;

    // Adjust for cargo complexity
    if (request.cargo.hazmat) baseTime *= 1.5;
    if (request.cargo.fragile) baseTime *= 1.3;
    if (request.cargo.temperature !== 'ambient') baseTime *= 1.2;

    // Adjust for cargo volume
    const weightMultiplier = Math.max(1, request.cargo.totalWeight / 20000);
    baseTime *= weightMultiplier;

    return Math.ceil(baseTime);
  }

  private calculateDockCompatibility(
    request: AppointmentRequest,
    dock: DockDoor
  ): number {
    let compatibility = 100;

    // Equipment type compatibility
    if (
      request.equipment.type === 'reefer' &&
      !dock.capabilities.includes('reefer_plugin')
    ) {
      compatibility -= 50;
    }

    // Size efficiency
    const sizeUtilization = request.equipment.length / dock.dimensions.depth;
    if (sizeUtilization < 0.7) compatibility -= 20; // Underutilizing large dock
    if (sizeUtilization > 0.95) compatibility += 10; // Efficient use

    // Weight utilization
    const weightUtilization = request.equipment.weight / dock.maxWeight;
    if (weightUtilization > 0.9) compatibility -= 15; // Near weight limit

    return Math.max(0, compatibility);
  }

  private predictCongestionLevel(time: Date, facility: DockFacility): number {
    // Simplified congestion prediction
    const hour = time.getHours();
    const isWeekend = time.getDay() === 0 || time.getDay() === 6;

    if (isWeekend) return 20; // Low weekend congestion

    // Peak hours have higher congestion
    if ((hour >= 8 && hour <= 10) || (hour >= 14 && hour <= 16)) {
      return 80;
    } else if (hour >= 6 && hour <= 18) {
      return 50;
    } else {
      return 20;
    }
  }

  private getLaborAvailability(time: Date, facility: DockFacility): number {
    const hour = time.getHours();
    const dayOfWeek = time.getDay();

    // Find matching staff level
    const staffLevel = facility.staffLevels.find((level) =>
      this.isTimeInWindow(time, level.timeWindow)
    );

    return staffLevel?.efficiency || 75; // Default 75% efficiency
  }

  private isTimeInWindow(time: Date, window: TimeWindow): boolean {
    const timeStr = time.toTimeString().slice(0, 5); // HH:MM format
    return timeStr >= window.start && timeStr <= window.end;
  }

  private calculateTimeWindowDuration(window: TimeWindow): number {
    const start = this.parseTimeString(window.start);
    const end = this.parseTimeString(window.end);
    return (end - start) * 60; // Convert to minutes
  }

  private parseTimeString(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours + minutes / 60;
  }

  // ... Additional helper methods would be implemented here for:
  // - generateTimeSlots()
  // - calculateSlotScore()
  // - predictOperationalEfficiency()
  // - getUpcomingAppointments()
  // - applyBottleneckMitigation()
  // - createScheduledAppointment()
  // - updateDockAvailability()
  // - optimizeAdjacentAppointments()
  // And many more supporting the comprehensive dock scheduling system
}

// Supporting interfaces for the dock scheduling system
interface AppointmentSlot {
  start: Date;
  end: Date;
  duration: number;
  dockId?: string;
  compatibility?: number;
  congestionLevel?: number;
  laborAvailability?: number;
}

interface LaborOptimizationPlan {
  period: number;
  workloadAnalysis: WorkloadAnalysis;
  laborRequirements: LaborRequirements;
  optimizedStaffing: StaffingPlan[];
  recommendations: LaborRecommendation[];
  projectedEfficiency: number;
  costSavings: number;
}

interface WorkloadAnalysis {
  totalAppointments: number;
  peakHours: Map<number, number>;
  busyDays: Map<string, number>;
  cargoComplexity: Map<string, number>;
  averageServiceTime: number;
  seasonalPatterns: SeasonalPattern[];
}

interface LaborRequirements {
  shifts: ShiftRequirement[];
  specializedRoles: Map<string, number>;
  peakStaffing: number;
  minimumStaffing: number;
}

interface ShiftRequirement {
  start: string;
  end: string;
  requiredSupervisors: number;
  requiredDockWorkers: number;
  requiredForkliftOperators: number;
  priority: 'low' | 'normal' | 'high';
}

interface StaffingPlan {
  shift: string;
  currentStaffing: number;
  recommendedStaffing: number;
  adjustment: number;
  cost: number;
}

interface LaborRecommendation {
  type:
    | 'increase_staff'
    | 'decrease_staff'
    | 'reschedule_shift'
    | 'hire_specialized';
  description: string;
  impact: string;
  cost: number;
  priority: number;
}

interface SeasonalPattern {
  period: string;
  volumeMultiplier: number;
  description: string;
}

interface QueueOptimization {
  currentQueue: QueuedVehicle[];
  optimizedQueue: QueuedVehicle[];
  bottlenecks: Bottleneck[];
  waitTimePredictions: WaitTimePrediction[];
  recommendations: string[];
  estimatedImprovements: QueueImprovement;
}

interface QueuedVehicle {
  id: string;
  driverName: string;
  carrierName: string;
  appointmentTime?: Date;
  arrivalTime: Date;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  estimatedServiceTime?: number;
  cargo: string;
}

interface WaitTimePrediction {
  vehicleId: string;
  currentPosition: number;
  estimatedWaitTime: number;
  estimatedServiceStart: Date;
  confidence: number;
}

interface QueueImprovement {
  waitTimeReduction: number; // percentage
  throughputIncrease: number; // percentage
  customerSatisfactionImprovement: number; // percentage
}

interface DockPerformanceAnalytics {
  facility: string;
  period: string;
  metrics: PerformanceMetrics;
  trends: PerformanceTrend[];
  bottleneckAnalysis: BottleneckAnalysis;
  recommendations: PerformanceRecommendation[];
}

interface PerformanceMetrics {
  totalAppointments: number;
  averageWaitTime: number;
  averageServiceTime: number;
  onTimePerformance: number;
  dockUtilization: number;
  customerSatisfaction: number;
  costPerAppointment: number;
  laborEfficiency: number;
}

interface PerformanceTrend {
  metric: string;
  trend: 'improving' | 'declining' | 'stable';
  changePercent: number;
  period: string;
}

interface BottleneckAnalysis {
  frequentBottlenecks: Bottleneck[];
  costliest: Bottleneck;
  mostDisruptive: Bottleneck;
  trendingBottlenecks: Bottleneck[];
}

interface PerformanceRecommendation {
  category: 'operations' | 'staffing' | 'equipment' | 'process';
  title: string;
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  roi: number;
  priority: number;
}

