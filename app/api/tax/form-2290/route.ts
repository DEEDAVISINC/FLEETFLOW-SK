// Form 2290 Management API Routes
// Handles Heavy Vehicle Use Tax (HVUT) filing operations

import { NextRequest, NextResponse } from 'next/server';
import { taxBanditsService } from '../../../services/tax/TaxBanditsService';

// Mock database service (replace with actual Supabase integration)
interface Form2290Filing {
  id: string;
  tenantId: string;
  submissionId: string;
  filingType: string;
  taxPeriodStart: string;
  taxPeriodEnd: string;
  totalTaxDue: number;
  filingStatus: string;
  filedDate?: string;
  dueDate: string;
  businessEin: string;
  vehicleCount: number;
  createdAt: string;
  updatedAt: string;
}

class MockForm2290Database {
  private filings: Map<string, Form2290Filing> = new Map();

  async saveFiling(
    filing: Omit<Form2290Filing, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Form2290Filing> {
    const id = `filing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const newFiling: Form2290Filing = {
      ...filing,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.filings.set(id, newFiling);
    return newFiling;
  }

  async updateFiling(
    id: string,
    updates: Partial<Form2290Filing>
  ): Promise<Form2290Filing | null> {
    const existing = this.filings.get(id);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.filings.set(id, updated);
    return updated;
  }

  async getFilingBySubmissionId(
    submissionId: string
  ): Promise<Form2290Filing | null> {
    for (const filing of this.filings.values()) {
      if (filing.submissionId === submissionId) {
        return filing;
      }
    }
    return null;
  }

  async getFilingsByTenant(
    tenantId: string,
    limit: number = 50
  ): Promise<Form2290Filing[]> {
    return Array.from(this.filings.values())
      .filter((filing) => filing.tenantId === tenantId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit);
  }
}

const mockDb = new MockForm2290Database();

// Helper function to get tenant ID (replace with actual auth)
function getTenantId(request: NextRequest): string {
  // In production, extract from JWT token or session
  return request.headers.get('x-tenant-id') || 'default-tenant';
}

// POST /api/tax/form-2290 - File new Form 2290
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'file';

    switch (action) {
      case 'file':
        return await handleFileFiling(request);
      case 'amend':
        return await handleAmendFiling(request);
      case 'validate':
        return await handleValidateForm(request);
      case 'calculate':
        return await handleCalculateTax(request);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Form 2290 API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET /api/tax/form-2290 - Get filing status or history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'history';
    const tenantId = getTenantId(request);

    switch (action) {
      case 'status':
        return await handleGetStatus(request);
      case 'history':
        return await handleGetHistory(request, tenantId);
      case 'health':
        return await handleHealthCheck();
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Form 2290 API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleFileFiling(request: NextRequest) {
  const tenantId = getTenantId(request);
  const formData = await request.json();

  console.info('📋 Filing Form 2290 for tenant:', tenantId);

  // Validate required fields
  if (!formData.businessInfo || !formData.vehicles || !formData.taxPeriod) {
    return NextResponse.json(
      { error: 'Missing required fields: businessInfo, vehicles, taxPeriod' },
      { status: 400 }
    );
  }

  try {
    // File with TaxBandits
    const filingResult = await taxBanditsService.fileForm2290(formData);

    // Save to database
    const filing = await mockDb.saveFiling({
      tenantId,
      submissionId: filingResult.submissionId,
      filingType: formData.filingType || 'original',
      taxPeriodStart: formData.taxPeriod.startDate,
      taxPeriodEnd: formData.taxPeriod.endDate,
      totalTaxDue: filingResult.totalTaxDue,
      filingStatus: filingResult.status,
      filedDate: filingResult.filingDate,
      dueDate: calculateDueDate(formData.taxPeriod.startDate),
      businessEin: formData.businessInfo.ein,
      vehicleCount: formData.vehicles.length,
    });

    console.info('✅ Form 2290 filed and saved:', filing.id);

    return NextResponse.json({
      success: true,
      filing: {
        id: filing.id,
        submissionId: filingResult.submissionId,
        status: filingResult.status,
        totalTaxDue: filingResult.totalTaxDue,
        filingDate: filingResult.filingDate,
        receiptUrl: filingResult.receiptUrl,
        stamped2290Url: filingResult.stamped2290Url,
      },
    });
  } catch (error) {
    console.error('❌ Filing failed:', error);
    return NextResponse.json(
      {
        error: 'Filing failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleAmendFiling(request: NextRequest) {
  const tenantId = getTenantId(request);
  const { originalSubmissionId, amendmentData, reason } = await request.json();

  console.info('📝 Filing amended Form 2290 for tenant:', tenantId);

  if (!originalSubmissionId || !amendmentData) {
    return NextResponse.json(
      { error: 'Missing required fields: originalSubmissionId, amendmentData' },
      { status: 400 }
    );
  }

  try {
    // Prepare amendment form data
    const amendmentFormData = {
      ...amendmentData,
      filingType: 'amended' as const,
      amendmentReason: reason,
    };

    // File amendment with TaxBandits
    const filingResult =
      await taxBanditsService.fileForm2290(amendmentFormData);

    // Save to database
    const filing = await mockDb.saveFiling({
      tenantId,
      submissionId: filingResult.submissionId,
      filingType: 'amended',
      taxPeriodStart: amendmentData.taxPeriod.startDate,
      taxPeriodEnd: amendmentData.taxPeriod.endDate,
      totalTaxDue: filingResult.totalTaxDue,
      filingStatus: filingResult.status,
      filedDate: filingResult.filingDate,
      dueDate: calculateDueDate(amendmentData.taxPeriod.startDate),
      businessEin: amendmentData.businessInfo.ein,
      vehicleCount: amendmentData.vehicles.length,
    });

    return NextResponse.json({
      success: true,
      filing: {
        id: filing.id,
        submissionId: filingResult.submissionId,
        status: filingResult.status,
        totalTaxDue: filingResult.totalTaxDue,
        originalSubmissionId,
        amendmentReason: reason,
      },
    });
  } catch (error) {
    console.error('❌ Amendment filing failed:', error);
    return NextResponse.json(
      {
        error: 'Amendment filing failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleGetStatus(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const submissionId = searchParams.get('submissionId');

  if (!submissionId) {
    return NextResponse.json(
      { error: 'submissionId parameter required' },
      { status: 400 }
    );
  }

  try {
    console.info('🔍 Checking status for submission:', submissionId);

    // Get status from TaxBandits
    const status = await taxBanditsService.getFilingStatus(submissionId);

    // Update local database
    const filing = await mockDb.getFilingBySubmissionId(submissionId);
    if (filing) {
      await mockDb.updateFiling(filing.id, {
        filingStatus: status.status,
        updatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      status: {
        submissionId: status.submissionId,
        status: status.status,
        statusDate: status.statusDate,
        totalTaxDue: status.totalTaxDue,
        vehicleCount: status.vehicleCount,
        errors: status.errors,
        receiptUrl: status.receiptUrl,
        stamped2290Url: status.stamped2290Url,
      },
    });
  } catch (error) {
    console.error('❌ Status check failed:', error);
    return NextResponse.json(
      {
        error: 'Status check failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleGetHistory(request: NextRequest, tenantId: string) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '50');

  try {
    console.info('📚 Getting filing history for tenant:', tenantId);

    const filings = await mockDb.getFilingsByTenant(tenantId, limit);

    return NextResponse.json({
      success: true,
      filings: filings.map((filing) => ({
        id: filing.id,
        submissionId: filing.submissionId,
        filingType: filing.filingType,
        taxPeriod: {
          start: filing.taxPeriodStart,
          end: filing.taxPeriodEnd,
        },
        totalTaxDue: filing.totalTaxDue,
        status: filing.filingStatus,
        filedDate: filing.filedDate,
        dueDate: filing.dueDate,
        vehicleCount: filing.vehicleCount,
        createdAt: filing.createdAt,
      })),
      total: filings.length,
    });
  } catch (error) {
    console.error('❌ History retrieval failed:', error);
    return NextResponse.json(
      {
        error: 'History retrieval failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleValidateForm(request: NextRequest) {
  const formData = await request.json();

  try {
    console.info('✅ Validating Form 2290 data...');

    // This would normally call the service validation
    // For now, we'll do basic validation
    const errors: string[] = [];

    if (!formData.businessInfo?.ein) {
      errors.push('Business EIN is required');
    }

    if (!formData.vehicles || formData.vehicles.length === 0) {
      errors.push('At least one vehicle is required');
    }

    if (!formData.taxPeriod?.startDate || !formData.taxPeriod?.endDate) {
      errors.push('Tax period dates are required');
    }

    return NextResponse.json({
      success: true,
      valid: errors.length === 0,
      errors,
      warnings: [],
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

async function handleCalculateTax(request: NextRequest) {
  const { vehicles } = await request.json();

  if (!vehicles || !Array.isArray(vehicles)) {
    return NextResponse.json(
      { error: 'vehicles array is required' },
      { status: 400 }
    );
  }

  try {
    console.info('💰 Calculating HVUT for vehicles:', vehicles.length);

    const calculation = taxBanditsService.calculateHVUT(vehicles);

    return NextResponse.json({
      success: true,
      calculation: {
        vehicleTaxes: calculation.vehicleTaxes,
        totalTax: calculation.totalTax,
        vehicleCount: vehicles.length,
      },
    });
  } catch (error) {
    console.error('❌ Tax calculation failed:', error);
    return NextResponse.json(
      {
        error: 'Tax calculation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleHealthCheck() {
  try {
    const health = await taxBanditsService.healthCheck();

    return NextResponse.json({
      success: true,
      service: 'Form 2290 Management',
      status: health.status,
      environment: health.environment,
      configured: health.configured,
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

// Helper function to calculate due date
function calculateDueDate(taxPeriodStart: string): string {
  const startDate = new Date(taxPeriodStart);
  const year = startDate.getFullYear();

  // Form 2290 is due by July 31st of the tax period year
  // or within 1 month of first use if after June 30th
  if (startDate.getMonth() < 6) {
    // Before July
    return `${year}-07-31`;
  } else {
    // Within 1 month of first use
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + 1);
    return dueDate.toISOString().split('T')[0];
  }
}

