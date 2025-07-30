// ============================================================================
// FLEETFLOW CRM AI ANALYSIS API - PRODUCTION READY
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
  console.error(`CRM AI Analysis API Error - ${operation}:`, error);
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
// AI ANALYSIS ENDPOINTS
// ============================================================================

// POST /api/crm/ai-analysis - Analyze contact with AI
export async function POST(request: NextRequest) {
  try {
    const organizationId = getOrganizationId(request);
    const { contact_id } = await request.json();

    if (!contact_id) {
      return NextResponse.json(
        { error: 'contact_id is required' },
        { status: 400 }
      );
    }

    const crmService = new CRMService(organizationId);
    
    // AI automatically scores leads and suggests actions
    const analysis = await crmService.analyzeContactWithAI(contact_id);

    return NextResponse.json({
      success: true,
      data: {
        contact_id: contact_id,
        analysis_date: new Date().toISOString(),
        personality_profile: analysis.personality_profile,
        buying_signals: analysis.buying_signals,
        next_best_action: analysis.next_best_action,
        lead_score: analysis.lead_score,
        engagement_level: analysis.engagement_level,
        conversion_probability: analysis.conversion_probability,
        estimated_deal_value: analysis.estimated_deal_value,
        key_insights: analysis.key_insights,
        risk_factors: analysis.risk_factors,
        opportunities: analysis.opportunities,
        competitor_threat: analysis.competitor_threat,
        lifetime_value_prediction: analysis.lifetime_value_prediction
      },
      message: 'AI contact analysis completed successfully',
      timestamp: new Date().toISOString()
    }, { status: 200 });

  } catch (error) {
    return handleError(error, 'ANALYZE_CONTACT_WITH_AI');
  }
}

// GET /api/crm/ai-analysis?contact_id=123 - Get AI insights for a contact
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get('contact_id');
    const organizationId = getOrganizationId(request);

    if (!contactId) {
      return NextResponse.json(
        { error: 'contact_id parameter is required' },
        { status: 400 }
      );
    }

    const crmService = new CRMService(organizationId);
    const insights = await crmService.getContactAIInsights(contactId);

    return NextResponse.json({
      success: true,
      data: {
        contact_id: contactId,
        ai_insights: insights.ai_insights,
        ai_last_analyzed: insights.ai_last_analyzed,
        lead_score: insights.lead_score,
        engagement_level: insights.engagement_level,
        conversion_probability: insights.conversion_probability
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return handleError(error, 'GET_AI_INSIGHTS');
  }
}

// PUT /api/crm/ai-analysis - Bulk analyze contacts
export async function PUT(request: NextRequest) {
  try {
    const organizationId = getOrganizationId(request);
    const { contact_ids, auto_analyze_pending } = await request.json();

    const crmService = new CRMService(organizationId);
    
    let contactsToAnalyze: string[] = [];
    
    if (contact_ids && Array.isArray(contact_ids)) {
      contactsToAnalyze = contact_ids;
    } else if (auto_analyze_pending) {
      // Get contacts that need AI analysis
      const pendingContacts = await crmService.getContactsNeedingAIAnalysis(50);
      contactsToAnalyze = pendingContacts.map(c => c.id);
    }

    if (contactsToAnalyze.length === 0) {
      return NextResponse.json(
        { error: 'No contacts provided for analysis' },
        { status: 400 }
      );
    }

    // Perform bulk analysis
    const results = await crmService.bulkAnalyzeContactsWithAI(contactsToAnalyze);

    const successful = results.filter(r => r.status === 'success').length;
    const failed = results.filter(r => r.status === 'failed').length;

    return NextResponse.json({
      success: true,
      data: results,
      summary: {
        total_processed: contactsToAnalyze.length,
        successful: successful,
        failed: failed,
        success_rate: (successful / contactsToAnalyze.length) * 100
      },
      message: `Bulk AI analysis completed: ${successful} successful, ${failed} failed`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return handleError(error, 'BULK_AI_ANALYSIS');
  }
}

// PATCH /api/crm/ai-analysis - Get contacts needing AI analysis
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const organizationId = getOrganizationId(request);

    const crmService = new CRMService(organizationId);
    const contacts = await crmService.getContactsNeedingAIAnalysis(limit);

    return NextResponse.json({
      success: true,
      data: contacts,
      count: contacts.length,
      message: `Found ${contacts.length} contacts needing AI analysis`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return handleError(error, 'GET_CONTACTS_NEEDING_ANALYSIS');
  }
} 