'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SMSTrainingGuide() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', title: '📱 System Overview', icon: '🔍' },
    { id: 'integration', title: '🔄 Workflow Integration', icon: '⚙️' },
    { id: 'templates', title: '📝 Message Templates', icon: '📋' },
    { id: 'tracking', title: '📊 Message Tracking', icon: '📈' },
    { id: 'bestpractices', title: '✨ Best Practices', icon: '🎯' },
    { id: 'troubleshooting', title: '🔧 Troubleshooting', icon: '🛠️' }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '30px',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
            📱 SMS Notification System Training
          </h1>
          <Link href="/training" style={{
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: '600'
          }}>
            ← Back to Training
          </Link>
        </div>
        <p style={{ fontSize: '1.1rem', color: '#6b7280', lineHeight: '1.6' }}>
          Master the SMS notification system within the FleetFlow WorkFlow Ecosystem. 
          Learn how SMS integrates with every aspect of logistics operations.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '30px' }}>
        {/* Navigation Sidebar */}
        <div style={{
          width: '300px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '20px',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          height: 'fit-content'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>
            📚 Training Sections
          </h3>
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '15px',
                marginBottom: '10px',
                background: activeSection === section.id 
                  ? 'linear-gradient(135deg, #34d399, #10b981)' 
                  : 'rgba(249, 250, 251, 0.8)',
                color: activeSection === section.id ? 'white' : '#374151',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{section.icon}</span>
              <span>{section.title}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{
          flex: 1,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '30px',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>
                🔍 SMS System Overview
              </h2>
              <div style={{ lineHeight: '1.8', color: '#374151', fontSize: '1.1rem' }}>
                <p style={{ marginBottom: '20px' }}>
                  The SMS notification system is the communication backbone of FleetFlow, ensuring all stakeholders 
                  stay informed throughout the logistics workflow.
                </p>
                
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px', marginTop: '25px' }}>
                  🏗️ System Architecture
                </h3>
                <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
                  <li><strong>SMS Service:</strong> Core functionality for sending notifications</li>
                  <li><strong>Notification API:</strong> Backend endpoint handling message routing</li>
                  <li><strong>System Orchestrator:</strong> Workflow integration and automation</li>
                  <li><strong>Message Tracking:</strong> Complete audit trail and status monitoring</li>
                </ul>

                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px', marginTop: '25px' }}>
                  👥 Key Stakeholders
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                  {[
                    { role: 'Drivers', icon: '🚛', desc: 'Load assignments, pickup/delivery reminders' },
                    { role: 'Carriers', icon: '🏢', desc: 'Dispatch notifications, status updates' },
                    { role: 'Brokers', icon: '🤝', desc: 'Load confirmations, rate changes' },
                    { role: 'Customers', icon: '👤', desc: 'Shipment tracking, delivery notifications' }
                  ].map(stakeholder => (
                    <div key={stakeholder.role} style={{
                      padding: '15px',
                      background: 'rgba(34, 197, 94, 0.1)',
                      borderRadius: '12px',
                      border: '1px solid rgba(34, 197, 94, 0.2)'
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{stakeholder.icon}</div>
                      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{stakeholder.role}</div>
                      <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>{stakeholder.desc}</div>
                    </div>
                  ))}
                </div>

                <div style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginTop: '25px'
                }}>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
                    🎯 Learning Objectives
                  </h4>
                  <ul style={{ marginBottom: '0', paddingLeft: '20px' }}>
                    <li>Understand SMS integration in workflow stages</li>
                    <li>Learn message templates and customization</li>
                    <li>Master tracking and audit capabilities</li>
                    <li>Apply best practices for effective communication</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Workflow Integration Section */}
          {activeSection === 'integration' && (
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>
                🔄 Workflow Integration
              </h2>
              <div style={{ lineHeight: '1.8', color: '#374151', fontSize: '1.1rem' }}>
                <p style={{ marginBottom: '25px' }}>
                  SMS notifications are automatically triggered at each stage of the logistics workflow, 
                  ensuring seamless communication without manual intervention.
                </p>

                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>
                  📋 Workflow Stages & SMS Triggers
                </h3>

                {[
                  {
                    stage: '1. Load Creation & Assignment',
                    icon: '📝',
                    color: 'rgba(59, 130, 246, 0.1)',
                    border: 'rgba(59, 130, 246, 0.2)',
                    triggers: [
                      'Driver SMS: "📋 New load assigned: LOAD-123. Route document ready!"',
                      'Carrier SMS: "✅ Load LOAD-123 dispatched successfully. Driver assigned."'
                    ]
                  },
                  {
                    stage: '2. Route Optimization',
                    icon: '🗺️',
                    color: 'rgba(16, 185, 129, 0.1)',
                    border: 'rgba(16, 185, 129, 0.2)',
                    triggers: [
                      'Route updates with optimized path and timing',
                      'Schedule changes and delay notifications',
                      'Real-time tracking link distribution'
                    ]
                  },
                  {
                    stage: '3. Pickup Process',
                    icon: '📦',
                    color: 'rgba(245, 158, 11, 0.1)',
                    border: 'rgba(245, 158, 11, 0.2)',
                    triggers: [
                      'Pickup reminders: "⏰ PICKUP REMINDER - Load: LOAD-123, Today"',
                      'Location confirmations and arrival notifications',
                      'Documentation requirements alerts'
                    ]
                  },
                  {
                    stage: '4. In-Transit Monitoring',
                    icon: '🚛',
                    color: 'rgba(139, 92, 246, 0.1)',
                    border: 'rgba(139, 92, 246, 0.2)',
                    triggers: [
                      'Customer updates: "📦 Your shipment LOAD-123 is in transit"',
                      'Milestone notifications and progress updates',
                      'Emergency alerts for delays or issues'
                    ]
                  },
                  {
                    stage: '5. Delivery Completion',
                    icon: '🎯',
                    color: 'rgba(236, 72, 153, 0.1)',
                    border: 'rgba(236, 72, 153, 0.2)',
                    triggers: [
                      'Delivery reminders: "🎯 DELIVERY REMINDER - Expected Today"',
                      'Completion confirmations and POD notifications',
                      'Invoice and payment processing alerts'
                    ]
                  }
                ].map((stage, index) => (
                  <div key={index} style={{
                    background: stage.color,
                    border: `1px solid ${stage.border}`,
                    borderRadius: '15px',
                    padding: '20px',
                    marginBottom: '20px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                      <span style={{ fontSize: '2rem' }}>{stage.icon}</span>
                      <h4 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                        {stage.stage}
                      </h4>
                    </div>
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                      {stage.triggers.map((trigger, idx) => (
                        <li key={idx} style={{ marginBottom: '8px' }}>{trigger}</li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginTop: '25px'
                }}>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
                    🔗 Integration Points
                  </h4>
                  <ul style={{ marginBottom: '0', paddingLeft: '20px' }}>
                    <li>Automatic triggering based on workflow status changes</li>
                    <li>Role-based recipient selection (drivers, carriers, customers)</li>
                    <li>Dynamic content generation using load and route data</li>
                    <li>Real-time status tracking and delivery confirmation</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Message Templates Section */}
          {activeSection === 'templates' && (
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>
                📝 Message Templates
              </h2>
              <div style={{ lineHeight: '1.8', color: '#374151', fontSize: '1.1rem' }}>
                <p style={{ marginBottom: '25px' }}>
                  FleetFlow uses predefined templates to ensure consistent, professional communication. 
                  Each template is optimized for specific workflow stages and recipient types.
                </p>

                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>
                  📋 Available Templates
                </h3>

                {[
                  {
                    name: 'new-load',
                    title: '🚛 New Load Assignment',
                    description: 'Notifies drivers and carriers about new load assignments',
                    example: `🚛 NEW LOAD AVAILABLE
📍 From: Atlanta, GA
📍 To: Miami, FL
💰 Rate: $2,500
📅 Pickup: Tomorrow
🚚 Equipment: Dry Van
📏 Distance: 650 miles

Load ID: LOAD-123
Reply ACCEPT to claim this load!`
                  },
                  {
                    name: 'pickup-reminder',
                    title: '⏰ Pickup Reminder',
                    description: 'Reminds drivers about upcoming pickup appointments',
                    example: `⏰ PICKUP REMINDER
Load: LOAD-123
📍 Pickup: Atlanta, GA
📅 Today - 2:00 PM
🚚 Equipment: Dry Van

Safe travels! 🛣️`
                  },
                  {
                    name: 'delivery-reminder',
                    title: '🎯 Delivery Reminder',
                    description: 'Alerts about upcoming delivery requirements',
                    example: `🎯 DELIVERY REMINDER
Load: LOAD-123
📍 Delivery: Miami, FL
📅 Expected Today
💰 Rate: $2,500

Almost there! 🏁`
                  },
                  {
                    name: 'load-update',
                    title: '📋 Load Update',
                    description: 'Communicates changes to load details or status',
                    example: `📋 LOAD UPDATE - LOAD-123
Atlanta, GA → Miami, FL
Rate: $2,500
Pickup: Tomorrow 2:00 PM
Equipment: Dry Van

Check your app for full details.`
                  },
                  {
                    name: 'custom',
                    title: '💬 Custom Message',
                    description: 'Flexible template for dispatcher-created messages',
                    example: `Custom message content created by dispatcher with load-specific information and personalized communication.`
                  }
                ].map((template, index) => (
                  <div key={index} style={{
                    background: 'rgba(249, 250, 251, 0.8)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '15px',
                    padding: '20px',
                    marginBottom: '20px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                      <h4 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                        {template.title}
                      </h4>
                      <span style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        color: '#1d4ed8',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        {template.name}
                      </span>
                    </div>
                    <p style={{ marginBottom: '15px', color: '#6b7280' }}>{template.description}</p>
                    <div style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '15px',
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      whiteSpace: 'pre-line',
                      color: '#374151'
                    }}>
                      {template.example}
                    </div>
                  </div>
                ))}

                <div style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginTop: '25px'
                }}>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
                    ⚡ Template Features
                  </h4>
                  <ul style={{ marginBottom: '0', paddingLeft: '20px' }}>
                    <li>Dynamic content insertion (load data, dates, locations)</li>
                    <li>Emoji usage for visual clarity and engagement</li>
                    <li>Consistent formatting across all message types</li>
                    <li>Mobile-optimized length and structure</li>
                    <li>Call-to-action elements for driver responses</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Message Tracking Section */}
          {activeSection === 'tracking' && (
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>
                📊 Message Tracking & Analytics
              </h2>
              <div style={{ lineHeight: '1.8', color: '#374151', fontSize: '1.1rem' }}>
                <p style={{ marginBottom: '25px' }}>
                  Complete visibility into SMS communications with comprehensive tracking, 
                  audit trails, and performance analytics for operational excellence.
                </p>

                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>
                  📈 Tracking Capabilities
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '25px' }}>
                  {[
                    {
                      category: '📱 Message Status',
                      items: ['Sent confirmation', 'Delivery status', 'Failed delivery alerts', 'Read receipts (when available)']
                    },
                    {
                      category: '👥 Recipient Tracking',
                      items: ['Sender identification', 'Recipient details', 'Role-based categorization', 'Contact preferences']
                    },
                    {
                      category: '⏱️ Timing Analytics',
                      items: ['Send timestamps', 'Delivery times', 'Response times', 'Peak usage periods']
                    },
                    {
                      category: '💰 Cost Management',
                      items: ['Per-message costs', 'Monthly spending', 'Cost per load/workflow', 'ROI tracking']
                    }
                  ].map((category, index) => (
                    <div key={index} style={{
                      background: 'rgba(34, 197, 94, 0.1)',
                      border: '1px solid rgba(34, 197, 94, 0.2)',
                      borderRadius: '15px',
                      padding: '20px'
                    }}>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
                        {category.category}
                      </h4>
                      <ul style={{ paddingLeft: '20px', margin: 0 }}>
                        {category.items.map((item, idx) => (
                          <li key={idx} style={{ marginBottom: '8px' }}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>
                  🔍 Where to Access Tracking Data
                </h3>

                <div style={{ marginBottom: '25px' }}>
                  {[
                    {
                      location: 'Notes Hub',
                      path: '/notes',
                      icon: '📝',
                      description: 'Complete message logs with sender/recipient details, status tracking, and audit trails'
                    },
                    {
                      location: 'SMS Workflow Demo',
                      path: '/sms-workflow',
                      icon: '📱',
                      description: 'Visual workflow integration showing SMS triggers at each stage with real-time status'
                    },
                    {
                      location: 'System Dashboard',
                      path: '/',
                      icon: '📊',
                      description: 'Overview of notification performance and system health metrics'
                    }
                  ].map((location, index) => (
                    <div key={index} style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      borderRadius: '12px',
                      padding: '20px',
                      marginBottom: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px'
                    }}>
                      <div style={{ fontSize: '3rem' }}>{location.icon}</div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '5px' }}>
                          {location.location}
                        </h4>
                        <p style={{ margin: '0 0 10px 0', color: '#6b7280' }}>{location.description}</p>
                        <Link href={location.path} style={{
                          color: '#1d4ed8',
                          textDecoration: 'none',
                          fontWeight: '600'
                        }}>
                          → Visit {location.location}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: '12px',
                  padding: '20px'
                }}>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
                    📋 Audit Trail Components
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    {[
                      'Message ID (unique identifier)',
                      'Timestamp (send/delivery)',
                      'Sender/Recipient details',
                      'Message content & template',
                      'Delivery status & errors',
                      'Cost tracking per message'
                    ].map((item, index) => (
                      <div key={index} style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        padding: '10px',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}>
                        ✓ {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Best Practices Section */}
          {activeSection === 'bestpractices' && (
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>
                ✨ SMS Best Practices
              </h2>
              <div style={{ lineHeight: '1.8', color: '#374151', fontSize: '1.1rem' }}>
                <p style={{ marginBottom: '25px' }}>
                  Follow these proven best practices to maximize the effectiveness of SMS communications 
                  in your logistics operations while maintaining professional standards.
                </p>

                {[
                  {
                    category: '📝 Message Content Guidelines',
                    icon: '✍️',
                    color: 'rgba(59, 130, 246, 0.1)',
                    border: 'rgba(59, 130, 246, 0.2)',
                    practices: [
                      'Keep messages concise (160 characters optimal)',
                      'Use clear, action-oriented language',
                      'Include essential information: load ID, location, timing',
                      'Use emojis strategically for visual clarity',
                      'Always include contact information for questions'
                    ]
                  },
                  {
                    category: '⏰ Timing Optimization',
                    icon: '⏱️',
                    color: 'rgba(16, 185, 129, 0.1)',
                    border: 'rgba(16, 185, 129, 0.2)',
                    practices: [
                      'Send pickup reminders 2-4 hours in advance',
                      'Avoid sending non-urgent messages after 9 PM',
                      'Consider time zones for long-distance routes',
                      'Use urgency levels appropriately (Low/Normal/High/Urgent)',
                      'Send delivery updates proactively, not reactively'
                    ]
                  },
                  {
                    category: '👥 Recipient Management',
                    icon: '🎯',
                    color: 'rgba(245, 158, 11, 0.1)',
                    border: 'rgba(245, 158, 11, 0.2)',
                    practices: [
                      'Verify phone numbers before sending',
                      'Respect opt-out preferences and regulations',
                      'Use role-based targeting (driver vs. customer messages)',
                      'Maintain updated contact information',
                      'Allow recipients to update their preferences'
                    ]
                  },
                  {
                    category: '📊 Performance Monitoring',
                    icon: '📈',
                    color: 'rgba(139, 92, 246, 0.1)',
                    border: 'rgba(139, 92, 246, 0.2)',
                    practices: [
                      'Monitor delivery rates and failed messages',
                      'Track response times and engagement',
                      'Review cost per message and budget impact',
                      'Analyze peak usage times for optimization',
                      'Regularly audit message content effectiveness'
                    ]
                  },
                  {
                    category: '🔒 Compliance & Security',
                    icon: '🛡️',
                    color: 'rgba(236, 72, 153, 0.1)',
                    border: 'rgba(236, 72, 153, 0.2)',
                    practices: [
                      'Follow TCPA (Telephone Consumer Protection Act) guidelines',
                      'Implement proper consent mechanisms',
                      'Secure phone number storage and transmission',
                      'Document all communications for compliance',
                      'Provide clear opt-out instructions'
                    ]
                  },
                  {
                    category: '🚨 Emergency Protocols',
                    icon: '🆘',
                    color: 'rgba(239, 68, 68, 0.1)',
                    border: 'rgba(239, 68, 68, 0.2)',
                    practices: [
                      'Define escalation procedures for failed deliveries',
                      'Maintain backup communication channels',
                      'Use URGENT priority sparingly but effectively',
                      'Implement automatic retry logic for critical messages',
                      'Have manual override capabilities for emergencies'
                    ]
                  }
                ].map((section, index) => (
                  <div key={index} style={{
                    background: section.color,
                    border: `1px solid ${section.border}`,
                    borderRadius: '15px',
                    padding: '25px',
                    marginBottom: '25px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                      <span style={{ fontSize: '2.5rem' }}>{section.icon}</span>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                        {section.category}
                      </h3>
                    </div>
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                      {section.practices.map((practice, idx) => (
                        <li key={idx} style={{ marginBottom: '10px', fontSize: '1rem' }}>{practice}</li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  borderRadius: '12px',
                  padding: '20px'
                }}>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
                    🎯 Success Metrics to Track
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    {[
                      'Message delivery rate (>95%)',
                      'Response time to critical alerts',
                      'Customer satisfaction scores',
                      'Cost per successful communication',
                      'Driver engagement levels',
                      'Workflow completion times'
                    ].map((metric, index) => (
                      <div key={index} style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        padding: '12px',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        textAlign: 'center'
                      }}>
                        📊 {metric}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Troubleshooting Section */}
          {activeSection === 'troubleshooting' && (
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>
                🔧 Troubleshooting Guide
              </h2>
              <div style={{ lineHeight: '1.8', color: '#374151', fontSize: '1.1rem' }}>
                <p style={{ marginBottom: '25px' }}>
                  Quick solutions for common SMS notification issues in the FleetFlow system. 
                  Follow these diagnostic steps to resolve problems efficiently.
                </p>

                {[
                  {
                    problem: '📱 Messages Not Sending',
                    icon: '❌',
                    color: 'rgba(239, 68, 68, 0.1)',
                    border: 'rgba(239, 68, 68, 0.2)',
                    causes: [
                      'Twilio configuration missing or incorrect',
                      'Invalid phone number format',
                      'Insufficient account credits',
                      'Network connectivity issues'
                    ],
                    solutions: [
                      'Verify Twilio credentials in environment variables',
                      'Check phone number formatting (+1XXXXXXXXXX)',
                      'Review Twilio account balance and limits',
                      'Test with known working phone number',
                      'Check system logs for specific error messages'
                    ]
                  },
                  {
                    problem: '⏰ Delivery Delays',
                    icon: '🐌',
                    color: 'rgba(245, 158, 11, 0.1)',
                    border: 'rgba(245, 158, 11, 0.2)',
                    causes: [
                      'High message volume causing queues',
                      'Carrier network congestion',
                      'International delivery delays',
                      'Message content triggering spam filters'
                    ],
                    solutions: [
                      'Implement message queuing and rate limiting',
                      'Monitor delivery reports in Twilio console',
                      'Use shorter, simpler message content',
                      'Consider alternative delivery times',
                      'Verify recipient carrier network status'
                    ]
                  },
                  {
                    problem: '❌ Failed Message Delivery',
                    icon: '🚫',
                    color: 'rgba(139, 92, 246, 0.1)',
                    border: 'rgba(139, 92, 246, 0.2)',
                    causes: [
                      'Invalid or disconnected phone numbers',
                      'Recipient opted out of SMS',
                      'Message content blocked by filters',
                      'Routing/carrier issues'
                    ],
                    solutions: [
                      'Validate phone numbers before sending',
                      'Maintain updated contact database',
                      'Review message content for compliance',
                      'Implement automatic retry logic',
                      'Provide alternative contact methods'
                    ]
                  },
                  {
                    problem: '📊 Tracking Data Missing',
                    icon: '📉',
                    color: 'rgba(59, 130, 246, 0.1)',
                    border: 'rgba(59, 130, 246, 0.2)',
                    causes: [
                      'Database logging errors',
                      'Webhook configuration issues',
                      'System performance problems',
                      'Data retention policy limits'
                    ],
                    solutions: [
                      'Check database connection and logs',
                      'Verify Twilio webhook endpoints',
                      'Monitor system resource usage',
                      'Review data retention settings',
                      'Implement backup logging mechanisms'
                    ]
                  },
                  {
                    problem: '💰 Unexpected Costs',
                    icon: '💸',
                    color: 'rgba(236, 72, 153, 0.1)',
                    border: 'rgba(236, 72, 153, 0.2)',
                    causes: [
                      'International messaging rates',
                      'High volume unplanned usage',
                      'Premium number destinations',
                      'Failed message retry loops'
                    ],
                    solutions: [
                      'Review Twilio pricing for all destinations',
                      'Implement spending alerts and limits',
                      'Monitor daily/weekly usage patterns',
                      'Set up automatic budget notifications',
                      'Optimize message frequency and targeting'
                    ]
                  }
                ].map((issue, index) => (
                  <div key={index} style={{
                    background: issue.color,
                    border: `1px solid ${issue.border}`,
                    borderRadius: '15px',
                    padding: '25px',
                    marginBottom: '25px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                      <span style={{ fontSize: '2.5rem' }}>{issue.icon}</span>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                        {issue.problem}
                      </h3>
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
                        🔍 Common Causes:
                      </h4>
                      <ul style={{ paddingLeft: '20px', marginBottom: 0 }}>
                        {issue.causes.map((cause, idx) => (
                          <li key={idx} style={{ marginBottom: '5px' }}>{cause}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
                        ✅ Solutions:
                      </h4>
                      <ol style={{ paddingLeft: '20px', margin: 0 }}>
                        {issue.solutions.map((solution, idx) => (
                          <li key={idx} style={{ marginBottom: '8px', fontWeight: '500' }}>{solution}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))}

                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '12px',
                  padding: '20px'
                }}>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
                    🆘 Emergency Support Contacts
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                    {[
                      { dept: 'Technical Support', contact: 'tech-support@fleetflowapp.com' },
                      { dept: 'Twilio Account Issues', contact: 'support.twilio.com' },
                      { dept: 'System Administrator', contact: 'admin@fleetflowapp.com' },
                      { dept: 'Emergency Hotline', contact: '1-800-FLEET-911' }
                    ].map((contact, index) => (
                      <div key={index} style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        padding: '15px',
                        borderRadius: '8px'
                      }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{contact.dept}</div>
                        <div style={{ color: '#1d4ed8', fontWeight: '600' }}>{contact.contact}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation at bottom */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '40px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(0, 0, 0, 0.1)'
          }}>
            <Link href="/sms-workflow" style={{
              background: 'linear-gradient(135deg, #34d399, #10b981)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              📱 View SMS Demo
            </Link>
            <Link href="/notes" style={{
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              📊 Message Tracking
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
