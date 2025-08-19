'use client';

import {
  Bell,
  Building2,
  Clock,
  DollarSign,
  Shield,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
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
  const [activeTab, setActiveTab] = useState<'overview' | 'intelligence' | 'staff' | 'operations' | 'financial'>('overview');
  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalRevenue: 1247850,
    activeLoads: 23,
    aiStaffCount: 87,
    contractsPending: 5,
    systemHealth: 98.7,
  });

  // Enhanced Business Intelligence State
  const [businessIntelligence, setBusinessIntelligence] = useState({
    realtimePL: {
      revenue: 1247850,
      costs: 892340,
      grossProfit: 355510,
      netProfit: 285510,
      profitMargin: 22.9,
      growthRate: 23.4,
      burnRate: 45600,
      runway: 18.2 // months
    },
    marketIntelligence: {
      fuelPrice: 3.42,
      fuelTrend: 'up',
      marketCapacity: 'tight',
      competitorRates: {
        average: 2850,
        fleetflowPosition: 'above_average',
        advantage: 15.2
      },
      industryGrowth: 8.7
    },
    kpiAlerts: [
      {
        id: 'fuel-alert',
        type: 'warning',
        metric: 'Fuel Prices',
        message: 'Diesel prices up 8% this week - recommend rate adjustments',
        severity: 'medium',
        trend: 'increasing'
      },
      {
        id: 'profit-alert',
        type: 'success',
        metric: 'Profit Margin',
        message: 'Q4 profit margin exceeds target by 5.2%',
        severity: 'low',
        trend: 'positive'
      }
    ],
    predictiveAnalytics: {
      nextMonthRevenue: 1456890,
      nextMonthGrowth: 16.8,
      cashFlowForecast: [
        { month: 'Dec', projected: 285510, confidence: 94 },
        { month: 'Jan', projected: 334850, confidence: 89 },
        { month: 'Feb', projected: 389240, confidence: 85 },
        { month: 'Mar', projected: 445680, confidence: 82 }
      ],
      riskFactors: [
        { factor: 'Seasonal slowdown', probability: 35, impact: 'medium' },
        { factor: 'Fuel price volatility', probability: 68, impact: 'high' },
        { factor: 'Driver shortage', probability: 45, impact: 'medium' }
      ]
    }
  });

  const [aiStaff, setAiStaff] = useState<AIStaff[]>([
    {
      id: 'sales-001',
      name: 'AI Revenue Optimizer',
      role: 'Revenue Intelligence Director',
      department: 'Sales',
      status: 'active',
      currentTask:
        'Analyzing $2.3M pipeline - identified 12 high-conversion opportunities',
      revenue: 234500,
      efficiency: 98.9,
      avatar: '💰',
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
      avatar: '🚛',
    },
    {
      id: 'finance-001',
      name: 'AI Financial Controller',
      role: 'Finance Director',
      department: 'Finance',
      status: 'active',
      currentTask:
        'Processing $456K in invoices - detected 3 billing discrepancies',
      revenue: 287400,
      efficiency: 99.1,
      avatar: '📊',
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
      avatar: '🛡️',
    },
  ]);

  const [contractApprovals, setContractApprovals] = useState<
    ContractApproval[]
  >([
    {
      id: 'contract-001',
      type: 'Customer Contract',
      amount: 125000,
      customer: 'Walmart Distribution Center',
      priority: 'high',
      submittedAt: new Date(Date.now() - 3600000),
    },
    {
      id: 'contract-002',
      type: 'RFx Bid',
      amount: 89500,
      customer: 'Home Depot Logistics',
      priority: 'critical',
      submittedAt: new Date(Date.now() - 1800000),
    },
    {
      id: 'contract-003',
      type: 'Carrier Agreement',
      amount: 45000,
      customer: 'ABC Trucking LLC',
      priority: 'medium',
      submittedAt: new Date(Date.now() - 7200000),
    },
  ]);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // TODO: Connect to real FleetFlow services
        // For now, using mock data - will be enhanced with real services

        setDashboardMetrics((prev) => ({
          ...prev,
          // Will be connected to real financial data
          totalRevenue: 1247850,
          activeLoads: 23,
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

  const handleContractApproval = async (
    contractId: string,
    approved: boolean
  ) => {
    try {
      const contract = contractApprovals.find((c) => c.id === contractId);
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
          emailRecipients: [
            'ddavis@freight1stdirect.com',
            'invoice@freight1stdirect.com',
          ],
        },
      });

      setContractApprovals((prev) => prev.filter((c) => c.id !== contractId));
      console.log(
        `✅ Contract ${contractId} ${approved ? 'approved' : 'rejected'} - emails sent to ddavis@freight1stdirect.com & invoice@freight1stdirect.com`
      );
    } catch (error) {
      console.error('Error processing contract approval:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-500',
      busy: 'bg-yellow-500',
      idle: 'bg-gray-500',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      critical: 'border-l-red-500 bg-red-50',
      high: 'border-l-orange-500 bg-orange-50',
      medium: 'border-l-yellow-500 bg-yellow-50',
    };
    return (
      colors[priority as keyof typeof colors] || 'border-l-gray-500 bg-gray-50'
    );
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
        <div className='flex h-screen items-center justify-center'>
          <div className='text-center'>
            <div className='mx-auto mb-4 h-32 w-32 animate-spin rounded-full border-b-2 border-white'></div>
            <h2 className='mb-2 text-2xl font-bold text-white'>
              🏢 AI Company Dashboard
            </h2>
            <p className='text-white/70'>
              Loading your personal executive command center...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
      {/* Header */}
      <div className='border-b border-white/10 bg-black/20 backdrop-blur-md'>
        <div className='mx-auto max-w-7xl px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 p-3'>
                <Building2 className='h-8 w-8 text-white' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-white'>
                  🏢 AI Company Dashboard
                </h1>
                <p className='text-white/70'>CEO Executive Command Center</p>
              </div>
            </div>

            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <div className='h-3 w-3 animate-pulse rounded-full bg-green-500'></div>
                <span className='text-sm text-white/70'>
                  Live Data Connected
                </span>
              </div>

              <UnifiedNotificationBell
                userId='ceo-dashboard'
                portal='admin'
                position='inline'
                size='lg'
                theme='dark'
                showBadge={true}
                showDropdown={true}
                maxNotifications={50}
              />

              <div className='text-right'>
                <div className='font-mono text-lg text-white'>
                  {currentTime.toLocaleTimeString()}
                </div>
                <div className='text-sm text-white/70'>
                  {currentTime.toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

             {/* Navigation Tabs */}
       <div className='mx-auto max-w-7xl px-6 py-4'>
         <div className='flex gap-2 overflow-x-auto'>
           {[
             { id: 'overview', label: '📊 Executive Overview', desc: 'Key metrics & alerts' },
             { id: 'intelligence', label: '🧠 Business Intelligence', desc: 'Real-time P&L & analytics' },
             { id: 'staff', label: '👥 AI Staff (87)', desc: 'Workforce management' },
             { id: 'operations', label: '⚡ Operations Center', desc: 'Live workflows' },
             { id: 'financial', label: '💰 Financial Command', desc: 'Advanced financials' }
           ].map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex flex-col items-start gap-1 rounded-lg px-4 py-3 text-left transition-all ${
                 activeTab === tab.id
                   ? 'bg-white text-slate-900 shadow-lg'
                   : 'bg-white/10 text-white hover:bg-white/20'
               }`}
             >
               <span className='font-semibold text-sm'>{tab.label}</span>
               <span className={`text-xs ${activeTab === tab.id ? 'text-slate-600' : 'text-white/70'}`}>
                 {tab.desc}
               </span>
             </button>
           ))}
         </div>
       </div>

       {/* Main Dashboard Content */}
       <div className='mx-auto max-w-7xl px-6 pb-8'>
        
        {/* Executive Overview Tab */}
        {activeTab === 'overview' && (
          <div className='space-y-8'>
            {/* Key Metrics */}
        <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-5'>
          <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md'>
            <div className='mb-4 flex items-center gap-3'>
              <DollarSign className='h-8 w-8 text-green-400' />
              <div>
                <h3 className='text-2xl font-semibold text-white'>
                  {formatCurrency(dashboardMetrics.totalRevenue)}
                </h3>
                <p className='text-sm text-white/70'>Total Revenue</p>
              </div>
            </div>
            <div className='text-sm font-medium text-green-400'>
              +23% vs last month
            </div>
          </div>

          <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md'>
            <div className='mb-4 flex items-center gap-3'>
              <TrendingUp className='h-8 w-8 text-blue-400' />
              <div>
                <h3 className='text-2xl font-semibold text-white'>
                  {dashboardMetrics.activeLoads}
                </h3>
                <p className='text-sm text-white/70'>Active Loads</p>
              </div>
            </div>
            <div className='text-sm font-medium text-blue-400'>
              +5 new today
            </div>
          </div>

          <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md'>
            <div className='mb-4 flex items-center gap-3'>
              <Users className='h-8 w-8 text-purple-400' />
              <div>
                <h3 className='text-2xl font-semibold text-white'>
                  {dashboardMetrics.aiStaffCount}
                </h3>
                <p className='text-sm text-white/70'>AI Staff Active</p>
              </div>
            </div>
            <div className='text-sm font-medium text-purple-400'>
              87/90 online
            </div>
          </div>

          <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md'>
            <div className='mb-4 flex items-center gap-3'>
              <Bell className='h-8 w-8 text-orange-400' />
              <div>
                <h3 className='text-2xl font-semibold text-white'>
                  {dashboardMetrics.contractsPending}
                </h3>
                <p className='text-sm text-white/70'>Approvals Needed</p>
              </div>
            </div>
            <div className='text-sm font-medium text-orange-400'>
              Requires Action
            </div>
          </div>

          <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md'>
            <div className='mb-4 flex items-center gap-3'>
              <Shield className='h-8 w-8 text-green-400' />
              <div>
                <h3 className='text-2xl font-semibold text-white'>
                  {dashboardMetrics.systemHealth}%
                </h3>
                <p className='text-sm text-white/70'>System Health</p>
              </div>
            </div>
            <div className='text-sm font-medium text-green-400'>Excellent</div>
          </div>
        </div>

        {/* Contract Approvals - Urgent */}
        <div className='mb-8 rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md'>
          <h3 className='mb-4 text-xl font-bold text-white'>
            📄 Contract Approvals Required ({contractApprovals.length})
          </h3>
          <p className='mb-6 text-white/70'>
            All contracts require your personal approval. Email notifications
            sent to ddavis@freight1stdirect.com and invoice@freight1stdirect.com
          </p>

          <div className='space-y-4'>
            {contractApprovals.map((contract) => (
              <div
                key={contract.id}
                className={`rounded-lg border-l-4 bg-white/5 p-6 ${getPriorityColor(contract.priority)}`}
              >
                <div className='mb-4 flex items-center justify-between'>
                  <div>
                    <h4 className='text-lg font-semibold text-white'>
                      {contract.customer}
                    </h4>
                    <p className='text-white/70'>{contract.type}</p>
                  </div>
                  <div className='text-right'>
                    <div className='text-xl font-bold text-green-400'>
                      {formatCurrency(contract.amount)}
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        contract.priority === 'critical'
                          ? 'text-red-400'
                          : contract.priority === 'high'
                            ? 'text-orange-400'
                            : 'text-yellow-400'
                      }`}
                    >
                      {contract.priority.toUpperCase()} PRIORITY
                    </div>
                  </div>
                </div>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2 text-sm text-white/70'>
                    <Clock className='h-4 w-4' />
                    Submitted {new Date(contract.submittedAt).toLocaleString()}
                  </div>

                  <div className='flex gap-3'>
                    <button
                      onClick={() => handleContractApproval(contract.id, false)}
                      className='rounded-lg border border-red-500/30 bg-red-500/20 px-6 py-2 font-medium text-red-400 transition-all hover:bg-red-500/30'
                    >
                      ❌ Reject
                    </button>
                    <button
                      onClick={() => handleContractApproval(contract.id, true)}
                      className='rounded-lg border border-green-500/30 bg-green-500/20 px-6 py-2 font-medium text-green-400 transition-all hover:bg-green-500/30'
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
        <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md'>
          <h3 className='mb-4 text-xl font-bold text-white'>
            👥 AI Staff Management ({aiStaff.length} Active)
          </h3>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {aiStaff.map((staff) => (
              <div
                key={staff.id}
                className='rounded-lg border border-white/10 bg-white/5 p-4'
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-4'>
                    <div className='text-2xl'>{staff.avatar}</div>
                    <div>
                      <h4 className='font-semibold text-white'>{staff.name}</h4>
                      <p className='text-sm text-white/70'>
                        {staff.role} • {staff.department}
                      </p>
                    </div>
                    <div
                      className={`h-3 w-3 rounded-full ${getStatusColor(staff.status)} animate-pulse`}
                    ></div>
                  </div>
                  <div className='text-right'>
                    <div className='font-semibold text-green-400'>
                      {formatCurrency(staff.revenue)}
                    </div>
                    <div className='text-sm text-white/70'>
                      {staff.efficiency}% efficiency
                    </div>
                  </div>
                </div>
                <div className='mt-3 text-sm text-white/70'>
                  {staff.currentTask}
                </div>
              </div>
            ))}
          </div>

          <div className='mt-6 text-center'>
            <div className='inline-block rounded-lg border border-purple-500/30 bg-purple-500/20 px-6 py-3 text-purple-400'>
                             🚀 Full 87 AI Staff Dashboard Coming Soon
             </div>
           </div>
         </div>
          </div>
        )}

        {/* Business Intelligence Tab */}
        {activeTab === 'intelligence' && (
          <div className='space-y-8'>
            
            {/* Real-Time P&L Dashboard */}
            <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md'>
              <h3 className='mb-6 text-2xl font-bold text-white'>
                📈 Real-Time Profit & Loss Intelligence
              </h3>
              
              <div className='grid grid-cols-1 gap-6 lg:grid-cols-4'>
                {/* Revenue */}
                <div className='rounded-lg border border-green-500/20 bg-green-500/10 p-4'>
                  <div className='mb-2 text-sm text-green-400'>Total Revenue</div>
                  <div className='text-3xl font-bold text-white'>
                    {formatCurrency(businessIntelligence.realtimePL.revenue)}
                  </div>
                  <div className='text-sm text-green-400'>
                    +{businessIntelligence.realtimePL.growthRate}% growth
                  </div>
                </div>

                {/* Costs */}
                <div className='rounded-lg border border-red-500/20 bg-red-500/10 p-4'>
                  <div className='mb-2 text-sm text-red-400'>Total Costs</div>
                  <div className='text-3xl font-bold text-white'>
                    {formatCurrency(businessIntelligence.realtimePL.costs)}
                  </div>
                  <div className='text-sm text-red-400'>
                    Burn: {formatCurrency(businessIntelligence.realtimePL.burnRate)}/mo
                  </div>
                </div>

                {/* Net Profit */}
                <div className='rounded-lg border border-blue-500/20 bg-blue-500/10 p-4'>
                  <div className='mb-2 text-sm text-blue-400'>Net Profit</div>
                  <div className='text-3xl font-bold text-white'>
                    {formatCurrency(businessIntelligence.realtimePL.netProfit)}
                  </div>
                  <div className='text-sm text-blue-400'>
                    {businessIntelligence.realtimePL.profitMargin}% margin
                  </div>
                </div>

                {/* Runway */}
                <div className='rounded-lg border border-purple-500/20 bg-purple-500/10 p-4'>
                  <div className='mb-2 text-sm text-purple-400'>Cash Runway</div>
                  <div className='text-3xl font-bold text-white'>
                    {businessIntelligence.realtimePL.runway} mo
                  </div>
                  <div className='text-sm text-purple-400'>At current burn</div>
                </div>
              </div>
            </div>

            {/* Market Intelligence */}
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md'>
                <h4 className='mb-4 text-xl font-bold text-white'>🛢️ Market Intelligence</h4>
                
                <div className='space-y-4'>
                  <div className='flex items-center justify-between rounded-lg bg-white/5 p-3'>
                    <span className='text-white'>Diesel Price</span>
                    <div className='text-right'>
                      <div className='text-lg font-bold text-orange-400'>
                        ${businessIntelligence.marketIntelligence.fuelPrice}/gal
                      </div>
                      <div className='text-sm text-orange-400'>
                        {businessIntelligence.marketIntelligence.fuelTrend === 'up' ? '↗️' : '↘️'} Trending
                      </div>
                    </div>
                  </div>
                  
                  <div className='flex items-center justify-between rounded-lg bg-white/5 p-3'>
                    <span className='text-white'>Market Capacity</span>
                    <div className='rounded bg-red-500/20 px-2 py-1 text-sm text-red-400'>
                      {businessIntelligence.marketIntelligence.marketCapacity.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className='flex items-center justify-between rounded-lg bg-white/5 p-3'>
                    <span className='text-white'>Rate Advantage</span>
                    <div className='text-right'>
                      <div className='text-lg font-bold text-green-400'>
                        +{businessIntelligence.marketIntelligence.competitorRates.advantage}%
                      </div>
                      <div className='text-sm text-green-400'>vs competitors</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Predictive Analytics */}
              <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md'>
                <h4 className='mb-4 text-xl font-bold text-white'>🔮 Predictive Analytics</h4>
                
                <div className='space-y-4'>
                  <div className='rounded-lg bg-gradient-to-r from-green-500/20 to-blue-500/20 p-4'>
                    <div className='text-sm text-white/70'>Next Month Revenue Forecast</div>
                    <div className='text-2xl font-bold text-white'>
                      {formatCurrency(businessIntelligence.predictiveAnalytics.nextMonthRevenue)}
                    </div>
                    <div className='text-sm text-green-400'>
                      +{businessIntelligence.predictiveAnalytics.nextMonthGrowth}% projected growth
                    </div>
                  </div>
                  
                  <div>
                    <div className='mb-2 text-sm font-medium text-white'>Cash Flow Forecast</div>
                    <div className='space-y-2'>
                      {businessIntelligence.predictiveAnalytics.cashFlowForecast.map((forecast, index) => (
                        <div key={index} className='flex items-center justify-between rounded bg-white/5 p-2'>
                          <span className='text-sm text-white'>{forecast.month}</span>
                          <div className='text-right'>
                            <div className='text-sm font-semibold text-green-400'>
                              {formatCurrency(forecast.projected)}
                            </div>
                            <div className='text-xs text-white/70'>{forecast.confidence}% confidence</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* KPI Alerts */}
            <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md'>
              <h4 className='mb-4 text-xl font-bold text-white'>⚠️ Executive Alerts & KPI Monitoring</h4>
              
              <div className='space-y-3'>
                {businessIntelligence.kpiAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`rounded-lg border-l-4 p-4 ${
                      alert.type === 'warning'
                        ? 'border-l-orange-500 bg-orange-500/10'
                        : alert.type === 'success'
                        ? 'border-l-green-500 bg-green-500/10'
                        : 'border-l-red-500 bg-red-500/10'
                    }`}
                  >
                    <div className='flex items-center justify-between'>
                      <div>
                        <h5 className={`font-semibold ${
                          alert.type === 'warning'
                            ? 'text-orange-400'
                            : alert.type === 'success'
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}>
                          {alert.metric}
                        </h5>
                        <p className='text-white/80'>{alert.message}</p>
                      </div>
                      <div className={`rounded px-2 py-1 text-xs font-medium ${
                        alert.severity === 'high'
                          ? 'bg-red-500/20 text-red-400'
                          : alert.severity === 'medium'
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {alert.severity.toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Assessment */}
            <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md'>
              <h4 className='mb-4 text-xl font-bold text-white'>🎯 Risk Assessment & Mitigation</h4>
              
              <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
                {businessIntelligence.predictiveAnalytics.riskFactors.map((risk, index) => (
                  <div key={index} className='rounded-lg bg-white/5 p-4'>
                    <div className='mb-2 font-semibold text-white'>{risk.factor}</div>
                    <div className='mb-2 flex items-center gap-2'>
                      <div className='text-sm text-white/70'>Probability:</div>
                      <div className={`text-sm font-bold ${
                        risk.probability > 60 ? 'text-red-400' : risk.probability > 40 ? 'text-orange-400' : 'text-green-400'
                      }`}>
                        {risk.probability}%
                      </div>
                    </div>
                    <div className={`rounded px-2 py-1 text-xs font-medium ${
                      risk.impact === 'high'
                        ? 'bg-red-500/20 text-red-400'
                        : risk.impact === 'medium'
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {risk.impact.toUpperCase()} IMPACT
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Staff Management Tab */}
        {activeTab === 'staff' && (
          <div className='space-y-8'>
            
            {/* Department Performance Overview */}
            <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md'>
              <h3 className='mb-6 text-2xl font-bold text-white'>
                👥 AI Workforce Management - 87 Staff Members
              </h3>
              
              <div className='grid grid-cols-1 gap-4 lg:grid-cols-6'>
                {[
                  { dept: 'Sales', count: 25, revenue: 892400, efficiency: 96.8, color: 'bg-green-500' },
                  { dept: 'Operations', count: 30, revenue: 634200, efficiency: 98.1, color: 'bg-blue-500' },
                  { dept: 'Finance', count: 15, revenue: 445800, efficiency: 99.2, color: 'bg-purple-500' },
                  { dept: 'Compliance', count: 10, revenue: 234500, efficiency: 99.5, color: 'bg-red-500' },
                  { dept: 'Customer Service', count: 7, revenue: 167800, efficiency: 97.3, color: 'bg-orange-500' },
                ].map((dept, index) => (
                  <div key={index} className='rounded-lg border border-white/20 bg-white/5 p-4'>
                    <div className='mb-3 flex items-center gap-2'>
                      <div className={`h-3 w-3 rounded-full ${dept.color} animate-pulse`}></div>
                      <h4 className='font-semibold text-white'>{dept.dept}</h4>
                    </div>
                    <div className='space-y-2'>
                      <div className='text-2xl font-bold text-white'>{dept.count}</div>
                      <div className='text-sm text-white/70'>Staff Members</div>
                      <div className='text-lg font-semibold text-green-400'>
                        {formatCurrency(dept.revenue)}
                      </div>
                      <div className='text-sm text-blue-400'>{dept.efficiency}% efficiency</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Complete AI Staff Directory */}
            <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md'>
              <h4 className='mb-6 text-xl font-bold text-white'>🗂️ Individual AI Staff Directory</h4>
              
              <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                
                {/* Sales Department Staff */}
                <div className='rounded-lg border border-green-500/20 bg-green-500/5 p-4'>
                  <h5 className='mb-4 flex items-center gap-2 font-semibold text-green-400'>
                    <div className='h-3 w-3 rounded-full bg-green-500 animate-pulse'></div>
                    Sales Department (25 Staff) - $892.4K Revenue
                  </h5>
                  <div className='space-y-3'>
                    {[
                      { name: 'AI Revenue Optimizer', role: 'Revenue Director', revenue: 234500, efficiency: 98.9, status: 'active', task: 'Analyzing $2.3M pipeline - 12 high-conversion opportunities' },
                      { name: 'AI Lead Generator Pro', role: 'Lead Generation Specialist', revenue: 189700, efficiency: 97.4, status: 'busy', task: 'Processing 450 ThomasNet prospects - 23 qualified leads' },
                      { name: 'AI Contract Negotiator', role: 'Deal Closing Expert', revenue: 156800, efficiency: 96.8, status: 'active', task: 'Negotiating $125K Walmart contract - 87% close probability' },
                      { name: 'AI Customer Acquisition', role: 'New Client Specialist', revenue: 134200, efficiency: 95.7, status: 'active', task: 'Converting 23 warm leads - $890K potential value' },
                      { name: 'AI Pipeline Manager', role: 'Sales Pipeline Optimizer', revenue: 98500, efficiency: 94.3, status: 'busy', task: 'Optimizing Q1 funnel - 15% conversion improvement' },
                      { name: 'AI Proposal Writer', role: 'RFx Response Expert', revenue: 78200, efficiency: 93.8, status: 'active', task: 'Generating 8 RFx responses - $2.1M total value' }
                    ].map((staff, idx) => (
                      <div key={idx} className='rounded bg-white/5 p-3 border-l-2 border-l-green-500/50'>
                        <div className='flex items-center justify-between mb-2'>
                          <div>
                            <div className='font-medium text-white text-sm'>{staff.name}</div>
                            <div className='text-xs text-green-400'>{staff.role}</div>
                          </div>
                          <div className='text-right'>
                            <div className='text-sm font-semibold text-green-400'>{formatCurrency(staff.revenue)}</div>
                            <div className='text-xs text-white/70'>{staff.efficiency}%</div>
                          </div>
                        </div>
                        <div className='text-xs text-white/80 mt-1'>{staff.task}</div>
                      </div>
                    ))}
                    <div className='text-center text-xs text-green-400 bg-green-500/10 rounded p-2'>
                      + 19 more Sales AI: Account Managers, Territory Specialists, Cold Outreach Experts
                    </div>
                  </div>
                </div>

                {/* Operations Department Staff */}  
                <div className='rounded-lg border border-blue-500/20 bg-blue-500/5 p-4'>
                  <h5 className='mb-4 flex items-center gap-2 font-semibold text-blue-400'>
                    <div className='h-3 w-3 rounded-full bg-blue-500 animate-pulse'></div>
                    Operations Department (30 Staff) - $634.2K Revenue
                  </h5>
                  <div className='space-y-3'>
                    {[
                      { name: 'AI Dispatch Commander', role: 'Operations Director', revenue: 156780, efficiency: 99.2, status: 'busy', task: 'Coordinating 23 active loads - 99.7% on-time delivery' },
                      { name: 'AI Route Optimizer', role: 'Logistics Specialist', revenue: 98450, efficiency: 98.1, status: 'active', task: 'Saved 247 miles across 15 routes - $1.8K fuel savings' },
                      { name: 'AI Load Coordinator', role: 'Load Management Expert', revenue: 145600, efficiency: 97.6, status: 'active', task: 'Matching 8 loads with carriers - optimal capacity utilization' },
                      { name: 'AI Fleet Manager', role: 'Fleet Optimization Lead', revenue: 112300, efficiency: 97.8, status: 'active', task: 'Managing 87 vehicle statuses - 3 maintenance alerts resolved' },
                      { name: 'AI Tracking Specialist', role: 'Real-time Monitoring', revenue: 89400, efficiency: 98.5, status: 'busy', task: 'Monitoring 23 live deliveries - all on schedule' },
                      { name: 'AI Carrier Coordinator', role: 'Carrier Relations Manager', revenue: 67200, efficiency: 96.4, status: 'active', task: 'Onboarding 5 new carriers - FMCSA verification complete' }
                    ].map((staff, idx) => (
                      <div key={idx} className='rounded bg-white/5 p-3 border-l-2 border-l-blue-500/50'>
                        <div className='flex items-center justify-between mb-2'>
                          <div>
                            <div className='font-medium text-white text-sm'>{staff.name}</div>
                            <div className='text-xs text-blue-400'>{staff.role}</div>
                          </div>
                          <div className='text-right'>
                            <div className='text-sm font-semibold text-green-400'>{formatCurrency(staff.revenue)}</div>
                            <div className='text-xs text-white/70'>{staff.efficiency}%</div>
                          </div>
                        </div>
                        <div className='text-xs text-white/80 mt-1'>{staff.task}</div>
                      </div>
                    ))}
                    <div className='text-center text-xs text-blue-400 bg-blue-500/10 rounded p-2'>
                      + 24 more Operations AI: Dispatchers, Schedulers, Logistics Coordinators, Safety Monitors
                    </div>
                  </div>
                </div>

                {/* Finance & Other Departments */}
                <div className='rounded-lg border border-purple-500/20 bg-purple-500/5 p-4'>
                  <h5 className='mb-4 flex items-center gap-2 font-semibold text-purple-400'>
                    <div className='h-3 w-3 rounded-full bg-purple-500 animate-pulse'></div>
                    Finance Department (15 Staff) - $445.8K Revenue
                  </h5>
                  <div className='space-y-3'>
                    {[
                      { name: 'AI Financial Controller', role: 'Finance Director', revenue: 287400, efficiency: 99.1, status: 'active', task: 'Processing $456K invoices - 3 billing discrepancies detected' },
                      { name: 'AI Billing Specialist', role: 'Invoice Management', revenue: 78200, efficiency: 98.7, status: 'busy', task: 'Auto-generating 34 invoices - $892K total value' },
                      { name: 'AI Payment Processor', role: 'Collections Expert', revenue: 56800, efficiency: 97.9, status: 'active', task: 'Processing $234K payments - 98.7% collection rate' },
                      { name: 'AI Budget Analyst', role: 'Financial Planning', revenue: 23400, efficiency: 96.8, status: 'active', task: 'Preparing 2025 budget - $2.1M revenue projection' }
                    ].map((staff, idx) => (
                      <div key={idx} className='rounded bg-white/5 p-3 border-l-2 border-l-purple-500/50'>
                        <div className='flex items-center justify-between mb-2'>
                          <div>
                            <div className='font-medium text-white text-sm'>{staff.name}</div>
                            <div className='text-xs text-purple-400'>{staff.role}</div>
                          </div>
                          <div className='text-right'>
                            <div className='text-sm font-semibold text-green-400'>{formatCurrency(staff.revenue)}</div>
                            <div className='text-xs text-white/70'>{staff.efficiency}%</div>
                          </div>
                        </div>
                        <div className='text-xs text-white/80 mt-1'>{staff.task}</div>
                      </div>
                    ))}
                    <div className='text-center text-xs text-purple-400 bg-purple-500/10 rounded p-2'>
                      + 11 more Finance AI: Accountants, Auditors, Tax Specialists, Cost Analysts
                    </div>
                  </div>
                </div>

                {/* Compliance & Customer Service Combined */}
                <div className='rounded-lg border border-red-500/20 bg-red-500/5 p-4'>
                  <h5 className='mb-4 flex items-center gap-2 font-semibold text-red-400'>
                    <div className='h-3 w-3 rounded-full bg-red-500 animate-pulse'></div>
                    Compliance (10) + Customer Service (7) - $402.3K Revenue
                  </h5>
                  <div className='space-y-3'>
                    {/* Compliance Staff */}
                    {[
                      { name: 'AI Compliance Monitor', role: 'Compliance Director', revenue: 67800, efficiency: 99.5, status: 'active', task: 'FMCSA monitoring - all 87 drivers compliant', dept: 'Compliance' },
                      { name: 'AI DOT Specialist', role: 'DOT Expert', revenue: 45600, efficiency: 98.9, status: 'active', task: 'Processing 15 DOT inspections - zero violations', dept: 'Compliance' },
                      { name: 'AI Safety Manager', role: 'Safety Lead', revenue: 34800, efficiency: 99.1, status: 'busy', task: 'Analyzing safety data - 12% accident reduction', dept: 'Compliance' }
                    ].map((staff, idx) => (
                      <div key={idx} className='rounded bg-white/5 p-3 border-l-2 border-l-red-500/50'>
                        <div className='flex items-center justify-between mb-2'>
                          <div>
                            <div className='font-medium text-white text-sm'>{staff.name}</div>
                            <div className='text-xs text-red-400'>{staff.role} • {staff.dept}</div>
                          </div>
                          <div className='text-right'>
                            <div className='text-sm font-semibold text-green-400'>{formatCurrency(staff.revenue)}</div>
                            <div className='text-xs text-white/70'>{staff.efficiency}%</div>
                          </div>
                        </div>
                        <div className='text-xs text-white/80 mt-1'>{staff.task}</div>
                      </div>
                    ))}
                    {/* Customer Service Staff */}
                    {[
                      { name: 'AI Support Director', role: 'Customer Success Lead', revenue: 78900, efficiency: 97.3, status: 'active', task: '24/7 support - 4.8/5 satisfaction rating', dept: 'Customer Service' },
                      { name: 'AI Chat Assistant', role: 'Live Chat Expert', revenue: 56400, efficiency: 96.8, status: 'busy', task: 'Handling 145 live chats - 2min avg response', dept: 'Customer Service' }
                    ].map((staff, idx) => (
                      <div key={idx + 10} className='rounded bg-white/5 p-3 border-l-2 border-l-orange-500/50'>
                        <div className='flex items-center justify-between mb-2'>
                          <div>
                            <div className='font-medium text-white text-sm'>{staff.name}</div>
                            <div className='text-xs text-orange-400'>{staff.role} • {staff.dept}</div>
                          </div>
                          <div className='text-right'>
                            <div className='text-sm font-semibold text-green-400'>{formatCurrency(staff.revenue)}</div>
                            <div className='text-xs text-white/70'>{staff.efficiency}%</div>
                          </div>
                        </div>
                        <div className='text-xs text-white/80 mt-1'>{staff.task}</div>
                      </div>
                    ))}
                    <div className='text-center text-xs text-red-400 bg-red-500/10 rounded p-2 mb-2'>
                      + 7 more Compliance AI: Auditors, Risk Analysts, Document Specialists
                    </div>
                    <div className='text-center text-xs text-orange-400 bg-orange-500/10 rounded p-2'>
                      + 5 more Customer Service AI: Support Agents, Account Managers, Escalation Specialists
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* AI Performance Analytics Dashboard */}
            <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md'>
              <h4 className='mb-6 text-xl font-bold text-white'>📊 AI Performance Analytics & Optimization</h4>
              
              <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
                
                {/* Top Performers */}
                <div className='rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-4 border border-green-500/20'>
                  <h5 className='mb-4 font-semibold text-green-400'>🏆 Top Performers (99%+ Efficiency)</h5>
                  <div className='space-y-2'>
                    {[
                      { name: 'AI Compliance Monitor', efficiency: 99.5, dept: 'Compliance', revenue: 67800 },
                      { name: 'AI Dispatch Commander', efficiency: 99.2, dept: 'Operations', revenue: 156780 },
                      { name: 'AI Financial Controller', efficiency: 99.1, dept: 'Finance', revenue: 287400 },
                      { name: 'AI Safety Manager', efficiency: 99.1, dept: 'Compliance', revenue: 34800 }
                    ].map((performer, idx) => (
                      <div key={idx} className='flex items-center justify-between rounded bg-green-500/10 p-2 border-l-2 border-l-green-500'>
                        <div>
                          <div className='text-sm font-medium text-white'>{performer.name}</div>
                          <div className='text-xs text-green-400'>{performer.dept} • {formatCurrency(performer.revenue)}</div>
                        </div>
                        <div className='font-bold text-green-400'>{performer.efficiency}%</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revenue Leaders */}
                <div className='rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-4 border border-blue-500/20'>
                  <h5 className='mb-4 font-semibold text-blue-400'>💰 Revenue Leaders (Top 6)</h5>
                  <div className='space-y-2'>
                    {[
                      { name: 'AI Financial Controller', revenue: 287400, dept: 'Finance', efficiency: 99.1 },
                      { name: 'AI Revenue Optimizer', revenue: 234500, dept: 'Sales', efficiency: 98.9 },
                      { name: 'AI Lead Generator Pro', revenue: 189700, dept: 'Sales', efficiency: 97.4 },
                      { name: 'AI Contract Negotiator', revenue: 156800, dept: 'Sales', efficiency: 96.8 },
                      { name: 'AI Dispatch Commander', revenue: 156780, dept: 'Operations', efficiency: 99.2 },
                      { name: 'AI Load Coordinator', revenue: 145600, dept: 'Operations', efficiency: 97.6 }
                    ].map((leader, idx) => (
                      <div key={idx} className='flex items-center justify-between rounded bg-blue-500/10 p-2 border-l-2 border-l-blue-500'>
                        <div>
                          <div className='text-sm font-medium text-white'>{leader.name}</div>
                          <div className='text-xs text-blue-400'>{leader.dept} • {leader.efficiency}%</div>
                        </div>
                        <div className='font-bold text-green-400'>{formatCurrency(leader.revenue)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Optimization Recommendations */}
                <div className='rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-4 border border-purple-500/20'>
                  <h5 className='mb-4 font-semibold text-purple-400'>🚀 Executive AI Optimization</h5>
                  <div className='space-y-3'>
                    <div className='rounded bg-white/10 p-3 border-l-2 border-l-purple-500'>
                      <div className='text-sm font-medium text-white mb-1'>Scale Top Performers</div>
                      <div className='text-xs text-white/70 mb-2'>Deploy 5 more AI staff based on Compliance Monitor model</div>
                      <div className='text-xs text-green-400'>Projected: +$340K revenue, 99%+ efficiency</div>
                    </div>
                    
                    <div className='rounded bg-white/10 p-3 border-l-2 border-l-blue-500'>
                      <div className='text-sm font-medium text-white mb-1'>Cross-Department Training</div>
                      <div className='text-xs text-white/70 mb-2'>Train Sales AI with Operations optimization skills</div>
                      <div className='text-xs text-blue-400'>Projected: 15% efficiency boost across departments</div>
                    </div>
                    
                    <div className='rounded bg-white/10 p-3 border-l-2 border-l-green-500'>
                      <div className='text-sm font-medium text-white mb-1'>Revenue Multiplier Strategy</div>
                      <div className='text-xs text-white/70 mb-2'>Clone top 3 revenue performers for new territories</div>
                      <div className='text-xs text-green-400'>Projected: +$890K additional revenue stream</div>
                    </div>
                    
                    <div className='rounded bg-white/10 p-3 border-l-2 border-l-orange-500'>
                      <div className='text-sm font-medium text-white mb-1'>24/7 Operations Expansion</div>
                      <div className='text-xs text-white/70 mb-2'>Deploy night shift AI staff for global operations</div>
                      <div className='text-xs text-orange-400'>Projected: 40% capacity increase, $1.2M revenue</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {activeTab === 'operations' && (
          <div className='space-y-8'>
            
            {/* Live Operations Dashboard */}
            <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md'>
              <h3 className='mb-6 text-2xl font-bold text-white'>
                ⚡ Operations Command Center - Live System Status
              </h3>
              
              <div className='grid grid-cols-1 gap-6 lg:grid-cols-4'>
                {/* Active Loads Monitor */}
                <div className='rounded-lg border border-blue-500/20 bg-blue-500/10 p-4'>
                  <div className='mb-3 flex items-center gap-2'>
                    <div className='h-3 w-3 rounded-full bg-blue-500 animate-pulse'></div>
                    <h4 className='font-semibold text-blue-400'>Active Loads</h4>
                  </div>
                  <div className='text-3xl font-bold text-white mb-2'>23</div>
                  <div className='space-y-2'>
                    <div className='text-sm text-blue-400'>• 18 in-transit</div>
                    <div className='text-sm text-blue-400'>• 3 at pickup</div>
                    <div className='text-sm text-blue-400'>• 2 at delivery</div>
                    <div className='text-sm text-green-400'>• 99.7% on-time</div>
                  </div>
                </div>

                {/* Driver Status */}
                <div className='rounded-lg border border-green-500/20 bg-green-500/10 p-4'>
                  <div className='mb-3 flex items-center gap-2'>
                    <div className='h-3 w-3 rounded-full bg-green-500 animate-pulse'></div>
                    <h4 className='font-semibold text-green-400'>Driver Fleet</h4>
                  </div>
                  <div className='text-3xl font-bold text-white mb-2'>87</div>
                  <div className='space-y-2'>
                    <div className='text-sm text-green-400'>• 45 active driving</div>
                    <div className='text-sm text-yellow-400'>• 23 on break/rest</div>
                    <div className='text-sm text-blue-400'>• 12 available</div>
                    <div className='text-sm text-gray-400'>• 7 off duty</div>
                  </div>
                </div>

                {/* Carrier Network */}
                <div className='rounded-lg border border-purple-500/20 bg-purple-500/10 p-4'>
                  <div className='mb-3 flex items-center gap-2'>
                    <div className='h-3 w-3 rounded-full bg-purple-500 animate-pulse'></div>
                    <h4 className='font-semibold text-purple-400'>Carrier Network</h4>
                  </div>
                  <div className='text-3xl font-bold text-white mb-2'>156</div>
                  <div className='space-y-2'>
                    <div className='text-sm text-purple-400'>• 89 active carriers</div>
                    <div className='text-sm text-green-400'>• 134 compliant</div>
                    <div className='text-sm text-orange-400'>• 5 pending verification</div>
                    <div className='text-sm text-blue-400'>• 98.4% reliability score</div>
                  </div>
                </div>

                {/* Emergency Alerts */}
                <div className='rounded-lg border border-red-500/20 bg-red-500/10 p-4'>
                  <div className='mb-3 flex items-center gap-2'>
                    <div className='h-3 w-3 rounded-full bg-red-500 animate-pulse'></div>
                    <h4 className='font-semibold text-red-400'>System Alerts</h4>
                  </div>
                  <div className='text-3xl font-bold text-white mb-2'>2</div>
                  <div className='space-y-2'>
                    <div className='text-sm text-orange-400'>• Weather delay I-75</div>
                    <div className='text-sm text-yellow-400'>• Maintenance due (3 units)</div>
                    <div className='text-sm text-green-400'>• No critical issues</div>
                    <div className='text-sm text-blue-400'>• 98.7% system health</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Workflow Management */}
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              
              {/* Active Workflows */}
              <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md'>
                <h4 className='mb-4 text-xl font-bold text-white'>🔄 Live Workflow Status</h4>
                
                <div className='space-y-4'>
                  {[
                    { 
                      workflow: 'Load Assignment & Dispatch', 
                      stage: '3 of 5 - Driver Assignment', 
                      progress: 60, 
                      status: 'active',
                      details: '8 loads matched, 5 drivers assigned, 3 pending',
                      urgency: 'medium'
                    },
                    { 
                      workflow: 'Carrier Onboarding Process', 
                      stage: '2 of 5 - Document Verification', 
                      progress: 40, 
                      status: 'busy',
                      details: '5 new carriers, FMCSA verification in progress',
                      urgency: 'low'
                    },
                    { 
                      workflow: 'Emergency Load Reallocation', 
                      stage: '1 of 3 - Assessment Complete', 
                      progress: 90, 
                      status: 'critical',
                      details: 'I-75 weather delay - 3 loads reassigned to alternate routes',
                      urgency: 'high'
                    },
                    { 
                      workflow: 'BOL Document Processing', 
                      stage: '4 of 4 - Final Review', 
                      progress: 95, 
                      status: 'completing',
                      details: '23 BOLs processed, 2 pending signatures',
                      urgency: 'low'
                    }
                  ].map((workflow, idx) => (
                    <div key={idx} className={`rounded-lg border-l-4 p-4 ${
                      workflow.urgency === 'high' ? 'border-l-red-500 bg-red-500/10' :
                      workflow.urgency === 'medium' ? 'border-l-orange-500 bg-orange-500/10' :
                      'border-l-green-500 bg-green-500/10'
                    }`}>
                      <div className='flex items-center justify-between mb-2'>
                        <h5 className='font-semibold text-white text-sm'>{workflow.workflow}</h5>
                        <div className={`rounded px-2 py-1 text-xs font-medium ${
                          workflow.urgency === 'high' ? 'bg-red-500/20 text-red-400' :
                          workflow.urgency === 'medium' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {workflow.urgency.toUpperCase()}
                        </div>
                      </div>
                      
                      <div className='mb-2 text-xs text-white/70'>{workflow.stage}</div>
                      
                      {/* Progress Bar */}
                      <div className='mb-2 w-full bg-white/10 rounded-full h-2'>
                        <div 
                          className={`h-2 rounded-full ${
                            workflow.urgency === 'high' ? 'bg-red-500' :
                            workflow.urgency === 'medium' ? 'bg-orange-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${workflow.progress}%` }}
                        ></div>
                      </div>
                      
                      <div className='text-xs text-white/80'>{workflow.details}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Orchestrator Integration */}
              <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md'>
                <h4 className='mb-4 text-xl font-bold text-white'>🎯 AI System Orchestrator</h4>
                
                <div className='space-y-4'>
                  {/* Orchestrator Status */}
                  <div className='rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-4'>
                    <div className='flex items-center gap-3 mb-3'>
                      <div className='h-4 w-4 rounded-full bg-green-500 animate-pulse'></div>
                      <div className='font-semibold text-green-400'>System Orchestrator: ACTIVE</div>
                    </div>
                    <div className='space-y-2 text-sm text-white/80'>
                      <div>• Processing 47 concurrent workflows</div>
                      <div>• 23 AI staff coordination tasks active</div>
                      <div>• 8 predictive optimizations running</div>
                      <div>• 99.2% uptime (last 30 days)</div>
                    </div>
                  </div>

                  {/* AI Recommendations */}
                  <div className='space-y-3'>
                    <h5 className='font-medium text-white'>🤖 Live AI Recommendations</h5>
                    
                    {[
                      { 
                        title: 'Route Optimization Alert',
                        message: 'I-95 corridor - suggest 3 alternate routes to avoid 2hr delays',
                        action: 'Auto-reroute 5 affected loads',
                        confidence: 94,
                        type: 'optimization'
                      },
                      { 
                        title: 'Capacity Prediction',
                        message: 'High demand spike predicted for next 4 hours based on historical patterns',
                        action: 'Activate 7 standby drivers',
                        confidence: 87,
                        type: 'prediction'
                      },
                      { 
                        title: 'Cost Savings Opportunity', 
                        message: 'Fuel price drop detected - recommend immediate procurement',
                        action: 'Alert finance team for bulk purchase',
                        confidence: 91,
                        type: 'financial'
                      }
                    ].map((rec, idx) => (
                      <div key={idx} className='rounded bg-white/5 p-3 border-l-2 border-l-blue-500'>
                        <div className='flex items-center justify-between mb-2'>
                          <div className='font-medium text-blue-400 text-sm'>{rec.title}</div>
                          <div className='text-xs text-green-400'>{rec.confidence}% confidence</div>
                        </div>
                        <div className='text-xs text-white/80 mb-2'>{rec.message}</div>
                        <div className='flex items-center gap-2'>
                          <button className='rounded bg-blue-500/20 px-2 py-1 text-xs text-blue-400 hover:bg-blue-500/30 transition-colors'>
                            {rec.action}
                          </button>
                          <div className={`text-xs ${
                            rec.type === 'optimization' ? 'text-purple-400' :
                            rec.type === 'prediction' ? 'text-orange-400' :
                            'text-green-400'
                          }`}>
                            {rec.type}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'financial' && (
          <div className='text-center text-white'>
            <h3 className='text-2xl font-bold mb-4'>💰 Financial Command</h3>
            <p>Advanced Financial Management - Coming Next!</p>
          </div>
        )}

       </div>
     </div>
   );
 }
