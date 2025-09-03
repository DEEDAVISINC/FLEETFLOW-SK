import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Return empty KPI data - no mock data
    return NextResponse.json({
      activeLoads: 0,
      fleetUtilization: 0,
      mtdRevenue: 0,
      onTimePerformance: 0,
      fleetUtilizationChange: 0,
      revenueChange: 0,
      onTimeChange: 0,
      totalLoadsThisMonth: 0,
      averageLoadValue: 0,
      carrierOnTimeRate: 0,
      customerSatisfaction: 0,
      fuelEfficiency: 0,
      maintenanceCostPerMile: 0,
      lastUpdated: new Date().toISOString(),
      period: 'current_month',
      currency: 'USD',
      source: 'FleetFlow TMS Analytics',
      confidence: 'no_data', // No data available
      message: 'No operational data available',
    });
  } catch (error) {
    console.error('Error fetching KPIs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch KPI data' },
      { status: 500 }
    );
  }
}
