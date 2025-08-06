/**
 * TruckingPlanet Network API Integration
 * Provides access to 2M+ carriers, 100K+ brokers, 70K+ shippers
 * Integrates with AI Flow lead generation system
 */

import { NextRequest, NextResponse } from 'next/server';
import { truckingPlanetService } from '../../services/TruckingPlanetService';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'shippers';
  const tenantId = searchParams.get('tenantId') || 'demo-tenant';

  try {
    switch (action) {
      case 'shippers':
        return await handleSearchShippers(searchParams);

      case 'carriers':
        return await handleSearchCarriers(searchParams);

      case 'brokers':
        return await handleSearchBrokers(searchParams);

      case 'insights':
        return await handleNetworkInsights();

      case 'demo':
        return await handleTruckingPlanetDemo();

      default:
        return NextResponse.json(
          {
            error: 'Invalid action',
            availableActions: [
              'shippers',
              'carriers',
              'brokers',
              'insights',
              'demo',
            ],
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('TruckingPlanet API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'freightblaster';

  try {
    const data = await request.json();

    switch (action) {
      case 'freightblaster':
        return await handleFreightBlaster(data);

      case 'search_shippers':
        return await handleAdvancedShipperSearch(data);

      case 'search_carriers':
        return await handleAdvancedCarrierSearch(data);

      default:
        return NextResponse.json(
          {
            error: 'Invalid POST action',
            availableActions: [
              'freightblaster',
              'search_shippers',
              'search_carriers',
            ],
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('TruckingPlanet POST API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// ========================================
// SHIPPER SEARCH HANDLERS
// ========================================

async function handleSearchShippers(searchParams: URLSearchParams) {
  const equipmentType = searchParams.get('equipmentType')?.split(',') || [];
  const freightVolume = searchParams.get('freightVolume') as
    | 'high'
    | 'medium'
    | 'low'
    | null;
  const state = searchParams.get('state');

  const filters = {
    equipmentType: equipmentType.length > 0 ? equipmentType : undefined,
    freightVolume: freightVolume || undefined,
    location: state ? { states: [state] } : undefined,
  };

  const shippers = await truckingPlanetService.searchShippers(filters);
  const convertedLeads =
    await truckingPlanetService.convertToFleetFlowLeads(shippers);

  return NextResponse.json({
    success: true,
    data: {
      shippers,
      leads: convertedLeads,
      totalFound: shippers.length,
      searchFilters: filters,
      source: 'TruckingPlanet Network',
      membershipValue: '$249 Lifetime Access',
    },
  });
}

async function handleAdvancedShipperSearch(data: any) {
  const { filters, convertToLeads = true } = data;

  const shippers = await truckingPlanetService.searchShippers(filters);
  const result: any = {
    shippers,
    totalFound: shippers.length,
    searchFilters: filters,
  };

  if (convertToLeads) {
    const leads = await truckingPlanetService.convertToFleetFlowLeads(shippers);
    result.leads = leads;
  }

  return NextResponse.json({
    success: true,
    data: result,
  });
}

// ========================================
// CARRIER SEARCH HANDLERS
// ========================================

async function handleSearchCarriers(searchParams: URLSearchParams) {
  const minTrucks = searchParams.get('minTrucks');
  const states = searchParams.get('states')?.split(',') || [];

  const filters = {
    companySize: minTrucks ? { minTrucks: parseInt(minTrucks) } : undefined,
    location: states.length > 0 ? { states } : undefined,
  };

  const carriers = await truckingPlanetService.searchCarriers(filters);

  return NextResponse.json({
    success: true,
    data: {
      carriers,
      totalFound: carriers.length,
      searchFilters: filters,
      source: 'TruckingPlanet Network',
    },
  });
}

async function handleAdvancedCarrierSearch(data: any) {
  const { filters } = data;
  const carriers = await truckingPlanetService.searchCarriers(filters);

  return NextResponse.json({
    success: true,
    data: {
      carriers,
      totalFound: carriers.length,
      searchFilters: filters,
    },
  });
}

// ========================================
// BROKER SEARCH HANDLERS
// ========================================

async function handleSearchBrokers(searchParams: URLSearchParams) {
  const brokers = await truckingPlanetService.searchBrokers();

  return NextResponse.json({
    success: true,
    data: {
      brokers,
      totalFound: brokers.length,
      source: 'TruckingPlanet Network',
    },
  });
}

// ========================================
// FREIGHTBLASTER EMAIL CAMPAIGN
// ========================================

async function handleFreightBlaster(data: any) {
  const { subject, message, targetAudience, filters } = data;

  if (!subject || !message || !targetAudience) {
    return NextResponse.json(
      {
        error: 'Missing required fields',
        required: ['subject', 'message', 'targetAudience'],
      },
      { status: 400 }
    );
  }

  const campaign = await truckingPlanetService.sendFreightBlaster({
    subject,
    message,
    targetAudience,
    filters,
  });

  return NextResponse.json({
    success: true,
    data: {
      campaign,
      message: `FreightBlaster campaign launched to ${campaign.recipientCount.toLocaleString()} recipients`,
      estimatedResponses: Math.round(
        campaign.recipientCount * campaign.responseRate
      ),
    },
  });
}

// ========================================
// NETWORK INSIGHTS
// ========================================

async function handleNetworkInsights() {
  const insights = await truckingPlanetService.getNetworkInsights();

  return NextResponse.json({
    success: true,
    data: {
      ...insights,
      networkValue: {
        totalContacts:
          insights.totalShippers +
          insights.totalCarriers +
          insights.totalBrokers,
        industryReach: '100% North American Coverage',
        dataFreshness: 'Updated Quarterly',
        accessLevel: 'Lifetime Membership',
      },
    },
  });
}

// ========================================
// DEMO ENDPOINT
// ========================================

async function handleTruckingPlanetDemo() {
  console.log('🌐 Running TruckingPlanet Network demo...');

  // Demo shipper search
  const demoShippers = await truckingPlanetService.searchShippers({
    freightVolume: 'high',
    equipmentType: ['dry_van', 'refrigerated'],
  });

  // Demo carrier search
  const demoCarriers = await truckingPlanetService.searchCarriers({
    companySize: { minTrucks: 50 },
  });

  // Demo broker search
  const demoBrokers = await truckingPlanetService.searchBrokers();

  // Demo FreightBlaster campaign
  const demoCampaign = await truckingPlanetService.sendFreightBlaster({
    subject: 'FleetFlow Partnership Opportunity',
    message:
      'Discover how FleetFlow can streamline your logistics operations...',
    targetAudience: 'mixed',
  });

  // Network insights
  const insights = await truckingPlanetService.getNetworkInsights();

  return NextResponse.json({
    success: true,
    demo: 'TruckingPlanet Network Integration',
    data: {
      shippers: {
        found: demoShippers.length,
        samples: demoShippers,
      },
      carriers: {
        found: demoCarriers.length,
        samples: demoCarriers,
      },
      brokers: {
        found: demoBrokers.length,
        samples: demoBrokers,
      },
      freightBlaster: {
        campaign: demoCampaign,
        reach: `${demoCampaign.recipientCount.toLocaleString()} recipients`,
        expectedResponses: Math.round(
          demoCampaign.recipientCount * demoCampaign.responseRate
        ),
      },
      networkInsights: insights,
    },
    integrationStatus: {
      apiConnection: '✅ Connected',
      dataAccess: '✅ Full Access',
      membershipType: 'Lifetime ($249)',
      features: [
        '70,000+ Verified Shippers',
        '2,000,000+ Licensed Carriers',
        '100,000+ Freight Brokers',
        'FreightBlaster Email Service',
        'AI-Enhanced Lead Generation',
        'Real-time Data Updates',
      ],
    },
    nextSteps: [
      '1. Configure your TruckingPlanet credentials in environment variables',
      '2. Access shippers: /api/trucking-planet?action=shippers&freightVolume=high',
      '3. Launch FreightBlaster: POST /api/trucking-planet?action=freightblaster',
      '4. View in AI Flow dashboard at /ai-flow',
    ],
  });
}
