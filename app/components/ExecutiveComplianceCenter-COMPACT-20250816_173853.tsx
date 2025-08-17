'use client';

import { useEffect, useState } from 'react';
import ComplianceAlertService, {
  ComplianceAlert,
  ComplianceItem,
} from '../services/ComplianceAlertService';

interface BrokerageComplianceItem {
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

interface ExecutiveComplianceCenterProps {
  userId: string;
  userRole: string;
}

export default function ExecutiveComplianceCenter({
  userId,
  userRole,
}: ExecutiveComplianceCenterProps) {
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([]);
  const [brokerageItems, setBrokerageItems] = useState<BrokerageComplianceItem[]>([]);
  const [authority, setAuthority] = useState<BrokerageAuthority | null>(null);
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [selectedTab, setSelectedTab] = useState<
    'authority' | 'compliance' | 'insurance' | 'filings'
  >('authority');

  useEffect(() => {
    const service = ComplianceAlertService.getInstance();
    setComplianceItems(service.getComplianceItems());
    setAlerts(service.getComplianceAlerts());
    setSummary(service.getComplianceSummary());

    // Load detailed brokerage authority data
    const mockAuthority: BrokerageAuthority = {
      mcNumber: 'MC-123456',
      dotNumber: 'DOT-7654321',
      authorityType: 'Property Broker',
      status: 'active',
      issueDate: '2024-01-01',
      renewalDate: '2026-01-01',
      bondAmount: 75000,
      bondStatus: 'active',
      insuranceCarriers: ['Liberty Mutual', 'Progressive Commercial'],
    };

    const mockBrokerageItems: BrokerageComplianceItem[] = [
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
    setBrokerageItems(mockBrokerageItems);
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

  const getUrgencyLevel = (item: BrokerageComplianceItem) => {
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

  // Only show to executives/admins
  if (!['Admin', 'Manager', 'Owner', 'President'].includes(userRole)) {
    return (
      <div
        style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔒</div>
        <h3 style={{ color: '#dc2626', marginBottom: '6px', fontSize: '16px' }}>
          Executive Access Only
        </h3>
        <p style={{ color: 'rgba(220, 38, 38, 0.8)', margin: 0, fontSize: '14px' }}>
          Regulatory compliance management is restricted to executive roles.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'rgba(0,0,0,0.6)',
        borderRadius: '16px',
        padding: '20px',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <h2
          style={{
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '4px',
          }}
        >
          ⚖️ Regulatory Compliance & Brokerage Authority
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
          Manage your freight brokerage licensing, compliance requirements, and
          regulatory filings
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
        {[
          { id: 'authority', label: 'Authority', icon: '🏛️' },
          { id: 'compliance', label: 'Compliance', icon: '📋' },
          { id: 'insurance', label: 'Insurance', icon: '🛡️' },
          { id: 'filings', label: 'Filings', icon: '📄' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background:
                selectedTab === tab.id
                  ? 'linear-gradient(135deg, #dc2626, #b91c1c)'
                  : 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              border:
                selectedTab === tab.id
                  ? 'none'
                  : '1px solid rgba(255, 255, 255, 0.2)',
              transform:
                selectedTab === tab.id ? 'translateY(-1px)' : 'translateY(0)',
              boxShadow:
                selectedTab === tab.id ? '0 4px 15px rgba(0, 0, 0, 0.3)' : 'none',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Brokerage Authority Tab */}
      {selectedTab === 'authority' && authority && (
        <div>
          {/* Authority Status Card */}
          <div
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '16px',
              border: '1px solid rgba(255,255,255,0.2)',
              marginBottom: '12px',
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
                <h3
                  style={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginBottom: '4px',
                  }}
                >
                  {authority.authorityType} Authority
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                  Active federal operating authority for freight brokerage operations
                </p>
              </div>
              <div
                style={{
                  background: getStatusColor(authority.status),
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '11px',
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
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
              }}
            >
              <div>
                <div
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '11px',
                    marginBottom: '4px',
                  }}
                >
                  MC Number
                </div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '14px',
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
                    fontSize: '11px',
                    marginBottom: '4px',
                  }}
                >
                  DOT Number
                </div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '14px',
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
                    fontSize: '11px',
                    marginBottom: '4px',
                  }}
                >
                  Authority Issued
                </div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '14px',
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
                    fontSize: '11px',
                    marginBottom: '4px',
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
                    fontSize: '14px',
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
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '12px',
            }}
          >
            <h4
              style={{
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '12px',
              }}
            >
              🛡️ Surety Bond Status
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '16px',
              }}
            >
              <div>
                <div
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '11px',
                    marginBottom: '4px',
                  }}
                >
                  Bond Amount
                </div>
                <div
                  style={{
                    color: '#22c55e',
                    fontSize: '16px',
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
                    fontSize: '11px',
                    marginBottom: '4px',
                  }}
                >
                  Bond Status
                </div>
                <div
                  style={{
                    color: getStatusColor(authority.bondStatus),
                    fontSize: '14px',
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '8px',
            }}
          >
            {[
              { title: 'FMCSA Portal', color: '#3b82f6' },
              { title: 'Renew Authority', color: '#f59e0b' },
              { title: 'Update Info', color: '#22c55e' },
              { title: 'Certificates', color: '#6366f1' },
            ].map((action, index) => (
              <button
                key={index}
                style={{
                  background: `${action.color}20`,
                  border: `1px solid ${action.color}`,
                  color: action.color,
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: '600',
                }}
              >
                {action.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Compliance Dashboard Tab */}
      {selectedTab === 'compliance' && (
        <div>
          {/* Compliance Overview */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            {[
              {
                title: 'Critical',
                count: brokerageItems.filter((item) => item.status === 'violation').length,
                color: '#ef4444',
              },
              {
                title: 'Warnings',
                count: brokerageItems.filter((item) => item.status === 'warning').length,
                color: '#f59e0b',
              },
              {
                title: 'Pending',
                count: brokerageItems.filter((item) => item.status === 'pending').length,
                color: '#3b82f6',
              },
              {
                title: 'Compliant',
                count: brokerageItems.filter((item) => item.status === 'compliant').length,
                color: '#22c55e',
              },
            ].map((stat, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '12px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    color: stat.color,
                    fontSize: '20px',
                    fontWeight: 'bold',
                    marginBottom: '4px',
                  }}
                >
                  {stat.count}
                </div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: '600',
                  }}
                >
                  {stat.title}
                </div>
              </div>
            ))}
          </div>

          {/* Compliance Items List - Condensed */}
          <div>
            <h4 style={{ color: 'white', fontSize: '14px', marginBottom: '12px' }}>
              📋 Compliance Requirements
            </h4>
            <div style={{ display: 'grid', gap: '10px' }}>
              {brokerageItems
                .sort((a, b) => {
                  const urgencyOrder = { critical: 4, urgent: 3, warning: 2, normal: 1 };
                  return urgencyOrder[getUrgencyLevel(b) as keyof typeof urgencyOrder] -
                         urgencyOrder[getUrgencyLevel(a) as keyof typeof urgencyOrder];
                })
                .map((item) => {
                  const urgency = getUrgencyLevel(item);
                  return (
                    <div
                      key={item.id}
                      style={{
                        background: urgency === 'critical' ? 'rgba(239,68,68,0.15)' :
                                   urgency === 'urgent' ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.15)',
                        border: urgency === 'critical' ? '2px solid #ef4444' :
                               urgency === 'urgent' ? '2px solid #fbbf24' : '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '12px',
                        padding: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                        <div>
                          <h5 style={{ color: 'white', fontSize: '13px', fontWeight: 'bold', marginBottom: '2px' }}>
                            {item.title}
                          </h5>
                          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>
                            Due: {new Date(item.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div
                          style={{
                            background: getStatusColor(item.status),
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '16px',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                          }}
                        >
                          {getStatusIcon(item.status)} {item.status}
                        </div>
                      </div>

                      {item.actionRequired && (
                        <div
                          style={{
                            background: 'rgba(239,68,68,0.2)',
                            border: '1px solid #ef4444',
                            borderRadius: '6px',
                            padding: '6px',
                            marginBottom: '8px',
                          }}
                        >
                          <div style={{ color: '#ef4444', fontSize: '10px', fontWeight: 'bold' }}>
                            ⚠️ {item.actionRequired}
                          </div>
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '6px' }}>
                        {item.status === 'violation' && (
                          <button
                            style={{
                              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                              color: 'white',
                              border: 'none',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              fontSize: '10px',
                              fontWeight: '600',
                              cursor: 'pointer',
                            }}
                          >
                            🚨 Resolve
                          </button>
                        )}
                        <button
                          style={{
                            background: 'rgba(59,130,246,0.2)',
                            color: '#3b82f6',
                            border: '1px solid #3b82f6',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '10px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          Details
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
      {selectedTab === 'insurance' && (
        <div>
          <div style={{ marginBottom: '16px', textAlign: 'center' }}>
            <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
              🛡️ Insurance & Bonding Requirements
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            {[
              { title: 'Surety Bond', amount: '$75,000', status: 'active', expiry: '2025-01-15', provider: 'Surety Partners' },
              { title: 'General Liability', amount: '$1M', status: 'active', expiry: '2025-06-30', provider: 'Liberty Mutual' },
              { title: 'Errors & Omissions', amount: '$1M', status: 'active', expiry: '2025-06-30', provider: 'Liberty Mutual' },
              { title: 'Cargo Insurance', amount: '$100K', status: 'warning', expiry: '2024-12-31', provider: 'Progressive' },
            ].map((insurance, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: '12px',
                  padding: '12px',
                  border: insurance.status === 'warning' ? '2px solid #f59e0b' : '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <h4 style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                    {insurance.title}
                  </h4>
                  <div
                    style={{
                      background: getStatusColor(insurance.status),
                      color: 'white',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '9px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                    }}
                  >
                    {insurance.status}
                  </div>
                </div>

                <div style={{ marginBottom: '8px' }}>
                  <div style={{ color: '#22c55e', fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                    {insurance.amount}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', marginBottom: '2px' }}>
                    Provider: {insurance.provider}
                  </div>
                  <div
                    style={{
                      color: insurance.status === 'warning' ? '#f59e0b' : 'rgba(255,255,255,0.7)',
                      fontSize: '10px',
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
                    padding: '6px',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  📄 View Certificate
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regulatory Filings Tab */}
      {selectedTab === 'filings' && (
        <div>
          <div style={{ marginBottom: '16px', textAlign: 'center' }}>
            <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
              📄 Regulatory Filings & Documentation
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            {[
              { title: 'FMCSA Filings', forms: ['MCS-150', 'UCR Registration'], color: '#3b82f6' },
              { title: 'State Registrations', forms: ['IRP Registration', 'State Permits'], color: '#22c55e' },
              { title: 'Financial Reports', forms: ['Annual Reports', 'Audit Results'], color: '#f59e0b' },
              { title: 'Safety Filings', forms: ['Safety Audits', 'Violation Reports'], color: '#ef4444' },
            ].map((category, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: '12px',
                  padding: '12px',
                }}
              >
                <div
                  style={{
                    background: `${category.color}20`,
                    color: category.color,
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    textAlign: 'center',
                    marginBottom: '8px',
                  }}
                >
                  📋
                </div>

                <h4 style={{ color: 'white', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                  {category.title}
                </h4>

                <div style={{ marginBottom: '8px' }}>
                  {category.forms.map((form, formIndex) => (
                    <div
                      key={formIndex}
                      style={{
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: '10px',
                        marginBottom: '2px',
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
                    padding: '6px',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Manage
                </button>
              </div>
            ))}
          </div>

          {/* Recent Filings - Compact */}
          <div
            style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '12px',
            }}
          >
            <h4 style={{ color: 'white', fontSize: '12px', marginBottom: '8px' }}>
              📋 Recent Filing Activity
            </h4>

            {[
              { type: 'MCS-150 Biennial Update', date: '2024-01-15', status: 'approved' },
              { type: 'UCR Registration Renewal', date: '2024-03-10', status: 'pending' },
              { type: 'BOC-3 Process Agent Update', date: '2024-11-20', status: 'submitted' },
            ].map((filing, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '6px',
                  paddingBottom: '6px',
                  borderBottom: index < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                }}
              >
                <div>
                  <div style={{ color: 'white', fontSize: '11px', fontWeight: '600' }}>
                    {filing.type}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '9px' }}>
                    {new Date(filing.date).toLocaleDateString()}
                  </div>
                </div>
                <span
                  style={{
                    background: getStatusColor(
                      filing.status === 'approved' ? 'compliant' :
                      filing.status === 'pending' ? 'pending' : 'warning'
                    ),
                    color: 'white',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontSize: '9px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                  }}
                >
                  {filing.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}