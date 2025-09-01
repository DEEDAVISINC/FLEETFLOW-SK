'use client';

import React, { useState, useEffect } from 'react';
import USAspendingService, { 
  SpendingRecord, 
  CompetitorAnalysis, 
  AgencySpending, 
  GeographicSpending, 
  MarketIntelligence 
} from '../services/USAspendingService';

export default function GovernmentContractIntelligence() {
  const [activeTab, setActiveTab] = useState<'overview' | 'contracts' | 'competitors' | 'agencies' | 'geography'>('overview');
  const [loading, setLoading] = useState(false);
  const [contracts, setContracts] = useState<SpendingRecord[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorAnalysis[]>([]);
  const [agencies, setAgencies] = useState<AgencySpending[]>([]);
  const [geography, setGeography] = useState<GeographicSpending[]>([]);
  const [marketIntel, setMarketIntel] = useState<MarketIntelligence | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [contractsData, competitorsData, agenciesData, geographyData, marketData] = await Promise.all([
        USAspendingService.searchTransportationContracts(),
        USAspendingService.getCompetitorAnalysis(),
        USAspendingService.getAgencySpendingAnalysis(),
        USAspendingService.getGeographicSpendingAnalysis(),
        USAspendingService.getMarketIntelligence()
      ]);

      setContracts(contractsData);
      setCompetitors(competitorsData);
      setAgencies(agenciesData);
      setGeography(geographyData);
      setMarketIntel(marketData);
    } catch (error) {
      console.error('Error loading government contract data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const TabButton = ({ id, label, icon, active, onClick }: {
    id: string;
    label: string;
    icon: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      style={{
        background: active ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)',
        border: active ? '2px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.2)',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '12px',
        fontWeight: active ? '600' : '500',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px'
      }}
    >
      <span style={{ fontSize: '16px' }}>{icon}</span>
      {label}
    </button>
  );

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '32px',
      marginBottom: '32px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            padding: '12px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '12px'
          }}>
            <span style={{ fontSize: '24px' }}>🏛️</span>
          </div>
          <div>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 8px 0',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)'
            }}>
              Government Contract Intelligence
            </h2>
            <p style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '0 0 4px 0'
            }}>
              USAspending.gov API • Transportation Market Analysis • $2.5B+ Annual Opportunity
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                background: '#10b981',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                FREE API
              </div>
              <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                Estimated Value Add: $3-5M
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          style={{
            background: loading ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '14px'
          }}
        >
          {loading ? 'Refreshing...' : '🔄 Refresh Data'}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <TabButton
          id="overview""
          label=""Market Overview""
          icon=""📊""
          active={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
        />
        <TabButton
          id="contracts""
          label=""Active Contracts""
          icon=""📋""
          active={activeTab === 'contracts'}
          onClick={() => setActiveTab('contracts')}
        />
        <TabButton
          id="competitors""
          label=""Competitor Analysis""
          icon=""🎯""
          active={activeTab === 'competitors'}
          onClick={() => setActiveTab('competitors')}
        />
        <TabButton
          id="agencies""
          label=""Agency Spending""
          icon=""🏢""
          active={activeTab === 'agencies'}
          onClick={() => setActiveTab('agencies')}
        />
        <TabButton
          id="geography""
          label=""Geographic Analysis""
          icon=""🗺️""
          active={activeTab === 'geography'}
          onClick={() => setActiveTab('geography')}
        />
      </div>

      {/* Content */}
      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '300px',
          color: 'white'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid rgba(255, 255, 255, 0.3)',
              borderTop: '4px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }} />
            <p>Loading government contract data...</p>
          </div>
        </div>
      ) : (
        <div>
          {activeTab === 'overview' && marketIntel && (
            <div style={{ display: 'grid', gap: '24px' }}>
              {/* Market Summary */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>💰</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
                    {formatCurrency(marketIntel.total_market_size)}
                  </div>
                  <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Total Market Size
                  </div>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>📈</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                    {formatPercentage(marketIntel.annual_growth_rate)}
                  </div>
                  <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Annual Growth Rate
                  </div>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎯</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                    {formatPercentage(marketIntel.competitive_landscape.market_concentration)}
                  </div>
                  <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Market Concentration
                  </div>
                </div>
              </div>

              {/* Top Opportunities */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '24px'
              }}>
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0' }}>
                  🚀 Top Opportunities
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {marketIntel.top_opportunities.map((opp, index) => (
                    <div key={index} style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      padding: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
                          {opp.agency}
                        </div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                          {opp.timeline}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#10b981', fontSize: '18px', fontWeight: '600' }}>
                          {formatCurrency(opp.estimated_value)}
                        </div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                          {formatPercentage(opp.probability)} probability
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Market Trends */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '24px'
              }}>
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0' }}>
                  📊 Market Trends
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {marketIntel.market_trends.map((trend, index) => (
                    <div key={index} style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px'
                    }}>
                      <div style={{
                        background: trend.impact === 'high' ? '#ef4444' : trend.impact === 'medium' ? '#f59e0b' : '#10b981',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        {trend.impact}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
                          {trend.trend}
                        </div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                          {trend.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contracts' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              {contracts.map((contract) => (
                <div key={contract.id} style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                        {contract.description}
                      </h4>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', marginBottom: '8px' }}>
                        {contract.awarding_agency} • {contract.awarding_sub_agency}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>
                        Award ID: {contract.award_id} • {contract.place_of_performance_city}, {contract.place_of_performance_state}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: '150px' }}>
                      <div style={{ color: '#10b981', fontSize: '24px', fontWeight: 'bold' }}>
                        {formatCurrency(contract.award_amount)}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                        {contract.award_date}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{
                      background: '#3b82f6',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {contract.contract_type}
                    </span>
                    <span style={{
                      background: '#8b5cf6',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {contract.set_aside_type}
                    </span>
                    <span style={{
                      background: '#10b981',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {contract.naics_code}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'competitors' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              {competitors.map((competitor, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div>
                      <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                        {competitor.competitor_name}
                      </h4>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                        {competitor.total_contracts} contracts • {formatPercentage(competitor.market_share)} market share
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#10b981', fontSize: '20px', fontWeight: 'bold' }}>
                        {formatCurrency(competitor.total_value)}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                        {competitor.growth_trend > 0 ? '📈' : '📉'} {formatPercentage(Math.abs(competitor.growth_trend))} growth
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                    <div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', marginBottom: '4px' }}>
                        Primary Agencies:
                      </div>
                      <div style={{ color: 'white', fontSize: '14px' }}>
                        {competitor.primary_agencies.join(', ')}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', marginBottom: '4px' }}>
                        Geographic Presence:
                      </div>
                      <div style={{ color: 'white', fontSize: '14px' }}>
                        {competitor.geographic_presence.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'agencies' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              {agencies.map((agency, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div>
                      <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                        {agency.agency_name}
                      </h4>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                        {agency.contract_count} contracts • {formatCurrency(agency.avg_contract_size)} average
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#10b981', fontSize: '24px', fontWeight: 'bold' }}>
                        {formatCurrency(agency.total_spending)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                        <div style={{
                          background: agency.opportunity_score > 0.8 ? '#10b981' : agency.opportunity_score > 0.6 ? '#f59e0b' : '#ef4444',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {Math.round(agency.opportunity_score * 100)}% Opportunity
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', marginBottom: '4px' }}>
                      Top Contractors:
                    </div>
                    <div style={{ color: 'white', fontSize: '14px' }}>
                      {agency.top_contractors.join(' • ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'geography' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              {geography.map((geo, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div>
                      <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                        {geo.state}
                      </h4>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                        {geo.contract_count} contracts • {formatPercentage(geo.market_saturation)} saturation
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#10b981', fontSize: '20px', fontWeight: 'bold' }}>
                        {formatCurrency(geo.total_spending)}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                        📈 {formatPercentage(geo.growth_rate)} growth
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', marginBottom: '4px' }}>
                        Top Agencies:
                      </div>
                      <div style={{ color: 'white', fontSize: '14px' }}>
                        {geo.top_agencies.join(', ')}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', marginBottom: '4px' }}>
                        Dominant NAICS:
                      </div>
                      <div style={{ color: 'white', fontSize: '14px' }}>
                        {geo.dominant_naics.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 