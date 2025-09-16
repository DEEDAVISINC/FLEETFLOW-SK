import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Email intelligence API endpoint',
    data: { intelligence: [] },
  });
}

export async function POST() {
  return NextResponse.json({
    success: true,
    message: 'Email processed',
  });
}
