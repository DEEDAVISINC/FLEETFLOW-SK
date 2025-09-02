import { NextRequest, NextResponse } from 'next/server';
import {
  AdvancedAirMaritimeQuotingEngine,
  AirMaritimeQuoteRequest,
} from '../../services/AdvancedAirMaritimeQuotingEngine';

const quotingEngine = new AdvancedAirMaritimeQuotingEngine();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, quoteRequest } = body;

    console.info(`🎯 Processing ${type} freight quote request`);

    if (!type || !quoteRequest) {
      return NextResponse.json(
        { error: 'Missing required fields: type and quoteRequest' },
        { status: 400 }
      );
    }

    let quotes;

    if (type === 'air') {
      quotes = await quotingEngine.generateAirFreightQuote(
        quoteRequest as AirMaritimeQuoteRequest
      );
    } else if (type === 'maritime') {
      quotes = await quotingEngine.generateMaritimeFreightQuote(
        quoteRequest as AirMaritimeQuoteRequest
      );
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be "air" or "maritime"' },
        { status: 400 }
      );
    }

    console.info(`✅ Generated ${quotes.length} ${type} freight quotes`);

    return NextResponse.json({
      success: true,
      type,
      quotes,
      metadata: {
        quotesGenerated: quotes.length,
        bestQuote: quotes[0], // Highest win probability
        averageRate:
          quotes.reduce((sum, q) => sum + q.totalQuote, 0) / quotes.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('❌ Advanced air/maritime quoting failed:', error);

    return NextResponse.json(
      {
        error: 'Quote generation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Advanced Air & Maritime Freight Quoting Engine',
    version: '1.0.0',
    capabilities: [
      'AI-powered air freight quoting',
      'Maritime container & LCL quoting',
      'Market intelligence integration',
      'Competitive analysis',
      'Dynamic pricing optimization',
      'Win probability calculations',
      'Risk assessment',
      'Multi-carrier comparison',
    ],
    supportedTypes: ['air', 'maritime'],
    supportedModes: {
      air: ['express', 'standard', 'economy', 'charter'],
      maritime: ['container', 'lcl', 'bulk'],
    },
  });
}
