// ============================================================================
// FLEETFLOW CRM CONTACTS API - PRODUCTION READY
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
  console.error(`CRM Contacts API Error - ${operation}:`, error);
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
    const requiredFields = ['first_name', 'last_name', 'contact_type'];
    const missingFields = requiredFields.filter(field => !contactData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

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

// PUT /api/crm/contacts?id=:id - Update contact
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