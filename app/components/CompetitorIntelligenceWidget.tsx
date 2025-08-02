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
      <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
        <div className='flex items-center'>
          <div className='flex-shrink-0'>
            <svg
              className='h-5 w-5 text-yellow-400'
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
          <div className='ml-3'>
            <h3 className='text-sm font-medium text-yellow-800'>
              Competitor Intelligence Feature Disabled
            </h3>
            <div className='mt-2 text-sm text-yellow-700'>
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
    <div className='rounded-lg bg-white p-6 shadow-lg'>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-gray-900'>
          🎯 Competitor Intelligence
        </h2>
        <div className='flex items-center space-x-2'>
          <div className='h-2 w-2 rounded-full bg-green-400'></div>
          <span className='text-sm text-gray-500'>Active</span>
        </div>
      </div>

      {/* Market Intelligence Overview */}
      {marketIntelligence && (
        <div className='mb-6 rounded-lg bg-blue-50 p-4'>
          <h3 className='mb-3 text-lg font-medium text-blue-900'>
            📊 Market Overview
          </h3>
          <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
            <div>
              <div className='text-2xl font-bold text-blue-600'>
                ${(marketIntelligence.totalMarketSize / 1000000000).toFixed(1)}B
              </div>
              <div className='text-sm text-blue-700'>Total Market Size</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-green-600'>
                {(marketIntelligence.marketGrowth * 100).toFixed(1)}%
              </div>
              <div className='text-sm text-green-700'>Market Growth</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-purple-600'>
                {marketIntelligence.keyTrends.length}
              </div>
              <div className='text-sm text-purple-700'>Key Trends</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-orange-600'>
                {marketIntelligence.emergingTechnologies.length}
              </div>
              <div className='text-sm text-orange-700'>Emerging Tech</div>
            </div>
          </div>
        </div>
      )}

      {/* Competitor Analysis */}
      <div className='mb-6'>
        <h3 className='mb-3 text-lg font-medium text-gray-900'>
          🔍 Competitor Analysis
        </h3>
        <div className='flex space-x-2'>
          <input
            type='text'
            value={competitorName}
            onChange={(e) => setCompetitorName(e.target.value)}
            placeholder='Enter competitor name...'
            className='flex-1 rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
          />
          <button
            onClick={analyzeCompetitor}
            disabled={loading}
            className='rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50'
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className='mb-4 rounded-md border border-red-200 bg-red-50 p-3'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <svg
                className='h-5 w-5 text-red-400'
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
            <div className='ml-3'>
              <p className='text-sm text-red-700'>{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {/* Competitor Overview */}
            <div className='rounded-lg bg-gray-50 p-4'>
              <h4 className='mb-2 font-medium text-gray-900'>
                {analysis.result.name}
              </h4>
              <div className='space-y-2'>
                {analysis.result.marketShare && (
                  <div className='flex justify-between'>
                    <span className='text-sm text-gray-600'>Market Share:</span>
                    <span className='text-sm font-medium'>
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
            <div className='space-y-3'>
              <div>
                <h5 className='mb-1 text-sm font-medium text-green-700'>
                  Strengths
                </h5>
                <ul className='space-y-1 text-sm text-gray-600'>
                  {analysis.result.strengths.map((strength, index) => (
                    <li key={index} className='flex items-start'>
                      <span className='mr-2 text-green-500'>✓</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className='mb-1 text-sm font-medium text-red-700'>
                  Weaknesses
                </h5>
                <ul className='space-y-1 text-sm text-gray-600'>
                  {analysis.result.weaknesses.map((weakness, index) => (
                    <li key={index} className='flex items-start'>
                      <span className='mr-2 text-red-500'>✗</span>
                      {weakness}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {analysis.recommendedActions.length > 0 && (
            <div className='rounded-lg bg-blue-50 p-4'>
              <h4 className='mb-2 font-medium text-blue-900'>
                💡 Recommended Actions
              </h4>
              <ul className='space-y-1 text-sm text-blue-800'>
                {analysis.recommendedActions.map((action, index) => (
                  <li key={index} className='flex items-start'>
                    <span className='mr-2 text-blue-500'>→</span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Market Opportunities */}
          {analysis.marketOpportunities.length > 0 && (
            <div className='rounded-lg bg-green-50 p-4'>
              <h4 className='mb-2 font-medium text-green-900'>
                🎯 Market Opportunities
              </h4>
              <ul className='space-y-1 text-sm text-green-800'>
                {analysis.marketOpportunities.map((opportunity, index) => (
                  <li key={index} className='flex items-start'>
                    <span className='mr-2 text-green-500'>→</span>
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
