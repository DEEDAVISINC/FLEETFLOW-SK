import { NextRequest, NextResponse } from 'next/server';
import FMCSAReverseLeadService from '../../services/fmcsa-reverse-lead-service';

export async function POST(request: NextRequest) {
  try {
    const filters = await request.json();
    
    const reverseLeadService = new FMCSAReverseLeadService();
    const results = await reverseLeadService.generateShipperLeads(filters);

    return NextResponse.json({
      success: true,
      data: results,
      message: `Generated ${results.leads.length} FMCSA shipper leads`,
      performance: {
        totalScanned: results.stats.totalScanned,
        qualifiedRate: Math.round((results.stats.qualifiedLeads / results.stats.totalScanned) * 100),
        averageScore: Math.round(results.stats.averageScore),
        topOperationType: getTopOperationType(results.stats.breakdownByType)
      }
    });
  } catch (error) {
    console.error('FMCSA reverse leads API error:', error);
    return NextResponse.json(
      { 
        error: 'FMCSA reverse lead generation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const reverseLeadService = new FMCSAReverseLeadService();
    const status = await reverseLeadService.getServiceStatus();

    return NextResponse.json({
      service: 'FMCSA Reverse Shipper Lead Generation API',
      version: '1.0.0',
      status,
      usage: {
        endpoint: '/api/fmcsa-reverse-leads',
        method: 'POST',
        examples: [
          {
            description: 'Large manufacturing companies in Texas',
            payload: {
              states: ['texas'],
              minPowerUnits: 50,
              operationTypes: ['Manufacturing'],
              minLeadScore: 80
            }
          },
          {
            description: 'Private fleet companies nationwide',
            payload: {
              operationTypes: ['Private Fleet'],
              businessSizes: ['Large', 'Medium'],
              safetyRatingRequired: true
            }
          },
          {
            description: 'Mixed operations with high lead scores',
            payload: {
              operationTypes: ['Mixed Operations'],
              minLeadScore: 90,
              minPowerUnits: 25
            }
          }
        ]
      },
      capabilities: {
        dataSource: 'FMCSA Government Database (2.5M+ carriers)',
        leadTypes: [
          'Private Fleet Companies (Walmart, Target, etc.)',
          'Manufacturing with Transportation',
          'Mixed Operations (Both Carrier & Shipper)',
          'Regional Carriers with Shipper Potential'
        ],
        features: [
          'AI-powered shipper potential scoring',
          'Safety profile analysis',
          'Business size classification',
          'Industry type inference',
          'Revenue opportunity estimation',
          'Geographic filtering',
          'Compliance level assessment'
        ]
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Service status unavailable' },
      { status: 500 }
    );
  }
}

// Helper function to determine top operation type
function getTopOperationType(breakdown: any): string {
  return Object.entries(breakdown)
    .sort(([,a], [,b]) => (b as number) - (a as number))[0][0];
}
