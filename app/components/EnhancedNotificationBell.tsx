/**
 * Enhanced Notification Bell Component
 * Advanced notification dropdown with real-time updates,
 * quick actions, and smart notification management
 */

'use client';

import { createClient } from '@supabase/supabase-js';
import {
  AlertTriangle,
  Archive,
  Bell,
  Clock,
  Eye,
  Filter,
  Info,
  Settings,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { getCurrentUser } from '../config/access';
import {
  NotificationData,
  NotificationPriority,
  NotificationService,
  NotificationType,
} from '../services/NotificationService';
import NotificationPreferences from './NotificationPreferences';

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

interface EnhancedNotificationBellProps {
  userId?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxNotifications?: number;
  showPreview?: boolean;
  onNotificationClick?: (notification: NotificationData) => void;
}

// ============================================================================
// ENHANCED NOTIFICATION BELL COMPONENT
// ============================================================================

export const EnhancedNotificationBell: React.FC<
  EnhancedNotificationBellProps
> = ({
  userId,
  position = 'top-right',
  maxNotifications = 10,
  showPreview = true,
  onNotificationClick,
}) => {
  // Hydration state to prevent server-client mismatch
  const [isHydrated, setIsHydrated] = useState(false);

  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('unread');

  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  // Hydration effect - run on client only
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Services (only initialize after hydration)
  const notificationService = isHydrated ? new NotificationService() : null;
  const { user } = isHydrated ? getCurrentUser() : { user: null };
  const currentUserId = isHydrated ? userId || user?.id : null;

  // Supabase client for real-time subscriptions (only after hydration)
  const supabase =
    isHydrated && typeof window !== 'undefined'
      ? createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
      : null;

  // ============================================================================
  // DATA LOADING & REAL-TIME UPDATES
  // ============================================================================

  useEffect(() => {
    if (!isHydrated) return;

    console.info('🔔 EnhancedNotificationBell mounted with:', {
      userId,
      position,
      currentUserId,
      isHydrated,
    });
    if (!currentUserId || !notificationService || !supabase) return;

    loadNotifications();
    setupRealtimeSubscription();

    // Cleanup subscription on unmount
    return () => {
      if (supabase) {
        supabase.channel('notifications').unsubscribe();
      }
    };
  }, [currentUserId, isHydrated]);

  const loadNotifications = async () => {
    if (!currentUserId || !notificationService) return;

    try {
      setIsLoading(true);
      const data = await notificationService.getUserNotifications(
        currentUserId,
        {
          limit: maxNotifications,
          includeRead: filter === 'all',
        }
      );

      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch (error) {
      console.error('❌ Failed to load notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!supabase) return;

    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${currentUserId}`,
        },
        (payload) => {
          console.info('🔔 Real-time notification update:', payload);

          if (payload.eventType === 'INSERT') {
            const newNotification = mapDatabaseNotification(payload.new);
            setNotifications((prev) => [
              newNotification,
              ...prev.slice(0, maxNotifications - 1),
            ]);
            if (!newNotification.isRead) {
              setUnreadCount((prev) => prev + 1);
              showNotificationPreview(newNotification);
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedNotification = mapDatabaseNotification(payload.new);
            setNotifications((prev) =>
              prev.map((n) =>
                n.id === updatedNotification.id ? updatedNotification : n
              )
            );
            // Update unread count
            loadNotifications();
          } else if (payload.eventType === 'DELETE') {
            setNotifications((prev) =>
              prev.filter((n) => n.id !== payload.old.id)
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();

    return subscription;
  };

  // ============================================================================
  // NOTIFICATION PREVIEW
  // ============================================================================

  const showNotificationPreview = (notification: NotificationData) => {
    if (!showPreview) return;

    // Create toast-like preview
    const preview = document.createElement('div');
    preview.className =
      'fixed top-4 right-4 bg-white border-l-4 border-blue-500 rounded-lg shadow-lg p-4 max-w-sm z-50 transform translate-x-full transition-transform duration-300';
    preview.innerHTML = `
      <div class=""flex items-start gap-3"">
        <div class=""p-2 bg-blue-100 rounded-full"">
          ${notification.priority === 'critical' ? '🚨' : notification.priority === 'high' ? '⚠️' : '🔔'}
        </div>
        <div class=""flex-1"">
          <h4 class=""font-medium text-gray-900 text-sm"">${notification.title}</h4>
          <p class=""text-sm text-gray-600 mt-1"">${notification.message}</p>
        </div>
      </div>
    `;

    document.body.appendChild(preview);

    // Animate in
    requestAnimationFrame(() => {
      preview.style.transform = 'translateX(0)';
    });

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      preview.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(preview)) {
          document.body.removeChild(preview);
        }
      }, 300);
    }, 5000);

    // Click to dismiss
    preview.addEventListener('click', () => {
      if (onNotificationClick) {
        onNotificationClick(notification);
      }
      preview.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(preview)) {
          document.body.removeChild(preview);
        }
      }, 300);
    });
  };

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      loadNotifications();
    }
  };

  const handleMarkAsRead = async (
    notificationId: string,
    event?: React.MouseEvent
  ) => {
    if (event) {
      event.stopPropagation();
    }

    if (!notificationService) return;

    try {
      const success = await notificationService.markAsRead([notificationId]);
      if (success) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('❌ Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!notificationService) return;

    try {
      const unreadIds = notifications
        .filter((n) => !n.isRead)
        .map((n) => n.id!);
      if (unreadIds.length === 0) return;

      const success = await notificationService.markAsRead(unreadIds);
      if (success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('❌ Failed to mark all as read:', error);
    }
  };

  const handleNotificationClick = (notification: NotificationData) => {
    // Mark as read if unread
    if (!notification.isRead) {
      handleMarkAsRead(notification.id!);
    }

    // Execute callback
    if (onNotificationClick) {
      onNotificationClick(notification);
    }

    // Close dropdown
    setIsOpen(false);
  };

  const handleArchive = async (
    notificationId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();

    if (!notificationService) return;

    try {
      const success = await notificationService.archiveNotifications([
        notificationId,
      ]);
      if (success) {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        const notification = notifications.find((n) => n.id === notificationId);
        if (notification && !notification.isRead) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('❌ Failed to archive notification:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        bellRef.current &&
        !bellRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const getDropdownPosition = () => {
    switch (position) {
      case 'top-left':
        return { top: '100%', left: 0 };
      case 'bottom-right':
        return { bottom: '100%', right: 0 };
      case 'bottom-left':
        return { bottom: '100%', left: 0 };
      default:
        return { top: '100%', right: 0 };
    }
  };

  const mapDatabaseNotification = (dbNotification: any): NotificationData => {
    return {
      id: dbNotification.id,
      type: dbNotification.type,
      title: dbNotification.title,
      message: dbNotification.message,
      priority: dbNotification.priority,
      userId: dbNotification.user_id,
      tenantId: dbNotification.tenant_id,
      category: dbNotification.category,
      channels: dbNotification.channels || ['in-app'],
      data: dbNotification.data || {},
      actions: dbNotification.actions || [],
      isRead: dbNotification.read,
      isArchived: dbNotification.archived,
      createdAt: new Date(dbNotification.created_at),
      updatedAt: new Date(dbNotification.updated_at),
    };
  };

  const filteredNotifications = notifications.filter(
    (n) => filter === 'all' || !n.isRead
  );

  // ============================================================================
  // COMPONENT RENDER
  // ============================================================================

  console.info(
    '🎯 EnhancedNotificationBell RENDER - userId:',
    userId,
    'position:',
    position,
    'unreadCount:',
    unreadCount,
    'isHydrated:',
    isHydrated
  );

  // Don't render anything on server side to prevent hydration mismatch
  if (!isHydrated) {
    console.info('🔔 NotificationBell: Not hydrated yet, returning null');
    return null;
  }

  console.info('🔔 NotificationBell: RENDERING with styles:', {
    position: 'fixed',
    bottom:
      position === 'bottom-right' || position === 'bottom-left'
        ? '20px'
        : 'auto',
    right:
      position === 'bottom-right' || position === 'top-right'
        ? '100px'
        : 'auto',
    zIndex: 9999,
  });

  return (
    <div
      className='fixed z-[9999]'
      style={{
        bottom:
          position === 'bottom-right' || position === 'bottom-left'
            ? '20px'
            : 'auto',
        top:
          position === 'top-right' || position === 'top-left' ? '20px' : 'auto',
        right:
          position === 'bottom-right' || position === 'top-right'
            ? '100px'
            : 'auto',
        left:
          position === 'bottom-left' || position === 'top-left'
            ? '20px'
            : 'auto',
        pointerEvents: 'auto',
      }}
    >
      {/* DEBUG: Notification Bell Container */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '10px',
          whiteSpace: 'nowrap',
          zIndex: 10000,
        }}
      >
        BELL HERE
      </div>

      {/* Notification Bell */}
      <button
        ref={bellRef}
        onClick={handleBellClick}
        className='hover:shadow-3xl relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-yellow-400 bg-red-600 text-white shadow-2xl transition-all duration-200 hover:bg-red-700'
        aria-label='Notifications'
        style={{
          backgroundColor: '#ef4444',
          boxShadow:
            '0 8px 25px rgba(239, 68, 68, 0.6), 0 4px 15px rgba(0,0,0,0.3)',
          border: '4px solid #fbbf24',
        }}
      >
        <Bell className='h-6 w-6' />
        {unreadCount > 0 && (
          <span className='absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white'>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className='absolute z-50 w-96 rounded-lg border border-gray-200 bg-white shadow-2xl'
          style={{
            ...getDropdownPosition(),
            marginTop: position.includes('bottom') ? '-8px' : '8px',
          }}
        >
          {/* Dropdown Header */}
          <div className='flex items-center justify-between border-b border-gray-200 p-4'>
            <div>
              <h3 className='font-semibold text-gray-900'>Notifications</h3>
              <p className='text-sm text-gray-600'>
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
              </p>
            </div>

            <div className='flex items-center gap-2'>
              {/* Filter Toggle */}
              <button
                onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
                className='rounded p-1 text-gray-400 hover:text-gray-600'
              >
                <Filter className='h-4 w-4' />
              </button>

              {/* Settings */}
              <button
                onClick={() => setShowPreferences(true)}
                className='rounded p-1 text-gray-400 hover:text-gray-600'
              >
                <Settings className='h-4 w-4' />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className='max-h-96 overflow-y-auto'>
            {isLoading ? (
              <div className='p-4 text-center'>
                <div className='mx-auto h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600'></div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className='p-4 text-center'>
                <Bell className='mx-auto mb-2 h-8 w-8 text-gray-400' />
                <p className='text-sm text-gray-600'>No notifications</p>
              </div>
            ) : (
              <div className='divide-y divide-gray-100'>
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`cursor-pointer p-4 transition-colors hover:bg-gray-50 ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className='flex items-start gap-3'>
                      <div className='flex flex-shrink-0 items-center gap-2'>
                        {getPriorityIcon(notification.priority)}
                        {!notification.isRead && (
                          <div className='h-2 w-2 rounded-full bg-blue-600'></div>
                        )}
                      </div>

                      <div className='min-w-0 flex-1'>
                        <div className='mb-1 flex items-center gap-2'>
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${getTypeColor(notification.type)}`}
                          >
                            {notification.type}
                          </span>
                          <span className='text-xs text-gray-500'>
                            {formatTimestamp(notification.createdAt!)}
                          </span>
                        </div>

                        <h4 className='truncate text-sm font-medium text-gray-900'>
                          {notification.title}
                        </h4>
                        <p className='line-clamp-2 text-sm text-gray-600'>
                          {notification.message}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className='flex flex-shrink-0 items-center gap-1'>
                        {!notification.isRead && (
                          <button
                            onClick={(e) =>
                              handleMarkAsRead(notification.id!, e)
                            }
                            className='rounded p-1 text-gray-400 hover:text-blue-600'
                            title='Mark as read'
                          >
                            <Eye className='h-4 w-4' />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleArchive(notification.id!, e)}
                          className='rounded p-1 text-gray-400 hover:text-red-600'
                          title='Archive'
                        >
                          <Archive className='h-4 w-4' />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown Footer */}
          <div className='flex items-center justify-between border-t border-gray-200 p-4'>
            <button
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className='text-sm text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:text-gray-400'
            >
              Mark all read
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className='text-sm text-gray-600 hover:text-gray-700'
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Notification Preferences Modal */}
      {showPreferences && (
        <NotificationPreferences
          userId={currentUserId}
          onClose={() => setShowPreferences(false)}
        />
      )}
    </div>
  );
};

export default EnhancedNotificationBell;
