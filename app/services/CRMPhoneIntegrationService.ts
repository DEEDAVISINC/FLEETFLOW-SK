/**
 * CRM Phone Integration Service
 * Integrates phone monitoring with the existing CRM system
 */

import { enhancedCRMService } from './EnhancedCRMService';
import {
  CallNote,
  CallRecord,
  phoneMonitoringService,
} from './PhoneMonitoringService';

export interface CRMCallActivity {
  id: string;
  contactId: string;
  leadId?: string;
  callId: string;
  callDirection: 'inbound' | 'outbound';
  duration: number;
  outcome: string;
  notes: string;
  nextAction?: string;
  followUpDate?: string;
  priority: 'high' | 'medium' | 'low';
  tags: string[];
  recordingUrl?: string;
  employeeId: string;
  employeeName: string;
  createdAt: string;
}

export interface CRMContactUpdate {
  contactId: string;
  lastCallDate: string;
  totalCalls: number;
  totalCallDuration: number;
  lastCallOutcome: string;
  lastCallNotes: string;
  nextFollowUp?: string;
  relationship: {
    status: 'cold' | 'warm' | 'hot' | 'active' | 'inactive';
    lastInteraction: string;
    interactionType: 'call' | 'email' | 'meeting';
    score: number;
  };
}

export class CRMPhoneIntegrationService {
  private static instance: CRMPhoneIntegrationService;

  private constructor() {
    this.initializeIntegration();
  }

  public static getInstance(): CRMPhoneIntegrationService {
    if (!CRMPhoneIntegrationService.instance) {
      CRMPhoneIntegrationService.instance = new CRMPhoneIntegrationService();
    }
    return CRMPhoneIntegrationService.instance;
  }

  /**
   * Initialize integration with phone monitoring events
   */
  private initializeIntegration(): void {
    // Subscribe to phone monitoring events
    phoneMonitoringService.subscribeToCallEvents((event) => {
      this.handlePhoneEvent(event);
    });
  }

  /**
   * Handle phone monitoring events and sync with CRM
   */
  private async handlePhoneEvent(event: any): Promise<void> {
    try {
      switch (event.type) {
        case 'call_started':
          await this.handleCallStarted(event.data);
          break;
        case 'call_ended':
          await this.handleCallEnded(event.data);
          break;
        case 'call_note_added':
          await this.handleCallNoteAdded(event.callId, event.data);
          break;
      }
    } catch (error) {
      console.error('Error handling phone event for CRM:', error);
    }
  }

  /**
   * Handle call started event
   */
  private async handleCallStarted(callRecord: CallRecord): Promise<void> {
    console.info(`🔗 CRM Integration: Call started - ${callRecord.callId}`);

    // Try to match phone number with existing CRM contacts
    const contact = await this.findContactByPhone(callRecord.customerPhone);

    if (contact) {
      // Update call record with contact information
      phoneMonitoringService.updateCallStatus(callRecord.callId, {
        contactId: contact.id,
        customerName:
          contact.personalInfo?.firstName +
          ' ' +
          contact.personalInfo?.lastName,
      });

      console.info(
        `✅ Call matched to CRM contact: ${contact.personalInfo?.firstName} ${contact.personalInfo?.lastName}`
      );
    } else {
      // Create opportunity to add new contact
      console.info(`💡 New contact opportunity: ${callRecord.customerPhone}`);

      if (callRecord.callDirection === 'inbound') {
        // For inbound calls, suggest creating a new contact
        await this.suggestNewContact(callRecord);
      }
    }
  }

  /**
   * Handle call ended event
   */
  private async handleCallEnded(callRecord: CallRecord): Promise<void> {
    console.info(`🔗 CRM Integration: Call ended - ${callRecord.callId}`);

    // Create CRM call activity
    await this.createCRMCallActivity(callRecord);

    // Update contact relationship if contact exists
    if (callRecord.contactId) {
      await this.updateContactRelationship(callRecord);
    }

    // Trigger follow-up workflows based on call outcome
    await this.triggerFollowUpWorkflows(callRecord);
  }

  /**
   * Handle call note added event
   */
  private async handleCallNoteAdded(
    callId: string,
    note: CallNote
  ): Promise<void> {
    console.info(`🔗 CRM Integration: Note added to call ${callId}`);

    const callRecords = phoneMonitoringService.getCallRecords({ limit: 100 });
    const callRecord = callRecords.find((c) => c.callId === callId);

    if (callRecord && callRecord.contactId) {
      // Add note to CRM contact
      await this.addNoteToContact(callRecord.contactId, note);

      // Update contact based on note type
      if (note.noteType === 'opportunity') {
        await this.markContactAsOpportunity(
          callRecord.contactId,
          note.noteText
        );
      } else if (note.noteType === 'issue') {
        await this.markContactAsIssue(callRecord.contactId, note.noteText);
      }
    }
  }

  /**
   * Find CRM contact by phone number
   */
  private async findContactByPhone(phoneNumber: string): Promise<any | null> {
    try {
      const contacts = enhancedCRMService.getContacts({ limit: 1000 });

      // Clean phone number for comparison
      const cleanPhone = phoneNumber.replace(/\D/g, '');

      const contact = contacts.find((c) => {
        const contactPhone = (c.phone || c.personalInfo?.phone || '').replace(
          /\D/g,
          ''
        );
        return (
          contactPhone === cleanPhone ||
          contactPhone.endsWith(cleanPhone.slice(-10))
        );
      });

      return contact || null;
    } catch (error) {
      console.error('Error finding contact by phone:', error);
      return null;
    }
  }

  /**
   * Create CRM call activity
   */
  private async createCRMCallActivity(callRecord: CallRecord): Promise<void> {
    const activity: CRMCallActivity = {
      id: `activity-${callRecord.callId}`,
      contactId: callRecord.contactId || 'unknown',
      leadId: callRecord.leadId,
      callId: callRecord.callId,
      callDirection: callRecord.callDirection,
      duration: callRecord.duration,
      outcome: callRecord.callOutcome,
      notes: callRecord.crmNotes.map((n) => n.noteText).join('\n\n'),
      priority: this.determinePriority(callRecord),
      tags: callRecord.tags,
      recordingUrl: callRecord.recordingUrl,
      employeeId: callRecord.employeeId,
      employeeName: callRecord.employeeName,
      createdAt: callRecord.createdAt,
    };

    // TODO: Save to CRM system
    console.info(`💾 CRM Call Activity Created:`, activity);
  }

  /**
   * Update contact relationship based on call
   */
  private async updateContactRelationship(
    callRecord: CallRecord
  ): Promise<void> {
    if (!callRecord.contactId) return;

    const relationshipUpdate: CRMContactUpdate = {
      contactId: callRecord.contactId,
      lastCallDate: callRecord.endTime || callRecord.startTime,
      totalCalls: 1, // TODO: Calculate from history
      totalCallDuration: callRecord.duration,
      lastCallOutcome: callRecord.callOutcome,
      lastCallNotes:
        callRecord.crmNotes[callRecord.crmNotes.length - 1]?.noteText || '',
      relationship: {
        status: this.determineContactStatus(callRecord),
        lastInteraction: callRecord.endTime || callRecord.startTime,
        interactionType: 'call',
        score: this.calculateRelationshipScore(callRecord),
      },
    };

    // TODO: Update CRM contact
    console.info(`🔄 Contact Relationship Updated:`, relationshipUpdate);
  }

  /**
   * Suggest creating new contact for unknown caller
   */
  private async suggestNewContact(callRecord: CallRecord): Promise<void> {
    const suggestion = {
      phone: callRecord.customerPhone,
      callDate: callRecord.startTime,
      callDuration: callRecord.duration,
      callDirection: callRecord.callDirection,
      suggestedName: 'Unknown Caller',
      suggestedCompany: this.guessCompanyFromPhone(callRecord.customerPhone),
      priority: callRecord.callPurpose === 'emergency' ? 'high' : 'medium',
    };

    // TODO: Present suggestion to user or auto-create
    console.info(`💡 New Contact Suggestion:`, suggestion);
  }

  /**
   * Add note to CRM contact
   */
  private async addNoteToContact(
    contactId: string,
    note: CallNote
  ): Promise<void> {
    const crmNote = {
      contactId,
      noteText: note.noteText,
      noteType: note.noteType,
      createdBy: note.employeeName,
      createdAt: note.timestamp,
      source: 'phone_call',
    };

    // TODO: Add to CRM system
    console.info(`📝 Note Added to CRM Contact ${contactId}:`, crmNote);
  }

  /**
   * Mark contact as opportunity
   */
  private async markContactAsOpportunity(
    contactId: string,
    details: string
  ): Promise<void> {
    // TODO: Update contact status in CRM
    console.info(`🎯 Contact ${contactId} marked as opportunity: ${details}`);
  }

  /**
   * Mark contact as having an issue
   */
  private async markContactAsIssue(
    contactId: string,
    details: string
  ): Promise<void> {
    // TODO: Create support ticket or flag contact
    console.info(`🚨 Issue flagged for contact ${contactId}: ${details}`);
  }

  /**
   * Trigger follow-up workflows based on call outcome
   */
  private async triggerFollowUpWorkflows(
    callRecord: CallRecord
  ): Promise<void> {
    const workflows: string[] = [];

    switch (callRecord.callOutcome) {
      case 'no_answer':
        workflows.push('schedule_callback');
        break;
      case 'voicemail':
        workflows.push('follow_up_email');
        break;
      case 'scheduled_callback':
        workflows.push('set_reminder');
        break;
      case 'successful':
        if (callRecord.crmNotes.some((n) => n.noteType === 'opportunity')) {
          workflows.push('opportunity_follow_up');
        }
        break;
    }

    // TODO: Execute workflows
    if (workflows.length > 0) {
      console.info(
        `⚡ Triggered workflows for call ${callRecord.callId}:`,
        workflows
      );
    }
  }

  /**
   * Determine call priority based on various factors
   */
  private determinePriority(callRecord: CallRecord): 'high' | 'medium' | 'low' {
    if (callRecord.callPurpose === 'emergency') return 'high';
    if (callRecord.handoffs.length > 0) return 'high';
    if (callRecord.duration > 600) return 'medium'; // > 10 minutes
    if (callRecord.crmNotes.some((n) => n.noteType === 'opportunity'))
      return 'high';
    if (callRecord.crmNotes.some((n) => n.noteType === 'complaint'))
      return 'high';
    return 'medium';
  }

  /**
   * Determine contact status based on call
   */
  private determineContactStatus(
    callRecord: CallRecord
  ): 'cold' | 'warm' | 'hot' | 'active' | 'inactive' {
    if (callRecord.callOutcome === 'successful' && callRecord.duration > 300) {
      if (callRecord.crmNotes.some((n) => n.noteType === 'opportunity'))
        return 'hot';
      return 'warm';
    }
    if (callRecord.callOutcome === 'no_answer') return 'cold';
    return 'active';
  }

  /**
   * Calculate relationship score based on call interaction
   */
  private calculateRelationshipScore(callRecord: CallRecord): number {
    let score = 50; // Base score

    // Positive factors
    if (callRecord.callOutcome === 'successful') score += 20;
    if (callRecord.duration > 300) score += 15;
    if (callRecord.crmNotes.some((n) => n.noteType === 'opportunity'))
      score += 25;
    if (callRecord.callDirection === 'inbound') score += 10;

    // Negative factors
    if (callRecord.callOutcome === 'no_answer') score -= 10;
    if (callRecord.crmNotes.some((n) => n.noteType === 'complaint'))
      score -= 15;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Guess company name from phone number (area code lookup)
   */
  private guessCompanyFromPhone(phone: string): string {
    const areaCode = phone.replace(/\D/g, '').substring(1, 4);

    // Basic area code to region mapping
    const areaCodeMap: { [key: string]: string } = {
      '212': 'New York Company',
      '213': 'Los Angeles Company',
      '312': 'Chicago Company',
      '713': 'Houston Company',
      '214': 'Dallas Company',
      '404': 'Atlanta Company',
      '305': 'Miami Company',
    };

    return areaCodeMap[areaCode] || 'Unknown Company';
  }

  /**
   * Get call history for a specific contact
   */
  public getContactCallHistory(contactId: string): CallRecord[] {
    return phoneMonitoringService
      .getCallRecords()
      .filter((call) => call.contactId === contactId);
  }

  /**
   * Get call summary for CRM dashboard
   */
  public getCallSummaryForCRM(timeRange?: '24h' | '7d' | '30d'): {
    totalCalls: number;
    connectedCalls: number;
    newContacts: number;
    opportunities: number;
    followUpsRequired: number;
  } {
    const calls = phoneMonitoringService.getCallRecords();
    const now = new Date().getTime();

    let filteredCalls = calls;
    if (timeRange) {
      const ranges = {
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
      };
      const cutoff = now - ranges[timeRange];
      filteredCalls = calls.filter(
        (c) => new Date(c.startTime).getTime() >= cutoff
      );
    }

    return {
      totalCalls: filteredCalls.length,
      connectedCalls: filteredCalls.filter((c) => c.callStatus === 'completed')
        .length,
      newContacts: filteredCalls.filter((c) => !c.contactId).length,
      opportunities: filteredCalls.filter((c) =>
        c.crmNotes.some((n) => n.noteType === 'opportunity')
      ).length,
      followUpsRequired: filteredCalls.filter(
        (c) =>
          c.callOutcome === 'scheduled_callback' ||
          c.crmNotes.some((n) => n.noteType === 'follow_up')
      ).length,
    };
  }
}

// Export singleton instance
export const crmPhoneIntegrationService =
  CRMPhoneIntegrationService.getInstance();

