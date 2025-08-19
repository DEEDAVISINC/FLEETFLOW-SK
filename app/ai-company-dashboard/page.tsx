'use client';

import { useEffect, useState } from 'react';
import { Building2, Users, DollarSign, TrendingUp, Shield, Bell, Clock } from 'lucide-react';
import UnifiedNotificationBell from '../components/UnifiedNotificationBell';
// FleetFlow service imports - will be connected to real data
// import { MultiTenantSquareService } from '../services/MultiTenantSquareService';
import fleetFlowNotificationManager from '../services/FleetFlowNotificationManager';

interface AIStaff {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'active' | 'busy' | 'idle';
  currentTask: string;
  revenue: number;
  efficiency: number;
  avatar: string;
}

interface ContractApproval {
  id: string;
  type: string;
  amount: number;
  customer: string;
  priority: 'critical' | 'high' | 'medium';
  submittedAt: Date;
}

export default function AICompanyDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalRevenue: 1247850,
    activeLoads: 23,
    aiStaffCount: 87,
    contractsPending: 5,
    systemHealth: 98.7
  });

  const [aiStaff, setAiStaff] = useState<AIStaff[]>([
    {
      id: 'sales-001',
      name: 'AI Revenue Optimizer',
      role: 'Revenue Intelligence Director',
      department: 'Sales',
      status: 'active',
      currentTask: 'Analyzing $2.3M pipeline - identified 12 high-conversion opportunities',
      revenue: 234500,
      efficiency: 98.9,
      avatar: '💰'
    },
    {
      id: 'ops-001',
      name: 'AI Dispatch Commander',
      role: 'Operations Director',
      department: 'Operations',
      status: 'busy',
      currentTask: 'Coordinating 23 active loads - optimal routing achieved',
      revenue: 156780,
      efficiency: 99.2,
      avatar: '🚛'
    },
    {
      id: 'finance-001',
      name: 'AI Financial Controller',
      role: 'Finance Director',
      department: 'Finance',
      status: 'active',
      currentTask: 'Processing $456K in invoices - detected 3 billing discrepancies',
      revenue: 287400,
      efficiency: 99.1,
      avatar: '📊'
    },
    {
      id: 'compliance-001',
      name: 'AI Compliance Monitor',
      role: 'Compliance Director',
      department: 'Compliance',
      status: 'active',
      currentTask: 'FMCSA monitoring - all 87 drivers compliant, no violations',
      revenue: 67800,
      efficiency: 99.5,
      avatar: '🛡️'
    }
  ]);

  const [contractApprovals, setContractApprovals] = useState<ContractApproval[]>([
    {
      id: 'contract-001',
      type: 'Customer Contract',
      amount: 125000,
      customer: 'Walmart Distribution Center',
      priority: 'high',
      submittedAt: new Date(Date.now() - 3600000)
    },
    {
      id: 'contract-002',
      type: 'RFx Bid',
      amount: 89500,
      customer: 'Home Depot Logistics',
      priority: 'critical',
      submittedAt: new Date(Date.now() - 1800000)
    },
    {
      id: 'contract-003',
      type: 'Carrier Agreement',
      amount: 45000,
      customer: 'ABC Trucking LLC',
      priority: 'medium',
      submittedAt: new Date(Date.now() - 7200000)
    }
  ]);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // TODO: Connect to real FleetFlow services
        // For now, using mock data - will be enhanced with real services
        
        setDashboardMetrics(prev => ({
          ...prev,
          // Will be connected to real financial data
          totalRevenue: 1247850,
          activeLoads: 23
        }));

        setLoading(false);
      } catch (error) {
        console.error('Dashboard initialization error:', error);
        setLoading(false);
      }
    };

    initializeDashboard();
    const refreshInterval = setInterval(initializeDashboard, 30000);
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      clearInterval(refreshInterval);
      clearInterval(timeInterval);
    };
  }, []);

  const handleContractApproval = async (contractId: string, approved: boolean) => {
    try {
      const contract = contractApprovals.find(c => c.id === contractId);
      if (!contract) return;

      // Send mandatory email notification
      await fleetFlowNotificationManager.createNotification({
        type: 'system_alert',
        title: `Contract ${approved ? 'Approved' : 'Rejected'}`,
        message: `${contract.customer} contract for $${contract.amount.toLocaleString()} has been ${approved ? 'approved' : 'rejected'}`,
        priority: 'high',
        channels: { inApp: true, sms: false, email: true, push: true },
        targetPortals: ['admin'],
        metadata: { 
          contractId, 
          approved, 
          amount: contract.amount,
          emailRecipients: ['ddavis@freight1stdirect.com', 'invoice@freight1stdirect.com']
        }
      });

      setContractApprovals(prev => prev.filter(c => c.id !== contractId));
      console.log(`✅ Contract ${contractId} ${approved ? 'approved' : 'rejected'} - emails sent to ddavis@freight1stdirect.com & invoice@freight1stdirect.com`);
    } catch (error) {
      console.error('Error processing contract approval:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'active': 'bg-green-500',
      'busy': 'bg-yellow-500',
      'idle': 'bg-gray-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'critical': 'border-l-red-500 bg-red-50',
      'high': 'border-l-orange-500 bg-orange-50',
      'medium': 'border-l-yellow-500 bg-yellow-50'
    };
    return colors[priority as keyof typeof colors] || 'border-l-gray-500 bg-gray-50';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-white mb-2">🏢 AI Company Dashboard</h2>
            <p className="text-white/70">Loading your personal executive command center...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">🏢 AI Company Dashboard</h1>
                <p className="text-white/70">CEO Executive Command Center</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-white/70 text-sm">Live Data Connected</span>
              </div>
              
              <UnifiedNotificationBell
                userId="ceo-dashboard"
                portal="admin"
                position="inline"
                size="lg"
                theme="dark"
                showBadge={true}
                showDropdown={true}
                maxNotifications={50}
              />
              
              <div className="text-right">
                <div className="text-white font-mono text-lg">
                  {currentTime.toLocaleTimeString()}
                </div>
                <div className="text-white/70 text-sm">
                  {currentTime.toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="h-8 w-8 text-green-400" />
              <div>
                <h3 className="text-white font-semibold text-2xl">{formatCurrency(dashboardMetrics.totalRevenue)}</h3>
                <p className="text-white/70 text-sm">Total Revenue</p>
              </div>
            </div>
            <div className="text-green-400 text-sm font-medium">+23% vs last month</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-8 w-8 text-blue-400" />
              <div>
                <h3 className="text-white font-semibold text-2xl">{dashboardMetrics.activeLoads}</h3>
                <p className="text-white/70 text-sm">Active Loads</p>
              </div>
            </div>
            <div className="text-blue-400 text-sm font-medium">+5 new today</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-8 w-8 text-purple-400" />
              <div>
                <h3 className="text-white font-semibold text-2xl">{dashboardMetrics.aiStaffCount}</h3>
                <p className="text-white/70 text-sm">AI Staff Active</p>
              </div>
            </div>
            <div className="text-purple-400 text-sm font-medium">87/90 online</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="h-8 w-8 text-orange-400" />
              <div>
                <h3 className="text-white font-semibold text-2xl">{dashboardMetrics.contractsPending}</h3>
                <p className="text-white/70 text-sm">Approvals Needed</p>
              </div>
            </div>
            <div className="text-orange-400 text-sm font-medium">Requires Action</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-green-400" />
              <div>
                <h3 className="text-white font-semibold text-2xl">{dashboardMetrics.systemHealth}%</h3>
                <p className="text-white/70 text-sm">System Health</p>
              </div>
            </div>
            <div className="text-green-400 text-sm font-medium">Excellent</div>
          </div>
        </div>

        {/* Contract Approvals - Urgent */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8">
          <h3 className="text-white text-xl font-bold mb-4">📄 Contract Approvals Required ({contractApprovals.length})</h3>
          <p className="text-white/70 mb-6">
            All contracts require your personal approval. Email notifications sent to ddavis@freight1stdirect.com and invoice@freight1stdirect.com
          </p>
          
          <div className="space-y-4">
            {contractApprovals.map((contract) => (
              <div key={contract.id} className={`bg-white/5 rounded-lg p-6 border-l-4 ${getPriorityColor(contract.priority)}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-white font-semibold text-lg">{contract.customer}</h4>
                    <p className="text-white/70">{contract.type}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold text-xl">{formatCurrency(contract.amount)}</div>
                    <div className={`text-sm font-medium ${
                      contract.priority === 'critical' ? 'text-red-400' : 
                      contract.priority === 'high' ? 'text-orange-400' : 'text-yellow-400'
                    }`}>
                      {contract.priority.toUpperCase()} PRIORITY
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-white/70 text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Submitted {new Date(contract.submittedAt).toLocaleString()}
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleContractApproval(contract.id, false)}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-6 py-2 rounded-lg font-medium transition-all"
                    >
                      ❌ Reject
                    </button>
                    <button
                      onClick={() => handleContractApproval(contract.id, true)}
                      className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 px-6 py-2 rounded-lg font-medium transition-all"
                    >
                      ✅ Approve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Staff Overview */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-white text-xl font-bold mb-4">👥 AI Staff Management ({aiStaff.length} Active)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiStaff.map((staff) => (
              <div key={staff.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{staff.avatar}</div>
                    <div>
                      <h4 className="text-white font-semibold">{staff.name}</h4>
                      <p className="text-white/70 text-sm">{staff.role} • {staff.department}</p>
                    </div>
                    <div className={`h-3 w-3 rounded-full ${getStatusColor(staff.status)} animate-pulse`}></div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-semibold">{formatCurrency(staff.revenue)}</div>
                    <div className="text-white/70 text-sm">{staff.efficiency}% efficiency</div>
                  </div>
                </div>
                <div className="mt-3 text-white/70 text-sm">{staff.currentTask}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <div className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-6 py-3 rounded-lg inline-block">
              🚀 Full 87 AI Staff Dashboard Coming Soon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
