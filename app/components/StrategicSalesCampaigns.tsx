'use client';

import { useEffect, useState } from 'react';
import type {
  Campaign,
  CampaignAudience,
} from '../services/FleetFlowStrategicSalesCampaignService';
import { fleetFlowStrategicSalesCampaign } from '../services/FleetFlowStrategicSalesCampaignService';

/**
 * Strategic Sales Campaigns Component
 *
 * Implements "The Outbound Engine Blueprint" methodology for selling
 * FleetFlow Business Intelligence platform to logistics companies.
 *
 * Integrated into DEPOINTE AI Company Dashboard for daily use.
 */
export default function StrategicSalesCampaigns() {
  const [activeView, setActiveView] = useState<
    'audiences' | 'campaigns' | 'performance' | 'pipeline'
  >('audiences');
  const [audiences, setAudiences] = useState<CampaignAudience[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedAudience, setSelectedAudience] =
    useState<CampaignAudience | null>(null);
  const [pipelineProjection, setPipelineProjection] = useState<any>(null);

  useEffect(() => {
    // Load audiences
    const loadedAudiences = fleetFlowStrategicSalesCampaign.getAllAudiences();
    setAudiences(loadedAudiences);

    // Load campaigns
    const loadedCampaigns = fleetFlowStrategicSalesCampaign.getAllCampaigns();
    setCampaigns(loadedCampaigns);

    // Calculate pipeline projection (1000 monthly outreach)
    const projection =
      fleetFlowStrategicSalesCampaign.calculateExpectedPipeline(1000);
    setPipelineProjection(projection);
  }, []);

  const handleCreateCampaign = async (audienceId: string) => {
    const audience = audiences.find((a) => a.id === audienceId);
    if (!audience) return;

    const campaignName = `${audience.name} - ${new Date().toLocaleDateString()}`;
    const newCampaign = await fleetFlowStrategicSalesCampaign.createCampaign(
      audienceId,
      campaignName
    );

    setCampaigns([...campaigns, newCampaign]);
    setActiveView('campaigns');
  };

  return (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '12px',
        padding: '24px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2
          style={{
            color: 'white',
            fontSize: '1.8rem',
            fontWeight: '700',
            marginBottom: '8px',
          }}
        >
          🎯 Strategic Sales Campaign System
        </h2>
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '1rem',
          }}
        >
          Research-Driven, Funnel-Based Campaigns for FleetFlow Sales
        </p>
        <div
          style={{
            display: 'flex',
            gap: '20px',
            marginTop: '16px',
            padding: '16px',
            background: 'rgba(34, 197, 94, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(34, 197, 94, 0.3)',
          }}
        >
          <div>
            <div
              style={{
                color: 'rgba(34, 197, 94, 1)',
                fontSize: '1.5rem',
                fontWeight: '700',
              }}
            >
              25-50+
            </div>
            <div
              style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}
            >
              Qualified Meetings/Month
            </div>
          </div>
          <div>
            <div
              style={{
                color: 'rgba(34, 197, 94, 1)',
                fontSize: '1.5rem',
                fontWeight: '700',
              }}
            >
              3-8%
            </div>
            <div
              style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}
            >
              Positive Reply Rate
            </div>
          </div>
          <div>
            <div
              style={{
                color: 'rgba(34, 197, 94, 1)',
                fontSize: '1.5rem',
                fontWeight: '700',
              }}
            >
              15.3%
            </div>
            <div
              style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}
            >
              Qualified Meeting Rate
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >
        {[
          { key: 'audiences', label: '👥 Audience Segments', icon: '👥' },
          { key: 'campaigns', label: '📧 Active Campaigns', icon: '📧' },
          { key: 'performance', label: '📊 Performance', icon: '📊' },
          { key: 'pipeline', label: '💰 Pipeline Projection', icon: '💰' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveView(tab.key as any)}
            style={{
              background:
                activeView === tab.key
                  ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                  : 'rgba(255, 255, 255, 0.1)',
              border:
                activeView === tab.key
                  ? 'none'
                  : '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: '8px',
              padding: '12px 24px',
              color: 'white',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Audience Segments View */}
      {activeView === 'audiences' && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h3
              style={{
                color: 'white',
                fontSize: '1.3rem',
                marginBottom: '12px',
              }}
            >
              Target Audience Segments
            </h3>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '16px',
              }}
            >
              Core Lookalikes (70% volume, 6.2% conversion) + Exploratory (30%
              volume, 2.8% conversion)
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
              gap: '16px',
            }}
          >
            {audiences.map((audience) => (
              <div
                key={audience.id}
                style={{
                  background:
                    audience.segment === 'core'
                      ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.1))'
                      : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))',
                  border: `1px solid ${audience.segment === 'core' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                  borderRadius: '12px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => setSelectedAudience(audience)}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '12px',
                  }}
                >
                  <h4
                    style={{
                      color: 'white',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                    }}
                  >
                    {audience.name}
                  </h4>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      background:
                        audience.segment === 'core'
                          ? 'rgba(34, 197, 94, 0.2)'
                          : 'rgba(59, 130, 246, 0.2)',
                      color:
                        audience.segment === 'core'
                          ? 'rgba(34, 197, 94, 1)'
                          : 'rgba(59, 130, 246, 1)',
                    }}
                  >
                    {audience.segment === 'core'
                      ? 'CORE 70%'
                      : 'EXPLORATORY 30%'}
                  </span>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                      marginBottom: '4px',
                    }}
                  >
                    <strong>Size:</strong> {audience.companySize}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                      marginBottom: '4px',
                    }}
                  >
                    <strong>Revenue:</strong> {audience.revenue}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                    }}
                  >
                    <strong>Conversion:</strong>{' '}
                    {(audience.expectedConversionRate * 100).toFixed(1)}%
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.85rem',
                      marginBottom: '6px',
                      fontWeight: '600',
                    }}
                  >
                    Pain Points:
                  </div>
                  {audience.painPoints.slice(0, 3).map((pain, idx) => (
                    <div
                      key={idx}
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '0.8rem',
                        marginBottom: '4px',
                        paddingLeft: '12px',
                      }}
                    >
                      • {pain}
                    </div>
                  ))}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateCampaign(audience.id);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  🚀 Create Campaign
                </button>
              </div>
            ))}
          </div>

          {/* Selected Audience Details Modal */}
          {selectedAudience && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
                padding: '20px',
              }}
              onClick={() => setSelectedAudience(null)}
            >
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  borderRadius: '16px',
                  padding: '32px',
                  maxWidth: '600px',
                  width: '100%',
                  maxHeight: '80vh',
                  overflow: 'auto',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '1.5rem',
                    marginBottom: '20px',
                  }}
                >
                  {selectedAudience.name}
                </h3>

                <div style={{ marginBottom: '20px' }}>
                  <h4
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '1.1rem',
                      marginBottom: '12px',
                    }}
                  >
                    All Pain Points:
                  </h4>
                  {selectedAudience.painPoints.map((pain, idx) => (
                    <div
                      key={idx}
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        marginBottom: '8px',
                        paddingLeft: '16px',
                      }}
                    >
                      • {pain}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedAudience(null)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Campaigns View */}
      {activeView === 'campaigns' && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h3
              style={{
                color: 'white',
                fontSize: '1.3rem',
                marginBottom: '8px',
              }}
            >
              Active Campaigns ({campaigns.length})
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Manage your funnel-based outreach campaigns
            </p>
          </div>

          {campaigns.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '12px',
                border: '1px solid rgba(148, 163, 184, 0.2)',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📧</div>
              <h4
                style={{
                  color: 'white',
                  fontSize: '1.2rem',
                  marginBottom: '8px',
                }}
              >
                No campaigns yet
              </h4>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginBottom: '20px',
                }}
              >
                Create your first strategic campaign from the Audience Segments
                tab
              </p>
              <button
                onClick={() => setActiveView('audiences')}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                View Audience Segments
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gap: '16px',
              }}
            >
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: '12px',
                    padding: '20px',
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
                          fontSize: '1.1rem',
                          marginBottom: '4px',
                        }}
                      >
                        {campaign.name}
                      </h4>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '0.9rem',
                        }}
                      >
                        {campaign.audience.name} •{' '}
                        {campaign.audience.industry.replace('_', ' ')}
                      </p>
                    </div>
                    <span
                      style={{
                        padding: '6px 16px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        background:
                          campaign.status === 'active'
                            ? 'rgba(34, 197, 94, 0.2)'
                            : 'rgba(156, 163, 175, 0.2)',
                        color:
                          campaign.status === 'active'
                            ? 'rgba(34, 197, 94, 1)'
                            : 'rgba(156, 163, 175, 1)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {campaign.status}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(147, 51, 234, 0.1)',
                        border: '1px solid rgba(147, 51, 234, 0.3)',
                        borderRadius: '8px',
                        padding: '12px',
                      }}
                    >
                      <div
                        style={{
                          color: 'rgba(147, 51, 234, 1)',
                          fontSize: '0.8rem',
                          marginBottom: '4px',
                        }}
                      >
                        TOP FUNNEL
                      </div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '1.2rem',
                          fontWeight: '600',
                        }}
                      >
                        {campaign.messages.top.length} variants
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '0.75rem',
                        }}
                      >
                        2.5% reply rate
                      </div>
                    </div>

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
                          color: 'rgba(59, 130, 246, 1)',
                          fontSize: '0.8rem',
                          marginBottom: '4px',
                        }}
                      >
                        MIDDLE FUNNEL
                      </div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '1.2rem',
                          fontWeight: '600',
                        }}
                      >
                        {campaign.messages.middle.length} variants
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '0.75rem',
                        }}
                      >
                        4.8% reply rate
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        borderRadius: '8px',
                        padding: '12px',
                      }}
                    >
                      <div
                        style={{
                          color: 'rgba(34, 197, 94, 1)',
                          fontSize: '0.8rem',
                          marginBottom: '4px',
                        }}
                      >
                        BOTTOM FUNNEL
                      </div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '1.2rem',
                          fontWeight: '600',
                        }}
                      >
                        {campaign.messages.bottom.length} variants
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '0.75rem',
                        }}
                      >
                        8.0% reply rate
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                    }}
                  >
                    <button
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      View Messages
                    </button>
                    <button
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      View Performance
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pipeline Projection View */}
      {activeView === 'pipeline' && pipelineProjection && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h3
              style={{
                color: 'white',
                fontSize: '1.3rem',
                marginBottom: '8px',
              }}
            >
              Pipeline Projection Calculator
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Based on 1,000 monthly outreach emails
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(126, 34, 206, 0.2))',
                border: '1px solid rgba(147, 51, 234, 0.4)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <div
                style={{
                  color: 'rgba(147, 51, 234, 1)',
                  fontSize: '0.9rem',
                  marginBottom: '8px',
                  fontWeight: '600',
                }}
              >
                TOP FUNNEL REPLIES
              </div>
              <div
                style={{ color: 'white', fontSize: '2rem', fontWeight: '700' }}
              >
                {pipelineProjection.topFunnelReplies}
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.85rem',
                }}
              >
                2.5% reply rate
              </div>
            </div>

            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <div
                style={{
                  color: 'rgba(59, 130, 246, 1)',
                  fontSize: '0.9rem',
                  marginBottom: '8px',
                  fontWeight: '600',
                }}
              >
                MIDDLE FUNNEL REPLIES
              </div>
              <div
                style={{ color: 'white', fontSize: '2rem', fontWeight: '700' }}
              >
                {pipelineProjection.middleFunnelReplies}
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.85rem',
                }}
              >
                4.8% reply rate
              </div>
            </div>

            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.2))',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <div
                style={{
                  color: 'rgba(34, 197, 94, 1)',
                  fontSize: '0.9rem',
                  marginBottom: '8px',
                  fontWeight: '600',
                }}
              >
                BOTTOM FUNNEL REPLIES
              </div>
              <div
                style={{ color: 'white', fontSize: '2rem', fontWeight: '700' }}
              >
                {pipelineProjection.bottomFunnelReplies}
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.85rem',
                }}
              >
                8.0% reply rate
              </div>
            </div>

            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2))',
                border: '1px solid rgba(251, 191, 36, 0.4)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <div
                style={{
                  color: 'rgba(251, 191, 36, 1)',
                  fontSize: '0.9rem',
                  marginBottom: '8px',
                  fontWeight: '600',
                }}
              >
                QUALIFIED MEETINGS
              </div>
              <div
                style={{ color: 'white', fontSize: '2rem', fontWeight: '700' }}
              >
                {pipelineProjection.totalMeetings}
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.85rem',
                }}
              >
                15.3% meeting rate
              </div>
            </div>

            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(147, 51, 234, 0.2))',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <div
                style={{
                  color: 'rgba(168, 85, 247, 1)',
                  fontSize: '0.9rem',
                  marginBottom: '8px',
                  fontWeight: '600',
                }}
              >
                EXPECTED DEALS
              </div>
              <div
                style={{ color: 'white', fontSize: '2rem', fontWeight: '700' }}
              >
                {pipelineProjection.expectedDeals}
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.85rem',
                }}
              >
                20% close rate
              </div>
            </div>

            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.2))',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <div
                style={{
                  color: 'rgba(34, 197, 94, 1)',
                  fontSize: '0.9rem',
                  marginBottom: '8px',
                  fontWeight: '600',
                }}
              >
                MONTHLY REVENUE
              </div>
              <div
                style={{ color: 'white', fontSize: '2rem', fontWeight: '700' }}
              >
                ${(pipelineProjection.expectedRevenue / 12).toLocaleString()}
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.85rem',
                }}
              >
                ${pipelineProjection.expectedRevenue.toLocaleString()}/year
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <h4
              style={{
                color: 'white',
                fontSize: '1.1rem',
                marginBottom: '12px',
              }}
            >
              📈 Scalability
            </h4>
            <div
              style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '8px' }}
            >
              • Double outreach to 2,000/month ={' '}
              {pipelineProjection.totalMeetings * 2} meetings
            </div>
            <div
              style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '8px' }}
            >
              • Scale to 5,000/month = {pipelineProjection.totalMeetings * 5}{' '}
              meetings
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              • Results are predictable and repeatable with this systematic
              approach
            </div>
          </div>
        </div>
      )}

      {/* Performance View */}
      {activeView === 'performance' && (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '12px',
            border: '1px solid rgba(148, 163, 184, 0.2)',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📊</div>
          <h4
            style={{ color: 'white', fontSize: '1.2rem', marginBottom: '8px' }}
          >
            Performance Analytics Coming Soon
          </h4>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            Track reply rates, meetings booked, and ROI by campaign
          </p>
        </div>
      )}
    </div>
  );
}

