import { NextRequest, NextResponse } from 'next/server';
import { isFeatureEnabled } from '../../../config/feature-flags';
import { SeasonalLoadPlanningService } from '../../../services/seasonal-load-planning';

const seasonalPlanningService = new SeasonalLoadPlanningService();

export async function GET(request: NextRequest) {
  try {
    if (!isFeatureEnabled('SEASONAL_LOAD_PLANNING')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Seasonal Load Planning feature is not enabled',
          message:
            'Enable ENABLE_SEASONAL_LOAD_PLANNING=true to use this feature',
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const regions = searchParams.get('regions');
    const years = searchParams.get('years');

    switch (action) {
      case 'trends':
        const regionList = regions
          ? regions.split(',').map((r) => r.trim())
          : ['US'];
        const yearCount = years ? parseInt(years) : 3;
        const trends = await seasonalPlanningService.getSeasonalTrends(
          regionList,
          yearCount
        );
        return NextResponse.json(trends);

      case 'templates':
        const templates = await seasonalPlanningService.getPlanningTemplates();
        return NextResponse.json(templates);

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action specified',
            message: 'Valid actions: trends, templates',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Seasonal Load Planning API Error:', error);
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
    if (!isFeatureEnabled('SEASONAL_LOAD_PLANNING')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Seasonal Load Planning feature is not enabled',
          message:
            'Enable ENABLE_SEASONAL_LOAD_PLANNING=true to use this feature',
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, planRequest, currentCapacity, demandForecast } = body;

    switch (action) {
      case 'create_plan':
        if (!planRequest) {
          return NextResponse.json(
            {
              success: false,
              error: 'Plan request data is required',
            },
            { status: 400 }
          );
        }

        // Validate required fields
        const requiredFields = [
          'planningPeriod',
          'targetRegions',
          'equipmentTypes',
          'capacityConstraints',
        ];
        const missingFields = requiredFields.filter(
          (field) => !planRequest[field]
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

        // Validate planning period
        if (
          !planRequest.planningPeriod.startDate ||
          !planRequest.planningPeriod.endDate
        ) {
          return NextResponse.json(
            {
              success: false,
              error: 'Planning period start and end dates are required',
            },
            { status: 400 }
          );
        }

        // Validate date range
        const startDate = new Date(planRequest.planningPeriod.startDate);
        const endDate = new Date(planRequest.planningPeriod.endDate);
        if (startDate >= endDate) {
          return NextResponse.json(
            {
              success: false,
              error: 'End date must be after start date',
            },
            { status: 400 }
          );
        }

        // Validate season
        const validSeasons = [
          'spring',
          'summer',
          'fall',
          'winter',
          'holiday',
          'custom',
        ];
        if (!validSeasons.includes(planRequest.planningPeriod.season)) {
          return NextResponse.json(
            {
              success: false,
              error:
                'Invalid season. Must be one of: ' + validSeasons.join(', '),
            },
            { status: 400 }
          );
        }

        const plan =
          await seasonalPlanningService.createSeasonalPlan(planRequest);
        return NextResponse.json(plan);

      case 'optimize_capacity':
        if (!currentCapacity || !demandForecast) {
          return NextResponse.json(
            {
              success: false,
              error: 'Current capacity and demand forecast are required',
            },
            { status: 400 }
          );
        }
        const optimization = await seasonalPlanningService.optimizeCapacity(
          currentCapacity,
          demandForecast
        );
        return NextResponse.json(optimization);

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action specified',
            message: 'Valid actions: create_plan, optimize_capacity',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Seasonal Load Planning API Error:', error);
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
