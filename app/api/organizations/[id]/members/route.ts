import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { organizationService } from '../../../../services/OrganizationService';

// GET /api/organizations/[id]/members - List organization members
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has access to view organization members
    const hasAccess = await organizationService.userCanPerformAction(
      session.user.id,
      params.id,
      'view_organization'
    );

    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const members = await organizationService.getOrganizationUsers(params.id);

    return NextResponse.json({
      success: true,
      members,
    });
  } catch (error) {
    console.error('Error fetching organization members:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/organizations/[id]/members - Add member to organization
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to manage users
    const hasPermission = await organizationService.userCanPerformAction(
      session.user.id,
      params.id,
      'manage_users'
    );

    if (!hasPermission) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { userId, role, permissions = [] } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, role' },
        { status: 400 }
      );
    }

    const member = await organizationService.addUserToOrganization({
      userId,
      organizationId: params.id,
      role,
      permissions,
    });

    return NextResponse.json(
      {
        success: true,
        member,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding organization member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

