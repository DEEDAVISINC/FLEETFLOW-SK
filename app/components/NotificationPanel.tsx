'use client';

import { useEffect, useState } from 'react';
import {
  Notification,
  notificationService,
} from '../services/NotificationService';

interface NotificationPanelProps {
  userId: string;
}

export default function NotificationPanel({ userId }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, [userId, filter]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const notifs = await notificationService.getNotifications(userId, {
        unreadOnly: filter === 'UNREAD',
        limit: 50,
      });
      setNotifications(notifs);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount(userId);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId, userId);
      await loadNotifications();
      await loadUnreadCount();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(userId);
      await loadNotifications();
      await loadUnreadCount();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '700',
              margin: '0 0 8px 0',
              color: '#06b6d4',
            }}
          >
            🔔 Notifications
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0' }}>
            Stay updated on shipments, documents, and messages
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            style={{
              padding: '10px 20px',
              background: 'rgba(6, 182, 212, 0.2)',
              border: '1px solid #06b6d4',
              borderRadius: '8px',
              color: '#06b6d4',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            ✓ Mark All Read
          </button>
        )}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button
          onClick={() => setFilter('ALL')}
          style={{
            padding: '8px 20px',
            background:
              filter === 'ALL'
                ? 'rgba(6, 182, 212, 0.2)'
                : 'rgba(255, 255, 255, 0.05)',
            border:
              filter === 'ALL'
                ? '1px solid #06b6d4'
                : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: filter === 'ALL' ? '#06b6d4' : 'rgba(255,255,255,0.7)',
            fontSize: '14px',
            cursor: 'pointer',
            fontWeight: filter === 'ALL' ? '600' : '400',
          }}
        >
          All
        </button>
        <button
          onClick={() => setFilter('UNREAD')}
          style={{
            padding: '8px 20px',
            background:
              filter === 'UNREAD'
                ? 'rgba(6, 182, 212, 0.2)'
                : 'rgba(255, 255, 255, 0.05)',
            border:
              filter === 'UNREAD'
                ? '1px solid #06b6d4'
                : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: filter === 'UNREAD' ? '#06b6d4' : 'rgba(255,255,255,0.7)',
            fontSize: '14px',
            cursor: 'pointer',
            fontWeight: filter === 'UNREAD' ? '600' : '400',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          Unread
          {unreadCount > 0 && (
            <span
              style={{
                background: '#ef4444',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600',
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div
          style={{
            textAlign: 'center',
            padding: '40px',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          Loading notifications...
        </div>
      ) : notifications.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔔</div>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0' }}>
            {filter === 'UNREAD'
              ? "You're all caught up! No unread notifications."
              : 'No notifications yet.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => {
                if (!notification.read) {
                  handleMarkAsRead(notification.id);
                }
                if (notification.actionUrl) {
                  window.location.href = notification.actionUrl;
                }
              }}
              style={{
                background: notification.read
                  ? 'rgba(255, 255, 255, 0.03)'
                  : 'rgba(6, 182, 212, 0.08)',
                borderRadius: '12px',
                padding: '16px',
                border: notification.read
                  ? '1px solid rgba(255, 255, 255, 0.05)'
                  : '1px solid rgba(6, 182, 212, 0.2)',
                cursor: notification.actionUrl ? 'pointer' : 'default',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (notification.actionUrl) {
                  e.currentTarget.style.transform = 'translateX(4px)';
                  e.currentTarget.style.background = 'rgba(6, 182, 212, 0.12)';
                }
              }}
              onMouseLeave={(e) => {
                if (notification.actionUrl) {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.background = notification.read
                    ? 'rgba(255, 255, 255, 0.03)'
                    : 'rgba(6, 182, 212, 0.08)';
                }
              }}
            >
              <div
                style={{ display: 'flex', gap: '16px', alignItems: 'start' }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: `${notification.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    flexShrink: 0,
                  }}
                >
                  {notification.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      gap: '12px',
                      marginBottom: '4px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '15px',
                        fontWeight: '600',
                        color: notification.color,
                      }}
                    >
                      {notification.title}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255,255,255,0.5)',
                        flexShrink: 0,
                      }}
                    >
                      {getTimeAgo(notification.timestamp)}
                    </div>
                  </div>
                  <p
                    style={{
                      margin: '0',
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.8)',
                      lineHeight: '1.5',
                    }}
                  >
                    {notification.message}
                  </p>
                  {notification.priority === 'HIGH' && (
                    <div
                      style={{
                        marginTop: '8px',
                        display: 'inline-block',
                        padding: '4px 10px',
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid #ef4444',
                        borderRadius: '6px',
                        fontSize: '11px',
                        color: '#ef4444',
                        fontWeight: '600',
                      }}
                    >
                      ⚠️ HIGH PRIORITY
                    </div>
                  )}
                </div>

                {/* Unread indicator */}
                {!notification.read && (
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#06b6d4',
                      flexShrink: 0,
                      marginTop: '6px',
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
