'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  PalletScanningQuoteResult,
  PalletScanningService,
} from '../services/pallet-scanning-quote-service';

// Dynamic import to prevent hydration issues
const PalletScanningQuoteSelector = dynamic(
  () => import('../components/PalletScanningQuoteSelector'),
  { ssr: false }
);

interface QuoteData {
  type: 'LTL' | 'FTL' | 'Specialized';
  origin: string;
  destination: string;
  details: any;
  quote: {
    base: string;
    fuel: string;
    accessorials: string;
    palletScanning?: string;
    total: string;
  };
  palletScanningService?: {
    service: PalletScanningService;
    quote: PalletScanningQuoteResult;
  };
  timestamp?: Date;
}

export default function QuotingPage() {
  const [activeTab, setActiveTab] = useState<'ltl' | 'ftl' | 'specialized'>(
    'ltl'
  );
  const [quoteResult, setQuoteResult] = useState<QuoteData | null>(null);
  const [quoteHistory, setQuoteHistory] = useState<QuoteData[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quoteStatus, setQuoteStatus] = useState<'idle' | 'success' | 'error'>(
    'idle'
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingQuote, setPendingQuote] = useState<QuoteData | null>(null);

  // Pallet Scanning State
  const [selectedPalletScanningService, setSelectedPalletScanningService] =
    useState<{
      service: PalletScanningService;
      quote: PalletScanningQuoteResult;
    } | null>(null);

  // LTL Form State
  const [ltlForm, setLtlForm] = useState({
    origin: '',
    destination: '',
    weight: '',
    pallets: '',
    freightClass: '',
    liftgate: false,
    residential: false,
  });

  // FTL Form State
  const [ftlForm, setFtlForm] = useState({
    origin: '',
    destination: '',
    equipment: '',
    pallets: '',
  });

  // Specialized Form State
  const [specializedForm, setSpecializedForm] = useState({
    origin: '',
    destination: '',
    services: [] as string[],
    pallets: '',
  });

  useEffect(() => {
    // Load quote history from localStorage
    const savedHistory = localStorage.getItem('fleetflow-quote-history');
    if (savedHistory) {
      setQuoteHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveQuoteToHistory = (quote: QuoteData) => {
    const newHistory = [
      { ...quote, timestamp: new Date() },
      ...quoteHistory.slice(0, 19),
    ]; // Keep last 20 quotes
    setQuoteHistory(newHistory);
    localStorage.setItem('fleetflow-quote-history', JSON.stringify(newHistory));
  };

  const calculateLTLQuote = (): QuoteData | null => {
    if (
      !ltlForm.origin ||
      !ltlForm.destination ||
      !ltlForm.weight ||
      !ltlForm.pallets ||
      !ltlForm.freightClass
    ) {
      alert('Please fill out all required fields.');
      return null;
    }

    const weight = parseFloat(ltlForm.weight);
    const freightClass = parseFloat(ltlForm.freightClass);
    const pallets = parseInt(ltlForm.pallets);

    const baseRate = 250 + Math.random() * 500;
    const weightMultiplier = Math.max(1, weight / 500);
    const classMultiplier = 1 + (freightClass - 50) / 100;

    let accessorialsCost = 0;
    const accessorialsList = [];
    if (ltlForm.liftgate) {
      accessorialsCost += 75;
      accessorialsList.push('Liftgate');
    }
    if (ltlForm.residential) {
      accessorialsCost += 120;
      accessorialsList.push('Residential');
    }

    const subtotal = baseRate * weightMultiplier * classMultiplier;
    const fuelSurcharge = subtotal * 0.18;

    // Add pallet scanning cost if selected
    let palletScanningCost = 0;
    if (selectedPalletScanningService) {
      palletScanningCost = selectedPalletScanningService.quote.finalPrice;
    }

    const total =
      subtotal + fuelSurcharge + accessorialsCost + palletScanningCost;

    const quoteData: QuoteData = {
      type: 'LTL',
      origin: ltlForm.origin,
      destination: ltlForm.destination,
      details: {
        weight: `${weight} lbs`,
        class: `Class ${freightClass}`,
        pallets: `${pallets} pallets`,
        accessorials: accessorialsList.join(', ') || 'None',
      },
      quote: {
        base: subtotal.toFixed(2),
        fuel: fuelSurcharge.toFixed(2),
        accessorials: accessorialsCost.toFixed(2),
        palletScanning:
          palletScanningCost > 0 ? palletScanningCost.toFixed(2) : undefined,
        total: total.toFixed(2),
      },
    };

    if (selectedPalletScanningService) {
      quoteData.palletScanningService = selectedPalletScanningService;
    }

    return quoteData;
  };

  const calculateFTLQuote = (): QuoteData | null => {
    if (!ftlForm.origin || !ftlForm.destination || !ftlForm.equipment) {
      alert('Please fill out all required fields.');
      return null;
    }

    let baseRate = 1800 + Math.random() * 2000;

    // Rate multipliers based on equipment type
    switch (ftlForm.equipment) {
      case 'Reefer':
        baseRate *= 1.25;
        break;
      case 'Flatbed':
        baseRate *= 1.15;
        break;
      case 'Power Only':
        baseRate *= 0.9;
        break;
      case 'Step Deck':
        baseRate *= 1.2;
        break;
      case 'Lowboy':
        baseRate *= 1.8;
        break;
      case 'Hotshot':
        baseRate *= 0.85;
        break;
      case 'Conestoga':
        baseRate *= 1.35;
        break;
      case 'Box Truck':
        baseRate *= 0.95;
        break;
      case 'Sprinter Van':
        baseRate *= 0.75;
        break;
    }

    const fuelSurcharge = baseRate * 0.22;

    // Add pallet scanning cost if selected
    let palletScanningCost = 0;
    if (selectedPalletScanningService) {
      palletScanningCost = selectedPalletScanningService.quote.finalPrice;
    }

    const total = baseRate + fuelSurcharge + palletScanningCost;

    const quoteData: QuoteData = {
      type: 'FTL',
      origin: ftlForm.origin,
      destination: ftlForm.destination,
      details: { equipment: ftlForm.equipment },
      quote: {
        base: baseRate.toFixed(2),
        fuel: fuelSurcharge.toFixed(2),
        accessorials: '0.00',
        palletScanning:
          palletScanningCost > 0 ? palletScanningCost.toFixed(2) : undefined,
        total: total.toFixed(2),
      },
    };

    if (selectedPalletScanningService) {
      quoteData.palletScanningService = selectedPalletScanningService;
    }

    return quoteData;
  };

  const calculateSpecializedQuote = (): QuoteData | null => {
    if (
      !specializedForm.origin ||
      !specializedForm.destination ||
      specializedForm.services.length === 0
    ) {
      alert(
        'Please fill out all required fields and select at least one specialized service.'
      );
      return null;
    }

    const baseRate = 2500 + Math.random() * 3000;
    let accessorialsCost = 0;

    specializedForm.services.forEach((service) => {
      if (service === 'Hazmat') accessorialsCost += 300;
      if (service === 'Refrigerated') accessorialsCost += 450;
      if (service === 'Oversized') accessorialsCost += 1500;
      if (service === 'Team Drivers') accessorialsCost += 1200;
      if (service === 'Flatbed') accessorialsCost += 200;
    });

    const fuelSurcharge = (baseRate + accessorialsCost) * 0.25;

    // Add pallet scanning cost if selected
    let palletScanningCost = 0;
    if (selectedPalletScanningService) {
      palletScanningCost = selectedPalletScanningService.quote.finalPrice;
    }

    const total =
      baseRate + accessorialsCost + fuelSurcharge + palletScanningCost;

    const quoteData: QuoteData = {
      type: 'Specialized',
      origin: specializedForm.origin,
      destination: specializedForm.destination,
      details: { services: specializedForm.services.join(', ') },
      quote: {
        base: baseRate.toFixed(2),
        fuel: fuelSurcharge.toFixed(2),
        accessorials: accessorialsCost.toFixed(2),
        palletScanning:
          palletScanningCost > 0 ? palletScanningCost.toFixed(2) : undefined,
        total: total.toFixed(2),
      },
    };

    if (selectedPalletScanningService) {
      quoteData.palletScanningService = selectedPalletScanningService;
    }

    return quoteData;
  };

  const handleGetQuote = async () => {
    setIsLoading(true);
    setQuoteStatus('idle');

    // Simulate API call delay for realistic experience
    await new Promise((resolve) =>
      setTimeout(resolve, 1500 + Math.random() * 1000)
    );

    let quoteData: QuoteData | null = null;

    try {
      switch (activeTab) {
        case 'ltl':
          quoteData = calculateLTLQuote();
          break;
        case 'ftl':
          quoteData = calculateFTLQuote();
          break;
        case 'specialized':
          quoteData = calculateSpecializedQuote();
          break;
      }

      if (quoteData) {
        const quoteTotal = parseFloat(quoteData.quote.total);

        // Show confirmation for high-value quotes
        if (quoteTotal > 5000) {
          setPendingQuote(quoteData);
          setShowConfirmation(true);
          setIsLoading(false);
          return;
        }

        // Process quote immediately for smaller amounts
        processQuote(quoteData);
      } else {
        setQuoteStatus('error');
      }
    } catch (error) {
      setQuoteStatus('error');
      console.error('Quote calculation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processQuote = (quoteData: QuoteData) => {
    setQuoteResult(quoteData);
    setShowResult(true);
    setQuoteStatus('success');
    saveQuoteToHistory(quoteData);

    // Reset status after animation
    setTimeout(() => setQuoteStatus('idle'), 3000);
  };

  const confirmHighValueQuote = () => {
    if (pendingQuote) {
      processQuote(pendingQuote);
      setPendingQuote(null);
      setShowConfirmation(false);
    }
  };

  const cancelHighValueQuote = () => {
    setPendingQuote(null);
    setShowConfirmation(false);
  };

  const handleSpecializedServiceChange = (
    service: string,
    checked: boolean
  ) => {
    setSpecializedForm((prev) => ({
      ...prev,
      services: checked
        ? [...prev.services, service]
        : prev.services.filter((s) => s !== service),
    }));
  };

  const getTabButtonClass = (tab: string) => {
    return `py-3 px-4 sm:px-6 border-b-2 font-medium text-sm sm:text-base rounded-t-lg transition-all duration-200 ${
      activeTab === tab
        ? 'bg-blue-600 text-white border-blue-600'
        : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-blue-500'
    }`;
  };

  const getQuoteTypeColor = (type: string) => {
    switch (type) {
      case 'LTL':
        return 'bg-blue-500/30 text-blue-300';
      case 'FTL':
        return 'bg-green-500/30 text-green-300';
      case 'Specialized':
        return 'bg-purple-500/30 text-purple-300';
      default:
        return 'bg-gray-500/30 text-gray-300';
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #9C27B0 0%, #673AB7 100%)',
        padding: '80px 20px 20px 20px',
      }}
    >
      {/* Back Button */}
      <div
        style={{ padding: '0 0 24px 0', maxWidth: '1200px', margin: '0 auto' }}
      >
        <Link
          href='/fleetflowdash'
          style={{ display: 'inline-block', textDecoration: 'none' }}
        >
          <button
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ← Back to Dashboard
          </button>
        </Link>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <h1
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '12px',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            }}
          >
            💰 FREIGHT QUOTING ENGINE
          </h1>
          <p
            style={{
              fontSize: '20px',
              color: 'rgba(255,255,255,0.9)',
              margin: 0,
            }}
          >
            Generate instant quotes for LTL, FTL, and Specialized shipments
          </p>
        </div>

        {/* Quick Quote Section */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>⚡</span>
            <span>Quick Quote - Popular Routes</span>
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            {[
              {
                route: 'LA ↔ Chicago',
                desc: 'West Coast to Midwest',
                price: '$2,450',
              },
              {
                route: 'NYC ↔ Miami',
                desc: 'East Coast Corridor',
                price: '$1,850',
              },
              {
                route: 'Dallas ↔ Atlanta',
                desc: 'Southern Route',
                price: '$1,650',
              },
            ].map((quick, index) => (
              <button
                key={index}
                onClick={() => {
                  const [origin, destination] = quick.route.split(' ↔ ');
                  setLtlForm((prev) => ({
                    ...prev,
                    origin,
                    destination,
                    weight: '1000',
                    pallets: '2',
                    freightClass: '70',
                  }));
                  setActiveTab('ltl');
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 24px rgba(0,0,0,0.15)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 'bold',
                      color: '#2563eb',
                      marginBottom: '4px',
                    }}
                  >
                    {quick.route}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      marginBottom: '8px',
                    }}
                  >
                    {quick.desc}
                  </div>
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#10b981',
                    }}
                  >
                    Est. {quick.price}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <p
            style={{
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '12px',
              textAlign: 'center',
              margin: '12px 0 0 0',
            }}
          >
            💡 Click any route to auto-fill the form with sample data
          </p>
        </div>

        <main
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '32px',
          }}
        >
          {/* Quoting Section */}
          <div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              {/* Tabs */}
              <nav
                style={{
                  display: 'flex',
                  borderBottom: '1px solid #e5e7eb',
                  marginBottom: '24px',
                }}
              >
                <button
                  onClick={() => setActiveTab('ltl')}
                  style={{
                    padding: '12px 20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: 'none',
                    background: activeTab === 'ltl' ? '#3b82f6' : 'transparent',
                    color: activeTab === 'ltl' ? 'white' : '#6b7280',
                    borderRadius: '8px 8px 0 0',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginRight: '4px',
                  }}
                >
                  LTL
                </button>
                <button
                  onClick={() => setActiveTab('ftl')}
                  style={{
                    padding: '12px 20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: 'none',
                    background: activeTab === 'ftl' ? '#3b82f6' : 'transparent',
                    color: activeTab === 'ftl' ? 'white' : '#6b7280',
                    borderRadius: '8px 8px 0 0',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginRight: '4px',
                  }}
                >
                  FTL
                </button>
                <button
                  onClick={() => setActiveTab('specialized')}
                  style={{
                    padding: '12px 20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: 'none',
                    background:
                      activeTab === 'specialized' ? '#3b82f6' : 'transparent',
                    color: activeTab === 'specialized' ? 'white' : '#6b7280',
                    borderRadius: '8px 8px 0 0',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Specialized
                </button>
              </nav>

              {/* Form Panels */}
              <div>
                {/* LTL Form */}
                {activeTab === 'ltl' && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '16px',
                      }}
                    >
                      <input
                        type='text'
                        placeholder='Origin ZIP'
                        value={ltlForm.origin}
                        onChange={(e) =>
                          setLtlForm({ ...ltlForm, origin: e.target.value })
                        }
                        style={{
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          background: 'white',
                        }}
                      />
                      <input
                        type='text'
                        placeholder='Destination ZIP'
                        value={ltlForm.destination}
                        onChange={(e) =>
                          setLtlForm({
                            ...ltlForm,
                            destination: e.target.value,
                          })
                        }
                        style={{
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          background: 'white',
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '16px',
                      }}
                    >
                      <input
                        type='number'
                        placeholder='Total Weight (lbs)'
                        value={ltlForm.weight}
                        onChange={(e) =>
                          setLtlForm({ ...ltlForm, weight: e.target.value })
                        }
                        style={{
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          background: 'white',
                        }}
                      />
                      <input
                        type='number'
                        placeholder='# of Pallets'
                        value={ltlForm.pallets}
                        onChange={(e) =>
                          setLtlForm({ ...ltlForm, pallets: e.target.value })
                        }
                        style={{
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          background: 'white',
                        }}
                      />
                      <select
                        value={ltlForm.freightClass}
                        onChange={(e) =>
                          setLtlForm({
                            ...ltlForm,
                            freightClass: e.target.value,
                          })
                        }
                        style={{
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          background: 'white',
                        }}
                      >
                        <option value=''>Freight Class</option>
                        {[
                          50, 55, 60, 65, 70, 77.5, 85, 92.5, 100, 110, 125,
                          150, 175, 200, 250, 300, 400, 500,
                        ].map((cls) => (
                          <option key={cls} value={cls}>
                            {cls}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: '#374151',
                          fontSize: '14px',
                        }}
                      >
                        <input
                          type='checkbox'
                          checked={ltlForm.liftgate}
                          onChange={(e) =>
                            setLtlForm({
                              ...ltlForm,
                              liftgate: e.target.checked,
                            })
                          }
                          style={{ width: '16px', height: '16px' }}
                        />
                        <span>Liftgate</span>
                      </label>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: '#374151',
                          fontSize: '14px',
                        }}
                      >
                        <input
                          type='checkbox'
                          checked={ltlForm.residential}
                          onChange={(e) =>
                            setLtlForm({
                              ...ltlForm,
                              residential: e.target.checked,
                            })
                          }
                          style={{ width: '16px', height: '16px' }}
                        />
                        <span>Residential Delivery</span>
                      </label>
                    </div>

                    {/* Pallet Scanning Service Selector */}
                    {ltlForm.pallets && parseInt(ltlForm.pallets) > 0 && (
                      <div style={{ marginTop: '24px' }}>
                        <PalletScanningQuoteSelector
                          palletCount={parseInt(ltlForm.pallets)}
                          serviceType='LTL'
                          onServiceSelected={(service, quote) => {
                            setSelectedPalletScanningService({
                              service,
                              quote,
                            });
                          }}
                          onServiceDeselected={() => {
                            setSelectedPalletScanningService(null);
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* FTL Form */}
                {activeTab === 'ftl' && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '16px',
                      }}
                    >
                      <input
                        type='text'
                        placeholder='Origin City, State'
                        value={ftlForm.origin}
                        onChange={(e) =>
                          setFtlForm({ ...ftlForm, origin: e.target.value })
                        }
                        style={{
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          background: 'white',
                        }}
                      />
                      <input
                        type='text'
                        placeholder='Destination City, State'
                        value={ftlForm.destination}
                        onChange={(e) =>
                          setFtlForm({
                            ...ftlForm,
                            destination: e.target.value,
                          })
                        }
                        style={{
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          background: 'white',
                        }}
                      />
                    </div>
                    <select
                      value={ftlForm.equipment}
                      onChange={(e) =>
                        setFtlForm({ ...ftlForm, equipment: e.target.value })
                      }
                      style={{
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        background: 'white',
                        width: '100%',
                      }}
                    >
                      <option value=''>Equipment Type</option>
                      <option value='Dry Van'>53' Dry Van</option>
                      <option value='Reefer'>53' Reefer</option>
                      <option value='Flatbed'>48' Flatbed</option>
                      <option value='Power Only'>Power Only</option>
                      <option value='Step Deck'>Step Deck</option>
                      <option value='Lowboy'>Lowboy</option>
                      <option value='Hotshot'>Hotshot</option>
                      <option value='Conestoga'>Conestoga</option>
                      <option value='Box Truck'>26' Straight Box Truck</option>
                      <option value='Sprinter Van'>Sprinter/Cargo Van</option>
                    </select>

                    {/* Pallet Count for FTL */}
                    <input
                      type='number'
                      placeholder='# of Pallets (optional)'
                      value={ftlForm.pallets}
                      onChange={(e) =>
                        setFtlForm({ ...ftlForm, pallets: e.target.value })
                      }
                      style={{
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        background: 'white',
                      }}
                    />

                    {/* Pallet Scanning Service Selector */}
                    {ftlForm.pallets && parseInt(ftlForm.pallets) > 0 && (
                      <div style={{ marginTop: '24px' }}>
                        <PalletScanningQuoteSelector
                          palletCount={parseInt(ftlForm.pallets)}
                          serviceType='FTL'
                          onServiceSelected={(service, quote) => {
                            setSelectedPalletScanningService({
                              service,
                              quote,
                            });
                          }}
                          onServiceDeselected={() => {
                            setSelectedPalletScanningService(null);
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Specialized Form */}
                {activeTab === 'specialized' && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '16px',
                      }}
                    >
                      <input
                        type='text'
                        placeholder='Origin City, State'
                        value={specializedForm.origin}
                        onChange={(e) =>
                          setSpecializedForm({
                            ...specializedForm,
                            origin: e.target.value,
                          })
                        }
                        style={{
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          background: 'white',
                        }}
                      />
                      <input
                        type='text'
                        placeholder='Destination City, State'
                        value={specializedForm.destination}
                        onChange={(e) =>
                          setSpecializedForm({
                            ...specializedForm,
                            destination: e.target.value,
                          })
                        }
                        style={{
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          background: 'white',
                        }}
                      />
                    </div>
                    <div style={{ paddingTop: '8px' }}>
                      <h3
                        style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '12px',
                        }}
                      >
                        Specialized Services
                      </h3>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(180px, 1fr))',
                          gap: '12px',
                        }}
                      >
                        {[
                          'Hazmat',
                          'Refrigerated',
                          'Oversized',
                          'Flatbed',
                          'Team Drivers',
                        ].map((service) => (
                          <label
                            key={service}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '12px',
                              background: 'rgba(255, 255, 255, 0.8)',
                              borderRadius: '8px',
                              border: '1px solid #e5e7eb',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background =
                                'rgba(255, 255, 255, 0.9)';
                              e.currentTarget.style.borderColor = '#9C27B0';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background =
                                'rgba(255, 255, 255, 0.8)';
                              e.currentTarget.style.borderColor = '#e5e7eb';
                            }}
                          >
                            <input
                              type='checkbox'
                              checked={specializedForm.services.includes(
                                service
                              )}
                              onChange={(e) =>
                                handleSpecializedServiceChange(
                                  service,
                                  e.target.checked
                                )
                              }
                              style={{
                                width: '16px',
                                height: '16px',
                                accentColor: '#9C27B0',
                              }}
                            />
                            <span
                              style={{
                                color: '#374151',
                                fontSize: '14px',
                                fontWeight: '500',
                              }}
                            >
                              {service}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Pallet Count for Specialized */}
                    <div style={{ marginTop: '16px' }}>
                      <input
                        type='number'
                        placeholder='# of Pallets (optional)'
                        value={specializedForm.pallets}
                        onChange={(e) =>
                          setSpecializedForm({
                            ...specializedForm,
                            pallets: e.target.value,
                          })
                        }
                        style={{
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          background: 'white',
                          width: '100%',
                        }}
                      />
                    </div>

                    {/* Pallet Scanning Service Selector */}
                    {specializedForm.pallets &&
                      parseInt(specializedForm.pallets) > 0 && (
                        <div style={{ marginTop: '24px' }}>
                          <PalletScanningQuoteSelector
                            palletCount={parseInt(specializedForm.pallets)}
                            serviceType='Specialized'
                            onServiceSelected={(service, quote) => {
                              setSelectedPalletScanningService({
                                service,
                                quote,
                              });
                            }}
                            onServiceDeselected={() => {
                              setSelectedPalletScanningService(null);
                            }}
                          />
                        </div>
                      )}
                  </div>
                )}
              </div>

              <div style={{ marginTop: '24px' }}>
                <button
                  onClick={handleGetQuote}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    fontWeight: 'bold',
                    padding: '20px 24px',
                    borderRadius: '16px',
                    border: 'none',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    background: isLoading
                      ? 'linear-gradient(45deg, #6b7280, #9ca3af)'
                      : quoteStatus === 'success'
                        ? 'linear-gradient(45deg, #10b981, #059669)'
                        : quoteStatus === 'error'
                          ? 'linear-gradient(45deg, #ef4444, #dc2626)'
                          : 'linear-gradient(45deg, #9C27B0, #673AB7, #3F51B5, #2196F3)',
                    backgroundSize: '300% 300%',
                    animation:
                      isLoading || quoteStatus === 'idle'
                        ? 'gradientShift 3s ease infinite'
                        : 'none',
                    color: 'white',
                    fontSize: '16px',
                    boxShadow: isLoading
                      ? '0 4px 15px rgba(107, 114, 128, 0.4)'
                      : quoteStatus === 'success'
                        ? '0 4px 20px rgba(16, 185, 129, 0.4)'
                        : quoteStatus === 'error'
                          ? '0 4px 20px rgba(239, 68, 68, 0.4)'
                          : '0 8px 25px rgba(156, 39, 176, 0.4)',
                    transform:
                      quoteStatus === 'success' ? 'scale(1.02)' : 'scale(1)',
                  }}
                  onMouseOver={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.transform =
                        'translateY(-2px) scale(1.02)';
                      e.currentTarget.style.boxShadow =
                        '0 12px 35px rgba(156, 39, 176, 0.6)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.transform =
                        'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 25px rgba(156, 39, 176, 0.4)';
                    }
                  }}
                >
                  {/* Shimmer effect overlay */}
                  {!isLoading && quoteStatus === 'idle' && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background:
                          'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                        animation: 'shimmer 2s infinite',
                      }}
                    />
                  )}

                  {/* Button content */}
                  <div
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                    }}
                  >
                    {isLoading ? (
                      <>
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            border: '2px solid rgba(255,255,255,0.3)',
                            borderTop: '2px solid white',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                          }}
                        />
                        <span>Calculating Quote...</span>
                        <span
                          style={{
                            fontSize: '20px',
                            animation: 'bounce 1s infinite',
                          }}
                        >
                          💫
                        </span>
                      </>
                    ) : quoteStatus === 'success' ? (
                      <>
                        <span
                          style={{
                            fontSize: '20px',
                            animation: 'bounce 1s infinite',
                          }}
                        >
                          ✅
                        </span>
                        <span>Quote Generated!</span>
                        <span
                          style={{
                            fontSize: '20px',
                            animation: 'bounce 1s infinite',
                          }}
                        >
                          🎉
                        </span>
                      </>
                    ) : quoteStatus === 'error' ? (
                      <>
                        <span style={{ fontSize: '20px' }}>❌</span>
                        <span>Try Again</span>
                        <span style={{ fontSize: '20px' }}>🔄</span>
                      </>
                    ) : (
                      <>
                        <span
                          style={{
                            fontSize: '24px',
                            animation: 'pulse 2s infinite',
                          }}
                        >
                          💰
                        </span>
                        <span
                          style={{ fontSize: '18px', letterSpacing: '0.5px' }}
                        >
                          GET INSTANT QUOTE
                        </span>
                        <span
                          style={{
                            fontSize: '24px',
                            animation: 'pulse 2s infinite',
                          }}
                        >
                          ⚡
                        </span>
                      </>
                    )}
                  </div>

                  {/* Success ring animation */}
                  {quoteStatus === 'success' && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '16px',
                        border: '3px solid rgba(16, 185, 129, 0.6)',
                        animation: 'ping 1s infinite',
                      }}
                    />
                  )}
                </button>

                <style jsx>{`
                  @keyframes gradientShift {
                    0% {
                      background-position: 0% 50%;
                    }
                    50% {
                      background-position: 100% 50%;
                    }
                    100% {
                      background-position: 0% 50%;
                    }
                  }

                  @keyframes shimmer {
                    0% {
                      left: -100%;
                    }
                    100% {
                      left: 100%;
                    }
                  }

                  @keyframes spin {
                    0% {
                      transform: rotate(0deg);
                    }
                    100% {
                      transform: rotate(360deg);
                    }
                  }

                  @keyframes bounce {
                    0%,
                    20%,
                    50%,
                    80%,
                    100% {
                      transform: translateY(0);
                    }
                    40% {
                      transform: translateY(-10px);
                    }
                    60% {
                      transform: translateY(-5px);
                    }
                  }

                  @keyframes pulse {
                    0%,
                    100% {
                      opacity: 1;
                    }
                    50% {
                      opacity: 0.7;
                    }
                  }

                  @keyframes ping {
                    75%,
                    100% {
                      transform: scale(1.1);
                      opacity: 0;
                    }
                  }
                `}</style>

                {/* Quote processing tips with dynamic content */}
                <div className='mt-3 text-center'>
                  <p className='text-xs text-gray-400 transition-all duration-300'>
                    {isLoading ? (
                      <span className='animate-pulse'>
                        🔄 Analyzing routes and calculating optimal pricing...
                      </span>
                    ) : quoteStatus === 'success' ? (
                      <span className='text-green-400'>
                        ✨ Quote ready! Save to history or generate documents.
                      </span>
                    ) : quoteStatus === 'error' ? (
                      <span className='text-red-400'>
                        ⚠️ Please check all required fields and try again.
                      </span>
                    ) : (
                      <span>
                        💡 Get instant freight quotes with real-time market
                        pricing
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Quote Result Display */}
              {showResult && quoteResult && (
                <div className='animate-fadeIn mt-6'>
                  <div className='rounded-lg border border-gray-600 bg-gray-700 p-6'>
                    <div className='flex items-start justify-between'>
                      <div>
                        <h3 className='text-xl font-bold text-white'>
                          {quoteResult.type} Quote Result
                        </h3>
                        <p className='text-sm text-gray-400'>
                          {quoteResult.origin} to {quoteResult.destination}
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='text-3xl font-extrabold text-green-400'>
                          ${quoteResult.quote.total}
                        </p>
                        <p className='text-xs text-gray-400'>
                          Total Estimated Cost
                        </p>
                      </div>
                    </div>
                    <div className='mt-4 space-y-2 border-t border-gray-600 pt-4 text-sm'>
                      <div className='flex justify-between'>
                        <span className='text-gray-400'>Base Rate:</span>{' '}
                        <span className='font-medium'>
                          ${quoteResult.quote.base}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-400'>Fuel Surcharge:</span>{' '}
                        <span className='font-medium'>
                          ${quoteResult.quote.fuel}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-400'>
                          Accessorials/Services:
                        </span>{' '}
                        <span className='font-medium'>
                          ${quoteResult.quote.accessorials}
                        </span>
                      </div>
                      {quoteResult.quote.palletScanning && (
                        <div className='flex justify-between'>
                          <span className='text-gray-400'>
                            📦 Pallet Scanning Service:
                          </span>{' '}
                          <span className='font-medium text-blue-400'>
                            ${quoteResult.quote.palletScanning}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Pallet Scanning Service Details */}
                    {quoteResult.palletScanningService && (
                      <div className='mt-4 border-t border-gray-600 pt-4'>
                        <div className='rounded-lg bg-blue-900/30 p-4'>
                          <div className='mb-3 flex items-center justify-between'>
                            <h4 className='text-lg font-semibold text-blue-300'>
                              📦{' '}
                              {quoteResult.palletScanningService.service.name}
                            </h4>
                            <span className='rounded-full bg-blue-500 px-2 py-1 text-xs font-medium text-white'>
                              {quoteResult.palletScanningService.service.tier.toUpperCase()}
                            </span>
                          </div>
                          <p className='mb-3 text-sm text-gray-300'>
                            {
                              quoteResult.palletScanningService.service
                                .description
                            }
                          </p>

                          {/* Key Features */}
                          <div className='mb-3 grid grid-cols-1 gap-2 md:grid-cols-2'>
                            {quoteResult.palletScanningService.quote.features
                              .slice(0, 4)
                              .map((feature, index) => (
                                <div
                                  key={index}
                                  className='flex items-center space-x-2 text-sm text-gray-300'
                                >
                                  <span className='text-green-400'>✓</span>
                                  <span>{feature}</span>
                                </div>
                              ))}
                          </div>

                          {/* Value Propositions */}
                          <div className='border-t border-blue-800 pt-3'>
                            <h5 className='mb-2 text-sm font-medium text-blue-200'>
                              Value Benefits:
                            </h5>
                            <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
                              {quoteResult.palletScanningService.quote.valuePropositions
                                .slice(0, 4)
                                .map((prop, index) => (
                                  <div
                                    key={index}
                                    className='flex items-center space-x-2 text-sm text-gray-300'
                                  >
                                    <span className='text-yellow-400'>●</span>
                                    <span>{prop}</span>
                                  </div>
                                ))}
                            </div>
                          </div>

                          {/* Pricing Details */}
                          {quoteResult.palletScanningService.quote.savings >
                            0 && (
                            <div className='mt-3 rounded border border-green-700 bg-green-900/30 p-2'>
                              <div className='flex items-center justify-between text-sm'>
                                <span className='text-green-300'>
                                  Volume Discount Applied:
                                </span>
                                <span className='font-medium text-green-400'>
                                  {
                                    quoteResult.palletScanningService.quote
                                      .discountApplied
                                  }
                                  % OFF (Save $
                                  {quoteResult.palletScanningService.quote.savings.toFixed(
                                    2
                                  )}
                                  )
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Reference Links Section */}
                    <div className='mt-4 border-t border-gray-600 pt-4'>
                      <h4 className='mb-3 text-center text-sm font-medium text-gray-300'>
                        Compare with live market rates:
                      </h4>
                      <div className='flex flex-col gap-3 sm:flex-row'>
                        <a
                          href='https://www.freightquote.com/'
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex-1 rounded-md bg-gray-600 px-4 py-2 text-center font-medium text-white transition duration-200 hover:bg-gray-500'
                        >
                          Check on Freightquote.com
                        </a>
                        <a
                          href='https://www.freightos.com/freight-resources/freight-rate-free-calculator/'
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex-1 rounded-md bg-gray-600 px-4 py-2 text-center font-medium text-white transition duration-200 hover:bg-gray-500'
                        >
                          Check on Freightos.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quote History Section */}
          <div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '24px',
                height: 'fit-content',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '16px',
                }}
              >
                Quote History
              </h2>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  overflowY: 'auto',
                  maxHeight: '600px',
                }}
              >
                {quoteHistory.length === 0 ? (
                  <p
                    style={{
                      color: '#6b7280',
                      textAlign: 'center',
                      padding: '32px 0',
                    }}
                  >
                    No past quotes found.
                  </p>
                ) : (
                  quoteHistory.map((quote, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.9)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.8)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '4px 8px',
                              fontSize: '12px',
                              fontWeight: '600',
                              borderRadius: '12px',
                              background:
                                quote.type === 'LTL'
                                  ? '#dbeafe'
                                  : quote.type === 'FTL'
                                    ? '#dcfce7'
                                    : '#fef3c7',
                              color:
                                quote.type === 'LTL'
                                  ? '#1e40af'
                                  : quote.type === 'FTL'
                                    ? '#166534'
                                    : '#a16207',
                            }}
                          >
                            {quote.type}
                          </span>
                          <p
                            style={{
                              fontWeight: '600',
                              marginTop: '4px',
                              color: '#111827',
                              margin: '4px 0 0 0',
                            }}
                          >
                            {quote.origin} to {quote.destination}
                          </p>
                        </div>
                        <p
                          style={{
                            fontWeight: 'bold',
                            fontSize: '18px',
                            color: '#10b981',
                            margin: 0,
                          }}
                        >
                          ${quote.quote.total}
                        </p>
                      </div>
                      <div style={{ marginTop: '8px' }}>
                        {quote.type === 'LTL' && (
                          <p
                            style={{
                              fontSize: '12px',
                              color: '#6b7280',
                              margin: 0,
                            }}
                          >
                            {quote.details.weight}, {quote.details.class},{' '}
                            {quote.details.pallets}
                          </p>
                        )}
                        {quote.type === 'FTL' && (
                          <p
                            style={{
                              fontSize: '12px',
                              color: '#6b7280',
                              margin: 0,
                            }}
                          >
                            {quote.details.equipment}
                          </p>
                        )}
                        {quote.type === 'Specialized' && (
                          <p
                            style={{
                              fontSize: '12px',
                              color: '#6b7280',
                              margin: 0,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {quote.details.services}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* High Value Quote Confirmation Modal */}
      {showConfirmation && pendingQuote && (
        <div className='bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black p-4'>
          <div className='w-full max-w-md rounded-xl border border-yellow-500 bg-gray-800 shadow-2xl'>
            <div className='p-6'>
              {/* Header */}
              <div className='mb-4 flex items-center space-x-3'>
                <div className='text-4xl'>⚠️</div>
                <div>
                  <h3 className='text-xl font-bold text-yellow-400'>
                    High Value Quote
                  </h3>
                  <p className='text-sm text-gray-400'>Confirmation Required</p>
                </div>
              </div>

              {/* Quote Details */}
              <div className='mb-6 rounded-lg bg-gray-700 p-4'>
                <div className='mb-2 flex items-center justify-between'>
                  <span className='text-gray-300'>Quote Total:</span>
                  <span className='text-2xl font-bold text-yellow-400'>
                    ${pendingQuote.quote.total}
                  </span>
                </div>
                <div className='text-sm text-gray-400'>
                  <p>
                    {pendingQuote.type} • {pendingQuote.origin} →{' '}
                    {pendingQuote.destination}
                  </p>
                </div>
              </div>

              {/* Warning Message */}
              <div className='bg-opacity-50 mb-6 rounded-lg border border-yellow-700 bg-yellow-900 p-4'>
                <p className='text-sm text-yellow-200'>
                  <strong>Notice:</strong> This quote exceeds $5,000. Please
                  review the details carefully and ensure all shipment
                  requirements are accurate before proceeding.
                </p>
              </div>

              {/* Actions */}
              <div className='flex space-x-3'>
                <button
                  onClick={cancelHighValueQuote}
                  className='flex-1 rounded-lg bg-gray-600 px-4 py-3 font-medium text-white transition-colors hover:bg-gray-700'
                >
                  Cancel
                </button>
                <button
                  onClick={confirmHighValueQuote}
                  className='flex-1 rounded-lg bg-yellow-600 px-4 py-3 font-medium text-white transition-colors hover:bg-yellow-700'
                >
                  Confirm Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
