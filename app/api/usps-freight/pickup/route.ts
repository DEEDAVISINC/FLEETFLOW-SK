import { uspsFreightService } from '@/app/services/usps-freight-service';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Handler for scheduling freight pickups
 */
export async function POST(request: NextRequest) {
  try {
    // Initialize the service
    uspsFreightService.initialize();

    // Parse request body
    const requestData = await request.json();

    // Validate required fields
    if (
      !requestData.pickupDate ||
      !requestData.pickupTimeWindow ||
      !requestData.contactName ||
      !requestData.contactPhone ||
      !requestData.address ||
      !requestData.packageCount ||
      !requestData.totalWeight
    ) {
      return NextResponse.json(
        { error: 'Missing required pickup request fields' },
        { status: 400 }
      );
    }

    // Validate address fields
    if (
      !requestData.address.street1 ||
      !requestData.address.city ||
      !requestData.address.state ||
      !requestData.address.zip
    ) {
      return NextResponse.json(
        { error: 'Missing required address fields' },
        { status: 400 }
      );
    }

    // Schedule pickup with the USPS Freight API
    const pickupResponse =
      await uspsFreightService.scheduleFreightPickup(requestData);

    return NextResponse.json(pickupResponse);
  } catch (error: any) {
    console.error('Error in USPS Freight pickup API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to schedule USPS Freight pickup' },
      { status: 500 }
    );
  }
}
