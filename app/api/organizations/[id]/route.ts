import { NextRequest, NextResponse } from 'next/server';
import {
  AuthorizationPatterns,
  withOrganizationAuth,
} from '../../../middleware/organizationAuth';
import { organizationService } from '../../../services/OrganizationService';

// GET /api/organizations/[id] - Get organization details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and organization access
    const auth = await withOrganizationAuth(
      request,
      params.id,
      AuthorizationPatterns.VIEW_LOADS // Basic access to view organization
    );

    if (!auth.success) {
      return auth.response!;
    }

    const organization = await organizationService.getOrganization(params.id);

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      organization,
    });
  } catch (error) {
    console.error('Error fetching organization:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/organizations/[id] - Update organization
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and organization management permission
    const auth = await withOrganizationAuth(
      request,
      params.id,
      AuthorizationPatterns.MANAGE_ORGANIZATION
    );

    if (!auth.success) {
      return auth.response!;
    }

    const body = await request.json();
    const organization = await organizationService.updateOrganization(
      params.id,
      body
    );

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      organization,
    });
  } catch (error) {
    console.error('Error updating organization:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/organizations/[id] - Delete organization
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and owner-only access
    const auth = await withOrganizationAuth(request, params.id);

    if (!auth.success) {
      return auth.response!;
    }

    // Additional check for owner role (since middleware doesn't handle roles yet)
    if (auth.data?.organization?.role !== 'owner') {
      return NextResponse.json(
        { error: 'Only owners can delete organizations' },
        { status: 403 }
      );
    }

    const success = await organizationService.deleteOrganization(params.id);

    if (!success) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Organization deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting organization:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
