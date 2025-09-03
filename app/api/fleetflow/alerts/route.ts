import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Return empty alerts array - no mock data
    return NextResponse.json({
      alerts: [],
      total: 0,
      lastUpdated: new Date().toISOString(),
      message: 'No alert data available',
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alert data' },
      { status: 500 }
    );
  }
}
