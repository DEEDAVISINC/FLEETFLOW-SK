'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface Lead {
  id: string;
  companyName: string;
  serviceCategory: string;
  priority: string;
  estimatedValue: number;
  status: string;
  urgency: string;
}

export default function WorkingCRMDashboard() {
  console.info('🚀 WorkingCRMDashboard LOADED - AI HUB DARK THEME');

  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 'SL-001',
      companyName: 'Midwest Manufacturing Corp',
      serviceCategory: 'Logistics',
      priority: 'hot',
      estimatedValue: 480000,
      status: 'proposal_sent',
      urgency: 'high',
    },
    {
      id: 'SL-002',
      companyName: 'Pacific Coast Imports LLC',
      serviceCategory: 'Warehousing',
      priority: 'urgent',
      estimatedValue: 360000,
      status: 'demo_scheduled',
      urgency: 'urgent',
    },
    {
      id: 'SL-003',
      companyName: 'Thunder Trucking LLC',
      serviceCategory: 'Dispatching',
      priority: 'high',
      estimatedValue: 72000,
      status: 'qualified',
      urgency: 'medium',
    },
    {
      id: 'SL-004',
      companyName: 'Urban Retail Solutions Inc',
      serviceCategory: 'Freight_Brokerage',
      priority: 'hot',
      estimatedValue: 750000,
      status: 'negotiating',
      urgency: 'high',
    },
    {
      id: 'SL-005',
      companyName: 'Southwest Food Distributors',
      serviceCategory: 'Supply_Chain_Consulting',
      priority: 'high',
      estimatedValue: 180000,
      status: 'contacted',
      urgency: 'medium',
    },
  ]);

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.info(
      '✅ WorkingCRMDashboard: Component mounted with',
      leads.length,
      'leads'
    );
  }, []);

  const totalPipeline = leads.reduce(
    (sum, lead) => sum + lead.estimatedValue,
    0
  );
  const hotLeads = leads.filter((lead) => lead.priority === 'hot').length;
  const avgDealSize = leads.length > 0 ? totalPipeline / leads.length : 0;

  const handleLeadClick = (lead: Lead) => {
    console.info('🔍 Lead clicked:', lead.companyName);
    setSelectedLead(lead);
    setShowDetails(true);
  };

  const handleContactLead = (lead: Lead) => {
    console.info('📞 Contacting lead:', lead.companyName);
    alert(`Contacting ${lead.companyName} - ${lead.serviceCategory}`);
  };

  const handleScheduleDemo = (lead: Lead) => {
    console.info('📅 Scheduling demo for:', lead.companyName);
    alert(`Demo scheduled for ${lead.companyName}`);
  };

  const handleSendProposal = (lead: Lead) => {
    console.info('📄 Sending proposal to:', lead.companyName);
    alert(`Proposal sent to ${lead.companyName}`);
  };

  return (
    <div style={{ color: '#fff' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2
          style={{
            background: 'linear-gradient(135deg, #ff1493, #ec4899, #db2777)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '8px',
          }}
        >
          CRM Lead Intelligence Dashboard
        </h2>
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '18px',
            fontWeight: '500',
          }}
        >
          AI-Powered Service Lead Management & Pipeline Analytics
        </p>
      </div>

      {/* Metrics Cards */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {/* Total Pipeline */}
        <Card className='border border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white'>
          <CardContent className='p-4 p-6 pt-0'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-blue-100'>
                  Total Pipeline
                </p>
                <p className='text-2xl font-bold'>
                  ${(totalPipeline / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className='rounded-full bg-blue-400/20 p-3'>
                <span className='text-2xl'>💰</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Leads */}
        <Card className='border border-gray-200 bg-gradient-to-r from-purple-500 to-purple-600 text-white'>
          <CardContent className='p-4 p-6 pt-0'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-purple-100'>
                  Active Leads
                </p>
                <p className='text-2xl font-bold'>{leads.length}</p>
              </div>
              <div className='rounded-full bg-purple-400/20 p-3'>
                <span className='text-2xl'>👥</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hot Leads */}
        <Card className='border border-gray-200 bg-gradient-to-r from-orange-500 to-orange-600 text-white'>
          <CardContent className='p-4 p-6 pt-0'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-orange-100'>Hot Leads</p>
                <p className='text-2xl font-bold'>{hotLeads}</p>
              </div>
              <div className='rounded-full bg-orange-400/20 p-3'>
                <span className='text-2xl'>🔥</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avg Deal Size */}
        <Card className='border border-gray-200 bg-gradient-to-r from-green-500 to-green-600 text-white'>
          <CardContent className='p-4 p-6 pt-0'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-green-100'>
                  Avg Deal Size
                </p>
                <p className='text-2xl font-bold'>
                  ${(avgDealSize / 1000).toFixed(0)}K
                </p>
              </div>
              <div className='rounded-full bg-green-400/20 p-3'>
                <span className='text-2xl'>📊</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads List */}
      <Card className='border border-white/20 bg-white/10 backdrop-blur-sm'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-white'>
            Service Leads Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {leads.map((lead) => (
              <div
                key={lead.id}
                className='rounded-lg border border-white/20 bg-white/10 p-4 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md'
              >
                <div className='flex items-center justify-between'>
                  <div className='flex-1'>
                    <h4 className='text-lg font-semibold text-white'>
                      {lead.companyName}
                    </h4>
                    <p className='text-sm text-white/70'>
                      {lead.serviceCategory}
                    </p>
                  </div>

                  <div className='flex items-center gap-4'>
                    <div className='text-right'>
                      <p className='text-lg font-bold text-green-400'>
                        ${(lead.estimatedValue / 1000).toFixed(0)}K
                      </p>
                      <p className='text-sm text-white/60'>Estimated Value</p>
                    </div>

                    <div className='flex flex-col gap-1'>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          lead.priority === 'hot'
                            ? 'bg-red-100 text-red-800'
                            : lead.priority === 'urgent'
                              ? 'bg-orange-100 text-orange-800'
                              : lead.priority === 'high'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {lead.priority?.toUpperCase() || 'STANDARD'}
                      </span>

                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          lead.status === 'negotiating'
                            ? 'bg-blue-100 text-blue-800'
                            : lead.status === 'proposal_sent'
                              ? 'bg-purple-100 text-purple-800'
                              : lead.status === 'demo_scheduled'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {lead.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex flex-col gap-1'>
                      <button
                        onClick={() => handleContactLead(lead)}
                        className='rounded bg-blue-600 px-3 py-1 text-xs text-white transition-colors hover:bg-blue-700'
                      >
                        📞 Contact
                      </button>
                      <button
                        onClick={() => handleScheduleDemo(lead)}
                        className='rounded bg-green-600 px-3 py-1 text-xs text-white transition-colors hover:bg-green-700'
                      >
                        📅 Demo
                      </button>
                      <button
                        onClick={() => handleSendProposal(lead)}
                        className='rounded bg-purple-600 px-3 py-1 text-xs text-white transition-colors hover:bg-purple-700'
                      >
                        📄 Proposal
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons Section */}
      <Card className='border border-white/20 bg-white/10 backdrop-blur-sm'>
        <CardHeader>
          <CardTitle className='text-xl font-bold text-white'>
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <button
              onClick={() => {
                console.info('🔍 Analyzing all leads...');
                alert('AI Analysis started for all leads');
              }}
              className='rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white shadow-md transition-all hover:from-blue-600 hover:to-blue-700'
            >
              <div className='text-center'>
                <div className='mb-2 text-2xl'>🤖</div>
                <div className='font-semibold'>AI Lead Analysis</div>
                <div className='text-sm opacity-90'>
                  Analyze all leads with AI
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                console.info('📊 Generating report...');
                alert('Pipeline report generated');
              }}
              className='rounded-lg bg-gradient-to-r from-green-500 to-green-600 p-4 text-white shadow-md transition-all hover:from-green-600 hover:to-green-700'
            >
              <div className='text-center'>
                <div className='mb-2 text-2xl'>📊</div>
                <div className='font-semibold'>Generate Report</div>
                <div className='text-sm opacity-90'>Create pipeline report</div>
              </div>
            </button>

            <button
              onClick={() => {
                console.info('📧 Sending bulk emails...');
                alert('Bulk email campaign started');
              }}
              className='rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 p-4 text-white shadow-md transition-all hover:from-purple-600 hover:to-purple-700'
            >
              <div className='text-center'>
                <div className='mb-2 text-2xl'>📧</div>
                <div className='font-semibold'>Bulk Email</div>
                <div className='text-sm opacity-90'>Send campaign to leads</div>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className='border border-white/20 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 text-white backdrop-blur-sm'>
        <CardHeader>
          <CardTitle className='text-xl font-bold'>
            🤖 AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2 text-sm text-white/90'>
            <p>
              • Focus on closing Urban Retail Solutions ($750K) - 90% win
              probability
            </p>
            <p>
              • Schedule follow-up with Midwest Manufacturing - proposal expires
              Dec 31st
            </p>
            <p>
              • Prioritize Pacific Coast Imports demo - decision timeline is 30
              days
            </p>
            <p>
              • Total pipeline value: ${(totalPipeline / 1000000).toFixed(1)}M
              across {leads.length} active opportunities
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Lead Details Modal */}
      {showDetails && selectedLead && (
        <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black'>
          <Card className='mx-4 max-h-[80vh] w-full max-w-2xl overflow-y-auto'>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                <span>Lead Details: {selectedLead.companyName}</span>
                <button
                  onClick={() => setShowDetails(false)}
                  className='text-gray-500 hover:text-gray-700'
                >
                  ✕
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div>
                  <label className='font-semibold'>Company:</label>
                  <p>{selectedLead.companyName}</p>
                </div>
                <div>
                  <label className='font-semibold'>Service Category:</label>
                  <p>{selectedLead.serviceCategory}</p>
                </div>
                <div>
                  <label className='font-semibold'>Estimated Value:</label>
                  <p>${selectedLead.estimatedValue.toLocaleString()}</p>
                </div>
                <div>
                  <label className='font-semibold'>Priority:</label>
                  <p className='capitalize'>{selectedLead.priority}</p>
                </div>
                <div>
                  <label className='font-semibold'>Status:</label>
                  <p className='capitalize'>
                    {selectedLead.status.replace('_', ' ')}
                  </p>
                </div>
                <div className='flex gap-2 pt-4'>
                  <button
                    onClick={() => handleContactLead(selectedLead)}
                    className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
                  >
                    📞 Contact
                  </button>
                  <button
                    onClick={() => handleScheduleDemo(selectedLead)}
                    className='rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700'
                  >
                    📅 Schedule Demo
                  </button>
                  <button
                    onClick={() => handleSendProposal(selectedLead)}
                    className='rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700'
                  >
                    📄 Send Proposal
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
