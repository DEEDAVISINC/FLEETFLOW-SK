'use client';

import React, { useEffect, useState } from 'react';

interface AIAgentDashboardProps {
  tenantId: string;
  userId: string;
  agentId?: string;
}

interface DashboardStats {
  emailsSent: number;
  emailsOpened: number;
  emailsReplied: number;
  callsMade: number;
  callsAnswered: number;
  leadsGenerated: number;
  leadsQualified: number;
  leadsConverted: number;
  responseRate: number;
  conversionRate: number;
  revenueGenerated: number;
  aiAccuracy: number;
}

interface RecentActivity {
  id: string;
  type: 'email' | 'call' | 'sms' | 'social_post' | 'lead_generated';
  description: string;
  timestamp: Date;
  status: 'success' | 'pending' | 'failed';
  leadName?: string;
  channel?: string;
}

export const AIAgentDashboard: React.FC<AIAgentDashboardProps> = ({
  tenantId,
  userId,
  agentId,
}) => {
  const [stats, setStats] = useState<DashboardStats>({
    emailsSent: 0,
    emailsOpened: 0,
    emailsReplied: 0,
    callsMade: 0,
    callsAnswered: 0,
    leadsGenerated: 0,
    leadsQualified: 0,
    leadsConverted: 0,
    responseRate: 0,
    conversionRate: 0,
    revenueGenerated: 0,
    aiAccuracy: 0,
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<
    'today' | 'week' | 'month' | 'quarter'
  >('week');
  const [agentStatus, setAgentStatus] = useState<
    'active' | 'paused' | 'offline'
  >('active');

  useEffect(() => {
    loadDashboardData();
  }, [tenantId, agentId, selectedPeriod]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Mock data - replace with actual API calls
      const mockStats: DashboardStats = {
        emailsSent: 342,
        emailsOpened: 248,
        emailsReplied: 67,
        callsMade: 89,
        callsAnswered: 45,
        leadsGenerated: 23,
        leadsQualified: 15,
        leadsConverted: 4,
        responseRate: 19.6,
        conversionRate: 17.4,
        revenueGenerated: 47850,
        aiAccuracy: 87.3,
      };

      const mockActivity: RecentActivity[] = [
        {
          id: '1',
          type: 'lead_generated',
          description: 'New lead from JotForm submission',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          status: 'success',
          leadName: 'ABC Trucking Co.',
          channel: 'jotform',
        },
        {
          id: '2',
          type: 'email',
          description: 'Follow-up email sent',
          timestamp: new Date(Date.now() - 32 * 60 * 1000),
          status: 'success',
          leadName: 'Express Logistics',
          channel: 'email',
        },
        {
          id: '3',
          type: 'call',
          description: 'Outbound call completed',
          timestamp: new Date(Date.now() - 67 * 60 * 1000),
          status: 'success',
          leadName: 'Metro Freight Services',
          channel: 'voice',
        },
        {
          id: '4',
          type: 'email',
          description: 'Cold outreach email sent',
          timestamp: new Date(Date.now() - 95 * 60 * 1000),
          status: 'pending',
          leadName: 'Regional Transport LLC',
          channel: 'email',
        },
      ];

      setStats(mockStats);
      setRecentActivity(mockActivity);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAgentStatus = () => {
    const newStatus = agentStatus === 'active' ? 'paused' : 'active';
    setAgentStatus(newStatus);
    // API call to update agent status would go here
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'email':
        return '📧';
      case 'call':
        return '📞';
      case 'sms':
        return '💬';
      case 'social_post':
        return '📱';
      case 'lead_generated':
        return '🎯';
      default:
        return '📋';
    }
  };

  const getStatusColor = (status: RecentActivity['status']) => {
    switch (status) {
      case 'success':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'failed':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatTimeAgo = (timestamp: Date) => {
    const minutes = Math.floor((Date.now() - timestamp.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ color: '#94A3B8', fontSize: '18px' }}>
          Loading AI Agent Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background:
          'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.8))',
        borderRadius: '20px',
        padding: '30px',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        minHeight: '800px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#F8FAFC',
              margin: '0 0 8px 0',
            }}
          >
            🤖 AI Agent Dashboard
          </h1>
          <p
            style={{
              color: '#94A3B8',
              margin: 0,
              fontSize: '16px',
            }}
          >
            Monitor your AI assistant's performance and recent activity
          </p>
        </div>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {/* Period Selector */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            style={{
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '10px',
              padding: '8px 15px',
              color: '#F8FAFC',
              fontSize: '14px',
            }}
          >
            <option value='today'>Today</option>
            <option value='week'>This Week</option>
            <option value='month'>This Month</option>
            <option value='quarter'>This Quarter</option>
          </select>

          {/* Agent Status Toggle */}
          <button
            onClick={toggleAgentStatus}
            style={{
              background:
                agentStatus === 'active'
                  ? 'linear-gradient(135deg, #10B981, #059669)'
                  : 'linear-gradient(135deg, #F59E0B, #D97706)',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 20px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {agentStatus === 'active' ? '🟢' : '🟡'}
            {agentStatus === 'active' ? 'Active' : 'Paused'}
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        {/* Communication Metrics */}
        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))',
            borderRadius: '15px',
            padding: '20px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
          }}
        >
          <div
            style={{ color: '#3B82F6', fontSize: '24px', marginBottom: '8px' }}
          >
            📧
          </div>
          <div
            style={{ color: '#F8FAFC', fontSize: '20px', fontWeight: 'bold' }}
          >
            {stats.emailsSent}
          </div>
          <div style={{ color: '#94A3B8', fontSize: '14px' }}>Emails Sent</div>
          <div style={{ color: '#10B981', fontSize: '12px', marginTop: '5px' }}>
            {stats.responseRate}% response rate
          </div>
        </div>

        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
            borderRadius: '15px',
            padding: '20px',
            border: '1px solid rgba(16, 185, 129, 0.2)',
          }}
        >
          <div
            style={{ color: '#10B981', fontSize: '24px', marginBottom: '8px' }}
          >
            📞
          </div>
          <div
            style={{ color: '#F8FAFC', fontSize: '20px', fontWeight: 'bold' }}
          >
            {stats.callsMade}
          </div>
          <div style={{ color: '#94A3B8', fontSize: '14px' }}>Calls Made</div>
          <div style={{ color: '#10B981', fontSize: '12px', marginTop: '5px' }}>
            {((stats.callsAnswered / stats.callsMade) * 100).toFixed(1)}%
            answered
          </div>
        </div>

        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1))',
            borderRadius: '15px',
            padding: '20px',
            border: '1px solid rgba(245, 158, 11, 0.2)',
          }}
        >
          <div
            style={{ color: '#F59E0B', fontSize: '24px', marginBottom: '8px' }}
          >
            🎯
          </div>
          <div
            style={{ color: '#F8FAFC', fontSize: '20px', fontWeight: 'bold' }}
          >
            {stats.leadsGenerated}
          </div>
          <div style={{ color: '#94A3B8', fontSize: '14px' }}>
            Leads Generated
          </div>
          <div style={{ color: '#10B981', fontSize: '12px', marginTop: '5px' }}>
            {stats.conversionRate}% conversion rate
          </div>
        </div>

        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(147, 51, 234, 0.1))',
            borderRadius: '15px',
            padding: '20px',
            border: '1px solid rgba(168, 85, 247, 0.2)',
          }}
        >
          <div
            style={{ color: '#A855F7', fontSize: '24px', marginBottom: '8px' }}
          >
            💰
          </div>
          <div
            style={{ color: '#F8FAFC', fontSize: '20px', fontWeight: 'bold' }}
          >
            {formatCurrency(stats.revenueGenerated)}
          </div>
          <div style={{ color: '#94A3B8', fontSize: '14px' }}>
            Revenue Generated
          </div>
          <div style={{ color: '#10B981', fontSize: '12px', marginTop: '5px' }}>
            {stats.aiAccuracy}% AI accuracy
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '30px',
        }}
      >
        {/* Recent Activity */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.4)',
            borderRadius: '15px',
            padding: '25px',
            border: '1px solid rgba(148, 163, 184, 0.1)',
          }}
        >
          <h3
            style={{
              color: '#F8FAFC',
              fontSize: '18px',
              fontWeight: '600',
              margin: '0 0 20px 0',
            }}
          >
            Recent Activity
          </h3>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
          >
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '15px',
                  background: 'rgba(15, 23, 42, 0.5)',
                  borderRadius: '10px',
                  border: '1px solid rgba(148, 163, 184, 0.1)',
                }}
              >
                <div style={{ fontSize: '20px' }}>
                  {getActivityIcon(activity.type)}
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      color: '#F8FAFC',
                      fontSize: '14px',
                      fontWeight: '500',
                      marginBottom: '2px',
                    }}
                  >
                    {activity.description}
                  </div>
                  {activity.leadName && (
                    <div
                      style={{
                        color: '#94A3B8',
                        fontSize: '12px',
                        marginBottom: '2px',
                      }}
                    >
                      {activity.leadName}
                    </div>
                  )}
                  <div
                    style={{
                      color: '#64748B',
                      fontSize: '11px',
                    }}
                  >
                    {formatTimeAgo(activity.timestamp)}
                  </div>
                </div>

                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: getStatusColor(activity.status),
                  }}
                />
              </div>
            ))}
          </div>

          <button
            style={{
              width: '100%',
              marginTop: '20px',
              padding: '12px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '10px',
              color: '#3B82F6',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            View All Activity →
          </button>
        </div>

        {/* Quick Actions & Settings */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Quick Actions */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.4)',
              borderRadius: '15px',
              padding: '25px',
              border: '1px solid rgba(148, 163, 184, 0.1)',
            }}
          >
            <h3
              style={{
                color: '#F8FAFC',
                fontSize: '18px',
                fontWeight: '600',
                margin: '0 0 15px 0',
              }}
            >
              Quick Actions
            </h3>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
            >
              <button
                style={{
                  padding: '12px 15px',
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                📧 Send Campaign
              </button>

              <button
                style={{
                  padding: '12px 15px',
                  background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                📝 Create Template
              </button>

              <button
                style={{
                  padding: '12px 15px',
                  background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                🎯 Review Leads
              </button>

              <button
                style={{
                  padding: '12px 15px',
                  background: 'linear-gradient(135deg, #A855F7, #9333EA)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                ⚙️ Agent Settings
              </button>
            </div>
          </div>

          {/* Performance Summary */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.4)',
              borderRadius: '15px',
              padding: '25px',
              border: '1px solid rgba(148, 163, 184, 0.1)',
            }}
          >
            <h3
              style={{
                color: '#F8FAFC',
                fontSize: '18px',
                fontWeight: '600',
                margin: '0 0 15px 0',
              }}
            >
              Performance Summary
            </h3>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8', fontSize: '14px' }}>
                  Response Rate
                </span>
                <span
                  style={{
                    color: '#10B981',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  {stats.responseRate}%
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8', fontSize: '14px' }}>
                  Conversion Rate
                </span>
                <span
                  style={{
                    color: '#10B981',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  {stats.conversionRate}%
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8', fontSize: '14px' }}>
                  AI Accuracy
                </span>
                <span
                  style={{
                    color: '#3B82F6',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  {stats.aiAccuracy}%
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8', fontSize: '14px' }}>
                  Revenue/Lead
                </span>
                <span
                  style={{
                    color: '#A855F7',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  {formatCurrency(
                    stats.revenueGenerated / stats.leadsGenerated
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
