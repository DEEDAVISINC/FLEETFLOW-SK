import { uspsFreightService } from '@/app/services/usps-freight-service';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Handler for getting freight rates
 */
export async function POST(request: NextRequest) {
  try {
    // Initialize the service
    uspsFreightService.initialize();

    // Parse request body
    const requestData = await request.json();

    // Validate required fields
    if (
      !requestData.originZip ||
      !requestData.destinationZip ||
      !requestData.weight
    ) {
      return NextResponse.json(
        { error: 'Missing required fields: originZip, destinationZip, weight' },
        { status: 400 }
      );
    }

    // Get rates from the USPS Freight API
    const rates = await uspsFreightService.getFreightRates(requestData);

    return NextResponse.json(rates);
  } catch (error: any) {
    console.error('Error in USPS Freight rate API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get USPS Freight rates' },
      { status: 500 }
    );
  }
}

/**
 * Handler for tracking freight shipments
 */
export async function GET(request: NextRequest) {
  try {
    // Initialize the service
    uspsFreightService.initialize();

    // Get tracking number from URL params
    const { searchParams } = new URL(request.url);
    const trackingNumber = searchParams.get('trackingNumber');

    // Validate tracking number
    if (!trackingNumber) {
      return NextResponse.json(
        { error: 'Missing required parameter: trackingNumber' },
        { status: 400 }
      );
    }

    // Get tracking info from the USPS Freight API
    const trackingInfo = await uspsFreightService.trackFreightShipment({
      trackingNumber,
    });

    return NextResponse.json(trackingInfo);
  } catch (error: any) {
    console.error('Error in USPS Freight tracking API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to track USPS Freight shipment' },
      { status: 500 }
    );
  }
}
