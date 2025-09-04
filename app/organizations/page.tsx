'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Organization {
  id: string;
  name: string;
  type: 'brokerage' | 'dispatch_agency' | 'carrier' | 'shipper';
  subscription: {
    plan: string;
    seats: {
      total: number;
      used: number;
      available: number;
    };
    billingCycle: 'monthly' | 'annual';
    price: number;
    nextBillingDate: Date;
  };
  role?: string;
}

export default function OrganizationsPage() {
  const { data: session } = useSession();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/organizations');
      const data = await response.json();

      if (data.success) {
        setOrganizations(data.organizations);
      } else {
        setError(data.error || 'Failed to fetch organizations');
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
      setError('Failed to fetch organizations');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'brokerage':
        return '🏢';
      case 'dispatch_agency':
        return '🚛';
      case 'carrier':
        return '📦';
      case 'shipper':
        return '🏭';
      default:
        return '🏢';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'brokerage':
        return 'Brokerage';
      case 'dispatch_agency':
        return 'Dispatch Agency';
      case 'carrier':
        return 'Carrier';
      case 'shipper':
        return 'Shipper';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='mt-4 text-gray-600'>Loading organizations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>
                My Organizations
              </h1>
              <p className='mt-2 text-gray-600'>
                Manage your organizations and team members
              </p>
            </div>
            <Link
              href='/organizations/create'
              className='rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700'
            >
              Create Organization
            </Link>
          </div>
        </div>

        {/* Error Message */}
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

        {/* Organizations Grid */}
        {organizations.length === 0 ? (
          <div className='py-12 text-center'>
            <div className='mx-auto h-24 w-24 text-gray-400'>
              <svg fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1}
                  d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                />
              </svg>
            </div>
            <h3 className='mt-4 text-lg font-medium text-gray-900'>
              No organizations yet
            </h3>
            <p className='mt-2 text-gray-500'>
              Get started by creating your first organization.
            </p>
            <div className='mt-6'>
              <Link
                href='/organizations/create'
                className='rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700'
              >
                Create Organization
              </Link>
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {organizations.map((org) => (
              <div
                key={org.id}
                className='rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md'
              >
                <div className='p-6'>
                  <div className='mb-4 flex items-center'>
                    <div className='mr-3 text-2xl'>{getTypeIcon(org.type)}</div>
                    <div className='flex-1'>
                      <h3 className='truncate text-lg font-semibold text-gray-900'>
                        {org.name}
                      </h3>
                      <p className='text-sm text-gray-500'>
                        {getTypeLabel(org.type)}
                      </p>
                    </div>
                  </div>

                  {/* Subscription Info */}
                  <div className='mb-4'>
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-gray-600'>Plan:</span>
                      <span className='font-medium'>
                        {org.subscription.plan}
                      </span>
                    </div>
                    <div className='mt-1 flex items-center justify-between text-sm'>
                      <span className='text-gray-600'>Seats:</span>
                      <span className='font-medium'>
                        {org.subscription.seats.used}/
                        {org.subscription.seats.total}
                      </span>
                    </div>
                  </div>

                  {/* Role Badge */}
                  {org.role && (
                    <div className='mb-4'>
                      <span className='inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800'>
                        {org.role}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className='flex space-x-2'>
                    <Link
                      href={`/organizations/${org.id}`}
                      className='flex-1 rounded-lg bg-gray-100 px-3 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200'
                    >
                      View
                    </Link>
                    <Link
                      href={`/organizations/${org.id}/settings`}
                      className='flex-1 rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700'
                    >
                      Settings
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


