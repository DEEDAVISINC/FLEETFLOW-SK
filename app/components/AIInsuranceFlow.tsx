'use client';

import { useEffect, useState } from 'react';
import {
  InsuranceLeadProfile,
  PartnerExpansionOpportunity,
  aiInsuranceLeadService,
} from '../services/ai-insurance-lead-service';

export default function AIInsuranceFlow() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [leads, setLeads] = useState<InsuranceLeadProfile[]>([]);
  const [partners, setPartners] = useState<PartnerExpansionOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    qualifiedLeads: 0,
    conversions: 0,
    revenue: 0,
    conversionRate: 0,
  });

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [conversionMetrics] = await Promise.all([
        aiInsuranceLeadService.trackConversions(),
      ]);

      setMetrics(conversionMetrics);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateLeads = async (strategy: string, count: number = 10) => {
    setIsLoading(true);
    try {
      const newLeads = await aiInsuranceLeadService.generateLeads(
        strategy,
        count
      );
      setLeads((prev) => [...newLeads, ...prev].slice(0, 50)); // Keep latest 50

      // Refresh metrics
      await loadDashboardData();
    } catch (error) {
      console.error('Failed to generate leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const discoverPartners = async () => {
    setIsLoading(true);
    try {
      const opportunities =
        await aiInsuranceLeadService.discoverPartnerOpportunities();
      setPartners(opportunities);
    } catch (error) {
      console.error('Failed to discover partners:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const strategies = aiInsuranceLeadService.getLeadGenerationStrategies();

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
        padding: '20px',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
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
            <div
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderRadius: '12px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '24px' }}>🤖</span>
            </div>
            <div>
              <h1
                style={{
                  color: 'white',
                  margin: 0,
                  fontSize: '28px',
                  fontWeight: '700',
                }}
              >
                AI Insurance Flow
              </h1>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  margin: 0,
                  fontSize: '16px',
                }}
              >
                Intelligent Lead Generation & Partner Expansion Platform
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
              {
                id: 'lead-generation',
                label: '🎯 Lead Generation',
                icon: '🎯',
              },
              {
                id: 'partner-discovery',
                label: '🤝 Partner Discovery',
                icon: '🤝',
              },
              {
                id: 'market-intelligence',
                label: '📈 Market Intel',
                icon: '📈',
              },
              { id: 'automation', label: '⚡ Automation', icon: '⚡' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background:
                    activeTab === tab.id
                      ? 'linear-gradient(135deg, #10b981, #059669)'
                      : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.1)';
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'grid', gap: '24px' }}>
            {/* Metrics Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
              }}
            >
              {[
                {
                  label: 'Total Leads',
                  value: metrics.totalLeads.toLocaleString(),
                  icon: '👥',
                  color: '#3b82f6',
                },
                {
                  label: 'Qualified Leads',
                  value: metrics.qualifiedLeads.toLocaleString(),
                  icon: '✅',
                  color: '#10b981',
                },
                {
                  label: 'Conversions',
                  value: metrics.conversions.toLocaleString(),
                  icon: '🎯',
                  color: '#f59e0b',
                },
                {
                  label: 'Revenue',
                  value: `$${metrics.revenue.toLocaleString()}`,
                  icon: '💰',
                  color: '#10b981',
                },
                {
                  label: 'Conversion Rate',
                  value: `${(metrics.conversionRate * 100).toFixed(1)}%`,
                  icon: '📈',
                  color: '#6366f1',
                },
              ].map((metric, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px',
                    }}
                  >
                    <div
                      style={{
                        background: metric.color,
                        borderRadius: '8px',
                        padding: '8px',
                        fontSize: '20px',
                      }}
                    >
                      {metric.icon}
                    </div>
                    <div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '24px',
                          fontWeight: '700',
                        }}
                      >
                        {metric.value}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                        }}
                      >
                        {metric.label}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  margin: '0 0 16px 0',
                  fontSize: '18px',
                  fontWeight: '600',
                }}
              >
                🔄 AI Flow Status
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {[
                  {
                    status: 'Active',
                    message: 'FMCSA Discovery AI - 15 new leads identified',
                    time: '2 min ago',
                    color: '#10b981',
                  },
                  {
                    status: 'Processing',
                    message:
                      'Renewal Intelligence - Analyzing 247 carrier renewal dates',
                    time: '5 min ago',
                    color: '#f59e0b',
                  },
                  {
                    status: 'Completed',
                    message: 'Partner Discovery - 6 new opportunities found',
                    time: '12 min ago',
                    color: '#3b82f6',
                  },
                  {
                    status: 'Active',
                    message:
                      'Market Intelligence - Competitive analysis updated',
                    time: '18 min ago',
                    color: '#10b981',
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '16px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: activity.color,
                      }}
                    ></div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        {activity.message}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.5)',
                          fontSize: '12px',
                        }}
                      >
                        {activity.time}
                      </div>
                    </div>
                    <div
                      style={{
                        background: activity.color,
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      {activity.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Lead Generation Tab */}
        {activeTab === 'lead-generation' && (
          <div style={{ display: 'grid', gap: '24px' }}>
            {/* Strategy Selection */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  margin: '0 0 16px 0',
                  fontSize: '18px',
                  fontWeight: '600',
                }}
              >
                🎯 AI Lead Generation Strategies
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '16px',
                }}
              >
                {strategies.map((strategy, index) => {
                  const roi =
                    aiInsuranceLeadService.calculateROIProjections(strategy);
                  return (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <h4
                        style={{
                          color: 'white',
                          margin: '0 0 8px 0',
                          fontSize: '16px',
                          fontWeight: '600',
                        }}
                      >
                        {strategy.name}
                      </h4>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                          marginBottom: '16px',
                        }}
                      >
                        {strategy.description}
                      </p>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '12px',
                          marginBottom: '16px',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              color: '#10b981',
                              fontSize: '18px',
                              fontWeight: '700',
                            }}
                          >
                            {roi.projectedLeads}
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.5)',
                              fontSize: '12px',
                            }}
                          >
                            Leads/Month
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              color: '#10b981',
                              fontSize: '18px',
                              fontWeight: '700',
                            }}
                          >
                            ${roi.projectedRevenue.toLocaleString()}
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.5)',
                              fontSize: '12px',
                            }}
                          >
                            Revenue/Month
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => generateLeads(strategy.name, 10)}
                        disabled={isLoading}
                        style={{
                          background:
                            'linear-gradient(135deg, #10b981, #059669)',
                          color: 'white',
                          border: 'none',
                          padding: '10px 16px',
                          borderRadius: '8px',
                          cursor: isLoading ? 'not-allowed' : 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          width: '100%',
                          opacity: isLoading ? 0.7 : 1,
                        }}
                      >
                        {isLoading ? '🔄 Generating...' : '🚀 Generate Leads'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Generated Leads */}
            {leads.length > 0 && (
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    margin: '0 0 16px 0',
                    fontSize: '18px',
                    fontWeight: '600',
                  }}
                >
                  🎯 Generated Leads ({leads.length})
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gap: '12px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                  }}
                >
                  {leads.slice(0, 10).map((lead, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '16px',
                        borderRadius: '8px',
                        display: 'grid',
                        gridTemplateColumns: '1fr auto auto',
                        gap: '16px',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: '600',
                          }}
                        >
                          {lead.companyName}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '14px',
                          }}
                        >
                          {lead.contactName} • {lead.fleetSize} vehicles •{' '}
                          {lead.businessType}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            fontSize: '12px',
                          }}
                        >
                          {lead.email} • {lead.phone}
                        </div>
                      </div>
                      <div
                        style={{
                          background:
                            lead.priority === 'urgent'
                              ? '#dc2626'
                              : lead.priority === 'high'
                                ? '#f59e0b'
                                : lead.priority === 'medium'
                                  ? '#3b82f6'
                                  : '#6b7280',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {lead.priority.toUpperCase()}
                      </div>
                      <div
                        style={{
                          color: '#10b981',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        Score: {lead.leadScore}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Partner Discovery Tab */}
        {activeTab === 'partner-discovery' && (
          <div style={{ display: 'grid', gap: '24px' }}>
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: '600',
                  }}
                >
                  🤝 Partnership Opportunities
                </h3>
                <button
                  onClick={discoverPartners}
                  disabled={isLoading}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    opacity: isLoading ? 0.7 : 1,
                  }}
                >
                  {isLoading ? '🔄 Analyzing...' : '🔍 Discover Partners'}
                </button>
              </div>

              {partners.length > 0 ? (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {partners.map((partner, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'start',
                          marginBottom: '12px',
                        }}
                      >
                        <div>
                          <h4
                            style={{
                              color: 'white',
                              margin: '0 0 4px 0',
                              fontSize: '16px',
                              fontWeight: '600',
                            }}
                          >
                            {partner.companyName}
                          </h4>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '14px',
                            }}
                          >
                            {partner.partnerType.replace('_', ' ')} •{' '}
                            {partner.partnershipModel.replace('_', ' ')}
                          </div>
                        </div>
                        <div
                          style={{
                            background:
                              partner.aiAnalysis.fitScore > 90
                                ? '#10b981'
                                : partner.aiAnalysis.fitScore > 80
                                  ? '#f59e0b'
                                  : '#6b7280',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          Fit Score: {partner.aiAnalysis.fitScore}
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '16px',
                          marginBottom: '16px',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.5)',
                              fontSize: '12px',
                              marginBottom: '4px',
                            }}
                          >
                            Commission Range
                          </div>
                          <div
                            style={{
                              color: '#10b981',
                              fontSize: '14px',
                              fontWeight: '600',
                            }}
                          >
                            {partner.potentialValue.commissionRange}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.5)',
                              fontSize: '12px',
                              marginBottom: '4px',
                            }}
                          >
                            Volume Capacity
                          </div>
                          <div
                            style={{
                              color: '#10b981',
                              fontSize: '14px',
                              fontWeight: '600',
                            }}
                          >
                            {partner.potentialValue.volumeCapacity.toLocaleString()}{' '}
                            policies/year
                          </div>
                        </div>
                      </div>

                      <div style={{ marginBottom: '12px' }}>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            fontSize: '12px',
                            marginBottom: '4px',
                          }}
                        >
                          AI Analysis
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '14px',
                          }}
                        >
                          {partner.aiAnalysis.competitiveAdvantage}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        {partner.potentialValue.marketSegments
                          .slice(0, 3)
                          .map((segment, segIndex) => (
                            <div
                              key={segIndex}
                              style={{
                                background: 'rgba(99, 102, 241, 0.2)',
                                color: '#a5b4fc',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                              }}
                            >
                              {segment}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '40px',
                    color: 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  Click "Discover Partners" to find new partnership
                  opportunities using AI analysis
                </div>
              )}
            </div>
          </div>
        )}

        {/* Market Intelligence Tab */}
        {activeTab === 'market-intelligence' && (
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}
          >
            <h3
              style={{
                color: 'white',
                margin: '0 0 16px 0',
                fontSize: '18px',
                fontWeight: '600',
              }}
            >
              📈 Market Intelligence Dashboard
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
              }}
            >
              {[
                {
                  title: 'Market Size',
                  value: '$4.2B',
                  change: '+12.5%',
                  description: 'Commercial trucking insurance market',
                  icon: '📊',
                },
                {
                  title: 'Growth Rate',
                  value: '8.3%',
                  change: '+2.1%',
                  description: 'Annual market growth',
                  icon: '📈',
                },
                {
                  title: 'Competition',
                  value: '247',
                  change: '+18',
                  description: 'Active insurance brokers',
                  icon: '🏢',
                },
                {
                  title: 'Opportunity Score',
                  value: '94/100',
                  change: '+5',
                  description: 'AI-calculated market opportunity',
                  icon: '🎯',
                },
              ].map((metric, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px',
                    }}
                  >
                    <div style={{ fontSize: '24px' }}>{metric.icon}</div>
                    <div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '20px',
                          fontWeight: '700',
                        }}
                      >
                        {metric.value}
                      </div>
                      <div
                        style={{
                          color: '#10b981',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        {metric.change}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '600',
                        marginBottom: '4px',
                      }}
                    >
                      {metric.title}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                      }}
                    >
                      {metric.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Automation Tab */}
        {activeTab === 'automation' && (
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}
          >
            <h3
              style={{
                color: 'white',
                margin: '0 0 16px 0',
                fontSize: '18px',
                fontWeight: '600',
              }}
            >
              ⚡ AI Automation Center
            </h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              {[
                {
                  name: 'Lead Generation Automation',
                  status: 'Active',
                  description:
                    'Automatically generates 40+ leads daily using FMCSA data and market intelligence',
                  performance: '94% accuracy',
                  color: '#10b981',
                },
                {
                  name: 'Email Nurture Campaigns',
                  status: 'Active',
                  description:
                    'Personalized email sequences based on lead behavior and preferences',
                  performance: '23% open rate',
                  color: '#10b981',
                },
                {
                  name: 'Partner Opportunity Discovery',
                  status: 'Scheduled',
                  description:
                    'Weekly analysis of new partnership opportunities and market gaps',
                  performance: '6 opportunities/week',
                  color: '#f59e0b',
                },
                {
                  name: 'Competitive Intelligence',
                  status: 'Active',
                  description:
                    'Monitors competitor pricing, partnerships, and market positioning',
                  performance: 'Daily updates',
                  color: '#10b981',
                },
                {
                  name: 'Renewal Date Tracking',
                  status: 'Active',
                  description:
                    'Tracks insurance renewal dates and triggers outreach campaigns',
                  performance: '85% success rate',
                  color: '#10b981',
                },
              ].map((automation, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: automation.color,
                    }}
                  ></div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '600',
                        marginBottom: '4px',
                      }}
                    >
                      {automation.name}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                        marginBottom: '8px',
                      }}
                    >
                      {automation.description}
                    </div>
                    <div
                      style={{
                        color: automation.color,
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      {automation.performance}
                    </div>
                  </div>
                  <div
                    style={{
                      background: automation.color,
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    {automation.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
