import { getCurrentUser } from '@/app/config/access';
import { latePaymentComplaintService } from '@/app/services/LatePaymentComplaintService';
import { NextRequest, NextResponse } from 'next/server';

// Update a follow-up action
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user } = getCurrentUser();

    // Check if user has permissions
    if (
      !['admin', 'finance', 'finance_manager', 'accountant'].includes(user.role)
    ) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Complete a follow-up action
    const updatedAction = latePaymentComplaintService.completeFollowUpAction(
      params.id,
      data.notes
    );

    if (!updatedAction) {
      return NextResponse.json(
        { error: 'Follow-up action not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ followUpAction: updatedAction });
  } catch (error) {
    console.error(`Error updating follow-up action ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update follow-up action' },
      { status: 500 }
    );
  }
}
