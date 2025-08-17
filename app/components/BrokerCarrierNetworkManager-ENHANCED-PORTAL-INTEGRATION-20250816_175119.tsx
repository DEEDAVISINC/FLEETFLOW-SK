'use client';

import { useEffect, useState } from 'react';

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
  }, [brokerId]);

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

          {/* Carrier Cards */}
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
                  setSelectedRelationship(relationship || null);
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

                {/* Equipment & Capacity */}
                <div style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      marginBottom: '8px',
                    }}
                  >
                    {carrier.equipmentTypes.map((type, index) => (
                      <span
                        key={index}
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
                  <div
                    style={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '12px',
                    }}
                  >
                    {carrier.capacity.trucks} trucks • {carrier.capacity.available} available
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    style={{
                      flex: 1,
                      background: 'rgba(20,184,166,0.2)',
                      color: '#14b8a6',
                      border: '1px solid #14b8a6',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    📞 Contact
                  </button>
                  <button
                    style={{
                      flex: 1,
                      background: 'rgba(59,130,246,0.2)',
                      color: '#3b82f6',
                      border: '1px solid #3b82f6',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    📊 Details
                  </button>
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

          {/* Performance Summary Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            {[
              { label: 'Average Performance', value: '91%', color: '#10b981' },
              { label: 'On-Time Delivery', value: '95%', color: '#3b82f6' },
              { label: 'Total Loads', value: '245', color: '#f59e0b' },
              { label: 'Network Revenue', value: '$692K', color: '#8b5cf6' },
            ].map((metric, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '20px',
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <div
                  style={{
                    color: metric.color,
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                  }}
                >
                  {metric.value}
                </div>
                <div
                  style={{
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '14px',
                  }}
                >
                  {metric.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>
              📈 Performance analytics coming soon
            </p>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
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
              📈 Advanced Analytics
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>
              Deep dive into carrier relationship analytics and insights
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>
              📊 Advanced analytics dashboard coming soon
            </p>
          </div>
        </div>
      )}
    </div>
  );
}