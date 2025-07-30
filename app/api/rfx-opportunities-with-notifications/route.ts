import { NextRequest, NextResponse } from 'next/server';
import { RFxResponseService } from '../../services/RFxResponseService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      searchParams = {},
      userId = 'default-user',
      sendNotifications = true,
    } = body;

    const rfxService = new RFxResponseService();

    // Search for RFx opportunities and send universal notifications
    const result = await rfxService.searchRFxOpportunitiesWithNotifications(
      searchParams,
      userId,
      sendNotifications
    );

    return NextResponse.json({
      success: true,
      data: {
        opportunities: result.opportunities,
        notificationsSent: result.notificationsSent,
        totalOpportunities: result.opportunities.length,
        platformsCovered: [
          ...new Set(
            result.opportunities.map((opp) => opp.source || 'Unknown')
          ),
        ],
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('RFx opportunities with notifications API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search opportunities and send notifications',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default-user';
    const sendNotifications = searchParams.get('sendNotifications') !== 'false';

    // Default search parameters for GET request
    const defaultSearchParams = {
      platforms: [
        'government',
        'enterprise',
        'automotive',
        'instant_markets',
        'warehousing',
      ],
      keywords: 'transportation freight logistics',
    };

    const rfxService = new RFxResponseService();

    const result = await rfxService.searchRFxOpportunitiesWithNotifications(
      defaultSearchParams,
      userId,
      sendNotifications
    );

    return NextResponse.json({
      success: true,
      data: {
        opportunities: result.opportunities,
        notificationsSent: result.notificationsSent,
        totalOpportunities: result.opportunities.length,
        platformsCovered: [
          ...new Set(
            result.opportunities.map((opp) => opp.source || 'Unknown')
          ),
        ],
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('RFx opportunities with notifications GET API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search opportunities and send notifications',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
