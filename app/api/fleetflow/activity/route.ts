import { NextRequest, NextResponse } from 'next/server';

// Production activity feed data for FleetFlow dashboard
const activityFeed = [
  {
    id: 'act-001',
    time: '2 min ago',
    action: 'GO WITH THE FLOW: Auto-matched load FLT-2024-001 to Mike Johnson',
    status: 'success',
    type: 'load_match',
    details: 'Instant carrier matching completed in 45 seconds',
    loadId: 'FLT-2024-001',
    driverId: 'DRV-001',
    value: '$3,250',
  },
  {
    id: 'act-002',
    time: '5 min ago',
    action: 'MARKETPLACE BIDDING: 8 carriers bid on load FLT-2024-002',
    status: 'success',
    type: 'auction',
    details: 'Best bid: $1,850 (15% below market rate)',
    loadId: 'FLT-2024-002',
    bidsReceived: 8,
    savings: '$315',
  },
  {
    id: 'act-003',
    time: '8 min ago',
    action:
      'Healthcare/Pharma Blitz: Identified 12 qualified medical suppliers',
    status: 'success',
    type: 'campaign',
    details: 'Targeted hospitals and pharmacies in California region',
    campaign: 'Healthcare/Pharma Blitz',
    leadsGenerated: 12,
    aiStaff: 'Desiree',
  },
  {
    id: 'act-004',
    time: '12 min ago',
    action: 'Carrier Acquisition: Onboarded 3 new carriers (Tier 2)',
    status: 'success',
    type: 'carrier_onboarding',
    details: '9% fee structure - 80% of loads are medical/pharma',
    carriersOnboarded: 3,
    tier: 'Silver (9%)',
    aiStaff: 'Miles Rhodes',
  },
  {
    id: 'act-005',
    time: '15 min ago',
    action: 'GO WITH THE FLOW: Emergency load match completed in 2 minutes',
    status: 'success',
    type: 'emergency_match',
    details: 'Critical medical supplies routed to optimal carrier',
    loadId: 'FLT-2024-009',
    driverId: 'DRV-003',
    responseTime: '2 minutes',
  },
  {
    id: 'act-006',
    time: '18 min ago',
    action: 'FMCSA Compliance: Automated violation check completed',
    status: 'success',
    type: 'compliance',
    details: 'All carriers verified - 0 violations found',
    carriersChecked: 25,
    violationsFound: 0,
    aiStaff: 'Regina',
  },
  {
    id: 'act-007',
    time: '22 min ago',
    action: 'New Businesses Blitz: Generated 8 qualified startup leads',
    status: 'success',
    type: 'campaign',
    details: 'Targeted manufacturers under 5 years old',
    campaign: 'New Businesses Freight Blitz',
    leadsGenerated: 8,
    aiStaff: 'Gary',
  },
  {
    id: 'act-008',
    time: '25 min ago',
    action: 'MARKETPLACE BIDDING: Competitive auction saved $890',
    status: 'success',
    type: 'auction',
    details: '12 carriers participated - 22% below initial quote',
    loadId: 'FLT-2024-003',
    bidsReceived: 12,
    savings: '$890',
  },
  {
    id: 'act-009',
    time: '28 min ago',
    action: 'Dispatch Fee Collection: $1,250 processed (10% of load)',
    status: 'success',
    type: 'revenue',
    details: 'Automated collection from carrier ABC Transport',
    loadId: 'FLT-2024-001',
    feeAmount: '$1,250',
    feePercentage: '10%',
  },
  {
    id: 'act-010',
    time: '32 min ago',
    action: 'High-Value Prospect Acceleration: Executive meeting booked',
    status: 'success',
    type: 'campaign',
    details: 'Fortune 500 healthcare company - $2.5M potential',
    campaign: 'High-Value Prospect Acceleration',
    meetingBooked: true,
    potentialValue: '$2.5M',
    aiStaff: 'Will',
  },
  {
    id: 'act-011',
    time: '35 min ago',
    action: 'GO WITH THE FLOW: Real-time capacity update processed',
    status: 'success',
    type: 'system',
    details: 'Carrier availability updated across 50-mile radius',
    carriersUpdated: 15,
    radius: '50 miles',
  },
  {
    id: 'act-012',
    time: '38 min ago',
    action: 'Regional Market Penetration: Atlanta market expansion',
    status: 'success',
    type: 'campaign',
    details: 'Connected with 15 regional carriers for local coverage',
    campaign: 'Regional Market Penetration',
    carriersConnected: 15,
    region: 'Atlanta, GA',
    aiStaff: 'Miles Rhodes',
  },
  {
    id: 'act-013',
    time: '42 min ago',
    action: 'Emergency Alert: Load delay notification sent',
    status: 'warning',
    type: 'alert',
    details: 'Weather delay - alternative routing activated',
    loadId: 'FLT-2024-001',
    delayHours: 4,
    alternativeActivated: true,
  },
  {
    id: 'act-014',
    time: '45 min ago',
    action: 'E-commerce Seasonal Rush: Holiday capacity secured',
    status: 'success',
    type: 'campaign',
    details: 'Peak season coverage arranged for 20 online retailers',
    campaign: 'E-commerce Seasonal Rush Blitz',
    retailersSecured: 20,
    season: 'Holiday 2024',
  },
  {
    id: 'act-015',
    time: '48 min ago',
    action: 'Recovery Relationship Blitz: $75K account reactivated',
    status: 'success',
    type: 'campaign',
    details: 'Former client returned after service recovery',
    campaign: 'Recovery Relationship Blitz',
    accountValue: '$75K',
    reactivationTime: '30 days',
  },
];

export async function GET(request: NextRequest) {
  try {
    // Filter activities by type if requested
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');

    let filteredActivities = activityFeed;

    if (type) {
      filteredActivities = filteredActivities.filter(
        (activity) => activity.type === type
      );
    }

    if (status) {
      filteredActivities = filteredActivities.filter(
        (activity) => activity.status === status
      );
    }

    // Limit results and sort by time (newest first)
    filteredActivities = filteredActivities.slice(0, limit).sort((a, b) => {
      // Simple time sorting based on the 'time ago' format
      const getMinutes = (timeStr: string) => {
        const match = timeStr.match(/(\d+)\s+min/);
        return match ? parseInt(match[1]) : 999;
      };
      return getMinutes(a.time) - getMinutes(b.time);
    });

    return NextResponse.json({
      activities: filteredActivities,
      total: filteredActivities.length,
      lastUpdated: new Date().toISOString(),
      source: 'FleetFlow Automation Engine',
      types: {
        load_match: filteredActivities.filter((a) => a.type === 'load_match')
          .length,
        auction: filteredActivities.filter((a) => a.type === 'auction').length,
        campaign: filteredActivities.filter((a) => a.type === 'campaign')
          .length,
        carrier_onboarding: filteredActivities.filter(
          (a) => a.type === 'carrier_onboarding'
        ).length,
        revenue: filteredActivities.filter((a) => a.type === 'revenue').length,
        alert: filteredActivities.filter((a) => a.type === 'alert').length,
      },
    });
  } catch (error) {
    console.error('Error fetching activity feed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // In production, this would log a new activity to the database
    const newActivity = {
      id: `act-${Date.now()}`,
      ...body,
      time: 'Just now',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      activity: newActivity,
      message: 'Activity logged successfully',
    });
  } catch (error) {
    console.error('Error logging activity:', error);
    return NextResponse.json(
      { error: 'Failed to log activity' },
      { status: 500 }
    );
  }
}
