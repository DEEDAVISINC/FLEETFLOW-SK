'use client';

import React, { useEffect, useState } from 'react';
import { BrokerQuoteInterface } from '../components/BrokerQuoteInterface';
import { FreightClassCalculator } from '../components/FreightClassCalculator';
import RFxResponseDashboard from '../components/RFxResponseDashboard';
import EDIWorkflowService from '../services/EDIWorkflowService';

interface LoadPosting {
  id: string;
  type: 'LTL' | 'FTL' | 'Specialized';
  origin: {
    city: string;
    state: string;
    zipCode: string;
  };
  destination: {
    city: string;
    state: string;
    zipCode: string;
  };
  pickupDate: string;
  deliveryDate: string;
  weight?: number;
  pallets?: number;
  freightClass?: number;
  equipment?: string;
  rate: number;
  commodity: string;
  specialInstructions?: string;
  status: 'posted' | 'assigned' | 'in-transit' | 'delivered' | 'cancelled';
  assignedDispatcher?: string;
  assignedCarrier?: string;
  postedBy: string;
  postedAt: Date;
  shipper: {
    name: string;
    company: string;
    email: string;
    phone: string;
  };
  loadBoardNumber?: string; // Added for phone communication
}

interface Dispatcher {
  id: string;
  name: string;
  email: string;
  phone: string;
  region: string;
  activeLoads: number;
  rating: number;
  specialties: string[];
}

const BrokerOperationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'rfx'
    | 'shippers'
    | 'quotes'
    | 'loadboard'
    | 'tools'
    | 'analytics'
  >('overview');
  const [user] = useState({
    id: 'broker-001',
    name: 'Alex Rodriguez',
    role: 'Senior Broker',
    email: 'alex.rodriguez@fleetflow.com',
  });

  // Loadboard state
  const [loads, setLoads] = useState<LoadPosting[]>([]);
  const [dispatchers, setDispatchers] = useState<Dispatcher[]>([]);
  const [showLoadForm, setShowLoadForm] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState<LoadPosting | null>(null);
  const [newLoad, setNewLoad] = useState<Partial<LoadPosting>>({
    type: 'FTL',
    status: 'posted',
    postedBy: 'Alex Rodriguez',
  });

  // Mock data for broker overview
  const [dashboardData] = useState({
    activeRFx: 12,
    pendingResponses: 4,
    monthlyWinRate: 34.6,
    monthlyRevenue: 285450,
    topShippers: [
      { name: 'Walmart Distribution', loads: 23, revenue: 125000 },
      { name: 'Home Depot Logistics', loads: 18, revenue: 98500 },
      { name: 'Amazon Fulfillment', loads: 15, revenue: 156000 },
    ],
    recentActivity: [
      {
        type: 'RFQ',
        shipper: 'Walmart Distribution',
        status: 'Won',
        amount: 12500,
        time: '2 hours ago',
      },
      {
        type: 'RFB',
        shipper: 'Home Depot',
        status: 'Submitted',
        amount: 18000,
        time: '4 hours ago',
      },
      {
        type: 'RFP',
        shipper: 'Amazon',
        status: 'In Progress',
        amount: 25000,
        time: '6 hours ago',
      },
    ],
  });

  // Initialize mock dispatchers and loads
  useEffect(() => {
    const mockDispatchers: Dispatcher[] = [
      {
        id: 'DISP001',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@fleetflow.com',
        phone: '555-0123',
        region: 'Southeast',
        activeLoads: 8,
        rating: 4.8,
        specialties: ['Refrigerated', 'Expedited', 'High Value'],
      },
      {
        id: 'DISP002',
        name: 'Mike Chen',
        email: 'mike.chen@fleetflow.com',
        phone: '555-0456',
        region: 'West Coast',
        activeLoads: 12,
        rating: 4.6,
        specialties: ['Flatbed', 'Oversized', 'Construction'],
      },
      {
        id: 'DISP003',
        name: 'Emily Davis',
        email: 'emily.davis@fleetflow.com',
        phone: '555-0789',
        region: 'Midwest',
        activeLoads: 6,
        rating: 4.9,
        specialties: ['LTL', 'Food Grade', 'Pharmaceutical'],
      },
      {
        id: 'DISP004',
        name: 'James Wilson',
        email: 'james.wilson@fleetflow.com',
        phone: '555-0321',
        region: 'Northeast',
        activeLoads: 10,
        rating: 4.7,
        specialties: ['Hazmat', 'Temperature Controlled', 'White Glove'],
      },
    ];

    const mockLoads: LoadPosting[] = [
      {
        id: 'LD001',
        type: 'FTL',
        origin: { city: 'Atlanta', state: 'GA', zipCode: '30309' },
        destination: { city: 'Jacksonville', state: 'FL', zipCode: '32202' },
        pickupDate: '2025-07-11',
        deliveryDate: '2025-07-12',
        weight: 45000,
        equipment: 'Dry Van',
        rate: 1250,
        commodity: 'Auto Parts',
        status: 'posted',
        postedBy: 'Alex Rodriguez',
        postedAt: new Date(),
        shipper: {
          name: 'John Smith',
          company: 'AutoParts Distribution',
          email: 'john@autoparts.com',
          phone: '555-1234',
        },
      },
      {
        id: 'LD002',
        type: 'LTL',
        origin: { city: 'Chicago', state: 'IL', zipCode: '60601' },
        destination: { city: 'Detroit', state: 'MI', zipCode: '48201' },
        pickupDate: '2025-07-12',
        deliveryDate: '2025-07-13',
        weight: 8500,
        pallets: 6,
        freightClass: 70,
        rate: 850,
        commodity: 'Electronics',
        status: 'assigned',
        assignedDispatcher: 'Emily Davis',
        postedBy: 'Alex Rodriguez',
        postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        shipper: {
          name: 'Lisa Johnson',
          company: 'TechCorp Manufacturing',
          email: 'lisa@techcorp.com',
          phone: '555-5678',
        },
      },
      {
        id: 'LD003',
        type: 'Specialized',
        origin: { city: 'Houston', state: 'TX', zipCode: '77002' },
        destination: { city: 'Phoenix', state: 'AZ', zipCode: '85001' },
        pickupDate: '2025-07-13',
        deliveryDate: '2025-07-15',
        weight: 32000,
        equipment: 'Refrigerated',
        rate: 2100,
        commodity: 'Pharmaceuticals',
        specialInstructions: 'Temperature must be maintained at 2-8°C',
        status: 'in-transit',
        assignedDispatcher: 'Sarah Johnson',
        assignedCarrier: 'ColdChain Express',
        postedBy: 'Alex Rodriguez',
        postedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        shipper: {
          name: 'Dr. Michael Brown',
          company: 'PharmaLogistics Inc',
          email: 'mbrown@pharmalog.com',
          phone: '555-9012',
        },
      },
    ];

    setDispatchers(mockDispatchers);
    setLoads(mockLoads);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      Won: 'text-green-600 bg-green-50',
      Submitted: 'text-blue-600 bg-blue-50',
      'In Progress': 'text-yellow-600 bg-yellow-50',
      Lost: 'text-red-600 bg-red-50',
      posted: '#f59e0b',
      assigned: '#8b5cf6',
      'in-transit': '#10b981',
      delivered: '#059669',
      cancelled: '#ef4444',
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-50';
  };

  const getRFxIcon = (type: string) => {
    const icons = {
      RFQ: '💰',
      RFB: '🎯',
      RFP: '📋',
      RFI: '❓',
    };
    return icons[type as keyof typeof icons] || '📄';
  };

  const createLoad = async () => {
    if (
      !newLoad.origin ||
      !newLoad.destination ||
      !newLoad.pickupDate ||
      !newLoad.rate
    ) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Create basic load object
      const loadData = {
        id: `load-${Date.now()}`,
        brokerId: user.id,
        origin: newLoad.origin,
        destination: newLoad.destination,
        pickupDate: newLoad.pickupDate,
        deliveryDate: newLoad.deliveryDate || newLoad.pickupDate,
        weight: newLoad.weight?.toString() || '0',
        equipment: newLoad.equipment || 'Dry Van',
        rate: newLoad.rate,
        distance: '0 mi', // Will be calculated
        loadType: newLoad.type || 'FTL',
        status: 'Available' as const,
        shipperName: newLoad.shipper?.company || 'Unknown Shipper',
        shipperId: undefined,
        specialInstructions: newLoad.specialInstructions,
        loadBoardNumber: `LB-${Date.now().toString().slice(-6)}`,
      };

      // Process with EDI workflow
      const ediResult = await EDIWorkflowService.processWorkflow({
        type: 'load_posting',
        data: loadData,
        userId: user.name,
        timestamp: new Date(),
      });

      setLoads([ediResult.enrichedData, ...loads]);
      setNewLoad({
        type: 'FTL',
        status: 'posted',
        postedBy: user.name,
      });
      setShowLoadForm(false);

      alert(`Load ${loadData.loadBoardNumber} created successfully!`);
    } catch (error) {
      console.error('Error creating load:', error);
      alert('Error creating load. Please try again.');
    }
  };

  const assignDispatcher = (loadId: string, dispatcherId: string) => {
    try {
      const loadToUpdate = loads.find((load) => load.id === loadId);
      if (loadToUpdate) {
        const assignedLoad = {
          ...loadToUpdate,
          status: 'assigned' as const,
          assignedDispatcher: dispatcherId,
        };

        // Update local state
        setLoads(
          loads.map((load) => (load.id === loadId ? assignedLoad : load))
        );

        // Update dispatcher stats
        setDispatchers(
          dispatchers.map((d) =>
            d.id === dispatcherId ? { ...d, activeLoads: d.activeLoads + 1 } : d
          )
        );

        alert(`Load assigned to dispatcher successfully!`);
      } else {
        alert('Error finding load to assign.');
      }
    } catch (error) {
      console.error('Error assigning dispatcher:', error);
      alert('Error assigning dispatcher. Please try again.');
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        minHeight: '100vh',
        padding: '80px 20px 20px 20px',
      }}
    >
      <main
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '40px 32px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: 'left',
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 16px 0',
                  textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                }}
              >
                🏢 Broker Operations Center
              </h1>
              <p
                style={{
                  fontSize: '22px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: '0 0 8px 0',
                  fontWeight: '500',
                }}
              >
                Comprehensive broker tools with intelligent RFx response
                capabilities
              </p>
              <p
                style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  margin: 0,
                }}
              >
                FreightFlow RFx System • Live Market Intelligence • Competitive
                Bidding
              </p>
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                textAlign: 'right',
              }}
            >
              <p
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'white',
                  margin: '0 0 4px 0',
                }}
              >
                {user.name}
              </p>
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  margin: 0,
                }}
              >
                {user.role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '32px',
            justifyContent: 'center',
          }}
        >
          {[
            { key: 'overview', label: 'Overview', icon: '📊' },
            { key: 'rfx', label: 'FreightFlow RFx Center', icon: '📋' },
            { key: 'shippers', label: 'Shipper Management', icon: '🏢' },
            { key: 'quotes', label: 'Quick Quotes', icon: '💰' },
            { key: 'loadboard', label: 'Loadboard', icon: '🚛' },
            { key: 'tools', label: 'Broker Tools', icon: '🛠️' },
            { key: 'analytics', label: 'Performance', icon: '📈' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                background:
                  activeTab === tab.key
                    ? 'linear-gradient(135deg, #f97316, #ea580c)'
                    : 'rgba(255, 255, 255, 0.1)',
                color:
                  activeTab === tab.key ? 'white' : 'rgba(255, 255, 255, 0.8)',
                border:
                  activeTab === tab.key
                    ? '2px solid rgba(255, 255, 255, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                transform: activeTab === tab.key ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
          >
            {/* Key Metrics */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '24px',
                  textAlign: 'center',
                }}
              >
                📊 Broker Performance Metrics
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
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: '14px',
                          color: '#6b7280',
                          margin: '0 0 8px 0',
                          fontWeight: '500',
                        }}
                      >
                        Active RFx Requests
                      </p>
                      <p
                        style={{
                          fontSize: '36px',
                          fontWeight: 'bold',
                          color: '#3b82f6',
                          margin: '0',
                          textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        }}
                      >
                        {dashboardData.activeRFx}
                      </p>
                    </div>
                    <div
                      style={{
                        fontSize: '48px',
                        opacity: '0.8',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                      }}
                    >
                      📥
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: '12px',
                      color: '#3b82f6',
                      margin: '8px 0 0 0',
                      fontWeight: '600',
                    }}
                  >
                    🔥 {dashboardData.pendingResponses} pending responses
                  </p>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: '14px',
                          color: '#6b7280',
                          margin: '0 0 8px 0',
                          fontWeight: '500',
                        }}
                      >
                        Win Rate (30 days)
                      </p>
                      <p
                        style={{
                          fontSize: '36px',
                          fontWeight: 'bold',
                          color: '#10b981',
                          margin: '0',
                          textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        }}
                      >
                        {dashboardData.monthlyWinRate}%
                      </p>
                    </div>
                    <div
                      style={{
                        fontSize: '48px',
                        opacity: '0.8',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                      }}
                    >
                      🏆
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: '14px',
                          color: '#6b7280',
                          margin: '0 0 8px 0',
                          fontWeight: '500',
                        }}
                      >
                        Monthly Revenue
                      </p>
                      <p
                        style={{
                          fontSize: '36px',
                          fontWeight: 'bold',
                          color: '#8b5cf6',
                          margin: '0',
                          textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        }}
                      >
                        {formatCurrency(dashboardData.monthlyRevenue)}
                      </p>
                    </div>
                    <div
                      style={{
                        fontSize: '48px',
                        opacity: '0.8',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                      }}
                    >
                      💰
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: '14px',
                          color: '#6b7280',
                          margin: '0 0 8px 0',
                          fontWeight: '500',
                        }}
                      >
                        Avg. Response Time
                      </p>
                      <p
                        style={{
                          fontSize: '36px',
                          fontWeight: 'bold',
                          color: '#f59e0b',
                          margin: '0',
                          textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        }}
                      >
                        2.4h
                      </p>
                    </div>
                    <div
                      style={{
                        fontSize: '48px',
                        opacity: '0.8',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                      }}
                    >
                      ⚡
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h3
                style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '24px',
                  textAlign: 'center',
                }}
              >
                🚀 Quick Actions
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                }}
              >
                <button
                  onClick={() => setActiveTab('rfx')}
                  style={{
                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                  }}
                >
                  📋 FreightFlow RFx Center
                </button>
                <button
                  onClick={() => setActiveTab('shippers')}
                  style={{
                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                  }}
                >
                  🏢 Manage Shippers
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  style={{
                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                  }}
                >
                  📈 View Analytics
                </button>
              </div>
            </div>
          </div>
        )}

        {/* RFx Response Center Tab */}
        {activeTab === 'rfx' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 16px 0',
                  textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                }}
              >
                📋 FreightFlow RFx Response Center
              </h2>
              <p
                style={{
                  fontSize: '18px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: 0,
                }}
              >
                Intelligent bid generation for RFB, RFQ, RFP, and RFI requests
                with live market intelligence
              </p>
            </div>
            <RFxResponseDashboard embedded={true} />
          </div>
        )}

        {/* Shipper Management Tab */}
        {activeTab === 'shippers' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
            }}
          >
            <h2
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: 'white',
                margin: '0 0 16px 0',
                textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              }}
            >
              🏢 Shipper Management
            </h2>
            <p
              style={{
                fontSize: '18px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
              }}
            >
              Comprehensive shipper relationship management tools coming soon!
            </p>
          </div>
        )}

        {/* Quick Quotes Tab - ENHANCED INTEGRATION */}
        {activeTab === 'quotes' && (
          <div className='rounded-xl bg-white p-6 shadow-sm'>
            <div className='mb-6 flex items-center justify-between'>
              <div>
                <h3 className='mb-2 flex items-center text-lg font-semibold text-gray-900'>
                  <span className='mr-3 text-2xl'>💰</span>
                  Broker Quote Generator
                </h3>
                <p className='text-gray-600'>
                  Generate competitive quotes instantly and send directly to
                  shippers
                </p>
              </div>
              <div className='flex gap-3'>
                <button
                  onClick={() => window.open('/quoting', '_blank')}
                  className='flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-md transition-colors hover:bg-blue-700 hover:shadow-lg'
                >
                  🔗 Full Quoting System
                </button>
                <div className='flex items-center gap-2 rounded-lg bg-green-100 px-3 py-2 text-sm font-semibold text-green-800'>
                  <span className='h-2 w-2 animate-pulse rounded-full bg-green-500'></span>
                  Live Integration
                </div>
              </div>
            </div>

            {/* INTEGRATED QUOTING INTERFACE */}
            <BrokerQuoteInterface
              user={user}
              onQuoteGenerated={(quote) => {
                console.log('📧 Quote generated and sent:', quote);
                // Future: Add to broker dashboard metrics
                // Future: Trigger email notification
                // Future: Update broker performance stats
              }}
            />
          </div>
        )}

        {/* Tools Tab */}
        {activeTab === 'tools' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: 'white',
                margin: '0 0 32px 0',
                textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                textAlign: 'center',
              }}
            >
              🛠️ Broker Tools
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '24px',
              }}
            >
              {/* Freight Class Calculator */}
              <div>
                <FreightClassCalculator
                  embedded={false}
                  title='Freight Class Calculator'
                />
              </div>

              {/* Additional Tools */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    marginBottom: '20px',
                    fontSize: '18px',
                  }}
                >
                  ⚡ RFx Integration Tools
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        color: 'white',
                        fontWeight: '600',
                        marginBottom: '8px',
                        fontSize: '16px',
                      }}
                    >
                      📦 Freight Class for RFx
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '14px',
                        marginBottom: '12px',
                      }}
                    >
                      Automatically determine freight class for accurate RFQ,
                      RFB, RFP, and RFI responses
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '12px',
                      }}
                    >
                      ✓ Integrated with RFx Response System
                      <br />
                      ✓ NMFC database lookup
                      <br />✓ Commodity classification
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        color: 'white',
                        fontWeight: '600',
                        marginBottom: '8px',
                        fontSize: '16px',
                      }}
                    >
                      🎯 Quote Enhancement
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '14px',
                        marginBottom: '12px',
                      }}
                    >
                      Enhance quotes with accurate freight classification for
                      competitive bidding
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '12px',
                      }}
                    >
                      ✓ Connected to Broker Box
                      <br />
                      ✓ Integrated quoting workflow
                      <br />✓ Real-time rate optimization
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
            }}
          >
            <h2
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: 'white',
                margin: '0 0 16px 0',
                textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              }}
            >
              📈 Performance Analytics
            </h2>
            <p
              style={{
                fontSize: '18px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
              }}
            >
              Advanced analytics and performance insights coming soon!
            </p>
          </div>
        )}

        {/* Loadboard Tab */}
        {activeTab === 'loadboard' && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            {/* Loadboard Header */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(15px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: 'white',
                    margin: 0,
                  }}
                >
                  🚛 Broker Loadboard
                </h2>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    margin: '4px 0 0 0',
                    fontSize: '14px',
                  }}
                >
                  Post loads, assign dispatchers, and track shipments
                </p>
              </div>
              <button
                onClick={() => setShowLoadForm(!showLoadForm)}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #f97316, #ea580c)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                + Post New Load
              </button>
            </div>

            {/* Load Posting Form */}
            {showLoadForm && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <h3
                  style={{
                    color: '#1f2937',
                    marginBottom: '20px',
                    fontSize: '18px',
                    fontWeight: '600',
                  }}
                >
                  📝 Post New Load
                </h3>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '16px',
                    marginBottom: '20px',
                  }}
                >
                  {/* Load Type */}
                  <div>
                    <label
                      style={{
                        color: '#1f2937',
                        display: 'block',
                        marginBottom: '4px',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      Load Type *
                    </label>
                    <select
                      value={newLoad.type || 'FTL'}
                      onChange={(e) =>
                        setNewLoad({
                          ...newLoad,
                          type: e.target.value as 'LTL' | 'FTL' | 'Specialized',
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
                      <option value='FTL'>Full Truckload (FTL)</option>
                      <option value='LTL'>Less than Truckload (LTL)</option>
                      <option value='Specialized'>Specialized</option>
                    </select>
                  </div>

                  {/* Origin */}
                  <div>
                    <label
                      style={{
                        color: 'white',
                        display: 'block',
                        marginBottom: '4px',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      Origin *
                    </label>
                    <input
                      type='text'
                      placeholder='City, State, ZIP'
                      value={`${newLoad.origin?.city || ''}, ${newLoad.origin?.state || ''} ${newLoad.origin?.zipCode || ''}`
                        .trim()
                        .replace(/^,\s*/, '')}
                      onChange={(e) => {
                        const parts = e.target.value.split(',');
                        setNewLoad({
                          ...newLoad,
                          origin: {
                            city: parts[0]?.trim() || '',
                            state: parts[1]?.trim().split(' ')[0] || '',
                            zipCode: parts[1]?.trim().split(' ')[1] || '',
                          },
                        });
                      }}
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

                  {/* Destination */}
                  <div>
                    <label
                      style={{
                        color: 'white',
                        display: 'block',
                        marginBottom: '4px',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      Destination *
                    </label>
                    <input
                      type='text'
                      placeholder='City, State, ZIP'
                      value={`${newLoad.destination?.city || ''}, ${newLoad.destination?.state || ''} ${newLoad.destination?.zipCode || ''}`
                        .trim()
                        .replace(/^,\s*/, '')}
                      onChange={(e) => {
                        const parts = e.target.value.split(',');
                        setNewLoad({
                          ...newLoad,
                          destination: {
                            city: parts[0]?.trim() || '',
                            state: parts[1]?.trim().split(' ')[0] || '',
                            zipCode: parts[1]?.trim().split(' ')[1] || '',
                          },
                        });
                      }}
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

                  {/* Pickup Date */}
                  <div>
                    <label
                      style={{
                        color: 'white',
                        display: 'block',
                        marginBottom: '4px',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      Pickup Date *
                    </label>
                    <input
                      type='date'
                      value={newLoad.pickupDate || ''}
                      onChange={(e) =>
                        setNewLoad({ ...newLoad, pickupDate: e.target.value })
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
                    />
                  </div>

                  {/* Delivery Date */}
                  <div>
                    <label
                      style={{
                        color: 'white',
                        display: 'block',
                        marginBottom: '4px',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      Delivery Date *
                    </label>
                    <input
                      type='date'
                      value={newLoad.deliveryDate || ''}
                      onChange={(e) =>
                        setNewLoad({ ...newLoad, deliveryDate: e.target.value })
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
                    />
                  </div>

                  {/* Rate */}
                  <div>
                    <label
                      style={{
                        color: 'white',
                        display: 'block',
                        marginBottom: '4px',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      Rate (USD) *
                    </label>
                    <input
                      type='number'
                      placeholder='1000'
                      value={newLoad.rate || ''}
                      onChange={(e) =>
                        setNewLoad({
                          ...newLoad,
                          rate: parseFloat(e.target.value),
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
                    />
                  </div>
                </div>

                {/* Additional Fields based on Load Type */}
                {newLoad.type === 'LTL' && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '16px',
                      marginBottom: '20px',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          color: 'white',
                          display: 'block',
                          marginBottom: '4px',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        Weight (lbs)
                      </label>
                      <input
                        type='number'
                        value={newLoad.weight || ''}
                        onChange={(e) =>
                          setNewLoad({
                            ...newLoad,
                            weight: parseFloat(e.target.value),
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
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          color: 'white',
                          display: 'block',
                          marginBottom: '4px',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        Pallets
                      </label>
                      <input
                        type='number'
                        value={newLoad.pallets || ''}
                        onChange={(e) =>
                          setNewLoad({
                            ...newLoad,
                            pallets: parseInt(e.target.value),
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
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          color: 'white',
                          display: 'block',
                          marginBottom: '4px',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        Freight Class
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <select
                          value={newLoad.freightClass || ''}
                          onChange={(e) =>
                            setNewLoad({
                              ...newLoad,
                              freightClass: parseFloat(e.target.value),
                            })
                          }
                          style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '14px',
                          }}
                        >
                          <option value=''>Select Class</option>
                          {[
                            50, 55, 60, 65, 70, 77.5, 85, 92.5, 100, 110, 125,
                            150, 175, 200, 250, 300, 400, 500,
                          ].map((cls) => (
                            <option key={cls} value={cls}>
                              {cls}
                            </option>
                          ))}
                        </select>
                        <button
                          type='button'
                          onClick={() =>
                            setSelectedLoad({
                              ...newLoad,
                              id: 'NEW',
                            } as LoadPosting)
                          }
                          style={{
                            padding: '12px 16px',
                            background:
                              'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '14px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          📦 Calculator
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {(newLoad.type === 'FTL' || newLoad.type === 'Specialized') && (
                  <div style={{ marginBottom: '20px' }}>
                    <label
                      style={{
                        color: 'white',
                        display: 'block',
                        marginBottom: '4px',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      Equipment Type
                    </label>
                    <select
                      value={newLoad.equipment || ''}
                      onChange={(e) =>
                        setNewLoad({ ...newLoad, equipment: e.target.value })
                      }
                      style={{
                        width: '100%',
                        maxWidth: '300px',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '14px',
                      }}
                    >
                      <option value=''>Select Equipment</option>
                      <option value='Dry Van'>Dry Van</option>
                      <option value='Refrigerated'>Refrigerated</option>
                      <option value='Flatbed'>Flatbed</option>
                      <option value='Step Deck'>Step Deck</option>
                      <option value='Power Only'>Power Only</option>
                      <option value='Box Truck'>Box Truck</option>
                    </select>
                  </div>
                )}

                {/* Commodity and Instructions */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                    marginBottom: '20px',
                  }}
                >
                  <div>
                    <label
                      style={{
                        color: 'white',
                        display: 'block',
                        marginBottom: '4px',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      Commodity
                    </label>
                    <input
                      type='text'
                      placeholder='e.g., Auto Parts, Electronics'
                      value={newLoad.commodity || ''}
                      onChange={(e) =>
                        setNewLoad({ ...newLoad, commodity: e.target.value })
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
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        color: 'white',
                        display: 'block',
                        marginBottom: '4px',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      Special Instructions
                    </label>
                    <input
                      type='text'
                      placeholder='e.g., Temperature controlled, Hazmat'
                      value={newLoad.specialInstructions || ''}
                      onChange={(e) =>
                        setNewLoad({
                          ...newLoad,
                          specialInstructions: e.target.value,
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
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={createLoad}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    📝 Post Load
                  </button>
                  <button
                    onClick={() => setShowLoadForm(false)}
                    style={{
                      padding: '12px 24px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Active Loads Display */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(15px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h3
                style={{
                  color: '#1f2937',
                  marginBottom: '20px',
                  fontSize: '18px',
                  fontWeight: '600',
                }}
              >
                📋 Active Loads ({loads.length})
              </h3>

              {loads.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.7)',
                    padding: '40px',
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                    📦
                  </div>
                  <div>
                    No loads posted yet. Create your first load posting above.
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {loads.map((load) => (
                    <div
                      key={load.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(10px)',
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
                            <h4
                              style={{
                                color: '#1f2937',
                                margin: 0,
                                fontSize: '16px',
                                fontWeight: '600',
                              }}
                            >
                              {load.id} - {load.type}
                            </h4>
                            <div
                              style={{
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '600',
                                background: getStatusColor(load.status),
                                color: 'white',
                              }}
                            >
                              {load.status.toUpperCase()}
                            </div>
                          </div>
                          <div
                            style={{
                              color: '#374151',
                              marginBottom: '8px',
                              fontSize: '14px',
                            }}
                          >
                            🏁 {load.origin.city}, {load.origin.state} →{' '}
                            {load.destination.city}, {load.destination.state}
                          </div>
                          <div
                            style={{
                              color: '#6b7280',
                              fontSize: '13px',
                              marginBottom: '8px',
                            }}
                          >
                            📅 Pickup: {load.pickupDate} | Delivery:{' '}
                            {load.deliveryDate}
                          </div>
                          {load.weight && (
                            <div style={{ color: '#6b7280', fontSize: '13px' }}>
                              ⚖️ {load.weight} lbs
                              {load.pallets && ` | 📦 ${load.pallets} pallets`}
                              {load.freightClass &&
                                ` | Class ${load.freightClass}`}
                            </div>
                          )}
                          {load.equipment && (
                            <div style={{ color: '#6b7280', fontSize: '13px' }}>
                              🚛 {load.equipment}
                            </div>
                          )}
                          {load.specialInstructions && (
                            <div
                              style={{
                                color: '#dc2626',
                                fontSize: '13px',
                                marginTop: '4px',
                                fontWeight: '500',
                              }}
                            >
                              ⚠️ {load.specialInstructions}
                            </div>
                          )}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div
                            style={{
                              color: '#059669',
                              fontSize: '18px',
                              fontWeight: '600',
                              marginBottom: '4px',
                            }}
                          >
                            {formatCurrency(load.rate)}
                          </div>
                          <div style={{ color: '#6b7280', fontSize: '12px' }}>
                            Posted by {load.postedBy}
                          </div>
                        </div>
                      </div>

                      {/* Dispatcher Assignment */}
                      {load.status === 'posted' && (
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.7)',
                            borderRadius: '8px',
                            padding: '16px',
                            marginTop: '16px',
                            border: '1px solid rgba(0, 0, 0, 0.1)',
                          }}
                        >
                          <h5
                            style={{
                              color: '#1f2937',
                              margin: '0 0 12px 0',
                              fontSize: '14px',
                              fontWeight: '600',
                            }}
                          >
                            👥 Assign Dispatcher
                          </h5>
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns:
                                'repeat(auto-fit, minmax(200px, 1fr))',
                              gap: '12px',
                            }}
                          >
                            {dispatchers.map((dispatcher) => (
                              <div
                                key={dispatcher.id}
                                style={{
                                  background: 'rgba(255, 255, 255, 0.8)',
                                  borderRadius: '6px',
                                  padding: '12px',
                                  border: '1px solid rgba(0, 0, 0, 0.1)',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease',
                                }}
                                onClick={() =>
                                  assignDispatcher(load.id, dispatcher.id)
                                }
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background =
                                    'rgba(255, 255, 255, 0.95)';
                                  e.currentTarget.style.transform =
                                    'translateY(-2px)';
                                  e.currentTarget.style.boxShadow =
                                    '0 4px 12px rgba(0, 0, 0, 0.15)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background =
                                    'rgba(255, 255, 255, 0.8)';
                                  e.currentTarget.style.transform =
                                    'translateY(0)';
                                  e.currentTarget.style.boxShadow = 'none';
                                }}
                              >
                                <div
                                  style={{
                                    color: '#1f2937',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    marginBottom: '4px',
                                  }}
                                >
                                  {dispatcher.name}
                                </div>
                                <div
                                  style={{
                                    color: '#374151',
                                    fontSize: '12px',
                                    marginBottom: '4px',
                                  }}
                                >
                                  {dispatcher.region} | ⭐ {dispatcher.rating}
                                </div>
                                <div
                                  style={{ color: '#6b7280', fontSize: '11px' }}
                                >
                                  {dispatcher.activeLoads} active loads
                                </div>
                                <div
                                  style={{ color: '#6b7280', fontSize: '11px' }}
                                >
                                  Specialties:{' '}
                                  {dispatcher.specialties.join(', ')}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Assigned Dispatcher Info */}
                      {load.assignedDispatcher && (
                        <div
                          style={{
                            background: 'rgba(16, 185, 129, 0.15)',
                            border: '1px solid #10b981',
                            borderRadius: '8px',
                            padding: '12px',
                            marginTop: '16px',
                          }}
                        >
                          <div
                            style={{
                              color: '#065f46',
                              fontWeight: '600',
                              fontSize: '14px',
                            }}
                          >
                            ✅ Assigned to: {load.assignedDispatcher}
                          </div>
                          {load.assignedCarrier && (
                            <div
                              style={{
                                color: '#374151',
                                fontSize: '13px',
                                marginTop: '4px',
                              }}
                            >
                              🚛 Carrier: {load.assignedCarrier}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Freight Class Calculator Modal */}
      {selectedLoad && (
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
            padding: '20px',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <h3 style={{ color: 'white', margin: 0, fontSize: '18px' }}>
                Freight Class Calculator{' '}
                {selectedLoad.id !== 'NEW'
                  ? `for Load ${selectedLoad.id}`
                  : 'for New Load'}
              </h3>
              <button
                onClick={() => setSelectedLoad(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                }}
              >
                ✕ Close
              </button>
            </div>

            <FreightClassCalculator
              embedded={false}
              title='Determine Freight Class'
              currentValue={selectedLoad.freightClass?.toString() || ''}
              onClassSelected={(freightClass, details) => {
                if (selectedLoad.id === 'NEW') {
                  // Update new load form
                  setNewLoad({ ...newLoad, freightClass: freightClass });
                } else {
                  // Update existing load
                  setLoads(
                    loads.map((load) =>
                      load.id === selectedLoad.id
                        ? { ...load, freightClass: freightClass }
                        : load
                    )
                  );
                }
                setSelectedLoad(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BrokerOperationsPage;
