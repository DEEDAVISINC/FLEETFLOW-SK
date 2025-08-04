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
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
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
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
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
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
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
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
                Revenue at Risk
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='rounded-lg border border-gray-200 p-4'>
              <h3 className='mb-3 font-semibold text-gray-900'>
                Top Retention Factors
              </h3>
              <ul className='space-y-2'>
                {metrics.topRetentionFactors.map((factor, index) => (
                  <li
                    key={index}
                    className='flex items-center gap-2 text-sm text-gray-600'
                  >
                    <div className='h-2 w-2 rounded-full bg-green-500'></div>
                    {factor}
                  </li>
                ))}
              </ul>
            </div>

            <div className='rounded-lg border border-gray-200 p-4'>
              <h3 className='mb-3 font-semibold text-gray-900'>
                Improvement Areas
              </h3>
              <ul className='space-y-2'>
                {metrics.improvementAreas.map((area, index) => (
                  <li
                    key={index}
                    className='flex items-center gap-2 text-sm text-gray-600'
                  >
                    <div className='h-2 w-2 rounded-full bg-orange-500'></div>
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
            <div className='space-y-6'>
              <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                <div className='rounded-lg bg-gray-50 p-4'>
                  <div className='text-lg font-bold text-gray-900'>
                    {analysis.result.customerName}
                  </div>
                  <div className='text-sm text-gray-600'>Customer</div>
                </div>
                <div className='rounded-lg bg-gray-50 p-4'>
                  <div className='text-lg font-bold text-gray-900'>
                    {analysis.retentionRisk.toUpperCase()}
                  </div>
                  <div className='text-sm text-gray-600'>Risk Level</div>
                </div>
                <div className='rounded-lg bg-gray-50 p-4'>
                  <div className='text-lg font-bold text-gray-900'>
                    {analysis.churnProbability}%
                  </div>
                  <div className='text-sm text-gray-600'>Churn Probability</div>
                </div>
                <div className='rounded-lg bg-gray-50 p-4'>
                  <div className='text-lg font-bold text-gray-900'>
                    ${(analysis.lifetimeValue / 1000).toFixed(0)}K
                  </div>
                  <div className='text-sm text-gray-600'>Lifetime Value</div>
                </div>
              </div>

              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='rounded-lg border border-gray-200 p-4'>
                  <h3 className='mb-3 font-semibold text-gray-900'>
                    Retention Strategies
                  </h3>
                  <ul className='space-y-2'>
                    {analysis.retentionStrategies.map((strategy, index) => (
                      <li
                        key={index}
                        className='flex items-center gap-2 text-sm text-gray-600'
                      >
                        <div className='h-2 w-2 rounded-full bg-blue-500'></div>
                        {strategy}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className='rounded-lg border border-gray-200 p-4'>
                  <h3 className='mb-3 font-semibold text-gray-900'>
                    Upsell Opportunities
                  </h3>
                  <ul className='space-y-2'>
                    {analysis.upsellOpportunities.map((opportunity, index) => (
                      <li
                        key={index}
                        className='flex items-center gap-2 text-sm text-gray-600'
                      >
                        <div className='h-2 w-2 rounded-full bg-green-500'></div>
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className='rounded-lg border border-gray-200 p-4'>
                <h3 className='mb-3 font-semibold text-gray-900'>
                  AI Analysis
                </h3>
                <p className='text-sm text-gray-600'>{analysis.reasoning}</p>
                <div className='mt-3 text-xs text-gray-500'>
                  Confidence: {analysis.confidence}%
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Segments Tab */}
      {activeTab === 'segments' && (
        <div className='space-y-6'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            {segments.map((segment, index) => (
              <div
                key={index}
                className='rounded-lg border border-gray-200 p-4'
              >
                <div className='mb-3 flex items-center justify-between'>
                  <h3 className='font-semibold text-gray-900'>
                    {segment.segmentName}
                  </h3>
                  <div
                    className='rounded-full px-2 py-1 text-xs font-medium text-white'
                    style={{ backgroundColor: getRiskColor(segment.churnRisk) }}
                  >
                    {segment.churnRisk.toUpperCase()}
                  </div>
                </div>

                <div className='mb-4 space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600'>Customers:</span>
                    <span className='font-medium'>{segment.customerCount}</span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600'>Avg Revenue:</span>
                    <span className='font-medium'>
                      ${(segment.averageRevenue / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600'>Retention Rate:</span>
                    <span className='font-medium'>
                      {segment.retentionRate}%
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className='mb-2 text-sm font-medium text-gray-900'>
                    Recommended Actions:
                  </h4>
                  <ul className='space-y-1'>
                    {segment.recommendedActions.map((action, actionIndex) => (
                      <li key={actionIndex} className='text-xs text-gray-600'>
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
