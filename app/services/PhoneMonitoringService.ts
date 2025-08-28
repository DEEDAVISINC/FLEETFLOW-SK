/**
 * Phone Monitoring Service for Brokerage Management
 * Tracks all phone calls, integrates with CRM, manages call handoffs
 */

import { getCurrentUser } from '../config/access';
import { tenantPhoneService } from './TenantPhoneService';

export interface CallRecord {
  callId: string;
  callSid?: string;
  tenantId: string;
  employeeId: string;
  employeeName: string;
  employeeDepartment: string;
  customerPhone: string;
  customerName?: string;
  contactId?: string; // CRM contact ID
  leadId?: string; // CRM lead ID
  callDirection: 'inbound' | 'outbound';
  callStatus: 'ringing' | 'connected' | 'completed' | 'failed' | 'abandoned';
  startTime: string;
  answerTime?: string;
  endTime?: string;
  duration: number; // seconds
  platform: 'twilio' | 'freeswitch';
  recordingUrl?: string;
  transcriptionText?: string;
  callPurpose:
    | 'sales'
    | 'dispatch'
    | 'customer_service'
    | 'follow_up'
    | 'emergency';
  callOutcome:
    | 'successful'
    | 'no_answer'
    | 'busy'
    | 'voicemail'
    | 'scheduled_callback';
  callQuality: 'excellent' | 'good' | 'fair' | 'poor';
  handoffs: CallHandoff[];
  crmNotes: CallNote[];
  tags: string[];
  cost: number;
  createdAt: string;
  updatedAt: string;
}

export interface CallHandoff {
  id: string;
  fromEmployeeId: string;
  fromEmployeeName: string;
  toEmployeeId: string;
  toEmployeeName: string;
  handoffReason: string;
  handoffTime: string;
  handoffType: 'transfer' | 'conference' | 'escalation';
  completed: boolean;
}

export interface CallNote {
  id: string;
  employeeId: string;
  employeeName: string;
  noteText: string;
  noteType:
    | 'call_summary'
    | 'follow_up'
    | 'issue'
    | 'opportunity'
    | 'complaint';
  timestamp: string;
  attachments?: string[];
}

export interface CallMetrics {
  tenantId: string;
  totalCalls: number;
  answeredCalls: number;
  missedCalls: number;
  averageCallDuration: number;
  totalCallTime: number;
  callsToday: number;
  callsThisWeek: number;
  callsThisMonth: number;
  answerRate: number;
  averageResponseTime: number;
  customerSatisfactionScore: number;
  costPerCall: number;
  totalCost: number;
}

export interface RealTimeCallEvent {
  type:
    | 'call_started'
    | 'call_answered'
    | 'call_ended'
    | 'call_handoff'
    | 'call_note_added';
  callId: string;
  employeeId: string;
  timestamp: string;
  data: any;
}

export class PhoneMonitoringService {
  private static instance: PhoneMonitoringService;
  private callRecords: Map<string, CallRecord> = new Map();
  private activeCallListeners: Map<string, Function[]> = new Map();

  private constructor() {
    this.initializeDemoData();
  }

  public static getInstance(): PhoneMonitoringService {
    if (!PhoneMonitoringService.instance) {
      PhoneMonitoringService.instance = new PhoneMonitoringService();
    }
    return PhoneMonitoringService.instance;
  }

  /**
   * Initialize with demo call data for different tenants
   */
  private initializeDemoData(): void {
    const demoCallRecords: CallRecord[] = [
      {
        callId: 'call-001',
        callSid: 'CA1234567890',
        tenantId: 'global-freight-solutions',
        employeeId: 'broker-001',
        employeeName: 'John Smith',
        employeeDepartment: 'BB',
        customerPhone: '+15551234567',
        customerName: 'ABC Trucking',
        contactId: 'contact-001',
        leadId: 'lead-001',
        callDirection: 'outbound',
        callStatus: 'completed',
        startTime: new Date(Date.now() - 3600000).toISOString(),
        answerTime: new Date(Date.now() - 3590000).toISOString(),
        endTime: new Date(Date.now() - 3300000).toISOString(),
        duration: 290,
        platform: 'twilio',
        recordingUrl: 'https://api.twilio.com/recordings/RE1234567890',
        transcriptionText:
          'Discussion about new load opportunity from Chicago to Atlanta...',
        callPurpose: 'sales',
        callOutcome: 'successful',
        callQuality: 'excellent',
        handoffs: [],
        crmNotes: [
          {
            id: 'note-001',
            employeeId: 'broker-001',
            employeeName: 'John Smith',
            noteText:
              'Customer interested in weekly Chicago to Atlanta runs. Rate discussed: $2,200. Follow up on Monday.',
            noteType: 'call_summary',
            timestamp: new Date(Date.now() - 3300000).toISOString(),
          },
        ],
        tags: ['hot_lead', 'weekly_runs', 'atlanta_chicago'],
        cost: 0.15,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3300000).toISOString(),
      },
      {
        callId: 'call-002',
        callSid: 'CA1234567891',
        tenantId: 'swift-freight',
        employeeId: 'disp-001',
        employeeName: 'Sarah Johnson',
        employeeDepartment: 'DC',
        customerPhone: '+15559876543',
        customerName: 'XYZ Transport',
        contactId: 'contact-002',
        callDirection: 'inbound',
        callStatus: 'completed',
        startTime: new Date(Date.now() - 1800000).toISOString(),
        answerTime: new Date(Date.now() - 1795000).toISOString(),
        endTime: new Date(Date.now() - 1200000).toISOString(),
        duration: 595,
        platform: 'freeswitch',
        callPurpose: 'dispatch',
        callOutcome: 'successful',
        callQuality: 'good',
        handoffs: [
          {
            id: 'handoff-001',
            fromEmployeeId: 'disp-001',
            fromEmployeeName: 'Sarah Johnson',
            toEmployeeId: 'mgr-001',
            toEmployeeName: 'Fleet Manager',
            handoffReason: 'Rate negotiation required',
            handoffTime: new Date(Date.now() - 1500000).toISOString(),
            handoffType: 'escalation',
            completed: true,
          },
        ],
        crmNotes: [
          {
            id: 'note-002',
            employeeId: 'disp-001',
            employeeName: 'Sarah Johnson',
            noteText:
              'Driver arrived early at pickup. Load ready. Estimated delivery: 2PM tomorrow.',
            noteType: 'call_summary',
            timestamp: new Date(Date.now() - 1200000).toISOString(),
          },
        ],
        tags: ['on_time', 'early_arrival'],
        cost: 0.08,
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        updatedAt: new Date(Date.now() - 1200000).toISOString(),
      },
    ];

    demoCallRecords.forEach((record) => {
      this.callRecords.set(record.callId, record);
    });
  }

  /**
   * Start monitoring a new call
   */
  public startCallMonitoring(callData: {
    employeeId: string;
    employeeName: string;
    employeeDepartment: string;
    customerPhone: string;
    customerName?: string;
    contactId?: string;
    leadId?: string;
    callDirection: 'inbound' | 'outbound';
    platform: 'twilio' | 'freeswitch';
    callSid?: string;
    callPurpose:
      | 'sales'
      | 'dispatch'
      | 'customer_service'
      | 'follow_up'
      | 'emergency';
  }): string {
    const { user } = getCurrentUser();
    const tenantConfig = tenantPhoneService.getCurrentTenantPhoneConfig();

    const callId = `call-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const callRecord: CallRecord = {
      callId,
      callSid: callData.callSid,
      tenantId: tenantConfig?.tenantId || 'unknown',
      employeeId: callData.employeeId,
      employeeName: callData.employeeName,
      employeeDepartment: callData.employeeDepartment,
      customerPhone: callData.customerPhone,
      customerName: callData.customerName,
      contactId: callData.contactId,
      leadId: callData.leadId,
      callDirection: callData.callDirection,
      callStatus: 'ringing',
      startTime: new Date().toISOString(),
      duration: 0,
      platform: callData.platform,
      callPurpose: callData.callPurpose,
      callOutcome: 'successful',
      callQuality: 'good',
      handoffs: [],
      crmNotes: [],
      tags: [],
      cost: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.callRecords.set(callId, callRecord);

    // Broadcast call started event
    this.broadcastEvent({
      type: 'call_started',
      callId,
      employeeId: callData.employeeId,
      timestamp: new Date().toISOString(),
      data: callRecord,
    });

    return callId;
  }

  /**
   * Update call status during the call
   */
  public updateCallStatus(callId: string, updates: Partial<CallRecord>): void {
    const callRecord = this.callRecords.get(callId);
    if (!callRecord) return;

    const updatedRecord = {
      ...callRecord,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Calculate duration if call ended
    if (updates.callStatus === 'completed' && callRecord.startTime) {
      const startTime = new Date(callRecord.startTime).getTime();
      const endTime = new Date().getTime();
      updatedRecord.duration = Math.floor((endTime - startTime) / 1000);
      updatedRecord.endTime = new Date().toISOString();
    }

    this.callRecords.set(callId, updatedRecord);

    // Broadcast status update
    if (updates.callStatus) {
      this.broadcastEvent({
        type:
          updates.callStatus === 'completed' ? 'call_ended' : 'call_answered',
        callId,
        employeeId: callRecord.employeeId,
        timestamp: new Date().toISOString(),
        data: updatedRecord,
      });
    }
  }

  /**
   * Add CRM note to call
   */
  public addCallNote(
    callId: string,
    note: {
      employeeId: string;
      employeeName: string;
      noteText: string;
      noteType:
        | 'call_summary'
        | 'follow_up'
        | 'issue'
        | 'opportunity'
        | 'complaint';
      attachments?: string[];
    }
  ): void {
    const callRecord = this.callRecords.get(callId);
    if (!callRecord) return;

    const callNote: CallNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      employeeId: note.employeeId,
      employeeName: note.employeeName,
      noteText: note.noteText,
      noteType: note.noteType,
      timestamp: new Date().toISOString(),
      attachments: note.attachments,
    };

    callRecord.crmNotes.push(callNote);
    callRecord.updatedAt = new Date().toISOString();

    this.callRecords.set(callId, callRecord);

    // Broadcast note added event
    this.broadcastEvent({
      type: 'call_note_added',
      callId,
      employeeId: note.employeeId,
      timestamp: new Date().toISOString(),
      data: callNote,
    });

    // TODO: Integrate with CRM system
    console.log(`📝 CRM Note Added to Call ${callId}:`, callNote);
  }

  /**
   * Handle call handoff
   */
  public handoffCall(
    callId: string,
    handoffData: {
      fromEmployeeId: string;
      fromEmployeeName: string;
      toEmployeeId: string;
      toEmployeeName: string;
      handoffReason: string;
      handoffType: 'transfer' | 'conference' | 'escalation';
    }
  ): void {
    const callRecord = this.callRecords.get(callId);
    if (!callRecord) return;

    const handoff: CallHandoff = {
      id: `handoff-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fromEmployeeId: handoffData.fromEmployeeId,
      fromEmployeeName: handoffData.fromEmployeeName,
      toEmployeeId: handoffData.toEmployeeId,
      toEmployeeName: handoffData.toEmployeeName,
      handoffReason: handoffData.handoffReason,
      handoffTime: new Date().toISOString(),
      handoffType: handoffData.handoffType,
      completed: false,
    };

    callRecord.handoffs.push(handoff);
    callRecord.updatedAt = new Date().toISOString();

    this.callRecords.set(callId, callRecord);

    // Broadcast handoff event
    this.broadcastEvent({
      type: 'call_handoff',
      callId,
      employeeId: handoffData.fromEmployeeId,
      timestamp: new Date().toISOString(),
      data: handoff,
    });

    console.log(`🔄 Call Handoff Initiated:`, handoff);
  }

  /**
   * Get call records for tenant (filtered by access level)
   */
  public getCallRecords(filters?: {
    tenantId?: string;
    employeeId?: string;
    dateRange?: { start: string; end: string };
    callStatus?: string;
    callPurpose?: string;
    limit?: number;
  }): CallRecord[] {
    const { user } = getCurrentUser();
    const tenantConfig = tenantPhoneService.getCurrentTenantPhoneConfig();

    let records = Array.from(this.callRecords.values());

    // Filter by tenant (users can only see their tenant's calls)
    if (tenantConfig?.tenantId) {
      records = records.filter((r) => r.tenantId === tenantConfig.tenantId);
    }

    // Apply additional filters
    if (filters) {
      if (filters.employeeId) {
        records = records.filter((r) => r.employeeId === filters.employeeId);
      }
      if (filters.callStatus) {
        records = records.filter((r) => r.callStatus === filters.callStatus);
      }
      if (filters.callPurpose) {
        records = records.filter((r) => r.callPurpose === filters.callPurpose);
      }
      if (filters.dateRange) {
        const start = new Date(filters.dateRange.start).getTime();
        const end = new Date(filters.dateRange.end).getTime();
        records = records.filter((r) => {
          const callTime = new Date(r.startTime).getTime();
          return callTime >= start && callTime <= end;
        });
      }
    }

    // Sort by most recent first
    records.sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );

    // Apply limit
    if (filters?.limit) {
      records = records.slice(0, filters.limit);
    }

    return records;
  }

  /**
   * Get call metrics for tenant
   */
  public getCallMetrics(timeRange?: '24h' | '7d' | '30d' | '90d'): CallMetrics {
    const records = this.getCallRecords();
    const now = new Date().getTime();

    let filteredRecords = records;

    if (timeRange) {
      const ranges = {
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
        '90d': 90 * 24 * 60 * 60 * 1000,
      };

      const cutoff = now - ranges[timeRange];
      filteredRecords = records.filter(
        (r) => new Date(r.startTime).getTime() >= cutoff
      );
    }

    const totalCalls = filteredRecords.length;
    const answeredCalls = filteredRecords.filter(
      (r) => r.callStatus === 'completed'
    ).length;
    const missedCalls = totalCalls - answeredCalls;
    const totalCallTime = filteredRecords.reduce(
      (sum, r) => sum + r.duration,
      0
    );
    const totalCost = filteredRecords.reduce((sum, r) => sum + r.cost, 0);

    // Time-based counts
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;

    const callsToday = records.filter(
      (r) => new Date(r.startTime).getTime() >= oneDayAgo
    ).length;
    const callsThisWeek = records.filter(
      (r) => new Date(r.startTime).getTime() >= oneWeekAgo
    ).length;
    const callsThisMonth = records.filter(
      (r) => new Date(r.startTime).getTime() >= oneMonthAgo
    ).length;

    return {
      tenantId:
        tenantPhoneService.getCurrentTenantPhoneConfig()?.tenantId || 'unknown',
      totalCalls,
      answeredCalls,
      missedCalls,
      averageCallDuration:
        totalCalls > 0 ? Math.round(totalCallTime / totalCalls) : 0,
      totalCallTime,
      callsToday,
      callsThisWeek,
      callsThisMonth,
      answerRate:
        totalCalls > 0 ? Math.round((answeredCalls / totalCalls) * 100) : 0,
      averageResponseTime: 8, // Mock data - would calculate from ring time
      customerSatisfactionScore: 4.2, // Mock data - would come from surveys
      costPerCall: totalCalls > 0 ? totalCost / totalCalls : 0,
      totalCost,
    };
  }

  /**
   * Get active calls for real-time monitoring
   */
  public getActiveCalls(): CallRecord[] {
    return this.getCallRecords().filter(
      (r) => r.callStatus === 'ringing' || r.callStatus === 'connected'
    );
  }

  /**
   * Subscribe to real-time call events
   */
  public subscribeToCallEvents(
    callback: (event: RealTimeCallEvent) => void
  ): () => void {
    const tenantId =
      tenantPhoneService.getCurrentTenantPhoneConfig()?.tenantId || 'unknown';

    if (!this.activeCallListeners.has(tenantId)) {
      this.activeCallListeners.set(tenantId, []);
    }

    this.activeCallListeners.get(tenantId)!.push(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.activeCallListeners.get(tenantId) || [];
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }

  /**
   * Broadcast event to all subscribers
   */
  private broadcastEvent(event: RealTimeCallEvent): void {
    const callRecord = this.callRecords.get(event.callId);
    if (!callRecord) return;

    const listeners = this.activeCallListeners.get(callRecord.tenantId) || [];
    listeners.forEach((callback) => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error broadcasting call event:', error);
      }
    });
  }
}

// Export singleton instance
export const phoneMonitoringService = PhoneMonitoringService.getInstance();














