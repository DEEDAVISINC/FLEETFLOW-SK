import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const leads = {
      sources: [
        {
          id: 'gov_contracts',
          name: 'Government Contracts (SAM.gov)',
          leads: 15,
          conversion: 33,
          revenue: 1237500,
          status: 'active'
        },
        {
          id: 'freight_marketplace',
          name: 'Freight Marketplace (DAT/Loadboards)',
          leads: 42,
          conversion: 28,
          revenue: 529200,
          status: 'active'
        },
        {
          id: 'rfx_intelligence',
          name: 'RFx Intelligence (FreightFlow)',
          leads: 23,
          conversion: 22,
          revenue: 430100,
          status: 'active'
        },
        {
          id: 'web_inquiries',
          name: 'Web Inquiries',
          leads: 67,
          conversion: 15,
          revenue: 251250,
          status: 'active'
        },
        {
          id: 'partner_referrals',
          name: 'Partner Referrals',
          leads: 31,
          conversion: 19,
          revenue: 206150,
          status: 'active'
        }
      ],
      totalLeads: 178,
      totalRevenue: 2654200,
      avgConversion: 23.4
    };
    
    return NextResponse.json({
      success: true,
      data: leads
    });
  } catch (error) {
    console.error('FreeSWITCH leads error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get FreeSWITCH leads'
    }, { status: 500 });
  }
} 