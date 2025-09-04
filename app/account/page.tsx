'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import AuthGuard from '../components/AuthGuard';
import { SubscriptionManagementService } from '../services/SubscriptionManagementService';
import UserIdentifierService from '../services/user-identifier-service';

interface AccountInfo {
  userId: string;
  email: string;
  name: string;
  subscription: any;
  squareAccount: any;
  billingHistory: any[];
  usage: any;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'square' | 'billing' | 'subscription'
  >('overview');

  const loadAccountInfo = useCallback(async () => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const userIdentifierService = UserIdentifierService.getInstance();
      const userId =
        (session.user as any).fleetflowUserId ||
        userIdentifierService.getUserId(session.user.email || '');

      // Get subscription information
      const subscription =
        SubscriptionManagementService.getUserSubscription(userId);
      const trialStatus = SubscriptionManagementService.getTrialStatus(userId);

      // Get usage information
      const usage = SubscriptionManagementService.getPhoneUsage(userId);

      // Get Square account information (mock for now)
      const squareAccount = {
        merchantId: 'sq0idp-' + userId.slice(-8),
        businessName: 'DEPOINTE FREIGHT 1ST DIRECT',
        accountStatus: 'Active',
        locationId: 'L' + userId.slice(-8),
        currency: 'USD',
        timezone: 'America/New_York',
        businessAddress: {
          addressLine1: '123 Main St',
          locality: 'Atlanta',
          administrativeDistrictLevel1: 'GA',
          postalCode: '30309',
          country: 'US',
        },
      };

      // Mock billing history
      const billingHistory = [
        {
          id: 'inv_001',
          date: '2024-12-18',
          amount: 289.0,
          status: 'paid',
          description: 'Professional Brokerage - Monthly',
        },
        {
          id: 'inv_002',
          date: '2024-11-18',
          amount: 289.0,
          status: 'paid',
          description: 'Professional Brokerage - Monthly',
        },
        {
          id: 'inv_003',
          date: '2024-10-18',
          amount: 289.0,
          status: 'paid',
          description: 'Professional Brokerage - Monthly',
        },
      ];

      setAccountInfo({
        userId,
        email: session!.user.email || '',
        name: session!.user.name || 'User',
        subscription: {
          ...subscription,
          trialStatus,
        },
        squareAccount,
        billingHistory,
        usage,
      });
    } catch (error) {
      console.error('Failed to load account info:', error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session?.user && status === 'authenticated') {
      loadAccountInfo();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [session, status, loadAccountInfo]);

  if (status === 'loading' || loading) {
    return (
      <AuthGuard requireAuth={true}>
        <div className='flex min-h-screen items-center justify-center bg-gray-50'>
          <div className='text-center'>
            <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600' />
            <p className='text-gray-600'>Loading account information...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (!session?.user) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-red-600' />
          <p className='text-red-600'>Please sign in to view your account</p>
          <Link
            href='/auth/signin'
            className='mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700'
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
        {/* Modern Header with Gradient */}
        <div className='relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700'>
          <div className='absolute inset-0 bg-black/10'></div>
          <div className='relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm'>
                  <span className='text-2xl'>👤</span>
                </div>
                <div>
                  <h1 className='text-3xl font-bold text-white'>
                    Welcome back, {accountInfo?.name || 'User'}!
                  </h1>
                  <p className='mt-1 text-blue-100'>
                    Manage your FleetFlow account and Square merchant services
                  </p>
                </div>
              </div>
              <div className='flex space-x-3'>
                <Link
                  href='/user-profile'
                  className='inline-flex items-center rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/30'
                >
                  <span className='mr-2'>⚙️</span>
                  Settings
                </Link>
                <Link
                  href='/plans'
                  className='inline-flex items-center rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20'
                >
                  <span className='mr-2'>📈</span>
                  Upgrade
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Navigation Cards */}
        <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
          <div className='mb-8'>
            <h2 className='mb-4 text-xl font-semibold text-gray-900'>
              Account Dashboard
            </h2>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
              {[
                {
                  id: 'overview',
                  name: 'Overview',
                  icon: '👤',
                  description: 'Account summary',
                  color: 'from-blue-500 to-blue-600',
                  bgColor: 'bg-blue-50',
                  textColor: 'text-blue-700',
                },
                {
                  id: 'square',
                  name: 'Square Account',
                  icon: '💳',
                  description: 'Merchant services',
                  color: 'from-green-500 to-green-600',
                  bgColor: 'bg-green-50',
                  textColor: 'text-green-700',
                },
                {
                  id: 'billing',
                  name: 'Billing & Payments',
                  icon: '💰',
                  description: 'Payment history',
                  color: 'from-purple-500 to-purple-600',
                  bgColor: 'bg-purple-50',
                  textColor: 'text-purple-700',
                },
                {
                  id: 'subscription',
                  name: 'Subscription',
                  icon: '📋',
                  description: 'Plan & usage',
                  color: 'from-orange-500 to-orange-600',
                  bgColor: 'bg-orange-50',
                  textColor: 'text-orange-700',
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`group relative overflow-hidden rounded-xl p-6 text-left transition-all hover:scale-105 hover:shadow-xl ${
                    activeTab === tab.id
                      ? `bg-gradient-to-br ${tab.color} text-white shadow-lg`
                      : `${tab.bgColor} ${tab.textColor} hover:shadow-lg`
                  }`}
                >
                  <div
                    className={`mb-3 text-3xl ${activeTab === tab.id ? 'text-white' : ''}`}
                  >
                    {tab.icon}
                  </div>
                  <h3
                    className={`text-lg font-semibold ${activeTab === tab.id ? 'text-white' : ''}`}
                  >
                    {tab.name}
                  </h3>
                  <p
                    className={`text-sm ${activeTab === tab.id ? 'text-blue-100' : 'text-gray-600'}`}
                  >
                    {tab.description}
                  </p>
                  {activeTab === tab.id && (
                    <div className='absolute top-2 right-2 h-3 w-3 rounded-full bg-white'></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className='space-y-8'>
            {activeTab === 'overview' && accountInfo && (
              <div className='space-y-8'>
                {/* Welcome Card */}
                <div className='relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-xl'>
                  <div className='absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10'></div>
                  <div className='relative'>
                    <h2 className='text-2xl font-bold'>Account Overview</h2>
                    <p className='mt-2 text-blue-100'>
                      Here's a quick summary of your FleetFlow account and
                      services
                    </p>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
                  <div className='group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 transition-all hover:scale-105 hover:shadow-lg'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-sm font-medium text-blue-600'>
                          Current Plan
                        </p>
                        <p className='text-2xl font-bold text-blue-900'>
                          {accountInfo.subscription?.tierDetails?.name?.split(
                            ' '
                          )[0] || 'Pro'}
                        </p>
                      </div>
                      <div className='text-4xl'>📋</div>
                    </div>
                    <div className='mt-4 flex items-center text-sm'>
                      <span className='text-green-600'>✓ Active</span>
                    </div>
                  </div>

                  <div className='group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-6 transition-all hover:scale-105 hover:shadow-lg'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-sm font-medium text-green-600'>
                          Square Status
                        </p>
                        <p className='text-2xl font-bold text-green-900'>
                          Active
                        </p>
                      </div>
                      <div className='text-4xl'>💳</div>
                    </div>
                    <div className='mt-4 flex items-center text-sm'>
                      <span className='text-green-600'>✓ Connected</span>
                    </div>
                  </div>

                  <div className='group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-6 transition-all hover:scale-105 hover:shadow-lg'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-sm font-medium text-purple-600'>
                          Phone Minutes
                        </p>
                        <p className='text-2xl font-bold text-purple-900'>
                          {accountInfo.usage?.minutesUsed || 0}
                        </p>
                      </div>
                      <div className='text-4xl'>📞</div>
                    </div>
                    <div className='mt-4 flex items-center text-sm'>
                      <span className='text-purple-600'>
                        of{' '}
                        {accountInfo.usage?.minutesLimit === -1
                          ? '∞'
                          : accountInfo.usage?.minutesLimit || 0}
                      </span>
                    </div>
                  </div>

                  <div className='group relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 p-6 transition-all hover:scale-105 hover:shadow-lg'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-sm font-medium text-orange-600'>
                          Next Billing
                        </p>
                        <p className='text-lg font-bold text-orange-900'>
                          {accountInfo.subscription?.currentPeriodEnd
                            ? new Date(
                                accountInfo.subscription.currentPeriodEnd
                              ).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })
                            : 'N/A'}
                        </p>
                      </div>
                      <div className='text-4xl'>📅</div>
                    </div>
                    <div className='mt-4 flex items-center text-sm'>
                      <span className='text-orange-600'>Monthly</span>
                    </div>
                  </div>
                </div>

                {/* Account Details Card */}
                <div className='rounded-xl bg-white p-8 shadow-lg'>
                  <div className='mb-6 flex items-center justify-between'>
                    <h3 className='text-xl font-semibold text-gray-900'>
                      Account Information
                    </h3>
                    <Link
                      href='/user-profile'
                      className='inline-flex items-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200'
                    >
                      <span className='mr-2'>✏️</span>
                      Edit Profile
                    </Link>
                  </div>

                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <div className='space-y-4'>
                      <div className='flex items-center space-x-3'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100'>
                          <span className='text-lg'>👤</span>
                        </div>
                        <div>
                          <p className='text-sm font-medium text-gray-500'>
                            Full Name
                          </p>
                          <p className='text-lg font-semibold text-gray-900'>
                            {accountInfo.name}
                          </p>
                        </div>
                      </div>

                      <div className='flex items-center space-x-3'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-green-100'>
                          <span className='text-lg'>📧</span>
                        </div>
                        <div>
                          <p className='text-sm font-medium text-gray-500'>
                            Email Address
                          </p>
                          <p className='text-lg font-semibold text-gray-900'>
                            {accountInfo.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className='space-y-4'>
                      <div className='flex items-center space-x-3'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100'>
                          <span className='text-lg'>🆔</span>
                        </div>
                        <div>
                          <p className='text-sm font-medium text-gray-500'>
                            User ID
                          </p>
                          <p className='font-mono text-lg font-semibold text-gray-900'>
                            {accountInfo.userId}
                          </p>
                        </div>
                      </div>

                      <div className='flex items-center space-x-3'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-green-100'>
                          <span className='text-lg'>✅</span>
                        </div>
                        <div>
                          <p className='text-sm font-medium text-gray-500'>
                            Account Status
                          </p>
                          <span className='inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800'>
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'square' && accountInfo && (
              <div className='space-y-8'>
                {/* Square Status Banner */}
                <div className='relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white shadow-xl'>
                  <div className='absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10'></div>
                  <div className='relative flex items-center justify-between'>
                    <div>
                      <h2 className='text-2xl font-bold'>
                        Square Merchant Account
                      </h2>
                      <p className='mt-2 text-green-100'>
                        Your payment processing is active and connected
                      </p>
                    </div>
                    <div className='flex h-16 w-16 items-center justify-center rounded-full bg-white/20'>
                      <span className='text-3xl'>💳</span>
                    </div>
                  </div>
                </div>

                {/* Square Account Cards */}
                <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                  {/* Account Details */}
                  <div className='rounded-xl bg-white p-6 shadow-lg'>
                    <div className='mb-6 flex items-center'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-green-100'>
                        <span className='text-xl'>🏪</span>
                      </div>
                      <div className='ml-4'>
                        <h3 className='text-lg font-semibold text-gray-900'>
                          Account Details
                        </h3>
                        <p className='text-sm text-gray-600'>
                          Merchant information and settings
                        </p>
                      </div>
                    </div>

                    <div className='space-y-4'>
                      <div className='flex items-center justify-between rounded-lg bg-gray-50 p-4'>
                        <div className='flex items-center space-x-3'>
                          <div className='flex h-8 w-8 items-center justify-center rounded bg-green-100'>
                            <span className='text-sm'>🆔</span>
                          </div>
                          <div>
                            <p className='text-sm font-medium text-gray-900'>
                              Merchant ID
                            </p>
                            <p className='text-xs text-gray-500'>
                              Your Square identifier
                            </p>
                          </div>
                        </div>
                        <span className='font-mono text-sm font-medium text-gray-900'>
                          {accountInfo.squareAccount.merchantId}
                        </span>
                      </div>

                      <div className='flex items-center justify-between rounded-lg bg-gray-50 p-4'>
                        <div className='flex items-center space-x-3'>
                          <div className='flex h-8 w-8 items-center justify-center rounded bg-blue-100'>
                            <span className='text-sm'>📍</span>
                          </div>
                          <div>
                            <p className='text-sm font-medium text-gray-900'>
                              Location ID
                            </p>
                            <p className='text-xs text-gray-500'>
                              Store location identifier
                            </p>
                          </div>
                        </div>
                        <span className='font-mono text-sm font-medium text-gray-900'>
                          {accountInfo.squareAccount.locationId}
                        </span>
                      </div>

                      <div className='flex items-center justify-between rounded-lg bg-gray-50 p-4'>
                        <div className='flex items-center space-x-3'>
                          <div className='flex h-8 w-8 items-center justify-center rounded bg-purple-100'>
                            <span className='text-sm'>🏢</span>
                          </div>
                          <div>
                            <p className='text-sm font-medium text-gray-900'>
                              Business Name
                            </p>
                            <p className='text-xs text-gray-500'>
                              Registered company name
                            </p>
                          </div>
                        </div>
                        <span className='text-sm font-medium text-gray-900'>
                          {accountInfo.squareAccount.businessName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Business Address */}
                  <div className='rounded-xl bg-white p-6 shadow-lg'>
                    <div className='mb-6 flex items-center'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100'>
                        <span className='text-xl'>📍</span>
                      </div>
                      <div className='ml-4'>
                        <h3 className='text-lg font-semibold text-gray-900'>
                          Business Address
                        </h3>
                        <p className='text-sm text-gray-600'>
                          Registered business location
                        </p>
                      </div>
                    </div>

                    <div className='rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-6'>
                      <div className='flex items-start space-x-3'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100'>
                          <span className='text-lg'>📮</span>
                        </div>
                        <div className='flex-1'>
                          <div className='text-sm text-gray-900'>
                            <p className='font-medium'>
                              {
                                accountInfo.squareAccount.businessAddress
                                  .addressLine1
                              }
                            </p>
                            <p>
                              Atlanta,{' '}
                              {
                                accountInfo.squareAccount.businessAddress
                                  .administrativeDistrictLevel1
                              }{' '}
                              {
                                accountInfo.squareAccount.businessAddress
                                  .postalCode
                              }
                            </p>
                            <p>
                              {
                                accountInfo.squareAccount.businessAddress
                                  .country
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && accountInfo && (
              <div className='space-y-8'>
                {/* Billing Header */}
                <div className='relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 p-8 text-white shadow-xl'>
                  <div className='absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10'></div>
                  <div className='relative'>
                    <h2 className='text-2xl font-bold'>Billing & Payments</h2>
                    <p className='mt-2 text-purple-100'>
                      View your payment history and billing information
                    </p>
                  </div>
                </div>

                {/* Current Plan & Billing Info */}
                <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
                  <div className='rounded-xl bg-white p-6 shadow-lg'>
                    <h3 className='mb-4 text-lg font-semibold text-gray-900'>
                      Current Plan
                    </h3>
                    <div className='space-y-3'>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Plan</span>
                        <span className='font-semibold text-gray-900'>
                          {accountInfo.subscription?.tierDetails?.name ||
                            'Professional Brokerage'}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Monthly Cost</span>
                        <span className='font-semibold text-gray-900'>
                          ${accountInfo.subscription?.tierDetails?.price || 289}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Next Billing</span>
                        <span className='font-semibold text-gray-900'>
                          {accountInfo.subscription?.currentPeriodEnd
                            ? new Date(
                                accountInfo.subscription.currentPeriodEnd
                              ).toLocaleDateString()
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='rounded-xl bg-white p-6 shadow-lg'>
                    <h3 className='mb-4 text-lg font-semibold text-gray-900'>
                      Payment Method
                    </h3>
                    <div className='flex items-center space-x-3'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100'>
                        <span className='text-2xl'>💳</span>
                      </div>
                      <div>
                        <p className='font-medium text-gray-900'>
                          {accountInfo.subscription?.paymentMethodId
                            ? 'Card ending in ****' +
                              accountInfo.subscription.paymentMethodId.slice(-4)
                            : 'No payment method'}
                        </p>
                        <p className='text-sm text-gray-600'>
                          Primary payment method
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='rounded-xl bg-white p-6 shadow-lg'>
                    <h3 className='mb-4 text-lg font-semibold text-gray-900'>
                      Usage Summary
                    </h3>
                    <div className='space-y-3'>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Phone Minutes</span>
                        <span className='font-semibold text-gray-900'>
                          {accountInfo.usage?.minutesUsed || 0} /{' '}
                          {accountInfo.usage?.minutesLimit === -1
                            ? 'Unlimited'
                            : accountInfo.usage?.minutesLimit || 0}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>SMS Messages</span>
                        <span className='font-semibold text-gray-900'>
                          {accountInfo.usage?.smsUsed || 0} /{' '}
                          {accountInfo.usage?.smsLimit === -1
                            ? 'Unlimited'
                            : accountInfo.usage?.smsLimit || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Billing History */}
                <div className='rounded-xl bg-white p-8 shadow-lg'>
                  <h3 className='mb-6 text-xl font-semibold text-gray-900'>
                    Billing History
                  </h3>
                  <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                            Date
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                            Description
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                            Amount
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-gray-200 bg-white'>
                        {accountInfo.billingHistory.map((invoice: any) => (
                          <tr key={invoice.id}>
                            <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-900'>
                              {new Date(invoice.date).toLocaleDateString()}
                            </td>
                            <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-900'>
                              {invoice.description}
                            </td>
                            <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-900'>
                              ${invoice.amount.toFixed(2)}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  invoice.status === 'paid'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {invoice.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'subscription' && accountInfo && (
              <div className='space-y-8'>
                {/* Subscription Header */}
                <div className='relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 p-8 text-white shadow-xl'>
                  <div className='absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10'></div>
                  <div className='relative'>
                    <h2 className='text-2xl font-bold'>
                      Subscription Management
                    </h2>
                    <p className='mt-2 text-orange-100'>
                      Manage your FleetFlow subscription and usage
                    </p>
                  </div>
                </div>

                {/* Subscription Details */}
                <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                  <div className='rounded-xl bg-white p-6 shadow-lg'>
                    <h3 className='mb-4 text-lg font-semibold text-gray-900'>
                      Plan Information
                    </h3>
                    <div className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <span className='text-gray-600'>Current Plan</span>
                        <span className='font-semibold text-gray-900'>
                          {accountInfo.subscription?.tierDetails?.name ||
                            'Professional Brokerage'}
                        </span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-gray-600'>Plan ID</span>
                        <span className='font-mono text-sm text-gray-900'>
                          {accountInfo.subscription?.subscriptionTierId ||
                            'broker-elite'}
                        </span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-gray-600'>Status</span>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            accountInfo.subscription?.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : accountInfo.subscription?.status === 'trial'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {accountInfo.subscription?.status || 'active'}
                        </span>
                      </div>
                      {accountInfo.subscription?.trialStatus?.isInTrial && (
                        <div className='flex items-center justify-between'>
                          <span className='text-gray-600'>Trial Remaining</span>
                          <span className='font-semibold text-blue-600'>
                            {accountInfo.subscription.trialStatus.daysRemaining}{' '}
                            days
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='rounded-xl bg-white p-6 shadow-lg'>
                    <h3 className='mb-4 text-lg font-semibold text-gray-900'>
                      Billing Cycle
                    </h3>
                    <div className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <span className='text-gray-600'>Monthly Cost</span>
                        <span className='text-2xl font-bold text-gray-900'>
                          ${accountInfo.subscription?.tierDetails?.price || 289}
                        </span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-gray-600'>Billing Cycle</span>
                        <span className='font-semibold text-gray-900'>
                          {accountInfo.subscription?.tierDetails
                            ?.billingCycle || 'monthly'}
                        </span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-gray-600'>Next Billing</span>
                        <span className='font-semibold text-gray-900'>
                          {accountInfo.subscription?.currentPeriodEnd
                            ? new Date(
                                accountInfo.subscription.currentPeriodEnd
                              ).toLocaleDateString()
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Usage Statistics */}
                <div className='rounded-xl bg-white p-8 shadow-lg'>
                  <h3 className='mb-6 text-xl font-semibold text-gray-900'>
                    Usage Statistics
                  </h3>
                  <div className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
                    <div className='text-center'>
                      <div className='mb-2 text-4xl'>📞</div>
                      <div className='text-2xl font-bold text-blue-600'>
                        {accountInfo.usage?.minutesUsed || 0}
                      </div>
                      <div className='text-sm text-gray-600'>
                        Phone Minutes Used
                      </div>
                      <div className='mt-1 text-xs text-gray-500'>
                        Limit:{' '}
                        {accountInfo.usage?.minutesLimit === -1
                          ? 'Unlimited'
                          : accountInfo.usage?.minutesLimit || 0}
                      </div>
                    </div>

                    <div className='text-center'>
                      <div className='mb-2 text-4xl'>💬</div>
                      <div className='text-2xl font-bold text-green-600'>
                        {accountInfo.usage?.smsUsed || 0}
                      </div>
                      <div className='text-sm text-gray-600'>
                        SMS Messages Sent
                      </div>
                      <div className='mt-1 text-xs text-gray-500'>
                        Limit:{' '}
                        {accountInfo.usage?.smsLimit === -1
                          ? 'Unlimited'
                          : accountInfo.usage?.smsLimit || 0}
                      </div>
                    </div>

                    <div className='text-center'>
                      <div className='mb-2 text-4xl'>💰</div>
                      <div className='text-2xl font-bold text-purple-600'>
                        $
                        {accountInfo.usage?.overageCharges?.toFixed(2) ||
                          '0.00'}
                      </div>
                      <div className='text-sm text-gray-600'>
                        Overage Charges
                      </div>
                      <div className='mt-1 text-xs text-gray-500'>
                        This billing cycle
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subscription Actions */}
                <div className='flex flex-col gap-4 sm:flex-row'>
                  <Link
                    href='/subscription-management/subscription-dashboard'
                    className='inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700'
                  >
                    <span className='mr-2'>⚙️</span>
                    Manage Subscription
                  </Link>
                  <Link
                    href='/plans'
                    className='inline-flex items-center justify-center rounded-lg bg-gray-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-700'
                  >
                    <span className='mr-2'>📈</span>
                    View Plans
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
