// IFTA State Portal APIs Management Routes
// Handles Interstate Fuel Tax Agreement compliance operations

import { NextRequest, NextResponse } from 'next/server';
import { iftaStatePortalService } from '../../../services/tax/IFTAStatePortalService';

// Mock database service (replace with actual Supabase integration)
interface IFTAFuelPurchase {
  id: string;
  tenantId: string;
  vehicleId?: string;
  purchaseDate: string;
  stateCode: string;
  gallons: number;
  pricePerGallon: number;
  totalAmount: number;
  vendorName?: string;
  receiptNumber?: string;
  fuelType: 'diesel' | 'gasoline';
  createdAt: string;
}

interface IFTAMileageRecord {
  id: string;
  tenantId: string;
  vehicleId: string;
  travelDate: string;
  stateCode: string;
  miles: number;
  routeDetails?: string;
  createdAt: string;
}

interface IFTAReturn {
  id: string;
  tenantId: string;
  quarter: string;
  year: number;
  filingStatus: 'draft' | 'filed' | 'accepted' | 'rejected';
  totalTaxDue: number;
  totalRefundDue: number;
  filedDate?: string;
  dueDate: string;
  returnData: any;
  createdAt: string;
  updatedAt: string;
}

class MockIFTADatabase {
  private fuelPurchases: Map<string, IFTAFuelPurchase> = new Map();
  private mileageRecords: Map<string, IFTAMileageRecord> = new Map();
  private returns: Map<string, IFTAReturn> = new Map();

  async saveFuelPurchase(
    purchase: Omit<IFTAFuelPurchase, 'id' | 'createdAt'>
  ): Promise<IFTAFuelPurchase> {
    const id = `fuel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newPurchase: IFTAFuelPurchase = {
      ...purchase,
      id,
      createdAt: new Date().toISOString(),
    };

    this.fuelPurchases.set(id, newPurchase);
    return newPurchase;
  }

  async saveMileageRecord(
    record: Omit<IFTAMileageRecord, 'id' | 'createdAt'>
  ): Promise<IFTAMileageRecord> {
    const id = `mileage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newRecord: IFTAMileageRecord = {
      ...record,
      id,
      createdAt: new Date().toISOString(),
    };

    this.mileageRecords.set(id, newRecord);
    return newRecord;
  }

  async getFuelPurchasesByTenantAndQuarter(
    tenantId: string,
    year: number,
    quarter: number
  ): Promise<IFTAFuelPurchase[]> {
    const quarterMonths = {
      1: [1, 2, 3],
      2: [4, 5, 6],
      3: [7, 8, 9],
      4: [10, 11, 12],
    };

    return Array.from(this.fuelPurchases.values()).filter((purchase) => {
      if (purchase.tenantId !== tenantId) return false;

      const purchaseDate = new Date(purchase.purchaseDate);
      const purchaseYear = purchaseDate.getFullYear();
      const purchaseMonth = purchaseDate.getMonth() + 1;

      return (
        purchaseYear === year &&
        quarterMonths[quarter as keyof typeof quarterMonths].includes(
          purchaseMonth
        )
      );
    });
  }

  async getMileageRecordsByTenantAndQuarter(
    tenantId: string,
    year: number,
    quarter: number
  ): Promise<IFTAMileageRecord[]> {
    const quarterMonths = {
      1: [1, 2, 3],
      2: [4, 5, 6],
      3: [7, 8, 9],
      4: [10, 11, 12],
    };

    return Array.from(this.mileageRecords.values()).filter((record) => {
      if (record.tenantId !== tenantId) return false;

      const travelDate = new Date(record.travelDate);
      const travelYear = travelDate.getFullYear();
      const travelMonth = travelDate.getMonth() + 1;

      return (
        travelYear === year &&
        quarterMonths[quarter as keyof typeof quarterMonths].includes(
          travelMonth
        )
      );
    });
  }

  async saveReturn(
    returnData: Omit<IFTAReturn, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<IFTAReturn> {
    const id = `return_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const newReturn: IFTAReturn = {
      ...returnData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.returns.set(id, newReturn);
    return newReturn;
  }

  async getReturnsByTenant(tenantId: string): Promise<IFTAReturn[]> {
    return Array.from(this.returns.values())
      .filter((returnRecord) => returnRecord.tenantId === tenantId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
}

const mockDb = new MockIFTADatabase();

// Helper function to get tenant ID (replace with actual auth)
function getTenantId(request: NextRequest): string {
  return request.headers.get('x-tenant-id') || 'default-tenant';
}

// POST /api/tax/ifta - Handle various IFTA operations
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'fuel-purchase';

    switch (action) {
      case 'fuel-purchase':
        return await handleRecordFuelPurchase(request);
      case 'mileage':
        return await handleRecordMileage(request);
      case 'generate-return':
        return await handleGenerateReturn(request);
      case 'file-return':
        return await handleFileReturn(request);
      case 'validate-fuel':
        return await handleValidateFuelPurchase(request);
      case 'validate-mileage':
        return await handleValidateMileage(request);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('IFTA API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET /api/tax/ifta - Get IFTA data and status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'jurisdictions';
    const tenantId = getTenantId(request);

    switch (action) {
      case 'jurisdictions':
        return await handleGetJurisdictions();
      case 'return':
        return await handleGetReturn(request, tenantId);
      case 'compliance-status':
        return await handleGetComplianceStatus(request, tenantId);
      case 'fuel-purchases':
        return await handleGetFuelPurchases(request, tenantId);
      case 'mileage-records':
        return await handleGetMileageRecords(request, tenantId);
      case 'returns-history':
        return await handleGetReturnsHistory(request, tenantId);
      case 'health':
        return await handleHealthCheck();
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('IFTA API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleRecordFuelPurchase(request: NextRequest) {
  const tenantId = getTenantId(request);
  const purchaseData = await request.json();

  console.info('⛽ Recording fuel purchase for tenant:', tenantId);

  // Validate fuel purchase data
  const validation = iftaStatePortalService.validateFuelPurchase(purchaseData);
  if (!validation.valid) {
    return NextResponse.json(
      { error: 'Validation failed', errors: validation.errors },
      { status: 400 }
    );
  }

  try {
    const savedPurchase = await mockDb.saveFuelPurchase({
      tenantId,
      ...purchaseData,
    });

    console.info('✅ Fuel purchase recorded:', savedPurchase.id);

    return NextResponse.json({
      success: true,
      purchase: {
        id: savedPurchase.id,
        purchaseDate: savedPurchase.purchaseDate,
        stateCode: savedPurchase.stateCode,
        gallons: savedPurchase.gallons,
        totalAmount: savedPurchase.totalAmount,
        fuelType: savedPurchase.fuelType,
      },
    });
  } catch (error) {
    console.error('❌ Failed to record fuel purchase:', error);
    return NextResponse.json(
      {
        error: 'Failed to record fuel purchase',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleRecordMileage(request: NextRequest) {
  const tenantId = getTenantId(request);
  const mileageData = await request.json();

  console.info('🛣️ Recording mileage for tenant:', tenantId);

  // Validate mileage record data
  const validation = iftaStatePortalService.validateMileageRecord(mileageData);
  if (!validation.valid) {
    return NextResponse.json(
      { error: 'Validation failed', errors: validation.errors },
      { status: 400 }
    );
  }

  try {
    const savedRecord = await mockDb.saveMileageRecord({
      tenantId,
      ...mileageData,
    });

    console.info('✅ Mileage record saved:', savedRecord.id);

    return NextResponse.json({
      success: true,
      record: {
        id: savedRecord.id,
        travelDate: savedRecord.travelDate,
        stateCode: savedRecord.stateCode,
        miles: savedRecord.miles,
        vehicleId: savedRecord.vehicleId,
      },
    });
  } catch (error) {
    console.error('❌ Failed to record mileage:', error);
    return NextResponse.json(
      {
        error: 'Failed to record mileage',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleGenerateReturn(request: NextRequest) {
  const tenantId = getTenantId(request);
  const { year, quarter } = await request.json();

  if (!year || !quarter || quarter < 1 || quarter > 4) {
    return NextResponse.json(
      { error: 'Valid year and quarter (1-4) required' },
      { status: 400 }
    );
  }

  try {
    console.info('📊 Generating IFTA return:', { tenantId, year, quarter });

    // Get fuel purchases and mileage for the quarter
    const fuelPurchases = await mockDb.getFuelPurchasesByTenantAndQuarter(
      tenantId,
      year,
      quarter
    );
    const mileageRecords = await mockDb.getMileageRecordsByTenantAndQuarter(
      tenantId,
      year,
      quarter
    );

    // Calculate quarterly return
    const quarterlyReturn =
      await iftaStatePortalService.calculateQuarterlyReturn(
        tenantId,
        year,
        quarter,
        fuelPurchases,
        mileageRecords
      );

    // Save return to database
    const savedReturn = await mockDb.saveReturn({
      tenantId,
      quarter: quarterlyReturn.quarter,
      year: quarterlyReturn.year,
      filingStatus: 'draft',
      totalTaxDue: quarterlyReturn.totalTaxDue,
      totalRefundDue: quarterlyReturn.totalRefundDue,
      dueDate: quarterlyReturn.dueDate,
      returnData: quarterlyReturn,
    });

    console.info('✅ IFTA return generated:', savedReturn.id);

    return NextResponse.json({
      success: true,
      return: {
        id: savedReturn.id,
        quarter: quarterlyReturn.quarter,
        totalTaxDue: quarterlyReturn.totalTaxDue,
        totalRefundDue: quarterlyReturn.totalRefundDue,
        netAmount: quarterlyReturn.netAmount,
        dueDate: quarterlyReturn.dueDate,
        jurisdictions: quarterlyReturn.jurisdictions,
        summary: {
          totalJurisdictions: quarterlyReturn.jurisdictions.length,
          jurisdictionsWithTaxDue: quarterlyReturn.jurisdictions.filter(
            (j) => j.netTaxDue > 0
          ).length,
          jurisdictionsWithRefund: quarterlyReturn.jurisdictions.filter(
            (j) => j.netTaxDue < 0
          ).length,
        },
      },
    });
  } catch (error) {
    console.error('❌ Failed to generate return:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate return',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleGetJurisdictions() {
  try {
    const jurisdictions = iftaStatePortalService.getIFTAJurisdictions();

    return NextResponse.json({
      success: true,
      jurisdictions: jurisdictions.map((j) => ({
        state: j.state,
        stateCode: j.stateCode,
        taxRate: j.taxRate,
        effectiveDate: j.effectiveDate,
        fuelType: j.fuelType,
        filingFrequency: j.filingFrequency,
        hasAPI: !!j.apiEndpoint,
      })),
      total: jurisdictions.length,
    });
  } catch (error) {
    console.error('❌ Failed to get jurisdictions:', error);
    return NextResponse.json(
      {
        error: 'Failed to get jurisdictions',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleGetComplianceStatus(
  request: NextRequest,
  tenantId: string
) {
  try {
    console.info('📋 Getting compliance status for tenant:', tenantId);

    const complianceStatus =
      await iftaStatePortalService.getComplianceStatus(tenantId);

    return NextResponse.json({
      success: true,
      compliance: complianceStatus,
    });
  } catch (error) {
    console.error('❌ Failed to get compliance status:', error);
    return NextResponse.json(
      {
        error: 'Failed to get compliance status',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleGetReturnsHistory(request: NextRequest, tenantId: string) {
  try {
    console.info('📚 Getting returns history for tenant:', tenantId);

    const returns = await mockDb.getReturnsByTenant(tenantId);

    return NextResponse.json({
      success: true,
      returns: returns.map((returnRecord) => ({
        id: returnRecord.id,
        quarter: returnRecord.quarter,
        year: returnRecord.year,
        filingStatus: returnRecord.filingStatus,
        totalTaxDue: returnRecord.totalTaxDue,
        totalRefundDue: returnRecord.totalRefundDue,
        dueDate: returnRecord.dueDate,
        filedDate: returnRecord.filedDate,
        createdAt: returnRecord.createdAt,
      })),
      total: returns.length,
    });
  } catch (error) {
    console.error('❌ Failed to get returns history:', error);
    return NextResponse.json(
      {
        error: 'Failed to get returns history',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleValidateFuelPurchase(request: NextRequest) {
  const purchaseData = await request.json();

  try {
    const validation =
      iftaStatePortalService.validateFuelPurchase(purchaseData);

    return NextResponse.json({
      success: true,
      valid: validation.valid,
      errors: validation.errors,
    });
  } catch (error) {
    console.error('❌ Validation failed:', error);
    return NextResponse.json(
      {
        error: 'Validation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleValidateMileage(request: NextRequest) {
  const mileageData = await request.json();

  try {
    const validation =
      iftaStatePortalService.validateMileageRecord(mileageData);

    return NextResponse.json({
      success: true,
      valid: validation.valid,
      errors: validation.errors,
    });
  } catch (error) {
    console.error('❌ Validation failed:', error);
    return NextResponse.json(
      {
        error: 'Validation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleHealthCheck() {
  try {
    const health = await iftaStatePortalService.healthCheck();

    return NextResponse.json({
      success: true,
      service: 'IFTA State Portal APIs',
      status: health.status,
      jurisdictionCount: health.jurisdictionCount,
      baseFleetMPG: health.baseFleetMPG,
      defaultFuelType: health.defaultFuelType,
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

// Placeholder handlers for additional endpoints
async function handleFileReturn(request: NextRequest) {
  // This would integrate with actual state portal APIs
  return NextResponse.json({
    success: true,
    message: 'Electronic filing not yet implemented - manual filing required',
    manualFilingInstructions:
      'Please download the generated return and file manually with each state',
  });
}

async function handleGetReturn(request: NextRequest, tenantId: string) {
  const { searchParams } = new URL(request.url);
  const returnId = searchParams.get('id');

  return NextResponse.json({
    success: true,
    message: 'Return retrieval not yet implemented',
    returnId,
  });
}

async function handleGetFuelPurchases(request: NextRequest, tenantId: string) {
  return NextResponse.json({
    success: true,
    fuelPurchases: [],
    message: 'Fuel purchase history retrieval not yet implemented',
  });
}

async function handleGetMileageRecords(request: NextRequest, tenantId: string) {
  return NextResponse.json({
    success: true,
    mileageRecords: [],
    message: 'Mileage record history retrieval not yet implemented',
  });
}

