'use client';

import { useEffect, useState } from 'react';
import { useOrganization } from '../contexts/OrganizationContext';
import { OrganizationDataService } from '../services/MultiTenantDataService';
import { driverLoadBoardAccess } from '../services/driverLoadBoardAccess';
import { loadService } from '../services/loadService';
import { shipperService } from '../services/shipperService';

interface DashboardMetrics {
  organization: {
    name: string;
    type: string;
    role: string;
  };
  loads: {
    total: number;
    active: number;
    available: number;
    completed: number;
  };
  drivers: {
    total: number;
    available: number;
    active: number;
  };
  carriers: {
    total: number;
    active: number;
  };
  revenue: {
    total: number;
    monthly: number;
  };
  performance: {
    completionRate: number;
    activeLoadRatio: number;
  };
}

export default function OrganizationDashboard() {
  const { currentOrganization, userRole, userPermissions } = useOrganization();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentOrganization) {
      setLoading(false);
      return;
    }

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get all data sources
        const [allLoads, allDrivers, allCarriers] = await Promise.all([
          loadService.getAllLoads(),
          driverLoadBoardAccess.getAllDrivers(),
          shipperService.getAllShippers(),
        ]);

        // Get organization-specific metrics
        const dashboardMetrics =
          await OrganizationDataService.getOrganizationDashboardMetrics(
            allLoads,
            allDrivers,
            allCarriers
          );

        setMetrics(dashboardMetrics);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [currentOrganization]);

  if (!currentOrganization) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <h2 className='mb-4 text-2xl font-bold text-gray-900'>
            No Organization Selected
          </h2>
          <p className='mb-6 text-gray-600'>
            Please select an organization to view the dashboard.
          </p>
          <a
            href='/organizations'
            className='inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700'
          >
            Select Organization
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='mt-4 text-gray-600'>
            Loading organization dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-16 w-16 text-red-500'>
            <svg fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
          <h2 className='mb-2 text-xl font-semibold text-gray-900'>
            Error Loading Dashboard
          </h2>
          <p className='text-gray-600'>{error}</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <p className='text-gray-600'>No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>
                {metrics.organization.name} Dashboard
              </h1>
              <p className='mt-2 text-gray-600'>
                {metrics.organization.type.charAt(0).toUpperCase() +
                  metrics.organization.type.slice(1)}{' '}
                Organization • Your Role: {metrics.organization.role}
              </p>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800'>
                {currentOrganization.type}
              </span>
              <span className='rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800'>
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {/* Loads */}
          <div className='rounded-lg bg-white p-6 shadow'>
            <div className='flex items-center'>
              <div className='mr-4 rounded-full bg-blue-500 p-3'>
                <svg
                  className='h-6 w-6 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
                  />
                </svg>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-600'>Total Loads</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {metrics.loads.total}
                </p>
              </div>
            </div>
            <div className='mt-4 flex items-center justify-between text-sm'>
              <span className='text-green-600'>
                Active: {metrics.loads.active}
              </span>
              <span className='text-blue-600'>
                Available: {metrics.loads.available}
              </span>
            </div>
          </div>

          {/* Drivers */}
          <div className='rounded-lg bg-white p-6 shadow'>
            <div className='flex items-center'>
              <div className='mr-4 rounded-full bg-green-500 p-3'>
                <svg
                  className='h-6 w-6 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
                </svg>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-600'>Drivers</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {metrics.drivers.total}
                </p>
              </div>
            </div>
            <div className='mt-4 flex items-center justify-between text-sm'>
              <span className='text-green-600'>
                Available: {metrics.drivers.available}
              </span>
              <span className='text-blue-600'>
                Active: {metrics.drivers.active}
              </span>
            </div>
          </div>

          {/* Carriers */}
          <div className='rounded-lg bg-white p-6 shadow'>
            <div className='flex items-center'>
              <div className='mr-4 rounded-full bg-purple-500 p-3'>
                <svg
                  className='h-6 w-6 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 9l-7 7-7-7m14 0l-7 7m7-7v14a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h10a2 2 0 012 2z'
                  />
                </svg>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-600'>Carriers</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {metrics.carriers.total}
                </p>
              </div>
            </div>
            <div className='mt-4 flex items-center justify-between text-sm'>
              <span className='text-green-600'>
                Active: {metrics.carriers.active}
              </span>
            </div>
          </div>

          {/* Revenue */}
          <div className='rounded-lg bg-white p-6 shadow'>
            <div className='flex items-center'>
              <div className='mr-4 rounded-full bg-yellow-500 p-3'>
                <svg
                  className='h-6 w-6 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
                  />
                </svg>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-600'>Revenue</p>
                <p className='text-2xl font-bold text-gray-900'>
                  ${metrics.revenue.total.toLocaleString()}
                </p>
              </div>
            </div>
            <div className='mt-4 flex items-center justify-between text-sm'>
              <span className='text-blue-600'>
                This Month: ${metrics.revenue.monthly.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2'>
          {/* Load Status Breakdown */}
          <div className='rounded-lg bg-white p-6 shadow'>
            <h3 className='mb-4 text-lg font-semibold text-gray-900'>
              Load Status
            </h3>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-gray-600'>Available</span>
                <div className='flex items-center'>
                  <div className='mr-2 h-2 w-20 rounded-full bg-gray-200'>
                    <div
                      className='h-2 rounded-full bg-blue-500'
                      style={{
                        width: `${metrics.loads.total > 0 ? (metrics.loads.available / metrics.loads.total) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <span className='text-sm font-medium text-gray-900'>
                    {metrics.loads.available}
                  </span>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <span className='text-gray-600'>Active</span>
                <div className='flex items-center'>
                  <div className='mr-2 h-2 w-20 rounded-full bg-gray-200'>
                    <div
                      className='h-2 rounded-full bg-green-500'
                      style={{
                        width: `${metrics.loads.total > 0 ? (metrics.loads.active / metrics.loads.total) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <span className='text-sm font-medium text-gray-900'>
                    {metrics.loads.active}
                  </span>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <span className='text-gray-600'>Completed</span>
                <div className='flex items-center'>
                  <div className='mr-2 h-2 w-20 rounded-full bg-gray-200'>
                    <div
                      className='h-2 rounded-full bg-purple-500'
                      style={{
                        width: `${metrics.loads.total > 0 ? (metrics.loads.completed / metrics.loads.total) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <span className='text-sm font-medium text-gray-900'>
                    {metrics.loads.completed}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Indicators */}
          <div className='rounded-lg bg-white p-6 shadow'>
            <h3 className='mb-4 text-lg font-semibold text-gray-900'>
              Performance
            </h3>
            <div className='space-y-4'>
              <div>
                <div className='mb-2 flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>Completion Rate</span>
                  <span className='text-sm font-medium text-gray-900'>
                    {metrics.performance.completionRate.toFixed(1)}%
                  </span>
                </div>
                <div className='h-2 w-full rounded-full bg-gray-200'>
                  <div
                    className='h-2 rounded-full bg-green-500'
                    style={{
                      width: `${Math.min(metrics.performance.completionRate, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className='mb-2 flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>
                    Active Load Ratio
                  </span>
                  <span className='text-sm font-medium text-gray-900'>
                    {metrics.performance.activeLoadRatio.toFixed(1)}%
                  </span>
                </div>
                <div className='h-2 w-full rounded-full bg-gray-200'>
                  <div
                    className='h-2 rounded-full bg-blue-500'
                    style={{
                      width: `${Math.min(metrics.performance.activeLoadRatio, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className='border-t border-gray-200 pt-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>
                    Fleet Utilization
                  </span>
                  <span className='text-sm font-medium text-gray-900'>
                    {metrics.drivers.total > 0
                      ? (
                          (metrics.drivers.active / metrics.drivers.total) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Organization Info */}
        <div className='rounded-lg bg-white p-6 shadow'>
          <h3 className='mb-4 text-lg font-semibold text-gray-900'>
            Organization Overview
          </h3>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div>
              <p className='text-sm text-gray-600'>Organization Type</p>
              <p className='text-lg font-medium text-gray-900 capitalize'>
                {metrics.organization.type}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Your Role</p>
              <p className='text-lg font-medium text-gray-900 capitalize'>
                {metrics.organization.role}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Organization ID</p>
              <p className='font-mono text-lg text-sm font-medium text-gray-900'>
                {currentOrganization.id.slice(0, 8)}...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


