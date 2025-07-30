import { NextRequest, NextResponse } from 'next/server'
import { freeBusinessIntelligence } from '../../../services/FreeBusinessIntelligenceService'
import { aiFreightDispatch } from '../../../services/AIFreightDispatchService'

export async function POST(request: NextRequest) {
  try {
    const { action, payload } = await request.json()

    switch (action) {
      case 'voice_processing':
        return await handleVoiceProcessing(payload)
      
      case 'load_matching':
        return await handleLoadMatching(payload)
      
      case 'carrier_matching':
        return await handleCarrierMatching(payload)
      
      case 'market_analysis':
        return await handleMarketAnalysis(payload)
      
      case 'rate_negotiation':
        return await handleRateNegotiation(payload)
      
      case 'lead_discovery':
        return await handleLeadDiscovery(payload)
      
      case 'business_intelligence':
        return await handleBusinessIntelligence(payload)
      
      case 'optimization':
        return await handleOptimization(payload)
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('AI Dispatch API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handleVoiceProcessing(payload: any) {
  try {
    // Simulate voice processing
    const audioBlob = new Blob([payload.audioData], { type: 'audio/wav' })
    const interaction = await aiFreightDispatch.processVoiceInquiry(audioBlob)
    
    return NextResponse.json({
      success: true,
      data: {
        interaction,
        conversationHistory: aiFreightDispatch.getConversationHistory()
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Voice processing failed' }, { status: 500 })
  }
}

async function handleLoadMatching(payload: any) {
  try {
    const { origin, destination, equipmentType, weight, commodity, pickupDate, targetMargin } = payload
    
    const loadOpportunities = await aiFreightDispatch.intelligentLoadMatching({
      origin,
      destination,
      equipmentType,
      weight,
      commodity,
      pickupDate,
      targetMargin
    })
    
    return NextResponse.json({
      success: true,
      data: {
        loadOpportunities,
        totalOpportunities: loadOpportunities.length,
        averageMargin: loadOpportunities.reduce((sum, load) => sum + load.estimatedMargin, 0) / loadOpportunities.length
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Load matching failed' }, { status: 500 })
  }
}

async function handleCarrierMatching(payload: any) {
  try {
    const { loadId } = payload
    
    const carrierMatches = await aiFreightDispatch.findOptimalCarriers(loadId)
    
    return NextResponse.json({
      success: true,
      data: {
        carrierMatches,
        totalMatches: carrierMatches.length,
        bestMatch: carrierMatches[0] || null
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Carrier matching failed' }, { status: 500 })
  }
}

async function handleMarketAnalysis(payload: any) {
  try {
    const { origin, destination } = payload
    
    const marketPrediction = await aiFreightDispatch.getMarketAnalysis(origin, destination)
    
    // Get additional market intelligence
    const economicIndicators = await freeBusinessIntelligence.getEconomicIndicators()
    const transportationTrends = await freeBusinessIntelligence.getTransportationTrends()
    
    return NextResponse.json({
      success: true,
      data: {
        marketPrediction,
        economicIndicators,
        transportationTrends,
        recommendations: generateMarketRecommendations(marketPrediction, economicIndicators)
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Market analysis failed' }, { status: 500 })
  }
}

async function handleRateNegotiation(payload: any) {
  try {
    const { loadId, carrierId, initialRate } = payload
    
    const negotiationResult = await aiFreightDispatch.negotiateFreightRate(loadId, carrierId, initialRate)
    
    return NextResponse.json({
      success: true,
      data: {
        negotiationResult,
        savings: initialRate - negotiationResult.finalRate,
        successRate: negotiationResult.success ? 100 : 0
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Rate negotiation failed' }, { status: 500 })
  }
}

async function handleLeadDiscovery(payload: any) {
  try {
    const { industry, location, limit = 20 } = payload
    
    // Discover companies using multiple FREE APIs
    const [
      manufacturingCompanies,
      publicCompanies,
      exportOpportunities
    ] = await Promise.all([
      freeBusinessIntelligence.discoverManufacturingCompanies(industry, location),
      freeBusinessIntelligence.getPublicCompanyIntelligence(),
      freeBusinessIntelligence.getExportOpportunities()
    ])
    
    // Combine and rank leads
    const allLeads = [
      ...manufacturingCompanies.slice(0, limit / 3),
      ...publicCompanies.slice(0, limit / 3),
      ...exportOpportunities.slice(0, limit / 3)
    ]
    
    // Sort by lead score
    const rankedLeads = allLeads.sort((a, b) => (b.leadScore || 0) - (a.leadScore || 0))
    
    return NextResponse.json({
      success: true,
      data: {
        leads: rankedLeads,
        totalLeads: rankedLeads.length,
        averageLeadScore: rankedLeads.reduce((sum, lead) => sum + (lead.leadScore || 0), 0) / rankedLeads.length,
        sources: {
          manufacturing: manufacturingCompanies.length,
          publicCompanies: publicCompanies.length,
          exports: exportOpportunities.length
        }
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Lead discovery failed' }, { status: 500 })
  }
}

async function handleBusinessIntelligence(payload: any) {
  try {
    const { naicsCode, state, industryCode } = payload
    
    const [
      industryStats,
      employmentTrends,
      economicIndicators
    ] = await Promise.all([
      freeBusinessIntelligence.getIndustryStatistics(naicsCode, state),
      freeBusinessIntelligence.getEmploymentTrends(industryCode),
      freeBusinessIntelligence.getEconomicIndicators()
    ])
    
    return NextResponse.json({
      success: true,
      data: {
        industryStats,
        employmentTrends,
        economicIndicators,
        marketOpportunities: generateMarketOpportunities(industryStats, employmentTrends, economicIndicators)
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Business intelligence failed' }, { status: 500 })
  }
}

async function handleOptimization(payload: any) {
  try {
    const { loads } = payload
    
    const optimizationResult = await aiFreightDispatch.optimizeLoadCombination(loads)
    
    return NextResponse.json({
      success: true,
      data: {
        optimizationResult,
        improvementPercentage: calculateImprovement(loads, optimizationResult.optimizedLoads),
        costSavings: calculateCostSavings(loads, optimizationResult.optimizedLoads)
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Optimization failed' }, { status: 500 })
  }
}

// Helper functions
function generateMarketRecommendations(marketPrediction: any, economicIndicators: any) {
  const recommendations = []
  
  if (marketPrediction.confidence > 85) {
    recommendations.push('High confidence market conditions - Execute immediately')
  }
  
  if (economicIndicators.fuelPrices > 4.0) {
    recommendations.push('High fuel costs - Consider fuel surcharges')
  }
  
  if (economicIndicators.shippingDemand > 1000) {
    recommendations.push('High shipping demand - Premium pricing opportunity')
  }
  
  return recommendations
}

function generateMarketOpportunities(industryStats: any, employmentTrends: any, economicIndicators: any) {
  const opportunities = []
  
  if (industryStats.industryTrends.growth > 5) {
    opportunities.push({
      type: 'growth_opportunity',
      description: 'Industry showing strong growth - Expand services',
      priority: 'high'
    })
  }
  
  if (employmentTrends.laborAvailability === 'high') {
    opportunities.push({
      type: 'capacity_opportunity',
      description: 'High labor availability - Scale operations',
      priority: 'medium'
    })
  }
  
  if (economicIndicators.economicGrowth > 3) {
    opportunities.push({
      type: 'market_opportunity',
      description: 'Strong economic growth - Invest in expansion',
      priority: 'high'
    })
  }
  
  return opportunities
}

function calculateImprovement(originalLoads: any[], optimizedLoads: any[]) {
  const originalTotal = originalLoads.reduce((sum, load) => sum + (load.estimatedMargin || 0), 0)
  const optimizedTotal = optimizedLoads.reduce((sum, load) => sum + (load.estimatedMargin || 0), 0)
  
  return originalTotal > 0 ? ((optimizedTotal - originalTotal) / originalTotal) * 100 : 0
}

function calculateCostSavings(originalLoads: any[], optimizedLoads: any[]) {
  const originalCosts = originalLoads.reduce((sum, load) => sum + (load.estimatedCarrierRate || 0), 0)
  const optimizedCosts = optimizedLoads.reduce((sum, load) => sum + (load.estimatedCarrierRate || 0), 0)
  
  return originalCosts - optimizedCosts
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    switch (action) {
      case 'status':
        return NextResponse.json({
          success: true,
          data: {
            status: 'active',
            services: {
              voiceProcessing: 'active',
              loadMatching: 'active',
              carrierMatching: 'active',
              marketAnalysis: 'active',
              businessIntelligence: 'active',
              optimization: 'active'
            },
            apiEndpoints: {
              freeApis: 8,
              activeConnections: 8,
              totalCost: 0
            }
          }
        })
      
      case 'history':
        return NextResponse.json({
          success: true,
          data: {
            conversationHistory: aiFreightDispatch.getConversationHistory(),
            activeLoads: aiFreightDispatch.getActiveLoads(),
            carrierNetwork: aiFreightDispatch.getCarrierNetwork(),
            marketPredictions: aiFreightDispatch.getMarketPredictions()
          }
        })
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('AI Dispatch GET API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 