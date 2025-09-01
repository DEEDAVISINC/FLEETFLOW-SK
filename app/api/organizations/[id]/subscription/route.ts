import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { organizationService } from '../../../../services/OrganizationService';
import {
  SubscriptionCreationParams,
  SubscriptionUpdateParams,
  organizationSubscriptionService,
} from '../../../../services/OrganizationSubscriptionService';

// GET /api/organizations/[id]/subscription - Get subscription details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to view subscription
    const hasPermission = await organizationService.userCanPerformAction(
      session.user.id,
      params.id,
      'view_organization'
    );

    if (!hasPermission) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const result =
      await organizationSubscriptionService.getOrganizationSubscription(
        params.id
      );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      subscription: result.subscription,
    });
  } catch (error) {
    console.error('Error fetching organization subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/organizations/[id]/subscription - Create subscription
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to manage subscription
    const hasPermission = await organizationService.userCanPerformAction(
      session.user.id,
      params.id,
      'manage_subscription'
    );

    if (!hasPermission) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body: Omit<SubscriptionCreationParams, 'organizationId'> =
      await request.json();
    const { planId, totalSeats, customerDetails } = body;

    if (!planId || !totalSeats || !customerDetails) {
      return NextResponse.json(
        {
          error: 'Missing required fields: planId, totalSeats, customerDetails',
        },
        { status: 400 }
      );
    }

    const result =
      await organizationSubscriptionService.createOrganizationSubscription({
        organizationId: params.id,
        planId,
        totalSeats,
        customerDetails,
      });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: true,
        subscriptionId: result.subscriptionId,
        invoiceId: result.invoiceId,
        message: 'Subscription created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating organization subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/organizations/[id]/subscription - Update subscription
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to manage subscription
    const hasPermission = await organizationService.userCanPerformAction(
      session.user.id,
      params.id,
      'manage_subscription'
    );

    if (!hasPermission) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body: SubscriptionUpdateParams = await request.json();
    const { newTotalSeats } = body;

    if (!newTotalSeats || newTotalSeats < 1) {
      return NextResponse.json(
        { error: 'Valid newTotalSeats is required' },
        { status: 400 }
      );
    }

    const result =
      await organizationSubscriptionService.updateOrganizationSeats({
        organizationId: params.id,
        newTotalSeats,
      });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      newPrice: result.newPrice,
      newTotalSeats: result.newTotalSeats,
      invoiceId: result.invoiceId,
      message: 'Subscription updated successfully',
    });
  } catch (error) {
    console.error('Error updating organization subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/organizations/[id]/subscription - Cancel subscription
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to manage subscription
    const hasPermission = await organizationService.userCanPerformAction(
      session.user.id,
      params.id,
      'manage_subscription'
    );

    if (!hasPermission) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const url = new URL(request.url);
    const reason =
      url.searchParams.get('reason') || 'User requested cancellation';

    const result =
      await organizationSubscriptionService.cancelOrganizationSubscription(
        params.id,
        reason
      );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled successfully',
    });
  } catch (error) {
    console.error('Error cancelling organization subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

