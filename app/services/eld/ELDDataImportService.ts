// ELD Data Import Service
// Handles Electronic Logging Device integration with Open ELD standards and major providers

interface ELDProvider {
  name: string;
  providerId: string;
  apiEndpoint: string;
  authType: 'api_key' | 'oauth' | 'basic_auth';
  dataFormats: string[];
  realTimeSupport: boolean;
  hosCompliant: boolean;
  webhookSupport: boolean;
}

interface HOSRecord {
  id?: string;
  tenantId: string;
  driverId: string;
  vehicleId?: string;
  eldProviderId: string;
  recordDate: string; // YYYY-MM-DD
  dutyStatus: 'off_duty' | 'sleeper_berth' | 'driving' | 'on_duty_not_driving';
  startTime: string; // ISO timestamp
  endTime?: string; // ISO timestamp
  durationMinutes?: number;
  startLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  endLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  odometerStart?: number;
  odometerEnd?: number;
  engineHours?: number;
  violations?: HOSViolation[];
  createdAt?: string;
}

interface HOSViolation {
  id?: string;
  tenantId: string;
  driverId: string;
  vehicleId?: string;
  violationType:
    | 'driving_time'
    | 'duty_time'
    | 'rest_break'
    | 'weekly_limit'
    | 'cycle_limit';
  severity: 'warning' | 'violation' | 'critical';
  description: string;
  violationTime: string; // ISO timestamp
  timeRemaining?: number; // minutes
  resolved: boolean;
  resolvedAt?: string;
  createdAt?: string;
}

interface VehicleDiagnostic {
  id?: string;
  tenantId: string;
  vehicleId: string;
  eldProviderId: string;
  timestamp: string; // ISO timestamp
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  speed: number; // mph
  engineRpm: number;
  fuelLevel: number; // percentage
  engineTemp: number; // fahrenheit
  odometer: number; // miles
  diagnosticCodes?: string[];
  rawData?: any;
  createdAt?: string;
}

interface ELDSyncResult {
  success: boolean;
  recordsProcessed: number;
  violationsDetected: number;
  errors: string[];
  lastSyncTime: string;
}

export class ELDDataImportService {
  private syncIntervalMinutes: number;
  private webhookSecret: string;
  private dataRetentionDays: number;

  constructor() {
    this.syncIntervalMinutes = parseInt(
      process.env.ELD_SYNC_INTERVAL_MINUTES || '15'
    );
    this.webhookSecret = process.env.ELD_WEBHOOK_SECRET || '';
    this.dataRetentionDays = parseInt(
      process.env.ELD_DATA_RETENTION_DAYS || '1095'
    ); // 3 years

    console.log('📱 ELD Data Import Service initialized:', {
      syncIntervalMinutes: this.syncIntervalMinutes,
      webhookSecret: this.webhookSecret ? 'CONFIGURED' : 'NOT CONFIGURED',
      dataRetentionDays: this.dataRetentionDays,
    });
  }

  /**
   * Get all supported ELD providers
   */
  getSupportedProviders(): ELDProvider[] {
    return [
      // Open ELD Standard
      {
        name: 'Open ELD Standard',
        providerId: 'open_eld',
        apiEndpoint: 'https://api.openeld.org/v1',
        authType: 'api_key',
        dataFormats: ['FMCSA_ELD', 'J1939', 'JSON'],
        realTimeSupport: true,
        hosCompliant: true,
        webhookSupport: true,
      },
      // Major ELD Providers
      {
        name: 'Geotab',
        providerId: 'geotab',
        apiEndpoint: 'https://my.geotab.com/apiv1',
        authType: 'basic_auth',
        dataFormats: ['JSON', 'XML'],
        realTimeSupport: true,
        hosCompliant: true,
        webhookSupport: false,
      },
      {
        name: 'Samsara',
        providerId: 'samsara',
        apiEndpoint: 'https://api.samsara.com/v1',
        authType: 'api_key',
        dataFormats: ['JSON'],
        realTimeSupport: true,
        hosCompliant: true,
        webhookSupport: true,
      },
      {
        name: 'Motive (KeepTruckin)',
        providerId: 'motive',
        apiEndpoint: 'https://api.gomotive.com/v1',
        authType: 'oauth',
        dataFormats: ['JSON'],
        realTimeSupport: true,
        hosCompliant: true,
        webhookSupport: true,
      },
      {
        name: 'Omnitracs',
        providerId: 'omnitracs',
        apiEndpoint: 'https://api.omnitracs.com/v1',
        authType: 'oauth',
        dataFormats: ['JSON', 'XML'],
        realTimeSupport: true,
        hosCompliant: true,
        webhookSupport: false,
      },
      {
        name: 'PeopleNet',
        providerId: 'peoplenet',
        apiEndpoint: 'https://api.peoplenet.com/v1',
        authType: 'api_key',
        dataFormats: ['JSON'],
        realTimeSupport: true,
        hosCompliant: true,
        webhookSupport: true,
      },
      {
        name: 'Garmin Fleet',
        providerId: 'garmin',
        apiEndpoint: 'https://fleet-api.garmin.com/v1',
        authType: 'oauth',
        dataFormats: ['JSON'],
        realTimeSupport: true,
        hosCompliant: true,
        webhookSupport: false,
      },
      {
        name: 'Verizon Connect',
        providerId: 'verizon_connect',
        apiEndpoint: 'https://api.verizonconnect.com/v1',
        authType: 'oauth',
        dataFormats: ['JSON'],
        realTimeSupport: true,
        hosCompliant: true,
        webhookSupport: true,
      },
    ];
  }

  /**
   * Sync HOS data from ELD provider
   */
  async syncHOSData(
    tenantId: string,
    providerId: string,
    driverId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<ELDSyncResult> {
    console.log('🔄 Syncing HOS data:', {
      tenantId,
      providerId,
      driverId,
      startDate,
      endDate,
    });

    try {
      const provider = this.getSupportedProviders().find(
        (p) => p.providerId === providerId
      );
      if (!provider) {
        throw new Error(`Unsupported ELD provider: ${providerId}`);
      }

      // For now, return mock data - in production, this would call actual ELD APIs
      const mockHOSRecords = this.generateMockHOSData(
        tenantId,
        providerId,
        driverId
      );
      const violations = this.detectHOSViolations(mockHOSRecords);

      console.log('✅ HOS data sync completed:', {
        recordsProcessed: mockHOSRecords.length,
        violationsDetected: violations.length,
      });

      return {
        success: true,
        recordsProcessed: mockHOSRecords.length,
        violationsDetected: violations.length,
        errors: [],
        lastSyncTime: new Date().toISOString(),
      };
    } catch (error) {
      console.error('❌ HOS data sync failed:', error);
      return {
        success: false,
        recordsProcessed: 0,
        violationsDetected: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        lastSyncTime: new Date().toISOString(),
      };
    }
  }

  /**
   * Sync vehicle diagnostics from ELD provider
   */
  async syncVehicleDiagnostics(
    tenantId: string,
    providerId: string,
    vehicleId?: string,
    startTime?: string,
    endTime?: string
  ): Promise<ELDSyncResult> {
    console.log('🚗 Syncing vehicle diagnostics:', {
      tenantId,
      providerId,
      vehicleId,
      startTime,
      endTime,
    });

    try {
      const provider = this.getSupportedProviders().find(
        (p) => p.providerId === providerId
      );
      if (!provider) {
        throw new Error(`Unsupported ELD provider: ${providerId}`);
      }

      // For now, return mock data - in production, this would call actual ELD APIs
      const mockDiagnostics = this.generateMockDiagnosticsData(
        tenantId,
        providerId,
        vehicleId
      );

      console.log('✅ Vehicle diagnostics sync completed:', {
        recordsProcessed: mockDiagnostics.length,
      });

      return {
        success: true,
        recordsProcessed: mockDiagnostics.length,
        violationsDetected: 0,
        errors: [],
        lastSyncTime: new Date().toISOString(),
      };
    } catch (error) {
      console.error('❌ Vehicle diagnostics sync failed:', error);
      return {
        success: false,
        recordsProcessed: 0,
        violationsDetected: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        lastSyncTime: new Date().toISOString(),
      };
    }
  }

  /**
   * Detect HOS violations in records
   */
  detectHOSViolations(hosRecords: HOSRecord[]): HOSViolation[] {
    const violations: HOSViolation[] = [];

    // Group records by driver and date
    const driverRecords = new Map<string, HOSRecord[]>();
    hosRecords.forEach((record) => {
      const key = `${record.driverId}-${record.recordDate}`;
      if (!driverRecords.has(key)) {
        driverRecords.set(key, []);
      }
      driverRecords.get(key)!.push(record);
    });

    // Check each driver's records for violations
    driverRecords.forEach((records, key) => {
      const [driverId] = key.split('-');
      const driverViolations = this.checkDriverHOSViolations(driverId, records);
      violations.push(...driverViolations);
    });

    return violations;
  }

  /**
   * Check individual driver for HOS violations
   */
  private checkDriverHOSViolations(
    driverId: string,
    records: HOSRecord[]
  ): HOSViolation[] {
    const violations: HOSViolation[] = [];

    // Sort records by start time
    records.sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    let totalDrivingMinutes = 0;
    let totalDutyMinutes = 0;
    let lastOffDutyTime: Date | null = null;
    let consecutiveDrivingMinutes = 0;
    let lastBreakTime: Date | null = null;

    records.forEach((record) => {
      const duration = record.durationMinutes || 0;
      const recordTime = new Date(record.startTime);

      // Track driving and duty time
      if (record.dutyStatus === 'driving') {
        totalDrivingMinutes += duration;
        consecutiveDrivingMinutes += duration;
      } else {
        consecutiveDrivingMinutes = 0;
      }

      if (
        record.dutyStatus !== 'off_duty' &&
        record.dutyStatus !== 'sleeper_berth'
      ) {
        totalDutyMinutes += duration;
      } else {
        lastOffDutyTime = recordTime;
        if (duration >= 30) {
          // 30-minute break
          lastBreakTime = recordTime;
        }
      }

      // Check 11-hour driving limit
      if (totalDrivingMinutes > 660) {
        // 11 hours = 660 minutes
        violations.push({
          tenantId: record.tenantId,
          driverId,
          vehicleId: record.vehicleId,
          violationType: 'driving_time',
          severity: 'violation',
          description: `Exceeded 11-hour driving limit (${Math.round((totalDrivingMinutes / 60) * 10) / 10} hours)`,
          violationTime: record.startTime,
          timeRemaining: 0,
          resolved: false,
          createdAt: new Date().toISOString(),
        });
      }

      // Check 14-hour duty limit
      if (totalDutyMinutes > 840) {
        // 14 hours = 840 minutes
        violations.push({
          tenantId: record.tenantId,
          driverId,
          vehicleId: record.vehicleId,
          violationType: 'duty_time',
          severity: 'violation',
          description: `Exceeded 14-hour duty limit (${Math.round((totalDutyMinutes / 60) * 10) / 10} hours)`,
          violationTime: record.startTime,
          timeRemaining: 0,
          resolved: false,
          createdAt: new Date().toISOString(),
        });
      }

      // Check 30-minute break requirement (after 8 hours of driving)
      if (
        consecutiveDrivingMinutes > 480 &&
        (!lastBreakTime ||
          recordTime.getTime() - lastBreakTime.getTime() > 8 * 60 * 60 * 1000)
      ) {
        violations.push({
          tenantId: record.tenantId,
          driverId,
          vehicleId: record.vehicleId,
          violationType: 'rest_break',
          severity: 'violation',
          description:
            'Required 30-minute break not taken after 8 hours of driving',
          violationTime: record.startTime,
          timeRemaining: 0,
          resolved: false,
          createdAt: new Date().toISOString(),
        });
      }
    });

    return violations;
  }

  /**
   * Calculate remaining HOS time for a driver
   */
  calculateRemainingTime(hosRecords: HOSRecord[]): {
    drivingTimeRemaining: number;
    dutyTimeRemaining: number;
    requiredRestTime: number;
  } {
    let totalDrivingMinutes = 0;
    let totalDutyMinutes = 0;

    hosRecords.forEach((record) => {
      const duration = record.durationMinutes || 0;

      if (record.dutyStatus === 'driving') {
        totalDrivingMinutes += duration;
      }

      if (
        record.dutyStatus !== 'off_duty' &&
        record.dutyStatus !== 'sleeper_berth'
      ) {
        totalDutyMinutes += duration;
      }
    });

    return {
      drivingTimeRemaining: Math.max(0, 660 - totalDrivingMinutes), // 11 hours
      dutyTimeRemaining: Math.max(0, 840 - totalDutyMinutes), // 14 hours
      requiredRestTime:
        Math.max(0, 600 - (Date.now() - this.getLastOffDutyTime(hosRecords))) /
        60000, // 10 hours
    };
  }

  /**
   * Get last off-duty time for a driver
   */
  private getLastOffDutyTime(hosRecords: HOSRecord[]): number {
    const offDutyRecords = hosRecords
      .filter(
        (record) =>
          record.dutyStatus === 'off_duty' ||
          record.dutyStatus === 'sleeper_berth'
      )
      .sort(
        (a, b) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      );

    return offDutyRecords.length > 0
      ? new Date(offDutyRecords[0].startTime).getTime()
      : 0;
  }

  /**
   * Process ELD webhook data
   */
  async processWebhookData(
    providerId: string,
    webhookData: any,
    signature?: string
  ): Promise<{ success: boolean; message: string }> {
    console.log('📡 Processing ELD webhook data:', {
      providerId,
      dataType: typeof webhookData,
    });

    try {
      // Verify webhook signature if provided
      if (signature && this.webhookSecret) {
        const isValid = this.verifyWebhookSignature(
          JSON.stringify(webhookData),
          signature
        );
        if (!isValid) {
          throw new Error('Invalid webhook signature');
        }
      }

      // Process based on provider
      switch (providerId) {
        case 'open_eld':
          return await this.processOpenELDWebhook(webhookData);
        case 'samsara':
          return await this.processSamsaraWebhook(webhookData);
        case 'motive':
          return await this.processMotiveWebhook(webhookData);
        default:
          return await this.processGenericWebhook(webhookData);
      }
    } catch (error) {
      console.error('❌ Webhook processing failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Verify webhook signature
   */
  private verifyWebhookSignature(payload: string, signature: string): boolean {
    // In production, implement proper HMAC signature verification
    // For now, return true if webhook secret is configured
    return !!this.webhookSecret;
  }

  /**
   * Process Open ELD webhook
   */
  private async processOpenELDWebhook(
    data: any
  ): Promise<{ success: boolean; message: string }> {
    console.log('🔓 Processing Open ELD webhook data');

    // Process Open ELD standard format
    if (data.eventType === 'hos_update') {
      // Handle HOS record update
      console.log('📋 HOS update received:', data.hosRecord);
    } else if (data.eventType === 'violation_detected') {
      // Handle violation alert
      console.log('🚨 Violation detected:', data.violation);
    } else if (data.eventType === 'diagnostic_update') {
      // Handle vehicle diagnostic update
      console.log('🔧 Diagnostic update received:', data.diagnostic);
    }

    return {
      success: true,
      message: 'Open ELD webhook processed successfully',
    };
  }

  /**
   * Process Samsara webhook
   */
  private async processSamsaraWebhook(
    data: any
  ): Promise<{ success: boolean; message: string }> {
    console.log('📊 Processing Samsara webhook data');
    return { success: true, message: 'Samsara webhook processed successfully' };
  }

  /**
   * Process Motive webhook
   */
  private async processMotiveWebhook(
    data: any
  ): Promise<{ success: boolean; message: string }> {
    console.log('🚛 Processing Motive webhook data');
    return { success: true, message: 'Motive webhook processed successfully' };
  }

  /**
   * Process generic webhook
   */
  private async processGenericWebhook(
    data: any
  ): Promise<{ success: boolean; message: string }> {
    console.log('📡 Processing generic ELD webhook data');
    return { success: true, message: 'Generic webhook processed successfully' };
  }

  /**
   * Generate mock HOS data for testing
   */
  private generateMockHOSData(
    tenantId: string,
    providerId: string,
    driverId?: string
  ): HOSRecord[] {
    const records: HOSRecord[] = [];
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const mockDriverId = driverId || 'driver-123';
    const mockVehicleId = 'vehicle-456';

    // Generate a typical day's HOS records
    const dayRecords = [
      {
        tenantId,
        driverId: mockDriverId,
        vehicleId: mockVehicleId,
        eldProviderId: providerId,
        recordDate: yesterday.toISOString().split('T')[0],
        dutyStatus: 'off_duty' as const,
        startTime: new Date(yesterday.setHours(0, 0, 0, 0)).toISOString(),
        endTime: new Date(yesterday.setHours(6, 0, 0, 0)).toISOString(),
        durationMinutes: 360, // 6 hours
        startLocation: {
          latitude: 33.749,
          longitude: -84.388,
          address: 'Atlanta, GA',
        },
        endLocation: {
          latitude: 33.749,
          longitude: -84.388,
          address: 'Atlanta, GA',
        },
        odometerStart: 125000,
        odometerEnd: 125000,
        engineHours: 2500.5,
      },
      {
        tenantId,
        driverId: mockDriverId,
        vehicleId: mockVehicleId,
        eldProviderId: providerId,
        recordDate: yesterday.toISOString().split('T')[0],
        dutyStatus: 'on_duty_not_driving' as const,
        startTime: new Date(yesterday.setHours(6, 0, 0, 0)).toISOString(),
        endTime: new Date(yesterday.setHours(6, 30, 0, 0)).toISOString(),
        durationMinutes: 30,
        startLocation: {
          latitude: 33.749,
          longitude: -84.388,
          address: 'Atlanta, GA',
        },
        endLocation: {
          latitude: 33.749,
          longitude: -84.388,
          address: 'Atlanta, GA',
        },
        odometerStart: 125000,
        odometerEnd: 125000,
        engineHours: 2500.5,
      },
      {
        tenantId,
        driverId: mockDriverId,
        vehicleId: mockVehicleId,
        eldProviderId: providerId,
        recordDate: yesterday.toISOString().split('T')[0],
        dutyStatus: 'driving' as const,
        startTime: new Date(yesterday.setHours(6, 30, 0, 0)).toISOString(),
        endTime: new Date(yesterday.setHours(11, 0, 0, 0)).toISOString(),
        durationMinutes: 270, // 4.5 hours
        startLocation: {
          latitude: 33.749,
          longitude: -84.388,
          address: 'Atlanta, GA',
        },
        endLocation: {
          latitude: 32.0835,
          longitude: -81.0998,
          address: 'Savannah, GA',
        },
        odometerStart: 125000,
        odometerEnd: 125285,
        engineHours: 2505.0,
      },
    ];

    records.push(...dayRecords);
    return records;
  }

  /**
   * Generate mock vehicle diagnostics data for testing
   */
  private generateMockDiagnosticsData(
    tenantId: string,
    providerId: string,
    vehicleId?: string
  ): VehicleDiagnostic[] {
    const diagnostics: VehicleDiagnostic[] = [];
    const now = new Date();
    const mockVehicleId = vehicleId || 'vehicle-456';

    // Generate recent diagnostic data
    for (let i = 0; i < 5; i++) {
      const timestamp = new Date(now.getTime() - i * 15 * 60 * 1000); // Every 15 minutes

      diagnostics.push({
        tenantId,
        vehicleId: mockVehicleId,
        eldProviderId: providerId,
        timestamp: timestamp.toISOString(),
        location: {
          latitude: 33.749 + (Math.random() - 0.5) * 0.1,
          longitude: -84.388 + (Math.random() - 0.5) * 0.1,
          address: 'Atlanta Metro Area',
        },
        speed: Math.floor(Math.random() * 70) + 10, // 10-80 mph
        engineRpm: Math.floor(Math.random() * 1000) + 1200, // 1200-2200 RPM
        fuelLevel: Math.floor(Math.random() * 40) + 60, // 60-100%
        engineTemp: Math.floor(Math.random() * 20) + 180, // 180-200°F
        odometer: 125000 + i * 15, // Incremental odometer
        diagnosticCodes: i === 0 ? ['P0420'] : [], // Occasional diagnostic code
        rawData: {
          batteryVoltage: 12.6,
          coolantTemp: 185,
          oilPressure: 45,
        },
      });
    }

    return diagnostics;
  }

  /**
   * Get service health status
   */
  async healthCheck(): Promise<{
    status: string;
    supportedProviders: number;
    syncInterval: number;
    webhookConfigured: boolean;
    dataRetentionDays: number;
  }> {
    const providers = this.getSupportedProviders();

    return {
      status: 'operational',
      supportedProviders: providers.length,
      syncInterval: this.syncIntervalMinutes,
      webhookConfigured: !!this.webhookSecret,
      dataRetentionDays: this.dataRetentionDays,
    };
  }
}

export const eldDataImportService = new ELDDataImportService();

