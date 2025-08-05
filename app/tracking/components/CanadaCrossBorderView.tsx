'use client';

import { useEffect, useState } from 'react';

interface Shipment {
  id: string;
  status: 'in-transit' | 'delivered' | 'delayed' | 'loading' | 'unloading';
  origin: string;
  destination: string;
  carrier: string;
  progress: number;
  currentLocation: [number, number];
  originCoords: [number, number];
  destCoords: [number, number];
  speed: number;
  eta: string;
  driverName?: string;
  driverPhone?: string;
  vehicleInfo?: string;
  temperature?: number;
  humidity?: number;
  fuelLevel?: number;
  lastUpdate?: string;
  alerts?: string[];
  priority: 'high' | 'medium' | 'low';
  value: number;
  weight: number;
  commodity: string;
  createdDate?: string;
  pickupDate?: string;
  deliveryDate?: string;
  customerName?: string;
  miles?: number;

  // Canada Cross-Border Integration
  crossBorderInfo?: {
    borderCrossing: string;
    crossingStatus:
      | 'pending'
      | 'in-process'
      | 'cleared'
      | 'delayed'
      | 'rejected';
    manifestType: 'ACI' | 'PARS' | 'Both';
    aciManifestId?: string;
    parsNumber?: string;
    customsBroker?: string;
    estimatedCrossingTime?: string;
    actualCrossingTime?: string;
    delayReason?: string;
    inspectionRequired?: boolean;
    documentsStatus: 'complete' | 'pending' | 'missing';
    customsValue: number;
    dutiesOwed?: number;
    lastStatusUpdate?: string;
  };

  canadianCompliance?: {
    businessNumber?: string; // Canadian Business Number
    cttcProgram?: boolean; // Customs Trade Partnership Against Terrorism
    importerNumber?: string;
    permitRequired: boolean;
    permitNumber?: string;
    hazmatDeclaration?: boolean;
    originCertificate?: boolean;
    phytosanitaryCert?: boolean;
    fastCard?: boolean; // Free and Secure Trade program
  };
}

interface CanadaCrossBorderData {
  totalCrossBorderShipments: number;
  pendingClearance: number;
  averageCrossingTime: number; // hours
  delayedShipments: number;
  majorCrossings: {
    name: string;
    code: string;
    waitTime: number; // hours
    throughput: number; // shipments per day
    congestionLevel: 'low' | 'medium' | 'high' | 'critical';
    operatingHours: string;
  }[];
  complianceStats: {
    aciCompliance: number; // percentage
    parsCompliance: number; // percentage
    documentationErrors: number;
    inspectionRate: number; // percentage
  };
  recentAlerts: string[];
}

interface CanadaCrossBorderViewProps {
  shipments: Shipment[];
}

export default function CanadaCrossBorderView({
  shipments,
}: CanadaCrossBorderViewProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [crossBorderData, setCrossBorderData] =
    useState<CanadaCrossBorderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCrossBorderData();
  }, []);

  const fetchCrossBorderData = async () => {
    try {
      setLoading(true);
      // Simulate API call to Canada cross-border intelligence
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setCrossBorderData({
        totalCrossBorderShipments: 1456,
        pendingClearance: 67,
        averageCrossingTime: 1.8,
        delayedShipments: 18,
        majorCrossings: [
          {
            name: 'Ambassador Bridge/Windsor',
            code: 'AMB',
            waitTime: 1.2,
            throughput: 8500,
            congestionLevel: 'medium',
            operatingHours: '24/7',
          },
          {
            name: 'Peace Bridge/Fort Erie',
            code: 'PEA',
            waitTime: 2.1,
            throughput: 4200,
            congestionLevel: 'high',
            operatingHours: '24/7',
          },
          {
            name: 'Rainbow Bridge/Niagara Falls',
            code: 'RBW',
            waitTime: 1.7,
            throughput: 2800,
            congestionLevel: 'medium',
            operatingHours: '6:00 AM - 2:00 AM',
          },
          {
            name: 'Thousand Islands Bridge',
            code: 'TIB',
            waitTime: 1.3,
            throughput: 1500,
            congestionLevel: 'low',
            operatingHours: '6:00 AM - 10:00 PM',
          },
          {
            name: 'Pacific Highway/Surrey',
            code: 'PAC',
            waitTime: 2.8,
            throughput: 3200,
            congestionLevel: 'high',
            operatingHours: '24/7',
          },
        ],
        complianceStats: {
          aciCompliance: 96.8,
          parsCompliance: 94.3,
          documentationErrors: 89,
          inspectionRate: 8.2,
        },
        recentAlerts: [
          'ACI eManifest system maintenance scheduled for this weekend',
          'Enhanced inspection protocols at Peace Bridge due to security alert',
          'FAST lane delays at Ambassador Bridge - system upgrades in progress',
          'New CBSA documentation requirements effective February 2025',
          'Weather advisory: Snow delays expected at Pacific Highway crossing',
        ],
      });
    } catch (error) {
      console.error('Error fetching Canada cross-border data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCongestionColor = (level: string) => {
    switch (level) {
      case 'low':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'high':
        return '#ef4444';
      case 'critical':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  const getTabColors = (tabId: string) => {
    const colors = {
      overview: { bg: '#dc2626', border: '#b91c1c' },
      crossings: { bg: '#10b981', border: '#059669' },
      compliance: { bg: '#f59e0b', border: '#d97706' },
      manifest: { bg: '#8b5cf6', border: '#7c3aed' },
      alerts: { bg: '#ef4444', border: '#dc2626' },
    };
    return colors[tabId as keyof typeof colors] || colors.overview;
  };

  const crossBorderShipments = shipments.filter((s) => s.crossBorderInfo);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
          background: 'linear-gradient(135deg, #dc2626, #ef4444)',
          borderRadius: '16px',
          color: 'white',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🇨🇦</div>
          <div style={{ fontSize: '18px', fontWeight: '600' }}>
            Loading Canada Cross-Border Intelligence...
          </div>
          <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '8px' }}>
            Fetching PARS, ACI eManifest, and border crossing data
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #dc2626, #ef4444)',
        borderRadius: '16px',
        padding: '32px',
        color: 'white',
        minHeight: '600px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            🇨🇦 Canada Cross-Border Intelligence
          </h2>
          <p
            style={{
              fontSize: '16px',
              opacity: 0.9,
              margin: '8px 0 0 0',
            }}
          >
            Comprehensive PARS, ACI eManifest, and CBSA border analytics
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            🚛 {crossBorderShipments.length} Cross-Border Loads
          </div>
          <button
            onClick={fetchCrossBorderData}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '32px',
          flexWrap: 'wrap',
        }}
      >
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'crossings', label: 'Border Crossings', icon: '🌉' },
          { id: 'compliance', label: 'Compliance', icon: '📋' },
          { id: 'manifest', label: 'Manifest Tracking', icon: '📄' },
          { id: 'alerts', label: 'Alerts', icon: '🚨' },
        ].map((tab) => {
          const colors = getTabColors(tab.id);
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background:
                  activeTab === tab.id ? colors.bg : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border:
                  activeTab === tab.id
                    ? `2px solid ${colors.border}`
                    : '2px solid rgba(255, 255, 255, 0.2)',
                transform:
                  activeTab === tab.id ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow:
                  activeTab === tab.id
                    ? '0 8px 25px rgba(0, 0, 0, 0.3)'
                    : 'none',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && crossBorderData && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          {/* Overview KPIs */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '24px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
                color: 'white',
              }}
            >
              📊 Cross-Border Summary
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#fca5a5',
                  }}
                >
                  {crossBorderData.totalCrossBorderShipments.toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  Total Shipments
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#fbbf24',
                  }}
                >
                  {crossBorderData.pendingClearance}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  Pending Clearance
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#34d399',
                  }}
                >
                  {crossBorderData.averageCrossingTime}h
                </div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  Avg Crossing Time
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#f87171',
                  }}
                >
                  {crossBorderData.delayedShipments}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Delayed</div>
              </div>
            </div>
          </div>

          {/* Compliance Overview */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '24px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
                color: 'white',
              }}
            >
              📋 Compliance Overview
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#34d399',
                  }}
                >
                  {crossBorderData.complianceStats.aciCompliance}%
                </div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  ACI Compliance
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#fbbf24',
                  }}
                >
                  {crossBorderData.complianceStats.parsCompliance}%
                </div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  PARS Compliance
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#f87171',
                  }}
                >
                  {crossBorderData.complianceStats.documentationErrors}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Doc Errors</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#a78bfa',
                  }}
                >
                  {crossBorderData.complianceStats.inspectionRate}%
                </div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  Inspection Rate
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'crossings' && crossBorderData && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '24px',
          }}
        >
          {crossBorderData.majorCrossings.map((crossing, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '24px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
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
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'white',
                    margin: 0,
                  }}
                >
                  🌉 {crossing.name}
                </h3>
                <div
                  style={{
                    background: getCongestionColor(crossing.congestionLevel),
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                  }}
                >
                  {crossing.congestionLevel}
                </div>
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
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#fca5a5',
                    }}
                  >
                    {crossing.waitTime}h
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>
                    Wait Time
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#34d399',
                    }}
                  >
                    {crossing.throughput.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>
                    Daily Throughput
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              >
                <div style={{ marginBottom: '4px' }}>
                  <strong>Code:</strong> {crossing.code}
                </div>
                <div>
                  <strong>Hours:</strong> {crossing.operatingHours}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'compliance' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '24px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
                color: 'white',
              }}
            >
              🇨🇦 ACI eManifest System
            </h3>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                Requirements:
              </div>
              <ul
                style={{ fontSize: '12px', opacity: 0.9, paddingLeft: '16px' }}
              >
                <li>Submit 1 hour before arrival</li>
                <li>Electronic manifest required</li>
                <li>CBSA pre-screening process</li>
                <li>FAST card recommended</li>
              </ul>
            </div>
            <div
              style={{
                background: 'rgba(52, 211, 153, 0.2)',
                padding: '12px',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#34d399',
                }}
              >
                96.8% Compliant
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '24px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
                color: 'white',
              }}
            >
              📋 PARS System
            </h3>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                Requirements:
              </div>
              <ul
                style={{ fontSize: '12px', opacity: 0.9, paddingLeft: '16px' }}
              >
                <li>Pre-arrival processing system</li>
                <li>Customs broker coordination</li>
                <li>PARS barcode labels</li>
                <li>Release on minimum documentation</li>
              </ul>
            </div>
            <div
              style={{
                background: 'rgba(251, 191, 36, 0.2)',
                padding: '12px',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#fbbf24',
                }}
              >
                94.3% Compliant
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'manifest' && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '24px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
              color: 'white',
            }}
          >
            📄 Active Canada Cross-Border Manifests
          </h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            {crossBorderShipments.slice(0, 5).map((shipment, index) => (
              <div
                key={shipment.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '16px',
                  borderRadius: '8px',
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr',
                  gap: '16px',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                    {shipment.id}
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>
                    {shipment.origin} → {shipment.destination}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>
                    Manifest Type
                  </div>
                  <div style={{ fontWeight: '600' }}>
                    {shipment.crossBorderInfo?.manifestType || 'ACI'}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>Status</div>
                  <div
                    style={{
                      background:
                        shipment.crossBorderInfo?.crossingStatus === 'cleared'
                          ? '#10b981'
                          : '#f59e0b',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    {shipment.crossBorderInfo?.crossingStatus || 'pending'}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>Crossing</div>
                  <div style={{ fontWeight: '600', fontSize: '12px' }}>
                    {shipment.crossBorderInfo?.borderCrossing || 'Ambassador'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'alerts' && crossBorderData && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '24px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
              color: 'white',
            }}
          >
            🚨 Recent Canada Cross-Border Alerts
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {crossBorderData.recentAlerts.map((alert, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '16px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div style={{ fontSize: '20px' }}>⚠️</div>
                <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
                  {alert}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}