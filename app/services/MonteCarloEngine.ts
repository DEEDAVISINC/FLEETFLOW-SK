import { randomBeta, randomNormal, randomUniform } from 'd3-random';
import {
  max,
  mean,
  median,
  min,
  quantile,
  standardDeviation,
} from 'simple-statistics';

export interface MonteCarloScenario {
  iteration: number;
  trafficDelay: number; // 0.8 - 1.3x normal time
  weatherImpact: number; // 0.9 - 1.5x delay factor
  driverEfficiency: number; // 0.85 - 1.15 efficiency multiplier
  fuelConsumption: number; // Gallons consumed
  mechanicalIssues: boolean; // Random breakdown occurrence
  deliveryTime: number; // Final calculated delivery time (hours)
  totalCost: number; // Total cost including delays
  profit: number; // Net profit after all factors
}

export interface MonteCarloResult {
  scenarios: MonteCarloScenario[];
  statistics: {
    deliveryTime: {
      average: number;
      median: number;
      confidence90: number; // 90% of scenarios under this time
      confidence95: number; // 95% of scenarios under this time
      worstCase: number;
      bestCase: number;
      standardDeviation: number;
    };
    profit: {
      expected: number;
      median: number;
      confidence90: number;
      riskOfLoss: number; // Probability of negative profit
      worstCase: number;
      bestCase: number;
    };
    onTimeDelivery: {
      probability: number; // Probability of on-time delivery
      riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    };
  };
  recommendations: {
    confidence: number; // Overall confidence score (0-100)
    action: 'EXECUTE' | 'REVIEW' | 'REJECT';
    reasoning: string[];
    riskFactors: string[];
  };
}

export interface LoadScenarioInputs {
  baseDeliveryTime: number; // Hours
  baseRate: number; // Revenue per mile
  baseCost: number; // Cost per mile
  distance: number; // Miles
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  weatherForecast: 'CLEAR' | 'RAIN' | 'SNOW' | 'STORM';
  trafficCondition: 'LIGHT' | 'MODERATE' | 'HEAVY';
  driverRating: number; // 1-5 driver performance rating
  equipmentAge: number; // Years (affects breakdown probability)
  customerImportance: 'LOW' | 'MEDIUM' | 'HIGH';
}

export class MonteCarloEngine {
  private iterations: number;

  constructor(iterations: number = 10000) {
    this.iterations = iterations;
  }

  /**
   * Main Monte Carlo simulation for load optimization
   */
  async simulateLoadScenarios(
    inputs: LoadScenarioInputs
  ): Promise<MonteCarloResult> {
    console.log(
      `🎲 Starting Monte Carlo simulation with ${this.iterations} iterations...`
    );

    const scenarios: MonteCarloScenario[] = [];

    for (let i = 0; i < this.iterations; i++) {
      const scenario = this.generateScenario(i, inputs);
      scenarios.push(scenario);
    }

    const result = this.analyzeResults(scenarios, inputs);

    console.log(
      `✅ Monte Carlo simulation complete. Confidence: ${result.recommendations.confidence}%`
    );
    return result;
  }

  /**
   * Generate a single random scenario
   */
  private generateScenario(
    iteration: number,
    inputs: LoadScenarioInputs
  ): MonteCarloScenario {
    // Random generators based on distributions
    const normalGen = randomNormal(1.0, 0.1);
    const uniformGen = randomUniform(0.8, 1.2);
    const betaGen = randomBeta(2, 2);

    // Traffic delay factor based on conditions
    const trafficMultiplier = this.getTrafficMultiplier(
      inputs.trafficCondition
    );
    const trafficDelay = Math.max(
      0.8,
      Math.min(1.5, normalGen() * trafficMultiplier)
    );

    // Weather impact based on forecast
    const weatherMultiplier = this.getWeatherMultiplier(inputs.weatherForecast);
    const weatherImpact = Math.max(
      0.9,
      Math.min(1.6, betaGen() * weatherMultiplier)
    );

    // Driver efficiency based on rating
    const driverBase = 0.7 + (inputs.driverRating / 5) * 0.6; // 0.7-1.3 range
    const driverEfficiency = Math.max(
      0.6,
      Math.min(1.4, normalGen() * driverBase)
    );

    // Mechanical issues probability based on equipment age
    const breakdownProb = Math.min(
      0.1,
      0.01 + (inputs.equipmentAge / 15) * 0.09
    );
    const mechanicalIssues = Math.random() < breakdownProb;

    // Calculate delivery time with all factors
    let deliveryTime = inputs.baseDeliveryTime * trafficDelay * weatherImpact;
    deliveryTime = deliveryTime / driverEfficiency; // Good drivers are faster

    if (mechanicalIssues) {
      deliveryTime += randomUniform(2, 8)(); // 2-8 hour breakdown delay
    }

    // Fuel consumption calculation
    const baseFuelPerMile = 0.167; // ~6 MPG average
    const fuelEfficiencyFactor = 0.8 + ((driverEfficiency - 0.85) / 0.3) * 0.4;
    const fuelConsumption =
      (inputs.distance * baseFuelPerMile) / fuelEfficiencyFactor;

    // Cost calculation
    const fuelCost = fuelConsumption * (3.5 + uniformGen() * 1.0); // $3.50-$4.50/gallon
    const driverCost =
      inputs.baseDeliveryTime * 25 * (deliveryTime / inputs.baseDeliveryTime); // $25/hour base
    const maintenanceCost = mechanicalIssues
      ? randomUniform(500, 2000)()
      : inputs.distance * 0.15;
    const totalCost =
      inputs.baseCost * inputs.distance +
      fuelCost +
      driverCost +
      maintenanceCost;

    // Revenue and profit
    const revenue = inputs.baseRate * inputs.distance;
    const profit = revenue - totalCost;

    return {
      iteration,
      trafficDelay,
      weatherImpact,
      driverEfficiency,
      fuelConsumption,
      mechanicalIssues,
      deliveryTime,
      totalCost,
      profit,
    };
  }

  /**
   * Analyze results and generate recommendations
   */
  private analyzeResults(
    scenarios: MonteCarloScenario[],
    inputs: LoadScenarioInputs
  ): MonteCarloResult {
    // Extract arrays for statistical analysis
    const deliveryTimes = scenarios.map((s) => s.deliveryTime);
    const profits = scenarios.map((s) => s.profit);

    // Calculate delivery time statistics
    const avgDeliveryTime = mean(deliveryTimes);
    const medianDeliveryTime = median(deliveryTimes);
    const conf90DeliveryTime = quantile(
      deliveryTimes.sort((a, b) => a - b),
      0.9
    );
    const conf95DeliveryTime = quantile(
      deliveryTimes.sort((a, b) => a - b),
      0.95
    );

    // Calculate profit statistics
    const expectedProfit = mean(profits);
    const medianProfit = median(profits);
    const conf90Profit = quantile(
      profits.sort((a, b) => a - b),
      0.1
    ); // 10th percentile (worst case)
    const riskOfLoss = profits.filter((p) => p < 0).length / profits.length;

    // On-time delivery analysis (assuming target is base delivery time + 2 hours)
    const onTimeTarget = inputs.baseDeliveryTime + 2;
    const onTimeCount = deliveryTimes.filter((t) => t <= onTimeTarget).length;
    const onTimeProbability = onTimeCount / deliveryTimes.length;

    // Risk assessment
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (riskOfLoss > 0.2 || onTimeProbability < 0.7) riskLevel = 'HIGH';
    else if (riskOfLoss > 0.1 || onTimeProbability < 0.85) riskLevel = 'MEDIUM';

    // Generate recommendations
    const confidence = this.calculateConfidence(
      riskOfLoss,
      onTimeProbability,
      expectedProfit
    );
    const action = this.determineAction(confidence, riskLevel);
    const reasoning = this.generateReasoning(scenarios, inputs, {
      riskOfLoss,
      onTimeProbability,
      expectedProfit,
      confidence,
    });
    const riskFactors = this.identifyRiskFactors(scenarios, inputs);

    return {
      scenarios,
      statistics: {
        deliveryTime: {
          average: Number(avgDeliveryTime.toFixed(2)),
          median: Number(medianDeliveryTime.toFixed(2)),
          confidence90: Number(conf90DeliveryTime.toFixed(2)),
          confidence95: Number(conf95DeliveryTime.toFixed(2)),
          worstCase: Number(max(deliveryTimes).toFixed(2)),
          bestCase: Number(min(deliveryTimes).toFixed(2)),
          standardDeviation: Number(
            standardDeviation(deliveryTimes).toFixed(2)
          ),
        },
        profit: {
          expected: Number(expectedProfit.toFixed(2)),
          median: Number(medianProfit.toFixed(2)),
          confidence90: Number(conf90Profit.toFixed(2)),
          riskOfLoss: Number((riskOfLoss * 100).toFixed(1)),
          worstCase: Number(min(profits).toFixed(2)),
          bestCase: Number(max(profits).toFixed(2)),
        },
        onTimeDelivery: {
          probability: Number((onTimeProbability * 100).toFixed(1)),
          riskLevel,
        },
      },
      recommendations: {
        confidence,
        action,
        reasoning,
        riskFactors,
      },
    };
  }

  /**
   * Helper methods for scenario generation
   */
  private getTrafficMultiplier(
    condition: 'LIGHT' | 'MODERATE' | 'HEAVY'
  ): number {
    switch (condition) {
      case 'LIGHT':
        return 0.95;
      case 'MODERATE':
        return 1.1;
      case 'HEAVY':
        return 1.25;
      default:
        return 1.0;
    }
  }

  private getWeatherMultiplier(
    forecast: 'CLEAR' | 'RAIN' | 'SNOW' | 'STORM'
  ): number {
    switch (forecast) {
      case 'CLEAR':
        return 1.0;
      case 'RAIN':
        return 1.15;
      case 'SNOW':
        return 1.35;
      case 'STORM':
        return 1.55;
      default:
        return 1.0;
    }
  }

  private calculateConfidence(
    riskOfLoss: number,
    onTimeProbability: number,
    expectedProfit: number
  ): number {
    let confidence = 100;

    // Reduce confidence based on risk factors
    confidence -= riskOfLoss * 40; // Risk of loss heavily impacts confidence
    confidence -= (1 - onTimeProbability) * 30; // Late delivery risk

    if (expectedProfit < 0)
      confidence -= 30; // Negative expected profit
    else if (expectedProfit < 100) confidence -= 10; // Low profit margin

    return Math.max(0, Math.min(100, Math.round(confidence)));
  }

  private determineAction(
    confidence: number,
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  ): 'EXECUTE' | 'REVIEW' | 'REJECT' {
    if (confidence >= 85 && riskLevel === 'LOW') return 'EXECUTE';
    if (confidence >= 70 && riskLevel !== 'HIGH') return 'REVIEW';
    return 'REJECT';
  }

  private generateReasoning(
    scenarios: MonteCarloScenario[],
    inputs: LoadScenarioInputs,
    stats: any
  ): string[] {
    const reasoning = [];

    if (stats.expectedProfit > 500) {
      reasoning.push(
        `Strong profit potential: $${stats.expectedProfit.toFixed(0)} expected profit`
      );
    } else if (stats.expectedProfit < 100) {
      reasoning.push(
        `Low profit margin: Only $${stats.expectedProfit.toFixed(0)} expected profit`
      );
    }

    if (stats.onTimeProbability > 0.9) {
      reasoning.push(
        `High on-time probability: ${(stats.onTimeProbability * 100).toFixed(0)}% chance of on-time delivery`
      );
    } else if (stats.onTimeProbability < 0.8) {
      reasoning.push(
        `Delivery risk: Only ${(stats.onTimeProbability * 100).toFixed(0)}% chance of on-time delivery`
      );
    }

    if (stats.riskOfLoss > 0.15) {
      reasoning.push(
        `High financial risk: ${(stats.riskOfLoss * 100).toFixed(0)}% chance of losing money`
      );
    }

    if (inputs.customerImportance === 'HIGH' && stats.onTimeProbability < 0.9) {
      reasoning.push(
        `Important customer with delivery risk - consider premium driver assignment`
      );
    }

    return reasoning;
  }

  private identifyRiskFactors(
    scenarios: MonteCarloScenario[],
    inputs: LoadScenarioInputs
  ): string[] {
    const riskFactors = [];

    // Check for common risk patterns
    const breakdownRate =
      scenarios.filter((s) => s.mechanicalIssues).length / scenarios.length;
    if (breakdownRate > 0.05) {
      riskFactors.push(
        `Equipment reliability concern: ${(breakdownRate * 100).toFixed(0)}% breakdown probability`
      );
    }

    if (inputs.weatherForecast !== 'CLEAR') {
      riskFactors.push(
        `Weather impact: ${inputs.weatherForecast.toLowerCase()} conditions expected`
      );
    }

    if (inputs.trafficCondition === 'HEAVY') {
      riskFactors.push(`Traffic delays: Heavy traffic conditions on route`);
    }

    if (inputs.driverRating < 3.5) {
      riskFactors.push(
        `Driver performance: Below-average driver rating (${inputs.driverRating}/5)`
      );
    }

    if (inputs.equipmentAge > 8) {
      riskFactors.push(
        `Equipment age: ${inputs.equipmentAge}-year-old equipment increases breakdown risk`
      );
    }

    return riskFactors;
  }

  /**
   * Quick risk assessment for real-time use
   */
  async quickRiskAssessment(inputs: LoadScenarioInputs): Promise<{
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    confidence: number;
    expectedProfit: number;
    onTimeProbability: number;
  }> {
    // Run smaller simulation for speed
    const quickEngine = new MonteCarloEngine(1000);
    const result = await quickEngine.simulateLoadScenarios(inputs);

    return {
      riskLevel: result.statistics.onTimeDelivery.riskLevel,
      confidence: result.recommendations.confidence,
      expectedProfit: result.statistics.profit.expected,
      onTimeProbability: result.statistics.onTimeDelivery.probability,
    };
  }
}

// Export default instance
export const monteCarloEngine = new MonteCarloEngine();


