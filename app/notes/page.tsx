'use client'

import Link from 'next/link'
import StickyNote from '../components/StickyNote-Enhanced'

export default function NotesPage() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)',
      minHeight: '100vh',
      padding: '80px 20px 20px 20px'
    }}>
      {/* Back Button */}
      <div style={{ padding: '0 0 24px 0', maxWidth: '1200px', margin: '0 auto' }}>
        <Link href="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
          <button style={{
            background: 'rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 0, 0, 0.2)',
            color: '#2d3748',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.2)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            ← Back to Dashboard
          </button>
        </Link>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(0, 0, 0, 0.2)',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#2d3748',
            marginBottom: '12px',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            📝 Notes & Communications Hub
          </h1>
          <p style={{
            fontSize: '20px',
            color: '#1f2937',
            margin: 0,
            opacity: 0.8
          }}>
            Centralized notification system for dispatchers, brokers, and operations team
          </p>
        </div>

        {/* Quick Access to Different Entity Types */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(0, 0, 0, 0.2)',
          padding: '32px',
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            🎯 Quick Access
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {[
              { href: '/compliance', title: 'Compliance Dashboard', emoji: '✅', description: 'Compliance alerts & monitoring' },
              { href: '/dispatch', title: 'Dispatch Central', emoji: '🚛', description: 'Load assignments & updates' },
              { href: '/drivers', title: 'Driver Management', emoji: '👨‍💼', description: 'Driver communications' },
              { href: '/vehicles', title: 'Fleet Management', emoji: '🚚', description: 'Vehicle tracking notes' },
              { href: '/broker/dashboard', title: 'Broker Communications', emoji: '🏢', description: 'Broker notifications' },
              { href: '/shippers', title: 'Shipper Portfolio', emoji: '📋', description: 'Shipper updates' }
            ].map((link, index) => (
              <Link key={index} href={link.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  border: '1px solid rgba(0, 0, 0, 0.1)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>{link.emoji}</div>
                  <h3 style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    margin: '0 0 8px 0',
                    color: '#2d3748'
                  }}>
                    {link.title}
                  </h3>
                  <p style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    {link.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Central Notification Hub */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(0, 0, 0, 0.2)',
          padding: '32px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            🔔 Central Notification Hub
          </h2>
          
          <StickyNote 
            section="central" 
            entityId="notification-hub" 
            entityName="Central Communication Hub" 
            entityType="general"
            isNotificationHub={true}
          />
        </div>

        {/* Message Tracking & Communication Logs */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(0, 0, 0, 0.2)',
          padding: '32px',
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            📞 Message Tracking & Communication Logs
          </h2>
          
          {/* Communication Dashboard */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            {/* SMS Activity */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ fontSize: '24px', marginRight: '10px' }}>📱</span>
                <h3 style={{ color: '#2d3748', fontSize: '18px', fontWeight: '600', margin: 0 }}>
                  SMS Activity
                </h3>
              </div>
              <div style={{ display: 'grid', gap: '10px' }}>
                {/* Recent SMS Messages */}
                <div style={{ 
                  background: '#f0f9ff', 
                  padding: '12px', 
                  borderRadius: '8px',
                  borderLeft: '4px solid #3b82f6'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <strong style={{ color: '#1e40af', fontSize: '12px' }}>TO: Driver Mike R.</strong>
                    <span style={{ color: '#6b7280', fontSize: '11px' }}>2 min ago</span>
                  </div>
                  <p style={{ color: '#374151', fontSize: '13px', margin: '0 0 5px 0' }}>
                    "New load LD-2025-789 assigned. Pickup at 2:00 PM."
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#059669', fontSize: '11px', fontWeight: '600' }}>✅ DELIVERED</span>
                    <span style={{ color: '#6b7280', fontSize: '11px' }}>From: Dispatch Sarah</span>
                  </div>
                </div>

                <div style={{ 
                  background: '#f0fdf4', 
                  padding: '12px', 
                  borderRadius: '8px',
                  borderLeft: '4px solid #10b981'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <strong style={{ color: '#065f46', fontSize: '12px' }}>FROM: Driver John S.</strong>
                    <span style={{ color: '#6b7280', fontSize: '11px' }}>5 min ago</span>
                  </div>
                  <p style={{ color: '#374151', fontSize: '13px', margin: '0 0 5px 0' }}>
                    "Pickup completed. ETA to delivery: 3 hours."
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#059669', fontSize: '11px', fontWeight: '600' }}>📨 RECEIVED</span>
                    <span style={{ color: '#6b7280', fontSize: '11px' }}>To: Dispatch Tom</span>
                  </div>
                </div>

                <div style={{
                  textAlign: 'center',
                  marginTop: '10px'
                }}>
                  <button style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    📱 View All SMS Logs
                  </button>
                </div>
              </div>
            </div>

            {/* Email Activity */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ fontSize: '24px', marginRight: '10px' }}>📧</span>
                <h3 style={{ color: '#2d3748', fontSize: '18px', fontWeight: '600', margin: 0 }}>
                  Email Activity
                </h3>
              </div>
              <div style={{ display: 'grid', gap: '10px' }}>
                {/* Recent Email Messages */}
                <div style={{ 
                  background: '#fef3c7', 
                  padding: '12px', 
                  borderRadius: '8px',
                  borderLeft: '4px solid #f59e0b'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <strong style={{ color: '#92400e', fontSize: '12px' }}>TO: carrier@acmelogistics.com</strong>
                    <span style={{ color: '#6b7280', fontSize: '11px' }}>15 min ago</span>
                  </div>
                  <p style={{ color: '#374151', fontSize: '13px', margin: '0 0 5px 0' }}>
                    "Invoice INV-2025-0103 for Load LD-2025-456"
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#059669', fontSize: '11px', fontWeight: '600' }}>✅ SENT</span>
                    <span style={{ color: '#6b7280', fontSize: '11px' }}>From: Billing Dept</span>
                  </div>
                </div>

                <div style={{ 
                  background: '#e0f2fe', 
                  padding: '12px', 
                  borderRadius: '8px',
                  borderLeft: '4px solid #0ea5e9'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <strong style={{ color: '#0c4a6e', fontSize: '12px' }}>FROM: broker@fastfreight.com</strong>
                    <span style={{ color: '#6b7280', fontSize: '11px' }}>1 hour ago</span>
                  </div>
                  <p style={{ color: '#374151', fontSize: '13px', margin: '0 0 5px 0' }}>
                    "Load tender for Houston to Dallas route"
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#059669', fontSize: '11px', fontWeight: '600' }}>📨 RECEIVED</span>
                    <span style={{ color: '#6b7280', fontSize: '11px' }}>To: Operations</span>
                  </div>
                </div>

                <div style={{
                  textAlign: 'center',
                  marginTop: '10px'
                }}>
                  <button style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    📧 View All Email Logs
                  </button>
                </div>
              </div>
            </div>

            {/* System Notifications */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ fontSize: '24px', marginRight: '10px' }}>🔔</span>
                <h3 style={{ color: '#2d3748', fontSize: '18px', fontWeight: '600', margin: 0 }}>
                  System Alerts
                </h3>
              </div>
              <div style={{ display: 'grid', gap: '10px' }}>
                {/* Recent System Notifications */}
                <div style={{ 
                  background: '#fef2f2', 
                  padding: '12px', 
                  borderRadius: '8px',
                  borderLeft: '4px solid #ef4444'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <strong style={{ color: '#dc2626', fontSize: '12px' }}>URGENT: DOT Compliance</strong>
                    <span style={{ color: '#6b7280', fontSize: '11px' }}>30 min ago</span>
                  </div>
                  <p style={{ color: '#374151', fontSize: '13px', margin: '0 0 5px 0' }}>
                    "Carrier MC-12345 insurance expired"
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#dc2626', fontSize: '11px', fontWeight: '600' }}>🚨 PENDING</span>
                    <span style={{ color: '#6b7280', fontSize: '11px' }}>For: Compliance Team</span>
                  </div>
                </div>

                <div style={{ 
                  background: '#f0fdf4', 
                  padding: '12px', 
                  borderRadius: '8px',
                  borderLeft: '4px solid #10b981'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <strong style={{ color: '#065f46', fontSize: '12px' }}>SUCCESS: Route Optimization</strong>
                    <span style={{ color: '#6b7280', fontSize: '11px' }}>1 hour ago</span>
                  </div>
                  <p style={{ color: '#374151', fontSize: '13px', margin: '0 0 5px 0' }}>
                    "Load LD-2025-321 optimized, 15% fuel savings"
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#059669', fontSize: '11px', fontWeight: '600' }}>✅ COMPLETED</span>
                    <span style={{ color: '#6b7280', fontSize: '11px' }}>For: Dispatch Team</span>
                  </div>
                </div>

                <div style={{
                  textAlign: 'center',
                  marginTop: '10px'
                }}>
                  <button style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    🔔 View All Alerts
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Message Tracking Summary */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '12px',
            padding: '25px',
            border: '1px solid rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              color: '#2d3748',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              📊 Communication Overview (Last 24 Hours)
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '15px',
              marginBottom: '20px'
            }}>
              {[
                { label: 'SMS Sent', value: '47', color: '#10b981', icon: '📱' },
                { label: 'SMS Received', value: '23', color: '#3b82f6', icon: '📨' },
                { label: 'Emails Sent', value: '12', color: '#f59e0b', icon: '📧' },
                { label: 'Alerts Created', value: '8', color: '#ef4444', icon: '🚨' },
                { label: 'Active Threads', value: '15', color: '#8b5cf6', icon: '💬' },
                { label: 'Pending Actions', value: '5', color: '#f97316', icon: '⏳' }
              ].map((stat, index) => (
                <div key={index} style={{
                  textAlign: 'center',
                  padding: '10px'
                }}>
                  <div style={{ fontSize: '20px', marginBottom: '5px' }}>{stat.icon}</div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: stat.color,
                    marginBottom: '2px'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '11px' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '10px'
            }}>
              {[
                { action: 'Send Bulk SMS', icon: '📱', color: '#10b981' },
                { action: 'Email Broadcast', icon: '📧', color: '#3b82f6' },
                { action: 'Emergency Alert', icon: '🚨', color: '#ef4444' },
                { action: 'View Message History', icon: '📜', color: '#8b5cf6' }
              ].map((button, index) => (
                <button key={index} style={{
                  background: button.color,
                  color: 'white',
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px'
                }}>
                  <span>{button.icon}</span>
                  {button.action}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.05)',
          backdropFilter: 'blur(5px)',
          borderRadius: '12px',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          padding: '24px',
          marginTop: '32px',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '16px'
          }}>
            📋 How to Use Notes & Communications
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            textAlign: 'left'
          }}>
            <div>
              <h4 style={{ color: '#1f2937', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                📝 Create Notes
              </h4>
              <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>
                Add notes on any driver, carrier, shipper, or load for team visibility
              </p>
            </div>
            <div>
              <h4 style={{ color: '#1f2937', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                🔔 Notifications
              </h4>
              <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>
                Set priority levels and assign notifications to specific team members
              </p>
            </div>
            <div>
              <h4 style={{ color: '#1f2937', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                💬 Communicate
              </h4>
              <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>
                Use as an intraoffice communication center for operations coordination
              </p>
            </div>
            <div>
              <h4 style={{ color: '#1f2937', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                📊 Track Tasks
              </h4>
              <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>
                Monitor follow-up tasks and maintain accountability across teams
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
