'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// SMS Workflow Integration Types
interface SMSWorkflowStep {
  id: string
  step: string
  trigger: string
  recipients: string[]
  template: string
  status: 'pending' | 'sent' | 'delivered' | 'failed'
  timestamp?: string
  messageId?: string
  cost?: number
}

interface WorkflowInstance {
  id: string
  loadId: string
  status: 'active' | 'completed' | 'paused'
  currentStep: number
  totalSteps: number
  steps: SMSWorkflowStep[]
  startTime: string
  lastUpdate: string
}

export default function SMSWorkflowEcosystem() {
  const [activeWorkflows, setActiveWorkflows] = useState<WorkflowInstance[]>([])
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowInstance | null>(null)
  const [systemStatus, setSystemStatus] = useState({
    isOnline: true,
    twilioConfigured: true,
    messagesInQueue: 7,
    dailyMessagesSent: 156,
    successRate: 98.2,
    costToday: 15.75
  })

  // Mock workflow data showing SMS integration across the ecosystem
  useEffect(() => {
    const mockWorkflows: WorkflowInstance[] = [
      {
        id: 'WF-2025-001',
        loadId: 'LD-2025-789',
        status: 'active',
        currentStep: 3,
        totalSteps: 8,
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        lastUpdate: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        steps: [
          {
            id: 'step-1',
            step: 'Load Created',
            trigger: 'Dispatch creates new load',
            recipients: ['Operations Manager'],
            template: 'load-created',
            status: 'delivered',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            messageId: 'SMS-001',
            cost: 0.01
          },
          {
            id: 'step-2',
            step: 'Driver Assignment',
            trigger: 'Load assigned to driver',
            recipients: ['Driver Mike Rodriguez', 'Dispatcher Sarah'],
            template: 'driver-assignment',
            status: 'delivered',
            timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
            messageId: 'SMS-002',
            cost: 0.02
          },
          {
            id: 'step-3',
            step: 'Pickup Reminder',
            trigger: '2 hours before pickup',
            recipients: ['Driver Mike Rodriguez'],
            template: 'pickup-reminder',
            status: 'sent',
            timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            messageId: 'SMS-003',
            cost: 0.01
          },
          {
            id: 'step-4',
            step: 'Pickup Confirmation',
            trigger: 'Driver confirms pickup',
            recipients: ['Dispatcher Sarah', 'Customer'],
            template: 'pickup-confirmed',
            status: 'pending'
          },
          {
            id: 'step-5',
            step: 'In Transit Update',
            trigger: 'Every 2 hours during transit',
            recipients: ['Customer', 'Dispatch'],
            template: 'in-transit-update',
            status: 'pending'
          },
          {
            id: 'step-6',
            step: 'Delivery ETA',
            trigger: '1 hour before delivery',
            recipients: ['Customer', 'Receiver'],
            template: 'delivery-eta',
            status: 'pending'
          },
          {
            id: 'step-7',
            step: 'Delivery Confirmation',
            trigger: 'Driver confirms delivery',
            recipients: ['Customer', 'Billing', 'Dispatch'],
            template: 'delivery-confirmed',
            status: 'pending'
          },
          {
            id: 'step-8',
            step: 'Load Complete',
            trigger: 'POD uploaded',
            recipients: ['Operations Manager', 'Billing'],
            template: 'load-complete',
            status: 'pending'
          }
        ]
      },
      {
        id: 'WF-2025-002',
        loadId: 'LD-2025-456',
        status: 'completed',
        currentStep: 8,
        totalSteps: 8,
        startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        steps: [
          {
            id: 'step-1',
            step: 'Load Created',
            trigger: 'Dispatch creates new load',
            recipients: ['Operations Manager'],
            template: 'load-created',
            status: 'delivered',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            messageId: 'SMS-101',
            cost: 0.01
          },
          // ... other completed steps
          {
            id: 'step-8',
            step: 'Load Complete',
            trigger: 'POD uploaded',
            recipients: ['Operations Manager', 'Billing'],
            template: 'load-complete',
            status: 'delivered',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            messageId: 'SMS-108',
            cost: 0.02
          }
        ]
      }
    ]

    setActiveWorkflows(mockWorkflows)
    setSelectedWorkflow(mockWorkflows[0])
  }, [])

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return '✅'
      case 'sent': return '📤'
      case 'pending': return '⏳'
      case 'failed': return '❌'
      default: return '⭕'
    }
  }

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return '#10b981'
      case 'sent': return '#3b82f6'
      case 'pending': return '#f59e0b'
      case 'failed': return '#ef4444'
      default: return '#6b7280'
    }
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
              📱 SMS WorkFlow Ecosystem
            </h1>
            <div style={{ display: 'flex', gap: '15px' }}>
              <Link href="/notes" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  📝 Notes Hub
                </button>
              </Link>
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

          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0,
            textAlign: 'center'
          }}>
            Automated SMS notifications integrated throughout the entire FleetFlow workflow
          </p>
        </div>

        {/* System Status */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '25px',
          marginBottom: '25px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h2 style={{
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            🔧 SMS System Status
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {[
              { 
                label: 'System Status', 
                value: systemStatus.isOnline ? 'Online' : 'Offline', 
                color: systemStatus.isOnline ? '#10b981' : '#ef4444', 
                icon: systemStatus.isOnline ? '🟢' : '🔴' 
              },
              { 
                label: 'Twilio Config', 
                value: systemStatus.twilioConfigured ? 'Active' : 'Inactive', 
                color: systemStatus.twilioConfigured ? '#10b981' : '#f59e0b', 
                icon: systemStatus.twilioConfigured ? '✅' : '⚠️' 
              },
              { 
                label: 'Queue', 
                value: systemStatus.messagesInQueue, 
                color: '#3b82f6', 
                icon: '📬' 
              },
              { 
                label: 'Daily Sent', 
                value: systemStatus.dailyMessagesSent, 
                color: '#8b5cf6', 
                icon: '📤' 
              },
              { 
                label: 'Success Rate', 
                value: `${systemStatus.successRate}%`, 
                color: '#10b981', 
                icon: '📊' 
              },
              { 
                label: 'Cost Today', 
                value: `$${systemStatus.costToday}`, 
                color: '#f59e0b', 
                icon: '💰' 
              }
            ].map((stat, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{stat.icon}</div>
                <div style={{
                  fontSize: '1.5rem',
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

        {/* Active Workflows */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: '25px'
        }}>
          {/* Workflow List */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h3 style={{
                color: 'white',
                fontSize: '1.2rem',
                fontWeight: '600',
                margin: 0
              }}>
                🔄 Active Workflows
              </h3>
            </div>
            
            <div style={{ padding: '10px' }}>
              {activeWorkflows.map((workflow) => (
                <div
                  key={workflow.id}
                  style={{
                    background: selectedWorkflow?.id === workflow.id ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '15px',
                    marginBottom: '10px',
                    cursor: 'pointer',
                    border: selectedWorkflow?.id === workflow.id ? '2px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                  onClick={() => setSelectedWorkflow(workflow)}
                >
                  <div style={{ color: 'white', fontWeight: '600', marginBottom: '5px' }}>
                    {workflow.loadId}
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.85rem', marginBottom: '8px' }}>
                    Step {workflow.currentStep} of {workflow.totalSteps}
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      background: workflow.status === 'active' ? '#10b981' : workflow.status === 'completed' ? '#3b82f6' : '#f59e0b',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      {workflow.status}
                    </span>
                    <div style={{
                      width: '40px',
                      height: '4px',
                      background: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${(workflow.currentStep / workflow.totalSteps) * 100}%`,
                        height: '100%',
                        background: '#10b981',
                        borderRadius: '2px'
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workflow Details */}
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
              <h3 style={{
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: '600',
                margin: 0
              }}>
                📋 SMS Workflow Steps - {selectedWorkflow?.loadId}
              </h3>
            </div>

            <div style={{
              padding: '20px',
              maxHeight: '600px',
              overflowY: 'auto'
            }}>
              {selectedWorkflow?.steps.map((step, index) => (
                <div
                  key={step.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '15px',
                    border: selectedWorkflow.currentStep === index + 1 ? '2px solid #3b82f6' : '1px solid rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '10px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '5px'
                      }}>
                        <span style={{ fontSize: '1.5rem' }}>{getStepStatusIcon(step.status)}</span>
                        <h4 style={{
                          color: '#1e293b',
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          margin: 0
                        }}>
                          {index + 1}. {step.step}
                        </h4>
                      </div>
                      <p style={{
                        color: '#475569',
                        fontSize: '0.9rem',
                        margin: '0 0 8px 0'
                      }}>
                        <strong>Trigger:</strong> {step.trigger}
                      </p>
                      <p style={{
                        color: '#475569',
                        fontSize: '0.9rem',
                        margin: '0 0 8px 0'
                      }}>
                        <strong>Recipients:</strong> {step.recipients.join(', ')}
                      </p>
                      <p style={{
                        color: '#475569',
                        fontSize: '0.9rem',
                        margin: '0 0 8px 0'
                      }}>
                        <strong>Template:</strong> {step.template}
                      </p>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        background: getStepStatusColor(step.status),
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        {step.status}
                      </span>
                      {step.timestamp && (
                        <div style={{
                          color: '#6b7280',
                          fontSize: '0.75rem',
                          marginTop: '5px'
                        }}>
                          {new Date(step.timestamp).toLocaleString()}
                        </div>
                      )}
                      {step.messageId && (
                        <div style={{
                          color: '#6b7280',
                          fontSize: '0.75rem',
                          marginTop: '2px'
                        }}>
                          ID: {step.messageId}
                        </div>
                      )}
                      {step.cost && (
                        <div style={{
                          color: '#059669',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          marginTop: '2px'
                        }}>
                          ${step.cost.toFixed(3)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress indicator for current step */}
                  {selectedWorkflow.currentStep === index + 1 && (
                    <div style={{
                      background: '#dbeafe',
                      padding: '10px',
                      borderRadius: '8px',
                      marginTop: '10px'
                    }}>
                      <div style={{ color: '#1e40af', fontSize: '0.85rem', fontWeight: '600' }}>
                        🔄 Current Step - {step.status === 'pending' ? 'Waiting for trigger' : 'Processing...'}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SMS Templates */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '25px',
          marginTop: '25px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h2 style={{
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            💬 SMS Template Examples
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '20px'
          }}>
            {[
              {
                title: 'Driver Assignment',
                template: `🚛 NEW LOAD ASSIGNED
📍 From: Dallas, TX
📍 To: Houston, TX  
💰 Rate: $450
📅 Pickup: Today 2:00 PM
🚚 Equipment: Dry Van

Load ID: LD-2025-789
Reply ACCEPT to confirm!`,
                color: '#3b82f6'
              },
              {
                title: 'Pickup Reminder',
                template: `⏰ PICKUP REMINDER
Load: LD-2025-789
📍 Pickup: Dallas, TX
📅 Today - 2:00 PM
🚚 Equipment: Dry Van

Safe travels! 🛣️`,
                color: '#f59e0b'
              },
              {
                title: 'Delivery ETA',
                template: `🎯 DELIVERY UPDATE
Load: LD-2025-789
📍 Delivery: Houston, TX
📅 ETA: 6:30 PM
🚛 Driver: Mike Rodriguez

Customer notified. 📞`,
                color: '#10b981'
              },
              {
                title: 'Emergency Alert',
                template: `🚨 EMERGENCY ALERT
Driver: Mike Rodriguez
Load: LD-2025-789
Issue: Vehicle breakdown
Location: I-45 Mile 78

Roadside assistance dispatched.
ETA: 45 minutes`,
                color: '#ef4444'
              }
            ].map((template, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  <div style={{
                    width: '4px',
                    height: '30px',
                    background: template.color,
                    borderRadius: '2px',
                    marginRight: '12px'
                  }} />
                  <h3 style={{
                    color: '#1e293b',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    margin: 0
                  }}>
                    {template.title}
                  </h3>
                </div>
                <div style={{
                  background: '#f8fafc',
                  padding: '15px',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  lineHeight: '1.4',
                  color: '#374151',
                  whiteSpace: 'pre-line'
                }}>
                  {template.template}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Points */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '25px',
          marginTop: '25px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h2 style={{
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            🔗 SMS Integration Points
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px'
          }}>
            {[
              { module: 'Dispatch Central', integrations: ['Load creation', 'Driver assignment', 'Status updates'], icon: '🚛', color: '#3b82f6' },
              { module: 'Driver Portal', integrations: ['Load confirmations', 'Status updates', 'Emergency alerts'], icon: '👨‍💼', color: '#10b981' },
              { module: 'Route Optimizer', integrations: ['Route confirmations', 'ETA updates', 'Delay notifications'], icon: '🗺️', color: '#8b5cf6' },
              { module: 'Live Tracking', integrations: ['Location updates', 'Geofence alerts', 'Arrival notifications'], icon: '📍', color: '#f59e0b' },
              { module: 'Compliance Monitor', integrations: ['DOT alerts', 'Insurance expiry', 'Safety violations'], icon: '✅', color: '#ef4444' },
              { module: 'Billing System', integrations: ['Invoice notifications', 'Payment confirmations', 'Rate updates'], icon: '💰', color: '#059669' }
            ].map((integration, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  <span style={{ fontSize: '2rem', marginRight: '10px' }}>{integration.icon}</span>
                  <h3 style={{
                    color: integration.color,
                    fontSize: '1rem',
                    fontWeight: '600',
                    margin: 0
                  }}>
                    {integration.module}
                  </h3>
                </div>
                <ul style={{
                  color: '#475569',
                  fontSize: '0.85rem',
                  paddingLeft: '20px',
                  margin: 0
                }}>
                  {integration.integrations.map((item, i) => (
                    <li key={i} style={{ marginBottom: '5px' }}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
