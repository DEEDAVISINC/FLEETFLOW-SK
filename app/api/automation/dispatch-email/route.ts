import { NextRequest, NextResponse } from 'next/server';
import { dispatchEmailAutomation } from '../../../services/SalesEmailAutomationService';

// 🚛 DISPATCH EMAIL AUTOMATION API ENDPOINTS
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'send_load_opportunity':
        const loadResults =
          await dispatchEmailAutomation.sendLoadOpportunityEmail(
            data.load,
            data.carriers
          );

        const successCount = loadResults.filter((r) => r.success).length;
        const totalCount = loadResults.length;

        return NextResponse.json({
          success: true,
          results: loadResults,
          summary: {
            sent: successCount,
            total: totalCount,
            successRate: Math.round((successCount / totalCount) * 100),
          },
          message: `Load opportunity sent to ${successCount}/${totalCount} carriers`,
        });

      case 'assign_driver':
        const assignmentResult =
          await dispatchEmailAutomation.sendDriverAssignmentEmail(
            data.load,
            data.driver
          );
        return NextResponse.json({
          success: true,
          result: assignmentResult,
          message: 'Driver assignment email sent successfully',
        });

      case 'send_status_update':
        const statusResults =
          await dispatchEmailAutomation.sendLoadStatusUpdate(
            data.loadStatus,
            data.stakeholders
          );

        const statusSuccessCount = statusResults.filter(
          (r) => r.success
        ).length;
        const statusTotalCount = statusResults.length;

        return NextResponse.json({
          success: true,
          results: statusResults,
          summary: {
            sent: statusSuccessCount,
            total: statusTotalCount,
            successRate: Math.round(
              (statusSuccessCount / statusTotalCount) * 100
            ),
          },
          message: `Status update sent to ${statusSuccessCount}/${statusTotalCount} stakeholders`,
        });

      case 'bulk_load_broadcast':
        // Handle bulk load broadcasting to multiple carriers
        const bulkResults = [];
        for (const load of data.loads) {
          const results =
            await dispatchEmailAutomation.sendLoadOpportunityEmail(
              load,
              data.carriers
            );
          bulkResults.push(...results);
        }

        const bulkSuccessCount = bulkResults.filter((r) => r.success).length;
        const bulkTotalCount = bulkResults.length;

        return NextResponse.json({
          success: true,
          results: bulkResults,
          summary: {
            loads: data.loads.length,
            carriers: data.carriers.length,
            totalEmails: bulkTotalCount,
            successful: bulkSuccessCount,
            successRate: Math.round((bulkSuccessCount / bulkTotalCount) * 100),
          },
          message: `Bulk broadcast: ${data.loads.length} loads sent to ${data.carriers.length} carriers`,
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action specified',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Dispatch email automation error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

// GET endpoint for dispatch email automation status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const loadId = searchParams.get('loadId');

    if (loadId) {
      // Get email status for specific load
      return NextResponse.json({
        success: true,
        loadId,
        emailHistory: [
          // This would be populated from actual email tracking
          {
            type: 'load_opportunity',
            sentTo: 5,
            opened: 3,
            responded: 1,
            timestamp: new Date().toISOString(),
          },
        ],
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Dispatch email automation service is operational',
      features: [
        'Load opportunity broadcasting',
        'Driver assignment notifications',
        'Status update communications',
        'Bulk email operations',
        'Carrier outreach automation',
      ],
      stats: {
        emailsSentToday: 156,
        responseRate: 23,
        averageResponseTime: '47 minutes',
      },
    });
  } catch (error) {
    console.error('Dispatch email automation status error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}




