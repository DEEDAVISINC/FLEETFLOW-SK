'use client';

import Link from 'next/link';
import { PermissionGate } from '../components/PermissionGate';
import ProtectedRoute, {
  AdminOnly,
  OwnerOnly,
  WithPermission,
} from '../components/ProtectedRoute';
import {
  useOrganization,
  usePermissions,
  useRole,
} from '../contexts/OrganizationContext';

export default function ProtectedDashboardPage() {
  const { currentOrganization } = useOrganization();
  const { hasPermission } = usePermissions();
  const { isOwner, isAdmin, isAgent, role } = useRole();

  if (!currentOrganization) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold text-gray-900'>
            No Organization Selected
          </h2>
          <p className='mt-2 text-gray-600'>
            Please select an organization to view the dashboard.
          </p>
          <Link
            href='/organizations'
            className='mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700'
          >
            Select Organization
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute organizationRequired={true}>
      <div className='min-h-screen bg-gray-50'>
        <div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
          {/* Header */}
          <div className='mb-8'>
            <div className='flex items-center justify-between'>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>
                  Protected Dashboard
                </h1>
                <p className='mt-2 text-gray-600'>
                  Role-based access control demonstration for{' '}
                  <span className='font-medium text-blue-600'>
                    {currentOrganization.name}
                  </span>
                </p>
                <div className='mt-2 flex items-center space-x-4'>
                  <span className='rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800'>
                    Your Role: {role}
                  </span>
                  <span className='rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800'>
                    Organization: {currentOrganization.type}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Role-based Content Sections */}
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            {/* Basic Access Section - Everyone can see this */}
            <div className='rounded-lg border border-green-200 bg-green-50 p-6'>
              <div className='mb-4 flex items-center'>
                <div className='mr-3 rounded-full bg-green-500 p-2'>
                  <svg
                    className='h-5 w-5 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
                <h2 className='text-lg font-semibold text-green-900'>
                  Public Access
                </h2>
              </div>
              <p className='mb-4 text-green-800'>
                This section is visible to all authenticated users in the
                organization.
              </p>
              <div className='space-y-2'>
                <div className='text-sm text-green-700'>
                  ✓ View organization details
                </div>
                <div className='text-sm text-green-700'>
                  ✓ Access basic features
                </div>
                <div className='text-sm text-green-700'>
                  ✓ View public information
                </div>
              </div>
            </div>

            {/* Agent+ Access Section */}
            <div className='rounded-lg border border-blue-200 bg-blue-50 p-6'>
              <div className='mb-4 flex items-center'>
                <div className='mr-3 rounded-full bg-blue-500 p-2'>
                  <svg
                    className='h-5 w-5 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <h2 className='text-lg font-semibold text-blue-900'>
                  Agent Access
                </h2>
              </div>

              <WithPermission
                permission='create_loads'
                fallback={
                  <p className='text-blue-800'>
                    This section requires agent-level permissions or higher.
                  </p>
                }
              >
                <p className='mb-4 text-blue-800'>
                  This section is visible to agents, admins, and owners.
                </p>
                <div className='space-y-2'>
                  <div className='text-sm text-blue-700'>
                    ✓ Create and manage loads
                  </div>
                  <div className='text-sm text-blue-700'>
                    ✓ Edit load assignments
                  </div>
                  <div className='text-sm text-blue-700'>
                    ✓ Access operational tools
                  </div>
                </div>
              </WithPermission>
            </div>

            {/* Admin+ Access Section */}
            <AdminOnly
              fallback={
                <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-6'>
                  <div className='mb-4 flex items-center'>
                    <div className='mr-3 rounded-full bg-yellow-500 p-2'>
                      <svg
                        className='h-5 w-5 text-white'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                        />
                      </svg>
                    </div>
                    <h2 className='text-lg font-semibold text-yellow-900'>
                      Admin Access Required
                    </h2>
                  </div>
                  <p className='text-yellow-800'>
                    This section is only visible to administrators and owners.
                  </p>
                </div>
              }
            >
              <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-6'>
                <div className='mb-4 flex items-center'>
                  <div className='mr-3 rounded-full bg-yellow-500 p-2'>
                    <svg
                      className='h-5 w-5 text-white'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                      />
                    </svg>
                  </div>
                  <h2 className='text-lg font-semibold text-yellow-900'>
                    Admin Access
                  </h2>
                </div>
                <p className='mb-4 text-yellow-800'>
                  This section is visible to administrators and owners.
                </p>
                <div className='space-y-2'>
                  <div className='text-sm text-yellow-700'>
                    ✓ Manage organization settings
                  </div>
                  <div className='text-sm text-yellow-700'>
                    ✓ Invite new team members
                  </div>
                  <div className='text-sm text-yellow-700'>
                    ✓ Configure system preferences
                  </div>
                </div>
              </div>
            </AdminOnly>

            {/* Owner-Only Access Section */}
            <OwnerOnly
              fallback={
                <div className='rounded-lg border border-red-200 bg-red-50 p-6'>
                  <div className='mb-4 flex items-center'>
                    <div className='mr-3 rounded-full bg-red-500 p-2'>
                      <svg
                        className='h-5 w-5 text-white'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V9z'
                        />
                      </svg>
                    </div>
                    <h2 className='text-lg font-semibold text-red-900'>
                      Owner Access Required
                    </h2>
                  </div>
                  <p className='text-red-800'>
                    This section is only visible to organization owners.
                  </p>
                </div>
              }
            >
              <div className='rounded-lg border border-red-200 bg-red-50 p-6'>
                <div className='mb-4 flex items-center'>
                  <div className='mr-3 rounded-full bg-red-500 p-2'>
                    <svg
                      className='h-5 w-5 text-white'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V9z'
                      />
                    </svg>
                  </div>
                  <h2 className='text-lg font-semibold text-red-900'>
                    Owner Access
                  </h2>
                </div>
                <p className='mb-4 text-red-800'>
                  This section is only visible to organization owners.
                </p>
                <div className='space-y-2'>
                  <div className='text-sm text-red-700'>
                    ⚠️ Delete organization
                  </div>
                  <div className='text-sm text-red-700'>
                    ⚠️ Transfer ownership
                  </div>
                  <div className='text-sm text-red-700'>
                    ⚠️ Cancel subscription
                  </div>
                </div>
              </div>
            </OwnerOnly>
          </div>

          {/* Permission-based Actions */}
          <div className='mt-8'>
            <h2 className='mb-4 text-xl font-semibold text-gray-900'>
              Available Actions
            </h2>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
              {/* Load Management */}
              <PermissionGate
                permission='view_loads'
                fallback={
                  <div className='rounded-lg border border-gray-200 bg-gray-50 p-4 text-center'>
                    <p className='text-sm text-gray-500'>Load Management</p>
                    <p className='text-xs text-gray-400'>Access Restricted</p>
                  </div>
                }
              >
                <div className='rounded-lg border border-blue-200 bg-blue-50 p-4 text-center transition-colors hover:bg-blue-100'>
                  <p className='text-sm font-medium text-blue-900'>
                    Load Management
                  </p>
                  <p className='text-xs text-blue-700'>View & Manage Loads</p>
                </div>
              </PermissionGate>

              {/* User Management */}
              <PermissionGate
                permission='manage_users'
                fallback={
                  <div className='rounded-lg border border-gray-200 bg-gray-50 p-4 text-center'>
                    <p className='text-sm text-gray-500'>User Management</p>
                    <p className='text-xs text-gray-400'>Access Restricted</p>
                  </div>
                }
              >
                <Link
                  href={`/organizations/${currentOrganization.id}/members`}
                  className='block rounded-lg border border-green-200 bg-green-50 p-4 text-center transition-colors hover:bg-green-100'
                >
                  <p className='text-sm font-medium text-green-900'>
                    User Management
                  </p>
                  <p className='text-xs text-green-700'>Invite & Manage Team</p>
                </Link>
              </PermissionGate>

              {/* Financial Management */}
              <PermissionGate
                permission='view_financials'
                fallback={
                  <div className='rounded-lg border border-gray-200 bg-gray-50 p-4 text-center'>
                    <p className='text-sm text-gray-500'>Financials</p>
                    <p className='text-xs text-gray-400'>Access Restricted</p>
                  </div>
                }
              >
                <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center transition-colors hover:bg-yellow-100'>
                  <p className='text-sm font-medium text-yellow-900'>
                    Financials
                  </p>
                  <p className='text-xs text-yellow-700'>Invoices & Payments</p>
                </div>
              </PermissionGate>

              {/* Organization Settings */}
              <PermissionGate
                permission='manage_organization'
                fallback={
                  <div className='rounded-lg border border-gray-200 bg-gray-50 p-4 text-center'>
                    <p className='text-sm text-gray-500'>Settings</p>
                    <p className='text-xs text-gray-400'>Access Restricted</p>
                  </div>
                }
              >
                <Link
                  href={`/organizations/${currentOrganization.id}/settings`}
                  className='block rounded-lg border border-purple-200 bg-purple-50 p-4 text-center transition-colors hover:bg-purple-100'
                >
                  <p className='text-sm font-medium text-purple-900'>
                    Settings
                  </p>
                  <p className='text-xs text-purple-700'>Organization Config</p>
                </Link>
              </PermissionGate>
            </div>
          </div>

          {/* Role Hierarchy Information */}
          <div className='mt-8 rounded-lg border border-gray-200 bg-white p-6'>
            <h2 className='mb-4 text-xl font-semibold text-gray-900'>
              Role Hierarchy
            </h2>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-5'>
              <div
                className={`rounded-lg border p-4 text-center ${
                  role === 'staff'
                    ? 'border-gray-500 bg-gray-100'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className='mb-2 text-2xl'>👤</div>
                <div className='font-medium text-gray-900'>Staff</div>
                <div className='text-xs text-gray-600'>Basic Access</div>
                {role === 'staff' && (
                  <div className='mt-2 rounded bg-gray-500 px-2 py-1 text-xs text-white'>
                    Your Role
                  </div>
                )}
              </div>

              <div
                className={`rounded-lg border p-4 text-center ${
                  role === 'dispatcher'
                    ? 'border-blue-500 bg-blue-100'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className='mb-2 text-2xl'>🚛</div>
                <div className='font-medium text-gray-900'>Dispatcher</div>
                <div className='text-xs text-gray-600'>Operations</div>
                {role === 'dispatcher' && (
                  <div className='mt-2 rounded bg-blue-500 px-2 py-1 text-xs text-white'>
                    Your Role
                  </div>
                )}
              </div>

              <div
                className={`rounded-lg border p-4 text-center ${
                  role === 'agent'
                    ? 'border-green-500 bg-green-100'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className='mb-2 text-2xl'>💼</div>
                <div className='font-medium text-gray-900'>Agent</div>
                <div className='text-xs text-gray-600'>Business Ops</div>
                {role === 'agent' && (
                  <div className='mt-2 rounded bg-green-500 px-2 py-1 text-xs text-white'>
                    Your Role
                  </div>
                )}
              </div>

              <div
                className={`rounded-lg border p-4 text-center ${
                  role === 'admin'
                    ? 'border-yellow-500 bg-yellow-100'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className='mb-2 text-2xl'>⚙️</div>
                <div className='font-medium text-gray-900'>Admin</div>
                <div className='text-xs text-gray-600'>Management</div>
                {role === 'admin' && (
                  <div className='mt-2 rounded bg-yellow-500 px-2 py-1 text-xs text-white'>
                    Your Role
                  </div>
                )}
              </div>

              <div
                className={`rounded-lg border p-4 text-center ${
                  role === 'owner'
                    ? 'border-red-500 bg-red-100'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className='mb-2 text-2xl'>👑</div>
                <div className='font-medium text-gray-900'>Owner</div>
                <div className='text-xs text-gray-600'>Full Control</div>
                {role === 'owner' && (
                  <div className='mt-2 rounded bg-red-500 px-2 py-1 text-xs text-white'>
                    Your Role
                  </div>
                )}
              </div>
            </div>

            <div className='mt-4 text-center'>
              <p className='text-sm text-gray-600'>
                Each role includes all permissions from the roles below it in
                the hierarchy.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className='mt-8 flex justify-center'>
            <Link
              href='/organizations'
              className='rounded-lg bg-gray-600 px-6 py-2 font-medium text-white hover:bg-gray-700'
            >
              ← Back to Organizations
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

