'use client';

import React, { useEffect, useState } from 'react';

const QualityControlProcessesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [qualityMetrics, setQualityMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for quality control metrics
  useEffect(() => {
    const fetchQualityMetrics = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setQualityMetrics({
          overallScore: 94.2,
          customerSatisfaction: 96.8,
          serviceCompliance: 92.1,
          responseTime: 98.5,
          qualityTrends: {
            thisMonth: '+2.3%',
            lastQuarter: '+8.7%',
            yearOverYear: '+15.2%',
          },
          alerts: [
            {
              id: 1,
              type: 'warning',
              message: 'Email response time above threshold',
              severity: 'medium',
            },
            {
              id: 2,
              type: 'info',
              message: 'Monthly quality review scheduled',
              severity: 'low',
            },
            {
              id: 3,
              type: 'success',
              message: 'Customer satisfaction target exceeded',
              severity: 'low',
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching quality metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQualityMetrics();
  }, []);

  const tabs = [
    {
      id: 'dashboard',
      label: 'Quality Dashboard',
      icon: '📊',
      color: '#3b82f6',
    }, // Blue - OPERATIONS
    {
      id: 'service-monitoring',
      label: 'Service Monitoring',
      icon: '🔍',
      color: '#10b981',
    }, // Green - Success
    {
      id: 'compliance',
      label: 'Compliance Tracking',
      icon: '✅',
      color: '#dc2626',
    }, // Red - COMPLIANCE
    {
      id: 'performance',
      label: 'Performance Analytics',
      icon: '📈',
      color: '#8b5cf6',
    }, // Purple - ANALYTICS
    { id: 'alerts', label: 'Quality Alerts', icon: '🚨', color: '#f59e0b' }, // Orange - RESOURCES
    { id: 'reports', label: 'Quality Reports', icon: '📋', color: '#14b8a6' }, // Teal - FLEETFLOW
  ];

  const qualityKPIs = [
    {
      title: 'Overall Quality Score',
      value: qualityMetrics?.overallScore || 0,
      unit: '%',
      change: '+2.1%',
      trend: 'up',
      description: 'Composite quality rating across all services',
      color: '#065f46',
      background: 'rgba(16, 185, 129, 0.5)',
      border: 'rgba(16, 185, 129, 0.3)',
    },
    {
      title: 'Customer Satisfaction',
      value: qualityMetrics?.customerSatisfaction || 0,
      unit: '%',
      change: '+1.8%',
      trend: 'up',
      description: 'CSAT scores across all touchpoints',
      color: '#1e40af',
      background: 'rgba(59, 130, 246, 0.5)',
      border: 'rgba(59, 130, 246, 0.3)',
    },
    {
      title: 'Service Compliance',
      value: qualityMetrics?.serviceCompliance || 0,
      unit: '%',
      change: '+0.9%',
      trend: 'up',
      description: 'SLA and process compliance rate',
      color: '#581c87',
      background: 'rgba(139, 92, 246, 0.5)',
      border: 'rgba(139, 92, 246, 0.3)',
    },
    {
      title: 'Response Time Score',
      value: qualityMetrics?.responseTime || 0,
      unit: '%',
      change: '-0.3%',
      trend: 'down',
      description: 'Average response time performance',
      color: '#92400e',
      background: 'rgba(245, 158, 11, 0.5)',
      border: 'rgba(245, 158, 11, 0.3)',
    },
    {
      title: 'Quality Incidents',
      value: 7,
      unit: '',
      change: '-12%',
      trend: 'down',
      description: 'Active quality issues requiring attention',
      color: '#991b1b',
      background: 'rgba(239, 68, 68, 0.5)',
      border: 'rgba(239, 68, 68, 0.3)',
    },
    {
      title: 'Process Efficiency',
      value: 89.4,
      unit: '%',
      change: '+3.2%',
      trend: 'up',
      description: 'Operational process efficiency rating',
      color: '#155e75',
      background: 'rgba(6, 182, 212, 0.5)',
      border: 'rgba(6, 182, 212, 0.3)',
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <div style={{ fontSize: '18px', fontWeight: '600' }}>
            Loading Quality Control Systems...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '32px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '16px',
            }}
          >
            <div style={{ fontSize: '48px' }}>🔍</div>
            <div>
              <h1
                style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  color: 'white',
                  margin: 0,
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                Quality Control Processes
              </h1>
              <p
                style={{
                  fontSize: '18px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: 0,
                  fontWeight: '500',
                }}
              >
                Enterprise Service Monitoring & Quality Assurance
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginTop: '24px',
            }}
          >
            {qualityKPIs.map((kpi, index) => (
              <div
                key={index}
                style={{
                  background: kpi.background,
                  border: `1px solid ${kpi.border}`,
                  borderRadius: '16px',
                  padding: '20px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow =
                    '0 12px 24px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: kpi.color,
                    marginBottom: '8px',
                  }}
                >
                  {kpi.value}
                  {kpi.unit}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#f8fafc',
                    marginBottom: '4px',
                  }}
                >
                  {kpi.title}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: kpi.trend === 'up' ? '#065f46' : '#991b1b',
                    fontWeight: '600',
                  }}
                >
                  {kpi.change}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: '#e2e8f0',
                    marginTop: '4px',
                    opacity: 0.8,
                  }}
                >
                  {kpi.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '8px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background:
                  activeTab === tab.id
                    ? 'rgba(255, 255, 255, 0.4)'
                    : 'rgba(255, 255, 255, 0.1)',
                border: `2px solid ${tab.color}`,
                borderRadius: '12px',
                padding: '12px 20px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                backdropFilter: activeTab === tab.id ? 'blur(10px)' : 'none',
                boxShadow:
                  activeTab === tab.id ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            minHeight: '600px',
          }}
        >
          {activeTab === 'dashboard' && (
            <div>
              <h2
                style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                📊 Quality Control Dashboard
              </h2>

              {/* Quality Monitoring Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: '24px',
                  marginBottom: '32px',
                }}
              >
                {/* Service Level Monitoring */}
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.5)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '16px',
                    padding: '24px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '48px',
                      marginBottom: '16px',
                      textAlign: 'center',
                    }}
                  >
                    ⚡
                  </div>
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '16px',
                      textAlign: 'center',
                      textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                    }}
                  >
                    Service Level Monitoring
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.95)',
                          textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                          fontSize: '14px',
                        }}
                      >
                        Email Response SLA
                      </span>
                      <span style={{ color: '#10b981', fontWeight: '600' }}>
                        98.2%
                      </span>
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
                          color: 'rgba(255, 255, 255, 0.95)',
                          textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                          fontSize: '14px',
                        }}
                      >
                        Phone Response SLA
                      </span>
                      <span style={{ color: '#10b981', fontWeight: '600' }}>
                        96.7%
                      </span>
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
                          color: 'rgba(255, 255, 255, 0.95)',
                          textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                          fontSize: '14px',
                        }}
                      >
                        Load Tracking Accuracy
                      </span>
                      <span style={{ color: '#10b981', fontWeight: '600' }}>
                        99.1%
                      </span>
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
                          color: 'rgba(255, 255, 255, 0.95)',
                          textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                          fontSize: '14px',
                        }}
                      >
                        Document Processing
                      </span>
                      <span style={{ color: '#f59e0b', fontWeight: '600' }}>
                        87.3%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Experience Metrics */}
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.5)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '16px',
                    padding: '24px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '48px',
                      marginBottom: '16px',
                      textAlign: 'center',
                    }}
                  >
                    😊
                  </div>
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '16px',
                      textAlign: 'center',
                      textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                    }}
                  >
                    Customer Experience
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.95)',
                          textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                          fontSize: '14px',
                        }}
                      >
                        CSAT Score
                      </span>
                      <span style={{ color: '#3b82f6', fontWeight: '600' }}>
                        4.7/5.0
                      </span>
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
                          color: 'rgba(255, 255, 255, 0.95)',
                          textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                          fontSize: '14px',
                        }}
                      >
                        NPS Score
                      </span>
                      <span style={{ color: '#3b82f6', fontWeight: '600' }}>
                        +68
                      </span>
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
                          color: 'rgba(255, 255, 255, 0.95)',
                          textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                          fontSize: '14px',
                        }}
                      >
                        First Call Resolution
                      </span>
                      <span style={{ color: '#3b82f6', fontWeight: '600' }}>
                        84.2%
                      </span>
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
                          color: 'rgba(255, 255, 255, 0.95)',
                          textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                          fontSize: '14px',
                        }}
                      >
                        Customer Retention
                      </span>
                      <span style={{ color: '#3b82f6', fontWeight: '600' }}>
                        94.8%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Process Compliance */}
                <div
                  style={{
                    background: 'rgba(139, 92, 246, 0.5)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '16px',
                    padding: '24px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '48px',
                      marginBottom: '16px',
                      textAlign: 'center',
                    }}
                  >
                    ✅
                  </div>
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '16px',
                      textAlign: 'center',
                      textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                    }}
                  >
                    Process Compliance
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.95)',
                          textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                          fontSize: '14px',
                        }}
                      >
                        DOT Compliance
                      </span>
                      <span style={{ color: '#8b5cf6', fontWeight: '600' }}>
                        100%
                      </span>
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
                          color: 'rgba(255, 255, 255, 0.95)',
                          textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                          fontSize: '14px',
                        }}
                      >
                        Safety Protocols
                      </span>
                      <span style={{ color: '#8b5cf6', fontWeight: '600' }}>
                        98.9%
                      </span>
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
                          color: 'rgba(255, 255, 255, 0.95)',
                          textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                          fontSize: '14px',
                        }}
                      >
                        Data Security
                      </span>
                      <span style={{ color: '#8b5cf6', fontWeight: '600' }}>
                        99.7%
                      </span>
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
                          color: 'rgba(255, 255, 255, 0.95)',
                          textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                          fontSize: '14px',
                        }}
                      >
                        Process Adherence
                      </span>
                      <span style={{ color: '#f59e0b', fontWeight: '600' }}>
                        91.4%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enterprise Quality Control Platform */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '16px',
                  padding: '32px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏢</div>
                <h3
                  style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '16px',
                  }}
                >
                  Enterprise Quality Control Platform
                </h3>
                <p
                  style={{
                    fontSize: '16px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    maxWidth: '800px',
                    margin: '0 auto 24px',
                    lineHeight: '1.6',
                  }}
                >
                  Comprehensive service monitoring, automated quality assurance
                  workflows, real-time compliance tracking, customer experience
                  analytics, performance benchmarking, and enterprise-grade
                  reporting for continuous service improvement and operational
                  excellence.
                </p>

                {/* Quality Control Actions */}
                <div
                  style={{
                    display: 'flex',
                    gap: '16px',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    🔍 Run Quality Audit
                  </button>
                  <button
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                      borderRadius: '12px',
                      color: 'white',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    📊 Generate Report
                  </button>
                  <button
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                      borderRadius: '12px',
                      color: 'white',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    ⚙️ Configure Alerts
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Other tab content placeholders */}
          {activeTab !== 'dashboard' && (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
              }}
            >
              <div style={{ fontSize: '64px', marginBottom: '24px' }}>🚧</div>
              <h3
                style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '16px',
                }}
              >
                {tabs.find((tab) => tab.id === activeTab)?.label} - Coming Soon
              </h3>
              <p
                style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  maxWidth: '600px',
                  margin: '0 auto',
                  lineHeight: '1.6',
                }}
              >
                Advanced{' '}
                {tabs.find((tab) => tab.id === activeTab)?.label.toLowerCase()}{' '}
                features are currently under development. This section will
                provide comprehensive tools for monitoring and managing service
                quality across all FleetFlow operations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QualityControlProcessesPage;
