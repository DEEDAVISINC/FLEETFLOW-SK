'use client'

import { useState } from 'react'
import { OptimizedRoute } from '../services/route-optimization'

interface ShareOption {
  id: string
  name: string
  description: string
  icon: string
  recipients: string[]
  includeDetails: boolean
}

interface Stakeholder {
  id: string
  name: string
  email: string
  phone?: string
  role: 'customer' | 'driver' | 'dispatcher' | 'carrier' | 'broker'
  company?: string
}

interface RouteSharingProps {
  route: OptimizedRoute
  onShare: (shareData: {
    route: OptimizedRoute
    recipients: Stakeholder[]
    shareOptions: ShareOption[]
    message?: string
    includeTracking?: boolean
  }) => void
  onClose: () => void
}

export default function RouteSharing({ route, onShare, onClose }: RouteSharingProps) {
  const [selectedStakeholders, setSelectedStakeholders] = useState<Stakeholder[]>([])
  const [selectedShareOptions, setSelectedShareOptions] = useState<ShareOption[]>([])
  const [customMessage, setCustomMessage] = useState('')
  const [includeTracking, setIncludeTracking] = useState(true)
  const [activeTab, setActiveTab] = useState<'stakeholders' | 'options' | 'preview'>('stakeholders')

  // Sample stakeholders - in production, these would come from the database
  const availableStakeholders: Stakeholder[] = [
    {
      id: 'customer_1',
      name: 'John Smith',
      email: 'john@acmecorp.com',
      phone: '(555) 123-4567',
      role: 'customer',
      company: 'ACME Corporation'
    },
    {
      id: 'driver_1',
      name: 'Mike Johnson',
      email: 'mike.johnson@fleetflow.com',
      phone: '(555) 987-6543',
      role: 'driver',
      company: 'FleetFlow'
    },
    {
      id: 'dispatcher_1',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@fleetflow.com',
      phone: '(555) 456-7890',
      role: 'dispatcher',
      company: 'FleetFlow'
    },
    {
      id: 'carrier_1',
      name: 'Express Logistics',
      email: 'dispatch@expresslogistics.com',
      phone: '(555) 321-0987',
      role: 'carrier',
      company: 'Express Logistics Inc.'
    },
    {
      id: 'broker_1',
      name: 'Global Freight',
      email: 'operations@globalfreight.com',
      phone: '(555) 654-3210',
      role: 'broker',
      company: 'Global Freight Solutions'
    }
  ]

  const shareOptions: ShareOption[] = [
    {
      id: 'route_summary',
      name: 'Route Summary',
      description: 'Basic route information with pickup/delivery locations and times',
      icon: '📋',
      recipients: ['customer', 'driver', 'dispatcher', 'carrier', 'broker'],
      includeDetails: false
    },
    {
      id: 'detailed_route',
      name: 'Detailed Route Plan',
      description: 'Complete route with turn-by-turn directions and optimization details',
      icon: '🗺️',
      recipients: ['driver', 'dispatcher'],
      includeDetails: true
    },
    {
      id: 'tracking_link',
      name: 'Live Tracking Link',
      description: 'Real-time tracking URL for shipment monitoring',
      icon: '📍',
      recipients: ['customer', 'broker'],
      includeDetails: false
    },
    {
      id: 'eta_updates',
      name: 'ETA Updates',
      description: 'Automated notifications for delivery time changes',
      icon: '⏰',
      recipients: ['customer', 'dispatcher', 'broker'],
      includeDetails: false
    },
    {
      id: 'performance_metrics',
      name: 'Performance Metrics',
      description: 'Efficiency scores, fuel savings, and cost optimization data',
      icon: '📊',
      recipients: ['dispatcher', 'carrier', 'broker'],
      includeDetails: true
    },
    {
      id: 'document_package',
      name: 'Document Package',
      description: 'BOL, rate confirmation, and other shipping documents',
      icon: '📄',
      recipients: ['customer', 'driver', 'carrier', 'broker'],
      includeDetails: true
    }
  ]

  const handleStakeholderToggle = (stakeholder: Stakeholder) => {
    setSelectedStakeholders(prev => {
      const isSelected = prev.some(s => s.id === stakeholder.id)
      if (isSelected) {
        return prev.filter(s => s.id !== stakeholder.id)
      } else {
        return [...prev, stakeholder]
      }
    })
  }

  const handleShareOptionToggle = (option: ShareOption) => {
    setSelectedShareOptions(prev => {
      const isSelected = prev.some(o => o.id === option.id)
      if (isSelected) {
        return prev.filter(o => o.id !== option.id)
      } else {
        return [...prev, option]
      }
    })
  }

  const handleShare = () => {
    onShare({
      route,
      recipients: selectedStakeholders,
      shareOptions: selectedShareOptions,
      message: customMessage,
      includeTracking
    })
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'customer': return '#3b82f6'
      case 'driver': return '#10b981'
      case 'dispatcher': return '#8b5cf6'
      case 'carrier': return '#f59e0b'
      case 'broker': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'customer': return '🏢'
      case 'driver': return '🚛'
      case 'dispatcher': return '📡'
      case 'carrier': return '🚚'
      case 'broker': return '🤝'
      default: return '👤'
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: `
          linear-gradient(135deg, #022c22 0%, #032e2a 25%, #044e46 50%, #042f2e 75%, #0a1612 100%),
          radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.06) 0%, transparent 50%)
        `,
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              padding: '12px',
              background: 'rgba(59, 130, 246, 0.2)',
              borderRadius: '12px'
            }}>
              <span style={{ fontSize: '24px' }}>🔗</span>
            </div>
            <div>
              <h2 style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: 'white',
                margin: '0 0 8px 0'
              }}>
                Share Route
              </h2>
              <p style={{
                color: 'rgba(255, 255, 255, 0.7)',
                margin: 0,
                fontSize: '16px'
              }}>
                Route {route.id} • {route.stops.length} stops • {route.totalDistance.toFixed(1)} miles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              padding: '12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '20px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
            }}
          >
            ×
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '32px',
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '8px',
          borderRadius: '12px'
        }}>
          {[
            { id: 'stakeholders', label: '👥 Recipients', count: selectedStakeholders.length },
            { id: 'options', label: '📋 Share Options', count: selectedShareOptions.length },
            { id: 'preview', label: '👁️ Preview' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '12px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                background: activeTab === tab.id 
                  ? 'rgba(255, 255, 255, 0.9)' 
                  : 'transparent',
                color: activeTab === tab.id ? '#1f2937' : 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span style={{
                  background: activeTab === tab.id ? '#3b82f6' : 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ minHeight: '400px' }}>
          {/* Stakeholders Tab */}
          {activeTab === 'stakeholders' && (
            <div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'white',
                margin: '0 0 24px 0'
              }}>
                Select Recipients
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '16px'
              }}>
                {availableStakeholders.map((stakeholder) => {
                  const isSelected = selectedStakeholders.some(s => s.id === stakeholder.id)
                  return (
                    <div
                      key={stakeholder.id}
                      onClick={() => handleStakeholderToggle(stakeholder)}
                      style={{
                        padding: '20px',
                        background: isSelected 
                          ? 'rgba(59, 130, 246, 0.2)' 
                          : 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: isSelected 
                          ? '2px solid #3b82f6' 
                          : '1px solid rgba(255, 255, 255, 0.2)',
                        position: 'relative'
                      }}
                      onMouseOver={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                    >
                      {isSelected && (
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: '#3b82f6',
                          color: 'white',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          ✓
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{
                          padding: '8px',
                          background: `${getRoleColor(stakeholder.role)}20`,
                          borderRadius: '8px',
                          fontSize: '20px'
                        }}>
                          {getRoleIcon(stakeholder.role)}
                        </div>
                        <div>
                          <h4 style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: 'white',
                            margin: '0 0 4px 0'
                          }}>
                            {stakeholder.name}
                          </h4>
                          <p style={{
                            fontSize: '12px',
                            color: getRoleColor(stakeholder.role),
                            margin: 0,
                            fontWeight: '600',
                            textTransform: 'uppercase'
                          }}>
                            {stakeholder.role}
                          </p>
                        </div>
                      </div>
                      <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                        <p style={{ margin: '0 0 4px 0' }}>{stakeholder.email}</p>
                        {stakeholder.phone && (
                          <p style={{ margin: '0 0 4px 0' }}>{stakeholder.phone}</p>
                        )}
                        {stakeholder.company && (
                          <p style={{ margin: 0, fontWeight: '600' }}>{stakeholder.company}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Share Options Tab */}
          {activeTab === 'options' && (
            <div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'white',
                margin: '0 0 24px 0'
              }}>
                Choose What to Share
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '16px'
              }}>
                {shareOptions.map((option) => {
                  const isSelected = selectedShareOptions.some(o => o.id === option.id)
                  const hasCompatibleRecipients = selectedStakeholders.some(s => 
                    option.recipients.includes(s.role)
                  )
                  
                  return (
                    <div
                      key={option.id}
                      onClick={() => handleShareOptionToggle(option)}
                      style={{
                        padding: '20px',
                        background: isSelected 
                          ? 'rgba(16, 185, 129, 0.2)' 
                          : 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: isSelected 
                          ? '2px solid #10b981' 
                          : '1px solid rgba(255, 255, 255, 0.2)',
                        position: 'relative',
                        opacity: hasCompatibleRecipients ? 1 : 0.6
                      }}
                      onMouseOver={(e) => {
                        if (!isSelected && hasCompatibleRecipients) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                    >
                      {isSelected && (
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: '#10b981',
                          color: 'white',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          ✓
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{
                          padding: '8px',
                          background: 'rgba(16, 185, 129, 0.2)',
                          borderRadius: '8px',
                          fontSize: '20px'
                        }}>
                          {option.icon}
                        </div>
                        <div>
                          <h4 style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: 'white',
                            margin: '0 0 4px 0'
                          }}>
                            {option.name}
                          </h4>
                          <p style={{
                            fontSize: '12px',
                            color: option.includeDetails ? '#fbbf24' : '#10b981',
                            margin: 0,
                            fontWeight: '600',
                            textTransform: 'uppercase'
                          }}>
                            {option.includeDetails ? 'Detailed' : 'Summary'}
                          </p>
                        </div>
                      </div>
                      <p style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        margin: '0 0 12px 0',
                        lineHeight: '1.4'
                      }}>
                        {option.description}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {option.recipients.map((role) => (
                          <span
                            key={role}
                            style={{
                              background: getRoleColor(role) + '30',
                              color: getRoleColor(role),
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '11px',
                              fontWeight: '600',
                              textTransform: 'uppercase'
                            }}
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {/* Additional Options */}
              <div style={{
                marginTop: '32px',
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px'
              }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 16px 0'
                }}>
                  Additional Options
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <input
                    type="checkbox"
                    id="includeTracking"
                    checked={includeTracking}
                    onChange={(e) => setIncludeTracking(e.target.checked)}
                    style={{
                      width: '20px',
                      height: '20px',
                      accentColor: '#10b981'
                    }}
                  />
                  <label
                    htmlFor="includeTracking"
                    style={{
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Include live tracking capabilities
                  </label>
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    Custom Message (Optional)
                  </label>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Add a personal message to include with the shared route..."
                    style={{
                      width: '100%',
                      height: '80px',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Preview Tab */}
          {activeTab === 'preview' && (
            <div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'white',
                margin: '0 0 24px 0'
              }}>
                Share Preview
              </h3>
              
              {/* Route Summary */}
              <div style={{
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                marginBottom: '24px'
              }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 12px 0'
                }}>
                  Route Summary
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 4px 0', fontSize: '12px' }}>Route ID</p>
                    <p style={{ color: 'white', margin: 0, fontWeight: '600' }}>{route.id}</p>
                  </div>
                  <div>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 4px 0', fontSize: '12px' }}>Total Distance</p>
                    <p style={{ color: 'white', margin: 0, fontWeight: '600' }}>{route.totalDistance.toFixed(1)} miles</p>
                  </div>
                  <div>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 4px 0', fontSize: '12px' }}>Total Time</p>
                    <p style={{ color: 'white', margin: 0, fontWeight: '600' }}>{route.totalTime.toFixed(1)} hours</p>
                  </div>
                  <div>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 4px 0', fontSize: '12px' }}>Efficiency</p>
                    <p style={{ color: '#4ade80', margin: 0, fontWeight: '600' }}>{route.efficiency}%</p>
                  </div>
                </div>
              </div>

              {/* Recipients */}
              <div style={{
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                marginBottom: '24px'
              }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 12px 0'
                }}>
                  Recipients ({selectedStakeholders.length})
                </h4>
                {selectedStakeholders.length === 0 ? (
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0, fontStyle: 'italic' }}>
                    No recipients selected
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedStakeholders.map((stakeholder) => (
                      <div
                        key={stakeholder.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          background: getRoleColor(stakeholder.role) + '30',
                          borderRadius: '20px',
                          border: `1px solid ${getRoleColor(stakeholder.role)}60`
                        }}
                      >
                        <span style={{ fontSize: '14px' }}>{getRoleIcon(stakeholder.role)}</span>
                        <span style={{
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}>
                          {stakeholder.name}
                        </span>
                        <span style={{
                          color: getRoleColor(stakeholder.role),
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}>
                          {stakeholder.role}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Share Options */}
              <div style={{
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                marginBottom: '24px'
              }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 12px 0'
                }}>
                  Share Options ({selectedShareOptions.length})
                </h4>
                {selectedShareOptions.length === 0 ? (
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0, fontStyle: 'italic' }}>
                    No share options selected
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedShareOptions.map((option) => (
                      <div
                        key={option.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          background: 'rgba(16, 185, 129, 0.3)',
                          borderRadius: '20px',
                          border: '1px solid rgba(16, 185, 129, 0.6)'
                        }}
                      >
                        <span style={{ fontSize: '14px' }}>{option.icon}</span>
                        <span style={{
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}>
                          {option.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Message */}
              {customMessage && (
                <div style={{
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  marginBottom: '24px'
                }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: '0 0 12px 0'
                  }}>
                    Custom Message
                  </h4>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    margin: 0,
                    lineHeight: '1.5',
                    fontStyle: 'italic'
                  }}>
                    "{customMessage}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              }}
            >
              Cancel
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '14px'
            }}>
              {selectedStakeholders.length} recipients • {selectedShareOptions.length} options
            </div>
            <button
              onClick={handleShare}
              disabled={selectedStakeholders.length === 0 || selectedShareOptions.length === 0}
              style={{
                padding: '12px 32px',
                borderRadius: '8px',
                border: 'none',
                background: selectedStakeholders.length > 0 && selectedShareOptions.length > 0
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: selectedStakeholders.length > 0 && selectedShareOptions.length > 0 ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                opacity: selectedStakeholders.length > 0 && selectedShareOptions.length > 0 ? 1 : 0.6
              }}
              onMouseOver={(e) => {
                if (selectedStakeholders.length > 0 && selectedShareOptions.length > 0) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)'
                }
              }}
              onMouseOut={(e) => {
                if (selectedStakeholders.length > 0 && selectedShareOptions.length > 0) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }
              }}
            >
              Share Route
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 