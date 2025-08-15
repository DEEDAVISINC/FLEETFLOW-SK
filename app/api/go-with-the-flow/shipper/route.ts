// 🚛⚡ GO WITH THE FLOW - SHIPPER API ROUTES
// Shipper-specific endpoints for requesting trucks

import { NextRequest, NextResponse } from 'next/server';
import { goWithTheFlowService } from '../../../services/GoWithTheFlowService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, loadRequest } = body;

    switch (action) {
      case 'request-truck':
        // Validate required fields
        const requiredFields = [
          'origin',
          'destination',
          'equipmentType',
          'weight',
          'urgency',
          'pickupDate',
          'deliveryDate',
          'shipperId',
        ];

        for (const field of requiredFields) {
          if (!loadRequest || !loadRequest[field]) {
            return NextResponse.json(
              { error: `${field} is required` },
              { status: 400 }
            );
          }
        }

        const newLoad = goWithTheFlowService.requestTruck(loadRequest);

        return NextResponse.json({
          success: true,
          load: newLoad,
          message: `Truck request ${newLoad.id} submitted successfully. We're matching you with available drivers.`,
          estimatedMatchTime: '2-5 minutes',
          dynamicPrice: newLoad.rate,
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Go With the Flow Shipper API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const shipperId = searchParams.get('shipperId');

  try {
    switch (action) {
      case 'pricing-estimate':
        const origin = searchParams.get('origin');
        const destination = searchParams.get('destination');
        const urgency = searchParams.get('urgency') as
          | 'low'
          | 'medium'
          | 'high';

        if (!origin || !destination) {
          return NextResponse.json(
            { error: 'Origin and destination are required' },
            { status: 400 }
          );
        }

        // Mock distance calculation for pricing
        const mockDistance = Math.floor(Math.random() * 500) + 50; // 50-550 miles
        const basePrice = mockDistance * 2.5; // $2.50 per mile base
        const dynamicPrice = goWithTheFlowService.calculateDynamicPrice(
          basePrice,
          mockDistance,
          urgency || 'medium'
        );

        return NextResponse.json({
          success: true,
          estimate: {
            basePrice,
            dynamicPrice,
            distance: mockDistance,
            urgency: urgency || 'medium',
            estimatedPickupTime: '2-4 hours',
            estimatedDeliveryTime: '6-12 hours',
          },
        });

      case 'available-trucks':
        const availableDrivers = goWithTheFlowService.getAvailableDrivers();
        return NextResponse.json({
          success: true,
          availableTrucks: availableDrivers.length,
          estimatedResponseTime: '3-7 minutes',
          drivers: availableDrivers.map((driver) => ({
            id: driver.id,
            location: driver.location,
            equipmentType: driver.equipmentType,
            hoursRemaining: driver.hoursRemaining,
          })),
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Go With the Flow Shipper API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



























































