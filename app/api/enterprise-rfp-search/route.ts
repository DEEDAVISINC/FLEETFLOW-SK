import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Enterprise RFP search functionality - return empty for production readiness
    return NextResponse.json([]);
  } catch (error) {
    console.error('Enterprise RFP search error:', error);
    return NextResponse.json(
      { error: 'Enterprise RFP search temporarily unavailable' },
      { status: 503 }
    );
  }
}
