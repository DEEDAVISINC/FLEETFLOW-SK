import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'AI Dispatcher Workflow Demo endpoint',
    status: 'demo_mode',
    features: [
      'Load assignment automation',
      'Route optimization',
      'Driver communication',
      'Status tracking',
    ],
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    return NextResponse.json({
      success: true,
      message: 'AI dispatcher workflow demo processed',
      workflow_id: `demo_${Date.now()}`,
      data: body,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process AI dispatcher workflow demo',
      },
      { status: 400 }
    );
  }
}
