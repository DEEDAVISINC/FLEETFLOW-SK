'use client';

import React, { useState, useEffect } from 'react';
import { 
  PortAuthorityService,
  PortTrafficData,
  CargoVolume,
  VesselSchedule,
  ShippingRate,
  PortPerformance,
  SupplyChainInsight,
  MaritimeMarketTrend
} from '../services/PortAuthorityService';

const portAuthorityService = new PortAuthorityService();

export default function PortAuthorityIntelligence() {
  const [activeTab, setActiveTab] = useState<'overview' | 'traffic' | 'cargo' | 'schedules' | 'rates' | 'performance' | 'insights' | 'trends'>('overview');
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<{
    portTraffic: PortTrafficData[];
    cargoVolume: CargoVolume[];
    vesselSchedules: VesselSchedule[];
    shippingRates: ShippingRate[];
    portPerformance: PortPerformance[];
    supplyChainInsights: SupplyChainInsight[];
    maritimeMarketTrends: MaritimeMarketTrend[];
    topUSPorts: PortTrafficData[];
  } | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [
        portTraffic,
        cargoVolume,
        vesselSchedules,
        shippingRates,
        portPerformance,
        supplyChainInsights,
        maritimeMarketTrends,
        topUSPorts
      ] = await Promise.all([
        portAuthorityService.getPortTrafficData(),
        portAuthorityService.getCargoVolumeData(),
        portAuthorityService.getVesselSchedules(),
        portAuthorityService.getShippingRates(),
        portAuthorityService.getPortPerformance(),
        portAuthorityService.getSupplyChainInsights(),
        portAuthorityService.getMaritimeMarketTrends(),
        portAuthorityService.getTopUSPorts()
      ]);

      setDashboardData({
        portTraffic,
        cargoVolume,
        vesselSchedules,
        shippingRates,
        portPerformance,
        supplyChainInsights,
        maritimeMarketTrends,
        topUSPorts
      });
    } catch (error) {
      console.error('Error loading Port Authority dashboard data:', error);
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

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        padding: '12px 18px',
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      case 'critical': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return '#10b981';
      case 'decreasing': return '#ef4444';
      case 'stable': return '#6b7280';
      case 'volatile': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return '#3b82f6';
      case 'arrived': return '#10b981';
      case 'loading': return '#f59e0b';
      case 'departed': return '#6b7280';
      case 'delayed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '40px',
        margin: '24px 0',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(255, 255, 255, 0.3)',
          borderTop: '4px solid white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }}></div>
        <div style={{ color: 'white', fontSize: '16px' }}>Loading Port Authority Intelligence...</div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '32px',
      margin: '24px 0',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            padding: '12px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '12px'
          }}>
            <span style={{ fontSize: '24px' }}>🚢</span>
          </div>
          <div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 8px 0',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)'
            }}>
              Port Authority Maritime Intelligence
            </h3>
            <p style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '0'
            }}>
              Real-time port traffic, cargo volumes, and shipping intelligence • $1-2M Value Add
            </p>
          </div>
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '8px 16px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', fontWeight: '600' }}>
            🔄 Updated {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '32px',
        flexWrap: 'wrap'
      }}>
        <TabButton
          id="overview"
          label="Overview"
          icon="📊"
          active={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
        />
        <TabButton
          id="traffic"
          label="Port Traffic"
          icon="🚢"
          active={activeTab === 'traffic'}
          onClick={() => setActiveTab('traffic')}
        />
        <TabButton
          id="cargo"
          label="Cargo Volume"
          icon="📦"
          active={activeTab === 'cargo'}
          onClick={() => setActiveTab('cargo')}
        />
        <TabButton
          id="schedules"
          label="Vessel Schedules"
          icon="⏰"
          active={activeTab === 'schedules'}
          onClick={() => setActiveTab('schedules')}
        />
        <TabButton
          id="rates"
          label="Shipping Rates"
          icon="💰"
          active={activeTab === 'rates'}
          onClick={() => setActiveTab('rates')}
        />
        <TabButton
          id="performance"
          label="Port Performance"
          icon="🏆"
          active={activeTab === 'performance'}
          onClick={() => setActiveTab('performance')}
        />
        <TabButton
          id="insights"
          label="Supply Chain"
          icon="🔍"
          active={activeTab === 'insights'}
          onClick={() => setActiveTab('insights')}
        />
        <TabButton
          id="trends"
          label="Market Trends"
          icon="📈"
          active={activeTab === 'trends'}
          onClick={() => setActiveTab('trends')}
        />
      </div>

      {/* Tab Content */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.15)'
      }}>
        {/* Overview Tab */}
        {activeTab === 'overview' && dashboardData && (
          <div>
            <h4 style={{ color: 'white', fontSize: '20px', marginBottom: '24px', fontWeight: '600' }}>
              🚢 Maritime Intelligence Overview
            </h4>
            
            {/* Top US Ports */}
            <div style={{ marginBottom: '32px' }}>
              <h5 style={{ color: 'white', fontSize: '16px', marginBottom: '16px', fontWeight: '600' }}>
                Top US Container Ports by Volume
              </h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                {dashboardData.topUSPorts.slice(0, 4).map((port, index) => (
                  <div key={port.port_code} style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h6 style={{ color: 'white', fontSize: '14px', fontWeight: '600', margin: 0 }}>
                        #{index + 1} {port.port_name}
                      </h6>
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px' }}>
                        {port.location.state}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                      <div>
                        <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Total Vessels:</span>
                        <div style={{ color: 'white', fontWeight: '600' }}>{formatNumber(port.traffic_metrics.total_vessels)}</div>
                      </div>
                      <div>
                        <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Berth Utilization:</span>
                        <div style={{ color: 'white', fontWeight: '600' }}>{port.traffic_metrics.berth_utilization}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', marginBottom: '8px' }}>
                  Total Cargo Volume
                </div>
                <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                  {formatNumber(dashboardData.cargoVolume.reduce((sum, cargo) => sum + cargo.volume_tons, 0))} tons
                </div>
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', marginBottom: '8px' }}>
                  Active Vessels
                </div>
                <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                  {dashboardData.vesselSchedules.filter(v => v.status === 'arrived' || v.status === 'loading').length}
                </div>
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', marginBottom: '8px' }}>
                  Supply Chain Alerts
                </div>
                <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                  {dashboardData.supplyChainInsights.length}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Port Traffic Tab */}
        {activeTab === 'traffic' && dashboardData && (
          <div>
            <h4 style={{ color: 'white', fontSize: '20px', marginBottom: '24px', fontWeight: '600' }}>
              🚢 Port Traffic Analysis
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px' }}>
              {dashboardData.portTraffic.map((port) => (
                <div key={port.port_code} style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h5 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: 0 }}>
                      {port.port_name}
                    </h5>
                    <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px' }}>
                      {port.location.city}, {port.location.state}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                    <div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Total Vessels:</span>
                      <div style={{ color: 'white', fontWeight: '600' }}>{formatNumber(port.traffic_metrics.total_vessels)}</div>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Arrivals:</span>
                      <div style={{ color: 'white', fontWeight: '600' }}>{formatNumber(port.traffic_metrics.vessel_arrivals)}</div>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Avg Wait Time:</span>
                      <div style={{ color: 'white', fontWeight: '600' }}>{port.traffic_metrics.average_wait_time}h</div>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Berth Utilization:</span>
                      <div style={{ color: 'white', fontWeight: '600' }}>{port.traffic_metrics.berth_utilization}%</div>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Throughput Efficiency:</span>
                      <div style={{ color: 'white', fontWeight: '600' }}>{port.traffic_metrics.throughput_efficiency}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cargo Volume Tab */}
        {activeTab === 'cargo' && dashboardData && (
          <div>
            <h4 style={{ color: 'white', fontSize: '20px', marginBottom: '24px', fontWeight: '600' }}>
              📦 Cargo Volume Analysis
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '16px' }}>
              {dashboardData.cargoVolume.slice(0, 8).map((cargo, index) => (
                <div key={`${cargo.port_code}-${cargo.commodity}-${index}`} style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h5 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: 0 }}>
                      {cargo.commodity}
                    </h5>
                    <span style={{ 
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      textTransform: 'capitalize'
                    }}>
                      {cargo.cargo_type.replace('_', ' ')}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Port: </span>
                    <span style={{ color: 'white', fontWeight: '600' }}>{cargo.port_code}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                    <div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Volume:</span>
                      <div style={{ color: 'white', fontWeight: '600' }}>{formatNumber(cargo.volume_tons)} tons</div>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Value:</span>
                      <div style={{ color: 'white', fontWeight: '600' }}>{formatCurrency(cargo.value_usd)}</div>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Growth:</span>
                      <div style={{ 
                        color: cargo.growth_rate > 0 ? '#10b981' : '#ef4444', 
                        fontWeight: '600' 
                      }}>
                        {cargo.growth_rate > 0 ? '+' : ''}{cargo.growth_rate.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Market Share:</span>
                      <div style={{ color: 'white', fontWeight: '600' }}>{cargo.market_share.toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vessel Schedules Tab */}
        {activeTab === 'schedules' && dashboardData && (
          <div>
            <h4 style={{ color: 'white', fontSize: '20px', marginBottom: '24px', fontWeight: '600' }}>
              ⏰ Vessel Schedules & Berth Management
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px' }}>
              {dashboardData.vesselSchedules.slice(0, 6).map((vessel, index) => (
                <div key={`${vessel.vessel_name}-${index}`} style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h5 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: 0 }}>
                      {vessel.vessel_name}
                    </h5>
                    <span style={{ 
                      background: getStatusColor(vessel.status),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      textTransform: 'capitalize'
                    }}>
                      {vessel.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', marginBottom: '16px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Type: </span>
                      <span style={{ color: 'white', fontWeight: '600' }}>{vessel.vessel_type.replace('_', ' ')}</span>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)', marginLeft: '16px' }}>Size: </span>
                      <span style={{ color: 'white', fontWeight: '600' }}>{vessel.vessel_size}</span>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Port: </span>
                      <span style={{ color: 'white', fontWeight: '600' }}>{vessel.port_code}</span>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)', marginLeft: '16px' }}>Berth: </span>
                      <span style={{ color: 'white', fontWeight: '600' }}>{vessel.berth_assignment}</span>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                    <div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Arrival:</span>
                      <div style={{ color: 'white', fontWeight: '600' }}>{formatDate(vessel.arrival_time)}</div>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Departure:</span>
                      <div style={{ color: 'white', fontWeight: '600' }}>{formatDate(vessel.departure_time)}</div>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Loading:</span>
                      <div style={{ color: 'white', fontWeight: '600' }}>{formatNumber(vessel.cargo_operations.loading_tons)}t</div>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Unloading:</span>
                      <div style={{ color: 'white', fontWeight: '600' }}>{formatNumber(vessel.cargo_operations.unloading_tons)}t</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shipping Rates Tab */}
        {activeTab === 'rates' && dashboardData && (
          <div>
            <h4 style={{ color: 'white', fontSize: '20px', marginBottom: '24px', fontWeight: '600' }}>
              💰 Shipping Rates & Route Analysis
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px' }}>
              {dashboardData.shippingRates.slice(0, 6).map((rate, index) => (
                <div key={`${rate.route.origin_port}-${rate.route.destination_port}-${index}`} style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <div style={{ marginBottom: '16px' }}>
                    <h5 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>
                      {rate.route.origin_port} → {rate.route.destination_port}
                    </h5>
                    <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                      {formatNumber(rate.route.distance_nautical_miles)} nautical miles • {rate.transit_time_days} days
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                    <div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Rate (TEU):</span>
                      <div style={{ color: 'white', fontWeight: '600' }}>{formatCurrency(rate.rate_usd_per_teu || 0)}</div>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Fuel Surcharge:</span>
                      <div style={{ color: 'white', fontWeight: '600' }}>{formatCurrency(rate.fuel_surcharge)}</div>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Total Cost:</span>
                      <div style={{ color: 'white', fontWeight: '600' }}>{formatCurrency(rate.total_cost)}</div>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Frequency:</span>
                      <div style={{ color: 'white', fontWeight: '600' }}>{rate.frequency}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: '12px', fontSize: '12px' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Carrier: </span>
                    <span style={{ color: 'white', fontWeight: '600' }}>{rate.carrier}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Port Performance Tab */}
        {activeTab === 'performance' && dashboardData && (
          <div>
            <h4 style={{ color: 'white', fontSize: '20px', marginBottom: '24px', fontWeight: '600' }}>
              🏆 Port Performance Rankings
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px' }}>
              {dashboardData.portPerformance.map((port) => (
                <div key={port.port_code} style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h5 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: 0 }}>
                      {port.port_name}
                    </h5>
                    <span style={{ 
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      Global #{port.ranking.global_rank}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px', marginBottom: '16px' }}>
                    <div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Efficiency Score:</span>
                      <div style={{ color: 'white', fontWeight: '600' }}>{port.metrics.efficiency_score}</div>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Throughput:</span>
                      <div style={{ color: 'white', fontWeight: '600' }}>{formatNumber(port.metrics.annual_throughput_teu)} TEU</div>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Dwell Time:</span>
                      <div style={{ color: 'white', fontWeight: '600' }}>{port.metrics.average_dwell_time} days</div>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Crane Productivity:</span>
                      <div style={{ color: 'white', fontWeight: '600' }}>{port.metrics.crane_productivity}/hr</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '12px' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Infrastructure: </span>
                    <span style={{ color: 'white' }}>{port.infrastructure.berth_count} berths • {port.infrastructure.crane_count} cranes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Supply Chain Insights Tab */}
        {activeTab === 'insights' && dashboardData && (
          <div>
            <h4 style={{ color: 'white', fontSize: '20px', marginBottom: '24px', fontWeight: '600' }}>
              🔍 Supply Chain Insights & Bottleneck Analysis
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px' }}>
              {dashboardData.supplyChainInsights.map((insight, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h5 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: 0, textTransform: 'capitalize' }}>
                      {insight.bottleneck_type.replace('_', ' ')}
                    </h5>
                    <span style={{ 
                      background: getSeverityColor(insight.impact_severity),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      textTransform: 'capitalize'
                    }}>
                      {insight.impact_severity} Impact
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', marginBottom: '16px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Affected Ports: </span>
                      <span style={{ color: 'white', fontWeight: '600' }}>{insight.affected_ports.join(', ')}</span>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Estimated Delay: </span>
                      <span style={{ color: 'white', fontWeight: '600' }}>{insight.estimated_delay_days} days</span>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Cost Impact: </span>
                      <span style={{ color: 'white', fontWeight: '600' }}>{formatCurrency(insight.cost_impact_usd)}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '12px' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Commodities: </span>
                    <span style={{ color: 'white' }}>{insight.affected_commodities.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Maritime Market Trends Tab */}
        {activeTab === 'trends' && dashboardData && (
          <div>
            <h4 style={{ color: 'white', fontSize: '20px', marginBottom: '24px', fontWeight: '600' }}>
              📈 Maritime Market Trends & Forecasts
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px' }}>
              {dashboardData.maritimeMarketTrends.map((trend, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h5 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: 0 }}>
                      {trend.metric}
                    </h5>
                    <span style={{ 
                      background: getTrendColor(trend.trend_direction),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      textTransform: 'capitalize'
                    }}>
                      {trend.trend_direction}
                    </span>
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
                    {trend.trend_type === 'freight_rates' ? formatCurrency(trend.current_value) : 
                     trend.trend_type === 'capacity_utilization' ? formatPercentage(trend.current_value) :
                     formatNumber(trend.current_value)}
                  </div>
                  <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '16px', lineHeight: '1.5' }}>
                    {trend.analysis}
                  </div>
                  <div style={{ fontSize: '12px' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Key Drivers: </span>
                    <span style={{ color: 'white' }}>{trend.key_drivers.slice(0, 3).join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 