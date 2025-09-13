import { NextRequest, NextResponse } from 'next/server';
// TEMPORARILY DISABLED FOR EMERGENCY DEPLOYMENT
// import { aiCarrierOnboardingTrigger } from '../../../services/AICarrierOnboardingTrigger';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case 'process_ai_leads':
        // TEMPORARILY DISABLED FOR BUILD FIX
        return NextResponse.json({
          success: true,
          message:
            'AI onboarding temporarily disabled for emergency deployment',
        });

      case 'get_ai_onboardings':
        // TEMPORARILY DISABLED FOR BUILD FIX
        return NextResponse.json({
          success: true,
          onboardings: [],
          count: 0,
          message: 'Temporarily disabled for deployment fix',
        });

      case 'onboarding_completed':
        // TEMPORARILY DISABLED FOR BUILD FIX
        return NextResponse.json({
          success: true,
          message:
            'AI onboarding temporarily disabled for emergency deployment',
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('AI onboarding trigger API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // TEMPORARILY DISABLED FOR BUILD FIX
    return NextResponse.json({
      success: true,
      onboardings: [],
      count: 0,
      message: 'AI onboarding temporarily disabled for emergency deployment',
    });
  } catch (error: any) {
    console.error('Get AI onboarding API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
