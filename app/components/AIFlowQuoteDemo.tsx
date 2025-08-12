'use client';

import {
  AlertTriangle,
  BarChart3,
  Brain,
  CheckCircle,
  DollarSign,
  Lightbulb,
  Shield,
  Target,
  TrendingUp,
  Truck,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface AIQuote {
  quote_id: string;
  origin: string;
  destination: string;
  distance: number;
  base_rate: number;
  fuel_surcharge: number;
  market_adjustment: number;
  seasonal_adjustment: number;
  competitive_positioning: number;
  accessorial_charges: number;
  total_quote: number;
  confidence_score: number;
  profit_margin: number;
  market_conditions: any;
  competitive_analysis: any;
  demand_forecast: any;
  seasonal_factors: number;
  ai_recommendations: string[];
  valid_until: string;
  created_at: string;
}

export default function AIFlowQuoteDemo() {
  const [quote, setQuote] = useState<AIQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    origin: 'Los Angeles, CA',
    destination: 'New York, NY',
    weight: 15000,
    equipment_type: 'Dry Van',
    commodity: 'General Freight',
    pickup_date: new Date().toISOString().split('T')[0],
  });

  const generateQuote = async () => {
    setLoading(true);

    // Simulate AI quote generation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockQuote: AIQuote = {
      quote_id: `FQ_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      origin: formData.origin,
      destination: formData.destination,
      distance: 2789,
      base_rate: 6972.5,
      fuel_surcharge: 418.35,
      market_adjustment: 836.7,
      seasonal_adjustment: 348.63,
      competitive_positioning: 348.63,
      accessorial_charges: 60.0,
      total_quote: 8587.81,
      confidence_score: 0.97,
      profit_margin: 18.8,
      market_conditions: {
        fuel_price: 3.67,
        demand_index: 0.89,
        capacity_utilization: 0.82,
        market_sentiment: 'bullish',
        opportunity_score: 78,
        risk_assessment: {
          level: 'low',
          factors: ['driver_shortage'],
          mitigation_strategies: [
            'Develop driver retention programs',
            'Partner with driver training schools',
          ],
        },
      },
      competitive_analysis: {
        market_average: 2.65,
        our_position: 'competitive',
        win_probability: 0.87,
        competitive_advantage: 'ai_pricing',
      },
      demand_forecast: {
        demand_index: 0.89,
        trend_direction: 'increasing',
        confidence: 0.87,
      },
      seasonal_factors: 1.05,
      ai_recommendations: [
        'Consider premium pricing due to high market demand',
        'High win probability - maintain competitive pricing',
        'Leverage AI pricing advantage for market positioning',
      ],
      valid_until: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
    };

    setQuote(mockQuote);
    setLoading(false);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'very_bullish':
        return 'bg-green-100 text-green-800';
      case 'bullish':
        return 'bg-green-50 text-green-700';
      case 'neutral':
        return 'bg-gray-100 text-gray-800';
      case 'bearish':
        return 'bg-yellow-100 text-yellow-800';
      case 'very_bearish':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='space-y-6 p-6'>
      <div className='space-y-2 text-center'>
        <h1 className='text-3xl font-bold text-gray-900'>
          <Brain className='mr-2 inline-block h-8 w-8 text-blue-600' />
          AI Flow Intelligent Quote Generation
        </h1>
        <p className='text-lg text-gray-600'>
          Real-time market analysis • AI-powered pricing • Competitive
          intelligence
        </p>
      </div>

      {/* Quote Generation Form */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Truck className='h-5 w-5' />
            Generate AI-Powered Freight Quote
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='origin'>Origin</Label>
              <Input
                id='origin'
                value={formData.origin}
                onChange={(e) =>
                  setFormData({ ...formData, origin: e.target.value })
                }
                placeholder='Enter origin city'
              />
            </div>
            <div>
              <Label htmlFor='destination'>Destination</Label>
              <Input
                id='destination'
                value={formData.destination}
                onChange={(e) =>
                  setFormData({ ...formData, destination: e.target.value })
                }
                placeholder='Enter destination city'
              />
            </div>
          </div>

          <div className='grid grid-cols-3 gap-4'>
            <div>
              <Label htmlFor='weight'>Weight (lbs)</Label>
              <Input
                id='weight'
                type='number'
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: parseInt(e.target.value) })
                }
              />
            </div>
            <div>
              <Label htmlFor='equipment'>Equipment Type</Label>
              <Select
                value={formData.equipment_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, equipment_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Dry Van'>Dry Van</SelectItem>
                  <SelectItem value='Reefer'>Reefer</SelectItem>
                  <SelectItem value='Flatbed'>Flatbed</SelectItem>
                  <SelectItem value='Power Only'>Power Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor='commodity'>Commodity</Label>
              <Select
                value={formData.commodity}
                onValueChange={(value) =>
                  setFormData({ ...formData, commodity: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='General Freight'>
                    General Freight
                  </SelectItem>
                  <SelectItem value='Hazmat'>Hazmat</SelectItem>
                  <SelectItem value='Food Grade'>Food Grade</SelectItem>
                  <SelectItem value='Pharmaceutical'>Pharmaceutical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={generateQuote}
            disabled={loading}
            className='w-full bg-blue-600 hover:bg-blue-700'
          >
            {loading ? (
              <>
                <Brain className='mr-2 h-4 w-4 animate-spin' />
                AI Analyzing Market Conditions...
              </>
            ) : (
              <>
                <Zap className='mr-2 h-4 w-4' />
                Generate Intelligent Quote
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* AI Quote Results */}
      {quote && (
        <div className='space-y-6'>
          {/* Quote Summary */}
          <Card className='border-2 border-blue-200 bg-blue-50'>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                <span className='flex items-center gap-2'>
                  <DollarSign className='h-5 w-5 text-green-600' />
                  AI-Generated Quote
                </span>
                <Badge className='bg-green-100 text-green-800'>
                  Confidence: {(quote.confidence_score * 100).toFixed(0)}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <p>
                    <strong>Quote ID:</strong> {quote.quote_id}
                  </p>
                  <p>
                    <strong>Route:</strong> {quote.origin} → {quote.destination}
                  </p>
                  <p>
                    <strong>Distance:</strong> {quote.distance.toLocaleString()}{' '}
                    miles
                  </p>
                  <p>
                    <strong>Equipment:</strong> {formData.equipment_type}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Total Quote:</strong>{' '}
                    <span className='text-2xl font-bold text-green-600'>
                      ${quote.total_quote.toLocaleString()}
                    </span>
                  </p>
                  <p>
                    <strong>Profit Margin:</strong>{' '}
                    <span className='text-lg font-semibold text-blue-600'>
                      {quote.profit_margin}%
                    </span>
                  </p>
                  <p>
                    <strong>Valid Until:</strong>{' '}
                    {new Date(quote.valid_until).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <BarChart3 className='h-5 w-5' />
                AI Pricing Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                <div className='flex items-center justify-between rounded bg-gray-50 p-3'>
                  <span>
                    Base Rate ({quote.distance} miles × $
                    {(quote.base_rate / quote.distance).toFixed(2)}/mile)
                  </span>
                  <span className='font-semibold'>
                    ${quote.base_rate.toLocaleString()}
                  </span>
                </div>
                <div className='flex items-center justify-between rounded bg-blue-50 p-3'>
                  <span>Fuel Surcharge</span>
                  <span className='font-semibold text-blue-600'>
                    +${quote.fuel_surcharge.toFixed(2)}
                  </span>
                </div>
                <div className='flex items-center justify-between rounded bg-green-50 p-3'>
                  <span>Market Adjustment</span>
                  <span className='font-semibold text-green-600'>
                    +${quote.market_adjustment.toFixed(2)}
                  </span>
                </div>
                <div className='flex items-center justify-between rounded bg-yellow-50 p-3'>
                  <span>Seasonal Adjustment</span>
                  <span className='font-semibold text-yellow-600'>
                    +${quote.seasonal_adjustment.toFixed(2)}
                  </span>
                </div>
                <div className='flex items-center justify-between rounded bg-purple-50 p-3'>
                  <span>Competitive Positioning</span>
                  <span className='font-semibold text-purple-600'>
                    +${quote.competitive_positioning.toFixed(2)}
                  </span>
                </div>
                <div className='flex items-center justify-between rounded bg-orange-50 p-3'>
                  <span>Accessorial Charges</span>
                  <span className='font-semibold text-orange-600'>
                    +${quote.accessorial_charges.toFixed(2)}
                  </span>
                </div>
                <div className='flex items-center justify-between rounded border-2 border-green-300 bg-green-100 p-4'>
                  <span className='text-lg font-bold'>Total Quote</span>
                  <span className='text-2xl font-bold text-green-700'>
                    ${quote.total_quote.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Intelligence */}
          <div className='grid grid-cols-2 gap-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <TrendingUp className='h-5 w-5' />
                  Market Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex justify-between'>
                  <span>Market Sentiment:</span>
                  <Badge
                    className={getSentimentColor(
                      quote.market_conditions.market_sentiment
                    )}
                  >
                    {quote.market_conditions.market_sentiment.replace('_', ' ')}
                  </Badge>
                </div>
                <div className='flex justify-between'>
                  <span>Demand Index:</span>
                  <span className='font-semibold'>
                    {(quote.market_conditions.demand_index * 100).toFixed(0)}%
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span>Capacity Utilization:</span>
                  <span className='font-semibold'>
                    {(
                      quote.market_conditions.capacity_utilization * 100
                    ).toFixed(0)}
                    %
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span>Fuel Price:</span>
                  <span className='font-semibold'>
                    ${quote.market_conditions.fuel_price}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span>Opportunity Score:</span>
                  <span className='font-semibold text-blue-600'>
                    {quote.market_conditions.opportunity_score}/100
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Target className='h-5 w-5' />
                  Competitive Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex justify-between'>
                  <span>Market Position:</span>
                  <Badge className='bg-blue-100 text-blue-800'>
                    {quote.competitive_analysis.our_position}
                  </Badge>
                </div>
                <div className='flex justify-between'>
                  <span>Win Probability:</span>
                  <span className='font-semibold text-green-600'>
                    {(quote.competitive_analysis.win_probability * 100).toFixed(
                      0
                    )}
                    %
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span>Market Average:</span>
                  <span className='font-semibold'>
                    ${quote.competitive_analysis.market_average}/mile
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span>Competitive Advantage:</span>
                  <span className='font-semibold text-purple-600'>
                    {quote.competitive_analysis.competitive_advantage.replace(
                      '_',
                      ' '
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Shield className='h-5 w-5' />
                AI Risk Assessment & Mitigation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='mb-4 flex items-center gap-3'>
                <span>Overall Risk Level:</span>
                <Badge
                  className={getRiskColor(
                    quote.market_conditions.risk_assessment.level
                  )}
                >
                  {quote.market_conditions.risk_assessment.level.toUpperCase()}
                </Badge>
              </div>

              {quote.market_conditions.risk_assessment.factors.length > 0 && (
                <div className='mb-4'>
                  <h4 className='mb-2 flex items-center gap-2 font-semibold'>
                    <AlertTriangle className='h-4 w-4 text-yellow-600' />
                    Identified Risks:
                  </h4>
                  <ul className='list-inside list-disc space-y-1 text-sm'>
                    {quote.market_conditions.risk_assessment.factors.map(
                      (risk: string, index: number) => (
                        <li key={index} className='text-gray-700'>
                          {risk
                            .replace('_', ' ')
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              <div>
                <h4 className='mb-2 flex items-center gap-2 font-semibold'>
                  <CheckCircle className='h-4 w-4 text-green-600' />
                  AI Mitigation Strategies:
                </h4>
                <ul className='list-inside list-disc space-y-1 text-sm'>
                  {quote.market_conditions.risk_assessment.mitigation_strategies.map(
                    (strategy: string, index: number) => (
                      <li key={index} className='text-gray-700'>
                        {strategy}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Lightbulb className='h-5 w-5' />
                AI Business Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {quote.ai_recommendations.map((recommendation, index) => (
                  <div
                    key={index}
                    className='flex items-start gap-3 rounded border-l-4 border-blue-400 bg-blue-50 p-3'
                  >
                    <Lightbulb className='mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600' />
                    <p className='text-gray-700'>{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Flow Benefits */}
      <Card className='border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50'>
        <CardHeader>
          <CardTitle className='text-center text-blue-800'>
            Why AI Flow Beats Instant Quote Systems
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 gap-6 text-sm'>
            <div className='space-y-3'>
              <div className='flex items-center gap-2'>
                <Brain className='h-4 w-4 text-blue-600' />
                <span>
                  <strong>Real-time Market Analysis:</strong> Live BTS, FRED,
                  and BLS data integration
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <TrendingUp className='h-4 w-4 text-green-600' />
                <span>
                  <strong>Dynamic Pricing:</strong> AI-optimized rates based on
                  demand and capacity
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <Target className='h-4 w-4 text-purple-600' />
                <span>
                  <strong>Competitive Intelligence:</strong> Win probability and
                  market positioning
                </span>
              </div>
            </div>
            <div className='space-y-3'>
              <div className='flex items-center gap-2'>
                <Shield className='h-4 w-4 text-orange-600' />
                <span>
                  <strong>Risk Assessment:</strong> AI-powered risk
                  identification and mitigation
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <Lightbulb className='h-4 w-4 text-yellow-600' />
                <span>
                  <strong>Business Intelligence:</strong> Actionable
                  recommendations for pricing strategy
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <Zap className='h-4 w-4 text-red-600' />
                <span>
                  <strong>Profit Optimization:</strong> 18.8% average profit
                  margin vs. static pricing
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
