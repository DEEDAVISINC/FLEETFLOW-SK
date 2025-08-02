import { NextRequest, NextResponse } from 'next/server';
import { isFeatureEnabled } from '../../../config/feature-flags';
import { HazmatRouteComplianceService } from '../../../services/hazmat-route-compliance';

const hazmatComplianceService = new HazmatRouteComplianceService();

export async function GET(request: NextRequest) {
  try {
    if (!isFeatureEnabled('HAZMAT_ROUTE_COMPLIANCE')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Hazmat Route Compliance feature is not enabled',
          message:
            'Enable ENABLE_HAZMAT_ROUTE_COMPLIANCE=true to use this feature',
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const hazmatClass = searchParams.get('hazmatClass');
    const states = searchParams.get('states');

    switch (action) {
      case 'regulations':
        if (!hazmatClass) {
          return NextResponse.json(
            {
              success: false,
              error: 'Hazmat class is required for regulations lookup',
            },
            { status: 400 }
          );
        }
        const stateList = states
          ? states.split(',').map((s) => s.trim())
          : ['federal'];
        const regulations = await hazmatComplianceService.getHazmatRegulations(
          hazmatClass,
          stateList
        );
        return NextResponse.json(regulations);

      case 'classifications':
        const classifications =
          await hazmatComplianceService.getHazmatClassifications();
        return NextResponse.json(classifications);

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action specified',
            message: 'Valid actions: regulations, classifications',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Hazmat Route Compliance API Error:', error);
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
    if (!isFeatureEnabled('HAZMAT_ROUTE_COMPLIANCE')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Hazmat Route Compliance feature is not enabled',
          message:
            'Enable ENABLE_HAZMAT_ROUTE_COMPLIANCE=true to use this feature',
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, loadRequest } = body;

    switch (action) {
      case 'analyze':
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
          'hazmatClass',
          'unNumber',
          'properShippingName',
          'packingGroup',
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

        // Validate hazmat class
        const validClasses = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        if (!validClasses.includes(loadRequest.hazmatClass)) {
          return NextResponse.json(
            {
              success: false,
              error: 'Invalid hazmat class. Must be 1-9.',
            },
            { status: 400 }
          );
        }

        // Validate packing group if required
        if (['3', '4', '5', '6', '8'].includes(loadRequest.hazmatClass)) {
          if (
            !loadRequest.packingGroup ||
            !['I', 'II', 'III'].includes(loadRequest.packingGroup)
          ) {
            return NextResponse.json(
              {
                success: false,
                error:
                  'Valid packing group (I, II, or III) is required for this hazmat class',
              },
              { status: 400 }
            );
          }
        }

        const analysis =
          await hazmatComplianceService.analyzeHazmatRoute(loadRequest);
        return NextResponse.json(analysis);

      case 'validate':
        if (!loadRequest) {
          return NextResponse.json(
            {
              success: false,
              error: 'Load request data is required',
            },
            { status: 400 }
          );
        }
        const validation =
          await hazmatComplianceService.validateHazmatCompliance(loadRequest);
        return NextResponse.json(validation);

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action specified',
            message: 'Valid actions: analyze, validate',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Hazmat Route Compliance API Error:', error);
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
