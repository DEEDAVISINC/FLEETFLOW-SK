'use client';

import { useEffect, useState } from 'react';
import { useFeatureFlag } from '../config/feature-flags';

interface RFxTaskPriority {
  id: string;
  type:
    | 'rfx_response'
    | 'bid_analysis'
    | 'document_review'
    | 'competitive_research'
    | 'proposal_creation'
    | 'follow_up'
    | 'contract_negotiation';
  title: string;
  description: string;
  urgencyScore: number; // 0-100
  profitabilityScore: number; // 0-100
  resourceRequirement: number; // 0-100 (complexity/effort)
  deadline?: string;
  associatedRevenue?: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  dependencies: string[];
  estimatedDuration: number; // minutes
  assignedTo?: string;
  createdAt: string;
  metadata: {
    rfxId?: string;
    customerId?: string;
    documentType?: 'RFP' | 'RFQ' | 'RFI' | 'RFB';
    bidValue?: number;
    competitorCount?: number;
    winProbability?: number;
    department: 'rfx_team' | 'sales' | 'operations' | 'management';
    businessImpact: 'low' | 'medium' | 'high' | 'critical';
  };
}

interface RFxPrioritizedTaskList {
  result: RFxTaskPriority[];
  confidence: number;
  reasoning: string;
  recommendations: string[];
  riskFactors: string[];
  prioritizationScore: number;
  optimizationMetrics: {
    totalRevenue: number;
    averageUrgency: number;
    resourceUtilization: number;
    riskMitigation: number;
    timeToCompletion: number;
    winProbability: number;
  };
  lastUpdated: string;
}

export default function RFxTaskPrioritizationPanel() {
  const isEnabled = useFeatureFlag('SMART_TASK_PRIORITIZATION');
  const [loading, setLoading] = useState(false);
  const [prioritizedTasks, setPrioritizedTasks] =
    useState<RFxPrioritizedTaskList | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-load and prioritize RFx tasks on component mount
  useEffect(() => {
    if (isEnabled) {
      loadAndPrioritizeRFxTasks();
    }
  }, [isEnabled]);

  const loadAndPrioritizeRFxTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Generate sample RFx tasks
      const sampleRFxTasks: RFxTaskPriority[] = [
        {
          id: 'rfx-001',
          type: 'rfx_response',
          title: 'Submit RFP Response - Walmart Distribution Contract',
          description:
            'High-value RFP for nationwide distribution services, $2.5M annual contract',
          urgencyScore: 95,
          profitabilityScore: 90,
          resourceRequirement: 80,
          deadline: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
          associatedRevenue: 2500000,
          riskLevel: 'critical',
          dependencies: [],
          estimatedDuration: 240,
          assignedTo: 'rfx-team-lead',
          createdAt: new Date().toISOString(),
          metadata: {
            rfxId: 'RFP-WMT-2024-001',
            customerId: 'WALMART-001',
            documentType: 'RFP',
            bidValue: 2500000,
            competitorCount: 8,
            winProbability: 75,
            department: 'rfx_team',
            businessImpact: 'critical',
          },
        },
        {
          id: 'rfx-002',
          type: 'competitive_research',
          title: 'Competitive Analysis - Amazon Logistics RFQ',
          description:
            'Research competitor pricing and capabilities for Amazon last-mile delivery RFQ',
          urgencyScore: 80,
          profitabilityScore: 85,
          resourceRequirement: 60,
          deadline: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours from now
          associatedRevenue: 1800000,
          riskLevel: 'high',
          dependencies: [],
          estimatedDuration: 120,
          assignedTo: 'market-analyst',
          createdAt: new Date().toISOString(),
          metadata: {
            rfxId: 'RFQ-AMZ-2024-003',
            customerId: 'AMAZON-001',
            documentType: 'RFQ',
            bidValue: 1800000,
            competitorCount: 12,
            winProbability: 60,
            department: 'sales',
            businessImpact: 'high',
          },
        },
        {
          id: 'rfx-003',
          type: 'proposal_creation',
          title: 'Create Technical Proposal - FedEx Partnership RFI',
          description:
            'Develop comprehensive technical proposal for strategic partnership opportunity',
          urgencyScore: 70,
          profitabilityScore: 95,
          resourceRequirement: 90,
          deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
          associatedRevenue: 5000000,
          riskLevel: 'medium',
          dependencies: ['rfx-002'],
          estimatedDuration: 360,
          assignedTo: 'proposal-team',
          createdAt: new Date().toISOString(),
          metadata: {
            rfxId: 'RFI-FDX-2024-007',
            customerId: 'FEDEX-001',
            documentType: 'RFI',
            bidValue: 5000000,
            competitorCount: 5,
            winProbability: 80,
            department: 'rfx_team',
            businessImpact: 'critical',
          },
        },
        {
          id: 'rfx-004',
          type: 'document_review',
          title: 'Review RFB Documentation - Home Depot Freight Services',
          description:
            'Analyze RFB requirements and identify key compliance requirements',
          urgencyScore: 60,
          profitabilityScore: 70,
          resourceRequirement: 40,
          deadline: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours from now
          associatedRevenue: 800000,
          riskLevel: 'medium',
          dependencies: [],
          estimatedDuration: 90,
          assignedTo: 'compliance-specialist',
          createdAt: new Date().toISOString(),
          metadata: {
            rfxId: 'RFB-HD-2024-012',
            customerId: 'HOMEDEPOT-001',
            documentType: 'RFB',
            bidValue: 800000,
            competitorCount: 15,
            winProbability: 45,
            department: 'operations',
            businessImpact: 'medium',
          },
        },
        {
          id: 'rfx-005',
          type: 'follow_up',
          title: 'Follow Up - Target Supply Chain RFP Status',
          description:
            'Check status and provide additional information for pending RFP submission',
          urgencyScore: 40,
          profitabilityScore: 75,
          resourceRequirement: 30,
          deadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours from now
          associatedRevenue: 1200000,
          riskLevel: 'low',
          dependencies: [],
          estimatedDuration: 60,
          assignedTo: 'account-manager',
          createdAt: new Date().toISOString(),
          metadata: {
            rfxId: 'RFP-TGT-2024-005',
            customerId: 'TARGET-001',
            documentType: 'RFP',
            bidValue: 1200000,
            competitorCount: 6,
            winProbability: 70,
            department: 'sales',
            businessImpact: 'medium',
          },
        },
      ];

      // Auto-prioritize with RFx-specific constraints
      const now = new Date();
      const prioritizationRequest = {
        tasks: sampleRFxTasks,
        constraints: {
          availableResources: 90,
          maxTasksPerHour: 6,
          prioritizeRevenue: true,
          riskTolerance: 'balanced' as const,
          departmentFocus: ['rfx_team', 'sales'],
        },
        businessContext: {
          currentHour: now.getHours(),
          dayOfWeek: now.getDay(),
          seasonalFactor: 1.0,
          marketConditions: 'busy' as const, // RFx environment is typically busy
        },
      };

      const prioritizeResponse = await fetch(
        '/api/analytics/task-prioritization',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'prioritize-tasks',
            ...prioritizationRequest,
          }),
        }
      );

      const prioritizeData = await prioritizeResponse.json();
      if (prioritizeData.success) {
        // Enhance with RFx-specific metrics
        const enhancedData = {
          ...prioritizeData.data,
          optimizationMetrics: {
            ...prioritizeData.data.optimizationMetrics,
            winProbability: Math.round(
              sampleRFxTasks.reduce(
                (sum, task) => sum + (task.metadata.winProbability || 0),
                0
              ) / sampleRFxTasks.length
            ),
          },
        };
        setPrioritizedTasks(enhancedData);
      } else {
        setError(prioritizeData.message || 'Failed to prioritize RFx tasks');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getTaskTypeIcon = (type: string) => {
    const icons = {
      rfx_response: '📝',
      bid_analysis: '📊',
      document_review: '📋',
      competitive_research: '🔍',
      proposal_creation: '📄',
      follow_up: '📞',
      contract_negotiation: '🤝',
    };
    return icons[type as keyof typeof icons] || '📋';
  };

  const getRiskColor = (riskLevel: string) => {
    const colors = {
      low: '#10b981',
      medium: '#f59e0b',
      high: '#ef4444',
      critical: '#dc2626',
    };
    return colors[riskLevel as keyof typeof colors] || '#6b7280';
  };

  const formatTimeUntilDeadline = (deadline?: string) => {
    if (!deadline) return 'No deadline';

    const now = new Date();
    const deadlineDate = new Date(deadline);
    const hoursUntil =
      (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntil < 0) return 'Overdue';
    if (hoursUntil < 1) return `${Math.round(hoursUntil * 60)}m`;
    if (hoursUntil < 24) return `${Math.round(hoursUntil)}h`;
    return `${Math.round(hoursUntil / 24)}d`;
  };

  if (!isEnabled) {
    return (
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎯</div>
        <h3 style={{ marginBottom: '8px' }}>RFx Task Prioritization</h3>
        <p style={{ opacity: 0.8 }}>Feature currently disabled</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            border: '3px solid #f59e0b',
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px',
          }}
        ></div>
        <h3 style={{ marginBottom: '8px' }}>AI Processing RFx Tasks...</h3>
        <p style={{ opacity: 0.8 }}>Analyzing opportunities and deadlines</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center',
          color: '#fca5a5',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>❌</div>
        <h3 style={{ marginBottom: '8px' }}>Error Loading RFx Tasks</h3>
        <p style={{ opacity: 0.8 }}>{error}</p>
        <button
          onClick={loadAndPrioritizeRFxTasks}
          style={{
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            marginTop: '16px',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '24px',
        color: 'white',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              marginBottom: '4px',
              color: '#f59e0b',
            }}
          >
            🎯 RFx Priority Queue
          </h3>
          <p style={{ opacity: 0.8, fontSize: '0.85rem' }}>
            AI-optimized RFx task prioritization
          </p>
        </div>
        <button
          onClick={loadAndPrioritizeRFxTasks}
          disabled={loading}
          style={{
            background: loading
              ? '#6b7280'
              : 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          {loading ? '🔄' : '⚡'} Refresh
        </button>
      </div>

      {prioritizedTasks && (
        <>
          {/* RFx Metrics */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '12px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#10b981',
                }}
              >
                {prioritizedTasks.optimizationMetrics.winProbability}%
              </div>
              <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                Avg Win Rate
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '12px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#f59e0b',
                }}
              >
                $
                {(
                  prioritizedTasks.optimizationMetrics.totalRevenue / 1000000
                ).toFixed(1)}
                M
              </div>
              <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                Total Value
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '12px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#3b82f6',
                }}
              >
                {prioritizedTasks.optimizationMetrics.averageUrgency}%
              </div>
              <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Urgency</div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '12px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#8b5cf6',
                }}
              >
                {prioritizedTasks.optimizationMetrics.timeToCompletion}h
              </div>
              <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Est. Time</div>
            </div>
          </div>

          {/* Prioritized RFx Tasks */}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {prioritizedTasks.result.slice(0, 4).map((task, index) => (
              <div
                key={task.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${getRiskColor(task.riskLevel)}40`,
                  borderLeft: `4px solid ${getRiskColor(task.riskLevel)}`,
                  borderRadius: '8px',
                  padding: '16px',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>
                      {getTaskTypeIcon(task.type)}
                    </span>
                    <span
                      style={{
                        background: '#f59e0b',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                      }}
                    >
                      #{index + 1}
                    </span>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: '0.9rem',
                        fontWeight: '600',
                      }}
                    >
                      {task.title}
                    </h4>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: '6px',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        background: getRiskColor(task.riskLevel),
                        color: 'white',
                        padding: '3px 6px',
                        borderRadius: '4px',
                        fontSize: '0.6rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                      }}
                    >
                      {task.riskLevel}
                    </span>

                    <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                      ⏰ {formatTimeUntilDeadline(task.deadline)}
                    </span>
                  </div>
                </div>

                <p
                  style={{
                    margin: '0 0 10px 0',
                    fontSize: '0.8rem',
                    opacity: 0.8,
                  }}
                >
                  {task.description}
                </p>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                    gap: '8px',
                    fontSize: '0.7rem',
                  }}
                >
                  <div>
                    <strong>Value:</strong> $
                    {((task.associatedRevenue || 0) / 1000000).toFixed(1)}M
                  </div>
                  <div>
                    <strong>Win Rate:</strong> {task.metadata.winProbability}%
                  </div>
                  <div>
                    <strong>Competitors:</strong>{' '}
                    {task.metadata.competitorCount}
                  </div>
                  <div>
                    <strong>Type:</strong> {task.metadata.documentType}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Insights */}
          {prioritizedTasks.recommendations.length > 0 && (
            <div
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '8px',
                padding: '16px',
                marginTop: '16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>🧠</span>
                <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                  AI RFx Recommendations
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                {prioritizedTasks.recommendations[0]}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
