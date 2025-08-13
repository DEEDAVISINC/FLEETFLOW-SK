import { NextRequest, NextResponse } from 'next/server';
import FreightEmailAI, {
  TenantEmailConfig,
} from '../../../../services/FreightEmailAI';

const emailAI = new FreightEmailAI();

/**
 * Get tenant email configuration
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      // Return all tenant configs (admin only)
      const allConfigs = emailAI.getAllTenantConfigs();
      return NextResponse.json({
        success: true,
        configs: allConfigs,
        total: allConfigs.length,
      });
    }

    // Return specific tenant config
    const config = emailAI.getTenantConfig(tenantId);

    return NextResponse.json({
      success: true,
      config,
      tenantId,
    });
  } catch (error) {
    console.error('Tenant config retrieval error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve tenant configuration',
      },
      { status: 500 }
    );
  }
}

/**
 * Update tenant email configuration
 */
export async function PUT(request: NextRequest) {
  try {
    const config: TenantEmailConfig = await request.json();

    if (!config.tenantId || !config.companyName || !config.fromEmail) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tenant ID, company name, and from email are required',
        },
        { status: 400 }
      );
    }

    // Update tenant configuration
    emailAI.updateTenantConfig(config);

    return NextResponse.json({
      success: true,
      message: `Email configuration updated for ${config.companyName}`,
      tenantId: config.tenantId,
    });
  } catch (error) {
    console.error('Tenant config update error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update tenant configuration',
      },
      { status: 500 }
    );
  }
}

/**
 * Create new tenant email configuration
 */
export async function POST(request: NextRequest) {
  try {
    const config = await request.json();

    if (!config.tenantId || !config.companyName || !config.fromEmail) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tenant ID, company name, and from email are required',
        },
        { status: 400 }
      );
    }

    // Create new tenant configuration
    emailAI.createTenantConfig(config);

    return NextResponse.json({
      success: true,
      message: `Email configuration created for ${config.companyName}`,
      tenantId: config.tenantId,
    });
  } catch (error) {
    console.error('Tenant config creation error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create tenant configuration',
      },
      { status: 500 }
    );
  }
}




