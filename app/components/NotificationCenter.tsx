'use client';

import {
  BarChart3,
  Bell,
  CheckCircle,
  Clock,
  Download,
  Filter,
  RefreshCw,
  Search,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import fleetFlowNotificationManager, {
  FleetFlowNotification,
  NotificationStats,
} from '../services/FleetFlowNotificationManager';

interface NotificationCenterProps {
  userId?: string;
  portal?: 'vendor' | 'driver' | 'dispatch' | 'admin' | 'carrier';
  theme?: 'light' | 'dark' | 'auto';
  showStats?: boolean;
  showFilters?: boolean;
  showActions?: boolean;
  maxHeight?: string;
}

const PRIORITY_COLORS = {
  low: '#6b7280',
  normal: '#3b82f6',
  high: '#f59e0b',
  urgent: '#ef4444',
  critical: '#dc2626',
};

const TYPE_ICONS = {
  load_assignment: '🚛',
  delivery_update: '📦',
  payment_alert: '💰',
  warehouse_alert: '🏭',
  emergency_alert: '🚨',
  load_opportunity: '💎',
  system_alert: '⚙️',
  compliance_alert: '📋',
  dispatch_update: '🎯',
  carrier_update: '🚚',
  driver_update: '👤',
  vendor_update: '🏢',
  intraoffice: '💬',
  workflow_update: '🔄',
  eta_update: '⏰',
  document_required: '📄',
  approval_needed: '✅',
  onboarding_update: '🎓',
};

export default function NotificationCenter({
  userId = 'default',
  portal = 'admin',
  theme = 'auto',
  showStats = true,
  showFilters = true,
  showActions = true,
  maxHeight = '600px',
}: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<FleetFlowNotification[]>(
    []
  );
  const [stats, setStats] = useState<NotificationStats>({
    totalSent: 0,
    totalRead: 0,
    totalUnread: 0,
    byType: {},
    byPriority: {},
    byChannel: {},
    readRate: 0,
    avgResponseTime: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'timestamp' | 'priority' | 'type'>(
    'timestamp'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    []
  );
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Load notifications and stats
  useEffect(() => {
    const loadData = () => {
      const allNotifications = fleetFlowNotificationManager.getNotifications(
        userId,
        portal
      );
      setNotifications(allNotifications);

      const userStats = fleetFlowNotificationManager.getStats(userId, portal);
      setStats(userStats);
    };

    loadData();

    // Subscribe to real-time updates
    const unsubscribeAdded = fleetFlowNotificationManager.subscribe(
      'notification_added',
      loadData
    );
    const unsubscribeRead = fleetFlowNotificationManager.subscribe(
      'notification_read',
      loadData
    );
    const unsubscribeDeleted = fleetFlowNotificationManager.subscribe(
      'notification_deleted',
      loadData
    );

    return () => {
      unsubscribeAdded();
      unsubscribeRead();
      unsubscribeDeleted();
    };
  }, [userId, portal]);

  // Filter and sort notifications
  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(term) ||
          n.message.toLowerCase().includes(term) ||
          n.type.toLowerCase().includes(term)
      );
    }

    // Type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((n) => selectedTypes.includes(n.type));
    }

    // Priority filter
    if (selectedPriorities.length > 0) {
      filtered = filtered.filter((n) =>
        selectedPriorities.includes(n.priority)
      );
    }

    // Unread only filter
    if (showUnreadOnly) {
      filtered = filtered.filter((n) => !n.read);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = {
            critical: 5,
            urgent: 4,
            high: 3,
            normal: 2,
            low: 1,
          };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'type':
          return a.type.localeCompare(b.type);
        case 'timestamp':
        default:
          return (
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
      }
    });

    return filtered;
  }, [
    notifications,
    searchTerm,
    selectedTypes,
    selectedPriorities,
    showUnreadOnly,
    sortBy,
  ]);

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
      button: {
        primary: {
          background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
          color: 'white',
        },
        secondary: {
          background: isDark
            ? 'rgba(55, 65, 81, 0.6)'
            : 'rgba(243, 244, 246, 0.8)',
          color: isDark ? '#f3f4f6' : '#374151',
        },
      },
    };
  };

  const themeStyles = getThemeStyles();

  // Handle notification actions
  const handleMarkAsRead = (notificationId: string) => {
    fleetFlowNotificationManager.markAsRead(notificationId);
  };

  const handleBulkAction = (action: 'read' | 'delete') => {
    setIsLoading(true);

    selectedNotifications.forEach((id) => {
      if (action === 'read') {
        fleetFlowNotificationManager.markAsRead(id);
      } else {
        fleetFlowNotificationManager.deleteNotification(id);
      }
    });

    setSelectedNotifications([]);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id));
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    // Trigger a refresh - in a real app this would sync with backend
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredNotifications, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fleetflow-notifications-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

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
      <div
        style={{
          background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
          color: 'white',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
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
            <Bell size={24} />
            Notification Center
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
            {portal.charAt(0).toUpperCase() + portal.slice(1)} Portal •{' '}
            {filteredNotifications.length} notifications
          </p>
        </div>

        {showActions && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              style={{
                padding: '8px 16px',
                background: isLoading
                  ? 'rgba(255,255,255,0.2)'
                  : 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              <RefreshCw
                size={16}
                style={{
                  animation: isLoading ? 'spin 1s linear infinite' : 'none',
                }}
              />
              Refresh
            </button>

            <button
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              style={{
                padding: '8px 16px',
                background: showFiltersPanel
                  ? 'rgba(255,255,255,0.3)'
                  : 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Filter size={16} />
              Filters
            </button>
          </div>
        )}
      </div>

      {/* Stats Bar */}
      {showStats && (
        <div
          style={{
            padding: '16px 24px',
            background: 'rgba(20, 184, 166, 0.1)',
            borderBottom: `1px solid ${themeStyles.container.border.split(' ')[2]}`,
            display: 'flex',
            gap: '24px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={16} style={{ color: '#14b8a6' }} />
            <span style={{ fontSize: '14px', fontWeight: '600' }}>
              Total: {stats.totalSent}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={16} style={{ color: '#10b981' }} />
            <span style={{ fontSize: '14px' }}>Read: {stats.totalRead}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={16} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '14px' }}>
              Unread: {stats.totalUnread}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} style={{ color: '#6366f1' }} />
            <span style={{ fontSize: '14px' }}>
              Read Rate: {stats.readRate.toFixed(1)}%
            </span>
          </div>
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && showFiltersPanel && (
        <div
          style={{
            padding: '20px 24px',
            background: 'rgba(20, 184, 166, 0.05)',
            borderBottom: `1px solid ${themeStyles.container.border.split(' ')[2]}`,
          }}
        >
          {/* Search */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                }}
              />
              <input
                type='text'
                placeholder='Search notifications...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 40px',
                  background: themeStyles.card.background,
                  border: themeStyles.card.border,
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: 'currentColor',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {/* Priority Filter */}
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  opacity: 0.8,
                }}
              >
                Priority
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['low', 'normal', 'high', 'urgent', 'critical'].map(
                  (priority) => (
                    <button
                      key={priority}
                      onClick={() => {
                        setSelectedPriorities((prev) =>
                          prev.includes(priority)
                            ? prev.filter((p) => p !== priority)
                            : [...prev, priority]
                        );
                      }}
                      style={{
                        padding: '4px 8px',
                        fontSize: '11px',
                        fontWeight: '600',
                        borderRadius: '4px',
                        border: selectedPriorities.includes(priority)
                          ? `2px solid ${PRIORITY_COLORS[priority]}`
                          : `1px solid ${PRIORITY_COLORS[priority]}`,
                        background: selectedPriorities.includes(priority)
                          ? `${PRIORITY_COLORS[priority]}20`
                          : 'transparent',
                        color: PRIORITY_COLORS[priority],
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                      }}
                    >
                      {priority}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Sort & Options */}
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  opacity: 0.8,
                }}
              >
                Options
              </label>
              <div
                style={{ display: 'flex', gap: '12px', alignItems: 'center' }}
              >
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  style={{
                    padding: '6px 12px',
                    background: themeStyles.card.background,
                    border: themeStyles.card.border,
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: 'currentColor',
                  }}
                >
                  <option value='timestamp'>Sort by Time</option>
                  <option value='priority'>Sort by Priority</option>
                  <option value='type'>Sort by Type</option>
                </select>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type='checkbox'
                    checked={showUnreadOnly}
                    onChange={(e) => setShowUnreadOnly(e.target.checked)}
                  />
                  Unread only
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedNotifications.length > 0 && (
        <div
          style={{
            padding: '12px 24px',
            background: 'rgba(59, 130, 246, 0.1)',
            borderBottom: `1px solid ${themeStyles.container.border.split(' ')[2]}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '14px', fontWeight: '600' }}>
            {selectedNotifications.length} notifications selected
          </span>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => handleBulkAction('read')}
              disabled={isLoading}
              style={{
                padding: '6px 12px',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#059669',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              Mark as Read
            </button>

            <button
              onClick={() => handleBulkAction('delete')}
              disabled={isLoading}
              style={{
                padding: '6px 12px',
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#dc2626',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              Delete
            </button>

            <button
              onClick={() => setSelectedNotifications([])}
              style={{
                padding: '6px 12px',
                background: 'rgba(156, 163, 175, 0.2)',
                color: '#6b7280',
                border: '1px solid rgba(156, 163, 175, 0.3)',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Actions Bar */}
      {showActions && (
        <div
          style={{
            padding: '12px 24px',
            borderBottom: `1px solid ${themeStyles.container.border.split(' ')[2]}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            <input
              type='checkbox'
              checked={
                selectedNotifications.length === filteredNotifications.length &&
                filteredNotifications.length > 0
              }
              onChange={handleSelectAll}
            />
            Select All ({filteredNotifications.length})
          </label>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() =>
                fleetFlowNotificationManager.markAllAsRead(userId, portal)
              }
              style={{
                padding: '6px 12px',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#059669',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <CheckCircle size={12} />
              Mark All Read
            </button>

            <button
              onClick={handleExport}
              style={{
                padding: '6px 12px',
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#2563eb',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Download size={12} />
              Export
            </button>
          </div>
        </div>
      )}

      {/* Notification List */}
      <div style={{ maxHeight, overflowY: 'auto' }}>
        {filteredNotifications.length === 0 ? (
          <div
            style={{
              padding: '60px 24px',
              textAlign: 'center',
              color: 'rgba(156, 163, 175, 0.8)',
            }}
          >
            <Bell size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>
              No notifications found
            </h3>
            <p style={{ margin: 0, fontSize: '14px' }}>
              {searchTerm ||
              selectedTypes.length > 0 ||
              selectedPriorities.length > 0 ||
              showUnreadOnly
                ? 'Try adjusting your filters'
                : 'All caught up! New notifications will appear here.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification, index) => {
            const typeIcon = TYPE_ICONS[notification.type] || '🔔';
            const isSelected = selectedNotifications.includes(notification.id);

            return (
              <div
                key={notification.id}
                style={{
                  padding: '20px 24px',
                  ...themeStyles.card,
                  borderBottom:
                    index < filteredNotifications.length - 1
                      ? `1px solid ${themeStyles.card.border.split(' ')[2]}`
                      : 'none',
                  background: isSelected
                    ? 'rgba(59, 130, 246, 0.1)'
                    : themeStyles.card.background,
                  borderLeft: !notification.read
                    ? `4px solid ${PRIORITY_COLORS[notification.priority]}`
                    : '4px solid transparent',
                  opacity: notification.read ? 0.8 : 1,
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                  }}
                >
                  {/* Selection Checkbox */}
                  <input
                    type='checkbox'
                    checked={isSelected}
                    onChange={() => {
                      setSelectedNotifications((prev) =>
                        isSelected
                          ? prev.filter((id) => id !== notification.id)
                          : [...prev, notification.id]
                      );
                    }}
                    style={{ marginTop: '4px' }}
                  />

                  {/* Type Icon */}
                  <div style={{ fontSize: '24px', marginTop: '2px' }}>
                    {typeIcon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '8px',
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: '16px',
                          fontWeight: notification.read ? '500' : '600',
                          color: 'currentColor',
                          flex: 1,
                        }}
                      >
                        {notification.title}
                      </h3>

                      {/* Priority Badge */}
                      <span
                        style={{
                          padding: '2px 8px',
                          fontSize: '10px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          borderRadius: '12px',
                          background: `${PRIORITY_COLORS[notification.priority]}20`,
                          color: PRIORITY_COLORS[notification.priority],
                        }}
                      >
                        {notification.priority}
                      </span>

                      {/* Timestamp */}
                      <span
                        style={{
                          fontSize: '12px',
                          color: 'currentColor',
                          opacity: 0.6,
                        }}
                      >
                        {new Date(notification.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <p
                      style={{
                        margin: '0 0 12px 0',
                        fontSize: '14px',
                        color: 'currentColor',
                        opacity: 0.8,
                        lineHeight: 1.5,
                      }}
                    >
                      {notification.message}
                    </p>

                    {/* Meta Info */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        fontSize: '12px',
                        opacity: 0.6,
                      }}
                    >
                      <span>Type: {notification.type.replace(/_/g, ' ')}</span>
                      <span>
                        Channels:{' '}
                        {Object.entries(notification.channels)
                          .filter(([_, enabled]) => enabled)
                          .map(([channel]) => channel)
                          .join(', ')}
                      </span>
                      {notification.metadata.actionRequired && (
                        <span style={{ color: '#f59e0b', fontWeight: '600' }}>
                          Action Required
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div
                      style={{ marginTop: '12px', display: 'flex', gap: '8px' }}
                    >
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          style={{
                            padding: '4px 8px',
                            fontSize: '11px',
                            fontWeight: '600',
                            borderRadius: '4px',
                            background: 'rgba(16, 185, 129, 0.2)',
                            color: '#059669',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            cursor: 'pointer',
                          }}
                        >
                          Mark as Read
                        </button>
                      )}

                      {notification.actions?.map((action) => (
                        <button
                          key={action.id}
                          onClick={() => {
                            if (action.url) {
                              window.open(action.url, '_blank');
                            }
                          }}
                          style={{
                            padding: '4px 8px',
                            fontSize: '11px',
                            fontWeight: '600',
                            borderRadius: '4px',
                            background:
                              action.style === 'danger'
                                ? 'rgba(239, 68, 68, 0.2)'
                                : 'rgba(59, 130, 246, 0.2)',
                            color:
                              action.style === 'danger' ? '#dc2626' : '#2563eb',
                            border:
                              action.style === 'danger'
                                ? '1px solid rgba(239, 68, 68, 0.3)'
                                : '1px solid rgba(59, 130, 246, 0.3)',
                            cursor: 'pointer',
                          }}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
