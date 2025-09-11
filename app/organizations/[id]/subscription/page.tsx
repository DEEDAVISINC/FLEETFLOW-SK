'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ORGANIZATION_SUBSCRIPTION_PLANS } from '../../../config/subscriptionPlans';

interface Subscription {
  plan: {
    id: string;
    name: string;
    basePrice: number;
    includedSeats: number;
    additionalSeatPrice: number;
    features: string[];
  };
  seats: {
    total: number;
    used: number;
    available: number;
  };
  price: number;
  billingCycle: string;
  nextBillingDate: Date;
}

export default function OrganizationSubscriptionPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [newTotalSeats, setNewTotalSeats] = useState<number>(0);

  useEffect(() => {
    fetchSubscription();
  }, [params.id]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/organizations/${params.id}/subscription`
      );
      const data = await response.json();

      if (data.success) {
        setSubscription(data.subscription);
        setNewTotalSeats(data.subscription.seats.total);
      } else {
        setError(data.error || 'Failed to fetch subscription');
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setError('Failed to fetch subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSeats = async () => {
    if (!subscription || newTotalSeats === subscription.seats.total) return;

    try {
      setUpdating(true);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch(
        `/api/organizations/${params.id}/subscription`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            newTotalSeats,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSubscription((prev) =>
          prev
            ? {
                ...prev,
                seats: {
                  ...prev.seats,
                  total: data.newTotalSeats,
                  available: data.newTotalSeats - prev.seats.used,
                },
                price: data.newPrice,
              }
            : null
        );
        setSuccessMessage('Subscription updated successfully!');
      } else {
        setError(data.error || 'Failed to update subscription');
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      setError('Failed to update subscription');
    } finally {
      setUpdating(false);
    }
  };

  const calculateNewPrice = () => {
    if (!subscription || newTotalSeats === subscription.seats.total)
      return subscription?.price || 0;

    const plan =
      ORGANIZATION_SUBSCRIPTION_PLANS[
        subscription.plan.id as keyof typeof ORGANIZATION_SUBSCRIPTION_PLANS
      ];
    if (!plan) return subscription.price;

    const extraSeats = Math.max(0, newTotalSeats - plan.includedSeats);
    return plan.basePrice + extraSeats * plan.additionalSeatPrice;
  };

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600' />
          <p className='mt-4 text-gray-600'>Loading subscription...</p>
        </div>
      </div>
    );
  }

  if (error && !subscription) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='mb-4 text-red-600'>{error}</div>
          <Link
            href={`/organizations/${params.id}`}
            className='text-blue-600 hover:text-blue-800'
          >
            ← Back to Organization
          </Link>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <div className='mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8'>
          <div className='mb-8'>
            <Link
              href={`/organizations/${params.id}`}
              className='mr-4 text-gray-500 hover:text-gray-700'
            >
              ← Back to Organization
            </Link>
            <h1 className='text-3xl font-bold text-gray-900'>
              Subscription Management
            </h1>
          </div>

          <div className='rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm'>
            <div className='mx-auto mb-4 h-16 w-16 text-gray-400'>
              <svg fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1}
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
            </div>
            <h2 className='mb-2 text-xl font-semibold text-gray-900'>
              No Active Subscription
            </h2>
            <p className='mb-6 text-gray-600'>
              This organization doesn't have an active subscription yet.
            </p>
            <button className='rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700'>
              Create Subscription
            </button>
          </div>
        </div>
      </div>
    );
  }

  const newPrice = calculateNewPrice();
  const priceDifference = newPrice - subscription.price;

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <Link
                href={`/organizations/${params.id}`}
                className='mr-4 text-gray-500 hover:text-gray-700'
              >
                ← Back to Organization
              </Link>
              <h1 className='text-3xl font-bold text-gray-900'>
                Subscription Management
              </h1>
              <p className='mt-2 text-gray-600'>
                Manage your organization's subscription and billing
              </p>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className='mb-6 rounded-lg border border-green-200 bg-green-50 p-4'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <svg
                  className='h-5 w-5 text-green-400'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <p className='text-sm text-green-800'>{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className='mb-6 rounded-lg border border-red-200 bg-red-50 p-4'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <svg
                  className='h-5 w-5 text-red-400'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <p className='text-sm text-red-800'>{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Main Content */}
          <div className='space-y-6 lg:col-span-2'>
            {/* Current Plan */}
            <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
              <div className='mb-4 flex items-center justify-between'>
                <h2 className='text-xl font-semibold text-gray-900'>
                  Current Plan
                </h2>
                <span className='rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800'>
                  Active
                </span>
              </div>

              <div className='mb-4'>
                <h3 className='text-lg font-medium text-gray-900'>
                  {subscription.plan.name}
                </h3>
                <p className='text-gray-600'>
                  ${subscription.price}/{subscription.billingCycle}
                </p>
              </div>

              <div className='mb-4'>
                <h4 className='mb-2 font-medium text-gray-900'>
                  Plan Features:
                </h4>
                <ul className='space-y-1 text-sm text-gray-600'>
                  {subscription.plan.features.map((feature, index) => (
                    <li key={index} className='flex items-center'>
                      <svg
                        className='mr-2 h-4 w-4 text-green-500'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className='rounded-lg bg-gray-50 p-4'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-gray-900'>
                      {subscription.seats.used}
                    </div>
                    <div className='text-sm text-gray-600'>Used Seats</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-gray-900'>
                      {subscription.seats.available}
                    </div>
                    <div className='text-sm text-gray-600'>Available Seats</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-gray-900'>
                      {subscription.seats.total}
                    </div>
                    <div className='text-sm text-gray-600'>Total Seats</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seat Management */}
            <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
              <h2 className='mb-4 text-xl font-semibold text-gray-900'>
                Manage Seats
              </h2>

              <div className='space-y-4'>
                <div>
                  <label
                    htmlFor='seats'
                    className='mb-2 block text-sm font-medium text-gray-700'
                  >
                    Total Seats: {newTotalSeats}
                  </label>
                  <input
                    type='range'
                    id='seats'
                    min={subscription.seats.used}
                    max={subscription.seats.used + 20}
                    value={newTotalSeats}
                    onChange={(e) => setNewTotalSeats(parseInt(e.target.value))}
                    className='h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200'
                  />
                  <div className='mt-1 flex justify-between text-xs text-gray-500'>
                    <span>{subscription.seats.used} min</span>
                    <span>{subscription.seats.used + 20} max</span>
                  </div>
                </div>

                {newTotalSeats !== subscription.seats.total && (
                  <div className='rounded-lg bg-blue-50 p-4'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <div className='text-sm font-medium text-blue-900'>
                          Price Change Preview
                        </div>
                        <div className='text-sm text-blue-700'>
                          Current: ${subscription.price}/
                          {subscription.billingCycle}
                        </div>
                        <div className='text-sm text-blue-700'>
                          New: ${newPrice}/{subscription.billingCycle}
                        </div>
                      </div>
                      <div className='text-right'>
                        <div
                          className={`text-lg font-bold ${
                            priceDifference >= 0
                              ? 'text-red-600'
                              : 'text-green-600'
                          }`}
                        >
                          {priceDifference >= 0 ? '+' : ''}${priceDifference}
                        </div>
                        <div className='text-sm text-blue-700'>
                          {priceDifference >= 0 ? 'Increase' : 'Decrease'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className='flex justify-end'>
                  <button
                    onClick={handleUpdateSeats}
                    disabled={
                      updating || newTotalSeats === subscription.seats.total
                    }
                    className='rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
                  >
                    {updating ? 'Updating...' : 'Update Seats'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Billing Information */}
            <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
              <h3 className='mb-4 text-lg font-medium text-gray-900'>
                Billing Information
              </h3>
              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600'>Next Billing:</span>
                  <span className='text-sm font-medium'>
                    {new Date(
                      subscription.nextBillingDate
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600'>Billing Cycle:</span>
                  <span className='text-sm font-medium capitalize'>
                    {subscription.billingCycle}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600'>Payment Method:</span>
                  <span className='text-sm font-medium'>Square</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
              <h3 className='mb-4 text-lg font-medium text-gray-900'>
                Quick Actions
              </h3>
              <div className='space-y-2'>
                <button className='block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50'>
                  View Invoices
                </button>
                <button className='block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50'>
                  Payment History
                </button>
                <button className='block w-full rounded-lg border border-red-300 bg-white px-3 py-2 text-center text-sm font-medium text-red-700 transition-colors hover:bg-red-50'>
                  Cancel Subscription
                </button>
              </div>
            </div>

            {/* Usage Summary */}
            <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
              <h3 className='mb-4 text-lg font-medium text-gray-900'>
                Usage Summary
              </h3>
              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600'>Seats Used:</span>
                  <span className='text-sm font-medium'>
                    {subscription.seats.used}/{subscription.seats.total}
                  </span>
                </div>
                <div className='h-2 w-full rounded-full bg-gray-200'>
                  <div
                    className='h-2 rounded-full bg-blue-600'
                    style={{
                      width: `${(subscription.seats.used / subscription.seats.total) * 100}%`,
                    }}
                   />
                </div>
                <div className='text-center text-xs text-gray-500'>
                  {subscription.seats.available} seats available
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




