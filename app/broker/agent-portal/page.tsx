'use client';

import { useEffect, useState } from 'react';
import BrokerAgentPortalGettingStarted from '../../components/BrokerAgentPortalGettingStarted';
import { brokerAgentIntegrationService } from '../../services/BrokerAgentIntegrationService';
import { UserSession } from '../../services/BrokerageHierarchyService';

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
  const [agentLoads, setAgentLoads] = useState<AgentLoad[]>([]);
  const [pendingTasks, setPendingTasks] = useState<AgentTask[]>([]);

  // Quote calculator states
  const [activeQuoteTab, setActiveQuoteTab] = useState<
    | 'LTL'
    | 'FTL'
    | 'Specialized'
    | 'Warehousing'
    | 'Multi-Service'
    | 'SpotRates'
    | 'LaneQuoting'
    | 'History'
  >('LTL');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingQuote, setPendingQuote] = useState<any>(null);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [lanes, setLanes] = useState<any[]>([]);
  const [showLaneResults, setShowLaneResults] = useState(false);

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
    storageType: '',
    duration: '',
    palletCount: '',
    squareFootage: '',
    temperature: '',
    location: '',
    services: [] as string[],
    specialRequirements: '',
  });

  // Multi-Service State
  const [multiServiceData, setMultiServiceData] = useState({
    services: [] as string[],
    primaryService: '',
    secondaryServices: [] as string[],
    origin: '',
    destination: '',
    timeline: '',
    budget: '',
    complexity: 'standard',
  });

  useEffect(() => {
    const loadAgentData = async () => {
      try {
        const agentData = await brokerAgentIntegrationService.getCurrentAgent();
        setCurrentAgent(agentData);

        // Session will be set by authentication system
        const session: UserSession = {
          sessionId: '',
          userId: agentData?.id || '',
          firstName: agentData?.name.split(' ')[0] || '',
          lastName: agentData?.name.split(' ')[1] || '',
          email: agentData?.email || '',
          role: 'BB',
          permissions: {
            canCreateLoads: false,
            canModifyRates: false,
            canAccessFinancials: false,
            canViewAllCompanyLoads: false,
            canManageCarriers: false,
            canGenerateReports: false,
            maxContractValue: 0,
            requiresApprovalOver: 0,
            territories: [],
            loadTypes: [],
          },
          loginTime: '',
          lastActivity: '',
        };
        setSession(session);

        const serviceLoads = brokerAgentIntegrationService.getAllAgentLoads();
        const convertedLoads: AgentLoad[] = serviceLoads.map((load) => ({
          id: load.id,
          loadNumber: load.loadNumber,
          origin: load.origin,
          destination: load.destination,
          commodity: 'General Freight',
          rate: load.rate,
          status: load.status as any,
          pickupDate: load.pickupDate,
          deliveryDate: load.deliveryDate,
          carrier: undefined,
          priority: 'medium' as any,
        }));
        setAgentLoads(convertedLoads);

        // Tasks will be loaded from task management service
        const tasks: AgentTask[] = [];
        setPendingTasks(tasks);
      } catch (error) {
        console.error('Error loading agent data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAgentData();
  }, []);

  // Quote calculation functions
  const calculateLTL = () => {
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

    const quote = {
      id: Date.now().toString(),
      type: 'LTL',
      quoteNumber: `LTL-${Date.now()}`,
      baseRate: Math.round(baseRate),
      fuelSurcharge: Math.round(baseRate * 0.18),
      total: Math.round(totalRate + baseRate * 0.18),
      timestamp: Date.now(),
      data: ltlData,
    };

    setPendingQuote(quote);
    setShowConfirmation(true);
  };

  const calculateFTL = () => {
    const miles = parseFloat(ftlData.miles) || 0;
    const weight = parseFloat(ftlData.weight) || 0;

    let ratePerMile = 2.25;
    if (ftlData.equipmentType === 'Reefer') ratePerMile = 2.85;
    else if (ftlData.equipmentType === 'Flatbed') ratePerMile = 2.65;

    let baseRate = miles * ratePerMile;
    if (ftlData.hazmat) baseRate += 500;
    if (ftlData.teamDriver) baseRate += 800;
    if (weight > 45000) baseRate += 300;

    const quote = {
      id: Date.now().toString(),
      type: 'FTL',
      quoteNumber: `FTL-${Date.now()}`,
      baseRate: Math.round(baseRate),
      fuelSurcharge: Math.round(baseRate * 0.15),
      total: Math.round(baseRate + baseRate * 0.15),
      timestamp: Date.now(),
      data: ftlData,
    };

    setPendingQuote(quote);
    setShowConfirmation(true);
  };

  const calculateSpecialized = () => {
    const weight = parseFloat(specializedData.weight) || 0;
    const value = parseFloat(specializedData.value) || 0;
    const distance = parseFloat(specializedData.distance) || 0;

    let baseRate = 0;
    if (specializedData.serviceType === 'White Glove')
      baseRate = distance * 3.5 + value * 0.02;
    else if (specializedData.serviceType === 'Expedited')
      baseRate = distance * 4.2;
    else if (specializedData.serviceType === 'High Value')
      baseRate = distance * 2.8 + value * 0.035;

    const complexityMultiplier =
      specializedData.complexity === 'high'
        ? 1.4
        : specializedData.complexity === 'medium'
          ? 1.2
          : 1.0;
    baseRate *= complexityMultiplier;

    const quote = {
      id: Date.now().toString(),
      type: 'Specialized',
      quoteNumber: `SPEC-${Date.now()}`,
      baseRate: Math.round(baseRate),
      total: Math.round(baseRate),
      timestamp: Date.now(),
      data: specializedData,
    };

    setPendingQuote(quote);
    setShowConfirmation(true);
  };

  const calculateWarehousing = () => {
    console.info('🔄 Calculating Warehousing Quote...');
    const palletCount = parseInt(warehousingData.palletCount) || 0;
    const duration = parseInt(warehousingData.duration) || 1;
    const squareFootage = parseInt(warehousingData.squareFootage) || 0;

    let baseRate = palletCount * 25 * duration + squareFootage * 0.5;
    if (warehousingData.storageType === 'Temperature Controlled')
      baseRate *= 1.3;
    else if (warehousingData.storageType === 'Refrigerated') baseRate *= 1.4;
    else if (warehousingData.storageType === 'Frozen') baseRate *= 1.5;
    else if (warehousingData.storageType === 'Hazmat') baseRate *= 1.6;

    // Add service fees
    const serviceFees = warehousingData.services.length * 50;
    const total = baseRate + serviceFees;

    const quote = {
      id: `WARE-${Date.now()}`,
      type: 'Warehousing',
      quoteNumber: '',
      storageType: warehousingData.storageType,
      palletCount: palletCount,
      duration: duration,
      squareFootage: squareFootage,
      services: warehousingData.services,
      baseRate: baseRate,
      serviceFees: serviceFees,
      total: total,
      timestamp: Date.now(),
      data: warehousingData,
    };

    setPendingQuote(quote);
    setShowConfirmation(true);
  };

  const calculateMultiService = () => {
    console.info('🔄 Calculating Multi-Service Quote...');

    if (multiServiceData.services.length === 0) {
      alert('Please select at least one service');
      return;
    }

    if (!multiServiceData.primaryService) {
      alert('Please select a primary service');
      return;
    }

    let baseRate = 1000; // Base multi-service rate

    // Primary service multiplier
    if (multiServiceData.primaryService === 'Supply Chain Management')
      baseRate *= 2.0;
    else if (multiServiceData.primaryService === '3PL') baseRate *= 1.8;
    else if (multiServiceData.primaryService === 'Freight Brokerage')
      baseRate *= 1.5;
    else if (multiServiceData.primaryService === 'Warehousing') baseRate *= 1.3;
    else if (multiServiceData.primaryService === 'Transportation')
      baseRate *= 1.2;

    // Complexity multiplier
    if (multiServiceData.complexity === 'enterprise') baseRate *= 1.5;
    else if (multiServiceData.complexity === 'complex') baseRate *= 1.3;

    // Additional services
    const additionalServiceFee = multiServiceData.services.length * 200;
    const total = baseRate + additionalServiceFee;

    const quote = {
      id: `MULTI-${Date.now()}`,
      type: 'Multi-Service',
      quoteNumber: '',
      primaryService: multiServiceData.primaryService,
      complexity: multiServiceData.complexity,
      services: multiServiceData.services,
      timeline: multiServiceData.timeline,
      baseRate: baseRate,
      additionalServiceFee: additionalServiceFee,
      total: total,
      timestamp: Date.now(),
      data: multiServiceData,
    };

    setPendingQuote(quote);
    setShowConfirmation(true);
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

  const agentKPIs = [
    {
      title: 'Active Customers',
      value: '--',
      unit: '',
      change: '+3',
      trend: 'up',
      description: 'Currently active customer accounts',
      color: '#10b981',
      background: 'rgba(16, 185, 129, 0.5)',
      border: 'rgba(16, 185, 129, 0.3)',
    },
    {
      title: 'Active Loads',
      value: agentLoads.length,
      unit: '',
      change: '+5',
      trend: 'up',
      description: 'Loads currently in progress',
      color: '#3b82f6',
      background: 'rgba(59, 130, 246, 0.5)',
      border: 'rgba(59, 130, 246, 0.3)',
    },
    {
      title: 'Monthly Revenue',
      value: '--',
      unit: 'K',
      change: '+18.2%',
      trend: 'up',
      description: 'Revenue generated this month',
      color: '#8b5cf6',
      background: 'rgba(139, 92, 246, 0.5)',
      border: 'rgba(139, 92, 246, 0.3)',
    },
    {
      title: 'Customer Satisfaction',
      value: '--',
      unit: '%',
      change: '+2.1%',
      trend: 'up',
      description: 'Average customer satisfaction score',
      color: '#f59e0b',
      background: 'rgba(245, 158, 11, 0.5)',
      border: 'rgba(245, 158, 11, 0.3)',
    },
    {
      title: 'Quote Success Rate',
      value: '--',
      unit: '%',
      change: '+5.2%',
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
  ];

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
            👤 Broker Agent Portal
          </h1>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '4px 0 0 0',
              fontSize: '1rem',
              fontWeight: '500',
            }}
          >
            Professional Sales Management • Load Optimization • Customer
            Relations
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
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '600',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              ✅ {currentAgent?.name || 'Agent'} Active
            </span>
            <span
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#3b82f6',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '600',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              🆔 {currentAgent?.id || '--'}
            </span>
            <span
              style={{
                background: 'rgba(139, 92, 246, 0.2)',
                color: '#8b5cf6',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '600',
                border: '1px solid rgba(139, 92, 246, 0.3)',
              }}
            >
              📊 {currentAgent?.department || 'Brokerage'}
            </span>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              textAlign: 'right',
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
              Last Activity
            </div>
            <div style={{ fontSize: '0.8rem' }}>
              {new Date(
                session?.lastActivity || Date.now()
              ).toLocaleTimeString()}
            </div>
          </div>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            {currentAgent?.name?.charAt(0) || 'A'}
          </div>
        </div>
      </div>

      {/* Getting Started Guide */}
      <BrokerAgentPortalGettingStarted
        onStepClick={(stepId, tab) => {
          if (tab) {
            setActiveTab(tab);
            setTimeout(() => {
              const element = document.getElementById(`tab-${tab}`);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 100);
          }
        }}
      />

      {/* KPI Dashboard */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '24px',
        }}
      >
        {agentKPIs.map((kpi, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 8px 25px ${kpi.background}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '60px',
                height: '60px',
                background: kpi.background,
                borderRadius: '0 0 0 60px',
                opacity: 0.3,
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  margin: 0,
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  opacity: 0.9,
                }}
              >
                {kpi.title}
              </h3>
              <span
                style={{
                  background: kpi.background,
                  color: kpi.color,
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  border: `1px solid ${kpi.border}`,
                }}
              >
                {kpi.change}
              </span>
            </div>
            <div
              style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: kpi.color,
                marginBottom: '8px',
                textShadow: `0 0 20px ${kpi.color}33`,
              }}
            >
              {kpi.value}
              <span style={{ fontSize: '1rem', opacity: 0.8 }}>{kpi.unit}</span>
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                margin: 0,
                fontSize: '0.8rem',
                lineHeight: '1.4',
              }}
            >
              {kpi.description}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          flexWrap: 'wrap',
          padding: '16px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
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
            id: 'enhanced-crm',
            label: 'Enhanced CRM',
            icon: '🏢',
            color: '#1e40af',
          },
          {
            id: 'performance',
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
            id: 'financial',
            label: 'Financial Dashboard',
            icon: '💹',
            color: '#10b981',
          },
          {
            id: 'contracts-bol',
            label: 'Contracts & BOL',
            icon: '📋',
            color: '#f97316',
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
                  ? `linear-gradient(135deg, ${tab.color}88, ${tab.color}66)`
                  : 'rgba(255, 255, 255, 0.15)',
              color:
                activeTab === tab.id ? '#ffffff' : 'rgba(255, 255, 255, 0.9)',
              border:
                activeTab === tab.id
                  ? `2px solid ${tab.color}`
                  : '1px solid rgba(255, 255, 255, 0.3)',
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
              boxShadow:
                activeTab === tab.id ? `0 4px 12px ${tab.color}40` : 'none',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.color = '#ffffff';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
              }
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
        <div style={{ color: 'white' }}>
          {activeTab === 'quotes-workflow' && (
            <div id='tab-quotes-workflow'>
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
                  {
                    id: 'SpotRates',
                    label: 'Spot Rates',
                    icon: '📈',
                    color: '#10b981',
                  },
                  {
                    id: 'LaneQuoting',
                    label: 'Lane Quoting',
                    icon: '🛣️',
                    color: '#ec4899',
                  },
                  {
                    id: 'History',
                    label: 'History',
                    icon: '📋',
                    color: '#6b7280',
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
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    marginBottom: '20px',
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
                    📦 LTL (Less Than Truckload) Quote Calculator
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '20px',
                      marginBottom: '20px',
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
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                          background: 'rgba(0, 0, 0, 0.3)',
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
                          color: 'rgba(255, 255, 255, 0.9)',
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
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                          background: 'rgba(0, 0, 0, 0.3)',
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
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontWeight: '600',
                          color: 'rgba(255, 255, 255, 0.9)',
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
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                          background: 'rgba(0, 0, 0, 0.3)',
                          color: 'white',
                          fontSize: '14px',
                        }}
                        placeholder='Type of goods'
                      />
                    </div>
                  </div>

                  {/* Additional Services Checkboxes */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '24px',
                      marginBottom: '20px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px',
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
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px',
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
                    onClick={calculateLTL}
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                      padding: '16px 32px',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
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
                    marginBottom: '20px',
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
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(250px, 1fr))',
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
                    }}
                  >
                    🧮 Calculate FTL Quote
                  </button>
                </div>
              )}

              {/* Specialized Calculator */}
              {activeQuoteTab === 'Specialized' && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    marginBottom: '20px',
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
                    ⭐ Specialized Services Quote Calculator
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(250px, 1fr))',
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
                        <option value='White Glove'>White Glove</option>
                        <option value='Expedited'>Expedited</option>
                        <option value='High Value'>High Value</option>
                      </select>
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
                  </div>
                  <button
                    onClick={calculateSpecialized}
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    🧮 Calculate Specialized Quote
                  </button>
                </div>
              )}

              {/* Warehousing Calculator */}
              {activeQuoteTab === 'Warehousing' && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    marginBottom: '20px',
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
                    🏭 Warehousing & Storage Services
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(250px, 1fr))',
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
                        Storage Type
                      </label>
                      <select
                        value={warehousingData.storageType}
                        onChange={(e) =>
                          setWarehousingData((prev) => ({
                            ...prev,
                            storageType: e.target.value,
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
                        <option value=''>Select Storage Type</option>
                        <option value='Dry Storage'>Dry Storage</option>
                        <option value='Temperature Controlled'>
                          Temperature Controlled
                        </option>
                        <option value='Refrigerated'>Refrigerated</option>
                        <option value='Frozen'>Frozen</option>
                        <option value='Hazmat'>Hazmat</option>
                      </select>
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
                        Duration (months)
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
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                          background: 'rgba(0, 0, 0, 0.3)',
                          color: 'white',
                          fontSize: '14px',
                        }}
                        placeholder='Enter duration'
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
                        Pallet Count
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
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                          background: 'rgba(0, 0, 0, 0.3)',
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
                          color: 'rgba(255, 255, 255, 0.9)',
                        }}
                      >
                        Square Footage
                      </label>
                      <input
                        type='number'
                        value={warehousingData.squareFootage}
                        onChange={(e) =>
                          setWarehousingData((prev) => ({
                            ...prev,
                            squareFootage: e.target.value,
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
                        placeholder='Required sq ft'
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
                        Location
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
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                          background: 'rgba(0, 0, 0, 0.3)',
                          color: 'white',
                          fontSize: '14px',
                        }}
                        placeholder='Preferred location'
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '12px',
                        fontWeight: '600',
                        color: 'rgba(255, 255, 255, 0.9)',
                      }}
                    >
                      Additional Services
                    </label>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '12px',
                      }}
                    >
                      {[
                        'Pick & Pack',
                        'Cross Docking',
                        'Inventory Management',
                        'Quality Control',
                        'Kitting/Assembly',
                        'Returns Processing',
                      ].map((service) => (
                        <label
                          key={service}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: 'rgba(255, 255, 255, 0.9)',
                            cursor: 'pointer',
                            fontSize: '14px',
                          }}
                        >
                          <input
                            type='checkbox'
                            checked={warehousingData.services.includes(service)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setWarehousingData((prev) => ({
                                  ...prev,
                                  services: [...prev.services, service],
                                }));
                              } else {
                                setWarehousingData((prev) => ({
                                  ...prev,
                                  services: prev.services.filter(
                                    (s) => s !== service
                                  ),
                                }));
                              }
                            }}
                            style={{ marginRight: '8px' }}
                          />
                          {service}
                        </label>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={calculateWarehousing}
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    🏭 Calculate Warehousing Quote
                  </button>
                </div>
              )}

              {/* Multi-Service Calculator */}
              {activeQuoteTab === 'Multi-Service' && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    marginBottom: '20px',
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
                    🔗 Multi-Service Logistics Solutions
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(250px, 1fr))',
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
                        Primary Service
                      </label>
                      <select
                        value={multiServiceData.primaryService}
                        onChange={(e) =>
                          setMultiServiceData((prev) => ({
                            ...prev,
                            primaryService: e.target.value,
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
                        <option value=''>Select Primary Service</option>
                        <option value='Transportation'>Transportation</option>
                        <option value='Warehousing'>Warehousing</option>
                        <option value='3PL'>3PL Services</option>
                        <option value='Freight Brokerage'>
                          Freight Brokerage
                        </option>
                        <option value='Supply Chain Management'>
                          Supply Chain Management
                        </option>
                      </select>
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
                        Complexity Level
                      </label>
                      <select
                        value={multiServiceData.complexity}
                        onChange={(e) =>
                          setMultiServiceData((prev) => ({
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
                        <option value='standard'>Standard</option>
                        <option value='complex'>Complex</option>
                        <option value='enterprise'>Enterprise</option>
                      </select>
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
                        Timeline
                      </label>
                      <input
                        type='text'
                        value={multiServiceData.timeline}
                        onChange={(e) =>
                          setMultiServiceData((prev) => ({
                            ...prev,
                            timeline: e.target.value,
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
                        placeholder='e.g., 6 months, ongoing'
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
                        Budget Range
                      </label>
                      <input
                        type='text'
                        value={multiServiceData.budget}
                        onChange={(e) =>
                          setMultiServiceData((prev) => ({
                            ...prev,
                            budget: e.target.value,
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
                        placeholder='e.g., $50K-100K monthly'
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '12px',
                        fontWeight: '600',
                        color: 'rgba(255, 255, 255, 0.9)',
                      }}
                    >
                      Additional Services Required
                    </label>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '12px',
                      }}
                    >
                      {[
                        'Customs Brokerage',
                        'Insurance Services',
                        'Technology Integration',
                        'Dedicated Fleet',
                        'Project Management',
                        '24/7 Support',
                        'Analytics & Reporting',
                        'Compliance Management',
                      ].map((service) => (
                        <label
                          key={service}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: 'rgba(255, 255, 255, 0.9)',
                            cursor: 'pointer',
                            fontSize: '14px',
                          }}
                        >
                          <input
                            type='checkbox'
                            checked={multiServiceData.services.includes(
                              service
                            )}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setMultiServiceData((prev) => ({
                                  ...prev,
                                  services: [...prev.services, service],
                                }));
                              } else {
                                setMultiServiceData((prev) => ({
                                  ...prev,
                                  services: prev.services.filter(
                                    (s) => s !== service
                                  ),
                                }));
                              }
                            }}
                            style={{ marginRight: '8px' }}
                          />
                          {service}
                        </label>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={calculateMultiService}
                    style={{
                      background: 'linear-gradient(135deg, #14b8a6, #0f766e)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    🔗 Calculate Multi-Service Quote
                  </button>
                </div>
              )}

              {/* SpotRates Calculator */}
              {activeQuoteTab === 'SpotRates' && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    marginBottom: '20px',
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
                    📈 AI-Powered Spot Rate Optimization
                  </h3>
                  <div style={{ marginBottom: '16px' }}>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px',
                        marginBottom: '16px',
                      }}
                    >
                      Get real-time market intelligence and optimal pricing
                      recommendations for your freight quotes.
                    </p>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '20px',
                      marginBottom: '20px',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <h4
                        style={{
                          color: '#10b981',
                          marginBottom: '8px',
                          fontSize: '14px',
                        }}
                      >
                        📊 Market Trends
                      </h4>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '12px',
                          margin: 0,
                        }}
                      >
                        Chicago → Atlanta: +12% vs last week
                      </p>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '12px',
                          margin: 0,
                        }}
                      >
                        Dallas → LA: -5% vs last week
                      </p>
                    </div>
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <h4
                        style={{
                          color: '#3b82f6',
                          marginBottom: '8px',
                          fontSize: '14px',
                        }}
                      >
                        🎯 Rate Recommendations
                      </h4>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '12px',
                          margin: 0,
                        }}
                      >
                        Competitive Rate: $2.85/mile
                      </p>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '12px',
                          margin: 0,
                        }}
                      >
                        Optimal Rate: $3.15/mile
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      console.info('Spot rate optimization requested');
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    📈 Get Rate Analysis
                  </button>
                </div>
              )}

              {/* Lane Quoting Tab */}
              {activeQuoteTab === 'LaneQuoting' && (
                <div style={{ color: 'white' }}>
                  {/* Enhanced Lane Quoting Header with Progress */}
                  <div style={{ marginBottom: '32px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '16px',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '24px',
                          fontWeight: '700',
                          color: 'white',
                          margin: '0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        🛣️ Multi-Lane Quoting
                      </h3>
                      <div
                        style={{
                          background: 'rgba(16, 185, 129, 0.2)',
                          padding: '8px 16px',
                          borderRadius: '20px',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                        }}
                      >
                        <span
                          style={{
                            color: '#10b981',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          Step 1 of 3: Add Lanes
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        marginBottom: '24px',
                      }}
                    >
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '600',
                          marginBottom: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        💡 How It Works
                      </h4>
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
                        <div>
                          <strong style={{ color: 'white' }}>
                            1. Add Lanes
                          </strong>
                          <br />
                          Enter origin-destination pairs for each shipping lane
                        </div>
                        <div>
                          <strong style={{ color: 'white' }}>
                            2. Review & Edit
                          </strong>
                          <br />
                          Modify weights, equipment, and priorities as needed
                        </div>
                        <div>
                          <strong style={{ color: 'white' }}>
                            3. Get Quotes
                          </strong>
                          <br />
                          Generate bulk pricing with spreadsheet-style results
                        </div>
                      </div>
                    </div>

                    <p
                      style={{
                        fontSize: '16px',
                        color: 'rgba(255, 255, 255, 0.8)',
                        lineHeight: '1.6',
                        marginBottom: '0',
                      }}
                    >
                      Perfect for shippers with multiple locations needing
                      quotes for various lanes. Get comprehensive pricing across
                      all your shipping routes.
                    </p>
                  </div>

                  {!showLaneResults ? (
                    /* Lane Input Interface */
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                      }}
                    >
                      {/* Enhanced Bulk Lane Entry */}
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          padding: '24px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '16px',
                          }}
                        >
                          <h4
                            style={{
                              fontSize: '20px',
                              fontWeight: '600',
                              color: 'white',
                              margin: '0',
                            }}
                          >
                            📝 Add Shipping Lanes
                          </h4>
                          <div
                            style={{
                              background: 'rgba(245, 158, 11, 0.2)',
                              padding: '4px 12px',
                              borderRadius: '16px',
                              border: '1px solid rgba(245, 158, 11, 0.3)',
                            }}
                          >
                            <span
                              style={{
                                color: '#f59e0b',
                                fontSize: '12px',
                                fontWeight: '600',
                              }}
                            >
                              {lanes.length} lanes added
                            </span>
                          </div>
                        </div>

                        {/* Instructions */}
                        <div
                          style={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            padding: '16px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '14px',
                              color: 'rgba(255, 255, 255, 0.9)',
                              lineHeight: '1.5',
                            }}
                          >
                            <strong style={{ color: 'white' }}>💡 Tip:</strong>{' '}
                            Add one lane at a time, then review your list before
                            generating quotes. You can edit or remove lanes as
                            needed.
                          </div>
                        </div>

                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 2fr 1fr 1fr auto',
                            gap: '12px',
                            alignItems: 'end',
                          }}
                        >
                          <div>
                            <label
                              style={{
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: '500',
                                marginBottom: '8px',
                                display: 'block',
                              }}
                            >
                              Origin
                            </label>
                            <input
                              type='text'
                              placeholder='e.g., Chicago, IL'
                              style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                background: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                fontSize: '14px',
                              }}
                              id='lane-origin-input'
                            />
                          </div>
                          <div>
                            <label
                              style={{
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: '500',
                                marginBottom: '8px',
                                display: 'block',
                              }}
                            >
                              Destination
                            </label>
                            <input
                              type='text'
                              placeholder='e.g., Detroit, MI'
                              style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                background: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                fontSize: '14px',
                              }}
                              id='lane-destination-input'
                            />
                          </div>
                          <div>
                            <label
                              style={{
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: '500',
                                marginBottom: '8px',
                                display: 'block',
                              }}
                            >
                              Weight (lbs)
                            </label>
                            <input
                              type='number'
                              placeholder='45000'
                              style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                background: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                fontSize: '14px',
                              }}
                              id='lane-weight-input'
                            />
                          </div>
                          <div>
                            <label
                              style={{
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: '500',
                                marginBottom: '8px',
                                display: 'block',
                              }}
                            >
                              Equipment
                            </label>
                            <select
                              style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                background: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                fontSize: '14px',
                              }}
                              id='lane-equipment-select'
                            >
                              <option value='Dry Van'>Dry Van</option>
                              <option value='Refrigerated'>Refrigerated</option>
                              <option value='Flatbed'>Flatbed</option>
                              <option value='Step Deck'>Step Deck</option>
                              <option value='Double Drop'>Double Drop</option>
                            </select>
                          </div>
                          <button
                            onClick={() => {
                              const originInput = document.getElementById(
                                'lane-origin-input'
                              ) as HTMLInputElement;
                              const destinationInput = document.getElementById(
                                'lane-destination-input'
                              ) as HTMLInputElement;
                              const weightInput = document.getElementById(
                                'lane-weight-input'
                              ) as HTMLInputElement;
                              const equipmentSelect = document.getElementById(
                                'lane-equipment-select'
                              ) as HTMLSelectElement;

                              if (
                                !originInput?.value ||
                                !destinationInput?.value
                              ) {
                                alert('Please enter origin and destination');
                                return;
                              }

                              const newLane = {
                                id: `lane-${Date.now()}`,
                                origin: originInput.value,
                                destination: destinationInput.value,
                                weight: parseFloat(weightInput?.value || '0'),
                                equipment: equipmentSelect?.value || 'Dry Van',
                                priority: lanes.length + 1,
                              };

                              setLanes((prev) => [...prev, newLane]);

                              // Clear inputs
                              originInput.value = '';
                              destinationInput.value = '';
                              weightInput.value = '';
                            }}
                            style={{
                              padding: '12px 16px',
                              background:
                                'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            ➕ Add Lane
                          </button>
                        </div>
                      </div>

                      {/* Lane List */}
                      {lanes.length > 0 && (
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            padding: '24px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: '16px',
                            }}
                          >
                            <h4
                              style={{
                                fontSize: '20px',
                                fontWeight: '600',
                                color: 'white',
                                margin: '0',
                              }}
                            >
                              📋 Your Lanes ({lanes.length})
                            </h4>
                            <button
                              onClick={async () => {
                                if (lanes.length === 0) {
                                  alert('Please add at least one lane');
                                  return;
                                }

                                setShowLaneResults(true);

                                try {
                                  const { FreightQuotingEngine } = await import(
                                    '../../services/FreightQuotingEngine'
                                  );
                                  const quotingEngine =
                                    new FreightQuotingEngine();

                                  const quotePromises = lanes.map(
                                    async (lane) => {
                                      const distance = 500;
                                      const quoteRequest = {
                                        id: `quote-${lane.id}`,
                                        type: 'LTL' as
                                          | 'LTL'
                                          | 'FTL'
                                          | 'Specialized',
                                        origin: lane.origin,
                                        destination: lane.destination,
                                        weight: lane.weight || 1000,
                                        freightClass: 55,
                                        equipmentType: lane.equipment,
                                        serviceType: 'standard',
                                        distance,
                                        pickupDate: new Date().toISOString(),
                                        deliveryDate: new Date(
                                          Date.now() + 3 * 24 * 60 * 60 * 1000
                                        ).toISOString(),
                                        urgency: 'standard' as
                                          | 'standard'
                                          | 'expedited'
                                          | 'emergency',
                                        customerTier: 'gold' as
                                          | 'bronze'
                                          | 'silver'
                                          | 'gold'
                                          | 'platinum',
                                        specialRequirements: [],
                                        hazmat: false,
                                        temperature: 'ambient' as
                                          | 'ambient'
                                          | 'refrigerated'
                                          | 'frozen',
                                      };

                                      return await quotingEngine.generateQuote(
                                        quoteRequest
                                      );
                                    }
                                  );

                                  const results =
                                    await Promise.all(quotePromises);
                                  console.info(
                                    '🛣️ Bulk lane quotes generated:',
                                    results
                                  );
                                } catch (error) {
                                  console.error(
                                    '❌ Error generating bulk quotes:',
                                    error
                                  );
                                  alert(
                                    'Error generating quotes. Please try again.'
                                  );
                                }
                              }}
                              style={{
                                padding: '12px 24px',
                                background:
                                  'linear-gradient(135deg, #10b981, #059669)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                              }}
                            >
                              🤖 Generate Bulk Quotes
                            </button>
                          </div>

                          <div style={{ display: 'grid', gap: '12px' }}>
                            {lanes.map((lane, index) => (
                              <div
                                key={lane.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '16px',
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  borderRadius: '8px',
                                  border: '1px solid rgba(255, 255, 255, 0.1)',
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
                                      background: 'rgba(59, 130, 246, 0.2)',
                                      padding: '8px',
                                      borderRadius: '8px',
                                      border:
                                        '1px solid rgba(59, 130, 246, 0.3)',
                                    }}
                                  >
                                    <span style={{ fontSize: '16px' }}>
                                      #{lane.priority}
                                    </span>
                                  </div>
                                  <div>
                                    <div
                                      style={{
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        color: 'white',
                                      }}
                                    >
                                      {lane.origin} → {lane.destination}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: '12px',
                                        color: 'rgba(255, 255, 255, 0.6)',
                                      }}
                                    >
                                      {lane.weight.toLocaleString()} lbs •{' '}
                                      {lane.equipment}
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    setLanes((prev) =>
                                      prev.filter((l) => l.id !== lane.id)
                                    )
                                  }
                                  style={{
                                    padding: '8px',
                                    background: 'rgba(239, 68, 68, 0.2)',
                                    color: '#ef4444',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                  }}
                                >
                                  🗑️
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Lane Results Interface */
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '24px',
                        }}
                      >
                        <h4
                          style={{
                            fontSize: '24px',
                            fontWeight: '600',
                            color: 'white',
                            margin: '0',
                          }}
                        >
                          📊 Lane Quote Results
                        </h4>
                        <button
                          onClick={() => setShowLaneResults(false)}
                          style={{
                            padding: '8px 16px',
                            background: 'rgba(59, 130, 246, 0.2)',
                            color: '#3b82f6',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          ← Back to Edit Lanes
                        </button>
                      </div>

                      <div
                        style={{
                          background: 'rgba(16, 185, 129, 0.1)',
                          padding: '20px',
                          borderRadius: '12px',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          marginBottom: '24px',
                        }}
                      >
                        <h5
                          style={{
                            color: '#10b981',
                            fontSize: '18px',
                            fontWeight: '600',
                            marginBottom: '16px',
                            margin: '0 0 16px 0',
                          }}
                        >
                          ✅ Bulk Quotes Generated Successfully
                        </h5>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            margin: '0',
                          }}
                        >
                          Your lane quotes are ready. Review the results below
                          and send them to your customers.
                        </p>
                      </div>

                      <div style={{ display: 'grid', gap: '16px' }}>
                        {lanes.map((lane, index) => (
                          <div
                            key={lane.id}
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
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '16px',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                }}
                              >
                                <div
                                  style={{
                                    background: 'rgba(59, 130, 246, 0.2)',
                                    padding: '6px 12px',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(59, 130, 246, 0.3)',
                                  }}
                                >
                                  <span
                                    style={{
                                      color: '#3b82f6',
                                      fontWeight: '600',
                                    }}
                                  >
                                    Lane #{lane.priority}
                                  </span>
                                </div>
                                <div>
                                  <div
                                    style={{
                                      fontSize: '18px',
                                      fontWeight: '600',
                                      color: 'white',
                                    }}
                                  >
                                    {lane.origin} → {lane.destination}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: '12px',
                                      color: 'rgba(255, 255, 255, 0.6)',
                                    }}
                                  >
                                    {lane.weight.toLocaleString()} lbs •{' '}
                                    {lane.equipment}
                                  </div>
                                </div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <div
                                  style={{
                                    fontSize: '24px',
                                    fontWeight: '700',
                                    color: '#10b981',
                                  }}
                                >
                                  --
                                </div>
                                <div
                                  style={{
                                    fontSize: '12px',
                                    color: 'rgba(255, 255, 255, 0.6)',
                                  }}
                                >
                                  AI Recommended
                                </div>
                              </div>
                            </div>

                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 1fr',
                                gap: '16px',
                                marginBottom: '16px',
                              }}
                            >
                              <div
                                style={{
                                  background: 'rgba(59, 130, 246, 0.1)',
                                  padding: '12px',
                                  borderRadius: '8px',
                                  border: '1px solid rgba(59, 130, 246, 0.2)',
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: '12px',
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    marginBottom: '4px',
                                  }}
                                >
                                  Base Rate
                                </div>
                                <div
                                  style={{
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: '#3b82f6',
                                  }}
                                >
                                  --
                                </div>
                              </div>
                              <div
                                style={{
                                  background: 'rgba(245, 158, 11, 0.1)',
                                  padding: '12px',
                                  borderRadius: '8px',
                                  border: '1px solid rgba(245, 158, 11, 0.2)',
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: '12px',
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    marginBottom: '4px',
                                  }}
                                >
                                  Fuel Surcharge
                                </div>
                                <div
                                  style={{
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: '#f59e0b',
                                  }}
                                >
                                  --
                                </div>
                              </div>
                              <div
                                style={{
                                  background: 'rgba(16, 185, 129, 0.1)',
                                  padding: '12px',
                                  borderRadius: '8px',
                                  border: '1px solid rgba(16, 185, 129, 0.2)',
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: '12px',
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    marginBottom: '4px',
                                  }}
                                >
                                  Win Probability
                                </div>
                                <div
                                  style={{
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: '#10b981',
                                  }}
                                >
                                  --
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                              <button
                                style={{
                                  flex: 1,
                                  padding: '10px 16px',
                                  background:
                                    'linear-gradient(135deg, #10b981, #059669)',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '8px',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                }}
                              >
                                📤 Send to Customer
                              </button>
                              <button
                                style={{
                                  flex: 1,
                                  padding: '10px 16px',
                                  background: 'rgba(255, 255, 255, 0.1)',
                                  color: 'white',
                                  border: '1px solid rgba(255, 255, 255, 0.2)',
                                  borderRadius: '8px',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                }}
                              >
                                💾 Save Quote
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* History Tab */}
              {activeQuoteTab === 'History' && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    marginBottom: '20px',
                  }}
                >
                  <h3
                    style={{
                      marginBottom: '20px',
                      color: '#6b7280',
                      fontSize: '1.2rem',
                      fontWeight: '600',
                    }}
                  >
                    📋 Quote History
                  </h3>
                  {quotes.length === 0 ? (
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: 'rgba(255, 255, 255, 0.6)',
                      }}
                    >
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                        📋
                      </div>
                      <p style={{ fontSize: '16px', marginBottom: '8px' }}>
                        No quotes generated yet
                      </p>
                      <p style={{ fontSize: '14px', margin: 0 }}>
                        Use the calculators above to create your first quote
                      </p>
                    </div>
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
                              marginBottom: '12px',
                            }}
                          >
                            <h4
                              style={{
                                margin: 0,
                                color: '#10b981',
                                fontSize: '16px',
                                fontWeight: '600',
                              }}
                            >
                              {quote.type} Quote - {quote.quoteNumber}
                            </h4>
                            <span
                              style={{
                                background: 'rgba(59, 130, 246, 0.2)',
                                color: '#60a5fa',
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '600',
                              }}
                            >
                              ${quote.total?.toLocaleString() || 'N/A'}
                            </span>
                          </div>
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr',
                              gap: '12px',
                              fontSize: '14px',
                              color: 'rgba(255, 255, 255, 0.9)',
                            }}
                          >
                            <div>
                              <strong>Date:</strong>{' '}
                              {new Date(quote.timestamp).toLocaleDateString()}
                            </div>
                            <div>
                              <strong>Status:</strong>{' '}
                              {quote.status || 'Pending'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Workflow Status */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  marginBottom: '20px',
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
                  🔄 Active Workflow Status
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {[
                    {
                      step: 'Quote Generation',
                      status: 'completed',
                      progress: 100,
                      color: '#10b981',
                    },
                    {
                      step: 'Customer Review',
                      status: 'in_progress',
                      progress: 65,
                      color: '#3b82f6',
                    },
                    {
                      step: 'Rate Negotiation',
                      status: 'pending',
                      progress: 0,
                      color: '#6b7280',
                    },
                    {
                      step: 'Contract Finalization',
                      status: 'pending',
                      progress: 0,
                      color: '#6b7280',
                    },
                    {
                      step: 'Load Assignment',
                      status: 'pending',
                      progress: 0,
                      color: '#6b7280',
                    },
                  ].map((workflow, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
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
                            fontSize: '0.9rem',
                            fontWeight: '600',
                          }}
                        >
                          {workflow.step}
                        </h4>
                        <span
                          style={{
                            background:
                              workflow.status === 'completed'
                                ? 'rgba(16, 185, 129, 0.2)'
                                : workflow.status === 'in_progress'
                                  ? 'rgba(59, 130, 246, 0.2)'
                                  : 'rgba(107, 114, 128, 0.2)',
                            color: workflow.color,
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            border: `1px solid ${workflow.color}33`,
                          }}
                        >
                          {workflow.status === 'completed'
                            ? '✅ Complete'
                            : workflow.status === 'in_progress'
                              ? '🔄 In Progress'
                              : '⏳ Pending'}
                        </span>
                      </div>
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '4px',
                          height: '6px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            background: workflow.color,
                            height: '100%',
                            width: `${workflow.progress}%`,
                            transition: 'width 0.3s ease',
                            borderRadius: '4px',
                          }}
                        />
                      </div>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          margin: '4px 0 0 0',
                          fontSize: '0.8rem',
                        }}
                      >
                        {workflow.progress}% Complete
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote Results Display */}
              {quotes.length > 0 && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    marginBottom: '20px',
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
                    💰 Latest Quote Results
                  </h3>
                  {(() => {
                    const latestQuote = quotes[quotes.length - 1];
                    return (
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          borderRadius: '8px',
                          padding: '20px',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                        }}
                      >
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns:
                              'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '16px',
                            marginBottom: '16px',
                          }}
                        >
                          <div style={{ textAlign: 'center' }}>
                            <div
                              style={{
                                color: '#10b981',
                                fontSize: '1.5rem',
                                fontWeight: '700',
                                marginBottom: '4px',
                              }}
                            >
                              ${latestQuote.baseRate.toLocaleString()}
                            </div>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '0.9rem',
                              }}
                            >
                              Base Rate
                            </div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div
                              style={{
                                color: '#f59e0b',
                                fontSize: '1.5rem',
                                fontWeight: '700',
                                marginBottom: '4px',
                              }}
                            >
                              $
                              {(
                                latestQuote.fuelSurcharge || 0
                              ).toLocaleString()}
                            </div>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '0.9rem',
                              }}
                            >
                              Fuel Surcharge
                            </div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div
                              style={{
                                color: '#3b82f6',
                                fontSize: '1.8rem',
                                fontWeight: '700',
                                marginBottom: '4px',
                              }}
                            >
                              ${latestQuote.total.toLocaleString()}
                            </div>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '0.9rem',
                              }}
                            >
                              Total Quote
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingTop: '16px',
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          <div>
                            <span
                              style={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '0.9rem',
                              }}
                            >
                              Quote #:{' '}
                            </span>
                            <span style={{ color: 'white', fontWeight: '600' }}>
                              {latestQuote.quoteNumber}
                            </span>
                          </div>
                          <div>
                            <span
                              style={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '0.9rem',
                              }}
                            >
                              Type:{' '}
                            </span>
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
                              {latestQuote.type}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              style={{
                                background:
                                  'linear-gradient(135deg, #10b981, #059669)',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                              }}
                            >
                              📧 Send to Customer
                            </button>
                            <button
                              style={{
                                background:
                                  'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                              }}
                            >
                              📋 Copy Quote
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Quote History */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
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
                      color: '#14b8a6',
                      margin: 0,
                      fontSize: '1.1rem',
                      fontWeight: '600',
                    }}
                  >
                    📊 Quote History ({quotes.length})
                  </h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      style={{
                        background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      📊 Export
                    </button>
                    <button
                      style={{
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      🔍 Filter
                    </button>
                  </div>
                </div>
                {quotes.length > 0 ? (
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {quotes.map((quote, index) => (
                      <div
                        key={quote.id}
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
                            marginBottom: '12px',
                          }}
                        >
                          <div>
                            <h4
                              style={{
                                color: 'white',
                                margin: '0 0 4px 0',
                                fontSize: '1rem',
                                fontWeight: '600',
                              }}
                            >
                              {quote.quoteNumber}
                            </h4>
                            <p
                              style={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                margin: 0,
                                fontSize: '0.8rem',
                              }}
                            >
                              {new Date(quote.timestamp).toLocaleDateString()} •{' '}
                              {new Date(quote.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span
                              style={{
                                background:
                                  quote.type === 'LTL'
                                    ? 'rgba(16, 185, 129, 0.2)'
                                    : quote.type === 'FTL'
                                      ? 'rgba(59, 130, 246, 0.2)'
                                      : 'rgba(139, 92, 246, 0.2)',
                                color:
                                  quote.type === 'LTL'
                                    ? '#10b981'
                                    : quote.type === 'FTL'
                                      ? '#3b82f6'
                                      : '#8b5cf6',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                marginBottom: '4px',
                                display: 'block',
                              }}
                            >
                              {quote.type}
                            </span>
                            <div
                              style={{
                                color: 'white',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                              }}
                            >
                              ${quote.total.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingTop: '12px',
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              gap: '16px',
                              fontSize: '0.9rem',
                              color: 'rgba(255, 255, 255, 0.9)',
                            }}
                          >
                            <span>
                              <strong>Base:</strong> $
                              {quote.baseRate.toLocaleString()}
                            </span>
                            {quote.fuelSurcharge && (
                              <span>
                                <strong>Fuel:</strong> $
                                {quote.fuelSurcharge.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              style={{
                                background: 'rgba(16, 185, 129, 0.2)',
                                color: '#10b981',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                padding: '6px 10px',
                                borderRadius: '4px',
                                fontSize: '0.7rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                              }}
                            >
                              View
                            </button>
                            <button
                              style={{
                                background: 'rgba(59, 130, 246, 0.2)',
                                color: '#3b82f6',
                                border: '1px solid rgba(59, 130, 246, 0.3)',
                                padding: '6px 10px',
                                borderRadius: '4px',
                                fontSize: '0.7rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                              }}
                            >
                              Edit
                            </button>
                            <button
                              style={{
                                background: 'rgba(245, 158, 11, 0.2)',
                                color: '#f59e0b',
                                border: '1px solid rgba(245, 158, 11, 0.3)',
                                padding: '6px 10px',
                                borderRadius: '4px',
                                fontSize: '0.7rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                              }}
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div
                      style={{
                        fontSize: '2rem',
                        marginBottom: '12px',
                        opacity: 0.5,
                      }}
                    >
                      📋
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        margin: '0 0 16px 0',
                        fontSize: '1rem',
                        fontWeight: '500',
                      }}
                    >
                      No quotes generated yet
                    </p>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        margin: 0,
                        fontSize: '0.9rem',
                      }}
                    >
                      Use the calculators above to create your first quote
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'loads-bids' && (
            <div id='tab-loads-bids'>
              <p>Manage active loads and bidding opportunities.</p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '20px',
                  marginTop: '20px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '20px',
                  }}
                >
                  <h3 style={{ color: '#14b8a6', marginBottom: '16px' }}>
                    🚛 Active Loads (3)
                  </h3>
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '12px',
                    }}
                  >
                    <h4 style={{ color: 'white', margin: '0 0 8px 0' }}>
                      LB-001
                    </h4>
                    <p
                      style={{
                        color: 'white',
                        margin: '4px 0',
                        fontSize: '0.9rem',
                      }}
                    >
                      <strong>Route:</strong> Chicago → Dallas
                    </p>
                    <p
                      style={{
                        color: 'white',
                        margin: '4px 0',
                        fontSize: '0.9rem',
                      }}
                    >
                      <strong>Rate:</strong> ,500
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '20px',
                  }}
                >
                  <h3 style={{ color: '#14b8a6', marginBottom: '16px' }}>
                    📋 Pending Tasks (2)
                  </h3>
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '12px',
                    }}
                  >
                    <h4 style={{ color: 'white', margin: '0 0 8px 0' }}>
                      Follow up with ABC Trucking
                    </h4>
                    <p
                      style={{
                        color: 'white',
                        margin: '4px 0',
                        fontSize: '0.9rem',
                      }}
                    >
                      <strong>Due:</strong> 2025-01-19
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'enhanced-crm' && (
            <div id='tab-enhanced-crm'>
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
                👥 Enhanced Customer Relationship Management
              </h2>

              {/* Customer Overview */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '20px',
                  marginBottom: '24px',
                }}
              >
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
                      color: '#1e40af',
                      marginBottom: '16px',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                    }}
                  >
                    📊 Customer Overview
                  </h3>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 0',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '0.9rem',
                        }}
                      >
                        Total Customers
                      </span>
                      <span style={{ color: 'white', fontWeight: '600' }}>
                        24
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 0',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '0.9rem',
                        }}
                      >
                        Active This Month
                      </span>
                      <span style={{ color: '#10b981', fontWeight: '600' }}>
                        18
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 0',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '0.9rem',
                        }}
                      >
                        New This Week
                      </span>
                      <span style={{ color: '#3b82f6', fontWeight: '600' }}>
                        3
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 0',
                      }}
                    >
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '0.9rem',
                        }}
                      >
                        Avg. Satisfaction
                      </span>
                      <span style={{ color: '#f59e0b', fontWeight: '600' }}>
                        96.8%
                      </span>
                    </div>
                  </div>
                </div>

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
                      color: '#1e40af',
                      marginBottom: '16px',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                    }}
                  >
                    ⚡ Quick Actions
                  </h3>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <button
                      style={{
                        background: 'linear-gradient(135deg, #1e40af, #1e3a8a)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      🏢 Add Shipper
                    </button>
                    <button
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      📊 Generate Reports
                    </button>
                    <button
                      style={{
                        background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      🔍 Search Customers
                    </button>
                    <button
                      style={{
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      📞 Schedule Follow-up
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  marginBottom: '20px',
                }}
              >
                <h3
                  style={{
                    color: '#1e40af',
                    marginBottom: '16px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                  }}
                >
                  📈 Recent Customer Activity
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {[
                    {
                      customer: 'ABC Manufacturing',
                      activity: 'New quote request',
                      time: '2 hours ago',
                      type: 'quote',
                      priority: 'high',
                    },
                    {
                      customer: 'Global Logistics Inc',
                      activity: 'Payment received',
                      time: '4 hours ago',
                      type: 'payment',
                      priority: 'medium',
                    },
                    {
                      customer: 'Tech Solutions LLC',
                      activity: 'Load delivered',
                      time: '6 hours ago',
                      type: 'delivery',
                      priority: 'low',
                    },
                    {
                      customer: 'Retail Distribution Co',
                      activity: 'Contract renewal',
                      time: '1 day ago',
                      type: 'contract',
                      priority: 'high',
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
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
                          {activity.customer}
                        </h4>
                        <span
                          style={{
                            background:
                              activity.priority === 'high'
                                ? 'rgba(239, 68, 68, 0.6)'
                                : activity.priority === 'medium'
                                  ? 'rgba(59, 130, 246, 0.7)'
                                  : 'rgba(16, 185, 129, 0.6)',
                            color:
                              activity.priority === 'high'
                                ? '#fca5a5'
                                : activity.priority === 'medium'
                                  ? '#ffffff'
                                  : '#6ee7b7',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                          }}
                        >
                          {activity.priority}
                        </span>
                      </div>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          margin: '4px 0',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                        }}
                      >
                        <strong>{activity.activity}</strong>
                      </p>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          margin: '4px 0',
                          fontSize: '0.8rem',
                        }}
                      >
                        {activity.time}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Directory */}
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
                    color: '#1e40af',
                    marginBottom: '16px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                  }}
                >
                  📋 Customer Directory
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {[
                    {
                      name: 'ABC Manufacturing',
                      contact: 'John Smith',
                      phone: '(555) 123-4567',
                      email: 'john@abcmfg.com',
                      status: 'active',
                      revenue: '$45,200',
                    },
                    {
                      name: 'Global Logistics Inc',
                      contact: 'Sarah Johnson',
                      phone: '(555) 234-5678',
                      email: 'sarah@globallog.com',
                      status: 'active',
                      revenue: '$32,800',
                    },
                    {
                      name: 'Tech Solutions LLC',
                      contact: 'Mike Davis',
                      phone: '(555) 345-6789',
                      email: 'mike@techsol.com',
                      status: 'pending',
                      revenue: '$18,500',
                    },
                  ].map((customer, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <h4
                          style={{
                            color: 'white',
                            margin: '0 0 4px 0',
                            fontSize: '1rem',
                            fontWeight: '600',
                          }}
                        >
                          {customer.name}
                        </h4>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            margin: '2px 0',
                            fontSize: '0.9rem',
                          }}
                        >
                          {customer.contact}
                        </p>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            margin: '2px 0',
                            fontSize: '0.8rem',
                          }}
                        >
                          {customer.phone} • {customer.email}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            color: '#10b981',
                            fontWeight: '600',
                            fontSize: '1rem',
                            marginBottom: '4px',
                          }}
                        >
                          {customer.revenue}
                        </div>
                        <span
                          style={{
                            background:
                              customer.status === 'active'
                                ? 'rgba(16, 185, 129, 0.2)'
                                : 'rgba(245, 158, 11, 0.2)',
                            color:
                              customer.status === 'active'
                                ? '#10b981'
                                : '#f59e0b',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            border: `1px solid ${customer.status === 'active' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                          }}
                        >
                          {customer.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div id='tab-performance'>
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
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
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

          {activeTab === 'ai-intelligence' && (
            <div id='tab-ai-intelligence'>
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
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '20px',
                  }}
                >
                  AI-powered insights and automation tools to optimize your
                  freight brokerage operations.
                </p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '16px',
                    }}
                  >
                    <h4 style={{ color: '#8b5cf6', marginBottom: '12px' }}>
                      🧠 Route Optimization
                    </h4>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '0.9rem',
                      }}
                    >
                      AI analyzes traffic, weather, and fuel costs to suggest
                      optimal routes.
                    </p>
                  </div>
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '16px',
                    }}
                  >
                    <h4 style={{ color: '#8b5cf6', marginBottom: '12px' }}>
                      💰 Pricing Intelligence
                    </h4>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '0.9rem',
                      }}
                    >
                      Dynamic pricing recommendations based on market
                      conditions.
                    </p>
                  </div>
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '16px',
                    }}
                  >
                    <h4 style={{ color: '#8b5cf6', marginBottom: '12px' }}>
                      📊 Market Analysis
                    </h4>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '0.9rem',
                      }}
                    >
                      Real-time market trends and competitive analysis.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'financial' && (
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
                💰 Financial Dashboard & Revenue Tracking
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
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '20px',
                    }}
                  >
                    <h4 style={{ color: '#10b981', marginBottom: '16px' }}>
                      📈 Monthly Revenue
                    </h4>
                    <div
                      style={{
                        fontSize: '1.8rem',
                        fontWeight: 'bold',
                        color: '#10b981',
                        marginBottom: '8px',
                      }}
                    >
                      $125,400
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '0.9rem',
                      }}
                    >
                      +18.2% vs last month
                    </p>
                  </div>
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '20px',
                    }}
                  >
                    <h4 style={{ color: '#3b82f6', marginBottom: '16px' }}>
                      💼 Annual Revenue
                    </h4>
                    <div
                      style={{
                        fontSize: '1.8rem',
                        fontWeight: 'bold',
                        color: '#3b82f6',
                        marginBottom: '8px',
                      }}
                    >
                      $1.2M
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '0.9rem',
                      }}
                    >
                      +24.6% vs last year
                    </p>
                  </div>
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '20px',
                    }}
                  >
                    <h4 style={{ color: '#f59e0b', marginBottom: '16px' }}>
                      📊 Growth Rate
                    </h4>
                    <div
                      style={{
                        fontSize: '1.8rem',
                        fontWeight: 'bold',
                        color: '#f59e0b',
                        marginBottom: '8px',
                      }}
                    >
                      28.4%
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '0.9rem',
                      }}
                    >
                      Quarterly growth
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                📋 Contracts & BOL Management
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '20px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <h3 style={{ color: '#f59e0b', marginBottom: '16px' }}>
                    📄 Active Contracts
                  </h3>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '12px',
                      }}
                    >
                      <h4
                        style={{
                          color: 'white',
                          margin: '0 0 8px 0',
                          fontSize: '0.9rem',
                        }}
                      >
                        ABC Manufacturing
                      </h4>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          margin: '4px 0',
                          fontSize: '0.8rem',
                        }}
                      >
                        Contract: #CTR-2024-001
                      </p>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          margin: '4px 0',
                          fontSize: '0.8rem',
                        }}
                      >
                        Expires: March 15, 2025
                      </p>
                    </div>
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '12px',
                      }}
                    >
                      <h4
                        style={{
                          color: 'white',
                          margin: '0 0 8px 0',
                          fontSize: '0.9rem',
                        }}
                      >
                        Global Logistics Inc
                      </h4>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          margin: '4px 0',
                          fontSize: '0.8rem',
                        }}
                      >
                        Contract: #CTR-2024-002
                      </p>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          margin: '4px 0',
                          fontSize: '0.8rem',
                        }}
                      >
                        Expires: June 30, 2025
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <h3 style={{ color: '#f59e0b', marginBottom: '16px' }}>
                    📋 Recent BOLs
                  </h3>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '12px',
                      }}
                    >
                      <h4
                        style={{
                          color: 'white',
                          margin: '0 0 8px 0',
                          fontSize: '0.9rem',
                        }}
                      >
                        BOL-2025-001
                      </h4>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          margin: '4px 0',
                          fontSize: '0.8rem',
                        }}
                      >
                        Chicago → Atlanta
                      </p>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          margin: '4px 0',
                          fontSize: '0.8rem',
                        }}
                      >
                        Status: In Transit
                      </p>
                    </div>
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '12px',
                      }}
                    >
                      <h4
                        style={{
                          color: 'white',
                          margin: '0 0 8px 0',
                          fontSize: '0.9rem',
                        }}
                      >
                        BOL-2025-002
                      </h4>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          margin: '4px 0',
                          fontSize: '0.8rem',
                        }}
                      >
                        Dallas → Los Angeles
                      </p>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          margin: '4px 0',
                          fontSize: '0.8rem',
                        }}
                      >
                        Status: Delivered
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'carrier-network' && (
            <div id='tab-carrier-network'>
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
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '20px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <h3 style={{ color: '#0ea5e9', marginBottom: '16px' }}>
                    🚛 Active Carriers
                  </h3>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '12px',
                      }}
                    >
                      <h4
                        style={{
                          color: 'white',
                          margin: '0 0 8px 0',
                          fontSize: '0.9rem',
                        }}
                      >
                        ABC Trucking
                      </h4>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          margin: '4px 0',
                          fontSize: '0.8rem',
                        }}
                      >
                        Rating: ⭐⭐⭐⭐⭐ (4.8/5)
                      </p>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          margin: '4px 0',
                          fontSize: '0.8rem',
                        }}
                      >
                        Active Loads: 5
                      </p>
                    </div>
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '12px',
                      }}
                    >
                      <h4
                        style={{
                          color: 'white',
                          margin: '0 0 8px 0',
                          fontSize: '0.9rem',
                        }}
                      >
                        XYZ Transport
                      </h4>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          margin: '4px 0',
                          fontSize: '0.8rem',
                        }}
                      >
                        Rating: ⭐⭐⭐⭐ (4.2/5)
                      </p>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          margin: '4px 0',
                          fontSize: '0.8rem',
                        }}
                      >
                        Active Loads: 3
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <h3 style={{ color: '#0ea5e9', marginBottom: '16px' }}>
                    📊 Performance Metrics
                  </h3>
                  <div style={{ display: 'grid', gap: '16px' }}>
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '4px',
                        }}
                      >
                        <span
                          style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '0.9rem',
                          }}
                        >
                          On-Time Delivery
                        </span>
                        <span style={{ color: '#10b981', fontWeight: '600' }}>
                          94.2%
                        </span>
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '4px',
                        }}
                      >
                        <span
                          style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '0.9rem',
                          }}
                        >
                          Avg Rating
                        </span>
                        <span style={{ color: '#f59e0b', fontWeight: '600' }}>
                          4.5/5
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'market-intelligence' && (
            <div id='tab-market-intelligence'>
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
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '20px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <h3 style={{ color: '#ec4899', marginBottom: '16px' }}>
                    📈 Market Trends
                  </h3>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '12px',
                      }}
                    >
                      <h4
                        style={{
                          color: 'white',
                          margin: '0 0 8px 0',
                          fontSize: '0.9rem',
                        }}
                      >
                        Chicago → Atlanta
                      </h4>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          margin: '4px 0',
                          fontSize: '0.8rem',
                        }}
                      >
                        Avg Rate: $2.45/mile
                      </p>
                      <p
                        style={{
                          color: '#10b981',
                          margin: '4px 0',
                          fontSize: '0.8rem',
                        }}
                      >
                        ↗ +5.2% this week
                      </p>
                    </div>
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '12px',
                      }}
                    >
                      <h4
                        style={{
                          color: 'white',
                          margin: '0 0 8px 0',
                          fontSize: '0.9rem',
                        }}
                      >
                        Dallas → Los Angeles
                      </h4>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          margin: '4px 0',
                          fontSize: '0.8rem',
                        }}
                      >
                        Avg Rate: $2.12/mile
                      </p>
                      <p
                        style={{
                          color: '#ef4444',
                          margin: '4px 0',
                          fontSize: '0.8rem',
                        }}
                      >
                        ↘ -2.1% this week
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <h3 style={{ color: '#ec4899', marginBottom: '16px' }}>
                    🏢 Competitive Analysis
                  </h3>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '12px',
                      }}
                    >
                      <h4
                        style={{
                          color: 'white',
                          margin: '0 0 8px 0',
                          fontSize: '0.9rem',
                        }}
                      >
                        Market Position
                      </h4>
                      <p
                        style={{
                          color: '#10b981',
                          margin: '4px 0',
                          fontSize: '0.8rem',
                        }}
                      >
                        Top 15% in region
                      </p>
                    </div>
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '12px',
                      }}
                    >
                      <h4
                        style={{
                          color: 'white',
                          margin: '0 0 8px 0',
                          fontSize: '0.9rem',
                        }}
                      >
                        Win Rate
                      </h4>
                      <p
                        style={{
                          color: '#f59e0b',
                          margin: '4px 0',
                          fontSize: '0.8rem',
                        }}
                      >
                        73.4% vs 68% avg
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                🎯 Shipper Acquisition & Growth
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '20px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <h3 style={{ color: '#059669', marginBottom: '16px' }}>
                    🎯 Lead Pipeline
                  </h3>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '12px',
                      }}
                    >
                      <h4
                        style={{
                          color: 'white',
                          margin: '0 0 8px 0',
                          fontSize: '0.9rem',
                        }}
                      >
                        Qualified Leads
                      </h4>
                      <p
                        style={{
                          color: '#10b981',
                          margin: '4px 0',
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                        }}
                      >
                        24
                      </p>
                    </div>
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '12px',
                      }}
                    >
                      <h4
                        style={{
                          color: 'white',
                          margin: '0 0 8px 0',
                          fontSize: '0.9rem',
                        }}
                      >
                        In Negotiation
                      </h4>
                      <p
                        style={{
                          color: '#f59e0b',
                          margin: '4px 0',
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                        }}
                      >
                        8
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <h3 style={{ color: '#059669', marginBottom: '16px' }}>
                    📊 Acquisition Metrics
                  </h3>
                  <div style={{ display: 'grid', gap: '16px' }}>
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '4px',
                        }}
                      >
                        <span
                          style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '0.9rem',
                          }}
                        >
                          Conversion Rate
                        </span>
                        <span style={{ color: '#10b981', fontWeight: '600' }}>
                          32.1%
                        </span>
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '4px',
                        }}
                      >
                        <span
                          style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '0.9rem',
                          }}
                        >
                          Avg Sales Cycle
                        </span>
                        <span style={{ color: '#f59e0b', fontWeight: '600' }}>
                          18 days
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

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
  );
}
