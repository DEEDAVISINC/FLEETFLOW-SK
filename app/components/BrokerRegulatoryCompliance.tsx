'use client';

import { useEffect, useState } from 'react';

interface ComplianceItem {
  id: string;
  title: string;
  status: 'compliant' | 'warning' | 'violation' | 'pending';
  dueDate: string;
  lastUpdated: string;
  description: string;
  documents: string[];
  actionRequired?: string;
}

interface BrokerageAuthority {
  mcNumber: string;
  dotNumber: string;
  authorityType: string;
  status: 'active' | 'revoked' | 'suspended';
  issueDate: string;
  renewalDate: string;
  bondAmount: number;
  bondStatus: 'active' | 'expired' | 'pending';
  insuranceCarriers: string[];
}

interface BrokerRegulatoryComplianceProps {
  brokerId: string;
}

export default function BrokerRegulatoryCompliance({
  brokerId,
}: BrokerRegulatoryComplianceProps) {
  const [activeTab, setActiveTab] = useState<
    'authority' | 'compliance' | 'insurance' | 'filings'
  >('authority');
  const [authority, setAuthority] = useState<BrokerageAuthority | null>(null);
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock regulatory data
  useEffect(() => {
    const mockAuthority: BrokerageAuthority = {
      mcNumber: 'MC-789456',
      dotNumber: 'DOT-123789',
      authorityType: 'Property Broker',
      status: 'active',
      issueDate: '2023-01-15',
      renewalDate: '2025-01-15',
      bondAmount: 75000,
      bondStatus: 'active',
      insuranceCarriers: ['Liberty Mutual', 'Progressive Commercial'],
    };

    const mockComplianceItems: ComplianceItem[] = [
      {
        id: 'C001',
        title: 'Biennial Update (MCS-150)',
        status: 'compliant',
        dueDate: '2024-12-31',
        lastUpdated: '2024-01-15',
        description:
          'Required biennial update for motor carrier identification report',
        documents: ['MCS-150_2024.pdf', 'DOT_Confirmation.pdf'],
      },
      {
        id: 'C002',
        title: 'BOC-3 Process Agent Filing',
        status: 'warning',
        dueDate: '2024-12-20',
        lastUpdated: '2024-06-15',
        description: 'Designation of process agents for service of process',
        documents: ['BOC-3_Current.pdf'],
        actionRequired: 'Update process agent for 3 states',
      },
      {
        id: 'C003',
        title: 'Cargo Insurance Certificate',
        status: 'compliant',
        dueDate: '2025-03-01',
        lastUpdated: '2024-12-01',
        description: 'Proof of cargo insurance coverage ($100,000 minimum)',
        documents: ['Cargo_Insurance_2024.pdf', 'Certificate_Current.pdf'],
      },
      {
        id: 'C004',
        title: 'Surety Bond Renewal',
        status: 'pending',
        dueDate: '2025-01-15',
        lastUpdated: '2024-11-15',
        description: '$75,000 surety bond required for broker authority',
        documents: ['Bond_Application.pdf'],
        actionRequired: 'Complete renewal process - 30 days remaining',
      },
      {
        id: 'C005',
        title: 'FMCSA Registration Update',
        status: 'violation',
        dueDate: '2024-11-30',
        lastUpdated: '2024-10-15',
        description: 'Annual registration and fee payment',
        documents: [],
        actionRequired:
          'URGENT: Registration expired - immediate action required',
      },
    ];

    setAuthority(mockAuthority);
    setComplianceItems(mockComplianceItems);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return '#22c55e';
      case 'active':
        return '#22c55e';
      case 'warning':
        return '#f59e0b';
      case 'pending':
        return '#3b82f6';
      case 'violation':
        return '#ef4444';
      case 'expired':
        return '#ef4444';
      case 'revoked':
        return '#ef4444';
      case 'suspended':
        return '#f97316';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return '✅';
      case 'active':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'pending':
        return '🔄';
      case 'violation':
        return '❌';
      case 'expired':
        return '❌';
      case 'revoked':
        return '❌';
      case 'suspended':
        return '⏸️';
      default:
        return '❓';
    }
  };

  const getUrgencyLevel = (item: ComplianceItem) => {
    const dueDate = new Date(item.dueDate);
    const today = new Date();
    const daysUntilDue = Math.ceil(
      (dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
    );

    if (item.status === 'violation') return 'critical';
    if (daysUntilDue < 7) return 'urgent';
    if (daysUntilDue < 30) return 'warning';
    return 'normal';
  };

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
          ⚖️ Regulatory Compliance & Brokerage Authority
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>
          Manage your freight brokerage licensing, compliance requirements, and
          regulatory filings
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
        {[
          { id: 'authority', label: 'Brokerage Authority', icon: '🏛️' },
          { id: 'compliance', label: 'Compliance Dashboard', icon: '📋' },
          { id: 'insurance', label: 'Insurance & Bonds', icon: '🛡️' },
          { id: 'filings', label: 'Regulatory Filings', icon: '📄' },
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
                  ? 'linear-gradient(135deg, #dc2626, #b91c1c)'
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
          </button>
        ))}
      </div>

      {/* Brokerage Authority Tab */}
      {activeTab === 'authority' && authority && (
        <div>
          {/* Authority Status Card */}
          <div
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '32px',
              border: '1px solid rgba(255,255,255,0.2)',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '24px',
              }}
            >
              <div>
                <h3
                  style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                  }}
                >
                  {authority.authorityType} Authority
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>
                  Active federal operating authority for freight brokerage
                  operations
                </p>
              </div>
              <div
                style={{
                  background: getStatusColor(authority.status),
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '25px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                }}
              >
                {getStatusIcon(authority.status)} {authority.status}
              </div>
            </div>

            {/* Authority Details Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '24px',
              }}
            >
              <div>
                <div
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '14px',
                    marginBottom: '8px',
                  }}
                >
                  MC Number
                </div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  {authority.mcNumber}
                </div>
              </div>

              <div>
                <div
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '14px',
                    marginBottom: '8px',
                  }}
                >
                  DOT Number
                </div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  {authority.dotNumber}
                </div>
              </div>

              <div>
                <div
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '14px',
                    marginBottom: '8px',
                  }}
                >
                  Authority Issued
                </div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  {new Date(authority.issueDate).toLocaleDateString()}
                </div>
              </div>

              <div>
                <div
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '14px',
                    marginBottom: '8px',
                  }}
                >
                  Next Renewal
                </div>
                <div
                  style={{
                    color:
                      new Date(authority.renewalDate) <
                      new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                        ? '#f59e0b'
                        : 'white',
                    fontSize: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  {new Date(authority.renewalDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Bond Status Card */}
          <div
            style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
            }}
          >
            <h4
              style={{
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '16px',
              }}
            >
              🛡️ Surety Bond Status
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
              }}
            >
              <div>
                <div
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '14px',
                    marginBottom: '8px',
                  }}
                >
                  Bond Amount
                </div>
                <div
                  style={{
                    color: '#22c55e',
                    fontSize: '24px',
                    fontWeight: 'bold',
                  }}
                >
                  ${authority.bondAmount.toLocaleString()}
                </div>
              </div>

              <div>
                <div
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '14px',
                    marginBottom: '8px',
                  }}
                >
                  Bond Status
                </div>
                <div
                  style={{
                    color: getStatusColor(authority.bondStatus),
                    fontSize: '18px',
                    fontWeight: 'bold',
                  }}
                >
                  {getStatusIcon(authority.bondStatus)}{' '}
                  {authority.bondStatus.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            {[
              {
                title: 'FMCSA Portal',
                desc: 'Access FMCSA systems',
                color: '#3b82f6',
              },
              {
                title: 'Renew Authority',
                desc: 'Start renewal process',
                color: '#f59e0b',
              },
              {
                title: 'Update Information',
                desc: 'Modify registration',
                color: '#22c55e',
              },
              {
                title: 'Download Certificates',
                desc: 'Get official documents',
                color: '#6366f1',
              },
            ].map((action, index) => (
              <button
                key={index}
                style={{
                  background: `${action.color}20`,
                  border: `1px solid ${action.color}`,
                  color: action.color,
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = `${action.color}30`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = `${action.color}20`;
                }}
              >
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginBottom: '4px',
                  }}
                >
                  {action.title}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  {action.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Compliance Dashboard Tab */}
      {activeTab === 'compliance' && (
        <div>
          {/* Compliance Overview */}
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
                title: 'Critical Issues',
                count: complianceItems.filter(
                  (item) => item.status === 'violation'
                ).length,
                color: '#ef4444',
              },
              {
                title: 'Warnings',
                count: complianceItems.filter(
                  (item) => item.status === 'warning'
                ).length,
                color: '#f59e0b',
              },
              {
                title: 'Pending Items',
                count: complianceItems.filter(
                  (item) => item.status === 'pending'
                ).length,
                color: '#3b82f6',
              },
              {
                title: 'Compliant Items',
                count: complianceItems.filter(
                  (item) => item.status === 'compliant'
                ).length,
                color: '#22c55e',
              },
            ].map((stat, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    color: stat.color,
                    fontSize: '32px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                  }}
                >
                  {stat.count}
                </div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                  }}
                >
                  {stat.title}
                </div>
              </div>
            ))}
          </div>

          {/* Compliance Items List */}
          <div>
            <h4
              style={{ color: 'white', fontSize: '18px', marginBottom: '16px' }}
            >
              📋 Compliance Requirements
            </h4>
            <div style={{ display: 'grid', gap: '16px' }}>
              {complianceItems
                .sort((a, b) => {
                  const urgencyOrder = {
                    critical: 4,
                    urgent: 3,
                    warning: 2,
                    normal: 1,
                  };
                  return (
                    urgencyOrder[
                      getUrgencyLevel(b) as keyof typeof urgencyOrder
                    ] -
                    urgencyOrder[
                      getUrgencyLevel(a) as keyof typeof urgencyOrder
                    ]
                  );
                })
                .map((item) => {
                  const urgency = getUrgencyLevel(item);
                  return (
                    <div
                      key={item.id}
                      style={{
                        background:
                          urgency === 'critical'
                            ? 'rgba(239,68,68,0.15)'
                            : urgency === 'urgent'
                              ? 'rgba(251,191,36,0.15)'
                              : 'rgba(255,255,255,0.15)',
                        border:
                          urgency === 'critical'
                            ? '2px solid #ef4444'
                            : urgency === 'urgent'
                              ? '2px solid #fbbf24'
                              : '1px solid rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '16px',
                        padding: '24px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'start',
                          marginBottom: '16px',
                        }}
                      >
                        <div>
                          <h5
                            style={{
                              color: 'white',
                              fontSize: '18px',
                              fontWeight: 'bold',
                              marginBottom: '4px',
                            }}
                          >
                            {item.title}
                          </h5>
                          <p
                            style={{
                              color: 'rgba(255,255,255,0.7)',
                              fontSize: '14px',
                            }}
                          >
                            {item.description}
                          </p>
                        </div>
                        <div
                          style={{
                            background: getStatusColor(item.status),
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                          }}
                        >
                          {getStatusIcon(item.status)} {item.status}
                        </div>
                      </div>

                      {/* Due Date and Last Updated */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(150px, 1fr))',
                          gap: '16px',
                          marginBottom: '16px',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              color: 'rgba(255,255,255,0.7)',
                              fontSize: '12px',
                              marginBottom: '4px',
                            }}
                          >
                            Due Date
                          </div>
                          <div
                            style={{
                              color:
                                urgency === 'critical' || urgency === 'urgent'
                                  ? '#ef4444'
                                  : 'white',
                              fontSize: '14px',
                              fontWeight: 'bold',
                            }}
                          >
                            {new Date(item.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              color: 'rgba(255,255,255,0.7)',
                              fontSize: '12px',
                              marginBottom: '4px',
                            }}
                          >
                            Last Updated
                          </div>
                          <div style={{ color: 'white', fontSize: '14px' }}>
                            {new Date(item.lastUpdated).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {/* Action Required */}
                      {item.actionRequired && (
                        <div
                          style={{
                            background: 'rgba(239,68,68,0.2)',
                            border: '1px solid #ef4444',
                            borderRadius: '8px',
                            padding: '12px',
                            marginBottom: '16px',
                          }}
                        >
                          <div
                            style={{
                              color: '#ef4444',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              marginBottom: '4px',
                            }}
                          >
                            ⚠️ Action Required
                          </div>
                          <div
                            style={{
                              color: 'rgba(255,255,255,0.9)',
                              fontSize: '13px',
                            }}
                          >
                            {item.actionRequired}
                          </div>
                        </div>
                      )}

                      {/* Documents */}
                      <div style={{ marginBottom: '16px' }}>
                        <div
                          style={{
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '12px',
                            marginBottom: '8px',
                          }}
                        >
                          Documents ({item.documents.length})
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                          }}
                        >
                          {item.documents.map((doc, docIndex) => (
                            <span
                              key={docIndex}
                              style={{
                                background: 'rgba(34,197,94,0.2)',
                                color: '#22c55e',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '500',
                              }}
                            >
                              📄 {doc}
                            </span>
                          ))}
                          {item.documents.length === 0 && (
                            <span
                              style={{
                                background: 'rgba(239,68,68,0.2)',
                                color: '#ef4444',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '500',
                              }}
                            >
                              No documents uploaded
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {item.status === 'violation' && (
                          <button
                            style={{
                              background:
                                'linear-gradient(135deg, #ef4444, #dc2626)',
                              color: 'white',
                              border: 'none',
                              padding: '10px 16px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                            }}
                          >
                            🚨 Resolve Immediately
                          </button>
                        )}
                        <button
                          style={{
                            background: 'rgba(59,130,246,0.2)',
                            color: '#3b82f6',
                            border: '1px solid #3b82f6',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          📄 View Details
                        </button>
                        <button
                          style={{
                            background: 'rgba(34,197,94,0.2)',
                            color: '#22c55e',
                            border: '1px solid #22c55e',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          📤 Upload Documents
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Insurance & Bonds Tab */}
      {activeTab === 'insurance' && (
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
              🛡️ Insurance & Bonding Requirements
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>
              Manage your freight brokerage insurance and bonding requirements
            </p>
          </div>

          {/* Insurance Overview */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
              marginBottom: '32px',
            }}
          >
            {[
              {
                title: 'Surety Bond',
                amount: '$75,000',
                status: 'active',
                expiry: '2025-01-15',
                provider: 'Surety Partners Inc.',
                required: 'FMCSA Required',
              },
              {
                title: 'General Liability',
                amount: '$1,000,000',
                status: 'active',
                expiry: '2025-06-30',
                provider: 'Liberty Mutual',
                required: 'Business Protection',
              },
              {
                title: 'Errors & Omissions',
                amount: '$1,000,000',
                status: 'active',
                expiry: '2025-06-30',
                provider: 'Liberty Mutual',
                required: 'Professional Liability',
              },
              {
                title: 'Cargo Insurance',
                amount: '$100,000',
                status: 'warning',
                expiry: '2024-12-31',
                provider: 'Progressive Commercial',
                required: 'FMCSA Required',
              },
            ].map((insurance, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border:
                    insurance.status === 'warning'
                      ? '2px solid #f59e0b'
                      : '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '16px',
                  }}
                >
                  <div>
                    <h4
                      style={{
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginBottom: '4px',
                      }}
                    >
                      {insurance.title}
                    </h4>
                    <p
                      style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '12px',
                      }}
                    >
                      {insurance.required}
                    </p>
                  </div>
                  <div
                    style={{
                      background: getStatusColor(insurance.status),
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                    }}
                  >
                    {insurance.status}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      color: '#22c55e',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                    }}
                  >
                    {insurance.amount}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '14px',
                      marginBottom: '4px',
                    }}
                  >
                    Provider: {insurance.provider}
                  </div>
                  <div
                    style={{
                      color:
                        insurance.status === 'warning'
                          ? '#f59e0b'
                          : 'rgba(255,255,255,0.7)',
                      fontSize: '14px',
                    }}
                  >
                    Expires: {new Date(insurance.expiry).toLocaleDateString()}
                  </div>
                </div>

                <button
                  style={{
                    width: '100%',
                    background: 'rgba(59,130,246,0.2)',
                    color: '#3b82f6',
                    border: '1px solid #3b82f6',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  📄 View Certificate
                </button>
              </div>
            ))}
          </div>

          {/* Insurance Reminders */}
          <div
            style={{
              background: 'rgba(251,191,36,0.1)',
              border: '1px solid #fbbf24',
              borderRadius: '16px',
              padding: '24px',
            }}
          >
            <h4
              style={{
                color: '#fbbf24',
                fontSize: '18px',
                marginBottom: '16px',
              }}
            >
              ⏰ Upcoming Renewals & Reminders
            </h4>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      marginBottom: '4px',
                    }}
                  >
                    Cargo Insurance Renewal Due
                  </div>
                  <div
                    style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}
                  >
                    Progressive Commercial - 13 days remaining
                  </div>
                </div>
                <div>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Renew Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regulatory Filings Tab */}
      {activeTab === 'filings' && (
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
              📄 Regulatory Filings & Documentation
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>
              Submit and track all required regulatory filings and reports
            </p>
          </div>

          {/* Filing Categories */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '32px',
            }}
          >
            {[
              {
                title: 'FMCSA Filings',
                description:
                  'Federal Motor Carrier Safety Administration submissions',
                forms: ['MCS-150', 'UCR Registration', 'Process Agent Updates'],
                color: '#3b82f6',
              },
              {
                title: 'State Registrations',
                description: 'State-level transportation authority filings',
                forms: [
                  'IRP Registration',
                  'State Permits',
                  'Tax Registrations',
                ],
                color: '#22c55e',
              },
              {
                title: 'Financial Reports',
                description: 'Required financial disclosures and reports',
                forms: [
                  'Annual Reports',
                  'Financial Statements',
                  'Audit Results',
                ],
                color: '#f59e0b',
              },
              {
                title: 'Safety Filings',
                description: 'Safety and compliance documentation',
                forms: [
                  'Safety Audits',
                  'Violation Reports',
                  'Corrective Actions',
                ],
                color: '#ef4444',
              },
            ].map((category, index) => (
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
                    background: `${category.color}20`,
                    color: category.color,
                    padding: '12px',
                    borderRadius: '12px',
                    fontSize: '20px',
                    textAlign: 'center',
                    marginBottom: '16px',
                  }}
                >
                  📋
                </div>

                <h4
                  style={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                  }}
                >
                  {category.title}
                </h4>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '14px',
                    marginBottom: '16px',
                  }}
                >
                  {category.description}
                </p>

                <div style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '12px',
                      marginBottom: '8px',
                    }}
                  >
                    Common Forms:
                  </div>
                  {category.forms.map((form, formIndex) => (
                    <div
                      key={formIndex}
                      style={{
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: '13px',
                        marginBottom: '4px',
                        paddingLeft: '8px',
                      }}
                    >
                      • {form}
                    </div>
                  ))}
                </div>

                <button
                  style={{
                    width: '100%',
                    background: `${category.color}20`,
                    color: category.color,
                    border: `1px solid ${category.color}`,
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Manage Filings
                </button>
              </div>
            ))}
          </div>

          {/* Recent Filings */}
          <div
            style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '24px',
            }}
          >
            <h4
              style={{ color: 'white', fontSize: '18px', marginBottom: '16px' }}
            >
              📋 Recent Filing Activity
            </h4>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr',
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
                Filing Type
              </div>
              <div
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Date Submitted
              </div>
              <div
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Status
              </div>
              <div
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Actions
              </div>
            </div>

            {[
              {
                type: 'MCS-150 Biennial Update',
                date: '2024-01-15',
                status: 'approved',
                confirmationId: 'FMCSA-2024-001',
              },
              {
                type: 'UCR Registration Renewal',
                date: '2024-03-10',
                status: 'pending',
                confirmationId: 'UCR-2024-789',
              },
              {
                type: 'BOC-3 Process Agent Update',
                date: '2024-11-20',
                status: 'submitted',
                confirmationId: 'BOC3-2024-456',
              },
            ].map((filing, index) => (
              <div
                key={index}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr',
                  gap: '16px',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  borderBottom:
                    index < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                }}
              >
                <div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '2px',
                    }}
                  >
                    {filing.type}
                  </div>
                  <div
                    style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}
                  >
                    ID: {filing.confirmationId}
                  </div>
                </div>
                <div style={{ color: 'white', fontSize: '14px' }}>
                  {new Date(filing.date).toLocaleDateString()}
                </div>
                <div>
                  <span
                    style={{
                      background: getStatusColor(
                        filing.status === 'approved'
                          ? 'compliant'
                          : filing.status === 'pending'
                            ? 'pending'
                            : 'warning'
                      ),
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                    }}
                  >
                    {filing.status}
                  </span>
                </div>
                <div>
                  <button
                    style={{
                      background: 'rgba(59,130,246,0.2)',
                      color: '#3b82f6',
                      border: '1px solid #3b82f6',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
