import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // SAM.gov search functionality - return empty for production readiness
    return NextResponse.json([]);
  } catch (error) {
    console.error('SAM.gov search error:', error);
    return NextResponse.json(
      { error: 'SAM.gov search temporarily unavailable' },
      { status: 503 }
    );
  }
}
