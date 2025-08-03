// API endpoint for permit ordering operations
import { NextRequest, NextResponse } from 'next/server';
import PermitOrderingService from '../../../services/permit-ordering-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    const permitService = PermitOrderingService.getInstance();

    switch (action) {
      case 'create_order': {
        const {
          loadId,
          tenantId,
          state,
          permitType,
          loadDetails,
          notifications,
        } = data;

        if (!loadId || !tenantId || !state || !permitType || !loadDetails) {
          return NextResponse.json(
            {
              success: false,
              error:
                'Missing required fields: loadId, tenantId, state, permitType, loadDetails',
            },
            { status: 400 }
          );
        }

        const order = await permitService.createPermitOrder(
          loadId,
          tenantId,
          state,
          permitType,
          loadDetails,
          notifications || { email: [], phone: [] }
        );

        return NextResponse.json({
          success: true,
          data: order,
          message: 'Permit order created successfully',
        });
      }

      case 'submit_order': {
        const { orderId, paymentMethod = 'card' } = data;

        if (!orderId) {
          return NextResponse.json(
            {
              success: false,
              error: 'Missing required field: orderId',
            },
            { status: 400 }
          );
        }

        const result = await permitService.submitPermitOrder(
          orderId,
          paymentMethod
        );
        return NextResponse.json(result);
      }

      case 'track_order': {
        const { orderId } = data;

        if (!orderId) {
          return NextResponse.json(
            {
              success: false,
              error: 'Missing required field: orderId',
            },
            { status: 400 }
          );
        }

        const trackingResult = await permitService.trackPermitOrder(orderId);
        return NextResponse.json({
          success: true,
          data: trackingResult,
        });
      }

      case 'cancel_order': {
        const { orderId, reason } = data;

        if (!orderId || !reason) {
          return NextResponse.json(
            {
              success: false,
              error: 'Missing required fields: orderId, reason',
            },
            { status: 400 }
          );
        }

        const cancelled = await permitService.cancelPermitOrder(
          orderId,
          reason
        );
        return NextResponse.json({
          success: cancelled,
          message: cancelled
            ? 'Order cancelled successfully'
            : 'Failed to cancel order',
        });
      }

      case 'get_supported_states': {
        const states = permitService.getSupportedStates();
        return NextResponse.json({
          success: true,
          data: states,
        });
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action',
          },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Permit ordering API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const orderId = searchParams.get('orderId');

    const permitService = PermitOrderingService.getInstance();

    if (orderId) {
      // Get specific permit order
      const order = permitService.getPermitOrder(orderId);
      if (!order) {
        return NextResponse.json(
          {
            success: false,
            error: 'Permit order not found',
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: order,
      });
    }

    if (tenantId) {
      // Get all orders for tenant
      const orders = permitService.getPermitOrdersByTenant(tenantId);
      return NextResponse.json({
        success: true,
        data: orders,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Missing required parameter: tenantId or orderId',
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Permit ordering GET API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
