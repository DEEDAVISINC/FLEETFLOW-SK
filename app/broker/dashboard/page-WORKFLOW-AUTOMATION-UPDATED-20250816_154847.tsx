'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AddShipperForm from '../../components/AddShipperForm';
import BOLReviewPanel from '../../components/BOLReviewPanel';
import BrokerAIIntelligenceHub from '../../components/BrokerAIIntelligenceHub';
import BrokerCarrierNetworkManager from '../../components/BrokerCarrierNetworkManager';
import BrokerEnhancedCRM from '../../components/BrokerEnhancedCRM';
import BrokerFinancialDashboard from '../../components/BrokerFinancialDashboard';
import BrokerMarketIntelligence from '../../components/BrokerMarketIntelligence';
import BrokerRegulatoryCompliance from '../../components/BrokerRegulatoryCompliance';
import BrokerShipperAcquisition from '../../components/BrokerShipperAcquisition';
import BrokerTaskPrioritizationPanel from '../../components/BrokerTaskPrioritizationPanel';
import BrokerWorkflowAutomationEngine from '../../components/BrokerWorkflowAutomationEngine';
import CreateLoadForm from '../../components/CreateLoadForm';
// import CustomizableDashboard from '../../components/CustomizableDashboard'; // Temporarily disabled due to Grid3x3 import issue
import EnhancedLoadBoard from '../../components/EnhancedLoadBoard';

import SpotRateOptimizationWidget from '../../components/SpotRateOptimizationWidget';
import WarehouseShipmentFlow from '../../components/WarehouseShipmentFlow';
// import { getAvailableDispatchers } from '../../config/access';
import { businessWorkflowManager } from '../../services/businessWorkflowManager';
// import { useShipper } from '../../contexts/ShipperContext';
import {
  BrokerMarginTracking,
  BrokerPerformanceMetrics,
  LoadBidding,
  brokerAnalyticsService,
} from '../../services/BrokerAnalyticsService';
// Removed old CRM imports - now using Enhanced CRM system
import {
  BrokerContract,
  brokerContractService,
} from '../../services/BrokerContractService';
import { Load } from '../../services/loadService';

interface BrokerSession {
  id: string;
  brokerCode: string;
  brokerName: string;
  email: string;
  role: string;
  loginTime: string;
  isNewRegistration?: boolean;
}

export default function BrokerDashboard() {
  const [selectedTab, setSelectedTab] = useState('quotes-workflow');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAddShipper, setShowAddShipper] = useState(false);
  const [brokerSession, setBrokerSession] = useState<BrokerSession | null>(
    null
  );
  const router = useRouter();
  // const availableDispatchers = getAvailableDispatchers();

  // Temporary shipper state until context is fixed
  const [shippers] = useState([]);
  const setShippers = () => {};

  // Load enhanced broker data
  useEffect(() => {
    const loadBrokerData = async () => {
      try {
        // Load performance metrics
        const metrics = brokerAnalyticsService.getBrokerPerformanceMetrics();
        setPerformanceMetrics(metrics);

        // Load margin tracking
        const margins = brokerAnalyticsService.getMarginTracking();
        setMarginTracking(margins);

        // Load bidding history
        const bidding = brokerAnalyticsService.getBiddingHistory();
        setBiddingHistory(bidding);

        // Load contracts
        const contracts = brokerContractService.getBrokerContracts();
        setBrokerContracts(contracts);

        // CRM data now handled by Enhanced CRM system
      } catch (error) {
        console.error('Error loading broker data:', error);
      }
    };

    loadBrokerData();

    // Refresh data every 30 seconds
    const interval = setInterval(loadBrokerData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Freight Quotes state variables
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingQuote, setPendingQuote] = useState<any>(null);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [activeQuoteTab, setActiveQuoteTab] = useState<
    | 'LTL'
    | 'FTL'
    | 'Specialized'
    | 'Warehousing'
    | 'Multi-Service'
    | 'History'
    | 'SpotRates'
  >('LTL');

  // LTL State
  const [ltlData, setLtlData] = useState({
    weight: '',
    pallets: '',
    freightClass: '50',
    liftgate: false,
    residential: false,
    origin: '',
    destination: '',
    commodity: '',
  });

  // FTL State
  const [ftlData, setFtlData] = useState({
    miles: '',
    equipmentType: 'Van',
    weight: '',
    origin: '',
    destination: '',
    commodity: '',
    hazmat: false,
    teamDriver: false,
  });

  // Specialized State
  const [specializedData, setSpecializedData] = useState({
    serviceType: 'White Glove',
    weight: '',
    dimensions: '',
    value: '',
    origin: '',
    destination: '',
    specialRequirements: [] as string[],
  });

  // Warehousing State
  const [warehousingData, setWarehousingData] = useState({
    serviceType: 'Storage',
    palletCount: '',
    duration: '',
    location: '',
    temperature: 'Ambient',
  });

  // Multi-Service State
  const [multiServiceData, setMultiServiceData] = useState({
    selectedServices: [] as string[],
    commonOrigin: '',
    commonDestination: '',
    totalWeight: '',
    notes: '',
  });

  // Quote Acceptance Workflow state variables
  const [acceptedQuotes, setAcceptedQuotes] = useState<any[]>([]);
  const [showQuoteAcceptance, setShowQuoteAcceptance] = useState(false);
  const [selectedAcceptedQuote, setSelectedAcceptedQuote] = useState<any>(null);
  const [contractGenerationStatus, setContractGenerationStatus] = useState<
    'idle' | 'generating' | 'sent' | 'error'
  >('idle');
  const [quoteAcceptanceWorkflow, setQuoteAcceptanceWorkflow] =
    useState<any>(null);

  // Enhanced Broker Features State
  const [performanceMetrics, setPerformanceMetrics] =
    useState<BrokerPerformanceMetrics | null>(null);
  const [marginTracking, setMarginTracking] = useState<BrokerMarginTracking[]>(
    []
  );
  const [biddingHistory, setBiddingHistory] = useState<LoadBidding[]>([]);
  const [brokerContracts, setBrokerContracts] = useState<BrokerContract[]>([]);
  // CRM functionality moved to Enhanced CRM system
  const [showShipperDetails, setShowShipperDetails] = useState(false);
  const [showContractWorkflow, setShowContractWorkflow] = useState(false);
  const [selectedContract, setSelectedContract] =
    useState<BrokerContract | null>(null);
  const [showBiddingModal, setShowBiddingModal] = useState(false);
  const [selectedLoadForBid, setSelectedLoadForBid] = useState<any>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidNotes, setBidNotes] = useState('');

  // Add missing CRM variables for backward compatibility
  const [shipperProfiles] = useState<any[]>([]);
  const [selectedShipper, setSelectedShipper] = useState<any>(null);
  const [upsellOpportunities] = useState<any[]>([]);

  // Shipper Creation Workflow state variables
  const [showShipperCreation, setShowShipperCreation] = useState(false);
  const [shipperCreationMode, setShipperCreationMode] = useState<
    'manual' | 'automated'
  >('manual');
  const [workflowForShipperCreation, setWorkflowForShipperCreation] =
    useState<any>(null);

  // Calculation Functions
  const calculateLTL = () => {
    console.info('🔄 Calculating LTL Quote...');
    const weight = parseFloat(ltlData.weight) || 0;
    const pallets = parseInt(ltlData.pallets) || 1;
    const freightClass = parseInt(ltlData.freightClass) || 50;

    let baseRate = weight * 0.85;
    if (freightClass >= 175) baseRate *= 1.5;
    else if (freightClass >= 125) baseRate *= 1.3;
    else if (freightClass >= 85) baseRate *= 1.1;

    let totalRate = baseRate;
    if (ltlData.liftgate) totalRate += 150;
    if (ltlData.residential) totalRate += 200;

    const fuelSurcharge = totalRate * 0.15;
    const total = totalRate + fuelSurcharge;

    const quote = {
      id: Date.now().toString(),
      type: 'LTL',
      quoteNumber: `LTL-${Date.now()}`,
      timestamp: Date.now(),
      baseRate: Math.round(totalRate),
      fuelSurcharge: Math.round(fuelSurcharge),
      total: Math.round(total),
      details: {
        weight,
        pallets,
        freightClass,
        liftgate: ltlData.liftgate,
        residential: ltlData.residential,
        origin: ltlData.origin,
        destination: ltlData.destination,
        commodity: ltlData.commodity,
      },
    };

    console.info('✅ LTL Quote calculated:', quote);
    setPendingQuote(quote);
    setShowConfirmation(true);
  };

  const calculateFTL = () => {
    console.info('🔄 Calculating FTL Quote...');
    const miles = parseFloat(ftlData.miles) || 0;
    const weight = parseFloat(ftlData.weight) || 0;

    let baseRate = miles * 2.5;
    if (ftlData.equipmentType === 'Flatbed') baseRate *= 1.3;
    else if (ftlData.equipmentType === 'Reefer') baseRate *= 1.4;
    else if (ftlData.equipmentType === 'Power Only') baseRate *= 0.8;

    if (ftlData.hazmat) baseRate *= 1.25;
    if (ftlData.teamDriver) baseRate *= 1.5;

    const fuelSurcharge = baseRate * 0.18;
    const total = baseRate + fuelSurcharge;

    const quote = {
      id: Date.now().toString(),
      type: 'FTL',
      quoteNumber: `FTL-${Date.now()}`,
      timestamp: Date.now(),
      baseRate: Math.round(baseRate),
      fuelSurcharge: Math.round(fuelSurcharge),
      total: Math.round(total),
      details: {
        miles,
        weight,
        equipmentType: ftlData.equipmentType,
        hazmat: ftlData.hazmat,
        teamDriver: ftlData.teamDriver,
        origin: ftlData.origin,
        destination: ftlData.destination,
        commodity: ftlData.commodity,
      },
    };

    console.info('✅ FTL Quote calculated:', quote);
    setPendingQuote(quote);
    setShowConfirmation(true);
  };

  const calculateSpecialized = () => {
    console.info('🔄 Calculating Specialized Quote...');
    const weight = parseFloat(specializedData.weight) || 0;
    const value = parseFloat(specializedData.value) || 0;

    let baseRate = weight * 1.2;
    if (specializedData.serviceType === 'White Glove') baseRate *= 1.5;
    else if (specializedData.serviceType === 'Inside Delivery') baseRate *= 1.3;
    else if (specializedData.serviceType === 'Liftgate') baseRate *= 1.2;

    const insuranceCost = value * 0.01;
    const fuelSurcharge = baseRate * 0.15;
    const total = baseRate + insuranceCost + fuelSurcharge;

    const quote = {
      id: Date.now().toString(),
      type: 'Specialized',
      quoteNumber: `SPC-${Date.now()}`,
      timestamp: Date.now(),
      baseRate: Math.round(baseRate),
      fuelSurcharge: Math.round(fuelSurcharge),
      total: Math.round(total),
      details: {
        serviceType: specializedData.serviceType,
        weight,
        value,
        dimensions: specializedData.dimensions,
        origin: specializedData.origin,
        destination: specializedData.destination,
        specialRequirements: specializedData.specialRequirements,
      },
    };

    console.info('✅ Specialized Quote calculated:', quote);
    setPendingQuote(quote);
    setShowConfirmation(true);
  };

  const calculateWarehousing = () => {
    console.info('🔄 Calculating Warehousing Quote...');
    const palletCount = parseInt(warehousingData.palletCount) || 0;
    const duration = parseInt(warehousingData.duration) || 1;

    let baseRate = palletCount * 25 * duration;
    if (warehousingData.serviceType === 'Cross-Dock') baseRate *= 0.8;
    else if (warehousingData.serviceType === 'Pick & Pack') baseRate *= 1.3;
    else if (warehousingData.serviceType === 'Kitting') baseRate *= 1.4;
    else if (warehousingData.serviceType === 'Distribution') baseRate *= 1.2;

    if (warehousingData.temperature === 'Cold Storage') baseRate *= 1.5;
    else if (warehousingData.temperature === 'Frozen') baseRate *= 2.0;

    const handlingFee = baseRate * 0.1;
    const total = baseRate + handlingFee;

    const quote = {
      id: Date.now().toString(),
      type: 'Warehousing',
      quoteNumber: `WH-${Date.now()}`,
      timestamp: Date.now(),
      baseRate: Math.round(baseRate),
      fuelSurcharge: Math.round(handlingFee),
      total: Math.round(total),
      details: {
        serviceType: warehousingData.serviceType,
        palletCount,
        duration,
        location: warehousingData.location,
        temperature: warehousingData.temperature,
      },
    };

    console.info('✅ Warehousing Quote calculated:', quote);
    setPendingQuote(quote);
    setShowConfirmation(true);
  };

  const calculateMultiService = () => {
    console.info('🔄 Calculating Multi-Service Quote...');

    if (multiServiceData.selectedServices.length === 0) {
      alert('Please select at least one service');
      return;
    }

    if (!multiServiceData.commonOrigin || !multiServiceData.commonDestination) {
      alert('Please enter origin and destination');
      return;
    }

    const totalWeight = parseFloat(multiServiceData.totalWeight) || 0;
    let totalBaseRate = 0;
    const serviceBreakdown: any[] = [];

    // Calculate individual service costs
    multiServiceData.selectedServices.forEach((service) => {
      let serviceCost = 0;

      switch (service) {
        case 'LTL':
          serviceCost = totalWeight * 0.85;
          break;
        case 'FTL':
          serviceCost = 500; // Base FTL cost
          break;
        case 'Warehousing':
          serviceCost = Math.ceil(totalWeight / 1000) * 25; // $25 per 1000 lbs
          break;
        case 'Specialized':
          serviceCost = totalWeight * 1.2;
          break;
        default:
          serviceCost = totalWeight * 0.5; // Default rate
      }

      totalBaseRate += serviceCost;
      serviceBreakdown.push({
        service,
        cost: Math.round(serviceCost),
      });
    });

    // Apply multi-service discount (5% for 2+ services)
    const discount =
      multiServiceData.selectedServices.length >= 2 ? totalBaseRate * 0.05 : 0;
    const discountedRate = totalBaseRate - discount;
    const fuelSurcharge = discountedRate * 0.15;
    const total = discountedRate + fuelSurcharge;

    const quote = {
      id: Date.now().toString(),
      type: 'Multi-Service',
      quoteNumber: `MS-${Date.now()}`,
      timestamp: Date.now(),
      baseRate: Math.round(discountedRate),
      fuelSurcharge: Math.round(fuelSurcharge),
      total: Math.round(total),
      discount: Math.round(discount),
      serviceBreakdown,
      details: {
        selectedServices: multiServiceData.selectedServices,
        commonOrigin: multiServiceData.commonOrigin,
        commonDestination: multiServiceData.commonDestination,
        totalWeight,
        notes: multiServiceData.notes,
      },
    };

    console.info('✅ Multi-Service Quote calculated:', quote);
    setPendingQuote(quote);
    setShowConfirmation(true);
  };

  // Quote Acceptance Workflow Functions
  const initializeQuoteAcceptanceWorkflow = (quote: any, shipper: any) => {
    const workflow = businessWorkflowManager.initializeQuoteAcceptanceWorkflow(
      quote.id,
      'broker-001', // Current broker ID
      shipper.id,
      {
        ...quote,
        shipper: shipper,
      }
    );

    setQuoteAcceptanceWorkflow(workflow);
    return workflow;
  };

  const handleQuoteAcceptance = async (quote: any, shipper: any) => {
    // Initialize workflow
    const workflow = initializeQuoteAcceptanceWorkflow(quote, shipper);

    // Complete initial steps
    await businessWorkflowManager.completeBusinessStep(
      workflow.id,
      'quote_generated',
      quote,
      'broker-001'
    );

    await businessWorkflowManager.completeBusinessStep(
      workflow.id,
      'quote_sent_to_shipper',
      { sentAt: new Date().toISOString() },
      'broker-001'
    );

    await businessWorkflowManager.completeBusinessStep(
      workflow.id,
      'quote_reviewed_by_shipper',
      { reviewedAt: new Date().toISOString() },
      shipper.id
    );

    await businessWorkflowManager.completeBusinessStep(
      workflow.id,
      'quote_accepted_by_shipper',
      { acceptedAt: new Date().toISOString() },
      shipper.id
    );

    // Show acceptance modal with shipper creation options
    setSelectedAcceptedQuote({ ...quote, shipper, workflowId: workflow.id });
    setWorkflowForShipperCreation(workflow);
    setShowQuoteAcceptance(true);
  };

  const generateBrokerShipperAgreement = async (acceptedQuote: any) => {
    setContractGenerationStatus('generating');

    try {
      // Complete contract generation step
      await businessWorkflowManager.completeBusinessStep(
        acceptedQuote.workflowId,
        'contract_generation_triggered',
        { triggeredAt: new Date().toISOString() },
        'broker-001'
      );

      // Use existing broker contract system with pre-filled data
      const contractData = {
        clientName: acceptedQuote.shipper.name,
        clientEmail: acceptedQuote.shipper.email,
        clientPhone: acceptedQuote.shipper.phone,
        services: acceptedQuote.services || [acceptedQuote.type],
        rates: acceptedQuote.rates,
        terms: 'Standard Broker-Shipper Agreement',
        status: 'pending_signature',
        quoteReference: acceptedQuote.quoteNumber,
        generatedFromQuote: true,
      };

      // Navigate to existing broker contracts page with pre-filled data
      window.location.href = `/broker/contracts?prefill=${encodeURIComponent(JSON.stringify(contractData))}`;

      setContractGenerationStatus('sent');
    } catch (error) {
      console.error('Error generating contract:', error);
      setContractGenerationStatus('error');
    }
  };

  const confirmQuote = () => {
    if (pendingQuote) {
      setQuotes((prev) => [pendingQuote, ...prev]);
      console.info('✅ Quote confirmed and saved!');
      setShowConfirmation(false);
      setPendingQuote(null);
    }
  };

  useEffect(() => {
    // Auto-create demo broker session (no login required)
    const demoSession = {
      id: 'broker-demo-001',
      brokerCode: 'DEMO001',
      brokerName: 'Demo Broker',
      email: 'demo@fleetflowapp.com',
      role: 'broker',
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem('brokerSession', JSON.stringify(demoSession));
    setBrokerSession(demoSession);
  }, []);

  // 🔗 LOAD UNIFIED QUOTES: Load quotes generated from the unified quoting system
  useEffect(() => {
    if (brokerSession?.id) {
      const brokerQuotesKey = `broker-quotes-${brokerSession.id}`;
      const unifiedQuotes = localStorage.getItem(brokerQuotesKey);
      if (unifiedQuotes) {
        try {
          const parsedQuotes = JSON.parse(unifiedQuotes);
          // Merge unified quotes with existing broker quotes
          setQuotes((prevQuotes) => {
            const existingIds = prevQuotes.map((q) => q.id);
            const newQuotes = parsedQuotes.filter(
              (q: any) => !existingIds.includes(q.id)
            );
            return [...newQuotes, ...prevQuotes];
          });
          console.info('🎯 Loaded unified quotes for broker:', {
            broker: brokerSession.brokerName,
            count: parsedQuotes.length,
          });
        } catch (error) {
          console.error('Error loading unified quotes:', error);
        }
      }
    }
  }, [brokerSession]);

  const handleLogout = () => {
    localStorage.removeItem('brokerSession');
    router.push('/broker');
  };

  const handleLoadCreated = (load: Load) => {
    console.info('New load created:', load);
    setShowCreateForm(false);
    // Refresh the load board by switching tabs and back
    setSelectedTab('bids');
    setTimeout(() => setSelectedTab('loads'), 100);
  };

  // Get shippers assigned to this broker
  const myShippers = shippers.filter(
    (shipper: any) =>
      shipper.assignedBrokerId === brokerSession?.id ||
      shipper.assignedBrokerId === brokerSession?.brokerCode
  );

  if (!brokerSession) {
    return (
      <div
        style={{
          backgroundImage: `
          linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%),
          radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.06) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(168, 85, 247, 0.04) 0%, transparent 50%)
        `,
          backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
          backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            fontSize: '18px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          🔐 Verifying broker credentials...
        </div>
      </div>
    );
  }

  // const currentDispatcher = availableDispatchers.find(
  //   (d) => d.id === brokerSession.id.replace('broker-', 'disp-')
  // );

  // Add function to handle shipper creation mode selection
  const handleShipperCreationMode = (mode: 'manual' | 'automated') => {
    setShipperCreationMode(mode);
    setShowQuoteAcceptance(false);

    if (mode === 'automated') {
      // Show existing AddShipperForm for automated creation
      setShowShipperCreation(true);
    } else {
      // Proceed directly to contract generation for manual creation
      generateBrokerShipperAgreement(selectedAcceptedQuote);
    }
  };

  // Add function to handle shipper form submission
  const handleShipperFormSubmit = async (shipperData: any) => {
    try {
      // Complete shipper information collection step
      await businessWorkflowManager.completeBusinessStep(
        workflowForShipperCreation.id,
        'shipper_information_collected',
        shipperData,
        'shipper'
      );

      // Complete shipper verification step (auto-approved for demo)
      await businessWorkflowManager.completeBusinessStep(
        workflowForShipperCreation.id,
        'shipper_verified',
        {
          creditApproved: true,
          creditLimit: 50000,
          verificationNotes: 'Auto-approved for demo',
          verifiedBy: 'broker-001',
        },
        'broker-001'
      );

      // Create shipper in system
      const result = await businessWorkflowManager.createShipperInSystem(
        workflowForShipperCreation.id,
        shipperData
      );

      if (result.success) {
        setShowShipperCreation(false);
        // Proceed to contract generation
        generateBrokerShipperAgreement(selectedAcceptedQuote);
      }
    } catch (error) {
      console.error('Error in shipper creation workflow:', error);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        padding: '20px',
      }}
    >
      <div
        style={{
          minHeight: '100vh',
          backgroundImage: `
          linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%),
          radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.06) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(168, 85, 247, 0.04) 0%, transparent 50%)
        `,
          backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
          backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
        }}
      >
        {/* Back Button */}
        <div style={{ padding: '16px 24px' }}>
          <Link href='/'>
            <button
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 8px 25px rgba(0, 0, 0, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
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
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '24px' }}
              >
                <div
                  style={{
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                  }}
                >
                  <span style={{ fontSize: '32px' }}>👤</span>
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
                    Brokerage Portal
                  </h1>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '18px',
                      margin: '0 0 16px 0',
                    }}
                  >
                    Professional freight brokerage & customer relationship
                    management
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '24px',
                    }}
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
                          background: '#10b981',
                          borderRadius: '50%',
                          boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)',
                          animation: 'pulse 2s infinite',
                        }}
                      />
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '14px',
                        }}
                      >
                        Agent Portal Active
                      </span>
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                      }}
                    >
                      Agent: {brokerSession.brokerName} | Code:{' '}
                      {brokerSession.brokerCode}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 25px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  ⚙️ Settings
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background =
                      'linear-gradient(135deg, #dc2626, #b91c1c)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 25px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background =
                      'linear-gradient(135deg, #ef4444, #dc2626)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
              >
                <div
                  style={{
                    padding: '12px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    borderRadius: '12px',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>👥</span>
                </div>
                <div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                    }}
                  >
                    Active Shippers
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '32px',
                      fontWeight: 'bold',
                    }}
                  >
                    {performanceMetrics?.customerCount || 0}
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
              >
                <div
                  style={{
                    padding: '12px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    borderRadius: '12px',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>📦</span>
                </div>
                <div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                    }}
                  >
                    Active Loads
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '32px',
                      fontWeight: 'bold',
                    }}
                  >
                    {performanceMetrics?.activeLoads || 0}
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
              >
                <div
                  style={{
                    padding: '12px',
                    background: 'rgba(245, 158, 11, 0.2)',
                    borderRadius: '12px',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>💰</span>
                </div>
                <div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                    }}
                  >
                    Monthly Revenue
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '32px',
                      fontWeight: 'bold',
                    }}
                  >
                    ${performanceMetrics?.totalRevenue?.toLocaleString() || '0'}
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
              >
                <div
                  style={{
                    padding: '12px',
                    background: 'rgba(139, 92, 246, 0.2)',
                    borderRadius: '12px',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>📊</span>
                </div>
                <div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                    }}
                  >
                    Success Rate
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '32px',
                      fontWeight: 'bold',
                    }}
                  >
                    {performanceMetrics?.winRate || 0}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
            {[
              {
                id: 'quotes-workflow',
                label: 'Quotes & Workflow',
                icon: '💼',
                color: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              }, // OPERATIONS - Blue
              {
                id: 'loads-bids',
                label: 'Loads & Bidding',
                icon: '📦',
                color: 'linear-gradient(135deg, #14b8a6, #0d9488)',
              }, // FLEETFLOW - Teal
              {
                id: 'contracts-bol',
                label: 'Contracts & BOL',
                icon: '📋',
                color: 'linear-gradient(135deg, #f97316, #ea580c)',
              }, // RESOURCES - Orange
              {
                id: 'analytics',
                label: 'Performance Analytics',
                icon: '📊',
                color: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              }, // ANALYTICS - Purple
              {
                id: 'ai-intelligence',
                label: 'AI Intelligence',
                icon: '🤖',
                color: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
              }, // AI INTELLIGENCE - Purple/Violet
              {
                id: 'financial-dashboard',
                label: 'Financial Dashboard',
                icon: '💹',
                color: 'linear-gradient(135deg, #10b981, #059669)',
              }, // FINANCIAL DASHBOARD - Green
              {
                id: 'workflow-automation',
                label: 'Workflow Automation',
                icon: '🔄',
                color: 'linear-gradient(135deg, #f59e0b, #d97706)',
              }, // WORKFLOW AUTOMATION - Amber
              {
                id: 'enhanced-crm',
                label: 'Enhanced CRM',
                icon: '🏢',
                color: 'linear-gradient(135deg, #ef4444, #dc2626)',
              }, // ENHANCED CRM - Red
              {
                id: 'carrier-network',
                label: 'Carrier Network',
                icon: '🚛',
                color: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              }, // CARRIER NETWORK - Sky Blue
              {
                id: 'market-intelligence',
                label: 'Market Intelligence',
                icon: '📊',
                color: 'linear-gradient(135deg, #ec4899, #db2777)',
              }, // MARKET INTELLIGENCE - Pink
              {
                id: 'regulatory-compliance',
                label: 'Regulatory Compliance',
                icon: '⚖️',
                color: 'linear-gradient(135deg, #84cc16, #65a30d)',
              }, // REGULATORY COMPLIANCE - Lime
              {
                id: 'shipper-acquisition',
                label: 'Shipper Acquisition',
                icon: '🏢',
                color: 'linear-gradient(135deg, #a855f7, #9333ea)',
              }, // SHIPPER ACQUISITION - Violet
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                style={{
                  padding: '16px 24px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background:
                    selectedTab === tab.id
                      ? tab.color
                      : 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  border:
                    selectedTab === tab.id
                      ? 'none'
                      : '1px solid rgba(255, 255, 255, 0.2)',
                  transform:
                    selectedTab === tab.id
                      ? 'translateY(-2px)'
                      : 'translateY(0)',
                  boxShadow:
                    selectedTab === tab.id
                      ? '0 8px 25px rgba(0, 0, 0, 0.3)'
                      : 'none',
                }}
                onMouseOver={(e) => {
                  if (selectedTab !== tab.id) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      'rgba(255, 255, 255, 0.25)';
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      'translateY(-1px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedTab !== tab.id) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      'rgba(255, 255, 255, 0.15)';
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      'translateY(0)';
                  }
                }}
              >
                <span style={{ marginRight: '8px' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              minHeight: '400px',
            }}
          >
            {selectedTab === 'quotes-workflow' && (
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '32px',
                  }}
                >
                  <h2
                    style={{
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      margin: 0,
                    }}
                  >
                    💼 Freight Quotes & Workflow Management
                  </h2>
                  <button
                    onClick={() => setShowAddShipper(true)}
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)', // OPERATIONS - Blue
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
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
                    + Add Shipper
                  </button>
                </div>

                {myShippers.length === 0 ? (
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '64px 32px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '64px',
                        marginBottom: '16px',
                        opacity: 0.7,
                      }}
                    >
                      🏢
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '18px',
                        marginBottom: '8px',
                      }}
                    >
                      No shippers assigned yet
                    </p>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '14px',
                      }}
                    >
                      Start building your customer network by adding shippers
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
                    {myShippers.slice(0, 5).map((shipper: any) => (
                      <div
                        key={shipper.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '20px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
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
                            alignItems: 'center',
                            gap: '20px',
                            flex: 1,
                          }}
                        >
                          <div
                            style={{
                              width: '56px',
                              height: '56px',
                              background:
                                'linear-gradient(135deg, #10b981, #059669)',
                              borderRadius: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '20px',
                              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                            }}
                          >
                            {shipper.companyName.charAt(0)}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                marginBottom: '8px',
                              }}
                            >
                              <h3
                                style={{
                                  fontWeight: '600',
                                  color: 'white',
                                  margin: 0,
                                  fontSize: '18px',
                                }}
                              >
                                {shipper.companyName}
                              </h3>
                              <div
                                style={{
                                  background: 'rgba(59, 130, 246, 0.2)',
                                  color: '#60a5fa',
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  border: '1px solid rgba(59, 130, 246, 0.3)',
                                }}
                              >
                                ID: {shipper.id.toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'loads-bids' && (
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px',
                  }}
                >
                  <div>
                    <h2
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        margin: 0,
                        marginBottom: '8px',
                      }}
                    >
                      📦 My Loads & Active Bidding
                    </h2>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                        margin: 0,
                      }}
                    >
                      Intelligent bidding with margin tracking and market
                      analysis
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)', // OPERATIONS - Blue
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background =
                        'linear-gradient(135deg, #2563eb, #1d4ed8)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 25px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background =
                        'linear-gradient(135deg, #3b82f6, #2563eb)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    + Create Load
                  </button>
                </div>

                {/* Load Management Quick Stats */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    marginBottom: '32px',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '20px', marginBottom: '8px' }}>
                      🎯
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                      }}
                    >
                      Active Bids
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {
                        biddingHistory.filter((b) => b.bidStatus === 'pending')
                          .length
                      }
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '20px', marginBottom: '8px' }}>
                      🏆
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                      }}
                    >
                      Won Bids
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {
                        biddingHistory.filter((b) => b.bidStatus === 'won')
                          .length
                      }
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '20px', marginBottom: '8px' }}>
                      📈
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                      }}
                    >
                      Avg Margin
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {performanceMetrics?.avgMargin || 0}%
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '20px', marginBottom: '8px' }}>
                      💰
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                      }}
                    >
                      Win Rate
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {performanceMetrics?.winRate || 0}%
                    </div>
                  </div>
                </div>

                <EnhancedLoadBoard />
              </div>
            )}

            {selectedTab === 'loads-old' && (
              <div>
                <h2
                  style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '24px',
                  }}
                >
                  💰 Freight Quotes
                </h2>

                {/* Quote Type Tabs */}
                <div
                  style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}
                >
                  {[
                    { id: 'LTL', label: 'LTL', icon: '📦' },
                    { id: 'FTL', label: 'FTL', icon: '🚛' },
                    { id: 'Specialized', label: 'Specialized', icon: '⭐' },
                    { id: 'Warehousing', label: 'Warehousing', icon: '🏢' },
                    { id: 'Multi-Service', label: 'Multi-Service', icon: '🔄' },
                    { id: 'SpotRates', label: 'Spot Rates', icon: '📈' },
                    { id: 'History', label: 'History', icon: '📋' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveQuoteTab(tab.id as any)}
                      style={{
                        padding: '12px 20px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        backgroundColor:
                          activeQuoteTab === tab.id
                            ? 'rgba(34, 197, 94, 0.2)'
                            : 'rgba(255, 255, 255, 0.1)',
                        color:
                          activeQuoteTab === tab.id
                            ? '#10b981'
                            : 'rgba(255, 255, 255, 0.8)',
                        border:
                          activeQuoteTab === tab.id
                            ? '1px solid rgba(34, 197, 94, 0.3)'
                            : '1px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <span style={{ marginRight: '6px' }}>{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* LTL Calculator */}
                {activeQuoteTab === 'LTL' && (
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '32px',
                      color: 'white',
                    }}
                  >
                    <h3 style={{ marginBottom: '24px', color: '#10b981' }}>
                      📦 LTL (Less Than Truckload) Quote Calculator
                    </h3>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px',
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                          }}
                        >
                          Weight (lbs) *
                        </label>
                        <input
                          type='number'
                          value={ltlData.weight}
                          onChange={(e) =>
                            setLtlData((prev) => ({
                              ...prev,
                              weight: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
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
                            marginBottom: '8px',
                            fontWeight: '600',
                          }}
                        >
                          Pallet Count
                        </label>
                        <input
                          type='number'
                          value={ltlData.pallets}
                          onChange={(e) =>
                            setLtlData((prev) => ({
                              ...prev,
                              pallets: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
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
                            marginBottom: '8px',
                            fontWeight: '600',
                          }}
                        >
                          Freight Class
                        </label>
                        <select
                          value={ltlData.freightClass}
                          onChange={(e) =>
                            setLtlData((prev) => ({
                              ...prev,
                              freightClass: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '14px',
                          }}
                        >
                          <option value='50'>Class 50</option>
                          <option value='55'>Class 55</option>
                          <option value='60'>Class 60</option>
                          <option value='65'>Class 65</option>
                          <option value='70'>Class 70</option>
                          <option value='77.5'>Class 77.5</option>
                          <option value='85'>Class 85</option>
                          <option value='92.5'>Class 92.5</option>
                          <option value='100'>Class 100</option>
                          <option value='110'>Class 110</option>
                          <option value='125'>Class 125</option>
                          <option value='150'>Class 150</option>
                          <option value='175'>Class 175</option>
                          <option value='200'>Class 200</option>
                          <option value='250'>Class 250</option>
                          <option value='300'>Class 300</option>
                          <option value='400'>Class 400</option>
                          <option value='500'>Class 500</option>
                        </select>
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                          }}
                        >
                          Origin *
                        </label>
                        <input
                          type='text'
                          value={ltlData.origin}
                          onChange={(e) =>
                            setLtlData((prev) => ({
                              ...prev,
                              origin: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
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
                            marginBottom: '8px',
                            fontWeight: '600',
                          }}
                        >
                          Destination *
                        </label>
                        <input
                          type='text'
                          value={ltlData.destination}
                          onChange={(e) =>
                            setLtlData((prev) => ({
                              ...prev,
                              destination: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Destination city, state'
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                          }}
                        >
                          Commodity
                        </label>
                        <input
                          type='text'
                          value={ltlData.commodity}
                          onChange={(e) =>
                            setLtlData((prev) => ({
                              ...prev,
                              commodity: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Type of goods'
                        />
                      </div>
                    </div>

                    {/* Checkboxes */}
                    <div
                      style={{
                        display: 'flex',
                        gap: '24px',
                        marginTop: '20px',
                      }}
                    >
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type='checkbox'
                          checked={ltlData.liftgate}
                          onChange={(e) =>
                            setLtlData((prev) => ({
                              ...prev,
                              liftgate: e.target.checked,
                            }))
                          }
                          style={{ marginRight: '8px' }}
                        />
                        Liftgate Required (+$75)
                      </label>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type='checkbox'
                          checked={ltlData.residential}
                          onChange={(e) =>
                            setLtlData((prev) => ({
                              ...prev,
                              residential: e.target.checked,
                            }))
                          }
                          style={{ marginRight: '8px' }}
                        />
                        Residential Delivery (+$50)
                      </label>
                    </div>

                    <button
                      className='freight-quote-button'
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.info('🎯 LTL Calculate Button Clicked!');
                        calculateLTL();
                      }}
                      style={{
                        marginTop: '24px',
                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)', // ANALYTICS - Purple
                        color: 'white',
                        padding: '16px 32px',
                        borderRadius: '12px',
                        border: 'none',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      💰 Calculate LTL Quote
                    </button>
                  </div>
                )}

                {/* FTL Calculator */}
                {activeQuoteTab === 'FTL' && (
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '32px',
                      color: 'white',
                    }}
                  >
                    <h3 style={{ marginBottom: '24px', color: '#3b82f6' }}>
                      🚛 FTL (Full Truckload) Quote Calculator
                    </h3>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px',
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                          }}
                        >
                          Miles *
                        </label>
                        <input
                          type='number'
                          value={ftlData.miles}
                          onChange={(e) =>
                            setFtlData((prev) => ({
                              ...prev,
                              miles: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Total miles'
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                          }}
                        >
                          Equipment Type
                        </label>
                        <select
                          value={ftlData.equipmentType}
                          onChange={(e) =>
                            setFtlData((prev) => ({
                              ...prev,
                              equipmentType: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '14px',
                          }}
                        >
                          <option value='Van'>Dry Van</option>
                          <option value='Reefer'>Refrigerated</option>
                          <option value='Flatbed'>Flatbed</option>
                          <option value='Step Deck'>Step Deck</option>
                          <option value='Lowboy'>Lowboy</option>
                        </select>
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                          }}
                        >
                          Weight (lbs)
                        </label>
                        <input
                          type='number'
                          value={ftlData.weight}
                          onChange={(e) =>
                            setFtlData((prev) => ({
                              ...prev,
                              weight: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Total weight'
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                          }}
                        >
                          Origin *
                        </label>
                        <input
                          type='text'
                          value={ftlData.origin}
                          onChange={(e) =>
                            setFtlData((prev) => ({
                              ...prev,
                              origin: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
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
                            marginBottom: '8px',
                            fontWeight: '600',
                          }}
                        >
                          Destination *
                        </label>
                        <input
                          type='text'
                          value={ftlData.destination}
                          onChange={(e) =>
                            setFtlData((prev) => ({
                              ...prev,
                              destination: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Destination city, state'
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                          }}
                        >
                          Commodity
                        </label>
                        <input
                          type='text'
                          value={ftlData.commodity}
                          onChange={(e) =>
                            setFtlData((prev) => ({
                              ...prev,
                              commodity: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Type of goods'
                        />
                      </div>
                    </div>

                    {/* Checkboxes */}
                    <div
                      style={{
                        display: 'flex',
                        gap: '24px',
                        marginTop: '20px',
                      }}
                    >
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type='checkbox'
                          checked={ftlData.hazmat}
                          onChange={(e) =>
                            setFtlData((prev) => ({
                              ...prev,
                              hazmat: e.target.checked,
                            }))
                          }
                          style={{ marginRight: '8px' }}
                        />
                        Hazmat (+$200)
                      </label>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type='checkbox'
                          checked={ftlData.teamDriver}
                          onChange={(e) =>
                            setFtlData((prev) => ({
                              ...prev,
                              teamDriver: e.target.checked,
                            }))
                          }
                          style={{ marginRight: '8px' }}
                        />
                        Team Driver (+$300)
                      </label>
                    </div>

                    <button
                      className='freight-quote-button'
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.info('🎯 FTL Calculate Button Clicked!');
                        calculateFTL();
                      }}
                      style={{
                        marginTop: '24px',
                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)', // ANALYTICS - Purple
                        color: 'white',
                        padding: '16px 32px',
                        borderRadius: '12px',
                        border: 'none',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      💰 Calculate FTL Quote
                    </button>
                  </div>
                )}

                {/* Specialized Calculator */}
                {activeQuoteTab === 'Specialized' && (
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '32px',
                      color: 'white',
                    }}
                  >
                    <h3 style={{ marginBottom: '24px', color: '#f59e0b' }}>
                      ⭐ Specialized Services Quote Calculator
                    </h3>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px',
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                          }}
                        >
                          Service Type
                        </label>
                        <select
                          value={specializedData.serviceType}
                          onChange={(e) =>
                            setSpecializedData((prev) => ({
                              ...prev,
                              serviceType: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '14px',
                          }}
                        >
                          <option value='White Glove'>
                            White Glove Service
                          </option>
                          <option value='Art/Antiques'>Art & Antiques</option>
                          <option value='Medical Equipment'>
                            Medical Equipment
                          </option>
                          <option value='Electronics'>
                            High-Value Electronics
                          </option>
                          <option value='Trade Shows'>
                            Trade Show Logistics
                          </option>
                        </select>
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                          }}
                        >
                          Weight (lbs)
                        </label>
                        <input
                          type='number'
                          value={specializedData.weight}
                          onChange={(e) =>
                            setSpecializedData((prev) => ({
                              ...prev,
                              weight: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Total weight'
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                          }}
                        >
                          Dimensions (L×W×H)
                        </label>
                        <input
                          type='text'
                          value={specializedData.dimensions}
                          onChange={(e) =>
                            setSpecializedData((prev) => ({
                              ...prev,
                              dimensions: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='e.g., 48×40×60 inches'
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                          }}
                        >
                          Declared Value ($)
                        </label>
                        <input
                          type='number'
                          value={specializedData.value}
                          onChange={(e) =>
                            setSpecializedData((prev) => ({
                              ...prev,
                              value: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Item value for insurance'
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                          }}
                        >
                          Origin *
                        </label>
                        <input
                          type='text'
                          value={specializedData.origin}
                          onChange={(e) =>
                            setSpecializedData((prev) => ({
                              ...prev,
                              origin: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
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
                            marginBottom: '8px',
                            fontWeight: '600',
                          }}
                        >
                          Destination *
                        </label>
                        <input
                          type='text'
                          value={specializedData.destination}
                          onChange={(e) =>
                            setSpecializedData((prev) => ({
                              ...prev,
                              destination: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Destination city, state'
                        />
                      </div>
                    </div>

                    <button
                      className='freight-quote-button'
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.info('🎯 Specialized Calculate Button Clicked!');
                        calculateSpecialized();
                      }}
                      style={{
                        marginTop: '24px',
                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)', // ANALYTICS - Purple
                        color: 'white',
                        padding: '16px 32px',
                        borderRadius: '12px',
                        border: 'none',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      💰 Calculate Specialized Quote
                    </button>
                  </div>
                )}

                {/* Warehousing Calculator */}
                {activeQuoteTab === 'Warehousing' && (
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '32px',
                      color: 'white',
                    }}
                  >
                    <h3 style={{ marginBottom: '24px', color: '#8b5cf6' }}>
                      🏢 Warehousing Services Quote Calculator
                    </h3>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px',
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                          }}
                        >
                          Service Type
                        </label>
                        <select
                          value={warehousingData.serviceType}
                          onChange={(e) =>
                            setWarehousingData((prev) => ({
                              ...prev,
                              serviceType: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '14px',
                          }}
                        >
                          <option value='Storage'>Storage Only</option>
                          <option value='Cross-Dock'>Cross-Docking</option>
                          <option value='Pick & Pack'>Pick & Pack</option>
                          <option value='Kitting'>Kitting & Assembly</option>
                          <option value='Distribution'>
                            Distribution Services
                          </option>
                        </select>
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                          }}
                        >
                          Pallet Count *
                        </label>
                        <input
                          type='number'
                          value={warehousingData.palletCount}
                          onChange={(e) =>
                            setWarehousingData((prev) => ({
                              ...prev,
                              palletCount: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
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
                            marginBottom: '8px',
                            fontWeight: '600',
                          }}
                        >
                          Duration (months) *
                        </label>
                        <input
                          type='number'
                          value={warehousingData.duration}
                          onChange={(e) =>
                            setWarehousingData((prev) => ({
                              ...prev,
                              duration: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Storage duration'
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                          }}
                        >
                          Location *
                        </label>
                        <input
                          type='text'
                          value={warehousingData.location}
                          onChange={(e) =>
                            setWarehousingData((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Warehouse location'
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                          }}
                        >
                          Temperature Requirements
                        </label>
                        <select
                          value={warehousingData.temperature}
                          onChange={(e) =>
                            setWarehousingData((prev) => ({
                              ...prev,
                              temperature: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '14px',
                          }}
                        >
                          <option value='Ambient'>Ambient Temperature</option>
                          <option value='Climate Controlled'>
                            Climate Controlled
                          </option>
                          <option value='Refrigerated'>
                            Refrigerated (32-40°F)
                          </option>
                          <option value='Frozen'>Frozen (-10 to 0°F)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      className='freight-quote-button'
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.info('🎯 Warehousing Calculate Button Clicked!');
                        calculateWarehousing();
                      }}
                      style={{
                        marginTop: '24px',
                        background: 'linear-gradient(135deg, #14b8a6, #0d9488)', // FLEETFLOW - Teal
                        color: 'white',
                        padding: '16px 32px',
                        borderRadius: '12px',
                        border: 'none',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      💰 Calculate Warehousing Quote
                    </button>
                  </div>
                )}

                {/* Multi-Service Calculator */}
                {activeQuoteTab === 'Multi-Service' && (
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '32px',
                      color: 'white',
                    }}
                  >
                    <h3 style={{ marginBottom: '24px', color: '#f59e0b' }}>
                      🔄 Multi-Service Quote Calculator
                    </h3>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px',
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                          }}
                        >
                          Selected Services
                        </label>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '12px',
                            marginBottom: '16px',
                          }}
                        >
                          {['LTL', 'FTL', 'Warehousing', 'Specialized'].map(
                            (service) => (
                              <label
                                key={service}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  cursor: 'pointer',
                                  padding: '8px',
                                  borderRadius: '6px',
                                  background:
                                    multiServiceData.selectedServices.includes(
                                      service
                                    )
                                      ? 'rgba(34, 197, 94, 0.2)'
                                      : 'rgba(255, 255, 255, 0.05)',
                                  border:
                                    multiServiceData.selectedServices.includes(
                                      service
                                    )
                                      ? '1px solid rgba(34, 197, 94, 0.3)'
                                      : '1px solid rgba(255, 255, 255, 0.1)',
                                }}
                              >
                                <input
                                  type='checkbox'
                                  checked={multiServiceData.selectedServices.includes(
                                    service
                                  )}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setMultiServiceData((prev) => ({
                                        ...prev,
                                        selectedServices: [
                                          ...prev.selectedServices,
                                          service,
                                        ],
                                      }));
                                    } else {
                                      setMultiServiceData((prev) => ({
                                        ...prev,
                                        selectedServices:
                                          prev.selectedServices.filter(
                                            (s) => s !== service
                                          ),
                                      }));
                                    }
                                  }}
                                  style={{
                                    marginRight: '8px',
                                    transform: 'scale(1.2)',
                                  }}
                                />
                                <span
                                  style={{ fontSize: '14px', color: 'white' }}
                                >
                                  {service}
                                </span>
                              </label>
                            )
                          )}
                        </div>
                        {multiServiceData.selectedServices.length > 0 && (
                          <div
                            style={{
                              background: 'rgba(34, 197, 94, 0.1)',
                              borderRadius: '8px',
                              padding: '12px',
                              marginTop: '8px',
                            }}
                          >
                            <div
                              style={{
                                color: '#10b981',
                                fontSize: '14px',
                                fontWeight: '600',
                                marginBottom: '4px',
                              }}
                            >
                              Selected Services:
                            </div>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '12px',
                              }}
                            >
                              {multiServiceData.selectedServices.join(', ')}
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                          }}
                        >
                          Common Origin
                        </label>
                        <input
                          type='text'
                          value={multiServiceData.commonOrigin}
                          onChange={(e) =>
                            setMultiServiceData((prev) => ({
                              ...prev,
                              commonOrigin: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
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
                            marginBottom: '8px',
                            fontWeight: '600',
                          }}
                        >
                          Common Destination
                        </label>
                        <input
                          type='text'
                          value={multiServiceData.commonDestination}
                          onChange={(e) =>
                            setMultiServiceData((prev) => ({
                              ...prev,
                              commonDestination: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Destination city, state'
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                          }}
                        >
                          Total Weight (lbs)
                        </label>
                        <input
                          type='number'
                          value={multiServiceData.totalWeight}
                          onChange={(e) =>
                            setMultiServiceData((prev) => ({
                              ...prev,
                              totalWeight: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Total weight'
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                          }}
                        >
                          Notes
                        </label>
                        <textarea
                          value={multiServiceData.notes}
                          onChange={(e) =>
                            setMultiServiceData((prev) => ({
                              ...prev,
                              notes: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Additional notes'
                        />
                      </div>
                    </div>

                    <button
                      className='freight-quote-button'
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.info(
                          '🎯 Multi-Service Calculate Button Clicked!'
                        );
                        calculateMultiService();
                      }}
                      style={{
                        marginTop: '24px',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: 'white',
                        padding: '16px 32px',
                        borderRadius: '12px',
                        border: 'none',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      💰 Calculate Multi-Service Quote
                    </button>
                  </div>
                )}

                {/* Quote History */}
                {activeQuoteTab === 'History' && (
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '32px',
                      color: 'white',
                    }}
                  >
                    <h3 style={{ marginBottom: '24px', color: '#6b7280' }}>
                      📋 Quote History
                    </h3>
                    {quotes.length === 0 ? (
                      <p
                        style={{
                          textAlign: 'center',
                          color: 'rgba(255, 255, 255, 0.6)',
                        }}
                      >
                        No quotes generated yet. Use the calculators above to
                        create your first quote.
                      </p>
                    ) : (
                      <div style={{ display: 'grid', gap: '16px' }}>
                        {quotes.map((quote) => (
                          <div
                            key={quote.id}
                            style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              borderRadius: '12px',
                              padding: '20px',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
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
                                <h4
                                  style={{
                                    margin: '0 0 8px 0',
                                    color: '#10b981',
                                  }}
                                >
                                  {quote.type} Quote - {quote.quoteNumber}
                                </h4>
                                <p
                                  style={{
                                    margin: '0 0 4px 0',
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontSize: '14px',
                                  }}
                                >
                                  Generated:{' '}
                                  {new Date(quote.timestamp).toLocaleString()}
                                </p>
                                {quote.customer && (
                                  <p
                                    style={{
                                      margin: '0 0 4px 0',
                                      color: 'rgba(255, 255, 255, 0.6)',
                                      fontSize: '12px',
                                    }}
                                  >
                                    Customer: {quote.customer}
                                  </p>
                                )}
                                {quote.details?.engines &&
                                  quote.details.engines.length > 0 && (
                                    <p
                                      style={{
                                        margin: '0',
                                        color: 'rgba(99, 102, 241, 0.8)',
                                        fontSize: '12px',
                                        fontWeight: '500',
                                      }}
                                    >
                                      🤖 AI Engines:{' '}
                                      {quote.details.engines.join(', ')}
                                    </p>
                                  )}
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <div
                                  style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    color: '#10b981',
                                  }}
                                >
                                  ${quote.total.toLocaleString()}
                                </div>
                                <div
                                  style={{
                                    fontSize: '12px',
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    marginBottom: '4px',
                                  }}
                                >
                                  Base: $
                                  {quote.rate?.toLocaleString() ||
                                    quote.baseRate}{' '}
                                  + Fuel: ${quote.fuelSurcharge}
                                </div>
                                {quote.appliedRule && (
                                  <div
                                    style={{
                                      fontSize: '11px',
                                      color: 'rgba(34, 197, 94, 0.7)',
                                      fontStyle: 'italic',
                                    }}
                                  >
                                    ✨ {quote.appliedRule}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Spot Rate Optimization */}
                {activeQuoteTab === 'SpotRates' && (
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '32px',
                      color: 'white',
                    }}
                  >
                    <h3 style={{ marginBottom: '24px', color: '#6366f1' }}>
                      📈 AI-Powered Spot Rate Optimization
                    </h3>
                    <div style={{ marginBottom: '16px' }}>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '14px',
                          marginBottom: '16px',
                        }}
                      >
                        Get real-time market intelligence and optimal pricing
                        recommendations for your freight quotes.
                      </p>
                    </div>
                    <SpotRateOptimizationWidget />
                  </div>
                )}

                {/* Navigation to Full Quotes Page */}
                <div
                  style={{
                    marginTop: '32px',
                    padding: '24px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    textAlign: 'center',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      marginBottom: '16px',
                      fontSize: '18px',
                    }}
                  >
                    🎯 Advanced Quote Management
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: '20px',
                      fontSize: '14px',
                    }}
                  >
                    Access the complete unified quoting system with AI-powered
                    pricing engines, emergency load pricing, spot rate
                    optimization, and volume discounts.
                  </p>
                  <button
                    onClick={() => router.push('/quoting')}
                    style={{
                      padding: '16px 32px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.transform = 'translateY(-2px)';
                      target.style.boxShadow =
                        '0 6px 20px rgba(99, 102, 241, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.transform = 'translateY(0px)';
                      target.style.boxShadow =
                        '0 4px 16px rgba(99, 102, 241, 0.3)';
                    }}
                  >
                    🚀 Open Full Quoting System
                  </button>
                </div>
              </div>
            )}

            {selectedTab === 'warehouse-flow' && (
              <div>
                <WarehouseShipmentFlow
                  brokerId={brokerSession.id}
                  brokerName={brokerSession.brokerName}
                  selectedShipperId={undefined}
                />
              </div>
            )}

            {selectedTab === 'bol-review' && (
              <div>
                <BOLReviewPanel
                  brokerId={brokerSession.id}
                  brokerName={brokerSession.brokerName}
                />
              </div>
            )}

            {selectedTab === 'bids' && (
              <div>
                <h2
                  style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '24px',
                  }}
                >
                  💰 Smart Bidding & Market Intelligence
                </h2>

                {/* Bidding Performance Cards */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px',
                    marginBottom: '32px',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                      ⏳
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                      }}
                    >
                      Pending Bids
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {
                        biddingHistory.filter((b) => b.bidStatus === 'pending')
                          .length
                      }
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                      🏆
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                      }}
                    >
                      Won
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {
                        biddingHistory.filter((b) => b.bidStatus === 'won')
                          .length
                      }
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                      ❌
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                      }}
                    >
                      Lost
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {
                        biddingHistory.filter((b) => b.bidStatus === 'lost')
                          .length
                      }
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                      ⏰
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                      }}
                    >
                      Expired
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {
                        biddingHistory.filter((b) => b.bidStatus === 'expired')
                          .length
                      }
                    </div>
                  </div>
                </div>

                {/* Bidding History Table */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      marginBottom: '20px',
                    }}
                  >
                    Bidding History & Performance
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table
                      style={{ width: '100%', borderCollapse: 'collapse' }}
                    >
                      <thead>
                        <tr>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Load ID
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Bid Amount
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Margin
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Status
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Submitted
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Notes
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {biddingHistory.map((bid) => (
                          <tr key={bid.loadId}>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              {bid.loadId}
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              ${bid.bidAmount.toLocaleString()}
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              {bid.margin}%
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              <span
                                style={{
                                  padding: '4px 12px',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  background:
                                    bid.bidStatus === 'won'
                                      ? 'rgba(34, 197, 94, 0.2)'
                                      : bid.bidStatus === 'pending'
                                        ? 'rgba(245, 158, 11, 0.2)'
                                        : bid.bidStatus === 'lost'
                                          ? 'rgba(239, 68, 68, 0.2)'
                                          : 'rgba(156, 163, 175, 0.2)',
                                  color:
                                    bid.bidStatus === 'won'
                                      ? '#22c55e'
                                      : bid.bidStatus === 'pending'
                                        ? '#f59e0b'
                                        : bid.bidStatus === 'lost'
                                          ? '#ef4444'
                                          : '#9ca3af',
                                }}
                              >
                                {bid.bidStatus.toUpperCase()}
                              </span>
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              {new Date(bid.submittedAt).toLocaleDateString()}
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              <span
                                style={{
                                  fontSize: '12px',
                                  color: 'rgba(255, 255, 255, 0.7)',
                                }}
                              >
                                {bid.notes || 'No notes'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '64px 32px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '64px',
                      marginBottom: '16px',
                      opacity: 0.7,
                    }}
                  >
                    💰
                  </div>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '18px',
                      marginBottom: '8px',
                    }}
                  >
                    No active bids
                  </p>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: '14px',
                    }}
                  >
                    Your bid activity will appear here
                  </p>
                </div>
              </div>
            )}

            {selectedTab === 'analytics' && (
              <div>
                <h2
                  style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '24px',
                  }}
                >
                  📊 Comprehensive Performance Analytics
                </h2>

                {/* Performance Overview */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px',
                    marginBottom: '32px',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '16px',
                      }}
                    >
                      <div
                        style={{
                          padding: '12px',
                          background: 'rgba(34, 197, 94, 0.2)',
                          borderRadius: '12px',
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>💰</span>
                      </div>
                      <div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '14px',
                          }}
                        >
                          Total Revenue
                        </div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '28px',
                            fontWeight: 'bold',
                          }}
                        >
                          $
                          {performanceMetrics?.totalRevenue?.toLocaleString() ||
                            '0'}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '12px',
                      }}
                    >
                      Monthly Growth: +{performanceMetrics?.monthlyGrowth || 0}%
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '16px',
                      }}
                    >
                      <div
                        style={{
                          padding: '12px',
                          background: 'rgba(59, 130, 246, 0.2)',
                          borderRadius: '12px',
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>🎯</span>
                      </div>
                      <div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '14px',
                          }}
                        >
                          Win Rate
                        </div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '28px',
                            fontWeight: 'bold',
                          }}
                        >
                          {performanceMetrics?.winRate || 0}%
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '12px',
                      }}
                    >
                      Industry Average: 65%
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '16px',
                      }}
                    >
                      <div
                        style={{
                          padding: '12px',
                          background: 'rgba(168, 85, 247, 0.2)',
                          borderRadius: '12px',
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>📈</span>
                      </div>
                      <div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '14px',
                          }}
                        >
                          Avg Margin
                        </div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '28px',
                            fontWeight: 'bold',
                          }}
                        >
                          {performanceMetrics?.avgMargin || 0}%
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '12px',
                      }}
                    >
                      Target: 22.5%
                    </div>
                  </div>
                </div>

                {/* Top Customers */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    marginBottom: '32px',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      marginBottom: '20px',
                    }}
                  >
                    Top Performing Customers
                  </h3>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {performanceMetrics?.topCustomers?.map(
                      (customer, index) => (
                        <div
                          key={customer.name}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '16px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '16px',
                            }}
                          >
                            <div
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background:
                                  index === 0
                                    ? 'linear-gradient(135deg, #ffd700, #ffed4e)'
                                    : index === 1
                                      ? 'linear-gradient(135deg, #c0c0c0, #e5e5e5)'
                                      : index === 2
                                        ? 'linear-gradient(135deg, #cd7f32, #daa520)'
                                        : 'rgba(255, 255, 255, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: index < 3 ? 'black' : 'white',
                                fontWeight: 'bold',
                                fontSize: '14px',
                              }}
                            >
                              #{index + 1}
                            </div>
                            <div>
                              <div
                                style={{
                                  color: 'white',
                                  fontWeight: '600',
                                  fontSize: '16px',
                                }}
                              >
                                {customer.name}
                              </div>
                              <div
                                style={{
                                  color: 'rgba(255, 255, 255, 0.6)',
                                  fontSize: '12px',
                                }}
                              >
                                {customer.loadCount} loads
                              </div>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div
                              style={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '18px',
                              }}
                            >
                              ${customer.revenue.toLocaleString()}
                            </div>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: '12px',
                              }}
                            >
                              Revenue
                            </div>
                          </div>
                        </div>
                      )
                    ) || []}
                  </div>
                </div>

                {/* Performance Trends */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      marginBottom: '20px',
                    }}
                  >
                    Performance Trends & Insights
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '24px',
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '600',
                          marginBottom: '12px',
                        }}
                      >
                        Load Performance
                      </h4>
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          padding: '16px',
                          borderRadius: '8px',
                        }}
                      >
                        <div
                          style={{
                            marginBottom: '8px',
                            color: 'rgba(255, 255, 255, 0.8)',
                          }}
                        >
                          Total Loads:{' '}
                          <strong>{performanceMetrics?.totalLoads || 0}</strong>
                        </div>
                        <div
                          style={{
                            marginBottom: '8px',
                            color: 'rgba(255, 255, 255, 0.8)',
                          }}
                        >
                          Active Loads:{' '}
                          <strong>
                            {performanceMetrics?.activeLoads || 0}
                          </strong>
                        </div>
                        <div
                          style={{
                            marginBottom: '8px',
                            color: 'rgba(255, 255, 255, 0.8)',
                          }}
                        >
                          Completed Loads:{' '}
                          <strong>
                            {performanceMetrics?.completedLoads || 0}
                          </strong>
                        </div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          Avg Load Value:{' '}
                          <strong>
                            $
                            {performanceMetrics?.avgLoadValue?.toLocaleString() ||
                              '0'}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '600',
                          marginBottom: '12px',
                        }}
                      >
                        Customer Metrics
                      </h4>
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          padding: '16px',
                          borderRadius: '8px',
                        }}
                      >
                        <div
                          style={{
                            marginBottom: '8px',
                            color: 'rgba(255, 255, 255, 0.8)',
                          }}
                        >
                          Active Customers:{' '}
                          <strong>
                            {performanceMetrics?.customerCount || 0}
                          </strong>
                        </div>
                        <div
                          style={{
                            marginBottom: '8px',
                            color: 'rgba(255, 255, 255, 0.8)',
                          }}
                        >
                          High-Risk Customers:{' '}
                          <strong>
                            {
                              shipperProfiles.filter(
                                (s) => s.riskLevel === 'high'
                              ).length
                            }
                          </strong>
                        </div>
                        <div
                          style={{
                            marginBottom: '8px',
                            color: 'rgba(255, 255, 255, 0.8)',
                          }}
                        >
                          A+ Credit Rating:{' '}
                          <strong>
                            {
                              shipperProfiles.filter(
                                (s) => s.creditRating === 'A+'
                              ).length
                            }
                          </strong>
                        </div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          Upsell Opportunities:{' '}
                          <strong>{upsellOpportunities.length}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'ai-intelligence' && (
              <div>
                <BrokerAIIntelligenceHub
                  brokerId={brokerSession?.id || 'demo-broker'}
                />
              </div>
            )}

            {selectedTab === 'financial-dashboard' && (
              <div>
                <BrokerFinancialDashboard
                  brokerId={brokerSession?.id || 'demo-broker'}
                />
              </div>
            )}

            {selectedTab === 'workflow-automation' && (
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px',
                  }}
                >
                  <div>
                    <h2
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        margin: 0,
                        marginBottom: '8px',
                      }}
                    >
                      🔄 Workflow Automation Engine
                    </h2>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                        margin: 0,
                      }}
                    >
                      Automated workflows for quotes, contracts, and operations
                    </p>
                  </div>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)', // AMBER
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    + Create Rule
                  </button>
                </div>

                {/* Automation Overview Cards */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    marginBottom: '32px',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '20px', marginBottom: '8px' }}>⚡</div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                      }}
                    >
                      Active Rules
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      12
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '20px', marginBottom: '8px' }}>🔄</div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                      }}
                    >
                      Tasks Automated
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      348
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '20px', marginBottom: '8px' }}>💰</div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                      }}
                    >
                      Time Saved
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      24hrs
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '20px', marginBottom: '8px' }}>📊</div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                      }}
                    >
                      Success Rate
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      94%
                    </div>
                  </div>
                </div>

                {/* Active Workflow Rules */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    marginBottom: '24px',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      marginBottom: '20px',
                    }}
                  >
                    🔄 Active Automation Rules
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                      {
                        name: 'Auto-Quote Generation',
                        trigger: 'New RFQ Received',
                        status: 'Active',
                        lastRun: '2 min ago',
                        success: '98%'
                      },
                      {
                        name: 'Invoice Processing',
                        trigger: 'Load Delivered',
                        status: 'Active', 
                        lastRun: '15 min ago',
                        success: '95%'
                      },
                      {
                        name: 'Carrier Assignment',
                        trigger: 'Quote Accepted',
                        status: 'Active',
                        lastRun: '1 hour ago', 
                        success: '92%'
                      },
                      {
                        name: 'Document Generation',
                        trigger: 'Contract Signed',
                        status: 'Paused',
                        lastRun: '3 hours ago',
                        success: '88%'
                      }
                    ].map((rule, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '16px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div
                            style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              background: rule.status === 'Active' ? '#10b981' : '#f59e0b',
                            }}
                          />
                          <div>
                            <div style={{ color: 'white', fontWeight: '600', marginBottom: '4px' }}>
                              {rule.name}
                            </div>
                            <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
                              Trigger: {rule.trigger}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                              Last Run
                            </div>
                            <div style={{ color: 'white', fontSize: '14px' }}>
                              {rule.lastRun}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                              Success Rate
                            </div>
                            <div style={{ color: '#10b981', fontSize: '14px', fontWeight: '600' }}>
                              {rule.success}
                            </div>
                          </div>
                          <button
                            style={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              color: 'white',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              padding: '8px 16px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              cursor: 'pointer',
                            }}
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Automated Tasks */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      marginBottom: '20px',
                    }}
                  >
                    📋 Recent Automated Tasks
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      {
                        task: 'Generated quote for Atlanta → Miami shipment',
                        rule: 'Auto-Quote Generation',
                        status: 'Completed',
                        time: '2 minutes ago'
                      },
                      {
                        task: 'Processed invoice #INV-2024-0892',
                        rule: 'Invoice Processing',
                        status: 'Completed',
                        time: '15 minutes ago'
                      },
                      {
                        task: 'Assigned carrier for Load #L-24-5678',
                        rule: 'Carrier Assignment',
                        status: 'Completed',
                        time: '1 hour ago'
                      },
                      {
                        task: 'Generated BOL for shipment #SH-24-9876',
                        rule: 'Document Generation',
                        status: 'In Progress',
                        time: '2 hours ago'
                      },
                      {
                        task: 'Sent delivery confirmation to customer',
                        rule: 'Customer Notifications',
                        status: 'Completed',
                        time: '3 hours ago'
                      }
                    ].map((task, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ color: 'white', marginBottom: '4px' }}>
                            {task.task}
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>
                            Rule: {task.rule}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div
                            style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              background: task.status === 'Completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                              color: task.status === 'Completed' ? '#10b981' : '#f59e0b',
                            }}
                          >
                            {task.status}
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', minWidth: '80px' }}>
                            {task.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'enhanced-crm' && (
              <div>
                <BrokerEnhancedCRM
                  brokerId={brokerSession?.id || 'demo-broker'}
                />
              </div>
            )}

            {selectedTab === 'carrier-network' && (
              <div>
                <BrokerCarrierNetworkManager
                  brokerId={brokerSession?.id || 'demo-broker'}
                />
              </div>
            )}

            {selectedTab === 'market-intelligence' && (
              <div>
                <BrokerMarketIntelligence
                  brokerId={brokerSession?.id || 'demo-broker'}
                />
              </div>
            )}

            {selectedTab === 'regulatory-compliance' && (
              <div>
                <BrokerRegulatoryCompliance
                  brokerId={brokerSession?.id || 'demo-broker'}
                />
              </div>
            )}

            {selectedTab === 'shipper-acquisition' && (
              <div>
                <BrokerShipperAcquisition
                  brokerId={brokerSession?.id || 'demo-broker'}
                />
              </div>
            )}

            {selectedTab === 'task-priority' && (
              <div>
                <h2
                  style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '24px',
                  }}
                >
                  🎯 Smart Task Prioritization
                </h2>
                <BrokerTaskPrioritizationPanel
                  brokerId={brokerSession?.id || 'broker-demo-001'}
                  tenantId='tenant-demo-123'
                />
              </div>
            )}

            {selectedTab === 'margin-tracking' && (
              <div>
                <h2
                  style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '24px',
                  }}
                >
                  💹 Margin Tracking & Performance
                </h2>

                {/* Margin Overview Cards */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px',
                    marginBottom: '32px',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      <div
                        style={{
                          padding: '12px',
                          background: 'rgba(34, 197, 94, 0.2)',
                          borderRadius: '12px',
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>📈</span>
                      </div>
                      <div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '14px',
                          }}
                        >
                          Average Margin
                        </div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '32px',
                            fontWeight: 'bold',
                          }}
                        >
                          {performanceMetrics?.avgMargin || 0}%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      <div
                        style={{
                          padding: '12px',
                          background: 'rgba(59, 130, 246, 0.2)',
                          borderRadius: '12px',
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>💰</span>
                      </div>
                      <div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '14px',
                          }}
                        >
                          Total Margin
                        </div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '32px',
                            fontWeight: 'bold',
                          }}
                        >
                          $
                          {Math.round(
                            (performanceMetrics?.totalRevenue || 0) * 0.225
                          ).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      <div
                        style={{
                          padding: '12px',
                          background: 'rgba(168, 85, 247, 0.2)',
                          borderRadius: '12px',
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>📊</span>
                      </div>
                      <div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '14px',
                          }}
                        >
                          Avg Load Value
                        </div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '32px',
                            fontWeight: 'bold',
                          }}
                        >
                          $
                          {performanceMetrics?.avgLoadValue?.toLocaleString() ||
                            '0'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Margin Tracking Table */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      marginBottom: '20px',
                    }}
                  >
                    Load Margin Analysis
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table
                      style={{ width: '100%', borderCollapse: 'collapse' }}
                    >
                      <thead>
                        <tr>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Load ID
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Customer Rate
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Carrier Rate
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Margin
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {marginTracking.map((margin) => (
                          <tr key={margin.loadId}>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              {margin.loadId}
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              ${margin.customerRate.toLocaleString()}
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              ${margin.carrierRate.toLocaleString()}
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              ${margin.margin.toLocaleString()} (
                              {margin.marginPercent}%)
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              <span
                                style={{
                                  padding: '4px 12px',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  background:
                                    margin.status === 'on_target'
                                      ? 'rgba(34, 197, 94, 0.2)'
                                      : margin.status === 'above_target'
                                        ? 'rgba(59, 130, 246, 0.2)'
                                        : 'rgba(239, 68, 68, 0.2)',
                                  color:
                                    margin.status === 'on_target'
                                      ? '#22c55e'
                                      : margin.status === 'above_target'
                                        ? '#3b82f6'
                                        : '#ef4444',
                                }}
                              >
                                {margin.status === 'on_target'
                                  ? '✅ On Target'
                                  : margin.status === 'above_target'
                                    ? '⬆️ Above Target'
                                    : '⬇️ Below Target'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'contract-workflow' && (
              <div>
                <h2
                  style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '24px',
                  }}
                >
                  📋 Contract Workflow & Approvals
                </h2>

                {/* Contract Status Overview */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px',
                    marginBottom: '32px',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                      ⏳
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                      }}
                    >
                      Pending Approval
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {
                        brokerContracts.filter(
                          (c) => c.status === 'pending_approval'
                        ).length
                      }
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                      ✅
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                      }}
                    >
                      Approved
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {
                        brokerContracts.filter((c) => c.status === 'approved')
                          .length
                      }
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                      ✍️
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                      }}
                    >
                      Signed
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {
                        brokerContracts.filter((c) => c.status === 'signed')
                          .length
                      }
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                      💳
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                      }}
                    >
                      Invoiced
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {
                        brokerContracts.filter(
                          (c) =>
                            c.paymentStatus === 'invoiced' ||
                            c.paymentStatus === 'paid'
                        ).length
                      }
                    </div>
                  </div>
                </div>

                {/* Active Contracts Table */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      marginBottom: '20px',
                    }}
                  >
                    Active Contracts
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table
                      style={{ width: '100%', borderCollapse: 'collapse' }}
                    >
                      <thead>
                        <tr>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Contract #
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Customer
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Value
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Margin
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Status
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Payment
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {brokerContracts.map((contract) => (
                          <tr key={contract.id}>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              {contract.contractNumber}
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              {contract.customerName}
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              ${contract.totalValue.toLocaleString()}
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              ${contract.margin.toLocaleString()} (
                              {contract.marginPercent}%)
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              <span
                                style={{
                                  padding: '4px 12px',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  background:
                                    contract.status === 'completed'
                                      ? '#22c55e'
                                      : contract.status === 'signed' ||
                                          contract.status === 'active'
                                        ? '#3b82f6'
                                        : contract.status === 'approved'
                                          ? '#a855f7'
                                          : contract.status ===
                                              'pending_approval'
                                            ? '#f59e0b'
                                            : '#6b7280',
                                  color: 'white',
                                }}
                              >
                                {contract.status
                                  .replace('_', ' ')
                                  .toUpperCase()}
                              </span>
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              <span
                                style={{
                                  padding: '4px 12px',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  background:
                                    contract.paymentStatus === 'paid'
                                      ? 'rgba(34, 197, 94, 0.2)'
                                      : contract.paymentStatus === 'invoiced'
                                        ? 'rgba(59, 130, 246, 0.2)'
                                        : contract.paymentStatus === 'overdue'
                                          ? 'rgba(239, 68, 68, 0.2)'
                                          : 'rgba(245, 158, 11, 0.2)',
                                  color:
                                    contract.paymentStatus === 'paid'
                                      ? '#22c55e'
                                      : contract.paymentStatus === 'invoiced'
                                        ? '#3b82f6'
                                        : contract.paymentStatus === 'overdue'
                                          ? '#ef4444'
                                          : '#f59e0b',
                                }}
                              >
                                {contract.paymentStatus.toUpperCase()}
                              </span>
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              <button
                                onClick={() => {
                                  setSelectedContract(contract);
                                  setShowContractWorkflow(true);
                                }}
                                style={{
                                  padding: '6px 12px',
                                  background: '#3b82f6',
                                  color: 'white',
                                  border: '1px solid #3b82f6',
                                  borderRadius: '8px',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                }}
                              >
                                View Workflow
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'crm' && (
              <div>
                <h2
                  style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '24px',
                  }}
                >
                  🤝 Customer Relationship Management
                </h2>

                {/* CRM Overview Cards */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px',
                    marginBottom: '32px',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      <div
                        style={{
                          padding: '12px',
                          background: 'rgba(139, 92, 246, 0.2)',
                          borderRadius: '12px',
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>🏢</span>
                      </div>
                      <div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '14px',
                          }}
                        >
                          Total Customers
                        </div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '32px',
                            fontWeight: 'bold',
                          }}
                        >
                          {shipperProfiles.length}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      <div
                        style={{
                          padding: '12px',
                          background: 'rgba(34, 197, 94, 0.2)',
                          borderRadius: '12px',
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>⭐</span>
                      </div>
                      <div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '14px',
                          }}
                        >
                          Avg Customer Score
                        </div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '32px',
                            fontWeight: 'bold',
                          }}
                        >
                          {Math.round(
                            shipperProfiles.reduce(
                              (sum, s) => sum + s.overallScore,
                              0
                            ) / shipperProfiles.length
                          ) || 0}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      <div
                        style={{
                          padding: '12px',
                          background: 'rgba(245, 158, 11, 0.2)',
                          borderRadius: '12px',
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>🎯</span>
                      </div>
                      <div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '14px',
                          }}
                        >
                          Upsell Opportunities
                        </div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '32px',
                            fontWeight: 'bold',
                          }}
                        >
                          {upsellOpportunities.length}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Profiles Table */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    marginBottom: '32px',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      marginBottom: '20px',
                    }}
                  >
                    Customer Profiles & Scoring
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table
                      style={{ width: '100%', borderCollapse: 'collapse' }}
                    >
                      <thead>
                        <tr>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Customer
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Score
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Credit
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Volume
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Risk Level
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Last Activity
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {shipperProfiles.map((shipper) => (
                          <tr key={shipper.id}>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              <div>
                                <div style={{ fontWeight: '600' }}>
                                  {shipper.name}
                                </div>
                                <div
                                  style={{
                                    fontSize: '12px',
                                    color: 'rgba(255, 255, 255, 0.6)',
                                  }}
                                >
                                  {shipper.industry}
                                </div>
                              </div>
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
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
                                    width: '40px',
                                    height: '6px',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    borderRadius: '3px',
                                    overflow: 'hidden',
                                  }}
                                >
                                  <div
                                    style={{
                                      width: `${shipper.overallScore}%`,
                                      height: '100%',
                                      background:
                                        shipper.overallScore >= 85
                                          ? '#22c55e'
                                          : shipper.overallScore >= 70
                                            ? '#f59e0b'
                                            : '#ef4444',
                                      borderRadius: '3px',
                                    }}
                                   />
                                </div>
                                <span
                                  style={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                  }}
                                >
                                  {shipper.overallScore}
                                </span>
                              </div>
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              <span
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  background: shipper.creditRating.startsWith(
                                    'A'
                                  )
                                    ? 'rgba(34, 197, 94, 0.2)'
                                    : shipper.creditRating.startsWith('B')
                                      ? 'rgba(245, 158, 11, 0.2)'
                                      : 'rgba(239, 68, 68, 0.2)',
                                  color: shipper.creditRating.startsWith('A')
                                    ? '#22c55e'
                                    : shipper.creditRating.startsWith('B')
                                      ? '#f59e0b'
                                      : '#ef4444',
                                }}
                              >
                                {shipper.creditRating}
                              </span>
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              ${shipper.totalVolume.toLocaleString()}
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              <span
                                style={{
                                  padding: '4px 12px',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  background:
                                    shipper.riskLevel === 'low'
                                      ? 'rgba(34, 197, 94, 0.2)'
                                      : shipper.riskLevel === 'medium'
                                        ? 'rgba(245, 158, 11, 0.2)'
                                        : 'rgba(239, 68, 68, 0.2)',
                                  color:
                                    shipper.riskLevel === 'low'
                                      ? '#22c55e'
                                      : shipper.riskLevel === 'medium'
                                        ? '#f59e0b'
                                        : '#ef4444',
                                }}
                              >
                                {shipper.riskLevel.toUpperCase()}
                              </span>
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              {new Date(
                                shipper.lastActivity
                              ).toLocaleDateString()}
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              <button
                                onClick={() => {
                                  setSelectedShipper(shipper);
                                  setShowShipperDetails(true);
                                }}
                                style={{
                                  padding: '6px 12px',
                                  background: 'rgba(139, 92, 246, 0.2)',
                                  color: '#8b5cf6',
                                  border: '1px solid rgba(139, 92, 246, 0.3)',
                                  borderRadius: '8px',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                  marginRight: '8px',
                                }}
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Upsell Opportunities */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      marginBottom: '20px',
                    }}
                  >
                    Upselling Opportunities
                  </h3>
                  <div style={{ display: 'grid', gap: '16px' }}>
                    {upsellOpportunities.map((opportunity) => (
                      <div
                        key={opportunity.shipperId}
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
                            <h4
                              style={{
                                color: 'white',
                                fontSize: '18px',
                                fontWeight: '600',
                                marginBottom: '4px',
                              }}
                            >
                              {opportunity.shipperName}
                            </h4>
                            <span
                              style={{
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '600',
                                background:
                                  opportunity.priority === 'urgent'
                                    ? 'rgba(239, 68, 68, 0.2)'
                                    : opportunity.priority === 'high'
                                      ? 'rgba(245, 158, 11, 0.2)'
                                      : opportunity.priority === 'medium'
                                        ? 'rgba(59, 130, 246, 0.2)'
                                        : 'rgba(156, 163, 175, 0.2)',
                                color:
                                  opportunity.priority === 'urgent'
                                    ? '#ef4444'
                                    : opportunity.priority === 'high'
                                      ? '#f59e0b'
                                      : opportunity.priority === 'medium'
                                        ? '#3b82f6'
                                        : '#9ca3af',
                              }}
                            >
                              {opportunity.priority.toUpperCase()} PRIORITY
                            </span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div
                              style={{
                                color: 'white',
                                fontSize: '20px',
                                fontWeight: 'bold',
                              }}
                            >
                              ${opportunity.potentialValue.toLocaleString()}
                            </div>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: '12px',
                              }}
                            >
                              {opportunity.probability}% probability
                            </div>
                          </div>
                        </div>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '14px',
                            marginBottom: '16px',
                          }}
                        >
                          {opportunity.description}
                        </p>
                        <div style={{ marginBottom: '16px' }}>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '12px',
                              marginBottom: '8px',
                            }}
                          >
                            Required Actions:
                          </div>
                          <ul
                            style={{
                              color: 'rgba(255, 255, 255, 0.6)',
                              fontSize: '12px',
                              marginLeft: '16px',
                            }}
                          >
                            {opportunity.requiredActions.map(
                              (action, index) => (
                                <li key={index} style={{ marginBottom: '4px' }}>
                                  {action}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <span
                            style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '600',
                              background: 'rgba(59, 130, 246, 0.2)',
                              color: '#3b82f6',
                            }}
                          >
                            {opportunity.opportunityType
                              .replace('_', ' ')
                              .toUpperCase()}
                          </span>
                          <span
                            style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '600',
                              background: 'rgba(168, 85, 247, 0.2)',
                              color: '#a855f7',
                            }}
                          >
                            {opportunity.timeframe
                              .replace('_', ' ')
                              .toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'contracts-bol' && (
              <div>
                <h2
                  style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '24px',
                  }}
                >
                  📋 BOL Review, Contracts & Workflow
                </h2>

                {/* Contract Status Overview */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px',
                    marginBottom: '32px',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                      ⏳
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                      }}
                    >
                      Pending Approval
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {
                        brokerContracts.filter(
                          (c) => c.status === 'pending_approval'
                        ).length
                      }
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                      📈
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                      }}
                    >
                      Avg Margin
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {performanceMetrics?.avgMargin || 0}%
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                      🎯
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                      }}
                    >
                      Active Bids
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {
                        biddingHistory.filter((b) => b.bidStatus === 'pending')
                          .length
                      }
                    </div>
                  </div>
                </div>

                {/* Active Contracts Table */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    marginBottom: '32px',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      marginBottom: '20px',
                    }}
                  >
                    Active Contracts & Workflow
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table
                      style={{ width: '100%', borderCollapse: 'collapse' }}
                    >
                      <thead>
                        <tr>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Contract #
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Customer
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Value
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Margin
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Status
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {brokerContracts.map((contract) => (
                          <tr key={contract.id}>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              {contract.contractNumber}
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              {contract.customerName}
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              ${contract.totalValue.toLocaleString()}
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              ${contract.margin.toLocaleString()} (
                              {contract.marginPercent}%)
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              <span
                                style={{
                                  padding: '4px 12px',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  background:
                                    contract.status === 'completed'
                                      ? '#22c55e'
                                      : contract.status === 'signed' ||
                                          contract.status === 'active'
                                        ? '#3b82f6'
                                        : contract.status === 'approved'
                                          ? '#a855f7'
                                          : contract.status ===
                                              'pending_approval'
                                            ? '#f59e0b'
                                            : '#6b7280',
                                  color: 'white',
                                }}
                              >
                                {contract.status
                                  .replace('_', ' ')
                                  .toUpperCase()}
                              </span>
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              <button
                                onClick={() => {
                                  setSelectedContract(contract);
                                  setShowContractWorkflow(true);
                                }}
                                style={{
                                  padding: '6px 12px',
                                  background: '#3b82f6',
                                  color: 'white',
                                  border: '1px solid #3b82f6',
                                  borderRadius: '8px',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                }}
                              >
                                View Workflow
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '32px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '24px',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          color: 'white',
                          fontSize: '20px',
                          fontWeight: 'bold',
                          marginBottom: '8px',
                        }}
                      >
                        Transportation Broker Contracts
                      </h3>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                        }}
                      >
                        Manage comprehensive broker-shipper agreements with
                        digital signatures
                      </p>
                    </div>
                    <Link
                      href='/broker/contracts'
                      style={{
                        background: 'linear-gradient(135deg, #f97316, #ea580c)', // RESOURCES - Orange
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        textDecoration: 'none',
                        display: 'inline-block',
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
                      Open Contract Manager
                    </Link>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '12px' }}>
                        📝
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '600',
                          marginBottom: '8px',
                        }}
                      >
                        Create New Contract
                      </h4>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                          marginBottom: '12px',
                        }}
                      >
                        Generate comprehensive transportation broker agreements
                      </p>
                      <ul
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '12px',
                          marginLeft: '16px',
                        }}
                      >
                        <li>EDI capability tracking</li>
                        <li>Freight class specifications</li>
                        <li>Legal compliance sections</li>
                      </ul>
                    </div>

                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '12px' }}>
                        ✍️
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '600',
                          marginBottom: '8px',
                        }}
                      >
                        Digital Signatures
                      </h4>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                          marginBottom: '12px',
                        }}
                      >
                        Secure electronic signature workflow
                      </p>
                      <ul
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '12px',
                          marginLeft: '16px',
                        }}
                      >
                        <li>Canvas-based signature drawing</li>
                        <li>Multi-party approval process</li>
                        <li>Audit trail tracking</li>
                      </ul>
                    </div>

                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '12px' }}>
                        📊
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '600',
                          marginBottom: '8px',
                        }}
                      >
                        Contract Status
                      </h4>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                          marginBottom: '12px',
                        }}
                      >
                        Track agreement lifecycle and approvals
                      </p>
                      <ul
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '12px',
                          marginLeft: '16px',
                        }}
                      >
                        <li>Draft → Sent → Client Review</li>
                        <li>Client Completed → Fully Executed</li>
                        <li>Real-time notifications</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Shipper Modal */}
        {showAddShipper && (
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
              zIndex: 50,
              padding: '16px',
            }}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '12px',
                maxWidth: '800px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <AddShipperForm onClose={() => setShowAddShipper(false)} />
            </div>
          </div>
        )}

        {/* Create Load Modal */}
        {showCreateForm && (
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
              zIndex: 50,
              padding: '16px',
            }}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '12px',
                maxWidth: '800px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <CreateLoadForm
                onLoadCreated={handleLoadCreated}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          </div>
        )}

        {/* Quote Confirmation Modal */}
        {showConfirmation && pendingQuote && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '16px',
                padding: '32px',
                maxWidth: '500px',
                width: '90%',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💰</div>
              <h3 style={{ color: '#1e40af', marginBottom: '16px' }}>
                {pendingQuote.type} Quote Generated Successfully!
              </h3>
              <div style={{ marginBottom: '24px' }}>
                <div
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#10b981',
                    marginBottom: '8px',
                  }}
                >
                  ${pendingQuote.total.toLocaleString()}
                </div>
                <div
                  style={{
                    color: '#6b7280',
                    fontSize: '14px',
                    marginBottom: '12px',
                  }}
                >
                  {pendingQuote.type} Quote - {pendingQuote.quoteNumber}
                </div>
                <div style={{ color: '#6b7280', fontSize: '12px' }}>
                  Base Rate: ${pendingQuote.baseRate.toLocaleString()}
                  {pendingQuote.fuelSurcharge > 0 && (
                    <>
                      {' '}
                      • Fuel Surcharge: $
                      {pendingQuote.fuelSurcharge.toLocaleString()}
                    </>
                  )}
                </div>

                {/* Multi-Service Breakdown */}
                {pendingQuote.type === 'Multi-Service' &&
                  pendingQuote.serviceBreakdown && (
                    <div
                      style={{
                        marginTop: '16px',
                        padding: '16px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '8px',
                        textAlign: 'left',
                      }}
                    >
                      <div
                        style={{
                          color: '#10b981',
                          fontSize: '14px',
                          fontWeight: '600',
                          marginBottom: '8px',
                        }}
                      >
                        Service Breakdown:
                      </div>
                      {pendingQuote.serviceBreakdown.map(
                        (service: any, index: number) => (
                          <div
                            key={index}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              marginBottom: '4px',
                              fontSize: '12px',
                            }}
                          >
                            <span style={{ color: '#6b7280' }}>
                              {service.service}:
                            </span>
                            <span
                              style={{ color: '#10b981', fontWeight: '600' }}
                            >
                              ${service.cost.toLocaleString()}
                            </span>
                          </div>
                        )
                      )}
                      {pendingQuote.discount > 0 && (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '8px',
                            paddingTop: '8px',
                            borderTop: '1px solid rgba(16, 185, 129, 0.2)',
                            fontSize: '12px',
                          }}
                        >
                          <span style={{ color: '#f59e0b' }}>
                            Multi-Service Discount (5%):
                          </span>
                          <span style={{ color: '#f59e0b', fontWeight: '600' }}>
                            -${pendingQuote.discount.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'center',
                }}
              >
                <button
                  onClick={confirmQuote}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)', // ANALYTICS - Purple
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  ✅ Save Quote
                </button>
                <button
                  onClick={() => {
                    setShowConfirmation(false);
                    // Simulate shipper acceptance (in real app, this would be triggered by shipper)
                    handleQuoteAcceptance(pendingQuote, {
                      id: 'shipper-001',
                      name: 'Acme Manufacturing',
                      email: 'logistics@acme.com',
                      phone: '(555) 123-4567',
                    });
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  📧 Send to Shipper
                </button>
                <button
                  onClick={() => {
                    console.info('❌ Quote cancelled');
                    setShowConfirmation(false);
                    setPendingQuote(null);
                  }}
                  style={{
                    background: 'rgba(107, 114, 128, 0.1)',
                    color: '#6b7280',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quote Acceptance Workflow Modal */}
        {showQuoteAcceptance && selectedAcceptedQuote && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '32px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '80vh',
                overflow: 'auto',
              }}
            >
              <div style={{ marginBottom: '24px' }}>
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                  }}
                >
                  Quote Accepted by Shipper
                </h2>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  {selectedAcceptedQuote.shipper.name} has accepted your quote.
                  Choose how to proceed with shipper creation and contract
                  generation.
                </p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '12px',
                  }}
                >
                  Accepted Quote Details
                </h3>
                <div
                  style={{
                    backgroundColor: '#f9fafb',
                    padding: '16px',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Quote Number:</strong>{' '}
                    {selectedAcceptedQuote.quoteNumber}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Shipper:</strong>{' '}
                    {selectedAcceptedQuote.shipper.name}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Total Amount:</strong> $
                    {selectedAcceptedQuote.total.toLocaleString()}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Services:</strong>{' '}
                    {selectedAcceptedQuote.services?.join(', ') ||
                      selectedAcceptedQuote.type}
                  </div>
                  <div>
                    <strong>Accepted:</strong>{' '}
                    {new Date(
                      selectedAcceptedQuote.acceptedAt
                    ).toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '12px',
                  }}
                >
                  Shipper Creation Options
                </h3>
                <div
                  style={{
                    backgroundColor: '#f0f9ff',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #0ea5e9',
                  }}
                >
                  <div style={{ marginBottom: '12px' }}>
                    <strong>Automated Creation:</strong> Use the existing
                    shipper form to collect all required information and
                    automatically create the shipper record.
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <strong>Manual Creation:</strong> Skip shipper creation and
                    proceed directly to contract generation (shipper will be
                    created manually later).
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                }}
              >
                <button
                  onClick={() => {
                    setShowQuoteAcceptance(false);
                    setSelectedAcceptedQuote(null);
                  }}
                  style={{
                    padding: '12px 24px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    color: '#374151',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleShipperCreationMode('manual')}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  Manual Creation
                </button>
                <button
                  onClick={() => handleShipperCreationMode('automated')}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  Automated Creation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Shipper Creation Form Modal */}
        {showShipperCreation && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '32px',
                maxWidth: '90%',
                width: '90%',
                maxHeight: '90vh',
                overflow: 'auto',
              }}
            >
              <div style={{ marginBottom: '24px' }}>
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                  }}
                >
                  Create New Shipper
                </h2>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  Complete the shipper information form to automatically create
                  the shipper record and proceed with contract generation.
                </p>
              </div>

              <AddShipperForm
                onClose={() => {
                  setShowShipperCreation(false);
                  setWorkflowForShipperCreation(null);
                }}
                onSubmit={handleShipperFormSubmit}
                isWorkflowMode={true}
                workflowData={selectedAcceptedQuote}
              />
            </div>
          </div>
        )}

        {/* Contract Workflow Modal */}
        {showContractWorkflow && selectedContract && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '32px',
                maxWidth: '800px',
                width: '90%',
                maxHeight: '90vh',
                overflow: 'auto',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px',
                }}
              >
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                  Contract Workflow: {selectedContract.contractNumber}
                </h2>
                <button
                  onClick={() => setShowContractWorkflow(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6b7280',
                  }}
                >
                  ×
                </button>
              </div>

              {(() => {
                const workflowStatus =
                  brokerContractService.getContractWorkflowStatus(
                    selectedContract.id
                  );
                if (!workflowStatus) return null;

                return (
                  <div>
                    <div style={{ marginBottom: '24px' }}>
                      <h3
                        style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          marginBottom: '12px',
                        }}
                      >
                        Contract Details
                      </h3>
                      <div
                        style={{
                          background: '#f9fafb',
                          padding: '16px',
                          borderRadius: '8px',
                          marginBottom: '16px',
                        }}
                      >
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '16px',
                          }}
                        >
                          <div>
                            <strong>Customer:</strong>{' '}
                            {selectedContract.customerName}
                          </div>
                          <div>
                            <strong>Total Value:</strong> $
                            {selectedContract.totalValue.toLocaleString()}
                          </div>
                          <div>
                            <strong>Margin:</strong> $
                            {selectedContract.margin.toLocaleString()} (
                            {selectedContract.marginPercent}%)
                          </div>
                          <div>
                            <strong>Status:</strong>{' '}
                            {selectedContract.status
                              .replace('_', ' ')
                              .toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <h3
                        style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          marginBottom: '12px',
                        }}
                      >
                        Workflow Progress ({Math.round(workflowStatus.progress)}
                        % Complete)
                      </h3>
                      <div
                        style={{
                          background: '#f3f4f6',
                          borderRadius: '8px',
                          padding: '4px',
                          marginBottom: '16px',
                        }}
                      >
                        <div
                          style={{
                            background: '#3b82f6',
                            height: '8px',
                            borderRadius: '4px',
                            width: `${workflowStatus.progress}%`,
                            transition: 'width 0.3s ease',
                          }}
                         />
                      </div>

                      <div style={{ display: 'grid', gap: '12px' }}>
                        {workflowStatus.workflow.map((step, index) => (
                          <div
                            key={index}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '16px',
                              padding: '16px',
                              background:
                                step.status === 'completed'
                                  ? '#f0fdf4'
                                  : step.status === 'pending'
                                    ? '#fffbeb'
                                    : '#f9fafb',
                              borderRadius: '8px',
                              border: `1px solid ${step.status === 'completed' ? '#22c55e' : step.status === 'pending' ? '#f59e0b' : '#e5e7eb'}`,
                            }}
                          >
                            <div
                              style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background:
                                  step.status === 'completed'
                                    ? '#22c55e'
                                    : step.status === 'pending'
                                      ? '#f59e0b'
                                      : '#e5e7eb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: 'bold',
                              }}
                            >
                              {step.status === 'completed' ? '✓' : index + 1}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  fontWeight: '600',
                                  marginBottom: '4px',
                                }}
                              >
                                {step.step}
                              </div>
                              <div
                                style={{ fontSize: '14px', color: '#6b7280' }}
                              >
                                {step.description}
                              </div>
                              {step.completedAt && (
                                <div
                                  style={{
                                    fontSize: '12px',
                                    color: '#9ca3af',
                                    marginTop: '4px',
                                  }}
                                >
                                  Completed:{' '}
                                  {new Date(step.completedAt).toLocaleString()}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedContract.status === 'pending_approval' && (
                      <div
                        style={{
                          display: 'flex',
                          gap: '12px',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <button
                          onClick={async () => {
                            const result =
                              await brokerContractService.requestContractApproval(
                                selectedContract.id
                              );
                            alert(result.message);
                          }}
                          style={{
                            padding: '12px 24px',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                          }}
                        >
                          Request Approval
                        </button>
                      </div>
                    )}

                    {selectedContract.status === 'approved' &&
                      selectedContract.paymentStatus === 'pending' && (
                        <div
                          style={{
                            display: 'flex',
                            gap: '12px',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <button
                            onClick={async () => {
                              const result =
                                await brokerContractService.generateSquareInvoice(
                                  selectedContract.id
                                );
                              if (result.success && result.invoiceUrl) {
                                window.open(result.invoiceUrl, '_blank');
                              }
                              alert(result.message);
                            }}
                            style={{
                              padding: '12px 24px',
                              background: '#10b981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontWeight: '600',
                            }}
                          >
                            Generate Square Invoice
                          </button>
                        </div>
                      )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Shipper Details Modal */}
        {showShipperDetails && selectedShipper && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '32px',
                maxWidth: '900px',
                width: '90%',
                maxHeight: '90vh',
                overflow: 'auto',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px',
                }}
              >
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                  {selectedShipper.name} - Customer Profile
                </h2>
                <button
                  onClick={() => setShowShipperDetails(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6b7280',
                  }}
                >
                  ×
                </button>
              </div>

              {/* Customer Overview */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '24px',
                  marginBottom: '32px',
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '16px',
                    }}
                  >
                    Contact Information
                  </h3>
                  <div
                    style={{
                      background: '#f9fafb',
                      padding: '16px',
                      borderRadius: '8px',
                    }}
                  >
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Email:</strong> {selectedShipper.email}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Phone:</strong> {selectedShipper.phone}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Address:</strong> {selectedShipper.address}
                    </div>
                    <div>
                      <strong>Industry:</strong> {selectedShipper.industry}
                    </div>
                  </div>
                </div>

                <div>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '16px',
                    }}
                  >
                    Performance Metrics
                  </h3>
                  <div
                    style={{
                      background: '#f9fafb',
                      padding: '16px',
                      borderRadius: '8px',
                    }}
                  >
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Overall Score:</strong>{' '}
                      {selectedShipper.overallScore}/100
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Credit Rating:</strong>{' '}
                      {selectedShipper.creditRating}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Risk Level:</strong>{' '}
                      {selectedShipper.riskLevel.toUpperCase()}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Payment Terms:</strong>{' '}
                      {selectedShipper.paymentTerms} days
                    </div>
                    <div>
                      <strong>Avg Payment Time:</strong>{' '}
                      {selectedShipper.avgPaymentTime} days
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Intelligence */}
              <div style={{ marginBottom: '32px' }}>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '16px',
                  }}
                >
                  Business Intelligence
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '16px',
                  }}
                >
                  <div
                    style={{
                      background: '#f0fdf4',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid #22c55e',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#22c55e',
                      }}
                    >
                      ${selectedShipper.totalVolume.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      Annual Volume
                    </div>
                  </div>
                  <div
                    style={{
                      background: '#eff6ff',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid #3b82f6',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#3b82f6',
                      }}
                    >
                      {selectedShipper.loadCount}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      Total Loads
                    </div>
                  </div>
                  <div
                    style={{
                      background: '#fefce8',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid #f59e0b',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#f59e0b',
                      }}
                    >
                      {selectedShipper.reliability}%
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      Reliability Score
                    </div>
                  </div>
                </div>
              </div>

              {/* Interaction History */}
              <div style={{ marginBottom: '24px' }}>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '16px',
                  }}
                >
                  Recent Interactions
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {
                    /* CRM functionality moved to Enhanced CRM system */
                    /* brokerCRMService
                  .getInteractionHistory(selectedShipper.id)
                  .slice(0, 3) */
                    [].map((interaction: any) => (
                      <div
                        key={interaction.id}
                        style={{
                          background: '#f9fafb',
                          padding: '16px',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '8px',
                          }}
                        >
                          <div>
                            <span
                              style={{
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '600',
                                background:
                                  interaction.type === 'call'
                                    ? 'rgba(59, 130, 246, 0.1)'
                                    : interaction.type === 'email'
                                      ? 'rgba(16, 185, 129, 0.1)'
                                      : interaction.type === 'contract'
                                        ? 'rgba(245, 158, 11, 0.1)'
                                        : 'rgba(156, 163, 175, 0.1)',
                                color:
                                  interaction.type === 'call'
                                    ? '#3b82f6'
                                    : interaction.type === 'email'
                                      ? '#10b981'
                                      : interaction.type === 'contract'
                                        ? '#f59e0b'
                                        : '#6b7280',
                              }}
                            >
                              {interaction.type.toUpperCase()}
                            </span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            {new Date(
                              interaction.createdAt
                            ).toLocaleDateString()}
                          </div>
                        </div>
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                          {interaction.subject}
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            color: '#6b7280',
                            marginBottom: '8px',
                          }}
                        >
                          {interaction.description}
                        </div>
                        {interaction.followUpRequired && (
                          <div
                            style={{
                              fontSize: '12px',
                              color: '#f59e0b',
                              fontWeight: '600',
                            }}
                          >
                            📅 Follow-up required:{' '}
                            {interaction.followUpDate
                              ? new Date(
                                  interaction.followUpDate
                                ).toLocaleDateString()
                              : 'TBD'}
                          </div>
                        )}
                      </div>
                    ))
                  }
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                }}
              >
                <button
                  onClick={() => setShowShipperDetails(false)}
                  style={{
                    padding: '12px 24px',
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
                <button
                  style={{
                    padding: '12px 24px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  Add Interaction
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
