import { NextRequest, NextResponse } from 'next/server';
import { aiCarrierOnboardingTrigger } from '../../../services/AICarrierOnboardingTrigger';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case 'process_ai_leads':
        // Trigger AI lead processing and onboarding
        await aiCarrierOnboardingTrigger.processAILeadsAndStartOnboarding();
        return NextResponse.json({
          success: true,
          message: 'AI lead processing and onboarding initiated',
        });

      case 'get_ai_onboardings':
        // Get all AI-initiated onboardings for dashboard
        const onboardings =
          aiCarrierOnboardingTrigger.getAIInitiatedOnboardings();
        return NextResponse.json({
          success: true,
          onboardings,
          count: onboardings.length,
        });

      case 'onboarding_completed':
        // Handle onboarding completion
        const { carrierId, onboardingRecord } = body;
        await aiCarrierOnboardingTrigger.handleOnboardingCompletion(
          carrierId,
          onboardingRecord
        );
        return NextResponse.json({
          success: true,
          message: 'Onboarding completion processed',
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
    const { searchParams } = new URL(req.url);
    const carrierId = searchParams.get('carrierId');

    if (carrierId) {
      const onboarding =
        aiCarrierOnboardingTrigger.getAIOnboardingByCarrierId(carrierId);
      return NextResponse.json({
        success: true,
        onboarding: onboarding || null,
      });
    } else {
      const allOnboardings =
        aiCarrierOnboardingTrigger.getAIInitiatedOnboardings();
      return NextResponse.json({
        success: true,
        onboardings: allOnboardings,
        count: allOnboardings.length,
      });
    }
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
