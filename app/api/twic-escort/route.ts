import TWICEscortService from '@/app/services/TWICEscortService';
import { NextRequest, NextResponse } from 'next/server';

/**
 * TWIC Escort Service API Route
 *
 * Handles TWIC escort requests, assignments, and management
 * for drivers without TWIC cards at secure port facilities
 */

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json();

    switch (action) {
      case 'request_escort':
        const {
          tenantId,
          driverName,
          driverLicense,
          phoneNumber,
          portCode,
          terminalId,
          appointmentTime,
          containerNumber,
          chassisNumber,
          operationType,
          estimatedDuration,
          specialInstructions,
        } = data;

        // Validate required fields
        if (
          !tenantId ||
          !driverName ||
          !driverLicense ||
          !phoneNumber ||
          !portCode ||
          !terminalId ||
          !appointmentTime ||
          !operationType ||
          !estimatedDuration
        ) {
          return NextResponse.json(
            {
              success: false,
              error: 'Missing required fields for escort request',
            },
            { status: 400 }
          );
        }

        const escortResult = await TWICEscortService.requestEscort({
          tenantId,
          driverName,
          driverLicense,
          phoneNumber,
          portCode,
          terminalId,
          appointmentTime,
          containerNumber,
          chassisNumber,
          operationType,
          estimatedDuration,
          specialInstructions,
        });

        return NextResponse.json({
          success: escortResult.success,
          data: escortResult.success
            ? {
                requestId: escortResult.requestId,
                availableEscorts: escortResult.availableEscorts,
                estimatedCost: escortResult.estimatedCost,
              }
            : null,
          error: escortResult.error,
          timestamp: new Date().toISOString(),
        });

      case 'assign_escort':
        const { requestId, escortId } = data;

        if (!requestId || !escortId) {
          return NextResponse.json(
            { success: false, error: 'Missing requestId or escortId' },
            { status: 400 }
          );
        }

        const assignmentResult = await TWICEscortService.assignEscort(
          requestId,
          escortId
        );

        return NextResponse.json({
          success: assignmentResult.success,
          data: assignmentResult.assignment,
          error: assignmentResult.error,
          timestamp: new Date().toISOString(),
        });

      case 'complete_request':
        const { requestId: completeRequestId, rating } = data;

        if (!completeRequestId) {
          return NextResponse.json(
            { success: false, error: 'Missing requestId' },
            { status: 400 }
          );
        }

        const completionResult = await TWICEscortService.completeEscortRequest(
          completeRequestId,
          rating
        );

        return NextResponse.json({
          success: completionResult.success,
          data: completionResult.summary,
          error: completionResult.error,
          timestamp: new Date().toISOString(),
        });

      case 'update_escort_status':
        const { escortId: updateEscortId, status } = data;

        if (!updateEscortId || !status) {
          return NextResponse.json(
            { success: false, error: 'Missing escortId or status' },
            { status: 400 }
          );
        }

        const updateResult = await TWICEscortService.updateEscortStatus(
          updateEscortId,
          status
        );

        return NextResponse.json({
          success: updateResult,
          timestamp: new Date().toISOString(),
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('TWIC Escort API Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    switch (type) {
      case 'request_status':
        const requestId = searchParams.get('requestId');

        if (!requestId) {
          return NextResponse.json(
            { success: false, error: 'Missing requestId parameter' },
            { status: 400 }
          );
        }

        const statusResult =
          await TWICEscortService.getRequestStatus(requestId);

        return NextResponse.json({
          success: statusResult.success,
          data: statusResult.success
            ? {
                request: statusResult.request,
                escort: statusResult.escort,
              }
            : null,
          error: statusResult.error,
          timestamp: new Date().toISOString(),
        });

      case 'port_escorts':
        const portCode = searchParams.get('portCode');

        if (!portCode) {
          return NextResponse.json(
            { success: false, error: 'Missing portCode parameter' },
            { status: 400 }
          );
        }

        const escorts = await TWICEscortService.getPortEscorts(portCode);

        return NextResponse.json({
          success: true,
          data: escorts,
          timestamp: new Date().toISOString(),
        });

      case 'port_pricing':
        const pricingPortCode = searchParams.get('portCode');

        if (!pricingPortCode) {
          return NextResponse.json(
            { success: false, error: 'Missing portCode parameter' },
            { status: 400 }
          );
        }

        const pricing = TWICEscortService.getPortPricing(pricingPortCode);

        return NextResponse.json({
          success: !!pricing,
          data: pricing,
          timestamp: new Date().toISOString(),
        });

      case 'analytics':
        const analyticsPortCode = searchParams.get('portCode');

        const analytics = await TWICEscortService.getEscortAnalytics(
          analyticsPortCode || undefined
        );

        return NextResponse.json({
          success: true,
          data: analytics,
          timestamp: new Date().toISOString(),
        });

      case 'available_escorts':
        const availPortCode = searchParams.get('portCode');
        const appointmentTime = searchParams.get('appointmentTime');
        const duration = searchParams.get('duration');

        if (!availPortCode || !appointmentTime || !duration) {
          return NextResponse.json(
            {
              success: false,
              error: 'Missing required parameters for availability check',
            },
            { status: 400 }
          );
        }

        const availability = await TWICEscortService.findAvailableEscorts(
          availPortCode,
          appointmentTime,
          parseInt(duration)
        );

        return NextResponse.json({
          success: true,
          data: availability,
          timestamp: new Date().toISOString(),
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid type parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('TWIC Escort GET API Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch escort data',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
