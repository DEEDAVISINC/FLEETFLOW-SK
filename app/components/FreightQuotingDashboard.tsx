/**
 * FreightQuotingDashboard - Modern UI with comprehensive quote management
 * AI-powered freight quoting with market intelligence and competitive analysis
 */

'use client';

import { useEffect, useState } from 'react';

interface QuoteRequest {
  type: 'LTL' | 'FTL' | 'Specialized';
  origin: string;
  destination: string;
  weight?: number;
  pallets?: number;
  freightClass?: number;
  equipmentType?: string;
  serviceType?: string;
  distance: number;
  pickupDate: string;
  deliveryDate: string;
  urgency: 'standard' | 'expedited' | 'emergency';
  customerTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  specialRequirements?: string[];
  hazmat?: boolean;
  temperature?: 'ambient' | 'refrigerated' | 'frozen';
}

interface AIQuoteResponse {
  quoteId: string;
  baseRate: number;
  fuelSurcharge: number;
  accessorialCharges: number;
  totalQuote: number;
  winProbability: number;
  competitiveScore: number;
  marketPosition: 'below' | 'at' | 'above';
  priceConfidence: number;
  recommendedActions: string[];
  marketIntelligence: {
    averageMarketRate: number;
    competitorRates: Array<{
      carrier: string;
      rate: number;
      confidence: number;
    }>;
    demandLevel: 'low' | 'medium' | 'high' | 'critical';
    capacityTightness: number;
    seasonalFactor: number;
  };
  riskFactors: Array<{
    factor: string;
    impact: 'low' | 'medium' | 'high';
    mitigation: string;
  }>;
  profitMargin: number;
  breakEvenPoint: number;
  timestamp: string;
}

export default function FreightQuotingDashboard() {
  const [activeTab, setActiveTab] = useState('quote');
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<AIQuoteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [marketData, setMarketData] = useState<any>(null);
  const [quoteHistory, setQuoteHistory] = useState<AIQuoteResponse[]>([]);

  // Quote form state
  const [quoteForm, setQuoteForm] = useState<QuoteRequest>({
    type: 'FTL',
    origin: '',
    destination: '',
    distance: 0,
    pickupDate: '',
    deliveryDate: '',
    urgency: 'standard',
    customerTier: 'bronze',
    specialRequirements: [],
    hazmat: false,
    temperature: 'ambient',
  });

  // Load quote history on component mount
  useEffect(() => {
    loadQuoteHistory();
  }, []);

  const loadQuoteHistory = async () => {
    try {
      const response = await fetch('/api/freight-quoting?action=quote_history');
      if (response.ok) {
        const data = await response.json();
        setQuoteHistory(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load quote history:', error);
    }
  };

  const generateQuote = async () => {
    if (!quoteForm.origin || !quoteForm.destination || !quoteForm.distance) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/freight-quoting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_quote',
          data: quoteForm,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quote');
      }

      const result = await response.json();
      if (result.success) {
        setQuote(result.data);
        setActiveTab('results');
        loadQuoteHistory(); // Refresh history
      } else {
        setError(result.error || 'Failed to generate quote');
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to generate quote'
      );
    } finally {
      setLoading(false);
    }
  };

  const loadMarketIntelligence = async () => {
    if (!quoteForm.origin || !quoteForm.destination) {
      setError('Please specify origin and destination');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/freight-quoting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_market_intelligence',
          data: {
            origin: quoteForm.origin,
            destination: quoteForm.destination,
            equipmentType: quoteForm.equipmentType || 'Dry Van',
          },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setMarketData(result.data);
          setActiveTab('intelligence');
        }
      }
    } catch (error) {
      setError('Failed to load market intelligence');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getWinProbabilityColor = (probability: number) => {
    if (probability >= 0.7) return 'bg-green-500';
    if (probability >= 0.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div>
      <h1>Freight Quoting Dashboard</h1>
    </div>
  );
}
