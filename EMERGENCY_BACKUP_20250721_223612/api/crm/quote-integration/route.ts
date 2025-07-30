// ============================================================================
// FLEETFLOW CRM QUOTE INTEGRATION API - PRODUCTION READY
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import CRMQuoteIntegrationService from '../../../services/CRMQuoteIntegrationService';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getOrganizationId(request: NextRequest): string {
  return request.headers.get('x-organization-id') || 'default-org';
}

function handleError(error: any, operation: string) {
  console.error(`CRM Quote Integration API Error - ${operation}:`, error);
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
// QUOTE INTEGRATION ENDPOINTS
// ============================================================================

// POST /api/crm/quote-integration - Create CRM opportunity when quote is generated
export async function POST(request: NextRequest) {
  try {
    const organizationId = getOrganizationId(request);
    const quoteData = await request.json();

    // Validate required fields
    const requiredFields = ['id', 'origin', 'destination', 'totalRate', 'service_type', 'quote_status', 'created_at'];
    const missingFields = requiredFields.filter(field => !quoteData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const quoteIntegration = new CRMQuoteIntegrationService(organizationId);
    
    // Create CRM opportunity for the quote
    const result = await quoteIntegration.createQuoteOpportunity(quoteData);

    return NextResponse.json({
      success: true,
      data: {
        opportunity_id: result.opportunity_id,
        activity_id: result.activity_id,
        contact_matched: result.contact_matched,
        lead_score_updated: result.lead_score_updated,
        follow_up_created: result.follow_up_created,
        quote_value: quoteData.totalRate,
        route: `${quoteData.origin} → ${quoteData.destination}`
      },
      message: 'Quote opportunity created successfully',
      timestamp: new Date().toISOString()
    }, { status: 201 });

  } catch (error) {
    return handleError(error, 'CREATE_QUOTE_OPPORTUNITY');
  }
}

// GET /api/crm/quote-integration?action=stats - Get quote opportunity statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const organizationId = getOrganizationId(request);

    if (action === 'stats') {
      const dateFrom = searchParams.get('date_from') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const dateTo = searchParams.get('date_to') || new Date().toISOString();

      const quoteIntegration = new CRMQuoteIntegrationService(organizationId);
      const stats = await quoteIntegration.getQuoteOpportunityStats(dateFrom, dateTo);

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
    return handleError(error, 'GET_QUOTE_STATS');
  }
}

// PUT /api/crm/quote-integration - Update opportunity when quote status changes
export async function PUT(request: NextRequest) {
  try {
    const organizationId = getOrganizationId(request);
    const { quote_id, new_status, notes } = await request.json();

    if (!quote_id || !new_status) {
      return NextResponse.json(
        { error: 'quote_id and new_status are required' },
        { status: 400 }
      );
    }

    const quoteIntegration = new CRMQuoteIntegrationService(organizationId);
    await quoteIntegration.updateOpportunityFromQuoteStatus(quote_id, new_status, notes);

    return NextResponse.json({
      success: true,
      data: {
        quote_id: quote_id,
        new_status: new_status,
        updated_at: new Date().toISOString()
      },
      message: 'Opportunity updated from quote status change',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return handleError(error, 'UPDATE_QUOTE_STATUS');
  }
}

// PATCH /api/crm/quote-integration - Bulk create quote opportunities
export async function PATCH(request: NextRequest) {
  try {
    const organizationId = getOrganizationId(request);
    const { quotes } = await request.json();

    if (!Array.isArray(quotes)) {
      return NextResponse.json(
        { error: 'Quotes must be an array' },
        { status: 400 }
      );
    }

    const quoteIntegration = new CRMQuoteIntegrationService(organizationId);
    const results = await quoteIntegration.bulkCreateQuoteOpportunities(quotes);

    const successful = results.filter(r => r.status === 'success').length;
    const failed = results.filter(r => r.status === 'failed').length;
    const totalValue = quotes.reduce((sum, quote) => sum + (quote.totalRate || 0), 0);

    return NextResponse.json({
      success: true,
      data: results,
      summary: {
        total_processed: quotes.length,
        successful: successful,
        failed: failed,
        success_rate: (successful / quotes.length) * 100,
        total_opportunity_value: totalValue,
        average_deal_size: quotes.length > 0 ? totalValue / quotes.length : 0
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return handleError(error, 'BULK_CREATE_QUOTE_OPPORTUNITIES');
  }
} 