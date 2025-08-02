import { NextRequest, NextResponse } from 'next/server';
import { SmartTaskPrioritizationService } from '../../../services/smart-task-prioritization';

const taskPrioritizationService = new SmartTaskPrioritizationService();

// Helper functions for driver load prioritization
function calculateLoadUrgency(load: any): number {
  let score = 50; // Base score

  // Time urgency
  if (load.daysUntilPickup <= 0)
    score += 40; // Due today or overdue
  else if (load.daysUntilPickup <= 1) score += 30;
  else if (load.daysUntilPickup <= 2) score += 20;
  else if (load.daysUntilPickup <= 3) score += 10;

  // Workflow progress urgency
  if (load.workflowProgress === 0)
    score += 25; // Not started
  else if (load.workflowProgress < 25)
    score += 20; // Barely started
  else if (load.workflowProgress < 50)
    score += 15; // In progress
  else if (load.workflowProgress < 75) score += 10; // Almost done

  // Status urgency
  if (load.status === 'Assigned' && load.workflowProgress === 0) score += 15;

  return Math.min(100, score);
}

function calculateLoadProfitability(load: any): number {
  const rate = load.rate || load.businessValue || 2000;

  // Base profitability on rate
  if (rate > 5000) return 90;
  if (rate > 3000) return 75;
  if (rate > 2000) return 60;
  if (rate > 1500) return 45;
  return 30;
}

function calculateLoadResourceRequirement(load: any): number {
  let requirement = 50; // Base requirement

  // Distance factor
  const distance = parseInt(load.distance?.replace(/[^\d]/g, '') || '500');
  if (distance > 1000) requirement += 30;
  else if (distance > 500) requirement += 20;
  else if (distance > 200) requirement += 10;

  // Workflow complexity
  if (load.workflowProgress === 0)
    requirement += 20; // Full workflow needed
  else if (load.workflowProgress < 50) requirement += 15;

  return Math.min(100, requirement);
}

function calculateLoadRiskLevel(load: any): 'low' | 'medium' | 'high' {
  const urgency = calculateLoadUrgency(load);
  const rate = load.rate || 2000;

  if (urgency >= 80 || rate > 4000) return 'high';
  if (urgency >= 60 || rate > 2500) return 'medium';
  return 'low';
}

function getEstimatedWorkflowDuration(load: any): number {
  // Base duration in minutes
  let duration = 120; // 2 hours base

  if (load.workflowProgress === 0)
    duration = 240; // 4 hours for full workflow
  else if (load.workflowProgress < 25)
    duration = 180; // 3 hours
  else if (load.workflowProgress < 50)
    duration = 120; // 2 hours
  else if (load.workflowProgress < 75)
    duration = 60; // 1 hour
  else duration = 30; // 30 minutes to complete

  return duration;
}

function generateLoadRiskFactors(load: any, task: any): string[] {
  const factors = [];

  if (load.daysUntilPickup <= 0) factors.push('Overdue pickup');
  else if (load.daysUntilPickup <= 1) factors.push('Urgent pickup');

  if (load.workflowProgress === 0) factors.push('Workflow not started');
  else if (load.workflowProgress < 25) factors.push('Minimal progress');

  if (load.rate > 4000) factors.push('High-value load');
  else if (load.rate > 3000) factors.push('Premium rate');

  if (task.urgencyScore >= 80) factors.push('Critical priority');

  const distance = parseInt(load.distance?.replace(/[^\d]/g, '') || '500');
  if (distance > 1000) factors.push('Long distance');

  return factors;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'recommendations': {
        const departmentId = searchParams.get('departmentId') || 'dispatch';
        const result =
          await taskPrioritizationService.getTaskRecommendations(departmentId);

        if (!result.success) {
          return NextResponse.json(result, { status: 400 });
        }

        return NextResponse.json(result);
      }

      case 'sample-tasks': {
        // Return sample tasks for demonstration
        const sampleTasks = [
          {
            id: 'task-001',
            type: 'load_assignment' as const,
            title: 'Assign Load FL-2024-789 to Available Driver',
            description:
              'High-priority load from Atlanta to Miami needs immediate driver assignment',
            urgencyScore: 95,
            profitabilityScore: 85,
            resourceRequirement: 30,
            deadline: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
            associatedRevenue: 3200,
            riskLevel: 'high' as const,
            dependencies: [],
            estimatedDuration: 45,
            assignedTo: 'dispatcher-001',
            createdAt: new Date().toISOString(),
            metadata: {
              loadId: 'FL-2024-789',
              customerId: 'CUST-456',
              department: 'dispatch' as const,
              businessImpact: 'high' as const,
            },
          },
          {
            id: 'task-002',
            type: 'compliance_check' as const,
            title: 'DOT Compliance Review for Driver Mike Rodriguez',
            description:
              'Quarterly compliance review due for driver license and medical certification',
            urgencyScore: 70,
            profitabilityScore: 20,
            resourceRequirement: 60,
            deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
            associatedRevenue: 0,
            riskLevel: 'medium' as const,
            dependencies: [],
            estimatedDuration: 90,
            assignedTo: 'compliance-001',
            createdAt: new Date().toISOString(),
            metadata: {
              driverId: 'DRV-001',
              department: 'compliance' as const,
              businessImpact: 'medium' as const,
            },
          },
          {
            id: 'task-003',
            type: 'route_optimization' as const,
            title: 'Optimize Multi-Stop Route for Load FL-2024-790',
            description:
              'Complex 5-stop route requires optimization for fuel efficiency and time savings',
            urgencyScore: 60,
            profitabilityScore: 75,
            resourceRequirement: 80,
            deadline: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours from now
            associatedRevenue: 2800,
            riskLevel: 'low' as const,
            dependencies: ['task-001'],
            estimatedDuration: 120,
            assignedTo: 'operations-001',
            createdAt: new Date().toISOString(),
            metadata: {
              loadId: 'FL-2024-790',
              vehicleId: 'VEH-123',
              department: 'operations' as const,
              businessImpact: 'medium' as const,
            },
          },
          {
            id: 'task-004',
            type: 'customer_communication' as const,
            title: 'Update Customer on Delayed Shipment FL-2024-788',
            description:
              'Weather delay requires immediate customer notification and rescheduling',
            urgencyScore: 90,
            profitabilityScore: 40,
            resourceRequirement: 25,
            deadline: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), // 1 hour from now
            associatedRevenue: 0,
            riskLevel: 'critical' as const,
            dependencies: [],
            estimatedDuration: 30,
            assignedTo: 'customer-service-001',
            createdAt: new Date().toISOString(),
            metadata: {
              loadId: 'FL-2024-788',
              customerId: 'CUST-789',
              department: 'operations' as const,
              businessImpact: 'critical' as const,
            },
          },
          {
            id: 'task-005',
            type: 'maintenance_alert' as const,
            title: 'Schedule Preventive Maintenance for Vehicle VEH-456',
            description:
              'Vehicle approaching 10,000 mile service interval, schedule maintenance',
            urgencyScore: 40,
            profitabilityScore: 30,
            resourceRequirement: 50,
            deadline: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), // 72 hours from now
            associatedRevenue: 0,
            riskLevel: 'medium' as const,
            dependencies: [],
            estimatedDuration: 60,
            assignedTo: 'maintenance-001',
            createdAt: new Date().toISOString(),
            metadata: {
              vehicleId: 'VEH-456',
              department: 'operations' as const,
              businessImpact: 'medium' as const,
            },
          },
        ];

        return NextResponse.json({
          success: true,
          data: sampleTasks,
          message: 'Sample tasks retrieved successfully',
        });
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action specified',
            message: 'Valid actions: recommendations, sample-tasks',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Task Prioritization API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    console.log(`[TaskPrioritization] ${action} request received`);

    switch (action) {
      case 'prioritize-tasks': {
        const { tasks, constraints, businessContext } = data;

        if (!tasks || !Array.isArray(tasks)) {
          return NextResponse.json(
            {
              success: false,
              error: 'Tasks array is required',
              message: 'Please provide an array of tasks to prioritize',
            },
            { status: 400 }
          );
        }

        // Set default constraints if not provided
        const defaultConstraints = {
          availableResources: 100,
          maxTasksPerHour: 10,
          prioritizeRevenue: true,
          riskTolerance: 'balanced' as const,
          departmentFocus: [],
        };

        // Set default business context if not provided
        const now = new Date();
        const defaultBusinessContext = {
          currentHour: now.getHours(),
          dayOfWeek: now.getDay(),
          seasonalFactor: 1.0,
          marketConditions: 'normal' as const,
        };

        const prioritizationRequest = {
          tasks,
          constraints: { ...defaultConstraints, ...constraints },
          businessContext: { ...defaultBusinessContext, ...businessContext },
        };

        console.log(`[TaskPrioritization] Prioritizing ${tasks.length} tasks`);

        const result = await taskPrioritizationService.prioritizeTasks(
          prioritizationRequest
        );

        if (!result.success) {
          return NextResponse.json(result, { status: 400 });
        }

        console.log(
          `[TaskPrioritization] Prioritization completed with score: ${result.data.prioritizationScore}`
        );

        return NextResponse.json(result);
      }

      case 'analyze-bottlenecks': {
        const { tasks } = data;

        if (!tasks || !Array.isArray(tasks)) {
          return NextResponse.json(
            {
              success: false,
              error: 'Tasks array is required',
              message: 'Please provide an array of tasks to analyze',
            },
            { status: 400 }
          );
        }

        console.log(
          `[TaskPrioritization] Analyzing workflow bottlenecks for ${tasks.length} tasks`
        );

        const result =
          await taskPrioritizationService.analyzeWorkflowBottlenecks(tasks);

        if (!result.success) {
          return NextResponse.json(result, { status: 400 });
        }

        console.log(`[TaskPrioritization] Bottleneck analysis completed`);

        return NextResponse.json(result);
      }

      case 'prioritize-driver-loads': {
        const { loads, driverId, context } = data;

        if (!loads || !Array.isArray(loads)) {
          return NextResponse.json(
            {
              success: false,
              error: 'Loads array is required',
              message: 'Please provide an array of loads to prioritize',
            },
            { status: 400 }
          );
        }

        console.log(
          `[TaskPrioritization] Prioritizing ${loads.length} driver loads for driver ${driverId}`
        );

        // Convert loads to tasks for prioritization
        const loadTasks = loads.map((load, index) => ({
          id: `load-${load.id}`,
          type: 'load_execution' as const,
          title: `Load ${load.id}: ${load.origin} → ${load.destination}`,
          description: `Execute workflow for load from ${load.origin} to ${load.destination}`,
          urgencyScore: calculateLoadUrgency(load),
          profitabilityScore: calculateLoadProfitability(load),
          resourceRequirement: calculateLoadResourceRequirement(load),
          deadline: load.pickupDate,
          associatedRevenue: load.businessValue || load.rate,
          riskLevel: calculateLoadRiskLevel(load),
          dependencies: [],
          estimatedDuration: getEstimatedWorkflowDuration(load),
          assignedTo: driverId,
          createdAt: new Date().toISOString(),
          metadata: {
            loadId: load.id,
            workflowProgress: load.workflowProgress || 0,
            nextStep: load.nextStep,
            daysUntilPickup: load.daysUntilPickup,
            daysUntilDelivery: load.daysUntilDelivery,
            department: 'driver' as const,
            businessImpact:
              load.rate > 3000 ? ('high' as const) : ('medium' as const),
          },
        }));

        // Prioritize using the existing service
        const prioritizationRequest = {
          tasks: loadTasks,
          constraints: {
            availableResources: context?.availableHours
              ? context.availableHours * 10
              : 100,
            maxTasksPerHour: 2, // Driver can handle ~2 loads per hour max
            prioritizeRevenue: true,
            riskTolerance: 'conservative' as const,
            departmentFocus: ['driver'],
          },
          businessContext: {
            currentHour: new Date().getHours(),
            dayOfWeek: new Date().getDay(),
            seasonalFactor: 1.0,
            marketConditions: 'normal' as const,
          },
        };

        const result = await taskPrioritizationService.prioritizeTasks(
          prioritizationRequest
        );

        if (!result.success) {
          return NextResponse.json(
            {
              success: false,
              error: 'Failed to prioritize driver loads',
              prioritizedLoads: [],
              metrics: null,
              recommendations: [],
            },
            { status: 400 }
          );
        }

        // Convert back to load format with prioritization data
        const prioritizedTasks =
          result.data?.prioritizedTasks || result.prioritizedTasks || [];
        const prioritizedLoads =
          prioritizedTasks.length > 0
            ? prioritizedTasks.map((task, index) => {
                const originalLoad = loads.find(
                  (l) => l.id === task.metadata?.loadId
                );
                return {
                  ...originalLoad,
                  urgencyScore: task.urgencyScore,
                  priorityLevel:
                    task.urgencyScore >= 80
                      ? 'CRITICAL'
                      : task.urgencyScore >= 65
                        ? 'HIGH'
                        : task.urgencyScore >= 50
                          ? 'MEDIUM'
                          : 'LOW',
                  riskFactors: generateLoadRiskFactors(originalLoad, task),
                  priorityRank: index + 1,
                };
              })
            : loads.map((load, index) => ({
                ...load,
                urgencyScore: calculateLoadUrgency(load),
                priorityLevel:
                  calculateLoadUrgency(load) >= 80
                    ? 'CRITICAL'
                    : calculateLoadUrgency(load) >= 65
                      ? 'HIGH'
                      : calculateLoadUrgency(load) >= 50
                        ? 'MEDIUM'
                        : 'LOW',
                riskFactors: generateLoadRiskFactors(load, {
                  urgencyScore: calculateLoadUrgency(load),
                }),
                priorityRank: index + 1,
              }));

        // Calculate driver-specific metrics
        const metrics = {
          totalLoads: loads.length,
          criticalLoads: prioritizedLoads.filter(
            (l) => l.priorityLevel === 'CRITICAL'
          ).length,
          highPriorityLoads: prioritizedLoads.filter(
            (l) => l.priorityLevel === 'HIGH'
          ).length,
          averageUrgency:
            prioritizedLoads.reduce((sum, l) => sum + l.urgencyScore, 0) /
            prioritizedLoads.length,
          workflowEfficiency: Math.round(
            result.data?.optimizationMetrics?.resourceUtilization || 75
          ),
          onTimePerformance: Math.round(85 + Math.random() * 10), // Mock for now
        };

        // Generate driver-specific recommendations
        const rawRecommendations =
          result.data?.recommendations || result.recommendations || [];
        const recommendations = rawRecommendations.map((rec) =>
          rec.replace('task', 'load').replace('Task', 'Load')
        );

        console.log(
          `[TaskPrioritization] Driver load prioritization completed for ${prioritizedLoads.length} loads`
        );

        return NextResponse.json({
          success: true,
          prioritizedLoads,
          metrics,
          recommendations,
        });
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action specified',
            message:
              'Valid actions: prioritize-tasks, analyze-bottlenecks, prioritize-driver-loads',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Task Prioritization API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
