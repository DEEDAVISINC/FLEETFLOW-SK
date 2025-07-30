// ============================================================================
// FLEETFLOW CRM CALL INTEGRATION API - PRODUCTION READY
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import CRMCallIntegrationService from '../../../services/CRMCallIntegrationService';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getOrganizationId(request: NextRequest): string {
  return request.headers.get('x-organization-id') || 'default-org';
}

function handleError(error: any, operation: string) {
  console.error(`CRM Call Integration API Error - ${operation}:`, error);
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
// CALL INTEGRATION ENDPOINTS
// ============================================================================

// POST /api/crm/call-integration - Create CRM activity when call ends
export async function POST(request: NextRequest) {
  try {
    const organizationId = getOrganizationId(request);
    const callData = await request.json();

    // Validate required fields
    const requiredFields = ['id', 'phone_number', 'call_direction', 'call_duration', 'call_outcome', 'started_at', 'ended_at'];
    const missingFields = requiredFields.filter(field => !callData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const callIntegration = new CRMCallIntegrationService(organizationId);
    
    // Create CRM activity for the call
    const activity = await callIntegration.createCallActivity(callData);

    return NextResponse.json({
      success: true,
      data: {
        activity_id: activity.id,
        contact_id: activity.contact_id,
        activity_type: activity.activity_type,
        subject: activity.subject,
        call_outcome: activity.call_outcome,
        duration_minutes: activity.duration_minutes
      },
      message: 'Call activity created successfully',
      timestamp: new Date().toISOString()
    }, { status: 201 });

  } catch (error) {
    return handleError(error, 'CREATE_CALL_ACTIVITY');
  }
}

// GET /api/crm/call-integration?action=stats - Get call activity statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const organizationId = getOrganizationId(request);

    if (action === 'stats') {
      const dateFrom = searchParams.get('date_from') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const dateTo = searchParams.get('date_to') || new Date().toISOString();

      const callIntegration = new CRMCallIntegrationService(organizationId);
      const stats = await callIntegration.getCallActivityStats(dateFrom, dateTo);

      return NextResponse.json({
        success: true,
        data: stats,
        date_range: { from: dateFrom, to: dateTo },
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "stats"' },
      { status: 400 }
    );

  } catch (error) {
    return handleError(error, 'GET_CALL_STATS');
  }
}

// PUT /api/crm/call-integration - Handle call webhook
export async function PUT(request: NextRequest) {
  try {
    const organizationId = getOrganizationId(request);
    const webhookData = await request.json();

    // Validate webhook signature if needed
    // const signature = request.headers.get('x-webhook-signature');
    // if (!validateWebhookSignature(webhookData, signature)) {
    //   return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    // }

    const callIntegration = new CRMCallIntegrationService(organizationId);
    const result = await callIntegration.handleCallWebhook(webhookData);

    return NextResponse.json({
      success: result.success,
      data: result.success ? { activity_id: result.activity_id } : null,
      message: result.message || result.error,
      timestamp: new Date().toISOString()
    }, { status: result.success ? 200 : 400 });

  } catch (error) {
    return handleError(error, 'HANDLE_WEBHOOK');
  }
}

// PATCH /api/crm/call-integration - Bulk create call activities
export async function PATCH(request: NextRequest) {
  try {
    const organizationId = getOrganizationId(request);
    const { calls } = await request.json();

    if (!Array.isArray(calls)) {
      return NextResponse.json(
        { error: 'Calls must be an array' },
        { status: 400 }
      );
    }

    const callIntegration = new CRMCallIntegrationService(organizationId);
    const results = await callIntegration.bulkCreateCallActivities(calls);

    const successful = results.filter(r => r.status === 'success').length;
    const failed = results.filter(r => r.status === 'failed').length;

    return NextResponse.json({
      success: true,
      data: results,
      summary: {
        total_processed: calls.length,
        successful: successful,
        failed: failed,
        success_rate: (successful / calls.length) * 100
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return handleError(error, 'BULK_CREATE_ACTIVITIES');
  }
} 