// ============================================================================
// FLEETFLOW CRM API ROUTES - COMPREHENSIVE PRODUCTION READY
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import CRMService from '../../services/CRMService';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getOrganizationId(request: NextRequest): string {
  // In production, this would extract from JWT token or session
  return request.headers.get('x-organization-id') || 'default-org';
}

function handleError(error: any, operation: string) {
  console.error(`CRM API Error - ${operation}:`, error);
  return NextResponse.json(
    { 
      error: error.message || 'Internal server error',
      operation,
      timestamp: new Date().toISOString()
    },
    { status: 500 }
  );
}

function validateRequiredFields(data: any, requiredFields: string[]) {
  const missingFields = requiredFields.filter(field => !data[field]);
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
}

// ============================================================================
// CONTACTS ENDPOINTS
// ============================================================================

// GET /api/crm/contacts - Get all contacts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = getOrganizationId(request);
    
    // Extract query parameters
    const filters = {
      contact_type: searchParams.get('contact_type') || undefined,
      status: searchParams.get('status') || undefined,
      lead_source: searchParams.get('lead_source') || undefined,
      assigned_to: searchParams.get('assigned_to') || undefined,
      date_from: searchParams.get('date_from') || undefined,
      date_to: searchParams.get('date_to') || undefined,
      search: searchParams.get('search') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined
    };

    const crm = new CRMService(organizationId);
    const contacts = await crm.getContacts(organizationId, filters);

    return NextResponse.json({
      success: true,
      data: contacts,
      count: contacts.length,
      filters: filters,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return handleError(error, 'GET_CONTACTS');
  }
}

// POST /api/crm/contacts - Create contact
export async function POST(request: NextRequest) {
  try {
    const organizationId = getOrganizationId(request);
    const contactData = await request.json();

    // Validate required fields
    validateRequiredFields(contactData, ['first_name', 'last_name', 'contact_type']);

    const crm = new CRMService(organizationId);
    const contact = await crm.createContact(contactData);

    return NextResponse.json({
      success: true,
      data: contact,
      message: 'Contact created successfully',
      timestamp: new Date().toISOString()
    }, { status: 201 });

  } catch (error) {
    return handleError(error, 'CREATE_CONTACT');
  }
}

// PUT /api/crm/contacts/:id - Update contact
export async function PUT(request: NextRequest) {
  try {
    const organizationId = getOrganizationId(request);
    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get('id');
    
    if (!contactId) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    const updateData = await request.json();
    const crm = new CRMService(organizationId);
    const contact = await crm.updateContact(contactId, updateData);

    return NextResponse.json({
      success: true,
      data: contact,
      message: 'Contact updated successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return handleError(error, 'UPDATE_CONTACT');
  }
}

// ============================================================================
// OPPORTUNITIES ENDPOINTS
// ============================================================================

// Handle opportunities based on HTTP method
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');
    const organizationId = getOrganizationId(request);
    
    if (endpoint === 'opportunities') {
      // GET /api/crm?endpoint=opportunities - Get opportunities
      if (request.method === 'GET') {
        const filters = {
          status: searchParams.get('status') || undefined,
          assigned_to: searchParams.get('assigned_to') || undefined,
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
      }

      // POST /api/crm?endpoint=opportunities - Create opportunity
      if (request.method === 'POST') {
        const opportunityData = await request.json();
        validateRequiredFields(opportunityData, ['opportunity_name', 'stage']);

        const crm = new CRMService(organizationId);
        const opportunity = await crm.createOpportunity(opportunityData);

        return NextResponse.json({
          success: true,
          data: opportunity,
          message: 'Opportunity created successfully',
          timestamp: new Date().toISOString()
        }, { status: 201 });
      }

      // PUT /api/crm?endpoint=opportunities&id=:id - Update opportunity stage
      if (request.method === 'PUT') {
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
      }
    }

    // ============================================================================
    // ACTIVITIES ENDPOINTS
    // ============================================================================

    if (endpoint === 'activities') {
      // GET /api/crm?endpoint=activities - Get activities
      if (request.method === 'GET') {
        const filters = {
          contact_type: searchParams.get('activity_type') || undefined,
          status: searchParams.get('status') || undefined,
          assigned_to: searchParams.get('assigned_to') || undefined,
          date_from: searchParams.get('date_from') || undefined,
          date_to: searchParams.get('date_to') || undefined,
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
      }

      // POST /api/crm?endpoint=activities - Create activity
      if (request.method === 'POST') {
        const activityData = await request.json();
        validateRequiredFields(activityData, ['activity_type', 'subject', 'activity_date']);

        const crm = new CRMService(organizationId);
        const activity = await crm.createActivity(activityData);

        return NextResponse.json({
          success: true,
          data: activity,
          message: 'Activity created successfully',
          timestamp: new Date().toISOString()
        }, { status: 201 });
      }
    }

    // ============================================================================
    // DASHBOARD ENDPOINT
    // ============================================================================

    if (endpoint === 'dashboard') {
      const crm = new CRMService(organizationId);
      const dashboard = await crm.getCRMDashboard(organizationId);

      return NextResponse.json({
        success: true,
        data: dashboard,
        timestamp: new Date().toISOString()
      });
    }

    // ============================================================================
    // REPORTS ENDPOINTS
    // ============================================================================

    if (endpoint === 'reports/lead-sources') {
      const crm = new CRMService(organizationId);
      const report = await crm.getLeadSourceReport(organizationId);

      return NextResponse.json({
        success: true,
        data: report,
        timestamp: new Date().toISOString()
      });
    }

    // ============================================================================
    // AI ENDPOINTS
    // ============================================================================

    if (endpoint === 'ai/lead-score') {
      const contactId = searchParams.get('contact_id');
      if (!contactId) {
        return NextResponse.json(
          { error: 'Contact ID is required' },
          { status: 400 }
        );
      }

      const crm = new CRMService(organizationId);
      const leadScore = await crm.calculateLeadScore(contactId);

      return NextResponse.json({
        success: true,
        data: { contact_id: contactId, lead_score: leadScore },
        timestamp: new Date().toISOString()
      });
    }

    if (endpoint === 'ai/analyze-contact') {
      const contactId = searchParams.get('contact_id');
      if (!contactId) {
        return NextResponse.json(
          { error: 'Contact ID is required' },
          { status: 400 }
        );
      }

      const crm = new CRMService(organizationId);
      const analysis = await crm.analyzeContactWithAI(contactId);

      return NextResponse.json({
        success: true,
        data: analysis,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { error: 'Invalid endpoint' },
      { status: 400 }
    );

  } catch (error) {
    return handleError(error, 'PATCH_REQUEST');
  }
}

// ============================================================================
// DEDICATED ROUTE HANDLERS FOR CLEAN API STRUCTURE
// ============================================================================ 