import { NextRequest, NextResponse } from 'next/server';

// Production alert data for FleetFlow dashboard
const productionAlerts = [
  {
    id: 'alert-001',
    type: 'critical',
    title: 'Load FLT-2024-001 Delayed',
    message:
      'Medical supplies load from Phoenix to Portland is experiencing 4-hour delay due to weather conditions. Customer has been notified and alternative routing is being arranged.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    actionRequired: true,
    priority: 'high',
    category: 'load_delay',
    affectedLoad: 'FLT-2024-001',
    assignedTo: 'Miles Rhodes (Dispatch)',
    status: 'active',
  },
  {
    id: 'alert-002',
    type: 'warning',
    title: 'Carrier Safety Violation',
    message:
      'Carrier ABC Transport has received a new safety violation. Review required before assigning additional loads.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    actionRequired: true,
    priority: 'medium',
    category: 'safety',
    affectedCarrier: 'ABC Transport',
    assignedTo: 'Regina (FMCSA)',
    status: 'active',
  },
  {
    id: 'alert-003',
    type: 'info',
    title: 'New High-Value Shipper Lead',
    message:
      'Identified Fortune 500 company with $2.5M annual shipping volume. Healthcare sector with temperature-controlled requirements.',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    actionRequired: false,
    priority: 'low',
    category: 'new_lead',
    leadValue: '$2.5M',
    assignedTo: 'Desiree (Desperate Prospects)',
    status: 'active',
  },
  {
    id: 'alert-004',
    type: 'critical',
    title: 'Payment Overdue - Southern Foods Inc',
    message:
      'Invoice #INV-2024-015 ($3,250) is 5 days past due. Collections action required.',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    actionRequired: true,
    priority: 'high',
    category: 'payment',
    amount: '$3,250',
    daysOverdue: 5,
    assignedTo: 'Resse A. Bell (Accounting)',
    status: 'active',
  },
  {
    id: 'alert-005',
    type: 'warning',
    title: 'Fleet Maintenance Required',
    message:
      'Truck PTL-789 requires scheduled maintenance. Next available service slot is tomorrow at 8 AM.',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago
    actionRequired: false,
    priority: 'medium',
    category: 'maintenance',
    truckId: 'PTL-789',
    maintenanceType: 'scheduled',
    assignedTo: 'Dell (IT Support)',
    status: 'active',
  },
  {
    id: 'alert-006',
    type: 'info',
    title: 'Campaign Success: Healthcare Blitz',
    message:
      'Healthcare/Pharma campaign has generated 23 qualified leads this week, exceeding target by 15%.',
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(), // 5 hours ago
    actionRequired: false,
    priority: 'low',
    category: 'campaign_success',
    leadsGenerated: 23,
    target: 20,
    campaign: 'Healthcare/Pharma Blitz',
    assignedTo: 'Desiree (Lead Generation)',
    status: 'resolved',
  },
  {
    id: 'alert-007',
    type: 'warning',
    title: 'Driver Availability Low',
    message:
      'Only 3 drivers available for next 48 hours. Consider carrier partnerships for load FLT-2024-007.',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6 hours ago
    actionRequired: true,
    priority: 'medium',
    category: 'capacity',
    availableDrivers: 3,
    requiredDrivers: 5,
    affectedLoad: 'FLT-2024-007',
    assignedTo: 'Miles Rhodes (Dispatch)',
    status: 'active',
  },
  {
    id: 'alert-008',
    type: 'info',
    title: 'Market Rate Update',
    message:
      'Fuel surcharge increased by 2.5% effective immediately. All quotes have been updated automatically.',
    timestamp: new Date(Date.now() - 1000 * 60 * 480).toISOString(), // 8 hours ago
    actionRequired: false,
    priority: 'low',
    category: 'market_update',
    rateChange: '+2.5%',
    effectiveDate: 'immediate',
    assignedTo: 'Ana Lyles (Data Analysis)',
    status: 'resolved',
  },
];

export async function GET(request: NextRequest) {
  try {
    // Filter alerts by status if requested
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const priority = searchParams.get('priority');

    let filteredAlerts = productionAlerts;

    if (status) {
      filteredAlerts = filteredAlerts.filter(
        (alert) => alert.status === status
      );
    }

    if (type) {
      filteredAlerts = filteredAlerts.filter((alert) => alert.type === type);
    }

    if (priority) {
      filteredAlerts = filteredAlerts.filter(
        (alert) => alert.priority === priority
      );
    }

    // Sort by timestamp (newest first)
    filteredAlerts.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({
      alerts: filteredAlerts,
      total: filteredAlerts.length,
      critical: filteredAlerts.filter((a) => a.type === 'critical').length,
      warning: filteredAlerts.filter((a) => a.type === 'warning').length,
      info: filteredAlerts.filter((a) => a.type === 'info').length,
      lastUpdated: new Date().toISOString(),
      source: 'FleetFlow Alert System',
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // In production, this would create a new alert in the database
    const newAlert = {
      id: `alert-${Date.now()}`,
      ...body,
      timestamp: new Date().toISOString(),
      status: 'active',
    };

    return NextResponse.json({
      success: true,
      alert: newAlert,
      message: 'Alert created successfully',
    });
  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    );
  }
}
