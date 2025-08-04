'use client';

import { useEffect, useState } from 'react';
import {
  NOADVesselData,
  PortIntelligence,
  VesselSchedule,
} from '../../services/NOADService';
import { NOAAPortConditions } from '../../services/NOAAPortsService';
import { PortAuthorityOperations } from '../../services/PortAuthoritySystemsService';
import { WaterborneCommerceData, PortPerformanceBenchmark } from '../../services/BTSService';
import { portAuthorityService } from '../../services/PortAuthorityService';
import { noaaPortsService } from '../../services/NOAAPortsService';
import { portAuthoritySystemsService } from '../../services/PortAuthoritySystemsService';
import btsService from '../../services/BTSService';

interface MaritimeIntelligenceViewProps {
  shipments?: any[];
}

interface MaritimeIntelligenceSummary {
  totalVessels: number;
  activeArrivals: number;
  activeDepartures: number;
  portsCongested: number;
  averageWaitTime: number;
  topCongestionPorts: string[];
  criticalAlerts: string[];
}

export default function MaritimeIntelligenceView({
  shipments = [],
}: MaritimeIntelligenceViewProps) {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'vessels' | 'ports' | 'schedules' | 'conditions' | 'operations' | 'commerce'
  >('overview');
  const [summary, setSummary] = useState<MaritimeIntelligenceSummary | null>(
    null
  );
  const [vesselData, setVesselData] = useState<NOADVesselData[]>([]);
  const [portData, setPortData] = useState<PortIntelligence[]>([]);
  const [scheduleData, setScheduleData] = useState<VesselSchedule[]>([]);
  const [selectedPort, setSelectedPort] = useState<string>('all');
  
  // New data sources
  const [noaaConditions, setNoaaConditions] = useState<NOAAPortConditions[]>([]);
  const [portOperations, setPortOperations] = useState<PortAuthorityOperations[]>([]);
  const [commerceData, setCommerceData] = useState<WaterborneCommerceData[]>([]);
  const [portBenchmarks, setPortBenchmarks] = useState<PortPerformanceBenchmark[]>([]);

  const majorPorts = [
    { code: 'USLAX', name: 'Los Angeles' },
    { code: 'USNYK', name: 'New York/New Jersey' },
    { code: 'USMIA', name: 'Miami' },
    { code: 'USSAV', name: 'Savannah' },
    { code: 'USSEA', name: 'Seattle' },
  ];

  useEffect(() => {
    loadMaritimeData();
  }, [selectedPort]);

  const loadMaritimeData = async () => {
    setLoading(true);
    try {
      // Load summary data
      const summaryData =
        await portAuthorityService.getMaritimeIntelligenceSummary();
      setSummary(summaryData);

      // Load vessel data
      const vessels = await portAuthorityService.getNOADVesselData(
        selectedPort === 'all' ? undefined : selectedPort
      );
      setVesselData(vessels);

      // Load port intelligence for major ports
      const portPromises = majorPorts.map((port) =>
        portAuthorityService.getEnhancedPortIntelligence(port.code)
      );
      const ports = await Promise.all(portPromises);
      setPortData(ports);

      // Load vessel schedules
      const schedules = await portAuthorityService.getVesselSchedulesNOAD(
        selectedPort === 'all' ? undefined : selectedPort
      );
      setScheduleData(schedules);

      // Load NOAA port conditions
      const noaaPromises = majorPorts.map(port => 
        noaaPortsService.getPortConditions(port.code)
      );
      const conditions = (await Promise.all(noaaPromises)).filter(Boolean) as NOAAPortConditions[];
      setNoaaConditions(conditions);

      // Load port authority operations
      const operationsPromises = majorPorts.map(port => 
        portAuthoritySystemsService.getPortOperations(port.code)
      );
      const operations = (await Promise.all(operationsPromises)).filter(Boolean) as PortAuthorityOperations[];
      setPortOperations(operations);

      // Load BTS waterborne commerce data
      const commerce = await btsService.getWaterborneCommerceData();
      setCommerceData(commerce);

      // Load BTS port performance benchmarks
      const benchmarks = await btsService.getPortPerformanceBenchmarks();
      setPortBenchmarks(benchmarks);

    } catch (error) {
      console.error('Error loading maritime data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'arrived':
        return '#10b981';
      case 'loading':
        return '#f59e0b';
      case 'unloading':
        return '#3b82f6';
      case 'departed':
        return '#6b7280';
      case 'delayed':
        return '#ef4444';
      case 'scheduled':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  const getCongestionColor = (level: string) => {
    switch (level) {
      case 'low':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'high':
        return '#f97316';
      case 'critical':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '400px',
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚢</div>
          <div style={{ fontSize: '18px', fontWeight: '500' }}>
            Loading Maritime Intelligence...
          </div>
          <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '8px' }}>
            Connecting to USCG NVMC system
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '32px',
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
        <div>
          <h2
            style={{
              color: 'white',
              fontSize: '28px',
              fontWeight: 'bold',
              margin: '0 0 8px 0',
            }}
          >
            🚢 Maritime Intelligence
          </h2>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '14px',
              margin: 0,
            }}
          >
            Real-time NOAD data from USCG NVMC system • 361 US Ports
          </p>
        </div>

        {/* Port Filter */}
        <select
          value={selectedPort}
          onChange={(e) => setSelectedPort(e.target.value)}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '14px',
          }}
        >
          <option value='all'>All Ports</option>
          {majorPorts.map((port) => (
            <option
              key={port.code}
              value={port.code}
              style={{ color: 'black' }}
            >
              {port.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '32px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          paddingBottom: '16px',
        }}
      >
        {[
          { id: 'overview', label: '📊 Overview', icon: '📊' },
          { id: 'vessels', label: '🚢 Vessels', icon: '🚢' },
          { id: 'ports', label: '⚓ Ports', icon: '⚓' },
          { id: 'schedules', label: '📅 Schedules', icon: '📅' },
          { id: 'conditions', label: '🌊 NOAA Conditions', icon: '🌊' },
          { id: 'operations', label: '🏗️ Port Operations', icon: '🏗️' },
          { id: 'commerce', label: '📈 BTS Commerce', icon: '📈' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              background:
                activeTab === tab.id
                  ? 'rgba(20, 184, 166, 0.3)'
                  : 'rgba(255, 255, 255, 0.1)',
              color:
                activeTab === tab.id ? '#14b8a6' : 'rgba(255, 255, 255, 0.7)',
              border:
                activeTab === tab.id
                  ? '1px solid #14b8a6'
                  : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '12px 20px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && summary && (
        <div>
          {/* KPI Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                      margin: '0 0 8px 0',
                    }}
                  >
                    Total Vessels
                  </p>
                  <p
                    style={{
                      color: 'white',
                      fontSize: '32px',
                      fontWeight: 'bold',
                      margin: 0,
                    }}
                  >
                    {summary.totalVessels}
                  </p>
                </div>
                <div
                  style={{
                    padding: '12px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    borderRadius: '12px',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>🚢</span>
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                      margin: '0 0 8px 0',
                    }}
                  >
                    Arrivals
                  </p>
                  <p
                    style={{
                      color: 'white',
                      fontSize: '32px',
                      fontWeight: 'bold',
                      margin: 0,
                    }}
                  >
                    {summary.activeArrivals}
                  </p>
                </div>
                <div
                  style={{
                    padding: '12px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    borderRadius: '12px',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>⚓</span>
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                      margin: '0 0 8px 0',
                    }}
                  >
                    Departures
                  </p>
                  <p
                    style={{
                      color: 'white',
                      fontSize: '32px',
                      fontWeight: 'bold',
                      margin: 0,
                    }}
                  >
                    {summary.activeDepartures}
                  </p>
                </div>
                <div
                  style={{
                    padding: '12px',
                    background: 'rgba(245, 158, 11, 0.2)',
                    borderRadius: '12px',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>🌊</span>
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                      margin: '0 0 8px 0',
                    }}
                  >
                    Avg Wait Time
                  </p>
                  <p
                    style={{
                      color: 'white',
                      fontSize: '32px',
                      fontWeight: 'bold',
                      margin: 0,
                    }}
                  >
                    {Math.round(summary.averageWaitTime)}h
                  </p>
                </div>
                <div
                  style={{
                    padding: '12px',
                    background: 'rgba(139, 92, 246, 0.2)',
                    borderRadius: '12px',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>⏱️</span>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Alerts */}
          {summary.criticalAlerts.length > 0 && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                marginBottom: '32px',
              }}
            >
              <h3
                style={{
                  color: '#fca5a5',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  margin: '0 0 16px 0',
                }}
              >
                🚨 Critical Alerts
              </h3>
              {summary.criticalAlerts.map((alert, index) => (
                <div
                  key={index}
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '14px',
                    marginBottom: '8px',
                    paddingLeft: '16px',
                  }}
                >
                  • {alert}
                </div>
              ))}
            </div>
          )}

          {/* Port Congestion */}
          {summary.topCongestionPorts.length > 0 && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  margin: '0 0 16px 0',
                }}
              >
                🚧 Congested Ports
              </h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {summary.topCongestionPorts.map((port, index) => (
                  <span
                    key={index}
                    style={{
                      background: 'rgba(245, 158, 11, 0.2)',
                      color: '#fbbf24',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}
                  >
                    {port}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Vessels Tab */}
      {activeTab === 'vessels' && (
        <div>
          <div
            style={{
              display: 'grid',
              gap: '16px',
            }}
          >
            {vesselData.slice(0, 10).map((vessel, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h4
                      style={{
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        margin: '0 0 8px 0',
                      }}
                    >
                      {vessel.vesselName}
                    </h4>
                    <div
                      style={{
                        display: 'flex',
                        gap: '20px',
                        marginBottom: '12px',
                      }}
                    >
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                        }}
                      >
                        Type: {vessel.vesselType}
                      </span>
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                        }}
                      >
                        MMSI: {vessel.mmsi}
                      </span>
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                        }}
                      >
                        Flag: {vessel.flagState}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '20px',
                        marginBottom: '12px',
                      }}
                    >
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                        }}
                      >
                        Port: {vessel.portName}
                      </span>
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                        }}
                      >
                        {vessel.noticeType}:{' '}
                        {formatDateTime(
                          vessel.noticeType === 'Arrival'
                            ? vessel.arrivalDateTime
                            : vessel.departureDateTime
                        )}
                      </span>
                    </div>
                    {vessel.cargoManifest.length > 0 && (
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                        }}
                      >
                        Cargo: {vessel.cargoManifest[0].commodity} (
                        {vessel.cargoManifest[0].weight.toLocaleString()} tons)
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        background: `${getStatusColor(vessel.currentStatus)}20`,
                        color: getStatusColor(vessel.currentStatus),
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}
                    >
                      {vessel.currentStatus}
                    </span>
                    <span
                      style={{
                        background: `${getCongestionColor(vessel.portCongestion)}20`,
                        color: getCongestionColor(vessel.portCongestion),
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}
                    >
                      {vessel.portCongestion} congestion
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ports Tab */}
      {activeTab === 'ports' && (
        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
            }}
          >
            {portData.map((port, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px',
                  }}
                >
                  <h4
                    style={{
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      margin: 0,
                    }}
                  >
                    {port.portName}
                  </h4>
                  <span
                    style={{
                      background: `${getCongestionColor(port.congestionLevel)}20`,
                      color: getCongestionColor(port.congestionLevel),
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}
                  >
                    {port.congestionLevel}
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '16px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                      }}
                    >
                      Current Vessels
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: 'bold',
                      }}
                    >
                      {port.currentVessels}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                      }}
                    >
                      Berth Utilization
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: 'bold',
                      }}
                    >
                      {port.berthUtilization}%
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                      }}
                    >
                      Wait Time
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: 'bold',
                      }}
                    >
                      {port.averageWaitTime}h
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                      }}
                    >
                      Efficiency
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: 'bold',
                      }}
                    >
                      {port.efficiency}%
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                  }}
                >
                  <div>Arrivals 24h: {port.vesselsArriving24h}</div>
                  <div>Departures 24h: {port.vesselsDeparting24h}</div>
                  <div>
                    Cargo Volume: {port.cargoVolume24h.toLocaleString()} tons
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedules Tab */}
      {activeTab === 'schedules' && (
        <div>
          <div
            style={{
              display: 'grid',
              gap: '16px',
            }}
          >
            {scheduleData.slice(0, 10).map((schedule, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h4
                      style={{
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        margin: '0 0 8px 0',
                      }}
                    >
                      {schedule.vesselName}
                    </h4>
                    <div
                      style={{
                        display: 'flex',
                        gap: '20px',
                        marginBottom: '12px',
                      }}
                    >
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                        }}
                      >
                        Type: {schedule.vesselType}
                      </span>
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                        }}
                      >
                        Line: {schedule.shippingLine}
                      </span>
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                        }}
                      >
                        Berth: {schedule.berthAssignment}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '20px',
                        marginBottom: '12px',
                      }}
                    >
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                        }}
                      >
                        Arrival: {formatDateTime(schedule.scheduledArrival)}
                      </span>
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                        }}
                      >
                        Departure: {formatDateTime(schedule.scheduledDeparture)}
                      </span>
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                      }}
                    >
                      Operations:{' '}
                      {schedule.cargoOperations.loading ? 'Loading' : ''}{' '}
                      {schedule.cargoOperations.unloading ? 'Unloading' : ''}(
                      {schedule.cargoOperations.estimatedDuration}h)
                    </div>
                  </div>
                  <span
                    style={{
                      background: `${getStatusColor(schedule.status)}20`,
                      color: getStatusColor(schedule.status),
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}
                  >
                    {schedule.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NOAA Conditions Tab */}
      {activeTab === 'conditions' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {noaaConditions.map((condition, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <h4 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                    {condition.portName}
                  </h4>
                  <span style={{
                    background: `${getCongestionColor(condition.conditions.safetyLevel === 'green' ? 'low' : condition.conditions.safetyLevel === 'yellow' ? 'medium' : 'high')}20`,
                    color: getCongestionColor(condition.conditions.safetyLevel === 'green' ? 'low' : condition.conditions.safetyLevel === 'yellow' ? 'medium' : 'high'),
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {condition.conditions.safetyLevel}
                  </span>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>Water Level</div>
                    <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>{condition.waterLevel.current}ft</div>
                  </div>
                  <div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>Wind Speed</div>
                    <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>{condition.weather.windSpeed}kts</div>
                  </div>
                  <div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>Current</div>
                    <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>{condition.currents.speed}kts</div>
                  </div>
                  <div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>Visibility</div>
                    <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>{condition.weather.visibility}NM</div>
                  </div>
                </div>

                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                  <div>Next High Tide: {formatDateTime(condition.waterLevel.nextHighTide)}</div>
                  <div>Air Temp: {condition.weather.airTemperature}°F</div>
                  <div>Water Temp: {condition.weather.waterTemperature}°F</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Port Operations Tab */}
      {activeTab === 'operations' && (
        <div>
          <div style={{ display: 'grid', gap: '20px' }}>
            {portOperations.map((operation, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h4 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
                  {operation.portName}
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ color: '#60a5fa', fontSize: '12px' }}>Available Berths</div>
                    <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
                      {operation.berths.filter(b => b.status === 'available').length}/{operation.berths.length}
                    </div>
                  </div>
                  <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ color: '#34d399', fontSize: '12px' }}>Yard Utilization</div>
                    <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
                      {operation.cargo.containerYardUtilization}%
                    </div>
                  </div>
                  <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ color: '#fbbf24', fontSize: '12px' }}>Daily Throughput</div>
                    <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
                      {operation.cargo.dailyThroughput.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ color: '#a78bfa', fontSize: '12px' }}>Avg Wait Time</div>
                    <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
                      {operation.traffic.averageWaitTime.toFixed(1)}h
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <h5 style={{ color: 'white', fontSize: '16px', fontWeight: 'bold', margin: '0 0 12px 0' }}>
                      Terminals ({operation.terminals.length})
                    </h5>
                    {operation.terminals.slice(0, 3).map((terminal, i) => (
                      <div key={i} style={{ marginBottom: '8px', color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                        {terminal.terminalName}: {terminal.utilization}% utilization
                      </div>
                    ))}
                  </div>
                  <div>
                    <h5 style={{ color: 'white', fontSize: '16px', fontWeight: 'bold', margin: '0 0 12px 0' }}>
                      Traffic Status
                    </h5>
                    <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                      <div>Vessel Queue: {operation.traffic.vesselQueue}</div>
                      <div>Channel: {operation.traffic.channelStatus}</div>
                      <div>Pilotage: {operation.traffic.pilotageStatus}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BTS Commerce Tab */}
      {activeTab === 'commerce' && (
        <div>
          <div style={{ display: 'grid', gap: '20px' }}>
            {commerceData.map((commerce, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <h4 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                      {commerce.port_name}
                    </h4>
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                      {commerce.state} • Market Share: {commerce.market_share.toFixed(1)}%
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: commerce.tonnage_growth_rate > 0 ? '#10b981' : '#ef4444', fontSize: '18px', fontWeight: 'bold' }}>
                      {commerce.tonnage_growth_rate > 0 ? '+' : ''}{commerce.tonnage_growth_rate.toFixed(1)}%
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>Growth Rate</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ color: '#60a5fa', fontSize: '12px' }}>Total Tonnage</div>
                    <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>
                      {(commerce.total_tonnage / 1000000).toFixed(1)}M tons
                    </div>
                  </div>
                  <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ color: '#34d399', fontSize: '12px' }}>Total Value</div>
                    <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>
                      ${(commerce.total_value_millions / 1000).toFixed(1)}B
                    </div>
                  </div>
                  <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ color: '#fbbf24', fontSize: '12px' }}>Imports</div>
                    <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>
                      {(commerce.imports / 1000000).toFixed(1)}M tons
                    </div>
                  </div>
                  <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ color: '#a78bfa', fontSize: '12px' }}>Exports</div>
                    <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>
                      {(commerce.exports / 1000000).toFixed(1)}M tons
                    </div>
                  </div>
                </div>

                <div>
                  <h5 style={{ color: 'white', fontSize: '16px', fontWeight: 'bold', margin: '0 0 12px 0' }}>
                    Top Commodities
                  </h5>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    {commerce.top_commodities.slice(0, 4).map((commodity, i) => (
                      <div key={i} style={{ 
                        background: 'rgba(255, 255, 255, 0.05)', 
                        padding: '8px 12px', 
                        borderRadius: '6px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ color: 'white', fontSize: '14px' }}>{commodity.commodity}</span>
                        <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                          {commodity.percentage_of_total}%
                        </span>
                      </div>
                    ))}
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
