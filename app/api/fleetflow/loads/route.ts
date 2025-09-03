import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Return empty loads array - no mock data
    return NextResponse.json({
      loads: [],
      total: 0,
      lastUpdated: new Date().toISOString(),
      message: 'No load data available',
    });
  } catch (error) {
    console.error('Error fetching loads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch loads data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // In production, this would create a new load in the database
    return NextResponse.json(
      {
        success: false,
        message: 'Load creation not implemented - no database connection',
        error: 'Database not available',
      },
      { status: 501 }
    );
  } catch (error) {
    console.error('Error creating load:', error);
    return NextResponse.json(
      { error: 'Failed to create load' },
      { status: 500 }
    );
  }
}
