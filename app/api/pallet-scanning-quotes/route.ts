import { NextRequest, NextResponse } from 'next/server';
import {
  PalletScanningQuoteRequest,
  PalletScanningService,
  palletScanningQuoteService,
} from '../../services/pallet-scanning-quote-service';

export async function POST(request: NextRequest) {
  try {
    const body: PalletScanningQuoteRequest = await request.json();

    // Validate required fields
    if (!body.palletCount || body.palletCount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid pallet count',
          message: 'Pallet count must be a positive number',
        },
        { status: 400 }
      );
    }

    if (
      !body.serviceType ||
      !['LTL', 'FTL', 'Specialized'].includes(body.serviceType)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid service type',
          message: 'Service type must be LTL, FTL, or Specialized',
        },
        { status: 400 }
      );
    }

    // Calculate quotes for all applicable services
    const quotes = palletScanningQuoteService.calculateQuote(body);
    const recommendedService =
      palletScanningQuoteService.getRecommendedService(body);

    // Get industry-specific recommendations if industry is provided
    let industryRecommendations: PalletScanningService[] = [];
    if (body.industry) {
      industryRecommendations =
        palletScanningQuoteService.getIndustryRecommendations(body.industry);
    }

    return NextResponse.json({
      success: true,
      quotes,
      recommendedService,
      industryRecommendations,
      message: `Generated ${quotes.length} pallet scanning service quotes`,
    });
  } catch (error) {
    console.error('Error generating pallet scanning quotes:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate quotes',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('serviceId');
    const industry = searchParams.get('industry');
    const annualLoads = searchParams.get('annualLoads');
    const avgPalletCount = searchParams.get('avgPalletCount');

    // Get specific service
    if (serviceId) {
      const service = palletScanningQuoteService.getServiceById(serviceId);
      if (!service) {
        return NextResponse.json(
          {
            success: false,
            error: 'Service not found',
            message: `No service found with ID: ${serviceId}`,
          },
          { status: 404 }
        );
      }

      // Calculate ROI if parameters provided
      let roiAnalysis = null;
      if (annualLoads && avgPalletCount) {
        roiAnalysis = palletScanningQuoteService.calculateROI(
          service,
          parseInt(annualLoads),
          parseInt(avgPalletCount)
        );
      }

      return NextResponse.json({
        success: true,
        service,
        roiAnalysis,
      });
    }

    // Get industry recommendations
    if (industry) {
      const recommendations =
        palletScanningQuoteService.getIndustryRecommendations(industry);
      return NextResponse.json({
        success: true,
        recommendations,
        industry,
      });
    }

    // Get all services
    const services = palletScanningQuoteService.getAllServices();
    return NextResponse.json({
      success: true,
      services,
      message: `Retrieved ${services.length} pallet scanning services`,
    });
  } catch (error) {
    console.error('Error retrieving pallet scanning services:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve services',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
