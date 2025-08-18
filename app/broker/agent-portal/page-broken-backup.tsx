'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { brokerAgentIntegrationService } from '../../services/BrokerAgentIntegrationService';
import { UserSession } from '../../services/BrokerageHierarchyService';

// Use the BrokerAgent type from the integration service for the state
type BrokerAgent =
  import('../../services/BrokerAgentIntegrationService').BrokerAgent;

interface AgentLoad {
  id: string;
  loadNumber: string;
  origin: string;
  destination: string;
  commodity: string;
  rate: number;
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'completed';
  pickupDate: string;
  deliveryDate: string;
  carrier?: string;
  priority: 'low' | 'medium' | 'high';
}

interface AgentTask {
  id: string;
  title: string;
  type:
    | 'follow_up'
    | 'rate_confirmation'
    | 'carrier_assignment'
    | 'documentation'
    | 'customer_call';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  loadId?: string;
  description: string;
  completed: boolean;
}

export default function AgentPortal() {
  const [activeTab, setActiveTab] = useState('quotes-workflow');
  const [currentAgent, setCurrentAgent] = useState<BrokerAgent | null>(null);
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShipperForm, setShowShipperForm] = useState(false);

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
    distance: '',
    complexity: 'medium',
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

  // Mock data for agent loads and tasks
  const [agentLoads, setAgentLoads] = useState<AgentLoad[]>([
    {
      id: '1',
      loadNumber: 'LB-001',
      origin: 'Chicago, IL',
      destination: 'Atlanta, GA',
      commodity: 'Electronics',
      rate: 2500,
      status: 'assigned',
      pickupDate: '2025-01-20',
      deliveryDate: '2025-01-22',
      carrier: 'ABC Trucking',
      priority: 'high',
    },
    {
      id: '2',
      loadNumber: 'LB-002',
      origin: 'Dallas, TX',
      destination: 'Los Angeles, CA',
      commodity: 'Automotive Parts',
      rate: 3200,
      status: 'in_transit',
      pickupDate: '2025-01-18',
      deliveryDate: '2025-01-25',
      carrier: 'XYZ Transport',
      priority: 'medium',
    },
  ]);

  const [pendingTasks, setPendingTasks] = useState<AgentTask[]>([
    {
      id: '1',
      title: 'Follow up with ABC Trucking',
      type: 'follow_up',
      priority: 'high',
      dueDate: '2025-01-19',
      loadId: 'LB-001',
      description: 'Confirm pickup time and driver details',
      completed: false,
    },
    {
      id: '2',
      title: 'Rate confirmation for LB-002',
      type: 'rate_confirmation',
      priority: 'medium',
      dueDate: '2025-01-20',
      loadId: 'LB-002',
      description: 'Verify final rate with customer',
      completed: false,
    },
  ]);

  // Load broker agent data
  useEffect(() => {
    const loadAgentData = async () => {
      try {
        const agentData = await brokerAgentIntegrationService.getCurrentAgent();
        setCurrentAgent(agentData);

        // Create mock session data with correct types
        const mockSession: UserSession = {
          sessionId: 'mock-session-001',
          userId: agentData?.id || 'agent-001',
          firstName: agentData?.name.split(' ')[0] || 'Agent',
          lastName: agentData?.name.split(' ')[1] || 'User',
          email: agentData?.email || 'agent@fleetflow.com',
          role: 'BB',
          permissions: {
            canCreateLoads: true,
            canModifyRates: true,
            canAccessFinancials: false,
            canViewAllCompanyLoads: false,
            canManageCarriers: false,
            canGenerateReports: true,
            maxContractValue: 50000,
            requiresApprovalOver: 25000,
            territories: ['General'],
            loadTypes: ['Dry Van', 'Refrigerated', 'Flatbed'],
          },
          loginTime: new Date().toISOString(),
          lastActivity: new Date().toISOString(),
        };
        setSession(mockSession);

        // Use getAllAgentLoads and convert to local AgentLoad type
        const serviceLoads = brokerAgentIntegrationService.getAllAgentLoads();
        const convertedLoads: AgentLoad[] = serviceLoads.map((load) => ({
          id: load.id,
          loadNumber: load.loadNumber,
          origin: load.origin,
          destination: load.destination,
          commodity: 'General Freight', // Default commodity
          rate: load.rate,
          status: load.status as any, // Type assertion for status
          pickupDate: load.pickupDate,
          deliveryDate: load.deliveryDate,
          carrier: undefined, // Not provided in service
          priority: 'medium' as any, // Default priority
        }));
        setAgentLoads(convertedLoads);

        // Create mock tasks since getAgentTasks doesn't exist
        const mockTasks: AgentTask[] = [
          {
            id: '1',
            title: 'Follow up with ABC Trucking',
            type: 'follow_up',
            priority: 'high',
            dueDate: '2025-01-19',
            loadId: 'LB-001',
            description: 'Confirm pickup time and driver details',
            completed: false,
          },
          {
            id: '2',
            title: 'Rate confirmation for LB-002',
            type: 'rate_confirmation',
            priority: 'medium',
            dueDate: '2025-01-20',
            loadId: 'LB-002',
            description: 'Verify final rate with customer',
            completed: false,
          },
        ];
        setPendingTasks(mockTasks);
      } catch (error) {
        console.error('Error loading agent data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAgentData();
  }, []);

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
      quoteNumber: `SP-${Date.now()}`,
      timestamp: Date.now(),
      baseRate: Math.round(baseRate),
      insuranceCost: Math.round(insuranceCost),
      fuelSurcharge: Math.round(fuelSurcharge),
      total: Math.round(total),
      details: {
        serviceType: specializedData.serviceType,
        weight,
        dimensions: specializedData.dimensions,
        value,
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
    const duration = parseInt(warehousingData.duration) || 0;

    let baseRate = palletCount * 15 * duration;
    if (warehousingData.temperature === 'Refrigerated') baseRate *= 1.4;
    else if (warehousingData.temperature === 'Frozen') baseRate *= 1.6;

    const handlingFee = palletCount * 25;
    const total = baseRate + handlingFee;

    const quote = {
      id: Date.now().toString(),
      type: 'Warehousing',
      quoteNumber: `WH-${Date.now()}`,
      timestamp: Date.now(),
      baseRate: Math.round(baseRate),
      handlingFee: Math.round(handlingFee),
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
    const selectedServices = multiServiceData.selectedServices.length;
    const totalWeight = parseFloat(multiServiceData.totalWeight) || 0;

    let baseRate = selectedServices * 500 + totalWeight * 0.8;
    const coordinationFee = selectedServices * 200;
    const total = baseRate + coordinationFee;

    const quote = {
      id: Date.now().toString(),
      type: 'Multi-Service',
      quoteNumber: `MS-${Date.now()}`,
      timestamp: Date.now(),
      baseRate: Math.round(baseRate),
      coordinationFee: Math.round(coordinationFee),
      total: Math.round(total),
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

  const handleLogout = () => {
    // Implement logout logic
    console.log('Logging out...');
  };

  const handleLoadCreated = (load: any) => {
    console.log('New load created:', load);
    // Handle new load creation
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background:
            'linear-gradient(135deg, #022c22 0%, #044e46 50%, #0a1612 100%)',
        }}
      >
        <div style={{ color: 'white', fontSize: '1.2rem' }}>
          🔄 Loading Agent Portal...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background:
          'linear-gradient(135deg, #022c22 0%, #044e46 50%, #0a1612 100%)',
        minHeight: '100vh',
        padding: '20px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1
            style={{
              color: 'white',
              margin: 0,
              fontSize: '2rem',
              fontWeight: '700',
              background: 'linear-gradient(45deg, #3b82f6, #06b6d4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px',
            }}
          >
            👤 Broker Agent Portal & Sales Management
          </h1>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              margin: '4px 0 0 0',
              fontSize: '1rem',
              fontWeight: '500',
            }}
          >
            Freight Brokerage Sales • Customer Relationship Management • Load
            Optimization
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginTop: '8px',
            }}
          >
            <span
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10b981',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: '600',
              }}
            >
              ✅ {session?.firstName} {session?.lastName} Active
            </span>
            <span
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#3b82f6',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: '600',
              }}
            >
              🎯 {currentAgent?.department || 'Agent'}
            </span>
            <span
              style={{
                background: 'rgba(245, 158, 11, 0.2)',
                color: '#fbbf24',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: '600',
              }}
            >
              📊 Sales Portal Active
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Link
            href='/dialer'
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              textDecoration: 'none',
            }}
          >
            📞 Dialer
          </Link>
          <Link
            href='/broker/dashboard'
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textDecoration: 'none',
            }}
          >
            🏢 Brokerage Portal
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {[
          {
            title: 'Active Customers',
            value: 34,
            unit: '',
            change: '+3',
            trend: 'up',
            description: 'Currently active customer relationships',
            color: '#3b82f6',
            background: 'rgba(59, 130, 246, 0.5)',
            border: 'rgba(59, 130, 246, 0.3)',
          },
          {
            title: 'Active Loads',
            value: 67,
            unit: '',
            change: '+8',
            trend: 'up',
            description: 'Loads currently being managed',
            color: '#10b981',
            background: 'rgba(16, 185, 129, 0.5)',
            border: 'rgba(16, 185, 129, 0.3)',
          },
          {
            title: 'Monthly Revenue',
            value: 125.4,
            unit: 'K',
            change: '+15.2%',
            trend: 'up',
            description: 'Revenue generated this month',
            color: '#8b5cf6',
            background: 'rgba(139, 92, 246, 0.5)',
            border: 'rgba(139, 92, 246, 0.3)',
          },
          {
            title: 'Customer Satisfaction',
            value: 96.8,
            unit: '%',
            change: '+2.1%',
            trend: 'up',
            description: 'Overall customer satisfaction score',
            color: '#f59e0b',
            background: 'rgba(245, 158, 11, 0.5)',
            border: 'rgba(245, 158, 11, 0.3)',
          },
          {
            title: 'Quote Success Rate',
            value: 78.5,
            unit: '%',
            change: '+4.3%',
            trend: 'up',
            description: 'Quotes converted to loads',
            color: '#14b8a6',
            background: 'rgba(20, 184, 166, 0.5)',
            border: 'rgba(20, 184, 166, 0.3)',
          },
          {
            title: 'Pending Tasks',
            value: pendingTasks.length,
            unit: '',
            change: '-2',
            trend: 'down',
            description: 'Tasks requiring attention',
            color: '#ef4444',
            background: 'rgba(239, 68, 68, 0.5)',
            border: 'rgba(239, 68, 68, 0.3)',
          },
        ].map((kpi, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '8px',
              padding: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.2s ease',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem',
              }}
            >
              <h3
                style={{
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: 'white',
                  margin: 0,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                }}
              >
                {kpi.title}
              </h3>
              <div
                style={{
                  fontSize: '12px',
                  color: kpi.trend === 'up' ? '#10b981' : '#ef4444',
                  fontWeight: '600',
                }}
              >
                {kpi.change}
              </div>
            </div>
            <div
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: kpi.color,
                marginBottom: '0.25rem',
              }}
            >
              {typeof kpi.value === 'number' && kpi.value % 1 !== 0
                ? kpi.value.toFixed(1)
                : kpi.value}
              {kpi.unit}
            </div>
            <p
              style={{
                fontSize: '0.8rem',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
                textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
              }}
            >
              {kpi.description}
            </p>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >
        {[
          {
            id: 'quotes-workflow',
            label: 'Quotes & Workflow',
            icon: '💼',
            color: '#3b82f6',
          },
          {
            id: 'loads-bids',
            label: 'Loads & Bidding',
            icon: '📦',
            color: '#14b8a6',
          },
          {
            id: 'contracts-bol',
            label: 'Contracts & BOL',
            icon: '📋',
            color: '#f97316',
          },
          {
            id: 'analytics',
            label: 'Performance Analytics',
            icon: '📊',
            color: '#6366f1',
          },
          {
            id: 'ai-intelligence',
            label: 'AI Intelligence',
            icon: '🤖',
            color: '#8b5cf6',
          },
          {
            id: 'financial-dashboard',
            label: 'Financial Dashboard',
            icon: '💹',
            color: '#10b981',
          },
          {
            id: 'enhanced-crm',
            label: 'Enhanced CRM',
            icon: '🏢',
            color: '#1e40af',
          },
          {
            id: 'carrier-network',
            label: 'Carrier Network',
            icon: '🚛',
            color: '#0ea5e9',
          },
          {
            id: 'market-intelligence',
            label: 'Market Intelligence',
            icon: '📊',
            color: '#ec4899',
          },
          {
            id: 'shipper-acquisition',
            label: 'Shipper Acquisition',
            icon: '🏢',
            color: '#059669',
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background:
                activeTab === tab.id
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))'
                  : 'rgba(255, 255, 255, 0.1)',
              color:
                activeTab === tab.id ? '#60a5fa' : 'rgba(255, 255, 255, 0.8)',
              border:
                activeTab === tab.id
                  ? '1px solid rgba(59, 130, 246, 0.3)'
                  : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '12px 20px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(10px)',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        {/* Quotes & Workflow Tab */}
        {activeTab === 'quotes-workflow' && (
          <div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              💼 Freight Quotes & Workflow Management
            </h2>

            {/* Quote Type Tabs */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '24px',
                flexWrap: 'wrap',
              }}
            >
              {[
                {
                  id: 'LTL',
                  label: 'LTL',
                  icon: '📦',
                  color: '#3b82f6',
                },
                {
                  id: 'FTL',
                  label: 'FTL',
                  icon: '🚛',
                  color: '#10b981',
                },
                {
                  id: 'Specialized',
                  label: 'Specialized',
                  icon: '⭐',
                  color: '#8b5cf6',
                },
                {
                  id: 'Warehousing',
                  label: 'Warehousing',
                  icon: '🏭',
                  color: '#f59e0b',
                },
                {
                  id: 'Multi-Service',
                  label: 'Multi-Service',
                  icon: '🔗',
                  color: '#14b8a6',
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveQuoteTab(tab.id as any)}
                  style={{
                    background:
                      activeQuoteTab === tab.id
                        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))'
                        : 'rgba(255, 255, 255, 0.1)',
                    color:
                      activeQuoteTab === tab.id
                        ? '#60a5fa'
                        : 'rgba(255, 255, 255, 0.8)',
                    border:
                      activeQuoteTab === tab.id
                        ? '1px solid rgba(59, 130, 246, 0.3)'
                        : '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* LTL Calculator */}
            {activeQuoteTab === 'LTL' && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <h3
                  style={{
                    marginBottom: '20px',
                    color: '#8b5cf6',
                    fontSize: '1.2rem',
                  }}
                >
                  📦 LTL (Less Than Truckload) Quote Calculator
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px',
                    marginBottom: '24px',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '600',
                        color: 'rgba(255, 255, 255, 0.9)',
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
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        background: 'rgba(0, 0, 0, 0.3)',
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
                        color: 'rgba(255, 255, 255, 0.9)',
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
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        background: 'rgba(0, 0, 0, 0.3)',
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
                        color: 'rgba(255, 255, 255, 0.9)',
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
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        background: 'rgba(0, 0, 0, 0.3)',
                        color: 'white',
                        fontSize: '14px',
                      }}
                      placeholder='Destination city, state'
                    />
                  </div>
                </div>
                <button
                  onClick={calculateLTL}
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
                  }}
                >
                  🧮 Calculate LTL Quote
                </button>
              </div>
            )}

            {/* FTL Calculator */}
            {activeQuoteTab === 'FTL' && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <h3
                  style={{
                    marginBottom: '20px',
                    color: '#10b981',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                  }}
                >
                  🚛 FTL (Full Truckload) Quote Calculator
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px',
                    marginBottom: '24px',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '600',
                        color: 'white',
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
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        background: 'rgba(0, 0, 0, 0.3)',
                        color: 'white',
                        fontSize: '14px',
                      }}
                      placeholder='Enter miles'
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '600',
                        color: 'white',
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
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        background: 'rgba(0, 0, 0, 0.3)',
                        color: 'white',
                        fontSize: '14px',
                      }}
                    >
                      <option value='Van'>Van</option>
                      <option value='Flatbed'>Flatbed</option>
                      <option value='Reefer'>Reefer</option>
                      <option value='Power Only'>Power Only</option>
                    </select>
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '600',
                        color: 'white',
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
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        background: 'rgba(0, 0, 0, 0.3)',
                        color: 'white',
                        fontSize: '14px',
                      }}
                      placeholder='Enter weight'
                    />
                  </div>
                </div>
                <button
                  onClick={calculateFTL}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                  }}
                >
                  🧮 Calculate FTL Quote
                </button>
              </div>
            )}

            {/* Specialized Services Calculator */}
            {activeQuoteTab === 'Specialized' && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <h3
                  style={{
                    marginBottom: '20px',
                    color: '#8b5cf6',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                  }}
                >
                  ⭐ Specialized Services Quote Calculator
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px',
                    marginBottom: '24px',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '600',
                        color: 'white',
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
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        background: 'rgba(0, 0, 0, 0.3)',
                        color: 'white',
                        fontSize: '14px',
                      }}
                    >
                      <option value='Hazmat'>Hazmat Transport</option>
                      <option value='Oversized'>Oversized Loads</option>
                      <option value='Temperature'>Temperature Controlled</option>
                      <option value='Express'>Express Delivery</option>
                      <option value='White Glove'>White Glove Service</option>
                    </select>
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '600',
                        color: 'white',
                      }}
                    >
                      Distance (miles)
                    </label>
                    <input
                      type='number'
                      value={specializedData.distance}
                      onChange={(e) =>
                        setSpecializedData((prev) => ({
                          ...prev,
                          distance: e.target.value,
                        }))
                      }
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        background: 'rgba(0, 0, 0, 0.3)',
                        color: 'white',
                        fontSize: '14px',
                      }}
                      placeholder='Enter distance'
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '600',
                        color: 'white',
                      }}
                    >
                      Complexity Level
                    </label>
                    <select
                      value={specializedData.complexity}
                      onChange={(e) =>
                        setSpecializedData((prev) => ({
                          ...prev,
                          complexity: e.target.value,
                        }))
                      }
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        background: 'rgba(0, 0, 0, 0.3)',
                        color: 'white',
                        fontSize: '14px',
                      }}
                    >
                      <option value='low'>Low</option>
                      <option value='medium'>Medium</option>
                      <option value='high'>High</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={calculateSpecialized}
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
                  }}
                >
                  🧮 Calculate Specialized Quote
                </button>
              </div>
            )}

            {/* Quote Results Display */}
            {pendingQuote && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '24px',
                  marginTop: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    marginBottom: '20px',
                    fontSize: '1.3rem',
                    fontWeight: '600',
                  }}
                >
                  ✅ Quote Generated Successfully!
                </h3>
                <div
                  style={{
                    color: 'white',
                    marginBottom: '24px',
                    fontWeight: '500',
                  }}
                >
                  <p><strong>Quote Number:</strong> {pendingQuote.quoteNumber}</p>
                  <p><strong>Type:</strong> {pendingQuote.type}</p>
                  <p><strong>Base Rate:</strong> ${pendingQuote.baseRate}</p>
                  <p><strong>Total:</strong> ${pendingQuote.total}</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setPendingQuote(null)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    Close
                  </button>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    📧 Send to Customer
                  </button>
                </div>
              </div>
            )}

            {/* Quote History & Workflow Management */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '24px',
                marginTop: '24px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <h3
                style={{
                  color: '#60a5fa',
                  marginBottom: '20px',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                }}
              >
                📊 Quote History & Workflow Status
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '20px',
                }}
              >
                {/* Recent Quotes */}
                <div>
                  <h4
                    style={{
                      color: 'white',
                      marginBottom: '16px',
                      fontSize: '1rem',
                      fontWeight: '600',
                    }}
                  >
                    🕒 Recent Quotes (5)
                  </h4>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {[
                      {
                        id: 'Q-001',
                        customer: 'ABC Manufacturing',
                        type: 'LTL',
                        amount: '$1,250',
                        status: 'Sent',
                        date: '2 hours ago',
                      },
                      {
                        id: 'Q-002',
                        customer: 'XYZ Logistics',
                        type: 'FTL',
                        amount: '$3,800',
                        status: 'Pending',
                        date: '1 day ago',
                      },
                      {
                        id: 'Q-003',
                        customer: 'Global Industries',
                        type: 'Specialized',
                        amount: '$5,200',
                        status: 'Accepted',
                        date: '3 days ago',
                      },
                    ].map((quote) => (
                      <div
                        key={quote.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          padding: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
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
                          <h5
                            style={{
                              color: 'white',
                              margin: 0,
                              fontSize: '0.9rem',
                              fontWeight: '600',
                            }}
                          >
                            {quote.id}
                          </h5>
                          <span
                            style={{
                              background:
                                quote.status === 'Accepted'
                                  ? 'rgba(16, 185, 129, 0.2)'
                                  : quote.status === 'Sent'
                                    ? 'rgba(59, 130, 246, 0.2)'
                                    : 'rgba(245, 158, 11, 0.2)',
                              color:
                                quote.status === 'Accepted'
                                  ? '#10b981'
                                  : quote.status === 'Sent'
                                    ? '#3b82f6'
                                    : '#f59e0b',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '0.7rem',
                              fontWeight: '600',
                            }}
                          >
                            {quote.status}
                          </span>
                        </div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '0.8rem',
                            fontWeight: '500',
                          }}
                        >
                          <p style={{ margin: '4px 0' }}>
                            <strong>Customer:</strong> {quote.customer}
                          </p>
                          <p style={{ margin: '4px 0' }}>
                            <strong>Type:</strong> {quote.type}
                          </p>
                          <p style={{ margin: '4px 0' }}>
                            <strong>Amount:</strong> {quote.amount}
                          </p>
                          <p style={{ margin: '4px 0' }}>
                            <strong>Date:</strong> {quote.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Workflow Status */}
                <div>
                  <h4
                    style={{
                      color: 'white',
                      marginBottom: '16px',
                      fontSize: '1rem',
                      fontWeight: '600',
                    }}
                  >
                    🔄 Active Workflows (3)
                  </h4>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {[
                      {
                        id: 'W-001',
                        customer: 'ABC Manufacturing',
                        stage: 'Quote Review',
                        progress: 75,
                        nextStep: 'Customer Approval',
                      },
                      {
                        id: 'W-002',
                        customer: 'XYZ Logistics',
                        stage: 'Carrier Assignment',
                        progress: 45,
                        nextStep: 'Load Confirmation',
                      },
                      {
                        id: 'W-003',
                        customer: 'Global Industries',
                        stage: 'In Transit',
                        progress: 90,
                        nextStep: 'Delivery Confirmation',
                      },
                    ].map((workflow) => (
                      <div
                        key={workflow.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          padding: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
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
                          <h5
                            style={{
                              color: 'white',
                              margin: 0,
                              fontSize: '0.9rem',
                              fontWeight: '600',
                            }}
                          >
                            {workflow.id}
                          </h5>
                          <span
                            style={{
                              background: 'rgba(59, 130, 246, 0.2)',
                              color: '#3b82f6',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '0.7rem',
                              fontWeight: '600',
                            }}
                          >
                            {workflow.progress}%
                          </span>
                        </div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '0.8rem',
                            fontWeight: '500',
                          }}
                        >
                          <p style={{ margin: '4px 0' }}>
                            <strong>Customer:</strong> {workflow.customer}
                          </p>
                          <p style={{ margin: '4px 0' }}>
                            <strong>Stage:</strong> {workflow.stage}
                          </p>
                          <p style={{ margin: '4px 0' }}>
                            <strong>Next:</strong> {workflow.nextStep}
                          </p>
                        </div>
                        {/* Progress Bar */}
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '4px',
                            height: '6px',
                            marginTop: '8px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                              height: '100%',
                              width: `${workflow.progress}%`,
                              borderRadius: '4px',
                              transition: 'width 0.3s ease',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

            {/* FTL Calculator */}
            {activeQuoteTab === 'FTL' && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <h3
                  style={{
                    marginBottom: '20px',
                    color: '#10b981',
                    fontSize: '1.2rem',
                  }}
                >
                  🚛 FTL (Full Truckload) Quote Calculator
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px',
                    marginBottom: '24px',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '600',
                        color: 'rgba(255, 255, 255, 0.9)',
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
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        background: 'rgba(0, 0, 0, 0.3)',
                        color: 'white',
                        fontSize: '14px',
                      }}
                      placeholder='Enter miles'
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '600',
                        color: 'rgba(255, 255, 255, 0.9)',
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
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        background: 'rgba(0, 0, 0, 0.3)',
                        color: 'white',
                        fontSize: '14px',
                      }}
                    >
                      <option value='Van'>Van</option>
                      <option value='Flatbed'>Flatbed</option>
                      <option value='Reefer'>Reefer</option>
                      <option value='Power Only'>Power Only</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={calculateFTL}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  🧮 Calculate FTL Quote
                </button>
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
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '32px',
                    maxWidth: '500px',
                    width: '90%',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      marginBottom: '20px',
                      fontSize: '1.3rem',
                    }}
                  >
                    ✅ Quote Generated Successfully!
                  </h3>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      marginBottom: '24px',
                    }}
                  >
                    <p>
                      <strong>Quote Number:</strong> {pendingQuote.quoteNumber}
                    </p>
                    <p>
                      <strong>Type:</strong> {pendingQuote.type}
                    </p>
                    <p>
                      <strong>Base Rate:</strong> ${pendingQuote.baseRate}
                    </p>
                    <p>
                      <strong>Total:</strong> ${pendingQuote.total}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => setShowConfirmation(false)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setQuotes([...quotes, pendingQuote]);
                        setShowConfirmation(false);
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      Save Quote
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loads & Bidding Tab */}
        {activeTab === 'loads-bids' && (
          <div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              📦 Load Management & Bidding System
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
              }}
            >
              {/* Active Loads */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <h3
                  style={{
                    color: '#14b8a6',
                    marginBottom: '16px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                  }}
                >
                  🚛 Active Loads ({agentLoads.length})
                </h3>
                {agentLoads.map((load) => (
                  <div
                    key={load.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.12)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.transform = 'translateY(0)';
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
                      <h4
                        style={{
                          color: 'white',
                          margin: 0,
                          fontSize: '1rem',
                          fontWeight: '600',
                        }}
                      >
                        {load.loadNumber}
                      </h4>
                      <span
                        style={{
                          background:
                            load.priority === 'high'
                              ? 'rgba(239, 68, 68, 0.3)'
                              : 'rgba(59, 130, 246, 0.4)',
                          color:
                            load.priority === 'high' ? '#fca5a5' : '#93c5fd',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        {load.priority} priority
                      </span>
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '0.9rem',
                        marginBottom: '8px',
                        fontWeight: '500',
                      }}
                    >
                      <p>
                        <strong>Route:</strong> {load.origin} →{' '}
                        {load.destination}
                      </p>
                      <p>
                        <strong>Commodity:</strong> {load.commodity}
                      </p>
                      <p>
                        <strong>Rate:</strong> ${load.rate.toLocaleString()}
                      </p>
                      <p>
                        <strong>Status:</strong> {load.status.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pending Tasks */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <h3
                  style={{
                    color: '#f59e0b',
                    marginBottom: '16px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                  }}
                >
                  ⚠️ Pending Tasks ({pendingTasks.length})
                </h3>
                {pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.12)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.transform = 'translateY(0)';
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
                      <h4
                        style={{
                          color: 'white',
                          margin: 0,
                          fontSize: '1rem',
                          fontWeight: '600',
                        }}
                      >
                        {task.title}
                      </h4>
                      <span
                        style={{
                          background:
                            task.priority === 'high'
                              ? 'rgba(239, 68, 68, 0.3)'
                              : 'rgba(59, 130, 246, 0.4)',
                          color:
                            task.priority === 'high' ? '#fca5a5' : '#93c5fd',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        {task.priority}
                      </span>
                    </div>
                    <p
                      style={{
                        color: 'white',
                        fontSize: '0.9rem',
                        marginBottom: '8px',
                        fontWeight: '500',
                      }}
                    >
                      {task.description}
                    </p>
                    <p
                      style={{
                        color: 'white',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                      }}
                    >
                      Due: {task.dueDate}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Performance Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              📊 Performance Analytics & Metrics
            </h2>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '20px',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: '2rem',
                      color: '#3b82f6',
                      fontWeight: 'bold',
                    }}
                  >
                    34
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Active Customers
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: '2rem',
                      color: '#10b981',
                      fontWeight: 'bold',
                    }}
                  >
                    67
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Active Loads
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: '2rem',
                      color: '#8b5cf6',
                      fontWeight: 'bold',
                    }}
                  >
                    $125.4K
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Monthly Revenue
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: '2rem',
                      color: '#f59e0b',
                      fontWeight: 'bold',
                    }}
                  >
                    96.8%
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Customer Satisfaction
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced CRM Tab */}
        {activeTab === 'enhanced-crm' && (
          <div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              🏢 Enhanced Customer Relationship Management
            </h2>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '20px',
                }}
              >
                {/* Customer Overview */}
                <div>
                  <h3
                    style={{
                      color: '#60a5fa',
                      marginBottom: '16px',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                    }}
                  >
                    👥 Customer Overview
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '16px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '1.5rem',
                          color: '#3b82f6',
                          fontWeight: 'bold',
                        }}
                      >
                        34
                      </div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                        }}
                      >
                        Active Customers
                      </div>
                    </div>
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '16px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '1.5rem',
                          color: '#10b981',
                          fontWeight: 'bold',
                        }}
                      >
                        12
                      </div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                        }}
                      >
                        New This Month
                      </div>
                    </div>
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '16px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '1.5rem',
                          color: '#f59e0b',
                          fontWeight: 'bold',
                        }}
                      >
                        96.8%
                      </div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                        }}
                      >
                        Satisfaction Rate
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Management Actions */}
                <div>
                  <h3
                    style={{
                      color: '#60a5fa',
                      marginBottom: '16px',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                    }}
                  >
                    ⚡ Quick Actions
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <button
                      onClick={() => setShowShipperForm(true)}
                      style={{
                        background: 'linear-gradient(135deg, #1e40af, #1e3a8a)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        width: '100%',
                        boxShadow: '0 4px 12px rgba(30, 64, 175, 0.3)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow =
                          '0 6px 16px rgba(30, 64, 175, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow =
                          '0 4px 12px rgba(30, 64, 175, 0.3)';
                      }}
                    >
                      + Add New Customer
                    </button>
                    <button
                      style={{
                        background: 'rgba(255, 255, 255, 0.12)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        width: '100%',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.18)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.12)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      📊 Generate Reports
                    </button>
                    <button
                      style={{
                        background: 'rgba(255, 255, 255, 0.12)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        width: '100%',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.18)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.12)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      🔍 Search Customers
                    </button>
                  </div>
                </div>

                {/* Recent Customer Activity */}
                <div>
                  <h3
                    style={{
                      color: '#60a5fa',
                      marginBottom: '16px',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                    }}
                  >
                    📈 Recent Activity
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {[
                      {
                        customer: 'ABC Manufacturing',
                        action: 'Quote Requested',
                        time: '2 hours ago',
                        type: 'quote',
                      },
                      {
                        customer: 'XYZ Logistics',
                        action: 'Load Confirmed',
                        time: '4 hours ago',
                        type: 'load',
                      },
                      {
                        customer: 'Global Industries',
                        action: 'Payment Received',
                        time: '1 day ago',
                        type: 'payment',
                      },
                    ].map((activity, index) => (
                      <div
                        key={index}
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          borderRadius: '8px',
                          padding: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '4px',
                          }}
                        >
                          <h4
                            style={{
                              color: 'white',
                              margin: 0,
                              fontSize: '0.9rem',
                            }}
                          >
                            {activity.customer}
                          </h4>
                          <span
                            style={{
                              background:
                                activity.type === 'quote'
                                  ? 'rgba(59, 130, 246, 0.2)'
                                  : activity.type === 'load'
                                    ? 'rgba(16, 185, 129, 0.2)'
                                    : 'rgba(245, 158, 11, 0.2)',
                              color:
                                activity.type === 'quote'
                                  ? '#3b82f6'
                                  : activity.type === 'load'
                                    ? '#10b981'
                                    : '#f59e0b',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '0.7rem',
                              fontWeight: '600',
                            }}
                          >
                            {activity.type}
                          </span>
                        </div>
                        <p
                          style={{
                            color: 'white',
                            fontSize: '0.8rem',
                            margin: '4px 0 0 0',
                            fontWeight: '500',
                          }}
                        >
                          {activity.action} • {activity.time}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Customer List Section */}
              <div style={{ marginTop: '24px' }}>
                <h3
                  style={{
                    color: '#60a5fa',
                    marginBottom: '16px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                  }}
                >
                  📋 Customer Directory
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '16px',
                  }}
                >
                  {[
                    {
                      name: 'ABC Manufacturing',
                      status: 'Active',
                      revenue: '$45,000',
                      lastContact: '2 days ago',
                    },
                    {
                      name: 'XYZ Logistics',
                      status: 'Active',
                      revenue: '$32,500',
                      lastContact: '1 week ago',
                    },
                    {
                      name: 'Global Industries',
                      status: 'Active',
                      revenue: '$67,800',
                      lastContact: '3 days ago',
                    },
                    {
                      name: 'TechCorp Solutions',
                      status: 'Prospect',
                      revenue: '$0',
                      lastContact: '1 day ago',
                    },
                    {
                      name: 'Premium Freight Co',
                      status: 'Active',
                      revenue: '$28,900',
                      lastContact: '5 days ago',
                    },
                    {
                      name: 'Elite Transport',
                      status: 'Inactive',
                      revenue: '$12,400',
                      lastContact: '2 weeks ago',
                    },
                  ].map((customer, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.12)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.transform = 'translateY(0)';
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
                        <h4
                          style={{
                            color: 'white',
                            margin: 0,
                            fontSize: '1rem',
                            fontWeight: '600',
                          }}
                        >
                          {customer.name}
                        </h4>
                        <span
                          style={{
                            background:
                              customer.status === 'Active'
                                ? 'rgba(16, 185, 129, 0.2)'
                                : customer.status === 'Prospect'
                                  ? 'rgba(59, 130, 246, 0.2)'
                                  : 'rgba(239, 68, 68, 0.2)',
                            color:
                              customer.status === 'Active'
                                ? '#10b981'
                                : customer.status === 'Prospect'
                                  ? '#3b82f6'
                                  : '#ef4444',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                          }}
                        >
                          {customer.status}
                        </span>
                      </div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                        }}
                      >
                        <p style={{ margin: '4px 0' }}>
                          <strong>Revenue:</strong> {customer.revenue}
                        </p>
                        <p style={{ margin: '4px 0' }}>
                          <strong>Last Contact:</strong> {customer.lastContact}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Communication Tools */}
              <div style={{ marginTop: '24px' }}>
                <h3
                  style={{
                    color: '#60a5fa',
                    marginBottom: '16px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                  }}
                >
                  💬 Communication Tools
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
                      textAlign: 'center',
                      padding: '20px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                      📧
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontWeight: '600',
                        marginBottom: '8px',
                      }}
                    >
                      Email Campaigns
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                      }}
                    >
                      Send bulk communications
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '20px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                      📱
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontWeight: '600',
                        marginBottom: '8px',
                      }}
                    >
                      SMS Notifications
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                      }}
                    >
                      Real-time updates
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '20px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                      📊
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontWeight: '600',
                        marginBottom: '8px',
                      }}
                    >
                      Feedback Surveys
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                      }}
                    >
                      Collect insights
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '20px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                      🎯
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontWeight: '600',
                        marginBottom: '8px',
                      }}
                    >
                      Follow-up Tasks
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                      }}
                    >
                      Automated reminders
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Intelligence Tab */}
        {activeTab === 'ai-intelligence' && (
          <div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              🤖 AI Intelligence & Automation
            </h2>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '20px',
                }}
              >
                Leverage AI-powered insights for route optimization, pricing
                strategies, and customer intelligence.
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
                    🧠
                  </div>
                  <div style={{ color: 'white', fontWeight: '600' }}>
                    Route Optimization
                  </div>
                </div>
                <div
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
                    💰
                  </div>
                  <div style={{ color: 'white', fontWeight: '600' }}>
                    Pricing Intelligence
                  </div>
                </div>
                <div
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
                    📊
                  </div>
                  <div style={{ color: 'white', fontWeight: '600' }}>
                    Market Analysis
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Financial Dashboard Tab */}
        {activeTab === 'financial-dashboard' && (
          <div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              💹 Financial Dashboard & Revenue Tracking
            </h2>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '20px',
                }}
              >
                <div
                  style={{
                    textAlign: 'center',
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '2rem',
                      color: '#10b981',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                    }}
                  >
                    $125.4K
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Monthly Revenue
                  </div>
                </div>
                <div
                  style={{
                    textAlign: 'center',
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '2rem',
                      color: '#3b82f6',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                    }}
                  >
                    $1.2M
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Annual Revenue
                  </div>
                </div>
                <div
                  style={{
                    textAlign: 'center',
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '2rem',
                      color: '#f59e0b',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                    }}
                  >
                    18.5%
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Growth Rate
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contracts & BOL Tab */}
        {activeTab === 'contracts-bol' && (
          <div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              📋 Contracts & Bill of Lading Management
            </h2>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '20px',
                }}
              >
                {/* Active Contracts */}
                <div>
                  <h3
                    style={{
                      color: '#f97316',
                      marginBottom: '16px',
                      fontSize: '1.1rem',
                    }}
                  >
                    📄 Active Contracts (12)
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {[
                      {
                        id: '1',
                        customer: 'ABC Manufacturing',
                        value: '$45,000',
                        status: 'Active',
                        expires: '2025-06-15',
                      },
                      {
                        id: '2',
                        customer: 'XYZ Logistics',
                        value: '$32,500',
                        status: 'Active',
                        expires: '2025-08-20',
                      },
                      {
                        id: '3',
                        customer: 'Global Industries',
                        value: '$67,800',
                        status: 'Active',
                        expires: '2025-05-10',
                      },
                    ].map((contract) => (
                      <div
                        key={contract.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          padding: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
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
                          <h4
                            style={{
                              color: 'white',
                              margin: 0,
                              fontSize: '1rem',
                            }}
                          >
                            {contract.customer}
                          </h4>
                          <span
                            style={{
                              background: 'rgba(16, 185, 129, 0.2)',
                              color: '#10b981',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                            }}
                          >
                            {contract.status}
                          </span>
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.9rem',
                          }}
                        >
                          <p>
                            <strong>Value:</strong> {contract.value}
                          </p>
                          <p>
                            <strong>Expires:</strong> {contract.expires}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BOL Management */}
                <div>
                  <h3
                    style={{
                      color: '#f97316',
                      marginBottom: '16px',
                      fontSize: '1.1rem',
                    }}
                  >
                    📋 Bill of Lading (8 Pending)
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {[
                      {
                        id: '1',
                        load: 'LB-001',
                        customer: 'ABC Manufacturing',
                        status: 'Pending Review',
                      },
                      {
                        id: '2',
                        load: 'LB-002',
                        customer: 'XYZ Logistics',
                        status: 'Ready for Signature',
                      },
                      {
                        id: '3',
                        load: 'LB-003',
                        customer: 'Global Industries',
                        status: 'In Transit',
                      },
                    ].map((bol) => (
                      <div
                        key={bol.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          padding: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
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
                          <h4
                            style={{
                              color: 'white',
                              margin: 0,
                              fontSize: '1rem',
                            }}
                          >
                            {bol.load}
                          </h4>
                          <span
                            style={{
                              background: 'rgba(245, 158, 11, 0.2)',
                              color: '#f59e0b',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                            }}
                          >
                            {bol.status}
                          </span>
                        </div>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.9rem',
                            margin: 0,
                          }}
                        >
                          <strong>Customer:</strong> {bol.customer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Carrier Network Tab */}
        {activeTab === 'carrier-network' && (
          <div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              🚛 Carrier Network Management
            </h2>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '20px',
                }}
              >
                {/* Active Carriers */}
                <div>
                  <h3
                    style={{
                      color: '#0ea5e9',
                      marginBottom: '16px',
                      fontSize: '1.1rem',
                    }}
                  >
                    🚚 Active Carriers (24)
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {[
                      {
                        id: '1',
                        name: 'ABC Trucking',
                        equipment: 'Van, Flatbed',
                        rating: '4.8',
                        loads: '12',
                      },
                      {
                        id: '2',
                        name: 'XYZ Transport',
                        equipment: 'Reefer, Van',
                        rating: '4.6',
                        loads: '8',
                      },
                      {
                        id: '3',
                        name: 'Fast Freight Co',
                        equipment: 'Power Only',
                        rating: '4.9',
                        loads: '15',
                      },
                    ].map((carrier) => (
                      <div
                        key={carrier.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          padding: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
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
                          <h4
                            style={{
                              color: 'white',
                              margin: 0,
                              fontSize: '1rem',
                            }}
                          >
                            {carrier.name}
                          </h4>
                          <span
                            style={{
                              background: 'rgba(16, 185, 129, 0.2)',
                              color: '#10b981',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                            }}
                          >
                            ⭐ {carrier.rating}
                          </span>
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.9rem',
                          }}
                        >
                          <p>
                            <strong>Equipment:</strong> {carrier.equipment}
                          </p>
                          <p>
                            <strong>Active Loads:</strong> {carrier.loads}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Carrier Performance */}
                <div>
                  <h3
                    style={{
                      color: '#0ea5e9',
                      marginBottom: '16px',
                      fontSize: '1.1rem',
                    }}
                  >
                    📊 Performance Metrics
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '16px',
                    }}
                  >
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '1.5rem',
                          color: '#10b981',
                          fontWeight: 'bold',
                        }}
                      >
                        96.2%
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '0.9rem',
                        }}
                      >
                        On-Time Delivery
                      </div>
                    </div>
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '1.5rem',
                          color: '#3b82f6',
                          fontWeight: 'bold',
                        }}
                      >
                        4.7
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '0.9rem',
                        }}
                      >
                        Avg Rating
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Market Intelligence Tab */}
        {activeTab === 'market-intelligence' && (
          <div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              📊 Market Intelligence & Analytics
            </h2>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '20px',
                }}
              >
                {/* Market Trends */}
                <div>
                  <h3
                    style={{
                      color: '#ec4899',
                      marginBottom: '16px',
                      fontSize: '1.1rem',
                    }}
                  >
                    📈 Market Trends
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {[
                      {
                        lane: 'Chicago → Atlanta',
                        trend: '+12.5%',
                        rate: '$2.85/mile',
                      },
                      {
                        lane: 'Dallas → Los Angeles',
                        trend: '+8.3%',
                        rate: '$3.20/mile',
                      },
                      {
                        lane: 'New York → Miami',
                        trend: '+15.2%',
                        rate: '$2.95/mile',
                      },
                    ].map((trend, index) => (
                      <div
                        key={index}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          padding: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
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
                          <h4
                            style={{
                              color: 'white',
                              margin: 0,
                              fontSize: '1rem',
                            }}
                          >
                            {trend.lane}
                          </h4>
                          <span
                            style={{
                              background: 'rgba(16, 185, 129, 0.2)',
                              color: '#10b981',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                            }}
                          >
                            {trend.trend}
                          </span>
                        </div>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.9rem',
                            margin: 0,
                          }}
                        >
                          <strong>Current Rate:</strong> {trend.rate}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Competitive Analysis */}
                <div>
                  <h3
                    style={{
                      color: '#ec4899',
                      marginBottom: '16px',
                      fontSize: '1.1rem',
                    }}
                  >
                    🏆 Competitive Analysis
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '16px',
                    }}
                  >
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '1.5rem',
                          color: '#10b981',
                          fontWeight: 'bold',
                        }}
                      >
                        #2
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '0.9rem',
                        }}
                      >
                        Market Position
                      </div>
                    </div>
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '1.5rem',
                          color: '#3b82f6',
                          fontWeight: 'bold',
                        }}
                      >
                        +8.5%
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '0.9rem',
                        }}
                      >
                        vs Competitors
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Shipper Acquisition Tab */}
        {activeTab === 'shipper-acquisition' && (
          <div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              🏢 Shipper Acquisition & Growth
            </h2>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '20px',
                }}
              >
                {/* Lead Pipeline */}
                <div>
                  <h3
                    style={{
                      color: '#059669',
                      marginBottom: '16px',
                      fontSize: '1.1rem',
                    }}
                  >
                    🎯 Lead Pipeline (18 Active)
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {[
                      {
                        id: '1',
                        company: 'TechCorp Industries',
                        stage: 'Proposal',
                        value: '$85,000',
                        probability: '75%',
                      },
                      {
                        id: '2',
                        company: 'Global Manufacturing',
                        stage: 'Negotiation',
                        value: '$120,000',
                        probability: '60%',
                      },
                      {
                        id: '3',
                        company: 'E-commerce Solutions',
                        stage: 'Discovery',
                        value: '$65,000',
                        probability: '40%',
                      },
                    ].map((lead) => (
                      <div
                        key={lead.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          padding: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
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
                          <h4
                            style={{
                              color: 'white',
                              margin: 0,
                              fontSize: '1rem',
                            }}
                          >
                            {lead.company}
                          </h4>
                          <span
                            style={{
                              background: 'rgba(245, 158, 11, 0.2)',
                              color: '#f59e0b',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                            }}
                          >
                            {lead.stage}
                          </span>
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.9rem',
                          }}
                        >
                          <p>
                            <strong>Value:</strong> {lead.value}
                          </p>
                          <p>
                            <strong>Probability:</strong> {lead.probability}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Acquisition Metrics */}
                <div>
                  <h3
                    style={{
                      color: '#059669',
                      marginBottom: '16px',
                      fontSize: '1.1rem',
                    }}
                  >
                    📊 Acquisition Metrics
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '16px',
                    }}
                  >
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '1.5rem',
                          color: '#10b981',
                          fontWeight: 'bold',
                        }}
                      >
                        23%
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '0.9rem',
                        }}
                      >
                        Conversion Rate
                      </div>
                    </div>
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '1.5rem',
                          color: '#3b82f6',
                          fontWeight: 'bold',
                        }}
                      >
                        45
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '0.9rem',
                        }}
                      >
                        Days Avg Sales Cycle
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
