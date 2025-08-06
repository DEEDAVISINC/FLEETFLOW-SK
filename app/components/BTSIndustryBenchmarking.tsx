'use client';

import { useEffect, useState } from 'react';
import BTSService, {
  EconomicIndicator,
  IndustryBenchmark,
  MarketTrend,
  ModalShare,
  RegionalAnalysis,
  SafetyMetrics,
} from '../services/BTSService';

export default function BTSIndustryBenchmarking() {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'modal'
    | 'economic'
    | 'regional'
    | 'safety'
    | 'trends'
    | 'benchmarks'
  >('overview');
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<{
    modalShare: ModalShare[];
    economicIndicators: EconomicIndicator[];
    regionalAnalysis: RegionalAnalysis[];
    safetyMetrics: SafetyMetrics[];
    marketTrends: MarketTrend[];
    benchmarks: IndustryBenchmark[];
  } | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await BTSService.getIndustryDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading BTS dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const TabButton = ({
    id,
    label,
    icon,
    active,
    onClick,
  }: {
    id: string;
    label: string;
    icon: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      style={{
        background: active
          ? 'rgba(255, 255, 255, 0.25)'
          : 'rgba(255, 255, 255, 0.1)',
        border: active
          ? '2px solid rgba(255, 255, 255, 0.4)'
          : '1px solid rgba(255, 255, 255, 0.2)',
        color: 'white',
        padding: '12px 18px',
        borderRadius: '12px',
        fontWeight: active ? '600' : '500',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
      }}
    >
      <span style={{ fontSize: '16px' }}>{icon}</span>
      {label}
    </button>
  );

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
      case 'up':
      case 'improving':
        return '#10b981';
      case 'decreasing':
      case 'down':
      case 'declining':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
      case 'up':
      case 'improving':
        return '📈';
      case 'decreasing':
      case 'down':
      case 'declining':
        return '📉';
      default:
        return '➡️';
    }
  };

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '32px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
            }}
          >
            <span style={{ fontSize: '24px' }}>📊</span>
          </div>
          <div>
            <h2
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: 'white',
                margin: '0 0 8px 0',
                textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              }}
            >
              Industry Benchmarking Intelligence
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.9)',
                margin: '0 0 4px 0',
              }}
            >
              Bureau of Transportation Statistics • Modal Analysis • Economic
              Indicators • Regional Trends
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  background: '#10b981',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
              >
                INTEGRATED
              </div>
              <span
                style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Estimated Value Add: $2-3M
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={loadDashboardData}
          disabled={loading}
          style={{
            background: loading
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '14px',
          }}
        >
          {loading ? 'Loading...' : '🔄 Refresh'}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '32px',
          flexWrap: 'wrap',
        }}
      >
        <TabButton
          id='overview'
          label='Overview'
          icon='📋'
          active={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
        />
        <TabButton
          id='modal'
          label='Modal Share'
          icon='🚛'
          active={activeTab === 'modal'}
          onClick={() => setActiveTab('modal')}
        />
        <TabButton
          id='economic'
          label='Economic Indicators'
          icon='📈'
          active={activeTab === 'economic'}
          onClick={() => setActiveTab('economic')}
        />
        <TabButton
          id='regional'
          label='Regional Analysis'
          icon='🗺️'
          active={activeTab === 'regional'}
          onClick={() => setActiveTab('regional')}
        />
        <TabButton
          id='safety'
          label='Safety Metrics'
          icon='🛡️'
          active={activeTab === 'safety'}
          onClick={() => setActiveTab('safety')}
        />
        <TabButton
          id='trends'
          label='Market Trends'
          icon='🔮'
          active={activeTab === 'trends'}
          onClick={() => setActiveTab('trends')}
        />
        <TabButton
          id='benchmarks'
          label='Benchmarks'
          icon='🎯'
          active={activeTab === 'benchmarks'}
          onClick={() => setActiveTab('benchmarks')}
        />
      </div>

      {/* Content */}
      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '300px',
            color: 'white',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                border: '4px solid rgba(255, 255, 255, 0.3)',
                borderTop: '4px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px',
              }}
            />
            <p>Loading BTS industry data...</p>
          </div>
        </div>
      ) : dashboardData ? (
        <div>
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gap: '24px' }}>
              {/* Key Metrics Summary */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                    🚛
                  </div>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: 'white',
                    }}
                  >
                    71.2%
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    Truck Modal Share
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                    📊
                  </div>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#10b981',
                    }}
                  >
                    87.3%
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    Fleet Utilization
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                    💰
                  </div>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#f59e0b',
                    }}
                  >
                    $2.47
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    Revenue per Mile
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                    🛡️
                  </div>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#3b82f6',
                    }}
                  >
                    2.3
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    Accidents per Million Miles
                  </div>
                </div>
              </div>

              {/* Top Regional Markets */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '600',
                    margin: '0 0 16px 0',
                  }}
                >
                  🗺️ Top Regional Markets
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {dashboardData.regionalAnalysis
                    .slice(0, 3)
                    .map((region, index) => (
                      <div
                        key={index}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          padding: '16px',
                          display: 'flex',
                          justifyContent: 'space-between',
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
                            {region.state} ({region.region})
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '14px',
                            }}
                          >
                            {formatPercentage(region.truck_share)} truck share •{' '}
                            {formatPercentage(region.growth_rate)} growth
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div
                            style={{
                              color: '#10b981',
                              fontSize: '18px',
                              fontWeight: '600',
                            }}
                          >
                            ${(region.freight_value_millions / 1000).toFixed(1)}
                            B
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '14px',
                            }}
                          >
                            Freight Value
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Market Trends Preview */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '600',
                    margin: '0 0 16px 0',
                  }}
                >
                  🔮 Key Market Trends
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {dashboardData.marketTrends
                    .slice(0, 2)
                    .map((trend, index) => (
                      <div
                        key={index}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          padding: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                        }}
                      >
                        <div
                          style={{
                            background:
                              trend.impact_level === 'high'
                                ? '#ef4444'
                                : trend.impact_level === 'medium'
                                  ? '#f59e0b'
                                  : '#10b981',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                          }}
                        >
                          {trend.impact_level}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              color: 'white',
                              fontSize: '16px',
                              fontWeight: '600',
                            }}
                          >
                            {trend.trend_name}
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '14px',
                            }}
                          >
                            {trend.description}
                          </div>
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '12px',
                          }}
                        >
                          {formatPercentage(trend.confidence_level)} confidence
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'modal' && (
            <div style={{ display: 'grid', gap: '24px' }}>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '600',
                    margin: '0 0 16px 0',
                  }}
                >
                  Transportation Modal Share Analysis
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {dashboardData.modalShare.map((modal, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '8px',
                          }}
                        >
                          <div
                            style={{
                              color: 'white',
                              fontSize: '18px',
                              fontWeight: '600',
                            }}
                          >
                            {modal.mode}
                          </div>
                          <div
                            style={{
                              color: getTrendColor(modal.trend),
                              fontSize: '14px',
                            }}
                          >
                            {getTrendIcon(modal.trend)} {modal.trend}
                          </div>
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '14px',
                          }}
                        >
                          Value Share:{' '}
                          {formatPercentage(modal.value_share / 100)} • Growth:{' '}
                          {formatPercentage(modal.growth_rate)}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            color: '#10b981',
                            fontSize: '24px',
                            fontWeight: 'bold',
                          }}
                        >
                          {formatPercentage(modal.percentage / 100)}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '14px',
                          }}
                        >
                          Modal Share
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'economic' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              {dashboardData.economicIndicators.map((indicator, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          fontWeight: '600',
                          margin: '0 0 8px 0',
                        }}
                      >
                        {indicator.indicator}
                      </h4>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                          marginBottom: '8px',
                        }}
                      >
                        {indicator.period} • {indicator.unit}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          color: '#10b981',
                          fontSize: '24px',
                          fontWeight: 'bold',
                        }}
                      >
                        {indicator.value}
                      </div>
                      <div
                        style={{
                          color: getTrendColor(indicator.trend),
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          justifyContent: 'flex-end',
                        }}
                      >
                        {getTrendIcon(indicator.trend)}{' '}
                        {formatPercentage(indicator.year_over_year_change)} YoY
                      </div>
                    </div>
                  </div>
                  <div
                    style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
                  >
                    <span
                      style={{
                        background:
                          indicator.significance === 'high'
                            ? '#ef4444'
                            : indicator.significance === 'medium'
                              ? '#f59e0b'
                              : '#10b981',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                      }}
                    >
                      {indicator.significance} Impact
                    </span>
                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                      }}
                    >
                      QoQ:{' '}
                      {formatPercentage(indicator.quarter_over_quarter_change)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'regional' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              {dashboardData.regionalAnalysis.map((region, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '16px',
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          fontWeight: '600',
                          margin: '0 0 8px 0',
                        }}
                      >
                        {region.state} - {region.region}
                      </h4>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                        }}
                      >
                        Truck Share: {formatPercentage(region.truck_share)} •
                        Utilization:{' '}
                        {formatPercentage(region.capacity_utilization)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          color: '#10b981',
                          fontSize: '20px',
                          fontWeight: 'bold',
                        }}
                      >
                        ${(region.freight_value_millions / 1000).toFixed(1)}B
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                        }}
                      >
                        📈 {formatPercentage(region.growth_rate)} growth
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '14px',
                          marginBottom: '4px',
                        }}
                      >
                        Dominant Commodities:
                      </div>
                      <div style={{ color: 'white', fontSize: '14px' }}>
                        {region.dominant_commodities.join(', ')}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '14px',
                          marginBottom: '4px',
                        }}
                      >
                        Competitive Index:
                      </div>
                      <div style={{ color: 'white', fontSize: '14px' }}>
                        {formatPercentage(region.competitive_index)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'safety' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              {dashboardData.safetyMetrics.map((safety, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '16px',
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          fontWeight: '600',
                          margin: '0 0 8px 0',
                        }}
                      >
                        {safety.mode} Transportation
                      </h4>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                        }}
                      >
                        {safety.year} Safety Metrics
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          color: '#10b981',
                          fontSize: '20px',
                          fontWeight: 'bold',
                        }}
                      >
                        {formatPercentage(safety.compliance_score)}
                      </div>
                      <div
                        style={{
                          color: getTrendColor(safety.safety_trend),
                          fontSize: '14px',
                        }}
                      >
                        {getTrendIcon(safety.safety_trend)}{' '}
                        {safety.safety_trend}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '600',
                        }}
                      >
                        {safety.accident_rate}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '12px',
                        }}
                      >
                        Accident Rate
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '600',
                        }}
                      >
                        {safety.fatality_rate}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '12px',
                        }}
                      >
                        Fatality Rate
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '600',
                        }}
                      >
                        {safety.injury_rate}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '12px',
                        }}
                      >
                        Injury Rate
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'trends' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              {dashboardData.marketTrends.map((trend, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          fontWeight: '600',
                          margin: '0 0 8px 0',
                        }}
                      >
                        {trend.trend_name}
                      </h4>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '14px',
                          margin: '0 0 12px 0',
                        }}
                      >
                        {trend.description}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: '120px' }}>
                      <div
                        style={{
                          color: '#10b981',
                          fontSize: '18px',
                          fontWeight: 'bold',
                        }}
                      >
                        {formatPercentage(trend.confidence_level)}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                        }}
                      >
                        Confidence
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      flexWrap: 'wrap',
                      marginBottom: '12px',
                    }}
                  >
                    <span
                      style={{
                        background:
                          trend.impact_level === 'high'
                            ? '#ef4444'
                            : trend.impact_level === 'medium'
                              ? '#f59e0b'
                              : '#10b981',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                      }}
                    >
                      {trend.impact_level} Impact
                    </span>
                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                      }}
                    >
                      {trend.time_horizon.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '14px',
                        marginBottom: '4px',
                      }}
                    >
                      Key Drivers:
                    </div>
                    <div style={{ color: 'white', fontSize: '14px' }}>
                      {trend.key_drivers.join(' • ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'benchmarks' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              {dashboardData.benchmarks.map((benchmark, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '16px',
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          fontWeight: '600',
                          margin: '0 0 8px 0',
                        }}
                      >
                        {benchmark.metric}
                      </h4>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                        }}
                      >
                        {benchmark.category} • {benchmark.benchmark_year}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(120px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          color: '#ef4444',
                          fontSize: '18px',
                          fontWeight: 'bold',
                        }}
                      >
                        {benchmark.unit.includes('USD')
                          ? formatCurrency(benchmark.top_quartile)
                          : benchmark.top_quartile}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '12px',
                        }}
                      >
                        Top Quartile
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          color: '#f59e0b',
                          fontSize: '18px',
                          fontWeight: 'bold',
                        }}
                      >
                        {benchmark.unit.includes('USD')
                          ? formatCurrency(benchmark.industry_average)
                          : benchmark.industry_average}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '12px',
                        }}
                      >
                        Industry Average
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          color: '#10b981',
                          fontSize: '18px',
                          fontWeight: 'bold',
                        }}
                      >
                        {benchmark.unit.includes('USD')
                          ? formatCurrency(benchmark.bottom_quartile)
                          : benchmark.bottom_quartile}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '12px',
                        }}
                      >
                        Bottom Quartile
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: '12px' }}>
                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.8)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                      }}
                    >
                      Source: {benchmark.data_source}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{ color: 'white', textAlign: 'center', padding: '40px' }}>
          No data available. Click refresh to load industry benchmarking data.
        </div>
      )}
    </div>
  );
}
