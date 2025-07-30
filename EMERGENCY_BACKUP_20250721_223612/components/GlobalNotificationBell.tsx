'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// Department-specific notification sounds
const DEPARTMENT_SOUNDS = {
  dispatcher: '/sounds/dispatcher-chime.mp3',
  broker: '/sounds/broker-alert.mp3', 
  driver: '/sounds/driver-beep.mp3',
  admin: '/sounds/admin-tone.mp3',
  carrier: '/sounds/carrier-notification.mp3'
}

// Notification types for intraoffice communication
interface IntraofficeNotification {
  id: string
  type: 'intraoffice' | 'emergency' | 'load' | 'dispatch' | 'compliance' | 'system'
  priority: 'low' | 'normal' | 'high' | 'urgent' | 'critical'
  title: string
  message: string
  timestamp: string
  read: boolean
  fromDepartment: string
  toDepartment: string
  fromUser: string
  toUser: string
  requiresResponse: boolean
  metadata?: {
    loadId?: string
    action?: string
    department?: string
  }
}

interface NotificationBellProps {
  department: 'dispatcher' | 'broker' | 'driver' | 'admin' | 'carrier'
  position?: 'navigation' | 'driver-portal'
  className?: string
}

export default function GlobalNotificationBell({ 
  department, 
  position = 'navigation',
  className = ''
}: NotificationBellProps) {
  const [notifications, setNotifications] = useState<IntraofficeNotification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [showTooltip, setShowTooltip] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const bellRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Mock notifications with intraoffice messaging
  const mockNotifications: IntraofficeNotification[] = [
    {
      id: 'INTRA-001',
      type: 'intraoffice',
      priority: 'high',
      title: 'Broker Request: Load Assignment',
      message: 'Alex Rodriguez (Broker) requests driver assignment for Load LD-2025-789 - Urgent customer delivery needed',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      read: false,
      fromDepartment: 'broker',
      toDepartment: 'dispatcher',
      fromUser: 'Alex Rodriguez',
      toUser: 'Sarah Johnson',
      requiresResponse: true,
      metadata: { loadId: 'LD-2025-789', action: 'driver_assignment' }
    },
    {
      id: 'INTRA-002',
      type: 'intraoffice',
      priority: 'urgent',
      title: 'Dispatcher Alert: ETA Delay',
      message: 'Sarah Johnson (Dispatch) reports 3-hour delay on Load LD-2025-456 due to weather conditions',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      read: false,
      fromDepartment: 'dispatcher',
      toDepartment: 'broker',
      fromUser: 'Sarah Johnson',
      toUser: 'Michael Chen',
      requiresResponse: true,
      metadata: { loadId: 'LD-2025-456', action: 'client_notification' }
    },
    {
      id: 'INTRA-003',
      type: 'intraoffice',
      priority: 'normal',
      title: 'Admin Notice: System Maintenance',
      message: 'System maintenance scheduled for tonight 11 PM - 1 AM EST. Please complete urgent tasks before maintenance window.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      read: false,
      fromDepartment: 'admin',
      toDepartment: 'all',
      fromUser: 'IT Admin',
      toUser: 'All Departments',
      requiresResponse: false,
      metadata: { action: 'system_maintenance' }
    },
    {
      id: 'INTRA-004',
      type: 'emergency',
      priority: 'critical',
      title: 'Emergency: Driver Breakdown',
      message: 'Driver Mike Wilson reports mechanical breakdown on I-95. Immediate roadside assistance required.',
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      read: false,
      fromDepartment: 'driver',
      toDepartment: 'dispatcher',
      fromUser: 'Mike Wilson',
      toUser: 'Sarah Johnson',
      requiresResponse: true,
      metadata: { action: 'emergency_response' }
    }
  ]

  useEffect(() => {
    // Filter notifications based on department
    const departmentNotifications = mockNotifications.filter(n => 
      n.toDepartment === department || 
      n.toDepartment === 'all' ||
      n.fromDepartment === department
    )
    
    setNotifications(departmentNotifications)
    setUnreadCount(departmentNotifications.filter(n => !n.read).length)
  }, [department])

  // Play notification sound
  const playNotificationSound = (priority: string) => {
    try {
      if (audioRef.current) {
        audioRef.current.volume = priority === 'critical' ? 0.8 : 0.5
        audioRef.current.play()
      }
      
      // Add bell animation
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
    } catch (error) {
      console.log('Could not play notification sound:', error)
    }
  }

  // Simulate new notification - disabled autoplay to prevent browser errors
  useEffect(() => {
    const interval = setInterval(() => {
      // Random chance of new notification (without auto-sound)
      if (Math.random() < 0.1) {
        setUnreadCount(prev => prev + 1)
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 1000)
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getPriorityColor = (priority: string) => {
    const colors = {
      critical: '#dc2626',
      urgent: '#ea580c',
      high: '#d97706',
      normal: '#059669',
      low: '#6b7280'
    }
    return colors[priority as keyof typeof colors] || '#6b7280'
  }

  const getDepartmentColor = (dept: string) => {
    const colors = {
      dispatcher: '#3b82f6',
      broker: '#f97316',
      driver: '#f7c52d',
      admin: '#8b5cf6',
      carrier: '#14b8a6'
    }
    return colors[dept as keyof typeof colors] || '#6b7280'
  }

  const handleNotificationClick = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  // Tooltip component
  const InfoTooltip = ({ text, children }: { text: string; children: React.ReactNode }) => (
    <div 
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <div style={{
          position: 'absolute',
          background: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '0.8rem',
          whiteSpace: 'nowrap',
          zIndex: 10000,
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '5px'
        }}>
          {text}
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '5px solid rgba(0, 0, 0, 0.9)'
          }} />
        </div>
      )}
    </div>
  )

  return (
    <div ref={bellRef} style={{ position: 'relative' }}>
      {/* Hidden audio element for notification sounds */}
      <audio 
        ref={audioRef} 
        preload="auto"
        style={{ display: 'none' }}
      >
        <source src={DEPARTMENT_SOUNDS[department]} type="audio/mpeg" />
        {/* Fallback generic sound */}
        <source src="/sounds/notification-bell.mp3" type="audio/mpeg" />
      </audio>

      {/* Notification Bell */}
      <InfoTooltip text={`${unreadCount} new notifications for ${department} department`}>
        <div
          onClick={() => setIsOpen(!isOpen)}
          style={{
            position: 'relative',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            background: position === 'navigation' 
              ? 'linear-gradient(135deg, #f59e0b, #d97706)'
              : 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: 'white',
            fontSize: position === 'navigation' ? '1.2rem' : '1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            transition: 'all 0.3s ease',
            transform: isAnimating ? 'scale(1.2) rotate(15deg)' : 'scale(1) rotate(0deg)',
            boxShadow: unreadCount > 0 ? '0 0 20px rgba(245, 158, 11, 0.5)' : 'none',
            animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none'
          }}
          className={className}
        >
          🔔
          
          {/* Unread count badge */}
          {unreadCount > 0 && (
            <div style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              background: '#dc2626',
              color: 'white',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: 'bold',
              border: '2px solid white'
            }}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </div>
          )}
        </div>
      </InfoTooltip>

      {/* Notification Dropdown */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          width: '380px',
          maxHeight: '500px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          zIndex: 10000,
          overflow: 'hidden',
          marginTop: '5px'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem' }}>
                🔔 Notifications
              </h3>
              <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '0.8rem' }}>
                {department.charAt(0).toUpperCase() + department.slice(1)} Department
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleMarkAllRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}
              >
                Mark All Read
              </button>
              <Link href="/notifications" style={{ textDecoration: 'none' }}>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  View All
                </button>
              </Link>
            </div>
          </div>

          {/* Notifications List */}
          <div style={{
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            {notifications.length === 0 ? (
              <div style={{
                padding: '40px 20px',
                textAlign: 'center',
                color: '#64748b'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📭</div>
                <p>No notifications</p>
              </div>
            ) : (
              notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                    cursor: 'pointer',
                    background: notification.read ? 'white' : '#f8fafc',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f1f5f9'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = notification.read ? 'white' : '#f8fafc'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: getPriorityColor(notification.priority)
                      }} />
                      <span style={{
                        color: '#1e293b',
                        fontSize: '0.9rem',
                        fontWeight: notification.read ? 'normal' : 'bold'
                      }}>
                        {notification.title}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <span style={{
                        background: getDepartmentColor(notification.fromDepartment),
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: '500'
                      }}>
                        {notification.fromDepartment.toUpperCase()}
                      </span>
                      {notification.requiresResponse && (
                        <span style={{
                          background: '#dc2626',
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: '500'
                        }}>
                          RESPONSE REQUIRED
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p style={{
                    color: '#64748b',
                    fontSize: '0.85rem',
                    margin: '0 0 8px 0',
                    lineHeight: '1.4'
                  }}>
                    {notification.message}
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.75rem',
                    color: '#94a3b8'
                  }}>
                    <span>
                      From: {notification.fromUser}
                    </span>
                    <span>
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: '12px 20px',
            background: '#f8fafc',
            borderTop: '1px solid rgba(0, 0, 0, 0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#10b981',
                animation: 'pulse 2s infinite'
              }} />
              <span style={{
                color: '#64748b',
                fontSize: '0.75rem'
              }}>
                Live updates enabled
              </span>
            </div>
            <Link href="/notifications" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'none',
                border: 'none',
                color: '#3b82f6',
                cursor: 'pointer',
                fontSize: '0.75rem'
              }}>
                View All Notifications →
              </button>
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
      `}</style>
    </div>
  )
} 