import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Onboarding integration API endpoint',
    data: {
      status: 'ready',
      integrations: [],
    },
  });
}

export async function POST() {
  return NextResponse.json({
    success: true,
    message: 'Integration configured',
  });
}
