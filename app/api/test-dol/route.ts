// Test DOL API Integration - Labor & Safety Compliance
import { NextRequest, NextResponse } from 'next/server';
import { FreeBusinessIntelligenceService } from '../../services/FreeBusinessIntelligenceService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const company = searchParams.get('company') || 'Walmart Inc';
    const checkType = searchParams.get('type') || 'comprehensive'; // 'labor', 'safety', or 'comprehensive'

    const businessIntelService = new FreeBusinessIntelligenceService();
    let result: any = {};

    switch (checkType) {
      case 'labor':
        result = {
          type: 'Labor Compliance Check',
          data: await businessIntelService.checkLaborCompliance(company),
        };
        break;

      case 'safety':
        result = {
          type: 'Safety Compliance Check',
          data: await businessIntelService.checkSafetyCompliance(company),
        };
        break;

      case 'comprehensive':
      default:
        result = {
          type: 'Comprehensive Compliance Profile',
          data: await businessIntelService.getComprehensiveComplianceProfile(
            company
          ),
        };
        break;
    }

    return NextResponse.json({
      success: true,
      company,
      checkType,
      result,
      message: `DOL ${checkType} compliance check complete for ${company}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('DOL Test API Error:', error);
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



