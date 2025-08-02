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
    if (isEnabled) {
      loadClassifications();
    }
  }, [isEnabled]);

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

  if (!isEnabled) {
    return (
      <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
        <div className='flex items-center gap-3'>
          <div className='text-2xl'>☢️</div>
          <div>
            <h3 className='font-semibold text-yellow-800'>
              Hazmat Route Compliance
            </h3>
            <p className='text-sm text-yellow-700'>
              Enable ENABLE_HAZMAT_ROUTE_COMPLIANCE=true to access hazmat
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
          <div className='text-3xl'>☢️</div>
          <div>
            <h2 className='text-xl font-bold text-gray-900'>
              Hazmat Route Compliance
            </h2>
            <p className='text-sm text-gray-600'>
              Dangerous goods routing with regulatory compliance
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className='mb-6 flex space-x-1 rounded-lg bg-gray-100 p-1'>
        <button
          onClick={() => setActiveTab('analyzer')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'analyzer'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Route Analyzer
        </button>
        <button
          onClick={() => setActiveTab('classifications')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'classifications'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Hazmat Classes
        </button>
        <button
          onClick={() => setActiveTab('regulations')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'regulations'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Regulations
        </button>
      </div>

      {/* Route Analyzer Tab */}
      {activeTab === 'analyzer' && (
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
                    placeholder='e.g., HAZ-001'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
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
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                  >
                    <option value='1'>Class 1 - Explosives</option>
                    <option value='2'>Class 2 - Gases</option>
                    <option value='3'>Class 3 - Flammable Liquids</option>
                    <option value='4'>Class 4 - Flammable Solids</option>
                    <option value='5'>Class 5 - Oxidizers</option>
                    <option value='6'>Class 6 - Toxic Substances</option>
                    <option value='7'>Class 7 - Radioactive</option>
                    <option value='8'>Class 8 - Corrosive</option>
                    <option value='9'>Class 9 - Miscellaneous</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
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
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                    placeholder='e.g., UN1203'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
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
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                  >
                    <option value='I'>Packing Group I (High Danger)</option>
                    <option value='II'>Packing Group II (Medium Danger)</option>
                    <option value='III'>Packing Group III (Low Danger)</option>
                  </select>
                </div>
                <div className='col-span-2'>
                  <label className='block text-sm font-medium text-gray-700'>
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
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                    placeholder='e.g., Gasoline'
                  />
                </div>
              </div>
            </div>

            {/* Route & Quantity Information */}
            <div className='space-y-4'>
              <h3 className='font-semibold text-gray-900'>
                Route & Quantity Information
              </h3>
              <div className='grid grid-cols-2 gap-4'>
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
                    placeholder='e.g., Houston, TX'
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
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
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
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                  >
                    <option value='lbs'>Pounds</option>
                    <option value='kg'>Kilograms</option>
                    <option value='gallons'>Gallons</option>
                    <option value='liters'>Liters</option>
                  </select>
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
                    <option value='dry-van'>Dry Van</option>
                    <option value='tank'>Tank Trailer</option>
                    <option value='flatbed'>Flatbed</option>
                    <option value='specialized'>Specialized Equipment</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
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
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className='space-y-4'>
            <h3 className='font-semibold text-gray-900'>Emergency Contact</h3>
            <div className='grid grid-cols-3 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
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
                  className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
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
                  className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
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
                  className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                />
              </div>
            </div>
          </div>

          <div className='flex gap-4'>
            <button
              onClick={analyzeHazmatRoute}
              disabled={loading}
              className='rounded-lg bg-red-600 px-6 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-50'
            >
              {loading ? 'Analyzing...' : 'Analyze Hazmat Route'}
            </button>
          </div>

          {error && (
            <div className='rounded-lg bg-red-50 p-4 text-red-600'>{error}</div>
          )}

          {analysis && (
            <div className='space-y-6'>
              {/* Compliance Status */}
              <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                <div className='rounded-lg bg-gray-50 p-4'>
                  <div
                    className='text-2xl font-bold'
                    style={{
                      color: getComplianceColor(analysis.complianceStatus),
                    }}
                  >
                    {analysis.complianceStatus.replace('_', ' ').toUpperCase()}
                  </div>
                  <div className='text-sm text-gray-600'>Compliance Status</div>
                </div>
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
                    ${analysis.estimatedCosts.totalAdditional}
                  </div>
                  <div className='text-sm text-orange-600'>
                    Additional Costs
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className='rounded-lg border border-gray-200 p-4'>
                <h3 className='mb-3 font-semibold text-gray-900'>
                  Risk Assessment
                </h3>
                <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                  <div className='text-center'>
                    <div className='text-sm text-gray-600'>Environmental</div>
                    <div
                      className='text-lg font-bold'
                      style={{
                        color: getRiskColor(
                          analysis.riskAssessment.environmentalRisk
                        ),
                      }}
                    >
                      {analysis.riskAssessment.environmentalRisk.toUpperCase()}
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-sm text-gray-600'>Public Safety</div>
                    <div
                      className='text-lg font-bold'
                      style={{
                        color: getRiskColor(
                          analysis.riskAssessment.publicSafetyRisk
                        ),
                      }}
                    >
                      {analysis.riskAssessment.publicSafetyRisk.toUpperCase()}
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-sm text-gray-600'>Transportation</div>
                    <div
                      className='text-lg font-bold'
                      style={{
                        color: getRiskColor(
                          analysis.riskAssessment.transportationRisk
                        ),
                      }}
                    >
                      {analysis.riskAssessment.transportationRisk.toUpperCase()}
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

              {/* Required Documents */}
              <div className='rounded-lg border border-gray-200 p-4'>
                <h3 className='mb-3 font-semibold text-gray-900'>
                  Required Documents
                </h3>
                <ul className='grid grid-cols-1 gap-2 md:grid-cols-2'>
                  {analysis.requiredDocuments.map((doc, index) => (
                    <li
                      key={index}
                      className='flex items-center gap-2 text-sm text-gray-600'
                    >
                      <div className='h-2 w-2 rounded-full bg-red-500'></div>
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Driver Requirements */}
              <div className='rounded-lg border border-gray-200 p-4'>
                <h3 className='mb-3 font-semibold text-gray-900'>
                  Driver Requirements
                </h3>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <div
                      className={`h-3 w-3 rounded-full ${
                        analysis.driverRequirements.hazmatEndorsement
                          ? 'bg-red-500'
                          : 'bg-gray-300'
                      }`}
                    ></div>
                    <span className='text-sm text-gray-600'>
                      Hazmat Endorsement Required
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div
                      className={`h-3 w-3 rounded-full ${
                        analysis.driverRequirements.medicalCertification
                          ? 'bg-red-500'
                          : 'bg-gray-300'
                      }`}
                    ></div>
                    <span className='text-sm text-gray-600'>
                      Medical Certification Required
                    </span>
                  </div>
                  {analysis.driverRequirements.specialTraining.length > 0 && (
                    <div>
                      <strong className='text-sm text-gray-700'>
                        Special Training Required:
                      </strong>
                      <ul className='mt-1 space-y-1'>
                        {analysis.driverRequirements.specialTraining.map(
                          (training, index) => (
                            <li key={index} className='text-xs text-gray-600'>
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

      {/* Hazmat Classifications Tab */}
      {activeTab === 'classifications' && (
        <div className='space-y-6'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            {classifications.map((classification, index) => (
              <div
                key={index}
                className='rounded-lg border border-gray-200 p-4'
              >
                <div className='mb-3 flex items-center gap-3'>
                  <div
                    className='flex h-10 w-10 items-center justify-center rounded-full font-bold text-white'
                    style={{
                      backgroundColor: getHazmatClassColor(
                        classification.class
                      ),
                    }}
                  >
                    {classification.class}
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900'>
                      Class {classification.class}
                    </h3>
                    <p className='text-sm text-gray-600'>
                      {classification.description}
                    </p>
                  </div>
                </div>

                <div className='mb-3'>
                  <h4 className='mb-1 text-sm font-medium text-gray-900'>
                    Examples:
                  </h4>
                  <p className='text-xs text-gray-600'>
                    {classification.examples.join(', ')}
                  </p>
                </div>

                <div className='mb-3'>
                  <h4 className='mb-1 text-sm font-medium text-gray-900'>
                    Special Requirements:
                  </h4>
                  <ul className='space-y-1'>
                    {classification.specialRequirements.map((req, reqIndex) => (
                      <li key={reqIndex} className='text-xs text-gray-600'>
                        • {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className='flex items-center gap-2 text-xs'>
                  <span
                    className={`rounded-full px-2 py-1 font-medium ${
                      classification.packingGroupRequired
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
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
        <div className='space-y-6'>
          <div className='flex gap-4'>
            <button
              onClick={loadRegulations}
              disabled={loading}
              className='rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50'
            >
              {loading ? 'Loading...' : 'Load Regulations'}
            </button>
          </div>

          {error && (
            <div className='rounded-lg bg-red-50 p-4 text-red-600'>{error}</div>
          )}

          {regulations.length > 0 && (
            <div className='space-y-4'>
              {regulations.map((regulation, index) => (
                <div
                  key={index}
                  className='rounded-lg border border-gray-200 p-4'
                >
                  <div className='mb-3 flex items-center justify-between'>
                    <div>
                      <h3 className='font-semibold text-gray-900'>
                        {regulation.authority}
                      </h3>
                      <p className='text-sm text-gray-600'>
                        {regulation.jurisdiction} - {regulation.regulationType}
                      </p>
                    </div>
                    <div
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        regulation.isRequired
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {regulation.isRequired ? 'Required' : 'Optional'}
                    </div>
                  </div>

                  <div className='mb-3'>
                    <p className='text-sm text-gray-700'>
                      {regulation.requirement}
                    </p>
                  </div>

                  <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
                    <div>
                      <strong className='text-xs text-gray-600'>
                        Reference:
                      </strong>
                      <p className='text-xs text-gray-700'>
                        {regulation.referenceCode}
                      </p>
                    </div>
                    <div>
                      <strong className='text-xs text-gray-600'>
                        Penalty:
                      </strong>
                      <p className='text-xs text-gray-700'>
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
