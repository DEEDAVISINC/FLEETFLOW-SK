'use client';

import { useEffect, useState } from 'react';
import { useFeatureFlag } from '../config/feature-flags';

interface CustomerData {
  customerId: string;
  customerName: string;
  totalRevenue: number;
  loadCount: number;
  averageRate: number;
  lastLoadDate: string;
  daysSinceLastLoad: number;
  customerType: 'premium' | 'standard' | 'occasional';
  serviceAreas: string[];
  preferredCarriers: string[];
  paymentHistory: {
    onTime: number;
    late: number;
    averageDaysToPay: number;
  };
  communicationHistory: {
    inquiries: number;
    complaints: number;
    compliments: number;
    lastContact: string;
  };
}

interface RetentionAnalysis {
  result: CustomerData;
  confidence: number;
  reasoning: string;
  recommendations: string[];
  riskFactors: string[];
  retentionRisk: 'low' | 'medium' | 'high';
  churnProbability: number;
  lifetimeValue: number;
  retentionStrategies: string[];
  upsellOpportunities: string[];
  customerSatisfaction: number;
  loyaltyScore: number;
}

interface RetentionMetrics {
  overallRetentionRate: number;
  averageCustomerLifetime: number;
  churnRate: number;
  revenueAtRisk: number;
  topRetentionFactors: string[];
  improvementAreas: string[];
}

interface CustomerSegment {
  segmentName: string;
  customerCount: number;
  averageRevenue: number;
  retentionRate: number;
  churnRisk: 'low' | 'medium' | 'high';
  recommendedActions: string[];
}

export default function CustomerRetentionWidget() {
  const isEnabled = useFeatureFlag('CUSTOMER_RETENTION_ANALYSIS');
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [analysis, setAnalysis] = useState<RetentionAnalysis | null>(null);
  const [metrics, setMetrics] = useState<RetentionMetrics | null>(null);
  const [segments, setSegments] = useState<CustomerSegment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'analysis' | 'segments'
  >('overview');

  useEffect(() => {
    if (isEnabled) {
      loadRetentionMetrics();
      loadCustomerSegments();
    }
  }, [isEnabled]);

  const loadRetentionMetrics = async () => {
    try {
      const response = await fetch('/api/analytics/retention?action=metrics');
      const data = await response.json();
      if (data.success) {
        setMetrics(data.data);
      }
    } catch (error) {
      console.error('Error loading retention metrics:', error);
    }
  };

  const loadCustomerSegments = async () => {
    try {
      const response = await fetch('/api/analytics/retention?action=segments');
      const data = await response.json();
      if (data.success) {
        setSegments(data.data);
      }
    } catch (error) {
      console.error('Error loading customer segments:', error);
    }
  };

  const analyzeCustomer = async () => {
    if (!customerId.trim()) {
      setError('Please enter a customer ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/analytics/retention?action=analyze&customerId=${customerId}`
      );
      const data = await response.json();

      if (data.success) {
        setAnalysis(data.data);
        setActiveTab('analysis');
      } else {
        setError(data.error || 'Analysis failed');
      }
    } catch (error) {
      setError('Failed to analyze customer retention');
      console.error('Error analyzing customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'high':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  if (!isEnabled) {
    return (
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '20px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '24px' }}>📊</div>
          <div>
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '4px',
              }}
            >
              Customer Retention Analysis
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
              }}
            >
              Enable ENABLE_CUSTOMER_RETENTION_ANALYSIS=true to access customer
              retention insights
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '24px',
        marginBottom: '20px',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '32px' }}>📊</div>
          <div>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'white',
                margin: 0,
                marginBottom: '4px',
              }}
            >
              Customer Retention Analysis
            </h2>
            <p
              style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
              }}
            >
              Analyze customer behavior and retention strategies
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '24px',
        }}
      >
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            flex: 1,
            background:
              activeTab === 'overview'
                ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                : 'rgba(255, 255, 255, 0.05)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(10px)',
          }}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('analysis')}
          style={{
            flex: 1,
            background:
              activeTab === 'analysis'
                ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                : 'rgba(255, 255, 255, 0.05)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(10px)',
          }}
        >
          Customer Analysis
        </button>
        <button
          onClick={() => setActiveTab('segments')}
          style={{
            flex: 1,
            background:
              activeTab === 'segments'
                ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                : 'rgba(255, 255, 255, 0.05)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(10px)',
          }}
        >
          Segments
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && metrics && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '16px',
            }}
          >
            <div
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#3b82f6',
                  marginBottom: '4px',
                }}
              >
                {metrics.overallRetentionRate}%
              </div>
              <div
                style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}
              >
                Retention Rate
              </div>
            </div>
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#10b981',
                  marginBottom: '4px',
                }}
              >
                {metrics.averageCustomerLifetime} years
              </div>
              <div
                style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}
              >
                Avg. Lifetime
              </div>
            </div>
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#ef4444',
                  marginBottom: '4px',
                }}
              >
                {metrics.churnRate}%
              </div>
              <div
                style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}
              >
                Churn Rate
              </div>
            </div>
            <div
              style={{
                background: 'rgba(249, 115, 22, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(249, 115, 22, 0.2)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#f97316',
                  marginBottom: '4px',
                }}
              >
                ${(metrics.revenueAtRisk / 1000).toFixed(0)}K
              </div>
              <div
                style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}
              >
                Revenue at Risk
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '12px',
                }}
              >
                Top Retention Factors
              </h3>
              <ul
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                {metrics.topRetentionFactors.map((factor, index) => (
                  <li
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    <div
                      style={{
                        height: '8px',
                        width: '8px',
                        borderRadius: '50%',
                        background: '#10b981',
                      }}
                    ></div>
                    {factor}
                  </li>
                ))}
              </ul>
            </div>

            <div
              style={{
                background: 'rgba(249, 115, 22, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(249, 115, 22, 0.2)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '12px',
                }}
              >
                Improvement Areas
              </h3>
              <ul
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                {metrics.improvementAreas.map((area, index) => (
                  <li
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    <div
                      style={{
                        height: '8px',
                        width: '8px',
                        borderRadius: '50%',
                        background: '#f97316',
                      }}
                    ></div>
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Customer Analysis Tab */}
      {activeTab === 'analysis' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <input
              type='text'
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder='Enter Customer ID'
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '12px 16px',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            <button
              onClick={analyzeCustomer}
              disabled={loading}
              style={{
                background: loading
                  ? 'rgba(107, 114, 128, 0.5)'
                  : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(10px)',
              }}
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>

          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}

          {analysis && (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(107, 114, 128, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(107, 114, 128, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: 'white',
                      marginBottom: '4px',
                    }}
                  >
                    {analysis.result.customerName}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Customer
                  </div>
                </div>
                <div
                  style={{
                    background:
                      analysis.retentionRisk === 'high'
                        ? 'rgba(239, 68, 68, 0.1)'
                        : analysis.retentionRisk === 'medium'
                          ? 'rgba(245, 158, 11, 0.1)'
                          : 'rgba(16, 185, 129, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${
                      analysis.retentionRisk === 'high'
                        ? 'rgba(239, 68, 68, 0.2)'
                        : analysis.retentionRisk === 'medium'
                          ? 'rgba(245, 158, 11, 0.2)'
                          : 'rgba(16, 185, 129, 0.2)'
                    }`,
                    borderRadius: '12px',
                    padding: '16px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color:
                        analysis.retentionRisk === 'high'
                          ? '#ef4444'
                          : analysis.retentionRisk === 'medium'
                            ? '#f59e0b'
                            : '#10b981',
                      marginBottom: '4px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {analysis.retentionRisk.toUpperCase()}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Risk Level
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#ef4444',
                      marginBottom: '4px',
                    }}
                  >
                    {analysis.churnProbability}%
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Churn Probability
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#10b981',
                      marginBottom: '4px',
                    }}
                  >
                    ${(analysis.lifetimeValue / 1000).toFixed(0)}K
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Lifetime Value
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '24px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '12px',
                    }}
                  >
                    Retention Strategies
                  </h3>
                  <ul
                    style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                  >
                    {analysis.retentionStrategies.map((strategy, index) => (
                      <li
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        <div
                          style={{
                            height: '8px',
                            width: '8px',
                            borderRadius: '50%',
                            background: '#3b82f6',
                          }}
                        ></div>
                        {strategy}
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '12px',
                    }}
                  >
                    Upsell Opportunities
                  </h3>
                  <ul
                    style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                  >
                    {analysis.upsellOpportunities.map((opportunity, index) => (
                      <li
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        <div
                          style={{
                            height: '8px',
                            width: '8px',
                            borderRadius: '50%',
                            background: '#10b981',
                          }}
                        ></div>
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(107, 114, 128, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(107, 114, 128, 0.2)',
                  borderRadius: '12px',
                  padding: '16px',
                }}
              >
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '12px',
                  }}
                >
                  AI Analysis
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: '1.5',
                    marginBottom: '12px',
                  }}
                >
                  {analysis.reasoning}
                </p>
                <div
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  Confidence: {analysis.confidence}%
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Segments Tab */}
      {activeTab === 'segments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '16px',
            }}
          >
            {segments.map((segment, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'white',
                    }}
                  >
                    {segment.segmentName}
                  </h3>
                  <div
                    style={{
                      background: getRiskColor(segment.churnRisk),
                      color: 'white',
                      borderRadius: '20px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    {segment.churnRisk.toUpperCase()}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    marginBottom: '16px',
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
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      Customers:
                    </span>
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'white',
                      }}
                    >
                      {segment.customerCount}
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
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      Avg Revenue:
                    </span>
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'white',
                      }}
                    >
                      ${(segment.averageRevenue / 1000).toFixed(0)}K
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
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      Retention Rate:
                    </span>
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'white',
                      }}
                    >
                      {segment.retentionRate}%
                    </span>
                  </div>
                </div>

                <div>
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '8px',
                    }}
                  >
                    Recommended Actions:
                  </h4>
                  <ul
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    {segment.recommendedActions.map((action, actionIndex) => (
                      <li
                        key={actionIndex}
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.7)',
                          paddingLeft: '8px',
                        }}
                      >
                        • {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
