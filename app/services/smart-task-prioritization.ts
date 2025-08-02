// Smart Task Prioritization Engine
// AI-powered intelligent task ordering based on urgency, profitability, and resource optimization
// Completely new feature - no duplicates with existing functionality

import { isFeatureEnabled } from '../config/feature-flags';
import { AnalysisResult, BaseService, ServiceResponse } from './base-service';

export interface TaskPriority {
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

export interface PrioritizedTaskList extends AnalysisResult<TaskPriority[]> {
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

export interface TaskPrioritizationRequest {
  tasks: TaskPriority[];
  constraints: {
    availableResources: number; // Total resource capacity (0-100)
    maxTasksPerHour: number;
    prioritizeRevenue: boolean;
    riskTolerance: 'conservative' | 'balanced' | 'aggressive';
    departmentFocus?: string[];
  };
  businessContext: {
    currentHour: number; // 0-23
    dayOfWeek: number; // 0-6 (Sunday = 0)
    seasonalFactor: number; // 0.5-2.0
    marketConditions: 'slow' | 'normal' | 'busy' | 'peak';
  };
}

export class SmartTaskPrioritizationService extends BaseService {
  constructor() {
    super('SmartTaskPrioritization');
  }

  async prioritizeTasks(
    request: TaskPrioritizationRequest
  ): Promise<ServiceResponse<PrioritizedTaskList>> {
    try {
      if (!isFeatureEnabled('SMART_TASK_PRIORITIZATION')) {
        return this.createErrorResponse(
          new Error('Smart Task Prioritization feature is not enabled'),
          'prioritizeTasks'
        );
      }

      this.log(
        'info',
        `Starting intelligent task prioritization for ${request.tasks.length} tasks`
      );

      const prioritizedList = await this.performTaskPrioritization(request);

      return this.createSuccessResponse(
        prioritizedList,
        'Task prioritization completed successfully'
      );
    } catch (error) {
      return this.createErrorResponse(error as Error, 'prioritizeTasks');
    }
  }

  private async performTaskPrioritization(
    request: TaskPrioritizationRequest
  ): Promise<PrioritizedTaskList> {
    // Step 1: Calculate base priority scores
    const scoredTasks = request.tasks.map((task) => ({
      ...task,
      calculatedPriority: this.calculateTaskPriority(
        task,
        request.businessContext,
        request.constraints
      ),
    }));

    // Step 2: Apply dependency constraints
    const dependencyOptimizedTasks = this.optimizeForDependencies(scoredTasks);

    // Step 3: Apply resource constraints
    const resourceOptimizedTasks = this.optimizeForResources(
      dependencyOptimizedTasks,
      request.constraints
    );

    // Step 4: Apply business context adjustments
    const contextOptimizedTasks = this.applyBusinessContext(
      resourceOptimizedTasks,
      request.businessContext
    );

    // Step 5: Final sort and ranking
    const finalPrioritizedTasks = contextOptimizedTasks.sort(
      (a, b) => b.calculatedPriority - a.calculatedPriority
    );

    // Step 6: Generate insights and recommendations
    const optimizationMetrics = this.calculateOptimizationMetrics(
      finalPrioritizedTasks
    );
    const reasoning = this.generatePrioritizationReasoning(
      finalPrioritizedTasks,
      request
    );
    const recommendations = this.generateRecommendations(
      finalPrioritizedTasks,
      request
    );

    return {
      result: finalPrioritizedTasks.map(
        ({ calculatedPriority, ...task }) => task
      ),
      confidence: optimizationMetrics.resourceUtilization,
      reasoning: reasoning.join('. '),
      recommendations,
      riskFactors: this.identifyRiskFactors(finalPrioritizedTasks),
      prioritizationScore: optimizationMetrics.resourceUtilization,
      optimizationMetrics,
      lastUpdated: new Date().toISOString(),
    };
  }

  private calculateTaskPriority(
    task: TaskPriority,
    context: TaskPrioritizationRequest['businessContext'],
    constraints: TaskPrioritizationRequest['constraints']
  ): number {
    let score = 0;

    // Urgency component (0-40 points)
    score += task.urgencyScore * 0.4;

    // Profitability component (0-30 points)
    if (constraints.prioritizeRevenue) {
      score += task.profitabilityScore * 0.3;
    } else {
      score += task.profitabilityScore * 0.15;
    }

    // Risk mitigation component (0-20 points)
    const riskScores = { low: 5, medium: 10, high: 15, critical: 20 };
    score += riskScores[task.riskLevel];

    // Resource efficiency component (0-10 points)
    const resourceEfficiency = 100 - task.resourceRequirement;
    score += resourceEfficiency * 0.1;

    // Deadline proximity bonus (0-15 points)
    if (task.deadline) {
      const hoursUntilDeadline = this.getHoursUntilDeadline(task.deadline);
      if (hoursUntilDeadline <= 2) score += 15;
      else if (hoursUntilDeadline <= 8) score += 10;
      else if (hoursUntilDeadline <= 24) score += 5;
    }

    // Business impact multiplier
    const impactMultipliers = {
      low: 1.0,
      medium: 1.1,
      high: 1.25,
      critical: 1.5,
    };
    const businessImpact = task.metadata?.businessImpact || 'medium';
    score *= impactMultipliers[businessImpact];

    // Market conditions adjustment
    const marketMultipliers = { slow: 0.9, normal: 1.0, busy: 1.15, peak: 1.3 };
    score *= marketMultipliers[context.marketConditions];

    return Math.round(score);
  }

  private optimizeForDependencies(
    tasks: (TaskPriority & { calculatedPriority: number })[]
  ): (TaskPriority & { calculatedPriority: number })[] {
    // Create dependency graph and adjust priorities
    const taskMap = new Map(tasks.map((task) => [task.id, task]));

    return tasks.map((task) => {
      // Boost priority if this task unblocks others
      const dependentTasks = tasks.filter((t) =>
        t.dependencies.includes(task.id)
      );
      const dependencyBonus = dependentTasks.length * 5;

      // Reduce priority if this task has unmet dependencies
      const unmetDependencies = task.dependencies.filter((depId) => {
        const depTask = taskMap.get(depId);
        return depTask && !this.isTaskCompleted(depTask);
      });
      const dependencyPenalty = unmetDependencies.length * 10;

      return {
        ...task,
        calculatedPriority:
          task.calculatedPriority + dependencyBonus - dependencyPenalty,
      };
    });
  }

  private optimizeForResources(
    tasks: (TaskPriority & { calculatedPriority: number })[],
    constraints: TaskPrioritizationRequest['constraints']
  ): (TaskPriority & { calculatedPriority: number })[] {
    // Apply resource capacity constraints
    let remainingCapacity = constraints.availableResources;

    return tasks.map((task) => {
      if (task.resourceRequirement > remainingCapacity) {
        // Penalize tasks that exceed available resources
        return {
          ...task,
          calculatedPriority: task.calculatedPriority * 0.7,
        };
      }

      remainingCapacity -= task.resourceRequirement;
      return task;
    });
  }

  private applyBusinessContext(
    tasks: (TaskPriority & { calculatedPriority: number })[],
    context: TaskPrioritizationRequest['businessContext']
  ): (TaskPriority & { calculatedPriority: number })[] {
    return tasks.map((task) => {
      let contextMultiplier = 1.0;

      // Time-of-day adjustments
      if (context.currentHour >= 9 && context.currentHour <= 17) {
        // Business hours - prioritize customer-facing tasks
        if (
          task.type === 'customer_communication' ||
          task.type === 'load_assignment'
        ) {
          contextMultiplier *= 1.2;
        }
      } else {
        // After hours - prioritize operational tasks
        if (
          task.type === 'route_optimization' ||
          task.type === 'maintenance_alert'
        ) {
          contextMultiplier *= 1.15;
        }
      }

      // Day of week adjustments
      if (context.dayOfWeek === 1) {
        // Monday
        // Start of week - prioritize planning tasks
        if (
          task.type === 'route_optimization' ||
          task.metadata.department === 'dispatch'
        ) {
          contextMultiplier *= 1.1;
        }
      }

      // Seasonal adjustments
      contextMultiplier *= context.seasonalFactor;

      return {
        ...task,
        calculatedPriority: Math.round(
          task.calculatedPriority * contextMultiplier
        ),
      };
    });
  }

  private calculateOptimizationMetrics(
    tasks: (TaskPriority & { calculatedPriority: number })[]
  ): PrioritizedTaskList['optimizationMetrics'] {
    const totalRevenue = tasks.reduce(
      (sum, task) => sum + (task.associatedRevenue || 0),
      0
    );
    const averageUrgency =
      tasks.reduce((sum, task) => sum + task.urgencyScore, 0) / tasks.length;
    const resourceUtilization =
      tasks.reduce((sum, task) => sum + task.resourceRequirement, 0) /
      tasks.length;
    const riskScores = { low: 1, medium: 2, high: 3, critical: 4 };
    const riskMitigation =
      tasks.reduce((sum, task) => sum + riskScores[task.riskLevel], 0) /
      tasks.length;
    const timeToCompletion = tasks.reduce(
      (sum, task) => sum + task.estimatedDuration,
      0
    );

    return {
      totalRevenue,
      averageUrgency: Math.round(averageUrgency),
      resourceUtilization: Math.round(resourceUtilization),
      riskMitigation: Math.round(riskMitigation * 25), // Convert to 0-100 scale
      timeToCompletion: Math.round(timeToCompletion / 60), // Convert to hours
    };
  }

  private generatePrioritizationReasoning(
    tasks: (TaskPriority & { calculatedPriority: number })[],
    request: TaskPrioritizationRequest
  ): string[] {
    const reasoning = [];
    const topTask = tasks[0];

    if (topTask) {
      reasoning.push(
        `Highest priority: "${topTask.title}" due to ${topTask.riskLevel} risk level and ${topTask.urgencyScore}% urgency`
      );
    }

    const criticalTasks = tasks.filter(
      (t) => t.riskLevel === 'critical'
    ).length;
    if (criticalTasks > 0) {
      reasoning.push(
        `${criticalTasks} critical risk tasks prioritized for immediate attention`
      );
    }

    const revenueImpact = tasks.filter(
      (t) => (t.associatedRevenue || 0) > 1000
    ).length;
    if (revenueImpact > 0) {
      reasoning.push(
        `${revenueImpact} high-revenue tasks identified for business impact`
      );
    }

    if (request.constraints.prioritizeRevenue) {
      reasoning.push(
        'Revenue optimization prioritized based on business constraints'
      );
    }

    reasoning.push(
      `Market conditions (${request.businessContext.marketConditions}) factored into prioritization`
    );

    return reasoning;
  }

  private generateRecommendations(
    tasks: (TaskPriority & { calculatedPriority: number })[],
    request: TaskPrioritizationRequest
  ): string[] {
    const recommendations = [];

    const highResourceTasks = tasks.filter(
      (t) => t.resourceRequirement > 70
    ).length;
    if (highResourceTasks > 3) {
      recommendations.push(
        'Consider delegating or breaking down high-complexity tasks to improve throughput'
      );
    }

    const blockedTasks = tasks.filter((t) => t.dependencies.length > 0).length;
    if (blockedTasks > 2) {
      recommendations.push(
        'Focus on dependency resolution to unblock downstream tasks'
      );
    }

    const criticalTasks = tasks.filter((t) => t.riskLevel === 'critical');
    if (criticalTasks.length > 0) {
      recommendations.push(
        `Immediate attention required for ${criticalTasks.length} critical risk tasks`
      );
    }

    if (request.businessContext.marketConditions === 'peak') {
      recommendations.push(
        'Peak market conditions detected - prioritize customer-facing and revenue-generating tasks'
      );
    }

    const totalDuration = tasks.reduce(
      (sum, task) => sum + task.estimatedDuration,
      0
    );
    if (totalDuration > 8 * 60) {
      // More than 8 hours
      recommendations.push(
        'Task load exceeds single day capacity - consider resource scaling or task deferral'
      );
    }

    return recommendations;
  }

  private identifyRiskFactors(
    tasks: (TaskPriority & { calculatedPriority: number })[]
  ): string[] {
    const riskFactors = [];

    const criticalTasks = tasks.filter(
      (t) => t.riskLevel === 'critical'
    ).length;
    if (criticalTasks > 0) {
      riskFactors.push(
        `${criticalTasks} critical risk tasks require immediate attention`
      );
    }

    const overdueTasks = tasks.filter((t) => {
      if (!t.deadline) return false;
      return this.getHoursUntilDeadline(t.deadline) < 0;
    }).length;

    if (overdueTasks > 0) {
      riskFactors.push(`${overdueTasks} tasks are past their deadlines`);
    }

    const highResourceTasks = tasks.filter(
      (t) => t.resourceRequirement > 80
    ).length;
    if (highResourceTasks > 2) {
      riskFactors.push(
        'Multiple high-complexity tasks may cause resource bottlenecks'
      );
    }

    return riskFactors;
  }

  private getHoursUntilDeadline(deadline: string): number {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    return (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  }

  private isTaskCompleted(task: TaskPriority): boolean {
    // In a real implementation, this would check task status
    // For now, return false (task not completed)
    return false;
  }

  // Additional utility methods for task management
  async getTaskRecommendations(
    departmentId: string
  ): Promise<ServiceResponse<string[]>> {
    try {
      const recommendations = [
        'Focus on high-urgency tasks during peak business hours',
        'Batch similar tasks together for improved efficiency',
        'Address dependency bottlenecks first to unblock team workflow',
        'Monitor resource utilization to prevent burnout',
        'Review and adjust priorities based on real-time business conditions',
      ];

      return this.createSuccessResponse(
        recommendations,
        'Task recommendations generated'
      );
    } catch (error) {
      return this.createErrorResponse(error as Error, 'getTaskRecommendations');
    }
  }

  async analyzeWorkflowBottlenecks(
    tasks: TaskPriority[]
  ): Promise<ServiceResponse<any>> {
    try {
      const bottleneckAnalysis = {
        dependencyBottlenecks: tasks.filter((t) => t.dependencies.length > 2)
          .length,
        resourceBottlenecks: tasks.filter((t) => t.resourceRequirement > 80)
          .length,
        timeBottlenecks: tasks.filter(
          (t) => this.getHoursUntilDeadline(t.deadline || '') < 4
        ).length,
        recommendations: [
          'Consider parallel processing for independent tasks',
          'Allocate additional resources to high-complexity tasks',
          'Implement early warning system for approaching deadlines',
        ],
      };

      return this.createSuccessResponse(
        bottleneckAnalysis,
        'Workflow bottleneck analysis completed'
      );
    } catch (error) {
      return this.createErrorResponse(
        error as Error,
        'analyzeWorkflowBottlenecks'
      );
    }
  }
}
