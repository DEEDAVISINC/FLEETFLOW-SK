'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AddShipperForm from '../../components/AddShipperForm';
import BOLReviewPanel from '../../components/BOLReviewPanel';
import CreateLoadForm from '../../components/CreateLoadForm';
import EnhancedLoadBoard from '../../components/EnhancedLoadBoard';
import WarehouseShipmentFlow from '../../components/WarehouseShipmentFlow';
import { getAvailableDispatchers } from '../../config/access';
import { businessWorkflowManager } from '../../services/businessWorkflowManager';
// import { useShipper } from '../../contexts/ShipperContext';
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
  const [selectedTab, setSelectedTab] = useState('shippers');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAddShipper, setShowAddShipper] = useState(false);
  const [brokerSession, setBrokerSession] = useState<BrokerSession | null>(
    null
  );
  const router = useRouter();
  const availableDispatchers = getAvailableDispatchers();

  // Temporary shipper state until context is fixed
  const [shippers] = useState([]);
  const setShippers = () => {};

  // Freight Quotes state variables
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingQuote, setPendingQuote] = useState<any>(null);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [activeQuoteTab, setActiveQuoteTab] = useState<
    'LTL' | 'FTL' | 'Specialized' | 'Warehousing' | 'Multi-Service' | 'History'
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

  // Shipper Creation Workflow state variables
  const [showShipperCreation, setShowShipperCreation] = useState(false);
  const [shipperCreationMode, setShipperCreationMode] = useState<
    'manual' | 'automated'
  >('manual');
  const [workflowForShipperCreation, setWorkflowForShipperCreation] =
    useState<any>(null);

  // Calculation Functions
  const calculateLTL = () => {
    console.log('🔄 Calculating LTL Quote...');
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

    console.log('✅ LTL Quote calculated:', quote);
    setPendingQuote(quote);
    setShowConfirmation(true);
  };

  const calculateFTL = () => {
    console.log('🔄 Calculating FTL Quote...');
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

    console.log('✅ FTL Quote calculated:', quote);
    setPendingQuote(quote);
    setShowConfirmation(true);
  };

  const calculateSpecialized = () => {
    console.log('🔄 Calculating Specialized Quote...');
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

    console.log('✅ Specialized Quote calculated:', quote);
    setPendingQuote(quote);
    setShowConfirmation(true);
  };

  const calculateWarehousing = () => {
    console.log('🔄 Calculating Warehousing Quote...');
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

    console.log('✅ Warehousing Quote calculated:', quote);
    setPendingQuote(quote);
    setShowConfirmation(true);
  };

  const calculateMultiService = () => {
    console.log('🔄 Calculating Multi-Service Quote...');

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

    console.log('✅ Multi-Service Quote calculated:', quote);
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
      console.log('✅ Quote confirmed and saved!');
      setShowConfirmation(false);
      setPendingQuote(null);
    }
  };

  useEffect(() => {
    // Check if broker is logged in
    const session = localStorage.getItem('brokerSession');
    if (!session) {
      // Get current user from access system
      const { user } = require('../../config/access').getCurrentUser();
      if (user.role === 'broker') {
        const demoSession = {
          id: user.id,
          brokerCode: user.brokerId || 'BR001',
          brokerName: user.name,
          email: user.email,
          role: 'broker',
          loginTime: new Date().toISOString(),
        };
        localStorage.setItem('brokerSession', JSON.stringify(demoSession));
        setBrokerSession(demoSession);
      } else {
        router.push('/broker');
      }
      return;
    }

    try {
      const parsedSession = JSON.parse(session);
      setBrokerSession(parsedSession);
    } catch (error) {
      console.error('Invalid session data');
      router.push('/broker');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('brokerSession');
    router.push('/broker');
  };

  const handleLoadCreated = (load: Load) => {
    console.log('New load created:', load);
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
          background: `
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
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
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

  const currentDispatcher = availableDispatchers.find(
    (d) => d.id === brokerSession.id.replace('broker-', 'disp-')
  );

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
        background: `
        linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%),
        radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(168, 85, 247, 0.04) 0%, transparent 50%)
      `,
        backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
        backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
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
                  Broker Agent Portal
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
                        background: '#10b981',
                        borderRadius: '50%',
                        boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)',
                        animation: 'pulse 2s infinite',
                      }}
                    ></div>
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
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 25px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
                  {myShippers.length}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
                  0
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
                  $0
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
                  0%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          {[
            {
              id: 'shippers',
              label: 'My Shippers',
              icon: '🏢',
              color: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            }, // OPERATIONS - Blue
            {
              id: 'loads',
              label: 'My Loads',
              icon: '📦',
              color: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            }, // OPERATIONS - Blue
            {
              id: 'quotes',
              label: 'Freight Quotes',
              icon: '💰',
              color: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            }, // ANALYTICS - Purple
            {
              id: 'warehouse-flow',
              label: 'Warehouse Flow',
              icon: '🏭',
              color: 'linear-gradient(135deg, #14b8a6, #0d9488)',
            }, // FLEETFLOW - Teal
            {
              id: 'bol-review',
              label: 'BOL Review',
              icon: '📋',
              color: 'linear-gradient(135deg, #f97316, #ea580c)',
            }, // RESOURCES - Orange
            {
              id: 'bids',
              label: 'Active Bids',
              icon: '💰',
              color: 'linear-gradient(135deg, #14b8a6, #0d9488)',
            }, // FLEETFLOW - Teal
            {
              id: 'contracts',
              label: 'Contracts',
              icon: '📋',
              color: 'linear-gradient(135deg, #f97316, #ea580c)',
            }, // RESOURCES - Orange
            {
              id: 'analytics',
              label: 'Analytics',
              icon: '📊',
              color: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            }, // ANALYTICS - Purple
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
                  selectedTab === tab.id ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow:
                  selectedTab === tab.id
                    ? '0 8px 25px rgba(0, 0, 0, 0.3)'
                    : 'none',
              }}
              onMouseOver={(e) => {
                if (selectedTab !== tab.id) {
                  e.currentTarget.style.background =
                    'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseOut={(e) => {
                if (selectedTab !== tab.id) {
                  e.currentTarget.style.background =
                    'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
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
          {selectedTab === 'shippers' && (
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
                  My Shippers
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

          {selectedTab === 'loads' && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px',
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
                  📦 My Loads
                </h2>
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
              <EnhancedLoadBoard />
            </div>
          )}

          {selectedTab === 'quotes' && (
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
                    style={{ display: 'flex', gap: '24px', marginTop: '20px' }}
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
                      console.log('🎯 LTL Calculate Button Clicked!');
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
                    style={{ display: 'flex', gap: '24px', marginTop: '20px' }}
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
                      console.log('🎯 FTL Calculate Button Clicked!');
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
                        <option value='White Glove'>White Glove Service</option>
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
                      console.log('🎯 Specialized Calculate Button Clicked!');
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
                      console.log('🎯 Warehousing Calculate Button Clicked!');
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
                      console.log('🎯 Multi-Service Calculate Button Clicked!');
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
                                  margin: '0',
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  fontSize: '14px',
                                }}
                              >
                                Generated:{' '}
                                {new Date(quote.timestamp).toLocaleString()}
                              </p>
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
                                }}
                              >
                                Base: ${quote.baseRate} + Fuel: $
                                {quote.fuelSurcharge}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
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
                💰 Active Bids
              </h2>
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
                📊 Broker Analytics
              </h2>
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
                  📈
                </div>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '18px',
                    marginBottom: '8px',
                  }}
                >
                  Analytics will populate as you create loads
                </p>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '14px',
                  }}
                >
                  Track your performance, revenue, and shipper relationships
                </p>
              </div>
            </div>
          )}

          {selectedTab === 'contracts' && (
            <div>
              <h2
                style={{
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  marginBottom: '24px',
                }}
              >
                📋 Contract Management
              </h2>
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
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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
                          <span style={{ color: '#10b981', fontWeight: '600' }}>
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
                  console.log('❌ Quote cancelled');
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
                  <strong>Shipper:</strong> {selectedAcceptedQuote.shipper.name}
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
                  {new Date(selectedAcceptedQuote.acceptedAt).toLocaleString()}
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
                  <strong>Automated Creation:</strong> Use the existing shipper
                  form to collect all required information and automatically
                  create the shipper record.
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
  );
}
