// ============================================================================
// FLEETFLOW CRM DASHBOARD API - PRODUCTION READY
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import CRMService from '../../../services/CRMService';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getOrganizationId(request: NextRequest): string {
  return request.headers.get('x-organization-id') || 'default-org';
}

function handleError(error: any, operation: string) {
  console.error(`CRM Dashboard API Error - ${operation}:`, error);
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
// DASHBOARD ENDPOINT
// ============================================================================

// GET /api/crm/dashboard - Get CRM dashboard data
export async function GET(request: NextRequest) {
  try {
    const organizationId = getOrganizationId(request);
    
    const crm = new CRMService(organizationId);
    const dashboard = await crm.getCRMDashboard(organizationId);

    return NextResponse.json({
      success: true,
      data: dashboard,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return handleError(error, 'GET_DASHBOARD');
  }
} 