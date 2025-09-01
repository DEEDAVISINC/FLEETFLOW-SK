'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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
    nextBillingDate: string;
  };
  billing: {
    contactName: string;
    contactEmail: string;
    squareCustomerId: string;
  };
  mcNumber?: string;
  dispatchFeePercentage?: number;
  createdAt: string;
  updatedAt: string;
}

interface OrganizationUser {
  id: string;
  userId: string;
  organizationId: string;
  role: 'owner' | 'admin' | 'agent' | 'dispatcher' | 'staff';
  permissions: string[];
  active: boolean;
  invitedAt: string;
  joinedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrganizationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<OrganizationUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (params.id) {
      fetchOrganizationData();
    }
  }, [params.id]);

  const fetchOrganizationData = async () => {
    try {
      setLoading(true);

      // Fetch organization details
      const orgResponse = await fetch(`/api/organizations/${params.id}`);
      const orgData = await orgResponse.json();

      if (!orgData.success) {
        setError(orgData.error || 'Failed to fetch organization');
        return;
      }

      setOrganization(orgData.organization);

      // Fetch organization members
      const membersResponse = await fetch(
        `/api/organizations/${params.id}/members`
      );
      const membersData = await membersResponse.json();

      if (membersData.success) {
        setMembers(membersData.members);
      }
    } catch (error) {
      console.error('Error fetching organization data:', error);
      setError('Failed to fetch organization data');
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

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner':
        return 'Owner';
      case 'admin':
        return 'Administrator';
      case 'agent':
        return 'Agent';
      case 'dispatcher':
        return 'Dispatcher';
      case 'staff':
        return 'Staff';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'agent':
        return 'bg-blue-100 text-blue-800';
      case 'dispatcher':
        return 'bg-green-100 text-green-800';
      case 'staff':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='mt-4 text-gray-600'>Loading organization...</p>
        </div>
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='mb-4 text-red-600'>
            {error || 'Organization not found'}
          </div>
          <Link
            href='/organizations'
            className='text-blue-600 hover:text-blue-800'
          >
            ← Back to Organizations
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', current: activeTab === 'overview' },
    { id: 'members', name: 'Members', current: activeTab === 'members' },
    {
      id: 'subscription',
      name: 'Subscription',
      current: activeTab === 'subscription',
    },
    { id: 'settings', name: 'Settings', current: activeTab === 'settings' },
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <Link
                href='/organizations'
                className='mr-4 text-gray-500 hover:text-gray-700'
              >
                ← Back to Organizations
              </Link>
              <div className='flex items-center'>
                <div className='mr-3 text-3xl'>
                  {getTypeIcon(organization.type)}
                </div>
                <div>
                  <h1 className='text-3xl font-bold text-gray-900'>
                    {organization.name}
                  </h1>
                  <p className='text-gray-600'>
                    {getTypeLabel(organization.type)}
                  </p>
                </div>
              </div>
            </div>
            <div className='flex space-x-3'>
              <Link
                href={`/organizations/${organization.id}/settings`}
                className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50'
              >
                Settings
              </Link>
              <Link
                href={`/organizations/${organization.id}/subscription`}
                className='rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'
              >
                Manage Subscription
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className='mb-6'>
          <nav className='flex space-x-8' aria-label='Tabs'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`border-b-2 px-1 py-2 text-sm font-medium ${
                  tab.current
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
            {/* Main Content */}
            <div className='space-y-6 lg:col-span-2'>
              {/* Organization Info */}
              <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
                <h2 className='mb-4 text-xl font-semibold text-gray-900'>
                  Organization Details
                </h2>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div>
                    <dt className='text-sm font-medium text-gray-500'>Name</dt>
                    <dd className='mt-1 text-sm text-gray-900'>
                      {organization.name}
                    </dd>
                  </div>
                  <div>
                    <dt className='text-sm font-medium text-gray-500'>Type</dt>
                    <dd className='mt-1 text-sm text-gray-900'>
                      {getTypeLabel(organization.type)}
                    </dd>
                  </div>
                  <div>
                    <dt className='text-sm font-medium text-gray-500'>
                      Created
                    </dt>
                    <dd className='mt-1 text-sm text-gray-900'>
                      {new Date(organization.createdAt).toLocaleDateString()}
                    </dd>
                  </div>
                  <div>
                    <dt className='text-sm font-medium text-gray-500'>
                      Last Updated
                    </dt>
                    <dd className='mt-1 text-sm text-gray-900'>
                      {new Date(organization.updatedAt).toLocaleDateString()}
                    </dd>
                  </div>
                  {organization.mcNumber && (
                    <div>
                      <dt className='text-sm font-medium text-gray-500'>
                        MC Number
                      </dt>
                      <dd className='mt-1 text-sm text-gray-900'>
                        {organization.mcNumber}
                      </dd>
                    </div>
                  )}
                  {organization.dispatchFeePercentage && (
                    <div>
                      <dt className='text-sm font-medium text-gray-500'>
                        Dispatch Fee
                      </dt>
                      <dd className='mt-1 text-sm text-gray-900'>
                        {organization.dispatchFeePercentage}%
                      </dd>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
                <h2 className='mb-4 text-xl font-semibold text-gray-900'>
                  Recent Activity
                </h2>
                <div className='py-8 text-center text-gray-500'>
                  <p>Activity tracking coming soon...</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className='space-y-6'>
              {/* Subscription Status */}
              <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
                <h3 className='mb-4 text-lg font-medium text-gray-900'>
                  Subscription
                </h3>
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-sm text-gray-600'>Plan:</span>
                    <span className='text-sm font-medium'>
                      {organization.subscription.plan}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-gray-600'>Seats:</span>
                    <span className='text-sm font-medium'>
                      {organization.subscription.seats.used}/
                      {organization.subscription.seats.total}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-gray-600'>Billing:</span>
                    <span className='text-sm font-medium capitalize'>
                      {organization.subscription.billingCycle}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-gray-600'>Next Billing:</span>
                    <span className='text-sm font-medium'>
                      {new Date(
                        organization.subscription.nextBillingDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className='mt-4'>
                  <Link
                    href={`/organizations/${organization.id}/subscription`}
                    className='block w-full rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700'
                  >
                    Manage Subscription
                  </Link>
                </div>
              </div>

              {/* Quick Actions */}
              <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
                <h3 className='mb-4 text-lg font-medium text-gray-900'>
                  Quick Actions
                </h3>
                <div className='space-y-2'>
                  <Link
                    href={`/organizations/${organization.id}/members`}
                    className='block w-full rounded-lg bg-gray-100 px-3 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200'
                  >
                    Manage Members
                  </Link>
                  <Link
                    href={`/organizations/${organization.id}/settings`}
                    className='block w-full rounded-lg bg-gray-100 px-3 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200'
                  >
                    Organization Settings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className='rounded-lg border border-gray-200 bg-white shadow-sm'>
            <div className='border-b border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <h2 className='text-xl font-semibold text-gray-900'>
                  Team Members
                </h2>
                <Link
                  href={`/organizations/${organization.id}/members`}
                  className='rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'
                >
                  Manage Members
                </Link>
              </div>
            </div>
            <div className='p-6'>
              {members.length === 0 ? (
                <div className='py-8 text-center text-gray-500'>
                  <p>No members yet</p>
                </div>
              ) : (
                <div className='space-y-4'>
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className='flex items-center justify-between rounded-lg border border-gray-200 p-4'
                    >
                      <div className='flex items-center'>
                        <div className='mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200'>
                          👤
                        </div>
                        <div>
                          <p className='font-medium text-gray-900'>
                            User {member.userId.slice(0, 8)}
                          </p>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleColor(member.role)}`}
                          >
                            {getRoleLabel(member.role)}
                          </span>
                        </div>
                      </div>
                      <div className='text-sm text-gray-500'>
                        Joined{' '}
                        {member.joinedAt
                          ? new Date(member.joinedAt).toLocaleDateString()
                          : 'Pending'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Other tabs will be implemented in separate components */}
        {activeTab === 'subscription' && (
          <div className='py-12 text-center text-gray-500'>
            <p>Subscription management coming soon...</p>
            <Link
              href={`/organizations/${organization.id}/subscription`}
              className='text-blue-600 hover:text-blue-800'
            >
              Go to Subscription Page →
            </Link>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className='py-12 text-center text-gray-500'>
            <p>Organization settings coming soon...</p>
            <Link
              href={`/organizations/${organization.id}/settings`}
              className='text-blue-600 hover:text-blue-800'
            >
              Go to Settings Page →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

