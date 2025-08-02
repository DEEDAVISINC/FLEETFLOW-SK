import { NextRequest, NextResponse } from 'next/server';
import { isFeatureEnabled } from '../../../config/feature-flags';
import { CompetitorIntelligenceService } from '../../../services/competitor-intelligence';

const competitorService = new CompetitorIntelligenceService();

export async function GET(request: NextRequest) {
  try {
    // Check if feature is enabled
    if (!isFeatureEnabled('COMPETITOR_INTELLIGENCE')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Competitor Intelligence feature is not enabled',
          message:
            'Enable ENABLE_COMPETITOR_INTELLIGENCE=true to use this feature',
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const competitor = searchParams.get('competitor');
    const competitors = searchParams.get('competitors');

    switch (action) {
      case 'analyze':
        if (!competitor) {
          return NextResponse.json(
            {
              success: false,
              error: 'Competitor name is required for analysis',
            },
            { status: 400 }
          );
        }

        const analysis = await competitorService.analyzeCompetitor(competitor);
        return NextResponse.json(analysis);

      case 'compare':
        if (!competitors) {
          return NextResponse.json(
            {
              success: false,
              error: 'Competitor names are required for comparison',
            },
            { status: 400 }
          );
        }

        const competitorList = competitors.split(',');
        const comparison =
          await competitorService.compareCompetitors(competitorList);
        return NextResponse.json(comparison);

      case 'market':
        const marketIntelligence =
          await competitorService.getMarketIntelligence();
        return NextResponse.json(marketIntelligence);

      case 'positioning':
        const recommendations =
          await competitorService.getPositioningRecommendations();
        return NextResponse.json(recommendations);

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action specified',
            message: 'Valid actions: analyze, compare, market, positioning',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Competitor Intelligence API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isFeatureEnabled('COMPETITOR_INTELLIGENCE')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Competitor Intelligence feature is not enabled',
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, competitor, competitors } = body;

    switch (action) {
      case 'analyze':
        if (!competitor) {
          return NextResponse.json(
            {
              success: false,
              error: 'Competitor name is required',
            },
            { status: 400 }
          );
        }

        const analysis = await competitorService.analyzeCompetitor(competitor);
        return NextResponse.json(analysis);

      case 'compare':
        if (!competitors || !Array.isArray(competitors)) {
          return NextResponse.json(
            {
              success: false,
              error: 'Competitor array is required',
            },
            { status: 400 }
          );
        }

        const comparison =
          await competitorService.compareCompetitors(competitors);
        return NextResponse.json(comparison);

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action specified',
            message: 'Valid actions: analyze, compare',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Competitor Intelligence API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
