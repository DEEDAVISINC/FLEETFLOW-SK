import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { FaBell } from 'react-icons/fa';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface Notification {
  id: string;
  message: string;
  type: string;
  read: boolean;
  timestamp: string;
  link?: string;
  user_id: string;
}

export default function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!userId) return;

    // Fetch initial notifications
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      setNotifications(data || []);
    };

    fetchNotifications();

    // Set up real-time subscription
    const subscription = supabase
      .channel('notifications')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotifications(prev => [payload.new as Notification, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setNotifications(prev => 
              prev.map(n => n.id === payload.new.id ? payload.new as Notification : n)
            );
          } else if (payload.eventType === 'DELETE') {
            setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.read);
    
    for (const notification of unreadNotifications) {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notification.id);

      if (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => {
          setOpen((v) => !v);
          if (!open) markAllRead();
        }}
        style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}
        aria-label="Notifications"
      >
        <FaBell size={24} color="#fff" />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4,
            background: 'red', color: 'white', borderRadius: '50%',
            padding: '2px 6px', fontSize: '0.75rem', fontWeight: 'bold',
            zIndex: 2
          }}>{unreadCount}</span>
        )}
      </button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '120%', minWidth: 320, background: 'white',
          border: '1px solid #e5e7eb', borderRadius: 12, boxShadow: '0 8px 32px rgba(31,38,135,0.2)',
          zIndex: 10000, padding: 16
        }}>
          <h4 style={{ margin: 0, marginBottom: 8, fontWeight: 600 }}>Notifications</h4>
          {notifications.length === 0 && <div style={{ color: '#888' }}>No notifications</div>}
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {notifications.map((n) => (
              <li key={n.id} style={{
                background: n.read ? 'transparent' : 'rgba(33,150,243,0.08)',
                borderRadius: 8, marginBottom: 8, padding: 8, fontWeight: n.read ? 400 : 600
              }}>
                {n.link ? (
                  <a href={n.link} style={{ color: '#1976d2', textDecoration: 'underline' }}>{n.message}</a>
                ) : n.message}
                <span style={{ float: 'right', fontSize: '0.8em', color: '#888' }}>
                  {formatTimestamp(n.timestamp)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
