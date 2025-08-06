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

  // Debug logging
  console.log('SeasonalLoadPlanningWidget - isEnabled:', isEnabled);
  console.log(
    'SeasonalLoadPlanningWidget - process.env.ENABLE_SEASONAL_LOAD_PLANNING:',
    process.env.ENABLE_SEASONAL_LOAD_PLANNING
  );
  console.log(
    'SeasonalLoadPlanningWidget - process.env.NEXT_PUBLIC_ENABLE_SEASONAL_LOAD_PLANNING:',
    process.env.NEXT_PUBLIC_ENABLE_SEASONAL_LOAD_PLANNING
  );

  // Temporary force enable for debugging - remove this after fixing
  const forceEnabled = true;

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
    if (forceEnabled) {
      loadTemplates();
    }
  }, [forceEnabled]);

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

  const getSeasonGradient = (season: string) => {
    const gradients: { [key: string]: string } = {
      spring: 'linear-gradient(135deg, #10b981, #059669)', // Green gradient
      summer: 'linear-gradient(135deg, #f59e0b, #d97706)', // Orange gradient
      fall: 'linear-gradient(135deg, #ef4444, #dc2626)', // Red gradient
      winter: 'linear-gradient(135deg, #3b82f6, #2563eb)', // Blue gradient
      holiday: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', // Purple gradient
      custom: 'linear-gradient(135deg, #6b7280, #4b5563)', // Gray gradient
    };
    return gradients[season] || gradients.custom;
  };

  const getSeasonBackground = (season: string) => {
    const backgrounds: { [key: string]: string } = {
      spring: 'rgba(16, 185, 129, 0.15)', // Green background
      summer: 'rgba(245, 158, 11, 0.15)', // Orange background
      fall: 'rgba(239, 68, 68, 0.15)', // Red background
      winter: 'rgba(59, 130, 246, 0.15)', // Blue background
      holiday: 'rgba(139, 92, 246, 0.15)', // Purple background
      custom: 'rgba(107, 114, 128, 0.15)', // Gray background
    };
    return backgrounds[season] || backgrounds.custom;
  };

  const getSeasonBorder = (season: string) => {
    const borders: { [key: string]: string } = {
      spring: 'rgba(16, 185, 129, 0.3)', // Green border
      summer: 'rgba(245, 158, 11, 0.3)', // Orange border
      fall: 'rgba(239, 68, 68, 0.3)', // Red border
      winter: 'rgba(59, 130, 246, 0.3)', // Blue border
      holiday: 'rgba(139, 92, 246, 0.3)', // Purple border
      custom: 'rgba(107, 114, 128, 0.3)', // Gray border
    };
    return borders[season] || borders.custom;
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
            <span style={{ fontSize: '24px' }}>📅</span>
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
              Seasonal Load Planning
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.95)',
                margin: 0,
              }}
            >
              Enable ENABLE_SEASONAL_LOAD_PLANNING=true to access seasonal
              planning features
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: getSeasonBackground(planRequest.planningPeriod.season),
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '32px',
        border: `2px solid ${getSeasonBorder(planRequest.planningPeriod.season)}`,
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
              background: getSeasonGradient(planRequest.planningPeriod.season),
              borderRadius: '16px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            }}
          >
            <span style={{ fontSize: '32px' }}>
              {planRequest.planningPeriod.season === 'spring' && '🌸'}
              {planRequest.planningPeriod.season === 'summer' && '☀️'}
              {planRequest.planningPeriod.season === 'fall' && '🍂'}
              {planRequest.planningPeriod.season === 'winter' && '❄️'}
              {planRequest.planningPeriod.season === 'holiday' && '🎄'}
              {planRequest.planningPeriod.season === 'custom' && '📅'}
            </span>
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
              Seasonal Load Planning
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.95)',
                margin: 0,
              }}
            >
              Optimize capacity and routes based on seasonal demand patterns
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '32px',
          border: `1px solid ${getSeasonBorder(planRequest.planningPeriod.season)}`,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          gap: '8px',
        }}
      >
        {[
          { id: 'planner', label: 'Planning Tool', icon: '📋' },
          { id: 'templates', label: 'Templates', icon: '📋' },
          { id: 'analytics', label: 'Analytics', icon: '📊' },
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
                  ? getSeasonGradient(planRequest.planningPeriod.season)
                  : 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
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

      {/* Planning Tool Tab */}
      {activeTab === 'planner' && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '32px',
            }}
          >
            {/* Planning Period */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: `2px solid ${getSeasonBorder(planRequest.planningPeriod.season)}`,
                boxShadow: `0 4px 20px ${getSeasonColor(planRequest.planningPeriod.season)}20`,
              }}
            >
              <h3
                style={{
                  fontWeight: '600',
                  color: 'white',
                  fontSize: '18px',
                  margin: '0 0 16px 0',
                }}
              >
                Planning Period
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'rgba(255, 255, 255, 0.9)',
                      marginBottom: '8px',
                    }}
                  >
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
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
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
                      fontWeight: '500',
                      color: 'rgba(255, 255, 255, 0.9)',
                      marginBottom: '8px',
                    }}
                  >
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
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div
                  style={{
                    gridColumn: 'span 2',
                  }}
                >
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'rgba(255, 255, 255, 0.9)',
                      marginBottom: '8px',
                    }}
                  >
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
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  >
                    <option value='spring'>Spring</option>
                    <option value='summer'>Summer</option>
                    <option value='fall'>Fall</option>
                    <option value='winter'>Winter</option>
                    <option value='holiday'>Holiday Season</option>
                    <option value='custom'>Custom Period</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Capacity Constraints */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: `2px solid ${getSeasonBorder(planRequest.planningPeriod.season)}`,
                boxShadow: `0 4px 20px ${getSeasonColor(planRequest.planningPeriod.season)}20`,
              }}
            >
              <h3
                style={{
                  fontWeight: '600',
                  color: 'white',
                  fontSize: '18px',
                  margin: '0 0 16px 0',
                }}
              >
                Capacity Constraints
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'rgba(255, 255, 255, 0.9)',
                      marginBottom: '8px',
                    }}
                  >
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
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
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
                      fontWeight: '500',
                      color: 'rgba(255, 255, 255, 0.9)',
                      marginBottom: '8px',
                    }}
                  >
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
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
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
                      fontWeight: '500',
                      color: 'rgba(255, 255, 255, 0.9)',
                      marginBottom: '8px',
                    }}
                  >
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
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Business Priorities */}
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
                fontWeight: '600',
                color: 'white',
                fontSize: '18px',
                margin: '0 0 16px 0',
              }}
            >
              Business Priorities (1-10 scale)
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
              }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '8px',
                  }}
                >
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
                  style={{
                    width: '100%',
                    marginTop: '8px',
                    accentColor: getSeasonColor(
                      planRequest.planningPeriod.season
                    ),
                  }}
                />
                <div
                  style={{
                    textAlign: 'center',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginTop: '8px',
                  }}
                >
                  {planRequest.businessPriorities.profitMaximization}
                </div>
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '8px',
                  }}
                >
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
                  style={{
                    width: '100%',
                    marginTop: '8px',
                    accentColor: getSeasonColor(
                      planRequest.planningPeriod.season
                    ),
                  }}
                />
                <div
                  style={{
                    textAlign: 'center',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginTop: '8px',
                  }}
                >
                  {planRequest.businessPriorities.customerSatisfaction}
                </div>
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '8px',
                  }}
                >
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
                  style={{
                    width: '100%',
                    marginTop: '8px',
                    accentColor: getSeasonColor(
                      planRequest.planningPeriod.season
                    ),
                  }}
                />
                <div
                  style={{
                    textAlign: 'center',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginTop: '8px',
                  }}
                >
                  {planRequest.businessPriorities.driverUtilization}
                </div>
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '8px',
                  }}
                >
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
                  style={{
                    width: '100%',
                    marginTop: '8px',
                    accentColor: getSeasonColor(
                      planRequest.planningPeriod.season
                    ),
                  }}
                />
                <div
                  style={{
                    textAlign: 'center',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginTop: '8px',
                  }}
                >
                  {planRequest.businessPriorities.fuelEfficiency}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '16px',
            }}
          >
            <button
              onClick={createSeasonalPlan}
              disabled={loading}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '16px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                background: loading
                  ? 'rgba(255, 255, 255, 0.3)'
                  : getSeasonGradient(planRequest.planningPeriod.season),
                color: 'white',
                opacity: loading ? 0.5 : 1,
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? 'Creating Plan...' : 'Create Seasonal Plan'}
            </button>
          </div>

          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: 'rgba(255, 255, 255, 0.95)',
              }}
            >
              {error}
            </div>
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
                      <div className='h-2 w-2 rounded-full bg-blue-500' />
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
                style={{
                  borderRadius: '16px',
                  border: `2px solid ${getSeasonBorder(template.season)}`,
                  background: getSeasonBackground(template.season),
                  backdropFilter: 'blur(10px)',
                  padding: '20px',
                  boxShadow: `0 4px 20px ${getSeasonColor(template.season)}20`,
                }}
              >
                <div className='mb-3 flex items-center gap-3'>
                  <div
                    style={{
                      display: 'flex',
                      height: '48px',
                      width: '48px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '16px',
                      fontWeight: 'bold',
                      color: '#ffffff',
                      background: getSeasonGradient(template.season),
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    {template.season.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontWeight: '600',
                        color: '#ffffff',
                        fontSize: '18px',
                        margin: '0 0 4px 0',
                      }}
                    >
                      {template.name}
                    </h3>
                    <p
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.8)',
                        margin: 0,
                      }}
                    >
                      {template.description}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    marginBottom: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '14px',
                    }}
                  >
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Capacity Increase:
                    </span>
                    <span style={{ fontWeight: '600', color: '#ffffff' }}>
                      +{template.capacityIncrease}%
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '14px',
                    }}
                  >
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Pricing Adjustment:
                    </span>
                    <span style={{ fontWeight: '600', color: '#ffffff' }}>
                      +{template.pricingAdjustment}%
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <h4
                    style={{
                      marginBottom: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#ffffff',
                    }}
                  >
                    Focus Routes:
                  </h4>
                  <ul
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    {template.focusRoutes.map((route, routeIndex) => (
                      <li
                        key={routeIndex}
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        • {route}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => applyTemplate(template)}
                  style={{
                    width: '100%',
                    borderRadius: '12px',
                    background: getSeasonGradient(template.season),
                    padding: '12px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 6px 20px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 12px rgba(0, 0, 0, 0.2)';
                  }}
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
