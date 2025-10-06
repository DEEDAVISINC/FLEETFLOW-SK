import { NextRequest, NextResponse } from 'next/server';

/**
 * DEPOINTE Task Execution API
 * Processes deployed campaigns and updates staff performance
 */

interface Task {
  id: string;
  title: string;
  type: string;
  priority: string;
  assignedTo: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  targetQuantity: number;
  progress: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  estimatedRevenue: number;
  actualRevenue: number;
}

interface StaffPerformance {
  id: string;
  tasksCompleted: number;
  tasksInProgress: number;
  revenue: number;
  efficiency: number;
  currentTask: string;
  lastActivity: string;
}

/**
 * POST /api/depointe/execute-tasks
 * Execute tasks for deployed campaigns and update staff performance
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tasks, action } = body;

    if (action === 'process') {
      // Process tasks and generate results
      const results = await processActiveTasks(tasks);
      
      return NextResponse.json({
        success: true,
        data: results,
        timestamp: new Date().toISOString(),
      });
    }

    if (action === 'update_metrics') {
      // Update staff performance metrics
      const metrics = await updateStaffMetrics(body.staff, tasks);
      
      return NextResponse.json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Task execution error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/depointe/execute-tasks
 * Get task execution status and staff performance
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId') || 'default';

    // TODO: Fetch from database instead of returning placeholder
    const status = {
      activeTasks: 0,
      completedTasks: 0,
      totalRevenue: 0,
      activeStaff: 0,
      lastExecution: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: status,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching task status:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Process active tasks and generate leads/results
 */
async function processActiveTasks(tasks: Task[]) {
  const activeTasks = tasks.filter(
    (t) => t.status === 'pending' || t.status === 'in_progress'
  );

  const results = [];

  for (const task of activeTasks) {
    // Simulate task execution progress
    const progressIncrement = Math.floor(Math.random() * 15) + 5; // 5-20% progress per cycle
    const newProgress = Math.min(task.progress + progressIncrement, 100);
    
    // Calculate revenue based on progress
    const revenueGenerated = (task.estimatedRevenue * progressIncrement) / 100;

    // Generate leads based on task type
    const leadsGenerated = await generateLeads(task, progressIncrement);

    results.push({
      taskId: task.id,
      progress: newProgress,
      status: newProgress >= 100 ? 'completed' : 'in_progress',
      revenueGenerated,
      leadsGenerated,
      timestamp: new Date().toISOString(),
    });
  }

  return results;
}

/**
 * Generate leads based on task execution
 */
async function generateLeads(task: Task, progressIncrement: number) {
  const leadsPerIncrement = Math.floor(
    (task.targetQuantity * progressIncrement) / 100
  );

  const leads = [];

  for (let i = 0; i < leadsPerIncrement; i++) {
    leads.push({
      id: `LEAD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      taskId: task.id,
      company: `Prospect ${i + 1}`,
      status: 'new',
      potentialValue: Math.floor(Math.random() * 50000) + 10000,
      source: 'AI Campaign',
      createdAt: new Date().toISOString(),
      assignedTo: task.assignedTo[0],
    });
  }

  // TODO: Save leads to database
  console.log(`Generated ${leads.length} leads for task ${task.id}`);

  return leads;
}

/**
 * Update staff performance metrics
 */
async function updateStaffMetrics(staff: any[], tasks: Task[]) {
  const staffMetrics: Record<string, StaffPerformance> = {};

  staff.forEach((member) => {
    const assignedTasks = tasks.filter((t) =>
      t.assignedTo.includes(member.id)
    );
    
    const completedTasks = assignedTasks.filter((t) => t.status === 'completed');
    const inProgressTasks = assignedTasks.filter(
      (t) => t.status === 'in_progress'
    );

    const totalRevenue = completedTasks.reduce(
      (sum, t) => sum + t.actualRevenue,
      0
    );
    
    const efficiency = completedTasks.length > 0
      ? Math.floor(
          (completedTasks.reduce((sum, t) => sum + t.progress, 0) /
            completedTasks.length)
        )
      : 0;

    staffMetrics[member.id] = {
      id: member.id,
      tasksCompleted: completedTasks.length,
      tasksInProgress: inProgressTasks.length,
      revenue: totalRevenue,
      efficiency,
      currentTask:
        inProgressTasks.length > 0
          ? inProgressTasks[0].title
          : 'Ready for assignment',
      lastActivity: new Date().toISOString(),
    };
  });

  // TODO: Save metrics to database
  console.log('Updated staff metrics:', Object.keys(staffMetrics).length);

  return staffMetrics;
}
