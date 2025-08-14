'use client';

// OpenELD Integration Service - Open Source ELD Standard Implementation
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

export interface OpenELDViolation {
  id: string;
  driverId: string;
  deviceId: string;
  violationType:
    | 'hours_exceeded'
    | 'missing_log'
    | 'form_manner'
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
  };
}

class OpenELDIntegrationService {
  private devices: Map<string, OpenELDDevice> = new Map();
  private drivers: Map<string, OpenELDDriver> = new Map();
  private dutyLogs: Map<string, OpenELDDutyStatus[]> = new Map();
  private violations: Map<string, OpenELDViolation[]> = new Map();
  private logEntries: Map<string, OpenELDLogEntry[]> = new Map();

  constructor() {
    this.initializeMockData();
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
      },
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
}

export const openELDService = new OpenELDIntegrationService();
