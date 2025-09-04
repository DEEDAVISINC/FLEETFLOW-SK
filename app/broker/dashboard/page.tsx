'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BrokerPerformanceMetrics } from '../../services/BrokerAnalyticsService';

// Lane Quoting Component
function LaneQuotingComponent() {
  const [quoteForm, setQuoteForm] = useState({
    origin: '',
    destination: '',
    weight: '',
    freightClass: '',
    equipmentType: 'Dry Van',
    serviceType: 'standard',
    specialRequirements: [] as string[],
    hazmat: false,
    temperature: 'ambient' as 'ambient' | 'refrigerated' | 'frozen'
  });

  const [quoteResults, setQuoteResults] = useState<any>(null);
  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false);
  const [quoteHistory, setQuoteHistory] = useState<any[]>([]);

  const handleInputChange = (field: string, value: any) => {
    setQuoteForm(prev => ({ ...prev, [field]: value }));
  };

  const generateQuote = async () => {
    if (!quoteForm.origin || !quoteForm.destination) {
      alert('Please enter origin and destination');
      return;
    }

    setIsGeneratingQuote(true);

    try {
      // Import the FreightQuotingEngine dynamically
      const { FreightQuotingEngine } = await import('../../services/FreightQuotingEngine');

      const quotingEngine = new FreightQuotingEngine();

      // Calculate distance (simplified - in real app would use Google Maps API)
      const distance = Math.floor(Math.random() * 1000) + 100; // Mock distance

      const quoteRequest = {
        id: `quote-${Date.now()}`,
        type: 'LTL' as 'LTL' | 'FTL' | 'Specialized',
        origin: quoteForm.origin,
        destination: quoteForm.destination,
        weight: parseFloat(quoteForm.weight) || 1000,
        freightClass: parseFloat(quoteForm.freightClass) || 55,
        equipmentType: quoteForm.equipmentType,
        serviceType: quoteForm.serviceType,
        distance,
        pickupDate: new Date().toISOString(),
        deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        urgency: quoteForm.serviceType as 'standard' | 'expedited' | 'emergency',
        customerTier: 'gold' as 'bronze' | 'silver' | 'gold' | 'platinum',
        specialRequirements: quoteForm.specialRequirements,
        hazmat: quoteForm.hazmat,
        temperature: quoteForm.temperature
      };

      const quote = await quotingEngine.generateQuote(quoteRequest);
      setQuoteResults(quote);

      // Add to quote history
      setQuoteHistory(prev => [quote, ...prev.slice(0, 4)]);

      console.info('💰 Quote generated successfully:', quote);
    } catch (error) {
      console.error('❌ Error generating quote:', error);
      alert('Error generating quote. Please try again.');
    } finally {
      setIsGeneratingQuote(false);
    }
  };

  return (
    <div style={{ color: 'white' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2
          style={{
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '8px',
            background: 'linear-gradient(45deg, #3b82f6, #06b6d4)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          🛣️ Lane Quoting Engine
        </h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
          Generate AI-powered quotes with market intelligence and competitive analysis
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Quote Form */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
            📝 Generate New Quote
          </h3>

          {/* Origin & Destination */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '6px',
                }}
              >
                Origin
              </label>
              <input
                type="text"
                placeholder="City, State"
                value={quoteForm.origin}
                onChange={(e) => handleInputChange('origin', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
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
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '6px',
                }}
              >
                Destination
              </label>
              <input
                type="text"
                placeholder="City, State"
                value={quoteForm.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Cargo Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '6px',
                }}
              >
                Weight (lbs)
              </label>
              <input
                type="number"
                placeholder="1000"
                value={quoteForm.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
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
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '6px',
                }}
              >
                Freight Class
              </label>
              <select
                value={quoteForm.freightClass}
                onChange={(e) => handleInputChange('freightClass', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                }}
              >
                <option value="">Select Class</option>
                <option value="50">50 - Heavy Machinery</option>
                <option value="55">55 - Bricks, Cement</option>
                <option value="60">60 - Cars, Light Trucks</option>
                <option value="65">65 - Car Parts, Appliances</option>
                <option value="70">70 - Food Items, Books</option>
                <option value="85">85 - Furniture, Clothing</option>
                <option value="92.5">92.5 - Computers, Monitors</option>
                <option value="100">100 - Boats, Cars</option>
                <option value="125">125 - Small Household Goods</option>
              </select>
            </div>
          </div>

          {/* Equipment & Service Type */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '6px',
                }}
              >
                Equipment Type
              </label>
              <select
                value={quoteForm.equipmentType}
                onChange={(e) => handleInputChange('equipmentType', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                }}
              >
                <option value="Dry Van">Dry Van</option>
                <option value="Refrigerated">Refrigerated</option>
                <option value="Flatbed">Flatbed</option>
                <option value="Step Deck">Step Deck</option>
                <option value="Double Drop">Double Drop</option>
              </select>
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '6px',
                }}
              >
                Service Level
              </label>
              <select
                value={quoteForm.serviceType}
                onChange={(e) => handleInputChange('serviceType', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                }}
              >
                <option value="standard">Standard (5-7 days)</option>
                <option value="expedited">Expedited (2-3 days)</option>
                <option value="emergency">Emergency (1-2 days)</option>
              </select>
            </div>
          </div>

          {/* Generate Quote Button */}
          <button
            onClick={generateQuote}
            disabled={isGeneratingQuote}
            style={{
              width: '100%',
              padding: '14px 24px',
              background: isGeneratingQuote
                ? 'rgba(59, 130, 246, 0.5)'
                : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isGeneratingQuote ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
            }}
          >
            {isGeneratingQuote ? (
              <>
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }}
                />
                Generating AI Quote...
              </>
            ) : (
              '🤖 Generate AI Quote'
            )}
          </button>
        </div>

        {/* Quote Results */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
            💰 Quote Results
          </h3>

          {quoteResults ? (
            <div>
              {/* Main Quote */}
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#10b981' }}>
                    AI Recommended Quote
                  </h4>
                  <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                    Confidence: {Math.round(quoteResults.priceConfidence * 100)}%
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
                      Base Rate
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#10b981' }}>
                      ${quoteResults.baseRate.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
                      Fuel Surcharge
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#f59e0b' }}>
                      ${quoteResults.fuelSurcharge.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
                      Total Quote
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#3b82f6' }}>
                      ${quoteResults.totalQuote.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    padding: '4px 12px',
                    background: quoteResults.marketPosition === 'below' ? 'rgba(16, 185, 129, 0.2)' :
                               quoteResults.marketPosition === 'at' ? 'rgba(245, 158, 11, 0.2)' :
                               'rgba(239, 68, 68, 0.2)',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: quoteResults.marketPosition === 'below' ? '#10b981' :
                           quoteResults.marketPosition === 'at' ? '#f59e0b' : '#ef4444'
                  }}>
                    {quoteResults.marketPosition === 'below' ? '🟢 Below Market' :
                     quoteResults.marketPosition === 'at' ? '🟡 At Market' : '🔴 Above Market'}
                  </div>
                  <div style={{
                    padding: '4px 12px',
                    background: quoteResults.winProbability > 70 ? 'rgba(16, 185, 129, 0.2)' :
                               quoteResults.winProbability > 40 ? 'rgba(245, 158, 11, 0.2)' :
                               'rgba(239, 68, 68, 0.2)',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: quoteResults.winProbability > 70 ? '#10b981' :
                           quoteResults.winProbability > 40 ? '#f59e0b' : '#ef4444'
                  }}>
                    🎯 Win: {Math.round(quoteResults.winProbability)}%
                  </div>
                </div>

                {/* Market Intelligence */}
                <div style={{ marginTop: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.9)' }}>
                    📊 Market Intelligence
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Average Market Rate: ${quoteResults.marketIntelligence.averageMarketRate.toLocaleString()}
                    <br />
                    Capacity: {quoteResults.marketIntelligence.demandLevel}
                    <br />
                    Competitors: {quoteResults.marketIntelligence.competitorCount}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  📤 Send to Customer
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  💾 Save Quote
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>
                📊
              </div>
              <p>Generate a quote to see AI-powered pricing and market intelligence</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Quotes */}
      {quoteHistory.length > 0 && (
        <div
          style={{
            marginTop: '32px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
            📋 Recent Quotes
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {quoteHistory.map((quote, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                    {quote.origin} → {quote.destination}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                    ${quote.totalQuote.toLocaleString()} • {Math.round(quote.winProbability)}% win rate
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                    {new Date(quote.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BrokerDashboard() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('quotes-workflow');
  const [isLoading, setIsLoading] = useState(true);
  const [brokerMetrics, setBrokerMetrics] =
    useState<BrokerPerformanceMetrics | null>(null);

  // Load real broker performance metrics
  useEffect(() => {
    const loadBrokerMetrics = async () => {
      try {
        setIsLoading(true);

        // Import the pre-created broker analytics service instance
        const { brokerAnalyticsService } = await import(
          '../../services/BrokerAnalyticsService'
        );

        // Get real performance metrics
        const metrics = brokerAnalyticsService.getBrokerPerformanceMetrics();
        setBrokerMetrics(metrics);

        console.info(
          '🏢 Broker Dashboard: Loaded real performance metrics:',
          metrics
        );
      } catch (error) {
        console.error('🏢 Broker Dashboard: Failed to load metrics:', error);
        // Fallback to empty metrics if service fails
        setBrokerMetrics({
          totalLoads: 0,
          activeLoads: 0,
          completedLoads: 0,
          totalRevenue: 0,
          avgMargin: 0,
          winRate: 0,
          customerCount: 0,
          avgLoadValue: 0,
          monthlyGrowth: 0,
          topCustomers: [],
        } as BrokerPerformanceMetrics);
      } finally {
        setIsLoading(false);
      }
    };

    loadBrokerMetrics();
  }, []);

  // Build KPIs from real data
  const agentKPIs = brokerMetrics
    ? [
        {
          title: 'Active Customers',
          value: brokerMetrics.customerCount,
          unit: '',
          change: brokerMetrics.customerCount > 0 ? '+1' : '--',
          trend: brokerMetrics.customerCount > 0 ? 'up' : 'neutral',
          description: 'Currently active customer accounts',
          color: '#10b981',
          background: 'rgba(16, 185, 129, 0.5)',
          border: 'rgba(16, 185, 129, 0.3)',
        },
        {
          title: 'Active Loads',
          value: brokerMetrics.activeLoads,
          unit: '',
          change:
            brokerMetrics.activeLoads > 0
              ? `+${brokerMetrics.activeLoads}`
              : '--',
          trend: brokerMetrics.activeLoads > 0 ? 'up' : 'neutral',
          description: 'Loads currently in progress',
          color: '#3b82f6',
          background: 'rgba(59, 130, 246, 0.5)',
          border: 'rgba(59, 130, 246, 0.3)',
        },
        {
          title: 'Monthly Revenue',
          value: Math.round(brokerMetrics.totalRevenue / 1000), // Convert to K
          unit: 'K',
          change:
            brokerMetrics.totalRevenue > 0
              ? `$${Math.round(brokerMetrics.totalRevenue / 1000)}K`
              : '--',
          trend: brokerMetrics.totalRevenue > 0 ? 'up' : 'neutral',
          description: 'Revenue generated this month',
          color: '#8b5cf6',
          background: 'rgba(139, 92, 246, 0.5)',
          border: 'rgba(139, 92, 246, 0.3)',
        },
        {
          title: 'Win Rate',
          value: Math.round(brokerMetrics.winRate),
          unit: '%',
          change:
            brokerMetrics.winRate > 0
              ? `${Math.round(brokerMetrics.winRate)}%`
              : '--',
          trend:
            brokerMetrics.winRate > 50
              ? 'up'
              : brokerMetrics.winRate > 0
                ? 'neutral'
                : 'neutral',
          description: 'Load bidding win rate',
          color: '#f59e0b',
          background: 'rgba(245, 158, 11, 0.5)',
          border: 'rgba(245, 158, 11, 0.3)',
        },
      ]
    : [
        // Loading state
        {
          title: 'Active Customers',
          value: '--',
          unit: '',
          change: '--',
          trend: 'neutral',
          description: 'Loading customer data...',
          color: '#10b981',
          background: 'rgba(16, 185, 129, 0.5)',
          border: 'rgba(16, 185, 129, 0.3)',
        },
        {
          title: 'Active Loads',
          value: '--',
          unit: '',
          change: '--',
          trend: 'neutral',
          description: 'Loading load data...',
          color: '#3b82f6',
          background: 'rgba(59, 130, 246, 0.5)',
          border: 'rgba(59, 130, 246, 0.3)',
        },
        {
          title: 'Monthly Revenue',
          value: '--',
          unit: 'K',
          change: '--',
          trend: 'neutral',
          description: 'Loading revenue data...',
          color: '#8b5cf6',
          background: 'rgba(139, 92, 246, 0.5)',
          border: 'rgba(139, 92, 246, 0.3)',
        },
        {
          title: 'Win Rate',
          value: '--',
          unit: '%',
          change: '--',
          trend: 'neutral',
          description: 'Loading performance data...',
          color: '#f59e0b',
          background: 'rgba(245, 158, 11, 0.5)',
          border: 'rgba(245, 158, 11, 0.3)',
        },
      ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage:
          'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #4338ca 50%, #312e81 75%, #1e1b4b 100%), radial-gradient(circle at 20% 20%, rgba(147, 51, 234, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(196, 181, 253, 0.06) 0%, transparent 50%), radial-gradient(circle at 40% 60%, rgba(139, 92, 246, 0.04) 0%, transparent 50%)',
        backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
        backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
        backgroundRepeat: 'no-repeat',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: '20px',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1
            style={{
              color: 'white',
              margin: 0,
              fontSize: '2rem',
              fontWeight: '700',
              background: 'linear-gradient(45deg, #3b82f6, #06b6d4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px',
            }}
          >
            🏢 Brokerage Dashboard
          </h1>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '4px 0 0 0',
              fontSize: '1rem',
              fontWeight: '500',
            }}
          >
            Professional Sales Management • Load Optimization • Customer
            Relations
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginTop: '8px',
            }}
          >
            <span
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10b981',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '600',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              ✅ Broker Active
            </span>
            <span
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#3b82f6',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '600',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              🆔 Connected
            </span>
            <span
              style={{
                background: 'rgba(139, 92, 246, 0.2)',
                color: '#8b5cf6',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '600',
                border: '1px solid rgba(139, 92, 246, 0.3)',
              }}
            >
              📊 Brokerage
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div
            style={{
              textAlign: 'right',
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
              Last Activity
            </div>
            <div style={{ fontSize: '0.8rem' }}>
              {new Date().toLocaleTimeString()}
            </div>
          </div>
          <button
            onClick={() => router.push('/broker')}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#fca5a5',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '24px',
        }}
      >
        {agentKPIs.map((kpi, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 8px 25px ${kpi.background}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '60px',
                height: '60px',
                background: kpi.background,
                borderRadius: '0 0 0 60px',
                opacity: 0.3,
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  margin: 0,
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  opacity: 0.9,
                }}
              >
                {kpi.title}
              </h3>
              <span
                style={{
                  background: kpi.background,
                  color: kpi.color,
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  border: `1px solid ${kpi.border}`,
                }}
              >
                {kpi.change}
              </span>
            </div>
            <div
              style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: kpi.color,
                marginBottom: '8px',
                textShadow: `0 0 20px ${kpi.color}33`,
              }}
            >
              {kpi.value}
              {kpi.unit}
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                margin: 0,
                fontSize: '0.8rem',
                lineHeight: 1.4,
              }}
            >
              {kpi.description}
            </p>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >
        {[
          {
            id: 'quotes-workflow',
            label: 'Quotes & Workflow',
            icon: '💼',
            color: '#8b5cf6',
          },
          {
            id: 'loads-bids',
            label: 'Loads & Bidding',
            icon: '📦',
            color: '#06b6d4',
          },
          {
            id: 'ai-intelligence',
            label: 'AI Intelligence',
            icon: '🤖',
            color: '#ec4899',
          },
          {
            id: 'market-intelligence',
            label: 'Market Intelligence',
            icon: '📈',
            color: '#10b981',
          },
          { id: 'analytics', label: 'Analytics', icon: '📊', color: '#f59e0b' },
          {
            id: 'tasks',
            label: 'Task Management',
            icon: '📋',
            color: '#ef4444',
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            style={{
              padding: '12px 20px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background:
                selectedTab === tab.id
                  ? `linear-gradient(135deg, ${tab.color}88, ${tab.color}66)`
                  : 'rgba(255, 255, 255, 0.1)',
              color:
                selectedTab === tab.id ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              border:
                selectedTab === tab.id
                  ? `2px solid ${tab.color}`
                  : '1px solid rgba(255, 255, 255, 0.2)',
              transform:
                selectedTab === tab.id ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow:
                selectedTab === tab.id ? `0 8px 25px ${tab.color}40` : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          minHeight: '400px',
        }}
      >
        {/* Tab Content */}
        {selectedTab === 'quotes-workflow' && (
          <LaneQuotingComponent />
        )}

        {selectedTab === 'loads-bids' && (
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.7 }}>
              📦
            </div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              Loads & Bidding Management
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px' }}>
              Track active loads and manage bidding strategies
            </p>
          </div>
        )}

        {selectedTab === 'ai-intelligence' && (
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.7 }}>
              🤖
            </div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              AI-Powered Intelligence
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px' }}>
              Advanced analytics and predictive insights
            </p>
          </div>
        )}

        {selectedTab === 'market-intelligence' && (
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.7 }}>
              📈
            </div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              Market Intelligence
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px' }}>
              Real-time market trends and competitive analysis
            </p>
          </div>
        )}

        {selectedTab === 'analytics' && (
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.7 }}>
              📊
            </div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              Advanced Analytics
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px' }}>
              Comprehensive performance metrics and insights
            </p>
          </div>
        )}

        {selectedTab === 'tasks' && (
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.7 }}>
              📋
            </div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              Task Management
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px' }}>
              Organize and track your brokerage tasks
            </p>
          </div>
        )}

        {/* Default Welcome Screen */}
        {!selectedTab && (
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.7 }}>
              🚛
            </div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              Welcome to Your Broker Dashboard
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px' }}>
              Your superior freight brokerage management platform
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
