'use client';

import { useEffect, useState } from 'react';
import {
  PalletScanningQuoteRequest,
  PalletScanningQuoteResult,
  PalletScanningService,
} from '../services/pallet-scanning-quote-service';

interface PalletScanningQuoteSelectorProps {
  palletCount: number;
  serviceType: 'LTL' | 'FTL' | 'Specialized';
  industry?: string;
  onServiceSelected: (
    service: PalletScanningService,
    quote: PalletScanningQuoteResult
  ) => void;
  onServiceDeselected: () => void;
  className?: string;
}

export default function PalletScanningQuoteSelector({
  palletCount,
  serviceType,
  industry,
  onServiceSelected,
  onServiceDeselected,
  className = '',
}: PalletScanningQuoteSelectorProps) {
  const [quotes, setQuotes] = useState<PalletScanningQuoteResult[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [complianceRequired, setComplianceRequired] = useState(false);
  const [realTimeTracking, setRealTimeTracking] = useState(false);
  const [apiAccess, setApiAccess] = useState(false);

  useEffect(() => {
    if (palletCount > 0) {
      fetchQuotes();
    }
  }, [
    palletCount,
    serviceType,
    industry,
    complianceRequired,
    realTimeTracking,
    apiAccess,
  ]);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const request: PalletScanningQuoteRequest = {
        palletCount,
        serviceType,
        industry,
        complianceRequired,
        realTimeTracking,
        apiAccess,
      };

      const response = await fetch('/api/pallet-scanning-quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      const data = await response.json();
      if (data.success) {
        setQuotes(data.quotes);
      }
    } catch (error) {
      console.error('Error fetching pallet scanning quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelection = (serviceId: string) => {
    const quote = quotes.find((q) => q.service.id === serviceId);
    if (!quote) return;

    if (selectedService === serviceId) {
      // Deselect
      setSelectedService(null);
      onServiceDeselected();
    } else {
      // Select
      setSelectedService(serviceId);
      onServiceSelected(quote.service, quote);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'basic':
        return 'bg-blue-500';
      case 'premium':
        return 'bg-purple-500';
      case 'enterprise':
        return 'bg-gold-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'basic':
        return 'bg-blue-100 text-blue-800';
      case 'premium':
        return 'bg-purple-100 text-purple-800';
      case 'enterprise':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (palletCount === 0) {
    return (
      <div className={`rounded-lg bg-gray-50 p-4 ${className}`}>
        <p className='text-sm text-gray-600'>
          Enter pallet count to see available scanning services
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-900'>
          📦 Pallet Scanning Services
        </h3>
        <span className='text-sm text-gray-500'>
          {palletCount} pallet{palletCount !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Service Requirements */}
      <div className='grid grid-cols-1 gap-3 rounded-lg bg-gray-50 p-3 md:grid-cols-3'>
        <label className='flex items-center space-x-2 text-sm'>
          <input
            type='checkbox'
            checked={complianceRequired}
            onChange={(e) => setComplianceRequired(e.target.checked)}
            className='rounded border-gray-300'
          />
          <span>Compliance Required</span>
        </label>
        <label className='flex items-center space-x-2 text-sm'>
          <input
            type='checkbox'
            checked={realTimeTracking}
            onChange={(e) => setRealTimeTracking(e.target.checked)}
            className='rounded border-gray-300'
          />
          <span>Real-Time Tracking</span>
        </label>
        <label className='flex items-center space-x-2 text-sm'>
          <input
            type='checkbox'
            checked={apiAccess}
            onChange={(e) => setApiAccess(e.target.checked)}
            className='rounded border-gray-300'
          />
          <span>API Integration</span>
        </label>
      </div>

      {loading ? (
        <div className='flex items-center justify-center py-8'>
          <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500'></div>
          <span className='ml-2 text-gray-600'>
            Loading scanning services...
          </span>
        </div>
      ) : (
        <div className='space-y-3'>
          {quotes.map((quote) => (
            <div
              key={quote.service.id}
              className={`cursor-pointer rounded-lg border p-4 transition-all ${
                selectedService === quote.service.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
              onClick={() => handleServiceSelection(quote.service.id)}
            >
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='mb-2 flex items-center space-x-3'>
                    <h4 className='font-semibold text-gray-900'>
                      {quote.service.name}
                    </h4>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getTierBadgeColor(quote.service.tier)}`}
                    >
                      {quote.service.tier.toUpperCase()}
                    </span>
                    {quote.discountApplied > 0 && (
                      <span className='rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800'>
                        {quote.discountApplied}% OFF
                      </span>
                    )}
                  </div>
                  <p className='mb-3 text-sm text-gray-600'>
                    {quote.service.description}
                  </p>

                  {/* Key Features */}
                  <div className='mb-3 flex flex-wrap gap-2'>
                    {quote.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className='rounded bg-gray-100 px-2 py-1 text-xs text-gray-700'
                      >
                        ✓ {feature}
                      </span>
                    ))}
                    {quote.features.length > 3 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDetails(
                            showDetails === quote.service.id
                              ? null
                              : quote.service.id
                          );
                        }}
                        className='rounded bg-blue-100 px-2 py-1 text-xs text-blue-700 hover:bg-blue-200'
                      >
                        +{quote.features.length - 3} more
                      </button>
                    )}
                  </div>

                  {/* Value Propositions */}
                  <div className='grid grid-cols-1 gap-2 text-xs text-gray-600 md:grid-cols-2'>
                    {quote.valuePropositions.slice(0, 2).map((prop, index) => (
                      <div key={index} className='flex items-center space-x-1'>
                        <span className='text-green-500'>●</span>
                        <span>{prop}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='ml-4 text-right'>
                  <div className='space-y-1'>
                    {quote.savings > 0 && (
                      <div className='text-sm text-gray-500 line-through'>
                        ${quote.originalPrice.toFixed(2)}
                      </div>
                    )}
                    <div className='text-xl font-bold text-gray-900'>
                      ${quote.finalPrice.toFixed(2)}
                    </div>
                    {quote.savings > 0 && (
                      <div className='text-sm font-medium text-green-600'>
                        Save ${quote.savings.toFixed(2)}
                      </div>
                    )}
                  </div>
                  <div className='mt-2'>
                    <input
                      type='radio'
                      name='pallet-scanning-service'
                      checked={selectedService === quote.service.id}
                      onChange={() => handleServiceSelection(quote.service.id)}
                      className='h-4 w-4 text-blue-600'
                    />
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {showDetails === quote.service.id && (
                <div className='mt-4 border-t border-gray-200 pt-4'>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div>
                      <h5 className='mb-2 font-medium text-gray-900'>
                        All Features
                      </h5>
                      <ul className='space-y-1 text-sm text-gray-600'>
                        {quote.features.map((feature, index) => (
                          <li
                            key={index}
                            className='flex items-center space-x-2'
                          >
                            <span className='text-green-500'>✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className='mb-2 font-medium text-gray-900'>
                        Value Benefits
                      </h5>
                      <ul className='space-y-1 text-sm text-gray-600'>
                        {quote.valuePropositions.map((prop, index) => (
                          <li
                            key={index}
                            className='flex items-center space-x-2'
                          >
                            <span className='text-blue-500'>●</span>
                            <span>{prop}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {quote.complianceBenefits &&
                    quote.complianceBenefits.length > 0 && (
                      <div className='mt-4'>
                        <h5 className='mb-2 font-medium text-gray-900'>
                          Compliance Benefits
                        </h5>
                        <div className='flex flex-wrap gap-2'>
                          {quote.complianceBenefits.map((benefit, index) => (
                            <span
                              key={index}
                              className='rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800'
                            >
                              🛡️ {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedService && (
        <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
          <div className='flex items-center space-x-2 text-blue-800'>
            <span className='text-lg'>✅</span>
            <span className='font-medium'>
              Pallet Scanning Service Selected
            </span>
          </div>
          <p className='mt-1 text-sm text-blue-700'>
            This service will be added to your quote with enhanced tracking and
            visibility features.
          </p>
        </div>
      )}

      {quotes.length === 0 && !loading && (
        <div className='py-6 text-center text-gray-500'>
          <p>No scanning services available for the current requirements.</p>
          <p className='mt-1 text-sm'>
            Try adjusting your service requirements above.
          </p>
        </div>
      )}
    </div>
  );
}
