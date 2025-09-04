import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { organizationService } from '../../../../services/OrganizationService';

// GET /api/organizations/[id]/invitations - List organization invitations
export async function GET(
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

    const invitations = await organizationService.getOrganizationInvitations(
      params.id
    );

    return NextResponse.json({
      success: true,
      invitations,
    });
  } catch (error) {
    console.error('Error fetching organization invitations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/organizations/[id]/invitations - Create invitation
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
    const { email, role, permissions = [] } = body;

    if (!email || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: email, role' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const invitation = await organizationService.inviteUserToOrganization({
      organizationId: params.id,
      email,
      role,
      permissions,
    });

    // TODO: Send invitation email
    console.log(`Invitation sent to ${email} for organization ${params.id}`);

    return NextResponse.json(
      {
        success: true,
        invitation,
        message: 'Invitation sent successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating organization invitation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


