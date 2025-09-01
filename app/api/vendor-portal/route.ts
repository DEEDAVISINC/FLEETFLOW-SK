// Vendor Portal Real Data API
// Provides live operational data for vendor management and analytics

import { NextRequest, NextResponse } from 'next/server';
import { aiDashboardIntegration } from '../../services/AICompanyDashboardIntegration';
import { vendorManagementService } from '../../services/VendorManagementService';
import {
  getShipperDashboardSummary,
  getShipperLoads,
} from '../../services/loadService';

// Helper function to get tenant ID (replace with actual auth)
function getTenantId(request: NextRequest): string {
  return request.headers.get('x-tenant-id') || 'default-tenant';
}

// GET /api/vendor-portal - Get vendor portal data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'dashboard';
    const tenantId = getTenantId(request);

    console.info(`🏢 Vendor Portal API: ${action} for tenant ${tenantId}`);

    switch (action) {
      case 'dashboard':
        return await handleGetDashboardData(request, tenantId);
      case 'vendors':
        return await handleGetVendors(request);
      case 'analytics':
        return await handleGetAnalytics(request);
      case 'performance':
        return await handleGetPerformanceData(request);
      case 'contracts':
        return await handleGetContracts(request);
      case 'integrations':
        return await handleGetIntegrations(request);
      case 'alerts':
        return await handleGetAlerts(request);
      case 'health':
        return await handleHealthCheck();
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Vendor Portal API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/vendor-portal - Update vendor data
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'update';
    const tenantId = getTenantId(request);

    console.info(`🔄 Vendor Portal API: ${action} for tenant ${tenantId}`);

    switch (action) {
      case 'update-performance':
        return await handleUpdatePerformance(request);
      case 'sync-billing':
        return await handleSyncBilling(request);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Vendor Portal API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleGetDashboardData(request: NextRequest, tenantId: string) {
  try {
    console.info('📊 Fetching vendor portal dashboard data...');

    // Get comprehensive data in parallel
    const [
      vendorAnalytics,
      integrationHealth,
      shipperLoads,
      dashboardSummary,
      aiMetrics,
    ] = await Promise.all([
      vendorManagementService.getVendorPerformanceAnalytics(),
      vendorManagementService.getIntegrationHealth(),
      getShipperLoads(tenantId).catch(() => []),
      getShipperDashboardSummary(tenantId).catch(() => null),
      aiDashboardIntegration.getRealTimeMetrics().catch(() => null),
    ]);

    // Calculate additional metrics
    const totalLoads = shipperLoads.length;
    const activeLoads = shipperLoads.filter((load) =>
      ['Assigned', 'In Transit'].includes(load.status)
    ).length;

    const dashboardData = {
      // Vendor Management Metrics
      vendorMetrics: {
        totalVendors: vendorAnalytics.totalVendors,
        activeVendors: vendorAnalytics.activeVendors,
        averagePerformance: vendorAnalytics.averagePerformance,
        vendorSatisfaction: vendorAnalytics.vendorSatisfaction,
        contractsExpiring: vendorAnalytics.contractsExpiring,
        riskAssessment: vendorAnalytics.riskAssessment,
      },

      // Financial Metrics
      financialMetrics: {
        totalSpend: vendorAnalytics.totalSpend,
        costSavings: vendorAnalytics.costSavings,
        monthlySpend: Math.round(vendorAnalytics.totalSpend / 12),
        savingsTarget: 15, // 15% savings target
      },

      // Integration Health
      integrationMetrics: {
        totalIntegrations: integrationHealth.totalIntegrations,
        activeIntegrations: integrationHealth.activeIntegrations,
        averageUptime: integrationHealth.averageUptime,
        totalCost: integrationHealth.totalCost,
        issuesCount: integrationHealth.issuesCount,
      },

      // Load Management
      loadMetrics: {
        totalLoads,
        activeLoads,
        completedLoads: totalLoads - activeLoads,
        loadCompletionRate:
          totalLoads > 0
            ? Math.round(((totalLoads - activeLoads) / totalLoads) * 100)
            : 0,
      },

      // AI Integration Metrics
      aiMetrics: aiMetrics
        ? {
            totalRevenue: aiMetrics.totalRevenue,
            systemEfficiency: aiMetrics.systemEfficiency,
            apiCalls: aiMetrics.apiCalls,
            customerInteractions: aiMetrics.customerInteractions,
          }
        : null,

      // Summary
      summary: dashboardSummary,

      // Timestamps
      lastUpdate: new Date().toISOString(),
      dataSource: 'live',
    };

    console.info('✅ Vendor portal dashboard data fetched successfully');

    return NextResponse.json({
      success: true,
      data: dashboardData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Failed to get dashboard data:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch dashboard data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleGetVendors(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');

    console.info('🏢 Getting vendor data...');

    let vendors;
    if (category) {
      vendors = vendorManagementService.getVendorsByCategory(category as any);
    } else {
      vendors = vendorManagementService.getAllVendors();
    }

    // Limit results
    vendors = vendors.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: {
        vendors: vendors.map((vendor) => ({
          id: vendor.id,
          name: vendor.name,
          category: vendor.category,
          status: vendor.status,
          performance: vendor.performance.overall,
          contract: {
            type: vendor.contract.type,
            status: vendor.contract.status,
            endDate: vendor.contract.endDate,
            value: vendor.contract.value.annualValue,
          },
          relationship: {
            tier: vendor.relationship.tier,
            satisfactionScore: vendor.relationship.satisfactionScore,
          },
          riskAssessment: vendor.riskAssessment.overall,
          lastUpdated: vendor.updatedAt,
        })),
        total: vendors.length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Failed to get vendors:', error);
    return NextResponse.json(
      {
        error: 'Failed to get vendors',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleGetAnalytics(request: NextRequest) {
  try {
    console.info('📈 Getting vendor analytics...');

    const [
      performanceAnalytics,
      optimizationRecommendations,
      contractsExpiring,
      highRiskVendors,
    ] = await Promise.all([
      vendorManagementService.getVendorPerformanceAnalytics(),
      vendorManagementService.getVendorOptimizationRecommendations(),
      vendorManagementService.getContractsExpiringSoon(90),
      vendorManagementService.getHighRiskVendors(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        performance: performanceAnalytics,
        optimizationOpportunities: optimizationRecommendations,
        contractsExpiring: contractsExpiring.map((vendor) => ({
          id: vendor.id,
          name: vendor.name,
          contractEndDate: vendor.contract.endDate,
          contractValue: vendor.contract.value.annualValue,
          autoRenewal: vendor.contract.autoRenewal,
        })),
        highRiskVendors: highRiskVendors.map((vendor) => ({
          id: vendor.id,
          name: vendor.name,
          riskLevel: vendor.riskAssessment.overall,
          riskFactors: vendor.riskAssessment.factors,
          mitigationStrategies: vendor.riskAssessment.mitigationStrategies,
        })),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Failed to get analytics:', error);
    return NextResponse.json(
      {
        error: 'Failed to get analytics',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleGetPerformanceData(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');

    console.info('📊 Getting performance data...');

    if (vendorId) {
      // Get specific vendor performance
      const vendor = vendorManagementService.getVendor(vendorId);
      if (!vendor) {
        return NextResponse.json(
          { error: 'Vendor not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          vendor: {
            id: vendor.id,
            name: vendor.name,
            performance: vendor.performance,
            financials: vendor.financials,
            integrations: vendor.integrations,
          },
        },
        timestamp: new Date().toISOString(),
      });
    } else {
      // Get top performing vendors
      const topVendors = vendorManagementService.getTopPerformingVendors(10);

      return NextResponse.json({
        success: true,
        data: {
          topPerformers: topVendors.map((vendor) => ({
            id: vendor.id,
            name: vendor.name,
            category: vendor.category,
            performanceScore: vendor.performance.overall.score,
            rating: vendor.performance.overall.rating,
            tier: vendor.relationship.tier,
          })),
        },
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('❌ Failed to get performance data:', error);
    return NextResponse.json(
      {
        error: 'Failed to get performance data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleGetContracts(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const expiring = searchParams.get('expiring') === 'true';

    console.info('📋 Getting contract data...');

    let vendors = vendorManagementService.getAllVendors();

    if (expiring) {
      vendors = vendorManagementService.getContractsExpiringSoon(90);
    }

    if (status) {
      vendors = vendors.filter((vendor) => vendor.contract.status === status);
    }

    return NextResponse.json({
      success: true,
      data: {
        contracts: vendors.map((vendor) => ({
          id: vendor.contract.id,
          vendorId: vendor.id,
          vendorName: vendor.name,
          type: vendor.contract.type,
          status: vendor.contract.status,
          startDate: vendor.contract.startDate,
          endDate: vendor.contract.endDate,
          value: vendor.contract.value,
          autoRenewal: vendor.contract.autoRenewal,
          terms: vendor.contract.terms,
        })),
        total: vendors.length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Failed to get contracts:', error);
    return NextResponse.json(
      {
        error: 'Failed to get contracts',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleGetIntegrations(request: NextRequest) {
  try {
    console.info('🔗 Getting integration data...');

    const integrationHealth = vendorManagementService.getIntegrationHealth();
    const vendors = vendorManagementService.getAllVendors();

    const allIntegrations = vendors.flatMap((vendor) =>
      vendor.integrations.map((integration) => ({
        ...integration,
        vendorId: vendor.id,
        vendorName: vendor.name,
      }))
    );

    return NextResponse.json({
      success: true,
      data: {
        summary: integrationHealth,
        integrations: allIntegrations,
        byStatus: {
          active: allIntegrations.filter((i) => i.status === 'active').length,
          inactive: allIntegrations.filter((i) => i.status === 'inactive')
            .length,
          error: allIntegrations.filter((i) => i.status === 'error').length,
          maintenance: allIntegrations.filter((i) => i.status === 'maintenance')
            .length,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Failed to get integrations:', error);
    return NextResponse.json(
      {
        error: 'Failed to get integrations',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleGetAlerts(request: NextRequest) {
  try {
    console.info('🚨 Getting vendor alerts...');

    const alerts = vendorManagementService.getVendorAlerts();

    return NextResponse.json({
      success: true,
      data: {
        alerts,
        summary: {
          total: alerts.length,
          high: alerts.filter((a) => a.severity === 'high').length,
          medium: alerts.filter((a) => a.severity === 'medium').length,
          low: alerts.filter((a) => a.severity === 'low').length,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Failed to get alerts:', error);
    return NextResponse.json(
      {
        error: 'Failed to get alerts',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleUpdatePerformance(request: NextRequest) {
  try {
    const { vendorId } = await request.json();

    if (!vendorId) {
      return NextResponse.json(
        { error: 'Vendor ID is required' },
        { status: 400 }
      );
    }

    console.info(`🔄 Updating performance for vendor: ${vendorId}`);

    const success =
      await vendorManagementService.updateVendorPerformance(vendorId);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Vendor performance updated successfully',
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('❌ Failed to update performance:', error);
    return NextResponse.json(
      {
        error: 'Failed to update performance',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleSyncBilling(request: NextRequest) {
  try {
    console.info('💰 Syncing vendor billing data...');

    await vendorManagementService.syncWithBillingSystem();

    return NextResponse.json({
      success: true,
      message: 'Billing sync completed successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Failed to sync billing:', error);
    return NextResponse.json(
      {
        error: 'Failed to sync billing',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleHealthCheck() {
  try {
    const analytics =
      await vendorManagementService.getVendorPerformanceAnalytics();
    const integrationHealth = vendorManagementService.getIntegrationHealth();

    return NextResponse.json({
      success: true,
      service: 'Vendor Portal API',
      status: 'operational',
      data: {
        vendorCount: analytics.totalVendors,
        activeVendors: analytics.activeVendors,
        integrationUptime: integrationHealth.averageUptime,
        systemHealth: 'healthy',
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Health check failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

