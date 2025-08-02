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

  if (!isEnabled) {
    return (
      <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
        <div className='flex items-center gap-3'>
          <div className='text-2xl'>🗺️</div>
          <div>
            <h3 className='font-semibold text-yellow-800'>
              Permit Route Planning
            </h3>
            <p className='text-sm text-yellow-700'>
              Enable ENABLE_PERMIT_ROUTE_PLANNING=true to access oversized load
              routing features
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='rounded-lg bg-white p-6 shadow-lg'>
      <div className='mb-6 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='text-3xl'>🗺️</div>
          <div>
            <h2 className='text-xl font-bold text-gray-900'>
              Permit Route Planning
            </h2>
            <p className='text-sm text-gray-600'>
              Oversized load routing with permit requirements
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className='mb-6 flex space-x-1 rounded-lg bg-gray-100 p-1'>
        <button
          onClick={() => setActiveTab('planner')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'planner'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Route Planner
        </button>
        <button
          onClick={() => setActiveTab('regulations')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'regulations'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          State Regulations
        </button>
        <button
          onClick={() => setActiveTab('compliance')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'compliance'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Compliance Check
        </button>
      </div>

      {/* Route Planner Tab */}
      {activeTab === 'planner' && (
        <div className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {/* Load Information */}
            <div className='space-y-4'>
              <h3 className='font-semibold text-gray-900'>Load Information</h3>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Load ID
                  </label>
                  <input
                    type='text'
                    value={loadRequest.loadId}
                    onChange={(e) =>
                      setLoadRequest({ ...loadRequest, loadId: e.target.value })
                    }
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                    placeholder='e.g., OSL-001'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
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
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                  >
                    <option value='flatbed'>Flatbed</option>
                    <option value='step-deck'>Step Deck</option>
                    <option value='low-boy'>Low Boy</option>
                    <option value='removable-gooseneck'>
                      Removable Gooseneck
                    </option>
                    <option value='multi-axle'>Multi-Axle</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Origin
                  </label>
                  <input
                    type='text'
                    value={loadRequest.origin}
                    onChange={(e) =>
                      setLoadRequest({ ...loadRequest, origin: e.target.value })
                    }
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                    placeholder='e.g., Atlanta, GA'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
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
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                    placeholder='e.g., Miami, FL'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
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
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                    placeholder='e.g., Construction Equipment'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
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
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                  >
                    <option value='standard'>Standard</option>
                    <option value='premium'>Premium</option>
                    <option value='enterprise'>Enterprise</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Dimensions */}
            <div className='space-y-4'>
              <h3 className='font-semibold text-gray-900'>
                Load Dimensions & Requirements
              </h3>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
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
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
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
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
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
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
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
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                  />
                </div>
                <div className='col-span-2'>
                  <label className='block text-sm font-medium text-gray-700'>
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
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                  />
                </div>
                <div className='col-span-2 flex items-center'>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={loadRequest.isIndivisible}
                      onChange={(e) =>
                        setLoadRequest({
                          ...loadRequest,
                          isIndivisible: e.target.checked,
                        })
                      }
                      className='mr-2'
                    />
                    <span className='text-sm text-gray-700'>
                      Indivisible Load
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className='flex gap-4'>
            <button
              onClick={planRoute}
              disabled={loading}
              className='rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50'
            >
              {loading ? 'Planning Route...' : 'Plan Permit Route'}
            </button>
          </div>

          {error && (
            <div className='rounded-lg bg-red-50 p-4 text-red-600'>{error}</div>
          )}

          {analysis && (
            <div className='space-y-6'>
              {/* Route Overview */}
              <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                <div className='rounded-lg bg-blue-50 p-4'>
                  <div className='text-2xl font-bold text-blue-600'>
                    {analysis.recommendedRoute.totalDistance}
                  </div>
                  <div className='text-sm text-blue-600'>Total Miles</div>
                </div>
                <div className='rounded-lg bg-green-50 p-4'>
                  <div className='text-2xl font-bold text-green-600'>
                    {analysis.recommendedRoute.totalTime.toFixed(1)}h
                  </div>
                  <div className='text-sm text-green-600'>Travel Time</div>
                </div>
                <div className='rounded-lg bg-orange-50 p-4'>
                  <div className='text-2xl font-bold text-orange-600'>
                    ${analysis.totalPermitCost}
                  </div>
                  <div className='text-sm text-orange-600'>Permit Costs</div>
                </div>
                <div className='rounded-lg bg-purple-50 p-4'>
                  <div
                    className='text-2xl font-bold'
                    style={{
                      color: getComplexityColor(analysis.routeComplexity),
                    }}
                  >
                    {analysis.routeComplexity.toUpperCase()}
                  </div>
                  <div className='text-sm text-purple-600'>Complexity</div>
                </div>
              </div>

              {/* Route Segments */}
              <div className='rounded-lg border border-gray-200 p-4'>
                <h3 className='mb-3 font-semibold text-gray-900'>
                  Route Segments
                </h3>
                <div className='space-y-3'>
                  {analysis.recommendedRoute.routeSegments.map(
                    (segment, index) => (
                      <div
                        key={index}
                        className='flex items-center justify-between rounded-lg bg-gray-50 p-3'
                      >
                        <div className='flex items-center gap-3'>
                          <div className='text-xl'>
                            {getEquipmentIcon(analysis.result.equipmentType)}
                          </div>
                          <div>
                            <div className='font-medium'>
                              {segment.fromState} → {segment.toState}
                            </div>
                            <div className='text-sm text-gray-600'>
                              {segment.distance} miles • {segment.estimatedTime}
                              h
                            </div>
                          </div>
                        </div>
                        <div className='text-right'>
                          {segment.permitRequired ? (
                            <div className='rounded-full bg-red-100 px-2 py-1 text-xs text-red-600'>
                              Permit Required
                            </div>
                          ) : (
                            <div className='rounded-full bg-green-100 px-2 py-1 text-xs text-green-600'>
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
              <div className='rounded-lg border border-gray-200 p-4'>
                <h3 className='mb-3 font-semibold text-gray-900'>
                  Permit Requirements
                </h3>
                <div className='space-y-3'>
                  {analysis.permitRequirements.map((permit, index) => (
                    <div
                      key={index}
                      className='rounded-lg border border-gray-100 p-3'
                    >
                      <div className='mb-2 flex items-center justify-between'>
                        <div className='font-medium'>{permit.permitType}</div>
                        <div className='text-lg font-bold text-green-600'>
                          ${permit.cost}
                        </div>
                      </div>
                      <div className='grid grid-cols-2 gap-4 text-sm text-gray-600'>
                        <div>
                          <strong>State:</strong> {permit.state}
                        </div>
                        <div>
                          <strong>Processing:</strong> {permit.processingTime}h
                        </div>
                        <div>
                          <strong>Validity:</strong> {permit.validityPeriod}{' '}
                          days
                        </div>
                        <div>
                          <strong>Agency:</strong> {permit.contactInfo.agency}
                        </div>
                      </div>
                      <div className='mt-2'>
                        <strong className='text-sm'>Restrictions:</strong>
                        <ul className='mt-1 space-y-1'>
                          {permit.restrictions.map((restriction, rIndex) => (
                            <li key={rIndex} className='text-xs text-gray-600'>
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
              <div className='rounded-lg border border-gray-200 p-4'>
                <h3 className='mb-3 font-semibold text-gray-900'>
                  Risk Assessment
                </h3>
                <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                  <div className='text-center'>
                    <div className='text-sm text-gray-600'>Route Risk</div>
                    <div
                      className='text-lg font-bold'
                      style={{
                        color: getRiskColor(analysis.riskAssessment.routeRisk),
                      }}
                    >
                      {analysis.riskAssessment.routeRisk.toUpperCase()}
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-sm text-gray-600'>Permit Risk</div>
                    <div
                      className='text-lg font-bold'
                      style={{
                        color: getRiskColor(analysis.riskAssessment.permitRisk),
                      }}
                    >
                      {analysis.riskAssessment.permitRisk.toUpperCase()}
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-sm text-gray-600'>Timeline Risk</div>
                    <div
                      className='text-lg font-bold'
                      style={{
                        color: getRiskColor(
                          analysis.riskAssessment.timelineRisk
                        ),
                      }}
                    >
                      {analysis.riskAssessment.timelineRisk.toUpperCase()}
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-sm text-gray-600'>Overall Risk</div>
                    <div
                      className='text-lg font-bold'
                      style={{
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
              <div className='rounded-lg border border-gray-200 p-4'>
                <h3 className='mb-3 font-semibold text-gray-900'>
                  Estimated Costs
                </h3>
                <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-blue-600'>
                      ${analysis.estimatedCosts.permits}
                    </div>
                    <div className='text-sm text-gray-600'>Permits</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-orange-600'>
                      ${analysis.estimatedCosts.pilotCars}
                    </div>
                    <div className='text-sm text-gray-600'>Pilot Cars</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-purple-600'>
                      ${analysis.estimatedCosts.specialHandling}
                    </div>
                    <div className='text-sm text-gray-600'>
                      Special Handling
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-green-600'>
                      ${analysis.estimatedCosts.totalAdditional}
                    </div>
                    <div className='text-sm text-gray-600'>
                      Total Additional
                    </div>
                  </div>
                </div>
              </div>

              {/* Compliance Checklist */}
              <div className='rounded-lg border border-gray-200 p-4'>
                <h3 className='mb-3 font-semibold text-gray-900'>
                  Compliance Checklist
                </h3>
                <ul className='grid grid-cols-1 gap-2 md:grid-cols-2'>
                  {analysis.complianceChecklist.map((item, index) => (
                    <li
                      key={index}
                      className='flex items-center gap-2 text-sm text-gray-600'
                    >
                      <div className='h-2 w-2 rounded-full bg-blue-500'></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* AI Analysis */}
              <div className='rounded-lg border border-gray-200 p-4'>
                <h3 className='mb-3 font-semibold text-gray-900'>
                  AI Analysis
                </h3>
                <p className='text-sm text-gray-600'>{analysis.reasoning}</p>
                <div className='mt-3 text-xs text-gray-500'>
                  Confidence: {analysis.confidence}%
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* State Regulations Tab */}
      {activeTab === 'regulations' && (
        <div className='space-y-6'>
          <div className='flex gap-4'>
            <button
              onClick={loadStateRegulations}
              disabled={loading}
              className='rounded-lg bg-green-600 px-6 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50'
            >
              {loading ? 'Loading...' : 'Load State Regulations'}
            </button>
          </div>

          {error && (
            <div className='rounded-lg bg-red-50 p-4 text-red-600'>{error}</div>
          )}

          {regulations.length > 0 && (
            <div className='space-y-4'>
              {regulations.map((reg, index) => (
                <div
                  key={index}
                  className='rounded-lg border border-gray-200 p-4'
                >
                  <h3 className='mb-3 text-lg font-semibold text-gray-900'>
                    {reg.state} Regulations
                  </h3>
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <div>
                      <h4 className='mb-2 font-medium text-gray-900'>
                        Maximum Dimensions
                      </h4>
                      <div className='space-y-1 text-sm text-gray-600'>
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
                      <h4 className='mb-2 font-medium text-gray-900'>
                        Permit Costs
                      </h4>
                      <div className='space-y-1 text-sm text-gray-600'>
                        <div>Single Trip: ${reg.costs.singleTrip}</div>
                        <div>Annual: ${reg.costs.annual}</div>
                        <div>Expedited Fee: ${reg.costs.expeditedFee}</div>
                      </div>
                    </div>
                  </div>
                  <div className='mt-4'>
                    <h4 className='mb-2 font-medium text-gray-900'>
                      Special Restrictions
                    </h4>
                    <ul className='space-y-1'>
                      {reg.specialRestrictions.map((restriction, rIndex) => (
                        <li key={rIndex} className='text-sm text-gray-600'>
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
        <div className='space-y-6'>
          <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
            <div className='flex items-center gap-3'>
              <div className='text-2xl'>✅</div>
              <div>
                <h3 className='font-semibold text-blue-800'>
                  Compliance Validation
                </h3>
                <p className='text-sm text-blue-700'>
                  Plan a route first to see detailed compliance analysis
                </p>
              </div>
            </div>
          </div>

          {analysis && (
            <div className='space-y-4'>
              <div className='rounded-lg border border-gray-200 p-4'>
                <h3 className='mb-3 font-semibold text-gray-900'>
                  Load Compliance Summary
                </h3>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-green-600'>
                      {analysis.permitRequirements.length}
                    </div>
                    <div className='text-sm text-gray-600'>
                      Permits Required
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-blue-600'>
                      {analysis.totalProcessingTime}h
                    </div>
                    <div className='text-sm text-gray-600'>Max Processing</div>
                  </div>
                  <div className='text-center'>
                    <div
                      className='text-2xl font-bold'
                      style={{
                        color: getRiskColor(
                          analysis.riskAssessment.overallRisk
                        ),
                      }}
                    >
                      {analysis.riskAssessment.overallRisk.toUpperCase()}
                    </div>
                    <div className='text-sm text-gray-600'>Overall Risk</div>
                  </div>
                </div>
              </div>

              <div className='rounded-lg border border-gray-200 p-4'>
                <h3 className='mb-3 font-semibold text-gray-900'>
                  Recommendations
                </h3>
                <ul className='space-y-2'>
                  {analysis.recommendations.map((rec, index) => (
                    <li
                      key={index}
                      className='flex items-center gap-2 text-sm text-gray-600'
                    >
                      <div className='h-2 w-2 rounded-full bg-green-500'></div>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
