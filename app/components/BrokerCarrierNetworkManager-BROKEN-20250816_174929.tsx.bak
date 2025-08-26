'use client';

import { useEffect, useState } from 'react';
import CarrierVerificationPanel from './CarrierVerificationPanel';

// Use Enhanced Carrier Portal's carrier data structure
interface EnhancedCarrierData {
  id: string;
  mcNumber: string;
  dotNumber: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  onboardingDate: string;
  safetyRating: string;
  equipmentTypes: string[];
  capacity: {
    trucks: number;
    drivers: number;
    available: number;
  };
  // Enhanced Carrier Portal data
  enhancedPortalStatus: 'onboarded' | 'in_progress' | 'not_started';
  documentsVerified: boolean;
  agreementsSigned: boolean;
  portalAccess: boolean;
}

// Broker-specific relationship data (separate from carrier data)
interface BrokerCarrierRelationship {
  carrierId: string;
  brokerId: string;
  relationshipType: 'preferred' | 'standard' | 'trial';
  performanceScore: number;
  onTimePercentage: number;
  damageRate: number;
  lastLoad: string;
  preferredLanes: string[];
  paymentTerms: string;
  creditRating: 'A' | 'B' | 'C' | 'D' | 'F';
  brokerNotes: string;
  dateEstablished: string;
  totalLoads: number;
  totalRevenue: number;
}

interface BrokerCarrierNetworkManagerProps {
  brokerId: string;
}

export default function BrokerCarrierNetworkManager({
  brokerId,
}: BrokerCarrierNetworkManagerProps) {
  const [activeTab, setActiveTab] = useState<
    'network' | 'invite' | 'performance' | 'analytics'
  >('network');
  
  // Enhanced Carrier Portal carriers (from standardized onboarding)
  const [enhancedCarriers, setEnhancedCarriers] = useState<EnhancedCarrierData[]>([]);
  
  // Broker-specific relationship data
  const [brokerRelationships, setBrokerRelationships] = useState<BrokerCarrierRelationship[]>([]);
  
  const [selectedCarrier, setSelectedCarrier] = useState<EnhancedCarrierData | null>(null);
  const [selectedRelationship, setSelectedRelationship] = useState<BrokerCarrierRelationship | null>(null);
  
  const [filters, setFilters] = useState({
    status: 'all',
    equipmentType: 'all',
    relationshipType: 'all',
    performanceRating: 'all',
  });

  // Load Enhanced Carrier Portal carriers and broker relationships
  useEffect(() => {
    // Load carriers from Enhanced Carrier Portal (standardized onboarding)
    const mockEnhancedCarriers: EnhancedCarrierData[] = [
      {
        id: 'ECP001',
        mcNumber: 'MC-123456',
        dotNumber: 'DOT-789012',
        companyName: 'Reliable Transport LLC',
        contactName: 'John Smith',
        phone: '(555) 123-4567',
        email: 'john@reliabletransport.com',
        status: 'active',
        onboardingDate: '2024-01-15',
        safetyRating: 'Satisfactory',
        equipmentTypes: ['Dry Van', 'Refrigerated'],
        capacity: { trucks: 25, drivers: 30, available: 8 },
        enhancedPortalStatus: 'onboarded',
        documentsVerified: true,
        agreementsSigned: true,
        portalAccess: true,
      },
      {
        id: 'ECP002',
        mcNumber: 'MC-654321',
        dotNumber: 'DOT-210987',
        companyName: 'FastLine Freight',
        contactName: 'Maria Garcia',
        phone: '(555) 987-6543',
        email: 'maria@fastlinefreight.com',
        status: 'active',
        onboardingDate: '2024-03-10',
        safetyRating: 'Satisfactory',
        equipmentTypes: ['Flatbed', 'Step Deck'],
        capacity: { trucks: 15, drivers: 18, available: 5 },
        enhancedPortalStatus: 'onboarded',
        documentsVerified: true,
        agreementsSigned: true,
        portalAccess: true,
      },
      {
        id: 'ECP003',
        mcNumber: 'MC-987654',
        dotNumber: 'DOT-456789',
        companyName: 'Coastal Carriers',
        contactName: 'Mike Johnson',
        phone: '(555) 456-7890',
        email: 'mike@coastalcarriers.com',
        status: 'pending',
        onboardingDate: '2024-12-18',
        safetyRating: 'Not Rated',
        equipmentTypes: ['Dry Van'],
        capacity: { trucks: 10, drivers: 12, available: 10 },
        enhancedPortalStatus: 'in_progress',
        documentsVerified: false,
        agreementsSigned: false,
        portalAccess: false,
      },
    ];

    // Broker-specific relationship data (separate from carrier master data)
    const mockBrokerRelationships: BrokerCarrierRelationship[] = [
      {
        carrierId: 'ECP001',
        brokerId: brokerId,
        relationshipType: 'preferred',
        performanceScore: 95,
        onTimePercentage: 98,
        damageRate: 0.2,
        lastLoad: '2024-12-15',
        preferredLanes: ['TX-CA', 'CA-AZ', 'AZ-NV'],
        paymentTerms: 'Net 30',
        creditRating: 'A',
        brokerNotes: 'Excellent carrier, always on time. Preferred for high-value loads.',
        dateEstablished: '2024-01-20',
        totalLoads: 156,
        totalRevenue: 425000,
      },
      {
        carrierId: 'ECP002',
        brokerId: brokerId,
        relationshipType: 'standard',
        performanceScore: 88,
        onTimePercentage: 92,
        damageRate: 0.5,
        lastLoad: '2024-12-18',
        preferredLanes: ['FL-NY', 'NY-MA', 'MA-CT'],
        paymentTerms: 'Net 15',
        creditRating: 'B',
        brokerNotes: 'Good for specialized equipment. Reliable for flatbed loads.',
        dateEstablished: '2024-03-15',
        totalLoads: 89,
        totalRevenue: 267000,
      },
    ];

    setEnhancedCarriers(mockEnhancedCarriers);
    setBrokerRelationships(mockBrokerRelationships);
  }, []);

  const handleInviteCarrier = () => {
    // Redirect to Enhanced Carrier Portal for standardized onboarding
    window.open('/carriers/enhanced-portal', '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'inactive':
        return '#6b7280';
      case 'pending':
        return '#f59e0b';
      case 'suspended':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 95) return '#10b981';
    if (score >= 90) return '#84cc16';
    if (score >= 85) return '#f59e0b';
    if (score >= 80) return '#f97316';
    return '#ef4444';
  };

  // Combine Enhanced Carrier data with broker relationships for filtering
  const carriersWithRelationships = enhancedCarriers.map(carrier => {
    const relationship = brokerRelationships.find(rel => rel.carrierId === carrier.id);
    return { carrier, relationship };
  }).filter(item => item.relationship); // Only show carriers this broker has relationships with

  const filteredCarriers = carriersWithRelationships.filter(({ carrier, relationship }) => {
    if (filters.status !== 'all' && carrier.status !== filters.status)
      return false;
    if (
      filters.equipmentType !== 'all' &&
      !carrier.equipmentTypes.includes(filters.equipmentType)
    )
      return false;
    if (filters.relationshipType !== 'all' && relationship?.relationshipType !== filters.relationshipType)
      return false;
    if (filters.performanceRating !== 'all') {
      const rating = filters.performanceRating;
      const score = relationship?.performanceScore || 0;
      if (rating === 'excellent' && score < 95) return false;
      if (rating === 'good' && (score < 85 || score >= 95)) return false;
      if (rating === 'needs-improvement' && score >= 85) return false;
    }
    return true;
  });

  return (
    <div
      style={{
        background: 'rgba(0,0,0,0.6)',
        borderRadius: '20px',
        padding: '32px',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2
          style={{
            color: 'white',
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '8px',
          }}
        >
          🚛 Carrier Network Manager
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>
          Manage relationships with carriers onboarded through Enhanced Carrier Portal
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
        {[
          {
            id: 'network',
            label: 'My Network',
            icon: '🚛',
            count: carriersWithRelationships.filter(({carrier}) => carrier.status === 'active').length,
          },
          { id: 'invite', label: 'Invite Carriers', icon: '➕', count: null },
          { id: 'performance', label: 'Performance', icon: '📊', count: null },
          { id: 'analytics', label: 'Analytics', icon: '📈', count: null },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '16px 20px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background:
                activeTab === tab.id
                  ? 'linear-gradient(135deg, #14b8a6, #0d9488)'
                  : 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              border:
                activeTab === tab.id
                  ? 'none'
                  : '1px solid rgba(255, 255, 255, 0.2)',
              transform:
                activeTab === tab.id ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow:
                activeTab === tab.id ? '0 8px 25px rgba(0, 0, 0, 0.3)' : 'none',
            }}
          >
            {tab.icon} {tab.label}
            {tab.count !== null && tab.count > 0 && (
              <span
                style={{
                  marginLeft: '8px',
                  background: 'rgba(255,255,255,0.2)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* My Network Tab */}
      {activeTab === 'network' && (
        <div>
          {/* Filters */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '24px',
              background: 'rgba(255,255,255,0.1)',
              padding: '20px',
              borderRadius: '12px',
            }}
          >
            <div>
              <label
                style={{
                  color: 'white',
                  fontSize: '14px',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Status Filter
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  fontSize: '14px',
                }}
              >
                <option value='all'>All Status</option>
                <option value='active'>Active</option>
                <option value='inactive'>Inactive</option>
                <option value='pending'>Pending</option>
                <option value='suspended'>Suspended</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  color: 'white',
                  fontSize: '14px',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Equipment Type
              </label>
              <select
                value={filters.equipmentType}
                onChange={(e) =>
                  setFilters({ ...filters, equipmentType: e.target.value })
                }
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  fontSize: '14px',
                }}
              >
                <option value='all'>All Equipment</option>
                <option value='Dry Van'>Dry Van</option>
                <option value='Refrigerated'>Refrigerated</option>
                <option value='Flatbed'>Flatbed</option>
                <option value='Step Deck'>Step Deck</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  color: 'white',
                  fontSize: '14px',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Relationship Type
              </label>
              <select
                value={filters.relationshipType}
                onChange={(e) =>
                  setFilters({ ...filters, relationshipType: e.target.value })
                }
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  fontSize: '14px',
                }}
              >
                <option value='all'>All Types</option>
                <option value='preferred'>Preferred</option>
                <option value='standard'>Standard</option>
                <option value='trial'>Trial</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  color: 'white',
                  fontSize: '14px',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Performance Rating
              </label>
              <select
                value={filters.performanceRating}
                onChange={(e) =>
                  setFilters({ ...filters, performanceRating: e.target.value })
                }
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  fontSize: '14px',
                }}
              >
                <option value='all'>All Ratings</option>
                <option value='excellent'>Excellent (95+)</option>
                <option value='good'>Good (85-94)</option>
                <option value='needs-improvement'>
                  Needs Improvement (&lt;85)
                </option>
              </select>
            </div>
          </div>

          {/* Network Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '20px',
            }}
          >
            {filteredCarriers.map(({ carrier, relationship }) => (
              <div
                key={carrier.id}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => {
                  setSelectedCarrier(carrier);
                  setSelectedRelationship(relationship);
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow =
                    '0 12px 40px rgba(0,0,0,0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '16px',
                  }}
                >
                  <div>
                    <h3
                      style={{
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        marginBottom: '4px',
                      }}
                    >
                      {carrier.companyName}
                    </h3>
                    <p
                      style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '14px',
                      }}
                    >
                      {carrier.mcNumber} • {carrier.dotNumber}
                    </p>
                  </div>
                  <div
                    style={{
                      background: getStatusColor(carrier.status),
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                    }}
                  >
                    {carrier.status}
                  </div>
                </div>

                {/* Performance Metrics */}
                {carrier.status !== 'pending' && relationship && (
                  <div style={{ marginBottom: '16px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      <span
                        style={{
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '14px',
                        }}
                      >
                        Performance Score
                      </span>
                      <span
                        style={{
                          color: getPerformanceColor(relationship.performanceScore),
                          fontSize: '16px',
                          fontWeight: 'bold',
                        }}
                      >
                        {relationship.performanceScore}%
                      </span>
                    </div>

                    {/* Relationship Type Badge */}
                    <div style={{ marginBottom: '12px' }}>
                      <span
                        style={{
                          background: relationship.relationshipType === 'preferred' ? '#10b981' : 
                                     relationship.relationshipType === 'standard' ? '#3b82f6' : '#f59e0b',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '16px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                        }}
                      >
                        {relationship.relationshipType} Carrier
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '12px',
                        marginTop: '12px',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '12px',
                          }}
                        >
                          On-Time
                        </div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 'bold',
                          }}
                        >
                          {relationship.onTimePercentage}%
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '12px',
                          }}
                        >
                          Damage Rate
                        </div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 'bold',
                          }}
                        >
                          {relationship.damageRate}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Capacity */}
                <div style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '12px',
                      marginBottom: '8px',
                    }}
                  >
                    Fleet Capacity
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div>
                      <span
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: 'bold',
                        }}
                      >
                        {carrier.capacity.trucks}
                      </span>
                      <span
                        style={{
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '12px',
                          marginLeft: '4px',
                        }}
                      >
                        trucks
                      </span>
                    </div>
                    <div>
                      <span
                        style={{
                          color: '#10b981',
                          fontSize: '16px',
                          fontWeight: 'bold',
                        }}
                      >
                        {carrier.capacity.available}
                      </span>
                      <span
                        style={{
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '12px',
                          marginLeft: '4px',
                        }}
                      >
                        available
                      </span>
                    </div>
                  </div>
                </div>

                {/* Equipment Types */}
                <div style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '12px',
                      marginBottom: '8px',
                    }}
                  >
                    Equipment
                  </div>
                  <div
                    style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}
                  >
                    {carrier.equipmentTypes.map((type) => (
                      <span
                        key={type}
                        style={{
                          background: 'rgba(20,184,166,0.2)',
                          color: '#14b8a6',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '500',
                        }}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    >
                      {carrier.contactName}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '12px',
                      }}
                    >
                      {carrier.phone}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      style={{
                        background: 'rgba(59,130,246,0.2)',
                        border: '1px solid #3b82f6',
                        color: '#3b82f6',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      📞 Call
                    </button>
                    <button
                      style={{
                        background: 'rgba(34,197,94,0.2)',
                        border: '1px solid #22c55e',
                        color: '#22c55e',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      ✉️ Email
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite Carriers Tab */}
      {activeTab === 'invite' && (
        <div>
          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <h3
              style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              ➕ Invite New Carriers
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>
              All carriers must go through Enhanced Carrier Portal for standardized onboarding
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleInviteCarrier}
              style={{
                background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
              }}
            >
              🚛 Open Enhanced Carrier Portal
            </button>
            
            <div style={{ marginTop: '24px', color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
              <p>✅ All carriers go through standardized FMCSA verification</p>
              <p>📄 Uniform document collection and compliance checks</p>
              <p>🤝 Consistent onboarding process for all network partners</p>
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
          <div
            style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
            }}
          >
            <h4
              style={{ color: 'white', fontSize: '16px', marginBottom: '16px' }}
            >
              Onboarding Process
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
              }}
            >
              {[
                {
                  step: 1,
                  title: 'Verification',
                  desc: 'FMCSA & credit check',
                  status: 'completed',
                },
                {
                  step: 2,
                  title: 'Documentation',
                  desc: 'Insurance & permits',
                  status: 'in_progress',
                },
                {
                  step: 3,
                  title: 'Contracts',
                  desc: 'Rate agreements',
                  status: 'pending',
                },
                {
                  step: 4,
                  title: 'Integration',
                  desc: 'System setup',
                  status: 'pending',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  style={{
                    background:
                      item.status === 'completed'
                        ? 'rgba(34,197,94,0.2)'
                        : item.status === 'in_progress'
                          ? 'rgba(251,191,36,0.2)'
                          : 'rgba(107,114,128,0.2)',
                    border:
                      item.status === 'completed'
                        ? '1px solid #22c55e'
                        : item.status === 'in_progress'
                          ? '1px solid #fbbf24'
                          : '1px solid #6b7280',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      color:
                        item.status === 'completed'
                          ? '#22c55e'
                          : item.status === 'in_progress'
                            ? '#fbbf24'
                            : '#6b7280',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                    }}
                  >
                    {item.step}
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '4px',
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}
                  >
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Carriers */}
          <div>
            <h4
              style={{ color: 'white', fontSize: '18px', marginBottom: '16px' }}
            >
              Carriers in Onboarding Process
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '16px',
              }}
            >
              {carriers
                .filter((c) => c.status === 'pending')
                .map((carrier) => (
                  <div
                    key={carrier.id}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginBottom: '12px',
                      }}
                    >
                      <div>
                        <h5
                          style={{
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            marginBottom: '4px',
                          }}
                        >
                          {carrier.companyName}
                        </h5>
                        <p
                          style={{
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '14px',
                          }}
                        >
                          {carrier.contactName} • {carrier.phone}
                        </p>
                      </div>
                      <div
                        style={{
                          background: '#f59e0b',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                        }}
                      >
                        PENDING
                      </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <div
                        style={{
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '12px',
                          marginBottom: '4px',
                        }}
                      >
                        Equipment: {carrier.equipmentTypes.join(', ')}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '12px',
                        }}
                      >
                        Capacity: {carrier.capacity.trucks} trucks,{' '}
                        {carrier.capacity.drivers} drivers
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        style={{
                          flex: 1,
                          background:
                            'linear-gradient(135deg, #22c55e, #16a34a)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        Approve
                      </button>
                      <button
                        style={{
                          flex: 1,
                          background: 'rgba(239,68,68,0.2)',
                          color: '#ef4444',
                          border: '1px solid #ef4444',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        Review
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div>
          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <h3
              style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              📊 Network Performance Analytics
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>
              Track and analyze your carrier network performance
            </p>
          </div>

          {/* Performance KPIs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            {[
              {
                title: 'Average Performance',
                value: '91.5%',
                change: '+2.3%',
                icon: '📈',
                color: '#22c55e',
              },
              {
                title: 'On-Time Delivery',
                value: '94.2%',
                change: '+1.8%',
                icon: '⏰',
                color: '#3b82f6',
              },
              {
                title: 'Damage Rate',
                value: '0.35%',
                change: '-0.1%',
                icon: '📦',
                color: '#f59e0b',
              },
              {
                title: 'Active Carriers',
                value: carriers
                  .filter((c) => c.status === 'active')
                  .length.toString(),
                change: '+2',
                icon: '🚛',
                color: '#14b8a6',
              },
            ].map((kpi, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <div
                    style={{
                      background: `${kpi.color}20`,
                      borderRadius: '12px',
                      padding: '12px',
                      fontSize: '24px',
                    }}
                  >
                    {kpi.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '14px',
                      }}
                    >
                      {kpi.title}
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {kpi.value}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    color: kpi.change.startsWith('+') ? '#22c55e' : '#ef4444',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  {kpi.change} vs last month
                </div>
              </div>
            ))}
          </div>

          {/* Top Performers */}
          <div>
            <h4
              style={{ color: 'white', fontSize: '18px', marginBottom: '16px' }}
            >
              🏆 Top Performing Carriers
            </h4>
            <div
              style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '24px',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                  gap: '16px',
                  marginBottom: '16px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <div
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  Carrier
                </div>
                <div
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  Score
                </div>
                <div
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  On-Time
                </div>
                <div
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  Loads
                </div>
                <div
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  Revenue
                </div>
              </div>

              {carriers
                .filter((c) => c.status === 'active')
                .sort((a, b) => b.performanceScore - a.performanceScore)
                .slice(0, 5)
                .map((carrier, index) => (
                  <div
                    key={carrier.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                      gap: '16px',
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      borderBottom:
                        index < 4 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        {index === 0 && '🥇'} {index === 1 && '🥈'}{' '}
                        {index === 2 && '🥉'}
                        {carrier.companyName}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '12px',
                        }}
                      >
                        {carrier.mcNumber}
                      </div>
                    </div>
                    <div
                      style={{
                        color: getPerformanceColor(carrier.performanceScore),
                        fontSize: '14px',
                        fontWeight: 'bold',
                      }}
                    >
                      {carrier.performanceScore}%
                    </div>
                    <div style={{ color: 'white', fontSize: '14px' }}>
                      {carrier.onTimePercentage}%
                    </div>
                    <div style={{ color: 'white', fontSize: '14px' }}>
                      {Math.floor(Math.random() * 50) + 20}
                    </div>
                    <div
                      style={{
                        color: '#22c55e',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      ${(Math.random() * 50000 + 25000).toLocaleString()}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

