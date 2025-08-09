'use client';

import { useState } from 'react';
import {
  MultiStateConsolidatedQuote,
  multiStateQuoteService,
} from '../services/MultiStateQuoteService';

interface MultiStateQuoteBuilderProps {
  onQuoteCreated?: (quote: MultiStateConsolidatedQuote) => void;
  onQuoteUpdated?: (quote: MultiStateConsolidatedQuote) => void;
}

export default function MultiStateQuoteBuilder({
  onQuoteCreated,
  onQuoteUpdated,
}: MultiStateQuoteBuilderProps) {
  const [activeStep, setActiveStep] = useState<
    'overview' | 'states' | 'pricing' | 'terms' | 'review'
  >('overview');
  const [currentQuote, setCurrentQuote] =
    useState<MultiStateConsolidatedQuote | null>(null);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [showPricingCalculator, setShowPricingCalculator] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['US']);
  const [regionFilter, setRegionFilter] = useState<string>('all');

  // Available states/provinces/territories configuration
  const availableStates = [
    // === UNITED STATES ===
    // West Coast
    {
      code: 'CA',
      name: 'California',
      region: 'West Coast',
      color: '#FF6B6B',
      volume: '15,000+ loads/year',
      country: 'US',
    },
    {
      code: 'WA',
      name: 'Washington',
      region: 'West Coast',
      color: '#F7DC6F',
      volume: '9,000+ loads/year',
      country: 'US',
    },
    {
      code: 'OR',
      name: 'Oregon',
      region: 'West Coast',
      color: '#98FB98',
      volume: '7,500+ loads/year',
      country: 'US',
    },
    {
      code: 'AK',
      name: 'Alaska',
      region: 'West Coast',
      color: '#87CEEB',
      volume: '2,500+ loads/year',
      country: 'US',
    },
    {
      code: 'HI',
      name: 'Hawaii',
      region: 'West Coast',
      color: '#FFB6C1',
      volume: '3,000+ loads/year',
      country: 'US',
    },

    // Southwest
    {
      code: 'TX',
      name: 'Texas',
      region: 'Southwest',
      color: '#4ECDC4',
      volume: '20,000+ loads/year',
      country: 'US',
    },
    {
      code: 'AZ',
      name: 'Arizona',
      region: 'Southwest',
      color: '#DEB887',
      volume: '8,500+ loads/year',
      country: 'US',
    },
    {
      code: 'NM',
      name: 'New Mexico',
      region: 'Southwest',
      color: '#F4A460',
      volume: '4,500+ loads/year',
      country: 'US',
    },
    {
      code: 'NV',
      name: 'Nevada',
      region: 'Mountain West',
      color: '#CD853F',
      volume: '5,200+ loads/year',
      country: 'US',
    },
    {
      code: 'UT',
      name: 'Utah',
      region: 'Mountain West',
      color: '#D2B48C',
      volume: '4,800+ loads/year',
      country: 'US',
    },
    {
      code: 'CO',
      name: 'Colorado',
      region: 'Mountain West',
      color: '#BC8F8F',
      volume: '6,500+ loads/year',
      country: 'US',
    },
    {
      code: 'OK',
      name: 'Oklahoma',
      region: 'Southwest',
      color: '#DAA520',
      volume: '5,800+ loads/year',
      country: 'US',
    },

    // Midwest
    {
      code: 'IL',
      name: 'Illinois',
      region: 'Midwest',
      color: '#96CEB4',
      volume: '12,000+ loads/year',
      country: 'US',
    },
    {
      code: 'IN',
      name: 'Indiana',
      region: 'Midwest',
      color: '#20B2AA',
      volume: '8,200+ loads/year',
      country: 'US',
    },
    {
      code: 'OH',
      name: 'Ohio',
      region: 'Midwest',
      color: '#48D1CC',
      volume: '9,500+ loads/year',
      country: 'US',
    },
    {
      code: 'MI',
      name: 'Michigan',
      region: 'Midwest',
      color: '#40E0D0',
      volume: '8,800+ loads/year',
      country: 'US',
    },
    {
      code: 'WI',
      name: 'Wisconsin',
      region: 'Midwest',
      color: '#00CED1',
      volume: '6,200+ loads/year',
      country: 'US',
    },
    {
      code: 'MN',
      name: 'Minnesota',
      region: 'Midwest',
      color: '#45B7D1',
      volume: '8,000+ loads/year',
      country: 'US',
    },
    {
      code: 'IA',
      name: 'Iowa',
      region: 'Midwest',
      color: '#5F9EA0',
      volume: '5,500+ loads/year',
      country: 'US',
    },
    {
      code: 'MO',
      name: 'Missouri',
      region: 'Midwest',
      color: '#4682B4',
      volume: '6,800+ loads/year',
      country: 'US',
    },
    {
      code: 'ND',
      name: 'North Dakota',
      region: 'Midwest',
      color: '#6495ED',
      volume: '3,200+ loads/year',
      country: 'US',
    },
    {
      code: 'SD',
      name: 'South Dakota',
      region: 'Midwest',
      color: '#00BFFF',
      volume: '2,800+ loads/year',
      country: 'US',
    },
    {
      code: 'NE',
      name: 'Nebraska',
      region: 'Midwest',
      color: '#87CEFA',
      volume: '4,100+ loads/year',
      country: 'US',
    },
    {
      code: 'KS',
      name: 'Kansas',
      region: 'Midwest',
      color: '#B0C4DE',
      volume: '4,600+ loads/year',
      country: 'US',
    },

    // Southeast
    {
      code: 'FL',
      name: 'Florida',
      region: 'Southeast',
      color: '#DDA0DD',
      volume: '14,000+ loads/year',
      country: 'US',
    },
    {
      code: 'GA',
      name: 'Georgia',
      region: 'Southeast',
      color: '#FFEAA7',
      volume: '10,000+ loads/year',
      country: 'US',
    },
    {
      code: 'AL',
      name: 'Alabama',
      region: 'Southeast',
      color: '#FFE4E1',
      volume: '6,500+ loads/year',
      country: 'US',
    },
    {
      code: 'SC',
      name: 'South Carolina',
      region: 'Southeast',
      color: '#FFF8DC',
      volume: '5,800+ loads/year',
      country: 'US',
    },
    {
      code: 'NC',
      name: 'North Carolina',
      region: 'Southeast',
      color: '#F5DEB3',
      volume: '8,200+ loads/year',
      country: 'US',
    },
    {
      code: 'TN',
      name: 'Tennessee',
      region: 'Southeast',
      color: '#WHEAT',
      volume: '7,100+ loads/year',
      country: 'US',
    },
    {
      code: 'KY',
      name: 'Kentucky',
      region: 'Southeast',
      color: '#F5F5DC',
      volume: '5,900+ loads/year',
      country: 'US',
    },
    {
      code: 'MS',
      name: 'Mississippi',
      region: 'Southeast',
      color: '#FFEBCD',
      volume: '4,200+ loads/year',
      country: 'US',
    },
    {
      code: 'LA',
      name: 'Louisiana',
      region: 'Southeast',
      color: '#FFE4B5',
      volume: '6,800+ loads/year',
      country: 'US',
    },
    {
      code: 'AR',
      name: 'Arkansas',
      region: 'Southeast',
      color: '#FFDAB9',
      volume: '4,500+ loads/year',
      country: 'US',
    },
    {
      code: 'VA',
      name: 'Virginia',
      region: 'Southeast',
      color: '#PEACHPUFF',
      volume: '7,500+ loads/year',
      country: 'US',
    },
    {
      code: 'WV',
      name: 'West Virginia',
      region: 'Southeast',
      color: '#NAVAJOWHITE',
      volume: '3,800+ loads/year',
      country: 'US',
    },

    // Northeast
    {
      code: 'NY',
      name: 'New York',
      region: 'Northeast',
      color: '#98D8C8',
      volume: '18,000+ loads/year',
      country: 'US',
    },
    {
      code: 'PA',
      name: 'Pennsylvania',
      region: 'Northeast',
      color: '#AFEEEE',
      volume: '11,500+ loads/year',
      country: 'US',
    },
    {
      code: 'NJ',
      name: 'New Jersey',
      region: 'Northeast',
      color: '#E0FFFF',
      volume: '9,200+ loads/year',
      country: 'US',
    },
    {
      code: 'CT',
      name: 'Connecticut',
      region: 'Northeast',
      color: '#F0FFFF',
      volume: '5,500+ loads/year',
      country: 'US',
    },
    {
      code: 'MA',
      name: 'Massachusetts',
      region: 'Northeast',
      color: '#F8F8FF',
      volume: '7,800+ loads/year',
      country: 'US',
    },
    {
      code: 'RI',
      name: 'Rhode Island',
      region: 'Northeast',
      color: '#LAVENDER',
      volume: '2,200+ loads/year',
      country: 'US',
    },
    {
      code: 'VT',
      name: 'Vermont',
      region: 'Northeast',
      color: '#THISTLE',
      volume: '1,800+ loads/year',
      country: 'US',
    },
    {
      code: 'NH',
      name: 'New Hampshire',
      region: 'Northeast',
      color: '#PLUM',
      volume: '2,500+ loads/year',
      country: 'US',
    },
    {
      code: 'ME',
      name: 'Maine',
      region: 'Northeast',
      color: '#VIOLET',
      volume: '2,800+ loads/year',
      country: 'US',
    },
    {
      code: 'MD',
      name: 'Maryland',
      region: 'Northeast',
      color: '#ORCHID',
      volume: '6,500+ loads/year',
      country: 'US',
    },
    {
      code: 'DE',
      name: 'Delaware',
      region: 'Northeast',
      color: '#MEDIUMORCHID',
      volume: '2,100+ loads/year',
      country: 'US',
    },
    {
      code: 'DC',
      name: 'Washington D.C.',
      region: 'Northeast',
      color: '#MEDIUMPURPLE',
      volume: '1,500+ loads/year',
      country: 'US',
    },

    // Mountain West
    {
      code: 'MT',
      name: 'Montana',
      region: 'Mountain West',
      color: '#9370DB',
      volume: '3,500+ loads/year',
      country: 'US',
    },
    {
      code: 'WY',
      name: 'Wyoming',
      region: 'Mountain West',
      color: '#8A2BE2',
      volume: '2,800+ loads/year',
      country: 'US',
    },
    {
      code: 'ID',
      name: 'Idaho',
      region: 'Mountain West',
      color: '#9932CC',
      volume: '3,200+ loads/year',
      country: 'US',
    },

    // === CANADA ===
    // Western Canada
    {
      code: 'BC',
      name: 'British Columbia',
      region: 'West Coast',
      color: '#FF1493',
      volume: '12,000+ loads/year',
      country: 'CA',
    },
    {
      code: 'AB',
      name: 'Alberta',
      region: 'Mountain West',
      color: '#FF69B4',
      volume: '15,000+ loads/year',
      country: 'CA',
    },
    {
      code: 'SK',
      name: 'Saskatchewan',
      region: 'Midwest',
      color: '#FF6347',
      volume: '8,500+ loads/year',
      country: 'CA',
    },
    {
      code: 'MB',
      name: 'Manitoba',
      region: 'Midwest',
      color: '#FF4500',
      volume: '6,200+ loads/year',
      country: 'CA',
    },

    // Central Canada
    {
      code: 'ON',
      name: 'Ontario',
      region: 'Northeast',
      color: '#FF8C00',
      volume: '25,000+ loads/year',
      country: 'CA',
    },
    {
      code: 'QC',
      name: 'Quebec',
      region: 'Northeast',
      color: '#FFA500',
      volume: '18,500+ loads/year',
      country: 'CA',
    },

    // Atlantic Canada
    {
      code: 'NB',
      name: 'New Brunswick',
      region: 'Northeast',
      color: '#FFD700',
      volume: '3,800+ loads/year',
      country: 'CA',
    },
    {
      code: 'NS',
      name: 'Nova Scotia',
      region: 'Northeast',
      color: '#FFFF00',
      volume: '4,200+ loads/year',
      country: 'CA',
    },
    {
      code: 'PE',
      name: 'Prince Edward Island',
      region: 'Northeast',
      color: '#ADFF2F',
      volume: '1,200+ loads/year',
      country: 'CA',
    },
    {
      code: 'NL',
      name: 'Newfoundland and Labrador',
      region: 'Northeast',
      color: '#7FFF00',
      volume: '2,500+ loads/year',
      country: 'CA',
    },

    // Northern Territories
    {
      code: 'NT',
      name: 'Northwest Territories',
      region: 'Mountain West',
      color: '#32CD32',
      volume: '800+ loads/year',
      country: 'CA',
    },
    {
      code: 'NU',
      name: 'Nunavut',
      region: 'Mountain West',
      color: '#00FF00',
      volume: '400+ loads/year',
      country: 'CA',
    },
    {
      code: 'YT',
      name: 'Yukon',
      region: 'Mountain West',
      color: '#00FF32',
      volume: '600+ loads/year',
      country: 'CA',
    },

    // === MEXICO ===
    // Northern Mexico
    {
      code: 'BCN',
      name: 'Baja California Norte',
      region: 'Southwest',
      color: '#00FF7F',
      volume: '8,500+ loads/year',
      country: 'MX',
    },
    {
      code: 'SON',
      name: 'Sonora',
      region: 'Southwest',
      color: '#00FFFF',
      volume: '6,200+ loads/year',
      country: 'MX',
    },
    {
      code: 'CHH',
      name: 'Chihuahua',
      region: 'Southwest',
      color: '#00BFFF',
      volume: '7,800+ loads/year',
      country: 'MX',
    },
    {
      code: 'COA',
      name: 'Coahuila',
      region: 'Southwest',
      color: '#0080FF',
      volume: '5,500+ loads/year',
      country: 'MX',
    },
    {
      code: 'NLE',
      name: 'Nuevo León',
      region: 'Southwest',
      color: '#0040FF',
      volume: '9,200+ loads/year',
      country: 'MX',
    },
    {
      code: 'TAM',
      name: 'Tamaulipas',
      region: 'Southwest',
      color: '#0000FF',
      volume: '6,800+ loads/year',
      country: 'MX',
    },

    // Central Mexico
    {
      code: 'MEX',
      name: 'Estado de México',
      region: 'Southwest',
      color: '#4000FF',
      volume: '12,500+ loads/year',
      country: 'MX',
    },
    {
      code: 'CMX',
      name: 'Ciudad de México',
      region: 'Southwest',
      color: '#8000FF',
      volume: '15,000+ loads/year',
      country: 'MX',
    },
    {
      code: 'JAL',
      name: 'Jalisco',
      region: 'Southwest',
      color: '#BF00FF',
      volume: '8,800+ loads/year',
      country: 'MX',
    },
    {
      code: 'GTO',
      name: 'Guanajuato',
      region: 'Southwest',
      color: '#FF00FF',
      volume: '6,500+ loads/year',
      country: 'MX',
    },

    // Additional Mexican States
    {
      code: 'VER',
      name: 'Veracruz',
      region: 'Southeast',
      color: '#FF00BF',
      volume: '7,200+ loads/year',
      country: 'MX',
    },
    {
      code: 'YUC',
      name: 'Yucatán',
      region: 'Southeast',
      color: '#FF0080',
      volume: '4,500+ loads/year',
      country: 'MX',
    },
  ];

  const handleCreateQuote = async () => {
    setIsCreating(true);
    try {
      const newQuote = multiStateQuoteService.createQuote({
        quoteName: `Multi-State Quote ${new Date().toLocaleDateString()}`,
        client: {
          name: '',
          industry: '',
          headquarters: '',
          contactPerson: '',
          email: '',
          phone: '',
        },
      });

      setCurrentQuote(newQuote);
      setActiveStep('overview');
      onQuoteCreated?.(newQuote);
    } catch (error) {
      console.error('Error creating quote:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleStateToggle = (stateCode: string) => {
    setSelectedStates((prev) =>
      prev.includes(stateCode)
        ? prev.filter((s) => s !== stateCode)
        : [...prev, stateCode]
    );
  };

  const calculateEstimatedValue = () => {
    if (selectedStates.length === 0) return 0;

    // Simplified calculation based on selected states
    const baseValuePerState = 2500000; // $2.5M per state annually
    const consolidationBonus = selectedStates.length > 3 ? 0.15 : 0.08; // 15% or 8% bonus
    const baseValue = selectedStates.length * baseValuePerState;
    return baseValue * (1 + consolidationBonus);
  };

  const getFilteredStates = () => {
    return availableStates.filter((state) => {
      const countryMatch = selectedCountries.includes(state.country);
      const regionMatch =
        regionFilter === 'all' || state.region === regionFilter;
      return countryMatch && regionMatch;
    });
  };

  const getUniqueRegions = () => {
    const regions = new Set(
      availableStates
        .filter((state) => selectedCountries.includes(state.country))
        .map((state) => state.region)
    );
    return Array.from(regions).sort();
  };

  const handleCountryToggle = (country: string) => {
    setSelectedCountries((prev) =>
      prev.includes(country)
        ? prev.filter((c) => c !== country)
        : [...prev, country]
    );
    setRegionFilter('all'); // Reset region filter when countries change
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `
          linear-gradient(135deg, #1e3a8a 0%, #3730a3 25%, #1e40af 50%, #1d4ed8 75%, #2563eb 100%),
          radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.08) 0%, transparent 50%)
        `,
        backgroundSize: '100% 100%, 800px 800px, 600px 600px',
        padding: '20px',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '36px',
                fontWeight: '800',
                color: 'white',
                margin: '0 0 12px 0',
                background: 'linear-gradient(135deg, #ffffff, #e2e8f0)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              🌎 Multi-State Consolidated Quote Builder
            </h1>
            <p
              style={{
                fontSize: '18px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: '0 0 8px 0',
              }}
            >
              Professional multi-state logistics quote management
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    background: '#10b981',
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite',
                  }}
                />
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  AI Pricing Engine Active
                </span>
              </div>
              <span
                style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}
              >
                {selectedStates.length} states selected • Est. Value: $
                {calculateEstimatedValue().toLocaleString()}
              </span>
            </div>
          </div>
          <button
            onClick={handleCreateQuote}
            disabled={isCreating}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '16px',
              border: 'none',
              fontWeight: '700',
              fontSize: '16px',
              cursor: isCreating ? 'not-allowed' : 'pointer',
              opacity: isCreating ? 0.7 : 1,
              boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.3s ease',
            }}
          >
            {isCreating ? '🔄 Creating...' : '+ New Multi-State Quote'}
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '30px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {[
            { id: 'overview', label: 'Quote Overview', icon: '📋' },
            { id: 'states', label: 'State Selection', icon: '🗺️' },
            { id: 'pricing', label: 'Pricing Model', icon: '💰' },
            { id: 'terms', label: 'Contract Terms', icon: '📄' },
            { id: 'review', label: 'Review & Submit', icon: '✅' },
          ].map((step, index) => (
            <div
              key={step.id}
              style={{ display: 'flex', alignItems: 'center', flex: 1 }}
            >
              <button
                onClick={() => setActiveStep(step.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background:
                    activeStep === step.id
                      ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                      : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: '18px' }}>{step.icon}</span>
                <span>{step.label}</span>
              </button>
              {index < 4 && (
                <div
                  style={{
                    width: '30px',
                    height: '2px',
                    background: 'rgba(255, 255, 255, 0.3)',
                    margin: '0 8px',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          minHeight: '600px',
        }}
      >
        {/* State Selection View */}
        {activeStep === 'states' && (
          <div>
            <div style={{ marginBottom: '30px' }}>
              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '12px',
                }}
              >
                🌍 Select States/Provinces for Cross-Border Quote
              </h2>
              <p
                style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '20px',
                }}
              >
                Choose locations across USA, Canada, and Mexico where your
                client needs logistics services. Our AI will optimize
                cross-border routes and pricing with full regulatory compliance.
              </p>

              {/* Country & Region Filters */}
              <div style={{ marginBottom: '30px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '12px',
                    }}
                  >
                    🌎 Countries/Regions
                  </h3>
                  <div
                    style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
                  >
                    {[
                      { code: 'US', name: 'United States', flag: '🇺🇸' },
                      { code: 'CA', name: 'Canada', flag: '🇨🇦' },
                      { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
                    ].map((country) => (
                      <button
                        key={country.code}
                        onClick={() => handleCountryToggle(country.code)}
                        style={{
                          padding: '10px 16px',
                          borderRadius: '12px',
                          border: selectedCountries.includes(country.code)
                            ? '2px solid #10b981'
                            : '1px solid rgba(255, 255, 255, 0.3)',
                          background: selectedCountries.includes(country.code)
                            ? 'rgba(16, 185, 129, 0.2)'
                            : 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          fontWeight: '600',
                          fontSize: '14px',
                        }}
                      >
                        {country.flag} {country.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '12px',
                    }}
                  >
                    🏔️ Filter by Region
                  </h3>
                  <div
                    style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}
                  >
                    <button
                      onClick={() => setRegionFilter('all')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border:
                          regionFilter === 'all'
                            ? '2px solid #3b82f6'
                            : '1px solid rgba(255, 255, 255, 0.2)',
                        background:
                          regionFilter === 'all'
                            ? 'rgba(59, 130, 246, 0.3)'
                            : 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}
                    >
                      All Regions
                    </button>
                    {getUniqueRegions().map((region) => (
                      <button
                        key={region}
                        onClick={() => setRegionFilter(region)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border:
                            regionFilter === region
                              ? '2px solid #3b82f6'
                              : '1px solid rgba(255, 255, 255, 0.2)',
                          background:
                            regionFilter === region
                              ? 'rgba(59, 130, 246, 0.3)'
                              : 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '16px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  borderRadius: '12px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                <span style={{ fontSize: '24px' }}>💡</span>
                <div>
                  <p
                    style={{
                      color: 'white',
                      fontWeight: '600',
                      margin: '0 0 4px 0',
                    }}
                  >
                    Cross-Border Benefits
                  </p>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: '0',
                      fontSize: '14px',
                    }}
                  >
                    3+ locations: 15% volume discount • Cross-border
                    optimization: 12% savings • USMCA compliance • Single
                    contract across all territories
                  </p>
                </div>
              </div>
            </div>

            {/* State Selection Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
                marginBottom: '30px',
              }}
            >
              {getFilteredStates().map((state) => (
                <div
                  key={state.code}
                  onClick={() => handleStateToggle(state.code)}
                  style={{
                    padding: '24px',
                    borderRadius: '16px',
                    border: selectedStates.includes(state.code)
                      ? '3px solid #10b981'
                      : '2px solid rgba(255, 255, 255, 0.2)',
                    background: selectedStates.includes(state.code)
                      ? 'rgba(16, 185, 129, 0.2)'
                      : 'rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseOver={(e) => {
                    if (!selectedStates.includes(state.code)) {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!selectedStates.includes(state.code)) {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {selectedStates.includes(state.code) && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: '#10b981',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '700',
                      }}
                    >
                      ✓
                    </div>
                  )}

                  <div style={{ marginBottom: '16px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '12px',
                      }}
                    >
                      <div
                        style={{
                          width: '60px',
                          height: '40px',
                          background: state.color,
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          fontWeight: '700',
                          color: 'white',
                        }}
                      >
                        {state.code}
                      </div>
                      <div style={{ fontSize: '24px' }}>
                        {state.country === 'US'
                          ? '🇺🇸'
                          : state.country === 'CA'
                            ? '🇨🇦'
                            : state.country === 'MX'
                              ? '🇲🇽'
                              : '🌍'}
                      </div>
                    </div>
                    <h3
                      style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: 'white',
                        margin: '0 0 4px 0',
                      }}
                    >
                      {state.name}
                    </h3>
                    <p
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        margin: '0 0 8px 0',
                      }}
                    >
                      {state.region}
                    </p>
                  </div>

                  <div
                    style={{
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      marginBottom: '12px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '12px',
                        }}
                      >
                        Annual Volume
                      </span>
                      <span
                        style={{
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '14px',
                        }}
                      >
                        {state.volume}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}
                  >
                    {['Distribution', 'Manufacturing', 'Retail'].map((tag) => (
                      <span
                        key={tag}
                        style={{
                          padding: '4px 8px',
                          background: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '12px',
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontWeight: '500',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Selected States Summary */}
            {selectedStates.length > 0 && (
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: 'white',
                    marginBottom: '16px',
                  }}
                >
                  📊 Selected States Summary
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                  }}
                >
                  <div
                    style={{
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: '#10b981',
                      }}
                    >
                      {selectedStates.length}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '14px',
                      }}
                    >
                      States Selected
                    </div>
                  </div>
                  <div
                    style={{
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: '#3b82f6',
                      }}
                    >
                      ${(calculateEstimatedValue() / 1000000).toFixed(1)}M
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '14px',
                      }}
                    >
                      Est. Annual Value
                    </div>
                  </div>
                  <div
                    style={{
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: '#f59e0b',
                      }}
                    >
                      {selectedStates.length > 3 ? '15%' : '8%'}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '14px',
                      }}
                    >
                      Volume Discount
                    </div>
                  </div>
                  <div
                    style={{
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: '#8b5cf6',
                      }}
                    >
                      8%
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '14px',
                      }}
                    >
                      Route Optimization
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Overview/Welcome View */}
        {activeStep === 'overview' && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>🌎</div>
            <h2
              style={{
                fontSize: '32px',
                fontWeight: '700',
                color: 'white',
                marginBottom: '16px',
              }}
            >
              Cross-Border Consolidated Quote System
            </h2>
            <p
              style={{
                fontSize: '18px',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '40px',
                maxWidth: '600px',
                margin: '0 auto 40px auto',
                lineHeight: '1.6',
              }}
            >
              Create professional consolidated quotes across USA, Canada, and
              Mexico with AI-powered cross-border pricing optimization, USMCA
              compliance, route consolidation, and comprehensive contract
              management.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '24px',
                marginBottom: '40px',
              }}
            >
              {[
                {
                  icon: '🌍',
                  title: 'Cross-Border Intelligence',
                  description:
                    'AI-powered location selection across USA, Canada, and Mexico with regulatory compliance',
                },
                {
                  icon: '💰',
                  title: 'Consolidated Pricing',
                  description:
                    'Volume discounts and cross-border optimization savings with USMCA benefits',
                },
                {
                  icon: '📊',
                  title: 'Advanced Analytics',
                  description:
                    'Real-time pricing analysis with currency conversion and competitive positioning',
                },
                {
                  icon: '🚛',
                  title: 'Cross-Border Optimization',
                  description:
                    'Multi-country route planning with customs clearance and backhaul opportunities',
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  style={{
                    padding: '24px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>
                    {feature.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '8px',
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      margin: '0',
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveStep('states')}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '16px',
                border: 'none',
                fontWeight: '700',
                fontSize: '18px',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 12px 35px rgba(59, 130, 246, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 8px 25px rgba(59, 130, 246, 0.3)';
              }}
            >
              Start Building Quote →
            </button>
          </div>
        )}

        {/* Pricing Model View */}
        {activeStep === 'pricing' && (
          <div>
            <h2
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: 'white',
                marginBottom: '20px',
              }}
            >
              💰 Consolidated Pricing Model
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '30px',
              }}
            >
              Configure pricing across all selected states with volume discounts
              and optimization savings.
            </p>

            {/* Pricing Calculator Preview */}
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                borderRadius: '16px',
                padding: '30px',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                textAlign: 'center',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '24px',
                  marginBottom: '20px',
                }}
              >
                🧮 AI Pricing Calculator
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '20px',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '32px',
                      fontWeight: '700',
                      color: '#10b981',
                    }}
                  >
                    ${(calculateEstimatedValue() / 1000000).toFixed(1)}M
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Total Annual Value
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '32px',
                      fontWeight: '700',
                      color: '#3b82f6',
                    }}
                  >
                    $2.45
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Avg Rate/Mile
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '32px',
                      fontWeight: '700',
                      color: '#f59e0b',
                    }}
                  >
                    18%
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Profit Margin
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowPricingCalculator(true)}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Open Advanced Pricing Calculator
              </button>
            </div>
          </div>
        )}

        {/* Contract Terms View */}
        {activeStep === 'terms' && (
          <div>
            <h2
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: 'white',
                marginBottom: '20px',
              }}
            >
              📄 Contract Terms & SLA
            </h2>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'center',
                padding: '60px 0',
              }}
            >
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>⚙️</div>
              <p style={{ fontSize: '18px' }}>
                Contract terms configuration coming soon...
              </p>
            </div>
          </div>
        )}

        {/* Review & Submit View */}
        {activeStep === 'review' && (
          <div>
            <h2
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: 'white',
                marginBottom: '20px',
              }}
            >
              ✅ Review & Submit Quote
            </h2>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'center',
                padding: '60px 0',
              }}
            >
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>📋</div>
              <p style={{ fontSize: '18px' }}>
                Quote review and submission coming soon...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '30px',
          padding: '0 20px',
        }}
      >
        <button
          onClick={() => {
            const steps = ['overview', 'states', 'pricing', 'terms', 'review'];
            const currentIndex = steps.indexOf(activeStep);
            if (currentIndex > 0) {
              setActiveStep(steps[currentIndex - 1] as any);
            }
          }}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          ← Previous
        </button>

        <button
          onClick={() => {
            const steps = ['overview', 'states', 'pricing', 'terms', 'review'];
            const currentIndex = steps.indexOf(activeStep);
            if (currentIndex < steps.length - 1) {
              setActiveStep(steps[currentIndex + 1] as any);
            }
          }}
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            border: 'none',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
