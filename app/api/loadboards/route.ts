// Unified Load Board API Routes
// Handles load board data aggregation and metrics

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Handle different endpoints
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const endpoint = pathSegments[pathSegments.length - 1];

    // Handle /api/loadboards/metrics endpoint
    if (endpoint === 'metrics' || action === 'metrics') {
      return NextResponse.json({
        success: true,
        data: getMockLoadBoardMetrics(),
      });
    }

    // Handle other load board requests
    switch (action) {
      case 'loads':
        const includePartnership = searchParams.get('partnership') === 'true';
        return NextResponse.json({
          success: true,
          data: getMockLoads(includePartnership),
        });

      case 'search':
        const origin = searchParams.get('origin');
        const destination = searchParams.get('destination');
        const equipment = searchParams.get('equipment');

        return NextResponse.json({
          success: true,
          data: getMockSearchResults({ origin, destination, equipment }),
        });

      default:
        // Default to returning load board metrics
        return NextResponse.json({
          success: true,
          data: getMockLoadBoardMetrics(),
        });
    }
  } catch (error) {
    console.error('Load Board API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'track_usage':
        // Track load board usage for analytics
        console.log('Load board usage tracked:', body);
        return NextResponse.json({
          success: true,
          message: 'Usage tracked successfully',
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Load Board API POST Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// Mock data generation functions
function getMockLoadBoardMetrics() {
  return {
    totalLoads: 1247,
    activeLoads: 423,
    averageRate: 2850,
    topLanes: [
      { from: 'Atlanta, GA', to: 'Miami, FL', count: 89 },
      { from: 'Chicago, IL', to: 'Denver, CO', count: 67 },
      { from: 'Dallas, TX', to: 'Phoenix, AZ', count: 54 },
    ],
    equipment: {
      'Dry Van': 580,
      Reefer: 320,
      Flatbed: 280,
      'Power Only': 67,
    },
    sourceBreakdown: {
      DAT_FREE: 350,
      TRUCKSTOP_PUBLIC: 280,
      '123LOADBOARD': 210,
      GOVERNMENT: 145,
      TQL_PARTNER: 150,
      LANDSTAR_PARTNER: 112,
    },
    performanceMetrics: {
      responseTime: '1.2s',
      uptime: '99.8%',
      successRate: '98.5%',
    },
    partnershipStatus: {
      active: 3,
      pending: 2,
      potentialRevenue: 125000,
    },
  };
}

function getMockLoads(includePartnership = false) {
  const baseLoads = [
    {
      id: 'LOAD-001',
      source: 'DAT_FREE',
      sourceStatus: 'free',
      origin: { city: 'Atlanta', state: 'GA', zipCode: '30309' },
      destination: { city: 'Miami', state: 'FL', zipCode: '33101' },
      pickupDate: '2024-01-20',
      deliveryDate: '2024-01-21',
      rate: 2850,
      weight: 42000,
      equipment: 'van',
      distance: 662,
      miles: 662,
      commodity: 'Electronics',
      hazmat: false,
      postedDate: '2024-01-19',
      brokerInfo: {
        name: 'Atlantic Freight Solutions',
        email: 'dispatch@atlanticfreight.com',
        phone: '(404) 555-0123',
      },
    },
    {
      id: 'LOAD-002',
      source: 'TRUCKSTOP_PUBLIC',
      sourceStatus: 'public',
      origin: { city: 'Chicago', state: 'IL', zipCode: '60601' },
      destination: { city: 'Denver', state: 'CO', zipCode: '80202' },
      pickupDate: '2024-01-21',
      deliveryDate: '2024-01-23',
      rate: 3200,
      weight: 38000,
      equipment: 'reefer',
      distance: 920,
      miles: 920,
      commodity: 'Frozen Foods',
      hazmat: false,
      postedDate: '2024-01-19',
      brokerInfo: {
        name: 'Midwest Cold Chain',
        email: 'loads@midwestcold.com',
        phone: '(312) 555-0456',
      },
    },
  ];

  const partnershipLoads = [
    {
      id: 'LOAD-P001',
      source: 'TQL_PARTNER',
      sourceStatus: 'partnership',
      origin: { city: 'Dallas', state: 'TX', zipCode: '75201' },
      destination: { city: 'Phoenix', state: 'AZ', zipCode: '85001' },
      pickupDate: '2024-01-22',
      deliveryDate: '2024-01-24',
      rate: 3850,
      weight: 45000,
      equipment: 'flatbed',
      distance: 887,
      miles: 887,
      commodity: 'Construction Materials',
      hazmat: false,
      postedDate: '2024-01-19',
      brokerInfo: {
        name: 'TQL Logistics',
        email: 'partner@tql.com',
        phone: '(214) 555-0789',
      },
    },
  ];

  return includePartnership ? [...baseLoads, ...partnershipLoads] : baseLoads;
}

function getMockSearchResults(filters: any) {
  // Return filtered mock loads based on search criteria
  const allLoads = getMockLoads(true);

  return allLoads.filter((load) => {
    if (
      filters.origin &&
      !load.origin.city.toLowerCase().includes(filters.origin.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.destination &&
      !load.destination.city
        .toLowerCase()
        .includes(filters.destination.toLowerCase())
    ) {
      return false;
    }
    if (filters.equipment && load.equipment !== filters.equipment) {
      return false;
    }
    return true;
  });
}
