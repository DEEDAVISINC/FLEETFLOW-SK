'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import EmergencyLoadPricingWidget from '../components/EmergencyLoadPricingWidget';
import MultiStateQuoteBuilder from '../components/MultiStateQuoteBuilder';
import SpotRateOptimizationWidget from '../components/SpotRateOptimizationWidget';
import VolumeDiscountWidget from '../components/VolumeDiscountWidget';
import {
  MultiStateConsolidatedQuote,
  multiStateQuoteService,
} from '../services/MultiStateQuoteService';
import { universalQuoteService } from '../services/universal-quote-service';

// Quote interface
interface Quote {
  id: string;
  quoteNumber: string;
  type: 'LTL' | 'FTL' | 'Specialized' | 'Warehousing';
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
  quoteType: 'LTL' | 'FTL' | 'Specialized' | 'Warehousing' | 'All';
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

// Virtual Warehousing Interfaces
interface WarehouseProvider {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  services: string[];
  capacity: number;
  availableCapacity: number;
  baseRate: number;
  markup: number;
  specialties: string[];
  certifications: string[];
}

interface VirtualWarehouseQuote {
  providerId: string;
  providerName: string;
  providerRate: number;
  markup: number;
  totalRate: number;
  capacity: number;
  rating: number;
  specialties: string[];
  estimatedSavings: number;
}

export default function FreightFlowQuotingEngine() {
  const [activeTab, setActiveTab] = useState<
    | 'LTL'
    | 'FTL'
    | 'Specialized'
    | 'Warehousing'
    | 'History'
    | 'Rules'
    | 'Workflow'
  >('Workflow');
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

  // Warehousing State
  const [warehousingData, setWarehousingData] = useState({
    serviceType: 'Storage',
    duration: '',
    palletCount: '',
    specialRequirements: [] as string[],
    location: '',
    temperature: 'Ambient',
    // Virtual Warehousing Enhancements
    preferredProviders: [] as string[],
    bundleWithTransportation: false,
    optimizeLocation: true,
    networkDiscount: 0,
  });

  // Virtual Warehousing State
  const [warehouseProviders, setWarehouseProviders] = useState<
    WarehouseProvider[]
  >([
    {
      id: 'wp-001',
      name: 'LogiCore Solutions',
      location: 'Atlanta, GA',
      rating: 4.8,
      reviewCount: 127,
      services: ['Storage', 'Cross Docking', 'Pick & Pack'],
      capacity: 50000,
      availableCapacity: 15000,
      baseRate: 120,
      markup: 15,
      specialties: ['E-commerce', 'Retail'],
      certifications: ['ISO 9001', 'C-TPAT'],
    },
    {
      id: 'wp-002',
      name: 'Global Storage Partners',
      location: 'Chicago, IL',
      rating: 4.6,
      reviewCount: 89,
      services: ['Storage', 'Temperature Controlled', 'Hazmat Storage'],
      capacity: 75000,
      availableCapacity: 25000,
      baseRate: 140,
      markup: 12,
      specialties: ['Pharmaceutical', 'Food & Beverage'],
      certifications: ['FDA', 'HACCP'],
    },
    {
      id: 'wp-003',
      name: 'Coastal Logistics Hub',
      location: 'Los Angeles, CA',
      rating: 4.9,
      reviewCount: 203,
      services: ['Storage', 'Cross Docking', 'Returns Processing'],
      capacity: 100000,
      availableCapacity: 30000,
      baseRate: 160,
      markup: 18,
      specialties: ['Import/Export', 'Fashion'],
      certifications: ['C-TPAT', 'ISO 14001'],
    },
  ]);

  const [virtualQuotes, setVirtualQuotes] = useState<VirtualWarehouseQuote[]>(
    []
  );
  const [showProviderComparison, setShowProviderComparison] = useState(false);

  // Olimp Integration State
  const [showOlimpIntegration, setShowOlimpIntegration] = useState(false);
  const [olimpConnectionStatus, setOlimpConnectionStatus] = useState<
    'disconnected' | 'connecting' | 'connected' | 'error'
  >('disconnected');

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

  // Integrated Workflow State Management
  const [workflowStep, setWorkflowStep] = useState<
    'customer' | 'analysis' | 'generation' | 'management' | 'multi-state-quotes'
  >('customer');

  // Multi-State Quote functionality
  const [multiStateQuotes, setMultiStateQuotes] = useState<
    MultiStateConsolidatedQuote[]
  >([]);
  const [selectedQuote, setSelectedQuote] =
    useState<MultiStateConsolidatedQuote | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [workflowData, setWorkflowData] = useState({
    customer: {
      id: '',
      name: '',
      tier: '',
      discountRate: 0,
    },
    load: {
      origin: '',
      destination: '',
      weight: '',
      equipment: '',
      serviceType: '',
    },
    analysis: {
      volumeDiscount: 0,
      spotRateAdjustment: 0,
      emergencyPremium: 0,
      competitorPosition: 0,
      riskFactors: [],
      recommendations: [],
    },
    quote: {
      baseRate: 0,
      adjustments: [],
      finalRate: 0,
      alternatives: [],
    },
  });

  // UNIFIED WORKFLOW FUNCTIONS
  const updateWorkflowData = (section: string, data: any) => {
    setWorkflowData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  const handleCustomerChange = (customerId: string) => {
    setSelectedCustomer(customerId);
    const customerData = {
      'SHIP-2024-001': {
        id: customerId,
        name: 'Walmart Distribution Center',
        tier: 'Gold',
        discountRate: 6,
      },
      'SHIP-2024-002': {
        id: customerId,
        name: 'Amazon Fulfillment',
        tier: 'Platinum',
        discountRate: 8,
      },
      'SHIP-2024-003': {
        id: customerId,
        name: 'Home Depot Supply Chain',
        tier: 'Silver',
        discountRate: 4,
      },
      'SHIP-2024-004': {
        id: customerId,
        name: 'Target Logistics',
        tier: 'Gold',
        discountRate: 6,
      },
      'SHIP-2024-005': {
        id: customerId,
        name: 'Costco Wholesale',
        tier: 'Gold',
        discountRate: 6,
      },
    }[customerId] || { id: '', name: '', tier: '', discountRate: 0 };
    updateWorkflowData('customer', customerData);
  };

  const runAIAnalysis = async () => {
    if (!selectedCustomer) {
      alert('Please select a customer first');
      return;
    }

    // 🎯 COMPLETE UNIFIED CALCULATION - ALL FOUR PRICING ENGINES
    let baseRate = 2000;
    if (workflowData.load.weight) {
      baseRate = 2000 + (parseInt(workflowData.load.weight) / 1000) * 50;
    }
    let finalRate = baseRate;
    const adjustments: any[] = [];
    const enginesUsed: string[] = [];

    try {
      // 🚨 ENGINE 1: EMERGENCY LOAD PRICING
      const isEmergencyLoad =
        workflowData.load.urgency === 'emergency' ||
        workflowData.load.urgency === 'critical' ||
        workflowData.load.equipment === 'expedited';

      if (isEmergencyLoad) {
        try {
          const emergencyResponse = await fetch(
            '/api/analytics/emergency-pricing?action=strategies'
          );
          const emergencyData = await emergencyResponse.json();
          const emergencyPremium = baseRate * 0.25; // 25% premium
          adjustments.push({
            engine: 'Emergency Load Pricing',
            type: 'Emergency Premium',
            amount: emergencyPremium,
            percentage: 25,
            reasoning: 'Emergency delivery requires premium pricing',
          });
          finalRate += emergencyPremium;
          enginesUsed.push('🚨 Emergency Pricing');
        } catch (error) {
          console.error('Emergency pricing error:', error);
        }
      }

      // 📊 ENGINE 2: SPOT RATE OPTIMIZATION (Always enabled for market intelligence)
      try {
        const spotRateResponse = await fetch(
          '/api/analytics/spot-rate?action=market-intelligence'
        );
        const spotRateData = await spotRateResponse.json();
        const marketAdjustment = baseRate * 0.05; // 5% market adjustment
        adjustments.push({
          engine: 'Spot Rate Optimization',
          type: 'Market Rate Adjustment',
          amount: marketAdjustment,
          percentage: 5,
          reasoning: 'Market conditions analyzed for competitive positioning',
        });
        finalRate += marketAdjustment;
        enginesUsed.push('📊 Spot Rate Intel');
      } catch (error) {
        console.error('Spot rate error:', error);
      }

      // 💰 ENGINE 3: VOLUME DISCOUNT
      if (workflowData.customer.discountRate > 0) {
        try {
          const volumeResponse = await fetch(
            '/api/analytics/volume-discount?action=structures'
          );
          const volumeData = await volumeResponse.json();
          const discountAmount =
            finalRate * (workflowData.customer.discountRate / 100);
          adjustments.push({
            engine: 'Volume Discount',
            type: 'Customer Loyalty Discount',
            amount: -discountAmount,
            percentage: -workflowData.customer.discountRate,
            reasoning: `${workflowData.customer.tier} tier customer gets ${workflowData.customer.discountRate}% discount`,
          });
          finalRate -= discountAmount;
          enginesUsed.push('💰 Volume Discount');
        } catch (error) {
          console.error('Volume discount error:', error);
        }
      }

      // 🏢 ENGINE 4: WAREHOUSING SERVICES
      const needsWarehousing =
        workflowData.load.equipment === 'warehousing' ||
        workflowData.load.equipment === 'cross-dock' ||
        workflowData.load.specialServices?.includes('storage');

      if (needsWarehousing) {
        const warehousingCost = 500;
        adjustments.push({
          engine: 'Warehousing Services',
          type: 'Additional Services',
          amount: warehousingCost,
          services: ['Cross-docking', 'Temporary storage'],
          reasoning: 'Warehousing services added to shipment',
        });
        finalRate += warehousingCost;
        enginesUsed.push('🏢 Warehousing');
      }
    } catch (error) {
      console.error('Unified calculation error:', error);
      alert('Error calculating unified quote. Please try again.');
      return;
    }

    // Create quote alternatives with ALL engines applied
    const alternatives = [
      {
        name: 'Standard',
        rate: Math.round(finalRate),
        timeline: '3-day delivery',
        color: '#3b82f6',
        engines: [...enginesUsed],
        breakdown: adjustments,
      },
      {
        name: 'Express',
        rate: Math.round(finalRate * 1.15),
        timeline: 'Next-day delivery',
        color: '#f59e0b',
        engines: [...enginesUsed, '⚡ Expedited'],
        breakdown: [
          ...adjustments,
          { type: 'Expedited Service', amount: Math.round(finalRate * 0.15) },
        ],
      },
      {
        name: 'Economy',
        rate: Math.round(finalRate * 0.85),
        timeline: '5-day delivery',
        color: '#10b981',
        engines: enginesUsed.filter((e) => !e.includes('Emergency')),
        breakdown: adjustments.filter((a) => !a.engine?.includes('Emergency')),
      },
    ];

    updateWorkflowData('quote', {
      baseRate: Math.round(baseRate),
      adjustments,
      finalRate: Math.round(finalRate),
      alternatives,
      enginesUsed,
    });

    updateWorkflowData('analysis', {
      customerTier: workflowData.customer.tier,
      discountApplied: workflowData.customer.discountRate,
      enginesUsed,
      totalAdjustments: adjustments.length,
      breakdown: adjustments,
      calculationSummary: `Combined ${enginesUsed.length} pricing engines for intelligent quote`,
    });

    setWorkflowStep('generation');
  };

  const handleLoadChange = (field: string, value: string) => {
    updateWorkflowData('load', { [field]: value });
  };

  // 🔗 BROKER INTEGRATION: Create quote and sync to broker dashboard
  const selectQuoteOption = (option: any) => {
    // Get broker context if available
    const brokerSession = localStorage.getItem('brokerSession');
    let brokerInfo = null;
    if (brokerSession) {
      try {
        brokerInfo = JSON.parse(brokerSession);
      } catch (error) {
        console.error('Error parsing broker session:', error);
      }
    }

    // Create comprehensive quote object
    const newQuote: Quote = {
      id: `QT-${Date.now()}`,
      quoteNumber: `QT-${Math.floor(Math.random() * 900000) + 100000}`,
      type:
        workflowData.load.equipment === 'warehousing'
          ? 'Warehousing'
          : workflowData.load.equipment === 'reefer'
            ? 'Specialized'
            : parseInt(workflowData.load.weight || '0') > 10000
              ? 'FTL'
              : 'LTL',
      origin: workflowData.load.origin,
      destination: workflowData.load.destination,
      customer: workflowData.customer.name,
      rate: option.rate,
      fuelSurcharge: Math.round(option.rate * 0.15), // 15% fuel surcharge
      total: Math.round(option.rate * 1.15),
      details: {
        weight: workflowData.load.weight,
        equipment: workflowData.load.equipment,
        urgency: workflowData.load.urgency,
        timeline: option.timeline,
        engines: option.engines || [],
        breakdown: option.breakdown || [],
        customerTier: workflowData.customer.tier,
        discountApplied: workflowData.customer.discountRate,
        brokerInfo: brokerInfo
          ? {
              brokerId: brokerInfo.id,
              brokerName: brokerInfo.brokerName,
              brokerCode: brokerInfo.brokerCode,
              companyName: brokerInfo.companyName,
            }
          : null,
      },
      timestamp: new Date().toISOString(),
      appliedRule: `Unified AI Analysis (${workflowData.analysis?.enginesUsed?.length || 0} engines)`,
    };

    // Add to quotes state (saves to localStorage automatically)
    setQuotes((prev) => [newQuote, ...prev]);

    // 🔄 SYNC TO BROKER DASHBOARD: Save to broker-specific storage
    if (brokerInfo) {
      const brokerQuotesKey = `broker-quotes-${brokerInfo.id}`;
      const existingBrokerQuotes = localStorage.getItem(brokerQuotesKey);
      let brokerQuotes = [];
      if (existingBrokerQuotes) {
        try {
          brokerQuotes = JSON.parse(existingBrokerQuotes);
        } catch (error) {
          console.error('Error parsing broker quotes:', error);
        }
      }

      // Add to broker-specific quotes
      brokerQuotes.unshift(newQuote);
      localStorage.setItem(brokerQuotesKey, JSON.stringify(brokerQuotes));

      console.log('🎯 Quote synced to broker dashboard:', {
        quote: newQuote.quoteNumber,
        broker: brokerInfo.brokerName,
        amount: `$${newQuote.total.toLocaleString()}`,
      });
    }

    // Move to management step
    setWorkflowStep('management');
  };

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

  // Calculate Warehousing quote with Virtual Warehousing
  const calculateWarehousing = () => {
    if (!warehousingData.duration || !warehousingData.palletCount) return;

    const rule = findApplicableRule('Warehousing' as any, warehousingData);
    const baseRate = rule?.baseRate || 150; // Base rate per pallet per month
    const fuelSurcharge = rule?.fuelSurcharge || 5;

    const duration = parseInt(warehousingData.duration);
    const palletCount = parseInt(warehousingData.palletCount);

    // Generate Virtual Warehouse Quotes
    const virtualQuotes: VirtualWarehouseQuote[] = warehouseProviders
      .filter(
        (provider) =>
          provider.services.includes(warehousingData.serviceType) &&
          provider.availableCapacity >= palletCount
      )
      .map((provider) => {
        // Base calculation - per pallet per month
        let providerRate = provider.baseRate * palletCount * duration;

        // Service type multipliers
        const serviceMultipliers: { [key: string]: number } = {
          Storage: 1.0,
          'Cross Docking': 0.8,
          'Pick & Pack': 1.5,
          Kitting: 1.3,
          'Returns Processing': 1.2,
          'Temperature Controlled': 1.4,
          'Hazmat Storage': 2.0,
        };
        providerRate *= serviceMultipliers[warehousingData.serviceType] || 1.0;

        // Temperature requirements
        if (warehousingData.temperature === 'Refrigerated') providerRate *= 1.3;
        if (warehousingData.temperature === 'Frozen') providerRate *= 1.5;

        // Special requirements
        warehousingData.specialRequirements.forEach((req) => {
          if (req === 'Security') providerRate *= 1.1;
          if (req === 'Insurance') providerRate += 50 * palletCount;
          if (req === 'Inventory Management') providerRate *= 1.2;
          if (req === 'EDI Integration') providerRate += 200;
        });

        // Calculate markup and total
        const markup = providerRate * (provider.markup / 100);
        const totalRate = providerRate + markup;

        // Calculate estimated savings vs direct provider
        const directRate = providerRate * 1.25; // Assume 25% markup if going direct
        const estimatedSavings = directRate - totalRate;

        return {
          providerId: provider.id,
          providerName: provider.name,
          providerRate: providerRate,
          markup: markup,
          totalRate: totalRate,
          capacity: provider.availableCapacity,
          rating: provider.rating,
          specialties: provider.specialties,
          estimatedSavings: estimatedSavings,
        };
      })
      .sort((a, b) => a.totalRate - b.totalRate); // Sort by best price

    setVirtualQuotes(virtualQuotes);

    // Use the best quote for the main calculation
    const bestQuote = virtualQuotes[0];
    if (bestQuote) {
      const total = bestQuote.totalRate;
      const serviceFee = total * (fuelSurcharge / 100);
      const finalTotal = total + serviceFee;

      // Apply network discount if applicable
      const networkDiscount =
        warehousingData.networkDiscount > 0
          ? finalTotal * (warehousingData.networkDiscount / 100)
          : 0;
      const finalTotalWithDiscount = finalTotal - networkDiscount;

      const quote: Quote = {
        id: Date.now().toString(),
        quoteNumber: `WH-${Date.now().toString().slice(-6)}`,
        type: 'Warehousing' as any,
        baseRate: total,
        fuelSurcharge: serviceFee,
        total: finalTotalWithDiscount,
        details: {
          ...warehousingData,
          duration,
          palletCount,
          specialRequirements:
            warehousingData.specialRequirements.join(', ') || 'None',
          selectedProvider: bestQuote.providerName,
          providerRate: bestQuote.providerRate,
          markup: bestQuote.markup,
          estimatedSavings: bestQuote.estimatedSavings,
          networkDiscount: networkDiscount,
        },
        timestamp: new Date().toISOString(),
        appliedRule: rule?.name,
      };

      if (finalTotalWithDiscount > 10000) {
        setPendingQuote(quote);
        setShowConfirmation(true);
      } else {
        setQuotes((prev) => [quote, ...prev]);
      }
    }
  };

  // Olimp Warehousing Integration Functions
  const testOlimpIntegration = () => {
    setOlimpConnectionStatus('connecting');

    // Create iframe integration
    const existingIframe = document.getElementById('olimp-iframe');
    if (existingIframe) {
      existingIframe.remove();
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'olimp-iframe';
    iframe.src = 'https://app.olimpwarehousing.com/rfq?loggedIn=true';
    iframe.width = '100%';
    iframe.height = '600px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '8px';

    iframe.onload = () => {
      console.log('Olimp iframe loaded successfully');
      setOlimpConnectionStatus('connected');
    };

    iframe.onerror = () => {
      console.log('Olimp iframe failed, trying popup');
      setOlimpConnectionStatus('error');
      // Fallback to popup
      window.open(
        'https://app.olimpwarehousing.com/rfq?loggedIn=true',
        '_blank',
        'width=1200,height=800'
      );
    };

    // Add iframe to container
    const container = document.getElementById('olimp-container');
    if (container) {
      container.appendChild(iframe);
    }

    setShowOlimpIntegration(true);
  };

  const closeOlimpIntegration = () => {
    const iframe = document.getElementById('olimp-iframe');
    if (iframe) {
      iframe.remove();
    }
    setShowOlimpIntegration(false);
    setOlimpConnectionStatus('disconnected');
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
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Back Button */}
      <div style={{ padding: '16px 24px 0' }}>
        <Link href='/'>
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
            { id: 'Workflow', label: '🎯 AI Workflow', icon: '🎯' },
            { id: 'LTL', label: '📦 LTL Freight', icon: '📦' },
            { id: 'FTL', label: '🚛 FTL Freight', icon: '🚛' },
            { id: 'Specialized', label: '⚡ Specialized', icon: '⚡' },
            {
              id: 'Warehousing',
              label: '🏢 Warehousing Solutions',
              icon: '🏢',
            },
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

        {/* AI Workflow Tab */}
        {activeTab === 'Workflow' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '32px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Workflow Header */}
            <div style={{ marginBottom: '32px' }}>
              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                🎯 AI-Powered Quoting Workflow
              </h2>
              <p
                style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: '1.6',
                }}
              >
                Intelligent quote generation that combines customer context,
                market intelligence, and AI analysis
              </p>
            </div>

            {/* Workflow Steps Navigation */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '8px',
                marginBottom: '32px',
              }}
            >
              {[
                { id: 'customer', label: '👤 Customer & Load', icon: '👤' },
                { id: 'analysis', label: '🧠 AI Analysis', icon: '🧠' },
                { id: 'generation', label: '💎 Quote Generation', icon: '💎' },
                { id: 'management', label: '📋 Management', icon: '📋' },
                {
                  id: 'multi-state-quotes',
                  label: '🌎 Multi-State Quotes',
                  icon: '🌎',
                },
              ].map((step) => (
                <button
                  key={step.id}
                  onClick={() => setWorkflowStep(step.id as any)}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                    ...(workflowStep === step.id
                      ? {
                          background: 'rgba(255, 255, 255, 0.25)',
                          color: 'white',
                          boxShadow: '0 4px 16px rgba(255, 255, 255, 0.1)',
                        }
                      : {
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }),
                  }}
                >
                  {step.icon} {step.label}
                </button>
              ))}
            </div>

            {/* Workflow Content */}
            {workflowStep === 'customer' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '16px',
                  }}
                >
                  Step 1: Customer & Load Details
                </h3>

                {/* Customer Selection */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <h4 style={{ color: 'white', marginBottom: '16px' }}>
                    Customer Selection
                  </h4>
                  <select
                    value={selectedCustomer}
                    onChange={(e) => handleCustomerChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  >
                    <option value=''>Select Customer...</option>
                    <option value='SHIP-2024-001'>
                      SHIP-2024-001 - Walmart Distribution Center
                    </option>
                    <option value='SHIP-2024-002'>
                      SHIP-2024-002 - Amazon Fulfillment
                    </option>
                    <option value='SHIP-2024-003'>
                      SHIP-2024-003 - Home Depot Supply Chain
                    </option>
                    <option value='SHIP-2024-004'>
                      SHIP-2024-004 - Target Logistics
                    </option>
                    <option value='SHIP-2024-005'>
                      SHIP-2024-005 - Costco Wholesale
                    </option>
                  </select>
                </div>

                {/* Load Details */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <h4 style={{ color: 'white', marginBottom: '16px' }}>
                    Load Details
                  </h4>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                    }}
                  >
                    <input
                      type='text'
                      placeholder='Origin City, State'
                      onChange={(e) =>
                        handleLoadChange('origin', e.target.value)
                      }
                      style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '14px',
                      }}
                    />
                    <input
                      type='text'
                      placeholder='Destination City, State'
                      onChange={(e) =>
                        handleLoadChange('destination', e.target.value)
                      }
                      style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '14px',
                      }}
                    />
                    <input
                      type='text'
                      placeholder='Weight (lbs)'
                      onChange={(e) =>
                        handleLoadChange('weight', e.target.value)
                      }
                      style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '14px',
                      }}
                    />
                    <select
                      onChange={(e) =>
                        handleLoadChange('equipment', e.target.value)
                      }
                      style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '14px',
                      }}
                    >
                      <option value=''>Select Equipment...</option>
                      <option value='dry-van'>Dry Van</option>
                      <option value='reefer'>Reefer</option>
                      <option value='flatbed'>Flatbed</option>
                      <option value='step-deck'>Step Deck</option>
                      <option value='expedited'>
                        🚨 Expedited (Emergency)
                      </option>
                      <option value='warehousing'>
                        🏢 Warehousing Services
                      </option>
                      <option value='cross-dock'>🏢 Cross-Docking</option>
                    </select>
                  </div>
                </div>

                {/* Urgency Level */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <h4 style={{ color: 'white', marginBottom: '16px' }}>
                    Urgency Level
                  </h4>
                  <select
                    onChange={(e) =>
                      handleLoadChange('urgency', e.target.value)
                    }
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  >
                    <option value=''>Select Urgency...</option>
                    <option value='standard'>📦 Standard (3-5 days)</option>
                    <option value='urgent'>⚡ Urgent (1-2 days)</option>
                    <option value='critical'>🚨 Critical (Same day)</option>
                    <option value='emergency'>🔥 Emergency (ASAP)</option>
                  </select>
                </div>

                <button
                  onClick={runAIAnalysis}
                  style={{
                    padding: '16px 32px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    alignSelf: 'flex-start',
                  }}
                >
                  🧠 Analyze with AI →
                </button>
              </div>
            )}

            {workflowStep === 'analysis' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '16px',
                  }}
                >
                  Step 2: AI Analysis Engine
                </h3>

                {/* Integrated Analysis Widgets */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '24px',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    <h4 style={{ color: 'white', marginBottom: '12px' }}>
                      💰 Volume Discount Analysis
                    </h4>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '14px',
                      }}
                    >
                      Customer Tier:{' '}
                      {workflowData.customer.tier || 'Not Selected'} (
                      {workflowData.customer.discountRate || 0}% discount)
                      <br />
                      Engines Used:{' '}
                      {workflowData.analysis?.enginesUsed?.join(', ') || 'None'}
                      <br />
                      Calculation:{' '}
                      {workflowData.analysis?.calculationSummary ||
                        'Select customer and click Analyze'}
                    </p>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    <h4 style={{ color: 'white', marginBottom: '12px' }}>
                      📊 Spot Rate Intelligence
                    </h4>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '14px',
                      }}
                    >
                      Market Demand: High (+12%)
                      <br />
                      Route Competition: Moderate
                      <br />
                      Fuel Trends: Stable
                    </p>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    <h4 style={{ color: 'white', marginBottom: '12px' }}>
                      🚨 Emergency Pricing
                    </h4>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '14px',
                      }}
                    >
                      Urgency Level: Standard
                      <br />
                      Premium: 0%
                      <br />
                      Availability: Good
                    </p>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    <h4 style={{ color: 'white', marginBottom: '12px' }}>
                      🏆 Competitive Position
                    </h4>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '14px',
                      }}
                    >
                      Market Position: 8% below avg
                      <br />
                      Win Probability: 85%
                      <br />
                      Recommendation: Competitive
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setWorkflowStep('generation')}
                  style={{
                    padding: '16px 32px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    alignSelf: 'flex-start',
                  }}
                >
                  💎 Generate Quotes →
                </button>
              </div>
            )}

            {workflowStep === 'generation' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '16px',
                  }}
                >
                  Step 3: Quote Generation
                </h3>

                {/* Quote Options - Dynamic from AI Analysis */}
                <div style={{ display: 'flex', gap: '24px' }}>
                  {(
                    workflowData.quote?.alternatives || [
                      {
                        name: 'Standard',
                        rate: 2450,
                        timeline: '3-day delivery',
                        color: '#3b82f6',
                      },
                      {
                        name: 'Express',
                        rate: 2850,
                        timeline: 'Next-day delivery',
                        color: '#f59e0b',
                      },
                      {
                        name: 'Economy',
                        rate: 2100,
                        timeline: '5-day delivery',
                        color: '#10b981',
                      },
                    ]
                  ).map((option) => (
                    <div
                      key={option.name}
                      style={{
                        flex: 1,
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: `2px solid ${option.color}40`,
                        textAlign: 'center',
                      }}
                    >
                      <h4 style={{ color: 'white', marginBottom: '8px' }}>
                        {option.name}
                      </h4>
                      <div
                        style={{
                          fontSize: '24px',
                          fontWeight: '700',
                          color: option.color,
                          marginBottom: '8px',
                        }}
                      >
                        ${option.rate.toLocaleString()}
                      </div>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '14px',
                          marginBottom: '8px',
                        }}
                      >
                        {option.timeline}
                      </p>
                      {option.engines && option.engines.length > 0 && (
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '12px',
                            marginBottom: '8px',
                          }}
                        >
                          Engines: {option.engines.join(', ')}
                        </p>
                      )}
                      <button
                        onClick={() => selectQuoteOption(option)}
                        style={{
                          marginTop: '16px',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          background: option.color,
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.05)';
                          e.target.style.boxShadow = `0 4px 12px ${option.color}40`;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        🎯 Select Quote
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setWorkflowStep('management')}
                  style={{
                    padding: '16px 32px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    alignSelf: 'flex-start',
                  }}
                >
                  📋 Manage & Send →
                </button>
              </div>
            )}

            {workflowStep === 'management' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '16px',
                  }}
                >
                  Step 4: Quote Management
                </h3>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <h4 style={{ color: 'white', marginBottom: '16px' }}>
                    Quote Actions
                  </h4>
                  <div
                    style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}
                  >
                    <button
                      style={{
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#3b82f6',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      📧 Send to Customer
                    </button>
                    <button
                      style={{
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#10b981',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      💾 Save Quote
                    </button>
                    <button
                      style={{
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#f59e0b',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      📊 View Analytics
                    </button>
                    <Link
                      href='/routes?tab=saved-quotes'
                      style={{
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        display: 'inline-block',
                        transition: 'transform 0.2s ease',
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = 'translateY(-1px)')
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = 'translateY(0)')
                      }
                    >
                      🗺️ Plan Route
                    </Link>
                    <button
                      onClick={() => setWorkflowStep('customer')}
                      style={{
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#6b7280',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      🔄 New Quote
                    </button>
                  </div>
                </div>

                {/* Advanced Analysis Tools */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    overflow: 'hidden',
                  }}
                >
                  <h4 style={{ color: 'white', marginBottom: '16px' }}>
                    Advanced Analysis Tools
                  </h4>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '24px',
                      width: '100%',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '100%',
                        overflow: 'hidden',
                      }}
                    >
                      <EmergencyLoadPricingWidget />
                    </div>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '100%',
                        overflow: 'hidden',
                      }}
                    >
                      <SpotRateOptimizationWidget />
                    </div>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '100%',
                        overflow: 'hidden',
                      }}
                    >
                      <VolumeDiscountWidget />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {workflowStep === 'multi-state-quotes' && (
              <div>
                {/* Multi-State Quotes Dashboard */}
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
                      marginBottom: '32px',
                    }}
                  >
                    <div>
                      <h2
                        style={{
                          fontSize: '32px',
                          fontWeight: 'bold',
                          color: 'white',
                          margin: '0 0 8px 0',
                        }}
                      >
                        🌎 Multi-State Consolidated Quotes
                      </h2>
                      <p
                        style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}
                      >
                        Multi-state logistics quote management
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        onClick={() => {
                          const quotes = multiStateQuoteService.getAllQuotes();
                          setMultiStateQuotes(quotes);
                        }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'background-color 0.3s ease',
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.background =
                            'rgba(255, 255, 255, 0.3)')
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.background =
                            'rgba(255, 255, 255, 0.2)')
                        }
                      >
                        🔄 Refresh Quotes
                      </button>
                    </div>
                  </div>

                  {/* Existing Quotes Summary */}
                  {multiStateQuotes.length > 0 && (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '20px',
                        marginBottom: '32px',
                      }}
                    >
                      {multiStateQuotes.slice(0, 4).map((quote) => (
                        <div
                          key={quote.id}
                          style={{
                            background: 'rgba(30, 58, 138, 0.2)',
                            borderRadius: '12px',
                            padding: '20px',
                            border: '1px solid rgba(30, 58, 138, 0.3)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                          }}
                          onClick={() => setSelectedQuote(quote)}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background =
                              'rgba(30, 58, 138, 0.3)';
                            e.currentTarget.style.transform =
                              'translateY(-2px)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background =
                              'rgba(30, 58, 138, 0.2)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: '12px',
                            }}
                          >
                            <h3
                              style={{
                                color: 'white',
                                fontSize: '16px',
                                fontWeight: '600',
                                margin: 0,
                              }}
                            >
                              {quote.quoteName}
                            </h3>
                            <span
                              style={{
                                background:
                                  quote.status === 'approved'
                                    ? '#10b981'
                                    : quote.status === 'under_review'
                                      ? '#3b82f6'
                                      : quote.status === 'pending'
                                        ? '#f59e0b'
                                        : '#6b7280',
                                color: 'white',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '10px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                              }}
                            >
                              {quote.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '14px',
                              margin: '0 0 12px 0',
                            }}
                          >
                            {quote.client.name}
                          </p>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  color: '#1e3a8a',
                                  fontSize: '18px',
                                  fontWeight: '700',
                                }}
                              >
                                $
                                {(
                                  quote.financialSummary.totalAnnualRevenue /
                                  1000000
                                ).toFixed(1)}
                                M
                              </div>
                              <div
                                style={{
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  fontSize: '12px',
                                }}
                              >
                                Annual Value
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div
                                style={{
                                  color: 'white',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                }}
                              >
                                {quote.stateRoutes.length} States
                              </div>
                              <div
                                style={{
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  fontSize: '12px',
                                }}
                              >
                                {quote.financialSummary.totalAnnualVolume.toLocaleString()}{' '}
                                loads
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Multi-State Quote Builder */}
                <MultiStateQuoteBuilder
                  onQuoteCreated={(quote) => {
                    setMultiStateQuotes((prev) => [...prev, quote]);
                    console.log('New multi-state quote created:', quote);
                  }}
                  onQuoteUpdated={(quote) => {
                    setMultiStateQuotes((prev) =>
                      prev.map((q) => (q.id === quote.id ? quote : q))
                    );
                    console.log('Multi-state quote updated:', quote);
                  }}
                />
              </div>
            )}
          </div>
        )}

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

        {/* Warehousing Tab */}
        {activeTab === 'Warehousing' && (
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
                    🏢 Warehousing Solutions
                  </h2>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                    Professional warehousing and distribution services
                  </p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background:
                        olimpConnectionStatus === 'connected'
                          ? '#10b981'
                          : olimpConnectionStatus === 'connecting'
                            ? '#f59e0b'
                            : olimpConnectionStatus === 'error'
                              ? '#ef4444'
                              : '#6b7280',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Olimp: {olimpConnectionStatus}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ padding: '32px' }}>
              {/* Service Type Selection */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '8px',
                  }}
                >
                  Service Type
                </label>
                <select
                  value={warehousingData.serviceType}
                  onChange={(e) =>
                    setWarehousingData({
                      ...warehousingData,
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
                  <option
                    value='Storage'
                    style={{ background: '#1a1b2e', color: 'white' }}
                  >
                    📦 Storage
                  </option>
                  <option
                    value='Cross Docking'
                    style={{ background: '#1a1b2e', color: 'white' }}
                  >
                    🚛 Cross Docking
                  </option>
                  <option
                    value='Pick & Pack'
                    style={{ background: '#1a1b2e', color: 'white' }}
                  >
                    📋 Pick & Pack
                  </option>
                  <option
                    value='Kitting'
                    style={{ background: '#1a1b2e', color: 'white' }}
                  >
                    🔧 Kitting & Assembly
                  </option>
                  <option
                    value='Returns Processing'
                    style={{ background: '#1a1b2e', color: 'white' }}
                  >
                    ↩️ Returns Processing
                  </option>
                  <option
                    value='Temperature Controlled'
                    style={{ background: '#1a1b2e', color: 'white' }}
                  >
                    🌡️ Temperature Controlled
                  </option>
                  <option
                    value='Hazmat Storage'
                    style={{ background: '#1a1b2e', color: 'white' }}
                  >
                    ⚠️ Hazmat Storage
                  </option>
                </select>
              </div>

              {/* Duration, Pallet Count, Temperature */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '20px',
                  marginBottom: '24px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '8px',
                    }}
                  >
                    Duration (Months)
                  </label>
                  <input
                    type='number'
                    value={warehousingData.duration}
                    onChange={(e) =>
                      setWarehousingData({
                        ...warehousingData,
                        duration: e.target.value,
                      })
                    }
                    placeholder='6'
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '8px',
                    }}
                  >
                    Pallet Count
                  </label>
                  <input
                    type='number'
                    value={warehousingData.palletCount}
                    onChange={(e) =>
                      setWarehousingData({
                        ...warehousingData,
                        palletCount: e.target.value,
                      })
                    }
                    placeholder='100'
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '8px',
                    }}
                  >
                    Temperature
                  </label>
                  <select
                    value={warehousingData.temperature}
                    onChange={(e) =>
                      setWarehousingData({
                        ...warehousingData,
                        temperature: e.target.value,
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
                    <option
                      value='Ambient'
                      style={{ background: '#1a1b2e', color: 'white' }}
                    >
                      🌡️ Ambient
                    </option>
                    <option
                      value='Refrigerated'
                      style={{ background: '#1a1b2e', color: 'white' }}
                    >
                      ❄️ Refrigerated
                    </option>
                    <option
                      value='Frozen'
                      style={{ background: '#1a1b2e', color: 'white' }}
                    >
                      🧊 Frozen
                    </option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '8px',
                  }}
                >
                  Preferred Location
                </label>
                <input
                  type='text'
                  value={warehousingData.location}
                  onChange={(e) =>
                    setWarehousingData({
                      ...warehousingData,
                      location: e.target.value,
                    })
                  }
                  placeholder='Chicago, IL'
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                  }}
                />
              </div>

              {/* Special Requirements */}
              <div style={{ marginBottom: '32px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '12px',
                  }}
                >
                  Special Requirements
                </label>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {[
                    'Security',
                    'Insurance',
                    'Inventory Management',
                    'EDI Integration',
                    'Labeling',
                    'Quality Control',
                  ].map((req) => (
                    <label
                      key={req}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        color: 'white',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type='checkbox'
                        checked={warehousingData.specialRequirements.includes(
                          req
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setWarehousingData({
                              ...warehousingData,
                              specialRequirements: [
                                ...warehousingData.specialRequirements,
                                req,
                              ],
                            });
                          } else {
                            setWarehousingData({
                              ...warehousingData,
                              specialRequirements:
                                warehousingData.specialRequirements.filter(
                                  (r) => r !== req
                                ),
                            });
                          }
                        }}
                        style={{ width: '16px', height: '16px' }}
                      />
                      {req}
                    </label>
                  ))}
                </div>
              </div>

              {/* Virtual Warehousing Enhancements */}
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '32px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: 'white',
                        margin: '0 0 4px 0',
                      }}
                    >
                      🏭 Virtual Warehousing Network
                    </h3>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                        margin: 0,
                      }}
                    >
                      Access our network of premium warehouse providers
                    </p>
                  </div>
                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#10b981',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    {warehouseProviders.length} Providers
                  </div>
                </div>

                {/* Provider Selection */}
                <div style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '8px',
                    }}
                  >
                    Preferred Providers (Optional)
                  </label>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '12px',
                    }}
                  >
                    {warehouseProviders.map((provider) => (
                      <label
                        key={provider.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '14px',
                          color: 'white',
                          cursor: 'pointer',
                          padding: '8px',
                          borderRadius: '6px',
                          background: 'rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        <input
                          type='checkbox'
                          checked={warehousingData.preferredProviders.includes(
                            provider.id
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setWarehousingData({
                                ...warehousingData,
                                preferredProviders: [
                                  ...warehousingData.preferredProviders,
                                  provider.id,
                                ],
                              });
                            } else {
                              setWarehousingData({
                                ...warehousingData,
                                preferredProviders:
                                  warehousingData.preferredProviders.filter(
                                    (p) => p !== provider.id
                                  ),
                              });
                            }
                          }}
                          style={{ width: '16px', height: '16px' }}
                        />
                        <div>
                          <div style={{ fontWeight: '600' }}>
                            {provider.name}
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              color: 'rgba(255, 255, 255, 0.7)',
                            }}
                          >
                            {provider.location} • ⭐ {provider.rating} (
                            {provider.reviewCount})
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Virtual Warehousing Options */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      color: 'white',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type='checkbox'
                      checked={warehousingData.bundleWithTransportation}
                      onChange={(e) =>
                        setWarehousingData({
                          ...warehousingData,
                          bundleWithTransportation: e.target.checked,
                        })
                      }
                      style={{ width: '16px', height: '16px' }}
                    />
                    🚛 Bundle with Transportation
                  </label>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      color: 'white',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type='checkbox'
                      checked={warehousingData.optimizeLocation}
                      onChange={(e) =>
                        setWarehousingData({
                          ...warehousingData,
                          optimizeLocation: e.target.checked,
                        })
                      }
                      style={{ width: '16px', height: '16px' }}
                    />
                    🎯 Optimize Location
                  </label>
                </div>

                {/* Network Discount */}
                <div style={{ marginTop: '16px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '8px',
                    }}
                  >
                    Network Discount (%)
                  </label>
                  <input
                    type='number'
                    value={warehousingData.networkDiscount}
                    onChange={(e) =>
                      setWarehousingData({
                        ...warehousingData,
                        networkDiscount: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder='0'
                    min='0'
                    max='25'
                    style={{
                      width: '100px',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginLeft: '8px',
                    }}
                  >
                    (0-25% discount for using our network)
                  </span>
                </div>
              </div>

              {/* Provider Comparison Results */}
              {virtualQuotes.length > 0 && (
                <div
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '32px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: 'white',
                        margin: 0,
                      }}
                    >
                      💰 Provider Comparison
                    </h3>
                    <button
                      onClick={() =>
                        setShowProviderComparison(!showProviderComparison)
                      }
                      style={{
                        background: 'rgba(139, 92, 246, 0.2)',
                        color: '#8b5cf6',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      {showProviderComparison ? 'Hide' : 'Show'} Details
                    </button>
                  </div>

                  {showProviderComparison && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      {virtualQuotes.slice(0, 3).map((quote, index) => (
                        <div
                          key={quote.providerId}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '8px',
                            padding: '16px',
                            border:
                              index === 0
                                ? '2px solid #10b981'
                                : '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '8px',
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  fontSize: '16px',
                                  fontWeight: '600',
                                  color: 'white',
                                }}
                              >
                                {quote.providerName}
                                {index === 0 && (
                                  <span
                                    style={{
                                      background: '#10b981',
                                      color: 'white',
                                      padding: '2px 8px',
                                      borderRadius: '12px',
                                      fontSize: '12px',
                                      marginLeft: '8px',
                                    }}
                                  >
                                    Best Value
                                  </span>
                                )}
                              </div>
                              <div
                                style={{
                                  fontSize: '12px',
                                  color: 'rgba(255, 255, 255, 0.7)',
                                }}
                              >
                                ⭐ {quote.rating} •{' '}
                                {quote.specialties.join(', ')}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div
                                style={{
                                  fontSize: '18px',
                                  fontWeight: '600',
                                  color: '#10b981',
                                }}
                              >
                                ${quote.totalRate.toLocaleString()}
                              </div>
                              <div
                                style={{
                                  fontSize: '12px',
                                  color: 'rgba(255, 255, 255, 0.7)',
                                }}
                              >
                                Save ${quote.estimatedSavings.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Olimp Integration Section */}
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '32px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#60a5fa',
                        margin: 0,
                        marginBottom: '4px',
                      }}
                    >
                      🏢 Olimp Warehousing Integration
                    </h4>
                    <p
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        margin: 0,
                      }}
                    >
                      Connect directly to Olimp Warehousing for real-time quotes
                      and availability
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={testOlimpIntegration}
                      disabled={olimpConnectionStatus === 'connecting'}
                      style={{
                        background:
                          olimpConnectionStatus === 'connected'
                            ? 'linear-gradient(135deg, #10b981, #059669)'
                            : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor:
                          olimpConnectionStatus === 'connecting'
                            ? 'not-allowed'
                            : 'pointer',
                        opacity:
                          olimpConnectionStatus === 'connecting' ? 0.6 : 1,
                      }}
                    >
                      {olimpConnectionStatus === 'connecting'
                        ? '🔄 Connecting...'
                        : olimpConnectionStatus === 'connected'
                          ? '✅ Connected'
                          : '🔗 Connect to Olimp'}
                    </button>
                    {showOlimpIntegration && (
                      <button
                        onClick={closeOlimpIntegration}
                        style={{
                          background:
                            'linear-gradient(135deg, #ef4444, #dc2626)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        ✕ Close
                      </button>
                    )}
                  </div>
                </div>

                {/* Olimp Iframe Container */}
                {showOlimpIntegration && (
                  <div
                    id='olimp-container'
                    style={{
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      background: 'white',
                      minHeight: '400px',
                    }}
                  />
                )}

                {!showOlimpIntegration && (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '40px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '14px',
                    }}
                  >
                    Click "Connect to Olimp" to access real-time warehousing
                    quotes and availability
                  </div>
                )}
              </div>

              {/* Get Quote Button */}
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={calculateWarehousing}
                  disabled={
                    !warehousingData.duration || !warehousingData.palletCount
                  }
                  style={{
                    background:
                      !warehousingData.duration || !warehousingData.palletCount
                        ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
                        : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    color: 'white',
                    border: 'none',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor:
                      !warehousingData.duration || !warehousingData.palletCount
                        ? 'not-allowed'
                        : 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    if (
                      warehousingData.duration &&
                      warehousingData.palletCount
                    ) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 25px rgba(139, 92, 246, 0.4)';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  💰 Get Warehousing Quote
                </button>
              </div>
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
                        {quote.type === 'Warehousing' && (
                          <>
                            <div>Service: {quote.details.serviceType}</div>
                            <div>Duration: {quote.details.duration} months</div>
                            <div>Pallets: {quote.details.palletCount}</div>
                            <div>Temperature: {quote.details.temperature}</div>
                            <div>
                              Requirements: {quote.details.specialRequirements}
                            </div>
                            {quote.details.selectedProvider && (
                              <>
                                <div
                                  style={{
                                    marginTop: '8px',
                                    paddingTop: '8px',
                                    borderTop:
                                      '1px solid rgba(255, 255, 255, 0.2)',
                                  }}
                                >
                                  <div
                                    style={{
                                      color: '#10b981',
                                      fontWeight: '600',
                                    }}
                                  >
                                    🏭 Provider:{' '}
                                    {quote.details.selectedProvider}
                                  </div>
                                  {quote.details.estimatedSavings > 0 && (
                                    <div
                                      style={{
                                        color: '#10b981',
                                        fontSize: '12px',
                                      }}
                                    >
                                      💰 Saved: $
                                      {quote.details.estimatedSavings.toLocaleString()}
                                    </div>
                                  )}
                                  {quote.details.networkDiscount > 0 && (
                                    <div
                                      style={{
                                        color: '#8b5cf6',
                                        fontSize: '12px',
                                      }}
                                    >
                                      🎯 Network Discount:{' '}
                                      {quote.details.networkDiscount}%
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </>
                        )}
                        {quote.details.origin && (
                          <div>Origin: {quote.details.origin}</div>
                        )}
                        {quote.details.destination && (
                          <div>Destination: {quote.details.destination}</div>
                        )}
                      </div>

                      {/* Quote Actions */}
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          marginTop: '16px',
                          paddingTop: '16px',
                          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <Link
                          href={`/routes?tab=saved-quotes&quote=${quote.id}`}
                          style={{
                            background:
                              'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                            color: 'white',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            textDecoration: 'none',
                            display: 'inline-block',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform =
                              'translateY(-1px)';
                            e.currentTarget.style.boxShadow =
                              '0 4px 12px rgba(139, 92, 246, 0.3)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          🗺️ Plan Route
                        </Link>
                        <button
                          onClick={() => {
                            // Convert current quote to Universal Quote format and save
                            const universalQuote = {
                              quoteNumber: quote.quoteNumber,
                              type: quote.type,
                              status: 'approved' as const,
                              customer: {
                                id:
                                  'CUST-' +
                                  Math.random()
                                    .toString(36)
                                    .substr(2, 6)
                                    .toUpperCase(),
                                name:
                                  'Customer from Quote ' + quote.quoteNumber,
                                email: 'customer@example.com',
                                phone: '+1-555-0123',
                              },
                              origin: {
                                address: '123 Origin St',
                                city:
                                  quote.details.origin?.split(',')[0] ||
                                  'Unknown City',
                                state:
                                  quote.details.origin?.split(',')[1]?.trim() ||
                                  'Unknown State',
                                zipCode: '12345',
                              },
                              destination: {
                                address: '456 Destination Ave',
                                city:
                                  quote.details.destination?.split(',')[0] ||
                                  'Unknown City',
                                state:
                                  quote.details.destination
                                    ?.split(',')[1]
                                    ?.trim() || 'Unknown State',
                                zipCode: '54321',
                              },
                              cargo: {
                                weight: quote.details.weight || 10000,
                                pieces: quote.details.pallets || 1,
                                description: `${quote.type} shipment`,
                                hazmat: false,
                              },
                              pricing: {
                                baseRate: quote.baseRate,
                                fuelSurcharge: quote.fuelSurcharge,
                                accessorials: 0,
                                taxes: 0,
                                total: quote.total,
                                currency: 'USD',
                              },
                              timeline: {
                                pickupDate: new Date(
                                  Date.now() + 24 * 60 * 60 * 1000
                                ).toISOString(),
                                deliveryDate: new Date(
                                  Date.now() + 3 * 24 * 60 * 60 * 1000
                                ).toISOString(),
                                transitTime: 48,
                                urgency: 'standard' as const,
                              },
                              equipment: {
                                type: quote.details.equipmentType || quote.type,
                              },
                              routeData: {
                                distance: quote.details.miles || 500,
                                estimatedDuration:
                                  (quote.details.miles || 500) / 55,
                                routePlanningStatus: 'not_planned' as const,
                              },
                              createdBy: 'quoting-system@fleetflow.com',
                              notes: `Converted from ${quote.type} quote ${quote.quoteNumber}`,
                            };

                            universalQuoteService.createQuote(universalQuote);
                            alert(
                              `Quote ${quote.quoteNumber} saved for route planning!`
                            );
                          }}
                          style={{
                            background:
                              'linear-gradient(135deg, #10b981, #059669)',
                            color: 'white',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform =
                              'translateY(-1px)';
                            e.currentTarget.style.boxShadow =
                              '0 4px 12px rgba(16, 185, 129, 0.3)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          💾 Save for Routes
                        </button>
                        <button
                          style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
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
                          ✏️ Edit
                        </button>
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

      {/* Provider Management Section */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          marginTop: '24px',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
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
                🏭 Warehouse Provider Management
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                Manage your virtual warehousing network providers
              </p>
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              {warehouseProviders.length} Active Providers
            </div>
          </div>
        </div>
        <div style={{ padding: '32px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
            }}
          >
            {warehouseProviders.map((provider) => (
              <div
                key={provider.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px',
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: 'white',
                        margin: '0 0 4px 0',
                      }}
                    >
                      {provider.name}
                    </h3>
                    <div
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      📍 {provider.location}
                    </div>
                  </div>
                  <div
                    style={{
                      background: '#10b981',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    ⭐ {provider.rating}
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: '4px',
                    }}
                  >
                    <strong>Services:</strong> {provider.services.join(', ')}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: '4px',
                    }}
                  >
                    <strong>Specialties:</strong>{' '}
                    {provider.specialties.join(', ')}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: '4px',
                    }}
                  >
                    <strong>Capacity:</strong>{' '}
                    {provider.availableCapacity.toLocaleString()} /{' '}
                    {provider.capacity.toLocaleString()} pallets
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: '4px',
                    }}
                  >
                    <strong>Base Rate:</strong> ${provider.baseRate}
                    /pallet/month
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    <strong>Markup:</strong> {provider.markup}%
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                  }}
                >
                  {provider.certifications.map((cert) => (
                    <span
                      key={cert}
                      style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#10b981',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Load Pricing Widget */}
        <div style={{ marginTop: '32px' }}>
          <EmergencyLoadPricingWidget />
        </div>

        {/* Spot Rate Optimization Widget */}
        <div style={{ marginTop: '32px' }}>
          <SpotRateOptimizationWidget />
        </div>

        {/* Volume Discount Structure Widget */}
        <div style={{ marginTop: '32px' }}>
          <VolumeDiscountWidget />
        </div>
      </div>
    </div>
  );
}
