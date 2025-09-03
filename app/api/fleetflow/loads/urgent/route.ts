import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Return empty urgent loads array - no mock data
    return NextResponse.json({
      loads: [],
      total: 0,
      critical: 0,
      high: 0,
      lastUpdated: new Date().toISOString(),
      message: 'No urgent load data available',
      totalValue: 0,
    });
  } catch (error) {
    console.error('Error fetching urgent loads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch urgent loads data' },
      { status: 500 }
    );
  }
}
