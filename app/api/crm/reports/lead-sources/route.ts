// ============================================================================
// FLEETFLOW CRM LEAD SOURCES REPORTS API - PRODUCTION READY
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import CRMService from '../../../../services/CRMService';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getOrganizationId(request: NextRequest): string {
  return request.headers.get('x-organization-id') || 'default-org';
}

function handleError(error: any, operation: string) {
  console.error(`CRM Lead Sources Reports API Error - ${operation}:`, error);
  return NextResponse.json(
    { 
      error: error.message || 'Internal server error',
      operation,
      timestamp: new Date().toISOString()
    },
    { status: 500 }
  );
}

// ============================================================================
// LEAD SOURCES REPORTS ENDPOINT
// ============================================================================

// GET /api/crm/reports/lead-sources - Get lead sources report
export async function GET(request: NextRequest) {
  try {
    const organizationId = getOrganizationId(request);
    
    const crm = new CRMService(organizationId);
    const report = await crm.getLeadSourceReport(organizationId);

    return NextResponse.json({
      success: true,
      data: report,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return handleError(error, 'GET_LEAD_SOURCES_REPORT');
  }
} 