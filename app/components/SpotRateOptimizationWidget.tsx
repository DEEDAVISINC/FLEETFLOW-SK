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
          <div style={{ fontSize: '24px' }}>💰</div>
          <div>
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '4px',
              }}
            >
              Spot Rate Optimization
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
              }}
            >
              Enable ENABLE_SPOT_RATE_OPTIMIZATION=true to access rate
              optimization features
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
          <div style={{ fontSize: '32px' }}>💰</div>
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
              Spot Rate Optimization
            </h2>
            <p
              style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
              }}
            >
              Optimize rates based on market conditions
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
          onClick={() => setActiveTab('optimize')}
          style={{
            flex: 1,
            background:
              activeTab === 'optimize'
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
          Rate Optimization
        </button>
        <button
          onClick={() => setActiveTab('market')}
          style={{
            flex: 1,
            background:
              activeTab === 'market'
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
          Market Intelligence
        </button>
        <button
          onClick={() => setActiveTab('strategies')}
          style={{
            flex: 1,
            background:
              activeTab === 'strategies'
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
          Pricing Strategies
        </button>
      </div>

      {/* Rate Optimization Tab */}
      {activeTab === 'optimize' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '24px',
            }}
          >
            {/* Load Parameters */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '16px',
                }}
              >
                Load Parameters
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '16px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '6px',
                    }}
                  >
                    Origin
                  </label>
                  <input
                    type='text'
                    value={loadParams.origin}
                    onChange={(e) =>
                      setLoadParams({ ...loadParams, origin: e.target.value })
                    }
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '12px',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                    placeholder='e.g., ATL'
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '6px',
                    }}
                  >
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
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '12px',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                    placeholder='e.g., LAX'
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '6px',
                    }}
                  >
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
                    style={{
                      width: '100%',
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
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '6px',
                    }}
                  >
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
                    style={{
                      width: '100%',
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
                </div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '6px',
                  }}
                >
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
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                >
                  <option
                    value='standard'
                    style={{ background: '#1f2937', color: 'white' }}
                  >
                    Standard
                  </option>
                  <option
                    value='expedited'
                    style={{ background: '#1f2937', color: 'white' }}
                  >
                    Expedited
                  </option>
                  <option
                    value='rush'
                    style={{ background: '#1f2937', color: 'white' }}
                  >
                    Rush
                  </option>
                </select>
              </div>
            </div>

            {/* Market Conditions */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '16px',
                }}
              >
                Market Conditions
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '16px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '6px',
                    }}
                  >
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
                    style={{
                      width: '100%',
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
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '6px',
                    }}
                  >
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
                    style={{
                      width: '100%',
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
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '6px',
                    }}
                  >
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
                    style={{
                      width: '100%',
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
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '6px',
                    }}
                  >
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
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '12px',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                    placeholder='2800, 2900, 2850'
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={optimizeRate}
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
              {loading ? 'Optimizing...' : 'Optimize Rate'}
            </button>
            <button
              onClick={generateStrategies}
              disabled={loading}
              style={{
                background: loading
                  ? 'rgba(107, 114, 128, 0.5)'
                  : 'linear-gradient(135deg, #10b981, #059669)',
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
              {loading ? 'Generating...' : 'Generate Strategies'}
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

          {optimization && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '20px',
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
                      fontWeight: 'bold',
                      color: '#3b82f6',
                      marginBottom: '4px',
                    }}
                  >
                    ${optimization.recommendedRate}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Recommended Rate
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: getPositionColor(optimization.marketPosition),
                      marginBottom: '4px',
                    }}
                  >
                    {optimization.marketPosition.toUpperCase()}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Market Position
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#22c55e',
                      marginBottom: '4px',
                    }}
                  >
                    {optimization.confidenceLevel}%
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Confidence
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
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#f97316',
                      marginBottom: '4px',
                    }}
                  >
                    ${optimization.rateRange.min} - $
                    {optimization.rateRange.max}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Rate Range
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
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '16px',
                    }}
                  >
                    Pricing Factors
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
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
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        Fuel Cost:
                      </span>
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        ${optimization.pricingFactors.fuelCost.toFixed(0)}
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
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        Capacity Pressure:
                      </span>
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        {(
                          optimization.pricingFactors.capacityPressure * 100
                        ).toFixed(0)}
                        %
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
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        Seasonal Adjustment:
                      </span>
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        {(
                          optimization.pricingFactors.seasonalAdjustment * 100
                        ).toFixed(0)}
                        %
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
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        Urgency Multiplier:
                      </span>
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        {optimization.pricingFactors.urgencyMultiplier}x
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '16px',
                    }}
                  >
                    Risk Assessment
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
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
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        Rate Risk:
                      </span>
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: getRiskColor(
                            optimization.riskAssessment.rateRisk
                          ),
                        }}
                      >
                        {optimization.riskAssessment.rateRisk.toUpperCase()}
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
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        Capacity Risk:
                      </span>
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: getRiskColor(
                            optimization.riskAssessment.capacityRisk
                          ),
                        }}
                      >
                        {optimization.riskAssessment.capacityRisk.toUpperCase()}
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
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        Market Risk:
                      </span>
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
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

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  gridColumn: 'span 2',
                }}
              >
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '16px',
                  }}
                >
                  AI Analysis
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: '1.6',
                    marginBottom: '12px',
                  }}
                >
                  {optimization.reasoning}
                </p>
                <div
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  Confidence: {optimization.confidence}%
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Market Intelligence Tab */}
      {activeTab === 'market' && marketIntelligence && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '20px',
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
                  fontWeight: 'bold',
                  color: '#3b82f6',
                  marginBottom: '4px',
                }}
              >
                ${marketIntelligence.averageSpotRate}
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                Avg Spot Rate
              </div>
            </div>
            <div
              style={{
                background: 'rgba(34, 197, 94, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#22c55e',
                  marginBottom: '4px',
                }}
              >
                {(marketIntelligence.capacityAvailability * 100).toFixed(0)}%
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                Capacity Available
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
                  fontWeight: 'bold',
                  color: '#f97316',
                  marginBottom: '4px',
                }}
              >
                {(marketIntelligence.demandForecast * 100).toFixed(0)}%
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                Demand Forecast
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
                  fontWeight: 'bold',
                  color: '#ef4444',
                  marginBottom: '4px',
                }}
              >
                {(marketIntelligence.rateVolatility * 100).toFixed(1)}%
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                Rate Volatility
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
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '16px',
                }}
              >
                Hot Lanes (High Demand)
              </h3>
              <ul
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                {marketIntelligence.hotLanes.map((lane, index) => (
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
                        background: '#ef4444',
                      }}
                     />
                    {lane}
                  </li>
                ))}
              </ul>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '16px',
                }}
              >
                Cold Lanes (Low Demand)
              </h3>
              <ul
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                {marketIntelligence.coldLanes.map((lane, index) => (
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
                     />
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
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          {strategies.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
              }}
            >
              {strategies.map((strategy, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
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
                    <h3
                      style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: 'white',
                      }}
                    >
                      {strategy.strategyName}
                    </h3>
                    <div
                      style={{
                        borderRadius: '20px',
                        padding: '4px 12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: 'white',
                        backgroundColor: getRiskColor(strategy.riskLevel),
                      }}
                    >
                      {strategy.riskLevel.toUpperCase()}
                    </div>
                  </div>

                  <p
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: '1.6',
                      marginBottom: '16px',
                    }}
                  >
                    {strategy.description}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      marginBottom: '20px',
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
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        Target Rate:
                      </span>
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        ${strategy.targetRate}
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
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        Expected Margin:
                      </span>
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        {(strategy.expectedMargin * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'white',
                        marginBottom: '12px',
                      }}
                    >
                      Market Conditions:
                    </h4>
                    <ul
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                      }}
                    >
                      {strategy.marketConditions.map(
                        (condition, conditionIndex) => (
                          <li
                            key={conditionIndex}
                            style={{
                              fontSize: '12px',
                              color: 'rgba(255, 255, 255, 0.7)',
                            }}
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
            <div
              style={{
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '16px',
                padding: '40px 20px',
              }}
            >
              Click ""Generate Strategies"" to see pricing strategies for your
              load
            </div>
          )}
        </div>
      )}
    </div>
  );
}
