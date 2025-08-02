'use client';

import { useEffect, useState } from 'react';
import SimplePhoneDialer from './SimplePhoneDialer';

export default function SalesDivisionPlatform() {
  const [activeView, setActiveView] = useState('dashboard');
  const [salesTeamMembers, setSalesTeamMembers] = useState<any[]>([]);
  const [customerServiceQueue, setCustomerServiceQueue] = useState<any[]>([]);
  const [logisticsSalesOpportunities, setLogisticsSalesOpportunities] =
    useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [salesMetrics, setSalesMetrics] = useState<any>({});
  const [activeCalls, setActiveCalls] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);

  // Initialize sample data
  useEffect(() => {
    setSalesTeamMembers([
      {
        id: 'ST-001',
        name: 'Sarah Mitchell',
        role: 'Senior Logistics Sales Specialist',
        department: 'Logistics Sales',
        performance: 'Excellent',
        activeCalls: 3,
        todayQuotes: 12,
        weeklyTarget: 50,
        weeklyProgress: 38,
        specialties: ['3PL Services', 'Warehousing', 'Supply Chain'],
        aiScore: 94,
        status: 'Available',
      },
      {
        id: 'ST-002',
        name: 'Marcus Rodriguez',
        role: 'Customer Service Manager',
        department: 'Customer Service',
        performance: 'Outstanding',
        activeCalls: 2,
        todayTickets: 18,
        weeklyTarget: 85,
        weeklyProgress: 72,
        specialties: ['Issue Resolution', 'Account Management', 'Retention'],
        aiScore: 91,
        status: 'On Call',
      },
      {
        id: 'ST-003',
        name: 'Jennifer Chen',
        role: 'Transportation Sales Executive',
        department: 'Logistics Sales',
        performance: 'Excellent',
        activeCalls: 1,
        todayQuotes: 8,
        weeklyTarget: 40,
        weeklyProgress: 31,
        specialties: ['LTL', 'FTL', 'Expedited Services'],
        aiScore: 88,
        status: 'Available',
      },
      {
        id: 'ST-004',
        name: 'David Thompson',
        role: 'Customer Success Specialist',
        department: 'Customer Service',
        performance: 'Good',
        activeCalls: 4,
        todayTickets: 14,
        weeklyTarget: 70,
        weeklyProgress: 58,
        specialties: ['Onboarding', 'Training', 'Support'],
        aiScore: 85,
        status: 'Busy',
      },
    ]);

    setCustomerServiceQueue([
      {
        id: 'CS-001',
        customerName: 'Walmart Distribution',
        issueType: 'Delivery Delay',
        priority: 'High',
        waitTime: '00:03:45',
        assignedTo: 'Marcus Rodriguez',
        aiRecommendation: 'Proactive communication with ETA update',
        sentiment: 'Concerned',
        accountValue: '$2.4M',
      },
      {
        id: 'CS-002',
        customerName: 'Amazon Logistics',
        issueType: 'Rate Inquiry',
        priority: 'Medium',
        waitTime: '00:01:22',
        assignedTo: 'Available',
        aiRecommendation: 'Upsell opportunity for premium services',
        sentiment: 'Neutral',
        accountValue: '$1.8M',
      },
      {
        id: 'CS-003',
        customerName: 'Target Supply Chain',
        issueType: 'Service Complaint',
        priority: 'High',
        waitTime: '00:07:18',
        assignedTo: 'David Thompson',
        aiRecommendation: 'Escalate to management, retention risk',
        sentiment: 'Frustrated',
        accountValue: '$3.1M',
      },
    ]);

    setLogisticsSalesOpportunities([
      {
        id: 'LSO-001',
        prospectName: 'Home Depot Logistics',
        opportunityType: 'New Account',
        serviceNeeded: '3PL Warehousing',
        estimatedValue: '$4.2M',
        probability: '75%',
        stage: 'Proposal Sent',
        assignedTo: 'Sarah Mitchell',
        aiScore: 92,
        nextAction: 'Follow-up call scheduled',
        timeline: '2 weeks',
      },
      {
        id: 'LSO-002',
        prospectName: 'Costco Distribution',
        opportunityType: 'Service Expansion',
        serviceNeeded: 'Cross-Docking',
        estimatedValue: '$1.8M',
        probability: '60%',
        stage: 'Needs Analysis',
        assignedTo: 'Jennifer Chen',
        aiScore: 78,
        nextAction: 'Site visit required',
        timeline: '3 weeks',
      },
      {
        id: 'LSO-003',
        prospectName: 'Best Buy Supply Chain',
        opportunityType: 'New Account',
        serviceNeeded: 'LTL Network',
        estimatedValue: '$2.9M',
        probability: '45%',
        stage: 'Initial Contact',
        assignedTo: 'Sarah Mitchell',
        aiScore: 68,
        nextAction: 'Discovery meeting',
        timeline: '4 weeks',
      },
    ]);

    setAiInsights([
      {
        id: 'AI-001',
        type: 'Opportunity Alert',
        title: 'High-Value Prospect Identified',
        message:
          "Lowe's Distribution showing increased freight activity. Recommend immediate outreach.",
        priority: 'High',
        actionable: true,
        confidence: 94,
      },
      {
        id: 'AI-002',
        type: 'Performance Insight',
        title: 'Team Performance Trend',
        message:
          'Logistics Sales team 23% above target this month. Customer Service resolution time improved by 15%.',
        priority: 'Medium',
        actionable: false,
        confidence: 89,
      },
      {
        id: 'AI-003',
        type: 'Risk Alert',
        title: 'Account Retention Risk',
        message:
          "Macy's account showing decreased activity. Recommend retention strategy.",
        priority: 'High',
        actionable: true,
        confidence: 87,
      },
    ]);

    setSalesMetrics({
      totalRevenue: '$12.4M',
      monthlyGrowth: '+18.5%',
      activeOpportunities: 47,
      conversionRate: '34.2%',
      avgDealSize: '$485K',
      customerSatisfaction: '4.8/5',
      responseTime: '2.3 min',
      resolutionRate: '94.7%',
    });

    setActiveCalls([
      {
        id: 'CALL-001',
        type: 'Outbound Sales',
        contact: 'Home Depot - Mike Johnson',
        duration: '00:12:34',
        status: 'Active',
        agent: 'Sarah Mitchell',
        aiSentiment: 'Positive',
        dealPotential: '$4.2M',
      },
      {
        id: 'CALL-002',
        type: 'Customer Service',
        contact: 'Walmart - Lisa Chen',
        duration: '00:08:45',
        status: 'On Hold',
        agent: 'Marcus Rodriguez',
        aiSentiment: 'Concerned',
        issueType: 'Delivery Delay',
      },
    ]);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setNotifications((prev) => [
        {
          id: Date.now(),
          type: 'success',
          message: 'New opportunity qualified by AI Flow',
          timestamp: new Date().toISOString(),
        },
        ...prev.slice(0, 4),
      ]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const renderDashboard = () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px',
      }}
    >
      {/* Sales Team Performance */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3
          style={{
            color: 'white',
            fontSize: '1.3rem',
            fontWeight: '600',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          👥 Sales Team Performance
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {salesTeamMembers.map((member) => (
            <div
              key={member.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <div>
                  <div
                    style={{
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '1rem',
                    }}
                  >
                    {member.name}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.85rem',
                    }}
                  >
                    {member.role}
                  </div>
                </div>
                <div
                  style={{
                    background:
                      member.status === 'Available'
                        ? '#22c55e'
                        : member.status === 'On Call'
                          ? '#f59e0b'
                          : '#ef4444',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                  }}
                >
                  {member.status}
                </div>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px',
                  fontSize: '0.8rem',
                }}
              >
                <div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    AI Score
                  </div>
                  <div style={{ color: '#22c55e', fontWeight: '600' }}>
                    {member.aiScore}%
                  </div>
                </div>
                <div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Active Calls
                  </div>
                  <div style={{ color: 'white', fontWeight: '600' }}>
                    {member.activeCalls}
                  </div>
                </div>
                <div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Weekly Progress
                  </div>
                  <div style={{ color: 'white', fontWeight: '600' }}>
                    {member.weeklyProgress}/{member.weeklyTarget}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Service Queue */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3
          style={{
            color: 'white',
            fontSize: '1.3rem',
            fontWeight: '600',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          🎧 Customer Service Queue
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {customerServiceQueue.map((ticket) => (
            <div
              key={ticket.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '16px',
                border: `1px solid ${ticket.priority === 'High' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <div>
                  <div
                    style={{
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '1rem',
                    }}
                  >
                    {ticket.customerName}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.85rem',
                    }}
                  >
                    {ticket.issueType}
                  </div>
                </div>
                <div
                  style={{
                    background:
                      ticket.priority === 'High' ? '#ef4444' : '#f59e0b',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                  }}
                >
                  {ticket.priority}
                </div>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                  fontSize: '0.8rem',
                }}
              >
                <div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Wait Time
                  </div>
                  <div style={{ color: '#f59e0b', fontWeight: '600' }}>
                    {ticket.waitTime}
                  </div>
                </div>
                <div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Account Value
                  </div>
                  <div style={{ color: '#22c55e', fontWeight: '600' }}>
                    {ticket.accountValue}
                  </div>
                </div>
              </div>
              <div
                style={{
                  marginTop: '8px',
                  padding: '8px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  borderRadius: '6px',
                }}
              >
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.75rem',
                  }}
                >
                  AI Recommendation:
                </div>
                <div
                  style={{
                    color: '#22c55e',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                  }}
                >
                  {ticket.aiRecommendation}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logistics Sales Opportunities */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          gridColumn: 'span 2',
        }}
      >
        <h3
          style={{
            color: 'white',
            fontSize: '1.3rem',
            fontWeight: '600',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          🎯 Logistics Sales Opportunities
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '16px',
          }}
        >
          {logisticsSalesOpportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <div>
                  <div
                    style={{
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '1.1rem',
                    }}
                  >
                    {opportunity.prospectName}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.85rem',
                    }}
                  >
                    {opportunity.serviceNeeded}
                  </div>
                </div>
                <div
                  style={{
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                  }}
                >
                  {opportunity.estimatedValue}
                </div>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                  fontSize: '0.85rem',
                  marginBottom: '12px',
                }}
              >
                <div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Probability
                  </div>
                  <div style={{ color: '#22c55e', fontWeight: '600' }}>
                    {opportunity.probability}
                  </div>
                </div>
                <div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    AI Score
                  </div>
                  <div style={{ color: '#3b82f6', fontWeight: '600' }}>
                    {opportunity.aiScore}%
                  </div>
                </div>
                <div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Stage</div>
                  <div style={{ color: 'white', fontWeight: '600' }}>
                    {opportunity.stage}
                  </div>
                </div>
                <div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Timeline
                  </div>
                  <div style={{ color: 'white', fontWeight: '600' }}>
                    {opportunity.timeline}
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: '8px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '6px',
                }}
              >
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.75rem',
                  }}
                >
                  Next Action:
                </div>
                <div
                  style={{
                    color: '#3b82f6',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                  }}
                >
                  {opportunity.nextAction}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3
          style={{
            color: 'white',
            fontSize: '1.3rem',
            fontWeight: '600',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          🤖 AI Sales Insights
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {aiInsights.map((insight) => (
            <div
              key={insight.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '16px',
                border: `1px solid ${insight.priority === 'High' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <div
                  style={{
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '1rem',
                  }}
                >
                  {insight.title}
                </div>
                <div
                  style={{
                    background:
                      insight.priority === 'High' ? '#ef4444' : '#f59e0b',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                  }}
                >
                  {insight.priority}
                </div>
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.9rem',
                  marginBottom: '8px',
                }}
              >
                {insight.message}
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.8rem',
                  }}
                >
                  Confidence:{' '}
                  <span style={{ color: '#22c55e', fontWeight: '600' }}>
                    {insight.confidence}%
                  </span>
                </div>
                {insight.actionable && (
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Take Action
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sales Metrics KPIs */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3
          style={{
            color: 'white',
            fontSize: '1.3rem',
            fontWeight: '600',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          📈 Sales Metrics
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
          }}
        >
          {Object.entries(salesMetrics).map(([key, value]) => (
            <div
              key={key}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.8rem',
                  marginBottom: '4px',
                }}
              >
                {key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase())}
              </div>
              <div
                style={{
                  color: '#22c55e',
                  fontSize: '1.2rem',
                  fontWeight: '700',
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCustomerService = () => (
    <div
      style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px' }}
    >
      {/* Customer Service Dashboard */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3
          style={{
            color: 'white',
            fontSize: '1.4rem',
            fontWeight: '600',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          🎧 Customer Service Center
        </h3>

        {/* Service Queue */}
        <div style={{ marginBottom: '32px' }}>
          <h4
            style={{
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: '600',
              marginBottom: '16px',
            }}
          >
            Active Service Queue
          </h4>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {customerServiceQueue.map((ticket) => (
              <div
                key={ticket.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: `2px solid ${ticket.priority === 'High' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '1.1rem',
                      }}
                    >
                      {ticket.customerName}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.9rem',
                      }}
                    >
                      {ticket.issueType}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        background:
                          ticket.priority === 'High' ? '#ef4444' : '#f59e0b',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        marginBottom: '4px',
                      }}
                    >
                      {ticket.priority} Priority
                    </div>
                    <div
                      style={{
                        color: '#f59e0b',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                      }}
                    >
                      Wait: {ticket.waitTime}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '16px',
                    marginBottom: '12px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '0.8rem',
                      }}
                    >
                      Assigned To
                    </div>
                    <div style={{ color: 'white', fontWeight: '600' }}>
                      {ticket.assignedTo}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '0.8rem',
                      }}
                    >
                      Account Value
                    </div>
                    <div style={{ color: '#22c55e', fontWeight: '600' }}>
                      {ticket.accountValue}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '0.8rem',
                      }}
                    >
                      Sentiment
                    </div>
                    <div
                      style={{
                        color:
                          ticket.sentiment === 'Frustrated'
                            ? '#ef4444'
                            : ticket.sentiment === 'Concerned'
                              ? '#f59e0b'
                              : '#22c55e',
                        fontWeight: '600',
                      }}
                    >
                      {ticket.sentiment}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    padding: '12px',
                    background: 'rgba(34, 197, 94, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                  }}
                >
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '0.8rem',
                      marginBottom: '4px',
                    }}
                  >
                    AI Recommendation:
                  </div>
                  <div
                    style={{
                      color: '#22c55e',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                    }}
                  >
                    {ticket.aiRecommendation}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      flex: 1,
                    }}
                  >
                    Accept Call
                  </button>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      flex: 1,
                    }}
                  >
                    Transfer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CRM Integration */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <h4
            style={{
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: '600',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            🔗 CRM Integration
          </h4>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
            }}
          >
            <button
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              📋 Open CRM Dashboard
            </button>
            <button
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              📞 Launch Dialer
            </button>
          </div>
        </div>
      </div>

      {/* Integrated Phone Dialer */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h4
          style={{
            color: 'white',
            fontSize: '1.2rem',
            fontWeight: '600',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          📞 Integrated Dialer
        </h4>
        <SimplePhoneDialer />
      </div>
    </div>
  );

  const renderLogisticsSales = () => (
    <div
      style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}
    >
      {/* Sales Pipeline */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3
          style={{
            color: 'white',
            fontSize: '1.4rem',
            fontWeight: '600',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          🎯 Logistics Sales Pipeline
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {logisticsSalesOpportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Opportunity Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <div
                    style={{
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '1.2rem',
                    }}
                  >
                    {opportunity.prospectName}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '1rem',
                    }}
                  >
                    {opportunity.serviceNeeded}
                  </div>
                </div>
                <div
                  style={{
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                  }}
                >
                  {opportunity.estimatedValue}
                </div>
              </div>

              {/* Opportunity Details */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '16px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '0.8rem',
                      marginBottom: '4px',
                    }}
                  >
                    Probability
                  </div>
                  <div
                    style={{
                      color: '#22c55e',
                      fontSize: '1.1rem',
                      fontWeight: '700',
                    }}
                  >
                    {opportunity.probability}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '0.8rem',
                      marginBottom: '4px',
                    }}
                  >
                    AI Score
                  </div>
                  <div
                    style={{
                      color: '#3b82f6',
                      fontSize: '1.1rem',
                      fontWeight: '700',
                    }}
                  >
                    {opportunity.aiScore}%
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '0.8rem',
                      marginBottom: '4px',
                    }}
                  >
                    Stage
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                    }}
                  >
                    {opportunity.stage}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '0.8rem',
                      marginBottom: '4px',
                    }}
                  >
                    Timeline
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                    }}
                  >
                    {opportunity.timeline}
                  </div>
                </div>
              </div>

              {/* Next Action */}
              <div
                style={{
                  padding: '12px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.8rem',
                    marginBottom: '4px',
                  }}
                >
                  Next Action:
                </div>
                <div
                  style={{
                    color: '#3b82f6',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                  }}
                >
                  {opportunity.nextAction}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    flex: 1,
                  }}
                >
                  📞 Call Prospect
                </button>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    flex: 1,
                  }}
                >
                  📧 Send Proposal
                </button>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    flex: 1,
                  }}
                >
                  📋 Update CRM
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sales Tools */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h4
          style={{
            color: 'white',
            fontSize: '1.2rem',
            fontWeight: '600',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          🛠️ Sales Tools
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            📋 CRM Dashboard
            <div
              style={{ fontSize: '0.8rem', fontWeight: '400', opacity: 0.8 }}
            >
              Manage contacts & opportunities
            </div>
          </button>

          <button
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            📞 Phone Dialer
            <div
              style={{ fontSize: '0.8rem', fontWeight: '400', opacity: 0.8 }}
            >
              Make calls & track activity
            </div>
          </button>

          <button
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            🤖 AI Flow Integration
            <div
              style={{ fontSize: '0.8rem', fontWeight: '400', opacity: 0.8 }}
            >
              AI-powered lead generation
            </div>
          </button>

          <button
            style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            📊 Sales Analytics
            <div
              style={{ fontSize: '0.8rem', fontWeight: '400', opacity: 0.8 }}
            >
              Performance metrics & reports
            </div>
          </button>
        </div>

        {/* Quick Actions */}
        <div
          style={{
            marginTop: '24px',
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
          }}
        >
          <h5
            style={{
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '12px',
            }}
          >
            Quick Actions
          </h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              🎯 Create New Opportunity
            </button>
            <button
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              📧 Send Follow-up Email
            </button>
            <button
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              📅 Schedule Meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAIIntegration = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
      {/* AI Flow Integration */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3
          style={{
            color: 'white',
            fontSize: '1.4rem',
            fontWeight: '600',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          🤖 AI Flow • Sales Division Integration
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '20px',
          }}
        >
          {/* Lead Generation AI */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h4
              style={{
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: '600',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              🎯 AI Lead Generation
            </h4>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.9rem',
                marginBottom: '16px',
              }}
            >
              AI-powered prospect identification using FMCSA data, market
              intelligence, and behavioral analysis.
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.85rem',
                  }}
                >
                  Today's Qualified Leads
                </span>
                <span style={{ color: '#22c55e', fontWeight: '600' }}>47</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.85rem',
                  }}
                >
                  AI Confidence Score
                </span>
                <span style={{ color: '#3b82f6', fontWeight: '600' }}>92%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.85rem',
                  }}
                >
                  Conversion Rate
                </span>
                <span style={{ color: '#22c55e', fontWeight: '600' }}>
                  34.2%
                </span>
              </div>
            </div>
            <button
              style={{
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%',
                marginTop: '16px',
              }}
            >
              🚀 Launch Lead Generation
            </button>
          </div>

          {/* Sales Intelligence */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h4
              style={{
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: '600',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              🧠 Sales Intelligence
            </h4>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.9rem',
                marginBottom: '16px',
              }}
            >
              Real-time market analysis, competitive intelligence, and customer
              behavior insights.
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.85rem',
                  }}
                >
                  Market Opportunities
                </span>
                <span style={{ color: '#22c55e', fontWeight: '600' }}>23</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.85rem',
                  }}
                >
                  Competitive Alerts
                </span>
                <span style={{ color: '#f59e0b', fontWeight: '600' }}>5</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.85rem',
                  }}
                >
                  Customer Insights
                </span>
                <span style={{ color: '#3b82f6', fontWeight: '600' }}>89</span>
              </div>
            </div>
            <button
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%',
                marginTop: '16px',
              }}
            >
              📊 View Intelligence Dashboard
            </button>
          </div>

          {/* Automated Communications */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h4
              style={{
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: '600',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              📧 Smart Communications
            </h4>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.9rem',
                marginBottom: '16px',
              }}
            >
              AI-powered email sequences, SMS campaigns, and automated follow-up
              systems.
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.85rem',
                  }}
                >
                  Active Campaigns
                </span>
                <span style={{ color: '#22c55e', fontWeight: '600' }}>12</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.85rem',
                  }}
                >
                  Response Rate
                </span>
                <span style={{ color: '#22c55e', fontWeight: '600' }}>
                  28.4%
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.85rem',
                  }}
                >
                  Scheduled Follow-ups
                </span>
                <span style={{ color: '#3b82f6', fontWeight: '600' }}>156</span>
              </div>
            </div>
            <button
              style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%',
                marginTop: '16px',
              }}
            >
              🤖 Manage Automation
            </button>
          </div>

          {/* CRM Integration */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h4
              style={{
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: '600',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              📋 CRM Integration
            </h4>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.9rem',
                marginBottom: '16px',
              }}
            >
              Seamless integration with FleetFlow CRM for unified customer
              management and sales tracking.
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.85rem',
                  }}
                >
                  Active Contacts
                </span>
                <span style={{ color: '#22c55e', fontWeight: '600' }}>
                  2,847
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.85rem',
                  }}
                >
                  Open Opportunities
                </span>
                <span style={{ color: '#3b82f6', fontWeight: '600' }}>189</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.85rem',
                  }}
                >
                  Sync Status
                </span>
                <span style={{ color: '#22c55e', fontWeight: '600' }}>
                  ✓ Live
                </span>
              </div>
            </div>
            <button
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%',
                marginTop: '16px',
              }}
            >
              📊 Open CRM Dashboard
            </button>
          </div>
        </div>

        {/* Integration Status */}
        <div
          style={{
            marginTop: '24px',
            padding: '20px',
            background: 'rgba(34, 197, 94, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(34, 197, 94, 0.2)',
          }}
        >
          <h4
            style={{
              color: '#22c55e',
              fontSize: '1.1rem',
              fontWeight: '600',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            ✅ Integration Status: ACTIVE
          </h4>
          <div
            style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}
          >
            All systems are connected and operating at optimal performance.
            Real-time data synchronization active across AI Flow, CRM, and
            Dialer platforms.
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '32px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #22c55e, #16a34a, #15803d)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px',
          }}
        >
          🎯 FleetFlow Sales Division
        </h1>
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1.1rem',
            margin: '0',
          }}
        >
          Human-Powered Sales Excellence • AI-Enhanced Intelligence • Integrated
          CRM & Dialer
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: '32px' }}>
        <input
          type='text'
          placeholder='Search sales division operations...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px 12px 40px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            fontSize: '16px',
            outline: 'none',
            transition: 'all 0.3s ease',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            backdropFilter: 'blur(5px)',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#22c55e';
            e.target.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)';
            e.target.style.background = 'rgba(255, 255, 255, 0.15)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            e.target.style.boxShadow = 'none';
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#22c55e',
            fontSize: '20px',
          }}
        >
          🔍
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          marginBottom: '32px',
        }}
      >
        {[
          {
            id: 'dashboard',
            label: 'Dashboard',
            icon: '📊',
            color: '#22c55e',
            borderColor: 'rgba(34, 197, 94, 0.3)',
          },
          {
            id: 'customer-service',
            label: 'Customer Service',
            icon: '🎧',
            color: '#3b82f6',
            borderColor: 'rgba(59, 130, 246, 0.3)',
          },
          {
            id: 'logistics-sales',
            label: 'Logistics Sales',
            icon: '🚛',
            color: '#f59e0b',
            borderColor: 'rgba(245, 158, 11, 0.3)',
          },
          {
            id: 'ai-integration',
            label: 'AI Integration',
            icon: '🤖',
            color: '#8b5cf6',
            borderColor: 'rgba(139, 92, 246, 0.3)',
          },
        ].map((tab) => {
          const getGradient = (color: string) => {
            switch (color) {
              case '#22c55e':
                return 'linear-gradient(135deg, #22c55e, #16a34a)'; // Green
              case '#3b82f6':
                return 'linear-gradient(135deg, #3b82f6, #2563eb)'; // Blue
              case '#f59e0b':
                return 'linear-gradient(135deg, #f59e0b, #d97706)'; // Orange
              case '#8b5cf6':
                return 'linear-gradient(135deg, #8b5cf6, #7c3aed)'; // Purple
              default:
                return 'linear-gradient(135deg, #334155, #475569)'; // Slate (default)
            }
          };

          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              style={{
                background:
                  activeView === tab.id
                    ? getGradient(tab.color)
                    : 'rgba(255, 255, 255, 0.1)',
                color:
                  activeView === tab.id ? 'white' : 'rgba(255, 255, 255, 0.8)',
                border:
                  activeView === tab.id
                    ? `1px solid ${tab.borderColor}`
                    : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '12px 24px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(5px)',
                boxShadow:
                  activeView === tab.id
                    ? `0 4px 12px ${tab.color}33`
                    : '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
              onMouseOver={(e) => {
                if (activeView !== tab.id) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseOut={(e) => {
                if (activeView !== tab.id) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {tab.icon} {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
        }}
      >
        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'customer-service' && renderCustomerService()}
        {activeView === 'logistics-sales' && renderLogisticsSales()}
        {activeView === 'ai-integration' && renderAIIntegration()}
      </div>

      {/* Real-time Notifications */}
      {notifications.length > 0 && (
        <div
          style={{
            position: 'fixed',
            top: '100px',
            right: '20px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {notifications.map((notification) => (
            <div
              key={notification.id}
              style={{
                background: 'rgba(34, 197, 94, 0.9)',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(10px)',
                animation: 'slideInRight 0.3s ease-out',
              }}
            >
              ✅ {notification.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
