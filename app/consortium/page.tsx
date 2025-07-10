'use client';

import React, { useState, useEffect } from 'react';
import { checkPermission, getCurrentUser, ACCESS_MESSAGES } from '../config/access';
import DataConsortiumService, {
  BenchmarkData,
  MarketIntelligence,
  PredictiveInsights
} from '../services/DataConsortiumService';

// Initialize consortium service
const consortiumService = new DataConsortiumService('demo-company', 'premium');

const ConsortiumDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [benchmarks, setBenchmarks] = useState<BenchmarkData[]>([]);
  const [marketIntelligence, setMarketIntelligence] = useState<MarketIntelligence | null>(null);
  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsights | null>(null);
  const [consortiumStats, setConsortiumStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConsortiumData();
  }, []);

  const loadConsortiumData = async () => {
    setLoading(true);
    try {
      const [benchmarkData, marketData, predictiveData, statsData] = await Promise.all([
        consortiumService.getBenchmarks(),
        consortiumService.getMarketIntelligence(),
        consortiumService.getPredictiveInsights(),
        consortiumService.getConsortiumStats()
      ]);

      setBenchmarks(benchmarkData);
      setMarketIntelligence(marketData);
      setPredictiveInsights(predictiveData);
      setConsortiumStats(statsData);
    } catch (error) {
      console.error('Error loading consortium data:', error);
    } finally {
      setLoading(false);
    }
  };

  const contributeData = async () => {
    // Simulate contributing company data
    const mockCompanyData = {
      loads: [
        { 
          fuelUsed: 45, 
          miles: 300, 
          rate: 735, 
          equipmentType: 'dry_van',
          origin: 'Atlanta, GA',
          destination: 'Miami, FL',
          deliveryTime: new Date(),
          scheduledTime: new Date(Date.now() + 60000),
          weight: 35000,
          stops: 1
        }
      ]
    };

    await consortiumService.contributeData(mockCompanyData);
    await loadConsortiumData(); // Refresh data
  };

  if (loading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🌐</div>
          <h2 style={{ color: 'white', marginBottom: '16px' }}>Loading Industry Intelligence...</h2>
          <div style={{
            width: '200px',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '40%',
              height: '100%',
              background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
              animation: 'slide 2s infinite'
            }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}>
          🌐 Industry Data Consortium
        </h1>
        <p style={{
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '1.1rem',
          margin: 0
        }}>
          Anonymous industry intelligence powered by {consortiumStats?.totalParticipants.toLocaleString()} participating companies
        </p>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '8px',
        marginBottom: '24px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap'
      }}>
        {[
          { id: 'overview', label: '📊 Overview', icon: '📊' },
          { id: 'benchmarks', label: '📈 Benchmarks', icon: '📈' },
          { id: 'market', label: '🎯 Market Intel', icon: '🎯' },
          { id: 'predictions', label: '🔮 Predictions', icon: '🔮' },
          { id: 'participation', label: '🤝 Participation', icon: '🤝' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id 
                ? 'linear-gradient(135deg, #3b82f6, #2563eb)' 
                : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {/* Consortium Stats */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🌐 Network Stats
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {consortiumStats?.totalParticipants.toLocaleString()}
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                  Participating Companies
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#06b6d4' }}>
                  {(consortiumStats?.dataPointsThisMonth / 1000000).toFixed(1)}M
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                  Data Points This Month
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
                  {consortiumStats?.dataQuality}%
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                  Data Quality Score
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
                  {consortiumStats?.networkGrowth}
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                  Growth This Quarter
                </div>
              </div>
            </div>
          </div>

          {/* Your Performance Summary */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🏆 Your Performance vs Industry
            </h3>
            {benchmarks.slice(0, 3).map((benchmark, index) => (
              <div key={index} style={{ marginBottom: '16px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span style={{ color: 'white', fontSize: '0.9rem' }}>{benchmark.category}</span>
                  <span style={{ 
                    color: benchmark.percentile > 50 ? '#10b981' : '#f59e0b',
                    fontWeight: 'bold'
                  }}>
                    {benchmark.percentile}th percentile
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${benchmark.percentile}%`,
                    height: '100%',
                    background: benchmark.percentile > 50 
                      ? 'linear-gradient(90deg, #10b981, #059669)'
                      : 'linear-gradient(90deg, #f59e0b, #d97706)',
                    transition: 'width 1s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Market Opportunities */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            gridColumn: 'span 2'
          }}>
            <h3 style={{ color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              💡 Market Opportunities
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              {marketIntelligence?.laneAnalysis.slice(0, 4).map((lane, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ color: 'white', fontWeight: 'bold', marginBottom: '8px' }}>
                    {lane.origin} → {lane.destination}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      background: lane.demand === 'high' ? '#ef4444' : lane.demand === 'medium' ? '#f59e0b' : '#10b981',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      textTransform: 'uppercase'
                    }}>
                      {lane.demand} demand
                    </span>
                    <span style={{
                      color: lane.rateChange > 0 ? '#10b981' : '#ef4444',
                      fontWeight: 'bold'
                    }}>
                      {lane.rateChange > 0 ? '+' : ''}{lane.rateChange}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Benchmarks Tab */}
      {activeTab === 'benchmarks' && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h3 style={{ color: 'white', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📈 Industry Benchmarks
          </h3>
          <div style={{ display: 'grid', gap: '20px' }}>
            {benchmarks.map((benchmark, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ color: 'white', margin: 0 }}>{benchmark.category}</h4>
                  <span style={{
                    background: benchmark.percentile > 75 ? '#10b981' : benchmark.percentile > 50 ? '#f59e0b' : '#ef4444',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    {benchmark.percentile}th percentile
                  </span>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '16px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', marginBottom: '4px' }}>
                      Your Performance
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                      {benchmark.yourValue}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', marginBottom: '4px' }}>
                      Industry Average
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.8)' }}>
                      {benchmark.industryAverage}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', marginBottom: '4px' }}>
                      Difference
                    </div>
                    <div style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: 'bold', 
                      color: benchmark.yourValue > benchmark.industryAverage ? '#10b981' : '#ef4444'
                    }}>
                      {benchmark.yourValue > benchmark.industryAverage ? '+' : ''}
                      {((benchmark.yourValue - benchmark.industryAverage) / benchmark.industryAverage * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Trend indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ 
                    color: benchmark.trend === 'improving' ? '#10b981' : benchmark.trend === 'declining' ? '#ef4444' : '#f59e0b'
                  }}>
                    {benchmark.trend === 'improving' ? '📈' : benchmark.trend === 'declining' ? '📉' : '➡️'}
                  </span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.9rem' }}>
                    Trend: {benchmark.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Market Intelligence Tab */}
      {activeTab === 'market' && marketIntelligence && (
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Lane Analysis */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🛣️ Top Lane Analysis
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {marketIntelligence.laneAnalysis.map((lane, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '12px' }}>
                    {lane.origin} → {lane.destination}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>Demand</div>
                      <span style={{
                        background: lane.demand === 'high' ? '#ef4444' : lane.demand === 'medium' ? '#f59e0b' : '#10b981',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase'
                      }}>
                        {lane.demand}
                      </span>
                    </div>
                    <div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>Rate Change</div>
                      <div style={{
                        color: lane.rateChange > 0 ? '#10b981' : '#ef4444',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}>
                        {lane.rateChange > 0 ? '+' : ''}{lane.rateChange}%
                      </div>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem', marginBottom: '4px' }}>
                        Capacity Tightness
                      </div>
                      <div style={{
                        width: '100%',
                        height: '8px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${lane.capacityTightness * 100}%`,
                          height: '100%',
                          background: lane.capacityTightness > 0.7 
                            ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                            : lane.capacityTightness > 0.4 
                            ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                            : 'linear-gradient(90deg, #10b981, #059669)'
                        }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment Trends */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🚛 Equipment Market Trends
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              {marketIntelligence.equipmentTrends.map((equipment, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ color: 'white', fontWeight: 'bold', marginBottom: '16px' }}>
                    {equipment.type}
                  </div>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>Demand Score</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                        {equipment.demandScore}/100
                      </div>
                    </div>
                    <div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>Rate Premium</div>
                      <div style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: equipment.ratePremuim > 0 ? '#10b981' : '#ef4444'
                      }}>
                        {equipment.ratePremuim > 0 ? '+' : ''}{equipment.ratePremuim}%
                      </div>
                    </div>
                    <div>
                      <span style={{
                        background: equipment.availability === 'tight' ? '#ef4444' : 
                                   equipment.availability === 'balanced' ? '#f59e0b' : '#10b981',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase'
                      }}>
                        {equipment.availability}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Predictions Tab */}
      {activeTab === 'predictions' && predictiveInsights && (
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Fuel Predictions */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⛽ Fuel Price Predictions
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {predictiveInsights.fuelPredictions.map((prediction, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'center'
                }}>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', marginBottom: '8px' }}>
                    {prediction.timeframe}
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>
                    ${prediction.predictedPrice.toFixed(2)}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      color: prediction.trend === 'increasing' ? '#ef4444' : 
                             prediction.trend === 'decreasing' ? '#10b981' : '#f59e0b'
                    }}>
                      {prediction.trend === 'increasing' ? '📈' : 
                       prediction.trend === 'decreasing' ? '📉' : '➡️'} {prediction.trend}
                    </span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.8rem' }}>
                      {prediction.confidence}% confidence
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seasonal Alerts */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🔔 Seasonal Alerts & Preparations
            </h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              {predictiveInsights.seasonalAlerts.map((alert, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ color: 'white', margin: 0 }}>{alert.event}</h4>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                      {alert.timing.toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '16px' }}>
                    {alert.impact}
                  </div>
                  <div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', marginBottom: '8px' }}>
                      Recommended Preparations:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      {alert.preparation.map((prep, prepIndex) => (
                        <li key={prepIndex} style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '4px' }}>
                          {prep}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Participation Tab */}
      {activeTab === 'participation' && (
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Contribution Stats */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🤝 Your Consortium Participation
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {consortiumStats?.yourContribution}
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Data Points Contributed
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#10b981' }}>
                  2,846
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Companies Benefiting
                </div>
              </div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              marginTop: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', margin: 0, textAlign: 'center' }}>
                {consortiumStats?.industryBenefit}
              </p>
            </div>
          </div>

          {/* Data Contribution */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📊 Contribute Your Data
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '20px' }}>
              Share your anonymous operational data to help improve industry intelligence for everyone. 
              Your data is completely anonymized and cannot be traced back to your company.
            </p>
            <button
              onClick={contributeData}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                width: '100%'
              }}
            >
              🔄 Contribute Latest Operational Data
            </button>
          </div>

          {/* Privacy & Security */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🔒 Privacy & Security
            </h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '1.5rem' }}>✅</div>
                <div>
                  <div style={{ color: 'white', fontWeight: '600' }}>Complete Anonymization</div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                    All identifying information is removed before data sharing
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '1.5rem' }}>✅</div>
                <div>
                  <div style={{ color: 'white', fontWeight: '600' }}>Aggregate Analysis Only</div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                    Your data is combined with 100+ other companies for insights
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '1.5rem' }}>✅</div>
                <div>
                  <div style={{ color: 'white', fontWeight: '600' }}>No Reverse Engineering</div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                    Individual company data cannot be reverse-engineered from insights
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '1.5rem' }}>✅</div>
                <div>
                  <div style={{ color: 'white', fontWeight: '600' }}>Opt-out Anytime</div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                    You can stop sharing data at any time while keeping access to insights
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(500%); }
        }
      `}</style>
    </div>
  );
};

// Access Control Component
const AccessRestricted = () => (
  <div style={{
    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  }}>
    <div style={{
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '40px 32px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      maxWidth: '400px',
      width: '100%'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🌐</div>
      <h1 style={{ 
        fontSize: '1.8rem', 
        fontWeight: 'bold', 
        color: 'white', 
        marginBottom: '16px' 
      }}>Data Consortium Access Required</h1>
      <p style={{ 
        color: 'rgba(255, 255, 255, 0.9)', 
        marginBottom: '16px',
        lineHeight: '1.6'
      }}>
        You need appropriate permissions to access the Industry Data Consortium.
      </p>
      <button 
        onClick={() => window.history.back()}
        style={{
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600'
        }}
      >
        Go Back
      </button>
    </div>
  </div>
);

// Main Component with Access Control
export default function DataConsortiumPage() {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    // Check access permissions for consortium data
    const accessCheck = checkPermission('hasAnalyticsAccess') || 
                       checkPermission('hasFinancialsAccess');
    setHasAccess(accessCheck);
  }, []);

  if (hasAccess === null) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: 'white', fontSize: '1.2rem' }}>
          Loading Data Consortium...
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return <AccessRestricted />;
  }

  return <ConsortiumDashboard />;
}
