'use client';

import {
  AlertCircle,
  Bell,
  Clock,
  Mail,
  Phone,
  RotateCcw,
  Save,
  Settings,
  Smartphone,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import fleetFlowNotificationManager, {
  NotificationPreferences as INotificationPreferences,
} from '../services/FleetFlowNotificationManager';

interface NotificationPreferencesProps {
  userId: string;
  portal: 'vendor' | 'driver' | 'dispatch' | 'admin' | 'carrier';
  theme?: 'light' | 'dark' | 'auto';
  showTitle?: boolean;
  onPreferencesChange?: (preferences: INotificationPreferences) => void;
}

const NOTIFICATION_TYPES = [
  {
    id: 'load_assignment',
    label: 'Load Assignments',
    icon: '🚛',
    description: 'New load assignments and updates',
  },
  {
    id: 'delivery_update',
    label: 'Delivery Updates',
    icon: '📦',
    description: 'Pickup and delivery status changes',
  },
  {
    id: 'payment_alert',
    label: 'Payment Alerts',
    icon: '💰',
    description: 'Payment processing and invoicing',
  },
  {
    id: 'warehouse_alert',
    label: 'Warehouse Alerts',
    icon: '🏭',
    description: 'Inventory and capacity notifications',
  },
  {
    id: 'emergency_alert',
    label: 'Emergency Alerts',
    icon: '🚨',
    description: 'Critical safety and emergency notifications',
  },
  {
    id: 'load_opportunity',
    label: 'Load Opportunities',
    icon: '💎',
    description: 'High-value and preferred load notifications',
  },
  {
    id: 'system_alert',
    label: 'System Alerts',
    icon: '⚙️',
    description: 'System status and maintenance notifications',
  },
  {
    id: 'compliance_alert',
    label: 'Compliance Alerts',
    icon: '📋',
    description: 'DOT, FMCSA and regulatory notifications',
  },
  {
    id: 'dispatch_update',
    label: 'Dispatch Updates',
    icon: '🎯',
    description: 'Dispatcher communications and updates',
  },
  {
    id: 'carrier_update',
    label: 'Carrier Updates',
    icon: '🚚',
    description: 'Carrier status and performance updates',
  },
  {
    id: 'driver_update',
    label: 'Driver Updates',
    icon: '👤',
    description: 'Driver status and communication updates',
  },
  {
    id: 'vendor_update',
    label: 'Vendor Updates',
    icon: '🏢',
    description: 'Vendor and partner notifications',
  },
  {
    id: 'intraoffice',
    label: 'Internal Messages',
    icon: '💬',
    description: 'Team and department communications',
  },
  {
    id: 'workflow_update',
    label: 'Workflow Updates',
    icon: '🔄',
    description: 'Process and workflow status changes',
  },
  {
    id: 'eta_update',
    label: 'ETA Updates',
    icon: '⏰',
    description: 'Estimated arrival and delivery times',
  },
  {
    id: 'document_required',
    label: 'Document Requests',
    icon: '📄',
    description: 'Required document and signature requests',
  },
  {
    id: 'approval_needed',
    label: 'Approval Requests',
    icon: '✅',
    description: 'Management approval and authorization requests',
  },
  {
    id: 'onboarding_update',
    label: 'Onboarding Updates',
    icon: '🎓',
    description: 'New user and carrier onboarding progress',
  },
];

const PRIORITY_LEVELS = [
  {
    id: 'low',
    label: 'Low',
    color: '#6b7280',
    description: 'General information and updates',
  },
  {
    id: 'normal',
    label: 'Normal',
    color: '#3b82f6',
    description: 'Standard business notifications',
  },
  {
    id: 'high',
    label: 'High',
    color: '#f59e0b',
    description: 'Important time-sensitive notifications',
  },
  {
    id: 'urgent',
    label: 'Urgent',
    color: '#ef4444',
    description: 'Critical business notifications',
  },
  {
    id: 'critical',
    label: 'Critical',
    color: '#dc2626',
    description: 'Emergency and safety-critical alerts',
  },
];

const TIMEZONES = [
  { id: 'America/New_York', label: 'Eastern Time (ET)' },
  { id: 'America/Chicago', label: 'Central Time (CT)' },
  { id: 'America/Denver', label: 'Mountain Time (MT)' },
  { id: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { id: 'America/Phoenix', label: 'Arizona Time (MST)' },
  { id: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { id: 'Pacific/Honolulu', label: 'Hawaii Time (HST)' },
];

export default function NotificationPreferences({
  userId,
  portal,
  theme = 'auto',
  showTitle = true,
  onPreferencesChange,
}: NotificationPreferencesProps) {
  const [preferences, setPreferences] =
    useState<INotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testingChannel, setTestingChannel] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    channels: true,
    types: false,
    priorities: true,
    schedule: false,
    thresholds: false,
  });

  // Load initial preferences
  useEffect(() => {
    // Get current preferences or defaults
    const defaultPrefs = fleetFlowNotificationManager.getStats(userId, portal);
    // This would normally load from the notification manager
    const initialPrefs: INotificationPreferences = {
      userId,
      channels: {
        inApp: true,
        sms: false,
        email: true,
        push: true,
      },
      priorities: {
        low: false,
        normal: true,
        high: true,
        urgent: true,
        critical: true,
      },
      types: Object.fromEntries(
        NOTIFICATION_TYPES.map((type) => [type.id, true])
      ) as any,
      schedule: {
        enabled: false,
        startTime: '08:00',
        endTime: '18:00',
        timezone: 'America/New_York',
        daysOfWeek: [1, 2, 3, 4, 5],
        urgentOnly: true,
      },
      thresholds: {
        loadValueMin: 500,
        distanceMax: 1000,
        rateMin: 1.5,
      },
    };

    setPreferences(initialPrefs);
  }, [userId, portal]);

  // Get theme styles
  const getThemeStyles = () => {
    const isDark =
      theme === 'dark' ||
      (theme === 'auto' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    return {
      container: {
        background: isDark
          ? 'rgba(17, 24, 39, 0.95)'
          : 'rgba(255, 255, 255, 0.95)',
        color: isDark ? '#f3f4f6' : '#1f2937',
        border: `1px solid ${isDark ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.8)'}`,
      },
      card: {
        background: isDark
          ? 'rgba(31, 41, 55, 0.6)'
          : 'rgba(249, 250, 251, 0.8)',
        border: `1px solid ${isDark ? 'rgba(75, 85, 99, 0.2)' : 'rgba(229, 231, 235, 0.6)'}`,
      },
      toggle: {
        active: {
          background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
          border: '2px solid #14b8a6',
        },
        inactive: {
          background: isDark
            ? 'rgba(75, 85, 99, 0.3)'
            : 'rgba(209, 213, 219, 0.5)',
          border: `2px solid ${isDark ? 'rgba(75, 85, 99, 0.5)' : 'rgba(209, 213, 219, 0.7)'}`,
        },
      },
    };
  };

  const themeStyles = getThemeStyles();

  // Update preferences
  const updatePreferences = (updates: Partial<INotificationPreferences>) => {
    if (!preferences) return;

    const newPrefs = { ...preferences, ...updates };
    setPreferences(newPrefs);
    setHasChanges(true);
    onPreferencesChange?.(newPrefs);
  };

  // Save preferences
  const handleSave = async () => {
    if (!preferences) return;

    setIsSaving(true);
    try {
      fleetFlowNotificationManager.updatePreferences(userId, preferences);
      setHasChanges(false);

      // Show success feedback
      setTimeout(() => setIsSaving(false), 500);
    } catch (error) {
      console.error('Failed to save preferences:', error);
      setIsSaving(false);
    }
  };

  // Reset to defaults
  const handleReset = () => {
    const defaultPrefs: INotificationPreferences = {
      userId,
      channels: { inApp: true, sms: false, email: true, push: true },
      priorities: {
        low: false,
        normal: true,
        high: true,
        urgent: true,
        critical: true,
      },
      types: Object.fromEntries(
        NOTIFICATION_TYPES.map((type) => [type.id, true])
      ) as any,
      schedule: {
        enabled: false,
        startTime: '08:00',
        endTime: '18:00',
        timezone: 'America/New_York',
        daysOfWeek: [1, 2, 3, 4, 5],
        urgentOnly: true,
      },
      thresholds: { loadValueMin: 500, distanceMax: 1000, rateMin: 1.5 },
    };

    setPreferences(defaultPrefs);
    setHasChanges(true);
  };

  // Test notification channel
  const handleTestChannel = async (
    channel: keyof INotificationPreferences['channels']
  ) => {
    setTestingChannel(channel);

    try {
      await fleetFlowNotificationManager.sendTestNotification(userId, portal);

      setTimeout(() => {
        setTestingChannel(null);
        // Show success message
      }, 2000);
    } catch (error) {
      console.error('Test notification failed:', error);
      setTestingChannel(null);
    }
  };

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (!preferences) {
    return (
      <div
        style={{
          ...themeStyles.container,
          padding: '40px',
          textAlign: 'center',
          borderRadius: '16px',
        }}
      >
        <Settings size={32} style={{ opacity: 0.3, marginBottom: '16px' }} />
        <p>Loading notification preferences...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        ...themeStyles.container,
        borderRadius: '16px',
        backdropFilter: 'blur(15px)',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      }}
    >
      {/* Header */}
      {showTitle && (
        <div
          style={{
            background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
            color: 'white',
            padding: '24px',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Settings size={24} />
            Notification Preferences
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
            Customize how and when you receive notifications •{' '}
            {portal.charAt(0).toUpperCase() + portal.slice(1)} Portal
          </p>
        </div>
      )}

      <div style={{ padding: '24px' }}>
        {/* Notification Channels */}
        <div style={{ marginBottom: '32px' }}>
          <div
            onClick={() => toggleSection('channels')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              marginBottom: '16px',
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Bell size={20} />
              Notification Channels
            </h3>
            <span style={{ fontSize: '12px', opacity: 0.6 }}>
              {expandedSections.channels ? '▼' : '▶'}
            </span>
          </div>

          {expandedSections.channels && (
            <div
              style={{
                ...themeStyles.card,
                padding: '20px',
                borderRadius: '12px',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '20px',
                }}
              >
                {[
                  {
                    key: 'inApp' as const,
                    icon: Bell,
                    label: 'In-App Notifications',
                    description: 'Browser and mobile app notifications',
                  },
                  {
                    key: 'sms' as const,
                    icon: Smartphone,
                    label: 'SMS Messages',
                    description: 'Text messages to your phone',
                  },
                  {
                    key: 'email' as const,
                    icon: Mail,
                    label: 'Email Notifications',
                    description: 'Email alerts and summaries',
                  },
                  {
                    key: 'push' as const,
                    icon: Phone,
                    label: 'Push Notifications',
                    description: 'Mobile push notifications',
                  },
                ].map(({ key, icon: Icon, label, description }) => (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: preferences.channels[key]
                          ? 'rgba(20, 184, 166, 0.2)'
                          : 'rgba(156, 163, 175, 0.2)',
                      }}
                    >
                      <Icon
                        size={20}
                        color={
                          preferences.channels[key] ? '#14b8a6' : '#9ca3af'
                        }
                      />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginBottom: '4px',
                        }}
                      >
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>
                          {label}
                        </span>

                        {/* Toggle Switch */}
                        <button
                          onClick={() =>
                            updatePreferences({
                              channels: {
                                ...preferences.channels,
                                [key]: !preferences.channels[key],
                              },
                            })
                          }
                          style={{
                            width: '44px',
                            height: '24px',
                            borderRadius: '12px',
                            border: 'none',
                            ...themeStyles.toggle[
                              preferences.channels[key] ? 'active' : 'inactive'
                            ],
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <div
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              background: 'white',
                              position: 'absolute',
                              top: '1px',
                              left: preferences.channels[key] ? '23px' : '1px',
                              transition: 'all 0.2s ease',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            }}
                          />
                        </button>

                        {/* Test Button */}
                        {preferences.channels[key] && (
                          <button
                            onClick={() => handleTestChannel(key)}
                            disabled={testingChannel === key}
                            style={{
                              padding: '4px 8px',
                              fontSize: '10px',
                              fontWeight: '600',
                              borderRadius: '4px',
                              background:
                                testingChannel === key
                                  ? 'rgba(156, 163, 175, 0.2)'
                                  : 'rgba(245, 158, 11, 0.2)',
                              color:
                                testingChannel === key ? '#9ca3af' : '#d97706',
                              border:
                                testingChannel === key
                                  ? '1px solid rgba(156, 163, 175, 0.3)'
                                  : '1px solid rgba(245, 158, 11, 0.3)',
                              cursor:
                                testingChannel === key
                                  ? 'not-allowed'
                                  : 'pointer',
                            }}
                          >
                            {testingChannel === key ? '⏳' : '🧪'} Test
                          </button>
                        )}
                      </div>
                      <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Priority Levels */}
        <div style={{ marginBottom: '32px' }}>
          <div
            onClick={() => toggleSection('priorities')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              marginBottom: '16px',
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertCircle size={20} />
              Priority Levels
            </h3>
            <span style={{ fontSize: '12px', opacity: 0.6 }}>
              {expandedSections.priorities ? '▼' : '▶'}
            </span>
          </div>

          {expandedSections.priorities && (
            <div
              style={{
                ...themeStyles.card,
                padding: '20px',
                borderRadius: '12px',
              }}
            >
              <p
                style={{ margin: '0 0 16px 0', fontSize: '14px', opacity: 0.8 }}
              >
                Select which priority levels you want to receive notifications
                for
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {PRIORITY_LEVELS.map((priority) => (
                  <button
                    key={priority.id}
                    onClick={() =>
                      updatePreferences({
                        priorities: {
                          ...preferences.priorities,
                          [priority.id]:
                            !preferences.priorities[
                              priority.id as keyof typeof preferences.priorities
                            ],
                        },
                      })
                    }
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: preferences.priorities[
                        priority.id as keyof typeof preferences.priorities
                      ]
                        ? `2px solid ${priority.color}`
                        : `1px solid ${priority.color}`,
                      background: preferences.priorities[
                        priority.id as keyof typeof preferences.priorities
                      ]
                        ? `${priority.color}20`
                        : 'transparent',
                      color: priority.color,
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'capitalize',
                      transition: 'all 0.2s ease',
                    }}
                    title={priority.description}
                  >
                    {priority.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notification Types */}
        <div style={{ marginBottom: '32px' }}>
          <div
            onClick={() => toggleSection('types')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              marginBottom: '16px',
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Bell size={20} />
              Notification Types
            </h3>
            <span style={{ fontSize: '12px', opacity: 0.6 }}>
              {expandedSections.types ? '▼' : '▶'}{' '}
              {Object.values(preferences.types).filter(Boolean).length}/
              {NOTIFICATION_TYPES.length} enabled
            </span>
          </div>

          {expandedSections.types && (
            <div
              style={{
                ...themeStyles.card,
                padding: '20px',
                borderRadius: '12px',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '16px',
                }}
              >
                {NOTIFICATION_TYPES.map((type) => (
                  <div
                    key={type.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{type.icon}</span>

                    <div style={{ flex: 1 }}>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type='checkbox'
                          checked={
                            preferences.types[
                              type.id as keyof typeof preferences.types
                            ] || false
                          }
                          onChange={(e) =>
                            updatePreferences({
                              types: {
                                ...preferences.types,
                                [type.id]: e.target.checked,
                              },
                            })
                          }
                        />
                        <span style={{ fontSize: '13px', fontWeight: '600' }}>
                          {type.label}
                        </span>
                      </label>
                      <p
                        style={{
                          margin: '2px 0 0 24px',
                          fontSize: '11px',
                          opacity: 0.7,
                        }}
                      >
                        {type.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Schedule Settings */}
        <div style={{ marginBottom: '32px' }}>
          <div
            onClick={() => toggleSection('schedule')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              marginBottom: '16px',
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Clock size={20} />
              Schedule Settings
            </h3>
            <span style={{ fontSize: '12px', opacity: 0.6 }}>
              {expandedSections.schedule ? '▼' : '▶'}{' '}
              {preferences.schedule.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>

          {expandedSections.schedule && (
            <div
              style={{
                ...themeStyles.card,
                padding: '20px',
                borderRadius: '12px',
              }}
            >
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  <input
                    type='checkbox'
                    checked={preferences.schedule.enabled}
                    onChange={(e) =>
                      updatePreferences({
                        schedule: {
                          ...preferences.schedule,
                          enabled: e.target.checked,
                        },
                      })
                    }
                  />
                  Enable Notification Schedule
                </label>
                <p
                  style={{
                    margin: '4px 0 0 28px',
                    fontSize: '12px',
                    opacity: 0.7,
                  }}
                >
                  Only receive notifications during specified hours
                  (urgent/critical always delivered)
                </p>
              </div>

              {preferences.schedule.enabled && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '600',
                        marginBottom: '8px',
                      }}
                    >
                      Start Time
                    </label>
                    <input
                      type='time'
                      value={preferences.schedule.startTime}
                      onChange={(e) =>
                        updatePreferences({
                          schedule: {
                            ...preferences.schedule,
                            startTime: e.target.value,
                          },
                        })
                      }
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: themeStyles.card.background,
                        border: themeStyles.card.border,
                        borderRadius: '6px',
                        fontSize: '14px',
                        color: 'currentColor',
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '600',
                        marginBottom: '8px',
                      }}
                    >
                      End Time
                    </label>
                    <input
                      type='time'
                      value={preferences.schedule.endTime}
                      onChange={(e) =>
                        updatePreferences({
                          schedule: {
                            ...preferences.schedule,
                            endTime: e.target.value,
                          },
                        })
                      }
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: themeStyles.card.background,
                        border: themeStyles.card.border,
                        borderRadius: '6px',
                        fontSize: '14px',
                        color: 'currentColor',
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '600',
                        marginBottom: '8px',
                      }}
                    >
                      Timezone
                    </label>
                    <select
                      value={preferences.schedule.timezone}
                      onChange={(e) =>
                        updatePreferences({
                          schedule: {
                            ...preferences.schedule,
                            timezone: e.target.value,
                          },
                        })
                      }
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: themeStyles.card.background,
                        border: themeStyles.card.border,
                        borderRadius: '6px',
                        fontSize: '14px',
                        color: 'currentColor',
                      }}
                    >
                      {TIMEZONES.map((tz) => (
                        <option key={tz.id} value={tz.id}>
                          {tz.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '600',
                        marginBottom: '8px',
                      }}
                    >
                      Days of Week
                    </label>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(
                        (day, index) => (
                          <button
                            key={day}
                            onClick={() => {
                              const newDays =
                                preferences.schedule.daysOfWeek.includes(index)
                                  ? preferences.schedule.daysOfWeek.filter(
                                      (d) => d !== index
                                    )
                                  : [
                                      ...preferences.schedule.daysOfWeek,
                                      index,
                                    ].sort();

                              updatePreferences({
                                schedule: {
                                  ...preferences.schedule,
                                  daysOfWeek: newDays,
                                },
                              });
                            }}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '4px',
                              border: 'none',
                              background:
                                preferences.schedule.daysOfWeek.includes(index)
                                  ? 'linear-gradient(135deg, #14b8a6, #0d9488)'
                                  : 'rgba(156, 163, 175, 0.3)',
                              color: preferences.schedule.daysOfWeek.includes(
                                index
                              )
                                ? 'white'
                                : 'currentColor',
                              fontSize: '10px',
                              fontWeight: '600',
                              cursor: 'pointer',
                            }}
                          >
                            {day}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Value Thresholds */}
        <div style={{ marginBottom: '32px' }}>
          <div
            onClick={() => toggleSection('thresholds')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              marginBottom: '16px',
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              📊 Value Thresholds
            </h3>
            <span style={{ fontSize: '12px', opacity: 0.6 }}>
              {expandedSections.thresholds ? '▼' : '▶'}
            </span>
          </div>

          {expandedSections.thresholds && (
            <div
              style={{
                ...themeStyles.card,
                padding: '20px',
                borderRadius: '12px',
              }}
            >
              <p
                style={{ margin: '0 0 16px 0', fontSize: '14px', opacity: 0.8 }}
              >
                Only receive load-related notifications that meet these criteria
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '20px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Minimum Load Value ($)
                  </label>
                  <input
                    type='number'
                    min='0'
                    step='50'
                    value={preferences.thresholds.loadValueMin}
                    onChange={(e) =>
                      updatePreferences({
                        thresholds: {
                          ...preferences.thresholds,
                          loadValueMin: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: themeStyles.card.background,
                      border: themeStyles.card.border,
                      borderRadius: '6px',
                      fontSize: '14px',
                      color: 'currentColor',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Maximum Distance (miles)
                  </label>
                  <input
                    type='number'
                    min='0'
                    step='50'
                    value={preferences.thresholds.distanceMax}
                    onChange={(e) =>
                      updatePreferences({
                        thresholds: {
                          ...preferences.thresholds,
                          distanceMax: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: themeStyles.card.background,
                      border: themeStyles.card.border,
                      borderRadius: '6px',
                      fontSize: '14px',
                      color: 'currentColor',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Minimum Rate ($/mile)
                  </label>
                  <input
                    type='number'
                    min='0'
                    step='0.10'
                    value={preferences.thresholds.rateMin}
                    onChange={(e) =>
                      updatePreferences({
                        thresholds: {
                          ...preferences.thresholds,
                          rateMin: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: themeStyles.card.background,
                      border: themeStyles.card.border,
                      borderRadius: '6px',
                      fontSize: '14px',
                      color: 'currentColor',
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            paddingTop: '20px',
            borderTop: `1px solid ${themeStyles.card.border.split(' ')[2]}`,
          }}
        >
          <button
            onClick={handleReset}
            style={{
              padding: '10px 20px',
              background: 'rgba(156, 163, 175, 0.2)',
              color: '#6b7280',
              border: '1px solid rgba(156, 163, 175, 0.3)',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <RotateCcw size={16} />
            Reset to Defaults
          </button>

          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            style={{
              padding: '10px 20px',
              background:
                hasChanges && !isSaving
                  ? 'linear-gradient(135deg, #14b8a6, #0d9488)'
                  : 'rgba(156, 163, 175, 0.3)',
              color: hasChanges && !isSaving ? 'white' : '#9ca3af',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: hasChanges && !isSaving ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>

        {/* Status Message */}
        {isSaving && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '8px',
              color: '#059669',
              fontSize: '14px',
              textAlign: 'center',
            }}
          >
            ✅ Preferences saved successfully!
          </div>
        )}
      </div>
    </div>
  );
}
