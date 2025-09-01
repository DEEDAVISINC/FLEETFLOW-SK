import { improvmxService } from '@/app/services/improvmx-service';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/email/setup - Setup default FleetFlow email aliases
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { forwardToEmail } = body;

    if (!forwardToEmail) {
      return NextResponse.json(
        { success: false, error: 'Forward email address is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forwardToEmail)) {
      return NextResponse.json(
        { success: false, error: 'Invalid forward email format' },
        { status: 400 }
      );
    }

    console.info(
      `🚀 Setting up FleetFlow email aliases forwarding to: ${forwardToEmail}`
    );

    // Setup default aliases
    const result = await improvmxService.setupDefaultAliases(forwardToEmail);

    if (result.success) {
      return NextResponse.json({
        success: true,
        aliases: result.data,
        message: `Successfully created ${result.data?.length || 0} email aliases for fleetflowapp.com`,
        setup: {
          domain: 'fleetflowapp.com',
          forwardTo: forwardToEmail,
          aliasesCreated:
            result.data?.map((alias) => `${alias.alias}@fleetflowapp.com`) ||
            [],
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          partialResults: result.data
            ? {
                aliasesCreated: result.data.map(
                  (alias) => `${alias.alias}@fleetflowapp.com`
                ),
                count: result.data.length,
              }
            : undefined,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Email setup error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to setup email aliases' },
      { status: 500 }
    );
  }
}

// GET /api/email/setup - Check domain status and current setup
export async function GET() {
  try {
    // Check if API key is configured
    if (!process.env.IMPROVMX_API_KEY) {
      return NextResponse.json({
        success: true,
        domain: null,
        aliases: [],
        status: {
          domainActive: false,
          aliasCount: 0,
          setupComplete: false,
          needsApiKey: true,
        },
        message:
          'ImprovMX API key not configured. Please add IMPROVMX_API_KEY to your .env.local file.',
      });
    }

    const [domainResult, aliasesResult] = await Promise.all([
      improvmxService.getDomainInfo(),
      improvmxService.getAliases(),
    ]);

    return NextResponse.json({
      success: true,
      domain: domainResult.data,
      aliases: aliasesResult.data,
      status: {
        domainActive: domainResult.data?.active || false,
        aliasCount: aliasesResult.data?.length || 0,
        setupComplete: (aliasesResult.data?.length || 0) > 0,
        needsApiKey: false,
      },
    });
  } catch (error) {
    console.error('Email setup status error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check email setup status' },
      { status: 500 }
    );
  }
}
