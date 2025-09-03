import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Return empty drivers array - no mock data
    return NextResponse.json({
      drivers: [],
      total: 0,
      lastUpdated: new Date().toISOString(),
      message: 'No driver data available',
    });
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch driver data' },
      { status: 500 }
    );
  }
}
