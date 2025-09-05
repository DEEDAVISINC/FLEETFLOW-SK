import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { OrganizationCreationParams } from '../../models/Organization';
import { organizationService } from '../../services/OrganizationService';

// GET /api/organizations - List user's organizations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizations = await organizationService.getUserOrganizations(
      session.user.id
    );

    return NextResponse.json({
      success: true,
      organizations,
    });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/organizations - Create new organization
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: OrganizationCreationParams = await request.json();

    // Validate required fields
    if (
      !body.name ||
      !body.type ||
      !body.billing?.contactName ||
      !body.billing?.contactEmail
    ) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: name, type, billing.contactName, billing.contactEmail',
        },
        { status: 400 }
      );
    }

    const organization = await organizationService.createOrganization(body);

    // Add creator as owner
    await organizationService.addUserToOrganization({
      userId: session.user.id,
      organizationId: organization.id,
      role: 'owner',
      permissions: ['*'],
    });

    return NextResponse.json(
      {
        success: true,
        organization,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating organization:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




