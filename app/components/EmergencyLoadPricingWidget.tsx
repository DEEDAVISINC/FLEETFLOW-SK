'use client';

import { useEffect, useState } from 'react';
import { useFeatureFlag } from '../config/feature-flags';

interface EmergencyLoadRequest {
  loadId: string;
  origin: string;
  destination: string;
  distance: number;
  weight: number;
  equipmentType: string;
  urgencyLevel: 'standard' | 'urgent' | 'critical' | 'emergency';
  timeConstraint: {
    requestedPickup: string;
    requiredDelivery: string;
    currentTime: string;
  };
  specialRequirements: string[];
  customerTier: 'standard' | 'premium' | 'enterprise';
  hazmatClass?: string;
  temperatureControlled?: boolean;
}

interface EmergencyPricingFactors {
  baseRate: number;
  urgencyMultiplier: number;
  timeConstraintMultiplier: number;
  availabilityMultiplier: number;
  specialRequirementsMultiplier: number;
  customerTierDiscount: number;
  marketDemandMultiplier: number;
  driverIncentiveMultiplier: number;
}

interface EmergencyPricingAnalysis {
  result: EmergencyLoadRequest;
  confidence: number;
  reasoning: string;
  recommendations: string[];
  riskFactors: string[];
  emergencyRate: number;
  standardRate: number;
  emergencyPremium: number;
  pricingFactors: EmergencyPricingFactors;
  timeToDeadline: {
    hours: number;
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  };
  availabilityAssessment: {
    driversAvailable: number;
    equipmentAvailable: number;
    competingLoads: number;
    availabilityScore: 'abundant' | 'limited' | 'scarce' | 'critical';
  };
  riskAssessment: {
    deliveryRisk: 'low' | 'medium' | 'high';
    weatherRisk: 'low' | 'medium' | 'high';
    routeRisk: 'low' | 'medium' | 'high';
    overallRisk: 'low' | 'medium' | 'high';
  };
  recommendedActions: string[];
}

interface EmergencyLoadMetrics {
  totalEmergencyLoads: number;
  averageEmergencyPremium: number;
  successRate: number;
  averageResponseTime: number;
  revenueImpact: number;
  customerSatisfactionScore: number;
  driverUtilizationImpact: number;
}

interface PricingStrategy {
  strategyName: string;
  description: string;
  urgencyThreshold: number;
  baseMultiplier: number;
  maxMultiplier: number;
  applicableScenarios: string[];
  expectedOutcomes: string[];
}

export default function EmergencyLoadPricingWidget() {
  const isEnabled = useFeatureFlag('EMERGENCY_LOAD_PRICING');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<EmergencyPricingAnalysis | null>(
    null
  );
  const [metrics, setMetrics] = useState<EmergencyLoadMetrics | null>(null);
  const [strategies, setStrategies] = useState<PricingStrategy[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'calculator' | 'metrics' | 'strategies'
  >('calculator');

  // Form state
  const [loadRequest, setLoadRequest] = useState<EmergencyLoadRequest>({
    loadId: '',
    origin: '',
    destination: '',
    distance: 0,
    weight: 0,
    equipmentType: 'dry-van',
    urgencyLevel: 'urgent',
    timeConstraint: {
      requestedPickup: '',
      requiredDelivery: '',
      currentTime: new Date().toISOString().slice(0, 16),
    },
    specialRequirements: [],
    customerTier: 'standard',
    hazmatClass: '',
    temperatureControlled: false,
  });

  useEffect(() => {
    if (isEnabled) {
      loadMetrics();
      loadStrategies();
    }
  }, [isEnabled]);

  const loadMetrics = async () => {
    try {
      const response = await fetch(
        '/api/analytics/emergency-pricing?action=metrics'
      );
      const data = await response.json();
      if (data.success) {
        setMetrics(data.data);
      }
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  };

  const loadStrategies = async () => {
    try {
      const response = await fetch(
        '/api/analytics/emergency-pricing?action=strategies'
      );
      const data = await response.json();
      if (data.success) {
        setStrategies(data.data);
      }
    } catch (error) {
      console.error('Error loading strategies:', error);
    }
  };

  const calculatePricing = async () => {
    if (
      !loadRequest.loadId ||
      !loadRequest.origin ||
      !loadRequest.destination ||
      loadRequest.distance === 0
    ) {
      setError(
        'Please fill in all required fields (Load ID, Origin, Destination, Distance)'
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analytics/emergency-pricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'calculate',
          loadRequest,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAnalysis(data.data);
        setActiveTab('calculator');
      } else {
        setError(data.error || 'Pricing calculation failed');
      }
    } catch (error) {
      setError('Failed to calculate emergency pricing');
      console.error('Error calculating pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'standard':
        return '#6b7280';
      case 'urgent':
        return '#f59e0b';
      case 'critical':
        return '#ef4444';
      case 'emergency':
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

  const getAvailabilityColor = (score: string) => {
    switch (score) {
      case 'abundant':
        return '#10b981';
      case 'limited':
        return '#f59e0b';
      case 'scarce':
        return '#ef4444';
      case 'critical':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  if (!isEnabled) {
    return (
      <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
        <div className='flex items-center gap-3'>
          <div className='text-2xl'>🚨</div>
          <div>
            <h3 className='font-semibold text-yellow-800'>
              Emergency Load Pricing
            </h3>
            <p className='text-sm text-yellow-700'>
              Enable ENABLE_EMERGENCY_LOAD_PRICING=true to access emergency
              pricing features
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '24px',
      marginBottom: '30px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '2rem' }}>🚨</div>
          <div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 4px 0'
            }}>
              Emergency Load Pricing
            </h2>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.7)',
              margin: '0'
            }}>
              Dynamic pricing for urgent shipments
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        marginBottom: '24px',
        display: 'flex',
        gap: '8px',
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '4px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <button
          onClick={() => setActiveTab('calculator')}
          style={{
            flex: 1,
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: activeTab === 'calculator' 
              ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
              : 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            backdropFilter: activeTab === 'calculator' ? 'blur(10px)' : 'none'
          }}
        >
          🧮 Pricing Calculator
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          style={{
            flex: 1,
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: activeTab === 'metrics' 
              ? 'linear-gradient(135deg, #10b981, #059669)' 
              : 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            backdropFilter: activeTab === 'metrics' ? 'blur(10px)' : 'none'
          }}
        >
          📊 Performance Metrics
        </button>
        <button
          onClick={() => setActiveTab('strategies')}
          style={{
            flex: 1,
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: activeTab === 'strategies' 
              ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' 
              : 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            backdropFilter: activeTab === 'strategies' ? 'blur(10px)' : 'none'
          }}
        >
          🎯 Pricing Strategies
        </button>
      </div>

      {/* Content Sections */}
      {activeTab === 'calculator' && (
        <div style={{ display: 'grid', gap: '24px' }}>
          {/* Quick Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div style={{
              background: 'rgba(245, 158, 11, 0.2)',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fbbf24' }}>
                ${(pricingFactors.baseRate * pricingFactors.urgencyMultiplier).toFixed(0)}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                Emergency Rate
              </div>
            </div>
            <div style={{
              background: 'rgba(239, 68, 68, 0.2)',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f87171' }}>
                {pricingFactors.urgencyMultiplier.toFixed(1)}x
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                Urgency Multiplier
              </div>
            </div>
            <div style={{
              background: 'rgba(16, 185, 129, 0.2)',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#34d399' }}>
                {Math.round((new Date(loadRequest.timeConstraint.requiredDelivery).getTime() - new Date().getTime()) / (1000 * 60 * 60))}h
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                Time Remaining
              </div>
            </div>
          </div>

          {/* Load Input Form */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '20px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📦 Load Details
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '6px'
                }}>
                  Load ID
                </label>
                <input
                  type="text"
                  value={loadRequest.loadId}
                  onChange={(e) => setLoadRequest({ ...loadRequest, loadId: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                    backdropFilter: 'blur(10px)'
                  }}
                  placeholder="e.g., EML-001"
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '6px'
                }}>
                  Urgency Level
                </label>
                <select
                  value={loadRequest.urgencyLevel}
                  onChange={(e) => setLoadRequest({ ...loadRequest, urgencyLevel: e.target.value as any })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <option value="standard" style={{ background: '#1a1b2e', color: 'white' }}>Standard</option>
                  <option value="urgent" style={{ background: '#1a1b2e', color: 'white' }}>Urgent</option>
                  <option value="critical" style={{ background: '#1a1b2e', color: 'white' }}>Critical</option>
                  <option value="emergency" style={{ background: '#1a1b2e', color: 'white' }}>Emergency</option>
                </select>
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '6px'
                }}>
                  Equipment Type
                </label>
                <select
                  value={loadRequest.equipmentType}
                  onChange={(e) => setLoadRequest({ ...loadRequest, equipmentType: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <option value="Dry Van" style={{ background: '#1a1b2e', color: 'white' }}>Dry Van</option>
                  <option value="Reefer" style={{ background: '#1a1b2e', color: 'white' }}>Reefer</option>
                  <option value="Flatbed" style={{ background: '#1a1b2e', color: 'white' }}>Flatbed</option>
                  <option value="Step Deck" style={{ background: '#1a1b2e', color: 'white' }}>Step Deck</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <button
                onClick={calculateEmergencyPricing}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)'
                }}
              >
                🚨 Calculate Emergency Pricing
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'metrics' && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: 'white', marginBottom: '16px' }}>📊 Performance Metrics</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Emergency load performance analytics and historical data will be displayed here.
          </p>
        </div>
      )}

      {activeTab === 'strategies' && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: 'white', marginBottom: '16px' }}>🎯 Pricing Strategies</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Advanced pricing strategies and market analysis tools will be available here.
          </p>
        </div>
      )}
    </div>
  );
}
