import { getCurrentUser } from '@/app/config/access';
import { latePaymentComplaintService } from '@/app/services/LatePaymentComplaintService';
import { NextRequest, NextResponse } from 'next/server';

// Add a follow-up action
export async function POST(request: NextRequest) {
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

    // Validate required fields
    if (
      !data.complaintId ||
      !data.actionType ||
      !data.description ||
      !data.dueDate ||
      !data.assignedTo
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if complaint exists
    const complaint = latePaymentComplaintService.getComplaintById(
      data.complaintId
    );

    if (!complaint) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      );
    }

    // Check if complaint is in a valid state for adding follow-ups
    if (complaint.status === 'resolved' || complaint.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Cannot add follow-up to resolved or cancelled complaint' },
        { status: 400 }
      );
    }

    // Create the follow-up action
    const followUpAction = latePaymentComplaintService.addFollowUpAction({
      complaintId: data.complaintId,
      actionType: data.actionType,
      description: data.description,
      dueDate: data.dueDate,
      assignedTo: data.assignedTo,
      status: 'pending',
    });

    return NextResponse.json({ followUpAction }, { status: 201 });
  } catch (error) {
    console.error('Error creating follow-up action:', error);
    return NextResponse.json(
      { error: 'Failed to create follow-up action' },
      { status: 500 }
    );
  }
}
