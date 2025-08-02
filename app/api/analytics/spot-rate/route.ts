import { NextRequest, NextResponse } from 'next/server';
import { isFeatureEnabled } from '../../../config/feature-flags';
import { SpotRateOptimizationService } from '../../../services/spot-rate-optimization';

const spotRateService = new SpotRateOptimizationService();

export async function GET(request: NextRequest) {
  try {
    if (!isFeatureEnabled('SPOT_RATE_OPTIMIZATION')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Spot Rate Optimization feature is not enabled',
          message:
            'Enable ENABLE_SPOT_RATE_OPTIMIZATION=true to use this feature',
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const timeframe =
      (searchParams.get('timeframe') as 'week' | 'month' | 'quarter') ||
      'month';

    switch (action) {
      case 'market-intelligence':
        const intelligence = await spotRateService.getMarketIntelligence(
          origin || undefined,
          destination || undefined
        );
        return NextResponse.json(intelligence);

      case 'rate-history':
        if (!origin || !destination) {
          return NextResponse.json(
            {
              success: false,
              error: 'Origin and destination are required for rate history',
            },
            { status: 400 }
          );
        }
        const history = await spotRateService.analyzeRateHistory(
          origin,
          destination,
          timeframe
        );
        return NextResponse.json(history);

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action specified',
            message: 'Valid actions: market-intelligence, rate-history',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Spot Rate Optimization API Error:', error);
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
    if (!isFeatureEnabled('SPOT_RATE_OPTIMIZATION')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Spot Rate Optimization feature is not enabled',
          message:
            'Enable ENABLE_SPOT_RATE_OPTIMIZATION=true to use this feature',
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, loadParams, marketConditions } = body;

    switch (action) {
      case 'optimize-rate':
        if (!loadParams || !marketConditions) {
          return NextResponse.json(
            {
              success: false,
              error: 'Load parameters and market conditions are required',
            },
            { status: 400 }
          );
        }
        const optimization = await spotRateService.optimizeRate(
          loadParams,
          marketConditions
        );
        return NextResponse.json(optimization);

      case 'pricing-strategies':
        if (!loadParams) {
          return NextResponse.json(
            {
              success: false,
              error: 'Load parameters are required',
            },
            { status: 400 }
          );
        }
        const strategies =
          await spotRateService.generatePricingStrategies(loadParams);
        return NextResponse.json(strategies);

      case 'market-intelligence':
        const intelligence = await spotRateService.getMarketIntelligence(
          loadParams?.origin,
          loadParams?.destination
        );
        return NextResponse.json(intelligence);

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action specified',
            message:
              'Valid actions: optimize-rate, pricing-strategies, market-intelligence',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Spot Rate Optimization API Error:', error);
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
