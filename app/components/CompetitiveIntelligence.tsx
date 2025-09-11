'use client';

import React, { useEffect, useState } from 'react';

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

export const CompetitiveIntelligence: React.FC<
  CompetitiveIntelligenceProps
> = ({
  origin = 'Los Angeles, CA',
  destination = 'Chicago, IL',
  equipment = 'Dry Van',
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysis | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCompetitiveData();
  }, [origin, destination, equipment]);

  const loadCompetitiveData = async () => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockCompetitors: CompetitorData[] = [
        {
          id: 'comp1',
          name: 'TransLogistics Pro',
          marketShare: 18.5,
          averageRates: { 'Dry Van': 2450, Reefer: 2850, Flatbed: 2650 },
          serviceAreas: ['West Coast', 'Midwest', 'Southwest'],
          strengths: ['Large fleet', 'Technology platform', 'Customer service'],
          weaknesses: ['Higher rates', 'Limited specialized equipment'],
          pricingStrategy: 'COMPETITIVE',
          winRate: 72,
          recentActivity: [
            'Expanded into Southeast markets',
            'Launched new tracking platform',
            'Acquired regional carrier',
          ],
          rateHistory: [
            { date: '2024-01', rate: 2350 },
            { date: '2024-02', rate: 2400 },
            { date: '2024-03', rate: 2450 },
          ],
        },
        {
          id: 'comp2',
          name: 'FreightForce Express',
          marketShare: 15.2,
          averageRates: { 'Dry Van': 2200, Reefer: 2650, Flatbed: 2400 },
          serviceAreas: ['National'],
          strengths: [
            'Competitive pricing',
            'Fast response',
            'Flexible service',
          ],
          weaknesses: ['Smaller fleet', 'Limited technology'],
          pricingStrategy: 'AGGRESSIVE',
          winRate: 85,
          recentActivity: [
            'Reduced rates by 5% in Q1',
            'Hired new sales team',
            'Improved dispatch efficiency',
          ],
          rateHistory: [
            { date: '2024-01', rate: 2300 },
            { date: '2024-02', rate: 2250 },
            { date: '2024-03', rate: 2200 },
          ],
        },
        {
          id: 'comp3',
          name: 'Premium Freight Solutions',
          marketShare: 12.8,
          averageRates: { 'Dry Van': 2750, Reefer: 3100, Flatbed: 2950 },
          serviceAreas: ['Major metros', 'High-value lanes'],
          strengths: [
            'Premium service',
            'Specialized equipment',
            'White glove',
          ],
          weaknesses: ['Higher costs', 'Limited coverage'],
          pricingStrategy: 'PREMIUM',
          winRate: 58,
          recentActivity: [
            'Launched white-glove service',
            'Increased premium rates',
            'Focused on high-value customers',
          ],
          rateHistory: [
            { date: '2024-01', rate: 2650 },
            { date: '2024-02', rate: 2700 },
            { date: '2024-03', rate: 2750 },
          ],
        },
        {
          id: 'comp4',
          name: 'Regional Logistics Co',
          marketShare: 8.3,
          averageRates: { 'Dry Van': 2350, Reefer: 2700, Flatbed: 2500 },
          serviceAreas: ['Regional', 'Local markets'],
          strengths: ['Local knowledge', 'Personal service', 'Flexibility'],
          weaknesses: ['Limited scale', 'Technology gaps'],
          pricingStrategy: 'COMPETITIVE',
          winRate: 68,
          recentActivity: [
            'Expanded driver network',
            'Improved customer portal',
            'Added weekend service',
          ],
          rateHistory: [
            { date: '2024-01', rate: 2320 },
            { date: '2024-02', rate: 2335 },
            { date: '2024-03', rate: 2350 },
          ],
        },
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
          'Consolidation of smaller carriers',
        ],
        threats: [
          'New market entrants with aggressive pricing',
          'Economic downturn affecting demand',
          'Fuel price volatility',
          'Driver shortage impacting capacity',
        ],
        opportunities: [
          'Underserved regional markets',
          'Technology differentiation',
          'Specialized equipment services',
          'Customer service excellence',
        ],
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
      case 'AGGRESSIVE':
        return 'bg-red-100 text-red-800';
      case 'PREMIUM':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-blue-100 text-blue-800';
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
      <div>
        <h1>Loading Competitive Intelligence...</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Competitive Intelligence - Main Component</h1>
    </div>
  );
};
