import { NextRequest, NextResponse } from 'next/server';
import UnifiedLeadGenerationService from '../../services/unified-lead-generation';

export async function POST(request: NextRequest) {
  try {
    const filters = await request.json();

    const leadService = new UnifiedLeadGenerationService();
    const results = await leadService.generateLeads(filters);

    return NextResponse.json({
      success: true,
      data: results,
      message: `Generated ${results.leads.length} leads from multiple sources`,
      performance: {
        totalSources: Object.keys(results.stats.sourceBreakdown).length,
        averageScore: Math.round(results.stats.averageScore),
        highPriorityCount: results.stats.highPriority,
        fmcsaEnhanced: results.stats.fmcsaMatches,
      },
    });
  } catch (error) {
    console.error('Unified leads API error:', error);
    return NextResponse.json(
      {
        error: 'Unified lead generation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const leadService = new UnifiedLeadGenerationService();
    const status = await leadService.getServiceStatus();

    return NextResponse.json({
      service: 'Unified Lead Generation API',
      version: '1.0.0',
      status,
      usage: {
        endpoint: '/api/unified-leads',
        method: 'POST',
        examples: [
          {
            description: 'High-volume automotive manufacturers',
            payload: {
              industries: ['automotive'],
              locations: ['michigan', 'ohio'],
              freightVolume: 'high',
              minLeadScore: 80,
            },
          },
          {
            description: 'Chemical and steel manufacturers',
            payload: {
              industries: ['chemical', 'steel'],
              freightVolume: 'high',
              sources: ['TruckingPlanet'],
            },
          },
          {
            description: 'All high-priority leads',
            payload: {
              minLeadScore: 85,
            },
          },
        ],
      },
      capabilities: {
        dataSources: [
          'TruckingPlanet Network (70K+ shippers)',
          'ThomasNet Manufacturing',
          'FMCSA Enhancement',
        ],
        leadScoring: 'AI-Enhanced Multi-Factor Analysis (0-100 points)',
        features: [
          'Unified lead scoring across multiple sources',
          'FMCSA cross-referencing and verification',
          'Revenue potential estimation',
          'Conversion probability calculation',
          'Priority-based lead ranking',
          'Industry-specific targeting',
        ],
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Service status unavailable' },
      { status: 500 }
    );
  }
}
