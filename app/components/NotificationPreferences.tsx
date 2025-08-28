/**
 * Notification Preferences Component
 * Allows users to customize their notification settings
 */

'use client';

import {
  Bell,
  CheckCircle,
  Mail,
  MessageSquare,
  Save,
  Settings,
  X,
} from 'lucide-react';
import React, { useState } from 'react';

interface NotificationPreferencesProps {
  userId: string;
  onClose?: () => void;
}

export const NotificationPreferences: React.FC<
  NotificationPreferencesProps
> = ({ userId, onClose }) => {
  const [preferences, setPreferences] = useState({
    enableNotifications: true,
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    channels: {
      'in-app': true,
      email: true,
      sms: false,
      push: true,
    },
    types: {
      system: true,
      shipment: true,
      compliance: true,
      billing: true,
      maintenance: true,
    },
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    localStorage.setItem(
      `notification-preferences-${userId}`,
      JSON.stringify(preferences)
    );
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const updatePreference = (section: string, key: string, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [section]:
        typeof prev[section as keyof typeof prev] === 'object'
          ? { ...(prev[section as keyof typeof prev] as any), [key]: value }
          : value,
    }));
  };

  return (
    <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4'>
      <div className='max-h-[90vh] w-full max-w-2xl overflow-auto rounded-lg bg-white shadow-2xl'>
        {/* Header */}
        <div className='sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white p-6'>
          <div className='flex items-center gap-3'>
            <Settings className='h-6 w-6 text-gray-700' />
            <div>
              <h2 className='text-xl font-semibold text-gray-900'>
                Notification Preferences
              </h2>
              <p className='text-sm text-gray-600'>
                Customize when and how you receive notifications
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className='rounded-lg p-2 text-gray-400 transition-colors hover:text-gray-600'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        {/* Content */}
        <div className='space-y-6 p-6'>
          {/* Success Message */}
          {success && (
            <div className='flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4'>
              <CheckCircle className='h-5 w-5 text-green-600' />
              <span className='text-green-800'>
                Preferences saved successfully!
              </span>
            </div>
          )}

          {/* Global Settings */}
          <div className='rounded-lg bg-gray-50 p-6'>
            <h3 className='mb-4 text-lg font-medium text-gray-900'>
              Global Settings
            </h3>

            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <label className='text-sm font-medium text-gray-700'>
                    Enable Notifications
                  </label>
                  <p className='text-sm text-gray-600'>
                    Receive notifications from FleetFlow
                  </p>
                </div>
                <input
                  type='checkbox'
                  checked={preferences.enableNotifications}
                  onChange={(e) =>
                    updatePreference(
                      'root',
                      'enableNotifications',
                      e.target.checked
                    )
                  }
                  className='h-4 w-4 rounded text-blue-600 focus:ring-blue-500'
                />
              </div>

              <div className='flex items-center justify-between'>
                <div>
                  <label className='text-sm font-medium text-gray-700'>
                    Quiet Hours
                  </label>
                  <p className='text-sm text-gray-600'>
                    Limit notifications during specified hours
                  </p>
                </div>
                <input
                  type='checkbox'
                  checked={preferences.quietHoursEnabled}
                  onChange={(e) =>
                    updatePreference(
                      'root',
                      'quietHoursEnabled',
                      e.target.checked
                    )
                  }
                  className='h-4 w-4 rounded text-blue-600 focus:ring-blue-500'
                />
              </div>

              {preferences.quietHoursEnabled && (
                <div className='ml-4 grid grid-cols-2 gap-4'>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                      Start Time
                    </label>
                    <input
                      type='time'
                      value={preferences.quietHoursStart}
                      onChange={(e) =>
                        updatePreference(
                          'root',
                          'quietHoursStart',
                          e.target.value
                        )
                      }
                      className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm'
                    />
                  </div>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                      End Time
                    </label>
                    <input
                      type='time'
                      value={preferences.quietHoursEnd}
                      onChange={(e) =>
                        updatePreference(
                          'root',
                          'quietHoursEnd',
                          e.target.value
                        )
                      }
                      className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm'
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notification Channels */}
          <div>
            <h3 className='mb-4 text-lg font-medium text-gray-900'>
              Notification Channels
            </h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {[
                {
                  key: 'in-app',
                  label: 'In-App',
                  icon: <Bell className='h-4 w-4' />,
                },
                {
                  key: 'email',
                  label: 'Email',
                  icon: <Mail className='h-4 w-4' />,
                },
                {
                  key: 'sms',
                  label: 'SMS',
                  icon: <MessageSquare className='h-4 w-4' />,
                },
                {
                  key: 'push',
                  label: 'Push',
                  icon: <Bell className='h-4 w-4' />,
                },
              ].map((channel) => (
                <div
                  key={channel.key}
                  className='rounded-lg border border-gray-200 p-4'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      {channel.icon}
                      <span className='font-medium text-gray-900'>
                        {channel.label}
                      </span>
                    </div>
                    <input
                      type='checkbox'
                      checked={
                        preferences.channels[
                          channel.key as keyof typeof preferences.channels
                        ]
                      }
                      onChange={(e) =>
                        updatePreference(
                          'channels',
                          channel.key,
                          e.target.checked
                        )
                      }
                      className='h-4 w-4 rounded text-blue-600 focus:ring-blue-500'
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notification Types */}
          <div>
            <h3 className='mb-4 text-lg font-medium text-gray-900'>
              Notification Types
            </h3>
            <div className='space-y-3'>
              {[
                {
                  key: 'system',
                  label: 'System',
                  desc: 'System maintenance and updates',
                },
                {
                  key: 'shipment',
                  label: 'Shipment',
                  desc: 'Load deliveries and status changes',
                },
                {
                  key: 'compliance',
                  label: 'Compliance',
                  desc: 'DOT and regulatory alerts',
                },
                {
                  key: 'billing',
                  label: 'Billing',
                  desc: 'Invoice and payment notifications',
                },
                {
                  key: 'maintenance',
                  label: 'Maintenance',
                  desc: 'Vehicle service alerts',
                },
              ].map((type) => (
                <div
                  key={type.key}
                  className='flex items-center justify-between rounded-lg border border-gray-200 p-4'
                >
                  <div>
                    <h4 className='font-medium text-gray-900'>{type.label}</h4>
                    <p className='text-sm text-gray-600'>{type.desc}</p>
                  </div>
                  <input
                    type='checkbox'
                    checked={
                      preferences.types[
                        type.key as keyof typeof preferences.types
                      ]
                    }
                    onChange={(e) =>
                      updatePreference('types', type.key, e.target.checked)
                    }
                    className='h-4 w-4 rounded text-blue-600 focus:ring-blue-500'
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='sticky bottom-0 flex items-center justify-between border-t border-gray-200 bg-white p-6'>
          <div className='text-sm text-gray-600'>
            Changes are saved to your profile
          </div>

          <div className='flex items-center gap-3'>
            <button
              onClick={onClose}
              className='rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50'
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className='flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50'
            >
              {saving ? (
                <>
                  <div className='h-4 w-4 animate-spin rounded-full border-b-2 border-white'></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className='h-4 w-4' />
                  Save Preferences
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;
