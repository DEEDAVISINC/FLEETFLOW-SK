import { NextRequest, NextResponse } from 'next/server';
import { isFeatureEnabled } from '../../../config/feature-flags';
import { CustomerRetentionService } from '../../../services/customer-retention';

const retentionService = new CustomerRetentionService();

export async function GET(request: NextRequest) {
  try {
    if (!isFeatureEnabled('CUSTOMER_RETENTION_ANALYSIS')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Customer Retention Analysis feature is not enabled',
          message:
            'Enable ENABLE_CUSTOMER_RETENTION_ANALYSIS=true to use this feature',
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const customerId = searchParams.get('customerId');

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
          await retentionService.analyzeCustomerRetention(customerId);
        return NextResponse.json(analysis);

      case 'metrics':
        const metrics = await retentionService.getRetentionMetrics();
        return NextResponse.json(metrics);

      case 'segments':
        const segments = await retentionService.segmentCustomers();
        return NextResponse.json(segments);

      case 'recommendations':
        const recommendations =
          await retentionService.getRetentionRecommendations(
            customerId || undefined
          );
        return NextResponse.json(recommendations);

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action specified',
            message:
              'Valid actions: analyze, metrics, segments, recommendations',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Customer Retention API Error:', error);
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
    if (!isFeatureEnabled('CUSTOMER_RETENTION_ANALYSIS')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Customer Retention Analysis feature is not enabled',
          message:
            'Enable ENABLE_CUSTOMER_RETENTION_ANALYSIS=true to use this feature',
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, customerId, data } = body;

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
          await retentionService.analyzeCustomerRetention(customerId);
        return NextResponse.json(analysis);

      case 'metrics':
        const metrics = await retentionService.getRetentionMetrics();
        return NextResponse.json(metrics);

      case 'segments':
        const segments = await retentionService.segmentCustomers();
        return NextResponse.json(segments);

      case 'recommendations':
        const recommendations =
          await retentionService.getRetentionRecommendations(customerId);
        return NextResponse.json(recommendations);

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action specified',
            message:
              'Valid actions: analyze, metrics, segments, recommendations',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Customer Retention API Error:', error);
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
