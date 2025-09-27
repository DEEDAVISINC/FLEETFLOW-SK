import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Factoring BOL automation endpoint',
    status: 'active',
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    return NextResponse.json({
      success: true,
      message: 'Factoring BOL automation processed',
      data: body,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process factoring BOL automation',
      },
      { status: 400 }
    );
  }
}
