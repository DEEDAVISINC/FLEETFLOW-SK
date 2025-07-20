// ============================================================================
// FLEETFLOW CRM OPPORTUNITIES API - PRODUCTION READY
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
  console.error(`CRM Opportunities API Error - ${operation}:`, error);
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
// OPPORTUNITIES ENDPOINTS
// ============================================================================

// GET /api/crm/opportunities - Get opportunities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = getOrganizationId(request);
    
    // Extract query parameters
    const filters = {
      status: searchParams.get('status') || undefined,
      assigned_to: searchParams.get('assigned_to') || undefined,
      stage: searchParams.get('stage') || undefined,
      contact_id: searchParams.get('contact_id') || undefined,
      company_id: searchParams.get('company_id') || undefined,
      search: searchParams.get('search') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined
    };

    const crm = new CRMService(organizationId);
    const opportunities = await crm.getOpportunities(organizationId, filters);

    return NextResponse.json({
      success: true,
      data: opportunities,
      count: opportunities.length,
      filters: filters,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return handleError(error, 'GET_OPPORTUNITIES');
  }
}

// POST /api/crm/opportunities - Create opportunity
export async function POST(request: NextRequest) {
  try {
    const organizationId = getOrganizationId(request);
    const opportunityData = await request.json();

    // Validate required fields
    const requiredFields = ['opportunity_name', 'stage'];
    const missingFields = requiredFields.filter(field => !opportunityData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const crm = new CRMService(organizationId);
    const opportunity = await crm.createOpportunity(opportunityData);

    return NextResponse.json({
      success: true,
      data: opportunity,
      message: 'Opportunity created successfully',
      timestamp: new Date().toISOString()
    }, { status: 201 });

  } catch (error) {
    return handleError(error, 'CREATE_OPPORTUNITY');
  }
}

// PUT /api/crm/opportunities?id=:id - Update opportunity stage
export async function PUT(request: NextRequest) {
  try {
    const organizationId = getOrganizationId(request);
    const { searchParams } = new URL(request.url);
    const opportunityId = searchParams.get('id');
    
    if (!opportunityId) {
      return NextResponse.json(
        { error: 'Opportunity ID is required' },
        { status: 400 }
      );
    }

    const { stage } = await request.json();
    if (!stage) {
      return NextResponse.json(
        { error: 'Stage is required' },
        { status: 400 }
      );
    }

    const crm = new CRMService(organizationId);
    const opportunity = await crm.updateOpportunityStage(opportunityId, stage);

    return NextResponse.json({
      success: true,
      data: opportunity,
      message: 'Opportunity stage updated successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return handleError(error, 'UPDATE_OPPORTUNITY_STAGE');
  }
} 