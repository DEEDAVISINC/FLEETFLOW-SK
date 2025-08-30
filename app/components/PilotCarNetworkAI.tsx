'use client';
import { useEffect, useState } from 'react';

export default function PilotCarNetworkAI() {
  const [leads, setLeads] = useState([]);
  const [conversions, setConversions] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('leads');

  useEffect(() => {
    loadPilotCarData();
  }, [activeTab]);

  const loadPilotCarData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/ai-flow/pilot-car-network?type=${activeTab}&limit=10`
      );
      const result = await response.json();

      if (result.success) {
        if (activeTab === 'leads') {
          setLeads(result.data.leads || []);
        } else if (activeTab === 'conversions') {
          setConversions(result.data.conversions || []);
        } else if (activeTab === 'insights') {
          setInsights(result.data);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to load pilot car data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: '20px',
          textAlign: 'center',
          background: 'rgba(20, 184, 166, 0.1)',
          border: '1px solid rgba(20, 184, 166, 0.3)',
          borderRadius: '12px',
          margin: '16px 0',
        }}
      >
        <div style={{ color: '#14b8a6', fontSize: '16px' }}>
          🚗 Loading FleetFlow Pilot Car Network...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background:
          'linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(6, 182, 212, 0.1))',
        border: '1px solid rgba(20, 184, 166, 0.3)',
        borderRadius: '12px',
        padding: '24px',
        margin: '16px 0',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <div>
          <h3
            style={{
              color: '#14b8a6',
              margin: '0 0 8px 0',
              fontSize: '20px',
              fontWeight: '700',
            }}
          >
            🚗 FleetFlow Pilot Car Network AI
          </h3>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              margin: 0,
              fontSize: '14px',
            }}
          >
            AI-powered lead generation and conversion for our exclusive pilot
            car network
          </p>
        </div>
        <div
          style={{
            background: 'rgba(20, 184, 166, 0.2)',
            border: '1px solid rgba(20, 184, 166, 0.4)',
            borderRadius: '8px',
            padding: '8px 12px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              color: '#14b8a6',
              fontSize: '14px',
              fontWeight: '700',
            }}
          >
            50% Margins
          </div>
          <div
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '10px',
            }}
          >
            vs External Services
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '12px',
        }}
      >
        {[
          { id: 'leads', label: '🎯 Active Leads', color: '#f59e0b' },
          { id: 'conversions', label: '✅ Conversions', color: '#10b981' },
          { id: 'insights', label: '📊 Market Intel', color: '#8b5cf6' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background:
                activeTab === tab.id
                  ? `linear-gradient(135deg, ${tab.color}, ${tab.color}dd)`
                  : 'transparent',
              color: activeTab === tab.id ? 'white' : tab.color,
              border: `1px solid ${tab.color}40`,
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Leads Tab */}
      {activeTab === 'leads' && (
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <h4 style={{ color: '#f59e0b', fontSize: '16px', margin: 0 }}>
              🎯 Pilot Car Service Leads
            </h4>
            <div
              style={{
                color: '#10b981',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              $
              {leads
                .reduce((sum, lead) => sum + lead.potentialValue, 0)
                .toLocaleString()}{' '}
              potential
            </div>
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {leads.map((lead, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '16px',
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
                  <div>
                    <h5
                      style={{
                        color: '#14b8a6',
                        fontSize: '14px',
                        fontWeight: '600',
                        margin: '0 0 4px 0',
                      }}
                    >
                      {lead.customerName}
                    </h5>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                        margin: '0 0 4px 0',
                      }}
                    >
                      {lead.loadRequirements.route.origin} →{' '}
                      {lead.loadRequirements.route.destination}
                    </p>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '11px',
                        margin: 0,
                      }}
                    >
                      Source: {lead.leadSource.replace(/_/g, ' ')} •{' '}
                      {lead.customerType}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        color: '#10b981',
                        fontSize: '14px',
                        fontWeight: '700',
                        marginBottom: '4px',
                      }}
                    >
                      ${lead.potentialValue.toLocaleString()}
                    </div>
                    <div
                      style={{
                        background:
                          lead.priority === 'urgent'
                            ? '#dc262640'
                            : '#f59e0b40',
                        color:
                          lead.priority === 'urgent' ? '#dc2626' : '#f59e0b',
                        fontSize: '10px',
                        fontWeight: '600',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      {lead.priority.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Services Required */}
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                    marginBottom: '12px',
                  }}
                >
                  {Object.entries(lead.pilotCarNeeds).map(
                    ([service, required]) =>
                      required && (
                        <span
                          key={service}
                          style={{
                            background: 'rgba(20, 184, 166, 0.2)',
                            color: '#14b8a6',
                            fontSize: '10px',
                            fontWeight: '600',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            textTransform: 'capitalize',
                          }}
                        >
                          {service.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      )
                  )}
                </div>

                {/* Load Details */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '4px',
                    padding: '8px',
                    marginBottom: '12px',
                  }}
                >
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '11px',
                      marginBottom: '4px',
                    }}
                  >
                    📦 {lead.loadRequirements.dimensions.length}' ×{' '}
                    {lead.loadRequirements.dimensions.width}' ×{' '}
                    {lead.loadRequirements.dimensions.height}' •{' '}
                    {lead.loadRequirements.dimensions.weight.toLocaleString()}{' '}
                    lbs
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '11px',
                    }}
                  >
                    🗺️ {lead.loadRequirements.route.miles} miles •{' '}
                    {lead.loadRequirements.route.states.join(', ')}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #14b8a6, #0891b2)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    📞 Contact Lead
                  </button>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    💰 Generate Quote
                  </button>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    🚗 Assign Operator
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conversions Tab */}
      {activeTab === 'conversions' && (
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <h4 style={{ color: '#10b981', fontSize: '16px', margin: 0 }}>
              ✅ Successful Conversions
            </h4>
            <div
              style={{
                color: '#10b981',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              $
              {conversions
                .reduce(
                  (sum, conv) =>
                    sum + (conv.pilotCarDetails?.fleetFlowMargin || 0),
                  0
                )
                .toLocaleString()}{' '}
              FleetFlow revenue
            </div>
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {conversions.map((conversion, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '8px',
                  padding: '16px',
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
                  <div>
                    <h5
                      style={{
                        color: '#10b981',
                        fontSize: '14px',
                        fontWeight: '600',
                        margin: '0 0 4px 0',
                      }}
                    >
                      {conversion.customerName}
                    </h5>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                        margin: '0 0 4px 0',
                      }}
                    >
                      {conversion.serviceType}
                    </p>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '11px',
                        margin: 0,
                      }}
                    >
                      Operator: {conversion.pilotCarDetails?.operatorAssigned}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        color: '#10b981',
                        fontSize: '14px',
                        fontWeight: '700',
                        marginBottom: '2px',
                      }}
                    >
                      ${conversion.actualValue?.toLocaleString()}
                    </div>
                    <div
                      style={{
                        color: '#f59e0b',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      Margin: $
                      {conversion.pilotCarDetails?.fleetFlowMargin?.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      background:
                        conversion.status === 'completed'
                          ? '#10b98140'
                          : '#f59e0b40',
                      color:
                        conversion.status === 'completed'
                          ? '#10b981'
                          : '#f59e0b',
                      fontSize: '10px',
                      fontWeight: '600',
                      padding: '4px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    {conversion.status.replace('_', ' ').toUpperCase()}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '11px',
                    }}
                  >
                    📍 {conversion.pilotCarDetails?.routeCovered}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && insights && (
        <div>
          <h4
            style={{ color: '#8b5cf6', fontSize: '16px', marginBottom: '16px' }}
          >
            📊 Market Intelligence & Network Performance
          </h4>

          {/* Network Stats */}
          {insights.networkStats && (
            <div
              style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '20px',
              }}
            >
              <h5
                style={{
                  color: '#8b5cf6',
                  fontSize: '14px',
                  marginBottom: '12px',
                }}
              >
                🌐 FleetFlow Network Performance
              </h5>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '12px',
                }}
              >
                {[
                  {
                    label: 'Total Operators',
                    value: insights.networkStats.totalOperators,
                    icon: '👨‍💼',
                  },
                  {
                    label: 'Active Now',
                    value: insights.networkStats.activeOperators,
                    icon: '🟢',
                  },
                  {
                    label: 'States Covered',
                    value: insights.networkStats.statesCovered,
                    icon: '🗺️',
                  },
                  {
                    label: 'Avg Rating',
                    value: `${insights.networkStats.averageRating}⭐`,
                    icon: '⭐',
                  },
                  {
                    label: 'Jobs Completed',
                    value: insights.networkStats.completedJobs.toLocaleString(),
                    icon: '✅',
                  },
                  {
                    label: 'Total Revenue',
                    value: `$${Math.round(insights.networkStats.totalRevenue / 1000)}K`,
                    icon: '💰',
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '6px',
                      padding: '8px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '14px', marginBottom: '2px' }}>
                      {stat.icon}
                    </div>
                    <div
                      style={{
                        color: '#8b5cf6',
                        fontSize: '12px',
                        fontWeight: '700',
                        marginBottom: '2px',
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '9px',
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Market Trends */}
          <div style={{ marginBottom: '20px' }}>
            <h5
              style={{
                color: '#8b5cf6',
                fontSize: '14px',
                marginBottom: '12px',
              }}
            >
              📈 Market Trends
            </h5>
            <div style={{ display: 'grid', gap: '8px' }}>
              {insights.marketTrends?.map((trend, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '6px',
                    padding: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '4px',
                    }}
                  >
                    <h6
                      style={{
                        color: '#8b5cf6',
                        fontSize: '12px',
                        fontWeight: '600',
                        margin: 0,
                      }}
                    >
                      {trend.trend}
                    </h6>
                    <span
                      style={{
                        color: '#10b981',
                        fontSize: '11px',
                        fontWeight: '700',
                      }}
                    >
                      {trend.opportunity}
                    </span>
                  </div>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '11px',
                      margin: '0 0 4px 0',
                    }}
                  >
                    {trend.description}
                  </p>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '10px',
                      margin: 0,
                    }}
                  >
                    Impact: {trend.impact} • {trend.timeframe}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Opportunities */}
          <div style={{ marginBottom: '20px' }}>
            <h5
              style={{
                color: '#f59e0b',
                fontSize: '14px',
                marginBottom: '12px',
              }}
            >
              💰 Revenue Opportunities
            </h5>
            <div style={{ display: 'grid', gap: '8px' }}>
              {insights.opportunities?.map((opp, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '6px',
                    padding: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '4px',
                    }}
                  >
                    <h6
                      style={{
                        color: '#f59e0b',
                        fontSize: '12px',
                        fontWeight: '600',
                        margin: 0,
                      }}
                    >
                      {opp.opportunity}
                    </h6>
                    <span
                      style={{
                        color: '#10b981',
                        fontSize: '11px',
                        fontWeight: '700',
                      }}
                    >
                      {opp.potential}
                    </span>
                  </div>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '11px',
                      margin: '0 0 8px 0',
                    }}
                  >
                    {opp.description}
                  </p>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '10px',
                      marginBottom: '8px',
                    }}
                  >
                    Requirements: {opp.requirements}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '4px',
                      flexWrap: 'wrap',
                    }}
                  >
                    {opp.actionItems?.map((action, actionIndex) => (
                      <span
                        key={actionIndex}
                        style={{
                          background: 'rgba(245, 158, 11, 0.2)',
                          color: '#f59e0b',
                          fontSize: '9px',
                          fontWeight: '600',
                          padding: '2px 6px',
                          borderRadius: '3px',
                        }}
                      >
                        • {action}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div>
            <h5
              style={{
                color: '#14b8a6',
                fontSize: '14px',
                marginBottom: '12px',
              }}
            >
              🎯 AI Strategic Recommendations
            </h5>
            <div style={{ display: 'grid', gap: '6px' }}>
              {insights.recommendations?.map((rec, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(20, 184, 166, 0.1)',
                    border: '1px solid rgba(20, 184, 166, 0.3)',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '11px',
                  }}
                >
                  • {rec}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
