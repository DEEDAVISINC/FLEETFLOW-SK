'use client';

import { useEffect, useState } from 'react';

interface Lead {
  id: string;
  companyName: string;
  serviceCategory: string;
  estimatedValue: number;
  status: string;
  urgency: string;
  priority?: string;
}

export default function CRMDashboardInline() {
  console.info('🔥 CRMDashboardInline LOADED - INLINE STYLES!');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const mockLeads: Lead[] = [
    {
      id: 'SL-001',
      companyName: 'Midwest Manufacturing Corp',
      serviceCategory: 'Logistics',
      priority: 'hot',
      estimatedValue: 480000,
      status: 'proposal_sent',
      urgency: 'high',
    },
    {
      id: 'SL-002',
      companyName: 'Pacific Coast Imports LLC',
      serviceCategory: 'Warehousing',
      priority: 'urgent',
      estimatedValue: 360000,
      status: 'demo_scheduled',
      urgency: 'urgent',
    },
    {
      id: 'SL-003',
      companyName: 'Thunder Trucking LLC',
      serviceCategory: 'Dispatching',
      priority: 'high',
      estimatedValue: 72000,
      status: 'qualified',
      urgency: 'medium',
    },
    {
      id: 'SL-004',
      companyName: 'Urban Retail Solutions Inc',
      serviceCategory: 'Freight_Brokerage',
      priority: 'hot',
      estimatedValue: 750000,
      status: 'negotiating',
      urgency: 'high',
    },
    {
      id: 'SL-005',
      companyName: 'Southwest Food Distributors',
      serviceCategory: 'Supply_Chain_Consulting',
      priority: 'high',
      estimatedValue: 180000,
      status: 'contacted',
      urgency: 'medium',
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        console.info('🔄 CRMDashboardInline: Starting data fetch...');
        const response = await fetch(
          '/api/ai-flow/services-sales?tenantId=tenant-demo-123'
        );
        console.info('📡 CRMDashboardInline: Response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.info('📊 CRMDashboardInline: Data received:', data);

        if (data.success && data.data?.serviceLeads) {
          console.info(
            '✅ CRMDashboardInline: Setting API leads:',
            data.data.serviceLeads.length
          );
          setLeads(data.data.serviceLeads);
        } else {
          console.info(
            '🔄 CRMDashboardInline: Using mock data due to invalid API structure'
          );
          setLeads(mockLeads);
        }
      } catch (error) {
        console.error('❌ CRMDashboardInline: Fetch error:', error);
        console.info('🔄 CRMDashboardInline: Using fallback mock data');
        setLeads(mockLeads);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
          background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
          minHeight: '400px',
        }}
      >
        <div
          style={{
            fontSize: '18px',
            color: '#64748b',
            fontWeight: '600',
          }}
        >
          Loading CRM Intelligence...
        </div>
      </div>
    );
  }

  const totalPipeline = leads.reduce(
    (sum, lead) => sum + lead.estimatedValue,
    0
  );
  const hotLeads = leads.filter((lead) => lead.priority === 'hot').length;
  const avgDealSize = leads.length > 0 ? totalPipeline / leads.length : 0;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f1f5f9 0%, #dbeafe 100%)',
        padding: '24px',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1
            style={{
              background: 'linear-gradient(to right, #2563eb, #9333ea)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '36px',
              fontWeight: 'bold',
              margin: '0 0 8px 0',
            }}
          >
            CRM Lead Intelligence Dashboard
          </h1>
          <p
            style={{
              fontSize: '20px',
              color: '#4b5563',
              margin: '0',
            }}
          >
            AI-Powered Service Lead Management & Pipeline Analytics
          </p>
        </div>

        {/* Metrics Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          {/* Total Pipeline Card */}
          <div
            style={{
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'linear-gradient(to right, #3b82f6, #2563eb)',
              padding: '24px',
              color: 'white',
              boxShadow:
                '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#dbeafe',
                    margin: '0 0 4px 0',
                  }}
                >
                  Total Pipeline
                </p>
                <p
                  style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}
                >
                  ${(totalPipeline / 1000000).toFixed(1)}M
                </p>
              </div>
              <div
                style={{
                  borderRadius: '50%',
                  background: 'rgba(147, 197, 253, 0.2)',
                  padding: '12px',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                💰
              </div>
            </div>
          </div>

          {/* Active Leads Card */}
          <div
            style={{
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'linear-gradient(to right, #8b5cf6, #7c3aed)',
              padding: '24px',
              color: 'white',
              boxShadow:
                '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#ddd6fe',
                    margin: '0 0 4px 0',
                  }}
                >
                  Active Leads
                </p>
                <p
                  style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}
                >
                  {leads.length}
                </p>
              </div>
              <div
                style={{
                  borderRadius: '50%',
                  background: 'rgba(196, 181, 253, 0.2)',
                  padding: '12px',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                👥
              </div>
            </div>
          </div>

          {/* Hot Leads Card */}
          <div
            style={{
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'linear-gradient(to right, #f97316, #ea580c)',
              padding: '24px',
              color: 'white',
              boxShadow:
                '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#fed7aa',
                    margin: '0 0 4px 0',
                  }}
                >
                  Hot Leads
                </p>
                <p
                  style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}
                >
                  {hotLeads}
                </p>
              </div>
              <div
                style={{
                  borderRadius: '50%',
                  background: 'rgba(251, 191, 36, 0.2)',
                  padding: '12px',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                🔥
              </div>
            </div>
          </div>

          {/* Avg Deal Size Card */}
          <div
            style={{
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'linear-gradient(to right, #10b981, #059669)',
              padding: '24px',
              color: 'white',
              boxShadow:
                '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#a7f3d0',
                    margin: '0 0 4px 0',
                  }}
                >
                  Avg Deal Size
                </p>
                <p
                  style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}
                >
                  ${(avgDealSize / 1000).toFixed(0)}K
                </p>
              </div>
              <div
                style={{
                  borderRadius: '50%',
                  background: 'rgba(52, 211, 153, 0.2)',
                  padding: '12px',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                📊
              </div>
            </div>
          </div>
        </div>

        {/* Leads List */}
        <div
          style={{
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '24px',
            boxShadow:
              '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <h2
            style={{
              marginBottom: '24px',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#111827',
              margin: '0 0 24px 0',
            }}
          >
            Service Leads Pipeline
          </h2>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {leads.map((lead) => (
              <div
                key={lead.id}
                style={{
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  background: 'white',
                  padding: '16px',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#111827',
                        margin: '0 0 4px 0',
                      }}
                    >
                      {lead.companyName}
                    </h3>
                    <p
                      style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        margin: '0',
                      }}
                    >
                      {lead.serviceCategory}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                    }}
                  >
                    <div style={{ textAlign: 'right' }}>
                      <p
                        style={{
                          fontSize: '18px',
                          fontWeight: 'bold',
                          color: '#059669',
                          margin: '0 0 2px 0',
                        }}
                      >
                        ${(lead.estimatedValue / 1000).toFixed(0)}K
                      </p>
                      <p
                        style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          margin: '0',
                        }}
                      >
                        Estimated Value
                      </p>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          borderRadius: '9999px',
                          padding: '4px 8px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background:
                            lead.priority === 'hot'
                              ? '#fee2e2'
                              : lead.priority === 'urgent'
                                ? '#fed7aa'
                                : lead.priority === 'high'
                                  ? '#fef3c7'
                                  : '#f3f4f6',
                          color:
                            lead.priority === 'hot'
                              ? '#991b1b'
                              : lead.priority === 'urgent'
                                ? '#9a3412'
                                : lead.priority === 'high'
                                  ? '#92400e'
                                  : '#374151',
                        }}
                      >
                        {lead.priority?.toUpperCase() || 'STANDARD'}
                      </span>

                      <span
                        style={{
                          display: 'inline-flex',
                          borderRadius: '9999px',
                          padding: '4px 8px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background:
                            lead.status === 'negotiating'
                              ? '#dbeafe'
                              : lead.status === 'proposal_sent'
                                ? '#e9d5ff'
                                : lead.status === 'demo_scheduled'
                                  ? '#dcfce7'
                                  : '#f3f4f6',
                          color:
                            lead.status === 'negotiating'
                              ? '#1e40af'
                              : lead.status === 'proposal_sent'
                                ? '#7c2d12'
                                : lead.status === 'demo_scheduled'
                                  ? '#166534'
                                  : '#374151',
                        }}
                      >
                        {lead.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div
          style={{
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
            padding: '24px',
            color: 'white',
            boxShadow:
              '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <h3
            style={{
              marginBottom: '16px',
              fontSize: '20px',
              fontWeight: 'bold',
              margin: '0 0 16px 0',
            }}
          >
            🤖 AI Recommendations
          </h3>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '14px',
            }}
          >
            <p style={{ margin: '0' }}>
              • Focus on closing Urban Retail Solutions ($750K) - 90% win
              probability
            </p>
            <p style={{ margin: '0' }}>
              • Schedule follow-up with Midwest Manufacturing - proposal expires
              Dec 31st
            </p>
            <p style={{ margin: '0' }}>
              • Prioritize Pacific Coast Imports demo - decision timeline is 30
              days
            </p>
            <p style={{ margin: '0' }}>
              • Total pipeline value: ${(totalPipeline / 1000000).toFixed(1)}M
              across {leads.length} active opportunities
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



