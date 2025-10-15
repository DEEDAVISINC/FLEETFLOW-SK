import { SAMGovOpportunityMonitor } from '@/app/services/SAMGovOpportunityMonitor';
import { NextRequest, NextResponse } from 'next/server';

interface SAMOpportunity {
  id: string;
  title: string;
  agency: string;
  description: string;
  responseDeadline: string;
  postedDate: string;
  amount?: string;
  location: string;
  naicsCode?: string;
  solicitationNumber: string;
  url: string;
}

export async function POST(request: NextRequest) {
  try {
    const { keywords = 'transportation freight logistics', limit = 20 } =
      await request.json();

    console.info(`🔍 Searching SAM.gov for: "${keywords}"`);

    // Use the real SAM.gov API integration
    const monitor = new SAMGovOpportunityMonitor({
      keywords: keywords.split(' '),
      enabled: true,
    });

    const result = await monitor.checkForNewOpportunities();

    // Convert to the expected format - NO MOCK DATA FALLBACK
    const opportunities: SAMOpportunity[] = result.newOpportunities.map(
      (opp) => ({
        id: opp.id,
        title: opp.title,
        agency: opp.agency,
        description: opp.description,
        responseDeadline: opp.responseDeadline,
        postedDate: opp.postedDate,
        amount: opp.amount,
        location: opp.location || 'Various Locations',
        naicsCode: opp.naicsCode,
        solicitationNumber: opp.solicitationNumber,
        url: opp.url,
      })
    );

    // Limit results
    const filteredOpportunities = opportunities.slice(0, limit);

    console.info(
      `✅ Found ${filteredOpportunities.length} SAM.gov opportunities (REAL DATA ONLY - NO MOCK)`
    );

    return NextResponse.json(filteredOpportunities);
  } catch (error) {
    console.error('SAM.gov search error:', error);
    return NextResponse.json(
      { error: 'SAM.gov search temporarily unavailable' },
      { status: 503 }
    );
  }
}
