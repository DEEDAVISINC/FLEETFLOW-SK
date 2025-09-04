'use client';

import { useState } from 'react';

interface Lead {
  id: string;
  companyName: string;
  serviceCategory: string;
  estimatedValue: number;
  priority: 'hot' | 'urgent' | 'high' | 'standard';
  status: string;
  lastContact: string;
  nextFollowUp: string;
  winProbability: number;
}

export default function AIHubCRMDashboard() {
  console.info('🚀 AIHubCRMDashboard LOADED - MATCHES AI HUB STYLING');

  const [leads] = useState<Lead[]>([]);

  const totalPipeline = leads.reduce(
    (sum, lead) => sum + lead.estimatedValue,
    0
  );
  const hotLeads = leads.filter((lead) => lead.priority === 'hot').length;
  const avgDealSize = leads.length > 0 ? totalPipeline / leads.length : 0;

  const handleContactLead = (lead: Lead) => {
    alert(`📞 Contacting ${lead.companyName}`);
    console.info(`Contacting lead: ${lead.companyName}`);
  };

  const handleScheduleDemo = (lead: Lead) => {
    alert(`📅 Scheduling demo for ${lead.companyName}`);
    console.info(`Scheduling demo for lead: ${lead.companyName}`);
  };

  const handleSendProposal = (lead: Lead) => {
    alert(`📄 Sending proposal to ${lead.companyName}`);
    console.info(`Sending proposal to lead: ${lead.companyName}`);
  };

  return (
    <div style={{ color: '#fff' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2
          style={{
            background: 'linear-gradient(135deg, #ff1493, #ec4899, #db2777)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '8px',
          }}
        >
          CRM Lead Intelligence Dashboard
        </h2>
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '18px',
            fontWeight: '500',
          }}
        >
          AI-Powered Service Lead Management & Pipeline Analytics
        </p>
      </div>

      {/* KPI Cards - Match AI Hub Style */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        {[
          {
            label: 'Total Pipeline',
            value: `$${(totalPipeline / 1000000).toFixed(1)}M`,
            color: '#10b981',
            icon: '💰',
            status: 'ACTIVE',
          },
          {
            label: 'Active Leads',
            value: leads.length.toString(),
            color: '#f59e0b',
            icon: '👥',
            status: 'TRACKING',
          },
          {
            label: 'Hot Leads',
            value: hotLeads.toString(),
            color: '#dc2626',
            icon: '🔥',
            status: 'PRIORITY',
          },
          {
            label: 'Avg Deal Size',
            value: `$${(avgDealSize / 1000).toFixed(0)}K`,
            color: '#3b82f6',
            icon: '📊',
            status: 'METRIC',
          },
        ].map((kpi, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              borderRadius: '8px',
              padding: '12px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '24px',
                marginBottom: '4px',
              }}
            >
              {kpi.icon}
            </div>
            <div
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: kpi.color,
                marginBottom: '2px',
              }}
            >
              {kpi.value}
            </div>
            <div
              style={{
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '4px',
              }}
            >
              {kpi.label}
            </div>
            <div
              style={{
                fontSize: '8px',
                color: 'rgba(255, 255, 255, 0.6)',
                fontWeight: '600',
                letterSpacing: '0.5px',
              }}
            >
              {kpi.status}
            </div>
          </div>
        ))}
      </div>

      {/* Leads List */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          marginBottom: '24px',
        }}
      >
        <h3
          style={{
            color: '#fff',
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '16px',
          }}
        >
          Service Leads Pipeline
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {leads.map((lead) => (
            <div
              key={lead.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(5px)',
                borderRadius: '8px',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
            >
              <div style={{ flex: 1 }}>
                <h4
                  style={{
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '4px',
                  }}
                >
                  {lead.companyName}
                </h4>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                  }}
                >
                  {lead.serviceCategory}
                </p>
              </div>

              <div
                style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
              >
                <div style={{ textAlign: 'right' }}>
                  <p
                    style={{
                      color: '#10b981',
                      fontSize: '16px',
                      fontWeight: 'bold',
                    }}
                  >
                    ${(lead.estimatedValue / 1000).toFixed(0)}K
                  </p>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '12px',
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
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '12px',
                      padding: '2px 8px',
                      fontSize: '10px',
                      fontWeight: '600',
                      ...(lead.priority === 'hot'
                        ? {
                            backgroundColor: 'rgba(220, 38, 38, 0.2)',
                            color: '#fca5a5',
                            border: '1px solid rgba(220, 38, 38, 0.3)',
                          }
                        : lead.priority === 'urgent'
                          ? {
                              backgroundColor: 'rgba(249, 115, 22, 0.2)',
                              color: '#fed7aa',
                              border: '1px solid rgba(249, 115, 22, 0.3)',
                            }
                          : {
                              backgroundColor: 'rgba(59, 130, 246, 0.2)',
                              color: '#93c5fd',
                              border: '1px solid rgba(59, 130, 246, 0.3)',
                            }),
                    }}
                  >
                    {lead.priority.toUpperCase()}
                  </span>

                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '12px',
                      padding: '2px 8px',
                      fontSize: '10px',
                      fontWeight: '600',
                      backgroundColor: 'rgba(168, 85, 247, 0.2)',
                      color: '#c4b5fd',
                      border: '1px solid rgba(168, 85, 247, 0.3)',
                    }}
                  >
                    {lead.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <button
                    onClick={() => handleContactLead(lead)}
                    style={{
                      background: '#3b82f6',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#2563eb';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#3b82f6';
                    }}
                  >
                    📞 Contact
                  </button>
                  <button
                    onClick={() => handleScheduleDemo(lead)}
                    style={{
                      background: '#10b981',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#059669';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#10b981';
                    }}
                  >
                    📅 Demo
                  </button>
                  <button
                    onClick={() => handleSendProposal(lead)}
                    style={{
                      background: '#8b5cf6',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#7c3aed';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#8b5cf6';
                    }}
                  >
                    📄 Proposal
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          marginBottom: '24px',
        }}
      >
        <h3
          style={{
            color: '#fff',
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '16px',
          }}
        >
          Quick Actions
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
          }}
        >
          <button
            onClick={() => {
              console.info('🔍 Analyzing all leads...');
              alert('AI Analysis started for all leads');
            }}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '16px',
              cursor: 'pointer',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'transform 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🤖</div>
            <div>AI Lead Analysis</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>
              Analyze all leads with AI
            </div>
          </button>

          <button
            onClick={() => {
              console.info('📊 Generating pipeline report...');
              alert('Pipeline report generated');
            }}
            style={{
              background: 'linear-gradient(135deg, #10b981, #047857)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '16px',
              cursor: 'pointer',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'transform 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
            <div>Generate Report</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>
              Create pipeline report
            </div>
          </button>

          <button
            onClick={() => {
              console.info('📧 Starting bulk email campaign...');
              alert('Bulk email campaign started');
            }}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '16px',
              cursor: 'pointer',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'transform 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📧</div>
            <div>Bulk Email</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>
              Send campaign to leads
            </div>
          </button>
        </div>
      </div>

      {/* AI Recommendations */}
      <div
        style={{
          background:
            'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15))',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          color: '#fff',
        }}
      >
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '12px',
          }}
        >
          🤖 AI Recommendations
        </h3>

        <div
          style={{
            fontSize: '14px',
            lineHeight: '1.6',
            color: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          <p style={{ marginBottom: '8px' }}>
            • Focus on closing retail client ($750K) - 90% win probability
          </p>
          <p style={{ marginBottom: '8px' }}>
            • Schedule follow-up with manufacturing client - proposal expires
            Dec 31st
          </p>
          <p style={{ marginBottom: '8px' }}>
            • Prioritize import company demo - decision timeline is 30 days
          </p>
          <p>
            • Total pipeline value: ${(totalPipeline / 1000000).toFixed(1)}M
            across {leads.length} active opportunities
          </p>
        </div>
      </div>
    </div>
  );
}
