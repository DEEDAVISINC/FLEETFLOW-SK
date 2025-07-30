import { NextRequest, NextResponse } from 'next/server';
import { aiDispatcherWorkflowOrchestrator } from '../../../services/AIDispatcherWorkflowOrchestrator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case 'run_complete_demo':
        // Run the complete AI dispatcher workflow demo
        await aiDispatcherWorkflowOrchestrator.runCompleteDemo();
        return NextResponse.json({
          success: true,
          message:
            'Complete AI dispatcher workflow demo completed successfully',
          description:
            '🤖→🚛→👨‍💼→📄 AI leads → onboarding → assignment → contracts',
        });

      case 'execute_workflow':
        // Execute the AI workflow (AI leads → onboarding)
        await aiDispatcherWorkflowOrchestrator.executeCompleteWorkflow();
        return NextResponse.json({
          success: true,
          message:
            'AI workflow executed - carriers identified and onboarding started',
        });

      case 'get_status':
        // Get current workflow status
        const status =
          await aiDispatcherWorkflowOrchestrator.getWorkflowStatus();
        return NextResponse.json({
          success: true,
          status,
          message: 'Workflow status retrieved successfully',
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('AI dispatcher workflow demo API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get current workflow status
    const status = await aiDispatcherWorkflowOrchestrator.getWorkflowStatus();

    return NextResponse.json({
      success: true,
      workflowStatus: status,
      info: {
        title: 'AI Dispatcher Workflow Status',
        description: 'Complete AI-to-Contract Pipeline Status',
        workflow: [
          '🤖 AI identifies owner operators needing dispatchers',
          '🚛 Automatically starts carrier onboarding',
          '📢 Sends management notification: DISPATCHER NEEDED',
          '👨‍💼 Management assigns dispatcher',
          '✅ Dispatcher accepts assignment',
          '📄 5% commission contract automatically generated',
        ],
      },
    });
  } catch (error: any) {
    console.error('Get workflow status API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
