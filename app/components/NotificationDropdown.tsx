'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect, useRef, useState } from 'react';
import { IntraofficeMessage, MessageService } from '../services/MessageService';
import { NotificationService } from '../services/NotificationService';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  isRead: boolean;
  timestamp: string;
  actions?: Array<{
    type: string;
    label: string;
    payload: any;
  }>;
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  maxNotifications?: number;
  onComposeMessage?: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  userId,
  maxNotifications = 10,
  onComposeMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'messages'>(
    'notifications'
  );
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [messages, setMessages] = useState<IntraofficeMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationService = new NotificationService();
  const messageService = new MessageService();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Load notifications and messages
  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      setLoading(true);
      try {
        // Load notifications
        const notificationResult =
          await notificationService.getUserNotifications(userId, {
            limit: maxNotifications,
            includeRead: true,
          });

        if (notificationResult.success && notificationResult.notifications) {
          setNotifications(notificationResult.notifications);
        }

        // Load messages
        const messageResult = await messageService.getUserMessages(
          userId,
          {
            unreadOnly: false,
          },
          maxNotifications
        );

        if (messageResult.messages) {
          setMessages(messageResult.messages);
        }
      } catch (error) {
        console.error('Failed to load notifications and messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isOpen, userId, maxNotifications]);

  // Real-time updates
  useEffect(() => {
    if (!isOpen) return;

    const subscription = supabase
      .channel('notifications_and_messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.info('🔔 Real-time notification update:', payload);
          loadData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'intraoffice_messages',
          filter: `to_user_ids.cs.{${userId}}`,
        },
        (payload) => {
          console.info('📬 Real-time message update:', payload);
          loadData();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [isOpen, userId]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);

      for (const id of unreadIds) {
        await notificationService.markNotificationAsRead(id);
      }

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read when clicked
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }

    // Handle navigation actions
    if (notification.actions && notification.actions.length > 0) {
      const primaryAction = notification.actions[0];
      if (primaryAction.type === 'navigate' && primaryAction.payload.url) {
        window.location.href = primaryAction.payload.url;
      }
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '#ef4444';
      case 'high':
        return '#f97316';
      case 'normal':
        return '#3b82f6';
      case 'low':
        return '#6b7280';
      default:
        return '#3b82f6';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Helper function to load all data
  const loadData = async () => {
    setLoading(true);
    try {
      // Load notifications
      const notificationResult = await notificationService.getUserNotifications(
        userId,
        {
          limit: maxNotifications,
          includeRead: true,
        }
      );

      if (notificationResult.success && notificationResult.notifications) {
        setNotifications(notificationResult.notifications);
      }

      // Load messages
      const messageResult = await messageService.getUserMessages(
        userId,
        {
          unreadOnly: false,
        },
        maxNotifications
      );

      if (messageResult.messages) {
        setMessages(messageResult.messages);
      }
    } catch (error) {
      console.error('Failed to load notifications and messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkMessageAsRead = async (messageId: string) => {
    try {
      await messageService.markMessageAsRead(messageId, userId);
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, isRead: true } : m))
      );
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  };

  const handleMessageClick = (message: IntraofficeMessage) => {
    // Mark as read when clicked
    if (!message.isRead) {
      handleMarkMessageAsRead(message.id!);
    }

    // Navigate to message details
    window.location.href = `/messages/${message.id}`;
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      style={{
        position: 'fixed',
        bottom: '85px',
        right: '20px',
        width: '380px',
        maxHeight: '500px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow:
          '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        zIndex: 10000,
        overflow: 'hidden',
      }}
    >
      {/* Header with Tabs */}
      <div
        style={{
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
        }}
      >
        {/* Tab Navigation */}
        <div style={{ display: 'flex', padding: '16px 20px 0' }}>
          <button
            onClick={() => setActiveTab('notifications')}
            style={{
              flex: 1,
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: activeTab === 'notifications' ? '600' : '500',
              color: activeTab === 'notifications' ? '#3b82f6' : '#6b7280',
              backgroundColor:
                activeTab === 'notifications' ? '#eff6ff' : 'transparent',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            🔔 Notifications
            {notifications.filter((n) => !n.isRead).length > 0 && (
              <span
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {notifications.filter((n) => !n.isRead).length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            style={{
              flex: 1,
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: activeTab === 'messages' ? '600' : '500',
              color: activeTab === 'messages' ? '#3b82f6' : '#6b7280',
              backgroundColor:
                activeTab === 'messages' ? '#eff6ff' : 'transparent',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            📬 Messages
            {messages.filter((m) => !m.isRead).length > 0 && (
              <span
                style={{
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {messages.filter((m) => !m.isRead).length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Actions */}
        <div
          style={{
            padding: '12px 20px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {activeTab === 'notifications' ? (
            <>
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827',
                }}
              >
                Recent Activity
              </span>
              {notifications.some((n) => !n.isRead) && (
                <button
                  onClick={handleMarkAllAsRead}
                  style={{
                    fontSize: '12px',
                    color: '#6366f1',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Mark all read
                </button>
              )}
            </>
          ) : (
            <>
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827',
                }}
              >
                Recent Messages
              </span>
              <button
                onClick={onComposeMessage}
                style={{
                  fontSize: '12px',
                  color: '#6366f1',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                ✏️ Compose
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div
        style={{
          maxHeight: '400px',
          overflowY: 'auto',
        }}
      >
        {loading ? (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#6b7280',
            }}
          >
            Loading{' '}
            {activeTab === 'notifications' ? 'notifications' : 'messages'}...
          </div>
        ) : activeTab === 'notifications' ? (
          // Notifications Tab
          notifications.length === 0 ? (
            <div
              style={{
                padding: '40px 20px',
                textAlign: 'center',
                color: '#6b7280',
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔕</div>
              <div>No notifications yet</div>
              <div style={{ fontSize: '14px', marginTop: '4px' }}>
                You're all caught up!
              </div>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid #f3f4f6',
                  cursor: 'pointer',
                  backgroundColor: notification.isRead ? 'white' : '#f0f9ff',
                  transition: 'background-color 0.2s ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = notification.isRead
                    ? '#f9fafb'
                    : '#e0f2fe';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = notification.isRead
                    ? 'white'
                    : '#f0f9ff';
                }}
              >
                {/* Unread indicator */}
                {!notification.isRead && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: getPriorityColor(notification.priority),
                    }}
                  />
                )}

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                  }}
                >
                  <div style={{ fontSize: '16px', marginTop: '2px' }}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: notification.isRead ? 'normal' : '600',
                        color: '#111827',
                        marginBottom: '4px',
                        lineHeight: '1.4',
                      }}
                    >
                      {notification.title}
                    </div>
                    <div
                      style={{
                        fontSize: '13px',
                        color: '#6b7280',
                        lineHeight: '1.4',
                        marginBottom: '6px',
                      }}
                    >
                      {notification.message}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#9ca3af',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span>{formatTimestamp(notification.timestamp)}</span>
                      {notification.priority === 'urgent' && (
                        <span
                          style={{
                            color: '#ef4444',
                            fontWeight: '600',
                            fontSize: '11px',
                          }}
                        >
                          URGENT
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )
        ) : // Messages Tab
        messages.length === 0 ? (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#6b7280',
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📪</div>
            <div>No messages yet</div>
            <div style={{ fontSize: '14px', marginTop: '4px' }}>
              Your inbox is empty
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              onClick={() => handleMessageClick(message)}
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #f3f4f6',
                cursor: 'pointer',
                backgroundColor: message.isRead ? 'white' : '#fef7e0',
                transition: 'background-color 0.2s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = message.isRead
                  ? '#f9fafb'
                  : '#fde68a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = message.isRead
                  ? 'white'
                  : '#fef7e0';
              }}
            >
              {/* Unread indicator */}
              {!message.isRead && (
                <div
                  style={{
                    position: 'absolute',
                    left: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: '#f59e0b',
                  }}
                />
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <div style={{ fontSize: '16px', marginTop: '2px' }}>
                  {message.messageType === 'direct_message'
                    ? '💬'
                    : message.messageType === 'announcement'
                      ? '📢'
                      : message.messageType === 'memo'
                        ? '📝'
                        : message.messageType === 'urgent_notice'
                          ? '🚨'
                          : '📧'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      marginBottom: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>{message.fromUserName}</span>
                    {message.priority === 'urgent' && (
                      <span
                        style={{
                          color: '#ef4444',
                          fontWeight: '600',
                          fontSize: '10px',
                        }}
                      >
                        URGENT
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: message.isRead ? 'normal' : '600',
                      color: '#111827',
                      marginBottom: '4px',
                      lineHeight: '1.4',
                    }}
                  >
                    {message.subject}
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#6b7280',
                      lineHeight: '1.4',
                      marginBottom: '6px',
                    }}
                  >
                    {message.content.length > 80
                      ? `${message.content.substring(0, 80)}...`
                      : message.content}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#9ca3af',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>
                      {formatTimestamp(message.createdAt.toISOString())}
                    </span>
                    {message.requiresAcknowledgment && (
                      <span
                        style={{
                          color: '#f59e0b',
                          fontWeight: '500',
                          fontSize: '11px',
                        }}
                      >
                        ACK REQUIRED
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '12px 20px',
          borderTop: '1px solid #e5e7eb',
          textAlign: 'center',
          backgroundColor: '#f9fafb',
        }}
      >
        <button
          onClick={() => {
            window.location.href =
              activeTab === 'notifications' ? '/notifications' : '/messages';
          }}
          style={{
            fontSize: '13px',
            color: '#6366f1',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          {activeTab === 'notifications'
            ? 'View all notifications'
            : 'View all messages'}{' '}
          →
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
