// Test USPTO API Integration
import { NextRequest, NextResponse } from 'next/server';
import { FreeBusinessIntelligenceService } from '../../services/FreeBusinessIntelligenceService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const company = searchParams.get('company') || 'Apple Inc';

    const businessIntelService = new FreeBusinessIntelligenceService();
    const validation = await businessIntelService.validateBusinessIP(company);

    return NextResponse.json({
      success: true,
      company,
      validation,
      message: `USPTO validation complete for ${company}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('USPTO Test API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
