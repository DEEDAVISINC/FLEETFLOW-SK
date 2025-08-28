'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { MessageService } from '../services/MessageService';
import { NotificationService } from '../services/NotificationService';
import MessageComposer from './MessageComposer';
import NotificationDropdown from './NotificationDropdown';

interface NotificationBellProps {
  userId: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  userId,
  position = 'bottom-right',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  const notificationService = new NotificationService();
  const messageService = new MessageService();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Hydration fix
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Load unread counts for both notifications and messages
  const loadUnreadCounts = async () => {
    if (!isHydrated) return;

    try {
      // Load unread notifications
      const notifications = await notificationService.getUserNotifications(
        userId,
        {
          limit: 50,
          includeRead: false, // Only unread
        }
      );

      if (notifications && Array.isArray(notifications)) {
        setUnreadCount(notifications.length);
      }

      // Load unread messages
      const messageResult = await messageService.getUserMessages(
        userId,
        {
          unreadOnly: true,
        },
        50
      );

      if (messageResult.messages) {
        setUnreadMessageCount(messageResult.messages.length);
      }
    } catch (error) {
      console.error('Failed to load unread counts:', error);
    }
  };

  // Initial load
  useEffect(() => {
    if (isHydrated) {
      loadUnreadCounts();
    }
  }, [isHydrated, userId]);

  // Real-time updates for unread counts
  useEffect(() => {
    if (!isHydrated) return;

    const subscription = supabase
      .channel('notification_bell')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('🔔 Bell: Real-time notification update:', payload);
          // Reload unread counts
          loadUnreadCounts();
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
          console.log('📬 Bell: Real-time message update:', payload);
          // Reload unread counts
          loadUnreadCounts();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [isHydrated, userId]);

  const handleBellClick = () => {
    setIsOpen(!isOpen);
  };

  const handleDropdownClose = () => {
    setIsOpen(false);
    // Reload unread counts when dropdown closes
    loadUnreadCounts();
  };

  const handleComposeMessage = () => {
    setIsOpen(false);
    setComposerOpen(true);
  };

  const handleComposerClose = () => {
    setComposerOpen(false);
  };

  if (!isHydrated) {
    return null; // Prevent hydration mismatch
  }

  const getPositionStyles = () => {
    const baseStyles = {
      position: 'fixed' as const,
      zIndex: 9999,
    };

    switch (position) {
      case 'bottom-right':
        return { ...baseStyles, bottom: '20px', right: '90px' };
      case 'bottom-left':
        return { ...baseStyles, bottom: '20px', left: '20px' };
      case 'top-right':
        return { ...baseStyles, top: '20px', right: '90px' };
      case 'top-left':
        return { ...baseStyles, top: '20px', left: '20px' };
      default:
        return { ...baseStyles, bottom: '20px', right: '90px' };
    }
  };

  return (
    <>
      {/* Notification Bell Button */}
      <div style={getPositionStyles()} onClick={handleBellClick}>
        <div
          style={{
            width: '56px',
            height: '56px',
            backgroundColor: '#f59e0b',
            borderRadius: '50%',
            border: '3px solid white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow =
              '0 6px 20px rgba(245, 158, 11, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow =
              '0 4px 12px rgba(245, 158, 11, 0.3)';
          }}
        >
          🔔
          {/* Unread Badge - Combined notifications and messages */}
          {(unreadCount > 0 || unreadMessageCount > 0) && (
            <div
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '18px',
                height: '18px',
                backgroundColor: unreadMessageCount > 0 ? '#f59e0b' : '#ef4444',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 'bold',
                color: 'white',
                border: '2px solid white',
              }}
            >
              {(() => {
                const totalUnread = unreadCount + unreadMessageCount;
                return totalUnread > 99 ? '99+' : totalUnread;
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Notification Dropdown with Messages */}
      <NotificationDropdown
        isOpen={isOpen}
        onClose={handleDropdownClose}
        userId={userId}
        maxNotifications={15}
        onComposeMessage={handleComposeMessage}
      />

      {/* Message Composer */}
      <MessageComposer isOpen={composerOpen} onClose={handleComposerClose} />
    </>
  );
};

export default NotificationBell;
