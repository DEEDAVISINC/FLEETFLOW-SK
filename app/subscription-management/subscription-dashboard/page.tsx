'use client';

// FleetFlow Professional Subscription Dashboard
// Complete subscription management interface for B2B2C model

import {
  BarChart3,
  CheckCircle,
  Clock,
  CreditCard,
  Crown,
  Gift,
  Star,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'annual';
  features: string[];
  description: string;
  popular?: boolean;
  targetRole: string;
  savings?: number;
}

interface UserSubscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subscriptionTierId: string;
  status: 'active' | 'trial' | 'cancelled' | 'past_due';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEnd?: string;
  cancelAtPeriodEnd: boolean;
  tierDetails?: SubscriptionTier;
  trialStatus?: {
    isInTrial: boolean;
    daysRemaining: number;
  };
}

export default function SubscriptionDashboard() {
  const [subscription, setSubscription] = useState<UserSubscription | null>(
    null
  );
  const [availableTiers, setAvailableTiers] = useState<SubscriptionTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'billing' | 'usage' | 'upgrade'
  >('overview');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>('');

  // Mock user data - in production this would come from auth context
  const currentUser = {
    userId: 'user_123',
    userName: 'John Dispatcher',
    userEmail: 'john@example.com',
  };

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);

      // Load available tiers
      const tiersResponse = await fetch('/api/subscriptions?action=tiers');
      const tiersData = await tiersResponse.json();
      setAvailableTiers(tiersData.tiers || []);

      // Load user's current subscription
      const subResponse = await fetch(
        `/api/subscriptions?action=subscription&userId=${currentUser.userId}`
      );
      const subData = await subResponse.json();
      setSubscription(subData.subscription);
    } catch (error) {
      console.error('Failed to load subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (tierId: string) => {
    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'upgrade',
          userId: currentUser.userId,
          userEmail: currentUser.userEmail,
          userName: currentUser.userName,
          newTierId: tierId,
        }),
      });

      const result = await response.json();
      if (result.success) {
        await loadSubscriptionData();
        setShowUpgradeModal(false);
        alert('Subscription upgraded successfully!');
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
      alert('Upgrade failed. Please try again.');
    }
  };

  const handleStartTrial = async (tierId: string) => {
    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          userId: currentUser.userId,
          userEmail: currentUser.userEmail,
          userName: currentUser.userName,
          tierId,
          trialOnly: true,
        }),
      });

      const result = await response.json();
      if (result.success) {
        await loadSubscriptionData();
        alert('Trial started successfully!');
      }
    } catch (error) {
      console.error('Trial creation failed:', error);
      alert('Failed to start trial. Please try again.');
    }
  };

  const formatPrice = (price: number, billingCycle: string) => {
    if (billingCycle === 'annual') {
      const monthlyEquivalent = Math.round(price / 12);
      return `$${monthlyEquivalent}/mo (billed annually at $${price})`;
    }
    return `$${price}/${billingCycle === 'monthly' ? 'mo' : billingCycle}`;
  };

  const getStatusBadge = (status: string, isInTrial?: boolean) => {
    if (isInTrial) {
      return (
        <span className='inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800'>
          <Clock className='h-4 w-4' />
          Trial
        </span>
      );
    }

    const statusStyles = {
      active: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      past_due: 'bg-orange-100 text-orange-800',
    };

    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${statusStyles[status as keyof typeof statusStyles]}`}
      >
        <CheckCircle className='h-4 w-4' />
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </span>
    );
  };

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-teal-600'></div>
          <p className='text-gray-600'>Loading subscription data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='border-b bg-white shadow-sm'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='py-6'>
            <div className='flex items-center justify-between'>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>
                  FleetFlow Professional
                </h1>
                <p className='text-gray-600'>
                  Manage your subscription and unlock professional tools
                </p>
              </div>
              {subscription?.trialStatus?.isInTrial && (
                <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
                  <div className='flex items-center gap-2'>
                    <Gift className='h-5 w-5 text-yellow-600' />
                    <div>
                      <p className='font-medium text-yellow-800'>
                        {subscription.trialStatus.daysRemaining} days left in
                        trial
                      </p>
                      <p className='text-sm text-yellow-600'>
                        Upgrade now to continue using premium features
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='border-b border-gray-200'>
          <nav className='-mb-px flex space-x-8'>
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'billing', name: 'Billing', icon: CreditCard },
              { id: 'usage', name: 'Usage', icon: TrendingUp },
              { id: 'upgrade', name: 'Plans', icon: Crown },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <tab.icon className='h-5 w-5' />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        {activeTab === 'overview' && (
          <div className='space-y-6'>
            {/* Current Subscription */}
            <div className='rounded-lg border bg-white p-6 shadow-sm'>
              <div className='mb-4 flex items-center justify-between'>
                <h2 className='text-lg font-semibold text-gray-900'>
                  Current Subscription
                </h2>
                {subscription &&
                  getStatusBadge(
                    subscription.status,
                    subscription.trialStatus?.isInTrial
                  )}
              </div>

              {subscription ? (
                <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                  <div>
                    <h3 className='mb-2 font-medium text-gray-900'>
                      {subscription.tierDetails?.name}
                    </h3>
                    <p className='text-2xl font-bold text-teal-600'>
                      {subscription.tierDetails &&
                        formatPrice(
                          subscription.tierDetails.price,
                          subscription.tierDetails.billingCycle
                        )}
                    </p>
                    <p className='mt-1 text-sm text-gray-600'>
                      {subscription.tierDetails?.description}
                    </p>
                  </div>

                  <div>
                    <h4 className='mb-2 font-medium text-gray-900'>
                      Current Period
                    </h4>
                    <p className='text-sm text-gray-600'>
                      {new Date(
                        subscription.currentPeriodStart
                      ).toLocaleDateString()}{' '}
                      -{' '}
                      {new Date(
                        subscription.currentPeriodEnd
                      ).toLocaleDateString()}
                    </p>
                    {subscription.cancelAtPeriodEnd && (
                      <p className='mt-1 text-sm text-red-600'>
                        Will cancel at period end
                      </p>
                    )}
                  </div>

                  <div>
                    <h4 className='mb-2 font-medium text-gray-900'>
                      Next Billing
                    </h4>
                    <p className='text-sm text-gray-600'>
                      {new Date(
                        subscription.currentPeriodEnd
                      ).toLocaleDateString()}
                    </p>
                    <p className='mt-1 text-xs text-gray-500'>
                      Auto-renewal{' '}
                      {subscription.cancelAtPeriodEnd ? 'disabled' : 'enabled'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className='py-8 text-center'>
                  <Zap className='mx-auto mb-4 h-12 w-12 text-gray-400' />
                  <h3 className='mb-2 text-lg font-medium text-gray-900'>
                    No Active Subscription
                  </h3>
                  <p className='mb-4 text-gray-600'>
                    Start your FleetFlow Professional journey today
                  </p>
                  <button
                    onClick={() => setActiveTab('upgrade')}
                    className='rounded-lg bg-teal-600 px-6 py-2 text-white transition-colors hover:bg-teal-700'
                  >
                    View Plans
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            {subscription && (
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <button
                  onClick={() => setActiveTab('upgrade')}
                  className='rounded-lg border bg-white p-4 text-left transition-colors hover:border-teal-300'
                >
                  <Crown className='mb-2 h-8 w-8 text-teal-600' />
                  <h3 className='font-medium text-gray-900'>Upgrade Plan</h3>
                  <p className='text-sm text-gray-600'>Unlock more features</p>
                </button>

                <button
                  onClick={() => setActiveTab('billing')}
                  className='rounded-lg border bg-white p-4 text-left transition-colors hover:border-teal-300'
                >
                  <CreditCard className='mb-2 h-8 w-8 text-teal-600' />
                  <h3 className='font-medium text-gray-900'>
                    Billing Settings
                  </h3>
                  <p className='text-sm text-gray-600'>
                    Manage payment methods
                  </p>
                </button>

                <button
                  onClick={() => setActiveTab('usage')}
                  className='rounded-lg border bg-white p-4 text-left transition-colors hover:border-teal-300'
                >
                  <TrendingUp className='mb-2 h-8 w-8 text-teal-600' />
                  <h3 className='font-medium text-gray-900'>Usage Analytics</h3>
                  <p className='text-sm text-gray-600'>Track your activity</p>
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'upgrade' && (
          <div className='space-y-6'>
            <div className='mb-8 text-center'>
              <h2 className='text-2xl font-bold text-gray-900'>
                Choose Your Professional Plan
              </h2>
              <p className='mt-2 text-gray-600'>
                Unlock the tools you need to succeed in transportation
              </p>
            </div>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {availableTiers
                .filter((tier) => tier.billingCycle === 'monthly')
                .map((tier) => (
                  <div
                    key={tier.id}
                    className={`relative rounded-lg border-2 bg-white p-6 ${
                      tier.popular
                        ? 'border-teal-500 ring-2 ring-teal-200'
                        : 'border-gray-200'
                    }`}
                  >
                    {tier.popular && (
                      <div className='absolute -top-3 left-1/2 -translate-x-1/2 transform'>
                        <span className='flex items-center gap-1 rounded-full bg-teal-500 px-3 py-1 text-sm font-medium text-white'>
                          <Star className='h-4 w-4' />
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className='text-center'>
                      <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                        {tier.name}
                      </h3>
                      <div className='mb-4'>
                        <span className='text-3xl font-bold text-gray-900'>
                          ${tier.price}
                        </span>
                        <span className='text-gray-600'>/month</span>
                      </div>
                      <p className='mb-6 text-sm text-gray-600'>
                        {tier.description}
                      </p>
                    </div>

                    <div className='mb-6 space-y-3'>
                      {tier.features.slice(0, 5).map((feature, index) => (
                        <div key={index} className='flex items-center gap-2'>
                          <CheckCircle className='h-4 w-4 flex-shrink-0 text-green-500' />
                          <span className='text-sm text-gray-700'>
                            {feature.replace(/\./g, ' ').replace(/[_-]/g, ' ')}
                          </span>
                        </div>
                      ))}
                      {tier.features.length > 5 && (
                        <p className='text-xs text-gray-500'>
                          + {tier.features.length - 5} more features
                        </p>
                      )}
                    </div>

                    <div className='space-y-2'>
                      {subscription?.subscriptionTierId === tier.id ? (
                        <div className='rounded-lg bg-gray-100 px-4 py-2 text-center font-medium text-gray-600'>
                          Current Plan
                        </div>
                      ) : subscription ? (
                        <button
                          onClick={() => handleUpgrade(tier.id)}
                          className={`w-full rounded-lg px-4 py-2 font-medium transition-colors ${
                            tier.popular
                              ? 'bg-teal-600 text-white hover:bg-teal-700'
                              : 'bg-gray-900 text-white hover:bg-gray-800'
                          }`}
                        >
                          Upgrade to {tier.name}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartTrial(tier.id)}
                          className={`w-full rounded-lg px-4 py-2 font-medium transition-colors ${
                            tier.popular
                              ? 'bg-teal-600 text-white hover:bg-teal-700'
                              : 'bg-gray-900 text-white hover:bg-gray-800'
                          }`}
                        >
                          Start 14-Day Trial
                        </button>
                      )}

                      {/* Annual option */}
                      {availableTiers.find(
                        (t) => t.id === `${tier.id}-annual`
                      ) && (
                        <p className='text-center text-xs text-gray-600'>
                          Save 17% with annual billing
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className='space-y-6'>
            <div className='rounded-lg border bg-white p-6 shadow-sm'>
              <h2 className='mb-4 text-lg font-semibold text-gray-900'>
                Billing Information
              </h2>
              <p className='text-gray-600'>
                Billing management features will be available soon.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'usage' && (
          <div className='space-y-6'>
            <div className='rounded-lg border bg-white p-6 shadow-sm'>
              <h2 className='mb-4 text-lg font-semibold text-gray-900'>
                Usage Analytics
              </h2>
              <p className='text-gray-600'>
                Usage tracking features will be available soon.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
