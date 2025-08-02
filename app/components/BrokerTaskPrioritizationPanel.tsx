'use client';

import { useEffect, useState } from 'react';
import { useFeatureFlag } from '../config/feature-flags';

interface BrokerTask {
  id: string;
  type:
    | 'customer_followup'
    | 'contract_renewal'
    | 'carrier_onboarding'
    | 'compliance_deadline'
    | 'revenue_opportunity'
    | 'risk_mitigation'
    | 'quote_followup'
    | 'relationship_management'
    | 'market_analysis'
    | 'operational_efficiency';
  title: string;
  description: string;
  urgencyScore: number;
  profitabilityScore: number;
  resourceRequirement: number;
  deadline: string;
  associatedRevenue: number;
  riskLevel: 'low' | 'medium' | 'high';
  dependencies: string[];
  estimatedDuration: number;
  assignedTo: string;
  createdAt: string;
  metadata?: {
    customerId?: string;
    carrierId?: string;
    contractValue?: number;
    renewalDate?: string;
    complianceType?: string;
    marketSegment?: string;
    relationshipTier?: string;
    businessImpact?: 'low' | 'medium' | 'high' | 'critical';
  };
}

interface BrokerTaskMetrics {
  totalTasks: number;
  criticalTasks: number;
  highPriorityTasks: number;
  averageUrgency: number;
  revenueAtRisk: number;
  complianceDeadlines: number;
  customerTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  workflowEfficiency: number;
}

interface BrokerTaskPrioritizationPanelProps {
  brokerId?: string;
  tenantId?: string;
}

export default function BrokerTaskPrioritizationPanel({
  brokerId = 'broker-001',
  tenantId = 'tenant-demo-123',
}: BrokerTaskPrioritizationPanelProps) {
  const isEnabled = useFeatureFlag('SMART_TASK_PRIORITIZATION');
  const [activeTab, setActiveTab] = useState<
    'priority-queue' | 'metrics' | 'insights'
  >('priority-queue');
  const [prioritizedTasks, setPrioritizedTasks] = useState<BrokerTask[]>([]);
  const [metrics, setMetrics] = useState<BrokerTaskMetrics | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sample broker operational tasks
  const sampleBrokerTasks: BrokerTask[] = [
    {
      id: 'task-001',
      type: 'customer_followup',
      title: 'Follow up with Walmart on Q1 contract',
      description:
        'High-value customer requires immediate attention for contract renewal discussion',
      urgencyScore: 85,
      profitabilityScore: 95,
      resourceRequirement: 60,
      deadline: '2025-01-05T17:00:00Z',
      associatedRevenue: 250000,
      riskLevel: 'high',
      dependencies: [],
      estimatedDuration: 120,
      assignedTo: brokerId,
      createdAt: '2025-01-02T08:00:00Z',
      metadata: {
        customerId: 'walmart-001',
        contractValue: 250000,
        renewalDate: '2025-02-01',
        relationshipTier: 'Platinum',
        businessImpact: 'critical',
      },
    },
    {
      id: 'task-002',
      type: 'contract_renewal',
      title: 'Amazon contract renewal - 30 days notice',
      description:
        'Major contract expiring soon, requires immediate renewal negotiation',
      urgencyScore: 90,
      profitabilityScore: 88,
      resourceRequirement: 80,
      deadline: '2025-01-15T12:00:00Z',
      associatedRevenue: 180000,
      riskLevel: 'high',
      dependencies: ['legal-review', 'pricing-analysis'],
      estimatedDuration: 240,
      assignedTo: brokerId,
      createdAt: '2025-01-01T09:00:00Z',
      metadata: {
        customerId: 'amazon-001',
        contractValue: 180000,
        renewalDate: '2025-02-15',
        relationshipTier: 'Gold',
        businessImpact: 'critical',
      },
    },
    {
      id: 'task-003',
      type: 'carrier_onboarding',
      title: 'Complete ABC Trucking onboarding',
      description:
        'New high-capacity carrier needs final verification and contract signing',
      urgencyScore: 70,
      profitabilityScore: 75,
      resourceRequirement: 45,
      deadline: '2025-01-08T16:00:00Z',
      associatedRevenue: 45000,
      riskLevel: 'medium',
      dependencies: ['insurance-verification', 'background-check'],
      estimatedDuration: 90,
      assignedTo: brokerId,
      createdAt: '2025-01-02T10:00:00Z',
      metadata: {
        carrierId: 'abc-trucking-001',
        businessImpact: 'medium',
      },
    },
    {
      id: 'task-004',
      type: 'compliance_deadline',
      title: 'Q4 DOT compliance reporting due',
      description:
        'Quarterly compliance reports must be submitted to avoid penalties',
      urgencyScore: 95,
      profitabilityScore: 30,
      resourceRequirement: 70,
      deadline: '2025-01-10T23:59:00Z',
      associatedRevenue: 0,
      riskLevel: 'high',
      dependencies: ['data-collection', 'audit-review'],
      estimatedDuration: 180,
      assignedTo: brokerId,
      createdAt: '2024-12-15T08:00:00Z',
      metadata: {
        complianceType: 'DOT-quarterly',
        businessImpact: 'high',
      },
    },
    {
      id: 'task-005',
      type: 'revenue_opportunity',
      title: 'Target Stores expansion opportunity',
      description:
        'New regional expansion requires immediate proposal submission',
      urgencyScore: 75,
      profitabilityScore: 92,
      resourceRequirement: 85,
      deadline: '2025-01-12T15:00:00Z',
      associatedRevenue: 320000,
      riskLevel: 'medium',
      dependencies: ['market-analysis', 'capacity-planning'],
      estimatedDuration: 300,
      assignedTo: brokerId,
      createdAt: '2025-01-01T14:00:00Z',
      metadata: {
        customerId: 'target-001',
        marketSegment: 'retail',
        businessImpact: 'critical',
      },
    },
    {
      id: 'task-006',
      type: 'quote_followup',
      title: 'Follow up on Home Depot quote',
      description:
        'High-value quote submitted 3 days ago, needs follow-up call',
      urgencyScore: 65,
      profitabilityScore: 70,
      resourceRequirement: 30,
      deadline: '2025-01-06T14:00:00Z',
      associatedRevenue: 85000,
      riskLevel: 'medium',
      dependencies: [],
      estimatedDuration: 45,
      assignedTo: brokerId,
      createdAt: '2025-01-02T11:00:00Z',
      metadata: {
        customerId: 'homedepot-001',
        relationshipTier: 'Gold',
        businessImpact: 'medium',
      },
    },
  ];

  const fetchPrioritizedTasks = async () => {
    if (!isEnabled) {
      // Fallback to basic sorting
      const sorted = [...sampleBrokerTasks].sort(
        (a, b) => b.urgencyScore - a.urgencyScore
      );
      setPrioritizedTasks(sorted);
      setMetrics({
        totalTasks: sorted.length,
        criticalTasks: sorted.filter((t) => t.urgencyScore >= 85).length,
        highPriorityTasks: sorted.filter((t) => t.urgencyScore >= 70).length,
        averageUrgency:
          sorted.reduce((sum, t) => sum + t.urgencyScore, 0) / sorted.length,
        revenueAtRisk: sorted.reduce((sum, t) => sum + t.associatedRevenue, 0),
        complianceDeadlines: sorted.filter(
          (t) => t.type === 'compliance_deadline'
        ).length,
        customerTier: 'Gold',
        workflowEfficiency: 78,
      });
      setRecommendations([
        'Enable Smart Task Prioritization for AI-powered broker task optimization',
        'Focus on high-revenue customer followups first',
        'Schedule compliance tasks during low-activity hours',
      ]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analytics/task-prioritization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'prioritize-tasks',
          tasks: sampleBrokerTasks,
          constraints: {
            availableResources: 100,
            maxTasksPerHour: 3,
            prioritizeRevenue: true,
            riskTolerance: 'conservative',
            departmentFocus: ['broker', 'sales', 'operations'],
          },
          businessContext: {
            currentHour: new Date().getHours(),
            dayOfWeek: new Date().getDay(),
            seasonalFactor: 1.0,
            marketConditions: 'normal',
          },
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to prioritize broker tasks: ${response.status}`
        );
      }

      const result = await response.json();

      if (result.success) {
        setPrioritizedTasks(
          result.prioritizedTasks || result.data?.prioritizedTasks || []
        );

        // Calculate broker-specific metrics
        const tasks =
          result.prioritizedTasks || result.data?.prioritizedTasks || [];
        const totalRevenue = tasks.reduce(
          (sum: number, task: BrokerTask) => sum + task.associatedRevenue,
          0
        );

        setMetrics({
          totalTasks: tasks.length,
          criticalTasks: tasks.filter((t: BrokerTask) => t.urgencyScore >= 85)
            .length,
          highPriorityTasks: tasks.filter(
            (t: BrokerTask) => t.urgencyScore >= 70
          ).length,
          averageUrgency:
            tasks.reduce(
              (sum: number, t: BrokerTask) => sum + t.urgencyScore,
              0
            ) / tasks.length,
          revenueAtRisk: totalRevenue,
          complianceDeadlines: tasks.filter(
            (t: BrokerTask) => t.type === 'compliance_deadline'
          ).length,
          customerTier:
            totalRevenue > 500000
              ? 'Platinum'
              : totalRevenue > 300000
                ? 'Gold'
                : totalRevenue > 150000
                  ? 'Silver'
                  : 'Bronze',
          workflowEfficiency: Math.round(
            result.data?.optimizationMetrics?.resourceUtilization || 78
          ),
        });

        setRecommendations(
          result.recommendations || result.data?.recommendations || []
        );
      } else {
        throw new Error(result.error || 'Failed to prioritize broker tasks');
      }
    } catch (err) {
      console.error('Error fetching prioritized broker tasks:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to load prioritized tasks'
      );

      // Fallback to basic sorting
      const sorted = [...sampleBrokerTasks].sort(
        (a, b) => b.urgencyScore - a.urgencyScore
      );
      setPrioritizedTasks(sorted);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrioritizedTasks();
  }, [isEnabled]);

  const getPriorityColor = (urgencyScore: number) => {
    if (urgencyScore >= 85) return '#dc2626'; // Critical - Red
    if (urgencyScore >= 70) return '#f97316'; // High - Orange
    if (urgencyScore >= 50) return '#eab308'; // Medium - Yellow
    return '#22c55e'; // Low - Green
  };

  const getTaskTypeIcon = (type: BrokerTask['type']) => {
    switch (type) {
      case 'customer_followup':
        return '📞';
      case 'contract_renewal':
        return '📋';
      case 'carrier_onboarding':
        return '🚛';
      case 'compliance_deadline':
        return '⚖️';
      case 'revenue_opportunity':
        return '💰';
      case 'risk_mitigation':
        return '🛡️';
      case 'quote_followup':
        return '💬';
      case 'relationship_management':
        return '🤝';
      case 'market_analysis':
        return '📊';
      case 'operational_efficiency':
        return '⚙️';
      default:
        return '📝';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!isEnabled) {
    return (
      <div
        style={{
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'center',
          color: '#6b7280',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
        <h3 style={{ color: '#111827', marginBottom: '8px' }}>
          Smart Task Prioritization
        </h3>
        <p>
          Enable Smart Task Prioritization in feature flags to unlock AI-powered
          broker task optimization
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
          padding: '24px',
          color: 'white',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>🎯</span>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
              AI Broker Task Prioritization
            </h2>
            <p style={{ margin: '4px 0 0 0', opacity: 0.9, fontSize: '14px' }}>
              Intelligent operational task management for maximum efficiency
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          padding: '0 24px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {[
          { id: 'priority-queue', label: 'Priority Queue', icon: '📋' },
          { id: 'metrics', label: 'Metrics', icon: '📊' },
          { id: 'insights', label: 'AI Insights', icon: '🧠' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '16px 20px',
              background: 'none',
              border: 'none',
              color: activeTab === tab.id ? '#6366f1' : '#6b7280',
              fontWeight: activeTab === tab.id ? '600' : '400',
              borderBottom:
                activeTab === tab.id
                  ? '3px solid #6366f1'
                  : '3px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '14px',
            }}
          >
            <span style={{ marginRight: '8px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '24px' }}>
        {loading ? (
          <div
            style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}
          >
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
            <p>Analyzing broker tasks with AI...</p>
          </div>
        ) : error ? (
          <div
            style={{ textAlign: 'center', padding: '40px', color: '#dc2626' }}
          >
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>⚠️</div>
            <p>{error}</p>
          </div>
        ) : (
          <>
            {activeTab === 'priority-queue' && (
              <div>
                <h3
                  style={{
                    color: '#111827',
                    marginBottom: '20px',
                    fontSize: '18px',
                    fontWeight: '600',
                  }}
                >
                  🎯 Prioritized Broker Tasks
                </h3>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {prioritizedTasks.slice(0, 8).map((task, index) => (
                    <div
                      key={task.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
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
                            {getTaskTypeIcon(task.type)}
                          </span>
                          <div>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                              }}
                            >
                              <span
                                style={{
                                  background: getPriorityColor(
                                    task.urgencyScore
                                  ),
                                  color: 'white',
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                }}
                              >
                                #{index + 1}
                              </span>
                              <h4
                                style={{
                                  margin: 0,
                                  color: '#111827',
                                  fontSize: '16px',
                                  fontWeight: '600',
                                }}
                              >
                                {task.title}
                              </h4>
                            </div>
                            <p
                              style={{
                                margin: '4px 0 0 0',
                                color: '#6b7280',
                                fontSize: '14px',
                              }}
                            >
                              {task.description}
                            </p>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div
                            style={{
                              color: '#111827',
                              fontWeight: '600',
                              fontSize: '14px',
                            }}
                          >
                            {formatCurrency(task.associatedRevenue)}
                          </div>
                          <div style={{ color: '#6b7280', fontSize: '12px' }}>
                            {task.estimatedDuration}min
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          gap: '16px',
                          fontSize: '12px',
                          color: '#6b7280',
                        }}
                      >
                        <span>Urgency: {task.urgencyScore}%</span>
                        <span>Revenue Impact: {task.profitabilityScore}%</span>
                        <span>Risk: {task.riskLevel.toUpperCase()}</span>
                        <span>
                          Due: {new Date(task.deadline).toLocaleDateString()}
                        </span>
                      </div>

                      {task.metadata?.relationshipTier && (
                        <div style={{ marginTop: '8px' }}>
                          <span
                            style={{
                              background:
                                task.metadata.relationshipTier === 'Platinum'
                                  ? '#6366f1'
                                  : task.metadata.relationshipTier === 'Gold'
                                    ? '#f59e0b'
                                    : task.metadata.relationshipTier ===
                                        'Silver'
                                      ? '#6b7280'
                                      : '#22c55e',
                              color: 'white',
                              padding: '2px 8px',
                              borderRadius: '8px',
                              fontSize: '11px',
                              fontWeight: '600',
                            }}
                          >
                            {task.metadata.relationshipTier} Customer
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'metrics' && metrics && (
              <div>
                <h3
                  style={{
                    color: '#111827',
                    marginBottom: '20px',
                    fontSize: '18px',
                    fontWeight: '600',
                  }}
                >
                  📊 Broker Performance Metrics
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    marginBottom: '24px',
                  }}
                >
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                      borderRadius: '12px',
                      padding: '20px',
                      color: 'white',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
                      {metrics.criticalTasks}
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>
                      Critical Tasks
                    </div>
                  </div>
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #f97316, #ea580c)',
                      borderRadius: '12px',
                      padding: '20px',
                      color: 'white',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
                      {metrics.highPriorityTasks}
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>
                      High Priority
                    </div>
                  </div>
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                      borderRadius: '12px',
                      padding: '20px',
                      color: 'white',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
                      {formatCurrency(metrics.revenueAtRisk)}
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>
                      Revenue Pipeline
                    </div>
                  </div>
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                      borderRadius: '12px',
                      padding: '20px',
                      color: 'white',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
                      {Math.round(metrics.averageUrgency)}%
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>
                      Avg Urgency
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <h4 style={{ color: '#111827', marginBottom: '12px' }}>
                      Customer Tier Status
                    </h4>
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#6366f1',
                      }}
                    >
                      {metrics.customerTier}
                    </div>
                    <p
                      style={{
                        color: '#6b7280',
                        fontSize: '14px',
                        margin: '8px 0 0 0',
                      }}
                    >
                      Based on pipeline value and relationship quality
                    </p>
                  </div>
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <h4 style={{ color: '#111827', marginBottom: '12px' }}>
                      Workflow Efficiency
                    </h4>
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#22c55e',
                      }}
                    >
                      {metrics.workflowEfficiency}%
                    </div>
                    <p
                      style={{
                        color: '#6b7280',
                        fontSize: '14px',
                        margin: '8px 0 0 0',
                      }}
                    >
                      Task completion and resource utilization rate
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'insights' && (
              <div>
                <h3
                  style={{
                    color: '#111827',
                    marginBottom: '20px',
                    fontSize: '18px',
                    fontWeight: '600',
                  }}
                >
                  🧠 AI-Powered Recommendations
                </h3>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {recommendations.map((recommendation, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '16px',
                      }}
                    >
                      <span style={{ fontSize: '24px' }}>💡</span>
                      <div>
                        <p
                          style={{
                            margin: 0,
                            color: '#111827',
                            fontSize: '16px',
                            lineHeight: '1.5',
                          }}
                        >
                          {recommendation}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Additional broker-specific insights */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                      borderRadius: '12px',
                      padding: '20px',
                      color: 'white',
                    }}
                  >
                    <h4
                      style={{
                        margin: '0 0 12px 0',
                        fontSize: '16px',
                        fontWeight: '600',
                      }}
                    >
                      🎯 Priority Focus Areas
                    </h4>
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: '20px',
                        lineHeight: '1.6',
                      }}
                    >
                      <li>
                        Contract renewals require immediate attention (2
                        critical deadlines)
                      </li>
                      <li>
                        High-value customer relationships need proactive
                        management
                      </li>
                      <li>
                        Compliance deadlines cannot be delayed - schedule
                        dedicated time
                      </li>
                      <li>
                        Revenue opportunities should be pursued during peak
                        hours
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
