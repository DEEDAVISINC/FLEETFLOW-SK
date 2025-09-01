'use client';

import { AlertCircle, Calendar, CheckCircle, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import BrokerageHierarchyService, {
  BrokerAgent,
  UserSession,
} from '../../services/BrokerageHierarchyService';

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
  const [activeTab, setActiveTab] = useState('crm-shipper-acquisition');
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
    specialRequirements: [] as string[],
  });

  // Warehousing State
  const [warehousingData, setWarehousingData] = useState({
    serviceType: 'Storage',
    palletCount: '',
    duration: '',
    location: '',
    temperatureControlled: false,
    hazmatStorage: false,
  });

  // Multi-Service State
  const [multiServiceData, setMultiServiceData] = useState({
    services: [] as string[],
    primaryService: 'LTL',
    totalValue: '',
    timeline: '',
    specialInstructions: '',
  });

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
      baseRate: Math.round(baseRate),
      fuelSurcharge: Math.round(fuelSurcharge),
      total: Math.round(total),
      data: {
        weight: ltlData.weight,
        pallets: ltlData.pallets,
        freightClass: ltlData.freightClass,
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
      data: {
        miles: ftlData.miles,
        equipmentType: ftlData.equipmentType,
        weight: ftlData.weight,
        origin: ftlData.origin,
        destination: ftlData.destination,
        commodity: ftlData.commodity,
        hazmat: ftlData.hazmat,
        teamDriver: ftlData.teamDriver,
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

    let baseRate = 500; // Base specialized service fee
    baseRate += weight * 1.5;
    baseRate += value * 0.02; // 2% of value for insurance

    if (specializedData.serviceType === 'White Glove') baseRate *= 1.8;
    else if (specializedData.serviceType === 'Art/Antiques') baseRate *= 2.2;
    else if (specializedData.serviceType === 'Medical Equipment') baseRate *= 1.6;

    const insuranceFee = value * 0.005; // 0.5% insurance
    const total = baseRate + insuranceFee;

    const quote = {
      id: Date.now().toString(),
      type: 'Specialized',
      quoteNumber: `SPZ-${Date.now()}`,
      timestamp: Date.now(),
      baseRate: Math.round(baseRate),
      insuranceFee: Math.round(insuranceFee),
      total: Math.round(total),
      data: specializedData,
    };

    console.info('✅ Specialized Quote calculated:', quote);
    setPendingQuote(quote);
    setShowConfirmation(true);
  };

  // Mock data for agent loads
  const [agentLoads] = useState<AgentLoad[]>([
    {
      id: '1',
      loadNumber: 'ED-ATL-MIA-001',
      origin: 'Atlanta, GA',
      destination: 'Miami, FL',
      commodity: 'Electronics',
      rate: 2500,
      status: 'assigned',
      pickupDate: '2024-01-16',
      deliveryDate: '2024-01-17',
      carrier: 'ABC Transport',
      priority: 'high',
    },
    {
      id: '2',
      loadNumber: 'ED-JAX-TPA-002',
      origin: 'Jacksonville, FL',
      destination: 'Tampa, FL',
      commodity: 'Food Products',
      rate: 1800,
      status: 'in_transit',
      pickupDate: '2024-01-15',
      deliveryDate: '2024-01-16',
      carrier: 'Fast Freight Co',
      priority: 'medium',
    },
    {
      id: '3',
      loadNumber: 'ED-ORL-SAV-003',
      origin: 'Orlando, FL',
      destination: 'Savannah, GA',
      commodity: 'Textiles',
      rate: 2100,
      status: 'pending',
      pickupDate: '2024-01-18',
      deliveryDate: '2024-01-19',
      priority: 'medium',
    },
  ]);

  // Mock data for agent tasks
  const [agentTasks] = useState<AgentTask[]>([
    {
      id: '1',
      title: 'Follow up with ABC Transport',
      type: 'follow_up',
      priority: 'high',
      dueDate: '2024-01-16T10:00:00Z',
      loadId: '1',
      description: 'Confirm pickup time and driver contact info',
      completed: false,
    },
    {
      id: '2',
      title: 'Rate confirmation for Miami delivery',
      type: 'rate_confirmation',
      priority: 'high',
      dueDate: '2024-01-16T14:00:00Z',
      loadId: '1',
      description: 'Send rate confirmation to shipper',
      completed: false,
    },
    {
      id: '3',
      title: 'Find carrier for Orlando-Savannah',
      type: 'carrier_assignment',
      priority: 'medium',
      dueDate: '2024-01-17T09:00:00Z',
      loadId: '3',
      description: 'Source reliable carrier for textile shipment',
      completed: false,
    },
    {
      id: '4',
      title: 'Update delivery documentation',
      type: 'documentation',
      priority: 'medium',
      dueDate: '2024-01-16T16:00:00Z',
      loadId: '2',
      description: 'Upload BOL and proof of delivery',
      completed: true,
    },
  ]);

  // Initialize session (mock for demo)
  useEffect(() => {
    // In production, this would come from authentication
    const mockSession: UserSession = {
      userId: 'ED-BB-2024061',
      email: 'emily@wilsonfreight.com',
      role: 'BB',
      firstName: 'Emily',
      lastName: 'Davis',
      parentBrokerageId: 'MW-FBB-2024046',
      permissions: {
        canCreateLoads: true,
        canModifyRates: true,
        canAccessFinancials: false,
        canViewAllCompanyLoads: false,
        canManageCarriers: true,
        canGenerateReports: true,
        maxContractValue: 50000,
        requiresApprovalOver: 25000,
        territories: ['West Coast', 'Southwest'],
        loadTypes: ['Dry Van', 'Refrigerated', 'Flatbed'],
      },
      sessionId: 'session-agent-demo',
      loginTime: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    };

    setSession(mockSession);

    // Get agent dashboard data
    const agentData = BrokerageHierarchyService.getAgentDashboardData('ED');
    setCurrentAgent(agentData?.agent || null);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'assigned':
        return '#3b82f6';
      case 'in_transit':
        return '#8b5cf6';
      case 'delivered':
        return '#10b981';
      case 'completed':
        return '#06b6d4';
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const pendingTasks = agentTasks.filter((task) => !task.completed);
  const completedTasks = agentTasks.filter((task) => task.completed);
  const highPriorityTasks = pendingTasks.filter(
    (task) => task.priority === 'high'
  );

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%)',
        }}
      >
        <div style={{ color: 'white', fontSize: '18px' }}>
          Loading Agent Portal...
        </div>
      </div>
    );
  }

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
                  Agent Portal
                </h1>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '18px',
                    margin: '0 0 16px 0',
                  }}
                >
                  Freight brokerage sales & customer management
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
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '14px',
                    }}
                  >
                    Agent: {session?.firstName} {session?.lastName} |{' '}
                    {currentAgent?.position}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link
                href='/ai-flow'
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
                🤖 AI Flow
              </Link>
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
                  Active Customers
                </div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '32px',
                    fontWeight: 'bold',
                  }}
                >
                  34
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
                  67
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
                  $45,230
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
                  73%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            {[
              {
                id: 'quotes-workflow',
                label: 'Quotes & Workflow',
                icon: '💼',
                color: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              },
              {
                id: 'loads-bids',
                label: 'Loads & Bidding',
                icon: '📦',
                color: 'linear-gradient(135deg, #14b8a6, #0d9488)',
              },
              {
                id: 'contracts-bol',
                label: 'Contracts & BOL',
                icon: '📋',
                color: 'linear-gradient(135deg, #f97316, #ea580c)',
              },
              {
                id: 'performance-financial',
                label: 'Performance & Financial',
                icon: '📊',
                color: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              },
              {
                id: 'ai-market-intelligence',
                label: 'AI & Market Intelligence',
                icon: '🤖',
                color: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
              },
              {
                id: 'crm-shipper-acquisition',
                label: 'CRM & Shipper Acquisition',
                icon: '🏢',
                color: 'linear-gradient(135deg, #ef4444, #dc2626)',
              },
              {
                id: 'carrier-network',
                label: 'Carrier Network',
                icon: '🚛',
                color: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '16px 24px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background:
                    activeTab === tab.id
                      ? tab.color
                      : 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  border:
                    activeTab === tab.id
                      ? 'none'
                      : '1px solid rgba(255, 255, 255, 0.2)',
                  transform:
                    activeTab === tab.id ? 'translateY(-2px)' : 'translateY(0)',
                  boxShadow:
                    activeTab === tab.id
                      ? '0 8px 25px rgba(0, 0, 0, 0.3)'
                      : 'none',
                }}
                onMouseOver={(e) => {
                  if (activeTab !== tab.id) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      'rgba(255, 255, 255, 0.25)';
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      'translateY(-1px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeTab !== tab.id) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      'rgba(255, 255, 255, 0.15)';
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      'translateY(0)';
                  }
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quotes & Workflow Tab */}
        {activeTab === 'quotes-workflow' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '20px',
            }}
          >
            {/* Comprehensive Freight Quoting System */}
            <div
              style={{
                border: '2px solid #8b5cf6',
                borderRadius: '16px',
                padding: '24px',
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(10px)',
                gridColumn: '1 / -1', // Take full width
              }}
            >
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
                style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}
              >
                {[
                  { id: 'LTL', label: 'LTL', icon: '📦', color: '#8b5cf6' },
                  { id: 'FTL', label: 'FTL', icon: '🚛', color: '#6366f1' },
                  {
                    id: 'Specialized',
                    label: 'Specialized',
                    icon: '⭐',
                    color: '#6366f1',
                  },
                  {
                    id: 'Warehousing',
                    label: 'Warehousing',
                    icon: '🏢',
                    color: '#14b8a6',
                  },
                  {
                    id: 'Multi-Service',
                    label: 'Multi-Service',
                    icon: '🔄',
                    color: '#f59e0b',
                  },
                  {
                    id: 'SpotRates',
                    label: 'Spot Rates',
                    icon: '📈',
                    color: '#10b981',
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
                      padding: '12px 20px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      backgroundColor:
                        activeQuoteTab === tab.id
                          ? `${tab.color}30`
                          : 'rgba(255, 255, 255, 0.15)',
                      color:
                        activeQuoteTab === tab.id
                          ? tab.color
                          : 'rgba(255, 255, 255, 0.8)',
                      border:
                        activeQuoteTab === tab.id
                          ? `1px solid ${tab.color}60`
                          : '1px solid rgba(255, 255, 255, 0.2)',
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
                    background: 'rgba(0, 0, 0, 0.6)',
                    borderRadius: '16px',
                    padding: '32px',
                    color: 'white',
                    border: '1px solid rgba(139, 92, 246, 0.5)',
                  }}
                >
                  <h3 style={{ marginBottom: '24px', color: '#8b5cf6' }}>
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.info('🎯 LTL Calculate Button Clicked!');
                      calculateLTL();
                    }}
                    style={{
                      marginTop: '24px',
                      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                      color: 'white',
                      padding: '16px 32px',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
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
                    background: 'rgba(0, 0, 0, 0.6)',
                    borderRadius: '16px',
                    padding: '32px',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
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
                        placeholder='Total miles'
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
                          color: 'rgba(255, 255, 255, 0.9)',
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
                        placeholder='Total weight'
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
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                          background: 'rgba(0, 0, 0, 0.3)',
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.info('🎯 FTL Calculate Button Clicked!');
                      calculateFTL();
                    }}
                    style={{
                      marginTop: '24px',
                      background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
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
                    background: 'rgba(0, 0, 0, 0.6)',
                    borderRadius: '16px',
                    padding: '32px',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
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
                        <option value='White Glove'>White Glove Service</option>
                        <option value='Art/Antiques'>Art & Antiques</option>
                        <option value='Medical Equipment'>Medical Equipment</option>
                        <option value='Electronics'>High-Value Electronics</option>
                        <option value='Trade Shows'>Trade Show Logistics</option>
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
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                          background: 'rgba(0, 0, 0, 0.3)',
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
                          color: 'rgba(255, 255, 255, 0.9)',
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
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                          background: 'rgba(0, 0, 0, 0.3)',
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
                          color: 'rgba(255, 255, 255, 0.9)',
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
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                          background: 'rgba(0, 0, 0, 0.3)',
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
                          color: 'rgba(255, 255, 255, 0.9)',
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.info('🎯 Specialized Calculate Button Clicked!');
                      calculateSpecialized();
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
                    💰 Calculate Specialized Quote
                  </button>
                </div>
              )}

              {/* Quote History */}
              {activeQuoteTab === 'History' && (
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.6)',
                    borderRadius: '16px',
                    padding: '32px',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h3 style={{ marginBottom: '24px', color: '#6b7280' }}>
                    📋 Quote History
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
                        id: 'LTL-1234567',
                        type: 'LTL',
                        route: 'Atlanta, GA → Miami, FL',
                        amount: '$1,245',
                        status: 'Accepted',
                        date: '2024-01-15',
                      },
                      {
                        id: 'FTL-1234568',
                        type: 'FTL',
                        route: 'Jacksonville, FL → Tampa, FL',
                        amount: '$2,850',
                        status: 'Pending',
                        date: '2024-01-14',
                      },
                      {
                        id: 'SPZ-1234569',
                        type: 'Specialized',
                        route: 'Savannah, GA → Orlando, FL',
                        amount: '$4,125',
                        status: 'Accepted',
                        date: '2024-01-13',
                      },
                    ].map((quote, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '16px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              color: 'white',
                              fontSize: '14px',
                              fontWeight: '600',
                            }}
                          >
                            {quote.id}
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '12px',
                            }}
                          >
                            {quote.route}
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.6)',
                              fontSize: '11px',
                            }}
                          >
                            {quote.type} • {quote.date}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div
                            style={{
                              color: '#10b981',
                              fontSize: '16px',
                              fontWeight: 'bold',
                            }}
                          >
                            {quote.amount}
                          </div>
                          <div
                            style={{
                              color:
                                quote.status === 'Accepted' ? '#10b981' : '#f59e0b',
                              fontSize: '12px',
                              fontWeight: '600',
                            }}
                          >
                            {quote.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Other quote tabs */}
              {(activeQuoteTab === 'Warehousing' ||
                activeQuoteTab === 'Multi-Service' ||
                activeQuoteTab === 'SpotRates') && (
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.6)',
                    borderRadius: '16px',
                    padding: '32px',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    textAlign: 'center',
                  }}
                >
                  <h3 style={{ marginBottom: '24px', color: '#6b7280' }}>
                    {activeQuoteTab === 'Warehousing' && '🏢 Warehousing Services'}
                    {activeQuoteTab === 'Multi-Service' && '🔄 Multi-Service Quotes'}
                    {activeQuoteTab === 'SpotRates' && '📈 Spot Rate Analysis'}
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    {activeQuoteTab} calculator coming soon...
                  </p>
                </div>
              )}
            </div>

            {/* Quote Activity & Recent Quotes */}
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              {/* Quote Stats */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '15px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '20px',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginBottom: '15px',
                  }}
                >
                  📈 Today's Activity
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '14px',
                      }}
                    >
                      Quotes Generated
                    </span>
                    <span
                      style={{
                        color: '#10b981',
                        fontSize: '16px',
                        fontWeight: 'bold',
                      }}
                    >
                      12
                    </span>
                  </div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '14px',
                      }}
                    >
                      Quotes Accepted
                    </span>
                    <span
                      style={{
                        color: '#3b82f6',
                        fontSize: '16px',
                        fontWeight: 'bold',
                      }}
                    >
                      7
                    </span>
                  </div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '14px',
                      }}
                    >
                      Conversion Rate
                    </span>
                    <span
                      style={{
                        color: '#f59e0b',
                        fontSize: '16px',
                        fontWeight: 'bold',
                      }}
                    >
                      58%
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Quotes */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '15px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '20px',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginBottom: '15px',
                  }}
                >
                  🔄 Recent Quotes
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  {[
                    {
                      id: 'Q-001',
                      route: 'ATL → MIA',
                      amount: '$2,450',
                      status: 'accepted',
                    },
                    {
                      id: 'Q-002',
                      route: 'JAX → TPA',
                      amount: '$1,850',
                      status: 'pending',
                    },
                    {
                      id: 'Q-003',
                      route: 'ORL → SAV',
                      amount: '$2,100',
                      status: 'sent',
                    },
                  ].map((quote) => (
                    <div
                      key={quote.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '6px',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          {quote.id}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '11px',
                          }}
                        >
                          {quote.route}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            color: '#10b981',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          {quote.amount}
                        </div>
                        <div
                          style={{
                            color:
                              quote.status === 'accepted'
                                ? '#10b981'
                                : '#f59e0b',
                            fontSize: '10px',
                            fontWeight: '600',
                          }}
                        >
                          {quote.status.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loads & Bidding Tab */}
        {activeTab === 'loads-bids' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '15px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '25px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '25px',
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
                My Active Loads ({agentLoads.length})
              </h2>
              {(session?.permissions as any)?.canCreateLoads && (
                <button
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  + Create Load
                </button>
              )}
            </div>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
            >
              {agentLoads.map((load) => (
                <div
                  key={load.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: `2px solid ${getStatusColor(load.status)}20`,
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '20px',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          fontWeight: 'bold',
                          marginBottom: '8px',
                        }}
                      >
                        {load.loadNumber}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <MapPin size={16} />
                        {load.origin} → {load.destination}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '14px',
                          marginTop: '4px',
                        }}
                      >
                        {load.commodity}
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '20px',
                          fontWeight: 'bold',
                          marginBottom: '4px',
                        }}
                      >
                        ${load.rate.toLocaleString()}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '14px',
                        }}
                      >
                        Rate
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          color: getStatusColor(load.status),
                          fontSize: '14px',
                          fontWeight: '600',
                          background: `${getStatusColor(load.status)}20`,
                          padding: '6px 12px',
                          borderRadius: '16px',
                          display: 'inline-block',
                          marginBottom: '8px',
                        }}
                      >
                        {load.status.replace('_', ' ').toUpperCase()}
                      </div>
                      {load.carrier && (
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '12px',
                          }}
                        >
                          {load.carrier}
                        </div>
                      )}
                    </div>

                    <div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '12px',
                          marginBottom: '4px',
                        }}
                      >
                        Pickup: {new Date(load.pickupDate).toLocaleDateString()}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '12px',
                        }}
                      >
                        Delivery:{' '}
                        {new Date(load.deliveryDate).toLocaleDateString()}
                      </div>
                    </div>

                    <div>
                      <button
                        style={{
                          background: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          padding: '8px 16px',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contracts & BOL Tab */}
        {activeTab === 'contracts-bol' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '20px',
            }}
          >
            {/* Pending Tasks */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '25px',
              }}
            >
              <h2
                style={{
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  marginBottom: '25px',
                }}
              >
                Pending Tasks ({pendingTasks.length})
              </h2>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px',
                }}
              >
                {pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                      borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginBottom: '10px',
                      }}
                    >
                      <div>
                        <h4
                          style={{
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            margin: '0 0 5px 0',
                          }}
                        >
                          {task.title}
                        </h4>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '14px',
                          }}
                        >
                          {task.description}
                        </div>
                      </div>
                      <div
                        style={{
                          color: getPriorityColor(task.priority),
                          fontSize: '12px',
                          fontWeight: '600',
                          background: `${getPriorityColor(task.priority)}20`,
                          padding: '4px 8px',
                          borderRadius: '12px',
                        }}
                      >
                        {task.priority.toUpperCase()}
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Calendar size={14} />
                        Due: {new Date(
                          task.dueDate
                        ).toLocaleDateString()} at{' '}
                        {new Date(task.dueDate).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <button
                        style={{
                          background:
                            'linear-gradient(135deg, #10b981, #059669)',
                          color: 'white',
                          padding: '6px 12px',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        Mark Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Task Summary */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '25px',
                marginBottom: '20px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '20px',
                }}
              >
                Task Summary
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px',
                }}
              >
                <div
                  style={{
                    textAlign: 'center',
                    padding: '15px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: '8px',
                  }}
                >
                  <div
                    style={{
                      color: '#ef4444',
                      fontSize: '24px',
                      fontWeight: 'bold',
                    }}
                  >
                    {highPriorityTasks.length}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                    }}
                  >
                    High Priority
                  </div>
                </div>
                <div
                  style={{
                    textAlign: 'center',
                    padding: '15px',
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '8px',
                  }}
                >
                  <div
                    style={{
                      color: '#f59e0b',
                      fontSize: '24px',
                      fontWeight: 'bold',
                    }}
                  >
                    {pendingTasks.filter((t) => t.priority === 'medium').length}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                    }}
                  >
                    Medium Priority
                  </div>
                </div>
                <div
                  style={{
                    textAlign: 'center',
                    padding: '15px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '8px',
                  }}
                >
                  <div
                    style={{
                      color: '#10b981',
                      fontSize: '24px',
                      fontWeight: 'bold',
                    }}
                  >
                    {completedTasks.length}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                    }}
                  >
                    Completed Today
                  </div>
                </div>
              </div>
            </div>

            {/* Contract & BOL Quick Actions */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '25px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '20px',
                }}
              >
                📋 Contracts & BOL
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <button
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    padding: '12px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  📄 Generate Rate Confirmation
                </button>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    color: 'white',
                    padding: '12px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  📋 Create BOL
                </button>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    padding: '12px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  ✍️ Request Signature
                </button>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    marginTop: '8px',
                  }}
                >
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Pending Approvals
                  </span>
                  <span
                    style={{
                      color: '#f59e0b',
                      fontSize: '16px',
                      fontWeight: 'bold',
                    }}
                  >
                    3
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance & Financial Tab */}
        {activeTab === 'performance-financial' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
              marginBottom: '30px',
            }}
          >
            {/* Financial KPIs */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '25px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '20px',
                }}
              >
                💹 Financial Performance
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '15px',
                }}
              >
                <div
                  style={{
                    textAlign: 'center',
                    padding: '15px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '10px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <div
                    style={{
                      color: '#10b981',
                      fontSize: '24px',
                      fontWeight: 'bold',
                    }}
                  >
                    $45,230
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Monthly Revenue
                  </div>
                </div>
                <div
                  style={{
                    textAlign: 'center',
                    padding: '15px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '10px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                  }}
                >
                  <div
                    style={{
                      color: '#3b82f6',
                      fontSize: '24px',
                      fontWeight: 'bold',
                    }}
                  >
                    18.5%
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Avg Margin
                  </div>
                </div>
                <div
                  style={{
                    textAlign: 'center',
                    padding: '15px',
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '10px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                  }}
                >
                  <div
                    style={{
                      color: '#f59e0b',
                      fontSize: '24px',
                      fontWeight: 'bold',
                    }}
                  >
                    $8,370
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Commission (YTD)
                  </div>
                </div>
                <div
                  style={{
                    textAlign: 'center',
                    padding: '15px',
                    background: 'rgba(139, 92, 246, 0.1)',
                    borderRadius: '10px',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                  }}
                >
                  <div
                    style={{
                      color: '#8b5cf6',
                      fontSize: '24px',
                      fontWeight: 'bold',
                    }}
                  >
                    $2,150
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    This Month
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '25px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '20px',
                }}
              >
                📊 Performance Metrics
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '15px',
                }}
              >
                <div
                  style={{
                    textAlign: 'center',
                    padding: '15px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                  }}
                >
                  <div
                    style={{
                      color: '#10b981',
                      fontSize: '24px',
                      fontWeight: 'bold',
                    }}
                  >
                    98.5%
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    On-Time Delivery
                  </div>
                </div>
                <div
                  style={{
                    textAlign: 'center',
                    padding: '15px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                  }}
                >
                  <div
                    style={{
                      color: '#3b82f6',
                      fontSize: '24px',
                      fontWeight: 'bold',
                    }}
                  >
                    0.5h
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Avg Response Time
                  </div>
                </div>
                <div
                  style={{
                    textAlign: 'center',
                    padding: '15px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                  }}
                >
                  <div
                    style={{
                      color: '#f59e0b',
                      fontSize: '24px',
                      fontWeight: 'bold',
                    }}
                  >
                    4.8
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Customer Rating
                  </div>
                </div>
                <div
                  style={{
                    textAlign: 'center',
                    padding: '15px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                  }}
                >
                  <div
                    style={{
                      color: '#6366f1',
                      fontSize: '24px',
                      fontWeight: 'bold',
                    }}
                  >
                    73%
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Success Rate
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '25px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '20px',
                }}
              >
                🕒 Recent Activity
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {[
                  {
                    date: '2024-01-15',
                    action: 'Load Created',
                    details: 'ATL-MIA-WMT-12345',
                    icon: '🚛',
                  },
                  {
                    date: '2024-01-14',
                    action: 'Rate Negotiated',
                    details: '$2,350 → $2,500',
                    icon: '💰',
                  },
                  {
                    date: '2024-01-13',
                    action: 'Carrier Assigned',
                    details: 'ABC Trucking Co.',
                    icon: '🤝',
                  },
                  {
                    date: '2024-01-12',
                    action: 'Customer Call',
                    details: '30 min discussion',
                    icon: '📞',
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '6px',
                    }}
                  >
                    <div style={{ fontSize: '16px' }}>{activity.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {activity.action}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '11px',
                        }}
                      >
                        {activity.details}
                      </div>
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '10px',
                      }}
                    >
                      {activity.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Permissions & Limits */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '25px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '20px',
                }}
              >
                🔒 Access & Limits
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  marginBottom: '15px',
                }}
              >
                {[
                  {
                    permission: 'Create Loads',
                    enabled: (session?.permissions as any)?.canCreateLoads,
                  },
                  {
                    permission: 'Modify Rates',
                    enabled: (session?.permissions as any)?.canModifyRates,
                  },
                  {
                    permission: 'Manage Carriers',
                    enabled: (session?.permissions as any)?.canManageCarriers,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 0',
                    }}
                  >
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '12px',
                      }}
                    >
                      {item.permission}
                    </span>
                    {item.enabled ? (
                      <CheckCircle size={14} style={{ color: '#10b981' }} />
                    ) : (
                      <AlertCircle size={14} style={{ color: '#ef4444' }} />
                    )}
                  </div>
                ))}
              </div>
              <div
                style={{
                  padding: '12px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '6px',
                }}
              >
                <div
                  style={{
                    color: '#3b82f6',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                >
                  Contract Limits
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '10px',
                    marginTop: '3px',
                  }}
                >
                  Max: $
                  {(
                    (session?.permissions as any)?.maxContractValue || 50000
                  ).toLocaleString()}{' '}
                  | Approval: $
                  {(
                    (session?.permissions as any)?.requiresApprovalOver || 25000
                  ).toLocaleString()}
                  +
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI & Market Intelligence Tab */}
        {activeTab === 'ai-market-intelligence' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
              marginBottom: '30px',
            }}
          >
            {/* AI Smart Load Matching */}
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '15px',
                padding: '25px',
              }}
            >
              <h3
                style={{
                  color: '#10b981',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                }}
              >
                🎯 Smart Load Matching
              </h3>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  marginBottom: '15px',
                }}
              >
                AI-powered load recommendations based on your customer patterns.
              </p>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    color: '#10b981',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                >
                  STATUS: ACTIVE
                </span>
                <span
                  style={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold',
                  }}
                >
                  127 Matches
                </span>
              </div>
            </div>

            {/* Bid Optimization */}
            <div
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '15px',
                padding: '25px',
              }}
            >
              <h3
                style={{
                  color: '#3b82f6',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                }}
              >
                💰 Bid Optimization
              </h3>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  marginBottom: '15px',
                }}
              >
                Dynamic pricing recommendations to maximize profitability.
              </p>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    color: '#3b82f6',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                >
                  WIN RATE: 73%
                </span>
                <span
                  style={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold',
                  }}
                >
                  +12% Margin
                </span>
              </div>
            </div>

            {/* Risk Assessment */}
            <div
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '15px',
                padding: '25px',
              }}
            >
              <h3
                style={{
                  color: '#f59e0b',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                }}
              >
                ⚠️ Risk Assessment
              </h3>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  marginBottom: '15px',
                }}
              >
                Real-time carrier and load risk analysis with fraud detection.
              </p>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    color: '#f59e0b',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                >
                  ALERTS: 3
                </span>
                <span
                  style={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold',
                  }}
                >
                  94% Safe
                </span>
              </div>
            </div>

            {/* Rate Trends */}
            <div
              style={{
                background: 'rgba(236, 72, 153, 0.1)',
                border: '1px solid rgba(236, 72, 153, 0.3)',
                borderRadius: '15px',
                padding: '25px',
              }}
            >
              <h3
                style={{
                  color: '#ec4899',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                }}
              >
                📈 Rate Trends
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                    }}
                  >
                    ATL-MIA
                  </span>
                  <span
                    style={{
                      color: '#10b981',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    +5.2%
                  </span>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                    }}
                  >
                    JAX-TPA
                  </span>
                  <span
                    style={{
                      color: '#ef4444',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    -2.1%
                  </span>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                    }}
                  >
                    ORL-SAV
                  </span>
                  <span
                    style={{
                      color: '#10b981',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    +3.7%
                  </span>
                </div>
              </div>
            </div>

            {/* Fuel Prices */}
            <div
              style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '15px',
                padding: '25px',
              }}
            >
              <h3
                style={{
                  color: '#8b5cf6',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                }}
              >
                ⛽ Fuel Prices
              </h3>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    color: '#8b5cf6',
                    fontSize: '28px',
                    fontWeight: 'bold',
                  }}
                >
                  $3.42
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Avg Diesel (FL)
                </div>
                <div
                  style={{
                    color: '#f59e0b',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginTop: '5px',
                  }}
                >
                  +$0.08 vs last week
                </div>
              </div>
            </div>

            {/* Capacity */}
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '15px',
                padding: '25px',
              }}
            >
              <h3
                style={{
                  color: '#10b981',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                }}
              >
                🚛 Capacity
              </h3>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    color: '#10b981',
                    fontSize: '28px',
                    fontWeight: 'bold',
                  }}
                >
                  78%
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Available Now
                </div>
                <div
                  style={{
                    color: '#3b82f6',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginTop: '5px',
                  }}
                >
                  +3% vs yesterday
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CRM & Shipper Acquisition Tab */}
        {activeTab === 'crm-shipper-acquisition' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '15px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '25px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '25px',
              }}
            >
              <h2
                style={{
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold',
                }}
              >
                🏢 CRM & Shipper Acquisition
              </h2>
              <button
                onClick={() => setShowShipperForm(true)}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  (e.target as HTMLElement).style.transform =
                    'translateY(-2px)';
                  (e.target as HTMLElement).style.boxShadow =
                    '0 6px 20px rgba(16, 185, 129, 0.4)';
                }}
                onMouseOut={(e) => {
                  (e.target as HTMLElement).style.transform = 'translateY(0)';
                  (e.target as HTMLElement).style.boxShadow =
                    '0 4px 12px rgba(16, 185, 129, 0.3)';
                }}
              >
                ➕ Add Shipper
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '25px',
                marginBottom: '30px',
              }}
            >
              {/* Sales Pipeline */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '15px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '20px',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    marginBottom: '15px',
                  }}
                >
                  🎯 Sales Pipeline
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  {[
                    {
                      company: 'ABC Manufacturing',
                      stage: 'Negotiation',
                      value: '$15,000',
                      probability: '85%',
                    },
                    {
                      company: 'XYZ Logistics',
                      stage: 'Proposal',
                      value: '$8,500',
                      probability: '60%',
                    },
                    {
                      company: 'Global Distributors',
                      stage: 'Qualified',
                      value: '$22,000',
                      probability: '40%',
                    },
                  ].map((deal, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        padding: '15px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          {deal.company}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '12px',
                          }}
                        >
                          Stage: {deal.stage}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            color: '#10b981',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          {deal.value}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '12px',
                          }}
                        >
                          {deal.probability}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* CRM Stats */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '15px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '20px',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    marginBottom: '15px',
                  }}
                >
                  📊 CRM Stats
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                  }}
                >
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '15px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                    }}
                  >
                    <div
                      style={{
                        color: '#10b981',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      34
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '12px',
                      }}
                    >
                      Active Leads
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '15px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                    }}
                  >
                    <div
                      style={{
                        color: '#3b82f6',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      28%
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '12px',
                      }}
                    >
                      Close Rate
                    </div>
                  </div>
                </div>
              </div>

              {/* Target Prospects */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '15px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '20px',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    marginBottom: '15px',
                  }}
                >
                  🎯 Target Prospects
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  {[
                    {
                      company: 'Regional Food Distributor',
                      industry: 'Food & Beverage',
                      size: 'Mid-Market',
                      potential: '$25,000',
                    },
                    {
                      company: 'Southeast Auto Parts',
                      industry: 'Automotive',
                      size: 'Small',
                      potential: '$12,000',
                    },
                    {
                      company: 'Atlantic Electronics',
                      industry: 'Electronics',
                      size: 'Large',
                      potential: '$45,000',
                    },
                  ].map((prospect, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          {prospect.company}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '12px',
                          }}
                        >
                          {prospect.industry} • {prospect.size}
                        </div>
                      </div>
                      <div
                        style={{
                          color: '#10b981',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        {prospect.potential}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Carrier Network Tab */}
        {activeTab === 'carrier-network' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '15px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '25px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '25px',
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
                🚛 Carrier Network
              </h2>
              <button
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                }}
                onMouseOver={(e) => {
                  (e.target as HTMLButtonElement).style.transform =
                    'translateY(-2px)';
                  (e.target as HTMLButtonElement).style.boxShadow =
                    '0 6px 20px rgba(16, 185, 129, 0.4)';
                }}
                onMouseOut={(e) => {
                  (e.target as HTMLButtonElement).style.transform =
                    'translateY(0)';
                  (e.target as HTMLButtonElement).style.boxShadow =
                    '0 4px 12px rgba(16, 185, 129, 0.3)';
                }}
                onClick={() => {
                  // Handle invite carrier functionality
                  alert(
                    'Invite Carrier functionality - integrate with CarrierInvitationService'
                  );
                }}
              >
                ➕ Invite Carrier
              </button>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
              }}
            >
              <div>
                <h3
                  style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    marginBottom: '15px',
                  }}
                >
                  ⭐ Preferred Carriers
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  {[
                    {
                      name: 'Swift Transportation',
                      rating: '4.8',
                      loads: '45',
                      performance: '96%',
                    },
                    {
                      name: 'Werner Enterprises',
                      rating: '4.6',
                      loads: '32',
                      performance: '94%',
                    },
                    {
                      name: 'J.B. Hunt',
                      rating: '4.7',
                      loads: '28',
                      performance: '95%',
                    },
                  ].map((carrier, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        padding: '15px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          {carrier.name}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '12px',
                          }}
                        >
                          ⭐ {carrier.rating} | {carrier.loads} loads
                        </div>
                      </div>
                      <div
                        style={{
                          color: '#10b981',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        {carrier.performance}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3
                  style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    marginBottom: '15px',
                  }}
                >
                  📊 Network Stats
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                  }}
                >
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '15px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                    }}
                  >
                    <div
                      style={{
                        color: '#0ea5e9',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      78
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '12px',
                      }}
                    >
                      Active Carriers
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '15px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                    }}
                  >
                    <div
                      style={{
                        color: '#10b981',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      4.6
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '12px',
                      }}
                    >
                      Avg Rating
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Market Intelligence Tab */}
        {activeTab === 'market-intelligence' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '15px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '25px',
            }}
          >
            <h2
              style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '25px',
              }}
            >
              📊 Market Intelligence
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
              }}
            >
              <div
                style={{
                  background: 'rgba(236, 72, 153, 0.1)',
                  border: '1px solid rgba(236, 72, 153, 0.3)',
                  borderRadius: '12px',
                  padding: '20px',
                }}
              >
                <h3
                  style={{
                    color: '#ec4899',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    marginBottom: '15px',
                  }}
                >
                  📈 Rate Trends
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '14px',
                      }}
                    >
                      ATL-MIA
                    </span>
                    <span
                      style={{
                        color: '#10b981',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      +5.2%
                    </span>
                  </div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '14px',
                      }}
                    >
                      JAX-TPA
                    </span>
                    <span
                      style={{
                        color: '#ef4444',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      -2.1%
                    </span>
                  </div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '14px',
                      }}
                    >
                      ORL-SAV
                    </span>
                    <span
                      style={{
                        color: '#10b981',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      +3.7%
                    </span>
                  </div>
                </div>
              </div>
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '12px',
                  padding: '20px',
                }}
              >
                <h3
                  style={{
                    color: '#3b82f6',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    marginBottom: '15px',
                  }}
                >
                  ⛽ Fuel Prices
                </h3>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      color: '#3b82f6',
                      fontSize: '28px',
                      fontWeight: 'bold',
                    }}
                  >
                    $3.42
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                    }}
                  >
                    Avg Diesel (FL)
                  </div>
                  <div
                    style={{
                      color: '#f59e0b',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginTop: '5px',
                    }}
                  >
                    +$0.08 vs last week
                  </div>
                </div>
              </div>
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '12px',
                  padding: '20px',
                }}
              >
                <h3
                  style={{
                    color: '#10b981',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    marginBottom: '15px',
                  }}
                >
                  🚛 Capacity
                </h3>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      color: '#10b981',
                      fontSize: '28px',
                      fontWeight: 'bold',
                    }}
                  >
                    78%
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                    }}
                  >
                    Utilization
                  </div>
                  <div
                    style={{
                      color: '#ec4899',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginTop: '5px',
                    }}
                  >
                    TIGHT MARKET
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
