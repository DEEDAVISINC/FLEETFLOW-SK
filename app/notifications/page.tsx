'use client';

import {
  AlertTriangle,
  Ban,
  Bell,
  CheckCircle,
  ChevronDown,
  Clock,
  Filter,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function NotificationsHub() {
  // Simulated notification data
  const [liveAlerts, setLiveAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Predefined notification types and their colors
  const notificationTypes = [
    { id: 'all', label: 'All Notifications', color: '#4b5563' },
    { id: 'system', label: 'System', color: '#3b82f6' },
    { id: 'shipment', label: 'Shipment', color: '#10b981' },
    { id: 'compliance', label: 'Compliance', color: '#ef4444' },
    { id: 'billing', label: 'Billing', color: '#8b5cf6' },
    { id: 'maintenance', label: 'Maintenance', color: '#f59e0b' },
  ];

  const [selectedType, setSelectedType] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setLiveAlerts([
        {
          id: 1,
          type: 'system',
          title: 'System Maintenance',
          message: 'Scheduled maintenance will occur on Sunday at 2:00 AM EST',
          timestamp: '2023-11-15T14:30:00',
          priority: 'medium',
          isRead: false,
          actions: [{ label: 'Acknowledge', type: 'primary' }],
        },
        {
          id: 2,
          type: 'shipment',
          title: 'Load Delivered',
          message:
            'Load #FL-23456 has been delivered and signed for by recipient',
          timestamp: '2023-11-15T10:12:00',
          priority: 'low',
          isRead: false,
          actions: [
            { label: 'View POD', type: 'primary' },
            { label: 'Invoice', type: 'secondary' },
          ],
        },
        {
          id: 3,
          type: 'compliance',
          title: 'URGENT: DOT Filing Deadline',
          message: 'Your quarterly IFTA filing is due in 48 hours',
          timestamp: '2023-11-14T09:45:00',
          priority: 'high',
          isRead: false,
          actions: [{ label: 'Complete Filing', type: 'primary' }],
        },
        {
          id: 4,
          type: 'billing',
          title: 'Invoice Paid',
          message: 'Customer ABC Logistics has paid invoice #INV-34567',
          timestamp: '2023-11-13T16:20:00',
          priority: 'low',
          isRead: true,
          actions: [{ label: 'View Details', type: 'primary' }],
        },
        {
          id: 5,
          type: 'maintenance',
          title: 'Vehicle Maintenance Alert',
          message: 'Truck #T-789 is due for scheduled maintenance',
          timestamp: '2023-11-13T08:15:00',
          priority: 'medium',
          isRead: true,
          actions: [{ label: 'Schedule Service', type: 'primary' }],
        },
        {
          id: 6,
          type: 'system',
          title: 'New Feature Available',
          message:
            'Explore our new route optimization tools in the dispatch module',
          timestamp: '2023-11-12T11:00:00',
          priority: 'low',
          isRead: true,
          actions: [{ label: 'Learn More', type: 'primary' }],
        },
        {
          id: 7,
          type: 'compliance',
          title: 'ELD Compliance Alert',
          message: 'Driver John Smith has 3 HOS violations in the past week',
          timestamp: '2023-11-11T14:25:00',
          priority: 'high',
          isRead: false,
          actions: [{ label: 'Review Logs', type: 'primary' }],
        },
        {
          id: 8,
          type: 'shipment',
          title: 'Delivery Exception',
          message: 'Load #FL-23789 delayed due to weather conditions in Denver',
          timestamp: '2023-11-11T09:40:00',
          priority: 'medium',
          isRead: false,
          actions: [{ label: 'Update Customer', type: 'primary' }],
        },
        {
          id: 9,
          type: 'billing',
          title: 'Payment Reminder',
          message:
            'Invoice #INV-45678 for Customer XYZ Transport is due in 3 days',
          timestamp: '2023-11-10T15:30:00',
          priority: 'medium',
          isRead: true,
          actions: [{ label: 'Send Reminder', type: 'primary' }],
        },
        {
          id: 10,
          type: 'maintenance',
          title: 'Trailer Repair Complete',
          message: 'Trailer #TR-456 repairs completed and ready for pickup',
          timestamp: '2023-11-09T13:20:00',
          priority: 'low',
          isRead: true,
          actions: [{ label: 'View Details', type: 'primary' }],
        },
      ]);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Filter notifications based on selected type
  const filteredAlerts =
    selectedType === 'all'
      ? liveAlerts
      : liveAlerts.filter((alert) => alert.type === selectedType);

  // Format the timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Priority icon selector
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle size={16} className='text-red-500' />;
      case 'medium':
        return <Clock size={16} className='text-amber-500' />;
      case 'low':
        return <CheckCircle size={16} className='text-green-500' />;
      default:
        return null;
    }
  };

  // Get color for notification type
  const getTypeColor = (type: string) => {
    const foundType = notificationTypes.find((t) => t.id === type);
    return foundType ? foundType.color : '#4b5563';
  };

  // Toggle read status
  const toggleReadStatus = (id: number) => {
    setLiveAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.id === id ? { ...alert, isRead: !alert.isRead } : alert
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setLiveAlerts((prevAlerts) =>
      prevAlerts.map((alert) => ({ ...alert, isRead: true }))
    );
  };

  // Clear all read notifications
  const clearReadNotifications = () => {
    setLiveAlerts((prevAlerts) => prevAlerts.filter((alert) => !alert.isRead));
  };

  const handleAlertAction = (alertId: number) => {
    console.log('Alert action taken for alert:', alertId);
    // Remove alert after action is taken
    setLiveAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #fef3c7, #fbbf24)',
        minHeight: '100vh',
        padding: '80px 20px 20px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Bell size={28} style={{ color: '#2d3748' }} />
            <h1
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#2d3748',
                margin: 0,
              }}
            >
              FleetFlow Notification Hub
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={markAllAsRead}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.5)',
                color: '#2d3748',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <CheckCircle size={16} />
              Mark All Read
            </button>
            <button
              onClick={clearReadNotifications}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.5)',
                color: '#2d3748',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Ban size={16} />
              Clear Read
            </button>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'rgba(255, 255, 255, 0.5)',
                  color: '#2d3748',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Filter size={16} />
                Filter
                <ChevronDown size={16} />
              </button>
              {filterOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    width: '200px',
                    background: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 10,
                    padding: '8px',
                    marginTop: '4px',
                  }}
                >
                  {notificationTypes.map((type) => (
                    <div
                      key={type.id}
                      onClick={() => {
                        setSelectedType(type.id);
                        setFilterOpen(false);
                      }}
                      style={{
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        backgroundColor:
                          selectedType === type.id
                            ? 'rgba(59, 130, 246, 0.1)'
                            : 'transparent',
                      }}
                    >
                      <div
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: type.color,
                        }}
                      />
                      <span>{type.label}</span>
                      {selectedType === type.id && (
                        <CheckCircle
                          size={16}
                          style={{ marginLeft: 'auto', color: '#3b82f6' }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '16px',
              padding: '40px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                width: '40px',
                height: '40px',
                border: '4px solid rgba(59, 130, 246, 0.3)',
                borderTopColor: '#3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            ></div>
            <p
              style={{ marginTop: '16px', color: '#2d3748', fontWeight: '500' }}
            >
              Loading notifications...
            </p>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '16px',
              padding: '40px',
              textAlign: 'center',
            }}
          >
            <Bell
              size={48}
              style={{ color: '#9ca3af', margin: '0 auto 16px' }}
            />
            <p
              style={{ color: '#4b5563', fontWeight: '500', fontSize: '18px' }}
            >
              No{' '}
              {selectedType !== 'all'
                ? notificationTypes.find((t) => t.id === selectedType)?.label
                : ''}{' '}
              notifications at this time
            </p>
          </div>
        ) : (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                style={{
                  background: alert.isRead
                    ? 'rgba(255, 255, 255, 0.5)'
                    : 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  boxShadow: alert.isRead
                    ? 'none'
                    : '0 4px 12px rgba(0,0,0,0.05)',
                  borderLeft: `4px solid ${getTypeColor(alert.type)}`,
                  position: 'relative',
                }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px',
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        background: `${getTypeColor(alert.type)}20`,
                        color: getTypeColor(alert.type),
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                      }}
                    >
                      {alert.type}
                    </div>
                    {!alert.isRead && (
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#3b82f6',
                        }}
                      ></div>
                    )}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {getPriorityIcon(alert.priority)}
                      <span
                        style={{
                          fontSize: '12px',
                          color:
                            alert.priority === 'high'
                              ? '#ef4444'
                              : alert.priority === 'medium'
                                ? '#f59e0b'
                                : '#10b981',
                          textTransform: 'capitalize',
                        }}
                      >
                        {alert.priority}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {formatTimestamp(alert.timestamp)}
                  </div>
                </div>
                <h3
                  style={{
                    margin: '8px 0 6px',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1f2937',
                  }}
                >
                  {alert.title}
                </h3>
                <p
                  style={{
                    margin: '0 0 12px',
                    fontSize: '14px',
                    color: '#4b5563',
                  }}
                >
                  {alert.message}
                </p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {alert.actions.map((action: any, i: number) => (
                      <button
                        key={i}
                        onClick={() => handleAlertAction(alert.id)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          background:
                            action.type === 'primary'
                              ? '#3b82f6'
                              : 'rgba(0,0,0,0.05)',
                          color:
                            action.type === 'primary' ? 'white' : '#4b5563',
                          fontSize: '13px',
                          fontWeight: '500',
                          cursor: 'pointer',
                        }}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => toggleReadStatus(alert.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '13px',
                      color: '#6b7280',
                      cursor: 'pointer',
                      padding: '6px',
                    }}
                  >
                    {alert.isRead ? 'Mark as unread' : 'Mark as read'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        body {
          margin: 0;
          font-family:
            -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            'Helvetica Neue', Arial, sans-serif;
        }
      `}</style>
    </div>
  );
}
