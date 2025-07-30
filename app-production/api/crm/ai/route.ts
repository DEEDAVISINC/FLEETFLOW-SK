// ============================================================================
// FLEETFLOW CRM AI FEATURES API - PRODUCTION READY
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
  console.error(`CRM AI API Error - ${operation}:`, error);
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
// AI FEATURES ENDPOINTS
// ============================================================================

// GET /api/crm/ai?action=lead-score&contact_id=:id - Calculate lead score
// GET /api/crm/ai?action=analyze-contact&contact_id=:id - Analyze contact with AI
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = getOrganizationId(request);
    const action = searchParams.get('action');
    const contactId = searchParams.get('contact_id');
    
    if (!contactId) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    const crm = new CRMService(organizationId);

    if (action === 'lead-score') {
      const leadScore = await crm.calculateLeadScore(contactId);
      
      return NextResponse.json({
        success: true,
        data: { 
          contact_id: contactId, 
          lead_score: leadScore,
          score_level: leadScore >= 80 ? 'hot' : leadScore >= 60 ? 'warm' : leadScore >= 40 ? 'cold' : 'inactive'
        },
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'analyze-contact') {
      const analysis = await crm.analyzeContactWithAI(contactId);
      
      return NextResponse.json({
        success: true,
        data: analysis,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "lead-score" or "analyze-contact"' },
      { status: 400 }
    );

  } catch (error) {
    return handleError(error, 'AI_FEATURES');
  }
}

// POST /api/crm/ai - Bulk AI operations
export async function POST(request: NextRequest) {
  try {
    const organizationId = getOrganizationId(request);
    const { action, contact_ids } = await request.json();

    if (!action || !contact_ids || !Array.isArray(contact_ids)) {
      return NextResponse.json(
        { error: 'Action and contact_ids array are required' },
        { status: 400 }
      );
    }

    const crm = new CRMService(organizationId);
    const results = [];

    if (action === 'bulk-lead-score') {
      for (const contactId of contact_ids) {
        try {
          const leadScore = await crm.calculateLeadScore(contactId);
          results.push({
            contact_id: contactId,
            lead_score: leadScore,
            score_level: leadScore >= 80 ? 'hot' : leadScore >= 60 ? 'warm' : leadScore >= 40 ? 'cold' : 'inactive',
            status: 'success'
          });
        } catch (error) {
          results.push({
            contact_id: contactId,
            error: error instanceof Error ? error.message : 'Unknown error',
            status: 'failed'
          });
        }
      }
    } else if (action === 'bulk-analyze') {
      for (const contactId of contact_ids) {
        try {
          const analysis = await crm.analyzeContactWithAI(contactId);
          results.push({
            contact_id: contactId,
            analysis: analysis,
            status: 'success'
          });
        } catch (error) {
          results.push({
            contact_id: contactId,
            error: error instanceof Error ? error.message : 'Unknown error',
            status: 'failed'
          });
        }
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "bulk-lead-score" or "bulk-analyze"' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: results,
      processed: contact_ids.length,
      successful: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'failed').length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return handleError(error, 'BULK_AI_OPERATIONS');
  }
} 