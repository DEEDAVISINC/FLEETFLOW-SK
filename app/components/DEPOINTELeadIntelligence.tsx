'use client';

import {
  AlertCircle,
  Building2,
  CheckCircle,
  Download,
  Filter,
  Mail,
  Phone,
  Search,
  Star,
  Target,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import DEPOINTEEmailOutreach from './DEPOINTEEmailOutreach';
import DEPOINTEEmailTemplateSystem from './DEPOINTEEmailTemplateSystem';
import DOTViolationRescueCampaign from './DOTViolationRescueCampaign';

interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  title: string;
  email: string;
  phone: string;
  industry: string;
  revenue: string;
  employees: string;
  location: string;
  verificationStatus: 'verified' | 'pending' | 'failed';
  leadScore: number;
  lastVerified: string;
  buyingSignals: string[];
  assignedTo?: string;
  campaignType?: 'compliance' | 'capacity' | 'reliability' | 'general';
}

interface SearchFilters {
  industry: string;
  revenue: string;
  employees: string;
  location: string;
  verificationStatus: string;
  minLeadScore: number;
}

type ViewMode = 'leads' | 'campaign' | 'email' | 'templates';

export default function DEPOINTELeadIntelligence() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [emailQueue, setEmailQueue] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('leads');

  // Automated email trigger system
  const triggerLeadEmailSequence = (lead: Lead) => {
    if (!lead.campaignType) return;

    // Determine email template and sender based on campaign type
    const emailConfig = getEmailConfigForLead(lead);

    // Add to email queue for processing
    setEmailQueue((prev) => [...prev, lead]);

    // Simulate email sending (in real implementation, this would call an email service)
    setTimeout(() => {
      console.log(
        `📧 Sending ${emailConfig.templateName} email to ${lead.contactName} at ${lead.companyName}`
      );
      console.log(
        `   From: ${emailConfig.fromEmail} (${emailConfig.senderName})`
      );
      console.log(`   Subject: ${emailConfig.subject}`);
      console.log(`   Template: ${emailConfig.templateName}`);

      // Remove from queue after "sending"
      setEmailQueue((prev) => prev.filter((l) => l.id !== lead.id));
    }, 2000);

    // Log the email activity
    logEmailActivity(lead, emailConfig);
  };

  const getEmailConfigForLead = (lead: Lead) => {
    switch (lead.campaignType) {
      case 'compliance':
        return {
          templateName: 'DOT Violation Recovery',
          fromEmail: 'compliance@fleetflowapp.com',
          senderName: 'Kameelah Johnson',
          subject: `[${lead.companyName}] - Strategic Freight Solutions for Compliance Recovery`,
          followUpDays: [3, 7, 14],
          category: 'compliance',
        };
      case 'capacity':
        return {
          templateName: 'Capacity Crisis Outreach',
          fromEmail: 'logistics@fleetflowapp.com',
          senderName: 'Miles Rodriguez',
          subject: `Peak Season Freight Capacity Solutions for ${lead.companyName}`,
          followUpDays: [2, 5, 10],
          category: 'capacity',
        };
      case 'reliability':
        return {
          templateName: 'Carrier Reliability Outreach',
          fromEmail: 'operations@fleetflowapp.com',
          senderName: 'Logan Stevens',
          subject: `[${lead.companyName}] - Solving Your Carrier Reliability Challenges`,
          followUpDays: [4, 8, 12],
          category: 'reliability',
        };
      case 'general':
      default:
        return {
          templateName: 'FleetFlow Introduction',
          fromEmail: 'info@fleetflowapp.com',
          senderName: 'Dee Davis',
          subject: `[${lead.companyName}] - Transportation Solutions from FleetFlow`,
          followUpDays: [3, 7, 10],
          category: 'general',
        };
    }
  };

  const logEmailActivity = (lead: Lead, config: any) => {
    const activityLog = {
      leadId: lead.id,
      timestamp: new Date().toISOString(),
      emailType: config.templateName,
      fromEmail: config.fromEmail,
      toEmail: lead.email,
      subject: config.subject,
      status: 'sent',
      followUps: config.followUpDays,
    };

    // In real implementation, this would be stored in a database
    console.log('📝 Email Activity Logged:', activityLog);
  };

  // Bulk email trigger for selected leads
  const triggerBulkEmailSequence = () => {
    const leadsToEmail = leads.filter((lead) =>
      selectedLeads.includes(lead.id)
    );
    leadsToEmail.forEach((lead) => {
      if (lead.campaignType) {
        triggerLeadEmailSequence(lead);
      }
    });
    setSelectedLeads([]); // Clear selection after sending
  };

  const [filters, setFilters] = useState<SearchFilters>({
    industry: '',
    revenue: '',
    employees: '',
    location: '',
    verificationStatus: '',
    minLeadScore: 0,
  });

  const [stats, setStats] = useState({
    totalLeads: 0,
    verifiedLeads: 0,
    highScoreLeads: 0,
    assignedLeads: 0,
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockLeads: Lead[] = [
      {
        id: 'DLI-001',
        companyName: 'Global Manufacturing Corp',
        contactName: 'Sarah Johnson',
        title: 'VP of Logistics',
        email: 'sarah.johnson@globalmanufacturing.com',
        phone: '+1-248-555-0123',
        industry: 'Manufacturing',
        revenue: '$100M - $500M',
        employees: '1,000-5,000',
        location: 'Detroit, MI',
        verificationStatus: 'verified',
        leadScore: 94,
        lastVerified: '2025-01-15',
        buyingSignals: [
          'Recent DOT violations',
          'Fleet expansion',
          'New facility opening',
        ],
        assignedTo: 'Gary',
        campaignType: 'compliance',
      },
      {
        id: 'DLI-002',
        companyName: 'Midwest Steel Solutions',
        contactName: 'Michael Chen',
        title: 'Operations Manager',
        email: 'm.chen@midweststeel.com',
        phone: '+1-312-555-0456',
        industry: 'Steel Manufacturing',
        revenue: '$50M - $100M',
        employees: '500-1,000',
        location: 'Chicago, IL',
        verificationStatus: 'verified',
        leadScore: 89,
        lastVerified: '2025-01-14',
        buyingSignals: ['Seasonal shipping increase', 'Contract renewal'],
        assignedTo: 'Desiree',
        campaignType: 'capacity',
      },
      {
        id: 'DLI-003',
        companyName: 'Texas Chemical Distribution',
        contactName: 'Lisa Rodriguez',
        title: 'Supply Chain Director',
        email: 'l.rodriguez@texaschem.com',
        phone: '+1-713-555-0789',
        industry: 'Chemical',
        revenue: '$25M - $50M',
        employees: '250-500',
        location: 'Houston, TX',
        verificationStatus: 'pending',
        leadScore: 76,
        lastVerified: '2025-01-13',
        buyingSignals: ['Hazmat compliance issues', 'New product line'],
        campaignType: 'compliance',
      },
    ];

    setLeads(mockLeads);
    setFilteredLeads(mockLeads);

    setStats({
      totalLeads: mockLeads.length,
      verifiedLeads: mockLeads.filter(
        (l) => l.verificationStatus === 'verified'
      ).length,
      highScoreLeads: mockLeads.filter((l) => l.leadScore >= 85).length,
      assignedLeads: mockLeads.filter((l) => l.assignedTo).length,
    });
  }, []);

  const handleSearch = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      let filtered = leads.filter(
        (lead) =>
          lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.industry.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Apply filters
      if (filters.industry) {
        filtered = filtered.filter(
          (lead) => lead.industry === filters.industry
        );
      }
      if (filters.verificationStatus) {
        filtered = filtered.filter(
          (lead) => lead.verificationStatus === filters.verificationStatus
        );
      }
      if (filters.minLeadScore > 0) {
        filtered = filtered.filter(
          (lead) => lead.leadScore >= filters.minLeadScore
        );
      }

      setFilteredLeads(filtered);
      setLoading(false);
    }, 1000);
  };

  const handleAssignLead = (leadId: string, staffMember: string) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId ? { ...lead, assignedTo: staffMember } : lead
      )
    );
    setFilteredLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId ? { ...lead, assignedTo: staffMember } : lead
      )
    );
  };

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className='h-4 w-4 text-green-500' />;
      case 'pending':
        return <AlertCircle className='h-4 w-4 text-yellow-500' />;
      case 'failed':
        return <AlertCircle className='h-4 w-4 text-red-500' />;
      default:
        return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-blue-600 bg-blue-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900'>
            DEPOINTE Lead Intelligence
          </h2>
          <p className='text-gray-600'>
            Internal B2B lead generation and verification system
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className='flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50'
          >
            <Filter className='h-4 w-4' />
            Filters
          </button>
          <button className='flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'>
            <Download className='h-4 w-4' />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600'>Total Leads</p>
              <p className='text-2xl font-bold text-gray-900'>
                {stats.totalLeads.toLocaleString()}
              </p>
            </div>
            <Users className='h-8 w-8 text-blue-600' />
          </div>
        </div>

        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600'>Verified Leads</p>
              <p className='text-2xl font-bold text-green-600'>
                {stats.verifiedLeads}
              </p>
            </div>
            <CheckCircle className='h-8 w-8 text-green-600' />
          </div>
        </div>

        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600'>High Score (85+)</p>
              <p className='text-2xl font-bold text-purple-600'>
                {stats.highScoreLeads}
              </p>
            </div>
            <Star className='h-8 w-8 text-purple-600' />
          </div>
        </div>

        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600'>Assigned</p>
              <p className='text-2xl font-bold text-orange-600'>
                {stats.assignedLeads}
              </p>
            </div>
            <Target className='h-8 w-8 text-orange-600' />
          </div>
        </div>
      </div>

      {/* Campaign Suggestion */}
      <div className='rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6'>
        <div className='flex items-start gap-4'>
          <div className='rounded-full bg-blue-100 p-3'>
            <Target className='h-6 w-6 text-blue-600' />
          </div>
          <div className='flex-1'>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              🚛 Suggested Campaign: "DOT Violation Rescue"
            </h3>
            <p className='mb-4 text-gray-700'>
              Target transportation companies with recent DOT violations who
              need immediate freight solutions. This campaign leverages
              high-intent buying signals and positions DEPOINTE as a
              problem-solver.
            </p>

            <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div className='rounded-lg border border-gray-200 bg-white p-4'>
                <h4 className='mb-2 font-medium text-gray-900'>
                  Target Profile
                </h4>
                <ul className='space-y-1 text-sm text-gray-600'>
                  <li>• Manufacturing companies</li>
                  <li>• Recent DOT violations</li>
                  <li>• $50M-$500M revenue</li>
                  <li>• Fleet operations</li>
                </ul>
              </div>

              <div className='rounded-lg border border-gray-200 bg-white p-4'>
                <h4 className='mb-2 font-medium text-gray-900'>
                  AI Staff Assignment
                </h4>
                <ul className='space-y-1 text-sm text-gray-600'>
                  <li>• Gary: Lead qualification</li>
                  <li>• Desiree: High-intent outreach</li>
                  <li>• Will: Process optimization</li>
                  <li>• Dee: Relationship building</li>
                </ul>
              </div>

              <div className='rounded-lg border border-gray-200 bg-white p-4'>
                <h4 className='mb-2 font-medium text-gray-900'>
                  Expected Results
                </h4>
                <ul className='space-y-1 text-sm text-gray-600'>
                  <li>• 35% response rate</li>
                  <li>• 12% conversion rate</li>
                  <li>• $2.4M avg deal value</li>
                  <li>• 60-day close cycle</li>
                </ul>
              </div>
            </div>

            <div className='flex items-center gap-4'>
              <button className='rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'>
                Launch Campaign
              </button>
              <button className='rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50'>
                Customize Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className='border-b border-gray-200'>
        <div className='flex space-x-8'>
          <button
            onClick={() => setViewMode('leads')}
            className={`border-b-2 px-1 py-4 text-sm font-medium ${
              viewMode === 'leads'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Lead Database
          </button>
          <button
            onClick={() => setViewMode('campaign')}
            className={`border-b-2 px-1 py-4 text-sm font-medium ${
              viewMode === 'campaign'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            DOT Violation Campaign
          </button>
          <button
            onClick={() => setViewMode('email')}
            className={`border-b-2 px-1 py-4 text-sm font-medium ${
              viewMode === 'email'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Email Outreach
          </button>
          <button
            onClick={() => setViewMode('templates')}
            className={`border-b-2 px-1 py-4 text-sm font-medium ${
              viewMode === 'templates'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Email Templates
          </button>
        </div>
      </div>

      {/* Conditional Content */}
      {viewMode === 'campaign' ? (
        <DOTViolationRescueCampaign />
      ) : viewMode === 'email' ? (
        <DEPOINTEEmailOutreach />
      ) : viewMode === 'templates' ? (
        <DEPOINTEEmailTemplateSystem />
      ) : (
        <>
          {/* Search */}
          <div className='rounded-lg border border-gray-200 bg-white p-6'>
            <div className='flex items-center gap-4'>
              <div className='flex-1'>
                <input
                  type='text'
                  placeholder='Search companies, contacts, or industries...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className='flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50'
              >
                <Search className='h-4 w-4' />
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5'>
                <select
                  value={filters.industry}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      industry: e.target.value,
                    }))
                  }
                  className='rounded-lg border border-gray-300 px-3 py-2'
                >
                  <option value=''>All Industries</option>
                  <option value='Manufacturing'>Manufacturing</option>
                  <option value='Steel Manufacturing'>
                    Steel Manufacturing
                  </option>
                  <option value='Chemical'>Chemical</option>
                  <option value='Healthcare'>Healthcare</option>
                  <option value='Retail'>Retail</option>
                </select>

                <select
                  value={filters.revenue}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, revenue: e.target.value }))
                  }
                  className='rounded-lg border border-gray-300 px-3 py-2'
                >
                  <option value=''>All Revenue</option>
                  <option value='$1M - $10M'>$1M - $10M</option>
                  <option value='$10M - $50M'>$10M - $50M</option>
                  <option value='$50M - $100M'>$50M - $100M</option>
                  <option value='$100M - $500M'>$100M - $500M</option>
                  <option value='$500M+'>$500M+</option>
                </select>

                <select
                  value={filters.verificationStatus}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      verificationStatus: e.target.value,
                    }))
                  }
                  className='rounded-lg border border-gray-300 px-3 py-2'
                >
                  <option value=''>All Status</option>
                  <option value='verified'>Verified</option>
                  <option value='pending'>Pending</option>
                  <option value='failed'>Failed</option>
                </select>

                <input
                  type='number'
                  placeholder='Min Lead Score'
                  value={filters.minLeadScore || ''}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      minLeadScore: parseInt(e.target.value) || 0,
                    }))
                  }
                  className='rounded-lg border border-gray-300 px-3 py-2'
                />

                <button
                  onClick={handleSearch}
                  className='rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700'
                >
                  Apply Filters
                </button>
              </div>
            )}
          </div>

          {/* Email Queue Status */}
          {emailQueue.length > 0 && (
            <div className='mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4'>
              <div className='flex items-center gap-2'>
                <Mail className='h-5 w-5 text-blue-600' />
                <span className='text-sm font-medium text-blue-900'>
                  {emailQueue.length} email{emailQueue.length !== 1 ? 's' : ''}{' '}
                  being sent...
                </span>
              </div>
            </div>
          )}

          {/* Bulk Actions */}
          {selectedLeads.length > 0 && (
            <div className='mb-4 rounded-lg border border-green-200 bg-green-50 p-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium text-green-900'>
                  {selectedLeads.length} lead
                  {selectedLeads.length !== 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={triggerBulkEmailSequence}
                  className='inline-flex items-center rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700'
                >
                  <Mail className='mr-2 h-4 w-4' />
                  Send Bulk Emails
                </button>
              </div>
            </div>
          )}

          {/* Results */}
          <div className='overflow-hidden rounded-lg border border-gray-200 bg-white'>
            <div className='border-b border-gray-200 px-6 py-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-medium text-gray-900'>
                  Lead Results ({filteredLeads.length})
                </h3>
                <div className='text-sm text-gray-600'>
                  {emailQueue.length > 0 && (
                    <span className='text-blue-600'>
                      {emailQueue.length} sending...
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                      <input
                        type='checkbox'
                        checked={
                          selectedLeads.length === filteredLeads.length &&
                          filteredLeads.length > 0
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLeads(
                              filteredLeads.map((lead) => lead.id)
                            );
                          } else {
                            setSelectedLeads([]);
                          }
                        }}
                        className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                      />
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                      Company & Contact
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                      Industry & Size
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                      Contact Info
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                      Score & Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                      Buying Signals
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                      Campaign Type
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                      Assignment
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                      Email Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 bg-white'>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4'>
                        <input
                          type='checkbox'
                          checked={selectedLeads.includes(lead.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedLeads([...selectedLeads, lead.id]);
                            } else {
                              setSelectedLeads(
                                selectedLeads.filter((id) => id !== lead.id)
                              );
                            }
                          }}
                          className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                        />
                      </td>
                      <td className='px-6 py-4'>
                        <div>
                          <div className='flex items-center gap-2'>
                            <Building2 className='h-4 w-4 text-gray-400' />
                            <span className='font-medium text-gray-900'>
                              {lead.companyName}
                            </span>
                          </div>
                          <div className='text-sm text-gray-600'>
                            {lead.contactName} • {lead.title}
                          </div>
                          <div className='text-xs text-gray-500'>
                            {lead.location}
                          </div>
                        </div>
                      </td>

                      <td className='px-6 py-4'>
                        <div className='text-sm text-gray-900'>
                          {lead.industry}
                        </div>
                        <div className='text-xs text-gray-500'>
                          {lead.revenue}
                        </div>
                        <div className='text-xs text-gray-500'>
                          {lead.employees} employees
                        </div>
                      </td>

                      <td className='px-6 py-4'>
                        <div className='mb-1 flex items-center gap-1 text-sm text-gray-600'>
                          <Mail className='h-3 w-3' />
                          {lead.email}
                        </div>
                        <div className='flex items-center gap-1 text-sm text-gray-600'>
                          <Phone className='h-3 w-3' />
                          {lead.phone}
                        </div>
                      </td>

                      <td className='px-6 py-4'>
                        <div className='mb-2 flex items-center gap-2'>
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${getScoreColor(lead.leadScore)}`}
                          >
                            {lead.leadScore}
                          </span>
                        </div>
                        <div className='flex items-center gap-1'>
                          {getVerificationIcon(lead.verificationStatus)}
                          <span className='text-xs text-gray-600 capitalize'>
                            {lead.verificationStatus}
                          </span>
                        </div>
                      </td>

                      <td className='px-6 py-4'>
                        <div className='space-y-1'>
                          {lead.buyingSignals.map((signal, index) => (
                            <span
                              key={index}
                              className='mr-1 inline-block rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-800'
                            >
                              {signal}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className='px-6 py-4'>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            lead.campaignType === 'compliance'
                              ? 'bg-red-100 text-red-800'
                              : lead.campaignType === 'capacity'
                                ? 'bg-purple-100 text-purple-800'
                                : lead.campaignType === 'reliability'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {lead.campaignType || 'General'}
                        </span>
                      </td>

                      <td className='px-6 py-4'>
                        {lead.assignedTo ? (
                          <span className='inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs text-green-800'>
                            {lead.assignedTo}
                          </span>
                        ) : (
                          <select
                            onChange={(e) =>
                              handleAssignLead(lead.id, e.target.value)
                            }
                            className='rounded border border-gray-300 px-2 py-1 text-xs'
                          >
                            <option value=''>Assign to...</option>
                            <option value='Gary'>Gary</option>
                            <option value='Desiree'>Desiree</option>
                            <option value='Cliff'>Cliff</option>
                            <option value='Will'>Will</option>
                            <option value='Dee'>Dee</option>
                          </select>
                        )}
                      </td>

                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          {lead.campaignType && (
                            <button
                              onClick={() => triggerLeadEmailSequence(lead)}
                              className='inline-flex items-center rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700'
                              disabled={emailQueue.some(
                                (l) => l.id === lead.id
                              )}
                            >
                              {emailQueue.some((l) => l.id === lead.id) ? (
                                <>
                                  <div className='mr-1 h-3 w-3 animate-spin rounded-full border border-white border-t-transparent'></div>
                                  Sending...
                                </>
                              ) : (
                                <>
                                  <Mail className='mr-1 h-3 w-3' />
                                  Send Email
                                </>
                              )}
                            </button>
                          )}
                          {selectedLeads.includes(lead.id) && (
                            <span className='text-xs text-green-600'>
                              Selected
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
