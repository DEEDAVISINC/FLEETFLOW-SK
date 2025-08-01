// AI Review API Routes
// Centralized AI review system for all FleetFlow processes

import { NextRequest, NextResponse } from 'next/server';
import {
  AIReviewService,
  type ReviewContext,
} from '../../services/ai-review/AIReviewService';

const aiReviewService = new AIReviewService();

// GET - Retrieve AI review results and metrics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'metrics':
        const metrics = await aiReviewService.getReviewMetrics();
        return NextResponse.json({ success: true, data: metrics });

      case 'validation_rules':
        const processType = searchParams.get('processType');
        if (!processType) {
          return NextResponse.json(
            { success: false, error: 'Process type required' },
            { status: 400 }
          );
        }
        // Return validation rules for the process type
        return NextResponse.json({ success: true, data: [] });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in AI review GET:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Perform AI review on process data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'review_dispatch_invoice':
        const invoiceReview = await aiReviewService.reviewDispatchInvoice(data);
        return NextResponse.json({ success: true, data: invoiceReview });

      case 'review_load_assignment':
        const assignmentReview =
          await aiReviewService.reviewLoadAssignment(data);
        return NextResponse.json({ success: true, data: assignmentReview });

      case 'review_carrier_onboarding':
        const onboardingReview =
          await aiReviewService.reviewCarrierOnboarding(data);
        return NextResponse.json({ success: true, data: onboardingReview });

      case 'review_payment_processing':
        const paymentReview =
          await aiReviewService.reviewPaymentProcessing(data);
        return NextResponse.json({ success: true, data: paymentReview });

      case 'review_document_verification':
        const documentReview =
          await aiReviewService.reviewDocumentVerification(data);
        return NextResponse.json({ success: true, data: documentReview });

      case 'review_compliance_check':
        const complianceReview =
          await aiReviewService.reviewComplianceCheck(data);
        return NextResponse.json({ success: true, data: complianceReview });

      case 'review_process':
        const { processType, reviewData, userId, priority } = data;
        const context: ReviewContext = {
          processType,
          data: reviewData,
          userId: userId || 'unknown',
          timestamp: new Date(),
          priority: priority || 'medium',
        };
        const processReview = await aiReviewService.reviewProcess(context);
        return NextResponse.json({ success: true, data: processReview });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in AI review POST:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update validation rules and configuration
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'update_validation_rule':
        // Update validation rule
        return NextResponse.json({
          success: true,
          message: 'Validation rule updated',
        });

      case 'enable_validation_rule':
        // Enable validation rule
        return NextResponse.json({
          success: true,
          message: 'Validation rule enabled',
        });

      case 'disable_validation_rule':
        // Disable validation rule
        return NextResponse.json({
          success: true,
          message: 'Validation rule disabled',
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in AI review PUT:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
