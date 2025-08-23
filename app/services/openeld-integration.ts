'use client';

// FleetFlow OpenELD Integration Service - AI-Powered Open Source ELD
// Enhanced with Flowter AI, Live Tracking, and FleetFlow Ecosystem Integration
// Based on open source ELD protocols and FMCSA requirements

export interface OpenELDDevice {
  deviceId: string;
  serialNumber: string;
  manufacturer: string;
  model: string;
  firmwareVersion: string;
  lastSync: string;
  status: 'connected' | 'disconnected' | 'error' | 'maintenance';
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: string;
  };
  diagnostics: {
    batteryLevel: number;
    signalStrength: number;
    storageUsage: number;
    temperature: number;
  };
}

export interface OpenELDDriver {
  driverId: string;
  licenseNumber: string;
  licenseState: string;
  licenseClass: string;
  medicalCardExpiry: string;
  eldStatus: 'certified' | 'uncertified' | 'exempt';
  deviceId?: string;
  lastLogin: string;
}

export interface OpenELDLogEntry {
  id: string;
  driverId: string;
  deviceId: string;
  timestamp: string;
  eventType:
    | 'login'
    | 'logout'
    | 'power_on'
    | 'power_off'
    | 'malfunction'
    | 'data_transfer';
  eventCode: string;
  eventDescription: string;
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  odometer: number;
  engineHours: number;
  dataSource: 'automatic' | 'manual' | 'edited';
  annotation?: string;
}

export interface OpenELDDutyStatus {
  id: string;
  driverId: string;
  deviceId: string;
  status:
    | 'off_duty'
    | 'sleeper_berth'
    | 'driving'
    | 'on_duty'
    | 'yard_move'
    | 'personal_conveyance';
  startTime: string;
  endTime?: string;
  duration: number;
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  odometer: number;
  engineHours: number;
  dataSource: 'automatic' | 'manual' | 'edited';
  annotation?: string;
  certifyingDriverId?: string;
  certifyingDriverName?: string;
  certificationDateTime?: string;
}

export interface OpenELDWeightComplianceLog {
  id: string;
  driverId: string;
  deviceId: string;
  loadId: string;
  timestamp: string;
  cargoWeight: number;
  totalWeight: number;
  truckConfiguration: {
    id: string;
    name: string;
    totalAxles: number;
    maxGrossWeight: number;
  };
  routeStates: string[];
  complianceResult: {
    isCompliant: boolean;
    safetyRating: 'SAFE' | 'CAUTION' | 'OVERWEIGHT';
    violations: Array<{
      type: 'GROSS_WEIGHT' | 'AXLE_WEIGHT' | 'BRIDGE_FORMULA' | 'STATE_LIMIT';
      description: string;
      currentWeight: number;
      maxAllowed: number;
      excessWeight: number;
      severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      fineRange?: string;
    }>;
    requiredPermits: string[];
    recommendations: string[];
  };
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  odometer: number;
  weighStationInfo?: {
    stationName: string;
    stationId: string;
    inspectionNumber?: string;
    inspectorBadge?: string;
  };
  exportedAt?: string;
  dataSource: 'automatic' | 'weigh_station' | 'manual';
  annotation?: string;
}

export interface OpenELDWeightInspection {
  id: string;
  driverId: string;
  deviceId: string;
  inspectionDate: string;
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
    stationName: string;
    stateCode: string;
  };
  inspector: {
    name: string;
    badge: string;
    agency: string;
  };
  inspectionType: 'DOT' | 'WEIGH_STATION' | 'ROADSIDE' | 'TERMINAL';
  weightResults: {
    steerAxle: number;
    driveAxles: number;
    trailerAxles: number;
    grossWeight: number;
    scaleAccuracy: string;
  };
  violations: Array<{
    code: string;
    description: string;
    severity: 'WARNING' | 'VIOLATION' | 'OUT_OF_SERVICE';
    fine?: number;
  }>;
  permits: string[];
  inspectionOutcome: 'PASSED' | 'VIOLATIONS' | 'OUT_OF_SERVICE';
  followUpRequired: boolean;
  documentPath?: string;
  notes?: string;
}

export interface OpenELDViolation {
  id: string;
  driverId: string;
  deviceId: string;
  violationType:
    | 'hours_exceeded'
    | 'missing_log'
    | 'form_manner'
    | 'weight_violation'
    | 'break_required'
    | 'cycle_violation';
  severity: 'warning' | 'violation' | 'critical';
  description: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
  requiredAction?: string;
  resolutionDate?: string;
  resolutionNotes?: string;
}

export interface OpenELDComplianceReport {
  driverId: string;
  reportDate: string;
  cycle: '7_day' | '8_day';
  totalHours: number;
  drivingHours: number;
  onDutyHours: number;
  offDutyHours: number;
  sleeperBerthHours: number;
  violations: OpenELDViolation[];
  compliance: {
    compliant: boolean;
    issues: string[];
    recommendations: string[];
    aiScore: number; // Flowter AI compliance score (0-100)
    riskLevel: 'low' | 'medium' | 'high';
  };
  flowterInsights?: {
    predictedViolations: string[];
    efficiencyScore: number;
    maintenanceAlerts: string[];
    routeOptimizationSuggestions: string[];
  };
}

// Enhanced interfaces for FleetFlow integration
export interface FleetFlowIntegration {
  liveTrackingEnabled: boolean;
  dispatchIntegration: boolean;
  flowterAiEnabled: boolean;
  dotComplianceSync: boolean;
}

export interface AIInsight {
  id: string;
  type: 'compliance' | 'efficiency' | 'maintenance' | 'safety';
  priority: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  recommendation: string;
  confidence: number; // 0-100
  timestamp: string;
}

class OpenELDIntegrationService {
  private devices: Map<string, OpenELDDevice> = new Map();
  private drivers: Map<string, OpenELDDriver> = new Map();
  private dutyLogs: Map<string, OpenELDDutyStatus[]> = new Map();
  private violations: Map<string, OpenELDViolation[]> = new Map();
  private logEntries: Map<string, OpenELDLogEntry[]> = new Map();
  private aiInsights: Map<string, AIInsight[]> = new Map();
  private fleetFlowIntegration: FleetFlowIntegration = {
    liveTrackingEnabled: true,
    dispatchIntegration: true,
    flowterAiEnabled: true,
    dotComplianceSync: true,
  };

  constructor() {
    this.initializeMockData();
    this.initializeAIInsights();
  }

  // Initialize with realistic OpenELD mock data
  private initializeMockData(): void {
    // Mock OpenELD devices
    const mockDevices: OpenELDDevice[] = [
      {
        deviceId: 'OPENELD-001',
        serialNumber: 'SN2024001',
        manufacturer: 'OpenELD Solutions',
        model: 'OE-2000',
        firmwareVersion: 'v2.1.4',
        lastSync: new Date().toISOString(),
        status: 'connected',
        location: {
          latitude: 32.7767,
          longitude: -96.797,
          accuracy: 5,
          timestamp: new Date().toISOString(),
        },
        diagnostics: {
          batteryLevel: 85,
          signalStrength: 92,
          storageUsage: 23,
          temperature: 72,
        },
      },
      {
        deviceId: 'OPENELD-002',
        serialNumber: 'SN2024002',
        manufacturer: 'OpenELD Solutions',
        model: 'OE-2000',
        firmwareVersion: 'v2.1.4',
        lastSync: new Date().toISOString(),
        status: 'connected',
        location: {
          latitude: 33.749,
          longitude: -84.388,
          accuracy: 8,
          timestamp: new Date().toISOString(),
        },
        diagnostics: {
          batteryLevel: 78,
          signalStrength: 88,
          storageUsage: 31,
          temperature: 68,
        },
      },
    ];

    mockDevices.forEach((device) => this.devices.set(device.deviceId, device));

    // Mock drivers with OpenELD certification
    const mockDrivers: OpenELDDriver[] = [
      {
        driverId: 'DRV-001',
        licenseNumber: 'TX1234567',
        licenseState: 'TX',
        licenseClass: 'A',
        medicalCardExpiry: '2025-12-31',
        eldStatus: 'certified',
        deviceId: 'OPENELD-001',
        lastLogin: new Date().toISOString(),
      },
      {
        driverId: 'DRV-002',
        licenseNumber: 'GA9876543',
        licenseState: 'GA',
        licenseClass: 'A',
        medicalCardExpiry: '2025-10-15',
        eldStatus: 'certified',
        deviceId: 'OPENELD-002',
        lastLogin: new Date().toISOString(),
      },
    ];

    mockDrivers.forEach((driver) => this.drivers.set(driver.driverId, driver));
  }

  // Initialize Flowter AI insights
  private initializeAIInsights(): void {
    const mockInsights: AIInsight[] = [
      {
        id: 'insight-001',
        type: 'compliance',
        priority: 'medium',
        message: 'Driver DRV-001 approaching 11-hour limit in 2 hours',
        recommendation: 'Suggest rest area stop or end-of-duty planning',
        confidence: 92,
        timestamp: new Date().toISOString(),
      },
      {
        id: 'insight-002',
        type: 'efficiency',
        priority: 'low',
        message:
          'Route optimization available - save 15 minutes on current trip',
        recommendation: 'Enable AI route optimization in dispatch system',
        confidence: 85,
        timestamp: new Date().toISOString(),
      },
      {
        id: 'insight-003',
        type: 'maintenance',
        priority: 'high',
        message: 'Device OPENELD-001 battery degradation detected',
        recommendation: 'Schedule device maintenance within 7 days',
        confidence: 78,
        timestamp: new Date().toISOString(),
      },
    ];

    // Assign insights to drivers
    this.drivers.forEach((driver) => {
      this.aiInsights.set(driver.driverId, mockInsights);
    });
  }

  // Enhanced FleetFlow Integration Methods
  async getFlowterAIInsights(driverId: string): Promise<AIInsight[]> {
    if (!this.fleetFlowIntegration.flowterAiEnabled) {
      return [];
    }
    return this.aiInsights.get(driverId) || [];
  }

  async generateAIComplianceScore(driverId: string): Promise<number> {
    const compliance = await this.checkCompliance(driverId);
    const insights = await this.getFlowterAIInsights(driverId);

    let baseScore = compliance.compliance.compliant ? 95 : 75;

    // Adjust based on AI insights
    const criticalInsights = insights.filter(
      (i) => i.priority === 'critical'
    ).length;
    const highInsights = insights.filter((i) => i.priority === 'high').length;

    baseScore -= criticalInsights * 10 + highInsights * 5;

    return Math.max(0, Math.min(100, baseScore));
  }

  async syncWithLiveTracking(deviceId: string): Promise<boolean> {
    if (!this.fleetFlowIntegration.liveTrackingEnabled) {
      return false;
    }

    // Simulate sync with FleetFlow's live tracking system
    const device = this.devices.get(deviceId);
    if (!device) return false;

    // Update location with simulated GPS data
    device.location = {
      latitude: 32.7767 + (Math.random() - 0.5) * 0.01,
      longitude: -96.797 + (Math.random() - 0.5) * 0.01,
      accuracy: 3 + Math.random() * 2,
      timestamp: new Date().toISOString(),
    };

    return true;
  }

  // Device Management
  async getDevices(): Promise<OpenELDDevice[]> {
    return Array.from(this.devices.values());
  }

  async getDevice(deviceId: string): Promise<OpenELDDevice | null> {
    return this.devices.get(deviceId) || null;
  }

  async updateDeviceLocation(
    deviceId: string,
    location: { latitude: number; longitude: number; accuracy: number }
  ): Promise<boolean> {
    const device = this.devices.get(deviceId);
    if (!device) return false;

    device.location = {
      ...location,
      timestamp: new Date().toISOString(),
    };
    device.lastSync = new Date().toISOString();

    return true;
  }

  async getDeviceDiagnostics(
    deviceId: string
  ): Promise<OpenELDDevice['diagnostics'] | null> {
    const device = this.devices.get(deviceId);
    return device?.diagnostics || null;
  }

  // Driver Management
  async getDrivers(): Promise<OpenELDDriver[]> {
    return Array.from(this.drivers.values());
  }

  async getDriver(driverId: string): Promise<OpenELDDriver | null> {
    return this.drivers.get(driverId) || null;
  }

  async assignDeviceToDriver(
    driverId: string,
    deviceId: string
  ): Promise<boolean> {
    const driver = this.drivers.get(driverId);
    const device = this.devices.get(deviceId);

    if (!driver || !device) return false;

    driver.deviceId = deviceId;
    driver.lastLogin = new Date().toISOString();

    return true;
  }

  // Duty Status Management (Core ELD Functionality)
  async startDutyStatus(
    driverId: string,
    status: OpenELDDutyStatus['status'],
    location: { latitude: number; longitude: number; accuracy: number }
  ): Promise<boolean> {
    const driver = this.drivers.get(driverId);
    if (!driver || !driver.deviceId) return false;

    const now = new Date();

    // End current duty status if exists
    await this.endCurrentDutyStatus(driverId);

    // Create new duty status
    const dutyStatus: OpenELDDutyStatus = {
      id: `duty-${Date.now()}`,
      driverId,
      deviceId: driver.deviceId,
      status,
      startTime: now.toISOString(),
      duration: 0,
      location,
      odometer: 0, // Would come from actual device
      engineHours: 0, // Would come from actual device
      dataSource: 'automatic',
    };

    if (!this.dutyLogs.has(driverId)) {
      this.dutyLogs.set(driverId, []);
    }

    this.dutyLogs.get(driverId)!.push(dutyStatus);

    // Create log entry
    await this.createLogEntry(
      driverId,
      'login',
      'Driver duty status change',
      location
    );

    return true;
  }

  async endDutyStatus(
    driverId: string,
    status: OpenELDDutyStatus['status'],
    location: { latitude: number; longitude: number; accuracy: number }
  ): Promise<boolean> {
    const currentStatus = await this.getCurrentDutyStatus(driverId);
    if (!currentStatus) return false;

    const now = new Date();
    const startTime = new Date(currentStatus.startTime);
    const duration = (now.getTime() - startTime.getTime()) / (1000 * 60 * 60);

    currentStatus.endTime = now.toISOString();
    currentStatus.duration = Math.round(duration * 100) / 100;
    currentStatus.location = location;

    // Create log entry
    await this.createLogEntry(
      driverId,
      'logout',
      'Driver duty status ended',
      location
    );

    return true;
  }

  async getCurrentDutyStatus(
    driverId: string
  ): Promise<OpenELDDutyStatus | null> {
    const logs = this.dutyLogs.get(driverId) || [];
    return logs.find((log) => !log.endTime) || null;
  }

  async getDutyLogs(
    driverId: string,
    startDate: string,
    endDate: string
  ): Promise<OpenELDDutyStatus[]> {
    const logs = this.dutyLogs.get(driverId) || [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    return logs.filter((log) => {
      const logDate = new Date(log.startTime);
      return logDate >= start && logDate <= end;
    });
  }

  private async endCurrentDutyStatus(driverId: string): Promise<void> {
    const currentStatus = await this.getCurrentDutyStatus(driverId);
    if (currentStatus) {
      const now = new Date();
      const startTime = new Date(currentStatus.startTime);
      const duration = (now.getTime() - startTime.getTime()) / (1000 * 60 * 60);

      currentStatus.endTime = now.toISOString();
      currentStatus.duration = Math.round(duration * 100) / 100;
    }
  }

  // Log Entry Management
  async createLogEntry(
    driverId: string,
    eventType: OpenELDLogEntry['eventType'],
    description: string,
    location: { latitude: number; longitude: number; accuracy: number }
  ): Promise<string> {
    const driver = this.drivers.get(driverId);
    if (!driver || !driver.deviceId)
      throw new Error('Driver or device not found');

    const logEntry: OpenELDLogEntry = {
      id: `log-${Date.now()}`,
      driverId,
      deviceId: driver.deviceId,
      timestamp: new Date().toISOString(),
      eventType,
      eventCode: this.getEventCode(eventType),
      eventDescription: description,
      location,
      odometer: 0, // Would come from actual device
      engineHours: 0, // Would come from actual device
      dataSource: 'automatic',
    };

    if (!this.logEntries.has(driverId)) {
      this.logEntries.set(driverId, []);
    }

    this.logEntries.get(driverId)!.push(logEntry);

    return logEntry.id;
  }

  private getEventCode(eventType: OpenELDLogEntry['eventType']): string {
    const eventCodes: Record<OpenELDLogEntry['eventType'], string> = {
      login: 'ELD_LOGIN',
      logout: 'ELD_LOGOUT',
      power_on: 'ELD_POWER_ON',
      power_off: 'ELD_POWER_OFF',
      malfunction: 'ELD_MALFUNCTION',
      data_transfer: 'ELD_DATA_TRANSFER',
    };

    return eventCodes[eventType] || 'ELD_UNKNOWN';
  }

  // Compliance and Violations
  async checkCompliance(driverId: string): Promise<OpenELDComplianceReport> {
    const driver = this.drivers.get(driverId);
    if (!driver) throw new Error('Driver not found');

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const logs = await this.getDutyLogs(
      driverId,
      sevenDaysAgo.toISOString(),
      now.toISOString()
    );
    const violations = this.violations.get(driverId) || [];

    // Calculate hours
    const totalHours = logs.reduce((sum, log) => sum + log.duration, 0);
    const drivingHours = logs
      .filter((log) => log.status === 'driving')
      .reduce((sum, log) => sum + log.duration, 0);
    const onDutyHours = logs
      .filter((log) => log.status === 'on_duty')
      .reduce((sum, log) => sum + log.duration, 0);
    const offDutyHours = logs
      .filter((log) => log.status === 'off_duty')
      .reduce((sum, log) => sum + log.duration, 0);
    const sleeperBerthHours = logs
      .filter((log) => log.status === 'sleeper_berth')
      .reduce((sum, log) => sum + log.duration, 0);

    // Check for violations
    const issues: string[] = [];
    const recommendations: string[] = [];

    if (drivingHours > 11) {
      issues.push('11-hour driving limit exceeded');
      recommendations.push('Driver must take 10 consecutive hours off duty');
    }

    if (totalHours > 70) {
      issues.push('70-hour cycle limit exceeded');
      recommendations.push('Driver must take 34 consecutive hours off duty');
    }

    if (
      drivingHours > 8 &&
      !logs.some((log) => log.status === 'off_duty' && log.duration >= 0.5)
    ) {
      issues.push('30-minute break requirement not met');
      recommendations.push('Driver must take 30 consecutive minutes off duty');
    }

    const compliant = issues.length === 0;
    const aiScore = await this.generateAIComplianceScore(driverId);
    const insights = await this.getFlowterAIInsights(driverId);

    // Generate risk level based on AI analysis
    const riskLevel: 'low' | 'medium' | 'high' =
      aiScore >= 90 ? 'low' : aiScore >= 75 ? 'medium' : 'high';

    return {
      driverId,
      reportDate: now.toISOString(),
      cycle: '7_day',
      totalHours: Math.round(totalHours * 100) / 100,
      drivingHours: Math.round(drivingHours * 100) / 100,
      onDutyHours: Math.round(onDutyHours * 100) / 100,
      offDutyHours: Math.round(offDutyHours * 100) / 100,
      sleeperBerthHours: Math.round(sleeperBerthHours * 100) / 100,
      violations: violations.filter((v) => v.status === 'active'),
      compliance: {
        compliant,
        issues,
        recommendations,
        aiScore,
        riskLevel,
      },
      flowterInsights: this.fleetFlowIntegration.flowterAiEnabled
        ? {
            predictedViolations: insights
              .filter((i) => i.type === 'compliance')
              .map((i) => i.message),
            efficiencyScore: Math.round(85 + Math.random() * 15), // Simulated efficiency score
            maintenanceAlerts: insights
              .filter((i) => i.type === 'maintenance')
              .map((i) => i.message),
            routeOptimizationSuggestions: [
              'Alternative route available saving 12 minutes',
              'Fuel stop optimization can save $15 in current trip',
              'Rest area scheduling optimized for HOS compliance',
            ],
          }
        : undefined,
    };
  }

  // Data Export (FMCSA Compliance)
  async exportELDData(
    driverId: string,
    startDate: string,
    endDate: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const driver = this.drivers.get(driverId);
      if (!driver) throw new Error('Driver not found');

      const dutyLogs = await this.getDutyLogs(driverId, startDate, endDate);
      const logEntries = this.logEntries.get(driverId) || [];
      const violations = this.violations.get(driverId) || [];

      // Filter by date range
      const start = new Date(startDate);
      const end = new Date(endDate);

      const filteredLogs = logEntries.filter((log) => {
        const logDate = new Date(log.timestamp);
        return logDate >= start && logDate <= end;
      });

      const filteredViolations = violations.filter((violation) => {
        const violationDate = new Date(violation.timestamp);
        return violationDate >= start && violationDate <= end;
      });

      const exportData = {
        driver: {
          id: driver.driverId,
          licenseNumber: driver.licenseNumber,
          licenseState: driver.licenseState,
          licenseClass: driver.licenseClass,
          eldStatus: driver.eldStatus,
        },
        device: driver.deviceId ? await this.getDevice(driver.deviceId) : null,
        exportDate: new Date().toISOString(),
        dateRange: { startDate, endDate },
        dutyLogs,
        logEntries: filteredLogs,
        violations: filteredViolations,
        compliance: await this.checkCompliance(driverId),
      };

      return { success: true, data: exportData };
    } catch (error) {
      console.error('Error exporting ELD data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Real-time Device Sync (Simulated for now, ready for actual OpenELD devices)
  async syncDeviceData(deviceId: string): Promise<boolean> {
    const device = this.devices.get(deviceId);
    if (!device) return false;

    // Simulate real-time data sync
    device.lastSync = new Date().toISOString();
    device.diagnostics.batteryLevel = Math.max(
      0,
      device.diagnostics.batteryLevel - Math.random() * 2
    );
    device.diagnostics.signalStrength = Math.max(
      50,
      device.diagnostics.signalStrength + (Math.random() - 0.5) * 10
    );
    device.diagnostics.storageUsage = Math.min(
      100,
      device.diagnostics.storageUsage + Math.random() * 1
    );
    device.diagnostics.temperature =
      device.diagnostics.temperature + (Math.random() - 0.5) * 2;

    return true;
  }

  // System Health Monitoring
  async getSystemHealth(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
  }> {
    const issues: string[] = [];

    // Check device connectivity
    for (const device of this.devices.values()) {
      if (device.status === 'error') {
        issues.push(`Device ${device.deviceId} has errors`);
      }
      if (device.status === 'disconnected') {
        issues.push(`Device ${device.deviceId} is disconnected`);
      }
      if (device.diagnostics.batteryLevel < 20) {
        issues.push(
          `Device ${device.deviceId} low battery: ${device.diagnostics.batteryLevel}%`
        );
      }
    }

    // Check driver compliance
    for (const driver of this.drivers.values()) {
      try {
        const compliance = await this.checkCompliance(driver.driverId);
        if (!compliance.compliance.compliant) {
          issues.push(`Driver ${driver.driverId} has compliance issues`);
        }
      } catch (error) {
        issues.push(`Unable to check compliance for driver ${driver.driverId}`);
      }
    }

    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (issues.length > 5) status = 'critical';
    else if (issues.length > 2) status = 'warning';

    return { status, issues };
  }

  // Weight Compliance Management
  private weightComplianceLogs: Map<string, OpenELDWeightComplianceLog[]> =
    new Map();
  private weightInspections: Map<string, OpenELDWeightInspection[]> = new Map();

  /**
   * Create a weight compliance log entry automatically when a load is assigned
   */
  async createWeightComplianceLog(
    driverId: string,
    deviceId: string,
    loadAssignmentData: any,
    weightCompliance: any
  ): Promise<OpenELDWeightComplianceLog> {
    const logEntry: OpenELDWeightComplianceLog = {
      id: `WCL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      driverId,
      deviceId,
      loadId: loadAssignmentData.loadId,
      timestamp: new Date().toISOString(),
      cargoWeight: loadAssignmentData.cargoWeight || 0,
      totalWeight: (loadAssignmentData.cargoWeight || 0) + 29000, // cargo + tractor + trailer
      truckConfiguration: {
        id:
          loadAssignmentData.truckConfiguration?.id ||
          'tractor-semitrailer-5axle',
        name:
          loadAssignmentData.truckConfiguration?.name ||
          '5-Axle Tractor-Semitrailer',
        totalAxles: loadAssignmentData.truckConfiguration?.totalAxles || 5,
        maxGrossWeight:
          loadAssignmentData.truckConfiguration?.maxGrossWeight || 80000,
      },
      routeStates: loadAssignmentData.routeStates || ['FEDERAL'],
      complianceResult: {
        isCompliant: weightCompliance?.weightCompliance?.isCompliant || true,
        safetyRating:
          weightCompliance?.weightCompliance?.safetyRating || 'SAFE',
        violations: weightCompliance?.weightCompliance?.violations || [],
        requiredPermits:
          weightCompliance?.weightCompliance?.requiredPermits || [],
        recommendations:
          weightCompliance?.weightCompliance?.recommendations || [],
      },
      location: {
        latitude: 32.7767, // Default to Dallas, TX
        longitude: -96.797,
        accuracy: 10,
      },
      odometer: 0,
      dataSource: 'automatic',
    };

    // Store the log entry
    const driverLogs = this.weightComplianceLogs.get(driverId) || [];
    driverLogs.push(logEntry);
    this.weightComplianceLogs.set(driverId, driverLogs);

    console.log(
      `📋 Weight compliance log created for driver ${driverId}, load ${loadAssignmentData.loadId}`
    );

    return logEntry;
  }

  /**
   * Get weight compliance logs for a specific driver
   */
  async getWeightComplianceLogs(
    driverId: string,
    startDate?: string,
    endDate?: string
  ): Promise<OpenELDWeightComplianceLog[]> {
    const logs = this.weightComplianceLogs.get(driverId) || [];

    if (!startDate && !endDate) {
      return logs.slice().reverse(); // Return newest first
    }

    return logs
      .filter((log) => {
        const logDate = new Date(log.timestamp);
        const start = startDate ? new Date(startDate) : new Date(0);
        const end = endDate ? new Date(endDate) : new Date();
        return logDate >= start && logDate <= end;
      })
      .reverse();
  }

  /**
   * Export weight compliance logs for DOT inspection
   */
  async exportWeightComplianceLogs(
    driverId: string,
    startDate: string,
    endDate: string
  ): Promise<{
    logs: OpenELDWeightComplianceLog[];
    exportData: string;
    summary: {
      totalLoads: number;
      compliantLoads: number;
      violationsCount: number;
      permitsRequired: number;
    };
  }> {
    const logs = await this.getWeightComplianceLogs(
      driverId,
      startDate,
      endDate
    );

    const summary = {
      totalLoads: logs.length,
      compliantLoads: logs.filter((log) => log.complianceResult.isCompliant)
        .length,
      violationsCount: logs.reduce(
        (sum, log) => sum + log.complianceResult.violations.length,
        0
      ),
      permitsRequired: logs.reduce(
        (sum, log) => sum + log.complianceResult.requiredPermits.length,
        0
      ),
    };

    // Generate export data (CSV format for DOT inspectors)
    const csvHeader =
      'Date,Load ID,Cargo Weight,Total Weight,Truck Config,States,Safety Rating,Violations,Permits,Compliant\n';
    const csvData = logs
      .map(
        (log) =>
          `${log.timestamp},${log.loadId},${log.cargoWeight},${log.totalWeight},${log.truckConfiguration.name},"${log.routeStates.join(', ')}",${log.complianceResult.safetyRating},${log.complianceResult.violations.length},${log.complianceResult.requiredPermits.length},${log.complianceResult.isCompliant ? 'YES' : 'NO'}`
      )
      .join('\n');

    const exportData = csvHeader + csvData;

    // Mark logs as exported
    logs.forEach((log) => {
      log.exportedAt = new Date().toISOString();
    });

    console.log(
      `📊 Exported ${logs.length} weight compliance logs for driver ${driverId}`
    );

    return {
      logs,
      exportData,
      summary,
    };
  }

  /**
   * Record a weight station inspection
   */
  async recordWeightInspection(
    inspectionData: Omit<OpenELDWeightInspection, 'id'>
  ): Promise<OpenELDWeightInspection> {
    const inspection: OpenELDWeightInspection = {
      id: `WI-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...inspectionData,
    };

    const driverInspections =
      this.weightInspections.get(inspection.driverId) || [];
    driverInspections.push(inspection);
    this.weightInspections.set(inspection.driverId, driverInspections);

    // If there were violations, create a violation log entry
    if (inspection.violations.length > 0) {
      const violation: OpenELDViolation = {
        id: `V-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        driverId: inspection.driverId,
        deviceId: inspection.deviceId,
        violationType: 'weight_violation',
        severity: 'critical',
        description: `Weight inspection violations at ${inspection.location.stationName}: ${inspection.violations.map((v) => v.description).join(', ')}`,
        timestamp: inspection.inspectionDate,
        status: 'active',
        requiredAction:
          'Contact safety department for weight compliance review',
      };

      const driverViolations = this.violations.get(inspection.driverId) || [];
      driverViolations.push(violation);
      this.violations.set(inspection.driverId, driverViolations);
    }

    console.log(
      `🚔 Weight inspection recorded for driver ${inspection.driverId} at ${inspection.location.stationName}`
    );

    return inspection;
  }

  /**
   * Get weight inspections for a driver
   */
  async getWeightInspections(
    driverId: string
  ): Promise<OpenELDWeightInspection[]> {
    return this.weightInspections.get(driverId) || [];
  }

  /**
   * Get weight compliance summary for a driver
   */
  async getWeightComplianceSummary(
    driverId: string,
    days: number = 30
  ): Promise<{
    period: string;
    totalLoads: number;
    compliantLoads: number;
    complianceRate: number;
    violationsCount: number;
    criticalViolations: number;
    permitsRequired: number;
    inspections: number;
    lastInspection?: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  }> {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

    const logs = await this.getWeightComplianceLogs(
      driverId,
      startDate.toISOString(),
      endDate.toISOString()
    );

    const inspections = await this.getWeightInspections(driverId);
    const recentInspections = inspections.filter(
      (i) => new Date(i.inspectionDate) >= startDate
    );

    const totalLoads = logs.length;
    const compliantLoads = logs.filter(
      (log) => log.complianceResult.isCompliant
    ).length;
    const violationsCount = logs.reduce(
      (sum, log) => sum + log.complianceResult.violations.length,
      0
    );
    const criticalViolations = logs.reduce(
      (sum, log) =>
        sum +
        log.complianceResult.violations.filter((v) => v.severity === 'CRITICAL')
          .length,
      0
    );
    const permitsRequired = logs.reduce(
      (sum, log) => sum + log.complianceResult.requiredPermits.length,
      0
    );

    const complianceRate =
      totalLoads > 0 ? (compliantLoads / totalLoads) * 100 : 100;

    // Determine risk level
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (criticalViolations > 0 || complianceRate < 80) {
      riskLevel = 'HIGH';
    } else if (violationsCount > 5 || complianceRate < 95) {
      riskLevel = 'MEDIUM';
    }

    return {
      period: `${days} days`,
      totalLoads,
      compliantLoads,
      complianceRate: Math.round(complianceRate * 10) / 10,
      violationsCount,
      criticalViolations,
      permitsRequired,
      inspections: recentInspections.length,
      lastInspection:
        inspections.length > 0
          ? inspections.sort(
              (a, b) =>
                new Date(b.inspectionDate).getTime() -
                new Date(a.inspectionDate).getTime()
            )[0].inspectionDate
          : undefined,
      riskLevel,
    };
  }
}

export const openELDService = new OpenELDIntegrationService();
