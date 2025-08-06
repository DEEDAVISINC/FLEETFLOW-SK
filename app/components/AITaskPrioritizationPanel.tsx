'use client';

import { Brain, Target, TrendingUp, Zap } from 'lucide-react';
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

interface AITaskPrioritizationPanelProps {
  mode?: 'dispatch' | 'analytics';
}

export default function AITaskPrioritizationPanel({
  mode = 'dispatch',
}: AITaskPrioritizationPanelProps) {
  const isEnabled = useFeatureFlag('SMART_TASK_PRIORITIZATION');
  const [loading, setLoading] = useState(false);
  const [prioritizedTasks, setPrioritizedTasks] =
    useState<PrioritizedTaskList | null>(null);
  const [sampleTasks, setSampleTasks] = useState<TaskPriority[]>([]);

  // Auto-load and prioritize tasks on component mount
  useEffect(() => {
    if (isEnabled) {
      loadAndPrioritizeTasks();
    }
  }, [isEnabled]);

  const loadAndPrioritizeTasks = async () => {
    try {
      setLoading(true);

      // Load sample tasks
      const tasksResponse = await fetch(
        '/api/analytics/task-prioritization?action=sample-tasks'
      );
      const tasksData = await tasksResponse.json();

      if (tasksData.success) {
        setSampleTasks(tasksData.data);

        // Auto-prioritize with smart defaults
        const now = new Date();
        const prioritizationRequest = {
          tasks: tasksData.data,
          constraints: {
            availableResources: 85,
            maxTasksPerHour: 10,
            prioritizeRevenue: mode === 'analytics',
            riskTolerance: 'balanced' as const,
            departmentFocus:
              mode === 'dispatch' ? ['dispatch', 'operations'] : [],
          },
          businessContext: {
            currentHour: now.getHours(),
            dayOfWeek: now.getDay(),
            seasonalFactor: 1.0,
            marketConditions: 'normal' as const,
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
          setPrioritizedTasks(prioritizeData.data);
        }
      }
    } catch (error) {
      console.error('Failed to load and prioritize tasks:', error);
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
      <div className='rounded-xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur-sm'>
        <Brain className='mx-auto mb-4 h-12 w-12 text-purple-400' />
        <h3 className='mb-2 text-lg font-semibold text-white'>
          AI Task Prioritization
        </h3>
        <p className='text-sm text-white/70'>Feature currently disabled</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='rounded-xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur-sm'>
        <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-purple-400 border-t-transparent' />
        <h3 className='mb-2 text-lg font-semibold text-white'>
          AI Processing...
        </h3>
        <p className='text-sm text-white/70'>
          Analyzing and prioritizing tasks
        </p>
      </div>
    );
  }

  if (mode === 'analytics' && prioritizedTasks) {
    return (
      <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
        <div className='mb-6 flex items-center gap-3'>
          <TrendingUp className='h-6 w-6 text-purple-400' />
          <h3 className='text-lg font-semibold text-white'>
            AI Task Analytics
          </h3>
        </div>

        {/* Analytics Metrics */}
        <div className='mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4'>
          <div className='rounded-lg bg-white/5 p-4 text-center'>
            <div className='text-2xl font-bold text-green-400'>
              {prioritizedTasks.optimizationMetrics.averageUrgency}%
            </div>
            <div className='text-xs text-white/70'>Avg Urgency</div>
          </div>

          <div className='rounded-lg bg-white/5 p-4 text-center'>
            <div className='text-2xl font-bold text-blue-400'>
              {prioritizedTasks.optimizationMetrics.resourceUtilization}%
            </div>
            <div className='text-xs text-white/70'>Resource Use</div>
          </div>

          <div className='rounded-lg bg-white/5 p-4 text-center'>
            <div className='text-2xl font-bold text-yellow-400'>
              $
              {prioritizedTasks.optimizationMetrics.totalRevenue.toLocaleString()}
            </div>
            <div className='text-xs text-white/70'>Revenue</div>
          </div>

          <div className='rounded-lg bg-white/5 p-4 text-center'>
            <div className='text-2xl font-bold text-purple-400'>
              {prioritizedTasks.optimizationMetrics.timeToCompletion}h
            </div>
            <div className='text-xs text-white/70'>Est. Time</div>
          </div>
        </div>

        {/* AI Insights */}
        <div className='mb-4 rounded-lg border border-purple-500/20 bg-purple-500/10 p-4'>
          <div className='mb-2 flex items-center gap-2'>
            <Brain className='h-4 w-4 text-purple-400' />
            <span className='text-sm font-medium text-white'>AI Insights</span>
          </div>
          <p className='text-sm text-white/80'>{prioritizedTasks.reasoning}</p>
        </div>

        {/* Top Recommendations */}
        {prioritizedTasks.recommendations.length > 0 && (
          <div className='space-y-2'>
            <div className='mb-3 flex items-center gap-2'>
              <Target className='h-4 w-4 text-green-400' />
              <span className='text-sm font-medium text-white'>
                AI Recommendations
              </span>
            </div>
            {prioritizedTasks.recommendations.slice(0, 2).map((rec, index) => (
              <div
                key={index}
                className='rounded-lg border border-green-500/20 bg-green-500/10 p-3'
              >
                <p className='text-sm text-white/80'>{rec}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Dispatch Mode - Show prioritized task list
  return (
    <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
      <div className='mb-6 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Zap className='h-6 w-6 text-purple-400' />
          <h3 className='text-lg font-semibold text-white'>AI Task Queue</h3>
        </div>
        <button
          onClick={loadAndPrioritizeTasks}
          disabled={loading}
          className='rounded-lg bg-purple-600 px-3 py-1 text-sm text-white transition-colors hover:bg-purple-700 disabled:bg-gray-600'
        >
          {loading ? '🔄' : '⚡'} Refresh
        </button>
      </div>

      {prioritizedTasks && (
        <div className='space-y-3'>
          {prioritizedTasks.result.slice(0, 5).map((task, index) => (
            <div
              key={task.id}
              className='rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10'
            >
              <div className='mb-2 flex items-start justify-between'>
                <div className='flex items-center gap-2'>
                  <span className='text-lg'>{getTaskTypeIcon(task.type)}</span>
                  <span className='rounded-full bg-blue-600 px-2 py-1 text-xs font-bold text-white'>
                    #{index + 1}
                  </span>
                  <h4 className='text-sm font-medium text-white'>
                    {task.title}
                  </h4>
                </div>

                <div className='flex items-center gap-2'>
                  <span
                    className='rounded px-2 py-1 text-xs font-bold text-white'
                    style={{ backgroundColor: getRiskColor(task.riskLevel) }}
                  >
                    {task.riskLevel.toUpperCase()}
                  </span>
                  <span className='text-xs text-white/70'>
                    ⏰ {formatTimeUntilDeadline(task.deadline)}
                  </span>
                </div>
              </div>

              <p className='mb-3 text-sm text-white/70'>{task.description}</p>

              <div className='grid grid-cols-3 gap-4 text-xs'>
                <div>
                  <span className='text-white/50'>Urgency:</span>
                  <span className='ml-1 text-white'>{task.urgencyScore}%</span>
                </div>
                <div>
                  <span className='text-white/50'>Revenue:</span>
                  <span className='ml-1 text-white'>
                    ${(task.associatedRevenue || 0).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className='text-white/50'>Duration:</span>
                  <span className='ml-1 text-white'>
                    {task.estimatedDuration}m
                  </span>
                </div>
              </div>
            </div>
          ))}

          {prioritizedTasks.result.length > 5 && (
            <div className='pt-2 text-center'>
              <span className='text-sm text-white/50'>
                +{prioritizedTasks.result.length - 5} more tasks in queue
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
