'use client';

import { useEffect, useState } from 'react';

interface AcquisitionTarget {
  id: string;
  companyName: string;
  industry: string;
  revenue: string;
  valuation: string;
  employees: number;
  locations: string[];
  strengths: string[];
  risks: string[];
  synergies: string[];
  score: number;
  status: 'evaluating' | 'interested' | 'negotiating' | 'declined';
  lastUpdated: string;
}

interface MarketIntelligence {
  category: string;
  metrics: {
    label: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
    impact: 'high' | 'medium' | 'low';
  }[];
}

interface DueDiligenceItem {
  category: string;
  items: {
    name: string;
    status: 'completed' | 'in-progress' | 'pending' | 'flagged';
    priority: 'critical' | 'high' | 'medium' | 'low';
    findings: string;
  }[];
}

export default function AcquisitionTargetAnalysisWidget() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('targets');
  const [targets, setTargets] = useState<AcquisitionTarget[]>([]);
  const [marketIntel, setMarketIntel] = useState<MarketIntelligence[]>([]);
  const [dueDiligence, setDueDiligence] = useState<DueDiligenceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchAcquisitionData();
  }, []);

  const fetchAcquisitionData = async () => {
    try {
      const response = await fetch('/api/acquisition/analysis');
      const data = await response.json();
      setTargets(data.targets || []);
      setMarketIntel(data.marketIntelligence || []);
      setDueDiligence(data.dueDiligence || []);
    } catch (error) {
      console.error('Error fetching acquisition data:', error);
      // Mock data for development
      setTargets([
        {
          id: 'ACQ-001',
          companyName: 'Midwest Logistics Corp',
          industry: 'Regional Freight',
          revenue: '$45M',
          valuation: '$120M',
          employees: 280,
          locations: ['Chicago', 'Detroit', 'Milwaukee'],
          strengths: [
            'Strong regional network',
            'Established customer base',
            'Modern fleet',
          ],
          risks: ['Aging management', 'Limited technology', 'Union contracts'],
          synergies: [
            'Route optimization',
            'Technology integration',
            'Cost savings',
          ],
          score: 8.2,
          status: 'negotiating',
          lastUpdated: '2024-01-15',
        },
        {
          id: 'ACQ-002',
          companyName: 'TechTrans Solutions',
          industry: 'Logistics Technology',
          revenue: '$12M',
          valuation: '$35M',
          employees: 85,
          locations: ['Austin', 'Remote'],
          strengths: [
            'AI/ML expertise',
            'Patent portfolio',
            'Scalable platform',
          ],
          risks: [
            'Limited market penetration',
            'Key person dependency',
            'Burn rate',
          ],
          synergies: [
            'Technology acceleration',
            'Talent acquisition',
            'IP portfolio',
          ],
          score: 9.1,
          status: 'interested',
          lastUpdated: '2024-01-14',
        },
      ]);

      setMarketIntel([
        {
          category: 'Market Trends',
          metrics: [
            {
              label: 'Industry Growth Rate',
              value: '4.2%',
              trend: 'up',
              impact: 'high',
            },
            {
              label: 'M&A Activity',
              value: '+23%',
              trend: 'up',
              impact: 'high',
            },
            {
              label: 'Valuation Multiples',
              value: '3.2x',
              trend: 'stable',
              impact: 'medium',
            },
          ],
        },
        {
          category: 'Competitive Landscape',
          metrics: [
            {
              label: 'Market Consolidation',
              value: '67%',
              trend: 'up',
              impact: 'high',
            },
            {
              label: 'Technology Adoption',
              value: '45%',
              trend: 'up',
              impact: 'medium',
            },
            {
              label: 'Regulatory Changes',
              value: 'Moderate',
              trend: 'stable',
              impact: 'medium',
            },
          ],
        },
      ]);

      setDueDiligence([
        {
          category: 'Financial Analysis',
          items: [
            {
              name: 'Revenue Verification',
              status: 'completed',
              priority: 'critical',
              findings: 'Verified through audited statements',
            },
            {
              name: 'Debt Structure',
              status: 'in-progress',
              priority: 'high',
              findings: 'Reviewing credit agreements',
            },
            {
              name: 'Working Capital',
              status: 'completed',
              priority: 'medium',
              findings: 'Healthy cash flow cycle',
            },
          ],
        },
        {
          category: 'Operational Review',
          items: [
            {
              name: 'Fleet Assessment',
              status: 'completed',
              priority: 'high',
              findings: 'Modern fleet, well maintained',
            },
            {
              name: 'Technology Stack',
              status: 'flagged',
              priority: 'critical',
              findings: 'Legacy systems need upgrade',
            },
            {
              name: 'Customer Contracts',
              status: 'in-progress',
              priority: 'high',
              findings: 'Long-term agreements in place',
            },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'evaluating':
        return '#6b7280';
      case 'interested':
        return '#3b82f6';
      case 'negotiating':
        return '#f59e0b';
      case 'declined':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'evaluating':
        return 'rgba(107, 114, 128, 0.1)';
      case 'interested':
        return 'rgba(59, 130, 246, 0.1)';
      case 'negotiating':
        return 'rgba(245, 158, 11, 0.1)';
      case 'declined':
        return 'rgba(239, 68, 68, 0.1)';
      default:
        return 'rgba(107, 114, 128, 0.1)';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return '#ef4444';
      case 'high':
        return '#f59e0b';
      case 'medium':
        return '#3b82f6';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'in-progress':
        return '🔄';
      case 'pending':
        return '⏳';
      case 'flagged':
        return '🚩';
      default:
        return '❓';
    }
  };

  const tabs = [
    { id: 'targets', label: 'Target Companies', icon: '🎯' },
    { id: 'intelligence', label: 'Market Intelligence', icon: '📊' },
    { id: 'diligence', label: 'Due Diligence', icon: '🔍' },
    { id: 'valuation', label: 'Valuation Models', icon: '💰' },
  ];

  return (
    <div
      style={{
        background: 'rgba(139, 92, 246, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '32px',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        boxShadow: '0 8px 32px rgba(76, 29, 149, 0.2)',
        margin: '24px 0',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 8px 0',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            🎯 Acquisition Target Analysis
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.8)',
              margin: 0,
            }}
          >
            Strategic M&A evaluation and market intelligence platform
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
            {targets.length} ACTIVE TARGETS
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '32px',
          background: 'rgba(139, 92, 246, 0.2)',
          borderRadius: '16px',
          padding: '8px',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '12px 20px',
              border: 'none',
              borderRadius: '12px',
              background:
                activeTab === tab.id
                  ? 'rgba(139, 92, 246, 0.4)'
                  : 'transparent',
              color:
                activeTab === tab.id ? 'white' : 'rgba(255, 255, 255, 0.7)',
              fontSize: '14px',
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
      <div style={{ minHeight: '400px' }}>
        {activeTab === 'targets' && (
          <div>
            <div
              style={{
                display: 'grid',
                gap: '24px',
              }}
            >
              {targets.map((target) => (
                <div
                  key={target.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '16px',
                    padding: '24px',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '20px',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: '20px',
                          fontWeight: '700',
                          color: 'white',
                          margin: '0 0 8px 0',
                        }}
                      >
                        {target.companyName}
                      </h3>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          marginBottom: '12px',
                        }}
                      >
                        <span
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '14px',
                          }}
                        >
                          {target.industry}
                        </span>
                        <span
                          style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '14px',
                          }}
                        >
                          {target.employees} employees
                        </span>
                      </div>
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
                          textAlign: 'right',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: '#22c55e',
                          }}
                        >
                          {target.score}/10
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.6)',
                          }}
                        >
                          Acquisition Score
                        </div>
                      </div>
                      <div
                        style={{
                          padding: '6px 12px',
                          background: getStatusBgColor(target.status),
                          border: `1px solid ${getStatusColor(target.status)}`,
                          borderRadius: '8px',
                          color: getStatusColor(target.status),
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                        }}
                      >
                        {target.status}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '16px',
                      marginBottom: '20px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          marginBottom: '4px',
                        }}
                      >
                        Revenue
                      </div>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        {target.revenue}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          marginBottom: '4px',
                        }}
                      >
                        Valuation
                      </div>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        {target.valuation}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          marginBottom: '4px',
                        }}
                      >
                        Locations
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        {target.locations.join(', ')}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          marginBottom: '4px',
                        }}
                      >
                        Last Updated
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        {target.lastUpdated}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#22c55e',
                          marginBottom: '8px',
                        }}
                      >
                        ✅ Strengths
                      </div>
                      <ul
                        style={{
                          margin: 0,
                          padding: '0 0 0 16px',
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '13px',
                        }}
                      >
                        {target.strengths.map((strength, index) => (
                          <li key={index} style={{ marginBottom: '4px' }}>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#ef4444',
                          marginBottom: '8px',
                        }}
                      >
                        ⚠️ Risks
                      </div>
                      <ul
                        style={{
                          margin: 0,
                          padding: '0 0 0 16px',
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '13px',
                        }}
                      >
                        {target.risks.map((risk, index) => (
                          <li key={index} style={{ marginBottom: '4px' }}>
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#3b82f6',
                          marginBottom: '8px',
                        }}
                      >
                        🔄 Synergies
                      </div>
                      <ul
                        style={{
                          margin: 0,
                          padding: '0 0 0 16px',
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '13px',
                        }}
                      >
                        {target.synergies.map((synergy, index) => (
                          <li key={index} style={{ marginBottom: '4px' }}>
                            {synergy}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'intelligence' && (
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '24px',
              }}
            >
              {marketIntel.map((intel, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '16px',
                    padding: '24px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: 'white',
                      marginBottom: '20px',
                    }}
                  >
                    {intel.category}
                  </h3>
                  <div style={{ display: 'grid', gap: '16px' }}>
                    {intel.metrics.map((metric, mIndex) => (
                      <div
                        key={mIndex}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px 0',
                          borderBottom:
                            mIndex < intel.metrics.length - 1
                              ? '1px solid rgba(255, 255, 255, 0.1)'
                              : 'none',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: 'white',
                              marginBottom: '4px',
                            }}
                          >
                            {metric.label}
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              color:
                                metric.impact === 'high'
                                  ? '#ef4444'
                                  : metric.impact === 'medium'
                                    ? '#f59e0b'
                                    : '#22c55e',
                              fontWeight: '500',
                            }}
                          >
                            {metric.impact.toUpperCase()} IMPACT
                          </div>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: '700',
                              color: '#22c55e',
                            }}
                          >
                            {metric.value}
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              color:
                                metric.trend === 'up'
                                  ? '#22c55e'
                                  : metric.trend === 'down'
                                    ? '#ef4444'
                                    : '#6b7280',
                            }}
                          >
                            {metric.trend === 'up'
                              ? '↗️'
                              : metric.trend === 'down'
                                ? '↘️'
                                : '➡️'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'diligence' && (
          <div>
            <div
              style={{
                display: 'grid',
                gap: '24px',
              }}
            >
              {dueDiligence.map((category, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '16px',
                    padding: '24px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: 'white',
                      marginBottom: '20px',
                    }}
                  >
                    {category.category}
                  </h3>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {category.items.map((item, iIndex) => (
                      <div
                        key={iIndex}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              marginBottom: '8px',
                            }}
                          >
                            <span style={{ fontSize: '16px' }}>
                              {getStatusIcon(item.status)}
                            </span>
                            <div
                              style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: 'white',
                              }}
                            >
                              {item.name}
                            </div>
                            <div
                              style={{
                                padding: '2px 8px',
                                background: `rgba(${getPriorityColor(item.priority).replace('#', '')}, 0.1)`,
                                border: `1px solid ${getPriorityColor(item.priority)}`,
                                borderRadius: '4px',
                                color: getPriorityColor(item.priority),
                                fontSize: '10px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                              }}
                            >
                              {item.priority}
                            </div>
                          </div>
                          <div
                            style={{
                              fontSize: '13px',
                              color: 'rgba(255, 255, 255, 0.7)',
                            }}
                          >
                            {item.findings}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'valuation' && (
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '24px',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  padding: '24px',
                }}
              >
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: 'white',
                    marginBottom: '20px',
                  }}
                >
                  📊 Valuation Multiples
                </h3>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {[
                    {
                      metric: 'Revenue Multiple',
                      value: '2.8x',
                      benchmark: '2.5-3.5x',
                    },
                    {
                      metric: 'EBITDA Multiple',
                      value: '8.2x',
                      benchmark: '6-12x',
                    },
                    {
                      metric: 'Book Value Multiple',
                      value: '1.4x',
                      benchmark: '1.2-2.0x',
                    },
                    {
                      metric: 'Asset Multiple',
                      value: '0.9x',
                      benchmark: '0.8-1.2x',
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 0',
                        borderBottom:
                          index < 3
                            ? '1px solid rgba(255, 255, 255, 0.1)'
                            : 'none',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        {item.metric}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#22c55e',
                          }}
                        >
                          {item.value}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.6)',
                          }}
                        >
                          {item.benchmark}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  padding: '24px',
                }}
              >
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: 'white',
                    marginBottom: '20px',
                  }}
                >
                  💰 DCF Analysis
                </h3>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {[
                    {
                      metric: 'NPV (10% Discount)',
                      value: '$142M',
                      status: 'positive',
                    },
                    { metric: 'IRR', value: '18.5%', status: 'positive' },
                    {
                      metric: 'Payback Period',
                      value: '4.2 years',
                      status: 'neutral',
                    },
                    {
                      metric: 'Terminal Value',
                      value: '$89M',
                      status: 'positive',
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 0',
                        borderBottom:
                          index < 3
                            ? '1px solid rgba(255, 255, 255, 0.1)'
                            : 'none',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        {item.metric}
                      </div>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          color:
                            item.status === 'positive'
                              ? '#22c55e'
                              : item.status === 'negative'
                                ? '#ef4444'
                                : '#f59e0b',
                        }}
                      >
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: '24px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                padding: '24px',
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '20px',
                }}
              >
                🎯 Strategic Value Assessment
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '16px',
                }}
              >
                {[
                  { category: 'Market Position', score: 8.5, color: '#22c55e' },
                  {
                    category: 'Technology Assets',
                    score: 7.2,
                    color: '#3b82f6',
                  },
                  {
                    category: 'Financial Health',
                    score: 9.1,
                    color: '#22c55e',
                  },
                  { category: 'Cultural Fit', score: 6.8, color: '#f59e0b' },
                ].map((item, index) => (
                  <div
                    key={index}
                    style={{
                      textAlign: 'center',
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: item.color,
                        marginBottom: '8px',
                      }}
                    >
                      {item.score}/10
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      {item.category}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
