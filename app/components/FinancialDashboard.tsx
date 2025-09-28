'use client';

import React, { useEffect, useState } from 'react';
import {
  FinancialMarketsService,
  MarketData,
} from '../services/FinancialMarketsService';

const FinancialDashboard: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const financialService = new FinancialMarketsService();

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await financialService.getMarketData();
      setMarketData(data);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError('Failed to fetch market data. Using cached or mock data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();

    // Auto-refresh every hour
    const interval = setInterval(fetchMarketData, 3600000);
    return () => clearInterval(interval);
  }, []);

  const getChangeIndicator = (change: number) => {
    if (change > 0) return { icon: '📈', color: '#ef4444', text: 'UP' };
    if (change < 0) return { icon: '📉', color: '#10b981', text: 'DOWN' };
    return { icon: '➡️', color: '#6b7280', text: 'STABLE' };
  };

  if (loading && !marketData) {
    return (
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          margin: '24px 0',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '24px',
                marginBottom: '12px',
                animation: 'spin 1s linear infinite',
              }}
            >
              💰
            </div>
            <div style={{ color: 'white', fontSize: '16px' }}>
              Loading Financial Markets...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !marketData) {
    return (
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          margin: '24px 0',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h3
            style={{
              color: '#ef4444',
              fontSize: '18px',
              fontWeight: '600',
              margin: '0 0 8px 0',
            }}
          >
            Financial Data Unavailable
          </h3>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              margin: 0,
            }}
          >
            {error}
          </p>
          <button
            onClick={fetchMarketData}
            style={{
              marginTop: '16px',
              background: '#3b82f6',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!marketData) return null;

  const fuelIndicator = getChangeIndicator(marketData.fuelPrice.priceChange);
  const exchangeIndicator = getChangeIndicator(marketData.exchangeRate.change);

  return (
    <div
      id='financial-markets'
      style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        margin: '24px 0',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>💰</span>
          <h3
            style={{
              color: 'white',
              fontSize: '24px',
              fontWeight: '600',
              margin: 0,
            }}
          >
            Financial Markets Intelligence
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={fetchMarketData}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            🔄 Refresh
          </button>
          <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
            Updated: {lastRefresh.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Market Data Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {/* Diesel Price Card */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>⛽</span>
              <h4
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: 0,
                }}
              >
                Diesel Price
              </h4>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '16px' }}>{fuelIndicator.icon}</span>
              <span
                style={{
                  color: fuelIndicator.color,
                  fontSize: '12px',
                  fontWeight: '600',
                }}
              >
                {fuelIndicator.text}
              </span>
            </div>
          </div>

          <div style={{ marginBottom: '8px' }}>
            <span
              style={{
                color: 'white',
                fontSize: '28px',
                fontWeight: 'bold',
              }}
            >
              {financialService.formatCurrency(
                marketData.fuelPrice.currentPrice
              )}
            </span>
            <span
              style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}
            >
              /gallon
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
            }}
          >
            <span
              style={{
                color: fuelIndicator.color,
                fontWeight: '600',
              }}
            >
              {marketData.fuelPrice.priceChange >= 0 ? '+' : ''}
              {financialService.formatCurrency(
                marketData.fuelPrice.priceChange
              )}{' '}
              today
            </span>
            {marketData.fuelPrice.futurePrice && (
              <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Futures:{' '}
                {financialService.formatCurrency(
                  marketData.fuelPrice.futurePrice
                )}
              </span>
            )}
          </div>

          <div
            style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '10px',
              marginTop: '8px',
            }}
          >
            Source: {marketData.fuelPrice.source}
          </div>
        </div>

        {/* Exchange Rate Card */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>💱</span>
              <h4
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: 0,
                }}
              >
                USD/CAD Exchange
              </h4>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '16px' }}>{exchangeIndicator.icon}</span>
              <span
                style={{
                  color: exchangeIndicator.color,
                  fontSize: '12px',
                  fontWeight: '600',
                }}
              >
                {exchangeIndicator.text}
              </span>
            </div>
          </div>

          <div style={{ marginBottom: '8px' }}>
            <span
              style={{
                color: 'white',
                fontSize: '28px',
                fontWeight: 'bold',
              }}
            >
              {marketData.exchangeRate.rate.toFixed(4)}
            </span>
          </div>

          <div style={{ fontSize: '12px' }}>
            <span
              style={{
                color: exchangeIndicator.color,
                fontWeight: '600',
              }}
            >
              {marketData.exchangeRate.change >= 0 ? '+' : ''}
              {marketData.exchangeRate.change.toFixed(4)} today
            </span>
          </div>

          <div
            style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '10px',
              marginTop: '8px',
            }}
          >
            Last updated: {marketData.exchangeRate.lastUpdated}
          </div>
        </div>

        {/* Hedging Recommendation Card */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            border: `1px solid ${financialService.getRiskColor(marketData.hedgingRecommendation.risk)}40`,
            gridColumn: 'span 1',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
            }}
          >
            <span style={{ fontSize: '20px' }}>📊</span>
            <h4
              style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                margin: 0,
              }}
            >
              Hedging Intelligence
            </h4>
            <span
              style={{
                background: financialService.getRiskColor(
                  marketData.hedgingRecommendation.risk
                ),
                color: 'white',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: '600',
              }}
            >
              {marketData.hedgingRecommendation.risk}
            </span>
          </div>

          <div
            style={{
              color: 'white',
              fontSize: '14px',
              lineHeight: '1.5',
              marginBottom: '12px',
            }}
          >
            {marketData.hedgingRecommendation.message}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
            }}
          >
            <div>
              <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Confidence:
              </span>
              <span
                style={{ color: 'white', fontWeight: '600', marginLeft: '4px' }}
              >
                {marketData.hedgingRecommendation.confidence}%
              </span>
            </div>
            {marketData.hedgingRecommendation.potentialSavings && (
              <div>
                <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Potential Impact:
                </span>
                <span
                  style={{
                    color: '#10b981',
                    fontWeight: '600',
                    marginLeft: '4px',
                  }}
                >
                  {financialService.formatCurrency(
                    marketData.hedgingRecommendation.potentialSavings
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Market Insights */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        <h4
          style={{
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            margin: '0 0 12px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '18px' }}>💡</span>
          Market Insights
        </h4>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            fontSize: '12px',
          }}
        >
          <div>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              📈 Today's Fuel Impact:
            </span>
            <div style={{ color: 'white', fontWeight: '600' }}>
              {marketData.fuelPrice.priceChange >= 0 ? '+' : ''}
              {financialService.formatCurrency(
                marketData.fuelPrice.priceChange * 100
              )}{' '}
              per 100 gallons
            </div>
          </div>

          <div>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              💱 Cross-Border Impact:
            </span>
            <div style={{ color: 'white', fontWeight: '600' }}>
              {marketData.exchangeRate.change >= 0
                ? 'Favorable'
                : 'Unfavorable'}{' '}
              for USD earnings
            </div>
          </div>

          <div>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              🎯 Recommended Action:
            </span>
            <div style={{ color: 'white', fontWeight: '600' }}>
              {marketData.hedgingRecommendation.type.replace('_', ' ')}
            </div>
          </div>
        </div>
      </div>

      {/* Auto-refresh Notice */}
      <div
        style={{
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '10px',
          marginTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '12px',
        }}
      >
        🔄 Auto-refreshes every hour | 🌐 Real-time market data
      </div>
    </div>
  );
};

export default FinancialDashboard;
