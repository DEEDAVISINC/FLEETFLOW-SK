'use client';

import { useState } from 'react';
import ForceMajeurePlanningWidget from '../components/ForceMajeurePlanningWidget';

export default function EmergencyPage() {
  const [selectedTab, setSelectedTab] = useState('overview');

  const criticalMetrics = [
    {
      title: 'System Status',
      value: 'OPERATIONAL',
      status: 'success',
      icon: '🟢',
      change: '+99.9%',
      description: 'All systems operational',
    },
    {
      title: 'Response Time',
      value: '2.3s',
      status: 'success',
      icon: '⚡',
      change: '-15%',
      description: 'Average emergency response',
    },
    {
      title: 'Active Incidents',
      value: '0',
      status: 'success',
      icon: '🛡️',
      change: '0%',
      description: 'No active incidents',
    },
    {
      title: 'Fleet Coverage',
      value: '100%',
      status: 'success',
      icon: '🌐',
      change: '+0.2%',
      description: 'Global fleet monitoring',
    },
  ];

  const emergencyProtocols = [
    {
      category: 'Critical Infrastructure',
      protocols: [
        {
          name: 'System Failure Recovery',
          level: 'CRITICAL',
          status: 'ACTIVE',
        },
        { name: 'Data Center Failover', level: 'HIGH', status: 'STANDBY' },
        { name: 'Network Redundancy', level: 'HIGH', status: 'ACTIVE' },
      ],
    },
    {
      category: 'Fleet Operations',
      protocols: [
        {
          name: 'Vehicle Emergency Response',
          level: 'CRITICAL',
          status: 'ACTIVE',
        },
        { name: 'Driver Safety Protocols', level: 'HIGH', status: 'ACTIVE' },
        {
          name: 'Route Contingency Planning',
          level: 'MEDIUM',
          status: 'ACTIVE',
        },
      ],
    },
    {
      category: 'Business Continuity',
      protocols: [
        { name: 'Disaster Recovery', level: 'CRITICAL', status: 'STANDBY' },
        { name: 'Communication Backup', level: 'HIGH', status: 'ACTIVE' },
        { name: 'Financial Safeguards', level: 'HIGH', status: 'ACTIVE' },
      ],
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Command Center', icon: '🎯' },
    { id: 'protocols', label: 'Emergency Protocols', icon: '📋' },
    { id: 'planning', label: 'Force Majeure Planning', icon: '🚨' },
    { id: 'analytics', label: 'Risk Analytics', icon: '📊' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        padding: '0',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
      }}
    >
      {/* Executive Header */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
          padding: '32px 0',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 32px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  color: '#f8fafc',
                  margin: '0 0 8px 0',
                  letterSpacing: '-0.025em',
                }}
              >
                🚨 Emergency Management Center
              </h1>
              <p
                style={{
                  fontSize: '16px',
                  color: '#94a3b8',
                  margin: 0,
                  fontWeight: '500',
                }}
              >
                Enterprise-grade crisis management and business continuity
                operations
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  padding: '8px 16px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '8px',
                  color: '#22c55e',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                ALL SYSTEMS OPERATIONAL
              </div>
              <div
                style={{
                  color: '#64748b',
                  fontSize: '14px',
                }}
              >
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Executive KPI Dashboard */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px',
            }}
          >
            {criticalMetrics.map((metric, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(30, 41, 59, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '12px',
                  padding: '24px',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '24px',
                    }}
                  >
                    {metric.icon}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color:
                        metric.status === 'success' ? '#22c55e' : '#ef4444',
                      fontWeight: '600',
                      background:
                        metric.status === 'success'
                          ? 'rgba(34, 197, 94, 0.1)'
                          : 'rgba(239, 68, 68, 0.1)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    {metric.change}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#f8fafc',
                    marginBottom: '4px',
                  }}
                >
                  {metric.value}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: '#94a3b8',
                    fontWeight: '500',
                    marginBottom: '8px',
                  }}
                >
                  {metric.title}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#64748b',
                  }}
                >
                  {metric.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '40px 32px',
        }}
      >
        {/* Executive Tab Navigation */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '16px',
            padding: '8px',
            marginBottom: '32px',
            display: 'flex',
            gap: '4px',
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              style={{
                flex: 1,
                padding: '16px 24px',
                borderRadius: '12px',
                border: 'none',
                background:
                  selectedTab === tab.id
                    ? 'rgba(248, 250, 252, 0.95)'
                    : 'transparent',
                color: selectedTab === tab.id ? '#0f172a' : '#94a3b8',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '18px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.4)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '16px',
            padding: '40px',
            minHeight: '600px',
          }}
        >
          {selectedTab === 'overview' && (
            <div>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#f8fafc',
                  marginBottom: '32px',
                }}
              >
                Emergency Command Center
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr',
                  gap: '32px',
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#f1f5f9',
                      marginBottom: '16px',
                    }}
                  >
                    Global Fleet Status
                  </h3>
                  <div
                    style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '12px',
                      padding: '24px',
                      marginBottom: '24px',
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '16px',
                        textAlign: 'center',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: '24px',
                            color: '#22c55e',
                            fontWeight: '700',
                          }}
                        >
                          2,847
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          Active Vehicles
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: '24px',
                            color: '#3b82f6',
                            fontWeight: '700',
                          }}
                        >
                          1,203
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          Active Drivers
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: '24px',
                            color: '#8b5cf6',
                            fontWeight: '700',
                          }}
                        >
                          847
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          Active Routes
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#f1f5f9',
                      marginBottom: '16px',
                    }}
                  >
                    Emergency Contacts
                  </h3>
                  <div
                    style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '12px',
                      padding: '20px',
                    }}
                  >
                    {[
                      {
                        role: 'Emergency Services',
                        contact: '911',
                        available: true,
                      },
                      {
                        role: 'Fleet Command',
                        contact: '24/7',
                        available: true,
                      },
                      {
                        role: 'Crisis Management',
                        contact: 'On-Call',
                        available: true,
                      },
                    ].map((contact, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px 0',
                          borderBottom:
                            index < 2
                              ? '1px solid rgba(148, 163, 184, 0.1)'
                              : 'none',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              color: '#f1f5f9',
                              fontSize: '14px',
                              fontWeight: '500',
                            }}
                          >
                            {contact.role}
                          </div>
                          <div style={{ color: '#64748b', fontSize: '12px' }}>
                            {contact.contact}
                          </div>
                        </div>
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: contact.available
                              ? '#22c55e'
                              : '#64748b',
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'protocols' && (
            <div>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#f8fafc',
                  marginBottom: '32px',
                }}
              >
                Emergency Response Protocols
              </h2>

              <div
                style={{
                  display: 'grid',
                  gap: '24px',
                }}
              >
                {emergencyProtocols.map((category, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '12px',
                      padding: '24px',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#f1f5f9',
                        marginBottom: '16px',
                      }}
                    >
                      {category.category}
                    </h3>
                    <div
                      style={{
                        display: 'grid',
                        gap: '12px',
                      }}
                    >
                      {category.protocols.map((protocol, pIndex) => (
                        <div
                          key={pIndex}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '16px',
                            background: 'rgba(30, 41, 59, 0.4)',
                            borderRadius: '8px',
                            border: '1px solid rgba(148, 163, 184, 0.1)',
                          }}
                        >
                          <div>
                            <div
                              style={{
                                color: '#f1f5f9',
                                fontSize: '14px',
                                fontWeight: '500',
                                marginBottom: '4px',
                              }}
                            >
                              {protocol.name}
                            </div>
                            <div
                              style={{
                                color:
                                  protocol.level === 'CRITICAL'
                                    ? '#ef4444'
                                    : protocol.level === 'HIGH'
                                      ? '#f59e0b'
                                      : '#22c55e',
                                fontSize: '12px',
                                fontWeight: '600',
                              }}
                            >
                              {protocol.level} PRIORITY
                            </div>
                          </div>
                          <div
                            style={{
                              padding: '4px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600',
                              background:
                                protocol.status === 'ACTIVE'
                                  ? 'rgba(34, 197, 94, 0.1)'
                                  : 'rgba(100, 116, 139, 0.1)',
                              color:
                                protocol.status === 'ACTIVE'
                                  ? '#22c55e'
                                  : '#64748b',
                            }}
                          >
                            {protocol.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'planning' && (
            <div>
              <ForceMajeurePlanningWidget />
            </div>
          )}

          {selectedTab === 'analytics' && (
            <div>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#f8fafc',
                  marginBottom: '32px',
                }}
              >
                Risk Analytics & Intelligence
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '24px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '12px',
                    padding: '24px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#f1f5f9',
                      marginBottom: '16px',
                    }}
                  >
                    Risk Assessment Matrix
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '12px',
                    }}
                  >
                    {[
                      {
                        risk: 'Weather Events',
                        level: 'LOW',
                        probability: '15%',
                      },
                      {
                        risk: 'System Failures',
                        level: 'MEDIUM',
                        probability: '8%',
                      },
                      {
                        risk: 'Supply Chain',
                        level: 'LOW',
                        probability: '12%',
                      },
                      {
                        risk: 'Cyber Security',
                        level: 'MEDIUM',
                        probability: '5%',
                      },
                    ].map((risk, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '16px',
                          background: 'rgba(30, 41, 59, 0.4)',
                          borderRadius: '8px',
                          border: '1px solid rgba(148, 163, 184, 0.1)',
                        }}
                      >
                        <div
                          style={{
                            color: '#f1f5f9',
                            fontSize: '14px',
                            fontWeight: '500',
                            marginBottom: '8px',
                          }}
                        >
                          {risk.risk}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <span
                            style={{
                              color:
                                risk.level === 'LOW' ? '#22c55e' : '#f59e0b',
                              fontSize: '12px',
                              fontWeight: '600',
                            }}
                          >
                            {risk.level}
                          </span>
                          <span
                            style={{
                              color: '#64748b',
                              fontSize: '12px',
                            }}
                          >
                            {risk.probability}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '12px',
                    padding: '24px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#f1f5f9',
                      marginBottom: '16px',
                    }}
                  >
                    Predictive Intelligence
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gap: '16px',
                    }}
                  >
                    {[
                      {
                        metric: 'AI Threat Detection',
                        value: '99.7%',
                        trend: 'up',
                      },
                      {
                        metric: 'Predictive Accuracy',
                        value: '94.2%',
                        trend: 'up',
                      },
                      {
                        metric: 'Response Efficiency',
                        value: '97.8%',
                        trend: 'stable',
                      },
                    ].map((metric, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px 0',
                          borderBottom:
                            index < 2
                              ? '1px solid rgba(148, 163, 184, 0.1)'
                              : 'none',
                        }}
                      >
                        <div
                          style={{
                            color: '#f1f5f9',
                            fontSize: '14px',
                            fontWeight: '500',
                          }}
                        >
                          {metric.metric}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <span
                            style={{
                              color: '#22c55e',
                              fontSize: '14px',
                              fontWeight: '600',
                            }}
                          >
                            {metric.value}
                          </span>
                          <span
                            style={{
                              color:
                                metric.trend === 'up' ? '#22c55e' : '#64748b',
                              fontSize: '12px',
                            }}
                          >
                            {metric.trend === 'up' ? '↗' : '→'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
