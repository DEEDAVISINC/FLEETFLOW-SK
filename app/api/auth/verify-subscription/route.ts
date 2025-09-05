import { NextRequest, NextResponse } from 'next/server';
// import { SubscriptionManagementService } from '../../services/SubscriptionManagementService';

export async function POST(request: NextRequest) {
  try {
    const { userId, email } = await request.json();

    if (!userId || !email) {
      return NextResponse.json(
        { error: 'User ID and email are required' },
        { status: 400 }
      );
    }

    // Get user's subscription
    const subscription =
      SubscriptionManagementService.getUserSubscription(userId);
    const trialStatus = SubscriptionManagementService.getTrialStatus(userId);

    if (!subscription) {
      return NextResponse.json(
        {
          success: false,
          error: 'No active subscription found',
          subscription: null,
          requiresPayment: true,
          message: 'Please select a subscription plan to continue',
        },
        { status: 403 }
      );
    }

    // Check if subscription is active or in trial
    const isActive = subscription.status === 'active';
    const isInTrial = trialStatus.isInTrial;

    if (!isActive && !isInTrial) {
      return NextResponse.json(
        {
          success: false,
          error: 'Subscription expired',
          subscription: {
            status: subscription.status,
            trialStatus,
          },
          requiresPayment: true,
          message: 'Your trial has expired. Please upgrade to continue.',
        },
        { status: 403 }
      );
    }

    // Get subscription tier details
    const tier = SubscriptionManagementService.getSubscriptionTier(
      subscription.subscriptionTierId
    );

    // Check usage limits
    const permissions =
      SubscriptionManagementService.getUserPermissions(userId);

    return NextResponse.json({
      success: true,
      subscription: {
        ...subscription,
        tierDetails: tier,
        trialStatus,
        permissions,
      },
      message: isInTrial
        ? `Trial active - ${trialStatus.daysRemaining} days remaining`
        : 'Subscription active',
    });
  } catch (error) {
    console.error('Subscription verification error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const email = searchParams.get('email');

  if (!userId || !email) {
    return NextResponse.json(
      { error: 'User ID and email are required' },
      { status: 400 }
    );
  }

  // Create a request body for the POST method
  const requestBody = { userId, email };

  // Create a new request with the body
  const newRequest = new NextRequest(request.url, {
    method: 'POST',
    headers: request.headers,
    body: JSON.stringify(requestBody),
  });

  return POST(newRequest);
}
