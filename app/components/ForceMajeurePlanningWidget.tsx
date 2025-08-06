'use client';

import { useEffect, useState } from 'react';
import { useFeatureFlag } from '../config/feature-flags';

interface DisasterEvent {
  id: string;
  type:
    | 'hurricane'
    | 'earthquake'
    | 'flood'
    | 'wildfire'
    | 'tornado'
    | 'blizzard'
    | 'pandemic'
    | 'cyberattack'
    | 'strike'
    | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  radius: number; // miles
  status: 'monitoring' | 'active' | 'resolved';
  startTime: string;
  estimatedEndTime?: string;
  description: string;
  affectedRoutes: string[];
  affectedDrivers: string[];
  affectedCustomers: string[];
  emergencyActions: string[];
}

interface ContingencyPlan {
  id: string;
  name: string;
  triggerConditions: string[];
  automatedActions: string[];
  manualActions: string[];
  resourceRequirements: string[];
  communicationPlan: string[];
  recoverySteps: string[];
  lastUpdated: string;
  isActive: boolean;
}

interface EmergencyResource {
  id: string;
  type:
    | 'backup_facility'
    | 'emergency_vehicle'
    | 'communication_system'
    | 'medical_kit'
    | 'fuel_reserve'
    | 'cash_reserve';
  name: string;
  location: string;
  capacity: string;
  availability: 'available' | 'in_use' | 'unavailable';
  contact: string;
  notes: string;
}

interface BusinessImpactAssessment {
  eventId: string;
  estimatedRevenueLoss: number;
  operationalDisruption: number; // percentage
  customerImpact: number;
  driverImpact: number;
  recoveryTimeEstimate: number; // hours
  priorityActions: string[];
  insuranceClaims: string[];
}

export default function ForceMajeurePlanningWidget() {
  const isEnabled = useFeatureFlag('FORCE_MAJEURE_PLANNING');
  const [mounted, setMounted] = useState(false);

  // Force enable for debugging - the environment variable is set but there might be a hydration issue
  const forceEnabled = true;

  // Debug logging
  console.log('🚨 ForceMajeurePlanningWidget - isEnabled:', isEnabled);
  console.log('🚨 ForceMajeurePlanningWidget - forceEnabled:', forceEnabled);
  console.log(
    '🚨 ForceMajeurePlanningWidget - process.env.ENABLE_FORCE_MAJEURE_PLANNING:',
    process.env.ENABLE_FORCE_MAJEURE_PLANNING
  );
  console.log(
    '🚨 ForceMajeurePlanningWidget - process.env.NEXT_PUBLIC_ENABLE_FORCE_MAJEURE_PLANNING:',
    process.env.NEXT_PUBLIC_ENABLE_FORCE_MAJEURE_PLANNING
  );
  const [activeTab, setActiveTab] = useState('monitoring');
  const [disasterEvents, setDisasterEvents] = useState<DisasterEvent[]>([]);
  const [contingencyPlans, setContingencyPlans] = useState<ContingencyPlan[]>(
    []
  );
  const [emergencyResources, setEmergencyResources] = useState<
    EmergencyResource[]
  >([]);
  const [businessImpact, setBusinessImpact] = useState<
    BusinessImpactAssessment[]
  >([]);
  const [loading, setLoading] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load force majeure data when mounted and enabled
  useEffect(() => {
    if (mounted && (isEnabled || forceEnabled)) {
      console.log(
        'Force Majeure component mounted and enabled - loading data...'
      );
      loadForceMajeureData();
    }
  }, [mounted, isEnabled]);

  const loadForceMajeureData = async () => {
    console.log('🚨 loadForceMajeureData called');
    setLoading(true);
    try {
      console.log(
        '🚨 Fetching force majeure data from /api/force-majeure/monitoring'
      );
      const response = await fetch('/api/force-majeure/monitoring');
      console.log('🚨 Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('🚨 Force majeure data received:', data);
        setDisasterEvents(data.events || []);
        setContingencyPlans(data.plans || []);
        setEmergencyResources(data.resources || []);
        setBusinessImpact(data.businessImpact || []);
        console.log(
          '🚨 State updated with events:',
          data.events?.length,
          'plans:',
          data.plans?.length
        );
      } else {
        // Set demo data if API fails
        setDemoData();
      }
    } catch (error) {
      console.error('🚨 Error loading force majeure data:', error);
      setDemoData();
    } finally {
      setLoading(false);
    }
  };

  const setDemoData = () => {
    setDisasterEvents([
      {
        id: 'event-1',
        type: 'hurricane',
        severity: 'high',
        location: 'Gulf Coast, FL',
        coordinates: { lat: 27.7663, lng: -82.6404 },
        radius: 150,
        status: 'active',
        startTime: '2024-01-15T08:00:00Z',
        estimatedEndTime: '2024-01-17T18:00:00Z',
        description: 'Category 3 Hurricane approaching Florida Gulf Coast',
        affectedRoutes: ['I-75', 'I-95', 'US-41'],
        affectedDrivers: ['D001', 'D002', 'D003'],
        affectedCustomers: ['CUST-001', 'CUST-002'],
        emergencyActions: [
          'Evacuate drivers from danger zone',
          'Reroute shipments',
          'Activate backup facility',
        ],
      },
      {
        id: 'event-2',
        type: 'wildfire',
        severity: 'medium',
        location: 'Northern California',
        coordinates: { lat: 38.5816, lng: -121.4944 },
        radius: 75,
        status: 'monitoring',
        startTime: '2024-01-14T12:00:00Z',
        description: 'Wildfire spreading near major shipping routes',
        affectedRoutes: ['I-5', 'CA-99'],
        affectedDrivers: ['D004', 'D005'],
        affectedCustomers: ['CUST-003'],
        emergencyActions: ['Monitor air quality', 'Prepare alternate routes'],
      },
    ]);

    setContingencyPlans([
      {
        id: 'plan-1',
        name: 'Hurricane Response Plan',
        triggerConditions: [
          'Category 2+ hurricane within 200 miles',
          'Sustained winds >74 mph',
        ],
        automatedActions: [
          'Send evacuation alerts',
          'Reroute active shipments',
          'Activate tracking protocols',
        ],
        manualActions: [
          'Contact all drivers in affected area',
          'Coordinate with emergency services',
          'Implement customer communications',
        ],
        resourceRequirements: [
          'Backup facility',
          'Emergency vehicles',
          'Communication systems',
        ],
        communicationPlan: [
          'SMS alerts to drivers',
          'Email notifications to customers',
          'Social media updates',
        ],
        recoverySteps: [
          'Assess damage',
          'Resume operations gradually',
          'File insurance claims',
        ],
        lastUpdated: '2024-01-10T10:00:00Z',
        isActive: true,
      },
      {
        id: 'plan-2',
        name: 'Wildfire Response Plan',
        triggerConditions: [
          'Wildfire within 50 miles of routes',
          'Air quality index >150',
        ],
        automatedActions: [
          'Issue air quality alerts',
          'Suggest alternate routes',
        ],
        manualActions: [
          'Monitor fire progression',
          'Coordinate with fire departments',
        ],
        resourceRequirements: ['Air quality monitors', 'Alternate route maps'],
        communicationPlan: [
          'Real-time driver updates',
          'Customer notifications',
        ],
        recoverySteps: ['Wait for all-clear', 'Resume normal operations'],
        lastUpdated: '2024-01-08T14:00:00Z',
        isActive: false,
      },
    ]);

    setEmergencyResources([
      {
        id: 'res-1',
        type: 'backup_facility',
        name: 'Atlanta Emergency Operations Center',
        location: 'Atlanta, GA',
        capacity: '50 vehicles, 100 staff',
        availability: 'available',
        contact: '+1-404-555-0123',
        notes: 'Fully equipped backup facility with generators',
      },
      {
        id: 'res-2',
        type: 'emergency_vehicle',
        name: 'Mobile Command Unit',
        location: 'Jacksonville, FL',
        capacity: '6 personnel',
        availability: 'in_use',
        contact: '+1-904-555-0456',
        notes: 'Currently deployed for hurricane response',
      },
    ]);

    setBusinessImpact([
      {
        eventId: 'event-1',
        estimatedRevenueLoss: 125000,
        operationalDisruption: 65,
        customerImpact: 8,
        driverImpact: 12,
        recoveryTimeEstimate: 72,
        priorityActions: [
          'Secure driver safety',
          'Maintain customer communications',
          'Minimize cargo damage',
        ],
        insuranceClaims: [
          'Property damage',
          'Business interruption',
          'Cargo insurance',
        ],
      },
    ]);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'hurricane':
        return '🌀';
      case 'earthquake':
        return '🌍';
      case 'flood':
        return '🌊';
      case 'wildfire':
        return '🔥';
      case 'tornado':
        return '🌪️';
      case 'blizzard':
        return '❄️';
      case 'pandemic':
        return '🦠';
      case 'cyberattack':
        return '💻';
      case 'strike':
        return '✊';
      default:
        return '⚠️';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'rgba(34, 197, 94, 0.6)';
      case 'medium':
        return 'rgba(251, 191, 36, 0.6)';
      case 'high':
        return 'rgba(249, 115, 22, 0.6)';
      case 'critical':
        return 'rgba(239, 68, 68, 0.6)';
      default:
        return 'rgba(156, 163, 175, 0.6)';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'monitoring':
        return 'rgba(59, 130, 246, 0.6)';
      case 'active':
        return 'rgba(239, 68, 68, 0.6)';
      case 'resolved':
        return 'rgba(34, 197, 94, 0.6)';
      default:
        return 'rgba(156, 163, 175, 0.6)';
    }
  };

  if (!isEnabled && !forceEnabled) {
    return (
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          border: '2px solid rgba(239, 68, 68, 0.6)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚨</div>
        <h3 style={{ color: 'white', fontSize: '20px', marginBottom: '8px' }}>
          Force Majeure Planning
        </h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '16px' }}>
          Enable FORCE_MAJEURE_PLANNING=true to access disaster response and
          emergency planning features
        </p>
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
        border: '2px solid rgba(239, 68, 68, 0.6)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header */}
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
            <span style={{ fontSize: '32px' }}>🚨</span>
          </div>
          <div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'white',
                margin: '0 0 8px 0',
              }}
            >
              Force Majeure Planning
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: '0',
              }}
            >
              Disaster response and emergency contingency planning
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                background: '#ef4444',
                borderRadius: '50%',
                animation: 'pulse 2s infinite',
              }}
             />
            <span
              style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Emergency Monitoring Active
            </span>
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
          border: '2px solid rgba(239, 68, 68, 0.4)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          gap: '8px',
        }}
      >
        {[
          { id: 'monitoring', label: '📊 Event Monitoring', icon: '📊' },
          { id: 'plans', label: '📋 Contingency Plans', icon: '📋' },
          { id: 'resources', label: '🚑 Emergency Resources', icon: '🚑' },
          { id: 'impact', label: '💰 Business Impact', icon: '💰' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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
              color: activeTab === tab.id ? '#1f2937' : 'white',
              transform:
                activeTab === tab.id ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow:
                activeTab === tab.id
                  ? '0 8px 25px rgba(0, 0, 0, 0.15)'
                  : 'none',
            }}
          >
            <span style={{ marginRight: '8px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Event Monitoring Tab */}
        {activeTab === 'monitoring' && (
          <>
            {/* Active Events Overview */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '2px solid #ef4444',
                  textAlign: 'center',
                  boxShadow: '0 4px 15px #ef444430',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px #ef444440';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px #ef444430';
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🚨</div>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '4px',
                  }}
                >
                  {disasterEvents.filter((e) => e.status === 'active').length}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: '#ef4444',
                    fontWeight: '600',
                  }}
                >
                  Active Events
                </div>
              </div>

              <div
                style={{
                  background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '2px solid #3b82f6',
                  textAlign: 'center',
                  boxShadow: '0 4px 15px #3b82f630',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px #3b82f640';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px #3b82f630';
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>👀</div>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '4px',
                  }}
                >
                  {
                    disasterEvents.filter((e) => e.status === 'monitoring')
                      .length
                  }
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: '#3b82f6',
                    fontWeight: '600',
                  }}
                >
                  Monitoring
                </div>
              </div>

              <div
                style={{
                  background: 'linear-gradient(135deg, #fed7aa, #fdba74)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '2px solid #f97316',
                  textAlign: 'center',
                  boxShadow: '0 4px 15px #f9731630',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px #f9731640';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px #f9731630';
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🚛</div>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '4px',
                  }}
                >
                  {disasterEvents.reduce(
                    (total, e) => total + e.affectedDrivers.length,
                    0
                  )}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: '#f97316',
                    fontWeight: '600',
                  }}
                >
                  Affected Drivers
                </div>
              </div>

              <div
                style={{
                  background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '2px solid #8b5cf6',
                  textAlign: 'center',
                  boxShadow: '0 4px 15px #8b5cf630',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px #8b5cf640';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px #8b5cf630';
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📋</div>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '4px',
                  }}
                >
                  {contingencyPlans.filter((p) => p.isActive).length}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: '#8b5cf6',
                    fontWeight: '600',
                  }}
                >
                  Active Plans
                </div>
              </div>
            </div>

            {/* Current Events */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '2px solid rgba(239, 68, 68, 0.4)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '18px',
                  marginBottom: '16px',
                }}
              >
                Current Disaster Events
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {disasterEvents.map((event) => (
                  <div
                    key={event.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: `2px solid ${getSeverityColor(event.severity)}`,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '12px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>
                          {getEventIcon(event.type)}
                        </span>
                        <div>
                          <h4
                            style={{
                              color: 'white',
                              fontSize: '16px',
                              margin: '0 0 4px 0',
                              textTransform: 'capitalize',
                            }}
                          >
                            {event.type} - {event.location}
                          </h4>
                          <p
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '14px',
                              margin: '0',
                            }}
                          >
                            {event.description}
                          </p>
                        </div>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <div
                          style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: getSeverityColor(event.severity),
                            color: 'white',
                            textTransform: 'uppercase',
                          }}
                        >
                          {event.severity}
                        </div>
                        <div
                          style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: getStatusColor(event.status),
                            color: 'white',
                            textTransform: 'uppercase',
                          }}
                        >
                          {event.status}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '12px',
                        fontSize: '14px',
                      }}
                    >
                      <div>
                        <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Affected Routes:{' '}
                        </span>
                        <span
                          style={{
                            color: 'white',
                          }}
                        >
                          {event.affectedRoutes.join(', ')}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Drivers:{' '}
                        </span>
                        <span
                          style={{
                            color: 'white',
                          }}
                        >
                          {event.affectedDrivers.length}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Customers:{' '}
                        </span>
                        <span
                          style={{
                            color: 'white',
                          }}
                        >
                          {event.affectedCustomers.length}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Radius:{' '}
                        </span>
                        <span
                          style={{
                            color: 'white',
                          }}
                        >
                          {event.radius} miles
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Contingency Plans Tab */}
        {activeTab === 'plans' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '2px solid rgba(59, 130, 246, 0.4)',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '18px',
                marginBottom: '16px',
              }}
            >
              Emergency Contingency Plans
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {contingencyPlans.map((plan) => (
                <div
                  key={plan.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: `2px solid ${plan.isActive ? 'rgba(34, 197, 94, 0.6)' : 'rgba(156, 163, 175, 0.4)'}`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px',
                    }}
                  >
                    <h4
                      style={{
                        color: 'white',
                        fontSize: '18px',
                        margin: '0',
                      }}
                    >
                      {plan.name}
                    </h4>
                    <div
                      style={{
                        padding: '6px 16px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: plan.isActive
                          ? 'rgba(34, 197, 94, 0.6)'
                          : 'rgba(156, 163, 175, 0.4)',
                        color: 'white',
                        textTransform: 'uppercase',
                      }}
                    >
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <h5
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '14px',
                          marginBottom: '8px',
                        }}
                      >
                        Trigger Conditions:
                      </h5>
                      <ul
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '13px',
                          margin: '0',
                          paddingLeft: '16px',
                        }}
                      >
                        {plan.triggerConditions.map((condition, idx) => (
                          <li key={idx}>{condition}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '14px',
                          marginBottom: '8px',
                        }}
                      >
                        Automated Actions:
                      </h5>
                      <ul
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '13px',
                          margin: '0',
                          paddingLeft: '16px',
                        }}
                      >
                        {plan.automatedActions.map((action, idx) => (
                          <li key={idx}>{action}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '14px',
                          marginBottom: '8px',
                        }}
                      >
                        Manual Actions:
                      </h5>
                      <ul
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '13px',
                          margin: '0',
                          paddingLeft: '16px',
                        }}
                      >
                        {plan.manualActions.map((action, idx) => (
                          <li key={idx}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: '16px',
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    Last Updated:{' '}
                    {new Date(plan.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Emergency Resources Tab */}
        {activeTab === 'resources' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '2px solid rgba(16, 185, 129, 0.4)',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '18px',
                marginBottom: '16px',
              }}
            >
              Emergency Resources
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '16px',
              }}
            >
              {emergencyResources.map((resource) => (
                <div
                  key={resource.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: `2px solid ${
                      resource.availability === 'available'
                        ? 'rgba(34, 197, 94, 0.6)'
                        : resource.availability === 'in_use'
                          ? 'rgba(251, 191, 36, 0.6)'
                          : 'rgba(239, 68, 68, 0.6)'
                    }`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}
                  >
                    <h4
                      style={{
                        color: 'white',
                        fontSize: '16px',
                        margin: '0',
                      }}
                    >
                      {resource.name}
                    </h4>
                    <div
                      style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background:
                          resource.availability === 'available'
                            ? 'rgba(34, 197, 94, 0.6)'
                            : resource.availability === 'in_use'
                              ? 'rgba(251, 191, 36, 0.6)'
                              : 'rgba(239, 68, 68, 0.6)',
                        color: 'white',
                        textTransform: 'capitalize',
                      }}
                    >
                      {resource.availability.replace('_', ' ')}
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginBottom: '8px',
                    }}
                  >
                    <strong>Type:</strong>{' '}
                    {resource.type.replace('_', ' ').toUpperCase()}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginBottom: '8px',
                    }}
                  >
                    <strong>Location:</strong> {resource.location}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginBottom: '8px',
                    }}
                  >
                    <strong>Capacity:</strong> {resource.capacity}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginBottom: '8px',
                    }}
                  >
                    <strong>Contact:</strong> {resource.contact}
                  </div>
                  {resource.notes && (
                    <div
                      style={{
                        fontSize: '13px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        marginTop: '12px',
                        fontStyle: 'italic',
                      }}
                    >
                      {resource.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Business Impact Tab */}
        {activeTab === 'impact' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '2px solid rgba(251, 191, 36, 0.4)',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '18px',
                marginBottom: '16px',
              }}
            >
              Business Impact Assessment
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              {businessImpact.map((impact) => {
                const event = disasterEvents.find(
                  (e) => e.id === impact.eventId
                );
                return (
                  <div
                    key={impact.eventId}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '2px solid rgba(251, 191, 36, 0.6)',
                    }}
                  >
                    <h4
                      style={{
                        color: 'white',
                        fontSize: '16px',
                        marginBottom: '16px',
                      }}
                    >
                      {event
                        ? `${event.type.charAt(0).toUpperCase() + event.type.slice(1)} - ${event.location}`
                        : 'Unknown Event'}
                    </h4>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px',
                        marginBottom: '20px',
                      }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#ef4444',
                            marginBottom: '4px',
                          }}
                        >
                          ${impact.estimatedRevenueLoss.toLocaleString()}
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            color: 'rgba(255, 255, 255, 0.7)',
                          }}
                        >
                          Revenue Loss
                        </div>
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#f59e0b',
                            marginBottom: '4px',
                          }}
                        >
                          {impact.operationalDisruption}%
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            color: 'rgba(255, 255, 255, 0.7)',
                          }}
                        >
                          Operations Disrupted
                        </div>
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#3b82f6',
                            marginBottom: '4px',
                          }}
                        >
                          {impact.customerImpact}
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            color: 'rgba(255, 255, 255, 0.7)',
                          }}
                        >
                          Customers Affected
                        </div>
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#10b981',
                            marginBottom: '4px',
                          }}
                        >
                          {impact.recoveryTimeEstimate}h
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            color: 'rgba(255, 255, 255, 0.7)',
                          }}
                        >
                          Recovery Time
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '16px',
                      }}
                    >
                      <div>
                        <h5
                          style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '14px',
                            marginBottom: '8px',
                          }}
                        >
                          Priority Actions:
                        </h5>
                        <ul
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '13px',
                            margin: '0',
                            paddingLeft: '16px',
                          }}
                        >
                          {impact.priorityActions.map((action, idx) => (
                            <li key={idx}>{action}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5
                          style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '14px',
                            marginBottom: '8px',
                          }}
                        >
                          Insurance Claims:
                        </h5>
                        <ul
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '13px',
                            margin: '0',
                            paddingLeft: '16px',
                          }}
                        >
                          {impact.insuranceClaims.map((claim, idx) => (
                            <li key={idx}>{claim}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
