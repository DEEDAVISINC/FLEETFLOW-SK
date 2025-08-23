/**
 * Twilio Call Status Webhook Handler
 * Receives call status updates and tracks call metrics per tenant
 */

import { NextRequest, NextResponse } from 'next/server';
import { callDatabaseService } from '../../services/CallDatabaseService';

interface TwilioStatusWebhook {
  CallSid: string;
  CallStatus: string;
  CallDuration?: string;
  From: string;
  To: string;
  Direction: string;
  Price?: string;
  PriceUnit?: string;
  EndTime?: string;
  StartTime?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse Twilio webhook data (form-encoded)
    const formData = await request.formData();
    const webhookData: TwilioStatusWebhook = {
      CallSid: formData.get('CallSid') as string,
      CallStatus: formData.get('CallStatus') as string,
      CallDuration: formData.get('CallDuration') as string,
      From: formData.get('From') as string,
      To: formData.get('To') as string,
      Direction: formData.get('Direction') as string,
      Price: formData.get('Price') as string,
      PriceUnit: formData.get('PriceUnit') as string,
      EndTime: formData.get('EndTime') as string,
      StartTime: formData.get('StartTime') as string,
    };

    console.log(`📞 Call Status Update:`, {
      callSid: webhookData.CallSid,
      status: webhookData.CallStatus,
      duration: webhookData.CallDuration,
      from: webhookData.From,
      to: webhookData.To,
      price: webhookData.Price,
    });

    // Update call record with final status
    await updateCallRecord(webhookData);

    // Send real-time updates to connected clients if needed
    await broadcastCallUpdate(webhookData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Call status webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function updateCallRecord(
  webhookData: TwilioStatusWebhook
): Promise<void> {
  try {
    // Determine tenant from phone number
    const tenantId = await callDatabaseService.getTenantFromPhoneNumber(
      webhookData.To
    );

    // Check if call record exists, create if not
    const existingRecords = await callDatabaseService.getCallRecords(
      tenantId,
      1,
      0
    );
    const existingRecord = existingRecords.find(
      (record) => record.call_sid === webhookData.CallSid
    );

    if (existingRecord) {
      // Update existing record
      await callDatabaseService.updateCallRecord(webhookData.CallSid, {
        status: webhookData.CallStatus,
        duration: parseInt(webhookData.CallDuration || '0'),
        cost: parseFloat(webhookData.Price || '0'),
        currency: webhookData.PriceUnit || 'USD',
        end_time: webhookData.EndTime,
      });
    } else {
      // Create new record
      await callDatabaseService.saveCallRecord(webhookData, tenantId);
    }

    console.log(`💾 Call Record Updated:`, {
      callSid: webhookData.CallSid,
      status: webhookData.CallStatus,
      duration: webhookData.CallDuration,
      cost: webhookData.Price,
    });
  } catch (error) {
    console.error('Failed to update call record:', error);
    throw error;
  }
}

async function broadcastCallUpdate(
  webhookData: TwilioStatusWebhook
): Promise<void> {
  // In production, this would use WebSockets or Server-Sent Events
  // to notify the phone dialer UI of call status changes

  const update = {
    type: 'call_status_update',
    callSid: webhookData.CallSid,
    status: webhookData.CallStatus,
    duration: webhookData.CallDuration,
    timestamp: new Date().toISOString(),
  };

  console.log(`📡 Broadcasting call update:`, update);

  // Broadcast to connected clients via Server-Sent Events
  try {
    const tenantId = await callDatabaseService.getTenantFromPhoneNumber(
      webhookData.To
    );

    const response = await fetch('/api/events/call-updates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenantId,
        event: 'call_status_update',
        data: { ...update, tenantId },
      }),
    });

    if (response.ok) {
      console.log(`✅ Call update broadcasted to tenant ${tenantId}`);
    }
  } catch (broadcastError) {
    console.warn('Failed to broadcast call update:', broadcastError);
  }
}
