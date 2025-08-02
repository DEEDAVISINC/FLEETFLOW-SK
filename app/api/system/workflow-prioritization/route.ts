import { NextRequest, NextResponse } from 'next/server';
import { FleetFlowSystemOrchestrator } from '../../../services/system-orchestrator';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    const orchestrator = new FleetFlowSystemOrchestrator({
      enableRealTimeTracking: true,
      enableSmartRouting: true,
      enableAutoNotifications: true,
      enableScheduleOptimization: true,
      enablePredictiveAnalytics: true,
      enableCarrierValidation: true,
      enableCarrierMonitoring: true,
      enableTaskPrioritization: true,
    });

    switch (action) {
      case 'demo-workflows':
        // Create sample workflows for demonstration
        const sampleLoads = [
          {
            id: 'LOAD-001',
            origin: 'Atlanta, GA',
            destination: 'Miami, FL',
            priority: 'high',
            revenue: 3500,
            pickupDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
            deliveryDate: new Date(
              Date.now() + 24 * 60 * 60 * 1000
            ).toISOString(),
          },
          {
            id: 'LOAD-002',
            origin: 'Chicago, IL',
            destination: 'Dallas, TX',
            priority: 'urgent',
            revenue: 4200,
            pickupDate: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
            deliveryDate: new Date(
              Date.now() + 18 * 60 * 60 * 1000
            ).toISOString(),
          },
          {
            id: 'LOAD-003',
            origin: 'Los Angeles, CA',
            destination: 'Phoenix, AZ',
            priority: 'medium',
            revenue: 2800,
            pickupDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
            deliveryDate: new Date(
              Date.now() + 30 * 60 * 60 * 1000
            ).toISOString(),
          },
          {
            id: 'LOAD-004',
            origin: 'New York, NY',
            destination: 'Boston, MA',
            priority: 'low',
            revenue: 1500,
            pickupDate: new Date(
              Date.now() + 12 * 60 * 60 * 1000
            ).toISOString(),
            deliveryDate: new Date(
              Date.now() + 36 * 60 * 60 * 1000
            ).toISOString(),
          },
          {
            id: 'LOAD-005',
            origin: 'Houston, TX',
            destination: 'New Orleans, LA',
            priority: 'critical',
            revenue: 5200,
            pickupDate: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
            deliveryDate: new Date(
              Date.now() + 12 * 60 * 60 * 1000
            ).toISOString(),
          },
        ];

        const prioritizationResults =
          await orchestrator.processMultipleLoadsWithPrioritization(
            sampleLoads
          );

        return NextResponse.json({
          success: true,
          data: {
            totalLoads: sampleLoads.length,
            processedWorkflows: prioritizationResults.workflows.length,
            processingOrder: prioritizationResults.processingOrder,
            prioritizationMetrics:
              prioritizationResults.prioritizationResults.prioritizationMetrics,
            recommendations:
              prioritizationResults.prioritizationResults.recommendations,
            workflowSummary: prioritizationResults.workflows.map((w) => ({
              loadId: w.loadId,
              status: w.status,
              created: w.created,
              priorityRank:
                prioritizationResults.processingOrder.indexOf(w.loadId) + 1,
            })),
          },
          message:
            'System workflow prioritization demonstration completed successfully',
        });

      case 'status':
        return NextResponse.json({
          success: true,
          data: {
            systemOrchestrator: 'operational',
            taskPrioritization: 'enabled',
            integrationComponents: [
              'AI Automation Engine',
              'Route Optimization Service',
              'AI Dispatcher',
              'Load Distribution Service',
              'Scheduling Service',
              'Document Flow Service',
              'Enhanced Carrier Service',
              'Heavy Haul Permit Service',
              'Smart Task Prioritization Service',
            ],
            capabilities: [
              'Intelligent Workflow Prioritization',
              'Multi-Load Processing Optimization',
              'AI-Powered Task Ordering',
              'System Efficiency Optimization',
              'Revenue-Based Prioritization',
              'Risk Assessment Integration',
              'Real-time Workflow Management',
            ],
          },
          message:
            'System Orchestrator with Task Prioritization is fully operational',
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action. Available actions: demo-workflows, status',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('System workflow prioritization error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'System workflow prioritization failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, workflows, config } = body;

    const orchestrator = new FleetFlowSystemOrchestrator(
      config || {
        enableRealTimeTracking: true,
        enableSmartRouting: true,
        enableAutoNotifications: true,
        enableScheduleOptimization: true,
        enablePredictiveAnalytics: true,
        enableCarrierValidation: true,
        enableCarrierMonitoring: true,
        enableTaskPrioritization: true,
      }
    );

    switch (action) {
      case 'prioritize-workflows':
        if (!workflows || !Array.isArray(workflows)) {
          return NextResponse.json(
            {
              success: false,
              error: 'workflows array is required',
            },
            { status: 400 }
          );
        }

        const prioritizationResults =
          await orchestrator.prioritizeSystemWorkflows(workflows);

        return NextResponse.json({
          success: true,
          data: prioritizationResults,
          message: `Successfully prioritized ${workflows.length} system workflows`,
        });

      case 'process-loads':
        const { loads } = body;
        if (!loads || !Array.isArray(loads)) {
          return NextResponse.json(
            {
              success: false,
              error: 'loads array is required',
            },
            { status: 400 }
          );
        }

        const processingResults =
          await orchestrator.processMultipleLoadsWithPrioritization(loads);

        return NextResponse.json({
          success: true,
          data: processingResults,
          message: `Successfully processed ${loads.length} loads with intelligent prioritization`,
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error:
              'Invalid action. Available actions: prioritize-workflows, process-loads',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('System workflow prioritization POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'System workflow prioritization failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
