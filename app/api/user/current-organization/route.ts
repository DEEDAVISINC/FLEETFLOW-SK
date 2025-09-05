import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { organizationService } from '../../../services/OrganizationService';

// GET /api/user/current-organization - Get user's current organization
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For now, we'll get this from localStorage via client-side
    // In a real implementation, you'd store this in the database
    const organizations = await organizationService.getUserOrganizations(
      session.user.id
    );

    if (organizations.length === 0) {
      return NextResponse.json({
        success: true,
        currentOrganization: null,
      });
    }

    // Return the first organization as current (in a real app, you'd store user's preference)
    const currentOrganization = organizations[0];

    // Get user's role in this organization
    const userRole = await organizationService.getUserOrganizationRole(
      session.user.id,
      currentOrganization.id
    );

    return NextResponse.json({
      success: true,
      currentOrganization: {
        ...currentOrganization,
        role: userRole?.role || 'member',
        permissions: userRole?.permissions || [],
      },
    });
  } catch (error) {
    console.error('Error fetching current organization:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/user/current-organization - Update user's current organization
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { organizationId } = body;

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    // Verify user has access to this organization
    const hasAccess = await organizationService.userCanPerformAction(
      session.user.id,
      organizationId,
      'view_organization'
    );

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied to this organization' },
        { status: 403 }
      );
    }

    // Get organization details
    const organization =
      await organizationService.getOrganization(organizationId);
    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Get user's role in this organization
    const userRole = await organizationService.getUserOrganizationRole(
      session.user.id,
      organizationId
    );

    // In a real implementation, you'd update the user's current organization in the database
    // For now, we'll just return success since the client-side handles localStorage

    return NextResponse.json({
      success: true,
      currentOrganization: {
        ...organization,
        role: userRole?.role || 'member',
        permissions: userRole?.permissions || [],
      },
    });
  } catch (error) {
    console.error('Error updating current organization:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




