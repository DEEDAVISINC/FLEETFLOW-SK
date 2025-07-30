// 🔄 Workflow API Endpoint
// Handles workflow management actions from the frontend

import { NextRequest, NextResponse } from 'next/server';
import { workflowBackendService } from '../../../lib/workflowBackendService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, loadId, stepId, data, driverId, dispatcherId, reason, requestedBy } = body;

    switch (action) {
      case 'create_workflow':
        if (!loadId || !driverId || !dispatcherId) {
          return NextResponse.json(
            { error: 'Missing required fields: loadId, driverId, dispatcherId' },
            { status: 400 }
          );
        }
        const workflowId = await workflowBackendService.createWorkflow(loadId, driverId, dispatcherId);
        return NextResponse.json({ success: true, workflowId });

      case 'get_workflow':
        if (!loadId) {
          return NextResponse.json(
            { error: 'Missing required field: loadId' },
            { status: 400 }
          );
        }
        const workflow = await workflowBackendService.getWorkflow(loadId);
        return NextResponse.json({ success: true, workflow });

      case 'complete_step':
        if (!loadId || !stepId || !requestedBy) {
          return NextResponse.json(
            { error: 'Missing required fields: loadId, stepId, requestedBy' },
            { status: 400 }
          );
        }
        const success = await workflowBackendService.completeStep(loadId, stepId, requestedBy, data);
        return NextResponse.json({ success });

      case 'upload_document':
        if (!loadId || !stepId || !data?.fileUrl || !data?.fileType || !requestedBy) {
          return NextResponse.json(
            { error: 'Missing required fields: loadId, stepId, fileUrl, fileType, requestedBy' },
            { status: 400 }
          );
        }
        const uploadSuccess = await workflowBackendService.uploadStepDocument(
          loadId,
          stepId,
          data.fileUrl,
          data.fileType,
          requestedBy,
          data.metadata
        );
        return NextResponse.json({ success: uploadSuccess });

      case 'request_override':
        if (!loadId || !stepId || !reason || !requestedBy) {
          return NextResponse.json(
            { error: 'Missing required fields: loadId, stepId, reason, requestedBy' },
            { status: 400 }
          );
        }
        const overrideSuccess = await workflowBackendService.requestOverride(loadId, stepId, reason, requestedBy);
        return NextResponse.json({ success: overrideSuccess });

      case 'get_workflow_actions':
        if (!loadId) {
          return NextResponse.json(
            { error: 'Missing required field: loadId' },
            { status: 400 }
          );
        }
        const actions = await workflowBackendService.getWorkflowActions(loadId);
        return NextResponse.json({ success: true, actions });

      case 'get_driver_workflows':
        if (!driverId) {
          return NextResponse.json(
            { error: 'Missing required field: driverId' },
            { status: 400 }
          );
        }
        const driverWorkflows = await workflowBackendService.getDriverWorkflows(driverId);
        return NextResponse.json({ success: true, workflows: driverWorkflows });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Workflow API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const loadId = searchParams.get('loadId');
    const driverId = searchParams.get('driverId');
    const action = searchParams.get('action') || 'get_workflow';

    if (action === 'get_workflow' && loadId) {
      const workflow = await workflowBackendService.getWorkflow(loadId);
      return NextResponse.json({ success: true, workflow });
    }

    if (action === 'get_driver_workflows' && driverId) {
      const workflows = await workflowBackendService.getDriverWorkflows(driverId);
      return NextResponse.json({ success: true, workflows });
    }

    if (action === 'get_workflow_actions' && loadId) {
      const actions = await workflowBackendService.getWorkflowActions(loadId);
      return NextResponse.json({ success: true, actions });
    }

    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Workflow API GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
