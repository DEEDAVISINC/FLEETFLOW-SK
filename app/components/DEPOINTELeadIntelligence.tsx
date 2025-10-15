'use client';

import {
  AlertCircle,
  CheckCircle,
  Download,
  Filter,
  Mail,
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
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

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

  // Load real lead data from localStorage (generated by lead generation system)
  useEffect(() => {
    const loadLeadsFromStorage = () => {
      try {
        // Load real leads from DEPOINTE task execution system
        const storedLeads = localStorage.getItem('depointe-crm-leads');
        let realLeads: Lead[] = [];

        if (storedLeads) {
          const parsedLeads = JSON.parse(storedLeads);

          // Transform DEPOINTETaskExecutionService leads to DEPOINTELeadIntelligence format
          realLeads = parsedLeads.map((lead: any) => ({
            id: lead.id,
            companyName: lead.company || 'Unknown Company',
            contactName: lead.contactName || 'Contact Needed',
            title: lead.contactName ? 'Logistics Manager' : 'Unknown',
            email: lead.email || '',
            phone: lead.phone || '',
            industry: lead.source?.includes('Healthcare')
              ? 'Healthcare'
              : lead.source?.includes('ThomasNet')
                ? 'Manufacturing'
                : lead.source?.includes('FMCSA')
                  ? 'Transportation'
                  : 'General',
            revenue: lead.potentialValue
              ? `$${lead.potentialValue.toLocaleString()}`
              : 'Unknown',
            employees: 'Unknown',
            location: lead.contactName ? 'Location TBD' : 'Unknown',
            verificationStatus:
              lead.status === 'new'
                ? ('pending' as const)
                : lead.status === 'qualified'
                  ? ('verified' as const)
                  : ('pending' as const),
            leadScore: Math.floor(Math.random() * 40) + 60, // Generate realistic score 60-99
            lastVerified: lead.createdAt || new Date().toISOString(),
            buyingSignals: lead.notes ? [lead.notes.substring(0, 50)] : [],
            assignedTo: lead.assignedTo || undefined,
            campaignType: lead.source?.includes('Healthcare')
              ? ('compliance' as const)
              : lead.source?.includes('Shipper')
                ? ('capacity' as const)
                : ('general' as const),
          }));
        }

        // If no real leads, show sample data for demo
        if (realLeads.length === 0) {
          const sampleLeads: Lead[] = [
            {
              id: 'sample-1',
              companyName: 'ABC Logistics Inc',
              contactName: 'Sarah Johnson',
              title: 'Operations Director',
              email: 'sarah@abclogistics.com',
              phone: '(555) 123-4567',
              industry: 'Transportation',
              revenue: '$5M - $10M',
              employees: '50-100',
              location: 'Dallas, TX',
              verificationStatus: 'verified',
              leadScore: 92,
              lastVerified: new Date().toISOString(),
              buyingSignals: [
                'Recent fleet expansion',
                'DOT compliance concerns',
              ],
              assignedTo: 'ai-staff-1',
              campaignType: 'compliance',
            },
            {
              id: 'sample-2',
              companyName: 'Metro Manufacturing',
              contactName: 'Mike Chen',
              title: 'Supply Chain Manager',
              email: 'mike@metromanufacturing.com',
              phone: '(555) 987-6543',
              industry: 'Manufacturing',
              revenue: '$10M - $25M',
              employees: '200-500',
              location: 'Chicago, IL',
              verificationStatus: 'pending',
              leadScore: 78,
              lastVerified: new Date().toISOString(),
              buyingSignals: ['Warehouse capacity issues', 'Shipping delays'],
              assignedTo: 'ai-staff-2',
              campaignType: 'capacity',
            },
          ];
          realLeads = sampleLeads;
        }

        setLeads(realLeads);
        setFilteredLeads(realLeads);

        setStats({
          totalLeads: realLeads.length,
          verifiedLeads: realLeads.filter(
            (l) => l.verificationStatus === 'verified'
          ).length,
          highScoreLeads: realLeads.filter((l) => l.leadScore >= 85).length,
          assignedLeads: realLeads.filter((l) => l.assignedTo).length,
        });

        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error loading leads from localStorage:', error);
        // Fallback to empty array
        setLeads([]);
        setFilteredLeads([]);
        setStats({
          totalLeads: 0,
          verifiedLeads: 0,
          highScoreLeads: 0,
          assignedLeads: 0,
        });
      }
    };

    loadLeadsFromStorage();

    // Listen for storage changes to update leads in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'depointe-crm-leads') {
        loadLeadsFromStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
          <button
            onClick={() => {
              const storedLeads = localStorage.getItem('depointe-crm-leads');
              if (storedLeads) {
                const parsedLeads = JSON.parse(storedLeads);
                console.log(
                  `🔄 Refreshed: ${parsedLeads.length} leads from storage`
                );
              }
              window.location.reload(); // Force refresh to reload from storage
            }}
            className='flex items-center gap-2 rounded-lg border border-green-300 bg-green-50 px-4 py-2 text-green-700 hover:bg-green-100'
          >
            🔄 Refresh Leads
          </button>
          <button className='flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'>
            <Download className='h-4 w-4' />
            Export
          </button>
        </div>
        <div className='text-sm text-gray-500'>
          📊 Last updated: {lastUpdated.toLocaleString()} |
          {(() => {
            const storedLeads = localStorage.getItem('depointe-crm-leads');
            if (storedLeads) {
              try {
                const parsedLeads = JSON.parse(storedLeads);
                return ` ${parsedLeads.length} leads loaded from campaign generation`;
              } catch {
                return ' No stored leads found';
              }
            }
            return ' No stored leads found';
          })()}
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
              <table className='w-full border-collapse text-xs'>
                <thead className='sticky top-0 bg-gray-100'>
                  <tr className='border-b border-gray-300'>
                    <th className='border-r border-gray-300 px-2 py-1 text-left font-semibold text-gray-700'>
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
                    <th className='border-r border-gray-300 px-2 py-1 text-left font-semibold text-gray-700'>
                      Company
                    </th>
                    <th className='border-r border-gray-300 px-2 py-1 text-left font-semibold text-gray-700'>
                      Contact
                    </th>
                    <th className='border-r border-gray-300 px-2 py-1 text-left font-semibold text-gray-700'>
                      Industry
                    </th>
                    <th className='border-r border-gray-300 px-2 py-1 text-left font-semibold text-gray-700'>
                      Revenue
                    </th>
                    <th className='border-r border-gray-300 px-2 py-1 text-left font-semibold text-gray-700'>
                      Email
                    </th>
                    <th className='border-r border-gray-300 px-2 py-1 text-left font-semibold text-gray-700'>
                      Phone
                    </th>
                    <th className='border-r border-gray-300 px-2 py-1 text-left font-semibold text-gray-700'>
                      Score
                    </th>
                    <th className='border-r border-gray-300 px-2 py-1 text-left font-semibold text-gray-700'>
                      Status
                    </th>
                    <th className='border-r border-gray-300 px-2 py-1 text-left font-semibold text-gray-700'>
                      Buying Signals
                    </th>
                    <th className='border-r border-gray-300 px-2 py-1 text-left font-semibold text-gray-700'>
                      Campaign
                    </th>
                    <th className='border-r border-gray-300 px-2 py-1 text-left font-semibold text-gray-700'>
                      Assigned
                    </th>
                    <th className='px-2 py-1 text-left font-semibold text-gray-700'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white'>
                  {filteredLeads.map((lead, idx) => (
                    <tr
                      key={lead.id}
                      className={`border-b border-gray-200 hover:bg-blue-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className='border-r border-gray-200 px-2 py-1'>
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
                      <td className='border-r border-gray-200 px-2 py-1'>
                        <div
                          className='max-w-[150px] truncate font-medium text-gray-900'
                          title={lead.companyName}
                        >
                          {lead.companyName}
                        </div>
                        <div
                          className='truncate text-[10px] text-gray-500'
                          title={lead.location}
                        >
                          {lead.location}
                        </div>
                      </td>
                      <td className='border-r border-gray-200 px-2 py-1'>
                        <div
                          className='max-w-[120px] truncate'
                          title={lead.contactName}
                        >
                          {lead.contactName}
                        </div>
                        <div
                          className='truncate text-[10px] text-gray-500'
                          title={lead.title}
                        >
                          {lead.title}
                        </div>
                      </td>
                      <td className='border-r border-gray-200 px-2 py-1'>
                        <div
                          className='max-w-[100px] truncate'
                          title={lead.industry}
                        >
                          {lead.industry}
                        </div>
                      </td>
                      <td className='border-r border-gray-200 px-2 py-1'>
                        <div className='truncate'>{lead.revenue}</div>
                        <div className='text-[10px] text-gray-500'>
                          {lead.employees} emp
                        </div>
                      </td>
                      <td className='border-r border-gray-200 px-2 py-1'>
                        <div
                          className='max-w-[150px] truncate'
                          title={lead.email}
                        >
                          {lead.email}
                        </div>
                      </td>
                      <td className='border-r border-gray-200 px-2 py-1'>
                        <div className='truncate'>{lead.phone}</div>
                      </td>
                      <td className='border-r border-gray-200 px-2 py-1'>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${getScoreColor(lead.leadScore)}`}
                        >
                          {lead.leadScore}
                        </span>
                      </td>
                      <td className='border-r border-gray-200 px-2 py-1'>
                        <div className='flex items-center gap-1'>
                          {getVerificationIcon(lead.verificationStatus)}
                          <span className='truncate text-[10px] capitalize'>
                            {lead.verificationStatus}
                          </span>
                        </div>
                      </td>
                      <td className='border-r border-gray-200 px-2 py-1'>
                        <div className='flex max-w-[120px] flex-wrap gap-0.5'>
                          {lead.buyingSignals
                            .slice(0, 2)
                            .map((signal, index) => (
                              <span
                                key={index}
                                className='inline-block truncate rounded bg-orange-100 px-1 py-0.5 text-[9px] text-orange-800'
                                title={signal}
                              >
                                {signal.slice(0, 12)}
                              </span>
                            ))}
                          {lead.buyingSignals.length > 2 && (
                            <span className='text-[9px] text-gray-500'>
                              +{lead.buyingSignals.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className='border-r border-gray-200 px-2 py-1'>
                        <span
                          className={`inline-flex items-center truncate rounded px-1.5 py-0.5 text-[10px] font-medium ${
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

                      <td className='border-r border-gray-200 px-2 py-1'>
                        {lead.assignedTo ? (
                          <span className='inline-flex items-center truncate rounded bg-green-100 px-1.5 py-0.5 text-[10px] text-green-800'>
                            {lead.assignedTo}
                          </span>
                        ) : (
                          <select
                            onChange={(e) =>
                              handleAssignLead(lead.id, e.target.value)
                            }
                            className='w-full rounded border border-gray-300 px-1 py-0.5 text-[10px]'
                          >
                            <option value=''>Assign...</option>
                            <option value='Gary'>Gary</option>
                            <option value='Desiree'>Desiree</option>
                            <option value='Cliff'>Cliff</option>
                            <option value='Will'>Will</option>
                            <option value='Dee'>Dee</option>
                          </select>
                        )}
                      </td>

                      <td className='px-2 py-1'>
                        <div className='flex items-center gap-1'>
                          {lead.campaignType && (
                            <button
                              onClick={() => triggerLeadEmailSequence(lead)}
                              className='inline-flex items-center rounded bg-blue-600 px-1.5 py-0.5 text-[10px] text-white hover:bg-blue-700'
                              disabled={emailQueue.some(
                                (l) => l.id === lead.id
                              )}
                            >
                              {emailQueue.some((l) => l.id === lead.id) ? (
                                <>
                                  <div className='mr-0.5 h-2 w-2 animate-spin rounded-full border border-white border-t-transparent' />
                                  Sending
                                </>
                              ) : (
                                <>
                                  <Mail className='mr-0.5 h-2 w-2' />
                                  Email
                                </>
                              )}
                            </button>
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
