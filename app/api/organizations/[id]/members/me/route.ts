import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { organizationService } from '../../../../../services/OrganizationService';

// GET /api/organizations/[id]/members/me - Get current user's details in organization
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's role and permissions in this organization
    const userRole = await organizationService.getUserOrganizationRole(
      session.user.id,
      params.id
    );

    if (!userRole) {
      return NextResponse.json(
        { error: 'User is not a member of this organization' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      userId: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: userRole.role,
      permissions: userRole.permissions,
      joinedAt: userRole.joinedAt,
      active: userRole.active,
    });
  } catch (error) {
    console.error('Error fetching user organization details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




