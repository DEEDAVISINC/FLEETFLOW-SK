'use client';

import { Bell, Settings, CheckCircle, AlertTriangle, AlertCircle, Clock, Mail, Phone, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import fleetFlowNotificationManager, { FleetFlowNotification, NotificationStats } from '../services/FleetFlowNotificationManager';

interface UnifiedNotificationBellProps {
  userId?: string;
  portal: 'vendor' | 'driver' | 'dispatch' | 'admin' | 'carrier';
  position?: 'navigation' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark' | 'auto';
  showBadge?: boolean;
  showDropdown?: boolean;
  maxNotifications?: number;
}

const PRIORITY_COLORS = {
  low: '#6b7280',
  normal: '#3b82f6', 
  high: '#f59e0b',
  urgent: '#ef4444',
  critical: '#dc2626'
};

const PRIORITY_ICONS = {
  low: Clock,
  normal: Bell,
  high: AlertTriangle,
  urgent: AlertCircle,
  critical: AlertCircle
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
  onboarding_update: '🎓'
};

export default function UnifiedNotificationBell({
  userId = 'default',
  portal,
  position = 'navigation',
  size = 'md',
  theme = 'auto',
  showBadge = true,
  showDropdown = true,
  maxNotifications = 10
}: UnifiedNotificationBellProps) {
  const [notifications, setNotifications] = useState<FleetFlowNotification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    totalSent: 0,
    totalRead: 0,
    totalUnread: 0,
    byType: {},
    byPriority: {},
    byChannel: {},
    readRate: 0,
    avgResponseTime: 0
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, websocket: false, lastSync: '' });
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  // Real-time notification updates
  useEffect(() => {
    const loadNotifications = () => {
      const userNotifications = fleetFlowNotificationManager.getNotifications(
        userId, 
        portal, 
        { limit: maxNotifications }
      );
      setNotifications(userNotifications);
      
      const userStats = fleetFlowNotificationManager.getStats(userId, portal);
      setStats(userStats);
    };

    // Initial load
    loadNotifications();
    
    // Subscribe to real-time updates
    const unsubscribeAdded = fleetFlowNotificationManager.subscribe('notification_added', loadNotifications);
    const unsubscribeRead = fleetFlowNotificationManager.subscribe('notification_read', loadNotifications);
    const unsubscribeDeleted = fleetFlowNotificationManager.subscribe('notification_deleted', loadNotifications);

    // Update connection status every 10 seconds
    const statusInterval = setInterval(() => {
      setConnectionStatus(fleetFlowNotificationManager.getConnectionStatus());
    }, 10000);

    // Initial status check
    setConnectionStatus(fleetFlowNotificationManager.getConnectionStatus());

    // Cleanup
    return () => {
      unsubscribeAdded();
      unsubscribeRead();
      unsubscribeDeleted();
      clearInterval(statusInterval);
    };
  }, [userId, portal, maxNotifications]);

  // Handle click outside dropdown
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

  // Handle notification click
  const handleNotificationClick = (notification: FleetFlowNotification) => {
    if (!notification.read) {
      fleetFlowNotificationManager.markAsRead(notification.id);
    }
    
    // Handle actions
    if (notification.actions && notification.actions.length > 0) {
      const primaryAction = notification.actions[0];
      if (primaryAction.url) {
        window.open(primaryAction.url, '_blank');
      }
    }
  };

  // Mark all as read
  const handleMarkAllRead = () => {
    setIsLoading(true);
    fleetFlowNotificationManager.markAllAsRead(userId, portal);
    setTimeout(() => setIsLoading(false), 500);
  };

  // Send test notification
  const handleTestNotification = async () => {
    setIsLoading(true);
    try {
      await fleetFlowNotificationManager.sendTestNotification(userId, portal);
    } catch (error) {
      console.error('Test notification failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get theme styles
  const getThemeStyles = () => {
    const isDark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    return {
      bell: {
        background: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        color: isDark ? '#f3f4f6' : '#1f2937',
        border: `1px solid ${isDark ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.3)'}`
      },
      dropdown: {
        background: isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        border: `1px solid ${isDark ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.8)'}`,
        color: isDark ? '#f3f4f6' : '#1f2937'
      },
      notification: {
        background: isDark ? 'rgba(31, 41, 55, 0.6)' : 'rgba(249, 250, 251, 0.8)',
        hover: isDark ? 'rgba(55, 65, 81, 0.8)' : 'rgba(243, 244, 246, 0.9)',
        border: `1px solid ${isDark ? 'rgba(75, 85, 99, 0.2)' : 'rgba(229, 231, 235, 0.6)'}`
      }
    };
  };

  const themeStyles = getThemeStyles();
  const unreadCount = stats.totalUnread;
  const hasUrgent = notifications.some(n => !n.read && ['urgent', 'critical'].includes(n.priority));

  // Size configurations
  const sizeConfig = {
    sm: { bell: 32, icon: 16, badge: 16 },
    md: { bell: 40, icon: 20, badge: 20 },
    lg: { bell: 48, icon: 24, badge: 24 }
  };

  const config = sizeConfig[size];

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Notification Bell Button */}
      <button
        ref={bellRef}
        onClick={() => showDropdown && setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          width: `${config.bell}px`,
          height: `${config.bell}px`,
          borderRadius: '50%',
          ...themeStyles.bell,
          backdropFilter: 'blur(10px)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          transform: 'scale(1)',
          animation: hasUrgent ? 'pulse 2s infinite' : 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.background = theme === 'dark' 
            ? 'rgba(55, 65, 81, 0.9)' 
            : 'rgba(243, 244, 246, 0.95)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.background = themeStyles.bell.background;
        }}
        aria-label={`Notifications (${unreadCount} unread)`}
        title={`${unreadCount} unread notifications`}
      >
        <Bell 
          size={config.icon} 
          style={{ 
            color: hasUrgent ? '#ef4444' : 'currentColor',
            animation: hasUrgent ? 'shake 0.5s ease-in-out infinite' : 'none'
          }} 
        />
        
        {/* Badge */}
        {showBadge && unreadCount > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              minWidth: `${config.badge}px`,
              height: `${config.badge}px`,
              borderRadius: '50%',
              background: hasUrgent 
                ? 'linear-gradient(135deg, #dc2626, #ef4444)' 
                : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              fontSize: `${config.badge - 8}px`,
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              animation: 'pulse 2s infinite',
              zIndex: 10
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}

        {/* Connection Status Indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '2px',
            right: '2px',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: connectionStatus.connected 
              ? 'linear-gradient(135deg, #10b981, #059669)' 
              : 'linear-gradient(135deg, #f59e0b, #d97706)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            animation: connectionStatus.websocket ? 'pulse 3s infinite' : 'none'
          }}
          title={`Connection: ${connectionStatus.connected ? 'Connected' : 'Disconnected'}`}
        />
      </button>

      {/* Notification Dropdown */}
      {showDropdown && isOpen && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: position === 'navigation' ? '100%' : 'auto',
            right: position === 'navigation' ? '0' : 'auto',
            left: position === 'inline' ? '0' : 'auto',
            marginTop: position === 'navigation' ? '8px' : '0',
            width: '380px',
            maxHeight: '500px',
            ...themeStyles.dropdown,
            backdropFilter: 'blur(15px)',
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            zIndex: 1000,
            overflow: 'hidden',
            animation: 'fadeInDown 0.3s ease-out'
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
              color: 'white',
              padding: '16px 20px',
              borderRadius: '16px 16px 0 0'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
                  🔔 Notifications
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '12px', opacity: 0.8 }}>
                  {unreadCount} unread • {portal.charAt(0).toUpperCase() + portal.slice(1)} Portal
                </p>
              </div>
              
              {/* Connection Status */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '10px',
                  opacity: 0.9
                }}
                title={`Last sync: ${new Date(connectionStatus.lastSync).toLocaleTimeString()}`}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: connectionStatus.connected ? '#10b981' : '#f59e0b',
                    animation: connectionStatus.websocket ? 'pulse 2s infinite' : 'none'
                  }}
                />
                {connectionStatus.connected ? 'Live' : 'Offline'}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div
            style={{
              padding: '12px 20px',
              background: 'rgba(20, 184, 166, 0.1)',
              borderBottom: `1px solid ${themeStyles.dropdown.border.split(' ')[2]}`
            }}
          >
            <div style={{ display: 'flex', gap: '16px', fontSize: '11px' }}>
              <span>📊 Total: {stats.totalSent}</span>
              <span>✅ Read: {stats.totalRead}</span>
              <span>🔔 Unread: {stats.totalUnread}</span>
              <span>📈 Rate: {stats.readRate.toFixed(0)}%</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              padding: '12px 20px',
              borderBottom: `1px solid ${themeStyles.dropdown.border.split(' ')[2]}`,
              display: 'flex',
              gap: '8px'
            }}
          >
            <button
              onClick={handleMarkAllRead}
              disabled={isLoading || unreadCount === 0}
              style={{
                flex: 1,
                padding: '6px 12px',
                background: isLoading ? 'rgba(156, 163, 175, 0.3)' : 'rgba(16, 185, 129, 0.2)',
                color: isLoading ? '#9ca3af' : '#059669',
                border: `1px solid ${isLoading ? 'rgba(156, 163, 175, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '600',
                cursor: isLoading || unreadCount === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {isLoading ? '⏳' : '✅'} Mark All Read
            </button>
            
            <Link href="/notifications">
              <button
                style={{
                  padding: '6px 12px',
                  background: 'rgba(59, 130, 246, 0.2)',
                  color: '#2563eb',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => setIsOpen(false)}
              >
                📋 View All
              </button>
            </Link>

            <button
              onClick={handleTestNotification}
              disabled={isLoading}
              style={{
                padding: '6px 12px',
                background: isLoading ? 'rgba(156, 163, 175, 0.3)' : 'rgba(245, 158, 11, 0.2)',
                color: isLoading ? '#9ca3af' : '#d97706',
                border: `1px solid ${isLoading ? 'rgba(156, 163, 175, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🧪 Test
            </button>
          </div>

          {/* Notification List */}
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div
                style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: 'rgba(156, 163, 175, 0.8)',
                  fontSize: '14px'
                }}
              >
                <Bell size={32} style={{ opacity: 0.3, marginBottom: '12px' }} />
                <p style={{ margin: 0 }}>No notifications yet</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>Stay tuned for updates!</p>
              </div>
            ) : (
              notifications.map((notification, index) => {
                const PriorityIcon = PRIORITY_ICONS[notification.priority];
                const typeIcon = TYPE_ICONS[notification.type] || '🔔';
                
                return (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    style={{
                      padding: '16px 20px',
                      ...themeStyles.notification,
                      borderBottom: index < notifications.length - 1 
                        ? `1px solid ${themeStyles.notification.border.split(' ')[2]}`
                        : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: notification.read ? 0.7 : 1,
                      borderLeft: !notification.read 
                        ? `4px solid ${PRIORITY_COLORS[notification.priority]}`
                        : '4px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = themeStyles.notification.hover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = themeStyles.notification.background;
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      {/* Type Icon */}
                      <div
                        style={{
                          fontSize: '18px',
                          lineHeight: 1,
                          marginTop: '2px'
                        }}
                      >
                        {typeIcon}
                      </div>
                      
                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <h4
                            style={{
                              margin: 0,
                              fontSize: '13px',
                              fontWeight: notification.read ? '500' : '600',
                              color: 'currentColor',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              flex: 1
                            }}
                          >
                            {notification.title}
                          </h4>
                          
                          {/* Priority Indicator */}
                          <PriorityIcon 
                            size={12} 
                            style={{ 
                              color: PRIORITY_COLORS[notification.priority],
                              flexShrink: 0
                            }} 
                          />
                        </div>
                        
                        <p
                          style={{
                            margin: '0 0 8px 0',
                            fontSize: '12px',
                            color: 'currentColor',
                            opacity: 0.8,
                            lineHeight: 1.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {notification.message}
                        </p>
                        
                        {/* Meta Info */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', opacity: 0.6 }}>
                            <span>⏰ {new Date(notification.timestamp).toLocaleTimeString()}</span>
                            
                            {/* Channel indicators */}
                            <div style={{ display: 'flex', gap: '4px' }}>
                              {notification.channels.sms && <Smartphone size={10} title="SMS sent" />}
                              {notification.channels.email && <Mail size={10} title="Email sent" />}
                              {notification.channels.push && <Bell size={10} title="Push notification" />}
                            </div>
                          </div>
                          
                          {/* Read Status */}
                          {!notification.read && (
                            <div
                              style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: PRIORITY_COLORS[notification.priority],
                                flexShrink: 0
                              }}
                            />
                          )}
                        </div>

                        {/* Actions */}
                        {notification.actions && notification.actions.length > 0 && (
                          <div style={{ marginTop: '8px', display: 'flex', gap: '6px' }}>
                            {notification.actions.slice(0, 2).map((action) => (
                              <button
                                key={action.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (action.url) {
                                    window.open(action.url, '_blank');
                                  }
                                }}
                                style={{
                                  padding: '4px 8px',
                                  fontSize: '10px',
                                  fontWeight: '600',
                                  borderRadius: '4px',
                                  border: 'none',
                                  background: action.style === 'danger' 
                                    ? 'rgba(239, 68, 68, 0.2)' 
                                    : 'rgba(59, 130, 246, 0.2)',
                                  color: action.style === 'danger' ? '#dc2626' : '#2563eb',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '12px 20px',
              background: 'rgba(20, 184, 166, 0.05)',
              borderTop: `1px solid ${themeStyles.dropdown.border.split(' ')[2]}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '10px',
              opacity: 0.8
            }}
          >
            <div>
              FleetFlow Unified Notifications
            </div>
            <Link 
              href="/settings/notifications"
              style={{
                color: '#14b8a6',
                textDecoration: 'none',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              onClick={() => setIsOpen(false)}
            >
              <Settings size={10} />
              Settings
            </Link>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        
        @keyframes fadeInDown {
          from { 
            opacity: 0; 
            transform: translateY(-10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
    </div>
  );
}
