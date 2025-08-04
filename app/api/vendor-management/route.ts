import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock vendor management data
    const vendorData = {
      totalVendors: 47,
      activeVendors: 42,
      averagePerformance: 91.3,
      totalSpend: 2847500,
      costSavings: 18.7,
      vendorSatisfaction: 94.2,
      contractsExpiring: 8,
      riskAssessment: 'Low',
      trends: {
        thisMonth: '+2.8%',
        lastQuarter: '+12.4%',
        yearOverYear: '+24.6%',
      },
      topVendors: [
        {
          id: 1,
          name: 'Premium Logistics Solutions',
          category: 'Transportation',
          performance: 97.2,
          spend: 485000,
          status: 'excellent',
          contract_expires: '2025-08-15',
        },
        {
          id: 2,
          name: 'TechFlow Integration Services',
          category: 'Technology',
          performance: 94.8,
          spend: 325000,
          status: 'good',
          contract_expires: '2025-12-01',
        },
        {
          id: 3,
          name: 'Global Fuel Card Solutions',
          category: 'Fuel Management',
          performance: 89.5,
          spend: 892000,
          status: 'good',
          contract_expires: '2025-03-20',
        },
      ],
      integrations: [
        {
          name: 'QuickBooks Online',
          status: 'active',
          uptime: 99.7,
          cost: 89.99,
          lastSync: '2 minutes ago',
        },
        {
          name: 'Fuel Card API',
          status: 'active',
          uptime: 98.2,
          cost: 149.99,
          lastSync: '5 minutes ago',
        },
        {
          name: 'Banking Integration',
          status: 'active',
          uptime: 99.9,
          cost: 199.99,
          lastSync: '1 minute ago',
        },
        {
          name: 'ERP Connector',
          status: 'warning',
          uptime: 94.1,
          cost: 299.99,
          lastSync: '2 hours ago',
        },
      ],
      alerts: [
        {
          id: 1,
          type: 'warning',
          message: 'Global Fuel Card contract expires in 45 days',
          severity: 'high',
          vendor: 'Global Fuel Card Solutions',
        },
        {
          id: 2,
          type: 'info',
          message: 'New vendor evaluation scheduled for next week',
          severity: 'low',
        },
        {
          id: 3,
          type: 'success',
          message: 'Cost optimization target exceeded by 12%',
          severity: 'low',
        },
      ],
    };

    return NextResponse.json(vendorData);
  } catch (error) {
    console.error('Error fetching vendor management data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vendor management data' },
      { status: 500 }
    );
  }
}
