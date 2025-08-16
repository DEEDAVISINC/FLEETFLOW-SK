'use client';

import {
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Mail,
  MapPin,
  Phone,
  Target,
  TrendingUp,
  Truck,
  User,
} from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentAgent, setCurrentAgent] = useState<BrokerAgent | null>(null);
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

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
        background:
          'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%)',
        padding: '20px',
      }}
    >
      {/* Navigation Header */}
      <div style={{ marginBottom: '30px' }}>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <User size={24} style={{ color: 'white' }} />
            </div>
            <div>
              <h1
                style={{
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  margin: 0,
                }}
              >
                Agent Portal - {session?.firstName} {session?.lastName}
              </h1>
              <div
                style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}
              >
                {currentAgent?.position} | Wilson Freight Brokerage
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link
              href='/dashboard'
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'background 0.3s ease',
              }}
            >
              🏠 Main Dashboard
            </Link>
            <Link
              href='/broker/dashboard'
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'background 0.3s ease',
              }}
            >
              🏢 Brokerage Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ marginBottom: '30px' }}>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '8px',
            display: 'flex',
            gap: '8px',
          }}
        >
          {[
            { id: 'dashboard', label: '📊 Dashboard', icon: BarChart3 },
            { id: 'loads', label: '🚚 My Loads', icon: Truck },
            { id: 'tasks', label: '✓ Tasks', icon: FileText },
            { id: 'performance', label: '🎯 Performance', icon: Target },
            { id: 'profile', label: '👤 Profile', icon: User },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '12px',
                background:
                  activeTab === tab.id
                    ? 'linear-gradient(135deg, #f97316, #ea580c)'
                    : 'transparent',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {/* Performance KPIs */}
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
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <TrendingUp size={20} />
              Performance Overview
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    color: '#10b981',
                    fontSize: '28px',
                    fontWeight: 'bold',
                  }}
                >
                  {currentAgent?.performanceMetrics.loadsHandled || 52}
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Total Loads
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    color: '#3b82f6',
                    fontSize: '28px',
                    fontWeight: 'bold',
                  }}
                >
                  $
                  {(
                    currentAgent?.performanceMetrics.revenue || 185000
                  ).toLocaleString()}
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Revenue
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    color: '#f59e0b',
                    fontSize: '28px',
                    fontWeight: 'bold',
                  }}
                >
                  {currentAgent?.performanceMetrics.margin || 16.2}%
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Avg Margin
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    color: '#8b5cf6',
                    fontSize: '28px',
                    fontWeight: 'bold',
                  }}
                >
                  {currentAgent?.performanceMetrics.customerRating || 4.8}
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Rating
                </div>
              </div>
            </div>
          </div>

          {/* Active Loads Summary */}
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
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <Truck size={20} />
              Active Loads
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {agentLoads.slice(0, 3).map((load) => (
                <div
                  key={load.id}
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
                        fontWeight: '600',
                        fontSize: '14px',
                      }}
                    >
                      {load.loadNumber}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '12px',
                      }}
                    >
                      {load.origin} → {load.destination}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        color: getStatusColor(load.status),
                        fontSize: '12px',
                        fontWeight: '600',
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '4px 8px',
                        borderRadius: '12px',
                      }}
                    >
                      {load.status.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
            <h3
              style={{
                color: 'white',
                fontSize: '18px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <Clock size={20} />
              Urgent Tasks ({highPriorityTasks.length})
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {highPriorityTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '15px',
                    borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
                  }}
                >
                  <div
                    style={{
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '14px',
                      marginBottom: '4px',
                    }}
                  >
                    {task.title}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Goals */}
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
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <Target size={20} />
              Monthly Goals
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                  }}
                >
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                    }}
                  >
                    Loads (12/15)
                  </span>
                  <span
                    style={{
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    80%
                  </span>
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    height: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      height: '100%',
                      width: '80%',
                      borderRadius: '8px',
                    }}
                  />
                </div>
              </div>
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                  }}
                >
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                    }}
                  >
                    Revenue ($45K/$50K)
                  </span>
                  <span
                    style={{
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    90%
                  </span>
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    height: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      height: '100%',
                      width: '90%',
                      borderRadius: '8px',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* My Loads Tab */}
      {activeTab === 'loads' && (
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
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
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
              style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
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
                      Due: {new Date(task.dueDate).toLocaleDateString()} at{' '}
                      {new Date(task.dueDate).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <button
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
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
              style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
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
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
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
              Performance Metrics
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
              }}
            >
              <div
                style={{
                  textAlign: 'center',
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                }}
              >
                <div
                  style={{
                    color: '#10b981',
                    fontSize: '32px',
                    fontWeight: 'bold',
                  }}
                >
                  98.5%
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  On-Time Delivery
                </div>
              </div>
              <div
                style={{
                  textAlign: 'center',
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                }}
              >
                <div
                  style={{
                    color: '#3b82f6',
                    fontSize: '32px',
                    fontWeight: 'bold',
                  }}
                >
                  0.5h
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Avg Response Time
                </div>
              </div>
              <div
                style={{
                  textAlign: 'center',
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                }}
              >
                <div
                  style={{
                    color: '#f59e0b',
                    fontSize: '32px',
                    fontWeight: 'bold',
                  }}
                >
                  4.8
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Customer Rating
                </div>
              </div>
              <div
                style={{
                  textAlign: 'center',
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                }}
              >
                <div
                  style={{
                    color: '#8b5cf6',
                    fontSize: '32px',
                    fontWeight: 'bold',
                  }}
                >
                  16.2%
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Avg Margin
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
              Recent Activity
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
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
                {
                  date: '2024-01-11',
                  action: 'Documentation',
                  details: 'BOL uploaded',
                  icon: '📄',
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ fontSize: '20px' }}>{activity.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      {activity.action}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '12px',
                      }}
                    >
                      {activity.details}
                    </div>
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '12px',
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
              Access Permissions
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
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
                {
                  permission: 'Generate Reports',
                  enabled: (session?.permissions as any)?.canGenerateReports,
                },
                {
                  permission: 'Access Financials',
                  enabled: (session?.permissions as any)?.canAccessFinancials,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                  }}
                >
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                    }}
                  >
                    {item.permission}
                  </span>
                  {item.enabled ? (
                    <CheckCircle size={16} style={{ color: '#10b981' }} />
                  ) : (
                    <AlertCircle size={16} style={{ color: '#ef4444' }} />
                  )}
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: '20px',
                padding: '15px',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '8px',
              }}
            >
              <div
                style={{
                  color: '#3b82f6',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Contract Limits
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '12px',
                  marginTop: '4px',
                }}
              >
                Max Value: $
                {(
                  (session?.permissions as any)?.maxContractValue || 50000
                ).toLocaleString()}
              </div>
              <div
                style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px' }}
              >
                Approval Required: $
                {(
                  (session?.permissions as any)?.requiresApprovalOver || 25000
                ).toLocaleString()}
                +
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && currentAgent && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
          }}
        >
          {/* Personal Information */}
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
              Personal Information
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <User size={18} style={{ color: '#3b82f6' }} />
                <div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '600',
                    }}
                  >
                    {currentAgent.firstName} {currentAgent.lastName}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                    }}
                  >
                    {currentAgent.position}
                  </div>
                </div>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <Mail size={18} style={{ color: '#10b981' }} />
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  {currentAgent.email}
                </div>
              </div>
              {currentAgent.phone && (
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  <Phone size={18} style={{ color: '#f59e0b' }} />
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                    }}
                  >
                    {currentAgent.phone}
                  </div>
                </div>
              )}
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <Calendar size={18} style={{ color: '#8b5cf6' }} />
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Hired: {new Date(currentAgent.hiredDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Specializations & Territories */}
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
              Specializations & Territories
            </h3>
            <div style={{ marginBottom: '20px' }}>
              <h4
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '10px',
                }}
              >
                Equipment Types
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(session?.permissions as any)?.loadTypes?.map(
                  (type: string, index: number) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#10b981',
                        padding: '4px 12px',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      {type}
                    </div>
                  )
                )}
              </div>
            </div>
            <div>
              <h4
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '10px',
                }}
              >
                Territories
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(session?.permissions as any)?.territories?.map(
                  (territory: string, index: number) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(59, 130, 246, 0.2)',
                        color: '#3b82f6',
                        padding: '4px 12px',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      {territory}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
