'use client';

import { useEffect, useState } from 'react';
import { useFeatureFlag } from '../config/feature-flags';

interface LoadParameters {
  origin: string;
  destination: string;
  distance: number;
  equipmentType: string;
  weight: number;
  urgency: 'standard' | 'expedited' | 'rush';
  specialRequirements: string[];
  marketSegment: 'spot' | 'contract' | 'dedicated';
}

interface MarketConditions {
  currentFuelPrice: number;
  capacityUtilization: number;
  seasonalDemand: number;
  competitorRates: number[];
  laneCongestion: number;
  weatherImpact: number;
  economicIndicators: {
    gdpGrowth: number;
    inflationRate: number;
    unemploymentRate: number;
  };
}

interface RateOptimization {
  result: LoadParameters;
  confidence: number;
  reasoning: string;
  recommendations: string[];
  riskFactors: string[];
  recommendedRate: number;
  rateRange: {
    min: number;
    max: number;
    optimal: number;
  };
  marketPosition: 'aggressive' | 'competitive' | 'premium';
  confidenceLevel: number;
  pricingFactors: {
    fuelCost: number;
    capacityPressure: number;
    seasonalAdjustment: number;
    competitorInfluence: number;
    urgencyMultiplier: number;
  };
  riskAssessment: {
    rateRisk: 'low' | 'medium' | 'high';
    capacityRisk: 'low' | 'medium' | 'high';
    marketRisk: 'low' | 'medium' | 'high';
  };
  recommendations: string[];
}

interface MarketIntelligence {
  averageSpotRate: number;
  rateTrend: 'increasing' | 'decreasing' | 'stable';
  capacityAvailability: number;
  demandForecast: number;
  hotLanes: string[];
  coldLanes: string[];
  rateVolatility: number;
}

interface PricingStrategy {
  strategyName: string;
  description: string;
  targetRate: number;
  expectedMargin: number;
  riskLevel: 'low' | 'medium' | 'high';
  marketConditions: string[];
}

export default function SpotRateOptimizationWidget() {
  const isEnabled = useFeatureFlag('SPOT_RATE_OPTIMIZATION');
  const [loading, setLoading] = useState(false);
  const [optimization, setOptimization] = useState<RateOptimization | null>(
    null
  );
  const [marketIntelligence, setMarketIntelligence] =
    useState<MarketIntelligence | null>(null);
  const [strategies, setStrategies] = useState<PricingStrategy[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'optimize' | 'market' | 'strategies'
  >('optimize');

  // Form state
  const [loadParams, setLoadParams] = useState<LoadParameters>({
    origin: '',
    destination: '',
    distance: 0,
    equipmentType: 'dry-van',
    weight: 0,
    urgency: 'standard',
    specialRequirements: [],
    marketSegment: 'spot',
  });

  const [marketConditions, setMarketConditions] = useState<MarketConditions>({
    currentFuelPrice: 3.85,
    capacityUtilization: 0.75,
    seasonalDemand: 1.1,
    competitorRates: [2800, 2900, 2850, 2750],
    laneCongestion: 0.6,
    weatherImpact: 0.05,
    economicIndicators: {
      gdpGrowth: 2.1,
      inflationRate: 2.8,
      unemploymentRate: 3.9,
    },
  });

  useEffect(() => {
    if (isEnabled) {
      loadMarketIntelligence();
    }
  }, [isEnabled]);

  const loadMarketIntelligence = async () => {
    try {
      const response = await fetch(
        '/api/analytics/spot-rate?action=market-intelligence'
      );
      const data = await response.json();
      if (data.success) {
        setMarketIntelligence(data.data);
      }
    } catch (error) {
      console.error('Error loading market intelligence:', error);
    }
  };

  const optimizeRate = async () => {
    if (
      !loadParams.origin ||
      !loadParams.destination ||
      loadParams.distance === 0
    ) {
      setError('Please fill in all required load parameters');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analytics/spot-rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'optimize-rate',
          loadParams,
          marketConditions,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOptimization(data.data);
        setActiveTab('optimize');
      } else {
        setError(data.error || 'Rate optimization failed');
      }
    } catch (error) {
      setError('Failed to optimize rate');
      console.error('Error optimizing rate:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateStrategies = async () => {
    if (!loadParams.origin || !loadParams.destination) {
      setError('Please fill in origin and destination');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analytics/spot-rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'pricing-strategies',
          loadParams,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStrategies(data.data);
        setActiveTab('strategies');
      } else {
        setError(data.error || 'Failed to generate strategies');
      }
    } catch (error) {
      setError('Failed to generate pricing strategies');
      console.error('Error generating strategies:', error);
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

  const getPositionColor = (
    position: 'aggressive' | 'competitive' | 'premium'
  ) => {
    switch (position) {
      case 'aggressive':
        return '#ef4444';
      case 'competitive':
        return '#f59e0b';
      case 'premium':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  if (!isEnabled) {
    return (
      <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
        <div className='flex items-center gap-3'>
          <div className='text-2xl'>💰</div>
          <div>
            <h3 className='font-semibold text-yellow-800'>
              Spot Rate Optimization
            </h3>
            <p className='text-sm text-yellow-700'>
              Enable ENABLE_SPOT_RATE_OPTIMIZATION=true to access rate
              optimization features
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='rounded-lg bg-white p-6 shadow-lg'>
      <div className='mb-6 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='text-3xl'>💰</div>
          <div>
            <h2 className='text-xl font-bold text-gray-900'>
              Spot Rate Optimization
            </h2>
            <p className='text-sm text-gray-600'>
              Optimize rates based on market conditions
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className='mb-6 flex space-x-1 rounded-lg bg-gray-100 p-1'>
        <button
          onClick={() => setActiveTab('optimize')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'optimize'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Rate Optimization
        </button>
        <button
          onClick={() => setActiveTab('market')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'market'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Market Intelligence
        </button>
        <button
          onClick={() => setActiveTab('strategies')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'strategies'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pricing Strategies
        </button>
      </div>

      {/* Rate Optimization Tab */}
      {activeTab === 'optimize' && (
        <div className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {/* Load Parameters */}
            <div className='space-y-4'>
              <h3 className='font-semibold text-gray-900'>Load Parameters</h3>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Origin
                  </label>
                  <input
                    type='text'
                    value={loadParams.origin}
                    onChange={(e) =>
                      setLoadParams({ ...loadParams, origin: e.target.value })
                    }
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                    placeholder='e.g., ATL'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Destination
                  </label>
                  <input
                    type='text'
                    value={loadParams.destination}
                    onChange={(e) =>
                      setLoadParams({
                        ...loadParams,
                        destination: e.target.value,
                      })
                    }
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                    placeholder='e.g., LAX'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Distance (miles)
                  </label>
                  <input
                    type='number'
                    value={loadParams.distance}
                    onChange={(e) =>
                      setLoadParams({
                        ...loadParams,
                        distance: Number(e.target.value),
                      })
                    }
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Weight (lbs)
                  </label>
                  <input
                    type='number'
                    value={loadParams.weight}
                    onChange={(e) =>
                      setLoadParams({
                        ...loadParams,
                        weight: Number(e.target.value),
                      })
                    }
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                  />
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Urgency
                </label>
                <select
                  value={loadParams.urgency}
                  onChange={(e) =>
                    setLoadParams({
                      ...loadParams,
                      urgency: e.target.value as any,
                    })
                  }
                  className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                >
                  <option value='standard'>Standard</option>
                  <option value='expedited'>Expedited</option>
                  <option value='rush'>Rush</option>
                </select>
              </div>
            </div>

            {/* Market Conditions */}
            <div className='space-y-4'>
              <h3 className='font-semibold text-gray-900'>Market Conditions</h3>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Fuel Price ($/gal)
                  </label>
                  <input
                    type='number'
                    step='0.01'
                    value={marketConditions.currentFuelPrice}
                    onChange={(e) =>
                      setMarketConditions({
                        ...marketConditions,
                        currentFuelPrice: Number(e.target.value),
                      })
                    }
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Capacity Utilization
                  </label>
                  <input
                    type='number'
                    step='0.01'
                    min='0'
                    max='1'
                    value={marketConditions.capacityUtilization}
                    onChange={(e) =>
                      setMarketConditions({
                        ...marketConditions,
                        capacityUtilization: Number(e.target.value),
                      })
                    }
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Seasonal Demand
                  </label>
                  <input
                    type='number'
                    step='0.01'
                    value={marketConditions.seasonalDemand}
                    onChange={(e) =>
                      setMarketConditions({
                        ...marketConditions,
                        seasonalDemand: Number(e.target.value),
                      })
                    }
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Competitor Rates
                  </label>
                  <input
                    type='text'
                    value={marketConditions.competitorRates.join(', ')}
                    onChange={(e) =>
                      setMarketConditions({
                        ...marketConditions,
                        competitorRates: e.target.value
                          .split(',')
                          .map((x) => Number(x.trim()))
                          .filter((x) => !isNaN(x)),
                      })
                    }
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                    placeholder='2800, 2900, 2850'
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='flex gap-4'>
            <button
              onClick={optimizeRate}
              disabled={loading}
              className='rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50'
            >
              {loading ? 'Optimizing...' : 'Optimize Rate'}
            </button>
            <button
              onClick={generateStrategies}
              disabled={loading}
              className='rounded-lg bg-green-600 px-6 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50'
            >
              {loading ? 'Generating...' : 'Generate Strategies'}
            </button>
          </div>

          {error && (
            <div className='rounded-lg bg-red-50 p-4 text-red-600'>{error}</div>
          )}

          {optimization && (
            <div className='space-y-6'>
              <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                <div className='rounded-lg bg-blue-50 p-4'>
                  <div className='text-2xl font-bold text-blue-600'>
                    ${optimization.recommendedRate}
                  </div>
                  <div className='text-sm text-blue-600'>Recommended Rate</div>
                </div>
                <div className='rounded-lg bg-gray-50 p-4'>
                  <div
                    className='text-lg font-bold'
                    style={{
                      color: getPositionColor(optimization.marketPosition),
                    }}
                  >
                    {optimization.marketPosition.toUpperCase()}
                  </div>
                  <div className='text-sm text-gray-600'>Market Position</div>
                </div>
                <div className='rounded-lg bg-green-50 p-4'>
                  <div className='text-2xl font-bold text-green-600'>
                    {optimization.confidenceLevel}%
                  </div>
                  <div className='text-sm text-green-600'>Confidence</div>
                </div>
                <div className='rounded-lg bg-orange-50 p-4'>
                  <div className='text-lg font-bold text-orange-600'>
                    ${optimization.rateRange.min} - $
                    {optimization.rateRange.max}
                  </div>
                  <div className='text-sm text-orange-600'>Rate Range</div>
                </div>
              </div>

              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='rounded-lg border border-gray-200 p-4'>
                  <h3 className='mb-3 font-semibold text-gray-900'>
                    Pricing Factors
                  </h3>
                  <div className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Fuel Cost:</span>
                      <span className='font-medium'>
                        ${optimization.pricingFactors.fuelCost.toFixed(0)}
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Capacity Pressure:</span>
                      <span className='font-medium'>
                        {(
                          optimization.pricingFactors.capacityPressure * 100
                        ).toFixed(0)}
                        %
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>
                        Seasonal Adjustment:
                      </span>
                      <span className='font-medium'>
                        {(
                          optimization.pricingFactors.seasonalAdjustment * 100
                        ).toFixed(0)}
                        %
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Urgency Multiplier:</span>
                      <span className='font-medium'>
                        {optimization.pricingFactors.urgencyMultiplier}x
                      </span>
                    </div>
                  </div>
                </div>

                <div className='rounded-lg border border-gray-200 p-4'>
                  <h3 className='mb-3 font-semibold text-gray-900'>
                    Risk Assessment
                  </h3>
                  <div className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Rate Risk:</span>
                      <span
                        className='font-medium'
                        style={{
                          color: getRiskColor(
                            optimization.riskAssessment.rateRisk
                          ),
                        }}
                      >
                        {optimization.riskAssessment.rateRisk.toUpperCase()}
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Capacity Risk:</span>
                      <span
                        className='font-medium'
                        style={{
                          color: getRiskColor(
                            optimization.riskAssessment.capacityRisk
                          ),
                        }}
                      >
                        {optimization.riskAssessment.capacityRisk.toUpperCase()}
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Market Risk:</span>
                      <span
                        className='font-medium'
                        style={{
                          color: getRiskColor(
                            optimization.riskAssessment.marketRisk
                          ),
                        }}
                      >
                        {optimization.riskAssessment.marketRisk.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='rounded-lg border border-gray-200 p-4'>
                <h3 className='mb-3 font-semibold text-gray-900'>
                  AI Analysis
                </h3>
                <p className='text-sm text-gray-600'>
                  {optimization.reasoning}
                </p>
                <div className='mt-3 text-xs text-gray-500'>
                  Confidence: {optimization.confidence}%
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Market Intelligence Tab */}
      {activeTab === 'market' && marketIntelligence && (
        <div className='space-y-6'>
          <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
            <div className='rounded-lg bg-blue-50 p-4'>
              <div className='text-2xl font-bold text-blue-600'>
                ${marketIntelligence.averageSpotRate}
              </div>
              <div className='text-sm text-blue-600'>Avg Spot Rate</div>
            </div>
            <div className='rounded-lg bg-green-50 p-4'>
              <div className='text-2xl font-bold text-green-600'>
                {(marketIntelligence.capacityAvailability * 100).toFixed(0)}%
              </div>
              <div className='text-sm text-green-600'>Capacity Available</div>
            </div>
            <div className='rounded-lg bg-orange-50 p-4'>
              <div className='text-2xl font-bold text-orange-600'>
                {(marketIntelligence.demandForecast * 100).toFixed(0)}%
              </div>
              <div className='text-sm text-orange-600'>Demand Forecast</div>
            </div>
            <div className='rounded-lg bg-red-50 p-4'>
              <div className='text-2xl font-bold text-red-600'>
                {(marketIntelligence.rateVolatility * 100).toFixed(1)}%
              </div>
              <div className='text-sm text-red-600'>Rate Volatility</div>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='rounded-lg border border-gray-200 p-4'>
              <h3 className='mb-3 font-semibold text-gray-900'>
                Hot Lanes (High Demand)
              </h3>
              <ul className='space-y-1'>
                {marketIntelligence.hotLanes.map((lane, index) => (
                  <li
                    key={index}
                    className='flex items-center gap-2 text-sm text-gray-600'
                  >
                    <div className='h-2 w-2 rounded-full bg-red-500'></div>
                    {lane}
                  </li>
                ))}
              </ul>
            </div>

            <div className='rounded-lg border border-gray-200 p-4'>
              <h3 className='mb-3 font-semibold text-gray-900'>
                Cold Lanes (Low Demand)
              </h3>
              <ul className='space-y-1'>
                {marketIntelligence.coldLanes.map((lane, index) => (
                  <li
                    key={index}
                    className='flex items-center gap-2 text-sm text-gray-600'
                  >
                    <div className='h-2 w-2 rounded-full bg-blue-500'></div>
                    {lane}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Strategies Tab */}
      {activeTab === 'strategies' && (
        <div className='space-y-6'>
          {strategies.length > 0 ? (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              {strategies.map((strategy, index) => (
                <div
                  key={index}
                  className='rounded-lg border border-gray-200 p-4'
                >
                  <div className='mb-3 flex items-center justify-between'>
                    <h3 className='font-semibold text-gray-900'>
                      {strategy.strategyName}
                    </h3>
                    <div
                      className='rounded-full px-2 py-1 text-xs font-medium text-white'
                      style={{
                        backgroundColor: getRiskColor(strategy.riskLevel),
                      }}
                    >
                      {strategy.riskLevel.toUpperCase()}
                    </div>
                  </div>

                  <p className='mb-3 text-sm text-gray-600'>
                    {strategy.description}
                  </p>

                  <div className='mb-4 space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Target Rate:</span>
                      <span className='font-medium'>
                        ${strategy.targetRate}
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Expected Margin:</span>
                      <span className='font-medium'>
                        {(strategy.expectedMargin * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className='mb-2 text-sm font-medium text-gray-900'>
                      Market Conditions:
                    </h4>
                    <ul className='space-y-1'>
                      {strategy.marketConditions.map(
                        (condition, conditionIndex) => (
                          <li
                            key={conditionIndex}
                            className='text-xs text-gray-600'
                          >
                            • {condition}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center text-gray-500'>
              Click "Generate Strategies" to see pricing strategies for your
              load
            </div>
          )}
        </div>
      )}
    </div>
  );
}
