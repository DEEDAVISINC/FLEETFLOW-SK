'use client';

import { useEffect, useState } from 'react';

export default function SalesAnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<any>({});
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  useEffect(() => {
    setAnalyticsData({
      revenue: {
        current: '$12.4M',
        previous: '$10.2M',
        growth: '+21.6%',
        trend: 'up',
        breakdown: [
          { category: 'Logistics Sales', value: '$7.8M', percentage: 62.9 },
          {
            category: 'Customer Service Upsells',
            value: '$2.1M',
            percentage: 16.9,
          },
          { category: '3PL Services', value: '$1.8M', percentage: 14.5 },
          { category: 'Warehousing', value: '$0.7M', percentage: 5.6 },
        ],
      },
      performance: {
        conversionRate: { current: '34.2%', previous: '29.8%', trend: 'up' },
        avgDealSize: { current: '$485K', previous: '$412K', trend: 'up' },
        salesCycle: {
          current: '18.5 days',
          previous: '22.3 days',
          trend: 'down',
        },
        customerSatisfaction: {
          current: '4.8/5',
          previous: '4.6/5',
          trend: 'up',
        },
      },
      teamMetrics: [
        {
          name: 'Sarah Mitchell',
          role: 'Senior Logistics Sales',
          revenue: '$4.2M',
          deals: 47,
          conversionRate: '38.5%',
          performance: 'Outstanding',
          aiScore: 94,
        },
        {
          name: 'Marcus Rodriguez',
          role: 'Customer Service Manager',
          revenue: '$2.1M',
          deals: 89,
          conversionRate: '42.1%',
          performance: 'Excellent',
          aiScore: 91,
        },
        {
          name: 'Jennifer Chen',
          role: 'Transportation Sales',
          revenue: '$3.8M',
          deals: 52,
          conversionRate: '35.7%',
          performance: 'Excellent',
          aiScore: 88,
        },
        {
          name: 'David Thompson',
          role: 'Customer Success',
          revenue: '$2.3M',
          deals: 76,
          conversionRate: '31.2%',
          performance: 'Good',
          aiScore: 85,
        },
      ],
      forecasting: {
        nextMonth: '$14.8M',
        nextQuarter: '$42.1M',
        confidence: '89%',
        riskFactors: [
          'Economic uncertainty affecting freight volumes',
          'Seasonal demand fluctuations in Q1',
          'Competitive pricing pressure',
        ],
        opportunities: [
          'New 3PL partnerships in development',
          'AI-driven lead generation showing 23% improvement',
          'Customer retention programs yielding results',
        ],
      },
      aiInsights: [
        {
          type: 'Opportunity',
          title: 'High-Value Prospect Pipeline',
          description:
            'AI has identified 23 high-probability prospects worth $18.7M in potential revenue.',
          impact: 'High',
          confidence: 92,
        },
        {
          type: 'Performance',
          title: 'Team Optimization Recommendation',
          description:
            'Reallocating leads based on specialization could increase conversion by 15%.',
          impact: 'Medium',
          confidence: 87,
        },
        {
          type: 'Risk',
          title: 'Customer Churn Alert',
          description:
            '3 major accounts showing decreased activity. Immediate attention recommended.',
          impact: 'High',
          confidence: 94,
        },
      ],
    });
  }, [timeRange]);

  const renderKPICards = () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '32px',
      }}
    >
      {[
        {
          label: 'Total Revenue',
          value: analyticsData.revenue?.current || '$0',
          change: analyticsData.revenue?.growth || '0%',
          trend: 'up',
          color: '#22c55e',
        },
        {
          label: 'Conversion Rate',
          value: analyticsData.performance?.conversionRate?.current || '0%',
          change: '+4.4%',
          trend: 'up',
          color: '#3b82f6',
        },
        {
          label: 'Avg Deal Size',
          value: analyticsData.performance?.avgDealSize?.current || '$0',
          change: '+17.7%',
          trend: 'up',
          color: '#f59e0b',
        },
        {
          label: 'Sales Cycle',
          value: analyticsData.performance?.salesCycle?.current || '0 days',
          change: '-17.0%',
          trend: 'down',
          color: '#8b5cf6',
        },
        {
          label: 'Customer Satisfaction',
          value:
            analyticsData.performance?.customerSatisfaction?.current || '0/5',
          change: '+4.3%',
          trend: 'up',
          color: '#ec4899',
        },
        {
          label: 'AI Efficiency Score',
          value: '91%',
          change: '+8.2%',
          trend: 'up',
          color: '#06b6d4',
        },
      ].map((kpi, index) => (
        <div
          key={index}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${kpi.color}, ${kpi.color}88)`,
            }}
          />
          <div
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.9rem',
              marginBottom: '8px',
            }}
          >
            {kpi.label}
          </div>
          <div
            style={{
              color: 'white',
              fontSize: '2rem',
              fontWeight: '700',
              marginBottom: '8px',
            }}
          >
            {kpi.value}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span
              style={{
                color: kpi.trend === 'up' ? '#22c55e' : '#ef4444',
                fontSize: '0.9rem',
                fontWeight: '600',
              }}
            >
              {kpi.trend === 'up' ? '↗' : '↘'} {kpi.change}
            </span>
            <span
              style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}
            >
              vs last period
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderRevenueBreakdown = () => (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        marginBottom: '24px',
      }}
    >
      <h3
        style={{
          color: 'white',
          fontSize: '1.4rem',
          fontWeight: '600',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        💰 Revenue Breakdown
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: '24px',
        }}
      >
        {/* Revenue Categories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {analyticsData.revenue?.breakdown?.map((item: any, index: number) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <div
                  style={{
                    color: 'white',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                  }}
                >
                  {item.category}
                </div>
                <div
                  style={{
                    color: '#22c55e',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                  }}
                >
                  {item.value}
                </div>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <div
                  style={{
                    flex: 1,
                    height: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${item.percentage}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, #22c55e, #16a34a)`,
                      borderRadius: '4px',
                    }}
                  />
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                  }}
                >
                  {item.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Chart Placeholder */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📊</div>
          <div
            style={{
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: '600',
              marginBottom: '8px',
              textAlign: 'center',
            }}
          >
            Revenue Trend Chart
          </div>
          <div
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.9rem',
              textAlign: 'center',
            }}
          >
            Interactive chart showing revenue trends, forecasting, and
            performance metrics over time.
          </div>
          <button
            style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '16px',
            }}
          >
            📈 View Detailed Chart
          </button>
        </div>
      </div>
    </div>
  );

  const renderTeamPerformance = () => (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        marginBottom: '24px',
      }}
    >
      <h3
        style={{
          color: 'white',
          fontSize: '1.4rem',
          fontWeight: '600',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        👥 Team Performance Analytics
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
        {analyticsData.teamMetrics?.map((member: any, index: number) => (
          <div
            key={index}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative',
            }}
          >
            {/* Performance Badge */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background:
                  member.performance === 'Outstanding'
                    ? '#22c55e'
                    : member.performance === 'Excellent'
                      ? '#3b82f6'
                      : '#f59e0b',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: '600',
              }}
            >
              {member.performance}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  marginBottom: '4px',
                }}
              >
                {member.name}
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.9rem',
                }}
              >
                {member.role}
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                marginBottom: '16px',
              }}
            >
              <div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.8rem',
                    marginBottom: '4px',
                  }}
                >
                  Revenue
                </div>
                <div
                  style={{
                    color: '#22c55e',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                  }}
                >
                  {member.revenue}
                </div>
              </div>
              <div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.8rem',
                    marginBottom: '4px',
                  }}
                >
                  Deals Closed
                </div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                  }}
                >
                  {member.deals}
                </div>
              </div>
              <div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.8rem',
                    marginBottom: '4px',
                  }}
                >
                  Conversion Rate
                </div>
                <div
                  style={{
                    color: '#3b82f6',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                  }}
                >
                  {member.conversionRate}
                </div>
              </div>
              <div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.8rem',
                    marginBottom: '4px',
                  }}
                >
                  AI Score
                </div>
                <div
                  style={{
                    color: '#8b5cf6',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                  }}
                >
                  {member.aiScore}%
                </div>
              </div>
            </div>

            {/* AI Score Progress Bar */}
            <div style={{ marginBottom: '12px' }}>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.8rem',
                  marginBottom: '4px',
                }}
              >
                AI Performance Score
              </div>
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${member.aiScore}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, #8b5cf6, #7c3aed)`,
                    borderRadius: '4px',
                  }}
                />
              </div>
            </div>

            <button
              style={{
                background: 'linear-gradient(135deg, #334155, #475569)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              📊 View Detailed Analytics
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderForecastingAndInsights = () => (
    <div
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}
    >
      {/* Sales Forecasting */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3
          style={{
            color: 'white',
            fontSize: '1.4rem',
            fontWeight: '600',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          🔮 Sales Forecasting
        </h3>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.9rem',
                marginBottom: '8px',
              }}
            >
              Next Month Forecast
            </div>
            <div
              style={{
                color: '#22c55e',
                fontSize: '2rem',
                fontWeight: '700',
                marginBottom: '4px',
              }}
            >
              {analyticsData.forecasting?.nextMonth}
            </div>
            <div
              style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}
            >
              Confidence:{' '}
              <span style={{ color: '#3b82f6', fontWeight: '600' }}>
                {analyticsData.forecasting?.confidence}
              </span>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.9rem',
                marginBottom: '8px',
              }}
            >
              Next Quarter Forecast
            </div>
            <div
              style={{ color: '#3b82f6', fontSize: '2rem', fontWeight: '700' }}
            >
              {analyticsData.forecasting?.nextQuarter}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h4
            style={{
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: '600',
              marginBottom: '12px',
            }}
          >
            Risk Factors
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {analyticsData.forecasting?.riskFactors?.map(
              (risk: string, index: number) => (
                <div
                  key={index}
                  style={{
                    padding: '8px 12px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: '6px',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.85rem',
                  }}
                >
                  ⚠️ {risk}
                </div>
              )
            )}
          </div>
        </div>

        <div>
          <h4
            style={{
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: '600',
              marginBottom: '12px',
            }}
          >
            Opportunities
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {analyticsData.forecasting?.opportunities?.map(
              (opportunity: string, index: number) => (
                <div
                  key={index}
                  style={{
                    padding: '8px 12px',
                    background: 'rgba(34, 197, 94, 0.1)',
                    borderRadius: '6px',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.85rem',
                  }}
                >
                  💡 {opportunity}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3
          style={{
            color: 'white',
            fontSize: '1.4rem',
            fontWeight: '600',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          🤖 AI-Powered Insights
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {analyticsData.aiInsights?.map((insight: any, index: number) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '20px',
                border: `1px solid ${
                  insight.impact === 'High'
                    ? 'rgba(239, 68, 68, 0.3)'
                    : insight.type === 'Opportunity'
                      ? 'rgba(34, 197, 94, 0.3)'
                      : 'rgba(255, 255, 255, 0.1)'
                }`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <div
                  style={{
                    background:
                      insight.type === 'Opportunity'
                        ? '#22c55e'
                        : insight.type === 'Risk'
                          ? '#ef4444'
                          : '#3b82f6',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                  }}
                >
                  {insight.type}
                </div>
                <div
                  style={{
                    background:
                      insight.impact === 'High' ? '#ef4444' : '#f59e0b',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                  }}
                >
                  {insight.impact} Impact
                </div>
              </div>

              <div
                style={{
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: '8px',
                }}
              >
                {insight.title}
              </div>

              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.9rem',
                  marginBottom: '12px',
                }}
              >
                {insight.description}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.8rem',
                  }}
                >
                  Confidence:{' '}
                  <span style={{ color: '#22c55e', fontWeight: '600' }}>
                    {insight.confidence}%
                  </span>
                </div>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Take Action
                </button>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: '24px',
            padding: '16px',
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(139, 92, 246, 0.2)',
          }}
        >
          <h4
            style={{
              color: '#8b5cf6',
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            🧠 AI Analysis Status
          </h4>
          <div
            style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}
          >
            AI models are continuously analyzing sales patterns, customer
            behavior, and market trends to provide real-time insights and
            recommendations.
          </div>
          <button
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '12px',
            }}
          >
            🔍 View Detailed Analysis
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '32px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb, #1d4ed8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px',
          }}
        >
          📊 Sales Analytics Dashboard
        </h1>
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1.1rem',
            margin: '0',
          }}
        >
          Comprehensive Performance Analysis • AI-Powered Insights • Predictive
          Forecasting
        </p>
      </div>

      {/* Time Range Selector */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '4px',
            display: 'flex',
            gap: '4px',
          }}
        >
          {['7d', '30d', '90d', '1y'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                background:
                  timeRange === range
                    ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                    : 'transparent',
                color:
                  timeRange === range ? 'white' : 'rgba(255, 255, 255, 0.7)',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {range === '7d'
                ? '7 Days'
                : range === '30d'
                  ? '30 Days'
                  : range === '90d'
                    ? '90 Days'
                    : '1 Year'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      {renderKPICards()}

      {/* Revenue Breakdown */}
      {renderRevenueBreakdown()}

      {/* Team Performance */}
      {renderTeamPerformance()}

      {/* Forecasting and AI Insights */}
      {renderForecastingAndInsights()}

      {/* Export and Actions */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          marginTop: '24px',
          textAlign: 'center',
        }}
      >
        <h3
          style={{
            color: 'white',
            fontSize: '1.2rem',
            fontWeight: '600',
            marginBottom: '20px',
          }}
        >
          📈 Analytics Actions
        </h3>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <button
            style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            📊 Export Report
          </button>
          <button
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            📧 Schedule Email
          </button>
          <button
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            🤖 AI Recommendations
          </button>
          <button
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            📅 Create Action Plan
          </button>
        </div>
      </div>
    </div>
  );
}
