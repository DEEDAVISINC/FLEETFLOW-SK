import { getCurrentUser } from '@/app/config/access';
import { latePaymentComplaintService } from '@/app/services/LatePaymentComplaintService';
import { NextRequest, NextResponse } from 'next/server';

// Get all complaints or filtered complaints
export async function GET(request: NextRequest) {
  try {
    // Check if user has permissions
    const { user } = getCurrentUser();
    if (
      !['admin', 'finance', 'finance_manager', 'accountant'].includes(user.role)
    ) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }

    // Get query parameters
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const entityType = url.searchParams.get('entityType');
    const entityId = url.searchParams.get('entityId');

    // Apply filters
    let complaints = latePaymentComplaintService.getAllComplaints();

    if (status) {
      complaints = complaints.filter((c) => c.status === status);
    }

    if (entityType) {
      complaints = complaints.filter((c) => c.entityType === entityType);
    }

    if (entityId) {
      complaints = complaints.filter((c) => c.entityId === entityId);
    }

    // Sort complaints by submission date (newest first)
    complaints.sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

    return NextResponse.json({ complaints });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return NextResponse.json(
      { error: 'Failed to fetch complaints' },
      { status: 500 }
    );
  }
}

// Create a new complaint
export async function POST(request: NextRequest) {
  try {
    // Check if user has permissions
    const { user } = getCurrentUser();
    if (
      ![
        'admin',
        'finance',
        'finance_manager',
        'accountant',
        'broker',
        'dispatcher',
      ].includes(user.role)
    ) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Validate required fields
    if (
      !data.entityType ||
      !data.entityName ||
      !data.invoiceNumber ||
      !data.invoiceAmount ||
      !data.dueDate
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate days overdue if not provided
    if (!data.daysOverdue) {
      const dueDate = new Date(data.dueDate);
      const today = new Date();
      const diffTime = today.getTime() - dueDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      data.daysOverdue = diffDays > 0 ? diffDays : 0;
    }

    // Create the complaint
    const complaintData = {
      entityType: data.entityType,
      entityId: data.entityId || '',
      entityName: data.entityName,
      invoiceNumber: data.invoiceNumber,
      invoiceDate: data.invoiceDate,
      invoiceAmount: data.invoiceAmount,
      dueDate: data.dueDate,
      daysOverdue: data.daysOverdue,
      description: data.description || '',
      priority: data.priority || 'medium',
      contactAttempts: data.contactAttempts || '',
      submittedBy: user.id,
      submittedAt: new Date().toISOString(),
      status: 'new',
    };

    const complaint =
      latePaymentComplaintService.createComplaint(complaintData);

    return NextResponse.json({ complaint }, { status: 201 });
  } catch (error) {
    console.error('Error creating complaint:', error);
    return NextResponse.json(
      { error: 'Failed to create complaint' },
      { status: 500 }
    );
  }
}
