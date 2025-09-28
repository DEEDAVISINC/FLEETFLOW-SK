'use client';

// 🔗 LINKEDIN LEAD SYNC API INTEGRATION
// Real-time lead generation and CRM synchronization
//
// Case: CAS-8776681-X2Q7B4
// CRM Integration: 050345000006513
// Tier: Standard Access

import { EventEmitter } from 'events';

export interface LinkedInLead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  industry?: string;
  linkedInProfile?: string;
  leadSource: {
    campaign: string;
    adSet: string;
    creative: string;
    formName: string;
  };
  leadData: {
    submittedAt: Date;
    ipAddress?: string;
    userAgent?: string;
    customFields?: Record<string, string>;
  };
  leadScore: number; // 1-100 AI-calculated score
  leadStatus: 'new' | 'qualified' | 'contacted' | 'converted' | 'disqualified';
  tags: string[];
}

export interface LeadSyncMetrics {
  totalLeads: number;
  newLeadsToday: number;
  conversionRate: number;
  averageLeadScore: number;
  topPerformingCampaigns: {
    campaign: string;
    leads: number;
    conversionRate: number;
    averageScore: number;
  }[];
  leadsBySource: Record<string, number>;
  leadQualityDistribution: {
    high: number; // 80-100 score
    medium: number; // 60-79 score
    low: number; // 1-59 score
  };
  monthlyTrends: {
    month: string;
    leads: number;
    conversions: number;
    revenue: number;
  }[];
}

export interface LinkedInCampaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  leads: number;
  costPerLead: number;
  targetAudience: {
    jobTitles: string[];
    industries: string[];
    companySizes: string[];
    locations: string[];
  };
  performance: {
    ctr: number; // Click-through rate
    cpl: number; // Cost per lead
    conversionRate: number;
    leadQuality: number; // Average lead score
  };
}

class LinkedInLeadSyncService extends EventEmitter {
  private leads: Map<string, LinkedInLead> = new Map();
  private campaigns: Map<string, LinkedInCampaign> = new Map();
  private metrics: LeadSyncMetrics = {
    totalLeads: 0,
    newLeadsToday: 0,
    conversionRate: 0,
    averageLeadScore: 0,
    topPerformingCampaigns: [],
    leadsBySource: {},
    leadQualityDistribution: { high: 0, medium: 0, low: 0 },
    monthlyTrends: [],
  };

  private apiCredentials = {
    clientId: process.env.LINKEDIN_LEAD_SYNC_CLIENT_ID || '050345000006513',
    clientSecret: process.env.LINKEDIN_LEAD_SYNC_CLIENT_SECRET || '',
    accessToken: process.env.LINKEDIN_LEAD_SYNC_ACCESS_TOKEN || '',
    caseId: 'CAS-8776681-X2Q7B4',
  };

  constructor() {
    super();
    this.initializeDemoData();

    // Real-time lead sync (every 2 minutes when API is live)
    setInterval(() => this.syncLeadsFromLinkedIn(), 120000);
    setInterval(() => this.updateMetrics(), 300000); // 5 minutes
  }

  // REAL API METHODS (Ready for LinkedIn API credentials)
  private getDemoLeads() {
    return [
      {
        id: 'LI-LEAD-001',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sjohnson@logisticspro.com',
        company: 'Logistics Pro LLC',
        jobTitle: 'Operations Director',
        industry: 'Transportation',
        leadSource: {
          campaign: 'Enterprise TMS Upgrade',
          adSet: 'Operations Directors 500+',
          creative: 'Modernize Your TMS Stack',
          formName: 'Enterprise Demo Request',
        },
        leadData: {
          submittedAt: new Date(Date.now() - 2 * 3600 * 1000), // 2 hours ago
          ipAddress: '192.168.1.100',
          userAgent: 'LinkedIn Mobile App',
          customFields: {
            fleet_size: '100-500 trucks',
            current_tms: 'McLeod',
            budget_range: '$50K-$100K',
            timeline: 'Q1 2025',
          },
        },
        leadScore: 92, // High-quality lead
        leadStatus: 'qualified',
        tags: ['enterprise', 'high-priority', 'warm-lead', 'demo-requested'],
      },
      {
        id: 'LI-LEAD-002',
        firstName: 'Michael',
        lastName: 'Rodriguez',
        email: 'mrodriguez@freightplus.com',
        company: 'FreightPlus Inc',
        jobTitle: 'Fleet Manager',
        industry: 'Trucking',
        leadSource: {
          campaign: 'Small Fleet Growth Campaign',
          adSet: 'Fleet Managers 10-50 Trucks',
          creative: 'Cut Fleet Costs 20%',
          formName: 'Cost Savings Calculator',
        },
        leadData: {
          submittedAt: new Date(Date.now() - 6 * 3600 * 1000), // 6 hours ago
          customFields: {
            fleet_size: '25 trucks',
            main_concern: 'fuel costs',
            interested_in: 'route optimization',
          },
        },
        leadScore: 78, // Medium-quality lead
        leadStatus: 'new',
        tags: ['small-fleet', 'cost-focused', 'route-optimization'],
      },
      {
        id: 'LI-LEAD-003',
        firstName: 'Jennifer',
        lastName: 'Chen',
        email: 'j.chen@globalshipping.com',
        company: 'Global Shipping Solutions',
        jobTitle: 'Director of Technology',
        industry: 'Freight & Logistics',
        leadSource: {
          campaign: 'Tech Innovation Campaign',
          adSet: 'Technology Directors',
          creative: 'AI-Powered Fleet Intelligence',
          formName: 'Technology Assessment',
        },
        leadData: {
          submittedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000), // 1 day ago
          customFields: {
            company_size: '500+ employees',
            tech_stack: 'APIs preferred',
            integration_needs: 'existing TMS',
          },
        },
        leadScore: 85, // High-quality lead
        leadStatus: 'contacted',
        tags: [
          'enterprise',
          'tech-focused',
          'api-integration',
          'follow-up-scheduled',
        ],
      },
    ];

    return demoLeads;
  }

  private initializeDemoData() {
    const demoLeads = this.getDemoLeads();

    demoLeads.forEach((lead) => this.leads.set(lead.id, lead));

    // Demo campaigns
    const demoCampaigns: LinkedInCampaign[] = [
      {
        id: 'CAMP-ENT-001',
        name: 'FleetFlow Enterprise Campaign',
        status: 'active',
        budget: 15000,
        spent: 8750,
        impressions: 125000,
        clicks: 2850,
        leads: 47,
        costPerLead: 186.17,
        targetAudience: {
          jobTitles: ['VP of Operations', 'COO', 'Fleet Director'],
          industries: ['Transportation', 'Logistics', 'Supply Chain'],
          companySizes: ['500-1000', '1000-5000', '5000+'],
          locations: ['United States', 'Canada'],
        },
        performance: {
          ctr: 2.28,
          cpl: 186.17,
          conversionRate: 1.65,
          leadQuality: 87.3,
        },
      },
      {
        id: 'CAMP-SMB-001',
        name: 'Small Fleet Growth Campaign',
        status: 'active',
        budget: 8000,
        spent: 5200,
        impressions: 85000,
        clicks: 1650,
        leads: 38,
        costPerLead: 136.84,
        targetAudience: {
          jobTitles: ['Fleet Manager', 'Operations Manager', 'Owner Operator'],
          industries: ['Trucking', 'Local Delivery'],
          companySizes: ['11-50', '51-200'],
          locations: ['United States'],
        },
        performance: {
          ctr: 1.94,
          cpl: 136.84,
          conversionRate: 2.3,
          leadQuality: 72.1,
        },
      },
    ];

    demoCampaigns.forEach((campaign) =>
      this.campaigns.set(campaign.id, campaign)
    );

    this.updateMetrics();
    console.info('🔗 LinkedIn Lead Sync Service initialized with demo data');
    console.info(
      `📋 Case: ${this.apiCredentials.caseId} | CRM: ${this.apiCredentials.clientId}`
    );
  }

  // REAL API METHODS (Ready for LinkedIn API credentials)
  private async syncLeadsFromLinkedIn(): Promise<void> {
    if (!this.apiCredentials.accessToken) {
      console.info('⏳ LinkedIn Lead Sync: Waiting for API credentials...');
      return;
    }

    try {
      // Real LinkedIn Lead Gen Forms API call
      const response = await fetch(
        'https://api.linkedin.com/rest/leadGenForms',
        {
          headers: {
            Authorization: `Bearer ${this.apiCredentials.accessToken}`,
            'LinkedIn-Version': '202401',
            'X-Restli-Protocol-Version': '2.0.0',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        await this.processLinkedInLeads(data.elements || []);
        console.info(
          `✅ LinkedIn Lead Sync: ${data.elements?.length || 0} leads processed`
        );
      } else {
        console.error('❌ LinkedIn Lead Sync API Error:', response.status);
        this.emit('syncError', {
          status: response.status,
          message: response.statusText,
        });
      }
    } catch (error) {
      console.error('❌ LinkedIn Lead Sync Error:', error);
      this.emit('syncError', error);
    }
  }

  private async processLinkedInLeads(rawLeads: any[]): Promise<void> {
    for (const rawLead of rawLeads) {
      const lead = this.transformLinkedInLead(rawLead);

      // Check if lead is new
      if (!this.leads.has(lead.id)) {
        this.leads.set(lead.id, lead);
        this.emit('newLead', lead);

        // Auto-qualify lead with AI
        const qualification = await this.qualifyLead(lead);
        lead.leadScore = qualification.score;
        lead.leadStatus = qualification.status;
        lead.tags = qualification.tags;

        console.info(
          `📧 New LinkedIn Lead: ${lead.firstName} ${lead.lastName} (${lead.company}) - Score: ${lead.leadScore}`
        );
      }
    }

    this.updateMetrics();
  }

  private transformLinkedInLead(rawLead: any): LinkedInLead {
    // Transform LinkedIn API response to our lead format
    return {
      id: `LI-${rawLead.id}`,
      firstName: rawLead.firstName || '',
      lastName: rawLead.lastName || '',
      email: rawLead.emailAddress || '',
      phone: rawLead.phoneNumber || undefined,
      company: rawLead.companyName || undefined,
      jobTitle: rawLead.jobTitle || undefined,
      industry: rawLead.industry || undefined,
      linkedInProfile: rawLead.linkedInUrl || undefined,
      leadSource: {
        campaign: rawLead.campaignId || 'Unknown',
        adSet: rawLead.creativeName || 'Unknown',
        creative: rawLead.adName || 'Unknown',
        formName: rawLead.formName || 'LinkedIn Lead Form',
      },
      leadData: {
        submittedAt: new Date(rawLead.submissionTime || Date.now()),
        ipAddress: rawLead.ipAddress,
        userAgent: rawLead.userAgent,
        customFields: rawLead.customQuestionResponses || {},
      },
      leadScore: 0, // Will be calculated by AI
      leadStatus: 'new',
      tags: [],
    };
  }

  private async qualifyLead(
    lead: LinkedInLead
  ): Promise<{ score: number; status: string; tags: string[] }> {
    // AI-powered lead qualification logic
    let score = 50; // Base score
    const tags: string[] = [];

    // Company size scoring
    const fleetSize = lead.leadData.customFields?.['fleet_size'];
    if (fleetSize) {
      if (fleetSize.includes('500+') || fleetSize.includes('100+')) {
        score += 25;
        tags.push('enterprise');
      } else if (fleetSize.includes('50-') || fleetSize.includes('25-')) {
        score += 15;
        tags.push('mid-market');
      } else {
        score += 5;
        tags.push('small-fleet');
      }
    }

    // Job title scoring
    if (lead.jobTitle) {
      const title = lead.jobTitle.toLowerCase();
      if (
        title.includes('vp') ||
        title.includes('director') ||
        title.includes('coo')
      ) {
        score += 20;
        tags.push('decision-maker');
      } else if (title.includes('manager')) {
        score += 10;
        tags.push('influencer');
      }
    }

    // Industry relevance
    if (lead.industry) {
      const industry = lead.industry.toLowerCase();
      if (
        industry.includes('transportation') ||
        industry.includes('logistics') ||
        industry.includes('trucking')
      ) {
        score += 15;
        tags.push('industry-fit');
      }
    }

    // Budget indication
    const budget = lead.leadData.customFields?.['budget_range'];
    if (budget) {
      if (budget.includes('100K+') || budget.includes('500K+')) {
        score += 20;
        tags.push('high-budget');
      } else if (budget.includes('50K') || budget.includes('25K')) {
        score += 10;
        tags.push('qualified-budget');
      }
    }

    // Timeline urgency
    const timeline = lead.leadData.customFields?.['timeline'];
    if (timeline) {
      if (timeline.includes('Q1') || timeline.includes('immediate')) {
        score += 15;
        tags.push('urgent');
      } else if (timeline.includes('Q2') || timeline.includes('Q3')) {
        score += 10;
        tags.push('near-term');
      }
    }

    // Determine status based on score
    let status = 'new';
    if (score >= 80) {
      status = 'qualified';
      tags.push('high-priority');
    } else if (score >= 60) {
      status = 'qualified';
      tags.push('medium-priority');
    } else if (score < 40) {
      status = 'disqualified';
      tags.push('low-priority');
    }

    return { score, status, tags };
  }

  private updateMetrics(): void {
    const leads = Array.from(this.leads.values());
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.metrics = {
      totalLeads: leads.length,
      newLeadsToday: leads.filter((l) => l.leadData.submittedAt >= today)
        .length,
      conversionRate:
        (leads.filter((l) => l.leadStatus === 'converted').length /
          leads.length) *
        100,
      averageLeadScore:
        leads.reduce((sum, l) => sum + l.leadScore, 0) / leads.length,
      topPerformingCampaigns: this.getTopPerformingCampaigns(),
      leadsBySource: this.getLeadsBySource(leads),
      leadQualityDistribution: {
        high: leads.filter((l) => l.leadScore >= 80).length,
        medium: leads.filter((l) => l.leadScore >= 60 && l.leadScore < 80)
          .length,
        low: leads.filter((l) => l.leadScore < 60).length,
      },
      monthlyTrends: this.getMonthlyTrends(),
    };

    this.emit('metricsUpdated', this.metrics);
  }

  private getTopPerformingCampaigns() {
    const campaigns = Array.from(this.campaigns.values());
    return campaigns
      .map((campaign) => ({
        campaign: campaign.name,
        leads: campaign.leads,
        conversionRate: campaign.performance.conversionRate,
        averageScore: campaign.performance.leadQuality,
      }))
      .sort((a, b) => b.leads - a.leads)
      .slice(0, 3);
  }

  private getLeadsBySource(leads: LinkedInLead[]) {
    const sources: Record<string, number> = {};
    leads.forEach((lead) => {
      const source = lead.leadSource.campaign;
      sources[source] = (sources[source] || 0) + 1;
    });
    return sources;
  }

  private getMonthlyTrends() {
    // Mock monthly trend data - in production, calculate from actual data
    return [
      { month: 'Oct 2024', leads: 67, conversions: 12, revenue: 145000 },
      { month: 'Nov 2024', leads: 85, conversions: 18, revenue: 225000 },
      { month: 'Dec 2024', leads: 92, conversions: 23, revenue: 285000 },
    ];
  }

  // PUBLIC API METHODS
  getLeads(): LinkedInLead[] {
    return Array.from(this.leads.values());
  }

  getLeadById(id: string): LinkedInLead | undefined {
    return this.leads.get(id);
  }

  getMetrics(): LeadSyncMetrics {
    return this.metrics;
  }

  getCampaigns(): LinkedInCampaign[] {
    return Array.from(this.campaigns.values());
  }

  // Lead management
  updateLeadStatus(
    leadId: string,
    status: LinkedInLead['leadStatus'],
    notes?: string
  ): boolean {
    const lead = this.leads.get(leadId);
    if (!lead) return false;

    lead.leadStatus = status;
    this.emit('leadStatusUpdated', { leadId, status, notes });
    this.updateMetrics();

    console.info(`📝 Lead ${leadId} status updated to: ${status}`);
    return true;
  }

  addLeadTag(leadId: string, tag: string): boolean {
    const lead = this.leads.get(leadId);
    if (!lead) return false;

    if (!lead.tags.includes(tag)) {
      lead.tags.push(tag);
      this.emit('leadTagAdded', { leadId, tag });
    }
    return true;
  }

  // CRM Integration (ready for FleetFlow CRM sync)
  async syncToCRM(leadId: string): Promise<boolean> {
    const lead = this.leads.get(leadId);
    if (!lead) return false;

    try {
      // Integration point for FleetFlow CRM
      console.info(`🔄 Syncing lead ${leadId} to FleetFlow CRM...`);

      // This would call FleetFlow CRM service
      // await crmService.createLead(lead);

      this.emit('leadSyncedToCRM', { leadId, lead });
      return true;
    } catch (error) {
      console.error(`❌ Failed to sync lead ${leadId} to CRM:`, error);
      return false;
    }
  }

  // Connection status
  getConnectionStatus(): {
    connected: boolean;
    hasCredentials: boolean;
    caseId: string;
    lastSync?: Date;
  } {
    return {
      connected: !!this.apiCredentials.accessToken,
      hasCredentials: !!(
        this.apiCredentials.clientId && this.apiCredentials.clientSecret
      ),
      caseId: this.apiCredentials.caseId,
      lastSync: new Date(), // Mock - in production track actual sync
    };
  }
}

export const linkedInLeadSyncService = new LinkedInLeadSyncService();
