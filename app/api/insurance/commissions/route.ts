import { NextRequest, NextResponse } from 'next/server';

// Insurance Commission Tracking API
// Aggregates commission data from all insurance partners

interface CommissionData {
  partnerId: string;
  partnerName: string;
  leadId: string;
  companyName: string;
  policyNumber?: string;
  commissionAmount: number;
  commissionRate: string;
  status: 'pending' | 'earned' | 'paid';
  submittedDate: string;
  earnedDate?: string;
  paidDate?: string;
  policyType: string;
  renewalCommission?: number;
  notes?: string;
}

// Mock commission data for demo purposes
// In production, this would come from a database
const mockCommissions: CommissionData[] = [
  {
    partnerId: 'tivly',
    partnerName: 'Tivly Affiliate Program',
    leadId: 'TIVLY-1234567890',
    companyName: 'ABC Trucking LLC',
    policyNumber: 'TIV-POL-789012',
    commissionAmount: 1850.00,
    commissionRate: '8.5%',
    status: 'paid',
    submittedDate: '2024-01-15T10:30:00Z',
    earnedDate: '2024-01-22T14:45:00Z',
    paidDate: '2024-02-01T09:00:00Z',
    policyType: 'Commercial Auto + General Liability',
    renewalCommission: 925.00,
    notes: 'Fleet of 12 vehicles, excellent safety record'
  },
  {
    partnerId: 'covered',
    partnerName: 'Covered Embedded Insurance',
    leadId: 'COVERED-2345678901',
    companyName: 'XYZ Transport Inc',
    policyNumber: 'COV-REF-345678',
    commissionAmount: 2340.00,
    commissionRate: '18%',
    status: 'earned',
    submittedDate: '2024-01-20T11:15:00Z',
    earnedDate: '2024-01-28T16:20:00Z',
    policyType: 'Commercial Auto + Workers Comp + Cargo',
    renewalCommission: 1170.00,
    notes: '25 vehicle fleet, multi-state operations'
  },
  {
    partnerId: 'insurify',
    partnerName: 'Insurify Partnership',
    leadId: 'INSURIFY-3456789012',
    companyName: 'Fast Freight Solutions',
    policyNumber: 'INS-CASE-456789',
    commissionAmount: 1620.00,
    commissionRate: '12%',
    status: 'earned',
    submittedDate: '2024-01-25T09:45:00Z',
    earnedDate: '2024-02-02T13:30:00Z',
    policyType: 'Commercial Auto + General Liability + Cyber',
    renewalCommission: 810.00,
    notes: '8 vehicle fleet, technology-focused company'
  },
  {
    partnerId: 'tivly',
    partnerName: 'Tivly Affiliate Program',
    leadId: 'TIVLY-4567890123',
    companyName: 'Mountain Logistics Co',
    commissionAmount: 950.00,
    commissionRate: '7%',
    status: 'pending',
    submittedDate: '2024-02-01T14:20:00Z',
    policyType: 'Commercial Auto',
    notes: 'Small fleet, pending policy binding'
  },
  {
    partnerId: 'covered',
    partnerName: 'Covered Embedded Insurance',
    leadId: 'COVERED-5678901234',
    companyName: 'Coastal Hauling LLC',
    commissionAmount: 2100.00,
    commissionRate: '15%',
    status: 'pending',
    submittedDate: '2024-02-05T16:10:00Z',
    policyType: 'Commercial Auto + General Liability + Workers Comp',
    notes: '18 vehicle fleet, quote under review'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get('partnerId');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let filteredCommissions = [...mockCommissions];

    // Filter by partner
    if (partnerId) {
      filteredCommissions = filteredCommissions.filter(c => c.partnerId === partnerId);
    }

    // Filter by status
    if (status) {
      filteredCommissions = filteredCommissions.filter(c => c.status === status);
    }

    // Filter by date range
    if (startDate) {
      const start = new Date(startDate);
      filteredCommissions = filteredCommissions.filter(c => new Date(c.submittedDate) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      filteredCommissions = filteredCommissions.filter(c => new Date(c.submittedDate) <= end);
    }

    // Calculate summary statistics
    const totalCommissions = filteredCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);
    const paidCommissions = filteredCommissions
      .filter(c => c.status === 'paid')
      .reduce((sum, c) => sum + c.commissionAmount, 0);
    const pendingCommissions = filteredCommissions
      .filter(c => c.status === 'pending')
      .reduce((sum, c) => sum + c.commissionAmount, 0);
    const earnedCommissions = filteredCommissions
      .filter(c => c.status === 'earned')
      .reduce((sum, c) => sum + c.commissionAmount, 0);

    const totalRenewalCommissions = filteredCommissions
      .filter(c => c.renewalCommission)
      .reduce((sum, c) => sum + (c.renewalCommission || 0), 0);

    // Partner breakdown
    const partnerBreakdown = {
      tivly: {
        name: 'Tivly Affiliate Program',
        commissions: filteredCommissions.filter(c => c.partnerId === 'tivly'),
        total: filteredCommissions
          .filter(c => c.partnerId === 'tivly')
          .reduce((sum, c) => sum + c.commissionAmount, 0),
        count: filteredCommissions.filter(c => c.partnerId === 'tivly').length
      },
      covered: {
        name: 'Covered Embedded Insurance',
        commissions: filteredCommissions.filter(c => c.partnerId === 'covered'),
        total: filteredCommissions
          .filter(c => c.partnerId === 'covered')
          .reduce((sum, c) => sum + c.commissionAmount, 0),
        count: filteredCommissions.filter(c => c.partnerId === 'covered').length
      },
      insurify: {
        name: 'Insurify Partnership',
        commissions: filteredCommissions.filter(c => c.partnerId === 'insurify'),
        total: filteredCommissions
          .filter(c => c.partnerId === 'insurify')
          .reduce((sum, c) => sum + c.commissionAmount, 0),
        count: filteredCommissions.filter(c => c.partnerId === 'insurify').length
      }
    };

    return NextResponse.json({
      success: true,
      data: {
        commissions: filteredCommissions,
        summary: {
          totalCommissions,
          paidCommissions,
          earnedCommissions,
          pendingCommissions,
          totalRenewalCommissions,
          totalCount: filteredCommissions.length,
          conversionRate: filteredCommissions.length > 0 ? 
            Math.round((filteredCommissions.filter(c => c.status !== 'pending').length / filteredCommissions.length) * 100) : 0,
          averageCommission: filteredCommissions.length > 0 ? 
            Math.round(totalCommissions / filteredCommissions.length) : 0
        },
        partnerBreakdown,
        monthlyTrend: generateMonthlyTrend(filteredCommissions),
        topPerformers: getTopPerformers(filteredCommissions)
      }
    });

  } catch (error) {
    console.error('Commission tracking error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve commission data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Record a new commission (webhook endpoint for partners)
export async function POST(request: NextRequest) {
  try {
    const commissionData: Partial<CommissionData> = await request.json();

    // Validate required fields
    const requiredFields = ['partnerId', 'leadId', 'companyName', 'commissionAmount', 'status'];
    const missingFields = requiredFields.filter(field => !commissionData[field as keyof CommissionData]);

    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    // In production, this would save to database
    console.log('New commission recorded:', commissionData);

    // Generate commission ID
    const commissionId = `COMM-${Date.now()}`;

    return NextResponse.json({
      success: true,
      commissionId,
      message: 'Commission recorded successfully',
      data: {
        ...commissionData,
        id: commissionId,
        recordedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Commission recording error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to record commission',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Generate monthly trend data
function generateMonthlyTrend(commissions: CommissionData[]) {
  const monthlyData: { [key: string]: { earned: number, count: number } } = {};

  commissions.forEach(commission => {
    const date = new Date(commission.earnedDate || commission.submittedDate);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { earned: 0, count: 0 };
    }

    if (commission.status !== 'pending') {
      monthlyData[monthKey].earned += commission.commissionAmount;
      monthlyData[monthKey].count += 1;
    }
  });

  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month,
      earned: data.earned,
      count: data.count
    }));
}

// Get top performing companies/policies
function getTopPerformers(commissions: CommissionData[]) {
  const performers = commissions
    .filter(c => c.status !== 'pending')
    .sort((a, b) => b.commissionAmount - a.commissionAmount)
    .slice(0, 5)
    .map(c => ({
      companyName: c.companyName,
      commissionAmount: c.commissionAmount,
      policyType: c.policyType,
      partner: c.partnerName,
      earnedDate: c.earnedDate
    }));

  return performers;
}