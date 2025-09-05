/**
 * DEPOINTE Lead Intelligence Service
 * Internal B2B lead generation system for AI staff operations
 */

export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  title: string;
  email: string;
  phone: string;
  linkedinUrl?: string;
  industry: string;
  revenue: string;
  employees: string;
  location: string;
  address?: string;
  website?: string;
  verificationStatus: 'verified' | 'pending' | 'failed';
  leadScore: number;
  lastVerified: string;
  buyingSignals: string[];
  assignedTo?: string;
  dotNumber?: string;
  fmcsaRating?: string;
  equipmentTypes?: string[];
  shippingVolume?: string;
  painPoints?: string[];
  decisionMakers?: DecisionMaker[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DecisionMaker {
  name: string;
  title: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  department: string;
  influence: 'high' | 'medium' | 'low';
}

export interface SearchCriteria {
  industry?: string[];
  revenue?: string[];
  employees?: string[];
  location?: string[];
  verificationStatus?: string[];
  minLeadScore?: number;
  maxLeadScore?: number;
  buyingSignals?: string[];
  equipmentTypes?: string[];
  keywords?: string;
  assignedTo?: string[];
}

export interface VerificationResult {
  email: {
    valid: boolean;
    deliverable: boolean;
    riskLevel: 'low' | 'medium' | 'high';
  };
  phone: {
    valid: boolean;
    carrier: string;
    lineType: 'mobile' | 'landline' | 'voip';
  };
  company: {
    exists: boolean;
    website: boolean;
    socialMedia: boolean;
    businessRegistration: boolean;
  };
  overall: 'verified' | 'pending' | 'failed';
}

export class DEPOINTELeadIntelligenceService {
  private static instance: DEPOINTELeadIntelligenceService;
  private leads: Map<string, Lead> = new Map();

  public static getInstance(): DEPOINTELeadIntelligenceService {
    if (!DEPOINTELeadIntelligenceService.instance) {
      DEPOINTELeadIntelligenceService.instance =
        new DEPOINTELeadIntelligenceService();
    }
    return DEPOINTELeadIntelligenceService.instance;
  }

  /**
   * Search leads based on criteria
   */
  async searchLeads(criteria: SearchCriteria): Promise<Lead[]> {
    // In production, this would query the database
    // For now, return mock data based on criteria

    const mockLeads = await this.generateMockLeads();
    let filteredLeads = Array.from(mockLeads.values());

    // Apply filters
    if (criteria.industry?.length) {
      filteredLeads = filteredLeads.filter((lead) =>
        criteria.industry!.includes(lead.industry)
      );
    }

    if (criteria.verificationStatus?.length) {
      filteredLeads = filteredLeads.filter((lead) =>
        criteria.verificationStatus!.includes(lead.verificationStatus)
      );
    }

    if (criteria.minLeadScore !== undefined) {
      filteredLeads = filteredLeads.filter(
        (lead) => lead.leadScore >= criteria.minLeadScore!
      );
    }

    if (criteria.keywords) {
      const keywords = criteria.keywords.toLowerCase();
      filteredLeads = filteredLeads.filter(
        (lead) =>
          lead.companyName.toLowerCase().includes(keywords) ||
          lead.contactName.toLowerCase().includes(keywords) ||
          lead.industry.toLowerCase().includes(keywords)
      );
    }

    return filteredLeads;
  }

  /**
   * Get lead by ID
   */
  async getLeadById(id: string): Promise<Lead | null> {
    const leads = await this.generateMockLeads();
    return leads.get(id) || null;
  }

  /**
   * Verify lead contact information
   */
  async verifyLead(leadId: string): Promise<VerificationResult> {
    // Simulate verification process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock verification result
    const verificationResult: VerificationResult = {
      email: {
        valid: Math.random() > 0.1,
        deliverable: Math.random() > 0.05,
        riskLevel:
          Math.random() > 0.8 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
      },
      phone: {
        valid: Math.random() > 0.15,
        carrier: ['Verizon', 'AT&T', 'T-Mobile', 'Sprint'][
          Math.floor(Math.random() * 4)
        ],
        lineType:
          Math.random() > 0.6
            ? 'mobile'
            : Math.random() > 0.3
              ? 'landline'
              : 'voip',
      },
      company: {
        exists: Math.random() > 0.05,
        website: Math.random() > 0.1,
        socialMedia: Math.random() > 0.2,
        businessRegistration: Math.random() > 0.08,
      },
      overall: 'verified',
    };

    // Determine overall status
    const emailScore =
      verificationResult.email.valid && verificationResult.email.deliverable
        ? 1
        : 0;
    const phoneScore = verificationResult.phone.valid ? 1 : 0;
    const companyScore =
      verificationResult.company.exists && verificationResult.company.website
        ? 1
        : 0;
    const totalScore = emailScore + phoneScore + companyScore;

    if (totalScore >= 2) {
      verificationResult.overall = 'verified';
    } else if (totalScore >= 1) {
      verificationResult.overall = 'pending';
    } else {
      verificationResult.overall = 'failed';
    }

    return verificationResult;
  }

  /**
   * Assign lead to AI staff member
   */
  async assignLead(leadId: string, staffMember: string): Promise<boolean> {
    const leads = await this.generateMockLeads();
    const lead = leads.get(leadId);

    if (lead) {
      lead.assignedTo = staffMember;
      lead.updatedAt = new Date().toISOString();
      leads.set(leadId, lead);
      return true;
    }

    return false;
  }

  /**
   * Generate lead score based on various factors
   */
  calculateLeadScore(lead: Partial<Lead>): number {
    let score = 50; // Base score

    // Industry scoring
    const highValueIndustries = [
      'Manufacturing',
      'Healthcare',
      'Chemical',
      'Automotive',
    ];
    if (lead.industry && highValueIndustries.includes(lead.industry)) {
      score += 15;
    }

    // Revenue scoring
    if (lead.revenue) {
      if (lead.revenue.includes('$500M+')) score += 20;
      else if (lead.revenue.includes('$100M - $500M')) score += 15;
      else if (lead.revenue.includes('$50M - $100M')) score += 10;
      else if (lead.revenue.includes('$10M - $50M')) score += 5;
    }

    // Buying signals scoring
    if (lead.buyingSignals?.length) {
      score += lead.buyingSignals.length * 3;
    }

    // Verification status scoring
    if (lead.verificationStatus === 'verified') {
      score += 10;
    } else if (lead.verificationStatus === 'pending') {
      score += 5;
    }

    // Cap at 100
    return Math.min(score, 100);
  }

  /**
   * Enrich lead data using external sources
   */
  async enrichLeadData(leadId: string): Promise<Lead | null> {
    const leads = await this.generateMockLeads();
    const lead = leads.get(leadId);

    if (!lead) return null;

    // Simulate data enrichment
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Add enriched data
    lead.decisionMakers = [
      {
        name: lead.contactName,
        title: lead.title,
        email: lead.email,
        phone: lead.phone,
        department: 'Operations',
        influence: 'high',
      },
      {
        name: 'John Smith',
        title: 'CFO',
        email: 'j.smith@' + lead.email.split('@')[1],
        department: 'Finance',
        influence: 'high',
      },
    ];

    lead.painPoints = [
      'High freight costs',
      'Unreliable carriers',
      'Poor communication',
      'Capacity constraints',
    ];

    lead.updatedAt = new Date().toISOString();
    leads.set(leadId, lead);

    return lead;
  }

  /**
   * Export leads to CSV
   */
  async exportLeads(leadIds: string[]): Promise<string> {
    const leads = await this.generateMockLeads();
    const selectedLeads = leadIds
      .map((id) => leads.get(id))
      .filter(Boolean) as Lead[];

    const headers = [
      'Company Name',
      'Contact Name',
      'Title',
      'Email',
      'Phone',
      'Industry',
      'Revenue',
      'Employees',
      'Location',
      'Lead Score',
      'Verification Status',
      'Buying Signals',
      'Assigned To',
    ];

    const csvRows = [
      headers.join(','),
      ...selectedLeads.map((lead) =>
        [
          lead.companyName,
          lead.contactName,
          lead.title,
          lead.email,
          lead.phone,
          lead.industry,
          lead.revenue,
          lead.employees,
          lead.location,
          lead.leadScore.toString(),
          lead.verificationStatus,
          lead.buyingSignals.join('; '),
          lead.assignedTo || '',
        ]
          .map((field) => `"${field}"`)
          .join(',')
      ),
    ];

    return csvRows.join('\n');
  }

  /**
   * Get analytics and statistics
   */
  async getAnalytics(): Promise<{
    totalLeads: number;
    verifiedLeads: number;
    highScoreLeads: number;
    assignedLeads: number;
    industryBreakdown: { [key: string]: number };
    scoreDistribution: { [key: string]: number };
    assignmentBreakdown: { [key: string]: number };
  }> {
    const leads = await this.generateMockLeads();
    const allLeads = Array.from(leads.values());

    const analytics = {
      totalLeads: allLeads.length,
      verifiedLeads: allLeads.filter((l) => l.verificationStatus === 'verified')
        .length,
      highScoreLeads: allLeads.filter((l) => l.leadScore >= 85).length,
      assignedLeads: allLeads.filter((l) => l.assignedTo).length,
      industryBreakdown: {} as { [key: string]: number },
      scoreDistribution: {
        '90-100': 0,
        '80-89': 0,
        '70-79': 0,
        '60-69': 0,
        'Below 60': 0,
      },
      assignmentBreakdown: {} as { [key: string]: number },
    };

    // Calculate breakdowns
    allLeads.forEach((lead) => {
      // Industry breakdown
      analytics.industryBreakdown[lead.industry] =
        (analytics.industryBreakdown[lead.industry] || 0) + 1;

      // Score distribution
      if (lead.leadScore >= 90) analytics.scoreDistribution['90-100']++;
      else if (lead.leadScore >= 80) analytics.scoreDistribution['80-89']++;
      else if (lead.leadScore >= 70) analytics.scoreDistribution['70-79']++;
      else if (lead.leadScore >= 60) analytics.scoreDistribution['60-69']++;
      else analytics.scoreDistribution['Below 60']++;

      // Assignment breakdown
      if (lead.assignedTo) {
        analytics.assignmentBreakdown[lead.assignedTo] =
          (analytics.assignmentBreakdown[lead.assignedTo] || 0) + 1;
      }
    });

    return analytics;
  }

  /**
   * Generate mock leads for demonstration
   */
  private async generateMockLeads(): Promise<Map<string, Lead>> {
    if (this.leads.size > 0) {
      return this.leads;
    }

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
        createdAt: '2025-01-10T10:00:00Z',
        updatedAt: '2025-01-15T14:30:00Z',
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
        createdAt: '2025-01-08T09:15:00Z',
        updatedAt: '2025-01-14T16:45:00Z',
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
        createdAt: '2025-01-12T11:20:00Z',
        updatedAt: '2025-01-13T13:10:00Z',
      },
      {
        id: 'DLI-004',
        companyName: 'Pacific Healthcare Systems',
        contactName: 'David Kim',
        title: 'Procurement Manager',
        email: 'd.kim@pacifichealthcare.com',
        phone: '+1-415-555-0321',
        industry: 'Healthcare',
        revenue: '$200M - $500M',
        employees: '2,000-5,000',
        location: 'San Francisco, CA',
        verificationStatus: 'verified',
        leadScore: 92,
        lastVerified: '2025-01-15',
        buyingSignals: [
          'Medical equipment expansion',
          'Temperature-controlled shipping needs',
        ],
        assignedTo: 'Will',
        createdAt: '2025-01-09T14:30:00Z',
        updatedAt: '2025-01-15T10:20:00Z',
      },
      {
        id: 'DLI-005',
        companyName: 'Atlantic Automotive Parts',
        contactName: 'Jennifer Walsh',
        title: 'Logistics Coordinator',
        email: 'j.walsh@atlanticauto.com',
        phone: '+1-404-555-0654',
        industry: 'Automotive',
        revenue: '$75M - $100M',
        employees: '750-1,000',
        location: 'Atlanta, GA',
        verificationStatus: 'verified',
        leadScore: 87,
        lastVerified: '2025-01-14',
        buyingSignals: ['JIT delivery requirements', 'Carrier diversification'],
        assignedTo: 'Cliff',
        createdAt: '2025-01-11T08:45:00Z',
        updatedAt: '2025-01-14T15:30:00Z',
      },
    ];

    // Populate the leads map
    mockLeads.forEach((lead) => {
      this.leads.set(lead.id, lead);
    });

    return this.leads;
  }
}

export default DEPOINTELeadIntelligenceService;


