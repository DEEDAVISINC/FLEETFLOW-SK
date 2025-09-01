/**
 * FleetFlow BOL Completion API Endpoint
 * Demonstrates the integrated workflow cascade triggered by BOL signing
 */

import { NextRequest, NextResponse } from 'next/server';
import { workflowManager } from '../../../../lib/workflowManager';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      loadId,
      driverId,
      receiverName,
      receiverSignature,
      receiverTitle,
      deliveryPhotos,
      additionalNotes,
    } = body;

    console.info('🚛 BOL completion request received for load:', loadId);

    // Validate required fields
    if (!loadId || !driverId || !receiverName || !receiverSignature) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Missing required fields: loadId, driverId, receiverName, receiverSignature',
        },
        { status: 400 }
      );
    }

    // Prepare step completion data with BOL signing information
    const stepData = {
      driverId,
      receiverName,
      receiverSignature,
      receiverTitle,
      signedAt: new Date().toISOString(),
      deliveryPhotos: deliveryPhotos || [],
      additionalNotes,
      bolSigned: true, // 🚨 CRITICAL FLAG for workflow integration
      bolNumber: `BOL-${loadId}-${Date.now()}`,
      // Additional workflow cascade data
      dispatcherId: body.dispatcherId || 'unknown',
      brokerId: body.brokerId || 'unknown',
    };

    console.info('📋 Completing delivery_completion step with BOL signing...');

    // Complete the delivery_completion workflow step
    // This will automatically trigger the WorkflowIntegrationService cascade
    const workflowResult = await workflowManager.completeStep(
      loadId,
      'delivery_completion',
      stepData,
      driverId
    );

    if (!workflowResult.success) {
      console.error(
        '❌ Workflow step completion failed:',
        workflowResult.error
      );
      return NextResponse.json(
        {
          success: false,
          error: 'Workflow completion failed: ' + workflowResult.error,
        },
        { status: 500 }
      );
    }

    console.info('✅ BOL completion workflow cascade completed successfully!');

    // Return success response with workflow status
    return NextResponse.json({
      success: true,
      message: 'BOL completion processed successfully',
      workflow: {
        loadId,
        stepCompleted: 'delivery_completion',
        status: workflowResult.workflow?.status,
        currentStep: workflowResult.workflow?.currentStep,
        totalSteps: workflowResult.workflow?.steps.length,
      },
      cascadeTriggered: true,
      processedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ BOL completion API error:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          'Internal server error: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check BOL completion status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const loadId = searchParams.get('loadId');

    if (!loadId) {
      return NextResponse.json(
        { success: false, error: 'loadId parameter required' },
        { status: 400 }
      );
    }

    // Get workflow status
    const workflow = workflowManager.getWorkflow(loadId);

    if (!workflow) {
      return NextResponse.json(
        { success: false, error: 'Workflow not found for load' },
        { status: 404 }
      );
    }

    // Find delivery_completion step
    const deliveryStep = workflow.steps.find(
      (step) => step.id === 'delivery_completion'
    );

    return NextResponse.json({
      success: true,
      loadId,
      workflow: {
        status: workflow.status,
        currentStep: workflow.currentStep,
        totalSteps: workflow.steps.length,
      },
      deliveryCompletion: {
        completed: deliveryStep?.completed || false,
        completedAt: deliveryStep?.completedAt,
        completedBy: deliveryStep?.completedBy,
        bolSigned: deliveryStep?.data?.bolSigned || false,
        receiverName: deliveryStep?.data?.receiverName,
        bolNumber: deliveryStep?.data?.bolNumber,
      },
    });
  } catch (error) {
    console.error('❌ BOL completion status API error:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          'Internal server error: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      },
      { status: 500 }
    );
  }
}
