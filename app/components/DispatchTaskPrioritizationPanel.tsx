'use client';

import { useEffect, useState } from 'react';
import { useFeatureFlag } from '../config/feature-flags';

// Dispatch-specific task prioritization interfaces
interface DispatchTaskPriority {
  id: string;
  type:
    | 'load_assignment'
    | 'driver_confirmation'
    | 'route_optimization'
    | 'pickup_coordination'
    | 'delivery_tracking'
    | 'invoice_creation'
    | 'customer_communication'
    | 'carrier_verification'
    | 'documentation_review'
    | 'emergency_response';
  title: string;
  description: string;
  urgencyScore: number; // 0-100
  profitabilityScore: number; // 0-100
  resourceRequirement: number; // 0-100 (complexity/effort)
  deadline?: string;
  associatedRevenue?: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  dependencies: string[]; // Task IDs that must be completed first
  estimatedDuration: number; // minutes
  assignedTo?: string;
  createdAt: string;
  metadata: {
    loadId?: string;
    customerId?: string;
    driverId?: string;
    carrierId?: string;
    dispatcherId: string;
    department: 'dispatch' | 'operations' | 'customer_service' | 'finance';
    businessImpact: 'low' | 'medium' | 'high' | 'critical';
    customerTier: 'standard' | 'preferred' | 'premium' | 'enterprise';
    loadValue?: number;
    deliveryWindow?: string;
  };
}

interface DispatchPrioritizedTaskList {
  tasks: DispatchTaskPriority[];
  prioritizationScore: number;
  reasoning: string[];
  optimizationMetrics: {
    totalRevenue: number;
    averageUrgency: number;
    resourceUtilization: number;
    riskMitigation: number;
    timeToCompletion: number;
    customerSatisfactionImpact: number;
  };
  recommendations: string[];
  lastUpdated: string;
}

export default function DispatchTaskPrioritizationPanel() {
  const isEnabled = useFeatureFlag('SMART_TASK_PRIORITIZATION');
  const [loading, setLoading] = useState(false);
  const [prioritizedTasks, setPrioritizedTasks] =
    useState<DispatchPrioritizedTaskList | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadDispatchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Generate sample dispatch tasks
      const sampleDispatchTasks: DispatchTaskPriority[] = [
        {
          id: 'dispatch-001',
          type: 'load_assignment',
          title: 'URGENT: Assign Load WMT-2025-001 - Walmart Distribution',
          description:
            'High-value Walmart load requires immediate driver assignment, pickup in 2 hours',
          urgencyScore: 95,
          profitabilityScore: 88,
          resourceRequirement: 60,
          deadline: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          associatedRevenue: 4500,
          riskLevel: 'critical',
          dependencies: [],
          estimatedDuration: 45,
          assignedTo: 'Sarah Johnson',
          createdAt: new Date().toISOString(),
          metadata: {
            loadId: 'WMT-2025-001',
            customerId: 'walmart-001',
            dispatcherId: 'disp-001',
            department: 'dispatch',
            businessImpact: 'critical',
            customerTier: 'enterprise',
            loadValue: 4500,
            deliveryWindow: '48 hours',
          },
        },
        {
          id: 'dispatch-002',
          type: 'driver_confirmation',
          title: 'Driver Confirmation Required - Amazon Load AMZ-2025-003',
          description:
            'Driver Mike Johnson needs to confirm acceptance of Amazon delivery to Seattle',
          urgencyScore: 80,
          profitabilityScore: 75,
          resourceRequirement: 30,
          deadline: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
          associatedRevenue: 3200,
          riskLevel: 'high',
          dependencies: ['dispatch-001'],
          estimatedDuration: 15,
          assignedTo: 'Sarah Johnson',
          createdAt: new Date().toISOString(),
          metadata: {
            loadId: 'AMZ-2025-003',
            customerId: 'amazon-001',
            driverId: 'mike-johnson-001',
            dispatcherId: 'disp-001',
            department: 'dispatch',
            businessImpact: 'high',
            customerTier: 'premium',
            loadValue: 3200,
            deliveryWindow: '72 hours',
          },
        },
        {
          id: 'dispatch-003',
          type: 'emergency_response',
          title: 'EMERGENCY: Driver Breakdown - Load TGT-2025-002',
          description:
            'Driver breakdown on I-35, need immediate replacement driver for Target delivery',
          urgencyScore: 98,
          profitabilityScore: 70,
          resourceRequirement: 85,
          deadline: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
          associatedRevenue: 2800,
          riskLevel: 'critical',
          dependencies: [],
          estimatedDuration: 90,
          assignedTo: 'Sarah Johnson',
          createdAt: new Date().toISOString(),
          metadata: {
            loadId: 'TGT-2025-002',
            customerId: 'target-001',
            driverId: 'breakdown-driver-001',
            dispatcherId: 'disp-001',
            department: 'operations',
            businessImpact: 'critical',
            customerTier: 'preferred',
            loadValue: 2800,
            deliveryWindow: '24 hours',
          },
        },
        {
          id: 'dispatch-004',
          type: 'route_optimization',
          title: 'Route Optimization - Multi-Stop Delivery HD-2025-005',
          description:
            'Optimize 5-stop route for Home Depot delivery to maximize efficiency',
          urgencyScore: 65,
          profitabilityScore: 82,
          resourceRequirement: 70,
          deadline: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
          associatedRevenue: 5200,
          riskLevel: 'medium',
          dependencies: [],
          estimatedDuration: 60,
          assignedTo: 'Sarah Johnson',
          createdAt: new Date().toISOString(),
          metadata: {
            loadId: 'HD-2025-005',
            customerId: 'homedepot-001',
            dispatcherId: 'disp-001',
            department: 'dispatch',
            businessImpact: 'high',
            customerTier: 'preferred',
            loadValue: 5200,
            deliveryWindow: '96 hours',
          },
        },
        {
          id: 'dispatch-005',
          type: 'customer_communication',
          title: 'Customer Update Required - FedEx Partnership FDX-2025-001',
          description:
            'Provide delivery status update to FedEx for strategic partnership load',
          urgencyScore: 55,
          profitabilityScore: 90,
          resourceRequirement: 25,
          deadline: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
          associatedRevenue: 6500,
          riskLevel: 'medium',
          dependencies: ['dispatch-004'],
          estimatedDuration: 20,
          assignedTo: 'Sarah Johnson',
          createdAt: new Date().toISOString(),
          metadata: {
            loadId: 'FDX-2025-001',
            customerId: 'fedex-001',
            dispatcherId: 'disp-001',
            department: 'customer_service',
            businessImpact: 'high',
            customerTier: 'enterprise',
            loadValue: 6500,
            deliveryWindow: '120 hours',
          },
        },
        {
          id: 'dispatch-006',
          type: 'invoice_creation',
          title: 'Create Invoice - Completed Load COST-2025-004',
          description:
            'Generate invoice for completed Costco delivery, payment due in 30 days',
          urgencyScore: 40,
          profitabilityScore: 85,
          resourceRequirement: 35,
          deadline: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
          associatedRevenue: 3800,
          riskLevel: 'low',
          dependencies: [],
          estimatedDuration: 30,
          assignedTo: 'Sarah Johnson',
          createdAt: new Date().toISOString(),
          metadata: {
            loadId: 'COST-2025-004',
            customerId: 'costco-001',
            dispatcherId: 'disp-001',
            department: 'finance',
            businessImpact: 'medium',
            customerTier: 'preferred',
            loadValue: 3800,
          },
        },
      ];

      // Create prioritization request
      const now = new Date();
      const prioritizationRequest = {
        tasks: sampleDispatchTasks,
        constraints: {
          availableResources: 80, // Dispatcher capacity
          maxTasksPerHour: 6,
          prioritizeRevenue: true,
          riskTolerance: 'balanced' as const,
          departmentFocus: ['dispatch', 'operations'],
        },
        businessContext: {
          currentHour: now.getHours(),
          dayOfWeek: now.getDay(),
          seasonalFactor: 1.0,
          marketConditions: 'busy' as const, // Dispatch is typically busy
        },
      };

      console.log('🎯 Starting task prioritization request...', prioritizationRequest);
      
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

      console.log('🎯 API Response status:', prioritizeResponse.status);
      
      if (!prioritizeResponse.ok) {
        const errorText = await prioritizeResponse.text();
        console.error('🎯 API Error:', errorText);
        throw new Error(`API request failed: ${prioritizeResponse.status} - ${errorText}`);
      }

      const prioritizeData = await prioritizeResponse.json();
      console.log('🎯 API Response data:', prioritizeData);

      if (prioritizeData.success) {
        // Enhance with dispatch-specific metrics
        const enhancedData: DispatchPrioritizedTaskList = {
          ...prioritizeData.data,
          optimizationMetrics: {
            ...prioritizeData.data.optimizationMetrics,
            customerSatisfactionImpact: Math.round(
              sampleDispatchTasks.reduce((sum, task) => {
                const tierScores = {
                  standard: 1,
                  preferred: 2,
                  premium: 3,
                  enterprise: 4,
                };
                return (
                  sum +
                  tierScores[task.metadata.customerTier] * task.urgencyScore
                );
              }, 0) / sampleDispatchTasks.length
            ),
          },
        };
        setPrioritizedTasks(enhancedData);
        console.log('🎯 Task prioritization completed successfully!');
      } else {
        console.error('🎯 API returned error:', prioritizeData.error);
        setError(prioritizeData.error || 'Failed to prioritize dispatch tasks');
      }
    } catch (error) {
      console.error('🎯 Error loading dispatch tasks:', error);
      setError(`Failed to load dispatch task prioritization: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEnabled) {
      loadDispatchTasks();
    }
  }, [isEnabled]);

  const getTaskTypeIcon = (type: DispatchTaskPriority['type']) => {
    const icons = {
      load_assignment: '🚛',
      driver_confirmation: '✅',
      route_optimization: '🗺️',
      pickup_coordination: '📍',
      delivery_tracking: '📦',
      invoice_creation: '🧾',
      customer_communication: '📞',
      carrier_verification: '🔍',
      documentation_review: '📋',
      emergency_response: '🚨',
    };
    return icons[type as keyof typeof icons] || '📋';
  };

  const getRiskColor = (riskLevel: DispatchTaskPriority['riskLevel']) => {
    const colors = {
      low: '#10b981',
      medium: '#f59e0b',
      high: '#ef4444',
      critical: '#dc2626',
    };
    return colors[riskLevel as keyof typeof colors] || '#6b7280';
  };

  const getCustomerTierColor = (
    tier: DispatchTaskPriority['metadata']['customerTier']
  ) => {
    const colors = {
      standard: '#6b7280',
      preferred: '#3b82f6',
      premium: '#8b5cf6',
      enterprise: '#f59e0b',
    };
    return colors[tier as keyof typeof colors] || '#6b7280';
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
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🚛</div>
        <h3 style={{ marginBottom: '8px' }}>Dispatch Task Prioritization</h3>
        <p style={{ opacity: 0.8 }}>
          AI-powered dispatch workflow optimization is not enabled
        </p>
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
            border: '3px solid #3b82f6',
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px',
          }}
        ></div>
        <h3 style={{ marginBottom: '8px' }}>AI Processing Dispatch Tasks...</h3>
        <p style={{ opacity: 0.8 }}>
          Analyzing loads, drivers, and operational priorities
        </p>
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
        <h3 style={{ marginBottom: '8px' }}>Error Loading Dispatch Tasks</h3>
        <p style={{ marginBottom: '16px', opacity: 0.8 }}>{error}</p>
        <button
          onClick={loadDispatchTasks}
          style={{
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
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
              color: '#3b82f6',
            }}
          >
            🚛 Dispatch Priority Queue
          </h3>
          <p style={{ fontSize: '0.8rem', opacity: 0.8, margin: 0 }}>
            AI-optimized task prioritization for dispatch operations
          </p>
        </div>
        <button
          onClick={loadDispatchTasks}
          disabled={loading}
          style={{
            background: loading
              ? '#6b7280'
              : 'linear-gradient(135deg, #3b82f6, #1e40af)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '0.8rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          {loading ? 'Processing...' : 'Refresh'}
        </button>
      </div>

      {prioritizedTasks && (
        <>
          {/* Dispatch Metrics */}
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
                  color: '#ef4444',
                }}
              >
                {
                  prioritizedTasks.tasks.filter(
                    (t) => t.riskLevel === 'critical'
                  ).length
                }
              </div>
              <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Critical</div>
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
                  prioritizedTasks.optimizationMetrics.totalRevenue / 1000
                ).toFixed(0)}
                K
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
                  color: '#10b981',
                }}
              >
                {
                  prioritizedTasks.optimizationMetrics
                    .customerSatisfactionImpact
                }
                %
              </div>
              <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                Customer Impact
              </div>
            </div>
          </div>

          {/* Prioritized Dispatch Tasks */}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {prioritizedTasks.tasks.slice(0, 5).map((task, index) => (
              <div
                key={task.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${getRiskColor(task.riskLevel)}40`,
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
                        background: '#3b82f6',
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

                    <span
                      style={{
                        background: getCustomerTierColor(
                          task.metadata.customerTier
                        ),
                        color: 'white',
                        padding: '3px 6px',
                        borderRadius: '4px',
                        fontSize: '0.6rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                      }}
                    >
                      {task.metadata.customerTier}
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
                    {((task.associatedRevenue || 0) / 1000).toFixed(1)}K
                  </div>
                  <div>
                    <strong>Load:</strong> {task.metadata.loadId}
                  </div>
                  <div>
                    <strong>Duration:</strong> {task.estimatedDuration}min
                  </div>
                  <div>
                    <strong>Department:</strong> {task.metadata.department}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Insights */}
          {prioritizedTasks.recommendations.length > 0 && (
            <div
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
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
                  AI Dispatch Recommendations
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                {prioritizedTasks.recommendations.slice(0, 3).map((rec, i) => (
                  <div key={i} style={{ marginBottom: '4px' }}>
                    • {rec}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
