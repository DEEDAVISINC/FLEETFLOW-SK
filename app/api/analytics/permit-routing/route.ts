import { NextRequest, NextResponse } from 'next/server';
import { isFeatureEnabled } from '../../../config/feature-flags';
import { PermitRoutePlanningService } from '../../../services/permit-route-planning';

const permitRoutingService = new PermitRoutePlanningService();

export async function GET(request: NextRequest) {
  try {
    if (!isFeatureEnabled('PERMIT_ROUTE_PLANNING')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Permit Route Planning feature is not enabled',
          message:
            'Enable ENABLE_PERMIT_ROUTE_PLANNING=true to use this feature',
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const states = searchParams.get('states');

    switch (action) {
      case 'regulations':
        if (!states) {
          return NextResponse.json(
            {
              success: false,
              error: 'States parameter is required for regulations lookup',
            },
            { status: 400 }
          );
        }
        const stateList = states.split(',').map((s) => s.trim().toUpperCase());
        const regulations =
          await permitRoutingService.getStateRegulations(stateList);
        return NextResponse.json(regulations);

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action specified',
            message: 'Valid actions: regulations',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Permit Route Planning API Error:', error);
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
    if (!isFeatureEnabled('PERMIT_ROUTE_PLANNING')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Permit Route Planning feature is not enabled',
          message:
            'Enable ENABLE_PERMIT_ROUTE_PLANNING=true to use this feature',
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, loadRequest, route } = body;

    switch (action) {
      case 'plan-route':
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
          'equipmentType',
          'dimensions',
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

        // Validate dimensions
        if (
          !loadRequest.dimensions ||
          typeof loadRequest.dimensions.length !== 'number' ||
          typeof loadRequest.dimensions.width !== 'number' ||
          typeof loadRequest.dimensions.height !== 'number' ||
          typeof loadRequest.dimensions.weight !== 'number'
        ) {
          return NextResponse.json(
            {
              success: false,
              error:
                'Valid dimensions (length, width, height, weight) are required',
            },
            { status: 400 }
          );
        }

        const routePlanning =
          await permitRoutingService.planPermitRoute(loadRequest);
        return NextResponse.json(routePlanning);

      case 'validate-compliance':
        if (!loadRequest || !route) {
          return NextResponse.json(
            {
              success: false,
              error: 'Load request and route data are required',
            },
            { status: 400 }
          );
        }
        const compliance = await permitRoutingService.validateLoadCompliance(
          loadRequest,
          route
        );
        return NextResponse.json(compliance);

      case 'optimize-costs':
        if (!loadRequest) {
          return NextResponse.json(
            {
              success: false,
              error: 'Load request data is required',
            },
            { status: 400 }
          );
        }
        const optimization =
          await permitRoutingService.optimizePermitCosts(loadRequest);
        return NextResponse.json(optimization);

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action specified',
            message:
              'Valid actions: plan-route, validate-compliance, optimize-costs',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Permit Route Planning API Error:', error);
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
