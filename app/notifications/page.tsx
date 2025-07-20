'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Types for comprehensive notification system
interface FleetNotification {
  id: string
  type: 'sms' | 'email' | 'system' | 'load' | 'dispatch' | 'emergency' | 'compliance' | 'intraoffice'
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
    department?: string
    fromUser?: string
    toUser?: string
    requiresResponse?: boolean
  }
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'acknowledged'
}

// Types for live alerts (from main dashboard)
interface LiveAlert {
  id: number
  type: 'critical' | 'warning' | 'info'
  title: string
  message: string
  timestamp: string
  actionRequired: boolean
  loadId?: string
  driverId?: string
  carrierId?: string
  region?: string
}

interface NotificationStats {
  total: number
  unread: number
  urgent: number
  today: number
  byType: Record<string, number>
  byPriority: Record<string, number>
  liveAlerts: {
    critical: number
    warning: number
    info: number
    total: number
  }
}

export default function NotificationHub() {
  const [notifications, setNotifications] = useState<FleetNotification[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<FleetNotification[]>([])
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showComposeModal, setShowComposeModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'notifications' | 'live-alerts'>('notifications')
  
  // Live alerts state (from main dashboard)
  const [liveAlerts, setLiveAlerts] = useState<LiveAlert[]>([
    {
      id: 1,
      type: 'critical',
      title: 'Load SHP-003 Delayed',
      message: 'Mechanical breakdown on I-95. ETA pushed by 4 hours',
      timestamp: new Date(Date.now() - 300000).toLocaleTimeString(),
      actionRequired: true,
      loadId: 'SHP-003'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Driver Hours Alert',
      message: 'Driver Mike Wilson approaching HOS limit in 2 hours',
      timestamp: new Date(Date.now() - 600000).toLocaleTimeString(),
      actionRequired: true,
      driverId: 'DRV-789'
    },
    {
      id: 3,
      type: 'info',
      title: 'Load Delivered',
      message: 'SHP-002 successfully delivered to Atlanta, GA',
      timestamp: new Date(Date.now() - 900000).toLocaleTimeString(),
      actionRequired: false,
      loadId: 'SHP-002'
    },
    {
      id: 4,
      type: 'critical',
      title: 'Weather Alert',
      message: 'Severe storm warning for Route I-10 through Louisiana',
      timestamp: new Date(Date.now() - 1200000).toLocaleTimeString(),
      actionRequired: true,
      region: 'Louisiana'
    },
    {
      id: 5,
      type: 'warning',
      title: 'Compliance Alert',
      message: 'Carrier Swift Transport - Insurance expires in 7 days',
      timestamp: new Date(Date.now() - 1800000).toLocaleTimeString(),
      actionRequired: true,
      carrierId: 'CAR-456'
    },
    {
      id: 6,
      type: 'info',
      title: 'New Load Available',
      message: 'High-priority load posted: NYC to Boston $3,200',
      timestamp: new Date(Date.now() - 2400000).toLocaleTimeString(),
      actionRequired: false,
      loadId: 'LD-789'
    }
  ])

  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    urgent: 0,
    today: 0,
    byType: {},
    byPriority: {},
    liveAlerts: {
      critical: 0,
      warning: 0,
      info: 0,
      total: 0
    }
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
      },
      {
        id: 'NOTIF-009',
        type: 'intraoffice',
        priority: 'high',
        title: 'Intraoffice: Broker Request',
        message: 'Alex Rodriguez (Broker) requests immediate driver assignment for urgent customer delivery.',
        timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        read: false,
        source: 'Broker Department',
        recipient: { id: 'DISP-001', name: 'Sarah Johnson', type: 'dispatcher' },
        metadata: { 
          loadId: 'LD-2025-890', 
          action: 'driver_assignment',
          department: 'broker',
          fromUser: 'Alex Rodriguez',
          toUser: 'Sarah Johnson',
          requiresResponse: true
        },
        status: 'pending'
      },
      {
        id: 'NOTIF-010',
        type: 'intraoffice',
        priority: 'urgent',
        title: 'Intraoffice: Dispatch Alert',
        message: 'Sarah Johnson (Dispatch) reports weather delay - need to notify customer immediately.',
        timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
        read: false,
        source: 'Dispatch Department',
        recipient: { id: 'BRK-001', name: 'Alex Rodriguez', type: 'broker' },
        metadata: { 
          loadId: 'LD-2025-456', 
          action: 'customer_notification',
          department: 'dispatch',
          fromUser: 'Sarah Johnson',
          toUser: 'Alex Rodriguez',
          requiresResponse: true
        },
        status: 'delivered'
      },
      {
        id: 'NOTIF-011',
        type: 'intraoffice',
        priority: 'normal',
        title: 'Intraoffice: Admin Notice',
        message: 'IT Admin: System maintenance scheduled for tonight. Please complete urgent tasks.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
        source: 'Admin Department',
        recipient: { id: 'ALL-001', name: 'All Departments', type: 'admin' },
        metadata: { 
          action: 'maintenance_notice',
          department: 'admin',
          fromUser: 'IT Admin',
          toUser: 'All Departments',
          requiresResponse: false
        },
        status: 'sent'
      }
    ]

    setNotifications(mockNotifications)
    calculateStats(mockNotifications, liveAlerts)
  }, [liveAlerts])

  // Calculate notification statistics including live alerts
  const calculateStats = (notifications: FleetNotification[], alerts: LiveAlert[]) => {
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

    const liveAlertsStats = {
      critical: alerts.filter(a => a.type === 'critical').length,
      warning: alerts.filter(a => a.type === 'warning').length,
      info: alerts.filter(a => a.type === 'info').length,
      total: alerts.length
    }

    setStats({
      total: notifications.length,
      unread: notifications.filter(n => !n.read).length,
      urgent: notifications.filter(n => n.priority === 'urgent' || n.priority === 'critical').length,
      today: todayNotifications.length,
      byType,
      byPriority,
      liveAlerts: liveAlertsStats
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
      system: '⚙️',
      intraoffice: '🏢'
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

  // Live alert functions (from main dashboard)
  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return '#ef4444'
      case 'warning': return '#f59e0b'
      case 'info': return '#3b82f6'
      default: return '#6b7280'
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return '🚨'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
      default: return '📢'
    }
  }

  const handleAlertAction = (alertId: number) => {
    console.log('Alert action taken for alert:', alertId)
    // Remove alert after action is taken
    setLiveAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #fef3c7, #fbbf24)',
      minHeight: '100vh',
      padding: '80px 20px 20px 20px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(45, 55, 72, 0.25)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          border: '1px solid rgba(45, 55, 72, 0.3)'
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
              color: '#2d3748',
              margin: 0,
              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              🔔 FleetFlow Notification Hub
            </h1>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={() => setShowComposeModal(true)}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#2d3748',
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
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#2d3748',
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

          {/* Enhanced Stats Dashboard with Live Alerts */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '20px'
          }}>
            {[
              { label: 'Total Notifications', value: stats.total, color: '#3b82f6', icon: '📊' },
              { label: 'Unread', value: stats.unread, color: '#ef4444', icon: '🔴' },
              { label: 'Urgent/Critical', value: stats.urgent, color: '#f59e0b', icon: '⚠️' },
              { label: 'Today', value: stats.today, color: '#10b981', icon: '📅' },
              { label: 'Live Critical', value: stats.liveAlerts.critical, color: '#dc2626', icon: '🚨' },
              { label: 'Live Warning', value: stats.liveAlerts.warning, color: '#f59e0b', icon: '⚠️' },
              { label: 'Live Info', value: stats.liveAlerts.info, color: '#3b82f6', icon: 'ℹ️' },
              { label: 'Total Live', value: stats.liveAlerts.total, color: '#8b5cf6', icon: '🔄' }
            ].map((stat, index) => (
              <div key={index} style={{
                background: 'rgba(45, 55, 72, 0.05)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                border: '1px solid rgba(45, 55, 72, 0.1)'
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

        {/* Tab Navigation */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '8px',
          marginBottom: '25px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          gap: '8px'
        }}>
          <button
            onClick={() => setActiveTab('notifications')}
            style={{
              flex: 1,
              background: activeTab === 'notifications' ? 'rgba(45, 55, 72, 0.1)' : 'transparent',
                              color: activeTab === 'notifications' ? '#1a202c' : '#2d3748',
              border: 'none',
              padding: '16px 24px',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            📋 Notifications ({stats.total})
          </button>
          <button
            onClick={() => setActiveTab('live-alerts')}
            style={{
              flex: 1,
              background: activeTab === 'live-alerts' ? 'rgba(45, 55, 72, 0.1)' : 'transparent',
                              color: activeTab === 'live-alerts' ? '#1a202c' : '#2d3748',
              border: 'none',
              padding: '16px 24px',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            🚨 Live Alerts ({stats.liveAlerts.total})
          </button>
        </div>

        {/* Conditional Content Based on Active Tab */}
        {activeTab === 'notifications' ? (
          <>
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
                    border: '1px solid rgba(45, 55, 72, 0.3)',
                    background: 'rgba(45, 55, 72, 0.05)',
                    fontSize: '1rem',
                    color: '#2d3748'
                  }}
                />

                {/* Type Filter */}
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid rgba(45, 55, 72, 0.3)',
                    background: 'rgba(45, 55, 72, 0.05)',
                    fontSize: '1rem',
                    color: '#2d3748'
                  }}
                >
                  <option value="all">All Types</option>
                  <option value="unread">Unread Only</option>
                  <option value="intraoffice">🏢 Intraoffice</option>
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
          </>
        ) : (
          /* Live Alerts Tab */
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
                🚨 Live Alert Feed - Real-Time Monitoring
              </h2>
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.9rem',
                margin: '8px 0 0 0'
              }}>
                Real-time alerts requiring immediate attention • Auto-refreshes every 30 seconds
              </p>
            </div>

            {/* Live Alert Counters */}
            <div style={{
              padding: '20px 30px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '16px'
              }}>
                {/* Critical Alerts */}
                <div style={{
                  background: '#ef444420',
                  border: '1px solid #ef444440',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <div style={{ 
                    color: '#ef4444', 
                    fontSize: '24px', 
                    fontWeight: 'bold',
                    marginBottom: '4px'
                  }}>
                    {stats.liveAlerts.critical}
                  </div>
                  <div style={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    fontSize: '12px'
                  }}>
                    Critical
                  </div>
                </div>

                {/* Warning Alerts */}
                <div style={{
                  background: '#f59e0b20',
                  border: '1px solid #f59e0b40',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <div style={{ 
                    color: '#f59e0b', 
                    fontSize: '24px', 
                    fontWeight: 'bold',
                    marginBottom: '4px'
                  }}>
                    {stats.liveAlerts.warning}
                  </div>
                  <div style={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    fontSize: '12px'
                  }}>
                    Warning
                  </div>
                </div>

                {/* Info Alerts */}
                <div style={{
                  background: '#3b82f620',
                  border: '1px solid #3b82f640',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <div style={{ 
                    color: '#3b82f6', 
                    fontSize: '24px', 
                    fontWeight: 'bold',
                    marginBottom: '4px'
                  }}>
                    {stats.liveAlerts.info}
                  </div>
                  <div style={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    fontSize: '12px'
                  }}>
                    Info
                  </div>
                </div>

                {/* Total Alerts */}
                <div style={{
                  background: '#6b728020',
                  border: '1px solid #6b728040',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <div style={{ 
                    color: '#6b7280', 
                    fontSize: '24px', 
                    fontWeight: 'bold',
                    marginBottom: '4px'
                  }}>
                    {stats.liveAlerts.total}
                  </div>
                  <div style={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    fontSize: '12px'
                  }}>
                    Total
                  </div>
                </div>
              </div>
            </div>

            {/* Live Alerts List */}
            <div style={{
              maxHeight: '600px',
              overflowY: 'auto',
              padding: '20px 30px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {liveAlerts.map((alert) => (
                  <div key={alert.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    border: `1px solid ${getAlertColor(alert.type)}40`,
                    borderLeft: `4px solid ${getAlertColor(alert.type)}`,
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                      <div style={{ fontSize: '20px' }}>
                        {getAlertIcon(alert.type)}
                      </div>
                      <div>
                        <div style={{ 
                          color: 'white', 
                          fontSize: '14px', 
                          fontWeight: '600',
                          marginBottom: '4px'
                        }}>
                          {alert.title}
                        </div>
                        <div style={{ 
                          color: 'rgba(255, 255, 255, 0.8)', 
                          fontSize: '12px',
                          marginBottom: '4px'
                        }}>
                          {alert.message}
                        </div>
                        <div style={{ 
                          color: 'rgba(255, 255, 255, 0.6)', 
                          fontSize: '11px'
                        }}>
                          {alert.timestamp}
                          {alert.loadId && ` • Load: ${alert.loadId}`}
                          {alert.driverId && ` • Driver: ${alert.driverId}`}
                          {alert.carrierId && ` • Carrier: ${alert.carrierId}`}
                          {alert.region && ` • Region: ${alert.region}`}
                        </div>
                      </div>
                    </div>
                    
                    {alert.actionRequired && (
                      <button
                        onClick={() => handleAlertAction(alert.id)}
                        style={{
                          background: getAlertColor(alert.type),
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '0.8'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '1'
                        }}
                      >
                        Take Action
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Live Alerts Footer */}
            <div style={{
              padding: '20px 30px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                fontSize: '0.9rem',
                marginBottom: '12px'
              }}>
                🔄 Auto-refresh enabled • Last updated: {new Date().toLocaleTimeString()}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  🔄 Refresh Now
                </button>
                <button style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  📋 Export Alerts
                </button>
                <Link href="/tracking" style={{ textDecoration: 'none' }}>
                  <button style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>
                    📍 Live Tracking
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}

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
              href: '/analytics',
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
