import { NextRequest, NextResponse } from 'next/server';
import OnboardingUserIntegrationService from '../../../services/OnboardingUserIntegrationService';

export async function POST(request: NextRequest) {
  try {
    const { notificationId, action, reviewedBy, notes } = await request.json();

    // Validate required fields
    if (!notificationId || !action || !reviewedBy) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Missing required fields: notificationId, action, and reviewedBy are required',
        },
        { status: 400 }
      );
    }

    // Validate action
    if (action !== 'approve' && action !== 'deny') {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid action. Must be "approve" or "deny"',
        },
        { status: 400 }
      );
    }

    // Process access request
    const result = await OnboardingUserIntegrationService.processAccessRequest(
      notificationId,
      action,
      reviewedBy,
      notes
    );

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          message: result.message,
          data: {
            notificationId,
            action,
            reviewedBy,
            reviewedAt: new Date().toISOString(),
          },
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Access request processing API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: `Internal server error: ${error}`,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    // Get pending access requests for review
    const notifications =
      await OnboardingUserIntegrationService.getPendingNotifications(
        tenantId || undefined
      );

    // Filter only pending requests
    const pendingRequests = notifications.filter(
      (notification) => notification.status === 'pending'
    );

    return NextResponse.json(
      {
        success: true,
        pendingRequests,
        count: pendingRequests.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Get pending requests API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: `Failed to fetch pending requests: ${error}`,
      },
      { status: 500 }
    );
  }
}
