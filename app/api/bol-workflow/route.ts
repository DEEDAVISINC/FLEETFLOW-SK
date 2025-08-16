import { NextRequest, NextResponse } from 'next/server';
import BOLWorkflowService from '../../services/bol-workflow/BOLWorkflowService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'submit':
        return handleBOLSubmission(body);

      case 'approve':
        return handleBOLApproval(body);

      case 'get_submissions':
        return handleGetSubmissions(body);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('BOL Workflow API Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Handle BOL submission from driver portal
 */
async function handleBOLSubmission(body: any) {
  const {
    loadId,
    loadIdentifierId,
    driverId,
    driverName,
    brokerId,
    brokerName,
    shipperId,
    shipperName,
    shipperEmail,
    bolData,
  } = body;

  // Validate required fields
  if (!loadId || !loadIdentifierId || !driverId || !brokerId || !bolData) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const result = await BOLWorkflowService.submitBOL({
    loadId,
    loadIdentifierId,
    driverId,
    driverName,
    brokerId,
    brokerName,
    shipperId,
    shipperName,
    shipperEmail,
    bolData,
  });

  if (result.success) {
    return NextResponse.json({
      success: true,
      message: 'BOL submitted successfully',
      submissionId: result.submissionId,
    });
  } else {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
}

/**
 * Handle BOL approval from broker
 */
async function handleBOLApproval(body: any) {
  const {
    submissionId,
    brokerId,
    approved,
    reviewNotes,
    adjustments,
    customEmailTemplate,
  } = body;

  if (!submissionId || !brokerId || approved === undefined) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const result = await BOLWorkflowService.approveBOL(submissionId, brokerId, {
    approved,
    reviewNotes,
    adjustments,
  });

  if (result.success) {
    return NextResponse.json({
      success: true,
      message: approved ? 'BOL approved and invoice sent' : 'BOL rejected',
      invoiceId: result.invoiceId,
    });
  } else {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
}

/**
 * Get BOL submissions for broker review
 */
async function handleGetSubmissions(body: any) {
  try {
    console.log(
      '🔍 handleGetSubmissions called with body:',
      JSON.stringify(body, null, 2)
    );

    const { brokerId } = body;

    if (!brokerId) {
      console.error('❌ Missing broker ID in request');
      return NextResponse.json(
        { error: 'Broker ID required' },
        { status: 400 }
      );
    }

    console.log('📋 Getting submissions for broker:', brokerId);
    const submissions = BOLWorkflowService.getBrokerSubmissions(brokerId);
    console.log('📊 Found submissions:', submissions.length);

    const response = {
      success: true,
      submissions: submissions.map((sub) => ({
        ...sub,
        // Don't expose sensitive data
        bolData: {
          ...sub.bolData,
          driverSignature: sub.bolData.driverSignature
            ? '[SIGNATURE_PRESENT]'
            : '',
          receiverSignature: sub.bolData.receiverSignature
            ? '[SIGNATURE_PRESENT]'
            : '',
        },
      })),
    };

    console.log(
      '✅ Returning response with',
      response.submissions.length,
      'submissions'
    );
    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ Error in handleGetSubmissions:', error);
    return NextResponse.json(
      {
        error: 'Failed to get submissions',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const submissionId = searchParams.get('submissionId');

  if (submissionId) {
    const submission = BOLWorkflowService.getSubmission(submissionId);

    if (submission) {
      return NextResponse.json({
        success: true,
        submission,
      });
    } else {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }
  }

  // Return all notifications for debugging
  const notifications = BOLWorkflowService.getNotifications();

  return NextResponse.json({
    success: true,
    notifications: notifications.slice(-20), // Last 20 notifications
  });
}
