import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Automotive relationships API endpoint',
    data: [],
  });
}

export async function POST() {
  return NextResponse.json({
    success: true,
    message: 'Automotive relationships created',
  });
}
