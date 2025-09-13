import { NextRequest, NextResponse } from 'next/server';
// TEMPORARILY DISABLED FOR BUILD FIX - EMERGENCY DEPLOYMENT
// import { aiDispatcherWorkflowOrchestrator } from '../../../services/AIDispatcherWorkflowOrchestrator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case 'run_complete_demo':
        // TEMPORARILY DISABLED FOR BUILD FIX
        return NextResponse.json({
          success: true,
          message:
            'AI workflow temporarily disabled for emergency deployment fix',
          description: 'Will be re-enabled after site fixes deploy',
        });

      case 'execute_workflow':
        // TEMPORARILY DISABLED FOR BUILD FIX
        return NextResponse.json({
          success: true,
          message:
            'AI workflow temporarily disabled for emergency deployment fix',
        });

      case 'get_status':
        // TEMPORARILY DISABLED FOR BUILD FIX
        return NextResponse.json({
          success: true,
          status: { message: 'Temporarily disabled for deployment fix' },
          message:
            'AI workflow temporarily disabled for emergency deployment fix',
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
    // TEMPORARILY DISABLED FOR BUILD FIX
    return NextResponse.json({
      success: true,
      workflowStatus: { message: 'Temporarily disabled for deployment fix' },
      info: {
        title: 'AI Dispatcher Workflow Status (Temporarily Disabled)',
        description:
          'Complete AI-to-Contract Pipeline Status - Will be re-enabled after deployment fix',
        workflow: [
          '🔧 Emergency deployment in progress',
          '🚀 Full workflow will be restored shortly',
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
