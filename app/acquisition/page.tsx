'use client';

import { useState } from 'react';
import AcquisitionTargetAnalysisWidget from '../components/AcquisitionTargetAnalysisWidget';

export default function AcquisitionAnalysisPage() {
  const [activeTab, setActiveTab] = useState('analysis');

  const tabs = [
    { id: 'analysis', label: 'Target Analysis', icon: '🎯' },
    { id: 'pipeline', label: 'Deal Pipeline', icon: '📊' },
    { id: 'portfolio', label: 'Portfolio Management', icon: '💼' },
    { id: 'reports', label: 'Executive Reports', icon: '📈' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 50%, #4c1d95 100%)',
        padding: '0',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
      }}
    >
      {/* Executive Header */}
      <div
        style={{
          background: 'rgba(26, 15, 46, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
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
                🎯 Acquisition Target Analysis
              </h1>
              <p
                style={{
                  fontSize: '16px',
                  color: '#94a3b8',
                  margin: 0,
                  fontWeight: '500',
                }}
              >
                Strategic M&A evaluation and market intelligence platform for
                transportation industry consolidation
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
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  color: '#3b82f6',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                STRATEGIC ANALYSIS ACTIVE
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
            {[
              {
                title: 'Active Targets',
                value: '4',
                change: '+2',
                status: 'success',
                icon: '🎯',
                description: 'Companies under evaluation',
              },
              {
                title: 'Pipeline Value',
                value: '$405M',
                change: '+$120M',
                status: 'success',
                icon: '💰',
                description: 'Total acquisition value',
              },
              {
                title: 'Due Diligence',
                value: '78%',
                change: '+12%',
                status: 'success',
                icon: '🔍',
                description: 'Average completion rate',
              },
              {
                title: 'Market Multiple',
                value: '3.2x',
                change: '+0.1x',
                status: 'warning',
                icon: '📊',
                description: 'Industry valuation average',
              },
            ].map((metric, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(45, 27, 78, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
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
                        metric.status === 'success' ? '#22c55e' : '#f59e0b',
                      fontWeight: '600',
                      background:
                        metric.status === 'success'
                          ? 'rgba(34, 197, 94, 0.1)'
                          : 'rgba(245, 158, 11, 0.1)',
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
            background: 'rgba(45, 27, 78, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
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
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '12px 20px',
                borderRadius: '12px',
                border: 'none',
                background:
                  activeTab === tab.id
                    ? 'rgba(248, 250, 252, 0.95)'
                    : 'transparent',
                color: activeTab === tab.id ? '#0f172a' : '#94a3b8',
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
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div
          style={{
            background: 'rgba(45, 27, 78, 0.4)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
            padding: '40px',
            minHeight: '600px',
          }}
        >
          {activeTab === 'analysis' && (
            <div>
              <AcquisitionTargetAnalysisWidget />
            </div>
          )}

          {activeTab === 'pipeline' && (
            <div>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#f8fafc',
                  marginBottom: '32px',
                }}
              >
                M&A Deal Pipeline
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '24px',
                  marginBottom: '32px',
                }}
              >
                {[
                  {
                    stage: 'Sourcing',
                    count: 12,
                    value: '$280M',
                    color: '#6b7280',
                  },
                  {
                    stage: 'Evaluation',
                    count: 4,
                    value: '$405M',
                    color: '#3b82f6',
                  },
                  {
                    stage: 'Negotiation',
                    count: 1,
                    value: '$120M',
                    color: '#f59e0b',
                  },
                  {
                    stage: 'Closed',
                    count: 2,
                    value: '$85M',
                    color: '#22c55e',
                  },
                ].map((stage, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '12px',
                      padding: '24px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        color: stage.color,
                        marginBottom: '8px',
                      }}
                    >
                      {stage.count}
                    </div>
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#f8fafc',
                        marginBottom: '4px',
                      }}
                    >
                      {stage.stage}
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: '#94a3b8',
                      }}
                    >
                      {stage.value}
                    </div>
                  </div>
                ))}
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
                    fontWeight: '700',
                    color: '#f8fafc',
                    marginBottom: '20px',
                  }}
                >
                  📈 Pipeline Performance Metrics
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '24px',
                  }}
                >
                  {[
                    { metric: 'Conversion Rate', value: '15.8%', trend: 'up' },
                    {
                      metric: 'Average Deal Size',
                      value: '$101M',
                      trend: 'up',
                    },
                    {
                      metric: 'Time to Close',
                      value: '147 days',
                      trend: 'down',
                    },
                  ].map((item, index) => (
                    <div key={index}>
                      <div
                        style={{
                          fontSize: '24px',
                          fontWeight: '700',
                          color: '#22c55e',
                          marginBottom: '4px',
                        }}
                      >
                        {item.value}
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: '#94a3b8',
                        }}
                      >
                        {item.metric} {item.trend === 'up' ? '↗️' : '↘️'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#f8fafc',
                  marginBottom: '32px',
                }}
              >
                Portfolio Management
              </h2>

              <div
                style={{
                  display: 'grid',
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
                      fontWeight: '700',
                      color: '#f8fafc',
                      marginBottom: '20px',
                    }}
                  >
                    💼 Integration Status
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gap: '16px',
                    }}
                  >
                    {[
                      {
                        company: 'Acquired Logistics Corp',
                        status: 'Complete',
                        progress: 100,
                        synergies: '$12M',
                      },
                      {
                        company: 'Regional Transport Inc',
                        status: 'In Progress',
                        progress: 75,
                        synergies: '$8M',
                      },
                      {
                        company: 'City Express LLC',
                        status: 'Planning',
                        progress: 25,
                        synergies: '$5M',
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
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
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#f8fafc',
                              marginBottom: '4px',
                            }}
                          >
                            {item.company}
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              color: '#94a3b8',
                            }}
                          >
                            {item.status} • {item.progress}% Complete
                          </div>
                        </div>
                        <div
                          style={{
                            textAlign: 'right',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: '700',
                              color: '#22c55e',
                            }}
                          >
                            {item.synergies}
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              color: '#94a3b8',
                            }}
                          >
                            Synergies Realized
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

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
                        fontWeight: '700',
                        color: '#f8fafc',
                        marginBottom: '20px',
                      }}
                    >
                      🎯 Strategic Objectives
                    </h3>
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {[
                        'Geographic expansion',
                        'Technology acquisition',
                        'Market consolidation',
                        'Talent acquisition',
                        'Operational synergies',
                      ].map((objective, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '14px',
                            color: '#94a3b8',
                          }}
                        >
                          <span style={{ color: '#22c55e' }}>✓</span>
                          {objective}
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
                        fontWeight: '700',
                        color: '#f8fafc',
                        marginBottom: '20px',
                      }}
                    >
                      📊 Portfolio Metrics
                    </h3>
                    <div style={{ display: 'grid', gap: '16px' }}>
                      {[
                        { metric: 'Total Portfolio Value', value: '$1.2B' },
                        { metric: 'Annual Synergies', value: '$25M' },
                        { metric: 'Integration ROI', value: '18.5%' },
                        { metric: 'Market Share', value: '12.8%' },
                      ].map((item, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '14px',
                              color: '#94a3b8',
                            }}
                          >
                            {item.metric}
                          </div>
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: '700',
                              color: '#22c55e',
                            }}
                          >
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#f8fafc',
                  marginBottom: '32px',
                }}
              >
                Executive Reports
              </h2>

              <div
                style={{
                  display: 'grid',
                  gap: '24px',
                }}
              >
                {[
                  {
                    title: 'Monthly M&A Summary',
                    description:
                      'Comprehensive overview of acquisition activities and pipeline status',
                    lastGenerated: '2024-01-15',
                    type: 'Executive Summary',
                    status: 'Ready',
                  },
                  {
                    title: 'Market Intelligence Report',
                    description:
                      'Industry trends, competitive landscape, and valuation analysis',
                    lastGenerated: '2024-01-14',
                    type: 'Market Analysis',
                    status: 'Ready',
                  },
                  {
                    title: 'Due Diligence Dashboard',
                    description:
                      'Detailed analysis of target companies and risk assessments',
                    lastGenerated: '2024-01-13',
                    type: 'Risk Assessment',
                    status: 'In Progress',
                  },
                  {
                    title: 'Integration Progress Report',
                    description:
                      'Post-acquisition integration status and synergy realization',
                    lastGenerated: '2024-01-12',
                    type: 'Integration Update',
                    status: 'Ready',
                  },
                ].map((report, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '12px',
                      padding: '24px',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '16px',
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            color: '#f8fafc',
                            marginBottom: '8px',
                          }}
                        >
                          {report.title}
                        </h3>
                        <p
                          style={{
                            fontSize: '14px',
                            color: '#94a3b8',
                            margin: '0 0 12px 0',
                          }}
                        >
                          {report.description}
                        </p>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            fontSize: '12px',
                            color: '#64748b',
                          }}
                        >
                          <span>Type: {report.type}</span>
                          <span>Last: {report.lastGenerated}</span>
                        </div>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        <div
                          style={{
                            padding: '6px 12px',
                            background:
                              report.status === 'Ready'
                                ? 'rgba(34, 197, 94, 0.1)'
                                : 'rgba(245, 158, 11, 0.1)',
                            border: `1px solid ${report.status === 'Ready' ? '#22c55e' : '#f59e0b'}`,
                            borderRadius: '8px',
                            color:
                              report.status === 'Ready' ? '#22c55e' : '#f59e0b',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          {report.status}
                        </div>
                        <button
                          style={{
                            padding: '8px 16px',
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: '8px',
                            color: '#3b82f6',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
