import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { organizationService } from '../../../services/OrganizationService';

// GET /api/user/organizations - Get user's organizations with roles
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizations = await organizationService.getUserOrganizations(
      session.user.id
    );

    // Get role and permissions for each organization
    const organizationsWithRoles = await Promise.all(
      organizations.map(async (org) => {
        try {
          const userRole = await organizationService.getUserOrganizationRole(
            session.user.id,
            org.id
          );

          return {
            ...org,
            role: userRole?.role || 'member',
            permissions: userRole?.permissions || [],
          };
        } catch (error) {
          console.error(
            `Error getting role for organization ${org.id}:`,
            error
          );
          return {
            ...org,
            role: 'member',
            permissions: [],
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      organizations: organizationsWithRoles,
    });
  } catch (error) {
    console.error('Error fetching user organizations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




