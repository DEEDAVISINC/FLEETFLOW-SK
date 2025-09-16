import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    alerts: [],
    message: 'No active alerts',
  });
}

export async function POST() {
  return NextResponse.json({
    success: true,
    message: 'Alert created',
  });
}
