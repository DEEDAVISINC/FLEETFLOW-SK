// ============================================================================
// FLEETFLOW CRM ACTIVITIES API - PRODUCTION READY
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
  console.error(`CRM Activities API Error - ${operation}:`, error);
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
// ACTIVITIES ENDPOINTS
// ============================================================================

// GET /api/crm/activities - Get activities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = getOrganizationId(request);
    
    // Extract query parameters
    const filters = {
      activity_type: searchParams.get('activity_type') || undefined,
      status: searchParams.get('status') || undefined,
      assigned_to: searchParams.get('assigned_to') || undefined,
      contact_id: searchParams.get('contact_id') || undefined,
      company_id: searchParams.get('company_id') || undefined,
      opportunity_id: searchParams.get('opportunity_id') || undefined,
      date_from: searchParams.get('date_from') || undefined,
      date_to: searchParams.get('date_to') || undefined,
      priority: searchParams.get('priority') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined
    };

    const crm = new CRMService(organizationId);
    const activities = await crm.getActivities(organizationId, filters);

    return NextResponse.json({
      success: true,
      data: activities,
      count: activities.length,
      filters: filters,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return handleError(error, 'GET_ACTIVITIES');
  }
}

// POST /api/crm/activities - Create activity
export async function POST(request: NextRequest) {
  try {
    const organizationId = getOrganizationId(request);
    const activityData = await request.json();

    // Validate required fields
    const requiredFields = ['activity_type', 'subject', 'activity_date'];
    const missingFields = requiredFields.filter(field => !activityData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const crm = new CRMService(organizationId);
    const activity = await crm.createActivity(activityData);

    return NextResponse.json({
      success: true,
      data: activity,
      message: 'Activity created successfully',
      timestamp: new Date().toISOString()
    }, { status: 201 });

  } catch (error) {
    return handleError(error, 'CREATE_ACTIVITY');
  }
} 