// 📋 ELD Integration Service
// Handles Electronic Logging Device integration for DOT compliance

export interface ELDStatus {
  connected: boolean;
  deviceId: string;
  deviceType: string;
  lastSync: string;
  batteryLevel?: number;
  signalStrength?: number;
  firmwareVersion?: string;
  errors: string[];
}

export interface DutyStatus {
  status: 'OFF_DUTY' | 'SLEEPER_BERTH' | 'DRIVING' | 'ON_DUTY_NOT_DRIVING';
  startTime: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  odometer: number;
  engineHours: number;
  notes?: string;
}

export interface HoursOfService {
  drivingTime: number; // minutes
  onDutyTime: number; // minutes
  offDutyTime: number; // minutes
  sleeperBerthTime: number; // minutes
  remainingDriveTime: number; // minutes
  remainingOnDutyTime: number; // minutes
  remainingCycleTime: number; // minutes
  violations: HoSViolation[];
  nextRequiredBreak: string;
  nextRequiredRest: string;
}

export interface HoSViolation {
  id: string;
  type:
    | 'DRIVING_LIMIT'
    | 'ON_DUTY_LIMIT'
    | 'CYCLE_LIMIT'
    | 'REQUIRED_BREAK'
    | 'SLEEPER_BERTH';
  severity: 'WARNING' | 'VIOLATION';
  timestamp: string;
  description: string;
  timeOver: number; // minutes
  resolved: boolean;
}

export interface DVIRRecord {
  id: string;
  type: 'PRE_TRIP' | 'POST_TRIP';
  timestamp: string;
  vehicleId: string;
  driverId: string;
  odometer: number;
  defects: DVIRDefect[];
  signature: string;
  status: 'SAFE' | 'UNSAFE' | 'CONDITIONAL';
}

export interface DVIRDefect {
  id: string;
  category: string;
  description: string;
  severity: 'MINOR' | 'MAJOR' | 'CRITICAL';
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  notes?: string;
}

export interface ELDLog {
  id: string;
  driverId: string;
  date: string;
  dutyStatusChanges: DutyStatus[];
  hoursOfService: HoursOfService;
  dvir: DVIRRecord[];
  certified: boolean;
  certifiedAt?: string;
  notes?: string;
}

class ELDIntegrationService {
  private eldStatus: ELDStatus = {
    connected: false,
    deviceId: '',
    deviceType: '',
    lastSync: '',
    errors: [],
  };

  private currentDutyStatus: DutyStatus | null = null;
  private hoursOfService: HoursOfService | null = null;
  private dutyStatusHistory: DutyStatus[] = [];
  private violations: HoSViolation[] = [];
  private dvirRecords: DVIRRecord[] = [];

  private listeners: {
    statusChange: Array<(status: ELDStatus) => void>;
    dutyChange: Array<(duty: DutyStatus) => void>;
    hoursUpdate: Array<(hours: HoursOfService) => void>;
    violation: Array<(violation: HoSViolation) => void>;
  } = {
    statusChange: [],
    dutyChange: [],
    hoursUpdate: [],
    violation: [],
  };

  constructor() {
    this.initializeService();
  }

  private async initializeService() {
    // Check for existing ELD device
    await this.detectELDDevice();

    // Load stored data
    this.loadStoredData();

    // Start monitoring
    this.startMonitoring();
  }

  // ELD Device Detection and Connection
  private async detectELDDevice(): Promise<void> {
    try {
      // Simulate ELD device detection
      // In real implementation, this would connect to actual ELD hardware
      const mockELD: ELDStatus = {
        connected: true,
        deviceId: 'ELD-001',
        deviceType: 'FleetELD Pro',
        lastSync: new Date().toISOString(),
        batteryLevel: 85,
        signalStrength: 4,
        firmwareVersion: '2.1.5',
        errors: [],
      };

      this.eldStatus = mockELD;
      this.notifyStatusChange();

      console.info('ELD device detected and connected');
    } catch (error) {
      console.error('Failed to detect ELD device:', error);
      this.eldStatus.errors.push('Device detection failed');
    }
  }

  // Load stored data from localStorage
  private loadStoredData() {
    try {
      const storedDuty = localStorage.getItem('current_duty_status');
      if (storedDuty) {
        this.currentDutyStatus = JSON.parse(storedDuty);
      }

      const storedHours = localStorage.getItem('hours_of_service');
      if (storedHours) {
        this.hoursOfService = JSON.parse(storedHours);
      }

      const storedHistory = localStorage.getItem('duty_status_history');
      if (storedHistory) {
        this.dutyStatusHistory = JSON.parse(storedHistory);
      }

      const storedViolations = localStorage.getItem('hos_violations');
      if (storedViolations) {
        this.violations = JSON.parse(storedViolations);
      }
    } catch (error) {
      console.error('Failed to load stored ELD data:', error);
    }
  }

  // Start monitoring
  private startMonitoring() {
    // Monitor duty status changes
    setInterval(() => {
      this.updateHoursOfService();
      this.checkViolations();
      this.syncWithBackend();
    }, 60000); // Every minute

    // Sync with device every 30 seconds
    setInterval(() => {
      this.syncWithDevice();
    }, 30000);
  }

  // Change duty status
  async changeDutyStatus(
    status: DutyStatus['status'],
    location: DutyStatus['location'],
    odometer: number,
    engineHours: number,
    notes?: string
  ): Promise<boolean> {
    try {
      const newStatus: DutyStatus = {
        status,
        startTime: new Date().toISOString(),
        location,
        odometer,
        engineHours,
        notes,
      };

      // Validate status change
      if (!this.validateStatusChange(newStatus)) {
        throw new Error('Invalid status change');
      }

      // Update current status
      this.currentDutyStatus = newStatus;
      this.dutyStatusHistory.push(newStatus);

      // Save to localStorage
      localStorage.setItem('current_duty_status', JSON.stringify(newStatus));
      localStorage.setItem(
        'duty_status_history',
        JSON.stringify(this.dutyStatusHistory)
      );

      // Update hours of service
      this.updateHoursOfService();

      // Notify listeners
      this.notifyDutyChange(newStatus);

      // Send to backend
      await this.sendDutyStatusToBackend(newStatus);

      return true;
    } catch (error) {
      console.error('Failed to change duty status:', error);
      return false;
    }
  }

  // Validate status change
  private validateStatusChange(newStatus: DutyStatus): boolean {
    // Check if driver is trying to drive without proper rest
    if (newStatus.status === 'DRIVING' && this.hoursOfService) {
      if (this.hoursOfService.remainingDriveTime <= 0) {
        this.addViolation({
          id: `violation-${Date.now()}`,
          type: 'DRIVING_LIMIT',
          severity: 'VIOLATION',
          timestamp: new Date().toISOString(),
          description: 'Cannot drive - daily driving limit exceeded',
          timeOver: 0,
          resolved: false,
        });
        return false;
      }
    }

    return true;
  }

  // Update hours of service
  private updateHoursOfService() {
    if (!this.dutyStatusHistory.length) return;

    const today = new Date().toISOString().split('T')[0];
    const todayRecords = this.dutyStatusHistory.filter(
      (record) => record.startTime.split('T')[0] === today
    );

    let drivingTime = 0;
    let onDutyTime = 0;
    let offDutyTime = 0;
    let sleeperBerthTime = 0;

    // Calculate time spent in each status
    for (let i = 0; i < todayRecords.length; i++) {
      const record = todayRecords[i];
      const nextRecord = todayRecords[i + 1];

      const startTime = new Date(record.startTime);
      const endTime = nextRecord ? new Date(nextRecord.startTime) : new Date();
      const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60); // minutes

      switch (record.status) {
        case 'DRIVING':
          drivingTime += duration;
          onDutyTime += duration;
          break;
        case 'ON_DUTY_NOT_DRIVING':
          onDutyTime += duration;
          break;
        case 'OFF_DUTY':
          offDutyTime += duration;
          break;
        case 'SLEEPER_BERTH':
          sleeperBerthTime += duration;
          break;
      }
    }

    // Calculate remaining times (based on US DOT regulations)
    const remainingDriveTime = Math.max(0, 11 * 60 - drivingTime); // 11 hour driving limit
    const remainingOnDutyTime = Math.max(0, 14 * 60 - onDutyTime); // 14 hour on-duty limit
    const remainingCycleTime = Math.max(
      0,
      70 * 60 - this.calculateWeeklyOnDuty()
    ); // 70 hour cycle

    this.hoursOfService = {
      drivingTime,
      onDutyTime,
      offDutyTime,
      sleeperBerthTime,
      remainingDriveTime,
      remainingOnDutyTime,
      remainingCycleTime,
      violations: this.violations,
      nextRequiredBreak: this.calculateNextRequiredBreak(),
      nextRequiredRest: this.calculateNextRequiredRest(),
    };

    // Save to localStorage
    localStorage.setItem(
      'hours_of_service',
      JSON.stringify(this.hoursOfService)
    );

    // Notify listeners
    this.notifyHoursUpdate();
  }

  // Calculate weekly on-duty time
  private calculateWeeklyOnDuty(): number {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyRecords = this.dutyStatusHistory.filter(
      (record) => new Date(record.startTime) >= oneWeekAgo
    );

    let totalOnDuty = 0;
    for (let i = 0; i < weeklyRecords.length; i++) {
      const record = weeklyRecords[i];
      if (
        record.status === 'DRIVING' ||
        record.status === 'ON_DUTY_NOT_DRIVING'
      ) {
        const nextRecord = weeklyRecords[i + 1];
        const startTime = new Date(record.startTime);
        const endTime = nextRecord
          ? new Date(nextRecord.startTime)
          : new Date();
        const duration =
          (endTime.getTime() - startTime.getTime()) / (1000 * 60);
        totalOnDuty += duration;
      }
    }

    return totalOnDuty;
  }

  // Calculate next required break
  private calculateNextRequiredBreak(): string {
    if (!this.hoursOfService || !this.currentDutyStatus) return '';

    // 30-minute break required after 8 hours of driving
    if (this.hoursOfService.drivingTime >= 8 * 60) {
      return 'Break required now';
    }

    const breakTime = new Date(
      Date.now() + (8 * 60 - this.hoursOfService.drivingTime) * 60000
    );
    return breakTime.toISOString();
  }

  // Calculate next required rest
  private calculateNextRequiredRest(): string {
    if (!this.hoursOfService) return '';

    // 10-hour rest required after 14 hours on duty
    if (this.hoursOfService.onDutyTime >= 14 * 60) {
      return 'Rest required now';
    }

    const restTime = new Date(
      Date.now() + (14 * 60 - this.hoursOfService.onDutyTime) * 60000
    );
    return restTime.toISOString();
  }

  // Check for violations
  private checkViolations() {
    if (!this.hoursOfService) return;

    // Check driving time limit
    if (this.hoursOfService.drivingTime > 11 * 60) {
      this.addViolation({
        id: `violation-driving-${Date.now()}`,
        type: 'DRIVING_LIMIT',
        severity: 'VIOLATION',
        timestamp: new Date().toISOString(),
        description: 'Daily driving limit exceeded',
        timeOver: this.hoursOfService.drivingTime - 11 * 60,
        resolved: false,
      });
    }

    // Check on-duty time limit
    if (this.hoursOfService.onDutyTime > 14 * 60) {
      this.addViolation({
        id: `violation-onduty-${Date.now()}`,
        type: 'ON_DUTY_LIMIT',
        severity: 'VIOLATION',
        timestamp: new Date().toISOString(),
        description: 'Daily on-duty limit exceeded',
        timeOver: this.hoursOfService.onDutyTime - 14 * 60,
        resolved: false,
      });
    }

    // Check cycle limit
    if (this.hoursOfService.remainingCycleTime <= 0) {
      this.addViolation({
        id: `violation-cycle-${Date.now()}`,
        type: 'CYCLE_LIMIT',
        severity: 'VIOLATION',
        timestamp: new Date().toISOString(),
        description: '70-hour cycle limit reached',
        timeOver: Math.abs(this.hoursOfService.remainingCycleTime),
        resolved: false,
      });
    }
  }

  // Add violation
  private addViolation(violation: HoSViolation) {
    // Check if violation already exists
    const existingViolation = this.violations.find(
      (v) => v.id === violation.id
    );
    if (existingViolation) return;

    this.violations.push(violation);
    localStorage.setItem('hos_violations', JSON.stringify(this.violations));

    // Notify listeners
    this.notifyViolation(violation);
  }

  // DVIR Operations
  async createDVIR(
    type: DVIRRecord['type'],
    vehicleId: string,
    driverId: string,
    odometer: number,
    defects: DVIRDefect[],
    signature: string
  ): Promise<DVIRRecord> {
    const dvir: DVIRRecord = {
      id: `dvir-${Date.now()}`,
      type,
      timestamp: new Date().toISOString(),
      vehicleId,
      driverId,
      odometer,
      defects,
      signature,
      status: defects.some((d) => d.severity === 'CRITICAL')
        ? 'UNSAFE'
        : defects.some((d) => d.severity === 'MAJOR')
          ? 'CONDITIONAL'
          : 'SAFE',
    };

    this.dvirRecords.push(dvir);
    localStorage.setItem('dvir_records', JSON.stringify(this.dvirRecords));

    // Send to backend
    await this.sendDVIRToBackend(dvir);

    return dvir;
  }

  // Sync with ELD device
  private async syncWithDevice() {
    if (!this.eldStatus.connected) return;

    try {
      // Simulate device sync
      this.eldStatus.lastSync = new Date().toISOString();
      this.eldStatus.batteryLevel = Math.max(
        0,
        (this.eldStatus.batteryLevel || 85) - 0.1
      );

      // Clear old errors
      this.eldStatus.errors = [];

      this.notifyStatusChange();
    } catch (error) {
      console.error('Device sync failed:', error);
      this.eldStatus.errors.push('Sync failed');
    }
  }

  // Send data to backend
  private async sendDutyStatusToBackend(status: DutyStatus) {
    try {
      await fetch('/api/eld/duty-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(status),
      });
    } catch (error) {
      console.error('Failed to send duty status to backend:', error);
    }
  }

  private async sendDVIRToBackend(dvir: DVIRRecord) {
    try {
      await fetch('/api/eld/dvir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dvir),
      });
    } catch (error) {
      console.error('Failed to send DVIR to backend:', error);
    }
  }

  private async syncWithBackend() {
    try {
      // Send current hours of service to backend
      if (this.hoursOfService) {
        await fetch('/api/eld/hours-of-service', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.hoursOfService),
        });
      }
    } catch (error) {
      console.error('Backend sync failed:', error);
    }
  }

  // Event notification methods
  private notifyStatusChange() {
    this.listeners.statusChange.forEach((listener) => listener(this.eldStatus));
  }

  private notifyDutyChange(duty: DutyStatus) {
    this.listeners.dutyChange.forEach((listener) => listener(duty));
  }

  private notifyHoursUpdate() {
    if (this.hoursOfService) {
      this.listeners.hoursUpdate.forEach((listener) =>
        listener(this.hoursOfService!)
      );
    }
  }

  private notifyViolation(violation: HoSViolation) {
    this.listeners.violation.forEach((listener) => listener(violation));
  }

  // Public API methods
  getELDStatus(): ELDStatus {
    return this.eldStatus;
  }

  getCurrentDutyStatus(): DutyStatus | null {
    return this.currentDutyStatus;
  }

  getHoursOfService(): HoursOfService | null {
    return this.hoursOfService;
  }

  getViolations(): HoSViolation[] {
    return this.violations;
  }

  getDVIRRecords(): DVIRRecord[] {
    return this.dvirRecords;
  }

  // Event listeners
  addStatusChangeListener(listener: (status: ELDStatus) => void) {
    this.listeners.statusChange.push(listener);
  }

  addDutyChangeListener(listener: (duty: DutyStatus) => void) {
    this.listeners.dutyChange.push(listener);
  }

  addHoursUpdateListener(listener: (hours: HoursOfService) => void) {
    this.listeners.hoursUpdate.push(listener);
  }

  addViolationListener(listener: (violation: HoSViolation) => void) {
    this.listeners.violation.push(listener);
  }

  // Remove listeners
  removeStatusChangeListener(listener: (status: ELDStatus) => void) {
    this.listeners.statusChange = this.listeners.statusChange.filter(
      (l) => l !== listener
    );
  }

  removeDutyChangeListener(listener: (duty: DutyStatus) => void) {
    this.listeners.dutyChange = this.listeners.dutyChange.filter(
      (l) => l !== listener
    );
  }

  removeHoursUpdateListener(listener: (hours: HoursOfService) => void) {
    this.listeners.hoursUpdate = this.listeners.hoursUpdate.filter(
      (l) => l !== listener
    );
  }

  removeViolationListener(listener: (violation: HoSViolation) => void) {
    this.listeners.violation = this.listeners.violation.filter(
      (l) => l !== listener
    );
  }

  // Utility methods
  formatTimeRemaining(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  isCurrentlyDriving(): boolean {
    return this.currentDutyStatus?.status === 'DRIVING';
  }

  canStartDriving(): boolean {
    return this.hoursOfService
      ? this.hoursOfService.remainingDriveTime > 0
      : false;
  }

  // Cleanup
  destroy() {
    this.listeners = {
      statusChange: [],
      dutyChange: [],
      hoursUpdate: [],
      violation: [],
    };
  }
}

// Export singleton instance
export const eldIntegrationService = new ELDIntegrationService();
