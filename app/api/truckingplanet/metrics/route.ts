import { NextResponse } from 'next/server';
import { truckingPlanetService } from '../../../services/TruckingPlanetService';

export async function GET() {
  try {
    const metrics = truckingPlanetService.getMetrics();
    const activity = truckingPlanetService.getCurrentActivity();

    return NextResponse.json({
      success: true,
      data: {
        metrics,
        activity,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('TruckingPlanet API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch TruckingPlanet metrics' },
      { status: 500 }
    );
  }
}



