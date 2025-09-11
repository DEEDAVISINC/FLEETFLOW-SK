import { RFxResponseService } from '@/app/services/RFxResponseService';

export async function POST(request: Request) {
  try {
    const searchParams = await request.json();

    // Use the warehousing-specific search method
    const rfxService = new RFxResponseService();
    const opportunities = await rfxService.searchRFxOpportunities({
      ...searchParams,
      platforms: ['warehousing'], // Warehousing platform only
    });

    return Response.json(opportunities);
  } catch (error) {
    console.error('Warehousing RFP search error:', error);

    // Return empty array - no mock data
    return Response.json([]);
  }
}
