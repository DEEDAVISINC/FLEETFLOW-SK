import { NextRequest, NextResponse } from 'next/server';
import { withOrganizationAuth } from '../../../middleware/organizationAuth';
import { OrganizationDataService } from '../../../services/MultiTenantDataService';

export async function GET(request: NextRequest) {
  try {
    // Check authentication and organization access
    const auth = await withOrganizationAuth(request);

    if (!auth.success) {
      return auth.response!;
    }

    // Get all data sources
    const loadService = await import('../../../services/loadService');
    const driverService = await import(
      '../../../services/driverLoadBoardAccess'
    );
    const carrierService = await import('../../../services/shipperService');

    const [allLoads, allDrivers, allCarriers] = await Promise.all([
      loadService.loadService.getAllLoads(),
      driverService.driverLoadBoardAccess.getAllDrivers(),
      carrierService.shipperService.getAllShippers(),
    ]);

    // Get organization-specific metrics
    const dashboardMetrics =
      await OrganizationDataService.getOrganizationDashboardMetrics(
        allLoads,
        allDrivers,
        allCarriers
      );

    return NextResponse.json({
      success: true,
      data: dashboardMetrics,
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




