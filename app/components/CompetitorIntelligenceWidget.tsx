'use client';

import { useEffect, useState } from 'react';
import { useFeatureFlag } from '../config/feature-flags';

interface CompetitorAnalysis {
  result: {
    name: string;
    marketShare?: number;
    strengths: string[];
    weaknesses: string[];
    pricingStrategy: string;
    serviceAreas: string[];
    customerBase: string[];
    technologyStack: string[];
    recentNews: string[];
  };
  confidence: number;
  reasoning: string;
  recommendations: string[];
  riskFactors: string[];
  competitivePosition: 'leader' | 'challenger' | 'follower' | 'niche';
  marketOpportunities: string[];
  threatLevel: 'low' | 'medium' | 'high';
  recommendedActions: string[];
}

interface MarketIntelligence {
  totalMarketSize: number;
  marketGrowth: number;
  keyTrends: string[];
  emergingTechnologies: string[];
  regulatoryChanges: string[];
  customerPreferences: string[];
}

export default function CompetitorIntelligenceWidget() {
  const isEnabled = useFeatureFlag('COMPETITOR_INTELLIGENCE');
  const [loading, setLoading] = useState(false);
  const [competitorName, setCompetitorName] = useState('');
  const [analysis, setAnalysis] = useState<CompetitorAnalysis | null>(null);
  const [marketIntelligence, setMarketIntelligence] =
    useState<MarketIntelligence | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load market intelligence on component mount
  useEffect(() => {
    if (isEnabled) {
      loadMarketIntelligence();
    }
  }, [isEnabled]);

  const loadMarketIntelligence = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/competitor?action=market');
      const data = await response.json();

      if (data.success) {
        setMarketIntelligence(data.data);
      } else {
        setError(data.error || 'Failed to load market intelligence');
      }
    } catch (error) {
      setError('Failed to load market intelligence');
    } finally {
      setLoading(false);
    }
  };

  const analyzeCompetitor = async () => {
    if (!competitorName.trim()) {
      setError('Please enter a competitor name');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/analytics/competitor?action=analyze&competitor=${encodeURIComponent(competitorName)}`
      );
      const data = await response.json();

      if (data.success) {
        setAnalysis(data.data);
      } else {
        setError(data.error || 'Failed to analyze competitor');
      }
    } catch (error) {
      setError('Failed to analyze competitor');
    } finally {
      setLoading(false);
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flexShrink: 0 }}>
            <svg
              style={{ height: '20px', width: '20px', color: '#fbbf24' }}
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div style={{ marginLeft: '12px' }}>
            <h3
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '8px',
              }}
            >
              Competitor Intelligence Feature Disabled
            </h3>
            <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
              <p>
                Enable this feature by setting
                ENABLE_COMPETITOR_INTELLIGENCE=true in your environment
                variables.
              </p>
            </div>
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
        <h2
          style={{
            fontSize: '20px',
            fontWeight: '600',
            color: 'white',
            margin: 0,
          }}
        >
          🎯 Competitor Intelligence
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              height: '8px',
              width: '8px',
              borderRadius: '50%',
              background: '#10b981',
            }}
          ></div>
          <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
            Active
          </span>
        </div>
      </div>

      {/* Market Intelligence Overview */}
      {marketIntelligence && (
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            padding: '16px',
            marginBottom: '24px',
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '12px',
            }}
          >
            📊 Market Overview
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '16px',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#3b82f6',
                }}
              >
                ${(marketIntelligence.totalMarketSize / 1000000000).toFixed(1)}B
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
                Total Market Size
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#10b981',
                }}
              >
                {(marketIntelligence.marketGrowth * 100).toFixed(1)}%
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
                Market Growth
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#8b5cf6',
                }}
              >
                {marketIntelligence.keyTrends.length}
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
                Key Trends
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#f97316',
                }}
              >
                {marketIntelligence.emergingTechnologies.length}
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
                Emerging Tech
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Competitor Analysis */}
      <div style={{ marginBottom: '24px' }}>
        <h3
          style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '12px',
          }}
        >
          🔍 Competitor Analysis
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type='text'
            value={competitorName}
            onChange={(e) => setCompetitorName(e.target.value)}
            placeholder='Enter competitor name...'
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '12px',
              color: 'white',
              fontSize: '14px',
              outline: 'none',
            }}
          />
          <button
            onClick={analyzeCompetitor}
            disabled={loading}
            style={{
              background: loading
                ? 'rgba(107, 114, 128, 0.5)'
                : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 16px',
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
      </div>

      {/* Error Display */}
      {error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '12px',
            padding: '12px',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flexShrink: 0 }}>
              <svg
                style={{ height: '20px', width: '20px', color: '#ef4444' }}
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div style={{ marginLeft: '12px' }}>
              <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '16px',
            }}
          >
            {/* Competitor Overview */}
            <div
              style={{
                background: 'rgba(107, 114, 128, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(107, 114, 128, 0.2)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <h4
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '8px',
                }}
              >
                {analysis.result.name}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {analysis.result.marketShare && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
                      Market Share:
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>
                      {analysis.result.marketShare.toFixed(1)}%
                    </span>
                  </div>
                )}
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600'>Position:</span>
                  <span
                    className={`rounded px-2 py-1 text-sm font-medium capitalize ${
                      analysis.competitivePosition === 'leader'
                        ? 'bg-green-100 text-green-800'
                        : analysis.competitivePosition === 'challenger'
                          ? 'bg-yellow-100 text-yellow-800'
                          : analysis.competitivePosition === 'follower'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {analysis.competitivePosition}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600'>Threat Level:</span>
                  <span
                    className={`rounded px-2 py-1 text-sm font-medium ${
                      analysis.threatLevel === 'high'
                        ? 'bg-red-100 text-red-800'
                        : analysis.threatLevel === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {analysis.threatLevel}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600'>Confidence:</span>
                  <span className='text-sm font-medium'>
                    {(analysis.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <h5
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#10b981',
                    marginBottom: '4px',
                  }}
                >
                  Strengths
                </h5>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {analysis.result.strengths.map((strength, index) => (
                    <li
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      <span style={{ marginRight: '8px', color: '#10b981' }}>✓</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#ef4444',
                    marginBottom: '4px',
                  }}
                >
                  Weaknesses
                </h5>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {analysis.result.weaknesses.map((weakness, index) => (
                    <li
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      <span style={{ marginRight: '8px', color: '#ef4444' }}>✗</span>
                      {weakness}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {analysis.recommendedActions.length > 0 && (
            <div
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <h4
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '8px',
                }}
              >
                💡 Recommended Actions
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {analysis.recommendedActions.map((action, index) => (
                  <li
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    <span style={{ marginRight: '8px', color: '#3b82f6' }}>→</span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Market Opportunities */}
          {analysis.marketOpportunities.length > 0 && (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <h4
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '8px',
                }}
              >
                🎯 Market Opportunities
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {analysis.marketOpportunities.map((opportunity, index) => (
                  <li
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    <span style={{ marginRight: '8px', color: '#10b981' }}>→</span>
                    {opportunity}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
