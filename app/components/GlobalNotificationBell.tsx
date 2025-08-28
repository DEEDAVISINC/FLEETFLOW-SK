'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

// Department-specific notification sounds
const DEPARTMENT_SOUNDS = {
  dispatcher: '/sounds/dispatcher-chime.mp3',
  broker: '/sounds/broker-alert.mp3',
  driver: '/sounds/driver-beep.mp3',
  admin: '/sounds/admin-tone.mp3',
  carrier: '/sounds/carrier-notification.mp3',
};

// Notification types for intraoffice communication
interface IntraofficeNotification {
  id: string;
  type:
    | 'intraoffice'
    | 'emergency'
    | 'load'
    | 'dispatch'
    | 'compliance'
    | 'system'
    | 'lead_conversion'
    | 'onboarding_active'
    | 'onboarding_pending'
    | 'onboarding_completed'
    | 'onboarding_stuck'
    | 'onboarding_upcoming';
  priority: 'low' | 'normal' | 'high' | 'urgent' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  fromDepartment: string;
  toDepartment: string;
  fromUser: string;
  toUser: string;
  requiresResponse: boolean;
  metadata?: {
    loadId?: string;
    action?: string;
    department?: string;
    leadId?: string;
    customerName?: string;
    potentialValue?: number;
    source?: string;
    conversionType?: string;
    onboardingId?: string;
    step?: string;
    progress?: number;
  };
}

interface NotificationBellProps {
  department: 'dispatcher' | 'broker' | 'driver' | 'admin' | 'carrier';
  position?: 'navigation' | 'driver-portal';
  className?: string;
}

export default function GlobalNotificationBell({
  department,
  position = 'navigation',
  className = '',
}: NotificationBellProps) {
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<IntraofficeNotification[]>(
    []
  );
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate onboarding progress notifications based on role (SSR-safe)
  const generateOnboardingNotifications = (): IntraofficeNotification[] => {
    if (!mounted) return []; // Return empty during SSR

    const onboardingNotifications: IntraofficeNotification[] = [];

    // Role-based onboarding notifications
    if (department === 'admin') {
      onboardingNotifications.push(
        {
          id: 'ONBOARD-001',
          type: 'onboarding_stuck',
          priority: 'urgent',
          title: '🚨 Onboarding Alert: Global Freight Inc',
          message:
            'Carrier onboarding stuck at Document Upload step for 5 days - requires attention',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false,
          fromDepartment: 'system',
          toDepartment: 'admin',
          fromUser: 'Onboarding System',
          toUser: 'Admin Team',
          requiresResponse: true,
          metadata: {
            onboardingId: 'ONB-2024-001',
            step: 'document_upload',
            progress: 45,
            action: 'review_documents',
          },
        },
        {
          id: 'ONBOARD-002',
          type: 'onboarding_pending',
          priority: 'normal',
          title: '⏳ Pending Review: TechTrans Solutions',
          message:
            'Factoring setup completed - waiting for final agreement approval',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          read: false,
          fromDepartment: 'system',
          toDepartment: 'admin',
          fromUser: 'Onboarding System',
          toUser: 'Admin Team',
          requiresResponse: false,
          metadata: {
            onboardingId: 'ONB-2024-002',
            step: 'factoring_approval',
            progress: 85,
            action: 'approve_factoring',
          },
        }
      );
    }

    if (department === 'dispatcher') {
      onboardingNotifications.push({
        id: 'ONBOARD-003',
        type: 'onboarding_completed',
        priority: 'low',
        title: '✅ New Driver Ready: Carlos Rodriguez',
        message:
          'Driver onboarding completed successfully - portal access activated',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        read: false,
        fromDepartment: 'system',
        toDepartment: 'dispatcher',
        fromUser: 'Onboarding System',
        toUser: 'Dispatch Team',
        requiresResponse: false,
        metadata: {
          onboardingId: 'ONB-2024-003',
          step: 'completed',
          progress: 100,
          action: 'assign_loads',
        },
      });
    }

    if (department === 'carrier' || department === 'broker') {
      onboardingNotifications.push({
        id: 'ONBOARD-004',
        type: 'onboarding_upcoming',
        priority: 'normal',
        title: '📅 Scheduled Onboarding: Maria Garcia',
        message: 'Driver onboarding scheduled for tomorrow at 9:00 AM',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        read: false,
        fromDepartment: 'system',
        toDepartment: department,
        fromUser: 'Onboarding System',
        toUser: 'Operations Team',
        requiresResponse: false,
        metadata: {
          onboardingId: 'ONB-2024-004',
          step: 'scheduled',
          progress: 0,
          action: 'prepare_session',
        },
      });
    }

    if (department === 'driver') {
      // Driver-specific onboarding notifications
      onboardingNotifications.push(
        {
          id: 'ONBOARD-DRIVER-001',
          type: 'onboarding_active',
          priority: 'high',
          title: '📋 Complete Your Onboarding',
          message:
            'Your onboarding is 66% complete - please upload your insurance certificate',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          read: false,
          fromDepartment: 'system',
          toDepartment: 'driver',
          fromUser: 'Onboarding System',
          toUser: 'Driver',
          requiresResponse: true,
          metadata: {
            onboardingId: 'ONB-DRIVER-001',
            step: 'insurance_upload',
            progress: 66,
            action: 'upload_insurance',
          },
        },
        {
          id: 'ONBOARD-DRIVER-002',
          type: 'onboarding_pending',
          priority: 'normal',
          title: '🔄 Complete Your Profile Setup',
          message: 'Please complete your driver profile - 2 steps remaining',
          timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
          read: false,
          fromDepartment: 'system',
          toDepartment: 'driver',
          fromUser: 'Onboarding System',
          toUser: 'Driver',
          requiresResponse: true,
          metadata: {
            onboardingId: 'ONB-DRIVER-002',
            step: 'profile_completion',
            progress: 80,
            action: 'complete_profile',
          },
        }
      );
    }

    return onboardingNotifications;
  };

  // No mock notifications - will use real service data (SSR-safe)
  const mockNotifications: IntraofficeNotification[] = [];

  // Function to fetch live lead conversion notifications
  const fetchLeadConversions = async () => {
    try {
      // Add timeout and better error handling
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(
        '/api/ai-flow/lead-conversion?tenantId=tenant-demo-123&limit=5',
        {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.recentConversions) {
          // Convert API data to notification format
          const leadNotifications: IntraofficeNotification[] =
            data.data.recentConversions.map((conversion: any) => ({
              id: `LEAD-${conversion.id}`,
              type: 'lead_conversion' as const,
              priority: conversion.priority === 'urgent' ? 'urgent' : 'high',
              title: getConversionTitle(
                conversion.conversionType,
                conversion.customerType
              ),
              message: `${getSourceLabel(conversion.source)} generated lead converted! ${conversion.customerName} ${conversion.conversionType.replace('_', ' ')} with potential value of ${formatCurrency(conversion.potentialValue)}. ${conversion.priority === 'urgent' || conversion.potentialValue > 50000 ? 'Immediate follow-up required.' : 'Follow-up recommended within 48 hours.'}`,
              timestamp: conversion.timestamp,
              read: false,
              fromDepartment: 'system',
              toDepartment: 'admin',
              fromUser: 'AI Flow Platform',
              toUser: 'Management Team',
              requiresResponse: true,
              metadata: {
                leadId: conversion.id,
                customerName: conversion.customerName,
                potentialValue: conversion.potentialValue,
                source: conversion.source,
                conversionType: conversion.conversionType,
                action: 'review_lead',
              },
            }));

          // Merge with existing mock notifications (filter out old lead conversions)
          const nonLeadNotifications = mockNotifications.filter(
            (n) => n.type !== 'lead_conversion'
          );
          return [...leadNotifications, ...nonLeadNotifications];
        }
      }
    } catch (error) {
      console.warn('Failed to fetch lead conversions (will use mock data):', {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        retrying: 'Will retry in 30 seconds',
      });

      // If it's a network error during development, it's likely the server isn't ready yet
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.info(
          '🔄 API endpoint not ready yet - this is normal during development startup'
        );
      }
    }
    return mockNotifications;
  };

  // Helper functions
  const getConversionTitle = (conversionType: string, customerType: string) => {
    const titleMap: { [key: string]: string } = {
      quote_accepted: '🚨 NEW SHIPPER - Quote Accepted',
      service_booked: '🚨 NEW CUSTOMER - Service Booked',
      rfp_won: '🚨 NEW CONTRACT - RFP Won',
      contact_form: '🚨 NEW LEAD - Contact Form',
      phone_inquiry: '🚨 NEW LEAD - Phone Inquiry',
      chat_conversion: '🚨 NEW LEAD - Chat Conversion',
    };
    return titleMap[conversionType] || '🚨 NEW LEAD - Conversion';
  };

  const getSourceLabel = (source: string) => {
    const sourceMap: { [key: string]: string } = {
      fmcsa: 'FMCSA Discovery',
      rfx_automation: 'RFx Automation',
      twilio: 'Call Center Lead',
      website: 'Website Form',
      chat: 'Chat Widget',
      phone: 'Phone System',
      email: 'Email Campaign',
    };
    return sourceMap[source] || 'Lead System';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    if (!mounted) return; // Wait for hydration

    const loadNotifications = async () => {
      const allNotifications = await fetchLeadConversions();

      // Filter notifications based on department
      const departmentNotifications = allNotifications.filter(
        (n) =>
          n.toDepartment === department ||
          n.toDepartment === 'all' ||
          n.fromDepartment === department ||
          (n.type === 'lead_conversion' &&
            (department === 'admin' || department === 'broker'))
      );

      // Add onboarding notifications
      const onboardingNotifications = generateOnboardingNotifications();
      const finalNotifications = [
        ...departmentNotifications,
        ...onboardingNotifications,
      ];

      setNotifications(finalNotifications);
      setUnreadCount(finalNotifications.filter((n) => !n.read).length);
    };

    // Initial load with delay to avoid hydration conflicts
    const initialTimeout = setTimeout(() => {
      loadNotifications();
    }, 1000); // 1 second delay

    // Refresh notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [department, mounted]);

  const playNotificationSound = async (notificationType: string) => {
    try {
      const soundUrl =
        DEPARTMENT_SOUNDS[department] || '/sounds/default-notification.mp3';
      if (audioRef.current) {
        audioRef.current.src = soundUrl;
        await audioRef.current.play();
      }
    } catch (error) {
      console.log('Could not play notification sound:', error);
    }
  };

  // Simulate new notification - disabled autoplay to prevent browser errors
  useEffect(() => {
    if (!mounted) return; // Wait for hydration

    const interval = setInterval(() => {
      // Random chance of new notification (without auto-sound)
      if (Math.random() < 0.1) {
        setUnreadCount((prev) => prev + 1);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [mounted]);

  const getPriorityColor = (priority: string) => {
    const colors = {
      critical: '#dc2626',
      urgent: '#ea580c',
      high: '#f59e0b',
      normal: '#3b82f6',
      low: '#6b7280',
    };
    return colors[priority as keyof typeof colors] || colors.normal;
  };

  const getPriorityIcon = (priority: string) => {
    const icons = {
      critical: '🔥',
      urgent: '⚡',
      high: '⚠️',
      normal: 'ℹ️',
      low: '📝',
    };
    return icons[priority as keyof typeof icons] || icons.normal;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      intraoffice: '💬',
      emergency: '🚨',
      load: '📦',
      dispatch: '🚛',
      compliance: '📋',
      system: '⚙️',
      lead_conversion: '💰',
      onboarding_active: '🔄',
      onboarding_pending: '⏳',
      onboarding_completed: '✅',
      onboarding_stuck: '🚨',
      onboarding_upcoming: '📅',
    };
    return icons[type as keyof typeof icons] || icons.system;
  };

  const handleNotificationClick = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  // Don't render anything during SSR to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className={`notification-bell-container ${className}`}>
      <audio ref={audioRef} preload='none' />

      {/* Navigation Bell */}
      {position === 'navigation' && (
        <div
          ref={bellRef}
          className={`bell-wrapper ${isAnimating ? 'animate' : ''}`}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setIsOpen(!isOpen)}
          style={{
            position: 'relative',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            background:
              unreadCount > 0 ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            border:
              unreadCount > 0
                ? '1px solid rgba(59, 130, 246, 0.3)'
                : '1px solid transparent',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ position: 'relative' }}>
            <span style={{ fontSize: '20px', color: 'white' }}>🔔</span>
            {unreadCount > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                }}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Driver Portal Bell */}
      {position === 'driver-portal' && (
        <div
          ref={bellRef}
          onClick={() => setIsOpen(!isOpen)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            zIndex: 1000,
          }}
        >
          <span style={{ fontSize: '24px', color: 'white' }}>🔔</span>
          {unreadCount > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
              }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </div>
          )}
        </div>
      )}

      {/* Tooltip */}
      {showTooltip && position === 'navigation' && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            marginBottom: '8px',
          }}
        >
          {unreadCount > 0
            ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
            : 'No new notifications'}
        </div>
      )}

      {/* Notification Dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: position === 'navigation' ? '100%' : 'auto',
            bottom: position === 'driver-portal' ? '100%' : 'auto',
            right: position === 'driver-portal' ? '0' : 'auto',
            left: position === 'navigation' ? '50%' : 'auto',
            transform: position === 'navigation' ? 'translateX(-50%)' : 'none',
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            width: '420px',
            maxHeight: '500px',
            overflowY: 'auto',
            zIndex: 1001,
            marginTop: position === 'navigation' ? '12px' : '0',
            marginBottom: position === 'driver-portal' ? '12px' : '0',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '18px',
                fontWeight: '600',
                margin: 0,
              }}
            >
              Notifications ({unreadCount})
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '6px',
                  color: '#60a5fa',
                  padding: '6px 12px',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Mark All Read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div
                style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.6)',
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔔</div>
                <p style={{ fontSize: '16px', margin: 0 }}>
                  No notifications yet
                </p>
                <p style={{ fontSize: '14px', marginTop: '8px', margin: 0 }}>
                  You'll see updates here as they come in
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    cursor: 'pointer',
                    background: notification.read
                      ? 'transparent'
                      : 'rgba(59, 130, 246, 0.05)',
                    transition: 'all 0.2s ease',
                    ':hover': {
                      background: 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div
                      style={{
                        fontSize: '20px',
                        flexShrink: 0,
                      }}
                    >
                      {getTypeIcon(notification.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '4px',
                        }}
                      >
                        <h4
                          style={{
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '600',
                            margin: 0,
                            flex: 1,
                          }}
                        >
                          {notification.title}
                        </h4>
                        <span
                          style={{
                            background: getPriorityColor(notification.priority),
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '12px',
                            fontSize: '10px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                          }}
                        >
                          {notification.priority}
                        </span>
                      </div>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '13px',
                          lineHeight: '1.4',
                          margin: '0 0 8px 0',
                        }}
                      >
                        {notification.message}
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.5)',
                        }}
                      >
                        <span>From: {notification.fromDepartment}</span>
                        <span>
                          {new Date(
                            notification.timestamp
                          ).toLocaleTimeString()}
                        </span>
                      </div>
                      {notification.metadata?.action && (
                        <div style={{ marginTop: '8px' }}>
                          <Link
                            href={`/admin?action=${notification.metadata.action}&id=${notification.metadata.leadId || notification.id}`}
                            style={{
                              background: 'rgba(59, 130, 246, 0.2)',
                              border: '1px solid rgba(59, 130, 246, 0.3)',
                              borderRadius: '6px',
                              color: '#60a5fa',
                              padding: '6px 12px',
                              fontSize: '12px',
                              textDecoration: 'none',
                              display: 'inline-block',
                            }}
                          >
                            Take Action
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .bell-wrapper.animate {
          animation: bellShake 0.5s ease-in-out;
        }

        @keyframes bellShake {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-10deg);
          }
          75% {
            transform: rotate(10deg);
          }
        }

        .notification-bell-container:hover .bell-wrapper {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
