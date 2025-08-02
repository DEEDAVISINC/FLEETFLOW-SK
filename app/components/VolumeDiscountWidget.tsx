'use client';

import { useEffect, useState } from 'react';
import { useFeatureFlag } from '../config/feature-flags';

interface CustomerVolumeData {
  customerId: string;
  customerName: string;
  monthlyVolume: number;
  quarterlyVolume: number;
  annualVolume: number;
  averageLoadValue: number;
  paymentTerms: string;
  creditRating: 'A' | 'B' | 'C' | 'D';
  loyaltyYears: number;
  seasonalityFactor: number;
}

interface DiscountTier {
  tierName: string;
  minVolume: number;
  maxVolume: number;
  discountPercentage: number;
  additionalBenefits: string[];
  qualificationCriteria: string[];
}

interface VolumeDiscountAnalysis {
  result: CustomerVolumeData;
  confidence: number;
  reasoning: string;
  recommendations: string[];
  riskFactors: string[];
  currentTier: DiscountTier;
  recommendedTier: DiscountTier;
  potentialSavings: number;
  nextTierRequirement: {
    volumeNeeded: number;
    timeframe: string;
    projectedSavings: number;
  };
  customDiscountRecommendation: {
    suggestedDiscount: number;
    reasoning: string;
    conditions: string[];
  };
}

interface DiscountStructure {
  structureName: string;
  description: string;
  tiers: DiscountTier[];
  effectiveDate: string;
  expirationDate?: string;
  specialConditions: string[];
}

interface VolumeProjection {
  timeframe: 'monthly' | 'quarterly' | 'annual';
  projectedVolume: number;
  confidenceLevel: number;
  seasonalAdjustments: number[];
  growthFactors: string[];
}

export default function VolumeDiscountWidget() {
  const isEnabled = useFeatureFlag('VOLUME_DISCOUNT_STRUCTURE');
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [analysis, setAnalysis] = useState<VolumeDiscountAnalysis | null>(null);
  const [structures, setStructures] = useState<DiscountStructure[]>([]);
  const [projection, setProjection] = useState<VolumeProjection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'analysis' | 'structures' | 'projection'
  >('analysis');

  useEffect(() => {
    if (isEnabled) {
      loadDiscountStructures();
    }
  }, [isEnabled]);

  const loadDiscountStructures = async () => {
    try {
      const response = await fetch(
        '/api/analytics/volume-discount?action=structures'
      );
      const data = await response.json();
      if (data.success) {
        setStructures(data.data);
      }
    } catch (error) {
      console.error('Error loading discount structures:', error);
    }
  };

  const analyzeCustomer = async () => {
    if (!customerId.trim()) {
      setError('Please enter a customer ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/analytics/volume-discount?action=analyze&customerId=${customerId}`
      );
      const data = await response.json();

      if (data.success) {
        setAnalysis(data.data);
        setActiveTab('analysis');
      } else {
        setError(data.error || 'Analysis failed');
      }
    } catch (error) {
      setError('Failed to analyze customer volume');
      console.error('Error analyzing customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadVolumeProjection = async () => {
    if (!customerId.trim()) {
      setError('Please enter a customer ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/analytics/volume-discount?action=projection&customerId=${customerId}&timeframe=quarterly`
      );
      const data = await response.json();

      if (data.success) {
        setProjection(data.data);
        setActiveTab('projection');
      } else {
        setError(data.error || 'Projection failed');
      }
    } catch (error) {
      setError('Failed to load volume projection');
      console.error('Error loading projection:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tierName: string) => {
    switch (tierName.toLowerCase()) {
      case 'standard':
        return '#6b7280';
      case 'bronze':
        return '#cd7f32';
      case 'silver':
        return '#c0c0c0';
      case 'gold':
        return '#ffd700';
      case 'platinum':
        return '#e5e4e2';
      default:
        return '#3b82f6';
    }
  };

  const getCreditRatingColor = (rating: string) => {
    switch (rating) {
      case 'A':
        return '#10b981';
      case 'B':
        return '#f59e0b';
      case 'C':
        return '#ef4444';
      case 'D':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  if (!isEnabled) {
    return (
      <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
        <div className='flex items-center gap-3'>
          <div className='text-2xl'>📊</div>
          <div>
            <h3 className='font-semibold text-yellow-800'>
              Volume Discount Structure
            </h3>
            <p className='text-sm text-yellow-700'>
              Enable ENABLE_VOLUME_DISCOUNT_STRUCTURE=true to access volume
              discount features
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='rounded-lg bg-white p-6 shadow-lg'>
      <div className='mb-6 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='text-3xl'>📊</div>
          <div>
            <h2 className='text-xl font-bold text-gray-900'>
              Volume Discount Structure
            </h2>
            <p className='text-sm text-gray-600'>
              Analyze and optimize volume-based pricing tiers
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className='mb-6 flex space-x-1 rounded-lg bg-gray-100 p-1'>
        <button
          onClick={() => setActiveTab('analysis')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'analysis'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Customer Analysis
        </button>
        <button
          onClick={() => setActiveTab('structures')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'structures'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Discount Structures
        </button>
        <button
          onClick={() => setActiveTab('projection')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'projection'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Volume Projection
        </button>
      </div>

      {/* Customer Analysis Tab */}
      {activeTab === 'analysis' && (
        <div className='space-y-6'>
          <div className='flex gap-4'>
            <input
              type='text'
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder='Enter Customer ID'
              className='flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none'
            />
            <button
              onClick={analyzeCustomer}
              disabled={loading}
              className='rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50'
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
            <button
              onClick={loadVolumeProjection}
              disabled={loading}
              className='rounded-lg bg-green-600 px-6 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50'
            >
              {loading ? 'Loading...' : 'Project Volume'}
            </button>
          </div>

          {error && (
            <div className='rounded-lg bg-red-50 p-4 text-red-600'>{error}</div>
          )}

          {analysis && (
            <div className='space-y-6'>
              {/* Customer Overview */}
              <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                <div className='rounded-lg bg-blue-50 p-4'>
                  <div className='text-2xl font-bold text-blue-600'>
                    ${(analysis.result.annualVolume / 1000).toFixed(0)}K
                  </div>
                  <div className='text-sm text-blue-600'>Annual Volume</div>
                </div>
                <div className='rounded-lg bg-gray-50 p-4'>
                  <div
                    className='text-lg font-bold'
                    style={{
                      color: getTierColor(analysis.currentTier.tierName),
                    }}
                  >
                    {analysis.currentTier.tierName.toUpperCase()}
                  </div>
                  <div className='text-sm text-gray-600'>Current Tier</div>
                </div>
                <div className='rounded-lg bg-green-50 p-4'>
                  <div className='text-2xl font-bold text-green-600'>
                    {analysis.currentTier.discountPercentage}%
                  </div>
                  <div className='text-sm text-green-600'>Current Discount</div>
                </div>
                <div className='rounded-lg bg-orange-50 p-4'>
                  <div className='text-lg font-bold text-orange-600'>
                    ${(analysis.potentialSavings / 1000).toFixed(0)}K
                  </div>
                  <div className='text-sm text-orange-600'>
                    Potential Savings
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='rounded-lg border border-gray-200 p-4'>
                  <h3 className='mb-3 font-semibold text-gray-900'>
                    Customer Profile
                  </h3>
                  <div className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Customer:</span>
                      <span className='font-medium'>
                        {analysis.result.customerName}
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Credit Rating:</span>
                      <span
                        className='font-medium'
                        style={{
                          color: getCreditRatingColor(
                            analysis.result.creditRating
                          ),
                        }}
                      >
                        {analysis.result.creditRating}
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Loyalty Years:</span>
                      <span className='font-medium'>
                        {analysis.result.loyaltyYears}
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Payment Terms:</span>
                      <span className='font-medium'>
                        {analysis.result.paymentTerms}
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Avg Load Value:</span>
                      <span className='font-medium'>
                        ${analysis.result.averageLoadValue}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='rounded-lg border border-gray-200 p-4'>
                  <h3 className='mb-3 font-semibold text-gray-900'>
                    Volume Breakdown
                  </h3>
                  <div className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Monthly:</span>
                      <span className='font-medium'>
                        ${(analysis.result.monthlyVolume / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Quarterly:</span>
                      <span className='font-medium'>
                        ${(analysis.result.quarterlyVolume / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Annual:</span>
                      <span className='font-medium'>
                        ${(analysis.result.annualVolume / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Seasonality Factor:</span>
                      <span className='font-medium'>
                        {analysis.result.seasonalityFactor}x
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tier Comparison */}
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='rounded-lg border border-gray-200 p-4'>
                  <h3 className='mb-3 font-semibold text-gray-900'>
                    Current Tier: {analysis.currentTier.tierName}
                  </h3>
                  <div className='mb-3'>
                    <div className='text-lg font-bold text-blue-600'>
                      {analysis.currentTier.discountPercentage}% Discount
                    </div>
                    <div className='text-sm text-gray-600'>
                      ${(analysis.currentTier.minVolume / 1000).toFixed(0)}K - $
                      {analysis.currentTier.maxVolume === Infinity
                        ? '∞'
                        : (analysis.currentTier.maxVolume / 1000).toFixed(0) +
                          'K'}
                    </div>
                  </div>
                  <div>
                    <h4 className='mb-2 text-sm font-medium text-gray-900'>
                      Benefits:
                    </h4>
                    <ul className='space-y-1'>
                      {analysis.currentTier.additionalBenefits.map(
                        (benefit, index) => (
                          <li key={index} className='text-xs text-gray-600'>
                            • {benefit}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>

                <div className='rounded-lg border border-gray-200 p-4'>
                  <h3 className='mb-3 font-semibold text-gray-900'>
                    Recommended Tier: {analysis.recommendedTier.tierName}
                  </h3>
                  <div className='mb-3'>
                    <div className='text-lg font-bold text-green-600'>
                      {analysis.recommendedTier.discountPercentage}% Discount
                    </div>
                    <div className='text-sm text-gray-600'>
                      Potential savings: $
                      {(analysis.potentialSavings / 1000).toFixed(0)}K annually
                    </div>
                  </div>
                  <div>
                    <h4 className='mb-2 text-sm font-medium text-gray-900'>
                      Additional Benefits:
                    </h4>
                    <ul className='space-y-1'>
                      {analysis.recommendedTier.additionalBenefits.map(
                        (benefit, index) => (
                          <li key={index} className='text-xs text-gray-600'>
                            • {benefit}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Custom Discount Recommendation */}
              <div className='rounded-lg border border-gray-200 p-4'>
                <h3 className='mb-3 font-semibold text-gray-900'>
                  Custom Discount Recommendation
                </h3>
                <div className='mb-3'>
                  <div className='text-2xl font-bold text-purple-600'>
                    {analysis.customDiscountRecommendation.suggestedDiscount}%
                  </div>
                  <div className='text-sm text-gray-600'>
                    {analysis.customDiscountRecommendation.reasoning}
                  </div>
                </div>
                <div>
                  <h4 className='mb-2 text-sm font-medium text-gray-900'>
                    Conditions:
                  </h4>
                  <ul className='space-y-1'>
                    {analysis.customDiscountRecommendation.conditions.map(
                      (condition, index) => (
                        <li key={index} className='text-xs text-gray-600'>
                          • {condition}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>

              {/* AI Analysis */}
              <div className='rounded-lg border border-gray-200 p-4'>
                <h3 className='mb-3 font-semibold text-gray-900'>
                  AI Analysis
                </h3>
                <p className='text-sm text-gray-600'>{analysis.reasoning}</p>
                <div className='mt-3 text-xs text-gray-500'>
                  Confidence: {analysis.confidence}%
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Discount Structures Tab */}
      {activeTab === 'structures' && (
        <div className='space-y-6'>
          {structures.map((structure, structureIndex) => (
            <div
              key={structureIndex}
              className='rounded-lg border border-gray-200 p-4'
            >
              <div className='mb-4'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  {structure.structureName}
                </h3>
                <p className='text-sm text-gray-600'>{structure.description}</p>
                <div className='mt-2 text-xs text-gray-500'>
                  Effective: {structure.effectiveDate}
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {structure.tiers.map((tier, tierIndex) => (
                  <div
                    key={tierIndex}
                    className='rounded-lg border border-gray-200 p-4'
                  >
                    <div className='mb-3 flex items-center justify-between'>
                      <h4
                        className='font-semibold'
                        style={{ color: getTierColor(tier.tierName) }}
                      >
                        {tier.tierName}
                      </h4>
                      <div className='text-lg font-bold text-blue-600'>
                        {tier.discountPercentage}%
                      </div>
                    </div>

                    <div className='mb-3 text-sm text-gray-600'>
                      ${(tier.minVolume / 1000).toFixed(0)}K -{' '}
                      {tier.maxVolume === Infinity
                        ? '∞'
                        : `$${(tier.maxVolume / 1000).toFixed(0)}K`}
                    </div>

                    <div className='mb-3'>
                      <h5 className='mb-1 text-xs font-medium text-gray-900'>
                        Benefits:
                      </h5>
                      <ul className='space-y-1'>
                        {tier.additionalBenefits.map(
                          (benefit, benefitIndex) => (
                            <li
                              key={benefitIndex}
                              className='text-xs text-gray-600'
                            >
                              • {benefit}
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    <div>
                      <h5 className='mb-1 text-xs font-medium text-gray-900'>
                        Requirements:
                      </h5>
                      <ul className='space-y-1'>
                        {tier.qualificationCriteria.map(
                          (criteria, criteriaIndex) => (
                            <li
                              key={criteriaIndex}
                              className='text-xs text-gray-600'
                            >
                              • {criteria}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {structure.specialConditions.length > 0 && (
                <div className='mt-4 rounded-lg bg-yellow-50 p-3'>
                  <h5 className='mb-2 text-sm font-medium text-yellow-800'>
                    Special Conditions:
                  </h5>
                  <ul className='space-y-1'>
                    {structure.specialConditions.map((condition, index) => (
                      <li key={index} className='text-xs text-yellow-700'>
                        • {condition}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Volume Projection Tab */}
      {activeTab === 'projection' && (
        <div className='space-y-6'>
          {projection ? (
            <>
              <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                <div className='rounded-lg bg-blue-50 p-4'>
                  <div className='text-2xl font-bold text-blue-600'>
                    ${(projection.projectedVolume / 1000).toFixed(0)}K
                  </div>
                  <div className='text-sm text-blue-600'>
                    Projected {projection.timeframe} Volume
                  </div>
                </div>
                <div className='rounded-lg bg-green-50 p-4'>
                  <div className='text-2xl font-bold text-green-600'>
                    {projection.confidenceLevel}%
                  </div>
                  <div className='text-sm text-green-600'>Confidence Level</div>
                </div>
                <div className='rounded-lg bg-orange-50 p-4'>
                  <div className='text-2xl font-bold text-orange-600'>
                    {projection.seasonalAdjustments.length}
                  </div>
                  <div className='text-sm text-orange-600'>
                    Seasonal Factors
                  </div>
                </div>
                <div className='rounded-lg bg-purple-50 p-4'>
                  <div className='text-2xl font-bold text-purple-600'>
                    {projection.growthFactors.length}
                  </div>
                  <div className='text-sm text-purple-600'>Growth Drivers</div>
                </div>
              </div>

              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='rounded-lg border border-gray-200 p-4'>
                  <h3 className='mb-3 font-semibold text-gray-900'>
                    Seasonal Adjustments
                  </h3>
                  <div className='grid grid-cols-4 gap-2'>
                    {projection.seasonalAdjustments.map((adjustment, index) => (
                      <div key={index} className='text-center'>
                        <div className='text-sm font-medium text-gray-900'>
                          Q{index + 1}
                        </div>
                        <div
                          className={`text-lg font-bold ${
                            adjustment > 1 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {(adjustment * 100).toFixed(0)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='rounded-lg border border-gray-200 p-4'>
                  <h3 className='mb-3 font-semibold text-gray-900'>
                    Growth Factors
                  </h3>
                  <ul className='space-y-2'>
                    {projection.growthFactors.map((factor, index) => (
                      <li
                        key={index}
                        className='flex items-center gap-2 text-sm text-gray-600'
                      >
                        <div className='h-2 w-2 rounded-full bg-blue-500'></div>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <div className='text-center text-gray-500'>
              Click "Project Volume" to see volume growth projections for your
              customer
            </div>
          )}
        </div>
      )}
    </div>
  );
}
