'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface ComplianceMetric {
  label: string;
  value: string;
  status: 'compliant' | 'warning' | 'critical';
  icon: string;
  description: string;
}

interface ComplianceAlert {
  id: string;
  type: 'expiring' | 'expired' | 'violation' | 'warning';
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}

export default function CompliancePage() {
  const [selectedCategory, setSelectedCategory] = useState<'overview' | 'vehicles' | 'drivers' | 'operations'>('overview');

  // Mock compliance data
  const complianceMetrics: ComplianceMetric[] = [
    {
      label: 'Overall Compliance Score',
      value: '94%',
      status: 'compliant',
      icon: '✅',
      description: 'Fleet-wide compliance rating'
    },
    {
      label: 'Vehicle Inspections',
      value: '87%',
      status: 'compliant',
      icon: '🚛',
      description: 'Vehicles with current inspections'
    },
    {
      label: 'Driver Certifications',
      value: '92%',
      status: 'compliant',
      icon: '👤',
      description: 'Drivers with valid certifications'
    },
    {
      label: 'HOS Compliance',
      value: '96%',
      status: 'compliant',
      icon: '⏰',
      description: 'Hours of Service compliance rate'
    },
    {
      label: 'Drug & Alcohol Testing',
      value: '100%',
      status: 'compliant',
      icon: '🧪',
      description: 'Testing program compliance'
    },
    {
      label: 'Insurance Coverage',
      value: '3 days',
      status: 'warning',
      icon: '📋',
      description: 'Days until policy renewal'
    }
  ];

  const complianceAlerts: ComplianceAlert[] = [
    {
      id: '1',
      type: 'expiring',
      title: 'CDL License Expiring',
      description: 'John Smith - CDL expires in 15 days',
      dueDate: '2025-07-20',
      priority: 'high'
    },
    {
      id: '2',
      type: 'expiring',
      title: 'Vehicle Inspection Due',
      description: 'TRK-101 - Annual inspection due in 5 days',
      dueDate: '2025-07-10',
      priority: 'high'
    },
    {
      id: '3',
      type: 'warning',
      title: 'HOS Violation Risk',
      description: 'Sarah Johnson - Approaching weekly limit',
      dueDate: '2025-07-07',
      priority: 'medium'
    },
    {
      id: '4',
      type: 'expiring',
      title: 'Insurance Renewal',
      description: 'General liability policy renewal required',
      dueDate: '2025-07-08',
      priority: 'high'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'expiring': return '⏰';
      case 'expired': return '🚨';
      case 'violation': return '⚠️';
      case 'warning': return '⚠️';
      default: return '📋';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      paddingTop: '80px'
    }}>
      {/* Back Button */}
      <div style={{ padding: '24px' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <button style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '16px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <span style={{ marginRight: '8px' }}>←</span>
            Back to Dashboard
          </button>
        </Link>
      </div>

      {/* Main Container */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px 32px'
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px'
              }}>
                <span style={{ fontSize: '32px' }}>✅</span>
              </div>
              <div>
                <h1 style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 8px 0',
                  textShadow: '0 4px 8px rgba(0,0,0,0.3)'
                }}>
                  Compliance Dashboard
                </h1>
                <p style={{
                  fontSize: '18px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: '0 0 8px 0'
                }}>
                  DOT, FMCSA, and safety compliance monitoring
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      background: '#10b981',
                      borderRadius: '50%',
                      animation: 'pulse 2s infinite'
                    }}></div>
                    <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
                      Real-time Monitoring Active
                    </span>
                  </div>
                  <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Last updated: {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['overview', 'vehicles', 'drivers', 'operations'] as const).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    border: 'none',
                    cursor: 'pointer',
                    background: selectedCategory === category 
                      ? 'rgba(255, 255, 255, 0.25)' 
                      : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Compliance Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {complianceMetrics.map((metric, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>{metric.icon}</span>
                  <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: 0 }}>
                    {metric.label}
                  </h3>
                </div>
                <div style={{
                  width: '12px',
                  height: '12px',
                  background: getStatusColor(metric.status),
                  borderRadius: '50%'
                }}></div>
              </div>
              <div style={{ color: getStatusColor(metric.status), fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
                {metric.value}
              </div>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', margin: 0 }}>
                {metric.description}
              </p>
            </div>
          ))}
        </div>

        {/* Compliance Alerts */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ color: 'white', fontSize: '24px', fontWeight: '600', margin: 0 }}>
              Compliance Alerts & Actions Required
            </h3>
            <Link href="/notes" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(251, 191, 36, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #fbbf24, #f59e0b)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                🔔 Notification Hub
              </button>
            </Link>
          </div>
          <div style={{ display: 'grid', gap: '16px' }}>
            {complianceAlerts.map((alert) => (
              <div key={alert.id} style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                border: `1px solid ${getPriorityColor(alert.priority)}30`,
                borderLeft: `4px solid ${getPriorityColor(alert.priority)}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '20px' }}>{getAlertIcon(alert.type)}</span>
                    <div>
                      <h4 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' }}>
                        {alert.title}
                      </h4>
                      <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', margin: 0 }}>
                        {alert.description}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      background: getPriorityColor(alert.priority),
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginBottom: '8px'
                    }}>
                      {alert.priority.toUpperCase()}
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                      Due: {new Date(alert.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px'
        }}>
          <Link href="/notes" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(251, 191, 36, 0.3)',
              boxShadow: '0 8px 32px rgba(251, 191, 36, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(251, 191, 36, 0.4)';
              e.currentTarget.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(251, 191, 36, 0.2)';
              e.currentTarget.style.background = 'linear-gradient(135deg, #fbbf24, #f59e0b)';
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔔</div>
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                  Notification Hub
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', margin: 0, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                  Central communication and alerts
                </p>
              </div>
            </div>
          </Link>

          <Link href="/dot-compliance" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏛️</div>
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                  DOT Compliance
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', margin: 0 }}>
                  FMCSA compliance monitoring and reporting
                </p>
              </div>
            </div>
          </Link>

          <Link href="/drivers" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                  Driver Management
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', margin: 0 }}>
                  CDL tracking and HOS compliance
                </p>
              </div>
            </div>
          </Link>

          <Link href="/vehicles" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚛</div>
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                  Vehicle Inspections
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', margin: 0 }}>
                  Maintenance schedules and inspections
                </p>
              </div>
            </div>
          </Link>

          <Link href="/maintenance" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔧</div>
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                  Maintenance Tracking
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', margin: 0 }}>
                  Preventive maintenance and repairs
                </p>
              </div>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}
