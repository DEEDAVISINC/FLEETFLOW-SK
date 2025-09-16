/**
 * Daily Briefing Generation API Endpoint
 * POST /api/daily-briefing/generate
 *
 * Generates and sends a personalized daily briefing to a user
 */

import { NextRequest, NextResponse } from 'next/server';
import { dailyBriefingService } from '../../../services/DailyBriefingService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, tenantId, scheduleTime } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    console.info(
      `🚀 Generating daily briefing for user: ${userId}, tenant: ${tenantId}`
    );

    // Generate the briefing
    const briefingData = await dailyBriefingService.generateDailyBriefing(
      userId,
      tenantId
    );

    // Send the briefing via notification system
    await dailyBriefingService.sendDailyBriefing(briefingData);

    console.info(`✅ Daily briefing sent successfully for user: ${userId}`);

    return NextResponse.json({
      success: true,
      message: 'Daily briefing generated and sent successfully',
      data: {
        userId,
        tenantId,
        generatedAt: new Date().toISOString(),
        briefingPreview: {
          prioritiesCount: briefingData.topPriorities.length,
          meetingsCount: briefingData.meetings.length,
          followUpsCount: briefingData.followUps.length,
          strategicQuestionsCount: briefingData.strategicQuestions.length,
        },
      },
    });
  } catch (error) {
    console.error('❌ Error generating daily briefing:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate daily briefing',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

