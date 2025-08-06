'use client';

import React, { useEffect, useState } from 'react';

interface QuoteData {
  id: string;
  quoteNumber: string;
  type: 'LTL' | 'FTL' | 'Specialized';
  brokerId: string;
  brokerName: string;
  shipper: {
    company: string;
    contact: string;
    email: string;
    phone: string;
  };
  details: any;
  quote: {
    base: string;
    fuel: string;
    accessorials: string;
    total: string;
  };
  status: 'draft' | 'sent_to_shipper' | 'accepted' | 'rejected' | 'expired';
  timestamp: Date;
  route?: string;
}

interface BrokerQuoteInterfaceProps {
  user: {
    id?: string;
    name: string;
    role: string;
    email: string;
  };
  onQuoteGenerated: (quote: QuoteData) => void;
}

export const BrokerQuoteInterface: React.FC<BrokerQuoteInterfaceProps> = ({
  user,
  onQuoteGenerated,
}) => {
  const [quoteType, setQuoteType] = useState<'LTL' | 'FTL' | 'Specialized'>(
    'LTL'
  );
  const [shipperInfo, setShipperInfo] = useState({
    company: '',
    contact: '',
    email: '',
    phone: '',
  });

  const [recentQuotes, setRecentQuotes] = useState<QuoteData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // LTL Form State
  const [ltlForm, setLtlForm] = useState({
    origin: '',
    destination: '',
    weight: '',
    pallets: '',
    freightClass: '100',
    liftgate: false,
    residential: false,
  });

  // FTL Form State
  const [ftlForm, setFtlForm] = useState({
    origin: '',
    destination: '',
    equipment: 'Dry Van',
    miles: '',
  });

  // Specialized Form State
  const [specializedForm, setSpecializedForm] = useState({
    origin: '',
    destination: '',
    services: [] as string[],
    equipment: 'Flatbed',
  });

  // Load broker's quote history on component mount
  useEffect(() => {
    const savedQuotes = localStorage.getItem(`broker-quotes-${user.name}`);
    if (savedQuotes) {
      setRecentQuotes(JSON.parse(savedQuotes).slice(0, 10)); // Last 10 quotes
    }
  }, [user.name]);

  const calculateLTLQuote = (): QuoteData => {
    const weight = parseInt(ltlForm.weight);
    const pallets = parseInt(ltlForm.pallets);
    const freightClass = parseInt(ltlForm.freightClass);

    let baseRate = 350 + weight * 0.85 + pallets * 45;

    // Freight class multipliers
    const classMultipliers: { [key: number]: number } = {
      50: 1.0,
      100: 1.8,
      150: 2.2,
      200: 2.6,
      250: 2.8,
      300: 3.0,
      400: 3.5,
      500: 4.0,
    };
    baseRate *= classMultipliers[freightClass] || 2.0;

    // Accessorials
    let accessorials = 0;
    if (ltlForm.liftgate) accessorials += 75;
    if (ltlForm.residential) accessorials += 120;

    const fuelSurcharge = baseRate * 0.22;
    const total = baseRate + fuelSurcharge + accessorials;

    return {
      id: Date.now().toString(),
      quoteNumber: `LTL-${user.name.replace(/\s+/g, '')}-${Date.now().toString().slice(-6)}`,
      type: 'LTL',
      brokerId: user.id || user.name,
      brokerName: user.name,
      shipper: shipperInfo,
      details: { ...ltlForm, weight, pallets, freightClass },
      quote: {
        base: baseRate.toFixed(2),
        fuel: fuelSurcharge.toFixed(2),
        accessorials: accessorials.toFixed(2),
        total: total.toFixed(2),
      },
      status: 'draft',
      timestamp: new Date(),
      route: `${ltlForm.origin} → ${ltlForm.destination}`,
    };
  };

  const calculateFTLQuote = (): QuoteData => {
    let baseRate = 1800 + Math.random() * 1500;

    // Equipment type multipliers
    switch (ftlForm.equipment) {
      case 'Reefer':
        baseRate *= 1.25;
        break;
      case 'Flatbed':
        baseRate *= 1.15;
        break;
      case 'Step Deck':
        baseRate *= 1.2;
        break;
      case 'Lowboy':
        baseRate *= 1.8;
        break;
      default:
        baseRate *= 1.0;
    }

    const fuelSurcharge = baseRate * 0.22;
    const total = baseRate + fuelSurcharge;

    return {
      id: Date.now().toString(),
      quoteNumber: `FTL-${user.name.replace(/\s+/g, '')}-${Date.now().toString().slice(-6)}`,
      type: 'FTL',
      brokerId: user.id || user.name,
      brokerName: user.name,
      shipper: shipperInfo,
      details: { ...ftlForm },
      quote: {
        base: baseRate.toFixed(2),
        fuel: fuelSurcharge.toFixed(2),
        accessorials: '0.00',
        total: total.toFixed(2),
      },
      status: 'draft',
      timestamp: new Date(),
      route: `${ftlForm.origin} → ${ftlForm.destination}`,
    };
  };

  const calculateSpecializedQuote = (): QuoteData => {
    let baseRate = 2200 + Math.random() * 1800;

    // Service multipliers
    const serviceCount = specializedForm.services.length;
    baseRate *= 1 + serviceCount * 0.15;

    const fuelSurcharge = baseRate * 0.25;
    const total = baseRate + fuelSurcharge;

    return {
      id: Date.now().toString(),
      quoteNumber: `SPE-${user.name.replace(/\s+/g, '')}-${Date.now().toString().slice(-6)}`,
      type: 'Specialized',
      brokerId: user.id || user.name,
      brokerName: user.name,
      shipper: shipperInfo,
      details: { ...specializedForm },
      quote: {
        base: baseRate.toFixed(2),
        fuel: fuelSurcharge.toFixed(2),
        accessorials: '0.00',
        total: total.toFixed(2),
      },
      status: 'draft',
      timestamp: new Date(),
      route: `${specializedForm.origin} → ${specializedForm.destination}`,
    };
  };

  const generateQuote = async () => {
    if (!shipperInfo.company || !shipperInfo.contact || !shipperInfo.email) {
      alert('Please fill in shipper information');
      return;
    }

    setIsLoading(true);

    // Simulate API delay for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      let quote: QuoteData;

      switch (quoteType) {
        case 'LTL':
          if (
            !ltlForm.weight ||
            !ltlForm.pallets ||
            !ltlForm.origin ||
            !ltlForm.destination
          ) {
            alert('Please fill in all LTL fields');
            setIsLoading(false);
            return;
          }
          quote = calculateLTLQuote();
          break;
        case 'FTL':
          if (!ftlForm.origin || !ftlForm.destination || !ftlForm.equipment) {
            alert('Please fill in all FTL fields');
            setIsLoading(false);
            return;
          }
          quote = calculateFTLQuote();
          break;
        case 'Specialized':
          if (
            !specializedForm.origin ||
            !specializedForm.destination ||
            specializedForm.services.length === 0
          ) {
            alert('Please fill in all Specialized fields');
            setIsLoading(false);
            return;
          }
          quote = calculateSpecializedQuote();
          break;
        default:
          setIsLoading(false);
          return;
      }

      // Save to broker's quote history
      const updatedQuotes = [quote, ...recentQuotes].slice(0, 20);
      setRecentQuotes(updatedQuotes);
      localStorage.setItem(
        `broker-quotes-${user.name}`,
        JSON.stringify(updatedQuotes)
      );

      onQuoteGenerated(quote);

      // Auto-send quote via email simulation
      console.log(
        `📧 Quote ${quote.quoteNumber} sent to ${quote.shipper.email}`
      );

      // Update quote status
      setTimeout(() => {
        quote.status = 'sent_to_shipper';
        setRecentQuotes((prev) =>
          prev.map((q) => (q.id === quote.id ? quote : q))
        );
      }, 2000);
    } catch (error) {
      console.error('Error generating quote:', error);
      alert('Error generating quote');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-600',
      sent_to_shipper: 'bg-blue-100 text-blue-600',
      accepted: 'bg-green-100 text-green-600',
      rejected: 'bg-red-100 text-red-600',
      expired: 'bg-orange-100 text-orange-600',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className='grid grid-cols-1 gap-6 xl:grid-cols-2'>
      {/* Left Column: Quote Form */}
      <div className='space-y-4'>
        {/* Shipper Information */}
        <div className='rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4'>
          <h4 className='mb-3 flex items-center font-semibold text-blue-900'>
            <span className='mr-2 text-xl'>📧</span>
            Shipper Information
          </h4>
          <div className='grid grid-cols-2 gap-3'>
            <input
              placeholder='Company Name *'
              value={shipperInfo.company}
              onChange={(e) =>
                setShipperInfo({ ...shipperInfo, company: e.target.value })
              }
              className='rounded-lg border border-blue-200 p-2 focus:border-transparent focus:ring-2 focus:ring-blue-500'
            />
            <input
              placeholder='Contact Name *'
              value={shipperInfo.contact}
              onChange={(e) =>
                setShipperInfo({ ...shipperInfo, contact: e.target.value })
              }
              className='rounded-lg border border-blue-200 p-2 focus:border-transparent focus:ring-2 focus:ring-blue-500'
            />
            <input
              placeholder='Email Address *'
              type='email'
              value={shipperInfo.email}
              onChange={(e) =>
                setShipperInfo({ ...shipperInfo, email: e.target.value })
              }
              className='rounded-lg border border-blue-200 p-2 focus:border-transparent focus:ring-2 focus:ring-blue-500'
            />
            <input
              placeholder='Phone Number'
              value={shipperInfo.phone}
              onChange={(e) =>
                setShipperInfo({ ...shipperInfo, phone: e.target.value })
              }
              className='rounded-lg border border-blue-200 p-2 focus:border-transparent focus:ring-2 focus:ring-blue-500'
            />
          </div>
        </div>

        {/* Quote Type Selector */}
        <div className='flex gap-2'>
          {(['LTL', 'FTL', 'Specialized'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setQuoteType(type)}
              className={`rounded-lg px-4 py-2 font-semibold transition-all ${
                quoteType === type
                  ? 'scale-105 transform bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Dynamic Quote Forms */}
        <div className='rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
          {quoteType === 'LTL' && (
            <div className='space-y-4'>
              <h5 className='flex items-center font-semibold text-gray-900'>
                <span className='mr-2 text-xl'>📦</span>
                LTL Shipment Details
              </h5>
              <div className='grid grid-cols-2 gap-3'>
                <input
                  placeholder='Origin City, ST'
                  value={ltlForm.origin}
                  onChange={(e) =>
                    setLtlForm({ ...ltlForm, origin: e.target.value })
                  }
                  className='rounded-lg border p-2 focus:ring-2 focus:ring-blue-500'
                />
                <input
                  placeholder='Destination City, ST'
                  value={ltlForm.destination}
                  onChange={(e) =>
                    setLtlForm({ ...ltlForm, destination: e.target.value })
                  }
                  className='rounded-lg border p-2 focus:ring-2 focus:ring-blue-500'
                />
                <input
                  placeholder='Weight (lbs)'
                  type='number'
                  value={ltlForm.weight}
                  onChange={(e) =>
                    setLtlForm({ ...ltlForm, weight: e.target.value })
                  }
                  className='rounded-lg border p-2 focus:ring-2 focus:ring-blue-500'
                />
                <input
                  placeholder='Pallet Count'
                  type='number'
                  value={ltlForm.pallets}
                  onChange={(e) =>
                    setLtlForm({ ...ltlForm, pallets: e.target.value })
                  }
                  className='rounded-lg border p-2 focus:ring-2 focus:ring-blue-500'
                />
                <select
                  value={ltlForm.freightClass}
                  onChange={(e) =>
                    setLtlForm({ ...ltlForm, freightClass: e.target.value })
                  }
                  className='rounded-lg border p-2 focus:ring-2 focus:ring-blue-500'
                >
                  <option value='50'>Class 50</option>
                  <option value='100'>Class 100</option>
                  <option value='150'>Class 150</option>
                  <option value='200'>Class 200</option>
                  <option value='250'>Class 250</option>
                  <option value='300'>Class 300</option>
                  <option value='400'>Class 400</option>
                  <option value='500'>Class 500</option>
                </select>
              </div>
              <div className='flex gap-4'>
                <label className='flex items-center'>
                  <input
                    type='checkbox'
                    checked={ltlForm.liftgate}
                    onChange={(e) =>
                      setLtlForm({ ...ltlForm, liftgate: e.target.checked })
                    }
                    className='mr-2'
                  />
                  Liftgate Required (+$75)
                </label>
                <label className='flex items-center'>
                  <input
                    type='checkbox'
                    checked={ltlForm.residential}
                    onChange={(e) =>
                      setLtlForm({ ...ltlForm, residential: e.target.checked })
                    }
                    className='mr-2'
                  />
                  Residential Delivery (+$120)
                </label>
              </div>
            </div>
          )}

          {quoteType === 'FTL' && (
            <div className='space-y-4'>
              <h5 className='flex items-center font-semibold text-gray-900'>
                <span className='mr-2 text-xl'>🚛</span>
                FTL Shipment Details
              </h5>
              <div className='grid grid-cols-2 gap-3'>
                <input
                  placeholder='Origin City, ST'
                  value={ftlForm.origin}
                  onChange={(e) =>
                    setFtlForm({ ...ftlForm, origin: e.target.value })
                  }
                  className='rounded-lg border p-2 focus:ring-2 focus:ring-blue-500'
                />
                <input
                  placeholder='Destination City, ST'
                  value={ftlForm.destination}
                  onChange={(e) =>
                    setFtlForm({ ...ftlForm, destination: e.target.value })
                  }
                  className='rounded-lg border p-2 focus:ring-2 focus:ring-blue-500'
                />
                <select
                  value={ftlForm.equipment}
                  onChange={(e) =>
                    setFtlForm({ ...ftlForm, equipment: e.target.value })
                  }
                  className='col-span-2 rounded-lg border p-2 focus:ring-2 focus:ring-blue-500'
                >
                  <option value='Dry Van'>Dry Van</option>
                  <option value='Reefer'>Reefer (Refrigerated)</option>
                  <option value='Flatbed'>Flatbed</option>
                  <option value='Step Deck'>Step Deck</option>
                  <option value='Lowboy'>Lowboy</option>
                  <option value='Power Only'>Power Only</option>
                </select>
              </div>
            </div>
          )}

          {quoteType === 'Specialized' && (
            <div className='space-y-4'>
              <h5 className='flex items-center font-semibold text-gray-900'>
                <span className='mr-2 text-xl'>⚡</span>
                Specialized Services
              </h5>
              <div className='grid grid-cols-2 gap-3'>
                <input
                  placeholder='Origin City, ST'
                  value={specializedForm.origin}
                  onChange={(e) =>
                    setSpecializedForm({
                      ...specializedForm,
                      origin: e.target.value,
                    })
                  }
                  className='rounded-lg border p-2 focus:ring-2 focus:ring-blue-500'
                />
                <input
                  placeholder='Destination City, ST'
                  value={specializedForm.destination}
                  onChange={(e) =>
                    setSpecializedForm({
                      ...specializedForm,
                      destination: e.target.value,
                    })
                  }
                  className='rounded-lg border p-2 focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div className='space-y-2'>
                <label className='font-medium text-gray-700'>
                  Required Services:
                </label>
                <div className='grid grid-cols-2 gap-2'>
                  {[
                    'Hazmat',
                    'Oversized',
                    'White Glove',
                    'Expedited',
                    'Team Driver',
                    'Warehousing',
                  ].map((service) => (
                    <label key={service} className='flex items-center'>
                      <input
                        type='checkbox'
                        checked={specializedForm.services.includes(service)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSpecializedForm({
                              ...specializedForm,
                              services: [...specializedForm.services, service],
                            });
                          } else {
                            setSpecializedForm({
                              ...specializedForm,
                              services: specializedForm.services.filter(
                                (s) => s !== service
                              ),
                            });
                          }
                        }}
                        className='mr-2'
                      />
                      {service}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={generateQuote}
            disabled={isLoading}
            className={`mt-4 w-full rounded-lg px-6 py-3 font-semibold text-white transition-all ${
              isLoading
                ? 'cursor-not-allowed bg-gray-400'
                : 'transform bg-gradient-to-r from-green-600 to-green-700 shadow-lg hover:scale-105 hover:from-green-700 hover:to-green-800 hover:shadow-xl'
            }`}
          >
            {isLoading ? (
              <span className='flex items-center justify-center'>
                <svg
                  className='mr-3 -ml-1 h-5 w-5 animate-spin text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                   />
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                   />
                </svg>
                Generating Quote...
              </span>
            ) : (
              '💰 Generate Quote & Send to Shipper'
            )}
          </button>
        </div>
      </div>

      {/* Right Column: Recent Quotes & Quick Actions */}
      <div className='space-y-4'>
        {/* Recent Quotes */}
        <div className='rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-4'>
          <h4 className='mb-3 flex items-center font-semibold text-purple-900'>
            <span className='mr-2 text-xl'>📈</span>
            Recent Quotes ({recentQuotes.length})
          </h4>
          <div className='max-h-64 space-y-2 overflow-y-auto'>
            {recentQuotes.length > 0 ? (
              recentQuotes.slice(0, 5).map((quote) => (
                <div
                  key={quote.id}
                  className='rounded-lg border border-purple-100 bg-white p-3 shadow-sm transition-shadow hover:shadow-md'
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='text-sm font-semibold text-gray-900'>
                        {quote.shipper.company}
                      </div>
                      <div className='mb-1 text-xs text-gray-600'>
                        {quote.route}
                      </div>
                      <div className='text-xs text-gray-500'>
                        {quote.quoteNumber} • {quote.type}
                      </div>
                    </div>
                    <div className='ml-3 text-right'>
                      <div className='font-bold text-green-600'>
                        ${parseFloat(quote.quote.total).toLocaleString()}
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${getStatusColor(quote.status)}`}
                      >
                        {quote.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='py-8 text-center text-gray-500'>
                <div className='mb-2 text-4xl'>📋</div>
                <p>No quotes yet. Generate your first quote!</p>
              </div>
            )}
          </div>
          {recentQuotes.length > 5 && (
            <button
              onClick={() => window.open('/quoting', '_blank')}
              className='mt-2 w-full text-sm font-medium text-purple-600 hover:text-purple-800'
            >
              View All {recentQuotes.length} Quotes →
            </button>
          )}
        </div>

        {/* Quick Actions */}
        <div className='rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-teal-50 p-4'>
          <h4 className='mb-3 flex items-center font-semibold text-green-900'>
            <span className='mr-2 text-xl'>🎯</span>
            Quick Actions
          </h4>
          <div className='space-y-2'>
            <button
              onClick={() => window.open('/quoting', '_blank')}
              className='w-full transform rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 p-3 font-semibold text-white shadow-md transition-all hover:scale-105 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg'
            >
              🔗 Open Full Quoting System
            </button>
            <button className='w-full transform rounded-lg bg-gradient-to-r from-green-600 to-green-700 p-3 font-semibold text-white shadow-md transition-all hover:scale-105 hover:from-green-700 hover:to-green-800 hover:shadow-lg'>
              📧 Email Quote Templates
            </button>
            <button className='w-full transform rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 p-3 font-semibold text-white shadow-md transition-all hover:scale-105 hover:from-purple-700 hover:to-purple-800 hover:shadow-lg'>
              📊 View Quote Analytics
            </button>
          </div>
        </div>

        {/* Performance Stats */}
        <div className='rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 p-4'>
          <h4 className='mb-3 flex items-center font-semibold text-orange-900'>
            <span className='mr-2 text-xl'>🏆</span>
            Broker Performance
          </h4>
          <div className='grid grid-cols-2 gap-4 text-center'>
            <div>
              <div className='text-2xl font-bold text-orange-600'>
                {recentQuotes.length}
              </div>
              <div className='text-xs text-gray-600'>Quotes Sent</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-green-600'>
                {recentQuotes.filter((q) => q.status === 'accepted').length}
              </div>
              <div className='text-xs text-gray-600'>Accepted</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-blue-600'>
                {recentQuotes.length > 0
                  ? Math.round(
                      (recentQuotes.filter((q) => q.status === 'accepted')
                        .length /
                        recentQuotes.length) *
                        100
                    )
                  : 0}
                %
              </div>
              <div className='text-xs text-gray-600'>Win Rate</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-purple-600'>
                $
                {recentQuotes
                  .reduce((sum, q) => sum + parseFloat(q.quote.total), 0)
                  .toLocaleString()}
              </div>
              <div className='text-xs text-gray-600'>Total Quoted</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
