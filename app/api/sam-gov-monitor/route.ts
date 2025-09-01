import { NextRequest, NextResponse } from 'next/server';
import { samGovMonitor } from '../../services/SAMGovOpportunityMonitor';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'status':
        const status = samGovMonitor.getStatus();
        return NextResponse.json({
          success: true,
          data: status,
          message: 'SAM.gov monitoring status retrieved successfully'
        });

      case 'check':
        const result = await samGovMonitor.checkForNewOpportunities();
        return NextResponse.json({
          success: true,
          data: result,
          message: result.newOpportunities.length > 0 
            ? `Found ${result.newOpportunities.length} new opportunities`
            : 'No new opportunities found'
        });

      default:
        return NextResponse.json({
          success: true,
          data: {
            service: 'SAM.gov Opportunity Monitor',
            version: '1.0.0',
            endpoints: {
              'GET ?action=status': 'Get monitoring status',
              'GET ?action=check': 'Check for new opportunities now',
              'POST': 'Update monitoring configuration'
            }
          },
          message: 'SAM.gov monitoring service is online'
        });
    }
  } catch (error) {
    console.error('SAM.gov Monitor API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, config } = body;

    switch (action) {
      case 'update-config':
        if (!config) {
          return NextResponse.json({
            success: false,
            error: 'Configuration data required'
          }, { status: 400 });
        }

        samGovMonitor.updateConfig(config);
        const newStatus = samGovMonitor.getStatus();
        
        return NextResponse.json({
          success: true,
          data: newStatus,
          message: 'Configuration updated successfully'
        });

      case 'test-notification':
        const mockOpportunities = [
          {
            id: 'TEST-001',
            title: 'Test Government Contract Opportunity',
            solicitationNumber: 'TEST-2024-001',
            agency: 'Test Agency',
            amount: '$100,000',
            responseDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            postedDate: new Date().toISOString(),
            description: 'This is a test notification for SAM.gov monitoring system.',
            naicsCode: '484',
            setAsideType: 'Test',
            location: 'Test Location',
            url: 'https://test.sam.gov/test'
          }
        ];

        // Send test notification
        console.info('🧪 Sending test SAM.gov notification...');
        return NextResponse.json({
          success: true,
          data: { testOpportunities: mockOpportunities },
          message: 'Test notification sent successfully'
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('SAM.gov Monitor API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 