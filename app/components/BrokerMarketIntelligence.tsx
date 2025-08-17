'use client';

import { useEffect, useState } from 'react';

interface MarketData {
  lane: string;
  averageRate: number;
  rateRange: { min: number; max: number };
  volume: number;
  trend: 'up' | 'down' | 'stable';
  competitionLevel: 'low' | 'medium' | 'high';
  seasonality: number;
}

interface CompetitorData {
  name: string;
  marketShare: number;
  averageRate: number;
  winRate: number;
  strengths: string[];
  weaknesses: string[];
}

interface BrokerMarketIntelligenceProps {
  brokerId: string;
}

export default function BrokerMarketIntelligence({
  brokerId,
}: BrokerMarketIntelligenceProps) {
  const [activeTab, setActiveTab] = useState<
    'rates' | 'competition' | 'trends' | 'intelligence'
  >('rates');
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
  const [selectedLane, setSelectedLane] = useState<string>('');
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>(
    '30d'
  );
  const [loading, setLoading] = useState(false);

  // Mock market intelligence data
  useEffect(() => {
    const mockMarketData: MarketData[] = [
      {
        lane: 'TX-CA (Dallas to Los Angeles)',
        averageRate: 2850,
        rateRange: { min: 2400, max: 3200 },
        volume: 1250,
        trend: 'up',
        competitionLevel: 'high',
        seasonality: 85,
      },
      {
        lane: 'FL-NY (Miami to New York)',
        averageRate: 2650,
        rateRange: { min: 2200, max: 3100 },
        volume: 980,
        trend: 'stable',
        competitionLevel: 'medium',
        seasonality: 92,
      },
      {
        lane: 'CA-WA (Los Angeles to Seattle)',
        averageRate: 1850,
        rateRange: { min: 1600, max: 2200 },
        volume: 750,
        trend: 'down',
        competitionLevel: 'low',
        seasonality: 78,
      },
      {
        lane: 'IL-TX (Chicago to Houston)',
        averageRate: 2200,
        rateRange: { min: 1900, max: 2600 },
        volume: 890,
        trend: 'up',
        competitionLevel: 'high',
        seasonality: 88,
      },
      {
        lane: 'GA-FL (Atlanta to Tampa)',
        averageRate: 1650,
        rateRange: { min: 1400, max: 1950 },
        volume: 420,
        trend: 'stable',
        competitionLevel: 'medium',
        seasonality: 95,
      },
    ];

    const mockCompetitors: CompetitorData[] = [
      {
        name: 'TransForce Logistics',
        marketShare: 15.2,
        averageRate: 2750,
        winRate: 68,
        strengths: [
          'Strong carrier network',
          'Competitive pricing',
          'Good technology',
        ],
        weaknesses: ['Limited geographic coverage', 'Slower response times'],
      },
      {
        name: 'FreightMaster Pro',
        marketShare: 12.8,
        averageRate: 2850,
        winRate: 72,
        strengths: [
          'Excellent customer service',
          'Specialized equipment',
          'Reliable carriers',
        ],
        weaknesses: ['Higher rates', 'Limited capacity in peak seasons'],
      },
      {
        name: 'Swift Logistics',
        marketShare: 11.4,
        averageRate: 2650,
        winRate: 65,
        strengths: ['Fast response', 'Good load tracking', 'Flexible terms'],
        weaknesses: [
          'Inconsistent carrier quality',
          'Limited load board access',
        ],
      },
      {
        name: 'Elite Transport Solutions',
        marketShare: 9.6,
        averageRate: 2920,
        winRate: 74,
        strengths: [
          'Premium service',
          'High-value loads',
          'Strong relationships',
        ],
        weaknesses: ['Very high rates', 'Selective about loads'],
      },
    ];

    setMarketData(mockMarketData);
    setCompetitors(mockCompetitors);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '📈';
      case 'down':
        return '📉';
      default:
        return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return '#22c55e';
      case 'down':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      default:
        return '#22c55e';
    }
  };

  return (
    <div
      style={{
        background: 'rgba(0,0,0,0.6)',
        borderRadius: '20px',
        padding: '32px',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2
          style={{
            color: 'white',
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '8px',
          }}
        >
          📊 Market Intelligence & Competitive Analysis
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>
          Real-time market rates, competitive analysis, and strategic insights
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
        {[
          { id: 'rates', label: 'Market Rates', icon: '💰' },
          { id: 'competition', label: 'Competition', icon: '🏢' },
          { id: 'trends', label: 'Trends & Analytics', icon: '📈' },
          { id: 'intelligence', label: 'AI Intelligence', icon: '🤖' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '16px 20px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background:
                activeTab === tab.id
                  ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                  : 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              border:
                activeTab === tab.id
                  ? 'none'
                  : '1px solid rgba(255, 255, 255, 0.2)',
              transform:
                activeTab === tab.id ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow:
                activeTab === tab.id ? '0 8px 25px rgba(0, 0, 0, 0.3)' : 'none',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Market Rates Tab */}
      {activeTab === 'rates' && (
        <div>
          {/* Filters */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '24px',
              background: 'rgba(255,255,255,0.1)',
              padding: '16px',
              borderRadius: '12px',
            }}
          >
            <div>
              <label
                style={{
                  color: 'white',
                  fontSize: '14px',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Timeframe
              </label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as any)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  fontSize: '14px',
                }}
              >
                <option value='7d'>Last 7 Days</option>
                <option value='30d'>Last 30 Days</option>
                <option value='90d'>Last 90 Days</option>
                <option value='1y'>Last Year</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label
                style={{
                  color: 'white',
                  fontSize: '14px',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Search Lanes
              </label>
              <input
                type='text'
                placeholder='e.g., TX-CA, Dallas to Los Angeles'
                value={selectedLane}
                onChange={(e) => setSelectedLane(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  fontSize: '14px',
                }}
              />
            </div>

            <div style={{ alignSelf: 'end' }}>
              <button
                onClick={() => setLoading(true)}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                🔍 Search
              </button>
            </div>
          </div>

          {/* Market Rates Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '20px',
            }}
          >
            {marketData.map((market, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                {/* Lane Header */}
                <div style={{ marginBottom: '20px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '8px',
                    }}
                  >
                    <h3
                      style={{
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: 'bold',
                      }}
                    >
                      {market.lane}
                    </h3>
                    <div
                      style={{
                        background: getCompetitionColor(
                          market.competitionLevel
                        ),
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                      }}
                    >
                      {market.competitionLevel} Competition
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <span
                      style={{
                        color: getTrendColor(market.trend),
                        fontSize: '20px',
                      }}
                    >
                      {getTrendIcon(market.trend)}
                    </span>
                    <span
                      style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '14px',
                      }}
                    >
                      {market.volume} loads this month
                    </span>
                  </div>
                </div>

                {/* Rate Information */}
                <div style={{ marginBottom: '20px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '12px',
                    }}
                  >
                    <span
                      style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '14px',
                      }}
                    >
                      Average Rate
                    </span>
                    <span
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      ${market.averageRate.toLocaleString()}
                    </span>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                      }}
                    >
                      <span
                        style={{
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '12px',
                        }}
                      >
                        Min: ${market.rateRange.min.toLocaleString()}
                      </span>
                      <span
                        style={{
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '12px',
                        }}
                      >
                        Max: ${market.rateRange.max.toLocaleString()}
                      </span>
                    </div>

                    {/* Rate Range Bar */}
                    <div
                      style={{
                        width: '100%',
                        height: '8px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '4px',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          left: '0',
                          top: '0',
                          height: '100%',
                          width: `${((market.averageRate - market.rateRange.min) / (market.rateRange.max - market.rateRange.min)) * 100}%`,
                          background:
                            'linear-gradient(90deg, #22c55e, #3b82f6)',
                          borderRadius: '4px',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Market Metrics */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '12px',
                        marginBottom: '4px',
                      }}
                    >
                      Seasonality Index
                    </div>
                    <div
                      style={{
                        color:
                          market.seasonality > 90
                            ? '#22c55e'
                            : market.seasonality > 80
                              ? '#f59e0b'
                              : '#ef4444',
                        fontSize: '18px',
                        fontWeight: 'bold',
                      }}
                    >
                      {market.seasonality}%
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '12px',
                        marginBottom: '4px',
                      }}
                    >
                      Rate Trend
                    </div>
                    <div
                      style={{
                        color: getTrendColor(market.trend),
                        fontSize: '18px',
                        fontWeight: 'bold',
                        textTransform: 'capitalize',
                      }}
                    >
                      {market.trend}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competition Tab */}
      {activeTab === 'competition' && (
        <div>
          <div style={{ marginBottom: '24px' }}>
            <h3
              style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              🏢 Competitive Landscape Analysis
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>
              Monitor your competitors and identify market opportunities
            </p>
          </div>

          {/* Market Share Overview */}
          <div
            style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
            }}
          >
            <h4
              style={{ color: 'white', fontSize: '18px', marginBottom: '16px' }}
            >
              Market Share Distribution
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
              }}
            >
              {competitors.map((competitor, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                    }}
                  >
                    {competitor.name}
                  </div>
                  <div
                    style={{
                      color: '#3b82f6',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      marginBottom: '4px',
                    }}
                  >
                    {competitor.marketShare}%
                  </div>
                  <div
                    style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}
                  >
                    Market Share
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Competitor Analysis */}
          <div>
            <h4
              style={{ color: 'white', fontSize: '18px', marginBottom: '16px' }}
            >
              Detailed Competitor Profiles
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '20px',
              }}
            >
              {competitors.map((competitor, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  {/* Competitor Header */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '20px',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          fontWeight: 'bold',
                          marginBottom: '4px',
                        }}
                      >
                        {competitor.name}
                      </h3>
                      <p
                        style={{
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '14px',
                        }}
                      >
                        #{index + 1} Market Position
                      </p>
                    </div>
                    <div
                      style={{
                        background:
                          index === 0
                            ? '#22c55e'
                            : index === 1
                              ? '#3b82f6'
                              : '#f59e0b',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                    >
                      {competitor.marketShare}% Share
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                      marginBottom: '20px',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '12px',
                          marginBottom: '4px',
                        }}
                      >
                        Average Rate
                      </div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          fontWeight: 'bold',
                        }}
                      >
                        ${competitor.averageRate.toLocaleString()}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '12px',
                          marginBottom: '4px',
                        }}
                      >
                        Win Rate
                      </div>
                      <div
                        style={{
                          color: '#22c55e',
                          fontSize: '18px',
                          fontWeight: 'bold',
                        }}
                      >
                        {competitor.winRate}%
                      </div>
                    </div>
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ marginBottom: '12px' }}>
                      <div
                        style={{
                          color: '#22c55e',
                          fontSize: '14px',
                          fontWeight: '600',
                          marginBottom: '8px',
                        }}
                      >
                        ✅ Strengths
                      </div>
                      <div
                        style={{
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: '13px',
                          lineHeight: '1.4',
                        }}
                      >
                        {competitor.strengths.join(' • ')}
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          color: '#ef4444',
                          fontSize: '14px',
                          fontWeight: '600',
                          marginBottom: '8px',
                        }}
                      >
                        ⚠️ Weaknesses
                      </div>
                      <div
                        style={{
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: '13px',
                          lineHeight: '1.4',
                        }}
                      >
                        {competitor.weaknesses.join(' • ')}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      style={{
                        flex: 1,
                        background: 'rgba(59,130,246,0.2)',
                        color: '#3b82f6',
                        border: '1px solid #3b82f6',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      📊 Deep Analysis
                    </button>
                    <button
                      style={{
                        flex: 1,
                        background: 'rgba(34,197,94,0.2)',
                        color: '#22c55e',
                        border: '1px solid #22c55e',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      🎯 Counter Strategy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trends & Analytics Tab */}
      {activeTab === 'trends' && (
        <div>
          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <h3
              style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              📈 Market Trends & Predictive Analytics
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>
              Advanced analytics and forecasting for strategic planning
            </p>
          </div>

          {/* Market Outlook Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
              marginBottom: '32px',
            }}
          >
            {[
              {
                title: 'Freight Volume Forecast',
                value: '+12.5%',
                subtext: 'Expected growth next quarter',
                icon: '📦',
                color: '#22c55e',
                details: 'Seasonal uptick + e-commerce growth',
              },
              {
                title: 'Average Rate Prediction',
                value: '+8.2%',
                subtext: 'Rate increase expected',
                icon: '💰',
                color: '#3b82f6',
                details: 'Fuel costs + capacity constraints',
              },
              {
                title: 'Capacity Utilization',
                value: '87.3%',
                subtext: 'Market capacity utilization',
                icon: '🚛',
                color: '#f59e0b',
                details: 'Above normal seasonal levels',
              },
              {
                title: 'Competition Index',
                value: '74',
                subtext: 'Competition intensity score',
                icon: '⚔️',
                color: '#ef4444',
                details: 'High competition in key lanes',
              },
            ].map((metric, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255,255,255,0.2)',
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
                      background: `${metric.color}20`,
                      borderRadius: '12px',
                      padding: '12px',
                      fontSize: '24px',
                    }}
                  >
                    {metric.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: 'bold',
                      }}
                    >
                      {metric.title}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '12px',
                      }}
                    >
                      {metric.subtext}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <div
                    style={{
                      color: metric.color,
                      fontSize: '28px',
                      fontWeight: 'bold',
                    }}
                  >
                    {metric.value}
                  </div>
                </div>

                <div
                  style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}
                >
                  {metric.details}
                </div>
              </div>
            ))}
          </div>

          {/* Market Alerts */}
          <div
            style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '24px',
            }}
          >
            <h4
              style={{ color: 'white', fontSize: '18px', marginBottom: '16px' }}
            >
              🚨 Market Alerts & Opportunities
            </h4>
            <div style={{ display: 'grid', gap: '12px' }}>
              {[
                {
                  type: 'opportunity',
                  title: 'Rate Spike Alert: TX-CA Lane',
                  message:
                    'Rates up 15% in last 48 hours. High demand, limited capacity.',
                  action: 'Increase pricing by 12-18%',
                  urgency: 'high',
                },
                {
                  type: 'warning',
                  title: 'Competition Increase: FL-NY',
                  message:
                    'New competitor entered market. Average rates down 8%.',
                  action: 'Review pricing strategy',
                  urgency: 'medium',
                },
                {
                  type: 'info',
                  title: 'Seasonal Trend: Holiday Volume',
                  message: 'Expected 25% volume increase starting next week.',
                  action: 'Secure additional capacity',
                  urgency: 'low',
                },
              ].map((alert, index) => (
                <div
                  key={index}
                  style={{
                    background:
                      alert.urgency === 'high'
                        ? 'rgba(239,68,68,0.1)'
                        : alert.urgency === 'medium'
                          ? 'rgba(251,191,36,0.1)'
                          : 'rgba(59,130,246,0.1)',
                    border:
                      alert.urgency === 'high'
                        ? '1px solid #ef4444'
                        : alert.urgency === 'medium'
                          ? '1px solid #fbbf24'
                          : '1px solid #3b82f6',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '16px',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div
                      style={{
                        color:
                          alert.urgency === 'high'
                            ? '#ef4444'
                            : alert.urgency === 'medium'
                              ? '#fbbf24'
                              : '#3b82f6',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginBottom: '4px',
                      }}
                    >
                      {alert.title}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '14px',
                        marginBottom: '8px',
                      }}
                    >
                      {alert.message}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '13px',
                      }}
                    >
                      📋 Recommended Action: {alert.action}
                    </div>
                  </div>
                  <div>
                    <button
                      style={{
                        background:
                          alert.urgency === 'high'
                            ? '#ef4444'
                            : alert.urgency === 'medium'
                              ? '#fbbf24'
                              : '#3b82f6',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '12px',
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
          </div>
        </div>
      )}

      {/* AI Intelligence Tab */}
      {activeTab === 'intelligence' && (
        <div>
          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <h3
              style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              🤖 AI-Powered Market Intelligence
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>
              Advanced AI analysis for competitive advantage and strategic
              insights
            </p>
          </div>

          {/* AI Recommendations */}
          <div
            style={{
              background: 'rgba(139,92,246,0.15)',
              border: '1px solid #8b5cf6',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
            }}
          >
            <h4
              style={{
                color: '#a855f7',
                fontSize: '18px',
                marginBottom: '16px',
              }}
            >
              🎯 AI Strategic Recommendations
            </h4>
            <div style={{ display: 'grid', gap: '16px' }}>
              {[
                {
                  title: 'Pricing Optimization',
                  confidence: 94,
                  recommendation:
                    'Increase TX-CA rates by 12% - market can bear higher pricing based on demand patterns',
                  impact: '$15,000 additional monthly revenue',
                },
                {
                  title: 'Carrier Partnership',
                  confidence: 87,
                  recommendation:
                    'Target Elite Transport Solutions for partnership - complementary strengths identified',
                  impact: '25% capacity increase in premium segment',
                },
                {
                  title: 'Market Expansion',
                  confidence: 91,
                  recommendation:
                    'Enter Pacific Northwest market - low competition, growing demand detected',
                  impact: '$50,000 potential monthly revenue',
                },
              ].map((rec, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '20px',
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
                      <div
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          marginBottom: '4px',
                        }}
                      >
                        {rec.title}
                      </div>
                      <div
                        style={{
                          color: '#a855f7',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        {rec.confidence}% Confidence
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '14px',
                      marginBottom: '12px',
                      lineHeight: '1.4',
                    }}
                  >
                    {rec.recommendation}
                  </div>

                  <div
                    style={{
                      color: '#22c55e',
                      fontSize: '13px',
                      fontWeight: '600',
                      background: 'rgba(34,197,94,0.1)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      display: 'inline-block',
                    }}
                  >
                    💰 Impact: {rec.impact}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Analysis Tools */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
            }}
          >
            {[
              {
                title: 'Predictive Rate Model',
                description: 'AI-powered rate forecasting',
                status: 'active',
                accuracy: '92%',
                icon: '🔮',
              },
              {
                title: 'Competitor Monitoring',
                description: 'Real-time competitive intelligence',
                status: 'active',
                coverage: '95%',
                icon: '🕵️',
              },
              {
                title: 'Demand Forecasting',
                description: 'Load volume predictions',
                status: 'active',
                horizon: '90 days',
                icon: '📊',
              },
              {
                title: 'Risk Assessment',
                description: 'Market risk analysis',
                status: 'beta',
                score: 'Medium',
                icon: '⚠️',
              },
            ].map((tool, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>
                  {tool.icon}
                </div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                  }}
                >
                  {tool.title}
                </div>
                <div
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '14px',
                    marginBottom: '16px',
                  }}
                >
                  {tool.description}
                </div>

                <div
                  style={{
                    background:
                      tool.status === 'active'
                        ? 'rgba(34,197,94,0.2)'
                        : 'rgba(251,191,36,0.2)',
                    color: tool.status === 'active' ? '#22c55e' : '#fbbf24',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    marginBottom: '12px',
                    display: 'inline-block',
                  }}
                >
                  {tool.status}
                </div>

                <div
                  style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}
                >
                  {tool.accuracy && `Accuracy: ${tool.accuracy}`}
                  {tool.coverage && `Coverage: ${tool.coverage}`}
                  {tool.horizon && `Horizon: ${tool.horizon}`}
                  {tool.score && `Risk Score: ${tool.score}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
