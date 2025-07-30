/**
 * Freight Quoting API Endpoints
 * RESTful API for AI-powered freight quoting with market intelligence
 */

import { NextRequest, NextResponse } from 'next/server';
import { freightQuotingEngine, QuoteRequest } from '../../services/FreightQuotingEngine';
import { marketRateService } from '../../services/MarketRateService';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    console.log(`🚀 Freight Quoting API - Action: ${action}`);

    switch (action) {
      case 'generate_quote':
        return await handleGenerateQuote(data);
      
      case 'get_market_intelligence':
        return await handleMarketIntelligence(data);
      
      case 'analyze_competition':
        return await handleCompetitiveAnalysis(data);
      
      case 'get_quote_history':
        return await handleQuoteHistory(data);
      
      case 'monitor_rates':
        return await handleRateMonitoring(data);
      
      case 'get_market_trends':
        return await handleMarketTrends(data);
      
      case 'bulk_quote':
        return await handleBulkQuote(data);
      
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action specified'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Freight Quoting API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const equipmentType = searchParams.get('equipmentType') || 'Dry Van';

    switch (action) {
      case 'market_rates':
        if (!origin || !destination) {
          return NextResponse.json({
            success: false,
            error: 'Origin and destination are required'
          }, { status: 400 });
        }
        
        const rates = await marketRateService.getMarketRates(origin, destination, equipmentType);
        return NextResponse.json({
          success: true,
          data: rates
        });

      case 'competitors':
        if (!origin || !destination) {
          return NextResponse.json({
            success: false,
            error: 'Origin and destination are required'
          }, { status: 400 });
        }
        
        const competitors = await marketRateService.getCompetitorIntelligence(origin, destination, equipmentType);
        return NextResponse.json({
          success: true,
          data: competitors
        });

      case 'market_report':
        if (!origin || !destination) {
          return NextResponse.json({
            success: false,
            error: 'Origin and destination are required'
          }, { status: 400 });
        }
        
        const report = await marketRateService.getMarketIntelligenceReport(origin, destination, equipmentType);
        return NextResponse.json({
          success: true,
          data: report
        });

      case 'quote_history':
        const lane = searchParams.get('lane');
        const history = freightQuotingEngine.getQuoteHistory(lane || undefined);
        return NextResponse.json({
          success: true,
          data: history
        });

      case 'health':
        return NextResponse.json({
          success: true,
          service: 'Freight Quoting Engine',
          status: 'operational',
          version: '2.0.0',
          features: [
            'AI-powered pricing',
            'Real-time market intelligence',
            'Competitive analysis',
            'Win probability scoring',
            'Market trend forecasting'
          ],
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action specified'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Freight Quoting API GET Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * Generate AI-powered freight quote
 */
async function handleGenerateQuote(data: any) {
  try {
    const {
      type,
      origin,
      destination,
      weight,
      pallets,
      freightClass,
      equipmentType,
      serviceType,
      distance,
      pickupDate,
      deliveryDate,
      urgency = 'standard',
      customerTier = 'bronze',
      specialRequirements = [],
      hazmat = false,
      temperature = 'ambient'
    } = data;

    // Validate required fields
    if (!type || !origin || !destination || !distance || !pickupDate || !deliveryDate) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: type, origin, destination, distance, pickupDate, deliveryDate'
      }, { status: 400 });
    }

    const quoteRequest: QuoteRequest = {
      id: `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      origin,
      destination,
      weight,
      pallets,
      freightClass,
      equipmentType,
      serviceType,
      distance,
      pickupDate,
      deliveryDate,
      urgency,
      customerTier,
      specialRequirements,
      hazmat,
      temperature
    };

    console.log(`💰 Generating AI quote for ${type} shipment: ${origin} → ${destination}`);
    
    const quote = await freightQuotingEngine.generateQuote(quoteRequest);
    
    return NextResponse.json({
      success: true,
      data: quote,
      message: 'Quote generated successfully'
    });

  } catch (error) {
    console.error('Quote generation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate quote',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * Get market intelligence report
 */
async function handleMarketIntelligence(data: any) {
  try {
    const { origin, destination, equipmentType = 'Dry Van' } = data;

    if (!origin || !destination) {
      return NextResponse.json({
        success: false,
        error: 'Origin and destination are required'
      }, { status: 400 });
    }

    console.log(`📊 Generating market intelligence for ${origin} → ${destination}`);
    
    const intelligence = await marketRateService.getMarketIntelligenceReport(origin, destination, equipmentType);
    
    return NextResponse.json({
      success: true,
      data: intelligence,
      message: 'Market intelligence retrieved successfully'
    });

  } catch (error) {
    console.error('Market intelligence error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve market intelligence',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * Analyze competitive landscape
 */
async function handleCompetitiveAnalysis(data: any) {
  try {
    const { origin, destination, type = 'FTL' } = data;

    if (!origin || !destination) {
      return NextResponse.json({
        success: false,
        error: 'Origin and destination are required'
      }, { status: 400 });
    }

    console.log(`🎯 Analyzing competition for ${origin} → ${destination}`);
    
    const analysis = await freightQuotingEngine.getCompetitiveAnalysis(origin, destination, type);
    
    return NextResponse.json({
      success: true,
      data: analysis,
      message: 'Competitive analysis completed successfully'
    });

  } catch (error) {
    console.error('Competitive analysis error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to analyze competition',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * Get quote history and analytics
 */
async function handleQuoteHistory(data: any) {
  try {
    const { lane, limit = 50, offset = 0 } = data;

    console.log(`📋 Retrieving quote history ${lane ? `for lane: ${lane}` : '(all lanes)'}`);
    
    const history = freightQuotingEngine.getQuoteHistory(lane);
    
    // Apply pagination
    const paginatedHistory = history.slice(offset, offset + limit);
    
    // Calculate analytics
    const analytics = {
      totalQuotes: history.length,
      averageQuote: history.reduce((sum, q) => sum + q.totalQuote, 0) / history.length || 0,
      averageWinProbability: history.reduce((sum, q) => sum + q.winProbability, 0) / history.length || 0,
      averageProfitMargin: history.reduce((sum, q) => sum + q.profitMargin, 0) / history.length || 0,
      quoteTypes: history.reduce((acc, q) => {
        acc[q.quoteId.includes('LTL') ? 'LTL' : q.quoteId.includes('FTL') ? 'FTL' : 'Specialized'] = 
          (acc[q.quoteId.includes('LTL') ? 'LTL' : q.quoteId.includes('FTL') ? 'FTL' : 'Specialized'] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number })
    };
    
    return NextResponse.json({
      success: true,
      data: {
        quotes: paginatedHistory,
        analytics,
        pagination: {
          total: history.length,
          limit,
          offset,
          hasMore: offset + limit < history.length
        }
      },
      message: 'Quote history retrieved successfully'
    });

  } catch (error) {
    console.error('Quote history error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve quote history',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * Monitor rates for multiple lanes
 */
async function handleRateMonitoring(data: any) {
  try {
    const { lanes, thresholds } = data;

    if (!lanes || !Array.isArray(lanes) || lanes.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Lanes array is required'
      }, { status: 400 });
    }

    console.log(`🔔 Monitoring rates for ${lanes.length} lanes`);
    
    const defaultThresholds = {
      minRate: 1500,
      maxRate: 5000,
      volatilityThreshold: 0.2,
      ...thresholds
    };
    
    const alerts = await marketRateService.monitorRates(lanes, defaultThresholds);
    
    return NextResponse.json({
      success: true,
      data: {
        alerts,
        monitoredLanes: lanes.length,
        alertCount: alerts.length,
        timestamp: new Date().toISOString()
      },
      message: 'Rate monitoring completed successfully'
    });

  } catch (error) {
    console.error('Rate monitoring error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to monitor rates',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * Get market trends and forecasting
 */
async function handleMarketTrends(data: any) {
  try {
    const { origin, destination, equipmentType = 'Dry Van', timeframe = '30d' } = data;

    if (!origin || !destination) {
      return NextResponse.json({
        success: false,
        error: 'Origin and destination are required'
      }, { status: 400 });
    }

    console.log(`📈 Analyzing market trends for ${origin} → ${destination}`);
    
    const trends = await marketRateService.getMarketTrends(origin, destination, equipmentType, timeframe);
    
    return NextResponse.json({
      success: true,
      data: trends,
      message: 'Market trends retrieved successfully'
    });

  } catch (error) {
    console.error('Market trends error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve market trends',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * Generate multiple quotes in bulk
 */
async function handleBulkQuote(data: any) {
  try {
    const { requests } = data;

    if (!requests || !Array.isArray(requests) || requests.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Requests array is required'
      }, { status: 400 });
    }

    if (requests.length > 50) {
      return NextResponse.json({
        success: false,
        error: 'Maximum 50 quotes per bulk request'
      }, { status: 400 });
    }

    console.log(`📦 Processing bulk quote request for ${requests.length} shipments`);
    
    const quotes = await Promise.all(
      requests.map(async (request: any, index: number) => {
        try {
          const quoteRequest: QuoteRequest = {
            id: `BULK-${Date.now()}-${index}`,
            ...request,
            urgency: request.urgency || 'standard',
            customerTier: request.customerTier || 'bronze',
            specialRequirements: request.specialRequirements || [],
            hazmat: request.hazmat || false,
            temperature: request.temperature || 'ambient'
          };

          const quote = await freightQuotingEngine.generateQuote(quoteRequest);
          return {
            success: true,
            quote,
            originalRequest: request
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            originalRequest: request
          };
        }
      })
    );

    const successful = quotes.filter(q => q.success);
    const failed = quotes.filter(q => !q.success);

    return NextResponse.json({
      success: true,
      data: {
        quotes: successful.map(q => q.quote),
        summary: {
          total: requests.length,
          successful: successful.length,
          failed: failed.length,
          successRate: (successful.length / requests.length) * 100
        },
        errors: failed.map(f => ({ request: f.originalRequest, error: f.error }))
      },
      message: `Bulk quote completed: ${successful.length}/${requests.length} successful`
    });

  } catch (error) {
    console.error('Bulk quote error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process bulk quotes',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  return NextResponse.json({
    success: false,
    error: 'PUT method not supported'
  }, { status: 405 });
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({
    success: false,
    error: 'DELETE method not supported'
  }, { status: 405 });
}