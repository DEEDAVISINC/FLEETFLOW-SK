'use client';

import { useEffect, useState } from 'react';
import { useFeatureFlag } from '../config/feature-flags';

// Scheduling-specific task prioritization interfaces
interface SchedulingTaskPriority {
  id: string;
  type:
    | 'schedule_creation'
    | 'conflict_resolution'
    | 'driver_assignment'
    | 'vehicle_assignment'
    | 'hos_compliance_check'
    | 'route_optimization'
    | 'maintenance_scheduling'
    | 'schedule_modification'
    | 'availability_update'
    | 'license_verification'
    | 'inspection_scheduling'
    | 'emergency_reschedule';
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
    scheduleId?: string;
    driverId?: string;
    vehicleId?: string;
    loadId?: string;
    schedulerId: string;
    department: 'scheduling' | 'operations' | 'compliance' | 'maintenance';
    businessImpact: 'low' | 'medium' | 'high' | 'critical';
    scheduleType:
      | 'Delivery'
      | 'Pickup'
      | 'Maintenance'
      | 'Training'
      | 'Inspection'
      | 'Break'
      | 'Other';
    hosImpact?: 'none' | 'warning' | 'violation_risk' | 'critical_violation';
    conflictSeverity?: 'minor' | 'moderate' | 'major' | 'blocking';
    complianceRequired?: boolean;
    resourcesNeeded?: string[];
  };
}

interface SchedulingPrioritizedTaskList {
  tasks: SchedulingTaskPriority[];
  prioritizationScore: number;
  reasoning: string[];
  optimizationMetrics: {
    totalRevenue: number;
    averageUrgency: number;
    resourceUtilization: number;
    riskMitigation: number;
    timeToCompletion: number;
    hosComplianceImpact: number;
    conflictResolutionRate: number;
  };
  recommendations: string[];
  lastUpdated: string;
}

export default function SchedulingTaskPrioritizationPanel() {
  const isEnabled = useFeatureFlag('SMART_TASK_PRIORITIZATION');
  const [loading, setLoading] = useState(false);
  const [prioritizedTasks, setPrioritizedTasks] =
    useState<SchedulingPrioritizedTaskList | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadSchedulingTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Generate sample scheduling tasks
      const sampleSchedulingTasks: SchedulingTaskPriority[] = [
        {
          id: 'sched-001',
          type: 'emergency_reschedule',
          title: 'CRITICAL: Emergency Reschedule - Driver Breakdown I-35',
          description:
            'Driver Mike Johnson broke down on I-35, need immediate reschedule for 3 affected deliveries',
          urgencyScore: 98,
          profitabilityScore: 75,
          resourceRequirement: 90,
          deadline: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          associatedRevenue: 8500,
          riskLevel: 'critical',
          dependencies: [],
          estimatedDuration: 45,
          assignedTo: 'Sarah Martinez',
          createdAt: new Date().toISOString(),
          metadata: {
            scheduleId: 'SCH-2025-001',
            driverId: 'mike-johnson-001',
            schedulerId: 'sched-001',
            department: 'operations',
            businessImpact: 'critical',
            scheduleType: 'Delivery',
            hosImpact: 'critical_violation',
            conflictSeverity: 'blocking',
            complianceRequired: true,
            resourcesNeeded: [
              'replacement_driver',
              'tow_truck',
              'dispatch_coordination',
            ],
          },
        },
        {
          id: 'sched-002',
          type: 'hos_compliance_check',
          title: 'HOS Violation Risk - Driver Sarah Wilson Approaching Limit',
          description:
            'Driver approaching 11-hour daily limit, need to reassign remaining 4-hour delivery',
          urgencyScore: 85,
          profitabilityScore: 70,
          resourceRequirement: 60,
          deadline: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          associatedRevenue: 3200,
          riskLevel: 'high',
          dependencies: [],
          estimatedDuration: 30,
          assignedTo: 'Sarah Martinez',
          createdAt: new Date().toISOString(),
          metadata: {
            scheduleId: 'SCH-2025-002',
            driverId: 'sarah-wilson-001',
            schedulerId: 'sched-001',
            department: 'compliance',
            businessImpact: 'high',
            scheduleType: 'Delivery',
            hosImpact: 'violation_risk',
            conflictSeverity: 'major',
            complianceRequired: true,
            resourcesNeeded: ['available_driver', 'hos_verification'],
          },
        },
        {
          id: 'sched-003',
          type: 'conflict_resolution',
          title: 'Schedule Conflict - Double Booking Vehicle TRK-005',
          description:
            'Vehicle TRK-005 double-booked for Amazon and Walmart deliveries on same time slot',
          urgencyScore: 80,
          profitabilityScore: 88,
          resourceRequirement: 50,
          deadline: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
          associatedRevenue: 6700,
          riskLevel: 'high',
          dependencies: ['sched-001'],
          estimatedDuration: 25,
          assignedTo: 'Sarah Martinez',
          createdAt: new Date().toISOString(),
          metadata: {
            scheduleId: 'SCH-2025-003',
            vehicleId: 'TRK-005',
            schedulerId: 'sched-001',
            department: 'scheduling',
            businessImpact: 'high',
            scheduleType: 'Delivery',
            hosImpact: 'none',
            conflictSeverity: 'major',
            complianceRequired: false,
            resourcesNeeded: ['alternative_vehicle', 'customer_notification'],
          },
        },
        {
          id: 'sched-004',
          type: 'maintenance_scheduling',
          title: 'Urgent Maintenance - Vehicle TRK-012 Inspection Due Today',
          description:
            'DOT inspection expires today, vehicle cannot operate without current inspection',
          urgencyScore: 90,
          profitabilityScore: 60,
          resourceRequirement: 70,
          deadline: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
          associatedRevenue: 0,
          riskLevel: 'critical',
          dependencies: [],
          estimatedDuration: 120,
          assignedTo: 'Sarah Martinez',
          createdAt: new Date().toISOString(),
          metadata: {
            scheduleId: 'SCH-2025-004',
            vehicleId: 'TRK-012',
            schedulerId: 'sched-001',
            department: 'maintenance',
            businessImpact: 'critical',
            scheduleType: 'Inspection',
            hosImpact: 'none',
            conflictSeverity: 'blocking',
            complianceRequired: true,
            resourcesNeeded: [
              'inspection_slot',
              'alternative_vehicle',
              'driver_reassignment',
            ],
          },
        },
        {
          id: 'sched-005',
          type: 'driver_assignment',
          title: 'Optimize Driver Assignment - High-Value Walmart Route',
          description:
            'Assign best available driver for premium Walmart route worth $4,500',
          urgencyScore: 65,
          profitabilityScore: 92,
          resourceRequirement: 40,
          deadline: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
          associatedRevenue: 4500,
          riskLevel: 'medium',
          dependencies: ['sched-002', 'sched-003'],
          estimatedDuration: 20,
          assignedTo: 'Sarah Martinez',
          createdAt: new Date().toISOString(),
          metadata: {
            scheduleId: 'SCH-2025-005',
            loadId: 'WMT-2025-007',
            schedulerId: 'sched-001',
            department: 'scheduling',
            businessImpact: 'high',
            scheduleType: 'Delivery',
            hosImpact: 'none',
            conflictSeverity: 'minor',
            complianceRequired: false,
            resourcesNeeded: ['experienced_driver', 'route_planning'],
          },
        },
        {
          id: 'sched-006',
          type: 'route_optimization',
          title: 'Route Optimization - Multi-Stop Home Depot Delivery',
          description:
            'Optimize 6-stop route for Home Depot to maximize efficiency and minimize drive time',
          urgencyScore: 50,
          profitabilityScore: 85,
          resourceRequirement: 65,
          deadline: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
          associatedRevenue: 5800,
          riskLevel: 'medium',
          dependencies: ['sched-004'],
          estimatedDuration: 40,
          assignedTo: 'Sarah Martinez',
          createdAt: new Date().toISOString(),
          metadata: {
            scheduleId: 'SCH-2025-006',
            loadId: 'HD-2025-008',
            schedulerId: 'sched-001',
            department: 'scheduling',
            businessImpact: 'medium',
            scheduleType: 'Delivery',
            hosImpact: 'warning',
            conflictSeverity: 'minor',
            complianceRequired: false,
            resourcesNeeded: [
              'route_optimization_software',
              'traffic_analysis',
            ],
          },
        },
      ];

      // Create prioritization request
      const now = new Date();
      const prioritizationRequest = {
        tasks: sampleSchedulingTasks,
        constraints: {
          availableResources: 75, // Scheduler capacity
          maxTasksPerHour: 8,
          prioritizeRevenue: true,
          riskTolerance: 'balanced' as const,
          departmentFocus: ['scheduling', 'operations', 'compliance'],
        },
        businessContext: {
          currentHour: now.getHours(),
          dayOfWeek: now.getDay(),
          seasonalFactor: 1.0,
          marketConditions: 'busy' as const, // Scheduling is typically busy
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
        // Enhance with scheduling-specific metrics
        const enhancedData: SchedulingPrioritizedTaskList = {
          ...prioritizeData.data,
          optimizationMetrics: {
            ...prioritizeData.data.optimizationMetrics,
            hosComplianceImpact: Math.round(
              sampleSchedulingTasks.reduce((sum, task) => {
                const hosScores = {
                  none: 0,
                  warning: 25,
                  violation_risk: 75,
                  critical_violation: 100,
                };
                return (
                  sum +
                  (hosScores[task.metadata.hosImpact || 'none'] *
                    task.urgencyScore) /
                    100
                );
              }, 0) / sampleSchedulingTasks.length
            ),
            conflictResolutionRate: Math.round(
              (sampleSchedulingTasks.filter(
                (t) =>
                  t.type === 'conflict_resolution' ||
                  t.type === 'emergency_reschedule'
              ).length /
                sampleSchedulingTasks.length) *
                100
            ),
          },
        };
        setPrioritizedTasks(enhancedData);
      } else {
        setError(
          prioritizeData.error || 'Failed to prioritize scheduling tasks'
        );
      }
    } catch (error) {
      console.error('Error loading scheduling tasks:', error);
      setError('Failed to load scheduling task prioritization');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEnabled) {
      loadSchedulingTasks();
    }
  }, [isEnabled]);

  const getTaskTypeIcon = (type: SchedulingTaskPriority['type']) => {
    const icons = {
      schedule_creation: '📅',
      conflict_resolution: '⚡',
      driver_assignment: '👤',
      vehicle_assignment: '🚛',
      hos_compliance_check: '⏰',
      route_optimization: '🗺️',
      maintenance_scheduling: '🔧',
      schedule_modification: '✏️',
      availability_update: '📊',
      license_verification: '🆔',
      inspection_scheduling: '🔍',
      emergency_reschedule: '🚨',
    };
    return icons[type as keyof typeof icons] || '📋';
  };

  const getRiskColor = (riskLevel: SchedulingTaskPriority['riskLevel']) => {
    const colors = {
      low: '#10b981',
      medium: '#f59e0b',
      high: '#ef4444',
      critical: '#dc2626',
    };
    return colors[riskLevel as keyof typeof colors] || '#6b7280';
  };

  const getHosImpactColor = (
    hosImpact: SchedulingTaskPriority['metadata']['hosImpact']
  ) => {
    const colors = {
      none: '#10b981',
      warning: '#f59e0b',
      violation_risk: '#ef4444',
      critical_violation: '#dc2626',
    };
    return colors[hosImpact || 'none'] || '#6b7280';
  };

  const getConflictSeverityColor = (
    severity: SchedulingTaskPriority['metadata']['conflictSeverity']
  ) => {
    const colors = {
      minor: '#10b981',
      moderate: '#f59e0b',
      major: '#ef4444',
      blocking: '#dc2626',
    };
    return colors[severity || 'minor'] || '#6b7280';
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
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📅</div>
        <h3 style={{ marginBottom: '8px' }}>Scheduling Task Prioritization</h3>
        <p style={{ opacity: 0.8 }}>
          AI-powered scheduling workflow optimization is not enabled
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
            border: '3px solid #8b5cf6',
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px',
          }}
         />
        <h3 style={{ marginBottom: '8px' }}>
          AI Processing Scheduling Tasks...
        </h3>
        <p style={{ opacity: 0.8 }}>
          Analyzing schedules, conflicts, and HOS compliance
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
        <h3 style={{ marginBottom: '8px' }}>Error Loading Scheduling Tasks</h3>
        <p style={{ marginBottom: '16px', opacity: 0.8 }}>{error}</p>
        <button
          onClick={loadSchedulingTasks}
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
              color: '#8b5cf6',
            }}
          >
            📅 Scheduling Priority Queue
          </h3>
          <p style={{ fontSize: '0.8rem', opacity: 0.8, margin: 0 }}>
            AI-optimized task prioritization for scheduling operations
          </p>
        </div>
        <button
          onClick={loadSchedulingTasks}
          disabled={loading}
          style={{
            background: loading
              ? '#6b7280'
              : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
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

      {!prioritizedTasks ? (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>📅</div>
          <h4 style={{ marginBottom: '8px', color: 'white' }}>
            No Scheduling Data Available
          </h4>
          <p style={{ fontSize: '0.9rem', opacity: 0.8, margin: 0 }}>
            Click 'Refresh' to load scheduling task prioritization
          </p>
        </div>
      ) : (
        prioritizedTasks && (
          <>
            {/* Scheduling Metrics */}
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
                    color: '#dc2626',
                  }}
                >
                  {prioritizedTasks?.tasks?.filter(
                    (t) => t.riskLevel === 'critical'
                  )?.length || 0}
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
                    color: '#ef4444',
                  }}
                >
                  {prioritizedTasks?.optimizationMetrics?.hosComplianceImpact ||
                    0}
                  %
                </div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                  HOS Impact
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
                  {prioritizedTasks?.optimizationMetrics
                    ?.conflictResolutionRate || 0}
                  %
                </div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                  Conflicts
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
                    color: '#8b5cf6',
                  }}
                >
                  {prioritizedTasks?.optimizationMetrics?.timeToCompletion || 0}
                  h
                </div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                  Time Est.
                </div>
              </div>
            </div>

            {/* Prioritized Scheduling Tasks */}
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {(prioritizedTasks?.tasks || [])
                .slice(0, 5)
                .map((task, index) => (
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
                            background: '#8b5cf6',
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

                        {task.metadata.hosImpact &&
                          task.metadata.hosImpact !== 'none' && (
                            <span
                              style={{
                                background: getHosImpactColor(
                                  task.metadata.hosImpact
                                ),
                                color: 'white',
                                padding: '3px 6px',
                                borderRadius: '4px',
                                fontSize: '0.6rem',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                              }}
                            >
                              HOS
                            </span>
                          )}

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
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(100px, 1fr))',
                        gap: '8px',
                        fontSize: '0.7rem',
                      }}
                    >
                      <div>
                        <strong>Type:</strong> {task.metadata.scheduleType}
                      </div>
                      <div>
                        <strong>Duration:</strong> {task.estimatedDuration}min
                      </div>
                      <div>
                        <strong>Conflict:</strong>{' '}
                        <span
                          style={{
                            color: getConflictSeverityColor(
                              task.metadata.conflictSeverity
                            ),
                          }}
                        >
                          {task.metadata.conflictSeverity}
                        </span>
                      </div>
                      <div>
                        <strong>Resources:</strong>{' '}
                        {task.metadata.resourcesNeeded?.length || 0}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* AI Insights */}
            {(prioritizedTasks?.recommendations?.length || 0) > 0 && (
              <div
                style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
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
                    AI Scheduling Recommendations
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                  {(prioritizedTasks?.recommendations || [])
                    .slice(0, 3)
                    .map((rec, i) => (
                      <div key={i} style={{ marginBottom: '4px' }}>
                        • {rec}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
}
