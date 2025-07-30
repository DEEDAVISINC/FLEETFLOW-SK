import { NextRequest, NextResponse } from 'next/server'
import { freightQuotingEngine, FreightQuoteRequest } from '../../services/FreightQuotingEngine'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'generate_quote':
        const quote = await freightQuotingEngine.generateQuote(data)
        return NextResponse.json(quote)

      case 'get_history':
        const history = await freightQuotingEngine.getQuoteHistory(data)
        return NextResponse.json(history)

      case 'get_analytics':
        const analytics = await freightQuotingEngine.getPricingAnalytics()
        return NextResponse.json(analytics)

      case 'get_pricing_rules':
        const rules = await freightQuotingEngine.getPricingRules()
        return NextResponse.json(rules)

      case 'create_pricing_rule':
        const newRule = await freightQuotingEngine.createPricingRule(data)
        return NextResponse.json(newRule)

      case 'update_pricing_rule':
        const success = await freightQuotingEngine.updatePricingRuleById(data.id, data.updates)
        return NextResponse.json({ success })

      case 'delete_pricing_rule':
        const deleted = await freightQuotingEngine.deletePricingRule(data.id)
        return NextResponse.json({ success: deleted })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Freight quote API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    switch (action) {
      case 'history':
        const filters = {
          dateRange: searchParams.get('dateRange') ? JSON.parse(searchParams.get('dateRange')!) : undefined,
          customer: searchParams.get('customer') || undefined,
          lane: searchParams.get('lane') || undefined,
          type: searchParams.get('type') || undefined
        }
        
        const history = await freightQuotingEngine.getQuoteHistory(filters)
        return NextResponse.json({ success: true, history })
        
      case 'analytics':
        const analytics = await freightQuotingEngine.getPricingAnalytics()
        return NextResponse.json({ success: true, analytics })
        
      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        )
    }
    
  } catch (error) {
    console.error('Freight quote API error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    switch (action) {
      case 'update-market-rates':
        const { rates } = await request.json()
        await freightQuotingEngine.updateMarketRates(rates)
        return NextResponse.json({ success: true, message: 'Market rates updated' })
        
      case 'update-pricing-rule':
        const { rule } = await request.json()
        await freightQuotingEngine.updatePricingRule(rule)
        return NextResponse.json({ success: true, message: 'Pricing rule updated' })
        
      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        )
    }
    
  } catch (error) {
    console.error('Freight quote update error:', error)
    return NextResponse.json(
      { error: 'Failed to update data' },
      { status: 500 }
    )
  }
} 