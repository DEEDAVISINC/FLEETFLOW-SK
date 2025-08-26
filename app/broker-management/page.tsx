'use client';

import Link from 'next/link';
import { useState } from 'react';
import DispatcherAssignment from '../components/DispatcherAssignment';
import EnhancedLoadBoard from '../components/EnhancedLoadBoard';
import { getCurrentUser } from '../config/access';

export default function BrokerManagementPage() {
  const [selectedTab, setSelectedTab] = useState<
    'assignments' | 'loadboard' | 'performance'
  >('assignments');
  const { user, permissions } = getCurrentUser();

  if (!permissions.hasManagementAccess && user.role !== 'dispatcher') {
    return (
      <div
        style={{
          background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
          minHeight: '100vh',
          padding: '20px',
        }}
      >
        <div className='mx-auto mt-20 max-w-md rounded-lg bg-white p-6 shadow-lg'>
          <div className='text-center'>
            <div className='mb-4 text-6xl'>🔒</div>
            <h1 className='mb-2 text-2xl font-bold text-gray-900'>
              Access Restricted
            </h1>
            <p className='mb-4 text-gray-600'>
              This section is for managers, admins, and dispatchers only.
            </p>
            <Link
              href='/'
              className='rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700'
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
        minHeight: '100vh',
      }}
    >
      <div className='container mx-auto px-4 py-6'>
        {/* Header */}
        <div className='mb-6 rounded-lg bg-white/10 p-6 backdrop-blur-sm'>
          <h1 className='mb-2 text-3xl font-bold text-white'>
            🏢 Broker & Dispatcher Management
          </h1>
          <p className='text-white/90'>
            Manage dispatcher assignments and oversee load operations
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className='mb-6 rounded-lg bg-white/10 p-2 backdrop-blur-sm'>
          <nav className='flex space-x-2'>
            {[
              {
                id: 'assignments',
                label: 'Dispatcher Assignments',
                icon: '👥',
                access: permissions.canAssignDispatcher,
              },
              {
                id: 'loadboard',
                label: 'Load Board Overview',
                icon: '📋',
                access: true,
              },
              {
                id: 'performance',
                label: 'Performance Metrics',
                icon: '📊',
                access: permissions.hasAnalyticsAccess,
              },
            ]
              .filter((tab) => tab.access)
              .map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex items-center space-x-2 rounded-lg px-4 py-3 font-semibold transition-all duration-300 ${
                    selectedTab === tab.id
                      ? 'text-white shadow-lg'
                      : 'text-white hover:bg-white/20'
                  }`}
                  style={{
                    background:
                      selectedTab === tab.id
                        ? 'linear-gradient(135deg, #f97316, #ea580c)'
                        : 'transparent',
                  }}
                >
                  <span className='text-lg'>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
          </nav>
        </div>

        {/* Content */}
        <div className='space-y-6'>
          {selectedTab === 'assignments' && permissions.canAssignDispatcher && (
            <DispatcherAssignment />
          )}

          {selectedTab === 'loadboard' && <EnhancedLoadBoard />}

          {selectedTab === 'performance' && permissions.hasAnalyticsAccess && (
            <div className='rounded-lg bg-white p-6 shadow-lg'>
              <h2 className='mb-4 text-xl font-bold text-gray-900'>
                Performance Metrics
              </h2>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
                  <div className='mb-2 font-semibold text-blue-600'>
                    Load Completion Rate
                  </div>
                  <div className='text-3xl font-bold text-blue-800'>94.5%</div>
                  <div className='text-sm text-blue-600'>
                    ↑ 2.1% vs last month
                  </div>
                </div>
                <div className='rounded-lg border border-green-200 bg-green-50 p-4'>
                  <div className='mb-2 font-semibold text-green-600'>
                    Average Response Time
                  </div>
                  <div className='text-3xl font-bold text-green-800'>18min</div>
                  <div className='text-sm text-green-600'>
                    ↓ 12% vs last month
                  </div>
                </div>
                <div className='rounded-lg border border-purple-200 bg-purple-50 p-4'>
                  <div className='mb-2 font-semibold text-purple-600'>
                    Customer Satisfaction
                  </div>
                  <div className='text-3xl font-bold text-purple-800'>
                    4.7/5
                  </div>
                  <div className='text-sm text-purple-600'>
                    ↑ 0.2 vs last month
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className='mt-6 rounded-lg bg-white/10 p-4 backdrop-blur-sm'>
          <div className='text-sm text-white/90'>
            Logged in as:{' '}
            <span className='font-semibold text-white'>{user.name}</span>(
            {user.role}) • {user.email}
          </div>
        </div>
      </div>
    </div>
  );
}
