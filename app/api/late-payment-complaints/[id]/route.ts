import { getCurrentUser } from '@/app/config/access';
import { latePaymentComplaintService } from '@/app/services/LatePaymentComplaintService';
import { NextRequest, NextResponse } from 'next/server';

// Get a specific complaint by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user } = getCurrentUser();

    // Check if user has permissions
    if (
      !['admin', 'finance', 'finance_manager', 'accountant', 'broker'].includes(
        user.role
      )
    ) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }

    // Get complaint with follow-up actions
    const complaint = latePaymentComplaintService.getComplaintById(params.id);

    if (!complaint) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      );
    }

    // Get associated follow-up actions
    const followUpActions = latePaymentComplaintService.getFollowUpActions(
      params.id
    );

    return NextResponse.json({
      complaint,
      followUpActions,
    });
  } catch (error) {
    console.error(`Error fetching complaint ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch complaint' },
      { status: 500 }
    );
  }
}

// Update a complaint
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

    // Check if complaint exists
    const existingComplaint = latePaymentComplaintService.getComplaintById(
      params.id
    );

    if (!existingComplaint) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      );
    }

    // Update complaint status
    if (data.status) {
      const updatedComplaint =
        latePaymentComplaintService.updateComplaintStatus(
          params.id,
          data.status,
          data.resolution
        );

      return NextResponse.json({ complaint: updatedComplaint });
    }

    // Assign complaint to user
    if (data.assignedTo) {
      const updatedComplaint = latePaymentComplaintService.assignComplaint(
        params.id,
        data.assignedTo
      );

      return NextResponse.json({ complaint: updatedComplaint });
    }

    return NextResponse.json(
      { error: 'No valid update parameters provided' },
      { status: 400 }
    );
  } catch (error) {
    console.error(`Error updating complaint ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update complaint' },
      { status: 500 }
    );
  }
}

// Delete a complaint (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user } = getCurrentUser();

    // Check if user has admin permissions
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized access - admin only operation' },
        { status: 403 }
      );
    }

    // Check if complaint exists
    const existingComplaint = latePaymentComplaintService.getComplaintById(
      params.id
    );

    if (!existingComplaint) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      );
    }

    // For this mock implementation, we'll just mark it as cancelled
    // In a real implementation with a database, we'd actually delete the record
    latePaymentComplaintService.updateComplaintStatus(params.id, 'cancelled');

    return NextResponse.json(
      { message: 'Complaint deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting complaint ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete complaint' },
      { status: 500 }
    );
  }
}
