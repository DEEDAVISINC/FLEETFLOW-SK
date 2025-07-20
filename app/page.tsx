'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function HomePage() {
  const [selectedLoad, setSelectedLoad] = useState<string | null>(null)
  const [showLoadDetails, setShowLoadDetails] = useState(false)

  // Real-time alerts state management
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'critical',
      title: 'Load SHP-003 Delayed',
      message: 'Mechanical breakdown on I-95. ETA pushed by 4 hours',
      timestamp: '3:45 PM',
      actionRequired: true,
      loadId: 'SHP-003'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Driver Hours Alert',
      message: 'Driver Mike Wilson approaching HOS limit in 2 hours',
      timestamp: '3:40 PM',
      actionRequired: true,
      driverId: 'DRV-789'
    },
    {
      id: 3,
      type: 'info',
      title: 'Load Delivered',
      message: 'SHP-002 successfully delivered to Atlanta, GA',
      timestamp: '3:35 PM',
      actionRequired: false,
      loadId: 'SHP-002'
    },
    {
      id: 4,
      type: 'critical',
      title: 'Weather Alert',
      message: 'Severe storm warning for Route I-10 through Louisiana',
      timestamp: '3:30 PM',
      actionRequired: true,
      region: 'Louisiana'
    },
    {
      id: 5,
      type: 'warning',
      title: 'Compliance Alert',
      message: 'Carrier Swift Transport - Insurance expires in 7 days',
      timestamp: '3:20 PM',
      actionRequired: true,
      carrierId: 'CAR-456'
    },
    {
      id: 6,
      type: 'info',
      title: 'New Load Available',
      message: 'High-priority load posted: NYC to Boston $3,200',
      timestamp: '3:10 PM',
      actionRequired: false,
      loadId: 'LD-789'
    }
  ])

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
    // Future integration with notification hub
  }

  const criticalAlerts = alerts.filter(alert => alert.type === 'critical').length
  const warningAlerts = alerts.filter(alert => alert.type === 'warning').length
  const infoAlerts = alerts.filter(alert => alert.type === 'info').length

  // Color functions matching the tracking page
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available': return '#22c55e'
      case 'in transit': return '#3b82f6'
      case 'delivered': return '#10b981'
      case 'delayed': return '#ef4444'
      case 'loading': return '#f59e0b'
      case 'unloading': return '#8b5cf6'
      default: return '#6b7280'
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const quickLinks = [
    { href: '/dispatch', bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', emoji: '🚛', title: 'Dispatch', color: 'white' },
    { href: '/drivers', bg: 'linear-gradient(135deg, #f7c52d, #f4a832)', emoji: '👨‍💼', title: 'Drivers', color: '#2d3748' },
    { href: '/drivers/dashboard', bg: 'linear-gradient(135deg, #1e40af, #1e3a8a)', emoji: '🚗', title: 'Driver Management Portal', color: 'white' },
    { href: '/vehicles', bg: 'linear-gradient(135deg, #14b8a6, #0d9488)', emoji: '🚚', title: 'Fleet', color: 'white' },
    { href: '/broker', bg: 'linear-gradient(135deg, #f97316, #ea580c)', emoji: '🏢', title: 'Broker', color: 'white' },
    { href: '/routes', bg: 'linear-gradient(135deg, #14b8a6, #0d9488)', emoji: '🗺️', title: 'Routes', color: 'white' },
    { href: '/analytics', bg: 'linear-gradient(135deg, #6366f1, #4f46e5)', emoji: '📊', title: 'Analytics', color: 'white' },
    { href: '/accounting', bg: 'linear-gradient(135deg, #059669, #047857)', emoji: '💰', title: 'Finance', color: 'white' },
    { href: '/notes', bg: 'linear-gradient(135deg, #fef3c7, #fbbf24)', emoji: '🔔', title: 'Alerts', color: '#2d3748' },
    { href: '/quoting', bg: 'linear-gradient(135deg, #10b981, #059669)', emoji: '📋', title: 'Quotes', color: 'white' },
    { href: '/compliance', bg: 'linear-gradient(135deg, #dc2626, #b91c1c)', emoji: '✅', title: 'Safety', color: 'white' },
    { href: '/shippers', bg: 'linear-gradient(135deg, #667eea, #764ba2)', emoji: '🏭', title: 'Shippers', color: 'white' },
    { href: '/scheduling', bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', emoji: '📅', title: 'Schedule', color: 'white' },
    { href: '/ai', bg: 'linear-gradient(135deg, #ec4899, #db2777)', emoji: '🤖', title: 'AI Hub', color: 'white', size: 'small' }
  ]

  const loads = [
    { 
      id: 'LD001', 
      origin: 'Los Angeles, CA', 
      destination: 'Phoenix, AZ', 
      weight: '42,000 lbs', 
      rate: '$2,850', 
      status: 'Available',
      driver: 'Unassigned',
      pickup: '2025-07-15',
      delivery: '2025-07-16',
      customer: 'Walmart Distribution',
      miles: '372',
      profit: '$1,420',
      commodity: 'Electronics',
      equipment: 'Dry Van',
      priority: 'High'
    },
    { 
      id: 'LD002', 
      origin: 'Dallas, TX', 
      destination: 'Atlanta, GA', 
      weight: '38,500 lbs', 
      rate: '$3,200', 
      status: 'In Transit',
      driver: 'Mike Johnson',
      pickup: '2025-07-13',
      delivery: '2025-07-15',
      customer: 'Home Depot Supply',
      miles: '781',
      profit: '$1,850',
      commodity: 'Building Materials',
      equipment: 'Flatbed',
      priority: 'Medium'
    },
    { 
      id: 'LD003', 
      origin: 'Chicago, IL', 
      destination: 'Denver, CO', 
      weight: '45,000 lbs', 
      rate: '$2,950', 
      status: 'Delivered',
      driver: 'Sarah Williams',
      pickup: '2025-07-10',
      delivery: '2025-07-12',
      customer: 'Amazon Logistics',
      miles: '920',
      profit: '$1,680',
      commodity: 'Consumer Goods',
      equipment: 'Reefer',
      priority: 'Low'
    }
  ]

  const handleLoadClick = (loadId: string) => {
    setSelectedLoad(loadId)
    setShowLoadDetails(true)
  }

  const handleAcceptLoad = (loadId: string) => {
    alert(`Load ${loadId} accepted! Assigning to next available driver.`)
    setShowLoadDetails(false)
  }

  const handleBidLoad = (loadId: string) => {
    alert(`Bid submitted for load ${loadId}! Waiting for broker response.`)
    setShowLoadDetails(false)
  }

  const selectedLoadData = loads.find(load => load.id === selectedLoad)

  return (
    <div style={{ 
      padding: '40px', 
      paddingTop: '100px',
      background: `
        linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%),
        radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(168, 85, 247, 0.04) 0%, transparent 50%)
      `,
      backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
      backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
      minHeight: '100vh',
      color: '#ffffff',
      position: 'relative',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Professional Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '40px',
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '30px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ 
          fontSize: '2.2rem', 
          fontWeight: '800',
          color: '#ffffff',
          margin: '0 0 8px 0',
          letterSpacing: '-0.02em'
        }}>
          FleetFlow TMS
      </h1>
        <p style={{ 
          fontSize: '1rem', 
          color: '#e2e8f0',
          margin: '0 0 20px 0',
          fontWeight: '500',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: '1.5'
        }}>
          Complete Transportation Management System • From Load Tender to Proof of Delivery
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          fontSize: '0.85rem',
          color: '#cbd5e1'
        }}>
          <span>🚛 247 Active Loads</span>
          <span>👨‍💼 156 Drivers</span>
          <span>📊 96.2% On-Time</span>
          <span>💰 $2.4M MTD Revenue</span>
        </div>
      </div>

      {/* Executive KPIs - Back to original glassmorphism style */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Active Loads */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
        borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', margin: '0 0 8px 0', fontWeight: '500' }}>
                Active Loads
              </p>
              <p style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                247
              </p>
              <p style={{ color: '#4ade80', fontSize: '12px', margin: 0 }}>
                Total loads
              </p>
            </div>
            <div style={{
              padding: '12px',
              background: 'rgba(59, 130, 246, 0.2)',
              borderRadius: '12px'
            }}>
              <span style={{ fontSize: '24px' }}>📦</span>
            </div>
          </div>
        </div>

        {/* Fleet Utilization */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', margin: '0 0 8px 0', fontWeight: '500' }}>
                Fleet Utilization
              </p>
              <p style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                87%
              </p>
              <p style={{ color: '#4ade80', fontSize: '12px', margin: 0 }}>
                Vehicles active
              </p>
              </div>
              <div style={{ 
              padding: '12px',
              background: 'rgba(59, 130, 246, 0.2)',
              borderRadius: '12px'
            }}>
              <span style={{ fontSize: '24px' }}>🚛</span>
              </div>
              </div>
              </div>

        {/* Revenue */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', margin: '0 0 8px 0', fontWeight: '500' }}>
                Revenue (MTD)
              </p>
              <p style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                $2.4M
              </p>
              <p style={{ color: '#4ade80', fontSize: '12px', margin: 0 }}>
                Monthly revenue
              </p>
            </div>
            <div style={{
              padding: '12px',
              background: 'rgba(34, 197, 94, 0.2)',
              borderRadius: '12px'
            }}>
              <span style={{ fontSize: '24px' }}>💰</span>
            </div>
        </div>
      </div>

        {/* On-Time Delivery */}
      <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
        borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', margin: '0 0 8px 0', fontWeight: '500' }}>
                On-Time Delivery
              </p>
              <p style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                96.2%
              </p>
              <p style={{ color: '#4ade80', fontSize: '12px', margin: 0 }}>
                Delivery rate
              </p>
            </div>
            <div style={{
              padding: '12px',
              background: 'rgba(16, 185, 129, 0.2)',
              borderRadius: '12px'
            }}>
              <span style={{ fontSize: '24px' }}>✅</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
        <div style={{
          display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '30px'
        }}>
          {quickLinks.map((link, index) => (
            <Link key={index} href={link.href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: link.bg,
                borderRadius: '12px',
              padding: '20px',
                textAlign: 'center',
                transition: 'all 0.3s ease',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
              onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{link.emoji}</div>
              <div style={{ fontSize: '1rem', fontWeight: '700', color: link.color }}>
                  {link.title}
                </div>
              </div>
            </Link>
          ))}
      </div>

      {/* Real-Time Monitoring & Alerts */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '32px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px' }}>
          <h2 style={{
            fontSize: '1.5rem', 
            color: '#ffffff',
              fontWeight: '700',
            margin: 0
          }}>
            🚨 System Monitoring & Alerts
          </h2>
          <Link href="/notifications" style={{ 
            textDecoration: 'none',
            color: '#d97706',
            fontSize: '14px',
            fontWeight: '600',
            padding: '12px 24px',
            border: '2px solid #f59e0b',
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1))',
            boxShadow: '0 4px 12px rgba(251, 191, 36, 0.2)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #fbbf24, #f59e0b)';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(251, 191, 36, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1))';
            e.currentTarget.style.color = '#d97706';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(251, 191, 36, 0.2)';
          }}>
            🔔 Notification Hub →
          </Link>
            </div>

        {/* Alert Summary Counters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
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
              {criticalAlerts}
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
              {warningAlerts}
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
              {infoAlerts}
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
              {alerts.length}
            </div>
            <div style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontSize: '12px'
            }}>
              Total
            </div>
          </div>

          {/* Notifications Count */}
          <div style={{
            background: '#8b5cf620',
            border: '1px solid #8b5cf640',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{ 
              color: '#8b5cf6', 
              fontSize: '24px', 
              fontWeight: 'bold',
              marginBottom: '4px'
            }}>
              8
            </div>
            <div style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontSize: '12px'
            }}>
              Notifications
            </div>
          </div>
        </div>

        {/* Recent Alerts Preview */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h3 style={{ 
              color: 'white',
              fontSize: '16px', 
              fontWeight: '600', 
              margin: 0 
            }}>
              Recent Alert Summary
            </h3>
            <span style={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              fontSize: '12px'
            }}>
              Live monitoring active
            </span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {alerts.slice(0, 3).map((alert) => (
              <div key={alert.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
                border: `1px solid ${getAlertColor(alert.type)}40`,
                borderLeft: `4px solid ${getAlertColor(alert.type)}`,
                transition: 'all 0.3s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <div style={{ fontSize: '18px' }}>
                    {getAlertIcon(alert.type)}
                  </div>
                  <div>
                    <div style={{ 
                      color: 'white', 
                      fontSize: '14px', 
              fontWeight: '600',
                      marginBottom: '2px'
                    }}>
                      {alert.title}
                    </div>
                    <div style={{ 
                      color: 'rgba(255, 255, 255, 0.8)', 
                      fontSize: '12px'
                    }}>
                      {alert.message.length > 60 ? alert.message.substring(0, 60) + '...' : alert.message}
                    </div>
                  </div>
                </div>
                
                <div style={{ 
                  color: 'rgba(255, 255, 255, 0.6)', 
                  fontSize: '11px',
                  textAlign: 'right'
                }}>
                  {alert.timestamp}
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div style={{
            marginTop: '20px',
            padding: '16px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ 
              color: 'white',
              fontSize: '14px', 
              fontWeight: '500',
              marginBottom: '8px'
            }}>
              {alerts.length > 3 ? `${alerts.length - 3} more alerts` : 'All alerts shown'} • 
              {alerts.filter(a => a.actionRequired).length} require action
            </div>
            <Link href="/notifications" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'linear-gradient(135deg, #fef3c7, #fbbf24)',
                color: '#2d3748',
              border: 'none',
              borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
                transition: 'all 0.3s ease'
            }}>
                🔔 View All Alerts & Notifications
            </button>
            </Link>
          </div>
          </div>
        </div>

      {/* Executive Load Management */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '32px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          marginBottom: '25px',
          color: '#ffffff',
          fontWeight: '700'
        }}>
          🎯 Executive Load Management
        </h2>

        {/* Executive Load Management KPIs - Exact match to tracking page status distribution */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {/* Available Loads */}
              <div style={{ 
            background: '#22c55e20',
            border: '1px solid #22c55e40',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{ 
              color: '#22c55e', 
              fontSize: '24px', 
              fontWeight: 'bold',
              marginBottom: '4px'
            }}>
              32
              </div>
            <div style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontSize: '12px',
              textTransform: 'capitalize'
            }}>
              Available
            </div>
        </div>

          {/* In Transit */}
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
              89
            </div>
            <div style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontSize: '12px',
              textTransform: 'capitalize'
            }}>
              In Transit
            </div>
        </div>

          {/* Loading */}
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
              18
            </div>
            <div style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontSize: '12px',
              textTransform: 'capitalize'
            }}>
              Loading
            </div>
          </div>

          {/* Delivered */}
          <div style={{
            background: '#10b98120',
            border: '1px solid #10b98140',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{ 
              color: '#10b981', 
              fontSize: '24px', 
              fontWeight: 'bold',
              marginBottom: '4px'
            }}>
              108
            </div>
            <div style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontSize: '12px',
              textTransform: 'capitalize'
            }}>
              Delivered
            </div>
          </div>
        </div>

        {/* Live Load Board - Enhanced with functionality */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <h2 style={{ color: '#ffffff', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
              📋 Priority Load Board
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                Live Data Feed
              </div>
              <button style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                + Post New Load
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {loads.map((load, index) => (
          <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
            transition: 'all 0.3s ease',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer'
          }}
              onClick={() => handleLoadClick(load.id)}
          onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)'
          }}
          onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
            e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: getStatusColor(load.status),
                  borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                color: 'white',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    {load.id.slice(-3)}
                  </div>
                  <div>
                    <h3 style={{ color: 'white', fontWeight: '600', margin: '0 0 4px 0', fontSize: '16px' }}>
                      {load.origin} → {load.destination}
                    </h3>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0, fontSize: '14px' }}>
                      {load.customer} • {load.driver} • {load.miles} miles
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                      {load.weight}
                    </p>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', margin: 0 }}>
                      Weight
                    </p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: getStatusColor(load.status), fontSize: '14px', fontWeight: '600', margin: '0 0 4px 0' }}>
                {load.status}
                    </p>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', margin: 0 }}>
                      Status
                    </p>
            </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#22c55e', fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                      {load.rate}
                    </p>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', margin: 0 }}>
                      Rate
                    </p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#ef4444', fontSize: '14px', fontWeight: '600', margin: '0 0 4px 0' }}>
                      {load.profit}
                    </p>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', margin: 0 }}>
                      Profit
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
              {load.status === 'Available' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAcceptLoad(load.id)
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                          padding: '6px 12px',
                  borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                  cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Accept
                </button>
              )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleBidLoad(load.id)
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                        padding: '6px 12px',
                  borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                  cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Bid
                </button>
                  </div>
              </div>
            </div>
          ))}
          </div>
        </div>

        {/* Load Details Modal */}
        {showLoadDetails && selectedLoadData && (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ color: '#1e293b', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                  Load Details - {selectedLoadData.id}
                </h2>
                <button 
                  onClick={() => setShowLoadDetails(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6b7280'
                  }}
                >
                  ×
                </button>
        </div>

        <div style={{
          display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                marginBottom: '24px'
              }}>
                <div>
                  <h3 style={{ color: '#1e293b', fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                    Route Information
                  </h3>
                  <div style={{ color: '#4b5563', fontSize: '14px', lineHeight: '1.6' }}>
                    <p><strong>Origin:</strong> {selectedLoadData.origin}</p>
                    <p><strong>Destination:</strong> {selectedLoadData.destination}</p>
                    <p><strong>Distance:</strong> {selectedLoadData.miles} miles</p>
                    <p><strong>Pickup:</strong> {selectedLoadData.pickup}</p>
                    <p><strong>Delivery:</strong> {selectedLoadData.delivery}</p>
            </div>
          </div>
                
                <div>
                  <h3 style={{ color: '#1e293b', fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                    Load Details
                  </h3>
                  <div style={{ color: '#4b5563', fontSize: '14px', lineHeight: '1.6' }}>
                    <p><strong>Weight:</strong> {selectedLoadData.weight}</p>
                    <p><strong>Commodity:</strong> {selectedLoadData.commodity}</p>
                    <p><strong>Equipment:</strong> {selectedLoadData.equipment}</p>
                    <p><strong>Priority:</strong> {selectedLoadData.priority}</p>
                    <p><strong>Status:</strong> <span style={{ color: getStatusColor(selectedLoadData.status) }}>{selectedLoadData.status}</span></p>
          </div>
        </div>
      </div>

        <div style={{
          display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                marginBottom: '24px'
              }}>
                <div>
                  <h3 style={{ color: '#1e293b', fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                    Financial Details
                  </h3>
                  <div style={{ color: '#4b5563', fontSize: '14px', lineHeight: '1.6' }}>
                    <p><strong>Rate:</strong> <span style={{ color: '#22c55e' }}>{selectedLoadData.rate}</span></p>
                    <p><strong>Profit:</strong> <span style={{ color: '#ef4444' }}>{selectedLoadData.profit}</span></p>
            </div>
        </div>

                <div>
                  <h3 style={{ color: '#1e293b', fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                    Assignment
                  </h3>
                  <div style={{ color: '#4b5563', fontSize: '14px', lineHeight: '1.6' }}>
                    <p><strong>Customer:</strong> {selectedLoadData.customer}</p>
                    <p><strong>Driver:</strong> {selectedLoadData.driver}</p>
            </div>
            </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => setShowLoadDetails(false)}
                  style={{
                    background: 'rgba(107, 114, 128, 0.1)',
                    color: '#6b7280',
                    border: '1px solid rgba(107, 114, 128, 0.3)',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
                {selectedLoadData.status === 'Available' && (
                  <button 
                    onClick={() => handleAcceptLoad(selectedLoadData.id)}
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Accept Load
              </button>
                )}
                <button 
                  onClick={() => handleBidLoad(selectedLoadData.id)}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Submit Bid
              </button>
            </div>
          </div>
          </div>
        )}

        {/* Action Center */}
          <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '20px',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
              🎯 Next Action Required
            </div>
            <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
              3 loads need driver assignment • 2 require customer confirmation • 1 delivery update pending
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href="/tracking">
              <button style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-block'
              }}>
                📍 Live Tracking
              </button>
            </Link>
              <button style={{
              background: 'linear-gradient(135deg, #059669, #047857)',
                color: 'white',
                border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              📞 Contact Center
              </button>
            </div>
          </div>
        </div>

      {/* Executive Alerts & Notifications */}
        <div style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '25px',
        marginBottom: '30px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ 
          fontSize: '1.3rem', 
          marginBottom: '20px',
          color: '#ffffff',
          fontWeight: '700'
        }}>
          🚨 Executive Alerts & System Status
        </h2>
        
          <div style={{
            display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {/* Critical Alerts */}
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h3 style={{ fontSize: '1rem', color: '#ef4444', fontWeight: '700', marginBottom: '15px' }}>
              🔴 Critical Alerts (3)
            </h3>
            <div>
              <div style={{ marginBottom: '10px', fontSize: '0.8rem', color: 'white' }}>
                • Driver timeout: LD001 - No response for 2+ hours
          </div>
              <div style={{ marginBottom: '10px', fontSize: '0.8rem', color: 'white' }}>
                • Weather delay: Route I-80 through Wyoming
              </div>
              <div style={{ fontSize: '0.8rem', color: 'white' }}>
                • Customer complaint: Delivery LD089 damaged goods
              </div>
        </div>
      </div>

          {/* System Performance */}
      <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
        borderRadius: '12px',
            padding: '20px'
          }}>
            <h3 style={{ fontSize: '1rem', color: '#22c55e', fontWeight: '700', marginBottom: '15px' }}>
              💚 System Health (Excellent)
            </h3>
            <div>
              <div style={{ marginBottom: '10px', fontSize: '0.8rem', color: 'white' }}>
                • API Response Time: 89ms (Optimal)
              </div>
              <div style={{ marginBottom: '10px', fontSize: '0.8rem', color: 'white' }}>
                • GPS Tracking: 99.8% Active Coverage
              </div>
              <div style={{ fontSize: '0.8rem', color: 'white' }}>
                • Database Performance: No Issues Detected
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
