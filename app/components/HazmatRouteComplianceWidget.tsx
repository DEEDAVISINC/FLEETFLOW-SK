'use client';

import { useEffect, useState } from 'react';
import { useFeatureFlag } from '../config/feature-flags';

interface HazmatLoadRequest {
  loadId: string;
  origin: string;
  destination: string;
  hazmatClass: string;
  unNumber: string;
  properShippingName: string;
  packingGroup: 'I' | 'II' | 'III';
  quantity: number;
  unitOfMeasure: 'kg' | 'lbs' | 'liters' | 'gallons';
  equipmentType: 'dry-van' | 'tank' | 'flatbed' | 'specialized';
  requiredDeliveryDate: string;
  emergencyContact: {
    name: string;
    phone: string;
    company: string;
  };
  customerTier: 'standard' | 'premium' | 'enterprise';
  specialInstructions?: string;
}

interface HazmatRegulation {
  jurisdiction: string;
  authority: string;
  regulationType:
    | 'routing'
    | 'documentation'
    | 'equipment'
    | 'training'
    | 'emergency';
  requirement: string;
  isRequired: boolean;
  penalty: string;
  referenceCode: string;
  lastUpdated: string;
}

interface RouteRestriction {
  restrictionId: string;
  type: 'tunnel' | 'bridge' | 'populated_area' | 'time_based' | 'seasonal';
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  affectedClasses: string[];
  timeRestrictions?: {
    startTime: string;
    endTime: string;
    daysOfWeek: string[];
  };
  alternativeRoute: string;
  description: string;
}

interface HazmatRouteAnalysis {
  result: HazmatLoadRequest;
  confidence: number;
  reasoning: string;
  recommendations: string[];
  riskFactors: string[];
  complianceStatus:
    | 'compliant'
    | 'violations'
    | 'requires_permits'
    | 'prohibited';
  recommendedRoute: {
    totalDistance: number;
    totalTime: number;
    routeSegments: string[];
    avoidedRestrictions: RouteRestriction[];
    requiredStops: string[];
  };
  regulatoryRequirements: HazmatRegulation[];
  requiredDocuments: string[];
  equipmentRequirements: string[];
  driverRequirements: {
    hazmatEndorsement: boolean;
    specialTraining: string[];
    medicalCertification: boolean;
  };
  routeRestrictions: RouteRestriction[];
  emergencyProcedures: string[];
  estimatedCosts: {
    permits: number;
    specialEquipment: number;
    driverTraining: number;
    insurance: number;
    totalAdditional: number;
  };
  riskAssessment: {
    environmentalRisk: 'low' | 'medium' | 'high';
    publicSafetyRisk: 'low' | 'medium' | 'high';
    transportationRisk: 'low' | 'medium' | 'high';
    overallRisk: 'low' | 'medium' | 'high';
  };
  complianceChecklist: string[];
}

interface HazmatClassification {
  class: string;
  division?: string;
  description: string;
  examples: string[];
  specialRequirements: string[];
  routingRestrictions: string[];
  packingGroupRequired: boolean;
}

export default function HazmatRouteComplianceWidget() {
  const isEnabled = useFeatureFlag('HAZMAT_ROUTE_COMPLIANCE');

  // Debug logging
  console.log('HazmatRouteComplianceWidget - isEnabled:', isEnabled);
  console.log(
    'HazmatRouteComplianceWidget - process.env.ENABLE_HAZMAT_ROUTE_COMPLIANCE:',
    process.env.ENABLE_HAZMAT_ROUTE_COMPLIANCE
  );
  console.log(
    'HazmatRouteComplianceWidget - process.env.NEXT_PUBLIC_ENABLE_HAZMAT_ROUTE_COMPLIANCE:',
    process.env.NEXT_PUBLIC_ENABLE_HAZMAT_ROUTE_COMPLIANCE
  );

  // Temporary force enable for debugging - remove this after fixing
  const forceEnabled = true;

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<HazmatRouteAnalysis | null>(null);
  const [classifications, setClassifications] = useState<
    HazmatClassification[]
  >([]);
  const [regulations, setRegulations] = useState<HazmatRegulation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'analyzer' | 'classifications' | 'regulations'
  >('analyzer');

  // Form state
  const [loadRequest, setLoadRequest] = useState<HazmatLoadRequest>({
    loadId: '',
    origin: '',
    destination: '',
    hazmatClass: '3',
    unNumber: '',
    properShippingName: '',
    packingGroup: 'III',
    quantity: 0,
    unitOfMeasure: 'lbs',
    equipmentType: 'dry-van',
    requiredDeliveryDate: '',
    emergencyContact: {
      name: '',
      phone: '',
      company: '',
    },
    customerTier: 'standard',
    specialInstructions: '',
  });

  useEffect(() => {
    if (forceEnabled) {
      loadClassifications();
    }
  }, [forceEnabled]);

  const loadClassifications = async () => {
    try {
      const response = await fetch(
        '/api/analytics/hazmat-compliance?action=classifications'
      );
      const data = await response.json();
      if (data.success) {
        setClassifications(data.data);
      }
    } catch (error) {
      console.error('Error loading classifications:', error);
    }
  };

  const loadRegulations = async () => {
    if (!loadRequest.hazmatClass) {
      setError('Please select a hazmat class to load regulations');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/analytics/hazmat-compliance?action=regulations&hazmatClass=${loadRequest.hazmatClass}`
      );
      const data = await response.json();

      if (data.success) {
        setRegulations(data.data);
        setActiveTab('regulations');
      } else {
        setError(data.error || 'Failed to load regulations');
      }
    } catch (error) {
      setError('Failed to load hazmat regulations');
      console.error('Error loading regulations:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeHazmatRoute = async () => {
    if (
      !loadRequest.loadId ||
      !loadRequest.origin ||
      !loadRequest.destination ||
      !loadRequest.unNumber ||
      !loadRequest.properShippingName
    ) {
      setError(
        'Please fill in all required fields (Load ID, Origin, Destination, UN Number, Proper Shipping Name)'
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analytics/hazmat-compliance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'analyze',
          loadRequest,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAnalysis(data.data);
        setActiveTab('analyzer');
      } else {
        setError(data.error || 'Hazmat analysis failed');
      }
    } catch (error) {
      setError('Failed to analyze hazmat route');
      console.error('Error analyzing hazmat route:', error);
    } finally {
      setLoading(false);
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return '#10b981';
      case 'requires_permits':
        return '#f59e0b';
      case 'violations':
        return '#ef4444';
      case 'prohibited':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'high':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getHazmatClassColor = (hazmatClass: string) => {
    const colors: { [key: string]: string } = {
      '1': '#dc2626', // Red - Explosives
      '2': '#f59e0b', // Orange - Gases
      '3': '#ef4444', // Red - Flammable Liquids
      '4': '#f97316', // Orange - Flammable Solids
      '5': '#eab308', // Yellow - Oxidizers
      '6': '#8b5cf6', // Purple - Toxic
      '7': '#ec4899', // Pink - Radioactive
      '8': '#06b6d4', // Cyan - Corrosive
      '9': '#6b7280', // Gray - Miscellaneous
    };
    return colors[hazmatClass] || '#6b7280';
  };

  if (!forceEnabled) {
    return (
      <div
        style={{
          background: 'rgba(251, 191, 36, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(251, 191, 36, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
            }}
          >
            <span style={{ fontSize: '24px' }}>☢️</span>
          </div>
          <div>
            <h3
              style={{
                fontWeight: '600',
                color: 'white',
                fontSize: '18px',
                margin: '0 0 8px 0',
              }}
            >
              Hazmat Route Compliance
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.95)',
                margin: 0,
              }}
            >
              Enable ENABLE_HAZMAT_ROUTE_COMPLIANCE=true to access hazmat
              routing features
            </p>
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
        border: '2px solid rgba(249, 115, 22, 0.6)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div
        style={{
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
            }}
          >
            <span style={{ fontSize: '32px' }}>☢️</span>
          </div>
          <div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'white',
                margin: '0 0 8px 0',
                textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              }}
            >
              Hazmat Route Compliance
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.95)',
                margin: 0,
              }}
            >
              Dangerous goods routing with regulatory compliance
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '32px',
          border: '2px solid rgba(249, 115, 22, 0.4)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          gap: '8px',
        }}
      >
        {[
          { id: 'analyzer', label: 'Route Analyzer', icon: '📋' },
          { id: 'classifications', label: 'Hazmat Classes', icon: '☢️' },
          { id: 'regulations', label: 'Regulations', icon: '📋' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              flex: 1,
              background:
                activeTab === tab.id
                  ? 'rgba(255, 255, 255, 0.9)'
                  : 'rgba(255, 255, 255, 0.2)',
              color: activeTab === tab.id ? '#4c1d95' : 'white',
              transform:
                activeTab === tab.id ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow:
                activeTab === tab.id
                  ? '0 8px 25px rgba(0, 0, 0, 0.15)'
                  : 'none',
            }}
            onMouseOver={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              }
            }}
            onMouseOut={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }
            }}
          >
            <span style={{ marginRight: '8px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Route Analyzer Tab */}
      {activeTab === 'analyzer' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '32px',
            }}
          >
            {/* Load Information */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '2px solid rgba(249, 115, 22, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <h3
                style={{
                  fontWeight: '600',
                  color: 'white',
                  fontSize: '18px',
                  margin: 0,
                }}
              >
                Load Information
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '16px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'white',
                      marginBottom: '8px',
                    }}
                  >
                    Load ID
                  </label>
                  <input
                    type='text'
                    value={loadRequest.loadId}
                    onChange={(e) =>
                      setLoadRequest({ ...loadRequest, loadId: e.target.value })
                    }
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    placeholder='e.g., HAZ-001'
                    onFocus={(e) => {
                      e.target.style.border =
                        '1px solid rgba(59, 130, 246, 0.6)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border =
                        '1px solid rgba(255, 255, 255, 0.3)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'white',
                      marginBottom: '8px',
                    }}
                  >
                    Hazmat Class
                  </label>
                  <select
                    value={loadRequest.hazmatClass}
                    onChange={(e) =>
                      setLoadRequest({
                        ...loadRequest,
                        hazmatClass: e.target.value,
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.border =
                        '1px solid rgba(59, 130, 246, 0.6)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border =
                        '1px solid rgba(255, 255, 255, 0.3)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    <option
                      value='1'
                      style={{ background: '#1f2937', color: 'white' }}
                    >
                      Class 1 - Explosives
                    </option>
                    <option
                      value='2'
                      style={{ background: '#1f2937', color: 'white' }}
                    >
                      Class 2 - Gases
                    </option>
                    <option
                      value='3'
                      style={{ background: '#1f2937', color: 'white' }}
                    >
                      Class 3 - Flammable Liquids
                    </option>
                    <option
                      value='4'
                      style={{ background: '#1f2937', color: 'white' }}
                    >
                      Class 4 - Flammable Solids
                    </option>
                    <option
                      value='5'
                      style={{ background: '#1f2937', color: 'white' }}
                    >
                      Class 5 - Oxidizers
                    </option>
                    <option
                      value='6'
                      style={{ background: '#1f2937', color: 'white' }}
                    >
                      Class 6 - Toxic Substances
                    </option>
                    <option
                      value='7'
                      style={{ background: '#1f2937', color: 'white' }}
                    >
                      Class 7 - Radioactive
                    </option>
                    <option
                      value='8'
                      style={{ background: '#1f2937', color: 'white' }}
                    >
                      Class 8 - Corrosive
                    </option>
                    <option
                      value='9'
                      style={{ background: '#1f2937', color: 'white' }}
                    >
                      Class 9 - Miscellaneous
                    </option>
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'white',
                      marginBottom: '8px',
                    }}
                  >
                    UN Number
                  </label>
                  <input
                    type='text'
                    value={loadRequest.unNumber}
                    onChange={(e) =>
                      setLoadRequest({
                        ...loadRequest,
                        unNumber: e.target.value,
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    placeholder='e.g., UN1203'
                    onFocus={(e) => {
                      e.target.style.border =
                        '1px solid rgba(59, 130, 246, 0.6)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border =
                        '1px solid rgba(255, 255, 255, 0.3)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'white',
                      marginBottom: '8px',
                    }}
                  >
                    Packing Group
                  </label>
                  <select
                    value={loadRequest.packingGroup}
                    onChange={(e) =>
                      setLoadRequest({
                        ...loadRequest,
                        packingGroup: e.target.value as 'I' | 'II' | 'III',
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.border =
                        '1px solid rgba(59, 130, 246, 0.6)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border =
                        '1px solid rgba(255, 255, 255, 0.3)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    <option
                      value='I'
                      style={{ background: '#1f2937', color: 'white' }}
                    >
                      Packing Group I (High Danger)
                    </option>
                    <option
                      value='II'
                      style={{ background: '#1f2937', color: 'white' }}
                    >
                      Packing Group II (Medium Danger)
                    </option>
                    <option
                      value='III'
                      style={{ background: '#1f2937', color: 'white' }}
                    >
                      Packing Group III (Low Danger)
                    </option>
                  </select>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'white',
                      marginBottom: '8px',
                    }}
                  >
                    Proper Shipping Name
                  </label>
                  <input
                    type='text'
                    value={loadRequest.properShippingName}
                    onChange={(e) =>
                      setLoadRequest({
                        ...loadRequest,
                        properShippingName: e.target.value,
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    placeholder='e.g., Gasoline'
                    onFocus={(e) => {
                      e.target.style.border =
                        '1px solid rgba(59, 130, 246, 0.6)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border =
                        '1px solid rgba(255, 255, 255, 0.3)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Route & Quantity Information */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '2px solid rgba(249, 115, 22, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <h3
                style={{
                  fontWeight: '600',
                  color: 'white',
                  fontSize: '18px',
                  margin: 0,
                }}
              >
                Route & Quantity Information
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '16px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'white',
                      marginBottom: '8px',
                    }}
                  >
                    Origin
                  </label>
                  <input
                    type='text'
                    value={loadRequest.origin}
                    onChange={(e) =>
                      setLoadRequest({ ...loadRequest, origin: e.target.value })
                    }
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    placeholder='e.g., Houston, TX'
                    onFocus={(e) => {
                      e.target.style.border =
                        '1px solid rgba(59, 130, 246, 0.6)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border =
                        '1px solid rgba(255, 255, 255, 0.3)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'white',
                      marginBottom: '8px',
                    }}
                  >
                    Destination
                  </label>
                  <input
                    type='text'
                    value={loadRequest.destination}
                    onChange={(e) =>
                      setLoadRequest({
                        ...loadRequest,
                        destination: e.target.value,
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    placeholder='e.g., Miami, FL'
                    onFocus={(e) => {
                      e.target.style.border =
                        '1px solid rgba(59, 130, 246, 0.6)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border =
                        '1px solid rgba(255, 255, 255, 0.3)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'white',
                      marginBottom: '8px',
                    }}
                  >
                    Quantity
                  </label>
                  <input
                    type='number'
                    value={loadRequest.quantity}
                    onChange={(e) =>
                      setLoadRequest({
                        ...loadRequest,
                        quantity: Number(e.target.value),
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.border =
                        '1px solid rgba(59, 130, 246, 0.6)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border =
                        '1px solid rgba(255, 255, 255, 0.3)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'white',
                      marginBottom: '8px',
                    }}
                  >
                    Unit of Measure
                  </label>
                  <select
                    value={loadRequest.unitOfMeasure}
                    onChange={(e) =>
                      setLoadRequest({
                        ...loadRequest,
                        unitOfMeasure: e.target.value as any,
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.border =
                        '1px solid rgba(59, 130, 246, 0.6)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border =
                        '1px solid rgba(255, 255, 255, 0.3)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    <option
                      value='lbs'
                      style={{ background: '#1f2937', color: 'white' }}
                    >
                      Pounds
                    </option>
                    <option
                      value='kg'
                      style={{ background: '#1f2937', color: 'white' }}
                    >
                      Kilograms
                    </option>
                    <option
                      value='gallons'
                      style={{ background: '#1f2937', color: 'white' }}
                    >
                      Gallons
                    </option>
                    <option
                      value='liters'
                      style={{ background: '#1f2937', color: 'white' }}
                    >
                      Liters
                    </option>
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'white',
                      marginBottom: '8px',
                    }}
                  >
                    Equipment Type
                  </label>
                  <select
                    value={loadRequest.equipmentType}
                    onChange={(e) =>
                      setLoadRequest({
                        ...loadRequest,
                        equipmentType: e.target.value as any,
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.border =
                        '1px solid rgba(59, 130, 246, 0.6)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border =
                        '1px solid rgba(255, 255, 255, 0.3)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    <option
                      value='dry-van'
                      style={{ background: '#1f2937', color: 'white' }}
                    >
                      Dry Van
                    </option>
                    <option
                      value='tank'
                      style={{ background: '#1f2937', color: 'white' }}
                    >
                      Tank Trailer
                    </option>
                    <option
                      value='flatbed'
                      style={{ background: '#1f2937', color: 'white' }}
                    >
                      Flatbed
                    </option>
                    <option
                      value='specialized'
                      style={{ background: '#1f2937', color: 'white' }}
                    >
                      Specialized Equipment
                    </option>
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'white',
                      marginBottom: '8px',
                    }}
                  >
                    Required Delivery
                  </label>
                  <input
                    type='date'
                    value={loadRequest.requiredDeliveryDate}
                    onChange={(e) =>
                      setLoadRequest({
                        ...loadRequest,
                        requiredDeliveryDate: e.target.value,
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.border =
                        '1px solid rgba(59, 130, 246, 0.6)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border =
                        '1px solid rgba(255, 255, 255, 0.3)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '2px solid rgba(249, 115, 22, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <h3
              style={{
                fontWeight: '600',
                color: 'white',
                fontSize: '18px',
                margin: 0,
              }}
            >
              Emergency Contact
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
              }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'white',
                    marginBottom: '8px',
                  }}
                >
                  Contact Name
                </label>
                <input
                  type='text'
                  value={loadRequest.emergencyContact.name}
                  onChange={(e) =>
                    setLoadRequest({
                      ...loadRequest,
                      emergencyContact: {
                        ...loadRequest.emergencyContact,
                        name: e.target.value,
                      },
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '1px solid rgba(59, 130, 246, 0.6)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border =
                      '1px solid rgba(255, 255, 255, 0.3)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'white',
                    marginBottom: '8px',
                  }}
                >
                  Phone Number
                </label>
                <input
                  type='tel'
                  value={loadRequest.emergencyContact.phone}
                  onChange={(e) =>
                    setLoadRequest({
                      ...loadRequest,
                      emergencyContact: {
                        ...loadRequest.emergencyContact,
                        phone: e.target.value,
                      },
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '1px solid rgba(59, 130, 246, 0.6)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border =
                      '1px solid rgba(255, 255, 255, 0.3)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'white',
                    marginBottom: '8px',
                  }}
                >
                  Company
                </label>
                <input
                  type='text'
                  value={loadRequest.emergencyContact.company}
                  onChange={(e) =>
                    setLoadRequest({
                      ...loadRequest,
                      emergencyContact: {
                        ...loadRequest.emergencyContact,
                        company: e.target.value,
                      },
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '1px solid rgba(59, 130, 246, 0.6)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border =
                      '1px solid rgba(255, 255, 255, 0.3)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={analyzeHazmatRoute}
              disabled={loading}
              style={{
                background: loading
                  ? 'rgba(239, 68, 68, 0.5)'
                  : 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                opacity: loading ? 0.5 : 1,
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 25px rgba(0, 0, 0, 0.2)';
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {loading ? 'Analyzing...' : 'Analyze Hazmat Route'}
            </button>
          </div>

          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                padding: '16px',
                color: '#fca5a5',
              }}
            >
              {error}
            </div>
          )}

          {analysis && (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
            >
              {/* Compliance Status */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '2px solid rgba(59, 130, 246, 0.6)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: getComplianceColor(analysis.complianceStatus),
                      marginBottom: '8px',
                    }}
                  >
                    {analysis.complianceStatus.replace('_', ' ').toUpperCase()}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.95)',
                    }}
                  >
                    Compliance Status
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '2px solid rgba(16, 185, 129, 0.6)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: '#10b981',
                      marginBottom: '8px',
                    }}
                  >
                    {analysis.recommendedRoute.totalDistance}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.95)',
                    }}
                  >
                    Total Miles
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(251, 146, 60, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '2px solid rgba(251, 146, 60, 0.6)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: '#f59e0b',
                      marginBottom: '8px',
                    }}
                  >
                    {analysis.recommendedRoute.totalTime.toFixed(1)}h
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.95)',
                    }}
                  >
                    Travel Time
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(139, 92, 246, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: '#8b5cf6',
                      marginBottom: '8px',
                    }}
                  >
                    ${analysis.estimatedCosts.totalAdditional}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.95)',
                    }}
                  >
                    Additional Costs
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '2px solid rgba(239, 68, 68, 0.6)',
                }}
              >
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '16px',
                  }}
                >
                  Risk Assessment
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '24px',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.95)',
                        marginBottom: '8px',
                      }}
                    >
                      Environmental
                    </div>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: getRiskColor(
                          analysis.riskAssessment.environmentalRisk
                        ),
                      }}
                    >
                      {analysis.riskAssessment.environmentalRisk.toUpperCase()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.95)',
                        marginBottom: '8px',
                      }}
                    >
                      Public Safety
                    </div>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: getRiskColor(
                          analysis.riskAssessment.publicSafetyRisk
                        ),
                      }}
                    >
                      {analysis.riskAssessment.publicSafetyRisk.toUpperCase()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.95)',
                        marginBottom: '8px',
                      }}
                    >
                      Transportation
                    </div>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: getRiskColor(
                          analysis.riskAssessment.transportationRisk
                        ),
                      }}
                    >
                      {analysis.riskAssessment.transportationRisk.toUpperCase()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.95)',
                        marginBottom: '8px',
                      }}
                    >
                      Overall Risk
                    </div>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: getRiskColor(
                          analysis.riskAssessment.overallRisk
                        ),
                      }}
                    >
                      {analysis.riskAssessment.overallRisk.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Required Documents */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '2px solid rgba(59, 130, 246, 0.6)',
                }}
              >
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '16px',
                  }}
                >
                  Required Documents
                </h3>
                <ul
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {analysis.requiredDocuments.map((doc, index) => (
                    <li
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.95)',
                      }}
                    >
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#ef4444',
                          flexShrink: 0,
                        }}
                       />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Driver Requirements */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '2px solid rgba(16, 185, 129, 0.6)',
                }}
              >
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '16px',
                  }}
                >
                  Driver Requirements
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: analysis.driverRequirements
                          .hazmatEndorsement
                          ? '#ef4444'
                          : '#6b7280',
                      }}
                     />
                    <span
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.95)',
                      }}
                    >
                      Hazmat Endorsement Required
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: analysis.driverRequirements
                          .medicalCertification
                          ? '#ef4444'
                          : '#6b7280',
                      }}
                     />
                    <span
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.95)',
                      }}
                    >
                      Medical Certification Required
                    </span>
                  </div>
                  {analysis.driverRequirements.specialTraining.length > 0 && (
                    <div>
                      <strong
                        style={{
                          fontSize: '14px',
                          color: 'white',
                        }}
                      >
                        Special Training Required:
                      </strong>
                      <ul
                        style={{
                          marginTop: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                        }}
                      >
                        {analysis.driverRequirements.specialTraining.map(
                          (training, index) => (
                            <li
                              key={index}
                              style={{
                                fontSize: '12px',
                                color: 'rgba(255, 255, 255, 0.95)',
                              }}
                            >
                              • {training}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Compliance Checklist */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '2px solid rgba(139, 92, 246, 0.6)',
                }}
              >
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '16px',
                  }}
                >
                  Compliance Checklist
                </h3>
                <ul
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {analysis.complianceChecklist.map((item, index) => (
                    <li
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.95)',
                      }}
                    >
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#3b82f6',
                          flexShrink: 0,
                        }}
                       />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* AI Analysis */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '2px solid rgba(20, 184, 166, 0.6)',
                }}
              >
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '16px',
                  }}
                >
                  AI Analysis
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.95)',
                    lineHeight: '1.6',
                    marginBottom: '12px',
                  }}
                >
                  {analysis.reasoning}
                </p>
                <div
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.85)',
                  }}
                >
                  Confidence: {analysis.confidence}%
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hazmat Classifications Tab */}
      {activeTab === 'classifications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {classifications.map((classification, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '2px solid rgba(249, 115, 22, 0.4)',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 25px rgba(0, 0, 0, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  style={{
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      fontWeight: 'bold',
                      color: 'white',
                      fontSize: '16px',
                      background: getHazmatClassColor(classification.class),
                    }}
                  >
                    {classification.class}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontWeight: '600',
                        color: 'white',
                        fontSize: '18px',
                        margin: '0 0 4px 0',
                      }}
                    >
                      Class {classification.class}
                    </h3>
                    <p
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.95)',
                        margin: 0,
                      }}
                    >
                      {classification.description}
                    </p>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <h4
                    style={{
                      marginBottom: '8px',
                      fontWeight: '500',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  >
                    Examples:
                  </h4>
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.95)',
                    }}
                  >
                    {classification.examples.join(', ')}
                  </p>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <h4
                    style={{
                      marginBottom: '8px',
                      fontWeight: '500',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  >
                    Special Requirements:
                  </h4>
                  <ul
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    {classification.specialRequirements.map((req, reqIndex) => (
                      <li
                        key={reqIndex}
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.95)',
                        }}
                      >
                        • {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span
                    style={{
                      borderRadius: '20px',
                      padding: '4px 12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: classification.packingGroupRequired
                        ? 'rgba(239, 68, 68, 0.2)'
                        : 'rgba(107, 114, 128, 0.2)',
                      color: classification.packingGroupRequired
                        ? '#fca5a5'
                        : 'rgba(255, 255, 255, 0.8)',
                      border: `1px solid ${
                        classification.packingGroupRequired
                          ? 'rgba(239, 68, 68, 0.3)'
                          : 'rgba(107, 114, 128, 0.3)'
                      }`,
                    }}
                  >
                    {classification.packingGroupRequired
                      ? 'Packing Group Required'
                      : 'No Packing Group'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regulations Tab */}
      {activeTab === 'regulations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={loadRegulations}
              disabled={loading}
              style={{
                background: loading
                  ? 'rgba(59, 130, 246, 0.5)'
                  : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                opacity: loading ? 0.5 : 1,
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 25px rgba(0, 0, 0, 0.2)';
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {loading ? 'Loading...' : 'Load Regulations'}
            </button>
          </div>

          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                padding: '16px',
                color: '#fca5a5',
              }}
            >
              {error}
            </div>
          )}

          {regulations.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}
            >
              {regulations.map((regulation, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '2px solid rgba(249, 115, 22, 0.4)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 25px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          marginBottom: '4px',
                          fontWeight: '600',
                          color: 'white',
                          fontSize: '18px',
                        }}
                      >
                        {regulation.authority}
                      </h3>
                      <p
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.95)',
                          margin: 0,
                        }}
                      >
                        {regulation.jurisdiction} - {regulation.regulationType}
                      </p>
                    </div>
                    <div
                      style={{
                        borderRadius: '20px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: regulation.isRequired
                          ? 'rgba(239, 68, 68, 0.2)'
                          : 'rgba(107, 114, 128, 0.2)',
                        color: regulation.isRequired
                          ? '#fca5a5'
                          : 'rgba(255, 255, 255, 0.8)',
                        border: `1px solid ${
                          regulation.isRequired
                            ? 'rgba(239, 68, 68, 0.3)'
                            : 'rgba(107, 114, 128, 0.3)'
                        }`,
                      }}
                    >
                      {regulation.isRequired ? 'Required' : 'Optional'}
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <p
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.95)',
                        lineHeight: '1.6',
                      }}
                    >
                      {regulation.requirement}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <strong
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        Reference:
                      </strong>
                      <p
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.95)',
                          margin: '4px 0 0 0',
                        }}
                      >
                        {regulation.referenceCode}
                      </p>
                    </div>
                    <div>
                      <strong
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        Penalty:
                      </strong>
                      <p
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.95)',
                          margin: '4px 0 0 0',
                        }}
                      >
                        {regulation.penalty}
                      </p>
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
