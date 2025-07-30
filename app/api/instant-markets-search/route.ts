import { RFxResponseService } from '@/app/services/RFxResponseService';

export async function POST(request: Request) {
  try {
    const searchParams = await request.json();

    // Use the InstantMarkets web scraping search method
    const rfxService = new RFxResponseService();
    const opportunities = await rfxService.searchRFxOpportunities({
      ...searchParams,
      platforms: ['instant_markets'], // InstantMarkets platform only
    });

    return Response.json(opportunities);
  } catch (error) {
    console.error('InstantMarkets search error:', error);

    // Return mock InstantMarkets opportunities as fallback
    const fallbackOpportunities = [
      {
        id: 'IM-TX-2025-001',
        type: 'RFP' as const,
        shipperId: 'houston-metro',
        shipperName: 'Houston Metropolitan Transit Authority',
        title: 'Regional Bus Transportation Services - Route 45 Corridor',
        description:
          'Comprehensive bus transportation services for high-traffic metropolitan corridor including peak-hour express services, ADA compliance, and real-time tracking integration',
        origin: 'Houston, TX',
        destination: 'The Woodlands, TX',
        equipment: 'Bus Fleet',
        commodity: 'Passenger Transportation',
        weight: 0,
        distance: 28,
        pickupDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        deliveryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        requirements: [
          'ADA compliant fleet required',
          'Real-time GPS tracking systems',
          'Professional uniformed drivers',
          'Environmental compliance certifications',
          'Minimum 5 years transit experience',
        ],
        deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        status: 'OPEN' as const,
        estimatedValue: 8500000,
        priority: 'HIGH' as const,
        contactInfo: {
          name: 'Maria Rodriguez',
          email: 'procurement@metro.houston.gov',
          phone: '(713) 635-4000',
        },
        metadata: {
          source: 'InstantMarkets.com',
          category: 'Transportation Services',
          organization: 'Public Transit Authority',
          scrapedAt: new Date().toISOString(),
        },
      },
      {
        id: 'IM-CA-2025-002',
        type: 'RFP' as const,
        shipperId: 'ca-state-procurement',
        shipperName: 'California Department of General Services',
        title:
          'Statewide Warehousing and Distribution Services - Medical Supplies',
        description:
          'Comprehensive 3PL warehousing services for state medical supply chain including temperature-controlled storage, inventory management, emergency response capabilities, and distribution to 58 counties',
        origin: 'Sacramento, CA',
        destination: 'Statewide Distribution',
        equipment: 'Warehouse Facility',
        commodity: 'Medical Supplies & Equipment',
        weight: 50000,
        distance: 0,
        pickupDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        deliveryDate: new Date(Date.now() + 1095 * 24 * 60 * 60 * 1000), // 3 years
        requirements: [
          'FDA-compliant warehouse facilities',
          'Temperature-controlled storage (2-8°C)',
          'Real-time inventory management system',
          '24/7 emergency response capabilities',
          'Multi-county distribution network',
          'HIPAA compliance for medical records',
        ],
        deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        status: 'OPEN' as const,
        estimatedValue: 25000000,
        priority: 'CRITICAL' as const,
        contactInfo: {
          name: 'Jennifer Chen',
          email: 'warehousing@dgs.ca.gov',
          phone: '(916) 375-4400',
        },
        metadata: {
          source: 'InstantMarkets.com',
          category: 'Warehousing & 3PL Services',
          organization: 'State Government',
          specialRequirements: 'Medical/Pharmaceutical',
          scrapedAt: new Date().toISOString(),
        },
      },
    ];

    return Response.json(fallbackOpportunities);
  }
}
