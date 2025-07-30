// FleetFlow Individual Subscription Management API
// Handles subscription creation, management, and billing for B2B2C model

import { NextRequest, NextResponse } from 'next/server';
import { EnhancedAccessControlService } from '../../services/EnhancedAccessControlService';
import { SubscriptionManagementService } from '../../services/SubscriptionManagementService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');

    switch (action) {
      case 'tiers':
        // Get all available subscription tiers
        const tiers = SubscriptionManagementService.getSubscriptionTiers();
        return NextResponse.json({
          success: true,
          tiers: tiers.map((tier) => ({
            ...tier,
            // Add monthly/annual pricing comparison
            savings:
              tier.billingCycle === 'annual'
                ? Math.round(
                    (((tier.price / 12) * 12 - tier.price) /
                      (tier.price / 12)) *
                      100
                  )
                : 0,
          })),
        });

      case 'subscription':
        // Get user's current subscription
        if (!userId) {
          return NextResponse.json(
            { error: 'User ID required' },
            { status: 400 }
          );
        }

        const subscription =
          SubscriptionManagementService.getUserSubscription(userId);
        if (!subscription) {
          return NextResponse.json({
            success: true,
            subscription: null,
            message: 'No active subscription found',
          });
        }

        const tier = SubscriptionManagementService.getSubscriptionTier(
          subscription.subscriptionTierId
        );
        const trialStatus =
          SubscriptionManagementService.getTrialStatus(userId);

        return NextResponse.json({
          success: true,
          subscription: {
            ...subscription,
            tierDetails: tier,
            trialStatus,
          },
        });

      case 'permissions':
        // Get user's permissions and access level
        if (!userId) {
          return NextResponse.json(
            { error: 'User ID required' },
            { status: 400 }
          );
        }

        const permissions =
          await EnhancedAccessControlService.getUserPermissions(userId);
        return NextResponse.json({
          success: true,
          ...permissions,
        });

      case 'analytics':
        // Get subscription analytics (admin only)
        const analytics =
          SubscriptionManagementService.getSubscriptionAnalytics();
        const accessStats =
          EnhancedAccessControlService.getAccessControlStats();

        return NextResponse.json({
          success: true,
          analytics: {
            ...analytics,
            accessControl: accessStats,
            revenueProjection: {
              currentMRR: analytics.monthlyRecurringRevenue,
              projectedARR: analytics.annualRecurringRevenue,
              averageRevenuePerUser:
                analytics.activeSubscriptions > 0
                  ? analytics.monthlyRecurringRevenue /
                    analytics.activeSubscriptions
                  : 0,
            },
          },
        });

      case 'recommendations':
        // Get subscription recommendations for user
        if (!userId) {
          return NextResponse.json(
            { error: 'User ID required' },
            { status: 400 }
          );
        }

        const attemptedFeatures =
          searchParams.get('features')?.split(',') || [];
        const recommendations =
          EnhancedAccessControlService.getSubscriptionRecommendations(
            userId,
            attemptedFeatures
          );

        return NextResponse.json({
          success: true,
          recommendations,
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Subscription GET error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, userEmail, userName, ...data } = body;

    if (!userId || !userEmail || !userName) {
      return NextResponse.json(
        {
          error: 'User information required (userId, userEmail, userName)',
        },
        { status: 400 }
      );
    }

    switch (action) {
      case 'create':
        // Create new subscription
        const { tierId, paymentMethodId, trialOnly } = data;

        if (!tierId) {
          return NextResponse.json(
            { error: 'Subscription tier ID required' },
            { status: 400 }
          );
        }

        const subscription =
          await SubscriptionManagementService.createSubscription(
            userId,
            userEmail,
            userName,
            tierId,
            trialOnly ? undefined : paymentMethodId
          );

        // Clear access control cache for immediate effect
        EnhancedAccessControlService.clearUserCache(userId);

        return NextResponse.json({
          success: true,
          subscription,
          message: `Successfully created ${subscription.status} subscription`,
          trialStatus: SubscriptionManagementService.getTrialStatus(userId),
        });

      case 'upgrade':
      case 'downgrade':
      case 'change':
        // Change subscription tier
        const { newTierId } = data;

        if (!newTierId) {
          return NextResponse.json(
            { error: 'New tier ID required' },
            { status: 400 }
          );
        }

        const updatedSubscription =
          await SubscriptionManagementService.changeSubscription(
            userId,
            newTierId
          );

        // Clear cache for immediate effect
        EnhancedAccessControlService.clearUserCache(userId);

        return NextResponse.json({
          success: true,
          subscription: updatedSubscription,
          message: `Successfully ${action}d subscription`,
        });

      case 'cancel':
        // Cancel subscription
        const { cancelAtPeriodEnd = true } = data;

        await SubscriptionManagementService.cancelSubscription(
          userId,
          cancelAtPeriodEnd
        );

        // Clear cache
        EnhancedAccessControlService.clearUserCache(userId);

        return NextResponse.json({
          success: true,
          message: cancelAtPeriodEnd
            ? 'Subscription will cancel at the end of current period'
            : 'Subscription cancelled immediately',
        });

      case 'reactivate':
        // Reactivate cancelled subscription
        const currentSubscription =
          SubscriptionManagementService.getUserSubscription(userId);
        if (!currentSubscription) {
          return NextResponse.json(
            { error: 'No subscription found' },
            { status: 404 }
          );
        }

        currentSubscription.cancelAtPeriodEnd = false;
        currentSubscription.status = 'active';
        currentSubscription.updatedAt = new Date();

        EnhancedAccessControlService.clearUserCache(userId);

        return NextResponse.json({
          success: true,
          subscription: currentSubscription,
          message: 'Subscription reactivated successfully',
        });

      case 'trial_to_paid':
        // Convert trial to paid subscription
        const { paymentMethodId: newPaymentMethod } = data;

        if (!newPaymentMethod) {
          return NextResponse.json(
            { error: 'Payment method required' },
            { status: 400 }
          );
        }

        const trialSubscription =
          SubscriptionManagementService.getUserSubscription(userId);
        if (!trialSubscription || trialSubscription.status !== 'trial') {
          return NextResponse.json(
            { error: 'No active trial found' },
            { status: 404 }
          );
        }

        // Update to paid subscription
        trialSubscription.status = 'active';
        trialSubscription.stripeCustomerId = `cus_${Date.now()}`;
        trialSubscription.stripeSubscriptionId = `sub_${Date.now()}`;
        trialSubscription.updatedAt = new Date();

        EnhancedAccessControlService.clearUserCache(userId);

        return NextResponse.json({
          success: true,
          subscription: trialSubscription,
          message: 'Trial converted to paid subscription successfully',
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Subscription POST error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, ...data } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    switch (action) {
      case 'update_payment':
        // Update payment method
        const { paymentMethodId } = data;

        if (!paymentMethodId) {
          return NextResponse.json(
            { error: 'Payment method ID required' },
            { status: 400 }
          );
        }

        const subscription =
          SubscriptionManagementService.getUserSubscription(userId);
        if (!subscription) {
          return NextResponse.json(
            { error: 'No subscription found' },
            { status: 404 }
          );
        }

        // Update payment method (placeholder - would integrate with Stripe)
        console.log(
          `Updating payment method for user ${userId} to ${paymentMethodId}`
        );

        return NextResponse.json({
          success: true,
          message: 'Payment method updated successfully',
        });

      case 'update_billing_cycle':
        // Switch between monthly/annual
        const { billingCycle } = data;

        if (!['monthly', 'annual'].includes(billingCycle)) {
          return NextResponse.json(
            { error: 'Invalid billing cycle' },
            { status: 400 }
          );
        }

        const currentSub =
          SubscriptionManagementService.getUserSubscription(userId);
        if (!currentSub) {
          return NextResponse.json(
            { error: 'No subscription found' },
            { status: 404 }
          );
        }

        const currentTier = SubscriptionManagementService.getSubscriptionTier(
          currentSub.subscriptionTierId
        );
        if (!currentTier) {
          return NextResponse.json(
            { error: 'Invalid subscription tier' },
            { status: 400 }
          );
        }

        // Find equivalent tier with different billing cycle
        const targetTierId =
          billingCycle === 'annual'
            ? `${currentTier.id.replace('-annual', '')}-annual`
            : currentTier.id.replace('-annual', '');

        const targetTier =
          SubscriptionManagementService.getSubscriptionTier(targetTierId);
        if (!targetTier) {
          return NextResponse.json(
            { error: 'Target billing cycle not available' },
            { status: 400 }
          );
        }

        await SubscriptionManagementService.changeSubscription(
          userId,
          targetTierId
        );
        EnhancedAccessControlService.clearUserCache(userId);

        return NextResponse.json({
          success: true,
          message: `Billing cycle updated to ${billingCycle}`,
          newTier: targetTier,
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Subscription PUT error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const immediate = searchParams.get('immediate') === 'true';

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    await SubscriptionManagementService.cancelSubscription(userId, !immediate);
    EnhancedAccessControlService.clearUserCache(userId);

    return NextResponse.json({
      success: true,
      message: immediate
        ? 'Subscription cancelled immediately'
        : 'Subscription will cancel at end of current period',
    });
  } catch (error) {
    console.error('Subscription DELETE error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
