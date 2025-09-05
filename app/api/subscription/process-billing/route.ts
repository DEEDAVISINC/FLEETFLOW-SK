import { NextRequest, NextResponse } from 'next/server';
import { organizationSubscriptionService } from '../../../services/OrganizationSubscriptionService';

// POST /api/subscription/process-billing - Process recurring billing (for cron jobs)
export async function POST(request: NextRequest) {
  try {
    // This endpoint should be protected and only callable by authorized cron jobs
    // For now, we'll allow it but in production you'd want to add authentication

    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET_TOKEN;

    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result =
      await organizationSubscriptionService.processRecurringBilling();

    return NextResponse.json({
      success: true,
      processed: result.processed,
      failed: result.failed,
      errors: result.errors,
    });
  } catch (error) {
    console.error('Error processing recurring billing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/subscription/process-billing - Health check for billing system
export async function GET() {
  try {
    // Simple health check
    return NextResponse.json({
      success: true,
      message: 'Billing system is operational',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Billing system health check failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Billing system is not operational',
      },
      { status: 500 }
    );
  }
}




