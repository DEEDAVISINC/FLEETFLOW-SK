import { NextRequest, NextResponse } from 'next/server';
import { isFeatureEnabled } from '../../../config/feature-flags';
import { VolumeDiscountStructureService } from '../../../services/volume-discount-structure';

const volumeDiscountService = new VolumeDiscountStructureService();

export async function GET(request: NextRequest) {
  try {
    if (!isFeatureEnabled('VOLUME_DISCOUNT_STRUCTURE')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Volume Discount Structure feature is not enabled',
          message:
            'Enable ENABLE_VOLUME_DISCOUNT_STRUCTURE=true to use this feature',
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const customerId = searchParams.get('customerId');
    const timeframe = searchParams.get('timeframe') as
      | 'monthly'
      | 'quarterly'
      | 'annual'
      | null;

    switch (action) {
      case 'analyze':
        if (!customerId) {
          return NextResponse.json(
            {
              success: false,
              error: 'Customer ID is required for analysis',
            },
            { status: 400 }
          );
        }
        const analysis =
          await volumeDiscountService.analyzeCustomerVolume(customerId);
        return NextResponse.json(analysis);

      case 'structures':
        const structures = await volumeDiscountService.getDiscountStructures();
        return NextResponse.json(structures);

      case 'projection':
        if (!customerId) {
          return NextResponse.json(
            {
              success: false,
              error: 'Customer ID is required for volume projection',
            },
            { status: 400 }
          );
        }
        const projection = await volumeDiscountService.projectVolumeGrowth(
          customerId,
          timeframe || 'quarterly'
        );
        return NextResponse.json(projection);

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action specified',
            message: 'Valid actions: analyze, structures, projection',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Volume Discount Structure API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isFeatureEnabled('VOLUME_DISCOUNT_STRUCTURE')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Volume Discount Structure feature is not enabled',
          message:
            'Enable ENABLE_VOLUME_DISCOUNT_STRUCTURE=true to use this feature',
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, customerData, competitorOffers } = body;

    switch (action) {
      case 'analyze':
        if (!customerData?.customerId) {
          return NextResponse.json(
            {
              success: false,
              error: 'Customer data with ID is required',
            },
            { status: 400 }
          );
        }
        const analysis = await volumeDiscountService.analyzeCustomerVolume(
          customerData.customerId
        );
        return NextResponse.json(analysis);

      case 'optimal-discount':
        if (!customerData) {
          return NextResponse.json(
            {
              success: false,
              error: 'Customer data is required',
            },
            { status: 400 }
          );
        }
        const optimalDiscount =
          await volumeDiscountService.calculateOptimalDiscount(
            customerData,
            competitorOffers
          );
        return NextResponse.json(optimalDiscount);

      case 'structures':
        const structures = await volumeDiscountService.getDiscountStructures();
        return NextResponse.json(structures);

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action specified',
            message: 'Valid actions: analyze, optimal-discount, structures',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Volume Discount Structure API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
