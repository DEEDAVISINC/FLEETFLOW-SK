import { NextRequest, NextResponse } from 'next/server';
import { dispatcherAssignmentService } from '../../services/DispatcherAssignmentService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, assignmentData } = body;

    switch (action) {
      case 'assign_dispatcher':
        const assignmentId =
          await dispatcherAssignmentService.assignCarrierToDispatcher(
            assignmentData.carrierId,
            assignmentData.carrierName,
            assignmentData.dispatcherId,
            assignmentData.dispatcherName,
            assignmentData.dispatcherCompany,
            assignmentData.assignedBy,
            assignmentData.aiSource
          );
        return NextResponse.json({ success: true, assignmentId });

      case 'accept_assignment':
        await dispatcherAssignmentService.dispatcherAcceptsAssignment(
          body.assignmentId
        );
        return NextResponse.json({
          success: true,
          message: 'Assignment accepted and contract generated',
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Dispatcher assignment API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    if (status === 'pending') {
      const pendingAssignments =
        dispatcherAssignmentService.getPendingAssignments();
      return NextResponse.json({ assignments: pendingAssignments });
    } else if (status === 'active') {
      const activeAssignments =
        dispatcherAssignmentService.getActiveAssignments();
      return NextResponse.json({ assignments: activeAssignments });
    } else {
      return NextResponse.json(
        { error: 'Invalid status parameter' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Get assignments API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
