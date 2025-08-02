'use client';

import { useEffect, useState } from 'react';
import { useFeatureFlag } from '../config/feature-flags';

interface TaskPriority {
  id: string;
  type:
    | 'load_assignment'
    | 'route_optimization'
    | 'compliance_check'
    | 'maintenance_alert'
    | 'customer_communication'
    | 'documentation'
    | 'billing'
    | 'driver_management';
  title: string;
  description: string;
  urgencyScore: number;
  profitabilityScore: number;
  resourceRequirement: number;
  deadline?: string;
  associatedRevenue?: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  dependencies: string[];
  estimatedDuration: number;
  assignedTo?: string;
  createdAt: string;
  metadata: {
    loadId?: string;
    customerId?: string;
    driverId?: string;
    vehicleId?: string;
    department:
      | 'dispatch'
      | 'operations'
      | 'compliance'
      | 'finance'
      | 'management';
    businessImpact: 'low' | 'medium' | 'high' | 'critical';
  };
}

interface PrioritizedTaskList {
  result: TaskPriority[];
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
  };
  lastUpdated: string;
}

interface TaskConstraints {
  availableResources: number;
  maxTasksPerHour: number;
  prioritizeRevenue: boolean;
  riskTolerance: 'conservative' | 'balanced' | 'aggressive';
  departmentFocus: string[];
}

export default function SmartTaskPrioritizationWidget() {
  const isEnabled = useFeatureFlag('SMART_TASK_PRIORITIZATION');
  const [loading, setLoading] = useState(false);
  const [prioritizedTasks, setPrioritizedTasks] =
    useState<PrioritizedTaskList | null>(null);
  const [sampleTasks, setSampleTasks] = useState<TaskPriority[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'prioritize' | 'analyze' | 'recommendations'
  >('prioritize');

  // Form state for task prioritization
  const [constraints, setConstraints] = useState<TaskConstraints>({
    availableResources: 80,
    maxTasksPerHour: 8,
    prioritizeRevenue: true,
    riskTolerance: 'balanced',
    departmentFocus: [],
  });

  // Load sample tasks on component mount
  useEffect(() => {
    loadSampleTasks();
  }, []);

  const loadSampleTasks = async () => {
    try {
      const response = await fetch(
        '/api/analytics/task-prioritization?action=sample-tasks'
      );
      const data = await response.json();

      if (data.success) {
        setSampleTasks(data.data);
      }
    } catch (error) {
      console.error('Failed to load sample tasks:', error);
    }
  };

  const handlePrioritizeTasks = async () => {
    if (sampleTasks.length === 0) {
      setError('No tasks available to prioritize');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const now = new Date();
      const businessContext = {
        currentHour: now.getHours(),
        dayOfWeek: now.getDay(),
        seasonalFactor: 1.0,
        marketConditions: 'normal' as const,
      };

      const response = await fetch('/api/analytics/task-prioritization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'prioritize-tasks',
          tasks: sampleTasks,
          constraints,
          businessContext,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPrioritizedTasks(data.data);
      } else {
        setError(data.message || 'Failed to prioritize tasks');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getTaskTypeIcon = (type: string) => {
    const icons = {
      load_assignment: '🚛',
      route_optimization: '🗺️',
      compliance_check: '✅',
      maintenance_alert: '🔧',
      customer_communication: '📞',
      documentation: '📋',
      billing: '💰',
      driver_management: '👥',
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
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔒</div>
        <h3 style={{ marginBottom: '8px' }}>Smart Task Prioritization</h3>
        <p style={{ opacity: 0.8 }}>This feature is currently disabled</p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '32px',
        color: 'white',
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#8b5cf6',
          }}
        >
          🧠 Smart Task Prioritization Engine
        </h2>
        <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>
          AI-powered intelligent task ordering based on urgency, profitability,
          and resource optimization
        </p>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          paddingBottom: '16px',
        }}
      >
        {[
          { id: 'prioritize', label: 'Task Prioritization', icon: '🎯' },
          { id: 'analyze', label: 'Workflow Analysis', icon: '📊' },
          { id: 'recommendations', label: 'Recommendations', icon: '💡' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              background:
                activeTab === tab.id
                  ? 'rgba(139, 92, 246, 0.3)'
                  : 'transparent',
              color: 'white',
              border:
                activeTab === tab.id
                  ? '1px solid #8b5cf6'
                  : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Task Prioritization Tab */}
      {activeTab === 'prioritize' && (
        <div>
          {/* Constraints Configuration */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px',
            }}
          >
            <h3 style={{ marginBottom: '16px', color: '#8b5cf6' }}>
              ⚙️ Prioritization Settings
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
              }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '0.9rem',
                  }}
                >
                  Available Resources (%)
                </label>
                <input
                  type='range'
                  min='20'
                  max='100'
                  value={constraints.availableResources}
                  onChange={(e) =>
                    setConstraints({
                      ...constraints,
                      availableResources: parseInt(e.target.value),
                    })
                  }
                  style={{ width: '100%' }}
                />
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                  {constraints.availableResources}%
                </span>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '0.9rem',
                  }}
                >
                  Max Tasks/Hour
                </label>
                <input
                  type='range'
                  min='2'
                  max='15'
                  value={constraints.maxTasksPerHour}
                  onChange={(e) =>
                    setConstraints({
                      ...constraints,
                      maxTasksPerHour: parseInt(e.target.value),
                    })
                  }
                  style={{ width: '100%' }}
                />
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                  {constraints.maxTasksPerHour} tasks
                </span>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '0.9rem',
                  }}
                >
                  Risk Tolerance
                </label>
                <select
                  value={constraints.riskTolerance}
                  onChange={(e) =>
                    setConstraints({
                      ...constraints,
                      riskTolerance: e.target.value as any,
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                  }}
                >
                  <option value='conservative'>Conservative</option>
                  <option value='balanced'>Balanced</option>
                  <option value='aggressive'>Aggressive</option>
                </select>
              </div>

              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <input
                  type='checkbox'
                  checked={constraints.prioritizeRevenue}
                  onChange={(e) =>
                    setConstraints({
                      ...constraints,
                      prioritizeRevenue: e.target.checked,
                    })
                  }
                />
                <label style={{ fontSize: '0.9rem' }}>Prioritize Revenue</label>
              </div>
            </div>

            <button
              onClick={handlePrioritizeTasks}
              disabled={loading}
              style={{
                background: loading
                  ? '#6b7280'
                  : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '16px',
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? '🔄 Prioritizing...' : '🎯 Prioritize Tasks'}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '20px',
                color: '#fca5a5',
              }}
            >
              ❌ {error}
            </div>
          )}

          {/* Prioritized Tasks Results */}
          {prioritizedTasks && (
            <div>
              {/* Optimization Metrics */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '20px',
                }}
              >
                <h3 style={{ marginBottom: '16px', color: '#10b981' }}>
                  📊 Optimization Metrics
                </h3>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '16px',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: '#10b981',
                      }}
                    >
                      {prioritizedTasks.optimizationMetrics.averageUrgency}%
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                      Avg Urgency
                    </div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: '#3b82f6',
                      }}
                    >
                      {prioritizedTasks.optimizationMetrics.resourceUtilization}
                      %
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                      Resource Use
                    </div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: '#f59e0b',
                      }}
                    >
                      $
                      {prioritizedTasks.optimizationMetrics.totalRevenue.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                      Total Revenue
                    </div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: '#8b5cf6',
                      }}
                    >
                      {prioritizedTasks.optimizationMetrics.timeToCompletion}h
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                      Est. Time
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '16px',
                    padding: '12px',
                    background: 'rgba(139, 92, 246, 0.1)',
                    borderRadius: '8px',
                  }}
                >
                  <strong>AI Reasoning:</strong> {prioritizedTasks.reasoning}
                </div>
              </div>

              {/* Prioritized Task List */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '20px',
                }}
              >
                <h3 style={{ marginBottom: '16px', color: '#8b5cf6' }}>
                  📋 Prioritized Tasks
                </h3>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {prioritizedTasks.result.map((task, index) => (
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
                              background: '#3b82f6',
                              color: 'white',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '0.8rem',
                              fontWeight: 'bold',
                            }}
                          >
                            #{index + 1}
                          </span>
                          <h4 style={{ margin: 0, fontSize: '1rem' }}>
                            {task.title}
                          </h4>
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                          }}
                        >
                          <span
                            style={{
                              background: getRiskColor(task.riskLevel),
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '0.7rem',
                              fontWeight: 'bold',
                              textTransform: 'uppercase',
                            }}
                          >
                            {task.riskLevel}
                          </span>

                          <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                            ⏰ {formatTimeUntilDeadline(task.deadline)}
                          </span>
                        </div>
                      </div>

                      <p
                        style={{
                          margin: '0 0 12px 0',
                          fontSize: '0.9rem',
                          opacity: 0.8,
                        }}
                      >
                        {task.description}
                      </p>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(120px, 1fr))',
                          gap: '8px',
                          fontSize: '0.8rem',
                        }}
                      >
                        <div>
                          <strong>Urgency:</strong> {task.urgencyScore}%
                        </div>
                        <div>
                          <strong>Revenue:</strong> $
                          {(task.associatedRevenue || 0).toLocaleString()}
                        </div>
                        <div>
                          <strong>Duration:</strong> {task.estimatedDuration}m
                        </div>
                        <div>
                          <strong>Dept:</strong> {task.metadata.department}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Workflow Analysis Tab */}
      {activeTab === 'analyze' && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📊</div>
          <h3 style={{ marginBottom: '8px' }}>Workflow Analysis</h3>
          <p style={{ opacity: 0.8 }}>
            Advanced workflow bottleneck detection and optimization
            recommendations
          </p>
          <p style={{ fontSize: '0.9rem', marginTop: '16px', opacity: 0.7 }}>
            Feature coming soon - will analyze task dependencies, resource
            conflicts, and workflow efficiency
          </p>
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div>
          {prioritizedTasks ? (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <h3 style={{ marginBottom: '16px', color: '#10b981' }}>
                💡 AI Recommendations
              </h3>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {prioritizedTasks.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '8px',
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>💡</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>

              {prioritizedTasks.riskFactors.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h4 style={{ marginBottom: '12px', color: '#ef4444' }}>
                    ⚠️ Risk Factors
                  </h4>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    {prioritizedTasks.riskFactors.map((risk, index) => (
                      <div
                        key={index}
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '8px',
                          padding: '12px',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                        }}
                      >
                        <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                        <span>{risk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💡</div>
              <h3 style={{ marginBottom: '8px' }}>AI Recommendations</h3>
              <p style={{ opacity: 0.8 }}>
                Run task prioritization first to receive intelligent
                recommendations
              </p>
              <button
                onClick={() => setActiveTab('prioritize')}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  marginTop: '12px',
                }}
              >
                Go to Prioritization
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
