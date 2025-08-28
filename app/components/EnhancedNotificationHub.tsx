/**
 * Enhanced Notification Hub Component
 * Enterprise-grade notification center with real-time updates,
 * advanced filtering, and intelligent action handling
 */

'use client';

import {
  AlertTriangle,
  Archive,
  Bell,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  Filter,
  Info,
  Search,
  Settings,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { getCurrentUser } from '../config/access';
import {
  NotificationData,
  NotificationPriority,
  NotificationService,
  NotificationType,
} from '../services/NotificationService';

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

interface NotificationHubProps {
  userId?: string;
  tenantId?: string;
  maxHeight?: string;
  showHeader?: boolean;
}

interface FilterOptions {
  types: NotificationType[];
  priorities: NotificationPriority[];
  readStatus: 'all' | 'unread' | 'read';
  dateRange: 'all' | 'today' | 'week' | 'month';
  search: string;
}

interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
}

// ============================================================================
// ENHANCED NOTIFICATION HUB COMPONENT
// ============================================================================

export const EnhancedNotificationHub: React.FC<NotificationHubProps> = ({
  userId,
  tenantId,
  maxHeight = '600px',
  showHeader = true,
}) => {
  // State management
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<
    NotificationData[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNotifications, setSelectedNotifications] = useState<
    Set<string>
  >(new Set());
  const [showSettings, setShowSettings] = useState(false);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    byType: {} as Record<NotificationType, number>,
    byPriority: {} as Record<NotificationPriority, number>,
  });

  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    types: [],
    priorities: [],
    readStatus: 'all',
    dateRange: 'all',
    search: '',
  });

  const [showFilters, setShowFilters] = useState(false);

  // Services
  const notificationService = new NotificationService();
  const { user } = getCurrentUser();
  const currentUserId = userId || user.id;
  const currentTenantId = tenantId || 'default';

  // ============================================================================
  // DATA LOADING & REAL-TIME UPDATES
  // ============================================================================

  const loadNotifications = useCallback(async () => {
    if (!currentUserId) return;

    try {
      setIsLoading(true);
      setError(null);

      const [notificationsData, statsData] = await Promise.all([
        notificationService.getUserNotifications(currentUserId, {
          limit: 100,
          includeRead: true,
        }),
        notificationService.getNotificationStats(
          currentUserId,
          currentTenantId
        ),
      ]);

      setNotifications(notificationsData);
      setStats(statsData);
    } catch (err) {
      console.error('❌ Failed to load notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, currentTenantId]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // ============================================================================
  // FILTERING LOGIC
  // ============================================================================

  useEffect(() => {
    let filtered = [...notifications];

    // Filter by types
    if (filters.types.length > 0) {
      filtered = filtered.filter((n) => filters.types.includes(n.type));
    }

    // Filter by priorities
    if (filters.priorities.length > 0) {
      filtered = filtered.filter((n) =>
        filters.priorities.includes(n.priority)
      );
    }

    // Filter by read status
    if (filters.readStatus !== 'all') {
      filtered = filtered.filter((n) =>
        filters.readStatus === 'read' ? n.isRead : !n.isRead
      );
    }

    // Filter by date range
    const now = new Date();
    if (filters.dateRange !== 'all') {
      const cutoffDate = new Date();
      switch (filters.dateRange) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
      }
      filtered = filtered.filter(
        (n) => n.createdAt && n.createdAt >= cutoffDate
      );
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(searchLower) ||
          n.message.toLowerCase().includes(searchLower) ||
          n.category.toLowerCase().includes(searchLower)
      );
    }

    setFilteredNotifications(filtered);
  }, [notifications, filters]);

  // ============================================================================
  // ACTION HANDLERS
  // ============================================================================

  const handleMarkAsRead = async (notificationIds: string[]) => {
    try {
      const success = await notificationService.markAsRead(notificationIds);
      if (success) {
        setNotifications((prev) =>
          prev.map((n) =>
            notificationIds.includes(n.id!) ? { ...n, isRead: true } : n
          )
        );
        setSelectedNotifications(new Set());
      }
    } catch (error) {
      console.error('❌ Failed to mark as read:', error);
    }
  };

  const handleArchive = async (notificationIds: string[]) => {
    try {
      const success =
        await notificationService.archiveNotifications(notificationIds);
      if (success) {
        setNotifications((prev) =>
          prev.filter((n) => !notificationIds.includes(n.id!))
        );
        setSelectedNotifications(new Set());
      }
    } catch (error) {
      console.error('❌ Failed to archive:', error);
    }
  };

  const handleBulkAction = async (action: 'read' | 'archive') => {
    const ids = Array.from(selectedNotifications);
    if (ids.length === 0) return;

    if (action === 'read') {
      await handleMarkAsRead(ids);
    } else {
      await handleArchive(ids);
    }
  };

  const handleNotificationAction = async (
    notification: NotificationData,
    actionId: string
  ) => {
    const action = notification.actions?.find((a) => a.id === actionId);
    if (!action) return;

    console.log(`🎯 Executing notification action: ${actionId}`, action);

    try {
      switch (action.type) {
        case 'navigate':
          // Handle navigation
          if (action.payload.url) {
            window.location.href = action.payload.url;
          }
          break;

        case 'modal':
          // Handle modal opening
          console.log('Opening modal:', action.payload);
          break;

        case 'api':
          // Handle API call
          console.log('Making API call:', action.payload);
          break;

        case 'external':
          // Handle external link
          if (action.payload.url) {
            window.open(action.payload.url, '_blank');
          }
          break;
      }

      // Mark notification as read after action
      if (!notification.isRead) {
        await handleMarkAsRead([notification.id!]);
      }
    } catch (error) {
      console.error('❌ Failed to execute notification action:', error);
    }
  };

  const toggleSelection = (notificationId: string) => {
    const newSelection = new Set(selectedNotifications);
    if (newSelection.has(notificationId)) {
      newSelection.delete(notificationId);
    } else {
      newSelection.add(notificationId);
    }
    setSelectedNotifications(newSelection);
  };

  const selectAll = () => {
    const allIds = new Set(filteredNotifications.map((n) => n.id!));
    setSelectedNotifications(allIds);
  };

  const clearSelection = () => {
    setSelectedNotifications(new Set());
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const getPriorityIcon = (priority: NotificationPriority) => {
    switch (priority) {
      case 'critical':
        return <AlertTriangle className='h-4 w-4 text-red-600' />;
      case 'high':
        return <AlertTriangle className='h-4 w-4 text-red-500' />;
      case 'medium':
        return <Clock className='h-4 w-4 text-yellow-500' />;
      case 'low':
        return <Info className='h-4 w-4 text-blue-500' />;
      default:
        return <Info className='h-4 w-4 text-gray-500' />;
    }
  };

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case 'critical':
        return 'border-red-600 bg-red-50';
      case 'high':
        return 'border-red-500 bg-red-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-blue-500 bg-blue-50';
      default:
        return 'border-gray-300 bg-white';
    }
  };

  const getTypeColor = (type: NotificationType) => {
    const colors = {
      system: 'bg-gray-100 text-gray-800',
      shipment: 'bg-green-100 text-green-800',
      compliance: 'bg-red-100 text-red-800',
      billing: 'bg-purple-100 text-purple-800',
      maintenance: 'bg-orange-100 text-orange-800',
      driver: 'bg-blue-100 text-blue-800',
      vehicle: 'bg-indigo-100 text-indigo-800',
      dispatch: 'bg-teal-100 text-teal-800',
      carrier: 'bg-pink-100 text-pink-800',
      customer: 'bg-cyan-100 text-cyan-800',
      emergency: 'bg-red-200 text-red-900',
    };
    return colors[type] || colors.system;
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // ============================================================================
  // COMPONENT RENDER
  // ============================================================================

  return (
    <div className='flex flex-col rounded-lg border border-gray-200 bg-white shadow-lg'>
      {/* Header */}
      {showHeader && (
        <div className='flex items-center justify-between border-b border-gray-200 p-4'>
          <div className='flex items-center gap-3'>
            <Bell className='h-6 w-6 text-gray-700' />
            <div>
              <h2 className='text-lg font-semibold text-gray-900'>
                Notifications
              </h2>
              <p className='text-sm text-gray-600'>
                {stats.unread > 0 ? `${stats.unread} unread` : 'All caught up!'}
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            {/* Search */}
            <div className='relative'>
              <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
              <input
                type='text'
                placeholder='Search notifications...'
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className='rounded-lg border border-gray-300 py-2 pr-4 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none'
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className='rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900'
            >
              <Filter className='h-4 w-4' />
            </button>

            {/* Settings */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className='rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900'
            >
              <Settings className='h-4 w-4' />
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className='space-y-4 border-b border-gray-200 bg-gray-50 p-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
            {/* Type Filter */}
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Types
              </label>
              <select
                multiple
                value={filters.types}
                onChange={(e) => {
                  const selected = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value as NotificationType
                  );
                  setFilters((prev) => ({ ...prev, types: selected }));
                }}
                className='w-full rounded-lg border border-gray-300 p-2 text-sm'
              >
                <option value='system'>System</option>
                <option value='shipment'>Shipment</option>
                <option value='compliance'>Compliance</option>
                <option value='billing'>Billing</option>
                <option value='maintenance'>Maintenance</option>
                <option value='driver'>Driver</option>
                <option value='vehicle'>Vehicle</option>
                <option value='dispatch'>Dispatch</option>
                <option value='carrier'>Carrier</option>
                <option value='customer'>Customer</option>
                <option value='emergency'>Emergency</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Priority
              </label>
              <select
                multiple
                value={filters.priorities}
                onChange={(e) => {
                  const selected = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value as NotificationPriority
                  );
                  setFilters((prev) => ({ ...prev, priorities: selected }));
                }}
                className='w-full rounded-lg border border-gray-300 p-2 text-sm'
              >
                <option value='critical'>Critical</option>
                <option value='high'>High</option>
                <option value='medium'>Medium</option>
                <option value='low'>Low</option>
              </select>
            </div>

            {/* Read Status Filter */}
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Status
              </label>
              <select
                value={filters.readStatus}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    readStatus: e.target.value as any,
                  }))
                }
                className='w-full rounded-lg border border-gray-300 p-2 text-sm'
              >
                <option value='all'>All</option>
                <option value='unread'>Unread</option>
                <option value='read'>Read</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    dateRange: e.target.value as any,
                  }))
                }
                className='w-full rounded-lg border border-gray-300 p-2 text-sm'
              >
                <option value='all'>All Time</option>
                <option value='today'>Today</option>
                <option value='week'>This Week</option>
                <option value='month'>This Month</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedNotifications.size > 0 && (
        <div className='flex items-center justify-between border-b border-gray-200 bg-blue-50 p-4'>
          <span className='text-sm font-medium text-blue-900'>
            {selectedNotifications.size} notification
            {selectedNotifications.size !== 1 ? 's' : ''} selected
          </span>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => handleBulkAction('read')}
              className='flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700'
            >
              <CheckCircle className='h-4 w-4' />
              Mark Read
            </button>
            <button
              onClick={() => handleBulkAction('archive')}
              className='flex items-center gap-1 rounded-lg bg-gray-600 px-3 py-1 text-sm text-white transition-colors hover:bg-gray-700'
            >
              <Archive className='h-4 w-4' />
              Archive
            </button>
            <button
              onClick={clearSelection}
              className='rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-50'
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className='flex-1 overflow-auto' style={{ maxHeight }}>
        {isLoading ? (
          <div className='flex items-center justify-center py-8'>
            <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
          </div>
        ) : error ? (
          <div className='p-4 text-center'>
            <p className='text-red-600'>{error}</p>
            <button
              onClick={loadNotifications}
              className='mt-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'
            >
              Retry
            </button>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className='p-8 text-center'>
            <Bell className='mx-auto mb-3 h-12 w-12 text-gray-400' />
            <h3 className='mb-1 text-lg font-medium text-gray-900'>
              No notifications
            </h3>
            <p className='text-sm text-gray-600'>
              {filters.search ||
              filters.types.length > 0 ||
              filters.priorities.length > 0
                ? 'No notifications match your filters.'
                : 'All caught up! No new notifications.'}
            </p>
          </div>
        ) : (
          <div className='divide-y divide-gray-200'>
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 transition-colors hover:bg-gray-50 ${
                  notification.isRead ? 'opacity-75' : ''
                } ${getPriorityColor(notification.priority)} border-l-4`}
              >
                {/* Notification Header */}
                <div className='mb-2 flex items-start justify-between'>
                  <div className='flex flex-1 items-center gap-3'>
                    {/* Selection Checkbox */}
                    <input
                      type='checkbox'
                      checked={selectedNotifications.has(notification.id!)}
                      onChange={() => toggleSelection(notification.id!)}
                      className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                    />

                    {/* Priority & Type */}
                    <div className='flex items-center gap-2'>
                      {getPriorityIcon(notification.priority)}
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getTypeColor(notification.type)}`}
                      >
                        {notification.type}
                      </span>
                    </div>

                    {/* Unread Indicator */}
                    {!notification.isRead && (
                      <div className='h-2 w-2 rounded-full bg-blue-600'></div>
                    )}
                  </div>

                  <div className='flex items-center gap-2 text-xs text-gray-500'>
                    <span>{formatTimestamp(notification.createdAt!)}</span>
                    <button
                      onClick={() => handleMarkAsRead([notification.id!])}
                      className='text-gray-400 hover:text-gray-600'
                    >
                      {notification.isRead ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </button>
                  </div>
                </div>

                {/* Notification Content */}
                <div className='mb-3'>
                  <h4 className='mb-1 font-medium text-gray-900'>
                    {notification.title}
                  </h4>
                  <p className='text-sm text-gray-700'>
                    {notification.message}
                  </p>
                </div>

                {/* Actions */}
                {notification.actions && notification.actions.length > 0 && (
                  <div className='flex flex-wrap gap-2'>
                    {notification.actions.map((action) => (
                      <button
                        key={action.id}
                        onClick={() =>
                          handleNotificationAction(notification, action.id)
                        }
                        className={`flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                          action.style === 'primary'
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : action.style === 'danger'
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : action.style === 'success'
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {action.icon && <span>{action.icon}</span>}
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className='flex items-center justify-between border-t border-gray-200 bg-gray-50 p-4'>
        <div className='text-sm text-gray-600'>
          Showing {filteredNotifications.length} of {notifications.length}{' '}
          notifications
        </div>

        <div className='flex items-center gap-2'>
          <button
            onClick={selectAll}
            className='text-sm text-blue-600 hover:text-blue-700'
            disabled={filteredNotifications.length === 0}
          >
            Select All
          </button>
          <span className='text-gray-300'>|</span>
          <button
            onClick={loadNotifications}
            className='text-sm text-gray-600 hover:text-gray-700'
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedNotificationHub;
