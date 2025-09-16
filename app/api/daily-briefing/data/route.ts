/**
 * Daily Briefing Data API Endpoint
 * GET /api/daily-briefing/data?userId=...&tenantId=...
 *
 * Retrieves briefing data for display in the UI
 */

import { NextRequest, NextResponse } from 'next/server';
import { dailyBriefingService } from '../../../services/DailyBriefingService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const tenantId = searchParams.get('tenantId');

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
      `📊 Retrieving briefing data for user: ${userId}, tenant: ${tenantId}`
    );

    // Generate the briefing data (this could be cached in production)
    const briefingData = await dailyBriefingService.generateDailyBriefing(
      userId,
      tenantId
    );

    console.info(`✅ Briefing data retrieved successfully for user: ${userId}`);

    return NextResponse.json({
      success: true,
      data: briefingData,
      metadata: {
        generatedAt: new Date().toISOString(),
        userId,
        tenantId,
      },
    });
  } catch (error) {
    console.error('❌ Error retrieving briefing data:', error);

    return NextResponse.json(
      {
        error: 'Failed to retrieve briefing data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

