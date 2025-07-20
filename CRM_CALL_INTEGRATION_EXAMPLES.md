# 🚀 FleetFlow CRM Call Integration Examples

## Overview
This document provides comprehensive examples of how to integrate call system events with the FleetFlow CRM to automatically create activities, track interactions, and maintain comprehensive customer communication records.

## 🏗️ **Architecture Overview**

### Components
1. **CRMCallIntegrationService**: Main service for call-CRM integration
2. **CRM API Endpoints**: `/api/crm/call-integration/`
3. **Webhook Handlers**: For real-time call event processing
4. **Bulk Operations**: For processing multiple calls at once

---

## 📞 **Basic Call Integration**

### Example 1: Automatic Activity Creation When Call Ends

```typescript
import CRMCallIntegrationService from './services/CRMCallIntegrationService';

// Initialize the service
const callIntegration = new CRMCallIntegrationService('your-org-id');

// When a call ends, automatically create CRM activity
async function handleCallEnd(call: any, contact: any) {
  try {
    await callIntegration.createCallActivity({
      id: call.id,
      contact_id: contact.id,
      phone_number: call.phone_number,
      call_direction: 'outbound',
      call_duration: call.duration_seconds,
      call_outcome: 'connected',
      call_notes: call.notes,
      call_recording_url: call.recording_url,
      agent_id: call.agent_id,
      started_at: call.started_at,
      ended_at: call.ended_at,
      call_type: 'driver_recruitment'
    });
    
    console.log('✅ CRM activity created automatically');
  } catch (error) {
    console.error('❌ Error creating CRM activity:', error);
  }
}

// Example usage in your call system
call.on('ended', () => {
  handleCallEnd(call, contact);
});
```

### Example 2: Driver Recruitment Call Integration

```typescript
// Specifically for driver recruitment calls
async function handleDriverRecruitmentCall(callData: any) {
  const callIntegration = new CRMCallIntegrationService('your-org-id');
  
  await callIntegration.createCallActivity({
    id: callData.id,
    contact_id: callData.contact_id,
    phone_number: callData.phone_number,
    call_direction: 'outbound',
    call_duration: callData.duration_seconds,
    call_outcome: 'connected',
    call_notes: `
      Driver Requirements Discussion:
      - CDL Class: ${callData.cdl_class}
      - Experience: ${callData.experience_years} years
      - Availability: ${callData.availability}
      - Interested in: ${callData.route_preferences}
    `,
    agent_id: callData.recruiter_id,
    started_at: callData.started_at,
    ended_at: callData.ended_at,
    call_type: 'driver_recruitment'
  });
}
```

### Example 3: Shipper Inquiry Call Integration

```typescript
async function handleShipperInquiry(callData: any) {
  const callIntegration = new CRMCallIntegrationService('your-org-id');
  
  await callIntegration.createCallActivity({
    id: callData.id,
    contact_id: callData.contact_id,
    phone_number: callData.phone_number,
    call_direction: 'inbound',
    call_duration: callData.duration_seconds,
    call_outcome: 'connected',
    call_notes: `
      Shipper Inquiry Details:
      - Load Type: ${callData.load_type}
      - Origin: ${callData.origin_city}, ${callData.origin_state}
      - Destination: ${callData.destination_city}, ${callData.destination_state}
      - Weight: ${callData.weight} lbs
      - Pickup Date: ${callData.pickup_date}
      - Rate Quote: $${callData.quoted_rate}
    `,
    agent_id: callData.agent_id,
    started_at: callData.started_at,
    ended_at: callData.ended_at,
    call_type: 'shipper_inquiry'
  });
}
```

---

## 🔗 **API Integration Examples**

### Example 4: Using the Call Integration API

```javascript
// Create call activity via API
async function createCallActivityViaAPI(callData) {
  const response = await fetch('/api/crm/call-integration', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-organization-id': 'your-org-id'
    },
    body: JSON.stringify({
      id: callData.id,
      contact_id: callData.contact_id,
      phone_number: callData.phone_number,
      call_direction: callData.direction,
      call_duration: callData.duration,
      call_outcome: callData.outcome,
      call_notes: callData.notes,
      agent_id: callData.agent_id,
      started_at: callData.started_at,
      ended_at: callData.ended_at,
      call_type: callData.type
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    console.log('Activity created:', result.data);
  } else {
    console.error('Error:', result.error);
  }
}
```

### Example 5: Webhook Handler

```javascript
// Express.js webhook handler
app.post('/webhook/call-ended', async (req, res) => {
  const callData = req.body;
  
  try {
    // Forward to CRM integration API
    const response = await fetch('/api/crm/call-integration', {
      method: 'PUT', // Use PUT for webhook handling
      headers: {
        'Content-Type': 'application/json',
        'x-organization-id': callData.organization_id
      },
      body: JSON.stringify(callData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      res.json({ status: 'success', activity_id: result.data.activity_id });
    } else {
      res.status(400).json({ status: 'error', message: result.message });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});
```

---

## 📊 **Advanced Integration Patterns**

### Example 6: Bulk Call Processing

```typescript
// Process multiple calls at once
async function processBulkCalls(callsData: any[]) {
  const callIntegration = new CRMCallIntegrationService('your-org-id');
  
  const results = await callIntegration.bulkCreateCallActivities(callsData);
  
  console.log(`Processed ${results.length} calls:`);
  results.forEach(result => {
    if (result.status === 'success') {
      console.log(`✅ Call ${result.call_id} -> Activity ${result.activity_id}`);
    } else {
      console.log(`❌ Call ${result.call_id} -> Error: ${result.error}`);
    }
  });
}
```

### Example 7: Real-time Call Statistics

```typescript
// Get call activity statistics
async function getCallStats() {
  const response = await fetch('/api/crm/call-integration?action=stats&date_from=2024-01-01&date_to=2024-01-31', {
    headers: {
      'x-organization-id': 'your-org-id'
    }
  });
  
  const result = await response.json();
  
  console.log('Call Statistics:', {
    total_calls: result.data.total_calls,
    connection_rate: result.data.connection_rate,
    average_duration: result.data.average_duration,
    by_type: result.data.by_type,
    by_outcome: result.data.by_outcome
  });
}
```

---

## 🎯 **Industry-Specific Examples**

### Example 8: Carrier Follow-up Call

```typescript
async function handleCarrierFollowUp(callData: any) {
  const callIntegration = new CRMCallIntegrationService('your-org-id');
  
  await callIntegration.createCallActivity({
    id: callData.id,
    contact_id: callData.contact_id,
    phone_number: callData.phone_number,
    call_direction: 'outbound',
    call_duration: callData.duration_seconds,
    call_outcome: 'connected',
    call_notes: `
      Carrier Follow-up:
      - DOT Number: ${callData.dot_number}
      - MC Number: ${callData.mc_number}
      - Available Equipment: ${callData.equipment_types}
      - Service Areas: ${callData.service_areas}
      - Insurance Status: ${callData.insurance_status}
      - Rate Agreement: ${callData.rate_discussion}
    `,
    agent_id: callData.agent_id,
    started_at: callData.started_at,
    ended_at: callData.ended_at,
    call_type: 'carrier_follow_up'
  });
}
```

### Example 9: Customer Service Call

```typescript
async function handleCustomerServiceCall(callData: any) {
  const callIntegration = new CRMCallIntegrationService('your-org-id');
  
  await callIntegration.createCallActivity({
    id: callData.id,
    contact_id: callData.contact_id,
    phone_number: callData.phone_number,
    call_direction: 'inbound',
    call_duration: callData.duration_seconds,
    call_outcome: 'connected',
    call_notes: `
      Customer Service Call:
      - Issue Type: ${callData.issue_type}
      - Load Number: ${callData.load_number}
      - Status: ${callData.issue_status}
      - Resolution: ${callData.resolution}
      - Customer Satisfaction: ${callData.satisfaction_rating}/5
    `,
    agent_id: callData.agent_id,
    started_at: callData.started_at,
    ended_at: callData.ended_at,
    call_type: 'customer_service'
  });
}
```

---

## 🔄 **Automated Workflows**

### Example 10: Complete Call-to-CRM Workflow

```typescript
class CallCRMWorkflow {
  private callIntegration: CRMCallIntegrationService;
  
  constructor(organizationId: string) {
    this.callIntegration = new CRMCallIntegrationService(organizationId);
  }
  
  async handleInboundCall(callData: any) {
    // 1. Create call activity
    const activity = await this.callIntegration.createCallActivity({
      ...callData,
      call_direction: 'inbound'
    });
    
    // 2. Find or create contact
    const contactMatch = await this.callIntegration.findContactByPhone(callData.phone_number);
    
    if (!contactMatch.contact_id) {
      // Create new contact if not found
      await this.createNewContact(callData);
    }
    
    // 3. Update lead score
    if (contactMatch.contact_id) {
      await this.callIntegration.crmService.calculateLeadScore(contactMatch.contact_id);
    }
    
    // 4. Create follow-up task if needed
    await this.createFollowUpTasks(callData, activity.id);
  }
  
  private async createNewContact(callData: any) {
    // Implementation for creating new contact
  }
  
  private async createFollowUpTasks(callData: any, activityId: string) {
    // Implementation for creating follow-up tasks
  }
}
```

### Example 11: Missed Call Handling

```typescript
async function handleMissedCall(callData: any) {
  const callIntegration = new CRMCallIntegrationService('your-org-id');
  
  // Create missed call activity
  await callIntegration.createCallActivity({
    id: callData.id,
    contact_id: callData.contact_id,
    phone_number: callData.phone_number,
    call_direction: 'inbound',
    call_duration: 0,
    call_outcome: 'no_answer',
    call_notes: 'Missed call - automatic callback scheduled',
    agent_id: null,
    started_at: callData.started_at,
    ended_at: callData.started_at,
    call_type: 'missed_call'
  });
  
  // This will automatically create a follow-up task
  console.log('Missed call logged and follow-up task created');
}
```

---

## 📈 **Analytics & Reporting**

### Example 12: Call Performance Dashboard

```typescript
async function generateCallPerformanceReport() {
  const callIntegration = new CRMCallIntegrationService('your-org-id');
  
  const stats = await callIntegration.getCallActivityStats(
    '2024-01-01T00:00:00Z',
    '2024-01-31T23:59:59Z'
  );
  
  return {
    totalCalls: stats.total_calls,
    connectionRate: stats.connection_rate.toFixed(2) + '%',
    averageDuration: stats.average_duration.toFixed(1) + ' minutes',
    callsByType: stats.by_type,
    callsByOutcome: stats.by_outcome,
    topPerformingAgents: stats.by_agent
  };
}
```

### Example 13: Real-time Call Monitoring

```typescript
class CallMonitoringService {
  private callIntegration: CRMCallIntegrationService;
  
  constructor(organizationId: string) {
    this.callIntegration = new CRMCallIntegrationService(organizationId);
  }
  
  async monitorCallActivity() {
    // Get today's call statistics
    const today = new Date().toISOString().split('T')[0];
    const stats = await this.callIntegration.getCallActivityStats(
      today + 'T00:00:00Z',
      today + 'T23:59:59Z'
    );
    
    // Alert if connection rate is too low
    if (stats.connection_rate < 50) {
      await this.sendAlert('Low connection rate detected', stats);
    }
    
    // Alert if average duration is too short
    if (stats.average_duration < 2) {
      await this.sendAlert('Short call duration detected', stats);
    }
  }
  
  private async sendAlert(message: string, stats: any) {
    // Implementation for sending alerts
    console.log(`🚨 Alert: ${message}`, stats);
  }
}
```

---

## 🔧 **Configuration & Setup**

### Example 14: Environment Configuration

```typescript
// config/call-integration.ts
export const callIntegrationConfig = {
  organizationId: process.env.ORGANIZATION_ID || 'default-org',
  webhookSecret: process.env.WEBHOOK_SECRET,
  autoCreateContacts: process.env.AUTO_CREATE_CONTACTS === 'true',
  followUpTaskDelay: parseInt(process.env.FOLLOW_UP_DELAY || '7200'), // 2 hours
  callRecordingRetention: parseInt(process.env.RECORDING_RETENTION || '2592000'), // 30 days
  enableCallAnalytics: process.env.ENABLE_CALL_ANALYTICS === 'true'
};
```

### Example 15: Integration with FreeSWITCH

```typescript
// FreeSWITCH event handler
import { callIntegrationConfig } from '../config/call-integration';

class FreeSWITCHIntegration {
  private callIntegration: CRMCallIntegrationService;
  
  constructor() {
    this.callIntegration = new CRMCallIntegrationService(
      callIntegrationConfig.organizationId
    );
  }
  
  async handleChannelHangup(event: any) {
    const callData = {
      id: event.uuid,
      phone_number: event.caller_id_number,
      call_direction: event.direction,
      call_duration: event.duration,
      call_outcome: this.mapHangupCause(event.hangup_cause),
      started_at: event.start_time,
      ended_at: event.end_time,
      agent_id: event.agent_id,
      call_type: this.determineCallType(event)
    };
    
    await this.callIntegration.createCallActivity(callData);
  }
  
  private mapHangupCause(cause: string): string {
    const mapping = {
      'NORMAL_CLEARING': 'connected',
      'NO_ANSWER': 'no_answer',
      'USER_BUSY': 'busy',
      'CALL_REJECTED': 'rejected'
    };
    return mapping[cause] || 'disconnected';
  }
  
  private determineCallType(event: any): string {
    // Logic to determine call type based on event data
    return 'customer_service';
  }
}
```

---

## 🎯 **Best Practices**

### 1. Error Handling
```typescript
async function robustCallIntegration(callData: any) {
  try {
    await callIntegration.createCallActivity(callData);
  } catch (error) {
    // Log error but don't fail the call
    console.error('CRM integration failed:', error);
    
    // Queue for retry
    await queueForRetry(callData);
  }
}
```

### 2. Performance Optimization
```typescript
// Batch process calls for better performance
async function processPendingCalls() {
  const pendingCalls = await getPendingCallsFromQueue();
  
  if (pendingCalls.length > 0) {
    await callIntegration.bulkCreateCallActivities(pendingCalls);
  }
}
```

### 3. Data Validation
```typescript
function validateCallData(callData: any): boolean {
  const required = ['id', 'phone_number', 'call_direction', 'call_duration'];
  return required.every(field => callData[field] !== undefined);
}
```

---

This comprehensive integration system ensures that every call interaction is automatically tracked in your CRM, providing complete visibility into customer communications and enabling data-driven decision making for your freight brokerage operations. 