'use client';

import {
  Activity,
  Award,
  CheckCircle,
  Clock,
  Edit3,
  Eye,
  Mail,
  Settings,
  Shield,
  Star,
  TrendingUp,
  UserPlus,
  Users,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import BrokerageHierarchyService, {
  AgentPermissions,
  BrokerAgent,
  BrokerageCompany,
} from '../services/BrokerageHierarchyService';

interface AgentManagementProps {
  brokerageId: string;
}

export default function BrokerageAgentManagement({
  brokerageId,
}: AgentManagementProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [agents, setAgents] = useState<BrokerAgent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<BrokerAgent | null>(null);
  const [brokerageInfo, setBrokerageInfo] = useState<BrokerageCompany | null>(
    null
  );
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showAgentDetails, setShowAgentDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgentData();
  }, [brokerageId]);

  const loadAgentData = () => {
    setLoading(true);
    // Get brokerage info and agents
    const brokerage = BrokerageHierarchyService.getBrokerageById(brokerageId);
    const agentList =
      BrokerageHierarchyService.getAgentsByBrokerageId(brokerageId);

    setBrokerageInfo(brokerage);
    setAgents(agentList);
    setLoading(false);
  };

  const handlePermissionUpdate = (
    agentId: string,
    permissions: Partial<AgentPermissions>
  ) => {
    const success = BrokerageHierarchyService.updateAgentPermissions(
      agentId,
      permissions,
      brokerageId
    );
    if (success) {
      loadAgentData();
      setShowPermissionsModal(false);
    }
  };

  const handleToggleAgentStatus = (agentId: string) => {
    const success = BrokerageHierarchyService.toggleAgentStatus(
      agentId,
      brokerageId
    );
    if (success) {
      loadAgentData();
    }
  };

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return '#10b981';
    if (rating >= 4.0) return '#f59e0b';
    if (rating >= 3.5) return '#ef4444';
    return '#6b7280';
  };

  const activeAgents = agents.filter((agent) => agent.isActive);
  const inactiveAgents = agents.filter((agent) => !agent.isActive);
  const topPerformer = agents.reduce(
    (top, agent) =>
      agent.performanceMetrics.revenue > (top?.performanceMetrics.revenue || 0)
        ? agent
        : top,
    null as BrokerAgent | null
  );

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '400px',
          color: 'rgba(255, 255, 255, 0.8)',
        }}
      >
        Loading agent management...
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '30px',
        color: 'white',
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
          <h2
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              margin: '0 0 8px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Users size={28} style={{ color: '#f97316' }} />
            Agent Management
          </h2>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '16px',
              margin: 0,
            }}
          >
            Manage your broker agents and oversee performance
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              padding: '12px 20px',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            <UserPlus size={16} />
            Add Agent
          </button>
          <button
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              padding: '12px 20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            <Settings size={16} />
            Settings
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '30px',
        }}
      >
        {[
          { id: 'overview', label: '📊 Overview', icon: Activity },
          { id: 'agents', label: '👥 All Agents', icon: Users },
          { id: 'performance', label: '🎯 Performance', icon: TrendingUp },
          { id: 'permissions', label: '🔒 Permissions', icon: Shield },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '12px 16px',
              background:
                activeTab === tab.id
                  ? 'linear-gradient(135deg, #f97316, #ea580c)'
                  : 'transparent',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {/* Summary Cards */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '15px',
              padding: '25px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <Users size={20} style={{ color: '#3b82f6' }} />
              Agent Summary
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    color: '#10b981',
                    fontSize: '32px',
                    fontWeight: 'bold',
                  }}
                >
                  {activeAgents.length}
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Active Agents
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    color: '#ef4444',
                    fontSize: '32px',
                    fontWeight: 'bold',
                  }}
                >
                  {inactiveAgents.length}
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Inactive
                </div>
              </div>
            </div>
          </div>

          {/* Performance Overview */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '15px',
              padding: '25px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <TrendingUp size={20} style={{ color: '#10b981' }} />
              Total Performance
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    color: '#3b82f6',
                    fontSize: '24px',
                    fontWeight: 'bold',
                  }}
                >
                  $
                  {agents
                    .reduce(
                      (sum, agent) => sum + agent.performanceMetrics.revenue,
                      0
                    )
                    .toLocaleString()}
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Total Revenue
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    color: '#f59e0b',
                    fontSize: '24px',
                    fontWeight: 'bold',
                  }}
                >
                  {agents.reduce(
                    (sum, agent) => sum + agent.performanceMetrics.loadsHandled,
                    0
                  )}
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Total Loads
                </div>
              </div>
            </div>
          </div>

          {/* Top Performer */}
          {topPerformer && (
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '15px',
                padding: '25px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Award size={20} style={{ color: '#f59e0b' }} />
                Top Performer
              </h3>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '15px' }}
              >
                <div
                  style={{
                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  {topPerformer.firstName.charAt(0)}
                  {topPerformer.lastName.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: 'bold',
                    }}
                  >
                    {topPerformer.firstName} {topPerformer.lastName}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                    }}
                  >
                    ${topPerformer.performanceMetrics.revenue.toLocaleString()}{' '}
                    revenue
                  </div>
                </div>
                <div
                  style={{
                    color: getPerformanceColor(
                      topPerformer.performanceMetrics.customerRating
                    ),
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                  }}
                >
                  <Star size={16} />
                  {topPerformer.performanceMetrics.customerRating}
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '15px',
              padding: '25px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              gridColumn: 'span 2',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <Clock size={20} style={{ color: '#8b5cf6' }} />
              Recent Agent Activity
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {[
                {
                  agent: 'Emily Davis',
                  action: 'Created load ATL-MIA-001',
                  time: '2 hours ago',
                  type: 'load',
                },
                {
                  agent: 'Emily Davis',
                  action: 'Negotiated rate increase',
                  time: '4 hours ago',
                  type: 'negotiation',
                },
                {
                  agent: 'Emily Davis',
                  action: 'Assigned carrier ABC Transport',
                  time: '6 hours ago',
                  type: 'assignment',
                },
                {
                  agent: 'Emily Davis',
                  action: 'Customer follow-up call completed',
                  time: '8 hours ago',
                  type: 'communication',
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '15px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '10px',
                  }}
                >
                  <div
                    style={{
                      background:
                        activity.type === 'load'
                          ? '#10b981'
                          : activity.type === 'negotiation'
                            ? '#f59e0b'
                            : activity.type === 'assignment'
                              ? '#3b82f6'
                              : '#8b5cf6',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {activity.type === 'load' && '🚛'}
                    {activity.type === 'negotiation' && '💰'}
                    {activity.type === 'assignment' && '🤝'}
                    {activity.type === 'communication' && '📞'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      {activity.agent}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '13px',
                      }}
                    >
                      {activity.action}
                    </div>
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '12px',
                    }}
                  >
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* All Agents Tab */}
      {activeTab === 'agents' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {agents.map((agent) => (
            <div
              key={agent.id}
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '15px',
                padding: '25px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto auto',
                gap: '20px',
                alignItems: 'center',
              }}
            >
              {/* Agent Avatar & Info */}
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '15px' }}
              >
                <div
                  style={{
                    background: agent.isActive
                      ? 'linear-gradient(135deg, #f97316, #ea580c)'
                      : 'rgba(107, 114, 128, 0.8)',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    position: 'relative',
                  }}
                >
                  {agent.firstName.charAt(0)}
                  {agent.lastName.charAt(0)}
                  {!agent.isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-2px',
                        right: '-2px',
                        background: '#ef4444',
                        borderRadius: '50%',
                        width: '16px',
                        height: '16px',
                      }}
                    />
                  )}
                </div>
                <div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      marginBottom: '4px',
                    }}
                  >
                    {agent.firstName} {agent.lastName}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                      marginBottom: '4px',
                    }}
                  >
                    {agent.position}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Mail size={12} />
                    {agent.email}
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '20px',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      color: '#10b981',
                      fontSize: '20px',
                      fontWeight: 'bold',
                    }}
                  >
                    {agent.performanceMetrics.loadsHandled}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Loads
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      color: '#3b82f6',
                      fontSize: '20px',
                      fontWeight: 'bold',
                    }}
                  >
                    ${agent.performanceMetrics.revenue.toLocaleString()}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Revenue
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      color: '#f59e0b',
                      fontSize: '20px',
                      fontWeight: 'bold',
                    }}
                  >
                    {agent.performanceMetrics.margin}%
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Margin
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      color: getPerformanceColor(
                        agent.performanceMetrics.customerRating
                      ),
                      fontSize: '20px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                    }}
                  >
                    <Star size={16} />
                    {agent.performanceMetrics.customerRating}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Rating
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  background: agent.isActive
                    ? 'rgba(16, 185, 129, 0.2)'
                    : 'rgba(239, 68, 68, 0.2)',
                  border: `1px solid ${agent.isActive ? '#10b981' : '#ef4444'}`,
                  color: agent.isActive ? '#10b981' : '#ef4444',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                {agent.isActive ? (
                  <CheckCircle size={16} />
                ) : (
                  <XCircle size={16} />
                )}
                {agent.isActive ? 'Active' : 'Inactive'}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    setSelectedAgent(agent);
                    setShowAgentDetails(true);
                  }}
                  style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    color: '#3b82f6',
                    padding: '8px 12px',
                    border: '1px solid #3b82f6',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Eye size={14} />
                  View
                </button>
                <button
                  onClick={() => {
                    setSelectedAgent(agent);
                    setShowPermissionsModal(true);
                  }}
                  style={{
                    background: 'rgba(245, 158, 11, 0.2)',
                    color: '#f59e0b',
                    padding: '8px 12px',
                    border: '1px solid #f59e0b',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Settings size={14} />
                  Permissions
                </button>
                <button
                  onClick={() => handleToggleAgentStatus(agent.id)}
                  style={{
                    background: agent.isActive
                      ? 'rgba(239, 68, 68, 0.2)'
                      : 'rgba(16, 185, 129, 0.2)',
                    color: agent.isActive ? '#ef4444' : '#10b981',
                    padding: '8px 12px',
                    border: `1px solid ${agent.isActive ? '#ef4444' : '#10b981'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                >
                  {agent.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {/* Performance Rankings */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '15px',
              padding: '25px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              gridColumn: 'span 2',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '20px',
              }}
            >
              Agent Performance Rankings
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {agents
                .sort(
                  (a, b) =>
                    b.performanceMetrics.revenue - a.performanceMetrics.revenue
                )
                .map((agent, index) => (
                  <div
                    key={agent.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '15px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '10px',
                    }}
                  >
                    <div
                      style={{
                        background:
                          index === 0
                            ? '#f59e0b'
                            : index === 1
                              ? '#6b7280'
                              : index === 2
                                ? '#92400e'
                                : '#374151',
                        color: 'white',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 'bold',
                      }}
                    >
                      #{index + 1}
                    </div>
                    <div
                      style={{
                        background: 'linear-gradient(135deg, #f97316, #ea580c)',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontWeight: 'bold',
                      }}
                    >
                      {agent.firstName.charAt(0)}
                      {agent.lastName.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: 'bold',
                        }}
                      >
                        {agent.firstName} {agent.lastName}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '14px',
                        }}
                      >
                        {agent.performanceMetrics.loadsHandled} loads •{' '}
                        {agent.performanceMetrics.margin}% margin
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          color: '#3b82f6',
                          fontSize: '18px',
                          fontWeight: 'bold',
                        }}
                      >
                        ${agent.performanceMetrics.revenue.toLocaleString()}
                      </div>
                      <div
                        style={{
                          color: getPerformanceColor(
                            agent.performanceMetrics.customerRating
                          ),
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Star size={14} />
                        {agent.performanceMetrics.customerRating}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '20px',
          }}
        >
          {agents.map((agent) => (
            <div
              key={agent.id}
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '15px',
                padding: '25px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: 'bold',
                  }}
                >
                  {agent.firstName.charAt(0)}
                  {agent.lastName.charAt(0)}
                </div>
                <div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: 'bold',
                    }}
                  >
                    {agent.firstName} {agent.lastName}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                    }}
                  >
                    {agent.position}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {[
                  {
                    key: 'canCreateLoads',
                    label: 'Create Loads',
                    enabled: agent.permissions.canCreateLoads,
                  },
                  {
                    key: 'canModifyRates',
                    label: 'Modify Rates',
                    enabled: agent.permissions.canModifyRates,
                  },
                  {
                    key: 'canManageCarriers',
                    label: 'Manage Carriers',
                    enabled: agent.permissions.canManageCarriers,
                  },
                  {
                    key: 'canGenerateReports',
                    label: 'Generate Reports',
                    enabled: agent.permissions.canGenerateReports,
                  },
                  {
                    key: 'canAccessFinancials',
                    label: 'Access Financials',
                    enabled: agent.permissions.canAccessFinancials,
                  },
                ].map((permission) => (
                  <div
                    key={permission.key}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 0',
                    }}
                  >
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px',
                      }}
                    >
                      {permission.label}
                    </span>
                    {permission.enabled ? (
                      <CheckCircle size={18} style={{ color: '#10b981' }} />
                    ) : (
                      <XCircle size={18} style={{ color: '#ef4444' }} />
                    )}
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: '20px',
                  padding: '15px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '10px',
                }}
              >
                <div
                  style={{
                    color: '#3b82f6',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                  }}
                >
                  Contract Limits
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '12px',
                  }}
                >
                  Max Value: $
                  {agent.permissions.maxContractValue.toLocaleString()}
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '12px',
                  }}
                >
                  Approval Required: $
                  {agent.permissions.requiresApprovalOver.toLocaleString()}+
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedAgent(agent);
                  setShowPermissionsModal(true);
                }}
                style={{
                  width: '100%',
                  marginTop: '15px',
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#f59e0b',
                  padding: '10px',
                  border: '1px solid #f59e0b',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Edit3 size={16} />
                Edit Permissions
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Permissions Modal (simplified - would be expanded in production) */}
      {showPermissionsModal && selectedAgent && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.9)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '30px',
              maxWidth: '500px',
              width: '90%',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '20px',
              }}
            >
              Edit Permissions - {selectedAgent.firstName}{' '}
              {selectedAgent.lastName}
            </h3>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '20px',
              }}
            >
              Permission management UI would go here in production.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={() => setShowPermissionsModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  padding: '10px 20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowPermissionsModal(false)}
                style={{
                  background: 'linear-gradient(135deg, #f97316, #ea580c)',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
