import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Return empty activities array - no mock data
    return NextResponse.json({
      activities: [],
      total: 0,
      lastUpdated: new Date().toISOString(),
      message: 'No activity data available',
      types: {
        load_match: 0,
        auction: 0,
        campaign: 0,
        carrier_onboarding: 0,
        revenue: 0,
        alert: 0,
      },
    });
  } catch (error) {
    console.error('Error fetching activity feed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // In production, this would log a new activity to the database
    return NextResponse.json(
      {
        success: false,
        message: 'Activity logging not implemented - no database connection',
        error: 'Database not available',
      },
      { status: 501 }
    );
  } catch (error) {
    console.error('Error logging activity:', error);
    return NextResponse.json(
      { error: 'Failed to log activity' },
      { status: 500 }
    );
  }
}
