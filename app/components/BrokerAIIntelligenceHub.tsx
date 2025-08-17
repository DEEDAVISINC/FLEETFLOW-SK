'use client';

import { useEffect, useState } from 'react';
import {
  BidOptimization,
  CustomerInsight,
  LoadOpportunity,
  MarginPrediction,
  RiskAssessment,
  brokerAIIntelligenceService,
} from '../services/BrokerAIIntelligenceService';

interface Props {
  brokerId: string;
}

export default function BrokerAIIntelligenceHub({ brokerId }: Props) {
  const [activeTab, setActiveTab] = useState<
    'opportunities' | 'insights' | 'optimization' | 'risk' | 'performance'
  >('opportunities');
  const [loadOpportunities, setLoadOpportunities] = useState<LoadOpportunity[]>(
    []
  );
  const [selectedLoadId, setSelectedLoadId] = useState<string>('');
  const [marginPrediction, setMarginPrediction] =
    useState<MarginPrediction | null>(null);
  const [bidOptimization, setBidOptimization] =
    useState<BidOptimization | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(
    null
  );
  const [customerInsight, setCustomerInsight] =
    useState<CustomerInsight | null>(null);
  const [performanceInsights, setPerformanceInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAIData();
  }, [brokerId]);

  const loadAIData = async () => {
    setIsLoading(true);
    try {
      const opportunities =
        brokerAIIntelligenceService.getSmartLoadMatches(brokerId);
      setLoadOpportunities(opportunities);

      const insights =
        brokerAIIntelligenceService.getBrokerPerformanceInsights(brokerId);
      setPerformanceInsights(insights);
    } catch (error) {
      console.error('Error loading AI data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSelect = (loadId: string) => {
    setSelectedLoadId(loadId);

    // Load detailed analysis for selected load
    try {
      const margin = brokerAIIntelligenceService.predictLoadMargin(loadId);
      const bid = brokerAIIntelligenceService.optimizeBid(loadId);
      const risk = brokerAIIntelligenceService.assessLoadRisk(loadId);

      setMarginPrediction(margin);
      setBidOptimization(bid);
      setRiskAssessment(risk);

      // Get customer insight if available
      const load = loadOpportunities.find((l) => l.id === loadId);
      if (load) {
        const insight = brokerAIIntelligenceService.getCustomerInsights(
          load.shipperName.toLowerCase().replace(/\s+/g, '')
        );
        setCustomerInsight(insight);
      }
    } catch (error) {
      console.error('Error loading load details:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10b981'; // Green
    if (score >= 80) return '#f59e0b'; // Yellow
    if (score >= 70) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const getRiskColor = (risk: 'LOW' | 'MEDIUM' | 'HIGH') => {
    switch (risk) {
      case 'LOW':
        return '#10b981';
      case 'MEDIUM':
        return '#f59e0b';
      case 'HIGH':
        return '#ef4444';
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;
  const formatPercent = (percent: number) => `${percent.toFixed(1)}%`;

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
          color: 'white',
        }}
      >
        <div>🤖 Loading AI Intelligence...</div>
      </div>
    );
  }

  return (
    <div>
      {/* AI Hub Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          🤖 AI Intelligence Hub
          <span
            style={{
              fontSize: '12px',
              background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
              padding: '4px 8px',
              borderRadius: '6px',
              fontWeight: '500',
            }}
          >
            POWERED BY AI
          </span>
        </h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
          Smart load matching, predictive analysis, and optimization
          recommendations
        </p>
      </div>

      {/* AI Tab Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >
        {[
          { id: 'opportunities', label: 'Smart Matches', icon: '🎯' },
          { id: 'insights', label: 'Customer Intel', icon: '👥' },
          { id: 'optimization', label: 'Bid Optimizer', icon: '💰' },
          { id: 'risk', label: 'Risk Analysis', icon: '🛡️' },
          { id: 'performance', label: 'AI Insights', icon: '📊' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.3s ease',
              background:
                activeTab === tab.id
                  ? 'linear-gradient(135deg, #8b5cf6, #a855f7)'
                  : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span style={{ marginRight: '6px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Areas */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          minHeight: '500px',
        }}
      >
        {/* Smart Load Opportunities */}
        {activeTab === 'opportunities' && (
          <div>
            <h3
              style={{
                color: 'white',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              🎯 AI-Ranked Load Opportunities
              <span
                style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}
              >
                Sorted by AI compatibility score
              </span>
            </h3>

            <div style={{ display: 'grid', gap: '12px' }}>
              {loadOpportunities.map((load) => (
                <div
                  key={load.id}
                  onClick={() => handleLoadSelect(load.id)}
                  style={{
                    background:
                      selectedLoadId === load.id
                        ? 'rgba(139, 92, 246, 0.2)'
                        : 'rgba(255, 255, 255, 0.08)',
                    border:
                      selectedLoadId === load.id
                        ? '2px solid #8b5cf6'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    if (selectedLoadId !== load.id) {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.12)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedLoadId !== load.id) {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.08)';
                    }
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '12px',
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
                        <h4
                          style={{
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: '600',
                            margin: 0,
                          }}
                        >
                          {load.shipperName}
                        </h4>
                        <div
                          style={{
                            background: getScoreColor(load.aiScore),
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          AI Score: {load.aiScore}
                        </div>
                        <div
                          style={{
                            background: getRiskColor(load.riskLevel),
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          {load.riskLevel} Risk
                        </div>
                      </div>

                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '14px',
                          marginBottom: '8px',
                        }}
                      >
                        📍 {load.origin} → {load.destination} ({load.distance}{' '}
                        mi)
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          gap: '16px',
                          fontSize: '13px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        <span>🚛 {load.equipmentType}</span>
                        <span>⚖️ {(load.weight / 1000).toFixed(0)}k lbs</span>
                        <span>📦 {load.commodity}</span>
                        <span>📅 {load.pickupDate}</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          color: '#10b981',
                          fontSize: '18px',
                          fontWeight: 'bold',
                        }}
                      >
                        {formatCurrency(load.estimatedRate)}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '12px',
                        }}
                      >
                        {formatPercent(load.predictedMargin)} margin
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '12px',
                        }}
                      >
                        {load.competitionLevel} competitors
                      </div>
                    </div>
                  </div>

                  {/* AI Recommendations Preview */}
                  <div
                    style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      borderRadius: '8px',
                      padding: '10px',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.8)',
                        marginBottom: '6px',
                      }}
                    >
                      🤖 AI Recommendations:
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.9)',
                      }}
                    >
                      {load.recommendations[0]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customer Intelligence */}
        {activeTab === 'insights' && (
          <div>
            <h3 style={{ color: 'white', marginBottom: '16px' }}>
              👥 Customer Intelligence & Insights
            </h3>

            {customerInsight ? (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '20px',
                  }}
                >
                  <div>
                    <h4
                      style={{
                        color: 'white',
                        fontSize: '20px',
                        fontWeight: '600',
                        margin: 0,
                        marginBottom: '8px',
                      }}
                    >
                      {customerInsight.shipperName}
                    </h4>
                    <div
                      style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          background:
                            customerInsight.relationshipScore >= 90
                              ? '#10b981'
                              : customerInsight.relationshipScore >= 70
                                ? '#f59e0b'
                                : '#ef4444',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        Relationship Score: {customerInsight.relationshipScore}
                      </div>
                      <div
                        style={{
                          background:
                            customerInsight.paymentHistory === 'EXCELLENT'
                              ? '#10b981'
                              : customerInsight.paymentHistory === 'GOOD'
                                ? '#f59e0b'
                                : '#ef4444',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {customerInsight.paymentHistory} Payment History
                      </div>
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
                      {formatPercent(customerInsight.averageMargin)}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '12px',
                      }}
                    >
                      Average Margin
                    </div>
                  </div>
                </div>

                {/* Customer Metrics Grid */}
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
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '16px',
                      borderRadius: '8px',
                    }}
                  >
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                        marginBottom: '4px',
                      }}
                    >
                      Bid Acceptance Rate
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '20px',
                        fontWeight: 'bold',
                      }}
                    >
                      {customerInsight.bidAcceptanceRate}%
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '16px',
                      borderRadius: '8px',
                    }}
                  >
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                        marginBottom: '4px',
                      }}
                    >
                      Volume Trend
                    </div>
                    <div
                      style={{
                        color:
                          customerInsight.volumeTrend === 'INCREASING'
                            ? '#10b981'
                            : customerInsight.volumeTrend === 'STABLE'
                              ? '#f59e0b'
                              : '#ef4444',
                        fontSize: '16px',
                        fontWeight: 'bold',
                      }}
                    >
                      {customerInsight.volumeTrend}
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '16px',
                      borderRadius: '8px',
                    }}
                  >
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                        marginBottom: '4px',
                      }}
                    >
                      Negotiation Style
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      {customerInsight.negotiationStyle.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                {/* Preferences & Opportunities */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px',
                  }}
                >
                  <div>
                    <h5
                      style={{
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '8px',
                      }}
                    >
                      Preferred Services
                    </h5>
                    <div
                      style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}
                    >
                      {customerInsight.preferredServices.map((service, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: 'rgba(59, 130, 246, 0.2)',
                            color: '#60a5fa',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                          }}
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5
                      style={{
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '8px',
                      }}
                    >
                      Upsell Potential
                    </h5>
                    <div
                      style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}
                    >
                      {customerInsight.upsellPotential.map(
                        (opportunity, idx) => (
                          <span
                            key={idx}
                            style={{
                              background: 'rgba(16, 185, 129, 0.2)',
                              color: '#34d399',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                            }}
                          >
                            {opportunity}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Next Opportunity Prediction */}
                <div
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                    marginTop: '16px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginBottom: '4px',
                    }}
                  >
                    🔮 Next Opportunity Prediction:
                  </div>
                  <div style={{ color: 'white', fontSize: '14px' }}>
                    {customerInsight.nextOpportunityPrediction}
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.6)',
                  padding: '40px',
                }}
              >
                Select a load from Smart Matches to view customer insights
              </div>
            )}
          </div>
        )}

        {/* Bid Optimization */}
        {activeTab === 'optimization' && (
          <div>
            <h3 style={{ color: 'white', marginBottom: '16px' }}>
              💰 AI Bid Optimization
            </h3>

            {bidOptimization ? (
              <div style={{ display: 'grid', gap: '20px' }}>
                {/* Optimization Summary */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <h4
                      style={{
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: '600',
                        margin: 0,
                      }}
                    >
                      Recommended Bid Strategy
                    </h4>
                    <div
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      {bidOptimization.winProbability}% Win Probability
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '16px',
                      marginBottom: '20px',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '12px',
                          marginBottom: '4px',
                        }}
                      >
                        Recommended Bid
                      </div>
                      <div
                        style={{
                          color: '#10b981',
                          fontSize: '24px',
                          fontWeight: 'bold',
                        }}
                      >
                        {formatCurrency(bidOptimization.recommendedBid)}
                      </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '12px',
                          marginBottom: '4px',
                        }}
                      >
                        Bid Range
                      </div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '600',
                        }}
                      >
                        {formatCurrency(bidOptimization.bidRange.min)} -{' '}
                        {formatCurrency(bidOptimization.bidRange.max)}
                      </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '12px',
                          marginBottom: '4px',
                        }}
                      >
                        Competitor Avg
                      </div>
                      <div
                        style={{
                          color: '#f59e0b',
                          fontSize: '16px',
                          fontWeight: '600',
                        }}
                      >
                        {formatCurrency(
                          bidOptimization.competitorAnalysis.averageBid
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rationale */}
                  <div style={{ marginBottom: '16px' }}>
                    <h5
                      style={{
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '8px',
                      }}
                    >
                      AI Rationale:
                    </h5>
                    <ul
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '14px',
                        margin: 0,
                        paddingLeft: '20px',
                      }}
                    >
                      {bidOptimization.rationale.map((reason, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Strategic Notes */}
                  <div
                    style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px',
                      padding: '12px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        marginBottom: '8px',
                      }}
                    >
                      💡 Strategic Notes:
                    </div>
                    {bidOptimization.strategicNotes.map((note, idx) => (
                      <div
                        key={idx}
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '13px',
                          marginBottom: '4px',
                        }}
                      >
                        • {note}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Competitor Analysis */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <h4
                    style={{
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '600',
                      marginBottom: '12px',
                    }}
                  >
                    Competitive Landscape
                  </h4>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '12px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '12px',
                        }}
                      >
                        Active Competitors
                      </div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          fontWeight: 'bold',
                        }}
                      >
                        {bidOptimization.competitorAnalysis.bidCount}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '12px',
                        }}
                      >
                        Average Bid
                      </div>
                      <div
                        style={{
                          color: '#f59e0b',
                          fontSize: '18px',
                          fontWeight: 'bold',
                        }}
                      >
                        {formatCurrency(
                          bidOptimization.competitorAnalysis.averageBid
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '12px',
                        marginBottom: '8px',
                      }}
                    >
                      Top Competitors:
                    </div>
                    <div
                      style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
                    >
                      {bidOptimization.competitorAnalysis.topCompetitors.map(
                        (competitor, idx) => (
                          <span
                            key={idx}
                            style={{
                              background: 'rgba(239, 68, 68, 0.2)',
                              color: '#f87171',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                            }}
                          >
                            {competitor}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.6)',
                  padding: '40px',
                }}
              >
                Select a load from Smart Matches to view bid optimization
              </div>
            )}
          </div>
        )}

        {/* Risk Analysis */}
        {activeTab === 'risk' && (
          <div>
            <h3 style={{ color: 'white', marginBottom: '16px' }}>
              🛡️ AI Risk Analysis
            </h3>

            {riskAssessment ? (
              <div style={{ display: 'grid', gap: '20px' }}>
                {/* Overall Risk Summary */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '20px',
                    }}
                  >
                    <h4
                      style={{
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: '600',
                        margin: 0,
                      }}
                    >
                      Overall Risk Assessment
                    </h4>
                    <div
                      style={{
                        background: getRiskColor(riskAssessment.overallRisk),
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      {riskAssessment.overallRisk} RISK
                    </div>
                  </div>

                  {/* Risk Factors Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '16px',
                      marginBottom: '20px',
                    }}
                  >
                    {Object.entries(riskAssessment.riskFactors).map(
                      ([factor, value]) => (
                        <div
                          key={factor}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '8px',
                            padding: '16px',
                            textAlign: 'center',
                          }}
                        >
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '12px',
                              marginBottom: '8px',
                            }}
                          >
                            {factor
                              .replace(/([A-Z])/g, ' $1')
                              .replace(/^./, (str) => str.toUpperCase())}
                          </div>
                          <div
                            style={{
                              width: '100%',
                              height: '8px',
                              background: 'rgba(255, 255, 255, 0.2)',
                              borderRadius: '4px',
                              marginBottom: '8px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${value * 100}%`,
                                height: '100%',
                                background:
                                  value < 0.3
                                    ? '#10b981'
                                    : value < 0.6
                                      ? '#f59e0b'
                                      : '#ef4444',
                                borderRadius: '4px',
                                transition: 'width 0.3s ease',
                              }}
                            />
                          </div>
                          <div
                            style={{
                              color:
                                value < 0.3
                                  ? '#10b981'
                                  : value < 0.6
                                    ? '#f59e0b'
                                    : '#ef4444',
                              fontSize: '14px',
                              fontWeight: 'bold',
                            }}
                          >
                            {formatPercent(value * 100)}
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  {/* Mitigation Strategies */}
                  <div>
                    <h5
                      style={{
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '12px',
                      }}
                    >
                      🛡️ Recommended Mitigation Strategies:
                    </h5>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {riskAssessment.mitigation.map((strategy, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: '8px',
                            padding: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <span style={{ color: '#60a5fa', fontSize: '12px' }}>
                            •
                          </span>
                          <span
                            style={{
                              color: 'rgba(255, 255, 255, 0.9)',
                              fontSize: '13px',
                            }}
                          >
                            {strategy}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Insurance Recommendation */}
                  {riskAssessment.insuranceRecommendation && (
                    <div
                      style={{
                        background: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        borderRadius: '8px',
                        padding: '16px',
                        marginTop: '16px',
                      }}
                    >
                      <h5
                        style={{
                          color: '#f59e0b',
                          fontSize: '14px',
                          fontWeight: '600',
                          marginBottom: '8px',
                        }}
                      >
                        ⚠️ Insurance Recommendation
                      </h5>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '13px',
                        }}
                      >
                        Additional coverage recommended:{' '}
                        {formatCurrency(
                          riskAssessment.insuranceRecommendation.coverage
                        )}
                        <br />
                        Estimated premium:{' '}
                        {formatCurrency(
                          riskAssessment.insuranceRecommendation.premium
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.6)',
                  padding: '40px',
                }}
              >
                Select a load from Smart Matches to view risk analysis
              </div>
            )}
          </div>
        )}

        {/* Performance Insights */}
        {activeTab === 'performance' && (
          <div>
            <h3 style={{ color: 'white', marginBottom: '16px' }}>
              📊 AI Performance Insights
            </h3>

            {performanceInsights && (
              <div style={{ display: 'grid', gap: '20px' }}>
                {/* AI Impact Metrics */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <h4
                    style={{
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '16px',
                    }}
                  >
                    🚀 AI Optimization Impact
                  </h4>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '12px',
                          marginBottom: '4px',
                        }}
                      >
                        Margin Improvement
                      </div>
                      <div
                        style={{
                          color: '#10b981',
                          fontSize: '24px',
                          fontWeight: 'bold',
                        }}
                      >
                        +
                        {formatPercent(
                          performanceInsights.aiOptimizationImpact
                            .marginImprovement
                        )}
                      </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '12px',
                          marginBottom: '4px',
                        }}
                      >
                        Win Rate Increase
                      </div>
                      <div
                        style={{
                          color: '#10b981',
                          fontSize: '24px',
                          fontWeight: 'bold',
                        }}
                      >
                        +
                        {formatPercent(
                          performanceInsights.aiOptimizationImpact
                            .winRateIncrease
                        )}
                      </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '12px',
                          marginBottom: '4px',
                        }}
                      >
                        Time to Book
                      </div>
                      <div
                        style={{
                          color: '#10b981',
                          fontSize: '24px',
                          fontWeight: 'bold',
                        }}
                      >
                        {performanceInsights.aiOptimizationImpact.timeToBook}%
                      </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '12px',
                          marginBottom: '4px',
                        }}
                      >
                        Customer Satisfaction
                      </div>
                      <div
                        style={{
                          color: '#10b981',
                          fontSize: '24px',
                          fontWeight: 'bold',
                        }}
                      >
                        {
                          performanceInsights.aiOptimizationImpact
                            .customerSatisfaction
                        }
                        /10
                      </div>
                    </div>
                  </div>
                </div>

                {/* Smart Recommendations */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <h4
                    style={{
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '600',
                      marginBottom: '12px',
                    }}
                  >
                    🎯 Smart Recommendations
                  </h4>

                  <div style={{ display: 'grid', gap: '8px' }}>
                    {performanceInsights.smartRecommendations.map(
                      (recommendation: string, idx: number) => (
                        <div
                          key={idx}
                          style={{
                            background: 'rgba(139, 92, 246, 0.1)',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            borderRadius: '8px',
                            padding: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <span style={{ color: '#a855f7', fontSize: '14px' }}>
                            💡
                          </span>
                          <span
                            style={{
                              color: 'rgba(255, 255, 255, 0.9)',
                              fontSize: '14px',
                            }}
                          >
                            {recommendation}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Trend Analysis */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <h4
                    style={{
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '600',
                      marginBottom: '16px',
                    }}
                  >
                    📈 Market Trend Analysis
                  </h4>

                  <div style={{ display: 'grid', gap: '16px' }}>
                    <div>
                      <h5
                        style={{
                          color: '#10b981',
                          fontSize: '14px',
                          fontWeight: '600',
                          marginBottom: '8px',
                        }}
                      >
                        🚀 Best Performing Lanes
                      </h5>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '8px',
                        }}
                      >
                        {performanceInsights.trendAnalysis.bestPerformingLanes.map(
                          (lane: string, idx: number) => (
                            <span
                              key={idx}
                              style={{
                                background: 'rgba(16, 185, 129, 0.2)',
                                color: '#34d399',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                              }}
                            >
                              {lane}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <h5
                        style={{
                          color: '#f59e0b',
                          fontSize: '14px',
                          fontWeight: '600',
                          marginBottom: '8px',
                        }}
                      >
                        🌟 Emerging Opportunities
                      </h5>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '8px',
                        }}
                      >
                        {performanceInsights.trendAnalysis.emergingOpportunities.map(
                          (opportunity: string, idx: number) => (
                            <span
                              key={idx}
                              style={{
                                background: 'rgba(245, 158, 11, 0.2)',
                                color: '#fbbf24',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                border: '1px solid rgba(245, 158, 11, 0.3)',
                              }}
                            >
                              {opportunity}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <h5
                        style={{
                          color: '#ef4444',
                          fontSize: '14px',
                          fontWeight: '600',
                          marginBottom: '8px',
                        }}
                      >
                        ⚠️ Market Threats
                      </h5>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '8px',
                        }}
                      >
                        {performanceInsights.trendAnalysis.marketThreats.map(
                          (threat: string, idx: number) => (
                            <span
                              key={idx}
                              style={{
                                background: 'rgba(239, 68, 68, 0.2)',
                                color: '#f87171',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                              }}
                            >
                              {threat}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
