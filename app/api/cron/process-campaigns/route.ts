import { NextRequest, NextResponse } from 'next/server';

/**
 * CRON ENDPOINT - Called every 10 seconds by external cron service
 * This keeps campaigns running 24/7
 *
 * Setup options:
 * 1. EasyCron.com - Free tier (every 10 seconds requires paid plan)
 * 2. Cron-job.org - Free tier (minimum 1 minute)
 * 3. DigitalOcean Functions - Built-in cron
 * 4. Vercel Cron Jobs - Built-in (minutes granularity)
 *
 * For now: Call /api/depointe/process-campaigns directly
 */

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'depointe-cron-secret-2025';

  // Verify cron secret to prevent unauthorized access
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('⏰ [CRON] Triggering campaign processor...');

    // Call the campaign processor
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001';
    const response = await fetch(`${baseUrl}/api/depointe/process-campaigns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    console.log('✅ [CRON] Campaign processor completed:', result);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      result,
    });
  } catch (error: any) {
    console.error('❌ [CRON] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// POST endpoint for manual triggers
export async function POST(request: NextRequest) {
  return GET(request);
}


