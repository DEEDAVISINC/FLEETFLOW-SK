'use client';

import { useState } from 'react';
import { useFeatureFlag } from '../config/feature-flags';

interface OversizedLoadRequest {
  loadId: string;
  origin: string;
  destination: string;
  equipmentType:
    | 'flatbed'
    | 'step-deck'
    | 'low-boy'
    | 'removable-gooseneck'
    | 'multi-axle';
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
  cargoType: string;
  isIndivisible: boolean;
  requiredDeliveryDate: string;
  specialRequirements: string[];
  customerTier: 'standard' | 'premium' | 'enterprise';
}

interface PermitRequirement {
  state: string;
  permitType: string;
  isRequired: boolean;
  cost: number;
  processingTime: number;
  validityPeriod: number;
  restrictions: string[];
  contactInfo: {
    agency: string;
    phone: string;
    website: string;
  };
}

interface RouteSegment {
  segmentId: string;
  fromState: string;
  toState: string;
  distance: number;
  estimatedTime: number;
  restrictions: {
    heightLimit: number;
    widthLimit: number;
    weightLimit: number;
    timeRestrictions: string[];
    bridgeRestrictions: string[];
  };
  permitRequired: boolean;
  alternativeRoutes: number;
}

interface PermitRouteAnalysis {
  result: OversizedLoadRequest;
  confidence: number;
  reasoning: string;
  recommendations: string[];
  riskFactors: string[];
  recommendedRoute: {
    totalDistance: number;
    totalTime: number;
    routeSegments: RouteSegment[];
    waypoints: string[];
  };
  permitRequirements: PermitRequirement[];
  totalPermitCost: number;
  totalProcessingTime: number;
  routeComplexity: 'simple' | 'moderate' | 'complex' | 'extreme';
  riskAssessment: {
    routeRisk: 'low' | 'medium' | 'high';
    permitRisk: 'low' | 'medium' | 'high';
    timelineRisk: 'low' | 'medium' | 'high';
    overallRisk: 'low' | 'medium' | 'high';
  };
  alternativeRoutes: {
    routeId: string;
    description: string;
    distance: number;
    permitCost: number;
    timeAdvantage: number;
    riskLevel: 'low' | 'medium' | 'high';
  }[];
  complianceChecklist: string[];
  estimatedCosts: {
    permits: number;
    pilotCars: number;
    specialHandling: number;
    totalAdditional: number;
  };
}

interface StateRegulations {
  state: string;
  maxDimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
  permitThresholds: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
  specialRestrictions: string[];
  processingTimes: {
    standard: number;
    expedited: number;
  };
  costs: {
    singleTrip: number;
    annual: number;
    expeditedFee: number;
  };
}

export default function PermitRoutePlanningWidget() {
  const isEnabled = useFeatureFlag('PERMIT_ROUTE_PLANNING');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<PermitRouteAnalysis | null>(null);
  const [regulations, setRegulations] = useState<StateRegulations[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'planner' | 'regulations' | 'compliance'
  >('planner');

  // Form state
  const [loadRequest, setLoadRequest] = useState<OversizedLoadRequest>({
    loadId: '',
    origin: '',
    destination: '',
    equipmentType: 'flatbed',
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
      weight: 0,
    },
    cargoType: '',
    isIndivisible: false,
    requiredDeliveryDate: '',
    specialRequirements: [],
    customerTier: 'standard',
  });

  // Permit ordering state
  const [ordering, setOrdering] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const analysisResult = analysis;

  const planRoute = async () => {
    if (
      !loadRequest.loadId ||
      !loadRequest.origin ||
      !loadRequest.destination ||
      loadRequest.dimensions.length === 0 ||
      loadRequest.dimensions.width === 0 ||
      loadRequest.dimensions.height === 0 ||
      loadRequest.dimensions.weight === 0
    ) {
      setError(
        'Please fill in all required fields (Load ID, Origin, Destination, and all Dimensions)'
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analytics/permit-routing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'plan-route',
          loadRequest,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAnalysis(data.data);
        setActiveTab('planner');
      } else {
        setError(data.error || 'Route planning failed');
      }
    } catch (error) {
      setError('Failed to plan permit route');
      console.error('Error planning route:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStateRegulations = async () => {
    if (!loadRequest.origin || !loadRequest.destination) {
      setError('Please specify origin and destination to load regulations');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Extract state codes from origin/destination (simplified)
      const states = [
        loadRequest.origin.slice(-2),
        loadRequest.destination.slice(-2),
      ].join(',');

      const response = await fetch(
        `/api/analytics/permit-routing?action=regulations&states=${states}`
      );
      const data = await response.json();

      if (data.success) {
        setRegulations(data.data);
        setActiveTab('regulations');
      } else {
        setError(data.error || 'Failed to load regulations');
      }
    } catch (error) {
      setError('Failed to load state regulations');
      console.error('Error loading regulations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple':
        return '#10b981';
      case 'moderate':
        return '#f59e0b';
      case 'complex':
        return '#ef4444';
      case 'extreme':
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

  const getEquipmentIcon = (equipmentType: string) => {
    switch (equipmentType) {
      case 'flatbed':
        return '🚛';
      case 'step-deck':
        return '🚚';
      case 'low-boy':
        return '🚜';
      case 'removable-gooseneck':
        return '🚛';
      case 'multi-axle':
        return '🚛';
      default:
        return '🚛';
    }
  };

  // Permit ordering handlers
  const handleOrderPermit = async (
    state: string,
    permitType: 'oversize' | 'overweight' | 'both'
  ) => {
    if (!analysisResult) return;

    setOrdering(true);
    setOrderStatus(null);

    try {
      // Create permit order
      const response = await fetch('/api/permits/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_order',
          loadId: loadRequest.loadId,
          tenantId: 'tenant-demo-123', // In production, get from auth context
          state,
          permitType,
          loadDetails: {
            dimensions: loadRequest.dimensions,
            route: {
              origin: loadRequest.origin,
              destination: loadRequest.destination,
              waypoints: [],
            },
            equipmentType: loadRequest.equipmentType,
            cargoType: loadRequest.cargoType,
          },
          notifications: {
            email: ['permits@fleetflow.com'],
            phone: ['+1-555-PERMITS'],
          },
        }),
      });

      const createResult = await response.json();

      if (!createResult.success) {
        throw new Error(createResult.error);
      }

      // Submit the order with payment
      const submitResponse = await fetch('/api/permits/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'submit_order',
          orderId: createResult.data.id,
          paymentMethod: 'card',
        }),
      });

      const submitResult = await submitResponse.json();

      if (submitResult.success) {
        setOrderStatus(
          `✅ Permit order submitted successfully for ${state}! ${submitResult.message}`
        );
      } else {
        throw new Error(submitResult.message);
      }
    } catch (error: any) {
      console.error('Permit ordering error:', error);
      setOrderStatus(`❌ Failed to order ${state} permit: ${error.message}`);
    } finally {
      setOrdering(false);
    }
  };

  const handleOrderAllPermits = async () => {
    if (!analysisResult) return;

    setOrdering(true);
    setOrderStatus(null);

    try {
      const orderPromises = analysisResult.permitRequirements.map(
        async (permit) => {
          try {
            // Create permit order
            const response = await fetch('/api/permits/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                action: 'create_order',
                loadId: loadRequest.loadId,
                tenantId: 'tenant-demo-123', // In production, get from auth context
                state: permit.state,
                permitType: permit.permitType,
                loadDetails: {
                  dimensions: loadRequest.dimensions,
                  route: {
                    origin: loadRequest.origin,
                    destination: loadRequest.destination,
                    waypoints: [],
                  },
                  equipmentType: loadRequest.equipmentType,
                  cargoType: loadRequest.cargoType,
                },
                notifications: {
                  email: ['permits@fleetflow.com'],
                  phone: ['+1-555-PERMITS'],
                },
              }),
            });

            const createResult = await response.json();

            if (!createResult.success) {
              throw new Error(createResult.error);
            }

            // Submit the order with payment
            const submitResponse = await fetch('/api/permits/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                action: 'submit_order',
                orderId: createResult.data.id,
                paymentMethod: 'card',
              }),
            });

            const submitResult = await submitResponse.json();

            if (!submitResult.success) {
              throw new Error(submitResult.message);
            }

            return {
              state: permit.state,
              success: true,
              message: submitResult.message,
            };
          } catch (error: any) {
            return {
              state: permit.state,
              success: false,
              message: error.message,
            };
          }
        }
      );

      const results = await Promise.all(orderPromises);
      const successful = results.filter((r) => r.success);
      const failed = results.filter((r) => !r.success);

      if (failed.length === 0) {
        setOrderStatus(
          `🎉 All ${successful.length} permits ordered successfully! Total cost: $${analysisResult.totalPermitCost}`
        );
      } else if (successful.length > 0) {
        setOrderStatus(
          `⚠️ ${successful.length} permits ordered successfully, ${failed.length} failed. Check individual permit status for details.`
        );
      } else {
        setOrderStatus(
          `❌ All permit orders failed. Please try again or contact support.`
        );
      }
    } catch (error: any) {
      console.error('Bulk permit ordering error:', error);
      setOrderStatus(`❌ Failed to order permits: ${error.message}`);
    } finally {
      setOrdering(false);
    }
  };

  if (!isEnabled) {
    return (
      <div
        style={{
          background: 'rgba(59, 130, 246, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
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
            <span style={{ fontSize: '24px' }}>🗺️</span>
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
              Permit Route Planning
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.95)',
                margin: 0,
              }}
            >
              Enable ENABLE_PERMIT_ROUTE_PLANNING=true to access oversized load
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
        border: '1px solid rgba(255, 255, 255, 0.2)',
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
            <span style={{ fontSize: '32px' }}>🗺️</span>
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
              Permit Route Planning
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.95)',
                margin: 0,
              }}
            >
              Oversized load routing with permit requirements
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
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          gap: '8px',
        }}
      >
        {[
          { id: 'planner', label: 'Route Planner', icon: '📋' },
          { id: 'regulations', label: 'State Regulations', icon: '📋' },
          { id: 'compliance', label: 'Compliance Check', icon: '✅' },
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
              color: activeTab === tab.id ? '#3b82f6' : 'white',
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

      {/* Route Planner Tab */}
      {activeTab === 'planner' && (
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
                border: '1px solid rgba(255, 255, 255, 0.2)',
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
                      setLoadRequest({
                        ...loadRequest,
                        loadId: e.target.value,
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
                    placeholder='e.g., OSL-001'
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
                      value='flatbed'
                      style={{ background: '#1f2937', color: 'white' }}
                    >
                      Flatbed
                    </option>
                    <option
                      value='step-deck'
                      style={{ background: '#1f2937', color: 'white' }}
                    >
                      Step Deck
                    </option>
                    <option
                      value='low-boy'
                      style={{ background: '#1f2937', color: 'white' }}
                    >
                      Low Boy
                    </option>
                    <option
                      value='removable-gooseneck'
                      style={{ background: '#1f2937', color: 'white' }}
                    >
                      Removable Gooseneck
                    </option>
                    <option
                      value='multi-axle'
                      style={{ background: '#1f2937', color: 'white' }}
                    >
                      Multi-Axle
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
                    Origin
                  </label>
                  <input
                    type='text'
                    value={loadRequest.origin}
                    onChange={(e) =>
                      setLoadRequest({
                        ...loadRequest,
                        origin: e.target.value,
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
                    placeholder='e.g., Atlanta, GA'
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
                    Cargo Type
                  </label>
                  <input
                    type='text'
                    value={loadRequest.cargoType}
                    onChange={(e) =>
                      setLoadRequest({
                        ...loadRequest,
                        cargoType: e.target.value,
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
                    placeholder='e.g., Construction Equipment'
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
                    Customer Tier
                  </label>
                  <select
                    value={loadRequest.customerTier}
                    onChange={(e) =>
                      setLoadRequest({
                        ...loadRequest,
                        customerTier: e.target.value as any,
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
                      value='standard'
                      style={{ background: '#1f2937', color: 'white' }}
                    >
                      Standard
                    </option>
                    <option
                      value='premium'
                      style={{ background: '#1f2937', color: 'white' }}
                    >
                      Premium
                    </option>
                    <option
                      value='enterprise'
                      style={{ background: '#1f2937', color: 'white' }}
                    >
                      Enterprise
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Dimensions */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
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
                Load Dimensions & Requirements
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
                    Length (ft)
                  </label>
                  <input
                    type='number'
                    value={loadRequest.dimensions.length}
                    onChange={(e) =>
                      setLoadRequest({
                        ...loadRequest,
                        dimensions: {
                          ...loadRequest.dimensions,
                          length: Number(e.target.value),
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
                    Width (ft)
                  </label>
                  <input
                    type='number'
                    step='0.1'
                    value={loadRequest.dimensions.width}
                    onChange={(e) =>
                      setLoadRequest({
                        ...loadRequest,
                        dimensions: {
                          ...loadRequest.dimensions,
                          width: Number(e.target.value),
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
                    Height (ft)
                  </label>
                  <input
                    type='number'
                    step='0.1'
                    value={loadRequest.dimensions.height}
                    onChange={(e) =>
                      setLoadRequest({
                        ...loadRequest,
                        dimensions: {
                          ...loadRequest.dimensions,
                          height: Number(e.target.value),
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
                    Weight (lbs)
                  </label>
                  <input
                    type='number'
                    value={loadRequest.dimensions.weight}
                    onChange={(e) =>
                      setLoadRequest({
                        ...loadRequest,
                        dimensions: {
                          ...loadRequest.dimensions,
                          weight: Number(e.target.value),
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
                    Required Delivery Date
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
                <div
                  style={{
                    gridColumn: 'span 2',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <label style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type='checkbox'
                      checked={loadRequest.isIndivisible}
                      onChange={(e) =>
                        setLoadRequest({
                          ...loadRequest,
                          isIndivisible: e.target.checked,
                        })
                      }
                      style={{
                        marginRight: '12px',
                        width: '16px',
                        height: '16px',
                        accentColor: '#3b82f6',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '14px',
                        color: 'white',
                        fontWeight: '500',
                      }}
                    >
                      Indivisible Load
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={planRoute}
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
              {loading ? 'Planning Route...' : 'Plan Permit Route'}
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
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '32px',
              }}
            >
              {/* Route Overview */}
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
                    border: '1px solid rgba(59, 130, 246, 0.3)',
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
                      color: '#3b82f6',
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
                    background: 'rgba(16, 185, 129, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
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
                      color: '#3b82f6',
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
                    background: 'rgba(251, 146, 60, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(251, 146, 60, 0.3)',
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
                      color: '#3b82f6',
                      marginBottom: '8px',
                    }}
                  >
                    ${analysis.totalPermitCost}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.95)',
                    }}
                  >
                    Permit Costs
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
                      color: getComplexityColor(analysis.routeComplexity),
                      marginBottom: '8px',
                    }}
                  >
                    {analysis.routeComplexity.toUpperCase()}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.95)',
                    }}
                  >
                    Complexity
                  </div>
                </div>
              </div>

              {/* Route Segments */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
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
                  Route Segments
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {analysis.recommendedRoute.routeSegments.map(
                    (segment, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '16px',
                          background: 'rgba(255, 255, 255, 0.08)',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background =
                            'rgba(255, 255, 255, 0.12)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background =
                            'rgba(255, 255, 255, 0.08)';
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                          }}
                        >
                          <div style={{ fontSize: '24px' }}>
                            {getEquipmentIcon(analysis.result.equipmentType)}
                          </div>
                          <div>
                            <div
                              style={{
                                fontWeight: '500',
                                color: 'white',
                                fontSize: '16px',
                              }}
                            >
                              {segment.fromState} → {segment.toState}
                            </div>
                            <div
                              style={{
                                fontSize: '14px',
                                color: 'rgba(255, 255, 255, 0.95)',
                              }}
                            >
                              {segment.distance} miles • {segment.estimatedTime}
                              h
                            </div>
                          </div>
                        </div>
                        <div>
                          {segment.permitRequired ? (
                            <div
                              style={{
                                background: 'rgba(239, 68, 68, 0.2)',
                                color: '#fca5a5',
                                padding: '6px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '600',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                              }}
                            >
                              Permit Required
                            </div>
                          ) : (
                            <div
                              style={{
                                background: 'rgba(59, 130, 246, 0.2)',
                                color: '#93c5fd',
                                padding: '6px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '600',
                                border: '1px solid rgba(59, 130, 246, 0.3)',
                              }}
                            >
                              No Permit
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Permit Requirements */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
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
                  Permit Requirements
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {analysis.permitRequirements.map((permit, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.12)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.08)';
                      }}
                    >
                      <div
                        style={{
                          marginBottom: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div
                          style={{
                            fontWeight: '500',
                            color: 'white',
                            fontSize: '16px',
                          }}
                        >
                          {permit.permitType}
                        </div>
                        <div
                          style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: '#3b82f6',
                          }}
                        >
                          ${permit.cost}
                        </div>
                      </div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gap: '16px',
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.95)',
                        }}
                      >
                        <div>
                          <strong style={{ color: 'white' }}>State:</strong>{' '}
                          {permit.state}
                        </div>
                        <div>
                          <strong style={{ color: 'white' }}>
                            Processing:
                          </strong>{' '}
                          {permit.processingTime}h
                        </div>
                        <div>
                          <strong style={{ color: 'white' }}>Validity:</strong>{' '}
                          {permit.validityPeriod} days
                        </div>
                        <div>
                          <strong style={{ color: 'white' }}>Agency:</strong>{' '}
                          {permit.contactInfo.agency}
                        </div>
                      </div>
                      <div style={{ marginTop: '12px' }}>
                        <strong
                          style={{
                            fontSize: '14px',
                            color: 'white',
                          }}
                        >
                          Restrictions:
                        </strong>
                        <ul
                          style={{
                            marginTop: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                          }}
                        >
                          {permit.restrictions.map((restriction, rIndex) => (
                            <li
                              key={rIndex}
                              style={{
                                fontSize: '12px',
                                color: 'rgba(255, 255, 255, 0.95)',
                              }}
                            >
                              • {restriction}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Assessment */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
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
                      Route Risk
                    </div>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: getRiskColor(analysis.riskAssessment.routeRisk),
                      }}
                    >
                      {analysis.riskAssessment.routeRisk.toUpperCase()}
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
                      Permit Risk
                    </div>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: getRiskColor(analysis.riskAssessment.permitRisk),
                      }}
                    >
                      {analysis.riskAssessment.permitRisk.toUpperCase()}
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
                      Timeline Risk
                    </div>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: getRiskColor(
                          analysis.riskAssessment.timelineRisk
                        ),
                      }}
                    >
                      {analysis.riskAssessment.timelineRisk.toUpperCase()}
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

              {/* Estimated Costs */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
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
                  Estimated Costs
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '24px',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: '#3b82f6',
                        marginBottom: '8px',
                      }}
                    >
                      ${analysis.estimatedCosts.permits}
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.95)',
                      }}
                    >
                      Permits
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: '#3b82f6',
                        marginBottom: '8px',
                      }}
                    >
                      ${analysis.estimatedCosts.pilotCars}
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.95)',
                      }}
                    >
                      Pilot Cars
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: '#3b82f6',
                        marginBottom: '8px',
                      }}
                    >
                      ${analysis.estimatedCosts.specialHandling}
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.95)',
                      }}
                    >
                      Special Handling
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: '#3b82f6',
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
                      Total Additional
                    </div>
                  </div>
                </div>
              </div>

              {/* Compliance Checklist */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
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
                  border: '1px solid rgba(255, 255, 255, 0.2)',
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

      {/* State Regulations Tab */}
      {activeTab === 'regulations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              key='compliance-regulations-red-button-force'
              onClick={loadStateRegulations}
              disabled={loading}
              style={
                {
                  background: '#dc2626',
                  backgroundImage:
                    'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: '2px solid #dc2626',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  opacity: loading ? 0.5 : 1,
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
                  outline: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                } as React.CSSProperties
              }
              onMouseOver={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.background = '#ef4444';
                  e.currentTarget.style.backgroundImage =
                    'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 25px rgba(220, 38, 38, 0.5)';
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = '#dc2626';
                  e.currentTarget.style.backgroundImage =
                    'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 12px rgba(220, 38, 38, 0.4)';
                }
              }}
            >
              {loading ? 'Loading...' : 'Load State Regulations'}
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
              {regulations.map((reg, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
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
                  <h3
                    style={{
                      marginBottom: '16px',
                      fontSize: '20px',
                      fontWeight: '600',
                      color: 'white',
                    }}
                  >
                    {reg.state} Regulations
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '32px',
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          marginBottom: '12px',
                          fontWeight: '500',
                          color: 'white',
                          fontSize: '16px',
                        }}
                      >
                        Maximum Dimensions
                      </h4>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.95)',
                        }}
                      >
                        <div>Length: {reg.maxDimensions.length} ft</div>
                        <div>Width: {reg.maxDimensions.width} ft</div>
                        <div>Height: {reg.maxDimensions.height} ft</div>
                        <div>
                          Weight: {reg.maxDimensions.weight.toLocaleString()}{' '}
                          lbs
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4
                        style={{
                          marginBottom: '12px',
                          fontWeight: '500',
                          color: 'white',
                          fontSize: '16px',
                        }}
                      >
                        Permit Costs
                      </h4>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.95)',
                        }}
                      >
                        <div>Single Trip: ${reg.costs.singleTrip}</div>
                        <div>Annual: ${reg.costs.annual}</div>
                        <div>Expedited Fee: ${reg.costs.expeditedFee}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: '20px' }}>
                    <h4
                      style={{
                        marginBottom: '12px',
                        fontWeight: '500',
                        color: 'white',
                        fontSize: '16px',
                      }}
                    >
                      Special Restrictions
                    </h4>
                    <ul
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                      }}
                    >
                      {reg.specialRestrictions.map((restriction, rIndex) => (
                        <li
                          key={rIndex}
                          style={{
                            fontSize: '14px',
                            color: 'rgba(255, 255, 255, 0.95)',
                          }}
                        >
                          • {restriction}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Compliance Check Tab */}
      {activeTab === 'compliance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div
            style={{
              background: 'rgba(59, 130, 246, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
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
                <span style={{ fontSize: '24px' }}>✅</span>
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
                  Compliance Validation
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.95)',
                    margin: 0,
                  }}
                >
                  Plan a route first to see detailed compliance analysis
                </p>
              </div>
            </div>
          </div>

          {analysis && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <h3
                  style={{
                    marginBottom: '16px',
                    fontWeight: '600',
                    color: 'white',
                    fontSize: '18px',
                  }}
                >
                  Load Compliance Summary
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '24px',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        color: '#3b82f6',
                        marginBottom: '8px',
                      }}
                    >
                      {analysis.permitRequirements.length}
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.95)',
                      }}
                    >
                      Permits Required
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        color: '#3b82f6',
                        marginBottom: '8px',
                      }}
                    >
                      {analysis.totalProcessingTime}h
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.95)',
                      }}
                    >
                      Max Processing
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        color: getRiskColor(
                          analysis.riskAssessment.overallRisk
                        ),
                        marginBottom: '8px',
                      }}
                    >
                      {analysis.riskAssessment.overallRisk.toUpperCase()}
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.95)',
                      }}
                    >
                      Overall Risk
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <h3
                  style={{
                    marginBottom: '16px',
                    fontWeight: '600',
                    color: 'white',
                    fontSize: '18px',
                  }}
                >
                  Recommendations
                </h3>
                <ul
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {analysis.recommendations.map((rec, index) => (
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
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* PERMIT ORDERING SECTION */}
          {analysisResult && (
            <div
              style={{
                marginTop: '32px',
                background: 'rgba(34, 197, 94, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                boxShadow: '0 8px 32px rgba(34, 197, 94, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    padding: '12px',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    borderRadius: '12px',
                    color: 'white',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>🎫</span>
                </div>
                <div>
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: '600',
                      margin: 0,
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    Live Permit Ordering
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                      margin: 0,
                    }}
                  >
                    Order permits directly from state DOT systems
                  </p>
                </div>
              </div>

              {/* PERMIT REQUIREMENTS SUMMARY */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '20px',
                }}
              >
                <h4
                  style={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    margin: '0 0 12px 0',
                  }}
                >
                  Required Permits Summary
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {analysisResult.permitRequirements.map((permit, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        padding: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        minWidth: '200px',
                      }}
                    >
                      <div
                        style={{
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '14px',
                          marginBottom: '4px',
                        }}
                      >
                        {permit.state} - {permit.permitType.toUpperCase()}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.85)',
                          fontSize: '12px',
                          marginBottom: '8px',
                        }}
                      >
                        Processing: {permit.processingTime}h | Valid:{' '}
                        {permit.validityPeriod} days
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span
                          style={{
                            color: '#3b82f6',
                            fontWeight: '700',
                            fontSize: '16px',
                          }}
                        >
                          ${permit.cost}
                        </span>
                        <button
                          onClick={() =>
                            handleOrderPermit(
                              permit.state,
                              permit.permitType as any
                            )
                          }
                          style={{
                            background:
                              'linear-gradient(135deg, #10b981, #059669)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow =
                              '0 4px 12px rgba(16, 185, 129, 0.4)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          Order Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TOTAL COST AND ORDER ALL BUTTON */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                      marginBottom: '4px',
                    }}
                  >
                    Total Permit Cost
                  </div>
                  <div
                    style={{
                      color: '#3b82f6',
                      fontSize: '24px',
                      fontWeight: '700',
                    }}
                  >
                    ${analysisResult.totalPermitCost}
                  </div>
                </div>
                <button
                  onClick={handleOrderAllPermits}
                  disabled={ordering}
                  style={{
                    background: ordering
                      ? 'rgba(16, 185, 129, 0.5)'
                      : 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 32px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: ordering ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    opacity: ordering ? 0.7 : 1,
                  }}
                  onMouseOver={(e) => {
                    if (!ordering) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 25px rgba(16, 185, 129, 0.4)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!ordering) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  {ordering ? 'Processing...' : '🛒 Order All Permits'}
                </button>
              </div>

              {/* ORDER STATUS */}
              {orderStatus && (
                <div
                  style={{
                    marginTop: '20px',
                    background: orderStatus.includes('success')
                      ? 'rgba(34, 197, 94, 0.15)'
                      : 'rgba(239, 68, 68, 0.15)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: `1px solid ${
                      orderStatus.includes('success')
                        ? 'rgba(34, 197, 94, 0.3)'
                        : 'rgba(239, 68, 68, 0.3)'
                    }`,
                  }}
                >
                  <div
                    style={{
                      color: orderStatus.includes('success')
                        ? '#10b981'
                        : '#ef4444',
                      fontWeight: '600',
                      fontSize: '14px',
                      marginBottom: '4px',
                    }}
                  >
                    {orderStatus.includes('success')
                      ? '✅ Success'
                      : '❌ Error'}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '14px',
                    }}
                  >
                    {orderStatus}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
