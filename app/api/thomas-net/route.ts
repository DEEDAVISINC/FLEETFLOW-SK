import { NextRequest, NextResponse } from 'next/server';
import ThomasNetService, {
  ThomasNetSearchFilters,
} from '../../../lib/thomas-net-service';

export async function POST(request: NextRequest) {
  try {
    const { action, ...params } = await request.json();

    // Get credentials from environment variables
    const credentials = {
      username: process.env.THOMAS_NET_USERNAME || '',
      password: process.env.THOMAS_NET_PASSWORD || '',
    };

    if (!credentials.username || !credentials.password) {
      return NextResponse.json(
        {
          error: 'ThomasNet credentials not configured',
          message:
            'Please add THOMAS_NET_USERNAME and THOMAS_NET_PASSWORD to your environment variables',
        },
        { status: 500 }
      );
    }

    const thomasNetService = new ThomasNetService(credentials);
    await thomasNetService.initialize();

    let result;

    switch (action) {
      case 'search_manufacturers':
        const manufacturerFilters: ThomasNetSearchFilters = {
          industry: params.industry,
          location: params.location,
          state: params.state,
          productKeywords: params.productKeywords || [],
          serviceKeywords: params.serviceKeywords || [],
        };
        result =
          await thomasNetService.searchManufacturers(manufacturerFilters);
        break;

      case 'search_wholesalers':
        const wholesalerFilters: ThomasNetSearchFilters = {
          location: params.location,
          state: params.state,
          productKeywords: params.productKeywords || [],
        };
        result = await thomasNetService.searchWholesalers(wholesalerFilters);
        break;

      case 'bulk_manufacturer_search':
        result = await thomasNetService.bulkManufacturerSearch(
          params.searchTerms || [],
          params.location
        );
        break;

      case 'get_company_details':
        result = await thomasNetService.getCompanyDetails(params.companyUrl);
        break;

      case 'search_by_industry':
        // Predefined industry searches for common freight-heavy sectors
        const industryTerms = getIndustrySearchTerms(params.industry);
        result = await thomasNetService.bulkManufacturerSearch(
          industryTerms,
          params.location
        );
        break;

      case 'freight_focused_search':
        // Search specifically for high freight volume companies
        const freightTerms = [
          'heavy machinery',
          'construction equipment',
          'automotive parts',
          'steel fabrication',
          'chemical manufacturing',
          'food processing',
          'industrial equipment',
          'building materials',
          'agricultural equipment',
        ];
        result = await thomasNetService.bulkManufacturerSearch(
          freightTerms,
          params.location
        );
        break;

      default:
        await thomasNetService.close();
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }

    await thomasNetService.close();

    return NextResponse.json({
      success: true,
      action,
      data: result,
      timestamp: new Date().toISOString(),
      count: Array.isArray(result) ? result.length : 1,
    });
  } catch (error) {
    console.error('ThomasNet API Error:', error);
    return NextResponse.json(
      {
        error: 'ThomasNet service error',
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Get available endpoints and usage information
  return NextResponse.json({
    service: 'ThomasNet Lead Generation API',
    version: '1.0.0',
    endpoints: {
      search_manufacturers: {
        description: 'Search for manufacturing companies',
        parameters: [
          'industry',
          'location',
          'state',
          'productKeywords',
          'serviceKeywords',
        ],
        example: {
          action: 'search_manufacturers',
          industry: 'Automotive',
          location: 'Detroit, MI',
          productKeywords: ['automotive parts', 'manufacturing'],
        },
      },
      search_wholesalers: {
        description: 'Search for wholesale/distribution companies',
        parameters: ['location', 'state', 'productKeywords'],
        example: {
          action: 'search_wholesalers',
          location: 'Chicago, IL',
          productKeywords: ['food distribution', 'wholesale'],
        },
      },
      bulk_manufacturer_search: {
        description: 'Search multiple terms for comprehensive results',
        parameters: ['searchTerms', 'location'],
        example: {
          action: 'bulk_manufacturer_search',
          searchTerms: [
            'steel fabrication',
            'metal working',
            'industrial machinery',
          ],
          location: 'Texas',
        },
      },
      freight_focused_search: {
        description: 'Search for high freight volume companies',
        parameters: ['location'],
        example: {
          action: 'freight_focused_search',
          location: 'California',
        },
      },
      search_by_industry: {
        description: 'Search by predefined industry categories',
        parameters: ['industry', 'location'],
        industries: [
          'automotive',
          'construction',
          'food',
          'chemical',
          'steel',
          'machinery',
        ],
        example: {
          action: 'search_by_industry',
          industry: 'automotive',
          location: 'Michigan',
        },
      },
      get_company_details: {
        description: 'Get detailed information about a specific company',
        parameters: ['companyUrl'],
        example: {
          action: 'get_company_details',
          companyUrl:
            'https://www.thomasnet.com/profile/12345678-acme-manufacturing',
        },
      },
    },
    integration: {
      ai_flow: 'Automatically integrates with AI Flow lead scoring system',
      fmcsa_cross_reference:
        'Cross-references with FMCSA data for enhanced lead quality',
      crm_integration: 'Syncs with FleetFlow CRM and phone dialer system',
    },
    usage: {
      credentials_required:
        'Set THOMAS_NET_USERNAME and THOMAS_NET_PASSWORD in environment variables',
      rate_limiting: '3 second delay between searches to avoid blocking',
      result_limit: '15-20 companies per search for optimal performance',
    },
  });
}

// Helper function to get industry-specific search terms
function getIndustrySearchTerms(industry: string): string[] {
  const industryMap: { [key: string]: string[] } = {
    automotive: [
      'automotive manufacturing',
      'auto parts',
      'automotive suppliers',
      'car parts',
      'vehicle components',
      'automotive assembly',
    ],
    construction: [
      'construction materials',
      'building supplies',
      'concrete products',
      'construction equipment',
      'roofing materials',
      'structural steel',
    ],
    food: [
      'food processing',
      'food manufacturing',
      'beverage production',
      'agricultural processing',
      'food packaging',
      'dairy processing',
    ],
    chemical: [
      'chemical manufacturing',
      'industrial chemicals',
      'petrochemicals',
      'specialty chemicals',
      'chemical processing',
      'chemical distribution',
    ],
    steel: [
      'steel manufacturing',
      'metal fabrication',
      'steel products',
      'structural steel',
      'steel processing',
      'metal working',
    ],
    machinery: [
      'industrial machinery',
      'manufacturing equipment',
      'heavy machinery',
      'machine tools',
      'industrial equipment',
      'machinery manufacturing',
    ],
  };

  return industryMap[industry.toLowerCase()] || [industry];
}
