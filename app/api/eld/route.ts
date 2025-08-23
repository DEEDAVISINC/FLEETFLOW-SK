// ELD Data Import API Routes
// Handles Electronic Logging Device integration and HOS compliance

import { NextRequest, NextResponse } from 'next/server';
import { eldDataImportService } from '../../services/eld/ELDDataImportService';

// Mock database service (replace with actual Supabase integration)
interface ELDProviderConnection {
  id: string;
  tenantId: string;
  providerName: string;
  providerId: string;
  apiEndpoint: string;
  authType: string;
  credentials: any; // encrypted in production
  isActive: boolean;
  lastSync?: string;
  createdAt: string;
}

interface HOSRecordDB {
  id: string;
  tenantId: string;
  driverId: string;
  vehicleId?: string;
  eldProviderId: string;
  recordDate: string;
  dutyStatus: string;
  startTime: string;
  endTime?: string;
  durationMinutes?: number;
  startLocation?: any;
  endLocation?: any;
  odometerStart?: number;
  odometerEnd?: number;
  engineHours?: number;
  createdAt: string;
}

interface HOSViolationDB {
  id: string;
  tenantId: string;
  driverId: string;
  vehicleId?: string;
  violationType: string;
  severity: string;
  description: string;
  violationTime: string;
  timeRemaining?: number;
  resolved: boolean;
  resolvedAt?: string;
  createdAt: string;
}

interface VehicleDiagnosticDB {
  id: string;
  tenantId: string;
  vehicleId: string;
  eldProviderId: string;
  timestamp: string;
  location: any;
  speed: number;
  engineRpm: number;
  fuelLevel: number;
  engineTemp: number;
  odometer: number;
  diagnosticCodes?: string[];
  rawData?: any;
  createdAt: string;
}

class MockELDDatabase {
  private providerConnections: Map<string, ELDProviderConnection> = new Map();
  private hosRecords: Map<string, HOSRecordDB> = new Map();
  private violations: Map<string, HOSViolationDB> = new Map();
  private diagnostics: Map<string, VehicleDiagnosticDB> = new Map();

  async saveProviderConnection(
    connection: Omit<ELDProviderConnection, 'id' | 'createdAt'>
  ): Promise<ELDProviderConnection> {
    const id = `provider_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newConnection: ELDProviderConnection = {
      ...connection,
      id,
      createdAt: new Date().toISOString(),
    };

    this.providerConnections.set(id, newConnection);
    return newConnection;
  }

  async getProviderConnectionsByTenant(
    tenantId: string
  ): Promise<ELDProviderConnection[]> {
    return Array.from(this.providerConnections.values()).filter(
      (connection) => connection.tenantId === tenantId
    );
  }

  async saveHOSRecord(
    record: Omit<HOSRecordDB, 'id' | 'createdAt'>
  ): Promise<HOSRecordDB> {
    const id = `hos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newRecord: HOSRecordDB = {
      ...record,
      id,
      createdAt: new Date().toISOString(),
    };

    this.hosRecords.set(id, newRecord);
    return newRecord;
  }

  async getHOSRecordsByDriver(
    tenantId: string,
    driverId: string,
    startDate?: string,
    endDate?: string
  ): Promise<HOSRecordDB[]> {
    return Array.from(this.hosRecords.values())
      .filter((record) => {
        if (record.tenantId !== tenantId || record.driverId !== driverId)
          return false;

        if (startDate && record.recordDate < startDate) return false;
        if (endDate && record.recordDate > endDate) return false;

        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      );
  }

  async saveViolation(
    violation: Omit<HOSViolationDB, 'id' | 'createdAt'>
  ): Promise<HOSViolationDB> {
    const id = `violation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newViolation: HOSViolationDB = {
      ...violation,
      id,
      createdAt: new Date().toISOString(),
    };

    this.violations.set(id, newViolation);
    return newViolation;
  }

  async getViolationsByTenant(
    tenantId: string,
    resolved?: boolean
  ): Promise<HOSViolationDB[]> {
    return Array.from(this.violations.values())
      .filter((violation) => {
        if (violation.tenantId !== tenantId) return false;
        if (resolved !== undefined && violation.resolved !== resolved)
          return false;
        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.violationTime).getTime() -
          new Date(a.violationTime).getTime()
      );
  }

  async saveDiagnostic(
    diagnostic: Omit<VehicleDiagnosticDB, 'id' | 'createdAt'>
  ): Promise<VehicleDiagnosticDB> {
    const id = `diagnostic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newDiagnostic: VehicleDiagnosticDB = {
      ...diagnostic,
      id,
      createdAt: new Date().toISOString(),
    };

    this.diagnostics.set(id, newDiagnostic);
    return newDiagnostic;
  }

  async getDiagnosticsByVehicle(
    tenantId: string,
    vehicleId: string,
    limit: number = 50
  ): Promise<VehicleDiagnosticDB[]> {
    return Array.from(this.diagnostics.values())
      .filter(
        (diagnostic) =>
          diagnostic.tenantId === tenantId && diagnostic.vehicleId === vehicleId
      )
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, limit);
  }
}

const mockDb = new MockELDDatabase();

// Helper function to get tenant ID (replace with actual auth)
function getTenantId(request: NextRequest): string {
  return request.headers.get('x-tenant-id') || 'default-tenant';
}

// POST /api/eld - Handle various ELD operations
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'connect';

    switch (action) {
      case 'connect':
        return await handleConnectProvider(request);
      case 'sync':
        return await handleSyncData(request);
      case 'webhook':
        return await handleWebhook(request);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('ELD API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET /api/eld - Get ELD data and status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'providers';
    const tenantId = getTenantId(request);

    switch (action) {
      case 'providers':
        return await handleGetProviders();
      case 'connections':
        return await handleGetConnections(request, tenantId);
      case 'hos':
        return await handleGetHOSData(request, tenantId);
      case 'violations':
        return await handleGetViolations(request, tenantId);
      case 'diagnostics':
        return await handleGetDiagnostics(request, tenantId);
      case 'health':
        return await handleHealthCheck();
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('ELD API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleConnectProvider(request: NextRequest) {
  const tenantId = getTenantId(request);
  const connectionData = await request.json();

  console.log('🔗 Connecting ELD provider for tenant:', tenantId);

  if (!connectionData.providerId || !connectionData.credentials) {
    return NextResponse.json(
      { error: 'Provider ID and credentials are required' },
      { status: 400 }
    );
  }

  try {
    // Validate provider exists
    const supportedProviders = eldDataImportService.getSupportedProviders();
    const provider = supportedProviders.find(
      (p) => p.providerId === connectionData.providerId
    );

    if (!provider) {
      return NextResponse.json(
        { error: 'Unsupported ELD provider' },
        { status: 400 }
      );
    }

    // Save connection
    const connection = await mockDb.saveProviderConnection({
      tenantId,
      providerName: provider.name,
      providerId: provider.providerId,
      apiEndpoint: provider.apiEndpoint,
      authType: provider.authType,
      credentials: connectionData.credentials, // Should be encrypted in production
      isActive: true,
    });

    console.log('✅ ELD provider connected:', connection.id);

    return NextResponse.json({
      success: true,
      connection: {
        id: connection.id,
        providerName: connection.providerName,
        providerId: connection.providerId,
        isActive: connection.isActive,
        createdAt: connection.createdAt,
      },
    });
  } catch (error) {
    console.error('❌ Failed to connect ELD provider:', error);
    return NextResponse.json(
      {
        error: 'Failed to connect ELD provider',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleSyncData(request: NextRequest) {
  const tenantId = getTenantId(request);
  const { providerId, driverId, vehicleId, startDate, endDate, dataType } =
    await request.json();

  console.log('🔄 Syncing ELD data:', { tenantId, providerId, dataType });

  if (!providerId) {
    return NextResponse.json(
      { error: 'Provider ID is required' },
      { status: 400 }
    );
  }

  try {
    let syncResult;

    if (dataType === 'diagnostics') {
      syncResult = await eldDataImportService.syncVehicleDiagnostics(
        tenantId,
        providerId,
        vehicleId,
        startDate,
        endDate
      );
    } else {
      // Default to HOS data sync
      syncResult = await eldDataImportService.syncHOSData(
        tenantId,
        providerId,
        driverId,
        startDate,
        endDate
      );
    }

    console.log('✅ ELD data sync completed:', syncResult);

    return NextResponse.json({
      success: syncResult.success,
      result: {
        recordsProcessed: syncResult.recordsProcessed,
        violationsDetected: syncResult.violationsDetected,
        lastSyncTime: syncResult.lastSyncTime,
        errors: syncResult.errors,
      },
    });
  } catch (error) {
    console.error('❌ ELD data sync failed:', error);
    return NextResponse.json(
      {
        error: 'ELD data sync failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleWebhook(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const providerId = searchParams.get('providerId');
  const signature = request.headers.get('x-webhook-signature');

  if (!providerId) {
    return NextResponse.json(
      { error: 'Provider ID is required' },
      { status: 400 }
    );
  }

  try {
    const webhookData = await request.json();

    console.log('📡 Processing ELD webhook:', { providerId });

    const result = await eldDataImportService.processWebhookData(
      providerId,
      webhookData,
      signature || undefined
    );

    return NextResponse.json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    console.error('❌ Webhook processing failed:', error);
    return NextResponse.json(
      {
        error: 'Webhook processing failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleGetProviders() {
  try {
    const providers = eldDataImportService.getSupportedProviders();

    return NextResponse.json({
      success: true,
      providers: providers.map((provider) => ({
        name: provider.name,
        providerId: provider.providerId,
        authType: provider.authType,
        dataFormats: provider.dataFormats,
        realTimeSupport: provider.realTimeSupport,
        hosCompliant: provider.hosCompliant,
        webhookSupport: provider.webhookSupport,
      })),
      total: providers.length,
    });
  } catch (error) {
    console.error('❌ Failed to get providers:', error);
    return NextResponse.json(
      {
        error: 'Failed to get providers',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleGetConnections(request: NextRequest, tenantId: string) {
  try {
    console.log('🔗 Getting ELD connections for tenant:', tenantId);

    const connections = await mockDb.getProviderConnectionsByTenant(tenantId);

    return NextResponse.json({
      success: true,
      connections: connections.map((connection) => ({
        id: connection.id,
        providerName: connection.providerName,
        providerId: connection.providerId,
        isActive: connection.isActive,
        lastSync: connection.lastSync,
        createdAt: connection.createdAt,
      })),
      total: connections.length,
    });
  } catch (error) {
    console.error('❌ Failed to get connections:', error);
    return NextResponse.json(
      {
        error: 'Failed to get connections',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleGetHOSData(request: NextRequest, tenantId: string) {
  const { searchParams } = new URL(request.url);
  const driverId = searchParams.get('driverId');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!driverId) {
    return NextResponse.json(
      { error: 'Driver ID is required' },
      { status: 400 }
    );
  }

  try {
    console.log('📋 Getting HOS data:', {
      tenantId,
      driverId,
      startDate,
      endDate,
    });

    const hosRecords = await mockDb.getHOSRecordsByDriver(
      tenantId,
      driverId,
      startDate || undefined,
      endDate || undefined
    );

    // Calculate remaining time
    const remainingTime = eldDataImportService.calculateRemainingTime(
      hosRecords.map((record) => ({
        tenantId: record.tenantId,
        driverId: record.driverId,
        vehicleId: record.vehicleId,
        eldProviderId: record.eldProviderId,
        recordDate: record.recordDate,
        dutyStatus: record.dutyStatus as any,
        startTime: record.startTime,
        endTime: record.endTime,
        durationMinutes: record.durationMinutes,
        startLocation: record.startLocation,
        endLocation: record.endLocation,
        odometerStart: record.odometerStart,
        odometerEnd: record.odometerEnd,
        engineHours: record.engineHours,
      }))
    );

    return NextResponse.json({
      success: true,
      hosRecords: hosRecords.map((record) => ({
        id: record.id,
        recordDate: record.recordDate,
        dutyStatus: record.dutyStatus,
        startTime: record.startTime,
        endTime: record.endTime,
        durationMinutes: record.durationMinutes,
        startLocation: record.startLocation,
        endLocation: record.endLocation,
        odometerStart: record.odometerStart,
        odometerEnd: record.odometerEnd,
        engineHours: record.engineHours,
      })),
      remainingTime: {
        drivingTimeRemaining: Math.round(remainingTime.drivingTimeRemaining),
        dutyTimeRemaining: Math.round(remainingTime.dutyTimeRemaining),
        requiredRestTime: Math.round(remainingTime.requiredRestTime),
      },
      total: hosRecords.length,
    });
  } catch (error) {
    console.error('❌ Failed to get HOS data:', error);
    return NextResponse.json(
      {
        error: 'Failed to get HOS data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleGetViolations(request: NextRequest, tenantId: string) {
  const { searchParams } = new URL(request.url);
  const resolved = searchParams.get('resolved');

  try {
    console.log('🚨 Getting HOS violations for tenant:', tenantId);

    const violations = await mockDb.getViolationsByTenant(
      tenantId,
      resolved ? resolved === 'true' : undefined
    );

    return NextResponse.json({
      success: true,
      violations: violations.map((violation) => ({
        id: violation.id,
        driverId: violation.driverId,
        vehicleId: violation.vehicleId,
        violationType: violation.violationType,
        severity: violation.severity,
        description: violation.description,
        violationTime: violation.violationTime,
        timeRemaining: violation.timeRemaining,
        resolved: violation.resolved,
        resolvedAt: violation.resolvedAt,
        createdAt: violation.createdAt,
      })),
      summary: {
        total: violations.length,
        unresolved: violations.filter((v) => !v.resolved).length,
        critical: violations.filter((v) => v.severity === 'critical').length,
        warnings: violations.filter((v) => v.severity === 'warning').length,
      },
    });
  } catch (error) {
    console.error('❌ Failed to get violations:', error);
    return NextResponse.json(
      {
        error: 'Failed to get violations',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleGetDiagnostics(request: NextRequest, tenantId: string) {
  const { searchParams } = new URL(request.url);
  const vehicleId = searchParams.get('vehicleId');
  const limit = parseInt(searchParams.get('limit') || '50');

  if (!vehicleId) {
    return NextResponse.json(
      { error: 'Vehicle ID is required' },
      { status: 400 }
    );
  }

  try {
    console.log('🔧 Getting vehicle diagnostics:', { tenantId, vehicleId });

    const diagnostics = await mockDb.getDiagnosticsByVehicle(
      tenantId,
      vehicleId,
      limit
    );

    return NextResponse.json({
      success: true,
      diagnostics: diagnostics.map((diagnostic) => ({
        id: diagnostic.id,
        timestamp: diagnostic.timestamp,
        location: diagnostic.location,
        speed: diagnostic.speed,
        engineRpm: diagnostic.engineRpm,
        fuelLevel: diagnostic.fuelLevel,
        engineTemp: diagnostic.engineTemp,
        odometer: diagnostic.odometer,
        diagnosticCodes: diagnostic.diagnosticCodes,
        createdAt: diagnostic.createdAt,
      })),
      total: diagnostics.length,
    });
  } catch (error) {
    console.error('❌ Failed to get diagnostics:', error);
    return NextResponse.json(
      {
        error: 'Failed to get diagnostics',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleHealthCheck() {
  try {
    const health = await eldDataImportService.healthCheck();

    return NextResponse.json({
      success: true,
      service: 'ELD Data Import APIs',
      status: health.status,
      supportedProviders: health.supportedProviders,
      syncInterval: health.syncInterval,
      webhookConfigured: health.webhookConfigured,
      dataRetentionDays: health.dataRetentionDays,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Health check failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

