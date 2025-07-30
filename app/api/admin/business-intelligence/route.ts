import { NextRequest, NextResponse } from 'next/server';
import {
  getCompletedLoads,
  getCompletedLoadsAnalytics,
  getCompletionRateByPeriod,
  getCustomerAnalytics,
  getDriverPerformanceAnalytics,
  getRevenueTrends,
  getWorkflowAnalytics,
} from '../../../services/loadService';

// GET /api/admin/business-intelligence
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || '30d';
    const analyticsType = searchParams.get('type') || 'overview';

    console.log(
      `📊 Business Intelligence API - Type: ${analyticsType}, Range: ${dateRange}`
    );

    switch (analyticsType) {
      case 'overview':
        // Comprehensive overview analytics
        const completedLoadsAnalytics = getCompletedLoadsAnalytics(dateRange);
        const driverPerformance = getDriverPerformanceAnalytics(dateRange);
        const customerAnalytics = getCustomerAnalytics(dateRange);
        const workflowAnalytics = getWorkflowAnalytics(dateRange);
        const revenueTrends = getRevenueTrends(dateRange);
        const completionRate = getCompletionRateByPeriod(dateRange);
        const completedLoads = getCompletedLoads(dateRange);

        return NextResponse.json({
          success: true,
          data: {
            overview: completedLoadsAnalytics,
            topPerformingDrivers: driverPerformance.slice(0, 5),
            customerAnalytics: customerAnalytics.slice(0, 10),
            workflowCompliance: workflowAnalytics,
            revenueTrends,
            completionRate,
            recentCompletedLoads: completedLoads.slice(0, 10),
            metadata: {
              dateRange,
              generatedAt: new Date().toISOString(),
              totalCompletedLoads: completedLoads.length,
            },
          },
        });

      case 'drivers':
        const driverData = getDriverPerformanceAnalytics(dateRange);
        return NextResponse.json({
          success: true,
          data: {
            drivers: driverData,
            metadata: {
              dateRange,
              totalDrivers: driverData.length,
              generatedAt: new Date().toISOString(),
            },
          },
        });

      case 'customers':
        const customerData = getCustomerAnalytics(dateRange);
        return NextResponse.json({
          success: true,
          data: {
            customers: customerData,
            metadata: {
              dateRange,
              totalCustomers: customerData.length,
              generatedAt: new Date().toISOString(),
            },
          },
        });

      case 'workflow':
        const workflowData = getWorkflowAnalytics(dateRange);
        return NextResponse.json({
          success: true,
          data: {
            workflow: workflowData,
            metadata: {
              dateRange,
              generatedAt: new Date().toISOString(),
            },
          },
        });

      case 'trends':
        const trendsData = getRevenueTrends(dateRange);
        return NextResponse.json({
          success: true,
          data: {
            trends: trendsData,
            metadata: {
              dateRange,
              dataPoints: trendsData.length,
              generatedAt: new Date().toISOString(),
            },
          },
        });

      case 'loads':
        const loadsData = getCompletedLoads(dateRange);
        return NextResponse.json({
          success: true,
          data: {
            completedLoads: loadsData,
            metadata: {
              dateRange,
              totalLoads: loadsData.length,
              generatedAt: new Date().toISOString(),
            },
          },
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error:
              'Invalid analytics type. Supported types: overview, drivers, customers, workflow, trends, loads',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('❌ Business Intelligence API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch business intelligence data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/business-intelligence (for future data updates/calculations)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, dateRange = '30d', parameters = {} } = body;

    console.log(`📊 Business Intelligence POST - Action: ${action}`);

    switch (action) {
      case 'refresh-analytics':
        // Force refresh of analytics data (useful for real-time updates)
        const refreshedData = {
          overview: getCompletedLoadsAnalytics(dateRange),
          drivers: getDriverPerformanceAnalytics(dateRange),
          customers: getCustomerAnalytics(dateRange),
          workflow: getWorkflowAnalytics(dateRange),
        };

        return NextResponse.json({
          success: true,
          message: 'Analytics data refreshed successfully',
          data: refreshedData,
          refreshedAt: new Date().toISOString(),
        });

      case 'export-data':
        // Prepare data for export (CSV/Excel)
        const exportData = {
          completedLoads: getCompletedLoads(dateRange),
          analytics: getCompletedLoadsAnalytics(dateRange),
          drivers: getDriverPerformanceAnalytics(dateRange),
          customers: getCustomerAnalytics(dateRange),
        };

        return NextResponse.json({
          success: true,
          message: 'Export data prepared successfully',
          data: exportData,
          exportType: parameters.format || 'json',
          generatedAt: new Date().toISOString(),
        });

      case 'custom-query':
        // Handle custom analytics queries
        const { query, filters } = parameters;

        // This would be expanded based on specific business needs
        const customResults = {
          query,
          filters,
          results: getCompletedLoads(dateRange),
          message:
            'Custom query executed - extend this endpoint for specific business logic',
        };

        return NextResponse.json({
          success: true,
          data: customResults,
          executedAt: new Date().toISOString(),
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error:
              'Invalid action. Supported actions: refresh-analytics, export-data, custom-query',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('❌ Business Intelligence POST Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process business intelligence request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
