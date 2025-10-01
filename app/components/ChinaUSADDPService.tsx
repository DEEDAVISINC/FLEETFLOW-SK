'use client';

import {
  AlertCircle,
  CheckCircle,
  DollarSign,
  Package,
  Play,
  Ship,
  TrendingUp,
  Upload,
  Users,
} from 'lucide-react';
import { useState } from 'react';

interface DDPLead {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  productCategory: 'steel' | 'metal' | 'aluminum' | 'disqualified';
  estimatedMonthlyContainers: number;
  status:
    | 'new'
    | 'contacted'
    | 'big5_collecting'
    | 'big5_complete'
    | 'routed_to_forwarder'
    | 'quoted'
    | 'won';
  estimatedMonthlyCommission: number;
  routedToForwarder?: string;
  leadSource: string;
  createdAt: Date;
  lastActivity: Date;
  notes: string[];
}

interface ForwarderPartner {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  fleetflowSubscription: 'starter' | 'professional' | 'enterprise';
  capabilities: {
    chinaDDP: boolean;
    steelMetalExperience: boolean;
    monthlyCapacity: number;
  };
  performance: {
    leadsReceived: number;
    conversionRate: number;
    avgResponseTime: string;
  };
  commissionRate: number;
  status: 'active' | 'paused';
}

export default function ChinaUSADDPService() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'prospecting' | 'leads' | 'forwarders' | 'commissions'
  >('overview');
  const [leads, setLeads] = useState<DDPLead[]>([]);
  const [forwarders, setForwarders] = useState<ForwarderPartner[]>([]);

  const [stats, setStats] = useState({
    totalLeads: 0,
    qualifiedLeads: 0,
    big5Complete: 0,
    routedToForwarders: 0,
    wonDeals: 0,
    monthlyCommissionEarned: 0,
    ytdCommission: 0,
    activeForwarders: 0,
  });

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='flex items-center gap-3 text-3xl font-bold'>
              <Ship className='h-8 w-8' />
              China-USA DDP Customer Acquisition
            </h1>
            <p className='mt-2 text-blue-100'>
              DEPOINTE Exclusive • AI-Powered Lead Generation • $500/Container
              Commission
            </p>
          </div>
          <div className='text-right'>
            <div className='text-sm text-blue-100'>Monthly Commission</div>
            <div className='text-4xl font-bold'>
              ${stats.monthlyCommissionEarned.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-4 gap-4'>
        <StatCard
          label='AI-Found Leads'
          value={stats.totalLeads}
          icon={TrendingUp}
          color='blue'
        />
        <StatCard
          label='Big 5 Complete'
          value={stats.big5Complete}
          icon={CheckCircle}
          color='green'
        />
        <StatCard
          label='Routed to Forwarders'
          value={stats.routedToForwarders}
          icon={Ship}
          color='purple'
        />
        <StatCard
          label='Won Deals'
          value={stats.wonDeals}
          icon={DollarSign}
          color='emerald'
        />
      </div>

      {/* Navigation Tabs */}
      <div className='rounded-lg bg-white shadow'>
        <div className='border-b border-gray-200'>
          <nav className='-mb-px flex'>
            {[
              { id: 'overview', label: 'Overview', icon: Ship },
              { id: 'prospecting', label: 'AI Prospecting', icon: TrendingUp },
              { id: 'leads', label: 'Lead Pipeline', icon: Users },
              { id: 'forwarders', label: 'Forwarder Partners', icon: Package },
              {
                id: 'commissions',
                label: 'Commission Tracker',
                icon: DollarSign,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                } `}
              >
                <tab.icon className='h-4 w-4' />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className='p-6'>
          {activeTab === 'overview' && <OverviewTab stats={stats} />}
          {activeTab === 'prospecting' && <ProspectingTab />}
          {activeTab === 'leads' && <LeadPipelineTab leads={leads} />}
          {activeTab === 'forwarders' && (
            <ForwarderPartnersTab forwarders={forwarders} />
          )}
          {activeTab === 'commissions' && <CommissionTrackerTab />}
        </div>
      </div>
    </div>
  );
}

// Helper component
function StatCard({ label, value, icon: Icon, color }: any) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    emerald: 'bg-emerald-100 text-emerald-600',
  };

  return (
    <div className='rounded-lg bg-white p-4 shadow'>
      <div className='flex items-center justify-between'>
        <div>
          <div className='text-sm text-gray-600'>{label}</div>
          <div className='text-2xl font-bold text-gray-900'>{value}</div>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${colors[color]}`}
        >
          <Icon className='h-6 w-6' />
        </div>
      </div>
    </div>
  );
}

// Tab components
function OverviewTab({ stats }: any) {
  return (
    <div className='space-y-6'>
      {/* Service Focus */}
      <div className='rounded-lg border border-blue-200 bg-blue-50 p-6'>
        <h3 className='mb-3 text-lg font-semibold text-blue-900'>
          🎯 DEPOINTE Exclusive Service
        </h3>
        <div className='grid grid-cols-2 gap-6'>
          <div>
            <h4 className='mb-2 font-semibold text-blue-800'>✅ TARGET:</h4>
            <ul className='space-y-1 text-sm text-blue-700'>
              <li>• US companies importing steel from China (95% tariff)</li>
              <li>• US companies importing metal from China (95% tariff)</li>
              <li>• US companies importing aluminum from China (95% tariff)</li>
              <li>• Minimum 3-5 containers per month</li>
            </ul>
          </div>
          <div>
            <h4 className='mb-2 font-semibold text-red-800'>❌ AVOID:</h4>
            <ul className='space-y-1 text-sm text-red-700'>
              <li>• Pharmaceutical products</li>
              <li>• Perishable goods</li>
              <li>• HAZMAT materials</li>
              <li>• Low volume (&lt;3 containers/month)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
        <h3 className='mb-4 text-lg font-semibold text-gray-900'>
          🤖 AI-Powered Process
        </h3>
        <div className='grid grid-cols-5 gap-4'>
          {[
            {
              step: '1',
              label: 'AI Finds Importers',
              desc: 'Steel/metal/aluminum',
            },
            {
              step: '2',
              label: 'AI Qualifies',
              desc: 'Volume + product check',
            },
            {
              step: '3',
              label: 'Collect Big 5',
              desc: 'Automated data collection',
            },
            {
              step: '4',
              label: 'Route to Forwarder',
              desc: 'Best-fit matching',
            },
            { step: '5', label: 'Earn Commission', desc: '$500 per container' },
          ].map((item) => (
            <div key={item.step} className='text-center'>
              <div className='mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white'>
                {item.step}
              </div>
              <div className='text-sm font-medium text-gray-900'>
                {item.label}
              </div>
              <div className='mt-1 text-xs text-gray-600'>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Commission Structure */}
      <div className='rounded-lg border border-green-200 bg-green-50 p-6'>
        <h3 className='mb-3 text-lg font-semibold text-green-900'>
          💰 Commission Model
        </h3>
        <div className='grid grid-cols-3 gap-6 text-center'>
          <div>
            <div className='text-3xl font-bold text-green-600'>$500</div>
            <div className='text-sm text-green-700'>per 40ft container</div>
          </div>
          <div>
            <div className='text-3xl font-bold text-green-600'>Weekly</div>
            <div className='text-sm text-green-700'>payment schedule</div>
          </div>
          <div>
            <div className='text-3xl font-bold text-green-600'>Recurring</div>
            <div className='text-sm text-green-700'>
              lifetime customer value
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProspectingTab() {
  return (
    <div className='space-y-6'>
      {/* AI Prospecting Engine */}
      <div className='rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6'>
        <h3 className='mb-4 text-lg font-semibold text-gray-900'>
          🤖 AI Prospecting Engine
        </h3>
        <p className='mb-6 text-gray-700'>
          Automatically finds US companies importing steel, metal, and aluminum
          from China with 95% tariff exposure.
        </p>

        <div className='mb-6 grid grid-cols-3 gap-4'>
          <div className='rounded-lg bg-white p-4 shadow-sm'>
            <div className='text-2xl font-bold text-blue-600'>0</div>
            <div className='text-sm text-gray-600'>Prospects Found Today</div>
          </div>
          <div className='rounded-lg bg-white p-4 shadow-sm'>
            <div className='text-2xl font-bold text-green-600'>0</div>
            <div className='text-sm text-gray-600'>
              High-Quality (95% tariff)
            </div>
          </div>
          <div className='rounded-lg bg-white p-4 shadow-sm'>
            <div className='text-2xl font-bold text-purple-600'>0</div>
            <div className='text-sm text-gray-600'>Contacted This Week</div>
          </div>
        </div>

        <button className='flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700'>
          <Play className='h-5 w-5' />
          Run AI Prospecting Now
        </button>
      </div>

      {/* Targeting Criteria */}
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <h4 className='mb-4 font-semibold text-gray-900'>
          🎯 AI Targeting Criteria
        </h4>
        <div className='space-y-3 text-sm'>
          <div className='flex items-start gap-3'>
            <CheckCircle className='mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
            <div>
              <div className='font-medium'>Product Keywords:</div>
              <div className='text-gray-600'>
                steel import, metal import, aluminum import, iron products,
                steel fabrication
              </div>
            </div>
          </div>
          <div className='flex items-start gap-3'>
            <CheckCircle className='mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
            <div>
              <div className='font-medium'>Origin Country:</div>
              <div className='text-gray-600'>
                China (must be actively importing)
              </div>
            </div>
          </div>
          <div className='flex items-start gap-3'>
            <CheckCircle className='mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
            <div>
              <div className='font-medium'>Minimum Volume:</div>
              <div className='text-gray-600'>
                3-5 containers per month minimum
              </div>
            </div>
          </div>
          <div className='flex items-start gap-3'>
            <AlertCircle className='mt-0.5 h-5 w-5 flex-shrink-0 text-red-500' />
            <div>
              <div className='font-medium'>Auto-Excluded:</div>
              <div className='text-gray-600'>
                Pharmaceutical, perishable goods, HAZMAT products
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeadPipelineTab({ leads }: { leads: DDPLead[] }) {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold'>Lead Pipeline</h3>
        <button className='flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'>
          <Upload className='h-4 w-4' />
          Import Leads
        </button>
      </div>

      {leads.length === 0 ? (
        <div className='rounded-lg border border-gray-200 bg-gray-50 py-12 text-center'>
          <Users className='mx-auto mb-3 h-12 w-12 text-gray-300' />
          <div className='text-gray-500'>
            No leads yet. Start AI prospecting to find steel/metal/aluminum
            importers.
          </div>
          <button className='mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700'>
            Start Prospecting
          </button>
        </div>
      ) : (
        <div className='overflow-hidden rounded-lg border border-gray-200'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  Company
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  Product
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  Volume
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  Commission
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 bg-white'>
              {/* Lead rows will go here */}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ForwarderPartnersTab({
  forwarders,
}: {
  forwarders: ForwarderPartner[];
}) {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold'>Freight Forwarder Partners</h3>
        <button className='rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'>
          Add Forwarder
        </button>
      </div>

      <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
        <p className='text-sm text-blue-800'>
          <strong>Note:</strong> These are FleetFlow freight forwarders who
          opted into the lead generation program. When you bring them qualified
          customers, you earn $500 per container.
        </p>
      </div>

      {forwarders.length === 0 ? (
        <div className='rounded-lg border border-gray-200 bg-gray-50 py-12 text-center'>
          <Package className='mx-auto mb-3 h-12 w-12 text-gray-300' />
          <div className='mb-4 text-gray-500'>
            No forwarder partners yet. Recruit FleetFlow freight forwarders to
            join the program.
          </div>
          <button className='rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700'>
            Invite Forwarder
          </button>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4'>
          {/* Forwarder cards will go here */}
        </div>
      )}
    </div>
  );
}

function CommissionTrackerTab() {
  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-3 gap-4'>
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <div className='mb-2 text-sm text-gray-600'>This Month</div>
          <div className='text-3xl font-bold text-gray-900'>$0</div>
          <div className='mt-2 text-sm text-gray-500'>0 containers shipped</div>
        </div>
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <div className='mb-2 text-sm text-gray-600'>Pending</div>
          <div className='text-3xl font-bold text-purple-600'>$0</div>
          <div className='mt-2 text-sm text-gray-500'>
            0 containers in transit
          </div>
        </div>
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <div className='mb-2 text-sm text-gray-600'>Year to Date</div>
          <div className='text-3xl font-bold text-green-600'>$0</div>
          <div className='mt-2 text-sm text-gray-500'>0 containers total</div>
        </div>
      </div>

      <div className='rounded-lg border border-green-200 bg-green-50 p-6'>
        <h4 className='mb-3 font-semibold text-green-900'>
          💰 How Commission Works
        </h4>
        <div className='space-y-2 text-sm text-green-800'>
          <div className='flex justify-between'>
            <span>Per 40ft Container:</span>
            <span className='font-bold'>$500</span>
          </div>
          <div className='flex justify-between'>
            <span>Payment Timing:</span>
            <span className='font-medium'>
              Weekly upon departure from China
            </span>
          </div>
          <div className='flex justify-between'>
            <span>Applies To:</span>
            <span className='font-medium'>
              FleetFlow-sourced customers only
            </span>
          </div>
        </div>
      </div>

      <div>
        <h4 className='mb-3 font-semibold text-gray-900'>Commission History</h4>
        <div className='rounded-lg border border-gray-200 bg-gray-50 py-12 text-center'>
          <DollarSign className='mx-auto mb-3 h-12 w-12 text-gray-300' />
          <div className='text-gray-500'>
            No commission payments yet. Start bringing customers to forwarders!
          </div>
        </div>
      </div>
    </div>
  );
}
