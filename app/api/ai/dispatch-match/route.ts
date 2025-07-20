import { NextRequest, NextResponse } from 'next/server';
import { ClaudeAIService } from '../../../../lib/claude-ai-service';

const claude = process.env.ANTHROPIC_API_KEY ? new ClaudeAIService() : null;

export async function POST(request: NextRequest) {
  try {
    const { load, carriers } = await request.json();

    if (!load || !carriers) {
      return NextResponse.json({
        success: false,
        error: 'Load and carriers data required'
      }, { status: 400 });
    }

    let recommendation;

    if (claude) {
      // Use Claude AI for intelligent matching
      recommendation = await getClaudeAIRecommendation(load, carriers);
    } else {
      // Fallback to rule-based matching
      recommendation = getFallbackRecommendation(load, carriers);
    }

    return NextResponse.json({
      success: true,
      recommendation
    });

  } catch (error) {
    console.error('AI dispatch matching error:', error);
    
    // Always provide fallback recommendation
    const { load, carriers } = await request.json();
    const fallbackRecommendation = getFallbackRecommendation(load, carriers);
    
    return NextResponse.json({
      success: true,
      recommendation: fallbackRecommendation,
      warning: 'AI unavailable, using fallback algorithm'
    });
  }
}

async function getClaudeAIRecommendation(load: any, carriers: any[]) {
  const prompt = `
    You are an expert AI dispatcher with deep knowledge of freight logistics, carrier performance, and dispatch optimization. 
    
    LOAD DETAILS:
    ${JSON.stringify(load, null, 2)}
    
    AVAILABLE CARRIERS:
    ${JSON.stringify(carriers, null, 2)}
    
    ANALYSIS REQUIREMENTS:
    1. Evaluate each carrier against the load requirements
    2. Consider capacity, location, performance history, and specializations
    3. Assess risk factors and potential issues
    4. Calculate compatibility scores (0-100)
    5. Provide clear recommendations with reasoning
    
    RESPONSE FORMAT (JSON):
    {
      "topRecommendations": [
        {
          "carrierId": "string",
          "carrierName": "string",
          "compatibilityScore": number,
          "reasoning": "string",
          "riskLevel": "low|medium|high",
          "estimatedCost": number,
          "advantages": ["string"],
          "concerns": ["string"]
        }
      ],
      "overallAnalysis": {
        "marketConditions": "string",
        "recommendedStrategy": "string",
        "urgencyLevel": "low|medium|high"
      }
    }
    
    Provide precise, actionable recommendations based on data analysis.
  `;

  try {
    const result = await claude!.generateDocument(prompt, 'dispatch_recommendation');
    const recommendation = JSON.parse(result);
    return recommendation;
  } catch (parseError) {
    console.error('Failed to parse Claude AI response:', parseError);
    return getFallbackRecommendation(load, carriers);
  }
}

function getFallbackRecommendation(load: any, carriers: any[]) {
  // Rule-based fallback algorithm
  const scoredCarriers = carriers.map(carrier => {
    let score = 0;
    let reasoning = [];

    // Capacity check (40% weight)
    const capacityRatio = load.weight / (carrier.capacity || 1);
    if (capacityRatio <= 0.95 && capacityRatio >= 0.7) {
      score += 40;
      reasoning.push('optimal capacity utilization');
    } else if (capacityRatio <= 1.0) {
      score += 30;
      reasoning.push('adequate capacity');
    } else {
      score += 0;
      reasoning.push('insufficient capacity');
    }

    // Performance history (30% weight)
    const onTimeScore = (carrier.onTimePercentage || 70) * 0.3;
    score += onTimeScore;
    if (carrier.onTimePercentage > 90) {
      reasoning.push('excellent reliability');
    } else if (carrier.onTimePercentage > 80) {
      reasoning.push('good reliability');
    }

    // Safety rating (20% weight)
    const safetyScore = (carrier.safetyRating || 70) * 0.2;
    score += safetyScore;
    if (carrier.safetyRating > 85) {
      reasoning.push('high safety standards');
    }

    // Specialization match (10% weight)
    if (load.specialRequirements && carrier.specializations) {
      const matches = load.specialRequirements.filter((req: string) => 
        carrier.specializations.includes(req)
      ).length;
      const specializationScore = (matches / load.specialRequirements.length) * 10;
      score += specializationScore;
      if (matches > 0) {
        reasoning.push('specialized equipment available');
      }
    } else {
      score += 5; // neutral
    }

    return {
      carrier,
      score: Math.min(score, 100),
      reasoning: reasoning.join(', ')
    };
  }).sort((a, b) => b.score - a.score);

  const primary = scoredCarriers[0];
  const alternatives = scoredCarriers.slice(1, 3);

  // Calculate recommended rate based on load characteristics
  const baseRate = calculateBaseRate(load);
  const marketAdjustment = 1.0; // Would be dynamic in production
  const suggestedRate = baseRate * marketAdjustment;

  return {
    primaryRecommendation: {
      carrierId: primary.carrier.id,
      matchScore: primary.score,
      reasoning: `Best match based on: ${primary.reasoning}`
    },
    alternatives: alternatives.map(alt => ({
      carrierId: alt.carrier.id,
      matchScore: alt.score,
      reasoning: alt.reasoning
    })),
    rateRecommendation: {
      suggestedRate,
      rateJustification: 'Based on load characteristics and market conditions',
      competitivenessScore: 75
    },
    riskFactors: identifyRiskFactors(load, primary.carrier),
    confidenceScore: Math.max(primary.score * 0.8, 60),
    expectedOutcome: {
      onTimeDeliveryProbability: primary.carrier.onTimePercentage || 80,
      costEfficiency: 80,
      customerSatisfactionPrediction: 4.0
    }
  };
}

function calculateBaseRate(load: any): number {
  // Simplified rate calculation
  const baseRatePerMile = 2.50;
  const distance = load.distance || 500; // Default 500 miles
  const weightMultiplier = Math.max(1.0, load.weight / 40000); // Adjust for weight
  const urgencyMultiplier = load.urgency === 'high' ? 1.2 : load.urgency === 'medium' ? 1.1 : 1.0;
  
  return distance * baseRatePerMile * weightMultiplier * urgencyMultiplier;
}

function identifyRiskFactors(load: any, carrier: any): string[] {
  const risks = [];
  
  if (carrier.onTimePercentage < 85) {
    risks.push('Carrier has below-average on-time performance');
  }
  
  if (carrier.safetyRating < 80) {
    risks.push('Carrier safety rating below industry standard');
  }
  
  if (load.urgency === 'high' && carrier.performanceScore < 85) {
    risks.push('High priority load with moderate performance carrier');
  }
  
  if (load.weight / carrier.capacity > 0.95) {
    risks.push('Near maximum capacity utilization');
  }
  
  if (load.specialRequirements && (!carrier.specializations || carrier.specializations.length === 0)) {
    risks.push('Special requirements may not be fully met');
  }
  
  return risks;
}
