import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { organizationService } from '../../../services/OrganizationService';

// POST /api/organizations/accept-invitation - Accept organization invitation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Missing required field: token' },
        { status: 400 }
      );
    }

    const result = await organizationService.acceptInvitation(
      token,
      session.user.id
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      organization: result.organization,
      message: 'Successfully joined organization',
    });
  } catch (error) {
    console.error('Error accepting organization invitation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


