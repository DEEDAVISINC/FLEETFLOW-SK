'use client';

import React, { useEffect, useState } from 'react';

interface AnalyticsDashboardProps {
  tenantId: string;
  agentId?: string;
  timeRange?: 'today' | 'week' | 'month' | 'quarter' | 'year';
}

interface AnalyticsMetrics {
  // Communication Metrics
  totalCommunications: number;
  emailsSent: number;
  emailsOpened: number;
  emailsReplied: number;
  smsSent: number;
  smsReplied: number;
  callsMade: number;
  callsAnswered: number;
  socialPosts: number;
  socialEngagements: number;

  // Lead Metrics
  leadsGenerated: number;
  leadsQualified: number;
  leadsConverted: number;
  avgLeadScore: number;
  leadConversionRate: number;

  // Performance Metrics
  responseRate: number;
  engagementRate: number;
  aiAccuracyScore: number;
  avgResponseTime: number;

  // Financial Metrics
  totalRevenue: number;
  totalCosts: number;
  roi: number;
  costPerLead: number;
  costPerConversion: number;
  revenuePerLead: number;

  // Trend Data
  communicationTrends: Array<{
    date: string;
    emails: number;
    calls: number;
    sms: number;
  }>;
  leadTrends: Array<{
    date: string;
    generated: number;
    qualified: number;
    converted: number;
  }>;
  revenueTrends: Array<{
    date: string;
    revenue: number;
    costs: number;
    roi: number;
  }>;
}

interface TopPerformingTemplates {
  id: string;
  name: string;
  category: string;
  usageCount: number;
  responseRate: number;
  conversionRate: number;
  revenue: number;
}

interface LeadSourceAnalysis {
  source: string;
  count: number;
  percentage: number;
  conversionRate: number;
  avgLeadScore: number;
  revenue: number;
}

export const AIAgentAnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  tenantId,
  agentId,
  timeRange = 'month',
}) => {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [topTemplates, setTopTemplates] = useState<TopPerformingTemplates[]>(
    []
  );
  const [leadSources, setLeadSources] = useState<LeadSourceAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<
    'overview' | 'communication' | 'leads' | 'revenue' | 'templates'
  >('overview');

  useEffect(() => {
    loadAnalyticsData();
  }, [tenantId, agentId, timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);

      // Mock data - replace with actual API calls
      const mockMetrics: AnalyticsMetrics = {
        totalCommunications: 1847,
        emailsSent: 1247,
        emailsOpened: 892,
        emailsReplied: 134,
        smsSent: 387,
        smsReplied: 89,
        callsMade: 213,
        callsAnswered: 127,
        socialPosts: 45,
        socialEngagements: 287,

        leadsGenerated: 156,
        leadsQualified: 98,
        leadsConverted: 23,
        avgLeadScore: 72.4,
        leadConversionRate: 14.7,

        responseRate: 18.3,
        engagementRate: 24.7,
        aiAccuracyScore: 87.2,
        avgResponseTime: 4.2,

        totalRevenue: 287450,
        totalCosts: 12380,
        roi: 2220.8,
        costPerLead: 79.4,
        costPerConversion: 538.3,
        revenuePerLead: 1842.6,

        communicationTrends: generateTrendData('communication'),
        leadTrends: generateTrendData('leads'),
        revenueTrends: generateTrendData('revenue'),
      };

      const mockTopTemplates: TopPerformingTemplates[] = [
        {
          id: 'template_1',
          name: 'Cold Outreach - Freight Services',
          category: 'email',
          usageCount: 347,
          responseRate: 23.4,
          conversionRate: 8.9,
          revenue: 89750,
        },
        {
          id: 'template_2',
          name: 'Follow-up - Carrier Onboarding',
          category: 'email',
          usageCount: 289,
          responseRate: 31.2,
          conversionRate: 12.7,
          revenue: 67890,
        },
        {
          id: 'template_3',
          name: 'SMS - Appointment Reminder',
          category: 'sms',
          usageCount: 187,
          responseRate: 67.8,
          conversionRate: 34.2,
          revenue: 45670,
        },
      ];

      const mockLeadSources: LeadSourceAnalysis[] = [
        {
          source: 'JotForm Submissions',
          count: 78,
          percentage: 50.0,
          conversionRate: 18.9,
          avgLeadScore: 78.3,
          revenue: 143670,
        },
        {
          source: 'Cold Outreach',
          count: 45,
          percentage: 28.8,
          conversionRate: 11.1,
          avgLeadScore: 65.7,
          revenue: 89450,
        },
        {
          source: 'Referrals',
          count: 23,
          percentage: 14.7,
          conversionRate: 26.1,
          avgLeadScore: 82.4,
          revenue: 54330,
        },
        {
          source: 'Website Chat',
          count: 10,
          percentage: 6.4,
          conversionRate: 30.0,
          avgLeadScore: 75.2,
          revenue: 24560,
        },
      ];

      setMetrics(mockMetrics);
      setTopTemplates(mockTopTemplates);
      setLeadSources(mockLeadSources);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTrendData = (type: string) => {
    const days = 30;
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      switch (type) {
        case 'communication':
          data.push({
            date: dateStr,
            emails: Math.floor(Math.random() * 50) + 20,
            calls: Math.floor(Math.random() * 15) + 5,
            sms: Math.floor(Math.random() * 20) + 10,
          });
          break;
        case 'leads':
          data.push({
            date: dateStr,
            generated: Math.floor(Math.random() * 8) + 2,
            qualified: Math.floor(Math.random() * 5) + 1,
            converted: Math.floor(Math.random() * 2),
          });
          break;
        case 'revenue':
          data.push({
            date: dateStr,
            revenue: Math.floor(Math.random() * 15000) + 5000,
            costs: Math.floor(Math.random() * 500) + 200,
            roi: Math.floor(Math.random() * 2000) + 1000,
          });
          break;
      }
    }
    return data;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '600px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ color: '#94A3B8', fontSize: '18px' }}>
          Loading Analytics Dashboard...
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ color: '#EF4444', fontSize: '18px' }}>
          Failed to load analytics data
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background:
          'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.8))',
        borderRadius: '20px',
        padding: '30px',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        minHeight: '900px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#F8FAFC',
              margin: '0 0 8px 0',
            }}
          >
            📊 AI Agent Analytics
          </h1>
          <p
            style={{
              color: '#94A3B8',
              margin: 0,
              fontSize: '16px',
            }}
          >
            Comprehensive performance analytics and ROI tracking
          </p>
        </div>

        {/* Time Range Selector */}
        <select
          value={timeRange}
          onChange={(e) => {
            /* Update timeRange and reload data */
          }}
          style={{
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '10px',
            padding: '10px 15px',
            color: '#F8FAFC',
            fontSize: '14px',
          }}
        >
          <option value='today'>Today</option>
          <option value='week'>This Week</option>
          <option value='month'>This Month</option>
          <option value='quarter'>This Quarter</option>
          <option value='year'>This Year</option>
        </select>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '30px',
          borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
          paddingBottom: '15px',
        }}
      >
        {[
          { id: 'overview', label: '📈 Overview', icon: '📈' },
          { id: 'communication', label: '📧 Communication', icon: '📧' },
          { id: 'leads', label: '🎯 Leads', icon: '🎯' },
          { id: 'revenue', label: '💰 Revenue', icon: '💰' },
          { id: 'templates', label: '📝 Templates', icon: '📝' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            style={{
              padding: '10px 20px',
              background:
                selectedTab === tab.id
                  ? 'linear-gradient(135deg, #3B82F6, #2563EB)'
                  : 'rgba(30, 41, 59, 0.4)',
              border:
                selectedTab === tab.id
                  ? '1px solid #3B82F6'
                  : '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '10px',
              color: selectedTab === tab.id ? 'white' : '#94A3B8',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div>
          {/* Key Metrics Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
              marginBottom: '30px',
            }}
          >
            {/* ROI Card */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
                borderRadius: '15px',
                padding: '25px',
                border: '1px solid rgba(16, 185, 129, 0.2)',
              }}
            >
              <div
                style={{
                  color: '#10B981',
                  fontSize: '28px',
                  marginBottom: '10px',
                }}
              >
                💰
              </div>
              <div
                style={{
                  color: '#F8FAFC',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  marginBottom: '5px',
                }}
              >
                {formatPercentage(metrics.roi)}
              </div>
              <div
                style={{
                  color: '#94A3B8',
                  fontSize: '16px',
                  marginBottom: '10px',
                }}
              >
                Return on Investment
              </div>
              <div style={{ color: '#10B981', fontSize: '14px' }}>
                Revenue: {formatCurrency(metrics.totalRevenue)} | Costs:{' '}
                {formatCurrency(metrics.totalCosts)}
              </div>
            </div>

            {/* Total Communications */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))',
                borderRadius: '15px',
                padding: '25px',
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
            >
              <div
                style={{
                  color: '#3B82F6',
                  fontSize: '28px',
                  marginBottom: '10px',
                }}
              >
                📧
              </div>
              <div
                style={{
                  color: '#F8FAFC',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  marginBottom: '5px',
                }}
              >
                {metrics.totalCommunications.toLocaleString()}
              </div>
              <div
                style={{
                  color: '#94A3B8',
                  fontSize: '16px',
                  marginBottom: '10px',
                }}
              >
                Total Communications
              </div>
              <div style={{ color: '#10B981', fontSize: '14px' }}>
                {formatPercentage(metrics.responseRate)} response rate
              </div>
            </div>

            {/* Lead Conversion */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1))',
                borderRadius: '15px',
                padding: '25px',
                border: '1px solid rgba(245, 158, 11, 0.2)',
              }}
            >
              <div
                style={{
                  color: '#F59E0B',
                  fontSize: '28px',
                  marginBottom: '10px',
                }}
              >
                🎯
              </div>
              <div
                style={{
                  color: '#F8FAFC',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  marginBottom: '5px',
                }}
              >
                {metrics.leadsConverted}
              </div>
              <div
                style={{
                  color: '#94A3B8',
                  fontSize: '16px',
                  marginBottom: '10px',
                }}
              >
                Leads Converted
              </div>
              <div style={{ color: '#10B981', fontSize: '14px' }}>
                {formatPercentage(metrics.leadConversionRate)} conversion rate
              </div>
            </div>

            {/* AI Performance */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(147, 51, 234, 0.1))',
                borderRadius: '15px',
                padding: '25px',
                border: '1px solid rgba(168, 85, 247, 0.2)',
              }}
            >
              <div
                style={{
                  color: '#A855F7',
                  fontSize: '28px',
                  marginBottom: '10px',
                }}
              >
                🤖
              </div>
              <div
                style={{
                  color: '#F8FAFC',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  marginBottom: '5px',
                }}
              >
                {formatPercentage(metrics.aiAccuracyScore)}
              </div>
              <div
                style={{
                  color: '#94A3B8',
                  fontSize: '16px',
                  marginBottom: '10px',
                }}
              >
                AI Accuracy Score
              </div>
              <div style={{ color: '#10B981', fontSize: '14px' }}>
                {metrics.avgResponseTime}h avg response time
              </div>
            </div>
          </div>

          {/* Performance Charts Section */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '30px',
              marginBottom: '30px',
            }}
          >
            {/* Communication Trends */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.4)',
                borderRadius: '15px',
                padding: '25px',
                border: '1px solid rgba(148, 163, 184, 0.1)',
              }}
            >
              <h3
                style={{
                  color: '#F8FAFC',
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: '0 0 20px 0',
                }}
              >
                📈 Communication Trends (30 Days)
              </h3>

              <div
                style={{
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(15, 23, 42, 0.5)',
                  borderRadius: '10px',
                  color: '#94A3B8',
                }}
              >
                Chart visualization would go here
                <br />
                (Email, SMS, Voice trends over time)
              </div>
            </div>

            {/* Revenue Trends */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.4)',
                borderRadius: '15px',
                padding: '25px',
                border: '1px solid rgba(148, 163, 184, 0.1)',
              }}
            >
              <h3
                style={{
                  color: '#F8FAFC',
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: '0 0 20px 0',
                }}
              >
                💰 Revenue & ROI Trends
              </h3>

              <div
                style={{
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(15, 23, 42, 0.5)',
                  borderRadius: '10px',
                  color: '#94A3B8',
                }}
              >
                Chart visualization would go here
                <br />
                (Revenue, costs, ROI over time)
              </div>
            </div>
          </div>

          {/* Lead Sources Analysis */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.4)',
              borderRadius: '15px',
              padding: '25px',
              border: '1px solid rgba(148, 163, 184, 0.1)',
            }}
          >
            <h3
              style={{
                color: '#F8FAFC',
                fontSize: '18px',
                fontWeight: '600',
                margin: '0 0 20px 0',
              }}
            >
              🎯 Lead Sources Performance
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
              }}
            >
              {leadSources.map((source, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderRadius: '10px',
                    padding: '20px',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                  }}
                >
                  <div
                    style={{
                      color: '#F8FAFC',
                      fontSize: '16px',
                      fontWeight: '600',
                      marginBottom: '10px',
                    }}
                  >
                    {source.source}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '5px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ color: '#94A3B8', fontSize: '14px' }}>
                        Leads
                      </span>
                      <span
                        style={{
                          color: '#F8FAFC',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        {source.count}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ color: '#94A3B8', fontSize: '14px' }}>
                        Conversion
                      </span>
                      <span
                        style={{
                          color: '#10B981',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        {formatPercentage(source.conversionRate)}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ color: '#94A3B8', fontSize: '14px' }}>
                        Revenue
                      </span>
                      <span
                        style={{
                          color: '#A855F7',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        {formatCurrency(source.revenue)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {selectedTab === 'templates' && (
        <div>
          <h3
            style={{
              color: '#F8FAFC',
              fontSize: '20px',
              fontWeight: '600',
              margin: '0 0 25px 0',
            }}
          >
            📝 Top Performing Templates
          </h3>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
          >
            {topTemplates.map((template, index) => (
              <div
                key={template.id}
                style={{
                  background: 'rgba(30, 41, 59, 0.4)',
                  borderRadius: '15px',
                  padding: '25px',
                  border: '1px solid rgba(148, 163, 184, 0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      color: '#F8FAFC',
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '5px',
                    }}
                  >
                    #{index + 1} {template.name}
                  </div>
                  <div
                    style={{
                      color: '#94A3B8',
                      fontSize: '14px',
                      marginBottom: '10px',
                      textTransform: 'capitalize',
                    }}
                  >
                    Category: {template.category}
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '30px',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        color: '#3B82F6',
                        fontSize: '20px',
                        fontWeight: 'bold',
                      }}
                    >
                      {template.usageCount}
                    </div>
                    <div style={{ color: '#94A3B8', fontSize: '12px' }}>
                      Uses
                    </div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        color: '#10B981',
                        fontSize: '20px',
                        fontWeight: 'bold',
                      }}
                    >
                      {formatPercentage(template.responseRate)}
                    </div>
                    <div style={{ color: '#94A3B8', fontSize: '12px' }}>
                      Response
                    </div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        color: '#F59E0B',
                        fontSize: '20px',
                        fontWeight: 'bold',
                      }}
                    >
                      {formatPercentage(template.conversionRate)}
                    </div>
                    <div style={{ color: '#94A3B8', fontSize: '12px' }}>
                      Conversion
                    </div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        color: '#A855F7',
                        fontSize: '20px',
                        fontWeight: 'bold',
                      }}
                    >
                      {formatCurrency(template.revenue)}
                    </div>
                    <div style={{ color: '#94A3B8', fontSize: '12px' }}>
                      Revenue
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other tabs would be implemented similarly */}
      {selectedTab !== 'overview' && selectedTab !== 'templates' && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '400px',
            background: 'rgba(30, 41, 59, 0.4)',
            borderRadius: '15px',
            border: '1px solid rgba(148, 163, 184, 0.1)',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                color: '#94A3B8',
                fontSize: '48px',
                marginBottom: '20px',
              }}
            >
              📊
            </div>
            <div
              style={{
                color: '#F8FAFC',
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '10px',
              }}
            >
              {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}{' '}
              Analytics
            </div>
            <div style={{ color: '#94A3B8', fontSize: '16px' }}>
              Detailed {selectedTab} metrics and charts coming soon...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
