// ============================================================================
// FLEETFLOW CRM CALL INTEGRATION SERVICE - PRODUCTION READY
// ============================================================================

import CRMService from './CRMService';

// ============================================================================
// TYPESCRIPT INTERFACES
// ============================================================================

interface CallData {
  id: string;
  contact_id?: string;
  phone_number: string;
  call_direction: 'inbound' | 'outbound';
  call_duration: number; // in seconds
  call_outcome: 'connected' | 'no_answer' | 'busy' | 'voicemail' | 'disconnected';
  call_notes?: string;
  call_recording_url?: string;
  agent_id?: string;
  started_at: string;
  ended_at: string;
  call_type?: 'driver_recruitment' | 'shipper_inquiry' | 'carrier_follow_up' | 'customer_service' | 'sales';
}

interface CallActivity {
  contact_id?: string;
  activity_type: 'call';
  subject: string;
  description?: string;
  activity_date: string;
  duration_minutes: number;
  status: 'completed';
  call_direction: 'inbound' | 'outbound';
  call_outcome: string;
  call_recording_url?: string;
  assigned_to?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  tags?: string[];
  custom_fields?: Record<string, any>;
}

interface ContactMatchResult {
  contact_id: string | null;
  confidence: 'high' | 'medium' | 'low';
  matched_by: 'phone' | 'email' | 'name' | 'manual';
  contact_info?: {
    name: string;
    email: string;
    company: string;
    contact_type: string;
  };
}

// ============================================================================
// CRM CALL INTEGRATION SERVICE
// ============================================================================

export default class CRMCallIntegrationService {
  private crmService: CRMService;
  private organizationId: string;

  constructor(organizationId: string) {
    this.crmService = new CRMService(organizationId);
    this.organizationId = organizationId;
  }

  // ============================================================================
  // AUTOMATIC ACTIVITY CREATION
  // ============================================================================

  /**
   * Automatically create CRM activity when a call ends
   */
  async createCallActivity(callData: CallData): Promise<any> {
    try {
      // Match contact by phone number if not provided
      let contactId = callData.contact_id;
      if (!contactId) {
        const contactMatch = await this.findContactByPhone(callData.phone_number);
        contactId = contactMatch.contact_id;
      }

      // Generate appropriate subject based on call type and outcome
      const subject = this.generateCallSubject(callData);

      // Create call activity
      const activity: CallActivity = {
        contact_id: contactId,
        activity_type: 'call',
        subject: subject,
        description: this.generateCallDescription(callData),
        activity_date: callData.ended_at,
        duration_minutes: Math.ceil(callData.call_duration / 60),
        status: 'completed',
        call_direction: callData.call_direction,
        call_outcome: callData.call_outcome,
        call_recording_url: callData.call_recording_url,
        assigned_to: callData.agent_id,
        priority: this.determineCallPriority(callData),
        tags: this.generateCallTags(callData),
        custom_fields: {
          call_id: callData.id,
          call_type: callData.call_type,
          phone_number: callData.phone_number,
          call_duration_seconds: callData.call_duration
        }
      };

      const createdActivity = await this.crmService.createActivity(activity);

      // Update contact's last interaction date and lead score
      if (contactId) {
        await this.updateContactFromCall(contactId, callData);
      }

      // Create follow-up tasks if needed
      await this.createFollowUpTasks(callData, createdActivity.id);

      return createdActivity;

    } catch (error) {
      console.error('Error creating call activity:', error);
      throw error;
    }
  }

  // ============================================================================
  // CONTACT MATCHING
  // ============================================================================

  /**
   * Find contact by phone number with fuzzy matching
   */
  async findContactByPhone(phoneNumber: string): Promise<ContactMatchResult> {
    try {
      // Normalize phone number (remove formatting)
      const normalizedPhone = phoneNumber.replace(/\D/g, '');
      
      // Search for contacts with matching phone numbers
      const contacts = await this.crmService.getContacts(this.organizationId, {
        search: phoneNumber,
        limit: 10
      });

      // Find exact match
      for (const contact of contacts) {
        const contactPhone = contact.phone?.replace(/\D/g, '');
        const contactMobile = contact.mobile?.replace(/\D/g, '');
        
        if (contactPhone === normalizedPhone || contactMobile === normalizedPhone) {
          return {
            contact_id: contact.id,
            confidence: 'high',
            matched_by: 'phone',
            contact_info: {
              name: `${contact.first_name} ${contact.last_name}`,
              email: contact.email || '',
              company: contact.company_name || '',
              contact_type: contact.contact_type
            }
          };
        }
      }

      // If no exact match, try partial matching (last 7 digits)
      const lastSevenDigits = normalizedPhone.slice(-7);
      for (const contact of contacts) {
        const contactPhone = contact.phone?.replace(/\D/g, '').slice(-7);
        const contactMobile = contact.mobile?.replace(/\D/g, '').slice(-7);
        
        if (contactPhone === lastSevenDigits || contactMobile === lastSevenDigits) {
          return {
            contact_id: contact.id,
            confidence: 'medium',
            matched_by: 'phone',
            contact_info: {
              name: `${contact.first_name} ${contact.last_name}`,
              email: contact.email || '',
              company: contact.company_name || '',
              contact_type: contact.contact_type
            }
          };
        }
      }

      return {
        contact_id: null,
        confidence: 'low',
        matched_by: 'phone'
      };

    } catch (error) {
      console.error('Error finding contact by phone:', error);
      return {
        contact_id: null,
        confidence: 'low',
        matched_by: 'phone'
      };
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Generate appropriate call subject based on call data
   */
  private generateCallSubject(callData: CallData): string {
    const direction = callData.call_direction === 'inbound' ? 'Inbound' : 'Outbound';
    const outcome = callData.call_outcome;
    
    const typeMap = {
      'driver_recruitment': 'Driver Recruitment',
      'shipper_inquiry': 'Shipper Inquiry',
      'carrier_follow_up': 'Carrier Follow-up',
      'customer_service': 'Customer Service',
      'sales': 'Sales Call'
    };

    const callType = typeMap[callData.call_type as keyof typeof typeMap] || 'Phone';
    
    if (outcome === 'connected') {
      return `${direction} ${callType} Call - Connected`;
    } else if (outcome === 'no_answer') {
      return `${direction} ${callType} Call - No Answer`;
    } else if (outcome === 'voicemail') {
      return `${direction} ${callType} Call - Voicemail`;
    } else {
      return `${direction} ${callType} Call - ${outcome}`;
    }
  }

  /**
   * Generate call description with key details
   */
  private generateCallDescription(callData: CallData): string {
    const duration = Math.ceil(callData.call_duration / 60);
    let description = `${callData.call_direction.toUpperCase()} call to ${callData.phone_number}\n`;
    description += `Duration: ${duration} minutes\n`;
    description += `Outcome: ${callData.call_outcome}\n`;
    
    if (callData.call_type) {
      description += `Call Type: ${callData.call_type}\n`;
    }
    
    if (callData.call_notes) {
      description += `\nNotes:\n${callData.call_notes}`;
    }
    
    return description;
  }

  /**
   * Determine call priority based on call data
   */
  private determineCallPriority(callData: CallData): 'low' | 'normal' | 'high' | 'urgent' {
    // High priority for long calls that were successful
    if (callData.call_outcome === 'connected' && callData.call_duration > 300) {
      return 'high';
    }
    
    // Urgent for certain call types
    if (callData.call_type === 'customer_service' || callData.call_type === 'sales') {
      return 'high';
    }
    
    // Normal for most calls
    if (callData.call_outcome === 'connected') {
      return 'normal';
    }
    
    // Low for unsuccessful calls
    return 'low';
  }

  /**
   * Generate tags for call activity
   */
  private generateCallTags(callData: CallData): string[] {
    const tags: string[] = [];
    
    tags.push(callData.call_direction);
    tags.push(callData.call_outcome);
    
    if (callData.call_type) {
      tags.push(callData.call_type);
    }
    
    if (callData.call_duration > 300) {
      tags.push('long_call');
    }
    
    if (callData.call_recording_url) {
      tags.push('recorded');
    }
    
    return tags;
  }

  /**
   * Update contact information based on call data
   */
  private async updateContactFromCall(contactId: string, callData: CallData): Promise<void> {
    try {
      // Recalculate lead score after call activity
      await this.crmService.calculateLeadScore(contactId);
      
      // Update contact's last interaction timestamp
      await this.crmService.updateContact(contactId, {
        updated_at: callData.ended_at
      });
      
    } catch (error) {
      console.error('Error updating contact from call:', error);
    }
  }

  /**
   * Create follow-up tasks based on call outcome
   */
  private async createFollowUpTasks(callData: CallData, activityId: string): Promise<void> {
    try {
      let followUpTask = null;
      
      if (callData.call_outcome === 'no_answer') {
        followUpTask = {
          activity_type: 'task' as const,
          subject: 'Follow-up: No Answer Call',
          description: `Follow up on missed call to ${callData.phone_number}`,
          activity_date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
          status: 'planned' as const,
          priority: 'normal' as const,
          contact_id: callData.contact_id,
          assigned_to: callData.agent_id,
          tags: ['follow_up', 'missed_call'],
          custom_fields: {
            original_call_id: callData.id,
            related_activity_id: activityId
          }
        };
      } else if (callData.call_outcome === 'voicemail') {
        followUpTask = {
          activity_type: 'task' as const,
          subject: 'Follow-up: Voicemail Left',
          description: `Follow up on voicemail left for ${callData.phone_number}`,
          activity_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours later
          status: 'planned' as const,
          priority: 'normal' as const,
          contact_id: callData.contact_id,
          assigned_to: callData.agent_id,
          tags: ['follow_up', 'voicemail'],
          custom_fields: {
            original_call_id: callData.id,
            related_activity_id: activityId
          }
        };
      } else if (callData.call_outcome === 'connected' && callData.call_type === 'driver_recruitment') {
        followUpTask = {
          activity_type: 'task' as const,
          subject: 'Follow-up: Driver Recruitment Call',
          description: `Follow up on driver recruitment discussion with ${callData.phone_number}`,
          activity_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days later
          status: 'planned' as const,
          priority: 'high' as const,
          contact_id: callData.contact_id,
          assigned_to: callData.agent_id,
          tags: ['follow_up', 'driver_recruitment'],
          custom_fields: {
            original_call_id: callData.id,
            related_activity_id: activityId
          }
        };
      }
      
      if (followUpTask) {
        await this.crmService.createActivity(followUpTask);
      }
      
    } catch (error) {
      console.error('Error creating follow-up tasks:', error);
    }
  }

  // ============================================================================
  // BULK OPERATIONS
  // ============================================================================

  /**
   * Bulk create activities for multiple calls
   */
  async bulkCreateCallActivities(callsData: CallData[]): Promise<any[]> {
    const results = [];
    
    for (const callData of callsData) {
      try {
        const activity = await this.createCallActivity(callData);
        results.push({
          call_id: callData.id,
          activity_id: activity.id,
          status: 'success'
        });
      } catch (error) {
        results.push({
          call_id: callData.id,
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
   * Get call activity statistics
   */
  async getCallActivityStats(dateFrom: string, dateTo: string): Promise<any> {
    try {
      const activities = await this.crmService.getActivities(this.organizationId, {
        activity_type: 'call',
        date_from: dateFrom,
        date_to: dateTo,
        limit: 1000
      });

      const stats = {
        total_calls: activities.length,
        inbound_calls: activities.filter(a => a.call_direction === 'inbound').length,
        outbound_calls: activities.filter(a => a.call_direction === 'outbound').length,
        connected_calls: activities.filter(a => a.call_outcome === 'connected').length,
        missed_calls: activities.filter(a => a.call_outcome === 'no_answer').length,
        voicemail_calls: activities.filter(a => a.call_outcome === 'voicemail').length,
        average_duration: activities.reduce((sum, a) => sum + (a.duration_minutes || 0), 0) / activities.length,
        connection_rate: activities.length > 0 ? (activities.filter(a => a.call_outcome === 'connected').length / activities.length) * 100 : 0,
        by_type: this.groupCallsByType(activities),
        by_outcome: this.groupCallsByOutcome(activities),
        by_agent: this.groupCallsByAgent(activities)
      };

      return stats;
    } catch (error) {
      console.error('Error getting call activity stats:', error);
      throw error;
    }
  }

  private groupCallsByType(activities: any[]): Record<string, number> {
    return activities.reduce((acc, activity) => {
      const type = activity.custom_fields?.call_type || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
  }

  private groupCallsByOutcome(activities: any[]): Record<string, number> {
    return activities.reduce((acc, activity) => {
      const outcome = activity.call_outcome || 'unknown';
      acc[outcome] = (acc[outcome] || 0) + 1;
      return acc;
    }, {});
  }

  private groupCallsByAgent(activities: any[]): Record<string, number> {
    return activities.reduce((acc, activity) => {
      const agent = activity.assigned_to || 'unassigned';
      acc[agent] = (acc[agent] || 0) + 1;
      return acc;
    }, {});
  }

  // ============================================================================
  // WEBHOOK INTEGRATION
  // ============================================================================

  /**
   * Handle webhook from call system
   */
  async handleCallWebhook(webhookData: any): Promise<any> {
    try {
      // Parse webhook data into CallData format
      const callData: CallData = {
        id: webhookData.call_id,
        contact_id: webhookData.contact_id,
        phone_number: webhookData.phone_number,
        call_direction: webhookData.direction,
        call_duration: webhookData.duration,
        call_outcome: webhookData.outcome,
        call_notes: webhookData.notes,
        call_recording_url: webhookData.recording_url,
        agent_id: webhookData.agent_id,
        started_at: webhookData.started_at,
        ended_at: webhookData.ended_at,
        call_type: webhookData.call_type
      };

      // Create CRM activity
      const activity = await this.createCallActivity(callData);

      return {
        success: true,
        activity_id: activity.id,
        message: 'Call activity created successfully'
      };

    } catch (error) {
      console.error('Error handling call webhook:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
// Example 1: Automatic activity creation when call ends
const callIntegration = new CRMCallIntegrationService('your-org-id');

await callIntegration.createCallActivity({
  id: 'call-123',
  contact_id: 'contact-456',
  phone_number: '+1-555-0123',
  call_direction: 'outbound',
  call_duration: 180,
  call_outcome: 'connected',
  call_notes: 'Discussed driver requirements and schedule',
  agent_id: 'agent-789',
  started_at: '2024-01-15T10:00:00Z',
  ended_at: '2024-01-15T10:03:00Z',
  call_type: 'driver_recruitment'
});

// Example 2: Bulk process call activities
const callsData = [
  // ... array of call data
];
const results = await callIntegration.bulkCreateCallActivities(callsData);

// Example 3: Get call statistics
const stats = await callIntegration.getCallActivityStats(
  '2024-01-01T00:00:00Z',
  '2024-01-31T23:59:59Z'
);
*/ 