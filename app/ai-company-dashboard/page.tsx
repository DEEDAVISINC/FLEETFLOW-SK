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

        {/* Placeholder for other tabs */}
        {activeTab === 'staff' && (
          <div className='text-center text-white'>
            <h3 className='text-2xl font-bold mb-4'>👥 AI Staff Management</h3>
            <p>Full 87 AI Staff Dashboard - Coming Next!</p>
          </div>
        )}

        {activeTab === 'operations' && (
          <div className='text-center text-white'>
            <h3 className='text-2xl font-bold mb-4'>⚡ Operations Center</h3>
            <p>Live Workflow Management - Coming Next!</p>
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
