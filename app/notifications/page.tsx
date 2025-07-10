'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Types for comprehensive notification system
interface FleetNotification {
  id: string
  type: 'sms' | 'email' | 'system' | 'load' | 'dispatch' | 'emergency' | 'compliance'
  priority: 'low' | 'normal' | 'high' | 'urgent' | 'critical'
  title: string
  message: string
  timestamp: string
  read: boolean
  source: string
  recipient: {
    id: string
    name: string
    type: 'driver' | 'dispatcher' | 'carrier' | 'broker' | 'admin'
  }
  metadata?: {
    loadId?: string
    driverId?: string
    action?: string
    link?: string
  }
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'acknowledged'
}

interface NotificationStats {
  total: number
  unread: number
  urgent: number
  today: number
  byType: Record<string, number>
  byPriority: Record<string, number>
}

export default function NotificationHub() {
  const [notifications, setNotifications] = useState<FleetNotification[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<FleetNotification[]>([])
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showComposeModal, setShowComposeModal] = useState(false)
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    urgent: 0,
    today: 0,
    byType: {},
    byPriority: {}
  })

  // Mock notification data - in production, this would come from API/database
  useEffect(() => {
    const mockNotifications: FleetNotification[] = [
      {
        id: 'NOTIF-001',
        type: 'emergency',
        priority: 'critical',
        title: 'Emergency Alert',
        message: 'Driver breakdown reported on I-95. Immediate assistance required.',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        read: false,
        source: 'Driver Portal',
        recipient: { id: 'DISP-001', name: 'Sarah Johnson', type: 'dispatcher' },
        metadata: { loadId: 'LD-2025-789', driverId: 'DRV-001', action: 'emergency_response' },
        status: 'delivered'
      },
      {
        id: 'NOTIF-002',
        type: 'load',
        priority: 'high',
        title: 'Load Assignment Confirmed',
        message: 'Driver Mike Rodriguez confirmed pickup for Load LD-2025-456.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        read: false,
        source: 'Dispatch Central',
        recipient: { id: 'DISP-002', name: 'Tom Wilson', type: 'dispatcher' },
        metadata: { loadId: 'LD-2025-456', driverId: 'DRV-002' },
        status: 'acknowledged'
      },
      {
        id: 'NOTIF-003',
        type: 'sms',
        priority: 'normal',
        title: 'SMS Delivery Confirmation',
        message: 'Pickup reminder sent to 3 drivers successfully.',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        read: true,
        source: 'SMS Service',
        recipient: { id: 'DISP-001', name: 'Sarah Johnson', type: 'dispatcher' },
        metadata: { action: 'bulk_sms' },
        status: 'delivered'
      },
      {
        id: 'NOTIF-004',
        type: 'compliance',
        priority: 'urgent',
        title: 'DOT Compliance Alert',
        message: 'Carrier MC-12345 insurance status expired. Immediate review required.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
        source: 'Compliance Monitor',
        recipient: { id: 'ADM-001', name: 'Admin User', type: 'admin' },
        metadata: { action: 'compliance_review' },
        status: 'pending'
      },
      {
        id: 'NOTIF-005',
        type: 'system',
        priority: 'low',
        title: 'System Backup Complete',
        message: 'Daily backup completed successfully. All data secured.',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        read: true,
        source: 'System Monitor',
        recipient: { id: 'ADM-001', name: 'Admin User', type: 'admin' },
        status: 'delivered'
      },
      {
        id: 'NOTIF-006',
        type: 'dispatch',
        priority: 'high',
        title: 'Route Optimization Complete',
        message: 'Load LD-2025-321 route optimized. 15% fuel savings achieved.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        read: false,
        source: 'Route Optimizer',
        recipient: { id: 'DISP-002', name: 'Tom Wilson', type: 'dispatcher' },
        metadata: { loadId: 'LD-2025-321' },
        status: 'delivered'
      },
      {
        id: 'NOTIF-007',
        type: 'email',
        priority: 'normal',
        title: 'Invoice Generated',
        message: 'Invoice INV-2025-0103 generated and sent to carrier.',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        read: true,
        source: 'Billing System',
        recipient: { id: 'ADM-001', name: 'Admin User', type: 'admin' },
        status: 'delivered'
      },
      {
        id: 'NOTIF-008',
        type: 'load',
        priority: 'normal',
        title: 'Delivery Completed',
        message: 'Load LD-2025-123 delivered successfully with POD confirmation.',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        read: true,
        source: 'Driver Portal',
        recipient: { id: 'DISP-001', name: 'Sarah Johnson', type: 'dispatcher' },
        metadata: { loadId: 'LD-2025-123', action: 'pod_complete' },
        status: 'acknowledged'
      }
    ]

    setNotifications(mockNotifications)
    calculateStats(mockNotifications)
  }, [])

  // Calculate notification statistics
  const calculateStats = (notifications: FleetNotification[]) => {
    const today = new Date().toDateString()
    const todayNotifications = notifications.filter(n => 
      new Date(n.timestamp).toDateString() === today
    )

    const byType = notifications.reduce((acc, n) => {
      acc[n.type] = (acc[n.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byPriority = notifications.reduce((acc, n) => {
      acc[n.priority] = (acc[n.priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    setStats({
      total: notifications.length,
      unread: notifications.filter(n => !n.read).length,
      urgent: notifications.filter(n => n.priority === 'urgent' || n.priority === 'critical').length,
      today: todayNotifications.length,
      byType,
      byPriority
    })
  }

  // Filter notifications
  useEffect(() => {
    let filtered = notifications

    if (selectedFilter !== 'all') {
      if (selectedFilter === 'unread') {
        filtered = filtered.filter(n => !n.read)
      } else {
        filtered = filtered.filter(n => n.type === selectedFilter)
      }
    }

    if (selectedPriority !== 'all') {
      filtered = filtered.filter(n => n.priority === selectedPriority)
    }

    if (searchTerm) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.source.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredNotifications(filtered)
  }, [notifications, selectedFilter, selectedPriority, searchTerm])

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const getNotificationIcon = (type: string) => {
    const icons = {
      emergency: '🚨',
      load: '🚛',
      sms: '📱',
      email: '📧',
      dispatch: '📋',
      compliance: '✅',
      system: '⚙️'
    }
    return icons[type as keyof typeof icons] || '📢'
  }

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

  const getStatusColor = (status: string) => {
    const colors = {
      pending: '#f59e0b',
      sent: '#3b82f6',
      delivered: '#10b981',
      failed: '#ef4444',
      acknowledged: '#8b5cf6'
    }
    return colors[status as keyof typeof colors] || '#6b7280'
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '80px 20px 20px 20px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
              textShadow: '0 4px 8px rgba(0,0,0,0.3)'
            }}>
              🔔 FleetFlow Notification Hub
            </h1>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={() => setShowComposeModal(true)}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ✉️ Compose
              </button>
              <Link href="/" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  🏠 Dashboard
                </button>
              </Link>
            </div>
          </div>

          {/* Stats Dashboard */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {[
              { label: 'Total Notifications', value: stats.total, color: '#3b82f6', icon: '📊' },
              { label: 'Unread', value: stats.unread, color: '#ef4444', icon: '🔴' },
              { label: 'Urgent/Critical', value: stats.urgent, color: '#f59e0b', icon: '⚠️' },
              { label: 'Today', value: stats.today, color: '#10b981', icon: '📅' }
            ].map((stat, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{stat.icon}</div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: stat.color,
                  marginBottom: '4px'
                }}>
                  {stat.value}
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '25px',
          marginBottom: '25px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            alignItems: 'center'
          }}>
            {/* Search */}
            <input
              type="text"
              placeholder="🔍 Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.9)',
                fontSize: '1rem'
              }}
            />

            {/* Type Filter */}
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.9)',
                fontSize: '1rem'
              }}
            >
              <option value="all">All Types</option>
              <option value="unread">Unread Only</option>
              <option value="emergency">🚨 Emergency</option>
              <option value="load">🚛 Load</option>
              <option value="dispatch">📋 Dispatch</option>
              <option value="compliance">✅ Compliance</option>
              <option value="sms">📱 SMS</option>
              <option value="email">📧 Email</option>
              <option value="system">⚙️ System</option>
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.9)',
                fontSize: '1rem'
              }}
            >
              <option value="all">All Priorities</option>
              <option value="critical">🔴 Critical</option>
              <option value="urgent">🟠 Urgent</option>
              <option value="high">🟡 High</option>
              <option value="normal">🟢 Normal</option>
              <option value="low">⚪ Low</option>
            </select>

            {/* Actions */}
            <button
              onClick={handleMarkAllAsRead}
              disabled={stats.unread === 0}
              style={{
                background: stats.unread > 0 ? 'linear-gradient(135deg, #10b981, #059669)' : '#9ca3af',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: stats.unread > 0 ? 'pointer' : 'not-allowed'
              }}
            >
              ✅ Mark All Read ({stats.unread})
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '25px 30px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h2 style={{
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: '600',
              margin: 0
            }}>
              📋 Notifications ({filteredNotifications.length})
            </h2>
          </div>

          <div style={{
            maxHeight: '800px',
            overflowY: 'auto'
          }}>
            {filteredNotifications.length === 0 ? (
              <div style={{
                padding: '60px',
                textAlign: 'center',
                color: 'white'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📭</div>
                <h3 style={{ marginBottom: '10px' }}>No notifications found</h3>
                <p style={{ opacity: 0.8 }}>Try adjusting your filters or search terms</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  style={{
                    padding: '25px 30px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    background: notification.read ? 'transparent' : 'rgba(255, 255, 255, 0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => handleMarkAsRead(notification.id)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = notification.read ? 'transparent' : 'rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '20px'
                  }}>
                    {/* Icon */}
                    <div style={{
                      fontSize: '2rem',
                      minWidth: '50px'
                    }}>
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '8px'
                      }}>
                        <h3 style={{
                          color: 'white',
                          fontSize: '1.2rem',
                          fontWeight: notification.read ? 'normal' : 'bold',
                          margin: 0
                        }}>
                          {notification.title}
                        </h3>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {/* Priority Badge */}
                          <span style={{
                            background: getPriorityColor(notification.priority),
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                          }}>
                            {notification.priority}
                          </span>
                          {/* Status Badge */}
                          <span style={{
                            background: getStatusColor(notification.status),
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                          }}>
                            {notification.status}
                          </span>
                          {/* Unread Indicator */}
                          {!notification.read && (
                            <div style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              background: '#3b82f6'
                            }} />
                          )}
                        </div>
                      </div>

                      <p style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '1rem',
                        lineHeight: '1.5',
                        margin: '0 0 12px 0'
                      }}>
                        {notification.message}
                      </p>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.85rem',
                        color: 'rgba(255, 255, 255, 0.7)'
                      }}>
                        <div>
                          <strong>From:</strong> {notification.source} • 
                          <strong> To:</strong> {notification.recipient.name} • 
                          <strong> Type:</strong> {notification.type.toUpperCase()}
                        </div>
                        <div>
                          {new Date(notification.timestamp).toLocaleString()}
                        </div>
                      </div>

                      {/* Metadata */}
                      {notification.metadata && (
                        <div style={{
                          marginTop: '12px',
                          padding: '10px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          color: 'rgba(255, 255, 255, 0.8)'
                        }}>
                          {notification.metadata.loadId && (
                            <span style={{ marginRight: '15px' }}>
                              <strong>Load:</strong> {notification.metadata.loadId}
                            </span>
                          )}
                          {notification.metadata.driverId && (
                            <span style={{ marginRight: '15px' }}>
                              <strong>Driver:</strong> {notification.metadata.driverId}
                            </span>
                          )}
                          {notification.metadata.action && (
                            <span>
                              <strong>Action:</strong> {notification.metadata.action.replace('_', ' ')}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          marginTop: '30px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {[
            { 
              title: '📱 SMS Center', 
              description: 'Send bulk SMS notifications',
              href: '/sms-center',
              color: 'linear-gradient(135deg, #10b981, #059669)'
            },
            { 
              title: '📧 Email Campaigns', 
              description: 'Manage email notifications',
              href: '/email-center',
              color: 'linear-gradient(135deg, #3b82f6, #2563eb)'
            },
            { 
              title: '🚨 Emergency Alerts', 
              description: 'Emergency notification system',
              href: '/emergency-alerts',
              color: 'linear-gradient(135deg, #ef4444, #dc2626)'
            },
            { 
              title: '📊 Analytics', 
              description: 'Notification performance metrics',
              href: '/notification-analytics',
              color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
            }
          ].map((action, index) => (
            <Link key={index} href={action.href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: action.color,
                borderRadius: '16px',
                padding: '25px',
                color: 'white',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.3)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  margin: '0 0 10px 0'
                }}>
                  {action.title}
                </h3>
                <p style={{
                  margin: 0,
                  opacity: 0.9
                }}>
                  {action.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
