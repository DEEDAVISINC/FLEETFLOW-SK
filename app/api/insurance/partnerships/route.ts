import { NextRequest, NextResponse } from 'next/server';
import { insurancePartnershipService } from '../../../services/insurance-partnership-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const requestId = searchParams.get('requestId');

    if (action === 'analytics') {
      const analytics = insurancePartnershipService.getPartnershipAnalytics();
      return NextResponse.json({
        success: true,
        data: analytics,
      });
    }

    if (action === 'quotes' && requestId) {
      const quotes =
        await insurancePartnershipService.getQuotesForRequest(requestId);
      return NextResponse.json({
        success: true,
        data: quotes,
      });
    }

    if (action === 'renewals') {
      const renewals = insurancePartnershipService.getUpcomingRenewals();
      return NextResponse.json({
        success: true,
        data: renewals,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid action or missing parameters',
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Insurance partnerships API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'submit_quote_request') {
      const { quoteRequest } = body;

      if (!quoteRequest) {
        return NextResponse.json(
          {
            success: false,
            error: 'Quote request data is required',
          },
          { status: 400 }
        );
      }

      const result =
        await insurancePartnershipService.submitQuoteRequest(quoteRequest);

      return NextResponse.json({
        success: true,
        data: result,
      });
    }

    if (action === 'record_commission') {
      const { quoteId, policyDetails } = body;

      if (!quoteId || !policyDetails) {
        return NextResponse.json(
          {
            success: false,
            error: 'Quote ID and policy details are required',
          },
          { status: 400 }
        );
      }

      await insurancePartnershipService.recordCommission(
        quoteId,
        policyDetails
      );

      return NextResponse.json({
        success: true,
        message: 'Commission recorded successfully',
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid action',
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Insurance partnerships API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
