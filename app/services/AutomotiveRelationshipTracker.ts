/**
 * Automotive Relationship Tracker Service
 * Manages outreach campaigns, tracks communications, and measures conversion success
 * Integrates with AutomotiveRFPDiscoveryService for comprehensive pipeline management
 */

import AutomotiveRFPDiscoveryService from './AutomotiveRFPDiscoveryService';

export interface AutomotiveContact {
  id: string;
  company: string;
  companyType: 'OEM' | 'Tier1Supplier' | 'Tier2Supplier' | 'ServiceProvider';
  name: string;
  title: string;
  department: string;
  email: string;
  phone?: string;
  linkedInUrl?: string;
  decisionLevel: 'C-Level' | 'VP' | 'Director' | 'Manager' | 'Coordinator';
  influence: 'High' | 'Medium' | 'Low';
  priority: 'Tier1' | 'Tier2' | 'Tier3';
  source: 'Discovery' | 'LinkedIn' | 'Referral' | 'Event' | 'Website' | 'Other';
  addedDate: Date;
  lastContactDate?: Date;
  notes: string[];
}

export interface OutreachCampaign {
  id: string;
  name: string;
  type: 'Email' | 'Phone' | 'LinkedIn' | 'InPerson' | 'Event';
  templateUsed: string;
  sentDate: Date;
  sentBy: string;
  contactId: string;
  subject?: string;
  content: string;
  status:
    | 'Sent'
    | 'Delivered'
    | 'Opened'
    | 'Responded'
    | 'Bounced'
    | 'NoResponse';
  responseDate?: Date;
  responseContent?: string;
  nextFollowUp?: Date;
  conversionStage:
    | 'Initial'
    | 'Interested'
    | 'Meeting'
    | 'Presentation'
    | 'Negotiation'
    | 'Contract'
    | 'Lost';
}

export interface AutomotiveOpportunity {
  id: string;
  company: string;
  contactId: string;
  opportunityName: string;
  estimatedValue: number;
  contractDuration: string;
  serviceType:
    | 'Car Hauling'
    | 'Parts Transport'
    | 'Cross-Dock'
    | 'JIT Delivery'
    | 'Expedite'
    | 'Full Service';
  stage: 'Qualified' | 'Proposal' | 'Negotiation' | 'Contract' | 'Won' | 'Lost';
  winProbability: number;
  expectedCloseDate: Date;
  competitionLevel: 'Low' | 'Medium' | 'High';
  keyRequirements: string[];
  proposalDeadline?: Date;
  lastActivity: Date;
  notes: string[];
  discoveredFromRFP?: string; // Link to RFP discovery system
}

export interface RelationshipMetrics {
  totalContacts: number;
  activeOpportunities: number;
  pipelineValue: number;
  conversionRates: {
    contactToMeeting: number;
    meetingToProposal: number;
    proposalToContract: number;
    overallConversion: number;
  };
  responseRates: {
    email: number;
    phone: number;
    linkedin: number;
  };
  averageTimeToResponse: number; // days
  topPerformingCompanies: string[];
}

export class AutomotiveRelationshipTracker {
  private contacts: Map<string, AutomotiveContact> = new Map();
  private campaigns: Map<string, OutreachCampaign> = new Map();
  private opportunities: Map<string, AutomotiveOpportunity> = new Map();
  private rfpDiscoveryService: AutomotiveRFPDiscoveryService;

  constructor() {
    this.rfpDiscoveryService = new AutomotiveRFPDiscoveryService();
    this.initializeTargetContacts();
  }

  /**
   * Initialize high-priority target contacts based on outreach strategy
   */
  private initializeTargetContacts(): void {
    const targetContacts: AutomotiveContact[] = [
      // Tesla - Tier 1 Priority
      {
        id: 'TESLA-001',
        company: 'Tesla, Inc.',
        companyType: 'OEM',
        name: 'Jennifer Rodriguez',
        title: 'Supply Chain Director',
        department: 'Gigafactory Supply Chain',
        email: 'supply.chain@tesla.com',
        decisionLevel: 'Director',
        influence: 'High',
        priority: 'Tier1',
        source: 'Discovery',
        addedDate: new Date(),
        notes: [
          'Cross-dock operations $3.2M opportunity',
          'Sustainability focus',
          'Innovation-driven culture',
        ],
      },
      {
        id: 'TESLA-002',
        company: 'Tesla, Inc.',
        companyType: 'OEM',
        name: 'Marcus Chen',
        title: 'Logistics Procurement Manager',
        department: 'Gigafactory Operations',
        email: 'giga.logistics@tesla.com',
        decisionLevel: 'Manager',
        influence: 'Medium',
        priority: 'Tier1',
        source: 'Discovery',
        addedDate: new Date(),
        notes: [
          'Secondary contact',
          'Operations focus',
          'Technology integration requirements',
        ],
      },

      // Ford - Tier 1 Priority
      {
        id: 'FORD-001',
        company: 'Ford Motor Company',
        companyType: 'OEM',
        name: 'Sarah Johnson',
        title: 'Global Procurement Director',
        department: 'Global Procurement - Logistics',
        email: 'procurement.logistics@ford.com',
        phone: '+1-313-555-0123',
        decisionLevel: 'Director',
        influence: 'High',
        priority: 'Tier1',
        source: 'Discovery',
        addedDate: new Date(),
        notes: [
          'F-150 Lightning parts distribution $2.5M',
          'Geographic coverage emphasis',
          'Reliability focus',
        ],
      },
      {
        id: 'FORD-002',
        company: 'Ford Motor Company',
        companyType: 'OEM',
        name: 'Mike Torres',
        title: 'Plant Logistics Manager',
        department: 'Dearborn Manufacturing',
        email: 'logistics.dearborn@ford.com',
        decisionLevel: 'Manager',
        influence: 'Medium',
        priority: 'Tier1',
        source: 'Discovery',
        addedDate: new Date(),
        notes: [
          'Dearborn plant operations',
          'Local logistics coordination',
          'Performance metrics focus',
        ],
      },

      // GM - Tier 1 Priority
      {
        id: 'GM-001',
        company: 'General Motors',
        companyType: 'OEM',
        name: 'Michael Chen',
        title: 'EV Supply Chain Operations Director',
        department: 'EV Supply Chain Operations',
        email: 'logistics.procurement@gm.com',
        decisionLevel: 'Director',
        influence: 'High',
        priority: 'Tier1',
        source: 'Discovery',
        addedDate: new Date(),
        notes: [
          'Ultium Battery expedited delivery $1.8M',
          'EV transformation focus',
          'Emergency response capabilities',
        ],
      },

      // Bosch - Tier 2 Priority
      {
        id: 'BOSCH-001',
        company: 'Robert Bosch LLC',
        companyType: 'Tier1Supplier',
        name: 'Klaus Mueller',
        title: 'North American Procurement Director',
        department: 'North American Procurement',
        email: 'procurement.na@bosch.com',
        decisionLevel: 'Director',
        influence: 'High',
        priority: 'Tier2',
        source: 'Discovery',
        addedDate: new Date(),
        notes: [
          'North American parts distribution $4.5M',
          'Technology integration requirements',
          'Multi-OEM supplier',
        ],
      },
    ];

    targetContacts.forEach((contact) => {
      this.contacts.set(contact.id, contact);
    });

    console.info(
      `✅ Initialized ${targetContacts.length} high-priority automotive contacts`
    );
  }

  /**
   * Add new contact to the system
   */
  addContact(contact: Omit<AutomotiveContact, 'id' | 'addedDate'>): string {
    const id = this.generateContactId(contact.company, contact.name);
    const newContact: AutomotiveContact = {
      ...contact,
      id,
      addedDate: new Date(),
    };

    this.contacts.set(id, newContact);
    console.info(`📇 Added new contact: ${contact.name} at ${contact.company}`);
    return id;
  }

  /**
   * Record outreach campaign
   */
  recordOutreach(campaign: Omit<OutreachCampaign, 'id' | 'sentDate'>): string {
    const id = `CAMPAIGN-${Date.now()}`;
    const newCampaign: OutreachCampaign = {
      ...campaign,
      id,
      sentDate: new Date(),
    };

    this.campaigns.set(id, newCampaign);

    // Update last contact date for the contact
    const contact = this.contacts.get(campaign.contactId);
    if (contact) {
      contact.lastContactDate = new Date();
      this.contacts.set(contact.id, contact);
    }

    console.info(
      `📧 Recorded ${campaign.type} outreach to ${campaign.contactId}`
    );
    return id;
  }

  /**
   * Update campaign with response
   */
  recordResponse(
    campaignId: string,
    responseData: {
      status: OutreachCampaign['status'];
      responseContent?: string;
      nextFollowUp?: Date;
      conversionStage?: OutreachCampaign['conversionStage'];
    }
  ): void {
    const campaign = this.campaigns.get(campaignId);
    if (campaign) {
      campaign.status = responseData.status;
      campaign.responseDate = new Date();
      campaign.responseContent = responseData.responseContent;
      campaign.nextFollowUp = responseData.nextFollowUp;
      if (responseData.conversionStage) {
        campaign.conversionStage = responseData.conversionStage;
      }

      this.campaigns.set(campaignId, campaign);
      console.info(
        `📈 Updated campaign ${campaignId} with response: ${responseData.status}`
      );
    }
  }

  /**
   * Create opportunity from qualified lead
   */
  createOpportunity(
    opportunity: Omit<AutomotiveOpportunity, 'id' | 'lastActivity'>
  ): string {
    const id = `OPP-${Date.now()}`;
    const newOpportunity: AutomotiveOpportunity = {
      ...opportunity,
      id,
      lastActivity: new Date(),
    };

    this.opportunities.set(id, newOpportunity);

    // Update contact's conversion stage if they have active campaigns
    const contactCampaigns = Array.from(this.campaigns.values())
      .filter((c) => c.contactId === opportunity.contactId)
      .sort((a, b) => b.sentDate.getTime() - a.sentDate.getTime());

    if (contactCampaigns.length > 0) {
      contactCampaigns[0].conversionStage = 'Interested';
      this.campaigns.set(contactCampaigns[0].id, contactCampaigns[0]);
    }

    console.info(
      `🎯 Created opportunity: ${opportunity.opportunityName} - $${opportunity.estimatedValue.toLocaleString()}`
    );
    return id;
  }

  /**
   * Get prioritized contact list for outreach
   */
  getPrioritizedContacts(
    priority?: AutomotiveContact['priority']
  ): AutomotiveContact[] {
    let contacts = Array.from(this.contacts.values());

    if (priority) {
      contacts = contacts.filter((c) => c.priority === priority);
    }

    // Sort by priority, influence, and last contact date
    return contacts.sort((a, b) => {
      // Priority order: Tier1 > Tier2 > Tier3
      const priorityOrder = { Tier1: 3, Tier2: 2, Tier3: 1 };
      const priorityDiff =
        priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Influence order: High > Medium > Low
      const influenceOrder = { High: 3, Medium: 2, Low: 1 };
      const influenceDiff =
        influenceOrder[b.influence] - influenceOrder[a.influence];
      if (influenceDiff !== 0) return influenceDiff;

      // Prefer contacts not recently contacted
      const aLastContact = a.lastContactDate?.getTime() || 0;
      const bLastContact = b.lastContactDate?.getTime() || 0;
      return aLastContact - bLastContact;
    });
  }

  /**
   * Get contacts ready for follow-up
   */
  getFollowUpContacts(): {
    contact: AutomotiveContact;
    campaign: OutreachCampaign;
  }[] {
    const now = new Date();
    const followUps: {
      contact: AutomotiveContact;
      campaign: OutreachCampaign;
    }[] = [];

    this.campaigns.forEach((campaign) => {
      if (campaign.nextFollowUp && campaign.nextFollowUp <= now) {
        const contact = this.contacts.get(campaign.contactId);
        if (contact) {
          followUps.push({ contact, campaign });
        }
      }
    });

    return followUps.sort(
      (a, b) =>
        (a.campaign.nextFollowUp?.getTime() || 0) -
        (b.campaign.nextFollowUp?.getTime() || 0)
    );
  }

  /**
   * Get relationship metrics and analytics
   */
  getRelationshipMetrics(): RelationshipMetrics {
    const campaigns = Array.from(this.campaigns.values());
    const opportunities = Array.from(this.opportunities.values());

    // Calculate conversion rates
    const totalCampaigns = campaigns.length;
    const meetings = campaigns.filter((c) =>
      ['Meeting', 'Presentation', 'Negotiation', 'Contract'].includes(
        c.conversionStage
      )
    ).length;
    const proposals = campaigns.filter((c) =>
      ['Presentation', 'Negotiation', 'Contract'].includes(c.conversionStage)
    ).length;
    const contracts = campaigns.filter(
      (c) => c.conversionStage === 'Contract'
    ).length;

    // Calculate response rates by channel
    const emailCampaigns = campaigns.filter((c) => c.type === 'Email');
    const phoneCampaigns = campaigns.filter((c) => c.type === 'Phone');
    const linkedinCampaigns = campaigns.filter((c) => c.type === 'LinkedIn');

    const emailResponses = emailCampaigns.filter((c) =>
      ['Responded', 'Opened'].includes(c.status)
    ).length;
    const phoneResponses = phoneCampaigns.filter(
      (c) => c.status === 'Responded'
    ).length;
    const linkedinResponses = linkedinCampaigns.filter(
      (c) => c.status === 'Responded'
    ).length;

    // Calculate average response time
    const responseCampaigns = campaigns.filter(
      (c) => c.responseDate && c.sentDate
    );
    const avgResponseTime =
      responseCampaigns.length > 0
        ? responseCampaigns.reduce((sum, c) => {
            const responseTime =
              (c.responseDate!.getTime() - c.sentDate.getTime()) /
              (1000 * 60 * 60 * 24);
            return sum + responseTime;
          }, 0) / responseCampaigns.length
        : 0;

    // Get top performing companies
    const companyPerformance = new Map<string, number>();
    campaigns.forEach((c) => {
      const contact = this.contacts.get(c.contactId);
      if (contact && c.status === 'Responded') {
        const count = companyPerformance.get(contact.company) || 0;
        companyPerformance.set(contact.company, count + 1);
      }
    });

    const topCompanies = Array.from(companyPerformance.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([company]) => company);

    return {
      totalContacts: this.contacts.size,
      activeOpportunities: opportunities.filter(
        (o) => !['Won', 'Lost'].includes(o.stage)
      ).length,
      pipelineValue: opportunities
        .filter((o) => !['Won', 'Lost'].includes(o.stage))
        .reduce((sum, o) => sum + o.estimatedValue * o.winProbability, 0),
      conversionRates: {
        contactToMeeting:
          totalCampaigns > 0 ? (meetings / totalCampaigns) * 100 : 0,
        meetingToProposal: meetings > 0 ? (proposals / meetings) * 100 : 0,
        proposalToContract: proposals > 0 ? (contracts / proposals) * 100 : 0,
        overallConversion:
          totalCampaigns > 0 ? (contracts / totalCampaigns) * 100 : 0,
      },
      responseRates: {
        email:
          emailCampaigns.length > 0
            ? (emailResponses / emailCampaigns.length) * 100
            : 0,
        phone:
          phoneCampaigns.length > 0
            ? (phoneResponses / phoneCampaigns.length) * 100
            : 0,
        linkedin:
          linkedinCampaigns.length > 0
            ? (linkedinResponses / linkedinCampaigns.length) * 100
            : 0,
      },
      averageTimeToResponse: avgResponseTime,
      topPerformingCompanies: topCompanies,
    };
  }

  /**
   * Sync opportunities with RFP discovery system
   */
  async syncWithRFPDiscovery(userId: string): Promise<{
    newOpportunities: number;
    updatedContacts: number;
    discoveredRFPs: number;
  }> {
    console.info('🔄 Syncing with automotive RFP discovery system...');

    const discoveryResult =
      await this.rfpDiscoveryService.discoverAutomotiveOpportunities(userId);
    let newOpportunities = 0;
    let updatedContacts = 0;

    discoveryResult.opportunities.forEach((rfp) => {
      // Check if we have contacts for this company
      const companyContacts = Array.from(this.contacts.values()).filter((c) =>
        c.company.toLowerCase().includes(rfp.company.toLowerCase())
      );

      if (companyContacts.length === 0) {
        // Create new contact from RFP data
        const contactId = this.addContact({
          company: rfp.company,
          companyType: rfp.oem !== 'Other' ? 'OEM' : 'Tier1Supplier',
          name: rfp.contactInfo.name,
          title: 'Unknown',
          department: rfp.contactInfo.department,
          email: rfp.contactInfo.email,
          phone: rfp.contactInfo.phone,
          decisionLevel: 'Manager',
          influence: 'Medium',
          priority: 'Tier2',
          source: 'Discovery',
          notes: [
            `Discovered from RFP: ${rfp.title}`,
            `Contract value: $${rfp.estimatedValue.toLocaleString()}`,
          ],
        });
        updatedContacts++;

        // Create opportunity
        this.createOpportunity({
          company: rfp.company,
          contactId,
          opportunityName: rfp.title,
          estimatedValue: rfp.estimatedValue,
          contractDuration: rfp.contractDuration,
          serviceType: rfp.contractType as AutomotiveOpportunity['serviceType'],
          stage: 'Qualified',
          winProbability: rfp.competitiveFactors.winProbability,
          expectedCloseDate: rfp.responseDeadline,
          competitionLevel:
            rfp.competitiveFactors.expectedBidders > 8
              ? 'High'
              : rfp.competitiveFactors.expectedBidders > 4
                ? 'Medium'
                : 'Low',
          keyRequirements: rfp.requirements.equipment,
          proposalDeadline: rfp.responseDeadline,
          notes: [`Auto-discovered RFP opportunity`, `Source: ${rfp.source}`],
          discoveredFromRFP: rfp.id,
        });
        newOpportunities++;
      } else {
        // Update existing contacts with new RFP information
        companyContacts.forEach((contact) => {
          contact.notes.push(
            `New RFP discovered: ${rfp.title} - $${rfp.estimatedValue.toLocaleString()}`
          );
          this.contacts.set(contact.id, contact);
        });
        updatedContacts++;
      }
    });

    console.info(
      `✅ Sync complete: ${newOpportunities} new opportunities, ${updatedContacts} updated contacts`
    );

    return {
      newOpportunities,
      updatedContacts,
      discoveredRFPs: discoveryResult.opportunities.length,
    };
  }

  /**
   * Generate outreach recommendations
   */
  getOutreachRecommendations(): {
    priorityContacts: AutomotiveContact[];
    followUpRequired: {
      contact: AutomotiveContact;
      campaign: OutreachCampaign;
    }[];
    staleContacts: AutomotiveContact[];
    highValueOpportunities: AutomotiveOpportunity[];
  } {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get priority contacts not contacted recently
    const priorityContacts = this.getPrioritizedContacts('Tier1')
      .filter((c) => !c.lastContactDate || c.lastContactDate < thirtyDaysAgo)
      .slice(0, 10);

    // Get follow-ups due
    const followUpRequired = this.getFollowUpContacts().slice(0, 5);

    // Get stale contacts (no contact in 60+ days)
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const staleContacts = Array.from(this.contacts.values())
      .filter((c) => c.lastContactDate && c.lastContactDate < sixtyDaysAgo)
      .slice(0, 5);

    // Get high-value opportunities needing attention
    const highValueOpportunities = Array.from(this.opportunities.values())
      .filter(
        (o) => o.estimatedValue >= 2000000 && !['Won', 'Lost'].includes(o.stage)
      )
      .sort((a, b) => b.estimatedValue - a.estimatedValue)
      .slice(0, 5);

    return {
      priorityContacts,
      followUpRequired,
      staleContacts,
      highValueOpportunities,
    };
  }

  /**
   * Generate contact ID
   */
  private generateContactId(company: string, name: string): string {
    const companyCode = company.replace(/[^A-Z]/g, '').substring(0, 5);
    const nameCode = name.replace(/[^A-Z]/g, '').substring(0, 3);
    const timestamp = Date.now().toString().slice(-6);
    return `${companyCode}-${nameCode}-${timestamp}`;
  }

  /**
   * Export relationship data for external tools
   */
  exportData(): {
    contacts: AutomotiveContact[];
    campaigns: OutreachCampaign[];
    opportunities: AutomotiveOpportunity[];
    metrics: RelationshipMetrics;
  } {
    return {
      contacts: Array.from(this.contacts.values()),
      campaigns: Array.from(this.campaigns.values()),
      opportunities: Array.from(this.opportunities.values()),
      metrics: this.getRelationshipMetrics(),
    };
  }
}

export default AutomotiveRelationshipTracker;
