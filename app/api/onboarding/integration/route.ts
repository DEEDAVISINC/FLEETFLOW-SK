import { NextRequest, NextResponse } from 'next/server';
import OnboardingUserIntegrationService, {
  OnboardingCompletionData,
} from '../../../services/OnboardingUserIntegrationService';

export async function POST(request: NextRequest) {
  try {
    const onboardingData: OnboardingCompletionData = await request.json();

    // Validate required fields
    if (
      !onboardingData.tenantId ||
      !onboardingData.tenantName ||
      !onboardingData.users ||
      onboardingData.users.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Missing required onboarding data: tenantId, tenantName, and users are required',
        },
        { status: 400 }
      );
    }

    // Process onboarding completion
    const result =
      await OnboardingUserIntegrationService.processOnboardingCompletion(
        onboardingData
      );

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          message: result.message,
          data: {
            userProfiles: result.userProfiles,
            managementNotifications: result.managementNotifications,
            processedUsers: result.userProfiles.length,
          },
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Onboarding integration API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: `Internal server error: ${error}`,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    // Get pending management notifications
    const notifications =
      await OnboardingUserIntegrationService.getPendingNotifications(
        tenantId || undefined
      );

    return NextResponse.json(
      {
        success: true,
        notifications,
        count: notifications.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Get notifications API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: `Failed to fetch notifications: ${error}`,
      },
      { status: 500 }
    );
  }
}
