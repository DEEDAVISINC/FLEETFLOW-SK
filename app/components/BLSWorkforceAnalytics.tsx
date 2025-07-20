'use client';

import React, { useState, useEffect } from 'react';
import BLSService, { 
  DriverWageData, 
  EmploymentTrend, 
  RegionalLabor, 
  WageComparison, 
  LaborMarketIndicator, 
  DriverShortageAnalysis,
  CompensationPackage 
} from '../services/BLSService';

export default function BLSWorkforceAnalytics() {
  const [activeTab, setActiveTab] = useState<'overview' | 'wages' | 'employment' | 'regional' | 'comparison' | 'indicators' | 'shortage' | 'compensation'>('overview');
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<{
    driverWages: DriverWageData[];
    employmentTrends: EmploymentTrend[];
    regionalLabor: RegionalLabor[];
    wageComparison: WageComparison[];
    laborIndicators: LaborMarketIndicator[];
    shortageAnalysis: DriverShortageAnalysis;
  } | null>(null);
  const [compensationPackages, setCompensationPackages] = useState<CompensationPackage[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [dashboardResult, compensationResult] = await Promise.all([
        BLSService.getWorkforceDashboard(),
        BLSService.getCompensationPackages()
      ]);
      
      setDashboardData(dashboardResult);
      setCompensationPackages(compensationResult);
    } catch (error) {
      console.error('Error loading BLS workforce data:', error);
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

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('en-US').format(value);
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
        padding: '12px 16px',
        borderRadius: '12px',
        fontWeight: active ? '600' : '500',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '13px'
      }}
    >
      <span style={{ fontSize: '16px' }}>{icon}</span>
      {label}
    </button>
  );

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return '#10b981';
      case 'declining':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return '📈';
      case 'declining':
        return '📉';
      default:
        return '➡️';
    }
  };

  const getGrowthRateColor = (rate: string) => {
    switch (rate) {
      case 'much_faster':
        return '#10b981';
      case 'faster':
        return '#22c55e';
      case 'average':
        return '#f59e0b';
      case 'slower':
        return '#ef4444';
      case 'decline':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '#dc2626';
      case 'high':
        return '#ef4444';
      case 'moderate':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

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
            <span style={{ fontSize: '24px' }}>👥</span>
          </div>
          <div>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 8px 0',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)'
            }}>
              Driver Market & Workforce Analytics
            </h2>
            <p style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '0 0 4px 0'
            }}>
              Bureau of Labor Statistics • Driver Wages • Employment Trends • Regional Analysis • Shortage Intelligence
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
                Estimated Value Add: $1-2M
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={loadDashboardData}
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
          {loading ? 'Loading...' : '🔄 Refresh'}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <TabButton id="overview" label="Overview" icon="📋" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
        <TabButton id="wages" label="Driver Wages" icon="💰" active={activeTab === 'wages'} onClick={() => setActiveTab('wages')} />
        <TabButton id="employment" label="Employment" icon="📊" active={activeTab === 'employment'} onClick={() => setActiveTab('employment')} />
        <TabButton id="regional" label="Regional" icon="🗺️" active={activeTab === 'regional'} onClick={() => setActiveTab('regional')} />
        <TabButton id="comparison" label="Comparison" icon="⚖️" active={activeTab === 'comparison'} onClick={() => setActiveTab('comparison')} />
        <TabButton id="indicators" label="Indicators" icon="📈" active={activeTab === 'indicators'} onClick={() => setActiveTab('indicators')} />
        <TabButton id="shortage" label="Shortage" icon="⚠️" active={activeTab === 'shortage'} onClick={() => setActiveTab('shortage')} />
        <TabButton id="compensation" label="Compensation" icon="💼" active={activeTab === 'compensation'} onClick={() => setActiveTab('compensation')} />
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
            }}></div>
            <p>Loading workforce analytics...</p>
          </div>
        </div>
      ) : dashboardData ? (
        <div>
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gap: '24px' }}>
              {/* Key Metrics */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px'
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>💰</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>
                    {formatCurrency(dashboardData.driverWages[0]?.annual_wage_median || 0)}
                  </div>
                  <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Median Driver Wage
                  </div>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>📈</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>
                    6.8%
                  </div>
                  <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Employment Growth
                  </div>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚠️</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ef4444' }}>
                    {formatNumber(dashboardData.shortageAnalysis.shortage_estimate)}
                  </div>
                  <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Driver Shortage
                  </div>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎯</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>
                    {formatNumber(dashboardData.employmentTrends[0]?.job_openings_annual || 0)}
                  </div>
                  <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Annual Job Openings
                  </div>
                </div>
              </div>

              {/* Driver Shortage Summary */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '24px'
              }}>
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0' }}>
                  ⚠️ Driver Shortage Analysis
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                  <div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', marginBottom: '8px' }}>
                      Severity Level:
                    </div>
                    <div style={{ 
                      background: getSeverityColor(dashboardData.shortageAnalysis.severity_level),
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      display: 'inline-block'
                    }}>
                      {dashboardData.shortageAnalysis.severity_level}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', marginBottom: '8px' }}>
                      Market Response:
                    </div>
                    <div style={{ color: 'white', fontSize: '14px' }}>
                      {formatPercentage(dashboardData.shortageAnalysis.market_response.wage_premium)} wage premium
                    </div>
                    <div style={{ color: 'white', fontSize: '14px' }}>
                      {formatCurrency(dashboardData.shortageAnalysis.market_response.sign_on_bonus_average)} avg sign-on bonus
                    </div>
                  </div>
                </div>
              </div>

              {/* Regional Highlights */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '24px'
              }}>
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0' }}>
                  🗺️ Regional Labor Market Highlights
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {dashboardData.regionalLabor.slice(0, 3).map((region, index) => (
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
                          {region.metropolitan_area}
                        </div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                          {formatNumber(region.driver_employment)} drivers • {formatPercentage(region.job_growth_rate)} growth
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#10b981', fontSize: '18px', fontWeight: '600' }}>
                          {formatPercentage(region.unemployment_rate)}
                        </div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                          Unemployment
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wages' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              {dashboardData.driverWages.map((wage, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                        {wage.occupation_title}
                      </h4>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', marginBottom: '8px' }}>
                        {wage.state} {wage.metropolitan_area && `• ${wage.metropolitan_area}`}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                        {formatNumber(wage.employment_level)} employed • {formatPercentage(wage.year_over_year_change)} YoY change
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#10b981', fontSize: '24px', fontWeight: 'bold' }}>
                        {formatCurrency(wage.annual_wage_median)}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                        Median Annual
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
                        {formatCurrency(wage.hourly_wage_median)}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                        Median Hourly
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
                        {formatCurrency(wage.wage_percentile_25)}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                        25th Percentile
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
                        {formatCurrency(wage.wage_percentile_75)}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                        75th Percentile
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
                        {formatCurrency(wage.wage_percentile_90)}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                        90th Percentile
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'employment' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              {dashboardData.employmentTrends.map((trend, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                        {trend.occupation_title}
                      </h4>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', marginBottom: '8px' }}>
                        {trend.outlook_period} • {trend.typical_education}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                        {trend.work_experience} • {trend.on_job_training}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ 
                        color: getGrowthRateColor(trend.growth_rate),
                        fontSize: '18px', 
                        fontWeight: 'bold',
                        marginBottom: '4px'
                      }}>
                        {formatPercentage(trend.employment_change_percent / 100)}
                      </div>
                      <div style={{
                        background: getGrowthRateColor(trend.growth_rate),
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        {trend.growth_rate.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
                        {formatNumber(trend.current_employment)}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                        Current Employment
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
                        {formatNumber(trend.projected_employment)}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                        Projected Employment
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
                        {formatNumber(trend.job_openings_annual)}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                        Annual Job Openings
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'regional' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              {dashboardData.regionalLabor.map((region, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div>
                      <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                        {region.metropolitan_area}
                      </h4>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                        {region.state} • {formatNumber(region.driver_employment)} drivers
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#10b981', fontSize: '20px', fontWeight: 'bold' }}>
                        {formatPercentage(region.unemployment_rate)}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                        Unemployment Rate
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
                        {formatPercentage(region.job_growth_rate)}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                        Job Growth Rate
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
                        {region.cost_of_living_index}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                        Cost of Living
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
                        {region.driver_shortage_index}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                        Shortage Index
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
                        {formatPercentage(region.turnover_rate)}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                        Turnover Rate
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'comparison' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              {dashboardData.wageComparison.map((comparison, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div>
                      <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                        {comparison.occupation}
                      </h4>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                        {comparison.industry_sector}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#10b981', fontSize: '20px', fontWeight: 'bold' }}>
                        {formatPercentage(comparison.competitiveness_score)}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                        Competitiveness
                      </div>
                    </div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <h5 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: '0 0 12px 0' }}>
                      Industry Wage Comparison
                    </h5>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#10b981', fontSize: '16px', fontWeight: '600' }}>
                          {formatCurrency(comparison.wage_data.transportation)}
                        </div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                          Transportation
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
                          {formatCurrency(comparison.wage_data.construction)}
                        </div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                          Construction
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
                          {formatCurrency(comparison.wage_data.manufacturing)}
                        </div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                          Manufacturing
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
                          {formatCurrency(comparison.wage_data.national_average)}
                        </div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                          National Avg
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: '0 0 12px 0' }}>
                      Benefits Coverage
                    </h5>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
                          {formatPercentage(comparison.benefits_data.health_insurance)}
                        </div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                          Health Insurance
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
                          {formatPercentage(comparison.benefits_data.retirement_plan)}
                        </div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                          Retirement Plan
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
                          {formatPercentage(comparison.benefits_data.paid_time_off)}
                        </div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                          Paid Time Off
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'indicators' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              {dashboardData.laborIndicators.map((indicator, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                        {indicator.indicator_name}
                      </h4>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                        {indicator.period} • {indicator.unit}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#10b981', fontSize: '24px', fontWeight: 'bold' }}>
                        {indicator.current_value}
                      </div>
                      <div style={{ 
                        color: getTrendColor(indicator.trend),
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        justifyContent: 'flex-end'
                      }}>
                        {getTrendIcon(indicator.trend)} {formatPercentage(indicator.change_percent)}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{
                      background: indicator.significance === 'high' ? '#ef4444' : indicator.significance === 'medium' ? '#f59e0b' : '#10b981',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      {indicator.significance} Impact
                    </span>
                    <span style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}>
                      {indicator.seasonally_adjusted ? 'Seasonally Adjusted' : 'Not Seasonally Adjusted'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'shortage' && (
            <div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                  <div>
                    <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                      Driver Shortage Analysis
                    </h4>
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                      Current market conditions and contributing factors
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#ef4444', fontSize: '24px', fontWeight: 'bold' }}>
                      {formatNumber(dashboardData.shortageAnalysis.shortage_estimate)}
                    </div>
                    <div style={{ 
                      background: getSeverityColor(dashboardData.shortageAnalysis.severity_level),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      {dashboardData.shortageAnalysis.severity_level}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <h5 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>
                      Contributing Factors
                    </h5>
                    <ul style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', paddingLeft: '20px' }}>
                      {dashboardData.shortageAnalysis.contributing_factors.map((factor, index) => (
                        <li key={index} style={{ marginBottom: '4px' }}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>
                      Affected Regions
                    </h5>
                    <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                      {dashboardData.shortageAnalysis.affected_regions.join(', ')}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px'
                }}>
                  <h5 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: '0 0 12px 0' }}>
                    Demographic Analysis
                  </h5>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Average Age:</span>
                      <span style={{ color: 'white', fontSize: '14px' }}>{dashboardData.shortageAnalysis.demographic_analysis.average_age} years</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Female Participation:</span>
                      <span style={{ color: 'white', fontSize: '14px' }}>{formatPercentage(dashboardData.shortageAnalysis.demographic_analysis.female_participation)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Retirement Rate:</span>
                      <span style={{ color: 'white', fontSize: '14px' }}>{formatPercentage(dashboardData.shortageAnalysis.demographic_analysis.retirement_rate)}</span>
                    </div>
                  </div>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px'
                }}>
                  <h5 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: '0 0 12px 0' }}>
                    Market Response
                  </h5>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Wage Premium:</span>
                      <span style={{ color: 'white', fontSize: '14px' }}>{formatPercentage(dashboardData.shortageAnalysis.market_response.wage_premium)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Avg Sign-on Bonus:</span>
                      <span style={{ color: 'white', fontSize: '14px' }}>{formatCurrency(dashboardData.shortageAnalysis.market_response.sign_on_bonus_average)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compensation' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              {compensationPackages.map((pkg, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div>
                      <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                        {pkg.position}
                      </h4>
                      <div style={{ 
                        background: pkg.experience_level === 'entry' ? '#10b981' : pkg.experience_level === 'mid' ? '#f59e0b' : '#ef4444',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        display: 'inline-block'
                      }}>
                        {pkg.experience_level} Level
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#10b981', fontSize: '20px', fontWeight: 'bold' }}>
                        {formatCurrency(pkg.base_salary.median)}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                        Median Salary
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div>
                      <h5 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>
                        Base Compensation
                      </h5>
                      <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                        Salary: {formatCurrency(pkg.base_salary.min)} - {formatCurrency(pkg.base_salary.max)}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                        Hourly: {formatCurrency(pkg.hourly_rate.min)} - {formatCurrency(pkg.hourly_rate.max)}
                      </div>
                    </div>
                    <div>
                      <h5 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>
                        Benefits
                      </h5>
                      <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                        PTO: {pkg.benefits.paid_time_off} days
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                        Health: {pkg.benefits.health_insurance ? '✓' : '✗'}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                        401(k): {pkg.benefits.retirement_401k ? '✓' : '✗'}
                      </div>
                    </div>
                    <div>
                      <h5 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>
                        Additional Compensation
                      </h5>
                      <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                        Performance: {formatCurrency(pkg.additional_compensation.performance_bonus)}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                        Safety: {formatCurrency(pkg.additional_compensation.safety_bonus)}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                        Referral: {formatCurrency(pkg.additional_compensation.referral_bonus)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{ color: 'white', textAlign: 'center', padding: '40px' }}>
          No data available. Click refresh to load workforce analytics.
        </div>
      )}
    </div>
  );
} 