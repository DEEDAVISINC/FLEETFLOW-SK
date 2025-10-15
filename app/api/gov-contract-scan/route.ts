import { NextRequest, NextResponse } from 'next/server';
import { ContractExpirationForecaster } from '../../services/ContractExpirationForecaster';
import { FederalLRAFScanner } from '../../services/FederalLRAFScanner';
import USAspendingService from '../../services/USAspendingService';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // Increased for comprehensive forecasting

/**
 * POST /api/gov-contract-scan
 * GENERATE REAL GOVERNMENT CONTRACT FORECASTS (3-24 months future)
 *
 * Data Sources:
 * 1. Federal Agency Long Range Acquisition Forecasts (LRAFs)
 * 2. Contract expiration analysis (USASpending.gov)
 * 3. Historical patterns and AI prediction
 */
export async function POST(request: NextRequest) {
  try {
    console.log(
      '🔮 Government Contract Forecasting - Generating predictions...'
    );

    const { scanType = 'comprehensive', monthsAhead = 12 } = await request
      .json()
      .catch(() => ({}));

    // 1. Scan Federal Agency LRAFs for official forecasts
    console.log(
      '📋 Step 1: Scanning Federal Agency Long Range Acquisition Forecasts...'
    );
    const lrafScanner = new FederalLRAFScanner();
    const lrafResults = await lrafScanner.scanAllLRAFs();

    console.log(
      `✅ LRAF Scan: ${lrafResults.totalForecasts} forecasts from ${lrafResults.sourcesScanned} agencies`
    );

    // 2. Analyze expiring contracts for re-compete opportunities
    console.log(
      '📊 Step 2: Analyzing contract expirations for re-compete forecasts...'
    );
    const expirationForecaster = new ContractExpirationForecaster();
    const expirationAnalysis =
      await expirationForecaster.forecastRecompetes(monthsAhead);

    console.log(
      `✅ Contract Expiration Analysis: ${expirationAnalysis.expiringContracts.length} re-compete opportunities`
    );

    // 3. Get historical intelligence for context
    console.log(
      '📊 Step 3: Fetching historical intelligence from USAspending.gov...'
    );
    let competitorIntelligence = null;
    let marketIntelligence = null;

    try {
      [competitorIntelligence, marketIntelligence] = await Promise.all([
        USAspendingService.getCompetitorAnalysis(),
        USAspendingService.getMarketIntelligence(),
      ]);
      console.log('✅ Historical intelligence added');
    } catch (error) {
      console.warn('⚠️ USAspending.gov fetch failed (non-critical):', error);
    }

    // Combine all forecasted opportunities
    const allForecasts: any[] = [
      ...lrafResults.forecasts.map((f) => ({
        ...f,
        forecastSource: 'LRAF',
        predictedPostDate: f.predictedPostDate,
      })),
      ...expirationAnalysis.expiringContracts.map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        agency: c.agency,
        estimatedValue: c.currentValue,
        predictedPostDate: c.predictedRecompeteDate,
        wosbEligible: c.wosbEligible,
        setAsideType: c.setAsideType,
        naicsCode: c.naicsCode,
        forecastSource: 'Contract Expiration',
        recompeteProbability: c.recompeteProbability,
        forecastConfidence: c.forecastConfidence,
        currentContractor: c.currentContractor,
        contractEndDate: c.endDate,
      })),
    ];

    // Sort by predicted post date
    allForecasts.sort(
      (a, b) =>
        new Date(a.predictedPostDate).getTime() -
        new Date(b.predictedPostDate).getTime()
    );

    console.log(`📊 Total forecasted opportunities: ${allForecasts.length}`);

    // Calculate metrics
    const totalPredictedValue = allForecasts.reduce(
      (sum, f) => sum + (f.estimatedValue || 0),
      0
    );
    const wosbOpportunities = allForecasts.filter((f) => f.wosbEligible).length;
    const highConfidenceForecasts = allForecasts.filter(
      (f) => f.forecastConfidence === 'high'
    ).length;

    // Generate quarterly breakdown
    const quarters = generateQuarterlyBreakdown(allForecasts, monthsAhead);

    return NextResponse.json({
      success: true,
      dataSource: 'PREDICTIVE FORECASTING (LRAFs + Contract Expirations)',
      forecastedAt: new Date().toISOString(),
      forecastPeriod: `Next ${monthsAhead} months`,
      scanType,
      sources: {
        lraf: {
          agenciesScanned: lrafResults.sourcesScanned,
          forecastsFound: lrafResults.totalForecasts,
        },
        contractExpirations: {
          analyzed: expirationAnalysis.expiringContracts.length,
          totalValue: expirationAnalysis.totalValue,
        },
        historicalIntelligence: competitorIntelligence
          ? 'available'
          : 'unavailable',
      },
      forecast: {
        periods: quarters,
        opportunityForecasts: allForecasts,
        summary: {
          totalPredictedValue,
          wosbOpportunities,
          highConfidenceForecasts,
          strategicRecommendations: [
            `${allForecasts.length} opportunities forecasted over next ${monthsAhead} months`,
            `${wosbOpportunities} WOSB-eligible opportunities identified`,
            `${highConfidenceForecasts} high-confidence forecasts requiring immediate attention`,
            'Begin relationship-building with agency contacts NOW',
            'Prepare capability statements and past performance documentation',
          ],
        },
      },
      metadata: {
        totalPredictedValue,
        wosbOpportunities,
        highConfidenceForecasts,
        dataType: 'PREDICTIVE_FORECAST',
        tenant: 'DEE DAVIS INC/DEPOINTE',
        certification: 'WOSB',
        forecastCount: allForecasts.length,
        lrafSources: lrafResults.sourcesScanned,
        expirationAnalysis: expirationAnalysis.expiringContracts.length,
        competitorIntelligence: competitorIntelligence || null,
        marketIntelligence: marketIntelligence || null,
      },
    });
  } catch (error: any) {
    console.error('❌ Error generating forecasts:', error);

    // Return partial success with error details
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to generate forecasts',
      dataType: 'FORECAST_DATA',
      opportunityForecasts: [],
      spendingForecasts: [],
      marketForecasts: [],
      summary: {
        totalPredictedValue: 0,
        wosbOpportunities: 0,
        highProbabilityWins: 0,
        strategicRecommendations: [
          '⚠️ Database table missing. Run CREATE_GOV_CONTRACT_FORECASTS_TABLE.sql in Supabase',
          '🔄 Refresh page after creating table to see real LRAF data',
        ],
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        scanType: 'error_fallback',
        agenciesScanned: 0,
        error: error.message,
      },
    });
  }
}

/**
 * Generate quarterly breakdown of forecasts
 */
function generateQuarterlyBreakdown(forecasts: any[], monthsAhead: number) {
  const quarters: any[] = [];
  const today = new Date();

  for (let i = 0; i < Math.ceil(monthsAhead / 3); i++) {
    const quarterStart = new Date(today);
    quarterStart.setMonth(quarterStart.getMonth() + i * 3);

    const quarterEnd = new Date(quarterStart);
    quarterEnd.setMonth(quarterEnd.getMonth() + 3);

    const quarterForecasts = forecasts.filter((f) => {
      const postDate = new Date(f.predictedPostDate);
      return postDate >= quarterStart && postDate < quarterEnd;
    });

    const quarterValue = quarterForecasts.reduce(
      (sum, f) => sum + (f.estimatedValue || 0),
      0
    );

    quarters.push({
      quarter: `Q${(quarterStart.getMonth() / 3 + 1) % 4 || 4}`,
      year: quarterStart.getFullYear(),
      startDate: quarterStart.toISOString().split('T')[0],
      endDate: quarterEnd.toISOString().split('T')[0],
      forecastCount: quarterForecasts.length,
      totalValue: quarterValue,
      wosbCount: quarterForecasts.filter((f) => f.wosbEligible).length,
    });
  }

  return quarters;
}

/**
 * GET /api/gov-contract-scan
 * Get latest opportunities from Supabase database
 */
export async function GET(request: NextRequest) {
  try {
    console.log('📈 Government Contract Scanner - Fetching from database');

    // For GET, we'll trigger a quick scan
    const mockRequest = new Request(request.url, {
      method: 'POST',
      body: JSON.stringify({ scanType: 'critical' }),
      headers: { 'Content-Type': 'application/json' },
    });

    return await POST(mockRequest as NextRequest);
  } catch (error: any) {
    console.error('Error in GET /api/gov-contract-scan:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
