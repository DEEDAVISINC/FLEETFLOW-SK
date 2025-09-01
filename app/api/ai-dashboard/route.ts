// AI Company Dashboard Real Data API
// Provides live operational data to replace mock data in the dashboard

import { NextRequest, NextResponse } from 'next/server';
import { aiDashboardIntegration } from '../../services/AICompanyDashboardIntegration';

// Helper function to get tenant ID (replace with actual auth)
function getTenantId(request: NextRequest): string {
  return request.headers.get('x-tenant-id') || 'depointe-freight1st';
}

// GET /api/ai-dashboard - Get dashboard data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'comprehensive';
    const tenantId = getTenantId(request);

    console.info(`📊 AI Dashboard API: ${action} for tenant ${tenantId}`);

    switch (action) {
      case 'comprehensive':
        return await handleGetComprehensiveData();
      case 'realtime':
        return await handleGetRealTimeMetrics();
      case 'financial':
        return await handleGetFinancialData();
      case 'operational':
        return await handleGetOperationalData();
      case 'performance':
        return await handleGetAIPerformanceData();
      case 'health':
        return await handleGetSystemHealthData();
      case 'productivity':
        return await handleGetStaffProductivity();
      case 'cache-status':
        return await handleGetCacheStatus();
      case 'service-health':
        return await handleServiceHealthCheck();
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('AI Dashboard API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/ai-dashboard - Control dashboard operations
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'refresh';
    const tenantId = getTenantId(request);

    console.info(`🔄 AI Dashboard API: ${action} for tenant ${tenantId}`);

    switch (action) {
      case 'refresh':
        return await handleRefreshData();
      case 'clear-cache':
        return await handleClearCache();
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('AI Dashboard API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleGetComprehensiveData() {
  try {
    console.info('📊 Fetching comprehensive dashboard data...');

    const startTime = Date.now();
    const data = await aiDashboardIntegration.getComprehensiveDashboardData();
    const fetchTime = Date.now() - startTime;

    console.info(`✅ Comprehensive data fetched in ${fetchTime}ms`);

    return NextResponse.json({
      success: true,
      data,
      metadata: {
        fetchTime,
        timestamp: new Date().toISOString(),
        dataSource: data.dataSource,
      },
    });
  } catch (error) {
    console.error('❌ Failed to get comprehensive data:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch comprehensive data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleGetRealTimeMetrics() {
  try {
    console.info('📈 Fetching real-time metrics...');

    const metrics = await aiDashboardIntegration.getRealTimeMetrics();

    return NextResponse.json({
      success: true,
      data: metrics,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Failed to get real-time metrics:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch real-time metrics',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleGetFinancialData() {
  try {
    console.info('💰 Fetching financial data...');

    const financial = await aiDashboardIntegration.getFinancialData();

    return NextResponse.json({
      success: true,
      data: financial,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Failed to get financial data:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch financial data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleGetOperationalData() {
  try {
    console.info('🚛 Fetching operational data...');

    const operational = await aiDashboardIntegration.getOperationalData();

    return NextResponse.json({
      success: true,
      data: operational,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Failed to get operational data:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch operational data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleGetAIPerformanceData() {
  try {
    console.info('🤖 Fetching AI performance data...');

    const performance = await aiDashboardIntegration.getAIPerformanceData();

    return NextResponse.json({
      success: true,
      data: performance,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Failed to get AI performance data:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch AI performance data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleGetSystemHealthData() {
  try {
    console.info('🏥 Fetching system health data...');

    const health = await aiDashboardIntegration.getSystemHealthData();

    return NextResponse.json({
      success: true,
      data: health,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Failed to get system health data:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch system health data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleGetStaffProductivity() {
  try {
    console.info('👥 Fetching staff productivity data...');

    const productivity = await aiDashboardIntegration.getStaffProductivity();

    return NextResponse.json({
      success: true,
      data: productivity,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Failed to get staff productivity data:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch staff productivity data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleGetCacheStatus() {
  try {
    console.info('🗂️ Getting cache status...');

    const cacheStatus = aiDashboardIntegration.getCacheStatus();

    return NextResponse.json({
      success: true,
      data: cacheStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Failed to get cache status:', error);
    return NextResponse.json(
      {
        error: 'Failed to get cache status',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleServiceHealthCheck() {
  try {
    console.info('🏥 Performing service health check...');

    const healthCheck = await aiDashboardIntegration.healthCheck();

    return NextResponse.json({
      success: true,
      data: healthCheck,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Service health check failed:', error);
    return NextResponse.json(
      {
        error: 'Service health check failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleRefreshData() {
  try {
    console.info('🔄 Refreshing dashboard data...');

    // Clear cache to force fresh data
    aiDashboardIntegration.clearCache();

    // Fetch fresh comprehensive data
    const data = await aiDashboardIntegration.getComprehensiveDashboardData();

    return NextResponse.json({
      success: true,
      message: 'Dashboard data refreshed successfully',
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Failed to refresh data:', error);
    return NextResponse.json(
      {
        error: 'Failed to refresh data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleClearCache() {
  try {
    console.info('🗑️ Clearing dashboard cache...');

    aiDashboardIntegration.clearCache();

    return NextResponse.json({
      success: true,
      message: 'Dashboard cache cleared successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Failed to clear cache:', error);
    return NextResponse.json(
      {
        error: 'Failed to clear cache',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

