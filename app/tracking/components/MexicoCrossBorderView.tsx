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

  // Mexico Cross-Border Integration
  crossBorderInfo?: {
    borderCrossing: string;
    crossingStatus:
      | 'pending'
      | 'in-process'
      | 'cleared'
      | 'delayed'
      | 'rejected';
    manifestType: 'ACE' | 'SAAI-M' | 'Both';
    aceManifestId?: string;
    saaiManifestId?: string;
    papsNumber?: string;
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

  mexicanCompliance?: {
    rfcNumber?: string; // Mexican Tax ID
    immexProgram?: boolean;
    customsRegime: 'definitive' | 'temporary' | 'maquiladora';
    permitRequired: boolean;
    permitNumber?: string;
    hazmatDeclaration?: boolean;
    originCertificate?: boolean;
    phytosanitaryCert?: boolean;
  };
}

interface MexicoCrossBorderData {
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
    aceCompliance: number; // percentage
    saaiCompliance: number; // percentage
    documentationErrors: number;
    inspectionRate: number; // percentage
  };
  recentAlerts: string[];
}

interface MexicoCrossBorderViewProps {
  shipments: Shipment[];
}

export default function MexicoCrossBorderView({
  shipments,
}: MexicoCrossBorderViewProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [crossBorderData, setCrossBorderData] =
    useState<MexicoCrossBorderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCrossBorderData();
  }, []);

  const fetchCrossBorderData = async () => {
    try {
      setLoading(true);
      // Simulate API call to Mexico cross-border intelligence
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setCrossBorderData({
        totalCrossBorderShipments: 1247,
        pendingClearance: 89,
        averageCrossingTime: 2.3,
        delayedShipments: 23,
        majorCrossings: [
          {
            name: 'Laredo/Nuevo Laredo',
            code: 'LRD',
            waitTime: 1.8,
            throughput: 4500,
            congestionLevel: 'medium',
            operatingHours: '24/7',
          },
          {
            name: 'El Paso/Ciudad Juárez',
            code: 'ELP',
            waitTime: 2.1,
            throughput: 2800,
            congestionLevel: 'high',
            operatingHours: '6:00 AM - 10:00 PM',
          },
          {
            name: 'Otay Mesa/Tijuana',
            code: 'OTM',
            waitTime: 3.2,
            throughput: 1900,
            congestionLevel: 'critical',
            operatingHours: '6:00 AM - 2:00 AM',
          },
          {
            name: 'Brownsville/Matamoros',
            code: 'BRO',
            waitTime: 1.5,
            throughput: 1200,
            congestionLevel: 'low',
            operatingHours: '24/7',
          },
          {
            name: 'Nogales/Nogales',
            code: 'NOG',
            waitTime: 2.7,
            throughput: 950,
            congestionLevel: 'medium',
            operatingHours: '6:00 AM - 8:00 PM',
          },
        ],
        complianceStats: {
          aceCompliance: 94.2,
          saaiCompliance: 87.6,
          documentationErrors: 156,
          inspectionRate: 12.8,
        },
        recentAlerts: [
          'QR Code requirements now mandatory at Laredo port',
          'Enhanced security screening at El Paso due to high risk cargo',
          'Otay Mesa experiencing 4+ hour delays due to system maintenance',
          'New IMMEX documentation requirements effective January 2025',
          'Weather delays expected at Nogales crossing this weekend',
        ],
      });
    } catch (error) {
      console.error('Error fetching cross-border data:', error);
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
      overview: { bg: '#3b82f6', border: '#2563eb' },
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
          background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
          borderRadius: '16px',
          color: 'white',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🇲🇽</div>
          <div style={{ fontSize: '18px', fontWeight: '600' }}>
            Loading Mexico Cross-Border Intelligence...
          </div>
          <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '8px' }}>
            Fetching SAAI-M, ACE, and border crossing data
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
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
            🇲🇽 Mexico Cross-Border Intelligence
          </h2>
          <p
            style={{
              fontSize: '16px',
              opacity: 0.9,
              margin: '8px 0 0 0',
            }}
          >
            Comprehensive SAAI-M, ACE Manifest, and border crossing analytics
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
          { id: 'manifest', label: 'SAAI-M Request', icon: '📄' },
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
                    color: '#60a5fa',
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
                  {crossBorderData.complianceStats.aceCompliance}%
                </div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  ACE Compliance
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
                  {crossBorderData.complianceStats.saaiCompliance}%
                </div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  SAAI-M Compliance
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
                      color: '#60a5fa',
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
              🇺🇸 ACE Manifest System
            </h3>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                Requirements:
              </div>
              <ul
                style={{ fontSize: '12px', opacity: 0.9, paddingLeft: '16px' }}
              >
                <li>Submit 1 hour before arrival</li>
                <li>PAPS barcode labels required</li>
                <li>QR code mandatory at Laredo</li>
                <li>C-TPAT certification recommended</li>
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
                94.2% Compliant
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
              🇲🇽 SAAI-M System
            </h3>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                Requirements:
              </div>
              <ul
                style={{ fontSize: '12px', opacity: 0.9, paddingLeft: '16px' }}
              >
                <li>Electronic manifest required</li>
                <li>Mexican customs broker needed</li>
                <li>RFC number for importers</li>
                <li>IMMEX program if applicable</li>
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
                87.6% Compliant
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'manifest' && (
        <div
          style={{
            display: 'grid',
            gap: '24px',
          }}
        >
          {/* SAAI-M & ACE Request System */}
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
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              🇲🇽 SAAI-M & ACE Request System
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '16px',
              }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    marginBottom: '4px',
                    color: 'white',
                  }}
                >
                  Shipment ID
                </label>
                <input
                  type='text'
                  placeholder='Enter shipment ID'
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    marginBottom: '4px',
                    color: 'white',
                  }}
                >
                  Border Crossing
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                  }}
                >
                  <option value=''>Select crossing</option>
                  <option value='LAR'>Laredo/Nuevo Laredo</option>
                  <option value='ELP'>El Paso/Ciudad Juárez</option>
                  <option value='OTM'>Otay Mesa/Tijuana</option>
                  <option value='CAL'>Calexico/Mexicali</option>
                  <option value='NOG'>Nogales/Nogales</option>
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    marginBottom: '4px',
                    color: 'white',
                  }}
                >
                  Mexican RFC Number
                </label>
                <input
                  type='text'
                  placeholder='ABCD123456ABC'
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    marginBottom: '4px',
                    color: 'white',
                  }}
                >
                  Customs Broker
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                  }}
                >
                  <option value=''>Select broker</option>
                  <option value='agencia-lopez'>Agencia Aduanal López</option>
                  <option value='customs-hernandez'>
                    Customs Broker Hernández
                  </option>
                  <option value='sat-solutions'>SAT Solutions</option>
                  <option value='mexico-trade'>Mexico Trade Partners</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <button
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                📝 Submit SAAI-M Request
              </button>
              <button
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                🇺🇸 Submit ACE Manifest
              </button>
              <button
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                🔍 Check Status
              </button>
              <button
                style={{
                  background: 'rgba(251, 191, 36, 0.8)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                🏷️ Generate QR Codes
              </button>
            </div>

            {/* SAAI-M & ACE Process Steps */}
            <div
              style={{
                marginTop: '20px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
              }}
            >
              <h4
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '12px',
                  color: 'white',
                }}
              >
                📋 Cross-Border Process Timeline
              </h4>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '12px',
                }}
              >
                {[
                  {
                    step: '1',
                    title: 'ACE Manifest',
                    time: '2-4h before',
                    status: 'completed',
                    system: 'US',
                  },
                  {
                    step: '2',
                    title: 'SAAI-M Submit',
                    time: '1-2h before',
                    status: 'in-progress',
                    system: 'MX',
                  },
                  {
                    step: '3',
                    title: 'QR Code Gen',
                    time: '30 minutes',
                    status: 'pending',
                    system: 'US',
                  },
                  {
                    step: '4',
                    title: 'Pedimento',
                    time: '1 hour',
                    status: 'pending',
                    system: 'MX',
                  },
                  {
                    step: '5',
                    title: 'Border Crossing',
                    time: '15-45 min',
                    status: 'pending',
                    system: 'Both',
                  },
                  {
                    step: '6',
                    title: 'Final Clearance',
                    time: '10 minutes',
                    status: 'pending',
                    system: 'Both',
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    style={{
                      background:
                        item.status === 'completed'
                          ? 'rgba(16, 185, 129, 0.2)'
                          : item.status === 'in-progress'
                            ? 'rgba(251, 191, 36, 0.2)'
                            : 'rgba(255, 255, 255, 0.1)',
                      border: `1px solid ${
                        item.status === 'completed'
                          ? '#10b981'
                          : item.status === 'in-progress'
                            ? '#fbbf24'
                            : 'rgba(255, 255, 255, 0.2)'
                      }`,
                      padding: '12px',
                      borderRadius: '6px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '16px', marginBottom: '4px' }}>
                      {item.status === 'completed'
                        ? '✅'
                        : item.status === 'in-progress'
                          ? '⏳'
                          : '⏸️'}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        color: 'white',
                        marginBottom: '2px',
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        fontSize: '9px',
                        opacity: 0.8,
                        color: 'white',
                        marginBottom: '2px',
                      }}
                    >
                      {item.time}
                    </div>
                    <div
                      style={{
                        fontSize: '8px',
                        opacity: 0.7,
                        color:
                          item.system === 'US'
                            ? '#3b82f6'
                            : item.system === 'MX'
                              ? '#10b981'
                              : '#f59e0b',
                        fontWeight: '600',
                      }}
                    >
                      {item.system}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Manifests */}
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
              📄 Active Mexico Cross-Border Manifests
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
                      {shipment.crossBorderInfo?.manifestType || 'ACE/SAAI-M'}
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
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>
                      Crossing
                    </div>
                    <div style={{ fontWeight: '600', fontSize: '12px' }}>
                      {shipment.crossBorderInfo?.borderCrossing || 'Laredo'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
            🚨 Recent Cross-Border Alerts
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
