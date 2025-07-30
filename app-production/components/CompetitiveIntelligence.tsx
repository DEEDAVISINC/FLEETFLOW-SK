'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Users, 
  BarChart3,
  Eye,
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle,
  Globe,
  Percent
} from 'lucide-react';

interface CompetitorData {
  id: string;
  name: string;
  marketShare: number;
  averageRates: { [equipment: string]: number };
  serviceAreas: string[];
  strengths: string[];
  weaknesses: string[];
  pricingStrategy: 'AGGRESSIVE' | 'COMPETITIVE' | 'PREMIUM';
  winRate: number;
  recentActivity: string[];
  rateHistory: { date: string; rate: number }[];
}

interface MarketAnalysis {
  totalMarketSize: number;
  growthRate: number;
  competitionLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  marketLeader: string;
  emergingTrends: string[];
  threats: string[];
  opportunities: string[];
}

interface CompetitiveIntelligenceProps {
  origin?: string;
  destination?: string;
  equipment?: string;
}

const CompetitiveIntelligence: React.FC<CompetitiveIntelligenceProps> = ({
  origin = 'Los Angeles, CA',
  destination = 'Chicago, IL',
  equipment = 'Dry Van'
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCompetitiveData();
  }, [origin, destination, equipment]);

  const loadCompetitiveData = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockCompetitors: CompetitorData[] = [
        {
          id: 'comp1',
          name: 'TransLogistics Pro',
          marketShare: 18.5,
          averageRates: { 'Dry Van': 2450, 'Reefer': 2850, 'Flatbed': 2650 },
          serviceAreas: ['West Coast', 'Midwest', 'Southwest'],
          strengths: ['Large fleet', 'Technology platform', 'Customer service'],
          weaknesses: ['Higher rates', 'Limited specialized equipment'],
          pricingStrategy: 'COMPETITIVE',
          winRate: 72,
          recentActivity: [
            'Expanded into Southeast markets',
            'Launched new tracking platform',
            'Acquired regional carrier'
          ],
          rateHistory: [
            { date: '2024-01', rate: 2350 },
            { date: '2024-02', rate: 2400 },
            { date: '2024-03', rate: 2450 }
          ]
        },
        {
          id: 'comp2',
          name: 'FreightForce Express',
          marketShare: 15.2,
          averageRates: { 'Dry Van': 2200, 'Reefer': 2650, 'Flatbed': 2400 },
          serviceAreas: ['National'],
          strengths: ['Competitive pricing', 'Fast response', 'Flexible service'],
          weaknesses: ['Smaller fleet', 'Limited technology'],
          pricingStrategy: 'AGGRESSIVE',
          winRate: 85,
          recentActivity: [
            'Reduced rates by 5% in Q1',
            'Hired new sales team',
            'Improved dispatch efficiency'
          ],
          rateHistory: [
            { date: '2024-01', rate: 2300 },
            { date: '2024-02', rate: 2250 },
            { date: '2024-03', rate: 2200 }
          ]
        },
        {
          id: 'comp3',
          name: 'Premium Freight Solutions',
          marketShare: 12.8,
          averageRates: { 'Dry Van': 2750, 'Reefer': 3100, 'Flatbed': 2950 },
          serviceAreas: ['Major metros', 'High-value lanes'],
          strengths: ['Premium service', 'Specialized equipment', 'White glove'],
          weaknesses: ['Higher costs', 'Limited coverage'],
          pricingStrategy: 'PREMIUM',
          winRate: 58,
          recentActivity: [
            'Launched white-glove service',
            'Increased premium rates',
            'Focused on high-value customers'
          ],
          rateHistory: [
            { date: '2024-01', rate: 2650 },
            { date: '2024-02', rate: 2700 },
            { date: '2024-03', rate: 2750 }
          ]
        },
        {
          id: 'comp4',
          name: 'Regional Logistics Co',
          marketShare: 8.3,
          averageRates: { 'Dry Van': 2350, 'Reefer': 2700, 'Flatbed': 2500 },
          serviceAreas: ['Regional', 'Local markets'],
          strengths: ['Local knowledge', 'Personal service', 'Flexibility'],
          weaknesses: ['Limited scale', 'Technology gaps'],
          pricingStrategy: 'COMPETITIVE',
          winRate: 68,
          recentActivity: [
            'Expanded driver network',
            'Improved customer portal',
            'Added weekend service'
          ],
          rateHistory: [
            { date: '2024-01', rate: 2320 },
            { date: '2024-02', rate: 2335 },
            { date: '2024-03', rate: 2350 }
          ]
        }
      ];

      const mockMarketAnalysis: MarketAnalysis = {
        totalMarketSize: 125000000, // $125M
        growthRate: 8.5,
        competitionLevel: 'HIGH',
        marketLeader: 'TransLogistics Pro',
        emergingTrends: [
          'Increased demand for technology integration',
          'Growing focus on sustainability',
          'Rise of specialized services',
          'Consolidation of smaller carriers'
        ],
        threats: [
          'New market entrants with aggressive pricing',
          'Economic downturn affecting demand',
          'Fuel price volatility',
          'Driver shortage impacting capacity'
        ],
        opportunities: [
          'Underserved regional markets',
          'Technology differentiation',
          'Specialized equipment services',
          'Customer service excellence'
        ]
      };

      setCompetitors(mockCompetitors);
      setMarketAnalysis(mockMarketAnalysis);
    } catch (error) {
      console.error('Error loading competitive data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStrategyColor = (strategy: string) => {
    switch (strategy) {
      case 'AGGRESSIVE': return 'bg-red-100 text-red-800';
      case 'PREMIUM': return 'bg-purple-100 text-purple-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getMarketShareColor = (share: number) => {
    if (share >= 15) return 'text-green-600';
    if (share >= 10) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getWinRateColor = (rate: number) => {
    if (rate >= 75) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Competitive Intelligence</h3>
            <p className="text-gray-600">Analyzing market data and competitor information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Competitive Intelligence
          </h1>
          <p className="text-lg text-gray-600">
            Market analysis and competitor insights for {origin} → {destination} ({equipment})
          </p>
        </div>

        {/* Market Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Market Size</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${marketAnalysis?.totalMarketSize.toLocaleString()}
                  </p>
                </div>
                <Globe className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                  <p className="text-2xl font-bold text-green-600">
                    +{marketAnalysis?.growthRate}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Competition</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {marketAnalysis?.competitionLevel}
                  </p>
                </div>
                <Users className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Market Leader</p>
                  <p className="text-lg font-bold text-purple-600">
                    {marketAnalysis?.marketLeader}
                  </p>
                </div>
                <Target className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="competitors" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Competitors
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="strategy" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Strategy
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Market Share Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {competitors.map((competitor) => (
                      <div key={competitor.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="font-medium">{competitor.name}</span>
                        </div>
                        <span className={`font-bold ${getMarketShareColor(competitor.marketShare)}`}>
                          {competitor.marketShare}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Win Rate Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {competitors.map((competitor) => (
                      <div key={competitor.id} className="flex items-center justify-between">
                        <span className="font-medium">{competitor.name}</span>
                        <span className={`font-bold ${getWinRateColor(competitor.winRate)}`}>
                          {competitor.winRate}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="w-5 h-5" />
                  Rate Comparison ({equipment})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {competitors.map((competitor) => (
                    <div key={competitor.id} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-gray-900 mb-1">
                        {competitor.name}
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        ${competitor.averageRates[equipment]?.toLocaleString() || 'N/A'}
                      </div>
                      <Badge className={`mt-2 ${getStrategyColor(competitor.pricingStrategy)}`}>
                        {competitor.pricingStrategy}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Competitors Tab */}
          <TabsContent value="competitors" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {competitors.map((competitor) => (
                <Card key={competitor.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{competitor.name}</span>
                      <Badge className={getStrategyColor(competitor.pricingStrategy)}>
                        {competitor.pricingStrategy}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Market Share</div>
                        <div className={`text-lg font-bold ${getMarketShareColor(competitor.marketShare)}`}>
                          {competitor.marketShare}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Win Rate</div>
                        <div className={`text-lg font-bold ${getWinRateColor(competitor.winRate)}`}>
                          {competitor.winRate}%
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-600 mb-2">Service Areas</div>
                      <div className="flex flex-wrap gap-1">
                        {competitor.serviceAreas.map((area) => (
                          <Badge key={area} variant="outline" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-600 mb-2">Strengths</div>
                      <div className="space-y-1">
                        {competitor.strengths.map((strength, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span className="text-sm">{strength}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-600 mb-2">Weaknesses</div>
                      <div className="space-y-1">
                        {competitor.weaknesses.map((weakness, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3 text-red-500" />
                            <span className="text-sm">{weakness}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-600 mb-2">Recent Activity</div>
                      <div className="space-y-1">
                        {competitor.recentActivity.map((activity, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Zap className="w-3 h-3 text-blue-500" />
                            <span className="text-sm">{activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Market Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {marketAnalysis?.opportunities.map((opportunity, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{opportunity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Market Threats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {marketAnalysis?.threats.map((threat, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{threat}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Emerging Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {marketAnalysis?.emergingTrends.map((trend, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">{trend}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Strategy Tab */}
          <TabsContent value="strategy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Strategic Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-2">Competitive Advantage</h3>
                    <p className="text-green-700">
                      Focus on technology differentiation and customer service excellence to compete 
                      against larger players while maintaining competitive pricing.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-2">Market Positioning</h3>
                    <p className="text-blue-700">
                      Position as a technology-forward, service-oriented alternative to traditional 
                      carriers with competitive pricing and specialized capabilities.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-purple-800 mb-2">Growth Strategy</h3>
                    <p className="text-purple-700">
                      Target underserved regional markets and develop specialized service offerings 
                      while building technology capabilities for competitive differentiation.
                    </p>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h3 className="font-semibold text-orange-800 mb-2">Risk Mitigation</h3>
                    <p className="text-orange-700">
                      Monitor aggressive pricing from FreightForce Express and prepare counter-strategies. 
                      Diversify service offerings to reduce dependency on standard freight.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CompetitiveIntelligence; 