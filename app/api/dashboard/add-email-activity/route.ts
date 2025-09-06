/**
 * API Route for Adding Email Activities to DEPOINTE Dashboard
 * Allows AI communication service to update the live activity feed
 */

import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for dashboard activities (in production, this would be a database)
let dashboardActivities: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const {
      type,
      subject,
      recipient,
      priority = 'normal',
    } = await request.json();

    const activity = {
      id: `activity-${Date.now()}-${Math.random()}`,
      type,
      title:
        type === 'email_response' ? `Email Response Sent` : `Email Received`,
      description: `"${subject}" ${type === 'email_response' ? '→' : '←'} ${recipient}`,
      timestamp: new Date(),
      priority,
      icon: type === 'email_response' ? '📧' : '📬',
      staffMember: 'Alexis Best',
      department: 'OPERATIONS',
    };

    // Add to beginning of array and keep only last 50 activities
    dashboardActivities = [activity, ...dashboardActivities.slice(0, 49)];

    console.log(
      `📊 Dashboard activity added: ${activity.title} - "${subject}"`
    );

    return NextResponse.json({
      success: true,
      message: 'Activity added to dashboard',
      activityId: activity.id,
    });
  } catch (error) {
    console.error('❌ Error adding dashboard activity:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to add activity',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      activities: dashboardActivities,
      count: dashboardActivities.length,
    });
  } catch (error) {
    console.error('❌ Error getting dashboard activities:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to get activities',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}




