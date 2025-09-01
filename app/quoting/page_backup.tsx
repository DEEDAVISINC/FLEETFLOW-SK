'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// Quote interface
interface Quote {
  id: string;
  quoteNumber: string;
  type: 'LTL' | 'FTL' | 'Specialized';
  baseRate: number;
  fuelSurcharge: number;
  total: number;
  details: any;
  timestamp: string;
  appliedRule?: string;
}

// Price Rule interface
interface PriceRule {
  id: string;
  name: string;
  quoteType: 'LTL' | 'FTL' | 'Specialized' | 'All';
  baseRate: number;
  fuelSurcharge: number;
  priority: number;
  active: boolean;
  conditions?: {
    minWeight?: number;
    maxWeight?: number;
    equipmentType?: string;
    serviceType?: string;
  };
}

export default function FreightFlowQuotingEngine() {
  const [activeTab, setActiveTab] = useState<
    'LTL' | 'FTL' | 'Specialized' | 'History' | 'Rules'
  >('LTL');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [priceRules, setPriceRules] = useState<PriceRule[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingQuote, setPendingQuote] = useState<Quote | null>(null);
  const [editingRule, setEditingRule] = useState<PriceRule | null>(null);
  const [showRuleForm, setShowRuleForm] = useState(false);

  // LTL State
  const [ltlData, setLtlData] = useState({
    weight: '',
    pallets: '',
    freightClass: '50',
    liftgate: false,
    residential: false,
    origin: '',
    destination: '',
  });

  // FTL State
  const [ftlData, setFtlData] = useState({
    equipmentType: 'Dry Van',
    miles: '',
    origin: '',
    destination: '',
  });

  // Specialized State
  const [specializedData, setSpecializedData] = useState({
    serviceType: 'Hazmat',
    miles: '',
    origin: '',
    destination: '',
  });

  // New Rule Form State
  const [newRule, setNewRule] = useState<Partial<PriceRule>>({
    name: '',
    quoteType: 'LTL',
    baseRate: 0,
    fuelSurcharge: 0,
    priority: 5,
    active: true,
    conditions: {},
  });

  // Load data from localStorage
  useEffect(() => {
    const savedQuotes = localStorage.getItem('freightflow-quotes');
    const savedRules = localStorage.getItem('freightflow-price-rules');

    if (savedQuotes) {
      setQuotes(JSON.parse(savedQuotes));
    }

    if (savedRules) {
      setPriceRules(JSON.parse(savedRules));
    } else {
      // Initialize with default rules
      const defaultRules: PriceRule[] = [
        {
          id: '1',
          name: 'Standard LTL',
          quoteType: 'LTL',
          baseRate: 250,
          fuelSurcharge: 18,
          priority: 5,
          active: true,
          conditions: { minWeight: 150, maxWeight: 10000 },
        },
        {
          id: '2',
          name: 'Dry Van FTL',
          quoteType: 'FTL',
          baseRate: 1800,
          fuelSurcharge: 22,
          priority: 5,
          active: true,
          conditions: { equipmentType: 'Dry Van' },
        },
        {
          id: '3',
          name: 'Reefer Premium',
          quoteType: 'FTL',
          baseRate: 2250,
          fuelSurcharge: 25,
          priority: 4,
          active: true,
          conditions: { equipmentType: 'Reefer' },
        },
        {
          id: '4',
          name: 'Hazmat Specialized',
          quoteType: 'Specialized',
          baseRate: 2500,
          fuelSurcharge: 25,
          priority: 3,
          active: true,
          conditions: { serviceType: 'Hazmat' },
        },
      ];
      setPriceRules(defaultRules);
      localStorage.setItem(
        'freightflow-price-rules',
        JSON.stringify(defaultRules)
      );
    }
  }, []);

  // Save quotes to localStorage
  useEffect(() => {
    localStorage.setItem('freightflow-quotes', JSON.stringify(quotes));
  }, [quotes]);

  // Save rules to localStorage
  useEffect(() => {
    localStorage.setItem('freightflow-price-rules', JSON.stringify(priceRules));
  }, [priceRules]);

  // Find applicable price rule
  const findApplicableRule = (
    type: 'LTL' | 'FTL' | 'Specialized',
    data: any
  ): PriceRule | null => {
    const applicableRules = priceRules
      .filter(
        (rule) =>
          rule.active && (rule.quoteType === type || rule.quoteType === 'All')
      )
      .sort((a, b) => a.priority - b.priority);

    for (const rule of applicableRules) {
      if (
        type === 'LTL' &&
        rule.conditions?.minWeight &&
        rule.conditions?.maxWeight
      ) {
        const weight = parseInt(data.weight);
        if (
          weight >= rule.conditions.minWeight &&
          weight <= rule.conditions.maxWeight
        ) {
          return rule;
        }
      } else if (type === 'FTL' && rule.conditions?.equipmentType) {
        if (data.equipmentType === rule.conditions.equipmentType) {
          return rule;
        }
      } else if (type === 'Specialized' && rule.conditions?.serviceType) {
        if (data.serviceType === rule.conditions.serviceType) {
          return rule;
        }
      } else if (rule.quoteType === 'All') {
        return rule;
      }
    }

    return null;
  };

  // Calculate LTL quote
  const calculateLTL = () => {
    if (!ltlData.weight || !ltlData.pallets) return;

    const rule = findApplicableRule('LTL', ltlData);
    const baseRate = rule?.baseRate || 250;
    const fuelSurcharge = rule?.fuelSurcharge || 18;

    const weight = parseInt(ltlData.weight);
    const pallets = parseInt(ltlData.pallets);
    const freightClass = parseInt(ltlData.freightClass);

    // Base calculation
    let total = baseRate + weight * 0.85 + pallets * 45;

    // Freight class multiplier
    const classMultipliers: { [key: number]: number } = {
      50: 1.0,
      55: 1.1,
      60: 1.2,
      65: 1.3,
      70: 1.4,
      77.5: 1.5,
      85: 1.6,
      92.5: 1.7,
      100: 1.8,
      110: 1.9,
      125: 2.0,
      150: 2.2,
      175: 2.4,
      200: 2.6,
      250: 2.8,
      300: 3.0,
      400: 3.5,
      500: 4.0,
    };
    total *= classMultipliers[freightClass] || 1.0;

    // Accessorials
    if (ltlData.liftgate) total += 75;
    if (ltlData.residential) total += 120;

    // Fuel surcharge
    const fuelCost = total * (fuelSurcharge / 100);
    const finalTotal = total + fuelCost;

    const quote: Quote = {
      id: Date.now().toString(),
      quoteNumber: `LTL-${Date.now().toString().slice(-6)}`,
      type: 'LTL',
      baseRate: total,
      fuelSurcharge: fuelCost,
      total: finalTotal,
      details: { ...ltlData, weight, pallets, freightClass },
      timestamp: new Date().toISOString(),
      appliedRule: rule?.name,
    };

    if (finalTotal > 5000) {
      setPendingQuote(quote);
      setShowConfirmation(true);
    } else {
      setQuotes((prev) => [quote, ...prev]);
    }
  };

  // Calculate FTL quote
  const calculateFTL = () => {
    if (!ftlData.miles) return;

    const rule = findApplicableRule('FTL', ftlData);
    const baseRate = rule?.baseRate || 1800;
    const fuelSurcharge = rule?.fuelSurcharge || 22;

    const miles = parseInt(ftlData.miles);

    // Equipment type multipliers
    const equipmentMultipliers: { [key: string]: number } = {
      'Dry Van': 1.0,
      Reefer: 1.25,
      Flatbed: 1.15,
      'Step Deck': 1.35,
      Lowboy: 1.5,
      Tanker: 1.4,
      'Auto Carrier': 1.3,
      Conestoga: 1.2,
    };

    let total = baseRate + miles * 2.85;
    total *= equipmentMultipliers[ftlData.equipmentType] || 1.0;

    // Fuel surcharge
    const fuelCost = total * (fuelSurcharge / 100);
    const finalTotal = total + fuelCost;

    const quote: Quote = {
      id: Date.now().toString(),
      quoteNumber: `FTL-${Date.now().toString().slice(-6)}`,
      type: 'FTL',
      baseRate: total,
      fuelSurcharge: fuelCost,
      total: finalTotal,
      details: { ...ftlData, miles },
      timestamp: new Date().toISOString(),
      appliedRule: rule?.name,
    };

    if (finalTotal > 5000) {
      setPendingQuote(quote);
      setShowConfirmation(true);
    } else {
      setQuotes((prev) => [quote, ...prev]);
    }
  };

  // Calculate Specialized quote
  const calculateSpecialized = () => {
    if (!specializedData.miles) return;

    const rule = findApplicableRule('Specialized', specializedData);
    const baseRate = rule?.baseRate || 2500;
    const fuelSurcharge = rule?.fuelSurcharge || 25;

    const miles = parseInt(specializedData.miles);

    // Service type multipliers
    const serviceMultipliers: { [key: string]: number } = {
      Hazmat: 1.3,
      Refrigerated: 1.45,
      Oversized: 1.8,
      'Team Drivers': 1.6,
      Flatbed: 1.2,
      'White Glove': 1.9,
      Expedited: 1.7,
    };

    let total = baseRate + miles * 3.25;
    total *= serviceMultipliers[specializedData.serviceType] || 1.0;

    // Fuel surcharge
    const fuelCost = total * (fuelSurcharge / 100);
    const finalTotal = total + fuelCost;

    const quote: Quote = {
      id: Date.now().toString(),
      quoteNumber: `SPZ-${Date.now().toString().slice(-6)}`,
      type: 'Specialized',
      baseRate: total,
      fuelSurcharge: fuelCost,
      total: finalTotal,
      details: { ...specializedData, miles },
      timestamp: new Date().toISOString(),
      appliedRule: rule?.name,
    };

    if (finalTotal > 5000) {
      setPendingQuote(quote);
      setShowConfirmation(true);
    } else {
      setQuotes((prev) => [quote, ...prev]);
    }
  };

  // Confirm high-value quote
  const confirmQuote = () => {
    if (pendingQuote) {
      setQuotes((prev) => [pendingQuote, ...prev]);
      setPendingQuote(null);
      setShowConfirmation(false);
    }
  };

  // Save price rule
  const saveRule = () => {
    if (!newRule.name || !newRule.baseRate) return;

    const rule: PriceRule = {
      id: editingRule?.id || Date.now().toString(),
      name: newRule.name!,
      quoteType: newRule.quoteType!,
      baseRate: newRule.baseRate!,
      fuelSurcharge: newRule.fuelSurcharge!,
      priority: newRule.priority!,
      active: newRule.active!,
      conditions: newRule.conditions || {},
    };

    if (editingRule) {
      setPriceRules((prev) => prev.map((r) => (r.id === rule.id ? rule : r)));
    } else {
      setPriceRules((prev) => [...prev, rule]);
    }

    setNewRule({
      name: '',
      quoteType: 'LTL',
      baseRate: 0,
      fuelSurcharge: 0,
      priority: 5,
      active: true,
      conditions: {},
    });
    setEditingRule(null);
    setShowRuleForm(false);
  };

  // Delete price rule
  const deleteRule = (id: string) => {
    setPriceRules((prev) => prev.filter((r) => r.id !== id));
  };

  // Edit price rule
  const editRule = (rule: PriceRule) => {
    setNewRule(rule);
    setEditingRule(rule);
    setShowRuleForm(true);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `
        linear-gradient(135deg, #1e3a8a 0%, #3730a3 25%, #5b21b6 50%, #7c3aed 75%, #8b5cf6 100%),
        radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(124, 58, 237, 0.06) 0%, transparent 50%)
      `,
        backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
        backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
      }}
    >
      {/* Back Button */}
      <div style={{ padding: '16px 24px 0' }}>
        <Link href='/fleetflowdash'>
          <button
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              padding: '12px 20px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{ marginRight: '8px' }}>←</span>
            Back to Dashboard
          </button>
        </Link>
      </div>

      {/* Main Container */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px 32px',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                }}
              >
                <span style={{ fontSize: '32px' }}>💰</span>
              </div>
              <div>
                <h1
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: '0 0 8px 0',
                    textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  FreightFlow Quoting Engine
                </h1>
                <p
                  style={{
                    fontSize: '18px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    margin: '0 0 12px 0',
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                >
                  Professional freight pricing with intelligent rate
                  optimization
                </p>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '24px' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        background: '#4ade80',
                        borderRadius: '50%',
                        boxShadow: '0 0 10px rgba(74, 222, 128, 0.5)',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.9)',
                      }}
                    >
                      Live Pricing Active
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    {quotes.length} quotes generated today
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 25px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                📊 Export Quotes
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          {[
            { id: 'LTL', label: '📦 LTL Freight', icon: '📦' },
            { id: 'FTL', label: '🚛 FTL Freight', icon: '🚛' },
            { id: 'Specialized', label: '⚡ Specialized', icon: '⚡' },
            { id: 'History', label: '📋 Quote History', icon: '📋' },
            { id: 'Rules', label: '⚙️ Price Rules', icon: '⚙️' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                ...(activeTab === tab.id
                  ? {
                      background: 'rgba(255, 255, 255, 0.95)',
                      color: '#5b21b6',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                      transform: 'translateY(-2px)',
                    }
                  : {
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                    }),
              }}
              onMouseOver={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }
              }}
            >
              <span style={{ marginRight: '8px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* LTL Tab */}
        {activeTab === 'LTL' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                padding: '24px',
                color: 'white',
              }}
            >
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  margin: '0 0 8px 0',
                }}
              >
                📦 LTL Freight Quoting
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                Less-than-truckload shipping with freight class optimization
              </p>
            </div>
            <div style={{ padding: '32px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '24px',
                  marginBottom: '32px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Weight (lbs)
                  </label>
                  <input
                    type='number'
                    value={ltlData.weight}
                    onChange={(e) =>
                      setLtlData({ ...ltlData, weight: e.target.value })
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                    }}
                    placeholder='Enter weight'
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Pallets
                  </label>
                  <input
                    type='number'
                    value={ltlData.pallets}
                    onChange={(e) =>
                      setLtlData({ ...ltlData, pallets: e.target.value })
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                    }}
                    placeholder='Number of pallets'
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Freight Class
                  </label>
                  <select
                    value={ltlData.freightClass}
                    onChange={(e) =>
                      setLtlData({ ...ltlData, freightClass: e.target.value })
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  >
                    {[
                      50, 55, 60, 65, 70, 77.5, 85, 92.5, 100, 110, 125, 150,
                      175, 200, 250, 300, 400, 500,
                    ].map((fc) => (
                      <option
                        key={fc}
                        value={fc}
                        style={{ background: '#1e293b', color: 'white' }}
                      >
                        Class {fc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '24px',
                  marginBottom: '32px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Origin
                  </label>
                  <input
                    type='text'
                    value={ltlData.origin}
                    onChange={(e) =>
                      setLtlData({ ...ltlData, origin: e.target.value })
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                    }}
                    placeholder='Origin city, state'
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Destination
                  </label>
                  <input
                    type='text'
                    value={ltlData.destination}
                    onChange={(e) =>
                      setLtlData({ ...ltlData, destination: e.target.value })
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                    }}
                    placeholder='Destination city, state'
                  />
                </div>
              </div>

              <div
                style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}
              >
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  <input
                    type='checkbox'
                    checked={ltlData.liftgate}
                    onChange={(e) =>
                      setLtlData({ ...ltlData, liftgate: e.target.checked })
                    }
                    style={{ width: '16px', height: '16px' }}
                  />
                  Liftgate Required (+$75)
                </label>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  <input
                    type='checkbox'
                    checked={ltlData.residential}
                    onChange={(e) =>
                      setLtlData({ ...ltlData, residential: e.target.checked })
                    }
                    style={{ width: '16px', height: '16px' }}
                  />
                  Residential Delivery (+$120)
                </label>
              </div>

              <button
                onClick={calculateLTL}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 25px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                🧮 Calculate LTL Quote
              </button>
            </div>
          </div>
        )}

        {/* FTL Tab */}
        {activeTab === 'FTL' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                padding: '24px',
                color: 'white',
              }}
            >
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  margin: '0 0 8px 0',
                }}
              >
                🚛 FTL Freight Quoting
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                Full truckload shipping with equipment-specific pricing
              </p>
            </div>
            <div style={{ padding: '32px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '24px',
                  marginBottom: '32px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Equipment Type
                  </label>
                  <select
                    value={ftlData.equipmentType}
                    onChange={(e) =>
                      setFtlData({ ...ftlData, equipmentType: e.target.value })
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  >
                    {[
                      'Dry Van',
                      'Reefer',
                      'Flatbed',
                      'Step Deck',
                      'Lowboy',
                      'Tanker',
                      'Auto Carrier',
                      'Conestoga',
                    ].map((type) => (
                      <option
                        key={type}
                        value={type}
                        style={{ background: '#1e293b', color: 'white' }}
                      >
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Miles
                  </label>
                  <input
                    type='number'
                    value={ftlData.miles}
                    onChange={(e) =>
                      setFtlData({ ...ftlData, miles: e.target.value })
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                    }}
                    placeholder='Total miles'
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '24px',
                  marginBottom: '32px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Origin
                  </label>
                  <input
                    type='text'
                    value={ftlData.origin}
                    onChange={(e) =>
                      setFtlData({ ...ftlData, origin: e.target.value })
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                    }}
                    placeholder='Origin city, state'
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Destination
                  </label>
                  <input
                    type='text'
                    value={ftlData.destination}
                    onChange={(e) =>
                      setFtlData({ ...ftlData, destination: e.target.value })
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                    }}
                    placeholder='Destination city, state'
                  />
                </div>
              </div>

              <button
                onClick={calculateFTL}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 25px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                🧮 Calculate FTL Quote
              </button>
            </div>
          </div>
        )}

        {/* Specialized Tab */}
        {activeTab === 'Specialized' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                padding: '24px',
                color: 'white',
              }}
            >
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  margin: '0 0 8px 0',
                }}
              >
                ⚡ Specialized Freight Quoting
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                High-value and specialized transportation services
              </p>
            </div>
            <div style={{ padding: '32px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '24px',
                  marginBottom: '32px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Service Type
                  </label>
                  <select
                    value={specializedData.serviceType}
                    onChange={(e) =>
                      setSpecializedData({
                        ...specializedData,
                        serviceType: e.target.value,
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  >
                    {[
                      'Hazmat',
                      'Refrigerated',
                      'Oversized',
                      'Team Drivers',
                      'Flatbed',
                      'White Glove',
                      'Expedited',
                    ].map((type) => (
                      <option
                        key={type}
                        value={type}
                        style={{ background: '#1e293b', color: 'white' }}
                      >
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Miles
                  </label>
                  <input
                    type='number'
                    value={specializedData.miles}
                    onChange={(e) =>
                      setSpecializedData({
                        ...specializedData,
                        miles: e.target.value,
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                    }}
                    placeholder='Total miles'
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '24px',
                  marginBottom: '32px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Origin
                  </label>
                  <input
                    type='text'
                    value={specializedData.origin}
                    onChange={(e) =>
                      setSpecializedData({
                        ...specializedData,
                        origin: e.target.value,
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                    }}
                    placeholder='Origin city, state'
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Destination
                  </label>
                  <input
                    type='text'
                    value={specializedData.destination}
                    onChange={(e) =>
                      setSpecializedData({
                        ...specializedData,
                        destination: e.target.value,
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                    }}
                    placeholder='Destination city, state'
                  />
                </div>
              </div>

              <button
                onClick={calculateSpecialized}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 25px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                🧮 Calculate Specialized Quote
              </button>
            </div>
          </div>
        )}

        {/* Quote History Tab */}
        {activeTab === 'History' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                padding: '24px',
                color: 'white',
              }}
            >
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  margin: '0 0 8px 0',
                }}
              >
                📋 Quote History
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                Track and manage all your freight quotes
              </p>
            </div>
            <div style={{ padding: '32px' }}>
              {quotes.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '48px',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                    📄
                  </div>
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      margin: '0 0 8px 0',
                    }}
                  >
                    No quotes yet
                  </h3>
                  <p style={{ margin: 0 }}>
                    Generate your first quote using the LTL, FTL, or Specialized
                    tabs
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {quotes.map((quote) => (
                    <div
                      key={quote.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.15)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.1)';
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '16px',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              marginBottom: '8px',
                            }}
                          >
                            <span
                              style={{
                                background:
                                  quote.type === 'LTL'
                                    ? '#3b82f6'
                                    : quote.type === 'FTL'
                                      ? '#10b981'
                                      : '#8b5cf6',
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '600',
                              }}
                            >
                              {quote.type}
                            </span>
                            <span
                              style={{
                                color: 'white',
                                fontSize: '18px',
                                fontWeight: '600',
                              }}
                            >
                              {quote.quoteNumber}
                            </span>
                          </div>
                          <p
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '14px',
                              margin: 0,
                            }}
                          >
                            {new Date(quote.timestamp).toLocaleString()}
                          </p>
                          {quote.appliedRule && (
                            <p
                              style={{
                                color: '#4ade80',
                                fontSize: '12px',
                                margin: '4px 0 0 0',
                              }}
                            >
                              Applied Rule: {quote.appliedRule}
                            </p>
                          )}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div
                            style={{
                              color: 'white',
                              fontSize: '24px',
                              fontWeight: 'bold',
                            }}
                          >
                            ${quote.total.toFixed(2)}
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '12px',
                            }}
                          >
                            Base: ${quote.baseRate.toFixed(2)} | Fuel: $
                            {quote.fuelSurcharge.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '16px',
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        {quote.type === 'LTL' && (
                          <>
                            <div>Weight: {quote.details.weight} lbs</div>
                            <div>Pallets: {quote.details.pallets}</div>
                            <div>Class: {quote.details.freightClass}</div>
                            <div>
                              Liftgate: {quote.details.liftgate ? 'Yes' : 'No'}
                            </div>
                            <div>
                              Residential:{' '}
                              {quote.details.residential ? 'Yes' : 'No'}
                            </div>
                          </>
                        )}
                        {quote.type === 'FTL' && (
                          <>
                            <div>Equipment: {quote.details.equipmentType}</div>
                            <div>Miles: {quote.details.miles}</div>
                          </>
                        )}
                        {quote.type === 'Specialized' && (
                          <>
                            <div>Service: {quote.details.serviceType}</div>
                            <div>Miles: {quote.details.miles}</div>
                          </>
                        )}
                        {quote.details.origin && (
                          <div>Origin: {quote.details.origin}</div>
                        )}
                        {quote.details.destination && (
                          <div>Destination: {quote.details.destination}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Price Rules Tab */}
        {activeTab === 'Rules' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                padding: '24px',
                color: 'white',
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
                  <h2
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      margin: '0 0 8px 0',
                    }}
                  >
                    ⚙️ Price Rules Management
                  </h2>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                    Configure automated pricing rules and conditions
                  </p>
                </div>
                <button
                  onClick={() => setShowRuleForm(true)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.2)';
                  }}
                >
                  + Add New Rule
                </button>
              </div>
            </div>
            <div style={{ padding: '32px' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {priceRules.map((rule) => (
                  <div
                    key={rule.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '16px',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '8px',
                          }}
                        >
                          <span
                            style={{
                              background:
                                rule.quoteType === 'LTL'
                                  ? '#3b82f6'
                                  : rule.quoteType === 'FTL'
                                    ? '#10b981'
                                    : rule.quoteType === 'Specialized'
                                      ? '#8b5cf6'
                                      : '#6b7280',
                              color: 'white',
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '600',
                            }}
                          >
                            {rule.quoteType}
                          </span>
                          <span
                            style={{
                              color: 'white',
                              fontSize: '18px',
                              fontWeight: '600',
                            }}
                          >
                            {rule.name}
                          </span>
                          <span
                            style={{
                              background: rule.active ? '#10b981' : '#ef4444',
                              color: 'white',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '10px',
                              fontWeight: '600',
                            }}
                          >
                            {rule.active ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </div>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '14px',
                            margin: 0,
                          }}
                        >
                          Priority: {rule.priority}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => editRule(rule)}
                          style={{
                            background: '#3b82f6',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteRule(rule.id)}
                          style={{
                            background: '#ef4444',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px',
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      <div>Base Rate: ${rule.baseRate}</div>
                      <div>Fuel Surcharge: {rule.fuelSurcharge}%</div>
                      {rule.conditions?.minWeight && (
                        <div>Min Weight: {rule.conditions.minWeight} lbs</div>
                      )}
                      {rule.conditions?.maxWeight && (
                        <div>Max Weight: {rule.conditions.maxWeight} lbs</div>
                      )}
                      {rule.conditions?.equipmentType && (
                        <div>Equipment: {rule.conditions.equipmentType}</div>
                      )}
                      {rule.conditions?.serviceType && (
                        <div>Service: {rule.conditions.serviceType}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* High-Value Quote Confirmation Modal */}
      {showConfirmation && pendingQuote && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
              <h3
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: '0 0 8px 0',
                }}
              >
                High-Value Quote Confirmation
              </h3>
              <p style={{ color: '#6b7280', margin: 0 }}>
                This quote exceeds $5,000. Please confirm to proceed.
              </p>
            </div>
            <div
              style={{
                background: '#f3f4f6',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <span style={{ color: '#374151', fontWeight: '600' }}>
                  Quote Number:
                </span>
                <span style={{ color: '#1f2937' }}>
                  {pendingQuote.quoteNumber}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <span style={{ color: '#374151', fontWeight: '600' }}>
                  Type:
                </span>
                <span style={{ color: '#1f2937' }}>{pendingQuote.type}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <span style={{ color: '#374151', fontWeight: '600' }}>
                  Base Rate:
                </span>
                <span style={{ color: '#1f2937' }}>
                  ${pendingQuote.baseRate.toFixed(2)}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <span style={{ color: '#374151', fontWeight: '600' }}>
                  Fuel Surcharge:
                </span>
                <span style={{ color: '#1f2937' }}>
                  ${pendingQuote.fuelSurcharge.toFixed(2)}
                </span>
              </div>
              <div
                style={{
                  borderTop: '1px solid #d1d5db',
                  paddingTop: '12px',
                  marginTop: '12px',
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
                      color: '#374151',
                      fontWeight: '700',
                      fontSize: '18px',
                    }}
                  >
                    Total:
                  </span>
                  <span
                    style={{
                      color: '#1f2937',
                      fontWeight: '700',
                      fontSize: '18px',
                    }}
                  >
                    ${pendingQuote.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowConfirmation(false)}
                style={{
                  flex: 1,
                  background: '#f3f4f6',
                  color: '#374151',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmQuote}
                style={{
                  flex: 1,
                  background: '#10b981',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Confirm Quote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rule Form Modal */}
      {showRuleForm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
            }}
          >
            <h3
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 24px 0',
              }}
            >
              {editingRule ? 'Edit Price Rule' : 'Add New Price Rule'}
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px',
                  }}
                >
                  Rule Name
                </label>
                <input
                  type='text'
                  value={newRule.name || ''}
                  onChange={(e) =>
                    setNewRule({ ...newRule, name: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                  }}
                  placeholder='Enter rule name'
                />
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Quote Type
                  </label>
                  <select
                    value={newRule.quoteType || 'LTL'}
                    onChange={(e) =>
                      setNewRule({
                        ...newRule,
                        quoteType: e.target.value as any,
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                    }}
                  >
                    <option value='LTL'>LTL</option>
                    <option value='FTL'>FTL</option>
                    <option value='Specialized'>Specialized</option>
                    <option value='All'>All Types</option>
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Priority (1-10)
                  </label>
                  <input
                    type='number'
                    min='1'
                    max='10'
                    value={newRule.priority || 5}
                    onChange={(e) =>
                      setNewRule({
                        ...newRule,
                        priority: parseInt(e.target.value),
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Base Rate ($)
                  </label>
                  <input
                    type='number'
                    value={newRule.baseRate || 0}
                    onChange={(e) =>
                      setNewRule({
                        ...newRule,
                        baseRate: parseFloat(e.target.value),
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                    }}
                    placeholder='Base rate'
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Fuel Surcharge (%)
                  </label>
                  <input
                    type='number'
                    value={newRule.fuelSurcharge || 0}
                    onChange={(e) =>
                      setNewRule({
                        ...newRule,
                        fuelSurcharge: parseFloat(e.target.value),
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                    }}
                    placeholder='Fuel surcharge percentage'
                  />
                </div>
              </div>

              {/* Conditional Fields */}
              {newRule.quoteType === 'LTL' && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        color: '#374151',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '8px',
                      }}
                    >
                      Min Weight (lbs)
                    </label>
                    <input
                      type='number'
                      value={newRule.conditions?.minWeight || ''}
                      onChange={(e) =>
                        setNewRule({
                          ...newRule,
                          conditions: {
                            ...newRule.conditions,
                            minWeight: parseInt(e.target.value),
                          },
                        })
                      }
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                      }}
                      placeholder='Minimum weight'
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        color: '#374151',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '8px',
                      }}
                    >
                      Max Weight (lbs)
                    </label>
                    <input
                      type='number'
                      value={newRule.conditions?.maxWeight || ''}
                      onChange={(e) =>
                        setNewRule({
                          ...newRule,
                          conditions: {
                            ...newRule.conditions,
                            maxWeight: parseInt(e.target.value),
                          },
                        })
                      }
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                      }}
                      placeholder='Maximum weight'
                    />
                  </div>
                </div>
              )}

              {newRule.quoteType === 'FTL' && (
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Equipment Type
                  </label>
                  <select
                    value={newRule.conditions?.equipmentType || ''}
                    onChange={(e) =>
                      setNewRule({
                        ...newRule,
                        conditions: {
                          ...newRule.conditions,
                          equipmentType: e.target.value,
                        },
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                    }}
                  >
                    <option value=''>Select equipment type</option>
                    {[
                      'Dry Van',
                      'Reefer',
                      'Flatbed',
                      'Step Deck',
                      'Lowboy',
                      'Tanker',
                      'Auto Carrier',
                      'Conestoga',
                    ].map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {newRule.quoteType === 'Specialized' && (
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Service Type
                  </label>
                  <select
                    value={newRule.conditions?.serviceType || ''}
                    onChange={(e) =>
                      setNewRule({
                        ...newRule,
                        conditions: {
                          ...newRule.conditions,
                          serviceType: e.target.value,
                        },
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                    }}
                  >
                    <option value=''>Select service type</option>
                    {[
                      'Hazmat',
                      'Refrigerated',
                      'Oversized',
                      'Team Drivers',
                      'Flatbed',
                      'White Glove',
                      'Expedited',
                    ].map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  <input
                    type='checkbox'
                    checked={newRule.active || false}
                    onChange={(e) =>
                      setNewRule({ ...newRule, active: e.target.checked })
                    }
                    style={{ width: '16px', height: '16px' }}
                  />
                  Active Rule
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => {
                  setShowRuleForm(false);
                  setEditingRule(null);
                  setNewRule({
                    name: '',
                    quoteType: 'LTL',
                    baseRate: 0,
                    fuelSurcharge: 0,
                    priority: 5,
                    active: true,
                    conditions: {},
                  });
                }}
                style={{
                  flex: 1,
                  background: '#f3f4f6',
                  color: '#374151',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveRule}
                style={{
                  flex: 1,
                  background: '#10b981',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                {editingRule ? 'Update Rule' : 'Save Rule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
