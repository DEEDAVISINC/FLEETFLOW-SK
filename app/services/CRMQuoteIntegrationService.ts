// ============================================================================
// FLEETFLOW CRM QUOTE INTEGRATION SERVICE - PRODUCTION READY
// ============================================================================

import CRMService from './CRMService';

// ============================================================================
// TYPESCRIPT INTERFACES
// ============================================================================

interface QuoteData {
  id: string;
  shipper_id?: string;
  shipper_contact_id?: string;
  origin: string;
  origin_city: string;
  origin_state: string;
  origin_zip?: string;
  destination: string;
  destination_city: string;
  destination_state: string;
  destination_zip?: string;
  totalRate: number;
  distance_miles?: number;
  weight?: number;
  equipment_type?: string;
  load_type?: string;
  pickup_date?: string;
  delivery_date?: string;
  service_type: 'freight_brokerage' | 'ltl' | 'ftl' | 'expedited' | 'specialized';
  quote_status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  created_at: string;
  valid_until?: string;
  agent_id?: string;
  quote_notes?: string;
  freight_class?: string;
  special_requirements?: string[];
}

interface CRMOpportunityData {
  opportunity_name: string;
  description?: string;
  contact_id?: string;
  company_id?: string;
  pipeline_id?: string;
  stage: string;
  probability?: number;
  value: number;
  expected_close_date?: string;
  load_type?: string;
  origin_city?: string;
  origin_state?: string;
  destination_city?: string;
  destination_state?: string;
  equipment_type?: string;
  status?: 'open' | 'won' | 'lost' | 'cancelled';
  assigned_to?: string;
  notes?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
}

interface QuoteActivityData {
  contact_id?: string;
  activity_type: 'quote';
  subject: string;
  description?: string;
  activity_date: string;
  status: 'completed';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  assigned_to?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
}

interface QuoteOpportunityResult {
  opportunity_id: string;
  activity_id: string;
  contact_matched: boolean;
  lead_score_updated: boolean;
  follow_up_created: boolean;
}

// ============================================================================
// CRM QUOTE INTEGRATION SERVICE
// ============================================================================

export default class CRMQuoteIntegrationService {
  private crmService: CRMService;
  private organizationId: string;

  constructor(organizationId: string) {
    this.crmService = new CRMService(organizationId);
    this.organizationId = organizationId;
  }

  // ============================================================================
  // AUTOMATIC OPPORTUNITY CREATION
  // ============================================================================

  /**
   * Automatically create CRM opportunity when quote is generated
   */
  async createQuoteOpportunity(quoteData: QuoteData): Promise<QuoteOpportunityResult> {
    try {
      // 1. Find or match contact
      let contactId = quoteData.shipper_contact_id;
      let contactMatched = false;
      
      if (!contactId && quoteData.shipper_id) {
        const contact = await this.findContactByShipperId(quoteData.shipper_id);
        contactId = contact?.id;
        contactMatched = !!contactId;
      }

      // 2. Create CRM opportunity
      const opportunityData: CRMOpportunityData = {
        opportunity_name: `Freight opportunity - ${quoteData.origin} to ${quoteData.destination}`,
        description: this.generateOpportunityDescription(quoteData),
        contact_id: contactId,
        stage: this.mapQuoteStatusToStage(quoteData.quote_status),
        probability: this.calculateOpportunityProbability(quoteData),
        value: quoteData.totalRate,
        expected_close_date: quoteData.pickup_date || this.calculateExpectedCloseDate(),
        load_type: quoteData.load_type,
        origin_city: quoteData.origin_city,
        origin_state: quoteData.origin_state,
        destination_city: quoteData.destination_city,
        destination_state: quoteData.destination_state,
        equipment_type: quoteData.equipment_type,
        status: 'open',
        assigned_to: quoteData.agent_id,
        notes: quoteData.quote_notes,
        tags: this.generateOpportunityTags(quoteData),
        custom_fields: {
          quote_id: quoteData.id,
          service_type: quoteData.service_type,
          distance_miles: quoteData.distance_miles,
          weight: quoteData.weight,
          freight_class: quoteData.freight_class,
          special_requirements: quoteData.special_requirements,
          quote_valid_until: quoteData.valid_until
        }
      };

      const opportunity = await this.crmService.createOpportunity(opportunityData);

      // 3. Create quote activity
      const activityData: QuoteActivityData = {
        contact_id: contactId,
        activity_type: 'quote',
        subject: `Quote Generated: ${quoteData.origin} to ${quoteData.destination}`,
        description: this.generateQuoteActivityDescription(quoteData),
        activity_date: quoteData.created_at,
        status: 'completed',
        priority: this.determineQuotePriority(quoteData),
        assigned_to: quoteData.agent_id,
        tags: ['quote_generated', quoteData.service_type, quoteData.load_type].filter(Boolean),
        custom_fields: {
          quote_id: quoteData.id,
          opportunity_id: opportunity.id,
          quote_value: quoteData.totalRate,
          service_type: quoteData.service_type
        }
      };

      const activity = await this.crmService.createActivity(activityData);

      // 4. Update contact lead score if contact found
      let leadScoreUpdated = false;
      if (contactId) {
        await this.crmService.calculateLeadScore(contactId);
        leadScoreUpdated = true;
      }

      // 5. Create follow-up tasks
      const followUpCreated = await this.createQuoteFollowUpTasks(quoteData, opportunity.id);

      return {
        opportunity_id: opportunity.id,
        activity_id: activity.id,
        contact_matched: contactMatched,
        lead_score_updated: leadScoreUpdated,
        follow_up_created: followUpCreated
      };

    } catch (error) {
      console.error('Error creating quote opportunity:', error);
      throw error;
    }
  }

  // ============================================================================
  // QUOTE STATUS UPDATES
  // ============================================================================

  /**
   * Update opportunity when quote status changes
   */
  async updateOpportunityFromQuoteStatus(quoteId: string, newStatus: string, notes?: string): Promise<void> {
    try {
      // Find opportunity by quote ID
      const opportunities = await this.crmService.getOpportunities(this.organizationId, {
        search: quoteId,
        limit: 1
      });

      const opportunity = opportunities.find(opp => 
        opp.custom_fields?.quote_id === quoteId
      );

      if (!opportunity) {
        console.warn(`No opportunity found for quote ${quoteId}`);
        return;
      }

      // Map quote status to opportunity stage
      const newStage = this.mapQuoteStatusToStage(newStatus);
      
      // Update opportunity stage
      await this.crmService.updateOpportunityStage(opportunity.id, newStage);

      // Create activity for status change
      await this.crmService.createActivity({
        contact_id: opportunity.contact_id,
        opportunity_id: opportunity.id,
        activity_type: 'note',
        subject: `Quote Status Updated: ${newStatus}`,
        description: `Quote status changed to ${newStatus}${notes ? '\n\nNotes: ' + notes : ''}`,
        activity_date: new Date().toISOString(),
        status: 'completed',
        tags: ['quote_update', newStatus],
        custom_fields: {
          quote_id: quoteId,
          previous_status: opportunity.stage,
          new_status: newStatus
        }
      });

      // Handle specific status changes
      if (newStatus === 'accepted') {
        await this.handleQuoteAccepted(opportunity, quoteId);
      } else if (newStatus === 'rejected') {
        await this.handleQuoteRejected(opportunity, quoteId, notes);
      }

    } catch (error) {
      console.error('Error updating opportunity from quote status:', error);
      throw error;
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Find contact by shipper ID
   */
  private async findContactByShipperId(shipperId: string): Promise<any> {
    try {
      const contacts = await this.crmService.getContacts(this.organizationId, {
        search: shipperId,
        contact_type: 'shipper',
        limit: 1
      });

      return contacts.find(contact => 
        contact.custom_fields?.shipper_id === shipperId ||
        contact.id === shipperId
      );
    } catch (error) {
      console.error('Error finding contact by shipper ID:', error);
      return null;
    }
  }

  /**
   * Generate opportunity description
   */
  private generateOpportunityDescription(quoteData: QuoteData): string {
    let description = `Freight opportunity from ${quoteData.origin} to ${quoteData.destination}\n\n`;
    description += `Quote Details:\n`;
    description += `- Rate: $${quoteData.totalRate.toLocaleString()}\n`;
    description += `- Service Type: ${quoteData.service_type}\n`;
    
    if (quoteData.distance_miles) {
      description += `- Distance: ${quoteData.distance_miles} miles\n`;
    }
    
    if (quoteData.weight) {
      description += `- Weight: ${quoteData.weight.toLocaleString()} lbs\n`;
    }
    
    if (quoteData.equipment_type) {
      description += `- Equipment: ${quoteData.equipment_type}\n`;
    }
    
    if (quoteData.pickup_date) {
      description += `- Pickup Date: ${quoteData.pickup_date}\n`;
    }
    
    if (quoteData.special_requirements?.length) {
      description += `- Special Requirements: ${quoteData.special_requirements.join(', ')}\n`;
    }
    
    if (quoteData.quote_notes) {
      description += `\nNotes: ${quoteData.quote_notes}`;
    }
    
    return description;
  }

  /**
   * Generate quote activity description
   */
  private generateQuoteActivityDescription(quoteData: QuoteData): string {
    let description = `Quote generated for freight shipment\n\n`;
    description += `Route: ${quoteData.origin} → ${quoteData.destination}\n`;
    description += `Rate: $${quoteData.totalRate.toLocaleString()}\n`;
    description += `Service: ${quoteData.service_type}\n`;
    description += `Status: ${quoteData.quote_status}\n`;
    
    if (quoteData.valid_until) {
      description += `Valid Until: ${quoteData.valid_until}\n`;
    }
    
    return description;
  }

  /**
   * Map quote status to CRM opportunity stage
   */
  private mapQuoteStatusToStage(quoteStatus: string): string {
    const statusMapping = {
      'draft': 'lead',
      'sent': 'proposal',
      'accepted': 'closed won',
      'rejected': 'closed lost',
      'expired': 'closed lost'
    };
    
    return statusMapping[quoteStatus as keyof typeof statusMapping] || 'proposal';
  }

  /**
   * Calculate opportunity probability based on quote data
   */
  private calculateOpportunityProbability(quoteData: QuoteData): number {
    let probability = 25; // Base probability for sent quote
    
    // Adjust based on quote status
    if (quoteData.quote_status === 'sent') probability = 50;
    if (quoteData.quote_status === 'accepted') probability = 100;
    if (quoteData.quote_status === 'rejected') probability = 0;
    
    // Adjust based on service type
    if (quoteData.service_type === 'expedited') probability += 10;
    if (quoteData.service_type === 'specialized') probability += 15;
    
    // Adjust based on rate (higher rates = higher probability)
    if (quoteData.totalRate > 5000) probability += 10;
    if (quoteData.totalRate > 10000) probability += 20;
    
    return Math.min(probability, 100);
  }

  /**
   * Calculate expected close date
   */
  private calculateExpectedCloseDate(): string {
    // Default to 7 days from now
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  }

  /**
   * Generate opportunity tags
   */
  private generateOpportunityTags(quoteData: QuoteData): string[] {
    const tags = ['quote_generated', quoteData.service_type];
    
    if (quoteData.load_type) tags.push(quoteData.load_type);
    if (quoteData.equipment_type) tags.push(quoteData.equipment_type);
    if (quoteData.totalRate > 10000) tags.push('high_value');
    if (quoteData.special_requirements?.length) tags.push('special_requirements');
    
    return tags.filter(Boolean);
  }

  /**
   * Determine quote priority
   */
  private determineQuotePriority(quoteData: QuoteData): 'low' | 'normal' | 'high' | 'urgent' {
    if (quoteData.service_type === 'expedited') return 'urgent';
    if (quoteData.totalRate > 10000) return 'high';
    if (quoteData.service_type === 'specialized') return 'high';
    if (quoteData.totalRate > 5000) return 'normal';
    return 'low';
  }

  /**
   * Create follow-up tasks for quote
   */
  private async createQuoteFollowUpTasks(quoteData: QuoteData, opportunityId: string): Promise<boolean> {
    try {
      const tasks = [];
      
      // Follow-up task based on quote status
      if (quoteData.quote_status === 'sent') {
        tasks.push({
          activity_type: 'task' as const,
          subject: 'Follow-up: Quote Response',
          description: `Follow up on quote sent for ${quoteData.origin} to ${quoteData.destination} (Rate: $${quoteData.totalRate})`,
          activity_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
          status: 'planned' as const,
          priority: 'normal' as const,
          contact_id: quoteData.shipper_contact_id,
          opportunity_id: opportunityId,
          assigned_to: quoteData.agent_id,
          tags: ['follow_up', 'quote_response'],
          custom_fields: {
            quote_id: quoteData.id,
            quote_value: quoteData.totalRate
          }
        });
      }
      
      // Expiration reminder task
      if (quoteData.valid_until) {
        const expirationDate = new Date(quoteData.valid_until);
        const reminderDate = new Date(expirationDate.getTime() - 24 * 60 * 60 * 1000); // 1 day before
        
        if (reminderDate > new Date()) {
          tasks.push({
            activity_type: 'task' as const,
            subject: 'Quote Expiration Reminder',
            description: `Quote expires tomorrow for ${quoteData.origin} to ${quoteData.destination}`,
            activity_date: reminderDate.toISOString(),
            status: 'planned' as const,
            priority: 'high' as const,
            contact_id: quoteData.shipper_contact_id,
            opportunity_id: opportunityId,
            assigned_to: quoteData.agent_id,
            tags: ['quote_expiration', 'reminder'],
            custom_fields: {
              quote_id: quoteData.id,
              expiration_date: quoteData.valid_until
            }
          });
        }
      }
      
      // Create all tasks
      for (const task of tasks) {
        await this.crmService.createActivity(task);
      }
      
      return tasks.length > 0;
      
    } catch (error) {
      console.error('Error creating follow-up tasks:', error);
      return false;
    }
  }

  /**
   * Handle quote accepted
   */
  private async handleQuoteAccepted(opportunity: any, quoteId: string): Promise<void> {
    try {
      // Create celebration activity
      await this.crmService.createActivity({
        contact_id: opportunity.contact_id,
        opportunity_id: opportunity.id,
        activity_type: 'note',
        subject: '🎉 Quote Accepted - Deal Won!',
        description: `Quote ${quoteId} has been accepted. Opportunity value: $${opportunity.value}`,
        activity_date: new Date().toISOString(),
        status: 'completed',
        priority: 'high',
        tags: ['quote_accepted', 'deal_won'],
        custom_fields: {
          quote_id: quoteId,
          deal_value: opportunity.value
        }
      });

      // Create onboarding task
      await this.crmService.createActivity({
        contact_id: opportunity.contact_id,
        opportunity_id: opportunity.id,
        activity_type: 'task',
        subject: 'Customer Onboarding - Quote Accepted',
        description: `Begin onboarding process for accepted quote ${quoteId}`,
        activity_date: new Date().toISOString(),
        status: 'planned',
        priority: 'high',
        assigned_to: opportunity.assigned_to,
        tags: ['onboarding', 'quote_accepted'],
        custom_fields: {
          quote_id: quoteId
        }
      });

    } catch (error) {
      console.error('Error handling quote accepted:', error);
    }
  }

  /**
   * Handle quote rejected
   */
  private async handleQuoteRejected(opportunity: any, quoteId: string, notes?: string): Promise<void> {
    try {
      // Create rejection analysis task
      await this.crmService.createActivity({
        contact_id: opportunity.contact_id,
        opportunity_id: opportunity.id,
        activity_type: 'task',
        subject: 'Analyze Quote Rejection',
        description: `Analyze why quote ${quoteId} was rejected and identify improvement opportunities.${notes ? '\n\nRejection reason: ' + notes : ''}`,
        activity_date: new Date().toISOString(),
        status: 'planned',
        priority: 'normal',
        assigned_to: opportunity.assigned_to,
        tags: ['quote_rejected', 'analysis'],
        custom_fields: {
          quote_id: quoteId,
          rejection_reason: notes
        }
      });

      // Create future opportunity task
      await this.crmService.createActivity({
        contact_id: opportunity.contact_id,
        activity_type: 'task',
        subject: 'Future Opportunity Follow-up',
        description: `Follow up for future opportunities after quote rejection`,
        activity_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        status: 'planned',
        priority: 'low',
        assigned_to: opportunity.assigned_to,
        tags: ['future_opportunity', 'long_term_follow_up'],
        custom_fields: {
          original_quote_id: quoteId
        }
      });

    } catch (error) {
      console.error('Error handling quote rejected:', error);
    }
  }

  // ============================================================================
  // BULK OPERATIONS
  // ============================================================================

  /**
   * Bulk create opportunities for multiple quotes
   */
  async bulkCreateQuoteOpportunities(quotesData: QuoteData[]): Promise<any[]> {
    const results = [];
    
    for (const quoteData of quotesData) {
      try {
        const result = await this.createQuoteOpportunity(quoteData);
        results.push({
          quote_id: quoteData.id,
          opportunity_id: result.opportunity_id,
          activity_id: result.activity_id,
          status: 'success'
        });
      } catch (error) {
        results.push({
          quote_id: quoteData.id,
          error: error instanceof Error ? error.message : 'Unknown error',
          status: 'failed'
        });
      }
    }
    
    return results;
  }

  // ============================================================================
  // ANALYTICS & REPORTING
  // ============================================================================

  /**
   * Get quote opportunity statistics
   */
  async getQuoteOpportunityStats(dateFrom: string, dateTo: string): Promise<any> {
    try {
      const opportunities = await this.crmService.getOpportunities(this.organizationId, {
        date_from: dateFrom,
        date_to: dateTo,
        limit: 1000
      });

      // Filter opportunities created from quotes
      const quoteOpportunities = opportunities.filter(opp => 
        opp.custom_fields?.quote_id || opp.tags?.includes('quote_generated')
      );

      const stats = {
        total_quote_opportunities: quoteOpportunities.length,
        total_quote_value: quoteOpportunities.reduce((sum, opp) => sum + (opp.value || 0), 0),
        won_opportunities: quoteOpportunities.filter(opp => opp.status === 'won').length,
        lost_opportunities: quoteOpportunities.filter(opp => opp.status === 'lost').length,
        open_opportunities: quoteOpportunities.filter(opp => opp.status === 'open').length,
        average_deal_size: quoteOpportunities.length > 0 ? 
          quoteOpportunities.reduce((sum, opp) => sum + (opp.value || 0), 0) / quoteOpportunities.length : 0,
        conversion_rate: quoteOpportunities.length > 0 ? 
          (quoteOpportunities.filter(opp => opp.status === 'won').length / quoteOpportunities.length) * 100 : 0,
        by_service_type: this.groupOpportunitiesByServiceType(quoteOpportunities),
        by_load_type: this.groupOpportunitiesByLoadType(quoteOpportunities),
        by_stage: this.groupOpportunitiesByStage(quoteOpportunities)
      };

      return stats;
    } catch (error) {
      console.error('Error getting quote opportunity stats:', error);
      throw error;
    }
  }

  private groupOpportunitiesByServiceType(opportunities: any[]): Record<string, number> {
    return opportunities.reduce((acc, opp) => {
      const serviceType = opp.custom_fields?.service_type || 'unknown';
      acc[serviceType] = (acc[serviceType] || 0) + 1;
      return acc;
    }, {});
  }

  private groupOpportunitiesByLoadType(opportunities: any[]): Record<string, number> {
    return opportunities.reduce((acc, opp) => {
      const loadType = opp.load_type || 'unknown';
      acc[loadType] = (acc[loadType] || 0) + 1;
      return acc;
    }, {});
  }

  private groupOpportunitiesByStage(opportunities: any[]): Record<string, number> {
    return opportunities.reduce((acc, opp) => {
      const stage = opp.stage || 'unknown';
      acc[stage] = (acc[stage] || 0) + 1;
      return acc;
    }, {});
  }
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
// Example 1: Automatic opportunity creation when quote is generated
const quoteIntegration = new CRMQuoteIntegrationService('your-org-id');

await quoteIntegration.createQuoteOpportunity({
  id: 'quote-123',
  shipper_contact_id: 'contact-456',
  origin: 'Chicago, IL',
  origin_city: 'Chicago',
  origin_state: 'IL',
  destination: 'Los Angeles, CA',
  destination_city: 'Los Angeles',
  destination_state: 'CA',
  totalRate: 2500,
  service_type: 'freight_brokerage',
  quote_status: 'sent',
  created_at: '2024-01-15T10:00:00Z'
});

// Example 2: Update opportunity when quote status changes
await quoteIntegration.updateOpportunityFromQuoteStatus(
  'quote-123',
  'accepted',
  'Customer approved rate and timeline'
);

// Example 3: Bulk process quote opportunities
const quotesData = [
  // ... array of quote data
];
const results = await quoteIntegration.bulkCreateQuoteOpportunities(quotesData);
*/ 