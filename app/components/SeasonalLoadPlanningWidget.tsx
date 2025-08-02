'use client';

import { useEffect, useState } from 'react';
import { useFeatureFlag } from '../config/feature-flags';

interface SeasonalLoadRequest {
  planningPeriod: {
    startDate: string;
    endDate: string;
    season: 'spring' | 'summer' | 'fall' | 'winter' | 'holiday' | 'custom';
  };
  targetRegions: string[];
  equipmentTypes: string[];
  commodityTypes: string[];
  capacityConstraints: {
    maxDrivers: number;
    maxVehicles: number;
    maxDailyMiles: number;
  };
  businessPriorities: {
    profitMaximization: number;
    customerSatisfaction: number;
    driverUtilization: number;
    fuelEfficiency: number;
  };
  historicalDataPeriod: number;
}

interface SeasonalLoadPlan {
  result: SeasonalLoadRequest;
  confidence: number;
  reasoning: string;
  recommendations: string[];
  riskFactors: string[];
  planningPeriod: {
    startDate: string;
    endDate: string;
    season: string;
    totalWeeks: number;
  };
  demandForecast: any[];
  capacityOptimization: {
    recommendedCapacity: {
      drivers: number;
      vehicles: number;
      dailyMiles: number;
    };
    utilizationForecast: {
      expectedUtilization: number;
      peakUtilization: number;
      lowUtilization: number;
    };
    capacityAdjustments: any[];
    seasonalStaffing: {
      temporaryDrivers: number;
      contractCarriers: number;
      equipmentLeasing: number;
    };
  };
  routeRecommendations: {
    priorityRoutes: any[];
    avoidRoutes: any[];
  };
  pricingStrategy: {
    basePricing: {
      season: string;
      adjustmentFactor: number;
      reasoning: string;
    };
    dynamicPricing: {
      highDemandMultiplier: number;
      lowDemandDiscount: number;
      peakSeasonSurcharge: number;
    };
  };
  riskAssessment: {
    weatherRisk: 'low' | 'medium' | 'high';
    demandVolatility: 'low' | 'medium' | 'high';
    competitiveRisk: 'low' | 'medium' | 'high';
    overallRisk: 'low' | 'medium' | 'high';
  };
  keyMetrics: {
    projectedRevenue: number;
    projectedProfit: number;
    expectedLoadCount: number;
    avgRevenuePerMile: number;
    driverUtilizationRate: number;
    fuelEfficiencyGain: number;
  };
  actionItems: string[];
  contingencyPlans: any[];
}

interface PlanningTemplate {
  id: string;
  name: string;
  season: string;
  description: string;
  capacityIncrease: number;
  focusRoutes: string[];
  pricingAdjustment: number;
}

export default function SeasonalLoadPlanningWidget() {
  const isEnabled = useFeatureFlag('SEASONAL_LOAD_PLANNING');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<SeasonalLoadPlan | null>(null);
  const [templates, setTemplates] = useState<PlanningTemplate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'planner' | 'templates' | 'analytics'
  >('planner');

  // Form state
  const [planRequest, setPlanRequest] = useState<SeasonalLoadRequest>({
    planningPeriod: {
      startDate: '',
      endDate: '',
      season: 'fall',
    },
    targetRegions: ['US-Midwest', 'US-Southeast'],
    equipmentTypes: ['dry-van', 'refrigerated'],
    commodityTypes: ['retail', 'food'],
    capacityConstraints: {
      maxDrivers: 50,
      maxVehicles: 45,
      maxDailyMiles: 2500,
    },
    businessPriorities: {
      profitMaximization: 8,
      customerSatisfaction: 9,
      driverUtilization: 7,
      fuelEfficiency: 6,
    },
    historicalDataPeriod: 3,
  });

  useEffect(() => {
    if (isEnabled) {
      loadTemplates();
    }
  }, [isEnabled]);

  const loadTemplates = async () => {
    try {
      const response = await fetch(
        '/api/analytics/seasonal-planning?action=templates'
      );
      const data = await response.json();
      if (data.success) {
        setTemplates(data.data);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const createSeasonalPlan = async () => {
    if (
      !planRequest.planningPeriod.startDate ||
      !planRequest.planningPeriod.endDate ||
      planRequest.targetRegions.length === 0
    ) {
      setError(
        'Please fill in all required fields (Start Date, End Date, Target Regions)'
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analytics/seasonal-planning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_plan',
          planRequest,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPlan(data.data);
        setActiveTab('planner');
      } else {
        setError(data.error || 'Seasonal planning failed');
      }
    } catch (error) {
      setError('Failed to create seasonal plan');
      console.error('Error creating seasonal plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyTemplate = (template: PlanningTemplate) => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 3); // 3 months planning period

    setPlanRequest({
      ...planRequest,
      planningPeriod: {
        ...planRequest.planningPeriod,
        season: template.season as any,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      },
      capacityConstraints: {
        ...planRequest.capacityConstraints,
        maxDrivers: Math.round(
          planRequest.capacityConstraints.maxDrivers *
            (1 + template.capacityIncrease / 100)
        ),
        maxVehicles: Math.round(
          planRequest.capacityConstraints.maxVehicles *
            (1 + template.capacityIncrease / 100)
        ),
      },
    });
    setActiveTab('planner');
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

  const getSeasonColor = (season: string) => {
    const colors: { [key: string]: string } = {
      spring: '#10b981', // Green
      summer: '#f59e0b', // Orange
      fall: '#ef4444', // Red
      winter: '#3b82f6', // Blue
      holiday: '#8b5cf6', // Purple
      custom: '#6b7280', // Gray
    };
    return colors[season] || '#6b7280';
  };

  if (!isEnabled) {
    return (
      <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
        <div className='flex items-center gap-3'>
          <div className='text-2xl'>📅</div>
          <div>
            <h3 className='font-semibold text-yellow-800'>
              Seasonal Load Planning
            </h3>
            <p className='text-sm text-yellow-700'>
              Enable ENABLE_SEASONAL_LOAD_PLANNING=true to access seasonal
              planning features
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
          <div className='text-3xl'>📅</div>
          <div>
            <h2 className='text-xl font-bold text-gray-900'>
              Seasonal Load Planning
            </h2>
            <p className='text-sm text-gray-600'>
              Optimize capacity and routes based on seasonal demand patterns
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
          Planning Tool
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'templates'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Templates
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'analytics'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Analytics
        </button>
      </div>

      {/* Planning Tool Tab */}
      {activeTab === 'planner' && (
        <div className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {/* Planning Period */}
            <div className='space-y-4'>
              <h3 className='font-semibold text-gray-900'>Planning Period</h3>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Start Date
                  </label>
                  <input
                    type='date'
                    value={planRequest.planningPeriod.startDate}
                    onChange={(e) =>
                      setPlanRequest({
                        ...planRequest,
                        planningPeriod: {
                          ...planRequest.planningPeriod,
                          startDate: e.target.value,
                        },
                      })
                    }
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    End Date
                  </label>
                  <input
                    type='date'
                    value={planRequest.planningPeriod.endDate}
                    onChange={(e) =>
                      setPlanRequest({
                        ...planRequest,
                        planningPeriod: {
                          ...planRequest.planningPeriod,
                          endDate: e.target.value,
                        },
                      })
                    }
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                  />
                </div>
                <div className='col-span-2'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Season Type
                  </label>
                  <select
                    value={planRequest.planningPeriod.season}
                    onChange={(e) =>
                      setPlanRequest({
                        ...planRequest,
                        planningPeriod: {
                          ...planRequest.planningPeriod,
                          season: e.target.value as any,
                        },
                      })
                    }
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                  >
                    <option value='spring'>Spring</option>
                    <option value='summer'>Summer</option>
                    <option value='fall'>Fall</option>
                    <option value='winter'>Winter</option>
                    <option value='holiday'>Holiday Season</option>
                    <option value='custom'>Custom</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Capacity Constraints */}
            <div className='space-y-4'>
              <h3 className='font-semibold text-gray-900'>
                Capacity Constraints
              </h3>
              <div className='grid grid-cols-1 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Max Drivers
                  </label>
                  <input
                    type='number'
                    value={planRequest.capacityConstraints.maxDrivers}
                    onChange={(e) =>
                      setPlanRequest({
                        ...planRequest,
                        capacityConstraints: {
                          ...planRequest.capacityConstraints,
                          maxDrivers: Number(e.target.value),
                        },
                      })
                    }
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Max Vehicles
                  </label>
                  <input
                    type='number'
                    value={planRequest.capacityConstraints.maxVehicles}
                    onChange={(e) =>
                      setPlanRequest({
                        ...planRequest,
                        capacityConstraints: {
                          ...planRequest.capacityConstraints,
                          maxVehicles: Number(e.target.value),
                        },
                      })
                    }
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Max Daily Miles
                  </label>
                  <input
                    type='number'
                    value={planRequest.capacityConstraints.maxDailyMiles}
                    onChange={(e) =>
                      setPlanRequest({
                        ...planRequest,
                        capacityConstraints: {
                          ...planRequest.capacityConstraints,
                          maxDailyMiles: Number(e.target.value),
                        },
                      })
                    }
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Business Priorities */}
          <div className='space-y-4'>
            <h3 className='font-semibold text-gray-900'>
              Business Priorities (1-10 scale)
            </h3>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Profit Maximization
                </label>
                <input
                  type='range'
                  min='1'
                  max='10'
                  value={planRequest.businessPriorities.profitMaximization}
                  onChange={(e) =>
                    setPlanRequest({
                      ...planRequest,
                      businessPriorities: {
                        ...planRequest.businessPriorities,
                        profitMaximization: Number(e.target.value),
                      },
                    })
                  }
                  className='mt-1 w-full'
                />
                <div className='text-center text-sm text-gray-600'>
                  {planRequest.businessPriorities.profitMaximization}
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Customer Satisfaction
                </label>
                <input
                  type='range'
                  min='1'
                  max='10'
                  value={planRequest.businessPriorities.customerSatisfaction}
                  onChange={(e) =>
                    setPlanRequest({
                      ...planRequest,
                      businessPriorities: {
                        ...planRequest.businessPriorities,
                        customerSatisfaction: Number(e.target.value),
                      },
                    })
                  }
                  className='mt-1 w-full'
                />
                <div className='text-center text-sm text-gray-600'>
                  {planRequest.businessPriorities.customerSatisfaction}
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Driver Utilization
                </label>
                <input
                  type='range'
                  min='1'
                  max='10'
                  value={planRequest.businessPriorities.driverUtilization}
                  onChange={(e) =>
                    setPlanRequest({
                      ...planRequest,
                      businessPriorities: {
                        ...planRequest.businessPriorities,
                        driverUtilization: Number(e.target.value),
                      },
                    })
                  }
                  className='mt-1 w-full'
                />
                <div className='text-center text-sm text-gray-600'>
                  {planRequest.businessPriorities.driverUtilization}
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Fuel Efficiency
                </label>
                <input
                  type='range'
                  min='1'
                  max='10'
                  value={planRequest.businessPriorities.fuelEfficiency}
                  onChange={(e) =>
                    setPlanRequest({
                      ...planRequest,
                      businessPriorities: {
                        ...planRequest.businessPriorities,
                        fuelEfficiency: Number(e.target.value),
                      },
                    })
                  }
                  className='mt-1 w-full'
                />
                <div className='text-center text-sm text-gray-600'>
                  {planRequest.businessPriorities.fuelEfficiency}
                </div>
              </div>
            </div>
          </div>

          <div className='flex gap-4'>
            <button
              onClick={createSeasonalPlan}
              disabled={loading}
              className='rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50'
            >
              {loading ? 'Creating Plan...' : 'Create Seasonal Plan'}
            </button>
          </div>

          {error && (
            <div className='rounded-lg bg-red-50 p-4 text-red-600'>{error}</div>
          )}

          {plan && (
            <div className='space-y-6'>
              {/* Key Metrics */}
              <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
                <div className='rounded-lg bg-green-50 p-4'>
                  <div className='text-2xl font-bold text-green-600'>
                    ${(plan.keyMetrics.projectedRevenue / 1000).toFixed(0)}K
                  </div>
                  <div className='text-sm text-green-600'>
                    Projected Revenue
                  </div>
                </div>
                <div className='rounded-lg bg-blue-50 p-4'>
                  <div className='text-2xl font-bold text-blue-600'>
                    {plan.keyMetrics.expectedLoadCount}
                  </div>
                  <div className='text-sm text-blue-600'>Expected Loads</div>
                </div>
                <div className='rounded-lg bg-purple-50 p-4'>
                  <div className='text-2xl font-bold text-purple-600'>
                    {plan.keyMetrics.driverUtilizationRate}%
                  </div>
                  <div className='text-sm text-purple-600'>
                    Driver Utilization
                  </div>
                </div>
              </div>

              {/* Capacity Optimization */}
              <div className='rounded-lg border border-gray-200 p-4'>
                <h3 className='mb-3 font-semibold text-gray-900'>
                  Capacity Optimization
                </h3>
                <div className='grid grid-cols-3 gap-4'>
                  <div className='text-center'>
                    <div className='text-lg font-bold text-gray-900'>
                      {plan.capacityOptimization.recommendedCapacity.drivers}
                    </div>
                    <div className='text-sm text-gray-600'>
                      Recommended Drivers
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-lg font-bold text-gray-900'>
                      {plan.capacityOptimization.recommendedCapacity.vehicles}
                    </div>
                    <div className='text-sm text-gray-600'>
                      Recommended Vehicles
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-lg font-bold text-gray-900'>
                      {
                        plan.capacityOptimization.utilizationForecast
                          .peakUtilization
                      }
                      %
                    </div>
                    <div className='text-sm text-gray-600'>
                      Peak Utilization
                    </div>
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
                    <div className='text-sm text-gray-600'>Weather Risk</div>
                    <div
                      className='text-lg font-bold'
                      style={{
                        color: getRiskColor(plan.riskAssessment.weatherRisk),
                      }}
                    >
                      {plan.riskAssessment.weatherRisk.toUpperCase()}
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-sm text-gray-600'>
                      Demand Volatility
                    </div>
                    <div
                      className='text-lg font-bold'
                      style={{
                        color: getRiskColor(
                          plan.riskAssessment.demandVolatility
                        ),
                      }}
                    >
                      {plan.riskAssessment.demandVolatility.toUpperCase()}
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-sm text-gray-600'>
                      Competitive Risk
                    </div>
                    <div
                      className='text-lg font-bold'
                      style={{
                        color: getRiskColor(
                          plan.riskAssessment.competitiveRisk
                        ),
                      }}
                    >
                      {plan.riskAssessment.competitiveRisk.toUpperCase()}
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-sm text-gray-600'>Overall Risk</div>
                    <div
                      className='text-lg font-bold'
                      style={{
                        color: getRiskColor(plan.riskAssessment.overallRisk),
                      }}
                    >
                      {plan.riskAssessment.overallRisk.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Items */}
              <div className='rounded-lg border border-gray-200 p-4'>
                <h3 className='mb-3 font-semibold text-gray-900'>
                  Action Items
                </h3>
                <ul className='grid grid-cols-1 gap-2 md:grid-cols-2'>
                  {plan.actionItems.map((item, index) => (
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
                <p className='text-sm text-gray-600'>{plan.reasoning}</p>
                <div className='mt-3 text-xs text-gray-500'>
                  Confidence: {plan.confidence}%
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className='space-y-6'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {templates.map((template, index) => (
              <div
                key={index}
                className='rounded-lg border border-gray-200 p-4'
              >
                <div className='mb-3 flex items-center gap-3'>
                  <div
                    className='flex h-10 w-10 items-center justify-center rounded-full font-bold text-white'
                    style={{
                      backgroundColor: getSeasonColor(template.season),
                    }}
                  >
                    {template.season.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900'>
                      {template.name}
                    </h3>
                    <p className='text-sm text-gray-600'>
                      {template.description}
                    </p>
                  </div>
                </div>

                <div className='mb-4 space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600'>Capacity Increase:</span>
                    <span className='font-medium'>
                      +{template.capacityIncrease}%
                    </span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600'>Pricing Adjustment:</span>
                    <span className='font-medium'>
                      +{template.pricingAdjustment}%
                    </span>
                  </div>
                </div>

                <div className='mb-4'>
                  <h4 className='mb-2 text-sm font-medium text-gray-900'>
                    Focus Routes:
                  </h4>
                  <ul className='space-y-1'>
                    {template.focusRoutes.map((route, routeIndex) => (
                      <li key={routeIndex} className='text-xs text-gray-600'>
                        • {route}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => applyTemplate(template)}
                  className='w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700'
                >
                  Apply Template
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className='space-y-6'>
          <div className='rounded-lg border border-gray-200 p-4'>
            <h3 className='mb-3 font-semibold text-gray-900'>
              Seasonal Analytics Coming Soon
            </h3>
            <p className='text-sm text-gray-600'>
              This tab will contain detailed analytics and historical trend
              analysis for seasonal load planning. Features will include:
            </p>
            <ul className='mt-3 space-y-1 text-sm text-gray-600'>
              <li>• Historical demand patterns by season</li>
              <li>• Rate trend analysis</li>
              <li>• Capacity utilization metrics</li>
              <li>• Regional demand forecasting</li>
              <li>• Competitive analysis by season</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
