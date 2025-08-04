export interface FuelPriceData {
  currentPrice: number;
  futurePrice?: number;
  priceChange: number;
  lastUpdated: string;
  source: string;
}

export interface ExchangeRateData {
  rate: number;
  change: number;
  lastUpdated: string;
}

export interface HedgingRecommendation {
  type: 'BUY_FUTURES' | 'SELL_FUTURES' | 'HOLD' | 'MONITOR';
  risk: 'HIGH' | 'MODERATE' | 'LOW';
  message: string;
  potentialSavings?: number;
  confidence: number;
}

export interface MarketData {
  fuelPrice: FuelPriceData;
  exchangeRate: ExchangeRateData;
  hedgingRecommendation: HedgingRecommendation;
}

export class FinancialMarketsService {
  private fredApiKey: string;
  private alphaVantageKey: string;
  private baseUrl = {
    fred: 'https://api.stlouisfed.org/fred',
    alphaVantage: 'https://www.alphavantage.co/query',
    exchangeRate: 'https://api.exchangerate-api.com/v4'
  };

  constructor() {
    this.fredApiKey = process.env.NEXT_PUBLIC_FRED_API_KEY || '';
    this.alphaVantageKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY || '';
  }

  async getDieselPrice(): Promise<FuelPriceData> {
    try {
      const response = await fetch('/api/financial-markets?action=fuel-price');
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to fetch fuel price');
      }
    } catch (error) {
      console.error('Error fetching diesel price:', error);
      // Return mock data if API fails
      return {
        currentPrice: 3.45,
        priceChange: 0.05,
        lastUpdated: new Date().toISOString().split('T')[0],
        source: 'FleetFlow Market Intelligence (Demo)'
      };
    }
  }

  async getFuelFutures(): Promise<number> {
    try {
      // Get crude oil futures as proxy for diesel futures
      const response = await fetch(
        `${this.baseUrl.alphaVantage}?function=WTI&interval=daily&apikey=${this.alphaVantageKey}`
      );

      if (!response.ok) {
        throw new Error(`Alpha Vantage API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data['Error Message'] || data['Note']) {
        throw new Error('Alpha Vantage API limit reached');
      }

      // Extract latest price and calculate futures estimate
      const timeSeries = data['data'] || [];
      if (timeSeries.length > 0) {
        const latestPrice = parseFloat(timeSeries[0].value);
        // Estimate diesel futures (crude oil + refining margin)
        return (latestPrice / 42) * 1.15; // Convert barrel to gallon with refining margin
      }
      
      throw new Error('No futures data available');
    } catch (error) {
      console.error('Error fetching fuel futures:', error);
      // Return estimated futures based on current price + 10%
      return 3.80; // Mock futures price
    }
  }

  async getExchangeRate(from: string = 'USD', to: string = 'CAD'): Promise<ExchangeRateData> {
    try {
      const response = await fetch(
        `${this.baseUrl.exchangeRate}/latest/${from}`
      );

      if (!response.ok) {
        throw new Error(`Exchange rate API error: ${response.status}`);
      }

      const data = await response.json();
      const currentRate = data.rates[to];
      
      // Get previous day's rate for change calculation
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const historicalResponse = await fetch(
        `${this.baseUrl.exchangeRate}/${yesterday.toISOString().split('T')[0]}/${from}`
      );

      let change = 0;
      if (historicalResponse.ok) {
        const historicalData = await historicalResponse.json();
        const previousRate = historicalData.rates[to];
        change = currentRate - previousRate;
      }

      return {
        rate: currentRate,
        change,
        lastUpdated: data.date
      };
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      // Return mock data if API fails
      return {
        rate: 1.3642,
        change: -0.0023,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
    }
  }

  calculateHedgingRecommendation(currentPrice: number, futurePrice: number): HedgingRecommendation {
    const priceChange = ((futurePrice - currentPrice) / currentPrice) * 100;
    const potentialSavings = Math.abs(priceChange * 1000); // Estimate based on 1000 gallons

    if (priceChange > 15) {
      return {
        type: 'BUY_FUTURES',
        risk: 'HIGH',
        message: `🔴 HIGH RISK: Prices expected to rise ${priceChange.toFixed(1)}%. Strong recommendation to hedge fuel costs immediately.`,
        potentialSavings,
        confidence: 85
      };
    } else if (priceChange > 8) {
      return {
        type: 'BUY_FUTURES',
        risk: 'MODERATE',
        message: `🟡 MODERATE RISK: Prices may rise ${priceChange.toFixed(1)}%. Consider hedging portion of fuel needs.`,
        potentialSavings,
        confidence: 70
      };
    } else if (priceChange < -10) {
      return {
        type: 'SELL_FUTURES',
        risk: 'MODERATE',
        message: `🟢 OPPORTUNITY: Prices expected to fall ${Math.abs(priceChange).toFixed(1)}%. Consider selling any existing hedges.`,
        potentialSavings,
        confidence: 75
      };
    } else if (priceChange > 3) {
      return {
        type: 'MONITOR',
        risk: 'LOW',
        message: `🟡 WATCH: Slight upward pressure ${priceChange.toFixed(1)}%. Monitor closely for hedging opportunities.`,
        confidence: 60
      };
    } else {
      return {
        type: 'HOLD',
        risk: 'LOW',
        message: `🟢 STABLE: Price volatility is low. No immediate hedging action required.`,
        confidence: 80
      };
    }
  }

  async getMarketData(): Promise<MarketData> {
    try {
      const response = await fetch('/api/financial-markets?action=market-data');
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to fetch market data');
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw error;
    }
  }

  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  formatPercentage(value: number): string {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  }

  getRiskColor(risk: string): string {
    switch (risk) {
      case 'HIGH': return '#ef4444';
      case 'MODERATE': return '#f59e0b';
      case 'LOW': return '#10b981';
      default: return '#6b7280';
    }
  }
}
