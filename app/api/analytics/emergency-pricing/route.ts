import { NextRequest, NextResponse } from 'next/server';
import { isFeatureEnabled } from '../../../config/feature-flags';
import { EmergencyLoadPricingService } from '../../../services/emergency-load-pricing';

const emergencyPricingService = new EmergencyLoadPricingService();

export async function GET(request: NextRequest) {
  try {
    if (!isFeatureEnabled('EMERGENCY_LOAD_PRICING')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Emergency Load Pricing feature is not enabled',
          message:
            'Enable ENABLE_EMERGENCY_LOAD_PRICING=true to use this feature',
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const timeWindow = searchParams.get('timeWindow');
    const region = searchParams.get('region');

    switch (action) {
      case 'metrics':
        const metrics = await emergencyPricingService.getEmergencyLoadMetrics();
        return NextResponse.json(metrics);

      case 'strategies':
        const strategies = await emergencyPricingService.getPricingStrategies();
        return NextResponse.json(strategies);

      case 'optimize-capacity':
        if (!timeWindow || !region) {
          return NextResponse.json(
            {
              success: false,
              error:
                'Time window and region are required for capacity optimization',
            },
            { status: 400 }
          );
        }
        const optimization =
          await emergencyPricingService.optimizeEmergencyCapacity(
            parseInt(timeWindow),
            region
          );
        return NextResponse.json(optimization);

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action specified',
            message: 'Valid actions: metrics, strategies, optimize-capacity',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Emergency Load Pricing API Error:', error);
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
    if (!isFeatureEnabled('EMERGENCY_LOAD_PRICING')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Emergency Load Pricing feature is not enabled',
          message:
            'Enable ENABLE_EMERGENCY_LOAD_PRICING=true to use this feature',
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, loadRequest } = body;

    switch (action) {
      case 'calculate':
        if (!loadRequest) {
          return NextResponse.json(
            {
              success: false,
              error: 'Load request data is required',
            },
            { status: 400 }
          );
        }

        // Validate required fields
        const requiredFields = [
          'loadId',
          'origin',
          'destination',
          'distance',
          'urgencyLevel',
        ];
        const missingFields = requiredFields.filter(
          (field) => !loadRequest[field]
        );

        if (missingFields.length > 0) {
          return NextResponse.json(
            {
              success: false,
              error: `Missing required fields: ${missingFields.join(', ')}`,
            },
            { status: 400 }
          );
        }

        const pricing =
          await emergencyPricingService.calculateEmergencyPricing(loadRequest);
        return NextResponse.json(pricing);

      case 'metrics':
        const metrics = await emergencyPricingService.getEmergencyLoadMetrics();
        return NextResponse.json(metrics);

      case 'strategies':
        const strategies = await emergencyPricingService.getPricingStrategies();
        return NextResponse.json(strategies);

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action specified',
            message: 'Valid actions: calculate, metrics, strategies',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Emergency Load Pricing API Error:', error);
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
