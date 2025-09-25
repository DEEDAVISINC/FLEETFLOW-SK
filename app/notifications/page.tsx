'use client';

import { BarChart3, Bell, Settings, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { EnhancedNotificationHub } from '../components/EnhancedNotificationHub';
import NotificationPreferences from '../components/NotificationPreferences';
import { getCurrentUser } from '../config/access';

// Force dynamic rendering - no static generation
export const dynamic = 'force-dynamic';

export default function NotificationsHub() {
  const [showPreferences, setShowPreferences] = useState(false);
  const { user } = getCurrentUser();

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #fef3c7, #fbbf24)',
        minHeight: '100vh',
        padding: '80px 20px 20px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {/* Page Header */}
        <div className='mb-8'>
          <div className='mb-6 flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='bg-opacity-20 flex h-12 w-12 items-center justify-center rounded-xl bg-white'>
                <Bell className='h-6 w-6 text-gray-800' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>
                  Notification Center
                </h1>
                <p className='text-lg text-gray-700'>
                  Stay informed with real-time updates and alerts
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPreferences(true)}
              className='bg-opacity-20 hover:bg-opacity-30 flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-medium text-gray-800 transition-colors'
            >
              <Settings className='h-5 w-5' />
              Preferences
            </button>
          </div>

          {/* Stats Cards */}
          <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-3'>
            <div className='bg-opacity-60 border-opacity-20 rounded-xl border border-white bg-white p-6 backdrop-blur-sm'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Active Alerts
                  </p>
                  <p className='mt-1 text-2xl font-bold text-gray-900'>12</p>
                </div>
                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-red-100'>
                  <Bell className='h-6 w-6 text-red-600' />
                </div>
              </div>
              <div className='mt-4 flex items-center gap-1'>
                <TrendingUp className='h-4 w-4 text-green-600' />
                <span className='text-sm font-medium text-green-600'>
                  3 new today
                </span>
              </div>
            </div>

            <div className='bg-opacity-60 border-opacity-20 rounded-xl border border-white bg-white p-6 backdrop-blur-sm'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    High Priority
                  </p>
                  <p className='mt-1 text-2xl font-bold text-gray-900'>4</p>
                </div>
                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100'>
                  <BarChart3 className='h-6 w-6 text-orange-600' />
                </div>
              </div>
              <div className='mt-4 flex items-center gap-1'>
                <TrendingUp className='h-4 w-4 text-red-600' />
                <span className='text-sm font-medium text-red-600'>
                  2 urgent
                </span>
              </div>
            </div>

            <div className='bg-opacity-60 border-opacity-20 rounded-xl border border-white bg-white p-6 backdrop-blur-sm'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>This Week</p>
                  <p className='mt-1 text-2xl font-bold text-gray-900'>47</p>
                </div>
                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100'>
                  <TrendingUp className='h-6 w-6 text-blue-600' />
                </div>
              </div>
              <div className='mt-4 flex items-center gap-1'>
                <TrendingUp className='h-4 w-4 text-blue-600' />
                <span className='text-sm font-medium text-blue-600'>
                  18% increase
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Notification Hub */}
        <div className='bg-opacity-60 border-opacity-20 overflow-hidden rounded-xl border border-white bg-white backdrop-blur-sm'>
          <EnhancedNotificationHub
            userId={user.id}
            maxHeight='70vh'
            showHeader={false}
          />
        </div>

        {/* Additional Information */}
        <div className='mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2'>
          <div className='bg-opacity-60 border-opacity-20 rounded-xl border border-white bg-white p-6 backdrop-blur-sm'>
            <h3 className='mb-4 text-lg font-semibold text-gray-900'>
              Notification Types
            </h3>
            <div className='space-y-3'>
              {[
                {
                  type: 'System',
                  color: 'bg-gray-500',
                  desc: 'Platform updates and maintenance',
                },
                {
                  type: 'Shipment',
                  color: 'bg-green-500',
                  desc: 'Load status and delivery updates',
                },
                {
                  type: 'Compliance',
                  color: 'bg-red-500',
                  desc: 'DOT and regulatory alerts',
                },
                {
                  type: 'Billing',
                  color: 'bg-purple-500',
                  desc: 'Invoice and payment notifications',
                },
                {
                  type: 'Maintenance',
                  color: 'bg-orange-500',
                  desc: 'Vehicle service alerts',
                },
              ].map((item, index) => (
                <div key={index} className='flex items-center gap-3'>
                  <div className={`h-4 w-4 ${item.color} rounded-full`} />
                  <div>
                    <span className='font-medium text-gray-900'>
                      {item.type}
                    </span>
                    <span className='ml-2 text-sm text-gray-600'>
                      {item.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='bg-opacity-60 border-opacity-20 rounded-xl border border-white bg-white p-6 backdrop-blur-sm'>
            <h3 className='mb-4 text-lg font-semibold text-gray-900'>
              Quick Actions
            </h3>
            <div className='space-y-3'>
              {[
                {
                  action: 'Mark All Read',
                  desc: 'Clear all unread notifications',
                  icon: '✓',
                },
                {
                  action: 'Filter by Priority',
                  desc: 'Show only high-priority alerts',
                  icon: '⚠️',
                },
                {
                  action: 'Export Report',
                  desc: 'Download notification history',
                  icon: '📊',
                },
                {
                  action: 'Manage Preferences',
                  desc: 'Customize notification settings',
                  icon: '⚙️',
                },
                {
                  action: 'Real-time Alerts',
                  desc: 'Enable desktop notifications',
                  icon: '🔔',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className='hover:bg-opacity-50 flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-white'
                >
                  <span className='text-lg'>{item.icon}</span>
                  <div>
                    <span className='block font-medium text-gray-900'>
                      {item.action}
                    </span>
                    <span className='text-sm text-gray-600'>{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Modal */}
      {showPreferences && (
        <NotificationPreferences
          userId={user.id}
          onClose={() => setShowPreferences(false)}
        />
      )}

      {/* Styles */}
      <style jsx global>{`
        body {
          margin: 0;
          font-family:
            -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            'Helvetica Neue', Arial, sans-serif;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
